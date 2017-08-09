
Ext.namespace('utils.km.file'); 

utils.km.file.TagsPanel = function(config) {
	this.events = {
		"tagselect" : true,
		"tagremove" : true,
		"tagedit" : true
	};
	utils.km.file.TagsPanel.superclass.constructor.call(this, Ext.applyIf(
					config || {}, {
						animate : true,
						containerScroll : true,
						rootVisible : false,
						autoScroll : true,
						title : '标签'.loc(),
						bbar : [' ', new Ext.form.TwinTriggerField({
											width : 200,
											emptyText : '搜索标签...'.loc(),
											trigger1Class : 'x-form-clear-trigger',
											trigger2Class : 'x-form-search-trigger',
											hideTrigger1 : true,
											enableKeyEvents : true,
											onTrigger1Click : function(e) {
												this.setValue('');
												this.fireEvent('change', this,
														e);
											},
											listeners : {
												keydown : function(txt, e) {
													txt.fireEvent('change',
															txt, e);
												},
												change : function(txt, e) {
													this.searchFilter = txt
															.getValue();
													if (this.searchFilter == '') {
														txt.triggers[0].hide();
													} else {
														txt.triggers[0].show();
													}
													this.populateTree();
												},
												buffer : 350,
												scope : this
											}
										})]
					}));
	var root = new Ext.tree.TreeNode({
				text : 'Tags',
				allowDrag : false,
				allowDrop : false
			});
	this.setRootNode(root);
	this.on('contextmenu', this.tagsTree_contextmenu, this);
	this.on('click', this.tagsTree_click, this);
	root.expand();
	this.treeMenu = new Ext.menu.Menu();
	this.treeMenu.add({
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.selectTag(this.contextTagId);
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.deleteTag(this.contextTagId);
				},
				scope : this
			});
	this.on('render', this.loadTags, this);
}
Ext.extend(utils.km.file.TagsPanel, Ext.tree.TreePanel, {
	selectTag : function(name) {
		var node = this.getNodeById(name);
		if (node)
			node.select();
		this.fireEvent('tagselect', name);
	},
	deleteTag : function(name) {
		var TagRemoved = function(result) {
			if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
				this.fireEvent('tagremove', name);
				this.loadTags();
			} else {
				Ext.MessageBox.alert('Error', result.Description);
			}
		};
		RemoteMethods.RemoveTag(name, TagRemoved, this);
	},
	populateTree : function() {
		var selectedNode = this.getSelectionModel().getSelectedNode();
		var node = null;
		while (node = this.root.childNodes[0]) {
			node.unselect();
			this.root.removeChild(node);
		}
		var index = 0
		var tag = null;
		while (tag = this.tags[index]) {
			if (this.searchFilter == null
					|| this.searchFilter == ''
					|| tag.Name.toLowerCase().indexOf(this.searchFilter
							.toLowerCase()) != -1) {
				var title = tag.Name + ' (' + tag.Count + ')';
				this.root.appendChild(new Ext.tree.TreeNode({
							id : tag.Name,
							text : title,
							iconCls : 'db-icn-tag',
							allowDrag : false
						}));
			}
			index++;
		}
		if (selectedNode != null)
			this.getSelectionModel().select(this.getNodeById(selectedNode.id));
	},
	tagsTree_click : function(node, e) {
		if (node == null || node.id == null)
			return;
		this.selectTag(node.id);
	},
	tagsTree_contextmenu : function(node, e) {
		if (node == null || node.id == null)
			return;
		this.contextTagId = node.id;
		this.treeMenu.show(node.ui.getAnchor());
	},
	loadTags : function() {
		var LoadTagsComplete = function(result) {
			this.tags = result;
			if (this.rendered)
				this.populateTree();
		};
		RemoteMethods.GetAllTags(LoadTagsComplete, this);
	},
	tagItems : function(folderIds, fileIds) {
		var TagsLoaded = function(result) {
			if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
				tags = result.ReturnValue;
				this.showDialog(folderIds, fileIds, result.ReturnValue);
			} else {
				Ext.MessageBox.alert('Error', result.Description);
			}
		};
		RemoteMethods.GetTags(folderIds, fileIds, TagsLoaded, this);
	},
	showDialog : function(folderIds, fileIds, tags) {
		var dlg = null;
		var txtTags = null;
		var CallServer = function() {
			var sTags = txtTags.getValue();
			RemoteMethods.AddTags(folderIds, fileIds, sTags, function(result) {
						dlg.close();
						if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
							this.loadTags();
							this
									.fireEvent('tagedit', folderIds, fileIds,
											sTags);
						} else {
							Ext.MessageBox.alert('Error', result.Description);
						}
					}, this);
		};
		dlg = new Ext.Window({
			title : '对所选项加入标签'.loc(),
			iconCls : 'db-icn-tag',
			resizable : false,
			constrainHeader : true,
			modal : true,
			renderTo : (this.ctParent && this.ctParent.cover)
					? this.ctParent.cover
					: document.body,
			width : 400,
			height : 300,
			bodyStyle : 'padding:5px 10px 0 10px',
			html : '<div><span style="padding-bottom:2px;display:block">'+'标签'.loc()+': <span style="font-size:0.8em">('+'标签之间用'.loc()+'","'+'分隔'.loc()+')</span></span><div></div></div><div><span style="padding:10px 0 2px 0;display:block">'+'所有标签'.loc()+':</span><div style="height:150px;overflow:auto;background-color:#fff;border:solid 1px #7F9DB9;"></div></div>',
			buttons : [{
						text : '确定'.loc(),
						handler : CallServer,
						scope : this
					}, {
						text : '取消'.loc(),
						handler : function() {
							dlg.close()
						}
					}]
		});
		var formHolderEl = Ext.get(dlg.body.dom.childNodes[0].childNodes[1]);
		var tagsHolderEl = Ext.get(dlg.body.dom.childNodes[1].childNodes[1]);
		txtTags = new Ext.form.TextField({
					width : 355,
					value : tags,
					renderTo : formHolderEl
				});
		var GetTagStyle = function(t) {
			var size = 0;
			var weight = 100;
			if (t.Count < 9)
				size = t.Count;
			else
				size = 9;
			if (t.Count > 9)
				weight = t.Count * 10;
			weight = (weight > 900) ? 900 : weight;
			return 'font-size:1.' + size + 'em;font-weight:' + weight
					+ ';padding:0 3px';
		};
		var TagClicked = function(e, elem) {
			var sTags = txtTags.getValue();
			var tag = elem.innerHTML;
			var tagList = sTags.split(',');
			for (var i = 0; i < tagList.length; ++i)
				if (tagList[i].trim().toLowerCase() == tag.toLowerCase())
					return;
			if (sTags.trim() == '')
				sTags = tag;
			else
				sTags += ', ' + tag;
			txtTags.setValue(sTags);
		};
		var LoadTagsComplete = function(result) {
			this.tags = result;
			for (var i = 0; i < this.tags.length; ++i) {
				var t = tagsHolderEl.createChild({
							tag : 'a',
							href : '#',
							style : GetTagStyle(this.tags[i]),
							html : this.tags[i].Name
						});
				t.on('click', TagClicked, this);
			}
		};
		if (!this.tags) {
			RemoteMethods.GetAllTags(LoadTagsComplete, this);
		} else {
			LoadTagsComplete(this.tags);
		}
		dlg.show();
	}
});