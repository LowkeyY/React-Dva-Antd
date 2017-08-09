/*
 * qWikiOffice Desktop 1.0 Copyright(c) 2007-2008, Integrated Technologies, Inc.
 * licensing@qwikioffice.com
 * 
 * http://www.qwikioffice.com/license
 * 
 * NOTE: This code is based on code from the original Ext JS desktop demo. I
 * have made many modifications/additions.
 * 
 * The Ext JS licensing can be viewed here:
 * 
 * Ext JS Library 3.0 Copyright(c) 2006-2007, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */
Ext.Desktop = Ext.extend(Ext.util.Observable, {
	/**
	 * Read only. {Ext.app.App}
	 */
	app : null,
	/**
	 * Read only. {Ext.menu.Menu}
	 */
	cmenu : new Ext.menu.Menu(),
	/**
	 * Read only. {Ext.ux.Shortcuts}
	 */
	shortcuts : null,
	/**
	 * Read only. {Ext.WindowGroup}
	 */
	windows : new Ext.WindowGroup(),
	/**
	 * Read only. {Ext.Window}
	 */
	activeWindow : null,

	/**
	 * @param {Ext.app.App}
	 *            app The instance of the application.
	 */
	constructor : function(app) {
		this.addEvents({
					winactivate : true,
					winbeforeclose : true,
					windeactivate : true
				});

		this.app = app;
		this.el = Ext.getBody().createChild({
					tag : 'div',
					cls : 'x-desktop'
				});
		this.taskbar = new Ext.ux.TaskBar(app);
		this.shortcuts = new Ext.ux.Shortcuts(this);

		// todo: fix bug where Ext.Msg are not displayed properly
		// this.windows.zseed = 7000; //10000;

		Ext.Desktop.superclass.constructor.call(this);

		this.initEvents();
		this.layout();
		this.windows.zseed = 5000;
	},

	initEvents : function() {

		Ext.EventManager.onWindowResize(this.layout, this);
		this.el.on('contextmenu', function(e) {
					if (e.target.id === this.el.id) {
						e.stopEvent();
						if (!this.cmenu.el) {
							this.cmenu.render();
						}
						var xy = e.getXY();
						xy[1] -= this.cmenu.el.getHeight();
						this.cmenu.showAt(xy);
					}
				}, this);
	},

	/**
	 * @param {object}
	 *            config The window config object.
	 * @param {string}
	 *            cls The class to use instead of Ext.Window.
	 */
	createWindow : function(config, cls) {
		var win = new (cls || Ext.Window)(Ext.applyIf(config || {}, {
					manager : this.windows,
/*					minimizable : true,
					maximizable : true,*/
					draggable : false,//禁止拖动
					resizable : false,//禁止缩放
					tools : null
				}));

		win.render(this.el);
		win.taskButton = this.taskbar.taskButtonPanel.add(win);
		win.cmenu = new Ext.menu.Menu({
					items : [

					]
				});
		win.animateTarget = win.taskButton.el;

		win.on({
					'activate' : {
						fn : function(win) {
							this.markActive(win);
							this.fireEvent('winactivate', this, win);
						},
						scope : this
					},
					'beforeclose' : {
						fn : function(win) {
							this.fireEvent('winbeforeclose', this, win);
						},
						scope : this
					},
					'beforeshow' : {
						fn : this.markActive,
						scope : this
					},
					'deactivate' : {
						fn : function(win) {
							this.markInactive(win);
							this.fireEvent('windeactivate', this, win);
						},
						scope : this
					},
					'minimize' : {
						fn : this.minimizeWin,
						scope : this
					},
					'close' : {
						fn : this.removeWin,
						scope : this
					}
				});

		this.layout();
		return win;
	},

	/**
	 * @param {Ext.Window}
	 *            win The window to minimize.
	 */
	minimizeWin : function(win) {
		win.minimized = true;
		win.hide();
	},

	/**
	 * @param {Ext.Window}
	 *            win The window to mark active.
	 */
	markActive : function(win) {
		if (this.activeWindow && this.activeWindow != win) {
			this.markInactive(this.activeWindow);
		}
		this.taskbar.setActiveButton(win.taskButton);
		this.activeWindow = win;
		Ext.fly(win.taskButton.el).addClass('active-win');
		win.minimized = false;
	},

	/**
	 * @param {Ext.Window}
	 *            win The window to mark inactive.
	 */
	markInactive : function(win) {
		if (win == this.activeWindow) {
			this.activeWindow = null;
			Ext.fly(win.taskButton.el).removeClass('active-win');
		}
	},

	/**
	 * @param {Ext.Window}
	 *            win The window to remove.
	 */
	removeWin : function(win) {
		this.taskbar.taskButtonPanel.remove(win.taskButton);
		this.layout();
	},

	layout : function() {
		this.el.setHeight(Ext.lib.Dom.getViewHeight()
				- this.taskbar.el.getHeight());
	},

	getManager : function() {
		return this.windows;
	},

	/**
	 * @param {string}
	 *            id The window id.
	 */
	getWindow : function(id) {
		return this.windows.get(id);
	},

	getViewHeight : function() {
		return (Ext.lib.Dom.getViewHeight() - this.taskbar.el.getHeight());
	},

	getViewWidth : function() {
		return Ext.lib.Dom.getViewWidth();
	},

	getWinWidth : function() {
		var width = this.getViewWidth();
		return width < 200 ? 200 : width;
	},

	getWinHeight : function() {
		var height = this.getViewHeight();
		return height < 100 ? 100 : height;
	},

	/**
	 * @param {integer}
	 *            width The width.
	 */
	getWinX : function(width) {
		return (Ext.lib.Dom.getViewWidth() - width) / 2
	},

	/**
	 * @param {integer}
	 *            height The height.
	 */
	getWinY : function(height) {
		return (Ext.lib.Dom.getViewHeight() - this.taskbar.el.getHeight() - height)
				/ 2;
	},

	/**
	 * @param {string}
	 *            hex The hexidecimal number for the color.
	 */
	setBackgroundColor : function(hex) {
		if (hex) {
			Ext.get(document.body).setStyle('background-color', '#' + hex);
			this.app.styles.backgroundcolor = hex;
		}
	},

	/**
	 * @param {string}
	 *            hex The hexidecimal number for the color.
	 */
	setFontColor : function(hex) {
		if (hex) {
			Ext.util.CSS
					.updateRule('.ux-shortcut-btn-text', 'color', '#' + hex);
			this.app.styles.fontcolor = hex;
		}
	},

	/**
	 * @param {object}
	 *            o The data for the theme. Example: { id: 1, name: 'Vista
	 *            Black', pathtofile: 'path/to/file' }
	 */
	setTheme : function(o) {
		if (o && o.id && o.name && o.pathtofile) {
			Ext.util.CSS.swapStyleSheet('theme', o.pathtofile);
			this.app.styles.theme = o;
		}
	},

	/**
	 * @param {integer}
	 *            v The value. An integer from 0 to 100.
	 */
	setTransparency : function(v) {
		if (v == true || typeof(v) == 'number') {
			v = 75;
			if (v >= 0 && v <= 80) {
				this.taskbar.el.addClass("transparent");
				Ext.util.CSS.updateRule('.transparent', 'opacity', v / 100);
				Ext.util.CSS
						.updateRule('.transparent', '-moz-opacity', v / 100);
				Ext.util.CSS.updateRule('.transparent', 'filter',
						'alpha(opacity=' + v + ')');
			} else if (v > 80) {
				v = 80;
				this.taskbar.el.addClass("transparent");
				Ext.util.CSS.updateRule('.transparent', 'opacity', v / 100);
				Ext.util.CSS
						.updateRule('.transparent', '-moz-opacity', v / 100);
				Ext.util.CSS.updateRule('.transparent', 'filter',
						'alpha(opacity=' + v + ')');

			}
		}
		this.app.styles.transparency = v;
	},

	/**
	 * @param {object}
	 *            o The data for the wallpaper. Example: { id: 1, name: 'Blank',
	 *            pathtofile: 'path/to/file' }
	 */
	setWallpaper : function(o) {
		if (o && o.id && o.name && o.pathtofile) {
			var notifyWin = this.showNotification({
						html : "<pre>" + '加载背景'.loc() + "...</pre>",
						title : '请等待'.loc()
					});
			var wp = new Image();
			wp.src = o.pathtofile;
			var task = new Ext.util.DelayedTask(verify, this);
			task.delay(10);
			this.app.styles.wallpaper = o;
		}

		function verify() {
			if (wp.complete) {
				task.cancel();
				this.hideNotification(notifyWin);
				document.body.background = wp.src;
			} else {
				task.delay(10);
			}
		}
	},

	/**
	 * @param {string}
	 *            pos Options are 'tile' or 'center'.
	 */
	setWallpaperPosition : function(pos) {
		if (pos) {
			if (pos === "center") {
				var b = Ext.get(document.body);
				b.removeClass('wallpaper-tile');
				b.addClass('wallpaper-center');
			} else if (pos === "tile") {
				var b = Ext.get(document.body);
				b.removeClass('wallpaper-center');
				b.addClass('wallpaper-tile');
			}
			this.app.styles.wallpaperposition = pos;
		}
	},

	/**
	 * @param {object}
	 *            config The config object.
	 */
	showNotification : function(config) {
		var win = new Ext.ux.Notification(Ext.apply({
					animateTarget : this.taskbar.el,
					autoDestroy : true,
					hideDelay : 5000,
					html : '',
					iconCls : 'x-icon-waiting',
					title : ''
				}, config));
		win.show();

		return win;
	},

	/**
	 * @param {Ext.ux.Notification}
	 *            win The notification window.
	 * @param {integer}
	 *            delay The delay time in milliseconds.
	 */
	hideNotification : function(win, delay) {
		if (win) {
(function	() {
				win.animHide();
				win.manager.unregister(win); // +X+ ADDED (Fix suggested @
				// http://qwikioffice.com/forum/viewtopic.php?f=2&t=416&p=2342&hilit=ext3#p2342)
			}).defer(delay || 3000);
		}
	},

	/**
	 * @param {string}
	 *            id The id of the module to add.
	 */
	addAutoRun : function(id) {
		var m = this.app.getModule(id);
		var c = this.config.autorun;

		if (c && m && !m.autorun) {
			m.autorun = true;
			c.push(id);
		}
	},

	/**
	 * @param {string}
	 *            id The id of the module to remove.
	 */
	removeAutoRun : function(id) {
		var m = this.app.getModule(id);
		var c = this.config.autorun;

		if (c && m && m.autorun) {
			var i = 0;

			while (i < c.length) {
				if (c[i] == id) {
					c.splice(i, 1);
				} else {
					i++;
				}
			}

			m.autorun = null;
		}
	},

	/**
	 * @param {string}
	 *            id The id of the module to add.
	 */
	addContextMenuItem : function(id) {
		var m = this.app.getModule(id);
		if (m && !m.contextMenuItem) {
			/*
			 * if(m.moduleType === 'menu'){ // handle menu modules var items =
			 * m.items; for(var i = 0, len = items.length; i < len; i++){
			 * m.launcher.menu.items.push(app.getModule(items[i]).launcher); } }
			 */
			this.cmenu.add(m.launcher);
		}
	},
	
	/**
	 * @param {string}
	 *            id The module id
	 * @param {boolean}
	 *            updateConfig
	 */
	addShortcut : function(id, updateConfig) {
		var m = this.app.getModule(id);

		if (m && !m.shortcut) {
			var c = m.launcher;

			if (!c.shortcutIconCls) {
				var tempIconCls = '';
				c.deskIcon = c.desktopIcon || c.deskIcon;
				if (c.deskIcon) {
					tempIconCls = ".icon_"
							+ id
							+ " img {width:48px;height:48px;background-image: url(/themes/icon"
							+ c.deskIcon
							+ ");filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/themes/icon"
							+ c.deskIcon + "', sizingMethod='scale');}";
				} else {
					tempIconCls = ".icon_"
							+ id
							+ " img {width:48px;height:48px;background-image: url(/themes/icon/xp48d/cubes.gif);filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/themes/icon/xp48d/cubes.gif', sizingMethod='scale');}";
				}
				Ext.util.CSS.createStyleSheet(tempIconCls, 'tempCls');
				c.shortcutIconCls = "icon_" + id;
			}
			var winHeight = this.getWinHeight();
			var winWidth = this.getWinWidth();

			if (c.winWidth)
				winWidth = parseInt(c.winWidth);

			if (c.winHeight)
				winHeight = parseInt(c.winHeight);
			
			m.shortcut = this.shortcuts.addShortcut(Ext.apply({
						windowId : c.windowId,
						handler : c.handler,
						windowIcon : c.icon,
						iconCls : c.shortcutIconCls,
						scope : c.scope,
						url : c.url,
						menuStyle : c.menuStyle,
						isIFrame : c.isIFrame,
						winWidth : winWidth,
						winHeight : winHeight,
						x : c.x,
						y : c.y,
						text : c.text,
						tooltip : c.tooltip || ''
					} , this.setPotals(c , "openType,faceAppUrl,faceAppIsUpdate,faceAppUpdateTimer,winDraggable,winResizable")));
			if (updateConfig) {
				this.config.shortcuts.push(id);
			}
		}
	},

	/**
	 * @param {string}
	 *            id The module id
	 * @param {boolean}
	 *            updateConfig
	 */
	removeShortcut : function(id, updateConfig) {
		var m = this.app.getModule(id);

		if (m && m.shortcut) {
			this.shortcuts.removeShortcut(m.shortcut);
			m.shortcut = null;

			if (updateConfig) {
				var sc = this.config.shortcuts;
				var i = 0;
				while (i < sc.length) {
					if (sc[i] == id) {
						sc.splice(i, 1);
					} else {
						i++;
					}
				}
			}
		}
	},

	/**
	 * @param {string}
	 *            id The module id
	 * @param {boolean}
	 *            updateConfig
	 */
	addQuickStartButton : function(id, updateConfig) {
		var m = this.app.getModule(id);

		if (m && !m.quickStartButton) {
			var c = m.launcher;
			c.icon = c.fastlinkIcon || c.icon;
			if (!c.iconCls) {
				var tempIconCls = '';
				if (c.icon) {
					tempIconCls = ".iconQuickStart_" + id
							+ " {background-image: url('" + c.icon
							+ "') !important;}";
				} else {
					tempIconCls = ".iconQuickStart_"
							+ id
							+ " {background-image: url(/themes/icon/all/application.gif) !important;}";
				}
				Ext.util.CSS.createStyleSheet(tempIconCls, 'tempCls');
				c.iconCls = "iconQuickStart_" + id;
			}
			var winHeight = this.getWinHeight();
			var winWidth = this.getWinWidth();

			if (c.winWidth)
				winWidth = parseInt(c.winWidth);

			if (c.winHeight)
				winHeight = parseInt(c.winHeight);

			m.quickStartButton = this.taskbar.quickStartPanel.add(Ext.apply({
						windowId : c.windowId,
						url : c.url,
						winWidth : winWidth,
						winHeight : winHeight,
						handler : c.handler,
						menuStyle : c.menuStyle,
						icon : c.icon,
						iconCls : c.iconCls,
						scope : c.scope,
						isIFrame : c.isIFrame,
						text : c.text,
						tooltip : c.tooltip || c.text
					} , this.setPotals(c , "openType")));
			if (updateConfig) {
				this.config.quickstart.push(id);
			}
		}
	},
	setPotals : function(conf , param){
		var o = {};
		if(conf && param)
			Ext.copyTo(o , conf , param);
		return o;
	},
	/**
	 * @param {string}
	 *            id The module id
	 * @param {boolean}
	 *            updateConfig
	 */
	removeQuickStartButton : function(id, upda0teConfig) {
		var m = this.app.getModule(id);

		if (m && m.quickStartButton) {
			this.taskbar.quickStartPanel.remove(m.quickStartButton);
			m.quickStartButton = null;

			if (updateConfig) {
				var qs = this.config.quickstart;
				var i = 0;
				while (i < qs.length) {
					if (qs[i] == id) {
						qs.splice(i, 1);
					} else {
						i++;
					}
				}
			}
		}
	}
});

Ext.ux.NotificationMgr = {
	positions : []
};

Ext.ux.Notification = Ext.extend(Ext.Window, {
			initComponent : function() {
				Ext.apply(this, {
							iconCls : this.iconCls || 'x-icon-information',
							width : 200,
							autoHeight : true,
							closable : true,
							plain : false,
							draggable : false,
							bodyStyle : 'text-align:left;padding:10px;',
							resizable : false
						});
				if (this.autoDestroy) {
					this.task = new Ext.util.DelayedTask(this.close, this);
				} else {
					this.closable = true;
				}
				Ext.ux.Notification.superclass.initComponent.call(this);
			}

			,
			setMessage : function(msg) {
				this.body.update(msg);
			}

			,
			setTitle : function(title, iconCls) {
				Ext.ux.Notification.superclass.setTitle.call(this, title,
						iconCls || this.iconCls);
			}

			,
			onRender : function(ct, position) {
				Ext.ux.Notification.superclass.onRender
						.call(this, ct, position);
			}

			,
			onDestroy : function() {
				Ext.ux.NotificationMgr.positions.remove(this.pos);
				Ext.ux.Notification.superclass.onDestroy.call(this);
			}

			,
			afterShow : function() {
				Ext.ux.Notification.superclass.afterShow.call(this);
				this.on('move', function() {
							Ext.ux.NotificationMgr.positions.remove(this.pos);
							if (this.autoDestroy) {
								this.task.cancel();
							}
						}, this);
				if (this.autoDestroy) {
					this.task.delay(this.hideDelay || 5000);
				}
			}

			,
			animShow : function() {
				this.pos = 0;
				while (Ext.ux.NotificationMgr.positions.indexOf(this.pos) > -1) {
					this.pos++;
				}
				Ext.ux.NotificationMgr.positions.push(this.pos);
				this.setSize(200, 100);
				this.el
						.alignTo(
								this.animateTarget || document,
								"br-tr",
								[
										-1,
										-1
												- ((this.getSize().height + 10) * this.pos)]);
				this.el.slideIn('b', {
							duration : .7,
							callback : this.afterShow,
							scope : this
						});
			}

			,
			animHide : function() {
				Ext.ux.NotificationMgr.positions.remove(this.pos);
				this.el.ghost("b", {
							duration : 1,
							remove : true
						});
			}
		});