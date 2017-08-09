Ext.namespace("dev.gis");

dev.gis.MapLayerPanel = function(frames,params){
	this.frames = frames;
	this.params=params;
	var Gis = this.frames.get("Gis");
	this.retFn=function(main){
		main.setActiveTab("MapLayerPanel");
		main.setStatusValue(['图层设定'.loc()]);
	}.createCallback(Gis.mainPanel);

	this.ButtonArray = [];
	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
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
	this.ButtonArray.push(new Ext.Toolbar.Button({
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

	var queryParams={};
	queryParams['parent_id']=this.params['parent_id'];
	queryParams['object_id']=this.params['object_id'];
	queryParams['type']='new';
	queryParams['option']='query';
	this.queryDS =new Ext.data.JsonStore({
		url: '/dev/gis/getMapLayer.jcp',
		baseParams:queryParams,
		root: 'querys',
		autoLoad :false,
		fields:["id","title"]
	});

	this.queryColumnDS =new Ext.data.JsonStore({
		url: '/dev/gis/getMapLayer.jcp',
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

	this.polyData=[['1','梯变颜色图'.loc()],['3','区间样式图'.loc()]];
	this.lineData=[['3','区间样式图'.loc()]];
	this.markerData=[['3','区间样式图'.loc()],['4','变径标识图'.loc()],['5','饼图'.loc()],['6','柱图'.loc()],['7','变径饼图'.loc()]];

	this.themeStore=new Ext.data.SimpleStore({
		fields:['id', 'title'],
		scope:this
	});

	var searchParams={};
	searchParams['type']='new';
	searchParams['option']='search';
	this.searchDS =new Ext.data.JsonStore({
		url: '/dev/gis/getMapPOI.jcp',
		baseParams:searchParams,
		root: 'searchTypes',
		autoLoad :true,    
		fields:["id","title"]
	});

	this.mapLayerForm = new Ext.form.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
		id: 'MapLayerPanel',
        url:'/dev/gis/createMapLayer.jcp',
		cached:true,
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items: [
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
						xtype:'textfield',
						fieldLabel: '逻辑名称'.loc(),
						name: 'logicname',
						width: 150,
						regex:/^[^\<\>\'\"\&]+$/,
						regexText:'逻辑名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
						maxLength : 100,
						allowBlank:false,
						maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
						blankText:'逻辑名称不能为空!'.loc()
					},
					{
							xtype:'combo',
							fieldLabel: '数据类别'.loc(),
							hiddenName : 'layer_type',
							typeAhead: false,
							width:150,
							mode: 'local',
							store:new Ext.data.SimpleStore({
								fields:['layertypeId', 'layertype'],
								data:[['1','点'.loc()],['2','线'.loc()],['3','面'.loc()]]
							}),
							editable: true,
							value:'1',
							allowBlank:false,
							triggerAction: 'all',
							displayField: 'layertype',
							listClass: 'category-element',
							emptyText: '选择数据类别'.loc(),
							blankText:'数据类别必须选择.'.loc(),
							valueField: 'layertypeId',
							listeners:{
								select: function(){	  
									var frm=this.mapLayerForm.form;
									if(frm.findField('layer_type').getValue()=='1'){
										frm.findField('storeType').show();
									}else{
										frm.findField('storeType').hide();
									}	
									this.mapLayerForm.form.findField("chartType").getValue()						
									if(frm.findField('layer_type').getValue()=='1'){
										this.themeStore.loadData(this.markerData);
									}else if(frm.findField('layer_type').getValue()=='2'){
										this.themeStore.loadData(this.lineData);
									}else{
										this.themeStore.loadData(this.polyData);
									}
								},
								scope:this
							}
					}
				 ]
				},
				{	columnWidth:0.55,
					layout: 'form',
					border:false,
					items: [				
						{	       
							xtype:'textfield',
							fieldLabel: '名称'.loc(),
							name: 'name',
							width: 150,
							maxLength : 100,
							allowBlank:false,
							maxLengthText : '名称不能超过{0}个字符!'.loc(),
							blankText:'名称不能为空!'.loc()
						},{
									xtype:'radiogroup',
									name:'storeType',
									fieldLabel:'地理数据存储'.loc(),
									width:100,
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
            items:[
			{ 
			   columnWidth:0.45,
			   layout: 'form',
			   border:false,
			   items: [	
					this.layerType = new Ext.form.RadioGroup({
								fieldLabel: '图层类别'.loc(),
								width:180,
								name: 'hasAttribute',
								items: [
									{boxLabel: '基础图层'.loc(), name: 'hasAttribute', inputValue:'0', checked: true},
									{boxLabel: '专题图层'.loc(), name: 'hasAttribute', inputValue:'1'}
								]
					})
				 ]
			},
			{ 
			   columnWidth:0.55,
			   layout: 'form',
			   border:false,
			   items: [	
				   		{
							xtype:'combo',
							fieldLabel: '专题图类别'.loc(),
							hiddenName: 'chartType',
							typeAhead: false,
							width:150,
							mode: 'local',
							store:this.themeStore,
							editable: true,    
							allowBlank:true,
							listeners:{
								select:function(){
									this.toggleChartType(this.layerType.getValue(),this.mapLayerForm.form.findField("chartType").getValue());
								},
								scope:this
							},
							triggerAction: 'all',
							displayField: 'title',
							listClass: 'category-element',
							emptyText: '专题图类别'.loc(),
							blankText:'专题图类别必须选择.'.loc(),
							valueField: 'id'
						 },
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
						})]
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
					{
						xtype:'numberfield',
						fieldLabel: '显示顺序'.loc(),
						name: 'seq',
						width: 100,
						minValue: 0,
						maxValue: 1000,
						allowBlank:false,
						minLengthText : '显示顺序不能小于{0}!'.loc(),
						maxLengthText : '显示顺序不能大于{0}!'.loc(),
						blankText:'显示顺序不能为空!'.loc()
					}
				 ]
			},
			{ 
			   columnWidth:0.55,
			   layout: 'form',
			   border:false,
			   items: [	
				   	{
						xtype:'radiogroup',
						fieldLabel:'缺省显示'.loc(),
						width:120,
						items: [
							{boxLabel: '是'.loc(), name: 'onDefault', inputValue:true},
							{boxLabel: '否'.loc(), name: 'onDefault', inputValue:false,checked: true}
						]
					}]
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
				 ]  
				},
				{	columnWidth:0.55,
					layout: 'form',
					border:false,
					items: [{
							xtype:'combo',
							fieldLabel: '查询选择'.loc(),
							hiddenName : 'query_id',
							typeAhead: false,
							width:150,
							store:this.queryDS,
							editable: true,
							allowBlank:true,
							triggerAction: 'all',
							displayField: 'title',
							emptyText: '图层数据查询选择'.loc(),
							listeners:{
								select: function(){
									this.mapLayerForm.form.findField("data_column").reset();
									this.mapLayerForm.form.findField("name_column").reset();
									this.mapLayerForm.form.findField("attr_column").reset();
									this.mapLayerForm.form.findField("attr2_column").reset();
									var columnsParams={};
									columnsParams['type']='new';
									columnsParams['option']='querycolumn';
									columnsParams['query_id']=this.mapLayerForm.form.findField("query_id").getValue();
									this.queryColumnDS.baseParams=columnsParams;
									this.queryColumnDS.load();
								},
								scope:this
							},
							valueField: 'id'
						}
					]
				}  
			]
		},{
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
							fieldLabel:'状态'.loc(),
							width:120,
							items: [
								{boxLabel: '激活'.loc(), name: 'active', inputValue:true, checked: true},
								{boxLabel: '暂停'.loc(), name: 'active', inputValue:false}
							]
						}
				 ]  
				},
				{	columnWidth:0.55,
					layout: 'form',
					border:false,
					items: [	
						 new Ext.form.ComboBox({
					 		fieldLabel: '透明度'.loc(),
							allowBlank : true,
							hiddenName : 'opacity',
							store : new Ext.data.SimpleStore({
								fields:["value","text"],data:[['10','10%'],['20','20%'],['30','30%'],['40','40%'],['50','50%'],['60','60%'],['70','70%'],['80','80%'],['90','90%'],['99','100%']]
							}),
							width:100,
							valueField : 'value',    
							displayField : 'text',
							triggerAction : 'all',  
							clearTrigger : false,
							mode : 'local'
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
						{
							xtype:'numberfield',
							fieldLabel: '最小显示比例'.loc(),
							name: 'min_scale',
							width: 100,
							minValue: 1,
							maxValue: 18,
							value:2,
							allowBlank:false,
							maxLengthText : '最小显示比例不能超过{0}个字符!'.loc(),
							blankText:'最小显示比例不能为空!'.loc()
					   }
					 ]
					},
					{	
						columnWidth:0.55,
						layout: 'form',
						
						border:false,
						items: [	
							{
								xtype:'numberfield',
								fieldLabel: '最大显示比例'.loc(),
								name: 'max_scale',
								minValue: 1,
								maxValue: 18,
								width: 100,
								value:17,
								allowBlank:false,
								blankText:'最大显示比例不能为空!'.loc()
							}
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
									xtype:'combo',
									fieldLabel: '数据段'.loc(),
									id:'data_column_id',
									hiddenName: 'data_column',
									typeAhead: false,
									width:150,
									store:this.queryColumnDS,
									editable: true,
									allowBlank:false,
									triggerAction: 'all',
									displayField: 'title',
									valueField: 'id',
									listClass: 'category-element',
									emptyText: '选择地理数据段'.loc()
							})
						 ]
						}
					]
			},{
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
			},{
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:1.0,
					   layout: 'form', 
					   border:false,
					   items: [			
							{
								xtype:'combo',
								fieldLabel: '属性段'.loc(),
								id:'attr_column_id',
								hiddenName: 'attr_column',
								typeAhead: false,
								width:150,
								store:this.queryColumnDS,
								editable: true,
								allowBlank:true,
								triggerAction: 'all',
								displayField: 'title',
								valueField: 'id',
								listClass: 'category-element',
								emptyText: '选择属性段数据段'.loc()
							}
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
								this.attr2Column=new lib.multiselect.ItemSelector({
												name:"attr2_column",
												fieldLabel:'属性段'.loc(),    
												dataFields:["id", "title"],
												fromData:[],
												toData:[],
												fromStore:this.queryColumnDS,
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
			},
			this.chartColorPanel=new Ext.Panel({
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:0.45,
					   layout: 'form',
					   
					   border:false,
					   items: [			
							new lib.ColorField.ColorField({
								fieldLabel: '背景色'.loc(),
								id: 'bgcolor',
								width: 120,
								allowBlank: true
							})
						 ]
						},
						{	
							columnWidth:0.55,
							layout: 'form',
							
							border:false,
							items: [				
								new lib.ColorField.ColorField({
									fieldLabel: '边框色'.loc(),
									id: 'bordercolor',
									width: 120,
									allowBlank: true
								})
							 ]
						}
					] 
				}),  
				{
					xtype:'numberfield',
					fieldLabel: '分级数量'.loc(),
					name: 'nbucket',
					width: 100,
					allowDecimals: false,
					allowNegative : false,
					allowBlank:true
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
								xtype:'numberfield',
								fieldLabel: '初始半径'.loc(),
								name: 'initradius',
								width: 100,
								allowDecimals: false,
								allowNegative : false,
								allowBlank:true
							}
						 ]
					},
					 {	
						columnWidth:0.55,
						layout: 'form',
						
						border:false,
						items: [		
							 {
								xtype:'numberfield',
								fieldLabel: '半径递增量'.loc(),
								name: 'increradius',
								width: 100,
								allowDecimals: false,
								allowNegative : false,
								allowBlank:true
							 }
						 ]
					}
					]
			},
			this.chartSizePanel=new Ext.Panel({
					layout:'column',
					border:false,
					items:[
					{ 
					   columnWidth:0.45,
					   layout: 'form',
					   
					   border:false,
					   items: [			
							{
								xtype:'numberfield',
								fieldLabel: '图表宽度'.loc(),
								name: 'chartWidth',
								width: 100,
								minValue: 1,
								maxValue: 100,
								allowBlank:true
							}
						 ]
						},
						{	
							columnWidth:0.55,
							layout: 'form',
							
							border:false,
							items: [				
								{
									xtype:'numberfield',
									fieldLabel: '图表高度'.loc(),
									name: 'chartHeight',
									minValue: 1,
									maxValue: 100,
									width: 100,
									allowBlank:true
								}
							 ]
						}
					]
				})
	],
	tbar:this.ButtonArray});
	this.layerType.on('change',function(){   
		this.toggleLayerType(this.layerType.getValue());
	},this);
	this.ds = new Ext.data.Store({
		proxy:new Ext.data.HttpProxy({
			url:'/dev/gis/getMapLayer.jcp',
			method:'POST'
		}),
		reader:new Ext.data.JsonReader({},["group_id","object_id","name","logicname","layer_type","query_id","hasattribute","chart_type","data_column","id_column","name_column","attr_column","style_column","nbucket","basecolor","strockcolor","initradius","increradius","chartheigth","chartwidth","active","min_scale","max_scale","querys","queryColumns","styles","lastModifyTime","lastModifyName","dblink","searchId","exp_val","storeType","seq","opacity","onDefault"]),
		remoteStore:false
	});
	this.MainTabPanel=this.mapLayerForm;
};  
dev.gis.MapLayerPanel.prototype={
	init:function(params){
		if(this.MainTabPanel.rendered){
			this.mapLayerForm.form.findField("chartType").hide();
			this.toggleChartType('0','0');
			this.mapLayerForm.form.reset();
			this.mapLayerForm.form.findField("chartType").enable();
			this.mapLayerForm.form.findField("hasAttribute").enable();
			this.frames.get("Gis").mainPanel.setStatusValue(['图层设定'.loc(),params.parent_id,'无'.loc(),'无'.loc()]);
		}
	},	
	toggleLayerType : function(layerType){	
		var frm=this.mapLayerForm.form;
		if(layerType=='0'){
			frm.findField("name_column").show();
			frm.findField("style_column").show();
			frm.findField("exp_val").show();
			frm.findField("searchId").show();
			frm.findField("chartType").hide();
			this.toggleChartType(this.layerType.getValue(),'0');
		}else{
			frm.findField("name_column").hide();
			frm.findField("style_column").hide();
			frm.findField("exp_val").hide();
			frm.findField("chartType").show();
			frm.findField("searchId").hide();
			if(frm.findField('layer_type').getValue()=='1'){
				this.themeStore.loadData(this.markerData);
			}else if(frm.findField('layer_type').getValue()=='2'){
				this.themeStore.loadData(this.lineData);
			}else{
				this.themeStore.loadData(this.polyData);
			}
			frm.findField("chartType")
			this.toggleChartType(this.layerType.getValue(),'0');
		}
    },
	toggleChartType:function(layerType,chartType){
		var frm = this.mapLayerForm.form;
		if(layerType=='0'){
			frm.findField("attr_column").hide();
			frm.findField("attr2_column").hide();
			this.chartSizePanel.hide();
			frm.findField("increradius").hide();
			frm.findField("initradius").hide();
			frm.findField("nbucket").hide();
			this.chartColorPanel.hide();
		}else{
			this.chartSizePanel.hide();
			frm.findField("increradius").hide();
			frm.findField("initradius").hide();
			frm.findField("nbucket").hide();
			this.chartColorPanel.hide();
			if(chartType=='1'){  
				this.chartColorPanel.show();
				frm.findField("nbucket").show();
			}else if(chartType=='4'){
				this.chartColorPanel.show();
				frm.findField("increradius").show();
				frm.findField("initradius").show();
			}else if(chartType=='7'){
				frm.findField("increradius").show();
				frm.findField("initradius").show();
			}else if(chartType=='6'){
				this.chartSizePanel.show();
			}
			if(chartType=='1'||chartType=='2'||chartType=='3'||chartType=='4'){
				frm.findField("attr_column").show();
				frm.findField("attr2_column").hide();
			}else if(chartType=='6'||chartType=='7'||chartType=='5'){
				frm.findField("attr_column").hide();
				frm.findField("attr2_column").show();
			}
		}
	},
	formCreate : function(val){
		this.mapLayerForm.getTopToolbar().items.each(function(item){    
			item.setVisible(item.state=='create');
		});
    },
	formEdit : function(val){
		this.mapLayerForm.getTopToolbar().items.each(function(item){    
			item.setVisible(item.state=='edit');
		});
    },
	loadData : function(params){	
		this.ds.baseParams = params;
		this.ds.baseParams['type']='edit';    
		this.ds.baseParams['rand']=Math.random();
		this.ds.on('load', this.renderForm, this);
		this.ds.load({params:{start:0, limit:1}});
    },
	renderForm: function(){	
		var frm=this.mapLayerForm.form;
		frm.findField("data_column").reset();
		frm.findField("name_column").reset();
		frm.findField("attr_column").reset();
		frm.findField("attr2_column").reset();
		frm.findField("style_column").reset();
		frm.findField("exp_val").reset();
 
		var queryParams={};
		queryParams['object_id']=this.params['object_id'];
		queryParams['type']='new';
		queryParams['option']='query';

		this.queryDS =new Ext.data.JsonStore({
			url: '/dev/gis/getMapLayer.jcp',
			baseParams:queryParams,
			root: 'querys',
			autoLoad :false,
			fields:["id","title"]
		});
		this.queryDS.load();
		this.queryDS.on('load',function(){
			frm.findField('query_id').store=this.queryDS;
			frm.findField('query_id').setValue(this.ds.getAt(0).data.query_id);

			var columnsParams={};
			columnsParams['type']='new';
			columnsParams['option']='querycolumn';
			columnsParams['query_id']=this.ds.getAt(0).data.query_id;
			this.queryColumnDS.baseParams=columnsParams;
			this.queryColumnDS.load();

			this.queryColumnDS.on('load',function(){
				setTimeout(function(){
					if(frm.findField("attr2_column").hidden!=true){
						frm.findField('attr2_column').fromMultiselect.setValue(this.ds.getAt(0).data.attr_column);
						frm.findField('attr2_column').fromTo();
						frm.findField('attr2_column').toMultiselect.view.refresh();
					}
					if(frm.findField("exp_val").hidden!=true){
						frm.findField('exp_val').fromMultiselect.setValue(this.ds.getAt(0).data.exp_val);
						frm.findField('exp_val').fromTo();
						frm.findField('exp_val').toMultiselect.view.refresh();
					}
				}.createDelegate(this), 200);
				frm.findField('data_column').store=this.queryColumnDS;	
				frm.findField('name_column').store=this.queryColumnDS;			
				frm.findField('attr_column').store=this.queryColumnDS;
				frm.findField('style_column').store=this.queryColumnDS;
				frm.findField('data_column').setValue(this.ds.getAt(0).data.data_column);	
				frm.findField('name_column').setValue(this.ds.getAt(0).data.name_column);
				frm.findField('style_column').setValue(this.ds.getAt(0).data.style_column);
				var attrValue = this.ds.getAt(0).data.attr_column;
				if(Ext.isArray(attrValue)){
					frm.findField('attr_column').setValue(attrValue.toString());		
				}else{
					frm.findField('attr_column').setValue(this.ds.getAt(0).data.attr_column);		
				}
			},this);
		},this);

		this.mapLayerForm.form.findField("chartType").disable();
		this.mapLayerForm.form.findField("hasAttribute").disable();

		frm.findField('name').setValue(this.ds.getAt(0).data.name);
		frm.findField('logicname').setValue(this.ds.getAt(0).data.logicname);
		frm.findField('dblink').setValue(this.ds.getAt(0).data.dblink);	
		frm.findField('searchId').setValue(this.ds.getAt(0).data.searchId);	
		frm.findField('storeType').setValue(this.ds.getAt(0).data.storeType);
  
		frm.findField('layer_type').setValue(this.ds.getAt(0).data.layer_type);	
		if(this.ds.getAt(0).data.layer_type=='1'){
			this.themeStore.loadData(this.markerData);
		}else if(this.ds.getAt(0).data.layer_type=='2'){
			this.themeStore.loadData(this.lineData);
		}else{
			this.themeStore.loadData(this.polyData);
		}
		frm.findField('hasAttribute').setValue(this.ds.getAt(0).data.hasattribute);	
		frm.findField('chartType').setValue(this.ds.getAt(0).data.chart_type);
															
		var chart_type=this.ds.getAt(0).data.chart_type;	
		this.mapLayerForm.getTopToolbar().items.each(function(item){  
			if(item.btnId=='setStyle'){
				var hasattribute=this.ds.getAt(0).data.hasattribute;
				item.setVisible(hasattribute=='0'||(hasattribute=='1'&& "3,5,6,7".indexOf(chart_type)!=-1));
			}
		}.createDelegate(this)); 

		frm.findField('active').setValue(this.ds.getAt(0).data.active);
		frm.findField('min_scale').setValue(this.ds.getAt(0).data.min_scale);
		frm.findField('max_scale').setValue(this.ds.getAt(0).data.max_scale);

		frm.findField('bgcolor').setValue(this.ds.getAt(0).data.basecolor);
		frm.findField('bordercolor').setValue(this.ds.getAt(0).data.strockcolor);
		frm.findField('nbucket').setValue(this.ds.getAt(0).data.nbucket);	
		frm.findField('initradius').setValue(this.ds.getAt(0).data.initradius);
		frm.findField('increradius').setValue(this.ds.getAt(0).data.increradius);
		frm.findField('chartWidth').setValue(this.ds.getAt(0).data.chartwidth);	
		frm.findField('chartHeight').setValue(this.ds.getAt(0).data.chartheigth);	
     
		frm.findField('seq').setValue(this.ds.getAt(0).data.seq);	
		frm.findField('opacity').setValue(this.ds.getAt(0).data.opacity);	
		frm.findField('onDefault').setValue(this.ds.getAt(0).data.onDefault);

		setTimeout(function(){
			this.toggleLayerType(this.ds.getAt(0).data.hasattribute);
			this.toggleChartType(this.ds.getAt(0).data.hasattribute,this.ds.getAt(0).data.chart_type);
		}.createDelegate(this), 200);

		this.frames.get('Gis').mainPanel.setStatusValue(['图层设定'.loc(),this.ds.getAt(0).data.object_id,this.ds.getAt(0).data.lastModifyName,this.ds.getAt(0).data.lastModifyTime]);	
	},
	onButtonClick : function(item){
		var Gis = this.frames.get("Gis");
		var frm=this.mapLayerForm.form;
		if(item.btnId=='clear'){
			frm.reset();
		}else if(item.btnId=='save'){	
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立地图定义'.loc());
			}else{
				var saveParams={};
				Ext.apply(saveParams,this.params);	
				saveParams['type']='save';
				saveParams['chartType'] = frm.findField("chartType").getValue();
				saveParams['hasAttribute'] = frm.findField("hasAttribute").getValue();
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/gis/createMapLayer.jcp',
						params:saveParams,
						method: 'POST',  
						scope:this,
						success:function(form, action){ 
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
				saveParams['chartType'] = frm.findField("chartType").getValue();
				saveParams['hasAttribute'] = frm.findField("hasAttribute").getValue();
			  if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/gis/createMapLayer.jcp',
						params:saveParams,
						method: 'POST',  
						scope:this,
						success:function(form, action){ 
							Gis.navPanel.getTree().loadSelfNode(action.result.id,Gis.navPanel.clickEvent);
							Ext.msg("info",'数据更新成功'.loc());
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
							url:'/dev/gis/createMapLayer.jcp',
							params:delParams,
							method: 'POST',  
							scope:this,
							success:function(form, action){ 
								Gis.navPanel.getTree().loadParentNode(Gis.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
             }.createDelegate(this));
		}else if(item.btnId=='setStyle'){
			var Gis = this.frames.get('Gis');
			this.params.retFn=this.retFn;
			var frm = this.mapLayerForm.form
			var hasAttribute=frm.findField('hasAttribute').getValue();
			if(hasAttribute=='0'){
				using("dev.gis.MapStylePanel");
				this.params.layer_type=frm.findField('layer_type').getValue();
				this.params.retFn = this.retFn;
				Gis.mapStylePanel =new dev.gis.MapStylePanel(this.frames,this.params,false);
				Gis.mainPanel.add(Gis.mapStylePanel.MainTabPanel);
				Gis.mainPanel.setActiveTab(Gis.mapStylePanel.MainTabPanel);
				Gis.mapStylePanel.loadData(this.params);
			}else{
				var chartTypes = frm.findField("chartType").getValue();
				this.params.chartType = chartTypes;
				if(chartTypes=='5'||chartTypes=='6'||chartTypes=='7'){
					using("dev.gis.MapChartPanel");
					this.params.attr_column= this.ds.getAt(0).data.attr_column;
					var attLength = this.params.attr_column.length;
					if(attLength!=null&& attLength!=0){
						Gis.chartPanel =new dev.gis.MapChartPanel(this.frames,this.params); 
						Gis.chartPanel.loadData(this.params);				
						Gis.mainPanel.add(Gis.chartPanel.MainTabPanel);
						Gis.mainPanel.setActiveTab(Gis.chartPanel.MainTabPanel);
					}else{
						Ext.msg('error','请选择属性段'.loc());
					}
				}else if(chartTypes=='3'){	
					using("dev.gis.MapStylePanel");
					this.params.layer_type=frm.findField('layer_type').getValue();
					this.params.retFn = this.retFn;
					Gis.mapStylePanel =new dev.gis.MapStylePanel(this.frames,this.params,true);
					Gis.mainPanel.add(Gis.mapStylePanel.MainTabPanel);
					Gis.mainPanel.setActiveTab(Gis.mapStylePanel.MainTabPanel);
					Gis.mapStylePanel.loadData(this.params);
				}
			}
		}
    }
};