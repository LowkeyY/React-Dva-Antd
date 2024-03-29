Ext.namespace("etc.liveUpdate");

using("lib.jsvm.MenuTree");
using("etc.liveUpdate.NavPanel");
using("lib.CachedPanel.CachedPanel");
 
etc.liveUpdate.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'updateMain',
				statusBar:true,
				region:'center',
				split:true
		});  
		this.frames.set('update',this);
		this.frames.set('params',{}); 
		this.navPanel =new etc.liveUpdate.NavPanel(this.frames);
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