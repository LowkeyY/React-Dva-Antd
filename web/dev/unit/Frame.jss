Ext.namespace("dev","dev.unit");
loadcss("dev.unit.option");
using("lib.jsvm.MenuTree");
using("dev.unit.OptionPanel","dev.unit.NavPanel");
using("lib.CachedPanel.CachedPanel");

dev.unit.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'UnitionnaryMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Unitionary',this);
		this.frames.set('nowNodeTitle','公用单位'.loc());
		this.frames.set('params',{});
		this.optionPanel = this.frames.createPanel(new dev.unit.OptionPanel());
		this.navPanel =this.frames.createPanel(new dev.unit.NavPanel(this.frames));
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});
		this.mainPanel.add(this.optionPanel.MainTabPanel);
		this.mainPanel.setActiveTab(this.optionPanel.MainTabPanel);
		return this.Frame;
	},
	doWinLayout:function(win){
		this.win=win;
		this.navPanel.init();
	}
});