
Ext.namespace("dev.report.base");
dev.report.base.CCMD = function() {
	var _book;
	function _crgn(args) {
		var pane = "p" in args[0]
				? _book._aSheet._panes[args[0].p]
				: _book._aPane;
		pane._cache.clear();
		for (var rgn, frn = pane.furnishCell, comb = args[0].cm, i = 0; (rgn = args[++i]) != undefined;) {
			for (var cell, x = rgn[0], y = rgn[1], w = rgn[2], j = 2; (cell = rgn[++j]) != undefined;) {
				frn.call(pane, x, y, cell, comb);
				if (++x - rgn[0] >= w && w > 0) {
					++y, x = rgn[0]
				}
			}
		}
	}
	function _ccr(args) {
		_book._aSheet.setColRowSize(args.shift(), args)
	}
	function _wmv(args) {
		for (var wsel, i = args.length - 1; i >= 0; --i) {
			wsel = args[i];
			switch (wsel.type) {
				case "img" :
					dev.report.base.wsel.img.moveTo(wsel.id, wsel.pos, wsel.offsets);
					break;
				case "sccmnt" :
					dev.report.base.cmnt.moveTo(wsel.id, wsel.pos, wsel.offsets);
					break;
				case "widget" :
				case "formel" :
					dev.report.base.wsel.formelRemovize(wsel, _book);
					break;
				case "chart" :
					dev.report.base.wsel.chart.reMovize(wsel.id, wsel.pos,
							wsel.offsets);
					break;
				case "hb" :
					dev.report.base.hb.move(wsel.id, wsel.pos);
					break
			}
		}
	}
	function _rw(args) {
		var num = args.length;
		if (!num) {
			return
		}
		var sess = dev.report.base.app.sess, buid = _book.uid, suid = _book._aSheet
				.getUid(), ts = (new Date()).getTime(), numPanes = _book._aSheet._numPanes, panes = _book._aSheet._panes, uid;
		for (var j, i = num - 1; i >= 0; --i) {
			for (j = numPanes - 1; j >= 0; --j) {
				document.getElementById(panes[j]._domId.concat("_wsel_cont_",
						(uid = args[i]))).src = "/be/wss/gen_element.php?sess="
						.concat(sess, "&buid=", buid, "&suid=", suid, "&id=",
								uid, "&ts=", ts)
			}
		}
	}
	function _rf(args) {
		if (args.length) {
			dev.report.base.wsel.refreshAll(args, _book)
		}
	}
	function _wtrd(args) {
		if (args.length) {
			dev.report.base.wsel.updateTarget(args, _book)
		}
	}
	function _curn(args) {
		var aSheet = _book._aSheet, fuc = aSheet._farthestUsedCell, col = args[0], row = args[1], colChg = false, rowChg = false;
		if (col != fuc[0]) {
			fuc[0] = col, colChg = true
		}
		if (row != fuc[1]) {
			fuc[1] = row, rowChg = true
		}
		aSheet._contentReach = [args[2] ? aSheet._defMaxCoords[0] : col,
				args[3] ? aSheet._defMaxCoords[1] : row];
		if (!(colChg || rowChg)) {
			return
		}
		var recalcH = false, recalcV = false, pane;
		for (var i = aSheet._numPanes - 1; i >= 0; --i) {
			pane = aSheet._panes[i];
			if (colChg && pane._conf.hscroll) {
				if (col > pane._farthestSeenCell[0]) {
					pane._farthestSeenCell[0] = col
				}
				recalcH = true
			}
			if (rowChg && pane._conf.vscroll) {
				if (row > pane._farthestSeenCell[1]) {
					pane._farthestSeenCell[1] = row
				}
				recalcV = true
			}
		}
		if (recalcH) {
			for (var i in _book._hScrolls) {
				_book._hScrolls[i].check()
			}
		}
		if (recalcV) {
			for (var i in _book._vScrolls) {
				_book._vScrolls[i].check()
			}
		}
	}
	function _ncr(args) {
		_book._aSheet.newDims(0, args[0]);
		_book._aSheet.newDims(1, args[1])
	}
	var _map = {
		crgn : _crgn,
		ccr : _ccr,
		wmv : _wmv,
		rw : _rw,
		rf : _rf,
		wtrd : _wtrd,
		curn : _curn,
		ncr : _ncr
	};
	this.exec = function(ccmd, book) {
		if (!(ccmd instanceof Array) || !(ccmd.length)) {
			return false
		}
		_book = book ? book : dev.report.base.app.activeBook;
		for (var cmd, name, c = -1; (cmd = ccmd[++c]) != undefined;) {
			if ((name = cmd.shift()) in _map) {
				_map[name](cmd)
			}
		}
		if (_book._gmode_edit) {
			_book._aSheet._defaultSelection.getCursorField().refresh();
			dev.report.base.general.setCurrentCoord(_book)
		} else {
			_book._aSheet._cursorField.refresh()
		}
	};
	this.mexec = function(data) {
		var reg = dev.report.base.book.reg;
		for (var id in data) {
			this.exec(data[id], reg[id])
		}
	}
};