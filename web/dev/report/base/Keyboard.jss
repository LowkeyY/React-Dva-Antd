Ext.namespace("dev.report.base");
dev.report.base.Keyboard =function(){
	/*if (!dev.report.base.app.currentDialogControl) {
		this.checkGlobalInput = function(ev) {
			if (!dev.report.base.app.loaded) {
				return
			}
			dev.report.kbd.ctxRegistry.getActive().handle(ev)
		}
	}*/
	this.calcCursorRng = function(ul, lr, act, key, shiftPressed) {
		var defMaxCoords = dev.report.base.grid.defMaxCoords, focusCell;
		switch (key) {
			case 37 :
				if (shiftPressed) {
					if (ul.equalsX(lr)) {
						ul.setX((ul.getX() > 1) ? ul.getX() - 1 : ul.getX());
						focusCell = ul
					} else {
						if (ul.equalsX(act)) {
							lr.setX((lr.getX() > 1) ? lr.getX() - 1 : lr.getX());
							focusCell = lr
						} else {
							ul.setX((ul.getX() > 1) ? ul.getX() - 1 : ul.getX());
							focusCell = ul
						}
					}
				} else {
					var newX = (act.getX() > 1) ? act.getX() - 1 : act.getX();
					var newY = act.getY();
					ul.setX(newX);
					ul.setY(newY);
					lr.setX(newX);
					lr.setY(newY);
					focusCell = ul
				}
				break;
			case 39 :
				if (shiftPressed) {
					if (ul.equalsX(lr)) {
						lr.setX((lr.getX() < defMaxCoords[0]) ? lr.getX() + 1 : lr
								.getX());
						focusCell = ul
					} else {
						if (lr.equalsX(act)) {
							ul.setX((ul.getX() < defMaxCoords[0])
									? ul.getX() + 1
									: ul.getX());
							focusCell = ul
						} else {
							lr.setX((lr.getX() < defMaxCoords[0])
									? lr.getX() + 1
									: lr.getX());
							focusCell = lr
						}
					}
				} else {
					var newX = (act.getX() < defMaxCoords[0])
							? act.getX() + 1
							: act.getX();
					var newY = act.getY();
					ul.setX(newX);
					ul.setY(newY);
					lr.setX(newX);
					lr.setY(newY);
					focusCell = ul
				}
				break;
			case 33 :
			case 38 :
				if (shiftPressed) {
					if (ul.equalsY(lr)) {
						ul.setY((ul.getY() > 1) ? ul.getY() - 1 : ul.getY());
						focusCell = ul
					} else {
						if (ul.equalsY(act)) {
							lr.setY((lr.getY() > 1) ? lr.getY() - 1 : lr.getY());
							focusCell = lr
						} else {
							ul.setY((ul.getY() > 1) ? ul.getY() - 1 : ul.getY());
							focusCell = ul
						}
					}
				} else {
					var newX = act.getX();
					var newY = (act.getY() > 1) ? act.getY() - 1 : act.getY();
					ul.setX(newX);
					ul.setY(newY);
					lr.setX(newX);
					lr.setY(newY);
					focusCell = ul
				}
				break;
			case 34 :
			case 40 :
				if (shiftPressed) {
					if (ul.equalsY(lr)) {
						lr.setY((lr.getY() < defMaxCoords[1]) ? lr.getY() + 1 : lr
								.getY());
						focusCell = lr
					} else {
						if (lr.equalsY(act)) {
							ul.setY((ul.getY() < defMaxCoords[1])
									? ul.getY() + 1
									: ul.getY());
							focusCell = ul
						} else {
							lr.setY((lr.getY() < defMaxCoords[1])
									? lr.getY() + 1
									: lr.getY());
							focusCell = lr
						}
					}
				} else {
					var newX = act.getX();
					var newY = (act.getY() < defMaxCoords[1])
							? act.getY() + 1
							: act.getY();
					ul.setX(newX);
					ul.setY(newY);
					lr.setX(newX);
					lr.setY(newY);
					focusCell = ul
				}
				break
		}
		return [ul, lr, focusCell]
	};
	this.cursorKeys = {
		16 : true,
		33 : true,
		34 : true,
		37 : true,
		38 : true,
		39 : true,
		40 : true
	};
	this.setFieldContent = function(ev) {
		var env = dev.report.base.app.environment, currFormula = dev.report.base.app.currFormula, changed;
		if (dev.report.base.app.fromFormulaField) {
			env.inputField.value = currFormula.getValue()
		} else {
			currFormula.setValue(env.inputField.value)
		}
		if (changed = env.lastInputValue != currFormula.getValue()) {
			dev.report.base.keyboard.setFieldSize();
			env.lastInputValue = currFormula.getValue()
		}
		if (currFormula.getValue().substr(0, 1) != "=") {
			return
		}
		var keyPressed = document.all
				? (window.event ? window.event.keyCode : -1)
				: (typeof ev == "object" ? ev.which : -1);
		if (!(keyPressed in this.cursorKeys)) {
			env.formulaSelection.activeToken = null
		}
		if (changed) {
			dev.report.base.range.drawDependingCells(currFormula.getValue())
		}
	};
	this.setFieldSize = function() {
		var env = dev.report.base.app.environment, selCellWidth = env.selectedCell.offsetWidth, selCellHeight = env.selectedCell.offsetHeight, inputField = env.inputField;
		if (inputField._txtMetrics == undefined) {
			inputField.prepare(dev.report.base.app.activePane)
		}
		var rightMargin = inputField._txtMargin, contWidth = inputField._txtMetrics
				.getWidth(inputField.value.replace(/ /g, "t")), contLineHeight = inputField._txtHeight, fieldWidth = contWidth, fieldHeight = contLineHeight, maxDims = inputField._maxDims;
		if (contWidth < selCellWidth - inputField._txtMargin / 5 * 3) {
			fieldWidth = selCellWidth
					- (env.viewMode == dev.report.base.grid.viewMode.USER ? 3 : 2)
		} else {
			if (contWidth < maxDims.width) {
				fieldWidth += rightMargin
			} else {
				fieldWidth = maxDims.width;
				contWidth *= 1.3;
				fieldHeight = Math.round(contWidth / maxDims.width)
						* contLineHeight
						+ ((contWidth % maxDims.width > 0) ? contLineHeight : 0);
				if (fieldHeight > maxDims.height) {
					fieldHeight = maxDims.height
				}
			}
		}
		inputField.style.width = fieldWidth + "px";
		if (fieldHeight > selCellHeight) {
			inputField.style.height = fieldHeight + "px"
		}
	};
	this.skipInput = false;
	this.skipInpFldBlur = false;
	this._handleInput = function(activePane, selCellCoords,
			cellValue, isArrFrml) {
		var env = dev.report.base.app.environment;
		if (env.viewMode == dev.report.base.grid.viewMode.USER && !cellValue.search(/^=/)) {
			return true
		} else {
			if (isArrFrml === undefined || !isArrFrml) {
				if (cellValue == env.oldValue) {
					return true
				}
				/*var hdata = dev.report.base.hl.get(selCellCoords);
				if (hdata) {
					if (hdata.dyn) {
						if (cellValue.search(/^=HYPERLINK\(/) != 0) {
							activePane.clrRange([selCellCoords[0],
											selCellCoords[1], selCellCoords[0],
											selCellCoords[1]],
									dev.report.base.range.ContentType.ATTRS)
						}
					} else {
						dev.report.base.hl.updateText([selCellCoords[0],
										selCellCoords[1], selCellCoords[0],
										selCellCoords[1]], cellValue);
						cellValue = dev.report.base.general
								.filterHLTags(selCellCoords[0], selCellCoords[1],
										cellValue, true)
					}
				}*/
				env.selectedCellValue = cellValue;
				activePane.setCellValue(selCellCoords[0], selCellCoords[1],
						cellValue);
				return true
			} else {
				return false
			}
		}
	};
	this.sendInput = function(myInputBox, isArrFrml, chkSkip) {
		if (!chkSkip) {
			this.skipInput = true
		} else {
			if (this.skipInput) {
				this.skipInput = false;
				return
			}
		}
		var env = dev.report.base.app.environment, activePane = dev.report.base.app.activePane, cellValue = myInputBox.value, selCellCoords = env.selectedCellCoords;
		
		if (!this._handleInput(activePane, selCellCoords, cellValue, isArrFrml)) {
			activePane.setArrayFormula(env.defaultSelection.getActiveRange()
							.getCoords(), cellValue);
			var selCellValue = activePane.getCellUVal(selCellCoords[0],
					selCellCoords[1]);
			env.selectedCellValue = (selCellValue == undefined) ? "" : selCellValue;
			var selCellFormula = activePane.getCellFormula(selCellCoords[0],
					selCellCoords[1]);
			env.selectedCellFormula = (selCellFormula == undefined)
					? ""
					: selCellFormula;
			dev.report.base.app.currFormula.setValue(env.selectedCellFormula)
		}
		this.cancelInput();
		return true
	};
	if (dev.report.env.isMobile) {
		this.sendInputMobile = function(selCellCoords, cellValue) {
			this._handleInput(dev.report.base.app.activePane, selCellCoords, cellValue)
		}
	}
	this.cancelInput = function(delMarkRng) {
		var env = dev.report.base.app.environment;
		var inputField = env.inputField;
		var isUserMode = (env.viewMode == dev.report.base.grid.viewMode.USER);
		env.editingDirectly = false;
		if (!isUserMode) {
			if (inputField._paneId != undefined
					&& dev.report.base.app.activePane._id != inputField._paneId) {
				dev.report.base.app.activeSheet._panes[inputField._paneId].select()
			}
			var selCellCoords = env.selectedCellCoords;
			dev.report.base.app.currFormula
					.setValue(((env.selectedCellFormula != "") && (env.selectedCellFormula != "null"))
							? env.selectedCellFormula
							: dev.report.base.general.filterHLTags(selCellCoords[0],
									selCellCoords[1], env.selectedCellValue, false))
		}
		dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.READY);
		inputField.style.zIndex = "37";
		inputField.style.display = "none";
		inputField.blur();
		env.lastInputValue = "";
		env.activeNewArea = false;
		if (!isUserMode) {
			dev.report.base.app.activeSheet._defaultSelection.getCursorField().show();
			env.formulaSelection.removeAll();
			if (delMarkRng == undefined || delMarkRng) {
				env.copySelection.removeAll();
				if (dev.report.base.app.clipboard != null
						&& dev.report.base.app.clipboard.id != null) {
					dev.report.base.app.clipboard = null;
					dev.report.base.action.togglePaste(false)
				}
			}
		} else {
			dev.report.base.app.clipboard = null
		}
	};
	this.sendInputAndReset = function() {
		var env = dev.report.base.app.environment, val = env.inputField.value;
		if (this.skipInpFldBlur
				|| (val.length > 0 && val.charAt(0) == "=" && env.viewMode != dev.report.base.grid.viewMode.USER)) {
			this.skipInpFldBlur = false;
			return
		}
		this.sendInput(env.inputField, undefined, true);
		this.cancelInput();
		try {
			dev.report.base.app.currFormula.getEl().blur()
		} catch (e) {
		}
	};
	this.shiftDirection = function(direction) {
		switch (direction) {
			case dev.report.base.grid.ScrollDirection.DOWN :
				direction = dev.report.base.grid.ScrollDirection.UP;
				break;
			case dev.report.base.grid.ScrollDirection.UP :
				direction = dev.report.base.grid.ScrollDirection.DOWN;
				break;
			case dev.report.base.grid.ScrollDirection.LEFT :
				direction = dev.report.base.grid.ScrollDirection.RIGHT;
				break;
			case dev.report.base.grid.ScrollDirection.RIGHT :
				direction = dev.report.base.grid.ScrollDirection.LEFT;
				break
		}
		return direction
	};
	this.preventKeyEvent = function(myKeyEvent) {
		if (dev.report.base.app.environment.inputMode != dev.report.base.grid.GridMode.EDIT) {
			if (document.all) {
				window.event.returnValue = false;
				window.event.cancelBubble = true
			} else {
				myKeyEvent.preventDefault()
			}
		}
		return false
	};
	this.handleCursorKey = function(keyEvent) {
		var env = dev.report.base.app.environment, activePane = dev.report.base.app.activePane, keyPressed = document.all
				? keyEvent.keyCode
				: keyEvent.which, amount = 1;
		switch (keyPressed) {
			case 37 :
				if (env.selectedAbsRowNameNumeric > 1) {
					this.moveCursor(
							dev.report.base.grid.ScrollDirection.LEFT, keyEvent.shiftKey,
							amount, keyPressed)
				}
				break;
			case 33 :
				amount = Math.min(env.selectedAbsColumnName - 1,
						activePane._cppi[1]);
			case 38 :
				if (env.selectedAbsColumnName > 1) {
					this.moveCursor(
							dev.report.base.grid.ScrollDirection.UP, keyEvent.shiftKey,
							amount, keyPressed)
				}
				break;
			case 39 :
				if (env.selectedAbsRowNameNumeric < dev.report.base.grid.defMaxCoords[0]) {
					this.moveCursor(
							dev.report.base.grid.ScrollDirection.RIGHT,
							keyEvent.shiftKey, amount, keyPressed)
				}
				break;
			case 34 :
				amount = env.selectedAbsColumnName + activePane._cppi[1] < dev.report.base.grid.defMaxCoords[1]
						? activePane._cppi[1]
						: dev.report.base.grid.defMaxCoords[1]
								- env.selectedAbsColumnName;
			case 40 :
				if (env.selectedAbsColumnName < dev.report.base.grid.defMaxCoords[1]) {
					this.moveCursor(
							dev.report.base.grid.ScrollDirection.DOWN, keyEvent.shiftKey,
							amount, keyPressed)
				}
				break
		}
	};
	this.moveCursor = function(direction, shiftKey, amount, keyCode) {
		if (dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		var range = dev.report.base.app.environment.activeNewArea
				? dev.report.base.app.environment.formulaSelection
				: dev.report.base.app.environment.defaultSelection, activeBook = dev.report.base.app.activeBook, activePane = activeBook._aSheet._aPane, activeCell = range
				.getActiveRange().getActiveCell(), lastActiveCell = range
				.getActiveRange().getLastActiveCell(), coords = activeCell.clone(), lastCell = activeCell
				.clone(), isCursorKey = keyCode >= 37 && keyCode <= 40, i = 0;
		if (!dev.report.base.app.environment.defaultSelection.isSingleCell()
				&& !(keyCode == 13 || keyCode == 9) && !shiftKey) {
			range.set(activeCell, activeCell)
		}
		if (shiftKey) {
			if (isCursorKey) {
				coords = lastActiveCell.clone()
			} else {
				direction = this.shiftDirection(direction)
			}
		}
		var rangeSingleCell = range.isSingleCell(), chkHiddenColRow = dev.report.base.general.chkHiddenColRow;
		switch (direction) {
			case dev.report.base.grid.ScrollDirection.DOWN :
				if (rangeSingleCell || (shiftKey && isCursorKey)) {
					var newYCoord = chkHiddenColRow(true, coords.getY(), amount,
							true), newXCoord = chkHiddenColRow(false,
							coords.getX(), 0, true), mergeInfoSrc = activePane
							.getMergeInfo(coords.getX(), coords.getY()), mergeInfo = activePane
							.getMergeInfo(newXCoord, newYCoord);
					if (!mergeInfoSrc) {
						range.setRefActiveCell(coords)
					}
					if (mergeInfo && !mergeInfo[0]) {
						var mergeInfoMa = mergeInfoSrc && mergeInfoSrc[0]
								? mergeInfoSrc
								: activePane.getMergeInfo(mergeInfo[1],
										mergeInfo[2]);
						if (mergeInfoMa && mergeInfoMa[0]) {
							if (mergeInfoSrc && mergeInfoSrc[0]) {
								if (rangeSingleCell) {
									newYCoord = mergeInfo[2] + mergeInfoMa[2]
								}
								if (!shiftKey) {
									var refCell = range.getRefActiveCell();
									if (refCell
											&& refCell.getX() >= mergeInfo[1]
											&& refCell.getX() <= (mergeInfo[1]
													+ mergeInfoMa[1] - 1)) {
										newXCoord = refCell.getX()
									}
									var mergeInfoShiftCell = activePane
											.getMergeInfo(newXCoord, newYCoord);
									if (mergeInfoShiftCell
											&& !mergeInfoShiftCell[0]) {
										newXCoord = mergeInfoShiftCell[1];
										newYCoord = mergeInfoShiftCell[2]
									}
								}
							} else {
								newXCoord = mergeInfo[1];
								newYCoord = mergeInfo[2]
							}
						}
					}
					if (newXCoord <= dev.report.base.grid.defMaxCoords[0]
							&& newYCoord <= dev.report.base.grid.defMaxCoords[1]) {
						coords.setX(newXCoord);
						coords.setY(newYCoord)
					}
				} else {
					for (i = 0; i < amount; i++) {
						range.nextY()
					}
				}
				break;
			case dev.report.base.grid.ScrollDirection.UP :
				if (rangeSingleCell || (shiftKey && isCursorKey)) {
					var newYCoord = chkHiddenColRow(true, coords.getY(), amount,
							false), newXCoord = chkHiddenColRow(false, coords
									.getX(), 0, false), mergeInfoSrc = activePane
							.getMergeInfo(coords.getX(), coords.getY()), mergeInfo = activePane
							.getMergeInfo(newXCoord, newYCoord);
					if (!mergeInfoSrc) {
						range.setRefActiveCell(coords)
					}
					if (!shiftKey || (shiftKey && !isCursorKey)) {
						if (!mergeInfo) {
							if (mergeInfoSrc && mergeInfoSrc[0]) {
								var refCell = range.getRefActiveCell();
								if (refCell
										&& refCell.getX() >= coords.getX()
										&& refCell.getX() <= (coords.getX()
												+ mergeInfoSrc[1] - 1)) {
									newXCoord = refCell.getX()
								}
								var mergeInfoShiftCell = activePane.getMergeInfo(
										newXCoord, newYCoord);
								if (mergeInfoShiftCell && !mergeInfoShiftCell[0]) {
									newXCoord = mergeInfoShiftCell[1];
									newYCoord = mergeInfoShiftCell[2]
								}
							}
						} else {
							if (!mergeInfo[0]) {
								newXCoord = mergeInfo[1];
								newYCoord = mergeInfo[2]
							}
						}
					}
					if (newXCoord >= 1 && newYCoord >= 1) {
						coords.setX(newXCoord);
						coords.setY(newYCoord)
					}
				} else {
					for (i = 0; i < amount; i++) {
						range.prevY()
					}
				}
				break;
			case dev.report.base.grid.ScrollDirection.RIGHT :
				if (rangeSingleCell || (shiftKey && isCursorKey)) {
					var newYCoord = chkHiddenColRow(true, coords.getY(), 0, true), newXCoord = chkHiddenColRow(
							false, coords.getX(), amount, true), mergeInfoSrc = activePane
							.getMergeInfo(coords.getX(), coords.getY()), mergeInfo = activePane
							.getMergeInfo(newXCoord, newYCoord);
					if (!mergeInfoSrc) {
						range.setRefActiveCell(coords)
					}
					if (mergeInfo && !mergeInfo[0]) {
						var mergeInfoMa = mergeInfoSrc && mergeInfoSrc[0]
								? mergeInfoSrc
								: activePane.getMergeInfo(mergeInfo[1],
										mergeInfo[2]);
						if (mergeInfoMa && mergeInfoMa[0]) {
							if (mergeInfoSrc && mergeInfoSrc[0]) {
								if (rangeSingleCell) {
									newXCoord = mergeInfo[1] + mergeInfoMa[1]
								}
								if (!shiftKey) {
									var refCell = range.getRefActiveCell();
									if (refCell
											&& refCell.getY() >= mergeInfo[2]
											&& refCell.getY() <= (mergeInfo[2]
													+ mergeInfoMa[2] - 1)) {
										newYCoord = refCell.getY()
									}
									var mergeInfoShiftCell = activePane
											.getMergeInfo(newXCoord, newYCoord);
									if (mergeInfoShiftCell
											&& !mergeInfoShiftCell[0]) {
										newXCoord = mergeInfoShiftCell[1];
										newYCoord = mergeInfoShiftCell[2]
									}
								}
							} else {
								newXCoord = mergeInfo[1];
								if (!shiftKey) {
									newYCoord = mergeInfo[2]
								}
							}
						}
					}
					if (newXCoord <= dev.report.base.grid.defMaxCoords[0]
							&& newYCoord <= dev.report.base.grid.defMaxCoords[1]) {
						coords.setX(newXCoord);
						coords.setY(newYCoord)
					}
				} else {
					for (i = 0; i < amount; i++) {
						range.next()
					}
				}
				break;
			case dev.report.base.grid.ScrollDirection.LEFT :
				if (rangeSingleCell || (shiftKey && isCursorKey)) {
					var newYCoord = chkHiddenColRow(true, coords.getY(), 0, false), newXCoord = chkHiddenColRow(
							false, coords.getX(), amount, false), mergeInfoSrc = activePane
							.getMergeInfo(coords.getX(), coords.getY()), mergeInfo = activePane
							.getMergeInfo(newXCoord, newYCoord);
					if (!mergeInfoSrc) {
						range.setRefActiveCell(coords)
					}
					if (!shiftKey || (shiftKey && !isCursorKey)) {
						if (!mergeInfo) {
							if (mergeInfoSrc && mergeInfoSrc[0]) {
								var refCell = range.getRefActiveCell();
								if (refCell != undefined
										&& refCell.getY() >= coords.getY()
										&& refCell.getY() <= (coords.getY()
												+ mergeInfoSrc[2] - 1)) {
									newYCoord = refCell.getY()
								}
								var mergeInfoShiftCell = activePane.getMergeInfo(
										newXCoord, newYCoord);
								if (mergeInfoShiftCell && !mergeInfoShiftCell[0]) {
									newXCoord = mergeInfoShiftCell[1];
									newYCoord = mergeInfoShiftCell[2]
								}
							}
						} else {
							if (!mergeInfo[0]) {
								newXCoord = mergeInfo[1];
								newYCoord = mergeInfo[2]
							}
						}
					}
					if (newXCoord >= 1 && newYCoord >= 1) {
						coords.setX(newXCoord);
						coords.setY(newYCoord)
					}
				} else {
					for (i = 0; i < amount; i++) {
						range.prev()
					}
				}
				break;
			default :
				console.error("Invalid cursor direction!");
				return
		}
		if ((rangeSingleCell || (shiftKey && isCursorKey))
				&& !activePane.isCellVisible(coords.getX(), coords.getY())
				&& activeBook._scrollPending) {
			return
		}
		var cbScrollTo = function() {
			if (shiftKey && isCursorKey) {
				range.expandToCell(coords, false)
			} else {
				if (rangeSingleCell) {
					range.set(coords, coords)
				} else {
					range._setLegacyVars()
				}
			}
			range.draw()
		};
		if ((rangeSingleCell || (shiftKey && isCursorKey))
				&& !activePane.isCellVisible(coords.getX(), coords.getY())) {
			if (!activePane.isInsideRange(coords.getX(), coords.getY())) {
				var relPanes = activePane._sheet.getPanesByCoords(coords.getX(),
						coords.getY());
				if (relPanes.length == 1) {
					activePane = relPanes[0]
				}
			}
			activePane.scrollTo([this, cbScrollTo], coords.getX(), coords.getY(),
					true, false)
		} else {
			cbScrollTo()
		}
	};
	this.preventEvent = function(ev) {
		var env = dev.report.base.app.environment;
		if (!env) {
			return
		}
		if (dev.report.base.app.environment.inputMode != dev.report.base.grid.GridMode.EDIT) {
			if (document.all) {
				window.event.returnValue = false;
				window.event.cancelBubble = true
			} else {
				ev.preventDefault();
				ev.stopPropagation()
			}
		}
		return false
	};
	this.focusInput = function(currX, currY, direction) {
		var actSheet = dev.report.base.app.activeSheet, paneId = actSheet._aPane._id, iterMode = dev.report.base.grid.IterationMode, realRngs = actSheet
				.getVirtScroll(), rngs = [];
		if (realRngs[0] instanceof Array) {
			for (var i = 0, rRLen = realRngs.length; i < rRLen; i++) {
				rngs.push({
							ulX : realRngs[i][0],
							ulY : realRngs[i][1],
							lrX : realRngs[i][2],
							lrY : realRngs[i][3]
						})
			}
		} else {
			rngs.push({
						ulX : realRngs[0],
						ulY : realRngs[1],
						lrX : realRngs[2],
						lrY : realRngs[3]
					})
		}
		function iterForHor(x, y) {
			var i = sPane = paneId, isBeg = true, pX = x - rngs[i].ulX + 1, pY = y
					- rngs[i].ulY + 1, sPX = pX <= 0 ? (pX = 1) : pX, sPY = pY <= 0
					? (pY = 1)
					: pY;
			while (true) {
				for (; x <= rngs[i].lrX; ++x, ++pX) {
					if (!isBeg && i == sPane && pX == sPX && pY == sPY) {
						return
					}
					if (!actSheet._panes[i].isCellLocked(x, y)
							&& actSheet.isCellHidden(x, y)) {
						dev.report.base.mouse.mimicCellMouseEvent(x, y, "mousedown",
								actSheet._panes[i]);
						return
					}
				}
				isBeg = false;
				if (rngs.length == 4) {
					if (i % 2) {
						if (y == rngs[i].lrY) {
							pX = 1, pY = 1, x = rngs[i == 3 ? (i = 0) : ++i].ulX, y = rngs[i].ulY
						} else {
							pX = 1, pY++, x = rngs[--i].ulX, y = rngs[i].ulY + pY
									- 1
						}
					} else {
						pX = 1, x = rngs[++i].ulX, y = rngs[i].ulY + pY - 1
					}
				} else {
					if (y == rngs[i].lrY) {
						pX = 1, pY = 1, x = rngs[rngs.length == 1 ? i : (i
								? --i
								: ++i)].ulX, y = rngs[i].ulY
					} else {
						pX = 1, pY++, x = rngs[i].ulX, y++
					}
				}
			}
		}
		function iterBackHor(x, y) {
			var i = sPane = paneId, isBeg = true, pX = x - rngs[i].ulX + 1, pY = y
					- rngs[i].ulY + 1, sPX = pX <= 0 ? (pX = 1) : pX, sPY = pY <= 0
					? (pY = 1)
					: pY;
			while (true) {
				if (pX > 0) {
					for (; pX >= 1; --x, --pX) {
						if (!isBeg && i == sPane && pX == sPX && pY == sPY) {
							return
						}
						if (!actSheet._panes[i].isCellLocked(x, y)
								&& actSheet.isCellHidden(x, y)) {
							dev.report.base.mouse.mimicCellMouseEvent(x, y, "mousedown",
									actSheet._panes[i]);
							return
						}
					}
				}
				isBeg = false;
				if (rngs.length == 4) {
					if (i % 2) {
						pX = rngs[--i].lrX - rngs[i].ulX + 1, x = rngs[i].lrX, y = rngs[i].ulY
								+ pY - 1
					} else {
						if (pY == 1) {
							pX = rngs[i == 0 ? (i = 3) : --i].lrX - rngs[i].ulX + 1, pY = rngs[i].lrY
									- rngs[i].ulY + 1, x = rngs[i].lrX, y = rngs[i].lrY
						} else {
							pX = rngs[++i].lrX - rngs[i].ulX + 1, pY--, x = rngs[i].lrX, y = rngs[i].ulY
									+ pY - 1
						}
					}
				} else {
					if (pY == 1) {
						pX = rngs[rngs.length == 1 ? i : (i ? --i : ++i)].lrX
								- rngs[i].ulX + 1, pY = rngs[i].lrY - rngs[i].ulY
								+ 1, x = rngs[i].lrX, y = rngs[i].lrY
					} else {
						pX = rngs[i].lrX - rngs[i].ulX + 1, pY--, x = rngs[i].lrX, y--
					}
				}
			}
		}
		function iterForVert(x, y) {
			var i = sPane = paneId, isBeg = true, pX = x - rngs[i].ulX + 1, pY = y
					- rngs[i].ulY + 1, sPX = pX <= 0 ? (pX = 1) : pX, sPY = pY <= 0
					? (pY = 1)
					: pY;
			while (true) {
				for (; y <= rngs[i].lrY; ++y, ++pY) {
					if (!isBeg && i == sPane && pX == sPX && pY == sPY) {
						return
					}
					if (!actSheet._panes[i].isCellLocked(x, y)
							&& actSheet.isCellHidden(x, y)) {
						dev.report.base.mouse.mimicCellMouseEvent(x, y, "mousedown",
								actSheet._panes[i]);
						return
					}
				}
				isBeg = false;
				switch (rngs.length) {
					case 4 :
						if (i >= 2) {
							if (x == rngs[i].lrX) {
								pX = 1, pY = 1, x = rngs[i == 3 ? (i = 0) : --i].ulX, y = rngs[i].ulY
							} else {
								pX++, pY = 1, x = rngs[(i -= 2)].ulX + pX - 1, y = rngs[i].ulY
							}
						} else {
							pY = 1, x = rngs[(i += 2)].ulX + pX - 1, y = rngs[i].ulY
						}
						break;
					case 2 :
						if (x == rngs[i].lrX && i) {
							pX = 1, pY = 1, x = rngs[--i].ulX, y = rngs[i].ulY
						} else {
							pX = i ? pX + 1 : pX, pY = 1, x = i ? x + 1 : x, y = rngs[i
									? --i
									: ++i].ulY
						}
						break;
					default :
						if (x == rngs[i].lrX) {
							pX = 1, pY = 1, x = rngs[i].ulX, y = rngs[i].ulY
						} else {
							pX++, pY = 1, x++, y = rngs[i].ulY
						}
				}
			}
		}
		function iterBackVert(x, y) {
			var i = sPane = paneId, isBeg = true, pX = x - rngs[i].ulX + 1, pY = y
					- rngs[i].ulY + 1, sPX = pX <= 0 ? (pX = 1) : pX, sPY = pY <= 0
					? (pY = 1)
					: pY;
			while (true) {
				if (pY > 0) {
					for (; pY >= 1; --y, --pY) {
						if (!isBeg && i == sPane && pX == sPX && pY == sPY) {
							return
						}
						if (!actSheet._panes[i].isCellLocked(x, y)
								&& actSheet.isCellHidden(x, y)) {
							dev.report.base.mouse.mimicCellMouseEvent(x, y, "mousedown",
									actSheet._panes[i]);
							return
						}
					}
				}
				isBeg = false;
				switch (rngs.length) {
					case 4 :
						if (i >= 2) {
							pY = rngs[(i -= 2)].lrY - rngs[i].ulY + 1, x = rngs[i].ulX
									+ pX - 1, y = rngs[i].lrY
						} else {
							if (pX == 1) {
								pX = rngs[i == 0 ? (i = 3) : ++i].lrX - rngs[i].ulX
										+ 1, pY = rngs[i].lrY - rngs[i].ulY + 1, x = rngs[i].lrX, y = rngs[i].lrY
							} else {
								pX--, pY = rngs[(i += 2)].lrY - rngs[i].ulY + 1, x = rngs[i].ulX
										+ pX - 1, y = rngs[i].lrY
							}
						}
						break;
					case 2 :
						if (pX == 1 && !i) {
							pX = rngs[++i].lrX - rngs[i].ulX + 1, pY = rngs[i].lrY
									- rngs[i].ulY + 1, x = rngs[i].lrX, y = rngs[i].lrY
						} else {
							pX = i ? pX : pX - 1, x = i ? x : x - 1, pY = rngs[i
									? --i
									: ++i].lrY
									- rngs[i].ulY + 1, y = rngs[i].lrY
						}
						break;
					default :
						if (pX == 1) {
							pX = rngs[i].lrX - rngs[i].ulX + 1, pY = rngs[i].lrY
									- rngs[i].ulY + 1, x = rngs[i].lrX, y = rngs[i].lrY
						} else {
							pX--, pY = rngs[i].lrY - rngs[i].ulY + 1, x--, y = rngs[i].lrY
						}
				}
			}
		}
		switch (direction) {
			case iterMode.NEXTX :
				iterForHor(currX + 1, currY);
				break;
			case iterMode.PREVX :
				iterBackHor(currX - 1, currY);
				break;
			case iterMode.NEXTY :
				iterForVert(currX, currY + 1);
				break;
			case iterMode.PREVY :
				iterBackVert(currX, currY - 1);
				break;
			case iterMode.FIRST :
				paneId = rngs.length - 1;
				iterForHor(rngs[paneId].lrX + 1, rngs[paneId].lrX);
				break;
			case iterMode.LAST :
				paneId = 0;
				iterBackHor(rngs[paneId].ulX - 1, rngs[paneId].ulX);
				break
		}
	};
	this.handleUMFocus = function(keyCode, shiftKey) {
		var selCellCoords = dev.report.base.app.environment.selectedCellCoords;
		if (selCellCoords.length == 0) {
			selCellCoords = [1, 1]
		}
		switch (keyCode) {
			case 9 :
				this.focusInput(selCellCoords[0], selCellCoords[1],
						shiftKey
								? dev.report.base.grid.IterationMode.PREVX
								: dev.report.base.grid.IterationMode.NEXTX);
				break;
			case 13 :
				this.focusInput(selCellCoords[0], selCellCoords[1],
						shiftKey
								? dev.report.base.grid.IterationMode.PREVY
								: dev.report.base.grid.IterationMode.NEXTY);
				break;
			case 39 :
				this.focusInput(selCellCoords[0], selCellCoords[1],
						dev.report.base.grid.IterationMode.NEXTX);
				break;
			case 37 :
				this.focusInput(selCellCoords[0], selCellCoords[1],
						dev.report.base.grid.IterationMode.PREVX);
				break;
			case 40 :
				this.focusInput(selCellCoords[0], selCellCoords[1],
						dev.report.base.grid.IterationMode.NEXTY);
				break;
			case 38 :
				this.focusInput(selCellCoords[0], selCellCoords[1],
						dev.report.base.grid.IterationMode.PREVY);
				break
		}
	};
	this.fetchGlobalKeyUp = function(ev) {
		if (document.all) {
			ev = window.event
		}
		if (!ev.ctrlKey) {
			dev.report.base.app.ctrlKeyPressed = false;
			var env = dev.report.base.app.environment;
			var mousePos = (env) ? env.mousePosition : null;
			if (mousePos == "rngBorder" || mousePos == "magicDot") {
				env.defaultSelection.setCursor(mousePos, (mousePos == "rngBorder")
								? "rng_move"
								: "md_curr")
			}
		}
		var wrapper = dev.report.base.app.activeWrapper;
		if (wrapper && !ev.shiftKey) {
			wrapper.preserveRatio = wrapper.defaultRatio
		}
	};
	this.genKbdEvent = function(keyCode, ctrlKey, altKey, shiftKey,
			metaKey) {
		if (window.KeyEvent) {
			var evObj = document.createEvent("KeyEvents");
			evObj.initKeyEvent("keydown", true, true, window, ctrlKey, altKey,
					shiftKey, metaKey, keyCode, 0);
			fireOnThis.dispatchEvent(evObj)
		} else {
			var evObj = document.createEventObject();
			evObj.ctrlKey = true;
			evObj.keyCode = keyCode;
			document.fireEvent("onkeydown", evObj)
		}
	};
}