
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.format");
dev.report.base.dlg.format.Font = function(callback, _pre, toDisable, _noPadding,
		tabOffset, displayClear) {
	var format = {
		fontFamily : "",
		fontStyle : "",
		fontSize : "",
		fontWeight : "",
		textDecoration : "",
		color : ""
	};
	var fontType = "font-family: Arial, sans-serif; ";
	var fontColor = "color: #000000; ";
	var fontStyle = "font-style: normal; ";
	var fontEffects = "";
	var fontEffects1 = "";
	var fontEffects2 = "";
	var fontEffects3 = "";
	var fontSize = "10pt;";
	var hasEffects = false;
	var fontTypeData = [['宋体', '宋体'],
			['黑体', '黑体'],
			['隶书', '隶书'],
			['楷体_GB2312', '楷体'],
			["Arial", "Arial,sans-serif"],
			["Arial Black", "Arial Black,sans-serif"],
			["Comic Sans MS", "Comic Sans MS,cursive"],
			["Courier New", "Courier New,monospace"],
			["Garamond", "Garamond,serif"], ["Georgia", "Georgia,serif"],
			["Lucida Console", "Lucida Console,monospace"],
			["Lucida Sans", "Lucida Sans,monospace"],
			["Palantino Linotype", "Palantino Linotype,serif"],
			["Tahoma", "Tahoma,sans-serif"],
			["Times New Roman", "Times New Roman,serif"],
			["Trebuchet MS", "Trebuchet MS,sans-serif"],
			["Verdana", "Verdana,sans-serif"]];
	var fontTypeDataChart = [["Arial", "Arial"],
			["Arial Black", "Arial Black"], ["Arial Narrow", "Arial Narrow"],
			["Calibri", "Calibri"], ["Comic Sans MS", "Comic Sans MS"],
			["Georgia", "Georgia"], ["Impact", "Impact"],
			["Lucida Console", "Lucida Console"],
			["Monotype Corsiva", "Monotype Corsiva"],
			["Sans Serif", "Sans Serif"], ["Tahoma", "Tahoma"],
			["Times New Roman", "Times New Roman"],
			["Trebuchet MS", "Trebuchet MS"], ["Verdana", "Verdana"]];
	var fontTypeFinalData;
	if (_noPadding) {
		var panelStyle = "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;";
		fontTypeFinalData = fontTypeDataChart
	} else {
		var panelStyle = "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;";
		fontTypeFinalData = fontTypeData
	}
	var fontStyleList = [["regular", "Regular".localize()],
			["bold", "Bold".localize()], ["italic", "Italic".localize()],
			["bold italic", "Bold Italic".localize()]];
	var fontSizeList = [["7"], ["8"], ["9"], ["10"], ["11"], ["12"], ["14"],
			["16"], ["18"], ["20"], ["24"], ["26"], ["30"], ["32"], ["48"],
			["72"]];
	var fontTypeStore = new Ext.data.SimpleStore({
				fields : ["font_type", "font_type_desc"],
				data : fontTypeFinalData
			});
	var fontStyleStore = new Ext.data.SimpleStore({
				fields : ["font_style", "font_style_desc"],
				data : fontStyleList
			});
	var fontSizeStore = new Ext.data.ArrayStore({
				fields : ["font_size"],
				data : fontSizeList
			});
	var fontPreviewData = [['<div style="'.concat(fontType, fontColor,
			fontStyle, fontEffects, fontSize, '">AaBbCcYyZz</div>')]];
	var fontPreviewStore = new Ext.data.SimpleStore({
				fields : ["font"],
				data : fontPreviewData
			});
	var dummyRecord = new Ext.data.Record.create([{
				name : "dummy"
			}]);
	var refreshPreview = function() {
		var tmpRec = new dummyRecord({
					dummy : '<div style="'.concat(fontType, fontColor,
							fontStyle, fontEffects, fontSize,
							'">AaBbCcYyZz</div>')
				});
		fontPreviewStore.insert(0, tmpRec);
		deleRec = fontPreviewStore.getAt(1);
		fontPreviewStore.remove(deleRec);
		fontDataView.refresh()
	};
	var fontTypeDV = new Ext.DataView({
				id : "wFmtCells_ftype_dv",
				itemSelector : ".DVSelector",
				style : "overflow:auto",
				overClass : "x-view-over",
				autoWidth : true,
				height : 100,
				singleSelect : true,
				border : true,
				listeners : {
					click : {
						fn : function(dView, index, node, ev) {
							fontType = "font-family:".concat(
									fontTypeFinalData[index][0], "; ");
							format.fontFamily = fontTypeFinalData[index][0];
							refreshPreview()
						},
						scope : this
					}
				},
				bodyStyle : "margin-bottom: 15px;",
				store : fontTypeStore,
				cls : "listDataViewSelect",
				tpl : new Ext.XTemplate(
						'<div class="border-list"><tpl for=".">',
						'<div class="DVSelector">', "{font_type_desc}</div>",
						"</tpl></div>")
			});
	var fontStyleDV = new Ext.DataView({
		id : "wFmtCells_fstyle_dv",
		itemSelector : ".DVSelector",
		style : "overflow:auto",
		overClass : "x-view-over",
		autoWidth : true,
		height : 100,
		singleSelect : true,
		border : true,
		bodyStyle : "margin-bottom: 15px;",
		store : fontStyleStore,
		cls : "listDataViewSelect",
		tpl : new Ext.XTemplate('<div class="border-list"><tpl for=".">',
				'<div class="DVSelector">', "{font_style_desc}</div>",
				"</tpl></div>"),
		listeners : {
			click : {
				fn : function(dView, index, node, ev) {
					if (index == 0) {
						fontStyle = "font-style: normal; ";
						format.fontStyle = "normal";
						format.fontWeight = "normal"
					} else {
						if (index == 1) {
							fontStyle = "font-weight: bold; ";
							format.fontWeight = "bold";
							format.fontStyle = "normal"
						} else {
							if (index == 2) {
								fontStyle = "font-style: italic; ";
								format.fontStyle = "italic";
								format.fontWeight = "normal"
							} else {
								if (index == 3) {
									fontStyle = "font-weight: bold; font-style: italic; ";
									format.fontStyle = "italic";
									format.fontWeight = "bold"
								}
							}
						}
					}
					refreshPreview()
				},
				scope : this
			}
		}
	});
	var fontSizeDV = new Ext.DataView({
		id : "wFmtCells_fsize_dv",
		itemSelector : ".DVSelector",
		style : "overflow:auto",
		overClass : "x-view-over",
		autoWidth : true,
		height : 74,
		singleSelect : true,
		border : true,
		bodyStyle : "margin-bottom: 15px;",
		store : fontSizeStore,
		listeners : {
			click : {
				fn : function(dView, index, node, ev) {
					fontSize = "font-size:".concat(fontSizeList[index], "pt; ");
					refreshPreview();
					fontSizeField.setRawValue(fontSizeList[index]);
					format.fontSize = "".concat(fontSizeField.getRawValue(),
							"pt ")
				},
				scope : this
			}
		},
		cls : "listDataViewSelect",
		tpl : new Ext.XTemplate('<div class="border-list"><tpl for=".">',
				'<div class="DVSelector">', "{font_size}</div>", "</tpl></div>")
	});
	var fontSizeField = new Ext.form.NumberField({
				name : "fontSize",
				width : 107,
				allowDecimals : false,
				value : 10,
				tabIndex : 3 + tabOffset,
				emptyText : format.fontSize,
				hideLabel : true,
				enableKeyEvents : true,
				listeners : {
					keyup : function(fld, e) {
						var tmpVal = this.getRawValue();
						fontSize = "font-size:".concat(tmpVal, "pt; ");
						refreshPreview();
						var inx = fontSizeStore.findExact("font_size", tmpVal);
						if (inx) {
							fontSizeDV.select(inx);
							var nodeEl = fontSizeDV.getSelectedNodes()[0];
							var cmpEl = fontSizeDV.getEl();
							if (nodeEl) {
								nodeEl.scrollIntoView(cmpEl)
							}
						} else {
							var nodeEl = fontSizeDV.getSelectedNodes()[0];
							if (nodeEl) {
								fontSizeDV.deselect(nodeEl)
							}
						}
						format.fontSize = "".concat(
								fontSizeField.getRawValue(), "pt ")
					}
				}
			});
	var underlineCB = new Ext.form.Checkbox({
				name : "underline",
				id : "underlineCB",
				tabIndex : 5 + tabOffset,
				boxLabel : "Underline".localize(),
				handler : function() {
					if (this.getValue()) {
						fontEffects1 = "underline"
					} else {
						fontEffects1 = ""
					}
					fontEffects = "text-decoration:".concat(fontEffects1, " ",
							fontEffects2, " ", fontEffects3, "; ");
					format.textDecoration = "".concat(fontEffects1, " ",
							fontEffects2, " ", fontEffects3);
					refreshPreview()
				},
				checked : false
			});
	var strikethroughCB = new Ext.form.Checkbox({
				name : "strikethrough",
				tabIndex : 6 + tabOffset,
				id : "strikethroughCB",
				boxLabel : "Strikethrough".localize(),
				handler : function() {
					if (this.getValue()) {
						fontEffects3 = "line-through"
					} else {
						fontEffects3 = ""
					}
					fontEffects = "text-decoration:".concat(fontEffects1, " ",
							fontEffects2, " ", fontEffects3, "; ");
					format.textDecoration = "".concat(fontEffects1, " ",
							fontEffects2, " ", fontEffects3);
					refreshPreview()
				},
				checked : false
			});
	var backToNormalCB = new Ext.form.Checkbox({
				name : "back-to-normal",
				boxLabel : "Normal font".localize(),
				hideLabel : true,
				tabIndex : 8 + tabOffset,
				handler : function() {
					if (this.getValue()) {
						underlineCB.setValue(false);
						strikethroughCB.setValue(false);
						fontTypeDV.select(0, false, false);
						fontStyleDV.select(0, false, false);
						fontSizeDV.select(3, false, false);
						fontTypeDV.fireEvent("click", fontTypeDV, 0);
						fontStyleDV.fireEvent("click", fontStyleDV, 0);
						fontSizeDV.fireEvent("click", fontSizeDV, 3);
						refreshPreview()
					}
				}
			});
	function _setupColorButton(colorBtn, color, setWidth) {
		var tmpElem = Ext.DomQuery
				.selectNode("*[id=" + colorBtn.btnEl.id + "]");
		if (format.color && format.color != "") {
			tmpElem.style.background = format.color
		} else {
			tmpElem.style.background = "#000000"
		}
		tmpElem.style.width = "80px";
		tmpElem.style.height = "15px"
	}
	var setFontColor = function(colorP, colorStr) {
		format.color = "#" + colorStr;
		_setupColorButton(btnColorFont, format.color, false);
		fontColor = "color:".concat(format.color, ";");
		refreshPreview()
	};
	var btnColorFont = new Ext.SplitButton({
		id : "wFmtCells_fcolor_btn",
		minWidth : 100,
		tabIndex : 7 + tabOffset,
		ctCls : dev.report.kbd.tags.NO_ENTER,
		menu : new Ext.menu.ColorMenu({
			colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
			cls : "wide-color-palette",
			listeners : {
				select : setFontColor,
				beforeshow : function(thisMenu) {
				}
			}
		})
	});
	var fontDataView = new Ext.DataView({
		itemSelector : ".border-field-chooser",
		style : "overflow:auto",
		autoWidth : true,
		singleSelect : true,
		store : fontPreviewStore,
		cls : "borderStyleSelect",
		tpl : new Ext.XTemplate(
				'<div class="font-sample-field"><tpl for=".">',
				'<div style="#position: absolute;  #top: 50%; #left: 50%; display: table-cell; vertical-align: middle;">',
				'<div style="#position: relative;  #top: -50%; #left: -50%; text-align: center; overflow: hidden;">',
				"{dummy}</div></div>", "</tpl></div>")
	});
	var effectsPanel = new Ext.Panel({
		bodyStyle : "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
		border : true,
		autoHeight : true,
		xtype : "fieldset",
		layout : "form",
		baseCls : "x-title-f",
		frame : false,
		title : "Effects".localize(),
		items : [new Ext.Panel({
					baseCls : "x-plain",
					items : [underlineCB, strikethroughCB]
				})]
	});
	var testPan = new Ext.Panel({
				html : "Font".localize().concat(":"),
				baseCls : "x-plain"
			});
	var colL = new Ext.Panel({
		columnWidth : 0.5,
		layout : "form",
		xtype : "fieldset",
		bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent; padding-right: 10px;",
		autoHeight : true,
		baseCls : "x-title-f",
		border : false,
		frame : false,
		items : [{
					html : "Font".localize().concat(":"),
					baseCls : "x-plain"
				}, new Ext.Panel({
							border : true,
							autoHeight : true,
							collapsible : false,
							layout : "fit",
							baseCls : "x-plain",
							items : fontTypeDV
						}), new Ext.Panel({
							bodyStyle : "margin-top: 10px;",
							baseCls : "x-plain"
						}), effectsPanel]
	});
	var fontDVHolder = new Ext.Panel({
		bodyStyle : "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
		border : true,
		autoHeight : true,
		xtype : "fieldset",
		baseCls : "x-title-f",
		layout : "form",
		frame : false,
		title : "Preview".localize(),
		items : [fontDataView]
	});
	var fsDVH = new Ext.Panel({
				border : true,
				autoHeight : true,
				collapsible : false,
				layout : "fit",
				items : [fontStyleDV]
			});
	var rcCL = new Ext.Panel({
		columnWidth : 0.5,
		layout : "form",
		xtype : "fieldset",
		bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent; padding-right: 10px;",
		autoHeight : true,
		border : false,
		frame : false,
		items : [{
					html : "Font style".localize().concat(":"),
					baseCls : "x-plain"
				}, fsDVH, {
					html : "Color".localize().concat(":"),
					baseCls : "x-plain",
					bodyStyle : "margin-top:3px; margin-bottom: 0px;"
				}, btnColorFont, {
					baseCls : "x-plain",
					bodyStyle : "margin-bottom: 3px;"
				}]
	});
	var rcCR = new Ext.Panel({
		columnWidth : 0.5,
		layout : "form",
		xtype : "fieldset",
		bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
		autoHeight : true,
		baseCls : "x-plain",
		border : false,
		frame : false,
		items : [new Ext.Panel({
							html : "Size".localize().concat(":"),
							baseCls : "x-plain"
						}), fontSizeField, new Ext.Panel({
							border : true,
							autoHeight : true,
							collapsible : false,
							layout : "fit",
							baseCls : "x-plain",
							items : [fontSizeDV]
						}), new Ext.Panel({
							baseCls : "x-plain",
							bodyStyle : "margin-top: 10px;"
						}), backToNormalCB]
	});
	var rColHold = new Ext.Panel({
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				items : [rcCL, rcCR]
			});
	var colR = new Ext.Panel({
		columnWidth : 0.5,
		layout : "form",
		xtype : "fieldset",
		bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
		autoHeight : true,
		baseCls : "x-plain",
		border : false,
		frame : false,
		items : [rColHold, fontDVHolder]
	});
	var colHold = new Ext.Panel({
				layout : "column",
				baseCls : "x-plain",
				border : false,
				frame : false,
				items : [colL, colR]
			});
	var finalPanel = new Ext.Panel({
				baseCls : "x-title-f",
				labelWidth : 100,
				labelAlign : "left",
				frame : false,
				bodyStyle : panelStyle,
				header : false,
				monitorValid : true,
				autoHeight : true,
				autoWidth : true,
				items : [colHold],
				listeners : {
					doFontPreselect : function(sel) {
					},
					doFontSelect : function(callback) {
						if (fontEffects1 == "" && fontEffects2 == ""
								&& fontEffects3 == "") {
							if (hasEffects) {
								format.textDecoration = "none"
							}
						}
						callback(format)
					},
					afterLayout : function() {
					}
				}
			});
	var _clear = function() {
		underlineCB.setValue(false);
		strikethroughCB.setValue(false);
		fontTypeDV.fireEvent("select", 0, false, false);
		fontStyleDV.fireEvent("select", 0, false, false);
		fontSizeDV.fireEvent("select", 3, false, false);
		fontTypeDV.clearSelections(true);
		fontStyleDV.clearSelections(true);
		fontSizeDV.clearSelections(true);
		setFontColor(null, "000000");
		format = {};
		refreshPreview()
	};
	if (displayClear) {
		var clearBtn = new Ext.Button({
					disabled : false,
					text : "Clear".localize(),
					handler : _clear,
					tabIndex : 10 + tabOffset,
					ctCls : dev.report.kbd.tags.NO_ENTER
				});
		var clrPanel = new Ext.Panel({
					baseCls : "x-plain",
					id : "CLR-font",
					style : "margin-top: 131px;",
					fbar : new Ext.Toolbar({
								items : [clearBtn]
							})
				});
		finalPanel.add(clrPanel);
		finalPanel.doLayout()
	}
	function rgbConvert(str) {
		str = str.replace(/rgb\(|\)/g, "").split(",");
		str[0] = parseInt(str[0], 10).toString(16).toLowerCase();
		str[1] = parseInt(str[1], 10).toString(16).toLowerCase();
		str[2] = parseInt(str[2], 10).toString(16).toLowerCase();
		str[0] = (str[0].length == 1) ? "0" + str[0] : str[0];
		str[1] = (str[1].length == 1) ? "0" + str[1] : str[1];
		str[2] = (str[2].length == 1) ? "0" + str[2] : str[2];
		return ("#" + str.join(""))
	}
	var _stil;
	if (_pre) {
		format = _pre;
		if (!toDisable.effects) {
			if (format.textDecoration == null) {
				format.textDecoration = ""
			}
			fontEffects = format.textDecoration;
			if (!fontEffects) {
				fontEffects = ""
			}
			var textDecorationGridArray = fontEffects.split(" ");
			if (textDecorationGridArray[0] == null) {
				textDecorationGridArray[0] = ""
			}
			if (textDecorationGridArray[1] == null) {
				textDecorationGridArray[1] = ""
			}
			if (textDecorationGridArray[2] == null) {
				textDecorationGridArray[2] = ""
			}
			var DGAP0 = false;
			var DGAP1 = false;
			var DGAP2 = false;
			if (textDecorationGridArray[0] == "underline") {
				DGAP0 = true
			} else {
				if (textDecorationGridArray[0] == "overline") {
					DGAP1 = true
				} else {
					if (textDecorationGridArray[0] == "line-through") {
						DGAP2 = true
					}
				}
			}
			if (textDecorationGridArray[1] == "underline") {
				DGAP0 = true
			} else {
				if (textDecorationGridArray[1] == "overline") {
					DGAP1 = true
				} else {
					if (textDecorationGridArray[1] == "line-through") {
						DGAP2 = true
					}
				}
			}
			if (textDecorationGridArray[2] == "underline") {
				DGAP0 = true
			} else {
				if (textDecorationGridArray[2] == "overline") {
					DGAP1 = true
				} else {
					if (textDecorationGridArray[2] == "line-through") {
						DGAP2 = true
					}
				}
			}
			if (DGAP0 || DGAP1 || DGAP2) {
				hasEffects = true
			}
			textDecorationGridArray = ["", "", ""];
			if (DGAP0) {
				textDecorationGridArray[0] = "underline"
			}
			if (DGAP1) {
				textDecorationGridArray[1] = "overline"
			}
			if (DGAP2) {
				textDecorationGridArray[2] = "line-through"
			}
			fontEffects1 = textDecorationGridArray[0];
			fontEffects2 = textDecorationGridArray[1];
			fontEffects3 = textDecorationGridArray[2];
			fontEffects = "text-decoration:".concat(fontEffects1, " ",
					fontEffects2, " ", fontEffects3, "; ")
		}
		function cutHex(h) {
			return (h.charAt(0) == "#") ? h.substring(1, 7) : h
		}
		function HexToR(h) {
			return parseInt((cutHex(h)).substring(0, 2), 16)
		}
		function HexToG(h) {
			return parseInt((cutHex(h)).substring(2, 4), 16)
		}
		function HexToB(h) {
			return parseInt((cutHex(h)).substring(4, 6), 16)
		}
		if (format.color) {
			if (format.color.charAt(0) == "#") {
				var r = HexToR(format.color);
				var g = HexToG(format.color);
				var b = HexToB(format.color);
				format.color = "rgb(".concat(r, ",", g, ",", b, ")")
			}
			fontColor = "color: ".concat(rgbConvert(format.color), "; ");
			format.color = rgbConvert(format.color)
		}
		if (format.fontFamily == null) {
			format.fontFamily = ""
		}
		fontType = "font-family: ".concat(format.fontFamily, "; ");
		if (format.fontSize == null) {
			format.fontSize = ""
		}
		fontSize = "font-size:".concat(format.fontSize, "; ");
		var nVal = format.fontSize.replace(/pt/, "");
		fontSizeField.setValue(nVal);
		if (!format.fontWeight) {
			format.fontWeight = ""
		}
		if (!format.fontStyle) {
			format.fontStyle = ""
		}
		if (format.fontStyle == "regular") {
			format.fontStyle = "normal"
		}
		if ((format.fontStyle == "" || format.fontStyle == "normal")
				&& (format.fontWeight == "" || format.fontWeight == "normal")) {
			fontStyle = "font-style: regular; ";
			_stil = "regular"
		} else {
			if ((format.fontStyle != "" && format.fontStyle != "normal")
					&& (format.fontWeight == "" || format.fontWeight == "normal")) {
				fontStyle = "font-style: italic; ";
				_stil = "italic"
			} else {
				if ((format.fontStyle == "" || format.fontStyle == "normal")
						&& (format.fontWeight != "" || format.fontWeight != "normal")) {
					fontStyle = "font-weight: bold; ";
					_stil = "bold"
				} else {
					if ((format.fontStyle != "" || format.fontStyle == "normal")
							&& (format.fontWeight != "" || format.fontWeight != "normal")) {
						fontStyle = "font-weight: bold; font-style: italic; ";
						_stil = "bold italic"
					}
				}
			}
		}
	}
	setTimeout(function() {
				_setupColorButton(btnColorFont, format.color, false);
				refreshPreview();
				if (format.fontSize == "") {
					fontSizeField.setValue("10")
				}
				if (_pre) {
					format.fontSize = _pre.fontSize.replace(/pt/, "");
					var nVal = format.fontSize.replace(/pt/, "");
					var inx = fontSizeStore.find("font_size", nVal);
					fontSizeDV.select(inx);
					var nodeEl = fontSizeDV.getSelectedNodes()[0];
					var cmpEl = fontSizeDV.getEl();
					if (nodeEl) {
						nodeEl.scrollIntoView(cmpEl)
					}
					inx = fontStyleStore.find("font_style", _stil);
					fontStyleDV.select(inx);
					inx = fontTypeStore.find("font_type", format.fontFamily);
					fontTypeDV.select(inx);
					var nodeEl = fontTypeDV.getSelectedNodes()[0];
					var cmpEl = fontTypeDV.getEl();
					if (nodeEl) {
						nodeEl.scrollIntoView(cmpEl)
					}
					if (!toDisable.effects) {
						if (fontEffects1 == "underline") {
							underlineCB.setValue(true)
						}
						if (fontEffects2 == "overline") {
							overlineCB.setValue(true)
						}
						if (fontEffects3 == "line-through") {
							strikethroughCB.setValue(true)
						}
					}
				}
			}, 20);
	if (toDisable.effects) {
		setTimeout(function() {
					var pItems = effectsPanel.items.items;
					for (var i = 0; i < pItems.length; i++) {
						pItems[i].disable()
					}
					effectsPanel.disable();
					strikethroughCB.disable();
					underlineCB.disable()
				}, 30)
	}
	if (toDisable.size) {
		setTimeout(function() {
					var pItems = rcCR.items.items;
					for (var i = 0; i < pItems.length; i++) {
						pItems[i].disable()
					}
					rcCR.disable();
					fontSizeField.setValue("")
				}, 30)
	}
	if (toDisable.style) {
		setTimeout(function() {
					var pItems = fsDVH.items.items;
					for (var i = 0; i < pItems.length; i++) {
						pItems[i].disable()
					}
					fsDVH.disable()
				}, 30)
	}
	if (toDisable.font) {
		setTimeout(function() {
					var pItems = colL.items.items;
					for (var i = 0; i < pItems.length; i++) {
						pItems[i].disable()
					}
					colL.disable()
				}, 30)
	}
	callback(finalPanel)
};