
Ext.namespace("dev.logic");
using("lib.scripteditor.sqlEditor");


dev.logic.storedProcedure = function(retFn){
	
	this.editor=new lib.scripteditor.sqlEditor();
	this.ButtonArray=new Array();
	this.params={};

	this.ButtonArray.push(new Ext.Toolbar.Button({
				text: '保存'.loc(),
				icon: '/themes/icon/all/script_save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				handler :function(btn){
					var code=this.editor.getValue().trim();
					if(code=="") return;
 					var reg=new RegExp("^create\\s+(or\\s+replace\\s+)?(procedure|function){1}\\s+\\$\\[(.+)\\]\\.(\\S+)\\s*(\\((.*)\\))?","igm");
					if(code.match(reg)==null){
						Ext.msg("error",'创建函数或存储过程语法不正确.'.loc()+'<br>'+'注意,数据库名要写成'.loc()+'$[plat]'+'方式'.loc());
						return false;
					}
					var retParam=this.params;
					retParam.type=RegExp.$2;
					retParam.database_link=RegExp.$3;
					retParam.title=RegExp.$4;
					retParam.params=RegExp.$5;
					retParam.content=code;
					Ext.Ajax.request({
							   url: '/dev/logic/storedProcedure.jcp',
							   method:'post',
							   success:function(response){
								 var msg=null;
								 try{
									var obj=Ext.decode(response.responseText);
									if(!obj.success)
										msg=obj.message;
									else
										Ext.msg("info",'保存成功'.loc());

								 }catch(e){
									msg=response.responseText;
								 }
								 if(msg!=null)
									 Ext.msg("error",'保存失败,原因为:'.loc()+msg);
							   },
							   failure:function(response){
								 Ext.msg("error",'网络断线或服务器暂时无法连接'.loc());
							   },
							   params: retParam
							});
				}
	}));
	this.ButtonArray=this.ButtonArray.concat(this.editor.getButtons());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/xp/undo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				handler :retFn
	}));
	//没有解决带参数的存储过程的运行问题，暂时屏蔽运行按钮。--tz
	var execTitle="运行".loc()
	for(var i=0;i<this.ButtonArray.length;i++){
		if(this.ButtonArray[i].text==execTitle){
			this.ButtonArray.splice(i,1);
			break;
		}
	}

	this.MainTabPanel=new Ext.Panel({
		id:"storedProcedure",
		border:false,
		layout:'fit',
		split:true,
		tbar:this.ButtonArray,
		items:this.editor.MainPanel
	});

};
dev.logic.storedProcedure.prototype={
	loadData : function(params,mainPanel){	
		this.params=params;
		Ext.Ajax.request({
		   url: '/dev/logic/storedProcedure.jcp?ra='+Math.random()+'&parent_id='+params.parent_id,
		   method:'get',
		   callback: function(options,success,response){
				code=response.responseText;
				if(code!=""){
					setTimeout(function(){
							this.editor.setValue(code);
					}.createDelegate(this),300);
				}
		   }.createDelegate(this)
		});
		mainPanel.setStatusValue(['编辑存储过程'.loc()]);
    }
}

