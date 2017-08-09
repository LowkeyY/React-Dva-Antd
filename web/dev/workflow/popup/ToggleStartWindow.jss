Ext.namespace("dev.workflow.popup");

dev.workflow.popup.ToggleStartWindow = function(parent_id){

	this.win;
	this.parent_id=parent_id;
	this.resultType='';

	this.ds = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['0', '有条件'.loc()],
			['1', '无条件'.loc()]
		]
	});

    var fm = Ext.form;

	this.baseForm = new Ext.FormPanel({
        labelWidth: 140, 
		labelAlign: 'right',
        border:false,
        bodyStyle:'padding:30px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
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
						new fm.ComboBox({
							fieldLabel: '结果类型'.loc(),
							store:this.ds,
							name: 'resultType',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							allowBlank:false,
							blankText:'必须选择一种结果类型!'.loc()
						})
					]}
				]
			}
		]
	});
//-------------------------页面设定----------------------------------------------------------------
	this.win =  new Ext.Window({
		title:'事件类别'.loc(),
		layout:'fit',
		width:386,
		height:140,
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

Ext.extend(dev.workflow.popup.ToggleStartWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.resultType=fm.findField('resultType').getValue();		
		this.win.close();
    }
});
