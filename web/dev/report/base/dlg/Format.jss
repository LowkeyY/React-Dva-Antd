Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.Format =  function(item, ev, addFn, preFmt) {
		this.id = "wFormatCells_dlg_wnd";
		var that = this;
		var _fromDlgF = false;
		var _fontToDisable = false;
		if (dev.report.base.app.environment.inputMode === dev.report.base.grid.GridMode.DIALOG) {
			_fromDlgF = true
		} else {
			dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		var selCoord = dev.report.base.app.environment.selectedCellCoords;
		var env = dev.report.base.app.environment, rngStartCoord = env.lastRangeStartCoord, rngEndCoord = env.lastRangeEndCoord;
		var activeContainers = {};
		function setContainers(elements) {
			for (var c in activeContainers) {
				//delete that.containers[c]
			}
			activeContainers = {};
			for (var nc in elements) {
			//	that.containers[nc] = elements[nc];
				activeContainers[nc] = nc
			}
		}
		var formatCellPreConf = dev.report.base.app.activePane.getRangeStyle([
						rngStartCoord[0], rngStartCoord[1], rngEndCoord[0],
						rngEndCoord[1]], {
					backgroundColor : "",
					fontWeight : "",
					fontFamily : "",
					textDecoration : "",
					fontSize : "",
					fontStyle : "",
					color : "",
					textAlign : "",
					verticalAlign : "",
					textIndent : "",
					whiteSpace : "",
					direction : "",
					backgroundImage : ""
				});
		var _preFont = {
			fontWeight : formatCellPreConf.fontWeight,
			fontFamily : formatCellPreConf.fontFamily,
			textDecoration : formatCellPreConf.textDecoration,
			fontSize : formatCellPreConf.fontSize,
			fontStyle : formatCellPreConf.fontStyle,
			color : formatCellPreConf.color
		};
		var _preAlignment = {
			textAlign : formatCellPreConf.textAlign,
			verticalAlign : formatCellPreConf.verticalAlign,
			textIndent : formatCellPreConf.textIndent,
			whiteSpace : formatCellPreConf.whiteSpace,
			direction : formatCellPreConf.direction
		};
		var _preFill = {
			backgroundColor : formatCellPreConf.backgroundColor,
			backgroundImage : formatCellPreConf.backgroundImage
		};
		var initStateCF = {};
		if (item == "fromConditionalFormatting") {
			_preFont = {
				fontWeight : preFmt[1] ? preFmt[1].fontWeight : "",
				fontFamily : preFmt[1] ? preFmt[1].fontFamily : "",
				textDecoration : preFmt[1] ? preFmt[1].textDecoration : "",
				fontSize : preFmt[1] ? preFmt[1].fontSize : "",
				fontStyle : preFmt[1] ? preFmt[1].fontStyle : "",
				color : preFmt[1] ? preFmt[1].color : ""
			};
			initStateCF.preFont = _preFont;
			_preAlignment = {
				textAlign : preFmt[1] ? preFmt[1].textAlign : "",
				verticalAlign : preFmt[1] ? preFmt[1].verticalAlign : "",
				textIndent : preFmt[1] ? preFmt[1].textIndent : "",
				whiteSpace : preFmt[1] ? preFmt[1].whiteSpace : "",
				direction : preFmt[1] ? preFmt[1].direction : ""
			};
			initStateCF.preAlignment = _preAlignment;
			_preFill = {
				backgroundColor : preFmt[1] ? preFmt[1].backgroundColor : "",
				backgroundImage : preFmt[1] ? preFmt[1].backgroundImage : ""
			};
			initStateCF.preFill = _preFill;
			var _preBorders = preFmt[2] ? preFmt[2] : "";
			initStateCF.preBorders = _preBorders;
			var _preFormat = preFmt[0] ? preFmt[0] : "";
			var _preProtection = preFmt[3]
		} else {
			if (item == "fromPageSetup") {
				_preFont = {
					fontWeight : preFmt.fontWeight,
					fontFamily : preFmt.fontFamily,
					textDecoration : preFmt.textDecoration,
					fontSize : preFmt.fontSize,
					fontStyle : preFmt.fontStyle,
					color : preFmt.color
				};
				initStateCF.preFont = _preFont
			}
		}
		var fontHolder = new Ext.Panel({
					id : "font",
					title : "Font".localize(),
					items : [{}]
				});
		var numberHolder = new Ext.Panel({
					id : "number",
					title : "Number".localize(),
					items : [{}],
					fbar : new Ext.Toolbar({
								items : [{}],
								hidden : true,
								style : "margin-bottom: 1px; margin-right: 10px;"
							})
				});
		var alignmentHolder = new Ext.Panel({
					id : "alignment",
					title : "Alignment".localize(),
					items : [{}]
				});
		var borderHolder = new Ext.Panel({
					id : "border",
					title : "Border".localize(),
					items : [{}]
				});
		var fillHolder = new Ext.Panel({
					id : "fill",
					title : "Fill".localize(),
					items : [{}]
				});
		var protectionHolder = new Ext.Panel({
					id : "protection",
					title : "Protection".localize(),
					items : [{}]
				});
		var fontPann;
		var numberPann;
		var alignmentPann;
		var borderPann;
		var fillPann;
		var protectionPann;
		var isFromOther = false;
		var components = {
			number : false,
			alignment : false,
			font : false,
			border : false,
			fill : false,
			protection : false
		};
		var tabs = new Ext.TabPanel({
			region : "center",
			xtype : "tabpanel",
			margins : "3 3 3 0",
			id : "wFmtCells_tabs_tbp",
			layoutOnTabChange : true,
			activeTab : 0,
			baseCls : "x-plain",
			defaults : {
				autoScroll : false,
				bodyStyle : "background-color: transparent;"
			},
			items : [numberHolder, alignmentHolder, fontHolder, borderHolder,
					fillHolder, protectionHolder],
			listeners : {
				tabchange : function(el, e) {
					if (!components[e.id]) {
						switch (e.id) {
							case "font" :
								var fcb = function(fontPan) {
									fontPann = fontPan;
									fontHolder.removeAll();
									fontHolder.add(fontPan);
									fontHolder.doLayout()
								};
								using("dev.report.base.dlg.format.Font");
								var font1=new dev.report.base.dlg.format.Font(
											fcb,
											_preFont,
											_fontToDisable,
											false,
											300,
											!!(item == "fromConditionalFormatting")
								);
								break;
							case "number" :
								var ncb = function(numberPan, clrBtn) {
									numberPann = numberPan;
									numberHolder.removeAll();
									numberHolder.add(numberPan);
									if (clrBtn) {
										var fbar = numberHolder
												.getFooterToolbar();
										fbar.removeAll();
										fbar.add(clrBtn);
										fbar.show();
										fbar.doLayout()
									}
									numberHolder.doLayout()
								};
								if (item == "fromConditionalFormatting") {
									using("dev.report.base.dlg.format.Numbers");
									var num=new dev.report.base.dlg.format.Numbers(ncb, _preFormat, false,
															isFromOther, 100,
															setContainers, true);
								} else {
									using("dev.report.base.dlg.format.Numbers");
									var num=new dev.report.base.dlg.format.Numbers(ncb, _preFormat, false,
															isFromOther, 100,
															setContainers);
								}
								break;
							case "alignment" :
								var acb = function(alignmentPan) {
									alignmentPann = alignmentPan;
									alignmentHolder.removeAll();
									alignmentHolder.add(alignmentPan);
									alignmentHolder.doLayout()
								};
								using("dev.report.base.dlg.format.Alignment");
								var alignment=new dev.report.base.dlg.format.Alignment(acb, _preAlignment, false, 200);
								break;
							case "border" :
								var bcb = function(borderPan) {
									borderPann = borderPan;
									borderHolder.removeAll();
									borderHolder.add(borderPan);
									borderHolder.doLayout()
								};
								using("dev.report.base.dlg.format.Border");
								if (item == "fromConditionalFormatting") {
									var border=new dev.report.base.dlg.format.Border(
										bcb, _preBorders, false,
															isFromOther, 400,
															true
									);
								} else {
									var border=new dev.report.base.dlg.format.Border(
										bcb, false, false,
															isFromOther, 400
									);
								}
								break;
							case "fill" :
								var flcb = function(fillPan) {
									fillPann = fillPan;
									fillHolder.removeAll();
									fillHolder.add(fillPan);
									fillHolder.doLayout()
								};
								using("dev.report.base.dlg.format.Fill");
								if (item == "fromConditionalFormatting") {
									var fill=new dev.report.base.dlg.format.Fill(flcb, _preFill, false,
															true, 500, true);
								} else {
									var fill=new dev.report.base.dlg.format.Fill(flcb, _preFill, false,
															false, 500);
								}
								break;
							case "protection" :
								var pcb = function(protectionPan) {
									protectionPann = protectionPan;
									protectionHolder.removeAll();
									protectionHolder.add(protectionPan);
									protectionHolder.doLayout()
								};
								using("dev.report.base.dlg.format.Protection");
								if (item == "fromConditionalFormatting") {
									var protection=new dev.report.base.dlg.format.Protection(pcb, _preProtection, true,
															600);
								} else {
									var protection=new dev.report.base.dlg.format.Protection(pcb, false, false, 600);
								}
								break
						}
						components[e.id] = true
					}
					setTimeout(function() {
						var toSet = {};
						if (e.id != "number") {
							toSet[e.id] = e;
							if (item == "fromConditionalFormatting"
									&& Ext.getCmp("CLR-" + e.id)) {
								toSet.clrBtnPan = Ext.getCmp("CLR-" + e.id)
										.getFooterToolbar()
							}
						} else {
							var ai = Ext.getCmp("main_format_content");
							if (ai) {
								toSet[(ai.layout.activeItem)
										? ai.layout.activeItem.id
										: ai.layout.container.items.items[0].id] = ai.layout.activeItem
										|| ai.layout.container.items.items[0]
							}
							if (item == "fromConditionalFormatting") {
								toSet.clrBtnPan = e.getFooterToolbar()
							}
						}
						setContainers(toSet)
					}, 1)
				}
			}
		});
		function applyFormatting() {
			var fontFormat = {};
			var alignFormat = {};
			var fillFormat = {};
			var borderFormat = {};
			var numberFormat;
			var protectionFormat = null;
			function getFont(val) {
				fontFormat = val
			}
			function getAlignment(val) {
				alignFormat = val
			}
			function getFill(val) {
				fillFormat = val
			}
			function getBorder(val) {
				borderFormat = val
			}
			function getNumber(val) {
				numberFormat = val
			}
			function getProtection(val) {
				protectionFormat = val
			}
			var bgColorT = "";
			var formatToSet = {};
			if (components.font) {
				fontPann.fireEvent("doFontSelect", getFont);
				for (var fnt in fontFormat) {
					formatToSet[fnt] = fontFormat[fnt]
				}
			}
			if (components.alignment) {
				alignmentPann.fireEvent("doSelectAlignment", getAlignment);
				for (var aln in alignFormat) {
					formatToSet[aln] = alignFormat[aln]
				}
			}
			if (components.fill) {
				fillPann.fireEvent("formatFill", getFill);
				for (var fil in fillFormat) {
					formatToSet[fil] = fillFormat[fil]
				}
				if (formatToSet.backgroundColor == "#-1-1-1") {
					formatToSet.backgroundColor = "";
					bgColorT = "#-1-1-1"
				}
			}
			if (item == "fromConditionalFormatting") {
				if (!components.font) {
					for (var fnt in initStateCF.preFont) {
						formatToSet[fnt] = initStateCF.preFont[fnt]
					}
				}
				if (!components.fill) {
					for (var fill in initStateCF.preFill) {
						formatToSet[fill] = initStateCF.preFill[fill]
					}
				}
				if (!components.alignment) {
					for (var al in initStateCF.preAlignment) {
						formatToSet[al] = initStateCF.preAlignment[al]
					}
					if (formatToSet.backgroundColor == "#-1-1-1") {
						formatToSet.backgroundColor = "";
						bgColorT = "#-1-1-1"
					}
				}
				var cellFormattingString;
				if (components.border) {
					borderPann.fireEvent("doFormatBorders", getBorder);
					for (var brd in borderFormat) {
						formatToSet[brd] = borderFormat[brd]
					}
				} else {
					for (var brd in initStateCF.preBorders) {
						formatToSet[brd] = initStateCF.preBorders[brd]
					}
				}
				if (components.number) {
					numberPann.fireEvent("doFormatNumber", getNumber);
					cellFormattingString = numberFormat
				}
				if (components.protection) {
					protectionPann.fireEvent("doLock", getProtection)
				}
				var FCtoCF = [formatToSet, cellFormattingString,
						protectionFormat];
				addFn(FCtoCF);
				that.win.close()
			} else {
				if (item == "fromPageSetup") {
					var FCtoPS = {
						fontFamily : fontFormat.fontFamily,
						textDecoration : fontFormat.textDecoration,
						fontWeight : fontFormat.fontWeight,
						fontSize : fontFormat.fontSize,
						fontStyle : fontFormat.fontStyle,
						color : fontFormat.color
					};
					that.win.close();
					addFn(FCtoPS)
				} else {
					if (components.number) {
						numberPann.fireEvent("doFormatNumber")
					}
					if (components.border) {
						borderPann.fireEvent("doFormatBorders")
					}
					if (components.protection) {
						protectionPann.fireEvent("doLock")
					}
					for (var e in formatToSet) {
						if (!formatToSet[e] || formatToSet[e] == ""
								|| formatToSet[e] == formatCellPreConf[e]) {
							delete formatToSet[e]
						}
					}
					if (bgColorT == "#-1-1-1") {
						formatToSet.backgroundColor = ""
					}
					dev.report.base.style.set(formatToSet);
					that.win.close()
				}
			}
		}
		this.win = new Ext.Window({
			id : "wFormatCells_dlg_wnd",
			title : "Format Cells".localize(),
			closable : true,
			autoDestroy : true,
			plain : true,
			constrain : true,
			cls : "default-format-window",
			modal : true,
			resizable : false,
			animCollapse : false,
			width : 475,
			height : 500,
			layout : "fit",
			items : [tabs],
			onEsc : Ext.emptyFn,
			listeners : {
				beforedestroy : function() {
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
					//that.activate()
				},
				close : function() {
					if (!_fromDlgF) {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
					}
					dev.report.base.app.activeSheet._defaultSelection.getCursorField().refresh();
					if (item == "fromPageSetup") {
						return false
					}
				}
			},
			buttons : [new Ext.Button({
								text : "OK".localize(),
								tabIndex : 1001,
								id : "wFormatCells_ok_btn",
								handler : function() {
									applyFormatting();
									that.win.close()
								}
							}),  new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 1002,
								id : "wFormatCells_cancel_btn",
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		if (item == "formatCellsBorders") {
			tabs.setActiveTab("border")
		}
		if (item == "fromConditionalFormatting") {
			tabs.remove("alignment");
			isFromOther = true;
			_fontToDisable = {
				effects : true,
				size : true,
				type : true
			}
		}
		if (item == "fromPageSetup") {
			tabs.remove("protection");
			tabs.remove("number");
			tabs.remove("alignment");
			tabs.remove("border");
			tabs.remove("fill")
		}
		//this.setContext();
		this.win.show(this)
}
