
Ext.namespace("dev.report.base");
dev.report.base.WSEL = function() {
	this.type = {
		COMBO_BOX : "ComboBox",
		CHECK_BOX : "CheckBox",
		BUTTON : "Button",
		WIDGET : "Widget",
		CHART : "Chart",
		PICTURE : "Picture"
	};
	this.moveRegistry = [];
	this.add = function(conf, cb) {
		new dev.report.base.WSEL[conf.type](conf, cb)
	};
	this.update = function(conf, cb) {
		var elem = dev.report.base.wsel.wselRegistry.get(dev.report.base.app.activeBook,
				dev.report.base.app.activeSheet._uid, conf.id);
		if (elem) {
			elem.update(conf, cb)
		} else {
			if (cb instanceof Array && cb.length > 1) {
				cb[1].call(cb[0], [false, "formel_no_el", {}])
			}
		}
	};
	var _loadCls = ["FormBase", "Widget"];
	this.loadAll = function(sheet) {
		for (var i = 0, len = _loadCls.length, conn = dev.report.backend, loadParams; i < len; i++) {
			/*loadParams = dev.report.base.wsel[_loadCls[i]].loadParams;
			conn.ccmd([this, loadParams.cb, sheet], ["wget", "", [],
							loadParams.attr, {
								e_type : loadParams.type
							}])*/
		}
	};
	this.unloadAll = function(bookId, sheetId) {
		var book = dev.report.base.book.reg[bookId];
		if (!book) {
			return
		}
		var elems = dev.report.base.wsel.wselRegistry.getByType(["ComboBox",
						"CheckBox", "Button", "Widget"], book, sheetId);
		for (var i = elems.length - 1; i >= 0; i--) {
			elems[i].unload()
		}
	};
	this.refreshAll = function(data, book) {
		for (var elems = data, i = elems.length - 1, elem; i >= 0; i--) {
			elem = dev.report.base.wsel.wselRegistry.get(book, book._aSheet._uid,
					elems[i].id);
			if (elem) {
				try {
					elem.refresh(elems[i])
				} catch (e) {
				}
			}
		}
	};
	this.updateTarget = function(data, book) {
		for (var elems = data, i = elems.length - 1, elem; i >= 0; i--) {
			elem = dev.report.base.wsel.wselRegistry.get(book, book._aSheet._uid,
					elems[i].e_id);
			if (elem) {
				try {
					elem.updateTarget(elems[i])
				} catch (e) {
				}
			}
		}
	};
	this.formelRemovize = function(wsel, book) {
		var elem = dev.report.base.wsel.wselRegistry.get(book, book._aSheet._uid,
				wsel.id);
		if (elem) {
			try {
				elem.removize(wsel)
			} catch (e) {
			}
		}
	};
	this.countEl = function(elType) {
		switch (elType) {
			case this.type.WIDGET :
				var qObj = {
					e_type : "widget"
				};
				break;
			case this.type.CHART :
				var qObj = {
					e_type : "chart"
				};
				break;
			case this.type.PICTURE :
				var qObj = {
					e_type : "img"
				};
				break;
			default :
				var qObj = {
					e_type : "formel",
					formel_type : elType
				}
		}
		return dev.report.backend.ccmd(0, ["wget", "", [], ["e_id"], qObj])[0][1].length
	};
	this.getNLoc = function(x, y, w, h, single) {
		single = !!single;
		var n2l = dev.report.base.app.numberToLetter, activePane = dev.report.base.app.activePane, tlCellCords = activePane
				.getNeighByOffset(1, 1, x, y), tlOffsetXY = activePane
				.getPixelsByCoords(tlCellCords[0], tlCellCords[1]);
		if (single) {
			return {
				pos_offsets : [x - tlOffsetXY[0], y - tlOffsetXY[1]],
				n_location : "=$".concat(n2l[tlCellCords[0]], "$",
						tlCellCords[1], ":$", n2l[tlCellCords[0]], "$",
						tlCellCords[1]),
				size : [w, h]
			}
		} else {
			lrCellCoords = activePane.getNeighByOffset(1, 1, x + w, y + h), lrOffsetXY = activePane
					.getPixelsByCoords(lrCellCoords[0], lrCellCoords[1]);
			return {
				pos_offsets : [x - tlOffsetXY[0], y - tlOffsetXY[1],
						x + w - lrOffsetXY[0], y + h - lrOffsetXY[1]],
				n_location : "=$".concat(n2l[tlCellCords[0]], "$",
						tlCellCords[1], ":$", n2l[lrCellCoords[0]], "$",
						lrCellCoords[1])
			}
		}
	};
	this.getTLSize = function(pos, offsets) {
		var activePane = dev.report.base.app.activePane, offsetsAdjusted = false;
		var tlXY = activePane.getPixelsByCoords(pos[0], pos[1]), brXY = activePane
				.getPixelsByCoords(pos[2], pos[3]);
		var cellDims = activePane.getCellDims(pos[0], pos[1]);
		if (offsets[0] < 0 || offsets[0] > cellDims[0]) {
			offsetsAdjusted = true;
			offsets[0] = (offsets[0] > cellDims[0]) ? cellDims[0] : 0
		}
		if (offsets[1] < 0 || offsets[1] > cellDims[1]) {
			offsetsAdjusted = true;
			offsets[1] = (offsets[1] > cellDims[1]) ? cellDims[1] : 0
		}
		cellDims = activePane.getCellDims(pos[2], pos[3]);
		if (offsets[2] < 0 || offsets[2] > cellDims[0]) {
			offsetsAdjusted = true;
			offsets[2] = (offsets[2] > cellDims[0]) ? cellDims[0] : 0
		}
		if (offsets[3] < 0 || offsets[3] > cellDims[1]) {
			offsetsAdjusted = true;
			offsets[3] = (offsets[3] > cellDims[1]) ? cellDims[1] : 0
		}
		var w = brXY[0] + offsets[2] - (tlXY[0] + offsets[0]), h = brXY[1]
				+ offsets[3] - (tlXY[1] + offsets[1]);
		return {
			tl : [tlXY[0] + offsets[0], tlXY[1] + offsets[1]],
			size : [w, h],
			_error : offsetsAdjusted
		}
	};
	this.getRngFromNLoc = function(n_loc) {
		var refs = dev.report.base.formula.parse(n_loc);
		if (!refs.length) {
			return [1, 1, 1, 1]
		}
		var rng = refs[0].rng;
		if (refs.length > 1 && n_loc.indexOf(":") == -1) {
			rng[2] = refs[1].rng[2];
			rng[3] = refs[1].rng[3]
		}
		return rng
	};
	this.moveSave = function() {
		for (var moveReg = this.moveRegistry, i = moveReg.length - 1; i >= 0; i--) {
			moveReg[i][1].call(moveReg[i][0], moveReg[i][2])
		}
		this.moveRegistry = []
	};
	this.getSnapXY = function(x, y, w, h) {
		var ap = dev.report.base.app.activePane, wselLoc = this.getNLoc(x, y, w, h), wselRange = this
				.getRngFromNLoc(wselLoc.n_location), tlCDims = ap.getCellDims(
				wselRange[0], wselRange[1]), lrCDims = ap.getCellDims(
				wselRange[2], wselRange[3]), sL = (wselLoc.pos_offsets[0] <= tlCDims[0]
				/ 2)
				? (-wselLoc.pos_offsets[0])
				: (tlCDims[0] - wselLoc.pos_offsets[0]), eL = ((wselLoc.pos_offsets[2] <= lrCDims[0]
				/ 2)
				? (-wselLoc.pos_offsets[2])
				: (lrCDims[0] - wselLoc.pos_offsets[2]))
				+ 1, lDiff = (Math.abs(sL) <= Math.abs(eL)) ? sL : eL, sT = (wselLoc.pos_offsets[1] <= tlCDims[1]
				/ 2)
				? (-wselLoc.pos_offsets[1])
				: (tlCDims[1] - wselLoc.pos_offsets[1]), eT = ((wselLoc.pos_offsets[3] <= lrCDims[1]
				/ 2)
				? (-wselLoc.pos_offsets[3])
				: (lrCDims[1] - wselLoc.pos_offsets[3]))
				+ 1, tDiff = (Math.abs(sT) <= Math.abs(eT)) ? sT : eT;
		return [x + lDiff, y + tDiff]
	};
	this.getSnapXYandWH = function(oldX, oldY, oldW, oldH, newX, newY, newW,
			newH, aDirs, pRatio) {
		var isWest = (oldX != newX && (aDirs & 1)), isEast = (!isWest
				&& oldW != newW && (aDirs & 1)), isNorth = (oldY != newY && (aDirs & 2)), isSouth = (!isNorth
				&& oldH != newH && (aDirs & 2)), ap = dev.report.base.app.activePane, wselLoc = this
				.getNLoc(newX, newY, newW, newH), wselRange = this
				.getRngFromNLoc(wselLoc.n_location), tlCDims = ap.getCellDims(
				wselRange[0], wselRange[1]), lrCDims = ap.getCellDims(
				wselRange[2], wselRange[3]), sL, eL, sT, eT;
		if (isWest) {
			sL = (wselLoc.pos_offsets[0] <= tlCDims[0] / 2)
					? (-wselLoc.pos_offsets[0])
					: (tlCDims[0] - wselLoc.pos_offsets[0]);
			newX += sL;
			newW -= sL
		} else {
			if (isEast) {
				eL = ((wselLoc.pos_offsets[2] <= lrCDims[0] / 2)
						? (-wselLoc.pos_offsets[2])
						: (lrCDims[0] - wselLoc.pos_offsets[2]))
						+ 1;
				newW += eL
			}
		}
		if (isNorth) {
			sT = (wselLoc.pos_offsets[1] <= tlCDims[1] / 2)
					? (-wselLoc.pos_offsets[1])
					: (tlCDims[1] - wselLoc.pos_offsets[1]);
			newY += sT;
			newH -= sT
		} else {
			if (isSouth) {
				eT = ((wselLoc.pos_offsets[3] <= lrCDims[1] / 2)
						? (-wselLoc.pos_offsets[3])
						: (lrCDims[1] - wselLoc.pos_offsets[3]))
						+ 1;
				newH += eT
			}
		}
		if (pRatio) {
			var diff, tVal;
			if (Math.abs((sL != undefined) ? sL : ((eL != undefined) ? eL : 0)) < Math
					.abs((sT != undefined) ? sT : ((eT != undefined) ? eT : 0))) {
				tVal = newW / oldW * oldH;
				diff = newH - tVal;
				newH = tVal;
				if (isNorth) {
					newY += diff
				}
			} else {
				tVal = newH / oldH * oldW;
				diff = newW - tVal;
				newW = tVal;
				if (isWest) {
					newX += diff
				}
			}
		}
		return [newX, newY, newW, newH]
	};
	this.assignMacro = function(data) {
		var elem = dev.report.base.wsel.wselRegistry.get(dev.report.base.app.activeBook,
				dev.report.base.app.activeSheet._uid, data.id);
		if (elem) {
			try {
				elem.assignMacro(data.macros)
			} catch (e) {
				return [false].concat(e)
			}
		} else {
			return [false, "formel_no_el", {}]
		}
		return [true]
	};
	this.setLock = function(id, wrapper, resCont, locked, init) {
		wrapper.dd.locked = locked;
		wrapper.enabled = !locked;
		wrapper.handles = locked ? "none" : "all";
		if (!locked) {
			wrapper.east.el.dom.className = "x-resizable-handle x-resizable-handle-east x-unselectable";
			wrapper.west.el.dom.className = "x-resizable-handle x-resizable-handle-west x-unselectable";
			wrapper.north.el.dom.className = "x-resizable-handle x-resizable-handle-north x-unselectable";
			wrapper.south.el.dom.className = "x-resizable-handle x-resizable-handle-south x-unselectable";
			wrapper.east.el.dom.style.cursor = "";
			wrapper.west.el.dom.style.cursor = "";
			wrapper.north.el.dom.style.cursor = "";
			wrapper.south.el.dom.style.cursor = "";
			wrapper.southeast.el.dom.style.cursor = "";
			wrapper.southwest.el.dom.style.cursor = "";
			wrapper.northeast.el.dom.style.cursor = "";
			wrapper.northwest.el.dom.style.cursor = "";
			resCont.className = "ws_element"
		} else {
			wrapper.east.el.dom.style.cursor = "default";
			wrapper.west.el.dom.style.cursor = "default";
			wrapper.north.el.dom.style.cursor = "default";
			wrapper.south.el.dom.style.cursor = "default";
			wrapper.southeast.el.dom.style.cursor = "default";
			wrapper.southwest.el.dom.style.cursor = "default";
			wrapper.northeast.el.dom.style.cursor = "default";
			wrapper.northwest.el.dom.style.cursor = "default";
			resCont.className = "ws_element_locked"
		}
		if (!init) {
			var updObj = {};
			updObj[id] = {
				locked : locked
			};
			//dev.report.backend.ccmd(null, ["wupd", "", updObj])
		}
	}
};