Ext.namespace("bin.bi");

using("lib.jsvm.MenuTree");
using("bin.bi.ReportNavPanel");
using("lib.CachedPanel.CachedPanel");
loadcss("dev.report.report");

bin.bi.ReportFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'UserReportMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Report',this);
		this.navPanel =this.frames.createPanel(new bin.bi.ReportNavPanel());
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