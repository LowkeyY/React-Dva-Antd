

dev.system.BasePanel = function(frames,from){

	this.frames=frames;

	var ButtonArray=[];
	this.state="create";
	this.params={};
	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/system/systemcreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["system_id","system_name","system_pname","system_type","current_stat","system_desc","creator","lastModifyTime","lastModifyName"]),
		remoteSort: false
	});
	this.statusDs = new Ext.data.SimpleStore({
		fields:['statusId', 'statusLabel'],
		data:[
			['0', '封存'.loc()],
			['1', '激活'.loc()],
			['2', '已发布'.loc()]
		]
	});
	this.typeDs = new Ext.data.SimpleStore({
		fields:['systemCode', 'systemName'],
		data:[
			['1', '企业软件'.loc()],
			['2', '个人软件'.loc()]
		]
	});

	var System =this.frames.get("System");
	this.retFn = function(main){
		main.setActiveTab("systemBase");
		main.setStatusValue(['系统管理'.loc()]);
	}.createCallback(System.mainPanel)
//初始化按钮

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
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
				btnId:'Systemclear',
				text: '清空'.loc(),
				state:'create',
				icon: '/themes/icon/xp/clear.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

if(from!='install'){
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'systemUpdatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
}
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'systemDelete',
				text: '卸载'.loc(),
				icon: '/themes/icon/xp/hsz.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
//---------------------查看状态下的按钮-------------------------------------------------

if(from!='install'){
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newtopmenu',
				text: '新建顶层导航'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newgroup',
				text: '新建程序组'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newdblink',
				text: '新建数据库链接'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newusertype',
				text: '新建用户组'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'systemAuth',
				text: '开发权限管理'.loc(),
				icon: '/themes/icon/all/lock_add.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'release',
				text: '生成安装文件'.loc(),
				icon: '/themes/icon/common/install.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

}
//系统初始化

	this.systemForm = new Ext.FormPanel({
        labelWidth: 100, 
		id: 'systemBase',
		cached:true,
		labelAlign: 'right',
        url:'/dev/system/systemcreate.jcp',
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
							fieldLabel: '系统名称'.loc(),
							name: 'system_name',							
							width: 160,
							maxLength : 24,
							allowBlank:false,
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'系统名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							maxLengthText : '系统名称不能超过{0}个字符!'.loc(),
							blankText:'系统名称必须提供.'.loc()
						})
					 ]},
			   {
					columnWidth:0.60,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.TextField({
							fieldLabel: '物理名称'.loc(),
							name: 'system_pname',							
							width: 160,
							maxLength : 16,
							allowBlank:false,
							maxLengthText : '系统名称不能超过{0}个字符!'.loc(),
							blankText:'系统名称必须提供.'.loc()
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
							fieldLabel: '系统类型'.loc(),
							store:this.typeDs,
							name: 'system_type',
							minLength:1,
							allowBlank:false,
							valueField:'systemCode',
							displayField:'systemName',
							triggerAction:'all',
							mode:'local'
						})
					 ]},
			   {
					columnWidth:0.60,
					layout: 'form',
					
					border:false,
					items: [		
						new Ext.form.ComboBox({
							fieldLabel: '当前状态'.loc(),
							lazyRender:true,
							name: 'current_stat',
							minLength:1,
							allowBlank:false,
							store:this.statusDs,
							valueField:'statusId',
							displayField:'statusLabel',
							triggerAction:'all',
							mode:'local'
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
							fieldLabel: '系统说明'.loc(),
							name: 'system_desc',							
							width: 550,
							height:60,
							maxLength : 2000,
							maxLengthText : '系统说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.systemForm;
};


dev.system.BasePanel.prototype={
	formCreate : function(){		
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.frames.get("System").mainPanel.setStatusValue(['系统管理'.loc(),"",'无'.loc(),'无'.loc()]);
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
		this.systemForm.form.findField('system_name').setValue(this.formDS.getAt(0).data.system_name);
		this.systemForm.form.findField('system_pname').setValue(this.formDS.getAt(0).data.system_pname);
		this.systemForm.form.findField('system_type').setValue(this.formDS.getAt(0).data.system_type);	
		this.systemForm.form.findField('current_stat').setValue(this.formDS.getAt(0).data.current_stat);	
		this.systemForm.form.findField('system_desc').setValue(this.formDS.getAt(0).data.system_desc);
		this.frames.get('System').mainPanel.setStatusValue(['系统管理'.loc(),this.formDS.getAt(0).data.system_id,this.formDS.getAt(0).data.lastModifyName,this.formDS.getAt(0).data.lastModifyTime]);
	},
	onButtonClick : function(item){
		var System = this.frames.get("System");
		var frm=this.systemForm.form;
		
		if(item.btnId=='newgroup'){
			using("dev.system.GroupPanel");
			this.params.retFn =this.retFn;
			System.groupPanel = new dev.system.GroupPanel(this.frames,this.params);	 
			System.mainPanel.add(System.groupPanel.MainTabPanel);	
			System.mainPanel.setActiveTab(System.groupPanel.MainTabPanel);
			System.groupPanel.formCreate(this.params);
		}else if(item.btnId=='newtopmenu'){
			using("lib.ListValueField.ListValueField");
			loadcss("lib.IconPicker.IconPicker");
			using("lib.IconPicker.IconPicker");
			using("dev.system.TopMenuPanel");

			var conn=new Ext.data.Connection();
			conn.request({    
					method: 'GET',    
					url:'/dev/system/getUserType.jcp?',
					params:{objectId:this.params.id}
			});				
			conn.on('requestcomplete', function(conn, oResponse ){	
				var utJSON = Ext.decode(oResponse.responseText);
				var menuParams={};
				menuParams.retFn=this.retFn;
				menuParams['system_id'] = this.params.system_id;
				menuParams['id'] = this.params.id;
				menuParams['parent_id'] = this.params.parent_id;
				menuParams['parent_top']='0';
				menuParams['portal_id']=menuParams['parent_id'];
				System.topMenu = new dev.system.TopMenuPanel(this.frames,System,'portal',menuParams,utJSON);	 
				System.mainPanel.add(System.topMenu.MainTabPanel);
				System.mainPanel.setActiveTab(System.topMenu.MainTabPanel);
				System.topMenu.formCreate(menuParams);
			},this);
		}else if(item.btnId=='save'){
			var saveParams=this.formDS.baseParams;
			saveParams['type']='save';
			saveParams['system_type']=this.systemForm.form.findField('system_type').getValue();
			saveParams['current_stat']=this.systemForm.form.findField('current_stat').getValue();
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/dev/system/systemcreate.jcp',
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
		}else if(item.btnId=='Systemclear'){
			this.systemForm.form.reset();
		}else if(item.btnId=='systemDelete'){
			 Ext.msg('confirm', '警告:删除系统将导致您的数据不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
					 Ext.msg('confirm', '请再次确认是否卸载系统?'.loc(), function (answer){
						  if (answer == 'yes') {
								var delParams=this.formDS.baseParams;
								delParams['type']='delete';
								frm.submit({ 
									url:'/dev/system/systemcreate.jcp',
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
             }.createDelegate(this));
		}else if(item.btnId=='systemUpdatesave'){
		    if (frm.isValid()) {
			  var updateParams=this.formDS.baseParams;
			  updateParams['system_type']=this.systemForm.form.findField('system_type').getValue();
			  updateParams['current_stat']=this.systemForm.form.findField('current_stat').getValue();
			  updateParams['type']='updatesave';
			 frm.submit({ 
					url:'/dev/system/systemcreate.jcp',
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
		}else if(item.btnId=='release'){
			var installParams=this.formDS.baseParams;
			installParams['sysName']=this.systemForm.form.findField('system_pname').getValue();
			installParams['type']='0';
			var paramString=Ext.urlEncode(installParams);
			 window.location='/dev/system/createinstall.jcp?'+paramString+'&rand='+Math.random();
		}else if(item.btnId=='systemAuth'){
			var conn=new Ext.data.Connection();
			conn.request({    
					method: 'GET',    
					url:'/bin/user/getOrg.jcp?'
			});				
			conn.on('requestcomplete', function(conn, oResponse ){	
				var orgJSON = Ext.decode(oResponse.responseText);
				var name=orgJSON.shortName;
				if(name==""){
					name=orgJSON.name;
				}
				this.params.rootId=orgJSON.id;
				this.params.rootName=name;
				using("dev.system.AuthFramePanel");
				using("dev.system.AuthPanel");
				this.params.retFn = this.retFn;
				System.authFramePanel = new dev.system.AuthFramePanel(this.frames,this.params);
				System.mainPanel.add(System.authFramePanel.MainTabPanel);
				System.mainPanel.setActiveTab(System.authFramePanel.MainTabPanel);;
				System.authFramePanel.init(this.params.id);
			},this);
		}else if(item.btnId=='newdblink'){
			using("dev.system.DatabasePanel");
			this.params.retFn =this.retFn;
			System.databasePanel = new dev.system.DatabasePanel(this.frames,this.params);	 
			System.mainPanel.add(System.databasePanel.MainTabPanel);	
			System.mainPanel.setActiveTab(System.databasePanel.MainTabPanel);
			System.databasePanel.formCreate(this.params);
		}else if(item.btnId=='newusertype'){
			using("dev.system.UserTypePanel");
			this.params.retFn =this.retFn;
			System.userTypePanel = new dev.system.UserTypePanel(this.frames,this.params);	 
			System.mainPanel.add(System.userTypePanel.MainTabPanel);	
			System.mainPanel.setActiveTab(System.userTypePanel.MainTabPanel);
			System.userTypePanel.formCreate(this.params);
		}
    }
};

