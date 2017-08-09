Ext.namespace("dev.gis");

dev.gis.MapPOIPanel = function(frames,params,layerMethod){
	this.frames = frames;
	this.params=params;
	this.layerMethod=layerMethod;

	var Gis =this.frames.get("Gis");
	this.retFn = function(main){
		main.setActiveTab("MapPOIPanel");
		main.setStatusValue(['新建对象查询'.loc()]);
	}.createCallback(Gis.mainPanel);
	this.dataTypeDs = new Ext.data.SimpleStore({
		fields:['layertypeId', 'layertype'],
		data:[['1','点'.loc()],['2','线'.loc()],['3','面'.loc()]]
	});
	this.storeTypeDs = new Ext.data.SimpleStore({
		fields:['typeId', 'storeName'],
		data:[['1','Spatial存储'.loc()],['2','数值存储'.loc()]]
	});
	var queryParams={};
	queryParams['parent_id']=this.params['parent_id'];
	queryParams['object_id']=this.params['object_id'];
	queryParams['type']='new';
	queryParams['option']='query';

	this.queryDS =new Ext.data.JsonStore({   
		url: '/dev/gis/getMapPOI.jcp',
		baseParams:queryParams,
		root: 'querys',
		autoLoad :true,
		fields:["id","title"]
	});

	this.queryColumnDS =new Ext.data.JsonStore({
		url: '/dev/gis/getMapPOI.jcp',
		root: 'queryColumns',
		autoLoad :false,
		fields:["id","title"]
	});
	var linkParams={};
		linkParams['type']='new';
		linkParams['option']='datalink';
		

	this.dataLinkDS =new Ext.data.JsonStore({
		url: '/dev/gis/getMapPOI.jcp',
		baseParams:linkParams,
		root: 'datalink',
		autoLoad :true,    
		fields:["id","title"]
	});

	var searchParams={};
	searchParams['type']='new';
	searchParams['option']='search';
	searchParams['object_id']=this.params['object_id'];

	this.searchDS =new Ext.data.JsonStore({
		url: '/dev/gis/getMapPOI.jcp',
		baseParams:searchParams,
		root: 'searchTypes',
		autoLoad :true,    
		fields:["id","title"]
	});

	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'backward',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.params.retFn
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
	if(layerMethod=='Edit'){
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
	}
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'setStyle',
				text: '样式设定'.loc(),
				icon: '/themes/icon/all/style_add.gif',
				cls: 'x-btn-text-icon  bmenu',
				state:'edit',
				disabled:false,
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

	this.MapPOIForm = new Ext.FormPanel({
        labelWidth: 150, 
		labelAlign: 'right',
		id: 'MapPOIPanel',
		cached:true,
        url:'/dev/gis/createMapPOI.jcp',
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
						this.layerType=new Ext.form.ComboBox({
								fieldLabel: '数据类别'.loc(),
								hiddenName : 'layer_type',
								typeAhead: false,
								width:150,
								mode: 'local',
								store:this.dataTypeDs,
								editable: true,
								allowBlank:false,
								triggerAction: 'all',
								displayField: 'layertype',
								listClass: 'category-element',
								emptyText: '选择数据类别'.loc(),
								blankText:'数据类别必须选择.'.loc(),
								valueField: 'layertypeId'
						}),
						{
							xtype:'radiogroup',
							fieldLabel:'缺省图层'.loc(),
							width:100,
							items:[
								{boxLabel:'是'.loc(),name:'isDefault',inputValue:true},
								{boxLabel:'否'.loc(),name:'isDefault',inputValue:false,checked:true}	
							]
						}
					 ]
				},
				{ 
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [	
						{
							xtype:'radiogroup',
							fieldLabel:'状态'.loc(),
							width:150,
							items:[
								{boxLabel:'激活'.loc(),name:'isActive',inputValue:true,checked:true},
								{boxLabel:'暂停'.loc(),name:'isActive',inputValue:false}	
							]
						} ,
						this.searchId=new Ext.form.ComboBox({
								fieldLabel: '选择关联索引'.loc(),
								hiddenName : 'searchId',
								typeAhead: false,
								width:160,
								store:this.searchDS,
								editable: true,
								allowBlank:true,
								triggerAction: 'all',
								displayField: 'title',
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
								new Ext.form.NumberField({
									fieldLabel: '顺序'.loc(),
									name: 'rownum',
									width: 100
							})
							 ]
					},
					{ 
					   columnWidth:0.45,
					   layout: 'form',   
					   border:false,
					   items: [			
								{
									xtype:'radiogroup',
									name:'storeType',
									fieldLabel:'地理数据存储'.loc(),
									width:150,
									items:[
										{boxLabel:'空间'.loc(),name:'storeType',inputValue:0,checked:true},
										{boxLabel:'常规'.loc(),name:'storeType',inputValue:1}	
									]
								}
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
						   	this.dataBaseLink=new Ext.form.ComboBox({
									fieldLabel: '数据库连接'.loc(),
									hiddenName : 'dblink',
									typeAhead: false,
									width:160,
									store:this.dataLinkDS,
									editable: true,
									allowBlank:true,
									triggerAction: 'all',
									displayField: 'title',
									emptyText: '数据库选择'.loc(),   
									valueField: 'id'
						})
				]},
				{ 
				   columnWidth:0.55,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						this.dataSource=new Ext.form.ComboBox({
									fieldLabel: '查询选择'.loc(),
									hiddenName : 'query_id',
									typeAhead: false,
									width:180,
									store:this.queryDS,
									editable: true,
									allowBlank:true,
									resizable:true,
									triggerAction: 'all',
									displayField: 'title',
									emptyText: '图层数据查询选择'.loc(),
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
							new Ext.form.NumberField({
								fieldLabel: '最小显示比例'.loc(),
								name: 'min_scale',
								width: 100,
								minValue: 1,
								maxValue: 18,
								value:2,
								allowBlank:false,
								maxLengthText : '最小显示比例不能超过{0}个字符!'.loc(),
								blankText:'最小显示比例不能为空!'.loc()
							})
						 ]
						},
						{	
							columnWidth:0.55,
							layout: 'form',
							
							border:false,
							items: [				
								new Ext.form.NumberField({
									fieldLabel: '最大显示比例'.loc(),
									name: 'max_scale',
									minValue: 1,
									maxValue: 18,
									width: 100,
									value:17,
									allowBlank:false,
									blankText:'最大显示比例不能为空!'.loc()
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
							this.nameColumn=new Ext.form.ComboBox({
									fieldLabel: '名称段'.loc(),
									hiddenName: 'name_column',
								//	typeAhead: false,
									width:150,
									store:this.queryColumnDS,
									editable: true,
									allowBlank:true,
									triggerAction: 'all',
									displayField: 'title',
									valueField: 'id',
									listClass: 'category-element',
									emptyText: '选择名称数据段'.loc()
							})
						 ]
						},
						{ 
						   columnWidth:0.55,
						   layout: 'form',
						   
						   border:false,
						   items: [			
								this.nameColumn=new Ext.form.ComboBox({
										fieldLabel: '样式段'.loc(),
										hiddenName: 'style_column',
										typeAhead: false,
										width:150,
										store:this.queryColumnDS,
										editable: true,
										allowBlank:true,
										triggerAction: 'all',
										displayField: 'title',
										valueField: 'id',
										listClass: 'category-element'
								})
							 ]
						}
					]
			},{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:1.0,
					   layout: 'form',
					   border:false,
					   items: [			
							this.dataColumn=new Ext.form.ComboBox({
									fieldLabel: '数据段'.loc(),
									hiddenName: 'data_column',
									typeAhead: false,
									width:150,
									store:this.queryColumnDS,
									editable: true,
									allowBlank:true,
									triggerAction: 'all',
									displayField: 'title',
									valueField: 'id',
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
					   columnWidth:1.0,
					   layout: 'form',
					   
					   border:false,
					   items: [			
								this.expColumn=new lib.multiselect.ItemSelector({
									name:"exp_val",
									fieldLabel:'导出标示项'.loc(),
									dataFields:["id", "title"],
									fromData:[],
									fromStore:this.queryColumnDS,
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
			}
	],
	tbar:ButtonArray});
	
	this.layerType.on('select',function(){
		var frm=this.MapPOIForm.form;
		if(this.layerType.getValue()=='1'){
			frm.findField('storeType').show();
		}else{
			frm.findField('storeType').hide();
		}
	},this);

	this.MapPOIForm.form.findField('storeType').on('check',function(){
		var frm=this.MapPOIForm.form;
		if(frm.findField('storeType').getValue()=='1'){
			this.dataColumn.hide();
		}else{
			this.dataColumn.show();
		}
	},this);
	this.dataSource.on('select',function(){
		this.dataColumn.reset(); 
		this.nameColumn.reset(); 
		this.expColumn.reset(); 
		var columnsParams={};
		columnsParams['type']='new';
		columnsParams['option']='querycolumn';
		columnsParams['query_id']=this.dataSource.getValue();
		this.queryColumnDS.baseParams=columnsParams;
        this.queryColumnDS.load();
	},this);

	this.ds = new Ext.data.Store({   
		proxy:new Ext.data.HttpProxy({
			url:'/dev/gis/getMapPOI.jcp',
			method:'POST'
		}),
		reader:new Ext.data.JsonReader({},["object_id","name","logicname","layer_type","query_id","data_column","id_column","name_column","exp_item","active","style_column","min_scale","max_scale","dblink","rownum","querys","queryColumns","isDefault","searchId","storeType","layerMethod","lastModifyTime","lastModifyName"]),
		remoteStore:false
	});
	this.MapPOIForm.on('render',function(){
		if(layerMethod=='Edit'){
			var frm=this.MapPOIForm.form;
			frm.findField('searchId').hide();
		}
	},this);
	this.MainTabPanel=this.MapPOIForm;
};

dev.gis.MapPOIPanel.prototype={
	init:function(){
		if(this.MainTabPanel.rendered){
			this.frames.get("Gis").mainPanel.setStatusValue(['新建对象查询'.loc()]);
		}
	},
	toggleToolBar : function(state){	
		var  tempToolBar=this.MapPOIForm.getTopToolbar();
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
		this.ds.baseParams = params;
		this.ds.baseParams['type']='edit';
		this.ds.baseParams['rand']=Math.random();
		this.ds.on('load', this.renderForm, this);
		this.ds.load({params:{start:0, limit:1}});
    },
	renderForm: function(){	
		var frm=this.MapPOIForm.form;
		var dss = this.ds.getAt(0).data;
		this.dataColumn.reset(); 
		this.nameColumn.reset(); 
		this.expColumn.reset(); 

		var queryParams={};
		queryParams['object_id']=this.params['object_id'];
		queryParams['type']='new';
		queryParams['option']='query';

		this.queryDS =new Ext.data.JsonStore({
			url: '/dev/gis/getMapPOI.jcp',
			baseParams:queryParams,
			root: 'querys',
			autoLoad :false,
			fields:["id","title"]
		});
		this.queryDS.load();

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
			frm.findField('exp_val').fromMultiselect.setValue(dss.exp_item);
			frm.findField('exp_val').fromTo();
			frm.findField('exp_val').toMultiselect.view.refresh();
			frm.findField('data_column').store=this.queryColumnDS;	
			frm.findField('name_column').store=this.queryColumnDS;
			frm.findField('data_column').setValue(dss.data_column);	
			frm.findField('name_column').setValue(dss.name_column);
			frm.findField('style_column').setValue(dss.style_column);
		},this);

		frm.findField('name').setValue(dss.name);
		frm.findField('logicname').setValue(dss.logicname);
		frm.findField('layer_type').setValue(dss.layer_type);	
		frm.findField('isActive').setValue(dss.active);
		frm.findField('min_scale').setValue(dss.min_scale);
		frm.findField('max_scale').setValue(dss.max_scale);
		frm.findField('dblink').setValue(dss.dblink);
		frm.findField('rownum').setValue(dss.rownum);

		frm.findField('isDefault').setValue(dss.isDefault);
		frm.findField('searchId').setValue(dss.searchId);
		frm.findField('storeType').setValue(dss.storeType);

		if(dss.layerMethod=='Edit'){
			frm.findField('searchId').hide();
		}
		if(dss.storeType=='1'){
			this.dataColumn.hide();
		}else{
			this.dataColumn.show();
		}
		this.layerType.fireEvent("select");
		this.frames.get('Gis').mainPanel.setStatusValue(['新建对象查询'.loc(),dss.object_id,dss.lastModifyName,dss.lastModifyTime]);
	},
	onButtonClick : function(item){
		var Gis=this.frames.get('Gis');
		var frm=this.MapPOIForm.form;
		if(item.btnId=='clear'){
			frm.reset();
		}else if(item.btnId=='save'){
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立地图定义'.loc());
			}else{
				var saveParams=this.params;	
				saveParams['type']='save';
				 saveParams['layerMethod']=this.layerMethod;
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/gis/createMapPOI.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Gis=this.frames.get('Gis');
							Gis.navPanel.getTree().loadSubNode(action.result.id,Gis.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}
		}else if(item.btnId=='updatesave'){
			  var saveParams=this.ds.baseParams;
			  saveParams['type']='updatesave';
			  if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/gis/createMapPOI.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Gis=this.frames.get('Gis');
							Gis.navPanel.getTree().loadSelfNode(action.result.id,Gis.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '警告:删除地图将不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['parent_id']=this.ds.baseParams['parent_id'];
						delParams['object_id']=this.ds.baseParams['object_id'];
						frm.submit({ 
							url:'/dev/gis/createMapPOI.jcp',
							params:delParams,
							method: 'POST',  
							scope:this,
							success:function(form, action){ 
								Gis=this.frames.get('Gis');
								Gis.navPanel.getTree().loadParentNode(Gis.navPanel.clickEvent);
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
			var programType='Gis';
			if(this.layerMethod=='Edit'){
				programType='GisEdit'; 
			}
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
							Gis.programPanel=this.frames.createPanel(new dev.program.ProgramPanel(programType,Gis));
							Gis.mainPanel.add(Gis.programPanel.MainTabPanel);
							Gis.mainPanel.setActiveTab(Gis.programPanel.MainTabPanel);
							var progParams={};
							progParams['grand_parent']=this.params['parent_id'];
							progParams['parent_id']=this.params['object_id'];
							progParams['objectId']=this.params['object_id'];
							progParams['terminalType']=terminalType;
							progParams.retFn =this.retFn;
							Gis.programPanel.init(progParams,Gis.mainPanel);
						}else{
							Ext.msg("error", result.message);
						}
					}
			},this);
		}else if(item.btnId=='setStyle'){
			using("dev.gis.MapStylePanel");
			this.params.layer_type=frm.findField('layer_type').getValue();
			this.params.retFn = this.retFn;
			Gis.mapStylePanel =new dev.gis.MapStylePanel(this.frames,this.params,false);
			Gis.mainPanel.add(Gis.mapStylePanel.MainTabPanel);
			Gis.mainPanel.setActiveTab(Gis.mapStylePanel.MainTabPanel);
			Gis.mapStylePanel.loadData(this.params);  
		}
    }
};
