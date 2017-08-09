Ext.namespace("dev.workflow.popup");

dev.workflow.popup.JoinWindow = function(parent_id,wf,cell){

	this.win;

	this.normalClose=false;
	this.parent_id=parent_id;
	this.cell=cell;
	this.wf=wf;

	var id=cell.getId();			
	this.join=wf.getJoin(id);

	var conditions=this.join.getConditions();
	var conditionsType='AND';
	for(var i=0;i<conditions.length;i++){
		conditionsType=conditions[i].getType();
	}	

	this.conditionsTypeDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['AND', 'AND'],
			['OR', 'OR']
		]
	});

    var fm = Ext.form;
//--------------------------------------------------------------------------------------------------

	this.baseForm = new Ext.FormPanel({
        title: '常规'.loc(),
        labelWidth: 160, 
		labelAlign: 'right',
        border:false,
        bodyStyle:'padding:8px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
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
								new fm.TextField({
									fieldLabel: '步骤ID'.loc(),
									name:'joinId',
									disable:false,
									value:id,
									width: 160,
									allowBlank:false,
									blankText:'步骤ID必须提供.'.loc()
								})
							 ]}
					]
				},		
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
									fieldLabel: '条件类别'.loc(),
									store:this.conditionsTypeDs,
									name: 'conditionsType',
									minLength:1,
									value:conditionsType,
									valueField:'id',
									displayField:'label',
									triggerAction:'all',
									mode:'local'
								})
							 ]}
					]
				}
			]
});

//----------------------------------------------------------------------------------------------------
	var itemsArray=[];
	itemsArray.push(this.baseForm);

//-----------------------------------条件------------------------------------------------------------

	if(conditions){
		this.conditionGrid=new dev.workflow.popup.ConditionGrid(parent_id,conditions,wf);
	}else{
		this.conditionGrid=new dev.workflow.popup.ConditionGrid(parent_id,null,wf);
	}
	itemsArray.push(this.conditionGrid.mainPanel);

//------------------------------EditorGrid 体系------------------------------------------------------

	this.JoinPanel = new Ext.TabPanel({
            region: 'center',
            margins:'3 3 3 0', 
            activeTab: 0,
            defaults:{autoScroll:true},
			scope:this,
            items:itemsArray
    });

//-------------------------页面设定----------------------------------------------------------------
	this.win =  new Ext.Window({
		title:'聚合设定'.loc(),
		layout:'fit',
		width:446,
		height:303,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.JoinPanel],
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

Ext.extend(dev.workflow.popup.JoinWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.normalClose=true;
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.cell.setAttribute('label','聚合_'.loc()+id);	
		this.join.removeConditions();		
		var conditions=new XConditions();
		conditions.setType(fm.findField('conditionsType').value);
		var conditionArray=this.conditionGrid.getConditions();
		for(var i=0;i<conditionArray.length;i++){
			conditions.addCondition(conditionArray[i]);
		}
		this.join.setConditions(conditions);
		this.normalClose=false;
		this.win.close();
    }
});
