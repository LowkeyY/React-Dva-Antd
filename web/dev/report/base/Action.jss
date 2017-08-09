
Ext.namespace("dev.report.base");
dev.report.base.Action =function() {
	this.copy = function(copyToClp) {
		var env = dev.report.base.app.environment;
		if (env.inputMode == dev.report.base.grid.GridMode.READY) {
			var viewMode = dev.report.base.grid.viewMode;
			switch (env.viewMode) {
				case viewMode.DESIGNER :
					dev.report.base.app.gridBlurObserver.subscribe(this.cancelGridInput,
							this);
					env.defaultSelection.copy(copyToClp);
					break;
				case viewMode.USER :
					if (!env.selectedCellCoords.length) {
						return
					}
					var cursorField = dev.report.base.app.activeSheet._cursorField;
					cursorField.setBorder("2px solid #F5B800");
					var cursorValue = dev.report.base.app.activePane.getCellValue(
							env.selectedCellCoords[0], env.selectedCellCoords[1]);
					if (cursorValue == undefined) {
						cursorValue = ""
					}
					dev.report.base.app.clipboard = {
						id : null,
						op : dev.report.base.grid.gridOperation.COPY,
						value : cursorValue
					};
					var _highlightBackToNormalCell = function() {
						cursorField.setBorder("2px solid #7EADD9")
					};
					setTimeout(_highlightBackToNormalCell, 300);
					if (copyToClp) {
						dev.report.base.general.setSysClipboard(cursorValue)
					}
			}
		} else {
			var selText = dev.report.util.getSelected(env.inputField);
			if (selText != null) {
				dev.report.base.app.clipboard = {
					id : null,
					op : dev.report.base.grid.gridOperation.COPY,
					value : selText
				}
			}
		}
		this.togglePaste(true)
	};
	this.cut = function(copyToClp) {
		var env = dev.report.base.app.environment;
		if (env.inputMode == dev.report.base.grid.GridMode.READY) {
			var viewMode = dev.report.base.grid.viewMode;
			switch (env.viewMode) {
				case viewMode.DESIGNER :
					dev.report.base.app.gridBlurObserver.subscribe(this.cancelGridInput,
							this);
					env.defaultSelection.cut(copyToClp);
					break;
				case viewMode.USER :
					var selCellCoords = env.selectedCellCoords;
					if (selCellCoords.length == 0) {
						return
					}
					var activePane = dev.report.base.app.activePane, cursorValue = activePane
							.getCellValue(selCellCoords[0], selCellCoords[1]);
					if (cursorValue == undefined) {
						cursorValue = ""
					}
					dev.report.base.app.clipboard = {
						id : null,
						op : dev.report.base.grid.gridOperation.CUT,
						value : cursorValue
					};
					if (copyToClp) {
						dev.report.base.general.setSysClipboard(cursorValue)
					}
					dev.report.base.app.activeSheet._cursorField.setContent("");
					activePane.clrRange([selCellCoords[0], selCellCoords[1],
							selCellCoords[0], selCellCoords[1]])
			}
		} else {
			var selText = dev.report.util.getSelected(env.inputField);
			if (selText != null) {
				dev.report.base.app.clipboard = {
					id : null,
					op : dev.report.base.grid.gridOperation.CUT,
					value : selText
				}
			}
		}
		this.togglePaste(true)
	};
	this.paste = function(pasteWhat) {
		var env = dev.report.base.app.environment, grid = dev.report.base.grid;
		if (env.inputMode != grid.GridMode.READY) {
			return
		}
		var viewMode = grid.viewMode;
		switch (env.viewMode) {
			case viewMode.DESIGNER :
				env.defaultSelection.paste(pasteWhat
						? pasteWhat
						: dev.report.base.range.ContentType.ALL_PASTE);
				var clipboard = dev.report.base.app.clipboard;
				if (clipboard && clipboard.op == grid.gridOperation.CUT) {
					dev.report.base.app.gridBlurObserver.notify(this)
				}
				break;
			case viewMode.USER :
				var selCellCoords = env.selectedCellCoords;
				if (!selCellCoords.length) {
					return
				}
				var clipboard = dev.report.base.app.clipboard, defMaxCoords = grid.defMaxCoords, clpVal;
				if (clipboard == null) {
					clpVal = dev.report.base.general.parseSysClipboard(true)
				} else {
					clpVal = {
						value : [clipboard.value],
						markRngDim : {
							width : 1,
							height : 1
						}
					}
				}
				var lrX = selCellCoords[0] + clpVal.markRngDim.width - 1, lrY = selCellCoords[1]
						+ clpVal.markRngDim.height - 1;
				dev.report.base.app.activePane.setRangeValue([selCellCoords[0],
								selCellCoords[1],
								lrX > defMaxCoords[0] ? defMaxCoords[0] : lrX,
								lrY > defMaxCoords[1] ? defMaxCoords[1] : lrY],
						clpVal.value);
				break
		}
	};
	this.togglePaste = function(enabled) {
		if (dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		var act = enabled ? "enable" : "disable", menubar = dev.report.base.app.menubar, toolbar = dev.report.base.app.toolbar;
		
		var  tbarLayouts = dev.report.base.app.toolbarLayouts;
		menubar.paste[act]();
		
		/*
		menubar.pasteSpec[act]();
		switch (dev.report.base.app.toolbarLayout) {
			case tbarLayouts.TOOLBAR :
				menubar.paste[act]();
				menubar.pasteSpec[act]();
				break;
			case tbarLayouts.RIBBON :
				toolbar.pasteSpec[act]();
				break
		}*/
		toolbar.paste[act]()	
	};
	this.applyFormatPainter = function(me) {
		if (me.clicked) {
			clearTimeout(me.timer);
			me.toggle(true, true);
			dev.report.base.app.formatPainter = 2;
			dev.report.base.app.gridBlurObserver.subscribe(
					this.exitFormatPainter, me);
			this.copy(false);
			this.setCursorCSS(true)
		} else {
			me.timer = setTimeout(function() {
						clearTimeout(me.timer);
						me.clicked = false;
						if (me.pressed) {
							dev.report.base.app.formatPainter = 1;
							dev.report.base.app.gridBlurObserver.subscribe(
									this.exitFormatPainter, me);
							this.copy(false);
							this.setCursorCSS(true)
						} else {
							this.exitFormatPainter()
						}
					}.createDelegate(this), 400)
		}
		me.clicked = !me.clicked
	};
	this.exitFormatPainter = function() {
		if (!dev.report.base.app.formatPainter) {
			return
		}
		var env = dev.report.base.app.environment;
		if ((env.inputMode != dev.report.base.grid.GridMode.DIALOG && env.inputMode != dev.report.base.grid.GridMode.READY)
				|| env.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		env.defaultSelection.exitFormatPainter();
		this.toggleFormatPainter(false);
		this.togglePaste(false);
		this.setCursorCSS(false);
		dev.report.base.app.gridBlurObserver
				.unsubscribe(this.exitFormatPainter)
	}.createDelegate(this);;
	this.toggleFormatPainter = function(toggle) {
		if (dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		var act = "toggle", toolbar = dev.report.base.app.toolbar;
		toolbar.formatPainter[act](toggle, true)
	};
	this.setCursorCSS = function(fp) {
		var myStyleSheet = document.styleSheets[document.styleSheets.length - 1], classNames = [
				"div.gridCell", "div.customCursor"], classContent = "cursor: url(/dev/report/res/img/xlpainter.cur), default; #cursor: url(/dev/report/res/img/xlpainter.cur), default;";
		if (fp) {
			if (myStyleSheet.insertRule) {
				myStyleSheet.insertRule(classNames.join(", ").concat("{",
								classContent, "}"), myStyleSheet.cssRules.length)
			} else {
				if (myStyleSheet.addRule) {
					myStyleSheet.addRule(classNames.join(", "), classContent,
							myStyleSheet.rules.length)
				}
			}
		} else {
			if (myStyleSheet.deleteRule) {
				myStyleSheet.deleteRule(myStyleSheet.cssRules.length - 1)
			} else {
				if (myStyleSheet.removeRule) {
					for (var i = 0, index = myStyleSheet.rules.length - 1, count = classNames.length; i < count; i++) {
						myStyleSheet.removeRule(index--)
					}
				}
			}
		}
	};
	this.refreshWindow = function() {
		window.onbeforeunload = function() {
		};
		window.location.href = window.location.href
	};
	this.closeWindow = function() {
		if (dev.report.base.wnd.active != null) {
			dev.report.base.wnd.active.unload()
		}
	};
	this.refreshData = function() {
		dev.report.base.sheet.refresh()
	};
	this.exportToPDF = function() {
		var uid=dev.report.model.report.id;
		var frameId='iframe-'+uid;
		var printViewIframe=Ext.get(frameId);
		window.open(printViewIframe.dom.src+"&type=pdf","_blank","height=768, width=1024, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=no, status=yes");
	};  
	this.print = function() {
		var uid=dev.report.model.report.id;
		var frameId='iframe-'+uid;
		var iframe = document.frames ? document.frames[frameId] : document.getElementById(frameId);
		var ifWin = iframe.contentWindow || iframe;
		iframe.focus();
		ifWin.print();
		return false;
	};
	this.exportToXLSX = function() {
		var uid=dev.report.model.report.id;
		var frameId='iframe-'+uid;
		var printViewIframe=Ext.get(frameId);
		window.open(printViewIframe.dom.src+"&type=xls","_blank","height=768, width=1024, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=no, status=yes");
	};
	this.insDelRowCol = function(action, type) {
		var activeSheet = dev.report.base.app.activeSheet, activePane = dev.report.base.app.activePane, env = dev.report.base.app.environment, selStartCoord = env.lastRangeStartCoord, selEndCoord = env.lastRangeEndCoord, handler;
		if (action == "ins") {
			handler = (type == "col")
					? activeSheet.insertCol
					: activeSheet.insertRow
		} else {
			handler = (type == "col")
					? activeSheet.deleteCol
					: activeSheet.deleteRow
		}
		if (selStartCoord[0] == selEndCoord[0]
				&& selStartCoord[0] == selEndCoord[0]) {
			var mrgInfo = activePane.getMergeInfo(selStartCoord[0],
					selStartCoord[1]);
			if (mrgInfo && mrgInfo[0]) {
				selEndCoord = [selStartCoord[0] + mrgInfo[1] - 1,
						selStartCoord[1] + mrgInfo[2] - 1]
			}
		}
		var pos = (type == "col") ? selStartCoord[0] : selStartCoord[1], cnt = (type == "col")
				? selEndCoord[0] - selStartCoord[0] + 1
				: selEndCoord[1] - selStartCoord[1] + 1;
		handler.call(activeSheet, pos, cnt);
		env.copySelection.removeAll();
		dev.report.base.app.clipboard = null;
		this.togglePaste(false)
	};
	this.resizeRowCol = function(type, size) {
		var env = dev.report.base.app.environment, selStartCoord = env.lastRangeStartCoord, selEndCoord = env.lastRangeEndCoord;
		if (typeof size == "number" && size >= 0) {
			dev.report.base.app.activeSheet.resizeColRow(type, [[selStartCoord[type],
							selEndCoord[type]]], size)
		} else {
			dev.report.base.app.activeSheet.autofitColRow(type, [[selStartCoord[type],
							selEndCoord[type]]])
		}
	};
	this.switchTheme = function(btn, state) {
		if (!state) {
			return
		}
		Ext.util.CSS.swapStyleSheet("theme", "../lib/ext/resources/css/x".concat(
						btn.id, ".css"));
		function uncheck(item, index, length) {
			if (item.id != btn.id) {
				item.setChecked(false)
			}
		}
		dev.report.base.app[dev.report.base.app.menubar ? "menubar" : "toolbar"].themeMenu.items
				.each(uncheck)
	};
	this.mergeCells = function(unmerge) {
		var defSelActRng = dev.report.base.app.environment.defaultSelection
				.getActiveRange(), defSelCoords = defSelActRng.getCorners();
		dev.report.base.app.activePane.merge([defSelCoords[0].getX(),
						defSelCoords[0].getY(), defSelCoords[1].getX(),
						defSelCoords[1].getY()], unmerge)
	};
	this.clear = function(type) {
		var defSelActRng = dev.report.base.app.environment.defaultSelection
				.getActiveRange(), defSelCoords = defSelActRng.getCorners();
		dev.report.base.app.activePane.clrRange([defSelCoords[0].getX(),
						defSelCoords[0].getY(), defSelCoords[1].getX(),
						defSelCoords[1].getY()], type)
	};
	this.newWorkbook = function() {
		
		function cbCreate() {
			try {
				for (var triggers = dev.report.base.events.triggers.newWorkbook_after, i = triggers.length
						- 1, name = dev.report.base.app.activeBook._name; i >= 0; i--) {
					triggers[i][0]["newWorkbook_after"].call(parent,
							triggers[i][1], name)
				}
			} catch (e) {
				dev.report.base.general.showMsg("Application Error".localize(), e.message
								.localize(), Ext.MessageBox.ERROR)
			}
		}
		try {
			for (var triggers = dev.report.base.events.triggers.newWorkbook_before, i = triggers.length
					- 1; i >= 0; i--) {
				triggers[i][0]["newWorkbook_before"].call(parent, triggers[i][1])
			}
			dev.report.base.book.create([this, cbCreate]);
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	};
	this.adjustToACL = function() {
		if (dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		var perms = dev.report.base.grid.permission, perm = perms.PERM_NONE, menubar = dev.report.base.app.menubar, toolbar = dev.report.base.app.toolbar, tbarLayouts = dev.report.base.app.toolbarLayouts, wndActive = dev.report.base.wnd.active, framesetActive = false;
		if (wndActive) {
			perm = dev.report.base.node.getPerm(wndActive.node);
			framesetActive = wndActive.node instanceof dev.report.base.wnd.Frameset
		}
		var act = perm >= perms.PERM_WRITE ? "enable" : "disable";
		switch (dev.report.base.app.toolbarLayout) {
			case tbarLayouts.TOOLBAR :
				if (menubar.saveItem) {
					menubar.saveItem[act]()
				}
				menubar.saveAsItem[framesetActive ? "disable" : act]();
				break;
			case tbarLayouts.RIBBON :
				toolbar.saveAsItem[framesetActive ? "disable" : act]();
				break
		}
		toolbar.saveItem[act]()
	};
	this.followHL = function(rngStr) {
		//dev.report.base.hl.exec(rngStr)
	};
	this.sendGridInput = function(event, keyCode) {
		var env = dev.report.base.app.environment, gridMode = dev.report.base.grid.GridMode, result = true;
		if (!env) {
			return
		}
		if (event == undefined) {
			event = {
				ctrlKey : false,
				shiftKey : false
			}
		}
		if (keyCode == undefined) {
			keyCode = 13
		}
		if (env.inputMode == gridMode.EDIT || env.inputMode == gridMode.INPUT) {
			result = dev.report.base.keyboard.sendInput(env.inputField, keyCode == 13
							&& event.ctrlKey && event.shiftKey)
		}
		if (env.inputMode != gridMode.CNTRL && env.inputMode != gridMode.DIALOG) {
			if (result) {
				dev.report.base.keyboard.cancelInput(keyCode == 9 ? false : true);
				try {
					dev.report.base.app.currFormula.getEl().blur()
				} catch (e) {
				}
			} else {
				alert("Invalid input!".localize());
				dev.report.base.general.focusInputField()
			}
		}
		return result
	};
	this.cancelGridInput = function() {
		var env = dev.report.base.app.environment;
		if (env) {
			if (env.viewMode == dev.report.base.grid.viewMode.DESIGNER
					&& env.inputMode == dev.report.base.grid.GridMode.EDIT) {
				dev.report.base.app.currFormula.getEl().blur()
			}
			dev.report.base.keyboard.skipInpFldBlur = true;
			dev.report.base.keyboard.cancelInput();
			env.editingDirectly = false
		}
		dev.report.base.app.gridBlurObserver
				.unsubscribe(this.cancelGridInput)
	};
/*
	this.batchPrint = function(params) {
		window
				.open(
						"/be/studio/print.php/Report.pdf?t=report&format=pdf&sess="
								.concat(dev.report.base.app.sess, "&params=", params),
						"batch_print",
						"directories=no,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no")
	};
*/
}