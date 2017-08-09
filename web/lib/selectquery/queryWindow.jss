
Ext.namespace("lib.selectquery");

lib.selectquery.queryWindow = function(parent_id,start,end,contentTxt){

	this.win;
	this.start=start;
	this.end=end;
	this.parent_id=parent_id;
	this.contentTxt=contentTxt;
	this.replaceValue="";
	this.normalClose=false;
	var urlStr="/lib/FCKeditor/editor/plugins/Query/getQueryPlugin.jcp";
	this.tableSelect = new Ext.form.ComboBox({
							fieldLabel: '查询选择'.loc(),
							hiddenName: 'queryTable',
							width: 200,
							store :new Ext.data.JsonStore({
								url:urlStr,
								root: 'items',
								autoLoad :true,
								fields:["value","text"],
								baseParams:{type:'query',query_id:this.parent_id}
							}),
							valueField : 'value',
							displayField : 'text',
							triggerAction : 'all',
							allowBlank:false,
							blankText:'请选择查询!'.loc(),
							mode : 'local'
						});
	this.itemSelect = new Ext.Panel({
				border:false,
				layout:'form',
				items: [
					{
						xtype:'combo',
						fieldLabel: '数据项选择'.loc(),
						hiddenName: 'queryColumn',
						width: 200,
						store :new Ext.data.JsonStore({
							url:urlStr,
							root: 'items',
							autoLoad :true,
							fields:["value","text"],
							baseParams:{type:'queryCol'}
						}),
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						allowBlank:false,
						blankText:'请选择数据项!'.loc(),
						mode : 'local'
					}
				]
			});
	this.QueryForm = new Ext.form.FormPanel({
			labelAlign: 'right',
			url:urlStr,
			method:'POST',
			border:false,
			height : 200,
			autoScroll :true,
			bodyStyle:'padding:10px 0px 0px 0px;background:#FFFFFF;',
			items: [
					{
					columnWidth:1.0,
					layout: 'form',
					clear: true,
					border:false,
					items: [	
							this.tableSelect,this.itemSelect
					 ]
					}
					]
	});
	this.win = new Ext.Window({
		    title:'插入查询数据项'.loc(),
			layout:'fit',
			width:350,
			height:150,
			closeAction:'hide',
			plain: true,
			modal:true,
			border : false,
			items : [this.QueryForm],
			buttons: [{
				text:'确定'.loc(),
				scope:this,
				handler: this.windowConfirm
			},{
				text: '取消'.loc(),
				scope:this,
				handler: this.windowCancel
			}]
	});
	this.tableSelect.on('select',function(){
		if(this.tableSelect.oldValue==this.tableSelect.getValue()){
			return;
		}
		this.tableSelect.oldValue=this.tableSelect.getValue();
		var types=this.tableSelect.getValue();
		var itemDS = this.QueryForm.form.findField('queryColumn');
		itemDS.store.load({params:{query_id:types}});
	},this);
};

Ext.extend(lib.selectquery.queryWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var frm= this.QueryForm.form;
		if(frm.isValid()){
			var tabId=this.tableSelect.getValue();
			var colName = frm.findField('queryColumn').getRawValue();
			var name=tabId+"."+colName;
			if(this.start!=null&&this.end!=null){
				var initalContent=this.contentTxt.getValue();
				var pre = initalContent.substr(0, this.start);
				var post = initalContent.substr(this.end);
				this.contentTxt.setValue(pre +'${'+'Query_'+name+'}'+ post);  
			}else{
				this.contentTxt.codeEditor.replaceSelection('${'+'Query_'+name+'}');
			}
		}else{
			Ext.msg("error",'数据不能提交!请修改表单中标识的错误!'.loc());
		}	
		this.normalClose=true;
		this.win.close();
    }
});   