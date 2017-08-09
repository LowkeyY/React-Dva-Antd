
Ext.namespace("dev.report.base");
dev.report.base.ENV = function() {
	var that = this;
	this.appMode = {
		DESIGNER : "designer",
		USER : "user",
		PREVIEW : "preview"
	};
	this.isDesigner = false;
	this.isUser = false;
	this.isPreview = false;
	this.execMode = {
		GENERAL : "general",
		PRERENDERED : "prerendered"
	};
	this.isGeneralExec = false;
	this.isPrerendered = false;
	this.init = function(conf) {
		for (var item in conf) {
			switch (item) {
				case "appMode" :
					switch (conf.appMode) {
						case this.appMode.DESIGNER :
							this.isDesigner = true;
							break;
						case this.appMode.USER :
							this.isUser = true;
							break;
						case this.appMode.PREVIEW :
							this.isPreview = true;
							break
					}
					break;
				case "execMode" :
					switch (conf.execMode) {
						case this.execMode.GENERAL :
							this.isGeneralExec = true;
							break;
						case this.execMode.PRERENDERED :
							this.isPrerendered = true;
							break
					}
					break
			}
		}
		if (conf.execMode == undefined) {
			this.isGeneralExec = true
		}
	}
};