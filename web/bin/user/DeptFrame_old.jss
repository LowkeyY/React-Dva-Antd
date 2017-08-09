Ext.namespace("bin.user");
using("lib.jsvm.MenuTree");

using("bin.user.DeptNavPanel");
using("lib.CachedPanel.CachedPanel");

bin.user.DeptFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel = new lib.CachedPanel.CachedPanel({
				statusBar:true,
				region:'center',
				split:true
			});  
	
		this.frames.set('Dept',this);
		this.frames.set('params',{}); 
		
	
		this.navPanel =this.frames.createPanel(new bin.user.DeptNavPanel());
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