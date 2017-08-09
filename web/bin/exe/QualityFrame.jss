Ext.namespace("bin.exe");


bin.exe.QualityFrame = function(params,QualityFrameJSON){

	this.win;
	this.params=params;

	var desktop=WorkBench.Desk.getDesktop();

	var width=desktop.getViewWidth()/1.2;
	var height=desktop.getViewHeight()/1.2;
	this.win = desktop.getWindow('QualityFrame');

    if(!this.win){
		this.win = desktop.createWindow({
			id: 'QualityFrame',
			title:QualityFrameJSON.items[0].title,
			layout:'fit',
			width:width,
			height:height
		});
    };
	this.win.on('show',function(){
		for(i=0;i<QualityFrameJSON.items.length;i++){
			CPM.removeModel(QualityFrameJSON.items[i].objectId);
		}
		var centerPanel=CPM.Frame.getFramePanel(QualityFrameJSON);
		centerPanel.isFrame=true;;
		centerPanel.param=params;
		centerPanel.param.pageType=QualityFrameJSON.items[0].pageType;
		centerPanel.frameIndex={center:centerPanel.id};
		this.win.add(centerPanel);
		this.win.doLayout();
	},this);
};
Ext.extend(bin.exe.QualityFrame ,Ext.app.Module,{
	show : function(){
		this.win.show();
	},
	onButtonClick : function(item){
		if(item.id=='close'){
			this.win.close();
		}
    }
});

