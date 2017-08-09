Ext.namespace('utils.km.portal'); 

utils.km.portal.PortalPanel = function(frames,Menu){

	this.pageFrame = Menu;
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
				btnId:'new',
				text: '新建子结点'.loc(),
				icon: '/themes/icon/xp/neww.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newPage',
				text: '新建页面'.loc(),
				icon: '/themes/icon/xp/neww.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
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
	this.currentStatDs = new Ext.data.SimpleStore({
		fields : ['currentStat', 'currentStatName'],
		data : [['0', '封存'.loc()], ['1', '激活'.loc()]]
	});

	this.PortalForm = new Ext.FormPanel({
		border:false,
        labelWidth: 100, 
		labelAlign: 'right',
        url:'/utils/km/portal/nodecreate.jcp',
		id: 'portalBase',
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
				{  columnWidth:0.45,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '节点名称'.loc(),
							name: 'node_name',
							width: 150,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '节点名称{0}个字符!'.loc(),
							blankText:'节点名称必须提供.'.loc()
						})
					 ]},
			   {
					columnWidth:0.55,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.TextField({
							fieldLabel: '节点标题'.loc(),
							name: 'node_title',
							width: 150,
							maxLength : 2000,
							allowBlank:false,
							blankText:'节点标题必须提供.'.loc(),
							maxLengthText : '节点标题不能超过{0}个字符!'.loc()
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
					columnWidth:1,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.NumberField({
							fieldLabel: '节点序号'.loc(),
							name: 'seq',
							minValue : 0,
							maxValue : 100000,
							width: 150,
							allowDecimals : false,
							allowNegative : false,
							minText : '程序版本最小值不能小于{0}'.loc(),
							maxText : '程序版本最大值不能大于 {0}'.loc(),
							nanText : '{0} 对于程序版本是无效数字'.loc()
						})
					 ]
				}
			]
		},
		{
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 1,
						layout : 'form',
						border : false,
						items : [new Ext.form.ComboBox({
												fieldLabel : '当前状态'.loc(),
												lazyRender : true,
												name : 'currentStat',
												minLength : 1,
												value : 1,
												store : this.currentStatDs,
												valueField : 'currentStat',
												displayField : 'currentStatName',
												triggerAction : 'all',
												mode : 'local'
											})]
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
										fieldLabel: '节点说明'.loc(),
										name: 'node_desc',		
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
			url: '/utils/km/portal/nodecreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["id","node_name","node_title","seq","current_stat","node_desc","parent_id"]),
		remoteSort: false
	});
	this.MainTabPanel=this.PortalForm;
};
utils.km.portal.PortalPanel.prototype={
	formCreate : function(params){		
		this.toggleToolBar('create');
		this.formDS.baseParams = params;
		this.formDS.baseParams['type']='new';
	//	this.formDS.on('load', this.initCombox, this);
	//	this.formDS.load({params:{start:0, limit:1}});
		this.frames.get("Portal").mainPanel.setStatusValue(['节点管理'.loc()]);
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
		var  tempToolBar=this.PortalForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){	
		var fm=this.PortalForm.form,data=this.formDS.getAt(0).data;
		for(var i=0;i<this.ButtonArray.length;i++){
			if(this.ButtonArray[i].btnId=='del'){
				this.ButtonArray[i].setDisabled(this.formDS.baseParams['son']!='0');
			}
		}
		fm.findField('node_name').setValue(data.node_name);
		fm.findField('node_title').setValue(data.node_title);
		fm.findField('seq').setValue(data.seq);
		fm.findField('currentStat').setValue(data.current_stat);
		fm.findField('node_desc').setValue(data.node_desc);
		this.frames.get('Portal').mainPanel.setStatusValue(['节点管理'.loc(),data.id,'无','无']);
		},
	onButtonClick : function(item){
		var Menu = this.frames.get("Portal");
		var frm=this.PortalForm.form;
		if(item.btnId=='new'){
			var newParams=this.formDS.baseParams;
			newParams['type']='new';
			this.formCreate(newParams);
			frm.reset();
		}else if (item.btnId == 'newPage') {
			using("utils.km.portal.PublishPanel");
			var Menu = this.frames.get("Portal");
			Menu.menu = new utils.km.portal.PublishPanel(this.frames, Menu);
			Menu.mainPanel.add(Menu.menu.MainTabPanel);
			Menu.mainPanel.setActiveTab(Menu.menu.MainTabPanel);
			Menu.menu.formCreate(this.formDS.baseParams);
		} else if(item.btnId=='back'){
			
			var prgType = this.formDS.baseParams.prgType;
			if(prgType=='top'){
				Menu.mainPanel.setActiveTab("topPortalBase");
				Menu.topMenu.formEdit();
				Menu.topMenu.loadData(this.formDS.baseParams);
			}else if(prgType=='menu'){
				var baseParam = this.formDS.baseParams;
				Menu.mainPanel.setActiveTab("portalBase");
				Menu.menu.formEdit();
				baseParam.type=null;
				Menu.menu.loadData(baseParam);
			}
		}else if(item.btnId=='save'){
			var saveParams=this.formDS.baseParams;
			saveParams['type']='save';
			saveParams['current_stat']=this.PortalForm.form.findField('currentStat').getValue();
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/utils/km/portal/nodecreate.jcp',
					params:saveParams,
					method: 'POST',  
					scope:this,
					success:function(form, action){ 
						Ext.msg("info", '保存成功!'.loc());
						this.page.navPanel.getTree().loadSubNode(action.result.id,Menu.navPanel.clickEvent);
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
				this.PortalForm.form.reset();
			} catch (e) {
			}
		}else if(item.btnId=='del'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                    if (answer == 'yes') {
						var delParams=this.formDS.baseParams;
						delParams['type']='delete';
						this.PortalForm.form.submit({ 
							url:'/utils/km/portal/nodecreate.jcp',
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
				  updateParams['current_stat']=this.PortalForm.form.findField('currentStat').getValue();
				  frm.submit({ 
					url:'/utils/km/portal/nodecreate.jcp',
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

