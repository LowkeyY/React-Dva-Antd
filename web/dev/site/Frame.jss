Ext.namespace("dev.site");

using("lib.jsvm.MenuTree");

using("dev.site.SiteNavPanel");

loadcss("lib.multiselect.Multiselect");
using("lib.multiselect.Multiselect");
using("lib.ComboTree.ComboTree");
using("lib.ComboRemote.ComboRemote");
using("lib.CachedPanel.CachedPanel");

dev.site.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
			statusBar:true,
			region:'center',
			split:true
		}); 
		
		this.frames.set('Site',this);
	
		this.navPanel =this.frames.createPanel(new dev.site.SiteNavPanel());
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