dev.database.ColumnEditor = function(viewMode, enableCtrl, frames, pobj,
		rangeRow) {
	var fm = Ext.form;
	var decimalEditor = new fm.NumberField({
				tabIndex : 129,
				allowBlank : true,
				style : 'text-align:left;ime-mode:disabled;'
			});
	var dataTypeStore = new Ext.data.SimpleStore({
				fields : ['text'],
				data : [["varchar"], ["int"], ["float"], ["date"], ["clob"],
						["blob"], ["geometry"]]
			});

	var typeEditor = new fm.ComboBox({
				tabIndex : 127,
				allowBlank : false,
				store : dataTypeStore,
				valueField : 'text',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				mode : 'local'
			});

	var specialDS = new Ext.data.JsonStore({
				url : '/dev/database/specialSetTree.jcp',
				root : 'items',
				fields : ["text", "value"]
			});

	var specialSetCombo = new fm.ComboBox({
				tabIndex : 129,
				allowBlank : true,
				store : specialDS,
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				mode : 'local'
			});

	var makeSureDefaultCfg = function(rec, testField, defaultConfig) {
		if (!rec.data.cfg)
			rec.data.cfg = {};
		var cfg = rec.data.cfg;
		if (!cfg[testField])
			Ext.apply(cfg, defaultConfig);
	}
	specialSetCombo.on("select", function(obj, record, idx) {
				var objectId = pobj.object_id || pobj.ppid;
				var val = record.get("value");
				var rec = ColumnPanel.getStore().getAt(ColumnPanel.activRow);
				if (val == '1') {
					makeSureDefaultCfg(rec, "option_id", {
								option_id : ''
							});
					var win = new dev.database.SpecialSetPanel(rec.get("cfg"),
							val, objectId);
					win.once("close", function() {
								if (rec.get("cfg").option_id == '0') {
									obj.setValue(0);
								}
							}, this);
					win.show();
					win.getEl().setStyle("z-index", 11000);
				} else if (val == '21' || val == '22') {
					lengthEditor.setValue(36);
				} else if (val == '2') {
					makeSureDefaultCfg(rec, "start", {
								start : 0,
								step : 1
							});
				} else if (val == '25') {
					makeSureDefaultCfg(rec, "INTEGRATE_ID", {
								INTEGRATE_ID : ''
							});
					var win = new dev.database.SpecialSetPanel(rec.get("cfg"),
							val, objectId);
					win.show();
					win.getEl().setStyle("z-index", 11000);
				} else if (val == '5') {
					lengthEditor.setValue(5);
				}
			}, this);
	var lengthEditor = new fm.NumberField({
				tabIndex : 128,
				allowBlank : false,
				style : 'text-align:left;ime-mode:disabled;',
				regex : new RegExp("^[1-9]\d*"),
				regexText : '长度只能填写大于0的正数'.loc()

			});
	typeEditor.on("select", function() {
				var val = this.getValue();
				if (this.oldValue != val) {
					if (val == 'date' || val == 'clob' || val == 'blob') {
						var rel = 16;
						if (val == 'date')
							rel = 8;
						lengthEditor.setValue(rel);
						lengthEditor.disable();
					} else {
						lengthEditor.setValue(10);
						lengthEditor.enable();
					}

					if (val == 'float')
						decimalEditor.enable();
					else
						decimalEditor.disable();

					specialSetCombo.setValue("");
					specialSetCombo.hasFocus = false;
					try {
						specialDS.load({
									params : {
										type : val
									},
									method : 'post'
								});
					} catch (e) {
					}
					this.oldValue = val;
				}
			});

	var primaryKeyCM = new Ext.grid.CheckColumn({
				id : 'pmkradio',
				header : '主键'.loc(),
				dataIndex : 'pmk',
				readOnly : !enableCtrl,
				width : 40
			});
	var notNullCM = new Ext.grid.CheckColumn({
				id : 'notnullradio',
				header : '必填'.loc(),
				dataIndex : 'not_null',
				readOnly : !enableCtrl,
				width : 40
			});
	var lnameField = new fm.TextField({
				tabIndex : 125,
				allowBlank : false,
				blankText : '逻辑名称必须填写'.loc()
			});
	var pnameField = new fm.TextField({
				tabIndex : 126,
				blankText : '物理名称必须填写'.loc(),
				allowBlank : false,
				style : 'ime-mode:disabled;',
				regex : new RegExp("^[a-zA-Z][0-9a-zA-Z_]*$"),
				regexText : '物理名称只能由数字,字母,下划线组成并且首字符不能为数字'.loc()
			});
	lnameField.on("change", function() {
				var val = lnameField.getValue();
			});
	var cm = new Ext.grid.ColumnModel({
		columns : [{
					id : 'name',
					header : '逻辑名称'.loc(),
					dataIndex : 'lname',
					width : 200,
					editor : lnameField
				}, {
					header : '物理名称'.loc(),
					dataIndex : 'pname',
					width : enableCtrl ? 120 : 140,
					editor : pnameField,
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {
						if (enableCtrl ? value.length * 7 > 120 : value.length
								* 8 > 140) {
							metaData.attr = "title='" + value + "'";
						}
						return value;
					}

				}, {
					header : '类型'.loc(),
					defaultValue : "varchar",
					dataIndex : 'data_type',
					width : 80,
					editor : typeEditor
				}, {
					header : '长度'.loc(),
					dataIndex : 'length',
					defaultValue : 10,
					width : 70,
					editor : lengthEditor
				}, {
					header : '小数位'.loc(),
					defaultValue : 0,
					dataIndex : 'decimal_digits',
					width : 50,
					editor : decimalEditor
				}, primaryKeyCM, notNullCM, {
					header : '特殊选项'.loc(),
					dataIndex : 'special_set_text',
					width : 200,
					realValueIndex : 'special_set',
					editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(true),
					editor : specialSetCombo
				}, {
					header : '默认值'.loc(),
					dataIndex : 'default_value',
					width : 60,
					editor : new fm.TextField({
								tabIndex : 131,
								allowBlank : true
							})
				}]
	});
	var id = Ext.id();
	this.ds = new Ext.data.JsonStore({
				id : id,
				url : "/dev/database/table.jcp",
				root : 'dataItem',
				autoLoad : false,
				fields : ['id', 'lname', 'pname', 'data_type', 'length',
						'decimal_digits', 'pmk', 'not_null', 'special_set',
						'special_set_text', 'default_value', 'serial', 'cfg']
			});
	var ColumnPanel = new lib.RowEditorGrid.ListInput({
				viewMode : viewMode,
				enableCtrl : enableCtrl,
				enableAppend : enableCtrl,
				autoSave : true,
				defaultRageRow : rangeRow,
				autoExpandColumn : 'name',
				enableColumnResize : viewMode,
				enableColumnMove : false,
				enableHdMenu : false,
				autoScroll : true,
				border : false,
				cm : cm,
				clicksToEdit : 1,
				plugins : [primaryKeyCM, notNullCM],
				frame : false,
				selModel : new Ext.grid.CheckboxSelectionModel(),
				stripeRows : true,
				minSize : 180,
				region : 'center',
				store : this.ds,
				width : 600
			});
	ColumnPanel.on("beforeentryedit", function(grid, rec) {
				var val = rec.get("data_type");
				if (val == "")
					val = "varchar";
				typeEditor.setValue(val);
				typeEditor.fireEvent("select");
			}, this);
	ColumnPanel.on("beforeAddClick", function(grid, record) {
		var pName = pnameField.getValue();
		var msg = dev.database.KeyWord.getKeyWordMsg(pName);
		if (msg != "") {
			msg = '物理列名是'.loc() + msg + '关键字,请更改物理列名!'.loc()
			pnameField.markInvalid(msg);
			Ext.msg("warn", msg);
			return false;
		}
		var lName = lnameField.getValue();
		if (/^\S*$/.test(lName) === false) {
			msg = '逻辑名称中不能包含空格,请更改逻辑列名!'.loc()// 列表查询中有空格无法作为列名称
			lnameField.markInvalid(msg);
			Ext.msg("warn", msg);
			return false;
		}
		var st = grid.getStore();
		var pn = pName.toLowerCase();
		var ln = record.get("lname");
		st.each(function(rec) {
			if (rec.get("pname").toLowerCase() == pn && rec.get("lname") != ln) {
				msg = '填写的物理列名"'.loc() + pName + '"与列"'.loc()
						+ rec.get("lname") + '"的物理列名重复,请更改物理列名!'.loc()
				pnameField.markInvalid(msg);
				Ext.msg("warn", msg);
				pName = null;
				return false;
			}
		}, this);
		if (pName == null)
			return false;

		var cm = grid.getColumnModel();
		function getCellValue(field) {
			return cm.getCellEditor(cm.findColumnIndex(field)).getValue();
		}
		var defaultValue = String(getCellValue("default_value")).trim();
		var dataType = String(getCellValue("data_type")).trim();
		if (defaultValue != ''
				&& (dataType == 'varchar' || dataType == 'int'
						|| dataType == 'float' || dataType == 'date')) {
			if (dataType == 'date') {
				if (!/\d{4}\/\d{2}\/\d{2}/.test(defaultValue)) {
					Ext.msg("warn", '默认值格式错误,正确的格式为'.loc() + ':yyyy/mm/dd,'
									+ '如'.loc() + ':2008/12/31');
					return false;
				}
			} else {
				var len = +getCellValue("length");
				if (dataType == 'float') {
					// alert(getCellValue("decimal_digits") + "a");
					len = len + getCellValue("decimal_digits") + 1;
				}
				// alert(len + ":" + defaultValue.length);
				if (defaultValue.length > len) {
					Ext.msg("warn", '默认值长度超过字段规定的长度!'.loc());
					return false;
				}
			}
		}

	}, this);
	var editMenu = new Ext.menu.Menu({
				id : 'editMenu'
			});

	var moveColumn = function(off) {
		var st = ColumnPanel.getStore();
		var index = ColumnPanel.ridx;
		var mkd = st.getAt(index).get('id');
		Ext.Ajax.request({
					url : '/dev/database/table.jcp?object_id='
							+ ColumnPanel.object_id + '&submitType=move&off='
							+ off + '&id=' + mkd,
					method : 'get',
					callback : function(options, success, response) {
						if (success) {
							var base = st.getAt(index).get('serial');
							st.getAt(index).set('serial',
									st.getAt(index + off).get('serial'));
							st.getAt(index + off).set('serial', base);
							st.sort('serial', 'ASC');
						}
					}
				});
	}

	var editColumn = function(btn) {
		var st = ColumnPanel.getStore();
		var rec = ColumnPanel.selModel.getSelected();
		if (!rec) {
			Ext.msg("warn", '请先选择要编辑的行'.loc());
			return;
		}
		var isAdd = (btn.cid == 'add');
		var ser = rec.get('serial') * 1 + 1;
		var cfg;
		if (isAdd) {
			var idx = st.indexOf(rec);
		} else {
			cfg = rec.get("cfg");
		}

		if (typeof(cfg) == 'undefined' || cfg == '') {
			cfg = {
				signflag : false
			}
			rec.set("cfg", cfg);
		}
		var win = new dev.database.ColumnPanel(ser, ColumnPanel.object_id, rec
						.get('id'), isAdd, cfg, frames);
		win.show(btn.getEl());
	}
	ColumnPanel.editColumn = editColumn;
	editMenu.add(new Ext.menu.Item({
						id : 'moveUp',
						text : '上移'.loc(),
						cls : 'x-btn-icon bmenu',
						icon : '/themes/icon/all/arrow_up.gif',
						handler : function() {
							moveColumn(-1)
						}
					}), new Ext.menu.Item({
						id : 'moveDown',
						text : '下移'.loc(),
						cls : 'x-btn-icon bmenu',
						icon : '/themes/icon/all/arrow_down.gif',
						handler : function() {
							moveColumn(1)
						}
					}), new Ext.menu.Item({
						cid : 'edit',
						text : '修改字段'.loc(),
						cls : 'x-btn-icon bmenu',
						icon : '/themes/icon/all/server_edit.gif',
						handler : editColumn
					}), new Ext.menu.Item({
						cid : 'add',
						text : '添加字段'.loc(),
						cls : 'x-btn-icon bmenu',
						icon : '/themes/icon/all/table_row_insert.gif',
						handler : editColumn
					}), new Ext.menu.Item({
				id : 'deleteRow',
				text : '删除字段'.loc(),
				cls : 'x-btn-icon bmenu',
				icon : '/themes/icon/all/table_row_delete.gif',
				handler : function() {
					var rec = ColumnPanel.selModel.getSelected();
					var kid = Ext.id();
					Ext
							.msg(
									"confirm",
									'您确认删除列'.loc()
											+ rec.get('lname')
											+ '('
											+ rec.get('pname')
											+ ')?<br>&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;'
											+ '只删除元数据'.loc()
											+ '&nbsp;<input type="checkbox" id='
											+ kid + '><br>&nbsp;', function(
											btns) {
										if (btns == 'yes') {
											var metaOnly = Ext.get(kid).dom.checked;
											Ext.Ajax.request({
												url : '/dev/database/table.jcp?object_id='
														+ ColumnPanel.object_id
														+ '&submitType=delete&metaOnly='
														+ metaOnly
														+ '&id='
														+ rec.get('id')
														+ "&rand="
														+ Math.random(),
												method : 'get',
												callback : function(options,
														success, response) {
													if (success) {
														var o = Ext
																.decode(response.responseText);
														try {
															if (!o.success)
																Ext
																		.msg(
																				"error",
																				'删除失败,原因是:'
																						.loc()
																						+ o.message);
															else
																ColumnPanel
																		.getStore()
																		.remove(rec);
														} catch (e) {
															alert(e);
														}

													} else {
														Ext.msg('error',
																'网络连接错误,删除失败'
																		.loc());
													}
												}
											});
										}
									});

				}
			}));
	editMenu.render();

	ColumnPanel.on("beforeEditClick", function(e, gd, record, rowIndex) {
				gd.getSelectionModel().selectRow(rowIndex);
				var items = editMenu.items.items;
				items[0].setDisabled(rowIndex == 0);
				items[1].setDisabled(rowIndex == gd.getStore().getCount() - 1);
				items[4].setDisabled(gd.getStore().getCount() == 1);
				editMenu.showAt(e.getXY());
				ColumnPanel.ridx = rowIndex;
				var el = editMenu.getEl();
				el.slideIn('tl', {
							easing : 'easeOut',
							duration : .5
						});
				return false;
			}, this);
	return ColumnPanel;
}

Ext.grid.CheckColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},
	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			if (this.grid.viewMode || this.readOnly)
				return;
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			record.set(this.dataIndex, !record.data[this.dataIndex]);
			if (this.id == 'pmkradio' && record.data[this.dataIndex]) {
				record.set("not_null", true);
			}
		}
	},
	renderer : function(v, p, record) {
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (v ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};
