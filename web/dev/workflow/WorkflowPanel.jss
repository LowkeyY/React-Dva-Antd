Ext.namespace("dev.workflow");

dev.workflow.WorkflowPanel = function(frames){
	this.frames = frames;
	var ButtonArray=[];
	this.params={};
	this.textChangeFlag=false;
	Workflow=this.frames.get('Workflow');
	this.retFn = function(main){
		main.setActiveTab("workflowPanel");
		main.setStatusValue(['工作流基础管理'.loc()]);
	}.createCallback(Workflow.mainPanel);

	this.initDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['1', '程序'.loc()],
			['2', '页面'.loc()]//,
			//['3', '自动'],
			//['4', '远程调用']
		]
	});

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'clear',
				text: '清空'.loc(),
				icon: '/themes/icon/xp/clear.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newform',
				text: '新建步骤表单'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'set',
				text: '流程设置'.loc(),
				icon: '/themes/icon/common/set.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'workflowUpdatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/xp/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));


	this.workflowForm = new Ext.FormPanel({
        labelWidth: 160, 
		labelAlign: 'right',
		id: 'workflowPanel',
		cached:true,
        url:'/dev/workflow/create.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.40,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '逻辑名称'.loc(),
							name: 'workflowlogic_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'逻辑名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							width: 160,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText:'逻辑名称必须提供.'.loc()
						})
					 ]},
			   {
					columnWidth:0.60,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.TextField({
							fieldLabel: '物理名称'.loc(),
							name: 'workflowphy_name',
							
							width: 160,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText:'物理名称必须提供.'.loc()
						})
					 ]
				}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.40,
				   layout: 'form',
				   
				   border:false,
				   items: [	
						new Ext.form.ComboBox({
							fieldLabel: '启动方式'.loc(),
							store:this.initDs,
							name: 'program_init',
							minLength:1,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local'
						})
					 ]}, 
			   {
					columnWidth:0.60,
					layout: 'form',
					
					border:false,
					items: [	
						new Ext.form.RadioGroup({
							fieldLabel: '保留审批记录'.loc(),
							width:80,
							name:'save_record',
							items: [
								{boxLabel: '是'.loc(), name: 'save_record', inputValue:'y',checked: true},
								{boxLabel: '否'.loc(), name: 'save_record', inputValue:'n'}
							]
						})
					 ]
				}
			]
		},		
		{
			layout:'column',
			border:false,
            items:
			[
				{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextArea({
							fieldLabel: '说明'.loc(),
							name: 'note',
							width: 550,
							height:60,
							maxLength : 1000,
							maxLengthText : '系统说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.workflowForm;
};

dev.workflow.WorkflowPanel.prototype={
	init : function(params){
		if(this.MainTabPanel.rendered){
			var  tempToolBar=this.workflowForm.getTopToolbar();	
			if(params['nodeType']=='1'){
				tempToolBar.items.each(function(item){ 
					if(item.btnId=='save')
						item.disable();
				}, tempToolBar.items);
			}else if(params['nodeType']=='32'){
				tempToolBar.items.each(function(item){ 
					if(item.btnId=='save')
						item.enable();
				}, tempToolBar.items);
			}
			//document.onmousemove=function(){return true;}
			this.toggleToolBar('create');
			this.params = params;
			this.params['type']='new';
			this.workflowForm.form.reset();
			this.frames.get("Workflow").mainPanel.setStatusValue(['工作流基础管理'.loc(),params.parent_id,'无'.loc(),'无'.loc()]);
		}
	},
	formEdit : function(){
		//document.onmousemove=function(){return true;}
		this.toggleToolBar('edit');
    },
	loadData : function(params){	
		this.params = params;
		this.params['type']='edit';
		this.workflowForm.load({
			url:'/dev/workflow/create.jcp?parent_id='+params.parent_id+"&rand="+Math.random(),
			method:'GET',
			scope:this,
			success:function(frm,action){
				var data = action.result.data;
				this.frames.get("Workflow").mainPanel.setStatusValue(['工作流基础管理'.loc(),data.object_id,data.lastModifyName,data.lastModifyTime]);
			}
		});
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.workflowForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	onButtonClick : function(item){
		var frm=this.workflowForm.form;
		if(item.btnId=='clear'){
			this.workflowForm.form.reset();
		}else if(item.btnId=='save'){
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立工作流基础定义'.loc());
			}else{
				var saveParams=this.params;
				saveParams['save_record']=this.workflowForm.form.findField('save_record').getValue();
				saveParams['program_init']=this.workflowForm.form.findField('program_init').getValue();
				saveParams['type']='save';
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/workflow/create.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Workflow.navPanel.getTree().loadSubNode(action.result.id,Workflow.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}
		}else if(item.btnId=='workflowUpdatesave'){
			  var saveParams=this.params;	
				saveParams['save_record']=this.workflowForm.form.findField('save_record').getValue();
				saveParams['program_init']=this.workflowForm.form.findField('program_init').getValue();
			    saveParams['type']='updatesave';
			  if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/workflow/create.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Ext.msg("info", '保存成功'.loc());
							Workflow.navPanel.getTree().loadSelfNode(action.result.id,Workflow.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '警告:删除工作流将不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['parent_id']=this.params['parent_id'];
						frm.submit({ 
							url:'/dev/workflow/create.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								Workflow.navPanel.getTree().loadParentNode(Workflow.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
             }.createDelegate(this));
		}else if(item.btnId=='newform'){
			var newParams={};
			newParams=this.params;
			newParams['type']='new';
			if(!Workflow.mainPanel.havePanel("ActPanel")){
				using("dev.workflow.act.ActPanel");
				Workflow.actPanel = new dev.workflow.act.ActPanel(this.frames,this.retFn);  
				Workflow.mainPanel.add(Workflow.actPanel.MainTabPanel);
			}
			Workflow.mainPanel.setActiveTab(Workflow.actPanel.MainTabPanel);
			Workflow.actPanel.init(newParams,Workflow.mainPanel);
		}else if(item.btnId=='set'){
			var loadWorkflow=function(){
				using("dev.workflow.XWorkflow");
				using("dev.workflow.DesignPanel");   
				
				var newParams={};
				newParams=this.params;
				newParams.retFn = this.retFn;	
				Workflow.designPanel = this.frames.createPanel(new dev.workflow.DesignPanel(newParams,Workflow,'workflow')); 
				Workflow.mainPanel.add(Workflow.designPanel.MainTabPanel);
				Workflow.mainPanel.setActiveTab(Workflow.designPanel.MainTabPanel);
				Workflow.params=newParams;                 
				Workflow.designPanel.init();
			}.createDelegate(this);
			if(Ext.isIE){
				useJS(
					["/dev/workflow/mxclient-ie.js","/dev/workflow/mxApplication.js"],loadWorkflow
				);
			}else{
				useJS(
					["/dev/workflow/mxclient-ff.js","/dev/workflow/mxApplication.js"],loadWorkflow
				);
			}
		}
    }
};

