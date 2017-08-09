
Ext.namespace("dev.logic");

dev.logic.searchIndex= function(params){
	this.params = params;
	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				handler :function(btn){
					var retParam=this.params;
					retParam.importitem=this.selectForm.form.findField('importitem').getValue();
					Ext.Ajax.request({
							   url: '/dev/logic/searchIndex.jcp',
							   method:'POST',
							   params: retParam,
							   scope:this,
							   success:function(){
								 Ext.msg("info",'保存成功'.loc());
							   }    
					});
				}
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/xp/undo.gif',                
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.params.returnFunction
	}));
	
	this.selectForm = new Ext.form.FormPanel({
		labelAlign: 'right',
		url:'/dev/logic/searchIndex.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		this.importColumn=new lib.multiselect.ItemSelector({
				name:"importitem",
				dataFields:["value", "text"],
				fromData:[],
				fromStore:new Ext.data.JsonStore({
					url: '/dev/logic/searchIndexTab.jcp',
					root: 'items',
					autoLoad:true,
					fields:["value","text"],
					baseParams:{object_id:this.params.parent_id,type:this.params.type}
				}),
				toData:[],
				width:800,
				msWidth:300,
				msHeight:400,
				drawTopIcon:true,
				drawBotIcon:true,
				valueField:"value",
				displayField:"text",
				imagePath:"/lib/multiselect",
				toLegend:'已选引擎'.loc(),
				fromLegend:'可选引擎'.loc()
			})
	],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.selectForm;
	
	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
		url: '/dev/logic/searchIndex.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["object_id","importitem"]),
		remoteSort: false
	});
};
dev.logic.searchIndex.prototype={
	loadData : function(params,mainPanel){	
		this.ds.baseParams = params;
		this.ds.on('load', this.renderForm, this);
		this.ds.load({params:{start:0, limit:1}});
		mainPanel.setStatusValue(['数据搜索选择'.loc()]);
    },
	renderForm: function(){
		(function(fm,exp) {
			fm.findField('importitem').setValue(exp);
		}).defer(500,this, [this.selectForm.form,this.ds.getAt(0).data.importitem]);
	}     
};