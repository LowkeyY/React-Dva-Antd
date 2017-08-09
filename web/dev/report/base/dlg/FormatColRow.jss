
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.FormatColRow = function(type, size) {
		this.id = "formatColRow";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var rowSize = new Ext.form.NumberField({
					id : "wFormatColRow_rowSize_nf",
					fieldLabel : "Row height".localize(),
					width : 35,
					tabIndex : 1,
					layout : "form",
					hideLabel : false,
					autoHeight : true,
					allowDecimals : false,
					enableKeyEvents : true,
					value : size,
					allowBlank : false,
					labelSeparator : ":",
					labelStyle : "margin: 0px;"
				});
		var colSize = new Ext.form.NumberField({
					id : "wFormatColRow_colSize_nf",
					width : 35,
					tabIndex : 1,
					allowBlank : false,
					autoHeight : true,
					allowDecimals : false,
					value : size,
					layout : "form",
					hideLabel : false,
					enableKeyEvents : true,
					fieldLabel : "Column width".localize(),
					labelStyle : "margin: 0px;"
				});
		if (type == 0) {
			var displayField = this.cmpFocus = colSize;
			var winTitle = "Column Width".localize()
		} else {
			if (type == 1) {
				var displayField = this.cmpFocus = rowSize;
				var winTitle = "Row Height".localize()
			}
		}
		var mainPanel = new Ext.Panel({
			id : "sizetab",
			bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
			border : false,
			frame : false,
			autoHeight : true,
			layout : "form",
			items : [displayField]
		});
		function doFormatColRow() {
			if (type == 0) {
				size = colSize.getValue()
			} else {
				if (type == 1) {
					size = rowSize.getValue()
				}
			}
			dev.report.base.action.resizeRowCol(type, size)
		}
		this.win = new Ext.Window({
			id : "wFormatColRow_dlg_wnd",
			title : winTitle,
			closable : true,
			cls : "default-format-window",
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			width : 180,
			autoHeight : true,
			layout : "form",
			items : [mainPanel],
			onEsc : Ext.emptyFn,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
					//that.close();
					dev.report.base.app.activeSheet._defaultSelection
							.getCursorField().refresh();
				},
				show : function() {
					setTimeout(function() {
							//	that.initFocus(true, 100)
							})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			buttons : [new Ext.Button({
								id : "wFormatColRow_ok_btn",
								text : "OK".localize(),
								tabIndex : 2,
								handler : function() {
									doFormatColRow();
									that.win.close()
								}
							}), new Ext.Button({
								id : "wFormatColRow_cancel_btn",
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