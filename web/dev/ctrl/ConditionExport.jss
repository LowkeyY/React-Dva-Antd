Ext.namespace("dev.ctrl");
dev.ctrl.ConditionExport= function(params){
	this.params = params;
	var ButtonArray=[];
   	ButtonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/xp/undo.gif',                
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.params.returnFunction
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				handler :function(btn){
					var retParam=this.params;
					retParam.exportitem=this.conditionExportForm.form.findField('exportitem').getValue();
					Ext.Ajax.request({
							   url: '/dev/ctrl/CondtionExport.jcp',
							   method:'POST',
							   params: retParam,
							   scope:this,
							   success:function(){
								 Ext.msg("info",'保存成功'.loc());
							   }    
					});
				}
	}));

	this.conditionExportForm = new Ext.form.FormPanel({
		id:'CondtionExportPanel',
        labelWidth: 100, 
		labelAlign: 'right',
		url:'/dev/ctrl/CondtionExport.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		this.importColumn=new lib.multiselect.ItemSelector({
				name:"exportitem",
				fieldLabel:'数据项'.loc(),
				dataFields:["value", "text"],
				fromData:[],
				fromStore:new Ext.data.JsonStore({
					url: '/dev/ctrl/ConditionExportTab.jcp',
					root: 'items',
					autoLoad:true,
					fields:["value","text"],
					baseParams:{object_id:this.params.parent_id,tabId:this.params.tabId}
				}),
				toData:[],
				msWidth:230,
				msHeight:400,
				drawTopIcon:false,
				drawBotIcon:false,
				valueField:"value",
				displayField:"text",
				imagePath:"/lib/multiselect",
				toLegend:'已选项'.loc(),
				fromLegend:'可选项'.loc()
			})
	],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.conditionExportForm;
	
	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
		url: '/dev/ctrl/CondtionExport.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["object_id","exportitem"]),
		remoteSort: false
	});
};

dev.ctrl.ConditionExport.prototype={
	loadData : function(params,mainPanel){	
		this.ds.baseParams = params;
		this.ds.on('load', this.renderForm, this);
		this.ds.load({params:{start:0, limit:1}});
		mainPanel.setStatusValue(['导出参数'.loc()]);
    },
	renderForm: function(){
		(function(fm,exp) {
			fm.findField('exportitem').setValue(exp);
		}).defer(500,this, [this.conditionExportForm.form,this.ds.getAt(0).data.exportitem]);
	}     
};