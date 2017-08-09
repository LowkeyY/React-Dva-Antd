
Ext.namespace("bin.user");

using("lib.jsvm.MenuTree");
using("bin.user.RoleNavPanel");
using("bin.user.RoleListPanel");
using("lib.CachedPanel.CachedPanel");

bin.user.RoleFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'RoleMain',
				statusBar:true,
				region:'center',
				statusConfig : {
					hidden : true
				},
				split:true
		}); 
		this.frames.set('state','list');
		this.frames.set('Role',this);
		this.roleListPanel = new bin.user.RoleListPanel(this.frames);
		this.navPanel =this.frames.createPanel(new bin.user.RoleNavPanel());

		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				//items: [this.navPanel,this.mainPanel]
				items: [this.mainPanel]
		});
		this.mainPanel.add(this.roleListPanel.MainTabPanel);
		this.mainPanel.setActiveTab(this.roleListPanel.MainTabPanel);
		return this.Frame;
	},
	doWinLayout:function(win){
		//this.navPanel.init();
		this.roleListPanel.showList({dept_id:0});
	}
});