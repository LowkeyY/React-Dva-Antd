
Ext.namespace("etc.liveUpdate");
etc.liveUpdate.RegisterPanel = function(frames,from){
	this.frames=frames;
	var ButtonArray=[];
	this.state="create";
	this.params={};
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'updatesave',
				text: '注册'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

	this.systemForm = new Ext.FormPanel({
        labelWidth: 100, 
		id: 'RegisterBase',
		cached:true,
		labelAlign: 'right',
        url:'/etc/liveUpdate/register.jcp',
        method:'GET',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextArea({
							fieldLabel: '系统注册码'.loc(),
							name: 'register_code',							
							width: 550,
							height:60,
							maxLength : 2000,
							maxLengthText : '系统说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextArea({
							fieldLabel: '系统激活码'.loc(),
							name: 'active_key',							
							width: 550,
							height:60,
							maxLength : 2000,
							maxLengthText : '系统说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	 ],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.systemForm;
};


etc.liveUpdate.RegisterPanel.prototype={
	formCreate : function(){		
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.frames.get("System").mainPanel.setStatusValue(['系统管理'.loc(),'','无'.loc(),'无'.loc()]);
		}
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
		var  tempToolBar=this.systemForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){		
		this.systemForm.form.findField('system_name').setValue(this.formDS.getAt(0).data.system_name);
		this.systemForm.form.findField('system_pname').setValue(this.formDS.getAt(0).data.system_pname);
		this.systemForm.form.findField('system_type').setValue(this.formDS.getAt(0).data.system_type);	
		this.systemForm.form.findField('current_stat').setValue(this.formDS.getAt(0).data.current_stat);	
		this.systemForm.form.findField('system_desc').setValue(this.formDS.getAt(0).data.system_desc);
		this.frames.get('System').mainPanel.setStatusValue(['系统管理'.loc(),this.formDS.getAt(0).data.system_id,this.formDS.getAt(0).data.lastModifyName,this.formDS.getAt(0).data.lastModifyTime]);
	},
	onButtonClick : function(item){
		var System = this.frames.get("System");
		var frm=this.systemForm.form;
		if(item.btnId=='updatesave'){
		    if (frm.isValid()) {
			  var updateParams=this.formDS.baseParams;
			  updateParams['system_type']=this.systemForm.form.findField('system_type').getValue();
			  updateParams['current_stat']=this.systemForm.form.findField('current_stat').getValue();
			  updateParams['type']='updatesave';
			 frm.submit({ 
					url:'/dev/system/systemcreate.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						System.navPanel.getTree().loadSelfNode(action.result.id,System.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因'.loc()+':<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}
    }
};

