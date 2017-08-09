Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.control");
dev.report.base.dlg.control.Source = function(callback, _pre, tabOffset, thats) {
	if (!tabOffset) {
		tabOffset = 0
	}
	var srcComboData = [["none", "None".localize()],
			["range", "Range".localize()], ["function", "Function".localize()],
			["macro", "Macro".localize()]];
	var srcDatReg = {
		none : 0,
		"" : 0,
		range : 1,
		"function" : 2,
		macro : 3,
		subset : 4
	};
	var srcPreType = (srcDatReg[_pre.srctype]) ? srcDatReg[_pre.srctype] : 0;
	var srcType = (_pre.srctype) ? _pre.srctype : "none";
	var srcComboStore = new Ext.data.ArrayStore({
				fields : ["src", "desc"],
				idIndex : 0,
				data : srcComboData
			});
	var srcCombo = new Ext.form.ComboBox({
				typeAhead : false,
				editable : false,
				triggerAction : "all",
				disabled : thats.typeDisabled,
				width : 150,
				value : srcComboData[srcPreType][1],
				lazyRender : true,
				tabIndex : tabOffset + 2,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				mode : "local",
				store : srcComboStore,
				valueField : "src",
				displayField : "desc",
				listeners : {
					select : function(c, r, i) {
						sourceCardHolder.layout.setActiveItem(i);
						sourceCardHolder.doLayout();
						sourceCardHolder.layout.activeItem.doLayout();
						thats.containers.srcCard = sourceCardHolder.layout.activeItem;
						formulaField.setValue("");
						srcType = srcComboData[i][0]
					}
				}
			});
	function selRange(selected) {
		Ext.getCmp("formatControlDialog").show();
		setTimeout(function() {
					rangeFld.setValue(selected);
					formulaField.setValue("=".concat(selected))
				}, 1)
	}
	var selectorBtn = new Ext.Button({
				id : "selBtnsrc",
				iconCls : "select-range-icon",
				tabIndex : tabOffset + 4,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				cls : "x-btn-icon",
				tooltip : "Select Range".localize(),
				handler : function() {
					using("dev.report.base.dlg.SelectRange");
					var selectRange=new dev.report.base.dlg.SelectRange({
										fnc : [this, selRange],
										format : "{Sheet}!{Range}",
										rng : rangeFld.getValue(),
										omitInitSheet : true
					});
					Ext.getCmp("formatControlDialog").hide()
				}
			});
	var srcTypeOld = "none";
	var sourceWiz = new Ext.form.Radio({
				id : "wFCtrlDlg_sourceSubset_rd",
				checked : !thats.typeDisabled,
				name : "radioSourceForm",
				tabIndex : tabOffset + 1,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				boxLabel : "",
				style : "height: 25px;",
				listeners : {
					check : function(thisRb, isChecked) {
						if (isChecked) {
							thats.typeDisabled = false;
							if (_pre.type == dev.report.base.wsel.type.WIDGET) {
								srcCombo.enable();
								sourceCardHolder.layout.activeItem.enable();
								srcType = srcTypeOld
							} else {
								subsetBtnS.enable()
							}
							formulaField.disable()
						}
					}
				}
			});
	var sourceFormula = new Ext.form.Radio({
				id : "wFCtrlDlg_sourceFormula_rd",
				checked : thats.typeDisabled,
				name : "radioSourceForm",
				tabIndex : tabOffset + 10,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				boxLabel : "Formula".localize(),
				hideLabel : true,
				listeners : {
					check : function(thisRb, isChecked) {
						if (isChecked) {
							thats.typeDisabled = true;
							if (_pre.type == dev.report.base.wsel.type.WIDGET) {
								srcCombo.disable();
								sourceCardHolder.layout.activeItem.disable();
								srcTypeOld = srcType;
								srcType = "custom"
							} else {
								subsetBtnS.disable()
							}
							formulaField.enable()
						}
					}
				}
			});
	var rangeFld = new Ext.form.Field({
				hideLabel : true,
				width : 150,
				tabIndex : tabOffset + 3,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				listeners : {
					blur : function(f) {
						formulaField.setValue((f.getValue().charAt(0) == "=")
								? f.getValue()
								: "=".concat(f.getValue()))
					}
				}
			});
	var cardRangeHolder = new Ext.Panel({
				layout : "column",
				baseCls : "x-plain",
				bodyStyle : "padding-left: 10px;",
				autoWidth : true,
				items : [new Ext.Panel({
									baseCls : "x-plain",
									width : 150,
									border : false,
									layout : "form",
									items : [rangeFld]
								}), new Ext.Panel({
									baseCls : "x-plain",
									layout : "form",
									border : false,
									width : 50,
									items : [selectorBtn]
								})]
			});
	var cardRange = new Ext.Panel({
				layout : "form",
				xtype : "fieldset",
				autoHeight : true,
				baseCls : "x-plain",
				autoWidth : true,
				items : [cardRangeHolder],
				listeners : {
					enable : function(p) {
						rangeFld.enable();
						selectorBtn.enable()
					},
					disable : function(p) {
						rangeFld.disable();
						selectorBtn.disable()
					}
				}
			});
	var setFuncFn = function(cnf) {
		Ext.getCmp("formatControlDialog").show();
		formulaField.setValue(cnf);
		fnArgsButton.enable()
	};
	var fnButton = new Ext.Button({
				id : "fnbtn",
				tabIndex : tabOffset + 5,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				iconCls : "insert_formula_icon",
				text : "Select Function".localize(),
				cls : "x-btn-icon-text",
				handler : function() {
					Ext.getCmp("formatControlDialog").hide();
					using("dev.report.base.dlg.InsertFunction");
					var insertFunction=new dev.report.base.dlg.InsertFunction({
								id : "control",
								fn : setFuncFn
						}, formulaField.getValue()
					);
				}
			});
	var fnArgDisabled = (_pre.src && _pre.srctype == "function") ? false : true;
	var fnArgsButton = new Ext.Button({
				id : "fnargsbtn",
				tabIndex : tabOffset + 6,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				iconCls : "insert_formula_icon",
				text : "Function Arguments".localize(),
				disabled : fnArgDisabled,
				cls : "x-btn-icon-text",
				handler : function() {
					Ext.getCmp("formatControlDialog").hide();
					using("dev.report.base.dlg.FuncArgs");
					var funcArgs=new dev.report.base.dlg.FuncArgs(false,{
							fn : setFuncFn,
							id : "control"
					}, formulaField.getValue());
				}
			});
	var cardFunction = new Ext.Panel({
				layout : "column",
				xtype : "fieldset",
				autoHeight : true,
				bodyStyle : "padding-left: 10px;",
				baseCls : "x-plain",
				autoWidth : true,
				items : [new Ext.Panel({
									baseCls : "x-plain",
									width : 105,
									items : [fnButton]
								}), new Ext.Panel({
									baseCls : "x-plain",
									width : 130,
									items : [fnArgsButton]
								})],
				listeners : {
					enable : function(p) {
						fnButton.enable();
						fnArgsButton.enable()
					},
					disable : function(p) {
						fnButton.disable();
						fnArgsButton.disable()
					}
				}
			});
	var _getMacroData = function() {
		return {
			type : dev.report.base.wsel.type.WIDGET,
			name : Ext.getCmp("txtName").getValue(),
			macros : {}
		}
	};
	var tmpMacro = (thats._gendata && _pre.srctype == "macro")
			? thats._gendata
			: false;
	var setFunctionFromMacro = function(args) {
		Ext.getCmp("formatControlDialog").show();
		formulaField.setValue(args)
	};
	var getMacro = function(data) {
		tmpMacro = data;
		var macroName = data.macros.Widget.slice(data.macros.Widget
				.indexOf(".")
				+ 1);
		var ff = ["MACRO", macroName,
				macroName.concat("(argument1, argument2,...)"),
				"Adds any parameter to custom function", [{
					t : "sequence",
					c : 30,
					m : [{
						t : "any",
						n : "Parameter",
						d : "parameter1, parameter2, ... are 1 to 30 parameters to be passed to macro function. Any type allowed."
					}]
				}]];
		macroArgsBtn.enable();
		thats._gendata = retPanel._gendata = data;
		using("dev.report.base.dlg.FuncArgs");
		var funcArgs=new dev.report.base.dlg.FuncArgs(ff, {
							fn : setFunctionFromMacro,
							id : "widget"
		});
	};
	var macroAssignBtn = new Ext.Button({
				iconCls : "icon_macro",
				text : "Assign Macro".localize(),
				tabIndex : tabOffset + 6,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				cls : "x-btn-icon-text",
				handler : function() {
					Ext.getCmp("formatControlDialog").hide();
					using("dev.report.base.dlg.InsertMacro");
					var insertMacro=new dev.report.base.dlg.InsertMacro(_getMacroData(), "widget", getMacro);
				}
			});
	var macroArgsBtn = new Ext.Button({
		iconCls : "icon_macro_editor",
		text : "Macro Arguments".localize(),
		cls : "x-btn-icon-text",
		tabIndex : tabOffset + 7,
		ctCls : dev.report.kbd.Base.tags.NO_ENTER,
		disabled : !tmpMacro,
		handler : function() {
			var macroName = (tmpMacro.macros) ? tmpMacro.macros.Widget
					.slice(tmpMacro.macros.Widget.indexOf(".") + 1) : _pre.src
					.slice(1, _pre.src.indexOf("("));
			var ff = ["MACRO", macroName,
					macroName.concat("(argument1, argument2,...)"),
					"Adds any parameter to custom function", [{
						t : "sequence",
						c : 30,
						m : [{
							t : "any",
							n : "Parameter",
							d : "parameter1, parameter2, ... are 1 to 30 parameters to be passed to macro function. Any type allowed."
						}]
					}]];
			Ext.getCmp("formatControlDialog").hide();
			using("dev.report.base.dlg.FuncArgs");
			var funcArgs=new dev.report.base.dlg.FuncArgs(ff, {
				fn : setFunctionFromMacro,
				id : "widget"
			}, formulaField.getValue());
		}
	});
	var cardMacro = new Ext.Panel({
				layout : "column",
				autoHeight : true,
				bodyStyle : "padding-left: 10px;",
				baseCls : "x-plain",
				autoWidth : true,
				items : [new Ext.Panel({
									baseCls : "x-plain",
									width : 105,
									items : [macroAssignBtn]
								}), new Ext.Panel({
									baseCls : "x-plain",
									width : 120,
									items : [macroArgsBtn]
								})],
				listeners : {
					enable : function(p) {
						macroAssignBtn.enable();
						macroArgsBtn.enable()
					},
					disable : function(p) {
						macroAssignBtn.disable();
						macroArgsBtn.disable()
					}
				}
			});
	var setFuncText = function(cnf) {
		formulaField.setValue(cnf.ss_func);
		retPanel._gendata = thats._gendata = cnf._gendata
	};
	var sourceCardHolder = new Ext.Panel({
				layout : "card",
				baseCls : "x-plain",
				autoWidth : true,
				activeItem : srcPreType,
				deferredRender : true,
				items : [{
							baseCls : "x-plain",
							autoWidth : true
						}, cardRange, cardFunction, cardMacro/*, cardSubset*/],
				listeners : {
					afterLayout : function(p, l) {
						thats.containers.srcCard = p.layout.activeItem
					}
				}
			});
	var wizPan = new Ext.Panel({
				layout : "column",
				baseCls : "x-plain",
				border : false,
				items : [
						(thats.containers.srcR = new Ext.Panel({
									baseCls : "x-plain",
									width : 18,
									items : [sourceWiz]
								})),
						(thats.containers.srcCmb = new Ext.Panel({
									baseCls : "x-plain",
									width : 150,
									items : [ srcCombo
											]
								})),
						(thats.containers.srcCard = new Ext.Panel({
									baseCls : "x-plain",
									layout : "form",
									xtype : "fieldset",
									width : 250,
									items : [
										sourceCardHolder
											]
								}))]
			});
	var formulaField = new Ext.form.Field({
				id : "wFCtrlDlg_formula_fld",
				hideLabel : true,
				disabled : !thats.typeDisabled,
				allowBlank : true,
				tabIndex : tabOffset + 11,
				ctCls : dev.report.kbd.Base.tags.NO_ENTER,
				value : thats.functionValue,
				width : 420
			});
	var ffHolder = new Ext.Panel({
				baseCls : "x-plain",
				bodyStyle : "padding-left: 18px;",
				items : [formulaField]
			});
	var fsSource = Ext.extend(Ext.form.FieldSet, {
				getFuncText : function() {
					return formulaField.getValue()
				},
				getTypeDisabled : function() {
					return thats.typeDisabled
				},
				getSrcType : function() {
					return srcType
				},
				getGenData : function() {
					if (thats.typeDisabled) {
						return []
					}
					return this._gendata
				},
				_gendata : (_pre._gendata) ? _pre._gendata : [],
				initComponent : function() {
					Ext.apply(this, {});
					fsSource.superclass.initComponent.call(this)
				}
			});
	var ffPan = thats.containers.formulaFld = new Ext.Panel({
				baseCls : "x-plain",
				layout : "form",
				items : [sourceFormula, ffHolder]
			});
	var retPanel = new fsSource({
				title : "Source".localize(),
				collapsible : false,
				id : "src_pan",
				autoWidth : true,
				autoHeight : true,
				items : [wizPan, ffPan],
				listeners : {
					afterLayout : function(p, l) {
					}
				}
			});
	switch (_pre.srctype) {
		case "range" :
			rangeFld.setValue(_pre.src);
			break;
		case "function" :
			break;
		case "macro" :
			break;
		case "subset" :
			break
	}
	callback(retPanel)
};