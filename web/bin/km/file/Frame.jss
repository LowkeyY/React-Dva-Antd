Ext.namespace("bin.km.file");
using("lib.jsvm.MenuTree");

using("bin.km.file.ArchiveNavPanel");
using("lib.CachedPanel.CachedPanel");

bin.km.file.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel = new lib.CachedPanel.CachedPanel({
				statusBar:true,
				region:'center',
				split:true
			});  
	
		this.frames.set('Archive',this);
		this.frames.set('params',{}); 
		
	
		this.navPanel =this.frames.createPanel(new bin.km.file.ArchiveNavPanel());
		this.Frame=new Ext.Panel({
			border: false,
			layout:'border',
			items:[this.navPanel,this.mainPanel]
		});
		return this.Frame;

	},
	doWinLayout:function(win){
		this.navPanel.init();
	}  
});