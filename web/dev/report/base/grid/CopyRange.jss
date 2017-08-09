
Ext.namespace("dev.report.base.grid");

using("dev.report.base.grid.Range");

dev.report.base.grid.CopyRange = (function() {
	return function(selection, startPoint, endPoint) {
		dev.report.base.grid.CopyRange.parent.constructor.call(this, selection,
				startPoint, endPoint);
		var that = this, panesLen = this._panes.length, htmlEl, htmlElCp;
		for (var clsName = "formularRangeBorder", i = 3; i >= 0; --i) {
			htmlEl = document.createElement("div");
			htmlEl.className = clsName;
			for (var j = panesLen - 1; j >= 0; j--) {
				htmlElCp = j > 0 ? htmlEl.cloneNode(true) : htmlEl;
				this._edgeElems[j][i] = htmlElCp;
				this._containers[j].appendChild(htmlElCp)
			}
		}
	}
})();
dev.report.util.extend(dev.report.base.grid.CopyRange, dev.report.base.grid.Range);
clsRef = dev.report.base.grid.CopyRange;
clsRef = null;