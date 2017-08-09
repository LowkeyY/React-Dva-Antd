Ext.namespace("dev.workflow.popup");

dev.workflow.popup.ActionWindow = function(parent_id,wf,cell,step,action,actionType){

	this.win;

	this.normalClose=false;
	this.parent_id=parent_id;
	this.cell=cell;
	this.step=step;
	this.action=action;
	this.actionType=actionType;    
	this.callBack='null';

	var id=cell.getId();		
	
	var actionName=action.getName();
	if(!actionName)
		actionName=step.getName();

	var actionView=action.getView();
	if(!actionView&&actionType=='1')
		actionView=step.getName();

	this.isFinish=false;
	if (action.isFinish())
		this.isFinish=true;
	
	this.isAutoExecute=false;
	if (action.getAutoExecute())
		this.isAutoExecute=true;

	this.isComment=false;
	if (action.getComment())
		this.isComment=true;

//--------------------------------------------------------------------------------------------------

	var metaProgram=this.action.getMetaAttributes();
	this.buttonId;
	this.programId;
	this.actId='';
	var metaArray=new Array;
	var n=0;
	for(var i in metaProgram){
		if(metaProgram[i].getName()=='button_id'){
			this.buttonId=metaProgram[i].getValue();
		}else if(metaProgram[i].getName()=='program_id'){
			this.programId=metaProgram[i].getValue();
		}else if(metaProgram[i].getName()=='act_id'&&actionType=='0'){
			this.actId=metaProgram[i].getValue();
		}else{
			metaArray[n]=new Array;
			metaArray[n][0]=metaProgram[i].getName();
			metaArray[n][1]=metaProgram[i].getValue();
			n++;
		}
	}	

//--------------------------------------------------------------------------------------------------

	var restrication=this.action.getRestriction();
	var conditionsType='AND';
	var conditions;
	if(restrication){  
		conditions=restrication.getConditions();
		conditionsType=conditions.getType();
	}
	this.conditionsTypeDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['AND', 'AND'],
			['OR', 'OR']
		]
	});


	var stepParams={};
	stepParams['type']='step';
	stepParams['parent_id']=this.parent_id;
	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/workflow/popup/getOptions.jcp',
			method : 'GET'
		}),
		baseParams:stepParams,
		autoLoad :false,
		reader: new Ext.data.JsonReader({
          	root: 'ActArray'
        }, [
			{name: 'id', mapping: 'id'},
			{name: 'label', mapping: 'label'}
		])
	});

	var metaPrg=this.step.getMetaAttributes();
	var stepBindId;
	var stepBindType;
	for(var i in metaPrg){
		if(metaPrg[i].getName()=='act_id'){
			stepBindId=metaPrg[i].getValue();
		}
		if(metaPrg[i].getName()=='type'){
			stepBindType=metaPrg[i].getValue();
		}
	}
	var progParams={};
	progParams['type']='program';
	progParams['parent_id']=this.parent_id;
	progParams['stepBindId']=stepBindId;
	progParams['stepBindType']=stepBindType;
	this.ds1 = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/workflow/popup/getOptions.jcp',
			method : 'GET'
		}),
		baseParams:progParams,
		autoLoad :false,
		reader: new Ext.data.JsonReader({
          	root: 'programs'
        }, [
			{name: 'id', mapping: 'id'},
			{name: 'label', mapping: 'label'}
		])
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
							fieldLabel: '序号'.loc(),
							name: 'actionId',
							disable:false,
							value:id,
							width: 160,
							allowBlank:false,
							blankText:'序号必须提供.'.loc()
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
						new fm.TextField({
							fieldLabel: '名称'.loc(),
							name: 'actionName',
							width: 160,
							value:actionName,
							allowBlank:false,
							maxLengthText : '名称不能超过{0}个字符!'.loc(),
							blankText:'名称必须提供.'.loc()
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
						new fm.TextField({
							fieldLabel: '视图'.loc(),
							name: 'actionView',
							width: 160,
							value:actionView,
							allowBlank:false,
							maxLengthText : '视图不能超过{0}个字符!'.loc(),
							blankText:'视图必须提供.'.loc()
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
						new Ext.form.RadioGroup({
								fieldLabel: '自动'.loc(),
								scope:this,
								name: 'automic_flag',
								items: [
									{boxLabel: '是'.loc(), name: 'automic_flag', inputValue:'true'},
									{boxLabel: '否'.loc(), name: 'automic_flag', inputValue:'false', checked: true}
								]
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
						new Ext.form.RadioGroup({
								fieldLabel: '完成'.loc(),
								scope:this,
								name: 'finish_flag',
								items: [
									{boxLabel: '是'.loc(), name: 'finish_flag', inputValue:'true'},
									{boxLabel: '否'.loc(), name: 'finish_flag', inputValue:'false', checked: true}
								]
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
						new Ext.form.RadioGroup({
								fieldLabel: '是否批注'.loc(),
								scope:this,
								name: 'is_comment',
								items: [
									{boxLabel: '是'.loc(), name: 'is_comment', inputValue:'true'},
									{boxLabel: '否'.loc(), name: 'is_comment', inputValue:'false', checked: true}
								]
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
						new lib.ComboRemote.ComboRemote({
					   		fieldLabel: '绑定页面'.loc(),
							hiddenName: 'link_program',
							typeAhead: false,
							scope:this,
							store:this.ds,
							editable: true,
							allowBlank:false,
							minLength:1,
							value:this.actId,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							emptyText: '绑定页面选择'.loc()
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
				   columnWidth:0.66,
				   layout: 'form',
				   
				   border:false,
				   items: [	
						this.programs=new lib.ComboRemote.ComboRemote({
							fieldLabel: '绑定按钮'.loc(),
							name: 'program_id',
							typeAhead: false,
							scope:this,
							store:this.ds1,
							value:this.programId,
							width:120,
							editable: true,
							allowBlank:false,
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							emptyText: '程序选择'.loc()
						})
					 ]},
				{ 
				   columnWidth:0.34,
				   layout: 'form',
				   
				   border:false,
				   items: [	
						this.buttons=new fm.ComboBox({
					   		name: 'button_link',
							typeAhead: false,
							scope:this,
							width:120,
							editable: true,
							allowBlank:false,
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							emptyText: '按钮选择'.loc(),
							hideLabel:true
						})
					 ]}
			]
		}
	]
});
this.programs.on('select', function() {
	this.loadButtons();
}, this);

this.loadButtons=function(){
	var buttonParams={};
	buttonParams['type']='button';
	buttonParams['parent_id']=this.parent_id;
	buttonParams['id']=this.programs.getValue();
	buttonParams['stepBindType']=stepBindType;
	this.ds2 = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/workflow/popup/getOptions.jcp',
			method : 'GET'
		}),
		baseParams:buttonParams,
		autoLoad :false,
		reader: new Ext.data.JsonReader({
          	root: 'buttons'
        }, [
			{name: 'id', mapping: 'id'},
			{name: 'label', mapping: 'label'}
		])
	});
	this.buttons.store=this.ds2;
	this.ds2.load();
}

//----------------------------------------------------------------------------------------------------
	var itemsArray=[];
	itemsArray.push(this.baseForm);

//----------------------------------- 预处理---------------------------------------------------------
	var preFunctions=this.action.getPreFunctions();
	this.preFuctionGrid=new dev.workflow.popup.PreFuctionGrid(parent_id,preFunctions,wf);
	itemsArray.push(this.preFuctionGrid.mainPanel);

//----------------------------------后处理函数-------------------------------------------------------

	var postFunctions=this.action.getPostFunctions();
	this.postFuctionGrid=new dev.workflow.popup.PostFuctionGrid(parent_id,postFunctions,wf);
	itemsArray.push(this.postFuctionGrid.mainPanel);

//---------------------------------------------------------------------------------------------------
	this.attrGrid=new dev.workflow.popup.attrGrid(metaArray);
	itemsArray.push(this.attrGrid.mainPanel);

//-----------------------------------条件------------------------------------------------------------

	if(conditions){
		this.conditionGrid=new dev.workflow.popup.ConditionGrid(parent_id,conditions,wf);
	}else{
		this.conditionGrid=new dev.workflow.popup.ConditionGrid(parent_id,null,wf);
	}
	itemsArray.push(this.conditionGrid.mainPanel);
//------------------------------EditorGrid 体系------------------------------------------------------

	this.ActionPanel = new Ext.TabPanel({
            region: 'center',
            margins:'3 3 3 0', 
            activeTab: 0,
            defaults:{autoScroll:true},
			scope:this,
			collapsible:false,
            items:itemsArray
    });

//-------------------------页面设定----------------------------------------------------------------
	this.win =  new Ext.Window({
		title:'动作设定'.loc(),
		layout:'fit',
		width:456,
		height:353,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.ActionPanel],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: this.windowConfirm
		},this.delButton={
			text:'删除'.loc(),
			scope:this,
			handler: this.windowDelete
		},{
			text: '取消'.loc(),
			scope:this,
			handler: this.windowCancel
		}]
	});
};

Ext.extend(dev.workflow.popup.ActionWindow, Ext.Window, {
	show : function(){
		this.win.show();
		if(this.actionType=='1'){
			this.baseForm.form.findField('link_program').hide();
		}else{
			this.baseForm.form.findField('program_id').hide();	
			this.baseForm.form.findField('button_link').hide();	
			this.baseForm.form.findField('is_comment').hide();	
			this.baseForm.form.findField('finish_flag').hide();					
		}

		if(this.isFinish){
			this.baseForm.form.findField('finish_flag').setValue('true');
		}else{
			this.baseForm.form.findField('finish_flag').setValue('false');
		}
		if(this.isAutoExecute){
			this.baseForm.form.findField('automic_flag').setValue('true');	
		}else{
			this.baseForm.form.findField('automic_flag').setValue('false');
		}
		if(this.isComment){
			this.baseForm.form.findField('is_comment').setValue('true');
		}else{
			this.baseForm.form.findField('is_comment').setValue('false');
		}

		if(this.programId){
			this.loadButtons();
			this.ds2.on('load',function(){
				this.baseForm.form.findField('button_link').setValue(this.buttonId);
			},this)
		}
		if(!this.action) this.delButton.disable();
    },
	windowDelete : function(){
		this.normalClose=true;
		this.callBack='delete';
		this.win.close();
    },
	windowCancel : function(){
		this.normalClose=true;
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.action.setName(fm.findField('actionName').getValue());
		this.action.setView(fm.findField('actionView').getValue());


		if(fm.findField('finish_flag').getValue()=='true')
			this.action.setFinish(true);
		else
			this.action.setFinish(false);
			
		if(fm.findField('automic_flag').getValue()=='true')
			this.action.setAutoExecute(true);
		else
			this.action.setAutoExecute(false);

		if(fm.findField('is_comment').getValue()=='true'){
			this.action.setComment(true);
		}else{
			this.action.setComment(false);
		}
		var meta=new XMeta();	
		var meta1=new XMeta();	

		if(fm.findField('program_id').value!='0'){
			meta1.init('program_id',fm.findField('program_id').getValue());
			this.action.addMetaAttributes(meta1);
		}
		meta.init('button_id',fm.findField('button_link').getValue());
		this.action.addMetaAttributes(meta);
		
		if(this.actionType=='0'&&fm.findField('link_program').getValue()!='0'){
			var meta2=new XMeta();
			meta2.init('act_id',fm.findField('link_program').getValue());
			this.action.addMetaAttributes(meta2);
		}

		var metaArray=this.attrGrid.getAttrs();
		for(var i=0;i<metaArray.length;i++){
			this.action.addMetaAttributes(metaArray[i]);
		}
		this.action.removePreFunctions();
		var preFunctionArray=this.preFuctionGrid.getPrefunctions();
		for(var i=0;i<preFunctionArray.length;i++){
			this.action.addPreFunctions(preFunctionArray[i]);
		}
		this.action.removePostFunctions();
		var postFunctionArray=this.postFuctionGrid.getPostfunctions();
		for(var i=0;i<postFunctionArray.length;i++){
			this.action.addPostFunctions(postFunctionArray[i]);
		}

		this.action.removeRestriction();			
		var conditions=new XConditions();
		conditions.setType(fm.findField('conditionsType').getValue());
		var conditionArray=this.conditionGrid.getConditions();
		for(var i=0;i<conditionArray.length;i++){
			conditions.addCondition(conditionArray[i]);
		}
		var restriction= new XRestriction();	
		restriction.removeConditions();
		restriction.setConditions(conditions);
		this.action.setRestriction(restriction);
		this.normalClose=false;

		this.win.close();
    }
});
