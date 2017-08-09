
Ext.namespace("dev.report.kbd");
dev.report.kbd.Base = (function() {
	return function() {
		var that = this;
		this.event = null;
		this.keyCode = null;
		this.tags={
			NO_ANY : "no-kbd-any",
			NO_ENTER : "no-kbd-enter",
			NO_ESC : "no-kbd-esc"
		};
		this.keyModifier = "ctrlKey"
	}
})();
dev.report.kbd.Base.prototype = {
	handle : function(event) {
		this.event = document.all ? window.event : event;
		this.keyCode = document.all ? this.event.keyCode : this.event.which;
		var kHandler = "_".concat(this.keyCode);
		if (this[kHandler]) {
			this[kHandler]()
		} else {
			this._handleDefault()
		}
	},
	_handleDefault : function() {
		this._handleEnd()
	},
	_handleEnd : function() {
	},
	_preventBubble : function() {
		var e = document.all ? window.event : this.event;
		try {
			e.keyCode = 0;
			e.shiftKey = false;
			e.ctrlKey = false;
			e.altKey = false
		} catch (e) {
		}
		e.cancelBubble = true;
		e.cancelEvent = true;
		e.returnValue = false;
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault()
		}
	},
	_chkTabIdx : function(cmp) {
		return !cmp.hidden && !cmp.disabled && cmp.tabIndex != undefined
	},
	_tabFocus : function(elems) {
		if (elems.length) {
			var backward = this.event.shiftKey, evTarget = document.all
					? this.event.srcElement
					: this.event.target, currTabIdx = evTarget.tabIndex, currElIdx = -1;
			elems.sort(function(a, b) {
						return backward ? b.tabIndex - a.tabIndex : a.tabIndex
								- b.tabIndex
					});
			for (var i in elems) {
				if (elems[i].tabIndex == currTabIdx) {
					currElIdx = i;
					break
				}
			}
			if (currElIdx < 0 || ++currElIdx > elems.length - 1) {
				currElIdx = 0
			}
			elems[currElIdx].focus()
		}
		if (document.all) {
			this.event.returnValue = false;
			this.event.cancelBubble = true
		} else {
			this.event.preventDefault();
			this.event.stopPropagation()
		}
	}
};