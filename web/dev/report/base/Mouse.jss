
Ext.namespace("dev.report.base");
using("dev.report.gen.Point");
dev.report.base.Mouse =function(){
	this.MouseIsOnCell = function(XPos, YPos, Coords) {
		return (((XPos >= Coords[0][0]) && (XPos <= Coords[0][1])) && ((YPos >= Coords[1][0]) && (YPos <= Coords[1][1])))
	};
	this.updateLastCell = function(el, elCoords, pane) {
		if (pane == undefined) {
			var relPanes = dev.report.base.app.activeSheet.getPanesByCoords(elCoords[0],
					elCoords[1]);
			pane = relPanes.length == 1 ? relPanes[0] : dev.report.base.app.activePane
		}
		var env = pane._env.shared, mergeInfo = pane.getMergeInfo(elCoords[0],
				elCoords[1]);
		if (mergeInfo != undefined && !mergeInfo) {
			env.lastCellCoords = [mergeInfo[1], mergeInfo[2]];
			env.lastCell = pane.getCellByCoords(mergeInfo[1], mergeInfo[2])
		} else {
			env.lastCell = el;
			env.lastCellCoords = [elCoords[0], elCoords[1]]
		}
	};
	this.overTracking = function(ev, pane) {

		if (!dev.report.base.app.loaded || pane == undefined) {
			return
		}
		if (document.all) {
			ev = window.event
		}
		var el = (document.all) ? ev.srcElement : ev.target, elCoords;

		if (el.tagName != "DIV") {
			el = el.parentNode
		}
		if ((elCoords = pane.getCoordsByCell(el)) == undefined) {
			return
		}
		this.updateLastCell(el, elCoords, pane);
		if (el.tagName == "DIV" && el.className == "gridCell") {
			dev.report.base.keyboard.preventEvent(ev)
		}
		//dev.report.base.cmnt.showComment(elCoords, pane)
	};
	this.rangeOverTracking = function(myEvent, activeSheet) {
		var env = activeSheet._env.shared;
		if (env.viewMode == dev.report.base.grid.viewMode.USER
				|| (activeSheet._panes.length > 1
						&& activeSheet._panes[0].hasFullSize() && activeSheet._autoScroll
						.isScrolling())) {
			return
		}
		if (document.all) {
			myEvent = window.event
		}
		var myElement = (document.all) ? myEvent.srcElement : myEvent.target, paneId = !myElement.className
				.search("rangeMask")
				? myElement.parentNode._paneId
				: myElement._paneId, pane = activeSheet._panes[paneId], rangeStartCoords = env.defaultSelection
				.getActiveRange().getUpperLeft(), lastCellCoords = env.lastCellCoords, targetCoords = pane
				.getNeighByOffset(rangeStartCoords.getX(), rangeStartCoords.getY(),
						(document.all ? myEvent.offsetX : myEvent.layerX)
								+ myElement.offsetLeft + 4, (document.all
								? myEvent.offsetY
								: myEvent.layerY)
								+ myElement.offsetTop + 4);
		if (lastCellCoords[0] != targetCoords[0]
				|| lastCellCoords[1] != targetCoords[1]) {
			env.lastCell = targetCoords[2];
			env.lastCellCoords = [targetCoords[0], targetCoords[1]]
		}
		if (myElement.tagName == "DIV" && myElement.className == "gridCell") {
			dev.report.base.keyboard.preventEvent(myEvent)
		}
		//dev.report.base.cmnt.showOnMoveComment(lastCellCoords, pane)
	};
	this.mouseonCellDblClick = function(ev, pane) {
		if (document.all) {
			ev = window.event
		}
		var el = (document.all) ? ev.srcElement : ev.target;
		if (el.tagName != "DIV") {
			el = el.parentNode
		}
		var cellCoords = pane.getCoordsByCell(el);
		if (!cellCoords) {
			return true
		}
		this.showCursorLayer("marker_sand_clock");
		var cbRes = pane.cbFire(cellCoords[0], cellCoords[1], "dblclick", {
					c : cellCoords[0],
					r : cellCoords[1]
				});
		this.hideCursorLayer();
		if (!cbRes) {
			return false
		}
	};
	this.mouseOnCellDown = function(myEvent, pane) {
		if (dev.report.env.isMobile) {
			try {
				for (var triggers = dev.report.base.events.triggers.globalMouseDown, i = triggers.length
						- 1; i >= 0; i--) {
					triggers[i][0]["globalMouseDown"].call(parent, triggers[i][1])
				}
			} catch (e) {
				if (e.message == "no events") {
					if (!e.events.wss) {
						e.events.wss = true
					}
					return false
				}
				dev.report.base.general.showMsg("Application Error".localize(), e.message
								.localize(), Ext.MessageBox.ERROR)
			}
		}
		if (pane._book != dev.report.base.app.activeBook) {
			return false
		}
		if (document.all) {
			myEvent = window.event
		}
		var myElement = document.all ? myEvent.srcElement : myEvent.target;
		if (myElement.tagName != "DIV") {
			myElement = myElement.tagName.toUpperCase() == "IMG"
					&& myElement.parentNode.tagName.toUpperCase() != "DIV"
					? myElement.parentNode.parentNode
					: myElement.parentNode
		}
		var env = pane._env.shared, elCoords = pane.getCoordsByCell(myElement);
		if (elCoords == undefined) {
			return
		}
		var cbRes = pane.cbFire(elCoords[0], elCoords[1], "mousedown", myEvent);
		if (!cbRes) {
			dev.report.base.keyboard.preventEvent(myEvent);
			return false
		}
		var value;
		if ((env.inputMode == dev.report.base.grid.GridMode.EDIT)
				|| (env.inputMode == dev.report.base.grid.GridMode.INPUT)) {
			value = env.inputField.value;
			if (value.length > 0 && value.substr(0, 1) == "="
					&& env.viewMode != dev.report.base.grid.viewMode.USER) {
				dev.report.base.app.lastInputMode = env.inputMode;
				dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.POINT);
				var elemCoords = pane.getCoordsByCell(myElement);
				if (env.formulaSelection.activeToken != null) {
					var point, area = env.formulaSelection.getActiveRange();
					area.set(point = new dev.report.gen.Point(elemCoords[0],
									elemCoords[1]), point);
					area.formulaUpdate();
					area.draw()
				} else {
					var currFormula = dev.report.base.app.currFormula, selection = dev.report.util
							.getSelection(dev.report.base.app.fromFormulaField
									? currFormula.el.dom
									: env.inputField), selStart = selection.start, selEnd = selection.end;
					if (selStart == 0
							|| value.substr(selStart - 1, 1).match(/^[a-z0-9]$/i) != null) {
						if (env.oldValue != value) {
							dev.report.base.keyboard.sendInput(env.inputField)
						} else {
							dev.report.base.keyboard.cancelInput()
						}
						return this.mouseOnCellDown(myEvent, pane)
					}
					var elemCoordsA1 = dev.report.base.app.numberToLetter[elemCoords[0]]
							.concat(elemCoords[1]);
					env.inputField.value = value.substring(0, selStart).concat(
							elemCoordsA1, value.substring(selEnd));
					currFormula.setValue(env.inputField.value);
					dev.report.base.range.drawDependingCells(currFormula.getValue());
					dev.report.base.keyboard.setFieldSize();
					env.lastInputValue = currFormula.getValue();
					dev.report.util.setSelection(dev.report.base.app.fromFormulaField
									? currFormula.el.dom
									: env.inputField, selStart
									+ elemCoordsA1.length);
					for (var tok, area, areas = env.formulaSelection.getRanges(), i = areas.length
							- 1; i >= 0; --i) {
						if (selStart >= (tok = (area = areas[i]).formulaToken).start
								&& selStart < tok.end) {
							env.formulaSelection.activeToken = tok;
							env.formulaSelection.setActiveRange(i);
							env.formulaSelection
									.setState(dev.report.base.range.AreaState.NEW);
							area.repaint();
							break
						}
					}
				}
				dev.report.base.app.environment.formulaSelection
						.registerForMouseMovement(myElement)
			} else {
				if (dev.report.base.app.environment.viewMode != dev.report.base.grid.viewMode.USER) {
					dev.report.base.app.environment.formulaSelection.removeAll()
				} else {
					dev.report.base.app.environment.inputField.style.display = "none"
				}
				if (dev.report.base.app.environment.oldValue != value) {
					dev.report.base.keyboard
							.sendInput(dev.report.base.app.environment.inputField)
				} else {
					dev.report.base.keyboard.cancelInput()
				}
				dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.READY);
				dev.report.base.hb.setAllNormal()
			}
		}
		if (env.viewMode == dev.report.base.grid.viewMode.USER
				&& pane.isCellLocked(elCoords[0], elCoords[1])) {
			dev.report.base.keyboard.cancelInput();
			return
		}
		if (dev.report.base.app.environment.inputMode == dev.report.base.grid.GridMode.DIALOG
				&& dev.report.base.app.sourceSel) {
			this.initSourceRange(myElement, pane
							.getCoordsByCell(myElement))
		}
		if (dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.DESIGNER
				&& dev.report.base.app.environment.inputMode == dev.report.base.grid.GridMode.READY) {
			var elementCoords;
			if (pane != undefined) {
				var elementCoords = pane.getCoordsByCell(myElement);
				if (elementCoords == undefined) {
					return
				}
			}
			dev.report.base.app.environment.defaultSelection.set(new dev.report.gen.Point(
							elementCoords[0], elementCoords[1]),
					new dev.report.gen.Point(elementCoords[0], elementCoords[1]));
			dev.report.base.app.environment.defaultSelection
					.registerForMouseMovement(myElement);
			dev.report.base.app.environment.defaultSelection.draw();
			dev.report.base.app.environment.defaultSelection.getActiveRange()
					.reposBgndMask(false);
			if (myEvent.button == 2
					|| (Ext.isMac && myEvent.button == 0 && dev.report.base.app.ctrlKeyPressed)) {
				this.showMainCntxMenu(myEvent)
			}
			dev.report.base.hb.setAllNormal()
		}
		if (dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
			var selectedCellCoords = pane.getCoordsByCell(myElement), mrgInfoSelCell = pane
					.getMergeInfo(selectedCellCoords[0], selectedCellCoords[1]);
			env.selectedCell = myElement;
			env.selectedCellCoords = selectedCellCoords;
			env.lastRangeStartCoord = env.lastRangeEndCoord = [
					selectedCellCoords[0], selectedCellCoords[1]];
			var selCellValue = pane.getCellUVal(selectedCellCoords[0],
					selectedCellCoords[1]);
			env.selectedCellValue = (selCellValue == undefined) ? "" : selCellValue;
			if (dev.report.env.isDesktop) {
				var actCellCoords = pane.getPixelsByCoords(selectedCellCoords[0],
						selectedCellCoords[1]), actCellIncCoords = pane
						.getPixelsByCoords(selectedCellCoords[0]
										+ (mrgInfoSelCell && mrgInfoSelCell[0]
												? mrgInfoSelCell[1]
												: 1), selectedCellCoords[1]
										+ (mrgInfoSelCell && mrgInfoSelCell[0]
												? mrgInfoSelCell[2]
												: 1));
				dev.report.base.app.activeSheet._cursorField.draw({
							ulX : actCellCoords[0],
							ulY : actCellCoords[1],
							lrX : actCellIncCoords[0],
							lrY : actCellIncCoords[1]
						}, new dev.report.gen.Point(selectedCellCoords[0],
								selectedCellCoords[1]));
				if (myEvent.button == 2
						|| (Ext.isMac && myEvent.button == 0 && dev.report.base.app.ctrlKeyPressed)) {
					this.showMainCntxMenu(myEvent)
				}
			} else {
				if (dev.report.env.isMobile) {
					try {
						for (var triggers = dev.report.base.events.triggers.openCellInput, i = triggers.length
								- 1; i >= 0; i--) {
							triggers[i][0]["openCellInput"].call(parent,
									triggers[i][1], [selectedCellCoords[0],
											selectedCellCoords[1]],
									dev.report.base.general.filterHLTags(
											selectedCellCoords[0],
											selectedCellCoords[1],
											env.selectedCellValue, false))
						}
					} catch (e) {
						dev.report.base.general.showMsg("Application Error".localize(),
								e.message.localize(), Ext.MessageBox.ERROR)
					}
				}
			}
		}
	};
	this.initSourceRange = function(cell, ulCoords, lrCoords) {
		if (!lrCoords) {
			lrCoords = ulCoords
		}
		var formSel = dev.report.base.app.environment.formulaSelection;
		formSel.removeAll();
		formSel.addRange(new dev.report.gen.Point(ulCoords[0], ulCoords[1]),
				new dev.report.gen.Point(lrCoords[0], lrCoords[1]));
		formSel.setActiveRange(formSel.getRanges().length - 1);
		formSel.setState(dev.report.base.range.AreaState.NEW);
		if (cell) {
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.POINT);
			formSel.registerForMouseMovement(cell)
		}
		formSel.draw()
	};
	this.mouseOnRangeDown = function(myEvent, activeSheet) {
		if (document.all) {
			myEvent = window.event
		}
		var env = activeSheet._env.shared, myElement = (document.all)
				? myEvent.srcElement
				: myEvent.target, isRangeMask = !myElement.className
				.search("rangeMask"), paneId = isRangeMask
				? myElement.parentNode._paneId
				: myElement._paneId, pane = activeSheet._panes[paneId], srcRngMode = env.inputMode == dev.report.base.grid.GridMode.DIALOG
				&& dev.report.base.app.sourceSel;
		if (dev.report.base.app.activePane != pane) {
			pane.select();
			activeSheet._defaultSelection.draw()
		}
		if (!srcRngMode && myEvent.button == 2 && isRangeMask) {
			this.showMainCntxMenu(myEvent);
			dev.report.base.keyboard.preventEvent(myEvent);
			return
		}
		var rangeStartCoords = env.defaultSelection.getActiveRange().getUpperLeft(), targetCoords = pane
				.getNeighByOffset(rangeStartCoords.getX(), rangeStartCoords.getY(),
						((document.all) ? myEvent.offsetX : myEvent.layerX)
								+ myElement.offsetLeft + 4, ((document.all)
								? myEvent.offsetY
								: myEvent.layerY)
								+ myElement.offsetTop + 4), tX = targetCoords[0], tY = targetCoords[1], targetMrgInfo = pane
				.getMergeInfo(tX, tY);
		if (targetMrgInfo && !targetMrgInfo[0]) {
			tX = targetMrgInfo[1], tY = targetMrgInfo[2]
		}
		if (env.inputMode == dev.report.base.grid.GridMode.READY) {
			env.defaultSelection.set(new dev.report.gen.Point(tX, tY),
					new dev.report.gen.Point(tX, tY));
			if (env.viewMode == dev.report.base.grid.viewMode.DESIGNER) {
				env.defaultSelection.registerForMouseMovement(targetCoords[2])
			}
			env.defaultSelection.draw();
			env.defaultSelection.getActiveRange().reposBgndMask(false)
		}
		if (srcRngMode) {
			this.initSourceRange(pane.getCellByCoords(targetCoords[0],
							targetCoords[1]), targetCoords)
		}
		if ((myElement.tagName == "DIV") && (myElement.className == "rangeMask")) {
			dev.report.base.keyboard.preventEvent(myEvent)
		}
	};
	this.checkForResize = function(ev, sheet) {
		if (document.all) {
			ev = window.event
		}
		var el = (document.all) ? ev.srcElement : ev.target, env = sheet._env.shared;
		if (env.inputMode == dev.report.base.grid.GridMode.EDIT) {
			return
		}
		function checkPosition() {
			var XOffset = 5, YOffset = 4;
			if (el.parentNode.className == "gridColHdrsIC") {
				var resizeIndex = (el.className + "").indexOf(" col_resize"), targetX = (document.all)
						? ev.offsetX
						: ev.layerX, hdr = sheet.locateHdr(
						dev.report.base.grid.headerType.COLUMN, el);
				if ((targetX <= XOffset && (hdr[0] != hdr[1].getCoordsFirstVCell()[0]))
						|| (el.offsetWidth - targetX <= XOffset)) {
					env.mousePosition = "colResize";
					if (resizeIndex == -1) {
						el.className += " col_resize"
					}
				} else {
					env.mousePosition = "colMark";
					if (resizeIndex > -1) {
						el.className = el.className.substring(0, resizeIndex)
					}
				}
			}
			if (el.parentNode.className == "gridRowHdrsIC") {
				var resizeIndex = (el.className + "").indexOf(" row_resize"), targetY = (document.all)
						? ev.offsetY
						: ev.layerY, hdr = sheet.locateHdr(
						dev.report.base.grid.headerType.ROW, el);
				if ((targetY <= YOffset && (hdr[0] != hdr[1].getCoordsFirstVCell()[1]))
						|| (el.offsetHeight - targetY <= YOffset)) {
					env.mousePosition = "rowResize";
					if (resizeIndex == -1) {
						el.className += " row_resize"
					}
				} else {
					env.mousePosition = "rowMark";
					if (resizeIndex > -1) {
						el.className = el.className.substring(0, resizeIndex)
					}
				}
			}
		}
		if (dev.report.base.app.xPos != ev.clientX || dev.report.base.app.yPos != ev.clientY) {
			if (dev.report.base.app.mouseButton1Down) {
				if (env.headerMarkMode === "") {
					this.fetchGlobalMouseMove(ev)
				}
			} else {
				dev.report.base.app.xPos = ev.clientX;
				dev.report.base.app.yPos = ev.clientY;
				checkPosition()
			}
		}
	};
	this.fetchMove = function(MouseEvent) {
		if (dev.report.base.app.maybeDragging
				|| dev.report.base.app.environment.headerResizeType == dev.report.base.grid.headerType.COLUMN
				|| dev.report.base.app.environment.headerResizeType == dev.report.base.grid.headerType.ROW) {
			return
		}
		var Coords = null;
		if (dev.report.base.app.environment.lastCell === null) {
			dev.report.base.app.xPos = MouseEvent.clientX;
			dev.report.base.app.yPos = MouseEvent.clientY
		} else {
			Coords = dev.report.base.range
					.getCellCoord(dev.report.base.app.environment.lastCell);
			if (!(this.MouseIsOnCell(MouseEvent.clientX,
					MouseEvent.clientY, Coords))) {
				dev.report.base.app.xPos = MouseEvent.clientX;
				dev.report.base.app.yPos = MouseEvent.clientY
			}
		}
	};
	this.calcGridScreenCoords = function(ev, el, offsets, pane,
			skipStore) {
		if (!offsets) {
			offsets = [0, 0]
		}
		if (!pane) {
			pane = dev.report.base.app.activePane
		}
		var viewportPos = pane.getViewportPos(), gridScreenX = ev.clientX
				- (el.offsetLeft + (document.all ? ev.offsetX : ev.layerX)
						+ offsets[0] - viewportPos[0][0]), gridScreenY = ev.clientY
				- ((el.className == "gridCell"
						? el.parentNode.offsetTop
						: el.offsetTop)
						+ (document.all ? ev.offsetY : ev.layerY) + offsets[1] - viewportPos[0][1]), gsCoords = [
				[gridScreenX, gridScreenY],
				[gridScreenX + viewportPos[1][0] - viewportPos[0][0],
						gridScreenY + viewportPos[1][1] - viewportPos[0][1]],
				[
						(document.all)
								? document.body.clientWidth
								: window.innerWidth,
						(document.all)
								? document.body.clientHeight
								: window.innerHeight]];
		if (skipStore) {
			return gsCoords
		} else {
			dev.report.base.app.environment.gridScreenCoords = gsCoords
		}
	};
	this.fetchGlobalMouseDown = function(myMouseEvent) {
		if (!dev.report.base.app.loaded) {
			return
		}
		if (dev.report.env.isMobile) {
			try {
				for (var triggers = dev.report.base.events.triggers.globalMouseDown, i = triggers.length
						- 1; i >= 0; i--) {
					triggers[i][0]["globalMouseDown"].call(parent, triggers[i][1])
				}
			} catch (e) {
				if (e.message == "no events") {
					if (!e.events.wss) {
						e.events.wss = true
					}
					return false
				}
				dev.report.base.general.showMsg("Application Error".localize(), e.message
								.localize(), Ext.MessageBox.ERROR)
			}
		}
		if (document.all) {
			myMouseEvent = window.event
		}
		dev.report.base.app.mouseDownObserver.notify(this, myMouseEvent);
		var mouseEl = (document.all)
				? myMouseEvent.srcElement
				: myMouseEvent.target, trigCls = ["gridCell", "rangeEdge",
				"HBRangeBorder", "HBSubDataCell"];


		if (trigCls.indexOf(mouseEl.className) >= 0) {
			this.calcGridScreenCoords(myMouseEvent, mouseEl)
		}
		dev.report.base.app.mouseButton1Down = false;
		dev.report.base.app.mouseButton2Down = false;
		if ((document.all && myMouseEvent.button == 1)
				|| (myMouseEvent.button === 0)) {
			dev.report.base.app.mouseButton1Down = true
		} else {
			if (myMouseEvent.button == 2) {
				dev.report.base.app.mouseButton2Down = true
			}
		}
		try {
			var ParentElementId = mouseEl.parentNode.childNodes[0].id;
			if ((typeof(ParentElementId) != "undefined")
					&& (ParentElementId.length > 5)
					&& (ParentElementId.substring(0, 6) != "column")) {
				dev.report.base.app.maybeDragging = true
			} else {
				dev.report.base.app.maybeDragging = false
			}
		} catch (Exception) {
			dev.report.base.app.maybeDragging = true
		}
	}.createDelegate(this);
	this.fetchGlobalMouseUp = function(myMouseEvent) {
		if (!dev.report.base.app.loaded) {
			return
		}
		if (document.all) {
			myMouseEvent = window.event
		}
		dev.report.base.app.mouseUpObserver.notify(this, myMouseEvent);
		var isBtn1 = (document.all && myMouseEvent.button == 1)
				|| myMouseEvent.button === 0, env = dev.report.base.app.environment;
		if (isBtn1) {
			dev.report.base.app.mouseButton1Down = false;
			dev.report.base.app.mouseButton2Down = false
		}
		if (env == null) {
			return
		}
		if (isBtn1 && env.headerResizeType != dev.report.base.grid.headerType.NONE) {
			this.stopHeaderResize()
		}
		dev.report.base.app.maybeDragging = false;
		dev.report.base.app.mouseButton2Down = false;
		if (env.headerMarkMode.length > 0) {
			this.hideCursorLayer()
		}
		env.headerMarkMode = "";
		if (env.viewMode != dev.report.base.grid.viewMode.USER) {
			if (env.defaultSelection) {
				env.defaultSelection.getActiveRange().reposBgndMask(true)
			}
			dev.report.base.wsel.moveSave()
		}
	}.createDelegate(this);;
	this.fetchGlobalMouseMove = function(MyMouseEvent) {
		if (!dev.report.base.app.loaded) {
			return
		}
		if (document.all) {
			MyMouseEvent = window.event
		}
		dev.report.base.app.mouseMovementObserver.notify(this, MyMouseEvent);
		if (dev.report.base.app.mimicOvertracking) {
			var elCoords = this.getGridPos(MyMouseEvent);
			if (elCoords[0] > 0 && elCoords[1] > 0) {
				this.updateLastCell(elCoords[2], [elCoords[0],
								elCoords[1]])
			}
		}
		var elem = (document.all) ? MyMouseEvent.srcElement : MyMouseEvent.target, env = dev.report.base.app.environment, i;
		if (env == null) {
			return
		}
		dev.report.base.app.xPos = MyMouseEvent.clientX;
		dev.report.base.app.yPos = MyMouseEvent.clientY;
		var hdrResType = env.headerResizeType;
		if (hdrResType == dev.report.base.grid.headerType.COLUMN) {
			this.doHeaderResize(hdrResType, MyMouseEvent.clientX)
		} else {
			if (hdrResType == dev.report.base.grid.headerType.ROW) {
				this.doHeaderResize(hdrResType, MyMouseEvent.clientY)
			}
		}
		if (env.headerMarkMode == "column" || env.headerMarkMode == "row") {
			env.defaultSelection.resizeByHeader(MyMouseEvent)
		}
	}.createDelegate(this);;
	this.appendtoScrollwheel = function() {
		if (window.addEventListener) {
			window.addEventListener("DOMMouseScroll", this.fetchWheel,
					false)
		}
		window.onmousewheel = document.onmousewheel = this.fetchWheel
	};
	this.fetchWheel = function(ev) {
		if (dev.report.base.app.environment.inputMode != dev.report.base.grid.GridMode.DIALOG) {
			var value = 0;
			if (!ev) {
				ev = window.event
			}
			if (ev.wheelDelta) {
				value = ev.wheelDelta;
				if (!(typeof HTMLElement != "undefined" && HTMLElement.prototype)) {
					value *= -1
				}
			} else {
				if (ev.detail) {
					value = ev.detail
				}
			}
			if (value > 0) {
				dev.report.base.sheet.scrollYBy(1, dev.report.base.grid.ScrollDirection.DOWN)
			} else {
				if (value < 0) {
					dev.report.base.sheet.scrollYBy(1, dev.report.base.grid.ScrollDirection.UP)
				}
			}
			dev.report.base.keyboard.preventKeyEvent(ev)
		}
	};
	this.showCursorLayer = function(cls) {
		var cursorMarker = document.getElementById("CursorMarker");
		cursorMarker.style.top = "0px";
		cursorMarker.style.left = "0px";
		cursorMarker.style.width = (document.all)
				? document.body.clientWidth
				: window.innerWidth + "px";
		cursorMarker.style.height = (document.all)
				? document.body.clientHeight
				: window.innerHeight + "px";

		cursorMarker.className = cls;
		cursorMarker.style.display = "block"
	};
	this.hideCursorLayer = function() {
		var cursorMarker = document.getElementById("CursorMarker");
		cursorMarker.style.width = "0px";
		cursorMarker.style.height = "0px";
		cursorMarker.style.display = "none"
	};
	this.startHeaderResize = function(type, elem, coord, cursorOffset,
			hdrOffset, pane) {
		dev.report.base.app.environment.headerResizeType = type;
		dev.report.base.app.environment.headerResizeCoord = coord;

		;

		var hdrType = dev.report.base.grid.headerType, paneIC = pane._ic, activeSheet = pane._sheet, sheetDomId = activeSheet._domId, viewportPos = pane
				.getViewportPos(), startMarkerLeft = (type == hdrType.COLUMN)
				? elem.offsetLeft - viewportPos[0][0] + pane._oc.offsetLeft
				: 0, startMarkerTop = (type == hdrType.ROW) ? elem.offsetTop
				- viewportPos[0][1] + pane._oc.offsetTop : -1, stopMarkerLeft = (type == hdrType.COLUMN)
				? startMarkerLeft + elem.offsetWidth
				: 0, stopMarkerTop = (type == hdrType.ROW) ? startMarkerTop
				+ elem.offsetHeight : -1, markerHeight = ((type == hdrType.COLUMN)
				? paneIC.offsetHeight
				: 1)
				+ "px", markerWidth = ((type == hdrType.ROW)
				? paneIC.offsetWidth
				: 1)
				+ "px", borderTopWidth = (type == hdrType.ROW) ? "1px" : "0px", borderLeftWidth = (type == hdrType.COLUMN)
				? "1px"
				: "0px", startMarker = document.getElementById("".concat(
				sheetDomId, "_startMarker")), stopMarker = document
				.getElementById("".concat(sheetDomId, "_stopMarker"));

		startMarker.style.left = startMarkerLeft + "px";
		startMarker.style.top = startMarkerTop + "px";
		startMarker.style.height = markerHeight;
		startMarker.style.width = markerWidth;
		startMarker.style.borderTopWidth = borderTopWidth;
		startMarker.style.borderLeftWidth = borderLeftWidth;
		startMarker.style.display = "block";
		stopMarker.style.left = stopMarkerLeft + "px";
		stopMarker.style.top = stopMarkerTop + "px";
		stopMarker.style.height = markerHeight;
		stopMarker.style.width = markerWidth;
		stopMarker.style.borderTopWidth = borderTopWidth;
		stopMarker.style.borderLeftWidth = borderLeftWidth;
		stopMarker.style.display = "block";
		this.showCursorLayer((type == hdrType.ROW)
				? "marker_row_resize"
				: "marker_col_resize");
		if (type == hdrType.ROW) {
			dev.report.base.app.environment.headerResize = [startMarkerTop,
					stopMarkerTop, hdrOffset, viewportPos[0][1],
					pane._oc.parentNode.offsetHeight, stopMarkerTop,
					cursorOffset - hdrOffset]
		} else {
			dev.report.base.app.environment.headerResize = [startMarkerLeft,
					stopMarkerLeft, hdrOffset, viewportPos[0][0],
					pane._oc.parentNode.offsetWidth, stopMarkerLeft,
					cursorOffset - hdrOffset]
		}
	};
	this.doHeaderResize = function(type, cursorOffset) {
		var activeSheet = dev.report.base.app.activeSheet, hdrRes = dev.report.base.app.environment.headerResize, stopMarker = document
				.getElementById(activeSheet._domId.concat("_stopMarker")), hdrSize = type == dev.report.base.grid.headerType.COLUMN
				? activeSheet._HDRS_WIDTH
				: activeSheet._HDRS_HEIGHT, newPos = hdrRes[1]
				- (hdrRes[6] - cursorOffset);
		if (newPos > hdrRes[4]) {
			newPos = hdrRes[1]
		} else {
			if (newPos < hdrRes[0] + 5) {
				newPos = hdrRes[0] + 5
			}
		}
		if (type == dev.report.base.grid.headerType.COLUMN) {
			stopMarker.style.left = newPos + "px"
		} else {
			stopMarker.style.top = newPos + "px"
		}
		hdrRes[5] = newPos
	};
	this.stopHeaderResize = function() {
		var env = dev.report.base.app.environment, hdrRes = env.headerResize, resizedHdr = env.headerResizeCoord, sheetDomId = dev.report.base.app.activeSheet._domId, startMarker = document
				.getElementById("".concat(sheetDomId, "_startMarker")), stopMarker = document
				.getElementById("".concat(sheetDomId, "_stopMarker")), hdrCoords = env.defaultSelection
				.getSelHeaderFromRange(env.headerResizeType, resizedHdr);
		if (hdrRes[1] != hdrRes[5]) {
			dev.report.base.app.activeSheet.resizeColRow(env.headerResizeType, hdrCoords,
					hdrRes[5] - hdrRes[0]);
			dev.report.base.hb.setAllNormal(null, true)
		}
		startMarker.style.display = "none";
		stopMarker.style.display = "none";
		this.hideCursorLayer();
		env.headerResizeType = dev.report.base.grid.headerType.NONE;
		env.headerResize = []
	};
	this.autoSizeCell = function(ev) {
		var mousePosition = dev.report.base.app.environment.mousePosition;
		if (!(mousePosition == "colResize" || mousePosition == "rowResize")) {
			return
		}
		if (document.all) {
			ev = window.event
		}
		if (!((document.all && ev.button == 1) || (ev.button === 0))) {
			return
		}
		var myElement = (document.all) ? ev.srcElement : ev.target;
		var XOffset = 5;
		var YOffset = 5;
		var activeSheet = dev.report.base.app.activeSheet;
		var headerType = dev.report.base.grid.headerType;
		var hdrCoords = undefined;
		if (mousePosition == "colResize") {
			var selHdr = activeSheet.getCoordByHdr(headerType.COLUMN, myElement);
			var targetOffsetX = (document.all) ? ev.offsetX : ev.layerX;
			if (targetOffsetX <= XOffset) {
				--selHdr
			}
			hdrCoords = dev.report.base.app.environment.defaultSelection
					.getSelHeaderFromRange(headerType.COLUMN, selHdr)
		} else {
			if (mousePosition == "rowResize") {
				var selHdr = activeSheet.getCoordByHdr(headerType.ROW, myElement);
				var targetOffsetY = (document.all) ? ev.offsetY : ev.layerY;
				if (targetOffsetY <= YOffset) {
					--selHdr
				}
				hdrCoords = dev.report.base.app.environment.defaultSelection
						.getSelHeaderFromRange(headerType.ROW, selHdr)
			}
		}
		dev.report.base.app.activeSheet.autofitColRow(mousePosition == "colResize"
						? 0
						: 1, hdrCoords)
	};
	this.showMainCntxMenu = function(ev) {
		var env = dev.report.base.app.environment, clpExs = dev.report.base.app.clipboard == null
				? false
				: true, selCoord = env.selectedCellCoords, selCell = dev.report.base.app.activePane
				.getCell(selCoord[0], selCoord[1]), cntxMenuItems = [{
					text : "Cut".localize(),
					iconCls : "icon_cut",
					handler : function() {
						dev.report.base.action.cut(false)
					}
				}, {
					text : "Copy".localize(),
					iconCls : "icon_copy",
					handler : function() {
						dev.report.base.action.copy(false)
					}
				}, {
					text : "Paste".localize(),
					iconCls : "icon_paste",
					disabled : !clpExs,
					handler : dev.report.base.action.paste
				}];
		if (!dev.report.base.env.isUser) {
			var defMaxCoords = dev.report.base.grid.defMaxCoords, selEndCoord = env.lastRangeEndCoord, selType = (selEndCoord[0] == defMaxCoords[0] && selEndCoord[1] == defMaxCoords[1])
					? "all"
					: (selEndCoord[0] == defMaxCoords[0])
							? "row"
							: (selEndCoord[1] == defMaxCoords[1]) ? "col" : null, insItem, delItem;
			if (selType == null) {
				insItem = new Ext.menu.Item({
							text : "Insert".localize(),
							menu : {
								items : [{
									text : "Shift cells right".localize(),
									handler : function() {
										dev.report.base.sheet
												.ins(dev.report.base.sheet.insDelMode.SHIFT_HOR)
									}
								}, {
									text : "Shift cells down".localize(),
									handler : function() {
										dev.report.base.sheet
												.ins(dev.report.base.sheet.insDelMode.SHIFT_VER)
									}
								}, {
									text : "Insert Entire row".localize(),
									iconCls : "ico_ins_row",
									handler : function() {
										dev.report.base.action.insDelRowCol("ins", "row")
									}
								}, {
									text : "Insert Entire column".localize(),
									iconCls : "ico_ins_column",
									handler : function() {
										dev.report.base.action.insDelRowCol("ins", "col")
									}
								}]
							}
						});
				delItem = new Ext.menu.Item({
							text : "Delete".localize(),
							menu : {
								items : [{
									text : "Shift cells left".localize(),
									handler : function() {
										dev.report.base.sheet
												.del(dev.report.base.sheet.insDelMode.SHIFT_HOR)
									}
								}, {
									text : "Shift cells up".localize(),
									handler : function() {
										dev.report.base.sheet
												.del(dev.report.base.sheet.insDelMode.SHIFT_VER)
									}
								}, {
									text : "Delete Entire row".localize(),
									iconCls : "ico_del_row",
									handler : function() {
										dev.report.base.action.insDelRowCol("del", "row")
									}
								}, {
									text : "Delete Entire column".localize(),
									iconCls : "ico_del_column",
									handler : function() {
										dev.report.base.action.insDelRowCol("del", "col")
									}
								}]
							}
						})
			} else {
				insItem = new Ext.menu.Item({
							text : "Insert".localize(),
							handler : function() {
								dev.report.base.action.insDelRowCol("ins", selType)
							},
							disabled : (selType == "all")
						});
				delItem = new Ext.menu.Item({
							text : "Delete".localize(),
							handler : function() {
								dev.report.base.action.insDelRowCol("del", selType)
							},
							disabled : (selType == "all")
						})
			}
			var targEl = (Ext.isGecko2)
					? ev.explicitOriginalTarget.parentNode
					: document.elementFromPoint(ev.clientX, ev.clientY);/*, hlCMenu = dev.report.base.hl
					.getContextMenu({
						defName : dev.report.base.general.filterHLTags(selCoord[0],
								selCoord[1], env.selectedCellValue, false),
						data : dev.report.base.hl.get(env.lastRangeStartCoord),
						withOpen : !(targEl == undefined
								|| targEl.tagName.toUpperCase() != "SPAN" || targEl.className != "hl"),
						handlers : {
							scope : dev.report.base.hl,
							set : dev.report.base.hl.set,
							remove : dev.report.base.hl.remove
						}
					}, ev);*///, cmntMenu = dev.report.base.cmnt.getContextMenu(selCoord);
			cntxMenuItems = cntxMenuItems.concat([/*{
						text : "Paste Special".localize().concat("..."),
						disabled : !clpExs,
						handler : function() {
							using("dev.report.base.dlg.PasteSpecial");
							var pasteSpecial=new dev.report.base.dlg.PasteSpecial();
							pasteSpecial.win.show(pasteSpecial);
						}
					},*/ "-", insItem, delItem, "-", {
						id : "formatCellsContext",
						text : "Format Cells".localize().concat("..."),
						iconCls : "icon_edit",
						handler : function() {
							using("dev.report.base.dlg.Format");
							var format=new dev.report.base.dlg.Format();
						}
					}]/*, cmntMenu, hlCMenu*/)
		}

		var mainCntxMenu = new Ext.menu.Menu({
					id : "chartContextMenu",
					cls : "default-format-window",
					enableScrolling : false,
					listeners : {
						hide : function(menu) {
							menu.destroy()
						}
					},
					items : cntxMenuItems
				});
		mainCntxMenu.showAt([ev.clientX, ev.clientY])
	};
	this.getGridPos = function(ev, pane) {
		var activePane = dev.report.base.app.activePane, isPaneSet = pane != undefined;
		if (!isPaneSet) {
			pane = activePane
		}
		var env = pane._env.shared, gridScreenCoords = this.calcGridScreenCoords(
				ev, document.all ? ev.srcElement : ev.target, null, pane, true), gridPosOffset = env.gridPosOffset, firstVCell = pane
				.getCoordsFirstVCell();
		if (ev.clientX < gridScreenCoords[0][0]
				|| ev.clientX > gridScreenCoords[1][0]
				|| ev.clientY < gridScreenCoords[0][1]
				|| ev.clientY > gridScreenCoords[1][1]) {
			if (!isPaneSet) {
				for (var panes = activePane._sheet._panes, i = panes.length - 1, elCoords; i >= 0; i--) {
					if (i == activePane._id) {
						continue
					}
					elCoords = this.getGridPos(ev, panes[i]);
					if (elCoords[0] > 0 && elCoords[1] > 0) {
						return elCoords
					}
				}
			}
			return [0, 0]
		}
		return pane.getNeighByOffset(firstVCell[0], firstVCell[1], ev.clientX
						- gridScreenCoords[0][0] + gridPosOffset[0], ev.clientY
						- gridScreenCoords[0][1] + gridPosOffset[1])
	};
	this.mimicCellMouseEvent = function(x, y, evName, activePane) {
		var activePane = activePane ? activePane : dev.report.base.app.activePane, cbScrollTo = function() {
			var target = activePane.getCellByCoords(x, y);
			if (document.dispatchEvent) {
				var oEvent = document.createEvent("MouseEvents");
				oEvent.initMouseEvent(evName, true, true, window, 1, 1, 1, 1, 1,
						false, false, false, false, 0, target);
				target.dispatchEvent(oEvent)
			} else {
				if (document.fireEvent) {
					target.fireEvent("on".concat(evName))
				}
			}
		};
		if (!activePane.isCellVisible(x, y)) {
			if (activePane._book._scrollPending) {
				return
			}
			activePane.scrollTo([this, cbScrollTo], x, y, true, false)
		} else {
			cbScrollTo()
		}
	};
	this.regHyperlinkHandlers = function() {
		//dev.report.base.grid.cbReg("hl", [this, dev.report.base.hl.follow])
	};
}