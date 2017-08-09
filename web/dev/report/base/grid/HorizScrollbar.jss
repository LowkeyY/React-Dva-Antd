
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.HorizScrollbar = (function() {
	return function(book, dom, panes, size) {
		dev.report.base.grid.HorizScrollbar.parent.constructor.call(this, book, dom);
		if (!book._gmode_edit && book._opts.hideHorScrollbar == "yes") {
			this.dom.style.visibility = "hidden";
			this.dom.style.height = "0px"
		} else {
			this.visible = true
		}
		var that = this, jwgrid = dev.report.base.grid;
		this._scrollbarBGOffset = jwgrid.defScrollbarBGOffset[0];
		this._sliderBorderElemsSize = jwgrid.defSliderBorderElemsSize[0];
		this._sliderCenterElemSize = jwgrid.defSliderCenterElemSize[0];
		this._sliderFills.setSize = function(elem, size) {
			this[elem].style.width = "".concat(size, "px")
		};
		this._sliderCenter.setSize = function(size) {
			this.style.width = "".concat(size, "px")
		};
		this._slider = YAHOO.widget.Slider.getHorizSlider(this._domId
						.concat("_bg"), this._domId.concat("_slider"), 0, 1, 1);
		this._slider.subscribe("change", function(offset) {
					that._scroll(offset)
				});
		this._slider.subscribe("slideEnd", function() {
					that._slideEnd()
				});
		this._slider.thumb.subscribe("mouseDownEvent", function() {
					book.select()
				});
		this._slider.setConstraint = function(from, to, ticksize) {
			this.thumb.setXConstraint(from, to, ticksize)
		};
		this._slider.onMouseDown = function(ev) {
			that._slider_omd(ev)
		};
		this._slider.onMouseUp = function() {
			that._clr_tid_reach()
		};
		this._slider.animate = false;
		this._slider.dragOnly = false;
		this._slider.enableKeys = false;
		this._switch(panes, size)
	}
})();
dev.report.util.extend(dev.report.base.grid.HorizScrollbar, dev.report.base.grid.Scrollbar);
var _prototype = dev.report.base.grid.HorizScrollbar.prototype;
_prototype._type = 0;
_prototype._paneSize = "_ocWidth";
_prototype._paneProp = "_hScroll";
_prototype._paneScroll = "_scrollGridX";
_prototype._genContentEl = function() {
	var html = [
			'<img id="',
			this._domId,
			'_rwd" class="hscroll_left" src="/Ext/resources/images/default/s.gif" width="17" height="17" />',
			'<div id="',
			this._domId,
			'_bg" class="hscroll_bg">',
			'<div id="',
			this._domId,
			'_slider" class="hscroll_slider">',
			'<img class="gridScrollImg_el_left" width="4" height="17" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_hfill" height="17" width="1" id="',
			this._domId,
			'_begf" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_hcenter" height="17" width="8" id="',
			this._domId,
			'_midf" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_hfill" height="17" width="1" id="',
			this._domId,
			'_endf" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_right" width="4" height="17" src="/Ext/resources/images/default/s.gif" />',
			"</div>",
			"</div>",
			'<img id="',
			this._domId,
			'_fwd" class="hscroll_right" src="/Ext/resources/images/default/s.gif" width="17" height="17" />'];
	this.dom.innerHTML = html.join("")
};
_prototype._resize = function(size) {
	if (size == 0) {
		return this.dom.style.display = "none"
	}
	this.dom.style.cssText = "display:; position: relative; width: ".concat(
			size, "px;");
	this._sliderSize = size - this._scrollbarBGOffset;
	this._bg.style.width = "".concat(this._sliderSize, "px");
	this.recalc()
};
_prototype.reach = function(pos) {
	if (this._book._scrollPending) {
		return false
	}
	var dir = 0;
	if (pos < this._slider.thumb.lastPageX) {
		dir = this._RWD
	} else {
		if (pos > this._slider.thumb.lastPageX
				+ this._slider.thumb._domRef.offsetWidth) {
			dir = this._FWD
		}
	}
	return this._reach(pos, dir)
};
_prototype._slider_omd = function(ev) {
	this.reach(ev.clientX)
};