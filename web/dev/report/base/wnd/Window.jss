
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.wnd");
dev.report.base.wnd.Window = (function() {
	var _id = 0;
	return function(cb, data, conf) {
		var that = this, jwwnd = dev.report.base.wnd, enaRestr = !dev.report.base.app.UPRestrictMode,dom;
		enaRestr = false;
		if(dev.report.base.app.appMode == dev.report.base.grid.viewMode.USER){
			dom=dev.report.base.vwspc.dom;
		}else{
			dom=dev.report.base.wspc.dom;
		}
		if (!conf) {
			conf = {
				title : data.name,
				renderTo :dom ,
				width : 900,
				height : 300,
				minWidth : 350,
				minHeight : 150,
				maximizable : enaRestr,
				minimizable : enaRestr,
				bodyBorder : false,
				border : true,
				header : false,
				footer : false,
				plain : true,
				shadow : false,
				hideBorders : true,
				onEsc : Ext.emptyFn,
				closable : enaRestr,
				_minimized : false
			}
		}
		jwwnd.Window.parent.constructor.call(this, conf);
		this._id = ++_id;
		this._data = data;
		jwwnd.reg[this._id] = this;
		jwwnd.active = this;
		this._domId = "W".concat(this._id);
		this._domCnts = {};
		this.on("activate", this._select);
		this.on("resize", this._fit);
		this.on("beforeclose", this._preunload);
		this.on("close", this._unload);
		this.show();
		this.maximize();

		this._spawnNode(cb, data)
	}
})();
dev.report.util.extend(dev.report.base.wnd.Window, Ext.Window);
var _prototype = dev.report.base.wnd.Window.prototype;
_prototype._spawnNode = function(cb, data) {

	switch (data.type) {
		case "workbook" :
			using("dev.report.base.grid.Book");
			this.node = new dev.report.base.grid.Book(cb, this, data.uid, data.name,
					data.meta);
			break;
		case "frameset" :
			using("dev.report.base.wnd.Frameset");
			this.node = new dev.report.base.wnd.Frameset(cb, this, data.name,
					data.meta, data.cols, data.rows, data.frames);
			break
	}
};
_prototype._select = function(that) {
	var node = that.node;
	if (!node) {
		if (that._data) {
			var skipProc = true;
			node = {
				_meta : that._data.meta,
				_name : that._data.name
			}
		} else {
			return
		}
	}
	try {
		for (var triggers = dev.report.base.events.triggers.switchWorkbook_before, i = triggers.length
				- 1; i >= 0; i--) {
			triggers[i][0]["switchWorkbook_before"].call(parent,
					triggers[i][1], node._meta, node._name)
		}
	} catch (e) {
		dev.report.base.general.showMsg("Application Error".localize(), e.message
						.localize(), Ext.MessageBox.ERROR)
	}
	if (!skipProc) {
		dev.report.base.wnd.active = that;
		var status = node._select ? node._select() : true;
		if (status && node.refresh) {
			if (that.skipNodeRefresh === true) {
				delete that.skipNodeRefresh
			} else {
				node.refresh()
			}
		}
	}
	try {
		for (var triggers = dev.report.base.events.triggers.switchWorkbook_after, i = triggers.length
				- 1; i >= 0; i--) {
			triggers[i][0]["switchWorkbook_after"].call(parent, triggers[i][1],
					node._meta, node._name)
		}
	} catch (e) {
		dev.report.base.general.showMsg("Application Error".localize(), e.message
						.localize(), Ext.MessageBox.ERROR)
	}
	if (skipProc) {
		delete that._data
	}
};
_prototype._fit = function(that) {
	if (that._isMinimizing) {
		return
	}
	var node = that.node;
	if (node && node._fit) {
		node._fit()
	}
};
_prototype._preunload = function(that) {
	dev.report.base.app.gridBlurObserver.notify(this);
	dev.report.base.general.chkState();
	var node = that.node;
	if (!node) {
		return true
	}
	try {
		for (var triggers = dev.report.base.events.triggers.closeWorkbook_before, i = triggers.length
				- 1; i >= 0; --i) {
			triggers[i][0]["closeWorkbook_before"].call(parent, triggers[i][1],
					node._meta, node._name)
		}
	} catch (e) {
		dev.report.base.general.showMsg("Application Error".localize(), e.message
						.localize(), Ext.MessageBox.ERROR)
	}
	var that = this, env = dev.report.base.app.environment, jwgrid = dev.report.base.grid;
	if (this._unloadRqst === true
			|| !env
			|| env.viewMode != jwgrid.viewMode.DESIGNER
			|| (this.node._meta && this.node._meta.p < jwgrid.permission.PERM_WRITE)) {
		return true
	}
	if (this._unloadRqst) {
		return false
	}
	function reUnload() {
		that._unloadRqst = true;
		that.unload()
	}
	function dywtsc(isSaved) {
		if (isSaved) {
			return reUnload()
		}
		var wasAct = dev.report.base.wnd.active == that;
		if (!wasAct) {
			that.skipNodeRefresh = true;
			that.select()
		}
		Ext.MessageBox.show({
			title : "File not saved".localize(),
			msg : "autosave_msg".localize(),
			icon : Ext.MessageBox.WARNING,
			modal : true,
			buttons : Ext.MessageBox.YESNOCANCEL,
			fn : function(btn) {
				switch (btn) {
					case "yes" :
						dev.report.base.node.save([that, reUnload], undefined, false);
						break;
					case "no" :
						reUnload();
						break;
					case "Cancel" :
						if (!wasAct) {
							that.node.refresh()
						}
						delete that._unloadRqst;
						break
				}
			}
		})
	}
	dev.report.base.node.chkSaved([this, dywtsc], node);
	return false
};
_prototype._unload = function(that) {
	var node = that.node;
	if (node._unload) {
		node._unload()
	}
	var jwwnd = dev.report.base.wnd;
	if (jwwnd.active == that) {
		jwwnd.active = undefined
	}
	delete jwwnd.reg[that._id];
	function cbRemove(res) {
		try {
			for (var triggers = dev.report.base.events.triggers.closeWorkbook_after, i = triggers.length
					- 1; i >= 0; --i) {
				triggers[i][0]["closeWorkbook_after"].call(parent,
						triggers[i][1], node._meta, node._name)
			}
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	}
	dev.report.base.node.unload([that, cbRemove], node)
};
_prototype.show = function(animateTarget, callback, scope) {
	dev.report.base.wnd.Window.parent.show.call(this, animateTarget, callback, scope);
	if (this._minimized) {
		this.collapse()
	}
};
_prototype.select = function() {
	dev.report.base.app.switchContextObserver.notify(this);
	this.toFront()
};
_prototype.unload = function() {
	this.close()
};
_prototype.minimize = function() {
	if (!this._minimized) {
		this._isMinimizing = true;
		if (this.id == dev.report.base.wnd.active.id) {
			var arrWins = dev.report.base.wnd.getVisible();
			if (arrWins.length > 1) {
				dev.report.base.wnd.active = arrWins[1]
			}
		}
		this._restoreData = {
			h : ((this.maximized)
					? this.restoreSize.height
					: this.getSize().height),
			w : ((this.maximized)
					? this.restoreSize.width
					: this.getSize().width),
			x : ((this.maximized) ? this.restorePos[0] : this.x),
			y : ((this.maximized) ? this.restorePos[1] : this.y)
		};
		var titleSize = Ext.util.TextMetrics
				.measure(this.header.id, this.title);
		if (titleSize.width > 70) {
			var headerId = this.header.id;
			var getNewName = function(inName, inWidth) {
				if (Ext.util.TextMetrics.measure(headerId, inName + "...").width > inWidth) {
					return getNewName(inName.substring(0, inName.length - 1),
							inWidth)
				} else {
					return inName + "..."
				}
			};
			this._restoreData.title = this.title;
			this.setTitle(getNewName(this.title.substring(0, this.title.length
									- 1), 70))
		}
		this.restore();
		this._minimized = true;
		this.toBack();
		this.collapse();
		this.tools.restore.show();
		this.tools.maximize.show();
		this.tools.minimize.hide();
		this.setWidth(150);
		var wsH = dev.report.base.wspc.getHeight();
		var minimizedWins = dev.report.base.wnd.minimized;
		var i = 0;
		for (; i < minimizedWins.length; i++) {
			if (!minimizedWins[i]) {
				minimizedWins[i] = true;
				this.setPosition(2 * (i + 1) + (150 * i), wsH
								- this.header.getSize().height - 2);
				this._restoreData.position = i;
				break
			}
		}
		if (i == minimizedWins.length) {
			minimizedWins[i] = true;
			this.setPosition(2 * (i + 1) + (150 * i), wsH
							- this.header.getSize().height - 2);
			this._restoreData.position = i
		}
		delete this._isMinimizing
	}
};
_prototype.restore = function() {
	if (this._minimized) {
		this.expand(false);
		this.setPosition(this._restoreData.x, this._restoreData.y);
		this.setSize(this._restoreData.w, this._restoreData.h);
		delete this.restorePos;
		delete this.restoreSize;
		if (this._restoreData.title) {
			this.setTitle(this._restoreData.title)
		}
		this._minimized = false;
		this.tools.minimize.show();
		this.tools.restore.hide();
		dev.report.base.wnd.minimized[this._restoreData.position] = false;
		delete this._restoreData
	} else {
		dev.report.base.wnd.Window.parent.restore.call(this)
	}
};
_prototype.maximize = function() {
	dev.report.base.wnd.Window.parent.maximize.call(this);
	if (this._minimized) {
		this._minimized = false;
		if (this.maximized) {
			this.restoreSize.width = this._restoreData.w;
			this.restorePos = [this._restoreData.x, this._restoreData.y];
			if (this._restoreData.title) {
				this.setTitle(this._restoreData.title)
			}
		}
		this.tools.minimize.show();
		dev.report.base.wnd.minimized[this._restoreData.position] = false;
		delete this._restoreData
	}
};
_prototype.getName = function() {
	return this.title
};
_prototype.setName = function(name) {
	this.setTitle(name)
};
_prototype.getDom = function() {
	return this.body.dom
};
_prototype.getDomCnt = function(id) {
	if (id in this._domCnts) {
		return ++this._domCnts[id]
	}
	return this._domCnts[id] = 0
};
_prototype.replaceNode = function(cb, data) {
	var that = this, oldNode = this.node, saveOld = false;
	try {
		for (var triggers = dev.report.base.events.triggers.replaceNode_before, i = triggers.length
				- 1; i >= 0; --i) {
			triggers[i][0]["replaceNode_before"].call(parent, triggers[i][1],
					oldNode._meta, this.node._name)
		}
	} catch (e) {
		dev.report.base.general.showMsg("Application Error".localize(), e.message
						.localize(), Ext.MessageBox.ERROR)
	}
	function cbSave() {
		dev.report.base.node.unload(cb, oldNode)
	}
	function cbSpawn() {
		if (saveOld) {
			dev.report.base.node.save([that, cbSave], oldNode)
		} else {
			cbSave()
		}
	}
	function unload() {
		try {
			that.node._unload();
			that.setTitle(data.name);
			that._spawnNode([that, cbSpawn], data);
			for (var triggers = dev.report.base.events.triggers.replaceNode_after, i = triggers.length
					- 1, meta = that.node._meta; i >= 0; --i) {
				triggers[i][0]["replaceNode_after"].call(parent,
						triggers[i][1], oldNode._meta, {
							g : meta.g,
							h : meta.h,
							n : meta.n,
							t : that.node instanceof dev.report.base.grid.Book
									? "workbook"
									: "frameset"
						}, that.node._name)
			}
		} catch (e) {
			dev.report.base.general.showMsg("Application Error".localize(), e.message
							.localize(), Ext.MessageBox.ERROR)
		}
	}
	function dywtsc(isSaved) {
		if (isSaved) {
			unload();
			return
		}
		Ext.MessageBox.show({
					title : "File not saved".localize(),
					msg : "autosave_msg".localize(),
					icon : Ext.MessageBox.WARNING,
					modal : true,
					buttons : Ext.MessageBox.YESNO,
					fn : function(btn) {
						switch (btn) {
							case "yes" :
								saveOld = true;
								unload();
								break;
							case "no" :
								unload();
								break
						}
					}
				})
	}
	if (dev.report.base.app.environment.viewMode != dev.report.base.grid.viewMode.DESIGNER) {
		unload()
	} else {
		dev.report.base.node.chkSaved([this, dywtsc], this.node)
	}
};