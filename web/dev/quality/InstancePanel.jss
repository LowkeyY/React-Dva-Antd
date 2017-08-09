

dev.quality.InstancePanel = function(frames,params){
	using("lib.ComboTree.ComboTree");
	this.params=params;
	this.frames= frames;
	qualityInstance = this.frames.get("qualityInstance");
	this.retFn = function(main){
		main.setActiveTab("instancePanel");
		main.setStatusValue(["质控实例管理".loc()]);
	}.createCallback(qualityInstance.mainPanel);

	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				state:'create',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'dbLinkManage',
				text: '数据库连接管理'.loc(),
				icon: '/themes/icon/database/connected_alias.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				state:'create',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
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
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'condionSet',
				text: '条件设置'.loc(),
				icon: '/themes/icon/all/find.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'secondCondionSet',
				text: '扩展表条件设置'.loc(),
				icon: '/themes/icon/database/overview.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'authSet',
				text: '权限设置'.loc(),
				icon: '/themes/icon/common/lock.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));

	this.conditionDs = new Ext.data.SimpleStore({
		fields : ['id', 'title'],
		data : [['0', '本表过滤'.loc()], ['1', '关联表过滤'.loc()],['2','查询条件过滤'.loc()]]
	});
	//var temParams=params;
	//temParams['method']='column';
	this.colStore =new Ext.data.JsonStore({
		url: '/dev/quality/getFColumn.jcp',
		root: 'dataItem',
		autoLoad :false,
		fields:["colid","lname"]
	});
	this.tabStore =new Ext.data.JsonStore({
		url: '/dev/quality/getFTable.jcp',
		root: 'dataItem',
		autoLoad :false,
		fields:["tabid","lname"]
	});
	this.columnList=new Ext.form.ComboBox({
				fieldLabel : '关联字段'.loc(),
				lazyRender : true,
				typeAhead: false,
				width:180,
				editable: false,
				name : 'condition_column',
				hidden:true,
				store : this.colStore,
				valueField : 'colid',
				displayField : 'lname',
				triggerAction : 'all'
	});

	this.columnList.on('change',function(){
		this.instanceForm.form.findField('condition_table').reset(); 
		var tempParams=this.colStore.baseParams;
		tempParams['col_id']=this.instanceForm.form.findField('condition_column').getValue();
		//tempParams['method']='table';
		this.tabStore.baseParams=tempParams;
		this.tabStore.load();
	},this);   
	var Query = Ext.data.Record.create([{
				name : 'text'
			}, {
				name : 'value'
	}]);
	this.queryStore=new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : "/dev/quality/getQuery.jcp?objectId="+this.params["parent_id"],
					method : 'GET'
				}),
		reader : new Ext.data.JsonReader({
					root : 'items',
					totalProperty : 'totalCount',
					id : 'id'
				}, Query),
		remoteSort : false,
		autoLoad : true
	});
	this.linkStore =new Ext.data.JsonStore({
		url: '/dev/quality/getQualityDblink.jcp',
		root: 'dataItem',
		autoLoad :true,
		baseParams:this.params,
		fields:["text","value"]
	});
	this.instanceForm = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
		id: 'instancePanel',
		cached:true,
        url:'/dev/quality/instancemag.jcp',
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
							fieldLabel: '名称'.loc(),
							name: 'instance_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:"实例名称中不应有".loc()+"&、<、>、'、\"、"+"字符".loc(),   
							width: 250,
							maxLength : 50,
							allowBlank:false,
							maxLengthText : "实例名称不能超过{0}个字符!".loc(),
							blankText:"实例名称必须提供.".loc()
						})
					 ]}
			]
		},
				{
			layout:'column',
			border:false,
            items:
			[{ 
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [				
						new Ext.form.ComboBox({
								fieldLabel : '条件模式'.loc(),
								lazyRender : true,
								name : 'condition_type',
								minLength : 1,
								value : 0,
								store : this.conditionDs,
								valueField : 'id',
								displayField : 'title',
								triggerAction : 'all',
								mode : 'local'
						})
					 ]
				},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,  
				   items: [	
							new Ext.form.ComboBox({
								fieldLabel : '数据库连接'.loc(),
								lazyRender : true,
								name : 'db_link',
								store : this.linkStore,
								valueField : 'value',
								displayField : 'text',
								hidden:true,
								triggerAction : 'all',
								mode : 'local'
						})
					]
				}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[{ 
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [				
							this.columnList
					 ]
				},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,  
				   items: [	
							new Ext.form.ComboBox({
									fieldLabel : '关联表'.loc(),
									lazyRender : false,
									name : 'condition_table',
									hidden:true,
									store : this.tabStore,
									valueField : 'tabid',
									displayField : 'lname',
									triggerAction : 'all',
									mode : 'local'
							}),
							new Ext.form.ComboBox({
									fieldLabel : '关联查询'.loc(),
									lazyRender : true,
									name : 'condition_query',
									store : this.queryStore,
									valueField : 'value',
									hidden:true,
									displayField : 'text',
									triggerAction : 'all',
									mode : 'local'
							})
					]
				}
			]
		},
		{
			layout : 'column',
			border : false,
			items : [ {
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [{
									xtype : 'radiogroup',
									fieldLabel : '启用'.loc(),
									width : 80,
									items : [{
												boxLabel : '是'.loc(),
												name : 'status',
												inputValue : true,
												checked : true
											}, {
												boxLabel : '否'.loc(),
												name : 'status',
												inputValue : false
											}]
								}]
					}]
		},
		new Ext.form.TextArea({
			fieldLabel: '实例描述'.loc(),
			name: 'note',
			width: 450,
			height:60,
			maxLength : 255,
			maxLengthText : "实例描述不能超过{0}个字符!".loc()
		})
	],
	tbar:ButtonArray});
	var me = this;
	this.instanceForm.form.findField('condition_type').on("select",function(combo,rec,index){
		me.toggleFormItems(rec.get("id"));
	});   
	this.MainTabPanel=this.instanceForm;
};

dev.quality.InstancePanel.prototype= {
	formCreate : function(params){		
		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				params:params,
				url:'/dev/quality/getDbType.jcp?'
		});				
		conn.on('requestcomplete', function(conn, oResponse ){	
			var dbTypeJSON = Ext.decode(oResponse.responseText);
			this.params = params;
			this.toggleFormItems("0");
			if(this.MainTabPanel.rendered){
				this.toggleToolBar('create');
				this.instanceForm.form.reset();
				var  tempToolBar=this.instanceForm.getTopToolbar();
				if(dbTypeJSON.isStatic==false){
					this.instanceForm.form.findField('db_link').show();
					tempToolBar.items.each(function(item){
					if(item.btnId=='dbLinkManage')
						item.show();
					}, tempToolBar.items);
				}else{
					this.instanceForm.form.findField('db_link').hide();
					tempToolBar.items.each(function(item){    
						if(item.btnId=='dbLinkManage')
							item.hide();
					}, tempToolBar.items);
				}  
				this.loadComb(this.params);
				this.frames.get("qualityInstance").mainPanel.setStatusValue(["质控实例管理".loc(),params.parent_id]);
			}
		},this);
    },
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	loadComb : function(params){
		this.colStore.baseParams=params;
		this.colStore.load();
		this.tabStore.baseParams=params;
		this.tabStore.load();
		this.linkStore.baseParams=params;
		this.linkStore.load();
	},
	toggleToolBar : function(state){//alert(state);
		if(state=='create'){
			this.instanceForm.form.findField('db_link').show();
		}else{
			this.instanceForm.form.findField('db_link').hide();
		}
		var  tempToolBar=this.instanceForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	toggleFormItems : function(conditionType){
		if(conditionType=="0"){
			this.instanceForm.form.findField('condition_column').hide();
			this.instanceForm.form.findField('condition_table').hide();
			this.instanceForm.form.findField('condition_query').hide();
		}
		if(conditionType=="1"){
			this.instanceForm.form.findField('condition_column').show();
			this.instanceForm.form.findField('condition_table').show();
			this.instanceForm.form.findField('condition_query').hide();
		}
		if(conditionType=="2"){
			this.instanceForm.form.findField('condition_column').show();
			this.instanceForm.form.findField('condition_table').hide();
			this.instanceForm.form.findField('condition_query').show();
		}
	},
	loadData:function(params){	
		this.params = params;
		var main=this.frames.get("qualityInstance").mainPanel;
		this.instanceForm.form.load({
			method:'GET',
			params:params,
			scope:this,
			success:function(fm,action){
				var data=action.result.data;
				this.params.col_id = data.condition_column;
				this.loadComb(this.params);
				setTimeout(function(){
					fm.findField('condition_type').setValue(data.condition_type);
					fm.findField('condition_column').setValue(data.condition_column);
					fm.findField('condition_table').setValue(data.condition_table);
					fm.findField('condition_query').setValue(data.condition_query);	
					var  tempToolBar=this.instanceForm.getTopToolbar();
					if(data.condition_type=='1'){
						tempToolBar.items.each(function(item){   
							if(item.btnId=='secondCondionSet')
								item.show();
						}, tempToolBar.items);
					}else{
						tempToolBar.items.each(function(item){   
							if(item.btnId=='secondCondionSet')
								item.hide();
						}, tempToolBar.items);
					}
				}.createDelegate(this),100);
				
				this.toggleFormItems(data.condition_type);
				this.toggleToolBar('edit'); 
				
				main.setStatusValue(['质控实例管理'.loc(),params.parent_id,data.entry_name,data.entry_date]);
			}
		});   
    },
	onButtonClick : function(item){
		var frm=this.instanceForm.form;
		if(item.btnId=='save'){
			var saveParams=this.params;
			saveParams['type']='save';
			saveParams['condition_type'] = frm.findField('condition_type').getValue();
			saveParams['condition_column'] = frm.findField('condition_column').getValue();
			saveParams['condition_table'] = frm.findField('condition_table').getValue();
			saveParams['condition_query'] = frm.findField('condition_query').getValue();
			saveParams['db_link'] = frm.findField('db_link').getValue();
			if (frm.isValid()){
				  frm.submit({ 
					url:'/dev/quality/instancemag.jcp',
					params:saveParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						Ext.msg("info", '保存成功!'.loc());
						qualityInstance.navPanel.getTree().loadSubNode(action.result.instanceId,qualityInstance.navPanel.clickEvent);
					},								
					failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
			}else{
				Ext.msg("error",'数据不能提交，请修改表单中标识的错误!'.loc());
			}
		}else if(item.btnId=='clear'){
			this.instanceForm.form.reset();
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams=this.params;
						delParams['type']='delete';
						 frm.submit({ 
							url:'/dev/quality/instancemag.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								Ext.msg("info", '删除成功!'.loc());
								qualityInstance.navPanel.getTree().loadParentNode(qualityInstance.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								    Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>');
							}
						  });
				  } 
               }.createDelegate(this));
		}else if(item.btnId=='updatesave'){
		    if (frm.isValid()) {
				var updateParams=this.params;
				updateParams['type']='updatesave';
				updateParams['condition_type'] = frm.findField('condition_type').getValue();
				updateParams['condition_column'] = frm.findField('condition_column').getValue();
				updateParams['condition_table'] = frm.findField('condition_table').getValue();
				updateParams['condition_query'] = frm.findField('condition_query').getValue();
				frm.submit({ 
					url:'/dev/quality/instancemag.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						Ext.msg("info", '保存成功!'.loc());
						qualityInstance.navPanel.getTree().loadSelfNode(action.result.instanceId,qualityInstance.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交，请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='authSet'){
			var conn=new Ext.data.Connection();
			conn.request({    
					method: 'GET',    
					url:'/bin/user/getOrg.jcp?'
			});				
			conn.on('requestcomplete', function(conn, oResponse ){	
				var orgJSON = Ext.decode(oResponse.responseText);
				var name=orgJSON.shortName;
				if(name==""){
					name=orgJSON.name;
				}
				this.params.retFn = this.retFn;
				this.params.rootId=orgJSON.id;
				this.params.rootName=name;
				using("dev.quality.AuthFramePanel");
				using("dev.quality.InstanceAuthPanel");
				this.params.retFn = this.retFn;
				qualityInstance.authFramePanel = new dev.quality.AuthFramePanel(this.frames,this.params);
				qualityInstance.mainPanel.add(qualityInstance.authFramePanel.MainTabPanel);
				qualityInstance.mainPanel.setActiveTab(qualityInstance.authFramePanel.MainTabPanel);
				qualityInstance.authFramePanel.init(this.params.instanceId,this.params.parent_id);
			},this);
		} else if(item.btnId=='dbLinkManage'){
			using("dev.quality.DbLinkManageViewPanel");
			this.params.retFn = this.retFn;
			qualityInstance.dbLinkManageViewPanel = new dev.quality.DbLinkManageViewPanel(this.frames,this.params);
			qualityInstance.mainPanel.add(qualityInstance.dbLinkManageViewPanel.MainTabPanel);
			qualityInstance.dbLinkManageViewPanel.loadView();
			qualityInstance.mainPanel.setActiveTab("dbLinkManageViewPanel");
		}else if(item.btnId=='condionSet'){
			loadcss("lib.RowEditorTree.RowEditorTree");
			using("lib.RowEditorTree.RowEditorTree");
			using("dev.ctrl.ListConditionTree");
			using("dev.ctrl.ListCondition");
			var mp = qualityInstance.mainPanel;
			var params = this.params;
			params.parent_id = this.params.instanceId;
			params.returnFunction = this.retFn;
			var p = new dev.ctrl.ListCondition(params, "quality",mp);
			mp.add(p.MainTabPanel);
			mp.setActiveTab(p.MainTabPanel);
			p.init(this.params);
		}else if(item.btnId=='secondCondionSet'){
			loadcss("lib.RowEditorTree.RowEditorTree");
			using("lib.RowEditorTree.RowEditorTree");
			using("dev.ctrl.ListConditionTree");
			using("dev.ctrl.ListCondition");
			var mp = qualityInstance.mainPanel;
			var params = this.params;
			var secondTab= frm.findField('condition_table').getValue();
			params.parent_id = this.params.instanceId+":"+secondTab;
			params.returnFunction = this.retFn;
			var p = new dev.ctrl.ListCondition(params, "quality",mp);
			mp.add(p.MainTabPanel);
			mp.setActiveTab(p.MainTabPanel);
			p.init(this.params);
		}
    }
};