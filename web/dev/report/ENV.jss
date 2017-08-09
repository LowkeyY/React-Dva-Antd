dev.report.ENV = function() {
	var that = this, _init = function() {
	that.isStudio = false;
	that.isWSS = false;
	that.isDesktop = false;
	that.isMobile = false;
	that.isTablet = false;
	that.isPhone = false;
	that.isIPad = false;
	that.isIPhone = false;
	that.isIPod = false;
	that.isWindows = false;
	that.isLinux = false;
	that.isMac = false;
	that.isIOS = false;
	that.isAndroid = false;
	that.isBlackberry = false;
	that.isGecko = false;
	that.isIE = false;
	that.isWebKit = false;
	that.isFromHomescreen = false;
	/*if (dev.report.studio instanceof Object) {
		that.isStudio = true
	} else {
		that.isWSS = true
	}*/
	var hasSTouch = Ext.is instanceof Object;
	/*if (typeof wss_platform !== "undefined") {
		that["is".concat(wss_platform)] = true;
		delete wss_platform
	}*/
	if (that.isMobile ) {
		that.isMobile = true;
		if (hasSTouch) {
			that.isWebKit = true;
			that.isIOS = Ext.is.iOS;
			that.isAndroid = Ext.is.Android;
			that.isBlackberry = Ext.is.Blackberry;
			that.isTablet = Ext.is.Tablet;
			that.isPhone = Ext.is.Phone;
			that.isIPad = Ext.is.iPad;
			that.isIPhone = Ext.is.iPhone;
			that.isIPod = Ext.is.iPod;
			that.isFromHomescreen = Ext.is.Standalone
		}
	} else {
		that.isDesktop = true;
		that.isWindows = Ext.isWindows;
		that.isLinux = Ext.isLinux;
		that.isMac = Ext.isMac;
		that.isGecko = Ext.isGecko;
		that.isIE = Ext.isIE;
		that.isWebKit = Ext.isWebKit
	}
};
_init();
}