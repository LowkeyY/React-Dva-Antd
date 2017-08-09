Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
using("lib.MiscField.MiscField");
dev.report.base.dlg.InsertFunction = function(from, preselection) {
	//	dev.report.base.dlg.InsertFunction.parent.constructor.call(this);
		this.id = "wInsFnc_dlg_wnd";
		var that = this;
		var onBeforeDestroyDialog = function(panel) {
			insFuncForm.items.each(function(f) {
						f.purgeListeners();
						Ext.destroy(f)
					});
			insFuncForm.purgeListeners();
			insFuncForm.destroy();
			if (dev.report.base.app.environment.inputMode == dev.report.base.grid.GridMode.DIALOG) {
				dev.report.base.general.setInputMode(dev.report.base.app.lastInputModeDlg);
				dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
			}
		};
		var onBeforeShowDialog = function(panel) {
			getFunctionsList(Ext.getCmp("wInsFnc_category_cmb").getValue)
		};
		var onCategorySelect = function(combo, record, index) {
			getFunctionsList(combo.getValue())
		};
		var onRowSelect = function(selModel, rowIndex, record) {
			setFunctionDescriptions(record)
		};
		var getFunctionsList = function(category) {
			var functionsGrid = Ext.getCmp("wInsFnc_fns_grd");
			var gridSelModel = functionsGrid.getSelectionModel();
			functionsGrid.store.clearFilter();
			functionsGrid.store.sort("funcname")
			gridSelModel.selectFirstRow();
			if (gridSelModel.getCount() > 0) {
				setFunctionDescriptions(gridSelModel.getSelected())
			}
		};
		var activeFnc;
		var setFunctionDescriptions = function(record) {
			var i;
			var formulaText = record.get("funcsyntax");
			
			activeFnc = record.get("funcname");
			dev.report.base.app.selectedFormula = formulaText;
			var defPan = Ext.getCmp("funcdef");
			defPan.removeAll();
			defPan.add({
						html : formulaText,
						baseCls : "x-plain"
					});
			defPan.doLayout();
			var dscPan = Ext.getCmp("funcdesc");
			dscPan.removeAll();
			dscPan.add({
						html : record.get("funcdesc"),
						baseCls : "x-plain"
					});
			dscPan.doLayout()
		};
		var doInsertFunction = function() {
			var ffn = functions.lookup_func[activeFnc];
			var ff = functions.funcs[ffn];
			that.win.destroy();
			using("dev.report.base.dlg.FuncArgs");
			if (preselection && _pre.fn == activeFnc) {
				var funcArgs=new dev.report.base.dlg.FuncArgs(ff, from,preselection);
			} else {
				var funcArgs=new dev.report.base.dlg.FuncArgs(ff, from);
			}
		};

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "/dev/report/model/".concat(dev.report.base.i18n.L10n, ".json"),
				false);
		xhr.send(null);
		var functions = Ext.util.JSON.decode(xhr.responseText);

	//	functions.cats.unshift(["ALL", "All".localize()]);
		if (preselection) {
			var _pre = {
				fn : preselection.slice(1, preselection.indexOf("(")),
				args : preselection.slice(preselection.indexOf("(") + 1,
						preselection.lastIndexOf(")")).split(",")
			};
			var preffn = functions.lookup_func[_pre.fn];
			if (preffn > -1) {
				var preff = functions.funcs[preffn];
				var preCat = functions.lookup_cat[preff[0]] + 1;
				if (from.id == "fbar" && preselection) {
					using("dev.report.base.dlg.FuncArgs");
					var funcArgs=new dev.report.base.dlg.FuncArgs(preff, from, preselection);
					return false
				}
			} else {
				preselection = false
			}
		}
		var insFuncForm =  new Ext.FormPanel({
			baseCls : "x-plain",
			labelWidth : 110,
			labelAlign : "left",
			frame : true,
			bodyStyle : "padding:5px 5px 0",
			width : 400,
			defaultType : "textfield",
			buttonAlign : "right",
			header : false,
			monitorValid : true,
			items : [(this.cmpFocus = new Ext.form.ComboBox({
						xtype : "combo",
						id : "wInsFnc_category_cmb",
						fieldLabel : "Select a category".localize(),
						store : new Ext.data.SimpleStore({
									fields : ["catid", "catname"],
									data : functions.cats
								}),
						displayField : "catname",
						valueField : "catid",
						mode : "local",
						triggerAction : "all",
						listWidth : 260,
						width : 230,
						editable : false,
						allowBlank : false,
						selectOnFocus : false,
						tabIndex : 1,
						ctCls : dev.report.kbd.tags.NO_ANY,
						anchor : "100%",
						listeners : {
							render : function() {
								if (this.store.getTotalCount() > 0) {
									this.setValue(this.store.getAt((preCat)
											? preCat
											: 1).get("catid"))
								}
							},
							select : {
								fn : onCategorySelect,
								scope : this
							}
						}
					})), new lib.MiscField.MiscField({
						fieldLabel : "Select a function".localize(),
						id : "funcLabel"
					}), new Ext.grid.GridPanel({
						id : "wInsFnc_fns_grd",
						cls : "insfuncgrid",
						hideLabel : true,
						store : new Ext.data.SimpleStore({
									fields : ["funcname",
											"funcsyntax", "funcdesc"],
									data : functions.funcs
								}),
						columns : [{
									id : "functionname",
									header : "Functions".localize(),
									fixed : true,
									width : 350,
									resizable : false,
									sortable : true,
									dataIndex : "funcname"
								}],
						stripeRows : true,
						autoExpandColumn : "functionname",
						height : 150,
						width : 350,
						viewConfig : {
							forceFit : true
						},
						header : false,
						anchor : "100%",
						selModel : new Ext.grid.RowSelectionModel({
									singleSelect : true,
									listeners : {
										rowselect : {
											fn : onRowSelect,
											scope : this
										}
									}
								})
					}), new Ext.Panel({
				id : "funcdef",
				autoHeight : true,
				autoScroll : "auto",
				baseCls : "x-plain",
				style : "font-weight: bold; margin: 5px 0px; word-wrap: break-word;",
				items : [{
							html : "",
							baseCls : "x-plain"
						}]
			}), new Ext.Panel({
						id : "funcdesc",
						autoScroll : "auto",
						baseCls : "x-plain",
						items : [{
									html : "",
									baseCls : "x-plain"
								}]
					})]
		});
		this.win = new Ext.Window({
			id : "wInsFnc_dlg_wnd",
			title : (from.id == "control")
					? "Select Function".localize()
					: "Insert Function".localize(),
			cls : "wssdialog",
			layout : "fit",
			width : 400,
			height : 400,
			minWidth : 300,
			minHeight : 300,
			closeable : true,
			closeAction : "close",
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			items : [insFuncForm],
			listeners : {
				beforedestroy : {
					fn : onBeforeDestroyDialog,
					scope : this
				},
				beforeshow : {
					fn : onBeforeShowDialog,
					scope : this
				},
				show : function() {
					setTimeout(function() {
						dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
						dev.report.base.general
								.setInputMode(dev.report.base.grid.GridMode.DIALOG);
						that.cmpFocus.focus(true, 100);
						var grid = Ext.getCmp("wInsFnc_fns_grd");
						if (preselection) {
							var gi = grid.getStore().find("funcname", _pre.fn);
							grid.getSelectionModel().selectRow(gi);
							grid.getView().focusRow(gi)
						} else {
							grid.getSelectionModel().selectRow(0);
							grid.getView().focusRow(0)
						}
					})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			buttons : [new Ext.Button({
								text : "OK".localize(),
								id : "wInsFnc_ok_btn",
								handler : doInsertFunction,
								tabIndex : 3
							}),  new Ext.Button({
								text : "Cancel".localize(),
								id : "wInsFnc_cancel_btn",
								tabIndex : 4,
								handler : function() {
									if (from.id == "control") {
										Ext.getCmp("formatControlDialog")
												.show()
									}
									that.win.destroy()
								}
							})]
		});
		//this.setContext();
		this.win.show(this);
		getFunctionsList(Ext.getCmp("wInsFnc_category_cmb").getValue())
}
