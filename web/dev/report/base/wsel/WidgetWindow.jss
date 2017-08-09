dev.report.base.wsel.WidgetWindow = function(config) {
	dev.report.base.wsel.WidgetWindow.superclass.constructor.call(this, config)
};
Ext.extend(dev.report.base.wsel.WidgetWindow, Ext.Window, {
	toggleTitleVisibility : function(visible) {
		var display = this.getEl().dom.children[0].style.display;
		if ((visible && display == "block") || (!visible && display == "none")) {
			return
		}
		var currPos = this.getPosition(true), el = this.getEl();
		currPos[0] = currPos[0] < -500 ? 0 : currPos[0];
		currPos[1] = currPos[1] < -500 ? 0 : currPos[1];
		this._handleMove = false;
		if (!visible) {
			el.setStyle("visibility", "inherit")
		}
		el.dom.children[0].style.display = visible ? "block" : "none";
		this
				.setPosition(
						currPos[0],
						currPos[1]
								+ dev.report.base.wsel.Widget.offsets[dev.report.base.app.browser].titleH
								* (visible ? -1 : 1))
	}
});