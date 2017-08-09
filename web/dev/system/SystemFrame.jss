Ext.namespace("dev.system");

using("lib.jsvm.MenuTree");
using("dev.system.SystemNavPanel");
using("lib.CachedPanel.CachedPanel");
 
dev.system.SystemFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'systemMain',
				statusBar:true,
				region:'center',
				split:true
		});  
		this.frames.set('System',this);
		this.frames.set('params',{}); 
		this.navPanel =new dev.system.SystemNavPanel(this.frames);
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