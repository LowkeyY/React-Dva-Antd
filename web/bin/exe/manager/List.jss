using("bin.exe.filter.RangeMenu");
using("bin.exe.filter.ListMenu");
using("bin.exe.filter.EditableItem");
using("bin.exe.filter.Filter");
using("bin.exe.filter.BooleanFilter");
using("bin.exe.filter.DateFilter");
using("bin.exe.filter.ListFilter");
using("bin.exe.filter.NumericFilter");
using("bin.exe.filter.StringFilter");
using("bin.exe.filter.CalendarFilter");
using("bin.exe.filter.DictFilter");
using("bin.exe.filter.CombotreeFilter");
using("bin.exe.filter.WidgetFilter");
using("bin.exe.filter.GridFilters");
using("bin.exe.UnitPlugin");
using("bin.exe.PureArrayReader");
CPM.manager.List = Ext.extend(CPM.manager.CustomizeObject, {

	className : 'CPM.manager.List',
	/*
	 * 只更新panel中数据,只取数据部分,并完成赋值 @param objectId,dataId,importData
	 */
	// private
	updateData : function(panel, param) {

		var st = panel.getStore();
		var sst = st.getSortState();
		if (sst != null) {
			Ext.apply(param, {
						sort : sst.field,
						dir : sst.direction
					})
		}
		if (st.baseParams.unit_tz_plugin)
			param.unit_tz_plugin = st.baseParams.unit_tz_plugin;
		panel.param = param;

		this.getData("data", param, this.loadResult.createCallBackWithArgs([
						panel, param]), panel);
		if (panel.filters)
			panel.filters.clearFilters();
		Ext.apply(st.baseParams, {
					objectId : param.objectId,
					exportData : param.exportData
				});
	},
	loadResult : function(result, parentPanel, panel, param) {
		if (Ext.isDefined(result.disabledButton)) {
			var referenceStr = "," + result.disabledButton;
			this.getTopToolbar().items.each(function(item) {
						item.setDisabled((item.text && referenceStr.indexOf(","
								+ item.text + ",") != -1));
					});
		}
		if(Ext.isDefined(result.callback)){
			var fn = result.callback;
			if(Ext.isFunction(fn))
				fn.call(this , result.callbackParam);
			delete result.callback;
			delete result.callbackParam;
		}
		this.getStore().loadData(result);
		if (Ext.isObject(param)) {// 第一次载入数据后,触发load事件.目前不清楚风险.--tz
			var st = this.getStore();
			st.fireEvent('load', st, st.getRange(), {
						params : param
					});
		}
		this.el.unmask();
	},
	/*
	 * 从服务器端获取数据并render,根据mode值决定取哪一部分 @param objectId,title,dataId,importData
	 */
	load : function(mode, parentPanel, param) {

		this.getData(mode, param, function(result, model) {
					var panel;
					if (mode.indexOf("model") != -1) {
						CPM.addModel(param.objectId, model);
						panel = this.createModel(parentPanel, result, param);
						panel.loadResult(result, null, panel, param);
						panel.param = param;
					} else {
						if (param.moduleReady == false) {
							param.moduleReady = (function(data, p) {
								p.loadResult(data, null, p, p.param);
							}).createCallBackWithArgs(result);
						} else {
							var st = param.moduleReady.getStore();
							param.moduleReady.loadResult(result, null,
									param.moduleReady, param);
							delete param.moduleReady;
						}
					}
				}.createDelegate(this));
	},
	/*
	 * 根据model建panel,layout后返回建成的panel @param objectId,title @return panel
	 */
	createModel : function(parentPanel, json, param, config) {
		if (parentPanel.ownerCt.xtype == 'tabpanel' && json.title) {
			parentPanel.setTitle(json.title);
		}
		if (!json.sortInfo && param.dir) {
			json.sortInfo = {
				field : param.sort,
				direction : param.dir
			}
		}
		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : CPM.action,
								method : "GET"
							}),
					sortInfo : json.sortInfo,
					reader : new bin.exe.PureArrayReader({}, Ext.data.Record
									.create(json.fields)),
					baseParams : Ext.applyIf({
								DataPartMode : 'data'
							}, param),
					sort : function(fieldName, dir) {
						if (this.lastOptions) {
							if (!this.lastOptions.params)
								this.lastOptions.params = {};
							this.lastOptions.params.DataPartMode = 'puredata';
						}
						return this.singleSort(fieldName, dir);
					},
					autoLoad : false,
					remoteSort : true
				});

		var id = Ext.id();
		var plugins = [];
		var hasFilter = Ext.isDefined(json.filters)
				&& !Ext.isDefined(json.searchEditor); // 定义了搜索框时，过滤器失效。

		if (hasFilter) {
			json.filters = new Ext.grid.GridFilters({
						filters : json.filters
					});
			plugins.push(json.filters);
		}

		var pageBar = new Ext.PagingToolbar({
					store : store,
					plugins : plugins,
					displayInfo : true,
					pageSize : json.PageSize,
					displayMsg : '{0}-{1}条 共:{2}条'.loc(),
					emptyMsg : '没有数据'.loc()
				});
		pageBar.on("beforechange", function(bar, o) {
					o.DataPartMode = 'puredata';
				});

		var panel = {
			xtype : 'grid',
			cm : this.createColumnModel(json),
			border : false,
			stripeRows : true,
			store : store,
			id : id,
			exportInfo : json.exportInfo,
			head : false,
			plugins : plugins,
			objectId : param.objectId,
			height : 250,
			loadMask : true,
			iconCls : 'icon-grid',
			programType : param.programType,
			loadResult : this.loadResult,
			listeners : {
				rowdblclick : function(panel, rowIndex, e) {
					var tar = panel.getColumnModel().target;
					if (typeof(tar) == 'undefined') {
						return false;
					}
					var rec = panel.getStore().getAt(rowIndex);
					var module = CPM.getModule(panel.param.programType);
					var p = module.getExportParams(panel, rec, {
								pData : rec.get("pmk"),
								dataId : rec.get("pmk"),
								pageType : 'view',
								programType : "ProgramInput"
							});

					var p = Ext.applyIf(p, panel.param);
					if (typeof(p.sort) != 'undefined') {
						delete p.dir;
						delete p.sort;
					}
					CPM.replaceTarget(panel, panel.ownerCt, p, tar);
				}
			},
			bbar : pageBar
		};
		if (Ext.isDefined(json.events)) {
			if (Ext.isFunction(json.events.beforeinit)) {
				if (json.events.beforeinit.call(this, panel, json, param,
						parentPanel) === false) {
					return;
				}
				delete json.events.beforeinit;
			}
			Ext.apply(panel.listeners, json.events);
		}
		if (hasFilter) {
			panel.filters = json.filters;
			delete json.filters;
		}

		if (json.gridGroupHead) {
			using("lib.GroupHeaderGrid.GroupHeaderGrid");
			panel.plugins.push(new lib.GroupHeaderGrid.GroupHeaderGrid({
						rows : json.gridGroupHead,
						hierarchicalColMenu : true
					}));
		}

		if (json.haveUnit) {
			var units = new Array();
			Ext.each(json.cm, function(item) {
						if (item.unit)
							units.push(item);
					})
			var up = new bin.exe.UnitPlugin(units);
			panel.plugins.push(up);
		}

		if (typeof(json.autoExpandColumn) != 'undefined') {
			panel.autoExpandColumn = json.autoExpandColumn;
		}
		if (typeof(config) != 'undefined') {
			Ext.apply(panel, config);
		}

		if (Ext.isArray(json.buttonArray)) {
			var btns = new Array(), cb = null;
			Ext.each(json.buttonArray, function(btn) {
						cb = this.getButton(btn, id);
						btns.push((cb == null) ? btn : cb);
					}, this);
			if (btns.length > 0) {
				if (Ext.isDefined(json.disabledButton)) {
					Ext.each(btns, function(btn) {
						if (json.disabledButton.indexOf("," + btn.text + ",") != -1) {
							btn.disabled = true;
						}
					})
				}
				panel.tbar = {
					xtype : 'toolbar',
					enableOverflow : true,
					items : btns
				}
			};
		}

		if (Ext.isDefined(json.searchEditor)) {
			this.appendSearchEditor(panel, json, param);
		}
		if (json.showHelpButton) {
			CPM.Help.addHelpButton(panel, param);
		}
		panel = this.adjustPanel(panel, param, json);

		panel = parentPanel.add(panel);

		if (json.logHistroy === true) {
			panel.on("beforedestroy", function(grid) {
						CPM.History.add(this.getState());
						CPM.History.addFunction(parentPanel);
					}, this);
		}
		parentPanel.doLayout();
		panel = this.fixPanel(panel, param, json);
		return panel;
	},
	adjustPanel : function(panel, param, json) {// 更改配置形态的panel
		return panel;
	},
	fixPanel : function(panel, param, json) {// 更改渲染后的panel
		panel.el.mask(Ext.LoadMask.prototype.msg);
		return panel;
	},
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return (typeof(panel) != 'undefined')
				&& panel.objectId == param.objectId && !param.forceToRebuild
	},
	createColumnModel : function(json) {
		Ext.each(json.cm, function(item) {
					if (Ext.isString(item.renderer)) {
						item.renderer = eval(item.renderer);
					}
				})
		return new Ext.grid.ColumnModel(json.cm);
	},
	appendSearchEditor : function(panel, json, param) {
		var arr = Ext.isDefined(panel.tbar) ? panel.tbar.items : [];
		arr.push("->");
		if (Ext.isDefined(json.searchEditor.libs)) {
			eval(json.searchEditor.libs);
		}
		var editors = json.searchEditor.editors;

		if (param.filter) {// 判断param.filter否存在,存在则改变默认过滤值
			var f = Ext.decode(param.filter);
			for (var i = 0; i < editors.length; i++) {
				if (Ext.isDefined(f[editors[i].xtitleList])) {
					editors[i].value = f[editors[i].xtitleList];
				}
			}
		}

		for (var i = 0; i < editors.length; i++) {
			arr.push(editors[i]);
			arr.push(" ");
		}
		arr.push(new Ext.Toolbar.Button({
					text : '查询'.loc(),
					panelId : panel.id,
					icon : '/themes/icon/xp/selectlink.gif',
					cls : 'x-btn-text-icon bmenu',
					handler : function(btn) {
						var cbk = function() {
							var result = {};
							var eds = [];
							var panel = Ext.getCmp(btn.panelId);
							panel.getEl().mask('数据载入中'.loc(), "x-mask-loading");
							panel.getTopToolbar().items.each(function(item) {
										if (Ext.isDefined(item.xtitleList))
											eds.push(item);
									});
							var store = panel.getStore();
							for (var i = 0; i < eds.length; i++) {
								if (!eds[i].validate()) {
									panel.getEl().unmask();
									Ext.msg("error", '请改正标示出的错误.'.loc());
									return false;
								}
								var v=eds[i].getValue();
								if(v instanceof Date){
									v=v.format(eds[i].format);
								}
								result[eds[i].xtitleList] = v;
							}

							if (Ext.isDefined(panel.beforeFilter)) {
								if (panel.beforeFilter(panel, eds, result) === false) {
									panel.getEl().unmask();
									return;
								}
							}
							Ext.apply(store.baseParams, {
										meta : false,
										filter : Ext.encode(result)
									});
							store.load({
										params : {
											start : 0,
											limit : panel.pageSize
										},
										scope : this,
										callback : function() {
											panel.getEl().unmask();
										}
									})
						};
						cbk.defer(30, this);
					}
				}));
		arr.push(new Ext.Toolbar.Button({
					text : '还原'.loc(),
					scope : this,
					panelId : panel.id,
					icon : '/themes/icon/all/magifier_zoom_out.gif',
					cls : 'x-btn-text-icon bmenu',
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						var eds = [];
						panel.getTopToolbar().items.each(function(item) {
									if (Ext.isDefined(item.xtitleList))
										eds.push(item);
								});

						for (var i = 0; i < eds.length; i++) {
							eds[i].reset();
							for (var j = 0; j < editors.length; j++) {
								if (eds[i].xtitleList == editors[j].xtitleList) {
									eds[i].setValue(editors[j].value)
								}
							}
						}
						if (Ext.isDefined(panel.beforeFilterReset)) {
							if (panel.beforeFilterReset(panel, eds, result) === false)
								return;
						}
						var store = panel.getStore();
						Ext.apply(store.baseParams, {
									meta : false,
									filter : "{}"
								});
						store.load({
									params : {
										start : 0,
										limit : panel.pageSize
									}
								})
					}
				}));
		panel.tbar = arr;
		delete json.searchEditor;
	},
	getExportParams : function(panel, record, config) {// 根据ExportInfo生成导出参数
		var info = panel.exportInfo;
		var pos = info.indexOf(",");
		return Ext.apply({
					pTab : info.substring(0, pos),
					pItem : info.substring(pos + 1)
				}, config);
	},
	buttonMap : {
		'%new' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				CPM
						.replaceTarget(panel, panel.ownerCt, panel.param,
								btn.target);
			}
		},
		'%edit' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (typeof(rec) == 'undefined') {
					if (panel.getStore().getCount() == 1) {
						rec = panel.getStore().getAt(0);
					} else {
						Ext.msg("warn", '请选择要编辑的行.'.loc());
						return;
					}
				}
				var module = CPM.getModule(panel.param.programType);
				var p = module.getExportParams(panel, rec, {
							pData : rec.get("pmk"),
							dataId : rec.get("pmk")
						});
				var p = Ext.applyIf(p, panel.param);
				CPM.replaceTarget(panel, panel.ownerCt, p, btn.target);
			}
		},
		'%view' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (typeof(rec) == 'undefined') {
					Ext.msg("warn", '请选择一行.'.loc());
					return;
				}
				var module = CPM.getModule(panel.param.programType);
				var p = module.getExportParams(panel, rec, {
							pData : rec.get("pmk"),
							dataId : rec.get("pmk")
						});
				var p = Ext.applyIf(p, panel.param);
				CPM.replaceTarget(panel, panel.ownerCt, p, btn.target);
			}
		},
		'%copy' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelected();
				if (typeof(rec) == 'undefined') {
					Ext.msg("warn", '请选择要复制的行.'.loc());
					return;
				}
				var p = Ext.applyIf({
							pageType : 'copy',
							dataId : rec.get("pmk")
						}, panel.param);
				CPM.replaceTarget(panel, panel.ownerCt, p, btn.target);
			}
		},
		'%delete' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelections();
				if (rec.length == 0) {
					Ext.msg("warn", '请选择要删除的行.'.loc());
					return;
				}
				var p = panel.param;

				var pmks = new Array();
				for (var i = 0; i < rec.length; i++) {
					pmks.push(rec[i].get("pmk"));
				}

				Ext.msg("confirm", '确定删除选择的记录?'.loc(), function(answer) {
					if (answer == 'yes') {
						var module = CPM.getModule(p.programType);
						var par = {
							data : pmks.join(","),
							objectId : p.objectId,
							programType : module.programType
						};
						if (panel instanceof Ext.grid.GridPanel) {
							Ext.applyIf(par, panel.getStore().baseParams);
						}
						CPM.doAction({
									params : par,
									method : 'DELETE',
									success : function(form, action) {
										// var p1 = panel.param;
										if (Ext.isDefined(panel.filters)) {
											Ext
													.apply(
															p,
															panel.filters
																	.buildQuery(panel.filters
																			.getFilterData()));
										}
										module.updateData(panel, par);
										if (btn.target.targets) {
											CPM.replaceTarget(panel,
													panel.ownerCt, p,
													btn.target);
										}
									}
								}, this);
					}
				}.createDelegate(this));
			}
		},
		'%batchupdate' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getSelectionModel().getSelections();
				if (rec.length == 0) {
					Ext.msg("warn", '请选择要更新的行.'.loc());
					return;
				}

				var pmks = new Array();
				for (var i = 0; i < rec.length; i++) {
					pmks.push(rec[i].get("pmk"));
				}
				var module = CPM.getModule(panel.param.programType);
				var p = module.getExportParams(panel, rec, {
							pageType : 'batchupdate',
							data : pmks.join(",")
						});
				var p = Ext.applyIf(p, panel.param);

				Ext.msg("confirm", '确定更新选择的记录?'.loc(), function(answer) {
					if (answer == 'yes') {
						var targets = btn.target.targets;
						var batchObjectId = 0;
						for (var i = 0; i < targets.length; i++) {
							if (targets[i].programType == 'ProgramBatchUpdate') {
								batchObjectId = targets[i].id;
								break;
							}
						}
						Ext.Ajax.request({
							url : '/bin/exe/batchupdate.jcp',
							params : {
								objectId : batchObjectId,
								programType : 'ProgramBatchUpdate'
							},
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check);
								if (ajaxResult.haveWindow) {
									CPM.replaceTarget(panel, panel.ownerCt, p,
											btn.target);
								} else {
									var tempTarget;
									var buttonArray = ajaxResult.buttonArray;
									for (i = 0; i < buttonArray.length; i++) {
										if (buttonArray[i].action = '%save') {
											tempTarget = buttonArray[i].target;
											break;
										}
									}
									var module = CPM.getModule(p.programType);
									CPM.doAction({
												params : {
													data : pmks.join(","),
													objectId : p.objectId,
													batchObjectId : batchObjectId,
													programType : module.programType
												},
												method : 'PUT',
												success : function(form, action) {
													module.updateData(panel, p);
													if (tempTarget) {
														CPM.replaceTarget(
																panel,
																panel.ownerCt,
																p, tempTarget);
													}
												}
											}, this);
								}
							},
							failure : function(response, options) {
								Ext.msg("error", CPM
												.getResponeseErrMsg(response));
							}
						});
					}
				}.createDelegate(this));
			}
		},
		'%audit' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var rec = panel.getStore().getRange();
				if (rec.length == 0) {
					Ext.msg("warn", '请选择要删除的行.'.loc());
					return;
				}
				var p = panel.param;

				var pmks = new Array();
				for (var i = 0; i < rec.length; i++) {
					pmks.push(rec[i].get("pmk"));
				}
				var module = CPM.getModule(p.programType);
				CPM.doAction({
							url : '/bin/workflow/apply.jcp?',
							params : {
								data : pmks.join(","),
								objectId : p.objectId,
								programType : module.programType
							},
							method : 'POST',
							success : function(form, action) {
								Ext.msg("info", '申请提交成功'.loc());
								module.updateData(panel, p);
								if (btn.target.targets) {
									CPM.replaceTarget(panel, panel.ownerCt, p,
											btn.target);
								}
							}
						}, this);
			}
		},
		'%excel' : {
			handler : function(btn) {
				try {
					var m = Ext.getCmp(btn.panelId);
					var cm = m.getColumnModel();
					var st = m.getStore();

					var arrayWidth = [];
					var arrayHead = [];
					var arrayIndex = [];

					for (var i = 0; i < cm.getColumnCount(); i++) {
						if (!cm.isHidden(i) && cm.getColumnHeader(i) != '') {
							arrayWidth.push(cm.getColumnWidth(i));
							arrayHead.push(cm.getColumnHeader(i));
							arrayIndex.push(cm.getDataIndex(i));
						}
					}

					var param = Ext.apply({
								widths : arrayWidth.join(","),
								programType : m.param.programType,
								heads : arrayHead.join(","),
								index : arrayIndex.join(",")
							}, {
								limit : st.getTotalCount(),
								start : 0
							}, st.baseParams);

					if (Ext.isDefined(m.filters)) {
						Ext.apply(param, m.filters.buildQuery(m.filters
										.getFilterData()));
					}

					var sortState = st.getSortState();
					if (sortState != undefined) {
						param.sort = sortState.field;
						param.dir = sortState.direction;
					}

					CPM.popWin('/bin/exe/downExcel.jcp?', param);
				} catch (e) {
					Ext.msg("error", e);
				}
			}
		},
		'%download' : {
			handler : function(btn) {
				var m = Ext.getCmp(btn.panelId);
				var param = {
					programType : m.param.programType,
					objectId : m.param.objectId
				}
				CPM.popWin('/bin/exe/downTemplate.jcp', param);
			}
		},
		'%upload' : {
			handler : function(btn) {
				var m = Ext.getCmp(btn.panelId);
				using("bin.exe.upLoadCsv");
				var width = 350;
				var height = 120;
				var setParam = new bin.exe.upLoadCsv(width, height, m);
				setParam.show();
			}
		},
		'%exceltemplate' : {
			handler : function(btn) {
				var m = Ext.getCmp(btn.panelId);
				CPM.popWin('/bin/exe/excelTemplate.jcp', m.param);
			}
		},
		'%excelupload' : {
			handler : function(btn) {
				var m = Ext.getCmp(btn.panelId);
				using("bin.exe.uploadExcel");
				var width = 350;
				var height = 120;
				var setParam = new bin.exe.uploadExcel(width, height, m);
				setParam.show();
			}
		},
		'%chart' : {
			handler : function(btn) {
				var panel = Ext.getCmp(this.formId);
				panel.mgr.loadDefault();
				panel.mgr.changeState('new');
			}
		},
		'%map' : {
			handler : function(btn) {
				var panel = Ext.getCmp(this.formId);
				panel.mgr.loadDefault();
				panel.mgr.changeState('new');
			}
		},
		'%updateFinish' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var params = {};
				Ext.apply(params, panel.param);
				Ext.Ajax.request({
							url : '/bin/exe/updateErrorResult.jcp',
							params : params,
							method : 'post',
							scope : this,
							success : function(response, options) {
								panel = panel.findParentByType(Ext.Window);
								if (panel)
									panel.close();
							},
							failure : function(response, options) {
								Ext.msg("error", CPM
												.getResponeseErrMsg(response));
							}
						});
			}
		}
	},
	commands : {
		"refresh" : function(param, parentPanel) {
		},
		"empty" : function(param, parentPanel) {
			param.pageType = 'empty';
		}
	},
	getState : function(owner, panel) {
		var st = panel.store;
		if (st) {
			var p = panel.param;
			var sst = st.getSortState();
			if (sst) {
				p = Ext.apply({
							sort : sst.field,
							dir : sst.direction
						}, p);
			}

			if (st.baseParams.filter) {
				p.filter = st.baseParams.filter;
			}

			var bbar = panel.getBottomToolbar();
			if (bbar) {
				p.start = bbar.cursor;
				p.limit = bbar.pageSize;
			}

			return {
				owner : owner.id,
				programType : panel.param.programType,
				params : Ext.encode(p)
			}
		}
	}
});