
Ext.namespace("dev.report.base");

dev.report.base.WSPC = function() {
	var that = this;
	if(dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER){
		this.dom = document.getElementById("vworkspace");
	}else{
		this.dom = document.getElementById("workspace");
	}
	this._id=0;
	this.resize = function() {
		var barCnt,height;
		
		if(dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER){
			height = (window.innerWidth
					? window.innerHeight
					: document.documentElement.clientHeight)
					- ((barCnt = document.getElementById("vbarsContainer"))
							? barCnt.offsetHeight
							: 0)-62;
		}else{
			height = (window.innerWidth
					? window.innerHeight
					: document.documentElement.clientHeight)
					- ((barCnt = document.getElementById("barsContainer"))
							? barCnt.offsetHeight
							: 0)-92;
		}
		that.dom.style.height = "".concat(height, "px");
		
		var width = that.dom.offsetWidth;
		var wndreg = dev.report.base.wnd.reg;
		if(dev.report.base.app.appMode != dev.report.base.grid.viewMode.USER){
			for (var id in wndreg) {
				win = wndreg[id];
				if (win._minimized) {
					win.setPosition(win.getPosition()[0], height
									- win.header.getSize().height - 2)
				} else {
					if (win.maximized) {
						win.setSize(width, height)
					}
				}
			}
		}
		if (dev.report.base.app.toolbar && dev.report.base.app.toolbar.resize) {
			dev.report.base.app.toolbar.resize()
		}
	};
	this.getHeight = function() {
		return parseInt(this.dom.style.height)
	};
	this.resize()
};