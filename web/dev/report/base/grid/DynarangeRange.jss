
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.DynarangeRange = (function() {
	var constants = {
		DIRECTION : {
			VERT : 0,
			HORIZ : 1,
			TITLE : 2,
			COLUMNHEADER : 3,
			COLUMNFOOTER : 4,
			SUMMARY : 5,
			GROUPHEADER : 6,
			GROUPFOOTER : 7
		}
	}, gpOffset = 7, gpOffsetBorder = [[0, gpOffset], [0, -gpOffset],
			[gpOffset, 0], [-gpOffset, 0]], gpOffsetEdge = [
			[-gpOffset, -gpOffset], [gpOffset, -gpOffset],
			[-gpOffset, gpOffset], [gpOffset, gpOffset]];
	return function(selection, startPoint, endPoint, props) {
		dev.report.base.grid.DynarangeRange.parent.constructor.call(this, selection,
				startPoint, endPoint);
		this._mode = dev.report.base.range.RangeMode.EDIT;
		this._props = props;
		this._propsPrev = (props.wselid == undefined) ? null : Ext.ux
				.clone(props);
		this._cntrlElems = [];
		this._expDir = props.dir;
		this.getConstant = function(name) {
			return constants[name]
		};
		var that = this, panesLen = this._panes.length, htmlEl, htmlElCp;
		for (var i = panesLen - 1; i >= 0; i--) {
			this._cntrlElems[i] = {}
		}
		for (var clsName = "HBRangeBorder", i = 3; i >= 0; --i) {
			htmlEl = document.createElement("div");
			htmlEl.className = clsName;
			for (var j = panesLen - 1; j >= 0; j--) {
				htmlElCp = j > 0 ? htmlEl.cloneNode(true) : htmlEl;
				htmlElCp.idx = i;
				dev.report.util.addEvent(htmlElCp, "mousedown", function(ev) {
					if (document.all) {
						ev = window.event
					}
					var elem = document.all ? ev.srcElement : ev.target;
					if (that.chkRightClick.call(that, ev)) {
						that._environment.shared.gridPosOffset = gpOffsetBorder[elem.idx];
						that._onmousedown(ev)
					}
				}, false);
				dev.report.util.addEvent(htmlElCp, "mouseup", function(ev) {
							that._environment.shared.gridPosOffset = [0, 0];
							that._onmouseup(ev)
						}, false);
				dev.report.util.addEvent(htmlElCp, "mousemove", function(ev) {
							that._onmousemove(ev)
						}, false);
				dev.report.util.addEvent(htmlElCp, "mouseout", function(ev) {
							that._onmouseout(ev)
						}, false);
				this._edgeElems[j][i] = htmlElCp;
				this._containers[j].appendChild(htmlElCp)
			}
		}
		for (var clsName = "HBRangeEdge", i = 3; i >= 0; --i) {
			htmlEl = document.createElement("div");
			htmlEl.className = clsName;
			this._addCursor(htmlEl, i);
			for (var j = panesLen - 1; j >= 0; j--) {
				htmlElCp = j > 0 ? htmlEl.cloneNode(true) : htmlEl;
				htmlElCp.idx = i;
				htmlElCp._paneId = j;
				dev.report.util.addEvent(htmlElCp, "mousedown", function(ev) {
					if (document.all) {
						ev = window.event
					}
					var elem = document.all ? ev.srcElement : ev.target;
					dev.report.base.mouse.calcGridScreenCoords(ev, elem, [0, 0],
							that._sheet._panes[elem._paneId]);
					if (that.chkRightClick.call(that, ev)) {
						that._environment.shared.gridPosOffset = gpOffsetEdge[elem.idx];
						that._mouseOnEdgeDown(ev)
					}
				}, false);
				dev.report.util.addEvent(htmlElCp, "mouseup", function(ev) {
							that._environment.shared.gridPosOffset = [0, 0];
							that._mouseOnEdgeUp(ev, true)
						}, false);
				dev.report.util.addEvent(htmlElCp, "mouseover", function(ev) {
							that._mouseOnEdge(ev)
						}, false);
				dev.report.util.addEvent(htmlElCp, "mouseout", function(ev) {
							that._mouseOffEdge(ev)
						}, false);
				this._cornerElems[j][i] = htmlElCp;
				this._containers[j].appendChild(htmlElCp)
			}
		}
		var propsEl = document.createElement("div"), propsElCp;
		propsEl.className = "HBProps";
		var dirArrowEl = document.createElement("div"), dirArrowElCp;
		dirArrowEl.id = "dirArrowCont";
		dirArrowEl.className = "HBDirArrCont";
		for (j = panesLen - 1; j >= 0; j--) {
			propsElCp = j > 0 ? propsEl.cloneNode(true) : propsEl;
			dev.report.util.addEvent(propsElCp, "mousedown", function(ev) {
						if (that.chkRightClick.call(that, ev)) {
							that._openPropDlg(ev)
						}
					}, false);
			dev.report.util.addEvent(propsElCp, "mouseover", function(ev) {
						that._propsBtnMouseOver(ev)
					}, false);
			dirArrowElCp = j > 0 ? dirArrowEl.cloneNode(true) : dirArrowEl;
			/*dev.report.util.addEvent(dirArrowElCp, "dblclick", function(ev) {
						that._dirSwitchMouseDown(true)
					}, false);*/
			dev.report.util.addEvent(dirArrowElCp, "mousedown", function(ev) {
				if (that.chkRightClick.call(that, ev)) {
					that._environment.shared.gridPosOffset = gpOffsetBorder[that._expDir == constants.DIRECTION.VERT
							? 2
							: 0];
					that._dirArrowMouseDown(ev)
				}
			}, false);
			dev.report.util.addEvent(dirArrowElCp, "mouseup", function(ev) {
						that._environment.shared.gridPosOffset = [0, 0]
					}, false);
			dev.report.util.addEvent(dirArrowElCp, "mousemove", function(ev) {
						that._onmousemove(ev)
					}, false);
			dev.report.util.addEvent(dirArrowElCp, "mouseout", function(ev) {
						that._onmouseout(ev)
					}, false);
			this._cntrlElems[j].props = propsElCp;
			this._containers[j].appendChild(propsElCp);
			this._cntrlElems[j].dirArrow = dirArrowElCp;
			this._containers[j].appendChild(dirArrowElCp);

			this._cntrlElems[j].arrCanvas = new jsGraphics(dirArrowElCp);
		}
		var selCellCoords = (props.dcell == undefined)
				? this._environment.shared.selectedCellCoords
				: [props.src[0] + props.dcell[0], props.src[1] + props.dcell[1]];
		var dataCellPos = new dev.report.gen.Point(selCellCoords[0],
				selCellCoords[1]);
		this.draw(false);
		if (props.wselid == undefined) {
			this.save()
		}
	}
})();
dev.report.util.extend(dev.report.base.grid.DynarangeRange, dev.report.base.grid.Range);
clsRef = dev.report.base.grid.DynarangeRange;
clsRef.prototype.chkRightClick = function(ev) {
	if (document.all) {
		ev = window.event
	}
	if (ev.button == 2
			|| (Ext.isMac && ev.button == 0 && dev.report.base.app.ctrlKeyPressed)) {
		this._selection.setMode(dev.report.base.range.RangeMode.EDIT);
		this.showCntxMenu(ev);
		return false
	} else {
		return true
	}
};
clsRef.prototype.showCntxMenu = function(ev) {
	var that = this, cntxMenu = new Ext.menu.Menu({
				id : "wDRange_context_mn",
				cls : "default-format-window",
				enableScrolling : false,
				listeners : {
					hide : function(menu) {
						menu.destroy()
					}
				},
				items : [/*{
							id : "wDRange_switchDirection_btn",
							text : "Switch Direction".localize(),
							iconCls : "hb_switch_dir",
							handler : function(item, ev) {
								that._dirSwitchMouseDown.call(that, true)
							}
						},*/ {
							id : "wDRange_delete_btn",
							text : "Delete".localize(),
							iconCls : "icon_delete",
							handler : function() {
								dev.report.base.hb.delDynarange(that._props.id)
							}
						}/*, "-", {
							id : "wDRange_properties_btn",
							text : "Properties".localize().concat("..."),
							iconCls : "hb_properties",
							handler : function(item, ev) {
								that._openPropDlg.call(that, ev.browserEvent)
							}
						}*/]
			});
	cntxMenu.showAt([ev.clientX, ev.clientY])
};
clsRef.prototype.getOffsetsPx = function(useragent) {
	var offsets = [];
	switch (useragent) {
		case "ff" :
			offsets = [{
						left : 0,
						top : -6,
						width : 0,
						height : 0,
						propsTop : 2,
						propsLeft : 3,
						dirArrTop : -6,
						dirArrHeight : 8
					}, {
						left : 1,
						top : -2,
						width : 0,
						height : 0
					}, {
						left : -6,
						top : 0,
						width : 0,
						height : 0,
						dirArrLeft : -6,
						dirArrWidth : 8
					}, {
						left : -1,
						top : 0,
						width : 0,
						height : 0
					}];
			break;
		case "sf" :
			offsets = [{
						left : 0,
						top : -6,
						width : 0,
						height : 0,
						propsTop : 2,
						propsLeft : 3,
						dirArrTop : -6,
						dirArrHeight : 8
					}, {
						left : 1,
						top : -2,
						width : 0,
						height : 0
					}, {
						left : -6,
						top : 0,
						width : 0,
						height : 0,
						dirArrLeft : -6,
						dirArrWidth : 8
					}, {
						left : -1,
						top : 0,
						width : 0,
						height : 0
					}];
			break;
		case "ie" :
			offsets = [{
						left : 0,
						top : -6,
						width : 0,
						height : 0,
						propsTop : 2,
						propsLeft : 3,
						dirArrTop : -6,
						dirArrHeight : 8
					}, {
						left : 1,
						top : -2,
						width : 0,
						height : 0
					}, {
						left : -6,
						top : 0,
						width : 0,
						height : 0,
						dirArrLeft : -6,
						dirArrWidth : 8
					}, {
						left : -1,
						top : 0,
						width : 0,
						height : 0
					}];
			break;
		case "ch" :
			offsets = [{
						left : 0,
						top : -6,
						width : 0,
						height : 0,
						propsTop : 2,
						propsLeft : 3,
						dirArrTop : -6,
						dirArrHeight : 8
					}, {
						left : 1,
						top : -2,
						width : 0,
						height : 0
					}, {
						left : -6,
						top : 0,
						width : 0,
						height : 0,
						dirArrLeft : -6,
						dirArrWidth : 8
					}, {
						left : -1,
						top : 0,
						width : 0,
						height : 0
					}];
			break;
		default :
			offsets = [{
						left : 0,
						top : 0,
						width : 0,
						height : 0
					}, {
						left : 0,
						top : 0,
						width : 0,
						height : 0
					}, {
						left : 0,
						top : 0,
						width : 0,
						height : 0
					}, {
						left : 0,
						top : 0,
						width : 0,
						height : 0
					}];
			console.warn("Unkown user agent: ", useragent)
	}
	return offsets
};
clsRef.prototype.draw = function(setHdr) {
	if (this._status == dev.report.base.range.AreaStatus.EXPANDING) {
		return
	}
	var ulOffset = 1, lrOffset = 1, pxCoords;
	this._realCoords = this.getCorners();
	if ((this._ulCell = this._pane.getCellByCoords(this._realCoords[0].getX(),
			this._realCoords[0].getY())) == undefined) {
		pxCoords = this._pane.getPixelsByCoords(this._realCoords[0].getX(),
				this._realCoords[0].getY());
		this._ulCorner.setX(pxCoords[0] - ulOffset);
		this._ulCorner.setY(pxCoords[1] - ulOffset)
	} else {
		this._ulCorner.setX(this._ulCell.offsetLeft - ulOffset);
		this._ulCorner.setY(this._ulCell.parentNode.offsetTop - ulOffset)
	}
	if ((this._lrCell = this._pane.getCellByCoords(this._realCoords[1].getX(),
			this._realCoords[1].getY())) == undefined) {
		pxCoords = this._pane.getPixelsByCoords(this._realCoords[1].getX() + 1,
				this._realCoords[1].getY() + 1);
		this._lrCorner.setX(pxCoords[0]);
		this._lrCorner.setY(pxCoords[1] + lrOffset)
	} else {
		this._lrCorner.setX(this._lrCell.offsetLeft + this._lrCell.offsetWidth);
		this._lrCorner.setY(this._lrCell.parentNode.offsetTop
				+ this._lrCell.offsetHeight + lrOffset)
	}
	this._drawRect(6);
	this._setBorder();
	this._drawCorners();
	this._drawControls();
	if (setHdr == undefined) {
		this._selection._selectionChanged = true;
		this._selection.checkForUndoneMarkers()
	}
};
clsRef.prototype._drawCorners = function() {
	var offsets = [];
	switch (dev.report.base.app.browser) {
		case "ff" :
			offsets = [{
						xpos : 0,
						ypos : -1
					}, {
						xpos : 6,
						ypos : -1
					}, {
						xpos : 0,
						ypos : 6
					}, {
						xpos : 6,
						ypos : 6
					}];
			break;
		case "sf" :
			offsets = [{
						xpos : 0,
						ypos : -1
					}, {
						xpos : 6,
						ypos : -1
					}, {
						xpos : 0,
						ypos : 6
					}, {
						xpos : 6,
						ypos : 6
					}];
			break;
		case "ie" :
			offsets = [{
						xpos : 0,
						ypos : -1
					}, {
						xpos : 6,
						ypos : -1
					}, {
						xpos : 0,
						ypos : 6
					}, {
						xpos : 6,
						ypos : 6
					}];
			break;
		case "ch" :
			offsets = [{
						xpos : 0,
						ypos : -1
					}, {
						xpos : 6,
						ypos : -1
					}, {
						xpos : 0,
						ypos : 6
					}, {
						xpos : 6,
						ypos : 6
					}];
			break;
		default :
			offsets = [{
						xpos : 0,
						ypos : -1
					}, {
						xpos : 6,
						ypos : -1
					}, {
						xpos : 0,
						ypos : 6
					}, {
						xpos : 6,
						ypos : 6
					}];
			console.warn("Unkown user agent: ", useragent)
	}
	for (var xpos, ypos, i = this._cornerElems[0].length - 1; i >= 0; i--) {
		switch (i) {
			case 0 :
				xpos = this._lrCorner.getX() + offsets[0].xpos;
				ypos = this._lrCorner.getY() + offsets[0].ypos;
				break;
			case 1 :
				xpos = this._ulCorner.getX() - offsets[1].xpos;
				ypos = this._lrCorner.getY() + offsets[1].ypos;
				break;
			case 2 :
				xpos = this._lrCorner.getX() + offsets[2].xpos;
				ypos = this._ulCorner.getY() - offsets[2].ypos;
				break;
			case 3 :
				xpos = this._ulCorner.getX() - offsets[3].xpos;
				ypos = this._ulCorner.getY() - offsets[3].ypos;
				break
		}
		for (var j = this._cornerElems.length - 1; j >= 0; j--) {
			this._cornerElems[j][i].style.left = "".concat(xpos, "px");
			this._cornerElems[j][i].style.top = "".concat(ypos, "px");
			this._cornerElems[j][i].style.display = "block"
		}
	}
};
clsRef.prototype._drawRect = function(brdSize) {
	var offsets = this.getOffsetsPx(dev.report.base.app.browser);
	if (brdSize == undefined) {
		brdSize = 5
	}
	for (var i = this._edgeElems.length - 1; i >= 0; i--) {
		this._edgeElems[i][0].style.left = "".concat(this._ulCorner.getX()
						+ offsets[0].left, "px");
		this._edgeElems[i][0].style.top = "".concat(this._ulCorner.getY()
						+ offsets[0].top, "px");
		this._edgeElems[i][0].style.width = "".concat(this._lrCorner.getX()
						- this._ulCorner.getX() + offsets[0].width, "px");
		this._edgeElems[i][0].style.height = "".concat(brdSize
						+ offsets[0].height, "px");
		this._edgeElems[i][0].style.borderBottom = "2px Solid #000000";
		this._edgeElems[i][0].style.display = "block";
		this._edgeElems[i][1].style.left = "".concat(this._ulCorner.getX()
						+ offsets[1].left, "px");
		this._edgeElems[i][1].style.top = "".concat(this._lrCorner.getY()
						+ offsets[1].top, "px");
		this._edgeElems[i][1].style.width = "".concat(this._lrCorner.getX()
						- this._ulCorner.getX() + offsets[1].width, "px");
		this._edgeElems[i][1].style.height = "".concat(brdSize
						+ offsets[1].height, "px");
		this._edgeElems[i][1].style.borderTop = "2px solid #000000";
		this._edgeElems[i][1].style.display = "block";
		this._edgeElems[i][2].style.left = "".concat(this._ulCorner.getX()
						+ offsets[2].left, "px");
		this._edgeElems[i][2].style.top = "".concat(this._ulCorner.getY()
						+ offsets[2].top, "px");
		this._edgeElems[i][2].style.width = "".concat(brdSize
						+ offsets[2].width, "px");
		this._edgeElems[i][2].style.height = "".concat(this._lrCorner.getY()
						- this._ulCorner.getY() + offsets[2].height, "px");
		this._edgeElems[i][2].style.borderRight = "2px solid #000000";
		this._edgeElems[i][2].style.display = "block";
		this._edgeElems[i][3].style.left = "".concat(this._lrCorner.getX()
						+ offsets[3].left, "px");
		this._edgeElems[i][3].style.top = "".concat(this._ulCorner.getY()
						+ offsets[3].top, "px");
		this._edgeElems[i][3].style.width = "".concat(brdSize
						+ offsets[3].width, "px");
		this._edgeElems[i][3].style.height = "".concat(this._lrCorner.getY()
						- this._ulCorner.getY() + offsets[3].height, "px");
		this._edgeElems[i][3].style.borderLeft = "2px solid #000000";
		this._edgeElems[i][3].style.display = "block"
	}
};
clsRef.prototype._drawControls = function() {
	var offsets = this.getOffsetsPx(dev.report.base.app.browser);
	for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
		this._cntrlElems[i].props.style.left = "".concat(this._ulCorner.getX()
						+ offsets[0].propsLeft, "px");
		this._cntrlElems[i].props.style.top = "".concat(this._ulCorner.getY()
						+ offsets[0].propsTop, "px");
		this._cntrlElems[i].props.style.display = "block"
	}
	this._drawDirArrow(offsets)
};
clsRef.prototype._drawDirArrow = function(offsets) {
	if (offsets == undefined) {
		offsets = this.getOffsetsPx(dev.report.base.app.browser)
	}
	if (this._expDir == this.getConstant("DIRECTION").VERT) {
		var dirArrHeight = this._lrCorner.getY() - this._ulCorner.getY()
				+ offsets[2].height;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[2].dirArrLeft, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[2].top, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(6
							+ offsets[2].dirArrWidth, "px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(dirArrHeight,
					"px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#455B87");
			this._cntrlElems[i].arrCanvas.fillRect(4, 0, 5, dirArrHeight - 15);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(0, 12, 6),
					new Array(dirArrHeight - 15, dirArrHeight - 15,
							dirArrHeight));
			this._cntrlElems[i].arrCanvas.paint()
		}
	} else if (this._expDir == this.getConstant("DIRECTION").HORIZ) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#455B87");
			this._cntrlElems[i].arrCanvas.fillRect(0, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}else if (this._expDir == this.getConstant("DIRECTION").TITLE) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#455B87");
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(
									15,15,0),
					new Array(0,12,6));  
			this._cntrlElems[i].arrCanvas.fillRect(15, 4, dirArrWidth/2 -40, 5);
			this._cntrlElems[i].arrCanvas.setFont("arial","12px",Font.BOLD);
			this._cntrlElems[i].arrCanvas.drawString("表标题区",dirArrWidth/2-20,0);
			this._cntrlElems[i].arrCanvas.fillRect(dirArrWidth/2 +40, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}else if (this._expDir == this.getConstant("DIRECTION").COLUMNHEADER) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#455B87");
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(
									15,15,0),
					new Array(0,12,6));  
			this._cntrlElems[i].arrCanvas.fillRect(15, 4, dirArrWidth/2 -40, 5);
			this._cntrlElems[i].arrCanvas.setFont("arial","12px",Font.BOLD);
			this._cntrlElems[i].arrCanvas.drawString("列标题区",dirArrWidth/2-20,0);
			this._cntrlElems[i].arrCanvas.fillRect(dirArrWidth/2 +40, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}else if (this._expDir == this.getConstant("DIRECTION").COLUMNFOOTER) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#455B87");
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(
									15,15,0),
					new Array(0,12,6));  
			this._cntrlElems[i].arrCanvas.fillRect(15, 4, dirArrWidth/2 -40, 5);
			this._cntrlElems[i].arrCanvas.setFont("arial","12px",Font.BOLD);
			this._cntrlElems[i].arrCanvas.drawString("列汇总区",dirArrWidth/2-20,0);
			this._cntrlElems[i].arrCanvas.fillRect(dirArrWidth/2 +40, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}else if (this._expDir == this.getConstant("DIRECTION").SUMMARY) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#455B87");
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(
									15,15,0),
					new Array(0,12,6));  
			this._cntrlElems[i].arrCanvas.fillRect(15, 4, dirArrWidth/2 -40, 5);
			this._cntrlElems[i].arrCanvas.setFont("arial","12px",Font.BOLD);
			this._cntrlElems[i].arrCanvas.drawString("表汇总区",dirArrWidth/2-20,0);
			this._cntrlElems[i].arrCanvas.fillRect(dirArrWidth/2 +40, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}else if (this._expDir == this.getConstant("DIRECTION").GROUPHEADER) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#00FF00");
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(
									15,15,0),
					new Array(0,12,6));  
			this._cntrlElems[i].arrCanvas.fillRect(15, 4, dirArrWidth/2 -40, 5);
			this._cntrlElems[i].arrCanvas.setFont("arial","12px",Font.BOLD);
			this._cntrlElems[i].arrCanvas.drawString("Group Header Range".localize(),dirArrWidth/2-20,0);
			this._cntrlElems[i].arrCanvas.fillRect(dirArrWidth/2 +40, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}else if (this._expDir == this.getConstant("DIRECTION").GROUPFOOTER) {
		var dirArrWidth = this._lrCorner.getX() - this._ulCorner.getX()
				+ offsets[0].width;
		for (var i = this._cntrlElems.length - 1; i >= 0; i--) {
			this._cntrlElems[i].dirArrow.style.left = "".concat(this._ulCorner
							.getX()
							+ offsets[0].left, "px");
			this._cntrlElems[i].dirArrow.style.top = "".concat(this._ulCorner
							.getY()
							+ offsets[0].dirArrTop, "px");
			this._cntrlElems[i].dirArrow.style.width = "".concat(dirArrWidth,
					"px");
			this._cntrlElems[i].dirArrow.style.height = "".concat(6
							+ offsets[0].dirArrHeight, "px");
			this._cntrlElems[i].dirArrow.style.display = "block";
			this._cntrlElems[i].arrCanvas.clear();
			this._cntrlElems[i].arrCanvas.setColor("#00FF00");
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(
									15,15,0),
					new Array(0,12,6));  
			this._cntrlElems[i].arrCanvas.fillRect(15, 4, dirArrWidth/2 -40, 5);
			this._cntrlElems[i].arrCanvas.setFont("arial","12px",Font.BOLD);
			this._cntrlElems[i].arrCanvas.drawString("Group Footer Range".localize(),dirArrWidth/2-20,0);
			this._cntrlElems[i].arrCanvas.fillRect(dirArrWidth/2 +40, 4, dirArrWidth - 15, 5);
			this._cntrlElems[i].arrCanvas.fillPolygon(new Array(dirArrWidth
									- 15, dirArrWidth - 15, dirArrWidth),
					new Array(0, 12, 6));
			this._cntrlElems[i].arrCanvas.paint()
		}
	}
};
clsRef.prototype._dirArrowMouseDown = function(ev) {
	if (document.all) {
		ev = window.event
	}
	var mouseEl = (document.all) ? ev.srcElement : ev.target, rngMode = dev.report.base.range.RangeMode, offsets = [
			0, 0];
	if (mouseEl.id != "dirArrowCont") {
		offsets = [mouseEl.offsetLeft, mouseEl.offsetTop];
		while (mouseEl.id != "dirArrowCont") {
			mouseEl = mouseEl.parentNode
		}
	}
	if (this._mode == rngMode.NONE) {
		this._selection.setMode(rngMode.EDIT)
	}
	dev.report.base.mouse.calcGridScreenCoords(ev, mouseEl, offsets);
	this._onmousedown(ev)
};
clsRef.prototype.switchMode = function(mode) {
	var rngMode = dev.report.base.range.RangeMode;
	this._mode = mode;
	switch (mode) {
		case rngMode.NONE :
			this.setNormalMode();
			break;
		case rngMode.EDIT :
			this.setEditMode();
			break;
		case rngMode.HIDDEN :
			this.setHiddenMode()
	}
};
clsRef.prototype.setNormalMode = function() {
	var i, j;
	for (i = this._cornerElems.length - 1; i >= 0; i--) {
		for (j = this._cornerElems[i].length - 1; j >= 0; j--) {
			this._cornerElems[i][j].style.zIndex = "38";
			this._cornerElems[i][j].style.display = "none"
		}
	}
	for (i = this._edgeElems.length - 1; i >= 0; i--) {
		for (j = this._edgeElems[i].length - 1; j >= 0; j--) {
			this._edgeElems[i][j].style.zIndex = "38";
			this._edgeElems[i][j].style.backgroundImage = "none";
			this._edgeElems[i][j].style.backgroundColor = "transparent";
			this._edgeElems[i][j].style.display = "block"
		}
	}
	for (i = this._cntrlElems.length - 1; i >= 0; i--) {
		this._cntrlElems[i].dirArrow.style.zIndex = "40";
		this._cntrlElems[i].props.style.zIndex = "41";
		this._cntrlElems[i].props.style.display = "none";
		this._cntrlElems[i].dirArrow.style.display = "block"
	}
};
clsRef.prototype.setEditMode = function() {
	var i, j;
	for (i = this._cornerElems.length - 1; i >= 0; i--) {
		for (j = this._cornerElems[i].length - 1; j >= 0; j--) {
			this._cornerElems[i][j].style.zIndex = "42";
			this._cornerElems[i][j].style.display = "block"
		}
	}
	for (i = this._edgeElems.length - 1; i >= 0; i--) {
		for (j = this._edgeElems[i].length - 1; j >= 0; j--) {
			this._edgeElems[i][j].style.zIndex = "42";
			this._edgeElems[i][j].style.backgroundImage = "url(/dev/report/res/img/borders/hb_horizontal_normal.gif)";
			this._edgeElems[i][j].style.backgroundColor = "#FFFFFF"
		}
	}
	for (i = this._cntrlElems.length - 1; i >= 0; i--) {
		this._cntrlElems[i].dirArrow.style.zIndex = "44";
		this._cntrlElems[i].props.style.zIndex = "45";
		this._cntrlElems[i].props.style.display = "block"
	}
};
clsRef.prototype.setHiddenMode = function() {
	var i, j;
	for (i = this._cornerElems.length - 1; i >= 0; i--) {
		for (j = this._cornerElems[i].length - 1; j >= 0; j--) {
			this._cornerElems[i][j].style.display = "none"
		}
	}
	for (i = this._edgeElems.length - 1; i >= 0; i--) {
		for (j = this._edgeElems[i].length - 1; j >= 0; j--) {
			this._edgeElems[i][j].style.display = "none"
		}
	}
	for (i = this._cntrlElems.length - 1; i >= 0; i--) {
		this._cntrlElems[i].props.style.display = "none";
		this._cntrlElems[i].dirArrow.style.display = "none"
	}
};
clsRef.prototype._getColorNumber = function() {
	return "hb"
};
clsRef.prototype.getProps = function() {
	this._props.src = [this._upperLeft.getX(), this._upperLeft.getY(),
			this._lowerRight.getX(), this._lowerRight.getY()];
	this._props.dir = this._expDir;
	return this._props
};
clsRef.prototype.setProps = function(props) {
	this._props = props;
	this.save(true)
};
clsRef.prototype.getId = function() {
	return this._props.id
};
clsRef.prototype._mouseOnEdgeUp = function(ev) {
	dev.report.base.app.mimicOvertracking = false;
	this._legacyMouseUp();
	this._status = dev.report.base.range.AreaStatus.HOVERING;
	dev.report.base.app.mouseMovementObserver.unsubscribe(this._move);
	dev.report.base.app.mouseUpObserver.unsubscribe(this._onmouseup);
	this._unHover(ev);
	this.save(false)
};
clsRef.prototype._onmouseup = function(ev) {
	if (this._status == dev.report.base.range.AreaStatus.EXPANDING) {
		this.afterExpanding()
	}
	this._status = dev.report.base.range.AreaStatus.HOVERING;
	dev.report.base.app.mouseMovementObserver.unsubscribe(this._move);
	dev.report.base.app.mouseUpObserver.unsubscribe(this._onmouseup);
	this._unHover(ev);
	this._resizeDirection = dev.report.base.range.ResizeDirection.NONE;
	this._legacyMouseUp();
	this.save(false)
};
clsRef.prototype._openPropDlg = function(ev) {
	dev.report.gen.load(dev.report.base.app.dynJSRegistry.manageDynarange, [this
					.getProps()]);
	if (document.all) {
		window.event.returnValue = false;
		window.event.cancelBubble = true
	} else {
		ev.preventDefault();
		ev.stopPropagation()
	}
};
clsRef.prototype._propsBtnMouseOver = function(ev) {
	var coords = dev.report.base.mouse.getGridPos((document.all) ? window.event : ev);
	dev.report.base.mouse.mimicCellMouseEvent(coords[0], coords[1], "mouseover")
};
clsRef.prototype.remove = function(perm) {
	for (var i = this._edgeElems.length - 1; i >= 0; i--) {
		for (var j = this._edgeElems[i].length - 1; j >= 0; j--) {
			this._edgeElems[i][j].parentNode.removeChild(this._edgeElems[i][j])
		}
	}
	for (i = this._cornerElems.length - 1; i >= 0; i--) {
		for (j = this._cornerElems[i].length - 1; j >= 0; j--) {
			this._cornerElems[i][j].parentNode
					.removeChild(this._cornerElems[i][j])
		}
	}
	for (i = this._cntrlElems.length - 1; i >= 0; i--) {
		this._cntrlElems[i].props.parentNode
				.removeChild(this._cntrlElems[i].props);
		this._cntrlElems[i].dirArrow.parentNode
				.removeChild(this._cntrlElems[i].dirArrow)
	}
	if (perm) {
		var  rngClearType = dev.report.base.range.ContentType, dcellX = this._props.src[0], dcellY = this._props.src[1];
		var table=dev.report.model.report.tabMap;
		table.removeRange(this._props.id);
		var rpt=dev.report.model.report;
		if (this._props.dir == this.getConstant("DIRECTION").VERT) {
			rpt.detail=null;
		}else if (this._props.dir == this.getConstant("DIRECTION").HORIZ) {
		
		}else if (this._props.dir == this.getConstant("DIRECTION").TITLE) {
			rpt.title=null;
		}else if (this._props.dir == this.getConstant("DIRECTION").COLUMNHEADER) {
			rpt.columnHeader=null;
		}else if (this._props.dir == this.getConstant("DIRECTION").COLUMNFOOTER) {
			rpt.columnFooter=null;
		}else if (this._props.dir == this.getConstant("DIRECTION").SUMMARY) {
			rpt.summary=null;
		}else if (this._props.dir == this.getConstant("DIRECTION").GROUPHEADER) {
			//rpt.columnFooter=null;
		}else if (this._props.dir == this.getConstant("DIRECTION").GROUPFOOTER) {
			//rpt.summary=null;
		}
		//this._pane.clrRange([dcellX, dcellY, dcellX, dcellY],
		//		rngClearType.FORMULA | rngClearType.ATTRS);
	}
};
clsRef.prototype.save = function(force) {
	var props = this.getProps(), prevVal = this._props._preview_val;
	function propsChanged(prev, curr) {
		return (!prev.src.compare(curr.src) || prev.dir != curr.dir || !prev.dcell
				.compare(curr.dcell))
	}
	var propsClone = Ext.ux.clone(props), id = propsClone.id, _gendata = propsClone._gendata,that = this, dcellX = props.src[0]
			, dcellY = props.src[1], numToLet = dev.report.base.app.numberToLetter, nLoc = "=$"
			.concat(numToLet[this._upperLeft.getX()], "$", this._upperLeft
							.getY(), ":$", numToLet[this._lowerRight.getX()],
					"$", this._lowerRight.getY());

		var table=dev.report.model.report.tabMap;

		for(var i in table.ranges){
			if(table.ranges[i].type==propsClone.dir&&
				table.ranges[i].startRow==propsClone.src[0]&&
				table.ranges[i].startCol==propsClone.src[1]&&
				table.ranges[i].endRow==propsClone.src[2]&&
				table.ranges[i].endCol==propsClone.src[3])
				table.removeRange(i);
		}
		var range=new dev.report.model.XRange(propsClone.id);
		range.type=propsClone.dir;
		var startRow=range.startRow=propsClone.src[0];
		var startCol=range.startCol=propsClone.src[1];
		var endRow=range.endRow=propsClone.src[2];
		var endCol=range.endCol=propsClone.src[3];
		table.addRange(range);
		var rpt=dev.report.model.report;

		if (propsClone.dir == this.getConstant("DIRECTION").VERT) {
			var detail=new dev.report.model.XDetail();
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir);
			band.height=dims[1];
			detail.band.push(band);
			rpt.detail=detail;
		}else if (propsClone.dir == this.getConstant("DIRECTION").HORIZ) {
		
		}else if (propsClone.dir == this.getConstant("DIRECTION").TITLE) {
			var title=new dev.report.model.XTitle();
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir);
			band.height=dims[1];
			title.band=band;
			rpt.title=title;
		}else if (propsClone.dir == this.getConstant("DIRECTION").COLUMNHEADER) {
			var colHeader=new dev.report.model.XColumnHeader();
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir);
			band.height=dims[1];
			colHeader.band=band;
			rpt.columnHeader=colHeader;
		}else if (propsClone.dir == this.getConstant("DIRECTION").COLUMNFOOTER) {
			var colFooter=new dev.report.model.XColumnFooter();
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir);
			band.height=dims[1];
			colFooter.band=band;
			rpt.columnFooter=colFooter;
		}else if (propsClone.dir == this.getConstant("DIRECTION").SUMMARY) {
			var summary=new dev.report.model.XSummary();
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir);
			band.height=dims[1];
			summary.band=band;
			rpt.summary=summary;
		}else if (propsClone.dir == this.getConstant("DIRECTION").GROUPHEADER) {
			var groups=rpt.groups;
			var groupNames=[];
			var group;
			for(var i in groups){
				groupNames.push(groups[i].name);
			}
			if(groupNames.length==1){
				group=rpt.getGroup(groupNames[0]);
			}else{
			
			}
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir,group.name);
			band.height=dims[1];
			var groupHeader=new dev.report.model.XGroupHeader();
			groupHeader.band.push(band);
			group.groupHeader=groupHeader;
		}else if (propsClone.dir == this.getConstant("DIRECTION").GROUPFOOTER) {
			var groups=rpt.groups;
			var groupNames=[];
			var group;
			for(var i in groups){
				groupNames.push(groups[i].name);
			}
			if(groupNames.length==1){
				group=rpt.getGroup(groupNames[0]);
			}else{
			
			}
			var band=new dev.report.model.XBand();
			var dims=this.createBand(band,startRow,startCol,endCol,endRow,propsClone.dir,group.name);
			band.height=dims[1];
			var groupFooter=new dev.report.model.XGroupFooter();
			groupFooter.band.push(band);
			group.groupFooter=groupFooter;
		}
		delete propsClone.id;
		delete propsClone._gendata;
		this._propsPrev = Ext.ux.clone(props)
};
clsRef.prototype.createBand = function(band,startRow,startCol,endCol,endRow,dir,groupName){
	var table=dev.report.model.report.tabMap;
	var rpt=dev.report.model.report;
	var dims=[];
	var pictures=table.getPictureObject();
	var resetType = "None";

	if (dir == this.getConstant("DIRECTION").VERT) {
		resetType = "None";
	}else if (dir == this.getConstant("DIRECTION").HORIZ) {
		resetType = "None";
	}else if (dir == this.getConstant("DIRECTION").TITLE) {
		resetType = "Report";
	}else if (dir == this.getConstant("DIRECTION").COLUMNHEADER) {
		resetType = "Page";
	}else if (dir == this.getConstant("DIRECTION").COLUMNFOOTER) {
		resetType = "Page";
	}else if (dir == this.getConstant("DIRECTION").SUMMARY) {
		resetType = "Report";
	}else if (dir == this.getConstant("DIRECTION").GROUPHEADER) {
		resetType = "Group";
	}else if (dir == this.getConstant("DIRECTION").GROUPFOOTER) {
		resetType = "Group";
	}

	for(var i=startCol;i<=endCol;i++){
		for(var j=startRow;j<=endRow;j++){
			var cell=table.getCellNoCreate(j,i);
			var activePane = dev.report.base.app.activePane;
			var cellDims,cellPosition,cellDims2,cellPosition2;
			if(cell!=null){
				var mergeAcross=parseInt(cell.mergeAcross);
				var mergeDown=parseInt(cell.mergeDown);
				if(mergeAcross>0&&mergeDown>0){
					cellPosition2=cellPosition = activePane.getPixelsByCoords(j,i);
					var j1=parseInt(j)+mergeAcross;
					var i1=parseInt(i)+mergeDown;
					var cellPosition1=activePane.getPixelsByCoords(j1,i1);
					cellDims2=cellDims=[cellPosition1[0]-cellPosition[0],cellPosition1[1]-cellPosition[1]];
					cellPosition[0]=Math.round(cellPosition[0]*3/4);
					cellPosition[1]=Math.round(cellPosition[1]*3/4);
					cellDims[0]=Math.round(cellDims[0]*3/4);
					cellDims[1]=Math.round(cellDims[1]*3/4);
					dims.push(cellPosition[1]);
					dims.push(cellDims[1]);
					i=i+mergeDown;
					j=j+mergeAcross;
				}else{
					cellDims2=cellDims = activePane.getCellDims(j,i);
					cellPosition2=cellPosition = activePane.getPixelsByCoords(j,i);
					cellPosition[0]=Math.round(cellPosition[0]*3/4);
					cellPosition[1]=Math.round(cellPosition[1]*3/4);
					cellDims[0]=Math.round(cellDims[0]*3/4);
					cellDims[1]=Math.round(cellDims[1]*3/4);
					dims.push(cellPosition[1]);
					dims.push(cellDims[1]);
				}
				var jwwsel = dev.report.base.wsel;
				for(var i in pictures){
					var rng = jwwsel.getRngFromNLoc(pictures[i].location);
					if(startCol<=rng[0]&&rng[0]<=endCol&&startRow<=rng[1]&&rng[1]<=endRow){
						
						var image=new dev.report.model.XImage();
						image.scaleImage="Clip";
						var tlXY = activePane.getPixelsByCoords(rng[0], rng[1]);
						var imgcellPosition=tlXY[0]+ pictures[i].offset[0];
							//imgcellPosition[1]=tlXY[1] + pictures[i].offset[1];
						var reportElement=new dev.report.model.XReportElement(imgcellPosition,0,pictures[i].size[0],pictures[i].size[1]);
						image.addReportElement(reportElement);
						var imageExpression = new dev.report.model.XImageExpression();
						imageExpression.data="/dev/report/getimages.jcp?type=content&id="+pictures[i].id
						image.imageExpression=imageExpression;
						band.addImage(image);
					}
				}  
				if((cell.dataValue.indexOf('SUM(')!=-1||cell.dataValue.indexOf('COUNT(')!=-1
					||cell.dataValue.indexOf('DISTINCTCOUNT(')!=-1||cell.dataValue.indexOf('AVERAGE(')!=-1
					||cell.dataValue.indexOf('MAX(')!=-1||cell.dataValue.indexOf('MIN(')!=-1
					||cell.dataValue.indexOf('STDEV(')!=-1||cell.dataValue.indexOf('VAR(')!=-1
					||cell.dataValue.indexOf('FIRST(')!=-1)&&(cell.dataValue.indexOf('$F{')!=-1||cell.dataValue.indexOf('$V{')!=-1)){
						var custString=cell.dataValue;
						var custString1=cell.dataValue;

						var varName=custString.replace("(","");
						varName=varName.replace(")","");
						varName=varName.replace("$F{","_");
						varName=varName.replace("$V{","_");
						varName=varName.replace("}","");

						var varExp=custString.substring(custString.indexOf('(')+1,custString.indexOf(')'));
						var cacExp=custString.substring(0,custString.indexOf('('));
   
						var minType=2;
						var class1='';
						if(cacExp=='COUNT'||cacExp=='DISTINCTCOUNT'){
							minType=2;
						}else{
							while(custString.indexOf('$F{')!=-1){
								var start=custString.indexOf('$F{')+3;
								var end=custString.indexOf('}');
								var fldStr=custString.substring(start,end);
								custString=custString.substring(end+1,custString.length);
								var fld=rpt.getField(fldStr);
								var intType=rpt.typeMap[fld.class1];
								if(intType<minType) minType=intType;
							}  
							while(custString1.indexOf('$V{')!=-1){
								var start=custString1.indexOf('$V{')+3;
								var end=custString1.indexOf('}');
								var fldStr=custString1.substring(start,end);
								custString1=custString1.substring(end+1,custString1.length);
								var fld=rpt.getVariable(fldStr);
								var intType=rpt.typeMap[fld.class1];
								if(intType<minType) minType=intType;
							}
						}
						
						if(minType==2){
							class1='java.lang.Integer';
						}else if(minType==1){
							class1='java.lang.Double';
						}else if(minType==0){
							class1='java.lang.String';
						}else{
							class1='java.lang.String';
						}
						if (dir == this.getConstant("DIRECTION").GROUPHEADER||dir == this.getConstant("DIRECTION").GROUPFOOTER) {
							varName = varName+'_'+groupName;
						}
						var customV=new dev.report.model.XVariable(varName);
						customV.class1=class1;

						var caculationMap={};
						caculationMap['SUM']='Sum';
						caculationMap['COUNT']='Count';
						caculationMap['DISTINCTCOUNT']='DistinctCount';
						caculationMap['AVERAGE']='Average';
						caculationMap['MAX']='Highest';
						caculationMap['MIN']='Lowest';
						caculationMap['STDEV']='StandardDeviation';
						caculationMap['VAR']='Variance';
						caculationMap['FIRST']='First';

						customV.calculation=caculationMap[cacExp];
						customV.resetType=resetType;

						if (dir == this.getConstant("DIRECTION").GROUPHEADER||dir == this.getConstant("DIRECTION").GROUPFOOTER) {
							customV.resetGroup = groupName;
						}

						var variableExpression =new dev.report.model.XVariableExpression();
						variableExpression.expression=varExp;
						customV.variableExpression=variableExpression;
						rpt.addVariable(customV);

						var textField=new dev.report.model.XTextField();
						var reportElement=new dev.report.model.XReportElement(cellPosition[0],0,cellDims[0],cellDims[1]);
						reportElement.style=cell.styleID;
						textField.addReportElement(reportElement);
						var textFieldExpression =new dev.report.model.XTextFieldExpression();
						textFieldExpression.data="$V{"+varName+"}";
						textFieldExpression.class1=class1;
						textField.textFieldExpression=textFieldExpression;
						band.addTextField(textField);

				}else{
					if(cell.dataValue.indexOf('$F{')!=-1){
						var textField=new dev.report.model.XTextField();
						var reportElement=new dev.report.model.XReportElement(cellPosition[0],0,cellDims[0],cellDims[1]);
						reportElement.style=cell.styleID;
						textField.addReportElement(reportElement);
						var textFieldExpression =new dev.report.model.XTextFieldExpression();
						var fieldName=textFieldExpression.data=cell.dataValue;
						fieldName=fieldName.substring(fieldName.indexOf("$F{")+3,fieldName.indexOf("}"));
						var field=rpt.getField(fieldName);
						textFieldExpression.class1=field.class1;
						textField.textFieldExpression=textFieldExpression;
						band.addTextField(textField);
					}else if(cell.dataValue.indexOf('$V{')!=-1){
						var textField=new dev.report.model.XTextField();
						var reportElement=new dev.report.model.XReportElement(cellPosition[0],0,cellDims[0],cellDims[1]);
						reportElement.style=cell.styleID;
						textField.addReportElement(reportElement);
						var textFieldExpression =new dev.report.model.XTextFieldExpression();
						var varName=textFieldExpression.data=cell.dataValue;
						varName=varName.substring(varName.indexOf("$V{")+3,varName.indexOf("}"));
						var variable=rpt.getVariable(varName);
						textFieldExpression.class1=variable.class1;
						textField.textFieldExpression=textFieldExpression;
						band.addTextField(textField);
					}else if(cell.dataValue.indexOf('$P{')!=-1){
						var textField=new dev.report.model.XTextField();
						var reportElement=new dev.report.model.XReportElement(cellPosition[0],0,cellDims[0],cellDims[1]);
						reportElement.style=cell.styleID;
						textField.addReportElement(reportElement);
						var textFieldExpression =new dev.report.model.XTextFieldExpression();
						textFieldExpression.data=cell.dataValue;
						textFieldExpression.class1="java.lang.String";
						textField.textFieldExpression=textFieldExpression;
						band.addTextField(textField);
					}else{
						var txt=new dev.report.model.XText();
						txt.value=cell.dataValue;
						var staticText=new dev.report.model.XStaticText();
						var reportElement=new dev.report.model.XReportElement(cellPosition[0],0,cellDims[0],cellDims[1]);
						reportElement.style=cell.styleID;
						staticText.addReportElement(reportElement);
						staticText.text=txt;
						band.addStaticText(staticText);
					}
				}
			}
		};
	};
	return dims;
};
clsRef.prototype.move = function(pos) {
	this._upperLeft.setX(pos[0]);
	this._upperLeft.setY(pos[1]);
	this._lowerRight.setX(pos[2]);
	this._lowerRight.setY(pos[3]);
	this.save(false)
};
clsRef.prototype.syncActivePane = function() {
	this._pane = this._selection._pane;
};
clsRef = null;