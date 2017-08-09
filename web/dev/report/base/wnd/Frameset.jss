
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.wnd");
using("dev.report.base.wnd.Frame");
dev.report.base.wnd.Frameset = function(cb, holder, name, meta, cols, rows, frames,uid) {
	var that = this;
	this.holder = holder;
	this._meta = meta;
	this._name = name;
	this._domId = holder._domId;
	this.dom = holder.getDom();
	this._conf = {
		cols : cols ? cols.split(",") : ["*"],
		rows : rows ? rows.split(",") : ["*"],
		frames : frames
	};
	this._calcColsRows();
	this._genContentEl();
	this._frameDoms = [];
	var params=frames[0].params;
	//for (var i = frames.length - 1; i >= 0; --i) {
	var domID=this._domId.concat("F", 0);
	this._frameDoms[0] = document.getElementById(domID);

	var uid=dev.report.model.report.id;
	var paramString='report_id='+uid+'&start=0&limit=50&query='+encodeURI(Ext.encode(params));

	var el=new Ext.ux.IFrameComponent({id:uid,renderTo:this._frameDoms[0], url:'/bin/bi/Preview.jcp?'+paramString,style:'position:relative;left:0; top:0; height:100%; width:100%; background:#ffffff'});

	/*this._frames = [];
	this._names = {};
	var cbs = [cb];
	for (var frame, i = frames.length - 1; i >= 0; --i) {
		frame = new dev.report.base.wnd.Frame(cbs[i], this, this._frameDoms[i],
				frames[i]);
		this._frames.unshift(frame);
		this._names[frame.name] = frame;
		this.setActiveFrame(frame)
	}
	if (!this._eFrame) {
		var c = 0, r = 0, i;
		for (i = this._cols.length - 1; i > 0; --i) {
			if (this._cols[i] > this._cols[c]) {
				c = i
			}
		}
		for (i = this._rows.length - 1; i > 0; --i) {
			if (this._rows[i] > this._rows[r]) {
				r = i
			}
		}
		this._eFrame = this._frames[r * this._cols.length + c]
	}*/
};
dev.report.base.wnd.Frameset.prototype = {
	_genContentEl : function() {
		var html = ['<div style="position: relative;">'], cnum = this._cols.length, rnum = this._rows.length, t = 0, l, w, h, cnt = -1;
		for (var r = 0; r < rnum; ++r) {
			h = this._rows[r];
			l = 0;
			for (var c = 0; c < cnum; ++c) {
				w = this._cols[c];
				html.push('<div id="', this._domId, "F", ++cnt,
						'" style="position: absolute; top: ', t, "px; left: ",
						l, "px; width: ", w, "px; height: ", h, 'px;"></div>');
				l += w
			}
			t += h
		}
		html.push("</div>");
		this.dom.innerHTML = html.join("")
	},
	_calcDims : function(dims, sum) {
		var num = dims.length, left = sum, a_coefs = {}, a_slice = 0, dim, type;
		for (var i = 0; i < num; ++i) {
			dim = dims[i];
			type = typeof dim;
			if (type == "string") {
				switch (dim.charAt(dim.length - 1)) {
					case "*" :
						a_slice += a_coefs[i] = (dim = dim.slice(0, -1) | 0)
								? dim
								: 1;
						continue;
					case "%" :
						dim = (dim.slice(0, -1) | 0) * 0.01 * sum | 0;
						break;
					default :
						dim |= 0
				}
			} else {
				if (type != "number") {
					dim = 0
				}
			}
			if (dim > left) {
				dim = left
			}
			left -= dims[i] = dim
		}
		if (a_slice) {
			a_slice = left / a_slice;
			for (var i in a_coefs) {
				left -= dims[i] = a_coefs[i] * a_slice | 0
			}
		} else {
			--i
		}
		if (left) {
			dims[i] += left
		}
		return dims
	},
	_calcColsRows : function() {
		var width = this.holder.getInnerWidth(), height = this.holder
				.getInnerHeight();
		this._cols = this._calcDims(this._conf.cols.slice(), width);
		this._rows = this._calcDims(this._conf.rows.slice(), height)
	},
	_select : function() {
		return this._aFrame._select()
	},
	_fit : function() {
		this._calcColsRows();
		var cnum = this._cols.length, rnum = this._rows.length, t = 0, l, w, h, cnt = -1, frame;
		for (var r = 0; r < rnum; ++r) {
			h = this._rows[r];
			l = 0;
			for (var c = 0; c < cnum; ++c) {
				w = this._cols[c];
				this._frameDoms[++cnt].style.cssText = "position: absolute; top: "
						.concat(t, "px; left: ", l, "px; width: ", w,
								"px; height: ", h, "px;");
				if (frame = this._frames[cnt]) {
					frame._fit()
				}
				l += w
			}
			t += h
		}
	},
	_unload : function() {
		for (var frames = this._frames, i = frames.length - 1; i >= 0; --i) {
			frames[i]._unload()
		}
		while (this.dom.hasChildNodes()) {
			this.dom.removeChild(this.dom.lastChild)
		}
	},
	refresh : function() {
		for (var frame, i = this._frames.length - 1; i >= 0; --i) {
			frame = this._frames[i];
			frame._select();
			frame.refresh()
		}
	},
	getNames : function() {
		var names = [];
		for (var name in this._names) {
			names.push(name)
		}
		return names
	},
	getFrameById : function(id) {
		return this._frames[id]
	},
	getFrameByName : function(name) {
		return this._names[name]
	},
	setActiveFrame : function(aFrame) {
		if (this._aFrame == aFrame) {
			return
		}
		for (var frame, i = this._frames.length - 1; i >= 0; --i) {
			frame = this._frames[i];
			if (frame == aFrame) {
				this._aFrame = frame;
				frame._autoSelect(false)
			} else {
				if (!frame.dom.onmousedown) {
					frame._autoSelect(true)
				}
			}
		}
	},
	getFrameUIDs : function() {
		var list = [];
		for (var i = this._frames.length - 1; i >= 0; i--) {
			list.push(this._frames[i].node.uid)
		}
		return list
	},
	selExportFrame : function() {
		this._eFrame._select()
	}
};