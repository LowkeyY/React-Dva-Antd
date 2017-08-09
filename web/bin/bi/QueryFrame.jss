Ext.namespace("bin.bi");

using("lib.jsvm.MenuTree");

loadcss("dev.query.query");
using("bin.bi.QueryNavPanel");
using("lib.CachedPanel.CachedPanel");

bin.bi.QueryFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'UserQueryMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Query',this);
		this.navPanel =this.frames.createPanel(new bin.bi.QueryNavPanel());
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