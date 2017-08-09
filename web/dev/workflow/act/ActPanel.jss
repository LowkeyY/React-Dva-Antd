Ext.namespace("dev.workflow.act");

dev.workflow.act.ActPanel = function(frames,retFn){

	this.frames = frames;	

	var ButtonArray=[];
	this.params={};

	ButtonArray.push(new Ext.Toolbar.Button({
				id:'back',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :retFn
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				id:'save',
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
				id:'clear',
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
				id:'updatesave',
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
				id:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/xp/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));


	this.frameType=new Ext.form.ComboBox({
				fieldLabel: '框架类别'.loc(),
				store:new Ext.data.SimpleStore({
					fields:['id', 'label'],
					data:[
						['1','主窗口'.loc()],
						['3','上下框架'.loc()]
					]
				}),
				name: 'frame_type',
				valueField:'id',
				displayField:'label',
				triggerAction : 'all',
				mode:'local'
	});

	this.frameType.on('select',function(comb){
		var show=[
			[false,false],
			[true,true],
			['up_height','down_height']
		];
		var fm=this.actForm.form;
		var types=comb.getValue()*1-1;
		if(!types) types=0;
		for(var i=0;i<2;i++){
			var field=fm.findField(show[2][i]);
			field.setVisible(field.allowBlank=show[types][i]);
		}
	},this);

	this.actForm = new Ext.FormPanel({
		id: 'ActPanel',
        labelWidth: 160, 
		labelAlign: 'right',
		cached:false,
        url:'/dev/workflow/act/create.jcp',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [
						new Ext.form.TextField({
							fieldLabel: '逻辑名称'.loc(),
							name: 'act_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'逻辑名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							width: 160,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText:'逻辑名称必须提供.'.loc()
						})
					 ]
				},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '物理名称'.loc(),
							name: 'act_pname',		
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
					columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [		
						this.frameType
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
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [
					   {
							xtype:'numberfield',
							fieldLabel: '上框架高度'.loc()+'(%)',
							name: 'up_height',
							minValue: 1,
							maxValue: 100,
							value:40,
							width: 100,
							allowBlank:false,
							blankText:'上框架高度必须提供.'.loc()
						}
					 ]
				},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,
				   items: [				
						{
							xtype:'numberfield',
							fieldLabel: '下框架高度'.loc()+'(%)',
							name: 'down_height',
							minValue: 1,
							maxValue: 100,
							value:60,
							width: 100,
							allowBlank:false,
							blankText:'下框架高度必须提供.'.loc()
						}
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
							
							width: 350,
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
	this.MainTabPanel=this.actForm;
};

dev.workflow.act.ActPanel.prototype={
	init : function(params,main){	
		this.params = params;
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.actForm.form.reset();
			main.setStatusValue(['工作流表单管理'.loc(),"",'无'.loc(),'无'.loc()]);
		}
	},
	loadData : function(params,main){	
		this.params = params;
		this.actForm.form.load({
			method:'GET',
			params:params,
			scope:this,
			success:function(fm,action){
				var data=action.result.data;
				this.frameType.fireEvent("select",this.frameType);
				this.frameType.disable();
				this.toggleToolBar('edit');
				main.setStatusValue(['工作流表单管理'.loc(),params.parent_id,data.lastModifyName,data.lastModifyTime]);
			}
		});   
    },
	toggleToolBar : function(state){	
		this.actForm.getTopToolbar().items.each(function(item){    
			item.setVisible(item.state==state);
		});
    },
	onButtonClick : function(item){
		var Workflow=this.frames.get('Workflow');
		var frm=this.actForm.form;
		if(item.id=='clear'){
			this.actForm.form.reset();
		}else if(item.id=='save'){
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立工作流基础定义'.loc());
			}else{
				var saveParams=this.params;
				saveParams['frame_type']=this.actForm.form.findField('frame_type').getValue();	
				saveParams['type']='save';
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/workflow/act/create.jcp',
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
		}else if(item.id=='updatesave'){
			  var saveParams=this.params;
				saveParams['frame_type']=this.actForm.form.findField('frame_type').getValue();	
			    saveParams['type']='updatesave';
			  if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/workflow/act/create.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Workflow.navPanel.getTree().loadSelfNode(action.result.id,Workflow.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
		}else if(item.id=='delete'){
			 Ext.msg('confirm', '警告:删除工作流表单将不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['parent_id']=this.params['parent_id'];
						frm.submit({ 
							url:'/dev/workflow/act/create.jcp',
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
		}
    }
};

