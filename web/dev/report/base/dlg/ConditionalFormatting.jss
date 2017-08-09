
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
using('dev.report.base.dlg.Dialog');
dev.report.base.dlg.ConditionalFormatting = function(from, addParams, toEdit) {
		dev.report.base.dlg.ConditionalFormatting.parent.constructor.call(this);
		this.id = "conditionalFormatting";
		var that = this;
		var initActiveItem = 0;
		var winw = 650;
		var rules = [];
		var _tmpRule = {
			sit : false
		};
		var _style;
		var _applies_to;
		var _pre = {};
		if (toEdit) {
			for (var i in toEdit) {
				_pre[i] = _tmpRule[i] = toEdit[i]
			}
		}
		var _wf;
		var _type;
		var _operator;
		var _operands;
		var _sit;
		var _format;
		var _protection;
		var _appliesTo;
		function setContainers(elements) {
			for (var c in that.containers) {
				delete that.containers[c]
			}
			for (var nc in elements) {
				that.containers[nc] = elements[nc]
			}
		}
		var uniFButton = Ext.extend(Ext.Button, {
					iconCls : "select-range-icon",
					cls : "x-btn-icon",
					tooltip : "Select Range".localize(),
					initComponent : function() {
						var that = this;
						Ext.apply(this, {});
						uniFButton.superclass.initComponent.call(this)
					}
				});
		if (!_pre) {
			_pre = {
				type : "",
				operator : "",
				operands : ["", ""],
				sit : false,
				format : "",
				style : "",
				borders : {},
				lock : true
			}
		}
		if (!_pre.operands) {
			_pre.operands = ""
		}
		_style = _pre.style;
		_applies_to = _pre.applies_to;
		if (_pre.id) {
			var _id = _pre.id
		}
		_type = _pre.type;
		_operator = _pre.operator;
		_operands = _pre.operands;
		_sit = _pre.sit;
		_format = _pre.format;
		_style = _pre.style;
		_borders = _pre.borders ? _pre.borders : {};
		_protection = _pre.lock;
		var _fromDlgF = false;
		if (dev.report.base.app.environment.inputMode === dev.report.base.grid.GridMode.DIALOG) {
			_fromDlgF = true
		} else {
			dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		var cndfmt = dev.report.base.cndfmt;
		var CTCSelected;
		var colorPalette = new Ext.ColorPalette({
			colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
			cls : "wide-color-palette"
		});
		var mainMenuData = [
				["Format only cells that contain".localize().concat("...")],
				["Format only top or bottom ranked values".localize()],
				["Format only values that are above or below average".localize()],
				["Format only unique or duplicate values".localize()]];
		var mainMenuStore = new Ext.data.SimpleStore({
					fields : ["type"],
					data : mainMenuData
				});
		function selRange(selected) {
			that.win.show();
			setTimeout(function() {
						var f = Ext.getCmp(_wf);
						f.setValue(selected);
						_wf = ""
					}, 1)
		}
		var _ai_main;
		var _ai_topbot;
		var _ab_bel;
		var _unique;
		var secondaryCID, tertiarCID;
		function chooseMenu(dView, index, node, ev) {
			Ext.getCmp("main_display").layout.setActiveItem(index);
			index = index + 1;
			_ai_main = index;
			if (index == 1) {
				that.win.setWidth(650);
				_type = "cell_value";
				_tmpRule.type = _type;
				if (!_operator) {
					_operator = "between";
					_tmpRule.operator = _operator
				}
			} else {
				that.win.setWidth(500)
			}
			if (index == 0) {
				that.win.setHeight(460);
				previewPanel.hide()
			} else {
				that.win.setHeight(420);
				previewPanel.show()
			}
			if (index == 2) {
				if (!_ai_topbot) {
					_ai_topbot = "top"
				}
			}
			if (index == 3) {
				if (!_ab_bel) {
					_ab_bel = ">"
				}
			}
			if (index == 4) {
				if (!_unique) {
					_unique = "duplicate_value"
				}
			}
			var e = Ext.getCmp("main_display").layout.activeItem;
			var toSet = {};
			secondaryCID = false;
			tertiarCID = false;
			if (e.id != "cells_that_contain") {
				toSet[e.id] = e
			} else {
				toSet.CTCComboHolder = Ext.getCmp("CTCComboHolder");
				var subContainer = CTCCard.layout.activeItem;
				if (subContainer.id == "ctc_secondary_container") {
					toSet[subContainer.items.items[0].id] = subContainer.items.items[0];
					secondaryCID = subContainer.items.items[0].id;
					toSet[subContainer.items.items[1].items.items[0].layout.activeItem.id] = subContainer.items.items[1].items.items[0].layout.activeItem;
					tertiarCID = subContainer.items.items[1].items.items[0].layout.activeItem.id
				} else {
					toSet[subContainer.id] = subContainer;
					secondaryCID = subContainer.id
				}
			}
			setContainers(toSet);
			that.containers.previewPanel = previewPanel
		}
		var _ai_text;
		var _ai_cell_val;
		function setCTCCard(combo, record, index) {
			Ext.getCmp("CTC_card").layout.setActiveItem(index);
			if ((index == 0) || (index == 1)) {
				that.win.setWidth(650);
				CTCRight.setWidth(460);
				CTCCellValue.setWidth(460)
			} else {
				that.win.setWidth(500);
				CTCRight.setWidth(300)
			}
			CTCSelected = CTCComboData[index][1];
			_type = CTCSelected;
			_tmpRule.type = _type;
			if (_type == "text") {
				if (!_ai_text) {
					_ai_text = "contained"
				}
				_tmpRule.operator = _ai_text
			}
			if (_type == "cell_value") {
				if (!_ai_cell_val) {
					_ai_cell_val = "between"
				}
				_tmpRule.operator = _ai_cell_val
			}
			if ((_type == "blanks") || (_type == "no_blanks")) {
				_tmpRule = {
					type : _type
				}
			}
			var e = CTCCard.layout.activeItem;
			delete that.containers[tertiarCID];
			delete that.containers[secondaryCID];
			secondaryCID = false;
			tertiarCID = false;
			if (e.id != "ctc_secondary_container") {
				that.containers[e.id] = e;
				secondaryCID = e.id
			} else {
				that.containers[e.items.items[0].id] = e.items.items[0];
				secondaryCID = e.items.items[0].id;
				that.containers[e.items.items[1].items.items[0].layout.activeItem.id] = e.items.items[1].items.items[0].layout.activeItem;
				tertiarCID = e.items.items[1].items.items[0].layout.activeItem.id
			}
		}
		var _config = {
			colorButtonW : "120px",
			labelWidth : 60,
			textBoxW : 180,
			comboBoxW : 200,
			rowH : 25,
			margingSize : 2,
			minColor : "#FF6633",
			maxColor : "#33FF66",
			midColor : "#6633FF"
		};
		var state = {
			colorMin : _config.minColor,
			colorMax : _config.maxColor,
			colorMid : _config.midColor
		};
		function _setupColorButton(colorBtn, color, setWidth) {
			var tmpElem = Ext.DomQuery.selectNode("*[id=" + colorBtn.btnEl.id
					+ "]");
			tmpElem.style.background = color;
			tmpElem.style.width = "100px"
		}
		var topBottomComboData = [["Top".localize(), "top"],
				["Bottom".localize(), "bottom"]];
		var topBottomComboStore = new Ext.data.SimpleStore({
					fields : ["rank", "type"],
					data : topBottomComboData
				});
		var aboveBelowData = [["above".localize(), ">"],
				["below".localize(), "<"], ["equal or above".localize(), ">="],
				["equal or below".localize(), "<="]];
		var aboveBelowStore = new Ext.data.SimpleStore({
					fields : ["type", "operator"],
					data : aboveBelowData
				});
		var duplicateComboData = [["duplicate".localize(), "duplicate_value"],
				["unique".localize(), "unique_value"]];
		var duplicateComboStore = new Ext.data.SimpleStore({
					fields : ["type", "rule_type"],
					data : duplicateComboData
				});
		var CTCComboData = [["Cell Value".localize(), "cell_value"],
				["Specific Text".localize(), "text"],
				["Blanks".localize(), "blanks"],
				["No Blanks".localize(), "no_blanks"]];
		var CTCComboStore = new Ext.data.SimpleStore({
					fields : ["with", "value"],
					data : CTCComboData
				});
		var CTCComboDataCellValue = [["between".localize(), "between"],
				["not between".localize(), "not_between"],
				["equal to".localize(), "="],
				["not equal to".localize(), "<>"],
				["greater than".localize(), ">"],
				["less than".localize(), "<"],
				["greater than or equal to".localize(), ">="],
				["less than or equal to".localize(), "<="]];
		var CTCComboStoreCellValue = new Ext.data.SimpleStore({
					fields : ["desc", "operator"],
					data : CTCComboDataCellValue
				});
		var CTCComboDataSpecificText = [["containing".localize(), "contained"],
				["not containing".localize(), "not_contained"],
				["beginning with".localize(), "begins_with"],
				["ending with".localize(), "ends_with"]];
		var CTCComboStoreSpecificText = new Ext.data.SimpleStore({
					fields : ["desc", "operator"],
					data : CTCComboDataSpecificText
				});
		var CTCComboDataDatesOccurring = [["Yesterday".localize()],
				["Today".localize()], ["Tomorrow".localize()],
				["In the last 7 days".localize()], ["Last week".localize()],
				["This week".localize()], ["Next week".localize()],
				["Last month".localize()], ["This month".localize()],
				["Next month".localize()]];
		var CTCComboStoreDatesOccurring = new Ext.data.SimpleStore({
					fields : ["desc"],
					data : CTCComboDataDatesOccurring
				});
		var dummyList = [['<div style="line-height: 52px;">'.concat(
				"No Format Set".localize(), "</div>")]];
		var dummyStore = new Ext.data.SimpleStore({
					fields : ["dummy"],
					data : dummyList
				});
		var tmpDummy = new Ext.data.Record.create([{
					name : "dummy"
				}]);
		var formatPreview = new Ext.DataView({
			id : "CF_format_preview",
			itemSelector : ".border-field-chooser",
			style : "overflow:auto",
			autoWidth : true,
			singleSelect : true,
			store : dummyStore,
			cls : "borderStyleSelect",
			tpl : new Ext.XTemplate(
					'<div class="format-sample-preview" id="CF_F_PRE_HOLD"><tpl for=".">',
					'<div style="display: table-cell; vertical-align: middle;">',
					'<div style="text-align: center; overflow: hidden;">',
					"{dummy}</div></div>", "</tpl></div>")
		});
		var mainMenu = new Ext.DataView({
			id : "wCndFmt_mainMenu_dv",
			store : mainMenuStore,
			tpl : new Ext.XTemplate(
					'<div style="background-color: #FFFFFF; border:1px solid #B5B8C8;"><tpl for=".">',
					'<div class="thumb-wrap">{type}<br /></div>',
					"</tpl></div>"),
			autoHeight : true,
			border : true,
			multiSelect : false,
			singleSelect : true,
			overClass : "x-view-over",
			itemSelector : "div.thumb-wrap",
			emptyText : "Menu error, please contact support",
			listeners : {
				click : {
					fn : chooseMenu,
					scope : this
				}
			}
		});
		var fromFCDLG;
		var _edited_from_MCF = false;
		var openFCDLG = function(fmDesc, isEdit) {
			fromFCDLG = fmDesc;
			_edited_from_MCF = true;
			if (!fromFCDLG[0].top) {
				fromFCDLG[0].top = {
					width : "",
					type : "none",
					color : ""
				}
			}
			if (!fromFCDLG[0].bottom) {
				fromFCDLG[0].bottom = {
					width : "",
					type : "none",
					color : ""
				}
			}
			if (!fromFCDLG[0].left) {
				fromFCDLG[0].left = {
					width : "",
					type : "none",
					color : ""
				}
			}
			if (!fromFCDLG[0].right) {
				fromFCDLG[0].right = {
					width : "",
					type : "none",
					color : ""
				}
			}
			for (var i in fromFCDLG[0].top) {
				if (!fromFCDLG[0].top[i]) {
					fromFCDLG[0].top[i] = ""
				}
			}
			for (var i in fromFCDLG[0].bottom) {
				if (!fromFCDLG[0].bottom[i]) {
					fromFCDLG[0].bottom[i] = ""
				}
			}
			for (var i in fromFCDLG[0].left) {
				if (!fromFCDLG[0].left[i]) {
					fromFCDLG[0].left[i] = ""
				}
			}
			for (var i in fromFCDLG[0].right) {
				if (!fromFCDLG[0].right[i]) {
					fromFCDLG[0].right[i] = ""
				}
			}
			_borders.top = fromFCDLG[0].top;
			_borders.bottom = fromFCDLG[0].bottom;
			_borders.left = fromFCDLG[0].left;
			_borders.right = fromFCDLG[0].right;

			var tmpRec = new tmpDummy({
						dummy : '<div style="font-style: '.concat(
								fromFCDLG[0].fontStyle, "; background:",
								fromFCDLG[0].backgroundColor,
								"; text-decoration:",
								fromFCDLG[0].textDecoration, "; font-weight: ",
								fromFCDLG[0].fontWeight, "; color:",
								fromFCDLG[0].color, "; background-image:",
								fromFCDLG[0].backgroundImage, ";border-top:",
								fromFCDLG[0].top.width, " ",
								fromFCDLG[0].top.type, " ",
								fromFCDLG[0].top.color, ";", ";border-bottom:",
								fromFCDLG[0].bottom.width, " ",
								fromFCDLG[0].bottom.type, " ",
								fromFCDLG[0].bottom.color, ";",
								";border-left:", fromFCDLG[0].left.width, " ",
								fromFCDLG[0].left.type, " ",
								fromFCDLG[0].left.color, ";", ";border-right:",
								fromFCDLG[0].right.width, " ",
								fromFCDLG[0].right.type, " ",
								fromFCDLG[0].right.color,
								'; line-height: 52px;">AaBbCcZz</div>')
					});
			dummyStore.removeAll();
			dummyStore.insert(0, tmpRec);
			formatPreview.refresh();
			_style = fromFCDLG[0];
			_format = fromFCDLG[1];
			_protection = fromFCDLG[2];
			that.win.show();
			that.win.focus()
		};
		var previewPanel = this.containers.previewPanel = new Ext.Panel({
			id : "preview_panel",
			layout : "column",
			baseCls : "x-plain",
			hidden : true,
			border : false,
			frame : false,
			items : [{
				width : 120,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [{
							html : "Preview".localize().concat(":"),
							bodyStyle : "font-weight: bold; margin-top: 20px;",
							baseCls : "x-plain"
						}]
			}, {
				width : 280,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [formatPreview]
			}, {
				width : 100,
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [new Ext.Button({
					disabled : false,
					tabIndex : 100,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					id : "wCndFmt_format_btn",
					hidden : false,
					style : "margin-top: 20px;margin-right: 10px;",
					enableToggle : false,
					minWidth : 100,
					text : "Format".localize().concat("..."),
					listeners : {
						click : {
							fn : function() {
								using("dev.report.base.dlg.Format");
								var format=new dev.report.base.dlg.Format("fromConditionalFormatting",
														0,
														openFCDLG,
														[_format, _style,
																_borders,
																_protection]);
							},
							scope : this
						}
					}
				})]
			}]
		});
		var CTCCombo = new Ext.form.ComboBox({
					store : CTCComboStore,
					displayField : "with",
					id : "wCndFmt_CTC_cmb",
					hideLabel : true,
					editable : false,
					typeAhead : true,
					tabIndex : 10,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					mode : "local",
					triggerAction : "all",
					value : CTCComboData[0][0],
					selectOnFocus : true,
					listWidth : 115,
					width : 100,
					listeners : {
						select : {
							fn : setCTCCard,
							scope : this
						}
					}
				});
		var CTCComboCellValue = new Ext.form.ComboBox({
			store : CTCComboStoreCellValue,
			id : "wCndFmt_ctcCellValue_cmb",
			displayField : "desc",
			hideLabel : true,
			editable : false,
			typeAhead : true,
			ctCls : dev.report.kbd.tags.NO_ENTER,
			tabIndex : 11,
			mode : "local",
			triggerAction : "all",
			value : CTCComboDataCellValue[0][0],
			selectOnFocus : true,
			listWidth : 125,
			width : 110,
			listeners : {
				select : {
					fn : function(combo, record, index) {
						Ext.getCmp("CTC_cell_value_card").layout
								.setActiveItem(index);
						if ((index == 0) || (index == 1)) {
							that.win.setWidth(650)
						} else {
						}
						_operator = CTCComboDataCellValue[index][1];
						_ai_cell_val = CTCComboDataCellValue[index][1];
						_tmpRule.operator = _operator;
						var e = Ext.getCmp("CTC_cell_value_card").layout.activeItem;
						delete that.containers[tertiarCID];
						that.containers[e.id] = e;
						tertiarCID = e.id
					},
					scope : this
				}
			}
		});
		var CTCComboSpecificText = new Ext.form.ComboBox({
					store : CTCComboStoreSpecificText,
					displayField : "desc",
					id : "wCndFmt_CTCSpecText_cmb",
					hideLabel : true,
					editable : false,
					tabIndex : 32,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					typeAhead : true,
					mode : "local",
					triggerAction : "all",
					value : CTCComboDataSpecificText[0][0],
					selectOnFocus : true,
					listWidth : 100,
					width : 100,
					listeners : {
						select : {
							fn : function(combo, record, index) {
								_operator = CTCComboDataSpecificText[index][1];
								_tmpRule.operator = _operator;
								_ai_text = CTCComboDataSpecificText[index][1]
							},
							scope : this
						}
					}
				});
		var fromField1 = new Ext.form.TextField({
					name : "wCndFmt_from1_fld",
					id : "wCndFmt_from1_fld",
					width : 110,
					tabIndex : 12,
					value : (_pre.operands[0]) ? _pre.operands[0].replace(/=/i,
							"") : "",
					hideLabel : true,
					enableKeyEvents : true
				});
		var fromField1Button = new uniFButton({
					tabIndex : 13,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_from1_fld")
											.getValue()
						});
						_wf = "wCndFmt_from1_fld";
						that.win.hide()
					}
				});
		var fromField1Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 110,
						baseCls : "x-plain",
						items : fromField1
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : fromField1Button
					}]
		};
		var fromField2 = new Ext.form.TextField({
					name : "wCndFmt_from2_fld",
					id : "wCndFmt_from2_fld",
					width : 110,
					tabIndex : 14,
					value : (_pre.operands[1]) ? _pre.operands[1].replace(/=/i,
							"") : "",
					hideLabel : true,
					enableKeyEvents : true
				});
		var fromField2Button = new uniFButton({
					tabIndex : 15,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_from2_fld")
											.getValue()
						});
						_wf = "wCndFmt_from2_fld";
						that.win.hide()
					}
				});
		var fromField2Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 110,
						baseCls : "x-plain",
						items : fromField2
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : fromField2Button
					}]
		};
		var fromField3 = new Ext.form.TextField({
					name : "wCndFmt_from3_fld",
					id : "wCndFmt_from3_fld",
					width : 110,
					tabIndex : 16,
					value : (_pre.operands[0]) ? _pre.operands[0].replace(/=/i,
							"") : "",
					hideLabel : true,
					enableKeyEvents : true
				});
		var fromField3Button = new uniFButton({
					tabIndex : 17,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_from3_fld")
											.getValue()
						});
						_wf = "wCndFmt_from3_fld";
						that.win.hide()
					}
				});
		var fromField3Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 110,
						baseCls : "x-plain",
						items : fromField3
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : fromField3Button
					}]
		};
		var fromField4 = new Ext.form.TextField({
					name : "wCndFmt_from4_fld",
					id : "wCndFmt_from4_fld",
					width : 110,
					tabIndex : 18,
					value : (_pre.operands[1]) ? _pre.operands[1].replace(/=/i,
							"") : "",
					hideLabel : true,
					enableKeyEvents : true
				});
		var fromField4Button = new uniFButton({
					tabIndex : 19,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_from4_fld")
											.getValue()
						});
						_wf = "wCndFmt_from4_fld";
						that.win.hide()
					}
				});
		var fromField4Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 110,
						baseCls : "x-plain",
						items : fromField4
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : fromField4Button
					}]
		};
		function isArray(obj) {
			if (obj.constructor.toString().indexOf("Array") == -1) {
				return false
			} else {
				return true
			}
		}
		var tempOperands;
		if (isArray(_pre.operands)) {
			tempOperands = _pre.operands[0] || ""
		} else {
			tempOperands = _pre.operands || ""
		}
		var formField5 = new Ext.form.TextField({
					name : "wCndFmt_form5_fld",
					id : "wCndFmt_form5_fld",
					tabIndex : 20,
					width : 180,
					hideLabel : true,
					value : tempOperands.replace(/=/i, ""),
					enableKeyEvents : true
				});
		var formField5Button = new uniFButton({
					tabIndex : 21,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_form5_fld")
											.getValue()
						});
						_wf = "wCndFmt_form5_fld";
						that.win.hide()
					}
				});
		var formField5Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 180,
						baseCls : "x-plain",
						items : formField5
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : formField5Button
					}]
		};
		var formField6 = new Ext.form.TextField({
					name : "wCndFmt_form6_fld",
					id : "wCndFmt_form6_fld",
					width : 180,
					tabIndex : 22,
					hideLabel : true,
					value : tempOperands.replace(/=/i, ""),
					enableKeyEvents : true
				});
		var formField6Button = new uniFButton({
					tabIndex : 23,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_form6_fld")
											.getValue()
						});
						_wf = "wCndFmt_form6_fld";
						that.win.hide()
					}
				});
		var formField6Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 180,
						baseCls : "x-plain",
						items : formField6
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : formField6Button
					}]
		};
		var formField7 = new Ext.form.TextField({
					name : "wCndFmt_form7_fld",
					id : "wCndFmt_form7_fld",
					width : 180,
					tabIndex : 24,
					value : tempOperands.replace(/=/i, ""),
					hideLabel : true,
					enableKeyEvents : true
				});
		var formField7Button = new uniFButton({
					tabIndex : 25,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_form7_fld")
											.getValue()
						});
						_wf = "wCndFmt_form7_fld";
						that.win.hide()
					}
				});
		var formField7Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 180,
						baseCls : "x-plain",
						items : formField7
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : formField7Button
					}]
		};
		var formField8 = new Ext.form.TextField({
					name : "wCndFmt_form8_fld",
					id : "wCndFmt_form8_fld",
					width : 180,
					tabIndex : 26,
					value : tempOperands.replace(/=/i, ""),
					hideLabel : true,
					enableKeyEvents : true
				});
		var formField8Button = new uniFButton({
					tabIndex : 27,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_form8_fld")
											.getValue()
						});
						_wf = "wCndFmt_form8_fld";
						that.win.hide()
					}
				});
		var formField8Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 180,
						baseCls : "x-plain",
						items : formField8
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : formField8Button
					}]
		};
		var formField9 = new Ext.form.TextField({
					name : "wCndFmt_form9_fld",
					id : "wCndFmt_form9_fld",
					width : 180,
					tabIndex : 28,
					value : tempOperands.replace(/=/i, ""),
					hideLabel : true,
					enableKeyEvents : true
				});
		var formField9Button = new uniFButton({
					tabIndex : 29,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_form9_fld")
											.getValue()
						});
						_wf = "wCndFmt_form9_fld";
						that.win.hide()
					}
				});
		var formField9Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 180,
						baseCls : "x-plain",
						items : formField9
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : formField9Button
					}]
		};
		var formField10 = new Ext.form.TextField({
					name : "wCndFmt_form10_fld",
					id : "wCndFmt_form10_fld",
					width : 180,
					tabIndex : 30,
					value : tempOperands.replace(/=/i, ""),
					hideLabel : true,
					enableKeyEvents : true
				});
		var formField10Button = new uniFButton({
					tabIndex : 31,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
									fnc : [this, selRange],
									format : "{Sheet}!{Range}",
									rng : Ext.getCmp("wCndFmt_form10_fld")
											.getValue()
						});
						_wf = "wCndFmt_form10_fld";
						that.win.hide()
					}
				});
		var formField10Container = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 180,
						baseCls : "x-plain",
						items : formField10
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : formField10Button
					}]
		};
		var specificTextfield = new Ext.form.TextField({
					name : "wCndFmt_specTxt_fld",
					id : "wCndFmt_specTxt_fld",
					width : 180,
					tabIndex : 33,
					value : _pre.operands[0],
					hideLabel : true,
					enableKeyEvents : true
				});
		var CTCCellValueCard = new Ext.Panel({
			id : "CTC_cell_value_card",
			layout : "card",
			deferredRender : true,
			autoWidth : true,
			baseCls : "x-plain",
			border : false,
			activeItem : 0,
			items : [new Ext.Panel({
				id : "ctc_tertiar_container",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 160,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [fromField1Container]
				}, {
					width : 55,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [{
								html : "and".localize(),
								baseCls : "x-plain",
								bodyStyle : "padding-left: 5px; padding-right: 5px;"
							}]
				}, {
					width : 160,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [fromField2Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container2",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 160,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [fromField3Container]
				}, {
					width : 55,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [{
								html : "and".localize(),
								baseCls : "x-plain",
								bodyStyle : "padding-left: 5px; padding-right: 5px;"
							}]
				}, {
					width : 160,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [fromField4Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container3",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 230,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [formField5Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container6",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 230,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [formField6Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container7",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 230,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [formField7Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container8",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 230,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [formField8Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container9",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 230,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [formField9Container]
				}]
			}), new Ext.Panel({
				id : "ctc_tertiar_container10",
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				autoWidth : true,
				items : [{
					width : 230,
					layout : "form",
					xtype : "fieldset",
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					autoHeight : true,
					border : false,
					frame : false,
					items : [formField10Container]
				}]
			})]
		});
		var CTCCellValue = new Ext.Panel({
			id : "ctc_secondary_container",
			layout : "column",
			autoHeight : true,
			baseCls : "x-plain",
			border : false,
			frame : false,
			items : [{
				width : 150,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [CTCComboCellValue]
			}, {
				width : 350,
				layout : "form",
				id : "ctc_nest",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [CTCCellValueCard]
			}]
		});
		var CTCSpecificText = new Ext.Panel({
			id : "ctc_specific_text",
			layout : "column",
			baseCls : "x-plain",
			border : false,
			frame : false,
			items : [{
				width : 140,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [CTCComboSpecificText]
			}, {
				width : 300,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [specificTextfield]
			}]
		});
		var CTCCard = new Ext.Panel({
					id : "CTC_card",
					layout : "card",
					deferredRender : true,
					autoWidth : true,
					baseCls : "x-plain",
					border : false,
					activeItem : 0,
					items : [CTCCellValue, CTCSpecificText, {
								baseCls : "x-plain"
							}, {
								baseCls : "x-plain"
							}, {
								baseCls : "x-plain"
							}, {
								baseCls : "x-plain"
							}, {
								baseCls : "x-plain"
							}]
				});
		var CTCRight = new Ext.Panel({
					width : 470,
					id : "ctc_right",
					baseCls : "xplain",
					items : CTCCard
				});
		var CTCMainContainer = new Ext.Panel({
			id : "ctc_main_container",
			layout : "column",
			autoHeight : true,
			baseCls : "x-plain",
			border : false,
			frame : false,
			items : [{
				width : 140,
				layout : "form",
				xtype : "fieldset",
				id : "CTCComboHolder",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [CTCCombo]
			}, {
				id : "ctc_main_right",
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [CTCRight]
			}]
		});
		var cellsThatContain = new Ext.Panel({
					border : true,
					id : "cells_that_contain",
					frame : true,
					baseCls : "main-panel-open",
					autoHeight : true,
					autoWidth : true,
					layout : "form",
					items : [{
								html : "Format only cells with".localize()
										.concat(":"),
								baseCls : "x-plain",
								bodyStyle : "margin-bottom: 10px;"
							}, CTCMainContainer]
				});
		var topBottomCombo = new Ext.form.ComboBox({
					store : topBottomComboStore,
					displayField : "rank",
					id : "wCndFmt_topBottom_cmb",
					hideLabel : true,
					editable : false,
					typeAhead : false,
					tabIndex : 50,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					mode : "local",
					triggerAction : "all",
					value : topBottomComboData[0][0],
					selectOnFocus : true,
					listWidth : 100,
					width : 100,
					listeners : {
						select : {
							fn : function(combo, record, index) {
								_ai_topbot = topBottomComboData[index][1]
							},
							scope : this
						}
					}
				});
		var topBottonFld = new Ext.form.TextField({
					name : "wCndFmt_topBottom_fld",
					id : "wCndFmt_topBottom_fld",
					width : 100,
					tabIndex : 51,
					hideLabel : true,
					enableKeyEvents : true,
					value : 10
				});
		var topBottomSSButton = new uniFButton({
					tabIndex : 52,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
								fnc : [this, selRange],
								format : "{Sheet}!{Range}",
								rng : Ext.getCmp("wCndFmt_topBottom_fld")
										.getValue()
						});
						_wf = "wCndFmt_topBottom_fld";
						that.win.hide()
					}
				});
		var topBottomValue = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						border : false,
						width : 100,
						baseCls : "x-plain",
						items : topBottonFld
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : topBottomSSButton
					}]
		};
		var topBotPerc;
		var topBottomCB = new Ext.form.Checkbox({
					fieldLabel : "perc_of_sel_rng",
					id : "wCndFmt_topBottomPerc_chk",
					hideLabel : true,
					tabIndex : 53,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					name : "perc_of_sel_rng",
					boxLabel : "% of the selected range".localize(),
					listeners : {
						check : {
							fn : function() {
								topBotPerc = this.getValue()
							}
						}
					}
				});
		var topBottomHolder = new Ext.Panel({
			id : "top_bottom_holder",
			layout : "column",
			baseCls : "x-plain",
			border : false,
			frame : false,
			items : [{
				columnWidth : 0.3,
				layout : "form",
				xtype : "fieldset",
				width : 100,
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [topBottomCombo]
			}, {
				columnWidth : 0.3,
				layout : "form",
				width : 130,
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [topBottomValue]
			}, {
				columnWidth : 0.4,
				layout : "form",
				width : 200,
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [topBottomCB]
			}]
		});
		var topBottomRanked = new Ext.Panel({
					border : true,
					id : "top_bottom_ranked",
					frame : true,
					baseCls : "main-panel-open",
					autoHeight : true,
					autoWidth : true,
					layout : "form",
					items : [{
						html : "Format values that rank in the".localize()
								.concat(":"),
						baseCls : "x-plain",
						bodyStyle : "margin-bottom: 10px;"
					}, topBottomHolder]
				});
		var aboveBelowCombo = new Ext.form.ComboBox({
					store : aboveBelowStore,
					displayField : "type",
					id : "wCndFmt_aboveBelow_cmb",
					hideLabel : true,
					editable : false,
					typeAhead : false,
					mode : "local",
					tabIndex : 60,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					triggerAction : "all",
					value : aboveBelowData[0][0],
					selectOnFocus : true,
					listWidth : 120,
					width : 120,
					listeners : {
						select : {
							fn : function(combo, record, index) {
								_ab_bel = aboveBelowData[index][1]
							},
							scope : this
						}
					}
				});
		var aboveBelowHolder = new Ext.Panel({
			id : "above_below_holder",
			layout : "column",
			baseCls : "x-plain",
			border : false,
			frame : false,
			items : [{
				columnWidth : 0.4,
				layout : "form",
				xtype : "fieldset",
				width : 170,
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [aboveBelowCombo]
			}, {
				columnWidth : 0.6,
				layout : "form",
				xtype : "fieldset",
				width : 250,
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [{
							html : "the average for the selected range"
									.localize(),
							baseCls : "x-plain"
						}]
			}]
		});
		var aboveBelowAverage = new Ext.Panel({
					border : true,
					id : "above_below_average",
					frame : true,
					baseCls : "main-panel-open",
					autoHeight : true,
					autoWidth : true,
					layout : "form",
					items : [{
								html : "Format values that are".localize()
										.concat(":"),
								baseCls : "x-plain",
								bodyStyle : "margin-bottom: 10px;"
							}, aboveBelowHolder]
				});
		var duplicateCombo = new Ext.form.ComboBox({
					store : duplicateComboStore,
					displayField : "type",
					id : "wCndFmt_unique_cmb",
					hideLabel : true,
					editable : false,
					typeAhead : false,
					tabIndex : 70,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					mode : "local",
					triggerAction : "all",
					value : duplicateComboData[0][0],
					selectOnFocus : true,
					listWidth : 120,
					width : 120,
					listeners : {
						select : {
							fn : function(combo, record, index) {
								_unique = duplicateComboData[index][1]
							},
							scope : this
						}
					}
				});
		var duplicateHolder = new Ext.Panel({
			id : "duplicate_holder",
			layout : "column",
			baseCls : "x-plain",
			border : false,
			frame : false,
			items : [{
				columnWidth : 0.4,
				layout : "form",
				xtype : "fieldset",
				width : 170,
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [duplicateCombo]
			}, {
				columnWidth : 0.6,
				layout : "form",
				xtype : "fieldset",
				width : 250,
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [{
							html : "values in the selected range".localize(),
							baseCls : "x-plain"
						}]
			}]
		});
		var uniqueDuplicate = new Ext.Panel({
					border : true,
					id : "unique_duplicate",
					frame : true,
					baseCls : "main-panel-open",
					autoHeight : true,
					autoWidth : true,
					layout : "form",
					items : [{
								html : "Format all".localize().concat(":"),
								baseCls : "x-plain",
								bodyStyle : "margin-bottom: 10px;"
							}, duplicateHolder]
				});
		var mainDisplay = new Ext.Panel({
					id : "main_display",
					layout : "card",
					deferredRender : true,
					autoWidth : true,
					baseCls : "x-plain",
					border : false,
					activeItem : initActiveItem,
					items : [cellsThatContain, topBottomRanked,
							aboveBelowAverage, uniqueDuplicate]
				});
		function executeFormatting() {
			function setCondFormatting() {
				if (!fromFCDLG[1]) {
					fromFCDLG[1] = [false]
				}
				switch (_ai_main) {
					case 1 :
						switch (_tmpRule.type) {
							case "cell_value" :
								switch (_tmpRule.operator) {
									case "between" :
										var _op1 = "=".concat(fromField1
												.getValue());
										var _op2 = "=".concat(fromField2
												.getValue());
										if ((!_op1) || (!_op2)) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op1, _op2];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case "not_between" :
										var _op3 = "=".concat(fromField3
												.getValue());
										var _op4 = "=".concat(fromField4
												.getValue());
										if ((!_op3) || (!_op4)) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op3, _op4];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case "=" :
										var _op5 = "=".concat(formField5
												.getValue());
										if (!_op5) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op5];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case "<>" :
										var _op6 = "=".concat(formField6
												.getValue());
										if (!_op6) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op6];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case ">" :
										var _op7 = "=".concat(formField7
												.getValue());
										if (!_op7) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op7];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case "<" :
										var _op8 = "=".concat(formField8
												.getValue());
										if (!_op8) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op8];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case ">=" :
										var _op9 = "=".concat(formField9
												.getValue());
										if (!_op9) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op9];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break;
									case "<=" :
										var _op10 = "=".concat(formField10
												.getValue());
										if (!_op10) {
											alert("The value you entered is not a valid number, date, time or string")
										} else {
											_tmpRule.operands = [_op10];
											_tmpRule.style = fromFCDLG[0];
											_tmpRule.format = isArray(fromFCDLG[1][0])
													? fromFCDLG[1][0]
													: fromFCDLG[1]
										}
										break
								}
								break;
							case "text" :
								var _op = specificTextfield.getValue();
								if (!_op) {
									alert("The value you entered is not a valid number, date, time or string")
								} else {
									_tmpRule.operands = [_op];
									_tmpRule.style = fromFCDLG[0];
									_tmpRule.format = isArray(fromFCDLG[1][0])
											? fromFCDLG[1][0]
											: fromFCDLG[1]
								}
								break;
							case "blanks" :
								_tmpRule = {
									type : _tmpRule.type,
									style : fromFCDLG[0],
									format : isArray(fromFCDLG[1][0])
											? fromFCDLG[1][0]
											: fromFCDLG[1]
								};
								break;
							case "no_blanks" :
								_tmpRule = {
									type : _tmpRule.type,
									style : fromFCDLG[0],
									format : isArray(fromFCDLG[1][0])
											? fromFCDLG[1][0]
											: fromFCDLG[1]
								};
								break;
						}
						break;
					case 2 :
						var topBotN = topBottonFld.getValue();
						if (topBotPerc) {
							_tmpRule = {
								type : _ai_topbot.concat("_percent"),
								operator : topBotN
							}
						} else {
							_tmpRule = {
								type : _ai_topbot,
								operator : topBotN
							}
						}
						_tmpRule.style = fromFCDLG[0];
						_tmpRule.format = isArray(fromFCDLG[1][0])
								? fromFCDLG[1][0]
								: fromFCDLG[1];
						break;
					case 3 :
						_tmpRule = {
							type : "average_value",
							operator : _ab_bel
						};
						_tmpRule.style = fromFCDLG[0];
						_tmpRule.format = isArray(fromFCDLG[1][0])
								? fromFCDLG[1][0]
								: fromFCDLG[1];
						break;
					case 4 :
						_tmpRule = {
							type : _unique
						};
						_tmpRule.style = fromFCDLG[0];
						_tmpRule.format = isArray(fromFCDLG[1][0])
								? fromFCDLG[1][0]
								: fromFCDLG[1];
						break
				}
				_tmpRule.borders = {};
				_tmpRule.borders.top = (fromFCDLG[0]) ? fromFCDLG[0].top : "";
				_tmpRule.borders.bottom = (fromFCDLG[0])
						? fromFCDLG[0].bottom
						: "";
				_tmpRule.borders.left = (fromFCDLG[0]) ? fromFCDLG[0].left : "";
				_tmpRule.borders.right = (fromFCDLG[0])
						? fromFCDLG[0].right
						: "";
				if (fromFCDLG[2] == null) {
					delete _tmpRule.lock
				} else {
					_tmpRule.lock = fromFCDLG[2]
				}
				if (_tmpRule.style) {
					delete _tmpRule.style.top;
					delete _tmpRule.style.bottom;
					delete _tmpRule.style.left;
					delete _tmpRule.style.right
				}
				rules = [_tmpRule]
			}
			if (!fromFCDLG) {
				fromFCDLG = [null, null, null]
			}
			if ((from == "fromConditionalManage")
					|| (from == "editFromConditionalManage")) {
				if ((from == "editFromConditionalManage")
						&& (!_edited_from_MCF)) {
					fromFCDLG[0] = _style;
					fromFCDLG[1] = _pre.format;
					fromFCDLG[2] = _pre.lock
				}
				setCondFormatting();
				rules[0].applies_to = dev.report.base.app.environment.defaultSelection
						.getFormula(true);
				var tArr = rules[0].style;
				for (var w in tArr) {
					if (!tArr[w]) {
						delete tArr[w]
					}
					switch (w) {
						case "backgroundImage" :
							if (tArr[w] == "none") {
								delete tArr[w]
							}
							break
					}
				}
				if (from == "fromConditionalManage") {
					var _isEdit = false
				} else {
					if (from == "editFromConditionalManage") {
						var _isEdit = true;
						rules[0].applies_to = _applies_to;
						rules[0].id = _id;
						if (_pre.lock != undefined && !rules[0].lock) {
							rules[0].lock = _pre.lock
						}
					}
				}
				rules[0].borders = _borders;
				var _output = rules;
				addParams(_output, _isEdit);
				that.win.close()
			} else {
				setCondFormatting();
				var tArr = rules[0].style;
				for (var w in tArr) {
					if (!tArr[w]) {
						delete tArr[w]
					}
					switch (w) {
						case "backgroundImage" :
							if (tArr[w] == "none") {
								delete tArr[w]
							}
							break
					}
				}
				cndfmt.set(undefined, rules);
				that.win.close()
			}
		}
		var _title;
		if (from == "editFromConditionalManage") {
			_title = "Edit Formatting Rule".localize()
		} else {
			_title = "New Formatting Rule".localize()
		}
		this.win = new Ext.Window({
			title : _title,
			closable : true,
			autoDestroy : true,
			id : "conditional_formatting",
			cls : "default-format-window",
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			onEsc : Ext.emptyFn,
			animCollapse : false,
			width : winw,
			height : 420,
			items : [new Ext.Panel({
				baseCls : "x-title-f",
				labelWidth : 100,
				labelAlign : "left",
				bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
				frame : false,
				header : false,
				monitorValid : true,
				autoHeight : true,
				autoWidth : true,
				items : [{
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					border : true,
					autoHeight : true,
					xtype : "fieldset",
					layout : "form",
					frame : false,
					title : "Select a Rule Type".localize().concat(":"),
					items : [mainMenu]
				}, {
					bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
					border : true,
					autoHeight : true,
					xtype : "fieldset",
					layout : "form",
					frame : false,
					title : "Edit the Rule Description".localize().concat(":"),
					items : [mainDisplay]
				}, previewPanel]
			})],
			listeners : {
				close : function() {
					if (!_fromDlgF) {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
					}
					that.close();
				},
				show : function() {
					setTimeout(function() {
								previewPanel.doLayout()
							}, 1);
					setTimeout(function() {
							})
				},
				activate : function(win) {
					that.activate()
				}
			},
			buttons : [(this.components.OK = new Ext.Button({
								text : "OK".localize(),
								tabIndex : 1001,
								handler : function() {
									executeFormatting();
									that.win.close()
								}
							})), (this.components.Cancel = new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 1002,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									if ((from == "fromConditionalManage")
											|| (from == "editFromConditionalManage")) {
										addParams(false, false)
									}
									that.win.close()
								}
							}))]
		});
		this.setContext();
		this.win.show(this);
		if (toEdit) {
			switch (_pre.type) {
				case "cell_value" :
					that.win.setWidth(650);
					_ai_main = 1;
					mainDisplay.layout.setActiveItem(0);
					mainMenu.select(0, false, false);
					chooseMenu(mainMenu, 0, "", "");
					switch (_pre.operator) {
						case "=" :
							CTCComboCellValue.setValue("equal to".localize());
							CTCCellValueCard.layout.setActiveItem(2);
							break;
						case "<>" :
							CTCComboCellValue.setValue("not equal to"
									.localize());
							CTCCellValueCard.layout.setActiveItem(3);
							break;
						case "<=" :
							CTCComboCellValue.setValue("less than or equal to"
									.localize());
							CTCCellValueCard.layout.setActiveItem(7);
							break;
						case ">=" :
							CTCComboCellValue
									.setValue("greater than or equal to"
											.localize());
							CTCCellValueCard.layout.setActiveItem(6);
							break;
						case "<" :
							CTCComboCellValue.setValue("less than".localize());
							CTCCellValueCard.layout.setActiveItem(5);
							break;
						case ">" :
							CTCComboCellValue.setValue("greater than"
									.localize());
							CTCCellValueCard.layout.setActiveItem(4);
							break;
						case "between" :
							CTCComboCellValue.setValue("between".localize());
							CTCCellValueCard.layout.setActiveItem(0);
							break;
						case "not_between" :
							CTCComboCellValue
									.setValue("not between".localize());
							CTCCellValueCard.layout.setActiveItem(1);
							break;
						default :
					}
					break;
				case "bottom_percent" :
					that.win.setWidth(500);
					_ai_main = 2;
					mainDisplay.layout.setActiveItem(1);
					mainMenu.select(1, false, false);
					chooseMenu(mainMenu, 1, "", "");
					topBottomCombo.setValue("Bottom".localize());
					topBottonFld.setValue(_pre.operator);
					topBottomCB.setValue(true);
					break;
				case "average_value" :
					_ai_main = 3;
					mainDisplay.layout.setActiveItem(2);
					mainMenu.select(2, false, false);
					chooseMenu(mainMenu, 2, "", "");
					_ab_bel = _pre.operator;
					switch (_pre.operator) {
						case ">" :
							aboveBelowCombo.setValue("above".localize());
							break;
						case "<" :
							aboveBelowCombo.setValue("below".localize());
							break;
						case ">=" :
							aboveBelowCombo.setValue("equal or above"
									.localize());
							break;
						case "<=" :
							aboveBelowCombo.setValue("equal or below"
									.localize());
							break
					}
					break;
				case "no_blanks" :
					_ai_main = 1;
					mainDisplay.layout.setActiveItem(0);
					mainMenu.select(0, false, false);
					chooseMenu(mainMenu, 0, "", "");
					CTCCard.layout.setActiveItem(4);
					CTCCombo.setValue("No Blanks".localize());
					break;
				case "blanks" :
					_ai_main = 1;
					mainDisplay.layout.setActiveItem(0);
					mainMenu.select(0, false, false);
					chooseMenu(mainMenu, 0, "", "");
					CTCCard.layout.setActiveItem(3);
					CTCCombo.setValue("Blanks".localize());
					break;
				case "text" :
					_ai_main = 1;
					mainDisplay.layout.setActiveItem(0);
					mainMenu.select(0, false, false);
					chooseMenu(mainMenu, 0, "", "");
					CTCCard.layout.setActiveItem(1);
					CTCCombo.setValue("Specific Text".localize());
					switch (_pre.operator) {
						case "contained" :
							CTCComboSpecificText.setValue("containing"
									.localize());
							break;
						case "not_contained" :
							CTCComboSpecificText.setValue("not containing"
									.localize());
							break;
						case "begins_with" :
							CTCComboSpecificText.setValue("beginning with"
									.localize());
							break;
						case "ends_with" :
							CTCComboSpecificText.setValue("ending with"
									.localize());
							break
					}
					break;
				case "top" :
					_ai_main = 2;
					that.win.setWidth(500);
					mainDisplay.layout.setActiveItem(1);
					mainMenu.select(1, false, false);
					chooseMenu(mainMenu, 1, "", "");
					topBottomCombo.setValue("Top".localize());
					topBottonFld.setValue(_pre.operator);
					topBottomCB.setValue(false);
					break;
				case "top_percent" :
					_ai_main = 2;
					that.win.setWidth(500);
					mainDisplay.layout.setActiveItem(1);
					mainMenu.select(1, false, false);
					chooseMenu(mainMenu, 1, "", "");
					topBottomCombo.setValue("Top".localize());
					topBottonFld.setValue(_pre.operator);
					topBottomCB.setValue(true);
					break;
				case "bottom" :
					_ai_main = 2;
					that.win.setWidth(500);
					mainDisplay.layout.setActiveItem(1);
					mainMenu.select(1, false, false);
					chooseMenu(mainMenu, 1, "", "");
					topBottomCombo.setValue("Bottom".localize());
					topBottonFld.setValue(_pre.operator);
					topBottomCB.setValue(false);
					break;
				case "duplicate_value" :
					_ai_main = 4;
					mainDisplay.layout.setActiveItem(3);
					mainMenu.select(3, false, false);
					chooseMenu(mainMenu, 3, "", "");
					duplicateCombo.setValue("duplicate".localize());
					break;
				case "unique_value" :
					_ai_main = 4;
					mainDisplay.layout.setActiveItem(3);
					mainMenu.select(3, false, false);
					chooseMenu(mainMenu, 3, "", "");
					duplicateCombo.setValue("unique".localize());
					break;
				default :
					mainDisplay.layout.setActiveItem(0)
			}
			if(_style){
				var tmpRec = new tmpDummy({
							dummy : '<div style="font-style: '.concat(
									_style.fontStyle, "; background:",
									_style.backgroundColor, "; text-decoration:",
									_style.textDecoration, "; font-weight: ",
									_style.fontWeight, "; color:", _style.color,
									"; background-image:", _style.backgroundImage,
									";border-top:", _borders.top.width, " ",
									_borders.top.type, " ", _borders.top.color,
									";", ";border-bottom:", _borders.bottom.width,
									" ", _borders.bottom.type, " ",
									_borders.bottom.color, ";", ";border-left:",
									_borders.left.width, " ", _borders.left.type,
									" ", _borders.left.color, ";",
									";border-right:", _borders.right.width, " ",
									_borders.right.type, " ", _borders.right.color,
									'; line-height: 52px;">AaBbCcZz</div>')
						});
				dummyStore.removeAll();
				dummyStore.insert(0, tmpRec);
			}
			setTimeout(function() {
						formatPreview.refresh()
					}, 1);
			_pre = {};
			for (var i in toEdit) {
				_pre[i] = _tmpRule[i] = toEdit[i]
			}
		} else {
			mainMenu.select(0, false, false);
			chooseMenu(mainMenu, 0, "", "")
		}
		previewPanel.show();
		if (!_ai_main) {
			_ai_main = 0
		}
}
dev.report.util.extend(dev.report.base.dlg.ConditionalFormatting, dev.report.base.dlg.Dialog);