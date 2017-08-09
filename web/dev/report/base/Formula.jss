

Ext.namespace("dev.report.base");
dev.report.base.Formula =  function() {
	var _MAX_COL = dev.report.base.grid.defMaxCoords[0], _MAX_ROW = dev.report.base.grid.defMaxCoords[1], _re_dquoted = /"[^"]*"/g, _re_squoted = /'[^']*'(?!!)/g, _re_dollar = /\$/g, _re_tokenize = /(?:^|[^\wäöüß:\$!])((?:[a-zäöüß][\wäöüß]+!)|(?:'[^']+'!))?(\$?[A-Z]+\$?[0-9]+)(:\$?[A-Z]+\$?[0-9]+)?(?![\wäöüß:\$!])/ig, _re_separate = /^([A-Z]+)([0-9]+)$/i;
	this.re_var = new RegExp("^=@([^ 0-9(#{}):!@<>[\\]*/^%=&+;,'\"$\\-][^ (#{}):!@<>[\\]*/^%=&+;,'\"$\\-]*)$");
	this.re_fn = new RegExp(
			"^=([^ 0-9(#{}):!@<>[\\]*/^%=&+;,'\"$\\-][^ (#{}):!@<>[\\]*/^%=&+;,'\"$\\-]*)\\((.*)\\)$",
			"i");
	this.re_paloData = new RegExp("^=PALO.DATAC?\\((.*)\\)$");
	this.ltrs2num = function(ltrs) {
		var num = 0;
		for (var f = 1, i = (ltrs = ltrs.toUpperCase()).length - 1; i >= 0; --i, f *= 26) {
			num += (ltrs.charCodeAt(i) - 64) * f
		}
		return num
	};
	this.parseCell = function(refstr) {
		if ((refstr = refstr.replace(_re_dollar, "").match(_re_separate)) == null) {
			return undefined
		}
		var col = this.ltrs2num(refstr[1]), row = parseInt(refstr[2]);
		if (col < 1 || col > _MAX_COL || row < 1 || row > _MAX_ROW) {
			return undefined
		}
		return [refstr.input, col, row]
	};
	function _gen_padding(str) {
		return Array(str.length + 1).join(" ")
	}
	this.parse = function(fstr, nfs) {
		var refs = [];
		refs.sgn = "";
		refs.tbl = {};
		if (!fstr) {
			return refs
		}
		fstr = fstr.replace(_re_dquoted, _gen_padding).replace(_re_squoted,
				_gen_padding);
		nf_off = {
			next : null
		};
		if (nfs instanceof Array && nfs.length) {
			var names = [], vals = {};
			for (var nf, i = nfs.length - 1; i >= 0; --i) {
				nf = nfs[i];
				names.push(nf[0]);
				vals[nf[0]] = nf[1].substr(1)
			}
			var re_names = new RegExp(names.join("|"), "g"), off = nf_off, corr = 0;
			fstr = fstr.replace(re_names, function(name, start) {
						var val = vals[name], len = val.length;
						off = off.next = {
							name : name,
							start : start += corr,
							end : start + len,
							corr : corr += len - name.length,
							next : null
						};
						return val
					})
		}
		nf_off = nf_off.next;
		var cnt = -1, sgn = "", tbl = {};
		for (var res, ul, lr, tok, key, sheet, tmp, corr_s = 0, corr_e = 0, off = {}; (res = _re_tokenize
				.exec(fstr)) != null;) {
			if ((ul = this.parseCell(res[2])) == undefined) {
				continue
			}
			if (!res[1]) {
				sheet = ""
			} else {
				if (res[1].charAt(0) == "'") {
					sheet = res[1].substr(1, res[1].length - 3)
				} else {
					sheet = res[1].substr(0, res[1].length - 1)
				}
			}
			tok = {
				sheet : sheet,
				ul : ul.shift(),
				start : _re_tokenize.lastIndex - res[0].length + 1,
				end : _re_tokenize.lastIndex
			};
			if (nf_off && tok.start >= nf_off.end) {
				corr_s = corr_e = nf_off.corr;
				nf_off = nf_off.next
			}
			if (nf_off) {
				if (tok.start < nf_off.start) {
					tok.id = ++cnt, off = {}
				} else {
					if (tok.end > nf_off.end) {
						tok.id = ++cnt, off = {}, corr_s = corr_e = nf_off.corr
					} else {
						tok.nf = true;
						tok.id = off.name == nf_off.name
								&& off.start == nf_off.start ? cnt : ++cnt;
						off = nf_off;
						if (tok.start > nf_off.start) {
							corr_s = nf_off.corr
						}
						corr_e = nf_off.corr
					}
				}
			} else {
				tok.id = ++cnt
			}
			tok.start -= corr_s;
			tok.end -= corr_e;
			if (res[3]) {
				if ((lr = this.parseCell(res[3].substr(1))) == undefined) {
					continue
				}
				tok.lr = lr.shift(), tok.rng = ul.concat(lr), key = sheet.length
						? sheet.concat("!", tok.ul, ":", tok.lr)
						: tok.ul.concat(":", tok.lr);
				if (tok.rng[2] < tok.rng[0]) {
					tmp = tok.rng[0];
					tok.rng[0] = tok.rng[2];
					tok.rng[2] = tmp
				}
				if (tok.rng[3] < tok.rng[1]) {
					tmp = tok.rng[1];
					tok.rng[1] = tok.rng[3];
					tok.rng[3] = tmp
				}
			} else {
				tok.lr = tok.ul, tok.rng = ul.concat(ul), key = sheet.length
						? sheet.concat("!", tok.ul)
						: tok.ul
			}
			tok.key = key;
			if (tbl[key]) {
				tbl[key].push(tok), tok.id = tbl[key][0].id
			} else {
				tbl[key] = [tok]
			}
			tok.idx = refs.push(tok) - 1;
			sgn = sgn.concat(key, "@", tok.start)
		}
		refs.sgn = sgn;
		refs.tbl = tbl;
		return refs
	};
	this.args = function(fstr) {
		fstr = fstr.match(/^=[a-z][a-z0-9\._]*\((.*)\)$/i);
		if (!(fstr instanceof Array)) {
			return []
		}
		fstr = fstr[1];
		var delim = dev.report.base.i18n.separators[2], len = fstr.length, args = [], arg = "", squote = false, dquote = false, parens = 0, braces = 0, c, i;
		for (i = 0; i < len; ++i) {
			c = fstr.charAt(i);
			if (c == delim && !squote && !dquote && parens == 0 && braces == 0) {
				args.push(arg.trim());
				arg = "";
				continue
			}
			switch (c) {
				case "'" :
					squote = !squote;
					break;
				case '"' :
					dquote = !dquote;
					break;
				case "(" :
					++parens;
					break;
				case ")" :
					--parens;
					break;
				case "{" :
					++braces;
					break;
				case "}" :
					--braces;
					break
			}
			arg = arg.concat(c)
		}
		args.push(arg.trim());
		return args
	}
};