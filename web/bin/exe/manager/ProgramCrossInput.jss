using("bin.exe.manager.List");

// ProgramCrossInput
CPM.manager.ProgramCrossInput = Ext.extend(CPM.manager.List, {
			className : 'CPM.manager.ProgramCrossInput',
			programType : 'ProgramCrossInput',
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
					fields : json.fields,
					beforeFilter : function(panel, eds, res) {
						panel.getStore().once("load", function(st, recs) {
							var result = {};
							for (var i = 0; i < eds.length; i++) {
								result[eds[i].name] = eds[i];
							}
							var cm = panel.getColumnModel();
							var conf = cm.config;
							for (var i = 1; i < conf.length; i++) {
								var name = conf[i].getCellEditor(i).field.name;
								if (conf[i].renderer == Ext.util.Format.extractText
										&& result[name]) {

									var sEditor = result[name];
									var val = sEditor.getValue();
									var text = Ext.isDefined(sEditor.getText)
											? sEditor.getText()
											: val;
									result[name] = {
										combinedValueGetted : true,
										text : text,
										value : val
									};
								}
							}
							for (var i in result) {
								if (result[i].combinedValueGetted) {
									delete result[i].combinedValueGetted;
								} else {
									result[i] = result[i].getValue();
								}
							}
							//var view = panel.getView();
							//view.markDirty = false;
							Ext.each(recs, function(rec) {
										rec.beginEdit();
										for (var i in result) {
											rec.set(i, result[i]);
										}
										rec.commit(true);
									})
							//view.markDirty = true;

						}, this);
					}
				};
				if (typeof(config) != 'undefined')
					Ext.apply(cf, config);
				json.filters = [];
				var panel = this.getSuper().createModel.call(this, parentPanel,
						json, param, cf);

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
			buttonMap : {
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
						panel.stopEditing(false);
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
										panel.getStore().commitChanges();
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
