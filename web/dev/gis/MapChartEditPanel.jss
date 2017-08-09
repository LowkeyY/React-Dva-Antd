Ext.namespace("dev.gis");
usecss("lib.RowEditorGrid.RowEditor");
using("lib.RowEditorGrid.RowEditor");
dev.gis.MapChartEditPanel = function(params) {
	this.params = params;
	var fm = Ext.form;
	var Color = new lib.ColorField.ColorField({
				id: 'color',
				width: 120,
				allowBlank: true
	});
	var valueFields = new fm.TextField({
				name: 'title',								
				width: 200,
				maxLength : 200,
				maxLengthText : '标题不能超过{0}个字符!'.loc()
	});
	var cmArray=new Array();
	var autoExpandCol='title';
	cmArray.push({
			id : 'title',
			header : '参数'.loc(),
			dataIndex : 'title',
			width : 60,
			editor : valueFields,
			renderer:function(val){
				return val;
			}
	});
	cmArray.push({
			header : '颜色'.loc(),
			dataIndex : 'color',
			width : 110,
			renderer:function(val){
				return '<div style="float:left;margin-left:3px;">' + val + '</div><div style="width:20px;height:9px;background-color:'+val+';border:solid 1px #C0C0C0;float:left;margin-left:10px;">&nbsp;</div>'
			},
			editor : Color
	});
	var cm = new Ext.grid.ColumnModel(cmArray);

	this.ds = new Ext.data.JsonStore({
		url : "/dev/gis/chartColumn.jcp",
		method : 'POST',
		params:params,
		root : 'dataItem',	
		fields:['title','color']
	});   
	var editor = new lib.RowEditorGrid.RowEditor({
			saveText : '保存'.loc(),
			cancelText : '取消'.loc(),
			commitChangesText : '请保存或取消所做的修改'.loc(),
			errorText : '提示'.loc()
	});
	var ColumnPanel = new Ext.grid.GridPanel( {   
		autoExpandColumn : autoExpandCol, 
		autoScroll : true,
		border : false,
		cm : cm,
		plugins : [editor],
		clicksToEdit : 1,
		frame : false,
		enableAppend:false,
		selModel : new Ext.grid.CheckboxSelectionModel(),
		stripeRows : true,
		minSize : 180,
		draggable :false,
		enableHdMenu :false,
		region : 'center',
		store : this.ds,
		width:810
	});   
	return ColumnPanel;
}

