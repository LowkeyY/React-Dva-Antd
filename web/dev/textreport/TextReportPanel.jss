Ext.namespace("dev.textreport");

dev.textreport.TextReportPanel = function(params){

	var ButtonArray=[];
	this.textChangeFlag=false;

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
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
				btnId:'preview',
				text: '预览'.loc(),
				icon: '/themes/icon/xp/preview.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	var desktop=WorkBench.Desk.getDesktop();
	var winHeight=desktop.getViewHeight();

	this.reportForm = new Ext.FormPanel({
			id: 'Container',
			bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
			border:false,
			scope:this,
			items: [{ 
			   layout: 'fit',
			   border:false,
			   scope:this,
			   items: [
						new lib.FCKeditor.ExtFckeditor({
							name:'content',
							height:winHeight-87,
							scope:this,
							hideLabel : true,
							allowBlank:true,
							parent_id:params.parent_id,
							BasePath:'/lib/FCKeditor/editor/',
							PluginsPath: '/lib/FCKeditor/editor/plugins/',
							blankText:'必须输入报告模板文档'.loc(),
							ToolbarSet:"textReport",
							SkinPath:'/lib/FCKeditor/editor/skins/office2003/'
						})

				]}
		]
	});  

	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/textreport/create.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["report_name","content","object_id","lastModifyName","lastModifyTime"]),
		remoteSort: false
	});

	this.MainTabPanel=new Ext.Panel({
			id: 'TextReportMain',
			border:false,
			cached:true,
			layout:'fit',
			items:[this.reportForm],
			tbar:ButtonArray
	});
};   

dev.textreport.TextReportPanel.prototype={
	init : function(){	
		if(this.MainTabPanel.rendered){ 
			this.frames.get("TextReport").mainPanel.setStatusValue(['报告设计'.loc(),"",'无'.loc(),'无'.loc()]);
		}
	},
	newReport: function(params){	
		this.params=params;
		this.reportForm.form.findField('content').setValue('');
		this.toggleToolBar('create');
    },
	editReport : function(){	
		this.toggleToolBar('edit');
    },
	loadData : function(params){	
		this.params=params;
		this.toggleToolBar('edit');
		this.ds.baseParams = params;
		this.ds.on('load', this.renderForm, this);
		this.ds.load({params:{start:0, limit:1}});
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.MainTabPanel.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){		
		var dss = this.ds.getAt(0).data;
		this.reportForm.form.findField('content').setValue(dss.content);
		this.frames.get('TextReport').mainPanel.setStatusValue(['报告设计'.loc(),dss.object_id,dss.lastModifyName,dss.lastModifyTime]);	
	},
	showReport : function(objectId,params){	
		using("dev.textreport.ParamsWindow");
		using("dev.textreport.ReportPreview");
		var reportWindow = new dev.textreport.ReportPreview(objectId,params);
		reportWindow.show();
    },
	onButtonClick : function(item){
		if(item.btnId=='save'){
			if(this.params['parent_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立报告模板'.loc());
			}else{
				var TextReport=this.frames.get('TextReport');
				var frm=this.reportForm.form;
				Ext.Msg.prompt('提示', '输入报告名称:'.loc(), function(btn, text){
						if (btn == 'ok'){
							var report_name =text;
							if(!report_name){
								Ext.msg("error",'报告名称不允许为空!'.loc());
								return;	
							}else if(/[\<\>\'\"\&]/.test(report_name)){
								Ext.msg("error",'报告名称不应有'.loc()+'&,<,>,\",'+'字符'.loc());
								return;
							}	
							  var saveParams=this.params;
							  saveParams['type']='save';
							  saveParams['report_name']=report_name;
							  saveParams['content']=this.reportForm.form.findField('content').getValue();
							  frm.submit({ 
								url:'/dev/textreport/create.jcp',
								params:saveParams,
								method: 'POST',  
								scope:this,
								success:function(form, action){ 
									TextReport.navPanel.getTree().loadSubNode(action.result.id,TextReport.navPanel.clickEvent);
								},								
								failure: function(form, action){
									Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
								}
							  });  
					}else{
						return;
					}
			 },this,false);
			}
		}else if(item.btnId=='updatesave'){
			  var TextReport=this.frames.get('TextReport');
			  var frm=this.reportForm.form;
			  var saveParams={};
			  Ext.apply(saveParams,this.ds.baseParams);
			  saveParams['content']=this.reportForm.form.findField('content').getValue();
			  saveParams['type']='updatesave';
			  frm.submit({ 
				url:'/dev/textreport/create.jcp',
				params:saveParams,
				method: 'post',  
				scope:this,
				success:function(form, action){ 
				    Ext.msg("info",'完成报告更新!'.loc());
				},								
				failure: function(form,action) {
					Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
				}
			  });
		}else if(item.btnId=='delete'){
			 var TextReport=this.frames.get('TextReport');
			 var frm=this.reportForm.form;
			 Ext.msg('confirm', '警告:删除报告模板将不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams={};
						delParams['type']='delete';
						delParams['parent_id']=this.ds.baseParams['parent_id'];
						frm.submit({ 
							url:'/dev/textreport/create.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								 TextReport.navPanel.getTree().loadParentNode(TextReport.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
             }.createDelegate(this));
		}else if(item.btnId=='preview'){
			if(this.textChangeFlag){
				Ext.msg("error",'报告模版已经修改,请保存后预览!'.loc());
				return false;
			}else{
				Ext.Ajax.request({ 
					url:'/dev/textreport/condition.jcp?report_id='+this.params['parent_id']+'&'+Math.random,
					method: 'POST',  
					scope:this,
					success:function(response, options){ 
						var check = response.responseText;
						check=check.replace(/xtitleList/ig,'fieldLabel');
						var frameJSON = Ext.decode(check);
						if(frameJSON.success){
							if(frameJSON.searchEditor.editors){
								if(frameJSON.searchEditor.editors.length>0){
									using("dev.textreport.ParamsWindow");
									var paramsWin =new dev.textreport.ParamsWindow(this.params['parent_id'],frameJSON,this.frames);
									paramsWin.show();
								}else{
									this.showReport(this.params['parent_id'],{});
								}
							}else{
									this.showReport(this.params['parent_id'],{});
							}
						}else{   
							Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
						}
					}
				}); 			
			}
		}
    }
};

