
Ext.namespace("bin","bin.workflow");

using("bin.workflow.WorkFlowNavPanel");
using("lib.CachedPanel.CachedPanel");
using("bin.workflow.ApplyPanel");
loadcss("bin.workflow.dataView");

bin.workflow.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
			id:'WorkflowMain',
			statusBar:false,
			region:'center',
			split:true,
			border:false
		}); 
		this.mainPanel.frames=this.frames;
		this.frames.set('Workflow',this);
		this.navPanel =new bin.workflow.WorkFlowNavPanel(this.frames);
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});
		this.mainPanel.on('render',function(){
			this.applyPanel = new bin.workflow.ApplyPanel(); 
			this.mainPanel.add(this.applyPanel.MainTabPanel);
			this.mainPanel.setActiveTab("ApplyPanel");
			this.applyPanel.init();
		},this);
		return this.Frame;
	},
	doWinLayout:function(win){
		this.navPanel.init();
	}  
});