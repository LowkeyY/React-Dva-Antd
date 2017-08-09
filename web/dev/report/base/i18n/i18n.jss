dev.report.base.i18n = new function() {
	this.names = {
		en_US : "English",
		de_DE : "Deutsch",
		fr_FR : "Français",
		cs_CZ : "Český"
	};
	var _be2fe = {
		en : "en_US",
		de : "de_DE",
		fr : "fr_FR",
		cs : "cs_CZ"
	}, _fe2be = {
		en_US : "en",
		de_DE : "de",
		fr_FR : "fr",
		cs_CZ : "cs"
	};
	this.dictGet = function(cb) {
		(new dev.report.backend.CCmdAsyncRqst(["bget", "", [], [], {
					e_type : "dict"
				}])).setOnSuccess([this, _dictGet, cb]).send()
	};
	function _dictGet(res, cb) {
		res = res[0][1];
		var map = {}, uid;
		if (res.length) {
			res = res[0];
			uid = res.e_id;
			var id, pos, key, l10n;
			for (id in res) {
				pos = id.lastIndexOf("_");
				key = id.substring(0, pos);
				l10n = id.substring(pos + 1);
				if (!(l10n in _be2fe)) {
					continue
				}
				if (!(key in map)) {
					map[key] = {}
				}
				map[key][_be2fe[l10n]] = res[id]
			}
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], [uid, map].concat(cb.slice(2)))
		}
	}
	this.dictSet = function(cb, uid, map) {
		var data = {}, map_key, key, l10n, cmd;
		for (key in map) {
			map_key = map[key];
			for (l10n in map_key) {
				data[key.concat("_", _fe2be[l10n])] = map_key[l10n]
			}
		}
		if (uid) {
			cmd = ["bupd", "", {}];
			cmd[2][uid] = data
		} else {
			data.e_type = "dict";
			cmd = ["badd", "", data]
		}
		(new dev.report.backend.CCmdAsyncRqst(cmd)).setOnSuccess(cb).send()
	}
};
