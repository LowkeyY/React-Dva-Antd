

Ext.namespace("dev.report.base.wsel");
dev.report.base.wsel.Base = (function() {
	return function(conf) {
		var that = this;
		this._sheet = conf.sheet ? conf.sheet : dev.report.base.app.activeSheet;
		this._book = this._sheet._book;
		this._panes = this._sheet._panes;
		this._env = this._sheet._env;
		this._movedEl = undefined;
		this.conf = conf;
		this.type = conf.type;
		this.elConstr = [];
		this.handleElementMove = false;
		this.isMoved = false;
		this.isUserMode = (this._env.shared.viewMode == dev.report.base.grid.viewMode.USER);
		this.afterResizeHandler = this.afterResize;
		for (var i = this._panes.length - 1; i >= 0; i--) {
			this.elConstr[i] = {
				up : 0,
				down : 0,
				left : 0,
				right : 0,
				vportPos : [],
				lrCornerPx : []
			}
		}
	}
})();
dev.report.base.wsel.Base.srcTypes = {
	RNG : "range",
	FUNC : "function",
	MCR : "macro",
	SBST : "subset",
	CUST : "custom",
	NONE : "none"
};
dev.report.base.wsel.Base.trgTypes = {
	RNG : "trange",
	NRNG : "tnamedrange",
	VAR : "tvar",
	NONE : "none"
};
dev.report.base.wsel.Base.loadDims = function(el, conf, updObj) {
	var pane = dev.report.base.app.activePane, wsel = dev.report.base.wsel, rng = wsel
			.getRngFromNLoc(el.n_location), tlXY = pane.getPixelsByCoords(
			rng[0], rng[1]), lrXY, offsets = el.pos_offsets;
	conf.top = tlXY[1] + offsets[1];
	conf.left = tlXY[0] + offsets[0];
	if (conf.singleCell) {
		if (!el.size) {
			lrXY = pane.getPixelsByCoords(rng[2], rng[3]);
			var posConf = wsel.getNLoc(conf.left, conf.top, lrXY[0]
							+ offsets[2] - (tlXY[0] + offsets[0]), lrXY[1]
							+ offsets[3] - (tlXY[1] + offsets[1]), true);
			for (var posProp in posConf) {
				el[posProp] = posConf[posProp]
			}
			if (updObj[el.e_id]) {
				for (var posProp in posConf) {
					updObj[el.e_id][posProp] = posConf[posProp]
				}
			} else {
				updObj[el.e_id] = posConf
			}
		}
		conf.height = el.size[1];
		conf.width = el.size[0]
	} else {
		lrXY = pane.getPixelsByCoords(rng[2], rng[3]);
		conf.height = lrXY[1] + offsets[3] - (tlXY[1] + offsets[1]);
		conf.width = lrXY[0] + offsets[2] - (tlXY[0] + offsets[0])
	}
};
dev.report.base.wsel.Base.fixDims = function(conf) {
	var dims = dev.report.base.wsel[conf.type]["dims"];
	if (conf.width < dims.minW) {
		conf.width = dims.minW
	}
	if (conf.height < dims.minH) {
		conf.height = dims.minH
	}
};
dev.report.base.wsel.Base.prototype = {
	calcConstraints : function(pane) {
		var paneId = pane._id, defMaxCoords = dev.report.base.grid.defMaxCoords;
		this.elConstr[paneId].vportPos = pane.getViewportPos();
		if (this.conf.left < 0 || this.conf.top < 0) {
			this.elConstr[paneId].left = parseInt(this.elConstr[paneId].vportPos[0][0]
					+ (this.elConstr[paneId].vportPos[1][0]
							- this.elConstr[paneId].vportPos[0][0] - this.conf.width)
					/ 2);
			this.elConstr[paneId].up = parseInt(this.elConstr[paneId].vportPos[0][1]
					+ (this.elConstr[paneId].vportPos[1][1]
							- this.elConstr[paneId].vportPos[0][1] - this.conf.height)
					/ 2);
			this.conf.left = this.elConstr[paneId].left;
			this.conf.top = this.elConstr[paneId].up
		} else {
			this.elConstr[paneId].left = this.conf.left;
			this.elConstr[paneId].up = this.conf.top
		}
		this.elConstr[paneId].lrCornerPx = pane.getPixelsByCoords(
				defMaxCoords[0] + 1, defMaxCoords[1] + 1);
		this.elConstr[paneId].right = this.elConstr[paneId].lrCornerPx[0]
				- this.elConstr[paneId].left - this.conf.width;
		this.elConstr[paneId].down = this.elConstr[paneId].lrCornerPx[1]
				- this.elConstr[paneId].up - this.conf.height
	},
	beforeShowCtxMenu : function() {
	},
	onMouseDown : function(e, t, o, fnUp) {
		var defMaxCoords = dev.report.base.grid.defMaxCoords, activeWnd = dev.report.base.wnd.active, env = this._env.shared, paneId = o.options.paneId, pane = this._panes[paneId];
		if (dev.report.base.app.activeBook.id != this._book.id) {
			dev.report.base.book.selectById(this._book.id)
		}
		if (dev.report.base.app.activePane._id != paneId) {
			pane.select()
		}
		if (e.button == 2
				|| (Ext.isMac && e.button == 0 && dev.report.base.app.ctrlKeyPressed)
				|| (Ext.isWebKit && e.button == 1)) {
			this.beforeShowCtxMenu();
			this.handleElementMove = false;
			this.showContextMenu(e, paneId);
			e.stopEvent()
		} else {
			dev.report.base.app.mouseMovementObserver.subscribe(this.onMouseMove,
					this);
			var bEv = e.browserEvent;
			var el = (document.all) ? bEv.srcElement : bEv.target;
			var newVportPos = pane.getViewportPos();
			var newLrCornerPx = pane.getPixelsByCoords(defMaxCoords[0] + 1,
					defMaxCoords[1] + 1);
			if (activeWnd.maximized) {
				var vportDiff = {
					h : newVportPos[0][0]
							- this.elConstr[paneId].vportPos[0][0],
					v : newVportPos[0][1]
							- this.elConstr[paneId].vportPos[0][1]
				};
				var lrCornerPxDiff = {
					h : newLrCornerPx[0] - this.elConstr[paneId].lrCornerPx[0],
					v : newLrCornerPx[1] - this.elConstr[paneId].lrCornerPx[1]
				};
				this.wrapper[paneId].setXConstraint(this.elConstr[paneId].left
								+ vportDiff.h,
						(this.elConstr[paneId].right - vportDiff.h)
								+ lrCornerPxDiff.h);
				this.wrapper[paneId].setYConstraint(this.elConstr[paneId].up
								+ vportDiff.v,
						(this.elConstr[paneId].down - vportDiff.v)
								+ lrCornerPxDiff.v)
			} else {
				var leftConstr = this.elConstr[paneId].left
						- ((bEv.clientX - (el.parentNode.offsetLeft
								+ ((document.all) ? bEv.offsetX : bEv.layerX) - newVportPos[0][0])) - env.gridScreenCoordsMax[0])
						+ newVportPos[0][0];
				this.wrapper[paneId].setXConstraint(leftConstr,
						newLrCornerPx[0] - leftConstr - this.conf.width);
				var topConstr = this.elConstr[paneId].up
						- ((bEv.clientY - (el.parentNode.offsetTop
								+ ((document.all) ? bEv.offsetY : bEv.layerY) - newVportPos[0][1])) - env.gridScreenCoordsMax[1])
						+ newVportPos[0][1];
				this.wrapper[paneId].setYConstraint(topConstr, newLrCornerPx[1]
								- topConstr - this.conf.height)
			}
			dev.report.base.app.mouseUpObserver.subscribe(fnUp
							? fnUp
							: this.onMouseUp, this);
			this.handleElementMove = true
		}
	},
	onMouseDownUM : function(e, t, o) {
		if (e.button == 2
				|| (Ext.isMac && e.button == 0 && dev.report.base.app.ctrlKeyPressed)
				|| (Ext.isWebKit && e.button == 1)) {
			this.beforeShowCtxMenu();
			this.showContextMenu(e, o.options.paneId);
			e.stopEvent()
		}
	},
	onMouseUp : function(e, fnUp, unsubsOnly) {
		dev.report.base.app.mouseMovementObserver.unsubscribe(this.onMouseMove);
		dev.report.base.app.mouseUpObserver.unsubscribe(fnUp ? fnUp : this.onMouseUp);
		if (unsubsOnly) {
			return
		}
		var paneId = this._sheet._aPane._id;
		if (!this.handleElementMove) {
			return
		}
		var size = this.getSize(paneId), pos = this.getPosition(paneId), newLeft = pos[0], newTop = pos[1], elWidth = size.width, elHeight = size.height, conf = this.conf, elem = this.elem
				? this.elem[paneId]
				: undefined, mvSkipIdx = paneId;
		if (e.altKey) {
			var newXY = dev.report.base.wsel.getSnapXY(newLeft, newTop, elWidth,
					elHeight);
			newLeft = newXY[0];
			newTop = newXY[1];
			mvSkipIdx = -1
		}
		for (var i = this.wrapperEl.length - 1; i >= 0; i--) {
			if (i != mvSkipIdx) {
				this.wrapperEl[i].dom.style.left = "".concat(newLeft, "px");
				this.wrapperEl[i].dom.style.top = "".concat(newTop, "px")
			}
		}
		if (newLeft != this.conf.left || newTop != this.conf.top) {
			if (elem && elem.disable) {
				elem.disable();
				try {
					elem.enable();
					elem.collapse()
				} catch (e) {
				}
			}
			this.isMoved = true;
			conf.left = newLeft;
			conf.top = newTop;
			var nLoc = dev.report.base.wsel.getNLoc(newLeft, newTop, elWidth,
					elHeight, this.conf.singleCell), wselData = {};
			wselData[conf.id] = nLoc;
			if(conf.type=='Picture'){
				var table=dev.report.model.report.tabMap;
				var picture=table.getPicture(this.conf.id);
				picture.offset=nLoc.pos_offsets;
				picture.location=nLoc.n_location;
			}
		}
		this.handleElementMove = false
	},
	onMouseMove : function() {
		try {
			for (var i = this.elem.length - 1; i >= 0; i--) {
				this.elem[i].collapse()
			}
		} catch (e) {
		}
		dev.report.base.app.mouseMovementObserver.unsubscribe(this.onMouseMove)
	},
	afterResize : function(wrapper, newWidth, newHeight, e) {
		var wrapperEl = wrapper.getEl(), elLeft = wrapperEl.getLeft(true), elTop = wrapperEl
				.getTop(true), paneId = wrapper._paneId == undefined
				? this._sheet._aPane._id
				: wrapper._paneId;
		if (dev.report.base.app.activePane._id != paneId) {
			this._panes[paneId].select()
		}
		if (e && e.browserEvent && e.browserEvent.altKey) {
			var newPS = dev.report.base.wsel.getSnapXYandWH(this.conf.left,
					this.conf.top, this.conf.width, this.conf.height, elLeft,
					elTop, newWidth, newHeight, 3);
			elLeft = newPS[0];
			elTop = newPS[1];
			if (newWidth != newPS[2]) {
				newWidth = newPS[2];
				wrapperEl.dom.style.width = "".concat(newWidth, "px")
			}
			if (newHeight != newPS[3]) {
				newHeight = newPS[3];
				wrapperEl.dom.style.height = "".concat(newHeight, "px")
			}
			if (this.conf.left != elLeft) {
				this.conf.left = elLeft;
				wrapperEl.dom.style.left = "".concat(elLeft, "px")
			}
			if (this.conf.top != elTop) {
				this.conf.top = elTop;
				wrapperEl.dom.style.top = "".concat(elTop, "px")
			}
		}
		for (var i = this._panes.length - 1, style; i >= 0; i--) {
			if (i != paneId) {
				style = this.wrapperEl[i].dom.style;
				style.width = "".concat(newWidth, "px");
				style.height = "".concat(newHeight, "px");
				style.left = "".concat(elLeft, "px");
				style.top = "".concat(elTop, "px")
			}
			if (this.conf.width != newWidth) {
				this.conf.width = newWidth;
				this.elConstr[i].right += this.conf.width - newWidth
			}
			if (this.conf.height != newHeight) {
				this.conf.height = newHeight;
				this.elConstr[i].down += this.conf.height - newHeight
			}
		}
	},
	beforeResize : function(wrapper, e) {

		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		wrapper.dynamic = false
	},
	refresh : function(data) {
		return
	},
	edit : function() {
		using("dev.report.base.dlg.FormatControl");
		var formatControl=new dev.report.base.dlg.FormatControl(this.conf);
	},
	getTargetType : function() {
		var trgTypes = dev.report.base.wsel.Base.trgTypes, trgType;
		for (var type in trgTypes) {
			if ((trgType = trgTypes[type]) == trgTypes.NONE) {
				continue
			}
			if (this.conf[trgType].length) {
				return trgType
			}
		}
		return trgTypes.NONE
	},
	getZIndex : function() {
		return this.conf.zindex
	},
	setZIndex : function(zIdx) {
		if (this.isUserMode) {
			return
		}
		for (var i = this.wrapperEl.length - 1; i >= 0; i--) {
			this.wrapperEl[i].dom.style.zIndex = zIdx
		}
		var updObj = {};
		updObj[this.conf.id] = {
			zindex : zIdx
		};
		if(conf.type=='Picture'){
			var table=dev.report.model.report.tabMap;
			var picture=table.getPicture(this.conf.id);
			picture.zindex=nLoc.zIdx;
		}
		this.conf.zindex = zIdx
	},
	getId : function() {
		return this.conf.id
	},
	getSize : function(paneId) {
		var size = {
			width : 0,
			height : 0
		};
		if (this.elem[paneId]) {
			size = this.elem[paneId].getSize(true)
		}
		return size
	},
	getPosition : function(paneId) {
		var pos = [0, 0];
		if (this.wrapperEl[paneId]) {
			pos = [this.wrapperEl[paneId].dom.offsetLeft,
					this.wrapperEl[paneId].dom.offsetTop]
		}
		return pos
	},
	autoMove : function(type, pos) {
		for (var i = this._panes.length - 1, wrpEl; i >= 0; i--) {
			wrpEl = this.wrapperEl[i] ? this.wrapperEl[i] : this.wrapper[i]
					.getEl();
			wrpEl[type ? "setTop" : "setLeft"](pos)
		}
	},
	autoResize : function(type, size) {
		for (var i = this._panes.length - 1, wrpEl, width, height; i >= 0; i--) {
			wrpEl = this.wrapperEl[i] ? this.wrapperEl[i] : this.wrapper[i]
					.getEl();
			width = wrpEl.getWidth(true);
			height = wrpEl.getHeight(true);
			if (type) {
				height = size
			} else {
				width = size
			}
			this.wrapper[i].resizeTo(width, height);
			if (this.isUserMode) {
				this.afterResizeHandler(this.wrapper[i], width, height)
			}
		}
	},
	generateName : function() {
		var list = dev.report.base.wsel.wselRegistry.getByType(this.type, this._book,
				this._sheet._uid), listLen = list.length, idx = listLen + 1, nameExists = false, i, cname;
		while (true) {
			for (i = listLen - 1, cname = this.type.concat(idx); i >= 0; i--) {
				if (list[i].conf.name == cname) {
					nameExists = true;
					break
				}
			}
			if (idx < 10000 && nameExists) {
				nameExists = false;
				idx++;
				continue
			} else {
				break
			}
		}
		this.conf.name = cname
	},
	copyToClipboard : function(paneId) {
		var cnt = this.resCont[paneId];
		cnt.contentEditable = "true";
		if (document.body.createControlRange) {
			var controlRange = document.body.createControlRange();
			controlRange.addElement(cnt);
			controlRange.execCommand("Copy")
		}
		cnt.contentEditable = "false"
	}
};