usecss("lib.RowEditorGrid.RowEditor");
using("lib.RowEditorGrid.RowEditor");
using("lib.RowEditorGrid.RowEditorGrid");
dev.ctrl.ConditionGridPanel = function(params){
	this.params=params;
	var fm = Ext.form;
	this.ds=new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/ctrl/ConditionColumn.jcp?',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({root: 'columnArray'},["tab_id","tab_lname","tabitem_id","tabitem_lname","dataType","specialSet","hasForeignKey","condition_type","widget_id"]),
		remoteSort: false
	})

	var editor = new lib.RowEditorGrid.RowEditor({
			saveText : '保存'.loc(),
			cancelText : '取消'.loc(),
			commitChangesText : '请保存或取消所做的修改'.loc(),
			errorText : '提示'.loc()
	});

	var titleFields = new fm.TextField({
			name: 'title',								
			width: 200,
			maxLength : 200,
			maxLengthText : '标题不能超过{0}个字符!'.loc()
	});

	this.actionTypes ={
		"int" : [['=', '等于'.loc()], ['>', '大于'.loc()],['>=', '大于或等于'.loc()], ['<', '小于'.loc()],['<=', '小于或等于'.loc()], ['!=', '不等于'.loc()],
				[' IS NULL', '为空'.loc()], [' IS NOT NULL ', '不为空'.loc()]],
		"float" : [['=', '等于'.loc()], ['>', '大于'.loc()],['>=', '大于或等于'.loc()], ['<', '小于'.loc()],['<=', '小于或等于'.loc()], ['!=', '不等于'.loc()],
				[' IS NULL', '为空'.loc()], [' IS NOT NULL ', '不为空'.loc()]],
		"unknown" : [['=', '等于'.loc()], ['!=', '不等于'.loc()], [' IS NULL', '为空'.loc()],[' IS NOT NULL', '不为空'.loc()]],
		"varchar" : [['like', '包含'.loc()], ['not like', '不包含'.loc()], ['=', '等于'.loc()],['!=', '不等于'.loc()], [' IS NULL', '为空'.loc()],[' IS NOT NULL', '不为空'.loc()]],
		"date" : [['=', '等于'.loc()], ['>', '晚于'.loc()],['>', '晚于或等于'.loc()], ['<', '早于'.loc()], ['<', '早于或等于'.loc()], ['!=', '不等于'.loc()],
				[' IS NULL', '为空'.loc()], [' IS NOT NULL', '不为空'.loc()]]
	};

	var condtionTypeEditor = new fm.ComboBox({
		allowBlank : true,
		scope:this,
		store : this.condtionTypeStore=new Ext.data.SimpleStore({
			fields:["value","text"],
			data:this.actionTypes['int']
		}),
		value:'=',
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		clearTrigger : false,
		mode : 'local'
	});

	this.widgetStore=new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : "/dev/ctrl/searchColumn.jcp?",
						method : 'GET'
					}),
			reader : new Ext.data.JsonReader({
						root : 'dataItem',
						totalProperty : 'totalCount',
						id : 'id'
					}),
			remoteSort : false,
			autoLoad : false
	});

	this.widgetField = new fm.ComboBox({
			allowBlank : true,
			store : this.widgetStore,
			valueField : 'id',
			displayField : 'lname',
			triggerAction : 'all',
			clearTrigger : false,
			mode : 'local'
	});

	var lrrc = lib.RowEditorGrid.RowEditorGrid.ComboBoxRenderer;

	this.conditionGrid = new Ext.grid.GridPanel({
		title: '条件列'.loc(),
		closable: false,
		border:true,  
		plugins : [editor],
		enableAppend:false,
		clicksToEdit : 1,
		enableHdMenu :false,
		store: this.ds,
		ddGroup:'grid2tree',
		columns: [{
				header : '表名称'.loc(),
				dataIndex : 'tab_lname',
				width : 200
			},
			{
				header : '列名称'.loc(),
				id : 'common',
				dataIndex : 'tabitem_lname',
				width : 200,
				editor : titleFields,
				renderer:function(val){
					return val;
				}
			}, {
				header : '条件类型'.loc(),
				dataIndex : 'condition_type',
				width : 180,
				renderer : lrrc(condtionTypeEditor),
				editor : condtionTypeEditor
			}, {
				header : '控件'.loc(),
				dataIndex : 'widget_id',
				width : 200,
				renderer : lrrc(this.widgetField),
				editor :this.widgetField
			}
		],
		viewConfig: {
			forceFit: true
		},
		frame:false,
        enableDragDrop:true
	});
	this.conditionGrid.on("render",function(){
		var grid=this.conditionGrid;
		var drops = new Ext.dd.DropTarget(grid.getEl(), {
			ddGroup : 'tree2grid',
			notifyDrop : function(dd, e, data){
				this.tree2grid(data.node,grid);
				return true;
			}.createDelegate(this)
		});
		grid.getSelectionModel().on("beforerowselect",function(obj,r,k,record){
		   grid.ddText=record.get("tab_lname")+"/"+record.get("tabitem_lname");
		   return true;
		})
	},this);
	dev.ctrl.ConditionGridPanel.superclass.constructor.call(this,{
		region:'center',
		collapsible: false,
		split:true,
		width:400,
		minSize: 175,
		maxSize: 400,   
		layout:'fit',
		border:false,
		margins:'0 0 0 0',
		items:[this.conditionGrid]
    });
};

Ext.extend(dev.ctrl.ConditionGridPanel, Ext.Panel, {
	tree2grid:function(node,grid){
		var pnode=node.parentNode;
		var temlateRecord = Ext.data.Record.create([
			{name:"tab_id"},
			{name:"tab_lname"},
			{name:"tabitem_id"},
			{name:"tabitem_lname"},
			{name:"dataType"},
			{name:"specialSet"},
			{name:"hasForeignKey"},
			{name:"condition_type"},
			{name:"widget_id"}]);
		this.condtionTypeStore.loadData(this.actionTypes[node.attributes['dataType']]);

		var widgetParams={};
		widgetParams['itemId']=node.id;
		widgetParams['object_id']=this.params.objectId;
		widgetParams['type']='widget';
		this.widgetStore.baseParams=widgetParams;
		this.widgetStore.load();

		grid.getStore().add(new temlateRecord({
			tab_id:pnode.id,
			tab_lname:pnode.text,
			tabitem_id:node.id,
			tabitem_lname:node.text,
			dataType:node.dataType,
			specialSet:node.specialSet,
			hasForeignKey:node.hasForeignKey,
			condition_type:'=',
			widget_id:''  
		}));   
	},
	save: function(params){
			var tabs=new Array();
			this.ds.each(function(rec){tabs.push(rec.get("tab_id"));});
			var columns=new Array();
			this.ds.each(function(rec){columns.push(rec.get("tabitem_id"));});
			var titles=new Array();
			this.ds.each(function(rec){titles.push(rec.get("tabitem_lname"));});
			var types=new Array();
			this.ds.each(function(rec){types.push(rec.get("condition_type"));});
			var widgets=new Array();
			this.ds.each(function(rec){widgets.push(rec.get("widget_id"));}); 
			Ext.Ajax.request({ 
				url:'/dev/ctrl/ConditionColumn.jcp',
				params:{tabs:tabs,columns:columns,titles:titles,types:types,widgets:widgets,objectId:params.objectId},
				method: 'post',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check)
					if(ajaxResult.success){
						Ext.msg("info",'完成条件列更新.'.loc());
					}else{
						Ext.msg("error",'完成条件列更新!,原因:'.loc()+'<br>'+ajaxResult.message);
					}
				}
		}); 
	}
});

