Ext.namespace("dev.ctrl");

dev.ctrl.ListConditionTree = Ext.extend(lib.RowEditorTree.RowEditorTree, {
	initComponent : function() {
		this.editors = {};// ----此处可以查到内存泄露-tz.
		dev.ctrl.ListConditionTree.superclass.initComponent.call(this);
		var comboConfig = {
			valueField : 'value',
			displayField : 'text',
			triggerAction : 'all',
			mode : 'local'
		}
		var fieldCombo = new Ext.form.ComboBox(Ext.apply({
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : this.fields
							}),
					width : this.columns[0].width-100
		}, comboConfig));

		fieldCombo.on("select", function(combo, rec, rowIndex) {
					var node = this.activeNode;
					node.attributes.name = rec.get("value");
					var olds = node.editors;
					node.editors = this.getNodeEditors(node);
					for (var i = 1; i < this.columns.length; i++) {
						if (node.editors[i] != null
								&& node.editors[i] != olds[i]) {
							olds[i].hide();
							var value = node.editors[i].field;
							value = (value.xtype == 'combo') ? value.store.getAt(0).get("value"):"";
							node.editors[i].startEdit(node.divs[i], value);
						}
					}
				}, this);
		this.editors.fieldCombo = new lib.RowEditorTree.TreeEditor(this,fieldCombo);

		var andOrCombo = new Ext.form.ComboBox(Ext.apply({
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["and", '并且'.loc()], ["or", '或者'.loc()]]
							}),
					width : 120
				}, comboConfig));
		andOrCombo.on("select", function(combo, rec, rowIndex) {
					var node = this.activeNode.getUI().textNode;
					node.innerHTML = '组:'.loc() + rec.get("text");
				}, this)
		this.editors.andOrCombo = new lib.RowEditorTree.TreeEditor(this,
				andOrCombo);
	},
	trackMouseOver : false,
	initEditors : function() {
		for (var i in this.stu) {
			var editor = null, meta = this.stu[i];
			if (typeof(meta.editor) != 'undefined') {
				editor = Ext.ComponentMgr.create(meta.editor, 'textfield');
				delete(meta.editor);
			} else {
				editor = new Ext.form.TextField({
					qtip : {
						title : '提示'.loc(),
						dismissDelay : 10000,
						text : '此处可以填写过滤条件,注意填写的参数要与当前列的数据类型一致,如果操作符为in,请用逗号分隔相应的值,并根据情况加相应边界符.此处也可以填写系统参数,系统参数参见com.kinglib.util.defaultValue的javaDoc'.loc()
					}
				});
			}
			editor.setWidth(this.columns[2].width);
			this.editors[meta.dataIndex + "_editor"] = new lib.RowEditorTree.TreeEditor(this, editor);
		}
	},
	getNodeEditors : function(node) {
		var arr = new Array();
		if (node.isLeaf()) {
			arr.push(this.editors.fieldCombo);
			var colName=node.attributes.name;
			if(colName.indexOf("(")!=-1){
				if(colName.indexOf(",")!=-1){
					colName=colName.substring(colName.indexOf("(")+1,colName.indexOf(","));
				}else{
					colName=colName.substring(colName.indexOf("(")+1,colName.indexOf(")"));
				}
			}
			var meta = this.stu[colName];
			if(meta!=null&&meta.type!=null){
				arr.push(this.getAction(meta.type));
			}
			var editor = this.editors[colName + "_editor"];
			arr.push(editor);
		}else {
			this.editors.andOrCombo.field.node = node;
			arr = [null, this.editors.andOrCombo, null];
		}
		node.editors = arr;
		Ext.each(arr,function(ed){
			if(ed!=null && !Ext.isDefined(ed.parentEl)){
				ed.parentEl = this.el;
			}
		},this)
		return node.editors;
	},
	saveValue : function(node, editor, colIndex) {
		var val = editor.getValue();
		if (Ext.isDate(val)) {
			val = val.format("Y/m/d");
		}
		node.attributes[this.columns[colIndex].dataIndex] = val;
		node.divs[colIndex].innerHTML = Ext.util.Format.htmlEncode(val);
	},
	getAction : function(type) {
		var action = this.editors[type];
		if (typeof(action) == 'undefined') {
			var wi = this.columns[1].width;
			var cdata = this.actionTypes[type];
			if (cdata == null)
				cdata = this.actionTypes.unknown;
			this.editors[type] = action = new lib.RowEditorTree.TreeEditor(
					this, new Ext.form.ComboBox({
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : cdata
										}),
								valueField : 'value',
								displayField : 'text',
								triggerAction : 'all',
								width : wi,
								hidden : false,
								xtype : 'combo',
								mode : 'local',
								fieldName : 'action'
							}));
		}
		return action;
	},
	actionTypes : {
		"int" : [['=', '等于'.loc()], ['>', '大于'.loc()], ['<', '小于'.loc()], ['!=', '不等于'.loc()],
				[' IS NULL', 'is null'], [' IS NOT NULL ', 'is not null'],
				['in', 'in']],
		"float" : [['=', '等于'.loc()], ['>', '大于'.loc()], ['<', '小于'.loc()], ['!=', '不等于'.loc()],
				[' IS NULL', 'is null'], [' IS NOT NULL ', 'is not null'],
				['in', 'in']],
		"unknown" : [['=', '等于'.loc()], ['!=', '不等于'.loc()], [' IS NULL', 'is null'],
				[' IS NOT NULL', 'is not null'], ['in', 'in']],
		"varchar" : [['like', '包含'.loc()], ['not like', '不包含'.loc()], ['=', '等于'.loc()],
				['!=', '不等于'.loc()], [' IS NULL', 'is null'],
				[' IS NOT NULL', 'is not null'], ['in', 'in']],
		"date" : [['=', '等于'.loc()], ['>', '大于'.loc()], ['<', '小于'.loc()], ['!=', '不等于'.loc()],
				[' IS NULL', 'is null'], [' IS NOT NULL', 'is not null'],
				['in', 'in']]
	},
	addNode : function(isGroup) {
		if (this.activeNode == null)
			return false;
		var name = this.fields[0][0];
		var meta = this.stu[name];
		var action = this.getAction(meta.type);
		var rec = action.field.store.getAt(0);
		action = rec.get("value");
		var editor = this.editors[meta.dataIndex + "_editor"];
		var value = editor.field;
		value = (value.xtype == 'combo')
				? value.store.getAt(0).get("value")
				: "";

		var child = {
			uiProvider : Ext.tree.ColumnNodeUI,
			text : name,
			name : name,
			action : action,
			value : value,
			leaf : true
		}
		if (isGroup) {
			child = {
				children : [child],
				uiProvider : Ext.tree.ColumnNodeUI,
				text : '组:并且'.loc(),
				name : '',
				expanded : true,
				leaf : false,
				action : 'and',
				value : ''
			}
		}
		var group = new Ext.tree.AsyncTreeNode(child);
		this.activeNode.appendChild(group);
		return true;
	}
});
