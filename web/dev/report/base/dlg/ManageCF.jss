Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.ManageCF = function() {
		this.id = "manageCF";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		Array.prototype.findIndex = function(value) {
			var ctr = "";
			for (var i = 0; i < this.length; i++) {
				if (this[i][0] == value) {
					return i
				}
			}
			return ctr
		};
		function isArray(obj) {
			if (obj.constructor.toString().indexOf("Array") == -1) {
				return false
			} else {
				return true
			}
		}
		var fromCFDLG;
		var _applies_to;
		var _to_apply = [];
		var _to_delete = [];
		var _idd;
		var _selRow;
		var _selected;
		var _sel;
		var _currSel = false;
		var currWSId = dev.report.base.app.activeBook.getSheetSelector().getActiveSheetId();
		var _toEdit = false;
		var openCFDLG = function(fmDesc, toEdit) {
			that.win.show();
			fromCFDLG = fmDesc;
			if (!fromCFDLG) {
				return
			}
			if (toEdit) {
				fromCFDLG[0].id = _idd;
				fromCFDLG[0].applies_to = _applies_to;
				_toEdit = toEdit;
				var _double = false;
				for (var q = 0; q < _to_apply.length; q++) {
					if (fromCFDLG[0].id == _to_apply[q].id) {
						_double = true;
						_to_apply[q] = fromCFDLG[0]
					}
				}
				if (!_double) {
					_to_apply.push(fromCFDLG[0])
				}
				gridData.splice(_selIdx, 1, parseRawRule(fromCFDLG, true))
			} else {
				_to_apply.push(fromCFDLG[0]);
				gridData.unshift(parseRawRule(fromCFDLG, true))
			}
			gridStore.loadData(gridData);
			grid.reconfigure(gridStore, gridCM);
			gridStore.loadData(gridData);
			Ext.getCmp("wMngCndFmt_apply_btn").enable();
			Ext.getCmp("wMngCndFmt_close_btn").setText("Cancel".localize());
			if (!toEdit) {
				grid.getSelectionModel().selectFirstRow()
			}
		};
		Ext.grid.CheckColumn = function(config) {
			Ext.apply(this, config);
			if (!this.id) {
				this.id = Ext.id()
			}
			this.renderer = this.renderer.createDelegate(this)
		};
		Ext.grid.CheckColumn.prototype = {
			init : function(grid) {
				this.grid = grid;
				this.grid.on("render", function() {
							var view = this.grid.getView();
							view.mainBody.on("mousedown", this.onMouseDown,
									this)
						}, this)
			},
			onMouseDown : function(e, t) {
				if (t.className
						&& t.className.indexOf("x-grid3-cc-" + this.id) != -1) {
					e.stopEvent();
					var index = this.grid.getView().findRowIndex(t);
					var record = this.grid.store.getAt(index);
					record.set(this.dataIndex, !record.data[this.dataIndex]);
					_ident = gridData[index][0];
					var _tmp = gridData[index][1];
					var _tmc = gridData[index][2];
					var _act = record.data[this.dataIndex];
					rawRules[index].sit = _act;
					_to_apply.push(rawRules[index]);
					Ext.getCmp("wMngCndFmt_apply_btn").enable();
					Ext.getCmp("wMngCndFmt_close_btn").setText("Cancel"
							.localize())
				}
			},
			renderer : function(v, p, record) {
				p.css += " x-grid3-check-col-td";
				return '<div class="x-grid3-check-col' + (v ? "-on" : "")
						+ " x-grid3-cc-" + this.id + '"> </div>'
			}
		};
		var cndfmt = dev.report.base.cndfmt;
		
		//ÁÙÊ±ÐÞ¸Ä
		var worksheets =new Array();
		
		//dev.report.backend.wss.getSheets()[0];
		
		var putWSinStore = function() {
			for (i = 1; worksheets[i] != null; i = i + 2) {
				var j = i - 1;
				if (worksheets[j] != currWSId) {
					selectionData.push([worksheets[i], worksheets[j]])
				}
			}
		};
		var helperData = [["duplicate".localize(), "duplicate_value"],
				["unique".localize(), "unique_value"],
				["Cell Value".localize(), "cell_value"],
				["Specific Text".localize(), "text"],
				["Dates Occurring".localize(), "dates_occ"],
				["Blanks".localize(), "blanks"],
				["Use a formula".localize(), "formula_true"],
				["No Blanks".localize(), "no_blanks"],
				["Errors".localize(), "errors"],
				["No errors".localize(), "no_errors"],
				["between".localize(), "between"],
				["not between".localize(), "not_between"],
				["equal to".localize(), "="],
				["not equal to".localize(), "<>"],
				["grater than".localize(), ">"], ["less than".localize(), "<"],
				["greater than or equal to".localize(), ">="],
				["less than or equal to".localize(), "<="],
				["containing".localize(), "contained"],
				["not containing".localize(), "not_contained"],
				["beginning with".localize(), "begins_with"],
				["ending with".localize(), "ends_with"],
				["Top".localize(), "top"], ["Bottom".localize(), "bottom"],
				["Top".localize(), "top_percent"],
				["Bottom".localize(), "bottom_percent"],
				["duplicate".localize(), "duplicate_value"],
				["unique".localize(), "unique_value"],
				["Average Value".localize(), "average_value"]];
		var helperDataAverage = [["above".localize(), ">"],
				["below".localize(), "<"], ["equal or above".localize(), ">="],
				["equal or below".localize(), "<="],
				["1 std dev above".localize(), "std_dev_above_1"],
				["1 std dev below".localize(), "std_dev_below_1"],
				["2 std dev above".localize(), "std_dev_above_2"],
				["2 std dev below".localize(), "std_dev_below_2"],
				["3 std dev above".localize(), "std_dev_above_3"],
				["3 std dev below".localize(), "std_dev_below_3"]];
		var selectionData = [
				["Current Selection".localize(), "SCOPE_CURR_SEL"],
				["This Worksheet".localize(), "SCOPE_CURR_WKS"]];
		putWSinStore();
		var selectionStore = new Ext.data.SimpleStore({
					fields : ["rules_for", "id"],
					data : selectionData
				});
		var gridData = [];
		var _currScope = cndfmt.SCOPE_CURR_SEL;
		var rawRules = cndfmt.get(_currScope);
		var parseRawRule = function(_RR, _one) {
			for (var i = 0; i < _RR.length; i++) {
				var _o = _RR[i];
				var _desc;
				for (var j = 0; j < helperData.length; j++) {
					if (_o.type == helperData[j][1]) {
						_desc = helperData[j][0]
					}
				}
				if (_o.type == "average_value") {
					for (var e = 0; e < helperDataAverage.length; e++) {
						if (_o.operator == helperDataAverage[e][1]) {
							_desc = _desc.concat(" ", helperDataAverage[e][0])
						}
					}
				} else {
					for (var e = 0; e < helperData.length; e++) {
						if (_o.operator == helperData[e][1]) {
							_desc = _desc.concat(" ", helperData[e][0])
						}
					}
				}
				if (_o.operands) {
					if (_o.operands.length == 1) {
						_desc = _desc.concat(" ", _o.operands[0].replace(/=/i,
										""))
					} else {
						if (isArray(_o.operands)) {
							for (var o = 0; o < _o.operands.length; o++) {
								if (o == 0) {
									_desc = _desc.concat(" ", _o.operands[o]
													.replace(/=/i, ""))
								} else {
									_desc = _desc.concat(" and ",
											_o.operands[o].replace(/=/i, ""))
								}
							}
						} else {
							_desc = _desc.concat(" ", _o.operands.replace(/=/i,
											""))
						}
					}
					if (!(_o.operands instanceof Array)) {
						_o.operands = [_o.operands]
					}
				}
				if (!_o.style) {
					_o.style = {}
				}
				if (!_o.borders) {
					_o.borders = {}
				}
				if (!_o.borders.top) {
					_o.borders.top = {
						width : "",
						type : "",
						color : ""
					}
				}
				if (!_o.borders.bottom) {
					_o.borders.bottom = {
						width : "",
						type : "",
						color : ""
					}
				}
				if (!_o.borders.left) {
					_o.borders.left = {
						width : "",
						type : "",
						color : ""
					}
				}
				if (!_o.borders.right) {
					_o.borders.right = {
						width : "",
						type : "",
						color : ""
					}
				}
				var _sample = '<div style="font-style: '
						.concat(_o.style.fontStyle, "; background:",
								_o.style.backgroundColor, "; text-decoration:",
								_o.style.textDecoration, "; font-weight: ",
								_o.style.fontWeight, "; color:",
								_o.style.color, "; background-image:",
								_o.style.backgroundImage, ";border-top:",
								_o.borders.top.width, " ", _o.borders.top.type,
								" ", _o.borders.top.color, ";",
								";border-bottom:", _o.borders.bottom.width,
								" ", _o.borders.bottom.type, " ",
								_o.borders.bottom.color, ";", ";border-left:",
								_o.borders.left.width, " ",
								_o.borders.left.type, " ",
								_o.borders.left.color, ";", ";border-right:",
								_o.borders.right.width, " ",
								_o.borders.right.type, " ",
								_o.borders.right.color,
								'; line-height: 18px; text-align: center;">AaBbCcZz</div>');
				if (!_desc) {
					_desc = "undefined"
				}
				var id = _o.id;
				var _a = [_desc, _sample, _o.applies_to, _o.sit, i, id, _o];
				if (_one) {
					return _a
				} else {
					gridData.push(_a)
				}
			}
		};
		parseRawRule(rawRules);
		var gridStore = new Ext.data.SimpleStore({
					fields : [{
								name : "rule"
							}, {
								name : "format"
							}, {
								name : "applies"
							}, {
								name : "stop"
							}, {
								name : "id"
							}, {
								name : "realId"
							}]
				});
		gridStore.loadData(gridData);
		function changeSelection(combo, record, index) {
			gridData = [];
			gridStore.removeAll();
			if (index == 1) {
				_currScope = cndfmt.SCOPE_CURR_WKS;
				rawRules = cndfmt.get(_currScope);
				_currSel = true
			} else {
				if (index == 0) {
					_currScope = cndfmt.SCOPE_CURR_SEL;
					rawRules = cndfmt.get(_currScope);
					_currSel = false
				} else {
					rawRules = cndfmt.get(selectionData[index][1])
				}
			}
			parseRawRule(rawRules);
			gridStore.loadData(gridData);
			grid.reconfigure(gridStore, gridCM);
			grid.getSelectionModel().selectFirstRow()
		}
		var selection = this.cmpFocus = new Ext.form.ComboBox({
					store : selectionStore,
					displayField : "rules_for",
					id : "wManageCF_selection_cmb",
					hideLabel : true,
					editable : false,
					tabIndex : 1,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					typeAhead : true,
					mode : "local",
					value : selectionData[0][0],
					triggerAction : "all",
					width : 200,
					listeners : {
						select : {
							fn : changeSelection,
							scope : this
						}
					}
				});
		var newRuleBtn = new Ext.Button({
			minWidth : 100,
			cls : "x-btn-text-icon",
			ctCls : dev.report.kbd.tags.NO_ENTER,
			tabIndex : 2,
			iconCls : "cnd_fmt_new",
			id : "wMngCndFmt_newRule_btn",
			text : "New Rule".localize().concat("..."),
			listeners : {
				click : {
					fn : function() {
						using("dev.report.base.dlg.ConditionalFormatting");
						var conditionFormating=new dev.report.base.dlg.ConditionalFormatting("fromConditionalManage", openCFDLG);
						that.win.hide()
					},
					scope : this
				}
			}
		});
		var editRuleBtn = new Ext.Button({
			minWidth : 100,
			cls : "x-btn-text-icon",
			iconCls : "cnd_fmt_edit",
			id : "wMngCndFmt_editRule_btn",
			ctCls : dev.report.kbd.tags.NO_ENTER,
			tabIndex : 3,
			text : "Edit Rule".localize().concat("..."),
			listeners : {
				click : {
					fn : function() {
						if (isNaN(_selIdx)) {
							Ext.Msg.alert("Edit Rule".localize(),
									"Please select rule to edit".localize());
							return
						}
						_selected = gridData[_selIdx][6].id;
						_applies_to = gridData[_selIdx][6].applies_to;
						_sel = gridData[_selIdx][4];
						_idd = gridData[_selIdx][5];
						using("dev.report.base.dlg.ConditionalFormatting");
						var conditionFormating=new dev.report.base.dlg.ConditionalFormatting("editFromConditionalManage",
												openCFDLG, gridData[_selIdx][6]);
						that.win.hide()
					},
					scope : this
				}
			}
		});
		var _smt_to_delete = false;
		var deleRuleBtn = new Ext.Button({
					minWidth : 100,
					cls : "x-btn-text-icon",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 4,
					id : "wMngCndFmt_delRule_btn",
					iconCls : "cnd_fmt_delete",
					text : "Delete Rule".localize(),
					listeners : {
						click : {
							fn : function() {
								_to_delete.push(_idd);
								_smt_to_delete = true;
								gridData.splice(_selIdx, 1);
								Ext.getCmp("wMngCndFmt_apply_btn").enable();
								Ext.getCmp("wMngCndFmt_close_btn")
										.setText("Cancel".localize());
								gridStore.loadData(gridData);
								grid.reconfigure(gridStore, gridCM);
								grid.getSelectionModel().selectFirstRow()
							},
							scope : this
						}
					}
				});
		var sortingArray = [];
		var upBtn = new Ext.Button({
					cls : "x-btn-icon",
					iconCls : "cnd_fmt_up",
					id : "wMngCndFmt_up_btn",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 10,
					handler : function() {
						var toSelect = [];
						var selection = grid.getSelectionModel().getSelected();
						if (!selection) {
							return
						}
						Ext.getCmp("wMngCndFmt_apply_btn").enable();
						var n = gridStore.indexOf(selection);
						gridStore.remove(selection);
						if (n != 0) {
							gridStore.insert(n - 1, selection);
							toSelect = n - 1
						} else {
							gridStore.insert(n, selection);
							toSelect = n
						}
						sortingArray.push(selection.data.realId, 1);
						grid.getSelectionModel().selectRow(toSelect)
					}
				});
		var downBtn = new Ext.Button({
					cls : "x-btn-icon",
					iconCls : "cnd_fmt_down",
					id : "wMngCndFmt_down_btn",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 11,
					handler : function() {
						var toSelect = [];
						var selection = grid.getSelectionModel().getSelected();
						if (!selection) {
							return
						}
						Ext.getCmp("wMngCndFmt_apply_btn").enable();
						var n = gridStore.indexOf(selection);
						var f = gridStore.collect("realId");
						gridStore.remove(selection);
						if (n != f.length - 1) {
							gridStore.insert(n + 1, selection);
							toSelect = n + 1
						} else {
							gridStore.insert(n, selection);
							toSelect = n
						}
						sortingArray.push(selection.data.realId, -1);
						grid.getSelectionModel().selectRow(toSelect)
					}
				});
		var sit = new Ext.grid.CheckColumn({
					header : "Stop If True".localize(),
					dataIndex : "stop",
					width : 80
				});
		var gridCM = new Ext.grid.ColumnModel([{
					id : "rule",
					header : "Rule (applied in order shown)".localize(),
					width : 180,
					sortable : false,
					dataIndex : "rule"
				}, {
					header : "Format".localize(),
					width : 120,
					sortable : false,
					dataIndex : "format"
				}, {
					id : "applies",
					header : "Applies to".localize(),
					width : 120,
					sortable : false,
					dataIndex : "applies",
					editor : new Ext.form.TriggerField({
						id : "triggerEditorF",
						enableKeyEvents : true,
						listeners : {
							change : function(e, newValue, oldValue) {
								var index = _selIdx;
								var record = grid.store.getAt(index);
								_ident = gridData[index][0];
								var _tmp = gridData[index][1];
								var _tmc = gridData[index][2];
								var _act = record.data[this.dataIndex];
								rawRules[index].applies_to = newValue;
								var _double = false;
								for (var q = 0; q < _to_apply.length; q++) {
									if (rawRules[index].id == _to_apply[q].id) {
										_double = true;
										_to_apply[q].applies_to = rawRules[index].applies_to
									}
								}
								if (!_double) {
									_to_apply.push(rawRules[index])
								}
								Ext.getCmp("wMngCndFmt_apply_btn").enable();
								Ext.getCmp("wMngCndFmt_close_btn")
										.setText("Cancel".localize())
							}
						},
						onTriggerClick : function() {
							var stil = grid.getSelectionModel().getSelected().data.tf;
							var tData = grid.getSelectionModel().getSelected().data;
							function selRange(selected) {
								that.win.show();
								setTimeout(function() {
									var index = _gid;
									var record = grid.store.getAt(index);
									_ident = gridData[index][0];
									var _tmp = gridData[index][1];
									var _tmc = gridData[index][2];
									rawRules[index].applies_to = "="
											.concat(selected);
									var _double = false;
									for (var q = 0; q < _to_apply.length; q++) {
										if (rawRules[index].id == _to_apply[q].id) {
											_double = true;
											_to_apply[q].applies_to = rawRules[index].applies_to
										}
									}
									if (!_double) {
										_to_apply.push(rawRules[index])
									}
									record.set("applies", "=".concat(selected));
									Ext.getCmp("wMngCndFmt_apply_btn").enable();
									Ext.getCmp("wMngCndFmt_close_btn")
											.setText("Cancel".localize())
								}, 1)
							}
							that.win.hide();
							using("dev.report.base.dlg.SelectRange");
							var selectRange=new dev.report.base.dlg.SelectRange({
										fnc : [this, selRange],
										rng : Ext.getCmp("triggerEditorF")
												.getValue(),
										format : "{Sheet}!{Range}",
										omitInitSheet : true
							});
							var _gid = grid.getSelectionModel().getSelected().data.id
						},
						triggerClass : "hl-triggerFld-shSel",
						triggerConfig : {
							tag : "span",
							cls : "hl-triggerFld-shSel",
							cn : [{
										tag : "img",
										src : Ext.BLANK_IMAGE_URL,
										cls : "x-form-trigger "
												+ this.triggerClass
									}, {
										tag : "img",
										src : Ext.BLANK_IMAGE_URL,
										cls : "x-form-trigger hl-triggerFld-shSel"
									}]
						}
					})
				}, sit]);
		var _selIdx;
		var grSelModel = Ext.extend(Ext.grid.RowSelectionModel, {
			onEditorKey : function(f, e) {
				var k = e.getKey(), newCell, g = this.grid, last = g.lastEdit, ed = g.activeEditor, shift = e.shiftKey, ae, last, r, c;
				if (k == e.TAB) {
					e.stopEvent();
					ed.field.fireEvent("change", ed.field, ed.field.getValue(),
							ed.field.originalValue);
					ed.completeEdit();
					if (shift) {
						newCell = g.walkCells(ed.row, ed.col - 1, -1,
								this.acceptsNav, this)
					} else {
						newCell = g.walkCells(ed.row, ed.col + 1, 1,
								this.acceptsNav, this)
					}
				} else {
					if (k == e.ENTER) {
						if (this.moveEditorOnEnter !== false) {
							if (shift) {
								newCell = g.walkCells(last.row - 1, last.col,
										-1, this.acceptsNav, this)
							} else {
								newCell = g.walkCells(last.row + 1, last.col,
										1, this.acceptsNav, this)
							}
						}
					}
				}
				if (newCell) {
					r = newCell[0];
					c = newCell[1];
					this.onEditorSelect(r, last.row);
					if (g.isEditor && g.editing) {
						ae = g.activeEditor;
						if (ae && ae.field.triggerBlur) {
							ae.field.triggerBlur()
						}
					}
					g.startEditing(r, c)
				}
			}
		});
		var grid = new Ext.grid.EditorGridPanel({
					store : gridStore,
					clicksToEdit : 1,
					plugins : sit,
					cm : gridCM,
					id : "wMngCndFmt_rules_grd",
					stripeRows : false,
					sm : new grSelModel({
								singleSelect : true,
								listeners : {
									rowselect : function(sm, rowIdx, r) {
										_selected = gridData[rowIdx].id;
										_sel = gridData[rowIdx][4];
										_selIdx = rowIdx;
										_idd = gridData[rowIdx][5]
									}
								}
							}),
					viewConfig : {},
					enableHdMenu : false,
					autoExpandColumn : "rule",
					height : 200,
					autoWidth : true,
					baseCls : "x-plain",
					listeners : {
						rowclick : function(gr, index, e) {
							_selRow = index
						},
						rowdblclick : function(grid, rowIndex, e) {
							_selected = gridData[rowIndex][6].id;
							_applies_to = gridData[rowIndex][6].applies_to;
							_sel = gridData[rowIndex][4];
							_idd = gridData[rowIndex][5];
							var conditionFormating=new dev.report.base.dlg.ConditionalFormatting("editFromConditionalManage",
													openCFDLG,
													gridData[rowIndex][6]);
							that.win.hide()
						}
					}
				});
		var mainApplyButton = {
			text : "Apply".localize(),
			disabled : true,
			tabIndex : 103,
			ctCls : dev.report.kbd.tags.NO_ENTER,
			id : "wMngCndFmt_apply_btn",
			handler : function() {
				if (_to_apply.length) {
					cndfmt.set(_currScope, _to_apply, sortingArray)
				} else {
					if (sortingArray.length > 0) {
						cndfmt.set(_currScope, undefined, sortingArray)
					}
				}
				if (_smt_to_delete) {
					cndfmt.remove(cndfmt.SCOPE_RULE_IDS, _to_delete)
				}
				_smt_to_delete = false;
				_to_apply = [];
				sortingArray = [];
				_to_delete = [];
				Ext.getCmp("wMngCndFmt_apply_btn").disable();
				Ext.getCmp("wMngCndFmt_close_btn").setText("Close")
			}
		};
		var mainPanel = new Ext.Panel({
			baseCls : "x-title-f",
			labelWidth : 100,
			labelAlign : "left",
			layout : "form",
			bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
			frame : false,
			header : false,
			monitorValid : true,
			autoHeight : true,
			autoWidth : true,
			items : [{
				layout : "column",
				border : false,
				baseCls : "x-plain",
				items : [{
					layout : "form",
					border : false,
					width : 160,
					baseCls : "x-plain",
					items : [{
						html : "Show formatting rules for".localize()
								.concat(":"),
						baseCls : "x-plain",
						bodyStyle : "padding-top: 3px;"
					}]
				}, {
					layout : "form",
					border : false,
					autoWidth : true,
					baseCls : "x-plain",
					items : selection
				}]
			}, {
				layout : "column",
				border : false,
				bodyStyle : "padding-top: 3px; margin-bottom: 5px;",
				baseCls : "x-plain",
				items : [{
							layout : "form",
							border : false,
							width : 105,
							baseCls : "x-plain",
							items : [newRuleBtn]
						}, {
							layout : "form",
							border : false,
							width : 105,
							baseCls : "x-plain",
							items : [editRuleBtn]
						}, {
							layout : "form",
							border : false,
							width : 105,
							baseCls : "x-plain",
							items : [deleRuleBtn]
						}, {
							layout : "form",
							border : false,
							width : 30,
							baseCls : "x-plain",
							items : [upBtn]
						}, {
							layout : "form",
							border : false,
							width : 30,
							baseCls : "x-plain",
							items : [downBtn]
						}]
			}, grid]
		});
		this.win = new Ext.Window({
			title : "Conditional Formatting Rules Manager".localize(),
			closable : true,
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			cls : "default-format-window",
			resizable : false,
			animCollapse : false,
			onEsc : Ext.emptyFn,
			width : 800,
			height : 350,
			items : [mainPanel],
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				},
				show : function() {
					setTimeout(function() {
								that.initFocus(true, 100);
								setTimeout(function() {
											grid.getSelectionModel()
													.selectFirstRow()
										}, 1)
							})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			buttons : [ new Ext.Button({
						text : "OK".localize(),
						tabIndex : 101,
						handler : function() {
							if (_to_apply.length) {
								cndfmt.set(_currScope, _to_apply, sortingArray)
							} else {
								if (sortingArray.length > 0) {
									cndfmt.set(_currScope, undefined,
											sortingArray)
								}
							}
							if (_smt_to_delete) {
								cndfmt
										.remove(cndfmt.SCOPE_RULE_IDS,
												_to_delete)
							}
							that.win.close()
						}
					}), new Ext.Button({
						text : "Cancel".localize(),
						id : "wMngCndFmt_close_btn",
						tabIndex : 102,
						ctCls : dev.report.kbd.tags.NO_ENTER,
						handler : function() {
							that.win.close()
						}
					}), mainApplyButton]
		});
//		this.setContext();
		this.win.show(this)
}