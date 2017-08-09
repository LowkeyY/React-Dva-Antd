using("bin.exe.manager.List");
CPM.manager.ProgramList = Ext.extend(CPM.manager.List, {
	className : "CPM.manager.ProgramList",
	programType : 'ProgramList',
	/*
	 * 从服务器端获取数据并render,根据mode值决定取哪一部分 @param objectId,title,dataId,importData
	 */
	load : function(mode, parentPanel, param) {
		if (param.pageType == 'empty') {
			if (mode.indexOf("model") != -1) {
				mode = "model";
			} else {
				param.moduleReady = function(p) {
					p.el.unmask();
				};
				return;
			}
		} else if (mode == "data") {
			var cache = CPM.ModelCache[param.objectId];
			if (!cache.noPatch) {
				cache.noPatch = true;
				var model = Ext.decode(cache);
				if (typeof(model.modelPatch) != 'undefined') {
					if (model.haveUnit) {
						cache.noPatch = false;
						var patch = model.modelPatch;
						var u = new Array();
						for (var i = 0; i < patch.length; i++) {
							if (patch[i].unit) {
								u.push(model.cm[i].dataIndex);
								u.push(patch[i].unit);
							}
						}
						if (u.length > 0)
							param.unit_tz_plugin = u.join(":");
					}
					if (typeof(model.sortInfo) == 'object') {
						cache.noPatch = false;
						param.sort = model.sortInfo.field;
						param.dir = model.sortInfo.direction;
					}
				}
			}
		}
		var sup = this.getSuper();
		sup.load.call(this, mode, parentPanel, param);
	},
	adjustPanel : function(panel, param, json) {// 更改配置形态的panel
		panel.pageType = param.pageType;
		if (param.pageType == 'empty' && panel.tbar) {
			Ext.each(panel.tbar.items, function(btn) {
						btn.hidden = true;
					});

		}
		panel.store.on("beforeload", function() {
					return this.pageType != 'empty';
				}, panel);
		return this.getSuper().adjustPanel.call(this, panel, param, json);
	},

	changePageType : function(panel, param) {
		var show = param.pageType != 'empty';
		var tbar = panel.getTopToolbar();
		tbar && tbar.items.each(function(item) {
					item.setVisible(show);
				}, this);
		if (!show) {
			panel.store.removeAll();
		}
		panel.pageType = param.pageType;
	},
	updateData : function(panel, param) {
		if (panel.pageType != param.pageType) {
			this.changePageType(panel, param);
		}
		if (param.pageType == 'empty') {
			return;
		}
		this.getSuper().updateData.call(this, panel, param)
	},
	saveColumModel : function(id, objectId, programType) {
		var g = Ext.getCmp(id);
		if(g.notSaveColumModel)
			return;
		var fields = new Array();
		var store = g.getStore();
		var csort = Ext.apply({}, store.getSortState());
		var u = store.baseParams.unit_tz_plugin;
		var haveUnit = false;
		var umap = {};
		if (u) {
			u = u.trim();
			if (u) {
				var arr = u.split(":");
				haveUnit = true;
				for (var i = 0; i < arr.length; i += 2) {
					umap[arr[i]] = arr[i + 1];
				}
			}
		}
		Ext.each(g.getColumnModel().config, function(c) {
					var obj = {
						header : c.header,
						width : c.width,
						dataIndex : c.dataIndex,
						hidden : (c.hidden) ? true : false
					}
					if (csort && csort.field == c.dataIndex) {
						obj.sorttype = csort.direction;
					}
					if (haveUnit && umap[c.dataIndex]) {
						obj.unit = umap[c.dataIndex];
					}
					fields.push(obj);
				});
		fields.shift();
		CPM.get({
					url : CPM.action,
					method : 'POST',
					params : {
						programType : programType,
						objectId : objectId,
						fields : Ext.encode(fields),
						sort : csort ? Ext.encode(csort) : csort
					},
					success : function() {
						CPM.removeModel(id);
					}
				});
	},
	createColumnModel : function(json) {
		var cm = json.cm, tar = null;
		for (var i = 0; i < cm.length; i++) {
			if (typeof(cm[i].target) != 'undefined') {
				tar = cm[i].target;
				delete cm[i].target;
				break;
			}
		}
		if (json.modelPatch) {
			var len = Math.min(json.modelPatch.length, cm.length)
			for (var i = 0; i < len; i++) {
				Ext.apply(cm[i], json.modelPatch[i]);
			}
		}
		cm.unshift(new Ext.grid.RowNumberer());
		cm = this.getSuper().createColumnModel(json);
		if (tar != null)
			cm.target = tar;
		return cm;
	},
	fixPanel : function(panel, param, json) {
		var fn = this.saveColumModel.createCallback(panel.id, param.objectId,
				this.programType);
		panel.on("columnresize", fn);
		panel.on("sortchange", fn);
		var cm = panel.getColumnModel()
		cm.on("widthchange", fn);
		cm.on("hiddenchange", fn);
		cm.on("columnmoved", fn);
		cm.on("columnlockchange", fn);
		if (json.haveUnit) {
			cm.on("headerchange", fn);
			if (json.unit_tz_plugin)
				panel.getStore().baseParams.unit_tz_plugin = json.unit_tz_plugin;
		}
		return this.getSuper().fixPanel(panel, param, json);
	}
});
