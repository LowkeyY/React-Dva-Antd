WorkBench.baseNode = function() {
	this.frames = new Ext.ux.FrameParams();
};
WorkBench.baseNode.prototype = {
	createMenu : function(menuType, menus) {
		var ButtonArray = [];
		for (var i = 0; i < menus.length; i++) {
			var pageMenuItem = menus[i];
			var app_id = pageMenuItem.id;
			var app_title = pageMenuItem.title;
			var app_name = pageMenuItem.path;
			var object_id = pageMenuItem.object_id;
			var icon_url = pageMenuItem.icon;
			var isIFrame = pageMenuItem.isIframe;
			Ext.useShims = true;
			var subMenuArray = pageMenuItem.submenu;
			var subPageMenu = null;
			if (i != 0) {
				ButtonArray.push(new Ext.Toolbar.Spacer());
				ButtonArray.push(new Ext.Toolbar.Spacer());
				ButtonArray.push(new Ext.Toolbar.Spacer());
				ButtonArray.push(new Ext.Toolbar.Spacer());
			}

			if (pageMenuItem.submenu) {
				subPageMenu = this.getSubMenu(subMenuArray,
						this.menuConfig.windowId);
				ButtonArray.push(new Ext.Toolbar.Button(Ext.apply({
							id : app_id,
							text : app_title,
							cls : 'x-btn-text  bmenu',
							disabled : false,
							hidden : false,
							scope : this,
							app_name : app_name,
							menu : subPageMenu
						} , icon_url && icon_url.match(/^\/48all\//) ? { //暂时处理 菜单大图标
							iconUrl : icon_url,
							//scale : "large",
							template :  new Ext.Template(
					                    '<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
					                    '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
					                    '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><img src={5}><em class="{2}" unselectable="on"><button type="{0}"></button></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
					                    '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
					                    '</tbody></table>'),
					        getTemplateA : Ext.Button.prototype.getTemplateArgs,
					        getTemplateArgs : function(){
					        	return this.getTemplateA().concat("/themes/icon/"+this.iconUrl);
					        }
						} :{})));
			} else {
				if (pageMenuItem.path == 'bin.exe.Frame' && object_id) {
					ButtonArray.push(new Ext.Toolbar.Button({
						id : app_id,
						text : app_title,
						cls : 'x-btn-text  bmenu',
						disabled : false,
						hidden : false,
						scope : this,
						parent_id : object_id,
						//windowsId : windowId,
						isIFrame : isIFrame,
						app_name : app_name,
						handler : function(btn) {
							if (btn.menu)
								return false;
							if (btn.handling)
								return false;

							btn.handling = true;
							var revoke = function() {
								btn.handling = false;
							};
							setTimeout(revoke, 2000);
							var MainFramePanel = this.mainPanel;
							CPM.get({
										method : 'GET',
										url : '/bin/exe/getFrame.jcp?parent_id='
												+ btn.parent_id,
										success : function(response, options) {
											var moduleJson = Ext
													.decode(response.responseText);
											var cn = MainFramePanel
													.getComponent(0);
											if (typeof(cn != undefined)) {
												try {
													MainFramePanel.remove(cn);
												} catch (e) {
												}
											}
											MainFramePanel.add(new Ext.Panel({
														layout : 'border',
														border : false,
														items : CPM.Frame
																.getFrame(moduleJson)
													}));
											MainFramePanel.doLayout();
										}
									}, true);
						}
					}));
				} else {
					ButtonArray.push(new Ext.Toolbar.Button({
								id : app_id,
								text : app_title,
								cls : 'x-btn-text  bmenu',
								disabled : false,
								hidden : false,
								scope : this,
								parent_id : object_id,
								//windowsId : windowId,
								isIFrame : isIFrame,
								app_name : app_name,
								handler : this.menuClick
							}));
				}
			}
		}

		var config = {
			items : this.getMainPanel()
		}
		if (ButtonArray.length > 0) {
			config[(menuType == 'bottom') ? 'bbar' : 'tbar'] = ButtonArray;
		}
		this.createWindow(this.menuConfig, config)
	},
	getTree : function(nodes) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].icon) {
				nodes[i].icon = '/themes/icon/' + nodes[i].icon;
			}
			nodes[i].text = nodes[i].title;
			if (nodes[i].submenu) {
				nodes[i].expanded = true;
				nodes[i].children = this.getTree(nodes[i].submenu)
			} else {
				nodes[i].leaf = true;
			}
		}
		return nodes;
	},
	treeClick : function(node) {
		if (!node.leaf || node.attributes.object_id == 0)
			return false;

		var MainFramePanel = this.mainPanel;
		CPM.get({
					method : 'GET',
					url : '/bin/exe/getFrame.jcp?parent_id='
							+ node.attributes.object_id,
					success : function(response, options) {
						var moduleJson = Ext.decode(response.responseText);
						Ext.i18n.apply(moduleJson);
						var cn = MainFramePanel.getComponent(0);
						if (typeof(cn != undefined)) {
							try {
								MainFramePanel.remove(cn);
							} catch (e) {
							}
						}
						MainFramePanel.add(new Ext.Panel({
									layout : 'border',
									border : false,
									items : CPM.Frame.getFrame(moduleJson)
								}));
						MainFramePanel.doLayout();
					}

				}, true);
	},
	createSideBar : function(menuType, menus) {
		Ext.each(menus, function(p) {
					p.icon = '/themes/icon/' + p.icon;
					if (p.submenu) {
						p.bodyStyle="padding:5 0 0 5;overflow:auto;";
						p.items = new Ext.tree.TreePanel({
									autoScroll: true,
									animate : true,
									containerScroll : true,
									border : false,
									rootVisible : false,
									height:'300',
									root : {
										nodeType : 'async',
										draggable : false,
										expanded : true,
										children : this.getTree(p.submenu)
									}
								})
						p.items.on("click", this.treeClick, this)
					} else {
						// 主panel被点击是暂时不做处理
					};
					//panel展开时，默认选中第一个节点。
					p.listeners = {
						"expand" : function() {
							function findFirstNode(node) {
								if (node.leaf)
									return node;
								else if (node.firstChild)
									return findFirstNode(node.firstChild);
							};
							var node = this.items.length == 0 ? (this.initialConfig.object_id ? {
										leaf : true,
										attributes : {
											object_id : this.initialConfig.object_id
										}
									} : false) : findFirstNode(this.items.get(0).root.firstChild);
							if (node) {
								this.items.length > 0 && node.select();
								this.ownerCt.clickMenuAction(node);
							}
						}
					}
				}, this)
		var lPanel = {
			layout : 'accordion',
			border:false,
			split:true,
			defaults : {},
			getMenuNode : function(menuId) {
				var cnode;
				this.items.each(function(p) {
							if (p.items) {
								var node = p.items.get(0).getNodeById(menuId);
								if (node) {
									node.panelId = p.id;
									cnode = node;
									return false;
								}
							}
						}, this);
				return cnode;
				// if(cpanel && cpanel.collapsed) cpanel.expand;
			},
			selectMenu:function(menuId){
				var node=this.getMenuNode(menuId);
				if(node){
					var panel=Ext.getCmp(node.panelId);
					if(panel && panel.collapsed) panel.expand();
					node.ensureVisible();
					node.select();
				}
				return node;
			},
			clickMenuAction:this.treeClick.createDelegate(this),
			clickMenu:function(menuId){
				var node=this.selectMenu(menuId);
				if(node){
					this.clickMenuAction(node);
				}
			},
			layoutConfig : {
				titleCollapse : true,
				hideCollapseTool : true,
				animate : true,
				activeOnTop : true
			},
			items : menus,
			region : (menuType == 'left') ? "west" : "east",
			width : 180
		};
		var rPanel = this.getMainPanel();
		rPanel.region = 'center';
		this.createWindow(this.menuConfig, {
					layout : 'border',
					items : [lPanel, rPanel]
				})
	},
	init : function(launcher) {
		this.menuConfig = launcher;
		try {
			if (launcher.menuStyle == 'none') {
				this.createWindow(launcher, {
							items : this.getMainPanel()
						})
			} else {

				var conn = new Ext.data.Connection();
				var windowId = launcher.windowId;
				var id = windowId.split('_');

				conn.on('requestcomplete', function(con, oResponse) {
							var pageMenuJSON = Ext
									.decode(oResponse.responseText);
							if (pageMenuJSON.menu.length > 0) {
								var ms = this.menuConfig.menuStyle;
								this[(ms == 'left' || ms == 'right')
										? "createSideBar"
										: "createMenu"](ms, pageMenuJSON.menu);
							} else {
								this.createWindow(this.menuConfig, {
											items : this.getMainPanel()
										})
							}
						}, this);

				conn.request({
							method : 'GET',
							url : '/home/system/getmenu.jcp?id=' + id[1]
									+ "&ra=" + Math.random()
						});

			}

		} catch (ex) {
			Ext.msg('error', ex);
		};
	},

	getMainPanel : function() {
		var src = this.menuConfig;
		var panel;
		if (src.isIFrame == 'true') {
			panel = new Ext.ux.IFrameComponent({
						id : src.windowId,
						url : src.url
					});
		} else {
			panel = this.main(src);
		}

		!this.mainPanel && (this.mainPanel = panel);
		return panel;
	},
	menuClick : Ext.emptyFn,
	createWindow : function(src, windowConfig) {
		var win = src.desktop.getWindow(src.windowId);
		if (!win) {

			var viewWidth = src.desktop.getViewWidth();
			var viewHeight = src.desktop.getViewHeight();

			function fixSize(value, sign) {
				if (value == 0)
					return sign;
				return value < 1 ? sign * value : value;
			}

			function fixPosition(offset, max, limit) {
				if (offset == -1)
					return (max - limit) / 2;
				if (offset < 0)
					offset *= -1;
				if (offset < 1 && offset > 0)
					return max * offset;
				return offset;
			}

			src.winWidth = fixSize(+src.winWidth, viewWidth);
			src.winHeight = fixSize(+src.winHeight, viewHeight);
			Ext.isMultiScreen && (src.winWidth /= 2);

			var config = Ext.apply({
						id : src.windowId,
						title : src.text || src.tooltip,
						layout : 'fit',
						icon : src.icon || src.windowIcon,
						shim : true,
						animCollapse : false,
						constrainHeader : true,
						minimizable : src.winResizable === true,
						maximizable : src.winResizable === true,
						draggable : src.winDraggable === true,
						width : src.winWidth,
						height : src.winHeight,
						x : fixPosition(+src.x, viewWidth, src.winWidth),
						y : fixPosition(+src.y, viewHeight, src.winHeight)
					}, windowConfig);
/*			if(src.hideDesktop)
				Ext.apply(config , {
						minimizable : false,
						maximizable : false,
						draggable : false,//禁止拖动
						resizable : false,//禁止缩放
						closable: false});*/

			win = src.desktop.createWindow(config);

			this.frames.bindWin(win);
			win.once('afterlayout', function() {
						this.doWinLayout(win);
					}, this);
		}
		win.show();

	},
	getSubMenu : function(subMenuArray, windowId) {
		var subMenu = new Ext.menu.Menu();
		if (subMenuArray) {
			var subMenuLength = subMenuArray.length;
			for (var i = 0; i < subMenuLength; i++) {
				var subMenuItem = subMenuArray[i];
				var app_id = subMenuItem.id;
				var app_title = subMenuItem.title;
				var app_name = subMenuItem.path;
				var object_id = subMenuItem.object_id;
				var icon_url = subMenuItem.icon;
				var isIFrame = subMenuItem.isIFrame;
				var sub_menu = subMenuItem.submenu;
				var submenu = null;
				if (sub_menu)
					submenu = this.getSubMenu(sub_menu, windowId);
				var iconUrl = null;
				if (icon_url != '')
					iconUrl = '/themes/icon/' + icon_url;
				var subMenuItem = new Ext.menu.Item({
					id : app_id,
					text : app_title,
					// icon:iconUrl,
					cls : 'bmenu',
					parent_id : object_id,
					disabled : false,
					icon : iconUrl,
					hidden : false,
					windowsId : windowId,
					scope : this,
					isIFrame : isIFrame,
					menu : submenu,
					hideOnClick : (submenu == null),
					handler : function(btn) {
						if (btn.menu)
							return false;
						var MainFramePanel = this.mainPanel;
						CPM.get({
									method : 'GET',
									url : '/bin/exe/getFrame.jcp?parent_id='
											+ btn.parent_id,
									success : function(response, options) {
										var moduleJson = Ext
												.decode(response.responseText);
										Ext.i18n.apply(moduleJson);
										var cn = MainFramePanel.getComponent(0);
										if (typeof(cn != undefined)) {
											try {
												MainFramePanel.remove(cn);
											} catch (e) {
											}
										}
										MainFramePanel.add(new Ext.Panel({
													layout : 'border',
													border : false,
													items : CPM.Frame
															.getFrame(moduleJson)
												}));
										MainFramePanel.doLayout();
									}

								}, true);
					}
				});
				subMenu.addItem(subMenuItem);
			}
		}
		return subMenu;
	},
	main : function() {
		return {};
	},
	doWinLayout : function(win) {
		return {};
	}
}
Ext.ux.FrameParams = function() {
	this.params = {};
	this.win = null;
	this.bindWin = function(win) {
		this.win = win;
		win.on("destroy", function() {
					delete(this.params);
					delete(this.win);
				}, this);
	}
}
Ext.ux.FrameParams.prototype = {
	createPanel : function(name, obj) {
		if (typeof(name) == 'object') {
			obj = name;
			name = obj.id || obj.name;
		} else if (typeof(obj) != 'undefined') {
			if (typeof(obj) == 'function')
				obj = new obj();
		} else {
			throw '参数传递错误'.loc();
		}
		this.set(name, obj);
		obj.frames = this;
		return obj;
	},
	set : function(key, value) {
		this.params[key] = value;
	},
	get : function(key) {
		return this.params[key];
	},
	remove : function(key) {
		delete(this.params[key]);
	},
	containsKey : function(key) {
		return typeof(this.params[key]) != 'undefined';
	}
};