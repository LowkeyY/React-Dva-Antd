Ext.namespace("utils.km.portal");

using("lib.jsvm.MenuTree");
using("utils.km.portal.NavPanel");

using("lib.CachedPanel.CachedPanel");

utils.km.portal.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'ReportMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Portal',this);
		this.frames.set('params',{});
		this.navPanel =new utils.km.portal.NavPanel(this.frames);
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