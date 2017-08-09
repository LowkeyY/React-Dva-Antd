
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");
dev.report.base.app.Environment = function() {
	using("dev.report.base.app.SharedEnvironment");
	this.shared = new dev.report.base.app.SharedEnvironment()
};