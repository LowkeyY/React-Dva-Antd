using("bin.exe.manager.Input");
CPM.manager.WorkflowInput = Ext.extend(CPM.manager.Input, {
	programType : 'WorkflowInput',
	className : 'CPM.manager.WorkflowInput',
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return false;
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
		this.getData(mode, param, function(result, model) {
					var panel = this.createModel(parentPanel, result, param);
					panel.form.setValues(result.data);
					panel.param = param;
				}, this);
	},
	reload : function(parentPanel, workflowId, instanceId) {
		Ext.Ajax.request({
					url : '/bin/workflow/flowframe.jcp',
					params : {
						workflowId : workflowId,
						instanceId : instanceId
					},
					method : 'GET',
					success : function(response, options) {

						var moduleJson = Ext.decode(response.responseText);
						var panels = CPM.Frame.getFrame(moduleJson);

						var panel = new Ext.Panel({
									layout : 'border',
									border : false,
									items : panels
								});

						if (moduleJson.modType * 1 == 3) {
							var p = panels[0];
							var pa = p.items ? (Ext.isArray(p.items)
									? p.items[0]
									: p.items) : p;
							var param = {
								pageType : pa.pageType,
								workflowId : pa.workflowId,
								objectId : pa.objectId,
								instanceId : pa.instanceId,
								programType : pa.programType,
								exportTable : pa.exportTable,
								exportItem : pa.exportItem,
								exportData : pa.exportData,
								dataId : pa.dataId
							};
							var frameIndex = p.frameIndex;
							for (var i in frameIndex) {
								var np = Ext.getCmp(frameIndex[i]);
								np.on("afterlayout", function(cpanel) {
											if (!cpanel.isPrgLoaded) {
												cpanel.isPrgLoaded = true;
												cpanel.loadProgram.defer(10,
														cpanel, [param, true]);
											}
										})
							}
						}

						parentPanel.returnFn = function() {
							var Workflow = parentPanel.frames.get('Workflow');
							parentPanel.remove(parentPanel.getComponent(0));
							Workflow.mainPanel.hideStatus();
							var applyPanel = new bin.workflow.ApplyPanel();
							Workflow.mainPanel.add(applyPanel.MainTabPanel);
							Workflow.mainPanel.setActiveTab("ApplyPanel");
							applyPanel.init();
							Workflow.mainPanel.setActiveTab("SendListPanel");
						};
						parentPanel.add(panel);
						parentPanel.setActiveTab(panel);
					}
				});
		parentPanel.remove(this, true);
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
		'%audit' : {
			handler : function(btn) {

				var panel = Ext.getCmp(btn.panelId);
				if (panel.form.isValid()) {
					if (panel.param.entryId != -1) {
						var p = Ext.apply({
									buttonId : btn.sequence,
									action : btn.action,
									actionId : btn.actionId,
									_method : (btn.state == 'new')
											? 'POST'
											: 'PUT'
								}, panel.param);
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
					} else {
						var p = Ext.apply({
									_method : (btn.state == 'new')
											? 'POST'
											: 'PUT'
								}, panel.param);
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
				var stepWindow=new bin.workflow.StepPanel({
					params:panel.param
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
				panel.param['action'] = btn.action;
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
								if (action.result && action.result.dataId) {
									panel.param.dataId = action.result.dataId;
									panel.param.exportTab = action.result.exportTab;
									panel.param.exportItem = action.result.exportItem;
									panel.param.exportData = action.result.exportData;
								}
								if (btn.target.targets) {
									CPM.replaceTarget(panel, panel.ownerCt,
											panel.param, btn.target);
								} else {
									var cachePanel = panel
											.findParentByType(lib.CachedPanel.CachedPanel);
									if (cachePanel
											&& typeof(cachePanel.returnFn) == 'function') {
										cachePanel.returnFn();
										delete cachePanel.returnFn;
									}
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