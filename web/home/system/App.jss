

Ext.app.App = function(config) {
	Ext.apply(this, config);
	this.addEvents({
				'ready' : true,
				'beforeunload' : true,
				'moduleactioncomplete' : true
			});
	Ext.onReady(this.initApp, this);
};

Ext.extend(Ext.app.App, Ext.util.Observable, {
	/**
	 * Read-only. This app's ready state
	 * 
	 * @type boolean
	 */
	isReady : false,
	/**
	 * Read-only. This app's launchers
	 * 
	 * @type object
	 */
	launchers : null,
	/**
	 * Read-only. This app's modules
	 * 
	 * @type array
	 */
	modules : null,
	/**
	 * Read-only. This app's styles
	 * 
	 * @type object
	 */
	styles : null,
	/**
	 * Read-only. This app's Start Menu config
	 * 
	 * @type object
	 */
	startConfig : null,
	/**
	 * Read-only. This app's Start Menu's items and toolItems configs.
	 * 
	 * @type object
	 */
	startItemsConfig : null,
	/**
	 * Read-only. This app's logout button config
	 * 
	 * @type object
	 */
	logoutButtonConfig : null,
	/**
	 * Read-only. The url of this app's server connection
	 * 
	 * Allows a module to connect to its server script without knowing the path.
	 * Example ajax call:
	 * 
	 * Ext.Ajax.request({ url: this.app.connection, // Could also pass the
	 * module id in the querystring like this. // url:
	 * this.app.connection+'?id='+this.id, params: { id: this.id ... }, success:
	 * function(){ ... }, failure: function(){ ... }, scope: this });
	 */
	connection : 'system/setup.jcp',
	/**
	 * Read-only. The queue of requests to run once a module is loaded
	 */
	requestQueue : [],

	init : Ext.emptyFn,
	startMenuSortFn : Ext.emptyFn,
	getModules : Ext.emptyFn,
	getLaunchers : Ext.emptyFn,
	getStyles : Ext.emtpyFn,
	getStartConfig : Ext.emptyFn,
	getLogoutConfig : Ext.emptyFn,

	initApp : function() {
		this.init();
		this.preventBackspace();
		this.modules = this.modules || this.getModules();
		if (this.modules) {
			this.initDesktopConfig();
		}
		this.startConfig = this.startConfig || this.getStartConfig();
		this.startItemsConfig = this.startItemsConfig
				|| this.getStartItemsConfig();
		Ext.apply(this.startConfig, this.startItemsConfig);

		this.desktop = new Ext.Desktop(this);
		this.desktop.taskbar.startMenu.addTool({
					text : '锁定屏幕'.loc(),
					icon : '/themes/icon/xp/lock_folder.gif',
					handler : function() {
						Ext.Ajax.request({
									url : '/login/logout.jcp',
									method : 'GET'
								});
						top.TimeOut.showWindow();
					},
					scope : this
				});
		this.logoutConfig = this.logoutConfig || this.getLogoutConfig();
		this.initLogout();

		Ext.EventManager.on(window, 'beforeunload', this.onBeforeUnload, this);
		this.fireEvent('ready', this);
		this.isReady = true;
	},
	initDesktopConfig : function(o) {
		if (!o) {
			this.getDesktopConfig();
		} else {
			this.startManu = this.desktop.taskbar.startMenu;
			if (this.modules) {
				this.initModules(this.modules);
			}

			this.desktop.config = o;
			this.desktop.initialConfig = o;
			o.styles = o.styles || [];
			this.initStyles(o.styles);

			o.contextmenu = o.contextmenu || [];
			o.quickstart = o.quickstart || [];
			o.shortcut = o.shortcut || [];
			o.autorun = o.autorun || [];

			this.initContextMenu(o.contextmenu);
			this.initQuickStart(o.quickstart);
			this.initShortcut(o.shortcuts);
			this.initAutoRun(o.autorun);
		}
	},
	initLogout : function() {
		if (this.logoutConfig) {
			this.desktop.taskbar.startMenu.addTool(this.logoutConfig);
		}
	},
	initStyles : function(s) {
		this.styles = s;
		var d = this.desktop;
		d.setBackgroundColor(s.backgroundcolor);
		d.setFontColor(s.fontcolor);
		d.setTheme(s.theme);
		d.setTransparency(s.transparency);
		d.setWallpaper(s.wallpaper);
		d.setWallpaperPosition(s.wallpaperposition);
		return true;
	},
	initModules : function(ms) {
		for (var i = 0, len = ms.length; i < len; i++) {
			if (ms[i].moduleType == 'Application' && (!Ext.isDefined(ms[i].launcher.startmenuShow) || ms[i].launcher.startmenuShow === true))
				this.startManu.add(ms[i].launcher);
			ms[i].app = this;
		}
	},

	/**
	 * @param {array}
	 *            mIds An array of the module ids to run when this app is ready
	 */
	initAutoRun : function(mIds) {

		if (mIds) {
			for (var i = 0, len = mIds.length; i < len; i++) {
				var m = this.getModule(mIds[i]);
				if (m) {
					m.autorun = true;
					// if(m.createWindow){
					// m.createWindow(m.launcher);
					// }else{
					m.launcher.desktop = this.desktop;
					if(m.launcher.openType === 'false'){
						window.open(m.launcher.url);
					} else if (m.launcher.isIFrame == 'true') {
						var bsNode = new WorkBench.baseNode();
						bsNode.init(m.launcher);
					} else {
						var lib = m.launcher.url;
						if (Ext.isDefined(lib) && lib != '') {
							var paramArray = m.launcher.url.split('?');
							var param = (paramArray.length > 1) ? Ext
									.urlDecode(paramArray[1]) : {};
							param.objectId = param.parent_id;
							Ext.apply(m.launcher, param);
							using(paramArray[0]);
							var processModule = null;
							processModule = eval('new ' + paramArray[0] + '()');
							setTimeout(function() {
										processModule.init(m.launcher, param);
									}, 1000);

						}
					}
				}
				// }
			}
		}
	},

	initContextMenu : function(mIds) {
		if (mIds) {
			for (var i = 0, len = mIds.length; i < len; i++) {
				this.desktop.addContextMenuItem(mIds[i]);
			}
		}
	},

	/**
	 * @param {array}
	 *            mIds An array of the module ids to add to the Desktop
	 *            Shortcuts
	 */
	initShortcut : function(mIds) {
		if (mIds) {
			for (var i = 0, len = mIds.length; i < len; i++) {
				this.desktop.addShortcut(mIds[i], false);
			}
		}
	},

	/**
	 * @param {array}
	 *            mIds An array of the modulId's to add to the Quick Start panel
	 */
	initQuickStart : function(mIds) {
		if (mIds) {
			for (var i = 0, len = mIds.length; i < len; i++) {
				this.desktop.addQuickStartButton(mIds[i], false);
			}
		}
	},

	/**
	 * Returns the Start Menu items and toolItems configs
	 */
	getStartItemsConfig : function() {
	},

	/**
	 * @param {string}
	 *            id
	 * 
	 * Provides the handler to the module launcher. Requests the module, which
	 * will load the module if needed. Passes in the callback and scope as
	 * params.
	 */
	createWindow : function(id) {
		var m = this.requestModule(id, function(m) {
					if (m) {
						m.createWindow();
					}
				}, this);
	},

	/**
	 * @param {string}
	 *            v The id or moduleType you want returned
	 * @param {Function}
	 *            cb The Function to call when the module is ready/loaded
	 * @param {object}
	 *            scope The scope in which to execute the function
	 */
	requestModule : function(v, cb, scope) {
		var m = this.getModule(v);
		if (m) {
			if (m.loaded === true) {
				cb.call(scope, m);
			} else {
				if (cb && scope) {
					this.requestQueue.push({
								id : m.id,
								callback : cb,
								scope : scope
							});
					this.loadModule(m);
				}
			}
		}
	},

	/**
	 * @param {Ext.app.Module}
	 *            m The module
	 */
	loadModule : function(m) {
		if (m.isLoading) {
			return false;
		}

		var id = m.id;
		var moduleName = m.launcher.text;
		var notifyWin = this.desktop.showNotification({
					html : '载入中'.loc() + moduleName + "...",
					title : '请等待'.loc()
				});

		m.isLoading = true;

		Ext.Ajax.request({
					url : this.connection,
					params : {
						service : 'load',
						moduleId : id
					},
					success : function(o) {
						notifyWin.setIconClass('x-icon-done');
						notifyWin.setTitle('完成'.loc());
						notifyWin.setMessage(moduleName + '载入完成.'.loc());
						this.desktop.hideNotification(notifyWin);
						notifyWin = null;

						if (o.responseText !== '') {
							eval(o.responseText);
							this.loadModuleComplete(true, id);
						} else {
							alert('An error occured on the server.');
						}
					},
					failure : function() {
						alert('Connection to the server failed!');
					},
					scope : this
				});

		return true;
	},

	/**
	 * @param {boolean}
	 *            success
	 * @param {string}
	 *            id
	 * 
	 * Will be called when a module is loaded. If a request for this module is
	 * waiting in the queue, it as executed and removed from the queue.
	 */
	loadModuleComplete : function(success, id) {
		if (success === true && id) {
			var m = this.createModule(id);

			if (m) {
				m.isLoading = false;
				m.loaded = true;
				m.init();
				m.on('actioncomplete', this.onModuleActionComplete, this);

				var q = this.requestQueue;
				var nq = [];
				var found = false;

				for (var i = 0, len = q.length; i < len; i++) {
					if (found === false && q[i].id === id) {
						found = q[i];
					} else {
						nq.push(q[i]);
					}
				}

				this.requestQueue = nq;

				if (found) {
					found.callback.call(found.scope, m);
				}
			}
		}
	},

	/**
	 * Private
	 * 
	 * @param {string}
	 *            id
	 */
	createModule : function(id) {
		var p = this.getModule(id); // get the placeholder
		if (p && p.loaded === false) {
			if (eval('typeof ' + p.className) === 'function') {
				var m = eval('new ' + p.className + '()');
				m.app = this;
				var ms = this.modules;
				for (var i = 0, len = ms.length; i < len; i++) { // replace
					// the
					// placeholder
					// with the
					// module
					if (ms[i].id === m.id) {
						Ext.apply(m, ms[i]); // transfer launcher properties
						ms[i] = m;
					}
				}
				return m;
			}
		}
		return null;
	},

	/**
	 * @param {string}
	 *            v The id or moduleType you want returned
	 */
	getModule : function(v) {
		var ms = this.modules;
		for (var i = 0, len = ms.length; i < len; i++) {
			if (ms[i].moduleId == v || ms[i].moduleType == v) {
				return ms[i];
			}
		}
		return null;
	},

	/**
	 * @param {Ext.app.Module}
	 *            m The module to register
	 */
	registerModule : function(m) {
		if (!m) {
			return false;
		}
		this.modules.push(m);
		m.launcher.handler = this.createWindow.createDelegate(this, [m.id]);
		m.app = this;
		return true;
	},

	/**
	 * @param {string}
	 *            id or moduleType
	 * @param {array}
	 *            requests An array of request objects
	 * 
	 * Example: this.app.makeRequest('module-id', { requests: [ { method:
	 * 'createWindow', params: '', callback: this.myCallbackFunction, scope:
	 * this }, { ... } ] });
	 */
	makeRequest : function(id, requests) {
		if (id !== '' && requests) {
			var m = this.requestModule(id, function(m) {
						if (m) {
							m.handleRequest(requests);
						}
					}, this);
		}
	},

	getDesktop : function() {
		return this.desktop;
	},

	/**
	 * @param {Function}
	 *            fn The function to call after the app is ready
	 * @param {object}
	 *            scope The scope in which to execute the function
	 */
	onReady : function(fn, scope) {
		if (!this.isReady) {
			this.on('ready', fn, scope);
		} else {
			fn.call(scope, this);
		}
	},

	onBeforeUnload : function(e) {
		if (this.fireEvent('beforeunload', this) === false) {
			e.stopEvent();
		}
	},

	/**
	 * Prevent the backspace (history -1) shortcut
	 */
	preventBackspace : function() {
		var map = new Ext.KeyMap(document, [{
							key : Ext.EventObject.BACKSPACE,
							stopEvent : false,
							fn : function(key, e) {
								var t = e.target.tagName;
								if (t != "INPUT" && t != "TEXTAREA") {
									e.stopEvent();
								}
							}
						}]);
	},
	onModuleActionComplete : function(module, data, options) {
		this.fireEvent('moduleactioncomplete', this, module, data, options);
	}
});

/*******************************************************************************
 * Purpose of below (override) is to (only) provide greater control over styling
 * of form elements/fields
 */
Ext.layout.ContainerLayout.prototype.fieldTpl = (function() {
	var t = new Ext.Template(
			'<div class="x-form-item {itemCls}" style="{itemStyle}" tabIndex="-1">',
			'<label for="{id}" style="{labelStyle}" class="x-form-item-label {labelCls}">{label}{labelSeparator}</label>',
			'<div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">',
			'</div><div class="{clearCls}"></div>', '</div>');
	t.disableFormats = true;
	return t.compile();
})();
Ext.layout.FormLayout.prototype.getTemplateArgs = function(field) {
	var noLabelSep = !field.fieldLabel || field.hideLabel;
	return {
		id : field.id,
		label : field.fieldLabel,
		labelCls : field.labelCls || this.labelCls || '',
		labelStyle : field.labelStyle || this.labelStyle || '',
		elementStyle : field.elementStyle || this.elementStyle || '',
		labelSeparator : noLabelSep
				? ''
				: (typeof field.labelSeparator == 'undefined'
						? this.labelSeparator
						: field.labelSeparator),
		itemStyle : (field.itemStyle || this.container.itemStyle || ''),
		itemCls : (field.itemCls || this.container.itemCls || '')
				+ (field.hideLabel ? ' x-hide-label' : ''),
		clearCls : field.clearCls || 'x-form-clear-left'
	};
}

/*******************************************************************************
 * Bug fix for Ext.Resizable Fixes problem where el 'auto' size styles replaced.
 */
Ext.Resizable.prototype.resizeElement = function() {
	var box = this.proxy.getBox();

	// START FIX-PATCH
	if (!this.east && !this.west) {
		box.width = this.el.getStyle('width');
	}
	if (!this.north && !this.south) {
		box.height = this.el.getStyle('height');
	}
	// END FIX-PATCH

	if (this.updateBox) {
		this.el.setBox(box, false, this.animate, this.duration, null,
				this.easing);
	} else {
		this.el.setSize(box.width, box.height, this.animate, this.duration,
				null, this.easing);
	}
	this.updateChildSize();
	if (!this.dynamic) {
		this.proxy.hide();
	}
	return box;
};
