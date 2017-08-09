
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

dev.report.base.dlg.NewName = function(newNameHandleFnc, selectedName, nameManagerStore) {

		this.id = "wNewName_dlg_wnd";
		var that = this;
		var _fromDlgF = false;
		var selectedScope = "";
		var selectedRange = "";
		var _newNameHandleFncFlag = false;
		if (dev.report.base.app.environment.inputMode === dev.report.base.grid.GridMode.DIALOG) {
			_fromDlgF = true
		} else {
			dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		var newName = [];
		var dlgTitle = "";
		
		//ÁÙÊ±ÐÞ¸Ä
		//var worksheets = dev.report.backend.wss.getSheets()[0];
		var worksheets = new Array();//dev.report.backend.wss.getSheets()[0];


		var scopeData = [["", "Workbook".localize()]];
		for (var i = 0; i < worksheets.length; i += 2) {
			scopeData.push([worksheets[i], worksheets[i + 1]])
		}
		var scopeStore = new Ext.data.SimpleStore({
					fields : ["sheetID", "sheetName"],
					data : scopeData
				});
		if (selectedName) {
			dlgTitle = "Edit Name".localize()
		} else {
			dlgTitle = "New Name".localize()
		}
		var nameTxf = this.cmpFocus = new Ext.form.TextField({
					fieldLabel : "Name".localize(),
					id : "wNewName_name_fld",
					tabIndex : 1,
					width : 200
				});
		var scopeCmb = new Ext.form.ComboBox({
					fieldLabel : "Scope".localize(),
					id : "wNewName_scope_cmb",
					width : 135,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 2,
					store : scopeStore,
					displayField : "sheetName",
					editable : false,
					mode : "local",
					triggerAction : "all",
					listeners : {
						select : function(combo, record, index) {
							selectedScope = index == 0 ? "" : combo.getValue()
						}
					}
				});
		var commentTxa = new Ext.form.TextArea({
					fieldLabel : "Comment".localize(),
					id : "wNewName_comment_tx",
					width : 200,
					tabIndex : 3
				});
		var refersToTxf = new Ext.form.TextField({
					fieldLabel : "Refers To".localize(),
					id : "wNewName_refersto_fld",
					value : "=".concat(dev.report.base.app.activeBook
									.getSheetSelector()
									.getActiveSheetName(true), "!",
							dev.report.base.app.environment.defaultSelection
									.getActiveRange().getValue(true)),
					width : 170,
					tabIndex : 4
				});
		var selectRangeBtn = new Ext.Toolbar.Button({
					id : "selRangeBegin",
					iconCls : "select-range-icon",
					cls : "x-btn-icon",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 5,
					tooltip : "Select Range".localize(),
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
											fnc : [this, selRangeHandleFnc],
											rng : refersToTxf.getValue()
						});
						that.win.hide()
					}
				});
		function selRangeHandleFnc(selected) {
			that.win.show();
			refersToTxf.setValue(selected)
		}
		function tmpFormatRange(sr) {
			var tmp = sr.split(":");
			var formatedRange = "";
			for (var i = 0; i < tmp.length; i++) {
				if (i > 0) {
					formatedRange += ":"
				}
				for (var j = 0; j < tmp[i].length; j++) {
					if (j == 0
							|| (parseInt(tmp[i].charAt(j)) && !(parseInt(tmp[i]
									.charAt(j - 1))))) {
						formatedRange += "$" + tmp[i].charAt(j)
					} else {
						formatedRange += tmp[i].charAt(j)
					}
				}
			}
			return formatedRange
		}
		function openSelectRangeDialog() {
			that.win.hide();
			minWin.show()
		}
		function initName() {
			if (selectedName) {
				nameTxf.setValue(selectedName.get("name"));
				scopeCmb.setValue(selectedName.get("scope"));
				selectedScope = selectedName.get("scope");
				scopeCmb.disable();
				commentTxa.setValue(selectedName.get("comment"));
				refersToTxf.setValue(selectedName.get("refersTo"))
			}
		}
		function validateName() {
			var name = nameTxf.getValue();
			var refersTo = refersToTxf.getValue();
			var returnValue = false;
			var my_regexp_ALLOWED_CHARS = new RegExp("^[^0-9(#{}):!@<>[\\]*/^%=&+;,'\"$\\-][^(#{}):!@<>[\\]*/^%=&+;,'\"$\\-]+$");
			var my_regexp_RESERVED_NAMES = /^([a-zA-Z]{1,2}[0-9]{1,5})+$/;
			var my_regexp_RESERVED_CELL_REF = /^[rR]{1}[0-9]{1,5}([cC]{1}[0-9]{1,5})*$/;
			if (((name.length > 1 && name.length < 256 && refersTo.length > 0) && (my_regexp_ALLOWED_CHARS
					.test(name) && !my_regexp_RESERVED_NAMES.test(name)))
					&& !my_regexp_RESERVED_CELL_REF.test(name)) {
				returnValue = true;
				nameManagerStore.each(function(record) {
							if (record.data.name.toLowerCase() == name
									.toLowerCase()
									&& record.data.scope == scopeCmb.getValue()) {
								returnValue = record != selectedName
										? false
										: true
							}
						}, [this])
			}
			return returnValue
		}
		function addNewName() {
			if (validateName()) {
				var newName = [nameTxf.getValue(), "", refersToTxf.getValue(),
						scopeCmb.getValue(), commentTxa.getValue()];
				newNameHandleFnc(newName);
				_newNameHandleFncFlag = true;
				that.win.close()
			} else {
				setTimeout(function() {
							Ext.Msg.show({
										title : "Warning".localize() + "...",
										msg : "newNameDlg_NameWarningMsg"
												.localize(),
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.WARNING
									})
						}, 0)
			}
		}
		var mainPanel =new Ext.Panel({
					modal : true,
					layout : "form",
					baseCls : "x-plain",
					border : false,
					items : [nameTxf, scopeCmb, commentTxa, {
								layout : "column",
								border : false,
								baseCls : "main-panel",
								items : [{
											layout : "form",
											border : false,
											width : 280,
											baseCls : "x-plain",
											items : refersToTxf
										}, {
											layout : "form",
											border : false,
											width : 30,
											baseCls : "x-plain",
											items : selectRangeBtn
										}]
							}]
				});
		this.win = new Ext.Window({
			defaults : {
				bodyStyle : "padding:10px"
			},
			title : dlgTitle,
			closable : true,
			closeAction : "close",
			autoDestroy : true,
			plain : true,
			id : "wNewName_dlg_wnd",
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			cls : "default-format-window",
			layout : "fit",
			width : 350,
			height : 240,
			items : mainPanel,
			onEsc : Ext.emptyFn,
			listeners : {
				close : function() {
					if (!_newNameHandleFncFlag) {
						newNameHandleFnc()
					}
					if (!_fromDlgF) {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
					}
				},
				show : function() {
					setTimeout(function() {
							//	that.initFocus(true, 100)
					})
				},
				activate : function(win) {
				//	that.activate()
				}
			},
			buttons : [new Ext.Button({
								text : "OK".localize(),
								id : "wNewName_ok_btn",
								tabIndex : 10,
								handler : function() {
									addNewName();
									that.win.close()
								}
							}),new Ext.Button({
								text : "Cancel".localize(),
								id : "wNewName_cancel_btn",
								tabIndex : 11,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
	//	this.setContext();
		this.win.show(this);
		scopeCmb.setValue("Workbook".localize());
		initName()
}