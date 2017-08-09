dev.system.UserTypePanel = function(frames,params){
	this.frames= frames;
	var System = this.frames.get("System");
	var ButtonArray=[];
	this.params=params;
	this.retFn = function(main){
		main.setActiveTab("systemUserType");
		main.setStatusValue(['用户组管理'.loc()]);
	}.createCallback(System.mainPanel);
	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/system/usertypecreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["object_id","user_type_name","user_type_desc","lastModifyTime","lastModifyName"]),
		remoteSort: false
	});
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'usertypeBack',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				hidden : true,
				scope: this,
				handler :this.params.retFn
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'usertypeSave',
				text: '保存'.loc(),
				state:'create',
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'usertypeClear',
				text: '清空'.loc(),
				state:'create',
				icon: '/themes/icon/xp/clear.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'usertypeUpdatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'usertypeDelete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	
	this.systemForm = new Ext.FormPanel({
		labelWidth: 100, 
		labelAlign: 'right',
		id: 'systemUserType',
		cached:true,
        url:'/dev/system/usertypecreate.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
        {
        	layout:'column',
			border:false,
            items:
			[
				{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '用户组名称'.loc(),
							name: 'user_type_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'用户组名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							width: 150,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '用户组名称不能超过{0}个字符!'.loc(),
							blankText:'用户组名称必须提供.'.loc()
						})
					 ]}
			]
        },{
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
							name: 'user_type_desc',
							width: 550,
							height:60,
							maxLength : 2000,
							maxLengthText : '说明不能超过{0}个字符!'.loc(),
							blankText:'说明必须提供.'.loc()
						})
					 ]}
			]
        }
        ],
        tbar:ButtonArray
	});
	this.MainTabPanel=this.systemForm;
}

dev.system.UserTypePanel.prototype={
	formCreate : function(params){		
		this.params=params;
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.frames.get("System").mainPanel.setStatusValue(['用户组管理'.loc()]);
		}
    },
    formEdit : function(){
		this.toggleToolBar('edit');
    },
	loadData : function(params){	
		this.params=params;
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({params:{start:0, limit:1}});
    },	
	toggleToolBar : function(state){	
		var  tempToolBar=this.systemForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){		
		var frm = this.systemForm.form;
		var dss = this.formDS.getAt(0).data;
		frm.findField('user_type_name').setValue(dss.user_type_name);
		frm.findField('user_type_desc').setValue(dss.user_type_desc);
		this.frames.get('System').mainPanel.setStatusValue(['用户组管理'.loc(),dss.object_id,dss.lastModifyName,dss.lastModifyTime]);    
	},
	onButtonClick : function(item){
		var System = this.frames.get("System");
		var frm=this.systemForm.form;
		if(item.btnId=='usertypeSave'){
			var saveParams=this.params;
			saveParams['type']='save';
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/dev/system/usertypecreate.jcp',
					params:saveParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						System.navPanel.getTree().loadSubNode(action.result.id,System.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='usertypeClear'){
			this.systemForm.form.reset();
		}else if(item.btnId=='usertypeDelete'){
			 Ext.msg('confirm', '警告:删除将导致您的数据不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
					 Ext.msg('confirm', '请再次确认是否删除用户组?'.loc(), function (answer){
						  if (answer == 'yes') {
								var delParams=this.params;
								delParams['type']='delete';
								frm.submit({ 
									url:'/dev/system/usertypecreate.jcp',
									params:delParams,
									method: 'post',  
									scope:this,
									success:function(form, action){ 
										System.navPanel.getTree().loadParentNode(System.navPanel.clickEvent);
									},								
									failure: function(form, action) {
										    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
									}
								 });
						  } 
					 }.createDelegate(this));
				  } 
             }.createDelegate(this),this);
		}else if(item.btnId=='usertypeUpdatesave'){
		    if (frm.isValid()) {
			 var updateParams=this.params;
			 updateParams['type']='updatesave';
			 frm.submit({ 
					url:'/dev/system/usertypecreate.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						System.navPanel.getTree().loadSelfNode(action.result.id,System.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}
	}
}