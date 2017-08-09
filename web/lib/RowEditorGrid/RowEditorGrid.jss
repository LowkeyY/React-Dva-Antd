

/*
 * 不支持forceFit editor失去焦点时无法隐藏 combo grid 翻译功能落后 隐藏的formField控件会显示在左上角
 */
Ext.namespace('lib.RowEditorGrid');

lib.RowEditorGrid.RowEditorGrid = Ext.extend(Ext.grid.EditorGridPanel, {

	/**
	 * @cfg {boolean} showDirtyMark 在本行编辑后,是否在被编辑的单元格左上方显示红色三角符号,默认true.
	 */
	showDirtyMark : true,
	/**
	 * @cfg {boolean} 本行失去编辑状态后,是否自动保存编辑后的值,默认true.
	 */
	autoSave : true,
	// private
	needToRefreshFlag : 0,
	initComponent : function() {  
		lib.RowEditorGrid.RowEditorGrid.superclass.initComponent.call(this);
		this.activeEditor = null;
		this.editors = new Array();
		this.colModel.getColumnsBy(function(cfg, index) {
			if (cfg.editor != undefined) {
				var ce = cfg.getCellEditor(index);
				if (cfg.hidden === true)
					ce.hidden = true;
				ce.col = index;
				ce.dataField = cfg.dataIndex;
				ce.field.msgTarget = 'title';
				ce.field.validateOnBlur = false;
				ce.onShow = function() {
					if (this.hidden === true)
						return;
					this.el.show();
					if (this.hideEl !== false)
						this.boundEl.hide();
					this.field.show();
				}
				this.editors.push(ce);
				if (cfg.editorConfig != undefined) {
					if (cfg.editorConfig.init) {
						cfg.editorConfig.init.createDelegate(ce, [this, cfg])();
						delete cfg.editorConfig.init;
					}
					Ext.apply(ce, cfg.editorConfig);
					ce.interruptSave = (cfg.editorConfig.save != undefined);
					ce.interruptRead = (cfg.editorConfig.read != undefined);
				}
			}   

		}, this);
		this.addEvents(
				/**
				 * @event beforeupdate 在行失去编辑状态之前触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - 指向本 grid</li>
				 *        <li>record - 当前store中的记录</li>
				 *        <li>rowIndex - 当前编辑行的行号</li>
				 *        <li>editors -
				 *        Editor对象数组,包含所有传入ColumnModel中的编辑对象,每个对象增加col属性与dataField属性,分别对应本编辑器对应的列索引和store中列名</li>
				 *        </ul>
				 * @param {Object}
				 *            e An edit event (see above for description)
				 */
				"beforeupdate"
				/**
				 * @event beforeentryedit 在行得到编辑状态之前触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - 指向本 grid</li>
				 *        <li>record - 当前store中的记录</li>
				 *        <li>rowIndex - 当前编辑行的行号</li>
				 *        </ul>
				 * @param {Object}
				 *            e An edit event (see above for description)
				 */
				, "beforeentryedit");
	},
	afterRender : function() {
		for (var i = 0; i < this.editors.length; i++) {
			this.editors[i].parentEl = this.el;
		}
		lib.RowEditorGrid.RowEditorGrid.superclass.afterRender.call(this);
	},
	onDestroy : function() {
		try {
			lib.RowEditorGrid.RowEditorGrid.superclass.onDestroy.call(this);
		} catch (e) {
		}  
	},
	getEditors : function() {
		return this.editors;
	},
	// col代表光标最后停第几列上.
	startEditing : function(row, col) {
		if (!this.rendered || row == this.activRow)
			return;
		this.stopEditing(this.autoSave);
		var crow=this.view.getRow(row);
		if (this.view.mainBody.dom.innerHTML == "" || typeof(crow)=='undefined') {
			this.startEditing.defer(500, this, [row, col]);
			return false;
		}
		this.activRow = row;
		var r = this.store.getAt(row);
		if (this.fireEvent("beforeentryedit", this, r, row) === false) {
			return;
		}
	   // this.view.ensureVisible(row, 0, true);
		if (!col)
		col = this.editors[0].col;
		for (var i = this.editors.length - 1; i > -1; i--) {
			var ed = this.editors[i];
			ed.row = row;
			ed.record = r;
			ed.startEdit(this.view.getCell(row, ed.col).firstChild,r.data[ed.dataField]);
			ed.field.clearInvalid();
			if (col == ed.col)
				ed.field.focus();
			ed.editing = false;
		}
	},
	// flag:是否保存当前修改后的结果
	stopEditing : function(flag) {
		if (flag == undefined)
			return;
		if (typeof(this.activRow) == 'undefined' || this.activRow == null)
			return;
		var row = this.activRow;
		var hideAndSave = {
			hide : true,
			save : flag
		};
		var r = this.store.getAt(row);
		if (this.fireEvent("beforeupdate", this, r, row, this.editors,
				hideAndSave) === false) {
			return false;
		}
		flag = hideAndSave.save;
		this.activRow = null;
		for (var i = this.editors.length - 1; i > -1; i--) {
			var ed = this.editors[i];
			ed.editing = true;
			if (flag) {
				if (ed.interruptSave)
					ed.save(this, r, row);
				else {
					if (this.showDirtyMark)
						r.set(ed.dataField, ed.getValue());
					else {
						var edcs = r.editing;
						r.editing = true;
						r.set(ed.dataField, ed.getValue());
						r.modified = {};
						r.editing = edcs;
						if (!r.editing && r.store)
							r.store.afterEdit(r);
					}
				}
			}
			if (hideAndSave.hide)
				ed.hide();
		}
	},
	regist : function(obj, st, cmv) {
		if (typeof(obj) != 'undefined')
			st.on("load", cmv, obj);
		this.needToRefreshFlag++;
	},
	checkToRefresh : function() {
		if (--this.needToRefreshFlag == 0)
			this.getView().refresh();
	}

});

Ext.reg('roweditorgrid', lib.RowEditorGrid.RowEditorGrid);

// 如果editor为combox,请配置此config具体参见示例.
lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig = function(skipInit) {
	this.skipInit = skipInit;
	this.init = function(grid, config) {
		if (this.skipInit)
			return;
		this.dataField = config.realValueIndex;
		this.textField = config.dataIndex;
		var st = grid.getStore();
		var cmv = function(store, recs) {
			var combo = this.field;
			for (var i = 0; i < recs.length; i++) {
				var d = recs[i].data;
				if (d[this.textField] == '') {
					if (combo.findRecord) {
						var r = combo.findRecord(combo.valueField,
								d[this.dataField])
						if (r)
							d[this.textField] = r.get(combo.displayField);
					}
				}
			}
			grid.checkToRefresh();
		};
		grid.regist(this, st, cmv);
	};

	this.save = function(grid, rec, rowIndex) {
		var v = this.getValue();
		rec.set(this.dataField, v);
		var combo = this.field;
		if (combo.findRecord) {
			var r = combo.findRecord(combo.valueField, v);
			if (r)
				rec.set(this.textField, r.data[combo.displayField]);
		}
	}
}

// 如果editor为combox,可以用此renderer,对于较小的列表(行数小于100,列数小于30),此方法较易理解
// 此方法不需要new,直接调用即可.例:render:lib.RowEditorGrid.RowEditorGrid.ComboBoxRenderer(editor),
lib.RowEditorGrid.RowEditorGrid.ComboBoxRenderer = function(combo) {
	var cb = combo;
	return function(value) {
		var r = cb.store.findBy(function(rec) {
					return rec.data[cb.valueField] == value;
				});
		return (r == -1) ? value : cb.store.getAt(r).get(cb.displayField);
	}
}