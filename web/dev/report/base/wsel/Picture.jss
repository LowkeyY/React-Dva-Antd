Ext.namespace("dev.report.base.wsel");
using("dev.report.base.wsel.Base");
using("lib.Constrained.ResizableConstrained");
dev.report.base.wsel.Picture = (function() {
	var type = "Picture";
	return function(cb, imgId, elTop, elLeft, elWidth, elHeight, setLoc,
			zindex, locked) {
		var convObj = {}, hasCb = cb instanceof Array && cb.length > 1, dims = dev.report.base.wsel.Picture.dims;
		dev.report.base.wsel.Picture.parent.constructor.call(this, {
					id : imgId,
					name : name,
					type : type,
					zindex : zindex,
					locked : locked,
					top : elTop,
					left : elLeft,
					width : elWidth,
					height : elHeight,
					setLoc : setLoc,
					sheet : hasCb ? cb[0] : undefined
				});
		if (this.conf.id == null) {
			Ext.MessageBox.show({
						title : "Operation Error".localize(),
						msg : "imgDlg_genError".localize(),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			if (hasCb) {
				cb[1].apply(cb[0], cb.slice(2))
			}
			return
		}
		if (this.conf.name == undefined || !this.conf.name.length) {
			this.generateName();
			convObj.img_name = this.conf.name
		}
		if (this.conf.zindex == undefined) {
			this.conf.zindex = dev.report.base.wsel.wselRegistry.getZIndex();
			convObj.zindex = this.conf.zindex
		}else{
			convObj.zindex = this.conf.zindex
		}
		if (this.conf.locked == undefined) {
			this.conf.locked = dev.report.base.wsel.Picture.defLockedState;
			convObj.locked = this.conf.locked
		}else{
			convObj.locked = this.conf.locked
		}
		this.conf.zindex = parseInt(this.conf.zindex);
		this.conf.locked = (this.conf.locked && this.conf.locked !== "false" && this.conf.locked !== "FALSE");
		var currDate = new Date();
		this.resCont = [];
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
						src : "/dev/report/getimages.jcp?sess=".concat(
								dev.report.base.app.sess, "&buid=", this._book.uid,
								"&suid=", this._sheet.getUid(), "&t=img",
								"&id=", this.conf.id, "&type=content", "&ts=", currDate
										.getTime()),
						width : this.conf.width,
						height : this.conf.height,
						cls : ((this.conf.locked || this.isUserMode)
								? ("ws_element_locked")
								: "ws_element"),
						style : "z-index: ".concat(this.conf.zindex,
								"; position: absolute; left:", this.conf.left,
								"px; top:", this.conf.top, "px;")
					}, false);
						
			this.wrapper[i] = new lib.Constrained.ResizableConstrained(elContId, {
						wrap : !this.isUserMode,
						dynamic : !this.isUserMode,
						pinned : false,
						width : this.conf.width,
						height : this.conf.height,
						minWidth : dims.minW,
						maxWidth : this.elConstr[i].lrCornerPx[0],
						minHeight : dims.minH,
						maxHeight : this.elConstr[i].lrCornerPx[1],
						preserveRatio : true,
						defaultRatio : false,
						transparent : false,
						handles : (document.all && this.isUserMode)
								? "none"
								: "all",
						draggable : !this.isUserMode,
						enabled : !this.isUserMode,
						style : "background-color: white;",
						resizeRegion : Ext.get(gridDivId).getRegion(),
						_paneId : i
					});

			//this.setHlTooltip(i)

			if (!this.isUserMode) {
				
				this.wrapper[i].on({
							resize : {
								fn : this.afterResize,
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
				this.wrapperEl[i].dom.style.backgroundColor = "#FFFFFF";
				this.wrapperEl[i].dom.style.zIndex = this.conf.zindex;
				this.wrapperEl[i].on({
							mousedown : {
								fn : this.onImgMouseDown,
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
				var eHndls = {
					mousedown : {
						fn : this.onMouseDownUM,
						scope : this,
						options : {
							paneId : i
						}
					}
				};
				this.wrapper[i].getEl().on(eHndls)
			}
		}
		if (!this.conf.setLoc) {
			if (hasCb) {
				cb[1].apply(cb[0], cb.slice(2))
			}
			return
		}
		var nLoc = dev.report.base.wsel.getNLoc(this.conf.left, this.conf.top,
				this.conf.width, this.conf.height);
		convObj.pos_offsets = nLoc.pos_offsets;
		convObj.n_location = nLoc.n_location;
		if (nLoc.size) {
			convObj.size = nLoc.size
		}
		for (var conv in convObj) {
			if (hasCb && cb[0] instanceof dev.report.base.grid.Sheet) {
				cb[0].setInitConv(cb[2], true)
			}
			var updObj = {};
			updObj[this.conf.id] = convObj;
		
			if (hasCb) {
				cb[1].apply(cb[0], cb.slice(2))
			}  
			var img=new dev.report.model.XPicture(this.conf.id);
			img.size=[this.conf.width,this.conf.height];
			img.offset=convObj.pos_offsets;
			img.location=convObj.n_location;
			img.zindex=convObj.zindex;
			img.locked=convObj.locked;

			var table=dev.report.model.report.tabMap;
			table.addPicture(img);
			return
		}
		if (updObj == undefined && hasCb) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	}
})();
dev.report.util.extend(dev.report.base.wsel.Picture, dev.report.base.wsel.Base);
dev.report.base.wsel.Picture.defLockedState = false;
dev.report.base.wsel.Picture.dims = {
	minW : 10,
	minH : 10,
	maxW : 1600,
	maxH : 1050
};
clsRef = dev.report.base.wsel.Picture;
clsRef.prototype.onImgMouseDown = function(e, t, o) {
	this._env.shared.inputField.blur();
	if (!(e.button == 2
			|| (Ext.isMac && e.button == 0 && dev.report.base.app.ctrlKeyPressed) || (Ext.isWebKit && e.button == 1))) {
		(this._movedEl = e.browserEvent[document.all ? "srcElement" : "target"]).className = this.conf.locked
				? ("ws_element_locked")
				: "ws_element_move";
		if (this.conf.locked) {
			if (dev.report.base.app.activeBook.id != this._book.id) {
				dev.report.base.book.selectById(this._book.id)
			}
			if (dev.report.base.app.activePane._id != o.options.paneId) {
				this._panes[o.options.paneId].select()
			}
			return
		}
	}
	this.onMouseDown.call(this, e, t, o, this.onImgMouseUp)
};
clsRef.prototype.onImgMouseUp = function(e) {
	if (!this.handleElementMove) {
		return
	}
	var el = document.all ? e.srcElement : e.target, follHL = false;
	if ((!el.className || el.className.indexOf("ws_element_move") < 0)
			&& this._movedEl) {
		el = this._movedEl
	}
	el.className = this.conf.locked ? "ws_element_locked": "ws_element";
	this._movedEl = undefined;
	if (!this.conf.locked) {
		var size = this.getSize(), pos = this
				.getPosition(this._sheet._aPane._id), newLeft = pos[0], newTop = pos[1], elW = size.width, elH = size.height;
		if (e.altKey) {
			var newXY = dev.report.base.wsel.getSnapXY(newLeft, newTop, elW, elH);
			newLeft = newXY[0];
			newTop = newXY[1]
		}
		if ( !this.conf.locked && newLeft == this.conf.left
				&& newTop == this.conf.top) {
			follHL = true;
		}
	}
	this.onMouseUp.call(this, e, this.onImgMouseUp, follHL)
};
clsRef.prototype.edit = function() {
	using("dev.report.base.dlg.InsertPicture");
	var insertPicture=new dev.report.base.dlg.InsertPicture({
		id : this.conf.id,
		zindex : this.conf.zindex,
		locked : this.conf.locked
	});
	insertPicture.win.show();
};
clsRef.prototype.beforeResize = function(wrapper, e) {
	dev.report.base.app.activeWrapper = wrapper;
	if (e.shiftKey) {
		wrapper.preserveRatio = true
	}
};
clsRef.prototype.afterResize = function(wrapper, newWidth, newHeight, e) {
	var pRatio = wrapper.preserveRatio;
	if (dev.report.base.app.activeWrapper) {
		wrapper.preserveRatio = false;
		delete dev.report.base.app.activeWrapper
	}
	var wrapperEl = wrapper.getEl(), newLeft = wrapperEl.getLeft(true), newTop = wrapperEl
			.getTop(true), paneId = wrapper._paneId == undefined
			? this._sheet._aPane._id
			: wrapper._paneId, pane = this._panes[paneId], defMaxCoords = dev.report.base.grid.defMaxCoords, lrCornerPx = pane
			.getPixelsByCoords(defMaxCoords[0] + 1, defMaxCoords[1] + 1), badPS = false;
	if (newLeft < 0) {
		newWidth += newLeft;
		newLeft = 0;
		badPS = true
	}
	if (newTop < 0) {
		newHeight += newTop;
		newTop = 0;
		badPS = true
	}
	if (newLeft + newWidth > lrCornerPx[0]) {
		newWidth = lrCornerPx[0] - newLeft;
		badPS = true
	}
	if (newTop + newHeight > lrCornerPx[1]) {
		newHeight = lrCornerPx[1] - newTop;
		badPS = true
	}
	if (e.browserEvent.altKey) {
		var newPS = dev.report.base.wsel.getSnapXYandWH(this.conf.left,
				this.conf.top, this.conf.width, this.conf.height, newLeft,
				newTop, newWidth, newHeight, 3, pRatio);
		badPS = badPS || (newWidth != newPS[2]) || (newHeight != newPS[3]);
		newLeft = newPS[0];
		newTop = newPS[1];
		newWidth = newPS[2];
		newHeight = newPS[3];
		badPS = badPS || (this.conf.left != newLeft)
				|| (this.conf.top != newTop)
	}
	this.conf.left = newLeft;
	this.conf.top = newTop;
	for (var i = this.elConstr.length - 1; i >= 0; i--) {
		if (this.conf.width != newWidth) {
			this.elConstr[i].right += this.conf.width - newWidth
		}
		if (this.conf.height != newHeight) {
			this.elConstr[i].down += this.conf.height - newHeight
		}
	}
	this.conf.width = newWidth;
	this.conf.height = newHeight;
	if (badPS) {
		this.setPositionSize({
					left : this.conf.left,
					top : this.conf.top,
					width : newWidth,
					height : newHeight
				}, paneId)
	} else {
		for (var i = this._panes.length - 1; i >= 0; i--) {
			if (i != paneId) {
				wrpEl = this.wrapperEl[i];
				Ext.get(this.resCont[i]).setSize(this.conf.width,
						this.conf.height);
				wrpEl.setSize(this.conf.width, this.conf.height);
				wrpEl.dom.style.left = "".concat(this.conf.left, "px");
				wrpEl.dom.style.top = "".concat(this.conf.top, "px")
			}
		}
		var conn = dev.report.backend, imgData = {};
		imgData[this.conf.id] = dev.report.base.wsel.getNLoc(this.conf.left,
				this.conf.top, newWidth, newHeight);
		imgData[this.conf.id].size = [newWidth, newHeight];
		var table=dev.report.model.report.tabMap;
		var picture=table.getPicture(this.conf.id);
		picture.size=[newWidth, newHeight];
	}
};
clsRef.prototype.setPositionSize = function(newDims, paneId) {
	if (paneId == undefined) {
		paneId = this._sheet._aPane._id
	}
	var wrpEl = this.wrapperEl[paneId], newL = newDims.left, newT = newDims.top;
	newW = newDims.width, newH = newDims.height;
	if (this.conf.left != newL || this.conf.top != newT
			|| wrpEl.getWidth(true) != newW || wrpEl.getHeight(true) != newH) {
		for (var i = this._panes.length - 1; i >= 0; i--) {
			wrpEl = this.wrapperEl[i];
			Ext.get(this.resCont[i]).setSize(newW, newH);
			wrpEl.setSize(newW, newH);
			wrpEl.dom.style.left = "".concat(newL, "px");
			wrpEl.dom.style.top = "".concat(newT, "px")
		}
		this.conf.left = newL;
		this.conf.top = newT;
		var imgData = {};
		imgData[this.conf.id] = dev.report.base.wsel.getNLoc(newL, newT, newW, newH);
		var table=dev.report.model.report.tabMap;
		var picture=table.getPicture(this.conf.id);
		picture.size=[newW, newH];
	}
};
clsRef.prototype.getPropsData = function() {
	var wrpEl = this.wrapperEl[this._sheet._aPane._id], props = {
		scope : this,
		psHnd : this.setPositionSize,
		w : wrpEl.getWidth(true),
		h : wrpEl.getHeight(true),
		t : parseInt(wrpEl.dom.style.top.replace(/px/i, "")),
		l : parseInt(wrpEl.dom.style.left.replace(/px/i, ""))
	};
	return props
};
clsRef.prototype.remove = function(presOnly) {
	var cbRemove = function(res) {
		if (res instanceof Array && (res = res[0]) instanceof Array
				&& res[0] === true) {
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
						msg : "imgDlg_deleteError".localize(),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
			})
		}
	};
	if (presOnly === true) {
		cbRemove.call(this, [[true]])
	} else {
		var table=dev.report.model.report.tabMap;
		table.removePicture(this.conf.id);
		cbRemove.call(this, [[true]]);
	}
};
clsRef.prototype.showContextMenu = function(e, paneId, pos) {
	if (this.isUserMode && !dev.report.base.app.isIE) {
		return
	}
	var contextMenu = new Ext.menu.Menu({
				items : this.isUserMode ? [] : [{
							id : "wPictureContext_edit_btn",
							text : "Edit Picture".localize().concat("..."),
							iconCls : "icon_edit",
							scope : this,
							handler : this.edit
						}, "-", new Ext.menu.Item({
									id : "wPictureContext_bToFrnt_btn",
									text : "Bring to Front".localize(),
									iconCls : "ico_bring_to_front",
									disabled : this.conf.locked,
									menu : {
										items : [{
											id : "wPictureContextSub_bToFrnt_btn",
											text : "Bring to Front".localize(),
											iconCls : "ico_bring_to_front",
											scope : this,
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.bringToFront(this.conf.id)
											}
										}, {
											id : "wPictureContextSub_bFwd_btn",
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
									id : "wPictureContext_sToBck_btn",
									text : "Send to Back".localize(),
									iconCls : "ico_send_to_back",
									disabled : this.conf.locked,
									menu : {
										items : [{
											id : "wPictureContextSub_sToBack_btn",
											text : "Send to Back".localize(),
											iconCls : "ico_send_to_back",
											scope : this,
											handler : function() {
												dev.report.base.wsel.wselRegistry
														.sendToBack(this.conf.id)
											}
										}, {
											id : "wPictureContextSub_sBckwd_btn",
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
									? "wPictureContext_unlock_btn"
									: "wPictureContext_lock_btn",
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
							id : "wPictureContext_del_btn",
							text : "Delete Picture".localize(),
							iconCls : "icon_delete",
							scope : this,
							handler : this.remove
						},{
							id : "wPictureContext_prop_btn",
							text : "Properties".localize(),
							iconCls : "icon_edit",
							scope : this,
							handler : function() {
								using("dev.report.base.dlg.PictureProperties");
								var picProp=new dev.report.base.dlg.PictureProperties(this.getPropsData());
								picProp.win.show();
							}
						}],
				enableScrolling : false,
				cls : "default-format-window",
				listeners : {
					hide : function(menu) {
						menu.destroy()
					}
				}
			});
	if (dev.report.base.app.isIE) {
		contextMenu.insert(this.isUserMode ? 0 : 6, new Ext.menu.Item({
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
	this.conf.locked = locked;
	if (this.conf.locked) {
		this.resCont[paneId].className = "ws_element_locked_hyperlink";
		var wrapper = this.wrapper[paneId];
		wrapper.east.el.dom.style.cursor = "pointer";
		wrapper.west.el.dom.style.cursor = "pointer";
		wrapper.north.el.dom.style.cursor = "pointer";
		wrapper.south.el.dom.style.cursor = "pointer";
		wrapper.southeast.el.dom.style.cursor = "pointer";
		wrapper.southwest.el.dom.style.cursor = "pointer";
		wrapper.northeast.el.dom.style.cursor = "pointer";
		wrapper.northwest.el.dom.style.cursor = "pointer"
	}
	var table=dev.report.model.report.tabMap;
	var picture=table.getPicture(this.conf.id);
	picture.locked=this.conf.locked ;
};
clsRef.prototype.getSize = function() {
	var paneId = this._sheet._aPane._id, wrpEl = this.wrapperEl[paneId]
			|| this.wrapper[paneId].getEl();
	return wrpEl.getSize(true)
};
clsRef.prototype.setHlTooltip = function(paneId) {
	var imgElem = Ext.get(this.resCont[paneId]), wrapper = this.wrapper[paneId], act = this.conf.hl
			? "on"
			: "un", tipSet = this.hlTtipSet, tipRemove = this.hlTtipRemove;
	imgElem[act]("mouseenter", tipSet, this);
	imgElem[act]("mouseleave", tipRemove, this);
	if (!this.isUserMode) {
		wrapper.east.el[act]("mouseenter", tipSet, this);
		wrapper.east.el[act]("mouseleave", tipRemove, this);
		wrapper.west.el[act]("mouseenter", tipSet, this);
		wrapper.west.el[act]("mouseleave", tipRemove, this);
		wrapper.north.el[act]("mouseenter", tipSet, this);
		wrapper.north.el[act]("mouseleave", tipRemove, this);
		wrapper.south.el[act]("mouseenter", tipSet, this);
		wrapper.south.el[act]("mouseleave", tipRemove, this);
		wrapper.southeast.el[act]("mouseenter", tipSet, this);
		wrapper.southeast.el[act]("mouseleave", tipRemove, this);
		wrapper.southwest.el[act]("mouseenter", tipSet, this);
		wrapper.southwest.el[act]("mouseleave", tipRemove, this);
		wrapper.northeast.el[act]("mouseenter", tipSet, this);
		wrapper.northeast.el[act]("mouseleave", tipRemove, this);
		wrapper.southwest.el[act]("mouseenter", tipSet, this);
		wrapper.southwest.el[act]("mouseleave", tipRemove, this)
	}
};
clsRef.prototype.hlTtipSet = function(ev, evTarget, optObj) {
	ev.clientX = ev.getPageX();
	ev.clientY = ev.getPageY();
	Jedox.wss.hl.setToolTip(ev.browserEvent, this.conf.hl, true)
};
clsRef.prototype.hlTtipRemove = function(ev, evTarget, optObj) {
	ev.clientX = ev.getPageX();
	ev.clientY = ev.getPageY();
	Jedox.wss.hl.setToolTip(ev.browserEvent, this.conf.hl, false)
};
clsRef = null;