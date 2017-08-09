Ext.namespace("dev.logic");
using("lib.scripteditor.javaEditor");
dev.logic.beanshell = function(retFn){

	this.editor=new lib.scripteditor.javaEditor();
	this.ButtonArray=new Array();
	this.params={};
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
					Ext.Ajax.request({
							   url: '/dev/logic/beanshell.jcp',
							   method:'post',
							   params: retParam,
							   scope:this,
							   success:function(){
								 Ext.msg("info",'保存成功'.loc());
							   }
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

	this.MainTabPanel=new Ext.Panel({
		id:"beanshell",
		border:false,
		layout:'fit',
		split:true,
		tbar:this.ButtonArray,
		items:this.editor.MainPanel
	});

};
dev.logic.beanshell.prototype={
	loadData : function(params,mainPanel){	
		this.params=params;
		Ext.Ajax.request({
		   url: '/dev/logic/beanshell.jcp?ra='+Math.random()+'&parent_id='+params.parent_id,
		   method:'GET',
		   scope:this,
		   callback: function(options,success,response){
				code=response.responseText;
				if(code!=""){
					setTimeout(function(){
							this.editor.setValue(code);
					}.createDelegate(this),300);
				}
		   }.createDelegate(this)
		});
		mainPanel.setStatusValue(['编辑BeanShell'.loc()]);
    }
}

