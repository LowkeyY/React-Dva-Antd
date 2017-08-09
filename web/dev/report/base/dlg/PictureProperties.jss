Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
using("dev.report.base.dlg.SizePosPanel");
dev.report.base.dlg.PictureProperties = function(conf) {
		this.id = "PitureProperties";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var spp = new Ext.Panel({
					title : "Size & Position".localize(),
					border : false,
					id : "SPPan",
					bodyStyle : "background-color:transparent;",
					layout : "form",
					labelWidth : 110,
					autoWidth : true,
					autoHeight : true,
					style : "padding:2px;",
					items : [{}]
				});
		var tabs = new Ext.TabPanel({
					region : "center",
					xtype : "tabpanel",
					id : "maintabspanel",
					layoutOnTabChange : true,
					activeTab : 0,
					ctCls : "tb-no-bg",
					autoHeight : true,
					baseCls : "x-plain",
					bodyStyle : "background-color: transparent; padding: 5px;",
					defaults : {
						autoScroll : false
					},
					items : [spp],
					listeners : {
						tabchange : function(p, t) {
						}
					}
				});
		var getSizePosPan = function(panel) {
			spp.removeAll(true);
			spp.add(panel);
			spp.doLayout();
			Ext.getCmp("FE-SE-panel").setSPData(conf)
		};

		var sizePanel=new dev.report.base.dlg.SizePosPanel("Picture", false);
		getSizePosPan(sizePanel.mainSPPanel);

		var doFormatPicture = function() {
			var dims = Ext.getCmp("FE-SE-panel").getSPData();
			if (!dims) {
				Ext.MessageBox.show({
							title : "Error".localize(),
							msg : "invalid_picture_size".localize(),
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
				return false
			}
			if (conf.psHnd) {
				conf.psHnd.call(conf.scope, dims)
			}
			that.win.close()
		};
		this.win = new Ext.Window({
			title : "Picture Properties".localize(),
			closable : true,
			cls : "default-format-window",
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			width : 280,
			height : 320,
			layout : "form",
			items : [tabs],
			onEsc : Ext.emptyFn,
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
					//that.activate()
				}
			},
			buttons : [new Ext.Button({
								text : "OK".localize(),
								tabIndex : 100,
								handler : function() {
									doFormatPicture()
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
}