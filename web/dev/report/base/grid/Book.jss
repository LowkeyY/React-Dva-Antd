
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.Book = (function() {
	var _id = 0;
	return function(cb, holder, uid, name, meta, opts) {
		var that = this;
		this._initted = false;
		this.holder = holder;
		this.id = ++_id;
		this.uid = uid;
		this._domId = holder._domId.concat("B", holder.getDomCnt("B"));
		this.dom = holder.getDom();
		this._name = name;
		this._meta = meta;
		this._opts = opts || {};
		this._domCnts = {};
		this.scrollObserver = new dev.report.gen.Observer();
		this._viewMode = dev.report.base.app.appMode;
		this._app = dev.report.base.app;
		this._jwgrid = dev.report.base.grid;
		this._jwbook = dev.report.base.book;
		this._jwstyle = dev.report.base.style;
		this._jwgen = dev.report.base.general;
		this._json = Ext.util.JSON;
	//	this._conn = dev.report.backend;
	//	this._ha = dev.report.backend.wss;
		this._gmode_edit = this._viewMode == this._jwgrid.viewMode.DESIGNER;
		this._marginHeight = !this._gmode_edit
				&& this._opts.hideHorScrollbar == "yes"
				&& this._opts.hideSheetSelector == "yes" ? 0 : 17;
		this._marginWidth = !this._gmode_edit
				&& this._opts.hideVertScrollbar == "yes" ? 0 : 17;
		this._scrollPending = false;
		this._scrollDirectionMap = [];
		var scrollDir = this._jwgrid.ScrollDirection;
		this._scrollDirectionMap[scrollDir.UP] = [this._SCROLL_VERT,
				this._SCROLL_RWD];
		this._scrollDirectionMap[scrollDir.DOWN] = [this._SCROLL_VERT,
				this._SCROLL_FWD];
		this._scrollDirectionMap[scrollDir.LEFT] = [this._SCROLL_HORIZ,
				this._SCROLL_RWD];
		this._scrollDirectionMap[scrollDir.RIGHT] = [this._SCROLL_HORIZ,
				this._SCROLL_FWD];
		this._genContentEl();
		this._hsOCs = [document.getElementById(this._domId.concat("_hs0")),
				document.getElementById(this._domId.concat("_hs1"))];
		this._vsOCs = [document.getElementById(this._domId.concat("_vs0")),
				document.getElementById(this._domId.concat("_vs1"))];
		this._scrolls = [this._hScrolls = {}, this._vScrolls = {}];
		this._hsCoef = 0.4;
		this._sheetsOC = document.getElementById(this._domId.concat("_sheets"));
		this._sheetCnt = 0;
		this._sheets = {};
		this._dynCc = null;
		this._sheetSelOC = document.getElementById(this._domId
				.concat("_sheetSelectorOC"));
		
		using("dev.report.base.grid.SheetSelector");
		this._sheetSelector = new dev.report.base.grid.SheetSelector(this._domId,
				this);
		if (!this._gmode_edit
				&& (this._opts.hideSheetSelector == "yes" || (dev.report.base.app.UPRestrictMode && dev.report.base.app.userPreview))) {
			this._sheetSelOC.style.visibility = "hidden";
			this._sheetSelOC.style.height = "0px"
		}
		this._fit();
		this._jwbook.reg[this.id] = this;
		this._select();

		//this._conn
		//		.ccmdSetBuff('[["olst",2],["olst",3],["ocurr",2],["bget","",[],[],{"e_type":"conf"}]]');
		//this._conn.ccmdFlush([this, this._init_post, cb])
		var resString='[[true,{"a73210a1-94cb-453f-a982-6b96582bae65":"Sheet1"}],[true,{}],[true,"a73210a1-94cb-453f-a982-6b96582bae65"],[true,[]]]';
		var res=Ext.decode(resString);
		this._init_post(res,cb);
	}
})();
dev.report.base.grid.Book.prototype = {
	_SCROLL_HORIZ : 0,
	_SCROLL_VERT : 1,
	_SCROLL_RWD : -1,
	_SCROLL_FWD : 1,
	_FLAG_RENEW : 1,
	_init_post : function(res, cb) {
		if (res[0][0] !== true || res[1][0] !== true || res[2][0] !== true
				|| res[3][0] !== true) {
			if (this.holder instanceof dev.report.base.wnd.Window) {
				try {
					for (var triggers = dev.report.base.events.triggers.closeWorkbook_before, i = triggers.length
							- 1; i >= 0; --i) {
						triggers[i][0]["closeWorkbook_before"].call(parent,
								triggers[i][1], this._meta, this._name)
					}
				} catch (e) {
					dev.report.base.general.showMsg("Application Error".localize(),
							e.message.localize(), Ext.MessageBox.ERROR)
				}
			}
			return
		}
		this._sheetUids = res[0][1];
		this._sheetsC2O = res[1][1];
		this._sheetsO2C = dev.report.util.objFlip(this._sheetsC2O);
		var aSheetUid = res[2][1];
		this._aSheetUid = aSheetUid in this._sheetsC2O
				? this._sheetsC2O[aSheetUid]
				: aSheetUid;
		
		this._sheetSelector.readWorksheets();

		if (res[3][1].length) {
			this._conf = res[3][1][0];
			if (this._conf.autoRefresh) {
				if (this._conf.autoRefresh < 10) {
					this._conf.autoRefresh = 10
				}
				this._autoRefresh = this._conf.autoRefresh * 1000
			} else {
				this._autoRefresh = 0
			}
		} else {
			this._conf = null;
			this._autoRefresh = 0
		}
		if (this._autoRefresh) {
			cb = [this, dev.report.util.combineCBs, cb, [this, this.autoRefresh]]
		}
		this._showSheet(cb, this._aSheetUid);
		this._initted = true
	},
	_genContentEl : function() {
		var html = ['<div id="', this._domId, '" class="bookOC">', '<div id="',
				this._domId, '_vs0" class="vsOC"></div>', '<div id="',
				this._domId,
				'_vs1" class="vsOC vs1OC" style="display: none;"></div>',
				'<div id="', this._domId, '_sheets" class="sheetsOC"> </div>',
				'<div id="gridBRSpacer"> </div>',
				'<div class="sheetSelectorOC" id="', this._domId,
				'_sheetSelectorOC">', '<div class="sheetSelectorTB" id="',
				this._domId, '_sheetSelectorTB"></div>',
				'<div class="sheetSelectorIC" id="', this._domId,
				'_sheetSelectorIC"></div>', "</div>", '<div id="', this._domId,
				'_hs1" class="hsOC hs1OC" style="display: none;"></div>',
				'<div id="', this._domId, '_hs0" class="hsOC"></div>', "</div>"];
		this.dom.innerHTML = html.join("")
	},
	_fit : function() {
		this._sheetsOCWidth = this.holder.getInnerWidth() - this._marginWidth;
		this._sheetsOCHeight = this.holder.getInnerHeight()
				- this._marginHeight;
		this._sheetsOC.style.width = "".concat(this._sheetsOCWidth, "px");
		this._sheetsOC.style.height = "".concat(this._sheetsOCHeight, "px");
		this._sheetSelector._refresh();
		for (var sheetUid in this._sheets) {
			this._sheets[sheetUid]._fit()
		}
	},
	_showSheet : function(cb, uid, flags) {
		if (!(uid in this._sheetUids)) {
			return false
		}
		if (this._aSheet) {
			this._aSheet.dom.style.visibility = "hidden"
		}
		if (flags & this._FLAG_RENEW && uid in this._sheets) {
			this._sheetsOC.removeChild(this._sheets[uid].dom);
			delete this._sheets[uid]
		}
		this._aSheetUid = uid;
		if (uid in this._sheets) {
			this._app.activeSheet = this._aSheet = this._sheets[uid];
			this._app.activePane = this._aPane = this._aSheet._aPane;
			this._app.environment = this._aPane._env.shared;
			this._aSheet.dom.style.visibility = "";
			this._sheetSelector.enable(true);
			this._aSheet._setupScroll();
			dev.report.base.sheet.refresh(cb)
		} else {
			using("dev.report.base.grid.Sheet");
			this._sheets[uid] = new dev.report.base.grid.Sheet(cb, this, uid)
		}
		return true
	},
	setClone : function(cloneUid) {
		this._sheetsO2C[this._aSheetUid] = cloneUid;
		this._sheetsC2O[cloneUid] = this._aSheetUid
	},
	_actOnSheetSel : function(cb) {
		switch (this._sheetSelector.action) {
			case this._sheetSelector.actionTypes.SELECTED :
				var sheetUid = this._sheetSelector.getActiveSheetId(), res;
				if (!(sheetUid in this._sheetUids)) {
					break
				}
				if (sheetUid in this._sheetsO2C) {
					this._ha.selectSheet(this._sheetsO2C[sheetUid], true,
							this._gmode_edit)
				} else {
					if ((res = this._ha.selectSheet(sheetUid, false,
							this._gmode_edit, null, cb instanceof Array
									&& cb.length > 2 && !cb[2][0],
							!(sheetUid in this._sheets)))[1]) {
						this._sheetsO2C[sheetUid] = res[2], this._sheetsC2O[res[2]] = sheetUid
					}
				}
				this._showSheet(cb, sheetUid);
				this._jwgen.syncCtrls();
				break;
			case this._sheetSelector.actionTypes.ADDED :
				var res = this._ha.addSheet(this._sheetSelector.actionData);
				if (res.errcode) {
					break
				}
				this._sheetSelector.freeze(false);
				this._sheetSelector.insertEntry(res.name, res.wsid,
						this._sheetSelector.actionData);
				this._sheetSelector.freeze(true);
				this._sheetUids[res.wsid] = res.name;
				this._showSheet(cb, res.wsid);
				break;
			case this._sheetSelector.actionTypes.REMOVED :
				var sheetUid = this._sheetSelector.getActiveSheetId();
				if (sheetUid in this._sheetsO2C) {
					this._ha.selectSheet(this._sheetsO2C[sheetUid], true,
							this._gmode_edit)
				} else {
					this._ha.selectSheet(sheetUid, false, this._gmode_edit,
							null, false, !(sheetUid in this._sheets))
				}
				this._showSheet(cb, sheetUid);
				var removedSheetUid = this._sheetSelector.actionData;
				this._sheetsOC.removeChild(this._sheets[removedSheetUid].dom);
				delete this._sheetUids[removedSheetUid];
				delete this._sheets[removedSheetUid];
				//this._conn.ccmd(true, ["odel", 2, removedSheetUid]);
				this._jwgen.syncCtrls();
				break;
			case this._sheetSelector.actionTypes.COPIED :
				var data = this._sheetSelector.actionData, sameWb = typeof data.wbId != "string"
						|| !data.wbId.length, res = this._ha.copySheet(
						data.wsId, data.nextSheetId, data.wbId);
				if (res.errcode) {
					break
				}
				if (sameWb) {
					this._sheetSelector.freeze(false);
					this._sheetSelector.insertEntry(res.name, res.wsid,
							data.nextSheetId);
					this._sheetSelector.freeze(true);
					this._sheetUids[res.wsid] = res.name;
					this._showSheet(cb, res.wsid)
				} else {
					this._sheetSelector.enable(true);
					this._jwgen.setInputMode(this._app.lastInputModeDlg);
					this._app.lastInputMode = this._jwgrid.GridMode.READY;
					this._jwbook.select(data.wbId);
					var destWb = this._app.activeBook;
					destWb._sheetUids[res.wsid] = res.name;
					destWb._sheetSelector.insertEntry(res.name, res.wsid,
							data.nextSheetId)
				}
				break;
			case this._sheetSelector.actionTypes.MOVED :
				var data = this._sheetSelector.actionData, sameWb = typeof data.wbId != "string"
						|| !data.wbId.length, res = this._ha.moveSheet(
						data.wsId, data.nextSheetId, data.wbId);
				if (res.errcode) {
					break
				}
				if (sameWb) {
					this._sheetSelector.freeze(false);
					this._sheetSelector.insertEntry(res.name, res.wsid,
							data.nextSheetId);
					this._sheetSelector.freeze(true);
					this._sheetSelector.enable(true);
					if (cb instanceof Array && cb.length > 1) {
						cb[1].apply(cb[0], cb.slice(2))
					}
				} else {
					this._sheetsOC.removeChild(this._sheets[data.wsId].dom);
					delete this._sheetUids[data.wsId];
					delete this._sheets[data.wsId];
					this._sheetSelector.enable(true);
					this._jwgen.setInputMode(this._app.lastInputModeDlg);
					this._app.lastInputMode = this._jwgrid.GridMode.READY;
					this._jwbook.select(data.wbId);
					var destWb = this._app.activeBook;
					destWb._sheetUids[res.wsid] = res.name;
					destWb._sheetSelector.insertEntry(res.name, res.wsid,
							data.nextSheetId)
				}
				break;
			case this._sheetSelector.actionTypes.UNCLONED :
				dev.report.base.wsel.unloadAll(this.id, this._aSheetUid);
				if (this._ha.removeCloneWorksheet() === false) {
					break
				}
				delete this._sheetsC2O[this._sheetsO2C[this._aSheetUid]];
				delete this._sheetsO2C[this._aSheetUid];
				this._ha.selectSheet(this._aSheetUid, false, this._gmode_edit);
				this._showSheet(cb, this._aSheetUid, this._FLAG_RENEW);
				break
		}
		this._sheetSelector.action = this._sheetSelector.actionTypes.NONE
	},
	_select : function() {
		var activeBook = this._app.activeBook;
		if (activeBook == this) {
			return false
		}
		if (activeBook) {
			activeBook._unselect()
		}
		this._app.activeBook = this;
		this._app.activeSheet = this._aSheet;
		this._app.activePane = this._aPane;
		this._app.environment = this._aPane
				? this._aPane._env.shared
				: undefined;
		if (!this._initted) {
			return
		}
		if (this._aSheet) {
			if (this._aSheet._defaultSelection) {
				this._aSheet._defaultSelection.show()
			}
			this._aSheet.showActiveHdrs(true);
			this._jwgen.syncCtrls()
		}
		this._app.handlers.updateUndoState();
		dev.report.base.action.adjustToACL();
		if (this._autoRefresh) {
			this.autoRefresh()
		}
		return true
	},
	_unselect : function() {
		if (this._autoRefresh) {
			clearTimeout(this._tid_autoRefresh)
		}
		if (this._aSheet) {
			if (this._aSheet._defaultSelection) {
				this._aSheet._defaultSelection.hide()
			}
			this._aSheet.showActiveHdrs(false)
		}
	},
	_unload : function() {
		if (this._autoRefresh) {
			clearTimeout(this._tid_autoRefresh)
		}
		if (this._gmode_edit) {
			this._app.currFormula.setValue("");
			this._app.currCoord.setValue("")
		}
		dev.report.base.wsel.unloadAll(this.id);
		if (this._app.activeBook == this) {
			this._jwbook.unsetActive()
		}
		delete this._jwbook.reg[this.id];
		while (this.dom.hasChildNodes()) {
			this.dom.removeChild(this.dom.lastChild)
		}
		dev.report.base.action.adjustToACL()
	},
	_undo_redo : function(op, steps) {
		/*this._conn.ccmdBuffer();
		this._conn.ccmd(null, [op, steps]);
		this._conn.ccmd(null, ["gust"]);
		this._conn.ccmdFlush(true, true)
		*/
	},
	undo : function(steps) {
		this._undo_redo("undo", steps)
	},
	redo : function(steps) {
		this._undo_redo("redo", steps)
	},
	autoRefresh : function() {
		if (!this._autoRefresh) {
			return
		}
		var that = this;
		this._tid_autoRefresh = setTimeout(function() {
					dev.report.base.sheet.refresh([that, that.autoRefresh])
				}, this._autoRefresh)
	},
	select : function() {
		dev.report.base.app.switchContextObserver.notify(this);
		this._select();
		//this.holder.select()
	},
	refresh : function() {
		dev.report.base.sheet.refresh(null, true)
	},
	getScrollDirMap : function() {
		return this._scrollDirectionMap
	},
	setWbId : function(id) {
		this.uid = id
	},
	getUid : function() {
		return this.uid
	},
	getWsId : function() {
		return this._sheetSelector.getActiveSheetId()
	},
	setMeta : function(meta) {
		this._meta = meta
	},
	setName : function(name) {
		this._name = name;
		this.holder.setName(name)
	},
	getSheetSelector : function() {
		return this._sheetSelector
	},
	getTopHolder : function() {
		var holder = this.holder;
		while (holder.holder) {
			holder = holder.holder
		}
		return holder
	},
	getSheetUids : function() {
		var list = [];
		for (var uid in this._sheetUids) {
			list.push(uid, this._sheetUids[uid])
		}
		return list
	},
	getDomCnt : function(id) {
		if (id in this._domCnts) {
			return ++this._domCnts[id]
		}
		return this._domCnts[id] = 0
	},
	getUidSgn : function() {
		return this._aSheet
				? this.uid.concat(" ", this._aSheet.getUid())
				: this.uid
	}
};