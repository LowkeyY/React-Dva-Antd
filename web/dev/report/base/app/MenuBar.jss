Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");
dev.report.base.app.MenuBar = function() {
	this.menu = {}, rngClearType = dev.report.base.range.ContentType;
	dev.report.base.app.Menu = new Ext.Toolbar({
				cls : "extmenubar"
			});
	dev.report.base.app.Menu.add({
		text : "File".localize(),
		cls : "extmenubaritem",
		id : "wMenuBar_file_btn",
		menu : (this.menu.fileMenu = new Ext.menu.Menu({
			id : "wMenuBar_file_mn",
			cls : "default-format-window",
			items : [{
				text : "New".localize().concat("..."),
				id : "wMenuBar_fileNew_btn",
				iconCls : "icon_new_doc",
				handler : function() {
					var Report = dev.report.base.app.frames.get('Report');
					if (Report.reportPanel.state == 'create') {
						Report.navPanel.getTree().loadSelfNode(
								dev.report.base.app.params['parent_id'],
								Report.navPanel.clickEvent);
					} else {
						Report.navPanel.getTree()
								.loadParentNode(Report.navPanel.clickEvent);
					}
					dev.report.base.app.gridBlurObserver.notify(this);
					dev.report.base.action.newWorkbook();
				}
			}, {
				text : "Open".localize().concat("..."),
				id : "wMenuBar_fileOpen_btn",
				iconCls : "icon_open_doc",
				handler : function() {
					using("dev.folder.FolderWindow");
					if (dev.report.base.app.params['parent_id']) {
						var folderWindow = dev.report.base.app.frames
								.createPanel(new dev.folder.FolderWindow(
										0,
										'report',
										dev.report.base.app.params['parent_id'],
										300, dev.report.base.app.frames));
						folderWindow.show();
					} else {
						var folderWindow = dev.report.base.app.frames
								.createPanel(new dev.folder.FolderWindow(0,
										'report', '', 300,
										dev.report.base.app.frames));
						folderWindow.show();
					}
				}
			}, "-", (this.menu.saveItem = new Ext.menu.Item({
						text : "Save".localize(),
						id : "wMenuBar_fileSave_btn",
						handler : function() {
							if (dev.report.base.app.Report.rt.list.length > 0) {
								dev.report.base.app.gridBlurObserver
										.notify(this);
								dev.report.base.node.save();
							} else {
								Ext.msg("error", '不能保存,至少导入一个查询!');
							}
						},
						iconCls : "icon_save_doc"
					})), (this.menu.scriptItem = new Ext.menu.Item({
				text : "Export Script".localize(),
				id : "wMenuBar_fileSript_btn",
				handler : function() {
					var me = dev.report.base.app.Report;
					if (me.rt.list.length > 0) {
						using("dev.report.SaveReport");
						var Report = me.frames.get('Report');
						Report.saveReport = me.frames
								.createPanel(new dev.report.SaveReport(me.params));
						Report.saveReport.load();
					} else {
						Ext.msg("error", '不能生成脚本,至少导入一个查询!');
					}
				},
				icon : "/themes/icon/all/script_code.gif"
			})), "-", (this.menu.deleteItem = new Ext.menu.Item({
				text : "Delete".localize(),
				id : "wMenuBar_fileDelete_btn",
				handler : function() {
					var Report = dev.report.base.app.frames.get('Report');
					Ext.msg('confirm', '警告：删除报表，确认吗?', function(answer) {
						if (answer == 'yes') {
							msg = Tool
									.getXML("/dev/report/ReportEvent.jcp?event=delete&report_id="
											+ dev.report.base.app.params['report_id']);
							if (msg.firstChild.firstChild.nodeValue == 'true') {
								Report.navPanel
										.getTree()
										.loadParentNode(Report.navPanel.clickEvent);
							} else {
								Ext
										.msg(
												"error",
												'查询保存失败,原因:<br>'
														+ msg.lastChild.firstChild.nodeValue);
							}
						}
					}.createDelegate(this));
				},
				icon : '/themes/icon/common/delete.gif'
			})), "-", {
				text : "Page Setup".localize().concat("..."),
				id : "wMenuBar_filePageStp_btn",
				handler : function() {
					using("dev.report.base.dlg.PageSetup");
					var pageSetup = new dev.report.base.dlg.PageSetup();
					pageSetup.win.show(pageSetup)
				}
			}, {
				text : "Print Preview".localize(),
				id : "wMenuBar_filePrintPrv_btn",
				handler : function() {
					var Report = dev.report.base.app.frames.get('Report');
					if (Report.reportPanel.state != 'create') {
						dev.report.base.app.gridBlurObserver.notify(this);
						dev.report.base.app.handlers.openViewMode();
					} else {
						Ext.msg("error", '必须保存后才可以预览!');
					}
				}
					// dev.report.base.action.exportToHTML
				}]
		}))
	}, {
		text : "Edit".localize(),
		cls : "extmenubaritem",
		id : "wMenuBar_edit_btn",
		menu : new Ext.menu.Menu({
					id : "wMenuBar_edit_mn",
					cls : "default-format-window",
					items : [
							(this.menu.undoItem = new Ext.menu.Item({
										text : "Undo".localize(),
										id : "wMenuBar_editUndo_btn",
										iconCls : "icon_undo",
										handler : dev.report.base.sheet.undo,
										hidden : true
									})),
							(this.menu.redoItem = new Ext.menu.Item({
										text : "Redo".localize(),
										id : "wMenuBar_editRedo_btn",
										iconCls : "icon_redo",
										handler : dev.report.base.sheet.redo,
										hidden : true
									})),
							{
								text : "Cut".localize(),
								id : "wMenuBar_editCut_btn",
								iconCls : "icon_cut",
								handler : function() {
									dev.report.base.action.cut(false)
								}
							},
							{
								text : "Copy".localize(),
								id : "wMenuBar_editCopy_btn",
								iconCls : "icon_copy",
								handler : function() {
									dev.report.base.action.copy(false)
								}
							},
							(this.menu.paste = new Ext.menu.Item({
										text : "Paste".localize(),
										id : "wMenuBar_editPaste_btn",
										iconCls : "icon_paste",
										disabled : true,
										handler : dev.report.base.action.paste
									}))/*
										 * , (this.menu.pasteSpec = new
										 * Ext.menu.Item({ text : "Paste
										 * Special".localize().concat("..."), id :
										 * "wMenuBar_editPasteSpc_btn", disabled :
										 * true, handler : function() {
										 * using("dev.report.base.dlg.PasteSpecial");
										 * var pasteSpecial=new
										 * dev.report.base.dlg.PasteSpecial();
										 * pasteSpecial.win.show(pasteSpecial); }
										 * }))
										 */,
							"-",
							{
								text : "Clear".localize(),
								id : "wMenuBar_editClear_btn",
								iconCls : "icon_clear_all",
								menu : {
									cls : "default-format-window",
									items : [{
										text : "Clear All".localize(),
										id : "wMenuBar_editClrAll_btn",
										iconCls : "icon_clear_all",
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.action
													.clear(rngClearType.ALL_CLEAR)
										}
									}, {
										text : "Clear Formats".localize(),
										id : "wMenuBar_editClrFmt_btn",
										iconCls : "icon_clear_formats",
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.action
													.clear(rngClearType.STYLE
															| rngClearType.FORMAT
															| rngClearType.CNDFMT)
										}
									}, {
										text : "Clear Contents".localize(),
										id : "wMenuBar_editClrCnts_btn",
										iconCls : "icon_clear_content",
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.action
													.clear(rngClearType.FORMULA)
										}
									}]
								}
							},
							(this.menu.delRow = new Ext.menu.Item({
										text : "Delete Rows".localize(),
										id : "wMenuBar_editDltRow_btn",
										iconCls : "icon_del_row",
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.action
													.insDelRowCol("del", "row")
										}
									})),
							(this.menu.delCol = new Ext.menu.Item({
										text : "Delete Columns".localize(),
										id : "wMenuBar_editDltCol_btn",
										iconCls : "icon_del_col",
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.action
													.insDelRowCol("del", "col")
										}
									}))/*
										 * , "-", { text : "Go
										 * To".localize().concat("..."), id :
										 * "wMenuBar_editGoTo_btn", iconCls :
										 * "icon_goto", handler : function() {
										 * using("dev.report.base.dlg.GoTo");
										 * var goTo=new
										 * dev.report.base.dlg.GoTo();
										 * goTo.win.show(goTo); } }
										 */]
				})
	}, {
		text : "View".localize(),
		cls : "extmenubaritem",
		id : "wMenuBar_view_btn",
		menu : new Ext.menu.Menu({
					id : "wMenuBar_view_mn",
					cls : "default-format-window",
					items : [{
						text : "Toolbars".localize(),
						id : "wMenuBar_viewTlbr_btn",
						enableToggle : true,
						checked : !dev.report.base.app.initHideToolbar,
						checkHandler : function(btn, state) {
							dev.report.base.app.handlers.hideShowToolbar(state,
									"")
						}
					}, {
						text : "Formula Bar".localize(),
						id : "wMenuBar_viewFrmlbr_btn",
						enableToggle : true,
						checked : !dev.report.base.app.initHideFormulaBar,
						checkHandler : function(btn, state) {
							dev.report.base.app.handlers
									.hideShowFormulaBar(state)
						}
					}, "-", (this.menu.userModeView = new Ext.menu.Item({
								text : "User Mode".localize(),
								id : "wMenuBar_viewUserMd_btn",
								handler : function() {
									dev.report.base.app.gridBlurObserver
											.notify(this);
									dev.report.base.app.handlers.openViewMode()
								}
							}))]
				})
	}, {
		text : "Insert".localize(),
		cls : "extmenubaritem",
		id : "wMenuBar_insert_btn",
		menu : new Ext.menu.Menu({
			id : "wMenuBar_insert_mn",
			cls : "default-format-window",
			items : [(this.menu.insRow = new Ext.menu.Item({
								text : "Rows".localize(),
								id : "wMenuBar_insertRows_btn",
								iconCls : "icon_ins_row",
								handler : function() {
									dev.report.base.app.gridBlurObserver
											.notify(this);
									dev.report.base.action.insDelRowCol("ins",
											"row")
								}
							})), (this.menu.insCol = new Ext.menu.Item({
								text : "Columns".localize(),
								id : "wMenuBar_insertColumns_btn",
								iconCls : "icon_ins_col",
								handler : function() {
									dev.report.base.app.gridBlurObserver
											.notify(this);
									dev.report.base.action.insDelRowCol("ins",
											"col")
								}
							})),/*
								 * { text : "Worksheet".localize(), id :
								 * "wMenuBar_insertWrkSht_btn", iconCls :
								 * "icon_ins_sheet", handler : function() {
								 * dev.report.base.app.activeBook.getSheetSelector()
								 * .addSheet() } }, { text :
								 * "Chart".localize().concat("..."), id :
								 * "wMenuBar_insertChart_btn", handler :
								 * function() {
								 * using("dev.report.base.dlg.chart.InsertChart");
								 * var chart1=new
								 * dev.report.base.dlg.chart.InsertChart("insert",
								 * 0); }, iconCls : "icon_insert_chart" },
								 */"-", {
						text : "Function".localize().concat("..."),
						id : "wMenuBar_insertFnc_btn",
						iconCls : "icon_ins_func",
						handler : function() {
							using("dev.report.base.dlg.InsertFunction");
							var insertFunction = new dev.report.base.dlg.InsertFunction(
									{
										id : "fbar",
										fn : null
									}, dev.report.base.app.currFormula
											.getValue());
						}
					}, {
						text : "Macros".localize(),
						id : "wMenuBar_toolsMcrs_btn",
						iconCls : "icon_macro",
						handler : function() {
							using("dev.report.base.dlg.InsertMacro");
							var insertMacro = new dev.report.base.dlg.InsertMacro();
						}
					}, {
						text : "Variables".localize(),
						id : "wMenuBar_dataVariables_btn",
						iconCls : "icon_variables",
						handler : function() {
							using("dev.report.base.dlg.PrivateVars");
							var ARF = new dev.report.base.dlg.PrivateVars();
						}
					}, "-", {
						text : "Picture".localize(),
						id : "wMenuBar_insertPct_btn",
						iconCls : "icon_ins_picture",
						handler : function() {
							using("dev.report.base.dlg.InsertPicture");
							var insertPicture = new dev.report.base.dlg.InsertPicture();
							insertPicture.win.show();
						}
					}, {
						text : "Hyperlink".localize().concat("..."),
						id : "wMenuBar_insertHLink_btn",
						iconCls : "icon_insert_hyperlink",
						handler : function() {
							var env = dev.report.base.app.environment, selCoord = env.selectedCellCoords;
							using("dev.report.base.dlg.InsertHyperlink");
							var insertHyperlink = new dev.report.base.dlg.InsertHyperlink(
									{
										defName : dev.report.base.general
												.filterHLTags(selCoord[0],
														selCoord[1],
														env.selectedCellValue,
														false),
										handlers : {
											scope : dev.report.base.hl,
											set : dev.report.base.hl.set
										}
									});
						}
					}]
		})
	}, {
		text : "Format".localize(),
		cls : "extmenubaritem",
		id : "wMenuBar_format_btn",
		menu : new Ext.menu.Menu({
			id : "wMenuBar_format_mn",
			cls : "default-format-window",
			items : [{
						text : "Cells".localize().concat("..."),
						id : "wMenuBar_formatCells_btn",
						iconCls : "icon_edit",
						handler : function() {
							using("dev.report.base.dlg.Format");
							var format = new dev.report.base.dlg.Format();
						}
					}, "-", {
						text : "Row Height".localize().concat("..."),
						id : "wMenuBar_formatRHeight_btn",
						iconCls : "icon_row_height",
						handler : function() {
							using("dev.report.base.dlg.FormatColRow");
							var formatRow = new dev.report.base.dlg.FormatColRow(
									dev.report.base.grid.headerType.ROW,
									dev.report.base.sheet
											.getColRowSize(dev.report.base.grid.headerType.ROW));
						}
					}, {
						text : "Autofit Row Height".localize(),
						id : "wMenuBar_formatARHeight_btn",
						handler : function() {
							dev.report.base.action
									.resizeRowCol(dev.report.base.grid.headerType.ROW)
						}
					}, "-", {
						text : "Column Width".localize().concat("..."),
						id : "wMenuBar_formatCWidth_btn",
						iconCls : "icon_col_width",
						handler : function() {
							using("dev.report.base.dlg.FormatColRow");
							var formatCol = new dev.report.base.dlg.FormatColRow(
									dev.report.base.grid.headerType.COLUMN,
									dev.report.base.sheet
											.getColRowSize(dev.report.base.grid.headerType.COLUMN));
						}
					}, {
						text : "Autofit Column Width".localize(),
						id : "wMenuBar_formatACWidth_btn",
						handler : function() {
							dev.report.base.action
									.resizeRowCol(dev.report.base.grid.headerType.COLUMN)
						}
					}, "-", {
						text : "Merge Cells".localize(),
						id : "wMenuBar_formatMrgC_btn",
						iconCls : "icon_merge_cells",
						handler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.action.mergeCells(false)
						}
					}, {
						text : "Unmerge Cells".localize(),
						id : "wMenuBar_formatUMrgC_btn",
						iconCls : "icon_unmerge_cells",
						handler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.action.mergeCells(true)
						}
					}, "-", {
						text : "Conditional Formatting".localize(),
						id : "wMenuBar_formatCndFmt_btn",
						iconCls : "icon_conditional_fmt",
						menu : {
							id : "wMenuBar_formatCndFmt_mn",
							cls : "default-format-window",
							items : [{
								text : "New Rule".localize().concat("..."),
								id : "wMenuBar_formatCndFmtNR_btn",
								iconCls : "icon_cnd_new",
								handler : function() {
									using("dev.report.base.dlg.ConditionalFormatting");
									var cf = new dev.report.base.dlg.ConditionalFormatting(
											false, false, "base");
								}
							}, {
								text : "Clear Rules".localize(),
								id : "wMenuBar_formatCndFmtCR_btn",
								iconCls : "icon_cnd_clear",
								handler : function() {
									dev.report.base.cndfmt
											.remove(dev.report.base.cndfmt.SCOPE_CURR_SEL)
								}
							}, {
								text : "Manage Rules".localize().concat("..."),
								id : "wMenuBar_formatCndFmtMR_btn",
								iconCls : "icon_cnd_manage",
								handler : function() {
									using("dev.report.base.dlg.ManageCF");
									var MCF = new dev.report.base.dlg.ManageCF();
								}
							}]
						}
					}]
		})
	}, /*
		 * { text : "Data".localize(), cls : "extmenubaritem", id :
		 * "wMenuBar_data_btn", menu : new Ext.menu.Menu({ id :
		 * "wMenuBar_data_mn", cls : "default-format-window", items : [{ text :
		 * "Refresh Data".localize(), id : "wMenuBar_dataRDt_btn", handler :
		 * function() { dev.report.base.app.gridBlurObserver.notify(this);
		 * dev.report.base.sheet.refresh() } }, { text : "Auto-Refresh
		 * Data".localize(), id : "wMenuBar_dataARDt_btn", enableToggle : true,
		 * checked : false, checkHandler : function() { if(this.checked){
		 * using("dev.report.base.dlg.AutoRefresh"); var MCF=new
		 * dev.report.base.dlg.AutoRefresh(); }else{
		 * dev.report.base.book.autoRefresh(0) } } }, "-", { text :
		 * "Auto-Calculate Data".localize(), id : "wMenuBar_dataACDt_btn",
		 * enableToggle : true, checked : false, checkHandler : function() {
		 * dev.report.base.app.gridBlurObserver.notify(this);
		 * dev.report.base.general.autoCalc(this.checked) } }, "-", { text :
		 * "Variables".localize(), id : "wMenuBar_dataVariables_btn", iconCls :
		 * "icon_variables", handler : function() {
		 * using("dev.report.base.dlg.PrivateVars"); var ARF=new
		 * dev.report.base.dlg.PrivateVars(); } }], listeners : { beforeshow :
		 * function() { var aBook = dev.report.base.app.activeBook;
		 * this.items.get("wMenuBar_dataARDt_btn").setChecked( aBook &&
		 * aBook._autoRefresh > 0, true);
		 * this.items.get("wMenuBar_dataACDt_btn").setChecked(
		 * dev.report.base.app.autoCalc, true)
		 *  } } }) },
		 */{
		text : "Tools".localize(),
		cls : "extmenubaritem",
		id : "wMenuBar_tools_btn",
		menu : new Ext.menu.Menu({
					id : "ToolsMenu",
					cls : "default-format-window",
					items : [
							(this.menu.newTitle = new Ext.menu.Item({
										id : "wMenuBar_newTitle_btn",
										text : "Title Range".localize(),
										iconCls : "icon_title",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							(this.menu.newColumnHeader = new Ext.menu.Item({
										id : "wMenuBar_newColumnHeader_btn",
										text : "Column Header Range".localize(),
										iconCls : "icon_columnHeader",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							(this.menu.newHBVert = new Ext.menu.Item({
										id : "wMenuBar_newHBVert_btn",
										text : "Vertical DynaRange".localize(),
										iconCls : "icon_vert_dynarange",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							(this.menu.newHBHoriz = new Ext.menu.Item({
										id : "wMenuBar_newHBHoriz_btn",
										text : "Horizontal DynaRange"
												.localize(),
										iconCls : "icon_hor_dynarange",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							(this.menu.newColumnFooter = new Ext.menu.Item({
										id : "wMenuBar_newColumnFooter_btn",
										text : "Column Footer Range".localize(),
										iconCls : "icon_columnFooter",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							(this.menu.newSummary = new Ext.menu.Item({
										id : "wMenuBar_newSummary_btn",
										text : "Summary Range".localize(),
										iconCls : "icon_summary",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							"-",
							(this.menu.newGroupHeader = new Ext.menu.Item({
										id : "wMenuBar_newGroupHeader_btn",
										text : "Group Header Range".localize(),
										iconCls : "icon_group_header",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									})),
							(this.menu.newGroupFooter = new Ext.menu.Item({
										id : "wMenuBar_newGroupFooter_btn",
										text : "Group Footer Range".localize(),
										iconCls : "icon_group_footer",
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(
													item, ev)
										}
									}))

					/*
					 * { text : "DynaRanges".localize(), id :
					 * "wMenuBar_toolsDynaR_btn", iconCls : "icon_dynaranges",
					 * menu : { cls : "default-format-window", items :
					 * [(this.menu.newHBVert = new Ext.menu.Item({ id :
					 * "wMenuBar_newHBVert_btn", text : "Vertical
					 * DynaRange".localize(), iconCls : "icon_vert_dynarange",
					 * handler : function(item, ev) {
					 * dev.report.base.app.gridBlurObserver.notify(this);
					 * alert("Vertical DynaRange"); } })), (this.menu.newHBHoriz =
					 * new Ext.menu.Item({ id : "wMenuBar_newHBHoriz_btn", text :
					 * "Horizontal DynaRange".localize(), iconCls :
					 * "icon_hor_dynarange", handler : function(item, ev) {
					 * dev.report.base.app.gridBlurObserver.notify(this);
					 * alert("Horizontal DynaRange"); } }))] } }, "-", { text :
					 * "Macros".localize(), id : "wMenuBar_toolsMcrs_btn",
					 * iconCls : "icon_macro", menu : { id :
					 * "wMenuBar_toolsMcrs_mn", cls : "default-format-window",
					 * items : [{ text : "Macro
					 * Editor".localize().concat("..."), id :
					 * "wMenuBar_toolsMcrsE_btn", iconCls : "icon_macro_editor",
					 * handler : function() {
					 * using("dev.report.base.dlg.InsertMacro"); var
					 * insertMacro=new dev.report.base.dlg.InsertMacro(); } }] } }, {
					 * text : "Widgets".localize(), id :
					 * "wMenuBar_toolsWdg_btn", iconCls : "icon_widget", menu : {
					 * id : "wMenuBar_toolsWdg_mn", cls :
					 * "default-format-window", items : [{ text : "Custom
					 * Widget".localize().concat("..."), id :
					 * "wMenuBar_toolsCWdg_btn", iconCls : "icon_widget_custom",
					 * handler : function() {
					 * using("dev.report.base.dlg.FormatControl"); var
					 * formatControl=new dev.report.base.dlg.FormatControl({
					 * type : dev.report.base.wsel.type.WIDGET }); } }] } }
					 */]
				})
	});
	this.enderTO = function(parantDom) {
		dev.report.base.app.Menu.render(parantDom)
	}
};