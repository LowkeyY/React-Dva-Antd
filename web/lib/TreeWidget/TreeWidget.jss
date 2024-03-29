Ext.namespace('lib.TreeWidget');

lib.TreeWidget.TreeWidget = Ext.extend(Ext.form.TriggerField, {
	basePath : '/lib/TreeWidget/',
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		readOnly : 'true',
		size : "16",
		style : "cursor:default;",
		autocomplete : "off"
	},
	triggerClass : 'x-form-search-trigger',
	validateOnBlur : false,
	valueField : 'id',
	displayField : 'text',
	windowConfig : {},
	widgetTitle : null,
	rootTitle : null,
	widgetId : null,
	popupHeight : 300,
	popupWidth : 240,
	value : '',

	initComponent : function() {
		if (this.widgetId == null) {
			throw "Attribute widgetId is required.";
		}
		this.widgetTitle = Ext.util.Format.stripTags(this.widgetTitle
				|| this.fieldLabel || "");
		if (this.rootTitle == null)
			this.rootTitle = this.widgetTitle;
		using("lib.jsvm.MenuTree");
		this.addEvents("select");
	},
	onRender : function(ct, position) {
		lib.TreeWidget.TreeWidget.superclass.onRender.call(this, ct, position);
		this.hiddenField = this.el.insertSibling({
					tag : 'input',
					type : 'hidden',
					name : this.name || this.hiddenName,
					id : this.id + '-hidden'
				}, 'before', true);
		this.el.dom.removeAttribute('name');
	},
	onDestroy : function() {
		if (this.window)
			this.window.destroy();
	},
	setValue : function(value, text) {
		if (typeof(value) == 'object') {
			text = value.text;
			value = value.value;
		}
		if (!this.rendered) {
			this.value = {
				value : value,
				text : text
			};
			return;
		}
		if (typeof(text) != 'undefined') {
			if (typeof(text) == 'object' && text.text) {
				text = text.text;
			}
			lib.TreeWidget.TreeWidget.superclass.setValue.call(this, text);
		}
		this.value = value;

		if (this.hiddenField)
			this.hiddenField.value = value;
	},
	getValue : function() {
		return this.value;
	},
	getText:function(){
		return this.el.dom.value;
	},
	getName : function() {
		return this.name;
	},
	reset : function() {
		this.setValue("", "");
	},
	onTriggerClick : function(e) {
		if (this.disabled || this.readOnly)
			return;
		if (!this.window) {
			var view = new Ext.Panel({

			});
			this.windowConfig = Ext.apply(this.windowConfig, {
						title : this.widgetTitle,
						width : this.popupWidth,
						height : this.popupHeight,
						autoScroll : true,
						layout : 'fit',
						items : view,
						shadow : false,
						frame : true,
						buttons : [{
									text : '取消'.loc(),
									handler : function() {
										this.window.close();
									},
									scope : this

								}, {
									text : '清空'.loc(),
									handler : function() {
										this.setValue('', '');
										this.window.close();
									},
									scope : this
								}]
					});
			this.window = new Ext.Window(this.windowConfig);
			this.window.on('beforeclose', function() {
						this.el.focus();
						this.window.hide();
						return false;
					}, this);
			var menuTree = this.menuTree = new MenuTree(Tool
					.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'
							+ this.rootTitle
							+ '" url="'
							+ this.basePath
							+ 'tree.jcp?parent_id='
							+ this.widgetId
							+ '&amp;widget_id='
							+ this.widgetId
							+ '"/></forder></root>'));
			var fn = function(node) {
				this.setValue(String(node.prop.herfs1), node.prop.title)
				this.window.hide();
				this.fireEvent('select', this, node.prop.herfs1,
						node.prop.title);
			}.createDelegate(this);

			menuTree.setEvent("event1", {
						title_click : function() {
							fn(this);
						}
					});

			view.on("render", function() {
						menuTree.finish(this.body.dom, document);
					}, view);
		}

		var pos = Ext.get(this.wrap).getRegion(), dom = Ext.lib.Dom;
		var enoughHeight = dom.getViewHeight() - pos.top > this.popupHeight, v;
		if (dom.getViewWidth() - pos.right < this.popupWidth) {
			v = [enoughHeight ? "t" : "b", "r", "-", enoughHeight ? "b" : "t",
					"r"];
		} else {
			v = [enoughHeight ? "t" : "b", "l", "-", enoughHeight ? "t" : "b",
					"r"];
		}
		this.window.show();
		this.window.alignTo(this.wrap, v.join(""));
	}
});

Ext.reg('treewidget', lib.TreeWidget.TreeWidget);