Ext.namespace("dev.query");

using("lib.jsvm.MenuTree");
loadcss("dev.query.query");
using("dev.query.QueryNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.query.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'QueryMain',
				statusBar:true,
				region:'center',
				whiteBody:false,
				split:true
		}); 
		this.frames.set('Query',this);
		this.navPanel =this.frames.createPanel(new dev.query.QueryNavPanel());
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});
		return this.Frame;
	}, 
	doWinLayout:function(win){
		this.navPanel.init();
	}
});