Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

dev.report.base.dlg.FuncArgs = function(fn, from, preselection) {
		//dev.report.base.dlg.FunctionArguments.parent.constructor.call(this);
		this.id = "wFuncArgs_dlg_wnd";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
	
		if (preselection) {
			var activeFnc = preselection;
			var _pre = {
				fn : activeFnc.slice(1, activeFnc.indexOf("(")),
				args : dev.report.base.formula.args(activeFnc)
			};
			var xhr = new XMLHttpRequest();
			xhr.open("GET",
					"/dev/report/model/".concat(dev.report.base.i18n.L10n, ".json"), false);
			xhr.send(null);
			var functions = Ext.util.JSON.decode(xhr.responseText);
			if (!fn) {
				var ffn = functions.lookup_func[_pre.fn];
				var ff = functions.funcs[ffn];
				fn = ff
			}
		}
		var _fnName = fn[0];
		var _fnCall = fn[1];
		var _fnDesc = fn[2];
		var _fnParams = fn[3];
		var tabIndexInc = 1;
		if (!_fnDesc) {
			_fnDesc = "_error: fnc_desc".localize()
		}
		var _activeParam;
		var _maxSequences;
		var _args = _fnParams.length;
		var position = dev.report.base.app.environment.defaultSelection
				.getActiveRange().getActiveCell();
		
		//ÁÙÊ±ÐÞ¸Ä
		
	//	var rawNR = dev.report.backend.ccmd(0, ["nlst", [position._x, position._y]]);
		
		var resString='[[true,[[]]]]';
		var rawNR=Ext.decode(resString);

		var namedRangesList = [];
		for (var z = 0; z < rawNR[0][1][0].length; z++) {
			namedRangesList.push(rawNR[0][1][0][z].name)
		}
		function isInArray(value, array) {
			var isIn = false;
			for (var c = 0; c < array.length; c++) {
				if (value == array[c]) {
					isIn = true
				}
			}
			return isIn
		}
		var selRangeBtn = Ext.extend(Ext.Button, {
					iconCls : "select-range-icon",
					cls : "x-btn-icon",
					tooltip : "Select Range".localize(),
					initComponent : function() {
						var that = this;
						Ext.apply(this, {});
						selRangeBtn.superclass.initComponent.call(this)
					}
				});
		var valField = Ext.extend(Ext.form.TextField, {
					width : 175,
					hideLabel : true,
					enableKeyEvents : true,
					initComponent : function() {
						var that = this;
						Ext.apply(this, {});
						selRangeBtn.superclass.initComponent.call(this)
					}
				});
		function selRange(selected) {
			that.win.show();
			setTimeout(function() {
						var f = Ext.getCmp("valFld_seq_".concat(_activeParam));
						if (dev.report.base.app.appMode == dev.report.base.grid.viewMode.DESIGNER) {
							var refs = dev.report.base.formula.parseCell(selected);
							var fomulaVar=dev.report.base.app.activePane.getCellValue(refs[1],refs[2]);
							f.setValue(fomulaVar);
						}else{
							f.setValue(selected);
						}
						_activeParam = ""
					}, 1)
		}
		function selRangeB(selected) {
			that.win.show();
			setTimeout(function() {
						var f = Ext.getCmp("valFld_".concat(_activeParam));
						if (dev.report.base.app.appMode == dev.report.base.grid.viewMode.DESIGNER) {
							var refs = dev.report.base.formula.parseCell(selected);
							var fomulaVar=dev.report.base.app.activePane.getCellValue(refs[1],refs[2]);
							f.setValue(fomulaVar);
						}else{
							f.setValue(selected);
						}
						_activeParam = ""
					}, 1)
		}
		var argsHolder = new Ext.Panel({
					layout : "form",
					id : "argsHolder",
					baseCls : "x-plain",
					width : 450,
					items : []
				});
		var argDescData = {};
		var sargDescData = {};
		var argTypeData = {};
		var sargTypeData = {};
		argsHolder.removeAll(false);
		function addNewSeq(seq, hp) {
			allSeqs++;
			var _seqArgs = seq.m.length;
			for (var j = 0; j < _seqArgs; j++) {
				lastSeqIndex = lastSeqIndex + 1;
				sargDescData[j + lastSeqIndex] = seq.m[j].d;
				sargTypeData[j + lastSeqIndex] = seq.m[j].t;
				var sargPanel = new Ext.Panel({
					id : "argPan_seq_".concat(lastSeqIndex),
					layout : "column",
					baseCls : "x-plain",
					bodyStyle : "margin-top: 5px;",
					border : false,
					frame : false,
					items : [{
								columnWidth : 0.3,
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								style : "text-align: right; margin-right: 10px;",
								frame : false,
								items : [{
											html : seq.m[j].n.concat(allSeqs),
											baseCls : "x-plain"
										}]
							}, {
								columnWidth : 0.43,
								xtype : "fieldset",
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								frame : false,
								items : [new valField({
									id : "valFld_seq_".concat(lastSeqIndex),
									tabIndex : tabIndexInc,
									listeners : {
										focus : function() {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											that.win.remove("actAttribDesc");
											var dsp = {
												html : sargDescData[nr],
												baseCls : "x-plain",
												height : 70,
												autoScroll : "auto",
												id : "actAttribDesc",
												bodyStyle : "margin-left: 0px; margin-top: 5px; font-size: 11px;"
											};
											that.win.add(dsp);
											that.win.doLayout();
											if (nr == lastSeqIndex
													&& allSeqs < _maxSequences) {
												addNewSeq(rawSeq, lastSeqIndex)
											}
										},
										keypress : function(el, e) {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											var kp = e.getKey();
											if (kp == 9) {
												nr = parseInt(nr);
												if (Ext.getCmp("valFld_seq_"
														.concat(nr + 1))) {
												}
											}
										},
										keyup : function() {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											Ext
													.getCmp("valArg_val_"
															.concat(nr))
													.removeAll();
											var dsp = {
												html : "= ".concat(this
														.getValue()),
												baseCls : "x-plain"
											};
											Ext
													.getCmp("valArg_val_"
															.concat(nr))
													.add(dsp);
											Ext
													.getCmp("valArg_val_"
															.concat(nr))
													.doLayout()
										},
										blur : function() {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											if (sargTypeData[nr] == "text") {
												var vale = setQuotes(this
														.getValue());
												Ext.getCmp("valArg_val_"
														.concat(nr))
														.removeAll();
												var dsp = {
													html : "= ".concat(vale),
													baseCls : "x-plain"
												};
												Ext.getCmp("valArg_val_"
														.concat(nr)).add(dsp);
												Ext.getCmp("valArg_val_"
														.concat(nr)).doLayout()
											}
										}
									}
								})]
							}, {
								columnWidth : 0.07,
								xtype : "fieldset",
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								frame : false,
								items : [new selRangeBtn({
									id : "valBtn_seq_".concat(lastSeqIndex),
									tabIndex : tabIndexInc + 1,
									handler : function() {
										var nr = this.id;
										nr = nr.split("_");
										nr = nr[2];
										using("dev.report.base.dlg.SelectRange");
										var selectRange=new dev.report.base.dlg.SelectRange({
															fnc : [this,
																	selRange],
															format : "{Sheet}!{Range}",
															rng : Ext
																	.getCmp("valFld_seq_"
																			.concat(nr))
																	.getValue(),
															omitInitSheet : true
										});
										_activeParam = nr;
										that.win.hide()
									}
								})]
							}, {
								columnWidth : 0.2,
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								id : "valArg_val_".concat(lastSeqIndex),
								style : "text-align: left; margin-left: 10px; white-space:nowrap;",
								frame : false,
								items : [{
									html : "= ".concat(("fnArg_"
											.concat(seq.m[j].t)).localize()),
									baseCls : "x-plain"
								}]
							}]
				});
				argsHolder.add(sargPanel);
				argsHolder.doLayout();
				tabIndexInc = tabIndexInc + 2
			}
		}
		var allSeqs = 0;
		var lastSeqIndex = 0;
		function parseSequence(seq) {
			_maxSequences = seq.c;
			var _seqArgs = seq.m.length;
			allSeqs++;
			for (var j = 0; j < _seqArgs; j++) {
				lastSeqIndex = j;
				sargDescData[j] = seq.m[j].d;
				sargTypeData[j] = seq.m[j].t;
				var sargPanel = new Ext.Panel({
					id : "argPan_seq_".concat(j),
					layout : "column",
					baseCls : "x-plain",
					bodyStyle : "margin-top: 5px;",
					border : false,
					frame : false,
					items : [{
								columnWidth : 0.3,
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								style : "text-align: right; margin-right: 10px;",
								frame : false,
								items : [{
											html : seq.m[j].n.concat(allSeqs),
											baseCls : "x-plain"
										}]
							}, {
								columnWidth : 0.43,
								xtype : "fieldset",
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								frame : false,
								items : [new valField({
									id : "valFld_seq_".concat(j),
									tabIndex : tabIndexInc,
									listeners : {
										focus : function() {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											that.win.remove("actAttribDesc");
											var dsp = {
												html : sargDescData[nr],
												baseCls : "x-plain",
												height : 70,
												autoScroll : "auto",
												id : "actAttribDesc",
												bodyStyle : "margin-left: 0px; margin-top: 5px; font-size: 11px;"
											};
											that.win.add(dsp);
											that.win.doLayout();
											if (nr == lastSeqIndex
													&& allSeqs < _maxSequences) {
												addNewSeq(rawSeq, lastSeqIndex)
											}
										},
										keypress : function(el, e) {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											var kp = e.getKey();
											if (kp == 9) {
												nr = parseInt(nr);
												if (Ext.getCmp("valFld_seq_"
														.concat(nr + 1))) {
												}
											}
										},
										keyup : function() {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											Ext
													.getCmp("valArg_val_"
															.concat(nr))
													.removeAll();
											var dsp = {
												html : "= ".concat(this
														.getValue()),
												baseCls : "x-plain"
											};
											Ext
													.getCmp("valArg_val_"
															.concat(nr))
													.add(dsp);
											Ext
													.getCmp("valArg_val_"
															.concat(nr))
													.doLayout()
										},
										blur : function() {
											var nr = this.id;
											nr = nr.split("_");
											nr = nr[2];
											if (sargTypeData[nr] == "text") {
												var vale = setQuotes(this
														.getValue());
												Ext.getCmp("valArg_val_"
														.concat(nr))
														.removeAll();
												var dsp = {
													html : "= ".concat(vale),
													baseCls : "x-plain"
												};
												Ext.getCmp("valArg_val_"
														.concat(nr)).add(dsp);
												Ext.getCmp("valArg_val_"
														.concat(nr)).doLayout()
											}
										}
									}
								})]
							}, {
								columnWidth : 0.07,
								xtype : "fieldset",
								autoHeight : true,
								baseCls : "x-plain",
								border : false,
								frame : false,
								items : [new selRangeBtn({
									id : "valBtn_seq_".concat(j),
									tabIndex : tabIndexInc + 1,
									handler : function() {
										var nr = this.id;
										nr = nr.split("_");
										nr = nr[2];
										using("dev.report.base.dlg.SelectRange");
										var selectRange=new dev.report.base.dlg.SelectRange({
															fnc : [this,
																	selRange],
															format : "{Sheet}!{Range}",
															rng : Ext
																	.getCmp("valFld_seq_"
																			.concat(nr))
																	.getValue(),
															omitInitSheet : true
										});
										_activeParam = nr;
										that.win.hide()
									}
								})]
							}, {
								columnWidth : 0.2,
								autoHeight : true,
								baseCls : "x-plain",
								id : "valArg_val_".concat(j),
								border : false,
								style : "text-align: left; margin-left: 10px; white-space:nowrap;",
								frame : false,
								items : [{
									html : "= ".concat(("fnArg_"
											.concat(seq.m[j].t)).localize()),
									baseCls : "x-plain"
								}]
							}]
				});
				argsHolder.add(sargPanel);
				tabIndexInc = tabIndexInc + 2
			}
		}
		for (var i = 0; i < _args; i++) {
			var rawSeq;
			if (_fnParams[i].t == "sequence") {
				rawSeq = _fnParams[i];
				parseSequence(_fnParams[i]);
				break
			}
			argDescData[i] = _fnParams[i].d;
			argTypeData[i] = _fnParams[i].t;
			var argPanel = new Ext.Panel({
				id : "argPan_".concat(i),
				layout : "column",
				baseCls : "x-plain",
				bodyStyle : "margin-top: 5px;",
				border : false,
				frame : false,
				items : [{
							columnWidth : 0.3,
							autoHeight : true,
							baseCls : "x-plain",
							border : false,
							style : "text-align: right; margin-right: 10px;",
							frame : false,
							items : [{
										html : _fnParams[i].n,
										baseCls : "x-plain"
									}]
						}, {
							columnWidth : 0.43,
							xtype : "fieldset",
							autoHeight : true,
							baseCls : "x-plain",
							border : false,
							frame : false,
							items : [new valField({
								id : "valFld_".concat(i),
								tabIndex : tabIndexInc,
								listeners : {
									focus : function() {
										var nr = this.id;
										nr = nr.split("_");
										nr = nr[1];
										that.win.remove("actAttribDesc");
										var dsp = {
											html : argDescData[nr],
											baseCls : "x-plain",
											id : "actAttribDesc",
											height : 70,
											autoScroll : "auto",
											bodyStyle : "margin-left: 0px; margin-top: 5px; font-size: 11px;"
										};
										that.win.add(dsp);
										that.win.doLayout()
									},
									keypress : function(el, e) {
										var nr = this.id;
										nr = nr.split("_");
										nr = nr[1];
										var kp = e.getKey();
										nr = parseInt(nr);
										if (kp == 9) {
											if (Ext.getCmp("valFld_".concat(nr
													+ 1))) {
											} else {
												if (Ext.getCmp("valFld_seq_0")) {
												}
											}
										}
									},
									keyup : function() {
										var nr = this.id;
										nr = nr.split("_");
										nr = nr[1];
										Ext.getCmp("val_val_".concat(nr))
												.removeAll();
										var dsp = {
											html : "= ".concat(this.getValue()),
											baseCls : "x-plain"
										};
										Ext.getCmp("val_val_".concat(nr))
												.add(dsp);
										Ext.getCmp("val_val_".concat(nr))
												.doLayout()
									},
									blur : function() {
										var nr = this.id;
										nr = nr.split("_");
										nr = nr[1];
										if (argTypeData[nr] == "text") {
											var vale = setQuotes(this
													.getValue());
											Ext.getCmp("val_val_".concat(nr))
													.removeAll();
											var dsp = {
												html : "= ".concat(vale),
												baseCls : "x-plain"
											};
											Ext.getCmp("val_val_".concat(nr))
													.add(dsp);
											Ext.getCmp("val_val_".concat(nr))
													.doLayout()
										}
									}
								}
							})]
						}, {
							columnWidth : 0.07,
							xtype : "fieldset",
							autoHeight : true,
							baseCls : "x-plain",
							border : false,
							frame : false,
							items : [new selRangeBtn({
								id : "valBtn_".concat(i),
								tabIndex : tabIndexInc + 1,
								handler : function() {
									var nr = this.id;
									nr = nr.split("_");
									nr = nr[1];
									using("dev.report.base.dlg.SelectRange");
									var selectRange=new dev.report.base.dlg.SelectRange({
														fnc : [this, selRangeB],
														format : "{Sheet}!{Range}",
														rng : Ext
																.getCmp("valFld_"
																		.concat(nr))
																.getValue(),
														omitInitSheet : true
									});
									_activeParam = nr;
									that.win.hide()
								}
							})]
						}, {
							columnWidth : 0.2,
							autoHeight : true,
							baseCls : "x-plain",
							border : false,
							id : "val_val_".concat(i),
							style : "text-align: left; margin-left: 10px; white-space:nowrap;",
							frame : false,
							items : [{
								html : "= ".concat(("fnArg_"
										.concat(_fnParams[i].t)).localize()),
								baseCls : "x-plain"
							}]
						}]
			});
			argsHolder.add(argPanel);
			tabIndexInc = tabIndexInc + 2
		}
		if (_args < 1) {
			argsHolder.add({
						html : "fnc_no_params".localize(),
						baseCls : "x-plain"
					})
		}
		argsHolder.doLayout();
		function setQuotes(val) {
			var val = dev.report.base.general.str2var(val);
			switch (val.t) {
				case "e" :
					return '""';
				case "n" :
					return val.l10n;
				case "b" :
					return val.str;
				case "s" :
					val = "=".concat(val.v);
					var jwfrml = dev.report.base.formula;
					if (!!val.match(/^=".*"$/)
							|| namedRangesList.indexOf(val.substring(1)) != -1
							|| !!val.match(jwfrml.re_var)
							|| !!val.match(jwfrml.re_fn)) {
						return val.substring(1)
					}
					val = val.substring(1);

					var refs = dev.report.base.formula.parse(val);
					return refs.sgn.replace(/@\d+/g, "") == val.replace(/\$/g,
							"") ? val : '"'.concat(val, '"');
				default :
					return '"'.concat(val.v, '"')
			}
		}
		function setFunction() {
			var tmpArr = [];
			for (var w = 0; w < _args; w++) {
				if (Ext.getCmp("valFld_".concat(w))) {
					if (argTypeData[w] == "text") {
						var val = setQuotes(Ext.getCmp("valFld_".concat(w))
								.getValue())
					} else {
						var val = Ext.getCmp("valFld_".concat(w)).getValue()
					}
					tmpArr.push(val)
				}
			}
			for (var z = 0; z < allSeqs; z++) {
				if (sargTypeData[z] == "text") {
					var val = setQuotes(Ext.getCmp("valFld_seq_".concat(z))
							.getValue())
				} else {
					var val = Ext.getCmp("valFld_seq_".concat(z)).getValue()
				}
				tmpArr.push(val)
			}
			var num = tmpArr.length;
			for (var r = num; r > -1; r--) {
				if ((tmpArr[r] == undefined) || (tmpArr[r] == "")
						|| (!tmpArr[r])) {
					tmpArr.splice(r, 1)
				} else {
					r = -1
				}
			}
			var func = "".concat(_fnName, "(");
			var fDelimiter = dev.report.base.i18n.separators[2];
			for (var t = 0; t < tmpArr.length; t++) {
				if (t == 0) {
					func = func.concat(tmpArr[t])
				} else {
					func = func.concat(fDelimiter, tmpArr[t])
				}
			}
			func = func.concat(")");
			if (from.fn) {
				from.fn("=".concat(func))
			} else {
				if (dev.report.base.app.appMode == dev.report.base.grid.viewMode.DESIGNER) {
					var env = dev.report.base.app.environment, GridMode = dev.report.base.grid.GridMode, inputField = env.inputField;
					dev.report.base.general.setInputMode(GridMode.INPUT);
					dev.report.base.app.lastInputMode = GridMode.READY;
					dev.report.base.general.showInputField(null, false, false,false);
					inputField.value = (inputField.value.length == 0
							|| inputField.value.charAt(0) != "="
							|| from.id == "fbar" ? "" : inputField.value)
							.concat(func);
					//dev.report.base.app.currFormula.setValue(inputField.value);
					dev.report.base.keyboard.setFieldSize();
					dev.report.base.general.focusInputField();
					dev.report.base.app.environment.formulaSelection.removeAll()
					dev.report.base.keyboard.sendInput(env.inputField)
					dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.READY);

				}else{
					var env = dev.report.base.app.environment, GridMode = dev.report.base.grid.GridMode, inputField = env.inputField;
					dev.report.base.general.setInputMode(GridMode.EDIT);
					dev.report.base.app.lastInputMode = GridMode.READY;
					dev.report.base.general.showInputField(null, false, true);
					inputField.value = (inputField.value.length == 0
							|| inputField.value.charAt(0) != "="
							|| from.id == "fbar" ? "=" : inputField.value)
							.concat(func);
					dev.report.base.app.currFormula.setValue(inputField.value);
					dev.report.base.keyboard.setFieldSize();
					dev.report.base.general.focusInputField()
				}

			}
			that.win.close()
		}
		this.win = new Ext.Window({
			title : (from.id == "widget")
					? "Macro Arguments".localize()
					: "Function Arguments".localize(),
			closable : true,
			id : "wFuncArgs_dlg_wnd",
			autoDestroy : true,
			plain : true,
			constrain : true,
			cls : "default-format-window",
			modal : true,
			resizable : false,
			enableHdMenu : false,
			animCollapse : false,
			width : 530,
			height : 400,
			layout : "form",
			onEsc : Ext.emptyFn,
			bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
			listeners : {
				close : function() {
					if (dev.report.base.app.environment.inputMode != dev.report.base.grid.GridMode.EDIT
							&& (!from || from.id == "fbar")) {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
					}
				//	that.close();
					if (!from || from.id == "fbar") {
						dev.report.base.app.activeSheet._defaultSelection.getCursorField().refresh()
					}
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			items : [new Ext.Panel({
				border : false,
				frame : false,
				autoHeight : true,
				id : "sample",
				header : false,
				height : 200,
				baseCls : "x-title-f",
				items : [{
					autoWidth : true,
					xtype : "fieldset",
					bodyStyle : "padding-top: 0px; background-color: transparent;",
					layout : "form",
					border : true,
					height : 200,
					autoScroll : true,
					title : _fnName,
					items : [argsHolder]
				}]
			}), {
				html : _fnDesc,
				baseCls : "x-plain"
			}, {
				html : "",
				height : 70,
				autoScroll : "auto",
				baseCls : "x-plain",
				id : "actAttribDesc",
				bodyStyle : "margin-left: 0px; margin-top: 5px; font-size: 11px;"
			}],
			buttons : [ new Ext.Button({
								text : "OK".localize(),
								id : "wFuncArgs_ok_btn",
								tabIndex : 102,
								handler : function() {
									setFunction();
									//that.win.close()
								}
							}), new Ext.Button({
								text : "Cancel".localize(),
								id : "wFuncArgs_cancel_btn",
								tabIndex : 103,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									if (from.id == "control"
											|| from.id == "widget") {
										Ext.getCmp("formatControlDialog")
												.show()
									}
									that.win.close()
								}
							})]
		});
	//	this.setContext();
		this.win.show(this);
		if (preselection) {
			var valIndex = 0;
			var seqIndex = 0;
			if (_args > 0) {
				for (var fi = 0; fi < _pre.args.length; fi++) {
					var tempFld = Ext.getCmp("valFld_".concat(fi));
					if (tempFld) {
						tempFld.focus();
						tempFld.setValue(_pre.args[fi]);
						valIndex++
					} else {
						for (var si = seqIndex; si < _pre.args.length; si++) {
							var tempSFld = Ext.getCmp("valFld_seq_".concat(si));
							if (tempSFld) {
								tempSFld.focus();
								tempSFld.setValue(_pre.args[valIndex + si]);
								seqIndex++
							}
						}
					}
				}
			}
		}
}