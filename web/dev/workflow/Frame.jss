
Ext.namespace("dev.workflow");

using("lib.jsvm.MenuTree");
using("lib.CachedPanel.CachedPanel");
using("dev.workflow.WorkflowNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.workflow.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'ModuleMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Workflow',this);
		this.navPanel =new dev.workflow.WorkflowNavPanel(this.frames);
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