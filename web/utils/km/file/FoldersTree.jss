// / <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file');
// //////////////////////////////////////////utils.km.file.FoldersTree
//
// /////////////////////////////////////////////////////////////////
utils.km.file.FoldersTree = function() {

	this.events = {
		"foldersload" : true,
		"folderclick" : true,
		"foldermove" : true,
		"folderdrop" : true
	};

	utils.km.file.FoldersTree.superclass.constructor.call(this, {
				animate : true,
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/utils/km/file/tree.jcp'
						}),
				enableDD : true,
				containerScroll : true,
				ddGroup : 'fileFolderDD',
				rootVisible : false,
				ddAppendOnly : true,
				autoScroll : true,
				border : false,
				title : '文件夹'.loc(),
				header : false,
				lines : false,
				cls : 'db-folders-tree'
			});

	// set the root node
	var root = new Ext.tree.AsyncTreeNode({
				text : 'Root',
				allowDrag : false,
				allowDrop : false,
				children : []
			});
	this.setRootNode(root);
	root.expand();

	this.on('click', this.tree_click, this);
	this.on('afterrender', function(ctree) {
				var p = ctree.ownerCt;
				while (p && !p.isFrame)
					p = p.ownerCt;
				this.frameEl = p.el;
			});
	this.on('beforeexpand', function(panel) {
				this.maskDelay = this.frameEl.mask.defer(800, this.frameEl,
						["文件信息载入中...."])
			}, this);
	this.on('nodedragover', function(e) {
				return e.target.attributes.canWrite;
			});
	this.on('expand', function(panel) {
				if (this.frameEl.isMasked()) {
					this.frameEl.unmask();
				} else {
					clearTimeout(this.maskDelay);
				}
			}, this);
	this.on('beforenodedrop', this.tree_beforenodedrop, this);

};

Ext.extend(utils.km.file.FoldersTree, Ext.tree.TreePanel, {

			tree_click : function(node, e) {
				this.fireEvent("folderclick", node.id);
			},

			tree_beforemovenode : function(tree, node, oldParent, newParent,
					index) {
				newParent.expand();
				this.fireEvent('foldermove', this.getNodeFolder(node), this
								.getNodeFolder(newParent));
				return false;
			},

			tree_beforenodedrop : function(dropEvent) {
				dropEvent.cancel = true;
				this.fireEvent('folderdrop', this
								.getNodeFolder(dropEvent.target), dropEvent);
				return false;

			},

			getNodeFolder : function(node) {
				return {
					'ID' : node.id,
					'Name' : node.text,
					'Type' : node.attributes['type'],
					'CanWrite' : node.attributes['canWrite']
				}
			},

			getFolderById : function(folderId) {
				var node = this.getNodeById(folderId);
				if (node)
					return this.getNodeFolder(node);
				else
					return null;
			},

			selectFolderById : function(folderId) {
				var node = this.getNodeById(folderId);
				node.parentNode.expand();
				node.select();
			},

			getSelectedFolder : function() {
				var node = this.getSelectionModel().getSelectedNode()
				return this.getNodeFolder(node);
			},

			getRecycleBin : function() {
				var node = this.root.lastChild;
				var folder = this.getNodeFolder(node);
				if (folder.Type == utils.km.file.FolderType.RecycleBin)
					return folder;
				else
					return null;
			},

			getMyFoldersRoot : function() {
				var node = this.root.firstChild;
				return this.getNodeFolder(node);
			},

			selectRoot : function() {
				this.root.firstChild.select();
			},

			getParentFolder : function(folderId) {
				var node = this.getNodeById(folderId);
				if (node && node.parentNode && node.parentNode != this.root)
					return this.getNodeFolder(node.parentNode);
				else
					return null;
			},

			clearSelections : function() {
				this.getSelectionModel().clearSelections();
			},

			loadComplete : function(childs) {
				this.root.attributes.children = childs;
				this.root.reload();
				this.loaded = true;

				this.fireEvent("foldersload", this);
			},
			loadTree : function(compact) {
				var instance = this;
				Ext.Ajax.request({
							url : '/utils/km/file/tree.jcp',
							method : 'post',
							params : {
								'compact' : (compact ? true : false)
							},
							callback : function(options, success, response) {
								var result = Ext.util.JSON
										.decode(response.responseText);
								if (success) {
									instance.loadComplete(result);
								} else {
									var msg = (result && result.Message)
											? result.Message
											: '发生错误,请重试'.loc();
									Ext.MessageBox.alert('Error', msg);
								}
							}
						});
			}
		});