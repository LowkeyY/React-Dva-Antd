

bin.user.DeptPanel = function(frames){
	this.frames = frames;
	var ButtonArray=[];
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
				state:'create',
				hidden : true,
				handler :this.onButtonClick
	}));
	
	this.backup = new Ext.Toolbar.Button({
				btnId:'backup',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : true,
				scope: this,
				state:'create',
				//handler :this.params.retFn
				handler :this.onButtonClick
	});
	ButtonArray.push(this.backup);
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'new',
				text: '新建'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
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
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				state:'edit',
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'updatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				state:'edit',
				hidden : true,
				handler :this.onButtonClick
	}));

	this.deptForm = new Ext.form.FormPanel({
        labelWidth: 160, 
		labelAlign: 'right',
		id: 'deptPanel',
		cached:true,
        url:'/bin/user/create.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
       items: [
	   {
			layout:'column',
			border:false,
            items:
			[
				{  columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [		
				   new Ext.form.TextField({
							fieldLabel: '名称'.loc(),
							name: 'shortName',
							width: 150,
							maxLength : 20,
							qtip:{
								text:'在正常情况下主要显示此名称'.loc()
							},
							allowBlank:false,
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'简短名称中不应有'.loc()+'&,<,>,\',\",'+'字符'.loc(),        
							blankText:'简短名称必须提供.'.loc(),
							maxLengthText : '简短名称不能超过{0}个字符!'.loc()   
						})
					 ]},
			   {
					columnWidth:0.55,
					layout: 'form',
					border:false,
					items: [				
						
						new Ext.form.TextField({
							fieldLabel: '单位全称'.loc(),
							name: 'deptName',
							width: 250,
							maxLength : 150,
							allowBlank:false,
							maxLengthText : '单位名称不能超过{0}个字符!'.loc(),
							blankText:'单位名称必须提供.'.loc()
						})
					 ]
				}
			]
		},
		{
			layout:'form',
			border:false,
            items:[
				new Ext.form.ComboBox({
							fieldLabel: '单位类别'.loc(),
							name: 'deptType',
							typeAhead: true,
							width:150,
							mode: 'local',
							editable: false,
							allowBlank:false,
							triggerAction:'all',
							displayField: 'label',
							listClass: 'category-element',
							emptyText: '选择单位类别'.loc(),
							valueField: 'id'
						})
		]},{
			layout:'column',
			border:false,
            items:
			[{
					columnWidth:1.0,
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
					 ]
				},  {
					columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.TextField({
							fieldLabel: '创建时间'.loc(),
							name: 'createDate',
							width:150,
							disabled :true
						})
					 ]
				}
			]
		}
	],
     tbar:ButtonArray});

	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/bin/user/create.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["shortName","deptName","deptType","dept","createDate","createDateModify"]),
		remoteSort: false
	});
	this.MainTabPanel=this.deptForm;
};


bin.user.DeptPanel.prototype={
	formCreate : function(params){	
		this.toggleToolBar('create');
		params['type']='new';
		if(params.dept_id=='0'){
			this.backup.hide();
		}
		this.loadData(params);
		this.setReadOnly(this.deptForm.form,false);
		this.frames.get("Dept").mainPanel.setStatusValue(['部门管理'.loc()]);
		
    },
	formEdit : function(){   
		this.toggleToolBar('edit');
		this.setReadOnly(this.deptForm.form,false);
    },
	loadData : function(params){
		this.formDS.baseParams=params;
		Ext.Ajax.request( {
			url : '/bin/user/create.jcp?dept_id='+params.dept_id+"&type="+params.type+"&ra="+Math.random(),
			scope:this,
			callback : function(options, success, response) {
				var ret=Ext.decode(response.responseText);
				this.initCombox(Ext.decode(ret.dept));
				var fm=this.deptForm.form;
				fm.setValues(ret);
				fm.clearInvalid();
				if(params.type=='new')
					this.frames.get("Dept").mainPanel.setStatusValue(['部门管理'.loc(),params.dept_id]);
				else
					this.frames.get("Dept").mainPanel.setStatusValue(['部门管理'.loc(),params.dept_id,"",ret.createDateModify]);
			}
		});
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.deptForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
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
	initCombox: function(data){
		var deptType=this.deptForm.form.findField('deptType');
		var store = new Ext.data.SimpleStore({
			fields: ['id', 'label'],
			data :data
		});
		deptType.store=store;
	},
	onButtonClick : function(item){
		var frm=this.deptForm.form;	
		var Dept = this.frames.get("Dept");
		if(item.btnId=='new'){
			var newParams={};
			newParams['type']='new';
			newParams['dept_id']=this.formDS.baseParams['dept_id'];
			this.formCreate(newParams);
		}else if(item.btnId=='save'){
			var saveParams=this.formDS.baseParams;
			saveParams['type']='save';
			saveParams['deptType']=this.deptForm.form.findField('deptType').getValue();
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/bin/user/create.jcp',
					params:saveParams,
					method: 'POST',  
					scope:this,
					success:function(form, action){ 
						Dept.navPanel.getTree().loadSubNode(action.result.dept_id,Dept.navPanel.clickEvent);
						Ext.msg('info','数据保存成功!'.loc());
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败!,原因'.loc()+':<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='clear'){
			this.deptForm.form.reset();
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['dept_id']=this.formDS.baseParams['dept_id'];
						 frm.submit({ 
							url:'/bin/user/create.jcp',
							params:delParams,
							method: 'POST',  
							scope:this,
							success:function(form, action){ 
								Dept.navPanel.getTree().loadParentNode(Dept.navPanel.clickEvent);
							},								
							failure: function(form, action) { 
								  Ext.msg("warn",Ext.encode(action.result.message)+','+'请先删除子部门'.loc());
							}
						  });
				  } 
               }.createDelegate(this));
		}else if(item.btnId=='updatesave'){
		    if (frm.isValid()) {
				  var updateParams=this.formDS.baseParams;
				  updateParams['deptType']=this.deptForm.form.findField('deptType').getValue();
				  updateParams['type']='updatesave';
				  frm.submit({ 
					url:'/bin/user/create.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						if(Ext.isDefined(action.result.sortChange) && action.result.sortChange === true)
							Dept.navPanel.getTree().loadParentNode(Dept.navPanel.clickEvent);
						else
							Dept.navPanel.getTree().loadSelfNode(action.result.dept_id,Dept.navPanel.clickEvent);
						Ext.msg('info','数据更新成功!'.loc());
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因'.loc()+':<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='backup'){
			Dept.mainPanel.setActiveTab("orgPanel");
			Dept.mainPanel.setStatusValue(['机构管理'.loc()]);
		}
    }
};

