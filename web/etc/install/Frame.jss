Ext.namespace("etc.install");

using("lib.jsvm.MenuTree");
using("etc.install.NavPanel");
using("lib.CachedPanel.CachedPanel");
 
etc.install.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'systemMain',
				statusBar:true,
				region:'center',
				split:true
		});  
		this.frames.set('System',this);
		this.frames.set('params',{}); 
		this.navPanel =new etc.install.NavPanel(this.frames);
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