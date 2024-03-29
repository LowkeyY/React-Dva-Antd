loadcss("lib.RowEditorGrid.RowEditor");
using("lib.RowEditorGrid.RowEditor");
using("bin.exe.manager.List");

// ProgramListInput
CPM.manager.ProgramListInput = Ext.extend(CPM.manager.List, {
			className : 'CPM.manager.ProgramListInput',
			programType : 'ProgramListInput',

			loadResult : function(result, panel, param) {
				panel=param || panel;
				
				if (panel.pageType == 'empty') {
					panel.el.unmask();
					return;
				}
				if (Ext.isDefined(panel) && Ext.isDefined(result.defaultValue)) {
					panel.defaultValue = result.defaultValue.data;
				}
				CPM.getModule(this.programType).getSuper().loadResult.call(
						this, result);
			},
/*
			load : function(mode, parentPanel, param) {
				this.getData(mode, param, function(result, model) {
							var panel;
							
							if (mode.indexOf("model") != -1) {
								CPM.addModel(param.objectId, model);
								panel = this.createModel(parentPanel, result, param);
								panel.loadResult(result,panel,param);
								panel.param = param;
							} else {
								if (param.moduleReady == false) {
									param.moduleReady = (function(data, p) {
										p.loadResult(data);
									}).createCallBackWithArgs(result);
								} else {
									var st = param.moduleReady.getStore();
									param.moduleReady.loadResult(result,param.moduleReady,param);
									delete param.moduleReady;
								//}
							}
						}.createDelegate(this));
			},
*/
			load : function(mode, parentPanel, param) {
				if (param.pageType == 'empty') {
					if (mode.indexOf("model") != -1) {
						mode = "model";
					} else {
						param.moduleReady = function(p) {
							p.el.unmask();
						};
						return;
					}
				}
				var sup = this.getSuper();
				sup.load.call(this, mode, parentPanel, param);
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
						if (edi.xtype == 'hidden') {
							cm[i].hidden = true;
						}
						edi.width = cm[i].width;
						cm[i].editor = Ext.ComponentMgr.create(edi, {
									xtype : 'textfield'
								});
					}
				}
			
				var cf = {
					loadResult : this.loadResult,
					defaultValue : json.defaultValue.data
				};
				idx = null;
				delete json.defaultValue;

				if (Ext.isObject(config))// 给子类预留
					Ext.apply(cf, config);
				var panel = this.getSuper().createModel.call(this, parentPanel,
						json, param, cf);
				return panel;
			},
			createColumnModel : function(json) {
				var cm = json.cm, tar = null;
				for (var i = 0; i < cm.length; i++) {
					if (typeof(cm[i].target) != 'undefined') {
						tar = cm[i].target;
						delete cm[i].target;
						break;
					}
				}
				cm.unshift(new Ext.grid.RowNumberer());
				cm = this.getSuper().createColumnModel(json);
				if (tar != null)
					cm.target = tar;
				return cm;
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
								Ext.apply(par,
										editor.grid.getStore().baseParams);
							}
							CPM.doAction({
										params : par,
										method : r.isNew ? "POST" : "PUT",
										success : function(response, option) {
											var p = editor.grid.param;
											var module = CPM
													.getModule(p.programType);
											module.updateData(editor.grid, p);
										},
										failure : function(response, option) {
											var p = editor.grid.param;
											var module = CPM
													.getModule(p.programType);
											module.updateData(editor.grid, p);
										}
									}, this);
						}, this);
				panel.rowEditor = rowEditor;

				// 解决empty状态
				panel.pageType = param.pageType;
				if (param.pageType == 'empty' && panel.tbar) {
					Ext.each(panel.tbar.items, function(btn) {
								btn.hidden = true;
							});

				}
				panel.store.on("beforeload", function() {
							return this.pageType != 'empty';
						}, panel);
				return this.getSuper().adjustPanel.call(this, panel, param,
						json);
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
			changePageType : function(panel, param) {
				var show = param.pageType != 'empty';
				var tbar = panel.getTopToolbar();
				tbar && tbar.items.each(function(item) {
							item.setVisible(show);
						}, this);
				if (!show) {
					panel.store.removeAll();
				}
				panel.pageType = param.pageType;
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
			updateData : function(panel, param) {
				if (panel.pageType != param.pageType) {
					this.changePageType(panel, param);
				}
				if (param.pageType == 'empty') {
					return;
				}
				this.getSuper().updateData.call(this, panel, param)
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
						panel.rowEditor.startEditing(panel.getStore()
								.indexOf(rec));
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
						CPM.getModule(panel.programType).appendNewRow(panel,
								data);
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
				}
			}
		});
