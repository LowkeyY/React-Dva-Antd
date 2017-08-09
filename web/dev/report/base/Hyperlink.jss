
Ext.namespace("dev.report.base");
using("dev.report.gen.Point");
dev.report.base.Hyperlink =function(){
	var that = this, _defCnt = "_new", _tipFormats = ["default", "simple"];
	this.hlTag = {
		begin : '<span class="hl" onmouseover="dev.report.base.hl.toolTip(event, true);" onmouseout="dev.report.base.hl.toolTip(event, false);">',
		end : "</span>",
		oldBegin : '<span class="hl">'
	};
	var _dData = {
		dyn : true,
		link : ["abc.wss", "abc.wss hl"],
		text : ["Some hyperlink text", "Some hyperlink text"],
		tip : ["D3", "Some tip"],
		trans : [{
					src : ["A2:B4", [2, 3, 4, 5]],
					dst : "A2:B4"
				}, {
					src : ["@var1", 50],
					dst : "A5"
				}, {
					src : ["Sheet1!aaa", 50],
					dst : "Sheet1!A5"
				}, {
					src : ["['value1', 'value2', 'value3']",
							"['value1', 'value2', 'value3']"],
					dst : "Some const"
				}]
	}, _sData = {
		dyn : false,
		link : {
			type : "obj",
			value : {
				type : "local",
				target : {
					path : "/Jedox/Financials/DeveLabs-praznici-odmori.pdf",
					ghnt : {
						g : "fgrp1",
						h : "h1",
						n : "n36",
						t : "pdf"
					},
					sheet : null,
					range : null
				}
			}
		},
		text : {
			type : "ref",
			value : "D1"
		},
		tip : {
			type : "string",
			value : "Some tip",
			format : "default"
		},
		trans : [{
					src : {
						type : "range",
						value : "B7"
					},
					dst : {
						type : "nrange",
						value : "testnr"
					}
				}, {
					src : {
						type : "range",
						value : "A2"
					},
					dst : {
						type : "range",
						value : "Sheet1!A2:B3"
					}
				}]
	};
	function _sDataToFunc(data) {
		var loc, txt, tip, trans = "";
		function convStrRef(val) {
			var isString = val.type == "string";
			return (isString ? '"' : "").concat(val.value, isString ? '"' : "")
		}
		function convSrcDst(type, val) {
			var res = "", isDst = type == "dst";
			switch (val.type) {
				case "range" :
				case "nrange" :
					var rngElems = val.value.split("!", 2);
					if (rngElems.length > 1) {
						res = (rngElems[0].indexOf(" ") >= 0 ? "'".concat(
								rngElems[0], "'") : rngElems[0]).concat("!",
								rngElems[1])
					} else {
						res = val.value
					}
					break;
				case "var" :
					res = (val.value.indexOf("@") ? "@" : "").concat(val.value);
					break;
				case "cval" :
					return '"'.concat(val.value, '"');
				case "clist" :
					return "\"['".concat(val.value.join("','"), "']\"")
			}
			return (isDst ? '"' : "").concat(res, isDst ? '"' : "")
		}
		if (data.link.type == "ref") {
			loc = data.link.value
		} else {
			switch (data.link.value.type) {
				case "local" :
					switch (data.link.value.target.ghnt.t) {
						case "workbook" :
							var sheetExists = data.link.value.target.sheet != null, rangeExists = data.link.value.target.range != null;
							loc = '"'
									.concat(
											sheetExists || rangeExists
													? "["
													: "",
											data.link.value.target.path,
											sheetExists || rangeExists
													? "]"
													: "",
											sheetExists
													? (data.link.value.target.sheet
															.indexOf(" ") >= 0
															? "'"
																	.concat(
																			data.link.value.target.sheet,
																			"'")
															: data.link.value.target.sheet)
															.concat("!")
													: "",
											rangeExists
													? data.link.value.target.range
													: "", '"');
							break;
						default :
							loc = '"'.concat(data.link.value.target.path, '"');
							break
					}
					break;
				case "url" :
					loc = '"'.concat(data.link.value.target, '"');
					break
			}
		}
		txt = convStrRef(data.text);
		tip = convStrRef(data.tip);
		var sep = dev.report.base.i18n.separators[2];
		for (var i = 0, trns = data.trans, trnsLen = trns.length; i < trnsLen; i++) {
			if (!trns[i].src || !trns[i].dst) {
				continue
			}
			trans = trans.concat(sep, convSrcDst("src", trns[i].src), sep,
					convSrcDst("dst", trns[i].dst))
		}
		return "=HYPERLINK(".concat(loc, sep, txt, sep, tip, trans, ")")
	}
	function _convertSDataLink(cb, link) {
		var cnt = _defCnt, hashIdx = link.lastIndexOf("#"), hasCb = cb instanceof Array
				&& cb.length > 1;
		if (hashIdx >= 0) {
			cnt = link.substring(hashIdx + 1);
			link = link.substring(0, hashIdx)
		}
		var re_inSquareBracket = /^\[[\w\W]*\]/, wbType = link
				.match(re_inSquareBracket), path = wbType == null
				? link
				: wbType[0].substring(1, wbType[0].length - 1), isSelf = !path
				.search(/^[^\/]+[\w\W]*.wss$/)
				|| path.toUpperCase() == "SELF", isLocal = wbType != null
				|| !path.search(/^\/[\w]*/) || isSelf, cbConvert = function(res) {
			var locTarget = !isLocal ? path : {
				path : path,
				ghnt : isSelf ? null : res
			};
			if (isLocal && !isSelf && locTarget.ghnt == null) {
				if (hasCb) {
					cb[1].call(cb[0], "follHLInvalidWB");
					return
				} else {
					throw "follHLInvalidWB"
				}
			}
			if (!isLocal && !locTarget.length) {
				if (hasCb) {
					cb[1].call(cb[0], "follHLInvalidURL");
					return
				} else {
					throw "follHLInvalidURL"
				}
			}
			var loc = {
				type : "obj",
				value : {
					type : isLocal ? "local" : "url",
					target : locTarget
				},
				cnt : cnt
			};
			if (isLocal && (isSelf || loc.value.target.ghnt.t == "workbook")) {
				var selStr = wbType == null ? "" : link
						.substr(wbType[0].length);
				if (selStr.length) {
					var selArr = selStr.split("!");
					if (selArr.length > 1) {
						loc.value.target.sheet = !selArr[0].search(/^'[^']*'$/)
								? selArr[0].substring(1, selArr[0].length - 1)
								: selArr[0];
						loc.value.target.range = selArr[1]
					} else {
						loc.value.target.sheet = null;
						loc.value.target.range = selArr[0]
					}
				} else {
					loc.value.target.sheet = null;
					loc.value.target.range = null
				}
			}
			if (hasCb) {
				cb[1].call(cb[0], loc)
			} else {
				return loc
			}
		};
		if (isLocal && !isSelf) {
			if (hasCb) {
				var rqst = new dev.report.backend.RPCAsyncRqst("WSS",
						"resolveNodePath", [path]);
				rqst.setOnSuccess([that, cbConvert]).send()
			} else {
				return cbConvert(dev.report.backend.wss.resolveNodePath(path))
			}
		} else {
			return cbConvert()
		}
	}
	function _dDataToSData(cb, attr, incTrans) {
		var conn = dev.report.backend, activePane = dev.report.base.app.activePane, hasCb = cb instanceof Array
				&& cb.length > 1;
		function resolveRef(refStr) {
			if (!refStr.indexOf("@")) {
				var wbVar = conn.ccmd(0, ["gvar", refStr.substr(1)]);
				if (!wbVar[0][0] || !wbVar[0][1].length) {
					throw "badRef"
				}
				return wbVar[0][1]
			} else {
				var ref = dev.report.base.formula.parse(refStr);
				if (!ref.length) {
					throw "badRef"
				}
				ref = ref[0];
				return activePane.getCellUVal(ref.rng[0], ref.rng[1])
			}
		}
		function getPairVal(val) {
			try {
				return val[0] == val[1] ? val[0] : resolveRef(val[0])
			} catch (e) {
				return val[0]
			}
		}
		function parseType(val) {
			if (val[0] == val[1]) {
				return "cval"
			} else {
				if (!val[0].search(/^\{[\w\W]*\}/)) {
					return "clist"
				} else {
					return !val[0].search(/^@/) ? "var" : (formula
							.parse(val[0]).length ? "range" : "nrange")
				}
			}
		}
		var txt = attr.text[0] == attr.text[1] ? {
			type : "string",
			value : getPairVal(attr.text)
		} : {
			type : "ref",
			value : attr.text[0]
		};
		var tip = attr.tip[0] == attr.tip[1] ? {
			type : "string",
			value : getPairVal(attr.tip)
		} : {
			type : "ref",
			value : attr.tip[0]
		}, tipFmtSep;
		if ((tipFmtSep = tip.value.lastIndexOf("#")) >= 0) {
			var tipFmt = tip.value.substr(tipFmtSep + 1);
			if (_tipFormats.indexOf(tipFmt) >= 0) {
				tip.format = tipFmt;
				tip.value = tip.value.substr(0, tipFmtSep)
			} else {
				tip.format = _tipFormats[0]
			}
		}
		var trans = [];
		if (incTrans === true) {
			for (var i = 0, trns = attr.trans, trnsLen = trns.length, inSqareBrack, trnsPair = {}, formula = dev.report.base.formula, trgDstTypes = "range,var", trgDstType; i < trnsLen; i++, trnsPair = {}) {
				if (!trns[i].src || !trns[i].dst || trns[i].src.length <= 1) {
					continue
				}
				trgDstType = parseType(trns[i].dst);
				if (trgDstTypes.search(trgDstType) < 0
						&& !trns[i].src[0].length) {
					continue
				}
				trnsPair.src = {
					type : parseType(trns[i].src),
					value : trns[i].src[0],
					rvalue : trns[i].src[1]
				};
				trnsPair.dst = {
					type : trgDstType,
					value : trns[i].dst[0],
					rvalue : trns[i].dst[1]
				};
				trans.push(trnsPair)
			}
		}
		var cbConvert = function(res) {
			var sData = {
				dyn : false,
				link : res ? res : {
					type : "ref",
					value : attr.link[0],
					cnt : _defCnt
				},
				text : txt,
				tip : tip,
				trans : trans
			};
			if (hasCb) {
				cb[1].call(cb[0], sData)
			} else {
				return sData
			}
		};
		if (attr.link[0] == attr.link[1]) {
			if (hasCb) {
				_convertSDataLink([that, cbConvert], getPairVal(attr.link))
			} else {
				return cbConvert(_convertSDataLink(null, getPairVal(attr.link)))
			}
		} else {
			return cbConvert()
		}
	}
	function _resolveFormula(frm) {
		var activeBook = dev.report.base.app.activeBook, conn = activeBook._conn, actSheet = activeBook
				.getSheetSelector().getActiveSheetName(), tmpName = "tmp_"
				.concat(Math.ceil(Math.random() * 10000000000)), res = conn
				.ccmd(0, ["nadd", [1, 1, {
							name : tmpName,
							refers_to : (!frm.search(/^=/) ? "" : "=")
									.concat(frm),
							scope : actSheet,
							comment : "Temporary Named Range"
						}]]);
		if (res[0][0]) {
			conn.ccmd(0, ["ndel", res[0][1][0].uuid])
		}
		return res[0][0]
				? [res[0][0], res[0][1][0].uuid, res[0][1][0].value]
				: res[0]
	}
	function _resolveSData(cb, data, incTrans) {
		var resTarget = [], resData = [], hasCb = cb instanceof Array
				&& cb.length > 1;
		if (data.link.type == "ref") {
			resTarget.push([data.link, "rvalue"]), resData
					.push(data.link.value)
		}
		if (data.text.type == "ref") {
			resTarget.push([data.text, "rvalue"]), resData
					.push(data.text.value)
		}
		if (data.tip.type == "ref") {
			resTarget.push([data.tip, "rvalue"]), resData.push(data.tip.value)
		}
		if (incTrans === true) {
			for (var i = 0, trns = data.trans, trnsLen = trns.length, resTypes = "range,nrange,var", parseDst = data.link.type == "obj"
					&& data.link.value.type == "url", resT = resTarget, resD = resData; i < trnsLen; i++) {
				if (!trns[i].src || !trns[i].dst) {
					continue
				}
				if (resTypes.search(trns[i].src.type) >= 0) {
					resT.push([trns[i].src, "rvalue"]), resD
							.push(trns[i].src.value)
				} else {
					if (trns[i].src.type == "clist") {
						trns[i].src.rvalue = [trns[i].src.value.split(",")]
					}
				}
				if (parseDst) {
					if (resTypes.search(trns[i].dst.type) >= 0) {
						resT.push([trns[i].dst, "rvalue"]), resD
								.push(trns[i].dst.value)
					} else {
						if (trns[i].dst.type == "clist") {
							trns[i].dst.rvalue = [trns[i].dst.value.split(",")]
						}
					}
				}
			}
		}
		if (resData.length) {
			var rslVal = _resolveFormula("=RESOLVE(".concat(resData
							.join(dev.report.base.i18n.separators[2]), ")"));
			if (!rslVal[0]) {
				throw "resolveError"
			}
			for (var j = 0, rT = resTarget, rVals = Ext.util.JSON
					.decode(rslVal[2]), rTLen = rT.length; j < rTLen; j++) {
				rT[j][0][rT[j][1]] = rVals[j]
			}
		}
		var cbConvert = function(res) {
			if (data.link.type == "ref") {
				data.link.rvalue = res.value
			}
			var convRes = rslVal ? rslVal[1] : null;
			if (hasCb) {
				cb[1].call(cb[0], convRes)
			} else {
				return convRes
			}
		};
		if (data.link.type == "ref") {
			if (hasCb) {
				_convertSDataLink([that, cbConvert], data.link.rvalue)
			} else {
				return cbConvert(_convertSDataLink(null, data.link.rvalue))
			}
		} else {
			return cbConvert()
		}
	}
	function _isEmptyObj(obj) {
		for (var fld in obj) {
			return false
		}
		return true
	}
	this.set = function(hdata) {
		var activeBook = dev.report.base.app.activeBook, general = dev.report.base.general, env = dev.report.base.app.environment, conn = activeBook._conn, range = env.defaultSelection
				.getActiveRange().getCoords(), cell = activeBook._aPane
				.getCell(range[0], range[1]), txt = "Hyperlink", rslVal = [false];
		if (hdata.text.type == "string") {
			txt = hdata.text.value
		} else {
			rslVal = _resolveFormula(hdata.text.value);
			if (rslVal[0]) {
				txt = rslVal[2]
			}
		}
		hdata = ["hl", hdata];
		var rngUpd = {
			a : {
				mousedown : hdata
			}
		};
		if (cell == undefined || (!cell.t && (cell.m || cell.s))
				|| "s,h,e".search(cell.t) >= 0) {
			rngUpd.v = this.hlTag.begin.concat(txt, this.hlTag.end)
		}
		rngUpd.s = dev.report.base.style.hyperlinkStyle;
		range.push(rngUpd);
		conn.ccmdBuffer();
		conn.ccmd(null, ["cdrn", {
							cm : true
						}, range]);
		conn.ccmdFlush(true, true, conn.Q_VALUE | conn.Q_STYLE
						| conn.Q_FORMULA_WE | conn.Q_ATTRS | conn.Q_FMT_VAL,
				conn.D_NONE);
		dev.report.base.app.environment.selectedCellValue = this.hlTag.begin.concat(
				txt, this.hlTag.end)
	};
	this.get = function(range, cb) {
		if (!range) {
			return undefined
		}
		var cell = dev.report.base.app.activePane.getCell(range[0], range[1]), hasCb = cb instanceof Array
				&& cb.length > 1;
		if (cell == undefined) {
			var cbGet = function(res) {
				var attr;
				cb[1].call(cb[0], res[0] && res[0][0]
								&& !_isEmptyObj((attr = res[0][1][3]))
								&& attr.a && attr.a.mousedown
								&& attr.a.mousedown[0] == "hl"
								? attr.a.mousedown[1]
								: undefined)
			};
			return hasCb ? dev.report.base.app.activePane._conn
					.ccmd([this, cbGet], ["grar", 16, range[0], range[1],
									range[0], range[1]]) : undefined
		}
		var res = typeof cell == "object" && ("a" in cell)
				&& ("mousedown" in cell.a) && cell.a.mousedown[0] == "hl"
				? cell.a.mousedown[1]
				: undefined;
		if (hasCb) {
			cb[1].call(cb[0], res)
		} else {
			return res
		}
	};
	this.remove = function() {
		var env = dev.report.base.app.environment, range = [
				env.lastRangeStartCoord[0], env.lastRangeStartCoord[1],
				env.lastRangeEndCoord[0], env.lastRangeEndCoord[1]], activePane = dev.report.base.app.activePane, general = dev.report.base.general, conn = activePane._conn;
		for (var i = range[1], delHLStyle = dev.report.base.style.delHyperlinkStyle, j, cell, rngUpd; i <= range[3]; ++i) {
			for (j = range[0]; j <= range[2]; ++j) {
				if (!(cell = activePane.getCell(j, i))) {
					return
				}
				rngUpd = {
					s : delHLStyle
				};
				if (cell.t == "h") {
					rngUpd.v = general.filterHLTags(j, i, cell.v, false)
				}
				range.push(rngUpd)
			}
		}
		conn.ccmdBuffer();
		conn.ccmd(null, ["clat", [range[0], range[1], range[2], range[3]]]);
		conn.ccmd(null, ["cdrn", {
							cm : true
						}, range]);
		conn.ccmdFlush(true, true, conn.Q_VALUE | conn.Q_STYLE
						| conn.Q_FORMULA_WE | conn.Q_ATTRS | conn.Q_FMT_VAL,
				conn.D_NONE)
	};
	this.updateText = function(range, txt) {
		if (dev.report.base.app.activePane.getCellType(range[0], range[1]) == "h") {
			var hdata = this.get(range);
			if (hdata == undefined) {
				return
			}
			hdata.text.type = "string";
			hdata.text.value = txt;
			range.push({
						a : {
							mousedown : ["hl", hdata]
						}
					});
			dev.report.backend.ccmd(0, ["cdrn", {
								cm : true
							}, range])
		}
	};
	this.followURL = function(data, cnt) {
		if (!data.link.value.target.search(/^mailto:*/i)) {
			var sleepCnt = 0, execMailto = function() {
				if (sleepCnt < 50 && dev.report.base.wsel.Widget.isLocked()) {
					sleepCnt++;
					setTimeout(execMailto, 100)
				} else {
					var win = window
							.open(
									data.link.value.target,
									"winURL",
									"directories=no,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no");
					win.close()
				}
			};
			execMailto();
			return false
		}
		function getSDVals(val) {
			var resTypes = "range,nrange,var", res = val.type == "clist"
					? val.rvalue[0]
					: val[resTypes.search(val.type) >= 0 ? "rvalue" : "value"];
			return Ext.isArray(res) ? res : [res]
		}
		function chkTrnsVal(val) {
			return !val.length
					|| (val.length == 1 && val[0] instanceof Object && _isEmptyObj(val[0]))
		}
		var transData = {}, trg = data.link.value.target;
		if (!cnt) {
			cnt = data.link.cnt == undefined ? _defCnt : data.link.cnt
		}
		for (var i = 0, trns = data.trans, trnsLen = trns.length, src, dst; i < trnsLen; i++) {
			if (!trns[i].src || !trns[i].dst
					|| chkTrnsVal(src = getSDVals(trns[i].src))
					|| chkTrnsVal(dst = getSDVals(trns[i].dst))) {
				continue
			}
			for (var j = 0, k = 0, tData = transData, srcLen = src.length; j < srcLen; j++, k++) {
				tData[src[j]] = !dst[k] ? dst[k = 0] : dst[k]
			}
		}
		var url = Ext.urlAppend((trg.search(/:\/\//) < 0 ? "http://" : "")
						.concat(trg.replace(/\/$/, "")), Ext
						.urlEncode(transData));
		if (dev.report.base.app.standalone) {
			window
					.open(
							url,
							"winURL",
							"directories=yes,menubar=yes,toolbar=yes,location=yes,status=yes,resizable=yes,scrollbars=yes")
		} else {
			try {
				for (var triggers = dev.report.base.events.triggers.openURL, i = triggers.length
						- 1, hlURL = url; i >= 0; i--) {
					triggers[i][0]["openURL"].call(parent, triggers[i][1],
							hlURL, cnt, data.text[data.text.type == "string"
									? "value"
									: "rvalue"], true)
				}
			} catch (e) {
				dev.report.base.general.showMsg("Application Error".localize(), e
								.localize(), Ext.MessageBox.WARNING)
			}
		}
		return false
	};
	this.followOther = function(link, cnt) {
		if (dev.report.base.app.standalone) {
			var ghnt = link.target.ghnt;
			window
					.open(
							"/be/studio/static.php/Untitled?t=file&g=".concat(
									ghnt.g, "&h=", ghnt.h, "&n=", ghnt.n,
									"&sid=", dev.report.base.app.sessId),
							"winStatic",
							"directories=yes,menubar=yes,toolbar=yes,location=yes,status=yes,resizable=yes,scrollbars=yes")
		} else {
			try {
				for (var triggers = dev.report.base.events.triggers.openOther, i = triggers.length
						- 1, ghnt = link.target.ghnt; i >= 0; i--) {
					triggers[i][0]["openOther"].call(parent, triggers[i][1],
							ghnt, cnt ? cnt : _defCnt, true)
				}
			} catch (e) {
				dev.report.base.general.showMsg("Application Error".localize(), e
								.localize(), Ext.MessageBox.WARNING)
			}
		}
		return false
	};
	this.followWb = function(data) {
		var activeBook = dev.report.base.app.activeBook, showMsg = dev.report.base.general.showMsg, linkVal = data.link.type == "ref"
				? data.link.rvalue
				: data.link.value, rng = [], ext = {
			cbkey : "hl",
			appmode : dev.report.base.app.appMode
		}, srcWsId = dev.report.base.app.activeSheet.getUid(), hasAfterTrans = false;
		if (linkVal.target.sheet != null) {
			if (dev.report.base.app.UPRestrictMode
					&& linkVal.target.sheet != activeBook._sheetSelector
							.getActiveSheetName()) {
				showMsg("follHLTmpDisabledRef".localize(),
						"follHLTmpDisabledWS".localize(),
						Ext.MessageBox.WARNING);
				return false
			}
			ext.sheet_name = linkVal.target.sheet
		}
		if (linkVal.target.range == null || !linkVal.target.range.length) {
			rng = [1, 1, 1, 1]
		} else {
			var rngParsed = dev.report.base.formula.parse(linkVal.target.range);
			if (!rngParsed.length) {
				ext.nrange = linkVal.target.range
			} else {
				if (rngParsed.length > 1) {
					showMsg("follHLInvalidRef".localize(), "follHLInvalidRng"
									.localize(), Ext.MessageBox.WARNING);
					return false
				}
				rng = rngParsed[0].rng
			}
		}
		var transExec = function(params, cb) {
			var conn = dev.report.backend, isFullTrans = params != undefined
					&& params.fullTrans != undefined && params.fullTrans, isBeforeLoad = !isFullTrans
					&& params != undefined
					&& params.beforeLoad != undefined
					&& params.beforeLoad;
			if (!params[linkVal.target.range]) {
				if (!rng.length) {
					rng = [1, 1, 1, 1]
				}
			} else {
				var paramsNR = !params[linkVal.target.range].search(/^=/)
						? params[linkVal.target.range].substr(1)
						: params[linkVal.target.range], rngP = dev.report.base.formula
						.parse(paramsNR);
				rng = rngP.length ? rngP[0].rng : [1, 1, 1, 1]
			}
			if (!data.trans.length
					|| (!isFullTrans && !isBeforeLoad && !hasAfterTrans)) {
				if (cb instanceof Array && cb.length > 1) {
					cb[1].call(cb[0])
				}
				return
			}
			if (isFullTrans || !isBeforeLoad) {
				dev.report.base.app.activeBookTmp = dev.report.base.app.activeBook;
				delete dev.report.base.app.activeBook
			}
			var sheetPool = {}, namedRangePool = [], sheets = {}, sheetList = dev.report.backend.wss
					.getSheets(null, true), actSheetId = sheetList[1], actSheetName;
			for (var i = 0, sheetListLen = sheetList[0].length; i < sheetListLen; i += 2) {
				sheets[sheetList[0][i + 1]] = sheetList[0][i];
				if (sheetList[0][i] == sheetList[1]) {
					actSheetName = sheetList[0][i + 1]
				}
			}
			var resolveRange = function(range) {
				var refs = dev.report.base.formula.parse(range);
				return refs.length == 1 ? refs : false
			}, genSrcData = function(src, len, plVal, multiDim) {
				var srcVal = src.type == "cval" || src.type == "clist"
						? src.value
						: src.rvalue;
				srcVal = srcVal == null ? "" : srcVal;
				srcVal = Ext.isArray(srcVal)
						? (srcVal.length ? srcVal : [""])
						: [srcVal];
				var srcObjs = [], res = [];
				for (var i = 0, sArr = srcVal, srcLen = sArr.length, j, subSrc, subSrcLen; i < srcLen; i++) {
					if (sArr[i] instanceof Array) {
						if (multiDim) {
							subSrc = []
						}
						for (j = 0, subSrcLen = sArr[i].length; j < subSrcLen; j++) {
							(multiDim ? subSrc : srcObjs).push(plVal
									? dev.report.base.general.str2var(sArr[i][j]).v
									: {
										v : dev.report.base.general
												.str2var(sArr[i][j]).v
									})
						}
						if (multiDim) {
							srcObjs.push(subSrc)
						}
					} else {
						srcObjs.push(plVal
								? dev.report.base.general.str2var(sArr[i]).v
								: {
									v : dev.report.base.general.str2var(sArr[i]).v
								})
					}
				}
				if (len) {
					while (res.length < len) {
						res = res.concat(srcObjs)
					}
					return res.slice(0, len)
				} else {
					return srcObjs
				}
			}, splitRange = function(fullRng) {
				var rngElems = fullRng.split("!", 2);
				return rngElems.length > 1 ? {
					sheet : !rngElems[0].search(/^'[^']*'$/) ? rngElems[0]
							.substring(1, rngElems[0].length - 1) : rngElems[0],
					range : rngElems[1]
				}
						: {
							sheet : actSheetName,
							range : rngElems[0]
						}
			}, appendRange = function(dstRng, src) {
				dstRng = !dstRng.search(/^=/) ? dstRng.substr(1) : dstRng;
				var rngElems = splitRange(dstRng);
				if (!sheets[rngElems.sheet]) {
					return
				}
				var parsedDstRng = resolveRange(rngElems.range);
				if (!parsedDstRng) {
					return
				}
				var dataArr = parsedDstRng[0].rng;
				dataArr = dataArr.concat(genSrcData(src, (dataArr[2]
								- dataArr[0] + 1)
								* (dataArr[3] - dataArr[1] + 1), false));
				if (sheetPool[sheets[rngElems.sheet]]) {
					sheetPool[sheets[rngElems.sheet]].rngs.push(dataArr)
				} else {
					sheetPool[sheets[rngElems.sheet]] = {
						rngs : [dataArr],
						nrngs : [],
						vars : []
					}
				}
			};
			for (var i = 0, trns = data.trans, trnsLen = trns.length, shts = sheets, splitRng = splitRange, sPool = sheetPool, nPool = namedRangePool, genSData = genSrcData, actSId = actSheetId, parsedDstRng, dataArr, rngElems; i < trnsLen; i++) {
				if (!trns[i].src
						|| !trns[i].dst
						|| (!isFullTrans && !isBeforeLoad && trns[i].dst.type == "var")) {
					continue
				}
				if (!isFullTrans && isBeforeLoad && trns[i].dst.type != "var") {
					hasAfterTrans = true;
					continue
				}
				switch (trns[i].dst.type) {
					case "cval" :
						if (srcWsId != dev.report.base.app.activeSheet.getUid()) {
							break
						}
					case "range" :
						appendRange(trns[i].dst.value, trns[i].src);
						break;
					case "nrange" :
						rngElems = splitRng(trns[i].dst.value);
						nPool.push({
									name : rngElems.range,
									uuid : shts[rngElems.sheet],
									src : trns[i].src
								});
						break;
					case "var" :
						dataArr = [
								!trns[i].dst.value.search(/^@/)
										? trns[i].dst.value.substr(1)
										: trns[i].dst.value,
								genSData(trns[i].src, 1, true)[0]];
						if (sPool[actSId]) {
							sPool[actSId].vars.push(dataArr)
						} else {
							sPool[actSId] = {
								rngs : [],
								nrngs : [],
								vars : [dataArr]
							}
						}
						break
				}
			}
			if (namedRangePool.length) {
				conn.ccmdBuffer();
				for (var i = 0, nrPool = namedRangePool, nrPoolLen = nrPool.length; i < nrPoolLen; i++) {
					conn.ccmd(0, [
									"nget",
									[
											1,
											1,
											nrPool[i].name,
											nrPool[i].uuid == undefined
													? ""
													: nrPool[i].uuid, true]]);
					conn.ccmd(0, ["nget", [1, 1, nrPool[i].name, "", true]])
				}
				for (var i = 0, nrRes = conn.ccmdFlush(), nrResLen = nrRes.length, actSId = actSheetId, sPool = sheetPool, nrPool = namedRangePool, genSData = genSrcData, refNR, dataArr, resArr, refTo; i < nrResLen; i += 2) {
					if (!nrRes[i][0] && !nrRes[i + 1][0]) {
						continue
					}
					try {
						resArr = genSData(nrPool[i / 2].src, 0, true, true);
						refNR = nrRes[nrRes[i][0]
								&& !_isEmptyObj(nrRes[i][1][0]) ? i : i + 1][1][0];
						refTo = "";
						for (var j = 0, resArrLen = resArr.length, colSep = dev.report.base.i18n.separators[3], rowSep = dev.report.base.i18n.separators[4]; j < resArrLen; j++) {
							if (resArr[j] instanceof Array) {
								for (var k = 0, subResArrLen = resArr[j].length; k < subResArrLen; k++) {
									refTo = refTo.concat(k ? colSep : rowSep,
											typeof resArr[j][k] == "string"
													? '"'.concat(resArr[j][k],
															'"')
													: resArr[j][k])
								}
							} else {
								refTo = refTo.concat(colSep,
										typeof resArr[j] == "string"
												? '"'.concat(resArr[j], '"')
												: resArr[j])
							}
						}
						if (refTo.length) {
							refTo = refTo.substr(1)
						}
						if (j > 1 || (k && k > 1)) {
							refTo = "{".concat(refTo, "}")
						}
						dataArr = [refNR.uuid, 1, 1, {
									name : refNR.name,
									refers_to : "=".concat(refTo),
									scope : refNR.scope,
									comment : refNR.comment
								}];
						if (sPool[actSId]) {
							sPool[actSId].nrngs.push(dataArr)
						} else {
							sPool[actSId] = {
								rngs : [],
								nrngs : [dataArr],
								vars : []
							}
						}
					} catch (e) {
					}
				}
			}
			if (!_isEmptyObj(sheetPool)) {
				conn.ccmdBuffer();
				if (params.wbid) {
					conn.ccmd(0, ["osel", 1, params.wbid])
				}
				if (sheetPool[actSheetId]) {
					for (var rngs = sheetPool[actSheetId].rngs, i = rngs.length
							- 1; i >= 0; i--) {
						conn.ccmd(0, ["cdrn", {
											cm : true
										}, rngs[i]])
					}
					if (sheetPool[actSheetId].nrngs) {
						for (var nrngs = sheetPool[actSheetId].nrngs, i = nrngs.length
								- 1; i >= 0; i--) {
							conn.ccmd(0, ["nupd", nrngs[i]])
						}
					}
					for (var vars = sheetPool[actSheetId].vars, i = vars.length
							- 1; i >= 0; i--) {
						conn.ccmd(0, ["svar"].concat(vars[i]))
					}
					delete(sheetPool[actSheetId])
				}
				var sheetChanged = false;
				for (var oSheet in sheetPool) {
					conn.ccmd(0, ["osel", 2, oSheet]);
					sheetChanged = true;
					for (var rngs = sheetPool[oSheet].rngs, i = rngs.length - 1; i >= 0; i--) {
						conn.ccmd(0, ["cdrn", {
											cm : true
										}, rngs[i]])
					}
				}
				if (sheetChanged) {
					conn.ccmd(0, ["osel", 2, actSheetId])
				}
				if (isFullTrans || !isBeforeLoad) {
					dev.report.base.app.activeBook = dev.report.base.app.activeBookTmp
				}
				conn.ccmdFlush(cb, true)
			}
			if (isFullTrans || !isBeforeLoad) {
				if (!dev.report.base.app.activeBook) {
					dev.report.base.app.activeBook = dev.report.base.app.activeBookTmp
				}
				delete dev.report.base.app.activeBookTmp
			}
		};
		function makeSelection(cb, err) {
			if (err) {
				showMsg("follHLInvalidRef".localize(), err.localize(),
						Ext.MessageBox.WARNING);
				return false
			}
			var env = dev.report.base.app.environment, selPanes = dev.report.base.app.activeSheet
					.getPanesByCoords(rng[0], rng[1]), callFnCb = function() {
				if (cb instanceof Array && cb.length > 1) {
					cb[1].call(cb[0])
				}
			};
			if (env.viewMode == dev.report.base.grid.viewMode.DESIGNER) {
				var defSel = env.defaultSelection, cbScroll = function() {
					defSel.set(new dev.report.gen.Point(rng[0], rng[1]),
							new dev.report.gen.Point(rng[2], rng[3]));
					defSel.draw();
					callFnCb()
				}
			}
			var scrollPane = function(idx) {
				if (idx < 0) {
					return cbScroll ? cbScroll() : callFnCb()
				}
				if (!selPanes[idx].isCellVisible(rng[0], rng[1])) {
					selPanes[idx].scrollTo([this, function() {
										scrollPane(idx - 1)
									}], rng[0], rng[1], true, false)
				} else {
					scrollPane(idx - 1)
				}
			};
			scrollPane(selPanes.length - 1)
		}
		try {
			var ghnt = linkVal.target.ghnt, cnt = data.link.cnt == undefined
					? _defCnt
					: data.link.cnt;
			if (ghnt == null) {
				var sheetSelector = activeBook.getSheetSelector(), path = linkVal.target.path, sheetId;
				if (!path.search(/^[\w\W]*.wss$/)
						&& path != dev.report.base.app.activeBook._name) {
					throw "follHLInvalidWB"
				}
				var cbTransExec = function() {
					if (ext.nrange) {
						var conn = dev.report.backend, targSheetId = ext.sheet_name
								? sheetSelector.getIdByName(ext.sheet_name)
								: sheetSelector.getActiveSheetId();
						if (!targSheetId) {
							throw "follHLInvalidSheet"
						}
						conn.ccmdBuffer();
						conn.ccmd(0, ["nget",
										[1, 1, ext.nrange, targSheetId, true]]);
						conn.ccmd(0, ["nget", [1, 1, ext.nrange, "", true]]);
						var ngetRes = conn.ccmdFlush(), sheetNREmpty;
						if ((sheetNREmpty = _isEmptyObj(ngetRes[0][1][0]))
								&& _isEmptyObj(ngetRes[1][1][0])) {
							throw "follHLInvTrgNRange"
						}
						var nrRef = ngetRes[sheetNREmpty ? 1 : 0][1][0].refers_to;
						if (!nrRef.search(/^=/)) {
							nrRef = nrRef.substr(1)
						}
						var nrRefSplit = (!nrRef.search(/^=/)
								? nrRef.substr(1)
								: nrRef).split("!", 2);
						if (nrRefSplit.length > 1) {
							sheetId = sheetSelector.getIdByName(nrRefSplit[0]);
							nrRefRng = nrRefSplit[1]
						} else {
							nrRefRng = nrRefSplit[0]
						}
						rngParsed = dev.report.base.formula.parse(nrRefRng);
						if (!rngParsed.length) {
							throw "follHLInvTrgNRange"
						} else {
							if (rngParsed.length > 1) {
								throw "follHLInvTrgNRange"
							}
							rng = rngParsed[0].rng
						}
						if (nrRefSplit.length > 1
								&& sheetSelector.getActiveSheetId() != sheetId) {
							if (!sheetId) {
								throw "follHLInvalidSheet"
							}
							dev.report.base.sheet.select([this, makeSelection],
									sheetId, activeBook, true)
						} else {
							makeSelection()
						}
					} else {
						if (ext.sheet_name) {
							sheetId = sheetSelector.getIdByName(ext.sheet_name);
							if (!sheetId) {
								throw "follHLInvalidSheet"
							}
							if (sheetSelector.getActiveSheetId() != sheetId) {
								dev.report.base.sheet.select([this, makeSelection],
										sheetId, activeBook, true)
							} else {
								makeSelection()
							}
						} else {
							makeSelection()
						}
					}
				};
				transExec({
							fullTrans : true
						}, [this, cbTransExec])
			} else {
				if (dev.report.base.app.UPRestrictMode) {
					var actBookMetaData = activeBook._meta;
					if (actBookMetaData == null || actBookMetaData.n != ghnt.n
							|| actBookMetaData.h != ghnt.h
							|| actBookMetaData.g != ghnt.g) {
						showMsg("follHLTmpDisabledRef".localize(),
								"follHLTmpDisabledWB".localize(),
								Ext.MessageBox.WARNING);
						return false
					}
				}
				var cntObj = this.resolveTarget(cnt);
				if (!cntObj) {
					for (var triggers = dev.report.base.events.triggers.openWorkbook_before, i = triggers.length
							- 1; i >= 0; i--) {
						triggers[i][0]["openWorkbook_before"].call(parent,
								triggers[i][1], ghnt, "", false)
					}
					function afterWbOpen(err) {
						if (err) {
							showMsg("follHLInvalidRef".localize(), err
											.localize(), Ext.MessageBox.WARNING);
							return false
						}
						var name = dev.report.base.wnd.active.node._name;
						for (var triggers = dev.report.base.events.triggers.openWorkbook_after, i = triggers.length
								- 1; i >= 0; i--) {
							triggers[i][0]["openWorkbook_after"].call(parent,
									triggers[i][1], ghnt, name)
						}
					}
				} else {
					if (cntObj instanceof dev.report.base.wnd.Frame) {
						var fsMeta = cntObj._frameset._meta;
						ext.frameset = fsMeta.g.concat("-", fsMeta.h, "-",
								fsMeta.n, "#", cntObj.name)
					}
				}
				switch (ghnt.t) {
					case "workbook" :
						transExec({
									beforeLoad : true
								});
						var hlres = dev.report.base.node.load([
										this,
										makeSelection,
										cntObj
												? undefined
												: [this, afterWbOpen]], ghnt.t,
								ghnt.n, ghnt.g, ghnt.h, ext, {
									tag : "hl",
									func : transExec,
									scope : this,
									params : [],
									cnt : cntObj
								});
						break;
					case "frameset" :
						transExec({
									beforeLoad : true
								});
						var hlres = dev.report.base.node.load(cntObj ? undefined : [
										this, afterWbOpen], ghnt.t, ghnt.n,
								ghnt.g, ghnt.h, ext, {
									tag : "hl",
									params : [],
									cnt : cntObj
								});
						break
				}
				if (!hlres) {
					return false
				}
			}
		} catch (e) {
			showMsg("follHLInvalidRef".localize(), e.localize(),
					Ext.MessageBox.WARNING);
			return false
		}
	};
	this.follow = function(ev, data) {
		if (!data) {
			return false
		}
		if (ev) {
			if (ev.button == 2
					|| (Ext.isMac && ev.button == 0 && dev.report.base.app.ctrlKeyPressed)) {
				return true
			}
			var targEl = (Ext.isGecko2)
					? ev.explicitOriginalTarget.parentNode
					: document.elementFromPoint(ev.clientX, ev.clientY);
			if (targEl.tagName.toUpperCase() == "IMG") {
				targEl = targEl.parentNode
			}
			if (targEl == undefined || targEl.tagName.toUpperCase() != "SPAN"
					|| targEl.className != "hl") {
				return true
			}
			dev.report.base.hl.setToolTip(ev, undefined, false)
		}
		try {
			if (data.dyn) {
				data = _dDataToSData(null, data, true)
			} else {
				var tmpNRId = _resolveSData(null, data, true)
			}
		} catch (e) {
			dev.report.base.general.showMsg("follHLInvalidRef".localize(), e
							.localize(), Ext.MessageBox.WARNING);
			return false
		}
		var linkVal = data.link.type == "ref"
				? data.link.rvalue
				: data.link.value;
		if (linkVal.type == "url") {
			return dev.report.base.hl.followURL(data)
		}
		if (linkVal.type == "local") {
			return linkVal.target.ghnt == null
					|| linkVal.target.ghnt.t == "workbook"
					|| linkVal.target.ghnt.t == "frameset" ? dev.report.base.hl
					.followWb(data) : dev.report.base.hl.followOther(linkVal,
					data.link.cnt == undefined ? _defCnt : data.link.cnt)
		}
		return false
	};
	this.exec = function(rngStr) {
		var rng = dev.report.base.formula.parse(rngStr);
		if (!rng.length) {
			dev.report.base.general.showMsg("follHLInvalidRef".localize(),
					"execHLInvRange".localize(), Ext.MessageBox.WARNING);
			return false
		}
		var cbFollow = function(data) {
			this.follow(null, data)
		};
		this.get(rng[0].rng.slice(0, 2), [this, cbFollow])
	};
	this.execDyn = function(link, text) {
		if (text == undefined) {
			text = "Title".localize()
		}
		var dData = {
			dyn : true,
			link : [link, link],
			text : [text, text],
			tip : [text, text],
			trans : []
		};
		this.follow(null, dData)
	};
	this.getContextMenu = function(conf, ev) {
		var data = conf.data, dynData = data != undefined && data.dyn, insEditCapt = data
				? "Edit Hyperlink"
				: "Hyperlink", cntx = ["-"];
		if (conf && conf.data && conf.withOpen) {
			if (dynData) {
				data = _dDataToSData(null, data)
			} else {
				var tmpNRId = _resolveSData(null, data, true)
			}
			var linkVal = data.link.type == "ref"
					? data.link.rvalue
					: data.link.value;
			if (linkVal.type == "url") {
				if (!dev.report.base.app.standalone) {
					cntx.push({
								text : "HLCntxNewTab".localize(),
								iconCls : "ico_hl_target_tab",
								handler : function() {
									dev.report.base.hl.followURL(data, "_new")
								}
							})
				}
				cntx.push({
							text : "HLCntxNewWin".localize(),
							iconCls : "ico_hl_target_win",
							handler : function() {
								dev.report.base.hl.followURL(data, "_blank")
							}
						})
			}
			if (linkVal.type == "local") {
				if (linkVal.target.ghnt == null
						|| linkVal.target.ghnt.t == "workbook") {
					cntx.push({
								text : "Open".localize(),
								iconCls : "ico_hl_open",
								handler : function() {
									dev.report.base.hl.followWb(data)
								}
							})
				} else {
					if (!dev.report.base.app.standalone) {
						if (dev.report.base.app.fileTypesReg[linkVal.target.ghnt.t]
								|| linkVal.target.ghnt.t == "hyperlink") {
							cntx.push({
										text : "HLCntxNewTab".localize(),
										iconCls : "ico_hl_target_tab",
										handler : function() {
											dev.report.base.hl.followOther(linkVal,
													"_new")
										}
									});
							cntx.push({
										text : "HLCntxNewWin".localize(),
										iconCls : "ico_hl_target_win",
										handler : function() {
											dev.report.base.hl.followOther(linkVal,
													"_blank")
										}
									})
						}
						if ("hyperlink,ahview".search(linkVal.target.ghnt.t) < 0) {
							cntx.push({
										text : "Export".localize()
												.concat("..."),
										handler : function() {
											dev.report.base.hl.followOther(linkVal,
													"_export")
										}
									})
						}
					}
				}
			}
		}
		if (dev.report.base.app.environment.viewMode != dev.report.base.grid.viewMode.USER) {
			if (!dynData) {
				cntx.push({
							id : "wHyperlink_insert_btn",
							text : insEditCapt.localize().concat("..."),
							iconCls : "ico_hl_insert",
							handler : function() {
								using("dev.report.base.dlg.InsertHyperlink");
								var insertHyperlink=new dev.report.base.dlg.InsertHyperlink(conf);
							}
						})
			} else {
				cntx.push({
					id : "wHyperlink_insert_btn",
					text : "Edit Hyperlink".localize().concat("..."),
					iconCls : "ico_hl_insert",
					handler : function() {
						using("dev.report.base.dlg.InsertFunction");
						var insertFunction=new dev.report.base.dlg.InsertFunction({
												id : "fbar",
												fn : null
											},
							dev.report.base.app.currFormula.getValue()
						);
					}
				})
			}
			if (data) {
				cntx.push({
							id : "wHyperlink_del_btn",
							text : "HLCntxRemove".localize(),
							iconCls : "ico_hl_remove",
							handler : function() {
								conf.handlers.remove.call(conf.handlers.scope)
							}
						})
			}
		}
		if (ev) {
			(document.all ? ev.srcElement : ev.target).resetTooltip = true
		}
		return cntx
	};
	this.toolTip = function(ev, show) {
		if (dev.report.env.isMobile) {
			return true
		}
		if (document.all) {
			ev = window.event
		}
		if (show) {
			var el = document.all ? ev.srcElement : ev.target, elParent = el.tagName
					.toUpperCase() == "IMG"
					? el.parentNode.parentNode
					: el.parentNode, activeBook = dev.report.base.app.activeBook, rng;
			if (elParent.id.search(/_cursorField$/) >= 0) {
				rng = dev.report.base.app.environment.selectedCellCoords
			} else {
				if (activeBook._aPane) {
					rng = activeBook._aPane.getCoordsByCell(elParent)
				} else {
					return
				}
			}
			var data = this.get(rng)
		}
		this.setToolTip(ev, data, show)
	};
	this.setToolTip = function(ev, data, show) {
		var el = document.all ? ev.srcElement : ev.target, isImgInHLFunc = el.tagName
				.toUpperCase() == "IMG"
				&& el.className.indexOf("ws_element");
		if (show && data) {
			var tipTitle, tipText, isDyn = data.dyn, showToolTip = function(
					format) {
				if (el.tooltip) {
					return
				}
				var isDefFmt = format == _tipFormats[0];
				el.tooltip = new Ext.ToolTip({
							target : el,
							renderTo : "mainBody",
							title : isDefFmt && !isImgInHLFunc ? tipTitle : "",
							html : isDefFmt ? tipText : tipTitle,
							trackMouse : true,
							anchorToTarget : false,
							autoDestroy : true,
							dismissDelay : 10000
						});
				el.tooltip.anchorEl.hide();
				if (el.noTooltip) {
					delete el.noTooltip;
					return
				}
				el.tooltip.showAt([ev.clientX + 15, ev.clientY + 18])
			};
			var cbConvert = function(res) {
				try {
					if (isDyn) {
						data = res
					} else {
						var tmpNRId = res
					}
					if (!(data.link instanceof Object)) {
						throw data.link
					}
					if (!("format" in data.tip)) {
						data.tip.format = _tipFormats[0]
					}
					tipTitle = data.tip[data.tip.type == "ref"
							? "rvalue"
							: "value"];
					if (!tipTitle) {
						tipTitle = data.text[data.text.type == "ref"
								? "rvalue"
								: "value"]
					}
					var linkSrc = data.link.type == "ref" ? "rvalue" : "value";
					if (data.tip.format != "simple") {
						if (data.link[linkSrc].type == "local") {
							tipText = !data.link[linkSrc].target.path
									? "Place in This Document"
											.localize()
											.concat(
													" - ",
													!data.link[linkSrc].target.sheet
															? dev.report.base.app.activeBook
																	.getSheetSelector()
																	.getActiveSheetName()
															: data.link[linkSrc].target.sheet)
									: data.link[linkSrc].target.path
						} else {
							tipText = data.link[linkSrc].target
						}
					}
					showToolTip(data.tip.format)
				} catch (e) {
					tipTitle = tipTitle ? tipTitle : "follHLInvalidRef"
							.localize();
					tipText = "HLInvalidRefNotice".localize();
					showToolTip(_tipFormats[0])
				}
			};
			if (isDyn) {
				_dDataToSData([that, cbConvert], data)
			} else {
				_resolveSData([that, cbConvert], data)
			}
		} else {
			if (el.tooltip && (el.tooltip.isVisible() || el.resetTooltip)) {
				el.tooltip.destroy();
				delete el.tooltip;
				if (el.noTooltip) {
					delete el.noTooltip
				}
			} else {
				el.noTooltip = true
			}
		}
	};
	this.resolveTarget = function(target) {
		var activeBook = dev.report.base.app.activeBook, holder = activeBook.holder;
		switch (target) {
			case "_self" :
				return holder;
			case "_top" :
				return activeBook.getTopHolder();
			case "_parent" :
				return holder.holder ? holder.holder : holder;
			case "_blank" :
			case "_new" :
				return undefined
		}
		return holder instanceof dev.report.base.wnd.Frame ? holder._frameset
				.getFrameByName(target) : undefined
	};
	this.getTargets = function(destType) {
		switch (destType) {
			case "workbook" :
				var targets = ["_new", "_self", "_parent", "_top"], activeBook = dev.report.base.app.activeBook, holder;
				return activeBook
						&& (holder = activeBook.holder) instanceof dev.report.base.wnd.Frame
						? targets.concat(holder._frameset.getNames())
						: targets;
			case "frameset" :
				return ["_new", "_self", "_top"];
			default :
				return ["_new", "_blank"]
		}
	};
	this.getRules = function(conf) {
		if (!conf || !conf.lType
				|| (conf.lType == "obj" && (!conf.lVType || !conf.lVSubType))) {
			return conf
		}
		conf.hasTarg = true;
		conf.targets = [];
		conf.hasTrans = true;
		conf.hasSel = true;
		var destType = undefined;
		switch (conf.lType) {
			case "ref" :
				conf.hasTarg = false;
				break;
			case "obj" :
				switch (conf.lVType) {
					case "local" :
						switch (conf.lVSubType) {
							case "self" :
								conf.hasTarg = false;
								break;
							case "workbook" :
								destType = conf.lVSubType;
								break;
							case "frameset" :
								destType = conf.lVSubType;
								conf.hasSel = false;
								break;
							case "folder" :
								conf.hasTarg = conf.hasTrans = conf.hasSel = false;
							case "hyperlink" :
							case "static" :
							case "urlplugin" :
								destType = conf.lVSubType;
								conf.hasTrans = conf.hasSel = false;
								break
						}
						break;
					case "url" :
						destType = "static";
						switch (conf.lVSubType) {
							case "web" :
								conf.hasSel = false;
								break;
							case "mail" :
								conf.hasTarg = conf.hasTrans = conf.hasSel = false;
								break
						}
						break
				}
				break
		}
		if (conf.hasTarg && destType) {
			conf.targets = this.getTargets(destType)
		}
		return conf
	}
};