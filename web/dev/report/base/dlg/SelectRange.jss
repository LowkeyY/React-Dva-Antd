Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

dev.report.base.dlg.SelectRange = function(confObj) {
	//	dev.report.base.dlg.SelectRange.parent.constructor.call(this);
		this.id = "selectRange";
		var that = this, env = dev.report.base.app.environment, actSheetName = dev.report.base.app.activeBook
				.getSheetSelector().getActiveSheetName(), conf = dev.report.base.app.sourceSel = {
			singleCell : false,
			format : "={Sheet}!{$Range}",
			rng : actSheetName + "!"
					+ env.defaultSelection.getActiveRange().getValue(true),
			initSheet : actSheetName,
			omitInitSheet : false,
			fromDlg : env.inputMode === dev.report.base.grid.GridMode.DIALOG,
			fnc : [this, function(tmpText) {
						alert(tmpText)
					}],
			beforeSheetChange : function(cb, oldSheetName) {
				dev.report.base.app.environment.formulaSelection.removeAll();
				if (dev.report.base.app.activeBook.getSheetSelector()
						.getActiveSheetName() != this.initSheet
						|| !this.fromDlg) {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
				}
				this.oldSheet = oldSheetName;
				if (cb instanceof Array && cb.length > 1) {
					cb[1].call(cb[0])
				}
			},
			afterSheetChange : function(newSheetName) {
				var env = dev.report.base.app.environment;
				if (env.inputMode === dev.report.base.grid.GridMode.DIALOG) {
					this.fromDlg = true
				} else {
					dev.report.base.app.lastInputModeDlg = env.inputMode;
					dev.report.base.general
							.setInputMode(dev.report.base.grid.GridMode.DIALOG)
				}
				var sel = resolveRange(this.rng);
				dev.report.base.mouse.initSourceRange(undefined, [sel.rng[0],
								sel.rng[1]], [sel.rng[2], sel.rng[3]]);
				if (this.format.search("{Sheet}") >= 0) {
					this.rng = this.rng.replace(this.oldSheet, newSheetName
									.search(/ /) >= 0 ? "'".concat(
									newSheetName, "'") : newSheetName);
					selRangeTxf.setValue(this.rng);
					selRangeTxf.selectText();
					selRangeTxf.focus();
					delete this.oldSheet
				}
			}
		};
		Ext.apply(conf, confObj, {});
		if (!conf.rng.length) {
			conf.rng = actSheetName + "!"
					+ env.defaultSelection.getActiveRange().getValue(true)
		}
		function resolveRange(range) {
			var refs = dev.report.base.formula.parse(range);
			return refs.length == 1 ? refs[0] : false
		}
		var formatPreview = function(rawVal) {
			var sel = resolveRange(rawVal);
			if (!sel) {
				return rawVal
			}
			var sheetName = sel.sheet, rangeValues = [sel.ul, sel.lr];
			if (sheetName.search(/ /) >= 0) {
				sheetName = "'".concat(sheetName, "'")
			}
			if (conf.singleCell || sel.ul == sel.lr) {
				rangeValues.length = 1
			}
			var formatedValue = "".concat(conf.format);
			if (conf.omitInitSheet
					&& dev.report.base.app.activeBook.getSheetSelector()
							.getActiveSheetName() == conf.initSheet) {
				formatedValue = formatedValue.replace("{Sheet}!", "")
			} else {
				formatedValue = formatedValue.replace("{Sheet}", sheetName)
			}
			if (rangeValues.length > 1) {
				formatedValue = formatedValue.replace("{Range}", rangeValues[0]
								+ ":" + rangeValues[1]);
				formatedValue = formatedValue
						.replace(
								"{$Range}",
								(cellDollarFormat(rangeValues[0]) + ":" + cellDollarFormat(rangeValues[1])))
			} else {
				formatedValue = formatedValue
						.replace("{Range}", rangeValues[0]);
				formatedValue = formatedValue.replace("{$Range}",
						cellDollarFormat(rangeValues[0]))
			}
			return formatedValue
		};
		var cellDollarFormat = function(cellValue) {
			var formatedRange = "";
			if (cellValue) {
				for (var i = 0; i < cellValue.length; i++) {
					if (i == 0
							|| (parseInt(cellValue.charAt(i)) && !(parseInt(cellValue
									.charAt(i - 1))))) {
						formatedRange += "$" + cellValue.charAt(i)
					} else {
						formatedRange += cellValue.charAt(i)
					}
				}
			}
			return formatedRange
		};
		var LocalTextField = Ext.extend(Ext.form.TextField, {
					initComponent : function() {
						LocalTextField.superclass.initComponent.call(this)
					},
					setValue : function(val) {
						LocalTextField.superclass.setValue.call(this,
								formatPreview(val))
					}
				});
		var selRangeTxf = this.cmpFocus = new LocalTextField({
					id : "selRange",
					hideLabel : true,
					tabIndex : 1,
					value : conf.rng,
					width : 430
				});
		var onBeforeDestroySelRangeDlg = function(panel) {
			selRangeForm.items.each(function(f) {
						f.purgeListeners();
						Ext.destroy(f)
					});
			selRangeForm.purgeListeners();
			selRangeForm.destroy()
		};
		var closeAndStoreRange = function() {
			that.win.close()
		};
		var onBeforeCloseSelRangeDlg = function() {
			dev.report.base.app.environment.formulaSelection.removeAll();
			var activeBook = dev.report.base.app.activeBook, sheetSelector = activeBook
					.getSheetSelector();
			if (sheetSelector.getActiveSheetName() != conf.initSheet
					|| !conf.fromDlg) {
				dev.report.base.general.setInputMode(dev.report.base.app.lastInputModeDlg);
				dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
			}
			function cbCloseSelRng(rng) {
				conf.fnc[1].call(conf.fnc[0], rng);
				dev.report.base.app.activeBook._sheetSelector.enableAddTab();
				delete dev.report.base.app.sourceSel
			}
			if (sheetSelector.getActiveSheetName() != conf.initSheet) {
				var sheetId = sheetSelector.getIdByName(conf.initSheet);
				if (sheetId) {
					dev.report.base.sheet.select([that, cbCloseSelRng,
									selRangeTxf.getValue()], sheetId,
							activeBook, true)
				}
			} else {
				cbCloseSelRng(selRangeTxf.getValue())
			}
			//that.close()
		};
		var selRangeForm = new Ext.FormPanel({
			baseCls : "x-plain",
			labelWidth : 100,
			labelAlign : "left",
			frame : true,
			bodyStyle : "padding: 5px; color: #15428B; font-size: 9pt;",
			defaultType : "textfield",
			header : false,
			monitorValid : true,
			autoHeight : true,
			layout : "column",
			items : [new Ext.Panel({
				width : 440,
				layout : "form",
				cls : "chartdatasource",
				bodyStyle : "background-color: transparent; border-style: none; padding-left: 5px;",
				items : [selRangeTxf]
			}), new Ext.Panel({
				columnWidth : 1,
				layout : "form",
				bodyStyle : "background-color: transparent; border-style: none;",
				items : [new Ext.Toolbar.Button({
							id : "wSelDataSource_icon_btn",
							iconCls : "ico_end_select_range",
							cls : "x-btn-icon",
							tabIndex : 2,
							ctCls : dev.report.kbd.tags.NO_ENTER,
							tooltip : "End Select Range".localize(),
							handler : closeAndStoreRange
						})]
			})]
		});
		this.win = new Ext.Window({
					title : "Select Data Source".localize(),
					alwaysOnTop : true,
					cls : "wssdialog default-format-window",
					layout : "fit",
					width : 505,
					autoHeight : true,
					minWidth : 200,
					minHeight : 30,
					closeable : true,
					closeAction : "close",
					autoDestroy : true,
					plain : true,
					constrain : true,
					modal : false,
					items : [selRangeForm],
					listeners : {
						beforedestroy : {
							fn : onBeforeDestroySelRangeDlg,
							scope : this
						},
						close : {
							fn : onBeforeCloseSelRangeDlg,
							scope : this
						},
						show : function() {
							setTimeout(function() {
									//	that.initFocus(true, 100)
									})
						},
						activate : function(win) {
							//that.activate()
						}
					}
				});
	//	this.setContext();
		var sel = resolveRange(conf.rng);
		if (!sel) {
			conf.rng = actSheetName + "!"
					+ env.defaultSelection.getActiveRange().getValue(true);
			sel = resolveRange(conf.rng)
		}
		function init() {
			var env = dev.report.base.app.environment;
			if (env.inputMode === dev.report.base.grid.GridMode.DIALOG) {
				conf.fromDlg = true
			} else {
				dev.report.base.app.lastInputModeDlg = env.inputMode;
				dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG)
			}
			dev.report.base.app.activeBook._sheetSelector.disableAddTab();
			that.win.show(that);
			selRangeTxf.selectText();
			var dlgPosition = that.win.getPosition();
			that.win.setPagePosition(dlgPosition[0], 50);
			dev.report.base.mouse.initSourceRange(undefined,
					[sel.rng[0], sel.rng[1]], [sel.rng[2], sel.rng[3]])
		}
		if (sel.sheet.length && sel.sheet != actSheetName) {
			var activeBook = dev.report.base.app.activeBook, sheetId = activeBook
					.getSheetSelector().getIdByName(sel.sheet);
			if (sheetId) {
				dev.report.base.sheet.select([this, init], sheetId, activeBook, true)
			} else {
				init()
			}
		} else {
			init()
		}
}