Ext.namespace("dev.workflow.popup");

dev.workflow.popup.TextWindow = function(parent_id,txt){

	this.win;
	this.parent_id=parent_id;
	this.txt=txt;
    var fm = Ext.form;

	this.baseForm = new Ext.FormPanel({
        labelWidth: 160, 
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
								fieldLabel: '内容'.loc(),
								name: 'textBody',
								
								width: 370,
								value:this.txt,
								height:110,
								maxLength : 500,
								maxLengthText : '职责说明不能超过{0}个字符!'.loc()
							})
					]}
				]
			}
		]
	});
//-------------------------页面设定----------------------------------------------------------------
	this.win =  new Ext.Window({
		title:'标注'.loc(),
		layout:'fit',
		width:386,
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

Ext.extend(dev.workflow.popup.TextWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.txt=fm.findField('textBody').getValue();		
		this.win.close();
    }
});
