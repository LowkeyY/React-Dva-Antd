Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.FormatControl = function(conf) {
		this.id = "control";
		var that = this;
		var formElement = dev.report.base.wsel;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		this.typeDisabled = false;
		this.functionValue = "";
		this._gendata = [];
		this.element_name = "ComboBoxN";
		this.iconImgPath = "";
		this.rangeEnabled = false;
		this.varEnabled = false;
		var isEdit = !!(conf.id);
		if (isEdit) {
			var _initialConf = conf
		}
		var cbState;
		var cbPreState = {
			unchecked : false,
			checked : false,
			mixed : false
		};
		var txNMVal, txLabel;
		if (conf) {
			that._gendata = (conf._gendata) ? conf._gendata : [];
			that.typeDisabled = (conf.type == dev.report.base.wsel.type.WIDGET)
					? !!(conf.srctype == "custom")
					: !!conf.formulaEnabled;
			that.functionValue = conf.src;
			that.labelWidth = 75;
			that.comboWidth = 170;
			that.textWidth = 440;
			that.element_name = conf.name, that.rangeEnabled = ((conf.trange == "" || !conf.trange)
					? false
					: true);
			that.rangeValue = ((conf.trange == "" || !conf.trange)
					? ""
					: conf.trange);
			that.varEnabled = ((conf.tvar == "" || !conf.tvar) ? false : true);
			that.varValue = ((conf.tvar == "" || !conf.tvar) ? "" : conf.tvar)
		}
		var txtNM = "Widget Name".localize();
		txNMVal = ((conf.name) ? conf.name : formElement.type.WIDGET
				.concat(formElement.countEl(formElement.type.WIDGET)
						+ 1));
		that.element_name = (conf.name)
				? conf.name
				: formElement.type.WIDGET.concat(formElement
						.countEl(formElement.type.WIDGET)
						+ 1);
		var formElement = dev.report.base.wsel;
		var _config = {
			winW : 300,
			mainPanelLabelWidth : 150,
			impPath : "/dev/report/res/img/dialog/"
		};
		var txtName = this.cmpFocus = new Ext.form.TextField({
					value : txNMVal,
					id : "wFCtrlDlg_name_txt",
					width : 250,
					tabIndex : 1,
					labelSeparator : "",
					fieldLabel : txtNM + ":",
					allowBlank : false,
					enableKeyEvents : true,
					listeners : {
						keyup : function(thisTf, e) {
							panTar = Ext.getCmp("tar_pan");
							if (panTar) {
								panTar.setName(thisTf.getValue())
							}
						}
					}
				});
		var labelName = new Ext.form.TextField({
					value : txLabel,
					width : 250,
					tabIndex : 2,
					labelSeparator : ":",
					fieldLabel : labelNM,
					allowBlank : true,
					enableKeyEvents : false
				});
		var sourceHolder = new Ext.Panel({
					id : "cHolder",
					baseCls : "x-plain",
					items : [{}]
				});
		var labelsItems = (conf.type == dev.report.base.wsel.type.BUTTON || conf.type == dev.report.base.wsel.type.CHECK_BOX)
				? [txtName, labelName]
				: [txtName];
		var labels = this.containers.labels = new Ext.Panel({
					baseCls : "x-plain",
					layout : "form",
					labelWidth : (conf.type == dev.report.base.wsel.type.WIDGET)
							? 90
							: 110,
					items : [labelsItems]
				});
		var contentPanel = new Ext.Panel({
					border : false,
					id : "mainCP",
					bodyStyle : "background-color:transparent;",
					layout : "form",
					labelWidth : 110,
					title : "General".localize(),
					autoWidth : true,
					autoHeight : true,
					style : "padding:2px;",
					items : [labels, sourceHolder]
				});
		var valuePanel = new Ext.form.FieldSet({
					title : "Value".localize(),
					collapsible : false,
					id : "val_pan",
					autoWidth : true,
					autoHeight : true,
					items : [new Ext.form.Radio({
										checked : cbPreState.unchecked,
										name : "radioSourceFormV",
										tabIndex : 5,
										boxLabel : "Unchecked".localize(),
										hideLabel : true,
										listeners : {
											check : function(thisRb, isChecked) {
												if (isChecked) {
													cbState = "unchecked"
												}
											}
										}
									}), new Ext.form.Radio({
										checked : cbPreState.checked,
										name : "radioSourceFormV",
										boxLabel : "Checked".localize(),
										tabIndex : 6,
										hideLabel : true,
										listeners : {
											check : function(thisRb, isChecked) {
												if (isChecked) {
													cbState = "checked"
												}
											}
										}
									})]
				});
		var userBorderCb = new Ext.form.Checkbox({
					boxLabel : "Show borders in User mode".localize(),
					checked : (conf.format) ? conf.format.view.border : false,
					hideLabel : true,
					tabIndex : 10,
					ctCls : dev.report.kbd.tags.NO_ENTER
				});
		var transparencyCb = new Ext.form.Checkbox({
					boxLabel : "Transparent background".localize(),
					checked : (conf.format) ? conf.format.transparent : false,
					hideLabel : true,
					height : 22,
					tabIndex : 11,
					ctCls : dev.report.kbd.tags.NO_ENTER
				});
		var layoutPanel = new Ext.Panel({
					title : "Layout".localize(),
					border : false,
					id : "layoutPan",
					bodyStyle : "background-color:transparent;",
					layout : "form",
					labelWidth : 110,
					autoWidth : true,
					autoHeight : true,
					style : "padding:2px;",
					items : [userBorderCb, transparencyCb]
				});
		var ctsPre = {};
		var tabs = new Ext.TabPanel({
			region : "center",
			xtype : "tabpanel",
			id : "maintabspanel",
			layoutOnTabChange : true,
			activeTab : 0,
			ctCls : "tb-no-bg",
			autoHeight : true,
			baseCls : "x-plain",
			bodyStyle : "background-color: transparent; padding: 5px;",
			defaults : {
				autoScroll : false
			},
			items : [contentPanel],
			listeners : {
				tabchange : function(el, e) {
					if (e.id == "layoutPan") {
						for (var c in that.containers) {
							ctsPre[c] = that.containers[c];
							delete that.containers[c]
						}
						that.containers.layoutPan = e
					} else {
						if (e.id == "SPPan") {
							for (var c in that.containers) {
								ctsPre[c] = that.containers[c];
								delete that.containers[c]
							}
							that.containers.SPPan = e
						} else {
							delete that.containers.layoutPan;
							if (ctsPre.labels) {
								that.containers = ctsPre;
								return
							}
							sourceHolder.removeAll();
							var ccb = function(cPan) {
								sourceHolder.add(cPan);
								sourceHolder.doLayout()
							};
							var fcb = function(cPan) {
								sourceHolder.add(cPan);
								sourceHolder.doLayout();
								var addp = function(cPan) {
									sourceHolder.add(cPan);
									sourceHolder.doLayout()
								};
								using("dev.report.base.dlg.control.Target");
								var target=new dev.report.base.dlg.control.Target(addp, conf, 50, that);
							};
							var ldwidget = function(cPan) {
								sourceHolder.add(cPan);
								sourceHolder.doLayout();
								using("dev.report.base.dlg.control.Source");
								var source=new dev.report.base.dlg.control.Source(fcb, conf, 30, that);
							};
							using("dev.report.base.dlg.control.Content");
							var source=new dev.report.base.dlg.control.Content(ldwidget, conf, 10, that);
						}
					}
				}
			}
		});
		if (conf.type == dev.report.base.wsel.type.WIDGET) {
			tabs.add(layoutPanel)
		}
		var getSizePosPan = function(panel) {
			var np = new Ext.Panel({
						title : "Size & Position".localize(),
						border : false,
						id : "SPPan",
						bodyStyle : "background-color:transparent;",
						layout : "form",
						labelWidth : 110,
						autoWidth : true,
						autoHeight : true,
						style : "padding:2px;",
						items : [panel]
					});
			tabs.add(np)
		};

		var sizePanel=new dev.report.base.dlg.SizePosPanel(conf.type, conf);
		getSizePosPan(sizePanel.mainSPPanel);

		var _handleSave = function(cb) {
			var panFnc = Ext.getCmp("src_pan"), panTar = Ext.getCmp("tar_pan"), cntPan = Ext
					.getCmp("cnt_pan"), hasCB = cb instanceof Array
					&& cb.length > 1;
			if (txtName.getValue() == "") {
				if (hasCB) {
					cb[1].call(cb[0], [
									false,
									txtNM.concat(" ", "WSS_Forms_empty_name"
													.localize()), {
										_type : "info"
									}])
				}
				return
			}
			var fname = txtName.getValue();
			var my_regexp_ALLOWED_CHARS = new RegExp("^[^0-9(#{}):!@<>[\\]*/^%=&+;,'\"$\\-][^(#{}):!@<>[\\]*/^%=&+;,'\"$\\-]+$");
			var my_regexp_RESERVED_NAMES = /^([a-zA-Z]{1,2}[0-9]{1,5})+$/;
			var my_regexp_RESERVED_CELL_REF = /^[rR]{1}[0-9]{1,5}([cC]{1}[0-9]{1,5})*$/;
			if ((fname.length < 1 || fname.length > 256)
					|| !my_regexp_ALLOWED_CHARS.test(fname)
					|| my_regexp_RESERVED_NAMES.test(fname)
					|| my_regexp_RESERVED_CELL_REF.test(fname)) {
				if (hasCB) {
					cb[1].call(cb[0], [
									false,
									fname.concat(" - ",
											"newNameDlg_NameWarningMsg"
													.localize()), {
										_type : "info"
									}])
				}
				return
			}
			if (conf.type == dev.report.base.wsel.type.WIDGET) {
				var cnt = cntPan.getData().cnt;
				if (!cnt || cnt == "" || cnt == "\n") {
					if (hasCB) {
						cb[1].call(cb[0], [false, "WSS_Widget_empty_content", {
											_type : "info"
										}])
					}
					return
				}
			}
			if (panFnc) {
				if (panFnc.getFuncText() == ""
						&& (conf.type != dev.report.base.wsel.type.WIDGET || (conf.type == dev.report.base.wsel.type.WIDGET && panFnc
								.getSrcType() != "none"))) {
					if (hasCB) {
						cb[1].call(cb[0], [false,
										"WSS_FormComboBox_empty_source", {
											_type : "info"
										}])
					}
					return
				}
			}
			if (conf.type != dev.report.base.wsel.type.BUTTON) {
				var tarData = panTar.getRangeValues();
				if ((tarData.range == "") && (tarData.name == "")
						&& (tarData.variable == "")
						&& (conf.type != dev.report.base.wsel.type.WIDGET)) {
					if (hasCB) {
						cb[1].call(cb[0], [false,
										"WSS_FormComboBox_empty_target", {
											_type : "info"
										}])
					}
					return
				}
			}
			var dims = Ext.getCmp("FE-SE-panel").getSPData();
			if (!dims) {
				if (hasCB) {
					cb[1].call(cb[0], [false, "floatingElement_wrongSizePos", {
										_type : "error"
									}])
				}
				return
			}
			switch (conf.type) {
				case dev.report.base.wsel.type.COMBO_BOX :
					var genData = panFnc.getGenData(), formulaEna = panFnc
							.getTypeDisabled();
					conf = {
						_gendata : isEdit && !genData.length && !formulaEna
								? conf._gendata
								: genData,
						type : dev.report.base.wsel.type.COMBO_BOX,
						name : txtName.getValue(),
						src : panFnc.getFuncText(),
						formulaEnabled : formulaEna,
						trange : tarData.range,
						tnamedrange : tarData.name,
						tvar : tarData.variable,
						top : dims.top,
						left : dims.left,
						width : dims.width,
						height : dims.height
					};
					break;
				case dev.report.base.wsel.type.BUTTON :
					conf = {
						type : dev.report.base.wsel.type.BUTTON,
						name : txtName.getValue(),
						label : labelName.getValue(),
						top : dims.top,
						left : dims.left,
						width : dims.width,
						height : dims.height
					};
					break;
				case dev.report.base.wsel.type.CHECK_BOX :
					conf = {
						type : dev.report.base.wsel.type.CHECK_BOX,
						name : txtName.getValue(),
						label : labelName.getValue(),
						state : cbState,
						trange : tarData.range,
						tnamedrange : tarData.name,
						tvar : tarData.variable,
						top : dims.top,
						left : dims.left,
						width : dims.width,
						height : dims.height
					};
					break;
				case dev.report.base.wsel.type.WIDGET :
					var content = cntPan.getData();
					var genData = panFnc.getGenData(), formulaEna = panFnc
							.getTypeDisabled();
					conf = {
						type : dev.report.base.wsel.type.WIDGET,
						subtype : "custom",
						name : txtName.getValue(),
						cnttype : content.type,
						cnt : content.cnt,
						srctype : panFnc.getSrcType(),
						src : panFnc.getFuncText(),
						_gendata : isEdit && !genData.length && !formulaEna
								? conf._gendata
								: genData,
						trange : tarData.range,
						tnamedrange : tarData.name,
						tvar : tarData.variable,
						top : dims.top,
						left : dims.left,
						width : dims.width,
						height : dims.height,
						format : {
							view : {
								border : userBorderCb.getValue()
							},
							transparent : transparencyCb.getValue()
						}
					};
					break
			}
			if (isEdit) {
				conf.id = _initialConf.id;
				dev.report.base.wsel.update(conf, cb)
			} else {
				conf.zindex = dev.report.base.wsel.wselRegistry.getZIndex();
				dev.report.base.wsel.add(conf, cb)
			}
		};
		this.win = new Ext.Window({
			title : (conf.type == dev.report.base.wsel.type.WIDGET) ? "Format Widget"
					.localize() : "Format Control".localize(),
			closable : true,
			autoDestroy : true,
			id : "formatControlDialog",
			cls : "default-format-window",
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			width : 500,
			height : (conf.type == dev.report.base.wsel.type.WIDGET) ? 420 : 410,
			items : [tabs],
			onEsc : Ext.emptyFn,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.grid.GridMode.READY);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				},
				show : function() {
					setTimeout(function() {
						//		that.initFocus(true, 300)
							})
				},
				activate : function(win) {
				//	that.activate()
				}
			},
			buttons : [new Ext.Button({
				id : "wFCtrlDlg_ok_btn",
				text : "OK".localize(),
				tabIndex : 101,
				handler : function() {
					var cbHandleSave = function(retData) {
						if (retData[0]) {
							that.win.close()
						} else {
							Ext.MessageBox.show({
								title : ((retData[2]._type) && (retData[2]._type == "info"))
										? "Information".localize()
										: "Error".localize(),
								msg : retData[1].localize(retData[2]),
								buttons : Ext.Msg.OK,
								icon : ((retData[2]._type) && (retData[2]._type == "info"))
										? Ext.MessageBox.INFO
										: Ext.MessageBox.ERROR
							})
						}
					};
					_handleSave([this, cbHandleSave])
				}
			}),  new Ext.Button({
						id : "wFCtrlDlg_cancel_btn",
						text : "Cancel".localize(),
						tabIndex : 102,
						ctCls : dev.report.kbd.tags.NO_ENTER,
						handler : function() {
							that.win.close()
						}
					})]
		});
		this.win.show(this)
}