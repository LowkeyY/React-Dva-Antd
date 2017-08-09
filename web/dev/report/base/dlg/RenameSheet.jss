Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.RenameSheet = function(sheetID, sheetTitle) {
		this.id = "renameSheet";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var sheetNewNameTxf = this.cmpFocus = new Ext.form.TextField({
					fieldLabel : "New Name".localize(),
					value : sheetTitle,
					enableKeyEvents : true,
					width : 135,
					tabIndex : 1
				});
		var mainPanel = new Ext.Panel({
					modal : true,
					layout : "form",
					baseCls : "main-panel",
					border : false,
					items : sheetNewNameTxf
				});
		function isNameValid() {
			var name = sheetNewNameTxf.getValue();
			if (name.length < 3) {
				sheetNewNameTxf
						.markInvalid("Sheet Name specified is not a valid!");
				return false
			} else {
				return true
			}
		}
		function rename() {
			if (!isNameValid()) {
				return
			}
			var newName = sheetNewNameTxf.getValue();
			dev.report.backend.ccmd([this, rename_post, newName], ["oren", 2,
							newName])
		}
		function rename_post(res, newName) {
			if (res[0][0] === true) {
				Ext.getCmp(sheetID).setTitle(newName)
			}
			that.win.close()
		}
		function showWarrningMessage(name) {
			win.hide();
			var informationMsg = "informationMsg".localize();
			var adviceMsg = "adviceMsg".localize();
			Ext.Msg.show({
						title : "Rename Sheet".localize() + "?",
						msg : "<b>" + name + "</b> " + informationMsg + "?<br>"
								+ adviceMsg + ".",
						buttons : Ext.Msg.OK,
						fn : function() {
							win.show();
							sheetNewNameTxf.selectText();
							sheetNewNameTxf.focus(true, true)
						},
						animEl : "elId",
						width : 320,
						icon : Ext.MessageBox.ERROR
					})
		}
		sheetNewNameTxf.on("specialKey", function(txf, e) {
					if (e.getKey() == 13) {
						rename()
					}
				});
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px"
			},
			title : "Rename Sheet".localize(),
			closable : true,
			cls : "default-format-window",
			closeAction : "close",
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 280,
			height : 110,
			items : mainPanel,
			onEsc : Ext.emptyFn,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				},
				show : function() {
					setTimeout(function() {
							//	that.initFocus(true, 200)
							})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			buttons : [ new Ext.Button({
								text : "Rename".localize(),
								tabIndex : 2,
								handler : function() {
									rename();
									that.win.close()
								}
							}), new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 3,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		this.win.show(this)
}