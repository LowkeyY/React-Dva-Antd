Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.SheetMoveCopy =function() {
		this.id = "SheetMoveCopy";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var selectedSheetID = "";
		var selectedSheetName = "";
		var selectedIndex = "";
		var AWName = dev.report.base.wnd.active.getName();
		var AWID = dev.report.base.app.activeBook.getUid();
		var workbook_id = AWID;
		var worksheet_id = dev.report.base.app.activeBook.getWsId();
		var next_worksheet_id = "";
		var AWName = dev.report.base.wnd.active.getName();
		var AWID = dev.report.base.app.activeBook.getUid();
		var bookReg = dev.report.base.book.reg, WData = [], book;
		for (var id in bookReg) {
			book = bookReg[id];
			WData.push([book.uid, book._name])
		}
		var wStore = new Ext.data.SimpleStore({
					fields : ["workbookID", "workbookName"],
					data : WData
				});
		var SData = [];
		var sStore = new Ext.data.SimpleStore({
					fields : ["sheetID", "sheetName"]
				});
		loadSheetData();
		var toBookCmb = this.cmpFocus = new Ext.form.ComboBox({
					fieldLabel : "To Book".localize(),
					width : 250,
					tabIndex : 1,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					store : wStore,
					displayField : "workbookName",
					editable : false,
					mode : "local",
					triggerAction : "all",
					listeners : {
						select : {
							fn : function(combo, record, index) {
								workbook_id = WData[index][0];
								loadSheetData()
							}
						}
					}
				});
		var sheetList = new Ext.DataView({
			id : "sheet-list",
			store : sStore,
			tpl : new Ext.XTemplate(
					'<div class="sheet-list"><tpl for=".">',
					'<div class="thumb-wrap">',
					'<div class="thumb" style="padding: 0px; text-align: left;  ">{sheetName}</div></div>',
					"</tpl></div>"),
			multiSelect : false,
			singleSelect : true,
			overClass : "x-view-over",
			itemSelector : "div.thumb-wrap",
			emptyText : "No images to display".localize(),
			autoWidth : true,
			listeners : {
				containerclick : {
					fn : onContainerClick,
					scope : this
				},
				click : {
					fn : function(dataView, index, node, e) {
						next_worksheet_id = SData[index][0]
					}
				},
				dblclick : {
					fn : function(dataView, index, node, e) {
						next_worksheet_id = SData[index][0];
						moveWorksheet();
						that.win.close()
					}
				}
			}
		});
		var createCopyChb = new Ext.form.Checkbox({
					hideLabel : true,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 3,
					boxLabel : "Create a copy".localize(),
					name : "rb-order",
					inputValue : 8
				});
		function loadSheetData() {
			var worksheets = dev.report.backend.wss.getSheets(workbook_id)[0];
			SData = [];
			for (var i = 0; i < worksheets.length; i += 2) {
				SData.push([worksheets[i], worksheets[i + 1]])
			}
			SData.push(["", "(move to end)".localize()]);
			sStore.loadData(SData)
		}
		function onContainerClick(dView, e) {
			e.stopEvent();
			return false
		}
		function moveWorksheet() {
			if (sheetList.getSelectionCount() > 0) {
				if (workbook_id === AWID) {
					workbook_id = ""
				}
				if (createCopyChb.checked) {
					dev.report.base.app.activeBook.getSheetSelector().copySheet(
							worksheet_id, next_worksheet_id, workbook_id)
				} else {
					dev.report.base.app.activeBook.getSheetSelector().moveSheet(
							worksheet_id, next_worksheet_id, workbook_id)
				}
			}
		}
		var mainPanel =  new Ext.Panel({
					labelAlign : "top",
					modal : true,
					layout : "form",
					baseCls : "main-panel",
					border : false,
					items : [toBookCmb, {
								html : "Before sheet".localize() + ":",
								baseCls : "x-plain"
							}, {
								autoScroll : true,
								layout : "fit",
								border : true,
								width : 250,
								height : 150,
								items : sheetList
							}, createCopyChb]
				});
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px 5px 5px 5px"
			},
			title : "Move or Copy".localize(),
			closable : true,
			closeAction : "close",
			autoDestroy : true,
			cls : "default-format-window",
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 280,
			height : 330,
			items : mainPanel,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				},
				show : function() {
					setTimeout(function() {
						//		that.initFocus(true, 100)
							})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			buttons : [ new Ext.Button({
								text : "OK".localize(),
								tabIndex : 10,
								handler : function() {
									moveWorksheet();
									that.win.close()
								}
							}), new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 11,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		this.win.show(this);
		toBookCmb.setValue(AWName)
}