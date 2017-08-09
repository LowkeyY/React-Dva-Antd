Ext.namespace("dev.workflow.popup");

dev.workflow.popup.ResultWindow = function(parent_id,wf,cell,defaultName,result,resultType,targetStyle,targetId){

	this.win;
	this.normalClose=false;
	this.parent_id=parent_id;
	this.cell=cell;
	this.result=result;
	this.resultType=resultType;
	this.targetId=targetId;
	this.targetStyle=targetStyle;
	this.returnResult;
	this.wt;

	var id=cell.getId();		
	
	this.rt;
	if(resultType=='0'){
		this.rt= result.getResult();
	}else{
		this.rt= result;
	}


	var resultName=this.rt.getDisplayName();
	if(!resultName)
		resultName=defaultName;

	var owner=this.rt.getOwner();

	var currentStatus=this.rt.getStatus();
	var oldStatus=this.rt.getOldStatus();
	this.pathTypeValue="relative";

	if(owner&&owner.indexOf("${")==-1){
		if(owner&&owner.indexOf("r")!=-1){
			this.pathTypeValue="absStrategy";
		}else if(owner&&owner.indexOf("d")!=-1){
			this.pathTypeValue="relStrategy";
		}else if(owner&&owner.indexOf("a")!=-1){
			this.pathTypeValue="role";
		}else{
			this.pathTypeValue="user";
		}
	}
 

//-----------初始化属性---------------------------------------------------------------

    var fm = Ext.form;
	this.conditionsTypeDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['AND', 'AND'],
			['OR', 'OR']
		]
	});
	this.conditionsType='AND';
	this.pathTypeDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['absStrategy', '绝对角色'.loc()],
			['relStrategy', '部门限制角色'.loc()],
			['role', '职位'.loc()],
			['user', '用户'.loc()],
			['relative', '相对路径'.loc()]
		]
	});
	this.statusDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['队列中'.loc(), '队列中'.loc()],
			['处理中'.loc(), '处理中'.loc()],
			['完成'.loc(), '完成'.loc()]
		]
	});

	this.relativeArray=[
				['${initer}','访问者'.loc()],
				['${mostRecentOwner}','最近执行者'.loc()],
				['${callerSupervisor}','访问者部门主管'.loc()],
				['${callerUpSupervisor}','访问者上级部门主管'.loc()],
				['${ownerSupervisor}','执行者部门主管'.loc()],
				['${ownerUpSupervisor}','执行者上级部门主管'.loc()]
	];

	this.relativeOwnerDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:this.relativeArray
	});

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
							name: 'ResultId',
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
							name: 'ResultName',
							width: 160,
							value:resultName,
							allowBlank:false,
							blankText:'步骤名称必须提供.'.loc()
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
					   	this.pathType=new fm.ComboBox({
							fieldLabel: '路径方式'.loc(),
							scope:this,
							store:this.pathTypeDs,
							name: 'pathType',
							minLength:1,
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
				this.ownerColumn={ 
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [	
						this.ownerCombox=new fm.ComboBox({
							fieldLabel: '相对执行人'.loc(),
							scope:this,
							store:this.relativeOwnerDs,
							name: 'owner',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local'
						}),
						this.ownerUserCombox=new lib.SelectUser.SelectUser({
							id:Ext.id(),
							height:100,
							width:160,
						    scope:this,
							minLength:1,
							dept_id:"0",
							name: 'ownerUser',
							fieldLabel:'用户执行人'.loc()
						}),
						this.ownerRoleCombox=new lib.SelectRole.SelectRole({
							id:Ext.id(),
							height:100,
							width:160,
							scope:this,
							minLength:1,
							dept_id:"0",
							name: 'ownerRole',
							fieldLabel:'职位执行人'.loc()
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
					this.conditionsCombox=new fm.ComboBox({
							fieldLabel: '条件类别'.loc(),
							scope:this,
							store:this.conditionsTypeDs,
							name: 'conditionsType',
							minLength:1,
							value:this.conditionsType,
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
						new fm.ComboBox({
							fieldLabel: '本步状态'.loc(),
							scope:this,
							store:this.statusDs,
							name: 'oldStatus',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							value:oldStatus
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
							fieldLabel: '下步状态'.loc(),
							scope:this,
							store:this.statusDs,
							name: 'currentStatus',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							value:currentStatus
						})
					 ]}
			]
		}
	]
});

//----------------------------------------------------------------------------------------------------
	var itemsArray=[];
	itemsArray.push(this.baseForm);
//----------------------------------- 预处理---------------------------------------------------------
	var preFunctions=this.rt.getPreFunctions();
	this.preFuctionGrid=new dev.workflow.popup.PreFuctionGrid(parent_id,preFunctions,wf);
	itemsArray.push(this.preFuctionGrid.mainPanel);

//----------------------------------后处理函数-------------------------------------------------------

	var postFunctions=this.rt.getPostFunctions();
	this.postFuctionGrid=new dev.workflow.popup.PostFuctionGrid(parent_id,postFunctions,wf);
	itemsArray.push(this.postFuctionGrid.mainPanel);
//-----------------------------------属性------------------------------------------------------------

	if(resultType=='0'){
		var  conditions=this.result.getConditions();
		if(conditions){
			this.conditionGrid=new dev.workflow.popup.ConditionGrid(parent_id,conditions,wf);
		}else{
			this.conditionGrid=new dev.workflow.popup.ConditionGrid(parent_id,null,wf);
		}
		itemsArray.push(this.conditionGrid.mainPanel);
	}


//------------------------------EditorGrid 体系------------------------------------------------------

	this.ResultPanel = new Ext.TabPanel({
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
		title:'结果设定'.loc(),
		layout:'fit',
		width:426,
		height:343,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.ResultPanel],
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

Ext.extend(dev.workflow.popup.ResultWindow, Ext.Window, {
	show : function(){
		this.win.show();
		this.pathType.setValue(this.pathTypeValue);	
		this.pathType.on("select", function(){	
			var typ=this.pathType.getValue();
			if (typ=='absStrategy'||typ=='relStrategy'||typ=='role'||typ=='user'){
				if(typ=='role'||typ=='user'){
					this.ownerCombox.hide();    
					this.ownerCombox.disable();
					if(typ=='role'){
						this.ownerUserCombox.hide();
						this.ownerUserCombox.disable();
						this.ownerRoleCombox.enable();
						this.ownerRoleCombox.show();
						if(this.rt.getOwner()){
							var role=this.rt.getOwner().split(':')[1];
							this.ownerRoleCombox.setValue(role);
						}
					}else if (typ=='user'){
						this.ownerRoleCombox.hide();
						this.ownerRoleCombox.disable();
						this.ownerUserCombox.enable();
						this.ownerUserCombox.show();
						if(this.rt.getOwner())
							this.ownerUserCombox.setValue(this.rt.getOwner());
					}
				}else{
					this.ownerRoleCombox.hide();
					this.ownerRoleCombox.disable();
					this.ownerUserCombox.hide();
					this.ownerUserCombox.disable();
					var conn=new Ext.data.Connection();
					conn.request({    
							method: 'GET', 
							url:'/dev/workflow/popup/getOptions.jcp?type=result&pathType='+typ+'&parent_id='+this.parent_id+'&rand='+Math.random()
					});    
					conn.on('requestcomplete', function(conn, oResponse ){	
						var resultJSON = Ext.decode(oResponse.responseText);
						this.wt=resultJSON.workflowType;
						this.ownerCombox.enable();
						this.ownerCombox.show();
						var stategyArray=Ext.decode(resultJSON.roleArray);
						this.relativeOwnerDs.loadData(stategyArray);
						if(this.rt.getOwner())
							this.ownerCombox.setValue(this.rt.getOwner());
						}, this) ;
				}
			}else {
				this.ownerRoleCombox.hide();
				this.ownerRoleCombox.disable();
				this.ownerUserCombox.hide();
				this.ownerUserCombox.disable();
				this.ownerCombox.enable();
				this.ownerCombox.show();
				this.relativeOwnerDs.loadData(this.relativeArray);
				if(this.rt.getOwner())
					this.ownerCombox.setValue(this.rt.getOwner());
			}	
		},this);  
		this.pathType.fireEvent("select"); 
		if(this.resultType!='0'){
			this.conditionsCombox.hide();
		}else{
			this.conditionsCombox.setValue(this.conditionsType);
		}
    },
	windowCancel : function(){
		this.normalClose=true;
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.cell.setAttribute('label',fm.findField('ResultName').getValue());	
		this.rt.setDisplayName(fm.findField('ResultName').getValue());
		this.rt.setOldStatus(fm.findField('oldStatus').getValue());
		this.rt.setStatus(fm.findField('currentStatus').getValue());

		var typ=this.pathType.getValue();
		if (typ=='absStrategy'||typ=='relStrategy'||typ=='relative'){
			this.rt.setOwner(fm.findField('owner').getValue());
		}else if(typ=='role'){
			this.rt.setOwner('a:'+fm.findField('ownerRole').getValue());
		}else{
			this.rt.setOwner(fm.findField('ownerUser').getValue());
		}
		this.rt.setId(fm.findField('ResultId').getValue());

		this.rt.removePreFunctions();
		var preFunctionArray=this.preFuctionGrid.getPrefunctions();
		for(var i=0;i<preFunctionArray.length;i++){
			this.rt.addPreFunctions(preFunctionArray[i]);
		}
		this.rt.removePostFunctions();
		var postFunctionArray=this.postFuctionGrid.getPostfunctions();
		for(var i=0;i<postFunctionArray.length;i++){
			this.rt.addPostFunctions(postFunctionArray[i]);
		}
		if(this.targetStyle=='rounded'){
			this.rt.setStep(this.targetId);	
		}else if(this.targetStyle=='rhombus'){
			this.rt.setSplit(this.targetId);	
		}else if(this.targetStyle=='symbol;image=examples/images/symbols/fork.png'){
			this.rt.setJoin(this.targetId);	
		}
		if(this.resultType=='0'){      
			this.result.removeConditions();
			var conditionArray=this.conditionGrid.getConditions();
			if(conditionArray.length>0){
				var conditions=new XConditions();
				conditions.setType(fm.findField('conditionsType').value);
				var conditionArray=this.conditionGrid.getConditions();
				for(var i=0;i<conditionArray.length;i++){
					conditions.addCondition(conditionArray[i]);
				}
				this.result.setConditions(conditions);
				this.result.setResult(this.rt);
				this.returnResult=this.result;
				this.normalClose=false;
				this.win.close();
			}else{
				Ext.msg("error",'设定了条件成果必须设定条件!'.loc());
			}
		}else{
			this.returnResult=this.rt;
			this.normalClose=false;
			this.win.close();
		}
    }
});
