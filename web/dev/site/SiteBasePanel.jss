Ext.namespace("dev.site");

dev.site.SiteBasePanel = function(frames,params){
	this.frames = frames;
	this.params=params;
	
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({   
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
			
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'clear',
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
				btnId:'updatesave',
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
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/xp/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	

	this.SiteBaseForm = new Ext.FormPanel({
		labelWidth: 130, 
		labelAlign: 'right',
		id: 'siteBasePanel',
		cached:true,
        url:'/dev/site/create.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items: [
			{
			layout:'column',
			border:false,
            items:[
			{	columnWidth:0.45,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.TextField({
						fieldLabel: '逻辑名称'.loc(),
						name: 'logic_name',
						width: 160,
						maxLength : 100,
						regex:/^[^\<\>\'\"\&]+$/,
						regexText:'名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
						allowBlank:false,
						maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
						blankText:'逻辑名称不能为空!'.loc()
					})]
				},{ 
			   columnWidth:0.55,
			   layout: 'form',
			   
			   border:false,
			   items: [			
					new Ext.form.TextField({
						fieldLabel: '物理名称'.loc(),
						name: 'phy_name',		
						width: 160,
						maxLength : 100,
						allowBlank:false,
						maxLengthText : '名称不能超过{0}个字符!'.loc(),
						blankText:'称不能为空!'.loc()
					})
				 ]
				}
			]
		},
			{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:1.0,
					   layout: 'form',
					   border:false,
					   items: [			
							new Ext.form.RadioGroup({
								fieldLabel:'缺省'.loc(),
								width:160,   
								items:[
									{boxLabel:'是'.loc(),name:'is_default',inputValue:true},
									{boxLabel:'否'.loc(),name:'is_default',inputValue:false,checked:true}	
								]
							}) 
						 ]
						}
					]
			},
			{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:1.0,
					   layout: 'form',
					   border:false,
					   items: [			
								new Ext.form.TextField({
									fieldLabel: 'Google 分析ID'.loc(),
									name: 'google_analytics',		
									width: 600,
									maxLength : 100,
									allowBlank:true,
									maxLengthText : '名称不能超过{0}个字符!'.loc(),
									blankText:'称不能为空!'.loc()
								})
						 ]
						}
					]
			},
			{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:1.0,
					   layout: 'form',
					   border:false,
					   items: [			
							new Ext.form.TextArea({
								fieldLabel: '关键字'.loc(),
								name: 'keyword',
								width : 600,
								maxLength : 500,
								maxLengthText : '关键字不能超过{0}个字符!'.loc(),
								allowBlank:false
							})
						 ]
						}
					]
			},
			{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:1.0,
					   layout: 'form',
					   border:false,
					   items: [			
							new Ext.form.TextArea({
								fieldLabel: '备注'.loc(),
								name: 'note',
								width : 600,
								maxLength : 500,
								maxLengthText : '备注不能超过{0}个字符!'.loc(),
								allowBlank:true
							})
						 ]
						}
					]
			}
		],
	tbar:ButtonArray});
	
	this.ds = new Ext.data.Store({   
		proxy:new Ext.data.HttpProxy({
			url:'/dev/site/create.jcp',
			method:'GET'
		}),
		reader:new Ext.data.JsonReader({},["object_id","logic_name","phy_name","is_default","google_analytics","keyword","note","lastModifyName","lastModifyTime"]),
		remoteStore:false
	});
	
	this.MainTabPanel=this.SiteBaseForm;
};

dev.site.SiteBasePanel.prototype={
	init:function(params){
		this.params=params;
		if(this.MainTabPanel.rendered){ 
			this.toggleToolBar('create');
			this.SiteBaseForm.form.reset();
			this.frames.get("Site").mainPanel.setStatusValue(['新建站点'.loc(),'','']);
		}
	},
	toggleToolBar : function(state){
		var  tempToolBar=this.SiteBaseForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
	},
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	loadData : function(params){
		this.params=params;
		this.params.object_id=params.parent_id;
		this.params['rand']=Math.random();
		this.ds.baseParams = this.params;
		this.ds.baseParams['type'] = 'edit';
		this.ds.on('load', this.renderForm, this);
		this.ds.load({params:{start:0, limit:1}});
	},
	renderForm: function(){
		var dss = this.ds.getAt(0).data;
		var frm=this.SiteBaseForm.form;
		frm.findField('logic_name').setValue(dss.logic_name);
		frm.findField('phy_name').setValue(dss.phy_name);
		frm.findField('keyword').setValue(dss.keyword);
		frm.findField('google_analytics').setValue(dss.google_analytics);
		frm.findField('is_default').setValue(dss.is_default);
		frm.findField('note').setValue(dss.note);
		this.frames.get('Site').mainPanel.setStatusValue(['站点管理'.loc(),dss.object_id,dss.lastModifyName,dss.lastModifyTime]);	
	},
	onButtonClick : function(item){
		var Site=this.frames.get('Site');
		var frm=this.SiteBaseForm.form;
		this.params.retFn=this.params.returnFunction=function(main) {
			main.setActiveTab('siteBasePanel');
		}.createCallback(Site.mainPanel);
		if(item.btnId=='clear'){
			frm.reset();
		}else if(item.btnId=='save'){
				var saveParams=this.params;	
				saveParams['type']='save';
				saveParams['is_default'] = frm.findField('is_default').getValue();
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/site/create.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Site=this.frames.get('Site');
							Site.navPanel.getTree().loadSubNode(action.result.id,Site.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
			
			}else if(item.btnId=='updatesave'){
				  var saveParams=this.ds.baseParams;
				  saveParams['type']='updatesave';
				  saveParams['is_default'] = frm.findField('is_default').getValue();
				  if (frm.isValid()) {
						  frm.submit({ 
							url:'/dev/site/create.jcp',
							params:saveParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								Site=this.frames.get('Site');
								Site.navPanel.getTree().loadSelfNode(action.result.id,Site.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
					}else{
						Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
					}
			}else if(item.btnId=='delete'){
				 Ext.msg('confirm', '警告:删除站点定义将不可恢复,确认吗?'.loc(), function (answer){
	                   if (answer == 'yes') {
							var delParams={};
							delParams['type']='delete';
							delParams['parent_id']=this.ds.baseParams['parent_id'];
							delParams['object_id']=this.ds.baseParams['object_id'];
							frm.submit({ 
								url:'/dev/site/create.jcp',
								params:delParams,
								method: 'POST',  
								scope:this,
								success:function(form, action){ 
									Site=this.frames.get('Site');
									Site.navPanel.getTree().loadParentNode(Site.navPanel.clickEvent);
								},								
								failure: function(form, action) {
									Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
								}
							  });
					  } 
	             }.createDelegate(this));
			}else if(item.btnId=='newSearch'){
				if(!Site.mainPanel.havePanel("searchPanel")){
					using("dev.site.SitePanel"); 
					Site.SitePanel = new dev.site.SitePanel(this.frames,this.params);     
					Site.mainPanel.add(Site.SitePanel.MainTabPanel);
				}
				Site.mainPanel.setActiveTab("searchPanel");
				Site.SitePanel.init(this.params);
			}
	}
};