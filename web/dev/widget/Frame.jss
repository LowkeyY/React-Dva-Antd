Ext.namespace("dev.widget");

using("lib.jsvm.MenuTree");
loadcss("lib.multiselect.Multiselect");
using("lib.multiselect.Multiselect");
using("lib.ComboRemote.ComboRemote");
using("lib.ComboTree.ComboTree"); 

using("dev.widget.WidgetNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.widget.Frame = Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'WidgetMain',
				statusBar:true,
				region:'center',   
				split:true   
		});     
		this.frames.set('Widget',this);
		this.navPanel =new dev.widget.WidgetNavPanel(this.frames);
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