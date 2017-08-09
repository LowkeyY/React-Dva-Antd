Ext.namespace('lib.RowEditorGrid');
lib.RowEditorGrid.TopEditorGrid = Ext.extend(Ext.grid.GridPanel, {

	/**
	 * @cfg {Boolean} fields same Store fields Map.
	 */
	fields : null,

	/**
	 * @cfg {Boolean} True to hide editors unless editing data.
	 */
	hideHeadEditors : false,

	// private

	editingRowNum : -1,
	editors : null,
	record : null,
	editorInvisible : false,
	cancelButton : null,
	saveButton : null,
	enableColumnResize : false,
	enableColumnMove : false,
	enableColumnHide : false,
	editorHead : null,
	initComponent : function() {
		this.editors = new Array();
		this._colm = new lib.RowEditorGrid.TopEditorGrid.CtrlColumn({
					header : "",
					menuDisabled : true,
					defaultMode : this.defaultMode,
					width : 50
				});
		var cf = this.columns || this.cm.config;
		cf.unshift(this._colm);

		if (typeof(this.plugins) == 'undefined')
			this.plugins = [this._colm];
		else
			this.plugins.push(this._colm);

		if (Ext.isArray(this.columns)) {
			this.colModel = new lib.RowEditorGrid.ColumnModel(this.columns);
			delete this.columns;
		}
		lib.RowEditorGrid.TopEditorGrid.superclass.initComponent.call(this);
		var header = [
				'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
				'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
				'<tbody><tr class="grid-editor-row" ',
				this.hideHeadEditors ? "style='display:none'" : "",
				'>',
				'<td style="padding-left:7px;">',
				'<div title="'+'保存'.loc()+'"  style="float:left;width:16px;height:16px;margin-left:12px;background: transparent url(/themes/icon/all/edit.gif) no-repeat;"></div>',
				'<div title="'+'取消编辑'.loc()+'"   style="display:none;float:left;width:16px;height:16px;margin-left:3px;background: transparent url(/themes/icon/xp/undo.gif) no-repeat;"></div>',
				'</td>'];
		var cm = this.colModel;
		for (var i = 1; i < cm.getColumnCount(); i++) {
			header.push('<td class="x-small-editor"></td>');
		}
		if (this.fields == null) {
			this.fields = new Array();
			for (var i = 0; i < cm.getColumnCount(); i++) {
				if (cm.getDataIndex(i))
					this.fields.push(cm.getDataIndex(i));
			}
		}
		this.record = Ext.data.Record.create(this.fields);
		header.push('</tr></tbody></table>');
		if (!this.viewConfig)
			this.viewConfig = {};
		Ext.applyIf(this.viewConfig, {
					emptyText : '无数据'.loc(),
					templates : {
						header : new Ext.Template(header)
					}
				})

		if (this.hideHeadEditors) {
			this.editorInvisible = true;
			this.firstShow = true;
		}
		this.addEvents(
				/**
				 * @event beforeAddClick 在对号按钮按下时触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - 指向本 grid</li>
				 *        <li>editors -
				 *        当前所有编辑器(Ext.Editor对象)数组,可以用getValue获取相应的值</li>
				 *        <li>editingRowNum - 当前编辑行的行号(如果值为-1则是新行)</li>
				 *        <li>返回false则取消现有的操作</li>
				 *        </ul>
				 * @param {grid,editors,editingRowNum}
				 *            参数参考事件说明
				 */
				"beforeAddClick",
				/**
				 * @event beforeCancelClick 在对号按钮按下时触发. 事件支持以下参数 <br />
				 *        <ul style="padding:5px;padding-left:16px;">
				 *        <li>grid - 指向本 grid</li>
				 *        <li>editors -
				 *        当前所有编辑器(Ext.Editor对象)数组,可以用getValue获取相应的值</li>
				 *        <li>editingRowNum - 当前编辑行的行号(如果值为-1则是新行)</li>
				 *        <li>返回false则取消现有的操作</li>
				 *        </ul>
				 * @param {grid,editors,editingRowNum}
				 *            参数参考事件说明
				 */
				"beforeCancelClick"
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
				, "beforeCopyClick"
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

	},

	afterRender : function() {
		lib.RowEditorGrid.TopEditorGrid.superclass.afterRender.apply(this,
				arguments);
		var cm = this.colModel, editor;
		this.editorHead = this.el.child("tr.grid-editor-row");
		this.editorHead.setVisibilityMode(Ext.Element.DISPLAY);
		var tds = this.editorHead.dom.childNodes;
		this.saveButton = Ext.get(tds[0].firstChild);
		this.saveButton.on("click", function(e) {
					if (this.fireEvent("beforeAddClick", e, this, this.editors,
							this.editingRowNum) != false) {
						this.submitRow();
					}
				}, this);
		this.cancelButton = Ext.get(tds[0].lastChild);
		this.cancelButton.on("click", function(e) {
					if (this.fireEvent("beforeCancelClick", e, this,
							this.editors, this.editingRowNum) != false) {
						this.reset();
					}
				}, this);
		var forcefit = (this.viewConfig && this.viewConfig.forceFit);
		for (var i = 1; i < cm.getColumnCount(); i++) {
			if (cm.isCellEditable(i)) {
				editor = cm.getCellEditor(i);
				editor.msgTarget = 'qtip';
				editor.dataIndex = cm.getDataIndex(i);
				editor.field.render(tds[i]);
				if (forcefit && editor.setWidth) {
					editor.setWidth(cm.getColumnWidth(i));
				}
				this.editors.push(editor);
			}
		}
	},

	setValue : function(data) {
		if (data) {
			Ext.each(this.editors, function(editor) {
						if (typeof(data[editor.dataIndex]) != 'undefined')
							editor.setValue(data[editor.dataIndex]);
					});
		}
	},

	getValue : function(data) {
		data = data || {};
		Ext.each(this.editors, function(editor) {
					data[editor.dataIndex] = editor.getValue();
				});
		return data
	},

	submitRow : function(data) {
		if (this.validate()) {
			data = this.getValue();
			if (this.editingRowNum == -1) {
				this.getStore().add(new this.record(data));
			} else {
				var rec = this.getStore().getAt(this.editingRowNum);
				rec.data = data;
				this.getView().refresh();
				this.editingRowNum = -1;
			}
			this.reset();
		}
	},

	reset : function() {
		this.hideEditors(function() {
					Ext.each(this.editors, function(editor) {
								editor.reset();
							});
					this.cancelButton.setStyle("display", "none");
					this.saveButton.setStyle("margin-left", "12px");
					var sm = this.getSelectionModel();
					sm.unlock()
					sm.clearSelections();
				}, this);
	},

	validate : function() {
		var valid = true;
		Ext.each(this.editors, function(editor) {
					if (editor.xtype != 'hidden' && editor.validate
							&& !editor.validate()) {
						return valid = false;
					}
				});
		return valid;
	},

	isLocked : function() {
		return this.getSelectionModel().isLocked();
	},

	showEditors : function(callback, scope) {
		if (!this.editorInvisible)
			return;
		this.editorInvisible = false;
		if (this.hideHeadEditors) {
			if (this.firstShow) {
				this.firstShow = false;
				var fn = function() {
					Ext.each(this.editors, function(e) {
								if (e instanceof Ext.form.TriggerField) {
									e.syncSize();
								}
							});
				}.createDelegate(this)
				if (callback)
					callback.createInterceptor(fn);
				else
					callback = fn;
			}
			if (Ext.isIE) {
				this.editorHead.show();
				if (callback)
					callback.call(scope || this)
			} else {
				this.editorHead.fadeIn({
							useDisplay : true,
							callback : callback,
							scope : scope || this
						})
			}

		} else {
			if (callback)
				callback.call(scope || this)
		}
	},

	hideEditors : function(callback, scope) {
		if (this.editorInvisible)
			return;
		this.editorInvisible = true;
		if (this.hideHeadEditors) {
			if (Ext.isIE) {
				this.editorHead.hide();
				if (callback)
					callback.call(this || scope)
				this.syncSize();
			} else {
				this.editorHead.fadeOut({
							useDisplay : true,
							callback : callback,
							scope : scope
						});
			}
		} else {
			if (callback)
				callback.call(this || scope)
		}
	}
})

Ext.reg('topeditorgrid', lib.RowEditorGrid.TopEditorGrid);

lib.RowEditorGrid.TopEditorGrid.CtrlColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
};

lib.RowEditorGrid.TopEditorGrid.CtrlColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},
	onMouseDown : function(e, t) {
		if (e.button == 2)
			return;
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			var g = this.grid;
			if (g.isLocked())
				return;
			var rowIndex = g.getView().findRowIndex(t);
			var record = g.store.getAt(rowIndex);
			if (t.className.indexOf('copy') != -1) {
				if (g.fireEvent("beforeCopyClick", e, g, record, rowIndex) != false) {
					g.setValue(record.data);
					g.showEditors();
				}
			} else {
				if (g.fireEvent("beforeEditClick", e, g, record, rowIndex) != false) {
					g.editingRowNum = rowIndex;
					g.saveButton.setStyle("margin-left", "3px");
					g.cancelButton.setStyle("display", "");
					g.setValue(record.data);
					g.showEditors();
					var sm = g.getSelectionModel();
					sm.selectRow(rowIndex);
					sm.lock()
				}
			}
		}
	},
	renderer : function(value, parent, rec) {
		return '<div title="'+'编辑'.loc()+'" style="float:left;width:16px;height:16px;margin-left:3px;background: transparent url(/themes/icon/all/page_white_edit.gif) no-repeat;" class="edit-x-grid3-cc-'
				+ this.id
				+ '"></div><div title="'+'复制'.loc()+'"  style="float:left;width:16px;height:16px;margin-left:3px;background: transparent url(/themes/icon/common/copy.gif) no-repeat;" class="copy-x-grid3-cc-'
				+ this.id + '"></div>';
	}
};

lib.RowEditorGrid.ColumnModel = Ext.extend(Ext.grid.ColumnModel, {
			/**
			 * configures this column model
			 * 
			 * @param {Array}
			 *            config Array of Column configs
			 */

			setConfig : function(config, initial) {
				var i, c, len;
				if (!initial) { // cleanup
					delete this.totalWidth;
					for (i = 0, len = this.config.length; i < len; i++) {
						this.config[i].destroy();
					}
				}

				// backward compatibility
				this.defaults = Ext.apply({
							width : this.defaultWidth,
							sortable : this.defaultSortable
						}, this.defaults);

				this.config = config;
				this.lookup = {};

				for (i = 0, len = config.length; i < len; i++) {
					c = Ext.applyIf(config[i], this.defaults);

					if (typeof c.renderer == "string") { //如果renderer是字符型，初始化一下
						c.renderer = Ext.util.Format[c.renderer];
					}
					if (Ext.isEmpty(c.id)) {
						c.id = i;
					}
					if (!c.isColumn) {
						var Cls = Ext.grid.Column.types[c.xtype || 'gridcolumn'];
						c = new Cls(c);
						config[i] = c;
					}
					this.lookup[c.id] = c;
				}
				if (!initial) {
					this.fireEvent('configchange', this);
				}
			}

		})
