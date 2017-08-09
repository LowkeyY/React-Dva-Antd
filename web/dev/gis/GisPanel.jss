Ext.namespace("dev.gis");

dev.gis.GisPanel = function(frames){

	this.frames = frames;   
	var Gis=this.frames.get('Gis');
	this.retFn=function(main){
		main.setActiveTab("GisPanel");
		main.setStatusValue(['地图管理'.loc()]);
	}.createCallback(Gis.mainPanel);

	var ButtonArray=[];

	this.params={};
	var MyGisPanel=this;

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
				btnId:'newPOI',
				text: '新建对象查询'.loc(),
				icon: '/themes/icon/all/tag_blue_add.gif',
				cls: 'x-btn-text-icon  bmenu',
				state:'edit',
				disabled:false,
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newPOIEdit',
				text: '新建编辑图层'.loc(),
				icon: '/themes/icon/all/map_edit.gif',
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

	this.groupPanel = new Ext.Panel({
		region: 'west',
		frame:false,
        border:true,
		collapsible: false,
		width:200,
		tbar:this.GisButtonArray
	});	

	var kindStore = new Ext.data.SimpleStore({
		fields : ['value', 'text'],
		data : [["0", '全球图'.loc()], ["1", '局部地图'.loc()]]
	});
	var kindCombo = new Ext.form.ComboBox({
		fieldLabel : '类别'.loc(),
		store : kindStore,
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		value:'0',
		mode : 'local',
		hiddenName : 'map_type'
	});
	kindCombo.on('select',function(){
		var val =kindCombo.getValue();
		var frm=this.GisPropPanel.form;
		frm.findField('centralX').setVisible(val == "0"); 
		frm.findField('scale').setVisible(val == "0"); 
		frm.findField('centralY').setVisible(val == "0"); 
		frm.findField('mapUrl').setVisible(val == "0"); 
		frm.findField('satTransUrl').setVisible(val == "0"); 
		frm.findField('satUrl').setVisible(val == "0"); 
		frm.findField('bound_type').setVisible(val != "0"); 
		
		frm.findField('centralX').allowBlank = (val != "0");
		frm.findField('scale').allowBlank = (val != "0");
		frm.findField('centralY').allowBlank = (val != "0");
		frm.findField('satTransUrl').allowBlank =(val != "0"); 
		frm.findField('satUrl').allowBlank =(val != "0");
		frm.findField('mapUrl').allowBlank =(val != "0"); 

		if(val == "0"){
			frm.findField('bound_type').setValue(""); 
		}else{
			frm.findField('bound_type').setValue("0"); 
		}
		var val1=frm.findField('bound_type').getValue();
		frm.findField('minX').setVisible(val != "0"&&val1=='1'); 
		frm.findField('minY').setVisible(val != "0"&&val1=='1'); 
		frm.findField('maxX').setVisible(val != "0"&&val1=='1'); 
		frm.findField('maxY').setVisible(val != "0"&&val1=='1'); 
	},this);
	var boundsStore = new Ext.data.SimpleStore({
		fields : ['value', 'text'],
		data : [["0", '底图边界'.loc()], ["1", '自定义边界'.loc()]]
	});
	var boundCombo = new Ext.form.ComboBox({
		fieldLabel : '边界范围'.loc(),
		store : boundsStore,
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		value:'0',
		mode : 'local',
		hidden:true,
		hiddenName : 'bound_type'
	});
	boundCombo.on('select',function(){
		var val =boundCombo.getValue();
		var frm=this.GisPropPanel.form;
		frm.findField('minX').setVisible(val != "0"); 
		frm.findField('minY').setVisible(val != "0"); 
		frm.findField('maxX').setVisible(val != "0"); 
		frm.findField('maxY').setVisible(val != "0"); 
		frm.findField('minX').allowBlank = (val == "0");
		frm.findField('minY').allowBlank = (val == "0");
		frm.findField('maxX').allowBlank = (val == "0");
		frm.findField('maxY').allowBlank =(val == "0"); 
	},this);
	this.GisPropPanel =new Ext.form.FormPanel({
		region: 'center',
		autoHeight: false,
		autoWidth: true,
		border:true,
		id:'GisPanel',
		collapsible: false,
		split: true,
		cached:true,
        labelWidth: 160, 
		labelAlign: 'right',
        url:'/dev/gis/create.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items: [
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
						fieldLabel: '标题'.loc(),
						name: 'mapTitle',
						width: 300,
						regex:/^[^\<\>\'\"\&]+$/,
						regexText:'标题中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
						maxLength : 100,
						allowBlank:false,
						maxLengthText : '标题不能超过{0}个字符!'.loc(),
						blankText:'标题不能为空!'.loc()
					})
				 ]
			},{	columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
						kindCombo
					 ]
				},{columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
						boundCombo
					 ]
				},
			{ 
			   columnWidth:0.50,
			   layout: 'form',
			   border:false,
			   items: [			
					new Ext.form.NumberField({
							fieldLabel: 'X坐标最小值'.loc(),
							name: 'minX',
							width: 150,
							hidden:true,
							allowBlank:true,
							decimalPrecision:8,
							blankText:'X坐标最小值必须是数字且不能为空.'.loc()
					})
				 ]
				},
			{ 
			   columnWidth:0.50,
			   layout: 'form',
			   border:false,
			   items: [			
					new Ext.form.NumberField({
							fieldLabel: 'Y坐标最小值'.loc(),
							name: 'minY',
							width: 150,
							hidden:true,
							allowBlank:true,
							decimalPrecision:8,
							blankText:'Y坐标最小值必须是数字且不能为空.'.loc()
					})
				 ]
				},
			{ 
			   columnWidth:0.50,
			   layout: 'form',
			   border:false,
			   items: [			
					new Ext.form.NumberField({
							fieldLabel: 'X坐标最大值'.loc(),
							name: 'maxX',
							width: 150,
							hidden:true,
							allowBlank:true,
							decimalPrecision:8,
							blankText:'X坐标最大值必须是数字且不能为空.'.loc()
					})
				 ]
				},
			{ 
			   columnWidth:0.50,
			   layout: 'form',
			   border:false,
			   items: [			
					new Ext.form.NumberField({
							fieldLabel: 'Y坐标最大值'.loc(),
							name: 'maxY',
							width: 150,
							hidden:true,
							allowBlank:true,
							decimalPrecision:8,
							blankText:'Y坐标最大值必须是数字且不能为空.'.loc()
					})
				 ]
				},{	
					columnWidth:0.5,
					layout: 'form',
					border:false,
					items: [				
							new Ext.form.NumberField({
									fieldLabel: '中点坐标X'.loc(),
									name: 'centralX',
									width: 150,
									decimalPrecision:8,
									allowBlank:false,
									blankText:'中点坐标X必须是数字且不能为空.'.loc()
							})
					 ]
				},
				{	columnWidth:0.50,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.NumberField({
							fieldLabel: '中点坐标Y'.loc(),
							name: 'centralY',
							width: 150,
							decimalPrecision:8,
							allowBlank:false,
							blankText:'中点坐标Y必须是数字且不能为空.'.loc()
						})
					 ]
				},{	columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
							new Ext.form.NumberField({
									fieldLabel: '图形比例'.loc(),
									name: 'scale',
									allowDecimals:false,
									width: 150,
									maxLength : 60,
									allowBlank:false,
									blankText:'图形比例必须是整数且不能为空.'.loc()
							})
					 ]
				},
				{	columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.TextArea({
							fieldLabel: '地图地址'.loc(),
							name: 'mapUrl',
							width: 450,
							maxLength : 500,
							allowBlank:false,
							maxLengthText : '地图地址不能超过{0}个字符!'.loc(),
							blankText:'地图地址不能为空.'.loc()
						})
					 ]
				},
				{	columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.TextArea({
							fieldLabel: '卫星图地址'.loc(),
							name: 'satUrl',
							width: 450,
							maxLength : 500,
							allowBlank:false,
							maxLengthText : '卫星图数据源不能超过{0}个字符!'.loc(),
							blankText:'卫星图数据源不能为空.'.loc()
						})
					 ]
				},
				{	columnWidth:1.0,
					layout: 'form',
					border:false,
					items: [				
						new Ext.form.TextArea({
							fieldLabel: '卫星图标注地址'.loc(),
							name: 'satTransUrl',
							width: 450,
							maxLength : 500,
							allowBlank:false,
							maxLengthText : '卫星图标注不能超过{0}个字符!'.loc(),
							blankText:'卫星图标注地址不能为空.'.loc()
						})
					 ]
				}
			]
		}
	],tbar:ButtonArray});
	this.MainTabPanel = this.GisPropPanel;
};

dev.gis.GisPanel.prototype={
	init : function(params){	
		this.params = params;
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.GisPropPanel.form.reset();
			this.frames.get("Gis").mainPanel.setStatusValue(['地图管理'.loc(),params.parent_id,"无","无"]);
		}
	},
	loadData : function(params){	
		this.params=params;
		this.GisPropPanel.load({    
			url:'/dev/gis/create.jcp?object_id='+params.object_id+"&rand="+Math.random(),
			method:'GET',
			scope:this,
			success:function(frm,action){
				var data = action.result.data;
				var val =data.map_type;
				var frm=this.GisPropPanel.form;
				frm.findField('centralX').setVisible(val == "0"); 
				frm.findField('scale').setVisible(val == "0"); 
				frm.findField('centralY').setVisible(val == "0"); 
				frm.findField('mapUrl').setVisible(val == "0"); 
				frm.findField('satTransUrl').setVisible(val == "0"); 
				frm.findField('satUrl').setVisible(val == "0"); 
				frm.findField('bound_type').setVisible(val != "0"); 
				
				frm.findField('centralX').allowBlank = (val != "0");
				frm.findField('scale').allowBlank = (val != "0");
				frm.findField('centralY').allowBlank = (val != "0");
				frm.findField('satTransUrl').allowBlank =(val != "0"); 
				frm.findField('satUrl').allowBlank =(val != "0");
				frm.findField('mapUrl').allowBlank =(val != "0"); 
	
				var val1=data.bound_type;
				frm.findField('minX').setVisible(val != "0"&&val1=='1'); 
				frm.findField('minY').setVisible(val != "0"&&val1=='1'); 
				frm.findField('maxX').setVisible(val != "0"&&val1=='1'); 
				frm.findField('maxY').setVisible(val != "0"&&val1=='1'); 
				//frm.findField('minX').allowBlank = (val1 == "0");
				//frm.findField('minY').allowBlank = (val1 == "0");
				//frm.findField('maxX').allowBlank = (val1 == "0");
				//frm.findField('maxY').allowBlank =(val1 == "0"); 
				this.toggleToolBar('edit');
				this.frames.get('Gis').mainPanel.setStatusValue(['地图管理'.loc(),params.object_id,data.lastModifyName,data.lastModifyTime]);
			}
		});
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.GisPropPanel.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();   
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	onButtonClick : function(item){
		var frm=this.GisPropPanel.form;
		var Gis = this.frames.get("Gis");
		if(item.btnId=='clear'){
			this.GisPropPanel.form.reset();
		}else if(item.btnId=='save'){
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立地图定义'.loc());
			}else{
				var saveParams=this.params;
				saveParams['type']='save';
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/gis/create.jcp',
						params:saveParams,
						method: 'post',  
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
			  var saveParams=this.params;
			  saveParams['type']='updatesave';
			  if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/gis/create.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Gis.navPanel.getTree().loadSelfNode(action.result.id,Gis.navPanel.clickEvent);
							Ext.msg("info",'地图定义更新成功'.loc());
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
						delParams['parent_id']=this.params['parent_id'];
						delParams['object_id']=this.params['object_id'];
						frm.submit({ 
							url:'/dev/gis/create.jcp',
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
		}else if(item.btnId=='newPOI'){	
			using("dev.gis.MapPOIPanel");
			var Gis = this.frames.get('Gis');
			this.params.retFn=this.retFn;
			Gis.mapPOIPanel =new dev.gis.MapPOIPanel(this.frames,this.params,"Query"); 
			Gis.mainPanel.add(Gis.mapPOIPanel.MainTabPanel);
			Gis.mainPanel.setActiveTab(Gis.mapPOIPanel.MainTabPanel);
			Gis.mapPOIPanel.init();
		}else if(item.btnId=='newPOIEdit'){
			using("dev.gis.MapPOIPanel");
			var Gis = this.frames.get('Gis');
			this.params.retFn=this.retFn;
			Gis.mapPOIPanel =new dev.gis.MapPOIPanel(this.frames,this.params,"Edit"); 
			Gis.mainPanel.add(Gis.mapPOIPanel.MainTabPanel);
			Gis.mainPanel.setActiveTab(Gis.mapPOIPanel.MainTabPanel);
			Gis.mapPOIPanel.init();  
		}
    }
};