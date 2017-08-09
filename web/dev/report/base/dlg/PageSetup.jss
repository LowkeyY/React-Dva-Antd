
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

loadcss("lib.spinner.Spinner");
using("lib.spinner.Spinner");
using("lib.spinner.form.SpinnerField");

dev.report.base.dlg.PageSetup = function() {
		//dev.report.base.dlg.PageSetup.parent.constructor.call(this);
		var pageType={
			A0:[2380, 3368],
			A1:[1684, 2380],
			A2:[1190, 1684],
			A3:[842, 1190],
			A4:[595, 842],
			A5:[421, 595],
			A6:[297, 421],
			A7:[210, 297],
			A8:[148, 210],
			A9:[105, 148],
			A10:[74, 105],
			B0:[2836, 4008],
			B1:[2004, 2836],
			B2:[1418, 2004],
			B3:[1002, 1418],
			B4:[709, 1002],
			B5:[501, 709],
			LETTER:[612, 792],
			NOTE:[540, 720],
			LEGAL:[612, 1008],
			ARCH_E:[2592, 3456],
			ARCH_D:[1728, 2592],
			ARCH_C:[1296, 1728],
			ARCH_B:[864, 1296],
			ARCH_A:[648, 864],
			FLSA:[612, 936],
			FLSE:[612, 936],
			HALFLETTER:[396, 612],
			LEDGER:[1224, 792]
		}
		var pageStore=new Ext.data.SimpleStore({
				data : [[0, "A0"],
						[1, "A1"],
						[2, "A2"],
						[3, "A3"],
						[4, "A4"],
						[5, "A5"],
						[6, "A6"],
						[7, "A7"],
						[8, "A8"],
						[9, "A9"],
						[10, "A10"],
						[11, "B0"],
						[12, "B1"],
						[13, "B2"],
						[14, "B3"],
						[15, "B4"],
						[16, "B5"],
						[17, "Letter".localize()],
						[18, "Note".localize()], 
						[19, "LEGAL".localize()], 
						[20, "ARCH_E"],
						[21, "ARCH_D"],
						[22, "ARCH_C"],
						[23, "ARCH_B"],
						[24, "ARCH_A"],
						[25, "FLSA"],
						[26, "FLSE"],
						[27, "HalfLetter".localize()], 
						[28, "Ledger".localize()]],
				fields : [{
							name : "paperSizeID"
						}, {
							name : "paperSizeName"
						}]
		});
		this.id = "PageSetup";
		var that = this;
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		var _selectedData;
		var _preselctionChbValues = {
			horizontallyChb : false,
			horizontallyChb : false
		};
		var _marginsPanelRenderFlag = false;
		var activeContainers = {};
		function setContainers(elements) {
			for (var c in activeContainers) {
				delete that.containers[c]
			}
			activeContainers = {};
			for (var nc in elements) {
				that.containers[nc] = elements[nc];
				activeContainers[nc] = nc
			}
		}
		var portraitRb = this.cmpFocus = new Ext.form.Radio({
					boxLabel : "Portrait".localize(),
					hideLabel : true,
					tabIndex : 101,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					name : "rb-orientation",
					width : 100,
					inputValue : 1
				});
		var landscapeRb = new Ext.form.Radio({
					boxLabel : "Landscape".localize(),
					hideLabel : true,
					checked : true,
					name : "rb-orientation",
					width : 100,
					tabIndex : 102,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : centerPic,
					inputValue : 1
				});
		var adjustToRb = new Ext.form.Radio({
					hideLabel : true,
					boxLabel : "",
					tabIndex : 103,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					name : "rb-scaling",
					style : "height: 25px;",
					width : 20,
					inputValue : 1
				});
		var adjustToSpn = new Ext.form.SpinnerField({
					name : "adjust_to",
					minValue : 0,
					maxValue : 400,
					allowBlank : false,
					hideLabel : true,
					tabIndex : 104,
					width : 60,
					border : false,
					value : 100,
					incrementValue : 5
				});
		var fitToRb = new Ext.form.Radio({
					hideLabel : true,
					boxLabel : "",
					style : "height: 25px;",
					name : "rb-scaling",
					tabIndex : 105,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					checked : true,
					width : 20,
					inputValue : 1
				});
		var pageWideSpn = new Ext.form.SpinnerField({
					minValue : 1,
					maxValue : 400,
					name : "adjust_to",
					allowBlank : false,
					hideLabel : true,
					width : 60,
					tabIndex : 106,
					border : false,
					value : 5,
					incrementValue : 1
				});
		var pageTallSpn = new Ext.form.SpinnerField({
					minValue : 1,
					maxValue : 400,
					name : "adjust_to",
					allowBlank : true,
					hideLabel : true,
					tabIndex : 107,
					width : 60,
					border : false,
					value : 30,
					incrementValue : 1
				});
		var paperSizeCmb = new Ext.form.ComboBox({
					fieldLabel : "Paper size".localize(),
					width : 300,
					tabIndex : 108,
					store :pageStore,
					displayField : "paperSizeName",
					value : "A4",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					editable : false,
					mode : "local",
					triggerAction : "all"
				});
		var topMarginSpn = new Ext.form.SpinnerField({
					minValue : 0,
					maxValue : 100,
					name : "top",
					allowBlank : false,
					tabIndex : 201,
					hideLabel : true,
					width : 60,
					border : false,
					value : 1.0,
					incrementValue : 1.0,
					listeners : {
						spin : function() {
							changePic(1);
							pageMarginsDV.select(2, false, false)
						}
					}
				});
		var headerMarginSpn = new Ext.form.SpinnerField({
					minValue : 0,
					maxValue : 100,
					name : "header",
					allowBlank : false,
					hideLabel : true,
					tabIndex : 202,
					width : 60,
					border : false,
					value : 1.0,
					incrementValue : 1.0,
					listeners : {
						spin : function() {
							changePic(2);
							pageMarginsDV.select(2, false, false)
						}
					}
				});
		var leftMarginSpn = new Ext.form.SpinnerField({
					minValue : 0,
					maxValue : 100,
					name : "left",
					allowBlank : false,
					hideLabel : true,
					tabIndex : 203,
					width : 60,
					border : false,
					value : 0.7,
					incrementValue : 1.0,
					listeners : {
						spin : function() {
							changePic(3);
							pageMarginsDV.select(2, false, false)
						}
					}
				});
		var rightMarginSpn = new Ext.form.SpinnerField({
					minValue : 0,
					maxValue : 100,
					name : "right",
					allowBlank : false,
					hideLabel : true,
					tabIndex : 204,
					width : 60,
					border : false,
					value : 1.0,
					incrementValue : 1.0,
					listeners : {
						spin : function() {
							changePic(4);
							pageMarginsDV.select(2, false, false)
						}
					}
				});
		var bottomMarginSpn = new Ext.form.SpinnerField({
					minValue : 0,
					maxValue : 100,
					name : "bottom",
					allowBlank : false,
					hideLabel : true,
					width : 60,
					tabIndex : 205,
					border : false,
					value : 1.0,
					incrementValue : 1.0,
					listeners : {
						spin : function() {
							changePic(5);
							pageMarginsDV.select(2, false, false)
						}
					}
				});
		var footerMarginSpn = new Ext.form.SpinnerField({
					name : "footer",
					minValue : 0,
					maxValue : 100,
					allowBlank : false,
					hideLabel : true,
					tabIndex : 206,
					width : 60,
					border : false,
					value : 1.0,
					incrementValue : 1.0,
					listeners : {
						spin : function() {
							changePic(6)
						}
					}
				});
		var horizontallyChb = new Ext.form.Checkbox({
					boxLabel : "Horizontally".localize(),
					hideLabel : true,
					tabIndex : 207,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					handler : centerPic,
					inputValue : 8
				});
		var verticallyChb = new Ext.form.Checkbox({
					boxLabel : "Vertically".localize(),
					hideLabel : true,
					handler : centerPic,
					tabIndex : 208,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					inputValue : 8
				});
		function centerPic() {
			if (!_marginsPanelRenderFlag) {
				return
			}
			var record = pageMardinsStore.getAt(0);
			var hor = horizontallyChb.checked;
			var ver = verticallyChb.checked;
			var ls = landscapeRb.checked;
			if (ls) {
				pageMarginsDV.tpl = pageMarginsTemplateH;
				if (ver && hor) {
					_selectedData = centerHorVerMardinsLSData
				} else {
					if (hor) {
						_selectedData = centerHorMardinsLSData
					} else {
						if (ver) {
							_selectedData = centerVerMardinsLSData
						} else {
							_selectedData = pageMardinsLSData
						}
					}
				}
			} else {
				pageMarginsDV.tpl = pageMarginsTemplateV;
				if (ver && hor) {
					_selectedData = centerHorVerMardinsData
				} else {
					if (hor) {
						_selectedData = centerHorMardinsData
					} else {
						if (ver) {
							_selectedData = centerVerMardinsData
						} else {
							_selectedData = pageMardinsData
						}
					}
				}
			}
			changePic(0);
			pageMarginsDV.refresh()
		}
		function changePic(selectedIndex) {
			var record = pageMardinsStore.getAt(0);
			record.set("pic", _selectedData[selectedIndex][1])
		}
		var pageMardinsData = [["start", "page_margins"],
				["top", "page_margins_top"], ["header", "page_margins_header"],
				["left", "page_margins_left"], ["rignt", "page_margins_right"],
				["bottom", "page_margins_bottom"],
				["footer", "page_margins_footer"]];
		_selectedData = pageMardinsData;
		var centerHorMardinsData = [
				["center_horizontally", "center_horizontally"],
				["center_horizontally_top", "center_horizontally_top"],
				["center_horizontally_header", "center_horizontally_header"],
				["center_horizontally_left", "center_horizontally_left"],
				["center_horizontally_right", "center_horizontally_right"],
				["center_horizontally_bottom", "center_horizontally_bottom"],
				["center_horizontally_footer", "center_horizontally_footer"]];
		var centerVerMardinsData = [["center_vertically", "center_vertically"],
				["center_vertically_top", "center_vertically_top"],
				["center_vertically_header", "center_vertically_header"],
				["center_vertically_left", "center_vertically_left"],
				["center_vertically_right", "center_vertically_right"],
				["center_vertically_bottom", "center_vertically_bottom"],
				["center_vertically_footer", "center_vertically_footer"]];
		var centerHorVerMardinsData = [["center_hor_ver", "center_hor_ver"],
				["center_hor_ver_header", "center_hor_ver_header"],
				["center_hor_ver_top", "center_hor_ver_top"],
				["center_hor_ver_left", "center_hor_ver_left"],
				["center_hor_ver_right", "center_hor_ver_right"],
				["center_hor_ver_bottom", "center_hor_ver_bottom"],
				["center_hor_ver_footer", "center_hor_ver_footer"]];
		var pageMardinsLSData = [["start", "page_margins_ls"],
				["top_ls", "page_margins_top_ls"],
				["header_ls", "page_margins_header_ls"],
				["left_ls", "page_margins_left_ls"],
				["rignt_ls", "page_margins_right_ls"],
				["bottom_ls", "page_margins_bottom_ls"],
				["footer_ls", "page_margins_footer_ls"]];
		var centerHorMardinsLSData = [
				["center_horizontally_ls", "center_horizontally_ls"],
				["center_horizontally_top_ls", "center_horizontally_top_ls"],
				["center_horizontally_header_ls",
						"center_horizontally_header_ls"],
				["center_horizontally_left_ls", "center_horizontally_left_ls"],
				["center_horizontally_right_ls", "center_horizontally_right_ls"],
				["center_horizontally_bottom_ls",
						"center_horizontally_bottom_ls"],
				["center_horizontally_footer_ls",
						"center_horizontally_footer_ls"]];
		var centerVerMardinsLSData = [
				["center_vertically_ls", "center_vertically_ls"],
				["center_vertically_top_ls", "center_vertically_top_ls"],
				["center_vertically_header_ls", "center_vertically_header_ls"],
				["center_vertically_left_ls", "center_vertically_left_ls"],
				["center_vertically_right_ls", "center_vertically_right_ls"],
				["center_vertically_bottom_ls", "center_vertically_bottom_ls"],
				["center_vertically_footer_ls", "center_vertically_footer_ls"]];
		var centerHorVerMardinsLSData = [
				["center_hor_ver_ls", "center_hor_ver_ls"],
				["center_hor_ver_top_ls", "center_hor_ver_top_ls"],
				["center_hor_ver_header_ls", "center_hor_ver_header_ls"],
				["center_hor_ver_left_ls", "center_hor_ver_left_ls"],
				["center_hor_ver_right_ls", "center_hor_ver_right_ls"],
				["center_hor_ver_bottom_ls", "center_hor_ver_bottom_ls"],
				["center_hor_ver_footer_ls", "center_hor_ver_footer_ls"]];
		var br = 20;
		var pageMardinsStore = new Ext.data.SimpleStore({
					fields : ["marginName", "pic"],
					data : [["start", "page_margins"]]
				});
		var pageMarginsTemplateV = new Ext.XTemplate(
				'<div><tpl for=".">',
				'<div class="thumb-wrap">',
				'<div class="thumb" style="padding: 5px; width:145px; height:145px;  text-align: center; display: table-cell; vertical-align:middle;">',
				'<img class="{pic}" src="/Ext/resources/images/default/s.gif" ',
				'width="108" height="142"', " /></div></div>", "</tpl></div>");
		var pageMarginsTemplateH = new Ext.XTemplate(
				'<div><tpl for=".">',
				'<div class="thumb-wrap">',
				'<div class="thumb" style="padding: 5px; width:145px; height:145px;  text-align: center; display: table-cell; vertical-align:middle;">',
				'<img class="{pic}" src="/Ext/resources/images/default/s.gif" ',
				'width="142" height="108"', " /></div></div>", "</tpl></div>");
		var pageMarginsDV = new Ext.DataView({
			id : "page-margins-dv",
			store : pageMardinsStore,
			tpl : pageMarginsTemplateV,
			multiSelect : false,
			singleSelect : true,
			overClass : "x-view-over",
			itemSelector : "div.thumb-wrap",
			emptyText : "No images to display".localize(),
			listeners : {
				afterrender : function() {
					horizontallyChb
							.setValue(_preselctionChbValues.horizontallyChb);
					verticallyChb.setValue(_preselctionChbValues.verticallyChb);
					_marginsPanelRenderFlag = true;
					centerPic()
				}
			}
		});
		var pageMarginPanel = {
			layout : "column",
			border : false,
			items : [{
				layout : "absolute",
				border : false,
				columnWidth : 0.3,
				height : 255,
				items : [{
							layout : "form",
							border : false,
							width : 65,
							x : 65,
							y : 100,
							items : [new Ext.form.Label({
												text : "Left".localize()
														.concat(":"),
												baseCls : "x-plain"
											}), leftMarginSpn]
						}]
			}, {
				layout : "absolute",
				border : false,
				columnWidth : 0.4,
				height : 255,
				items : [{
							layout : "form",
							border : false,
							width : 65,
							x : 62,
							y : 0,
							items : [new Ext.form.Label({
												text : "Top".localize()
														.concat(":"),
												baseCls : "x-plain"
											}), topMarginSpn]
						}, {
							layout : "fit",
							height : 155,
							width : 155,
							x : 15,
							y : 50,
							items : [pageMarginsDV]
						}, {
							layout : "form",
							border : false,
							width : 65,
							x : 62,
							y : 210,
							items : [new Ext.form.Label({
												text : "Bottom".localize()
														.concat(":"),
												baseCls : "x-plain"
											}), bottomMarginSpn]
						}]
			}, {
				layout : "absolute",
				border : false,
				columnWidth : 0.3,
				height : 255,
				items : [{
							layout : "form",
							border : false,
							width : 65,
							x : 5,
							y : 0,
							items : [new Ext.form.Label({
												text : "Header".localize()
														.concat(":"),
												baseCls : "x-plain"
											}), headerMarginSpn]
						}, {
							layout : "form",
							border : false,
							width : 65,
							x : 5,
							y : 100,
							items : [new Ext.form.Label({
												text : "Right".localize()
														.concat(":"),
												baseCls : "x-plain"
											}), rightMarginSpn]
						}, {
							layout : "form",
							border : false,
							width : 65,
							x : 5,
							y : 210,
							items : [new Ext.form.Label({
												text : "Footer".localize()
														.concat(":"),
												baseCls : "x-plain"
											}), footerMarginSpn]
						}]
			}]
		};
		var centerOnPageFs = new Ext.form.FieldSet({
					title : "Center on page".localize(),
					layout : "form",
					cls : "custom-title-fieldset",
					bodyStyle : "padding-top:10px;",
					autoHeight : true,
					items : [horizontallyChb, verticallyChb]
				});
		var headerStore = new Ext.data.SimpleStore({
					fields : ["leftStyle", "leftValue", "leftPreview",
							"centerStyle", "centerValue", "centerPreview",
							"rightStyle", "rightValue", "rightPreview"],
					data : [["", "", "", "", "", "", "", "", ""]]
				});
		var footerStore = new Ext.data.SimpleStore({
					fields : ["leftStyle", "leftValue", "leftPreview",
							"centerStyle", "centerValue", "centerPreview",
							"rightStyle", "rightValue", "rightPreview"],
					data : [["", "", "", "", "", "", "", "", ""]]
				});
		var headerDV = new Ext.DataView({
			id : "header-dv",
			store : headerStore,
			tpl : new Ext.XTemplate(
					'<div class="header"><tpl for=".">',
					'<div class="thumb-wrap">',
					'<div class="thumb" style="padding-left: 2px; text-align: left;"><table>',
					'<tr><td width=145 height=50 align=left valign=top style="{leftStyle}">{leftPreview}</td><td width=145 height=50 align=center valign=top style="{centerStyle}">{centerPreview}</td><td width=140 height=50 align=right valign=top style="{rightStyle}">{rightPreview}</td></tr>',
					"</table></div></div>", "</tpl></div>"),
			multiSelect : false,
			singleSelect : true,
			overClass : "x-view-over",
			itemSelector : "div.thumb-wrap",
			emptyText : "No images to display".localize()
		});
		var headerCmb = new Ext.form.ComboBox({
			fieldLabel : "Header".localize(),
			width : 450,
			tabIndex : 301,
			ctCls : dev.report.kbd.tags.NO_ENTER,
			store : new Ext.data.SimpleStore({
				data : [
						["", "", "(none)".localize()],
						["font-size:8;", "$V{PAGE_NUMBER}"+'+"'+'Page'.localize()+'"',
								" 1"+"Page".localize()],
						[
								"font-size:8;",
								"$V{PAGE_NUMBER}"+'"'+'Page'.localize()
										+ 'of'.localize()+'"'+'+'+ "$V{TOTAL_PAGES}"+'+'+ '"'+"Pages".localize()+'"',
								  " 1 "+ "Page".localize()+ "of".localize()+"5"
										+ "Pages".localize()],
						["font-size:8;", '"'+"ReportCount".localize() +'"'+'+'+"$V{REPORT_COUNT}", "ReportCount".localize() + " 1"],
						["font-size:8;", '"'+"PageCount".localize() +'"'+'+'+"$V{PAGE_COUNT}", "PageCount".localize() + " 1"]],
				fields : [{
							name : "preDefHStyle"
						}, {
							name : "preDefHValue"
						}, {
							name : "preDefHPreview"
						}]
			}),
			value : "(none)".localize(),
			displayField : "preDefHPreview",
			editable : false,
			mode : "local",
			triggerAction : "all",
			listeners : {
				select : function(cmb, tmpRec, index) {
					var record = headerStore.getAt(0);
					setCmbSelection(record, tmpRec, "preDefH")
				}
			}
		});
		var footerDV = new Ext.DataView({
			id : "footer-dv",
			store : footerStore,
			tpl : new Ext.XTemplate(
					'<div class="footer"><tpl for=".">',
					'<div class="thumb-wrap">',
					'<div class="thumb" style="padding-bottom: 2px; text-align: left;"><table>',
					'<tr><td width=145 height=50 align=left valign=bottom style="{leftStyle}">{leftPreview}</td><td width=145 height=50 align=center valign=bottom style="{centerStyle}">{centerPreview}</td><td width=140 height=50 align=right valign=bottom style="{rightStyle}">{rightPreview}</td></tr>',
					"</table></div></div>", "</tpl></div>"),
			multiSelect : false,
			singleSelect : true,
			overClass : "x-view-over",
			itemSelector : "div.thumb-wrap",
			emptyText : "No images to display".localize()
		});
		var footerCmb = new Ext.form.ComboBox({
			fieldLabel : "Footer".localize(),
			width : 450,
			tabIndex : 304,
			ctCls : dev.report.kbd.tags.NO_ENTER,
			store : new Ext.data.SimpleStore({
				data : [
						["", "", "(none)".localize()],
						["font-size:8;", "$V{PAGE_NUMBER}"+'+"'+'Page'.localize()+'"',
								" 1"+"Page".localize()],
						[
								"font-size:8;",
								"$V{PAGE_NUMBER}"+'"'+'Page'.localize()
										+ 'of'.localize()+'"'+'+'+ "$V{TOTAL_PAGES}"+'+'+ '"'+"Pages".localize()+'"',
								  " 1 "+ "Page".localize()+ "of".localize()+"5"
										+ "Pages".localize()],
						["font-size:8;", '"'+"ReportCount".localize() +'"'+'+'+"$V{REPORT_COUNT}", "ReportCount".localize() + " 1"],
						["font-size:8;", '"'+"PageCount".localize() +'"'+'+'+"$V{PAGE_COUNT}", "PageCount".localize() + " 1"]],
				fields : [{
							name : "preDefFStyle"
						}, {
							name : "preDefFValue"
						}, {
							name : "preDefFPreview"
						}]
			}),
			value : "(none)".localize(),
			displayField : "preDefFPreview",
			editable : false,
			mode : "local",
			triggerAction : "all",
			listeners : {
				select : function(cmb, tmpRec, index) {
					var record = footerStore.getAt(0);
					setCmbSelection(record, tmpRec, "preDefF")
				}
			}
		});
		function setCmbSelection(record, tmpRec, s) {
			var preview = tmpRec.get(s + "Preview") === "(none)" ? "" : tmpRec
					.get(s + "Preview");
			record.set("leftStyle", "");
			record.set("leftValue", "");
			record.set("leftPreview", "");
			record.set("centerStyle", tmpRec.get(s + "Style"));
			record.set("centerValue", tmpRec.get(s + "Value"));
			record.set("centerPreview", preview);
			record.set("rightStyle", "");
			record.set("rightValue", "");
			record.set("rightPreview", "")
		}
		var customHFpan = new Ext.Toolbar({
					baseCls : "x-plain",
					items : []
				});
		var headerFooterPanel = {
			layout : "form",
			labelAlign : "top",
			border : false,
			defaults : {
				border : false
			},
			items : [{
						layout : "fit",
						height : 60,
						width : 455,
						items : headerDV
					}, headerCmb, new Ext.Panel({
						layout : "column",
						baseCls : "x-plain",
						style : "padding-bottom: 10px;",
						items : [new Ext.Panel({
							baseCls : "x-plain",
							columnWidth : 0.5,
							items : [new Ext.Button({
								text : "Custom Header".localize().concat("..."),
								tabIndex : 302,
								width : 220,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									using("dev.report.base.dlg.CustomHeaderFooter");
									var cHeaderFooter=new dev.report.base.dlg.CustomHeaderFooter(
												"Header".localize(),
												 customHandleFunction,
												headerStore.getAt(0)
									);
								}
							})]
						}), new Ext.Panel({
							baseCls : "x-plain",
							columnWidth : 0.5,
							items : [new Ext.Button({
								text : "Custom Footer".localize().concat("..."),
								tabIndex : 303,
								width : 220,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									using("dev.report.base.dlg.CustomHeaderFooter");
									var customHeaderFooter=new dev.report.base.dlg.CustomHeaderFooter(
											"Footer".localize(),
											customHandleFunction,
											footerStore.getAt(0)
									);
								}
							})]
						})]
					}), footerCmb, {
						layout : "fit",
						height : 62,
						width : 450,
						items : footerDV
					}]
		};
		var customHandleFunction = function(tmpRec, hORf) {
			var record;
			if (hORf === "Header".localize()) {
				record = headerStore.getAt(0)
			} else {
				record = footerStore.getAt(0)
			}
			record.set("leftStyle", tmpRec.get("leftStyle"));
			record.set("leftValue", tmpRec.get("leftValue"));
			record.set("leftPreview", tmpRec.get("leftPreview"));
			record.set("centerStyle", tmpRec.get("centerStyle"));
			record.set("centerValue", tmpRec.get("centerValue"));
			record.set("centerPreview", tmpRec.get("centerPreview"));
			record.set("rightStyle", tmpRec.get("rightStyle"));
			record.set("rightValue", tmpRec.get("rightValue"));
			record.set("rightPreview", tmpRec.get("rightPreview"))
		};
		function getPreview(value) {
			var date = new Date();
			var today = date.getDate() + "/" + date.getMonth()  + "/"
					+ date.getFullYear();
			var time = date.getHours() + ":" + date.getMinutes();
			var v = ["$V{PAGE_NUMBER}", "$V{TOTAL_PAGES}", "$V{CURRENT_DATA}", "$V{CURRENT_TIME}", "$V{REPORT_COUNT}",	"$V{PAGE_COUNT}"];
			var p = ["1", "5", today, time, "1", "1"];
			var preview = _formatText(value);
			for (var i = 0; i < v.length; i++) {
				preview = preview.replace(v[i], p[i]);
				preview = preview.replace("+","");
				preview = preview.replace('"','');
			}
			return preview
		}
		var refersToTxf = new Ext.form.TextField({
					fieldLabel : "Print area".localize(),
					width : 315,
					tabIndex : 401
				});
		var selectRangeBtn = new Ext.Button({
					id : "selRangeBegin",  
					iconCls : "select-range-icon",
					cls : "x-btn-icon",
					tabIndex : 402,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tooltip : "Select Range".localize(),
					handler : function() {
						using("dev.report.base.dlg.SelectRange");
						var selectRange=new dev.report.base.dlg.SelectRange({
								fnc : [this, selRangeHandleFnc],
								format : "{$Range}",
								rng : refersToTxf.getValue()
						});
						that.win.hide()
					}
				});
		function selRangeHandleFnc(selected) {
			that.win.show();
			refersToTxf.setValue(selected)
		}
		var tfTitleRows = new Ext.form.TextField({
					fieldLabel : "Rows to repeat at top".localize(),
					width : 292,
					tabIndex : 411
				});
		var ignorePaginationCols = new Ext.form.RadioGroup({
			fieldLabel:'Ignore Pagination'.localize(),
			scope:this,
			name: 'IgnorePagination',
			items: [
				{boxLabel: 'true'.localize(), name: 'IgnorePagination', inputValue:'true',checked: true},
				{boxLabel: 'false'.localize(), name: 'IgnorePagination', inputValue:'false'}
			]
		})
		var titleNewPageCols = new Ext.form.RadioGroup({
			fieldLabel:'Is Title New Page'.localize(),
			scope:this,
			name: 'titleNewPage',
			items: [
				{boxLabel: 'true'.localize(), name: 'titleNewPage', inputValue:'true'},
				{boxLabel: 'false'.localize(), name: 'titleNewPage', inputValue:'false',checked: true}
			]
		})
		var summaryNewPageCols = new Ext.form.RadioGroup({
			fieldLabel:'Is Summary New Page'.localize(),
			scope:this,
			name: 'summaryNewPage',
			items: [
				{boxLabel: 'true'.localize(), name: 'summaryNewPage', inputValue:'true'},
				{boxLabel: 'false'.localize(), name: 'summaryNewPage', inputValue:'false',checked: true}
			]
		})
		var cellErrorsCmb = new Ext.form.ComboBox({
					fieldLabel : "No Data As".localize(),
					width : 190,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 422,
					store : new Ext.data.SimpleStore({
								data : [["NoPages", "NoPages".localize()],
										["BlankPage", "BlankPage".localize()],
										["AllSectionsNoDetail", "AllSectionsNoDetail".localize()],
										["NoDataSection", "NoDataSection".localize()]],
								fields : [{
											name : "cellErrorID"
										}, {
											name : "cellErrorName"
										}]
							}),
					value : "NoPages",
					displayField : "cellErrorName",
					valueField : "cellErrorID",
					editable : false,
					mode : "local",
					triggerAction : "all"
				});
		var downThenOverRb = new Ext.form.Radio({
					hideLabel : true,
					boxLabel : "Down, then over".localize(),
					checked : true,
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 431,
					name : "rb-page-order",
					listeners : {
						check : function(chb, checked) {
							if (checked) {
								setPageOrderPic(0)
							}
						}
					},
					inputValue : 'Vertical'
				});
		var overThenDownRb = new Ext.form.Radio({
					hideLabel : true,
					boxLabel : "Over, then down".localize(),
					name : "rb-page-order",
					ctCls : dev.report.kbd.tags.NO_ENTER,
					tabIndex : 432,
					listeners : {
						check : function(chb, checked) {
							if (checked) {
								setPageOrderPic(1)
							}
						}
					},
					inputValue : 'Horizontal'
				});
		var pageOrderData = [["Vertical", "down_over"],
				["Horizontal", "over_down"]];
		var pageOrderStore = new Ext.data.SimpleStore({
					fields : ["title", "pic"],
					data : [["Vertical", "down_over"]]
				});
		function setPageOrderPic(selectedIndex) {
			var record = pageOrderStore.getAt(0);
			record.set("pic", pageOrderData[selectedIndex][1])
		}
		var pageOrderDV = new Ext.DataView({
			id : "page-order-dv",
			store : pageOrderStore,
			tpl : new Ext.XTemplate(
					'<div class="folder-navigation"><tpl for=".">',
					'<div class="thumb-wrap">',
					'<div class="thumb" style="padding: 5px; text-align: center; "><img class="{pic}" src="/Ext/resources/images/default/s.gif" width="59" height="49" /></div></div>',
					"</tpl></div>"),
			multiSelect : false,
			singleSelect : true,
			overClass : "x-view-over",
			itemSelector : "div.thumb-wrap",
			emptyText : "No images to display".localize()
		});
		var printAreaPanel = {
			layout : "column",
			border : false,
			baseCls : "x-plain",
			bodyStyle : "padding-top:10px; padding-bottom:10px",
			items : [{
						layout : "form",
						border : false,
						width : 425,
						baseCls : "main-panel",
						items : refersToTxf
					}, {
						layout : "form",
						border : false,
						width : 30,
						baseCls : "x-plain",
						items : selectRangeBtn
					}]
		};

		var printFs = new Ext.form.FieldSet({
			title : "Print".localize(),
			cls : "custom-title-fieldset",
			bodyStyle : "padding-top:10px;",
			autoHeight : true,
			items :
				[{
						layout : "form",
						labelWidth : 150,
						border : false,
						width : 450,
						baseCls : "main-panel",
						items : cellErrorsCmb
					}, {
						layout : "form",
						labelWidth : 150,
						border : false,
						width : 450,
						baseCls : "main-panel",
						items : ignorePaginationCols
					}, {
						layout : "form",
						labelWidth : 150,
						border : false,
						width : 450,
						baseCls : "main-panel",
						items : titleNewPageCols
					}, {
						layout : "form",
						labelWidth : 150,
						border : false,
						width : 450,
						baseCls : "main-panel",
						items : summaryNewPageCols
					}]
		});   

		var pageOrderFs = new Ext.form.FieldSet({
					title : "Page order".localize(),
					cls : "custom-title-fieldset",
					bodyStyle : "padding-top:10px;",
					autoHeight : true,
					items : {
						layout : "column",
						defaults : {
							border : false
						},
						baseCls : "main-panel",
						items : [{
									layout : "form",
									width : 150,
									height : 60,
									items : [downThenOverRb, overThenDownRb]
								}, {
									layout : "fit",
									width : 150,
									height : 60,
									items : pageOrderDV
								}]
					}
				});
		var orientationFs = new Ext.form.FieldSet({
			title : "Orientation".localize(),
			cls : "custom-title-fieldset",
			bodyStyle : "padding-top:10px;",
			autoHeight : true,
			items : {
				layout : "column",
				baseCls : "x-plain",
				columns : 2,
				items : [{
					html : '<img class="ico_portrait" src="/Ext/resources/images/default/s.gif" align="center" width="36" height="36" />',
					baseCls : "x-plain",
					width : 50
				}, new Ext.Panel({
							border : false,
							layout : "form",
							bodyStyle : "background-color:transparent;",
							autoWidth : true,
							autoHeight : true,
							items : [portraitRb]
						}), {
					html : '<img class="ico_landscape" align="center" src="/Ext/resources/images/default/s.gif" width="36" height="36" />',
					baseCls : "x-plain",
					width : 50
				}, new Ext.Panel({
							border : false,
							layout : "form",
							bodyStyle : "background-color:transparent;",
							autoWidth : true,
							autoHeight : true,
							items : [landscapeRb]
						})]
			}
		});
	/*	var scalingFs = new Ext.form.FieldSet({
			title : "Dimension".localize(),
			cls : "custom-title-fieldset",
			bodyStyle : "padding-top:10px;",
			autoHeight : true,
			autoWidth : true,
			items : [new Ext.Panel({
				layout : "column",
				border : false,
				baseCls : "x-plain",
				items : [new Ext.Panel({
									border : false,
									layout : "form",
									bodyStyle : "background-color:transparent;",
									baseCls : "x-plain",
									width : 18,
									items : [fitToRb]
								}), {
							html : "Fit to".localize() + ":",
							baseCls : "x-plain",
							width : 80,
							style : "padding-top:4px;"
						}, {
							border : false,
							items : pageWideSpn
						}, {
							html : "&nbsp;&nbsp; ".concat("rows"
									.localize()),
							baseCls : "x-plain",
							width : 120,
							style : "padding-top:4px;"
						}, {
							border : false,
							items : pageTallSpn
						}, {
							html : "&nbsp;&nbsp; ".concat("columns".localize()),
							baseCls : "x-plain",
							style : "padding-top:4px;"
						}]
			})]
		});*/
		var printOptionsFs = new Ext.form.FieldSet({
					cls : "custom-title-fieldset",
					title : "Paper".localize(),
					bodyStyle : "padding-top:10px;",
					autoHeight : true,
					items : [paperSizeCmb]
				});
		var pageSetupTbs = new Ext.TabPanel({
			region : "center",
			height : 455,
			layoutOnTabChange : true,
			baseCls : "x-plain",
			activeTab : 0,
			defaults : {
				bodyStyle : "background-color: transparent; padding:10px 5px 5px 10px;"
			},
			items : [{
						id : "page",
						title : "Page".localize(),
						baseCls : "x-plain",
						items : [orientationFs, /*scalingFs,*/ printOptionsFs, printFs,pageOrderFs]
					}, {
						id : "margins",
						title : "Margins".localize(),
						baseCls : "x-plain",
						items : [pageMarginPanel, centerOnPageFs]
					}, {
						id : "header-footer",
						title : "Header/Footer".localize(),
						baseCls : "x-plain",
						items : [headerFooterPanel]
					}/*, {
						id : "sheet",
						title : "Sheet".localize(),
						baseCls : "x-plain",
						items : [printAreaPanel, fsPrintTitles, printFs,
								pageOrderFs]
					}*/],   
			listeners : {
				/*tabchange : function(el, e) {
					var toSet = {};
					toSet[e.id] = e;
					setContainers(toSet)
				}*/
			}
		});
		var mainPanel = new Ext.Panel({
					modal : true,
					layout : "form",
					baseCls : "main-panel",
					border : false,
					items : [pageSetupTbs, {
								layout : "form",
								border : false,
								height : 30
							}]
				});
		this.win = new Ext.Window({
			id : "page-setup-dlg",
			defaults : {
				bodyStyle : "padding:2px"
			},
			title : "Page Setup".localize(),
			closable : true,
			closeAction : "close",
			autoDestroy : true,
			plain : true,
			cls : "default-format-window",
			constrain : true,
			modal : true,
			resizable : false,
			animCollapse : false,
			layout : "fit",
			width : 500,
			height : 500,
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
								//that.initFocus(true, 100)
					})
				},
				activate : function(win) {
					//that.activate()
				}   
			},
			buttons : [(new Ext.Button({
						text : "OK".localize(),
						tabIndex : 1001,
						handler : function() {
							if(_genSavingObj().page.portrait)
								dev.report.model.report.orientation="Portrait";
							else
								dev.report.model.report.orientation="Landscape";

							dev.report.model.report.isSummaryNewPage=_genSavingObj().page.isSummaryNewPage;
							dev.report.model.report.isTitleNewPage=_genSavingObj().page.isTitleNewPage;
							dev.report.model.report.isIgnorePagination=_genSavingObj().page.isIgnorePagination;
							dev.report.model.report.whenNoDataType=_genSavingObj().page.noData;
							dev.report.model.report.printOrder=_genSavingObj().page.pageOrder;

							dev.report.model.report.pageSize=_genSavingObj().page.paper_size;

							var width=pageType[_genSavingObj().page.paper_size][0]; 
							dev.report.model.report.pageWidth=width;

							var height=pageType[_genSavingObj().page.paper_size][1]; 
							dev.report.model.report.pageHeight=height;

							dev.report.model.report.rowNum=_genSavingObj().page.fit.rowNum;
							dev.report.model.report.columnNum=_genSavingObj().page.fit.columnNum;

							dev.report.model.report.leftMargin=_genSavingObj().margins.left;
							dev.report.model.report.rightMargin=_genSavingObj().margins.right;
							dev.report.model.report.topMargin=_genSavingObj().margins.top;
							dev.report.model.report.bottomMargin=_genSavingObj().margins.bottom;

							if(_genSavingObj().hf.header.left_value!=''||
								_genSavingObj().hf.header.center_value!=''||
								_genSavingObj().hf.header.right_value!=''){
								
								var pageHeader=new dev.report.model.XPageHeader();
								var band=new dev.report.model.XBand();
								band.height=20;
								band.splitType="Stretch";
								pageHeader.setBand(band);
								
								if(_genSavingObj().hf.header.left_value!=''){	
									var txtValue=_genSavingObj().hf.header.left_value;
									setHeaderFooter(txtValue,20,band,'Right','HeaderLeft',0);
								}
								if(_genSavingObj().hf.header.center_value!=''){
									var txtValue=_genSavingObj().hf.header.center_value;
									setHeaderFooter(txtValue,width/2-40,band,'Right','HeaderCenter',0);
								}
								if(_genSavingObj().hf.header.right_value!=''){
									var txtValue=_genSavingObj().hf.header.right_value;
									setHeaderFooter(txtValue,width-100,band,'Right','HeaderRight',0);
								}
								dev.report.model.report.pageHeader=pageHeader;
							}
							if(_genSavingObj().hf.footer.left_value!=''||
								_genSavingObj().hf.footer.center_value!=''||
								_genSavingObj().hf.footer.right_value!=''){
								var pageFooter=new  dev.report.model.XPageFooter();
								var band=new dev.report.model.XBand();
								band.height=20;
								band.splitType="Stretch";
								pageFooter.setBand(band);
								if(_genSavingObj().hf.footer.left_value!=''){
									var txtValue=_genSavingObj().hf.footer.left_value;
									setHeaderFooter(txtValue,20,band,'Right','FooterLeft',0);
								}
								if(_genSavingObj().hf.footer.center_value!=''){
									var txtValue=_genSavingObj().hf.footer.center_value;
									setHeaderFooter(txtValue,width/2-40,band,'Right','FooterCenter',0);
								}
								if(_genSavingObj().hf.footer.right_value!=''){
									var txtValue=_genSavingObj().hf.footer.right_value;
									setHeaderFooter(txtValue,width-100,band,'Right','FooterRight',0);
								}
								dev.report.model.report.pageFooter=pageFooter;
							}
							that.win.close();
						}
					})), (new Ext.Button({
						text : "Cancel".localize(),
						tabIndex : 1002,
						ctCls : dev.report.kbd.tags.NO_ENTER,
						handler : function() {
							that.win.close()
						}
					}))]
		});

		var setHeaderFooter = function(val,x,band,dir,key,seq) {
				var indx=val.indexOf("$V{");
				var indx1=val.indexOf("}");
				var val1=val.substring(0,indx);
				var val2=val.substring(indx,indx1+1);
				var val3=val.substring(indx1+1,val.length);

				var textF=new dev.report.model.XTextField();
						
				if(val2.indexOf('TOTAL_PAGES'.localize())!=-1||val2.indexOf('REPORT_COUNT'.localize())!=-1||val2.indexOf('PAGE_COUNT'.localize())!=-1){
					textF.evaluationTime='Report';
				}
				val2=val2.replace('TOTAL_PAGES','PAGE_NUMBER');
				var tempVal=val1+val2;
				if(val3.length>0&&val3.indexOf("$V{")==-1){
					tempVal=tempVal+val3;
				}
				//var v = ["$V{PAGE_NUMBER}", "$V{TOTAL_PAGES}", "$V{CURRENT_DATA}", "$V{CURRENT_TIME}", "$V{REPORT_COUNT}",	"$V{PAGE_COUNT}"];
				var reportElement=new dev.report.model.XReportElement(x,0,80,20);
				reportElement.key=key+seq;
				textF.addReportElement(reportElement);
				var textElement=new dev.report.model.XTextElement();
				textElement.textAlignment=dir;
				setStyle(_genSavingObj().hf.header.center_style,textElement,reportElement);
				textF.textElement=textElement;
				var textFieldExpression=new dev.report.model.XTextFieldExpression();
				textFieldExpression.data=tempVal;
				textF.textFieldExpression=textFieldExpression;
				band.addTextField(textF);
				if(val3.length>0&&val3.indexOf("$V{")!=-1){
					setHeaderFooter(val3,x+80,band,'Left',key,seq+1);
				}
			
		}
		var setStyle = function(style,textElement,reportElement) {
			if(style!=''){
					var fontParams=style.split(";");
					var font=new dev.report.model.XFont();
					for(var k=0;k<fontParams.length;k++){
						var fontPair=fontParams[k].split(":");
						if(fontPair[0].indexOf('font-family')!=-1)
							font.fontName=fontPair[1];
						if(fontPair[0].indexOf('font-size')!=-1)
							font.size=fontPair[1].replace("pt","");
						if(fontPair[0].indexOf('font-weight')!=-1){
							if(fontPair[1].indexOf('bold')!=-1){
								font.isBold="true";
							}else{
								font.isBold="false";
							}
						}
						if(fontPair[0].indexOf('font-style')!=-1){
							if(fontPair[1].indexOf('italic')!=-1){
								font.isItalic='true';
							}else{
								font.isItalic='false';
							}
						}
						if(fontPair[0].indexOf('text-decoration')!=-1){
							if(fontPair[1].indexOf('underline')!=-1)
								font.isUnderline='true'
							if(fontPair[1].indexOf('line-through')!=-1)
								font.isStrikeThrough='true';
						}
						if(fontPair[0].indexOf('color')!=-1)
							reportElement.forecolor=fontPair[1];
					}
					textElement.font=font;
				}
		};
		var getStyle = function(font,reportElement) {
			var style='';
			if(font!=null){	
				style='font-family:'+font.fontName+';'+"font-size:"+font.size+";"	
				if(font.isBold=='true') {
					style+='font-weight:bold;';
				}else{
					style+='font-weight:normal;';
				}

				if(font.isItalic='true') {
					style+='font-style:italic;';
				}else{
					style+='font-style:normal;';
				}

				if(font.isUnderline=='true'||font.isStrikeThrough=='true'){
					style+='text-decoration:';
					if(font.isUnderline=='true') {
						style+=' underline';
					}
					if(font.isStrikeThrough=='true') {
						style+=' line-through;';
					}else{
						style+=';';
					}
				}
				if(reportElement.forecolor!=null){
					style+='color:'+reportElement.forecolor+";";
				}
			}
			return style;
		};
		var _formatText = function(s) {
			s = s.replace(/\n/g, "<br>");
			return s
		};
		var _unFormatText = function(s) {
			s = s.replace(/<br>/g, "\n");
			return s
		};
		var _genSavingObj = function() {
			var tmpObj;
			var ps = {};   
			ps.page = {};
			ps.margins = {};
			ps.hf = {};
			ps.sheet = {};
			tmpObj = ps.page;
			tmpObj.portrait = portraitRb.getValue();

			tmpObj.noData = cellErrorsCmb.getValue();
			//
			tmpObj.isIgnorePagination = ignorePaginationCols.getValue();
			tmpObj.isTitleNewPage = titleNewPageCols.getValue();
			tmpObj.isSummaryNewPage = summaryNewPageCols.getValue();

			if(downThenOverRb.getValue()){
				tmpObj.pageOrder = "Vertical";
			}else{
				tmpObj.pageOrder = "Horizontal";
			}

			/*tmpObj.adjust = {
				enabled : adjustToRb.getValue(),
				size : adjustToSpn.getValue()   
			};*/
				
			tmpObj.fit = {
				enabled : fitToRb.getValue(),
				rowNum : pageWideSpn.getValue(),
				columnNum : pageTallSpn.getValue()
			};
			tmpObj.paper_size = paperSizeCmb.getValue();
		//	tmpObj.first_page = firstPageNumberTxf.getValue();
			tmpObj = ps.margins;
			tmpObj.top = topMarginSpn.getValue();
			tmpObj.left = leftMarginSpn.getValue();
			tmpObj.bottom = bottomMarginSpn.getValue();
			tmpObj.right = rightMarginSpn.getValue();
			tmpObj.header = headerMarginSpn.getValue();
			tmpObj.footer = footerMarginSpn.getValue();
			tmpObj.horiz = horizontallyChb.getValue();
			tmpObj.vert = verticallyChb.getValue();
			tmpObj = ps.hf;
			var tmpRec = headerStore.getAt(0);
			tmpObj.header = {};
			tmpObj.header.left_style = tmpRec.get("leftStyle");
			tmpObj.header.left_value = _unFormatText(tmpRec.get("leftValue"));
			tmpObj.header.center_style = tmpRec.get("centerStyle");
			tmpObj.header.center_value = _unFormatText(tmpRec.get("centerValue"));
			tmpObj.header.right_style = tmpRec.get("rightStyle");
			tmpObj.header.right_value = _unFormatText(tmpRec.get("rightValue"));
			tmpRec = footerStore.getAt(0);
			tmpObj.footer = {};
			tmpObj.footer.left_style = tmpRec.get("leftStyle");
			tmpObj.footer.left_value = _unFormatText(tmpRec.get("leftValue"));
			tmpObj.footer.center_style = tmpRec.get("centerStyle");
			tmpObj.footer.center_value = _unFormatText(tmpRec.get("centerValue"));
			tmpObj.footer.right_style = tmpRec.get("rightStyle");
			tmpObj.footer.right_value = _unFormatText(tmpRec.get("rightValue"));
			return ps
		};
		var initPageSetupDlg = function() {
			var result = {};
			result.page={};
			result.hf={};
			result.hf.header={};
			result.hf.footer={};
			if(dev.report.model.report.orientation=='Portrait')
				result.page.portrait=true;
			else
				result.page.portrait=false;
			
			result.page.isSummaryNewPage=dev.report.model.report.isSummaryNewPage;
			result.page.isTitleNewPage=dev.report.model.report.isTitleNewPage;
			result.page.isIgnorePagination=dev.report.model.report.isIgnorePagination;
			result.page.noData=dev.report.model.report.whenNoDataType;
			result.page.pageOrder=dev.report.model.report.printOrder;

			result.page.paper_size=dev.report.model.report.pageSize;
			result.page.first_page=true;
			result.page.fit={};
			result.page.fit.enabled=true;

			result.page.fit.rowNum=dev.report.model.report.rowNum;
			result.page.fit.columnNum=dev.report.model.report.columnNum;

			result.margins={};
			result.margins.left=dev.report.model.report.leftMargin;
			result.margins.right=dev.report.model.report.rightMargin;
			result.margins.top=dev.report.model.report.topMargin;
			result.margins.bottom=dev.report.model.report.bottomMargin;
			result.margins.header=3.0;
			result.margins.footer=3.0;

			result.hf.header.left_style='';
			result.hf.header.left_value='';
			result.hf.header.center_style='';
			result.hf.header.center_value='';
			result.hf.header.right_style='';
			result.hf.header.right_value='';
			result.hf.footer.left_style='';
			result.hf.footer.left_value='';
			result.hf.footer.center_style='';
			result.hf.footer.center_value='';
			result.hf.footer.right_style='';
			result.hf.footer.right_value='';

			var header=dev.report.model.report.pageHeader;
			var headerBand=header.band;
			var headerText=headerBand.textFields;

			if(headerText.length>0){
				for(var i=0;i<headerText.length;i++){
					var styleString="";
					var headerReportElement=headerText[i].reportElements[0];
					if(headerReportElement.key.indexOf("HeaderLeft")!=-1){
						var headerTextEle=headerText[i].textElement;
						var headerTextFieldExpression=headerText[i].textFieldExpression;
						if(headerText[i].evaluationTime='Report'&&headerTextFieldExpression.data.indexOf('$V{PAGE_NUMBER}')){
							var tempTxt=headerTextFieldExpression.data;
							tempTxt=tempTxt.replace('$V{PAGE_NUMBER}','$V{TOTAL_PAGES}');
							result.hf.header.left_value+=tempTxt;
						}else{
							result.hf.header.left_value+=headerTextFieldExpression.data;
						}
						var font=headerTextEle.font;
						result.hf.header.left_style=getStyle(font,headerReportElement);
					}
					if(headerReportElement.key.indexOf("HeaderCenter")!=-1){
						var headerTextEle=headerText[i].textElement;
						var headerTextFieldExpression=headerText[i].textFieldExpression;

						if(headerText[i].evaluationTime='Report'&&headerTextFieldExpression.data.indexOf('$V{PAGE_NUMBER}')){
							var tempTxt=headerTextFieldExpression.data;
							tempTxt=tempTxt.replace('$V{PAGE_NUMBER}','$V{TOTAL_PAGES}');
							result.hf.header.center_value+=tempTxt;
						}else{
							result.hf.header.center_value+=headerTextFieldExpression.data;
						}
						var font=headerTextEle.font;
						result.hf.header.center_style=getStyle(font,headerReportElement);
					}
					if(headerReportElement.key.indexOf("HeaderRight")!=-1){
						var headerTextEle=headerText[i].textElement;
						var headerTextFieldExpression=headerText[i].textFieldExpression;
						if(headerText[i].evaluationTime='Report'&&headerTextFieldExpression.data.indexOf('$V{PAGE_NUMBER}')){
							var tempTxt=headerTextFieldExpression.data;
							tempTxt=tempTxt.replace('$V{PAGE_NUMBER}','$V{TOTAL_PAGES}');
							result.hf.header.right_value+=tempTxt;
						}else{
							result.hf.header.right_value+=headerTextFieldExpression.data;
						}
						var font=headerTextEle.font;
						result.hf.header.right_style=getStyle(font,headerReportElement);
					}
				}
			}
			var footer=dev.report.model.report.pageFooter;
			var footerBand=footer.band;
			var footerText=footerBand.textFields;
			if(footerText.length>0){
				for(var i=0;i<footerText.length;i++){
					var styleString="";
					var footerReportElement=footerText[i].reportElements[0];
					if(footerReportElement.key.indexOf("FooterLeft")!=-1){
						var footerTextEle=footerText[i].textElement;
						var footerTextFieldExpression=footerText[i].textFieldExpression;
						if(footerText[i].evaluationTime='Report'&&footerTextFieldExpression.data.indexOf('$V{PAGE_NUMBER}')){
							var tempTxt=footerTextFieldExpression.data;
							tempTxt=tempTxt.replace('$V{PAGE_NUMBER}','$V{TOTAL_PAGES}');
							result.hf.footer.left_value+=tempTxt;
						}else{
							result.hf.footer.left_value+=headerTextFieldExpression.data;
						}
						var font=footerTextEle.font;
						result.hf.footer.left_style=getStyle(font,footerReportElement);
					}
					if(footerReportElement.key.indexOf("FooterCenter")!=-1){
						var footerTextEle=footerText[i].textElement;
						var footerTextFieldExpression=footerText[i].textFieldExpression;
						if(footerText[i].evaluationTime='Report'&&footerTextFieldExpression.data.indexOf('$V{PAGE_NUMBER}')){
							var tempTxt=footerTextFieldExpression.data;
							tempTxt=tempTxt.replace('$V{PAGE_NUMBER}','$V{TOTAL_PAGES}');
							result.hf.footer.center_value+=tempTxt;
						}else{
							result.hf.footer.center_value+=headerTextFieldExpression.data;
						}						
						var font=footerTextEle.font;
						result.hf.footer.center_style=getStyle(font,footerReportElement);
					}
					if(footerReportElement.key.indexOf("FooterRight")!=-1){
						var footerTextEle=footerText[i].textElement;
						var footerTextFieldExpression=footerText[i].textFieldExpression;
						if(footerText[i].evaluationTime='Report'&&footerTextFieldExpression.data.indexOf('$V{PAGE_NUMBER}')){
							var tempTxt=footerTextFieldExpression.data;
							tempTxt=tempTxt.replace('$V{PAGE_NUMBER}','$V{TOTAL_PAGES}');
							result.hf.footer.right_value+=tempTxt;
						}else{
							result.hf.footer.right_value+=headerTextFieldExpression.data;
						}
						result.hf.footer.right_value+=footerTextFieldExpression.data;
						var font=footerTextEle.font;
						result.hf.footer.right_style=getStyle(font,footerReportElement);
					}
				}
			}

			if (result) {
				var ps = result;
				portraitRb.setValue(ps.page.portrait);
				landscapeRb.setValue(!ps.page.portrait);

				cellErrorsCmb.setValue(result.page.noData);
				ignorePaginationCols.setValue(result.page.isIgnorePagination);
				titleNewPageCols.setValue(result.page.isTitleNewPage);
				summaryNewPageCols.setValue(result.page.isSummaryNewPage);
				if(result.page.pageOrder=='Vertical'){
					overThenDownRb.setValue(false);
					downThenOverRb.setValue(true);
				}else{
					overThenDownRb.setValue(true);
					downThenOverRb.setValue(false);
				}

			//	adjustToRb.setValue(ps.page.adjust.enabled);
			//	adjustToSpn.setValue(ps.page.adjust.size);
				fitToRb.setValue(ps.page.fit.enabled);
				pageWideSpn.setValue(ps.page.fit.rowNum);
				pageTallSpn.setValue(ps.page.fit.columnNum);
				paperSizeCmb.setValue(ps.page.paper_size);
			//	firstPageNumberTxf.setValue(ps.page.first_page);
				var tmpHRec = new Ext.data.Record({
							leftStyle : ps.hf.header.left_style,
							leftValue : _formatText(ps.hf.header.left_value),
							leftPreview : getPreview(ps.hf.header.left_value),
							centerStyle : ps.hf.header.center_style,
							centerValue : _formatText(ps.hf.header.center_value),
							centerPreview : getPreview(ps.hf.header.center_value),
							rightStyle : ps.hf.header.right_style,
							rightValue : _formatText(ps.hf.header.right_value),
							rightPreview : getPreview(ps.hf.header.right_value)
				});
				var tmpFRec = new Ext.data.Record({
							leftStyle : ps.hf.footer.left_style,
							leftValue : _formatText(ps.hf.footer.left_value),
							leftPreview : getPreview(ps.hf.footer.left_value),
							centerStyle : ps.hf.footer.center_style,
							centerValue : _formatText(ps.hf.footer.center_value),
							centerPreview : getPreview(ps.hf.footer.center_value),
							rightStyle : ps.hf.footer.right_style,
							rightValue : _formatText(ps.hf.footer.right_value),
							rightPreview : getPreview(ps.hf.footer.right_value)
				});
				customHandleFunction(tmpHRec, "Header".localize());
				customHandleFunction(tmpFRec, "Footer".localize());

				topMarginSpn.setValue(ps.margins.top);
				headerMarginSpn.setValue(ps.margins.header);
				leftMarginSpn.setValue(ps.margins.left);
				rightMarginSpn.setValue(ps.margins.right);
				bottomMarginSpn.setValue(ps.margins.bottom);
				footerMarginSpn.setValue(ps.margins.footer);

				//_preselctionChbValues.horizontallyChb = ps.margins.horiz;
				//_preselctionChbValues.verticallyChb = ps.margins.vert;
				
				/*refersToTxf.setValue(ps.sheet.print_area_string);
				tfTitleRows.setValue(ps.sheet.print_title_rows);
				tfTitleCols.setValue(ps.sheet.print_title_cols);
				_preselctionChbValues.gridLinesChb = ps.sheet.gridlines;
				
				downThenOverRb.setValue(ps.sheet.page_order);
				overThenDownRb.setValue(!ps.sheet.page_order);
				setPageOrderPic(ps.sheet.page_order ? 0 : 1)
				*/
			}
		};
		
		initPageSetupDlg();
		//this.setContext();
};