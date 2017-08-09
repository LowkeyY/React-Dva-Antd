

Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");
dev.report.base.app.Handlers =function() {
	var that=this;
	this.onFormatDropdownSelect = function(item, record, index) {
		dev.report.base.app.gridBlurObserver.notify(this);
		var styleType = that.getToolbarItemID(item.getId());
		if (styleType != null) {
			dev.report.base.style.setFromBar(styleType, item.getValue())
		}
		Ext.get("wToolbar_fontSize_cmb").blur();
		dev.report.base.general.setInputMode(dev.report.base.app.lastInputMode);
		dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
	};
	this.onFormatDropdownFocus = function(item) {
		dev.report.base.app.gridBlurObserver.notify(this);
		dev.report.base.app.lastInputMode = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.CNTRL);
		dev.report.base.app.switchContextObserver
				.subscribe(dev.report.base.app.updateBar, this)
	};
	this.onFormatDropdownBlur = function(item) {
		var oldFontSize = dev.report.base.app.environment.selectedCell.style.fontSize;

		console.log("oldFontSize:"+oldFontSize);
		if ((oldFontSize != "") && (oldFontSize.indexOf("pt") != -1)) {
			oldFontSize = oldFontSize.substr(0, oldFontSize.indexOf("pt"))
		} else {
			oldFontSize = dev.report.base.app.cnfDefaultFontSize
		}
		if (oldFontSize != item.getRawValue()) {
			var styleType = that.getToolbarItemID(item.getId());
			if (styleType != null) {
				dev.report.base.style.setFromBar(styleType, item.getRawValue())
			}
		}
		Ext.get("wToolbar_fontSize_cmb").blur();
		dev.report.base.general.setInputMode(dev.report.base.app.lastInputMode);
		dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
		dev.report.base.app.switchContextObserver.unsubscribe(dev.report.base.app.updateBar)
	};
	this.onFormatDropdownChange = function(item, newValue, oldValue) {
		var styleType = that.getToolbarItemID(item.getId());
		if (styleType != null) {
			dev.report.base.style.setFromBar(styleType, newValue)
		}
		Ext.get("wToolbar_fontSize_cmb").blur();
		dev.report.base.general.setInputMode(dev.report.base.app.lastInputMode);
		dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
	};
	this.onFormatDropdownSpecKey = function(item, e) {
		var key = dev.report.base.app.lastKeyPressed;
		if (key == e.ENTER || key == e.TAB) {
			var oldFontSize = dev.report.base.app.environment.selectedCell.style.fontSize;
			if ((oldFontSize != "") && (oldFontSize.indexOf("pt") != -1)) {
				oldFontSize = oldFontSize.substr(0, oldFontSize.indexOf("pt"))
			} else {
				oldFontSize = dev.report.base.app.cnfDefaultFontSize
			}
			if (oldFontSize != item.getRawValue()) {
				var styleType = that.getToolbarItemID(item.getId());
				if (styleType != null) {
					dev.report.base.style.setFromBar(styleType, item.getRawValue())
				}
			}
			Ext.get("wToolbar_fontSize_cmb").blur();
			dev.report.base.general.setInputMode(dev.report.base.app.lastInputMode);
			dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
		}
	};
	this.updateBar = function() {
		Ext.getCmp("wToolbar_fontName_cmb").collapse();
		Ext.getCmp("wToolbar_fontSize_cmb").collapse();
		dev.report.base.general.setInputMode(dev.report.base.app.lastInputMode);
		dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
	};
	this.getToolbarItemID = function(itemName) {
		var toolbarItems = {
			wToolbar_bold_btn : 1,
			wToolbar_italic_btn : 2,
			wToolbar_uLine_btn : 3,
			wToolbar_alignLeft_btn : 4,
			wToolbar_alignCenter_btn : 5,
			wToolbar_alignRight_btn : 6,
			wToolbar_fontSize_cmb : 7,
			wToolbar_fontName_cmb : 8,
			wToolbar_bgColor_mn : 9,
			wToolbar_bgColor_btn : 9,
			wToolbar_txtColor_mn : 10,
			wToolbar_txtColor_btn : 10
		};
		return toolbarItems[itemName]
	};
	this.onFormatItemToggle = function(item, pressed) {
		var styleType = that.getToolbarItemID(item.getId());
		if (styleType != null && dev.report.base.app.performItemToggle) {
			dev.report.base.style.setFromBar(styleType, pressed)
		}
	};
	this.onColorSelect = function(item, color) {
		var bgColor = dev.report.base.app.toolbar.bgColor;
		if (bgColor) {
			bgColor.hide()
		}
		var styleType = that.getToolbarItemID(item.getId());
		if (!styleType) {
			styleType = that.getToolbarItemID(item.ownerCt.getId())
		}
		if (item.id == "bgNoColor") {
			color = "transparent";
			dev.report.base.app.cnfDefaultBgColor = color;
			Ext.DomQuery.selectNode("*[class*=iconbgcolor]").style.borderLeft = "solid 4px "
					+ color;
			dev.report.base.style.setFromBar(9, color)
		} else {
			if (typeof color == "string") {
				if (styleType == that.getToolbarItemID("wToolbar_bgColor_mn")) {
					dev.report.base.app.cnfDefaultBgColor = color;
					Ext.DomQuery.selectNode("*[class*=iconbgcolor]").style.borderLeft = "solid 4px #"
							+ color
				} else {
					dev.report.base.app.cnfDefaultTextColor = color;
					Ext.DomQuery.selectNode("*[class*=icontextcolor]").style.borderLeft = "solid 4px #"
							+ color
				}
			} else {
				color = (styleType == that.getToolbarItemID("wToolbar_bgColor_mn"))
						? dev.report.base.app.cnfDefaultBgColor
						: dev.report.base.app.cnfDefaultTextColor
			}
		}
		if (styleType != null) {
			dev.report.base.style.setFromBar(styleType, color)
		}
	};
	this.onBorderSelect = function(item, ev) {
		var env = dev.report.base.app.environment, rngStartCoord = env.lastRangeStartCoord, rngEndCoord = env.lastRangeEndCoord, btnBorders = dev.report.base.app.toolbar.border, itemID = (item
				.getId() == btnBorders.getId())
				? dev.report.base.app.cnfDefaultBorder
				: item.getId(), brdConf;
		switch (itemID) {
			case "brd-bottom-norm" :
				brdConf = {
					bottom : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-top-norm" :
				brdConf = {
					top : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-left-norm" :
				brdConf = {
					left : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-right-norm" :
				brdConf = {
					right : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-all-none" :
				brdConf = {
					all : {
						type : "none"
					}
				};
				break;
			case "brd-all-norm" :
				brdConf = {
					all : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-out-norm" :
				brdConf = {
					out : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-out-thick" :
				brdConf = {
					out : {
						width : "2px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-bottom-thick" :
				brdConf = {
					bottom : {
						width : "2px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-top-bottom-norm" :
				brdConf = {
					top : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					},
					bottom : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					}
				};
				break;
			case "brd-top-norm-bottom-thick" :
				brdConf = {
					top : {
						width : "1px",
						type : "Solid",
						color : "#000000"
					},
					bottom : {
						width : "2px",
						type : "Solid",
						color : "#000000"
					}
				}
		}
		dev.report.base.style.setBorder(brdConf);
		btnBorders.setIconClass("icon-".concat(itemID));
		btnBorders.getEl().child(btnBorders.buttonSelector).dom.qtip = Ext
				.getCmp(itemID).text;
		dev.report.base.app.cnfDefaultBorder = itemID
	};
	this.openViewMode = function() {
		using("dev.report.ParamsWindow");
		var params = [];
		var resource=dev.report.model.report.query;
		var p=resource.params;
		var queryId=resource.query_id;
		if(p.length>0){
			var paramsWin =new dev.report.ParamsWindow(queryId,p);
			paramsWin.show();
		}else{
			this.showReport({});
		}
		return true;
	};
	this.showReport= function(params){	
		using("dev.report.ReportPreview");
		var reportWindow = new dev.report.ReportPreview(params);
		reportWindow.show();
    };
	this.updateUndoState = function(undoState, updState) {
		var env = dev.report.base.app.environment;
		if (env == null) {
			return
		}
		if (undoState == undefined) {
			undoState = env.undoState
		} else {
			if (updState == undefined || updState) {
				env.undoState = undoState
			}
		}
		if (true) {
			dev.report.base.app.menubar.undoItem.enable();
			if (dev.report.base.app.menubar) {
				dev.report.base.app.menubar.undoItem.setText("Undo".localize());
				dev.report.base.app.menubar.undoItem.enable()
			}
		} else {
			dev.report.base.app.menubar.undoItem.disable();
			if (dev.report.base.app.menubar) {
				dev.report.base.app.menubar.undoItem.setText("Can't Undo".localize());
				dev.report.base.app.menubar.undoItem.disable()
			}
		}
		if (true) {
			dev.report.base.app.menubar.redoItem.enable();
			if (dev.report.base.app.menubar) {
				dev.report.base.app.menubar.redoItem.setText("Redo".localize());
				dev.report.base.app.menubar.redoItem.enable()
			}
		} else {
			dev.report.base.app.menubar.redoItem.disable();
			if (dev.report.base.app.menubar) {
				dev.report.base.app.menubar.redoItem.setText("Can't Redo".localize());
				dev.report.base.app.menubar.redoItem.disable()
			}
		}
	};
	this.hideBar = function(barId) {
		var bar = Ext.get(barId);
		var barHeight=bar.getHeight();
		
		var h=dev.report.base.app.Report.operatePanel.getHeight()-bar.getHeight();
		dev.report.base.app.Report.operatePanel.setHeight(h);
		bar.setVisibilityMode(Ext.Element.DISPLAY);
		bar.hide();

		dev.report.base.app.Report.reportMain.el.dom.style.top=h+"px";
		var mh=dev.report.base.app.Report.reportMain.getHeight();
		dev.report.base.app.Report.reportMain.setHeight(mh+barHeight);
		dev.report.base.wspc.resize()
	};
	this.showBar = function(barId) {
		var bar = Ext.get(barId);
		bar.setVisibilityMode(Ext.Element.DISPLAY);

		bar.show();
		
		var barHeight=bar.getHeight();
		var h=dev.report.base.app.Report.operatePanel.getHeight()+barHeight;
		dev.report.base.app.Report.operatePanel.setHeight(h);

		var mh=dev.report.base.app.Report.reportMain.getHeight();
		dev.report.base.app.Report.reportMain.setHeight(mh-barHeight);

		dev.report.base.app.Report.reportMain.el.dom.style.top=h+"px";
		dev.report.base.wspc.resize()
	};
	this.hideToolbar = function(toolbar) {
		dev.report.base.app.handlers.hideBar("Toolbar")
	};
	this.showToolbar = function(toolbar) {
		dev.report.base.app.handlers.showBar("Toolbar")
	};
	this.expandCollapseFormulaBar = function() {
		dev.report.base.wspc.resize()
	};
	this.hideShowToolbar = function(state, toolbar) {
		if (state) {
			dev.report.base.app.handlers.showToolbar(toolbar)
		} else {
			dev.report.base.app.handlers.hideToolbar(toolbar)
		}
	};
	this.hideShowFormulaBar = function(state) {
		if (state) {
			dev.report.base.app.handlers.showBar("formulaBar")
		} else {
			dev.report.base.app.handlers.hideBar("formulaBar")
		}
	};
}