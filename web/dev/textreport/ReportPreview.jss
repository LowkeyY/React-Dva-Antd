Ext.namespace("dev.textreport");

dev.textreport.ReportPreview = function(objectId,params){
	this.win;
	this.params=params;
	this.objectId=objectId;

	var ButtonArray=[];

	ButtonArray.push(new Ext.Toolbar.Button({
				text: '关闭'.loc(),
				icon: '/themes/icon/xp/close.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	
	var desktop=WorkBench.Desk.getDesktop();
	var width=desktop.getViewWidth();
	var height=desktop.getViewHeight();
	this.win = desktop.getWindow('textReportPreview');
    if(!this.win){
		this.win = desktop.createWindow({
			id: 'textReportPreview',
			title:'报表预览'.loc(),
			bodyStyle:'background-color:#FFFFFF;overflow:auto',
			layout:'fit',
			width:width,
			height:height,
			tbar:ButtonArray
		});
    };
	this.win.on('show', function(){
		var paramString='&param=';
		var obj = "";
		var paramStr = "";
		var n=0;
		for(var i in params){
			paramStr+='::'+i;
			obj+="&searchfield"+n+"="+params[i];
			n++;
		}
		paramString=paramString+paramStr.substring(2)+obj;
		Ext.Ajax.request({  
			url:'/dev/textreport/view.jcp?report_id='+this.objectId+encodeURI(paramString)+'&'+Math.random(),
			method: 'GET',  
			scope:this,
			success:function(response, options){ 
				var check = response.responseText;
				this.win.body.dom.innerHTML=check;  
			}
		}); 
	}, this);
};
Ext.extend(dev.textreport.ReportPreview,Ext.app.Module,{
	show : function(){
		this.win.show(this);
    },
	onButtonClick : function(item){  
		if(item.id=='close'){
			this.win.close();
		}
    }
});

