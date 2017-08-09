Ext.namespace("dev.report.base.grid");

using("dev.report.base.grid.PaneStorage");
using("dev.report.base.grid.PaneCache");
using("dev.report.gen.Point");

dev.report.base.grid.Pane = function(sheet, id, dom, batch) {
	var that = this;
	this._initted = false;
	this._sheet = sheet;
	this._book = sheet._book;
	this._id = id;
	this._domId = sheet._domId.concat("P", id);
	this.dom = dom;
	this._conf = sheet._paneConf[id];
	this.holder = sheet.holder;
	this.scrollObserver = this._book.scrollObserver;
	this._jutil = dev.report.util;
	this._jenv = dev.report.env;
	this._jwenv = dev.report.base.env;
	this._conn = dev.report.backend;
	this._srl = this._jutil.serializer;
	this._viewMode = dev.report.base.app.appMode;
	this._jwapp = dev.report.base.app;
	this._jwgen = dev.report.base.general;
	this._jwgrid = dev.report.base.grid;
	this._jwstyle = dev.report.base.style;
	this._jwfrml = dev.report.base.formula;
	this._n2l = this._jwapp.numberToLetter;
	this._setText = this._jutil.setText;
	this._gmode_edit = sheet._gmode_edit;
	this._colWidths = sheet._colWidths;
	this._rowHeights = sheet._rowHeights;
	this._env = this._sheet._env;
	var winPos = this.holder.getPosition(), gridOffset = this._jwgrid.maxGridOffset;
	this._env.shared.gridScreenCoordsMax = [winPos[0] + gridOffset[0],
			winPos[1] + gridOffset[1]];
	this._jwapp.activePane = this._book._aPane = sheet._aPane = this;
	var x = this._conf.coords.x, y = this._conf.coords.y, pos = this._conf.pos;
	this._numCols = sheet["_numCols".concat(x)];
	this._numRows = sheet["_numRows".concat(y)];
	this._tableSize = [this._numCols, this._numRows];
	this._minCoords = [this._conf.range[0], this._conf.range[1]];
	this._maxCoords = [this._conf.range[2], this._conf.range[3]];
	this._cppi = [];
	this._cpp = [];
	this._farthestSeenCell = [];
	this._loadTableCoef = this._jwgrid.defLoadTableCoef;
	this._currTopCell = [pos.c, pos.r];
	this._oldCTC = [this._currTopCell[0], this._currTopCell[1]];
	this._lastDestCell = [this._currTopCell[0] - 1, this._currTopCell[1] - 1];
	this._cellSizeIncr = this._jwgrid.defCellSizeIncr;
	this._ocWidth = this._conf.coords.w;
	this._ocHeight = this._conf.coords.h;
	this._virtSize = [{
				num : 0,
				sum : 0,
				edc : 0
			}, {
				num : 0,
				sum : 0,
				edc : 0
			}];
	this._storage = new dev.report.base.grid.PaneStorage(this);
	this._cache = new dev.report.base.grid.PaneCache(this);
	this._numericSeps = dev.report.base.i18n.separators;
	this._l10nBool = dev.report.base.i18n.bool;
	this._genContentEl();
	this._oc = dom;
	this._ic = document.getElementById(this._domId + "_IC");
	this._oc.scrollLeft = pos.l;
	this._oc.scrollTop = pos.t;
	if (y == 0) {
		this._colHdrsOC = sheet["_colHdrsOC".concat(x)];
		this._colHdrsIC = sheet["_colHdrsIC".concat(x)];
		this._colHdrs = sheet["_colHdrs".concat(x)]
	}
	if (x == 0) {
		this._rowHdrsOC = sheet["_rowHdrsOC".concat(y)];
		this._rowHdrsIC = sheet["_rowHdrsIC".concat(y)];
		this._rowHdrs = sheet["_rowHdrs".concat(y)]
	}
	var tm = this._tableMat = [];
	var tr = this._tableRows = [];
	for (var row, tw = this._numCols, rows = document
			.getElementsByName(this._domId + "_gridRow"), i = this._numRows - 1; i >= 0; --i) {
		row = rows[i];
		tr[i] = row;
		tm[i] = [];
		for (var tmi = tm[i], cells = row.getElementsByTagName("div"), j = tw
				- 1; j >= 0; --j) {
			tmi[j] = cells[j]
		}
	}
	this._firstRowCells = tm[0];
	var seps = document.getElementsByName(this._domId + "_colSep");
	if (seps.length) {
		var cs = this._colSeps = [];
		for (var i = this._numCols - 1; i >= 0; --i) {
			cs[i] = seps[i]
		}
	}
	this._inputFld = document.getElementById(this._domId + "_inputField");
	this._inputFld.prepare = function(pane) {
		this._txtMetrics = Ext.util.TextMetrics.createInstance(this.id);
		this._txtMargin = this._txtMetrics.getWidth("WWWWW");
		this._txtHeight = this._txtMetrics.getHeight("W");
		var lastVisCellCoords = pane.getCoordsLastVCell(), lastVisCell = pane
				.getCellByCoords(lastVisCellCoords[0], lastVisCellCoords[1]);
		this._maxDims = {
			width : lastVisCell.offsetLeft + lastVisCell.offsetWidth
					- this.offsetLeft - 2,
			height : lastVisCell.parentNode.offsetTop
					+ lastVisCell.offsetHeight - this.offsetTop
		}
	};
	this._env.shared.inputField = this._inputFld;
	var jwmouse = dev.report.base.mouse, jwkeyboard = dev.report.base.keyboard;
	if (dev.report.env.isMobile) {
		this._touch_attr = {
			x : -1,
			y : -1,
			mv : false
		};
		this._ic.ontouchstart = function(ev) {
			that._touch_attr.x = ev.changedTouches[0].pageX;
			that._touch_attr.y = ev.changedTouches[0].pageY;
			that._touch_attr.mv = false
		};
		this._ic.ontouchend = function(ev) {
			if (ev.changedTouches[0].pageX != that._touch_attr.x
					|| ev.changedTouches[0].pageY != that._touch_attr.y) {
				that._touch_attr.mv = true
			}
		};
		this._ic.onmousedown = function(ev) {
			if (that._touch_attr.mv) {
				return
			}
			that.select();
			jwmouse.mouseOnCellDown(ev, that)
		}
	} else {
		var cellId=this._ic.id;
		var firstGridDropTarget = new Ext.dd.DropTarget(this._ic, {
			ddGroup    : 'columnDD',
			notifyDrop : function(ddSource, e, data){
				var str=Ext.getDom(ddSource.id).innerHTML;
				var pos=str.indexOf("href");
				var str=str.substring(pos+6,str.indexOf('"',pos+6));
				that.setCellValue(this.tzEl[0],this.tzEl[1],str);
				var tze = document.all ? e.srcElement : e.target;
				tze.innerHTML=str;
				return true;
			},
			notifyOver:function(ddSource, e, data){
				var tze = document.all ? e.srcElement : e.target;
				if (tze.tagName != "DIV") {
					tze = tze.tagName.toUpperCase() == "IMG"
							&& tze.parentNode.tagName.toUpperCase() != "DIV"
							? tze.parentNode.parentNode
							: tze.parentNode
				}
				tze=that.getCoordsByCell(tze);
				if(tze!=undefined)
				this.tzEl=tze;
				jwmouse.mouseOnCellDown(e, that);
				return this.dropAllowed;
			}
        });
		this._ic.onmousedown = function(ev) {
			that.select();
			jwmouse.mouseOnCellDown(ev, that)
		}
	}
	this._env.shared.inputField.onfocus = function() {
		that._jwapp.fromFormulaField = false;
		that._jwapp.lastInputField = that._env.shared.inputField
	};
	if (this._gmode_edit) {
		this._ic.onmouseover = function(ev) {
			jwmouse.overTracking(ev, that)
		};
		this._ic.onselectstart = this._jutil.ignoreEvent;
		this._env.shared.inputField.onmousedown = function() {
			if (that._jwapp.fromFormulaField) {
				that._env.shared.inputMode = that._jwgrid.GridMode.EDIT
			}
			that._sheet._formulaSelection.activeToken = null
		};
		this._env.shared.inputField.onkeyup = jwkeyboard.setFieldContent;
		this._env.shared.inputField.onselectstart = this._jutil.unignoreEvent
	} else {
		/*this._ic.onmouseover = function(ev) {
			dev.report.base.cmnt.showOnOverComment(ev, that)
		};*/


		this._ic[dev.report.env.isMobile ? "onclick" : "ondblclick"] = function(ev) {
			jwmouse.mouseonCellDblClick(ev, that)
		};
		if (dev.report.env.isDesktop) {
			this._env.shared.inputField.onkeyup = function() {
				setTimeout(jwkeyboard.setFieldSize, 0)
			}
		}
	}
	if (this._jwgrid.PaneTouch) {
		new this._jwgrid.PaneTouch(this)
	} else {
		if (this._jenv.isGecko) {
			this._oc.addEventListener("DOMMouseScroll", function(ev) {
						that._scrollWheel_Gecko(ev)
					}, false)
		} else {
			if (this._jenv.isIE) {
				this._oc.onmousewheel = function() {
					that._scrollWheel_IE()
				}
			} else {
				if (this._jenv.isWebKit) {
					this._oc.addEventListener("mousewheel", function(ev) {
								that._scrollWheel_WebKit(ev)
							}, false)
				}
			}
		}
	}
	this._fit();
	var fuc = this._sheet._farthestUsedCell, crch = this._sheet._contentReach;
	if (fuc[0] > this._minCoords[0] + this._cppi[0] + 1) {
		this._farthestSeenCell[0] = fuc[0]
	} else {
		this._farthestSeenCell[0] = this._minCoords[0] + this._cppi[0] + 1
	}
	if (fuc[1] > this._minCoords[1] + this._cppi[1] + 1) {
		this._farthestSeenCell[1] = fuc[1]
	} else {
		this._farthestSeenCell[1] = this._minCoords[1] + this._cppi[1] + 1
	}
	if (this._currTopCell[0] > crch[0] || this._currTopCell[1] > crch[1]) {
		this._init_post()
	} else {
		this._cache.load([this, this._init_post], this.getVirtScroll(), {
			frn : true
		});
	}
};
dev.report.base.grid.Pane.prototype = {
	_SCROLL_RWD : -1,
	_SCROLL_FWD : 1,
	_init_post : function() {
		if (this._gmode_edit) {
			dev.report.base.hb.syncCntrl(false);
			dev.report.base.hb.enaDisHBAdd("enable")
		}
		this._book._sheetSelector.enable(true);
		this._initted = true
	},
	_genContentEl : function() {
		var html = ['<div id="', this._domId,
				'_IC" class="paneIC customCursor">'], pos = this._conf.pos, cws = this._colWidths, rhs = this._rowHeights, wdecr = this._cellSizeIncr[0], hdecr = this._cellSizeIncr[1];
		if (this._gmode_edit) {
			for (var c = pos.c, l = pos.l, i = this._numCols - 1; i >= 0; l += cws
					.getElemAt(c++), --i) {
				html.push('<div id="', this._domId, '_colSep" name="',
						this._domId,
						'_colSep" class="gridColSep" style="left:', l,
						'px;"></div>')
			}
		}
		for (var t = pos.t, r = pos.r, rh = rhs.getElemAt(r), i = this._numRows
				- 1; i >= 0; t += rh, rh = rhs.getElemAt(++r), --i) {
			html.push('<div class="gridRow" id="', this._domId,
					'_gridRow" name="', this._domId, '_gridRow" style="top:',
					t, "px;", (rh
							? "height:".concat(rh - hdecr, "px;")
							: "display:none;"), '">');
			for (var l = pos.l, c = pos.c, cw = cws.getElemAt(c), j = this._numCols
					- 1; j >= 0; l += cw, cw = cws.getElemAt(++c), --j) {
				html.push('<div class="gridCell" style="left:', l, "px;", (cw
								? "width:".concat(cw - wdecr, "px;")
								: "display:none;"), '"></div>')
			}
			html.push("</div>")
		}
		html
				.push(
						'<textarea class="inputField default-format" id="',
						this._domId,
						'_inputField" name="',
						this._domId,
						'_inputField" onblur="dev.report.base.keyboard.sendInputAndReset();"></textarea></div>');
		this.dom.innerHTML = html.join("")
	},
	_fit : function(cb, inScroll) {
		this._ocWidth = this._conf.coords.w;
		this._ocHeight = this._conf.coords.h;
		var pos = this._lastDestCell[0] + 1, sum = this._colWidths
				.getElemAt(pos), els;
		for (var max = this._ocWidth, cw = this._colWidths; sum <= max
				&& pos <= this._maxCoords[0]; sum += cw.getElemAt(++pos)) {
		}
		this._cppi[0] = pos - this._lastDestCell[0] - 1;
		this._cpp[0] = this._cppi[0]
				+ ((els = this._colWidths.getElemAt(pos)) - sum + this._ocWidth)
				/ els;
		pos = this._lastDestCell[1] + 1, sum = this._rowHeights.getElemAt(pos);
		for (var max = this._ocHeight, rh = this._rowHeights; sum <= max
				&& pos <= this._maxCoords[1]; sum += rh.getElemAt(++pos)) {
		}
		this._cppi[1] = pos - this._lastDestCell[1] - 1;
		this._cpp[1] = this._cppi[1]
				+ ((els = this._rowHeights.getElemAt(pos)) - sum + this._ocHeight)
				/ els;
		if (!this._initted) {
			return
		}
		var newDefFUC, lDCcppi;
		if (this._farthestSeenCell[0] < (newDefFUC = this._minCoords[0]
				+ this._cppi[0] + 1)) {
			this._farthestSeenCell[0] = newDefFUC
		} else {
			if ((lDCcppi = this._lastDestCell[0] + this._cppi[0]) >= this._sheet._farthestUsedCell[0]
					&& lDCcppi >= this._minCoords[0] + this._cppi[0] + 1) {
				this._farthestSeenCell[0] = lDCcppi
			}
		}
		if (!inScroll && this._hScroll) {
			this._hScroll.recalc()
		}
		if (this._farthestSeenCell[1] < (newDefFUC = this._minCoords[1]
				+ this._cppi[1] + 1)) {
			this._farthestSeenCell[1] = newDefFUC
		} else {
			if ((lDCcppi = this._lastDestCell[1] + this._cppi[1]) >= this._sheet._farthestUsedCell[1]
					&& lDCcppi >= this._minCoords[1] + this._cppi[1] + 1) {
				this._farthestSeenCell[1] = lDCcppi
			}
		}
		if (!inScroll && this._vScroll) {
			this._vScroll.recalc()
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	},
	_reconstruct : function(cb, cDiff, rDiff, inScroll) {
		if (cDiff > 0) {
			var lastCol = this._currTopCell[0] + this._numCols - 1, dfCells = document
					.createDocumentFragment(), decr = this._cellSizeIncr[0], lastCell = this._firstRowCells[this._numCols
					- 1], lastStoCell = this._srl
					.enc(this._storage._tbl[0][this._numCols - 1]), cEdge = parseInt(lastCell.style.left)
					+ this._colWidths.getElemAt(lastCol), doColHdrs = inScroll
					&& this._colHdrs, c = lastCol, i = cDiff, cell, w, wpx, lpx, disp, colRqst;
			if (this._colSeps) {
				var dfSeps = document.createDocumentFragment(), lastSep = this._colSeps[this._numCols
						- 1], sep
			}
			if (doColHdrs) {
				var dfHdrs = document.createDocumentFragment(), lastHdr = this._colHdrs[this._numCols
						- 1], hdr
			}
			do {
				cell = lastCell.cloneNode(true);
				cell.style.left = lpx = "".concat(cEdge, "px");
				w = this._colWidths.getElemAt(++c);
				disp = false;
				if (w) {
					cell.style.width = wpx = "".concat(w - decr, "px");
					if (cell.style.display) {
						cell.style.display = disp = ""
					}
				} else {
					if (!cell.style.display) {
						cell.style.display = disp = "none"
					}
				}
				dfCells.appendChild(cell);
				if (this._colSeps) {
					sep = lastSep.cloneNode(true);
					sep.style.left = lpx;
					dfSeps.appendChild(sep);
					this._colSeps.push(sep)
				}
				if (doColHdrs) {
					hdr = lastHdr.cloneNode(true);
					this._setText(hdr, this._n2l[c]);
					hdr.style.left = lpx;
					if (w) {
						hdr.style.width = wpx
					}
					if (disp !== false) {
						hdr.style.display = disp
					}
					dfHdrs.appendChild(hdr);
					this._colHdrs.push(hdr)
				}
				cEdge += w
			} while (--i);
			if (this._colSeps) {
				this._ic.appendChild(dfSeps)
			}
			var cells, matRow, stoRow, j;
			i = this._numRows - 1;
			do {
				cells = dfCells.cloneNode(true);
				matRow = this._tableMat[i];
				stoRow = this._storage._tbl[i];
				j = 0;
				do {
					matRow.push(cells.childNodes[j]);
					stoRow.push(this._srl.dec(lastStoCell))
				} while (++j < cDiff);
				this._tableRows[i].insertBefore(cells,
						matRow[this._numCols - 1].nextSibling)
			} while (--i >= 0);
			this._tableSize[0] = (this._numCols += cDiff);
			this._sheet["_numCols".concat(this._conf.coords.x)] = this._numCols;
			if (doColHdrs && this._colHdrsIC) {
				this._colHdrsIC.appendChild(dfHdrs)
			}
			if (this._sheet == this._book._aSheet) {
				colRqst = this._cache.load(null, this._jutil.reg2rng([
										lastCol + 1, this._currTopCell[1]],
								cDiff, this._numRows), {
							frn : true,
							rfr : true
						})
			}
		}
		if (rDiff > 0) {
			var lastRow = this._currTopCell[1] + this._numRows - 1, dfTblRows = document
					.createDocumentFragment(), decr = this._cellSizeIncr[1], lastTblRow = this._tableRows[this._numRows
					- 1], lastStoRow = this._srl
					.enc(this._storage._tbl[this._numRows - 1]), rEdge = parseInt(lastTblRow.style.top)
					+ this._rowHeights.getElemAt(lastRow), doRowHdrs = inScroll
					&& this._rowHdrs, numCols = this._numCols, r = lastRow, i = rDiff, tblRow, h, firstCell, matRow, off, j, hpx, tpx, disp, rowRqst;
			if (doRowHdrs) {
				var dfHdrs = document.createDocumentFragment(), lastHdr = this._rowHdrs[this._numRows
						- 1], hdr
			}
			do {
				tblRow = lastTblRow.cloneNode(true);
				tblRow.style.top = tpx = "".concat(rEdge, "px");
				h = this._rowHeights.getElemAt(++r);
				disp = false;
				if (h) {
					tblRow.style.height = hpx = "".concat(h - decr, "px");
					if (tblRow.style.display) {
						tblRow.style.display = disp = ""
					}
				} else {
					if (!tblRow.style.display) {
						tblRow.style.display = disp = "none"
					}
				}
				dfTblRows.appendChild(tblRow);
				this._tableRows.push(tblRow);
				firstCell = this._tableMat[this._numRows - 1][0];
				off = -1;
				while (firstCell != lastTblRow.childNodes[++off]) {
				}
				matRow = [];
				j = off - 1;
				while (++j < numCols) {
					matRow.push(tblRow.childNodes[j])
				}
				j = -1;
				while (++j < off) {
					matRow.push(tblRow.childNodes[j])
				}
				this._tableMat.push(matRow);
				this._storage._tbl.push(this._srl.dec(lastStoRow));
				if (doRowHdrs) {
					hdr = lastHdr.cloneNode(true);
					this._setText(hdr, r);
					hdr.style.top = tpx;
					if (h) {
						hdr.style.height = hpx
					}
					if (disp !== false) {
						hdr.style.display = disp
					}
					dfHdrs.appendChild(hdr);
					this._rowHdrs.push(hdr)
				}
				rEdge += h
			} while (--i);
			this._ic.appendChild(dfTblRows);
			this._tableSize[1] = (this._numRows += rDiff);
			this._sheet["_numRows".concat(this._conf.coords.y)] = this._numRows;
			if (doRowHdrs && this._rowHdrsIC) {
				this._rowHdrsIC.appendChild(dfHdrs)
			}
			if (this._sheet == this._book._aSheet) {
				rowRqst = this._cache.load(null, this._jutil.reg2rng([
										this._currTopCell[0], lastRow + 1],
								this._numCols, rDiff), {
							frn : true,
							rfr : true
						}, true)
			}
		}
		if (colRqst || rowRqst) {
			var batch = new dev.report.backend.CCmdAsyncBatch(false);
			if (this._book != this._jwapp.activeBook) {
				batch.add(new dev.report.backend.CCmdAsyncRqst(["osel", 1,
						this._book.uid]))
			}
			if (colRqst) {
				batch.add(colRqst)
			}
			if (rowRqst) {
				batch.add(rowRqst)
			}
			batch.send()
		}
		this._fit(cb, inScroll)
	},
	_reposition : function(type) {
		var idx = this._lastDestCell[type] + 1 - this._currTopCell[type], pos;
		if (type) {
			pos = parseInt(this._tableRows[idx].style.top);
			this._oc.scrollTop = pos;
			if (this._rowHdrsOC) {
				this._rowHdrsOC.scrollTop = pos
			}
		} else {
			pos = parseInt(this._tableMat[0][idx].style.left);
			this._oc.scrollLeft = pos;
			if (this._colHdrsOC) {
				this._colHdrsOC.scrollLeft = pos
			}
		}
	},
	_scrollWheel_Gecko : function(ev) {
		var scroll = ev.axis == ev.VERTICAL_AXIS
				? this._vScroll
				: this._hScroll, amount = ev.detail / 3 | 0;
		if (scroll && scroll.visible && amount) {
			scroll.start([scroll, scroll.stop], amount > 0 ? 1 : -1, undefined,
					Math.abs(amount))
		}
	},
	_scrollWheel_IE : function() {
		var ev = window.event, scroll = this._vScroll, amount = ev.wheelDelta
				/ 120 | 0;
		if (scroll && scroll.visible && amount) {
			scroll.start([scroll, scroll.stop], amount > 0 ? -1 : 1, undefined,
					Math.abs(amount))
		}
	},
	_scrollWheel_WebKit : function(ev) {
		if (ev.wheelDeltaY) {
			var scroll = this._vScroll, amount = ev.wheelDeltaY / 120 | 0
		} else {
			if (ev.wheelDeltaX) {
				var scroll = this._hScroll, amount = ev.wheelDeltaX / 120 | 0
			}
		}
		if (scroll && scroll.visible && amount) {
			scroll.start([scroll, scroll.stop], amount > 0 ? -1 : 1, undefined,
					Math.abs(amount))
		}
	},
	scrollTo : function(cb, col, row, minscroll, force) {
		if (this._book._scrollPending) {
			return false
		}
		--col;
		--row;
		var doHoriz = false, doVert = false;
		if (this._conf.hscroll) {
			if (col < this._lastDestCell[0]) {
				doHoriz = col >= this._minCoords[0] - 1
			} else {
				if (col > this._lastDestCell[0]) {
					if (col > this._lastDestCell[0] + this._cppi[0] - 1) {
						doHoriz = true;
						if (minscroll == true) {
							col -= this._cppi[0] - 1
						}
					} else {
						if (force && col != this._lastDestCell[0]) {
							doHoriz = true
						}
					}
				}
			}
		}
		if (this._conf.vscroll) {
			if (row < this._lastDestCell[1]) {
				doVert = row >= this._minCoords[1] - 1
			} else {
				if (row > this._lastDestCell[1]) {
					if (row > this._lastDestCell[1] + this._cppi[1] - 1) {
						doVert = true;
						if (minscroll == true) {
							row -= this._cppi[1] - 1
						}
					} else {
						if (force && row != this._lastDestCell[1]) {
							doVert = true
						}
					}
				}
			}
		}
		this._book._scrollPending = true;
		if (doHoriz) {
			if (col > this._maxCoords[0] - this._cppi[0]) {
				col = this._maxCoords[0] - this._cppi[0]
			}
			if (col + this._cppi[0] > this._farthestSeenCell[0]) {
				this._farthestSeenCell[0] = col + this._cppi[0]
			}
			this._hScroll._doCheck = true;
			this._hScroll._scroll(undefined, col, doVert ? [this,
							this._scrollTo_vert, cb, row] : [this,
							this._scrollTo_post, cb, false])
		} else {
			if (doVert) {
				this._scrollTo_vert(cb, row)
			} else {
				this._scrollTo_post(cb, false)
			}
		}
	},
	_scrollTo_vert : function(cb, row) {
		if (row > this._maxCoords[1] - this._cppi[1]) {
			row = this._maxCoords[1] - this._cppi[1]
		}
		var atEnd = false;
		if (row + this._cppi[1] >= this._farthestSeenCell[1]) {
			this._farthestSeenCell[1] = row + this._cppi[1], atEnd = true
		}
		this._vScroll._doCheck = true;
		this._vScroll._scroll(undefined, row, [this, this._scrollTo_post, cb,
						atEnd])
	},
	_scrollTo_post : function(cb, atEnd) {
		if (atEnd) {
			this._vScroll._slider.setValue(this._vScroll._scrollSpace, true,
					true, true)
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
		this._book._scrollPending = false
	},
	_loadTable : function(doHoriz, doVert, fillCells, doClean) {
		if (doVert) {
			for (var hdr, ndh, tr, ntpx, rhd = this._rowHdrs, rhs = this._rowHeights, trs = this._tableRows, rhi = this._cellSizeIncr[1], ctc = this._currTopCell[1], i = this._numRows
					- 1, ctci = ctc + i, nt = rhs.getSumUpTo(ctci), rh = rhs
					.getElemAt(ctci); i >= 0; --i, nt -= (rh = rhs
					.getElemAt(--ctci))) {
				ntpx = "".concat(nt, "px");
				tr = trs[i];
				if (rh) {
					if (tr.style.display != "") {
						ndh = ";height:".concat(rh - rhi, "px;display:;")
					} else {
						if ((rh -= rhi) != parseInt(tr.style.height)) {
							ndh = ";height:".concat(rh, "px;")
						} else {
							ndh = ""
						}
					}
				} else {
					ndh = tr.style.display != "none" ? ";display:none;" : ""
				}
				if (ndh.length) {
					tr.style.cssText = "top:".concat(ntpx, ndh)
				} else {
					tr.style.top = ntpx
				}
				if (rhd) {
					hdr = rhd[i];
					if (ndh.length) {
						hdr.style.cssText = "top:".concat(ntpx, ndh)
					} else {
						hdr.style.top = ntpx
					}
					this._setText(hdr, ctci)
				}
			}
		}
		if (doHoriz || fillCells) {
			for (var hdr, nlpx, ndw, st, ch = this._colHdrs, cs = this._colSeps, ntl = this._n2l, cws = this._colWidths, rhs = this._rowHeights, cwi = this._cellSizeIncr[0], rhi = this._cellSizeIncr[1], frc = this._firstRowCells, tm = this._tableMat, th = this._numRows, decSep = this._numericSeps[0], l10nBool = this._l10nBool, ctc = this._currTopCell, j = this._numCols
					- 1, ctcj = ctc[0] + j, nl = cws.getSumUpTo(ctcj), cw = cws
					.getElemAt(ctcj), dta = this._jwstyle.defTextAlign; j >= 0; --j, nl -= (cw = cws
					.getElemAt(--ctcj))) {
				nlpx = "".concat(nl, "px");
				if (cw) {
					st = frc[j].style;
					if (st.display != "") {
						ndw = true, cw = ";width:".concat(cw - cwi,
								"px;display:;")
					} else {
						ndw = (cw -= cwi) != parseInt(st.width), cw = ";width:"
								.concat(cw, "px;")
					}
				} else {
					ndw = frc[j].style.display != "none", cw = ";display:none;"
				}
				for (var newc, oldc, cell, i = th - 1, ctci = ctc[1] + i; i >= 0; --i) {
					newc = this._cache.get(ctcj, ctci--);
					oldc = this._storage.get(j, i);
					cell = tm[i][j];
					if (newc != undefined && "s" in newc) {
						cell.style.cssText = "left:".concat(nlpx, cw, newc.s);
						if (cell.style.borderLeftWidth == "2px") {
							cell.style.width = this._jutil.asSize(cws
									.getElemAt(ctcj)
									- cwi - 1)
						}
						if (cell.style.borderTopWidth == "2px") {
							cell.style.height = this._jutil.asSize(rhs
									.getElemAt(ctci + 1)
									- rhi - 1)
						}
					} else {
						if (ndw || (oldc != undefined && "s" in oldc)
								|| doClean) {
							cell.style.cssText = "left:".concat(nlpx, cw)
						} else {
							if (doHoriz) {
								cell.style.left = nlpx
							}
							if (cell.style.textAlign) {
								cell.style.textAlign = ""
							}
						}
					}
					if (newc != undefined && "m" in newc && newc.m[0] == true) {
						if (cell.className.indexOf("mergedCell") == -1) {
							cell.className += " mergedCell"
						}
						for (var sum = 0, max = newc.m[2], k = 0; k < max; sum += cws
								.getElemAt(ctcj + k++)) {
						}
						cell.style.width = this._jutil.asSize(sum - cwi);
						for (var sum = 0, max = newc.m[1], k = 0; k < max; sum += rhs
								.getElemAt(ctci + ++k)) {
						}
						cell.style.height = this._jutil.asSize(sum - rhi)
					} else {
						if (cell.className.indexOf("mergedCell") != -1) {
							cell.className = cell.className.replace(
									"mergedCell", "");
							cell.style.width = this._jutil.asSize(cws
									.getElemAt(ctcj)
									- cwi);
							cell.style.height = ""
						}
					}
					if (newc != undefined && "m" in newc && newc.m[0] == false) {
						cell.style.visibility = "hidden"
					} else {
						if (cell.style.visibility == "hidden") {
							cell.style.visibility = ""
						}
					}
					if (newc != undefined && "v" in newc) {
						switch (typeof newc.v) {
							case "number" :
								newc.v = decSep == "."
										? "" + newc.v
										: ("" + newc.v).replace(".", decSep);
								break;
							case "boolean" :
								newc.v = l10nBool[newc.v];
								break
						}
						if (newc.t == "h") {
							cell.innerHTML = newc.l || newc.v
						} else {
							this._setText(cell, newc.l || newc.v)
						}
						if ("t" in newc && cell.style.textAlign == ""
								&& dta[newc.t] != "") {
							cell.style.textAlign = dta[newc.t]
						}
					} else {
						if ((oldc != undefined && "v" in oldc) || doClean) {
							this._setText(cell, "")
						}
					}
					if (!this._gmode_edit) {
						if (newc != undefined && newc.k == false) {
							if (oldc == undefined || oldc.k != false) {
								cell.className += " gridCellUnlocked"
							}
						} else {
							if ((oldc != undefined && oldc.k == false)
									|| doClean) {
								cell.className = cell.className.replace(
										"gridCellUnlocked", "")
							}
						}
					}
					this._storage.set(j, i, newc)
				}
				if (!doHoriz) {
					continue
				}
				if (ch) {
					hdr = ch[j];
					if (ndw) {
						hdr.style.cssText = "left:".concat(nlpx, cw)
					} else {
						hdr.style.left = nlpx
					}
					this._setText(hdr, ntl[ctcj])
				}
				if (cs) {
					cs[j].style.left = nlpx
				}
			}
		}
	},
	_calcScroll : function(params, amount) {
		var type = params.type;
		if (params.dir == this._SCROLL_RWD) {
			var fincoord = this._currTopCell[type] - amount;
			if (fincoord < this._minCoords[type]) {
				amount += fincoord - this._minCoords[type];
				fincoord = this._minCoords[type]
			}
			var newcoord = this._currTopCell[type], oldcoord = this._currTopCell[type]
					+ this._tableSize[type], s_amount = -amount
		} else {
			if (params.dir == this._SCROLL_FWD) {
				var fincoord = this._currTopCell[type] + this._tableSize[type]
						- 1 + amount;
				if (fincoord > this._maxCoords[type]) {
					amount -= fincoord - this._maxCoords[type]
				} else {
					if (fincoord > this._farthestSeenCell[type] + 1) {
						amount -= fincoord - this._farthestSeenCell[type] - 1
					}
				}
				fincoord = this._currTopCell[type] + this._tableSize[type];
				var newcoord = fincoord - 1, oldcoord = this._currTopCell[type]
						- 1, s_amount = amount
			} else {
				return false
			}
		}
		if (amount > 0) {
			params.amount = amount;
			params.s_amount = s_amount;
			params.fincoord = fincoord;
			params.newcoord = newcoord;
			params.oldcoord = oldcoord
		}
		return true
	},
	_scrollTableX : function(dir, amount, newcoord, oldcoord) {
		var newwidth, oldwidth, newleft, hdr, sep, wdiff, newx, cw = this._colWidths, rh = this._rowHeights, tw = this._numCols, th = this._numRows, csi = this._cellSizeIncr[0], rhi = this._cellSizeIncr[1], frc = this._firstRowCells, ch = this._colHdrs, cs = this._colSeps, ntl = this._n2l, decSep = this._numericSeps[0], l10nBool = this._l10nBool, tm = this._tableMat, st = this._storage._tbl, dta = this._jwstyle.defTextAlign, ctc = this._currTopCell[1];
		for (var i = amount; i > 0; --i) {
			if (dir == this._SCROLL_RWD) {
				--newcoord;
				--oldcoord;
				newx = 0;
				oldwidth = cw.getElemAt(oldcoord);
				newwidth = cw.getElemAt(newcoord);
				newleft = "".concat(parseInt(frc[0].style.left) - newwidth,
						"px");
				if (ch) {
					ch.unshift(hdr = ch.pop())
				}
				if (cs) {
					cs.unshift(sep = cs.pop())
				}
			} else {
				++newcoord;
				++oldcoord;
				newx = tw - 1;
				oldwidth = cw.getElemAt(oldcoord);
				newwidth = cw.getElemAt(newcoord);
				newleft = "".concat(parseInt(frc[tw - 1].style.left)
								+ cw.getElemAt(newcoord - 1), "px");
				if (ch) {
					ch.push(hdr = ch.shift())
				}
				if (cs) {
					cs.push(sep = cs.shift())
				}
			}
			if (newwidth != oldwidth) {
				wdiff = true;
				if (newwidth) {
					newwidth = ";width:".concat(newwidth - csi, "px;",
							(oldwidth ? "" : "display:;"))
				} else {
					newwidth = ";display:none;"
				}
			} else {
				if (newwidth) {
					wdiff = false, newwidth = ";width:".concat(newwidth - csi,
							"px;")
				} else {
					wdiff = false, newwidth = ";display:none;"
				}
			}
			if (hdr) {
				if (wdiff) {
					hdr.style.cssText = "left:".concat(newleft, newwidth)
				} else {
					hdr.style.left = newleft
				}
				this._setText(hdr, ntl[newcoord])
			}
			if (sep) {
				sep.style.left = newleft
			}
			for (var row, srow, cell, newc, oldc, j = th - 1, ctcj = ctc + j; j >= 0; --j, --ctcj) {
				row = tm[j];
				srow = st[j];
				if (dir == this._SCROLL_RWD) {
					row.unshift(cell = row.pop());
					srow.unshift(oldc = srow.pop())
				} else {
					row.push(cell = row.shift());
					srow.push(oldc = srow.shift())
				}
				newc = this._cache.get(newcoord, ctcj);
				if (newc != undefined && "s" in newc) {
					cell.style.cssText = "left:".concat(newleft, newwidth,
							newc.s);
					if (cell.style.borderLeftWidth == "2px") {
						cell.style.width = this._jutil.asSize(cw
								.getElemAt(newcoord)
								- csi - 1)
					}
					if (cell.style.borderTopWidth == "2px") {
						cell.style.height = this._jutil.asSize(rh
								.getElemAt(ctcj)
								- rhi - 1)
					}
				} else {
					if (wdiff || (oldc != undefined && "s" in oldc)) {
						cell.style.cssText = "left:".concat(newleft, newwidth)
					} else {
						cell.style.left = newleft;
						if (cell.style.textAlign) {
							cell.style.textAlign = ""
						}
					}
				}
				if (newc != undefined && "m" in newc && newc.m[0] == true) {
					if (cell.className.indexOf("mergedCell") == -1) {
						cell.className += " mergedCell"
					}
					for (var sum = 0, max = newc.m[2], k = 0; k < max; sum += cw
							.getElemAt(newcoord + k++)) {
					}
					cell.style.width = this._jutil.asSize(sum - csi);
					for (var sum = 0, max = newc.m[1], k = 0; k < max; sum += rh
							.getElemAt(ctcj + k++)) {
					}
					cell.style.height = this._jutil.asSize(sum - rhi)
				} else {
					if (cell.className.indexOf("mergedCell") != -1) {
						cell.className = cell.className.replace("mergedCell",
								"");
						cell.style.width = this._jutil.asSize(cw
								.getElemAt(newcoord)
								- csi);
						cell.style.height = ""
					}
				}
				if (newc != undefined && "m" in newc && newc.m[0] == false) {
					cell.style.visibility = "hidden"
				} else {
					if (cell.style.visibility == "hidden") {
						cell.style.visibility = ""
					}
				}
				if (newc != undefined && "v" in newc) {
					switch (typeof newc.v) {
						case "number" :
							newc.v = decSep == "."
									? "" + newc.v
									: ("" + newc.v).replace(".", decSep);
							break;
						case "boolean" :
							newc.v = l10nBool[newc.v];
							break
					}
					if (newc.t == "h") {
						cell.innerHTML = newc.l || newc.v
					} else {
						this._setText(cell, newc.l || newc.v)
					}
					if ("t" in newc && cell.style.textAlign == ""
							&& dta[newc.t] != "") {
						cell.style.textAlign = dta[newc.t]
					}
				} else {
					if (oldc != undefined && "v" in oldc) {
						this._setText(cell, "")
					}
				}
				if (!this._gmode_edit) {
					if (newc != undefined && newc.k == false) {
						if (oldc == undefined || oldc.k != false) {
							cell.className += " gridCellUnlocked"
						}
					} else {
						if (oldc != undefined && oldc.k == false) {
							cell.className = cell.className.replace(
									"gridCellUnlocked", "")
						}
					}
				}
				srow[newx] = newc
			}
		}
	},
	_scrollTableY : function(dir, amount, newcoord, oldcoord) {
		var newheight, oldheight, newtop, row, srow, tblrow, hdr, ndh, rh = this._rowHeights, cw = this._colWidths, csi = this._cellSizeIncr[1], cwi = this._cellSizeIncr[0], tr = this._tableRows, tm = this._tableMat, st = this._storage._tbl, rhd = this._rowHdrs, th = this._numRows, tw = this._numCols, l10nBool = this._l10nBool, decSep = this._numericSeps[0], dta = this._jwstyle.defTextAlign, ctc = this._currTopCell[0];
		for (var i = amount; i > 0; --i) {
			if (dir == this._SCROLL_RWD) {
				--newcoord;
				--oldcoord;
				oldheight = rh.getElemAt(oldcoord);
				newheight = rh.getElemAt(newcoord);
				newtop = parseInt(tr[0].style.top) - newheight;
				tm.unshift(row = tm.pop());
				st.unshift(srow = st.pop());
				tr.unshift(tblrow = tr.pop());
				if (rhd) {
					rhd.unshift(hdr = rhd.pop())
				}
			} else {
				++newcoord;
				++oldcoord;
				oldheight = rh.getElemAt(oldcoord);
				newheight = rh.getElemAt(newcoord);
				newtop = parseInt(tr[th - 1].style.top)
						+ rh.getElemAt(newcoord - 1);
				tm.push(row = tm.shift());
				st.push(srow = st.shift());
				tr.push(tblrow = tr.shift());
				if (rhd) {
					rhd.push(hdr = rhd.shift())
				}
			}
			if (newheight != oldheight) {
				ndh = true;
				if (newheight) {
					var csstxt = "top:".concat(newtop, "px;height:", newheight
									- csi, "px;",
							(oldheight ? "" : "display:;"))
				} else {
					var csstxt = "top:".concat(newtop, "px;display:none;")
				}
				tblrow.style.cssText = csstxt
			} else {
				ndh = false, tblrow.style.top = newtop = ""
						.concat(newtop, "px")
			}
			if (hdr) {
				if (ndh) {
					hdr.style.cssText = csstxt
				} else {
					hdr.style.top = newtop
				}
				this._setText(hdr, newcoord)
			}
			for (var cell, newc, oldc, j = tw - 1, ctcj = ctc + j; j >= 0; --j, --ctcj) {
				cell = row[j];
				newc = this._cache.get(ctcj, newcoord);
				oldc = srow[j];
				if (newc != undefined && "s" in newc) {
					cell.style.cssText = "left:".concat(cell.style.left,
							";width:", cell.style.width, ";display:",
							cell.style.display, ";", newc.s);
					if (cell.style.borderLeftWidth == "2px") {
						cell.style.width = this._jutil.asSize(cw
								.getElemAt(ctcj)
								- cwi - 1)
					}
					if (cell.style.borderTopWidth == "2px") {
						cell.style.height = this._jutil.asSize(rh
								.getElemAt(newcoord)
								- csi - 1)
					}
				} else {
					if (oldc != undefined && "s" in oldc) {
						cell.style.cssText = "left:".concat(cell.style.left,
								";width:", cell.style.width, ";display:",
								cell.style.display, ";")
					} else {
						if (cell.style.textAlign) {
							cell.style.textAlign = ""
						}
					}
				}
				if (newc != undefined && "m" in newc && newc.m[0] == true) {
					if (cell.className.indexOf("mergedCell") == -1) {
						cell.className += " mergedCell"
					}
					for (var sum = 0, max = newc.m[2], k = 0; k < max; sum += cw
							.getElemAt(ctcj + k++)) {
					}
					cell.style.width = this._jutil.asSize(sum - cwi);
					for (var sum = 0, max = newc.m[1], k = 0; k < max; sum += rh
							.getElemAt(newcoord + k++)) {
					}
					cell.style.height = this._jutil.asSize(sum - csi)
				} else {
					if (cell.className.indexOf("mergedCell") != -1) {
						cell.className = cell.className.replace("mergedCell",
								"");
						cell.style.width = this._jutil.asSize(cw
								.getElemAt(ctcj)
								- cwi);
						cell.style.height = ""
					}
				}
				if (newc != undefined && "m" in newc && newc.m[0] == false) {
					cell.style.visibility = "hidden"
				} else {
					if (cell.style.visibility == "hidden") {
						cell.style.visibility = ""
					}
				}
				if (newc != undefined && "v" in newc) {
					switch (typeof newc.v) {
						case "number" :
							newc.v = decSep == "."
									? "" + newc.v
									: ("" + newc.v).replace(".", decSep);
							break;
						case "boolean" :
							newc.v = l10nBool[newc.v];
							break
					}
					if (newc.t == "h") {
						cell.innerHTML = newc.l || newc.v
					} else {
						this._setText(cell, newc.l || newc.v)
					}
					if ("t" in newc && cell.style.textAlign == ""
							&& dta[newc.t] != "") {
						cell.style.textAlign = dta[newc.t]
					}
				} else {
					if (oldc != undefined && "v" in oldc) {
						this._setText(cell, "")
					}
				}
				if (!this._gmode_edit) {
					if (newc != undefined && newc.k == false) {
						if (oldc == undefined || oldc.k != false) {
							cell.className += " gridCellUnlocked"
						}
					} else {
						if (oldc != undefined && oldc.k == false) {
							cell.className = cell.className.replace(
									"gridCellUnlocked", "")
						}
					}
				}
				srow[j] = newc
			}
		}
	},
	_scrollGridX : function(offset, destCellAbs, cb) {
		if (destCellAbs == undefined) {
			destCellAbs = Math.round(offset / this._hScroll._sliderTicks)
					+ this._minCoords[0] - 1
		}
		if (destCellAbs == this._lastDestCell[0]) {
			return
		}
		var dir = destCellAbs < this._lastDestCell[0]
				? this._SCROLL_RWD
				: this._SCROLL_FWD, destCellRel = destCellAbs
				- (this._currTopCell[0] - 1);
		var colw, pos = destCellAbs + 1, sum = this._colWidths.getElemAt(pos);
		for (var max = this._ocWidth, cw = this._colWidths; sum <= max
				&& pos <= this._maxCoords[0]; sum += cw.getElemAt(++pos)) {
		}
		var cppi = pos - destCellAbs - 1, cpp = cppi
				+ ((colw = this._colWidths.getElemAt(pos)) - sum + this._ocWidth)
				/ colw;
		if (destCellAbs + cppi > this._farthestSeenCell[0]
				&& (this._farthestSeenCell[0] = destCellAbs + cppi) > this._maxCoords[0]) {
			this._farthestSeenCell[0] = this._maxCoords[0]
		}
		if (cppi + 3 > this._numCols) {
			this._reconstruct(null, cppi + 3 - this._numCols, 0, true)
		}
		var scrollParams = {
			type : 0,
			dir : dir,
			r_dir : dir,
			amount : 0
		}, gridParams = {
			dca : destCellAbs,
			cppi : cppi,
			cpp : cppi
		};
		var crch = this._sheet._contentReach;
		if (Math.abs(destCellRel) + 1 >= this._numCols * this._loadTableCoef) {
			var ctc = destCellAbs;
			destCellRel = 1;
			var gridEdge = ctc + this._numCols - 1;
			if (ctc < this._minCoords[0]) {
				destCellRel -= -ctc + this._minCoords[0];
				ctc = this._minCoords[0]
			} else {
				if (gridEdge > this._farthestSeenCell[0]) {
					if (gridEdge > this._maxCoords[0]) {
						var corr = gridEdge - this._maxCoords[0]
					} else {
						var corr = gridEdge - this._farthestSeenCell[0] - 1
					}
					destCellRel += corr;
					ctc -= corr
				}
			}
			gridParams.ctc = ctc;
			gridParams.dcr = destCellRel;
			var loadRng = this._jutil.reg2rng([ctc, this._currTopCell[1]],
					this._numCols, this._numRows);
			this._jutil.rngCap(loadRng, crch);
			if (ctc > crch[0] || this._currTopCell[1] > crch[1]
					|| !this._cache.miss(loadRng)) {
				return [this, this._scrollGridX_do, true, gridParams,
						scrollParams, cb]
			}
			return this._cache.load([this, this._scrollGridX_do, true,
							gridParams, scrollParams, cb], loadRng, {
						sdr : 1 + dir
					})
		}
		if (destCellRel >= 0) {
			if (destCellRel + cppi < this._numCols) {
				var rremaining = this._numCols - destCellRel - cppi;
				if (rremaining < 1) {
					this._calcScroll(scrollParams, 1 - rremaining);
					destCellRel -= scrollParams.amount
				} else {
					var lmissing = 1 - destCellRel;
					if (lmissing > 0 && this._currTopCell[0] - lmissing > 0) {
						scrollParams.dir = this._SCROLL_RWD;
						this._calcScroll(scrollParams, lmissing);
						destCellRel += scrollParams.amount
					}
				}
			} else {
				this._calcScroll(scrollParams, destCellRel + cppi
								- this._numCols + 2);
				destCellRel -= scrollParams.amount
			}
		} else {
			this._calcScroll(scrollParams, -destCellRel + 1);
			destCellRel += scrollParams.amount
		}
		gridParams.dcr = destCellRel;
		var loadRng = this._jutil.reg2rng([scrollParams.fincoord,
						this._currTopCell[1]], scrollParams.amount,
				this._numRows);
		this._jutil.rngCap(loadRng, crch);
		if (!scrollParams.amount || scrollParams.fincoord > crch[0]
				|| this._currTopCell[1] > crch[1] || !this._cache.miss(loadRng)) {
			return [this, this._scrollGridX_do, false, gridParams,
					scrollParams, cb]
		}
		return this._cache.load([this, this._scrollGridX_do, false, gridParams,
						scrollParams, cb], loadRng, {
					sdr : 1 + dir
				})
	},
	_scrollGridX_do : function(mode, gridParams, scrollParams, cb) {
		this._lastDestCell[0] = gridParams.dca;
		this._cppi[0] = gridParams.cppi;
		this._cpp[0] = gridParams.cpp;
		if (mode) {
			this._oldCTC[0] = this._currTopCell[0];
			this._currTopCell[0] = gridParams.ctc;
			this._loadTable(true, false, true, false);
			var newleft = this._colWidths.getSumUpTo(this._currTopCell[0]
					+ gridParams.dcr)
		} else {
			if (scrollParams.amount) {
				this._scrollTableX(scrollParams.dir, scrollParams.amount,
						scrollParams.newcoord, scrollParams.oldcoord), this._currTopCell[0] += scrollParams.s_amount
			}
			var newleft = parseInt(this._firstRowCells[gridParams.dcr].style.left)
		}
		this._oc.scrollLeft = newleft;
		if (this._colHdrsOC) {
			this._colHdrsOC.scrollLeft = newleft
		}
		if (this._hScroll._refPane == this) {
			if (this._hScroll._doCheck) {
				this._hScroll.check()
			}
			this._hScroll._scheduled = false
		}
		this._book.scrollObserver.notify(this, this, 0, scrollParams.r_dir,
				this._lastDestCell[0] + 1, this._lastDestCell[0]
						+ this._cppi[0], this._hScroll._currScrollSpeed);
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	},
	_scrollGridY : function(offset, destCellAbs, cb) {
		if (destCellAbs == undefined) {
			destCellAbs = Math.round(offset / this._vScroll._sliderTicks)
					+ this._minCoords[1] - 1
		}
		if (destCellAbs == this._lastDestCell[1]) {
			return
		}
		var dir = destCellAbs < this._lastDestCell[1]
				? this._SCROLL_RWD
				: this._SCROLL_FWD, destCellRel = destCellAbs
				- (this._currTopCell[1] - 1);
		var rowh, pos = destCellAbs + 1, sum = this._rowHeights.getElemAt(pos);
		for (var max = this._ocHeight, rh = this._rowHeights; sum <= max
				&& pos <= this._maxCoords[1]; sum += rh.getElemAt(++pos)) {
		}
		var cppi = pos - destCellAbs - 1;
		cpp = cppi
				+ ((rowh = this._rowHeights.getElemAt(pos)) - sum + this._ocHeight)
				/ rowh;
		if (destCellAbs + cppi > this._farthestSeenCell[1]
				&& (this._farthestSeenCell[1] = destCellAbs + cppi) > this._maxCoords[1]) {
			this._farthestSeenCell[1] = this._maxCoords[1]
		}
		if (cppi + 3 > this._numRows) {
			this._reconstruct(null, 0, cppi + 3 - this._numRows, true)
		}
		var scrollParams = {
			type : 1,
			dir : dir,
			r_dir : dir,
			amount : 0
		}, gridParams = {
			dca : destCellAbs,
			cppi : cppi,
			cpp : cppi
		};
		var crch = this._sheet._contentReach;
		if (Math.abs(destCellRel) + 1 >= this._numRows * this._loadTableCoef) {
			var ctc = destCellAbs;
			destCellRel = 1;
			var gridEdge = ctc + this._numRows - 1;
			if (ctc < this._minCoords[1]) {
				destCellRel -= -ctc + this._minCoords[1];
				ctc = this._minCoords[1]
			} else {
				if (gridEdge > this._farthestSeenCell[1]) {
					if (gridEdge > this._maxCoords[1]) {
						var corr = gridEdge - this._maxCoords[1]
					} else {
						var corr = gridEdge - this._farthestSeenCell[1] - 1
					}
					destCellRel += corr;
					ctc -= corr
				}
			}
			gridParams.ctc = ctc;
			gridParams.dcr = destCellRel;
			var loadRng = this._jutil.reg2rng([this._currTopCell[0], ctc],
					this._numCols, this._numRows);
			this._jutil.rngCap(loadRng, crch);
			if (ctc > crch[1] || this._currTopCell[0] > crch[0]
					|| !this._cache.miss(loadRng)) {
				return [this, this._scrollGridY_do, true, gridParams,
						scrollParams, cb]
			}
			return this._cache.load([this, this._scrollGridY_do, true,
							gridParams, scrollParams, cb], loadRng, {
						sdr : 2 + dir
					})
		}
		if (destCellRel >= 0) {
			if (destCellRel + cppi < this._numRows) {
				var dremaining = this._numRows - destCellRel - cppi;
				if (dremaining < 1) {
					this._calcScroll(scrollParams, 1 - dremaining);
					destCellRel -= scrollParams.amount
				} else {
					var umissing = 1 - destCellRel;
					if (umissing > 0 && this._currTopCell[1] - umissing > 0) {
						scrollParams.dir = this._SCROLL_RWD;
						this._calcScroll(scrollParams, umissing);
						destCellRel += scrollParams.amount
					}
				}
			} else {
				this._calcScroll(scrollParams, destCellRel + cppi
								- this._numRows + 2);
				destCellRel -= scrollParams.amount
			}
		} else {
			this._calcScroll(scrollParams, -destCellRel + 1);
			destCellRel += scrollParams.amount
		}
		gridParams.dcr = destCellRel;
		var loadRng = this._jutil.reg2rng([this._currTopCell[0],
						scrollParams.fincoord], this._numCols,
				scrollParams.amount);
		this._jutil.rngCap(loadRng, crch);
		if (!scrollParams.amount || scrollParams.fincoord > crch[1]
				|| this._currTopCell[0] > crch[0] || !this._cache.miss(loadRng)) {
			return [this, this._scrollGridY_do, false, gridParams,
					scrollParams, cb]
		}
		return this._cache.load([this, this._scrollGridY_do, false, gridParams,
						scrollParams, cb], loadRng, {
					sdr : 2 + dir
				})
	},
	_scrollGridY_do : function(mode, gridParams, scrollParams, cb) {
		this._lastDestCell[1] = gridParams.dca;
		this._cppi[1] = gridParams.cppi;
		this._cpp[1] = gridParams.cpp;
		if (mode) {
			this._oldCTC[1] = this._currTopCell[1];
			this._currTopCell[1] = gridParams.ctc;
			this._loadTable(false, true, true, false);
			var newtop = this._rowHeights.getSumUpTo(this._currTopCell[1]
					+ gridParams.dcr)
		} else {
			if (scrollParams.amount) {
				this._scrollTableY(scrollParams.dir, scrollParams.amount,
						scrollParams.newcoord, scrollParams.oldcoord), this._currTopCell[1] += scrollParams.s_amount
			}
			var newtop = parseInt(this._tableRows[gridParams.dcr].style.top)
		}
		this._oc.scrollTop = newtop;
		if (this._rowHdrsOC) {
			this._rowHdrsOC.scrollTop = newtop
		}
		if (this._vScroll._refPane == this) {
			if (this._vScroll._doCheck) {
				this._vScroll.check()
			}
			this._vScroll._scheduled = false
		}
		this._book.scrollObserver.notify(this, this, 1, scrollParams.r_dir,
				this._lastDestCell[1] + 1, this._lastDestCell[1]
						+ this._cppi[1], this._vScroll._currScrollSpeed);
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	},
	getCoordsByCell : function(obj) {
		for (var tmi, ldc = this._lastDestCell, ctc = this._currTopCell, cppi = this._cppi, tm = this._tableMat, i = ldc[1]
				- ctc[1] + 1, uly = i + cppi[1]; i <= uly; ++i) {
			if (i in tm) {
				tmi = tm[i]
			} else {
				break
			}
			for (var j = ldc[0] - ctc[0] + 1, ulx = j + cppi[0]; j <= ulx; ++j) {
				if (tmi[j] == obj) {
					return [ctc[0] + j, ctc[1] + i]
				}
			}
		}
		return undefined
	},
	select : function() {
		this._jwapp.activePane = this._book._aPane = this._sheet._aPane = this;
		this._jwapp.environment = this._env.shared;
		if (this._gmode_edit) {
			this._sheet._defaultSelection.syncActivePane();
			this._sheet._formulaSelection.syncActivePane();
			this._sheet._copySelection.syncActivePane();
			this._sheet._autoScroll.syncActivePane();
			dev.report.base.hb.syncActivePane()
		} else {
			if (this._sheet._cursorField) {
				this._sheet._cursorField.syncActivePane()
			}
		}
		if (this._env.shared.inputMode == dev.report.base.grid.GridMode.EDIT
				|| this._env.shared.inputMode == dev.report.base.grid.GridMode.INPUT) {
			return
		}
		this._env.shared.inputField = document.getElementById(this._domId
				+ "_inputField")
	},
	getCellByPos : function(x, y) {
		if (y in this._tableMat) {
			return this._tableMat[y][x]
		}
		return undefined
	},
	getCellByCoords : function(col, row) {
		col -= this._currTopCell[0];
		row -= this._currTopCell[1];
		if (row in this._tableMat) {
			return this._tableMat[row][col]
		}
		return undefined
	},
	getPixelsByCoords : function(col, row) {
		return [this._colWidths.getSumUpTo(col),
				this._rowHeights.getSumUpTo(row)]
	},
	furnishCell : function(col, row, obj, comb) {
		var x = col - this._currTopCell[0], y = row - this._currTopCell[1], cell = this
				.getCellByPos(x, y), stor = this._storage, decSep;

		if (cell == undefined) {
			return false
		}
		var s = "s" in obj ? obj.s : (comb ? undefined : ""), s_old = stor
				.getPart(x, y, "s"), cws = this._colWidths, rhs = this._rowHeights, cwi = this._cellSizeIncr[0], rhi = this._cellSizeIncr[1], bleedH, bleedV;
		if (s != undefined && (s != "" || s_old != undefined)) {
			bleedH = cell.style.borderLeftWidth == "2px";
			bleedV = cell.style.borderTopWidth == "2px";
			cell.style.cssText = "left:".concat(cell.style.left, ";width:",
					cell.style.width, ";height:", cell.style.height,
					";visibility:", cell.style.visibility, ";display:",
					cell.style.display, ";text-align:", cell.style.textAlign,
					";", s);
			if ((cell.style.borderLeftWidth == "2px") != bleedH) {
				cell.style.width = this._jutil.asSize(cws.getElemAt(col) - cwi
						- (bleedH ? 0 : 1))
			}
			if ((cell.style.borderTopWidth == "2px") != bleedV) {
				cell.style.height = bleedV ? "" : this._jutil.asSize(rhs
						.getElemAt(row)
						- rhi - 1)
			}
		}  
		if ("v" in obj) {
			switch (typeof obj.v) {
				case "number" :
					obj.v = (decSep = this._numericSeps[0]) == "."
							? "" + obj.v
							: ("" + obj.v).replace(".", decSep);
					break;
				case "boolean" :
					obj.v = this._l10nBool[obj.v];
					break
			}
		}
		if ("l" in obj) {
			var v = obj.o != "" ? obj.l : ("v" in obj ? obj.v : stor.getPart(x,
					y, "v"))
		} else {
			if ("v" in obj) {
				var v = comb && stor.hasPart(x, y, "l") ? undefined : obj.v;
			} else {
				var v = comb ? undefined : "";
			}
		}
		var t = "t" in obj ? obj.t : stor.getPart(x, y, "t");
	
		if (v != undefined) {
			if (t == "h") {
				cell.innerHTML = v
			} else {
				this._setText(cell, v)
			}
		}
		if (t
				&& ((s == undefined && (s_old == undefined || s_old
						.indexOf("text-align:") == -1)) || (s != undefined && s
						.indexOf("text-align:") == -1))
				&& cell.style.textAlign != this._jwstyle.defTextAlign[t]) {
			cell.style.textAlign = this._jwstyle.defTextAlign[t]
		}
		if (obj.m!=null&&"m" in obj) {
			if (obj.m[0] == true) {
				if (cell.className.indexOf("mergedCell") == -1) {
					cell.className += " mergedCell"
				}
				for (var sum = 0, max = obj.m[2], i = 0; i < max; sum += cws
						.getElemAt(col + i++)) {
				}
				cell.style.width = this._jutil.asSize(sum - cwi);
				for (var sum = 0, max = obj.m[1], i = 0; i < max; sum += rhs
						.getElemAt(row + i++)) {
				}
				cell.style.height = this._jutil.asSize(sum - rhi)
			} else {
				if (cell.className.indexOf("mergedCell") != -1) {
					cell.className = cell.className.replace("mergedCell", "");
					cell.style.width = this._jutil.asSize(cws.getElemAt(col)
							- cwi);
					cell.style.height = ""
				}
			}
		} else {
			if (!comb && cell.className.indexOf("mergedCell") != -1) {
				cell.className = cell.className.replace("mergedCell", "");
				cell.style.width = this._jutil.asSize(cws.getElemAt(col) - cwi);
				cell.style.height = ""
			}
		}
		if (obj.m!=null&&"m" in obj) {
			if (obj.m[0] == false) {
				if (cell.style.visibility != "hidden") {
					cell.style.visibility = "hidden"
				}
			} else {
				if (cell.style.visibility == "hidden") {
					cell.style.visibility = ""
				}
			}
		} else {
			if (!comb && cell.style.visibility == "hidden") {
				cell.style.visibility = ""
			}
		}
		if (!this._gmode_edit && ((obj.k!=null&&"k" in obj) || !comb)
				&& obj.k != stor.getPart(x, y, "k")) {
			if (obj.k == false) {
				cell.className += " gridCellUnlocked"
			} else {
				cell.className = cell.className.replace("gridCellUnlocked", "")
			}
		}
		this._storage.set(x, y, obj, comb)
	},
	getNeighByOffset : function(col, row, offx, offy) {
		col = this._colWidths.getIdxByOffset(col, offx);
		row = this._rowHeights.getIdxByOffset(row, offy);
		return [col, row, this.getCellByCoords(col, row)]
	},
	isCellVisible : function(col, row) {
		return col >= this._lastDestCell[0] + 1
				&& col <= this._lastDestCell[0] + this._cppi[0]
				&& row >= this._lastDestCell[1] + 1
				&& row <= this._lastDestCell[1] + this._cppi[1]
	},
	isCellLocked : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "k") !== false
	},
	getCellDims : function(col, row) {
		return [this._colWidths.getElemAt(col), this._rowHeights.getElemAt(row)]
	},
	getCell : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1])
	},
	getCellValue : function(col, row) {
		col -= this._currTopCell[0];
		row -= this._currTopCell[1];
		if (col < 0 || col >= this._numCols || row < 0 || row >= this._numRows) {
			return undefined
		}
		return this._storage.hasPart(col, row, "l") ? this._storage.getPart(
				col, row, "l") : this._storage.getPart(col, row, "v")
	},
	getCellFVal : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "l")
	},
	getCellUVal : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "v")
	},
	getCellFormula : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "f")
	},
	getCellNFs : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "n")
	},
	getCellType : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "t")
	},
	getCellStyle : function(col, row) {
		return this._storage.fetch(col - this._currTopCell[0], row
						- this._currTopCell[1], "s")
	},
	setCellValue : function(col, row, val) {
		if (typeof val != "string") {
			return false
		}
		var table=dev.report.model.report.tabMap;
		
		if(table.expandedRowCount<row) table.expandedRowCount=row;
		if(table.expandedColumnCount<col) table.expandedColumnCount=col;


		var cb = true, x = col - this._currTopCell[0], y = row
				- this._currTopCell[1];
		if (val[0] == "=") {
			
		/*	this._conn.ccmdSetBuff([["cdrn", {
						cm : true
					}, [col, row, col, row, {
								v : val
							}]]])*/
		} else {
			var quo = {
				n : "",
				s : '"'
			}, v = this._storage.fetch(x, y, "o") == "general;@" ? {
				v : val,
				t : "s"
			} : this._jwgen.str2var(val), f = this._storage.fetch(x, y, "f"), match, cell_old;
			if (!this._gmode_edit) {
				quo.e = ""
			}
			if ("str" in v) {
				val = v.str
			}
			if (v.t in quo && f != undefined
					&& (match = f.match(this._jwfrml.re_paloData)) !== null) {
				var splash = this._l10nBool[false];
				switch (v.t) {
					case "n" :
						v.v = v.l10n;
						break;
					case "s" :
						v.v = v.v.replace(/"/g, '""');
						break;
					case "e" :
						v.v = this._storage.fetch(x, y, "t") == "n"
								? (splash = this._l10nBool[true], 0)
								: '""';
						break
				}
			} else {
				if (f != undefined
						&& (match = f.match(this._jwfrml.re_var)) !== null) {
					var off = typeof v.v != "string" || v.v.charAt(0) != "'"
							? 0
							: 1;
				/*	this._conn.ccmdSetBuff([["svar", match[1],
							v.v.substring(off), !off]])*/
				} else {
					cell_old = (cell_old = this._storage.fetch(x, y)) !== undefined
							? {
								v : cell_old.v,
								f : cell_old.f,
								s : cell_old.s,
								m : cell_old.m,
							//	l : cell_old.l,
								t : cell_old.t
							}
							: {};
					this.furnishCell(col, row, {
								v : val,
								t : cell_old.t ? cell_old.t : v.t,
								s : cell_old.s ? cell_old.s : v.s,
								//l : cell_old.l ? cell_old.l : v.l,
								m : cell_old.m ? cell_old.m : v.m,
								_pend : true
					}, false);  
					var table=dev.report.model.report.tabMap;
					var cell=table.getCell(col,row);
					cell.dataValue=v.v;
					//this.setCellValue_post(this,col,row,cell_old);
				//	cb = [this, this.setCellValue_post, col, row, cell_old]
				}
			}
		}
		var currentRow= table.getRow(row);
		if(currentRow.height==0) currentRow.height=table.defaultRowHeight;
		this._sheet.reSaveRange();
	},
	setCellValue_post : function(res, col, row, cell_old) {
		var x = col - this._currTopCell[0], y = row - this._currTopCell[1];
		if (this._storage.hasPart(x, y, "_pend")) {
			this.furnishCell(col, row, cell_old, true)
		}
	},
	setRangeValue : function(range, vals) {
		if (typeof vals != "object" || !("length" in vals)) {
			return false
		}
	/*	var cmd_range = [range[0], range[1], range[2], range[3]], cmd_post = [], seps = this._numericSeps, l10nBool = this._l10nBool, rePD = this._jwfrml.re_paloData, quo = {
			n : "",
			s : '"'
		}, x, y, val, v, f, match, splash;
		if (!this._gmode_edit) {
			quo.e = ""
		}
		for (var len = vals.length, col = range[0], row = range[1], i = 0; i < len; ++i) {
			val = vals[i];
			if (val[0] != "=") {
				x = col - this._currTopCell[0];
				y = row - this._currTopCell[1];
				v = this._storage.fetch(x, y, "o") == "general;@" ? {
					v : val,
					t : "s"
				} : this._jwgen.str2var(val);
				if (!this._gmode_edit
						&& this._storage.fetch(x, y, "k") != false) {
					cmd_range.push({})
				} else {
					if (v.t in quo
							&& (f = this._storage.fetch(x, y, "f")) != undefined
							&& (match = f.match(rePD)) !== null) {
						splash = l10nBool[false];
						switch (v.t) {
							case "n" :
								v.v = v.l10n;
								break;
							case "s" :
								v.v = v.v.replace(/"/g, '""');
								break;
							case "e" :
								v.v = this._storage.fetch(x, y, "t") == "n"
										? (splash = l10nBool[true], 0)
										: '""';
								break
						}
						cmd_range.push({
									v : "=PALO.SETDATA(UNFORMATTED(".concat(
											quo[v.t], v.v, quo[v.t], ")",
											seps[2], splash, seps[2], match[1],
											")")
								});
						cmd_post.push([col, row, col, row, {
									v : f
								}])
					} else {
						cmd_range.push({
									v : v.v
								})
					}
				}
			} else {
				cmd_range.push(this._gmode_edit ? {
					v : val
				} : {})
			}
			if (++col > range[2]) {
				++row, col = range[0]
			}
		}
		this._conn.ccmdSetBuff([["cdrn", {
					cm : true
				}, cmd_range]].concat(cmd_post.length ? [["cdrn", {
					cm : true
				}].concat(cmd_post)] : []));
		this._conn.ccmdFlush(true, true, this._conn.Q_VALUE
						| this._conn.Q_STYLE | this._conn.Q_FORMULA_WE
						| this._conn.Q_ATTRS | this._conn.Q_FMT_VAL
						| this._conn.Q_FMT | this._conn.Q_FORMULA_NF
						| this._conn.Q_LOCK)*/
	},
	setArrayFormula : function(range, val) {
		range.push(val);
		this._conn.ccmd(true, ["saf", range], true, this._conn.Q_VALUE
						| this._conn.Q_STYLE | this._conn.Q_FORMULA_WE
						| this._conn.Q_FMT_VAL | this._conn.Q_FMT
						| this._conn.Q_FORMULA_NF)
	},
	merge : function(range, isUnMerge) {
		var mi;
		if (range[0] == range[2]
				&& range[1] == range[3]
				&& (mi = this._storage.fetch(range[0] - this._currTopCell[0],
						range[1] - this._currTopCell[1], "m")) !== undefined
				&& mi[0] === true) {
			range[2] += mi[2] - 1, range[3] += mi[1] - 1
		}
		if (range[2] > this._sheet._farthestUsedCell[0]) {
			this._sheet._farthestUsedCell[0] = range[2]
		}
		if (range[3] > this._sheet._farthestUsedCell[1]) {
			this._sheet._farthestUsedCell[1] = range[3]
		}

		var table=dev.report.model.report.tabMap;
		var res=table.cellSpan(isUnMerge,range);
		
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
			this._merge_post(range,isUnMerge);
		}
		this._sheet.reSaveRange();
	},
	_merge_post : function( range, isUnMerge) {
		this._sheet._defaultSelection.set(new dev.report.gen.Point(range[0],
						range[1]), isUnMerge ? new dev.report.gen.Point(range[2],
						range[3]) : new dev.report.gen.Point(range[0], range[1]));
		this._sheet._defaultSelection.draw();
		if (isUnMerge) {
			this._sheet._defaultSelection.checkForUndoneMarkers(true);
			dev.report.base.general.setCurrentCoord()
		}
	},
	getMergeInfo : function(col, row) {
		var col1=col - this._currTopCell[0];
		var row1=row- this._currTopCell[1];
		var mi = this._storage.fetch(col1,row1, "m");
		if (typeof mi != "object") {
			return undefined
		}
		return mi[0] == true ? [true, mi[2], mi[1]] : [false, mi[2] + 1,
				mi[1] + 1]
	},
	getMergeState : function(range) {
		var x1 = range[0] - this._currTopCell[0], y1 = range[1]
				- this._currTopCell[1], x2 = range[2] - this._currTopCell[0], y2 = range[3]
				- this._currTopCell[1];
		if (x1 < 0 || x1 >= this._numCols || y1 < 0 || y1 >= this._numRows
				|| x2 < 0 || x2 >= this._numCols || y2 < 0
				|| y2 >= this._numRows) {
			return undefined
		}
		var mi = this._storage.fetch(x1, y1, "m"), c_mi;
		for (var y = y2; y >= y1; --y) {
			for (var x = x2; x >= x1; --x) {
				if (x == x1 && y == y1) {
					continue
				}
				c_mi = this._storage.fetch(x, y, "m");
				if (mi) {
					if (!c_mi || c_mi[0]) {
						return undefined
					}
					if (mi[0]) {
						if (c_mi[1] != range[1] - 1 || c_mi[2] != range[0] - 1) {
							return undefined
						}
					} else {
						if (mi[1] != c_mi[1] || mi[2] != c_mi[2]) {
							return undefined
						}
					}
				} else {
					if (c_mi) {
						return undefined
					}
				}
			}
		}
		return mi ? true : false
	},
	setCellStyle : function(col, row, style) {
		col -= this._currTopCell[0], row -= this._currTopCell[1];
		var cstyle = this.getCellByPos(col, row);
		if (cstyle == undefined) {
			return
		}
		cstyle = cstyle.style;
		for (var attr in style) {
			cstyle[attr] = style[attr].trim()
		}
		this._storage.setPart(col, row, style, "s")
	},
	setRangeStyle : function(range, style) {
		if (range[0] > this._maxCoords[0] || range[1] > this._maxCoords[1]
				|| range[2] < this._minCoords[0]
				|| range[3] < this._minCoords[1]) {
			return
		}
		var x1 = (range[0] >= this._minCoords[0]
				? range[0]
				: this._minCoords[0])
				- this._currTopCell[0], y1 = (range[1] >= this._minCoords[1]
				? range[1]
				: this._minCoords[1])
				- this._currTopCell[1], x2 = (range[2] <= this._maxCoords[0]
				? range[2]
				: this._maxCoords[0])
				- this._currTopCell[0], y2 = (range[3] <= this._maxCoords[1]
				? range[3]
				: this._maxCoords[1])
				- this._currTopCell[1];
		if (x1 < 0) {
			x1 = 0
		} else {
			if (x1 >= this._numCols) {
				x1 = this._numCols - 1
			}
		}
		if (y1 < 0) {
			y1 = 0
		} else {
			if (y1 >= this._numRows) {
				y1 = this._numRows - 1
			}
		}
		if (x2 < 0) {
			x2 = 0
		} else {
			if (x2 >= this._numCols) {
				x2 = this._numCols - 1
			}
		}
		if (y2 < 0) {
			y2 = 0
		} else {
			if (y2 >= this._numRows) {
				y2 = this._numRows - 1
			}
		}
		var cstyle;
		for (var y = y2; y >= y1; --y) {
			for (var x = x2; x >= x1; --x) {
				cstyle = this._tableMat[y][x].style;
				for (var attr in style) {
					cstyle[attr] = style[attr]
				}
				this._storage.setPart(x, y, style, "s")
			}
		}
	},
	getRangeStyle : function(range, attrs) {
		var x1 = range[0] - this._currTopCell[0], y1 = range[1]
				- this._currTopCell[1], x2 = range[2] - this._currTopCell[0], y2 = range[3]
				- this._currTopCell[1];
		if (x1 < 0 || x1 >= this._numCols || y1 < 0 || y1 >= this._numRows
				|| x2 < 0 || x2 >= this._numCols || y2 < 0
				|| y2 >= this._numRows) {
			return {}
		}
		var cstyle = this._tableMat[y1][x1].style;
		for (var attr in attrs) {
			attrs[attr] = cstyle[attr]
		}
		for (var tm = this._tableMat, y = y1; y <= y2; ++y) {
			for (var x = x1; x <= x2; ++x) {
				cstyle = tm[y][x].style;
				for (var attr in attrs) {
					if (cstyle[attr] != attrs[attr]) {
						delete attrs[attr]
					}
				}
			}
		}
		return attrs
	},
	setRangeFormat : function(range, fmt) {
		var mi;
		if (range[0] == range[2] && range[1] == range[3]
				&& (mi = this.getMergeInfo(range[0], range[1])) && mi[0]) {
			range[2] += mi[1] - 1, range[3] += mi[2] - 1
		}
		this._sheet.reSaveRange();
	/*	this._conn.ccmd(true, [
						"sfmt",
						[range[0], range[1], range[2], range[3], fmt.shift(),
								fmt]], true, this._conn.Q_VALUE
						| this._conn.Q_STYLE | this._conn.Q_ATTRS
						| this._conn.Q_FMT_VAL | this._conn.Q_FMT,
				this._conn.D_NONE)
		*/
	},
	getRangeFormat : function(range) {
		var x1 = range[0] - this._currTopCell[0], y1 = range[1]
				- this._currTopCell[1], x2 = range[2] - this._currTopCell[0], y2 = range[3]
				- this._currTopCell[1];
		if (x1 < 0 || x1 >= this._numCols || y1 < 0 || y1 >= this._numRows
				|| x2 < 0 || x2 >= this._numCols || y2 < 0
				|| y2 >= this._numRows) {
			return undefined
		}
		var fmt = [this._storage.getPart(x1, y1, "o")].concat(this._storage
				.getAttr(x1, y1, "o")), fmt_len = fmt.length;
		for (var y = y2; y >= y1; --y) {
			for (var c_fmt, x = x2; x >= x1; --x) {
				c_fmt = [this._storage.getPart(x, y, "o")].concat(this._storage
						.getAttr(x, y, "o"));
				if (c_fmt.length != fmt_len) {
					return undefined
				}
				for (var i = fmt_len - 1; i >= 0; --i) {
					if (c_fmt[i] != fmt[i]) {
						return undefined
					}
				}
			}
		}
		return fmt[0] != undefined ? fmt : undefined
	},
	setRangeLock : function(range, lock) {
		if (range[0] > this._maxCoords[0] || range[1] > this._maxCoords[1]
				|| range[2] < this._minCoords[0]
				|| range[3] < this._minCoords[1]) {
			return
		}
		var x1 = (range[0] >= this._minCoords[0]
				? range[0]
				: this._minCoords[0])
				- this._currTopCell[0], y1 = (range[1] >= this._minCoords[1]
				? range[1]
				: this._minCoords[1])
				- this._currTopCell[1], x2 = (range[2] <= this._maxCoords[0]
				? range[2]
				: this._maxCoords[0])
				- this._currTopCell[0], y2 = (range[3] <= this._maxCoords[1]
				? range[3]
				: this._maxCoords[1])
				- this._currTopCell[1];
		if (x1 < 0) {
			x1 = 0
		} else {
			if (x1 >= this._numCols) {
				x1 = this._numCols - 1
			}
		}
		if (y1 < 0) {
			y1 = 0
		} else {
			if (y1 >= this._numRows) {
				y1 = this._numRows - 1
			}
		}
		if (x2 < 0) {
			x2 = 0
		} else {
			if (x2 >= this._numCols) {
				x2 = this._numCols - 1
			}
		}
		if (y2 < 0) {
			y2 = 0
		} else {
			if (y2 >= this._numRows) {
				y2 = this._numRows - 1
			}
		}
		this._storage.setRangePart(x1, y1, x2, y2, lock, "k")
	},
	getRangeLock : function(range) {
		var x1 = range[0] - this._currTopCell[0], y1 = range[1]
				- this._currTopCell[1], x2 = range[2] - this._currTopCell[0], y2 = range[3]
				- this._currTopCell[1];
		if (x1 < 0 || x1 >= this._numCols || y1 < 0 || y1 >= this._numRows
				|| x2 < 0 || x2 >= this._numCols || y2 < 0
				|| y2 >= this._numRows) {
			return undefined
		}
		var lock = this._storage.fetch(x1, y1, "k") !== false;
		for (var y = y2; y >= y1; --y) {
			for (var c_lock, x = x2; x >= x1; --x) {
				c_lock = this._storage.fetch(x, y, "k") !== false;
				if (c_lock != lock) {
					return undefined
				}
			}
		}
		return lock
	},
	getCoordsFirstVCell : function() {
		return [this._lastDestCell[0] + 1, this._lastDestCell[1] + 1]
	},
	getCoordsLastVCell : function() {
		return [this._lastDestCell[0] + this._cppi[0],
				this._lastDestCell[1] + this._cppi[1]]
	},
	getVisibleRange : function(type) {
		return [this._lastDestCell[type] + 1,
				this._lastDestCell[type] + this._cppi[type]]
	},
	getVirtScroll : function() {
		var ctc = this._currTopCell;
		return ctc.concat(ctc[0] + this._numCols - 1, ctc[1] + this._numRows
						- 1)
	},
	getVirtSize : function(type, noCache) {
		var virtSize = this._virtSize[type], fsc = this._farthestSeenCell[type];
		if (noCache || virtSize.num != fsc) {
			var crd = this._sheet._colRowDims[type], ocSize = type
					? this._ocHeight
					: this._ocWidth, max = this._maxCoords[type], edc = fsc + 2, size;
			if (edc > max) {
				size = crd.getDef() * (edc - max), edc = max
			} else {
				size = 0
			}
			while (size <= ocSize) {
				size += crd.getElemAt(edc--)
			}
			virtSize.num = fsc;
			virtSize.sum = crd.getSumUpTo(fsc + 1, this._minCoords[type]);
			virtSize.edc = edc
		}
		return virtSize
	},
	getViewportSize : function() {
		return [this._ocWidth, this._ocHeight]
	},
	getViewportPos : function() {
		return [
				[this._oc.scrollLeft, this._oc.scrollTop],
				[this._oc.scrollLeft + this._ocWidth,
						this._oc.scrollTop + this._ocHeight]]
	},
	getFarthestUsedCell : function() {
		return [this._sheet._farthestUsedCell[0],
				this._sheet._farthestUsedCell[1]]
	},
	pasteRange : function(cb, range, clip_id, paste_what) {
		if (typeof paste_what != "number") {
			paste_what = dev.report.base.range.ContentType.ALL_PASTE
		}
		range.unshift(clip_id);
		range.push(paste_what);

		var table=dev.report.model.report.tabMap;
		var res=table.paste("ptrn",range);
		
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this._sheet.reSaveRange();
	},
	clrCell : function(col, row) {
		var x = col - this._currTopCell[0], y = row - this._currTopCell[1], f = this._storage
				.fetch(x, y, "f"), match;
	/*	this._conn.ccmdBuffer();
		if (f != undefined
				&& (match = f.match(this._jwfrml.re_paloData)) !== null) {
			if (this._storage.fetch(x, y, "t") == "n") {
				var v = 0, splash = true
			} else {
				var v = '""', splash = false
			}
			this._conn.ccmd(null, ["cdrn", {
								cm : true
							}, [col, row, col, row, {
								v : "=PALO.SETDATA(".concat(v,
										this._numericSeps[2],
										this._l10nBool[splash],
										this._numericSeps[2], match[1], ")")
							}], [col, row, col, row, {
										v : f
									}]])
		} else {
			this._conn.ccmd(null, ["clr", [1, col, row, col, row]])
		}
		this._conn.ccmdFlush(true, true)
		*/
	},
	clrRange : function(range, clr_what) {
		if (typeof clr_what != "number") {
			clr_what = 1
		}
		range.unshift(clr_what);
		var table=dev.report.model.report.tabMap;
		var res=table.clear(range);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this._sheet.reSaveRange();
	},
	cbFire : function(col, row, attr_name, params) {
		col -= this._currTopCell[0];
		row -= this._currTopCell[1];
		if (col < 0 || col >= this._numCols || row < 0 || row >= this._numRows) {
			return false
		}
		var args = this._storage.getAttr(col, row, attr_name), cb;
		if (args == undefined
				|| (cb = this._jwgrid.cbGet(args[0])) == undefined) {
			return true
		}
		return cb[1].apply(cb[0], [params].concat(args.slice(1)))
	},
	isInsideRange : function(col, row) {
		var rng = this._conf.range;
		return col >= rng[0] && col <= rng[2] && row >= rng[1] && row <= rng[3]
	},
	hasFullSize : function() {
		var defMaxCoords = dev.report.base.grid.defMaxCoords, rng = this._conf.range;
		return rng[0] == 1 && rng[1] == 1 && rng[2] == defMaxCoords[0]
				&& rng[3] == defMaxCoords[1]
	},
	getIC : function() {
		return this._ic
	},
	getDomId : function() {
		return this._domId
	}
};