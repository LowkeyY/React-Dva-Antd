Ext.namespace("dev.workflow.popup");

dev.workflow.popup.SelectActionWindow = function(parent_id,step){

	this.win;
	this.parent_id=parent_id;
	this.relateAction;
	this.normalClose=false;

    var actions=step.getActions();
	var actionArray=new Array;
	actionArray[0]=new Array;
	var n=0;
	if(!isEmty(actions)){
		for(var i in actions){
			actionArray[n]=new Array;
			actionArray[n][0]=actions[i].getId();
			actionArray[n][1]=actions[i].getName();
			n++;
		}
	}

	this.ds = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:actionArray
	});

    var fm = Ext.form;

	this.baseForm = new Ext.FormPanel({
        labelWidth: 160, 
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
							fieldLabel: '选择动作'.loc(),
							store:this.ds,
							name: 'action',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							allowBlank:false,
							blankText:'必须选择一个动作!'.loc()
						})
					]}
				]
			}
		]
	});
//-------------------------页面设定----------------------------------------------------------------
	this.win =  new Ext.Window({
		title:'参数设定'.loc(),
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

Ext.extend(dev.workflow.popup.SelectActionWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.normalClose=true;
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.normalClose=false;
		this.relateAction=fm.findField('action').getValue();		
		this.win.close();
    }
});
function isEmty(s){
	for(var i in s)
		return false;
	return true;
}