
Ext.namespace("dev.report.base.grid");

using("dev.report.base.grid.Selection");
using("dev.report.base.grid.DefaultRange");

dev.report.base.grid.DefaultSelection = (function() {
	return function(startCoords, sheet) {
		dev.report.base.grid.DefaultSelection.parent.constructor.call(this,
				startCoords, sheet);
		this._ranges = [new dev.report.base.grid.DefaultRange(this,
				this._startCoords, this._startCoords)];
		this._firstRange = this._ranges[0];
		this._activeRange = 0;
		this._ranges[this._activeRange].activate();
		this._setLegacyVars()
	}
})();
dev.report.util.extend(dev.report.base.grid.DefaultSelection, dev.report.base.grid.Selection);
clsRef = dev.report.base.grid.DefaultSelection;
clsRef.prototype._isRect = function() {
	return (this._ranges.length === 1)
};
clsRef.prototype.addRange = function(startPoint, endPoint) {
	return this._ranges.push(new dev.report.base.grid.DefaultRange(this, startPoint,
			endPoint))
};
clsRef.prototype.expandToCell = function(cell) {
	this._selectionChanged = true;
	this._ranges[this._activeRange].expandToCell(cell)
};
clsRef.prototype.moveTo = function(x, y, mode) {
	this._selectionChanged = true;
	this._ranges[this._activeRange].moveTo(x, y);
	this.checkForUndoneMarkers()
};
clsRef.prototype.expand = function(amount, direction, defExpand) {
	this._selectionChanged = true;
	this._ranges[this._activeRange].expand(amount, direction, defExpand)
};
clsRef.prototype.show = function() {
	for (var i = this._ranges.length - 1; i >= 0; i--) {
		if (this._ranges[i].isVisible()) {
			return
		}
		this._ranges[i].show()
	}
	this._selectionChanged = true;
	this.checkForUndoneMarkers()
};
clsRef.prototype.jumpTo = function(rng) {
	this.set(new dev.report.gen.Point(rng[0], rng[1]), new dev.report.gen.Point(rng[2],
					rng[3]));
	this.draw()
};
clsRef.prototype.getCursorField = function() {
	return this._ranges[this._activeRange].getCursorField()
};
clsRef = null;