/*
 * 
 * bug ----1、不能同时对两列使用同一个格式 ----2、改变列宽会报错 3、未完成分页 ----4、将多选改为每页行数
 */

using("bin.exe.filter.RangeMenu");
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
using("bin.exe.PureArrayReader");
Ext.namespace('lib.ListWidget');

lib.ListWidget.ListWidget = Ext.extend(Ext.form.TriggerField, {

			triggerClass : 'x-form-search-trigger',
			validateOnBlur : false,
			valueField : 'id',
			displayField : 'text',
			windowConfig : {},
			widgetTitle : null,
			widgetId : null,
			popupHeight : 300,
			popupWidth : 240,
			// private
			basePath : '/lib/ListWidget/',
			defaultAutoCreate : {
				tag : "input",
				type : "text",
				size : "16",
				style : "cursor:default;",
				autocomplete : "off"
			},
			initComponent : function() {
				if (this.widgetId == null) {
					throw "Attribute widgetId is required.";
				}
				this.widgetTitle = this.widgetTitle || this.fieldLabel || "";
				this.addEvents("select");
			},
			onRender : function(ct, position) {
				lib.ListWidget.ListWidget.superclass.onRender.call(this, ct,
						position);
				this.hiddenField = this.el.insertSibling({
							tag : 'input',
							type : 'hidden',
							name : this.name,
							id : this.id + '-hidden'
						}, 'before', true);
				this.el.dom.removeAttribute('name');

			},
			onDestroy : function() {
				if (this.window)
					this.window.destroy();
			},
			getName : function() {
				return this.name;
			},
			setValue : function(value, text) {
				if (typeof(value) == 'object') {
					text = value.text;
					value = value.value;
				} else if (value == '' && this.rendered && this.value != value) {
					text = '';
				}
				if (typeof(text) != 'undefined')
					lib.ListWidget.ListWidget.superclass.setValue.call(this,
							text);
				this.value = value;
				if (this.hiddenField)
					this.hiddenField.value = value;

			},
			getValue : function() {
				return this.value;
			},
			getText : function() {
				return this.el.dom.value;
			},
			reset : function() {
				this.setValue("", "");
			},
			ExampleRows : 20,
			grid : null,
			showWin : function() {
				var pos = Ext.get(this.wrap).getRegion(), dom = Ext.lib.Dom;
				var enoughHeight = dom.getViewHeight() - pos.top > this.popupHeight, v;
				if (dom.getViewWidth() - pos.right < this.popupWidth) {
					v = [enoughHeight ? "t" : "b", "r", "-",
							enoughHeight ? "b" : "t", "r"];
				} else {
					v = [enoughHeight ? "t" : "b", "l", "-",
							enoughHeight ? "t" : "b", "r"];
				}
				this.window.show();
				this.window.alignTo(this.wrap, v.join(""));
			},
			syncRenderer : function(cfg) {
				switch (cfg.renderType) {
					case 0 :
						delete(cfg.renderer);
						delete(cfg.renderType);
						break;
					case 1 :
						cfg.renderer = Ext.util.Format.usMoney
						break;
					case 2 :
						cfg.renderer = Ext.util.Format.dateRenderer('Y/m/d');
						break;
					case 3 :
						cfg.renderer = Ext.util.Format
								.dateRenderer('Y/m/d H:i:s')
						break;
					case 4 :
						cfg.renderer = function(v) {
							return '<font style=\"font-weight:bold\">' + v
									+ '</font>'
						}
						break;
				}
				return cfg;
			},
			onTriggerClick : function(e) {
				if (this.disabled || this.readOnly)
					return;
				var win;
				var inputPanel = this.findParentBy(function(cmp) {
							return typeof(cmp.programType) != 'undefined';
						});

				if (!this.window) {
					var params = {
						programType : 'WidgetList',
						objectId : this.widgetId
					};
					if (typeof(inputPanel) == 'object'
							&& typeof(inputPanel.param) != 'undefined') {
						Ext.applyIf(params, inputPanel.param)
					}
					CPM.doAction({
								method : 'GET',
								params : params,
								success : function(response, options) {
									try {
										var param = this
												.findParentByType("form");
										param = (param) ? param.param : {};
										var ret = this.parseResponse(
												response.responseText, param);
										this.grid = new Ext.grid.GridPanel(ret.config);
										this.grid.appendix = {
											showCol : ret.showCol,
											valueCol : ret.valueCol
										};
										this.grid.on("rowclick", function(grid,
														rowIndex, e) {
													this.window.hide();
													var rec = grid.getStore()
															.getAt(rowIndex);
													var ap = grid.appendix;
													var v = rec
															.get(ap.valueCol);
													var t = rec.get(ap.showCol);
													if (t.text)
														t = t.text;
													this.setValue(v, t);
													this.fireEvent('select',
															this, v, t);
												}, this)
										this.window.add(this.grid);
										if (ret.json.data) {
											this.grid.getStore()
													.loadData(ret.json);
										}
										this.window.setSize(ret.width,
												ret.height);
										this.popupWidth = ret.width;
										this.popupHeight = ret.height;
										win = this.window;
										this.showWin();
									} catch (e) {
										Ext.msg("error", e)
									}
								}
							}, this);

					this.windowConfig = Ext.apply(this.windowConfig, {
								title : this.widgetTitle,
								width : this.popupWidth,
								height : this.popupHeight,
								autoScroll : true,
								layout : 'fit',
								items : this.grid,
								shadow : false,
								frame : true,
								buttons : [{
											text : '取消'.loc(),
											handler : function() {
												this.window.close();
											},
											scope : this

										}, {
											text : '清空'.loc(),
											handler : function() {
												this.setValue('', '');
												this.window.close();
											},
											scope : this
										}]
							});
					this.window = new Ext.Window(this.windowConfig);
					this.window.on('beforeclose', function() {
								this.el.focus();
								this.window.hide();
								return false;
							}, this);
				} else if (typeof(inputPanel) == 'object'
						&& this.paramCache != inputPanel.paramCache) {
					var params = {
						DataPartMode : 'data',
						programType : 'WidgetList',
						objectId : this.widgetId
					};
					this.paramCache = inputPanel.paramCache;
					Ext.applyIf(params, inputPanel.param);
					CPM.doAction({
								method : 'GET',
								params : params,
								scope : this,
								success : function(response, options) {
									var ret = Ext.decode(response.responseText);
									this.grid.getStore().loadData(ret);
									this.showWin();
								}
							});
				} else {
					this.showWin();
				}
			},
			parseResponse : function(text, param) {
				var json = Ext.decode(text);
				var ret = json.ret;
				json.cm.unshift(new Ext.grid.RowNumberer());

				var store = new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
										url : CPM.action,
										method : "GET"
									}),
							sortInfo : json.sortInfo,
							reader : new bin.exe.PureArrayReader({},
									Ext.data.Record.create(json.fields)),
							baseParams : Ext.applyIf({
										DataPartMode : 'puredata',
										programType : 'WidgetList',
										objectId : this.widgetId
									}, param),
							autoLoad : false,
							remoteSort : true
						});
				var filters = new Ext.grid.GridFilters({
							filters : json.filters
						});
				var cfg = {
					stripeRows : true,
					sortable : true,
					plugins : filters,
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					iconCls : 'icon-grid',
					trackMouseOver : false,
					cm : new Ext.grid.ColumnModel(json.cm),
					store : store
				};

				if (json.ret.showPaggingBar) {
					cfg.bbar = new Ext.PagingToolbar({
								emptyMsg : '无数据'.loc(),
								plugins : filters,
								pageSize : ret.PageSize,
								store : store,
								displayInfo : true,
								displayMsg : '数据'.loc()+' {0} - {1} of {2}'
							});
				}
				return {
					json : json,
					config : cfg,
					width : ret.width,
					height : ret.height,
					valueCol : ret.valueCol,
					showCol : ret.showCol
				}
			}
		});
Ext.reg('listwidget', lib.ListWidget.ListWidget);