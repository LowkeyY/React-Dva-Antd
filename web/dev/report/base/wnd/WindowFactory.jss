

Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.wnd");
dev.report.base.wnd.WindowFactory = function() {
	this.get = function(cb, data) {
		//if(dev.report.env.isMobile){
			using("dev.report.base.wnd.Window");
			return new dev.report.base.wnd.Window(cb, data);
		/*}else{
			using("dev.report.base.wnd.WindowMobile");
			return new dev.report.base.wnd.WindowMobile(cb, data);
		}*/
	}
};