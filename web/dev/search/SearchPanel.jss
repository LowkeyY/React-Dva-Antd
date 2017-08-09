Ext.namespace("dev.search");

dev.search.SearchPanel = function(frames,params){
	this.frames = frames;
	this.params=params;

	var Search =this.frames.get("Search");
	
	this.retFn = function(main){
		main.setActiveTab("searchPanel");
		main.setStatusValue(['新建搜索引擎'.loc()]);
	}.createCallback(Search.mainPanel);

	var typeParams={};
	typeParams['type']='new';
	typeParams['option']='searchType';

	this.searchTypeDs = new Ext.data.JsonStore({
		url: '/dev/search/getSearch.jcp',
		baseParams:typeParams,
		root: 'searchTypes',
		autoLoad :true,    
		fields:["id","title"]
	});

	var queryParams={};
	queryParams['parent_id']=this.params['parent_id'];
	queryParams['object_id']=this.params['object_id'];
	queryParams['type']='new';
	queryParams['option']='query';

	this.queryDS =new Ext.data.JsonStore({   
		url: '/dev/search/getSearch.jcp',
		baseParams:queryParams,
		root: 'querys',
		autoLoad :true,
		fields:["id","title"]
	});

	this.queryColumnDS =new Ext.data.JsonStore({
		url: '/dev/search/getSearch.jcp',
		root: 'queryColumns',
		autoLoad :false,
		fields:["id","title"]
	});
	
	this.queryExpColumnDS =new Ext.data.JsonStore({
		url: '/dev/search/getSearch.jcp',
		root: 'queryExpColumns',
		autoLoad :false,
		fields:["id","title"]
	});

	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				state:'create',
				disabled : false,
				scope : this,
				handler : this.params.retFn
	}));
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
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newProgram',
				text: '新建关联程序'.loc(),
				icon: '/themes/icon/xp/menu.gif',
				cls: 'x-btn-text-icon  bmenu',
				state:'edit',
				disabled:false,
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	this.SearchForm = new Ext.FormPanel({
        labelWidth: 140, 
		labelAlign: 'right',
		id: 'searchPanel',
		cached:true,
        url:'/dev/search/createSearch.jcp',
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
						name: 'logicname',
						width: 150,
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
						name: 'name',		
						width: 150,
						maxLength : 100,
						allowBlank:false,
						maxLengthText : '名称不能超过{0}个字符!'.loc(),
						blankText:'名称不能为空!'.loc()
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
							new Ext.form.TextField({
								fieldLabel: '子分类'.loc(),
								name: 'sub_category',		
								width: 150,
								maxLength : 100,
								allowBlank:false,
								maxLengthText : '子分类不能超过{0}个字符!'.loc(),
								blankText:'子分类不能为空!'.loc()
							})
				]},
				{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,
				   items: [				
						this.dataSource=new lib.ComboRemote.ComboRemote({
									fieldLabel: '查询选择'.loc(),
									hiddenName : 'query_id',
									typeAhead: false,
									width:180,
									store:this.queryDS,
									editable: true,
									allowBlank:false,
									resizable:true,
									triggerAction: 'all',
									displayField: 'title',
									emptyText: '查询选择'.loc(),
									blankText:'查询必须选择.'.loc(),
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
							{
								xtype:'radiogroup',
								fieldLabel:'激活'.loc(),
								width:100,
								items:[
									{boxLabel:'是'.loc(),name:'is_active',inputValue:true,checked:true},
									{boxLabel:'否'.loc(),name:'is_active',inputValue:false}	
								]
							} 
						 ]
						},
						{	
							columnWidth:0.55,
							layout: 'form',
							
							border:false,
							items: [				
								this.indexColumn=new Ext.form.ComboBox({
										fieldLabel: '索引段'.loc(),
										hiddenName : 'index_column',
										typeAhead: false,
										width:180,
										store:this.queryColumnDS,
										editable: true,
										allowBlank:false,
										resizable:true,
										triggerAction: 'all',
										displayField: 'title',
										emptyText: '索引段选择'.loc(),
										blankText:'索引段必须选择.'.loc(),
										valueField: 'id'
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
					   columnWidth:0.45,
					   layout: 'form',
					   
					   border:false,
					   items: [			
							this.dataColumn=new Ext.form.ComboBox({
									fieldLabel: '标题段'.loc(),
									hiddenName: 'name_column',
									typeAhead: false,
									width:150,
									store:this.queryColumnDS,
									editable: true,
									allowBlank:false,
									triggerAction: 'all',
									displayField: 'title',
									valueField: 'id',
									listClass: 'category-element',
									blankText:'标题段必须选择.'.loc(),
									emptyText: '选择标题段'.loc()
							})
						 ]
						},
						{ 
						   columnWidth:0.55,
						   layout: 'form',
						   border:false,
						   items: [			
								this.countColumn=new Ext.form.ComboBox({
										fieldLabel: '记录数段'.loc(),
										hiddenName: 'count_column',
										typeAhead: false,
										width:150,
										store:this.queryColumnDS,
										editable: true,
										allowBlank:true,
										triggerAction: 'all',
										displayField: 'title',
										valueField: 'id',
										emptyText: '记录数段'.loc(),
										listClass: 'category-element'
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
					   columnWidth:0.45,
					   layout: 'form',
					   border:false,
					   items: [			
							this.startColumn=new Ext.form.ComboBox({
									fieldLabel: '数据起始段'.loc(),
									hiddenName: 'start_column',
									typeAhead: false,
									width:150,
									store:this.queryColumnDS,
									editable: true,
									allowBlank:true,
									triggerAction: 'all',
									displayField: 'title',
									valueField: 'id',
									listClass: 'category-element',
									emptyText: '选择数据起始段'.loc()
							})
						 ]
						},
						{	
							columnWidth:0.55,
							layout: 'form',
							border:false,
							items: [				
								this.endColumn=new Ext.form.ComboBox({
									fieldLabel: '数据终止段'.loc(),
									hiddenName: 'end_colunm',
									typeAhead: false,
									width:150,
									store:this.queryColumnDS,
									editable: true,
									allowBlank:true,
									triggerAction: 'all',
									displayField: 'title',
									valueField: 'id',
									listClass: 'category-element',
									emptyText: '选择数据终止段'.loc()
							})
							 ]
						}
					]
			},		
			{
				layout:'column',
				border:false,
				items:[
				{	columnWidth:0.45,
						layout: 'form',
						
						border:false,
						items: [				
							new Ext.form.TextField({
							fieldLabel: '起始段名称'.loc(),
							name: 'startname',
							width: 150,
							maxLength : 100,
							allowBlank:true,
							maxLengthText : '起始段名称不能超过{0}个字符!'.loc()
						})]
					},{ 
					   columnWidth:0.55,
					   layout: 'form',	   
					   border:false,
					   items: [			
							new Ext.form.TextField({
								fieldLabel: '终止段名称'.loc(),
								name: 'endname',		
								width: 150,
								maxLength : 100,
								allowBlank:true,
								maxLengthText : '起始段名称不能超过{0}个字符!'.loc()
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
								fieldLabel: '数据来源'.loc(),
								name: 'datasource',		
								width: 300,
								maxLength : 200,
								allowBlank:true,
								maxLengthText : '数据来源不能超过{0}个字符!'.loc()
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
								this.expColumn=new lib.multiselect.ItemSelector({
									name:"exp_item",
									fieldLabel:'导出数据项'.loc(),
									dataFields:["id", "title"],
									fromData:[],
									fromStore:this.queryExpColumnDS,
									toData:[],
									msWidth:200,
									msHeight:120,
									valueField:"id",
									displayField:"title",
									imagePath:"/lib/multiselect",
									toLegend:'已选项'.loc(),
									fromLegend:'可选项'.loc()
								})
						 ]
						}
					]
			},	{
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
									width: 600
								})
						 ]
						}
					]
			}     
	],
	tbar:ButtonArray});      
	
	this.dataSource.on('select',function(){
		this.dataColumn.reset(); 
		this.indexColumn.reset(); 
		this.countColumn.reset();  
		this.startColumn.reset();  
		this.endColumn.reset(); 
		this.expColumn.reset(); 
		var columnsParams={};
		columnsParams['type']='new';
		columnsParams['option']='querycolumn';
		columnsParams['query_id']=this.dataSource.getValue();
		this.queryColumnDS.baseParams=columnsParams;
        this.queryColumnDS.load();

		var columnsExpParams={};
		columnsExpParams['type']='new';
		columnsExpParams['option']='queryexpcolumn';
		columnsExpParams['query_id']=this.dataSource.getValue();
		this.queryExpColumnDS.baseParams=columnsExpParams;
        this.queryExpColumnDS.load();

	},this);

	if(this.params['fullSearch']==true=="true"){
		this.countColumn.hide();
		this.startColumn.hide();
		this.endColumn.hide();
	}else{
		this.countColumn.show();
		this.startColumn.show();
		this.endColumn.show();
	}
	this.ds = new Ext.data.Store({   
		proxy:new Ext.data.HttpProxy({
			url:'/dev/search/getSearch.jcp',
			method:'POST'
		}),
		reader:new Ext.data.JsonReader({},["object_id","logicname","name","sub_category","query_id","is_active","index_column","name_column","count_column","start_column","end_colunm","exp_item","note",'startname', 'endname','datasource',"lastModifyTime","lastModifyName"]),
		remoteStore:false
	});
	this.MainTabPanel=this.SearchForm;
};
	

dev.search.SearchPanel.prototype={
	init:function(params){
		this.params=params;
		if(this.MainTabPanel.rendered){ 
			this.toggleToolBar('create');
			this.expColumn.fromStore.removeAll();
			var queryParams={};
			queryParams['parent_id']=this.params['parent_id'];
			queryParams['object_id']=this.params['object_id'];
			queryParams['type']='new';
			queryParams['option']='query';
			this.queryDS.baseParams=queryParams;
			this.queryDS.load();
			this.SearchForm.form.reset();
			this.frames.get("Search").mainPanel.setStatusValue(['新建搜索引擎'.loc()]);
		}
	},
	toggleToolBar : function(state){	
		var  tempToolBar=this.SearchForm.getTopToolbar();
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
		var frm=this.SearchForm.form;
		var dss = this.ds.getAt(0).data;
		this.dataColumn.reset(); 
		this.indexColumn.reset(); 
		this.countColumn.reset();  
		this.startColumn.reset();  
		this.endColumn.reset(); 
		this.expColumn.reset(); 

		this.queryDS.on('load',function(){
			frm.findField('query_id').store=this.queryDS;
			frm.findField('query_id').setValue(dss.query_id);
		},this);

		var columnsParams={};
		columnsParams['type']='new';
		columnsParams['option']='querycolumn';
		columnsParams['query_id']=dss.query_id;
		this.queryColumnDS.baseParams=columnsParams;
        this.queryColumnDS.load();

		this.queryColumnDS.on('load',function(){
			
			frm.findField('index_column').store=this.queryColumnDS;	
			frm.findField('name_column').store=this.queryColumnDS;
			frm.findField('count_column').store=this.queryColumnDS;	
			frm.findField('start_column').store=this.queryColumnDS;
			frm.findField('end_colunm').store=this.queryColumnDS;	

			frm.findField('index_column').setValue(dss.index_column);	
			frm.findField('name_column').setValue(dss.name_column);
			frm.findField('count_column').setValue(dss.count_column);
			frm.findField('start_column').setValue(dss.start_column);	
			frm.findField('end_colunm').setValue(dss.end_colunm);
		},this);


		var columnsExpParams={};
		columnsExpParams['type']='new';
		columnsExpParams['option']='queryexpcolumn';
		columnsExpParams['query_id']=dss.query_id;
		this.queryExpColumnDS.baseParams=columnsExpParams;
        this.queryExpColumnDS.load();

		this.queryExpColumnDS.on('load',function(){
			frm.findField('exp_item').fromMultiselect.setValue(dss.exp_item);
			frm.findField('exp_item').fromTo();
			frm.findField('exp_item').toMultiselect.view.refresh();

		},this);
		frm.findField('name').setValue(dss.name);
		frm.findField('logicname').setValue(dss.logicname);
		frm.findField('startname').setValue(dss.startname);
		frm.findField('endname').setValue(dss.endname);
		frm.findField('datasource').setValue(dss.datasource);
		frm.findField('is_active').setValue(dss.is_active);
		frm.findField('query_id').setValue(dss.query_id);
		frm.findField('note').setValue(dss.note);
		frm.findField('sub_category').setValue(dss.sub_category);
		this.frames.get('Search').mainPanel.setStatusValue(['新建对象查询'.loc(),dss.object_id,dss.lastModifyName,dss.lastModifyTime]);
	},
	onButtonClick : function(item){
		var Search=this.frames.get('Search');
		var frm=this.SearchForm.form;
		if(item.btnId=='clear'){
			frm.reset();
		}else if(item.btnId=='save'){
				var saveParams=this.params;	
				saveParams['type']='save';
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/search/createSearch.jcp',
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
			  if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/search/createSearch.jcp',
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
							url:'/dev/search/createSearch.jcp',
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
		}else if(item.btnId=='newProgram'){
			using("lib.ComboRemote.ComboRemote");
			using("lib.ComboTree.ComboTree");
			using("dev.program.ProgramPanel");
			using("dev.program.ProgramGrid");
			Ext.Ajax.request({
					url : '/dev/module/SelectTerminalType.jcp',
					params : {
						id:this.params.object_id
					},
					method : 'GET',
					scope : this,
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						if (result.success) {
							var terminalType = result.terminalType;
							var programType='Search';
							Search.programPanel=this.frames.createPanel(new dev.program.ProgramPanel(programType,Search));
							Search.mainPanel.add(Search.programPanel.MainTabPanel);
							Search.mainPanel.setActiveTab(Search.programPanel.MainTabPanel);
							this.params['grand_parent']=this.params['parent_id'];
							this.params['parent_id']=this.params['object_id'];
							this.params['objectId']=this.params['object_id'];
							this.params['terminalType']=terminalType;
							this.params.retFn =this.retFn;
							Search.programPanel.init(this.params,Search.mainPanel);
						}else{
							Ext.msg("error", result.message);
						}
					}
			},this);
		}
    }
};
