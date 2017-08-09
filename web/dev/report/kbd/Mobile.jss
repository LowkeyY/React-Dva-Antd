dev.report.kbd.Mobile = (function() {
	return function() {
		dev.report.kbd.Mobile.parent.constructor.call(this);
		this.env = null;
		this.activeBook = null;
		this.activePane = null
	}
})();
dev.report.util.extend(dev.report.kbd.Mobile, dev.report.kbd.Base);
clsRef = dev.report.kbd.Mobile;
clsRef.prototype.handle = function(event) {
	this.event = document.all ? window.event : event;
	this.keyCode = document.all ? this.event.keyCode : this.event.which;
	this.env = dev.report.base.app.environment;
	this.activeBook = dev.report.base.app.activeBook;
	this.activePane = dev.report.base.app.activePane;
	dev.report.base.app.lastKeyPressed = this.keyCode;
	var kHandler = "_".concat(this.keyCode);
	if (this[kHandler]) {
		this[kHandler]()
	} else {
		this._handleDefault()
	}
};
clsRef.prototype._handleEnd = function() {
	if (this.env && this.env.inputMode != dev.report.base.grid.GridMode.EDIT
			&& this.env.inputMode != dev.report.base.grid.GridMode.INPUT
			&& this.env.inputMode != dev.report.base.grid.GridMode.CNTRL
			&& this.env.inputMode != dev.report.base.grid.GridMode.DIALOG) {
		dev.report.base.keyboard.preventKeyEvent(this.event)
	}
	if (this.env && this.env.viewMode == dev.report.base.grid.viewMode.USER) {
		dev.report.base.keyboard.handleUMFocus(this.keyCode, this.event.shiftKey)
	}
};
clsRef.prototype._9 = function() {
	if (dev.report.base.action.sendGridInput(this.event, this.keyCode)) {
		if (this.keyCode == 9) {
			dev.report.base.keyboard.moveCursor(dev.report.base.grid.ScrollDirection.RIGHT,
					this.event.shiftKey, 1, this.keyCode)
		} else {
			if (!(this.event.ctrlKey && this.event.shiftKey)) {
				dev.report.base.keyboard.moveCursor(
						dev.report.base.grid.ScrollDirection.DOWN,
						this.event.shiftKey, 1, this.keyCode)
			}
		}
	}
	this._handleEnd()
};
clsRef.prototype._13 = function() {
	this._9()
};
clsRef.prototype._27 = function() {
	dev.report.base.action.cancelGridInput();
	this._handleEnd()
};
clsRef = null;