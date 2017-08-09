
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.Selection = (function() {
	return function(startCoords, sheet) {
		this._sheet = sheet;
		this._panes = this._sheet._panes;
		this._pane = this._sheet._aPane;
		this._book = this._sheet._book;
		this._containers = [];
		for (var i = this._panes.length - 1; i >= 0; i--) {
			this._containers[i] = this._panes[i] == null
					? null
					: this._panes[i].getIC()
		}
		this._container = this._containers[0];
		this._environment = this._pane == null ? null : this._sheet._env;
		this._ranges = [];
		this._mode = dev.report.base.range.RangeMode.NONE;
		this._activeRange = 0;
		this._scope = this;
		this._startCoords = startCoords;
		this._headerState = {
			colActive : false,
			colSelected : false,
			rowActive : false,
			rowSelected : false
		};
		this.lastParseRes = [];
		this.activeToken = null;
		this._hdrSel = null;
		this._hdrRngs = {}
	}
})();
dev.report.base.grid.Selection.prototype = {
	_isRect : function() {
		return false
	},
	_setLegacyVars : function() {
		var activeCell = this._ranges[this._activeRange].getActiveCell();
		if (this._environment.shared.headerMarkMode == "") {
			this._environment.shared.headerStyle = 0;
			this._environment.shared.lastMarkMode = 0
		}
		this.setActiveCell(null, activeCell.getX()
						- dev.report.base.app.firstRowNumeric + 1, activeCell.getY()
						- dev.report.base.app.firstColumn + 1, false)
	},
	getRanges : function() {
		return this._ranges
	},
	getRange : function(idx) {
		return this._ranges[idx]
	},
	getValue : function() {
		var cellValue, cellFormula;
		var activeCell = this._ranges[this._activeRange].getActiveCell();
		try {
			cellValue = this._pane.getCellUVal(activeCell.getX(), activeCell
							.getY());
			if (cellValue == undefined) {
				cellValue = ""
			}
		} catch (e) {
			cellValue = ""
		}
		try {
			cellFormula = this._pane.getCellFormula(activeCell.getX(),
					activeCell.getY());
			if (cellFormula == undefined) {
				cellFormula = ""
			}
		} catch (e) {
			cellFormula = ""
		}
		return [cellValue, cellFormula]
	},
	activeCellIsVisible : function() {
		var activeCell = this._ranges[this._activeRange].getActiveCell();
		return this._pane.isCellVisible(activeCell.getX(), activeCell.getY())
	},
	setMode : function(mode) {
		this._mode = mode
	},
	getMode : function() {
		return this._mode
	},
	isSingleCell : function() {
		return (this._ranges[this._activeRange].getUpperLeft()
				.equals(this._ranges[this._activeRange].getLowerRight()))
	},
	isSingleColumn : function() {
		return (this._ranges[this._activeRange].getUpperLeft()
				.equalsY(this._ranges[this._activeRange].getLowerRight()))
	},
	isSingleRow : function() {
		return (this._ranges[this._activeRange].getUpperLeft()
				.equalsX(this._ranges[this._activeRange].getLowerRight()))
	},
	getCell : function(numericX, numericY) {
		var cell = undefined;
		if (this._pane.isInsideRange(numericX, numericY)) {
			cell = this._pane.getCellByCoords(numericX, numericY)
		} else {
			var vPanes = this._sheet.getPanesByCoords(numericX, numericY);
			if (vPanes.length == 1 && vPanes[0] != this._pane) {
				cell = vPanes[0].getCellByCoords(numericX, numericY)
			}
		}
		return cell
	},
	setActiveCell : function(CellElement, x, y, saveLastCell) {
		var inputField = this._environment.shared.inputField;
		this._environment.shared.selectedCell = this.getCell(x, y);
		this._environment.shared.selectedCellCoords = [x, y];
		try {
			this._environment.shared.selectedCellValue = this._pane
					.getCellUVal(x, y);
			if (this._environment.shared.selectedCellValue == undefined) {
				this._environment.shared.selectedCellValue = ""
			}
			this._environment.shared.selectedCellFormula = this._pane
					.getCellFormula(x, y);
			if (this._environment.shared.selectedCellFormula == undefined) {
				this._environment.shared.selectedCellFormula = ""
			}
		} catch (Exception) {
			this._environment.shared.selectedCellValue = "";
			this._environment.shared.selectedCellFormula = ""
		}
		this._environment.shared.selectedRowNumericName = x;
		this._environment.shared.selectedColumnName = y;
		this._environment.shared.selectedAbsRowNameNumeric = dev.report.base.app.firstRowNumeric
				+ x - 1;
		this._environment.shared.selectedAbsColumnName = dev.report.base.app.firstColumn
				+ y - 1;
		this._environment.shared.selectedRowName = dev.report.base.app.numberToLetter[x];
		var value = this.getValue();
		dev.report.base.app.currCoord
				.setValue(this._environment.shared.selectedRowName
						+ this._environment.shared.selectedAbsColumnName);
		this._environment.shared.inputField.value = value[0];
		dev.report.base.app.currFormula.setValue((value[1] != "")
				? value[1]
				: dev.report.base.general.filterHLTags(x, y, value[0], false));
		try {
			this.getCursorField().cloneStyle();
			dev.report.base.style.syncBar()
		} catch (e) {
		}
	},
	setRefActiveCell : function(cell) {
		this._ranges[this._activeRange].setRefActiveCell(cell)
	},
	getRefActiveCell : function() {
		return this._ranges[this._activeRange].getRefActiveCell()
	},
	scrollToActiveCell : function(previousActiveCell) {
		var tmp = this._ranges[this._activeRange].getActiveCell();
		var offsets = [];
		offsets[0] = tmp.getX() - previousActiveCell.getX();
		offsets[1] = tmp.getY() - previousActiveCell.getY();
		if ((!((tmp.getX() >= dev.report.base.app.firstRowNumeric)))
				|| (((tmp.getX() == (dev.report.base.app.firstRowNumeric + 1)) && (offsets[0] < 0)))) {
			if (offsets[0] > 0) {
				dev.report.base.sheet.scrollXBy(Math.abs(offsets[0]),
						dev.report.base.grid.ScrollDirection.RIGHT)
			} else {
				if (offsets[0] < 0) {
					dev.report.base.sheet.scrollXBy(Math.abs(offsets[0]),
							dev.report.base.grid.ScrollDirection.LEFT)
				}
			}
		}
		if ((!((tmp.getY() >= dev.report.base.app.firstColumn)))
				|| (((tmp.getY() == (dev.report.base.app.firstColumn + 1)) && (offsets[1] < 0)))) {
			if (offsets[1] > 0) {
				dev.report.base.sheet.scrollYBy(Math.abs(offsets[1]),
						dev.report.base.grid.ScrollDirection.DOWN)
			} else {
				if (offsets[1] < 0) {
					dev.report.base.sheet.scrollYBy(Math.abs(offsets[1]),
							dev.report.base.grid.ScrollDirection.UP)
				}
			}
		}
	},
	_activeCellIsBevoreBoundary : function() {
		var activeCell = this._ranges[this._activeRange].getActiveCell();
		return ((activeCell.getX() == (dev.report.base.app.firstRowNumeric + 1)) || (activeCell
				.getY() == (dev.report.base.app.firstColumn + 1)))
	},
	_iterate : function(mode) {
		var newRangeSelected = false;
		var direction;
		var offsets = [];
		var visibleBefore = this._scope.activeCellIsVisible();
		var previousActiveCell = this._ranges[this._activeRange]
				.getActiveCell().clone();
		if (!this._isRect()) {
			switch (mode) {
				case dev.report.base.grid.IterationMode.NEXT :
				case dev.report.base.grid.IterationMode.NEXTY :
					if (this._ranges[this._activeRange].isLast()) {
						this._ranges[this._activeRange].deactivate();
						if (this._activeRange == this._ranges.length - 1) {
							this._activeRange = 0
						} else {
							this._activeRange++
						}
						this._ranges[this._activeRange].activate(direction);
						newRangeSelected = true;
						console.warn("previous range")
					}
					break;
				case dev.report.base.grid.IterationMode.PREV :
				case dev.report.base.grid.IterationMode.PREVY :
					if (this._ranges[this._activeRange].isFirst()) {
						this._ranges[this._activeRange].deactivate();
						if (this._activeRange === 0) {
							this._activeRange = this._ranges.length
						} else {
							this._activeRange--
						}
						this._ranges[this._activeRange].activate(direction);
						newRangeSelected = true;
						console.warn("previous range")
					}
					break
			}
		}
		if (!newRangeSelected) {
			switch (mode) {
				case dev.report.base.grid.IterationMode.NEXT :
					this._ranges[this._activeRange].next();
					break;
				case dev.report.base.grid.IterationMode.PREV :
					this._ranges[this._activeRange].prev();
					break;
				case dev.report.base.grid.IterationMode.NEXTY :
					this._ranges[this._activeRange].nextY();
					break;
				case dev.report.base.grid.IterationMode.PREVY :
					this._ranges[this._activeRange].prevY();
					break
			}
		}
		var activeCell = this._ranges[this._activeRange].getActiveCell(), that = this, cbScrollTo = function() {
			that._setLegacyVars();
			that.draw()
		};
		if (visibleBefore) {
			if (!this._pane.isCellVisible(activeCell.getX(), activeCell.getY())
					&& !this._pane._book._scrollPending) {
				this._pane.scrollTo([this, cbScrollTo], activeCell.getX(),
						activeCell.getY(), true, false)
			}
		} else {
			if (this._pane._book._scrollPending) {
				return
			}
			this._pane.scrollTo([this, cbScrollTo], activeCell.getX(),
					activeCell.getY(), false, false)
		}
	},
	setState : function(state) {
		if (state == dev.report.base.range.AreaState.NEW) {
			for (var i = this._ranges.length - 1; i >= 0; --i) {
				if (this._ranges[i].getState() == dev.report.base.range.AreaState.NEW) {
					this._ranges[i].setState(dev.report.base.range.AreaState.NORMAL);
					this._ranges[i].repaint()
				}
			}
		}
		if (this._activeRange in this._ranges) {
			this._ranges[this._activeRange].setState(state)
		}
	},
	expandToCell : function(cell) {
		this._ranges[this._activeRange].expandToCell(cell)
	},
	focusActiveCell : function() {
		var tmp = this._ranges[this._activeRange].getActiveCell();
		var gridUpperLeft = new dev.report.gen.Point(dev.report.base.app.firstRowNumeric,
				dev.report.base.app.firstColumn);
		if ((gridUpperLeft.getX()
				+ this._ranges[this._activeRange].getOffsets()[0] + 1 - tmp
				.getX()) > 0) {
			dev.report.base.sheet.scrollXBy(Math.abs(gridUpperLeft.getX()
							- tmp.getX() + 1),
					dev.report.base.grid.ScrollDirection.LEFT)
		}
		if ((gridUpperLeft.getY()
				+ this._ranges[this._activeRange].getOffsets()[0] + 1 - tmp
				.getY()) > 0) {
			dev.report.base.sheet.scrollYBy(Math.abs(gridUpperLeft.getY()
							- tmp.getY() + 1),
					dev.report.base.grid.ScrollDirection.UP)
		}
		if ((gridUpperLeft.getX()
				+ this._ranges[this._activeRange].getOffsets()[1] + 1 - tmp
				.getX()) < 0) {
			dev.report.base.sheet.scrollXBy(Math.abs(gridUpperLeft.getX()
							- tmp.getX() + 1),
					dev.report.base.grid.ScrollDirection.RIGHT)
		}
		if ((gridUpperLeft.getY()
				+ this._ranges[this._activeRange].getOffsets()[1] + 1 - tmp
				.getY()) < 0) {
			dev.report.base.sheet.scrollYBy(Math.abs(gridUpperLeft.getY()
							- tmp.getY() + 1),
					dev.report.base.grid.ScrollDirection.DOWN)
		}
	},
	next : function() {
		this._iterate(dev.report.base.grid.IterationMode.NEXT)
	},
	prev : function() {
		this._iterate(dev.report.base.grid.IterationMode.PREV)
	},
	nextY : function() {
		this._iterate(dev.report.base.grid.IterationMode.NEXTY)
	},
	prevY : function() {
		this._iterate(dev.report.base.grid.IterationMode.PREVY)
	},
	toString : function() {
		var s = "";
		s += "Mode: " + this._mode;
		s += " Ranges: ";
		for (var i = 0; i < this._ranges.length; i++) {
			s += this._ranges[i].toString()
		}
		return s
	},
	getFormula : function(makeAbs) {
		var i = 0, rngs = this._ranges, len = rngs.length, f = "=";
		for (; i < len; f = f.concat(rngs[i++].getValue(makeAbs))) {
		}
		return f
	},
	moveTo : function(x, y, mode) {
		this._ranges[this._activeRange].moveTo(x, y);
		this.checkForUndoneMarkers()
	},
	expandIfActive : function(amount, direction) {
		var status = this._ranges[this._activeRange].getStatus();
		if (status == dev.report.base.range.AreaStatus.RESIZING) {
			this.expand(amount, direction)
		}
	},
	expand : function(amount, direction) {
		this._ranges[this._activeRange].expand(amount, direction)
	},
	set : function(startPoint, endPoint) {
		if (this._isRect()) {
			if (!this._scope.activeCellIsVisible()) {
			}
			var range = this._ranges[this._activeRange], headerMarkMode = this._environment.shared.headerMarkMode, chkHiddenColRow = dev.report.base.general.chkHiddenColRow, realStartPoint = startPoint
					.clone(), realEndPoint = endPoint.clone();
			this._selectionChanged = true;
			startPoint.setX(chkHiddenColRow(false, startPoint.getX(), 0, true));
			startPoint.setY(chkHiddenColRow(true, startPoint.getY(), 0, true));
			endPoint.setX(chkHiddenColRow(false, endPoint.getX(), 0, false));
			endPoint.setY(chkHiddenColRow(true, endPoint.getY(), 0, false));
			range.set(startPoint, endPoint, realStartPoint, realEndPoint);
			if ((startPoint.getX() > endPoint.getX())
					|| (startPoint.getY() > endPoint.getY())) {
				this._ranges[this._activeRange].toggleCoords()
			}
			var isSingleCell = this.isSingleCell(), defMaxCoords = dev.report.base.grid.defMaxCoords, idclNS = dev.report.base.app[dev.report.base.app.menubar
					? "menubar"
					: "toolbar"];
			if (!isSingleCell && endPoint.getX() == defMaxCoords[0]
					&& endPoint.getY() == defMaxCoords[1]) {
				range.setActiveCell(new dev.report.gen.Point(this._pane
								.getCoordsFirstVCell()[0], this._pane
								.getCoordsFirstVCell()[1]));
				idclNS.insRow.disable();
				idclNS.insCol.disable();
				idclNS.delRow.disable();
				idclNS.delCol.disable()
			} else {
				if (!isSingleCell && endPoint.getX() == defMaxCoords[0]) {
					range
							.setActiveCell(new dev.report.gen.Point(chkHiddenColRow(
											false, this._pane
													.getCoordsFirstVCell()[0],
											0, true), startPoint.getY()));
					idclNS.insCol.disable();
					idclNS.delCol.disable()
				} else {
					if (!isSingleCell && endPoint.getY() == defMaxCoords[1]) {
						range.setActiveCell(new dev.report.gen.Point(startPoint
										.getX(), chkHiddenColRow(true,
										this._pane.getCoordsFirstVCell()[1], 0,
										true)));
						idclNS.insRow.disable();
						idclNS.delRow.disable()
					} else {
						range.setActiveCell(startPoint);
						idclNS.insRow.enable();
						idclNS.insCol.enable();
						idclNS.delRow.enable();
						idclNS.delCol.enable()
					}
				}
			}
			if (!((headerMarkMode == "column" && startPoint.getX() != endPoint
					.getX()) || (headerMarkMode == "row" && startPoint.getY() != endPoint
					.getY()))) {
				this._setLegacyVars()
			}
		}
	},
	fillContent : function(amount, direction, mode) {
		if (!this._isRect()) {
		}
	},
	getActiveRange : function() {
		return this._ranges[this._activeRange]
	},
	getState : function() {
		return this._ranges[this._activeRange].getState()
	},
	getState : function() {
		return _state
	},
	moveCells : function(amount, direction, mode) {
		if (!this._isRect()) {
		}
	},
	removeAll : function() {
		for (var i = this._ranges.length - 1; i >= 0; this.removeRange(i--)) {
		}
		this.lastParseRes = []
	},
	addRange : function(startPoint, endPoint) {
		return this._ranges.push(new dev.report.base.grid.Range(this, startPoint,
				endPoint))
	},
	setActiveRange : function(rangeId) {
		if (typeof rangeId == "object") {
			var idx = this._ranges.indexOf(rangeId);
			if (idx >= 0) {
				this._activeRange = idx
			}
			return
		}
		if ((rangeId >= 0) && (rangeId < this._ranges.length)) {
			this._activeRange = rangeId
		} else {
			throw new Error("Invalid range id: ", rangeId)
		}
	},
	registerForMouseMovement : function(element) {
		if (this._activeRange in this._ranges) {
			this._ranges[this._activeRange].registerForMouseMovement(element)
		}
	},
	setVisibility : function(visibility) {
		for (var i = 0; i < this._ranges.length; i++) {
			this._scope.setActiveRange(i);
			this._ranges[this._activeRange].setVisibility(visibility)
		}
	},
	draw : function() {
		for (var i = 0; i < this._ranges.length; i++) {
			this._scope.setActiveRange(i);
			this._ranges[this._activeRange].draw()
		}
	},
	removeRange : function(id) {
		if (this._ranges[id]) {
			this._ranges[id].destruct();
			this._ranges.splice(id, 1);
			return true
		} else {
			console.warn("invalid range id: ", id);
			return false
		}
	},
	_clearHeaderMarkers : function(clearAll, type) {
		if ((clearAll || type == dev.report.base.grid.headerType.COLUMN)
				&& (this.dynarange || this._headerState.colActive || this._headerState.colSelected)) {
			this._sheet.activateHdrAll(dev.report.base.grid.headerType.COLUMN,
					"gridColHdr");
			this._headerState.colActive = false;
			this._headerState.colSelected = false
		}
		if ((clearAll || type == dev.report.base.grid.headerType.ROW)
				&& (this.dynarange || this._headerState.rowActive || this._headerState.rowSelected)) {
			this._sheet.activateHdrAll(dev.report.base.grid.headerType.ROW,
					"gridRowHdr");
			this._headerState.rowActive = false;
			this._headerState.rowSelected = false
		}
	},
	checkForUndoneMarkers : function(force) {
		if (!this._selectionChanged && !(force != undefined && force)) {
			return
		}
		if (this.isSingleCell()) {
			var dimensions = this.getActiveRange().getCorners(), mergeInfo = this._pane
					.getMergeInfo(dimensions[0].getX(), dimensions[0].getY());
			if (mergeInfo != undefined && mergeInfo) {
				this.drawMarkers([
						dimensions[0],
						new dev.report.gen.Point(dimensions[0].getX() + mergeInfo[1]
										- 1, dimensions[0].getY()
										+ mergeInfo[2] - 1)])
			} else {
				this._clearHeaderMarkers(true, null);
				this._sheet.activateHdr(dev.report.base.grid.headerType.COLUMN,
						dimensions[0].getX(), "col_active");
				this._sheet.activateHdr(dev.report.base.grid.headerType.ROW,
						dimensions[0].getY(), "row_active")
			}
		} else {
			if (this.dynarange) {
				this._clearHeaderMarkers(true, null)
			}
			this.drawMarkers()
		}
		this._selectionChanged = false
	},
	drawMarkers : function(rng) {
		var dimensions = (rng != undefined) ? rng : this.getActiveRange()
				.getCorners();
		if (dimensions[0].getX() == 1
				&& dimensions[1].getX() == dev.report.base.grid.defMaxCoords[0]) {
			this._sheet.activateHdrAll(dev.report.base.grid.headerType.COLUMN,
					"gridColHdr "
							+ ((this._environment.shared.headerStyle == 1)
									? "col_selected"
									: "col_active"));
			this._headerState.colActive = true
		} else {
			this._sheet
					.activateHdrRng(
							dev.report.base.grid.headerType.COLUMN,
							[dimensions[0].getX(), dimensions[1].getX()],
							(!this.dynarange && (this._environment.shared.headerStyle == 1
									|| this._environment.shared.headerStyle == 3 || (dimensions[0]
									.getY() == 1 && dimensions[1].getY() == dev.report.base.grid.defMaxCoords[1])))
									? "col_selected"
									: "col_active")
		}
		if (dimensions[0].getY() == 1
				&& dimensions[1].getY() == dev.report.base.grid.defMaxCoords[1]) {
			this._sheet.activateHdrAll(dev.report.base.grid.headerType.ROW,
					"gridRowHdr "
							+ ((this._environment.shared.headerStyle == 1)
									? "row_selected"
									: "row_active"));
			this._headerState.rowActive = true
		} else {
			this._sheet
					.activateHdrRng(
							dev.report.base.grid.headerType.ROW,
							[dimensions[0].getY(), dimensions[1].getY()],
							(!this.dynarange && (this._environment.shared.headerStyle == 1
									|| this._environment.shared.headerStyle == 2 || (dimensions[0]
									.getX() == 1 && dimensions[1].getX() == dev.report.base.grid.defMaxCoords[0])))
									? "row_selected"
									: "row_active")
		}
	},
	updateRangeSelector : function() {
		if ((this._environment.shared.lastRangeStartCoord[0] == this._environment.shared.lastRangeEndCoord[0])
				&& (this._environment.shared.lastRangeStartCoord[1] == this._environment.shared.lastRangeEndCoord[1])) {
			dev.report.base.app.currCoord
					.setValue(dev.report.base.app.numberToLetter[this._environment.shared.selectedCellCoords[0]]
							+ this._environment.shared.selectedCellCoords[1])
		} else {
			dev.report.base.app.currCoord
					.setValue(((this._environment.shared.lastRangeEndCoord[1] - this._environment.shared.lastRangeStartCoord[1]) + 1)
							+ "R x "
							+ ((this._environment.shared.lastRangeEndCoord[0] - this._environment.shared.lastRangeStartCoord[0]) + 1)
							+ "C")
		}
	},
	emptyCellContent : function() {
		var rngClearType = dev.report.base.range.ContentType, rng;
		this._environment.shared.inputField.value = "";
		this._environment.shared.selectedCellValue = "";
		dev.report.base.app.currFormula.setValue("");
		this.getCursorField().setContent("");
		if (this.isSingleCell()) {
			this._clearHeaderMarkers(true, null);
			var selCoords = this._environment.shared.selectedCellCoords;
			this._sheet.activateHdr(dev.report.base.grid.headerType.COLUMN,
					selCoords[0], "col_active");
			this._sheet.activateHdr(dev.report.base.grid.headerType.ROW,
					selCoords[1], "row_active");
			rng = [selCoords[0], selCoords[1], selCoords[0], selCoords[1]]
		} else {
			var rngCorners = this.getActiveRange().getCorners();
			rng = [rngCorners[0].getX(), rngCorners[0].getY(),
					rngCorners[1].getX(), rngCorners[1].getY()]
		}
		this._pane.clrRange(rng, rngClearType.FORMULA | rngClearType.ATTRS)
	},
	selectOrResize : function(myEvent) {
		var myElement, elemData, col, row, env = this._environment.shared, XOffset = 5, YOffset = 5, headerType = dev.report.base.grid.headerType, hdrPane;
		env.inputField.blur();
		if (document.all) {
			myEvent = window.event
		}
		var isRightClick = myEvent.button == 2
				|| (Ext.isMac && myEvent.button == 0 && dev.report.base.app.ctrlKeyPressed);
	
		if (isRightClick) {
			var defMaxCoords = dev.report.base.grid.defMaxCoords, rngCorners = this
					.getActiveRange().getCorners();
			if ((rngCorners[0].getX() == 1
					&& rngCorners[1].getX() == defMaxCoords[0] && rngCorners[0]
					.getY() != rngCorners[1].getY())
					|| (rngCorners[0].getY() == 1
							&& rngCorners[1].getY() == defMaxCoords[1] && rngCorners[0]
							.getX() != rngCorners[1].getX())) {
				dev.report.base.mouse.showMainCntxMenu(myEvent);
				return
			}
		}
		if (myEvent.detail == 2) {
			return
		}
		myElement = (document.all) ? myEvent.srcElement : myEvent.target;
	
		col = (myElement.parentNode.className == "gridColHdrsIC") ? this._sheet
				.locateHdr(headerType.COLUMN, myElement) : 0;
		if (col != 0) {
			hdrPane = col[1], col = col[0]
		}
		row = (myElement.parentNode.className == "gridRowHdrsIC") ? this._sheet
				.locateHdr(headerType.ROW, myElement) : 0;
		if (row != 0) {
			hdrPane = row[1], row = row[0]
		}
		if (dev.report.base.app.mouseButton1Down) {

			dev.report.base.mouse.fetchGlobalMouseMove(myEvent)
		} else {
			
			if (env.mousePosition == "colResize" && !isRightClick) {
				var targetOffsetX = (document.all)
						? myEvent.offsetX
						: myEvent.layerX, inXOffset = targetOffsetX <= XOffset, oldElement;

				if (inXOffset) {
					oldElement = myElement;
					myElement = this._sheet.getHdrByCoord(headerType.COLUMN,
							--col, hdrPane)
				} else {
					targetOffsetX = targetOffsetX - myElement.offsetWidth				
				}

				if (myElement) {
					dev.report.base.mouse.startHeaderResize(headerType.COLUMN,
							myElement, col, myEvent.clientX, targetOffsetX,
							hdrPane);
					return
				} else {
					if (inXOffset) {
						myElement = oldElement;
						col++
					}
					env.mousePosition = "colMark"
				}
			}
			if (env.mousePosition == "rowResize" && !isRightClick) {
				var targetOffsetY = (document.all)
						? myEvent.offsetY
						: myEvent.layerY, inYOffset = targetOffsetY <= YOffset, oldElement;
				if (inYOffset) {
					oldElement = myElement;
					myElement = this._sheet.getHdrByCoord(headerType.ROW,
							--row, hdrPane)
				} else {
					targetOffsetY = targetOffsetY - myElement.offsetHeight
				}
				if (myElement) {
					dev.report.base.mouse.startHeaderResize(headerType.ROW,
							myElement, row, myEvent.clientY, targetOffsetY,
							hdrPane);
					return
				} else {
					if (inYOffset) {
						myElement = oldElement;
						row++
					}
					env.mousePosition = "rowMark"
				}
			}
			dev.report.base.mouse.showCursorLayer((env.mousePosition == "rowMark")
					? "marker_multirow_select"
					: "marker_multicol_select");
			dev.report.base.mouse.calcGridScreenCoords(myEvent, myElement, null,
					hdrPane);
			if (env.mousePosition == "rowMark"
					|| (env.mousePosition == "rowResize" && isRightClick)) {
				var visCell = hdrPane.getCoordsFirstVCell();
				var visRange = hdrPane.getVisibleRange(headerType.ROW);
				++visRange[1];
				var visRangeDim = new Object();
				visRangeDim[visRange[0] - 1] = env.gridScreenCoords[0][1];
				for (var i = visRange[0]; i <= visRange[1]; ++i) {
					visRangeDim[i] = visRangeDim[i - 1]
							+ hdrPane.getCellDims(visCell[0], i)[1]
				}
				this._hdrSel = {
					coordBegin : row,
					coordEnd : row,
					screenBegin : visRangeDim[row - 1],
					screenEnd : visRangeDim[row],
					coordCurr : row,
					coordInit : row,
					visRange : visRange,
					visOposRangeBegin : visCell[0],
					visRangeDim : visRangeDim
				};
				this._calcHdrRngs(headerType.ROW, hdrPane);
				env.headerMarkMode = "row";
				env.headerStyle = env.lastMarkMode = 2;
				this._clearHeaderMarkers(false, headerType.ROW);
				this
						.set(	new dev.report.gen.Point(
										dev.report.base.app.firstRowNumeric, row),
								new dev.report.gen.Point(
										dev.report.base.grid.defMaxCoords[0], row));
				this.draw();
				this.getActiveRange().reposBgndMask(false)
			} else {
				if (env.mousePosition == "colMark"
						|| (env.mousePosition == "colResize" && isRightClick)) {
					var visCell = hdrPane.getCoordsFirstVCell();
					var visRange = hdrPane.getVisibleRange(headerType.COLUMN);
					++visRange[1];
					var visRangeDim = new Object();
					visRangeDim[visRange[0] - 1] = env.gridScreenCoords[0][0];
					for (var i = visRange[0]; i <= visRange[1]; ++i) {
						visRangeDim[i] = visRangeDim[i - 1]
								+ hdrPane.getCellDims(i, visCell[1])[0]
					}
					this._hdrSel = {
						coordBegin : col,
						coordEnd : col,
						screenBegin : visRangeDim[col - 1],
						screenEnd : visRangeDim[col],
						coordCurr : col,
						coordInit : col,
						visRange : visRange,
						visOposRangeBegin : visCell[1],
						visRangeDim : visRangeDim
					};
					this._calcHdrRngs(headerType.COLUMN, hdrPane);
					env.headerMarkMode = "column";
					env.headerStyle = env.lastMarkMode = 3;
					this._clearHeaderMarkers(false, headerType.COLUMN);
					this
							.set(	new dev.report.gen.Point(col,
											dev.report.base.app.firstColumn),
									new dev.report.gen.Point(col,
											dev.report.base.grid.defMaxCoords[1]));
					this.draw();
					this.getActiveRange().reposBgndMask(false)
				}
			}
		}
		if (isRightClick) {
			dev.report.base.mouse.showMainCntxMenu(myEvent)
		}
	},
	_calcHdrRngs : function(hdrType, pane) {
		var env = this._environment.shared, isRow = hdrType == dev.report.base.grid.headerType.ROW, hdrDim = isRow
				? 1
				: 0, secHdrPaneId = -1;
		if (pane) {
			this._hdrRngs.pane = pane
		}
		this._hdrRngs.panes = [0];
		this._hdrRngs.visRange = [this._panes[0].getVisibleRange(hdrType)];
		if (this._sheet[isRow ? "_rowHdrs1" : "_colHdrs1"]) {
			secHdrPaneId = isRow ? (this._panes.length > 2 ? 2 : 1) : 1;
			this._hdrRngs.panes.push(secHdrPaneId);
			this._hdrRngs.visRange.push(this._panes[secHdrPaneId]
					.getVisibleRange(hdrType))
		}
		var fixCoord = this._hdrSel.visOposRangeBegin, visRangeDim = new Object();
		if (this._hdrRngs.pane._id) {
			visRangeDim[this._hdrRngs.visRange[0][1]] = env.gridScreenCoords[0][hdrDim];
			for (var i = this._hdrRngs.visRange[1][0], iPeer = this._hdrRngs.visRange[0][1]; i <= this._hdrRngs.visRange[1][1]; iPeer = i++) {
				visRangeDim[i] = visRangeDim[iPeer]
						+ this._panes[this._hdrRngs.panes[1]].getCellDims(isRow
										? fixCoord
										: i, isRow ? i : fixCoord)[hdrDim]
			}
			visRangeDim[this._hdrRngs.visRange[0][1]]--;
			for (i = this._hdrRngs.visRange[0][1]; i >= this._hdrRngs.visRange[0][0]; i--) {
				visRangeDim[i - 1] = visRangeDim[i]
						- this._panes[0].getCellDims(isRow ? fixCoord : i,
								isRow ? i : fixCoord)[hdrDim]
			}
		} else {
			visRangeDim[this._hdrRngs.visRange[0][0] - 1] = env.gridScreenCoords[0][hdrDim];
			for (var i = 0, brdOffset = 0, j, jPeer, panesLen = this._hdrRngs.panes.length; i < panesLen; i++, brdOffset++) {
				for (j = this._hdrRngs.visRange[i][0], jPeer = i ? jPeer : j
						- 1; j <= this._hdrRngs.visRange[i][1]; jPeer = j++) {
					visRangeDim[j] = visRangeDim[jPeer]
							+ this._panes[this._hdrRngs.panes[i]].getCellDims(
									isRow ? fixCoord : j, isRow ? j : fixCoord)[hdrDim]
							+ brdOffset
				}
			}
		}
		this._hdrRngs.visRangeDim = visRangeDim
	},
	_refreshElement : function(scope, range) {
		range.draw()
	},
	_hdrMarkOnScroll : function(pane, type, direction, firstVisCoord,
			lastVisCoord, scrollTimeout) {
		var scope = this;
		var env = this._environment.shared;
		var headerSelected = this._hdrSel;
		var scrollType = dev.report.base.grid.scrollType;
		var scrollDir = dev.report.base.grid.ScrollDirection;
		var defMaxCoords = dev.report.base.grid.defMaxCoords;
		var selection = env.defaultSelection;
		var range = selection.getActiveRange();
		var rangeCoords = range.getCorners();
		var _hdrResizeLeft = function() {
			var nmcDelta = Math.abs(headerSelected.coordCurr - firstVisCoord
					- ((firstVisCoord == 1) ? 0 : 1));
			headerSelected.coordCurr -= nmcDelta;
			headerSelected.screenBegin = headerSelected.visRangeDim[headerSelected.coordCurr
					- 1];
			headerSelected.screenEnd = headerSelected.visRangeDim[headerSelected.coordCurr];
			if (headerSelected.coordCurr > rangeCoords[0].getX()) {
				selection.expand(nmcDelta * -1, scrollDir.RIGHT);
				headerSelected.coordEnd = headerSelected.coordCurr
			} else {
				selection.expand(nmcDelta, scrollDir.LEFT);
				headerSelected.coordBegin = headerSelected.coordCurr;
				headerSelected.coordEnd = headerSelected.coordInit
			}
			scope._refreshElement(scope, range)
		};
		var _hdrResizeRight = function() {
			var nmcDelta = Math.abs(lastVisCoord - headerSelected.coordCurr
					- ((lastVisCoord == defMaxCoords[0]) ? 0 : 1));
			headerSelected.coordCurr += nmcDelta;
			headerSelected.screenBegin = headerSelected.visRangeDim[headerSelected.coordCurr
					- 1];
			headerSelected.screenEnd = headerSelected.visRangeDim[headerSelected.coordCurr];
			if (headerSelected.coordCurr < rangeCoords[1].getX()) {
				selection.expand(nmcDelta * -1, scrollDir.LEFT);
				headerSelected.coordBegin = headerSelected.coordCurr
			} else {
				selection.expand(nmcDelta, scrollDir.RIGHT);
				headerSelected.coordEnd = headerSelected.coordCurr;
				headerSelected.coordBegin = headerSelected.coordInit
			}
			scope._refreshElement(scope, range)
		};
		var _hdrResizeDown = function() {
			var nmcDelta = Math.abs(lastVisCoord - headerSelected.coordCurr
					- ((lastVisCoord == defMaxCoords[1]) ? 0 : 1));
			headerSelected.coordCurr += nmcDelta;
			headerSelected.screenBegin = headerSelected.visRangeDim[headerSelected.coordCurr
					- 1];
			headerSelected.screenEnd = headerSelected.visRangeDim[headerSelected.coordCurr];
			if (headerSelected.coordCurr < rangeCoords[1].getY()) {
				selection.expand(nmcDelta * -1, scrollDir.UP);
				headerSelected.coordBegin = headerSelected.coordCurr
			} else {
				selection.expand(nmcDelta, scrollDir.DOWN);
				headerSelected.coordEnd = headerSelected.coordCurr;
				headerSelected.coordBegin = headerSelected.coordInit
			}
			scope._refreshElement(scope, range)
		};
		var _hdrResizeUp = function() {
			var nmcDelta = Math.abs(headerSelected.coordCurr - firstVisCoord
					- ((firstVisCoord == 1) ? 0 : 1));
			headerSelected.coordCurr -= nmcDelta;
			headerSelected.screenBegin = headerSelected.visRangeDim[headerSelected.coordCurr
					- 1];
			headerSelected.screenEnd = headerSelected.visRangeDim[headerSelected.coordCurr];
			if (headerSelected.coordCurr > rangeCoords[0].getY()) {
				selection.expand(nmcDelta * -1, scrollDir.DOWN);
				headerSelected.coordEnd = headerSelected.coordCurr
			} else {
				selection.expand(nmcDelta, scrollDir.UP);
				headerSelected.coordBegin = headerSelected.coordCurr;
				headerSelected.coordEnd = headerSelected.coordInit
			}
			scope._refreshElement(scope, range)
		};
		var _incVisRange = function(pane, dim) {
			if (dim == 0) {
				var delItemDim = pane.getCellDims(headerSelected.visRange[0],
						headerSelected.visOposRangeBegin)[dim]
			} else {
				var delItemDim = pane.getCellDims(
						headerSelected.visOposRangeBegin,
						headerSelected.visRange[0])[dim]
			}
			for (var i = headerSelected.visRange[0] + 1; i <= headerSelected.visRange[1]; ++i) {
				headerSelected.visRangeDim[i] -= delItemDim
			}
			delete headerSelected.visRangeDim[headerSelected.visRange[0]];
			++headerSelected.visRange[0];
			++headerSelected.visRange[1];
			headerSelected.visRangeDim[headerSelected.visRange[1]] = headerSelected.visRangeDim[headerSelected.visRange[1]
					- 1]
					+ pane.getCellDims(headerSelected.visRange[1],
							headerSelected.visOposRangeBegin)[dim]
		};
		var _decVisRange = function(pane, dim) {
			if (dim == 0) {
				var insItemDim = pane.getCellDims(headerSelected.visRange[0]
								- 1, headerSelected.visOposRangeBegin)[dim]
			} else {
				var insItemDim = pane.getCellDims(
						headerSelected.visOposRangeBegin,
						headerSelected.visRange[0] - 1)[dim]
			}
			for (var i = headerSelected.visRange[0]; i < headerSelected.visRange[1]; ++i) {
				headerSelected.visRangeDim[i] += insItemDim
			}
			delete headerSelected.visRangeDim[headerSelected.visRange[1]];
			--headerSelected.visRange[0];
			--headerSelected.visRange[1];
			headerSelected.visRangeDim[headerSelected.visRange[0]] = env.gridScreenCoords[0][dim]
					+ insItemDim
		};
		if (type == scrollType.HORIZ) {
			if (direction == dev.report.base.grid.horScrollDir.RIGHT) {
				_incVisRange(pane, 0);
				if (headerSelected.coordCurr < lastVisCoord - 1) {
					_hdrResizeRight()
				}
				if (lastVisCoord == defMaxCoords[0]) {
					env.autoScroll.scrollElem = setTimeout(_hdrResizeRight,
							scrollTimeout)
				}
			} else {
				_decVisRange(pane, 0);
				if (headerSelected.coordCurr > firstVisCoord + 1) {
					_hdrResizeLeft()
				}
				if (firstVisCoord == 1) {
					env.autoScroll.scrollElem = setTimeout(_hdrResizeLeft,
							scrollTimeout)
				}
			}
		} else {
			if (direction == dev.report.base.grid.vertScrollDir.DOWN) {
				_incVisRange(pane, 1);
				if (headerSelected.coordCurr < lastVisCoord - 1) {
					_hdrResizeDown()
				}
				if (lastVisCoord == defMaxCoords[1]) {
					env.autoScroll.scrollElem = setTimeout(_hdrResizeDown,
							scrollTimeout)
				}
			} else {
				_decVisRange(pane, 1);
				if (headerSelected.coordCurr > firstVisCoord + 1) {
					_hdrResizeUp()
				}
				if (firstVisCoord == 1) {
					env.autoScroll.scrollElem = setTimeout(_hdrResizeUp,
							scrollTimeout)
				}
			}
		}
	},
	_rszHdrIncCoord : function(cb, pos, hdrType, maxPos, rclcHdrDims) {
		if (rclcHdrDims) {
			this._calcHdrRngs(hdrType)
		}
		var headerType = dev.report.base.grid.headerType, hdrSel = this._hdrSel, hdrRngs = this._hdrRngs, isRow = hdrType == headerType.ROW, hdrDim = isRow
				? 1
				: 0;
		while (pos > hdrRngs.visRangeDim[hdrSel.coordCurr]) {
			if (hdrSel.coordCurr < maxPos) {
				++hdrSel.coordCurr;
				if (hdrRngs.panes.length > 1
						&& hdrSel.coordCurr == hdrRngs.visRange[0][1] + 1
						&& !this._panes[isRow
								? (this._panes.length > 2 ? 2 : 1)
								: 1].isCellVisible(isRow
										? hdrSel.visOposRangeBegin
										: hdrSel.coordCurr, isRow
										? hdrSel.coordCurr
										: hdrSel.visOposRangeBegin)) {
					this._panes[isRow ? (this._panes.length > 2 ? 2 : 1) : 1]
							.scrollTo([this, this._rszHdrIncCoord, cb, pos,
											hdrType, maxPos, true], (isRow
											? hdrSel.visOposRangeBegin
											: hdrSel.coordCurr), (isRow
											? hdrSel.coordCurr
											: hdrSel.visOposRangeBegin), true,
									false);
					return
				}
			} else {
				return
			}
		}
		if (hdrSel.coordCurr > hdrSel.coordEnd) {
			hdrSel.coordEnd = hdrSel.coordCurr;
			hdrSel.coordBegin = hdrSel.coordInit
		} else {
			hdrSel.coordBegin = hdrSel.coordCurr
		}
		hdrSel.screenBegin = hdrRngs.visRangeDim[hdrSel.coordCurr - 1];
		hdrSel.screenEnd = hdrRngs.visRangeDim[hdrSel.coordCurr];
		if (cb instanceof Array && cb.length > 1) {
			cb[1].call(cb[0])
		}
	},
	_rszHdrDecCoord : function(cb, pos, hdrType) {
		var headerType = dev.report.base.grid.headerType, hdrSel = this._hdrSel, hdrRngs = this._hdrRngs;
		do {
			if (hdrSel.coordCurr > 1) {
				--hdrSel.coordCurr
			} else {
				return
			}
		} while (pos < hdrRngs.visRangeDim[hdrSel.coordCurr - 1]);
		if (hdrSel.coordCurr < hdrSel.coordBegin) {
			hdrSel.coordBegin = hdrSel.coordCurr;
			hdrSel.coordEnd = hdrSel.coordInit
		} else {
			hdrSel.coordEnd = hdrSel.coordCurr
		}
		hdrSel.screenBegin = hdrRngs.visRangeDim[hdrSel.coordCurr - 1];
		hdrSel.screenEnd = hdrRngs.visRangeDim[hdrSel.coordCurr];
		if (cb instanceof Array && cb.length > 1) {
			cb[1].call(cb[0])
		}
	},
	_rszHdrCol_post : function() {
		var hdrSel = this._hdrSel, rng = this.getActiveRange();
		this.set(new dev.report.gen.Point(hdrSel.coordBegin,
						dev.report.base.app.firstColumn), new dev.report.gen.Point(
						hdrSel.coordEnd, dev.report.base.grid.defMaxCoords[1]));
		rng.setActiveCell(new dev.report.gen.Point(hdrSel.coordInit, rng
						.getActiveCell().getY()));
		this.draw();
		this.updateRangeSelector();
		this._environment.shared.headerStyle = 3
	},
	_rszHdrRow_post : function() {
		var hdrSel = this._hdrSel, rng = this.getActiveRange();
		this.set(new dev.report.gen.Point(dev.report.base.app.firstRowNumeric,
						hdrSel.coordBegin), new dev.report.gen.Point(
						dev.report.base.grid.defMaxCoords[0], hdrSel.coordEnd));
		rng.setActiveCell(new dev.report.gen.Point(rng.getActiveCell().getX(),
				hdrSel.coordInit));
		this.draw();
		this.updateRangeSelector();
		this._environment.shared.headerStyle = 2
	},
	resizeByHeader : function(ev) {
		var env = this._environment.shared, gridScreenCoords = env.gridScreenCoords, headerSelected = this._hdrSel, hdrRngs = this._hdrRngs, grid = dev.report.base.grid, selection = this, range = this
				.getActiveRange(), rngLen = hdrRngs.panes.length;
		if (env.headerMarkMode == "column") {
			env.autoScroll.checkAndScroll(ev, this._hdrMarkOnScroll,
					grid.scrollType.HORIZ, null, this);
			var xPos = dev.report.base.app.xPos;
			if (xPos < headerSelected.screenBegin
					&& xPos > hdrRngs.visRangeDim[hdrRngs.visRange[0][0] - 1]) {
				this._rszHdrDecCoord([this, this._rszHdrCol_post], xPos,
						dev.report.base.grid.headerType.COLUMN)
			} else {
				if (xPos > headerSelected.screenEnd
						&& xPos < hdrRngs.visRangeDim[hdrRngs.visRange[rngLen
								- 1][1]]) {
					this._rszHdrIncCoord([this, this._rszHdrCol_post], xPos,
							dev.report.base.grid.headerType.COLUMN,
							grid.defMaxCoords[0])
				} else {
					return
				}
			}
		} else {
			if (env.headerMarkMode == "row") {
				env.autoScroll.checkAndScroll(ev, this._hdrMarkOnScroll,
						grid.scrollType.VERT, null, this);
				var yPos = dev.report.base.app.yPos;
				if (yPos < headerSelected.screenBegin
						&& yPos > hdrRngs.visRangeDim[hdrRngs.visRange[0][0]
								- 1]) {
					this._rszHdrDecCoord([this, this._rszHdrRow_post], yPos,
							dev.report.base.grid.headerType.ROW)
				} else {
					if (yPos > headerSelected.screenEnd
							&& yPos < hdrRngs.visRangeDim[hdrRngs.visRange[rngLen
									- 1][1]]) {
						this._rszHdrIncCoord([this, this._rszHdrRow_post],
								yPos, dev.report.base.grid.headerType.ROW,
								grid.defMaxCoords[1])
					} else {
						return
					}
				}
			}
		}
	},
	getSelHeaderFromRange : function(type, resizedHdr) {
		var headerType = dev.report.base.grid.headerType;
		var defRngCoords = this.getActiveRange().getCorners();
		if (type == headerType.COLUMN && defRngCoords[0].getY() == 1
				&& defRngCoords[1].getY() == dev.report.base.grid.defMaxCoords[1]
				&& resizedHdr >= defRngCoords[0].getX()
				&& resizedHdr <= defRngCoords[1].getX()) {
			return [[defRngCoords[0].getX(), defRngCoords[1].getX()]]
		} else {
			if (type == headerType.ROW && defRngCoords[0].getX() == 1
					&& defRngCoords[1].getX() == dev.report.base.grid.defMaxCoords[0]
					&& resizedHdr >= defRngCoords[0].getY()
					&& resizedHdr <= defRngCoords[1].getY()) {
				return [[defRngCoords[0].getY(), defRngCoords[1].getY()]]
			} else {
				return [[resizedHdr, resizedHdr]]
			}
		}
	},
	markAllCells : function() {
		var env = this._environment.shared;
		if (env.inputMode == dev.report.base.grid.GridMode.READY) {
			var defMaxCoords = dev.report.base.grid.defMaxCoords;
			env.headerMarkMode = "all";
			env.lastMarkMode = 1;
			env.headerStyle = 1;
			this.set(new dev.report.gen.Point(1, 1), new dev.report.gen.Point(
							defMaxCoords[0], defMaxCoords[1]));
			this.draw()
		} else {
			env.inputField.blur()
		}
	},
	_positionRng : function(x, y) {
		var that = this, cbScrollTo = function() {
			that.set(new dev.report.gen.Point(x, y), new dev.report.gen.Point(x, y));
			that.draw()
		};
		if (this._pane._book._scrollPending) {
			return
		}
		this._pane.scrollTo([this, cbScrollTo], x, y, false, false)
	},
	selectFirstCell : function() {
		this._positionRng(1, 1)
	},
	selectFirstVisCell : function() {
		var fvcCoords = this._pane.getCoordsFirstVCell();
		this._positionRng(fvcCoords[0], fvcCoords[1])
	},
	_copyAndCutImpl : function(op, copyToClp) {
		var env = this._environment.shared, startCoords = env.lastRangeStartCoord, endCoords = env.lastRangeEndCoord, endCoordsCopy = [
				endCoords[0], endCoords[1]], startPnt = new dev.report.gen.Point(
				startCoords[0], startCoords[1]), endPnt = new dev.report.gen.Point(
				endCoords[0], endCoords[1]), copySel = dev.report.base.app.copySelection;
		if (copySel != null) {
			copySel.removeAll()
		}
		copySel = env.copySelection;
		copySel.addRange(startPnt);
		copySel.setActiveRange(copySel.getRanges().length - 1);
		copySel.setState(dev.report.base.range.AreaState.NEW);
		copySel.set(startPnt, endPnt);
		copySel.draw();
		dev.report.base.app.copySelection = copySel;
		if (startPnt.equals(endPnt)) {
			var mergeInfoStart = this._pane.getMergeInfo(startPnt.getX(),
					startPnt.getY());
			if (mergeInfoStart) {
				endCoordsCopy = [startPnt.getX() + mergeInfoStart[1] - 1,
						startPnt.getY() + mergeInfoStart[2] - 1]
			}
		}
		var table=dev.report.model.report.tabMap;
		dev.report.base.app.clipboard = {
			id : table.copyCut(
							op == dev.report.base.grid.gridOperation.COPY
									? "cprn"
									: "ctrn",
							[startCoords[0], startCoords[1], endCoordsCopy[0],
									endCoordsCopy[1]])[0][1][0],
			op : op,
			value : null
		};
		if (copyToClp) {
			var clpVal = "", isFirst = true;
			for (var i = startCoords[1]; i <= endCoords[1]; i++, isFirst = true, clpVal = clpVal
					.concat("\r\n")) {
				for (var j = startCoords[0]; j <= endCoords[0]; j++) {
					cellVal = this._pane.getCellValue(j, i);
					if (isFirst) {
						isFirst = false
					} else {
						clpVal = clpVal.concat("\t")
					}
					clpVal = clpVal.concat((cellVal == undefined)
							? ""
							: cellVal)
				}
			}
			dev.report.base.general.setSysClipboard(clpVal)
		}
	},
	copy : function(copyToClp) {
		this._copyAndCutImpl(dev.report.base.grid.gridOperation.COPY, copyToClp)
	},
	cut : function(copyToClp) {
		this._copyAndCutImpl(dev.report.base.grid.gridOperation.CUT, copyToClp)
	},
	paste : function(pasteWhat, skipCnt) {
			
		var clipboard = dev.report.base.app.clipboard;
		if (clipboard == null) {
			if (skipCnt) {
				return
			}
			if ((clipboard = dev.report.base.general.parseSysClipboard()) == null) {
				return
			} else {
				clipboard.op = dev.report.base.grid.gridOperation.CUT
			}
		}
		var env = this._environment.shared, markRng, markRngDim;
		var startCoords = env.lastRangeStartCoord;
		var endCoords = env.lastRangeEndCoord;
		if (clipboard.id == null) {
			markRngDim = (clipboard.markRngDim == undefined) ? {
				width : 1,
				height : 1
			} : clipboard.markRngDim
		} else {
			markRng = dev.report.base.app.copySelection;
			var markRngCoords = markRng.getActiveRange().getCorners();
			if (markRngCoords[0].equals(markRngCoords[1])) {
				var mergeInfoStart = markRng._pane.getMergeInfo(
						markRngCoords[0].getX(), markRngCoords[0].getY());
				if (mergeInfoStart) {
					markRngCoords[1] = new dev.report.gen.Point(markRngCoords[0]
									.getX()
									+ mergeInfoStart[1] - 1, markRngCoords[0]
									.getY()
									+ mergeInfoStart[2] - 1)
				}
			}
			markRngDim = {
				width : markRngCoords[1].getX() - markRngCoords[0].getX() + 1,
				height : markRngCoords[1].getY() - markRngCoords[0].getY() + 1
			}
		}
		var defRngDim = {
			width : endCoords[0] - startCoords[0] + 1,
			height : endCoords[1] - startCoords[1] + 1
		};
		if (clipboard.op == dev.report.base.grid.gridOperation.CUT
				|| (defRngDim.width < markRngDim.width || defRngDim.width
						% markRngDim.width != 0)
				|| (defRngDim.height < markRngDim.height || defRngDim.height
						% markRngDim.height != 0)) {
			this.set(new dev.report.gen.Point(startCoords[0], startCoords[1]),
					new dev.report.gen.Point(startCoords[0] + markRngDim.width - 1,
							startCoords[1] + markRngDim.height - 1));
			this.draw()
		}
		startCoords = env.lastRangeStartCoord;
		endCoords = env.lastRangeEndCoord;
		if (clipboard.id == null) {
			if (clipboard.markRngDim == undefined) {
				this._pane.setCellValue(startCoords[0], startCoords[1],
						clipboard.value)
			} else {
				var vals = [];
				for (var len = clipboard.value.length - 1, i = -1; i < len; vals = vals
						.concat(clipboard.value[++i])) {
				}
				this._pane.setRangeValue([startCoords[0], startCoords[1],
								endCoords[0], endCoords[1]], vals)
			}
		} else {
			this._pane.pasteRange([this, this.draw], [startCoords[0],
							startCoords[1], endCoords[0], endCoords[1]],
					clipboard.id, pasteWhat)
		}
		var cursorValue = this._pane.getCellValue(startCoords[0],
				startCoords[1]), cursorField = this.getCursorField();
		cursorField.setContent(cursorValue == undefined ? "" : cursorValue);
		cursorField.cloneStyle();
		if (clipboard.id != null
				&& clipboard.op == dev.report.base.grid.gridOperation.CUT) {
			markRng.removeAll();
			dev.report.base.app.clipboard = null;
			dev.report.base.action.togglePaste(false)
		}
	},
	pasteFormat : function() {
		var cntType = dev.report.base.range.ContentType;
		this.paste(cntType.STYLE | cntType.FORMAT | cntType.CNDFMT, true);
		if (dev.report.base.app.formatPainter == 1) {
			dev.report.base.action.exitFormatPainter()
		}
	},
	exitFormatPainter : function() {
		var markRng = dev.report.base.app.copySelection;
		if (markRng) {
			markRng.removeAll();
			dev.report.base.app.clipboard = null
		}
		dev.report.base.app.formatPainter = null
	},
	hide : function() {
		for (var i = this._ranges.length - 1; i >= 0; i--) {
			this._ranges[i].hide()
		}
	},
	show : function() {
		for (var i = this._ranges.length - 1; i >= 0; i--) {
			this._ranges[i].show()
		}
	},
	setCursor : function(el, cur) {
		this._ranges[this._activeRange].setCursor(el, cur)
	},
	getContainer : function() {
		return this._container
	},
	getEnvironment : function() {
		return this._environment
	},
	getDomId : function() {
		return this._pane.getDomId()
	},
	syncActivePane : function() {
		this._pane = this._sheet._aPane;
		if (this._ranges.length) {
			this._ranges[this._activeRange].syncActivePane()
		}
	}
};