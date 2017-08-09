lib.rdp.Window = {
	x : 0,
	y : 0,
	lastState : 0,// 最小化:1,最大化:2,恢复原状:0
	state : -1,
	minimized : false,
	maximized : false,
	closable : true,
	hidden : false,
	resizeable : true,
	repaintId : 0,
	cancelRepaint : function() {
		if (this.repaintId != 0) {
			clearTimeout(this.repaintId);
			this.repaintId = 0;
		}
	},
	repaint : function(box, time) {
		if (!(box = box || this.cbox))
			return;
		this.cancelRepaint();
		this.repaintId = this.paint.defer(time || 100, this, [box]);
	},
	paint : function(box) {
		if (this.context != null) {
			this.instance.backImageBuffer.repaint(box.x, box.y, box.width,
					box.height, this.context);
			//lg("repaint end");
		}
		this.repaintId = 0;
	},
	isVisible : function() {
		return this.hidden == false;
	},
	setState : function(state, sentState) {
		if (this.state != state) {
			this.lastState = this.state;
			this.state = state;
			this.minimized = (state == 1);
			this.maximized = (state == 2);
			this[this.minimized ? "hide" : "show"]();
			this.resizeable && (this.resizer.enabled = (state == 0));
			sentState
					&& this.instance.websocket.send("8d" + this.id + "\t"
							+ state)
			!this.isTop && state != 1 && this.repaint();
		}
	},
	minimize : function() {
		this.setState(1, true);
	},
	maximize : function() {
		this.setState(2, true);
	},
	restore : function() {
		this.setState(this.lastState, true);
	},
	beforeClose : function(sendServer) {
		this.context = null;
		delete this.cbox;
		this.repaintId != 0 && this.cancelRepaint();
		if (sendServer) {
			this.instance.connecting
					&& this.instance.websocket.send("88" + this.id)
		}
		this.instance.repaintAll(300);
	},
	setZIndex : function(index) {
		this.el.setStyle("z-index", index);
	},
	getZIndex : function() {
		return this.el.dom.style.zIndex;
	}
}

lib.rdp.SeamlessWindow = Ext.extend(Ext.BoxComponent, Ext.apply({
	isRootFrame : true,
	title : "",
	icon : "",
	iconCls : "",
	zIndexSeed : 100,
	// private
	initComponent : function() {
		Ext.BoxComponent.superclass.initComponent.call(this);
		this.childs = new lib.rdp.DualwayChain();
	},
	getChildZIndex : function() {
		return this.zIndexSeed += 10;
	},
	afterRender : function() {
		lib.rdp.SeamlessWindow.superclass.afterRender.call(this);
		this.manager.register(this);
		if (this.resizeable)
			this.resizer = new lib.rdp.Resizer(this);
		window.itz = this.instance;
		window.wtz = this;
	},
	updateBox : function(box, notRefresh) {
		if (box.x != this.x || box.y != this.y || box.width != this.width
				|| box.height != this.height) {
			if (box.x != this.x || box.y != this.y) {
				this.context.offsetX = box.x;
				this.context.offsetY = box.y;
				this.setPosition(box.x, box.y);
			}
			if (box.width != this.width || box.height != this.height) {
				box.width > this.instance.width
						&& (box.width = this.instance.width - box.x);
				box.height > this.instance.height
						&& (box.height = this.instance.height - box.y);
				this.width = this.input.style.width = this.canvas.width = box.width;
				this.height = this.input.style.height = this.canvas.height = box.height;
				this.setSize(box.width, box.height);
			}
			this.dx = box.x + box.width;
			this.dy = box.y + box.height;
			if (lib.rdp.Splash.shown) {
				lib.rdp.Splash.hide(box);
			}
			this.cbox = box;
		}
	},

	getBox : function() {
		return this.cbox
	},
	onRender : function(ct, position) {
		lib.rdp.SeamlessWindow.superclass.onRender.call(this, ct, position);

		this.el.setStyle("position", "absolute");
		this.canvas = this.el.createChild({
					tag : "canvas",
					style : "z-index :10"
				}, false, true);
		this.context = this.canvas.getContext('2d');
		this.context.offsetX = this.context.offsetY = 0;
		this.input = this.instance.createInputProxy();
		this.el.appendChild(this.input)
		this.taskbar = WorkBench.Desk.getDesktop().taskbar;
		this.taskButton = this.taskbar.taskButtonPanel.add(this);
	},
	setTitle : function(title) {
		this.title = title;
		this.taskButton.setText(title)
	},
	setIcon : function(icon) {
		this.taskButton.setIcon('data:image/png;base64,' + icon)
	},
	show : function() {
		lib.rdp.SeamlessWindow.superclass.show.call(this);
		if (this.minimized) {
			this.restore();
		}
		this.toFront();
		return this;
	},
	toFront : function(e) {
		if (this.manager.bringToFront(this)) {
			if (!e || !e.getTarget().focus) {
				this.focus();
			}
		}
		this.instance.windowManager.roots.toTop(this);
		return this;
	},
	focus : function() {
		if (this.rendered && !this.isDestroyed) {
			this.input.focus();
		}
	},
	setActive : function(state) {
		if (state) {
			this.taskbar.setActiveButton(this.taskButton);
			this.instance.front = this;
		}
	},
	getRealBox : function() {
		var b = this.getBox();
		b.top = b.y;
		b.left = b.x;
		return b;
	},
	close : function(sendServer) {
		this.beforeClose(sendServer);
		while (this.childs.root != null) {
			this.childs.root.close();
		}
		this.instance.windowManager.remove(this);
		this.manager.unregister(this);
		delete this.taskBar;
		this.taskButton.destroy();
		delete this.taskButton;
		this.destroy();
	}
}, lib.rdp.Window));

lib.rdp.SubWindow = function(config) {
	Ext.apply(this, config);
	this.render(this.renderTo);
	if (this.rootFrame != null) {
		this.rootFrame.childs.add(this);
	}
}

lib.rdp.SubWindow.prototype = Ext.apply({
			rendered : false,
			hidden : false,
			updateBox : function(box, notRefresh) {
				var s = this.el.dom.style;
				if (box.x != this.x || box.y != this.y
						|| box.width != this.width || box.height != this.height) {
					if (box.x != this.x || box.y != this.y) {
						if (this.x != box.x) {
							this.context.offsetX = this.x = box.x;
							if (this.rootFrame) {
								s.left = this.x - this.rootFrame.x;
							}
						}
						if (this.y != box.y) {
							this.context.offsetY = this.y = box.y;
							if (this.rootFrame) {
								s.top = this.y - this.rootFrame.y;
							}
						}
					}
					if (box.width != this.width || box.height != this.height) {
						box.width > this.instance.width
								&& (box.width = this.instance.width - box.x);
						box.height > this.instance.height
								&& (box.height = this.instance.height - box.y);
						this.width = box.width
						this.height = box.height
						s.width = box.width;
						s.height = box.height;
						this.input.style.width = box.width;
						this.input.style.height = box.height;
						this.canvas.width = box.width;
						this.canvas.height = box.height;
					}
					this.dx = this.x + this.width;
					this.dy = this.y + this.height;
					this.cbox = box;
				}
			},
			hide : function() {
				if (this.hidden === false) {
					this.hidden = true;
					this.el.hide()
				};
			},
			getBox : function() {
				return {
					x : this.x,
					y : this.y,
					width : this.width,
					height : this.height
				}
			},
			render : function(ct) {
				this.el = Ext.get(ct).createChild({
							tag : "div",
							style : "position :absolute;left:0;top:0;"
						});
				this.canvas = this.el.createChild({
							tag : "canvas",
							style : "z-index :10"
						}, false, true);
				this.context = this.canvas.getContext('2d');
				this.context.offsetX = this.context.offsetY = 0;
				this.input = this.instance.createInputProxy();
				this.el.appendChild(this.input);
				this.rendered = true;

				if (this.resizeable)
					this.resizer = new lib.rdp.Resizer(this);
			},
			toFront : function() {
				if (this.rootFrame != null) {
					this.rootFrame.childs.toTop(this);
					this.setZIndex(this.rootFrame.getChildZIndex());
				}
			},
			getRealBox : function() {
				var b = this.getBox();
				b.left = b.x - this.rootFrame.x;
				b.top = b.y - this.rootFrame.y;
				return b;
			},
			close : function(sendServer) {
				this.beforeClose(sendServer);
				if (this.rootFrame != null) {
					this.rootFrame.childs.remove(this);
					delete this.rootFrame;
				}
				this.instance.windowManager.remove(this);
				delete this.instance;
				this.el.remove();
				delete this.renderTo;
			},
			show : function() {
				if (this.hidden) {
					this.el.show();
					this.hidden = false;
				}
				if (this.minimized) {
					this.restore();
				}
				this.toFront();
			}
		}, lib.rdp.Window);