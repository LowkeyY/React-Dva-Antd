
Ext.namespace("dev.report.base");
dev.report.base.CNDFMT = function() {
	var that = this, _borderTypes = ["top", "bottom", "left", "right"];
	this.SCOPE_CURR_SEL = 0;
	this.SCOPE_CURR_WKS = 1;
	this.SCOPE_RULE_IDS = 2;
	this.set = function(scope, rules, moves) {
		var rngs = dev.report.base.app.environment.defaultSelection.getRanges(), backend = dev.report.backend, sel = [], sets = [], ccmd = [], i = -1, rng;
		if (typeof scope != "string") {
			scope = ""
		}
		while ((rng = rngs[++i]) !== undefined) {
			sel.push(rng.getCoords())
		}
		if (rules instanceof Array) {
			var jwstyle = dev.report.base.style, rule, style, borders, btype, border, ranges, set, j;
			i = -1;
			while ((rule = rules[++i]) !== undefined) {
				set = {
					rule : rule.type.concat("(", rule.operator, rule.sit
									? ";1;)"
									: ";0;)")
				};
				if ("format" in rule && typeof rule.format == "string"
						&& rule.format != "") {
					set.format = rule.format
				}
				if ("style" in rule
						&& (style = jwstyle.convJStoCSS(rule.style)) != "") {
					set.style = style
				}
				if ("lock" in rule && typeof rule.lock == "boolean") {
					set.lock = rule.lock
				}
				if ("borders" in rule && rule.borders instanceof Object
						&& !("length" in rule.borders)) {
					borders = {};
					for (btype in rule.borders) {
						if (_borderTypes.indexOf(btype) != -1
								&& (border = jwstyle
										.borderStyle2CSS(rule.borders[btype])) != "") {
							borders[btype] = border
						}
					}
					for (btype in borders) {
						set.border = borders;
						break
					}
				}
				if ("operands" in rule && rule.operands instanceof Array
						&& rule.operands.length) {
					set.operands = rule.operands
				}
				if ("applies_to" in rule) {
					if ("id" in rule) {
						set.id = rule.id
					}
					rngs = dev.report.base.formula.parse(rule.applies_to);
					j = -1;
					ranges = [];
					while ((rng = rngs[++j]) !== undefined) {
						ranges.push(rng.rng)
					}
				} else {
					if ("id" in rule) {
						continue
					}
					ranges = sel
				}
				if (!ranges.length) {
					continue
				}
				set.ranges = ranges;
				sets.push(set)
			}
		}
		if (sets.length) {
			ccmd.push(["cfset", scope].concat(sets))
		}
		if (moves instanceof Array && moves.length && !(moves.length % 2)) {
			ccmd.push(["cfmov", scope, sel].concat(moves))
		}
		if (ccmd.length) {
			backend.ccmd(true, ccmd, true, backend.Q_STYLE | backend.Q_FMT_VAL
							| backend.Q_FMT | backend.Q_LOCK, backend.D_NONE)
		}
	};
	this.get = function(scope) {
		var defSel = dev.report.base.app.environment.defaultSelection, conn = dev.report.backend, jwstyle = dev.report.base.style, params = [], i = -1, rule, rules, ruletmp, css;
		switch (scope) {
			case that.SCOPE_CURR_SEL :
			case undefined :
				var rngs = defSel.getRanges(), ranges = [], rng;
				while ((rng = rngs[++i]) !== undefined) {
					ranges.push(rng.getCoords())
				}
				if (ranges.length) {
					params.push("", ranges)
				}
				break;
			case that.SCOPE_CURR_WKS :
				break;
			default :
				if (typeof scope == "string") {
					params.push(scope)
				}
				break
		}
	//	rules = conn.ccmd(null, ["cfget"].concat(params));

		var resString="[[true,[]]]";
		rules=Ext.encode(resString);
		if (rules[0][0] !== true || !(rules[0][1] instanceof Array)) {
			return []
		}
		rules = rules[0][1];
		i = -1;
		while ((rule = rules[++i]) !== undefined) {
			ruletmp = rule.rule.split("(");
			delete rule.rule;
			rule.type = ruletmp[0];
			ruletmp = ruletmp[1].split(";");
			rule.operator = ruletmp[0];
			rule.sit = ruletmp[1] == "1" ? true : false;
			if (typeof rule.style == "string") {
				rule.style = jwstyle.convCSStoJS(rule.style)
			}
			if (rule.format === "") {
				rule.format = null
			}
			if (!("border" in rule)) {
				continue
			}
			for (btype in rule.border) {
				if ((css = rule.border[btype]) != ""
						&& (css = css.split(" ")).length == 3) {
					rule.border[btype] = {
						width : css[0],
						type : css[1],
						color : css[2]
					}
				} else {
					delete rule.border[btype]
				}
			}
			for (btype in rule.border) {
				rule.borders = rule.border;
				break
			}
			delete rule.border
		}
		return rules
	};
	this.remove = function(scope, ids) {
		var defSel = dev.report.base.app.environment.defaultSelection, conn = dev.report.backend, params = [];
		switch (scope) {
			case that.SCOPE_CURR_SEL :
			case undefined :
				var rngs = defSel.getRanges(), ranges = [], i = -1, rng;
				while ((rng = rngs[++i]) !== undefined) {
					ranges.push(rng.getCoords())
				}
				if (ranges.length) {
					params.push("", ranges)
				}
				break;
			case that.SCOPE_CURR_WKS :
				break;
			case that.SCOPE_RULE_IDS :
				if (ids instanceof Array) {
					params.push("", [], ids)
				}
				break;
			default :
				if (typeof scope == "string") {
					params.push(scope)
				}
				break
		}
		conn.ccmd(true, ["cfdel"].concat(params), true, conn.Q_STYLE
						| conn.Q_FMT_VAL | conn.Q_FMT | conn.Q_LOCK,
				conn.D_NONE)
	}
};