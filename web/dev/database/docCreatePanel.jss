
Ext.namespace("dev.database");

dev.database.DocCreatePanel = function(frames,parent_id,retFn) {
	this.parent_id=parent_id;
	this.frames=frames;
	this.params = {};
	this.docForm=new dev.database.DocFormPanel(frames,parent_id,retFn);
	this.MainTabPanel = new Ext.Panel({
		id : 'dev.database.DocCreatePanel',
		border : false,
		items:[this.docForm]
	});
};
dev.database.DocCreatePanel.prototype={
	init : function(param){
		this.params=param;
		if(this.MainTabPanel.rendered){
			this.docForm.init(param);
			this.frames.get("MetaTable").mainPanel.setStatusValue(['文档建表'.loc()]);
		}
	}
};
