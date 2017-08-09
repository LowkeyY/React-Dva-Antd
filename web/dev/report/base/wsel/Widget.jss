dev.report.base.wsel.Widget = (function() {
	var type = "Widget", defSubtype = "custom", defLockedState = false;
	return function(conf, cb) {
		dev.report.base.wsel.Widget.parent.constructor.call(this, conf);
		var conn = dev.report.backend, env = this._env.shared, actCellCoords = env.selectedCellCoords, formulaParser = dev.report.base.formula, srcTypes = dev.report.base.wsel.Base.srcTypes, trgTypes = dev.report.base.wsel.Base.trgTypes, trgType = this
				.getTargetType(), that = this, cmds = [], hasCB = cb instanceof Array
				&& cb.length > 1;
		isNew = !this.conf.id, dims = dev.report.base.wsel.Widget.dims, registerCmp = function() {
			dev.report.base.wsel.wselRegistry.add(this);
			if (hasCB) {
				cb[1].call(cb[0], [true])
			}
		}, addCmp = function() {
			this.elem = [];
			this.frame = [];
			if (!this.isUserMode) {
				this.wrapper = []
			}
			var i = this._panes.length - 1, aPaneId = this._sheet._aPane._id, paneOffset = [], cbWrapperShow = function() {
				this.setTitle(i);
				if (this.conf.locked) {
					this.setLock(true, true, i)
				}
				this.wrapper[i].getEl().setStyle("visibility", "inherit");
				if (i == aPaneId) {
					for (var j = this._panes.length - 1, oc; j >= 0; j--) {
						oc = this._panes[j]._oc;
						oc.scrollTop = paneOffset[j].t;
						oc.scrollLeft = paneOffset[j].l
					}
					registerCmp.call(this)
				}
			};
			for (var gridDivId, frameId, pane, contId, ifpConf, allDone = false; !allDone
					&& i >= -1; i--) {
				if (i < 0) {
					if (allDone) {
						i = aPaneId;
						break
					} else {
						i = aPaneId;
						allDone = true
					}
				} else {
					if (i == aPaneId) {
						continue
					}
				}
				pane = this._panes[i];
				contId = pane._domId;
				gridDivId = contId.concat("_IC");
				frameId = contId.concat("_Widget_", this.conf.id);
				paneOffset[i] = {
					t : pane._oc.scrollTop,
					l : pane._oc.scrollLeft
				};
				ifpConf = {
					id : frameId,
					loadMask : false,
					fitToParent : true,
					useShim : true,
					border : false,
					frameConfig : {
						allowtransparency : true
					},
					listeners : {
						documentloaded : function() {
							var paneId = that.isUserMode
									&& !("_paneId" in this) ? i : this._paneId;
							if (that.isUserMode) {
								that.elem[paneId] = this
							}
							that.frame[paneId] = this.getFrame();
							that.frame[paneId]._paneId = paneId;
							that._addScripts.call(that, paneId);
							that.setSource.call(that, undefined, paneId)
						}
					}
				};
				ifpConf[this.conf.cnttype == "url" ? "defaultSrc" : "html"] = this.conf.cnt;
				if (this.isUserMode) {
					ifpConf.x = this.conf.left;
					ifpConf.y = this.conf.top
							+ dev.report.base.wsel.Widget.offsets[dev.report.base.app.browser].titleH;
					ifpConf.width = this.conf.width;
					ifpConf.height = this.conf.height
							- dev.report.base.wsel.Widget.offsets[dev.report.base.app.browser].titleH;
					ifpConf.cls = "x-widget-window".concat(
							this.conf.format.transparent
									? " x-widget-transp"
									: "", this.conf.format.view.border
									? ""
									: " x-widget-noborder");
					ifpConf.style = "z-index: ".concat(this.conf.zindex,
							"; position: absolute;",
							this.conf.format.transparent
									? " background-color: transparent;"
									: "");
					ifpConf.renderTo = gridDivId;
					ifpConf.bodyBorder = true;
					ifpConf.border = true
				}
				this.elem[i] = new Ext.ux.ManagedIFramePanel(ifpConf);
				this.elem[i]._paneId = i;
				if (!this.isUserMode) {
					this.wrapper[i] = new dev.report.base.wsel.WidgetWindow({
								width : this.conf.width,
								height : this.conf.height,
								x : this.conf.left,
								y : this.conf.top,
								minWidth : dims.minW,
								minHeight : dims.minH,
								maximizable : false,
								minimizable : false,
								bodyBorder : true,
								border : true,
								footer : false,
								plain : false,
								shadow : false,
								hideBorders : false,
								title : this.conf.name,
								header : true,
								closable : false,
								renderTo : gridDivId,
								constrain : true,
								constrainHeader : false,
								style : "overflow: hidden; z-index: ".concat(
										this.conf.zindex,
										"; position: absolute;"),
								layout : "fit",
								items : this.elem[i],
								_paneId : i,
								cls : "x-widget-window"
										.concat(this.conf.format.transparent
												? " x-widget-transp"
												: ""),
								tools : [{
											id : "gear",
											qtip : "Properties...",
											handler : function(e) {
												that.edit.call(that)
											}
										}, {
											id : "down",
											qtip : "Options",
											handler : function(e) {
												that.showContextMenu.call(that,
														e)
											}
										}],
								listeners : {
									activate : {
										fn : this.activate,
										scope : this
									},
									deactivate : {
										fn : this.deactivate,
										scope : this
									},
									move : {
										fn : this.move,
										scope : this
									},
									resize : {
										fn : this.resize,
										scope : this
									}
								}
							});
					this.snapToGrid = false;
					this.wrapper[i].resizer.onMouseUp = this.wrapper[i].resizer.onMouseUp
							.createInterceptor(function(e) {
										that.snapToGrid = e.browserEvent.altKey;
										return true
									});
					this.wrapper[i].dd.endDrag = this.wrapper[i].dd.endDrag
							.createInterceptor(function(e) {
										that.snapToGrid = e.browserEvent.altKey;
										return true
									});
					this.wrapper[i].toggleTitleVisibility(false);
					this.wrapper[i].show(null, cbWrapperShow, this)
				} else {
					this.elem[i].doLayout();
					if (i == 0) {
						registerCmp.call(this)
					}
				}
			}
		}, scrollToCmp = function() {
			var lrCell = this._sheet._aPane.getNeighByOffset(1, 1,
					this.conf.left + this.conf.width, this.conf.top
							+ this.conf.height);
			this._book._aPane.scrollTo([this, addCmp], lrCell[0], lrCell[1],
					true, false)
		};
		if (isNew) {
			var cbAdd = function(res) {
				if (res[0] && res[0][0] && res[0][1].length) {
					this.conf.id = res[0][1][0]
				} else {
					if (hasCB) {
						cb[1].call(cb[0], [false, "widget_add_wsel_err", {}])
					}
					return
				}
				this.interactive = true;
				scrollToCmp.call(this)
			}, cbChk = function(chkRes) {
				cmds = [];
				if (chkRes[0][1].length > 0) {
					if (hasCB) {
						cb[1].call(cb[0], [false, "widget_exists", {
											name : conf.name
										}])
					}
					return
				}
				if (this.conf.tnamedrange.length > 0 && chkRes[1][1][0]) {
					if (hasCB) {
						cb[1].call(cb[0], [false, "wsel_nrange_exists", {
											name : conf.tnamedrange
										}])
					}
					return
				}
				var posConf = dev.report.base.wsel.getNLoc(this.conf.left,
						this.conf.top, this.conf.width, this.conf.height,
						this.conf.singleCell);
				var addObj = {
					e_type : "widget",
					widget_name : this.conf.name,
					widget_type : this.conf.subtype,
					n_location : posConf.n_location,
					pos_offsets : posConf.pos_offsets,
					size : posConf.size,
					zindex : this.conf.zindex,
					locked : this.conf.locked,
					n_use_locale : this.conf.srcType == srcTypes.CUST,
					_gendata : this.conf._gendata,
					data : {
						trange : this.conf.trange,
						tnamedrange : this.conf.tnamedrange,
						tvar : this.conf.tvar,
						cnttype : this.conf.cnttype,
						cnt : this.conf.cnt
					},
					format : {
						view : {
							border : this.conf.format.view.border
						},
						transparent : this.conf.format.transparent
					}
				};
				if (this.conf.srctype != srcTypes.NONE) {
					addObj.data.srctype = this.conf.srctype;
					addObj.n_refers_to = this.conf.src
				}
				if (trgType != trgTypes.NONE) {
					addObj.n_target_ref = "=".concat(trgType == trgTypes.VAR
									? "@"
									: "", this.conf[trgType])
				}
				cmds.push(["wadd", "", addObj]);
				if (this.conf.tnamedrange.length > 0) {
					cmds.push(["nadd", [actCellCoords[0], actCellCoords[1], {
						name : this.conf.tnamedrange,
						refers_to : "=".concat(Ext.util.JSON
								.encode(this.conf.name)),
						scope : this._book._sheetSelector.getActiveSheetName(),
						comment : "Managed by widget ".concat(this.conf.name)
					}]])
				}
				(new dev.report.backend.CCmdAsyncRqst(cmds)).setOnSuccess([this,
						cbAdd]).send()
			};
			if (this.conf == undefined) {
				this.conf = {
					type : type,
					subtype : "custom",
					name : "WidgetN",
					cnttype : "url",
					cnt : "http://www.google.com",
					srctype : "subset",
					src : '=PALO.SUBSET("localhost/Demo","Years",1,,,,,,,PALO.SORT(0,0,,0,,0,1))',
					_gendata : [],
					trange : "",
					tnamedrange : "",
					tvar : "WidgetN",
					zindex : 50,
					locked : defLockedState,
					format : {
						view : {
							border : false
						},
						transparent : false
					}
				}
			}
			if (this.conf.subtype == undefined) {
				this.conf.subtype = defSubtype
			}
			if (this.conf.name == undefined) {
				this.conf.name = this.conf.type.concat(dev.report.base.wsel
						.countEl(this.conf.type)
						+ 1)
			}
			if (this.conf.cnttype == undefined || this.conf.cnt == undefined) {
				this.conf.cnttype = "html";
				this.conf.cnt = "<html><body>No content...</body></html>"
			}
			if (this.conf.cnttype == "url" && this.conf.cnt.charAt(0) != "/"
					&& this.conf.cnt.search(/:\/\//) < 0) {
				this.conf.cnt = "http://".concat(this.conf.cnt)
			}
			if (this.conf.top == undefined) {
				this.conf.top = env.selectedCell.parentNode.offsetTop
			}
			if (this.conf.left == undefined) {
				this.conf.left = env.selectedCell.offsetLeft
			}
			if (this.conf.width == undefined) {
				this.conf.width = dims.defW
			}
			if (this.conf.height == undefined) {
				this.conf.height = dims.defH
			}
			if (this.conf.srctype == undefined || this.conf.src == undefined) {
				this.conf.srctype = srcTypes.NONE;
				this.conf.src = ""
			}
			if (this.conf.tvar == undefined) {
				this.conf.tvar = ""
			}
			if (!this.conf._gendata) {
				this.conf._gendata = []
			}
			if (this.conf.zindex == undefined) {
				this.conf.zindex = dev.report.base.wsel.wselRegistry.getZIndex()
			}
			if (this.conf.locked == undefined) {
				this.conf.locked = defLockedState
			}
			if (this.conf.singleCell == undefined) {
				this.conf.singleCell = true
			}
			if (this.conf.format == undefined) {
				this.conf.format = {
					view : {
						border : false
					},
					transparent : false
				}
			}
			if (this.conf.trange.length > 0) {
				if (!this.conf.trange.search(/^=/)) {
					this.conf.trange = this.conf.trange.substr(1)
				}
				var destRng = formulaParser.parse(this.conf.trange);
				if (!destRng.length) {
					if (hasCB) {
						cb[1].call(cb[0], [false, "wsel_inv_target", {}])
					}
					return
				}
				destRng = destRng[0];
				if (destRng.sheet.length
						&& !this._book._sheetSelector
								.getIdByName(destRng.sheet)) {
					if (hasCB) {
						cb[1].call(cb[0], [false, "wsel_inv_target_sheet", {
											name : destRng.sheet
										}])
					}
					return
				}
			}
			cmds.push(["wget", "", [], ["e_id"], {
						e_type : "widget",
						widget_name : this.conf.name
					}]);
			if (this.conf.tnamedrange.length > 0) {
				cmds.push(["nexs",
						[this.conf.tnamedrange, this._sheet.getUid()]])
			}
			(new dev.report.backend.CCmdAsyncRqst(cmds)).setOnSuccess([this, cbChk])
					.send()
		} else {
			this.interactive = false;
			this.conf.zindex = parseInt(this.conf.zindex);
			addCmp.call(this)
		}
	}
})();
dev.report.util.extend(dev.report.base.wsel.Widget, dev.report.base.wsel.Base);
dev.report.base.wsel.Widget.setTarget = function(bookId, wsid, id, val) {
	var book = dev.report.base.book.reg[bookId];
	if (book) {
		dev.report.base.wsel.wselRegistry.get(book, wsid, id).setTarget(val)
	}
};
dev.report.base.wsel.Widget.setUpdObj = function(updObj, el) {
	var setUpdObj = false;
	if (!("format" in el)) {
		el.format = {
			view : {
				border : false
			},
			transparent : false
		};
		setUpdObj = true
	} else {
		if (!("transparent" in el.format)) {
			el.format.transparent = false;
			setUpdObj = true
		}
	}
	if (setUpdObj) {
		if (updObj[el.e_id]) {
			updObj[el.e_id]["format"] = el.format
		} else {
			updObj[el.e_id] = {
				format : el.format
			}
		}
	}
};
dev.report.base.wsel.Widget.loadAll = function(res, sheet) {
	sheet.setInitReg("widget", res[1].length);
	if (!(res instanceof Array) || res[0] !== true || !res[1].length) {
		return
	}
	res = res[1];
	var conn = dev.report.backend, activeBook = dev.report.base.app.activeBook, resLen = res.length, updObj = {}, el, conf;
	conn.ccmdBuffer();
	function postSpawn() {
		for (var updItem in updObj) {
			sheet.setInitConv("widget", true);
			conn.ccmd(null, ["wupd", "", updObj]);
			break
		}
		dev.report.base.wnd.active.toFront();
		var widgets = dev.report.base.wsel.wselRegistry.getByType("Widget",
				dev.report.base.app.activeBook, dev.report.base.app.activeSheet._uid);
		for (var i = 0, len = widgets.length; i < len; i++) {
			widgets[i].toggleInteraction(true);
			widgets[i].resetZIndex()
		}
		conn.ccmdFlush(true, true)
	}
	function spawn(idx) {
		if (idx < resLen - 1) {
			sheet.updInitReg("widget")
		}
		if (idx < 0) {
			return postSpawn()
		}
		el = res[idx];
		conf = {
			id : el.e_id,
			type : "Widget",
			subtype : el.widget_type,
			name : el.widget_name,
			cnttype : el.data.cnttype,
			cnt : el.data.cnt,
			srctype : el.data.srctype
					? el.data.srctype
					: dev.report.base.wsel.Base.srcTypes.NONE,
			src : el.n_refers_to ? el.n_refers_to : "",
			_gendata : el._gendata ? el._gendata : [],
			trange : el.data.trange,
			tnamedrange : el.data.tnamedrange,
			tvar : el.data.tvar,
			zindex : el.zindex,
			locked : el.locked,
			singleCell : true
		};
		dev.report.base.wsel.Widget.setUpdObj(updObj, el);
		conf.format = el.format;
		conf.sheet = sheet;
		dev.report.base.wsel.Base.loadDims(el, conf, updObj);
		dev.report.base.wsel.Base.fixDims(conf);
		dev.report.base.wsel.add(conf, [this, function() {
							spawn(idx - 1)
						}])
	}
	spawn(resLen - 1)
};
dev.report.base.wsel.Widget.resetZIndexes = function(skipId) {
	try {
		var widgets = dev.report.base.wsel.wselRegistry.getByType("Widget",
				dev.report.base.app.activeBook, dev.report.base.app.activeSheet._uid);
		for (var i = 0, len = widgets.length; i < len; i++) {
			if (widgets[i].conf.id == skipId) {
				continue
			} else {
				widgets[i].resetZIndex()
			}
		}
	} catch (e) {
	}
};
dev.report.base.wsel.Widget.setLock = function(res, lock) {
	if (lock) {
		this.lockCnt++
	} else {
		if (this.lockCnt > 0) {
			this.lockCnt--
		}
	}
};
dev.report.base.wsel.Widget.isLocked = function() {
	return this.lockCnt > 0
};
dev.report.base.wsel.Widget.dims = {
	minW : 50,
	minH : 50,
	maxW : 1600,
	maxH : 1050,
	defW : 300,
	defH : 200
};
dev.report.base.wsel.Widget.offsets = {
	ff : {
		titleH : 27
	},
	ie : {
		titleH : 27
	},
	sf : {
		titleH : 26
	},
	ch : {
		titleH : 27
	}
};
dev.report.base.wsel.Widget.loadParams = {
	type : "widget",
	attr : ["e_id", "e_type", "n_refers_to", "n_get_val", "n_target_ref",
			"n_target_val", "n_location", "n_use_locale", "pos_offsets",
			"data", "_gendata", "zindex", "locked", "size", "widget_type",
			"widget_name", "format"],
	cb : dev.report.base.wsel.Widget.loadAll
};
dev.report.base.wsel.Widget.lockCnt = 0;
clsRef = dev.report.base.wsel.Widget;
clsRef.prototype.setTitle = function(paneId) {
	if (!this.wrapper[paneId]) {
		return
	}
	var title = this.conf.name;
	try {
		var tm = Ext.util.TextMetrics.measure(Ext.DomQuery.select("#".concat(
						this.wrapper[paneId].getId(),
						" span[class=x-window-header-text]")), this.conf.name), wWidth = this.conf.width
				- 65;
		if (tm.width > wWidth) {
			var lFactor = wWidth * 100 / tm.width;
			title = title.substr(0, parseInt(title.length * lFactor / 100))
					.concat("...")
		}
	} catch (e) {
	}
	this.wrapper[paneId].setTitle(title)
};
clsRef.prototype._addScripts = function(paneId) {
	if (paneId == undefined) {
		for (var i = this.frame.length - 1; i >= 0; i--) {
			if (!this.frame[i].domWritable()) {
				return
			}
		}
	} else {
		if (!this.frame[paneId].domWritable()) {
			return
		}
	}
/*	var hlScript = "function __hyperlink(link, text) {parent.dev.report.base.hl.execDyn(link, text);}\n\r", macroScript = "function __macro(ccmd) {parent.dev.report.base.macro.ui_exec([true, ccmd]);}\n\r", trgScript = "function __set(val) {parent.dev.report.base.wsel.Widget.setTarget('"
			.concat(this._book.id, "', '", this._sheet._uid, "', '",
					this.conf.id, "', val);}"), script = hlScript.concat(
			macroScript, trgScript);
	if (paneId == undefined) {
		for (var i = this.frame.length - 1; i >= 0; i--) {
			this.frame[i].execScript(script, true)
		}
	} else {
		this.frame[paneId].execScript(script, true)
	}
	*/
};
clsRef.prototype.setSource = function(wgData, paneId) {
	if (this.conf.srctype == "none") {
		return
	}
	if (paneId == undefined) {
		for (var i = this._panes.length - 1; i >= 0; i--) {
			if (!this.frame[i].domWritable()
					|| !this.elem[i].getFrameWindow().__exec) {
				return
			}
		}
	} else {
		if (!this.frame[paneId].domWritable()
				|| !this.elem[paneId].getFrameWindow().__exec) {
			return
		}
	}
	function cbWselData(data) {
		if (!data[0] || !data[0].length || !data[0][0] || !data[0][1]
				|| !data[0][1].length) {
			return
		}
		data = data[0][1][0];
		this.conf.src = data.n_refers_to;
		data.n_get_val = data.n_get_val instanceof Array
				? data.n_get_val
				: [data.n_get_val];
		this.conf.srcvals = data.n_source_dims == 0
				&& this.conf.src.substr(1, 4).toUpperCase() == "PALO"
				? dev.report.util.cols2List(data.n_get_val, true)
				: data.n_get_val;
		var srcScript = "__exec([".concat(this.arr2evalStr(this.conf.srcvals),
				"])");
		if (paneId == undefined) {
			for (var i = this.frame.length - 1; i >= 0; i--) {
				this.frame[i].execScript(srcScript)
			}
		} else {
			this.frame[paneId].execScript(srcScript)
		}
	}
	if (wgData != undefined) {
		cbWselData.call(this, wgData)
	} else {
		(new dev.report.backend.CCmdAsyncRqst(["wget", "", [],
				["n_refers_to", "n_get_val", "n_source_dims"], {
					e_id : this.conf.id
				}])).setOnSuccess([this, cbWselData]).send()
	}
};
clsRef.prototype.activate = function(win) {
	var paneId = win._paneId;
	if (!this.interactive) {
		this.elem[paneId].getFrame().toggleShim(true);
		return
	}
	if (this.winActFlag) {
		this.winActFlag = false
	} else {
		if (this.elem[paneId].getFrame().frameShim.isDisplayed()) {
			this.winActFlag = true
		}
		this.wrapper[paneId].toggleTitleVisibility(true);
		this.elem[paneId].getFrame().toggleShim(false)
	}
};
clsRef.prototype.deactivate = function(win) {
	if (!this.interactive) {
		return
	}
	var paneId = win._paneId;
	if (this.winActFlag) {
		var that = this;
		setTimeout(function() {
					that.wrapper[paneId].toFront();
					dev.report.base.wsel.Widget.resetZIndexes(that.conf.id)
				}, 100);
		this.winActFlag = false
	} else {
		this.wrapper[paneId].toggleTitleVisibility(false);
		this.elem[paneId].getFrame().toggleShim(true);
		this.winActFlag = false;
		dev.report.base.wsel.Widget.resetZIndexes()
	}
};
clsRef.prototype.toggleInteraction = function(flag) {
	this.interactive = flag
};
clsRef.prototype.move = function(cmp, x, y) {
	if (this.isUserMode || !this.wrapper || !this.interactive) {
		return
	}
	if (cmp._handleMove === false) {
		cmp._handleMove = true;
		return
	} else {
		cmp._handleMove = true
	}
	var conf = this.conf;
	if (this.snapToGrid) {
		this.snapToGrid = false;
		var newXY = dev.report.base.wsel.getSnapXY(x, y, this.conf.width,
				this.conf.height);
		x = newXY[0];
		y = newXY[1];
		cmp.setPosition(x, y)
	} else {
		if (this._rszData && this._rszTimer) {
			this._rszData.nx = x;
			this._rszData.ny = y;
			return
		}
	}
	if (x != conf.left || y != conf.top) {
		for (var i = this.wrapper.length - 1; i >= 0; i--) {
			if (i != cmp._paneId) {
				this.interactive = false;
				this.wrapper[i].toggleTitleVisibility(true);
				this.wrapper[i].setPosition(x, y);
				this.wrapper[i].toggleTitleVisibility(false);
				this.interactive = true
			}
		}
		conf.left = x;
		conf.top = y;
		try {
			var nLoc = dev.report.base.wsel.getNLoc(x, y, cmp.width, cmp.height,
					conf.singleCell), wselData = {};
			delete(nLoc.size);
			wselData[conf.id] = nLoc;
			var conn = dev.report.backend;
			conn.ccmd(true, ["wupd", "", wselData])
		} catch (e) {
		}
	}
};
clsRef.prototype.resize = function(wrapper, newWidth, newHeight) {
	if (this.isUserMode || !this.interactive) {
		return
	}
	try {
		var conf = this.conf, isTitleVis = wrapper.getEl().dom.children[0].style.display == "block";
		if (this.snapToGrid) {
			this.snapToGrid = false;
			var thisWgt = this;
			this._rszData = {
				nx : conf.left,
				ny : conf.top,
				nw : newWidth,
				nh : newHeight
			};
			this._rszTimer = setTimeout(function() {
						thisWgt._snapOnResize(wrapper._paneId)
					}, 0);
			return
		}
		conf.width = newWidth;
		conf.height = newHeight
				+ (isTitleVis
						? 0
						: dev.report.base.wsel.Widget.offsets[dev.report.base.app.browser].titleH);
		for (var i = this._panes.length - 1; i >= 0; i--) {
			this.setTitle(i);
			if (i != wrapper._paneId) {
				this.interactive = false;
				if (isTitleVis) {
					this.wrapper[i].toggleTitleVisibility(true);
					this.wrapper[i].setSize(conf.width, conf.height);
					this.wrapper[i].toggleTitleVisibility(false)
				} else {
					this.wrapper[i].setSize(conf.width, conf.height)
				}
				this.interactive = true
			}
		}
		var nLoc = dev.report.base.wsel.getNLoc(wrapper.x, wrapper.y, conf.width,
				conf.height, this.conf.singleCell), wselData = {};
		delete(nLoc.pos_offsets);
		delete(nLoc.n_location);
		wselData[conf.id] = nLoc;
		var conn = dev.report.backend;
		conn.ccmd(true, ["wupd", "", wselData])
	} catch (e) {
	}
};
clsRef.prototype._snapOnResize = function(paneId) {
	try {
		var rD = this._rszData, conf = this.conf, newPS = dev.report.base.wsel
				.getSnapXYandWH(conf.left, conf.top, conf.width, conf.height,
						rD.nx, rD.ny, rD.nw, rD.nh, 3);
		delete this._rszData;
		delete this._rszTimer;
		if ((conf.left != newPS[0]) || (conf.top != newPS[1])) {
			this.move(this.wrapper[paneId], newPS[0], newPS[1]);
			this.wrapper[paneId].setPosition(newPS[0], newPS[1])
		}
		if ((conf.width != newPS[2]) || (conf.height != newPS[3])) {
			for (var i = this.wrapper.length - 1; i >= 0; i--) {
				this.wrapper[i].setSize(newPS[2], newPS[3])
			}
		}
	} catch (e) {
	}
};
clsRef.prototype.arr2evalStr = function(arr) {
	var svalsStr = "";
	for (var i = 0, svals = arr, len = svals.length; i < len; i++) {
		if (typeof svals[i] == "string") {
			svalsStr = svalsStr.concat("'", svals[i].replace(/'/g, "\\'")
							.replace(/\n/g, "\\n"), "',")
		} else {
			svalsStr = svalsStr.concat(svals[i], ",")
		}
	}
	var svalsStrLen = svalsStr.length;
	return svalsStrLen ? svalsStr.substr(0, svalsStrLen - 1) : ""
};
clsRef.prototype.setTarget = function(val) {
	var conn = dev.report.backend, env = this._env.shared, hasTrange = this.conf.trange.length, hasTnamedrange = this.conf.tnamedrange.length, hasTvar = this.conf.tvar.length;
	if (val == undefined || val == null || val instanceof Object
			|| (!hasTrange && !hasTnamedrange && !hasTvar)) {
		return
	}
	dev.report.base.wsel.Widget.setLock(null, true);
	if (val instanceof Array) {
		val = val.length ? val[0] : ""
	}
	conn.ccmdBuffer();
	if (hasTrange) {
		var destRng = dev.report.base.formula.parse(this.conf.trange)[0];
		if (destRng.sheet.length
				&& destRng.sheet != this._book._sheetSelector
						.getActiveSheetName()) {
			var actSheetId = this._sheet._uid, tSheetId = this._book._sheetSelector
					.getIdByName(destRng.sheet);
			conn.ccmd(0, ["osel", 2, tSheetId])
		}
		conn.ccmd(0, ["cdrn", {
							cm : true
						}, destRng.rng.concat({
									v : val
								})]);
		if (tSheetId) {
			conn.ccmd(0, ["osel", 2, actSheetId])
		}
	}
	if (hasTnamedrange) {
		var actCellCoords = (env.viewMode == dev.report.base.grid.viewMode.USER) ? [
				1, 1] : env.selectedCellCoords;
		conn.ccmd(0, [
						"nupd",
						[[this.conf.tnamedrange, this._sheet.getUid()],
								actCellCoords[0], actCellCoords[1], {
									refers_to : "="
											.concat(typeof val == "string"
													? Ext.util.JSON.encode(val)
													: val)
								}]])
	}
	if (hasTvar) {
		conn.ccmd(null, ["svar", this.conf.tvar, val])
	}
	conn
			.ccmdFlush([dev.report.base.wsel.Widget, dev.report.base.wsel.Widget.setLock,
							false], true)
};
clsRef.prototype.refresh = function(data) {
	data.val = data.val instanceof Array ? data.val : [data.val];
	if ("ref" in data && this.conf.src != data.ref) {
		this.conf.src = data.ref
	}
	this.conf.srcvals = data.n_source_dims == 0
			&& this.conf.src.substr(1, 4).toUpperCase() == "PALO" ? dev.report.util
			.cols2List(data.val, true) : data.val;
	var srcScript = "__exec(["
			.concat(this.arr2evalStr(this.conf.srcvals), "])");
	for (var i = this.frame.length - 1; i >= 0; i--) {
		this.frame[i].execScript(srcScript)
	}
};
clsRef.prototype.showContextMenu = function(e) {
	var that = this, contextMenu = new Ext.menu.Menu({
				id : "widgetContextMenu",
				enableScrolling : false,
				listeners : {
					hide : function(menu) {
						menu.destroy()
					}
				},
				items : [{
							text : "widget_edit".localize().concat("..."),
							iconCls : "icon_edit",
							handler : function() {
								that.edit.call(that)
							}
						}, {
							text : "widget_delete".localize(),
							iconCls : "icon_delete",
							handler : function() {
								that.remove.call(that)
							}
						}, "-", new Ext.menu.Item({
									text : "Bring to Front".localize(),
									iconCls : "ico_bring_to_front",
									disabled : that.conf.locked,
									menu : {
										items : [{
											text : "Bring to Front".localize(),
											iconCls : "ico_bring_to_front",
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.bringToFront(that.conf.id)
											}
										}, {
											text : "Bring Forward".localize(),
											iconCls : "ico_bring_forward",
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.bringForward(that.conf.id)
											}
										}]
									}
								}), new Ext.menu.Item({
									text : "Send to Back".localize(),
									iconCls : "ico_send_to_back",
									disabled : that.conf.locked,
									menu : {
										items : [{
											text : "Send to Back".localize(),
											iconCls : "ico_send_to_back",
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.sendToBack(that.conf.id)
											}
										}, {
											text : "Send Backward".localize(),
											iconCls : "ico_send_backward",
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.sendBackward(that.conf.id)
											}
										}]
									}
								}), {
							text : (that.conf.locked ? "Unlock" : "Lock")
									.localize(),
							iconCls : "icon_lock",
							handler : function(item, e) {
								item.setText((that.conf.locked
										? "Lock"
										: "Unlock").localize());
								for (var i = that._panes.length - 1; i >= 0; i--) {
									that.setLock(!that.conf.locked, i, i)
								}
							}
						}]
			});
	var coords = e.getXY();
	contextMenu.showAt([coords[0], coords[1]])
};
clsRef.prototype.remove = function() {
	var conn = dev.report.backend, cbRemove = function() {
		for (var i = this.wrapper.length - 1; i >= 0; i--) {
			this.wrapper[i].close()
		}
		dev.report.base.wsel.wselRegistry.remove(this._book, this._sheet._uid,
				this.conf.id)
	}, cbNRngChk = function(res) {
		conn.ccmdBuffer();
		if (this.conf.tnamedrange.length > 0 && res[0] && res[0][0]
				&& res[0][1] && res[0][1][0]) {
			conn.ccmd(0, ["ndel", res[0][1][0].uuid])
		}
		conn.ccmd(0, ["wdel", "", [this.conf.id]]);
		conn.ccmdFlush([this, cbRemove], true)
	};
	for (var i = this.wrapper.length - 1; i >= 0; i--) {
		this.wrapper[i].hide()
	}
	if (this.conf.tnamedrange.length > 0) {
		(new dev.report.backend.CCmdAsyncRqst(["nget",
				[1, 1, this.conf.tnamedrange, this._sheet.getUid()]]))
				.hideErrors(true).setOnSuccess([this, cbNRngChk]).send()
	} else {
		cbNRngChk.call(this)
	}
};
clsRef.prototype.update = function(editConf, cb) {
	var conn = dev.report.backend, cmds = [], actCellCoords = this._env.shared.selectedCellCoords, hasCB = cb instanceof Array
			&& cb.length > 1, wsel = {}, updObj = {}, chkNameAndRng = chkNRng = false, upd = {
		wsel : false,
		data : false,
		src : false,
		cnttype : false,
		cnt : false,
		title : false,
		format : false
	}, cbUpdCnt = function(paneId) {
		var that = this;
		setTimeout(function() {
					that.frame[paneId].update(that.conf.cnt, true)
				}, 0)
	}, cbUpdCmp = function(res) {
		if (upd.title) {
			for (var i = this._panes.length - 1; i >= 0; i--) {
				this.setTitle(i)
			}
		}
		if (upd.format) {
			for (var i = this._panes.length - 1; i >= 0; i--) {
				this.wrapper[i][this.conf.format.transparent
						? "addClass"
						: "removeClass"]("x-widget-transp")
			}
		}
		if (upd.cnt) {
			if (this.conf.cnttype == "html") {
				if (upd.cnttype) {
					var that = this;
					for (var i = this.frame.length - 1; i >= 0; i--) {
						this.frame[i].reset(void(0), function() {
									cbUpdCnt.call(that, this.frame[i]._paneId)
								})
					}
				} else {
					for (var i = this.frame.length - 1; i >= 0; i--) {
						this.frame[i].update(this.conf.cnt, true)
					}
				}
			} else {
				for (var i = this.frame.length - 1; i >= 0; i--) {
					this.frame[i].setSrc(this.conf.cnt)
				}
			}
		} else {
			if (upd.src) {
				this.setSource([res[1]])
			}
		}
		if (hasCB) {
			cb[1].call(cb[0], [true])
		}
	}, cbChkConf = function(chkRes) {
		cmds = [];
		if (chkNameAndRng && chkRes[0][1].length
				&& chkRes[0][1][0]["e_id"] != this.conf.id) {
			if (hasCB) {
				cb[1].call(cb[0], [false, "widget_exists", {
									name : editConf.name
								}])
			}
			return
		}
		if (editConf.name != this.conf.name) {
			this.conf.name = editConf.name;
			wsel.widget_name = this.conf.name;
			upd.title = true
		}
		if (editConf.cnttype != this.conf.cnttype) {
			this.conf.cnttype = editConf.cnttype;
			upd.data = upd.cnt = upd.cnttype = true
		}
		if (editConf.cnt != this.conf.cnt) {
			this.conf.cnt = (this.conf.cnttype == "url"
					&& editConf.cnt.charAt(0) != "/"
					&& editConf.cnt.search(/:\/\//) < 0 ? "http://" : "")
					.concat(editConf.cnt);
			upd.data = upd.cnt = true
		}
		if (editConf.srctype != this.conf.srctype) {
			if (editConf.srctype == "custom" || this.conf.srctype == "custom") {
				wsel.n_use_locale = editConf.srctype == "custom"
			}
			this.conf.srctype = editConf.srctype;
			upd.data = true
		}
		if (editConf.src != this.conf.src) {
			this.conf.src = editConf.src;
			wsel.n_refers_to = this.conf.src;
			upd.src = true
		}
		if (editConf._gendata != this.conf._gendata) {
			this.conf._gendata = editConf._gendata;
			wsel._gendata = this.conf._gendata
		}
		if (editConf.trange != this.conf.trange) {
			if (editConf.trange.length) {
				wsel.n_target_ref = "=".concat(editConf.trange)
			}
			this.conf.trange = editConf.trange;
			upd.data = true
		}
		if (editConf.tnamedrange != this.conf.tnamedrange) {
			if (editConf.tnamedrange.length) {
				wsel.n_target_ref = "=".concat(editConf.tnamedrange)
			}
			this.conf.tnamedrange = editConf.tnamedrange;
			if (this.conf.tnamedrange.length
					&& !chkRes[chkNameAndRng ? 1 : 0][1][0]) {
				cmds.push(["nadd", [actCellCoords[0], actCellCoords[1], {
							name : this.conf.tnamedrange,
							refers_to : "=TRUE",
							scope : this._book._sheetSelector
									.getActiveSheetName(),
							comment : "Managed by widget "
									.concat(this.conf.name)
						}]])
			}
			upd.data = true
		}
		if (editConf.tvar != this.conf.tvar) {
			if (editConf.tvar.length) {
				wsel.n_target_ref = "=@".concat(editConf.tvar)
			}
			this.conf.tvar = editConf.tvar;
			upd.data = true
		}
		if (Ext.util.JSON.encode(editConf.format) != Ext.util.JSON
				.encode(this.conf.format)) {
			this.conf.format = editConf.format;
			upd.format = true
		}
		if (this.wrapper
				&& ((editConf.width != this.conf.width && editConf.width > 0) || (editConf.height != this.conf.height && editConf.height > 0))) {
			this.setCmpSize(editConf.width, editConf.height);
			for (var i = this.wrapper.length - 1; i >= 0; i--) {
				this.wrapper[i].toggleTitleVisibility(true);
				this.wrapper[i].setSize(this.conf.width, this.conf.height);
				this.wrapper[i].toggleTitleVisibility(false)
			}
			wsel.size = [this.conf.width, this.conf.height]
		}
		if (this.wrapper
				&& ((editConf.left != this.conf.left && editConf.left > -1) || (editConf.top != this.conf.top && editConf.top > -1))) {
			this.conf.left = editConf.left > -1 ? editConf.left : 0;
			this.conf.top = editConf.top > -1 ? editConf.top : 0;
			for (var i = this.wrapper.length - 1; i >= 0; i--) {
				this.wrapper[i].toggleTitleVisibility(true);
				this.wrapper[i].setPosition(this.conf.left, this.conf.top);
				this.wrapper[i].toggleTitleVisibility(false)
			}
			var posConf = dev.report.base.wsel.getNLoc(this.conf.left, this.conf.top,
					this.conf.width, this.conf.height, this.conf.singleCell);
			wsel.n_location = posConf.n_location;
			wsel.pos_offsets = posConf.pos_offsets
		}
		for (var fld in wsel) {
			upd.wsel = true;
			break
		}
		if (upd.wsel || upd.data || upd.format) {
			if (upd.data) {
				wsel.data = {
					srctype : this.conf.srctype,
					trange : this.conf.trange,
					tnamedrange : this.conf.tnamedrange,
					tvar : this.conf.tvar,
					cnttype : this.conf.cnttype,
					cnt : this.conf.cnt
				}
			}
			if (upd.format) {
				wsel.format = this.conf.format
			}
			updObj[this.conf.id] = wsel;
			cmds.push(["wupd", "", updObj]);
			if (upd.src) {
				cmds.push(["wget", "", [],
						["n_get_val", "n_refers_to", "n_source_dims"], {
							e_id : this.conf.id
						}])
			}
			(new dev.report.backend.CCmdAsyncRqst(cmds)).setOnSuccess([this,
					cbUpdCmp]).send()
		} else {
			if (hasCB) {
				cb[1].call(cb[0], [true])
			}
		}
	};
	if (editConf.trange.length && editConf.trange != this.conf.trange) {
		if (!editConf.trange.search(/^=/)) {
			editConf.trange = editConf.trange.substr(1)
		}
		var destRng = dev.report.base.formula.parse(editConf.trange);
		if (!destRng.length) {
			if (hasCB) {
				cb[1].call(cb[0], [false, "wsel_inv_target", {}])
			}
			return
		}
		destRng = destRng[0];
		if (destRng.sheet.length
				&& !this._book._sheetSelector.getIdByName(destRng.sheet)) {
			if (hasCB) {
				cb[1].call(cb[0], [false, "wsel_inv_target_sheet", {
									name : destRng.sheet
								}])
			}
			return
		}
	}
	if (editConf.name != this.conf.name || editConf.trange != this.conf.trange) {
		cmds.push(["wget", "", [], ["e_id"], {
					e_type : "widget",
					widget_name : editConf.name
				}]);
		chkNameAndRng = true
	}
	if (editConf.tnamedrange.length
			&& editConf.tnamedrange != this.conf.tnamedrange) {
		cmds.push(["nexs", [editConf.tnamedrange, this._sheet.getUid()]]);
		chkNRng = true
	}
	if (chkNameAndRng || chkNRng) {
		(new dev.report.backend.CCmdAsyncRqst(cmds)).setOnSuccess([this, cbChkConf])
				.send()
	} else {
		cbChkConf.call(this)
	}
};
clsRef.prototype.setCmpSize = function(w, h) {
	for (var i = this.elem.length - 1; i >= 0; i--) {
		this.elem[i].setSize(w, h)
	}
	this.conf.width = w;
	this.conf.height = h
};
clsRef.prototype.setZIndex = function(zIdx, setCmp) {
	if (this.isUserMode) {
		return
	}
	if (setCmp !== false) {
		for (var i = this.wrapper.length - 1; i >= 0; i--) {
			this.wrapper[i].el.setZIndex(zIdx - 2)
		}
	}
	var updObj = {};
	updObj[this.conf.id] = {
		zindex : zIdx
	};
	dev.report.backend.ccmd(null, ["wupd", "", updObj]);
	this.conf.zindex = zIdx
};
clsRef.prototype.resetZIndex = function() {
	if (this.wrapper) {
		for (var i = this.wrapper.length - 1; i >= 0; i--) {
			this.wrapper[i].el.setZIndex(this.conf.zindex - 2)
		}
	}
};
clsRef.prototype.setLock = function(locked, skipSave, paneId) {
	if (this.isUserMode) {
		return
	}
	var wrapper = this.wrapper[paneId], wrpDD = wrapper.dd, rsz = wrapper.resizer, handles = [
			"east", "west", "north", "south", "southeast", "southwest",
			"northeast", "northwest"];
	locked = locked !== false;
	rsz.enabled = !locked;
	if (!locked) {
		wrpDD.startDrag = wrpDD._startDrag;
		wrpDD.onDrag = wrpDD._onDrag;
		wrpDD.endDrag = wrpDD._endDrag
	} else {
		wrpDD._startDrag = wrpDD.startDrag;
		wrpDD.startDrag = wrpDD.startDrag.createInterceptor(function(x, y) {
					return false
				});
		wrpDD._onDrag = wrpDD.onDrag;
		wrpDD.onDrag = wrpDD.onDrag.createInterceptor(function(e) {
					return false
				});
		wrpDD._endDrag = wrpDD.endDrag;
		wrpDD.endDrag = wrpDD.endDrag.createInterceptor(function(e) {
					return false
				})
	}
	for (var i = handles.length - 1, style; i >= 0; i--) {
		style = rsz[handles[i]].el.dom.style;
		style.cursor = locked ? "default" : "";
		style.display = locked ? "none" : ""
	}
	if (!skipSave) {
		var updObj = {}, cbLck = function(res) {
			if (res[0] && res[0][0]) {
				this.conf.locked = locked
			}
		};
		updObj[this.conf.id] = {
			locked : locked
		};
		dev.report.backend.ccmd([this, cbLck], ["wupd", "", updObj])
	}
};
clsRef.prototype.removize = function(data) {
	if (this.isUserMode) {
		return
	}
	var tlOffsetXY = this._sheet._aPane.getPixelsByCoords(data.pos[0],
			data.pos[1]), newX = tlOffsetXY[0] + data.offsets[0], newY = tlOffsetXY[1]
			+ data.offsets[1];
	for (var i = this.wrapper.length - 1; i >= 0; i--) {
		this.wrapper[i].toggleTitleVisibility(true);
		this.wrapper[i].setPosition(newX, newY);
		this.wrapper[i].toggleTitleVisibility(false)
	}
	this.conf.left = newX;
	this.conf.top = newY
};
clsRef.prototype.unload = function() {
	if (this.wrapper) {
		for (var i = this.wrapper.length - 1; i >= 0; i--) {
			this.wrapper[i].hide()
		}
	}
};
clsRef.prototype.updateWSElData = function() {
	var conn = dev.report.backend, updObj = {};
	updObj[this.conf.id] = {
		data : {
			srctype : this.conf.srctype,
			trange : this.conf.trange,
			tnamedrange : this.conf.tnamedrange,
			tvar : this.conf.tvar,
			cnttype : this.conf.cnttype,
			cnt : this.conf.cnt
		}
	};
	conn.ccmd(true, ["wupd", "", updObj])
};
clsRef.prototype.updateTarget = function(data) {
	var trgType = this.getTargetType(), tRefIdx = data.n_target_ref
			.search(/^=/)
			+ 1;
	if (!data.n_target_ref.search(/^=@/)) {
		tRefIdx++
	}
	data.n_target_ref = data.n_target_ref.substr(tRefIdx);
	if (this.conf[trgType] != data.n_target_ref) {
		this.conf[trgType] = data.n_target_ref;
		this.updateWSElData()
	}
};
clsRef = null;