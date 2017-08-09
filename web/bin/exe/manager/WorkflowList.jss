using("bin.exe.manager.List");
CPM.manager.WorkflowList = Ext.extend(CPM.manager.List,{
	className : "CPM.manager.WorkflowList",
	programType : 'WorkflowList',
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return false;
	},
	load : function(mode, parentPanel, param) {
		if(!param.objectId)
			param.objectId=parentPanel.objectId;
		if(!param.instanceId){
			param.pageType=parentPanel.pageType;
			param.dataId=parentPanel.dataId;
			param.entryId=parentPanel.entryId;
			param.exportTab=parentPanel.exportTab;
			param.exportItem=parentPanel.exportItem;
			param.exportData=parentPanel.exportData;
			param.instanceId=parentPanel.instanceId;
			param.workflowId=parentPanel.workflowId;
			param.flowType=parentPanel.flowType;
			param.stepId=parentPanel.stepId;
		}
		this.getSuper().load.call(this,"model&data", parentPanel, param);
	},
	saveColumModel : function(id, objectId, programType) {
		var g = Ext.getCmp(id);
		var fields = new Array();
		var store = g.getStore();
		var csort = Ext.apply({}, store.getSortState());
		var u = store.baseParams.unit_tz_plugin;
		var haveUnit = false;
		var umap = {};
		if (u) {
			u = u.trim();
			if (u) {
				var arr = u.split(":");
				haveUnit = true;
				for (var i = 0; i < arr.length; i += 2) {
					umap[arr[i]] = arr[i + 1];
				}
			}
		}
		Ext.each(g.getColumnModel().config, function(c) {
					var obj = {
						name : c.header,
						width : c.width,
						hidden : (c.hidden) ? true : false
					}
					if (csort && csort.field == c.dataIndex) {
						obj.sorttype = csort.direction;
					}
					if (haveUnit && umap[c.dataIndex]) {
						obj.unit = umap[c.dataIndex];
					}
					fields.push(obj);
				});
		fields.shift();
		CPM.get({
					url : CPM.action,
					method : 'POST',
					params : {
						programType : programType,
						objectId : objectId,
						fields : Ext.encode(fields),
						sort : csort ? Ext.encode(csort) : csort
					},
					success : function() {
						CPM.removeModel(id);
					}
				});
	},
	createColumnModel : function(json){
		var cm = json.cm, tar = null;
		for (var i = 0; i < cm.length; i++) {
			if (typeof(cm[i].target) != 'undefined') {
				tar = cm[i].target;
				delete cm[i].target;
				break;
			}
		}
		if (json.modelPatch) {
			var len = Math.min(json.modelPatch.length, cm.length)
			for (var i = 0; i < len; i++) {
				Ext.apply(cm[i], json.modelPatch[i]);
			}
		}
		cm.unshift(new Ext.grid.RowNumberer());
		cm = new Ext.grid.ColumnModel(cm);
		if (tar != null)
			cm.target = tar;
		return cm;
	},
	fixPanel : function(panel, param, json){
		var fn = this.saveColumModel.createCallback(panel.id, param.objectId,
				this.programType);
		panel.on("columnresize", fn);
		panel.on("sortchange", fn);
		var cm = panel.getColumnModel()
		cm.on("widthchange", fn);
		cm.on("hiddenchange", fn);
		cm.on("columnmoved", fn);
		cm.on("columnlockchange", fn);
		if (json.haveUnit) {
			cm.on("headerchange", fn);
			if (json.unit_tz_plugin)
				panel.getStore().baseParams.unit_tz_plugin = json.unit_tz_plugin;
		}
		return panel;
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
	'%action' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var finishFn=function(){
					var cachePanel=panel.findParentByType(lib.CachedPanel.CachedPanel);
					if(cachePanel){
						cachePanel.returnFn();
						delete cachePanel.returnFn;
					}
				}
				CPM.getModule(panel.programType).authit(btn,finishFn);
			}
	},
	'%calculate' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var params = {};
				Ext.apply(params, panel.param);
				params['objectId'] = btn.button_class;
				var mask = new Ext.LoadMask(panel.ownerCt.getEl(), {
							msg : '正在进行中...'.loc(),
							msgCls : 'x-mask-loading'
						});
				mask.show();
				Ext.Ajax.request({
							url : '/bin/exe/caculate.jcp',
							params : params,
							method : 'post',
							timeout : 1800000,
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (ajaxResult.success) {
									if (btn.target.type == '0') {
										Ext.msg("info", '完成计算.'.loc());
									} else {
										CPM.replaceTarget(panel, panel.ownerCt,
												panel.param, btn.target);
									}
								} else {
									Ext.msg("error", '数据计算失败!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
								mask.hide();
							},
							failure : function(response, options) {
								mask.hide();
								Ext.msg("error", CPM
												.getResponeseErrMsg(response));
							}
						});
			}
		},
		'%new' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				CPM.replaceTarget(panel, panel.ownerCt, panel.param,btn.target);
			}
		},
		'%edit' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (typeof(rec) == 'undefined') {
					Ext.msg("error", '请选择要编辑的行.'.loc());
					return;
				}
				var p = Ext.applyIf({
					dataId : rec.get("pmk"),
					exportData: rec.get("pmk")
				}, panel.param);
				CPM.replaceTarget(panel, panel.ownerCt, p, btn.target);
			}
		},
		'%copy' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (typeof(rec) == 'undefined') {
					Ext.msg("error", '请选择要复制的行.'.loc());
					return;
				}
				var p = Ext.applyIf({
							pageType : 'copy',
							dataId : rec.get("pmk")
						}, panel.param);
				CPM.replaceTarget(panel, panel.ownerCt, p, btn.target);
			}
		},
		'%delete' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelections();
				if (rec.length == 0) {
					Ext.msg("error", '请选择要删除的行.'.loc());
					return;
				}
				var p = panel.param;

				var pmks = new Array();
				for (var i = 0; i < rec.length; i++) {
					pmks.push(rec[i].get("pmk"));
				}
				Ext.msg("confirm", '确定删除选择的记录?'.loc(), function(answer) {
							if (answer == 'yes') {
								var module = CPM.getModule(p.programType);
								CPM.doAction({
											params : {
												data : pmks.join(","),
												objectId : p.objectId,
												programType : module.programType
											},
											method : 'DELETE',
											success : function(form, action) {
												module.updateData(panel, p);
												if (btn.target.targets) {
													CPM.replaceTarget(panel,
															panel.ownerCt, p,
															btn.target);
												}
											}
										}, this);
							}
						}.createDelegate(this));
			}
		},
		'%excel' : {
			handler : function(btn) {
				try {
					var m = Ext.getCmp(btn.panelId);
					var cm = m.getColumnModel();

					var arrayWidth = new Array(cm.getColumnCount());
					var arrayHead = new Array(cm.getColumnCount());

					for (var i = 0; i < cm.getColumnCount(); i++) {
						if (!cm.isHidden(i)) {
							arrayWidth[i] = cm.getColumnWidth(i);
							arrayHead[i] = cm.getColumnHeader(i);
						}
					}
					var param = {
						widths : arrayWidth.join(","),
						programType : m.param.programType,
						heads : arrayHead.join(","),
						start : 0,
						objectId : m.param.objectId,
						limit : m.getStore().getTotalCount()
					};
					Ext.apply(param, m.filters.buildQuery(m.filters
									.getFilterData()));

					var sortState = m.getStore().getSortState();
					if (sortState != undefined) {
						param.sort = sortState.field;
						param.dir = sortState.direction;
					}
					CPM.popWin('/bin/exe/downExcel.jcp?', param);
				} catch (e) {
					Ext.msg("error", e);
				}
			}
		},
		'%download' : {
			handler : function(btn) {
				var m = Ext.getCmp(btn.panelId);
				var param = {
					programType : m.param.programType,
					objectId : m.param.objectId
				}
				CPM.popWin('/bin/exe/downCsv.jcp', param);
			}
		},
		'%upload' : {
			handler : function(btn) {
				var m = Ext.getCmp(btn.panelId);
				using("bin.exe.upLoadCsv");
				var width = 350;
				var height = 120;
				var setParam = new bin.exe.upLoadCsv(width, height, m);
				setParam.show();
			}
		},
		'%chart' : {
			handler : function(btn) {
				var panel = Ext.getCmp(this.formId);
				panel.mgr.loadDefault();
				panel.mgr.changeState('new');
			}
		},
		'%map' : {
			handler : function(btn) {
				var panel = Ext.getCmp(this.formId);
				panel.mgr.loadDefault();
				panel.mgr.changeState('new');
			}
		}
	}
});
