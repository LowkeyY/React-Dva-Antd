

bin.user.RolePanel = function(retFn){
	var ButtonArray=[];

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'backToList',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : true,
				scope: this,
				state:'create',
				handler :retFn
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : true,
				scope: this,
				state:'create',
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'clear',
				text: '清空'.loc(),
				icon: '/themes/icon/xp/clear.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'create',
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'backToList1',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : true,
				scope: this,
				state:'edit',
				handler :retFn
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'updatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Spacer());

	this.roleForm = new Ext.FormPanel({
        labelWidth: 160, 
		labelAlign: 'right',
		id: 'roleCreatePanel',
		cached:false,
        url:'/bin/user/rolecreate.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
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
							fieldLabel: '职位名称'.loc(),
							name: 'roles',
							
							width: 150,
							maxLength : 60,
							allowBlank:false,
							maxLengthText : '职位名称不能超过{0}个字符!'.loc(),
							blankText:'职位名称必须提供.'.loc()
						})
					 ]},
			   {
					columnWidth:0.55,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.ComboBox({
							fieldLabel: '称谓'.loc(),
							name: 'roleName',
							typeAhead: false,
							width:150,
							mode: 'local',
							editable: true,
							triggerAction: 'all',
							displayField: 'roleArrayLabel',
							listClass: 'category-element',
							emptyText: '选择或输入称谓'.loc(),
							valueField: 'roleArrayID'
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
				{	columnWidth:1.0,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.ComboBox({
							fieldLabel: '级别'.loc(),
							name: 'position',
							typeAhead: false,
							width:150,
							mode: 'local',
							editable: true,
							triggerAction: 'all',
							displayField: 'label',
							listClass: 'category-element',
							emptyText: '选择或输入职位'.loc(),
							valueField: 'id'
						})
					 ]
				}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.NumberField({
							fieldLabel: '优先顺序'.loc(),
							name: 'sort_id',
							qtip:{
								text:'数值越小，显示越靠前。'.loc()
							},
							width:150
						})
			]},{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextArea({
							fieldLabel: '职责说明'.loc(),
							name: 'duty',
							
							width: 550,
							height:60,
							maxLength : 500,
							maxLengthText : '职责说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
	tbar:ButtonArray});

	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({   
			url: '/bin/user/rolecreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["roleId","roles","roleName","positionId","duty","roleNameArray","positionArray","entry_person","entry_date","sortId"]),
		remoteSort: false
	});
	this.MainTabPanel=this.roleForm;
};		
bin.user.RolePanel.prototype={
	formCreate : function(params){		
		this.frames.set('state','input');
		this.toggleToolBar('create');
		params['type']='new';	
		this.formDS.baseParams = params;
		this.formDS.on('load', this.initCombox, this);
		this.formDS.load({params:{start:0, limit:1}});
		this.frames.get("Role").mainPanel.setStatusValue(['职位管理'.loc(),params.dept_id]);
    },
	formEdit : function(){
		this.frames.set('state','input');
		this.toggleToolBar('edit');
		this.setReadOnly(this.roleForm.form,false);
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.roleForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	loadData : function(params){	
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({params:{start:0, limit:1}});
    },
	setReadOnly: function(frm, bReadOnly){
		frm.items.each(function(f){
			if (f){
				if (f.isFormField){
					f.getEl().dom.readOnly = bReadOnly;  
					if (f instanceof Ext.form.TriggerField){
					  f.setDisabled(bReadOnly);
					  if (f instanceof Ext.form.ComboBox)
						f.setEditable(!bReadOnly);         
					}
				 }
			}
		});
	},
	renderForm: function(){	
		var frm = this.roleForm.form;
		var dss = this.formDS.getAt(0).data;
		this.initCombox();
		frm.findField('roles').setValue(dss.roles);
		frm.findField('duty').setValue(dss.duty);
		frm.findField('roleName').setValue(dss.roleName);	
		frm.findField('position').setValue(dss.positionId);
		frm.findField('sort_id').setValue(dss.sortId);
		this.frames.get("Role").mainPanel.setStatusValue(['职位管理'.loc(),dss.roleId,dss.entry_person,dss.entry_date]);
	},
	initCombox: function(){	
		var store = new Ext.data.SimpleStore({
			fields: ['roleArrayID', 'roleArrayLabel'],
			data : Ext.util.JSON.decode(this.formDS.getAt(0).data.roleNameArray)
		});
		this.roleForm.form.findField('roleName').store=store;

		var store_position  = new Ext.data.SimpleStore({
			fields: ['id','label'],
			data: Ext.util.JSON.decode(this.formDS.getAt(0).data.positionArray)
		});
		this.roleForm.form.findField('position').store= store_position;
		this.roleForm.form.reset();
	},
	onButtonClick : function(item){
		var frm=this.roleForm.form;
		var Role=this.frames.get('Role');
		if(item.btnId=='save'){
			var saveParams=this.formDS.baseParams;
			saveParams['type']='save';
			saveParams['roleName']=this.roleForm.form.findField('roleName').getValue();
			saveParams['positionId']=this.roleForm.form.findField('position').getValue();
			saveParams['sortId']=this.roleForm.form.findField('sort_id').getValue();
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/bin/user/rolecreate.jcp',
					params:saveParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						var listParams={};
						listParams['dept_id']= this.formDS.baseParams['dept_id'];
						Role.roleListPanel.showList(listParams);
						Role.mainPanel.setActiveTab("RoleListPanel");
					},								
					failure: function(form, action) {
						Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc()); 
            }
		}else if(item.btnId=='clear'){
			this.roleForm.form.reset();
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};						
						delParams['type']='delete';
						delParams['roleId']=this.formDS.baseParams['roleId'];
						 frm.submit({ 
							url:'/bin/user/rolecreate.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								var listParams={};
								listParams['dept_id']= this.formDS.baseParams['dept_id'];
								Role.roleListPanel.showList(listParams);
								Role.mainPanel.setActiveTab("RoleListPanel");
							},								
							failure: function(form, action) {
								    Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
               }.createDelegate(this));
		}else if(item.btnId=='updatesave'){
		    if (frm.isValid()) {
			  var updateParams=this.formDS.baseParams;
			  updateParams['roleName']=this.roleForm.form.findField('roleName').getValue();
			  updateParams['positionId']=this.roleForm.form.findField('position').getValue();
			  updateParams['roleId']=this.formDS.baseParams['roleId'];
			  updateParams['sortId']=this.roleForm.form.findField('sort_id').getValue();
			  updateParams['type']='updatesave';

			 frm.submit({ 
					url:'/bin/user/rolecreate.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						var listParams={};
						listParams['dept_id']= this.formDS.baseParams['dept_id'];
						Role.roleListPanel.showList(listParams);
						Role.mainPanel.setActiveTab("RoleListPanel");
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='backToView'){ 
			var backParams=this.formDS.baseParams;
			backParams['type']='view';
			this.formView(backParams);
		}
    }
};