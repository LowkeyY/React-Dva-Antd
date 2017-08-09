Ext.namespace('lib.SelectUnit');
lib.SelectUnit.SelectUnit = Ext.extend(lib.ComboTree.ComboTree, {

	// private
	forceLeaf : true,
	defaultAutoCreate : {
		tag : "div",
		style : "border: 1px solid rgb(181, 184, 200); background-color:rgb(255, 255, 255);padding:1px 0 0 5px;float: left; height: 19px;",
		html : '&nbsp;'
	},
	width : 200,
	mode : 'remote',
	allowBlank : true,
	rawText : null,
	value : '',
	initComponent : function() {
		lib.SelectUnit.SelectUnit.superclass.initComponent.call(this);
		this.loader = new Ext.tree.TreeLoader({
					dataUrl : '/lib/SelectUnit/SelectUnit.jcp',
					requestMethod : "GET"
				});
		this.loader.on("beforeload", function(treeLoader, node) {
					treeLoader.baseParams.level = node.attributes.level;
					treeLoader.baseParams.ra = Math.random();
				});
		this.root = new Ext.tree.AsyncTreeNode({
					text : '选择单位'.loc(),
					draggable : false,
					expanded : true,
					level : 1,
					id : this.objectId,
					allowSelect : false,
					icon : "/themes/icon/all/pilcrow.gif"
				})
	},
	afterRender : function() {
		lib.SelectUnit.SelectUnit.superclass.afterRender.call(this);
		if (this.rawText != null) {
			this.el.update(this.rawText);
			this.rawText = null;
		}
	},
	getRawValue : function() {
		return this.value;
	},
	setValue : function(v, text) {
		if (v instanceof Array) {
			text = v[1];
			v = v[0];
		} else if (typeof(v) == 'object') {
			text = v.text;
			v = v.value;
		}
		this.lastSelectionText = text;
		if (this.hiddenField) {
			this.hiddenField.value = (this.textMode) ? text : v;
		}
		if (this.el) {
			this.el.update(text);
		} else {
			this.rawText = text;
		}
		this.value = v;
	}

});
