Ext.namespace("dev.report");

dev.report.ReportPreview = function(params){
	this.params=params;
	this.win;
	var desktop=WorkBench.Desk.getDesktop();
	var width=desktop.getViewWidth();
	var height=desktop.getViewHeight();
   
	this.win = desktop.getWindow('reportPreview');
	
	this.reportSpace= new Ext.Panel({
		region: 'center',
		autoScroll: false,
		frame:false,
        border:false,
		html:'<div id="vworkspace" class="vworkspace"></div><div id="vCursorMarker"></div><div id="vmarker" onmouseup="stopTracking();"></div>'
	});
	this.operatePanel = new Ext.Panel({		
        closable:false, 
		region: 'north',
        border:false,
		html:'<div id="vbarsContainer"><div id="vToolbar" class="vxtoolbar" style="height: 26px; overflow: hidden;"><div id="xvStandardBar" class="bar" style="position: absolute;width:100%"><div id="xvStandardToolbar" class="bar-end"   ></div></div></div></div>'
	});
	this.MainPanel=new Ext.Panel({
			id: 'ReportMainTab',
			border:false,
			layout:'border',
			items:[this.operatePanel,this.reportSpace]
	});

    if(!this.win){
		this.win=dev.report.base.app.Report.ViewWindow = desktop.createWindow({
			id: 'reportPreview',
			title:'报表预览'.loc(),
			layout:'fit',
			items:this.MainPanel,
			width:width,
			height:height
		});
    };
	this.win.on('close', function(){
		dev.report.base.app.defaultFiles = '';
		dev.report.base.app.appModeS = dev.report.base.app.appMode = dev.report.base.grid.viewMode.DESIGNER;
		dev.report.base.app.fopper = true;
	}, this);
};
Ext.extend(dev.report.ReportPreview,Ext.app.Module,{
	show : function(){
		dev.report.base.app.UPRestrictModeEnabled = true;
		dev.report.base.app.preload = false;
		dev.report.base.app.toolbarLayout = 'toolbar';
		dev.report.base.env.init({appMode: dev.report.base.env.appMode.USER });
		dev.report.base.app.appMode = dev.report.base.grid.viewMode.USER;
		dev.report.base.app.fopper = true;

		this.win.on('show', function(){
			dev.report.base.general.startReportView(this.params);
		}, this);
		this.win.show(this);
    },
	onButtonClick : function(item){
		this.win.close();
    }
});

