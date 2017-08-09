Ext.namespace("bin.exe");


bin.exe.SearchFrame = function(params){

	this.win;
	this.params=params;

	var desktop=WorkBench.Desk.getDesktop();

	var width=desktop.getViewWidth()/1.2;
	var height=desktop.getViewHeight()/1.2;
	this.win = desktop.getWindow('SearchFrame');

    if(!this.win){
		this.win = desktop.createWindow({
			id: 'SearchFrame',
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
				url:'/bin/exe/getSearchFrame.jcp?'+paramString+'&rand='+Math.random()
		});
		conn.on('requestcomplete', function(conn, oResponse ){	
			using('bin.exe.FramePanel');
			var SearchFrameJSON = Ext.decode(oResponse.responseText);
			var centerPanel=CPM.Frame.getFramePanel(SearchFrameJSON);
			centerPanel.isFrame=true;;
			centerPanel.param=params;
			centerPanel.frameIndex={center:centerPanel.id}
			this.win.add(centerPanel);
			this.win.doLayout();
		}, this);
	},this);
};
Ext.extend(bin.exe.SearchFrame ,Ext.app.Module,{
	show : function(){
		this.win.show();
	},
	onButtonClick : function(item){
		if(item.id=='close'){
			this.win.close();
		}
    }
});

