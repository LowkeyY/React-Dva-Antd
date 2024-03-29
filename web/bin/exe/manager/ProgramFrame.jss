CPM.manager.ProgramFrame = Ext.extend(CPM.manager.CustomizeObject, {
	className : 'CPM.manager.ProgramFrame',
	programType : 'ProgramFrame',
	load : function(mode, parentPanel, param) {
		this.getData(mode, param, function(result, model) {

					if (!param.frameTargets || param.frameTargets.length == 0) {
						var arr = [];
						if (result.panels.length == 1) {
							frame = 3;
						} else {
							Ext.each(result.panels, function(itm) {
										if (itm.region == 'north') {
											frame = 4;
										}
										if (itm.region == 'west') {
											frame = 6;
										}
									}, this);
						}
						Ext.each(result.panels, function(itm) {
									itms = itm.items[0];
									arr.push({
												id : itms.objectId,
												frame : frame++,
												programType : itms.programType,
												pageType : itms.pageType
											});
								}, this);
						if (param.externalTargets) {
							var t = param.externalTargets;
							delete param.externalTargets;
							for (var i = 0; i < arr.length; i++) {
								for (var j = 0; j < t.length; j++) {
									if (arr[i].id == t[j].id
											&& arr[i].programType == t[j].programType) {
										arr[i].order = t[j].order;
									}
								}
							}

						}
						param.frameTargets = arr;
					}
					var panel;
					if (mode.indexOf("model") != -1) {
						CPM.addModel(param.objectId, model);
						panel = this.createModel(parentPanel, result, param);
						panel.param = param;
						this.updateData(panel, param);
					} else {
						if (param.moduleReady == false) {
							param.moduleReady = (function(p, obj, param) {
								obj.updateData(p, param);
							}).createCallBackWithArgs(this, param);
						} else {
							this.updateData(param.moduleReady, param);
							delete param.moduleReady;
						}
					}
				}, this);
	},
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return (typeof(panel) != 'undefined')
				&& panel.objectId == param.objectId
	},
	updateData : function(panel, param) {
		// 不会直接更新
		var tabpanel = panel.findParentByType("tabpanel");
		tabpanel.footer.setStyle("display", "none");
		tabpanel.body.setHeight(tabpanel.body.getHeight() + 26);
		tabpanel.doLayout();// 此处会导致直接渲染
		panel.on("destroy", function() {
					tabpanel.deferHandle && clearTimeout(tabpanel.deferHandle);
					tabpanel.body.setHeight(tabpanel.body.getHeight() - 26);
					tabpanel.footer.setStyle("display", "block");
					tabpanel.doLayout();
				}, this);
		var targets = {
			targets : param.frameTargets,
			type : 2
		}
		delete param.frameTargets;
		delete param.programType;
		delete param.sort;
		panel.items.each(function(itm) {
					itm.param = param;
				});
		tabpanel.deferHandle = CPM.replaceTarget.defer(1000, this, [undefined,
						panel.getComponent(0), param, targets]);// 此处会导致重复渲染,暂时解决--tz

	},
	createModel : function(parentPanel, json, param) {
		var items = CPM.Frame.getFrame(json);
		Ext.each(items, function(t) {
			t.border = false;
			t.isFrame = false;
			t.isSubFrame = true;
			t.subParam = param;
				// if (t.xtype == 'tabpanel') {//此段注释不知道伤害了哪一段
				// var i = t.items[0];
				// t.items = {
				// layout : 'fit',
				// objectId : i.objectId,
				// programType : i.programType
				// }
				// }
			});
		items[0].split = true;
		var p = new Ext.Panel({
					layout : 'border',
					border : false,
					items : items
				});
		p.frameIndex = items[0].frameIndex;
		parentPanel.add(p);
		return p;
	}
});