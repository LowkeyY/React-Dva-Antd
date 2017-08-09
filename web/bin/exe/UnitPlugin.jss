Ext.namespace("bin.exe");
bin.exe.UnitPlugin = function(us) {
	this.units = new Ext.util.MixedCollection();
	this.units.getKey = function(o) {
		return o.dataIndex;
	};

	for (var i = 0, len = us.length; i < len; i++) {
		this.addUnit(us[i]);
	}

};
Ext.extend(bin.exe.UnitPlugin, Ext.util.Observable, {
	local : false,
	grid : null,
	addUnit : function(config) {
		var us = config.group.units;
		var cur = config.unit || config.group.nativeUnit;
		var items = new Array();
		var txt = "";
		var fn = this.menuClick.createDelegate(this);
		for (var i = 0; i < us.length; i++) {
			if (us[i][0] == cur)
				txt = us[i][1];
			items.push({
						group : config.dataIndex,
						checked : (us[i][0] == cur),
						text : us[i][1],
						value : us[i][0],
						handler : fn
					})
		}
		this.units.add(config.dataIndex, {
					cur : cur,
					curTxt : txt,
					raw : cur,
					dataIndex : config.dataIndex,
					menu : new Ext.menu.Menu({
								items : items
							})
				})

	},
	menuClick : function(item) {
		var g = this.units.get(item.group);
		if (this.fireEvent('beforeunitchange', this, this.grid, item, g) !== false) {
			g.cur = item.value;
			var arr = new Array();
			this.units.each(function(unit) {
						if (unit.raw != unit.cur) {
							arr.push(unit.dataIndex + ":" + unit.cur);
						}
					})
			if (arr.length > 0) {
				this.reload(arr.join(":"));
			} else if (g.cur == g.raw) {
				this.reload();
			}
			this.updateColumnHeadings(this.grid, g.curTxt, item);
			g.curTxt = item.text;
			this.fireEvent('unitchange', this, this.grid, item, g);
		}
	},
	updateColumnHeadings : function(grid, sign, item) {
		var view = grid.getView();
		if (!view || !view.mainHd) {
			return;
		}
		var cm = grid.getColumnModel();
		var col = cm.findColumnIndex(item.group);
		if (col != -1) {
			sign = "(" + sign + ")";
			var htm = cm.getColumnHeader(col);
			var pos = htm.indexOf(sign);
			if (pos != -1) {
				htm = htm.substring(0, pos) + "(" + item.text + ")"
						+ htm.substring(pos + sign.length);
				cm.setColumnHeader(col, htm);
			}
		}
	},
	init : function(grid) {
		if (grid instanceof Ext.grid.GridPanel) {
			this.addEvents(
					/**
					 * @event unitchange 当单位改变后触发此事件
					 * @param {Ext.grid.GridView}
					 *            view
					 * @param {Number}
					 *            rowIndex The index of the row to be removed.
					 * @param {Ext.data.Record}
					 *            record The Record to be removed
					 */
					"unitchange",
					/**
					 * @event unitchange 当单位改变前触发此事件
					 * @param (bin.exe.UnitPlugin)
					 *            obj
					 * @param grid
					 * @param MenuItem
					 * @param unit
					 *            (数据结构体,参见源码34行)
					 */
					"beforeunitchange");
			this.grid = grid;
			this.grid.units = this;
			this.toolbar = this.grid.bbar;
			grid.on("render", this.onRender, this);
			grid.on("destroy", this.destroy, this);
		}
	},
	/** private * */
	onRender : function() {
		var hmenu = this.grid.getView().hmenu;
		this.menu = hmenu.add(new Ext.menu.Item({
					text : '单位'.loc(),
					menu : new Ext.menu.Menu(),
					handler : function() {
						return false;
					}
				}));

		hmenu.on('beforeshow', this.onMenu, this);
	},

	/** private * */
	onMenu : function(filterMenu) {
		var unit = this.getMenuUnit();
		if (unit) {
			this.menu.menu = unit.menu;
		}
		this.menu.setVisible(Boolean(unit));
	},
	destroy : function() {
		this.units.each(function(unit) {
					unit.menu.destroy();
				})
	},
	reload : function(units) {
		var store = this.grid.store;
		if (this.toolbar) {
			var start = this.toolbar.paramNames.start;
			if (store.lastOptions && store.lastOptions.params
					&& store.lastOptions.params[start]) {
				store.lastOptions.params[start] = 0;
			}
		}
		store.baseParams["unit_tz_plugin"] = units;
		store.reload();
	},
	/** private * */
	getMenuUnit : function() {
		var view = this.grid.getView();
		if (!view || !view.cm || view.hdCtxIndex === undefined) {
			return null;
		}
		return this.units.get(view.cm.config[view.hdCtxIndex].dataIndex);
	}
});