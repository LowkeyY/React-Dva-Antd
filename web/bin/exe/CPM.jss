/**
 * 
 * Custom Panel Manager(定制面板管理器)
 * 
 * @param manager
 *            命名空间
 * @param ModelCache
 *            缓存所有object的model
 * @param Modules
 *            存放和所有mudule的原型类
 */
window.CPM = {
	manager : {},// modules name space
	ModelCache : {},
	Modules : {},
	addModel : function(id, Model) {
		this.ModelCache[id] = Model;
	},
	removeModel : function(id) {
		delete this.ModelCache[id];
	},
	init : function() {
		var fn = function(e) {
			if (e.ctrlKey && e.getKey() == e.S) {
				e.stopEvent();
				setTimeout(function() {
							Ext.msg("error", '此功能被关闭.'.loc());
						}, 50);
			}
		}

		Ext.EventManager.addListener(document, "keydown", fn);
		/*
		 * if(Ext.isIE){//IE下回车变TAB
		 * document.body.attachEvent("onkeydown",function(){ if
		 * (window.event.keyCode==13) window.event.keyCode=9 }); }
		 */
	}
}
/*
 * 临时方法,用于测试程序运行时间
 */
timeCache = {}
CPM.time = function(cmd, param) {
	var cur = (new Date()).getTime();
	if (cmd == 'showAll') {
		var str = "", c = 0, begin = 0;
		for (var i in timeCache) {
			str += i
					+ ":"
					+ ((c > 0)
							? (timeCache[i] - c)
							: (begin = timeCache[i]) != c) + "\n";
			c = timeCache[i];
		}
		cur = str + "\nTOTAL:" + (c - begin);
	} else if (cmd == 'reset') {
		timeCache = {};
	} else if (cmd == 'minus') {
		return cur - timeCache[param];
	} else if (cmd != undefined) {
		timeCache[cmd] = cur;
	}
	return cur;
}

/*
 * 
 * 扩展Ext.Ajax.request方法,提供默认的错误处理与url随机数
 * 
 * @param config 与 Ext.Ajax.request 方法参数相同 @param notAppendRandom
 * 是否不在url后添加随机数.默认为否
 */
CPM.get = function(config, notAppendRandom) {
	if (!config.failure)
		config.failure = CPM.getFailure;
	if (!notAppendRandom) {
		if (typeof(config.extraParams) == 'object') {
			config.extraParams.ra = Math.random();
		} else {
			config.extraParams = {
				ra : Math.random()
			};
		}
	}
	Ext.Ajax.request(config);
}

CPM.getFailure = function(response, action) {
	var msg = '';
	if (action.result) {
		msg = action.result.message
	} else {
		msg = CPM.getResponeseErrMsg(response);
	}
	if (msg)
		Ext.msg("error", msg);
}

/*
 * 
 * 获取Module类
 * 
 * @param programType Module类型 @return Module类
 */
CPM.getModule = function(programType) {
	var curModule = this.Modules[programType];
	if (typeof(curModule) == 'undefined') {
		using("bin.exe.manager." + programType);
		if (!this.Modules[programType]) {
			this.Modules[programType] = new CPM.manager[programType]();
		}
		curModule = this.Modules[programType];

	}
	return curModule;
}
/**
 * 
 * 更换target内指定的panel
 * 
 * @param panel
 *            当前panel
 * @param parentPanel
 *            panel的父面板.
 * @param param
 *            传入参数,objectId,pageType,programType可能会根据target中的参数重载.
 * @param target
 *            com.kinglib.ui.core.util.Utils类中生成的target对象,格式参考类中注释.
 */
CPM.replaceTarget = function(panel, parentPanel, param, target) {
	if (!target) {
		return;
	}

	switch (target.type * 1) {
		case 0 :
			break;
		case 1 :
			using("bin.exe.WindowFrame");
			var ts = target.targets;
			var frameWin = new bin.exe.WindowFrame(panel, parentPanel, param,
					target);
			frameWin.show();
			break;
		case 2 :
			var ts = target.targets;
			if (param.frameTargets) {
				delete param.frameTargets;
			}
			if (param.sort) {
				delete param.sort;
				delete param.dir;
			}

			if (!ts || !ts[0] || !ts[0].programType) {
				Ext.msg("error", '目标程序定制错误,请检查按钮目标框架设置!'.loc());
				return;
			} else if (ts[0].programType == 'ProgramFrame'
					|| ts[0].programType == 'WorkflowFrame') {// 框架页面
				if (ts[0].order.indexOf('load') == 0) {
					var arr = [ts.shift()];
					param.frameTargets = ts;
					ts = arr;
				} else {
					ts.shift();
				}
			}
			var cpanel = parentPanel;
			while (cpanel && !cpanel.isFrame)
				cpanel = cpanel.ownerCt;
			var frameIndex = cpanel.frameIndex;
			var subIndex = false;
			for (var i = 0; i < ts.length; i++) {
				if (ts[i].id * 1 == 0)
					continue;
				var tpan = false;
				var tsf = ts[i].frame * 1;
				if (tsf > 3 && tsf < 8) {// 框架页面4上5下6左7右
					if (!subIndex) {
						var zuoyou = false;
						var subPanels = cpanel.findBy(function(item) {
									if (item.region == 'west') {
										zuoyou = true;
									}
									return item.isSubFrame;
								}, this);
						if (subPanels.length > 0 && zuoyou ^ tsf < 6) {
							subIndex = subPanels[0].frameIndex;
						} else {
							subIndex = frameIndex;
						}
					}
					tpan = Ext.getCmp(subIndex[CPM.Frame.Map[tsf]]);
				} else {
					tpan = Ext.getCmp(frameIndex[CPM.Frame.Map[tsf]]);
				}
				var p = Ext.applyIf({
							objectId : ts[i].id,
							order : ts[i].order,
							programType : ts[i].programType
						}, param);
				if ((p.programType == 'ProgramInput'
						|| p.programType == 'WorkflowInput'
						|| p.programType == 'ProgramListInput' || p.programType == 'WorkflowListInput')
						&& p.order) {// 新旧Button
					p.pageType = p.order;
				}
				if (tsf == 5 || tsf == 3) {
					if (p.pTab && tpan.id != parentPanel.ownerCt.id) {
						p.exportTab = p.pTab;
						delete p.pTab;
						p.exportItem = p.pItem;
						delete p.pItem;
						p.exportData = p.pData;
						delete p.pData;
					}
				}

				tpan.loadProgram(p, false);
			}
			break;
	}
}
/*
 * 
 * 更换当前panel,自动判断更新方式
 * 
 * @param panel 当前panel @param parentPanel panel的父面板. @param param 传入参数
 */
CPM.replacePanel = function(panel, parentPanel, param) {
	var curModule = this.getModule(param.programType);
	if (curModule.canUpdateDataOnly(panel, parentPanel, param)) {
		curModule.updateData(panel, param);
		panel.param = param;
	} else {
		var model = this.ModelCache[param.objectId];
		if (typeof(model) != 'undefined') {
			param.moduleReady = false;
			curModule.load("data", parentPanel, param);
			CPM.replacePanel.removeLeavePanel(curModule, panel, parentPanel,
					param);

			panel = curModule
					.createModel(parentPanel, Ext.decode(model), param);
			panel.param = param;
			if (param.moduleReady == false)
				param.moduleReady = panel;
			else {
				param.moduleReady(panel);
				delete param.moduleReady;
			}
		} else {
			curModule.load("model&data", parentPanel, param);
			CPM.replacePanel.removeLeavePanel(curModule, panel, parentPanel,
					param);
		}
	}
}
CPM.replacePanel.removeLeavePanel = function(module, panel, parentPanel, param) {
	if (typeof(panel) != 'undefined') {
		var state;
		try {
			if (Ext.isDefined(panel.param.programType)) {
				state = CPM.getModule(panel.param.programType).getState(
						parentPanel, panel, param);
			}

		} catch (e) {
		}
		parentPanel.remove(panel, true);
		if (Ext.isDefined(state)) {
			CPM.History.add(state);
		}
	}
}

// 以下为private方法
CPM.Frame = {
	getFrame : function(json) {
		var width = Ext.lib.Dom.getViewWidth();
		var height = Ext.lib.Dom.getViewHeight();
		var p = json.panels;
		var pdir = {}, frameIndex = {};
		var frameType = json.modType * 1;
		for (var i = 0; i < p.length; i++) {
			p[i] = this.getFramePanel(p[i], frameType);
			pdir[p[i].region] = p[i];
			frameIndex[p[i].region] = p[i].id;
			p[i].isFrame = true;
			p[i].frameIndex = frameIndex;
		}
		switch (frameType) {
			case 2 :
				pdir.west.width = (pdir.west.width / 100) * width;
				pdir.west.hrefPanelId = pdir.center.id;// 修改树完成用相对位置定位.
				break;
			case 1 :
				pdir.center.activeTab = 0;
				var pstr = p[0].PanelType;
				pstr = Ext.urlDecode(pstr.substring(pstr.indexOf("?") + 1));
				pdir.center.listeners.beforerender = function(parentPanel) {
					parentPanel.param = pstr;
					// parentPanel.loadProgram(pstr,true);
				}
				break;
			case 3 :
				var o = pdir.west || pdir.north;

				if (Ext.isDefined(pdir.west)) {
					o.width = (o.width / 100) * width;
				} else {
					o.height = o.height / 100 * height;
				}
				delete o.title;
				var pstr = o.PanelType;
				pstr = Ext.urlDecode(pstr.substring(pstr.indexOf("?") + 1));
				if (pstr.sourcePanelId || !pstr.type) {
					Ext.copyTo(pstr, o, ["programType", "objectId"]);

					o.listeners = o.listeners || {};
					o.listeners.afterrender = function(parentPanel) {
						if (typeof(parentPanel.loadProgram) != 'undefined') {
							parentPanel.loadProgram(pstr, true);
							o.activeTab = 0;
						}
					}
					var qstr = pdir.center.PanelType;
					qstr = Ext.urlDecode(qstr.substring(qstr.indexOf("?") + 1));
					pdir.center.activeTab = 0;
					pdir.center.listeners.beforerender = function(parentPanel) {
						parentPanel.param = qstr;
					}
				}

				break;
			case 4 :// 左上下
				delete pdir.north.title;
				pdir.center.border = true;
				pdir.west.width = (pdir.west.width / 100) * width;
				p = [pdir.west, {
					border : false,
					frame : false,
					region : 'center',
					layout : 'border',
					items : [Ext.apply(pdir.north, {
										height : pdir.north.height / 100
												* height,
										border : false,
										split : true
									}), pdir.center]
				}]
				break;
		}
		return p;
	},
	getFramePanel : function(pi, frameType) {
		pi.id = Ext.id();
		if (pi.PanelType.substring(0, 1) == '4') {
			var activeItem = pi.items[pi.activeTab || 0];
			var loadXmlTree = function() {
				new bin.exe.NavPanel(this, {
							parent_id : this.objectId
						});
				this.treeCreated = true;
			}
			if (pi.items.length > 1) {
				pi.layout = 'accordion';
				Ext.each(pi.items, function(item) {
							item.collapsed = (item != activeItem);
							item.bodyStyle = 'overflow: auto;';
							item.listeners = {
								beforeexpand : function() {
									if (typeof(this.treeCreated) == 'undefined') {
										loadXmlTree.call(this);
									} else {
										this.nav.clickEvent(this.nav.getTree()
												.getNowNode());
									}
								}
							};
						});
			} else {
				pi.layout = 'fit';
				activeItem.bodyStyle = 'overflow: auto;';
				pi.title = activeItem.title;
				delete activeItem.title;
			}
			pi = Ext.applyIf(pi, this.panels.navigatorPanel);
			if (typeof(activeItem.listeners) == 'undefined')
				activeItem.listeners = {};
			activeItem.listeners.render = loadXmlTree;
		} else if (pi.PanelType.substring(0, 2) == '22') {
			var activeItem = pi.items[pi.activeTab || 0];
			using("bin.exe.FolderPanel");
			var loadXmlTree = function() {
				new bin.exe.FolderPanel(this, {
							parent_id : this.objectId
						});
				this.folderCreated = true;
			}
			if (pi.items.length > 1) {
				pi.layout = 'accordion';
				Ext.each(pi.items, function(item) {
							item.collapsed = (item != activeItem);
							item.bodyStyle = 'overflow: auto;';
							item.listeners = {
								beforeexpand : function() {
									if (typeof(this.folderCreated) == 'undefined') {
										loadXmlTree.call(this);
									} else {
										this.nav.clickEvent(this.nav.getTree()
												.getNowNode());
									}
								}
							};
						});
			} else {
				pi.layout = 'fit';
				activeItem.bodyStyle = 'overflow: auto;';
				pi.title = activeItem.title;
				delete activeItem.title;
			}
			pi = Ext.applyIf(pi, this.panels.navigatorPanel);
			if (typeof(activeItem.listeners) == 'undefined')
				activeItem.listeners = {};
			activeItem.listeners.render = loadXmlTree;
		} else if (pi.PanelType.substring(0, 2) == '26') {
			var activeItem = pi.items[pi.activeTab || 0];
			using("bin.exe.ConditionPanel");
			var loadXmlTree = function() {
				var mpanle = new bin.exe.ConditionPanel(this, {
							parent_id : this.objectId
						});
				this.folderCreated = true;
			}
			pi.layout = 'accordion';
			activeItem.bodyStyle = 'overflow: auto;';
			pi.title = activeItem.title;
			delete activeItem.title;
			// pi = Ext.applyIf(pi, this.panels.navigatorPanel);
			if (typeof(activeItem.listeners) == 'undefined')
				activeItem.listeners = {};
			activeItem.listeners.render = loadXmlTree;
		} else if (frameType > 2 && pi.region == 'north') {
			if (Ext.isArray(pi.items)) {
				var its = pi.items[0];
				delete pi.items;
				Ext.apply(pi, its);
			}
			var m = this.panels.singlePanel;
			if (typeof(pi.listeners) == 'undefined')
				pi.listeners = {};
			pi = Ext.applyIf(pi, m);
			Ext.applyIf(pi.listeners, m.listeners);
		} else {

			var m = this.panels.tabPanel;
			if (typeof(pi.listeners) == 'undefined')
				pi.listeners = {};
			pi = Ext.applyIf(pi, m);
			Ext.applyIf(pi.listeners, m.listeners);
			Ext.each(pi.items, function(item) {
						item.layout = 'fit';
					});
			if (pi.region == 'west') {// 左框架tabpanel不是树,需要自启动
				if (pi.items.length > 0) {
					var su = pi.items[0];
					pi.param = {
						objectId : su.objectId,
						pageType : su.pageType,
						programType : su.programType
					}
				}
			}
		}
		return pi;
	},
	panels : {
		tabPanel : {
			xtype : 'tabpanel',
			activeTab : 0,
			border : false,
			tabPosition : 'bottom',
			param : false,
			loadProgram : function(p, selfAdapting) {
				var parentPanel = this.getActiveTab();
				p = Ext.apply({}, p);
				if (parentPanel && p.objectId != parentPanel.objectId) {
					var ooid = p.objectId;
					this.items.each(function(item) {
								if (item.objectId == ooid) {
									parentPanel = item;
									this.setActiveTab(parentPanel);
									return false;
								}
							}, this)
				}
				if (!parentPanel) {
					parentPanel = this.getComponent(0);
				}
				if(parentPanel.exportFilters){
					p.exportFilters = parentPanel.exportFilters;
				}
				var pageType = "new";
				if (typeof(this.param.pageType) == 'undefined') {
					if (typeof(this.param.dataId) == 'undefined')
						pageType = "new";
					else
						pageType = "view";
				} else {
					pageType = this.param.pageType;
				}
				Ext[selfAdapting ? "apply" : "applyIf"](p, {
							dataId : this.param.dataId,
							objectId : parentPanel.objectId,
							programType : parentPanel.programType,
							pageType : pageType
						});
				if (p.order) {
					var order = p.order;
					delete p.order;
					if (CPM.getModule(p.programType).doCommand(order, p,
							parentPanel) === false) {
						return false;
					}
				}
				CPM.replacePanel(parentPanel.getComponent(0), parentPanel, p);
				this.param.pageType = p.pageType;
			},
			listeners : {
				beforetabchange : function(obj, newTab, curTab) {
					if (this.param == false)
						return;
					if (newTab
							&& typeof(CPM.getModule(newTab.programType)) == 'undefined') {
						Ext.msg("error", '尚未支持类型:'.loc() + newTab.programType);
						return false;
					}
					if (curTab) {
						var cp = curTab.getComponent(0)
						if (cp && cp.param) {
							var cpp = cp.param;
							obj.param.exportTab = cpp.exportTab;
							obj.param.exportItem = cpp.exportItem;
							obj.param.exportData = cpp.exportData;
						}
					}
				},
				tabchange : function(tabPanel, newTab, curTab) {
					// tabpanel渲染时无param,tabpanel,loadProgram之前附上
					if (tabPanel.param == false || newTab == undefined)
						return;
					if (newTab)
						tabPanel.param.objectId = newTab.objectId;
					tabPanel.loadProgram(tabPanel.param, true);
				}
			}
		},
		singlePanel : {
			param : false,
			xtype : 'panel',
			bodyStyle : 'background-color: white;',
			loadProgram : function(params, selfAdapting) {
				var panel = this.items ? this.getComponent(0) : undefined;
				if (typeof(params.programType) != 'undefined')
					CPM.replacePanel(panel, this, params);
			}
		},
		navigatorPanel : {
			split : true,
			collapsible : true,
			param : false,
			scope : this,
			loadProgram : function(params, selfAdapting) {
				var activePanel = this.getComponent(0);
				var nav = activePanel.nav;
				if (nav == undefined) {
					activePanel.navCallBack = this.loadProgram.createDelegate(
							this, [params, selfAdapting]);
					return;
				}
				if (Ext.isFunction(activePanel.loadTreeHandler)) {
					activePanel.loadTreeHandler(activePanel, params, nav
									.getTree());
				}

				if (params.order) {
					var order = params.order;

					delete params.order;
					var event = nav.clickEvent.createDelegate(nav);
					if (order == 'selfNode') {
						nav.getTree().loadSelfNodeWithLevel(params.dataId,
								event);
					} else if (order == 'parentNode') {
						nav.getTree().loadParentNode(event);
					} else if (order == 'subNode') {
						nav.getTree()
								.loadSubNodeWithLevel(params.dataId, event);
					} else if (order == 'rootNode') {
						nav.getTree().loadRootNode(params.dataId, event);
					}
				}
			}
		}
	},
	Map : ["", "west", "north", "center", "north", "center", "west", "center",
			"center"]
}

CPM.manager.CustomizeObject = function(config) {

	this.init(config);
};

CPM.manager.CustomizeObject.prototype = {
	/**
	 * 当前类的名称(全名)
	 */
	className : 'CPM.manager.CustomizeObject',
	/**
	 * 获取父类,需要设本类的className属性
	 */
	getSuper : function() {
		return eval(this.className + ".superclass");
	},
	/**
	 * 初始化类
	 */
	init : Ext.emptyFn,
	/**
	 * 从服务器端获取数据,拿到数据后执行callback
	 */
	getData : function(DataPartMode, params, callback, scope) {
		params.DataPartMode = DataPartMode;
		CPM.doAction({
			method : 'GET',
			params : params,
			success : function(response, options) {
				if (response.responseText) {
					var result = Ext.decode(response.responseText);
					Ext.i18n.apply(result);
					callback.call(scope || this, result, response.responseText);
				} else {
					callback.call(scope || this, {}, '');
				}
			}
		}, this);
		delete(params.DataPartMode);
	},
	/**
	 * 相应系统对当前对象发出的命令
	 */
	doCommand : function(cmd, param, parentPanel) {
		if (this.commands[cmd])
			return this.commands[cmd](param, parentPanel);
		return true;
	},
	/**
	 * 定义当前类可响应的命令
	 */
	commands : {},
	/**
	 * 获取当前对象的状态
	 */
	getState : function(owner, panel, param) {
		if (panel.param) {
			return {
				owner : owner.id,
				programType : panel.param.programType,
				params : Ext.encode(panel.param)
			}
		}
	},
	/**
	 * 恢复当前对象的状态
	 */

	applyState : function(owner, state) {
		if (state) {
			CPM.replacePanel(owner.getComponent(0), owner, Ext
							.decode(state.params));
		}
	},
	/**
	 * 模拟执行button的操作,主要用于js扩展,buttonConfig要参考buttonFactory类。
	 */
	executeButtonAction : function(action, panelId, buttonConfig) {
		var config = Ext.applyIf({
					action : action,
					panelId : panelId,
					handler : Ext.emptyFn
				}, buttonConfig);
		var btn = this.getButton(config, panelId);
		btn.handler.call(btn, btn);
	},
	/**
	 * 生成button
	 */
	getButton : function(btn, panelId) {
		var panel = Ext.getCmp(panelId);
		if (typeof(this.buttonMap[btn.action]) != 'undefined') {
			return CPM.mkButton(btn, panelId, this.buttonMap[btn.action], this);
		} else if (this.getSuper() != null) {
			return this.getSuper().getButton(btn, panelId);
		} else {
			return CPM.mkButton(btn, panelId, {});
		}
	},
	/**
	 * 定义当前类的button相应方式
	 */
	buttonMap : {
		'%define' : {
			handler : function(btn) {
				if (btn.button_js)
					eval(unescape(btn.button_js));
				var panel = Ext.getCmp(btn.panelId);
				CPM
						.replaceTarget(panel, panel.ownerCt, panel.param,
								btn.target);
			}
		},
		'%return' : {
			handler : function(btn) {
				if (btn.target && btn.target.type != "0") {
					var panel = Ext.getCmp(btn.panelId);
					CPM.replaceTarget(panel, panel.ownerCt, panel.param,
							btn.target);
					CPM.History.cancel(2);

				} else {
					history.go(-1);
				}
			}
		},
		'%calculate' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var params = {};
				Ext.apply(params, panel.param);
				params['objectId'] = btn.button_class;
				var mask = new Ext.LoadMask(panel.ownerCt.getEl(), {
							msg : '正在计算中...'.loc(),
							msgCls : 'x-mask-loading'
						});
				mask.show();
				Ext.Ajax.request({
					url : '/bin/exe/caculate.jcp',
					params : params,
					method : 'post',
					timeout : 1800000,
					scope : this,
					success : function(response, options) {
						var check = response.responseText;
						var ajaxResult = Ext.util.JSON.decode(check);
						if (ajaxResult.success) {
							if (ajaxResult.taskType
									&& ajaxResult.taskType == '5') {
								params['type'] = 'condition';
								Ext.Ajax.request({
									url : '/bin/exe/caculate.jcp',
									method : 'POST',
									params : params,
									scope : this,
									success : function(response, options) {
										var check = response.responseText;
										check = check.replace(/xtitleList/ig,
												'fieldLabel');
										var frameJSON = Ext.decode(check);
										if (frameJSON.success) {
											if (frameJSON.searchEditor.editors.length > 0) {
												params['type'] = 'exec';
												using("bin.exe.ParamsWindow");
												var paramsWin = new bin.exe.ParamsWindow(
														btn, panel, params,
														frameJSON);
												paramsWin.show();
											} else {
												this
														.showReport(
																this.params['parent_id'],
																{});
											}
										} else {
											Ext
													.msg(
															"error",
															'数据删除失败!,原因:'.loc()
																	+ '<br>'
																	+ ajaxResult.message);
										}
									}
								});
							} else {
								if (btn.target.type == '0') {
									Ext.msg("info", '完成计算.'.loc());
								} else {
									CPM.replaceTarget(panel, panel.ownerCt,
											panel.param, btn.target);
								}
							}
						} else {
							Ext.msg("error", '执行失败!原因:'.loc() + '<br>'
											+ ajaxResult.message);
						}
						mask.hide();
					},
					failure : function(response, options) {
						mask.hide();
						Ext.msg("error", CPM.getResponeseErrMsg(response));
					}
				});
			}
		},
		'%print' : {
			handler : function(btn) {
				using('bin.exe.PageWindow');
				var panel = Ext.getCmp(btn.panelId);
				var params = {};
				Ext.apply(params, panel.param);
				var url = '/bin/exe/pdfprinter.jcp';
				var pdfSetWin = new bin.exe.PageWindow(url, params);
				pdfSetWin.show();
			}
		},
		'%close' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				panel = panel.findParentByType(Ext.Window);
				if (panel)
					panel.close();
			}
		},
		'%favorite' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var params = {};
				Ext.apply(params, panel.param);
				params['type'] = 'favorite';
				var conn = new Ext.data.Connection();
				conn.request({
							method : 'POST',
							url : '/bin/exe/favorite.jcp',
							params : params
						});
				conn.on('requestcomplete', function(conn, oResponse) {
							CPM.replaceTarget(panel, panel.ownerCt,
									panel.param, btn.target);
							Ext.msg("info", '收藏成功!'.loc());
						}, this);
			}
		},
		'%cancelfavorite' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var params = {};
				Ext.apply(params, panel.param);
				params['type'] = 'cancelfavorite';
				var conn = new Ext.data.Connection();
				conn.request({
							method : 'POST',
							url : '/bin/exe/favorite.jcp',
							params : params
						});
				conn.on('requestcomplete', function(conn, oResponse) {
							CPM.replaceTarget(panel, panel.ownerCt,
									panel.param, btn.target);
							Ext.msg("info", '收藏取消成功!'.loc());
						}, this);
			}
		}
	}

};

CPM.mkButton = function(btn, panelId, config, scope) {
	if (typeof(config) == 'function') {
		btn = config.call(scope || this, btn, panelId);
	} else {
		Ext.apply(btn, {
					panelId : panelId,
					cls : "x-btn-text-icon"
				}, config)
	}
	if (btn.icon.indexOf("themes") != 1)
		btn.icon = '/themes/icon' + btn.icon;
	return btn;
}

CPM.doAction = function(config, object) {
	Ext.applyIf(config, {
				url : CPM.action,
				scope : object,
				method : 'GET'
			});
	if (!config.params.programType)
		config.params.programType = object.programType;

	var tmpFn = config.failure || Ext.emptyFn;
	config.failure = function(response, action) {
		if (tmpFn(response, action) === false)
			return;
		var isFormSubmit = (response instanceof Ext.form.BasicForm);
		if (isFormSubmit) {
			response = action.response
			if (!response)
				response = {
					status : action.failureType,
					statusText : ''
				}
		}
		Ext.msg("Err", response);
	}

	var tmpSn = (typeof(config.success) == 'function')
			? config.success
			: Ext.emptyFn;
	config.success = function(response, action) {
		var isFormSubmit = (response instanceof Ext.form.BasicForm);
		if (isFormSubmit) {
			response = action.response
		}
		var success = true, result = null;
		if (response.responseText != '') {
			if (isFormSubmit) {
				if (action.result) {
					success = action.result.success;
				}
			} else {
				var reg = new RegExp("success\"?\\s*:\\s*(\\w*)", "ig");
				reg.exec(response.responseText);
				success = (RegExp.$1 != 'false');
			}
			if (success === false) {
				if (tmpFn(response, action) === false)
					return;
				Ext.msg("Err", response);
				return;
			}
		}
		tmpSn.apply(this, arguments)
	}
	if (config.form) {
		(config.form.form || config.form).submit(config);
	} else {
		Ext.Ajax.request(config);
	}
}

CPM.getResponeseErrMsg = function(response) {
	var msg = '未知错误'.loc();
	if (response.status > 199 && response.status < 300)
		return '';
	switch (response.status) {
		case 500 :
			msg = '服务器发生未知错误.'.loc()
			break;
		case 403 :
			msg = '访问服务器被拒绝'.loc();
			break;
		case 404 :
			msg = '未找到请求的页面'.loc();
			break;
		case 405 :
			msg = '不允许访问本页面的当前方法'.loc();
			break;
		case 408 :
		case -1 :// 目前没有人为调用Connection.abort
			msg = '访问超时'.loc();
			break;
		case 502 :
			msg = '无法连接'.loc();
			break;
		case 504 :
		case 0 :
		case undefined :
			msg = '网络已断开,不能连接到服务器'.loc()
			break;
		default :
			msg = '系统错误,错误代码:'.loc() + response.status;
	}
	return msg;
}

CPM.action = '/bin/exe/action.jcp';
/*
 * 生成帮助按钮,只能用于Config对象,toolbar必须也是config对象。
 */
CPM.Help = {
	showHelpWindow : function(button) {
		var objectId = (button.objectId || button);
		var showHelpWin = new Ext.Window({
			width : 1024,
			height : 768,
			icon : '/themes/icon/all/book_open.gif',
			autoScroll : false,
			layout : 'fit',
			modal : true,
			title : '帮助'.loc(),
			items : new Ext.ux.IFrameComponent({
				height : 600,
				url : '/home/system/help/helpShow.jcp?objectId=' + objectId,
				style : 'background: white none repeat scroll 0% 0%; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous;'
			})
		});
		showHelpWin.show();
	},
	editHelpWindow : function(button) {
		var objectId = (button.objectId || button);
		var userId = "";
		useJS(
				['/lib/FCKeditor/fckeditor.js',
						'/lib/FCKeditor/ExtFckeditor.js'], function() {
					var editHelpDelBar = new Ext.Toolbar.Button({
						id : 'delete',
						text : '删除'.loc(),
						icon : '/themes/icon/common/delete.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						handler : function() {
							Ext.msg('confirm', '警告:删除帮助将不可恢复,确认吗?'.loc(),
									function(answer) {
										Ext.Ajax.request({
											url : '/home/system/help/categorycreate.jcp',
											method : 'Post',
											params : {
												parent_id : objectId,
												type : "objectDelete"
											},
											scope : this,
											callback : function(options,
													success, response) {
												Ext.msg("info", '数据已删除!'.loc());
												editHelpWin.close();
											},
											failure : function(form, action) {
												Ext.msg("warn", '未删除成功,请查证!'
																.loc());
											}
										})
									}.createDelegate(this));
						}
					});
					var editHelpPanel = new Ext.form.FormPanel({
						labelAlign : 'right',
						border : false,
						height : 600,
						autoScroll : false,
						bodyStyle : 'padding:10px 0px 0px 0px;background:#FFFFFF;',
						items : [new lib.FCKeditor.ExtFckeditor({
							name : 'forder_detail',
							id : 'forder_detail',
							height : 600,
							hideLabel : true,
							allowBlank : false,
							BasePath : '/lib/FCKeditor/editor/',
							PluginsPath : '/lib/FCKeditor/editor/plugins/',
							blankText : '必须输入报告模板文档'.loc(),
							ToolbarSet : "help",
							SkinPath : '/lib/FCKeditor/editor/skins/office2003/'
						})],
						tbar : [new Ext.Toolbar.Button({
							id : 'save',
							text : '保存'.loc(),
							icon : '/themes/icon/xp/save.gif',
							cls : 'x-btn-text-icon  bmenu',
							disabled : false,
							scope : this,
							handler : function() {
								Ext.Ajax.request({
											url : '/home/system/help/helpUpdate.jcp',
											method : 'Post',
											params : {
												objectId : objectId,
												htmlData : editHelpPanel
														.findById("forder_detail")
														.getValue()
											},
											scope : this,
											callback : function(options,
													success, response) {
												Ext
														.msg("info", '数据更新成功!'
																		.loc());
												editHelpDelBar.enable();
											},
											failure : function(form, action) {
												Ext.msg("warn", '未保存成功,请查证!'
																.loc());
											}
										})
							}
						}), new Ext.Toolbar.Button({
							id : 'new',
							text : '重置'.loc(),
							icon : '/themes/icon/xp/refresh.gif',
							cls : 'x-btn-text-icon  bmenu',
							disabled : false,
							scope : this,
							handler : function() {
								editHelpPanel.load({
									url : '/dev/program/createHelper.jcp?objectId='
											+ objectId
											+ "&viewType=create&ra="
											+ Math.random(),
									method : 'get'
								});
							}
						}), editHelpDelBar]
					});
					editHelpPanel.load({
								url : '/dev/program/createHelper.jcp?objectId='
										+ objectId + "&viewType=edit&ra="
										+ Math.random(),
								method : 'get'
							});
					var editHelpWin = new Ext.Window({
								width : 1024,
								height : 768,
								icon : '/themes/icon/all/book_open.gif',
								autoScroll : false,
								layout : 'fit',
								modal : true,
								title : '帮助'.loc(),
								items : editHelpPanel
							});
					Ext.Ajax.request({
								url : '/home/system/help/helpShow.jcp',
								method : 'Post',
								params : {
									objectId : objectId
								},
								scope : this,
								callback : function(options, success, response) {
									if (success) {
										var result = response.responseText;
										result = Ext.decode(result);
										if (!(result.isdel)) {
											editHelpDelBar.disable();
										}
									}
								}
							});
					editHelpWin.show();
				});

	},
	addHelpButton : function(panel, param) {
		var helpButton = {
			type : 'button',
			icon : '/themes/icon/all/help.gif',
			style : 'margin-right:5px',
			cls : 'x-btn-icon',
			objectId : param.objectId,
			tooltip : '点击后查看帮助'.loc(),
			handler : CPM.Help.showHelpWindow
		};
		var tb = panel.tbar;
		if (!Ext.isDefined(tb)) {
			tb = panel.tbar = {
				xtype : 'toolbar',
				enableOverflow : true,
				items : ["->", helpButton]
			}
		} else {
			if (Ext.isArray(tb)) {
				tb = panel.tbar = {
					xtype : 'toolbar',
					enableOverflow : true,
					items : tb
				}
			}
			if (!Ext.isArray(tb.items) || tb.items.length == 0) {
				tb.items = ["->", helpButton];
			} else {
				var found = false;
				var it = tb.items
				for (var i = 0; i < it.length; i++) {
					if ((it[i] == '->' || it[i].xtype == 'tbfill' || it[i] instanceof Ext.Toolbar.Fill)) {
						found = true;
						break;
					}
				}
				if (!found)
					it.push("->");
				it.push(helpButton);
			}
		}
	}
}
/**
 * 通过form表单将参数提交到新窗口
 */
CPM.popWin = function(url, params, target) {
	var form = document.createElement('form');
	form.target = target || "_blank";
	form.method = 'POST';
	form.id = Ext.id();
	form.action = url;
	var hiddens, hd;
	if (params) {
		hiddens = [];
		for (var k in params) {
			hd = document.createElement('input');
			hd.type = 'hidden';
			hd.name = k;
			hd.value = params[k];
			form.appendChild(hd);
			hiddens.push(hd);
		}
	}
	document.body.appendChild(form);
	form.submit();
	setTimeout(function() {
				Ext.removeNode(form);
			}, 100);

}

CPM.History = {
	add : function(state) {
		var win = WorkBench.Desk.getDesktop().activeWindow;
		if (win) {
			if (!Ext.isArray(win.hArray)) {
				this.initWindow(win);
			}
			win.hArray[win.hPoint] = state
			win.hPoint++;
			if (win.chop) {
				Ext.History.add();
				if (win.hArray.length > win.hPoint)
					win.hArray = win.hArray.slice(0, win.hPoint);
			}
		}
	},
	initWindow : function(win) {
		win.hArray = [];
		win.hPoint = 0;
		win.chop = true;
	},
	cancel : function(steps) {
		var win = WorkBench.Desk.getDesktop().activeWindow;
		if (win) {
			if (win && Ext.isArray(win.hArray) && win.hArray.length > 0) {
				var tar = win.hPoint - steps;
				if (tar < 0 || tar >= win.hArray.length) {
					return;
				}
				win.hArray.splice(tar, steps);
				win.hPoint = tar
			}
		}
	},
	change : function(token) {
		var win = WorkBench.Desk.getDesktop().activeWindow;
		if (win) {
			if (win && Ext.isArray(win.hArray) && win.hArray.length > 0) {
				var tar = win.hPoint + token;
				if (tar < 0 || tar >= win.hArray.length) {
					return;
				}
				var state = win.hArray[tar];
				var owner = Ext.getCmp(state.owner)
				if (Ext.isDefined(owner)) {
					win.chop = false;
					CPM.getModule(state.programType).applyState(owner, state);
					win.chop = true;
				} else {
					win.hArray.splice(tar, 1);
					CPM.History.change(token > 0 ? 1 : -1);
				}
				win.hPoint = tar
			}
		}
	}
}
/**
 * 弹出一个定制好的模块
 * 
 * @param objectId
 *            要弹出的模块的ＩＤ
 * @param sourcePanel
 *            按钮所在的panel的id,也就是这个弹出窗口是从哪个窗口弹出的,传入那个窗口的ID.
 * @param params
 *            要传入的参数,可选
 * @param windowConfig
 *            弹出窗口的配置信息,具体可以参见Ext.Window的配置信息,可选.
 */
CPM.openModuleWindow = function(objectId, sourcePanel, params, windowConfig) {

	var p = {
		objectId : objectId,
		sourcePanelId : sourcePanel.id
	};
	sourcePanel.param && Ext.applyIf(p, sourcePanel.param);
	params && Ext.apply(p, params);
	CPM.get({
				method : 'GET',
				url : '/bin/exe/getFrame.jcp?parent_id=' + p.objectId,
				success : function(response, options) {

					var moduleJson = Ext.decode(response.responseText);
					if (!Ext.isDefined(moduleJson.panels)) {
						Ext.msg("error", '服务器发生未知错误'.loc());
						return;
					}
					if (moduleJson.panels.length < 1) {
						Ext.msg("error", '顶层导航或本模块主程序设置错误'.loc());
						return;
					}
					Ext.i18n.apply(moduleJson);
					var pStr = Ext.urlEncode(p, "&")
					Ext.each(moduleJson.panels, function(itm) {
								itm.PanelType += pStr;
								var its = itm.items; 
								if(p.exportFilters && its && its[0].programType == "ProgramList"){
									its[0].exportFilters = p.exportFilters;
								}
							})
					w.add(new Ext.Panel({
								layout : 'border',
								border : false,
								items : CPM.Frame.getFrame(moduleJson)
							}));
					w.doLayout();
				},
				failure : CPM.getFailure
			}, true);
	var cfg = {
		width : 1200,// 父窗体的80%
		height : 800,
		icon : '/themes/icon/all/book_open.gif',
		autoScroll : false,
		constrainHeader : true,
		layout : 'fit',
		modal : true,
		manager : WorkBench.Desk.getDesktop().windows
	};
	windowConfig && Ext.apply(cfg, windowConfig);
	var w = new Ext.Window(cfg);
	w.show();
}

Ext.History.on("numberchange", CPM.History.change);

Ext.onReady(CPM.init);
