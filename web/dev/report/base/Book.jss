
Ext.namespace("dev.report.base");
dev.report.base.Book =function() {
	var that = this;
	this.reg = {};

	this.spawn = function(cb, uid, name, meta) {
		using("dev.report.base.wnd.WindowFactory");
        dev.report.base.wnd.windowFactory =new dev.report.base.wnd.WindowFactory();
		dev.report.base.wnd.windowFactory.get(cb, {
					type : "workbook",
					uid : uid,
					name : name,
					meta : meta
		});
		//dev.report.base.action.adjustToACL()
	};
	this.create = function(cb) {
		/*var rqst = new dev.report.backend.RPCAsyncRqst("WSS", "load_workbook",
				[null]);
		rqst.setOnSuccess([that, that.create_post, cb]).send()
		*/
	};
	this.create_post = function(res, cb) {
		if (!res[0]) {
			dev.report.base.general
					.showMsg("Application Error".localize(), "errLoadWB_intro"
									.localize().concat(" ", res[1].localize()),
							Ext.MessageBox.ERROR);
			return false
		}
		that.spawn(cb, res[1].wbid, res[1].name, null)
	};
	this.load = function(cb, wb, group, hierarchy, ext, pc) {
		dev.report.base.general.chkState();
		if (!ext) {
			ext = {
				appmode : dev.report.base.app.appMode
			}
		} else {
			ext.appmode = dev.report.base.app.appMode
		}
		var rqst = new dev.report.backend.RPCAsyncRqst("WSS", "load_workbook", [wb,
						group ? group : null, hierarchy ? hierarchy : null,
						ext ? ext : null]);
		rqst.setOnSuccess([that, that.load_post, cb, {
					g : group,
					h : hierarchy,
					n : wb
				}, pc, arguments]).send();
		return true
	};
	this.load_post = function(res, cb, meta, pc, args) {
		var wnd = dev.report.base.wnd;
		hasCb = cb instanceof Array && cb.length > 1;
		if (!res[0]) {
			if (!res[1].search(/^follHL*/i) && hasCb) {
				cb[1].call(cb[0], cb[2], res[1]);
				return false
			}
			if (!res[1].search(/^recovery*/i)) {
				dev.report.base.events.disableEvents(["switchWorkbook_before",
						"switchWorkbook_after"]);
				dev.report.gen.load(dev.report.base.app.dynJSRegistry.recover, [res[2],
								args])
			} else {
				dev.report.base.general.showMsg("Application Error".localize(),
						"errLoadWB_intro".localize().concat(" ",
								res[1].localize()), Ext.MessageBox.ERROR, [
								this, wnd.triggerCloseEvt, null, meta])
			}
			return false
		}
		if (pc) {
			pc.params.unshift(res[1][pc.tag]);
			pc.func.apply(pc.scope, pc.params)
		}
		if (res[1].fgroup) {
			meta.fg = res[1].fgroup;
			meta.fh = res[1].fhierarchy;
			meta.fn = res[1].fnode
		}
		if (!pc || pc.cnt == undefined) {
			var book = that.find(res[1].wbid, meta, res[1].name);
			if (res[1].imp && book) {
				if (res[1].wsid) {
					dev.report.base.sheet.select(cb, res[1].wsid, book)
				} else {
					if (hasCb) {
						cb[1].call(cb[0])
					}
				}
				book.holder.select()
			} else {
				if (meta.g == undefined || meta.h == undefined) {
					meta = null
				} else {
					meta.p = res[1].perm
				}
				that.spawn(cb, res[1].wbid, res[1].name, meta)
			}
		} else {
			if (pc.cnt instanceof wnd.Window) {
				var existWin = wnd.findByMeta(res[1].name, meta);
				if (existWin) {
					if (wnd.active._id == existWin._id) {
						return true
					} else {
						if (res[1].imp) {
							wnd.active.unload();
							existWin.select();
							return true
						}
					}
				}
				var data = {
					type : "workbook",
					uid : res[1].wbid,
					name : res[1].name,
					meta : meta
				}
			} else {
				if (pc.cnt instanceof wnd.Frame) {
					var data = {
						name : pc.cnt._conf.name,
						group : meta.g,
						hierarchy : meta.h,
						node : meta.n,
						type : "workbook",
						params : pc.cnt._conf.params,
						uid : res[1].wbid,
						ldres : res
					}
				}
			}
			pc.cnt.replaceNode(cb, data)
		}
		return true
	};
	this.unload = function(cb, uid) {
		(new dev.report.backend.RPCAsyncRqst("WSS", "removeBook", [uid]))
				.setOnSuccess(cb).send()
	};
	this.save = function(cb, node) {
		var active = true;
		if (!node) {
			node = dev.report.base.wnd.active.node
		} else {
			active = false
		}
		var ghn = node._meta;
		if (!ghn) {
			dev.report.gen.load(dev.report.base.app.dynJSRegistry.open, ["save", cb]);
			return
		}
		(new dev.report.backend.RPCAsyncRqst("WSS", "save_workbook", [ghn.g, ghn.h,
						ghn.n, null, null, active])).setOnSuccess([that,
				that.save_post, cb]).send()
	};
	this.save_post = function(res, cb) {
		if (!res[0]) {
			Ext.MessageBox.show({
						title : "Save".localize(),
						msg : res[1].localize(res[2]),
						modal : true,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING,
						fn : Ext.emptyFn,
						minWidth : 300
					})
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].call(cb[0])
		}
	};
	this.find = function(uid, meta, name) {
		var book, node;
		for (var id in that.reg) {
			book = that.reg[id];
			if (book.uid != uid) {
				continue
			}
			if (meta) {
				node = book.getTopHolder().node;
				if (!node
						|| !node._meta
						|| !((node._meta.g == meta.g && node._meta.h == meta.h && node._meta.n == meta.n) || (!meta.g
								.search(/^f/) ? node._meta.fg == meta.g
								&& node._meta.fh == meta.h
								&& node._meta.fn == meta.n : false))) {
					continue
				}
			}
			if (name && name != book._name) {
				continue
			}
			return book
		}
		return undefined
	};
	this.findByName = function(name) {
		var book;
		for (var id in that.reg) {
			book = that.reg[id];
			if (book._name == name) {
				return book
			}
		}
		return false
	};
	this.select = function(uid, meta, name) {
		var book = that.find(uid, meta, name);
		if (book) {
			that.selectById(book.id)
		}
	};
	this.selectById = function(id) {
		if (id in that.reg) {
			that.reg[id].select()
		}
	};
	this.autoRefresh = function(secs) {
		var activeBook = dev.report.base.app.activeBook;
		if (activeBook._autoRefresh) {
			clearTimeout(activeBook._tid_autoRefresh)
		}
		if ((secs |= 0) && secs < 10) {
			secs = 10
		}
		activeBook._autoRefresh = secs * 1000;
		if (secs) {
			activeBook.autoRefresh()
		}
		if (activeBook._conf == null) {
			activeBook._conf = {
				e_type : "conf",
				autoRefresh : secs
			};
			var ccmd = '[["badd","",{"e_type":"conf","autoRefresh":'.concat(
					secs, "}]]"), post = [that, function(res) {
						if (res[0][0]) {
							activeBook._conf.e_id = res[0][1][0]
						}
					}]
		} else {
			activeBook._conf.autoRefresh = secs;
			var e_id = activeBook._conf.e_id;
			delete activeBook._conf.e_id;
			var ccmd = '[["bupd","",{"'.concat(e_id, '":', Ext.util.JSON
							.encode(activeBook._conf), "}]]"), post = null;
			activeBook._conf.e_id = e_id
		}
		var conn = dev.report.backend;
		conn.ccmdSetBuff(ccmd);
		conn.ccmdFlush(post)
	};
	this.recover = function(win, args) {
		win._execClose = false;
		win.close();
		var argsCopy = [];
		for (var i = 0, alen = args.length; i < alen; i++) {
			argsCopy.push(args[i])
		}
		dev.report.base.events.enableEvents(["switchWorkbook_before",
				"switchWorkbook_after"]);
		that.load.apply(this, argsCopy)
	};
	this.goTo = function(ref) {
		var result = false, pref = dev.report.base.formula.parse(ref);
		if (pref.length != 1) {
			searchNames(ref)
		} else {
			doGoTo(pref)
		}
		return result;
		function searchNames(name) {
			var position = dev.report.base.app.environment.defaultSelection
					.getActiveRange().getActiveCell();
			var tmpResponse = dev.report.backend.ccmd(0, ["nlst",
							[position._x, position._y]]);
			var names = tmpResponse[0][1][0];
			for (var i = 0, count = names.length; i < count; i++) {
				if (names[i]["name"] == name) {
					doGoTo(dev.report.base.formula.parse(names[i]["refers_to"]))
				}
			}
		}
		function doGoTo(pref) {
			ref = pref[0];
			var activeBook = dev.report.base.app.activeBook, activePane = dev.report.base.app.activePane, defSel = dev.report.base.app.environment.defaultSelection;
			if (ref.sheet.length
					&& ref.sheet != activeBook._sheetUids[activeBook._aSheetUid]) {
				result = false
			}
			activePane.scrollTo(defSel
							? [defSel, defSel.jumpTo, ref.rng]
							: null, ref.rng[0], ref.rng[1], true, false);
			result = true
		}
	};
	this.autoSwitch = function(id, sheetUid) {
		if (id && id in that.reg && that.reg[id] != dev.report.base.app.activeBook) {
			return that.reg[id].select()
		}
		var activeBook = dev.report.base.app.activeBook;
		if (!activeBook) {
			return undefined
		}
		var cb = [that, that.autoSwitch, activeBook.id];
		if (activeBook._aSheet) {
			var sheetsO2C = activeBook._sheetsO2C, aSheetUid = activeBook._aSheetUid;
			if (aSheetUid in sheetsO2C) {
				aSheetUid = sheetsO2C[aSheetUid]
			}
			cb.unshift(activeBook.uid.concat(" ", aSheetUid));
			cb.push(aSheetUid)
		} else {
			cb.unshift(activeBook.uid)
		}
		return cb
	};
	this.unsetActive = function() {
		var app = dev.report.base.app;
		app.activeBook = app.activeSheet = app.activePane = app.environment = undefined
	};
	this.getVirtScroll = function(onlyActive) {
		var activeBook = dev.report.base.app.activeBook, activeWnd = dev.report.base.wnd.active, vscroll = {}, book;
		vscroll[".".concat(activeBook.id)] = activeBook._aSheet.getVirtScroll();
		if (!onlyActive) {
			for (var id in that.reg) {
				if ((book = that.reg[id]) != activeBook
						&& book.getTopHolder() == activeWnd) {
					vscroll[book.uid.concat(".", book.id)] = book._aSheet
							.getVirtScroll()
				}
			}
		}
		return vscroll
	};
	this.chkSaved = function(cb, node) {
		function cbBns(res) {
			if (cb instanceof Array && cb.length > 1) {
				cb[1].call(cb[0], !res[1][0] || !res[1][1])
			}
		}
		(new dev.report.backend.CCmdAsyncRqst([["osel", 1, node.uid], ["bns"]]))
				.setOnSuccess([this, cbBns]).send()
	};
	this.getPerm = function(node) {
		return node._meta
				? node._meta.p
				: dev.report.base.grid.permission.PERM_DELETE
	}
};