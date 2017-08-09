Ext.namespace("bin.exe");

bin.exe.TextReportViewPanel = function(params){
	this.params=params;
	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'print',
				tooltip: '打印'.loc(),
				icon: '/themes/icon/all/printer.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());

	var reportString='';
	for(var i in this.params){
		reportString+='&'+i+'='+this.params[i];
	}

	this.MainTabPanel=new Ext.Panel({
			id: 'userReportPanel',
			border:false,
			layout:'fit',
			tbar:ButtonArray
	});
	this.MainTabPanel.on('render', function(){
		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				url:'/bin/exe/textreportview.jcp?type=params&'+reportString.substring(1)
		});	
		conn.on('requestcomplete', function(conn, oResponse ){	
			var frameJSON = Ext.decode(oResponse.responseText);
			var check = frameJSON.content;
			this.MainTabPanel.body.dom.innerHTML=check;  

			if(frameJSON.searchEditor){
				var tb=this.MainTabPanel.getTopToolbar();
				var editors=frameJSON.searchEditor.editors;
				if((editors instanceof Array) && editors.length>0){
					if(frameJSON.searchEditor.libs.length>0){
						eval(frameJSON.searchEditor.libs);
					}
					tb.addFill();
					this.eds=[];
					for(var i=0;i<editors.length;i++){
						if(editors[i].xtitleList){
							editors[i]=Ext.ComponentMgr.create(editors[i], 'textfield');
							this.eds.push(editors[i]);
						}
						tb.add(editors[i]);
					}
					tb.addButton(new Ext.Toolbar.Button({   
						text:'过滤'.loc(),
						scope:this,
						icon: '/themes/icon/xp/selectlink.gif',
						cls: 'x-btn-text-icon bmenu',
						handler:function(btn){
							var result={};
							for(var i=0;i<this.eds.length;i++){
								if(!this.eds[i].validate()){
									Ext.msg("error",'请改正标示出的错误.'.loc());
									return false;
								}
								result[this.eds[i].xtitleList]=this.eds[i].getValue();
							}
							this.params['meta']=false;
							this.params['query']=encodeURI(Ext.encode(result));
							var reportString='';
							for(var i in this.params){
								reportString+='&'+i+'='+this.params[i];
							}
							Ext.Ajax.request({  
								url:'/bin/exe/textreportview.jcp?'+reportString.substring(1)+'&'+Math.random(),
								method: 'GET',  
								scope:this,
								success:function(aresponse, options){ 
									var newJSON = Ext.decode(aresponse.responseText);
									var content1 = newJSON.content;
									this.MainTabPanel.body.dom.innerHTML=content1;  
								}
							}); 
						}
					}));
					tb.addButton(new Ext.Toolbar.Button({   
						text:'还原'.loc(),
						scope:this,
						icon: '/themes/icon/all/magifier_zoom_out.gif',
						cls: 'x-btn-text-icon bmenu',
						handler:function(btn){
							var result={};
							for(var i=0;i<this.eds.length;i++){
								this.eds[i].reset();
							}
							this.params['meta']=false;
							this.params['query']='';
							var reportString='';
							for(var i in this.params){
								reportString+='&'+i+'='+this.params[i];
							}   
							Ext.Ajax.request({  
								url:'/bin/exe/textreportview.jcp?'+reportString.substring(1)+'&'+Math.random(),
								method: 'GET',  
								scope:this,
								success:function(response, options){ 
									var frameJSON = Ext.decode(response.responseText);
									var check = frameJSON.content;
									this.MainTabPanel.body.dom.innerHTML=check;  
								}
							}); 
						}
					}));
				}
			}
		}, this) ;
	}, this);
};
Ext.extend(bin.exe.TextReportViewPanel,Ext.Panel, {
	onButtonClick : function(item){
		if(item.btnId=='print'){

		}
    }
});