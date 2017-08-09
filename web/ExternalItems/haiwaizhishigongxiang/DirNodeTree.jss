Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.DirNodeTree = function() {

}

ExternalItems.haiwaizhishigongxiang.DirNodeTree.prototype = {
	loadHistory : function(tree, path) {
		Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/DirNodeTree.jcp',
					params : {
						path : path
					},
					method : 'GET',
					scope : this,
					callback : function(options, success, response) {
						var json = Ext.decode(response.responseText);
						var p = tree.right.getComponent(0);
						if (p.getComponent(0)) {
							p.getComponent(0).destroy();
						}
						if (json.success) {
							var children = json.childs , node , opt , hasClick = false;
							for(var i = children.length - 1 ; i >= 0 ; i--){
								if(node = tree.getNodeById(children[i])){
									opt = node;
									if(path.split("::")[0] == children[i]){
										node.fireEvent("click", node);
										hasClick = true;
									}else if(!node.leaf)
										node.expand();
								}
							}
							if(!hasClick && opt)
								opt.fireEvent("click", opt);
						} else if (json.message) {
							//Ext.msg("Error", json.message);
						}
					}
				});
	},

	load : function(framePanel, parentPanel, param, prgInfo) {
		var root = new Ext.tree.AsyncTreeNode({
					id : "root",
					text : "空间分类导航",
					action : true,
					type : 'space',
					icon : "/themes/icon/all/attach.gif"
				});

		var loader = new Ext.tree.TreeLoader({
					dataUrl : '/ExternalItems/haiwaizhishigongxiang/DirNodeTree.jcp'
				});

		var tree = new Ext.tree.TreePanel({
					title : '空间分类导航',
					bodyStyle : 'padding: 6 0 0 6',
					width : '500',
					height : '700',
					root : root,
					loader : loader,
					rootVisible : false,
					autoScroll:true
				});
		tree.uStore = new UserStore(tree_store);
		if (tree.uStore.getAttribute("Exe_dirnodeTree")) {
			tree.on("afterrender", function() {
				this.loadHistory(tree, tree.uStore.getAttribute("Exe_dirnodeTree"));
			}, this)
		}

		tree.right = framePanel.ownerCt.ownerCt.getComponent(1);
		tree.on("click", function(node) {
					var param;
					var att = node.attributes;
/*					if (!att.action) {
						var p = this.right.getComponent(0)
						if (p.getComponent(0)) {
							p.getComponent(0).destroy();
						}
						return;
					}*/
					param = {
						_UDS : att.UDS,
						action : att.action,
						levels : att.levels,
						dataId : att.id,
						exportData : att.id,
						exportItem : "SPACE_ID",
						exportTab: "133944",
						fromId : "133962",
						fromType : "2",
						objectId : "133963",
						pageType : "view",
						programType : "ProgramInput"
					}
					this.right.loadProgram(param, false);
					this.uStore.setAttribute("Exe_dirnodeTree", att.id + "::" + att.type);
					this.uStore.save("oXMLBranch");
				})
		parentPanel.add(tree);
		parentPanel.doLayout();
		this.tree = tree;
	}
}