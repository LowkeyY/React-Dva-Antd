
Ext.namespace("dev.report.kbd");

dev.report.kbd.General = (function() {
	return function() {
		dev.report.kbd.General.parent.constructor.call(this);
		this.env = null;
		this.activeBook = null;
		this.activePane = null;
		this.result = true;
		this.copyToClp = false;
		this.pasteFromClp = false
	}
})();
dev.report.util.extend(dev.report.kbd.General, dev.report.kbd.Base);
clsRef = dev.report.kbd.General;
clsRef.prototype.handle = function(event) {
	this.event = document.all ? window.event : event;
	this.keyCode = document.all ? this.event.keyCode : this.event.which;
	this.env = dev.report.base.app.environment;
	this.activeBook = dev.report.base.app.activeBook;
	this.activePane = dev.report.base.app.activePane;
	dev.report.base.app.lastKeyPressed = this.keyCode;
	this.result = true;
	this.copyToClp = false;
	this.pasteFromClp = false;
	if (this.env && this.env.inputMode != dev.report.base.grid.GridMode.DIALOG
			&& this.env.editingDirectly) {
		var lastInputField = dev.report.base.app.lastInputField, selCellCoords = this.env.selectedCellCoords;
		if (this.env.viewMode != dev.report.base.grid.viewMode.USER
				&& (lastInputField == dev.report.base.app.currFormula || !this.activePane
						.isCellVisible(selCellCoords[0], selCellCoords[1]))) {
			dev.report.base.app.currFormula.focus();
			dev.report.base.app.fromFormulaField = true
		} else {
			lastInputField.focus()
		}
	}
	if (this.event.ctrlKey && !dev.report.base.app.ctrlKeyPressed) {
		dev.report.base.app.ctrlKeyPressed = true
	}
	if (this.env && this.env.viewMode != dev.report.base.grid.viewMode.USER
			&& !dev.report.base.app.ctrlKeyPressed) {
		this.env.defaultSelection.show();
		dev.report.base.hb.setAllNormal()
	}
	var kHandler = "_".concat(this.keyCode);
	if (this[kHandler]) {
		this[kHandler]()
	} else {
		this._handleDefault()
	}
};
clsRef.prototype._handleDefault = function() {
	if (this.keyCode == 8 || this.keyCode == 32
			|| (this.keyCode > 41 && this.keyCode <= 90)
			|| (this.keyCode > 95 && this.keyCode <= 107)
			|| (this.keyCode > 108 && this.keyCode <= 111)
			|| (this.keyCode >= 187 && this.keyCode <= 226)) {
		if (this.env) {
			if (this.env.inputMode == dev.report.base.grid.GridMode.READY) {
				if (this.env.viewMode == dev.report.base.grid.viewMode.USER) {
					var selCoords = this.env.selectedCellCoords;
					if (this.activePane
							.isCellLocked(selCoords[0], selCoords[1])) {
						return
					}
				}
				this.env.selectedCellValue = "";
				this.env.selectedCellFormula = "";
				dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.INPUT);
				dev.report.base.general
						.showInputField(null, false, true, false, true);
				dev.report.base.app.handlers.updateUndoState([1, 0], false)
			} else {
				if (this.env.inputMode == dev.report.base.grid.GridMode.EDIT
						|| this.env.inputMode == dev.report.base.grid.GridMode.INPUT) {
					dev.report.base.app.handlers.updateUndoState([1, 0], false)
				}
			}
		}
	}
	this._handleEnd()
};
clsRef.prototype._resetFocus = function() {
	dev.report.base.general.setInputMode(dev.report.base.app.lastInputModeDlg);
	dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
};
clsRef.prototype._setDefaultRange = function(rng) {
	if (this.env) {
		var defSel = this.env.defaultSelection;
		if (defSel) {
			defSel.jumpTo(rng)
		}
	}
	this._handleEnd()
};
clsRef.prototype._handleEnd = function() {
	if (this.env && !this.pasteFromClp
			&& this.env.inputMode != dev.report.base.grid.GridMode.EDIT
			&& this.env.inputMode != dev.report.base.grid.GridMode.INPUT
			&& this.env.inputMode != dev.report.base.grid.GridMode.CNTRL
			&& this.env.inputMode != dev.report.base.grid.GridMode.DIALOG) {
		dev.report.base.keyboard.preventKeyEvent(this.event)
	}
	if (this.env && this.env.viewMode == dev.report.base.grid.viewMode.USER) {
		dev.report.base.keyboard.handleUMFocus(this.keyCode, this.event.shiftKey)
	}
	if (this.copyToClp) {
		this._resetFocus()
	}
	if (this.pasteFromClp) {
		setTimeout("dev.report.base.action.paste()", 1);
		this._resetFocus()
	}
};
clsRef.prototype._9 = function() {
	if (dev.report.base.action.sendGridInput(this.event, this.keyCode)) {
		if (this.keyCode == 9) {
			dev.report.base.keyboard.moveCursor(dev.report.base.grid.ScrollDirection.RIGHT,
					this.event.shiftKey, 1, this.keyCode)
		} else {
			if (!(this.event.ctrlKey && this.event.shiftKey)) {
				dev.report.base.keyboard.moveCursor(
						dev.report.base.grid.ScrollDirection.DOWN,
						this.event.shiftKey, 1, this.keyCode)
			}
		}
	}
	this._handleEnd()
};
clsRef.prototype._13 = function() {
	dev.report.base.action.exitFormatPainter();
	this._9()
};
clsRef.prototype._27 = function() {
	dev.report.base.action.cancelGridInput();
	dev.report.base.action.exitFormatPainter();
	this._handleEnd()
};
clsRef.prototype._36 = function() {
	if (this.event.ctrlKey) {
		var col = 1, row = 1
	} else {
		var col = 1, row = this.env.selectedAbsColumnName
	}
	dev.report.base.keyboard.preventKeyEvent(this.event);
	this.activePane.scrollTo(
			[this, this._setDefaultRange, [col, row, col, row]], col, row,
			true, false)
};
clsRef.prototype._35 = function() {
	if (this.event.ctrlKey) {
		dev.report.base.keyboard.preventKeyEvent(this.event);
		var fuc = this.activePane.getFarthestUsedCell();
		this.activePane.scrollTo([this, this._setDefaultRange,
						[fuc[0], fuc[1], fuc[0], fuc[1]]], fuc[0], fuc[1],
				true, false)
	}
};
clsRef.prototype._37 = function() {
	if (this.env) {
		if (this.env.inputMode == dev.report.base.grid.GridMode.INPUT) {
			var value = this.env.inputField.value;
			if ((value.length > 0) && (value.substr(0, 1) == "=")) {
				var elemCoords;
				if (this.env.formulaSelection.activeToken != null) {
					var point, area = this.env.formulaSelection
							.getActiveRange(), areaCorners = area.getCorners();
					elemCoords = dev.report.base.keyboard.calcCursorRng(
							areaCorners[0].clone(), areaCorners[1].clone(),
							area.getAnchorCell().clone(), this.keyCode,
							this.event.shiftKey);
					area.set(elemCoords[0], elemCoords[1]);
					if (elemCoords[0].equals(elemCoords[1])) {
						area.setAnchorCell(elemCoords[0])
					}
					area.formulaUpdate();
					area.draw()
				} else {
					var defRngActCell = this.env.defaultSelection
							.getActiveRange().getActiveCell().clone();
					elemCoords = dev.report.base.keyboard.calcCursorRng(
							defRngActCell, defRngActCell, defRngActCell,
							this.keyCode, this.event.shiftKey);
					if (!this.activePane.isCellVisible(elemCoords[2].getX(),
							elemCoords[2].getY())
							&& this.activeBook._scrollPending) {
						return
					}
					var currFormula = dev.report.base.app.currFormula, cursorPos = dev.report.util
							.getSelection(dev.report.base.app.fromFormulaField
									? currFormula.el.dom
									: this.env.inputField).start;
					if (cursorPos < currFormula.getValue().length
							|| value.substr(-1, 1).match(/^[a-z0-9]$/i) != null) {
						if (this.env.oldValue != value) {
							dev.report.base.keyboard.sendInput(this.env.inputField)
						} else {
							dev.report.base.keyboard.cancelInput()
						}
						return dev.report.base.keyboard.checkGlobalInput(this.event)
					}
					var area_id = this.env.formulaSelection
							.addRange(new dev.report.gen.Point(elemCoords[0].getX(),
									elemCoords[0].getY()))
							- 1;
					this.env.formulaSelection.setActiveRange(area_id);
					var area = this.env.formulaSelection.getActiveRange(), areaVal = area
							.getValue();
					this.env.inputField.value = value.concat(areaVal);
					currFormula.setValue(this.env.inputField.value);
					var refs = dev.report.base.formula.parse(currFormula.getValue(),
							dev.report.base.app.activePane.getCellNFs(elemCoords[0]
											.getX(), elemCoords[0].getY()));
					this.env.formulaSelection.lastParseRes = refs;
					this.env.formulaSelection.activeToken = area.formulaToken = refs[refs.length
							- 1];
					this.env.formulaSelection
							.setState(dev.report.base.range.AreaState.NEW);
					area.draw();
					dev.report.base.keyboard.setFieldSize();
					this.env.lastInputValue = currFormula.getValue()
				}
				if (!this.activePane.isCellVisible(elemCoords[2].getX(),
						elemCoords[2].getY())) {
					dev.report.base.keyboard.preventKeyEvent(this.event);
					this.activePane.scrollTo([this, this._handleEnd],
							elemCoords[2].getX(), elemCoords[2].getY(), true,
							false);
					return
				}
			} else {
				this.result = dev.report.base.keyboard.sendInput(this.env.inputField);
				if (this.result) {
					dev.report.base.keyboard.cancelInput(false);
					try {
						dev.report.base.app.currFormula.getEl().blur()
					} catch (e) {
					}
					dev.report.base.keyboard.handleCursorKey(this.event)
				} else {
					alert("Invalid input!".localize());
					dev.report.base.general.focusInputField()
				}
			}
			dev.report.base.keyboard.preventKeyEvent(this.event)
		} else {
			if (!this.env.editingDirectly
					&& (this.env.inputMode != dev.report.base.grid.GridMode.CNTRL)
					&& (this.env.inputMode != dev.report.base.grid.GridMode.DIALOG)) {
				dev.report.base.keyboard.handleCursorKey(this.event)
			}
			if ((this.env.inputMode == dev.report.base.grid.GridMode.DIALOG)
					&& dev.report.base.app.currentDialogControl != null) {
				var selCmp = Ext.getCmp(dev.report.base.app.currentDialogControl);
				if (selCmp.getXType() == "dataview") {
					var currIndex = selCmp.getSelectedIndexes()[0];
					switch (this.keyCode) {
						case 33 :
						case 37 :
						case 38 :
							selCmp
									.select((currIndex > 0)
											? --currIndex
											: dev.report.base.app.currentDialogControlItemsCnt
													- 1);
							break;
						case 34 :
						case 39 :
						case 40 :
							selCmp
									.select((currIndex < dev.report.base.app.currentDialogControlItemsCnt
											- 1) ? ++currIndex : 0);
							break
					}
					dev.report.base.keyboard.preventKeyEvent(this.event)
				}
			}
		}
	}
	this._handleEnd()
};
clsRef.prototype._38 = function() {
	this._37()
};
clsRef.prototype._39 = function() {
	this._37()
};
clsRef.prototype._40 = function() {
	this._37()
};
clsRef.prototype._33 = function() {
	this._37()
};
clsRef.prototype._34 = function() {
	this._37()
};
clsRef.prototype._46 = function() {
	if (this.env && (this.env.inputMode != dev.report.base.grid.GridMode.INPUT)
			&& (this.env.inputMode != dev.report.base.grid.GridMode.EDIT)
			&& (this.env.inputMode != dev.report.base.grid.GridMode.CNTRL)
			&& (this.env.inputMode != dev.report.base.grid.GridMode.DIALOG)
			&& (!this.env.editingDirectly)) {
		if (this.env.viewMode == dev.report.base.grid.viewMode.USER) {
			this.env.inputField.value = "";
			this.env.selectedCellValue = "";
			dev.report.base.app.activeSheet._cursorField.setContent("");
			var cellCoords = this.env.lastRangeStartCoord;
			this.activePane.clrCell(cellCoords[0], cellCoords[1])
		} else {
			this.env.defaultSelection.emptyCellContent()
		}
	}
	this._handleEnd()
};
clsRef.prototype._113 = function() {
	if (this.env) {
		if (this.env.inputMode != dev.report.base.grid.GridMode.EDIT
				&& this.env.inputMode != dev.report.base.grid.GridMode.INPUT) {
			dev.report.base.general.setInputMode(dev.report.base.grid.GridMode.EDIT);
			dev.report.base.general.showInputField(null, false, true)
		} else {
			dev.report.base.general
					.setInputMode(dev.report.base.grid.GridMode[this.env.inputMode == dev.report.base.grid.GridMode.EDIT
							? "INPUT"
							: "EDIT"])
		}
	}
	this._handleEnd()
};
clsRef.prototype._120 = function() {
	if (this.env && this.env.inputMode != dev.report.base.grid.GridMode.EDIT
			&& this.env.inputMode != dev.report.base.grid.GridMode.INPUT) {
		dev.report.base.sheet.refresh()
	}
	this._handleEnd()
};
clsRef.prototype._122 = function() {
	if (this.event.altKey && this.env
			&& this.env.viewMode != dev.report.base.grid.viewMode.USER) {
			using("dev.report.base.dlg.InsertMacro");
			var insertMacro=new dev.report.base.dlg.InsertMacro();
	}
	this._handleEnd()
};
clsRef.prototype._16 = function() {
	var wrapper = dev.report.base.app.activeWrapper;
	if (wrapper) {
		wrapper.preserveRatio = !wrapper.defaultRatio
	}
};
clsRef.prototype._17 = function() {
	var mousePos = this.env ? this.env.mousePosition : null;
	if (mousePos == "rngBorder" || mousePos == "magicDot") {
		this.env.defaultSelection.setCursor(mousePos, (mousePos == "rngBorder")
						? "rng_copy"
						: "md_curr_plus")
	}
	this._handleEnd()
};
clsRef.prototype._67 = function() {
	if (this.event.ctrlKey && this.env) {
		dev.report.base.action.copy(true);
		if (this.env.inputMode == dev.report.base.grid.GridMode.READY
				|| this.env.inputMode == dev.report.base.grid.GridMode.DIALOG) {
			this.copyToClp = true
		}
	} else {
		this._handleDefault()
	}
	this._handleEnd()
};
clsRef.prototype._71 = function() {
	if (this.event.ctrlKey && this.env
			&& this.env.viewMode != dev.report.base.grid.viewMode.USER) {
				using("dev.report.base.dlg.GoTo");
				var goTo=new dev.report.base.dlg.GoTo();
				goTo.win.show(goTo);
	} else {
		this._handleDefault()
	}
	this._handleEnd()
};
clsRef.prototype._86 = function() {
	if (this.event.ctrlKey && this.env
			&& this.env.inputMode == dev.report.base.grid.GridMode.READY) {
		if (dev.report.base.app.clipboard == null) {
			var pomdiv = document.createElement("div");
			pomdiv.setAttribute("id", "pomdiv");
			pomdiv.style.width = "1px";
			pomdiv.style.height = "1px";
			pomdiv.style.position = "relative";
			pomdiv.style.overflow = "hidden";
			var _pinput = document.createElement("textarea");
			_pinput.setAttribute("id", "_paste_field_");
			_pinput.setAttribute("name", "_paste_field_");
			_pinput
					.setAttribute("style",
							"position: float; width: 1px; height: 1px; z-index: 999; overflow: hidden;");
			pomdiv.appendChild(_pinput);
			document.body.appendChild(pomdiv);
			document.getElementById("_paste_field_").focus();
			document.getElementById("_paste_field_").select();
			this.pasteFromClp = true
		} else {
			dev.report.base.action.paste()
		}
	} else {
		this._handleDefault()
	}
	this._handleEnd()
};
clsRef.prototype._88 = function() {
	if (this.event.ctrlKey && this.env) {
		dev.report.base.action.cut(true);
		if (this.env.inputMode == dev.report.base.grid.GridMode.READY
				|| this.env.inputMode == dev.report.base.grid.GridMode.DIALOG) {
			this.copyToClp = true
		}
	} else {
		this._handleDefault()
	}
	this._handleEnd()
};
clsRef.prototype._89 = function() {
	if (this.event.ctrlKey && this.env) {
		dev.report.base.sheet.redo();
		dev.report.base.keyboard.preventKeyEvent(this.event)
	} else {
		this._handleDefault()
	}
	this._handleEnd()
};
clsRef.prototype._90 = function() {
	if (this.event.ctrlKey && this.env) {
		dev.report.base.sheet.undo();
		dev.report.base.keyboard.preventKeyEvent(this.event)
	} else {
		this._handleDefault()
	}
	this._handleEnd()
};
clsRef = null;