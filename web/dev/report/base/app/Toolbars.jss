
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");

dev.report.base.app.Toolbars = function() {

	this.tbar={};
	this.init = function() {
		this.initStandardToolbar();
		this.initFormatToolbar();
		this.initDynarangeToolbar();
	};
	this.initStandardToolbar = function() {
		dev.report.base.app.standardToolbar = new Ext.Toolbar({
					cls : "exttoolbar",
					renderTo : "xStandardToolbar",
					items : [
							{
								id : "wToolbar_New_btn",
								iconCls : "icon_new_doc",
								tooltip : "Create new document".localize(),
								handler : function() {
									dev.report.base.app.gridBlurObserver.notify(this);
									dev.report.base.action.newWorkbook();
									var Report=dev.report.base.app.frames.get('Report');
									if(Report.reportPanel.state=='create'){
										Report.navPanel.getTree().loadSelfNode(dev.report.base.app.params['parent_id'],Report.navPanel.clickEvent);
									}else{
										Report.navPanel.getTree().loadParentNode(Report.navPanel.clickEvent);
									}
								}
							},
							{
								id : "wToolbar_Open_btn",
								iconCls : "icon_open_doc",
								cls : "x-btn-icon",
								tooltip : "Open document".localize(),
								handler : function() {
									dev.report.base.app.gridBlurObserver.notify(this);
									using("dev.folder.FolderWindow");
									if(dev.report.base.app.params['parent_id']){
										var folderWindow =dev.report.base.app.frames.createPanel(new dev.folder.FolderWindow(0,'report',dev.report.base.app.params['parent_id'],300,dev.report.base.app.frames)); 
										folderWindow.show();
									}else{
										var folderWindow =dev.report.base.app.frames.createPanel(new dev.folder.FolderWindow(0,'report','',300,dev.report.base.app.frames)); 
										folderWindow.show();
									}
								}
							},
							(this.tbar.saveItem = new Ext.Toolbar.Button({
										id : "wToolbar_Save_btn",
										iconCls : "icon_save_doc",
										cls : "x-btn-icon",
										tooltip : "Save document".localize(),
										handler : function() {
											dev.report.base.app.gridBlurObserver.notify(this);
											dev.report.base.node.save();
										}
									})),
							(this.tbar.undoItem = new Ext.Toolbar.Button({
										id : "wToolbar_Undo_btn",
										iconCls : "icon_undo",
										cls : "x-btn-icon",
										tooltip : "Undo".localize(),
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.sheet.undo()
										},
										hidden : true
									})),
							(this.tbar.redoItem = new Ext.Toolbar.Button({
										id : "wToolbar_Redo_btn",
										iconCls : "icon_redo",
										cls : "x-btn-icon",
										tooltip : "Redo".localize(),
										handler : function() {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.sheet.redo()
										},
										hidden : true
									})), "-", {
								id : "wToolbar_copy_btn",
								iconCls : "icon_copy",
								cls : "x-btn-icon",
								tooltip : "Copy".localize(),
								handler : function() {
									dev.report.base.app.gridBlurObserver.notify(this);
									dev.report.base.action.copy(false)
								}
							}, {
								id : "wToolbar_cut_btn",
								iconCls : "icon_cut",
								cls : "x-btn-icon",
								tooltip : "Cut".localize(),
								handler : function() {
									dev.report.base.app.gridBlurObserver.notify(this);
									dev.report.base.action.cut(false)
								}
							}, (this.tbar.paste = new Ext.Toolbar.Button({
										id : "wToolbar_paste_btn",
										iconCls : "icon_paste",
										cls : "x-btn-icon",
										tooltip : "Paste".localize(),
										disabled : true,
										handler : dev.report.base.action.paste
									})),
							(this.tbar.formatPainter = new Ext.Toolbar.Button({
										iconCls : "icon_format_painter",
										cls : "x-btn-icon",
										id : "wToolbar_FmtPainter_btn",
										tooltip : "Format painter".localize(),
										enableToggle : true,
										pressed : false,
										timer : null,
										clicked : false,
										listeners : {
											click : function() {
												dev.report.base.action
														.applyFormatPainter(this)
											}
										}
									})), "  "]
				})
	};
	this.initFormatToolbar = function() {
		var that = this;
		dev.report.base.app.formatToolbar = new Ext.Toolbar({
			cls : "exttoolbar",
			renderTo : "xFormatToolbar",
			layout : "absolute",
			width : 566,
			height : 27,
			items : [(this.tbar.fonts = new Ext.form.ComboBox({
				id : "wToolbar_fontName_cmb",
				displayField : "fontname",
				valueField : "fontdef",
				typeAhead : true,
				x : 2,
				y : 3,
				editable : true,
				mode : "local",
				triggerAction : "all",
				ctCls : "toolbar-combo",
				selectOnFocus : true,
				forceSelection : true,
				value : dev.report.base.app.cnfDefaultFont,
				listWidth : 160,
				width : 120,
				tpl : '<tpl for="."><div class="x-combo-list-item" style="font-family: {fontdef}; color: #15428B;">{fontname}</div></tpl>',
				store : new Ext.data.SimpleStore({
							fields : ["fontname", "fontdef"],
							data : dev.report.base.style.fonts
						}),
				listeners : {
					select : {
						fn : dev.report.base.app.handlers.onFormatDropdownSelect,
						scope : this
					},
					focus : {
						fn : dev.report.base.app.handlers.onFormatDropdownFocus,
						scope : this
					},
					blur : {
						fn : dev.report.base.app.handlers.onFormatDropdownBlur,
						scope : this
					}
				}
			})), " ", (this.tbar.fontSizes = new Ext.form.ComboBox({
				id : "wToolbar_fontSize_cmb",
				displayField : "fontsize",
				valueField : "fontsize",
				typeAhead : true,
				x : 124,
				y : 3,
				editable : true,
				selectOnFocus : true,
				mode : "local",
				triggerAction : "all",
				forceSelection : false,
				value : dev.report.base.app.cnfDefaultFontSize,
				listWidth : 110,
				width : 40,
				allowBlank : false,
				applyTo : this.tbar.fontSizes,
				tpl : '<tpl for="."><div class="x-combo-list-item" style="font-size: {fontsize}pt; color: #15428B;">{fontsize}</div></tpl>',
				store : new Ext.data.SimpleStore({
							fields : ["fontsize"],
							data : dev.report.base.style.fontSizes
						}),
				listeners : {
					change : {
						fn : dev.report.base.app.handlers.onFormatDropdownChange,
						scope : this
					},
					select : {
						fn : dev.report.base.app.handlers.onFormatDropdownSelect,
						scope : this
					},
					focus : {
						fn : dev.report.base.app.handlers.onFormatDropdownFocus,
						scope : this
					},
					blur : {
						fn : dev.report.base.app.handlers.onFormatDropdownBlur,
						scope : this
					},
					specialkey : {
						fn : dev.report.base.app.handlers.onFormatDropdownSpecKey,
						scope : this
					}
				}
			})), " ", (this.tbar.bold = new Ext.Toolbar.Button({
						id : "wToolbar_bold_btn",
						x : 166,
						y : 2,
						iconCls : "icon_font".concat("_bold".localize()),
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : false,
						toggleHandler : function(item, pressed) {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.app.handlers.onFormatItemToggle(item, pressed)
						},
						tooltip : "Bold".localize()
					})), (this.tbar.italic = new Ext.Toolbar.Button({
						id : "wToolbar_italic_btn",
						x : 187,
						y : 2,
						iconCls : "icon_font".concat("_italic".localize()),
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : false,
						toggleHandler : function(item, pressed) {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.app.handlers.onFormatItemToggle(item, pressed)
						},
						tooltip : "Italic".localize()
					})), (this.tbar.underline = new Ext.Toolbar.Button({
						id : "wToolbar_uLine_btn",
						x : 208,
						y : 2,
						iconCls : "icon_font_underline",
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : false,
						toggleHandler : function(item, pressed) {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.app.handlers.onFormatItemToggle(item, pressed)
						},
						tooltip : "Underline".localize()
					})), {
				xtype : "tbseparator",
				x : 230,
				y : 4
			}, (this.tbar.alignLeft = new Ext.Toolbar.Button({
						id : "wToolbar_alignLeft_btn",
						x : 238,
						y : 2,
						iconCls : "icon_align_left",
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : false,
						toggleHandler : function(item, pressed) {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.app.handlers.onFormatItemToggle(item, pressed)
						},
						tooltip : "Align Text Left".localize()
					})), (this.tbar.alignCenter = new Ext.Toolbar.Button({
						id : "wToolbar_alignCenter_btn",
						x : 259,
						y : 2,
						iconCls : "icon_align_center",
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : false,
						toggleHandler : function(item, pressed) {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.app.handlers.onFormatItemToggle(item, pressed)
						},
						tooltip : "Center text".localize()
					})), (this.tbar.alignRight = new Ext.Toolbar.Button({
						id : "wToolbar_alignRight_btn",
						x : 280,
						y : 2,
						iconCls : "icon_align_right",
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : false,
						toggleHandler : function(item, pressed) {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.app.handlers.onFormatItemToggle(item, pressed)
						},
						tooltip : "Align Text Right".localize()
					})), {
				xtype : "tbseparator",
				x : 302,
				y : 4
			}, (this.tbar.border = new Ext.Toolbar.SplitButton({
				id : "wToolbar_Border_btn",
				x : 310,
				y : 2,
				iconCls : "icon-brd-bottom-norm",
				tooltip : "Bottom Border".localize(),
				handler : function(item, ev) {
					dev.report.base.app.gridBlurObserver.notify(this);
					dev.report.base.app.handlers.onBorderSelect(item, ev)
				},
				menu : {
					cls : "default-format-window",
					items : [{
								id : "brd-bottom-norm",
								text : "Bottom Border".localize(),
								iconCls : "icon-brd-bottom-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-top-norm",
								text : "Top Border".localize(),
								iconCls : "icon-brd-top-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-left-norm",
								text : "Left Border".localize(),
								iconCls : "icon-brd-left-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-right-norm",
								text : "Right Border".localize(),
								iconCls : "icon-brd-right-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, "-", {
								id : "brd-all-norm",
								text : "All Borders".localize(),
								iconCls : "icon-brd-all-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-out-norm",
								text : "Outside Borders".localize(),
								iconCls : "icon-brd-out-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-out-thick",
								text : "Thick Outside Border".localize(),
								iconCls : "icon-brd-out-thick",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-all-none",
								text : "No Border".localize(),
								iconCls : "icon-brd-all-none",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, "-", {
								id : "brd-top-bottom-norm",
								text : "Top and Bottom Border".localize(),
								iconCls : "icon-brd-top-bottom-norm",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-bottom-thick",
								text : "Thick Bottom Border".localize(),
								iconCls : "icon-brd-bottom-thick",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, {
								id : "brd-top-norm-bottom-thick",
								text : "Top and Thick Bottom Border".localize(),
								iconCls : "icon-brd-top-norm-bottom-thick",
								handler : dev.report.base.app.handlers.onBorderSelect
							}, "-", {
								id : "formatCellsBorders",
								text : "More Borders".localize().concat("..."),
								iconCls : "icon-brd-more",
								handler : function() {
									using("dev.report.base.dlg.Format");
									var format=new dev.report.base.dlg.Format("formatCellsBorders");
								}
							}],
					listeners : {
						beforeshow : function() {
							dev.report.base.app.gridBlurObserver.notify(this)
						}
					}
				}
			})), new Ext.Toolbar.Button({
						id : "wToolbar_MergeCells_btn",
						x : 346,
						y : 2,
						iconCls : "icon_merge_cells",
						cls : "x-btn-icon",
						handler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.action.mergeCells(false)
						},
						tooltip : "Merge Cells".localize()
					}), new Ext.Toolbar.Button({
						id : "wToolbar_UnmergeCells_btn",
						x : 367,
						y : 2,
						iconCls : "icon_unmerge_cells",
						cls : "x-btn-icon",
						handler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.action.mergeCells(true)
						},
						tooltip : "Unmerge Cells".localize()
					}), {
				xtype : "tbseparator",
				x : 389,
				y : 4
			}, new Ext.Toolbar.SplitButton({
				id : "wToolbar_bgColor_btn",
				iconCls : "iconbgcolor",
				x : 397,
				y : 2,
				tooltip : "Fill Color".localize(),
				handler : function(item, color) {
					dev.report.base.app.gridBlurObserver.notify(this);
					dev.report.base.app.handlers.onColorSelect(item, color)
				},
				menu : (this.tbar.bgColor = new Ext.menu.Menu({
					id : "wToolbar_bgColor_mn",
					colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
					cls : "wide-color-palette",
					iconCls : "no-icon",
					handler : dev.report.base.app.handlers.onColorSelect,
					items : [{
								text : "No Color".localize(),
								id : "bgNoColor",
								handler : dev.report.base.app.handlers.onColorSelect
							}, new Ext.ColorPalette({
								colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
								handler : dev.report.base.app.handlers.onColorSelect,
								allowReselect : true
							})],
					listeners : {
						beforeshow : function() {
							dev.report.base.app.gridBlurObserver.notify(this)
						}
					}
				}))
			}), new Ext.Toolbar.SplitButton({
				id : "wToolbar_txtColor_btn",
				iconCls : "icontextcolor",
				x : 437,
				y : 2,
				tooltip : "Font Color".localize(),
				handler : function(item, color) {
					dev.report.base.app.gridBlurObserver.notify(this);
					dev.report.base.app.handlers.onColorSelect(item, color)
				},
				menu : new Ext.menu.ColorMenu({
					id : "wToolbar_txtColor_mn",
					allowReselect : true,
					iconCls : "no-icon",
					colors : dev.report.base.style.colorPalettes[dev.report.base.app.activeColorPalette],
					cls : "wide-color-palette",
					handler : dev.report.base.app.handlers.onColorSelect,
					listeners : {
						beforeshow : function() {
							dev.report.base.app.gridBlurObserver.notify(this)
						}
					}
				})
			}), {
				xtype : "tbseparator",
				x : 477,
				y : 4
			}/*, new Ext.Toolbar.Button({
						id : "wToolbar_Chart_btn",
						x : 485,
						y : 2,
						iconCls : "icon_insert_chart",
						cls : "x-btn-icon",
						tooltip : "Insert Chart".localize(),
						handler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							using("dev.report.base.dlg.chart.InsertChart");
							var chart1=new dev.report.base.dlg.chart.InsertChart("insert", 0);
						}
					}), new Ext.Toolbar.Button({
						id : "wToolbar_Widget_btn",
						x : 506,
						y : 2,
						iconCls : "icon_widget_custom",
						cls : "x-btn-icon",
						tooltip : "Custom Widget".localize(),
						handler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							using("dev.report.base.dlg.FormatControl");
							var formatControl=new dev.report.base.dlg.FormatControl({
									type : dev.report.base.wsel.type.WIDGET
							});
						}
					}), {
				xtype : "tbseparator",
				x : 528,
				y : 4
			}*/, (this.tbar.lock = new Ext.Toolbar.Button({
						id : "wToolbar_Lock_btn",
						x : 485,
						y : 2,
						iconCls : "icon_lock",
						cls : "x-btn-icon",
						enableToggle : true,
						pressed : true,
						toggleHandler : function() {
							dev.report.base.app.gridBlurObserver.notify(this);
							dev.report.base.style.toggleLock()
						},
						tooltip : "Item Lock/Unlock".localize()
					})), {
				xtype : "tbseparator",
				x : 507,
				y : 4
			}]
		});
		Ext.DomQuery.selectNode("*[class*=iconbgcolor]").style.borderLeft = "solid 4px #FF0000";
		Ext.DomQuery.selectNode("*[class*=icontextcolor]").style.borderLeft = "solid 4px #FFFF00"
	};
	this.initDynarangeToolbar = function() {
		dev.report.base.app.hbToolbar = new Ext.Toolbar({
					cls : "exttoolbar",
					renderTo : "xDynarangeToolbar",
					items : [
						  (this.tbar.newTitle = new Ext.Toolbar.Button({
										id : "wToolbar_newTitle_btn",
										iconCls : "icon_title",
										cls : "x-btn-icon",
										tooltip : "Title Range".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
							})),
							 (this.tbar.newColumnHeader = new Ext.Toolbar.Button({
										id : "wToolbar_newColumnHeader_btn",
										iconCls : "icon_columnHeader",
										cls : "x-btn-icon",
										tooltip : "Column Header Range".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
							})),
							(this.tbar.newHBVert = new Ext.Toolbar.Button({
										id : "wToolbar_newHBVert_btn",
										iconCls : "icon_vert_dynarange",
										cls : "x-btn-icon",
										tooltip : "Vertical Dynarange".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
									})),
							(this.tbar.newHBHoriz = new Ext.Toolbar.Button({
										id : "wToolbar_newHBHoriz_btn",
										iconCls : "icon_hor_dynarange",
										cls : "x-btn-icon",
										tooltip : "Horizontal Dynarange".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
									})),
							(this.tbar.newColumnFooter = new Ext.Toolbar.Button({
										id : "wToolbar_newColumnFooter_btn",
										iconCls : "icon_columnFooter",
										cls : "x-btn-icon",
										tooltip : "Column Footer Range".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
							})),
							(this.tbar.newSummary = new Ext.Toolbar.Button({
										id : "wToolbar_newSummary_btn",
										iconCls : "icon_summary",
										cls : "x-btn-icon",
										tooltip : "Summary Range".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
							})), "-",
							(this.tbar.newGroupHeader = new Ext.Toolbar.Button({
										id : "wToolbar_newGroupHeader_btn",
										iconCls : "icon_group_header",
										cls : "x-btn-icon",
										tooltip : "Group Header Range".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
							})),
							(this.tbar.newGroupFooter = new Ext.Toolbar.Button({
										id : "wToolbar_newGroupFooter_btn",
										iconCls : "icon_group_footer",
										cls : "x-btn-icon",
										tooltip : "Group Footer Range".localize(),
										handler : function(item, ev) {
											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.hb.addDynarange(item, ev)
										}
							})),
							"-",
							(this.tbar.hbQuickView = new Ext.Toolbar.Button({
										id : "wToolbar_HBQuickView_btn",
										iconCls : "icon_designer_preview",
										cls : "x-btn-icon",
										tooltip : "Designer Preview".localize(),
										enableToggle : true,
										pressed : false,
										toggleHandler : function(item, state) {
											var Report=dev.report.base.app.frames.get('Report');
											if(Report.reportPanel.state!='create'){
												dev.report.base.app.gridBlurObserver.notify(this);
												dev.report.base.app.handlers.openViewMode();
											}else{
												Ext.msg("error",'必须保存后才可以预览!');
											}
										}
									})),
							(this.tbar.userModeView = new Ext.Toolbar.Button({
										id : "wToolbar_ViewMode_btn",
										iconCls : "icon_user_mode",
										cls : "x-btn-icon",
										tooltip : "Open User Mode".localize(),
										handler : function() {

											dev.report.base.app.gridBlurObserver
													.notify(this);
											dev.report.base.app.openViewMode()
										}
									}))]
				})
	};
}