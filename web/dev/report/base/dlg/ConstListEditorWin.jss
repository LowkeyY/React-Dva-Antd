Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
using("dev.report.base.dlg.ConstListEditor");
dev.report.base.dlg.ConstListEditorWin = function(initArray, tof, from) {
		this.id = "wConstListSel_dlg_wnd";
		var that = this;
		this.win = new Ext.Window({
			title : "Constants List Selection".localize(),
			closable : true,
			id : "wConstListSel_dlg_wnd",
			autoDestroy : true,
			plain : true,
			cls : "default-format-window",
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			width : 450,
			height : 350,
			layout : "fit",
			listeners : {
				close : function() {
					that.close();
					dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			items : [(this.containers.mp = new dev.report.base.dlg.ConstListEditor({
						id : "constListEditor",
						style : "margin: 10px;",
						baseCls : "x-plain",
						list : initArray
					}))],
			buttons : [ new Ext.Button({
						text : "OK".localize(),
						id : "wConstListSel_ok_btn",
						tabIndex : 101,
						handler : function() {
							var lista = Ext.getCmp("constListEditor").getList();
							lista = lista.join(",");
							Ext.getCmp(tof).setValue(lista);
							that.win.close()
						}
					}),  new Ext.Button({
						text : "Cancel".localize(),
						id : "wConstListSel_cancel_btn",
						tabIndex : 102,
						handler : function() {
							that.win.close()
						}
					})]
		});
		this.win.show(this)
}