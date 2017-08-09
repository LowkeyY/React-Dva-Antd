Ext.namespace("lib.GroupHeaderGrid");

lib.GroupHeaderGrid.LockedGroupHeaderGrid = function(config) {
	Ext.apply(this, config);
};

Ext.extend(lib.GroupHeaderGrid.LockedGroupHeaderGrid, Ext.util.Observable, {
	init: function(grid) {
		var v = grid.getView();
		v.beforeMethod('initTemplates', this.initTemplates);
		v.renderHeaders = this.renderHeaders.createDelegate(v, [v.renderHeaders]);
		v.afterMethod('onColumnWidthUpdated', this.updateGroupStyles);
		v.afterMethod('onAllColumnWidthsUpdated', this.updateGroupStyles);
		v.afterMethod('onColumnHiddenUpdated', this.updateGroupStyles);
		v.getHeaderCell = this.getHeaderCell;
		v.updateSortIcon = this.updateSortIcon;
		v.getGroupStyle = this.getGroupStyle;
	},

	initTemplates: function() {
		var ts = this.templates || {};
		if (!ts.gcell) {
			ts.gcell = new Ext.Template(
				'<td class="x-grid3-hd {cls} x-grid3-td-{id}" style="{style}">',
				'<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">{value}</div>',
				'</td>'
			);
		}
		this.templates = ts;
	},

	renderHeaders: function(renderHeaders) {
		var ts = this.templates, rows = [[], []], tw = this.cm.getTotalWidth(), lw = this.cm.getTotalLockedWidth();
		for (var i = 0; i < this.cm.rows.length; i++) {
			var r = this.cm.rows[i], cells = [[], []], col = 0;
			for (var j = 0; j < r.length; j++) {
				var c = r[j];
				c.colspan = c.colspan || 1;
				c.col = col;
				var l = this.cm.isLocked(col) ? 1 : 0; 
				col += c.colspan;
				var gs = this.getGroupStyle(c);
				cells[l][j] = ts.gcell.apply({
					id: c.id || i + '-' + col,
					cls: c.header ? 'ux-grid-hd-group-cell' : 'ux-grid-hd-nogroup-cell',
					style: 'width:' + gs.width + ';' + (gs.hidden ? 'display:none;' : '') + (c.align ? 'text-align:' + c.align + ';' : ''),
					tooltip: c.tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + c.tooltip + '"' : '',
					value: c.header || '*',
					istyle: c.align == 'right' ? 'padding-right:16px' : ''
				});
			}
			rows[0][i] = ts.header.apply({
				tstyle: 'width:' + (tw - lw) + 'px;',
				cells: cells[0].join('')
			});
			rows[1][i] = ts.header.apply({
				tstyle: 'width:' + lw + 'px;',
				cells: cells[1].join('')
			});
		}
		var h = renderHeaders.call(this);
		rows[0][rows.length] = h[0];
		rows[1][rows.length] = h[1];
		return [rows[0].join(''), rows[1].join('')];
	},

	getGroupStyle: function(c) {
		var w = 0, h = true;
		for (var i = c.col; i < c.col + c.colspan; i++) {
			if (!this.cm.isHidden(i)) {
				var cw = this.cm.getColumnWidth(i);
				if(typeof cw == 'number'){
					w += cw;
				}
				h = false;
			}
		}
		return {
			width: (Ext.isBorderBox ? w : Math.max(w - this.borderWidth, 0)) + 'px',
			hidden: h
		}
	},

	updateGroupStyles: function(col) {
		var tables = [this.mainHd.query('.x-grid3-header-offset > table'), this.lockedHd.query('.x-grid3-header-offset > table')], tw = this.cm.getTotalWidth(), lw = this.cm.getTotalLockedWidth();
		for (var i = 0; i < tables[0].length; i++) {
			tables[0][i].style.width = (tw - lw) + 'px';
			tables[1][i].style.width = lw + 'px';
			if (i < this.cm.rows.length) {
				var cells = [], c = [tables[1][i].firstChild.firstChild.childNodes, tables[0][i].firstChild.firstChild.childNodes];
				for (l = 0; l < 2; l++) {
					for (j = 0; j < c[l].length; j++) {
						cells.push(c[l][j]);
					}
				}
				for (var j = 0; j < cells.length; j++) {
					var c = this.cm.rows[i][j];
					if ((typeof col != 'number') || (col >= c.col && col < c.col + c.colspan)) {
						var gs = this.getGroupStyle(c);
						cells[j].style.width = gs.width;
						cells[j].style.display = gs.hidden ? 'none' : '';
					}
				}
			}
		}
	},
	getHeaderCell : function(index){
		var locked = this.cm.getLockedCount();
		if(index < locked){
			return this.lockedHd.query('td.x-grid3-cell')[index];
		} else {
			return this.mainHd.query('td.x-grid3-cell')[(index-locked)];
		}
	},
	updateSortIcon : function(col, dir){
		var sc = this.sortClasses;
		var clen = this.cm.getColumnCount();
		var lclen = this.cm.getLockedCount();
		var hds = this.mainHd.select('td.x-grid3-cell').removeClass(sc);
		var lhds = this.lockedHd.select('td.x-grid3-cell').removeClass(sc);
		if(lclen > 0 && col < lclen)
			lhds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
		else
			hds.item(col-lclen).addClass(sc[dir == "DESC" ? 1 : 0]);
	}
});
