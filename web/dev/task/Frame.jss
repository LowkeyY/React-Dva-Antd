Ext.namespace("dev.task");

using("lib.jsvm.MenuTree");
using("dev.task.TaskNavPanel");

using("lib.ComboRemote.ComboRemote");
using("lib.ComboTree.ComboTree"); 
using("lib.CachedPanel.CachedPanel");


dev.task.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
			id:'ReportMain',
			statusBar:true,
			region:'center',
			split:true
		}); 
		this.frames.set('Task',this);
		this.navPanel =this.frames.createPanel(new dev.task.TaskNavPanel());
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