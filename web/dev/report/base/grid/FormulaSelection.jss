
Ext.namespace("dev.report.base.grid");
using("dev.report.base.grid.FormulaRange");
dev.report.base.grid.FormulaSelection = (function() {
	return function(startCoords, sheet) {
		dev.report.base.grid.FormulaSelection.parent.constructor.call(this,
				startCoords, sheet);
		this.setVisibility(dev.report.base.range.DisplayStatus.HIDDEN)
	}
})();
dev.report.util.extend(dev.report.base.grid.FormulaSelection, dev.report.base.grid.Selection);
clsRef = dev.report.base.grid.FormulaSelection;
clsRef.prototype.addRange = function(startPoint, endPoint, isPassive) {
	return this._ranges.push(new dev.report.base.grid.FormulaRange(this, startPoint,
			endPoint, isPassive))
};
clsRef.prototype.moveTo = function(x, y, mode) {
	this._ranges[this._activeRange].moveTo(x, y);
	this.checkForUndoneMarkers()
};
clsRef.prototype.expand = function(amount, direction) {
	this._ranges[this._activeRange].expand(amount, direction)
};
clsRef.prototype._refreshElement = function(scope, range) {
	range.formulaUpdate();
	range.draw()
};
clsRef = null;