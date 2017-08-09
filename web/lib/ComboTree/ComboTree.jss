Ext.namespace('lib.ComboTree');
/**
 * 支持单选的下拉列表树，用法如下：
 * 
 * 
 * */
lib.ComboTree.ComboTree = Ext.extend(Ext.form.ComboBox, {
			/**
			 * @cfg {Boolean} forceLeaf 是否只能点选叶节点 (默认为 false)
			 */
			forceLeaf : false,
			bindStore : Ext.emptyFn,
			maxHeight : 200,
			width : 200,
			textMode : false,
			onLoad : function() {
				var rt = this.view.root;
				rt.on("expand", function(node) {
							this.expand();
							this.restrictHeight();
						}, this);
				rt.expand();
			},
			restrictHeight : function() {
				/** update by wangwei 2011-09-21 数据库管理添加字典，字典树点击完，滚动条置顶了**/
				//this.innerList.dom.style.height = 'auto';
				var inner = this.view.getTreeEl().dom;
				var fw = this.list.getFrameWidth('tb');
				var h = Math.max(inner.clientHeight, inner.offsetHeight,
						inner.scrollHeight);
				this.innerList.setHeight(h < this.maxHeight
						? 'auto'
						: this.maxHeight);

				this.list.beginUpdate();
				this.list.setHeight(this.innerList.getHeight() + fw
						+ (this.resizable ? this.handleHeight : 0)
						+ this.assetHeight);
				this.list.alignTo(this.el, this.listAlign);
				this.list.endUpdate();
			},
			initComponent : function() {
				if (this.name)
					this.hiddenName = this.name;
				Ext.form.ComboBox.superclass.initComponent.call(Ext.apply(this,
						{
							pageSize : false,
							transform : false
						}));
			},
			doQuery : function(q, forceAll) {
				if (this.view.root.isExpanded())
					this.expand();
				else
					this.onLoad();
			},
			onViewClick : function(node, e) {
				var as = node.attributes.allowSelect;
				if (typeof(as) == 'undefined') {
					if (this.forceLeaf && !node.isLeaf())
						return;
				} else if (!node.attributes.allowSelect)
					return;
				if (this.fireEvent('beforeselect', this, node, e) !== false) {
					this.setValue(node.id, node.text);
					this.collapse();
					this.fireEvent('select', this, node, e);
				}

			},
			setValue : function(v, text) {
				if (v instanceof Array) {
					text = v[1];
					v = v[0];
				} else if (typeof(v) == 'object') {
					text = v.text;
					v = v.value;
				}
				text=this.formatText(text);
				this.lastSelectionText = text;
				if (this.hiddenField) {
					this.hiddenField.value = (this.textMode) ? text : v;
				}
				Ext.form.ComboBox.superclass.setValue.call(this, text);
				this.value = v;
			},
			formatText:function(text){
				return text;
			},
			getValue : function() {
				return (this.textMode) ? this.lastSelectionText : this.value;
			},
			/**
			 * 返回中文,即被选中node的text属性值.
			 * 
			 * @return {String} The text
			 */
			getText : function() {
				return this.lastSelectionText;
			},
			/**
			 * 返回ComboTree中的TreePanel对象.
			 * 
			 * @return {Ext.tree.TreePanel} The treepanel
			 */
			getTree : function() {
				return this.view;
			},
			beforeBlur : Ext.emptyFn,
			assertValue : Ext.emptyFn,//不知道做什么用的
			initEvents : function() {
				Ext.form.ComboBox.superclass.initEvents.call(this);

				this.keyNav = new Ext.KeyNav(this.el, {

							"down" : function(e) {
								if (!this.isExpanded()) {
									this.onTriggerClick();
								}
							},

							"esc" : function(e) {
								this.collapse();
							},

							scope : this,

							doRelay : function(foo, bar, hname) {
								if (hname == 'down' || this.scope.isExpanded()) {
									return Ext.KeyNav.prototype.doRelay.apply(
											this, arguments);
								}
								return true;
							},

							forceKeyDown : true
						});
			},
			initList : function() {
				if (!this.list) {
					var cls = 'x-combo-list';

					this.list = new Ext.Layer({
								shadow : this.shadow,
								cls : [cls, this.listClass].join(' '),
								constrain : false
							});

					var lw = this.listWidth
							|| Math
									.max(this.wrap.getWidth(),
											this.minListWidth);
					this.list.setWidth(lw);
					this.list.swallowEvent('mousewheel');
					this.assetHeight = 0;

					this.innerList = this.list.createChild({
								cls : cls + '-inner'
							});
					this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

					/**
					 * The {@link Ext.tree.TreePanel TreePanel} 用来显示树 options.
					 * 
					 * @type Ext.tree.TreePanel
					 */
					this.view = new Ext.tree.TreePanel({
								applyTo : this.innerList,
								autoScroll : true,
								animate : false,
								containerScroll : true,
								height : 'auto',
								rootVisible : Ext.isDefined(this.rootVisible) ? this.rootVisible : true,
								editable : Ext.isDefined(this.editable) ? this.editable : true,
								root : this.root,
								draggable : false,
								loader : this.loader
							});
					this.view.on('click', this.onViewClick, this);
					this.view.on('expandnode', function() {
								this.restrictHeight();
							}, this)
					this.view.on('collapsenode', function() {
								this.restrictHeight();
							}, this)
				}
			}
		});
Ext.reg('combotree', lib.ComboTree.ComboTree);