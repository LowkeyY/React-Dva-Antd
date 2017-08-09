Ext.namespace("dev.scraper");

dev.scraper.SaveWindow = function(params,xmlDoc,Scraper){

	this.win;
	this.params=params;
	this.xmlDoc=xmlDoc;

	this.ds =new Ext.data.JsonStore({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/scraper/create.jcp?type=getTable&objectId='+this.params['objectId']+'&rand='+Math.random(),
			method : 'GET'
		}),
		root:'TabArray',
		fields:["id","label"],
		autoLoad:true
	});
	this.baseForm = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
        border:false,
        bodyStyle:'padding:10px 10px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
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
							fieldLabel: '萃取引擎名称'.loc(),
							name: 'scraper_name',
							width: 170,
							maxLength : 64,
							allowBlank:false,
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							maxLengthText : '萃取引擎名称不能超过{0}个字符!'.loc(),
							blankText:'萃取引擎名称必须提供.'.loc()
						})
				]},
				{
				   columnWidth:1.0,
				   layout: 'form',
				   border:false,
				   items: [		
						new Ext.form.ComboBox({
							fieldLabel: '抽取对象表'.loc(),
							hiddenName: 'tabId',
							disable:false,
							width: 170,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							store:this.ds,
							mode:'remote',
							allowBlank:false,
							blankText:'至少选择一个抽取表作为数据存储.'.loc()
						})
					 ]}
			]
		}
	]
	});



//-------------------------页面设定----------------------------------------------------------------

	this.win =  new Ext.Window({
		title:'萃取引擎保存'.loc(),
		layout:'fit',
		width:350,
		height:180,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.baseForm],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: function(){	
			 var frm=this.baseForm.form;
			  var saveParams=this.params;
			  saveParams['type']='save';
			  saveParams['xmlCodeValue']=this.xmlDoc;
			  if (frm.isValid()) {
				  frm.submit({ 
						url:'/dev/scraper/create.jcp',
						params:saveParams,
						method: 'POST',  
						scope:this,
						success:function(form, action){ 
							Scraper.navPanel.getTree().loadSubNode(action.result.id,Scraper.navPanel.clickEvent);
							this.win.close();
						},								
						failure: function(form, action){
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
						}
				  });  
				}else{
					Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}
		},{
			text: '取消'.loc(),
			scope:this,
			handler: function(){
				this.win.close();
			}
		}]
	});
	this.win.show(); 
};