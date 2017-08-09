Ext.namespace("bin.exe");
loadcss("bin.exe.search");
using("lib.SuperSelect.SuperBoxSelect");
loadcss("lib.SuperSelect.superboxselect");
bin.exe.SearchPanel = function(parentPanel, params) {
    var record=this.record = Ext.data.Record.create([
		{name: 'name'},
   		{name: 'title'},
	   	{name: 'title1'},
     	{name: '_category', type: 'auto'},
		{name: '_parent', type: 'auto'},
     	{name: 'exportData'},
		{name: 'rowCount', type: 'auto'},
		{name: '_desc'},
     	{name: 'searchDate'},
	   	{name: 'exportTab'},
		{name: 'exportItem'},
		{name: 'searchId'}
   	]);
	var store=this.store = new Ext.data.GroupingStore({
		autoLoad : false,
		url: '/bin/exe/search.jcp',
		reader: new Ext.data.JsonReader(
			{
				root: 'data',
				totalProperty: 'total',
				successProperty: 'success'
			}, 
			record
		),
		baseParams: params,
		sortInfo:{field: 'title', direction: "ASC"},
		groupField:'_parent'
	});

	var me=this;

	this.titleRenderers = {
		topic : function(value, p, record){
			return String.format(
					'<div style="padding-left:0px;font-size:13px"><b>{0}</b></div>',value);
		}
	};
	if(params['dataId']==null){

		
		var tagStore = new Ext.data.JsonStore({
			id:'id',
			root:'rows',
			fields:[
				{name:'id', type:'int'},
				{name:'tag', type:'string'},
				{name:'name', type:'string'}
			],
			url: '/bin/exe/fetchSearchTags.jcp',
			baseParams: params
		});

		 this.treeLoader=new Ext.tree.TreeLoader({
			clearOnLoad:true,
			url:'/bin/exe/searchLink.jcp',
			baseParams: params
		 });
		 this.store.on('load',function(){
			 if(this.store.getCount()>0){
				 var keyArray=[];
				 for(var i=0;i<this.store.getCount();i++){
					 var rec = this.store.getAt(i);
					  keyArray.push(rec.get('name'));
				 }
				var distinctArray=Tool.distinct(keyArray);
				this.treeLoader.baseParams['key']=distinctArray;
				this.treeLoader.load(this.linkPanel.getRootNode(),function(){
					this.linkPanel.expandAll();
				},this);
			 }
		 },this);
		 this.linkPanel= new Ext.tree.TreePanel({
                region:'west',
                title:'关联搜索'.loc(),
                split:false,
                width: 250,
                minSize: 175,
                maxSize: 400,
                collapsible: true,
                margins:'0 0 0 0',
                loader:this.treeLoader,
                rootVisible:false,
                lines:false,
                autoScroll:true,
                root: new Ext.tree.AsyncTreeNode({
					  text: '关联搜索'.loc(),
					  expanded:true
                })
        });
		var sm = this.linkPanel.getSelectionModel();
		sm.on('selectionchange', function(sm, node){
			me.searchText1.setValue('"'+node.id+'"');
			this.store.baseParams=params;
			this.store.baseParams['key']=node.id; 
			this.store.baseParams['precise']=true; 
			this.store.load({
				params : {
					start : 0,  
					limit : 6
				}
			});
		},this);
		this.indexPanel=new Ext.grid.GridPanel({
			border: true,
			region:'center',
			layout:'fit',
			store: this.store,
			scope:this,
			columns: [    
				{id:'title',header: '数据项'.loc(), width: 300, sortable: true, menuDisabled:true,dataIndex: 'title',renderer:this.titleRenderers.topic},
				{groupName: params.tooltipText, width: 300,hidden:true, sortable: true, menuDisabled:true, dataIndex: '_parent'},
				{id:'title1',header: '数据项'.loc(), width: 300,hidden:true, sortable: true, menuDisabled:true, dataIndex: 'title1',renderer:this.titleRenderers.topic},
				{groupName: '类别'.loc(), width: 300,hidden:true, sortable: true, menuDisabled:true, dataIndex: '_category'},
				{header: '数据行数'.loc(), width: 50, fix: true, sortable: true, menuDisabled:true, dataIndex: 'rowCount'},
				{header: '描述'.loc(), width: 50,hidden:true, fix: true, sortable: true, menuDisabled:true, dataIndex: '_desc'},
				{header: '搜索日期'.loc(), width: 50, fix: true, sortable: true, menuDisabled:true, dataIndex: 'searchDate'}
			],
			view:me.groupview=new Ext.grid.GroupingView({
				forceFit:true,
				enableRowBody:true,
				showPreview:true,
				getRowClass : function(record, rowIndex, p, ds){
					if(this.showPreview){
						p.body = '<p style="padding-left:40px;">'+record.data._desc+'</p>';
						return 'x-grid3-row-expanded';
					}
					return 'x-grid3-row-collapsed';
				},
				groupTextTpl: '{text}('+'共'.loc()+'{[values.rs.length]}'+'条)'.loc()
			}),
			stripeRows: true,
			hideHeaders:false,
			autoExpandColumn: 'title',
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			bbar: new Ext.PagingToolbar({
					pageSize : 6,
					store :  this.store,
					displayInfo : true,
					emptyMsg : '没有数据'.loc()
			}),
			tbar:[
				this.categoryBtn=new Ext.Button({
					pressed: false,
					enableToggle:false,
					scope:this,
					text:'分类模式'.loc(),  
					tooltip: {title:'分类模式'.loc(),text:'按照数据类别进行分组'.loc()},
					icon: '/themes/icon/database/schema.gif',
					handler: function(){
						if(me.categoryBtn.text=='分类模式'.loc()){
							me.categoryBtn.setText('对象模式'.loc());  
							me.categoryBtn.setTooltip({title:'对象模式'.loc(),text:'按照数据对象进行分组'.loc()});
							var grid = me.groupview.grid;
							me.groupview.enableGrouping = true;

							grid.store.groupBy('_category');
							grid.fireEvent('groupchange', grid, grid.store.getGroupState());
							var colModel = me.groupview.cm;
							var index    = colModel.getIndexById('title');
							colModel.setHidden(index, true);
							var index1= colModel.getIndexById('title1');
							colModel.setHidden(index1, false);
							me.groupview.refresh();
							//me.groupview.groupview.toggleGroup('_parent',true); 
						}else{
							me.categoryBtn.setText('分类模式'.loc());  
							me.categoryBtn.setTooltip({title:'分类模式'.loc(),text:'按照数据类别进行分组'.loc()});
							var grid = me.groupview.grid;
							me.groupview.enableGrouping = true;

							grid.store.groupBy('_parent');
							grid.fireEvent('groupchange', grid, grid.store.getGroupState());

							var colModel = me.groupview.cm;
							var index    = colModel.getIndexById('title1');
							colModel.setHidden(index, true);
							var index1= colModel.getIndexById('title');
							colModel.setHidden(index1, false);
							me.groupview.refresh(); 
						}  
					}
				}),
				'-',
				this.expandBtn=new Ext.Button({
					pressed: false,
					enableToggle:false,
					text:'全部收缩'.loc(),
					tooltip: {title:'全部收缩'.loc(),text:'收缩所有节点'.loc()},
					icon: '/themes/icon/database/tree_mode.gif',
					handler: function(){
						if(me.expandBtn.text=='全部展开'.loc()){
							me.expandBtn.setText('全部收缩'.loc());  
							me.expandBtn.setTooltip({title:'全部收缩'.loc(),text:'收缩所有节点'.loc()});
							me.groupview.expandAllGroups(); 
						}else{
							me.expandBtn.setText('全部展开'.loc());  
							me.expandBtn.setTooltip({title:'全部展开'.loc(),text:'展开所有节点'.loc()});
							me.groupview.collapseAllGroups();
						} 
					}
				})
			]
		});
		this.indexPanel.on("rowclick", function(grid,rowIndex, e){
				var rec = grid.getStore().getAt(rowIndex);
				if(rec.get("searchId")!=''){
					using("bin.exe.SearchFrame");
					var seachParams={};
					seachParams['exportData']=rec.get('exportData');
					seachParams['searchId']=rec.get("searchId");
					seachParams['dataId']=rec.get("exportData");
					seachParams['exportItem']=rec.get("exportItem");
					seachParams['exportTab']=rec.get("exportTab");
					var searchFrameWin=new bin.exe.SearchFrame(seachParams);
					searchFrameWin.show();
				}
		}, this);		

		this.searchText = new lib.SuperSelect.SuperBoxSelect({
								allowBlank:true,
								msgTarget: 'under',
								allowAddNewData: true,
								hideLabel: true,
								emptyText:'输入搜索'.loc()+params.tooltipText+',多'.loc()+params.tooltipText+'搜索连续输入'.loc(),
								resizable: false,
								editable:true,
								hiddenName: 'searchText',
								style: {	
									fontSize:'24px'
								},
								width: 600,
								height:40,
								store: tagStore,
								mode: 'remote',
								displayField: 'name',
								valueField: 'tag',
								queryDelay: 0,
								triggerAction: 'all',
								minChars: 1,
								listeners:{
									newitem: function(bs,v){
										v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
										var newObj = {
											tag: v,
											name: v
										};
										bs.addItem(newObj);
									},
									specialkey:function(field,e){  
										if (e.getKey()==Ext.EventObject.ENTER){ 
										if (me.searchText.isValid()) {
												if(me.searchText.getValue()==''){
														return;
												}else{ 
													var key=me.searchText.getValue();
													var keyArr = key.split(',');
													var keys = [];
													for(var ii=0;ii<keyArr.length;ii++){
														var k = {id:keyArr[ii], name:keyArr[ii],tag:keyArr[ii]};
														keys.push(k);
													}
													 me.MainTabPanel.on('afterlayout',function(){
															me.searchText1.setValueEx(keys);
															me.store.baseParams=params;
															me.store.baseParams['key']=key; 
															me.store.load({
																params : {
																	start : 0,
																	limit : 6
																}
															});
													},me);
													me.MainTabPanel.removeAll(false);
													me.MainTabPanel.add(me.secondPanel);
													me.MainTabPanel.doLayout();
													
													}
												} else {
													return;
												}
										}
										  
									}  
								}
		}); 
		
		this.searchText1 = new lib.SuperSelect.SuperBoxSelect({
								id:'searchText1',
								allowBlank:true,
								msgTarget: 'under',
								allowAddNewData: true,
								hideLabel: true,
								emptyText:'输入搜索'.loc()+params.tooltipText+',多'.loc()+params.tooltipText+'搜索连续输入'.loc(),
								resizable: false,
								editable:true,
								hiddenName: 'searchText',
								style: {
									width: '100%',
									fontSize:'16px'
								},
								width: 450,
								height:25,
								store: tagStore,
								mode: 'remote',
								displayField: 'name',
								valueField: 'tag',
								queryDelay: 0,
								triggerAction: 'all',
								minChars: 1,
								listeners:{
									newitem: function(bs,v){
										v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
										var newObj = {
											tag: v,
											name: v
										};
										bs.addItem(newObj);
									},
									specialkey:function(field,e){
										if (e.getKey()==Ext.EventObject.ENTER){  
											if (me.searchText1.isValid()) {
												if(me.searchText1.getValue()==''){
													return;
												}else{
													var key=me.searchText1.getValue();
													me.store.baseParams=params;
													me.store.baseParams['key']=key; 
													me.store.load({
														params : {
															start : 0,
															limit : 6
														}
													});
												}
											} else {
												return;
											}
										} 
									}  
								}
		});
		/*
		this.searchText1 = new Ext.form.TextField({
					allowBlank : true,
					blankText : "输入不能为空",
					name : 'solrsearch',
					msgTarget : 'qtip',
					emptyText:'输入搜索'+params.tooltipText+',多'+params.tooltipText+'搜索用","分隔',
					height:30,
					enableKeyEvents: true,
					hideLabel:true,
					style: {
						width: '100%',
						fontSize:'20px'
					},
					listeners:{  
						specialkey:function(field,e){  
							if (e.getKey()==Ext.EventObject.ENTER){  
									if (me.searchText1.isValid()) {
										if(me.searchText1.getValue()==''){
											return;
										}else{
											var key=me.searchText1.getValue();
											me.store.baseParams=params;
											me.store.baseParams['key']=key; 
											me.store.load({
												params : {
													start : 0,
													limit : 6
												}
											});
										}
									} else {
										return;
									}
								} 
							}  
					}
		});
		*/
		this.searchBar = new Ext.Panel({
					border: false,
					layout: 'hbox',
					scope:this,
					bodyStyle:'x-panel-body x-panel-body-noheader x-panel-body-noborder',
					layoutConfig: {
						padding:'5',
						align:'top'
                    },
					defaults:{margins:'0 5 0 0'},
					items: [{
								margins : '16 0 0 10',
								style: {
									textShadow:'3px 3px 0 #EEEEEE, 3px 3px 0 #707070',
									fontSize:'32px',
									color:'#707070',
									fontFamily: "simhei"
								},  
								width:'250px',
								html :  '<span>'+params.logicName+'</span>',
								border : false
							},{
								xtype:'panel',
								width:450,
								scope:this,
								margins : '20 0 0 10', 
								border : false,
								items:this.searchText1
							},
							{
										margins : '20 0 0 10',
										xtype : 'button',
										text : '<h1 style=\'font-size:14px;\'>'+'搜索'.loc()+'</h1>',
										height : 40,
										width : 90,
										scope:this,
										handler : function(btn) {
											if (this.searchText1.isValid()) {
												if(this.searchText1.getValue()==''){
													return;
												}else{
													var key=this.searchText1.getValue();
													this.store.baseParams=params;
													this.store.baseParams['key']=key; 
													this.store.load({
														params : {
															start : 0,
															limit : 6
														}
													});
												}
											} else {
												return;
											}
										}
									},{
										margins : '20 0 0 10',
										xtype : 'button',
										text : '<h1 style=\'font-size:13px;\'>'+'高级搜索'.loc()+'</h1>',
										height : 40,
										width : 90,
										scope:this,
										handler : function(btn) {
											Ext.msg("error", '高级搜索正在开发中,请等待'.loc());
										}
									},
							{
								xtype:'spacer',
								flex:1
							}
					]
		});
		this.secondPanel = new Ext.Panel({
						layout:'border',
						items: [{
							region: 'north',
							collapsible: false,
							split: false,
							border: false,
							bodyStyle: 'padding:0px',
							height: 80,
							cmargins: '0 0 0 0',
							items:this.searchBar  
						},this.linkPanel,this.indexPanel]
		});  
		
		this.FirstPanel = new Ext.Panel({
					border: false,
					layout: 'hbox',
					scope:this,
					bodyStyle:'x-panel-body x-panel-body-noheader x-panel-body-noborder',
					layoutConfig: {
						padding:'5',
						align:'top'
                    },
					defaults:{margins:'0 5 0 0'},
					items: [{
								xtype:'spacer',
								flex:1
							},{
									border: false,
									xtype:'panel',	
									bodyStyle:'x-panel-body x-panel-body-noheader x-panel-body-noborder',
									layoutConfig: {
										padding:'5',
										align:'top'
									},
									width:'850px',
									scope:this,
									defaults:{margins:'0 5 0 0'},
									items: [{
												region : 'north',
												height : 90,
												style: {
													margin: '100px auto',
													textAlign:'center',
													textShadow:'3px 3px 0 #EEEEEE, 3px 3px 0 #707070',
													fontSize:'80px',
													color:'#707070',
													fontFamily: "simhei"
												},  
												html : params.logicName,
												border : false
											},{
												layout : 'hbox',
												collapsible : false,
												border : false,
												height:55,
												scope:this,
												items : [
													{
														xtype:'panel',
														width:600,
														scope:this,
														//margins : '0 0 0 5', 
														border : false,
														items:this.searchText
													},{
													margins : '0 0 0 5',
													xtype : 'button',
													text : '<h1 style=\'font-size:15px;\'>'+'搜索'.loc()+'</h1>',
													height : 47,
													width : 110,
													scope:this,
													style: {
														font:'16px arial,tahoma,verdana,helvetica'
													},
													handler : function(btn) {														
														if (this.searchText.isValid()) {
															if(this.searchText.getValue()==''){
																return;
															}else{
																var key=this.searchText.getValue();
																var keyArr = key.split(',');
																var keys = [];
																for(var ii=0;ii<keyArr.length;ii++){
																	var k = {id:keyArr[ii], name:keyArr[ii],tag:keyArr[ii]};
																	keys.push(k);
																}
																this.MainTabPanel.on('afterlayout',function(){
																	this.searchText1.setValueEx(keys);
																	this.store.baseParams=params;
																	this.store.baseParams['key']=key; 
																	this.store.load({
																		params : {
																			start : 0,
																			limit : 6
																		}
																	});
																},this);
																this.MainTabPanel.removeAll(false);
																this.MainTabPanel.add(this.secondPanel);
																this.MainTabPanel.doLayout();
															}
														} else {
															return;
														}
													}
												},{
													margins : '0 0 0 5',
													xtype : 'button',
													text : '<h1 style=\'font-size:15px;\'>'+'高级搜索'.loc()+'</h1>',
													height : 47,
													width : 110,
													scope:this,
													style: {
														font:'16px arial,tahoma,verdana,helvetica'
													},
													handler : function(btn) {
														Ext.msg("error", '高级搜索正在开发中,请等待'.loc());
													}
												}]
											}
									]
								},
							{
								xtype:'spacer',
								flex:1
							}
					]
				});
				this.MainTabPanel = new Ext.Panel({
						border: false,
						layout: 'fit',
						bodyStyle:'x-panel-body x-panel-body-noheader x-panel-body-noborder',
						items: [this.FirstPanel],
						scope:this
				});
	}else{
		this.indexPanel=new Ext.grid.GridPanel({
			border: true,
			region:'center',
			layout:'fit',
			store: this.store,
			scope:this,
			columns: [    
				{id:'title',header: '数据项'.loc(), width: 300, sortable: true, menuDisabled:true,dataIndex: 'title',renderer:this.titleRenderers.topic},
				{groupName: params.tooltipText, width: 300,hidden:true, sortable: true, menuDisabled:true, dataIndex: '_parent'},
				{id:'title1',header: '数据项'.loc(), width: 300,hidden:true, sortable: true, menuDisabled:true, dataIndex: 'title1',renderer:this.titleRenderers.topic},
				{groupName: '类别'.loc(), width: 300,hidden:true, sortable: true, menuDisabled:true, dataIndex: '_category'},
				{header: '数据行数'.loc(), width: 50, fix: true, sortable: true, menuDisabled:true, dataIndex: 'rowCount'},
				{header: '描述'.loc(), width: 50,hidden:true, fix: true, sortable: true, menuDisabled:true, dataIndex: '_desc'},
				{header: '搜索日期'.loc(), width: 50, fix: true, sortable: true, menuDisabled:true, dataIndex: 'searchDate'}
			],
			view:me.groupview=new Ext.grid.GroupingView({
				forceFit:true,
				enableRowBody:true,
				showPreview:true,
				getRowClass : function(record, rowIndex, p, ds){
					if(this.showPreview){
						p.body = '<p style="padding-left:40px;">'+record.data._desc+'</p>';
						return 'x-grid3-row-expanded';
					}
					return 'x-grid3-row-collapsed';
				},
				groupTextTpl: '{text} (共{[values.rs.length]}条)'
			}),
			stripeRows: true,
			hideHeaders:false,
			autoExpandColumn: 'title',
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			bbar: new Ext.PagingToolbar({
					pageSize : 6,
					store :  this.store,
					displayInfo : true,
					emptyMsg : '没有数据'.loc()
			})
		});
		this.indexPanel.on("rowclick", function(grid,rowIndex, e){
				var rec = grid.getStore().getAt(rowIndex);
				if(rec.get("searchId")!=''){
					using("bin.exe.SearchFrame");
					var seachParams={};
					seachParams['exportData']=rec.get('exportData');
					seachParams['searchId']=rec.get("searchId");
					seachParams['dataId']=rec.get("exportData");
					seachParams['exportItem']=rec.get("exportItem");
					seachParams['exportTab']=rec.get("exportTab");
					var searchFrameWin=new bin.exe.SearchFrame(seachParams);
					searchFrameWin.show();
				}
		}, this);
		var ButtonArray = [];
	    ButtonArray.push(new Ext.Toolbar.Spacer());
		this.MainTabPanel = new Ext.Panel({
					border: false,
					layout: 'border',
					bodyStyle:'x-panel-body x-panel-body-noheader x-panel-body-noborder',
					items: [this.indexPanel],
					scope:this,
					tbar : ButtonArray,
					loadData:function(params) {
						store.baseParams=params;
						store.baseParams['key']=params['exportData'];
						store.baseParams['precise']=true; 
						store.load({params : {
								start : 0,
								limit : 6
						}});
					}
		});
	}
};
Ext.extend(bin.exe.SearchPanel, Ext.Panel, {
	init : function(params) {
		this.store.baseParams=params;
		this.store.baseParams['key']=params['exportData'];
		this.store.baseParams['precise']=true; 
		this.store.load({	
		params : {
				start : 0,
				limit : 6
		}});
	}  
}); 
