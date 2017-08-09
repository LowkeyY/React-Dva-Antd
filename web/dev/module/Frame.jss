
Ext.namespace("dev.module");

using("lib.jsvm.MenuTree");
using("dev.module.ModuleNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.module.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.frames.set('Module',this);
		uStore=new UserStore(tree_store);
		var saved=uStore.getAttribute("Module");
		if(saved==null){
			saved=[0];
		}else{
			saved=saved.split("/");
		}  

		this.mainPanel=new lib.CachedPanel.CachedPanel({
			region:'center',
			statusBar:true,
			statusConfig:{statusDefine:["ID", '修改者'.loc(), '修改时间'.loc(),'菜单路径'.loc()]
			},
			split:true,
			border:false
		});
		this.navPanel =this.frames.createPanel(new dev.module.ModuleNavPanel());
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});

		if(saved.length>2){
			this.navPanel.treeClickEvent(this,{
				objectId:saved[saved.length-1],
				functionName:(saved.length%2==1)?"init":"loadData",
				type:(saved.length>4)?'program':'module'
			});
		}
		return this.Frame;
	},
	doWinLayout:function(win){
		this.navPanel.init();
	}  
});
