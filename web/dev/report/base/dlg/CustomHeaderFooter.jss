Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.CustomHeaderFooter = function(dialogTitle, customHandleFunction, tmpRecord) {
		this.id = "customHeaderFooter";
		var that = this;
		var _fromDlgF = false;
		if (dev.report.base.app.environment.inputMode === dev.report.base.grid.GridMode.DIALOG) {
			_fromDlgF = true
		} else {
			dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		var AttrRecord = new Ext.data.Record.create([{
					name : "leftStyle"
				}, {
					name : "leftValue"
				}, {
					name : "centerStyle"
				}, {
					name : "centerValue"
				}, {
					name : "rightStyle"
				}, {
					name : "rightValue"
				}]);
		var _pageNumber = "";
		var _numberOfPages = "";
		var _date = "";
		var _time = "";
		var _fileName = "";
		var _pictureName = "";
		var _leftAlign = "text-align: left;";
		var _centerAlign = "text-align: center;";
		var _rightAlign = "text-align: right;";
		var _activeTextArea;
		var _leftSectionFormatStyle = "";
		var _centerSectionFormatStyle = "";
		var _rightSectionFormatStyle = "";
		var label = "customHFLbl".localize();
		var formatTexteBtn = new Ext.Toolbar.Button({
					iconCls : "ico_textcolor",
					cls : "x-btn-icon",
					tooltip : "Format text".localize(),
					tabIndex : 1,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						using("dev.report.base.dlg.Format");
						var format=new dev.report.base.dlg.Format("fromPageSetup", 0, setFormatingStyle,getFormatingStyle());
					}
				});
		var pageNumberBtn = new Ext.Toolbar.Button({
					iconCls : "ico_page_nmb",
					cls : "x-btn-icon",
					tabIndex : 2,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Insert Page Number".localize(),
					handler : function() {
						appendTextArea("$V{PAGE_NUMBER}")
					}
				});
		var numberOfPagesBtn = new Ext.Toolbar.Button({
					iconCls : "ico_nmb_of_pages",
					cls : "x-btn-icon",
					tabIndex : 3,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Insert Number of Pages".localize(),
					handler : function() {
						appendTextArea("$V{TOTAL_PAGES}")
					}
				});
		var dateBtn = new Ext.Toolbar.Button({
					iconCls : "ico_date",
					cls : "x-btn-icon",
					tabIndex : 4,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Insert Date".localize(),
					handler : function() {
						appendTextArea("$V{CURRENT_DATA}")
					}
				});
		var timeBtn = new Ext.Toolbar.Button({
					iconCls : "ico_time",
					cls : "x-btn-icon",
					tabIndex : 5,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Insert Time".localize(),
					handler : function() {
						appendTextArea("$V{CURRENT_TIME}")
					}
				});
		var fileNameBtn = new Ext.Toolbar.Button({
					iconCls : "select-range-icon",
					cls : "x-btn-icon",
					tabIndex : 6,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Insert Report Count".localize(),
					handler : function() {
						appendTextArea("$V{REPORT_COUNT}")
					}
				});
		var sheetNameBtn = new Ext.Toolbar.Button({
					iconCls : "ico_tab",
					cls : "x-btn-icon",
					tabIndex : 7,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Insert Page Count".localize(),
					handler : function() {
						appendTextArea("$V{PAGE_COUNT}")
					}
		});
		var leftSection = new Ext.form.TextArea({
					fieldLabel : "Left section".localize(),
					width : 200,
					style : _leftAlign,
					tabIndex : 10,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					listeners : {
						focus : function(txa) {
							_activeTextArea = txa
						}
					}
				});
		var centerSection = new Ext.form.TextArea({
					fieldLabel : "Center section".localize(),
					width : 200,
					tabIndex : 11,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					style : _centerAlign,
					listeners : {
						focus : function(txa) {
							_activeTextArea = txa
						}
					}
				});
		var rightSection = new Ext.form.TextArea({
					fieldLabel : "Right section".localize(),
					width : 200,
					tabIndex : 12,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					style : _rightAlign,
					listeners : {
						focus : function(txa) {
							_activeTextArea = txa
						}
					}
				});
		var buttonsPanel = {
			layout : "column",
			defaults : {
				border : false,
				baseCls : "x-plain"
			},
			border : false,
			baseCls : "x-plain",
			items : [{
						layout : "form",
						width : 30,
						items : formatTexteBtn
					}, {
						layout : "form",
						width : 30,
						items : pageNumberBtn
					}, {
						layout : "form",
						width : 30,
						items : numberOfPagesBtn
					}, {
						layout : "form",
						width : 30,
						items : dateBtn
					}, {
						layout : "form",
						width : 30,
						items : timeBtn
					}, {
						layout : "form",
						width : 30,
						items : fileNameBtn
					}, {
						layout : "form",
						width : 30,
						items : sheetNameBtn
					}/*, {
						layout : "form",
						width : 30,
						items : pictureBtn
					}*/]
		};
		var textAreaPanel = {
			layout : "column",
			baseCls : "main-panel",
			items : [{
						layout : "form",
						labelAlign : "top",
						baseCls : "x-plain",
						width : 205,
						items : leftSection
					}, {
						layout : "form",
						labelAlign : "top",
						baseCls : "x-plain",
						width : 205,
						items : centerSection
					}, {
						layout : "form",
						labelAlign : "top",
						baseCls : "x-plain",
						width : 205,
						items : rightSection
					}]
		};
		var mainPanel =new Ext.Panel({
					modal : true,
					layout : "form",
					baseCls : "main-panel",
					border : false,
					items : [{
								html : label,
								baseCls : "x-plain"
							}, buttonsPanel, {
								html : "<br>",
								baseCls : "x-plain"
							}, textAreaPanel]
				});
		var setFormatingStyle = function(fmDesc) {
			var fontFamily = "font-family:".concat(fmDesc.fontFamily, "; ");
			var fontStyle = "font-style:".concat(fmDesc.fontStyle, "; ");
			var fontWeight = "font-weight:".concat(fmDesc.fontWeight, "; ");
			var textDecoration = "text-decoration:".concat(
					fmDesc.textDecoration, "; ");
			var color = "color:".concat(fmDesc.color, ";");
			var fontSize = "font-size:".concat(fmDesc.fontSize, "; ");
			var sectionFormatStyle = fontFamily + fontStyle + fontSize
					+ fontWeight + textDecoration + color
					+ "white-space: nowrap;";
			
			if(_activeTextArea.fieldLabel=="Left section".localize()){
				_leftSectionFormatStyle = sectionFormatStyle;
			}else if(_activeTextArea.fieldLabel=="Center section".localize()){
				_centerSectionFormatStyle = sectionFormatStyle;
			}else if(_activeTextArea.fieldLabel=="Right section".localize()){
				_rightSectionFormatStyle = sectionFormatStyle;
			}
			_activeTextArea.getEl().applyStyles(sectionFormatStyle);
			_activeTextArea.selectText();
			_activeTextArea.focus(true, true)
		};
		function formatText(s) {
			s = s.replace(/\n/g, "<br>");
			return s
		}
		function unFormatText(s) {
			s = s.replace(/<br>/g, "\n");
			return s
		}
		function setCustomHeaderFooter() {
			var tmpRec = new AttrRecord({
				leftStyle : _leftSectionFormatStyle,
				leftValue : formatText(leftSection.getValue()),
				leftPreview : getPreview(formatText(leftSection.getValue())),
				centerStyle : _centerSectionFormatStyle,
				centerValue : formatText(centerSection.getValue()),
				centerPreview : getPreview(formatText(centerSection.getValue())),
				rightStyle : _rightSectionFormatStyle,
				rightValue : formatText(rightSection.getValue()),
				rightPreview : getPreview(formatText(rightSection.getValue()))
			});
			customHandleFunction(tmpRec, dialogTitle)
		}
		function getPreview(value) {
			var date = new Date();
			var today = date.getDate() + "/" + date.getMonth() + "/"
					+ date.getFullYear();
			var time = date.getHours() + ":" + date.getMinutes() ;
			var v = ["$V{PAGE_NUMBER}", "$V{TOTAL_PAGES}", "$V{CURRENT_DATA}", "$V{CURRENT_TIME}", "$V{REPORT_COUNT}",
					"$V{PAGE_COUNT}"];
			var p = ["1", "5", today, time,  " 1"," 1"];
			var preview = value;
			for (var i = 0; i < v.length; i++) {
				preview = preview.replace(v[i], p[i]);
				preview = preview.replace("+","");
				preview = preview.replace('"','');
			}
			return preview
		}
		function getFormatingStyle() {
			var preFormated;
			if (_activeTextArea) {
				preFormated = _activeTextArea.getEl().getStyles("fontFamily",
						"fontStyle", "fontWeight", "textDecoration", "color",
						"fontSize")
			}
			return preFormated
		}
		function appendTextArea(s) {
			var oldValue = _activeTextArea.getValue();
			_activeTextArea.setValue(oldValue + s)
		}
		function init() {
			_leftSectionFormatStyle = tmpRecord.get("leftStyle");
			leftSection.getEl().applyStyles(_leftSectionFormatStyle);
			leftSection.setValue(unFormatText(tmpRecord.get("leftValue")));
			_centerSectionFormatStyle = tmpRecord.get("centerStyle");
			centerSection.getEl().applyStyles(_centerSectionFormatStyle);
			centerSection.setValue(unFormatText(tmpRecord.get("centerValue")));
			_rightSectionFormatStyle = tmpRecord.get("rightStyle");
			rightSection.getEl().applyStyles(_rightSectionFormatStyle);
			rightSection.setValue(unFormatText(tmpRecord.get("rightValue")))
		}
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px 5px 15px 10px"
			},
			title : dialogTitle,
			closable : true,
			closeAction : "close",
			cls : "default-format-window",
			autoDestroy : true,
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 650,
			height : 300,
			items : mainPanel,
			onEsc : Ext.emptyFn,
			listeners : {
				close : function() {
					if (!_fromDlgF) {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
					}
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
				//	that.activate()
				}
			},
			buttons : [ new Ext.Button({
								text : "OK".localize(),
								tabIndex : 101,
								handler : function() {
									setCustomHeaderFooter();
									that.win.close()
								}
							}),  new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 102,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		//this.setContext();
		this.win.show(this);
		init();
		leftSection.selectText();
		leftSection.focus(true, true)
}
