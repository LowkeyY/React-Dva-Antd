
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.format");
dev.report.base.dlg.format.Fill = function(callback, _pre, toDisable, fromCF,
		tabOffset, displayClear) {
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
	var _bgImClicked = false;
	var _nfbtn = true;
	var isFillTrue = false;
	if (!_pre.backgroundColor) {
		_pre.backgroundColor = ""
	}
	var backgroundColorValue = _pre.backgroundColor;
	if (!backgroundColorValue || backgroundColorValue == "") {
		backgroundColorValue = "rgb(-1, -1, -1)"
	}
	if (backgroundColorValue.charAt(0) == "#") {
		var r = HexToR(backgroundColorValue);
		var g = HexToG(backgroundColorValue);
		var b = HexToB(backgroundColorValue);
		backgroundColorValue = "rgb(".concat(r, ",", g, ",", b, ")")
	}
	backgroundColorValue = rgbConvert(backgroundColorValue);
	if (backgroundColorValue != "#-1-1-1") {
		_nfbtn = false;
		isFillTrue = true
	}
	if (_pre.backgroundImage) {
		var bgImageF = _pre.backgroundImage
	} else {
		var bgImageF = "none"
	}
	var patternList = [
			["pattern_0",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_0.png">'],
			["pattern_1",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_1.png">'],
			["pattern_2",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_2.png">'],
			["pattern_3",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_3.png">'],
			["pattern_4",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_4.png">'],
			["pattern_5",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_5.png">'],
			["pattern_6",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_6.png">'],
			["pattern_7",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_7.png">'],
			["pattern_8",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_8.png">'],
			["pattern_9",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_9.png">'],
			["pattern_10",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_10.png">'],
			["pattern_11",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_11.png">'],
			["pattern_12",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_12.png">'],
			["pattern_13",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_13.png">'],
			["pattern_14",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_14.png">'],
			["pattern_15",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_15.png">'],
			["pattern_16",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_16.png">'],
			["pattern_17",
					'<img src = "/dev/report/res/img/dialog/format_cells/patterns/pattern_17.png">']];
	var patternListStore = new Ext.data.SimpleStore({
				fields : ["patt_name", "patt_path"],
				data : patternList
			});
	var noFillButton = new Ext.Button({
				id : "wFmtCellsFill_noColor_btn",
				disabled : false,
				enableToggle : true,
				tabIndex : 1 + tabOffset,
				ctCls : dev.report.kbd.tags.NO_ENTER,
				pressed : _nfbtn,
				toggleHandler : noFillHandler,
				minWidth : 180,
				text : "No Color".localize(),
				style : "margin-top: 10px; margin-bottom: 10px;"
			});
	var patternName = 0;
	function pickColor(p, iHexa) {
		alert(iHexa)
	}
	function selectFillColor(dView, index, node, ev) {
		fillColor = "".concat("#", index);
		tmpRec = new fillFieldChange({
			style : "<div style='padding: 0px; width: 410; height: 50px; color: #000000; font-size: 9pt; border: none; background-color: "
					.concat(fillColor, "; background-image: ", bgImageF,
							"; background-repeat: repeat-x repeat-y;'></div>")
		});
		fillSampleFieldStore.removeAll();
		fillSampleFieldStore.insert(0, tmpRec);
		fillSampleView.refresh();
		noFillButton.toggle(false);
		isFillTrue = true
	}
	var fillColor = backgroundColorValue;
	var fillFieldChange = new Ext.data.Record.create([{
				name : "style"
			}]);
	var cPalette = new Ext.ColorPalette({
		value : "",
		allowReselect : true,
		colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
		cls : "wide-color-palette"
	});
	function noFillHandler() {
		if (isFillTrue) {
			fillColor = "#-1-1-1";
			tmpRec = new fillFieldChange({
				style : "<div style='padding: 0px; width: 410; height: 50px; color: #000000; font-size: 9pt; border: none; background-color: "
						.concat(fillColor, "; background-image: ", bgImageF,
								"; background-repeat: repeat-x repeat-y;'></div>")
			});
			fillSampleFieldStore.insert(0, tmpRec);
			deleRec = fillSampleFieldStore.getAt(1);
			fillSampleFieldStore.remove(deleRec);
			fillSampleView.refresh();
			fillSampleFieldStore.removeAll();
			isFillTrue = false
		}
	}
	var fillSampleField = [["<div style='padding: 0px; width: 410; height: 50px; color: #000000; font-size: 9pt; border: none; background-color: "
			.concat(fillColor, "; background-image: ", bgImageF,
					"; background-repeat: repeat-x repeat-y;'></div>")]];
	var fillSampleFieldStore = new Ext.data.SimpleStore({
				fields : ["style"],
				data : fillSampleField
			});
	var style = 'padding: 0px; image: url("asdfasdfasd");';
	var fillSampleView = new Ext.DataView({
				itemSelector : ".border-chooser",
				style : "overflow:auto",
				width : 415,
				height : 50,
				singleSelect : true,
				store : fillSampleFieldStore,
				tpl : new Ext.XTemplate(
						'<div class="fill-sample"><tpl for=".">', "{style}",
						"</tpl></div>")
			});
	function setCellPattern(dView, index, node, ev) {
		patternName = index;
		_bgImClicked = true;
		if (index == 0) {
			patternName = "";
			bgImageF = "none"
		} else {
			bgImageF = "url(/dev/report/res/img/dialog/format_cells/patterns/pattern_"
					.concat(patternName, ".png)")
		}
		tmpRec = new fillFieldChange({
			style : "<div style='padding: 0px; width: 410; height: 50px; color: #000000; font-size: 9pt; border: none; background-color: "
					.concat(fillColor, "; background-image: ", bgImageF,
							"; background-repeat: repeat-x repeat-y;'></div>")
		});
		fillSampleFieldStore.removeAll();
		fillSampleFieldStore.insert(0, tmpRec);
		fillSampleView.refresh()
	}
	var patternDataView = new Ext.DataView({
		id : "wFmtCellsFill_pattern_dv",
		store : patternListStore,
		tpl : new Ext.XTemplate(
				'<div class="pattern_selector_field"><tpl for=".">',
				'<div class="thumb-wrap" style="display: inline; padding: 5px 3px 0px 3px; vertical-align: middle; margin: 0px;">',
				'<div class="thumb" style="display: inline;">',
				'<img width="16" height"16" src="/dev/report/res/img/dialog/format_cells/patterns/{patt_name}.png" /></div></div>',
				"</tpl></div>"),
		autoHeight : true,
		width : 132,
		multiSelect : false,
		singleSelect : true,
		selectOnFocus : true,
		itemSelector : "div.thumb-wrap",
		overClass : "x-view-over",
		listeners : {
			click : {
				fn : setCellPattern,
				scope : this
			}
		}
	});
	var colrItem = new Ext.ColorPalette({
		colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
		cls : "wide-color-palette",
		ctCls : "wide-color-palette",
		handler : selectFillColor,
		scope : this
	});
	var colorPanell = new Ext.Panel({
				layout : "form",
				baseCls : "x-plain",
				border : false,
				autoHeight : true,
				frame : false,
				items : [colrItem]
			});
	var patternTemplate = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="pattern_selector"><img src="/dev/report/res/img/dialog/format_cells/patterns/{patt_name}.png" valign="middle"/></div>',
			"</tpl>");
	var fillTab = new Ext.Panel({
		baseCls : "x-title-f",
		labelWidth : 100,
		labelAlign : "left",
		frame : false,
		bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
		header : false,
		monitorValid : true,
		autoHeight : true,
		autoWidth : true,
		autoScroll : false,
		listeners : {
			formatFill : function(callback) {
				if (!fromCF) {
					if (!_bgImClicked) {
						bgImageF = ""
					}
				}
				if (!fromCF) {
					if (fillColor != backgroundColorValue) {
						var fcol = fillColor
					} else {
						var fcol = ""
					}
				} else {
					var fcol = fillColor
				}
				var format = {
					backgroundColor : fcol,
					backgroundImage : bgImageF
				};
				callback(format)
			}
		},
		items : [new Ext.Panel({
			id : "fillTab",
			layout : "column",
			baseCls : "x-plain",
			border : false,
			frame : false,
			autoScroll : false,
			items : [{
				columnWidth : 0.5,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [{
							html : "Background color".localize().concat(":"),
							baseCls : "x-plain"
						}, noFillButton, colorPanell, new Ext.Button({
							disabled : false,
							enableToggle : false,
							tabIndex : 3 + tabOffset,
							ctCls : dev.report.kbd.tags.NO_ENTER,
							minWidth : 180,
							text : "More Colors".localize().concat("..."),
							style : "margin-top: 10px; margin-bottom: 10px;",
							listeners : {
								click : {
									fn : function() {
										using("dev.report.base.dlg.format.MoreColors");
										var moreColor=new dev.report.base.dlg.format.MoreColors(backgroundColorValue,
																selectFillColor);
									},
									scope : this
								}
							}
						})]
			}, {
				columnWidth : 0.5,
				layout : "form",
				xtype : "fieldset",
				bodyStyle : "color: #000000; font-size: 9pt; background-color: transparent;",
				autoHeight : true,
				border : false,
				frame : false,
				items : [{
							html : "Pattern style".localize().concat(":"),
							baseCls : "x-plain",
							style : "margin-bottom: 10px;"
						}, patternDataView]
			}]
		}), {
			bodyStyle : "margin-top: 60px; #margin-top: 40px; padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
			baseCls : "x-plain"
		}, {
			bodyStyle : "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
			border : true,
			autoHeight : true,
			xtype : "fieldset",
			layout : "form",
			frame : false,
			title : "Sample".localize(),
			items : [fillSampleView]
		}]
	});
	var _clear = function() {
		noFillButton.toggle(true);
		patternDataView.select(0, false, false);
		patternDataView.clearSelections(true);
		fillColor = false;
		bgImageF = false
	};
	if (displayClear) {
		var clearBtn = new Ext.Button({
					disabled : false,
					text : "Clear".localize(),
					handler : _clear,
					tabIndex : 12 + tabOffset,
					ctCls : dev.report.kbd.tags.NO_ENTER
				});
		var clrPanel = new Ext.Panel({
					baseCls : "x-plain",
					id : "CLR-fill",
					fbar : new Ext.Toolbar({
								items : [clearBtn]
							})
				});
		fillTab.add(clrPanel);
		fillTab.doLayout()
	}
	callback(fillTab)
};