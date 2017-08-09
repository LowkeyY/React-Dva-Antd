Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");

using("lib.ImageButton.ImageButton");

dev.report.base.app.FormulaBar = function() {
	var that = this;
	var _expanded = false;
	var _minHeight = 22;
	var _maxHeight = 50;
	var _isWebKit = Ext.isWebKit;
	var _defaultCSS = "overflow-y:auto; overflow-x:hidden";
	var _webkitCSSexp = "padding:2px 0px 2px 0px!important; height:44px !important;overflow-y:hidden; overflow-x:hidden;";
	var _webkitCSSclps = "padding:2px 0px 2px 0 !important; height:22px !important;overflow-y:auto; overflow-x:hidden;";
	var _formulaBar = Ext.get("formulaBar");

	this.init = function() {
		dev.report.base.app.currCoord=this.currCoord;
		dev.report.base.app.currFormula=this.currFormula;
		dev.report.base.app.expandBtn=this.expandBtn;
		dev.report.base.app.currCoord.render("currCoord");
		this.formulaTlbContainer.render("formulaTlb");
		dev.report.base.app.currFormula.render("formulaInfo");
		dev.report.base.app.expandBtn.render("expandBtn");
	};

	this.currCoord = new Ext.form.TextField({
		id : "wFrmlBar_currCoord_fld",
		hideLabel : true,
		style : "text-align:center;",
		enableKeyEvents : true,
		width : 170,
		tmpValue : false,
		listeners : {
			keydown : function(txf, e) {
				switch (e.getKey()) {
					case 9 :
						e.stopEvent();
						break;
					case 13 :
						e.stopEvent();
						var value = txf.getValue();
						if (value) {
							if (!(dev.report.base.book.goTo(value))) {
								insertName(value);
								this.setValue(value)
							}
						} else {
							this.setValue(this.tmpValue)
						}
						this.getEl().blur();
						break;
					case 27 :
						e.stopEvent();
						this.setValue(this.tmpValue);
						this.getEl().blur();
						break
				}
			},
			focus : function(txf) {
				this.tmpValue = this.getValue();
				this.getEl().applyStyles("text-align:left;");
				dev.report.base.app.lastInputMode = dev.report.base.app.environment.inputMode;
				dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.CNTRL);
				setTimeout(function() {
							txf.selectText()
						})
			},
			blur : function() {
				this.getEl().applyStyles("text-align:center;");
				dev.report.base.general.setInputMode(dev.report.base.app.lastInputMode);
				dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
			}
		}
	});
	this.formulaTlbContainer = new Ext.Panel({
				layout : "absolute",
				width : 75,
				height : 24,
				border : false,
				baseCls : "x-plain",
				innerTlb : false,
				items : [{
					border : false,
					x : 0,
					y : -3,
					tbar : [dev.report.base.app.formulaTlb = new Ext.Toolbar({
								items : [{
											tooltip : {
												text : "Cancel".localize()
											},
											iconCls : "cancel_formula_icon",
											id : "wFrmlBar_cancel_btn",
											disabled : true,
											handler : onCancel,
											scope : this
										}, {
											tooltip : {
												text : "Enter".localize()
											},
											iconCls : "enter_formula_icon",
											id : "wFrmlBar_enter_btn",
											disabled : true,
											handler : onEnter,
											scope : this
										}, {
											tooltip : {
												text : "Insert Function"
														.localize()
											},
											iconCls : "insert_formula_icon",
											id : "wFrmlBar_insert_btn",
											handler : onInsertFunction,
											scope : this
										}],
								setMode : function(mode) {
									if (mode) {
										this.items.items[0].enable();
										this.items.items[1].enable()
									} else {
										this.items.items[0].disable();
										this.items.items[1].disable()
									}
								}
							})]
				}]
			});
	this.currFormula = new Ext.form.TextArea({
				id : "wFrmlBar_currFormula_tx",
				hideLabel : true,
				enableKeyEvents : true,
				width : "100%",
				height : 22,
				style : _isWebKit ? _webkitCSSclps : _defaultCSS,
				listeners : {
					render : function() {
						this.getEl().on("mousedown", function() {
									dev.report.base.app.gridBlurObserver.notify(this);
									dev.report.base.keyboard.skipInpFldBlur = true;
									dev.report.base.general.mouseDownOnFormFld()
								})
					},
					focus : function() {
						this.tmpValue = this.getValue();
						dev.report.base.general.focusOnFormFld()
					},
					keyup : function(txa, e) {
						dev.report.base.keyboard.setFieldContent(e)
					},
					blur : function() {
						dev.report.base.app.fromFormulaField = false
					}
				}
			});
	this.expandBtn = new Ext.Panel({
		layout : "card",
		activeItem : 0,
		border : false,
		baseCls : "x-plain",
		defaults : {
			baseCls : "x-plain",
			border : false,
			width : 16
		},
		items : [{
			layout : "absolute",
			height : 23,
			items : [new lib.ImageButton.ImageButton({
						id : "wFrmlBar_expand_btn",
						autoEl : {
							tag : "img",
							src : "/Ext/resources/images/default/s.gif"
						},
						width : 16,
						height : 22,
						x : 0,
						y : 1,
						cls : "formula-info-exp-icon",
						imgNormal : "/Ext/resources/images/default/s.gif",
						imgOver : "/Ext/resources/images/default/s.gif",
						imgClicked : "/Ext/resources/images/default/s.gif",
						actionFn : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							expand()
						}
					})]
		}, {
			layout : "absolute",
			height : 52,
			items : [new lib.ImageButton.ImageButton({
						autoEl : {
							tag : "img",
							src : "/Ext/resources/images/default/s.gif"
						},
						width : 16,
						height : 50,
						x : 0,
						y : 1,
						cls : "formula-info-clps-icon",
						imgNormal : "/Ext/resources/images/default/s.gif",
						imgOver : "/Ext/resources/images/default/s.gif",
						imgClicked : "/Ext/resources/images/default/s.gif",
						actionFn : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							expand()
						}
					})]
		}]
	});
	function onCancel(btn, e) {
		dev.report.base.app.gridBlurObserver.notify(this);
		dev.report.base.action.cancelGridInput()
	}
	function onEnter(btn, e) {
		dev.report.base.app.gridBlurObserver.notify(this);
		dev.report.base.action.sendGridInput(e)
	}
	function onInsertFunction() {
		dev.report.base.app.gridBlurObserver.notify(this);
		using("dev.report.base.dlg.InsertFunction");
		var insertFunction=new dev.report.base.dlg.InsertFunction({
				id : "fbar",
				fn : null
			}, dev.report.base.app.currFormula.getValue()
		);
	}
	function expand(w, h) {
		if (_expanded) {
			_formulaBar.setHeight(25);
			var h=dev.report.base.app.Report.operatePanel.getHeight()-28;
			dev.report.base.app.Report.operatePanel.setHeight(h);
			
			var nh=dev.report.base.app.Report.TabNav.getHeight();
			dev.report.base.app.Report.TabNav.setHeight(nh+28);

			dev.report.base.app.Report.reportMain.el.dom.style.top=h+"px";
			if (_isWebKit) {
				dev.report.base.app.currFormula.getEl().applyStyles(_webkitCSSclps)
			}
			dev.report.base.app.expandBtn.getLayout().setActiveItem(0)
		} else {
			_formulaBar.setHeight(53);
			var h=dev.report.base.app.Report.operatePanel.getHeight()+28;
			dev.report.base.app.Report.operatePanel.setHeight(h);
			
			var nh=dev.report.base.app.Report.TabNav.getHeight();
			dev.report.base.app.Report.TabNav.setHeight(nh-28);

			dev.report.base.app.Report.reportMain.el.dom.style.top=h+"px";
			if (_isWebKit) {
				dev.report.base.app.currFormula.getEl().applyStyles(_webkitCSSexp)
			}
			dev.report.base.app.expandBtn.getLayout().setActiveItem(1)
		}
		_expanded = !_expanded;
		dev.report.base.app.handlers.expandCollapseFormulaBar()
	}
	function insertName(name) {
		if (validateName(name)) {
			var position = dev.report.base.app.environment.defaultSelection
					.getActiveRange().getActiveCell(), tmpScope = "", refers_to = "="
					.concat(getSheetName(), "!",
							dev.report.base.app.environment.defaultSelection
									.getActiveRange().getValue(true)), cmds = [];
			function onErrClb() {
				showMessage("New name".localize(), "inset_name_err_msg"
								.localize(), "ERROR")
			}
			cmds.push(["nadd", [position._x, position._y, {
								name : name,
								refers_to : refers_to,
								scope : tmpScope,
								comment : ""
							}]]);
			(new dev.report.backend.CCmdDiffAsyncRqst(cmds)).setOnError([this,
					onErrClb]).send()
		} else {
			showMessage("New Name".localize(), "currCoord_validate_err_msg"
							.localize(), "WARNING")
		}
		function validateName(name) {
			var result = false;
			var my_regexp_ALLOWED_CHARS = /^[a-zA-Z_\\][a-zA-Z0-9_\-\.]+$/;
			var my_regexp_RESERVED_NAMES = /^([a-zA-Z]{1,2}[0-9]{1,5})+$/;
			var my_regexp_RESERVED_CELL_REF = /^[rR]{1}[0-9]{1,5}([cC]{1}[0-9]{1,5})*$/;
			if (((name.length > 1 && name.length < 256) && (my_regexp_ALLOWED_CHARS
					.test(name) && !my_regexp_RESERVED_NAMES.test(name)))
					&& !my_regexp_RESERVED_CELL_REF.test(name)) {
				result = true
			}
			return result
		}
		function getSheetName() {
			var sheetName = dev.report.base.app.activeBook.getSheetSelector()
					.getActiveSheetName();
			return sheetName.search(/ /) >= 0 ? sheetName = "'".concat(
					sheetName, "'") : sheetName
		}
		function showMessage(title, msg, type) {
			Ext.Msg.show({
						title : title,
						msg : msg,
						buttons : Ext.Msg.OK,
						fn : function() {
							dev.report.base.app.currCoord
									.setValue(dev.report.base.app.currCoord.tmpValue)
						},
						animEl : "elId",
						width : 320,
						icon : Ext.MessageBox[type]
					})
		}
	}
};