Ext.namespace("bin.bi");
using("lib.GroupHeaderGrid.GroupHeaderGrid");
bin.bi.QueryGridPanel = Ext.extend(Ext.grid.GridPanel, {
	initComponent : function() {
		Ext.form.Field.prototype.msgTarget = 'qtip';

		this.chartCol = [];
		this.selectedChartCol = {};

		this.seq = 0;
		this.meta = {};
		this.headerArray = [];
		var row = {};
		var leaf = {};
		this.headLoad = false;

		this.headerGroup = new lib.GroupHeaderGrid.GroupHeaderGrid({
					rows : this.headerArray,
					hierarchicalColMenu : true
		});

		this.plugins = [this.headerGroup];
		this.headerGroup.init(this);

		if (this.columns && (this.columns instanceof Array)) {
			this.colModel = new Ext.grid.ColumnModel(this.columns);
			delete this.columns;
		}

		if (!this.colModel) {
			this.colModel = new Ext.grid.ColumnModel([]);
		}

		var conProxy = new Ext.data.HttpProxy({
					url : this.url,
					method : this.method
				})
		conProxy.on("loadexception", function(obj, options, response, e) {
					var o = Ext.decode(response.responseText);
					Ext.msg("error", o.message);
				});
		this.store = new Ext.data.Store({
					proxy : conProxy,
					reader : new Ext.data.JsonReader({
								totalProperty : 'totalCount',
								id : 'id'
							}, this.mapping),
					baseParams : this.baseParams,
					remoteSort : true
				});
		this.stripeRows = true;
		this.bbar = new Ext.PagingToolbar({
					pageSize : this.pageSize,
					store : this.store,
					displayInfo : this.displayInfo,
					displayMsg : this.displayMsg,
					emptyMsg : this.emptyMsg
				});
		this.bbar.on('click', function() {
					delete this.store.baseParams.start;
				}, this.bbar);
		/*
		 * this.bbar.onClick=this.bbar.onClick.createInterceptor(function(){
		 * delete this.store.baseParams.start; },this.bbar); EXT 3.1
		 * 有错误，待进一步确认原因
		 */
		bin.bi.QueryGridPanel.superclass.initComponent.call(this);

		if (this.store) {
			this.store.on("metachange", this.onMetaChange, this);
		}
		if (this.autoSave) {
			this.colModel.on("widthchange", this.saveColumModel, this);
			this.colModel.on("hiddenchange", this.saveColumModel, this);
			this.colModel.on("columnmoved", this.saveColumModel, this);
			this.colModel.on("columnlockchange", this.saveColumModel, this);
			this.on('sortchange', this.saveColumModel, this);
		}
		this.on('columnresize', this.saveColumModel, this);
	},
	onButtonClick : function(item) {
		if (item.id == 'execl') {
			var paramString = '';
			for (var i in this.store.baseParams) {
				paramString += '&' + i + '=' + this.store.baseParams[i];
			}
			window
					.open(
							encodeURI("/bin/bi/downExcel.jcp?"
									+ paramString.substring(1)),
							"_blank",
							"height=10, width=10, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
		}
	},
	createParam : function(record, param) {
		var config = {
			pageType : 'view',
			programType : "ProgramInput"
		}
		var data = record.data;
		if (this.exportArray && this.exportArray.length > 0) {
			var expItem = "";
			var expData = "";
			var p = {};
			for (var i = 0; i < this.exportArray.length; i++) {
				p[this.exportArray[i][0]] = true;
				expItem += this.exportArray[i][0] + ",";
				expData += data[this.exportArray[i][1]] + "::";
			}
			if (param.exportItem) {
				var itemArray = param.exportItem.split(",");
				var dataArray = param.exportData.split("::");

				for (var i = 0; i < itemArray.length; i++) {
					if (typeof(p[itemArray[i]]) == 'undefined') {
						expItem += itemArray[i] + ",";
						expData += dataArray[i] + "::";
					}
				}
			}
			config.exportItem = expItem.substring(0, expItem.length - 1);
			config.exportData = expData.substring(0, expData.length - 2);
		}
		if (this.pks) {
			config.exportTab = this.pks[0];
			var pks = this.pks[1].split("::");
			for (var i = 0; i < pks.length; i++) {
				pks[i] = data[pks[i]];
			}
			config.dataId = pks.length > 1 ? pks.join("::") : pks[0];
		}
		return Ext.applyIf(config, param);
	},
	onMetaChange : function(store, meta) {
		this.meta = meta;
		var c, s;
		var config = [];
		var lookup = {};
		var id = meta.id;
		var exportArray = new Array();
		if (meta.mainTab) {
			this.pks = [meta.mainTab, meta.mainPk];
		}

		if (Ext.isDefined(meta.events)) {
			Ext.iterate(meta.events, function(name, handler) {
						if (name == 'render') {
							handler.call(this,this)
						} else {
							this.on(name,handler)
						}
					}, this)
		}

		for (var i = 0, len = meta.fields.length; i < len; i++) {
			c = meta.fields[i];
			if (c.header !== undefined) {
				if (typeof c.dataIndex == "undefined") {
					c.dataIndex = c.name;
				}
				if (typeof c.renderer == "string") {
					c.renderer = Ext.util.Format[c.renderer];
				}
				if (c.target) {
					var tar = c.target;
					this.on("rowdblclick", function(panel, rowIndex, e) {
								if (typeof(tar) == 'undefined') {
									return false;
								}
								var p = panel.createParam(panel.getStore()
												.getAt(rowIndex), panel.param);
								CPM.replaceTarget(panel, panel.ownerCt, p, tar);
							});
				}
				if (typeof c.id == "undefined") {
					c.id = 'c' + i;
				}
				if (c.editor && c.editor.isFormField) {
					c.editor = new Ext.grid.GridEditor(c.editor);
				}
				if (c.sortType) {
					this.store.sortInfo = {
						field : c.dataIndex,
						direction : c.sortType
					};
				}

				if (c.isExport) {
					exportArray
							.push([c.export_name, c.header, c.export_seq * 1]);
				}

				config[config.length] = c;
				lookup[c.id] = c;
			}
		}

		var row = {};
		var leaf = {};
		for (var i = 0; i < meta.fields.length; i++) {
			var cols = meta.fields[i];
			var title = cols.header;
			var headerGroup = cols.headerGroup;
			if (headerGroup != '') {
				var t = headerGroup.split('::');
				row[title] = t;
			}
		}
		var level = 0;
		for (var i = 0; i < meta.fields.length; i++) {
			var cols = meta.fields[i];
			var title = cols.header;
			if (row[title]) {
				var t = row[title];
				if (t.length > level) {
					level = t.length;
				}
			}
		}

		for (var i = 0; i < level; i++) {
			var childArray = [];
			childArray.push({});
			var colSpan = 0;
			var headTitle = "";
			for (var j = 0; j < meta.fields.length; j++) {
				var cols = meta.fields[j];
				var title = cols.header;
				var t = row[title];
				if ((typeof(t) != "undefined") && t[i]) {
					if (headTitle == t[i]) {
						colSpan++;
						if (j == meta.fields.length - 1) {
							if (headTitle != "") {
								var headerSpan = {};
								headerSpan['header'] = headTitle;
								headerSpan['colspan'] = colSpan + 1;
								headerSpan['align'] = 'center';
								childArray.push(headerSpan);
								colSpan = 0;
							}
						}
					} else {
						if (headTitle != "") {
							var headerSpan = {};
							headerSpan['header'] = headTitle;
							headerSpan['colspan'] = colSpan + 1;
							headerSpan['align'] = 'center';
							childArray.push(headerSpan);
							colSpan = 0;
						}
						headTitle = t[i];
					}
				} else {
					if (headTitle != "") {
						var headerSpan = {};
						headerSpan['header'] = headTitle;
						headerSpan['colspan'] = colSpan + 1;
						headerSpan['align'] = 'center';
						childArray.push(headerSpan);
					}
					colSpan = 0;
					headTitle = "";
					childArray.push({});
				}
			}
			if (!this.headLoad) {
				this.headerArray.push(childArray);
			}
			if (level - 1 == i) {
				this.headLoad = true;
			}
		}
		if (exportArray.length > 0) {
			exportArray.sort(function(a, b) {
						return a[2] - b[2];
					});
			this.exportArray = exportArray;
		}
		config.unshift(new Ext.grid.RowNumberer({
					locked : true
				}));
		this.hasRowNumber = true;
		this.colModel.config = config;
		this.colModel.lookup = lookup;
		// 构建查询条件
		try {
			if (this.showTopToolbar && this.baseParams['objectId']) {
				var tb = this.getTopToolbar();
				if (tb.items.getCount() == 0) {
					var btns = meta.buttonArray;
					for (var i = 0; i < btns.length; i++) {
						var btn = this.ppanel.getButton(btns[i], this.id);
						btn.style = "margin-right:10px;";
						tb.addButton(new Ext.Toolbar.Button(btn));
					}
				}
			} else {
				var tb = this.getTopToolbar();
				var haveMenu = false;
				tb.items.each(function(item) {
							if (item.id == 'execl') {
								haveMenu = true;
							}
						}, tb.items);
				if (!haveMenu) {
					tb.addButton(new Ext.Toolbar.Button({
								id : 'execl',
								text : '生成EXCEL文件'.loc(),
								icon : '/themes/icon/xp/excel.gif',
								cls : 'x-btn-text-icon  bmenu',
								disabled : false,
								scope : this,
								hidden : false,
								handler : this.onButtonClick
							}));
					tb.addButton(new Ext.Toolbar.Separator());
				}
			}

			if (this.showTopToolbar && meta.searchEditor) {
				var tb = this.getTopToolbar();
				var editors = meta.searchEditor.editors;
				if ((editors instanceof Array) && editors.length > 0) {
					if (meta.searchEditor.libs.length > 0) {
						eval(meta.searchEditor.libs);
					}
					tb.addFill();
					for (var i = 0; i < editors.length; i++) {
						if (editors[i].xtitleList) {
							editors[i] = Ext.ComponentMgr.create(editors[i],
									'textfield')
							this.eds.push(editors[i]);
						}
						tb.add(editors[i]);
					}
					tb.addButton(new Ext.Toolbar.Button({
						text : '过滤'.loc(),
						scope : this,
						icon : '/themes/icon/xp/selectlink.gif',
						cls : 'x-btn-text-icon bmenu',
						handler : function(btn) {
							var cbk = function() {
								var result = {};
								for (var i = 0; i < this.eds.length; i++) {
									if (!this.eds[i].validate()) {
										Ext.msg("error", '请改正标示出的错误.'.loc());
										return false;
									}
									result[this.eds[i].xtitleList] = this.eds[i]
											.getValue();
								}
							
								Ext.apply(this.store.baseParams, {
											meta : false,
											query : Ext.encode(result)
										});
								this.store.load({
											params : {
												start : 0,
												limit : this.pageSize
											}
										})
							};
							cbk.defer(30, this);
						}
					}));
					tb.addButton(new Ext.Toolbar.Button({
								text : '还原'.loc(),
								scope : this,
								icon : '/themes/icon/all/magifier_zoom_out.gif',
								cls : 'x-btn-text-icon bmenu',
								handler : function(btn) {
									Ext.apply(this.store.baseParams, {
												meta : false,
												query : "{}"
											});
									this.store.load({
												params : {
													start : 0,
													limit : this.pageSize
												}
											})
									for (var i = 0; i < this.eds.length; i++) {
										this.eds[i].reset();
									}
								}
							}));
				}
			}
		} catch (e) {
			Ext.msg("error", e)
		}
		// 构建查询条件结束
		if (this.rendered) {
			this.view.updateHeaders();
			this.view.refresh(true);
		}
		var haveChartMenu = false;

		this.view.hmenu.items.each(function(item) {
					if (item.id == 'chart')
						haveChartMenu = true;
				}, this.view.hmenu.items);

		if (!haveChartMenu) {
			this.view.chartMenu = new Ext.menu.Menu({
						id : this.id + "-charts-menu"
					});
			this.view.chartMenu
					.on("beforeshow", this.beforeChartMenuShow, this);
			this.view.chartMenu
					.on("itemclick", this.handleChartMenuClick, this);
			this.view.hmenu.on("hide", this.handleChartMenuHide, this);
			this.view.hmenu.add({
						id : "chart",
						text : '绘图'.loc(),
						menu : this.view.chartMenu,
						cls : "xg-hmenu-reset-columns"
					});
		}
		this.setHeight(this.ownerCt.getSize().height);
	},
	beforeChartMenuShow : function() {
		var cm = this.view.cm, colCount = cm.getColumnCount();
		this.view.chartMenu.removeAll();
		this.selectedChartCol = {};
		this.chartCol = [];
		this.seq = 0;
		for (var i = 0; i < colCount; i++) {
			if (cm.config[i].fixed !== true && cm.config[i].hideable !== false) {
				this.view.chartMenu.add(new Ext.menu.CheckItem({
							id : "chart-" + cm.getColumnId(i),
							text : cm.getColumnById(cm.getColumnId(i)).dataIndex,
							checked : false,
							hideOnClick : false,
							disabled : cm.isHidden(i)
						}));
				if (!cm.isHidden(i)) {
					var col = new Array();
					col[0] = cm.getColumnHeader(i);
					col[1] = cm.getColumnHeader(i);
					this.chartCol.push(col);
				}
			}
		}
	},

	// firstFire:false,
	handleChartMenuHide : function() {

		/*
		 * if(this.firstFire){ this.firstFire=false; return; }else{
		 * this.firstFire=true; }
		 */
		if (!isEmty(this.selectedChartCol) && this.seq > 0) {
			loadcss("lib.RowEditorGrid.ListInput");
			using("lib.ColorField.ColorField");
			using("lib.RowEditorGrid.RowEditorGrid");
			using("lib.RowEditorGrid.ListInput");
			using("bin.bi.ChartManager");

			var chartSet = {};
			chartSet['query_id'] = this.baseParams['objectId'];
			chartSet['Combine_Num'] = this.seq - 1;
			chartSet['checkGrid'] = '0';
			chartSet['AxisXFormat'] = '20';
			chartSet['view3DDepth'] = '0';
			chartSet['sameScale'] = '1';
			chartSet['Iner_Color'] = '#FFFFFF';
			chartSet['checkLineMark'] = '1';
			chartSet['checkGrid'] = '1';
			chartSet['line_Color'] = '#FFFFFF';
			chartSet['chartColArray'] = this.chartCol;

			var unitArray = new Array();
			var k = 0;
			for (var i in this.selectedChartCol) {
				if (this.selectedChartCol[i] != 0) {
					var unit = new Array();
					var unitId = k + 1;
					unit[1] = unitId;
					unit[0] = unitId + '单元'.loc();
					unitArray[k] = unit;
					k++;
				}

			}
			chartSet['unitArray'] = unitArray;

			var selectColArray = new Array();
			k = 0;
			for (var i in this.selectedChartCol) {
				if (this.selectedChartCol[i] * 1 > 0) {
					var chartColumn = {};
					chartColumn['SERIES_ID'] = i;
					chartColumn['UNIT_ID'] = this.selectedChartCol[i];
					chartColumn['AXISYVALUE'] = i;
					chartColumn['SERIES_TITLE'] = i;
					chartColumn['TYPE_ID'] = 6;
					chartColumn['TYPE_ID_TXT'] = '曲线'.loc();
					chartColumn['yAxisStart'] = '0';
					chartColumn['yAxisType'] = '0';
					chartColumn['AXISYFORMAT'] = '1';
					chartColumn['AIXS_POSITION'] = '0';
					chartColumn['SERIES_COLOR'] = '#FF0000';
					selectColArray[k] = chartColumn;
					k++;
				} else {
					chartSet['AxisXValue'] = this.baseParams['xColumn'] = i;
				}

			}
		
			chartSet['chartColumn'] = selectColArray;
			// var setChartWindow = new
			// bin.bi.ChartManager(chartSet,this.baseParams);
			var setChartWindow = new bin.bi.ChartManager(this.baseParams);
			setChartWindow.load(chartSet, this.baseParams);
		}
	},
	handleChartMenuClick : function(item) {
		if (!item.checked) {
			this.selectedChartCol[item.text] = this.seq;
			this.seq++;
		} else {
			this.seq--;
			delete this.selectedChartCol[item.text];
		}
	},
	saveColumModel : function() {
		var c, config = this.colModel.config;
		var fields = [];
		for (var i = 1, len = config.length; i < len; i++) {
			c = config[i];
			fields[i] = {
				header : c.name,
				width : c.width
			};
			if (c.hidden) {
				fields[i].hidden = true;
			}
		}
		var sortState = this.store.getSortState();

		var SaveParams = Ext.apply({
					'fields' : Ext.encode(fields)
				}, {
					'sort' : sortState ? Ext.encode(sortState) : sortState
				});
		SaveParams = Ext.apply(SaveParams, this.baseParams);

		Ext.Ajax.request({
					url : this.saveUrl,
					params : SaveParams
				});
	}
});
function isEmty(s) {
	for (var i in s)
		return false;
	return true;
}