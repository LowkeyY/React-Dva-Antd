Ext.namespace("dev.integrate");

dev.integrate.IntegratePanel = function(objectId,parentPanel){
	this.params={};
	this.parentPanel=parentPanel;
	this.integrateType=new Ext.form.ComboBox({
				fieldLabel: '集成类别'.loc(),
				store:new Ext.data.SimpleStore({
					fields:['id', 'label'],
					data:[
						['3','HTML5客户端'.loc()],
						['2',"Applet"],
						['1',"GO-Global"]
					]
				}),
				name: 'integratType',
				valueField:'id',
				displayField:'label',
				triggerAction : 'all',
				mode:'local'
	});

	this.keyboardType=new Ext.form.ComboBox({
				fieldLabel: '键盘类别'.loc(),
				store:new Ext.data.SimpleStore({
					fields:['id', 'label'],
					data:[
						['1033','英文'.loc()+'('+'美国'.loc()+')'],
						['2057','英文'.loc()+'('+'英国'.loc()+')'],
						['3084','法文'.loc()+'('+'加拿大'.loc()+')'],
						['1036','法文'.loc()+'('+'法国'.loc()+')'],
						['1031','德文'.loc()+'('+'德国'.loc()+')']
					]
				}),
				name: 'keyboardType',
				value:'1033',
				valueField:'id',
				displayField:'label',
				triggerAction : 'all',
				mode:'local'
	});

	this.color_Depth=new Ext.form.ComboBox({
				fieldLabel: '色深'.loc(),
				store:new Ext.data.SimpleStore({
					fields:['id', 'label'],
					data:[
						['8',"256"],
						['15','高彩色'.loc()+'(15 bit)'],
						['16','高彩色'.loc()+'(16 bit)'],
						['24','真彩色'.loc()+'(24 bit)'],
						['32','最高质量'.loc()+'(32 bit)']
					]
				}),
				name: 'color_Depth',
				value:'16',
				valueField:'id',
				displayField:'label',
				triggerAction : 'all',
				mode:'local'
	});

	this.play_Sound=new Ext.form.ComboBox({
				fieldLabel: '声音回放'.loc(),
				store:new Ext.data.SimpleStore({
					fields:['id', 'label'],
					data:[
						['0','本地播放'.loc()],
						['1','不播放'.loc()]
					]
				}),
				name: 'play_Sound',
				valueField:'id',
				displayField:'label',
				triggerAction : 'all',
				mode:'local'
	});

	var ButtonArray=[
		{
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				state:'create'
		},{
				btnId:'clear',
				text: '清空'.loc(),
				icon: '/themes/icon/xp/clear.gif',
				state:'create'
		},{
				btnId:'updatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				state:'edit'
		},{
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/xp/delete.gif',
				state:'edit'
		}
	];
	Ext.each(ButtonArray,function(item){
		Ext.apply(item,{
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : item.state=='edit',
				handler :this.onButtonClick
		});	
	},this);
	this.MainTabPanel= new Ext.form.FormPanel({
		id: 'integratePanel',
 		cached:true,
        labelWidth: 160, 
		labelAlign: 'right',   
        border:false,
		url:'/dev/integrate/create.jcp',
		tbar:ButtonArray,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
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
						{
							xtype:'textfield',
							fieldLabel: '逻辑名称'.loc(),
							name: 'logicName',
							width: 160,
							maxLength : 64,
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							allowBlank:false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText:'逻辑名称必须提供.'.loc()
						},this.integrateType,this.keyboardType,this.color_Depth,this.play_Sound
					 ]
				},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,
				   items: [				
						{
							xtype:'textfield',
							fieldLabel: '物理名称'.loc(),
							name: 'phyName',
							style : 'ime-mode:disabled;',
							width: 160,
							maxLength : 64,
							allowBlank:false,
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText:'物理名称必须提供.'.loc()
						},{
							xtype:'radiogroup',
							fieldLabel: '操作系统'.loc(),
							width:220,
							items: [
								{boxLabel: 'Windows', name: 'os_type', inputValue:'0',checked: true},
								{boxLabel: 'Linux', name: 'os_type', inputValue:'1'},
								{boxLabel: 'Unix', name: 'os_type', inputValue:'2'}
							]
						},{
							xtype:'selectmenu',
							fieldLabel: '菜单位置'.loc(),
							dataUrl : '/dev/integrate/SelectMenu.jcp',
							name: 'laucherMenu',
							height:100,
							width:260,
							allowBlank:false,
							blankText:'菜单位置必须提供.'.loc(),
							system_id:objectId
						},{
							xtype:'radiogroup',
							fieldLabel: '本地打印机'.loc(),
							width:220,
							items: [
								{boxLabel: '是'.loc(), name: 'printer', inputValue:true,checked: true},
								{boxLabel: '否'.loc(), name: 'printer', inputValue:false}
							]					
						},{
							xtype:'radiogroup',
							fieldLabel: '剪贴板'.loc(),
							width:220,
							items: [
								{boxLabel: '是'.loc(), name: 'clipboard', inputValue:true,checked: true},
								{boxLabel: '否'.loc(), name: 'clipboard', inputValue:false}
							]					
						}
					]
				}
			]
		},	
        {
			xtype:'textarea',
			fieldLabel: '说明'.loc(),
			name: 'note',
			width: 500,
			height:60,
			maxLength : 1000,
			maxLengthText : '系统说明不能超过{0}个字符!'.loc()
		}
	 ]
	});
};

dev.integrate.IntegratePanel.prototype={
	init : function(params,main){	
		this.params = params;
		this.integrateType.setValue('3');
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			var fm=this.MainTabPanel.form;
			fm.reset();
			this.integrateType.enable();
			fm.findField("laucherMenu").enable();
			main.setStatusValue(['应用集成管理'.loc(),params.parent_id,'无'.loc(),'无'.loc()]);
		}
	},
	loadData : function(params,main){
		this.MainTabPanel.form.load({
			method:'GET',
			params:params,
			scope:this,
			success:function(fm,action){
				var data=action.result.data;
				this.toggleToolBar('edit');
				main.setStatusValue(['应用集成管理'.loc(),params.parent_id,data.lastModifyName,data.lastModifyTime]);
			}
		});  
		this.params = params;     
    },
	toggleToolBar : function(state){
		this.MainTabPanel.getTopToolbar().items.each(function(item){    
			item.setVisible(item.state==state);
		});
    },
	onButtonClick : function(item){
		var frm=this.MainTabPanel.form;
		if(item.btnId=='clear'){
			this.MainTabPanel.form.reset();
		}else if(item.btnId=='save'){
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立模块定义'.loc());
			}else{
				var saveParams=this.params;
				saveParams['integratType']=this.MainTabPanel.form.findField('integratType').getValue();	
				saveParams['keyboardType']=this.keyboardType.getValue();
				saveParams['play_Sound']=this.play_Sound.getValue();
				saveParams['color_Depth']=this.color_Depth.getValue();
				saveParams['type']='save';
				if (frm.isValid()) {
					  frm.submit({ 
						url:'/dev/integrate/create.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(form, action){ 
							Ext.msg("info",'保存成功'.loc());    
							this.parentPanel.navPanel.getTree().loadSubNode(action.result.id,this.parentPanel.navPanel.clickEvent);
						},								
						failure: function(form, action) {
							Ext.msg("error",'错误'.loc(),'数据提交失败!,原因:'.loc()+'<br>');
						}
					  });
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}
		}else if(item.btnId=='updatesave'){
			if (frm.isValid()) {
					var saveParams=this.params;
					saveParams['integratType']=this.MainTabPanel.form.findField('integratType').getValue();	
					saveParams['keyboardType']=this.keyboardType.getValue();
					saveParams['play_Sound']=this.play_Sound.getValue();
					saveParams['color_Depth']=this.color_Depth.getValue();
					saveParams['type']='updatesave';
				  frm.submit({ 
					params:saveParams,
					scope:this,
					success:function(form, action){ 
						Ext.msg("info",'保存成功'.loc());    
						this.parentPanel.navPanel.getTree().loadSelfNode(action.result.id,this.parentPanel.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
			}else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
			}
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '警告:删除应用集成定义将不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['parent_id']=this.params['parent_id'];
						frm.submit({ 
							url:'/dev/integrate/create.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								this.parentPanel.navPanel.getTree().loadParentNode(this.parentPanel.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
             }.createDelegate(this));
		}
    }
}
