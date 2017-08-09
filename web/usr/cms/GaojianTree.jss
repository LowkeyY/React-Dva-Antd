Ext.ns("usr.cms");

usr.cms.GaojianTree = function() {

}

usr.cms.GaojianTree.prototype = {

	loadHistory : function(tree, path) {
		if (path == 'root::zhandian') {
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
					text : "所有站点",
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
					if (!att.action || att.type == 'zhandian') {
						var p = this.right.getComponent(0)
						if (p.getComponent(0)) {
							p.getComponent(0).destroy();
						}
						return;
					}
					if (att.type == 'lanmu') {
						var customized = (att.leixing && att.leixing == "5");
						param = {
							dataId : att.id,
							exportData : att.id,
							exportItem : "id",
							exportTab : customized ? "bcab194e-4ef5-4128-8d95-864e8d8bb2c1" : "8a1cb8af-9ff8-49f7-baec-b1d0224d7280",
							fromId : "2e3fe467-50aa-450e-a7e1-6a71a6c24acf",
							fromType : "2",
							objectId : customized ? "e71f26a3-a7d5-4767-ab12-24346a36a882":"2e3fe467-50aa-450e-a7e1-6a71a6c24acf",
							pageType : "new",
							programType : "ProgramList"
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
					this.uStore.setAttribute("Exe_siteTee", att.id + "::" + att.type);
					this.uStore.save("oXMLBranch");
				})
		parentPanel.add(tree);
		parentPanel.doLayout();
		this.tree = tree;
	}

}