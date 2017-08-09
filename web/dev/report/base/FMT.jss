
Ext.namespace("dev.report.base");
dev.report.base.FMT =  function() {
	var that = this, _bknd = dev.report.backend;
	this.set = function(data) {
		var env = dev.report.base.app.environment, activeSheet = dev.report.base.app.activeSheet, activePane = activeSheet._aPane, cellCoords = env.selectedCellCoords, defSel = env.defaultSelection, sets = [];
		if (!(data instanceof Array) || typeof data[0] != "string") {
			return
		}
		var fmt = data.shift();
		if (defSel.isSingleCell()) {
			var mi = activePane.getMergeInfo(cellCoords[0], cellCoords[1]);
			if (mi && mi[0]) {
				var rangeCoords = [cellCoords[0], cellCoords[1],
						cellCoords[0] + mi[1] - 1, cellCoords[1] + mi[2] - 1];
				sets.push([rangeCoords[0], rangeCoords[1], rangeCoords[2],
						rangeCoords[3], fmt, data])
			} else {
				sets.push([cellCoords[0], cellCoords[1], cellCoords[0],
						cellCoords[1], fmt, data])
			}
		} else {
			for (var corners, rangeCoords, areas = defSel.getRanges(), i = areas.length
					- 1; i >= 0; --i) {
				corners = areas[i].getRealCorners();
				rangeCoords = [corners[0].getX(), corners[0].getY(),
						corners[1].getX(), corners[1].getY()];
				sets.push([rangeCoords[0], rangeCoords[1], rangeCoords[2],
						rangeCoords[3], fmt, data])
			}
		}
	/*	if (sets.length) {
			(new _bknd.CCmdDiffAsyncRqst(["sfmt"].concat(sets), _bknd.Q_VALUE
							| _bknd.Q_STYLE | _bknd.Q_ATTRS | _bknd.Q_FMT_VAL
							| _bknd.Q_FMT, _bknd.D_NONE)).send()
		}*/
	};
	this.get = function(cb) {
		var env = dev.report.base.app.environment, activeSheet = dev.report.base.app.activeSheet, activePane = activeSheet._aPane, cellCoords = env.selectedCellCoords, defSel = env.defaultSelection, sets = [];
		if (!(cb instanceof Array) || cb.length < 2) {
			return
		}
		if (defSel.isSingleCell()) {
			var mi = activePane.getMergeInfo(cellCoords[0], cellCoords[1]);
			if (mi && mi[0]) {
				var rangeCoords = [cellCoords[0], cellCoords[1],
						cellCoords[0] + mi[1] - 1, cellCoords[1] + mi[2] - 1];
				sets.push([rangeCoords[0], rangeCoords[1], rangeCoords[2],
						rangeCoords[3]])
			} else {
				sets.push([cellCoords[0], cellCoords[1], cellCoords[0],
						cellCoords[1]])
			}
		} else {
			for (var corners, rangeCoords, areas = defSel.getRanges(), i = areas.length
					- 1; i >= 0; --i) {
				corners = areas[i].getRealCorners();
				rangeCoords = [corners[0].getX(), corners[0].getY(),
						corners[1].getX(), corners[1].getY()];
				sets.push([rangeCoords[0], rangeCoords[1], rangeCoords[2],
						rangeCoords[3]])
			}
		}
		if (sets.length) {
			var resString='[[true,[""]]]';
			var res=Ext.decode(resString);
			_get_post(res, cb);
			//(new _bknd.CCmdAsyncRqst(["gcfmt"].concat(sets))).setOnSuccess([
			//		that, _get_post, cb]).send()
		}
	};   
	function _get_post(res, cb) {
		res = res[0];
		res.shift();
		var fmt = res[0][0];
		for (var i = res.length - 1; i > 0; --i) {
			if (res[i][0] !== fmt) {
				fmt = undefined;
				break
			}
		}
		cb[1].apply(cb[0], [fmt ? [fmt].concat(res[0][1]) : undefined]
						.concat(cb.slice(2)))
	}
	this.val = function(cb, fmt, val, pres) {
		if (!(cb instanceof Array) || cb.length < 2 || typeof fmt != "string") {
			return
		}
		val = dev.report.base.general.str2var(val, true);
		pres = pres ? true : undefined;
		var resString='[[true,""]]';
		var res=Ext.decode(resString);
		_val_post(res,cb);
		//(new _bknd.CCmdAsyncRqst(["fval", fmt, val.v, pres])).setOnSuccess([
		//		that, _val_post, cb]).send()
	};
	function _val_post(res, cb) {
		res = res[0];
		res.shift();
		cb[1].apply(cb[0], [res[0], res[1]].concat(cb.slice(2)))
	}
};