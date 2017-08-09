

dev.system.RolePanel = function(frames,params){

	this.frames= frames;
	var System = this.frames.get("System");
	var ButtonArray=[];
	this.params=params;
	this.retFn = function(main){
		main.setActiveTab("systemRole");
		main.setStatusValue(['策略管理'.loc()]);
	}.createCallback(System.mainPanel);

	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/system/rolecreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["strategy_id","group_id","strategy_name","note","create_date","creator"]),
		remoteSort: false
	});

//初始化按钮

	if(this.params.retFn){
		ButtonArray.push(new Ext.Toolbar.Button({
					btnId:'roleBack',
					text: '返回'.loc(),
					icon: '/themes/icon/common/redo.gif',
					cls: 'x-btn-text-icon  bmenu',
					disabled:false,
					state:'create',
					hidden : true,
					scope: this,
					handler :this.params.retFn
		}));
	}
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'roleSave',
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
				btnId:'roleClear',
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
				btnId:'roleUpdatesave',
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
				btnId:'roleDelete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

//---------------------查看状态下的按钮-------------------------------------------------

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'applicationAuth',
				text: '应用权限'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

//系统初始化

	this.systemRoleForm = new Ext.FormPanel({
        labelWidth: 100, 
		id: 'systemRole',
		cached:true,
		labelAlign: 'right',
        url:'/dev/system/rolecreate.jcp',
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
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '策略名称'.loc(),
							name: 'strategy_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'策略名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							width: 200,
							maxLength : 20,
							allowBlank:false,
							maxLengthText : '策略名称不能超过{0}个字符!'.loc(),
							blankText:'策略名称必须提供.'.loc()
						})
					 ]}
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
							fieldLabel: '策略描述'.loc(),
							name: 'note',
							
							width: 550,
							height:60,
							maxLength : 200,
							maxLengthText : '策略描述不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.systemRoleForm;
};

dev.system.RolePanel.prototype= {
	formCreate : function(params){		
		this.params = params;
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.frames.get("System").mainPanel.setStatusValue(['策略管理'.loc()]);
		}
    },
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	loadData : function(params){	
		this.params = params;
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({params:{start:0, limit:1}});
    },	
	toggleToolBar : function(state){	
		var  tempToolBar=this.systemRoleForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){		
		this.systemRoleForm.form.findField('strategy_name').setValue(this.formDS.getAt(0).data.strategy_name);	
		this.systemRoleForm.form.findField('note').setValue(this.formDS.getAt(0).data.note);
		this.frames.get('System').mainPanel.setStatusValue(['策略管理'.loc(),this.formDS.getAt(0).data.strategy_id,this.formDS.getAt(0).data.creator,this.formDS.getAt(0).data.create_date]); 
	},
	onButtonClick : function(item){
		var System = this.frames.get("System");
		var frm=this.systemRoleForm.form;
		if(item.btnId=='portaletAuth'){
			var newParams={};
			newParams['id']=this.params['id'];
			newParams['type']='new';
			System.mainPanel.remove(System.rolePanel.MainTabPanel);
			System.mainPanel.add(System.rolePanel.MainTabPanel);
			System.rolePanel.formCreate(newParams);
			System.Frame.doLayout();

		}else if(item.btnId=='applicationAuth'){
			using("dev.system.StrategyAuth");
			var mp=System.mainPanel;
			var p= new dev.system.StrategyAuth({
				retFn:this.retFn,
				objectId:this.params.parent_id,
				strategyId:this.params.id
			});
			mp.add(p);
			mp.setActiveTab(p);
			mp.doLayout();
		}else if(item.btnId=='roleSave'){
			var saveParams=this.params;
			saveParams['type']='save';
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/dev/system/rolecreate.jcp',
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
		}else if(item.btnId=='roleClear'){
			this.systemRoleForm.form.reset();
		}else if(item.btnId=='update'){
			this.formEdit();
		}else if(item.btnId=='roleDelete'){
			 Ext.msg('confirm', '警告:删除策略及策略相关的权限设置,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['id']=this.params['id'];
						frm.submit({ 
							url:'/dev/system/rolecreate.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 		
								System.navPanel.getTree().loadParentNode(System.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								    Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
             }.createDelegate(this));
		}else if(item.btnId=='roleUpdatesave'){
		    if (frm.isValid()) {
			 var updateParams=this.params;
			 updateParams['type']='updatesave';
			 frm.submit({ 
					url:'/dev/system/rolecreate.jcp',
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