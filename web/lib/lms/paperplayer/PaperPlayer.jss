Ext.ns("lib.lms.paperplayer");
using("lib.CachedPanel.CachedPanel");
using("lib.lms.paperplayer.Question");
/**
 * */
lib.lms.paperplayer.PaperPlayer = Ext.extend(Ext.Panel, {

	layout : 'border',

	initComponent : function() {
		this.navTree = this.createTree()
		this.navTree.on("click", this.treeClick, this);
		this.questionArea = new lib.CachedPanel.CachedPanel({
					statusBar : false,
					split : true,
					region : 'center'
				})
		this.items = [this.navTree, this.questionArea];
		lib.lms.paperplayer.PaperPlayer.superclass.initComponent.call(this);
	},

	treeClick : function(node, e) {
		if (node.isLeaf)
			this.showQuestion(node);
	},

	// 在问题区里显示问题
	showQuestion : function(node) {
		lg(node);
		if (!this.questionArea.havePanel(node.id)) {
			var className = node.attributes.category;
			className = className.substring(0, 1).toUpperCase()
					+ className.substring(1);
			this.questionArea
					.add(new lib.lms.paperplayer[className](node.attributes));
			this.questionArea.doLayout();
		}
		this.questionArea.setActiveTab(node.id);
	},

	createTree : function() {
		var root = {
			nodeType : 'async',
			expanded : true,
			draggable : false,
			children : []
		}
		for (var i = 0; i < this.sections.length; i++) {
			var childs = [];
			root.children.push({
						expanded : true,
						text : this.sections[i].title,
						id : this.sections[i].id,
						draggable : false,
						leaf : false,
						children : childs
					});
			for (var qs = this.sections[i].questions, j = 0; j < qs.length; j++) {
				childs.push(Ext.apply({
							expanded : true,
							draggable : false,
							leaf : true
						}, qs[j]));
			}
		}
		return new Ext.tree.TreePanel({
					region : 'west',
					split : true,
					width : 300,
					useArrows : true,
					autoScroll : true,
					animate : true,
					enableDD : this.allowEdit,
					containerScroll : true,
					rootVisible : false,
					root : root

				});
	}
});