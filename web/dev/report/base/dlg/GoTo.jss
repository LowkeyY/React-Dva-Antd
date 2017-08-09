
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

dev.report.base.dlg.GoTo = function() {
		//dev.report.base.dlg.GoTo.parent.constructor.call(this);
		this.id = "goTo";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var goToTxf = this.cmpFocus = new Ext.form.TextField({
					fieldLabel : "Reference".localize(),
					enableKeyEvents : true,
					width : 178,
					tabIndex : 1
				});
		var mainPanel = new Ext.Panel({
					labelWidth : 60,
					modal : true,
					layout : "form",
					baseCls : "main-panel",
					border : false,
					items : goToTxf
				});
		function doGoTo() {
			dev.report.base.book.goTo(goToTxf.getValue())
		}
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px"
			},
			title : "Go To".localize(),
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
								//that.initFocus(true, 200)
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
									doGoTo();
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
	//	this.setContext();
		//this.win.show(this)
};