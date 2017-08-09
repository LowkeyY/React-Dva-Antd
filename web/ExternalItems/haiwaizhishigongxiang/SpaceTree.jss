Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.SpaceTree = function() {

}

ExternalItems.haiwaizhishigongxiang.SpaceTree.prototype = {
	/**
	 * <ul>
	 * <li> cs0,用于新建节点,刷新当前节点并定位在子节点，适用于站点和子栏目</li>
	 * <li> cs1,用于删除节点，刷新父节点并定位在父节点，适用于站点和子栏目 </li>
	 * <li> cs2,用于修改节点，刷新父节点并定位在当前节点，适用于所有地方</li>
	 * <li> cs3,用于新建子站点</li>
	 * <li> cs4,用于删除子站点 </li>
	 * <li> cs5,用于站点新建栏目</li>
	 * <li> cs6,用于站点删除栏目</li>
	 * </ul>
	 */
	applyState : function(cmd, param, panel) {
		this[cmd](panel, param);
	},
	// 用于站点新建站点和栏目
	cs0 : function(panel, param) {
		var cur = this.tree.getSelectionModel().getSelectedNode();
		var id = param.dataId;

		if (cur == this.tree.root) {
			cur.reload(function() {
						cur = cur.findChild("id", id);
						if (cur)
							cur.fireEvent("click", cur);
					}, this);
		} else {
			if (param.fromId == "835d0b03-18fb-4cf0-a6c9-2ceedebc9daa") {
				var iszd = (param.pTab == "4e00f4d6-0a20-4541-8f74-d0debf99f57a");
				var folder;
				if (folder = cur.findChild("text", iszd ? "子站点" : "栏目")) {
					folder.reload(function() {
								cur = folder.findChild("id", id);
								if (cur)
									cur.fireEvent("click", cur);
							}, this);
				} else {
					cur.reload(function() {
								cur = cur.findChild("text", iszd ? "子站点" : "栏目");
								cur.reload(function() {
											cur = cur.findChild("id", id);
											if (cur)
												cur.fireEvent("click", cur);
										}, this);
							}, this)
				}

			} else {// 建子栏目
				cur.reload(function() {
							cur = cur.findChild("id", id);
							if (cur)
								cur.fireEvent("click", cur);
						}, this);
			}

		}

	},
	// 用于删除节点，刷新父节点并定位在父节点，适用于站点和子栏目
	cs1 : function(panel, param) {
		var cur = this.tree.getSelectionModel().getSelectedNode();
		if (cur && cur.parentNode) {
			var p = cur.parentNode;
			if (p.attributes.type == 'mulu' && p.childNodes.length == 1) {
				p = p.parentNode;
			}
			delete p.attributes.children;
			p.reload(function() {
						p.fireEvent("click", p);
					}, this);

		}
	},
	// 用于修改节点，刷新父节点并定位在当前节点，适用于所有地方
	cs2 : function(panel, param) {
		this.refreshParentAnd(function(p, cur) {
					cur = p.findChild("id", cur.id);
					if (cur)
						cur.fireEvent("click", cur);
				}, this)
	},
	// 刷新根节点 定位父节点
	cs3 : function(panel, param) {
		var root = this.tree.getRootNode();
		delete root.attributes.children;
		root.reload(function() {
			var top = this.childNodes[0];
			top.expand(false , true , function(){
				top.fireEvent("click", top);
			})
		}, root);
	},
	// 刷新根节点 定位自己
	cs4 : function(panel, param) {
		var root = this.tree.getRootNode() , curId = this.tree.getSelectionModel().getSelectedNode().id;
		delete root.attributes.children;
		root.reload(function() {
			root.expand(false , true , function(){
				var top = this.childNodes[0];
				top.expand(false , true , function(){
					var cur = top.findChild("id", curId);
					if(cur)
						cur.fireEvent("click", cur);
				})
			}, root);
		}, this);
	},
	// 刷新根节点 定位子节点
	cs5 : function(panel, param) {
		var root = this.tree.getRootNode() , curId = param.dataId;
		delete root.attributes.children;
		root.reload(function() {
			root.expand(false , true , function(){
				var top = this.childNodes[0];
				top.expand(false , true , function(){
					var cur = top.findChild("id", curId);
					if(cur)
						cur.fireEvent("click", cur);
				})
			}, root);
		}, this);
	},
	refreshParentAnd : function(fn, scope) {
		var cur = this.tree.getSelectionModel().getSelectedNode();
		if (cur && cur.parentNode) {
			var p = cur.parentNode;
			delete p.attributes.children;
			p.reload(fn.createCallback(p, cur), scope);
		}
	},
	loadHistory : function(tree, path) {
		Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/SpaceTree.jcp',
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
					text : "空间导航",
					action : true,
					type : 'space',
					icon : "/themes/icon/all/attach.gif"
				});

		var loader = new Ext.tree.TreeLoader({
					dataUrl : '/ExternalItems/haiwaizhishigongxiang/SpaceTree.jcp'
				});

		var tree = new Ext.tree.TreePanel({
					title : '空间导航',
					bodyStyle : 'padding: 6 0 0 6',
					width : '500',
					height : '700',
					root : root,
					loader : loader,
					rootVisible : false,
					autoScroll:true
				});
		tree.on("afterrender", function() {
				this.loadHistory(tree, "currentSpace");
			}, this);
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
						exportTab: "f64c7776-a3d5-4011-87e9-f1a7178575b9", //固定ID
						fromId : "148969",
						fromType : "2",
						objectId : "ce218c21-603c-447a-b652-d28dd337c24e", //固定ID
						pageType : "view",
						programType : "ProgramInput"
					}
					
					this.right.loadProgram(param, false);
				})
		parentPanel.add(tree);
		parentPanel.doLayout();
		this.tree = tree;
	}
}