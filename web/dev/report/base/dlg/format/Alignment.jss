
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.format");
using("lib.spinner.Spinner");
using("lib.spinner.form.SpinnerField");
using("lib.tristate.TriCheckbox");
dev.report.base.dlg.format.Alignment = function(callback, _pre, toDisable, tabOffset) {
	var alignHorizontal = [["none", "General".localize()],
			["left", "Left (Indent)".localize()],
			["center", "Center".localize()], ["right", "Right".localize()],
			["justify", "Justify".localize()]];
	var alignVertical = [["top", "Top".localize()],
			["center", "Center".localize()], ["bottom", "Bottom".localize()],
			["justify", "Justify".localize()],
			["distributed", "Distributed".localize()]];
	var textDirection = [["context", "Context".localize()],
			["ltr", "Left-to-Right".localize()],
			["rtl", "Right-to-Left".localize()]];
	var textDirectionStore = new Ext.data.SimpleStore({
				fields : ["direction", "description"],
				data : textDirection
			});
	var alignVerticalStore = new Ext.data.SimpleStore({
				fields : ["format", "formatType"],
				data : alignVertical
			});
	var alignHorizontalStore = new Ext.data.SimpleStore({
				fields : ["format", "formatType"],
				data : alignHorizontal
			});
	var horAlignGridDesc = "General".localize();
	var verAlignGridDesc = "Top".localize();
	var textDirectionVarDesc = "Context".localize();
	var textDirectionVar;
	var horAlignGrid;
	var horAlignGrid;
	var horAlignGrid;
	var textWrap;
	var verAlignGrid;
	var isSetWrap = false;
	if (textWrap == "pre-wrap") {
		isSetWrap = true
	} else {
		if (textWrap == "pre") {
			isSetWrap = false
		}
	}
	var format = {};
	if (!_pre) {
		_pre = {}
	} else {
		format = _pre
	}
	if (_pre.whiteSpace == null) {
		_pre.whiteSpace = "pre"
	}
	var textWrap = _pre.whiteSpace;
	var isSetWrap = false;
	if (textWrap == "pre-wrap") {
		isSetWrap = true
	} else {
		if (textWrap == "pre") {
			isSetWrap = false
		}
	}
	if (_pre.textAlign == null) {
		_pre.textAlign = ""
	}
	var horAlignGrid = _pre.textAlign;
	if (_pre.verticalAlign == null) {
		_pre.verticalAlign = ""
	}
	var verAlignGrid = _pre.verticalAlign;
	if (_pre.textIndent == null) {
		_pre.textIndent = 0
	}
	if (_pre.textIndent == "") {
		_pre.textIndent = 0
	}
	var indentGrid = _pre.textIndent;
	if (indentGrid != 0) {
		indentGrid = indentGrid.replace(/em/i, "")
	}
	for (var HAC = 0; HAC < 5; HAC++) {
		if (alignHorizontal[HAC][0] == horAlignGrid) {
			horAlignGridDesc = alignHorizontal[HAC][1]
		}
	}
	for (var HAC = 0; HAC < 5; HAC++) {
		if (alignVertical[HAC][0] == verAlignGrid) {
			verAlignGridDesc = alignVertical[HAC][1]
		}
	}
	for (var HAC = 0; HAC < 3; HAC++) {
		if (textDirection[HAC][0] == textDirectionVar) {
			textDirectionVarDesc = textDirection[HAC][1]
		}
	}
	function setHorizontalAlignment(combo, record, index) {
		horAlignGrid = alignHorizontal[index][0]
	}
	function setTextDirection(combo, record, index) {
		textDirectionVar = textDirection[index][0]
	}
	function setWrap() {
		if (wrapTextCB.getValue()) {
			textWrap = "pre-wrap"
		} else {
			textWrap = "pre"
		}
	}
	function setVerticalAlignment(combo, record, index) {
		verAlignGrid = alignVertical[index][0]
	}
	function setTextIndent(indentSpinner, newValue, oldValue) {
		indentGrid = newValue;
		indentGrid = "".concat(indentGrid, "em")
	}
	var wrapTextCB = new Ext.form.Checkbox({
				id : "wFormatAlignment_wrap_chk",
				name : "wrapText",
				boxLabel : "Wrap text".localize(),
				tabIndex : 10 + tabOffset,
				handler : setWrap,
				checked : isSetWrap
			});
	var indentSpinner = new lib.spinner.form.SpinnerField({
				id : "wFormatAlignment_indent_spn",
				minValue : 0,
				maxValue : 250,
				name : "text_indent",
				allowBlank : false,
				xtype : "number",
				width : 60,
				hideLabel : true,
				border : false,
				value : indentGrid,
				tabIndex : 3 + tabOffset,
				listeners : {
					spin : {
						fn : setTextIndent,
						scope : this
					}
				}
			});
	var cellsMerged = dev.report.base.sheet.getMergeState();
	cellsMerged = (cellsMerged == undefined) ? null : cellsMerged;
	var newMerge = cellsMerged;
	var formTriCB = new lib.tristate.TriCheckbox({
				id : "wFormatAlignment_merge_chk",
				name : "tri-check1",
				xtype : "tri-checkbox",
				boxLabel : "Merge cells".localize(),
				id : "tribox",
				fieldLabel : "Merge".localize(),
				hideLabel : true,
				checked : cellsMerged,
				listeners : {
					check : function(cmp, state) {
						newMerge = state
					}
				}
			});
	var mergeCells = function() {
		if (newMerge != cellsMerged) {
			switch (newMerge) {
				case true :
					dev.report.base.sheet.merge();
					break;
				case false :
					dev.report.base.sheet.unMerge();
					break;
				case null :
					if (!cellsMerged) {
						dev.report.base.sheet.merge()
					}
					break
			}
		}
	};
	var alignTab = new Ext.Panel({
		layout : "column",
		baseCls : "x-plain",
		id : "alignTabMain",
		listeners : {
			doSelectAlignment : function(callback) {
				if (_pre.textIndent == indentSpinner.getRawValue()) {
					var ind = ""
				} else {
					var ind = indentSpinner.getRawValue().concat("em")
				}
				format = {
					textAlign : horAlignGrid,
					verticalAlign : verAlignGrid,
					textIndent : ind,
					whiteSpace : textWrap,
					direction : textDirectionVar
				};
				mergeCells();
				callback(format)
			}
		},
		items : [{
			columnWidth : 0.99,
			baseCls : "x-plain",
			items : [new Ext.Panel({
				id : "alignTab",
				bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
				border : false,
				frame : false,
				autoHeight : true,
				autoWidth : true,
				baseCls : "x-title-f",
				header : false,
				items : [{
					bodyStyle : "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
					border : true,
					autoHeight : true,
					xtype : "fieldset",
					layout : "form",
					frame : false,
					title : "Text alignment".localize(),
					items : [new Ext.Panel({
						layout : "column",
						baseCls : "x-plain",
						items : [{
							columnWidth : 0.6,
							baseCls : "x-plain",
							items : [{
										html : "Horizontal".localize()
												.concat(":"),
										baseCls : "x-plain"
									}, {
										layout : "form",
										baseCls : "x-plain",
										autoWidth : true,
										items : new Ext.form.ComboBox({
											id : "wFormatAlignment_horizontal_cmb",
											store : alignHorizontalStore,
											displayField : "formatType",
											hideLabel : true,
											editable : false,
											typeAhead : true,
											mode : "local",
											triggerAction : "all",
											value : horAlignGridDesc,
											selectOnFocus : true,
											listWidth : 150,
											width : 150,
											tabIndex : 1 + tabOffset,
											listeners : {
												select : {
													fn : setHorizontalAlignment,
													scope : this
												}
											}
										})
									}]
						}, {
							columnWidth : 0.3,
							baseCls : "x-plain",
							items : [{
										html : "Indent".localize().concat(":"),
										baseCls : "x-plain"
									}, new Ext.Panel({
												layout : "form",
												baseCls : "x-plain",
												width : 60,
												items : [indentSpinner]
											})]
						}]
					})]
				}, {
					bodyStyle : "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
					border : true,
					autoHeight : true,
					xtype : "fieldset",
					layout : "form",
					frame : false,
					title : "Text control".localize(),
					items : [new Ext.Panel({
								layout : "form",
								baseCls : "x-plain",
								items : [{
											baseCls : "x-plain",
											items : [wrapTextCB, formTriCB]
										}]
							})]
				}, {
					bodyStyle : "padding: 0px; color: #000000; font-size: 9pt; background-color: transparent;",
					border : true,
					autoHeight : true,
					xtype : "fieldset",
					layout : "form",
					frame : false,
					title : "Right-to-Left".localize(),
					items : [new Ext.Panel({
								layout : "column",
								baseCls : "x-plain",
								items : [{
									columnWidth : 0.4,
									baseCls : "x-plain",
									items : [{
										html : "Text direction".localize()
												.concat(":"),
										baseCls : "x-plain"
									}, new Ext.form.ComboBox({
												store : textDirectionStore,
												displayField : "description",
												hideLabel : true,
												editable : false,
												disabled : true,
												typeAhead : true,
												mode : "local",
												triggerAction : "all",
												value : textDirectionVarDesc,
												selectOnFocus : true,
												listWidth : 100,
												width : 100,
												tabIndex : 20 + tabOffset,
												listeners : {
													select : {
														fn : setTextDirection,
														scope : this
													}
												}
											})]
								}]
							})]
				}]
			})]
		}]
	});
	callback(alignTab)
};