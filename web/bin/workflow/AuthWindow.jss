Ext.namespace("bin.workflow");

bin.workflow.AuthWindow = function(params,panel,finishFn){
	this.win;
	this.params=params;
	this.panel=panel;
	this.finishFn=finishFn;
	this.baseForm = new Ext.FormPanel({
        labelWidth: 150, 
		labelAlign: 'top',
        border:false,
        bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
			{
				layout:'column',
				border:false,
				items:
				[
					{ 
					   columnWidth:1.0,
					   layout: 'form',
					   border:false,
					   items: [	
							new Ext.form.TextArea({
								fieldLabel: '批复意见'.loc(),
								name: 'authDesc',
								width: 370,
								value:this.txt,
								height:110,
								maxLength : 500,
								allowBlank:false,
								blankText:'批复意见不能为空.'.loc(),
								maxLengthText : '批复意见不能超过{0}个字符!'.loc()
							})
					]}
				]
			}
		]
	});
//-------------------------页面设定----------------------------------------------------------------

	var desktop = WorkBench.Desk.getDesktop();
	this.win =  new Ext.Window({
		title:'批复'.loc(),
		layout:'fit',
		width:436,
		height:203,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.baseForm],
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
};

Ext.extend(bin.workflow.AuthWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		var saveParams=this.params;
		if (fm.isValid()) {
			saveParams['comment']=fm.findField('authDesc').getValue();
			Ext.Ajax.request({
				url : '/bin/workflow/authit.jcp',
				params : saveParams,
				method : 'POST',
				scope:this,
				success : function(response, options){
					this.finishFn();
				}
			});
		}else{
			Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
		}	
		this.win.close();
    }
});
