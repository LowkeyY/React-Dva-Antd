Ext.namespace("dev.report.base.grid");

dev.report.base.grid.PaneTouch = function(pane) {
	var that = this;
	this._pane = pane;
	pane._oc.ontouchstart = function(ev) {
		that._start(ev)
	};
	pane._oc.ontouchmove = function(ev) {
		that._move(ev)
	}
};
dev.report.base.grid.PaneTouch.prototype = {
	_SCROLL_COEF : 1,
	_start : function(ev) {
		if (ev.touches.length != 1) {
			return
		}
		var touch = ev.touches[0], pane = this._pane;
		this._screenX = touch.screenX;
		this._screenY = touch.screenY;
		this._col = pane._lastDestCell[0] + 1;
		this._row = pane._lastDestCell[1] + 1
	},
	_move : function(ev) {
		if (ev.touches.length != 1) {
			return
		}
		ev.preventDefault();
		var touch = ev.touches[0], pane = this._pane, col = pane._colWidths
				.getIdxByOffset(this._col, (this._screenX - touch.screenX)
								* this._SCROLL_COEF), row = pane._rowHeights
				.getIdxByOffset(this._row, (this._screenY - touch.screenY)
								* this._SCROLL_COEF);
		if (col == this._col && row == this._row) {
			return
		}
		pane.scrollTo(undefined, col, row, false, true)
	}
};