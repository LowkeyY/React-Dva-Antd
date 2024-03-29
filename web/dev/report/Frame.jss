Ext.namespace("dev.report");

using("lib.jsvm.MenuTree");
using("dev.report.ReportNavPanel");
loadcss("dev.report.report");
using("lib.CachedPanel.CachedPanel");

dev.report.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'ReportMain',
				statusBar:true,
				whiteBody:false,
				region:'center',
				split:true
		}); 
		this.frames.set('Report',this);
		this.navPanel =this.frames.createPanel(new dev.report.ReportNavPanel());
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