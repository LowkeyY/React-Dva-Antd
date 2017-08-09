Ext.namespace("dev.report.base.grid");


using("dev.report.base.grid.FillRange");

dev.report.base.grid.FillSelection = (function() {
	return function(startCoords, sheet) {
		dev.report.base.grid.FillSelection.parent.constructor.call(this, startCoords,
				sheet);
		this._ranges = [new dev.report.base.grid.FillRange(this, this._startCoords,
				this._startCoords)];
		this._firstRange = this._ranges[0];
		this._activeRange = 0
	}
})();
dev.report.util.extend(dev.report.base.grid.FillSelection, dev.report.base.grid.Selection);
clsRef = dev.report.base.grid.FillSelection;
clsRef = null;