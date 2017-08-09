
Ext.namespace("dev.report.base.grid");

using("dev.report.base.grid.Selection");
using("dev.report.base.grid.CopyRange");

dev.report.base.grid.CopySelection = (function() {
	return function(startCoords, sheet) {
		dev.report.base.grid.CopySelection.parent.constructor.call(this, startCoords,
				sheet);
		this.setVisibility(dev.report.base.range.DisplayStatus.HIDDEN)
	}
})();
dev.report.util.extend(dev.report.base.grid.CopySelection, dev.report.base.grid.Selection);
clsRef = dev.report.base.grid.CopySelection;
clsRef.prototype._isRect = function() {
	return (this._ranges.length === 1)
};
clsRef.prototype.addRange = function(startPoint, endPoint) {
	return this._ranges.push(new dev.report.base.grid.CopyRange(this, startPoint,
			endPoint))
};
clsRef = null;