Ext.namespace("bin.exe");

bin.exe.MapQuery = function(params,frames){

	this.win;
	this.frames=frames;
	this.params=params;

	var desc='<root>'+this.params['desc']+'</root>';

	var config=Tool.parseXML(desc);
	var classMap = config.childNodes;
	var len = classMap.length;
	var dataId;
	var layer;
	var mapId;

	for(var i=0;i<len;i++){
		var elements = classMap[i];
		if(elements.tagName=='layer'){
			layer=elements.childNodes[0].nodeValue;
		}
		if(elements.tagName=='data_id'){
			dataId=elements.childNodes[0].nodeValue;
		}
		if(elements.tagName=='map_id'){
			mapId=elements.childNodes[0].nodeValue;
		}
	}

	var desktop=WorkBench.Desk.getDesktop();
	var width=desktop.getViewWidth()/1.2;
	var height=desktop.getViewHeight()/1.2;

	this.win = desktop.getWindow('MapQuery');

    if(!this.win){
		this.win = desktop.createWindow({
			id: 'MapQuery',
			title:this.params['name'],
			layout:'fit',
			width:width,
			height:height,
			buttons: [{
				text: '取消'.loc(),
				id:'close',
				handler: this.onButtonClick,
				scope:this
			}]
		});
    };
	this.win.on('show',function(){
		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				url:'/bin/gis/getMapQuery.jcp?map_id='+mapId+'&layer='+layer+'&rand='+Math.random()
		});
		conn.on('requestcomplete', function(conn, oResponse ){	
			using('bin.exe.FramePanel');
			var mapQueryJSON = Ext.decode(oResponse.responseText);
			var FrameConfig={modname:dataId,modtype:2};		
			FrameConfig['region']='center';
			FrameConfig['program']=mapQueryJSON.POIQuery;
			FrameConfig['PanelType']=mapQueryJSON.centerFrame;
			FrameConfig['width']=width;
			FrameConfig['height']=height;
			var CenterPanel=new bin.exe.FramePanel(FrameConfig,frames);
			this.Frame=new Ext.Panel({
				layout:'border',
				border: false,
				items:[
					CenterPanel
				 ]
			});
			this.win.add(this.Frame);
			this.win.doLayout();
		}, this);
	},this);
};
Ext.extend(bin.exe.MapQuery ,Ext.app.Module,{
	show : function(){
		this.win.show();
	},
	onButtonClick : function(item){
		if(item.id=='close'){
			this.win.close();
		}
    }
});

