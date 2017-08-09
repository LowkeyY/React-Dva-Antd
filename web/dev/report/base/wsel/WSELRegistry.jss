
Ext.namespace("dev.report.base.wsel");
dev.report.base.wsel.WSELRegistry =  function() {
	var that = this, _dir = {
		UP : 0,
		DOWN : 1
	}, _ordDir = {
		BTF : 0,
		BFW : 1,
		STB : 2,
		SBW : 3
	}, _reorderStack = function(rng, dir, amount, ws) {
		if (!ws) {
			ws = dev.report.base.app.activeSheet
		}
		var wsel, wselZIdx, conn = dev.report.backend;
		conn.ccmdBuffer();
		for (var wselId in ws._els) {
			wsel = ws._els[wselId];
			wselZIdx = wsel.getZIndex();
			if (wselZIdx >= rng[0] && wselZIdx <= rng[1]) {
				wsel.setZIndex(wselZIdx + (amount * (dir == _dir.UP ? 1 : -1)))
			}
		}
		conn.ccmdFlush()
	}, _reorderEl = function(type, id, wsid, book) {
		if (!book) {
			book = dev.report.base.app.activeBook
		}
		var ws = wsid ? book._sheets[wsid] : book._aSheet, wsel = ws._els[id], wselZIdx = wsel
				.getZIndex();
		if (((type == _ordDir.BTF || type == _ordDir.BFW) && wselZIdx == ws._elZIdx)
				|| ((type == _ordDir.STB || type == _ordDir.SBW) && wselZIdx == that.startZIdx)) {
			return
		}
		var conn = dev.report.backend;
		conn.ccmdBuffer();
		switch (type) {
			case _ordDir.BTF :
				_reorderStack([wselZIdx + 1, ws._elZIdx], _dir.DOWN, 1, ws);
				wsel.setZIndex(ws._elZIdx, false);
				break;
			case _ordDir.BFW :
				_reorderStack([wselZIdx + 1, wselZIdx + 1], _dir.DOWN, 1, ws);
				wsel.setZIndex(wselZIdx + 1, false);
				break;
			case _ordDir.STB :
				_reorderStack([that.startZIdx, wselZIdx - 1], _dir.UP, 1, ws);
				wsel.setZIndex(that.startZIdx, false);
				break;
			case _ordDir.SBW :
				_reorderStack([wselZIdx - 1, wselZIdx - 1], _dir.UP, 1, ws);
				wsel.setZIndex(wselZIdx - 1, false);
				break
		}
		conn.ccmdFlush()
	};
	this.startZIdx = 50;
	this.add = function(wsel, wsid, book) {
		if (!book) {
			book = dev.report.base.app.activeBook
		}
		var ws = wsid ? book._sheets[wsid] : book._aSheet, wselZIdx = wsel
				.getZIndex();
		ws._els[wsel.getId()] = wsel;
		if (wselZIdx > ws._elZIdx) {
			ws._elZIdx = wselZIdx
		}
	};
	this.remove = function(book, wsid, id) {
		if (!book) {
			return
		}
		var ws = book._sheets[wsid];
		if (!ws) {
			return
		}
		var wsel = ws._els[id];
		if (!wsel) {
			return
		}
		var wselZIdx = wsel.getZIndex();
		if (wselZIdx != ws._elZIdx) {
			_reorderStack([wselZIdx + 1, ws._elZIdx], _dir.DOWN, 1, ws)
		}
		ws._elZIdx--;
		delete ws._els[id]
	};
	this.get = function(book, wsid, id) {
		if (!book) {
			return false
		}
		if (id) {
			return book._sheets[wsid]["_els"][id]
		} else {
			if (wsid) {
				return book._sheets[wsid]["_els"]
			} else {
				if (book) {
					var wsels = {};
					for (var wsIdx in book._sheets) {
						wsels[wsIdx] = book._sheets[wsIdx]["_els"]
					}
					return wsels
				} else {
					return false
				}
			}
		}
	};
	this.getByType = function(type, book, wsid) {
		if (!book || (wsid && !book._sheets[wsid])) {
			return []
		}
		var typeIsArray = type instanceof Array, list = [], typeId, wsels;
		for (var ws in book._sheets) {
			if (wsid && ws != wsid) {
				continue
			}
			wsels = book._sheets[ws]["_els"];
			for (var id in wsels) {
				if (!wsels[id].conf) {
					continue
				}
				if (typeIsArray) {
					for (typeId in type) {
						if (wsels[id].conf.type == type[typeId]) {
							list.push(wsels[id])
						}
					}
				} else {
					if (wsels[id].conf.type == type) {
						list.push(wsels[id])
					}
				}
			}
		}
		return list
	};
	this.getZIndex = function(zIdx, wsid, book) {
		if (!book) {
			book = dev.report.base.app.activeBook
		}
		var ws = wsid ? book._sheets[wsid] : book._aSheet;
		return ws._elZIdx + 1
	};
	this.bringToFront = function(id, wsid, book) {
		_reorderEl(_ordDir.BTF, id, wsid, book)
	};
	this.bringForward = function(id, wsid, book) {
		_reorderEl(_ordDir.BFW, id, wsid, book)
	};
	this.sendToBack = function(id, wsid, book) {
		_reorderEl(_ordDir.STB, id, wsid, book)
	};
	this.sendBackward = function(id, wsid, book) {
		_reorderEl(_ordDir.SBW, id, wsid, book)
	};
	this.dump = function() {
		var reg = dev.report.base.book.reg, books = {}, sheets = {}, wsels = {}, book, sheet;
		for (var id in reg) {
			book = reg[id];
			sheets = {};
			for (var wsid in book._sheets) {
				sheet = book._sheets[wsid];
				wsels = {};
				for (var wselId in sheet._els) {
					wsels[wselId] = sheet._els[wselId]
				}
				sheets[sheet._uid] = wsels
			}
			books[book.id] = sheets
		}
		return books
	}
};