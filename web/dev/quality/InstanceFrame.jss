
Ext.namespace("dev.quality");
using("lib.jsvm.MenuTree");

using("dev.quality.InstanceNavPanel");
using("lib.CachedPanel.CachedPanel");
dev.quality.InstanceFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'qualityInstanceMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('qualityInstance',this);
		this.navPanel =this.frames.createPanel(new dev.quality.InstanceNavPanel(this.frames));
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