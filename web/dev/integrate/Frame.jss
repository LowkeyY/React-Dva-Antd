
Ext.namespace("dev.integrate");

using("lib.jsvm.MenuTree");
using("dev.integrate.IntegrateNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.integrate.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.frames.set('Integrate',this);
		uStore=new UserStore(tree_store);
	
		var saved=uStore.getAttribute("Integrate");
			
		if(saved==null){
			saved=[0];
		}else{
			saved=saved.split("/");
		}  
		
		this.mainPanel=new lib.CachedPanel.CachedPanel({
			region:'center',
			statusBar:true,
			split:true,
			border:false
		});
		this.navPanel =this.frames.createPanel(new dev.integrate.IntegrateNavPanel());
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});
		if(saved.length>2){
			this.navPanel.treeClickEvent(this,{
				objectId:saved[saved.length-1],
				functionName:(saved.length%2==1)?"init":"loadData"
			});
		}
		return this.Frame;
	},
	doWinLayout:function(win){
		this.navPanel.init();
	}  
});
