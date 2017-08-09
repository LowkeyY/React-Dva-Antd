
Ext.namespace("dev.report.base.grid");
using("dev.report.base.grid.Scrollbar");
using("dev.report.base.grid.VertScrollbar");
using("dev.report.base.grid.HorizScrollbar");
dev.report.base.grid.Sheet = function(cb, book, uid) {
	this._initted = false;
	this._book = book;
	this.holder = book.holder;
	this._uid = uid;
	this._id = book._sheetCnt++;
	this._domId = book._domId.concat("S", this._id);
	this.dom = document.createElement("div");
	this._scrollReg = [this._hScrollReg = {}, this._vScrollReg = {}];
	this._els = {};

	this._elZIdx = dev.report.base.wsel.wselRegistry.startZIdx - 1;
	this._cmnts = {};
	this._cmntMoveCCoord = [-1, -1];
	this._initReg = {
		chart : {
			c : -1,
			l : -1,
			cnv : false
		},
		img : {
			c : -1,
			l : -1,
			cnv : false
		},
		formel : {
			c : -1,
			l : -1,
			cnv : false
		},
		widget : {
			c : -1,
			l : -1,
			cnv : false
		},
		hb : {
			c : -1,
			l : -1,
			cnv : false
		},
		cmnt : {
			c : -1,
			l : -1,
			cnv : false
		}
	};
	this._viewMode = dev.report.base.app.appMode;
	this._app = dev.report.base.app;
	this._jwgrid = dev.report.base.grid;
	this._jwstyle = dev.report.base.style;
	this._conn = dev.report.backend;
	this._cellSizeIncr = this._jwgrid.defCellSizeIncr;
	this._setText = dev.report.util.setText;
	this._n2l = dev.report.base.app.numberToLetter;
	this._gmode_edit = book._gmode_edit;
	this._defMaxCoords = [this._jwgrid.defMaxCoords[0],
			this._jwgrid.defMaxCoords[1]];
	this._unlck = [];
	this._hasUnlck = false;
	this._realUnlck = [this._defMaxCoords[0], this._defMaxCoords[1], 1, 1];
	this._app.activeSheet = book._aSheet = this;

	using("dev.report.base.app.Environment");
	this._env = new dev.report.base.app.Environment();
	dev.report.base.app.environment = this._env.shared;
	this._env.shared.viewMode = this._viewMode

	var table=dev.report.model.report.tabMap;

	var defaultHeight=table.defaultRowHeight;
	var defaultWidth=table.defaultColumnWidth;

	var expandedColumnCount=table.expandedColumnCount;
	var expandedRowCount=table.expandedRowCount;
	
	var widthArr=[];
	var heightArr=[];
	
	var rows=table.getRowObject();
	var columns=table.getColumnObject();
	for(var i in columns){
		widthArr.push(i-1);
		widthArr.push(columns[i].width);
	}
	for(var i in rows){
		heightArr.push(i-1);
		heightArr.push(rows[i].height);
	}
	var widthStr=widthArr.join(',');
	var heightStr=heightArr.join(','); 

	var resString='[[true,['+defaultWidth+','+defaultHeight+']],[true,['+widthStr+']],[true,['+heightStr+']],[true,['+expandedColumnCount+','+expandedRowCount+',false,false]],[true,[]],[true,[]]]';


	var res=Ext.decode(resString);
	this._init_post(res,cb);
};
dev.report.base.grid.Sheet.prototype = {
	_SCROLL_HORIZ : 0,
	_SCROLL_VERT : 1,
	_HDRS_WIDTH : 41,
	_HDRS_HEIGHT : 19,
	_init_post : function(res, cb) {
		var that = this;
		if (res[0][0] !== true || res[1][0] !== true || res[2][0] !== true
				|| res[3][0] !== true || res[4][0] !== true
				|| res[5][0] !== true) {
			return
		}
		using("dev.report.gen.SparseVector");
		this._defColRowDims = res[0][1], this._colRowDims = [
				this._colWidths = new dev.report.gen.SparseVector(
						this._defMaxCoords[0], this._defColRowDims[0]),
				this._rowHeights = new dev.report.gen.SparseVector(
						this._defMaxCoords[1], this._defColRowDims[1])];


	
		var incr = this._cellSizeIncr[0];
		for (var w, col_ws = res[1][1], len = col_ws.length, i = 0; i < len; i += 2) {
			this._colWidths.setElemAt(col_ws[i] + 1,
					(w = col_ws[i + 1]) >= incr ? w : 0)
		}
		incr = this._cellSizeIncr[1];
		for (var h, row_hs = res[2][1], len = row_hs.length, i = 0; i < len; i += 2) {
			this._rowHeights.setElemAt(row_hs[i] + 1,
					(h = row_hs[i + 1]) >= incr ? h : 0)
		}
		this._setReach(res[3][1]);

		if (res[4][1].length) {
			this._paneConfUid = res[4][1][0].e_id;
			this._crosshairs = res[4][1][0].crosshairs;
			this._paneConf = res[4][1][0].panes
		} else {
			this._paneConfUid = null;
			this._crosshairs = [0, 0];
			this._paneConf = [{
						range : [1, 1, this._defMaxCoords[0],
								this._defMaxCoords[1]],
						pos : {
							c : 1,
							r : 1
						},
						hscroll : true,
						vscroll : true
					}]
		}
		this._numPanes = this._paneConf.length;
		for (var pos, i = this._numPanes - 1; i >= 0; --i) {
			pos = this._paneConf[i].pos;
			pos.l = this._colWidths.getSumUpTo(pos.c);
			pos.t = this._rowHeights.getSumUpTo(pos.r)
		}
		this._setUnlockRange(res[5][1]);
		this._genContentEl();
		if (this._gmode_edit) {
			this._colHdrsOC0 = document.getElementById(this._domId
					+ "_colHdrsOC0");
			this._colHdrsIC0 = document.getElementById(this._domId
					+ "_colHdrsIC0");
			this._rowHdrsOC0 = document.getElementById(this._domId
					+ "_rowHdrsOC0");
			this._rowHdrsIC0 = document.getElementById(this._domId
					+ "_rowHdrsIC0");
			var p0Conf = this._paneConf[0];
			this._colHdrsOC0.scrollLeft = p0Conf.pos.l;
			this._rowHdrsOC0.scrollTop = p0Conf.pos.t;
			this._hdrsICs0 = [this._colHdrsIC0, this._rowHdrsIC0];
			this._hdrsICs1 = [];
			this._hdrClss = ["gridColHdr", "gridRowHdr"];
			if (this._crosshairs[0]) {
				this._colHdrsOC0.style.width = "".concat(p0Conf.coords.w, "px");
				this._colHdrsOC1 = document.getElementById(this._domId
						+ "_colHdrsOC1");
				this._colHdrsIC1 = document.getElementById(this._domId
						+ "_colHdrsIC1");
				this._hdrsICs1[0] = this._colHdrsIC1;
				this._colHdrsOC1.style.borderLeft = "1px solid #000000";
				this._colHdrsOC1.scrollLeft = this._paneConf[1].pos.l
			}
			if (this._crosshairs[1]) {
				this._rowHdrsOC0.style.height = ""
						.concat(p0Conf.coords.h, "px");
				this._rowHdrsOC1 = document.getElementById(this._domId
						+ "_rowHdrsOC1");
				this._rowHdrsIC1 = document.getElementById(this._domId
						+ "_rowHdrsIC1");
				this._hdrsICs1[1] = this._rowHdrsIC1;
				this._rowHdrsOC1.style.borderTop = "1px solid #000000";
				this._rowHdrsOC1.scrollTop = this._paneConf[this._crosshairs[0]
						? 2
						: 1].pos.t
			}
			this._activeHdrsAll = [false, false];
			this._colHdrs0 = [];
			this._rowHdrs0 = [];
			this._hdrArrs0 = [this._colHdrs0, this._rowHdrs0];
			this._activeHdrs_o0 = [{}, {}];
			this._activeHdrs_a0 = [[], []];
			for (var ch = this._colHdrs0, hdrs = this._colHdrsIC0
					.getElementsByTagName("div"), i = this._numCols0 - 1; i >= 0; --i) {
				ch[i] = hdrs[i]
			}
			for (var rh = this._rowHdrs0, hdrs = this._rowHdrsIC0
					.getElementsByTagName("div"), i = this._numRows0 - 1; i >= 0; --i) {
				rh[i] = hdrs[i]
			}
			this._colHdrsIC0.onmousemove = function(ev) {
				dev.report.base.mouse.checkForResize(ev, that)
			};
			this._colHdrsIC0.onmousedown = function(ev) {
				that._defaultSelection.selectOrResize(ev);

				document.body.onselectstart = dev.report.util.ignoreEvent
			};
			this._colHdrsIC0.ondblclick = dev.report.base.mouse.autoSizeCell;
			this._rowHdrsIC0.onmousemove = function(ev) {
				dev.report.base.mouse.checkForResize(ev, that)
			};
			this._rowHdrsIC0.onmousedown = function(ev) {
				that._defaultSelection.selectOrResize(ev);
				document.body.onselectstart = dev.report.util.ignoreEvent
			};
			this._rowHdrsIC0.ondblclick = dev.report.base.mouse.autoSizeCell;
			this._hdrArrs1 = [];
			this._activeHdrs_o1 = [{}, {}];
			this._activeHdrs_a1 = [[], []];
			if (this._crosshairs[0]) {
				this._colHdrs1 = [];
				this._hdrArrs1[0] = this._colHdrs1;
				for (var ch = this._colHdrs1, hdrs = this._colHdrsIC1
						.getElementsByTagName("div"), i = this._numCols1 - 1; i >= 0; --i) {
					ch[i] = hdrs[i]
				}
				this._colHdrsIC1.onmousemove = function(ev) {
					dev.report.base.mouse.checkForResize(ev, that)
				};
				this._colHdrsIC1.onmousedown = function(ev) {
					that._defaultSelection.selectOrResize(ev);
					document.body.onselectstart = dev.report.util.ignoreEvent
				};
				this._colHdrsIC1.ondblclick = dev.report.base.mouse.autoSizeCell
			}
			if (this._crosshairs[1]) {
				this._rowHdrs1 = [];
				this._hdrArrs1[1] = this._rowHdrs1;
				for (var rh = this._rowHdrs1, hdrs = this._rowHdrsIC1
						.getElementsByTagName("div"), i = this._numRows1 - 1; i >= 0; --i) {
					rh[i] = hdrs[i]
				}
				this._rowHdrsIC1.onmousemove = function(ev) {
					dev.report.base.mouse.checkForResize(ev, that)
				};
				this._rowHdrsIC1.onmousedown = function(ev) {
					that._defaultSelection.selectOrResize(ev);
					document.body.onselectstart = dev.report.util.ignoreEvent
				};
				this._rowHdrsIC1.ondblclick = dev.report.base.mouse.autoSizeCell
			}
			document.getElementById(this._domId + "_gridSelectAll").onmousedown = function(
					ev) {
				that._defaultSelection.markAllCells(ev)
			};
			document.body.onmouseup = function() {
				document.body.onselectstart = dev.report.util.unignoreEvent
			}
		} else {
			this._activeHdrs_o0 = [[], []];
			this._activeHdrs_a0 = [[], []];
			this._activeHdrs_o1 = [[], []];
			this._activeHdrs_a1 = [[], []]
		}
		this._rngColsRows0 = [this._rngCols0, this._rngRows0];
		this._rngColsRows1 = [this._rngCols1, this._rngRows1];
		this._paneOCs = [];
		this._panes = [];

		using("dev.report.base.grid.Pane");
	//	var batch = new dev.report.backend.CCmdAsyncBatch(false, true);
		for (var paneOC, pane, conf, i = this._numPanes - 1; i >= 0; --i) {
			this["_paneOC".concat(i)] = this._paneOCs[i] = paneOC = document
					.getElementById(this._domId.concat("P", i, "_OC"));

			this._panes[i] = pane = new dev.report.base.grid.Pane(this, i, paneOC,
					null);
			conf = this._paneConf[i];
			if (conf.hscroll) {
				this._regPane(this._hScrollReg, conf.coords.x, pane)
			}
			if (conf.vscroll) {
				this._regPane(this._vScrollReg, conf.coords.y, pane)
			}
		}
		this._initFloatEl(cb)
		this._setupScroll();
		this._initted = true
	},
	_initFloatEl : function(cb) {
		if (this._gmode_edit) {
			var col = this._paneConf[0].pos.c, row = this._paneConf[0].pos.r;

			using("dev.report.base.grid.DefaultSelection");
			using("dev.report.base.grid.FormulaSelection");
			using("dev.report.base.grid.CopySelection");
			using("dev.report.base.grid.AutoScroll");
			this._env.shared.defaultSelection = this._defaultSelection = new dev.report.base.grid.DefaultSelection(
					new dev.report.gen.Point(col, row), this);
			this._env.shared.formulaSelection = this._formulaSelection = new dev.report.base.grid.FormulaSelection(
					new dev.report.gen.Point(col, row), this);
			this._env.shared.copySelection = this._copySelection = new dev.report.base.grid.CopySelection(
					new dev.report.gen.Point(col, row), this);
			this._defaultSelection.selectFirstVisCell();
			this._defaultSelection.getCursorField().refresh();
			this._env.shared.autoScroll = this._autoScroll = new dev.report.base.grid.AutoScroll(this)
		} else {
			using("dev.report.base.grid.CursorField");
			this._cursorField = new dev.report.base.grid.CursorField(this._domId,
					this)
		}
		//this._conn.ccmdBuffer(true);
		dev.report.base.general.createWorksheetElements(this);
		dev.report.base.wsel.img.loadAll(this);
		dev.report.base.wsel.loadAll(this);
		//dev.report.base.cmnt.loadAll(this);
		dev.report.base.hb.loadAll(this);
	},
	_notifyAfterInit : function() {
		if (dev.report.base.env.isDesigner && this.isConverted()) {
			dev.report.base.general.showMsg("loadWS_convTitle".localize(),
					"loadWS_hasConversion".localize(), Ext.MessageBox.INFO)
		}
		try {
			for (var triggers = dev.report.base.events.triggers.refreshLayout, i = triggers.length
					- 1; i >= 0; i--) {
				triggers[i][0]["refreshLayout"].call(parent, triggers[i][1])
			}
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	},
	isLoaded : function(cb) {
		for (var type in this._initReg) {
			if (this._initReg[type].c < 0
					|| this._initReg[type].c > this._initReg[type].l) {
				return false
			}
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
		return true
	},
	setInitReg : function(type, cnt) {
		this._initReg[type] = {
			c : cnt,
			l : 0,
			cnv : false
		};
		if (!cnt) {
			this.isLoaded([this, this._notifyAfterInit])
		}
	},
	setInitConv : function(type, cnv) {
		this._initReg[type].cnv = cnv
	},
	isConverted : function() {
		for (var type in this._initReg) {
			if (this._initReg[type].cnv) {
				return true
			}
		}
		return false
	},
	updInitReg : function(type) {
		this._initReg[type].l++;
		this.isLoaded([this, this._notifyAfterInit])
	},
	_setReach : function(data) {
		if (!(data instanceof Array) || typeof data[0] != "number"
				|| typeof data[1] != "number") {
			data = [1, 1, false, false]
		}
		this._farthestUsedCell = [data[0], data[1]];
		this._contentReach = [data[2] ? this._defMaxCoords[0] : data[0],
				data[3] ? this._defMaxCoords[1] : data[1]]
	},
	_genContentEl : function() {
		if (this._gmode_edit) {
			var hdrsWidth = this._HDRS_WIDTH, hdrsHeight = this._HDRS_HEIGHT, html = [
					'<div id="', this._domId,
					'_gridSelectAll" class="gridSelectAll"></div>'];
			var decr = this._cellSizeIncr[0];
			if (this._crosshairs[0]) {
				html.push('<div id="', this._domId,
						'_colHdrsOC0" class="gridColHdrsOC" style="left:',
						hdrsWidth, 'px;"><div id="', this._domId,
						'_colHdrsIC0" class="gridColHdrsIC">');
				if (this._crosshairs[2]) {
					for (var w, xtra_c = 2, pos = this._paneConf[0].pos, c = pos.c, l = pos.l, l_max = l
							+ this._crosshairs[0]; l <= l_max || xtra_c--; ++c, l += w) {
						html.push('<div class="gridColHdr" style="left:', l,
								"px;", ((w = this._colWidths.getElemAt(c))
										? "width:".concat(w - decr, "px;")
										: "display:none;"), '">', this._n2l[c],
								"</div>")
					}
					var colsOffset = this._crosshairs[0];
					this._numCols0 = c - pos.c
				} else {
					for (var w, cols = this._crosshairs[0], pos = this._paneConf[0].pos, c = pos.c, l = pos.l, i = 0; i < cols; ++i, ++c, l += w) {
						html.push('<div class="gridColHdr" style="left:', l,
								"px;", ((w = this._colWidths.getElemAt(c))
										? "width:".concat(w - decr, "px;")
										: "display:none;"), '">', this._n2l[c],
								"</div>")
					}
					var colsOffset = l - pos.l;
					this._numCols0 = cols
				}
				html.push("</div></div>");
				this._rngCols0 = [this._paneConf[0].range[0],
						this._paneConf[0].range[2]];
				var colPaneId = 1
			} else {
				var colPaneId = 0, colsOffset = 0
			}
			var colsSize = this._book._sheetsOCWidth - hdrsWidth - colsOffset;
			html.push('<div id="', this._domId, "_colHdrsOC", colPaneId,
					'" class="gridColHdrsOC" style="left:', colsOffset
							+ hdrsWidth, "px;width:", colsSize,
					'px;"><div id="', this._domId, "_colHdrsIC", colPaneId,
					'" class="gridColHdrsIC">');
			for (var w, xtra_c = 2, pos = this._paneConf[colPaneId].pos, c = pos.c, l = pos.l, l_max = l
					+ colsSize; l <= l_max || xtra_c--; ++c, l += w) {
				html.push('<div class="gridColHdr" style="left:', l, "px;",
						((w = this._colWidths.getElemAt(c)) ? "width:".concat(w
										- decr, "px;") : "display:none;"),
						'">', this._n2l[c], "</div>")
			}
			html.push("</div></div>");
			this["_numCols".concat(colPaneId)] = c - pos.c;
			this["_rngCols".concat(colPaneId)] = [
					this._paneConf[colPaneId].range[0],
					this._paneConf[colPaneId].range[2]];
			decr = this._cellSizeIncr[1];
			if (this._crosshairs[1]) {
				html.push('<div id="', this._domId,
						'_rowHdrsOC0" class="gridRowHdrsOC" style="top:',
						hdrsHeight, 'px;"><div id="', this._domId,
						'_rowHdrsIC0" class="gridRowHdrsIC">');
				if (this._crosshairs[2]) {
					for (var h, xtra_r = 2, pos = this._paneConf[0].pos, r = pos.r, t = pos.t, t_max = t
							+ this._crosshairs[1]; t <= t_max || xtra_r--; ++r, t += h) {
						html.push('<div class="gridRowHdr" style="top:', t,
								"px;", ((h = this._rowHeights.getElemAt(r))
										? "height:".concat(h - decr, "px;")
										: "display:none;"), '">', r, "</div>")
					}
					var rowsOffset = this._crosshairs[1];
					this._numRows0 = r - pos.r
				} else {
					for (var h, rows = this._crosshairs[1], pos = this._paneConf[0].pos, r = pos.r, t = pos.t, i = 0; i < rows; ++i, ++r, t += h) {
						html.push('<div class="gridRowHdr" style="top:', t,
								"px;", ((h = this._rowHeights.getElemAt(r))
										? "height:".concat(h - decr, "px;")
										: "display:none;"), '">', r, "</div>")
					}
					var rowsOffset = t - pos.t;
					this._numRows0 = rows
				}
				html.push("</div></div>");
				this._rngRows0 = [this._paneConf[0].range[1],
						this._paneConf[0].range[3]];
				var rowPaneId = 1
			} else {
				var rowPaneId = 0, rowsOffset = 0
			}
			var rowsSize = this._book._sheetsOCHeight - hdrsHeight - rowsOffset;
			html.push('<div id="', this._domId, "_rowHdrsOC", rowPaneId,
					'" class="gridRowHdrsOC" style="top:', rowsOffset
							+ hdrsHeight, "px;height:", rowsSize,
					'px;"><div id="', this._domId, "_rowHdrsIC", rowPaneId,
					'" class="gridRowHdrsIC">');
			for (var h, xtra_r = 2, pos = this._paneConf[rowPaneId + colPaneId].pos, r = pos.r, t = pos.t, t_max = t
					+ rowsSize; t <= t_max || xtra_r--; ++r, t += h) {
				html.push('<div class="gridRowHdr" style="top:', t, "px;",
						((h = this._rowHeights.getElemAt(r)) ? "height:"
								.concat(h - decr, "px;") : "display:none;"),
						'">', r, "</div>")
			}
			html.push("</div></div>");
			this["_numRows".concat(rowPaneId)] = r - pos.r;
			this["_rngRows".concat(rowPaneId)] = [
					this._paneConf[rowPaneId + colPaneId].range[1],
					this._paneConf[rowPaneId + colPaneId].range[3]]
		} else {
			var hdrsWidth = 0, hdrsHeight = 0, html = [];
			if (this._crosshairs[0]) {
				if (this._crosshairs[2]) {
					for (var xtra_c = 2, colsOffset = this._crosshairs[0], pos = this._paneConf[0].pos, c = pos.c, l = 0; l <= colsOffset
							|| xtra_c--; l += this._colWidths.getElemAt(c++)) {
					}
					this._numCols0 = c - pos.c
				} else {
					for (var cols = this._crosshairs[0], colsOffset = 0, c = this._paneConf[0].pos.c, i = 0; i < cols; ++i, colsOffset += this._colWidths
							.getElemAt(c++)) {
					}
					this._numCols0 = cols
				}
				var colPaneId = 1
			} else {
				var colPaneId = 0, colsOffset = 0
			}
			var colsSize = this._book._sheetsOCWidth - hdrsWidth - colsOffset;
			for (var xtra_c = 2, pos = this._paneConf[colPaneId].pos, c = pos.c, l = 0; l <= colsSize
					|| xtra_c--; l += this._colWidths.getElemAt(c++)) {
			}
			this["_numCols".concat(colPaneId)] = c - pos.c;
			if (this._crosshairs[1]) {
				if (this._crosshairs[2]) {
					for (var xtra_r = 2, rowsOffset = this._crosshairs[1], pos = this._paneConf[0].pos, r = pos.r, t = 0; t <= rowsOffset
							|| xtra_r--; t += this._rowHeights.getElemAt(r++)) {
					}
					this._numRows0 = r - pos.r
				} else {
					for (var rows = this._crosshairs[1], rowsOffset = 0, r = this._paneConf[0].pos.r, i = 0; i < rows; ++i, rowsOffset += this._rowHeights
							.getElemAt(r++)) {
					}
					this._numRows0 = rows
				}
				var rowPaneId = 1
			} else {
				var rowPaneId = 0, rowsOffset = 0
			}
			var rowsSize = this._book._sheetsOCHeight - hdrsHeight - rowsOffset;
			for (var xtra_r = 2, pos = this._paneConf[rowPaneId + colPaneId].pos, r = pos.r, t = 0; t <= rowsSize
					|| xtra_r--; t += this._rowHeights.getElemAt(r++)) {
			}
			this["_numRows".concat(rowPaneId)] = r - pos.r
		}
		if (this._crosshairs[0] && this._crosshairs[1]) {
			this._paneConf[0].coords = {
				l : hdrsWidth,
				t : hdrsHeight,
				w : colsOffset,
				h : rowsOffset,
				x : 0,
				y : 0
			};
			this._paneConf[1].coords = {
				l : colsOffset + hdrsWidth,
				t : hdrsHeight,
				w : colsSize,
				h : rowsOffset,
				x : 1,
				y : 0
			};
			this._paneConf[2].coords = {
				l : hdrsWidth,
				t : rowsOffset + hdrsHeight,
				w : colsOffset,
				h : rowsSize,
				x : 0,
				y : 1
			};
			this._paneConf[3].coords = {
				l : colsOffset + hdrsWidth,
				t : rowsOffset + hdrsHeight,
				w : colsSize,
				h : rowsSize,
				x : 1,
				y : 1
			};
			if (this._gmode_edit) {
				this._paneConf[1].customCSS = "border-left:1px solid #000000;";
				this._paneConf[2].customCSS = "border-top:1px solid #000000;";
				this._paneConf[3].customCSS = "border-top:1px solid #000000;border-left:1px solid #000000;"
			}
			this._panesByXY = [[0, 1], [0, 2]]
		} else {
			if (this._crosshairs[0]) {
				this._paneConf[0].coords = {
					l : hdrsWidth,
					t : hdrsHeight,
					w : colsOffset,
					h : rowsSize,
					x : 0,
					y : 0
				};
				this._paneConf[1].coords = {
					l : colsOffset + hdrsWidth,
					t : hdrsHeight,
					w : colsSize,
					h : rowsSize,
					x : 1,
					y : 0
				};
				if (this._gmode_edit) {
					this._paneConf[1].customCSS = "border-left:1px solid #000000;"
				}
				this._panesByXY = [[0, 1], [0]]
			} else {
				if (this._crosshairs[1]) {
					this._paneConf[0].coords = {
						l : hdrsWidth,
						t : hdrsHeight,
						w : colsSize,
						h : rowsOffset,
						x : 0,
						y : 0
					};
					this._paneConf[1].coords = {
						l : hdrsWidth,
						t : rowsOffset + hdrsHeight,
						w : colsSize,
						h : rowsSize,
						x : 0,
						y : 1
					};
					if (this._gmode_edit) {
						this._paneConf[1].customCSS = "border-top:1px solid #000000;"
					}
					this._panesByXY = [[0], [0, 1]]
				} else {
					this._paneConf[0].coords = {
						l : hdrsWidth,
						t : hdrsHeight,
						w : colsSize,
						h : rowsSize,
						x : 0,
						y : 0
					};
					this._panesByXY = [[0], [0]]
				}
			}
		}
		for (var pane, i = this._numPanes - 1; i >= 0; --i) {
			pane = this._paneConf[i];
			html.push('<div id="', this._domId, "P", i,
					'_OC" class="paneOC" style="left:', pane.coords.l,
					"px;top:", pane.coords.t, "px;width:", pane.coords.w,
					"px;height:", pane.coords.h, "px;", pane.customCSS,
					'"></div>')
		}

		html.push('<div class="HeaderMarker" id="', this._domId,
				'_startMarker"></div><div class="HeaderMarker" id="',
				this._domId, '_stopMarker"></div></div>');
		this.dom.id = this._domId.concat("_OC");
		this.dom.className = "sheetOC";
		this.dom.innerHTML = html.join("");
		this._book._sheetsOC.appendChild(this.dom)
	},
	_fit : function() {
		this.dom.style.width = "".concat(this._book._sheetsOCWidth, "px");
		this.dom.style.height = "".concat(this._book._sheetsOCHeight, "px");
		if (!this._crosshairs) {
			return
		}
		if (this._crosshairs[0] && this._crosshairs[1]) {
			var colsSizeId = 1, rowsSizeId = 2, fits = {
				1 : 1,
				2 : 2,
				3 : 3
			}
		} else {
			if (this._crosshairs[0]) {
				var colsSizeId = 1, rowsSizeId = 0, fits = {
					0 : 2,
					1 : 3
				}
			} else {
				if (this._crosshairs[1]) {
					var colsSizeId = 0, rowsSizeId = 1, fits = {
						0 : 1,
						1 : 3
					}
				} else {
					var colsSizeId = 0, rowsSizeId = 0, fits = {
						0 : 3
					}
				}
			}
		}
		var colsSize = this._book._sheetsOCWidth
				- this._paneConf[colsSizeId].coords.l, rowsSize = this._book._sheetsOCHeight
				- this._paneConf[rowsSizeId].coords.t, colsSizePx = "".concat(
				colsSize, "px"), rowsSizePx = "".concat(rowsSize, "px");
		if (this._gmode_edit) {
			this["_colHdrsOC".concat(colsSizeId ? "1" : "0")].style.width = colsSizePx;
			this["_rowHdrsOC".concat(rowsSizeId ? "1" : "0")].style.height = rowsSizePx
		}
		for (id in fits) {
			if (fits[id] & 1) {
				this._paneConf[id].coords.w = colsSize, this._paneOCs[id].style.width = colsSizePx
			}
			if (fits[id] & 2) {
				this._paneConf[id].coords.h = rowsSize, this._paneOCs[id].style.height = rowsSizePx
			}
		}
		this._reconstruct();
		this._setupScroll(true)
	},
	_reconstruct : function(cb) {
		var cIdx = this._crosshairs[0] ? 1 : 0, rIdx = this._crosshairs[1]
				? 1
				: 0;
		if (this._gmode_edit) {
			var colHdrs = this["_colHdrs".concat(cIdx)], rowHdrs = this["_rowHdrs"
					.concat(rIdx)], cOC = this["_colHdrsOC".concat(cIdx)], rOC = this["_rowHdrsOC"
					.concat(rIdx)], lastC = colHdrs[this["_numCols"
					.concat(cIdx)]
					- 1], lastR = rowHdrs[this["_numRows".concat(rIdx)] - 1], lastCol = this
					.getCoordByHdr(0, lastC), lastRow = this.getCoordByHdr(1,
					lastR)
		} else {
			var cPane = this._panes[cIdx], rPane = rIdx ? this._panes[rIdx
					+ cIdx] : this._panes[0], cOC = cPane._oc, rOC = rPane._oc, lastC = cPane._firstRowCells[cPane._numCols
					- 1], lastR = rPane._tableRows[rPane._numRows - 1], lastCol = cPane._currTopCell[0]
					+ cPane._numCols - 1, lastRow = rPane._currTopCell[1]
					+ rPane._numRows - 1
		}
		var hEdge = cOC.scrollLeft + cOC.offsetWidth, vEdge = rOC.scrollTop
				+ rOC.offsetHeight, cEdge = parseInt(lastC.style.left)
				+ this._colWidths.getElemAt(lastCol), rEdge = parseInt(lastR.style.top)
				+ this._rowHeights.getElemAt(lastRow), prcs = [{}, {}, {}, {}], next = lastCol
				+ 1;
		hEdge += this._colWidths.getElemAt(next)
				+ this._colWidths.getElemAt(++next);
		vEdge += this._rowHeights.getElemAt(next = lastRow + 1)
				+ this._rowHeights.getElemAt(++next);
		if (cEdge < hEdge) {
			var c = lastCol, diff;
			if (this._gmode_edit) {
				var docFrag = document.createDocumentFragment(), decr = this._cellSizeIncr[0], hdr, w;
				do {
					hdr = lastC.cloneNode(true);
					this._setText(hdr, this._n2l[++c]);
					hdr.style.left = "".concat(cEdge, "px");
					w = this._colWidths.getElemAt(c);
					if (w) {
						hdr.style.width = "".concat(w - decr, "px");
						if (hdr.style.display) {
							hdr.style.display = ""
						}
					} else {
						if (!hdr.style.display) {
							hdr.style.display = "none"
						}
					}
					docFrag.appendChild(hdr);
					colHdrs.push(hdr);
					cEdge += w
				} while (cEdge < hEdge);
				cOC.firstChild.appendChild(docFrag)
			} else {
				do {
					cEdge += this._colWidths.getElemAt(++c)
				} while (cEdge < hEdge)
			}
			this["_numCols".concat(cIdx)] += (diff = c - lastCol);
			prcs[cIdx].c = diff;
			if (rIdx) {
				prcs[rIdx | cIdx << 1].c = diff
			}
		}
		if (rEdge < vEdge) {
			var r = lastRow, diff;
			if (this._gmode_edit) {
				var docFrag = document.createDocumentFragment(), decr = this._cellSizeIncr[1], hdr, h;
				do {
					hdr = lastR.cloneNode(true);
					this._setText(hdr, ++r);
					hdr.style.top = "".concat(rEdge, "px");
					h = this._rowHeights.getElemAt(r);
					if (h) {
						hdr.style.height = "".concat(h - decr, "px");
						if (hdr.style.display) {
							hdr.style.display = ""
						}
					} else {
						if (!hdr.style.display) {
							hdr.style.display = "none"
						}
					}
					docFrag.appendChild(hdr);
					rowHdrs.push(hdr);
					rEdge += h
				} while (rEdge < vEdge);
				rOC.firstChild.appendChild(docFrag)
			} else {
				do {
					rEdge += this._rowHeights.getElemAt(++r)
				} while (rEdge < vEdge)
			}
			this["_numRows".concat(rIdx)] += (diff = r - lastRow);
			if (cIdx) {
				prcs[rIdx <<= 1].r = diff;
				prcs[cIdx | rIdx].r = diff
			} else {
				prcs[rIdx].r = diff
			}
		}
		for (var prc = prcs[0], i = 0; i < this._numPanes; prc = prcs[++i]) {
			if (prc.c || prc.r) {
				this._panes[i]._reconstruct(cb, prc.c, prc.r)
			} else {
				this._panes[i]._fit(cb)
			}
		}
	},
	_regPane : function(reg, coord, pane) {
		if (!reg[coord]) {
			reg[coord] = [pane]
		} else {
			if (reg[coord].indexOf(pane) == -1) {
				reg[coord].push(pane)
			}
		}
	},
	_setupScroll : function(fitOnly) {
		var book = this._book, sOCWidth = book._sheetsOCWidth, sheetSel = book._sheetSelector, hs2reg = {}, vs2reg = {}, widths = [], heights = [], maxw0, hs, vs, reg;
		if (this._hScrollReg[0]) {
			hs2reg = {
				0 : 0,
				1 : this._hScrollReg[1] ? 1 : false
			}
		} else {
			if (this._hScrollReg[1]) {
				hs2reg = {
					0 : 1,
					1 : false
				}
			} else {
				hs2reg = {
					0 : false,
					1 : false
				}
			}
		}
		widths[1] = hs2reg[1] ? this._hScrollReg[1][0]._ocWidth : 0;
		book._hsMaxW = maxw0 = sOCWidth - widths[1];
		if (hs2reg[0] !== false) {
			widths[0] = maxw0 * book._hsCoef | 0;
			sheetSel.setWidth(maxw0 - widths[0])
		} else {
			widths[0] = 0;
			sheetSel.setWidth(sOCWidth)
		}
		if (this._vScrollReg[0]) {
			vs2reg = {
				0 : 0,
				1 : this._vScrollReg[1] ? 1 : false
			}
		} else {
			if (this._vScrollReg[1]) {
				vs2reg = {
					0 : 1,
					1 : false
				}
			} else {
				vs2reg = {
					0 : false,
					1 : false
				}
			}
		}
		heights[1] = vs2reg[1] ? this._vScrollReg[1][0]._ocHeight : 0;
		heights[0] = vs2reg[0] !== false
				? book._sheetsOCHeight - heights[1]
				: 0;
		book._vsOCs[1].style.top = "".concat(heights[0], "px");
		if (fitOnly) {
			for (var coord in hs2reg) {
				if (hs = book._hScrolls[coord]) {
					hs._resize(widths[coord])
				}
			}
			for (var coord in vs2reg) {
				if (vs = book._vScrolls[coord]) {
					vs._resize(heights[coord])
				}
			}
			return
		}
		for (var coord in hs2reg) {
			reg = hs2reg[coord];
			if (hs = book._hScrolls[coord]) {
				hs._switch(this._hScrollReg[reg], widths[coord])
			} else {
				if (reg !== false) {
					book._hScrolls[coord] = new dev.report.base.grid.HorizScrollbar(
							book, book._hsOCs[coord], this._hScrollReg[reg],
							widths[coord]);
					if (coord != 0) {
						continue
					}
					new Ext.Resizable(book._hScrolls[0]._domId, {
								transparent : true,
								handles : "w",
								listeners : {
									resize : function(obj, w) {
										if (w > book._hsMaxW) {
											w = book._hsMaxW
										}
										sheetSel.setWidth(book._hsMaxW - w);
										book._hScrolls[0]._resize(w);
										book._hsCoef = w / book._hsMaxW
									}
								}
							})
				}
			}
		}
		for (var coord in vs2reg) {
			reg = vs2reg[coord];
			if (vs = book._vScrolls[coord]) {
				vs._switch(this._vScrollReg[reg], heights[coord])
			} else {
				if (reg !== false) {
					book._vScrolls[coord] = new dev.report.base.grid.VertScrollbar(
							book, book._vsOCs[coord], this._vScrollReg[reg],
							heights[coord])
				}
			}
		}
	},
	clearPaneCache : function() {
		for (var i = this._numPanes - 1; i >= 0; --i) {
			this._panes[i]._cache.clear()
		}
	},
	isClone : function() {
		return this._uid in this._book._sheetsO2C
	},
	getUid : function() {
		return this._uid in this._book._sheetsO2C
				? this._book._sheetsO2C[this._uid]
				: this._uid
	},
	setCellStyle : function(col, row, style) {
		for (var i = this._numPanes - 1; i >= 0; --i) {
			this._panes[i].setCellStyle(col, row, style)
		}
		this.reSaveRange();
	},
	setRangeStyle : function(range, style) {
		for (var i = this._numPanes - 1; i >= 0; --i) {
			this._panes[i].setRangeStyle(range, style)
		}
		this.reSaveRange();
	},
	setRangeLock : function(range, lock) {
		lock = lock ? true : false;
		/*var rqst = new dev.report.backend.CCmdAsyncRqst([["lock", range, lock],
				["gurn"], ["gur"]]);
		rqst.setOnSuccess([this, this._setRangeLock_post, range, lock]);
		rqst.send()
		*/
	},
	_setRangeLock_post : function(res, range, lock) {
		for (var pane, i = this._numPanes - 1; i >= 0; --i) {
			pane = this._panes[i];
			pane._cache.clear();
			pane.setRangeLock(range, lock)
		}
		this._setReach(res[1][1]);
		this._setUnlockRange(res[2][1])
	},
	activateHdr : function(type, idx, cls) {
		var crd = this._colRowDims[type], csi = this._cellSizeIncr[type], clss = this._hdrClss[type]
				.concat(" ", cls), sprop = type ? "height" : "width";
		for (var pos in this._hdrsICs1[type] ? {
			0 : true,
			1 : true
		} : {
			0 : true
		}) {
			var hdrsIC = this["_hdrsICs".concat(pos)][type], hdrrng = this["_rngColsRows"
					.concat(pos)][type], ahdrs_a = this["_activeHdrs_a"
					.concat(pos)], ahdrs_o = this["_activeHdrs_o".concat(pos)], hdrs = ahdrs_a[type];
			if (idx < hdrrng[0] || idx > hdrrng[1]) {
				for (var i = hdrs.length - 1, hdr = hdrs[i]; i >= 0; hdr = hdrs[--i]) {
					hdrsIC.removeChild(hdr[1])
				}
				ahdrs_a[type] = [];
				ahdrs_o[type] = {};
				continue
			}
			var notfnd = true, actHdr, size;
			for (var i = hdrs.length - 1, hdr = hdrs[i]; i >= 0; hdr = hdrs[--i]) {
				if (hdr[0] != idx) {
					hdrsIC.removeChild(hdr[1])
				} else {
					notfnd = false;
					actHdr = hdr[1];
					if (actHdr.className != clss) {
						actHdr.className = clss
					}
					if (actHdr.style[sprop] != (size = "".concat(crd
									.getElemAt(idx)
									- csi, "px"))) {
						actHdr.style[sprop] = size
					}
				}
			}
			if (notfnd) {
				actHdr = this["_hdrArrs".concat(pos)][type][idx
						- this._panes[this._panesByXY[type][pos]]._currTopCell[type]];
				if (!actHdr) {
					ahdrs_a[type] = [];
					ahdrs_o[type] = {};
					continue
				}
				actHdr = actHdr.cloneNode(true);
				actHdr.id = "ah".concat(type, "_", idx);
				actHdr.className = clss;
				hdrsIC.appendChild(actHdr)
			}
			ahdrs_a[type] = [[idx, actHdr]];
			ahdrs_o[type] = {};
			ahdrs_o[type][idx] = 0
		}
		return true
	},
	activateHdrRng : function(type, rng, cls) {
		var crd = this._colRowDims[type], csi = this._cellSizeIncr[type], clss = this._hdrClss[type]
				.concat(" ", cls), sprop = type ? "height" : "width";
		for (var pos in this._hdrsICs1[type] ? {
			0 : true,
			1 : true
		} : {
			0 : true
		}) {
			var hdrsIC = this["_hdrsICs".concat(pos)][type], hdrrng = this["_rngColsRows"
					.concat(pos)][type], ahdrs_a = this["_activeHdrs_a"
					.concat(pos)], ahdrs_o = this["_activeHdrs_o".concat(pos)], hdrs = ahdrs_a[type];
			if (rng[1] < hdrrng[0] || rng[0] > hdrrng[1]) {
				for (var i = hdrs.length - 1, hdr = hdrs[i]; i >= 0; hdr = hdrs[--i]) {
					hdrsIC.removeChild(hdr[1])
				}
				ahdrs_a[type] = [];
				ahdrs_o[type] = {};
				continue
			}
			var hdrs_a = [], hdrs_o = {}, size;
			for (var i = hdrs.length - 1, hdr = hdrs[i]; i >= 0; hdr = hdrs[--i]) {
				if (rng[0] <= hdr[0] && hdr[0] <= rng[1]) {
					hdrs_a.push(hdr);
					hdrs_o[hdr[0]] = hdrs_a.length - 1;
					if (hdr[1].className != clss) {
						hdr[1].className = clss
					}
					if (hdr[1].style[sprop] != (size = "".concat(crd
									.getElemAt(hdr[0])
									- csi, "px"))) {
						hdr[1].style[sprop] = size
					}
				} else {
					hdrsIC.removeChild(hdr[1])
				}
			}
			var hdrArrs = this["_hdrArrs".concat(pos)][type], pane = this._panes[this._panesByXY[type][pos]], tblsize = pane._tableSize[type], ctct = pane._currTopCell[type], actHdr;
			for (var i = rng[0]; i <= rng[1]; ++i) {
				if (!(i in hdrs_o)) {
					if (i - ctct >= tblsize) {
						break
					} else {
						if (i - ctct < 0) {
							continue
						}
					}
					actHdr = hdrArrs[i - ctct];
					if (!actHdr) {
						continue
					}
					actHdr = actHdr.cloneNode(true);
					actHdr.id = "ah".concat(type, "_", i);
					actHdr.className = clss;
					hdrsIC.appendChild(actHdr);
					hdrs_a.push([i, actHdr]);
					hdrs_o[i] = hdrs_a.length - 1
				}
			}
			ahdrs_a[type] = hdrs_a;
			ahdrs_o[type] = hdrs_o
		}
		return true
	},
	activateHdrAll : function(type, cls) {
		if (this._activeHdrsAll[type] == cls) {
			return true
		}
		for (var pos in this._hdrsICs1[type] ? {
			0 : true,
			1 : true
		} : {
			0 : true
		}) {
			var hdrsIC = this["_hdrsICs".concat(pos)][type], ahdrs_a = this["_activeHdrs_a"
					.concat(pos)], hdrs = ahdrs_a[type];
			for (var i = hdrs.length - 1; i >= 0; --i) {
				hdrsIC.removeChild(hdrs[i][1])
			}
			if (hdrs.length) {
				ahdrs_a[type] = [];
				this["_activeHdrs_o".concat(pos)][type] = {}
			}
			for (hdrs = this["_hdrArrs".concat(pos)][type], i = hdrs.length - 1; i >= 0; --i) {
				hdrs[i].className = cls
			}
		}
		this._activeHdrsAll[type] = cls;
		return true
	},
	showActiveHdrs : function(show) {
		show = show ? "" : "none";
		for (var pos in {
			0 : true,
			1 : true
		}) {
			var ahdrs_a = this["_activeHdrs_a".concat(pos)];
			if (!ahdrs_a) {
				continue
			}
			for (var hdrs = ahdrs_a[0], i = hdrs.length - 1; i >= 0; --i) {
				hdrs[i][1].style.display = show
			}
			for (hdrs = ahdrs_a[1], i = hdrs.length - 1; i >= 0; --i) {
				hdrs[i][1].style.display = show
			}
		}
	},
	locateHdr : function(type, obj, pane) {
		if ((type | 1) != 1) {
			return []
		}
		if (!pane) {
			var span = this._hdrsICs1[type] ? {
				0 : true,
				1 : true
			} : {
				0 : true
			}
		} else {
			var span = {};
			span[type ? pane._conf.coords.y : pane._conf.coords.x] = true
		}
		for (var pos in span) {
			var ahdrs_a = this["_activeHdrs_a".concat(pos)][type], ahdrs_o = this["_activeHdrs_o"
					.concat(pos)][type], pane = this._panes[this._panesByXY[type][pos]], hdrs = this["_hdrArrs"
					.concat(pos)][type];
			for (var i = pane._tableSize[type] - 1, ctci = pane._currTopCell[type]
					+ i; i >= 0; --i, --ctci) {
				if (hdrs[i] == obj
						|| (ctci in ahdrs_o && ahdrs_a[ahdrs_o[ctci]][1] == obj)) {
					return [ctci, pane]
				}
			}
		}
		return []
	},
	getCoordByHdr : function(type, obj, pane) {
		return this.locateHdr(type, obj, pane)[0]
	},
	getHdrByCoord : function(type, coord, pane) {
		if ((type | 1) != 1) {
			return undefined
		}
		if (!pane) {
			pane = this._aPane
		}
		return (type ? pane._rowHdrs : pane._colHdrs)[coord
				- pane._currTopCell[type]]
	},
	insertCol : function(col, num) {
		var table=dev.report.model.report.tabMap;
		var res=table.insertColumns(col,num);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this.reSaveRange();
	},
	insertRow : function(row, num) {
		var table=dev.report.model.report.tabMap;
		var res=table.insertRows(row,num);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this.reSaveRange();
	},
	deleteCol : function(col, num) {
		var table=dev.report.model.report.tabMap;
		var res=table.deleteColumns(col,num);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this.reSaveRange();
	},
	deleteRow : function(row, num) {
		var table=dev.report.model.report.tabMap;
		var res=table.deleteRows(row,num);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this.reSaveRange();
	},
	setColRowSize : function(type, chngsets) {
		if ((type | 1) != 1 || !(chngsets instanceof Array)) {
			return false
		}
		var span = this._crosshairs[type] ? {
			0 : true,
			1 : true
		} : {
			0 : true
		}, csi = this._cellSizeIncr[type], crs = this._colRowDims[type], asSize = dev.report.util.asSize, def = crs
				.getDef(), sizes, range, size, sizepx, len, oldvals, i, pos, ahdrs_o, ahdrs_a, oldsize, st, tr_s, newpos, diff;
		for (i = chngsets.length - 1; i >= 0; --i) {
			if ((len = (sizes = chngsets[i].slice()).length - 2) < 1) {
				continue
			}
			range = [sizes.shift(), sizes.shift()];
			if (len != 1 && range[1] - range[0] != len - 1) {
				continue
			}
			if (len != 1) {
				size = undefined
			} else {
				if ((size = sizes[0]) == -1) {
					size = def
				} else {
					if (size < csi) {
						size = 0
					}
				}
			}
			var oldvals = {}, move_ini = {}, tbl_begs = {};
			for (pos in span) {
				var tbl_size = [this["_numCols".concat(pos)],
						this["_numRows".concat(pos)]], tbl_beg = this._panes[this._panesByXY[type][pos]]._currTopCell[type], tbl_end = tbl_beg
						+ tbl_size[type] - 1;
				if (range[0] > tbl_end || range[1] < tbl_beg) {
					continue
				}
				for (var min = Math.max(range[0], tbl_beg), c = Math.min(
						range[1], tbl_end); c >= min; --c) {
					if (!(c in oldvals)) {
						oldvals[c] = crs.getElemAt(c)
					}
				}
				if (range[0] < tbl_beg) {
					tbl_begs[pos] = tbl_beg;
					move_ini[pos] = crs.getSumUpTo(tbl_beg)
				}
			}
			var range_diff = crs.getSumUpTo(range[1] + 1), pane_diff = 0;
			if (range[0] == 1 && range[1] == this._defMaxCoords[type]
					&& len == 1 && size != this._defColRowDims[type]) {
				this._defColRowDims[type] = size;
				crs.reInit(size);
				sizepx = "".concat(size - csi, "px")
			} else {
				if (len == 1) {
					for (var min = range[0], c = range[1]; c >= min; --c) {
						if (crs.getElemAt(c) != size) {
							crs.setElemAt(c, size)
						}
					}
					sizepx = "".concat(size - csi, "px")
				} else {
					for (var c = range[1], j = len - 1; j >= 0; --j, --c) {
						if ((size = sizes[j]) == -1) {
							size = def
						} else {
							if (size < csi) {
								size = 0
							}
						}
						if (crs.getElemAt(c) != size) {
							crs.setElemAt(c, size)
						}
					}
				}
			}
			range_diff = crs.getSumUpTo(range[1] + 1) - range_diff;
			for (pos in span) {
				if (pos in move_ini) {
					move_ini[pos] = crs.getSumUpTo(tbl_begs[pos])
							- move_ini[pos]
				}
			}
			for (var pi = 0; pi < this._numPanes; ++pi) {
				var pane = this._panes[pi], pos = type
						? pane._conf.coords.y
						: pane._conf.coords.x, th = pane._numRows, tw = pane._numCols, tm = pane._tableMat, ch = pane._colHdrs, cs = pane._colSeps, rh = pane._rowHdrs, fr = pane._firstRowCells, tr = pane._tableRows, ctc = pane._currTopCell, tbl_size = [
						tw, th], tbl_beg = ctc[type], tbl_end = tbl_beg
						+ tbl_size[type] - 1, move_sum = move_ini[pos] | 0;
				if (type) {
					if (rh) {
						ahdrs_o = this["_activeHdrs_o".concat(pos)][type], ahdrs_a = this["_activeHdrs_a"
								.concat(pos)][type]
					} else {
						ahdrs_o = undefined, ahdrs_a = undefined
					}
				} else {
					if (ch) {
						ahdrs_o = this["_activeHdrs_o".concat(pos)][type], ahdrs_a = this["_activeHdrs_a"
								.concat(pos)][type]
					} else {
						ahdrs_o = undefined, ahdrs_a = undefined
					}
				}
				for (var curr = range[0] > tbl_beg ? range[0] - tbl_beg : 0, max = range[1] < tbl_end
						? range[1] - tbl_beg
						: tbl_end - tbl_beg, curr_abs = tbl_beg + curr, c = curr_abs
						- range[0]; curr <= max; ++curr, ++curr_abs) {
					if (len > 1) {
						if ((size = sizes[c++]) == -1) {
							size = def
						} else {
							if (size < csi) {
								size = 0
							}
						}
						sizepx = "".concat(size - csi, "px")
					}
					if (type == this._SCROLL_HORIZ) {
						if ((oldsize = oldvals[curr_abs]) == size) {
							diff = 0
						} else {
							if (ch) {
								if (size) {
									st = ch[curr].style;
									st.width = sizepx;
									if (oldsize == 0) {
										st.display = ""
									}
								} else {
									if (oldsize) {
										ch[curr].style.display = "none"
									}
								}
								if (curr_abs in ahdrs_o) {
									if (size) {
										st = ahdrs_a[ahdrs_o[curr_abs]][1].style;
										st.width = sizepx;
										if (oldsize == 0) {
											st.display = ""
										}
									} else {
										if (oldsize) {
											ahdrs_a[ahdrs_o[curr_abs]][1].style.display = "none"
										}
									}
								}
							}
							diff = size - oldsize;
							for (var mi, mrow, mcol, cell, cspx, row = ctc[1], j = 0; j < th; ++j, ++row) {
								st = tm[j][curr].style;
								if ((mi = pane._storage.getPart(curr, j, "m")) !== undefined) {
									if (mi[0] === true) {
										cspx = asSize(crs.getSumUpTo(curr_abs
														+ mi[2], curr_abs)
												- csi)
									} else {
										cspx = st.borderLeftWidth != "2px"
												? sizepx
												: asSize(size - csi - 1);
										if ((mrow = mi[1] + 1) == row
												&& (mcol = mi[2] + 1) < range[0]
												&& (cell = pane
														.getCellByCoords(mcol,
																mrow)) !== undefined) {
											cell.style.width = asSize(parseInt(cell.style.width)
													+ diff)
										}
									}
								} else {
									cspx = st.borderLeftWidth != "2px"
											? sizepx
											: asSize(size - csi - 1)
								}
								if (size) {
									st.width = cspx;
									if (oldsize == 0) {
										st.display = ""
									}
								} else {
									if (oldsize) {
										st.display = "none"
									}
								}
							}
						}
						if (move_sum) {
							newpos = "".concat(parseInt(fr[curr].style.left)
											+ move_sum, "px");
							if (ch) {
								ch[curr].style.left = newpos;
								if (curr_abs in ahdrs_o) {
									ahdrs_a[ahdrs_o[curr_abs]][1].style.left = newpos
								}
							}
							if (cs) {
								cs[curr].style.left = newpos
							}
							for (var j = 0; j < th; tm[j][curr].style.left = newpos, ++j) {
							}
						}
						move_sum += diff
					} else {
						if ((oldsize = oldvals[curr_abs]) == size) {
							diff = 0
						} else {
							if (size) {
								if (rh) {
									st = rh[curr].style;
									st.height = sizepx;
									if (oldsize == 0) {
										st.display = ""
									}
									if (curr_abs in ahdrs_o) {
										st = ahdrs_a[ahdrs_o[curr_abs]][1].style;
										st.height = sizepx;
										if (oldsize == 0) {
											st.display = ""
										}
									}
								}
								st = tr[curr].style;
								st.height = sizepx;
								if (oldsize == 0) {
									st.display = ""
								}
							} else {
								if (oldsize) {
									if (rh) {
										rh[curr].style.display = "none";
										if (curr_abs in ahdrs_o) {
											ahdrs_a[ahdrs_o[curr_abs]][1].style.display = "none"
										}
									}
									tr[curr].style.display = "none"
								}
							}
							diff = size - oldsize;
							for (var mi, mcol, mrow, cell, col = ctc[0], j = 0; j < tw; ++j, ++col) {
								st = tm[curr][j].style;
								if ((mi = pane._storage.getPart(j, curr, "m")) !== undefined) {
									if (mi[0] === true) {
										st.height = asSize(crs.getSumUpTo(
												curr_abs + mi[1], curr_abs)
												- csi)
									} else {
										if ((mcol = mi[2] + 1) == col
												&& (mrow = mi[1] + 1) < range[0]
												&& (cell = pane
														.getCellByCoords(mcol,
																mrow)) !== undefined) {
											cell.style.height = asSize(parseInt(cell.style.height)
													+ diff)
										}
										if (st.borderTopWidth == "2px") {
											st.height = asSize(size - csi - 1)
										}
									}
								} else {
									if (st.borderTopWidth == "2px") {
										st.height = asSize(size - csi - 1)
									}
								}
							}
						}
						if (move_sum) {
							newpos = "".concat(
									parseInt((tr_s = tr[curr].style).top)
											+ move_sum, "px");
							if (rh) {
								rh[curr].style.top = newpos;
								if (curr_abs in ahdrs_o) {
									ahdrs_a[ahdrs_o[curr_abs]][1].style.top = newpos
								}
							}
							tr_s.top = newpos
						}
						move_sum += diff
					}
				}
				if (this._crosshairs[type] && !this._crosshairs[2] && pos == 0
						&& move_sum) {
					pane_diff = move_sum
				}
				if (pane_diff) {
					if (type) {
						if (pos == 0) {
							pane._ocHeight = pane._conf.coords.h += pane_diff;
							pane._oc.style.height = "".concat(pane._ocHeight,
									"px");
							if (pane._rowHdrsOC) {
								pane._rowHdrsOC.style.height = "".concat(
										pane._ocHeight, "px")
							}
						} else {
							pane._ocHeight = pane._conf.coords.h -= pane_diff;
							pane._conf.coords.t += pane_diff;
							pane._oc.style.top = "".concat(pane._conf.coords.t,
									"px");
							pane._oc.style.height = "".concat(pane._ocHeight,
									"px");
							if (pane._rowHdrsOC) {
								pane._rowHdrsOC.style.top = "".concat(
										pane._conf.coords.t, "px");
								pane._rowHdrsOC.style.height = "".concat(
										pane._ocHeight, "px")
							}
						}
					} else {
						if (pos == 0) {
							pane._ocWidth = pane._conf.coords.w += pane_diff;
							pane._oc.style.width = "".concat(pane._ocWidth,
									"px");
							if (pane._colHdrsOC) {
								pane._colHdrsOC.style.width = "".concat(
										pane._ocWidth, "px")
							}
						} else {
							pane._ocWidth = pane._conf.coords.w -= pane_diff;
							pane._conf.coords.l += pane_diff;
							pane._oc.style.left = "".concat(
									pane._conf.coords.l, "px");
							pane._oc.style.width = "".concat(pane._ocWidth,
									"px");
							if (pane._colHdrsOC) {
								pane._colHdrsOC.style.left = "".concat(
										pane._conf.coords.l, "px");
								pane._colHdrsOC.style.width = "".concat(
										pane._ocWidth, "px")
							}
						}
					}
				}
				if (!range_diff) {
					continue
				}
				if (ahdrs_a) {
					for (var ahdr, ahdr_s, curr = -1; (ahdr = ahdrs_a[++curr]) != undefined;) {
						if (ahdr[0] <= range[1]) {
							continue
						}
						if (type == this._SCROLL_HORIZ) {
							(ahdr_s = ahdr[1].style).left = "".concat(
									parseInt(ahdr_s.left) + range_diff, "px")
						} else {
							(ahdr_s = ahdr[1].style).top = "".concat(
									parseInt(ahdr_s.top) + range_diff, "px")
						}
					}
				}
				if (range[1] >= tbl_end) {
					continue
				}
				var curr = range[1] - tbl_beg + 1;
				if (curr < 0) {
					curr = 0
				}
				for (var tr_s, newpos, max = tbl_size[type]; curr < max; ++curr) {
					if (type == this._SCROLL_HORIZ) {
						newpos = "".concat(parseInt(fr[curr].style.left)
										+ range_diff, "px");
						if (ch) {
							ch[curr].style.left = newpos
						}
						if (cs) {
							cs[curr].style.left = newpos
						}
						for (var j = 0; j < th; tm[j][curr].style.left = newpos, ++j) {
						}
					} else {
						newpos = "".concat(
								parseInt((tr_s = tr[curr].style).top)
										+ range_diff, "px");
						if (rh) {
							rh[curr].style.top = newpos
						}
						tr_s.top = newpos
					}
				}
			}
		}
		for (var pane, i = this._numPanes - 1; i >= 0; --i) {
			pane = this._panes[i];
			pane._reposition(type);
			pane.getVirtSize(type, true)
		}
		this._reconstruct();
		if (this._gmode_edit) {
			this._defaultSelection.draw(), this._formulaSelection.draw(), this._copySelection
					.draw(), dev.report.base.hb.setAllNormal(null, true)
		} else {
			this._cursorField.adjustVisibility()
		}
		for (var i = this._numPanes - 1; i >= 0; --i) {
			var pane = this._panes[i];
			var cr_size, pos = pane._lastDestCell[type] + 1, sum = crs
					.getElemAt(pos), oc_size = type == this._SCROLL_HORIZ
					? pane._ocWidth
					: pane._ocHeight;
			for (var max = oc_size; sum < max; sum += crs.getElemAt(++pos)) {
			}
			pane._cppi[type] = pos - pane._lastDestCell[type] - 1;
			pane._cpp[type] = pane._cppi[type]
					+ ((cr_size = crs.getElemAt(pos)) - sum + oc_size)
					/ cr_size
		}
		var scrolls = this._book._scrolls[type];
		for (var i in scrolls) {
			scrolls[i].recalc()
		}
	},
	resizeColRow : function(type, ranges, newsize) {
		if ((type | 1) != 1) {
			return false
		}
		if (newsize < this._cellSizeIncr[type]) {
			newsize = 0
		}
		var range, chngsets = [], max = ranges.length, i = 0;
		for (; i < max; ++i) {
			range = ranges[i], chngsets.push([range[0], range[1], newsize])
		}
		this.setColRowSize(type, chngsets);

		var table=dev.report.model.report.tabMap;
		if (ranges.length == 1 && ranges[0][0] == 1
				&& ranges[0][1] == this._defMaxCoords[type]) {
			console.log('["sdcr", type, newsize]:'+type+"===="+newsize);
		//	this._conn.ccmd(true, ["sdcr", type, newsize])
		} else {
			var csi = this._cellSizeIncr[type], crs = this._colRowDims[type], def = crs.getDef(), sizes, range, size, len;
			for (i = chngsets.length - 1; i >= 0; --i) {
				if ((len = (sizes = chngsets[i].slice()).length - 2) < 1) {
					continue
				}
				range = [sizes.shift(), sizes.shift()];
				if (len != 1 && range[1] - range[0] != len - 1) {
					continue
				}
				if (len != 1) {
					size = undefined
				} else {
					if ((size = sizes[0]) == -1) {
						size = def
					} else {
						if (size < csi) {
							size = 0
						}
					}
				}
				table.resize(type,range,size);
			}
		}
		this.reSaveRange();
	},
	autofitColRow : function(type, ranges) {
		var table=dev.report.model.report.tabMap;
		var res=table.autoFit(type,ranges);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
		this.reSaveRange();
	},
	adjustRowHeights : function(row1, row2, contentHeight) {
		var defHeight = this._rowHeights.getDef(), ranges = [], range = undefined;
		for (var rh = this._rowHeights, row = row1; row <= row2; ++row) {
			if (rh.hasElemAt(row)) {
				continue
			}
			if (contentHeight > defHeight) {
				if (range === undefined) {
					range = [row, row];
					continue
				}
				if (row == range[1] + 1) {
					range[1] = row;
					continue
				}
				ranges.push(range);
				range = [row, row]
			}
		}
		if (range !== undefined) {
			ranges.push(range)
		}
		if (ranges.length) {
			this.resizeColRow(1, ranges, contentHeight)
		}
	},
	newDims : function(type, dims_new) {
		var svec_old = this._colRowDims[type], dims_old = svec_old
				.getSparseArray(), idx_max = svec_old.getLen(), idx, idx_old = idx_max, idx_new = idx_max, val, val_old = 0, val_new = 0, next_new = true, next_old = true, cond = 2, sets = [], set;
		for (var i_old = 0, i_new = 0, end_old = dims_old.length, end_new = dims_new.length; cond;) {
			if (next_new) {
				if (i_new < end_new) {
					idx_new = dims_new[i_new++] + 1;
					val_new = dims_new[i_new++]
				} else {
					idx_new = idx_max;
					val_new = 0;
					--cond
				}
				next_new = false
			}
			if (next_old) {
				if (i_old < end_old) {
					idx_old = dims_old[i_old++];
					val_old = dims_old[i_old++]
				} else {
					idx_old = idx_max;
					val_old = 0;
					--cond
				}
				next_old = false
			}
			if (idx_new < idx_old) {
				next_new = true;
				idx = idx_new;
				val = val_new
			} else {
				if (idx_new > idx_old) {
					next_old = true;
					idx = idx_old;
					val = -1
				} else {
					next_new = true;
					next_old = true;
					if (val_new == val_old) {
						continue
					} else {
						idx = idx_new;
						val = val_new
					}
				}
			}
			if (!set) {
				set = [idx, idx, val]
			} else {
				if (idx - 1 == set[1]
						&& (val == set[2] || set[1] - set[0] == set.length - 3)) {
					++set[1];
					if (set.length > 3 || val != set[2]) {
						set.push(val)
					}
				} else {
					sets.push(set);
					set = [idx, idx, val]
				}
			}
		}
		if (set) {
			sets.push(set)
		}
		if (sets.length) {
			this.setColRowSize(type, sets)
		}
	},
	getVirtScroll : function() {
		var panes = this._panes, vscroll = [], num = panes.length;
		for (var i = num - 1; i >= 0; --i) {
			vscroll.unshift(panes[i].getVirtScroll())
		}
		return num > 1 ? vscroll : vscroll[0]
	},
	getRealScroll : function() {
		var panes = this._panes, vscroll = [], num = panes.length;
		for (var i = num - 1; i >= 0; --i) {
			vscroll.unshift(this._paneConf[i].range)
		}
		return num > 1 ? vscroll : vscroll[0]
	},
	_setUnlockRange : function(rngs) {
		this._unlck = rngs;
		var unlckLen = this._unlck.length;
		if ((this._hasUnlck = unlckLen > 0)) {
			for (var i = 0; i < unlckLen; ++i) {
				if (this._unlck[i][0] < this._realUnlck[0]) {
					this._realUnlck[0] = this._unlck[i][0]
				}
				if (this._unlck[i][1] < this._realUnlck[1]) {
					this._realUnlck[1] = this._unlck[i][1]
				}
				if (this._unlck[i][2] > this._realUnlck[2]) {
					this._realUnlck[2] = this._unlck[i][2]
				}
				if (this._unlck[i][3] > this._realUnlck[3]) {
					this._realUnlck[3] = this._unlck[i][3]
				}
			}
		}
	},
	reSaveRange : function() {
		var hbs = dev.report.base.app.environment.dynaranges;
		for (var hbid in hbs) {
			hbs[hbid]._ranges[0].save(true);
		}
	},
	getUnlockRange : function() {
		var panes = this._panes, vscroll = [], num = panes.length;
		for (var i = num - 1, rng; i >= 0; --i) {
			rng = this._paneConf[i].range;
			vscroll
					.unshift([
							rng[0] < this._realUnlck[0]
									? this._realUnlck[0]
									: rng[0],
							rng[1] < this._realUnlck[1]
									? this._realUnlck[1]
									: rng[1],
							rng[2] > this._realUnlck[2]
									? this._realUnlck[2]
									: rng[2],
							rng[3] > this._realUnlck[3]
									? this._realUnlck[3]
									: rng[3],])
		}
		return num > 1 ? vscroll : vscroll[0]
	},
	isCellHidden : function(col, row) {
		return !(!this._colWidths.getElemAt(col) || !this._rowHeights
				.getElemAt(row))
	},
	findElem : function(name) {
		var el;
		for (var uid in this._els) {
			el = this._els[uid];
			if (el.conf && el.conf.name == name) {
				return el
			}
		}
		return false
	},
	getPanesByCoords : function(col, row) {
		var panes = [];
		for (var rng, i = this._numPanes - 1; i >= 0; --i) {
			rng = this._paneConf[i].range;
			if (col >= rng[0] && col <= rng[2] && row >= rng[1]
					&& row <= rng[3]) {
				panes.push(this._panes[i])
			}
		}
		return panes
	},
	isCellLocked : function(col, row) {
		if (this._hasUnlck) {
			for (var i = 0, unlckLen = this._unlck.length; i < unlckLen; i++) {
				if (col >= this._unlck[i][0] && col <= this._unlck[i][2]
						&& row >= this._unlck[i][1] && row <= this._unlck[i][3]) {
					return false
				}
			}
		}
		return true
	}
};