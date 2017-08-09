Ext.namespace("dev.report");

dev.report.ParamsWindow = function(queryId,params){
	
	this.win;
	this.params=params;
	
	var len = this.params.length;	
	var h=len*32+80;

	this.ParamsPanel = new Ext.Panel({
		labelAlign:'right',
		frame:true,
		collapsible:false,
		layout:'form'
	});

	this.win =  new Ext.Window({
		title:'参数提交'.loc(),
		layout:'fit',
		width:370,
		height:h,
		scope:parent.WorkBench,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.ParamsPanel],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: this.windowConfirm
		},{
			text: '取消'.loc(),
			scope:this,
			handler: this.windowCancel
		}]
	});

	this.ParamsPanel.on('render', function() {
		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				url:'/bin/bi/getReportParams.jcp?query_id='+queryId+'&rand='+Math.random()
		});
		conn.on('requestcomplete', function(conn, oResponse ){	
			oResponse.responseText=oResponse.responseText.replace(/xtitleList/ig,'fieldLabel');
			var frameJSON = Ext.decode(oResponse.responseText);
			var reportType=frameJSON.report_type;
			var query_id=frameJSON.query_id;
			if(frameJSON.searchEditor){
				var editors=frameJSON.searchEditor.editors;
				if((editors instanceof Array) && editors.length>0){
					if(frameJSON.searchEditor.libs.length>0){
						eval(frameJSON.searchEditor.libs);
					}
					this.eds=[];
					for(var i=0;i<editors.length;i++){
						if(editors[i].fieldLabel){
							editors[i]=Ext.ComponentMgr.create(editors[i], 'textfield')
							this.eds.push(editors[i]);
							this.ParamsPanel.add(editors[i]);
						}
					}
				}
			}
			this.ParamsPanel.doLayout();
		}, this) ;
	}, this);
};

Ext.extend(dev.report.ParamsWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var p={};
		for(var i=0;i<this.eds.length;i++){
			if(!this.eds[i].validate()){
				Ext.msg("error",'请改正标示出的错误.'.loc());
				return false;
			}
			for(var j=0;j<this.params.length;j++){
				var pname=this.params[j][0]; 
				if(this.eds[i].fieldLabel==pname){
					p[this.params[j][0]]=this.eds[i].getValue();
				}
			}
			//dev.report.model.report.resource.params=this.params;
		}
		using("dev.report.ReportPreview");
		var reportWindow = new dev.report.ReportPreview(p);
		reportWindow.show();
		this.win.close();
    }
});

