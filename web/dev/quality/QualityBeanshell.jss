Ext.namespace("dev.quality");

dev.quality.QualityBeanshell = function(params,frames){
	this.frames=frames;
	var Quality = this.frames.get("Quality");
	this.editor=new lib.scripteditor.javaEditor();
	this.ButtonArray=new Array();
	this.params=params;
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text: '保存'.loc(),
				icon: '/themes/icon/all/script_save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				handler :function(btn){
					var code=this.editor.getValue();
					if(code=="") return;
					var retParam=this.params;
					retParam.content=code;
					retParam.type="save";
					Ext.Ajax.request({
							   url: '/dev/quality/qualiytbeanshell.jcp',
							   method:'post',
							   params: retParam,
							   scope:this,
							   success:function(){
								 setTimeout(function(){
												this.loadData(this.params,Quality.mainPanel);
								 }.createDelegate(this),300);
								 Ext.msg("info","保存成功".loc());
							   }
					});
				}
	}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text: '删除'.loc(),
				btnId:'delete',
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden:true,
				scope: this,
				handler :function(btn){
					 Ext.msg('confirm', '警告:删除将导致您的数据不可恢复，确认吗?'.loc(), function (answer){
						 if (answer == 'yes') {
							
							var retParam=this.params;
							retParam.type="delete";
							Ext.Ajax.request({
									   url: '/dev/quality/qualiytbeanshell.jcp',
									   method:'post',
									   params: retParam,
									   scope:this,
									   success:function(){
										   setTimeout(function(){
												this.loadData(this.params,Quality.mainPanel);
										   }.createDelegate(this),300);
										 Ext.msg("info","删除成功".loc());
									   }
							});
						 }
					 }.createDelegate(this));
				}
	}));
	this.ButtonArray=this.ButtonArray.concat(this.editor.getButtons());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/xp/undo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				handler :function(btn){
					Quality.mainPanel.setActiveTab("QualityBase");
					//Quality.mainPanel.setStatusValue(["规则管理"]);
				}
	}));

	this.MainTabPanel=new Ext.Panel({
		id:"beanshell",
		border:false,
		layout:'fit',
		split:true,
		tbar:this.ButtonArray,
		items:this.editor.MainPanel
	});

};
dev.quality.QualityBeanshell.prototype={
	loadData : function(params,mainPanel){	
		this.params=params;
		Ext.Ajax.request({
		   url: '/dev/quality/qualiytbeanshell.jcp?ra='+Math.random()+'&resource_id='+params.resource_id,
		   method:'GET',
		   scope:this,
		   callback: function(options,success,response){
				code=response.responseText;
				if(code!=""){
					var  tempToolBar=this.MainTabPanel.getTopToolbar();
					tempToolBar.items.each(function(item){    
						if(item.btnId=="delete")
							item.show();
					}, tempToolBar.items);
					setTimeout(function(){
							this.editor.setValue(code);
					}.createDelegate(this),300);
				}else{
					var  tempToolBar=this.MainTabPanel.getTopToolbar();
					tempToolBar.items.each(function(item){    
						if(item.btnId=="delete")
							item.hide();
					}, tempToolBar.items);
				}
		   }.createDelegate(this)
		});
		//mainPanel.setStatusValue(["编辑BeanShell"]);
    }
}

