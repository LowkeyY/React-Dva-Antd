
Ext.namespace("bin","bin.workflow");
using("lib.jsvm.MenuTree");
using("bin.workflow.WorkflowPathNavPanel");
using("lib.CachedPanel.CachedPanel");
bin.workflow.PathFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'WorkflowPathMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Workflow',this);
		this.navPanel =this.frames.createPanel(new bin.workflow.WorkflowPathNavPanel(this.frames));
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