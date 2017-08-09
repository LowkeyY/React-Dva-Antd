
Ext.namespace("dev.report.base");
dev.report.base.Frameset = function() {
	var that = this;
	this.spawn = function(cb, name, meta, cols, rows, frames,uid) {
		dev.report.base.wnd.windowFactory.get(cb, {
					type : "frameset",
					name : name,
					meta : meta,
					cols : cols,
					rows : rows,
					frames : frames,
					uid : uid,
				});
		dev.report.base.action.adjustToACL()
	};
	this.load = function(cb, name, group, hierarchy, ext, pc) {
		dev.report.base.general.chkState();
		if (!ext) {
			ext = {
				appmode : dev.report.base.app.appMode
			}
		} else {
			ext.appmode = dev.report.base.app.appMode
		}
		var rqst = new dev.report.backend.RPCAsyncRqst("WSS", "loadFrameset", [name,
						group, hierarchy, ext]);
		rqst.setOnSuccess([this, this.load_post, cb, {
					g : group,
					h : hierarchy,
					n : name,
					v : false
				}, pc, arguments]).send();
		return true
	};
	this.load_post = function(res, cb, meta, pc, args) {
		var wnd = dev.report.base.wnd, hasCb = cb instanceof Array && cb.length > 1;
		if (!res[0]) {
			if (!res[1].search(/^follHL*/i) && hasCb) {
				cb[1].call(cb[0], res[1]);
				return false
			}
			dev.report.base.general
					.showMsg("Application Error".localize(), "errLoadFS_intro"
									.localize().concat(" ", res[1].localize()),
							Ext.MessageBox.ERROR, [this, wnd.triggerCloseEvt,
									null, meta]);
			return false
		}
		res = res[1];
		meta.p = res.perm == undefined
				? dev.report.base.grid.permission.PERM_READ
				: res.perm;
		if (res.fgroup) {
			meta.fg = res.fgroup;
			meta.fh = res.fhierarchy;
			meta.fn = res.fnode
		}
		var that = this, frames = res.frames, hasAS = false, lArgs = [];
		for (var i = 0, lalen = args.length; i < lalen; i++) {
			lArgs.push(args[i])
		}
		lArgs.push(res.name);
		function chkFrame(idx) {
			if (idx > frames.length - 1) {
				dev.report.base.events.enableEvents(["switchWorkbook_before",
						"switchWorkbook_after"]);
				if (hasAS) {
					that.load.apply(that, args)
				} else {
					if (pc && pc.cnt instanceof wnd.Window) {
						var existWin = wnd.findByMeta(res.name, meta);
						if (existWin && res.exists) {
							if (wnd.active._id == existWin._id) {
								return
							} else {
								wnd.active.unload();
								existWin.select();
								return
							}
						}
						pc.cnt.replaceNode(cb, {
									type : "frameset",
									name : res.name,
									meta : meta,
									cols : res.cols,
									rows : res.rows,
									frames : res.frames
								})
					} else {
						if (res.exists === true) {
							wnd.selectByMeta(res.name, meta);
							if (hasCb) {
								cb[1].apply(cb[0], cb.slice(2))
							}
							return
						}
						that.spawn(cb, res.name, meta, res.cols, res.rows,
								res.frames)
					}
				}
				return
			}
			if (!frames[idx].ldres[0]
					&& typeof frames[idx].ldres[1] == "string"
					&& !frames[idx].ldres[1].search(/^recovery*/i)) {
				hasAS = true;
				dev.report.gen.load(dev.report.base.app.dynJSRegistry.recover, [
								frames[idx].ldres[2], lArgs, [that, function() {
											chkFrame(idx + 1)
										}], {
									g : frames[idx].group,
									h : frames[idx].hierarchy,
									n : frames[idx].node
								}])
			} else {
				chkFrame(idx + 1)
			}
		}
		dev.report.base.events.disableEvents(["switchWorkbook_before",
				"switchWorkbook_after"]);
		chkFrame(0)
	};
	this.unload = function(cb, node) {
		(new dev.report.backend.RPCAsyncRqst("WSS", "removeFrameset", [node._meta.n,
						node._meta.g, node._meta.h])).setOnSuccess(cb).send()
	};
	this.save = function(cb, node, showMsg) {
		if (!node) {
			node = dev.report.base.wnd.active.node
		}
		var ghn = node._meta, rqst = new dev.report.backend.RPCAsyncRqst("WSS",
				"saveFrameset", [ghn.g, ghn.h, ghn.n]);
		rqst.setOnSuccess([this, this.save_post, cb, showMsg]).send();
		return true
	};
	this.save_post = function(res, cb, showMsg) {
		if (showMsg && !res[0]) {
			var details = res[1], errMsg = "";
			for (var i = 0, detLen = details.length; i < detLen; i++) {
				if (!details[i][0]) {
					errMsg = errMsg.concat(details[i][1]
									.localize(details[i][2]), "<br>")
				}
			}
			Ext.MessageBox.show({
						title : "Save".localize(),
						msg : errMsg,
						modal : true,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING,
						fn : Ext.emptyFn,
						minWidth : 500
					})
		}
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	};
	this.recover = function(cb, win) {
		win._execClose = false;
		win.close();
		if (cb instanceof Array && cb.length > 1) {
			cb[1].apply(cb[0], cb.slice(2))
		}
	};
	this.chkSaved = function(cb, node) {
		var hasCB = cb instanceof Array && cb.length > 1;
		if (this.getPerm(node) < dev.report.base.grid.permission.PERM_WRITE && hasCB) {
			cb[1].call(cb[0], true);
			return
		}
		var cmds = [], frameUIDs = node.getFrameUIDs();
		function cbBns(res) {
			var isSaved = true;
			for (var i = frameUIDs.length * 2 - 1; i >= 0; i -= 2) {
				if (res[i][0] && res[i][1]) {
					isSaved = false;
					break
				}
			}
			if (hasCB) {
				cb[1].call(cb[0], isSaved)
			}
		}
		for (var i = frameUIDs.length - 1; i >= 0; i--) {
			cmds.push(["osel", 1, frameUIDs[i]]);
			cmds.push(["bns"])
		}
		(new dev.report.backend.CCmdAsyncRqst(cmds)).setOnSuccess([this, cbBns])
				.send()
	};
	this.getPerm = function(node) {
		var perm = dev.report.base.grid.permission.PERM_NONE;
		for (var frames = node._frames, i = frames.length - 1; i >= 0; i--) {
			if (frames[i].node._meta.p > perm) {
				perm = frames[i].node._meta.p
			}
		}
		return perm
	}
};