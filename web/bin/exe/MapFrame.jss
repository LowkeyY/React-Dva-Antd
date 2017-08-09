Ext.namespace("bin.exe");


bin.exe.MapFrame = function(params,MAP){

	this.win;
	this.params=params;
	var desktop=WorkBench.Desk.getDesktop();
	var width=desktop.getViewWidth()/1.2;
	var height=desktop.getViewHeight()/1.2;

	this.win = desktop.getWindow('MapFrame');

    if(!this.win){
		this.win = desktop.createWindow({
			id: 'MapFrame',
			normalClose:false,
			title:this.params['name'],
			layout:'fit',
			width:width,
			height:height
		});
    };
	this.win.on('show',function(){
		var conn=new Ext.data.Connection();
		var paramString=Ext.urlEncode(params);
		
		conn.request({    
				method: 'GET',    
				url:'/bin/gis/getMapFrame.jcp?'+paramString+'&rand='+Math.random()
		});
		conn.on('requestcomplete', function(conn, oResponse ){	
			using('bin.exe.FramePanel');
			var MapFrameJSON = Ext.decode(oResponse.responseText);
			var centerPanel=CPM.Frame.getFramePanel(MapFrameJSON);
			centerPanel.isFrame=true;
			centerPanel.param=params;

			centerPanel.frameIndex={center:centerPanel.id}
			this.win.add(centerPanel);
			this.win.doLayout();
		}, this);
	},this);
};
Ext.extend(bin.exe.MapFrame ,Ext.app.Module,{
	show : function(){
		this.win.show();
	}
});

