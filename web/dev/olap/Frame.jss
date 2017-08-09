Ext.namespace("dev.olap");

using("lib.jsvm.MenuTree");
using("dev.olap.OLAPNavPanel");
using("lib.CachedPanel.CachedPanel");

dev.olap.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'OLAPMain',
				statusBar:true,
				whiteBody:false,
				region:'center',
				split:true
		}); 
		this.frames.set('OLAP',this);
		this.navPanel =this.frames.createPanel(new dev.olap.OLAPNavPanel());
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