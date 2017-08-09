
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
using('dev.report.base.dlg.Dialog');
dev.report.base.dlg.InsertMacro =function(obj, from, callback) {
		this.id = "InsertMacro ";
		var that = this;
		dev.report.base.macro.list([this, openDialog_post, obj],
				dev.report.base.macro.listFmt.FLAT);
		function openDialog_post(listData, obj) {
			var thats = this;
			dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
			var obj = obj;
			var listData = listData;
			var macroNameLbl = new Ext.form.Label({
						text : "Macro name".localize().concat(":")
					});
			var macroNameTxf = new Ext.form.TextField({
				hideLabel : true,
				tabIndex : 1,
				width : 290,
				listeners : {
					focus : function() {
						if (functionListGrid.getSelectionModel().getCount() != 0) {
							this.setValue("");
							functionListGrid.getSelectionModel()
									.clearSelections();
							btnPanel.layout.setActiveItem(0);
							that.containers.btnPanel = btnPanel.items.items[0]
						}
					},
					blur : function() {
						if (!this.getValue()) {
							this.setValue(getDefaultMacroName())
						} else {
							var rowIndex = functionListGrid.store.find("name",
									this.getValue());
							if (rowIndex != -1) {
								functionListGrid.fireEvent("rowclick",
										functionListGrid, rowIndex);
								functionListGrid.getSelectionModel()
										.selectRow(rowIndex)
							}
						}
					}
				}
			});
			var functionListData = [];
			for (var i = 0; i < listData.length; i++) {
				functionListData.push([listData[i]])
			}
			var functionListStore = new Ext.data.SimpleStore({
						fields : [{
									name : "name"
								}],
						data : functionListData
					});
			var functionListGrid = new Ext.grid.GridPanel({
						store : functionListStore,
						columns : [{
									id : "company",
									header : "Function",
									width : 270,
									sortable : true,
									dataIndex : "name"
								}],
						sm : new Ext.grid.RowSelectionModel({
									singleSelect : true
								}),
						autoscroll : true,
						stripeRows : true,
						height : 200,
						width : 290,
						listeners : {
							rowclick : function(grid, rowIndex, e) {
								macroNameTxf.setValue(this.store
										.getAt(rowIndex).get("name"));
								btnPanel.layout.setActiveItem(1);
								that.containers.btnPanel = btnPanel.items.items[1]
							}
						}
					});
			var okBtn =  new Ext.Button({
						text : "OK".localize(),
						tabIndex : 101,
						handler : function() {
							onOK()
						}
					});
			var cancelBtn =  new Ext.Button({
						text : "Cancel".localize(),
						ctCls : dev.report.kbd.tags.NO_ENTER,
						tabIndex : 102,
						handler : function() {
							if (from == "widget") {
								Ext.getCmp("formatControlDialog").show()
							}
							that.win.close()
						}
					});
			var newBtn = new Ext.Button({
						text : "New".localize(),
						ctCls : dev.report.kbd.tags.NO_ENTER,
						tabIndex : 2,
						width : 70,
						handler : function() {
							onNew()
						}
					});
			var BRLbl = {
				html : "<br/>",
				baseCls : "x-plain"
			};
			var editBtn = new Ext.Button({
						text : "Edit".localize(),
						ctCls : dev.report.kbd.tags.NO_ENTER,
						tabIndex : 3,
						width : 70,
						handler : function() {
							onEdit()
						}
					});
			var btnPanel = new Ext.Panel({
						layout : "card",
						baseCls : "x-plain",
						style : "padding-left: 10px; padding-top: 8px;",
						activeItem : 0,
						items : [new Ext.Panel({
											layout : "form",
											border : false,
											baseCls : "x-plain",
											items : [newBtn]
										}), new Ext.Panel({
											layout : "form",
											border : false,
											baseCls : "x-plain",
											items : [editBtn]
										})]
					});
			var mainPanel = new Ext.Panel({
						layout : "absolute",
						baseCls : "x-plain",
						border : false,
						items : [new Ext.Panel({
									layout : "form",
									border : false,
									baseCls : "x-plain",
									x : 5,
									y : 10,
									width : 292,
									height : 250,
									items : [macroNameLbl, macroNameTxf,
											functionListGrid]
								}), {
							layout : "form",
							baseCls : "x-plain",
							x : 295,
							y : 18,
							height : 50,
							items : [btnPanel]
						}]
					});
			function initDlg() {
				preselectMacro()
			}
			function getDefaultMacroName() {
				return (obj.id) ? obj.name.concat("_",
						dev.report.base.wsel[obj.type].events[0].funcname) : obj.name
			}
			function preselectMacro() {
				var macro = (obj.id)
						? obj.macros[dev.report.base.wsel[obj.type].events[0].name]
						: false;
				if (macro) {
					var index = functionListGrid.store.find("name", macro);
					if (index >= 0) {
						setTimeout(function() {
									functionListGrid.fireEvent("rowclick",
											functionListGrid, index);
									functionListGrid.getSelectionModel()
											.selectRow(index)
								}, 50)
					} else {
						dev.report.base.general.showMsg("Application Error"
										.localize(),
								"macro_preselection_err_msg".localize(),
								Ext.MessageBox.ERROR)
					}
				} else {
					macroNameTxf.setValue(getDefaultMacroName())
				}
			}
			function onNew() {
				using("dev.report.base.dlg.InsertMacro");
				var insertMacro=new dev.report.base.dlg.InsertMacro({
									operation : "new",
									macro : macroNameTxf.getValue()
								}, refresh);
			}
			function onEdit() {
				using("dev.report.base.dlg.InsertMacro");
				var insertMacro=new dev.report.base.dlg.InsertMacro({
									operation : "edit",
									macro : macroNameTxf.getValue()
				}, refresh);
			}
			function onOK() {
				if (validate()) {
					var macro = macroNameTxf.getValue();
					var key = (obj.id)
							? dev.report.base.wsel[obj.type].events[0].name
							: obj.type;
					var macros = {};
					macros[key] = macro;
					var toSet = {
						id : obj.id,
						type : obj.type,
						name : obj.name,
						macros : macros
					};
					callback(toSet);
					that.win.close()
				}
			}
			function validate() {
				var selection = functionListGrid.getSelectionModel()
						.getSelected();
				if (!selection) {
					dev.report.base.general.showMsg("Application Warning".localize(),
							"macro_selection_wrg_msg".localize(),
							Ext.MessageBox.WARNING);
					return false
				}
				return true
			}
			function refresh() {
				dev.report.base.macro.list([thats, showDialog_post],
						dev.report.base.macro.listFmt.FLAT)
			}
			function showDialog_post(listData) {
				var refreshListData = [];
				for (var i = 0; i < listData.length; i++) {
					refreshListData.push([listData[i]])
				}
				setTimeout(function() {
							functionListStore.loadData(refreshListData);
							initDlg()
						}, 300)
			}
			that.win = new Ext.Window({
				id : "insert-macro-dlg",
				title : "Assign macro".localize(),
				closable : true,
				closeAction : "close",
				autoDestroy : true,
				plain : true,
				constrain : true,
				cls : "default-format-window",
				modal : true,
				resizable : false,
				animCollapse : false,
				layout : "fit",
				width : 400,
				height : 335,
				onEsc : Ext.emptyFn,
				items : mainPanel,
				listeners : {
					close : function() {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
	
					},
					show : function() {
						setTimeout(function() {
								})
					},
					activate : function(win) {

						that.activate();
					}
				},
				buttons : [okBtn, cancelBtn]
			});
			that.setContext();
			that.win.show(that);
			that.containers.btnPanel = btnPanel.items.items[0];
			initDlg()
		}
}
dev.report.util.extend(dev.report.base.dlg.InsertMacro,dev.report.base.dlg.Dialog);