

Ext.namespace("dev.report.base.wsel");
using("dev.report.base.wsel.Base");
using("lib.Constrained.ResizableConstrained");
dev.report.base.wsel.chart =new function() {
	this.type_sizeDefs = {
		xlColumnClustered : "defHor",
		xlColumnStacked : "defHor",
		xlColumnStacked100 : "defHor",
		xl3DColumnClustered : "defHor",
		xl3DColumnStacked : "defHor",
		xl3DColumnStacked100 : "defHor",
		xlCylinderColClustered : "defHor",
		xlCylinderColStacked : "defHor",
		xlCylinderColStacked100 : "defHor",
		xlLine : "defHor",
		xlLineStacked : "defHor",
		xlLineStacked100 : "defHor",
		xlLineRotated : "defVer",
		xlLineMarkers : "defHor",
		xlLineMarkersStacked : "defHor",
		xlLineMarkersStacked100 : "defHor",
		xlLineMarkersRotated : "defVer",
		xl3DLine : "defHor",
		xlPie : "defHor",
		xl3DPie : "defHor",
		xlPieExploded : "defHor",
		xl3DPieExploded : "defHor",
		xlBarClustered : "defHor",
		xlBarStacked : "defHor",
		xlBarStacked100 : "defHor",
		xl3DBarClustered : "defHor",
		xl3DBarStacked : "defHor",
		xl3DBarStacked100 : "defHor",
		xlCylinderBarClustered : "defHor",
		xlCylinderBarStacked : "defHor",
		xlCylinderBarStacked100 : "defHor",
		xlArea : "defHor",
		xlAreaStacked : "defHor",
		xlAreaStacked100 : "defHor",
		xl3DArea : "defHor",
		xl3DAreaStacked : "defHor",
		xl3DAreaStacked100 : "defHor",
		xlXYScatter : "defHor",
		xlXYScatterSmooth : "defHor",
		xlXYScatterSmoothNoMarkers : "defHor",
		xlXYScatterLines : "defHor",
		xlXYScatterLinesNoMarkers : "defHor",
		xlStockHLC : "defHor",
		xlStockOHLC : "defHor",
		xlDoughnut : "defHor",
		xlDoughnutExploded : "defHor",
		xlBubble : "defHor",
		xlBubble3DEffect : "defHor",
		xlRadar : "defHor",
		xlRadarMarkers : "defHor",
		xlRadarFilled : "defHor",
		xlMeterOdoFull : "equal",
		xlMeterOdoFull100 : "equal",
		xlMeterOdoHalf : "odoHalf",
		xlMeterOdoHalf100 : "odoHalf",
		xlMeterAngularWide : "angulWide",
		xlMeterLineHorizontal : "lineHor",
		xlMeterLineVertical : "lineVer"
	};
	this.min_sizeFactor = 100;
	this.min_whRatio = {
		defHor : [0.2, 0.2],
		defVer : [0.2, 0.2],
		equal : [1.5, 1.5],
		odoHalf : [1.5, 1],
		angulWide : [1.5, 0.7],
		lineHor : [2, 0.7],
		lineVer : [0.8, 2]
	};
	this.max_width = 1600;
	this.max_height = 1200;
	this.whRatio = {
		defHor : [4, 3],
		defVer : [3, 4],
		equal : [2, 2],
		odoHalf : [2, 1.5],
		angulWide : [2.5, 0.9],
		lineHor : [3, 0.8],
		lineVer : [1, 3]
	};
	this.reMovize = function(chartId, pos, offsets) {
		var chart = dev.report.base.wsel.wselRegistry.get(dev.report.base.app.activeBook,
				dev.report.base.app.activeSheet._uid, chartId), tlSize = dev.report.base.wsel
				.getTLSize(pos, offsets), w = tlSize.size[0], h = tlSize.size[1];
		for (var i = chart.wrapper.length - 1, wrpEl; i >= 0; i--) {
			(wrpEl = chart.isUserMode
					? chart.wrapper[i].getEl()
					: chart.wrapperEl[i]).setLeftTop("".concat(tlSize.tl[0],
							"px"), "".concat(tlSize.tl[1], "px"))
		}
		var whRatio = dev.report.base.wsel.chart.min_whRatio[dev.report.base.wsel.chart.type_sizeDefs[chart.eElem[chart._sheet._aPane._id].elemSubtype]];
		w = (whRatio[0] * dev.report.base.wsel.chart.min_sizeFactor > w)
				? whRatio[0] * dev.report.base.wsel.chart.min_sizeFactor
				: ((dev.report.base.wsel.chart.max_width < w)
						? dev.report.base.wsel.chart.max_width
						: w);
		h = (whRatio[1] * dev.report.base.wsel.chart.min_sizeFactor > h)
				? whRatio[1] * dev.report.base.wsel.chart.min_sizeFactor
				: ((dev.report.base.wsel.chart.max_height < h)
						? dev.report.base.wsel.chart.max_height
						: h);
		if (tlSize._error || (w != tlSize.size[0]) || (h != tlSize.size[1])) {
			tlSize._error = true
		}
		if ((wrpEl.dom.offsetWidth != w) || (wrpEl.dom.offsetHeight != h)
				|| (pos[0] == pos[2]) || (pos[1] == pos[3])) {
			var chartData = dev.report.base.wsel.getNLoc(tlSize.tl[0], tlSize.tl[1],
					w, h);
			if (tlSize._error) {
				var res = dev.report.backend.wss.wsel("resize_chart", {
							id : chartId,
							n_location : chartData.n_location,
							pos_offsets : chartData.pos_offsets,
							size : [w, h]
						})
			}
			chart.setPosition(chartData.n_location, chartData.pos_offsets);
			var currDate = new Date();
			for (var i = chart._panes.length - 1; i >= 0; i--) {
				chart.eElem[i].setSize(w, h);
				(chart.isUserMode
						? chart.wrapper[i].getEl()
						: chart.wrapperEl[i]).setSize(w, h);
				document.getElementById(chart._panes[i]._domId.concat(
						"_wsel_cont_", chartId)).src = "/be/wss/gen_element.php?sess="
						.concat(dev.report.base.app.sess, "&buid=", chart._book.uid,
								"&suid=", chart._sheet.getUid(), "&id=",
								chartId, "&w=", w, "&h=", h, "&ts=", currDate
										.getTime())
			}
		}
	};
	this.createChart = function(cb, chartId, n_location, pos_offsets, size,
			chartType, zindex, locked, name) {
		dev.report.base.wsel.wselRegistry
				.add(new dev.report.base.wsel.Chart(cb, chartId, n_location,
						pos_offsets, size, chartType, zindex, locked, name))
	}
};
dev.report.base.wsel.Chart = (function() {
	var type = "Chart";
	return function(cb, chartId, n_location, pos_offsets, size, chartType,
			zindex, locked, name) {
		var that = this, hasCb = cb instanceof Array && cb.length > 1, convObj = {};
		dev.report.base.wsel.Chart.parent.constructor.call(this, {
					id : chartId,
					name : name,
					type : type,
					zindex : zindex,
					locked : locked,
					n_location : n_location,
					pos_offsets : pos_offsets,
					size : size,
					chartType : chartType,
					sheet : hasCb ? cb[0] : undefined
				});
		if (this.conf.id == null || this.conf.id === false) {
			Ext.MessageBox.show({
						title : "Operation Error".localize(),
						msg : "chartDlg_genError".localize(),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			if (hasCb) {
				cb[1].apply(cb[0], cb.slice(2))
			}
			return
		}
		this.setPosition(this.conf.n_location, this.conf.pos_offsets);
		this.afterResizeHandler = this.afterResizeChart;
		if (this.conf.name == undefined || !this.conf.name.length) {
			this.generateName();
			convObj.chart_name = this.conf.name
		}
		if (this.conf.zindex == undefined) {
			this.conf.zindex = dev.report.base.wsel.wselRegistry.getZIndex();
			convObj.zindex = this.conf.zindex
		}
		if (this.conf.locked == undefined) {
			this.conf.locked = dev.report.base.wsel.Chart.defLockedState;
			convObj.locked = this.conf.locked
		}
		this.conf.zindex = parseInt(this.conf.zindex);
		var tlSize = dev.report.base.wsel.getTLSize(dev.report.base.wsel
						.getRngFromNLoc(this.conf.n_location),
				this.conf.pos_offsets);
		this.conf.width = tlSize.size[0];
		this.conf.height = tlSize.size[1];
		this.conf.left = tlSize.tl[0];
		this.conf.top = tlSize.tl[1];
		var whRatio = dev.report.base.wsel.chart.min_whRatio[dev.report.base.wsel.chart.type_sizeDefs[this.conf.chartType]];
		this.conf.width = (whRatio[0] * dev.report.base.wsel.chart.min_sizeFactor > this.conf.width)
				? whRatio[0] * dev.report.base.wsel.chart.min_sizeFactor
				: ((dev.report.base.wsel.chart.max_width < this.conf.width)
						? dev.report.base.wsel.chart.max_width
						: this.conf.width);
		this.conf.height = (whRatio[1] * dev.report.base.wsel.chart.min_sizeFactor > this.conf.height)
				? whRatio[1] * dev.report.base.wsel.chart.min_sizeFactor
				: ((dev.report.base.wsel.chart.max_height < this.conf.height)
						? dev.report.base.wsel.chart.max_height
						: this.conf.height);
		if (tlSize._error || (this.conf.width != tlSize.size[0])
				|| (this.conf.height != tlSize.size[1])) {
			var chartData = dev.report.base.wsel.getNLoc(tlSize.tl[0], tlSize.tl[1],
					this.conf.width, this.conf.height);
			var res = dev.report.backend.wss.wsel("resize_chart", {
						id : this.conf.id,
						n_location : chartData.n_location,
						pos_offsets : chartData.pos_offsets,
						size : [this.conf.width, this.conf.height]
					});
			this.setPosition(chartData.n_location, chartData.pos_offsets)
		}
		var currDate = new Date();
		this.resCont = [];
		this.eElem = [];
		this.wrapper = [];
		if (!this.isUserMode) {
			this.wrapperEl = []
		}
		for (var i = 0, panesLen = this._panes.length, gridDivId, elContId, pane, contId; i < panesLen; i++) {
			pane = this._panes[i];
			contId = pane._domId;
			gridDivId = contId.concat("_IC");
			elContId = contId.concat("_wsel_cont_", this.conf.id);
			this.calcConstraints(pane);
			this.resCont[i] = Ext.DomHelper.insertFirst(Ext.DomQuery
							.selectNode("div[id=" + gridDivId + "]"), {
						tag : "img",
						id : elContId,
						src : "/be/wss/gen_element.php?sess=".concat(
								dev.report.base.app.sess, "&buid=", this._book.uid,
								"&suid=", this._sheet.getUid(), "&id=",
								this.conf.id, "&w=", this.conf.width, "&h=",
								this.conf.height, "&ts=", currDate.getTime()),
						width : this.conf.width,
						height : this.conf.height,
						cls : "ws_element",
						style : "z-index: ".concat(this.conf.zindex,
								"; position: absolute; left:", this.conf.left,
								"px; top:", this.conf.top, "px;")
					}, false);
			this.wrapper[i] = new lib.Constrained.ResizableConstrained(elContId, {
						wrap : !!document.all || !this.isUserMode,
						dynamic : !this.isUserMode,
						pinned : false,
						width : this.conf.width,
						height : this.conf.height,
						minWidth : 250,
						maxWidth : dev.report.base.wsel.chart.max_width,
						minHeight : 100,
						maxHeight : dev.report.base.wsel.chart.max_height,
						preserveRatio : false,
						defaultRatio : false,
						transparent : false,
						handles : (document.all && this.isUserMode)
								? "none"
								: "all",
						draggable : !this.isUserMode,
						enabled : !this.isUserMode,
						resizeRegion : Ext.get(gridDivId).getRegion(),
						_paneId : i
					});
			this.eElem[i] = Ext.get(elContId);
			this.eElem[i].elemSubtype = this.conf.chartType;
			if (!this.isUserMode) {
				this.wrapper[i].on({
							resize : {
								fn : this.afterResizeChart,
								scope : this
							},
							beforeresize : {
								fn : this.beforeResize,
								scope : this
							}
						});
				this.wrapper[i].dd.maintainOffset = true;
				this.wrapper[i].setXConstraint(this.elConstr[i].left,
						this.elConstr[i].right);
				this.wrapper[i].setYConstraint(this.elConstr[i].up,
						this.elConstr[i].down);
				this.wrapperEl[i] = this.wrapper[i].getEl();
				this.wrapperEl[i].dom.style.zIndex = this.conf.zindex;
				this.wrapperEl[i].on({
							mousedown : {
								fn : this.onChartMouseDown,
								scope : this,
								options : {
									paneId : i
								}
							},
							dblclick : {
								fn : this.edit,
								scope : this
							}
						});
				if (this.conf.locked) {
					this.setLock(true, true, i)
				}
			} else {
				this.wrapper[i].getEl().on({
							mousedown : {
								fn : this.onMouseDownUM,
								scope : this,
								options : {
									paneId : i
								}
							}
						})
			}
		}
		for (var conv in convObj) {
			if (hasCb && cb[0] instanceof dev.report.base.grid.Sheet) {
				cb[0].setInitConv(cb[2], true)
			}
			var updObj = {};
			updObj[this.conf.id] = convObj;
			dev.report.backend.ccmd([this, function() {
								if (hasCb) {
									cb[1].apply(cb[0], cb.slice(2))
								}
							}], ["wupd", "", updObj]);
			return
		}
		if (updObj == undefined && hasCb) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	}
})();
dev.report.util.extend(dev.report.base.wsel.Chart, dev.report.base.wsel.Base);
dev.report.base.wsel.Chart.defLockedState = false;
dev.report.base.wsel.Chart.dims = {
	maxW : 1600,
	maxH : 1200
};
clsRef = dev.report.base.wsel.Chart;
clsRef.prototype.onChartMouseDown = function(e, t, o) {
	this._env.shared.inputField.blur();
	if (!(e.button == 2
			|| (Ext.isMac && e.button == 0 && dev.report.base.app.ctrlKeyPressed) || (Ext.isWebKit && e.button == 1))) {
		(this._movedEl = e.browserEvent[document.all ? "srcElement" : "target"]).className = this.conf.locked
				? (this.conf.hl
						? "ws_element_locked_hyperlink"
						: "ws_element_locked")
				: "ws_element_move"
	}
	this.onMouseDown.call(this, e, t, o, this.onChartMouseUp)
};
clsRef.prototype.onChartMouseUp = function(e) {
	if (this.handleElementMove) {
		var el = (document.all) ? e.srcElement : e.target;
		if ((!el.className || el.className.indexOf("ws_element_move") < 0)
				&& this._movedEl) {
			el = this._movedEl
		}
		el.className = this.conf.locked ? "ws_element_locked" : "ws_element";
		this._movedEl = undefined
	}
	this.onMouseUp.call(this, e, this.onChartMouseUp)
};
clsRef.prototype.beforeResize = function(wrapper, e) {
	var resizeChild = wrapper.getResizeChild(), chartMinSizeFactor = dev.report.base.wsel.chart.min_sizeFactor, whRatio = dev.report.base.wsel.chart.min_whRatio[dev.report.base.wsel.chart.type_sizeDefs[resizeChild.elemSubtype]];
	wrapper.minWidth = whRatio[0] * chartMinSizeFactor;
	wrapper.minHeight = whRatio[1] * chartMinSizeFactor;
	dev.report.base.app.activeWrapper = wrapper;
	if (e.shiftKey) {
		wrapper.preserveRatio = true
	}
};
clsRef.prototype.afterResizeChart = this.afterResize = function(wrapper,
		newWidth, newHeight, e) {
	if (dev.report.base.app.activeWrapper) {
		wrapper.preserveRatio = false;
		delete dev.report.base.app.activeWrapper
	}
	this.afterResize.call(this, wrapper, newWidth, newHeight, e);
	this.setCmpSize(this.conf.width, this.conf.height);
	var chartData = dev.report.base.wsel.getNLoc(this.conf.left, this.conf.top,
			this.conf.width, this.conf.height);
	var res = dev.report.backend.wss.wsel("resize_chart", {
				id : this.conf.id,
				n_location : chartData.n_location,
				pos_offsets : chartData.pos_offsets,
				size : [this.conf.width, this.conf.height]
			});
	this.setPosition(chartData.n_location, chartData.pos_offsets);
	var currDate = new Date();
	for (var i = this._panes.length - 1; i >= 0; i--) {
		document.getElementById(this._panes[i]._domId.concat("_wsel_cont_",
				this.conf.id)).src = "/be/wss/gen_element.php?sess=".concat(
				dev.report.base.app.sess, "&buid=", this._book.uid, "&suid=",
				this._sheet.getUid(), "&id=", this.conf.id, "&w=",
				this.conf.width, "&h=", this.conf.height, "&ts=", currDate
						.getTime())
	}
};
clsRef.prototype.setCmpSize = function(w, h) {
	for (var i = this.eElem.length - 1; i >= 0; i--) {
		this.eElem[i].setWidth(w);
		this.eElem[i].setHeight(h)
	}
	this.conf.width = w;
	this.conf.height = h
};
clsRef.prototype.edit = function() {
	using("dev.report.base.dlg.chart.EditChart");
	var chartEdit=dev.report.base.dlg.chart.EditChart("edit", this.conf.id);
};
clsRef.prototype.editType = function() {
	using("dev.report.base.dlg.chart.ChartType");
	var chartType=new dev.report.base.dlg.chart.ChartType("edit", this.conf.id);	
};
clsRef.prototype.editSourceData = function() {
	using("dev.report.base.dlg.chart.EditSourceData");
	var chart1=new dev.report.base.dlg.chart.EditSourceData("edit", this.conf.id);
};
clsRef.prototype.remove = function() {
	if (dev.report.backend.wss.wsel("delete_element", this.conf.id)) {
		for (var i = this._panes.length - 1, rzwrap; i >= 0; i--) {
			this.wrapperEl[i].remove();
			rzwrap = document.getElementById(this._panes[i]._domId.concat(
					"_wsel_cont_", this.conf.id, "-rzwrap-rzproxy"));
			if (rzwrap != null) {
				rzwrap.parentNode.removeChild(rzwrap)
			}
		}
		dev.report.base.wsel.wselRegistry.remove(this._book, this._sheet._uid,
				this.conf.id)
	} else {
		Ext.MessageBox.show({
					title : "Operation Error".localize(),
					msg : "chartDlg_deleteError".localize(),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				})
	}
};
clsRef.prototype.showContextMenu = function(e, paneId, pos) {
	if (this.isUserMode && !dev.report.base.app.isIE) {
		return
	}
	var contextMenu = new Ext.menu.Menu({
				id : "chartContextMenu",
				cls : "default-format-window",
				enableScrolling : false,
				listeners : {
					hide : function(menu) {
						menu.destroy()
					}
				},
				items : this.isUserMode ? [] : [{
							id : "wChartContext_edit_btn",
							text : "Change Chart Type".localize().concat("..."),
							iconCls : "icon_insert_chart",
							scope : this,
							handler : this.editType
						}, {
							id : "wChartContext_selSrcData_btn",
							text : "Select Source Data".localize()
									.concat("..."),
							iconCls : "chart_source_data",
							scope : this,
							handler : this.editSourceData
						}, {
							id : "wChartContext_format_btn",
							text : "Format Chart Properties".localize()
									.concat("..."),
							iconCls : "icon_edit",
							scope : this,
							handler : this.edit
						}, "-", new Ext.menu.Item({
									id : "wChartContext_bToFrnt_btn",
									text : "Bring to Front".localize(),
									iconCls : "ico_bring_to_front",
									disabled : this.conf.locked,
									menu : {
										items : [{
											id : "wChartContextSub_bToFrnt_btn",
											text : "Bring to Front".localize(),
											iconCls : "ico_bring_to_front",
											scope : this,
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.bringToFront(this.conf.id)
											}
										}, {
											id : "wChartContextSub_bFwd_btn",
											text : "Bring Forward".localize(),
											iconCls : "ico_bring_forward",
											scope : this,
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.bringForward(this.conf.id)
											}
										}]
									}
								}), new Ext.menu.Item({
									id : "wChartContext_sToBck_btn",
									text : "Send to Back".localize(),
									iconCls : "ico_send_to_back",
									disabled : this.conf.locked,
									menu : {
										items : [{
											id : "wChartContextSub_sToBck_btn",
											text : "Send to Back".localize(),
											iconCls : "ico_send_to_back",
											scope : this,
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.sendToBack(this.conf.id)
											}
										}, {
											id : "wChartContextSub_sBckwd_btn",
											text : "Send Backward".localize(),
											iconCls : "ico_send_backward",
											scope : this,
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.sendBackward(this.conf.id)
											}
										}]
									}
								}), {
							id : this.conf.locked
									? "wChartContext_unlock_btn"
									: "wChartContext_lock_btn",
							text : (this.conf.locked ? "Unlock" : "Lock")
									.localize(),
							iconCls : "icon_lock",
							scope : this,
							handler : function(item, e) {
								item.setText((this.conf.locked
										? "Lock"
										: "Unlock").localize());
								for (var i = this._panes.length - 1; i >= 0; i--) {
									this.setLock(!this.conf.locked, i, i)
								}
							}
						}, "-", {
							id : "wChartContext_del_btn",
							text : "Delete Chart".localize(),
							iconCls : "icon_delete",
							scope : this,
							handler : this.remove
						}]
			});
	if (dev.report.base.app.isIE) {
		contextMenu.insert(this.isUserMode ? 0 : 8, new Ext.menu.Item({
							id : "wChartContext_cpToClp_btn",
							text : "Copy to Clipboard".localize(),
							iconCls : "icon_copy",
							scope : this,
							handler : function() {
								this.copyToClipboard(paneId)
							}
						}))
	}
	var coords = e ? e.getXY() : (pos instanceof Array ? pos : [100, 100]);
	contextMenu.showAt([coords[0], coords[1]])
};
clsRef.prototype.setLock = function(locked, skipSave, paneId) {
	if (this.isUserMode) {
		return
	}
	locked = locked !== false;
	dev.report.base.wsel.setLock(this.conf.id, this.wrapper[paneId],
			this.resCont[paneId], locked, skipSave);
	this.conf.locked = locked
};
clsRef.prototype.getSize = function() {
	var paneId = this._sheet._aPane._id, wrpEl = this.wrapperEl[paneId]
			|| this.wrapper[paneId].getEl();
	return wrpEl.getSize(true)
};
clsRef.prototype.setPosition = function(nLoc, posOffs) {
	if (typeof nLoc == "string" & nLoc.length) {
		this.location = dev.report.base.wsel.getRngFromNLoc(nLoc)
	}
	if (posOffs instanceof Array && posOffs.length == 4) {
		this.offsets = posOffs
	}
};
clsRef = null;