Ext.namespace('utils.km.portal'); 

utils.km.portal.PublishPanel = function(frames,Menu){

	
	this.frames=frames;

	this.ButtonArray=[];
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'back',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : true,
				scope: this,
				state:'create',
				handler :this.onButtonClick
	}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'del',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	this.publishForm = new Ext.FormPanel({
		border:false,
        labelWidth: 100, 
		labelAlign: 'right',
        url:'/utils/km/portal/publish.jcp',
		id: 'publishBase',
		cached:true,
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
       items: [
	   {
			layout:'column',
			border:false,
            items:
			[
				{  columnWidth:1,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '标题'.loc(),
							name: 'page_title',
							width: 150,
							maxLength : 64,
							allowBlank:false,
							maxLengthText : '页面标题{0}个字符!'.loc(),
							blankText:'页面标题必须提供.'.loc()
						})
					 ]}
			]
		},
		{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											fieldLabel : '节点链接页面'.loc(),
											hiddenName : 'first_page',
											width : 80,
											items : [{
														boxLabel : '是'.loc(),
														name : 'first_page',
														inputValue :'y',
														checked : true
													}, {
														boxLabel : '否'.loc(),
														name : 'first_page',
														inputValue : 'n'
													}]
										}]
							}]
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
										fieldLabel: '页面说明'.loc(),
										name: 'comment',		
										width: 550,
										height:60,
										maxLength : 500,
										maxLengthText : '系统说明不能超过{0}个字符!'.loc()
									})
								 ]}
						]
					
					}
	],tbar:this.ButtonArray});
	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/utils/km/portal/publish.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["pageId","parent_id","page_title","comment","first_page"]),
		remoteSort: false
	});
	this.MainTabPanel=this.publishForm;
};
utils.km.portal.PublishPanel.prototype={
	formCreate : function(params){		
		this.toggleToolBar('create');
		this.formDS.baseParams = params;
		this.formDS.baseParams['type']='new';
	//	this.formDS.on('load', this.initCombox, this);
	//	this.formDS.load({params:{start:0, limit:1}});
		this.frames.get('Portal').mainPanel.setStatusValue(['页面管理'.loc()]);
    },
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	loadData : function(params){	
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({params:{start:0, limit:1}});
    },	
	toggleToolBar : function(state){	
		var  tempToolBar=this.publishForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){	
		var fm=this.publishForm.form,data=this.formDS.getAt(0).data;
		for(var i=0;i<this.ButtonArray.length;i++){
			if(this.ButtonArray[i].btnId=='del'){
				this.ButtonArray[i].setDisabled(this.formDS.baseParams['son']!='0');
			}
		}
		fm.findField('page_title').setValue(data.page_title);
		fm.findField('comment').setValue(data.comment);
		fm.findField('first_page').setValue(data.first_page);
		this.frames.get('Portal').mainPanel.setStatusValue(['页面管理'.loc(),data.pageId,'无','无']);
		},
	onButtonClick : function(item){
		var Menu = this.frames.get("Portal");
		var frm=this.publishForm.form;
		if(item.btnId=='new'){
			var newParams=this.formDS.baseParams;
			newParams['type']='new';
			this.formCreate(newParams);
			frm.reset();
		}else if(item.btnId=='back'){
			var prgType = this.formDS.baseParams.prgType;
				var baseParam = this.formDS.baseParams;
				Menu.mainPanel.setActiveTab("portalBase");
				Menu.menu.formEdit();
				baseParam.type=null;
				Menu.menu.loadData(baseParam);
			
		}else if(item.btnId=='save'){
			var saveParams=this.formDS.baseParams;
			saveParams['type']='save';
			saveParams['first_page'] = this.publishForm.form.findField('first_page').inputValue;
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/utils/km/portal/publish.jcp',
					params:saveParams,
					method: 'POST',  
					scope:this,
					success:function(form, action){ 
						Ext.msg("info", '保存成功!'.loc());
						Menu.navPanel.getTree().loadSubNode(action.result.id,Menu.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				 Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='clear'){
			try {
				this.publishForm.form.reset();
			} catch (e) {
			}
		}else if(item.btnId=='del'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                    if (answer == 'yes') {
						var delParams=this.formDS.baseParams;
						delParams['type']='delete';
						this.publishForm.form.submit({ 
							url:'/utils/km/portal/publish.jcp',
							params:delParams,
							method: 'POST',  
							scope:this,
							success:function(form, action){ 
								Menu.navPanel.getTree().loadParentNode(Menu.navPanel.clickEvent);
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
				  updateParams['type']='updatesave';
				  updateParams['first_page'] = this.publishForm.form.findField('first_page').inputValue;
				  frm.submit({ 
					url:'/utils/km/portal/publish.jcp',
					params:updateParams,
					method: 'POST',  
					scope:this,
					success:function(form, action){ 
						Menu.navPanel.getTree().loadSelfNode(action.result.id,Menu.navPanel.clickEvent);
						Ext.msg('info','数据更新完毕!'.loc());
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
};

