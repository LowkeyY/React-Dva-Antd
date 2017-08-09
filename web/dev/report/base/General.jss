
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.format");
dev.report.base.General =function() {
	var that = this, _l10nSeps = undefined, _l10nBool = undefined, _reNumeric = undefined, _reThouSep = undefined;
	this.startUp = function() {
		if(!dev.report.base.app.loaded){
			_l10nSeps = dev.report.base.i18n.separators;
			_l10nBool = dev.report.base.i18n.bool;
			_reNumeric = new RegExp("^ *((?:-|\\+)?[0-9]{1,3}(?:\\".concat(
					_l10nSeps[1], "?[0-9]{3})*(?:\\", _l10nSeps[0],
					"[0-9]+)?) *(%?) *$"));
			_reThouSep = new RegExp("\\".concat(_l10nSeps[1]), "g");
			if (Ext.isGecko) {
				dev.report.base.app.browser = "ff"
			} else {
				if (Ext.isSafari) {
					dev.report.base.app.browser = "sf"
				} else {
					if (Ext.isIE) {
						dev.report.base.app.browser = "ie"
					} else {
						if (Ext.isChrome) {
							dev.report.base.app.browser = "ch"
						}
					}
				}
			}
			dev.report.base.app.UPRestrictMode = dev.report.base.app.UPRestrictModeEnabled
					&& dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER
					&& dev.report.base.app.standalone;
		/*	Ext.applyIf(dev.report.base.i18n.strings, dev.report.base.tmp.i18n_strings);
			delete dev.report.base.tmp.i18n_strings;
			if (dev.report.util.doExtI18n) {
				dev.report.util.doExtI18n();
				delete dev.report.util.doExtI18n
			}
		*/


			window.onbeforeunload = function() {
				if (dev.report.base.app.environment
						&& dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
					var activeBook = dev.report.base.app.activeBook, nodeMeta = activeBook.holder instanceof dev.report.base.wnd.Window
							? activeBook._meta
							: activeBook.holder._frameset._meta;
					/*if (nodeMeta == null) {
						dev.report.backend.wss.removeCloneWorksheet(false)
					} else {
						dev.report.backend.wss.removeCloneWorksheet(false, nodeMeta.g,
								nodeMeta.h, nodeMeta.n)
					}*/
				}
			};
			Ext.QuickTips.init();  

			using("dev.report.util.Misc");
			using("dev.report.Err");
			dev.report.err=new dev.report.Err();
			dev.report.util=new dev.report.util.Misc();

			using("dev.report.base.ENV");
			dev.report.base.env=new dev.report.base.ENV();

			using("dev.report.base.Node");
			dev.report.base.node=new dev.report.base.Node();

			using("dev.report.base.WND");
			dev.report.base.wnd=new dev.report.base.WND();

			using("dev.report.kbd.Base");

			using("dev.report.kbd.General");
			dev.report.kbd=new dev.report.kbd.General();

		//	using('dev.report.kbd.ctxRegistry');

			using("dev.report.base.app.Handlers");
			dev.report.base.app.handlers=new dev.report.base.app.Handlers();

			using("dev.report.base.Sheet");
			dev.report.base.sheet=new dev.report.base.Sheet();
		
			using("dev.report.base.Hb");
			dev.report.base.hb=new dev.report.base.Hb();

			using("dev.report.base.Style");
			dev.report.base.style=new dev.report.base.Style();
			
			using("dev.report.base.Range");
			dev.report.base.range=new dev.report.base.Range();
			
			//using("dev.report.base.Hyperlink");
			//dev.report.base.hl=new dev.report.base.Hyperlink();

			using("dev.report.base.CCMD");
			dev.report.base.ccmd=new dev.report.base.CCMD();


			//using("dev.report.base.CMNT");
			//dev.report.base.cmnt=new dev.report.base.CMNT();

			using("dev.report.base.FMT");
			dev.report.base.fmt=new dev.report.base.FMT();

			using("dev.report.base.CNDFMT");
			dev.report.base.cndfmt=new dev.report.base.CNDFMT();
			
			using("dev.report.base.Events");
			dev.report.base.events=new dev.report.base.Events();


			using("dev.report.base.Formula");
			dev.report.base.formula=new dev.report.base.Formula();

			using("dev.report.base.Action");
			dev.report.base.action=new dev.report.base.Action();
			
			using("dev.report.base.MACRO");
			dev.report.base.macro=new dev.report.base.MACRO();
			
			using("dev.report.base.app.MenuBar");
			var menuBar =new dev.report.base.app.MenuBar();
			dev.report.base.app.menubar= menuBar.menu;
			menuBar.enderTO("MenuPlaceholder");

			using("dev.report.base.app.Toolbars");
			var toolbars =new dev.report.base.app.Toolbars();
			dev.report.base.app.toolbar=toolbars.tbar;
			toolbars.init();
		
			var isUserMode = dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER;
			if (!isUserMode) {
				using("dev.report.base.app.FormulaBar");
				var formulaBar =new dev.report.base.app.FormulaBar();
				formulaBar.init();
			}

			using("dev.report.base.WSEL");
			dev.report.base.wsel=new dev.report.base.WSEL();

			using("dev.report.base.wsel.WSELRegistry");
			dev.report.base.wsel.wselRegistry=new dev.report.base.wsel.WSELRegistry();

		//	using("dev.report.base.wsel.chart");

			using("dev.report.base.wsel.IMG");
			dev.report.base.wsel.img=new dev.report.base.wsel.IMG();

			if (!dev.report.base.app.serverAvailable) {
				alert("srvNotRespond".localize());
				return
			}

			using("dev.report.base.Keyboard");
			dev.report.base.keyboard=new dev.report.base.Keyboard();

			document.onkeydown = dev.report.base.keyboard.checkGlobalInput;
			document.onkeyup = dev.report.base.keyboard.fetchGlobalKeyUp;

			using("dev.report.base.Mouse");
			dev.report.base.mouse=new dev.report.base.Mouse();

			document.onmouseup = dev.report.base.mouse.fetchGlobalMouseUp;
			document.onmousedown = dev.report.base.mouse.fetchGlobalMouseDown;
			document.onmousemove = dev.report.base.mouse.fetchGlobalMouseMove;


			using("dev.report.gen.Observer");

			dev.report.base.app.mouseMovementObserver = new dev.report.gen.Observer();
			dev.report.base.app.mouseUpObserver = new dev.report.gen.Observer();
			dev.report.base.app.mouseDownObserver = new dev.report.gen.Observer();
			dev.report.base.app.switchContextObserver = new dev.report.gen.Observer();
			dev.report.base.app.gridBlurObserver = new dev.report.gen.Observer();
			
			dev.report.base.hb.regECHandlers();
			dev.report.base.mouse.regHyperlinkHandlers();
			dev.report.base.app.screenPosition = [0, 0];


			using("dev.report.base.WSPC");
			dev.report.base.wspc=new dev.report.base.WSPC();
			window.onresize = dev.report.base.wspc.resize;	

			dev.report.base.app.Report.MainTabPanel.on('resize',function(){
				dev.report.base.wspc.resize();
			});	

			dev.report.base.app.Report.reportMain.on('resize',function(){
				dev.report.base.wspc.resize();
			});	
			var wbList={};
			wbList.type='template';
			wbList.meta={};
			wbList.ext={};
			wbList.ext.name=dev.report.model.report.name;
			wbList.ext.uid=dev.report.model.report.id;   
			dev.report.base.node.spawn([this, null], wbList.type, wbList.meta,wbList.ext);
			dev.report.base.app.loaded=true;
		}else{
			var wbList={};
			wbList.type='template';
			wbList.meta={};
			wbList.ext={};
			wbList.ext.name=dev.report.model.report.name;
			wbList.ext.uid=dev.report.model.report.id;   
			dev.report.base.node.spawn([this, null], wbList.type, wbList.meta,wbList.ext);
		}
	};
	this.startReportView = function(params) {
		using("dev.report.base.app.view.Toolbars");
		var toolbars =new dev.report.base.app.view.Toolbars();
		toolbars.init('xvStandardToolbar');
		var wbList={};
		wbList.type='rframeset';
		wbList.meta={};
		wbList.ext={};
		wbList.ext.name=dev.report.model.report.name;
		wbList.ext.frames=[];
		var frame={};
		frame.name='sheet1';
		frame.params=params;
		frame.params.forExport='yes';
		wbList.ext.frames.push(frame);

		using("dev.report.base.WSPC");
		dev.report.base.vwspc=new dev.report.base.WSPC();

		dev.report.base.app.Report.ViewWindow.on('resize',function(){
			dev.report.base.vwspc.resize();
		});	

		dev.report.base.app.Report.ViewWindow.on('resize',function(){
			dev.report.base.vwspc.resize();
		});	

		dev.report.base.node.spawn([this, null], wbList.type, wbList.meta,wbList.ext);
	};

	this.startUp_post = function(currWbId) {
		var wbList = dev.report.base.app.workbookList, wbListLen = wbList.length, hasVisNode = false;
		if (currWbId != null && currWbId.length) {
			dev.report.base.book.select(currWbId)
		}
		dev.report.base.action.adjustToACL();
		if (wbListLen) {
			for (var i = 0; i < wbListLen; i++) {
				if (wbList[i].meta && !wbList[i].meta.v) {
					hasVisNode = true;
					break
				}
			}
		}
		if (!wbList.length || !hasVisNode) {
			var preload = dev.report.backend.wss.getPreload();
			if (preload) {
				if (preload[1][1].frames) {
					dev.report.base.frameset.load_post(preload[1], null, {
								g : preload[0][1],
								h : preload[0][2],
								n : preload[0][0],
								v : false
							}, null, [null].concat(preload[0]))
				} else {
					if (!preload[1][0]) {
						if (!preload[1][1].search(/^recovery*/i)) {
							dev.report.gen.load(dev.report.base.app.dynJSRegistry.recover,
									[preload[1][2], [null].concat(preload[0])])
						} else {
							dev.report.base.general.showMsg("Application Error"
											.localize(), "errLoadWB_intro"
											.localize().concat(" ",
													preload[1][1].localize()),
									Ext.MessageBox.ERROR, [this,
											dev.report.base.wnd.triggerCloseEvt,
											null, {
												g : preload[0][1],
												h : preload[0][2],
												n : preload[0][0]
											}])
						}
					}
				}
			}
		}
		dev.report.base.app.loaded = true
	};
	this.setCurrentCoord = function(book) {
		var activeBook = book ? book : dev.report.base.app.activeBook, env = activeBook._aPane._env.shared, selCellCoords = env.selectedCellCoords, value = env.defaultSelection
				.getValue();
		env.inputField.value = value[0];
		dev.report.base.app.currCoord.setValue(env.selectedRowName
				+ env.selectedAbsColumnName);
		dev.report.base.app.currFormula.setValue(value[1] != "" ? value[1] : that
				.filterHLTags(selCellCoords[0], selCellCoords[1], value[0],
						false))
	};
	this.setCoords = function() {
		dev.report.base.app.currCoord
				.setValue(dev.report.base.app.numberToLetter[dev.report.base.app.environment.selectedCellCoords[0]]
						+ dev.report.base.app.environment.selectedCellCoords[1])
	};
	this.setInputMode = function(inputMode) {
		var env = dev.report.base.app.environment, activeBook = dev.report.base.app.activeBook, sheetSel = activeBook
				? activeBook.getSheetSelector()
				: undefined, modeDesc = "";
		function removeMarkRng() {
			if (env.copySelection != null) {
				env.copySelection.removeAll();
				dev.report.base.app.clipboard = null;
				dev.report.base.action.togglePaste(false)
			}
		}
		function saveInitVal() {
			dev.report.base.app.handlers.updateUndoState([0, 0]);
			env.undoValue = env.inputField.value
		}
		if (dev.report.base.app.formulaTlb
				&& inputMode != dev.report.base.grid.GridMode.EDIT
				&& inputMode != dev.report.base.grid.GridMode.INPUT) {
			dev.report.base.app.formulaTlb.setMode(false)
		}
		switch (inputMode) {
			case dev.report.base.grid.GridMode.EDIT :
				if (sheetSel) {
					sheetSel.enable(false)
				}
				removeMarkRng();
				saveInitVal();
				modeDesc = "Edit";
				if (dev.report.base.app.formulaTlb) {
					dev.report.base.app.formulaTlb.setMode(true)
				}
				break;
			case dev.report.base.grid.GridMode.INPUT :
				if (sheetSel) {
					sheetSel.enable(false)
				}
				removeMarkRng();
				saveInitVal();
				modeDesc = "Enter";
				if (dev.report.base.app.formulaTlb) {
					dev.report.base.app.formulaTlb.setMode(true)
				}
				break;
			case dev.report.base.grid.GridMode.POINT :
				modeDesc = "Point";
				break;
			default :
				if (sheetSel) {
					sheetSel.enable(true)
				}
				dev.report.base.app.handlers.updateUndoState();
				modeDesc = "Ready"
		}
		if (env != null) {
			env.inputMode = inputMode
		}
	//	dev.report.base.app.statusBar.setInputMode(modeDesc)
	};
	this.mouseDownOnFormFld = function(event) {
		var env = dev.report.base.app.environment;
		var range = env.defaultSelection;
		var gridMode = dev.report.base.grid.GridMode;
		function cbMain() {
			dev.report.base.app.fromFormulaField = true;
			dev.report.base.app.lastInputField = dev.report.base.app.currFormula;
			env.formulaSelection.activeToken = null;
			dev.report.base.app.currFormula.focus()
		}
		function cbInputEdit() {
			dev.report.base.keyboard.setFieldSize();
			cbMain()
		}
		if (env.inputMode == gridMode.INPUT) {
			that.setInputMode(gridMode.EDIT)
		} else {
			if (env.inputMode != gridMode.EDIT) {
				var value = range.getValue();
				env.inputField.value = value[1];
				that.setInputMode(gridMode.EDIT);
				dev.report.base.keyboard.setFieldContent();
				that.showInputField([this, cbInputEdit], false, true);
				return
			}
		}
		cbMain()
	};
	this.focusOnFormFld = function(event) {
		dev.report.base.keyboard.setFieldSize()
	};
	this.focusInputField = function() {
		if (dev.report.base.app.fromFormulaField) {
			dev.report.base.app.currFormula.focus()
		} else {
			var inputField = dev.report.base.app.environment.inputField, fieldLen = inputField.value.length;
			inputField[Ext.isSafari && dev.report.env.isDesktop ? "select" : "focus"]();
			if (document.all) {
				var selRng = document.selection.createRange();
				selRng.move("character", fieldLen);
				selRng.select()
			} else {
				inputField.setSelectionRange(fieldLen, fieldLen)
			}
		}
	};
	this.isRngSingleCell = function() {
		var env = dev.report.base.app.environment;
		var rngStartCoords = env.lastRangeStartCoord;
		var rngEndCoords = env.lastRangeEndCoord;
		return (rngStartCoords[0] == rngEndCoords[0] && rngStartCoords[1] == rngEndCoords[1])
	};
	this.updateInputFieldPosition = function() {
		var activeSheet = dev.report.base.app.activeSheet, inputField = dev.report.base.app.environment.inputField, cursorField = activeSheet._defaultSelection
				? activeSheet._defaultSelection.getCursorField()
				: activeSheet._cursorField, cfPos = cursorField.getPosition();
		if (this.isRngSingleCell()) {
			inputField.style.left = cfPos.l + (document.all ? 0 : 1) + "px";
			inputField.style.top = cfPos.t + (document.all ? 0 : 0) + "px"
		} else {
			inputField.style.left = cfPos.l + (document.all ? 3 : 1) + "px";
			inputField.style.top = cfPos.t + (document.all ? 3 : 0) + "px"
		}
		inputField.style.height = cursorField.getSize().h + "px"
	};
	this.showInputField = function(cb, moveToFirstChar, directly, fetchFormula,
			skipFetchValue) {
		var env = dev.report.base.app.environment, activeBook = dev.report.base.app.activeBook, activePane = dev.report.base.app.activePane, vMode = dev.report.base.grid.viewMode, inputField = env.inputField, selectedCell = env.selectedCell, selectedCellCoords = env.selectedCellCoords, extraXOffset = (dev.report.base.app.isIE)
				? 1
				: 0, extraYOffset = (dev.report.base.app.isIE) ? 1 : 0, myPosition, oldValue = null, calculatedCellContent = false, hasSpacePrepended = false, selectedCellValue = env.selectedCellValue, selCellValue = activePane
				.getCellUVal(selectedCellCoords[0], selectedCellCoords[1]), selCellFormula = activePane
				.getCellFormula(selectedCellCoords[0], selectedCellCoords[1]);
		if (!skipFetchValue) {
			selectedCellValue = env.selectedCellValue = (selCellValue == undefined)
					? ""
					: selCellValue;
			env.selectedCellFormula = (selCellFormula == undefined)
					? ""
					: selCellFormula
		}
		fetchFormula = (fetchFormula == undefined) ? true : fetchFormula;
		inputField.style.visibility = "hidden";
		function delArrForm(formVal) {
			if (formVal.charAt(0) == "{"
					&& formVal.charAt(formVal.length - 1) == "}") {
				oldValue = formVal;
				formVal = formVal.substring(1, formVal.length - 1)
			}
			return formVal
		}
		var cbScrollTo = function() {
			env.editingDirectly = directly;
			if (env.viewMode == vMode.USER) {
				inputField.style.top = selectedCell.parentNode.offsetTop - 1
						+ "px";
				inputField.style.left = selectedCell.offsetLeft - 1 + "px";
				inputField.style.width = selectedCell.offsetWidth - 3 + "px";
				inputField.style.height = selectedCell.offsetHeight - 4 + "px"
			} else {
				that.updateInputFieldPosition();
				inputField.style.height = selectedCell.offsetHeight
						- (that.isRngSingleCell() ? 4 : 5) + "px";
				inputField.style.borderStyle = "none"
			}
			var selFormulaSet = (env.selectedCellFormula != "null" && env.selectedCellFormula.length > 0);
			if (fetchFormula && env.viewMode == vMode.DESIGNER
					&& !selFormulaSet) {
				var rngFormulaVal = env.defaultSelection.getValue()[1];
				if (rngFormulaVal != env.selectedCellFormula) {
					env.selectedCellFormula = rngFormulaVal;
					selFormulaSet = true
				}
			}
			if (env.viewMode == vMode.DESIGNER && selFormulaSet) {
				inputField.value = delArrForm(env.selectedCellFormula)
			} else {
				if (selectedCellValue.length) {
					inputField.value = that.filterHLTags(selectedCellCoords[0],
							selectedCellCoords[1], selectedCellValue, false)
				} else {
					inputField.value = " ";
					hasSpacePrepended = true
				}
			}
			dev.report.base.style.cellTransfer(inputField);
			var c = selectedCellCoords[0], r = selectedCellCoords[1], t = activePane
					.getCellType(c, r);
			if (inputField.style.textAlign == ""
					&& (t == undefined || t == "e" || activePane
							.getCellFormula(c, r) != undefined)) {
				inputField.style.textAlign = "left"
			}
			inputField.style.zIndex = "40";
			inputField.style.display = "block";
			inputField.style.visibility = "visible";
			inputField._paneId = activePane._id;
			inputField.prepare(activePane);
			if (moveToFirstChar) {
				if (document.all) {
					var selRng = document.selection.createRange();
					selRng.move("character", 0);
					selRng.select()
				} else {
					inputField.setSelectionRange(0, 0)
				}
			}
			if (env.viewMode != vMode.USER) {
				dev.report.base.keyboard.setFieldContent()
			} else {
				dev.report.base.keyboard.setFieldSize()
			}
			env.oldValue = oldValue == null
					? (hasSpacePrepended && inputField.value == " "
							? ""
							: inputField.value)
					: oldValue;
			env.lastInputValue = inputField.value;
			if (selectedCellValue.length == 0 && !selFormulaSet) {
				inputField.value = "";
				if (env.viewMode == vMode.DESIGNER) {
					dev.report.base.app.currFormula.setValue("")
				}
			}
			if (dev.report.env.isDesktop) {
				that.focusInputField()
			}
			if (cb instanceof Array && cb.length > 1) {
				cb[1].call(cb[0])
			}
			if (dev.report.env.isMobile) {
				setTimeout(function() {
					try {
						for (var triggers = dev.report.base.events.triggers.refreshLayout, i = triggers.length
								- 1; i >= 0; i--) {
							triggers[i][0]["refreshLayout"].call(parent,
									triggers[i][1])
						}
					} catch (e) {
						dev.report.base.general.showMsg("Application Error"
										.localize(), e.message.localize(),
								Ext.MessageBox.ERROR)
					}
				}, 0)
			}
		};
		if (env.viewMode == vMode.DESIGNER) {
			if (activeBook._scrollPending) {
				return
			}
			activeBook._aSheet._defaultSelection.getCursorField().hide();
			activePane.scrollTo([this, cbScrollTo], selectedCellCoords[0],
					selectedCellCoords[1], false, false)
		} else {
			cbScrollTo()
		}
	};
	this.addFileMenuEntry = function(entryText) {
		var fixedItemsCount = (dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER)
				? 8
				: 13;
		var itemName = (entryText.length > 30)
				? (entryText.substring(0, 14) + "..." + entryText
						.substring(entryText.length - 9))
				: entryText;
		var menuPosition = dev.report.base.app.menubar.fileMenu.items.length
				- fixedItemsCount + 1;
		dev.report.base.app.menubar.fileMenu.add({
					text : menuPosition + ". " + itemName + ".wss",
					href : "javascript: dev.report.base.book.load(null,'" + entryText
							+ "');"
				})
	};
	this.createWorksheetElements = function(sheet) {
		function _load(res) {
			if (!(res instanceof Array) || res[0] !== true) {
				return
			}
			res = res[1];
			sheet.setInitReg("chart", res.length);
			for (var chartData, i = res.length - 1, createChart = dev.report.base.wsel.chart.createChart; i >= 0; --i) {
				createChart([sheet, sheet.updInitReg, "chart"],
						(chartData = res[i]).e_id, chartData.n_location,
						chartData.pos_offsets, chartData.size,
						chartData.subtype, chartData.zindex, chartData.locked,
						chartData.chart_name)
			}
		}
	/*	dev.report.backend
				.ccmd([this, _load],
						[
								"wget",
								"",
								[],
								["e_id", "size", "subtype", "n_location",
										"pos_offsets", "zindex", "locked",
										"chart_name"], {
									e_type : "chart"
								}])*/
	};
	this.getSysClipboard = function() {
		var pasteFld = document.getElementById("_paste_field_");
		return (pasteFld == null) ? null : document
				.getElementById("_paste_field_").value
	};
	this.setSysClipboard = function(value) {
		dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
		that.setInputMode(dev.report.base.grid.GridMode.DIALOG);
		if (!document.getElementById("_copy_field_")) {
			_cinput = document.createElement("textarea");
			_cinput.setAttribute("id", "_copy_field_");
			_cinput.setAttribute("name", "_copy_field_");
			_cinput
					.setAttribute(
							"style",
							"position: float; width: 1px; height: 1px; user-select: text; -moz-user-select: text; -webkit-user-select: text; z-index: 999;");
			_cinput.setAttribute("value", "1");
			document.getElementById("mainBody").appendChild(_cinput)
		}
		if (dev.report.base.app.browser == "ie") {
			var copyfld = document.getElementById("_copy_field_");
			copyfld.value = value;
			copyfld.select();
			document.selection.createRange()
		} else {
			var copyfld = document.getElementById("_copy_field_");
			copyfld.value = value;
			copyfld.select();
			copyfld.selectionStart = 0;
			copyfld.selectionEnd = 65535
		}
	};
	this.parseSysClipboard = function(flat) {
		var clpVal = this.getSysClipboard();
		if (clpVal == null) {
			return clpVal
		}
		var rows = clpVal.split("\n"), maxRowLen = 0;
		for (var i = rows.length - 1, rowLen, subLen; i >= 0; i--) {
			rowLen = rows[i].length;
			if (rows[i].lastIndexOf("\r") == rowLen - 1) {
				rows[i] = rows[i].substr(0, rowLen - 1)
			}
			rows[i] = rows[i].split("\t");
			subLen = rows[i].length;
			if (subLen > maxRowLen) {
				maxRowLen = subLen
			}
		}
		if (rows[rows.length - 1] == "") {
			rows.splice(rows.length - 1, 1)
		}
		for (var i = rows.length - 1; i >= 0; i--) {
			for (var j = 0, cnt = maxRowLen - rows[i].length; j < cnt; j++) {
				rows[i].push("")
			}
		}
		if (flat) {
			var flatRows = [];
			for (var i = 0, rowsLen = rows.length; i < rowsLen; i++) {
				if (rows[i] instanceof Array) {
					for (var j = 0, subLen = rows[i].length; j < subLen; j++) {
						flatRows.push(rows[i][j])
					}
				} else {
					flatRows.push(rows[i])
				}
			}
		}
		return {
			id : null,
			op : null,
			value : flat ? flatRows : rows,
			markRngDim : {
				width : maxRowLen,
				height : rows.length
			}
		}
	};
	this.filterHLTags = function(x, y, val, addTags) {
		if (dev.report.base.app.activeBook == undefined) {
			return val
		}
	/*	var valType = dev.report.base.app.activePane.getCellType(x, y), hlTag = dev.report.base.hl.hlTag;
		if (addTags) {
			if (valType == "h" && val.search(/^=HYPERLINK\(/)) {
				return hlTag.begin.concat(val, hlTag.end)
			}
		} else {
			if (valType == undefined || valType == "h") {
				var bStrs = [hlTag.oldBegin, hlTag.begin];
				for (var bStr in bStrs) {
					if (val.indexOf(bStrs[bStr]) == 0) {
						return val.replace(bStrs[bStr], "").replace(hlTag.end,
								"")
					}
				}
			}
		}*/
		return val
	};
	this.switchSuspendMode = function(status) {
		if (status) {
			if (!that.switchSuspendModeAlert) {
				that.switchSuspendModeAlert = new Ext.Window({
					title : "Suspend Mode".localize(),
					id : "ext-el-mask-suspend-win",
					cls : "default-format-window",
					closable : false,
					autoDestroy : true,
					plain : true,
					draggable : false,
					constrain : true,
					modal : true,
					resizable : false,
					animCollapse : false,
					width : 400,
					autoHeight : true,
					layout : "fit",
					items : [new Ext.Panel({
						bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
						border : false,
						frame : false,
						autoHeight : true,
						layout : "fit",
						items : [{
									html : "suspModeMsg".localize(),
									baseCls : "x-plain"
								}]
					})]
				});
				dev.report.base.app.lastInputModeDlg = dev.report.base.app.environment.inputMode;
				that.setInputMode(dev.report.base.grid.GridMode.DIALOG);
				that.switchSuspendModeAlert.show(this)
			}
		} else {
			if (that.switchSuspendModeAlert) {
				var ha = dev.report.backend.wss, activeBook = dev.report.base.app.activeBook, activeSheet = dev.report.base.app.activeSheet;
				ha.selectBook(activeBook.getUid());
				ha.selectSheet(activeBook.getWsId(), activeSheet.isClone());
				that.setInputMode(dev.report.base.app.lastInputModeDlg);
				dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				dev.report.base.sheet.refresh();
				that.switchSuspendModeAlert.destroy();
				that.switchSuspendModeAlert = null
			}
		}
	};
	this.appUnload = function() {
		var env = dev.report.base.app.environment;
		if (env && env.viewMode == dev.report.base.grid.viewMode.USER
				&& dev.report.base.app.sess == "dznr") {
			try {
				opener.dev.report.base.general.switchSuspendMode(false)
			} catch (e) {
			}
		}
		document.getElementById("mainBody").style.display = "none"
	};
	this.showMsg = function(title, msg, dlgIcon, cb) {
		var env = dev.report.base.app.environment;
		function resetInput() {
			if (env && env.inputMode == dev.report.base.grid.GridMode.DIALOG) {
				that.setInputMode(dev.report.base.app.lastInputModeDlg);
				dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
			}
			if (cb instanceof Array && cb.length > 1) {
				cb[1].apply(cb[0], cb.slice(2))
			}
		}
		if (env && env.inputMode != dev.report.base.grid.GridMode.DIALOG) {
			dev.report.base.app.lastInputModeDlg = env.inputMode;
			that.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		Ext.MessageBox.show({
					title : title,
					msg : msg,
					icon : dlgIcon,
					modal : true,
					buttons : Ext.MessageBox.OK,
					fn : resetInput
				})
	};
	this.showLogMsg = function(title, msg, dlgIcon, value, cb) {
		var env = dev.report.base.app.environment;
		function resetInput() {
			if (env && env.inputMode == dev.report.base.grid.GridMode.DIALOG) {
				that.setInputMode(dev.report.base.app.lastInputModeDlg);
				dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY
			}
			if (cb instanceof Array && cb.length > 1) {
				cb[1].apply(cb[0], cb.slice(2))
			}
		}
		if (env && env.inputMode != dev.report.base.grid.GridMode.DIALOG) {
			dev.report.base.app.lastInputModeDlg = env.inputMode;
			that.setInputMode(dev.report.base.grid.GridMode.DIALOG)
		}
		Ext.MessageBox.show({
					title : title,
					msg : msg,
					icon : dlgIcon,
					modal : true,
					width : 400,
					buttons : Ext.MessageBox.OK,
					fn : resetInput,
					prompt : true,
					multiline : true,
					value : value
				})
	};
	this.chkState = function() {
		var env = dev.report.base.app.environment;
		if (env && env.inputMode.inputMode == dev.report.base.grid.GridMode.DIALOG) {
			throw {
				key : "wb_in_dlg_mode",
				params : {}
			}
		}
		if (that.switchSuspendModeAlert) {
			throw {
				key : "wb_in_suspend_mode",
				params : {}
			}
		}
	};
	this.chkHiddenColRow = function(isRow, pos, amount, isInc) {
		var dim = isRow
				? dev.report.base.app.activeSheet._rowHeights
				: dev.report.base.app.activeSheet._colWidths, maxCoords = dev.report.base.grid.defMaxCoords[isRow
				? 1
				: 0], dirIdx = isInc ? 1 : -1, foundUnhidden = false;
		for (var i = pos + amount * dirIdx; isInc ? i <= maxCoords : i >= 0; i += dirIdx) {
			if (dim.getElemAt(i) > 0) {
				foundUnhidden = true;
				break
			}
		}
		return foundUnhidden
				? (isInc ? pos + (i - pos) : pos - (pos - i))
				: pos
	};
	this.syncCtrls = function() {
		var activeSheet = dev.report.base.app.activeSheet;
		if (dev.report.base.app.appMode == dev.report.base.grid.viewMode.DESIGNER) {
			if (dev.report.base.app.environment) {
				if (activeSheet == undefined || !activeSheet.isClone()) {
					dev.report.base.hb.syncCntrl(false);
					dev.report.base.hb.enaDisHBAdd("enable")
				} else {
					dev.report.base.hb.syncCntrl(true);
					dev.report.base.hb.enaDisHBAdd("disable")
				}
			}
		}
	};
	this.loadRecent = function(item) {
		var conf = item.initialConfig;
		try {
			for (var triggers = dev.report.base.events.triggers.openWorkbook_before, i = triggers.length
					- 1; i >= 0; i--) {
				triggers[i][0]["openWorkbook_before"].call(parent,
						triggers[i][1], conf._ghn, conf.text, false)
			}
			dev.report.base.node.load(null, conf._type, conf._ghn.n, conf._ghn.g,
					conf._ghn.h);
			for (var triggers = dev.report.base.events.triggers.openWorkbook_after, i = triggers.length
					- 1; i >= 0; i--) {
				triggers[i][0]["openWorkbook_after"].call(parent,
						triggers[i][1], conf._ghn, conf.text)
			}
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	};
	this.showRecent = function(res, menu, alignEl, alignPos, parentMenu) {
		menu.removeAll();
		var icons = {
			spreadsheet : "w3s_workbook",
			frameset : "w3s_frameset"
		}, types = {
			spreadsheet : "workbook",
			frameset : "frameset"
		};
		for (var item, lctn, name, i = res.length - 1; i >= 0; --i) {
			item = res[i];
			lctn = item.location;
			name = lctn.path.substr(lctn.path.lastIndexOf("/") + 1);
			menu.addMenuItem({
						_type : types[item.type],
						_ghn : {
							g : lctn.group,
							h : lctn.hierarchy,
							n : lctn.node
						},
						text : name,
						iconCls : icons[item.type],
						qtip : lctn.path,
						listeners : {
							afterrender : function() {
								Ext.QuickTips.register({
											target : this.getEl(),
											text : this.initialConfig.qtip,
											showDelay : 500
										})
							}
						},
						handler : function(item) {
							dev.report.base.app.gridBlurObserver.notify(that);
							that.loadRecent(item)
						}
					})
		}
		menu.loaded = true;
		menu.show(alignEl, alignPos, parentMenu)
	};
	this.autoCalc = function(state) {
		var conn = dev.report.backend;
		conn.ccmd(true, ["sac", state ? 1 : 0]);
		dev.report.base.app.autoCalc = state
	};
	this.str2var = function(str, cast) {
		if (str === "" || str === null || str === undefined) {
			return {
				v : "",
				t : "e"
			}
		}
		if (typeof str != "string") {
			return {
				v : str
			}
		}
		var m, n, n_l10n;
		if ((m = str.match(_reNumeric)) !== null
				&& (n_l10n = m[1].replace(_reThouSep, ""))
				&& !isNaN(n = _l10nSeps[0] != "." ? n_l10n.replace(
						_l10nSeps[0], ".") : n_l10n)) {
			return {
				v : (cast ? n * (m[2] == "%" ? 0.01 : 1) : str),
				t : "n",
				l10n : n_l10n.concat(m[2])
			}
		}
		if (str.toUpperCase() == _l10nBool[true]) {
			return {
				v : (cast ? true : str),
				t : "b",
				str : _l10nBool[true]
			}
		}
		if (str.toUpperCase() == _l10nBool[false]) {
			return {
				v : (cast ? false : str),
				t : "b",
				str : _l10nBool[false]
			}
		}
		return {
			v : str,
			t : str[0] == "<" && /\w/.test(str[1]) ? "h" : "s"
		}
	}
};
dev.report.base.format.getSample = function(format, val) {
	var numericSeps = dev.report.base.i18n.separators, l10nBool = dev.report.base.i18n.bool, reThouSep = new RegExp(
			"\\".concat(numericSeps[1]), "g"), num = numericSeps[0] != "."
			? val.replace(reThouSep, "").replace(numericSeps[0], ".")
			: val.replace(reThouSep, ""), res;
	if (val === "" || val === null || val === undefined) {
		val = ""
	} else {
		if (!isNaN(num)) {
			val = num * 1
		} else {
			if (val.toUpperCase() == l10nBool[true]) {
				val = true
			} else {
				if (val.toUpperCase() == l10nBool[false]) {
					val = false
				}
			}
		}
	}
	res = dev.report.backend.ccmd(0, ["fval", format, val])[0];
	return typeof res == "object" && res[0] == true ? res[1] : ""
};