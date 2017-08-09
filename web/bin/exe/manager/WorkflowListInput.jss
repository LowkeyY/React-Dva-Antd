loadcss("lib.RowEditorGrid.RowEditor");
using("lib.RowEditorGrid.RowEditor");
using("bin.exe.manager.List");

CPM.manager.WorkflowListInput = Ext.extend(CPM.manager.List, {
	className : 'CPM.manager.WorkflowListInput',
	programType : 'WorkflowListInput',
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return false;
	},
	loadResult : function(result, model, panel, param) {
		if (Ext.isDefined(panel) && Ext.isDefined(result.defaultValue)) {
			panel.defaultValue = result.defaultValue.data
		}
		CPM.getModule(this.programType).getSuper().loadResult
				.call(this, result);
	},
	createModel : function(parentPanel, json, param, config) {

		if (json.imports || json.subImports) {
			eval(json.imports + ";" + json.subImports);
		}
		var eds = json.inputEditors;
		var idx = {};
		for (var i = 0; i < eds.length; i++) {
			idx[eds[i].name] = eds[i];
		}
		delete json.inputEditors;
		var cm = json.cm;

		for (var i = 0, edi; i < cm.length; i++) {
			edi = idx[cm[i].dataIndex];
			delete idx[cm[i].dataIndex];
			if (typeof(edi) != 'undefined') {
				edi.width = cm[i].width;
				cm[i].hidden = (edi.xtype == 'hidden');
				cm[i].editor = Ext.ComponentMgr.create(edi, {
							xtype : 'textfield'
						});
			}
		}
		var cf = {
			defaultValue : json.defaultValue.data
		};

		idx = null;
		delete json.defaultValue;
		if (Ext.isObject(config))// 给子类预留
			Ext.apply(cf, config);
		var panel = this.getSuper().createModel.call(this, parentPanel, json,
				param, cf);
		return panel;
	},
	load : function(mode, parentPanel, param) {
		if (!param.objectId)
			param.objectId = parentPanel.objectId;
		if (!param.instanceId) {
			param.pageType = parentPanel.pageType;
			param.dataId = parentPanel.dataId;
			param.entryId = parentPanel.entryId;
			param.exportTab = parentPanel.exportTable;
			param.exportItem = parentPanel.exportItem;
			param.exportData = parentPanel.exportData;
			param.instanceId = parentPanel.instanceId;
			param.workflowId = parentPanel.workflowId;
			param.flowType = parentPanel.flowType;
			param.stepId = parentPanel.stepId;
		}
		this.getSuper().load.call(this, "model&data", parentPanel, param);
		CPM.removeModel(param.objectId);
	},
	adjustPanel : function(panel, param, json) {
		var rowEditor = new Ext.ux.grid.RowEditor({
					clicksToEdit : 2,
					errorSummary : false,
					disablePrimaryKey : function(dis) {
						Ext.each(this.items.items, function(f) {
									f.pkmark && f.setDisabled(dis)
								});
					}
				})
		panel.plugins.push(rowEditor);
		rowEditor.on(
				"afteredit",// 此处需要用before tz.
				function(editor, changes, r, rowIndex) {
					var par = Ext.apply({
								save : Ext.encode([r.data])
							}, editor.grid.param);
					if (editor.grid instanceof Ext.grid.GridPanel) {
						Ext.apply(par, editor.grid.getStore().baseParams);
					}
					CPM.doAction({
								params : par,
								method : r.isNew ? "POST" : "PUT",
								success : function(response, option) {
									var p = editor.grid.param;
									var module = CPM.getModule(p.programType);
									module.updateData(editor.grid, p);
								}
							}, this);
				}, this);
		panel.rowEditor = rowEditor;
		return panel;
	},
	fixPanel : function(panel, param, json) {
		panel.on("beforedestroy", function(p) {
					delete p.rowEditor;
					delete p.defaultValue;
				});

		panel.rowEditor.on("canceledit", function(editor) {
					var r = editor.record;
					if (r.isNew)
						this.getStore().remove(r);
				}, panel);
		return panel;
	},
	appendNewRow : function(panel, value) {
		if (panel.rowEditor.editing) {
			Ext.msg("warn", '已被锁定,请取消编辑状态后继续'.loc());
			return;
		}
		var st = panel.getStore();
		if (st.recordType) {
			var rec = new st.recordType(Ext.apply({
						pmk : ''
					}, value));
			rec.isNew = true;
			st.insert(0, rec);
			panel.rowEditor.startEditing(0);
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
	getButton : function(btn, panelId) {
		// 替换programType
		if (btn.target && btn.target.targets) {
			Ext.each(btn.target.targets, function(target) {
						if (target.programType.indexOf('Program') == 0)
							target.programType = 'Workflow'
									+ target.programType.substring(7);
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
		'%new' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				CPM.getModule(panel.programType).appendNewRow(panel,
						panel.defaultValue);
			}
		},
		'%edit' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (!Ext.isDefined(rec)) {
					Ext.msg("error", '请选择要编辑的行.'.loc());
					return;
				}
				panel.rowEditor.startEditing(panel.getStore().indexOf(rec));
				panel.rowEditor.disablePrimaryKey(true);
			}
		},
		'%copy' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (!Ext.isDefined(rec)) {
					Ext.msg("error", '请选择要复制的行.'.loc());
					return;
				}
				var data = Ext.apply({}, rec.data);
				delete data.pmk;
				CPM.getModule(panel.programType).appendNewRow(panel, data);
			}
		},
		'%delete' : function(btn, panelId) {
			this.getSuper().getButton(btn, panelId);
			btn.handler = btn.handler.createInterceptor(function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						if (panel.rowEditor.editing) {
							Ext.msg("warn", '已被锁定,请取消编辑状态后继续'.loc());
							return false;
						}
						return true;
					}, this);
			return btn;
		},
		'%audit' : {
			handler : function(btn) {
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

						CPM.get({
							method : 'POST',
							params : panel.param,
							url : '/bin/workflow/apply.jcp?',
							success : function(response, options) {
								Ext.msg("info", '申请提交成功'.loc());
								var cachePanel = panel
										.findParentByType(lib.CachedPanel.CachedPanel);
								if (cachePanel
										&& typeof(cachePanel.returnFn) == 'function') {
									cachePanel.returnFn();
									delete cachePanel.returnFn;
								}
							}
						}, true);
					}
				}, true);
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
		}
	}
});
