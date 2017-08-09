
Ext.namespace("dev.report.base");
dev.report.base.WND = function() {
	var that = this;
	this.reg = {};
	this.minimized = [];
	this.active = null;
	this.arrangement = "tiled";
	this.selectById = function(id) {
		if (id in that.reg) {
			that.reg[id].select()
		}
	};
	this.findByMeta = function(name, meta) {
		var win, node;
		for (var i in that.reg) {
			win = that.reg[i];
			node = win.node;
			if (!node) {
				continue
			}
			if (node._name == name
					&& (meta
							? node._meta
									&& ((node._meta.g == meta.g
											&& node._meta.h == meta.h && node._meta.n == meta.n) || (!meta.g
											.search(/^f/)
											? node._meta.fg == meta.g
													&& node._meta.fh == meta.h
													&& node._meta.fn == meta.n
											: false))
							: !node._meta)) {
				return win
			}
		}
		return false
	};
	this.selectByMeta = function(name, meta) {
		var win = this.findByMeta(name, meta);
		if (win === false) {
			dev.report.base.general.showMsg("Application Error".localize(),
					"noWBtoSwitch".localize(), Ext.MessageBox.ERROR);
			return false
		}
		return win.select()
	};
	this.closeByMeta = function(name, meta) {
		var win = this.findByMeta(name, meta);
		if (win === false) {
			try {
				for (var triggers = dev.report.base.events.triggers.closeWorkbook_after, i = triggers.length
						- 1; i >= 0; --i) {
					triggers[i][0]["closeWorkbook_after"].call(parent,
							triggers[i][1], meta, name)
				}
			} catch (e) {
				dev.report.base.general.showMsg("Application Error".localize(),
						e.message.localize(), Ext.MessageBox.ERROR)
			}
		}
		win.unload()
	};
	this.findByTitle = function(title) {
		var win;
		for (var i in that.reg) {
			win = that.reg[i];
			if (win.title == title) {
				return win
			}
		}
		return false
	};
	this.getVisible = function() {
		if (!that.active) {
			return []
		}
		var list = [that.active], activeId = that.active._id, win;
		for (var i in that.reg) {
			win = that.reg[i];
			if (win._id != activeId && win.isVisible() && !win._minimized) {
				list.push(win)
			}
		}
		return list
	};
	this.getHidden = function() {
		if (!that.active) {
			return []
		}
		var list = [], win;
		for (var i in that.reg) {
			win = that.reg[i];
			if (!win.isVisible()) {
				list.push(win)
			}
		}
		return list
	};
	this.hideActive = function() {
		if (that.getVisible().length < 2) {
			return
		}
		var node = that.active.node;
		if (!node) {
			return
		}
		try {
			for (var triggers = dev.report.base.events.triggers.hideWorkbook_before, i = triggers.length
					- 1; i >= 0; i--) {
				triggers[i][0]["hideWorkbook_before"].call(parent,
						triggers[i][1], node._meta, node._name)
			}
			that.active.hide();
			dev.report.base.action.adjustToACL();
			for (var triggers = dev.report.base.events.triggers.hideWorkbook_after, i = triggers.length
					- 1; i >= 0; i--) {
				triggers[i][0]["hideWorkbook_after"].call(parent,
						triggers[i][1], node._meta, node._name)
			}
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	};
	this.hasMinimized = function() {
		for (var i = that.minimized.length - 1; i >= 0; --i) {
			if (that.minimized[i]) {
				return true
			}
		}
		return false
	};
	this.triggerCloseEvt = function(name, meta) {
		try {
			for (var triggers = dev.report.base.events.triggers.closeWorkbook_after, i = triggers.length
					- 1; i >= 0; --i) {
				triggers[i][0]["closeWorkbook_after"].call(parent,
						triggers[i][1], meta, name)
			}
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	}
};