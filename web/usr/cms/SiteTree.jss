Ext.ns("usr.cms");

usr.cms.SiteTree = function() {

}

usr.cms.SiteTree.prototype = {
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
								cur = cur
										.findChild("text", iszd ? "子站点" : "栏目");
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
	refreshParentAnd : function(fn, scope) {
		var cur = this.tree.getSelectionModel().getSelectedNode();
		if (cur && cur.parentNode) {
			var p = cur.parentNode;
			delete p.attributes.children;
			p.reload(fn.createCallback(p, cur), scope);

		}
	},
	loadHistory : function(tree, path) {
		if (path == 'root::zhandian') {
			tree.root.fireEvent("click", tree.root);
			return;
		}
		Ext.Ajax.request({
					url : '/usr/cms/SiteTree.jcp',
					params : {
						path : path
					},
					method : 'GET',
					scope : this,
					callback : function(options, success, response) {
						var json = Ext.decode(response.responseText);
						if (json.success) {
							tree.root.appendChild(json.childs);
							tree.root.loaded = true;
							tree.root.expand();
							var cur = tree.getNodeById(path.split("::")[0]);
							if (cur) {
								cur.fireEvent("click", cur);
							}
						} else if (json.message) {
							//Ext.msg("Error", json.message);
						}
					}
				});
	},

	load : function(framePanel, parentPanel, param, prgInfo) {

		var root = new Ext.tree.AsyncTreeNode({
					id : "root",
					text : "网站导航",
					action : true,
					type : 'zhandian',
					icon : "/themes/icon/all/attach.gif"
				});

		var loader = new Ext.tree.TreeLoader({
					dataUrl : '/usr/cms/SiteTree.jcp'
				});

		var tree = new Ext.tree.TreePanel({
					title : '网站导航面板',
					bodyStyle : 'padding: 6 0 0 6',
					width : '500',
					height : '700',
					root : root,
					loader : loader,
					autoScroll:true
				});

		tree.uStore = new UserStore(tree_store);
		if (tree.uStore.getAttribute("Exe_siteTee")) {
			tree.on("afterrender", function() {
				this.loadHistory(tree, tree.uStore.getAttribute("Exe_siteTee"));
			}, this)
		}

		tree.right = framePanel.ownerCt.ownerCt.getComponent(1);
		tree.on("click", function(node) {
					var param;
					var att = node.attributes;
					if (!att.action) {
						var p = this.right.getComponent(0)
						if (p.getComponent(0)) {
							p.getComponent(0).destroy();
						}
						return;
					}
					if (att.type == 'zhandian') {
						var did=(att.id=='root')?"":att.id;
						param = {
							dataId : did,
							exportData : did,
							exportItem : "id",
							exportTab : "4e00f4d6-0a20-4541-8f74-d0debf99f57a",
							fromId : "835d0b03-18fb-4cf0-a6c9-2ceedebc9daa",
							fromType : "2",
							objectId : "835d0b03-18fb-4cf0-a6c9-2ceedebc9daa",
							pageType : (node == this.root) ? "new" : "view",
							programType : "ProgramInput"
						}
					} else if (att.type == 'lanmu') {
						var nd = node;
						while (nd.attributes.type != 'zhandian')
							nd = nd.parentNode;
						var oId = att.leixing == "4" ? "c90539db-1266-4c3f-8301-0d0a3f68b7af" : "6f198683-0255-43cd-96a9-c61e15351b49";
						param = {
							dataId : att.id,
							exportData : att.id + "::" + nd.attributes.id,
							exportItem : "id",
							exportTab : "4e00f4d6-0a20-4541-8f74-d0debf99f57a",
							fromId : "6f198683-0255-43cd-96a9-c61e15351b49",
							fromType : "2",
							objectId : oId,
							pageType : "view",
							programType : "ProgramInput"
						}
					} else if (att.type == 'recycle') {
						var dataId = att.id.indexOf("::") > 0 ? att.id.substr(0, att.id.indexOf("::")) : att.id;
						param = {
							dataId : dataId,
							exportData : dataId,
							exportItem : "id",
							exportTab : "8a1cb8af-9ff8-49f7-baec-b1d0224d7280",
							fromId : "2a5419b7-6d77-4dbe-87b8-23f25abce79a",
							fromType : "2",
							objectId : "2a5419b7-6d77-4dbe-87b8-23f25abce79a",
							pageType : "new",
							programType : "ProgramList"
						}
					}

					this.right.loadProgram(param, false);
					this.uStore.setAttribute("Exe_siteTee", att.id + "::"
									+ att.type);
					this.uStore.save("oXMLBranch");
				})
		parentPanel.add(tree);
		parentPanel.doLayout();
		this.tree = tree;
	}

}