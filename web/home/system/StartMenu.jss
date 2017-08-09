/*
 * qWikiOffice Desktop 1.0 Copyright(c) 2007-2008, Integrated Technologies, Inc.
 * licensing@qwikioffice.com
 * 
 * http://www.qwikioffice.com/license
 */

/**
 * @class Ext.ux.StartMenu
 * @extends Ext.menu.Menu A start menu object.
 * @constructor Creates a new StartMenu
 * @param {Object}
 *            config Configuration options
 * 
 * SAMPLE USAGE:
 * 
 * this.startMenu = new Ext.ux.StartMenu({ iconCls: 'user', height: 300, shadow:
 * true, title: get_cookie('memberName'), toolPanelWidth: 110, width: 300 });
 * 
 * this.startMenu.add({ text: 'Grid Window', iconCls:'icon-grid', handler :
 * this.createWindow, scope: this });
 * 
 * this.startMenu.addTool({ text:'Logout', iconCls:'logout', handler:function(){
 * window.location = "logout.php"; }, scope:this });
 */
Ext.ux.StartMenu = Ext.extend(Ext.menu.Menu, { // +X+ REPLACE START
	height : 300,
	toolPanelWidth : 100,
	width : 'auto',

	initComponent : function(config) {
		delete this.width;
		Ext.ux.StartMenu.superclass.initComponent.call(this, config);

		var tools = this.toolItems;
		this.toolItems = new Ext.util.MixedCollection();
		if (tools) {
			this.addTool.apply(this, tools);
		}
	},

	// private
	onRender : function(ct, position) {
		Ext.ux.StartMenu.superclass.onRender.call(this, ct, position);
		var el = this.el.addClass('ux-start-menu'); // +X+ REPLACE END
		/*
		 * //+X+ REMOVED START if(this.el){ return; } var el = this.el = new
		 * Ext.Layer({ cls: 'x-menu ux-start-menu', shadow:this.shadow,
		 * constrain: false, parentEl: this.parentEl || document.body,
		 * zindex:15000 }); //
		 */
		// +X+ REMOVED END
		var header = el.createChild({
					tag : 'div' /*
								 * , cls: 'x-window-header x-unselectable
								 * x-panel-icon '//+this.iconCls
								 */
				});
		header.setStyle('padding', '7px 0 0 0');

		this.header = header;
		/*
		 * Don't create header text span tag. Can be uncommented. var headerText =
		 * header.createChild({ tag: 'span', cls: 'x-window-header-text' });
		 */
		var tl = header.wrap({
					cls : 'ux-start-menu-tl'
				});
		var tr = header.wrap({
					cls : 'ux-start-menu-tr'
				});
		var tc = header.wrap({
					cls : 'ux-start-menu-tc'
				});

		this.menuBWrap = el.createChild({
					tag : 'div',
					cls : 'ux-start-menu-body x-border-layout-ct ux-start-menu-body'
				});
		var ml = this.menuBWrap.wrap({
					cls : 'ux-start-menu-ml'
				});
		var mc = this.menuBWrap.wrap({
					cls : 'ux-start-menu-mc ux-start-menu-bwrap'
				});

		this.menuPanel = this.menuBWrap.createChild({
					tag : 'div',
					cls : 'x-panel x-border-panel ux-start-menu-apps-panel opaque'
				});
		this.toolsPanel = this.menuBWrap.createChild({
					tag : 'div',
					cls : 'x-panel x-border-panel ux-start-menu-tools-panel'
				});

		var bwrap = ml.wrap({
					cls : 'x-window-bwrap'
				});
		var bc = bwrap.createChild({
					tag : 'div',
					cls : 'ux-start-menu-bc'
				});
		var bl = bc.wrap({
					cls : 'ux-start-menu-bl x-panel-nofooter'
				});
		var br = bc.wrap({
					cls : 'ux-start-menu-br'
				});

		bc.setStyle({
					height : '0px',
					padding : '0 0 6px 0'
				});

		this.keyNav = new Ext.menu.MenuNav(this);

		if (this.plain) {
			el.addClass('x-menu-plain');
		}
		if (this.cls) {
			el.addClass(this.cls);
		}

		// generic focus element
		this.focusEl = el.createChild({
					tag : 'a',
					cls : 'x-menu-focus',
					href : '#',
					onclick : 'return false;',
					tabIndex : '-1'
				});

		// var ul = this.menuPanel.createChild({ tag: 'ul', cls: 'x-menu-list'
		// }); //+X+ REMOVED
		this.ul.appendTo(this.menuPanel); // +X+ ADDED
		// var ul = this.ul; //+X+ REPLACE (ABOVE LINE) END
		var toolsUl = this.toolsPanel.createChild({
					tag : 'ul',
					cls : 'x-menu-list'
				});
		/*
		 * //+X+ REMOVED START var ulListeners = { 'click': { fn: this.onClick,
		 * scope: this }, 'mouseover': { fn: this.onMouseOver, scope: this },
		 * 'mouseout': { fn: this.onMouseOut, scope: this } };
		 * ul.on(ulListeners); this.items.each(function(item){ var li =
		 * document.createElement('li'); li.className = 'x-menu-list-item';
		 * ul.dom.appendChild(li); item.render(li, this); }, this);
		 * 
		 * this.ul = ul; this.autoWidth();
		 * 
		 * toolsUl.on(ulListeners); //
		 */// +X+ REMOVED END
		// +X+ ADD START
		this.mon(toolsUl, 'click', this.onClick, this);
		this.mon(toolsUl, 'mouseover', this.onMouseOver, this);
		this.mon(toolsUl, 'mouseout', this.onMouseOut, this);

		this.items.each(function(item) {
					item.parentMenu = this;
				}, this);
		// +X+ ADD END

		this.toolItems.each(function(item) {
					var li = document.createElement('li');
					li.className = 'x-menu-list-item';
					toolsUl.dom.appendChild(li);
					item.render(li); // item.render(li, this); //+X+ REMOVED
					item.parentMenu = this; // +X+ ADDED
				}, this);

		this.toolsUl = toolsUl;
		// this.autoWidth(); //+X+ REMOVED

		this.menuBWrap.setStyle('position', 'relative');
		this.menuBWrap.setHeight(this.height - 12);
		this.menuPanel.setStyle({
					padding : '2px',
					position : 'absolute',
					overflow : 'auto'
				});
		this.toolsPanel.setStyle({
					padding : '2px 4px 2px 2px',
					position : 'absolute',
					overflow : 'auto'
				});
		this.setTitle(this.title);
	},

	// private
	findTargetItem : function(e) {
		var t = e.getTarget('.x-menu-list-item', this.ul, true);
		if (t && t.menuItemId) {
			if (this.items.get(t.menuItemId)) {
				return this.items.get(t.menuItemId);
			} else {
				return this.toolItems.get(t.menuItemId);
			}
		}
		return null;
	},

	/**
	 * Displays this menu relative to another element
	 * 
	 * @param {Mixed}
	 *            el The element to align to
	 * @param {String}
	 *            pos (optional) The {@link Ext.Element#alignTo} anchor position
	 *            to use in aligning to the element (defaults to
	 *            this.defaultAlign)
	 * @param {Ext.ux.StartMenu}
	 *            parentMenu (optional) This menu's parent menu, if applicable
	 *            (defaults to undefined)
	 */
	show : function(el, pos, parentMenu) {
		this.parentMenu = parentMenu;
		if (!this.el) {
			this.render();
		}

		this.fireEvent('beforeshow', this);
		this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign),
				parentMenu, false);

		var tPanelWidth = this.toolPanelWidth;
		var menuWidth = this.menuPanel.getWidth() + 2;
		if (Ext.isIE && menuWidth > 768) {// IE9某些版本有个很奇怪的bug.width为auto时不管内容渲染整行,此处临时补救--tz。
			menuWidth = 200;
			if (this.items.length > 0) {
				menuWidth -= 100;
				var m = Ext.util.TextMetrics
						.createInstance(this.items.get(0).el)
				this.items.each(function(itm) {
							var w = m.getWidth(itm.text);
							if (w > menuWidth)
								menuWidth = w;
						});
				menuWidth += 100;
				this.width = menuWidth + tPanelWidth + 6
				this.setWidth(this.width);

			}
		}
		this.menuPanel.setWidth(menuWidth);
		this.menuBWrap.setWidth(menuWidth + tPanelWidth);
		var box = this.menuBWrap.getBox();
		this.menuPanel.setHeight(box.height);

		this.toolsPanel.setWidth(tPanelWidth);
		this.toolsPanel.setX(box.x + box.width - tPanelWidth);
		this.toolsPanel.setHeight(box.height);
	},

	addTool : function() {
		var a = arguments, l = a.length, item;
		for (var i = 0; i < l; i++) {
			var el = a[i];
			if (el.render) { // some kind of Item
				item = this.addToolItem(el);
			} else if (typeof el == 'string') { // string
				if (el == 'separator' || el == '-') {
					item = this.addToolSeparator();
				} else {
					item = this.addText(el);
				}
			} else if (el.tagName || el.el) { // element
				item = this.addElement(el);
			} else if (typeof el == 'object') { // must be menu item config?
				item = this.addToolMenuItem(el);
			}
		}
		return item;
	},

	/**
	 * Adds a separator bar to the Tools
	 * 
	 * @return {Ext.menu.Item} The menu item that was added
	 */
	addToolSeparator : function() {
		return this.addToolItem(new Ext.menu.Separator({
					itemCls : 'ux-toolmenu-sep'
				}));
	},

	addToolItem : function(item) {
		this.toolItems.add(item);
		if (this.toolsUl) {
			var li = document.createElement('li');
			li.className = 'x-menu-list-item';
			this.toolsUl.dom.appendChild(li);
			item.render(li, this);
			this.delayAutoWidth();
		}
		return item;
	},

	addToolMenuItem : function(config) {
		if (!(config instanceof Ext.menu.Item)) {
			if (typeof config.checked == 'boolean') { // must be check menu
				// item config?
				config = new Ext.menu.CheckItem(config);
			} else {
				config = new Ext.menu.Item(config);
			}
		}
		return this.addToolItem(config);
	},

	setTitle : function(title, iconCls) {
		this.title = title;
		if (this.header.child('span')) {
			this.header.child('span').update(title);
		}
		return this;
	},

	getToolButton : function(config) {
		var btn = new Ext.Button({
					handler : config.handler,
					// iconCls: config.iconCls,
					minWidth : this.toolPanelWidth - 10,
					scope : config.scope,
					text : config.text
				});

		return btn;
	}
});

/**
 * 开始菜单直接启动程序的父类--tz
 */
Ext.ux.StartMenuApplication = function(config) {
	config && Ext.apply(this, config);
}
Ext.ux.StartMenuApplication.prototype = {
	window : null,
	/**
	 * 配置弹出窗口的参数,具体可以参见Ext.Window类的配置信息
	 */
	windowConfig : false,
	/**
	 * 是否在对象初始化完毕弹出窗口,如果为false,可以在后续的代码中调用属性window的show方法显示窗口
	 */
	showWindow : true,
	/**
	 * 两次点击开始菜单同一个menu,只在第一次弹出窗口
	 */
	singleMode : true,
	init : function(src) {

		if (this.singleMode && src.desktop.getWindow(src.windowId))
			return;

		var items;
		if (src.isIFrame == 'true') {
			items = new Ext.ux.IFrameComponent({
						id : src.windowId,
						url : src.url
					});
		} else {
			items = this.main(src);
		}

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
		var config = {
			id : src.windowId,
			title : src.text || src.tooltip,
			layout : 'fit',
			items : items || {},
			icon : src.icon || src.windowIcon,
			shim : true,
			animCollapse : false,
			constrainHeader : true,
			minimizable : true,
			maximizable : true,
			width : src.winWidth,
			height : src.winHeight,
			x : fixPosition(+src.x, viewWidth, src.winWidth),
			y : fixPosition(+src.y, viewHeight, src.winHeight)
		}
		this.windowConfig && Ext.apply(config, this.windowConfig);

		this.window = src.desktop.createWindow(config);
		if (this.showWindow)
			this.window.show();
	},
	/**
	 * 用于生成窗体的内容,返回结果直接赋值给window的items属性.
	 */
	main : function(menuItemConfig) {
	}
}