Ext.namespace("bin.menu");

using("lib.jsvm.MenuTree");
using("bin.menu.NavPanel");

using("lib.ListValueField.ListValueField");
loadcss("lib.IconPicker.IconPicker");
using("lib.IconPicker.IconPicker");
using("lib.ComboRemote.ComboRemote");
using("lib.ComboTree.ComboTree"); 
using("lib.CachedPanel.CachedPanel");

bin.menu.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'ReportMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Menu',this);
		this.frames.set('params',{});
		this.navPanel =new bin.menu.NavPanel(this.frames);
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