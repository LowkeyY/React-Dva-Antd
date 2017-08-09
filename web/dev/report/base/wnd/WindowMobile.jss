
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.wnd");

dev.report.base.wnd.WindowMobile = (function() {
	return function(cb, data) {
		var conf = {
			title : "",
			renderTo : dev.report.base.wspc.dom,
			width : 900,
			height : 300,
			minWidth : 350,
			minHeight : 150,
			maximizable : false,
			minimizable : false,
			bodyBorder : false,
			border : true,
			header : false,
			footer : false,
			plain : true,
			shadow : false,
			hideBorders : true,
			onEsc : Ext.emptyFn,
			closable : false,
			_minimized : false
		};
		dev.report.base.wnd.WindowMobile.parent.constructor
				.call(this, cb, data, conf)
	}
})();
dev.report.util.extend(dev.report.base.wnd.WindowMobile, dev.report.base.wnd.Window);
clsRef = dev.report.base.wnd.WindowMobile;
clsRef.prototype.setTitle = function(title, iconCls) {
	return
};