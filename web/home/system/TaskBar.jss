Ext.ux.TaskBar = Ext.extend(Ext.Container, {
	constructor : function(app) {
		this.app = app;
		this.el = Ext.getBody().createChild({
					tag : 'div',
					cls : 'ux-taskbar'
				});
		var startEl = this.el.createChild({
					tag : 'div',
					cls : 'ux-taskbar-start'
				});
		var wrapEl = this.el.createChild({
					tag : 'div'
				});
		this.startMenu = new Ext.ux.StartMenu(Ext.apply({
					iconCls : 'user',
					height : 300,
					shadow : true
				}, this.app.startConfig));
		
		
		this.el.unselectable();		
		this.startMenu.on("render",function(menu){
			menu.el.unselectable();	
		});
		this.startButton = new Ext.Button({
			text : '开始'.loc(),
			id : 'ux-startbutton',
			iconCls : 'start',
			menu : this.startMenu,
			menuAlign : 'bl-tl',
			renderTo : startEl,
			template : new Ext.Template(
					// +X+ ADD START
					'<table cellspacing="0" class="x-btn-wrap x-btn {3}">',
					'<tbody><tr class="x-btn-with-menu">',
					'<td class="x-btn-left ux-startbutton-left"><i>&#160;</i></td>',
					'<td class="x-btn-center ux-startbutton-center"><em class="{5} unselectable="on">',
					'<button class="start x-btn-text {2}" type="{1}" style="height:30px;">{0}</button>',
					'</em></td>',
					'<td class="x-btn-right ux-startbutton-right"><i>&#160;</i></td>',
					"</tr></tbody>", "</table>")
				// +X+ ADD END
		});

		var startWidth = Ext.get('ux-startbutton') ? Ext.get('ux-startbutton')
				.getWidth()
				+ 10 : 100;
		this.quickStartPanel = new Ext.ux.QuickStartPanel({
					cls : 'ux-quickstart-panel',
					minWidth : 60,
					region : 'west',
					split : true,
					width : 94
				});

		this.taskButtonPanel = new Ext.ux.TaskButtonsPanel({
					cls : 'ux-taskbuttons-panel',
					region : 'center'
				});

		Ext.ux.TaskBar.superclass.constructor.call(this, {
					el : this.el,
					items : [{
								el : startEl,
								minWidth : startWidth,
								region : 'west',
								split : false,
								width : startWidth,
								xtype : 'box'
							}, {
								el : wrapEl,
								items : [this.quickStartPanel,
										this.taskButtonPanel],
								layout : 'border',
								region : 'center',
								xtype : 'container'
							}],
					layout : 'border'
				});
	},

	// override

	initComponent : function() {
		Ext.ux.TaskBar.superclass.initComponent.call(this);

		this.el = Ext.get(this.el) || Ext.getBody();
		this.el.setHeight = Ext.emptyFn;
		this.el.setWidth = Ext.emptyFn;
		this.el.setSize = Ext.emptyFn;
		this.el.setStyle({
					overflow : 'hidden',
					margin : '0',
					border : '0 none'
				});
		this.el.dom.scroll = 'no';
		this.allowDomMove = false;
		this.autoWidth = true;
		this.autoHeight = true;
		Ext.EventManager.onWindowResize(this.fireResize, this);
		this.renderTo = this.el;
	},

	fireResize : function(w, h) {
		this.fireEvent('resize', this, w, h, w, h);
		this.onResize(w, h, w, h);
	},

	// added method

	setActiveButton : function(btn) {
		this.taskButtonPanel.setActiveButton(btn);
	}
});

/**
 * @class Ext.ux.TaskButtonsPanel
 * @extends Ext.BoxComponent
 */
Ext.ux.TaskButtonsPanel = Ext.extend(Ext.BoxComponent, {
	activeButton : null,
	enableScroll : true,
	scrollIncrement : 0,
	scrollRepeatInterval : 400,
	scrollDuration : .35,
	animScroll : true,
	resizeButtons : true,
	buttonWidth : 168,
	minButtonWidth : 118,
	buttonMargin : 2,
	buttonWidthSet : false,

	onRender : function(ct, position) {
		Ext.ux.TaskButtonsPanel.superclass.onRender.call(this, ct, position);

		if (!this.el) { // not existing markup
			this.el = ct.createChild({
						id : this.id
					}, position);
		}
		this.stripWrap = Ext.get(this.el).createChild({
					cls : 'ux-taskbuttons-strip-wrap',
					cn : {
						tag : 'ul',
						cls : 'ux-taskbuttons-strip'
					}
				});
		this.stripSpacer = Ext.get(this.el).createChild({
					cls : 'ux-taskbuttons-strip-spacer'
				});
		this.strip = new Ext.Element(this.stripWrap.dom.firstChild);
		this.edge = this.strip.createChild({
					tag : 'li',
					cls : 'ux-taskbuttons-edge'
				});
		this.strip.createChild({
					cls : 'x-clear'
				});
	},

	initComponent : function() {
		Ext.ux.TaskButtonsPanel.superclass.initComponent.call(this);
		this.on('resize', this.delegateUpdates);
		this.items = [];
	},

	add : function(win) {
		var li = this.strip.createChild({
					tag : 'li'
				}, this.edge); // insert before the edge
		var btn = new Ext.ux.TaskBar.TaskButton(win, li);

		this.items.push(btn);

		if (!this.buttonWidthSet) {
			this.lastButtonWidth = btn.container.getWidth();
		}

		this.setActiveButton(btn);
		return btn;
	},

	remove : function(btn) {
		var li = document.getElementById(btn.container.id);
		btn.destroy();
		li.parentNode.removeChild(li);

		var s = [];
		for (var i = 0, len = this.items.length; i < len; i++) {
			if (this.items[i] != btn) {
				s.push(this.items[i]);
			}
		}
		this.items = s;

		this.delegateUpdates();
	},

	setActiveButton : function(btn) {
		this.activeButton = btn;
		this.delegateUpdates();
	},

	delegateUpdates : function() {
		/*
		 * if(this.suspendUpdates){ return; }
		 */
		if (this.resizeButtons && this.rendered) {
			this.autoSize();
		}
		if (this.enableScroll && this.rendered) {
			this.autoScroll();
		}

	},

	autoSize : function() {
		var count = this.items.length;
		var ow = this.el.dom.offsetWidth;
		var aw = this.el.dom.clientWidth;

		if (!this.resizeButtons || count < 1 || !aw) { // !aw for display:none
			return;
		}

		var each = Math.max(Math.min(Math.floor((aw - 4) / count)
								- this.buttonMargin, this.buttonWidth),
				this.minButtonWidth); // -4 for float errors in IE
		var btns = this.stripWrap.dom.getElementsByTagName('button');
		if (btns.length > 0) {
			this.lastButtonWidth = Ext.get(btns[0].id).findParent('li').offsetWidth;

			for (var i = 0, len = btns.length; i < len; i++) {
				var btn = btns[i];

				var tw = Ext.get(btns[i].id).findParent('li').offsetWidth;
				var iw = btn.offsetWidth;

				btn.style.width = (each - (tw - iw)) + 'px';
			}
		}
	},

	autoScroll : function() {
		var count = this.items.length;
		var ow = this.el.dom.offsetWidth;
		var tw = this.el.dom.clientWidth;

		var wrap = this.stripWrap;
		var cw = wrap.dom.offsetWidth;
		var pos = this.getScrollPos();
		var l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

		if (!this.enableScroll || count < 1 || cw < 20) { // 20 to prevent
			// display:none
			// issues
			return;
		}

		wrap.setWidth(tw); // moved to here because of problem in Safari

		if (l <= tw) {
			wrap.dom.scrollLeft = 0;
			// wrap.setWidth(tw); moved from here because of problem in Safari
			if (this.scrolling) {
				this.scrolling = false;
				this.el.removeClass('x-taskbuttons-scrolling');
				this.scrollLeft.hide();
				this.scrollRight.hide();
			}
		} else {
			if (!this.scrolling) {
				this.el.addClass('x-taskbuttons-scrolling');
			}
			tw -= wrap.getMargins('lr');
			wrap.setWidth(tw > 20 ? tw : 20);
			if (!this.scrolling) {
				if (!this.scrollLeft) {
					this.createScrollers();
				} else {
					this.scrollLeft.show();
					this.scrollRight.show();
				}
			}
			this.scrolling = true;
			if (pos > (l - tw)) { // ensure it stays within bounds
				wrap.dom.scrollLeft = l - tw;
			} else { // otherwise, make sure the active button is still
				// visible
				this.scrollToButton(this.activeButton, true); // true to
				// animate
			}
			this.updateScrollButtons();
		}
	},

	createScrollers : function() {
		var h = this.el.dom.offsetHeight; // var h =
		// this.stripWrap.dom.offsetHeight;

		// left
		var sl = this.el.insertFirst({
					cls : 'ux-taskbuttons-scroller-left'
				});
		sl.setHeight(h);
		sl.addClassOnOver('ux-taskbuttons-scroller-left-over');
		this.leftRepeater = new Ext.util.ClickRepeater(sl, {
					interval : this.scrollRepeatInterval,
					handler : this.onScrollLeft,
					scope : this
				});
		this.scrollLeft = sl;

		// right
		var sr = this.el.insertFirst({
					cls : 'ux-taskbuttons-scroller-right'
				});
		sr.setHeight(h);
		sr.addClassOnOver('ux-taskbuttons-scroller-right-over');
		this.rightRepeater = new Ext.util.ClickRepeater(sr, {
					interval : this.scrollRepeatInterval,
					handler : this.onScrollRight,
					scope : this
				});
		this.scrollRight = sr;
	},

	getScrollWidth : function() {
		return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
	},

	getScrollPos : function() {
		return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
	},

	getScrollArea : function() {
		return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
	},

	getScrollAnim : function() {
		return {
			duration : this.scrollDuration,
			callback : this.updateScrollButtons,
			scope : this
		};
	},

	getScrollIncrement : function() {
		return (this.scrollIncrement || this.lastButtonWidth + 2);
	},

	/*
	 * getBtnEl : function(item){ return document.getElementById(item.id); },
	 */

	scrollToButton : function(item, animate) {
		item = item.el.dom.parentNode; // li
		if (!item) {
			return;
		}
		var el = item; // this.getBtnEl(item);
		var pos = this.getScrollPos(), area = this.getScrollArea();
		var left = Ext.fly(el).getOffsetsTo(this.stripWrap)[0] + pos;
		var right = left + el.offsetWidth;
		if (left < pos) {
			this.scrollTo(left, animate);
		} else if (right > (pos + area)) {
			this.scrollTo(right - area, animate);
		}
	},

	scrollTo : function(pos, animate) {
		this.stripWrap.scrollTo('left', pos, animate
						? this.getScrollAnim()
						: false);
		if (!animate) {
			this.updateScrollButtons();
		}
	},

	onScrollRight : function() {
		var sw = this.getScrollWidth() - this.getScrollArea();
		var pos = this.getScrollPos();
		var s = Math.min(sw, pos + this.getScrollIncrement());
		if (s != pos) {
			this.scrollTo(s, this.animScroll);
		}
	},

	onScrollLeft : function() {
		var pos = this.getScrollPos();
		var s = Math.max(0, pos - this.getScrollIncrement());
		if (s != pos) {
			this.scrollTo(s, this.animScroll);
		}
	},

	updateScrollButtons : function() {
		var pos = this.getScrollPos();
		this.scrollLeft[pos == 0 ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-left-disabled');
		this.scrollRight[pos >= (this.getScrollWidth() - this.getScrollArea())
				? 'addClass'
				: 'removeClass']('ux-taskbuttons-scroller-right-disabled');
	}
});

/**
 * @class Ext.ux.TaskBar.TaskButton
 * @extends Ext.Button
 */
Ext.ux.TaskBar.TaskButton = function(win, el) {
	this.win = win;

	Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this, {
		icon : win.icon,
		iconCls : win.iconCls,
		text : Ext.util.Format.ellipsis(win.title, 12),
		tooltip : win.taskbuttonTooltip || win.title,
		renderTo : el,
		handler : function() {
			if (win.minimized || win.hidden) {
				win.show();
			} else if (win == win.manager.getActive()) {
				win.minimize();
			} else {
				win.toFront();
			}
		},
		clickEvent : 'mousedown',
		template : new Ext.Template(
				// +X+ ADD START
				'<table cellspacing="0" class="x-btn-wrap x-btn {3}">',
				'<tbody><tr>',
				'<td class="x-btn-left ux-taskbutton-left"><i>&#160;</i></td>',
				'<td class="x-btn-center ux-taskbutton-center"><em class="{5} unselectable="on">',
				'<button class="x-btn-text {2}" type="{1}" style="height:28px;">{0}</button>',
				'</em></td>',
				'<td class="x-btn-right ux-taskbutton-right"><i>&#160;</i></td>',
				"</tr></tbody>", "</table>")
			// +X+ ADD END
	});
};

Ext.extend(Ext.ux.TaskBar.TaskButton, Ext.Button, {
			onRender : function() {
				Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this,
						arguments);

				this.cmenu = new Ext.menu.Menu({
							items : [{
										// id: 'restore',
										text : '恢复'.loc(),
										handler : function() {
											if (!this.win.isVisible()) {
												this.win.show();
											} else {
												this.win.restore();
											}
										},
										scope : this
									}, {
										// id: 'minimize',
										text : '最小化'.loc(),
										handler : this.win.minimize,
										scope : this.win
									}, {
										// id: 'maximize',
										text : '最大化'.loc(),
										handler : this.win.maximize,
										scope : this.win
									}, '-', {
										// id: 'close',
										text : '关闭'.loc(),
										handler : this.closeWin.createDelegate(
												this, this.win, true),
										scope : this.win
									}]
						});

				this.cmenu.on('beforeshow', function() {
							var items = this.cmenu.items.items;
							var w = this.win;
							items[0].setDisabled(w.maximized !== true
									&& w.hidden !== true);
							items[1].setDisabled(w.minimized === true);
							items[2].setDisabled(w.maximized === true
									|| w.hidden === true);
							items[2].setDisabled(w.maximizable === false);
							items[3].setDisabled(w.closable === false);
						}, this);

				this.el.on('contextmenu', function(e) {
							e.stopEvent();
							if (!this.cmenu.el) {
								this.cmenu.render();
							}
							var xy = e.getXY();
							xy[1] -= this.cmenu.el.getHeight();
							this.cmenu.showAt(xy);
						}, this);
			},

			closeWin : function(cMenu, e, win) {
				if (!win.isVisible()) {
					win.show();
				} else {
					win.restore();
				}
				win.close(true);
			},

			/**
			 * override so autoWidth() is not called
			 * 
			 * @param {String}
			 *            text The text for the button
			 */
			setText : function(text) {
				if (text) {
					this.text = text;
					if (this.el) {
						this.el.child("td.x-btn-center " + this.buttonSelector)
								.update(Ext.util.Format.ellipsis(text, 12));
					}
				}
			},

			/**
			 * @param {String/Object}
			 *            tooltip The tooltip for the button - can be a string
			 *            or QuickTips config object
			 */
			setTooltip : function(text) {
				if (text) {
					this.tooltip = text;
					var btnEl = this.el.child(this.buttonSelector);
					Ext.QuickTips.unregister(btnEl.id);

					if (typeof this.tooltip == 'object') {
						Ext.QuickTips.register(Ext.apply({
									target : btnEl.id
								}, this.tooltip));
					} else {
						btnEl.dom[this.tooltipType] = this.tooltip;
					}
				}
			}
		});

/**
 * @class Ext.ux.QuickStartPanel
 * @extends Ext.BoxComponent
 */
Ext.ux.QuickStartPanel = Ext.extend(Ext.BoxComponent, {
	enableMenu : true,

	onRender : function(ct, position) {
		Ext.ux.QuickStartPanel.superclass.onRender.call(this, ct, position);

		if (!this.el) { // not existing markup
			this.el = ct.createChild({
						id : this.id
					}, position);
		}
		this.stripWrap = Ext.get(this.el).createChild({
					cls : 'ux-quickstart-strip-wrap',
					cn : {
						tag : 'ul',
						cls : 'ux-quickstart-strip'
					}
				});
		this.stripSpacer = Ext.get(this.el).createChild({
					cls : 'ux-quickstart-strip-spacer'
				});
		this.strip = new Ext.Element(this.stripWrap.dom.firstChild);
		this.edge = this.strip.createChild({
					tag : 'li',
					cls : 'ux-quickstart-edge'
				});
		this.strip.createChild({
					cls : 'x-clear'
				});
	},

	initComponent : function() {
		Ext.ux.QuickStartPanel.superclass.initComponent.call(this);

		this.on('resize', this.delegateUpdates);

		this.menu = new Ext.menu.Menu();
		this.items = [];
	},

	add : function(config) {
		var li = this.strip.createChild({
					tag : 'li'
				}, this.edge); // insert before the edge

		var btn = new Ext.Button(Ext.apply(config, {
			cls : 'x-btn-icon',
			menuText : config.text,
			renderTo : li,
			text : '', // do not display text
			template : new Ext.Template(
					// +X+ ADD START
					'<table cellspacing="0" class="x-btn-wrap x-btn {3}">',
					'<tbody><tr>',
					'<td class="x-btn-left"><i>&#160;</i></td>',
					'<td class="x-btn-center"><em class="{5} unselectable="on">',
					'<button class="x-btn-text {2}" type="{1}">{0}</button>',
					'</em></td>', '<td class="x-btn-right"><i>&#160;</i></td>',
					"</tr></tbody>", "</table>")
				// +X+ ADD END
		}));

		this.items.push(btn);
		this.delegateUpdates();
		return btn;
	},

	remove : function(btn) {
		var li = document.getElementById(btn.container.id);
		btn.destroy();
		li.parentNode.removeChild(li);

		var s = [];
		for (var i = 0, len = this.items.length; i < len; i++) {
			if (this.items[i] != btn) {
				s.push(this.items[i]);
			}
		}
		this.items = s;

		this.delegateUpdates();
	},

	menuAdd : function(config) {
		this.menu.add(config);
	},

	delegateUpdates : function() {
		if (this.enableMenu && this.rendered) {
			this.showButtons();
			this.clearMenu();
			this.autoMenu();
		}
	},

	showButtons : function() {
		var count = this.items.length;

		for (var i = 0; i < count; i++) {
			this.items[i].show();
		}
	},

	clearMenu : function() {
		this.menu.removeAll();
	},

	autoMenu : function() {
		var count = this.items.length;
		var ow = this.el.dom.offsetWidth;
		var tw = this.el.dom.clientWidth;

		var wrap = this.stripWrap;
		var cw = wrap.dom.offsetWidth;
		var l = this.edge.getOffsetsTo(this.stripWrap)[0];

		if (!this.enableMenu || count < 1 || cw < 20) { // 20 to prevent
			// display:none issues
			return;
		}

		wrap.setWidth(tw);

		if (l <= tw) {
			if (this.showingMenu) {
				this.showingMenu = false;
				this.menuButton.hide();
			}
		} else {
			tw -= wrap.getMargins('lr');
			wrap.setWidth(tw > 20 ? tw : 20);
			if (!this.showingMenu) {
				if (!this.menuButton) {
					this.createMenuButton();
				} else {
					this.menuButton.show();
				}
			}

			var mo = this.getMenuButtonPos();

			for (var i = count - 1; i >= 0; i--) {
				var bo = this.items[i].el.dom.offsetLeft
						+ this.items[i].el.dom.offsetWidth;
				if (bo > mo) {
					this.items[i].hide();
					var ic = this.items[i].initialConfig;
					var config = {
						iconCls : ic.iconCls,
						handler : ic.handler.createDelegate(this.items[i]),
						scope : ic.scope,
						text : ic.menuText
					};
					this.menuAdd(config);
				} else {
					this.items[i].show();
				}
			}

			this.showingMenu = true;
		}
	},

	createMenuButton : function() {
		var h = this.el.dom.offsetHeight;

		var mb = this.el.insertFirst({
					cls : 'ux-quickstart-menubutton-wrap'
				});

		mb.setHeight(h);

		var btn = new Ext.Button({
			cls : 'x-btn-icon',
			id : 'ux-quickstart-menubutton',
			menu : this.menu,
			renderTo : mb,
			text : "",
			menuText : "More",
			template : new Ext.Template(
					// +X+ ADD START
					'<table cellspacing="0" class="x-btn-wrap x-btn x-btn-icon">',
					'<tbody><tr class=" x-btn-with-menu">',
					'<td class="x-btn-left"><i>&#160;</i></td>',
					'<td class="x-btn-center"><em  unselectable="on">',
					'<button class="x-btn-text " type="button">{0}</button>',
					'</em></td>', '<td class="x-btn-right"><i>&#160;</i></td>',
					"</tr></tbody>", "</table>")
				// +X+ ADD END
		});
		btn.on('render', function() {

					mb.setWidth(Ext.get('ux-quickstart-menubutton').getWidth());

				}, this)

		this.menuButton = mb;
	},

	getMenuButtonPos : function() {
		return this.menuButton.dom.offsetLeft;
	}
});