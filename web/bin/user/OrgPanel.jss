

bin.user.OrgPanel = function(frames){
	this.frames = frames;
	this.params;
	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'new',
				text: '新建部门'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
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

	this.orgForm = new Ext.form.FormPanel({
        labelWidth: 160, 
		labelAlign: 'right',
		id: 'orgPanel',
		cached:true,
        url:'/bin/user/createOrg.jcp',
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
							fieldLabel: '单位名称'.loc(),
							name: 'shortName',
							width: 150,
							maxLength : 20,
							qtip:{
								text:'在正常情况下主要显示此名称'.loc()
							},
							allowBlank:false,
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'单位名称中不应有'.loc()+'&,<,>,\',\",'+'字符'.loc(),        
							blankText:'单位名称必须提供.'.loc(),
							maxLengthText : '单位名称不能超过{0}个字符!'.loc()   
						})
					 ]},
			   {
					columnWidth:0.55,
					layout: 'form',
					border:false,
					items: [				
						
						new Ext.form.TextField({
							fieldLabel: '单位全称'.loc(),
							name: 'orgName',
							width: 250,
							maxLength : 150,
							allowBlank:false,
							maxLengthText : '单位名称不能超过{0}个字符!'.loc(),
							blankText:'单位名称必须提供.'.loc()
						})
					 ]
				}
			]
		},{
			layout:'column',
			border:false,
            items:
			[
				{  columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [		
				   new Ext.form.ComboBox({
							fieldLabel: '单位类别'.loc(),
							name: 'orgType',
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
					 ]},
			   {
					columnWidth:0.55,
					layout: 'form',
					border:false,
					items: [				
						
						new Ext.form.TextField({
							fieldLabel: '单位主页'.loc(),
							name: 'webpage',
							width: 250,
							maxLength : 150,
							maxLengthText : '单位主页不能超过{0}个字符!'.loc()
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
							fieldLabel: '单位备注'.loc(),
							name: 'note',							
							width: 695,
							height:60,
							maxLength : 2000,
							maxLengthText : '系统说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
     tbar:ButtonArray});

	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/bin/user/createOrg.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["shortName","orgName","orgType","webpage","note","createDate","createDateModify"]),
		remoteSort: false
	});
	this.MainTabPanel=this.orgForm;
};


bin.user.OrgPanel.prototype={
	formCreate : function(params){	
		this.toggleToolBar('create');
		params['type']='new';
		if(params.dept_id=='0'){
			this.backup.hide();
		}
		this.params=params;
		this.loadData(params);
		this.setReadOnly(this.orgForm.form,false);
		this.frames.get("Dept").mainPanel.setStatusValue(['机构管理'.loc()]);
		
    },
	formEdit : function(){   
		this.toggleToolBar('edit');
		this.setReadOnly(this.orgForm.form,false);
    },
	loadData : function(params){
		this.formDS.baseParams=params;
		Ext.Ajax.request( {
			url : '/bin/user/createOrg.jcp?dept_id='+params.dept_id+"&type="+params.type+"&ra="+Math.random(),
			scope:this,
			callback : function(options, success, response) {
				var ret=Ext.decode(response.responseText);
				//this.initCombox(Ext.decode(ret.dept));
				this.initCombox("111");
				var fm=this.orgForm.form;
				fm.setValues(ret);
				fm.clearInvalid();
				if(params.type=='new')
					this.frames.get("Dept").mainPanel.setStatusValue(['机构管理'.loc(),params.dept_id]);
				else
					this.frames.get("Dept").mainPanel.setStatusValue(['机构管理'.loc(),params.dept_id,"",ret.createDateModify]);
			}
		});
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.orgForm.getTopToolbar();
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
		var orgType=this.orgForm.form.findField('orgType');
		var store = new Ext.data.SimpleStore({
			fields: ['id', 'label'],
			//data : data,
			data :[
			['0', '企业'.loc()],
			['1', '政府'.loc()]
			]
		});
		orgType.store=store;
	},
	onButtonClick : function(item){
		var frm=this.orgForm.form;	
		var Dept = this.frames.get("Dept");
		if(item.btnId=='new'){
			var newParams=this.formDS.baseParams;
			newParams['type']='new';
			if(!Dept.mainPanel.havePanel("deptPanel")){
				using("bin.user.DeptPanel");
				Dept.deptPanel = new bin.user.DeptPanel(this.frames);
				Dept.mainPanel.add(Dept.deptPanel.MainTabPanel);
			}
			Dept.mainPanel.setActiveTab("deptPanel");
			Dept.deptPanel.formCreate(newParams);
		}else if(item.btnId=='updatesave'){
		    if (frm.isValid()) {
				  var updateParams=this.formDS.baseParams;
				  updateParams['orgType']=this.orgForm.form.findField('orgType').getValue();
				  updateParams['type']='updatesave';
				  frm.submit({ 
					url:'/bin/user/createOrg.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){
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
		}
    }
};

