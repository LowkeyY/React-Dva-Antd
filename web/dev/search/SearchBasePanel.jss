Ext.namespace("dev.search");

dev.search.SearchBasePanel = function(frames,params){
	this.frames = frames;
	this.params=params;
	
	this.searchTypeDs = new Ext.data.SimpleStore({
		fields : ['searchTypeCode', 'searchTypeName'],
		data : [['0', '全文搜索'.loc()], ['1', '结构搜索'.loc()]]
	});
	
	this.dataLinkDS =new Ext.data.JsonStore({
		url: '/dev/system/getDBLink.jcp',
		baseParams:{type:'new',optionType:'datalink'},
		root: 'datalink',
		autoLoad :true,
		fields:["id","title"]
	});
	
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
				btnId:'newSearch',
				text: '新建搜索'.loc(),
				icon: '/themes/icon/all/magnifier_zoom_in.gif',
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
	

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'advanceConfig',
				text: '高级搜索条件设置'.loc(),
				icon: '/themes/icon/database/new_editor.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'advanceExport',
				text: '导出参数设置'.loc(),
				icon: '/themes/icon/database/filter_history.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	this.SearchBaseForm = new Ext.FormPanel({
		labelWidth: 130, 
		labelAlign: 'right',
		id: 'searchBasePanel',
		cached:true,
        url:'/dev/search/createSearchCategory.jcp',
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
            items:
			[
			   {
					columnWidth:0.45,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.ComboBox({
									fieldLabel: '搜索类别'.loc(),
									name : 'search_type',
									typeAhead: false,
									width:160,
									store:this.searchTypeDs,
									editable: false,
									allowBlank:false,
									triggerAction: 'all',
									displayField: 'searchTypeName',
									emptyText: '选择搜索类别'.loc(),   
									blankText:'搜索类别必须选择.'.loc(),
									valueField: 'searchTypeCode',
									mode : 'local'
						})
					 ]
				},
				{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,
				   items: [	
					new Ext.form.ComboBox({
								fieldLabel: '索引库链接'.loc(),
								name : 'index_database',
								typeAhead: false,
								width:160,
								store:this.dataLinkDS,
								editable: false,
								allowBlank:false,
								triggerAction: 'all',
								displayField: 'title',
								emptyText: '选择索引库链接'.loc(),   
								blankText:'索引库链接必须选择.'.loc(),
								valueField: 'id'
					})
				]}
			]
		},
		{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:0.45,
					   layout: 'form',
					   border:false,
					   items: [			
							new lib.ComboTree.ComboTree({
								fieldLabel: '主数据表'.loc(),
								name:'main_table',
								width : 160,
								queryParam : "type",
								mode : 'remot',
								ctype : 'combo',
								listWidth : 250,
								height : 100,
								allowBlank:false,
								editable: false,
								emptyText: '选择主数据表'.loc(),   
								blankText:'主数据表必须选择.'.loc(),
								textMode : false,
								root : new Ext.tree.AsyncTreeNode({
											text : '所有库'.loc(),
											draggable : false,
											allowSelect : false,
											id : this.params.parent_id,
											icon : "/themes/icon/all/plugin.gif"
										}),
								loader : new Ext.tree.TreeLoader({
											dataUrl : '/dev/program/PropertyGridConfig.jcp',
											requestMethod : "POST"
										})
							})
						 ]
						},{
							   columnWidth:0.55,
							   layout: 'form',
							   
							   border:false,
							   items: [			
									new Ext.form.TextField({
										fieldLabel: '提示标题'.loc(),
										name: 'tooltip_text',		
										width: 160,
										maxLength : 100,
										maxLengthText : '名称不能超过{0}个字符!'.loc()
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
								fieldLabel:'高级搜索'.loc(),
								width:160,   
								items:[
									{boxLabel:'是'.loc(),name:'advanced_search',inputValue:true},
									{boxLabel:'否'.loc(),name:'advanced_search',inputValue:false,checked:true}	
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
							new Ext.form.TextArea({
								fieldLabel: '备注'.loc(),
								name: 'note',
								width : 600,
								maxLength : 500,
								maxLengthText : '程序名称不能超过{0}个字符!'.loc(),
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
			url:'/dev/search/getSearchCategory.jcp',
			method:'POST'
		}),
		reader:new Ext.data.JsonReader({},["object_id","logic_name","phy_name","search_type","index_database","main_table","tableName","tooltip_text","advanced_search","note","lastModifyName","lastModifyTime"]),
		remoteStore:false
	});
	
	this.MainTabPanel=this.SearchBaseForm;
};

dev.search.SearchBasePanel.prototype={
	init:function(params){
		this.params=params;
		if(this.MainTabPanel.rendered){ 
			this.toggleToolBar('create');
			this.SearchBaseForm.form.reset();
			this.frames.get("Search").mainPanel.setStatusValue(['新建搜索引擎分类'.loc(),'','']);
		}
	},
	toggleToolBar : function(state){
		var  tempToolBar=this.SearchBaseForm.getTopToolbar();
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
		var frm=this.SearchBaseForm.form;
		frm.findField('logic_name').setValue(dss.logic_name);
		frm.findField('phy_name').setValue(dss.phy_name);
		frm.findField('search_type').setValue(dss.search_type);
		frm.findField('index_database').setValue(dss.index_database);
		
		frm.findField('main_table').setValue(dss.main_table,dss.tableName);
		frm.findField('tooltip_text').setValue(dss.tooltip_text);
		frm.findField('advanced_search').setValue(dss.advanced_search);
		frm.findField('note').setValue(dss.note);
		this.frames.get('Search').mainPanel.setStatusValue(['搜索引擎分类'.loc(),dss.object_id,dss.lastModifyName,dss.lastModifyTime]);
		
	},
	onButtonClick : function(item){
		var Search=this.frames.get('Search');
		var frm=this.SearchBaseForm.form;
		this.params.retFn=this.params.returnFunction=function(main) {
			main.setActiveTab('searchBasePanel');
		}.createCallback(Search.mainPanel);

		if(item.btnId=='clear'){
			frm.reset();
		}else if(item.btnId=='save'){
				var saveParams=this.params;	
				saveParams['type']='save';
				saveParams['search_type'] = frm.findField('search_type').getValue();
				saveParams['advanced_search'] = frm.findField('advanced_search').getValue();
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/search/createSearchCategory.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Search=this.frames.get('Search');
							Search.navPanel.getTree().loadSubNode(action.result.id,Search.navPanel.clickEvent);
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
				  saveParams['search_type'] = frm.findField('search_type').getValue();
				  saveParams['advanced_search'] = frm.findField('advanced_search').getValue();
				  if (frm.isValid()) {
						  frm.submit({ 
							url:'/dev/search/createSearchCategory.jcp',
							params:saveParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								Search=this.frames.get('Search');
								Search.navPanel.getTree().loadSelfNode(action.result.id,Search.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
					}else{
						Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
					}
			}else if(item.btnId=='delete'){
				 Ext.msg('confirm', '警告:删除搜索引擎定义将不可恢复,确认吗?'.loc(), function (answer){
	                   if (answer == 'yes') {
							var delParams={};
							delParams['type']='delete';
							delParams['parent_id']=this.ds.baseParams['parent_id'];
							delParams['object_id']=this.ds.baseParams['object_id'];
							frm.submit({ 
								url:'/dev/search/createSearchCategory.jcp',
								params:delParams,
								method: 'POST',  
								scope:this,
								success:function(form, action){ 
									Search=this.frames.get('Search');
									Search.navPanel.getTree().loadParentNode(Search.navPanel.clickEvent);
								},								
								failure: function(form, action) {
									Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
								}
							  });
					  } 
	             }.createDelegate(this));
			}else if(item.btnId=='newSearch'){
				if(!Search.mainPanel.havePanel("searchPanel")){
					using("dev.search.SearchPanel"); 
					Search.SearchPanel = new dev.search.SearchPanel(this.frames,this.params);     
					Search.mainPanel.add(Search.SearchPanel.MainTabPanel);
				}
				Search.mainPanel.setActiveTab("searchPanel");
				Search.SearchPanel.init(this.params);
			}else if(item.btnId=='advanceConfig'){
				if(!Search.mainPanel.havePanel("ConditionColumn")){
					using("dev.ctrl.ConditionColumn");
					var frm=this.SearchBaseForm.form;
					this.params['objectId']=this.params['object_id'];
					this.params['tabId']=frm.findField('main_table').getValue();
					var p = new dev.ctrl.ConditionColumn(this.params,this.params.retFn);
					Search.mainPanel.add(p.MainTabPanel);
				}
				Search.mainPanel.setActiveTab(p.MainTabPanel);
				p.init(this.params, Search.mainPanel);
			}else if(item.btnId=='advanceExport'){
				if(!Search.mainPanel.havePanel("CondtionExportPanel")){
					loadcss("lib.multiselect.Multiselect");
					using("lib.multiselect.Multiselect");
					using("dev.ctrl.ConditionExport");
					var frm=this.SearchBaseForm.form;
					this.params['tabId']=frm.findField('main_table').getValue();
					this.params['type']='search';
					var p = new dev.ctrl.ConditionExport(this.params);
					Search.mainPanel.add(p.MainTabPanel);
				}
				Search.mainPanel.setActiveTab(p.MainTabPanel);
				p.loadData(this.params, Search.mainPanel); 
			}
	}
};