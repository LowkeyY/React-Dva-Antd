
Ext.namespace('dev.quality');

loadcss("Ext.ux.grid.RowEditor");
using("Ext.ux.grid.RowEditor");
dev.quality.RuleManage = function(params) {
	var params = params;
	this.retFn = params.retFn || Ext.emptyFn;
	var dataType;
	var isValidated = true;
	var nullTypeStore = new Ext.data.SimpleStore({
		fields : ['is_null', 'is_null_text'],
		data : [['true', '是'.loc()], ['false', '否'.loc()]]
	});
	var nullTypeField = new Ext.form.ComboBox({
			name:'is_null',
			store : nullTypeStore,
			valueField : 'is_null',
			displayField : 'is_null_text',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});

	var errorTypeStore = new Ext.data.SimpleStore({
		fields : ['error_type', 'error_type_name'],
		data : []
	});
	var errorTypeField = new Ext.form.ComboBox({
			name:'errortype',
			store : errorTypeStore,
			valueField : 'error_type',
			displayField : 'error_type_name',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});

	var rangeErrorStore = new Ext.data.SimpleStore({
		fields : ['range_error_level', 'range_error_level_name'],
		data : []
	});
	var rangeErrorField = new Ext.form.ComboBox({
			name:'rangeerrorlevel',
			store : rangeErrorStore,
			valueField : 'range_error_level',
			displayField : 'range_error_level_name',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});

	var formatErrorStore = new Ext.data.SimpleStore({
		fields : ['format_error_level', 'format_error_level_name'],
		data : []
	});
	var formatErrorField = new Ext.form.ComboBox({
			name:'formaterrorlevel',
			store : formatErrorStore,
			valueField : 'format_error_level',
			displayField : 'format_error_level_name',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});

	var regexPatternField = new Ext.form.TextField({name:'regex_pattern',width:10});
	
	function displayText(v){
		var txt = "否".loc();
		if(v=="true")
			txt = "是".loc();
		return txt;
	};

	function displayErrorLevel(v){
		var txt;
		if(v=="3"){
			txt = "紧急".loc();
		}else if(v=="2"){
			txt = "关键".loc();
		}else if(v=="1"){
			txt = "错误".loc();
		}else if(v=="0"){
			txt = "警告".loc();
		}else if(v==""){
			txt = "警告".loc();
		}else{
			txt = v;
		}
		return txt;
	};

	function validateValue(v){
		var r;
		isValidated = false;
		if(dataType=="date"){
			r = v.match(/^(\d{1,4})(\/)(\d{1,2})(\/)(\d{1,2})$/);
			if(r==null){
				return "请输入正确的日期格式，如：yyyy/mm/dd".loc();
			}
			if(r[3]<1 || r[3]>12){
				return "月份只能是1至12的整数".loc();
			}
			if(r[5]<1 || r[5]>31){
				return "日期只能是1至31的整数".loc();
			}
			isValidated = true;
			return true;
		}else if(dataType=="float"){
			r = v.match(/^-?\d+(\.\d+)?$/);  
			if(r==null){
				return "只能输入数字".loc();
			}else{
				isValidated = true;
				return true;
			}
		}else{
			r = v.match(/^-?\d+$/);
			if(r==null){
				return "只能输入整数".loc();
			}else{
				isValidated = true;
				return true;
			}
		}
	};

	var cm = new Ext.grid.ColumnModel({
		columns: [
				{
					id : 'lname',
					header : "标签".loc(),
					editable: false,
					dataIndex : 'title',
					width : 60
				},{
					header : "类型".loc(),
					editable: false,
					dataIndex : 'data_type',
					width : 40
				},{
					header : "不为空".loc(),
					dataIndex : 'is_null',
					width : 20,
					realValueIndex : 'is_null',
					renderer : displayText,
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
					editor : nullTypeField
				},{
					header : "最大值/长度".loc(),
					dataIndex : 'max_value',
					editable: true,
					width : 80,
					editor : new Ext.form.TextField({name:'max_value', validator: validateValue})
				},{
					header : "最小值/长度".loc(),
					dataIndex : 'min_value',
					editable: true,
					width : 80,
					editor : new Ext.form.TextField({name:'min_value',validator:validateValue})
				},{
					header : "正则表达式".loc(),
					dataIndex : 'regex_pattern',
					width : 80,
					editor : regexPatternField
				},{
					header : "空值错误级别".loc(),
					dataIndex : 'error_type',
					//realValueIndex : 'error_type',
					renderer : displayErrorLevel,
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
					width : 30,
					editor : errorTypeField
				},{
					header : "值域错误级别".loc(),
					dataIndex : 'range_error_level',
					//realValueIndex : 'error_type',
					renderer : displayErrorLevel,
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
					width : 30,
					editor : rangeErrorField
				},{
					header : "格式错误级别".loc(),
					dataIndex : 'format_error_level',
					//realValueIndex : 'error_type',
					renderer : displayErrorLevel,
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
					width : 30,
					editor : formatErrorField
				}
		]
	  }
	);  
	cm.defaultSortable = false;

	var dsUrl = '/dev/quality/ruleManage.jcp?object_id=' + params.parent_id
			+ '&baseType=' + params.baseType + '&rand=' + Math.random();

	var ds = this.ds = new Ext.data.JsonStore({
				url : dsUrl,
				root : 'items',
				method : 'GET',
				fields : ["col_id","title","is_null","max_value","min_value","data_type","data_type_value","flength",
							"special_set","max_value","min_value","primary_key","note_tip","regex_pattern","range_error_level","format_error_level","error_type","error_type_name","is_null_text","typeArray"],
				remoteSort : false
	});


	this.ds.load();
	var topBar = [new Ext.Toolbar.Button({
		text : '保存'.loc(),
		icon : '/themes/icon/xp/save.gif',
		cls : 'x-btn-text-icon',
		scope : this,
		handler : function() {
			ColumnPanel.stopEditing(true);
			var storeValue = [];
			var allRecords = this.ds.getRange(0);
			for (var i = 0, j = 0; i < allRecords.length; i++) {
				for (i = 0; i < allRecords.length; i++){				
					storeValue[i] = allRecords[i].data;
				}
			}
			Ext.Ajax.request({
						url : '/dev/quality/ruleManage.jcp',
						params : {
							object_id : params.parent_id,
							fields : Ext.encode(storeValue)
						},
						scope : this,
						callback : function(options, success, response) {
							Ext.msg("info", "保存成功".loc());
						}
					});
		}
	}), new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon',
				scope : this,
				handler : this.retFn
			}), new Ext.Toolbar.Button({
		text : '重置'.loc(),
		icon : '/themes/icon/xp/refresh.gif',
		cls : 'x-btn-text-icon',
		scope : this,
		handler : function() {
			var dss = this.ds;
			Ext.msg("confirm", "此操作会清除当前的设置,是否继续?".loc(), function(answer) {
						if (answer == 'yes') {
							Ext.Ajax.request({
										url : '/dev/quality/ruleManage.jcp',
										method : 'DELETE',
										params : {
											objectId : params.parent_id
										},
										scope : this,
										success : function(response, options) {
											var o = Ext.decode(response.responseText);
											if (!o.success)
												Ext.msg("error", o.message);
											else {
												dss.load();
											}
										}
									});
						}
					});
		}
	})];  
    var editor = new Ext.ux.grid.RowEditor({
        saveText: '更新'.loc(),
        cancelText:' 取消'.loc(),
		errorSummary : false,
		clicksToEdit: 1
    });

	editor.on('canceledit',function(e,row){
		  isValidated = true;
	},editor);
	
	var ColumnPanel = new Ext.grid.GridPanel({
				autoExpandColumn : 'lname',
				autoScroll : true,
				border : false,
				layout : 'form',
				cm : cm,
				tbar : topBar,
				clicksToEdit : 1,
				trackMouseOver : true,
				enableHdMenu : false,
				viewConfig:{forceFit:true},
				plugins : [editor],
				frame : false,
				selModel : new Ext.grid.CheckboxSelectionModel(),
				stripeRows : true,
				minSize : 180,
				store : this.ds
	});
	
	ColumnPanel.on('cellclick',function(grid, rowIndex, columnIndex, e){
		if(isValidated){
			dataType = grid.getStore().getAt(rowIndex).get("data_type");
		}
		errorTypeStore.loadData(Ext.util.JSON.decode(grid.getStore().getAt(rowIndex).get("typeArray")));
		formatErrorStore.loadData(Ext.util.JSON.decode(grid.getStore().getAt(rowIndex).get("typeArray")));
		rangeErrorStore.loadData(Ext.util.JSON.decode(grid.getStore().getAt(rowIndex).get("typeArray")));
		regexPatternField.setDisabled(true);
		if(dataType == "varchar")
			regexPatternField.setDisabled(false);
	},this);
	this.MainTabPanel = ColumnPanel;
}
