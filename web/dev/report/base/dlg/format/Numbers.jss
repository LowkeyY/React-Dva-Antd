

Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.format");
using("lib.spinner.Spinner");
using("lib.spinner.form.SpinnerField");
dev.report.base.dlg.format.Numbers = function(callback, _pre, toDisable, isFromOther,
		tabOffset, setContainer, displayClear) {
	var rawCellValue = dev.report.base.app.environment.selectedCellValue;
	function formatString(fString, fValue) {
		cellFormattingString = fString;
		var cb = function(str, data) {
			cellFormattedString = str;
			var tmpRec = new sampleViewTmp({
						formatted_value : cellFormattedString
					});
			sampleViewStore.removeAll();
			sampleViewStore.insert(0, tmpRec)
		};
		dev.report.base.fmt.val([this, cb], fString, fValue, false)
	}
	var cellFormattedString = "";
	var initNumCard = 0;
	var initNumCard, indexMarker, NFAttrib1, NFAttrib2, NFAttrib3, cellFormattingString, initialCustomFmt, preFormattingString;
	function doPreselection(data, psf) {
		if (isFromOther) {
			preFormattingString = psf;
			if (_pre && psf) {
				preFormattingString.unshift(_pre)
			}
		} else {
			preFormattingString = data
		}
		if (!preFormattingString) {
			preFormattingString = [(isFromOther) ? null : "general", 0, 2,
					false, 0]
		}
		initNumCard = preFormattingString[1];
		indexMarker = initNumCard;
		NFAttrib1 = preFormattingString[2] || 0;
		NFAttrib2 = preFormattingString[3] || null;
		NFAttrib3 = preFormattingString[4] || null;
		cellFormattingString = preFormattingString[0];
		initialCustomFmt = (initNumCard == 11)
				? cellFormattingString
				: initialCustomFmt = "";
		initComponents();
		formatString(cellFormattingString, rawCellValue);
		categorySelector.select(initNumCard, false, false);
		Ext.getCmp("main_format_content").layout.setActiveItem(initNumCard);
		Ext.getCmp("num_description").layout.setActiveItem(initNumCard);
		switch (initNumCard) {
			case 1 :
			case 2 :
				Ext.getCmp("wFmtCells_negNum".concat(initNumCard, "_dv"))
						.select(NFAttrib3, false, true);
				break;
			case 3 :
				break;
			case 4 :
				Ext.getCmp("wFmtCells_dateType_dv").select(
						dateTypeStore.findExact("formatting_str",
								cellFormattingString), false, true);
				break;
			case 5 :
				Ext.getCmp("wFmtCells_timeType_dv").select(
						timeTypeStore.findExact("formatting_str",
								cellFormattingString), false, true);
				break;
			case 7 :
				Ext.getCmp("wFmtCells_fraction_dv").select(
						fractionTypeStore.findExact("formatting_str",
								cellFormattingString), false, true);
				break;
			default :
				break
		}
	}
	var _clear = function() {
		categorySelector.select(0, false, false);
		Ext.getCmp("main_format_content").layout.setActiveItem(0);
		Ext.getCmp("num_description").layout.setActiveItem(0);
		cellFormattingString = "general";
		formatString(cellFormattingString, rawCellValue);
		cellFormattingString = false
	};
	var onCategorySelect = function(dView, index, node, ev) {
		indexMarker = index;
		Ext.getCmp("main_format_content").layout.setActiveItem(index);
		Ext.getCmp("num_description").layout.setActiveItem(index);
		var ai = Ext.getCmp("main_format_content").layout.activeItem;
		var toSet = {};
		toSet[ai.id] = ai;
		setContainer(toSet);
		switch (index) {
			case 0 :
				cellFormattingString = "general";
				formatString(cellFormattingString, rawCellValue);
				formattingStringDesc = [0];
				break;
			case 1 :
				cellFormattingString = "0";
				var stopper = decPlacesSpinner.getValue();
				stopper++;
				for (i = 1; i < stopper; i++) {
					cellFormattingString = (i == 1) ? cellFormattingString
							.concat(".0") : cellFormattingString.concat("0")
				}
				decPlacesSpinner.setWidth(57);
				if (NFAttrib2 != true) {
					Ext.getCmp("wFmtCells_thSep_chk").setValue(false)
				}
				if (NFAttrib3 > 0) {
					formatNegativeNum(NFAttrib3)
				} else {
					formatString(cellFormattingString, rawCellValue)
				}
				Ext.getCmp("wFmtCells_negNum1_dv").select(NFAttrib3, false,
						true);
				break;
			case 2 :
				cellFormattingString = "#,##0";
				var stopper = decPlacesSpinner2.getValue();
				stopper++;
				for (i = 1; i < stopper; i++) {
					cellFormattingString = (i == 1) ? cellFormattingString
							.concat(".0") : cellFormattingString.concat("0")
				}
				decPlacesSpinner2.setWidth(57);
				if (NFAttrib2 != false
						&& currencyListStore.findExact("csymbol", NFAttrib2) > -1) {
					cellFormattingString = NFAttrib2
							.concat(cellFormattingString);
					Ext.getCmp("wFmtCells_curr1_cmb")
							.setValue(currency_list[currencyListStore
									.findExact("csymbol", NFAttrib2)][1])
				}
				if (NFAttrib3 > 0) {
					formatNegativeNum(NFAttrib3)
				} else {
					formatString(cellFormattingString, rawCellValue)
				}
				Ext.getCmp("wFmtCells_negNum2_dv").select(NFAttrib3, false,
						true);
				break;
			case 3 :
				cellFormattingString = "#,##0";
				var stopper = decPlacesSpinner3.getValue();
				stopper++;
				for (i = 1; i < stopper; i++) {
					cellFormattingString = (i == 1) ? cellFormattingString
							.concat(".0") : cellFormattingString.concat("0")
				}
				if (NFAttrib2 != false
						&& currencyListStore.findExact("csymbol", NFAttrib2) > -1) {
					cellFormattingString = NFAttrib2
							.concat(cellFormattingString);
					Ext.getCmp("wFmtCells_curr2_cmb")
							.setValue(currency_list[currencyListStore
									.findExact("csymbol", NFAttrib2)][1])
				}
				decPlacesSpinner3.setWidth(57);
				formatString(cellFormattingString, rawCellValue);
				break;
			case 4 :
				cellFormattingString = "d.m.yyyy";
				formatString(cellFormattingString, rawCellValue);
				Ext.getCmp("wFmtCells_dateType_dv").select(
						dateTypeStore.findExact("formatting_str",
								cellFormattingString), false, true);
				break;
			case 5 :
				cellFormattingString = "[$-F400]HH:mm:ss";
				formatString(cellFormattingString, rawCellValue);
				Ext.getCmp("wFmtCells_timeType_dv").select(
						timeTypeStore.findExact("formatting_str",
								cellFormattingString), false, true);
				break;
			case 6 :
				cellFormattingString = "0";
				var stopper = decPlacesSpinner4.getValue();
				stopper++;
				for (i = 1; i < stopper; i++) {
					cellFormattingString = (i == 1) ? cellFormattingString
							.concat(".0") : cellFormattingString.concat("0")
				}
				cellFormattingString = cellFormattingString.concat("%");
				decPlacesSpinner4.setWidth(57);
				formatString(cellFormattingString, rawCellValue);
				break;
			case 7 :
				cellFormattingString = "# ?/?";
				formatString(cellFormattingString, rawCellValue);
				Ext.getCmp("wFmtCells_fraction_dv").select(
						fractionTypeStore.findExact("formatting_str",
								cellFormattingString), false, true);
				break;
			case 8 :
				cellFormattingString = "0";
				var stopper = decPlacesSpinner5.getValue();
				stopper++;
				for (i = 1; i < stopper; i++) {
					cellFormattingString = (i == 1) ? cellFormattingString
							.concat(".0") : cellFormattingString.concat("0")
				}
				cellFormattingString = cellFormattingString.concat("E+00");
				decPlacesSpinner5.setWidth(57);
				formatString(cellFormattingString, rawCellValue);
				break;
			case 9 :
				cellFormattingString = "@";
				formatString(cellFormattingString, rawCellValue);
				break;
			case 10 :
				cellFormattingString = "";
				formatString(cellFormattingString, rawCellValue);
				break;
			case 11 :
				cellFormattingString = "";
				formatString(cellFormattingString, rawCellValue);
				break
		}
	};
	var cellNumberFormat = [["general", "General".localize()],
			["number", "Number".localize()],
			["currency", "Currency".localize()],
			["accounting", "Accounting".localize()],
			["date", "Date".localize()], ["time", "Time".localize()],
			["percentage", "Percentage".localize()],
			["fraction", "Fraction".localize()],
			["scientific", "Scientific".localize()],
			["text", "Text".localize()], ["special", "Special".localize()],
			["custom", "Custom".localize()]];
	var numberNegativeFormat = [
			["normal", "".concat("<span>&#160;", "-1234,10", "</span>")],
			[
					"red",
					"".concat('<span style="color:#FF0000;">&#160;', "1234,10",
							"</span>")],
			["negative", "".concat("<span>&#160;", "(1234,10)", "</span>")],
			[
					"red_negative",
					"".concat('<span style="color:#FF0000;">&#160;',
							"(1234,10)", "</span>")]];
	var currency_list = [["dollar", "$ US Dollar", "[$$]", true],
			["euro", "€ Euro", "[$€]", false],
			["pound", "£ GB Pound", "[$£]", true],
			["swiss", "CHF Swiss Francs", "[$CHF]", false],
			["japan", "Y Japanese Yen", "[$Y]", false],
			["turkey", "YTL Turkey Liras", "[$YTL]", false],
			["polska", "ZL Poland Zlotych", "[$ZL]", false],
			["israel", "ISH Israel, New Shekels", "[$ISH]", false],
			["hongkong", "HKD Hong Kong Dollar", "[$HKD]", false],
			["czech", "KC Czech Koruny", "[$KC]", false],
			["china", "CNY China Yuan", "[$CNY]", false],
			["russia", "P Russian Rubles", "[$RUB]", false]];
	var currencyListStore = new Ext.data.SimpleStore({
				fields : ["cname", "cdesc", "csymbol", "iso"],
				data : currency_list
			});
	var fractionType = [["1", "Up to one digit(1/4)".localize(), "# ?/?"],
			["2", "Up to two digits(21/35)".localize(), "# ??/??"],
			["3", "Up to three digits(312/943)".localize(), "# ???/???"],
			["4", "Up to halves(1/2)".localize(), "# ?/2"],
			["5", "Up to quarters(2/4)".localize(), "# ?/4"],
			["6", "Up to eights(4/8)".localize(), "# ?/8"],
			["7", "Up to sixteenths(8/16)".localize(), "# ?/16"],
			["8", "Up to tenths(3/10)".localize(), "# ?/10"],
			["9", "Up to hundredths(30/100)".localize(), "# ?/100"]];
	var dateType = [
			["1", "*16.5.2009", "d.m.yyyy"],
			["2", "*16. ".concat("may".localize(), " 2009"), "d. mmm yyyy"],
			["3", "16.5.2009", "dd.m.yyyy"],
			["4", "16.5.09", "dd.m.yy"],
			["5", "16. 5. 2009", "dd. m. yyyy"],
			["6", "16.05.2009", "dd.mm.yyyy"],
			["7", "16. 5. 09", "dd. m. yy"],
			["8", "2009-05-16", "yyyy-mm-dd"],
			["9", "16. ".concat("may".localize(), " 2009"), "dd. mmmm yyyy"],
			["10", "Thu".localize().concat(" 16. ", "may".localize(), " 2009"),
					"dddd, d. mmmm yyyy"]];
	var timeType = [["1", "*16:25:00", "h:mm:ss"],
			["2", "16:25:00", "hh:mm:ss"], ["3", "16:25", "hh:mm"]];
	var dateTypeStore = new Ext.data.SimpleStore({
				fields : ["nn", "date_format", "formatting_str"],
				data : dateType
			});
	var fractionTypeStore = new Ext.data.SimpleStore({
				fields : ["nn", "fraction_format", "formatting_str"],
				data : fractionType
			});
	var timeTypeStore = new Ext.data.SimpleStore({
				fields : ["nn", "time_format", "formatting_str"],
				data : timeType
			});
	var cellNumberFormatStore = new Ext.data.SimpleStore({
				fields : ["catname", "catlabel"],
				data : cellNumberFormat
			});
	var numberNegativeStore = new Ext.data.SimpleStore({
				fields : ["num_name", "num_format"],
				data : numberNegativeFormat
			});
	var sampleView, sampleViewStore, sampleDataView, sampleViewTmp, numDescription, decPlacesSpinner, decPlacesSpinner2, decPlacesSpinner3, decPlacesSpinner4, decPlacesSpinner5, customFormatting, formatNegativeNum, numberTabContainer, currencyTabContainer, accountingTabContainer, dateTabContainer, timeTabContainer, percentageTabContainer, fractionTabContainer, scientificTabContainer, textTabContainer, specialTabContainer, customTabContainer, cardPanelNumber, mainField, categorySelector, numberTab, clearBtn;
	function initComponents() {
		sampleView = [[rawCellValue]];
		sampleViewStore = new Ext.data.SimpleStore({
					fields : ["formatted_value"],
					data : sampleView
				});
		sampleDataView = new Ext.DataView({
			id : "wFmtCells_numSamle_dv",
			itemSelector : ".border-field-chooser",
			style : "overflow:auto",
			autoWidth : true,
			singleSelect : true,
			store : sampleViewStore,
			cls : "borderStyleSelect",
			tpl : new Ext.XTemplate('<div><tpl for=".">{formatted_value}</tpl></div>')
		});
		sampleViewTmp = new Ext.data.Record.create([{
					name : "formatted_value"
				}]);
		numDescription = new Ext.Panel({
					id : "num_description",
					layout : "card",
					autoWidth : true,
					baseCls : "x-plain",
					defaults : {
						bodyStyle : "background-color: transparent; padding-top: 10px;"
					},
					border : false,
					activeItem : initNumCard,
					region : "center",
					items : [{
								border : false
							}, {
								html : "_catDescr: number".localize(),
								border : false
							}, {
								html : "_catDescr: currency".localize(),
								border : false
							}, {
								html : "_catDescr: accounting".localize(),
								border : false
							}, {
								html : "_catDescr: date".localize(),
								border : false
							}, {
								html : "_catDescr: time".localize(),
								border : false
							}, {
								html : "_catDescr: percentage".localize(),
								border : false
							}, {
								html : "".localize(),
								border : false
							}, {
								html : "".localize(),
								border : false
							}, {
								html : "".localize(),
								border : false
							}, {
								html : "_catDescr: special".localize(),
								border : false
							}, {
								html : "_catDescr: custom".localize(),
								border : false
							}]
				});
		decPlacesSpinner = new lib.spinner.form.SpinnerField({
					name : "dec_places",
					allowBlank : false,
					minValue : 0,
					id : "wFmtCells_numdpNumber_spn",
					maxValue : 50,
					xtype : "number",
					fieldLabel : "Decimal places".localize(),
					width : 40,
					border : false,
					tabIndex : 1 + tabOffset,
					value : NFAttrib1,
					enableKeyEvents : true,
					listeners : {
						keyup : function(fld, e) {
							var tmpVal = this.getRawValue();
							tmpVal = parseInt(tmpVal);
							this.setValue(tmpVal);
							NFAttrib1 = this.getValue();
							var fmtStr = (tmpVal == 0) ? "0" : "0.";
							for (i = 1; i < tmpVal + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2) {
								fmtStr = "#,##".concat(fmtStr)
							}
							if (NFAttrib3 > 0) {
								cellFormattingString = fmtStr;
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(fmtStr, rawCellValue)
							}
						},
						spinup : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0) ? "0" : "0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2) {
								fmtStr = "#,##".concat(fmtStr)
							}
							if (NFAttrib3 > 0) {
								cellFormattingString = fmtStr;
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(fmtStr, rawCellValue)
							}
						},
						spindown : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0) ? "0" : "0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2) {
								fmtStr = "#,##".concat(fmtStr)
							}
							if (NFAttrib3 > 0) {
								cellFormattingString = fmtStr;
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(fmtStr, rawCellValue)
							}
						}
					}
				});
		decPlacesSpinner2 = new lib.spinner.form.SpinnerField({
					id : "wFmtCells_numdpCurrency_spn",
					name : "dec_places_2",
					allowBlank : false,
					minValue : 0,
					maxValue : 50,
					fieldLabel : "Decimal places".localize(),
					width : 40,
					tabIndex : 5 + tabOffset,
					border : false,
					value : NFAttrib1,
					enableKeyEvents : true,
					listeners : {
						keyup : function(fld, e) {
							var tmpVal = this.getRawValue();
							tmpVal = parseInt(tmpVal);
							this.setValue(tmpVal);
							NFAttrib1 = this.getValue();
							var fmtStr = (tmpVal == 0) ? "0" : "0.";
							for (i = 1; i < tmpVal + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2) {
								fmtStr = "#,##".concat(fmtStr)
							}
							if (NFAttrib3 > 0) {
								cellFormattingString = fmtStr;
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(fmtStr, rawCellValue)
							}
						},
						spinup : function() {
							if (!NFAttrib2) {
								NFAttrib2 = ""
							}
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0)
									? "#,##0"
									: "#,##0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2 != true) {
								var cs = currencyListStore.findExact("csymbol",
										NFAttrib2);
								var pos = (cs >= 0)
										? currency_list[cs][3]
										: true;
								fmtStr = pos
										? NFAttrib2.concat(fmtStr)
										: fmtStr.concat(" ", NFAttrib2)
							}
							if (NFAttrib3 > 0) {
								cellFormattingString = fmtStr;
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(fmtStr, rawCellValue)
							}
						},
						spindown : function() {
							if (!NFAttrib2) {
								NFAttrib2 = ""
							}
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0)
									? "#,##0"
									: "#,##0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2 != true) {
								var cs = currencyListStore.findExact("csymbol",
										NFAttrib2);
								var pos = (cs >= 0)
										? currency_list[cs][3]
										: true;
								fmtStr = pos
										? NFAttrib2.concat(fmtStr)
										: fmtStr.concat(" ", NFAttrib2)
							}
							if (NFAttrib3 > 0) {
								cellFormattingString = fmtStr;
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(fmtStr, rawCellValue)
							}
						}
					}
				});
		decPlacesSpinner3 = new lib.spinner.form.SpinnerField({
					id : "wFmtCells_numdpAccounting_spn",
					name : "dec_places_3",
					minValue : 0,
					maxValue : 50,
					allowBlank : false,
					fieldLabel : "Decimal places".localize(),
					width : 40,
					tabIndex : 10 + tabOffset,
					border : false,
					value : NFAttrib1,
					enableKeyEvents : true,
					listeners : {
						keyup : function(fld, e) {
							var tmpVal = this.getRawValue();
							tmpVal = parseInt(tmpVal);
							this.setValue(tmpVal);
							NFAttrib1 = this.getValue();
							var fmtStr = (tmpVal == 0) ? "#,##0" : "#,##0.";
							for (i = 1; i < tmpVal + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2 != true) {
								fmtStr = fmtStr.concat(NFAttrib2)
							}
							formatString(fmtStr, rawCellValue)
						},
						spinup : function() {
							if (!NFAttrib2) {
								NFAttrib2 = ""
							}
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0)
									? "#,##0"
									: "#,##0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2 != true) {
								var cs = currencyListStore.findExact("csymbol",
										NFAttrib2);
								var pos = (cs >= 0)
										? currency_list[cs][3]
										: true;
								fmtStr = pos
										? NFAttrib2.concat(fmtStr)
										: fmtStr.concat(" ", NFAttrib2)
							}
							formatString(fmtStr, rawCellValue)
						},
						spindown : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0)
									? "#,##0"
									: "#,##0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							if (NFAttrib2 != true) {
								var cs = currencyListStore.findExact("csymbol",
										NFAttrib2);
								var pos = (cs >= 0)
										? currency_list[cs][3]
										: true;
								fmtStr = pos
										? NFAttrib2.concat(fmtStr)
										: fmtStr.concat(" ", NFAttrib2)
							}
							formatString(fmtStr, rawCellValue)
						}
					}
				});
		decPlacesSpinner4 = new lib.spinner.form.SpinnerField({
					id : "wFmtCells_numdpPercentage_spn",
					name : "dec_places_2",
					allowBlank : false,
					fieldLabel : "Decimal places".localize(),
					width : 40,
					minValue : 0,
					maxValue : 50,
					border : false,
					tabIndex : 25 + tabOffset,
					value : NFAttrib1,
					enableKeyEvents : true,
					listeners : {
						keyup : function(fld, e) {
							var tmpVal = this.getRawValue();
							tmpVal = parseInt(tmpVal);
							this.setValue(tmpVal);
							NFAttrib1 = this.getValue();
							var fmtStr = (tmpVal == 0) ? "0" : "0.";
							for (i = 1; i < tmpVal + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							fmtStr = fmtStr.concat("%");
							formatString(fmtStr, rawCellValue)
						},
						spinup : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0) ? "0" : "0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							fmtStr = fmtStr.concat("%");
							formatString(fmtStr, rawCellValue)
						},
						spindown : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0) ? "0" : "0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							fmtStr = fmtStr.concat("%");
							formatString(fmtStr, rawCellValue)
						}
					}
				});
		decPlacesSpinner5 = new lib.spinner.form.SpinnerField({
					id : "wFmtCells_numdpScientific_spn",
					name : "dec_places_2",
					allowBlank : false,
					minValue : 0,
					maxValue : 50,
					fieldLabel : "Decimal places".localize(),
					width : 40,
					tabIndex : 35 + tabOffset,
					border : false,
					value : NFAttrib1,
					enableKeyEvents : true,
					listeners : {
						keyup : function(fld, e) {
							var tmpVal = this.getRawValue();
							tmpVal = parseInt(tmpVal);
							this.setValue(tmpVal);
							NFAttrib1 = this.getValue();
							var fmtStr = (tmpVal == 0) ? "0" : "0.";
							for (i = 1; i < tmpVal + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							fmtStr = fmtStr.concat("E+00");
							formatString(fmtStr, rawCellValue)
						},
						spinup : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0) ? "0" : "0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							fmtStr = fmtStr.concat("E+00");
							formatString(fmtStr, rawCellValue)
						},
						spindown : function() {
							var decPlacesNum = this.getValue();
							NFAttrib1 = this.getValue();
							var fmtStr = (decPlacesNum == 0) ? "0" : "0.";
							for (i = 1; i < decPlacesNum + 1; i++) {
								fmtStr = fmtStr.concat("0")
							}
							fmtStr = fmtStr.concat("E+00");
							formatString(fmtStr, rawCellValue)
						}
					}
				});
		customFormatting = new Ext.form.TextField({
					name : "custom_formatting",
					width : 295,
					tabIndex : 50 + tabOffset,
					value : initialCustomFmt,
					enableKeyEvents : true,
					listeners : {
						keyup : function(f, e) {
							var val = f.getValue();
							if (val.indexOf("__custom__") != 0) {
								val = "__custom__".concat(val)
							}
							formatString(val, rawCellValue)
						},
						blur : function(f) {
							var val = f.getValue();
							if (val.indexOf("__custom__") != 0) {
								f.setValue("__custom__".concat(val))
							}
						}
					}
				});
		formatNegativeNum = function(index) {
			NFAttrib3 = index;
			var nnf = numberNegativeFormat[index][0];
			switch (nnf) {
				case "normal" :
					break;
				case "red" :
					cellFormattingString = cellFormattingString.concat(
							";[Red]", cellFormattingString);
					break;
				case "negative" :
					cellFormattingString = cellFormattingString.concat("_);(",
							cellFormattingString, ")");
					break;
				case "red_negative" :
					cellFormattingString = cellFormattingString.concat(
							"_);[Red](", cellFormattingString, ")");
					break
			}
			formatString(cellFormattingString, rawCellValue)
		};
		numberTabContainer = new Ext.Panel({
			id : "numberTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			baseCls : "x-title-f",
			header : false,
			items : [{
				width : 162,
				bodyStyle : "margin-bottom: 5px; padding: 0px; background-color: transparent;",
				layout : "form",
				border : false,
				items : [decPlacesSpinner]
			}, new Ext.form.Checkbox({
				fieldLabel : "Active".localize(),
				name : "wFmtCells_thSep_chk",
				id : "wFmtCells_thSep_chk",
				checked : NFAttrib2,
				tabIndex : 2 + tabOffset,
				boxLabel : "Use 1000 Separator (.)".localize(),
				listeners : {
					check : {
						fn : function() {
							NFAttrib2 = this.getValue();
							if (NFAttrib3 > 0) {
								cellFormattingString = cellFormattingString
										.split(";")[0].replace(/_\)/i, "")
							}
							if (NFAttrib2) {
								cellFormattingString = "#,##"
										.concat(cellFormattingString)
							} else {
								cellFormattingString = cellFormattingString
										.replace(/#,##/i, "")
							}
							if (NFAttrib3 > 0) {
								formatNegativeNum(NFAttrib3)
							} else {
								formatString(cellFormattingString, rawCellValue)
							}
						}
					}
				}
			}), {
				html : "Negative numbers".localize().concat(":"),
				border : false,
				bodyStyle : "margin-bottom: 3px; margin-top: 9px; background-color: transparent;"
			}, new Ext.DataView({
						itemSelector : ".row-modeller",
						style : "overflow:auto",
						id : "wFmtCells_negNum1_dv",
						width : 295,
						height : 150,
						singleSelect : true,
						store : numberNegativeStore,
						cls : "listDataViewSelect",
						tpl : new Ext.XTemplate(
								'<div class="border-neg"><tpl for=".">',
								'<div class="row-modeller">',
								"{num_format}</div>", "</tpl></div>"),
						listeners : {
							click : function(dView, index, node, ev) {
								if (NFAttrib3 > 0) {
									cellFormattingString = cellFormattingString
											.split(";")[0].replace(/_\)/i, "")
								}
								formatNegativeNum(index)
							}
						}
					})]
		});
		currencyTabContainer = new Ext.Panel({
			id : "currencyTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			header : false,
			baseCls : "x-title-f",
			items : [{
				width : 162,
				bodyStyle : "margin-bottom: 5px; padding: 0px; background-color: transparent;",
				layout : "form",
				border : false,
				items : [decPlacesSpinner2]
			}, {
				layout : "form",
				baseCls : "x-plain",
				autoWidth : true,
				items : new Ext.form.ComboBox({
					fieldLabel : "Symbol".localize(),
					store : currencyListStore,
					displayField : "cdesc",
					hideLabel : false,
					labelSeparator : ":",
					id : "wFmtCells_curr1_cmb",
					editable : false,
					tabIndex : 6 + tabOffset,
					value : (NFAttrib2 != false && currencyListStore.findExact(
							"csymbol", NFAttrib2) > -1)
							? currency_list[currencyListStore.findExact(
									"csymbol", NFAttrib2)][1]
							: this.emptyText,
					typeAhead : true,
					mode : "local",
					triggerAction : "all",
					listeners : {
						select : {
							fn : function(el, e, index) {
								var tmpVal = decPlacesSpinner2.getValue();
								var fmtStr = (tmpVal == 0) ? "#,##0" : "#,##0.";
								for (i = 0; i < tmpVal; i++) {
									fmtStr = fmtStr.concat("0")
								}
								fmtStr = currency_list[index][3]
										? currency_list[index][2]
												.concat(fmtStr)
										: fmtStr.concat(" ",
												currency_list[index][2]);
								NFAttrib2 = currency_list[index][2];
								cellFormattingString = fmtStr;
								if (NFAttrib3 > 0) {
									formatNegativeNum(NFAttrib3)
								} else {
									formatString(cellFormattingString,
											rawCellValue)
								}
							},
							scope : this
						}
					},
					emptyText : "None".localize(),
					selectOnFocus : true,
					listWidth : 188,
					width : 173,
					maxHeight : 100
				})
			}, {
				html : "Negative numbers".localize().concat(":"),
				border : false,
				bodyStyle : "margin-bottom: 3px; margin-top: 1px; background-color: transparent;"
			}, new Ext.DataView({
						itemSelector : ".row-modeller",
						style : "overflow:auto",
						id : "wFmtCells_negNum2_dv",
						width : 295,
						height : 150,
						singleSelect : true,
						bodyStyle : "margin-bopttom: 0px;",
						store : numberNegativeStore,
						cls : "listDataViewSelect",
						tpl : new Ext.XTemplate(
								'<div class="border-neg"><tpl for=".">',
								'<div class="row-modeller">',
								"{num_format}</div>", "</tpl></div>"),
						listeners : {
							click : function(dView, index, node, ev) {
								if (NFAttrib3 > 0) {
									cellFormattingString = cellFormattingString
											.split(";")[0].replace(/_\)/i, "")
								}
								formatNegativeNum(index)
							}
						}
					})]
		});
		accountingTabContainer = new Ext.Panel({
			id : "accountingTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			header : false,
			baseCls : "x-title-f",
			items : [{
				width : 162,
				bodyStyle : "margin-bottom: 5px; padding: 0px; background-color: transparent;",
				layout : "form",
				border : false,
				items : [decPlacesSpinner3]
			}, {
				layout : "form",
				baseCls : "x-plain",
				autoWidth : true,
				items : new Ext.form.ComboBox({
					fieldLabel : "Symbol".localize(),
					store : currencyListStore,
					displayField : "cdesc",
					id : "wFmtCells_curr2_cmb",
					tabIndex : 11 + tabOffset,
					hideLabel : false,
					labelSeparator : ":",
					value : (NFAttrib2 != false && currencyListStore.findExact(
							"csymbol", NFAttrib2) > -1)
							? currency_list[currencyListStore.findExact(
									"csymbol", NFAttrib2)][1]
							: this.emptyText,
					editable : false,
					typeAhead : true,
					mode : "local",
					triggerAction : "all",
					listeners : {
						select : {
							fn : function(el, e, index) {
								var tmpVal = decPlacesSpinner3.getValue();
								var fmtStr = (tmpVal == 0) ? "#,##0" : "#,##0.";
								for (i = 0; i < tmpVal; i++) {
									fmtStr = fmtStr.concat("0")
								}
								fmtStr = currency_list[index][3]
										? currency_list[index][2]
												.concat(fmtStr)
										: fmtStr.concat(" ",
												currency_list[index][2]);
								NFAttrib2 = currency_list[index][2];
								formatString(fmtStr, rawCellValue)
							},
							scope : this
						}
					},
					emptyText : "None".localize(),
					selectOnFocus : true,
					listWidth : 188,
					width : 173,
					maxHeight : 100
				})
			}]
		});
		dateTabContainer = new Ext.Panel({
			id : "dateTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			baseCls : "x-title-f",
			header : false,
			items : [{
				html : "Type:",
				border : false,
				bodyStyle : "margin-bottom:2px; margin-top: 5px; background-color: transparent;"
			}, new Ext.Panel({
				border : true,
				width : 295,
				autoHeight : true,
				layout : "fit",
				items : new Ext.DataView({
					id : "wFmtCells_dateType_dv",
					itemSelector : ".DVSelector",
					style : "overflow:auto",
					overClass : "x-view-over",
					width : 293,
					height : 125,
					singleSelect : true,
					border : true,
					bodyStyle : "margin-bopttom: 15px;",
					store : dateTypeStore,
					listeners : {
						click : {
							fn : function(dView, index, node, ev) {
								var tmpFS = dateType[index][2];
								cellFormattingString = tmpFS;
								formatString(cellFormattingString, rawCellValue)
							},
							scope : this
						}
					},
					cls : "listDataViewSelect",
					tpl : new Ext.XTemplate(
							'<div class="border-list"><tpl for=".">',
							'<div class="DVSelector">', "{date_format}</div>",
							"</tpl></div>")
				})
			})]
		});
		timeTabContainer = new Ext.Panel({
			id : "timeTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			baseCls : "x-title-f",
			header : false,
			items : [{
				html : "Type".localize().concat(":"),
				border : false,
				bodyStyle : "margin-bottom:2px; margin-top: 5px; background-color: transparent;"
			}, new Ext.Panel({
				border : true,
				width : 295,
				autoHeight : true,
				layout : "fit",
				items : new Ext.DataView({
					id : "wFmtCells_timeType_dv",
					itemSelector : ".DVSelector",
					style : "overflow:auto",
					overClass : "x-view-over",
					width : 293,
					height : 125,
					singleSelect : true,
					border : true,
					bodyStyle : "margin-bopttom: 15px;",
					store : timeTypeStore,
					listeners : {
						click : {
							fn : function(dView, index, node, ev) {
								var tmpFS = timeType[index][2];
								cellFormattingString = tmpFS;
								formatString(cellFormattingString, rawCellValue)
							},
							scope : this
						}
					},
					cls : "listDataViewSelect",
					tpl : new Ext.XTemplate(
							'<div class="border-list"><tpl for=".">',
							'<div class="DVSelector">', "{time_format}</div>",
							"</tpl></div>")
				})
			})]
		});
		percentageTabContainer = new Ext.Panel({
			id : "percentageTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			header : false,
			baseCls : "x-title-f",
			items : [{
				width : 162,
				bodyStyle : "margin-bottom: 5px; padding: 0px; background-color: transparent;",
				layout : "form",
				border : false,
				items : [decPlacesSpinner4]
			}]
		});
		fractionTabContainer = new Ext.Panel({
			id : "fractionTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			baseCls : "x-title-f",
			header : false,
			items : [{
				html : "Type".localize().concat(":"),
				border : false,
				bodyStyle : "margin-bottom:2px; margin-top: 5px; background-color: transparent;"
			}, new Ext.Panel({
				border : true,
				width : 295,
				autoHeight : true,
				layout : "fit",
				items : new Ext.DataView({
					id : "wFmtCells_fraction_dv",
					itemSelector : ".DVSelector",
					style : "overflow:auto",
					overClass : "x-view-over",
					width : 293,
					height : 125,
					singleSelect : true,
					border : true,
					listeners : {
						click : {
							fn : function(dView, index, node, ev) {
								var tmpFS = fractionType[index][2];
								cellFormattingString = tmpFS;
								formatString(cellFormattingString, rawCellValue)
							},
							scope : this
						}
					},
					bodyStyle : "margin-bopttom: 15px;",
					store : fractionTypeStore,
					cls : "listDataViewSelect",
					tpl : new Ext.XTemplate(
							'<div class="border-list"><tpl for=".">',
							'<div class="DVSelector">',
							"{fraction_format}</div>", "</tpl></div>")
				})
			})]
		});
		scientificTabContainer = new Ext.Panel({
			id : "scientificTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			header : false,
			baseCls : "x-title-f",
			items : [{
				width : 162,
				bodyStyle : "margin-bottom: 5px; padding: 0px; background-color: transparent;",
				layout : "form",
				border : false,
				items : [decPlacesSpinner5]
			}]
		});
		textTabContainer = new Ext.Panel({
					id : "textTabContainer",
					width : 290,
					html : "_catDescr: text".localize(),
					baseCls : "x-plain",
					border : false
				});
		specialTabContainer = new Ext.Panel({
			id : "specialTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			baseCls : "x-title-f",
			header : false,
			items : [{
				html : "Type".localize().concat(":"),
				border : false,
				bodyStyle : "margin-bottom:2px; margin-top: 5px; background-color: transparent;"
			}, new Ext.Panel({
						border : true,
						width : 295,
						autoHeight : true,
						layout : "fit",
						items : new Ext.DataView({
									itemSelector : ".row-modeller",
									style : "overflow:auto",
									width : 293,
									height : 125,
									singleSelect : true,
									border : true,
									bodyStyle : "margin-bopttom: 15px;",
									cls : "listDataViewSelect",
									tpl : new Ext.XTemplate(
											'<div class="border-list"><tpl for=".">',
											'<div class="row-modeller">',
											"{time_format}</div>",
											"</tpl></div>")
								})
					})]
		});
		customTabContainer = new Ext.Panel({
			id : "customTabContainer",
			border : false,
			frame : false,
			autoHeight : true,
			header : false,
			items : [{
						html : "Type".localize().concat(":"),
						baseCls : "x-plain",
						bodyStyle : "margin-bottom: 2px;"
					}, customFormatting, new Ext.Panel({
						border : true,
						width : 295,
						autoHeight : true,
						layout : "fit",
						bodyStyle : "margin-top: 2px;",
						items : new Ext.DataView({
									itemSelector : ".row-modeller",
									style : "overflow:auto",
									width : 293,
									height : 155,
									singleSelect : true,
									border : true,
									cls : "listDataViewSelect",
									tpl : new Ext.XTemplate(
											'<div class="border-list"><tpl for=".">',
											'<div class="row-modeller">',
											"{time_format}</div>",
											"</tpl></div>")
								}),
						buttons : [{
									text : "Delete".localize(),
									tabIndex : 52 + tabOffset
								}]
					})]
		});
		cardPanelNumber = new Ext.Panel({
					id : "main_format_content",
					layout : "card",
					width : 300,
					bodyStyle : "background-color: transparent;",
					defaults : {
						bodyStyle : "background-color: transparent; padding: 0px;"
					},
					border : false,
					activeItem : initNumCard,
					region : "center",
					items : [
							{
								html : "General format cells have no formatting."
										.localize(),
								baseCls : "x-plain",
								height : 500
							}, numberTabContainer, currencyTabContainer,
							accountingTabContainer, dateTabContainer,
							timeTabContainer, percentageTabContainer,
							fractionTabContainer, scientificTabContainer,
							textTabContainer, specialTabContainer,
							customTabContainer]
				});
		mainField = new Ext.Panel({
			baseCls : "x-plain",
			width : 295,
			bodyStyle : "margin-top: 7px;",
			items : [new Ext.Panel({
				border : false,
				frame : false,
				autoHeight : true,
				id : "sample",
				header : false,
				baseCls : "x-title-f",
				items : [{
					width : 295,
					xtype : "fieldset",
					labelAlign : "left",
					bodyStyle : "padding-top: 0px; background-color: transparent;",
					layout : "form",
					border : true,
					autoHeight : true,
					title : "Sample".localize(),
					items : [sampleDataView]
				}]
			}), cardPanelNumber]
		});
		categorySelector = new Ext.DataView({
					itemSelector : ".list-selector",
					style : "overflow:auto",
					overClass : "x-view-over",
					id : "wFmtCells_numFormat_dv",
					autoWidth : true,
					singleSelect : true,
					store : cellNumberFormatStore,
					cls : "listDataViewSelect",
					tpl : new Ext.XTemplate(
							'<div class="borderr"><tpl for=".">',
							'<div class="list-selector">',
							"<span>&#160;{catlabel}</span></div>",
							"</tpl></div>"),
					listeners : {
						click : {
							fn : onCategorySelect,
							scope : this
						}
					}
				});
		numberTab = new Ext.Panel({
			baseCls : "x-title-f",
			labelWidth : 100,
			labelAlign : "left",
			frame : false,
			bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
			header : false,
			monitorValid : true,
			autoHeight : true,
			autoWidth : true,
			items : [new Ext.Panel({
				id : "numberTab",
				layout : "column",
				border : false,
				width : 437,
				bodyStyle : "background-color: transparent; padding-left: 0px;",
				items : [{
							columnWidth : 0.3,
							layout : "form",
							id : "fcdlg-num-cat-sel",
							labelAlign : "left",
							xtype : "fieldset",
							baseCls : "x-title-f",
							title : "Category".localize().concat(":"),
							defaults : {
								autowidth : true
							},
							autoHeight : true,
							bodyStyle : "padding-top:0px;",
							border : false,
							items : [categorySelector]
						}, {
							columnWidth : 0.7,
							layout : "form",
							autoHeight : true,
							bodyStyle : "margin-left: 10px; background-color: transparent; padding: 0px;",
							border : false,
							items : [mainField]
						}]
			}), numDescription],
			listeners : {
				doFormatNumber : function(callback) {
					if (!NFAttrib1) {
						NFAttrib1 = null
					}
					if (!NFAttrib2) {
						NFAttrib2 = null
					}
					if (!NFAttrib3) {
						NFAttrib3 = null
					}
					if (isFromOther) {
						callback(cellFormattingString)
					} else {
						if ((cellFormattingString != preFormattingString[0])
								|| (initNumCard != preFormattingString[1])
								|| (NFAttrib1 != preFormattingString[2])
								|| (NFAttrib2 != preFormattingString[3])
								|| (NFAttrib3 != preFormattingString[4])) {
							dev.report.base.fmt.set([cellFormattingString,
									indexMarker, NFAttrib1, NFAttrib2,
									NFAttrib3])
						}
					}
				}
			}
		});
		if (displayClear) {
			clearBtn = new Ext.Button({
						disabled : false,
						text : "Clear".localize(),
						handler : _clear,
						tabIndex : 60 + tabOffset,
						ctCls : dev.report.kbd.tags.NO_ENTER
					})
		}
		callback(numberTab, (displayClear) ? clearBtn : false)
	}
	if (_pre) {
		(isFromOther) ? dev.report.base.fmt.val([this, doPreselection], _pre,
				rawCellValue, true) : doPreselection(_pre)
	} else {
		dev.report.base.fmt.get([this, doPreselection])
	}
};