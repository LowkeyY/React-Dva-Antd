Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");
Ext.namespace("dev.report.base.app.view");
dev.report.base.app.view.Toolbars = function() {
	this.stdTbar={};
	this.init = function(parantDom) {
		this.stdTbar.render(parantDom);
		this.stdTbar.doLayout();
	};
	this.stdTbar = new Ext.Toolbar({
			cls : "wssUserMenubar",
			items : [/*{
						id : "wVToolbar_Refresh_btn",
						iconCls : "iconrecalcnow",
						text : "Refresh".localize(),
						tooltip : "Refresh / Recalculate".localize(),
						handler : function() {
							dev.report.base.sheet.refresh()
						}
					},  "-",*/ {
						id : "wVToolbar_Prnt_btn",
						iconCls : "iconprintpreview",
						text : "Print".localize(),
						tooltip : "Print".localize(),
						handler : dev.report.base.action.print
					}, {
						id : "wVToolbar_PrntExcel_btn",
						iconCls : "icon_file_xlsx",
						text : "Print To Excel".localize(),
						tooltip : "Print Preview".localize(),
						handler : dev.report.base.action.exportToXLSX,
						disabled : !dev.report.base.app.fopper
					}, {
						id : "wVToolbar_PrntToPdf_btn",
						iconCls : "iconprinttopdf",
						text : "PDF".localize(),
						tooltip : "Print To PDF".localize(),
						handler : dev.report.base.action.exportToPDF,
						disabled : !dev.report.base.app.fopper
					}]
	});
	this.stdTbar.add("-", {
					id : "wUserMode_close_btn",
					iconCls : "iconclose",
					text : "Close".localize(),
					tooltip : "Close".localize(),
					handler : function() {
						dev.report.base.app.Report.ViewWindow.close()
					}
	})
	this.stdTbar.add(new Ext.Toolbar.Fill());
};