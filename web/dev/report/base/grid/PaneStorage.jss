Ext.namespace("dev.report.base.grid");

dev.report.base.grid.PaneStorage = function(pane) {
	this._pane = pane;
	this._json = Ext.util.JSON;
	this._mapJStoCSS = dev.report.base.style.mapJStoCSS;
	this._tbl = [];
	var w = pane._numCols, h = pane._numRows;
	for (var row, i = h - 1; i >= 0; --i) {
		row = this._tbl[i] = [], row.length = w
	}
};
dev.report.base.grid.PaneStorage.prototype = {
	set : function(x, y, obj, comb) {
		if (obj == undefined) {
			return this.del(x, y)
		}
		var cobj;
		if (comb && (cobj = this._tbl[y][x])) {
			if ("_pend" in cobj && !("_pend" in obj)) {
				delete cobj._pend
			}
			for (var type in obj) {
				if (obj[type] !== "") {
					cobj[type] = obj[type]
				} else {
					delete cobj[type]
				}
			}
		} else {
			this._tbl[y][x] = obj
		}
	},
	setPart : function(x, y, val, type) {
		switch (type) {
			case "s" :
				var cell = this._tbl[y][x], styleDef, styleOld;
				if (cell && (styleOld = cell.s)) {
					var attrCSS, attrDef, styleNew = styleOld;
					for (var attr in val) {
						if ((attrCSS = this._mapJStoCSS[attr]) == undefined) {
							continue
						}
						attrDef = attrCSS.concat(":", val[attr], ";");
						if (styleNew.indexOf(attrDef) != -1) {
							continue
						}
						if (styleNew.indexOf(attrCSS) == -1) {
							styleNew = styleNew.concat(attrDef);
							continue
						}
						var re = new RegExp(attrCSS.concat(":[^;]*;"), "i");
						styleNew = styleNew.replace(re, attrDef)
					}
					if (styleNew != styleOld) {
						cell.s = styleNew
					}
				} else {
					if (styleDef = dev.report.base.style.convJStoCSS(val)) {
						this.set(x, y, {
									s : styleDef
								}, true)
					}
				}
				return
		}
	},
	setRangePart : function(x1, y1, x2, y2, val, type) {
		switch (type) {
			case "k" :
				var cell;
				if (val == true) {
					for (var y = y1; y <= y2; ++y) {
						for (var x = x1; x <= x2; ++x) {
							if ((cell = this._tbl[y][x]) && "k" in cell) {
								delete cell.k
							}
						}
					}
				} else {
					for (var y = y1; y <= y2; ++y) {
						for (var x = x1; x <= x2; ++x) {
							if (cell = this._tbl[y][x]) {
								cell.k = false
							} else {
								this._tbl[y][x] = {
									k : false
								}
							}
						}
					}
				}
				return
		}
	},
	setAttr : function(x, y, attrs, comb) {
		var cell = this._tbl[y][x];
		if (cell) {
			if (comb && "a" in cell) {
				for (name in attrs) {
					cell.a[name] = attrs[name]
				}
			} else {
				cell.a = attrs
			}
		} else {
			this._tbl[y][x] = {
				a : attrs
			}
		}
	},
	getAttr : function(x, y, name) {
		var cell = this._tbl[y][x];
		if (cell && "a" in cell) {
			return cell.a[name]
		}
		return undefined
	},
	del : function(x, y) {
		delete this._tbl[y][x]
	},
	delPart : function(x, y, type) {
		var cell = this._tbl[y][x];
		if (cell) {
			delete cell[type]
		}
	},
	get : function(x, y) {
		return this._tbl[y][x]
	},
	getPart : function(x, y, type) {
		var cell = this._tbl[y][x];
		if (cell) {
			return cell[type]
		}
		return undefined
	},
	fetch : function(x, y, prop) {
		if (y in this._tbl) {
			var cell = this._tbl[y][x];
			if (cell) {
				return prop ? cell[prop] : cell
			}
		}
		return undefined
	},
	has : function(x, y) {
		return y in this._tbl && this._tbl[y][x] != undefined
	},
	hasPart : function(x, y, type) {
		return y in this._tbl && this._tbl[y][x] != undefined
				&& type in this._tbl[y][x]
	}
};