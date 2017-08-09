/**
 * 缓存Panel,Ext.Panel的子类，layout固定为'card'
 * <p>
 * 可以将cached属性为true的Panle切换到后台而不删除。用setActivePanel还可以将其换至前台。
 * <p>
 * Panel中内置statusBar属性，可以在Panel下方显示状态栏。
 * 
 * @author TIANZHOU
 * @date 2008-7-15
 * 
 */
Ext.namespace("lib.CachedPanel");

using("lib.statusbar.StatusBar");

lib.CachedPanel.CachedPanel = Ext.extend(Ext.Panel, {

			cachedAttributeName : 'cached',

			layoutOnActivePanelChange : true,
			/**
			 * 是否有状态栏,默认情况下不提供状态栏（不初始化一个状态栏对象）。
			 * 
			 * @type Boolean
			 */
			statusBar : false,
			/**
			 * 状态栏配置信息。大部分和Ext.ToolBar的配置属性相同，另外增加了三个常用属性。
			 * <p>
			 * hidden {boolean} 状态栏在初始化时是否显示
			 * <p>
			 * statusDefine {Array} 状态栏右侧信息栏的标题，有几个标题就有几个信息栏
			 * <p>
			 * statusValue {Array} 状态栏的值，变长数组，第一个值填写在状态栏的最左侧，
			 * <p>
			 * 其余值顺序往右测的信息栏填写，如果给的值比信息栏所需要的值少，则只更新给定的值
			 * 
			 * @type Object
			 */
			statusConfig : {},

			deferredRender : true,

			bodyStyle : 'background-color:white',

			initComponent : function() {
				this.frame = false;
				if (this.statusBar) {
					this.bbar = new lib.CachedPanel.CachedPanel.StatusBar(Ext
							.applyIf(this.statusConfig, {
										owner : this,
										statusDefine : ["ID", '修改者'.loc(), '修改时间'.loc()]
									}));
				}
				delete this.layout;
				lib.CachedPanel.CachedPanel.superclass.initComponent.call(this);
				this.addEvents(
						/**
						 * @event beforeactivepanelchange panel变换之前触发事件.
						 * @param {CachedPanel}
						 *            this
						 * @param {Panel}
						 *            即将激活变为前台的panel
						 * @param {Panel}
						 *            当前panel
						 */
						'beforeactivepanelchange',
						/**
						 * @event activepanelchange在激活Panel变换后触发
						 * @param {CachedPanel}
						 *            this
						 * @param {Panel}
						 *            activepanel 已经激活的activepanel
						 */
						'activepanelchange');
				this.setLayout(new Ext.layout.CardLayout(Ext.apply({
							layoutOnCardChange : this.layoutOnActivePanelChange,
							deferredRender : this.deferredRender
						}, this.layoutConfig)));
				this.initItems();
			},
			afterRender : function() {
				lib.CachedPanel.CachedPanel.superclass.afterRender.call(this);
				if (this.activePanel !== undefined) {
					var item = Ext.isObject(this.activePanel)
							? this.activePanel
							: this.items.get(this.activePanel);
					delete this.activePanel;
					this.setActivePanel(item);
				}
			},
			/**
			 * 根据目标上的一个属性和对应的值查找子Panel.可以返回多个panel
			 * 
			 * @param {String}
			 *            prop 属性名称.
			 * @param {Mixed}
			 *            value 属性对应的值.
			 * @return {Mixed} 查找子Panel.可以返回多个panel
			 */
			findPanel : function(prop, value) {
				return this.findBy(function(c) {
							return c[prop] === value;
						});
			},
			/**
			 * 查找是否有符合条件的Panel，返回布尔值
			 * <p>
			 * 传入参数如果是一个Panel对象，则判断这个Panel是不是当前Panel的子Panel<br>
			 * 传入参数如果是一个字符串，则判断是否有Panel的名称或id等于这个字符串
			 * 
			 * @param {Mixed}
			 *            子Panel的名称，id或者对象引用。.
			 * @return {boolean} 是否有符合条件的Panel
			 */
			havePanel : function(mixed) {
				return Ext.isDefined(this.getPanel(mixed));
			},
			/**
			 * 查找符合条件的Panel，返回第一个符合条件的Panel
			 * <p>
			 * 传入参数如果是一个Panel对象，则判断这个Panel是不是当前Panel的子Panel<br>
			 * 传入参数如果是一个字符串，则判断是否有Panel的名称或id等于这个字符串
			 * 
			 * @param {Mixed}
			 *            子Panel的名称，id或者对象引用。.
			 * @return {boolean} 返回第一个符合条件的Panel
			 */
			getPanel : function(mixed) {
				var q;
				if (Ext.isObject(mixed)) {
					this.items.each(function(v) {
								if (v == mixed) {
									q = v;
									return false;
								}
							})
				} else {
					this.items.each(function(v) {
								if (v.name == mixed || v.id == mixed) {
									q = v;
									return false;
								}
							})
				}
				return q;
			},
			/**
			 * 设置激活Panel,只有激活的Panel会显示，未激活的Panel会被直接删除或缓存起来。
			 * 
			 * @param {Mixed}
			 *            子Panel的名称、id或者对象引用。.
			 */
			setActivePanel : function(item) {
				item = this.getPanel(item);
				if (this.fireEvent('beforeactivepanelchange', this, item,
						this.activePanel) === false) {
					return;
				}
				if (!this.rendered) {
					this.activePanel = item;
					return;
				}
				if (this.activePanel != item) {
					if (item) {
						var it = this.activePanel;
						this.activePanel = item;
						this.layout.setActiveItem(item);
						if (Ext.isObject(it)
								&& it[this.cachedAttributeName] != true) {
							this.remove(it, true);
						}
					}
					this.fireEvent('activepanelchange', this, item);
				}
			},
			/**
			 * 获取激活的Panel
			 * 
			 * @return {boolean} 返回激活的Panel
			 */
			getActivePanel : function() {
				return this.activePanel;
			},
			/**
			 * 获取当前的状态栏对象。
			 * <p>
			 * 对状态栏的操作请调用此对象,兼容的方法以后会删除。如果要隐藏或显示状态栏，在获取状态栏对象后，调用show或者hide方法
			 * <p>
			 * 要设置状态栏的值，请调用状态栏对象的setValue方法。
			 * 
			 * @return {boolean} 返回状态栏对象
			 */
			getStatusBar : function() {
				return (this.statusBar) ? this.bottomToolbar : undefined;
			},
			beforeDestroy : function() {
				delete this.activePanel;
				lib.CachedPanel.CachedPanel.superclass.beforeDestroy
						.apply(this);
			},
			// 兼容旧CachedPanel。
			setActiveTab : function(item) {
				this.setActivePanel(item);
			},
			hideStatus : function() {
				this.statusBar && this.bottomToolbar.hide();
			},
			showStatus : function() {
				this.statusBar && this.bottomToolbar.show();
			},
			setStatusValue : function(arr) {
				this.statusBar && this.bottomToolbar.setValue(arr);
			}
		});
Ext.reg('cachedpanel', lib.CachedPanel.CachedPanel);
lib.CachedPanel.CachedPanel.StatusBar = Ext.extend(Ext.ux.StatusBar, {

	/**
	 * 状态栏右侧信息栏的标题,数组类型，初始化时更据标题配置信息栏。
	 * 
	 * @type Array
	 */
	statusDefine : null,
	/**
	 * 状态栏的初始值,数组类型，第一个值会显示在状态栏左侧。后面的值会顺序显示在各信息栏上
	 * <p>
	 * 可以一次只设置部分信息栏的值，也可以只设置左侧信息。
	 * 
	 * @type Array
	 */
	statusValue : null,
	/**
	 * 隐藏当前的状态栏对象
	 */
	hide : function() {
		if (!this.hidden) {
			this.owner.bbar.hide();
			this.owner.syncHeight();
			this.hidden = true;
		}
	},
	/**
	 * 显示当前的状态栏对象。
	 */
	show : function() {
		if (this.hidden) {
			this.owner.bbar.show();
			this.owner.syncHeight();
			this.hidden = false;
		}
	},
	/**
	 * 设置当前的状态栏对象的值。
	 * 
	 * @param arr{Array}
	 *            数组类型，第一个值会显示在状态栏左侧。后面的值会顺序显示在各信息栏上
	 *            <p>
	 *            可以一次只设置部分信息栏的值，也可以只设置左侧信息。
	 */
	setValue : function(arr) {
		if (!Ext.isArray(arr))
			return;
		var len = this.statusDefine.length;
		if (len > arr.length - 1)
			len = arr.length - 1;
		for (var i = 0; i < len; i++) {
			Ext.fly(this.cells[i].getEl()).update(this.statusDefine[i] + ": "+ arr[i + 1]);
		}
		if (arr.length > 0)
			this.setText(arr[0]);
	},
	onHide : Ext.emptyFn,
	onRender : function(ct, position) {
		ct.setVisibilityMode(Ext.Element.DISPLAY);
		this.hidden && ct.hide();
		lib.CachedPanel.CachedPanel.StatusBar.superclass.onRender.call(this,
				ct, position);

	},
	afterRender : function() {
		lib.CachedPanel.CachedPanel.StatusBar.superclass.afterRender.call(this);
		for (var i = 0; i < this.statusDefine.length; i++) {
			Ext.fly(this.cells[i].getEl().parent())
					.addClass('x-status-text-panel');
		}
	},
	beforeDestroy : function() {
		this.owner = null;
		this.statusDefine = null;
		this.statusValue = null;
		this.cells = null;
		lib.CachedPanel.CachedPanel.StatusBar.superclass.beforeDestroy
				.apply(this);
	},
	initComponent : function() {
		this.items = new Array();
		this.cells = new Array();
		var haveVal = Ext.isArray(this.statusValue);
		for (var i = 0; i < this.statusDefine.length; i++) {
			var msg = this.statusDefine[i] + ": ";
			if (haveVal && Ext.isDefined(this.statusValue[i + 1])) {
				msg += this.statusValue[i + 1];
			}
			this.items.push(this.cells[i] = new Ext.Toolbar.TextItem(msg));
			this.items.push(' ');
		}
		lib.CachedPanel.CachedPanel.StatusBar.superclass.initComponent
				.call(this);

		if (haveVal)
			this.setText(this.statusValue[0]);
	}
});
