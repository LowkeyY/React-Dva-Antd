
Ext.namespace("bin.user");

using("lib.jsvm.MenuTree");

using("bin.user.RoleAuthNavPanel");
using("bin.user.RoleAuthPanel");
loadcss("bin.user.data-view");
using("lib.CachedPanel.CachedPanel");

bin.user.RoleAuthFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'RoleAuthMain',
				statusBar:true,
				region:'center',
				split:true
		});   
		this.frames.set('RoleAuth',this);
		this.navPanel =this.frames.createPanel(new bin.user.RoleAuthNavPanel());
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