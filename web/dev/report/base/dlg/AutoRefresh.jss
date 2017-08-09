
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.AutoRefresh =  function() {
		this.id = "AutoRefresh";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var autoRefreshLbl = new Ext.form.Label({
					text : "Refresh every".localize().concat(":")
				});
		var unitTxf = this.cmpFocus = new Ext.form.TextField({
					hideLabel : true,
					tabIndex : 1,
					allowBlank : false,
					width : 50
				});
		var unitLbl = new Ext.form.Label({
					text : "seconds".localize().concat(" ", "(",
							"min 10".localize(), ").")
				});
		var mainPanel =  new Ext.Panel({
					layout : "column",
					border : false,
					baseCls : "x-plain",
					bodyStyle : "background-color: transparent;",
					autoWidth : true,
					height : 100,
					defaults : {
						baseCls : "x-plain",
						autoWidth : true,
						bodyStyle : "padding:4px;"
					},
					items : [{
								items : autoRefreshLbl
							}, {
								items : unitTxf
							}, {
								items : unitLbl
							}]
				});
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px 5px 5px 5px"
			},
			title : "Auto Refresh".localize(),
			closable : true,
			closeAction : "close",
			autoDestroy : true,
			cls : "default-format-window",
			plain : true,
			onEsc : Ext.emptyFn,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 340,
			height : 115,
			items : mainPanel,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
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
								text : "OK".localize(),
								tabIndex : 2,
								handler : function() {
									if (validate()) {
										startTimer();
										that.win.close()
									}
								}
							}),  new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 3,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		this.win.show(this);
		function validate() {
			var v = unitTxf.getValue();
			if (parseInt(v)) {
				if (parseInt(v) < 10) {
					unitTxf.markInvalid("Minimum value is 10".localize());
					return false
				}
			} else {
				unitTxf.markInvalid("Not correct format".localize());
				return false
			}
			return true
		}
		function startTimer() {
			dev.report.base.book.autoRefresh(unitTxf.getValue())
		}
}