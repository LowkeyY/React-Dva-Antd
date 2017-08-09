using("bin.exe.manager.List");
// loadcss("lib.RowEditorGrid.ListInput");
// using("lib.RowEditorGrid.RowEditorGrid");
// 未写LockingGridEditor
// loadcss("lib.LockingGrid.LockingGrid");
// using("lib.LockingGrid.LockingGrid");

// WorkflowCrossInput
CPM.manager.WorkflowCrossInput = Ext.extend(CPM.manager.List, {
			className : 'CPM.manager.WorkflowCrossInput',
			programType : 'WorkflowCrossInput',
			updateData : function(panel, param) {
				this.getSuper().updateData.call(this, panel, param)
				panel.param = param;
			},
			createModel : function(parentPanel, json, param, config) {
				if (json.imports)
					eval(json.imports);
				delete json.imports;
				var eds = json.inputEditors;
				var idx = {};
				for (var i = 0; i < eds.length; i++) {
					idx[eds[i].name] = eds[i];
				}
				delete json.inputEditors;
				var cm = json.cm;
				var lockfield = json.LockField;
				
				for (var i = 0, fld = json.fields; i < fld.length; i++) {
					if (typeof(lockfield[fld[i].name]) != 'undefined') {
						fld[i].type = "auto";
					}
				}
				
				for (var i = 0; i < cm.length; i++) {
					cm[i].sortable = false;
					if (typeof(lockfield[cm[i].dataIndex]) != 'undefined') {
						cm[i].locked = true;
						cm[i].renderer = function(val) {
							return (typeof(val) == 'object') ? val.text : val;
						}
					}
					var edi = idx[cm[i].dataIndex];
					if (typeof(edi) != 'undefined') {
						if (edi.xtype == 'hidden') {
							cm[i].hidden = true;
						} else if (edi.xtype == 'viewfield' || cm[i].locked) {// todo
																				// viewfield是不是要转
							edi.oldXtype = edi.xtype;
							edi.xtype = 'hidden';
						}
						cm[i].editor = Ext.ComponentMgr.create(edi, {
									xtype : 'textfield'
								});
						delete idx[cm[i].dataIndex];
					} else {
						Ext.msg("error", '录入界面与列表界面设置不一致.请重新设置'.loc());
						throw new Error(0);
					}
				}
				var cf = {
					xtype : "editorgrid",
					clicksToEdit : 1,
					enableColumnResize : false,
					enableColumnHide : false,
					enableColumnMove : false,
					bbar : false,
					defaultValue : json.defaultValue,
					fields : json.fields
				};
				if (typeof(config) != 'undefined')
					Ext.apply(cf, config);
				json.filters = [];
				var panel = this.getSuper().createModel.call(this, parentPanel,	json, param, cf);

				cm = panel.getColumnModel();

				var conf = cm.config;
				for (var i = 1; i < conf.length; i++) {
					if (conf[i].renderer == Ext.util.Format.extractText) {
						var editor = cm.getCellEditor(i);
						editor.getValue = function() {
							if (this.field.xtype == 'hidden') {
								return this.startValue;
							}
							var el = this.field.el;
							var btext = (this.field.getText) ? this.field
									.getText() : el.getValue();
							var bval = this.field.getValue();
							if (typeof(btext) == 'undefined') {
								el = el.child("input[type!=hidden]", true);
								if (typeof(el) == 'undefined') {
									btext = bval;
								} else {
									btext = el.value;
								}
							}
							var ec = {
								text : btext,
								value : bval,
								toString : function() {
									return this.text + this.value
								}
							}
							this.record.data[this.field.name] = this.startValue = "";
							return ec;
						}
					}
				}
				/*
				 * panel.on("beforeedit", function(e) { if (e.record.data["pmk"] !=
				 * "") { var cm = e.grid.getColumnModel().config; var field =
				 * cm[e.column].editor.field; if (field.xtype == 'hidden' ||
				 * field.pkmark) { return false; } } return true; })
				 */
				return panel;
			},
			load : function(mode, parentPanel, param){
				if (mode == "data") {
					var model = Ext.decode(CPM.ModelCache[param.objectId]);
					if (typeof(model.modelPatch) != 'undefined') {
						if (model.haveUnit){
							var patch=model.modelPatch;
							var u=new Array();
							for(var i=0;i<patch.length;i++){
								if(patch[i].unit){
									u.push(model.cm[i].dataIndex);
									u.push(patch[i].unit);
								}
							}
							if(u.length>0)
								param.unit_tz_plugin = u.join(":");
						}
						if (typeof(model.sortInfo) == 'object') {
							param.sort=model.sortInfo.field;
							param.dir=model.sortInfo.direction;
						}
					}
				}

				if(!param.objectId)
					param.objectId=parentPanel.objectId;

				if(!param.instanceId){
					param.pageType=parentPanel.pageType;
					param.dataId=parentPanel.dataId;
					param.entryId=parentPanel.entryId;
					param.exportTab=parentPanel.exportTable;
					param.exportItem=parentPanel.exportItem;
					param.exportData=parentPanel.exportData;
					param.instanceId=parentPanel.instanceId;
					param.workflowId=parentPanel.workflowId;
					param.flowType=parentPanel.flowType;
					param.stepId=parentPanel.stepId;
				}
				this.getSuper().load.call(this,"model&data", parentPanel, param);
			},
			authit : function(btn,authFunction){
				var panel = Ext.getCmp(btn.panelId);
				panel.param['buttonId']=btn.sequence;
				var paramString=Ext.urlEncode(panel.param);
				CPM.get({
					method: 'GET',    
					url:'/bin/workflow/buttonaction.jcp?'+paramString,
					success:function(response,options){ 
						
						var actionJson=Ext.decode(response.responseText);
						var panel = Ext.getCmp(btn.panelId);
						var newParams={};
						newParams=panel.param;
						newParams['actionId']=actionJson.actionId;
						if(actionJson.actionId!=0){
							newParams['isComment']=actionJson.isComment;
							if(actionJson.isComment=='true'){
								using("bin.workflow.AuthWindow"); 
								var authWin=new bin.workflow.AuthWindow(newParams,panel,authFunction);
								authWin.show();
							}else{
								Ext.Ajax.request({
									url : '/bin/workflow/authit.jcp',
									params : newParams,
									method : 'POST',
									success : function(response, options){
										authFunction();
									}
								});
							}	
						}else{
							authFunction();
						}
					}
				},true);
			},
			getButton : function(btn, panelId) {
				//替换programType
				if(btn.target && btn.target.targets){
					Ext.each(btn.target.targets,function(target){
						if(target.programType.indexOf('Program')==0)
							target.programType='Workflow'+target.programType.substring(7);
					});
				}
				if (typeof(this.buttonMap[btn.action]) != 'undefined') {
					return CPM.mkButton(btn, panelId, this.buttonMap[btn.action], this);
				} else if (this.getSuper() != null) {
					return this.getSuper().getButton(btn, panelId);
				} else {
					return CPM.mkButton(btn, panelId, {});
				}
			},
			buttonMap : {
			'%audit':{
				handler : function(btn) {
					var panel = Ext.getCmp(btn.panelId);
					panel.param['buttonId']=btn.sequence;
					CPM.get({
						method: 'POST',   
						params : panel.param,
						url:'/bin/workflow/apply.jcp?',
						success:function(response,options){ 
							Ext.msg("info", '申请提交成功'.loc());
							var cachePanel=panel.findParentByType(lib.CachedPanel.CachedPanel);
							if(cachePanel && typeof(cachePanel.returnFn)=='function'){
								cachePanel.returnFn();
								delete cachePanel.returnFn;
							}
						}
					},true);
				}
			},
			'%return':{
				handler : function(btn) {
					var panel = Ext.getCmp(btn.panelId);
					var cachePanel=panel.findParentByType(lib.CachedPanel.CachedPanel);
					if(cachePanel && typeof(cachePanel.returnFn)=='function'){
						cachePanel.returnFn();
						delete cachePanel.returnFn;
					}
				}
			},
			'%flowstatus' : {
				handler : function(btn) {
					var panel = Ext.getCmp(btn.panelId);
					var cachePanel=panel.findParentByType(lib.CachedPanel.CachedPanel);
					var loadWorkflow=function(){              
						using("bin.workflow.StatusPanel");             
						var newParams={};
						newParams=panel.param;
						newParams.retFn = function(main){
							cachePanel.hideStatus();
							var params={};
							params['flowType']=newParams.flowType;
							params['workflowId']=newParams.workflowId;
							params['instanceId']=newParams.instanceId;
							params['entryId']=newParams.entryId;
							params['stepId']=newParams.stepId;
							Ext.Ajax.request({
								url : '/bin/workflow/flowframe.jcp',
								params : params,
								method : 'GET',
								success : function(response, options) {
									var moduleJson=Ext.decode(response.responseText);
									var panels=CPM.Frame.getFrame(moduleJson);
									var panel=new Ext.Panel({
										layout:'border',
										border:false,
										items:panels
									});
									if(moduleJson.modType*1==3){
										for(i=0;i<panels.length;i++){
											var p=panels[i];
											var pa=p.items?(Ext.isArray(p.items)?p.items[0]:p.items):p;
											var param={
													flowType:newParams.flowType,
													stepId:newParams.stepId,
													entryId:newParams.entryId,
													pageType:pa.pageType,
													workflowId:pa.workflowId,
													objectId:pa.objectId,
													instanceId:pa.instanceId,
													programType:pa.programType,
													exportTab:pa.exportTable,
													exportItem:pa.exportItem,
													exportData:pa.exportData,
													dataId:pa.dataId
											};		
											var frameIndex=p.frameIndex;
											for(var i in frameIndex){
												var np=Ext.getCmp(frameIndex[i]);
												np.on("afterlayout",function(cpanel){
													if(!cpanel.isPrgLoaded){
														cpanel.isPrgLoaded=true;
														cpanel.loadProgram.defer(10,cpanel,[param,true]);
													}
												})
											}
										}
									}
									cachePanel.add(panel);
									cachePanel.setActiveTab(panel);
								}
							});
						}.createCallback(Workflow.mainPanel);	
						Workflow.statusPanel = new bin.workflow.StatusPanel(newParams); 
						Workflow.mainPanel.add(Workflow.statusPanel.MainTabPanel);
						Workflow.mainPanel.setActiveTab(Workflow.statusPanel.MainTabPanel);
						Workflow.params=newParams;                    
						Workflow.statusPanel.init();
					}.createDelegate(this);
					if(Ext.isIE){
						useJS(
							["/dev/workflow/mxclient-ie.js","/dev/workflow/mxApplication.js"],loadWorkflow
						);
					}else{
						useJS(
							["/dev/workflow/mxclient-ff.js","/dev/workflow/mxApplication.js"],loadWorkflow
						);
					}
				}
			},
			'%delentry' : {
				handler : function(btn) {
					var panel = Ext.getCmp(btn.panelId);
					var newParams={};
					newParams=panel.param;
					Ext.Ajax.request({
						url : '/bin/workflow/flowmanage.jcp',
						params : newParams,
						method : 'GET',
						success : function(response, options) {
							var panel = Ext.getCmp(btn.panelId);
							var cachePanel=panel.findParentByType(lib.CachedPanel.CachedPanel);
							if(cachePanel){
								cachePanel.returnFn();
								delete cachePanel.returnFn;
							}
						}
					});
				}
			},
				'%new' : {
					handler : Ext.emptyFn
				},
				'%edit' : {
					handler : Ext.emptyFn
				},
				'%copy' : {
					handler : Ext.emptyFn
				},
				'%save' : {
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						panel.stopEditing(true);
						var rec = panel.getStore().getRange();
						if (rec.length == 0)
							return;
						var ppm = new Array();
						var len = rec.length, i = 0, d;
						for (; i < len; i++) {
							d = rec[i].data;
							ppm[i] = {};
							for (var nm in d) {
								if (typeof(d[nm]) == 'object') {
									if (d[nm] instanceof Date) {
										ppm[i][nm] = d[nm].format('Y/m/d');
									} else {
										ppm[i][nm] = d[nm].value;
									}
								} else {
									ppm[i][nm] = d[nm];
								}
							}
						}
						var p = panel.param;
						var module = CPM.getModule(p.programType);
						CPM.doAction({
									params : Ext.apply({
												save : Ext.encode(ppm)
											}, p),
									method : 'POST',
									scope : this,
									success : function(form, action) {
										module.updateData(panel, p);
										Ext.msg("info", '保存成功'.loc());
									}
								}, true);
					}
				},
				'%delete' : {
					scope : this,
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						var rec = panel.getSelectionModel()
						rec = rec.getSelectedCell();
						if (rec == null) {
							Ext.msg("error", '请选择要删除的行.'.loc());
							return;
						}
						var p = panel.param;
						rec = panel.getStore().getAt(rec[0]);
						var module = CPM.getModule(p.programType);

						CPM.doAction({
									params : {
										data : rec,
										objectId : p.objectId
									},
									method : 'DELETE',
									scope : this,
									success : function(form, action) {
										module.updateData(panel, p);
									}
								}, true);

					}
				}
			}
		});
