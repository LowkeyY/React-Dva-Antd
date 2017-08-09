Ext.namespace("bin.exe");

bin.exe.BlankPanel = function(parentPanel,params){
	this.MainPanel=new Ext.Panel({
		id: 'BlankPanel',
		border:false
	});
	parentPanel.add(this.MainPanel);
};
Ext.extend(bin.exe.BlankPanel, Ext.Panel, {
	init : function(params){}
});