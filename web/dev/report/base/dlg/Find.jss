dev.report.base.dlg.openFindDialog = function(pattern, callBackFnc) {
	dev.report.dlg.dlgRegistry.add(new dev.report.base.dlg.Find(pattern, callBackFnc))
};
dev.report.base.dlg.Find = (function() {
	return function(pattern, callBackFnc) {
		dev.report.base.dlg.Find.parent.constructor.call(this);
		this.id = "findDlg";
		var that = this;
		var _fromDlgF = false;
		if (dev.report.base.app.environment.inputMode === dev.report.base.grid.GridMode.DIALOG) {
			_fromDlgF = true
		} else {
			dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		var patternTxf = this.cmpFocus = new Ext.form.TextField({
					fieldLabel : "Find what".localize(),
					enableKeyEvents : true,
					tabIndex : 1,
					value : pattern,
					width : 170
				});
		var findBtn = this.components.OK = new Ext.Button({
					text : "Find".localize(),
					ctCls : dev.report.kbd.Base.tags.NO_ENTER,
					tabIndex : 2,
					width : 70,
					handler : function() {
						callBackFnc(patternTxf.getValue())
					}
				});
		var cancelBtn = this.components.Cancel = new Ext.Button({
					text : "Cancel".localize(),
					ctCls : dev.report.kbd.Base.tags.NO_ENTER,
					tabIndex : 3,
					width : 70,
					handler : function() {
						that.win.close()
					}
				});
		var findBtnPanel = new Ext.Panel({
					layout : "card",
					baseCls : "x-plain",
					style : "padding-top: 8px;",
					activeItem : 0,
					items : [{
								layout : "form",
								border : false,
								baseCls : "x-plain",
								items : [findBtn]
							}]
				});
		var cancelBtnPanel = new Ext.Panel({
					layout : "card",
					baseCls : "x-plain",
					style : "padding-top: 8px;",
					activeItem : 0,
					items : [{
								layout : "form",
								border : false,
								baseCls : "x-plain",
								items : [cancelBtn]
							}]
				});
		var mainPanel = this.containers.mainPanel = new Ext.Panel({
					layout : "absolute",
					baseCls : "x-plain",
					border : false,
					items : [{
								layout : "form",
								border : false,
								baseCls : "x-plain",
								x : 5,
								y : 12,
								width : 285,
								height : 100,
								items : [patternTxf]
							}, {
								layout : "form",
								baseCls : "x-plain",
								x : 290,
								y : 5,
								height : 90,
								items : [findBtnPanel, cancelBtnPanel]
							}]
				});
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px"
			},
			title : "Find".localize(),
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
			onEsc : Ext.emptyFn,
			width : 400,
			height : 130,
			items : mainPanel,
			listeners : {
				close : function() {
					if (!_fromDlgF) {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
					}
				},
				show : function() {
					setTimeout(function() {
								that.initFocus(true, 100)
							})
				},
				activate : function(win) {
					that.activate()
				}
			}
		});
		this.setContext();
		this.win.show(this)
	}
})();
dev.report.util.extend(dev.report.base.dlg.Find, dev.report.base.dlg.WSSDialog);