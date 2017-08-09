
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.PaneCache = function(pane) {
	this._pane = pane;
	this._conn = dev.report.backend;
	this._raCoef = this._READAHEAD_COEF;
	this.clear()
};
dev.report.base.grid.PaneCache.prototype = {
	_READAHEAD_COEF : 2,
	clear : function() {
		this._map = {};
		this._rng = [0, 0, 0, 0]
	},
	get : function(x, y) {
		if (x in this._map) {
			return this._map[x][y]
		}
		return undefined
	},
	getPart : function(x, y, type) {
		if (x in this._map) {
			x = this._map[x];
			if (y in x) {
				return x[y][type]
			}
			return undefined
		}
		return undefined
	},
	has : function(x, y) {
		return x in this._map && y in this._map[x]
	},
	hasPart : function(x, y, type) {
		return x in this._map && y in this._map[x] && type in this._map[x][y]
	},
	miss : function(rng) {
		return rng[0] < this._rng[0] || rng[2] > this._rng[2]
				|| rng[1] < this._rng[1] || rng[3] > this._rng[3]
	},
	load : function(cb, rng, opts) {
		if (typeof opts != "object") {
			opts = {}
		}

		if (opts.sdr in rng) {
			var h_incr = this._pane._numCols * this._raCoef, v_incr = this._pane._numRows
					* this._raCoef, crch = this._pane._sheet._contentReach;

			switch (opts.sdr) {
				case 0 :
					if ((rng[0] -= h_incr) < 1) {
						rng[0] = 1
					}
					break;
				case 2 :
					if ((rng[2] += h_incr) > crch[0]) {
						rng[2] = crch[0]
					}
					break;
				case 1 :
					if ((rng[1] -= v_incr) < 1) {
						rng[1] = 1
					}
					break;
				case 3 :
					if ((rng[3] += v_incr) > crch[1]) {
						rng[3] = crch[1]
					}
					break
			}
		}

		var table=dev.report.model.report.tabMap;


		var res1=[];
		res1.push(true);

		for(var i=1;i<=table.expandedRowCount;i++){
			for(var j=1;j<=table.expandedColumnCount;j++){
				var row=table.getRow(i);
				if(row!=null){
					var resTemp=[];
					var cell=row.getCell(j);

					if(cell!=null){
						if(cell.mergeAcross>0||cell.mergeDown>0){
							var mergeAcross=parseInt(cell.mergeAcross);
							var mergeDown=parseInt(cell.mergeDown);
							resTemp.push(j);
							resTemp.push(i);
							
							resTemp.push(mergeAcross+1);
							var val={};
							val["m"]=[true,mergeDown,mergeAcross];
							val["v"]=cell.dataValue;
							val["l"]=cell.dataValue;
							val["t"]="s";
							val["s"]=cell.getStyle();
							resTemp.push(val);
							var b=true;
							for(var k=j;k<j+mergeDown;k++){
								for(var m=i;m<i+mergeAcross+1;m++){
									if(b)
										b=false;
									else{
										if(m==i+mergeAcross){
											val={};	
											val["s"]="border-left: ;";
											resTemp.push(val);
										}else{
											val={};	
											val["s"]="border-left: ;";
											val["m"]=[false,i-1,j-1];
											resTemp.push(val);
										}
									}
								}
							}
							res1.push(resTemp);
						}else{
							resTemp.push(j);
							resTemp.push(i);
							resTemp.push(0);
							var val={};
							val["v"]=cell.dataValue;
							val["l"]=cell.dataValue;
							val["s"]=cell.getStyle();
							resTemp.push(val);
							res1.push(resTemp);	
						}
					}
				}
			}
		}
		var res=[];
		res.push(res1);
		this._fill(res,cb, rng, opts);
	},
	_fill : function(rgns, cb, rng, opts) {
		var map = this._map = {}, grid = this._pane.getVirtScroll(), frn = opts.frn
				? this._pane.furnishCell
				: false;
		this._rng = rng;
		rgns = rgns[0];
		for (var rgn, i = 0; (rgn = rgns[++i]) != undefined;) {
			for (var cell, x = rgn[0], y = rgn[1], w = rgn[2], j = 2; (cell = rgn[++j]) != undefined;) {
				if (!(x in map)) {
					map[x] = {}
				}
				map[x][y] = cell;
				if (frn && x >= grid[0] && x <= grid[2] && y >= grid[1]
						&& y <= grid[3]) {
					frn.call(this._pane, x, y, cell)
				}
				if (++x - rgn[0] >= w && w > 0) {
					++y, x = rgn[0]
				}
			}
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	}
};