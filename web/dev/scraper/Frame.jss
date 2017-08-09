Ext.namespace("dev.scraper");
using("lib.jsvm.MenuTree");
using("dev.scraper.DesignPanel");
using("dev.scraper.NavPanel");
using("lib.CachedPanel.CachedPanel");


dev.scraper.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'ScraperMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Scraper',this);
		this.frames.set('nowNodeTitle','');
		this.frames.set('params',{});
		this.navPanel =this.frames.createPanel(new dev.scraper.NavPanel());
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