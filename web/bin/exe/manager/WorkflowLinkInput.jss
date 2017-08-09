loadcss("lib.RowEditorGrid.RowEditor");
using("lib.RowEditorGrid.RowEditor");
using("bin.exe.manager.Input");

CPM.manager.WorkflowLinkInput = Ext.extend(CPM.manager.Input, {
	programType : 'WorkflowLinkInput',
	className : 'CPM.manager.WorkflowLinkInput',
	updateData : function(panel, param) {
		this.getData("data", param, function(result) {
					panel.form.setValues(result.data);
					panel.mgrid.getStore().loadData(result.subData);
					panel.param = param;
				}.createDelegate(this));
	},
	load : function(mode, parentPanel, param) {
		if (!param.objectId)
			param.objectId = parentPanel.objectId;

		if (!param.instanceId) {
			param.pageType = parentPanel.pageType;
			param.dataId = parentPanel.exportData;
			param.entryId = parentPanel.entryId;
			param.exportTab = parentPanel.exportTab;
			param.exportItem = parentPanel.exportItem;
			param.exportData = parentPanel.exportData;
			param.instanceId = parentPanel.instanceId;
			param.workflowId = parentPanel.workflowId;
			param.flowType = parentPanel.flowType;
			param.stepId = parentPanel.stepId;
		}
		this.getData(mode, param, function(result, model) {
					var panel;
					if (mode.indexOf("model") != -1) {
						CPM.addModel(param.objectId, model);
						panel = this.createModel(parentPanel, result, param);
						panel.form.setValues(result.data);
						panel.mgrid.getStore().loadData(result.subData);
						panel.param = param;
					} else {
						if (param.moduleReady == false) {
							param.moduleReady = (function(p, result) {
								p.form.setValues(result.data);
								p.mgrid.getStore().loadData(result.subData);
							}).createCallBackWithArgs(result);
						} else {
							var p = param.moduleReady;
							p.form.setValues(result.data);
							if (result.subData)
								p.mgrid.getStore().loadData(result.subData);
							delete param.moduleReady;
						}
					}
				}.createDelegate(this));
	},

	createModel : function(parentPanel, json, param) {
		if (json.imports || json.subImports) {
			eval(json.imports + ";" + json.subImports);
		}
		var id = this.programType + param.objectId;
		if (param.pageType == 'view' || param.pageType == 'edit') {
			var condition = (param.pageType == 'view') ? "xtype" : "pkmark";
			var fn = function(c) {
				if (c.items) {
					Ext.each(c.items, fn);
				} else if (c[condition]) {
					if (c.xtype != 'hidden') {
						c.oldXtype = c.xtype;
						c.xtype = 'viewfield';
					}
				}
			}
			Ext.each(json.model, fn);
		}
		var cm = json.cm;
		for (var i = 0; i < cm.length; i++) {
			if (cm[i].editor){
				cm[i].editor = Ext.ComponentMgr.create(cm[i].editor, {
							xtype : 'textfield'
						});
				cm[i].header=cm[i].editor.fieldLabel;
			}
		}
		var store = new Ext.data.JsonStore({
					url : this.url,
					method : 'GET',
					root : 'data',
					autoLoad : false,
					fields : json.fields
				});

		var gridPlugins = [];

		var tbar;

		if (param.pageType == 'view') {
			cm.unshift(new Ext.grid.RowNumberer());
		} else {
			var rowEditor = new Ext.ux.grid.RowEditor({
						clicksToEdit : 2,
						errorSummary : false,
						disablePrimaryKey : function(dis) {
							Ext.each(this.items.items, function(f) {
										f.pkmark && f.setDisabled(dis)
									});
						}
					})
			rowEditor.on("canceledit", function(editor) {
						if (editor.isNew)
							this.remove(editor.record);
					}, store);
			gridPlugins.push(rowEditor);
			tbar = [{
						text : '添加',
						icon:'/themes/icon/all/add.gif',
						panelId : id,
						handler : this.appendRow
					}, {
						icon:'/themes/icon/all/edit.gif',
						text : '修改',
						panelId : id,
						handler : this.editRow
					}, {
						text : '删除',
						icon:'/themes/icon/all/delete.gif',
						panelId : id,
						handler : this.deleteRow
					}];
		}

		var panel = {
			layout : 'border',
			title : param.title,
			border : false,
			id : id,
			items : [{
						border : false,
						xtype : 'form',
						region : 'north',
						id : id + "_form",
						height : 300,
						head : false,
						items : json.model,
						bodyStyle : "padding:20px 0 0 40px;overflow-y:auto;"
					}, {
						xtype : 'grid',
						tbar : tbar,
						plugins : gridPlugins,
						rowEditor : gridPlugins[0],
						defaultValue : json.subDefault.data,
						columns : cm,
						border : true,
						enableHdMenu : false,
						stripeRows : true,
						store : store,
						showDirtyMark : false,
						id : id + "_grid",
						region : 'center',
						head : false,
						objectId : param.objectId,
						iconCls : 'icon-grid',
						programType : param.programType,
						fields : json.fields
					}],
			objectId : param.objectId,
			programType : param.programType
		}

		if (Ext.isArray(json.formEvent)) {
			var e = json.formEvent;
			panel.listeners = {};
			for (var i = 0; i < e.length; i++) {
				if (e[i][0] == '') {
					if (e[i][1] == 'beforeinit') {
						if (e[i][2].call(this, panel, json, param, parentPanel) === false) {
							return;
						}
						continue;
					}
					panel.listeners[e[i][1]] = e[i][2];
				}
			}
		}
		var ja = json.buttonArray;
		if (typeof(ja) != 'undefined' && ja != null && ja.length > 0) {
			var btns = new Array(), cb = null;
			for (var i = 0; i < ja.length; i++)
				if (ja[i].state == param.pageType || ja[i].state == 'all') {
					cb = this.getButton(ja[i], id);
					btns.push((cb == null) ? ja[i] : cb);
				}
			panel.tbar = btns;
		}
		panel = parentPanel.add(panel);
		parentPanel.doLayout();
		panel.mform = Ext.getCmp(panel.items.get(0).id);
		panel.form = panel.mform.form;
		panel.mgrid = Ext.getCmp(panel.items.get(1).id);

		cm = panel.mgrid.getColumnModel();
		var conf = cm.config;
		for (var i = 0; i < conf.length; i++) {

			if (conf[i].renderer == Ext.util.Format.extractText) {
				var field = cm.getCellEditor(i).field;
				field.getOldValue=field.getValue;
				field.getValue = function() {
					if (this.xtype == 'hidden') {
						return this.startValue;
					}
					var el = this.el;
					var btext = (this.getText)
							? this.getText()
							: el.getValue();
					var bval = this.getOldValue();
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
					// this.record.data[this.name] = this.startValue = "";
					return ec;
				}
			}
		}
		return panel;
	},
	editRow : function(btn) {
		var panel = Ext.getCmp(btn.panelId + "_grid");
		if (panel.rowEditor.editing) {
			Ext.msg("warn", '已被锁定,请取消编辑状态后继续'.loc());
			return;
		}
		var rec = panel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			Ext.msg("warn", '请选择要修改的行.'.loc());
			return;
		}
		var idx = panel.store.indexOf(rec[0]);
		panel.rowEditor.startEditing(idx);
		panel.rowEditor.isNew = false;
		panel.rowEditor.disablePrimaryKey(true);
	},
	deleteRow : function(btn) {
		var panel = Ext.getCmp(btn.panelId + "_grid");
		if (panel.rowEditor.editing) {
			Ext.msg("warn", '已被锁定,请取消编辑状态后继续'.loc());
			return;
		}
		var rec = panel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			Ext.msg("warn", '请选择要删除的行.'.loc());
			return;
		}
		panel.store.remove(rec);
	},
	appendRow : function(btn) {
		var panel = Ext.getCmp(btn.panelId + "_grid");
		if (panel.rowEditor.editing) {
			Ext.msg("warn", '已被锁定,请取消编辑状态后继续'.loc());
			return;
		}
		var st = panel.getStore();
		if (st.recordType) {
			var rec = new st.recordType(Ext.apply({
						pmk : ''
					}, panel.defaultValue));
			var pos=st.getCount();
			st.insert(pos, rec);
			panel.rowEditor.startEditing(pos);
			panel.rowEditor.isNew = true;
			panel.rowEditor.disablePrimaryKey(false);
		}
	},
	authit : function(btn, authFunction) {
		var panel = Ext.getCmp(btn.panelId);
		panel.param['buttonId'] = btn.sequence;
		var paramString = Ext.urlEncode(panel.param);
		CPM.get({
					method : 'GET',
					url : '/bin/workflow/buttonaction.jcp?' + paramString,
					success : function(response, options) {
						var actionJson = Ext.decode(response.responseText);
						var panel = Ext.getCmp(btn.panelId);
						var newParams = {};
						newParams = panel.param;
						newParams['actionId'] = actionJson.actionId;
						if (actionJson.actionId != 0) {
							newParams['isComment'] = actionJson.isComment;
							if (actionJson.isComment == 'true') {
								using("bin.workflow.AuthWindow");
								var authWin = new bin.workflow.AuthWindow(
										newParams, panel, authFunction);
								authWin.show();
							} else {
								Ext.Ajax.request({
											url : '/bin/workflow/authit.jcp',
											params : newParams,
											method : 'POST',
											success : function(response,
													options) {
												authFunction();
											}
										});
							}
						} else {
							authFunction();
						}
					}
				}, true);
	},
	buttonMap : {
		'%audit' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				if (panel.form.isValid()) {
					panel.param['buttonId'] = btn.sequence;
					panel.param['action'] = btn.action;
					var paramString = Ext.urlEncode(panel.param);
					CPM.get({
						method : 'GET',
						url : '/bin/workflow/buttonaction.jcp?' + paramString,
						success : function(response, options) {

							var actionJson = Ext.decode(response.responseText);
							panel.param['actionId'] = actionJson.actionId;

							var p = Ext.apply({
										_method : (btn.state == 'new')
												? 'POST'
												: 'PUT'
									}, panel.param)

							panel.mgrid.stopEditing(true);
							var m = CPM.getModule(panel.param.programType);
							var rec = panel.mgrid.getStore().getRange();
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
							p.resultArray = Ext.encode(ppm);

							CPM.doAction({
								form : panel.form,
								params : p,
								method : 'POST',
								success : function(form, action) {
									Ext.msg("info", '申请提交成功'.loc());
									var cachePanel = panel
											.findParentByType(lib.CachedPanel.CachedPanel);
									if (cachePanel
											&& typeof(cachePanel.returnFn) == 'function') {
										cachePanel.returnFn();
										delete cachePanel.returnFn;
									}
								}
							}, this);
						}
					}, true);
				}
			}
		},
		'%return' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				if (btn.target.type == 0) {
					var cachePanel = panel
							.findParentByType(lib.CachedPanel.CachedPanel);
					if (cachePanel && typeof(cachePanel.returnFn) == 'function') {
						cachePanel.returnFn();
						delete cachePanel.returnFn;
					}
				} else {
					CPM.replaceTarget(panel, panel.ownerCt, panel.param,
							btn.target);
				}
			}
		},
		'%flowsteps' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				using("bin.workflow.StepPanel");
				var stepWindow = new bin.workflow.StepPanel({
							params : panel.param
						});
				stepWindow.show();
			}
		},

		'%flowstatus' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var cachePanel = panel
						.findParentByType(lib.CachedPanel.CachedPanel);
				var loadWorkflow = function() {
					using("bin.workflow.StatusPanel");
					var newParams = {};
					newParams = panel.param;
					newParams.retFn = function(main) {
						cachePanel.hideStatus();
						var params = {};
						params['flowType'] = newParams.flowType;
						params['workflowId'] = newParams.workflowId;
						params['instanceId'] = newParams.instanceId;
						params['entryId'] = newParams.entryId;
						params['stepId'] = newParams.stepId;
						Ext.Ajax.request({
							url : '/bin/workflow/flowframe.jcp',
							params : params,
							method : 'GET',
							success : function(response, options) {
								var moduleJson = Ext
										.decode(response.responseText);
								var panels = CPM.Frame.getFrame(moduleJson);
								var panel = new Ext.Panel({
											layout : 'border',
											border : false,
											items : panels
										});
								if (moduleJson.modType * 1 == 3) {
									for (i = 0; i < panels.length; i++) {
										var p = panels[i];
										var pa = p.items ? (Ext
												.isArray(p.items)
												? p.items[0]
												: p.items) : p;
										var param = {
											flowType : newParams.flowType,
											stepId : newParams.stepId,
											entryId : newParams.entryId,
											pageType : pa.pageType,
											workflowId : pa.workflowId,
											objectId : pa.objectId,
											instanceId : pa.instanceId,
											programType : pa.programType,
											exportTab : pa.exportTable,
											exportItem : pa.exportItem,
											exportData : pa.exportData,
											dataId : pa.dataId
										};
										var frameIndex = p.frameIndex;
										for (var i in frameIndex) {
											var np = Ext.getCmp(frameIndex[i]);
											np.on("afterlayout", function(
															cpanel) {
														if (!cpanel.isPrgLoaded) {
															cpanel.isPrgLoaded = true;
															cpanel.loadProgram
																	.defer(
																			10,
																			cpanel,
																			[
																					param,
																					true]);
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
					Workflow.mainPanel
							.setActiveTab(Workflow.statusPanel.MainTabPanel);
					Workflow.params = newParams;
					Workflow.statusPanel.init();
				}.createDelegate(this);
				if (Ext.isIE) {
					useJS(	["/dev/workflow/mxclient-ie.js",
									"/dev/workflow/mxApplication.js"],
							loadWorkflow);
				} else {
					useJS(	["/dev/workflow/mxclient-ff.js",
									"/dev/workflow/mxApplication.js"],
							loadWorkflow);
				}
			}
		},
		'%delentry' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var newParams = {};
				newParams = panel.param;
				Ext.Ajax.request({
							url : '/bin/workflow/flowmanage.jcp',
							params : newParams,
							method : 'GET',
							success : function(response, options) {
								var panel = Ext.getCmp(btn.panelId);
								var cachePanel = panel
										.findParentByType(lib.CachedPanel.CachedPanel);
								if (cachePanel) {
									cachePanel.returnFn();
									delete cachePanel.returnFn;
								}
							}
						});
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
									Ext.msg("error", '数据计算失败!,原因:'.loc()
													+ '<br>'
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
				var finishFn = function() {
					var p = Ext.applyIf({
								dataId : '',
								pageType : 'new'
							}, panel.param);
					CPM.getModule(panel.programType).changePageType(panel,
							panel.ownerCt, p);
				}
				CPM.getModule(panel.programType).authit(btn, finishFn);
			}
		},
		'%edit' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var finishFn = function() {
					var p = Ext.applyIf({
								pageType : 'edit'
							}, panel.param);
					CPM.getModule(panel.programType).changePageType(panel,
							panel.ownerCt, p);
				}
				CPM.getModule(panel.programType).authit(btn, finishFn);
			}
		},
		'%copy' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var finishFn = function() {
					var p = Ext.applyIf({
								pageType : 'copy'
							}, panel.param);
					CPM.getModule(panel.programType).changePageType(panel,
							panel.ownerCt, p);
				}
				CPM.getModule(panel.programType).authit(btn, finishFn);
			}
		},
		'%save' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var finishFn = function() {
					if (panel.form.isValid()) {
						var p = Ext.apply({
									_method : (btn.state == 'new')
											? 'POST'
											: 'PUT'
								}, panel.param)
						CPM.doAction({
									form : panel.form,
									params : p,
									method : 'POST',
									success : function(form, action) {
										Ext.msg("info", '保存成功'.loc());
										if (action.result
												&& action.result.dataId)
											panel.param.dataId = action.result.dataId;
										if (btn.target.targets) {
											CPM.replaceTarget(panel,
													panel.ownerCt, panel.param,
													btn.target);
										}
									}
								}, this);
					}
				}
				CPM.getModule(panel.programType).authit(btn, finishFn);
			}
		},
		'%delete' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var finishFn = function() {
					var p = panel.param;
					CPM.doAction({
								params : {
									programType : p.programType,
									data : p.dataId,
									objectId : p.objectId
								},
								method : 'DELETE',
								success : function(form, action) {
									Ext.msg("info", '删除成功'.loc());
									if (btn.target.targets) {
										CPM.replaceTarget(panel, panel.ownerCt,
												p, btn.target);
									}
								}
							}, this);
					var cachePanel = panel
							.findParentByType(lib.CachedPanel.CachedPanel);
					if (cachePanel) {
						cachePanel.returnFn();
						delete cachePanel.returnFn;
					}
				}
				CPM.getModule(panel.programType).authit(btn, finishFn);
			}
		},
		'%action' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var finishFn = function() {
					var cachePanel = panel
							.findParentByType(lib.CachedPanel.CachedPanel);
					if (cachePanel) {
						cachePanel.returnFn();
						delete cachePanel.returnFn;
					}
				}
				CPM.getModule(panel.programType).authit(btn, finishFn);
			}
		}
	}
});