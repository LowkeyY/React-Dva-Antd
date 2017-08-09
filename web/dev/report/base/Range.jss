
Ext.namespace("dev.report.base");
dev.report.base.Range  =  function() {
	this.RangeMode = {
		NONE : 0,
		EDIT : 1,
		HIDDEN : 2
	};
	this.RangeType = {
		NORMAL : 0,
		FORMULA : 1,
		MARK : 2
	};
	this.AreaStatus = {
		NORMAL : 0,
		HOVERING : 1,
		DRAGGING : 2,
		RESIZING : 3,
		EXPANDING : 4,
		MOVING : 5
	};
	this.AreaState = {
		NORMAL : 0,
		NEW : 1
	};
	this.BorderState = {
		NORMAL : 0,
		BOLD : 1,
		UNKOWN : 2,
		DOTTED : 3
	};
	this.DisplayStatus = {
		VISIBLE : 0,
		HIDDEN : 1
	};
	this.ResizeDirection = {
		NONE : 0,
		SOUTH_EAST : 1,
		SOUTH_WEST : 2,
		NORTH_EAST : 3,
		NORTH_WEST : 4
	};
	this.ContentType = {
		FORMULA : 1,
		STYLE : 2,
		FORMAT : 4,
		ATTRS : 8,
		CNDFMT : 16,
		ALL_CLEAR : 1 | 2 | 4 | 8,
		ALL_PASTE : 1 | 2 | 4 | 8 | 16,
		VALUE : 32
	};
	this.drawDependingCells = function(formulastr) {
		var env = dev.report.base.app.environment, refs = dev.report.base.formula.parse(
				formulastr, dev.report.base.app.activePane.getCellNFs(
						env.selectedCellCoords[0], env.selectedCellCoords[1]));
		if (refs.sgn == env.formulaSelection.lastParseRes.sgn) {
			return
		}
		env.formulaSelection.lastParseRes = refs;
		var refs_tbl = refs.tbl, toks = {}, tok, key;
		for (key in refs_tbl) {
			toks[key] = refs_tbl[key].slice()
		}
		for (var area, area_tok, states = dev.report.base.range.AreaState, areas = env.formulaSelection
				.getRanges().slice(), i = areas.length - 1; i >= 0; --i) {
			area = areas[i];
			area_tok = area.formulaToken;
			key = area_tok.key;
			if (!(key in toks)) {
				env.formulaSelection.removeRange(i);
				continue
			}
			tok = toks[key].shift();
			if (area_tok.id != tok.id || area.getState() == states.NEW) {
				area_tok.id = tok.id, area.setState(states.NORMAL), area
						.repaint()
			}
			area.formulaToken = tok;
			if (!toks[key].length) {
				delete toks[key]
			}
		}
		var activeSheet = dev.report.base.app.activeBook.getSheetSelector()
				.getActiveSheetName(), Point = dev.report.gen.Point;
		for (key in toks) {
			for (var i = toks[key].length - 1; i >= 0; --i) {
				tok = toks[key][i];
				if (tok.sheet.length && tok.sheet != activeSheet) {
					continue
				}
				var area = env.formulaSelection.getRange(env.formulaSelection
						.addRange(new Point(tok.rng[0], tok.rng[1]), new Point(
										tok.rng[2], tok.rng[3]), tok.nf)
						- 1);
				area.formulaToken = tok;
				area.draw()
			}
		}
	};
	this.getCellCoord = function(cell) {
		return [
				[dev.report.util.offsetLeft(cell),
						dev.report.util.offsetLeft(cell) + cell.offsetWidth],
				[dev.report.util.offsetTop(cell),
						dev.report.util.offsetTop(cell) + cell.offsetHeight]]
	};
	this.unsetArrayFormula = function() {
		var rngs = dev.report.base.app.environment.defaultSelection.getRanges(), backend = dev.report.backend, ccmd = ["uaf"], i = -1, rng;
		while ((rng = rngs[++i]) !== undefined) {
			ccmd.push(rng.getCoords())
		}
		backend.ccmd(true, ccmd, true, backend.Q_VALUE | backend.Q_STYLE
						| backend.Q_FORMULA_WE | backend.Q_FMT_VAL
						| backend.Q_FMT | backend.Q_FORMULA_NF)
	}
};