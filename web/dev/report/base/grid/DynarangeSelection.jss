
Ext.namespace("dev.report.base.grid");

dev.report.base.grid.DynarangeSelection = (function() {
	return function(sheet, props) {
		var startCoords = new dev.report.gen.Point(props.src[0], props.src[1]);
		dev.report.base.grid.DynarangeSelection.parent.constructor.call(this,
				startCoords, sheet);
		this.dynarange = true;
		this._endCoords = new dev.report.gen.Point(props.src[2], props.src[3]);
		using('dev.report.base.grid.DynarangeRange');
		this._ranges = [new dev.report.base.grid.DynarangeRange(this,
				this._startCoords, this._endCoords, props)];
		this._firstRange = this._ranges[0];
		this._activeRange = 0
	}   
})();
dev.report.util.extend(dev.report.base.grid.DynarangeSelection, dev.report.base.grid.Selection);
clsRef = dev.report.base.grid.DynarangeSelection;
clsRef.prototype._isRect = function() {
	return (this._ranges.length === 1)
};
clsRef.prototype.setMode = function(mode) {
	this._mode = mode;
	if (this._mode == dev.report.base.range.RangeMode.EDIT) {
		dev.report.base.hb.setAllNormal(this.getActiveRange().getId());
		this._environment.shared.defaultSelection.hide();
		this._selectionChanged = true;
		this.checkForUndoneMarkers()
	}
	this.getActiveRange().switchMode(mode)
};
clsRef.prototype.getProps = function() {
	return this.getActiveRange().getProps()
};
clsRef.prototype.setProps = function(props) {
	this.getActiveRange().setProps(props)
};
clsRef.prototype.hide = function() {
	this.setMode(dev.report.base.range.RangeMode.HIDDEN)
};
clsRef.prototype.show = function() {
	this.setMode(dev.report.base.range.RangeMode.NONE)
};
clsRef.prototype.redraw = function() {
	var actRng = this.getActiveRange();
	actRng.draw(false);
	actRng.setNormalMode()
};
clsRef.prototype.remove = function(perm) {
	this.getActiveRange().remove(perm)
};
clsRef.prototype.move = function(pos) {
	this.getActiveRange().move(pos)
};
clsRef = null;