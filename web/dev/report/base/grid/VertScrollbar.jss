
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.VertScrollbar = (function() {
	return function(book, dom, panes, size) {
		dev.report.base.grid.VertScrollbar.parent.constructor.call(this, book, dom);
		if (!book._gmode_edit && book._opts.hideVertScrollbar == "yes") {
			this.dom.style.visibility = "hidden";
			this.dom.style.width = "0px"
		} else {
			this.visible = true
		}
		var that = this, jwgrid = dev.report.base.grid;
		this._scrollbarBGOffset = jwgrid.defScrollbarBGOffset[1];
		this._sliderBorderElemsSize = jwgrid.defSliderBorderElemsSize[1];
		this._sliderCenterElemSize = jwgrid.defSliderCenterElemSize[1];
		this._sliderFills.setSize = function(elem, size) {
			this[elem].style.height = "".concat(size, "px")
		};
		this._sliderCenter.setSize = function(size) {
			this.style.height = "".concat(size, "px")
		};
		this._slider = YAHOO.widget.Slider.getVertSlider(this._domId
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
			this.thumb.setYConstraint(from, to, ticksize)
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
dev.report.util.extend(dev.report.base.grid.VertScrollbar, dev.report.base.grid.Scrollbar);
var _prototype = dev.report.base.grid.VertScrollbar.prototype;
_prototype._type = 1;
_prototype._paneSize = "_ocHeight";
_prototype._paneProp = "_vScroll";
_prototype._paneScroll = "_scrollGridY";
_prototype._genContentEl = function() {
	var html = [
			'<img id="',
			this._domId,
			'_rwd" class="vscroll_up" src="/Ext/resources/images/default/s.gif" width="17" height="17" />',
			'<div id="',
			this._domId,
			'_bg" class="vscroll_bg">',
			'<div id="',
			this._domId,
			'_slider" class="vscroll_slider">',
			'<img class="gridScrollImg_el_top" width="17" height="4" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_vfill" width="17" height="1" id="',
			this._domId,
			'_begf" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_vcenter" width="17" height="8" id="',
			this._domId,
			'_midf" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_vfill" width="17" height="1" id="',
			this._domId,
			'_endf" src="/Ext/resources/images/default/s.gif" />',
			'<img class="gridScrollImg_el_bottom" width="17" height="4" src="/Ext/resources/images/default/s.gif" />',
			"</div>",
			"</div>",
			'<img id="',
			this._domId,
			'_fwd" class="vscroll_down" src="/Ext/resources/images/default/s.gif" width="17" height="17" />'];
	this.dom.innerHTML = html.join("")
};
_prototype._resize = function(size) {
	if (size == 0) {
		return this.dom.style.display = "none"
	}
	this.dom.style.display = "";
	this.dom.style.height = "".concat(size, "px");
	this._sliderSize = size - this._scrollbarBGOffset;
	this._bg.style.height = "".concat(this._sliderSize, "px");
	this.recalc()
};
_prototype.reach = function(pos) {
	if (this._book._scrollPending) {
		return false
	}
	var dir = 0;
	if (pos < this._slider.thumb.lastPageY) {
		dir = this._RWD
	} else {
		if (pos > this._slider.thumb.lastPageY
				+ this._slider.thumb._domRef.offsetHeight) {
			dir = this._FWD
		}
	}
	return this._reach(pos, dir)
};
_prototype._slider_omd = function(ev) {
	this.reach(ev.clientY)
};