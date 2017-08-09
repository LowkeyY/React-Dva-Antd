Ext.namespace("dev.program");

using("lib.jsvm.MenuTree");
using("dev.program.FolderNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.program.AuthFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'PrgAuthFrameMain',
				statusBar:true,
				region:'center',
				split:true
		});     
		this.frames.set('ProgramAuth',this);
		this.frames.set('params',{});
		ProgramAuth=this.frames.get("ProgramAuth");
		this.navPanel =this.frames.createPanel(new dev.program.FolderNavPanel(ProgramAuth));
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