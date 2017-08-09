Ext.namespace("bin.integrate");

bin.integrate.SelectIntegrateWindow = function(instanceArray){
	this.win;
	this.intstanceId;
	this.normalClose=false;

	var instanceArr=new Array;
	for(var i=0;i<instanceArray.length;i++){
		instanceArr[i]=new Array;
		instanceArr[i][0]=instanceArray[i].id;
		instanceArr[i][1]=instanceArray[i].label;
	}
	this.ds = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:instanceArr
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
							fieldLabel: '选择实例'.loc(),
							store:this.ds,
							name: 'instanceId',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							allowBlank:false,
							blankText:'必须选择一个实例!'.loc()
						})
					]}
				]
			}
		]
	});
//-------------------------页面设定----------------------------------------------------------------
	var desktop = WorkBench.Desk.getDesktop();
	this.win =  new Ext.Window({
		title:'选择集成实例'.loc(),
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

Ext.extend(bin.integrate.SelectIntegrateWindow, Ext.Window, {
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
		this.instanceId=fm.findField('instanceId').getValue();		
		this.win.close();
    }
});
