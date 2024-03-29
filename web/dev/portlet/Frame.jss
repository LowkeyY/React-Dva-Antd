
Ext.namespace("dev.portlet");

using("lib.jsvm.MenuTree");
using("lib.CachedPanel.CachedPanel");
using("lib.ComboRemote.ComboRemote");
using("lib.ComboTree.ComboTree");
using("dev.portlet.PortletNavPanel");

dev.portlet.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'portletMain',
				statusBar:true,
				region:'center',
				split:true
		});     
		this.frames.set('Portlet',this);

		uStore=new UserStore(tree_store);
		var saved=uStore.getAttribute("Portlet");
		if(saved==null){
			saved=[0];
		}else{
			saved=saved.split("/");
		}  

		this.navPanel =this.frames.createPanel(new dev.portlet.PortletNavPanel(this.frames));
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});

		if(saved.length>2){
			this.navPanel.treeClickEvent(this,{
				objectId:saved[saved.length-1],
				functionName:(saved.length%2==1)?"init":"loadData",
				type:(saved.length>4)?'program':'portlet'
			});
		}
		return this.Frame;
	},
	doWinLayout:function(win){
		this.navPanel.init();
	}
});