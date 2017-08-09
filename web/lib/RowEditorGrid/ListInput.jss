Ext.namespace('lib.RowEditorGrid');

lib.RowEditorGrid.ListInput = Ext.extend(lib.RowEditorGrid.RowEditorGrid, {
	/**
	 * @cfg {boolean} enableEdit 是否可编辑已有行,默认true.
	 */
	enableEdit : true,
	/**
	 * @cfg {boolean} enableAppend 是否可添加新行,默认true.
	 */
	enableAppend : true,
	/**
	 * @cfg {boolean} enableCtrl 是否显示控制行,默认true,关于控制行的事件,参见事件.
	 */
	enableCtrl : true,
	/**
	 * @cfg {boolean} viewMode
	 *      查看模式,查看模式中,不可修改编辑已有记录,如需编辑,提供编菜单,需响应beforeEditClick事件进行扩展,默认false.
	 */
	viewMode : false,
	autoSave : false,
	contrlColumnWidth : 40,
	// private
	dealing : false,
	defaultMode : 'del',
	enableColumnMove : false,
	enableColumnResize : false,
	defaultRageRow : true,
	enableHdMenu : false,
	initComponent : function() {
		this.initfin = false;
		var tcm = this.cm || this.columns;
		if (typeof(this.defaultValue) == 'undefined')
			this.defaultValue = {};
		var cf = tcm.config || tcm;
		for (var i = 0; i < cf.length; i++) {
			if (typeof(cf[i].dataIndex) != 'undefined'
					&& typeof(this.defaultValue[cf[i].dataIndex]) == 'undefined') {
				this.defaultValue[cf[i].dataIndex] = (cf[i].defaultValue == undefined)
						? ''
						: cf[i].defaultValue;
			}
		}
		if (this.store.fields) {
			var items = this.store.fields.items;
			for (var i = 0; i < items.length; i++) {
				if (typeof(this.defaultValue[items[i].name]) == 'undefined')
					this.defaultValue[items[i].name] = "";
			}
		}
		if (this.viewMode) {
			this.enableAppend = this.enableEdit = false;
			this.defaultMode = 'modify';
		}
		if (!this.enableEdit)
			this.onCellDblClick = Ext.emptyFn;
		if (this.enableCtrl) {
			this._colm = new lib.RowEditorGrid.ListInput.CtrlColumn({
						header : "",
						defaultMode : this.defaultMode,
						width : this.contrlColumnWidth
					});

			cf.unshift(this._colm);
			if (typeof(this.plugins) == 'undefined')
				this.plugins = [this._colm];
			else
				this.plugins.push(this._colm);
		}
		lib.RowEditorGrid.ListInput.superclass.initComponent.call(this);
		this.store.on("beforeload", function() {
					this.store.suspendEvents();
					this.stopEditing(false);
					var c = this.store.getCount();
					if (c > 0)
						this.store.remove(this.store.getAt(c - 1));
					this.store.resumeEvents();
				}, this);
		if (this.defaultRageRow)
			this.store.on("load", this.rangeRow, this);
		this.delayedEditMode = new Ext.util.DelayedTask(function() {
					var pos = -1, count = this.store.getCount();
					var _pstat = "";
					for (var i = 0; i < count; i++) {
						_pstat = this.store.getAt(i)._editStat;
						if (_pstat == "add" || _pstat == "edit") {
							pos = i;
							break;
						}
					}
					if (pos != -1) {
						this.startEditing(pos);
					}
					if (!this.initfin) {
						this.on("beforeupdate", this.leaveStat, this);
						this.on("beforeentryedit", this.entryStat, this);
						this.initfin = true;
					}
				}, this);
		this.addEvents(
				/**
				 * @event beforeAddClick 在对号按钮按下时触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - 指向本 grid</li>
				 *        <li>editors -
				 *        当前所有编辑器(Ext.Editor对象)数组,可以用getValue获取相应的值</li>
				 *        <li>rowIndex - 当前编辑行的行号</li>
				 *        <li>返回false则取消现有的操作</li>
				 *        </ul>
				 * @param {grid,record,rowIndex}
				 *            参数参考事件说明
				 */
				"beforeAddClick"
				/**
				 * @event beforeDelClick 在删除按钮按下时触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - 指向本 grid</li>
				 *        <li>record - 当前store中的记录</li>
				 *        <li>rowIndex - 当前编辑行的行号</li>
				 *        <li>返回false则取消现有的操作</li>
				 *        </ul>
				 * @param {grid,record,rowIndex}
				 *            参数参考事件说明
				 */
				, "beforeDelClick"
				/**
				 * @event beforeEditClick 在查看模式中,编辑按钮按下时触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>e - 事件</li>
				 *        <li>grid - 指向本 grid</li>
				 *        <li>record - 当前store中的记录</li>
				 *        <li>rowIndex - 当前编辑行的行号</li>
				 *        <li>返回false则取消现有的操作</li>
				 *        </ul>
				 * @param {grid,record,rowIndex}
				 *            本事件只有当viewMode属性为true时才会触发,参数参考事件说明
				 */
				, "beforeEditClick");
		if (!this.viewMode && !this.store.autoLoad
				&& this.store.lastOptions == null && this.defaultRageRow) {
			this.rangeRow()
		}

	},
	onDestroy : function() {
		lib.RowEditorGrid.ListInput.superclass.onDestroy.call(this);
	},
	clearAll : function() {
		this.stopEditing(false);
		this.store.removeAll();
		this.rangeRow();
	},
	reset : function() {
		Ext.each(this.editors, function(editor) {
					if (typeof(editor.field.reset) == 'function')
						editor.field.reset();
				})
		this.clearAll();
	},
	onCellDblClick : function(g, row, col) {
		if (this.enableCtrl && col == 0)
			return;
		this.startEditing(row, col);
	},
	leaveStat : function(grid, rec, rowIndex, editors, hideAndSave) {
		if (this.enableAppend && rec._editStat && rec._editStat == "add"
				&& rowIndex == this.store.getCount() - 1) {
			rec._editStat = 'edit';
			hideAndSave.save = true;
		} else
			rec._editStat = 'del';
		if (this.enableCtrl) {
			var t = grid.getView().getCell(rowIndex, 0);
			t.innerHTML = this._colm.renderer("", t, rec);
		}
		return true;
	},
	entryStat : function(grid, rec, rowIndex) {
		rec._editStat = 'add';
		if (this.enableCtrl) {
			var t = grid.getView().getCell(rowIndex, 0);
			t.innerHTML = this._colm.renderer("", t, rec);
		}
		return true;
	},
	rangeRow : function() {// 整理row,删除添加前的空行
		this.ranging=true;
		this.store.each(function(rec) {
					rec._editStat = this.defaultMode;
				}, this);
		this.appendNewRow();
	},
	appendNewRow : function() {
		if (!this.enableAppend)
			return;
		var rec = {};
		if (this.store.recordType) {
			rec = new this.store.recordType(Ext.apply(rec, this.defaultValue));
		}
		rec._editStat = 'add';
		var data = Ext.apply({}, rec.data);
		this.store.add(rec);
		rec.data = data;
		this.delayedEditMode.delay(300);
	}
});
Ext.reg('listinput', lib.RowEditorGrid.ListInput);

lib.RowEditorGrid.ListInput.CtrlColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

lib.RowEditorGrid.ListInput.CtrlColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},
	defaultMode : 'del',
	onMouseDown : function(e, t) {
		if (e.button == 2)
			return;
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			var gd = this.grid;
			var rowIndex = gd.getView().findRowIndex(t);
			var record = gd.store.getAt(rowIndex);
			if (record._editStat == 'del') {
				if (gd.fireEvent("beforeDelClick", gd, record, rowIndex) != false) {
					gd.stopEditing(false);
					gd.store.remove(record);
					gd.delayedEditMode.delay(100);
				}
			} else if (record._editStat == 'add') {
				if (gd.fireEvent("beforeAddClick", gd, record, rowIndex,
						gd.editors) != false) {
					var fl;
					for (var i = gd.editors.length - 1; i > -1; i--) {
						fl = gd.editors[i].field;
						if (!fl.isValid())
							return false;
					}
					record._editStat = 'del';
					gd.stopEditing(true);
					if (gd.enableAppend) {
						if (rowIndex == gd.store.getCount() - 1)
							gd.appendNewRow();
						else
							gd.delayedEditMode.delay(100);
					}
				}
			} else if (record._editStat == 'modify') {
				if (gd.fireEvent("beforeEditClick", e, gd, record, rowIndex) === false) {
					return false;
				}
			}
		}
	},
	renderer : function(value, parent, rec) {
		if (typeof(rec._editStat) == 'undefined')
			rec._editStat = this.defaultMode;
		return '<div class="x-listinput-' + rec._editStat + ' x-grid3-cc-'
				+ this.id + '"></div>';
	}
};
