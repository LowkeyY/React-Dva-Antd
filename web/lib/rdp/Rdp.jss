Ext.ns("lib.rdp");
using("lib.rdp.Protocol");
using("lib.rdp.SeamlessWindow");
lib.rdp.Rdp = {
	desktopBox : {
		x : 0,
		y : 0
	},
	pool : {},
	windowResizeHandler : {
		canResize : function() {
			this.waittingTask = this.locked
			if (this.locked === false) {
				this.locked = true;
				this.unlock.defer(1000, this);
			}
			return !this.waittingTask;
		},
		waittingTask : false,
		locked : false,
		unlock : function() {
			this.locked = false;
			this.waittingTask && lib.rdp.Rdp.onWindowResize();
		}
	},
	seed : 0,
	getInstance : function(id) {
		return this.pool[id];
	},
	createInstance : function(config) {
		return new lib.rdp.Instance(config);
	},
	register : function(instance) {
		if (!this.initialized) {
			this.__initialize();
		}
		instance.id = "ins_" + this.seed++;
		Ext.apply(instance, this.opts)
		this.pool[instance.id] = instance;
	},
	unregister : function(instance) {
		delete this.pool[instance.id];
	},
	destroy : function(msg) {
		Ext.unUnload(this, this.beforeWindowUnload, this.destroy);
		Ext.EventManager.un(window, "focus", lib.rdp.Clipboard.onWindowFocus,
				lib.rdp.Clipboard);
		for (var i in this.pool) {
			this.pool[i].destroy(msg);
		}
	},
	beforeWindowUnload : function() {
		var msg = new Array();
		for (var i in this.pool) {
			if (this.pool[i].connecting) {
				msg.push('窗口'.loc() +'"'+ this.pool[i].windowManager.roots.root.title
						+ '"'+'未关闭'.loc())
			}
		}
		return msg;
	},
	onWindowResize : function() {
		if (this.windowResizeHandler.canResize()) {
			var desktop = WorkBench.Desk.getDesktop();
			var height = (Ext.lib.Dom.getViewHeight() - desktop.taskbar.el
					.getHeight())
					& -4;
			var width = Ext.lib.Dom.getViewWidth() & -4;
			if (this.opts.width != width || this.opts.height != height) {
				this.desktopBox.width = this.opts.width = width;
				this.desktopBox.height = this.opts.height = height;

				for (var i in this.pool) {
					if (this.pool[i] != null)
						this.pool[i].resizeTo(width, height);
				}
			}
		}
	},
	createWebSocket : function(url) {
		return "WebSocket" in window
				? new WebSocket(url)
				: "MozWebSocket" in window ? new MozWebSocket(url) : null
	},
	__initialize : function() {// 此处初始化浏览器全局属性
		if (this.initialized) {
			return;
		}
		if (Ext.isIE) {
			using("lib.rdp.CFCheck");
			CFInstall.check({
				mode : "overlay",
				onmissing : function() {
					alert('您的浏览器不支持最新的HTML5显示技术,请照提示安装Chrome FrameWork框架后才能运行当前程序.'.loc());
				}
			});
		}
		this.initialized = true;
		Ext.isTouch = "createTouch" in document
				|| -1 != navigator.userAgent.indexOf("Mobile");
		Ext.isMultitask = !(Ext.isTouch && Ext.isMac)
		Ext.isFirefox = Ext.isGecko;
		var desktop = WorkBench.Desk.getDesktop();
		this.desktopBox.width = desktop.getViewWidth() & -4;
		this.desktopBox.height = desktop.getViewHeight() & -4;
		this.opts = Ext.apply({
					isTouchpad : false,
					windowGroup : desktop.windows,
					desktopElement : Ext.get(desktop.el)
				}, this.desktopBox);
		lib.rdp.ScreenLock.prototype.proxy = this.opts.desktopElement
				.createChild({
					tag : "div",
					style : "z-index:10000;position:absolute;border:gray 2px solid;display:none;"
				});
		Ext.onUnload(this, this.beforeWindowUnload, this.destroy);
		Ext.EventManager.on(window, "focus", lib.rdp.Clipboard.onWindowFocus,
				lib.rdp.Clipboard);
		Ext.EventManager.onWindowResize(this.onWindowResize, this);
		try {
			var d = this.createWebSocket("ws://localhost");
			this.opts.binaryWebSocket = ("binaryType" in d);
			d.close()
		} catch (f) {
		}

	}
}

lib.rdp.Instance = Ext.extend(Ext.util.Observable, {
			// options
			noCursor : false,
			mapDisk : false,
			displayMsg : false,
			isThisRemoteApp : true,
			fastCopy : false,
			colorDepth : 24,// 客户端颜色位数
			// local fields
			prePaste : false,
			mousedown : false,
			host : "",
			defaultPalett : null,
			fileUploadManagerInstance : null,
			constructor : function(config) {
				var me = this;
				Ext.apply(me, config);
				lib.rdp.Rdp.register(me);
				lib.rdp.Splash.show(this);
				this.colorDepth=config.bpp;
				this.fontColor = Math.floor((this.colorDepth + 7) / 8);
				this.addEvents(
						/**
						 * @event open 当Instance实例的远程连接建立时触发。
						 */
						'open',
						/**
						 * @event close 当Instance实例的远程连接关闭时触发。
						 * @param event
						 *            关闭时信息,包括code（代码）和reason（关闭原因）两个属性
						 */
						'close',
						/**
						 * @event beforedestroy 当Instance实例关闭前触发。
						 */
						'beforedestroy',
						/**
						 * @event destroy 当Instance实例关闭后触发，所有内关联对象已经销毁。
						 */
						'destroy'

				);
				this.websocket = this.createWebSocket();
				if (this.websocket == null) {
					lib.rdp.Rdp.unregister(this);
					lib.rdp.Splash.hide(this);
					return;
				}
				this.lockScreen = new lib.rdp.ScreenLock(me);
				this.websocket.onopen = function() {
					me.connecting = true;
					me.fireEvent('open', me);
				}
				this.websocket.onclose = function(e) {
					lg("websocket close");
					me.connecting = false;
					me.fireEvent('close', me, e);
				}
				var p = lib.rdp.Protocol;
				this.websocket.id = this.id;
				this.websocket.sent = this.websocket.send;
				this.websocket.send = function(msg) {
					lg("send:" + msg);
					this.sent(msg);
				}

				this.websocket.onmessage = function(msg) {
					// lg("recive:" + msg.data);
					p.onMessageArrive(me, msg);
				}

				this.initState();
				this.eventManager = new lib.rdp.EventManager(this);
				this.windowManager = new lib.rdp.WindowManager();

			},
			initState : function() {
				lib.rdp.OrderState.initState(this);
				this.backImageBuffer = new lib.rdp.ImageBuffer(this,
						this.width, this.height);
				this.fontCache = Array(12);
				for (var dc = 0; 12 > dc; dc++)
					this.fontCache[dc] = Array(256);
				this.textCache = Array(256);
				this.desktopSaveCache = {};
				this.cursorCache = Array(20);
				this.bitmapCache = [];
			},
			resizeTo : function(width, height) {
				if (this.connecting) {
					this.setMask(true);
					this.width = width;
					this.height = height;
					this.websocket.send("1E" + width + "\t" + height);
					this.initState();
				}
			},
			setMask : function(mask) {
				var ws = this.windowManager.wins;
				for (var i in ws) {
					ws[i] && ws[i].el[mask ? "mask" : "unmask"]('等待服务器响应...'.loc());
				}
			},
			repaintLock : false,
			repaintAll : function(defer) {
				if (this.repaintLock === true)
					return;

				if (defer) {
					var f = function() {
						this.repaintLock = false;
						this.repaintAll();
					}
					this.repaintLock = true
					f.defer(defer, this);
					return;
				}
				var ws = this.windowManager.wins;
				for (var i in ws) {
					ws[i] && ws[i].repaint();
				}
			},
			setCursor : function(a) {
				if (a != 'default') {
					a = this.cursorCache[a];
					a = "url(" + a.data + ") " + a.hotX + " " + a.hotY
							+ ", default"
				}
				var f = this.getFocus();
				f != null && (f.input.style.cursor = a);
			},
			getFocus : function() {
				var r = this.windowManager.roots.root;
				return (r == null) ? r : r.childs.root || r;
			},
			getWindow : function(x, y) {
				var r = this.windowManager.roots.root;
				while (r != null) {
					var cur = r.childs.root;
					while (cur != null) {
						if (cur.x <= x && cur.y <= y && cur.dx >= x
								&& cur.dy >= y) {
							return cur;
						}
						cur = cur.next;
					}
					if (r.x <= x && r.y <= y && r.dx >= x && r.dy >= y) {
						return r;
					}
					r = r.next;
				}
				return null;
			},
			getContext : function(x, y) {
				if (this.lockScreen.locked) {
					return null;
				}
				var r = this.windowManager.roots.root;
				while (r != null) {
					var cur = r.childs.root;
					while (cur != null) {
						if (cur.x <= x && cur.y <= y && cur.dx >= x
								&& cur.dy >= y) {
							return cur.context;
						}
						cur = cur.next;
					}
					if (r.x <= x && r.y <= y && r.dx >= x && r.dy >= y) {
						return r.context;
					}
					r = r.next;
				}
				return null;
			},
			getBackContext : function(x, y) {
				var first = null;
				if (this.lockScreen.locked) {
					return null;
				}
				var r = this.windowManager.roots.root;
				while (r != null) {
					var cur = r.childs.root;
					while (cur != null) {
						if (cur.x <= x && cur.y <= y && cur.dx >= x
								&& cur.dy >= y) {
							if (first == null) {
								first = cur.context;
							} else {
								return cur.context;
							}
						}
						cur = cur.next;
					}
					if (r.x <= x && r.y <= y && r.dx >= x && r.dy >= y) {
						if (first == null) {
							first = r.context;
						} else {
							return r.context;
						}
					}
					r = r.next;
				}
				return first;
			},

			// 关闭实例，删除所有对象，删除wensocketFactory的注册，触发close、beforedestroy、destroy事件。
			destroy : function() {
				this.fireEvent('beforedestroy', this);
				lib.rdp.Rdp.unregister(this);
				if (this.connecting) {
					this.websocket.send("87");
					this.websocket.close();
				}
				delete this.backImageBuffer;
				this.windowManager.destroy();
				this.fireEvent('destroy', this);
			},
			connecting : false,

			createWebSocket : function() {
				var gw = location.host;
				this.host = location.protocol + "://" + gw;
				if (gw.indexOf(":") != -1) {
					gw = gw.substring(0, gw.indexOf(":"));
				}
				var protocol = ("https:" == location.protocol)
						? "wss://"
						: "ws://";

				var url = protocol + gw + ":8787/rdp?id="
						+ encodeURIComponent(this.integrateId) + "&instanceId="
						+ encodeURIComponent(this.instanceId) + "&width="
						+ this.width + "&height=" + this.height
				if (this.binaryWebSocket) {
					url += "&binary=on"
				}
				var v = lib.rdp.Rdp.createWebSocket(url);
				if (this.binaryWebSocket) {
					v.binaryType = "arraybuffer";
				}
				return v;
			},
			createInputProxy : function(instance) {
				var z = document.createElement("textarea");
				var s = z.style;
				s.resize = "none";
				s.opacity = 0;
				s.position = "absolute";
				s.padding = s.margin = s.border = s.left = s.top = "0";
				s.zIndex = 20;
				s.cursor = "default";
				return z;
			},
			creatWindow : function(id, groupId, parentId, flag) {
				lg("create");
				var win = this.windowManager.get(id);
				if (Ext.isDefined(win))
					return win;
				var config = {
					instance : this,
					id : id,
					groupId : groupId,
					parentId : parentId,
					isModal : (flag & 1) == 1,
					isTop : (flag & 2) != 0,
					flag : flag,
					resizeable : ((flag & 8) == 0),
					renderTo : this.desktopElement
				};
				if (parentId == 0) {
					config.manager = this.windowGroup;
					win = new lib.rdp.SeamlessWindow(config);
				} else {
					config.rootFrame = this.windowManager.getGroupRoot(groupId);
					if (config.rootFrame == null) {
						var p = this.windowManager.get(parentId);
						config.rootFrame = p
								? (p.isRootFrame ? p : p.rootFrame)
								: this.windowManager.roots.root;
					}
					config.rootFrame && (config.renderTo = config.rootFrame.el)
					win = new lib.rdp.SubWindow(config);
				}
				this.windowManager.add(win);
				win.show();
				this.eventManager.bindEvent(win.input);
				return win;
			},
			setDataFromClip : function(a) {
				if (this.prePaste)
					this.websocket.send("5B" + a), this.clipRequired = false;
				this.prePaste = false
			},
			getFile : function(a) {
				this.reconnectOnResize = false;
				window.open(getHost() + "/DOWNLOAD?s=" + this.uuid + "&f=" + a)
			}

		});

lib.rdp.WindowManager = function() {
	this.wins = {};
	this.roots = new lib.rdp.DualwayChain();
	this.groups = {}
	this.counter = 0;
}
lib.rdp.WindowManager.prototype = {

	destroy : function() {
		for (var id in this.wins) {
			this.wins[id].close();
		}
	},
	get : function(id) {
		return this.wins[id];
	},
	getGroupRoot : function(groupId) {
		var r = this.roots.root;
		while (r != null && r.groupId != groupId && (r = r.next));
		return r;
	},
	destroyGroup : function(groupId) {
		var group = this.groups[groupId];
		if (group) {
			for (var winId in group) {
				group[winId].close();
			}
			delete this.groups[groupId];
		}
	},
	add : function(win) {
		this.wins[win.id] = win;
		if (win.groupId) {
			var group = this.groups[win.groupId];
			if (!group)
				group = this.groups[win.groupId] = {};
			group[win.id] = win;
		}
		if (win.isRootFrame) {
			this.roots.add(win);
		}
		if (this.counter++ == 0 && win.instance.connecting) {
			win.instance.websocket.send("1d1");
		}
	},
	remove : function(win) {
		delete this.wins[win.id];
		if (win.groupId) {
			var group = this.groups[win.groupId];
			group && delete group[win.id];
		}
		if (win.isRootFrame) {
			this.roots.remove(win);
		}
		if (--this.counter == 0 && win.instance.connecting) {
			win.instance.websocket.send("1d0");
		}
	}
}
lib.rdp.DualwayChain = function() {
	this.root = null;
}
lib.rdp.DualwayChain.prototype = {
	add : function(node) {
		if (this.root != null) {
			node.next = this.root;
			this.root.prev = node;
		}
		this.root = node;
		node.prev = null;
	},
	toTop : function(node) {
		if (node === this.root)
			return;
		var next = node.next;
		var prev = node.prev;
		prev.next = next;
		if (next != null)
			next.prev = prev;
		node.prev = null;
		node.next = this.root;
		this.root.prev = node;
		this.root = node;
	},
	remove : function(node) {
		if (node.prev == null) {
			this.root = node.next;
			if (this.root != null) {
				this.root.prev = null;
				node.next = null;
			}
		} else if (node.next == null) {
			node.prev.next = null;
			node.prev = null;
		} else {
			var prev = node.prev;
			prev.next = node.next;
			node.next.prev = prev;
			node.prev = node.next = null;
		}
	}
}

lib.rdp.EventManager = function(instance) {
	var h = instance;
	var p = true;// !readOnly

	// touch的局部变量，暂缓处理
	var imgCursor = null, touchFocusElement = null;
	var q = -1, priorY = -1, touchStartX = -1, touchStartY = -1;
	var B = 0, J = false, K = 1, L = -1 != navigator.platform.indexOf("Mac"), H = 0, X = 0;
	var endTime = 0, isDrag = false;
	// ////////////////////////////////////////////////////////////////////////////////

	function addInputEvent(a) {
		Ext.isFirefox || Ext.isOpera ? a.addEventListener("input",
				inputEventHandler, false) : a.addEventListener("textInput",
				textInputEventHandler, false)
	}

	function showKeyBoard() {
		touchFocusElement.focus()
	}

	function stopEvent(a) {
		a.stopPropagation && a.stopPropagation();
		a.preventDefault && a.preventDefault();
		return false
	}
	function moveTouchPointerTo(a, b) {
		var d = imgCursor.scrX + a, c = imgCursor.scrY + b;
		0 > d ? d = 0 : d > instance.width && (d = instance.width - 1);
		0 > c ? c = 0 : c > instance.height && (c = instance.height - 1);
		imgCursor.scrX = d;
		imgCursor.scrY = c;
		imgCursor.style.left = h.x + d - imgCursor.hotX + "px";
		imgCursor.style.top = h.y + c - imgCursor.hotY + "px";
		h.websocket.send("82" + d + "\t" + c)
	}
	function touchEventHandler(a) {
		if (p) {
			var b = a.touches.length, d = 1 == b
					? a.touches[0]
					: a.changedTouches[0], c = d.pageX - h.x;
			var y = d.pageY - h.y;
			d = a.type;
			if (h.isTouchpad) {
				var b = c, c = y, f = 0;
				switch (d) {
					case "touchstart" :
						B = (new Date).getTime();
						endTime = 0;
						isDrag = false;
						touchStartX = b;
						touchStartY = c;
						-1 == q
								&& moveTouchPointerTo(b - 50 - imgCursor.scrX,
										c - 50 - imgCursor.scrY);
						break;
					case "touchmove" :
						0 == endTime
								&& (endTime = (new Date).getTime(), f = endTime
										- B, 180 < f && (isDrag = true), isDrag
										&& h.websocket.send("80"
												+ imgCursor.scrX + "\t"
												+ imgCursor.scrY + "\t0"));
						moveTouchPointerTo(b - q, c - priorY);
						break;
					case "touchend" :
						f = (new Date).getTime() - B, 0 == endTime
								? 500 > f
										? (h.websocket.send("80"
												+ imgCursor.scrX + "\t"
												+ imgCursor.scrY + "\t0"), h.websocket
												.send("81" + imgCursor.scrX
														+ "\t" + imgCursor.scrY
														+ "\t0"))
										: (h.websocket.send("80"
												+ imgCursor.scrX + "\t"
												+ imgCursor.scrY + "\t2"), h.websocket
												.send("81" + imgCursor.scrX
														+ "\t" + imgCursor.scrY
														+ "\t2"))
								: h.send("81" + imgCursor.scrX + "\t"
										+ imgCursor.scrY + "\t0")
				}
				q = b;
				priorY = c
			} else
				switch (d) {
					case "touchstart" :
						// canvasDom.focus();
						d = (new Date).getTime();
						J = -1 < q && 300 > d - B;
						J || (q = c, priorY = y);
						B = (new Date).getTime();
						K = b;
						break;
					case "touchmove" :
						if (1 < K) {
							if (2 != b)
								return;
							h.websocket.send("83" + c + "\t" + y + "\t"
									+ (y > priorY ? 0 : 1));
							q = c;
							priorY = y;
							break
						}
						-1 < q
								&& (h.websocket.send("80" + q + "\t" + priorY
										+ "\t0"), q = -1);
						h.websocket.send("82" + c + "\t" + y);
						break;
					case "touchend" :
						if (1 < K)
							return;
						if (-1 == q) {
							h.websocket.send("81" + c + "\t" + y + "\t0");
							return
						}
						300 > (new Date).getTime() - B ? (J
								&& (c = q, y = priorY), h.websocket.send("80"
								+ c + "\t" + y + "\t0"), h.websocket.send("81"
								+ c + "\t" + y + "\t0")) : (h.send("80" + c
								+ "\t" + y + "\t2"), h.websocket.send("81" + c
								+ "\t" + y + "\t2"))
				}
			stopEvent(a)
		}
	}
	function unitize(a) {
		if (Ext.isFirefox) {
			switch (a) {
				case 109 :
					return 189;
				case 107 :
					return 187;
				case 59 :
					return 186;
				case 61 :
					return L ? 187 : 61;
				case 220 :
					return L ? 222 : 220;
				case 222 :
					return L ? 192 : 222;
				case 224 :
					return 17
			}
			return a
		}
		if (Ext.isOpera) {
			switch (a) {
				case 59 :
					return 186;
				case 61 :
					return 187;
				case 109 :
					return 189;
				case 219 :
					return 91;
				case 57351 :
					return 93
			}
			return a
		}
		return 91 == a || 93 == a ? 17 : a
	}
	function textAreaKey(a) {
		var b = a.keyCode, d = "keydown" == a.type;
		if (17 == b)
			a.altKey || sendScanCode(d, 29);
		else if (18 == b)
			a.ctrlKey
					|| (sendScanCode(d, 56), sendScanCode(false, 56), sendScanCode(
							false, 29));
		else if (!a.ctrlKey || !a.altKey) {
			var b = unitize(b), c = convertFunctionKey(b);
			if (0 < c)
				return sendScanCode(d, c), stopEvent(a);
			if (a.ctrlKey || a.altKey)
				return sendKeyCode(d, b), d && (H = b), stopEvent(a);
			if (b == H && !d)
				return sendKeyCode(false, b), H = 0, stopEvent(a);
			H = 0
		}
	}
	function textareaKey2(a) {
		if (p) {
			var b = a.keyCode, d = "keydown" == a.type, c;
			a : if (a.altKey) {
				switch (b) {
					case 35 :
						if (!a.ctrlKey) {
							c = false;
							break a
						}
						sendScanCode(d, 83);
						break;
					case 33 :
						sendScanCode(d, 15);
						break;
					case 34 :
						d
								? (sendScanCode(true, 42), sendScanCode(true,
										15))
								: (sendScanCode(false, 15), sendScanCode(false,
										42));
						break;
					case 45 :
						sendScanCode(d, 1);
						break;
					case 36 :
						d
								? (sendScanCode(false, 56), sendScanCode(true,
										29), sendScanCode(true, 1))
								: (sendScanCode(false, 1), sendScanCode(false,
										29));
						break;
					default :
						c = false;
						break a
				}
				c = true
			} else
				c = false;
			if (c)
				return stopEvent(a);
			if (229 <= b)
				d && a.ctrlKey ? sendScanCode(true, 29) : sendScanCode(false,
						29);
			else if (!(1 > b)) {
				b = unitize(b);
				if (handleShortcutKeys(b, d))
					return stopEvent(a);
				c = convertFunctionKey(b);
				0 < c ? sendScanCode(d, c) : sendKeyCode(d, b);
				d && a.altKey && 31 < b
						&& (sendKeyCode(false, b), sendScanCode(false, 56));
				if (17 == b || (a.ctrlKey || a.metaKey)
						&& (86 == b || 67 == b || 88 == b)) {
					if (d && 67 == b) {
						var f = h.getFocus().input;
						f.value = "A", f.select();
					}
					return true
				}
				return 144 == b ? false : stopEvent(a)
			}
		}
	}
	function touchDivKey(a) {
		if (p) {
			var b = unitize(a.keyCode), d = "keydown" == a.type;
			if (!handleShortcutKeys(b, d)) {
				if (13 == b)
					a.target.value = "";
				b = convertFunctionKey(b);
				if (-1 == b)
					return true;
				sendScanCode(d, b)
			}
			return stopEvent(a)
		}
	}
	function textInputEventHandler(a) {
		if (p)
			return h.websocket.send("86" + a.data), a.target.value = "", stopEvent(a)
	}
	function inputEventHandler(a) {
		if (p)
			return lg("---fox input:" + a.target.value), h.websocket.send("86"
					+ a.target.value), a.target.value = "", stopEvent(a)
	}
	function textareaPaste(a) {
		if (!p)
			return stopEvent(a);
		h.prePaste = true;
		if ("clipboardData" in a)
			return h.setDataFromClip(a.clipboardData.getData("text/plain")), stopEvent(a);
		var b = a.target, d = b.value;
		Ext.isFirefox || Ext.isOpera ? b.removeEventListener("input",
				inputEventHandler, false) : b.removeEventListener("textInput",
				textInputEventHandler, false);
		var c = function() {
			b.value == d
					? setTimeout(c, 5)
					: (h.setDataFromClip(b.value), b.value = "", addInputEvent(b))
		};
		setTimeout(c, 5)
	}
	function textareaCopy(a) {
		if (p) {
			if (h.fastCopy) {
				var b = (new Date).getTime(), d = b - X;
				X = b;
				if (500 < d)
					return
			}
			a.target.value = lib.rdp.Clipboard.getFromServer(h);
			a.target.select();
			setTimeout(function() {
						h.getFocus().input.value = ""
					}, 555)
		}
	}
	function handleShortcutKeys(a, b) {
		if (44 == a)
			return sendScanCode(true, 170), sendScanCode(true, 183), true;
		return 19 == a
				? (b
						? (sendScanCode(true, 225), sendScanCode(true, 29), sendScanCode(
								true, 69), sendScanCode(true, 225), sendScanCode(
								true, 157), sendScanCode(true, 197))
						: sendScanCode(false, 29), true)
				: false
	}
	function sendScanCode(a, b) {
		h.connecting && h.websocket.send("84" + (a ? 0 : 49152) + "\t" + b)
	}
	function sendKeyCode(a, b) {
		h.connecting && h.websocket.send("8B" + (a ? 0 : 49152) + "\t" + b)
	}
	function mouseDown(a) {
		a.target.focus();
		h.mousedown = true;
		h.lockScreen.beginX = a.pageX;
		h.lockScreen.beginY = a.pageY;
		if (p && h.connecting) {
			var b = a.pageX - h.x, d = a.pageY - h.y;
			return h.websocket.send("80" + b + "\t" + d + "\t" + a.button), stopEvent(a)
		}
	}
	function mouseMove(a) {
		if (h.lockScreen.locked === false) {
			if (h.mousedown === true) {
				var s = h.lockScreen;
				s.lastX = a.pageX;
				s.lastY = a.pageY;
				if (s.win == null) {
					s.win = h.getWindow(s.lastX, s.lastY);
					// s.ptz = s.win.context.getImageData(0, 0, s.win.width,
					// s.win.height);
				}
			}
			if (p && h.connecting) {
				h.websocket.send("82" + (a.pageX - h.x) + "\t"
						+ (a.pageY - h.y));
				stopEvent(a);
			}
		}
		return false;
	}

	function mouseUp(a) {
		h.mousedown = false;
		if (h.lockScreen.win != null) {
			h.lockScreen.lastX = -1;
			// h.lockScreen.ptz = null;
			h.lockScreen.win = null;
		}
		if (p && h.connecting)
			return h.websocket.send("81" + (a.pageX - h.x) + "\t"
					+ (a.pageY - h.y) + "\t" + a.button), stopEvent(a)
	}
	function mouseWheel(a) {
		if (p && h.connecting) {
			var b = a.pageX - h.x, d = a.pageY - h.y, c = "1";
			a.wheelDelta ? 0 < a.wheelDelta && (c = "0") : a.detail
					&& 0 > a.detail && (c = "0");
			h.websocket.send("83" + b + "\t" + d + "\t" + c);
			return false
		}
	}
	function convertFunctionKey(a) {
		switch (a) {
			case 33 :
				return 201;
			case 34 :
				return 209;
			case 35 :
				return 207;
			case 36 :
				return 199;
			case 37 :
				return 203;
			case 38 :
				return 200;
			case 39 :
				return 205;
			case 40 :
				return 208;
			case 154 :
				return 183;
			case 45 :
				return 210;
			case 46 :
				return 211;
			case 65406 :
				return 184;
			case 91 :
				return 91;
			case 93 :
				return 93;
			case 27 :
				return 1;
			case 8 :
				return 14;
			case 9 :
				return 15;
			case 13 :
				return 28;
			case 224 :
			case 17 :
				return 29;
			case 16 :
				return 54;
			case 18 :
				return 56;
			case 20 :
				return 58;
			case 112 :
				return 59;
			case 113 :
				return 60;
			case 114 :
				return 61;
			case 115 :
				return 62;
			case 116 :
				return 63;
			case 117 :
				return 64;
			case 118 :
				return 65;
			case 119 :
				return 66;
			case 120 :
				return 67;
			case 121 :
				return 68;
			case 122 :
				return 87;
			case 123 :
				return 88;
			case 144 :
				return 69;
			case 145 :
				return 70
		}
		return -1
	}
	function createImage(a) {
		return "url(" + a.data + ") " + a.hotX + " " + a.hotY + ", default"
	}
	var ba = {
		"&euro;" : "\ufffd",
		"&nbsp;" : " ",
		"&quot;" : '"',
		"&amp;" : "&",
		"&lt;" : "<",
		"&gt;" : ">",
		"&iexcl;" : "\ufffd",
		"&cent;" : "\ufffd",
		"&pound;" : "\ufffd",
		"&curren;" : "\ufffd",
		"&yen;" : "\ufffd",
		"&brvbar;" : "\ufffd",
		"&sect;" : "\ufffd",
		"&uml;" : "\ufffd",
		"&copy;" : "\ufffd",
		"&ordf;" : "\ufffd",
		"&reg;" : "\ufffd"
	}
	function showPDF(a) {
		var b = document.createElement("div");
		b.style.backgroundColor = "white";
		b.style.width = Ext.isTouch ? "30%" : "95%";
		b.style.height = Ext.isTouch ? "4elm" : "90%";
		b.innerHTML = Ext.isTouch
				? '<p style="text-align:center;line-height:4em"><a href="' + a
						+ '" target="_blank">Your document is ready.</a></p>'
				: '<iframe src="'
						+ a
						+ '" width="100%" height="100%"><html><body marginwidth="0" marginheight="0"><embed width="100%" height="100%" name="plugin" src="'
						+ a
						+ '" type="application/pdf"></body></html></iframe>';
		document.documentElement.appendChild(b);
		(new hi5.Lightbox(b)).show()
	}

	function setTouchpad(a) {
		if (h.isTouchpad = a) {
			if (!imgCursor)
				imgCursor = document.createElement("img"), imgCursor.alt = "+", imgCursor.style.position = "absolute", imgCursor.style.left = 90, imgCursor.style.top = 90, imgCursor.scrX = 0, imgCursor.scrY = 0, imgCursor.hotX = 0, imgCursor.hotY = 0, document.documentElement
						.appendChild(imgCursor), console
						.log("imgCursor: enabled")
		} else
			imgCursor && document.documentElement.removeChild(imgCursor)
	}

	return {
		bindEvent : function(f) {
			f.addEventListener("mousemove", mouseMove, false);
			f.addEventListener("mousedown", mouseDown, false);
			f.addEventListener("mouseup", mouseUp, false);
			f.addEventListener("mousewheel", mouseWheel, true);
			f.addEventListener("DOMMouseScroll", mouseWheel, true);
			f.addEventListener("paste", textareaPaste, false);
			f.addEventListener("copy", textareaCopy, false);
			f.addEventListener("cut", textareaCopy, false);
			f.onkeydown = textareaKey2;
			f.onkeyup = textareaKey2;
			f.oncontextmenu = function() {
				return false
			};
			addInputEvent(f);
			f.focus();
		}

	}

}

lib.rdp.ScreenLock = function(instance) {
	this.instance = instance;
	this.initProxy();
}
lib.rdp.ScreenLock.prototype = {
	move : true,
	locked : false,
	win : null,
	ps : null,
	beginX : 0,// 鼠标mousedown时位置
	beginY : 0,// 鼠标mousedown时位置
	lastX : -1,// 鼠标mousemove时位置
	lastY : -1,// 鼠标mousemove时位置
	dx : 0,// 移动偏移量
	dy : 0,// 移动偏移量

	initProxy : function() {
		this.ps = this.proxy.dom.style;
	},
	moveWindow : function(a) {
		this.ps.left = a.xy[0] - this.dx;
		this.ps.top = a.xy[1] - this.dy;
		a.stopPropagation && a.stopPropagation();
		a.preventDefault && a.preventDefault();
	},
	mouseup : function(a) {
		var h = this.instance;
		h.mousedown = false;
		h.websocket.send("81" + (a.xy[0] - h.x) + "\t" + (a.xy[1] - h.y) + "\t"
				+ a.button);
		var w = this.win;
		var box = {
			x : a.xy[0] - this.dx,
			y : a.xy[1] - this.dy,
			width : w.width,
			height : w.height
		};
		this.win.updateBox(box);
		this.instance.websocket.send("8c" + w.id + "\t" + box.x + "\t" + box.y
				+ "\t" + box.width + "\t" + box.height)
		Ext.EventManager.un(window, "mousemove", this.moveWindow, this);
		Ext.EventManager.un(window, "mouseup", this.mouseup, this);
		a.stopPropagation && a.stopPropagation();
		a.preventDefault && a.preventDefault();
	},
	showProxy : function(box) {
		this.ps.top = box.y;
		this.ps.left = box.x;
		this.ps.width = box.width - 4;
		this.ps.height = box.height - 4;
		this.ps.display = "block";
		this.win.el.dom.style.display = "none";
		Ext.EventManager.on(window, "mousemove", this.moveWindow, this);
		Ext.EventManager.on(window, "mouseup", this.mouseup, this);
	},
	lock : function() {
		this.locked = true;
		var box = this.win.getBox();
		this.dx = this.beginX - box.x;
		this.dy = this.beginY - box.y;
		this.showProxy({
					x : this.lastX - this.dx,
					y : this.lastY - this.dy,
					width : box.width,
					height : box.height
				});
		// this.repaintAll();
	},
	unlock : function() {
		this.win.el.dom.style.display = "block";
		this.ps.display = "none";
		this.lastX = -1;
		this.win.instance.repaintAll(300);
		this.win = null;
		this.locked = false;
	}

};

lib.rdp.UploadManager = function(a) {
	var b = {}, d = 0;
	this.read = function(c, f, e) {
		var j = instance.getFocused().fileProgress, k = b[c];
		if ("undefined" != typeof k) {
			var l = k.name;
			1 > k.size
					? Ext.msg("ERROR", "File size is 0, ignored " + l)
					: (k = k.slice(f, f + e), l = new FileReader, l.onloadend = function(
							b) {
						b.target.readyState == FileReader.DONE
								&& (b = new Uint8Array(b.target.result), a
										.send(c, f, e, b), d += e, j
										.setProgress(d))
					}, l.readAsArrayBuffer(k))
		}
	};
	this.addFile = function(c) {
		if (!("slice" in c)
				&& (c.slice = c.webkitSlice || c.mozSlice, !("slice" in c))) {
			Ext.msg("ERROR", "FileReader doesn't support slice");
			return
		}
		var d = instance.getFocused().fileProgress;
		if ("none" == d.style.display)
			d.style.display = "block";
		var e = c.name;
		b[e] = c;
		d.maxValue += c.size;
		a.start(e, c.size)
	};
	this.confirmId = function(a, d) {
		b[a] = b[d]
	};
	this.close = function(a) {
		var f = instance.getFocused(), e = f.fileProgress, j = b[a];
		j && (delete b[a], delete b[j.name]);
		for (var k in b)
			return;
		d = e.maxValue = 0;
		e.style.display = "none";
		Ext
				.msg("INFO",
						"File uploading finished. Please refresh the shared disk in My Computer.")
	}
};
lib.rdp.ImageBuffer = function(instance, a, b) {
	var d = Array(a * b), c = false;
	this.getBuffer = function() {
		return d
	};
	this.setRGB = function(b, c, t) {
		d[c * a + b] = t
	};
	this.getRGB = function(b, c) {
		return d[c * a + b]
	};
	this.setRGBs = function(b, c, t, k, l, g, h) {
		for (var m = 0, t = b + t, k = c + k; c < k; c++, g += h)
			for (var m = g, f = b; f < t; f++)
				d[c * a + f] = l[m++]
	};
	this.copyArea = function(b, e, t, k, l, g) {
		for (var h = this.getRGBs(b, e, t, k), l = b + l, g = e + g, m = g * a
				+ l, f = h.length, n = a - t + 1, j = t - 1, p = 0; p < f; p++)
			d[m] = h[p], p % t != j ? m++ : m += n;
		h = instance.getContext(b, e);
		m = instance.getContext(l, g);
		null != m
				&& null != h
				&& m.putImageData(h.getImageData(b - h.offsetX, e - h.offsetY,
								t, k), l - m.offsetX, g - m.offsetY);
		c = true
	};
	this.getRGBs = function(b, c, t, k) {
		for (var b = c * a + b, k = t * k, c = a - t + 1, l = t - 1, g = Array(k), h = 0; h < k; h++)
			g[h] = d[b], h % t != l ? b++ : b += c;
		return g
	};
	var _getImageData = function(b, c, t, k, l) {
		for (var b = b.createImageData(k, l), g = b.data, c = t * a + c, l = k
				* l, t = a - k + 1, h = k - 1, m = 0; m < l; m++) {
			var f = d[c], n = m << 2;
			g[n] = f >> 16 & 255;
			g[n + 1] = f >> 8 & 255;
			g[n + 2] = f & 255;
			g[n + 3] = 255;
			m % k != h ? c++ : c += t
		}
		return b
	};
	this.g = function(b, c, t, k, l) {
		return _getImageData(b, c, t, k, l);
	}
	this.repaint = function(x, y, width, height, context) {
		if (!c) {
			var l = context || instance.getContext(x, y);
			null != l
					&& l.putImageData(_getImageData(l, x, y, width, height), x
									- l.offsetX, y - l.offsetY)
		}
		c = false
	};
	this.fillRect = function(b, c, t, k, l) {
		for (var b = c * a + b, k = t * k, c = a - t + 1, g = t - 1, h = 0; h < k; h++)
			d[b] = l, h % t != g ? b++ : b += c
	}
	this.putImageData = function(imageData, x, y) {
		for (var t = imageData.data, width = imageData.width, x = y * a + x, height = width
				* imageData.height, y = a - width + 1, g = width - 1, h = 0, p = 0; h < height; h++) {
			p = h << 2;
			d[x] = 4278190080 | (t[p] & 255) << 16 | (t[p + 1] & 255) << 8
					| (t[p + 2] & 255);
			h % width != g ? x++ : x += y
		}
	}

}
lib.rdp.Resizer = Ext.extend(Ext.Resizable, {
			minWidth : 100,
			minHeight : 100,
			handles : 'all',
			pinned : false,
			transparent : true,
			handleCls : 'x-window-handle',
			constructor : function(win, config) {
				this.win = win;
				lib.rdp.Resizer.superclass.constructor.call(this, win.el,
						config);
			},
			startSizing : function(e, handle) {
				lib.rdp.Resizer.superclass.startSizing.call(this, e, handle);
				this.win.el.dom.style.display = "none";
				if (!this.overlay.disableContextmenu) {
					this.overlay.swallowEvent("contextmenu", true);
					this.overlay.disableContextmenu = true;
				}
			},
			resizeElement : function() {
				var box = this.proxy.getBox();
				var cbox = this.win.getBox();
				if (box.x != cbox.x || box.y != cbox.y
						|| box.width != cbox.width || box.height != cbox.height) {
					this.win.instance.websocket.send("8c" + this.win.id + "\t"
							+ box.x + "\t" + box.y + "\t" + box.width + "\t"
							+ box.height)
					this.win.updateBox(box, true);
					this.win.instance.repaintAll(100);
				}
				this.win.el.dom.style.display = "block";
				return box;
			},
			onMouseUp : function(e) {
				this.activeHandle = null;
				var size = this.resizeElement();
				this.resizing = false;
				this.handleOut();
				this.overlay.hide.defer(200, this.overlay);
				this.proxy.hide.defer(200, this.proxy);
				this.fireEvent('resize', this, size.width, size.height, e);
			}

		});

lib.rdp.Splash = {
	shown : false,
	value : 0,
	packin : false,
	config : {
		title : '正在载入远程应用程序...'.loc(),
		width : 300,
		progress : true,
		closable : false
	},
	show : function(instance) {
		this.instance = instance;
		lib.rdp.Protocol.updateSplash = this.shown = true;
		Ext.MessageBox.show(this.config);
		this.checkNumber = this.check.defer(5000, this);
	},
	check : function() {
		if (this.packin === true) {
			this.packin = false;
			this.checkNumber = this.check.defer(5000, this);
		} else {
			this.instance.destroy();
			this.hide();
			Ext.msg("ERROR", '连接超时,请稍后重试.'.loc());
		}
	},
	increase : function() {
		if (this.shown === true) {
			Ext.MessageBox.updateProgress(this.value += 0.028);
			this.packin = true;
		}
	},
	hide : function() {
		if (this.shown === true) {
			this.instance = null;
			clearTimeout(this.checkNumber);
			lib.rdp.Protocol.updateSplash = this.shown = false;
			this.value = 0;
			Ext.MessageBox.hide();
		}
	}
}
lib.rdp.Splash.config.animEl = lib.rdp.Rdp.desktopElement;

lib.rdp.Clipboard = {
	data : "",
	createClipboardDiv : function() {
		var a = document.createElement("div");
		a.contentEditable = "true";
		a.style.position = "absolute";
		a.style.zIndex = 89;
		a.style.left = 0;
		a.style.top = 0;
		a.tabIndex = 1;
		a.style.outline = "none";
		a.style.opacity = 0;
		Ext.getBody().appendChild(a);
		return a
	},
	onWindowFocus : function() {
		this.getFromLocal(function(data) {
					this.data = data;
				})
	},
	sync : function(data, instance) {
		var p = lib.rdp.Rdp.pool;
		var c = instance ? instance.id : null;
		for (var i in p) {
			i != c && p[i].isConnecting && p[i].setClipData(this.data);
		}
	},
	getFromServer : function(instance) {
		if (!instance.connecting)
			return "";

		var a = instance.host + "/CLIP?s=" + instance.uuid + "&t="
				+ (new Date).getTime();
		var b = new XMLHttpRequest;
		b.open("GET", a, false);
		b.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
		b.send(null);
		return b.responseText;
	},
	copyToLocal : function(data, callbackFn, scope) {
		var b = this.createClipboardDiv();
		try {
			if (Ext.isChrome) {
				b.innerHTML = '<embed src="/lib/rdp/_clipboard.swf" FlashVars="clipboard='
						+ encodeURIComponent(data)
						+ '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
			} else {
				"innerText" in b ? b.innerText = data : b.innerHTML = data
						.replace(/\r\n/g, "<br/>");
				b.focus();
				document.execCommand("selectAll", false, null);
				document.execCommand("copy", false, null)
			}
			if (callbackFn) {
				callbackFn.call(scope || window);
			}
		} finally {
			// b.parentNode.removeChild(b), window.scrollTo(0, 0)
		}
	},
	htmlToText : function(a) {
		a = a.replace(/<br\/?>/gi, "\r\n").replace(/(<([^>]+)>)/gi, "");
		return a.replace(/&[^;]+;/gi, function(a) {
					return ba[a] || a
				})
	},
	getFromLocal : function(callbackFn, scope) {
		var s = function() {
			// h.websocket.send("880");
			var a = this.createClipboardDiv();
			try {
				a.focus();
				document.execCommand("paste", false, null);
				var d = "";
				"innerText" in a ? d = a.innerText : (d = a.innerHTML, d = this
						.htmlToText(d));
				0 < d.length && callbackFn.call(scope, d);
			} finally {
				a.parentNode.removeChild(a)// , f.focus()
			}
		}
		s.defer(3, this);
	}
};