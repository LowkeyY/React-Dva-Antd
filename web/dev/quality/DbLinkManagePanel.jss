Ext.namespace("dev.quality");
dev.quality.DbLinkManagePanel = function(frames,params){
	this.params=params;
	this.frames= frames;
	var qualityInstance = this.frames.get("qualityInstance");
	this.returnFn = function(main){
		main.setActiveTab("dbLinkManageViewPanel");
		main.setStatusValue(["数据库连接管理".loc()]);
	}.createCallback(qualityInstance.mainPanel);

	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/quality/dblinkcreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["link_id","dblink_name","username","password","url","name","mapedstring"]),
		remoteSort: false
	});

	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				disabled:false,
				hidden : false,
				scope: this,
				state:'create',
				handler :this.onButtonClick
	})); 

	ButtonArray.push(new Ext.Toolbar.Button({
				text: '取消'.loc(),
				scope:this,
				handler: this.windowCancel
	}));

	this.dbLinkManageForm = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
		id: 'dbLinkManagePanel',
		cached:true,
        url:'/dev/quality/dblinkcreate.jcp',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[{ 
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [				
						{
							xtype:'textfield',
							fieldLabel: '名称'.loc(),
							name: 'name',
							width: 160,
							maxLength :36,
							allowBlank:false,
							maxLengthText : "不能超过{0}个字符!".loc(),
							blankText:"ID必须提供.".loc()
						},						
						{
							xtype:'textfield',
							fieldLabel: '映射字符'.loc(),
							name: 'mapedstring',
							width: 160,
							maxLength :50,
							maxLengthText : "不能超过{0}个字符!".loc()
						}
					 ]
				},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,  
				   items: [				
						{
							xtype:'textfield',
							fieldLabel: '用户名'.loc(),
							name: 'username',
							width: 150,
							maxLength :25,
							allowBlank:false,
							maxLengthText : "不能超过{0}个字符!".loc(),
							blankText:"必须提供.".loc()
						},{ xtype:'textfield',
							fieldLabel: '密码'.loc(),
							name: 'password',							
							inputType:'password',
							width: 150,
							maxLength : 20,
							allowBlank:false,
							maxLengthText : "口令不能超过{0}个字符!".loc(),
							blankText:"口令必须提供.".loc()
						}
					]
				}
			]
		},
		new Ext.form.TextArea({
			fieldLabel: 'URL',
			name: 'url',
			width: 450,
			height:60,
			maxLength : 255,
			maxLengthText : "不能超过{0}个字符!".loc()
		})
	]
	//tbar:ButtonArray
	});

	this.win =  new Ext.Window({
		title:'数据库连接管理'.loc(),
		layout:'fit',
		width:800,
		height:400,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.dbLinkManageForm],
		buttons: ButtonArray
	}); 
	this.MainTabPanel=this.dbLinkManageForm;
};

dev.quality.DbLinkManagePanel.prototype= {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	formCreate : function(params){		
		this.params = params;
		if(this.MainTabPanel.rendered){
			this.dbLinkManageForm.form.reset();
		}
    },
	formEdit : function(){
    },
	loadData:function(params){	
		this.params = params;
		this.dbLinkManageForm.form.load({
			method:'GET',
			params:params,
			scope:this,
			success:function(fm,action){
				var data=action.result.data;
				this.toggleToolBar('edit');
			}
		});
    },
	onButtonClick : function(item){
		var frm=this.dbLinkManageForm.form;
		if(item.btnId=='save'){
			if(this.params.state=='edit'){
				if (frm.isValid()) {
				  var updateParams=this.params;
				  updateParams['type']='updatesave';  
				  updateParams['url_new']=frm.findField('url').getValue();
				  updateParams['username_new']=frm.findField('username').getValue();
				  updateParams['password_new']=frm.findField('password').getValue();
				  updateParams['mapedstring_new']=frm.findField('mapedstring').getValue(); 
				  updateParams['name_new']=frm.findField('name').getValue(); 
				 frm.submit({ 
						url:'/dev/quality/dblinkcreate.jcp',
						params:updateParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Ext.msg("info", '保存成功!'.loc());
							this.win.close();
						},								
						failure: function(form, action) {
								Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交，请修改表单中标识的错误!'.loc());
				}
			}else{
				var saveParams=this.params;
				saveParams['type']='save';
				if (frm.isValid()){
					  frm.submit({ 
						url:'/dev/quality/dblinkcreate.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Ext.msg("info", '保存成功!'.loc());
							this.win.close();
						},								
						failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交，请修改表单中标识的错误!'.loc());
				}
			}
		}
    }
};