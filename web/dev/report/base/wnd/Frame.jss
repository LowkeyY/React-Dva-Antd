
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.wnd");
dev.report.base.wnd.Frame = function(cb, frameset, dom, conf) {
	this.holder = frameset.holder;
	this._frameset = frameset;
	this.dom = dom;
	this._conf = conf;
	this._domId = frameset._domId;
	this.name = conf.name;
	this._autoSelOn = dev.report.base.app.appMode == dev.report.base.grid.viewMode.DESIGNER
			|| (dev.report.qa && dev.report.qa.auto) ? "onmousedown" : "onmouseover";
	if (conf.params && conf.params.forExport == "yes") {
		frameset._eFrame = this
	}
	this._spawnNode(cb, conf)
};
dev.report.base.wnd.Frame.prototype = {
	_spawnNode : function(cb, data) {
		switch (data.type) {
			case "workbook" :
				this.node = new dev.report.base.grid.Book(cb, this, data.uid,
						this.name, {
							g : data.group,
							h : data.hierarchy,
							n : data.node,
							p : data.ldres[1].perm,
							v : false
						}, this._conf.params);
				break
		}
	},
	_autoSelect : function(state) {
		var that = this, jwapp = dev.report.base.app;
		this.dom[this._autoSelOn] = state ? function(ev) {
			if (that.holder == dev.report.base.wnd.active) {
				that._select(ev || window.event)
			}
		} : null
	},
	_select : function(ev) {
		this._frameset.setActiveFrame(this);
		var res = this.node && this.node._select ? this.node._select() : true;
		if (ev) {
			dev.report.util.refireEvent(ev)
		}
		return res
	},
	_fit : function() {
		if (this.node && this.node._fit) {
			this.node._fit()
		}
	},
	_unload : function() {
		if (this.node && this.node._unload) {
			this.node._unload()
		}
	},
	select : function() {
		this._frameset.setActiveFrame(this);
		this.holder.select()
	},
	unload : function() {
		this.holder.unload()
	},
	refresh : function() {
		if (this.node && this.node.refresh) {
			this.node.refresh()
		}
	},
	getDom : function() {
		return this.dom
	},
	getDomCnt : function(id) {
		return this.holder.getDomCnt(id)
	},
	getPosition : function() {
		return Ext.get(this.dom).getXY()
	},
	getInnerWidth : function() {
		return this.dom.offsetWidth
	},
	getInnerHeight : function() {
		return this.dom.offsetHeight
	},
	getName : function() {
		return this.name
	},
	setName : function(name) {
		this.name = name
	},
	replaceNode : function(cb, data) {
		var that = this, oldNode = this.node, saveOld = false;
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
			that._select();
			that.node._unload();
			that._spawnNode([that, cbSpawn], data)
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
	}
};