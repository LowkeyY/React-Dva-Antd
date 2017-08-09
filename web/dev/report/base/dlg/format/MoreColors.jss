Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.format");
using("lib.ColorPicker.ColorPicker");
dev.report.base.dlg.format.MoreColors = function(backgroundColorValue, cbFunc) {
		this.id = "more-colors-window";
		var that = this;
		colorPicker = new lib.ColorPicker.ColorPicker({
					xtype : "colorpicker",
					title : "ColorPicker",
					id : "panelPicker",
					opacity : false,
					value : backgroundColorValue
				});
		var mainCPPanel = new Ext.Panel({
					baseCls : "x-plain",
					items : [colorPicker]
				});
		this.win = new Ext.Window({
					title : "More Colors".localize().concat("..."),
					closable : true,
					id : "colorPickerField",
					autoDestroy : true,
					plain : true,
					constrain : true,
					modal : true,
					resizable : false,
					animCollapse : false,
					width : 340,
					heigh : 200,
					layout : "form",
					onEsc : Ext.emptyFn,
					listeners : {
						close : function() {
							//that.close()
						},
						show : function() {
							setTimeout(function() {
									})
						},
						activate : function(win) {
							//that.activate()
						}
					},
					items : [mainCPPanel],
					buttons : [ new Ext.Button({
								text : "OK".localize(),
								tabIndex : 100,
								handler : function() {
									var tmpColor = Ext
											.getCmp("panelPicker__iHexa")
											.getValue();
									that.win.close();
									cbFunc(0, tmpColor, 0, 0)
								}
							}),  new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 101,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
				});
		//this.setContext();
		this.win.show(this);
		//this.containers.rgbPan = Ext.getCmp("colorPickerFormContainer")
}