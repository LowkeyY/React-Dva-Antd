
Ext.namespace("dev.report.base");
dev.report.base.Sheet =  function() {
	var that = this, _json = Ext.util.JSON;
	this.insDelMode = {
		SHIFT_VER : 1,
		SHIFT_HOR : 2,
		ENTIRE_COL : 3,
		ENTIRE_ROW : 4
	};
	this.undo = function() {
		return;
		var env = dev.report.base.app.environment;
		var gridMode = dev.report.base.grid.GridMode;
		if (env.inputMode == gridMode.EDIT || env.inputMode == gridMode.INPUT) {
			env.redoValue = env.inputField.value;
			env.inputField.value = env.undoValue;
			dev.report.base.app.currFormula.setValue(env.inputField.value);
			dev.report.base.app.handlers.updateUndoState([0, 1], false);
			dev.report.base.app.lastInputField.focus()
		} else {
			dev.report.base.app.activeBook.undo(1)
		}
	};
	this.redo = function() {
		return;
		var env = dev.report.base.app.environment;
		var gridMode = dev.report.base.grid.GridMode;
		if (env.inputMode == gridMode.EDIT || env.inputMode == gridMode.INPUT) {
			env.inputField.value = env.redoValue;
			dev.report.base.app.currFormula.setValue(env.inputField.value);
			dev.report.base.app.handlers.updateUndoState([1, 0], false);
			dev.report.base.app.lastInputField.focus()
		} else {
			dev.report.base.app.activeBook.redo(1)
		}
	};
	this.divide = function(mode, crosshairs) {
		var jwgrid = dev.report.base.grid, activeSheet = dev.report.base.app.activeSheet, firstPane = activeSheet._panes[0], leftTop = [
				firstPane._lastDestCell[0] + 1, firstPane._lastDestCell[1] + 1], selCellCoords, panes, conf, ccmd;
		switch (mode) {
			case false :
				ccmd = '[["wdel","",["'
						.concat(activeSheet._paneConfUid, '"]]]');
				break;
			case 0 :
				if (crosshairs instanceof Array) {
					selCellCoords = [leftTop[0] + crosshairs[0],
							leftTop[1] + crosshairs[1]]
				} else {
					if (activeSheet._crosshairs[0] > 0
							|| activeSheet._crosshairs[1] > 0) {
						if (activeSheet._crosshairs[2] == false) {
							return false
						}
						crosshairs = [firstPane._cppi[0], firstPane._cppi[1]];
						selCellCoords = [leftTop[0] + crosshairs[0],
								leftTop[1] + crosshairs[1]]
					} else {
						selCellCoords = dev.report.base.app.environment.selectedCellCoords;
						crosshairs = [selCellCoords[0] - leftTop[0],
								selCellCoords[1] - leftTop[1]]
					}
				}
				if (crosshairs[0] == 0 && crosshairs[1] == 0) {
					return false
				}
				crosshairs[2] = false;
				if (crosshairs[0] && crosshairs[1]) {
					panes = [{
						range : [leftTop[0], leftTop[1], selCellCoords[0] - 1,
								selCellCoords[1] - 1],
						pos : {
							c : leftTop[0],
							r : leftTop[1]
						},
						hscroll : false,
						vscroll : false
					}, {
						range : [selCellCoords[0], leftTop[1],
								jwgrid.defMaxCoords[0], selCellCoords[1] - 1],
						pos : {
							c : selCellCoords[0],
							r : leftTop[1]
						},
						hscroll : true,
						vscroll : false
					}, {
						range : [leftTop[0], selCellCoords[1],
								selCellCoords[0] - 1, jwgrid.defMaxCoords[1]],
						pos : {
							c : leftTop[0],
							r : selCellCoords[1]
						},
						hscroll : false,
						vscroll : true
					}, {
						range : [selCellCoords[0], selCellCoords[1],
								jwgrid.defMaxCoords[0], jwgrid.defMaxCoords[1]],
						pos : {
							c : selCellCoords[0],
							r : selCellCoords[1]
						},
						hscroll : true,
						vscroll : true
					}]
				} else {
					if (crosshairs[0]) {
						panes = [{
							range : [leftTop[0], 1, selCellCoords[0] - 1,
									jwgrid.defMaxCoords[0]],
							pos : {
								c : leftTop[0],
								r : 1
							},
							hscroll : false,
							vscroll : true
						}, {
							range : [selCellCoords[0], 1,
									jwgrid.defMaxCoords[0],
									jwgrid.defMaxCoords[1]],
							pos : {
								c : selCellCoords[0],
								r : 1
							},
							hscroll : true,
							vscroll : true
						}]
					} else {
						if (crosshairs[1]) {
							panes = [{
								range : [1, leftTop[1], jwgrid.defMaxCoords[0],
										selCellCoords[1] - 1],
								pos : {
									c : 1,
									r : leftTop[1]
								},
								hscroll : true,
								vscroll : false
							}, {
								range : [1, selCellCoords[1],
										jwgrid.defMaxCoords[0],
										jwgrid.defMaxCoords[1]],
								pos : {
									c : 1,
									r : selCellCoords[1]
								},
								hscroll : true,
								vscroll : true
							}]
						}
					}
				}
				break;
			case 1 :
				if (activeSheet._crosshairs[0] > 0
						|| activeSheet._crosshairs[1] > 0) {
					if (activeSheet._crosshairs[2] == true) {
						return false
					}
					crosshairs = [firstPane._conf.coords.w,
							firstPane._conf.coords.h];
					selCellCoords = [leftTop[0] + firstPane._cppi[0],
							leftTop[1] + firstPane._cppi[1]]
				} else {
					selCellCoords = dev.report.base.app.environment.selectedCellCoords;
					crosshairs = [
							activeSheet._colWidths.getSumUpTo(selCellCoords[0],
									leftTop[0] < selCellCoords[0]
											? leftTop[0]
											: undefined),
							activeSheet._rowHeights.getSumUpTo(
									selCellCoords[1],
									leftTop[1] < selCellCoords[1]
											? leftTop[1]
											: undefined)]
				}
				if (crosshairs[0] == 0 && crosshairs[1] == 0) {
					return false
				}
				crosshairs[2] = true;
				if (crosshairs[0] && crosshairs[1]) {
					panes = [{
						range : [1, 1, jwgrid.defMaxCoords[0],
								jwgrid.defMaxCoords[1]],
						pos : {
							c : leftTop[0],
							r : leftTop[1]
						},
						hscroll : true,
						vscroll : true
					}, {
						range : [1, 1, jwgrid.defMaxCoords[0],
								jwgrid.defMaxCoords[1]],
						pos : {
							c : selCellCoords[0],
							r : leftTop[1]
						},
						hscroll : true,
						vscroll : true
					}, {
						range : [1, 1, jwgrid.defMaxCoords[0],
								jwgrid.defMaxCoords[1]],
						pos : {
							c : leftTop[0],
							r : selCellCoords[1]
						},
						hscroll : true,
						vscroll : true
					}, {
						range : [1, 1, jwgrid.defMaxCoords[0],
								jwgrid.defMaxCoords[1]],
						pos : {
							c : selCellCoords[0],
							r : selCellCoords[1]
						},
						hscroll : true,
						vscroll : true
					}]
				} else {
					if (crosshairs[0]) {
						panes = [{
							range : [1, 1, jwgrid.defMaxCoords[0],
									jwgrid.defMaxCoords[1]],
							pos : {
								c : leftTop[0],
								r : 1
							},
							hscroll : true,
							vscroll : true
						}, {
							range : [1, 1, jwgrid.defMaxCoords[0],
									jwgrid.defMaxCoords[1]],
							pos : {
								c : selCellCoords[0],
								r : 1
							},
							hscroll : true,
							vscroll : true
						}]
					} else {
						if (crosshairs[1]) {
							panes = [{
								range : [1, 1, jwgrid.defMaxCoords[0],
										jwgrid.defMaxCoords[1]],
								pos : {
									c : 1,
									r : leftTop[1]
								},
								hscroll : true,
								vscroll : true
							}, {
								range : [1, 1, jwgrid.defMaxCoords[0],
										jwgrid.defMaxCoords[1]],
								pos : {
									c : 1,
									r : selCellCoords[1]
								},
								hscroll : true,
								vscroll : true
							}]
						}
					}
				}
				break;
			default :
				return false
		}
		if (crosshairs && panes) {
			conf = '{"crosshairs":'.concat(_json.encode(crosshairs),
					',"panes":', _json.encode(panes));
			ccmd = activeSheet._paneConfUid
					? '[["wupd","",{"'.concat(activeSheet._paneConfUid, '":',
							conf, "}}]]")
					: '[["wadd","",'.concat(conf, ',"e_type":"panescnf"}]]')
		}
		var conn = dev.report.backend;
		conn.ccmdSetBuff(ccmd);
		conn.ccmdFlush([that, _divide_post, activeSheet])
	};
	function _divide_post(res, sheet) {
		sheet._book._showSheet(null, sheet._uid, true)
	}
	this.select = function(cb, wsId, book, selSheet) {
		var activeBook = dev.report.base.app.activeBook;
		if (!book) {
			book = activeBook
		}
		var sheetSel = book._sheetSelector;
		sheetSel.enable(false);
		sheetSel.freeze(false);
		sheetSel.selectById(wsId, !selSheet);
		sheetSel.enable(true);
		if (selSheet) {
			sheetSel.action = sheetSel.actionTypes.SELECTED;
			activeBook._actOnSheetSel(cb)
		} else {
			book._showSheet(cb, wsId)
		}
	};
	this.ins = function(mode) {
		var activeBook = dev.report.base.app.activeBook, defRanges = dev.report.base.app.environment.defaultSelection
				.getRanges(), ranges = [];
		for (var mi, range, i = defRanges.length - 1; i >= 0; --i) {
			range = defRanges[i].getCoords();
			if (range[0] == range[2]
					&& range[1] == range[3]
					&& (mi = activeBook._aPane.getMergeInfo(range[0], range[1]))
					&& mi[0]) {
				range[2] += mi[1] - 1, range[3] += mi[2] - 1
			}
			range.push(mode);
			ranges.unshift(range)
		}
		var table=dev.report.model.report.tabMap;
		var res=table.insertCells(ranges);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
	};
	this.del = function(mode) {
		var activeBook = dev.report.base.app.activeBook, defRanges = dev.report.base.app.environment.defaultSelection
				.getRanges(), ranges = [];
		for (var mi, range, i = defRanges.length - 1; i >= 0; --i) {
			range = defRanges[i].getCoords();
			if (range[0] == range[2]
					&& range[1] == range[3]
					&& (mi = activeBook._aPane.getMergeInfo(range[0], range[1]))
					&& mi[0]) {
				range[2] += mi[1] - 1, range[3] += mi[2] - 1
			}
			range.push(mode);
			ranges.unshift(range)
		}
		var table=dev.report.model.report.tabMap;
		var res=table.deleteCells(ranges);
		if(res.length!=0){
			dev.report.base.ccmd.mexec(res[0]);
		}
	};
	this.getMergeState = function() {
		return dev.report.base.app.activePane
				.getMergeState(dev.report.base.app.environment.defaultSelection
						.getActiveRange().getCoords())
	};
	this.merge = function() {
		dev.report.base.app.activePane
				.merge(dev.report.base.app.environment.defaultSelection
						.getActiveRange().getCoords())
	};
	this.unMerge = function() {
		dev.report.base.app.activePane.merge(
				dev.report.base.app.environment.defaultSelection.getActiveRange()
						.getCoords(), true)
	};
	this.refresh = function(cb, onlyActive) {
		function _post(res, cb) {
			dev.report.base.ccmd.mexec(res);
			if (cb instanceof Array && cb.length > 1) {
				cb[1].apply(cb[0], cb.slice(2))
			}
		}
		dev.report.backend.rpc([this, _post, cb], "WSS", "refresh", [
						dev.report.base.book.getVirtScroll(onlyActive),
						dev.report.base.app.autoCalc])
	};
	this.getColRowSize = function(type) {
		var activeSheet = dev.report.base.app.activeSheet;
		if (!activeSheet || !activeSheet._defaultSelection) {
			return
		}
		var crs = activeSheet._colRowDims[type], ranges = activeSheet._defaultSelection
				.getRanges(), size, coords, beg, end, i, j;
		if (!ranges[0]) {
			return
		}
		size = crs.getElemAt(ranges[0].getCoords()[type]);
		for (i = ranges.length - 1; i >= 0; --i) {
			coords = ranges[i].getCoords();
			beg = coords[type];
			end = coords[type + 2];
			if (end - beg > 256) {
				return
			}
			for (j = end; j >= beg; --j) {
				if (size != crs.getElemAt(j)) {
					return
				}
			}
		}
		return size
	}
};