
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
using("lib.spinner.Spinner");
using("lib.spinner.form.SpinnerField");
dev.report.base.dlg.SizePosPanel = function(type, conf) {
	var dims = dev.report.base.wsel[type].dims;
	var env = dev.report.base.app.environment;
	var hideH = false;
	if (!conf) {
		conf = {}
	}
	switch (type) {
		case "Chart" :
		case "chart" :
			dims.minW = 10;
			dims.defW = 100;
			dims.minH = 10;
			dims.defH = 100;
			break;
		case "Picture" :
			break;
		case "Widget" :
			break;
		default :
			hideH = true;
			break
	}
	var wSpinner = new lib.spinner.form.SpinnerField({
				minValue : dims.minW,
				maxValue : dims.maxW,
				name : "elWidth",
				allowBlank : false,
				xtype : "number",
				hideLabel : false,
				width : 60,
				fieldLabel : "Width".localize(),
				border : false,
				value : conf.width || dims.defW,
				tabIndex : 10,
				ctCls : dev.report.kbd.tags.NO_ENTER,
				listeners : {
					spin : {
						fn : function(indentSpinner, newValue, oldValue) {
						},
						scope : this
					}
				}
			});
	var hSpinner = new lib.spinner.form.SpinnerField({
				minValue : dims.minH,
				maxValue : dims.maxH,
				name : "elHeight",
				allowBlank : false,
				hidden : hideH,
				disabled : hideH,
				width : 60,
				xtype : "number",
				hideLabel : hideH,
				fieldLabel : "Height".localize(),
				border : false,
				value : conf.height || dims.defH,
				tabIndex : 11,
				ctCls : dev.report.kbd.tags.NO_ENTER,
				listeners : {
					spin : {
						fn : function(indentSpinner, newValue, oldValue) {
						},
						scope : this
					}
				}
			});
	var lSpinner = new lib.spinner.form.SpinnerField({
				minValue : 0,
				maxValue : dev.report.base.app.activeSheet._colWidths
						.getSumUpTo(dev.report.base.grid.defMaxCoords[0])
						- dims.maxW,
				name : "elLeft",
				allowBlank : false,
				width : 100,
				xtype : "number",
				hideLabel : false,
				fieldLabel : "Left".localize(),
				border : false,
				value : (conf.left || conf.left == 0)
						? conf.left
						: env.selectedCell.offsetLeft,
				tabIndex : 12,
				ctCls : dev.report.kbd.tags.NO_ENTER,
				listeners : {
					spin : {
						fn : function(indentSpinner, newValue, oldValue) {
						},
						scope : this
					}
				}
			});
	var tSpinner = new lib.spinner.form.SpinnerField({
				minValue : 0,
				maxValue : dev.report.base.app.activeSheet._rowHeights
						.getSumUpTo(dev.report.base.grid.defMaxCoords[1])
						- dims.maxH,
				name : "elTop",
				allowBlank : false,
				xtype : "number",
				hideLabel : false,
				width : 100,
				fieldLabel : "Top".localize(),
				border : false,
				value : (conf.top || conf.top == 0)
						? conf.top
						: env.selectedCell.parentNode.offsetTop,
				tabIndex : 13,
				ctCls : dev.report.kbd.tags.NO_ENTER,
				listeners : {
					spin : {
						fn : function(indentSpinner, newValue, oldValue) {
						},
						scope : this
					}
				}
			});
	SPPanel = Ext.extend(Ext.Panel, {
				constructor : function(config) {
					config = Ext.apply({
								bodyStyle : "padding: 10px;",
								border : false,
								frame : false,
								autoHeight : true,
								autoWidth : true,
								baseCls : "x-title-f",
								header : false
							}, config);
					SPPanel.superclass.constructor.call(this, config)
				},
				getSPData : function() {
					if (tSpinner.validate() && lSpinner.validate()
							&& wSpinner.validate() && hSpinner.validate()) {
						var d = {
							top : tSpinner.getValue(),
							left : lSpinner.getValue(),
							width : wSpinner.getValue(),
							height : hSpinner.getValue()
						};
						return d
					} else {
						return
					}
				},
				setChartData : function(subType, edit) {
					var el = dev.report.base.wsel.chart;
					dims.minW = wSpinner.minValue = parseInt(el.min_whRatio[subType][0]
							* el.min_sizeFactor);
					dims.defW = parseInt(el.whRatio[subType][0]
							* el.min_sizeFactor);
					dims.minH = parseInt(hSpinner.minValue = el.min_whRatio[subType][1]
							* el.min_sizeFactor);
					dims.defH = parseInt(el.whRatio[subType][1]
							* el.min_sizeFactor);
					wSpinner.setValue(edit.w || dims.defW);
					hSpinner.setValue(edit.h || dims.defH);
					var activePane = dev.report.base.app.activePane;
					var vportPos = activePane.getViewportPos();
					var elTop = parseInt(vportPos[0][1]
							+ (vportPos[1][1] - vportPos[0][1] - dims.defH) / 2);
					var elLeft = parseInt(vportPos[0][0]
							+ (vportPos[1][0] - vportPos[0][0] - dims.defW) / 2);
					if (!conf.top) {
						conf.top = elTop < 0 ? 0 : elTop
					}
					if (!conf.left) {
						conf.left = elLeft < 0 ? 0 : elLeft
					}
					if (edit && edit.t > -1 && edit.l > -1) {
						tSpinner.setValue(edit.t);
						lSpinner.setValue(edit.l)
					} else {
						tSpinner.setValue(conf.top);
						lSpinner.setValue(conf.left)
					}
				},
				setSPData : function(edit) {
					wSpinner.setValue(edit.w);
					hSpinner.setValue(edit.h);
					tSpinner.setValue(edit.t);
					lSpinner.setValue(edit.l)
				}
			});
	this.mainSPPanel = new SPPanel({
				id : "FE-SE-panel",
				items : [{
							border : true,
							autoHeight : true,
							xtype : "fieldset",
							layout : "form",
							frame : false,
							title : "Size".localize(),
							items : [wSpinner, hSpinner]
						}, {
							border : true,
							autoHeight : true,
							xtype : "fieldset",
							layout : "form",
							frame : false,
							title : "Position".localize(),
							items : [lSpinner, tSpinner]
						}]
			});
};