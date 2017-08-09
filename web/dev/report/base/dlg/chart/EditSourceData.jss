
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.chart");

dev.report.base.dlg.chart.EditSourceData = function(mode, chartID) {
		//dev.report.base.dlg.chart.EditSourceData.parent.constructor.call(this);
		this.id = "editSourceData";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var _chartProps;
		var generalLbl = new Ext.form.Label({
					text : "Source Data Options".localize().concat(":"),
					cls : "edit-chart-title"
				});
		var BRLbl = {
			html : "<br/>",
			baseCls : "x-plain"
		};
		var refersToTxf = this.cmpFocus = new Ext.form.TextField({
					fieldLabel : "Chart Data Range".localize(),
					tabIndex : 10,
					width : 160
				});
		var selectRangeBtn = new Ext.Toolbar.Button({
					id : "selRangeBegin",
					iconCls : "select-range-icon",
					tabIndex : 11,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					cls : "x-btn-icon",
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
		var useFormattedValuesChb = new Ext.form.Checkbox({
					tabIndex : 12,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					fieldLabel : "Use formatted values".localize()
				});
		var groupDataByCmb = new Ext.form.ComboBox({
					fieldLabel : "Group Data By".localize(),
					store : new Ext.data.SimpleStore({
								data : [["Auto".localize(), "auto"],
										["Columns".localize(), "cols"],
										["Rows".localize(), "rows"]],
								fields : ["itemName", "itemValue"]
							}),
					displayField : "itemName",
					valueField : "itemValue",
					mode : "local",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 13,
					triggerAction : "all",
					value : "auto",
					listWidth : 70,
					width : 70,
					editable : false,
					allowBlank : false,
					selectOnFocus : false,
					listeners : {
						select : {
							fn : onSelGroupBy,
							scope : this
						}
					}
				});
		var useSeriesLabelsCmb = new Ext.form.ComboBox({
					fieldLabel : "Use series labels".localize(),
					id : "firstRowLabels",
					store : new Ext.data.SimpleStore({
								data : [["Auto".localize(), "auto"],
										["Yes".localize(), "yes"],
										["No".localize(), "no"]],
								fields : ["itemName", "itemValue"]
							}),
					displayField : "itemName",
					valueField : "itemValue",
					mode : "local",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 14,
					triggerAction : "all",
					value : "auto",
					listWidth : 70,
					width : 70,
					editable : false,
					allowBlank : false,
					selectOnFocus : false,
					disabled : true
				});
		var useCategoryLabelsCmb = new Ext.form.ComboBox({
					id : "firstColLabels",
					fieldLabel : "Use category labels".localize(),
					store : new Ext.data.SimpleStore({
								data : [["Auto".localize(), "auto"],
										["Yes".localize(), "yes"],
										["No".localize(), "no"]],
								fields : ["itemName", "itemValue"]
							}),
					displayField : "itemName",
					valueField : "itemValue",
					mode : "local",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 15,
					triggerAction : "all",
					value : "auto",
					listWidth : 70,
					width : 70,
					editable : false,
					allowBlank : false,
					selectOnFocus : false,
					disabled : true
				});
		var sourceDataPanel = {
			border : false,
			items : [{
				layout : "form",
				baseCls : "x-plain",
				labelWidth : 135,
				labelAlign : "left",
				items : [BRLbl, generalLbl, BRLbl, {
							layout : "column",
							border : false,
							baseCls : "x-plain",
							items : [{
										layout : "form",
										labelWidth : 135,
										labelAlign : "left",
										width : 305,
										baseCls : "x-plain",
										items : refersToTxf
									}, {
										layout : "form",
										border : false,
										width : 30,
										baseCls : "x-plain",
										items : selectRangeBtn
									}]
						}, useFormattedValuesChb, groupDataByCmb,
						useSeriesLabelsCmb, useCategoryLabelsCmb]
			}]
		};
		function selRangeHandleFnc(selected) {
			that.win.show();
			refersToTxf.setValue(selected)
		}
		function onSelGroupBy(combo, record, index) {
			if (combo.getValue() == "auto") {
				var fRowLbl = Ext.getCmp("firstRowLabels");
				fRowLbl.setValue("auto");
				fRowLbl.disable();
				var fColLbl = Ext.getCmp("firstColLabels");
				fColLbl.setValue("auto");
				fColLbl.disable()
			} else {
				Ext.getCmp("firstRowLabels").enable();
				Ext.getCmp("firstColLabels").enable()
			}
		}
		function getSourceDataOptionsValue() {
			var sourceData = refersToTxf.getValue();
			var groupBy = groupDataByCmb.getValue();
			var useSeriesLabels = useSeriesLabelsCmb.getValue();
			var useCategoryLabels = useCategoryLabelsCmb.getValue();
			var useFormattedValues = useFormattedValuesChb.getValue();
			return {
				General : {
					Source : sourceData,
					GroupBy : groupBy,
					SeriesLabels : useSeriesLabels,
					CategoryLabels : useCategoryLabels,
					UseFormattedValues : useFormattedValues
				}
			}
		}
		function setSourceDataOptionsValue(obj) {
			refersToTxf.setValue(obj.Source);
			groupDataByCmb.setValue(obj.GroupBy);
			useFormattedValuesChb.setValue(obj.UseFormattedValues || false);
			if (obj.GroupBy != "auto") {
				useSeriesLabelsCmb.enable();
				useSeriesLabelsCmb.setValue(obj.SeriesLabels);
				useCategoryLabelsCmb.enable();
				useCategoryLabelsCmb.setValue(obj.CategoryLabels)
			}
		}
		var mainPanel = new Ext.Panel({
			layout : "fit",
			baseCls : "x-plain",
			defaults : {
				bodyStyle : "background-color: transparent; padding:0px 5px 5px 20px;"
			},
			border : false,
			items : [sourceDataPanel]
		});
		var okBtn =new Ext.Button({
					text : "OK".localize(),
					tabIndex : 20,
					handler : function() {
						doEditChart();
						that.win.close()
					}
				});
		var cancelBtn = new Ext.Button({
					text : "Cancel".localize(),
					tabIndex : 3,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : function() {
						that.win.close()
					}
				});
		function fillChartDialog(chartID) {
			var chartProps;
			if ((chartProps = dev.report.backend.wss.wsel("get_chart_properties",
					chartID)) == false) {
				Ext.MessageBox.show({
					title : "Operation Error".localize(),
					msg : "chartDlg_EditError".localize(),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR,
					fn : function() {
						dev.report.base.general
								.setInputMode(dev.report.base.app.lastInputModeDlg);
						dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
					}
				});
				that.win.close();
				return
			}
			that.win.show(that);
			setSourceDataOptionsValue(chartProps.SourceData.General);
			_chartProps = chartProps
		}
		var doEditChart = function() {
			var chartProps = collectProperties();
			if (chartProps != false) {
				chartProps.id = chartID;
				var chart = dev.report.base.wsel.wselRegistry.get(
						dev.report.base.app.activeBook,
						dev.report.base.app.activeSheet._uid, chartID);
				var chartElem = chart.eElem[chart._sheet._aPane._id];
				chartProps.size = [chartElem.getWidth(), chartElem.getHeight()];
				if (dev.report.backend.wss.wsel("update_chart", chartProps)) {
					var currDate = new Date();
					for (var i = chart._panes.length - 1; i >= 0; i--) {
						document.getElementById(chart._panes[i]._domId.concat(
								"_wsel_cont_", chartID)).src = "/be/wss/gen_element.php?sess="
								.concat(dev.report.base.app.sess, "&buid=",
										chart._book.uid, "&suid=", chart._sheet
												.getUid(), "&id=", chartID,
										"&ts=", currDate.getTime())
					}
				}
			}
		};
		function collectProperties() {
			var chartProps = {
				props : {
					SourceData : getSourceDataOptionsValue()
				},
				operation : "ssd"
			};
			if (chartProps.props.SourceData.General.Source.length == 0) {
				Ext.MessageBox.show({
							title : "Input Error".localize(),
							msg : "chartDlg_rangeEmpty".localize(),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING,
							fn : function() {
								Ext.getCmp("dataRange").focus()
							}
						});
				return false
			}
			return chartProps
		}
		this.win = new Ext.Window({
			title : "Select Source Data".localize(),
			closable : true,
			closeAction : "close",
			cls : "default-format-window",
			autoDestroy : true,
			plain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 400,
			height : 300,
			items : mainPanel,
			onEsc : Ext.emptyFn,
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				},
				show : function() {
					setTimeout(function() {
							//	that.initFocus(true, 100)
					})
				},
				activate : function(win) {
					//that.activate()
				}
			},
			buttons : [okBtn, cancelBtn]
		});
	//	this.setContext();
		if (mode == "edit") {
			fillChartDialog(chartID)
		}
}