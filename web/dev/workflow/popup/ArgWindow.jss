Ext.namespace("dev.workflow.popup");

dev.workflow.popup.ArgWindow = function(parent_id,wf,argname,argval){

	this.win;
	this.wf=wf;
	this.argname=argname;
	this.argval=argval;

	this.argKey;

    var fm = Ext.form;

	this.statusDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['排队中'.loc(), '排队中'.loc()],
			['处理中'.loc(), '处理中'.loc()],
			['完成'.loc(), '完成'.loc()]
		]
	});

	function isEmty(s){
		for(var i in s)
			return false;
		return true;
	}

    var steps=wf.getSteps();
	var stepArray=new Array;
	var n=0;
	if(!isEmty(steps)){
		for(var i in steps){
			stepArray[n]=new Array;
			stepArray[n][0]=steps[i].getId();
			stepArray[n][1]=steps[i].getName();
			n++;
		}
	}

	this.stepDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:stepArray
	});

	var progParams={};
	progParams['type']='logicProgram';
	progParams['parent_id']=parent_id;

	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/workflow/popup/getOptions.jcp?',
			method : 'GET'
		}),
		baseParams:progParams,
		reader: new Ext.data.JsonReader({
          	root: 'programs'
        }, [
			{name: 'id', mapping: 'id'},
			{name: 'label', mapping: 'label'}
		]),
		remoteSort: false
	});

	this.baseForm = new Ext.FormPanel({
		id:'arg',
        labelWidth: 160, 
		labelAlign: 'right',
        border:false,
        bodyStyle:'padding:10px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
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
						this.programColum=new fm.ComboBox({
							fieldLabel: '逻辑程序'.loc(),
							name: 'program',
							disable:false,
							width: 160,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							store:this.ds,
							allowBlank:false,
							blankText:'至少选择一个逻辑程序.'.loc()
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
						this.stepColum=new fm.ComboBox({
							fieldLabel: '步骤'.loc(),
							name: 'step',
							width: 160,
							store:this.stepDs,
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							allowBlank:false,
							blankText:'至少选择一个步骤.'.loc()
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
						this.statusColum=new fm.ComboBox({
							fieldLabel: '状态'.loc(),
							store:this.statusDs,
							name: 'step_status',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local',
							allowBlank:false,
							blankText:'至少选择一个步骤.'.loc()
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
					labelWidth: 100, 
					labelAlign: 'top',
				   items: [	
					   this.scriptColum=new Ext.form.TextArea({
								fieldLabel: 'BeanShell脚本'.loc(),
								name: 'script',
								width: 350,
								height:130,
								allowBlank:false,
								blankText:'至少选择一个步骤.'.loc()
						})
					 ]}
			]
		}
	]
	});


//-------------------------页面设定----------------------------------------------------------------

	this.win =  new Ext.Window({
		title:'变量设定'.loc(),
		layout:'fit',
		width:420,
		height:250,
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
Ext.extend(dev.workflow.popup.ArgWindow, Ext.Window, {
	show : function(){
		this.win.on('show',function(){
				var staVal='';
				var commonVal='';
				if(this.argval){
					if(this.argname.indexOf('check.status')!=-1){
						commonVal=this.argval[0][1];
						staVal=this.argval[1][1];
					}else if(this.argname.indexOf('beanshell')!=-1||this.argname.indexOf('bsh')!=-1){
						commonVal=this.argval[0][1];
					}else{
						commonVal=this.argval[0][1];
					}
					if(this.argname.indexOf('beanshell')!=-1||this.argname.indexOf('bsh')!=-1){
						this.scriptColum.setValue(commonVal);
					}else if(this.argname.indexOf('set.logic')!=-1||this.argname.indexOf('set.Notify')!=-1){
						this.programColum.setValue(commonVal);
					}else if(this.argname.indexOf('deny.owner')!=-1||this.argname.indexOf('allow.owner.only')!=-1){
						this.stepColum.setValue(commonVal);
					}else if(this.argname.indexOf('check.status')!=-1){
						this.stepColum.setValue(commonVal);
						this.statusColum.setValue(staVal);
					}else if(this.argname.indexOf('set.most.recent.owner')!=-1){
						this.stepColum.setValue(commonVal);
					}
				}
				if(this.argname.indexOf('beanshell')!=-1||this.argname.indexOf('bsh')!=-1){
					this.programColum.hide();
					this.scriptColum.show();
					this.statusColum.hide();
					this.stepColum.hide();
				}else if(this.argname.indexOf('set.logic')!=-1||this.argname.indexOf('set.Notify')!=-1){
					this.programColum.show();
					this.scriptColum.hide();
					this.statusColum.hide();
					this.stepColum.hide();
				}else if(this.argname.indexOf('deny.owner')!=-1||this.argname.indexOf('allow.owner.only')!=-1){
					this.programColum.hide();
					this.scriptColum.hide();
					this.statusColum.hide();
					this.stepColum.show();
				}else if(this.argname.indexOf('check.status')!=-1){
					this.programColum.hide();
					this.scriptColum.hide();
					this.statusColum.show();
					this.stepColum.show();
				}else if(this.argname.indexOf('set.most.recent.owner')!=-1){
					this.programColum.hide();
					this.scriptColum.hide();
					this.statusColum.hide();
					this.stepColum.show();
				}
		}.createDelegate(this),this);
		this.win.show(this);
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		var argValue='';
		if(this.argname.indexOf('beanshell')!=-1||this.argname.indexOf('bsh')!=-1){
			if(fm.findField('script').isValid()){
				argValue =fm.findField('script').getValue();
			}else{
				Ext.msg('error', '请修改表单中标识的错误!'.loc());
				return false;
			}
		}else if(this.argname.indexOf('set.logic')!=-1||this.argname.indexOf('set.Notify')!=-1){
			if(fm.findField('program').isValid()){
				if(fm.findField('program').getValue()=='0'){
					Ext.msg('error', '未选定定制业务逻辑程序,工作流不能正常运行!'.loc());
					return false;
				}else{
					argValue = fm.findField('program').getValue();
				}
			}else{
				Ext.msg('error', '请修改表单中标识的错误!'.loc());
				return false;
			}
		}else if(this.argname.indexOf('deny.owner')!=-1||this.argname.indexOf('allow.owner.only')!=-1){
			if(fm.findField('step').isValid()){
				argValue =fm.findField('step').getValue();
			}else{
				Ext.msg('error', '请修改表单中标识的错误!'.loc());
				return false;
			}
		}else if(this.argname.indexOf('check.status')!=-1){
			if(fm.findField('step').isValid()&&fm.findField('step_status').isValid()){
				argValue=fm.findField('step').getValue()+':'+fm.findField('step_status').getValue();
			}else{
				Ext.msg('error', '请修改表单中标识的错误!'.loc());
				return false;
			}
		}else if(this.argname.indexOf('set.most.recent.owner')!=-1){
			if(fm.findField('step').isValid()){
				argValue =fm.findField('step').getValue();
			}else{
				Ext.msg('error', '请修改表单中标识的错误!'.loc());
				return false;
			}
		}
		this.argKey=argValue;
		this.win.close();
    }
});