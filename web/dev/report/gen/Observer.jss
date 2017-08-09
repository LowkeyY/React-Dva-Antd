Ext.namespace("dev.report.gen");
dev.report.gen.Observer = function() {
	this._fns = [];
	this._ths = []
};
dev.report.gen.Observer.prototype = {
	notify : function(that) {
		var idx, fns = this._fns.slice(), ths = this._ths.slice(), args = Array.prototype.slice
				.call(arguments, 1);
		for (var len = fns.length, i = 0; i < len; ++i) {
			fns[i].apply(ths[i] ? ths[i] : that, args)
		}
		return this
	},
	subscribe : function(fn, th) {
		if (this._fns.indexOf(fn) < 0) {
			this._fns.push(fn), this._ths.push(th)
		}
		return this
	},
	unsubscribe : function(fn) {
		var idx;
		if ((idx = this._fns.indexOf(fn)) >= 0) {
			this._fns.splice(idx, 1), this._ths.splice(idx, 1)
		}
		return this
	}
};