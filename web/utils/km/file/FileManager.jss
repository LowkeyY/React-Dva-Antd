Ext.ns('utils.km.file');

utils.km.file.FileManager = function(config) {
	this.settings = config.settings;

	using("utils.km.file.FilesGridView");
	using("utils.km.file.FilesGridDragSelector");
	using("utils.km.file.GridBase");
	using("utils.km.file.FilesGrid");
	using("utils.km.file.FoldersTree");
	using("utils.km.file.TagsPanel");
	using("utils.km.file.BrowserHistory");
	using("utils.km.file.UploadFromUrl");

	this.filesView = new utils.km.file.FilesGrid(this.settings.CurrentView);
	this.foldersTree = new utils.km.file.FoldersTree();
	this.tagsPanel = new utils.km.file.TagsPanel({
				ctParent : this
			});
	this.history = new utils.km.file.BrowserHistory();

	utils.km.file.FileManager.superclass.constructor.call(this, {
		region : 'center',
		collapsible : false,
		split : true,
		layout : 'fit',
		tbar : new Ext.Toolbar({
					cls : 'db-menubar',
					items : [{
						text : '文件'.loc(),
						menu : {
							items : [{
										text : '下载'.loc(),
										iconCls : 'db-icn-download',
										handler : function() {
											this.downloadSelected();
										},
										scope : this
									}, {
										text : '上传'.loc()
												+ ' <i>Ctl + Shift + L</i>',
										iconCls : 'db-icn-upload',
										name : 'tbMultipleUpload',
										handler : function() {
											this.upload(true);
										},
										scope : this
									}, '-', {
										text : '新建文件夹'.loc(),
										name : 'tbCreateFolder',
										iconCls : 'db-icn-folder-new',
										handler : function() {
											this.addFolder();
										},
										scope : this
									}, '-', {
										text : '删除'.loc() + ' <i>Del</i>',
										name : 'tbDelete',
										iconCls : 'db-icn-delete',
										handler : function() {
											this.deleteSelected();
										},
										scope : this
									}, {
										text : '改名'.loc() + ' <i>F2</i>',
										iconCls : 'db-icn-rename',
										name : 'tbRename',
										handler : function() {
											this.renameSelected();
										},
										scope : this
									}]
						}
					}, {
						text : '编辑'.loc(),
						menu : {
							items : [{
										text : '剪切'.loc() + ' <i>Ctrl + X</i>',
										name : 'tbCut',
										iconCls : 'db-icn-cut',
										handler : function() {
											this.cutSelected();
										},
										scope : this
									}, {
										text : '拷贝'.loc() + ' <i>Ctrl + C</i>',
										iconCls : 'db-icn-copy',
										handler : function() {
											this.copySelected();
										},
										scope : this
									}, {
										text : '粘贴'.loc() + ' <i>Ctrl + V</i>',
										name : 'tbPaste',
										iconCls : 'db-icn-paste',
										handler : function() {
											this.pasteOnSelected();
										},
										scope : this
									}, '-', {
										text : '全选'.loc() + '<i>Ctrl + A</i>',
										handler : function() {
											this.selectAllItems();
										},
										scope : this
									}]
						}
					}, {
						text : '查看'.loc(),
						menu : {
							items : [{
										text : '后退'.loc(),
										name : 'tbBack',
										iconCls : 'db-icn-back',
										handler : function() {
											this.goBack();
										},
										scope : this
									}, {
										text : '前进'.loc(),
										name : 'tbForward',
										iconCls : 'db-icn-forward',
										handler : function() {
											this.goForward();
										},
										scope : this
									}, {
										text : '向上'.loc(),
										name : 'tbUp',
										iconCls : 'db-icn-up',
										handler : function() {
											this.goUp();
										},
										scope : this
									}, '-', {
										text : '刷新'.loc(),
										iconCls : 'db-icn-refresh',
										handler : function() {
											this.refreshAll();
										},
										scope : this
									}]
						}
					}]
				}),

		layout : 'border',
		items : [{
					region : 'west',
					title : '文件夹'.loc(),
					collapsible : true,
					split : true,
					width : 210,
					minSize : 175,
					maxSize : 400,
					layout : 'fit',
					items : new Ext.TabPanel({
								border : false,
								activeTab : 0,
								tabPosition : 'bottom',
								listeners : {
									afterrender : function() {
										this.body
												.setStyle("overflow", "hidden");
									}
								},
								autoScroll : true,
								items : [this.foldersTree, this.tagsPanel]
							})
				}, {
					region : 'center',
					id : 'db-fv-panel',
					activeItem : 0,
					layout : 'card',
					items : [{
						border : false,
						layout : 'border',
						items : [{
									region : 'center',
									margins : '0 0 0 0',
									autoScroll : true,
									border : false,
									layout : 'fit',
									items : this.filesView
								}, {
									region : 'south',
									split : false,
									height : 60,
									autoScroll : false,
									collapsible : false,
									titlebar : false,
									border : true,
									cls : 'db-property-panel',
									html : '<table><tr><td colspan="2" id="pp-title" class="ppTitle"></td><td class="ppLabel">'
											+ '创建时间'.loc()
											+ ':</td><td id="pp-created"><td class="ppLabel">'
											+ '备注'.loc()
											+ ':</td><td id="pp-comment"></td></tr>'
											+ '<tr><td width="8%" class="ppLabel">'
											+ '大小'.loc()
											+ ':</td><td id="pp-size" width="25%"></td><td width="10%" class="ppLabel">'
											+ '修改时间'.loc()
											+ ':</td><td id="pp-modified" width="20%"></td><td width="10%" class="ppLabel">'
											+ '标签'.loc()
											+ ':</td><td id="pp-tags" width="30%"></td></tr>'
											+ '<tr><td class="ppLabel">'
											+ '路径'.loc()
											+ ':</td><td colspan="3" id="pp-path"></td><td class="ppLabel">'
											+ '状态'.loc()
											+ ':</td><td id="pp-status"></td></tr></table>'
								}]
					}, {
						bodyStyle : 'background-color:#000;',
						border : false,
						autoScroll : false
					}]
				}]
	});
	this.on('afterrender', this.initMenuButton, this);
	this.on('render', this.filemanager_show, this);
	this.on('resize', this.filemanager_resize, this);
	if (Ext.isChrome || Ext.isGecko) {
		this.on('afterrender', function() {
					using("lib.file.ddupload.DragDropUpload");
					var dragUpload = new lib.file.ddupload.DragDropUpload(
							this.cover, {
								url : '/utils/km/file/upload.jcp'
							});
					dragUpload.on("uploadcomplete", function() {
								this.refreshView();
							}, this);
					dragUpload.on("beforedrop", function(obj) {
								obj.params = {
									FolderID : this.currentFolderId
								};
							}, this);
					dragUpload.on("error", function() {
								this.refreshView();
							}, this);
				}, this);
	}

	this.filesView.on("loadcomplete", this.filesView_load, this, true);
	this.filesView.on("itemdblclick", this.filesView_dblclick, this, true);
	this.filesView.on('itemcontextmenu', this.filesView_item_contextmenu, this,
			true);
	this.filesView.on('selectionchange', this.filesView_select, this, true);
	this.filesView.on('itemdrop', this.filesView_itemdrop, this, true);
	this.filesView.on('contextmenu', function(e) {
				e.stopEvent();
				var folder = {
					ID : this.currentFolderId,
					Type : this.currentFolderType,
					CanWrite : !this.CurrentFolderReadOnly
				};
				this.contextFolders = new Array();
				this.contextFolders[0] = folder;
				var menu = this.getFolderMenu(folder);
				if (menu)
					menu.showAt(e.xy);
			}, this);

	this.foldersTree.on('folderclick', this.foldersTree_click, this);
	this.foldersTree.on('foldersload', this.foldersTree_load, this);
	this.foldersTree.on('contextmenu', this.foldersTree_contextmenu, this);
	this.foldersTree.on('foldermove', this.foldersTree_foldermove, this);
	this.foldersTree.on('folderdrop', this.foldersTree_folderdrop, this);
	this.foldersTree.on('afterrender', this.foldersTree_state, this);

	this.tagsPanel.on('tagselect', this.tagsPanel_tagselect, this);

	this.tagsPanel.on('tagedit', this.tagsPanel_tagedit, this);

	this.tagsPanel.on('tagremove', this.tagsPanel_tagremove, this);

	Ext.MessageBox.getDialog().on("show", function(d) {
				var div = Ext.get(d.el);
				div.setStyle("overflow", "auto");
				var text = div.select(".ext-mb-textarea", true);
				if (!text.item(0))
					text = div.select(".ext-mb-text", true);
				if (text.item(0))
					text.item(0).dom.select();
			});
};

Ext.extend(utils.km.file.FileManager, Ext.Panel, {
	createWindow : function(config, cls) {
		var desktop = WorkBench.Desk.getDesktop();
		var win = desktop.getWindow(config.id);
		if (!win) {
			win = desktop.createWindow(config, cls)
		}
		return win;
	},

	filemanager_show : function() {
		this.initToolbar(this.tbar);
		this.initAddressBar(this.tbar);
		this.initMenues();
		this.initKeyboard();
		this.cover = this.body.findParent('.x-window-bwrap');
	},

	filemanager_resize : function(win, width, height) {
		if (!this.resizeElementsTag) {
			this.resizeElementsTag = true;
			this.filesView.ownerCt.body.setStyle("overflow", "hidden")
		}
		this.filesView.loadView.defer(200, this.filesView);
		if (this.addressCombo)
			this.addressCombo.setWidth(width - 250);
	},

	filesView_load : function(grd) {

		this.currentFolderId = this.filesView.currentFolderId;
		this.CurrentFolderReadOnly = this.filesView.currentFolderReadOnly;
		this.currentFolderType = this.filesView.currentFolderType;
		this.currentPath = this.filesView.currentPath;

		// update UI
		this.setupHistory();
		this.setupToolBar();
		this.setupView();
		this.setupAddressBar();

		if (this.currentFolderType == utils.km.file.FolderType.TagsFolder
				|| this.currentFolderType == utils.km.file.FolderType.SearchResults) {
			if (this.foldersTree.loaded)
				this.foldersTree.clearSelections();
			else
				this.foldersTree.loadTree();
			return;
		} else {
			// TODO zhe
			if (this.foldersTree.getFolderById(this.currentFolderId))
				this.foldersTree.selectFolderById(this.currentFolderId);
			else
				this.foldersTree.loadTree();
		}
	},

	foldersTree_load : function() {
		if (this.foldersTree.getFolderById(this.currentFolderId))
			this.foldersTree.selectFolderById(this.currentFolderId);
		else if (this.folderToRefresh) {
			this.showFolder(this.folderToRefresh);
			delete this.folderToRefresh;
		} else
			this.showFolder(this.foldersTree.getMyFoldersRoot().ID);
	},

	foldersTree_click : function(nodeId) {
		this.loadFiles(nodeId);
	},

	getFolderMenu : function(folder) {
		var menu = null;
		if (folder.CanWrite != true)
			return menu;
		switch (folder.Type) {
			case utils.km.file.FolderType.RootFolder :
				menu = this.rootMenu;
				break;

			case utils.km.file.FolderType.FileFolder :
			case utils.km.file.FolderType.MyDocuments :
				if (this.belongToRecycleBin(folder.ID)) {
					menu = this.recyclebinItemsMenu
				} else {
					menu = this.folderMenu;
				}
				break;

			case utils.km.file.FolderType.SharedFolder :
				menu = this.sharedFolderMenu;
				break;

			case utils.km.file.FolderType.PhotoGallery :
				menu = this.galleryMenu;
				break;

			case utils.km.file.FolderType.PhotoAlbum :
				menu = this.albumMenu;
				break;

			case utils.km.file.FolderType.SharedAlbum :
				menu = this.sharedAlbumMenu;
				break;

			case utils.km.file.FolderType.RecycleBin :
				menu = this.recyclebinMenu;
				break;
			case utils.km.file.FolderType.Published :
			case utils.km.file.FolderType.PublishedItems :
				menu = this.publishMenu;
				break;
			case utils.km.file.FolderType.PublishedFolders :
				menu = this.publishFolderMenu;
				break;
			default :
		}
		return menu;
	},

	foldersTree_contextmenu : function(node, e) {
		var folder = this.foldersTree.getNodeFolder(node);
		this.contextFolders = new Array();
		this.contextFolders[0] = folder;
		var menu = this.getFolderMenu(folder);
		if (menu)
			menu.show(node.ui.getAnchor())
	},

	foldersTree_foldermove : function(folder, targetFolder) {
		this.move([folder], null, targetFolder);
	},

	foldersTree_folderdrop : function(targetFolder, de) {
		if (de.data && de.data.selections && de.data.selections.length > 0) {
			var record = de.data.selections[0];
			if (record.data.directory != null) { // this means drag source is
				// ftp
				this.ftpClient.downloadSelected(targetFolder.ID);
			} else if (record.data.name != null) { // this means drag source is
				// file manager
				if (this.currentFolderId != targetFolder.ID)
					de.cancel = !this.move(this.filesView.getSelectedFolders(),
							this.filesView.getSelectedFiles(), targetFolder);
			}
		} else if (de.dropNode) {// From Tree
			de.cancel = !this
					.move([this.foldersTree.getFolderById(de.dropNode.id)],
							null, targetFolder);
		}
	},

	loadFiles : function(folderId) {
		this.filesView.loadView(folderId);
	},

	showFolder : function(folderId) {
		this.filesView.loadView(folderId);
	},

	refreshView : function() {
		this.filesView.loadView(this.currentFolderId);
	},

	refreshTree : function() {
		this.foldersTree.loadTree();
	},

	refreshAddressBar : function() {
		RemoteMethods.GetCompletePathList(function(result) {
					this.addressCombo.store.loadData(result);
					this.allFolders = result;
				}, this);
	},

	refreshAll : function() {
		this.saveState(function() {
					this.refreshView();
					this.refreshTree();
				}, this);
	},

	filesView_dblclick : function(grd, index, e) {

		if (this.belongToRecycleBin()) {
			this.showSelectedItemsProperties();
		} else {
			if (this.filesView.getSelectedFolders().length > 0)
				this.showFolder(this.filesView.getSelectedFolders()[0].ID);
			else
				this.openFile(this.filesView.getSelectedFiles()[0]);
		}

	},

	openFile : function(file) {

		var fileName = file.Name;

		if (fileName.match(/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$/i)) {
			this.viewImage(file);
		} else if (fileName
				.match(/\.mp3$|\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$/i)) {
			this.playMedia(file);
		} else if (fileName.match(/\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$/i)
				&& (Ext.isIE === true)) {
			this.playMedia(file);
			// } else if (fileName
			// .match(/\.doc$|\.rtf$|\.odt$|\.sxw$|\.html$|\.htm$|\.txt$|\.xls$|\.sxc$/i))
			// {
			// this.editFile(file)
			// } else if (fileName.match(/\.ppt$|\.pps$/i)) {
			// this.editFile(file, 800, 600)
			// }
		} else if (fileName.match(/\.pdf$|\.ps$/i)) {
			this.showPDF(file);
			// } else if (fileName.match(/\.dwf$/i)) {
			// this.showDWF(file);
		} else {
			Ext.Msg.show({
						title : '下载'.loc() + ' "' + file.Name + '"?',
						msg : '确认下载'.loc() + ' "' + file.Name + '"?',
						buttons : Ext.Msg.YESNO,
						icon : Ext.MessageBox.QUESTION,
						modal : false,
						scope : this,
						fn : function(btn) {
							if (btn == 'yes') {
								this.download(file.ID);
							}
						}
					});
		}
	},

	viewImage : function(file) {
		using("utils.km.file.viewer.slide");
		loadcss("utils.km.file.viewer.slide");
		if (Ext.isIE6) {
			loadcss("utils.km.file.viewer.ie6");
		}

		var images = this.filesView.store.query("name",
				/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$/i);
		var imgs = [];
		images.each(function(rec) {
					var id = rec.get("id");
					var src = '/utils/km/file/download.jcp?FolderID='
							+ this.currentFolderId + '&FileID=' + id;
					var cfg = {
						//tagName : 'a', //delete by zhang
						name : rec.get("name"),
						title : rec.get("name"),
						href : src,
						src : src,
						thumbnail : src + '&thumbnail=true',
						id : id,
						onclick : function() {
							Ext.hstz.expandx(this);
							return false;
						}
					}
					if (file.ID == id) {
						Ext.apply(file, cfg);
					}
					imgs.push(cfg);
				}, this);
		Ext.hstz.updateAnchors(imgs);
		Ext.hstz.expandx(file);
		return false;
	},

	filesView_select : function(view, selections) {
		var folders = view.getSelectedFolders();
		var files = view.getSelectedFiles();
		var folderIds = new Array();
		var fileIds = new Array();
		var folderIndex = 0;
		var fileIndex = 0;
		var folder = null;
		var file = null;

		var totalSize = 0;
		var title = "";
		var created = null;
		var modified = null;
		var comment = "";
		var path = "";
		var status = "";
		var tags = "";

		if (folders == null)
			folders = new Array();

		if (files == null)
			files = new Array();

		while (folder = folders[folderIndex]) {
			folderIds[folderIndex] = folder.ID;
			folderIndex++;
		}

		while (file = files[fileIndex]) {
			fileIds[fileIndex] = file.ID;
			fileIndex++;
			totalSize += file.Size;
		}

		var CreateStatusString = function(s) {
			switch (s) {
				case utils.km.file.ObjectStatus.Shared :
					return '共享'.loc();

				case utils.km.file.ObjectStatus.Published :
					return '发布'.loc();

				case utils.km.file.ObjectStatus.SharedPublished :
					return '共享并发布'.loc();

				default :
					return "";
			}
		};

		if (folderIndex == 0 && fileIndex == 1) {
			file = files[0];
			title = file.Name;
			created = file.CreateDate;
			modified = file.LastModified;
			path = file.Path + "\\" + file.Name;
			totalSize = file.Size;
			comment = file.Description;
			tags = file.Tags;
			status = CreateStatusString(file.Status);
		} else if (folderIndex == 1 && fileIndex == 0) {
			folder = folders[0];
			title = folder.Name;
			created = folder.CreateDate;
			modified = folder.CreateDate;
			path = folder.Path;
			comment = folder.Description;
			tags = folder.Tags;
			status = CreateStatusString(folder.Status);
		} else if (fileIndex + folderIndex > 1) {
			title = '选中'.loc() + (fileIndex + folderIndex) + ' 项'.loc();
		}

		Ext.get('pp-title').dom.innerHTML = title.ellipse(30);
		Ext.get('pp-created').dom.innerHTML = created ? Ext.util.Format.date(
				created, 'm/d/Y H:i') : '';
		Ext.get('pp-modified').dom.innerHTML = modified ? Ext.util.Format.date(
				modified, 'm/d/Y H:i') : '';
		Ext.get('pp-path').dom.innerHTML = path.ellipse(60);
		Ext.get('pp-size').dom.innerHTML = Utility.formatSize(totalSize);
		Ext.get('pp-comment').dom.innerHTML = comment
				? comment.ellipse(35)
				: "";
		Ext.get('pp-status').dom.innerHTML = status;
		Ext.get('pp-tags').dom.innerHTML = tags;
	},
	filesView_item_contextmenu : function(grd, e) {
		this.contextFolders = grd.getSelectedFolders();
		this.contextFiles = grd.getSelectedFiles();

		e.stopEvent();
		var coords = e.getXY();
		var selectionCount = this.contextFolders.length
				+ this.contextFiles.length;

		// return if nothing is selected
		if (selectionCount == 0)
			return;

		var ctype = this.belongToRecycleBin()
				? utils.km.file.FolderType.RecycleBin
				: this.currentFolderType;
		if (selectionCount == 1) {
			if (this.contextFolders.length == 1) {// folder
				var folder = this.contextFolders[0];
				var menu = this.getFolderMenu(folder);
				if (menu)
					menu.showAt([coords[0], coords[1]]);
			} else {// file
				switch (ctype) {
					case utils.km.file.FolderType.PublishedItems :
					case utils.km.file.FolderType.PublishedFolders :
						this.publishedFileMenu.showAt([coords[0], coords[1]]);
						break;
					case utils.km.file.FolderType.SharedDocuments :
					case utils.km.file.FolderType.SharedFolder :
					case utils.km.file.FolderType.SharedAlbums :
					case utils.km.file.FolderType.SharedAlbum :
						this.sharedFileMenu.showAt([coords[0], coords[1]]);
						break;
					case utils.km.file.FolderType.RecycleBin :
						this.recyclebinItemsMenu.showAt([coords[0], coords[1]]);
						break;
					default :
						this.fileMenu.showAt([coords[0], coords[1]]);
				}
			}
		} else {
			switch (ctype) {
				case utils.km.file.FolderType.RecycleBin :
					this.recyclebinItemsMenu.showAt([coords[0], coords[1]]);
					break;

				case utils.km.file.FolderType.FileFolder :
				case utils.km.file.FolderType.RootFolder :
				case utils.km.file.FolderType.PhotoGallery :
				case utils.km.file.FolderType.PhotoAlbum :
				case utils.km.file.FolderType.SearchResults :
				case utils.km.file.FolderType.TagsFolder :
					this.multipleItemsMenu.showAt([coords[0], coords[1]]);
					break;
				case utils.km.file.FolderType.SharedDocuments :
				case utils.km.file.FolderType.SharedFolder :
				case utils.km.file.FolderType.SharedAlbums :
				case utils.km.file.FolderType.SharedAlbum :
					this.sharedItemsMenu.showAt([coords[0], coords[1]]);
					break;
			}
		}
	},

	belongToRecycleBin : function(id) {
		var root = this.foldersTree.getRootNode();
		var node = this.foldersTree.getNodeById(id || this.currentFolderId);
		var r = utils.km.file.FolderType.RecycleBin;
		while (node && node != root) {
			if (node.attributes['type'] == r) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	},

	filesView_itemdrop : function(de) {
		var targetFolderId = null;
		var targetFolder = null;

		if (de.rowIndex === false) {
			targetFolderId = this.currentFolderId;
			targetFolder = this.foldersTree.getFolderById(targetFolderId);
		} else {
			var data = this.filesView.store.getAt(de.rowIndex).data;
			targetFolderId = data.id;
			targetFolder = this.filesView.getRowFolder(data);
		}
		if (targetFolder == null)
			return;
		if (de.data && de.data.selections && de.data.selections.length > 0) {
			var record = de.data.selections[0];
			if (record.data.directory != null) { // this means drag source is
				// ftp
				this.ftpClient.downloadSelected(targetFolderId);
			} else if (record.data.name != null) { // this means drag source is
				// file manager
				if (this.currentFolderId != targetFolderId)
					this.move(this.filesView.getSelectedFolders(),
							this.filesView.getSelectedFiles(), targetFolder);
			}
		} else if (de.data && de.data.node) { // this means that drag source
			// is a tree
			this.move([this.foldersTree.getNodeFolder(de.data.node)], null,
					targetFolder);
		}
	},
	saveState : function(callback, scope) {
		var marr = [];
		var find = function(node, arr) {
			if (node.isExpandable() && node.isExpanded() && node.type != '6') {
				var childExpand = false;
				for (var i = 0, cs = node.childNodes, len = cs.length; i < len; i++)
					childExpand |= find(cs[i], arr);
				!childExpand && arr.push(node.id);
				return true;
			}
			return false;
		}
		find(this.foldersTree.getRootNode(), marr);
		RemoteMethods.SavePathState(marr.join(";"), callback, scope);
	},
	foldersTree_state : function(tree) {
		var win = tree.findParentByType("window");
		if (win) {
			Ext.onUnload(this, this.saveState, null);
			win.on("close", function() {
						Ext.unUnload(this, this.saveState, null);
						this.saveState();
					}, this);
		}
	},
	tagsPanel_tagselect : function(tag) {
		var folderId = 'TagsFolder:' + tag
		this.showFolder(folderId);
	},

	tagsPanel_tagedit : function() {
		this.showFolder(this.currentFolderId);
	},

	tagsPanel_tagremove : function() {
		this.showFolder();
	},

	search : function(keyword) {
		var folderId = 'SearchResults:' + keyword
		this.showFolder(folderId);
	},

	changeView : function(view) {

		if (view)
			this.currentView = view;
		else if (this.currentView == 'album')
			this.currentView = 'thumbs';
		else if (this.currentView == 'thumbs')
			this.currentView = 'tiles';
		else if (this.currentView == 'tiles')
			this.currentView = 'icons';
		else if (this.currentView == 'icons')
			this.currentView = 'details';
		else if (this.currentView == 'details')
			this.currentView = 'album';
		else
			this.currentView = this.settings.CurrentView;

		if (this.currentView != 'album') {
			this.filesView.setupView(this.currentView);
			RemoteMethods.SaveFileManagerSetting(
					utils.km.file.FileManagerSetting.CurrentView,
					this.currentView);
		}

		this.setupView(this.currentView);
	},
	menuButton : {},
	initMenuButton : function() {
		var mbar = this.getTopToolbar();
		var tbar = this.toolbar;
		var getChild = function(obj, name) {
			if (obj.menu)
				obj = obj.menu;
			if (obj.items) {
				var os = obj.items.items;
				for (var o in os) {
					var p = getChild(os[o], name);
					if (p != null)
						return p;
				}
			} else if (obj.name == name) {
				return obj;
			}
			return null;
		}
		this.menuButton['tbBack'] = [getChild(mbar, 'tbBack'),
				getChild(tbar, 'tbBack')];
		this.menuButton['tbForward'] = [getChild(mbar, 'tbForward'),
				getChild(tbar, 'tbForward')];
		this.menuButton['tbUp'] = [getChild(mbar, 'tbUp'),
				getChild(tbar, 'tbUp')];

		this.menuButton['edit'] = [getChild(tbar, 'tbPaste'),
				getChild(tbar, 'tbMultipleUpload'), getChild(tbar, 'tbDelete'),
				getChild(tbar, 'tbCut'), getChild(mbar, 'tbPaste'),
				getChild(mbar, 'tbMultipleUpload'), getChild(mbar, 'tbDelete'),
				getChild(mbar, 'tbCut'), getChild(mbar, 'tbCreateFolder'),
				getChild(mbar, 'tbRename')];

	},
	setButtonDisable : function(name, disable) {
		Ext.each(this.menuButton[name], function(m) {
					m[disable ? "disable" : "enable"]();
				}, this)
	},
	setupToolBar : function() {
		this.setButtonDisable('edit', this.CurrentFolderReadOnly);
	},
	setupHistory : function() {
		this.history.addEntry(this.currentFolderId);
		this.setButtonDisable('tbBack', !this.history.canGoBack())
		this.setButtonDisable('tbForward', !this.history.canGoForward())
		this.setButtonDisable('tbUp', !this.foldersTree
						.getParentFolder(this.currentFolderId));

	},
	goBack : function() {
		if (this.history.goBack())
			this.showFolder(this.history.getCurrentEntry());
	},

	goForward : function() {
		if (this.history.goForward())
			this.showFolder(this.history.getCurrentEntry());
	},

	goUp : function() {
		var parent = this.foldersTree.getParentFolder(this.currentFolderId);
		if (parent)
			this.showFolder(parent.ID);
	},

	setupView : function(view) {
		var pnl = this.getComponent('db-fv-panel');

		var albumMode = false;

		if (albumMode && view) {
			if (view !== 'album')
				this.disableAlbumView = true;
			else
				this.disableAlbumView = false;
		}

		if (!albumMode || this.disableAlbumView) {
			pnl.layout.setActiveItem(0);
		} else {
			pnl.layout.setActiveItem(1);
			this.setupPhotoGallery();
		}

		var miAlbum = this.menuChangeView.items.get('mi-changeview-album');
		if (albumMode)
			miAlbum.show();
		else
			miAlbum.hide();
		this.filesView.readOnly = this.CurrentFolderReadOnly;
		if (this.currentFolderType === utils.km.file.FolderType.SearchResults
				|| this.currentFolderType === utils.km.file.FolderType.TagsFolder) {
			this.filesView.getColumnModel().setHidden(1, false);
		} else {
			this.filesView.getColumnModel().setHidden(1, true);
		}

	},

	setupPhotoGallery : function() {

		var pnl = this.getComponent('db-fv-panel');

		var galleryEl = pnl.items.items[1].body;

		if (this.currentFolderType == utils.km.file.FolderType.PhotoAlbum
				|| this.currentFolderType == utils.km.file.FolderType.SharedAlbum) {
			var photos = this.filesView.getAllFiles();
			galleryEl.dom.innerHTML = '';
			using('utils.km.file.SlideShow');
			using('utils.km.file.PhotoAlbum');
			var myAlbum = new utils.km.file.PhotoAlbum(galleryEl.dom, 80, 60,
					photos);
			if (photos.length > 0) {
				myAlbum.init();
				myAlbum.resize(galleryEl.getWidth(), galleryEl.getHeight());
				myAlbum.displayImage(0);
				pnl.on('resize', function() {
					myAlbum.resize(galleryEl.getWidth(), galleryEl.getHeight());
				}, this);
			}
		} else if (this.currentFolderType == utils.km.file.FolderType.PhotoGallery
				|| this.currentFolderType == utils.km.file.FolderType.SharedAlbums) {
			galleryEl.dom.innerHTML = '';
			using('utils.km.file.PhotoGallery');
			var myGallery = new utils.km.file.PhotoGallery(galleryEl.dom, 80,
					60, this.filesView.getAllFolders(), function(albumId) {
						this.showFolder(albumId);
					}, this);
			myGallery.init();
			myGallery.resize(galleryEl.getWidth(), galleryEl.getHeight());
		}
	},

	setupAddressBar : function() {
		this.addressCombo.setValue(this.currentPath);
	},

	createFolder : function(parentId) {
		Ext.MessageBox.prompt('新建文件夹'.loc(), '输入文件夹名称:'.loc(), function(btn,
						text) {
					if (btn != 'ok')
						return;

					if (text != '') {
						RemoteMethods.CreateFolder(parentId, text,
								this.refreshAll, this);
					}
				}, this); // end of show dialog
	},

	renameFolder : function(folder) {
		Ext.Msg.show({
			title : '改名文件夹'.loc(),
			msg : '输入文件夹名称:'.loc(),
			buttons : Ext.MessageBox.OKCANCEL,
			prompt : true,
			width : 250,
			value : folder.Name,
			scope : this,
			modal : false,
			fn : function(btn, text) {
				if (btn != 'ok')
					return;

				if (text != '') {
					RemoteMethods.RenameFolder(folder.ID, text,
							function(result) {
								if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
									this.refreshAll();
								} else {
									this.showError(result.Description);
								}
							}, this); // end of service call
				}
			}
		}); // end of show dialog
	},

	renameFile : function(file) {
		Ext.Msg.show({
			title : '改名文件'.loc(),
			msg : '请输入新文件名:'.loc(),
			buttons : Ext.MessageBox.OKCANCEL,
			prompt : true,
			width : 250,
			value : file.Name,
			modal : false,
			scope : this,
			fn : function(btn, text) {
				if (btn != 'ok')
					return;
				if (text != '') {
					RemoteMethods.RenameFile(file.ID, text, function(result) {
						if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
							this.refreshView();
						} else {
							this.showError(result.Description);
						}
					}, this); // end of service call
				}
			}
		}); // end of show dialog
	},

	commentFile : function(file) {
		Ext.Msg.show({
			title : '加入注释'.loc(),
			msg : '请输入注释:'.loc(),
			buttons : Ext.MessageBox.OKCANCEL,
			prompt : true,
			width : 300,
			multiline : true,
			value : file.Description,
			modal : false,
			scope : this,
			fn : function(btn, text) {
				if (btn != 'ok')
					return;

				if (text != '') {
					RemoteMethods.CommentFile(file.ID, text, function(result) {
						if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
							this.refreshView();
						} else {
							this.showError(result.Description);
						}
					}, this); // end of service call
				}
			}
		}); // end of show dialog
	},

	createAlbum : function() {
		var dlg = null;

		var txtTitle = new Ext.form.TextField({

					fieldLabel : '标题'.loc(),

					name : 'title',

					width : 220,

					allowBlank : false

				});

		var txtDescription = new Ext.form.TextArea({

					fieldLabel : '描述'.loc() + '(' + '可选'.loc() + ')',

					name : 'description',

					width : 270,

					height : 80

				});

		var CallServer = function() {
			var title = txtTitle.getValue();
			var description = txtDescription.getValue();

			if (title.trim() == '')
				return;
			dlg.buttons[0].disable();
			RemoteMethods.CreateAlbum(title, description, function(result) {
						dlg.close();
						this.refreshAll();
					}, this);
		};

		dlg = new Ext.Window({
					title : '创建新相册'.loc(),
					iconCls : 'db-icn-image',
					width : 300,
					height : 230,
					modal : true,
					renderTo : this.cover,
					minimizable : false,
					maximizable : false,
					bodyStyle : 'padding:5px 10px 0 10px',
					layout : 'fit',
					constrainHeader : true,

					items : new Ext.form.FormPanel({
								labelAlign : 'top',
								border : false,
								bodyStyle : 'background-color:Transparent',

								items : [txtTitle, txtDescription]
							}),

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

		dlg.show();
	},

	deleteItems : function(folders, files) {
		var folderIds = new Array();
		var fileIds = new Array();
		var folderIndex = 0;
		var fileIndex = 0;
		var folder = null;
		var file = null;

		if (folders == null)
			folders = new Array();

		if (files == null)
			files = new Array();
		var msg = "";
		if (folders.length == 0 && files.length == 0) {
			msg = this.createConfirmBoxContent("请选中要删除的文件或目录", "prompt.gif");
		} else {
			while (folder = folders[folderIndex]) {
				folderIds[folderIndex] = folder.ID;
				folderIndex++;
			}

			while (file = files[fileIndex]) {
				fileIds[fileIndex] = file.ID;
				fileIndex++;
			}

			var title = "";
			if (fileIndex + folderIndex > 1) {
				title = '确认多项删除'.loc();
				msg = this.createConfirmBoxContent('确认删除这些'.loc()
								+ (fileIndex + folderIndex) + " ?",
						"prompt.gif");
			} else {
				if (fileIndex == 1) {
					title = '确认删除文件'.loc();
					msg = this.createConfirmBoxContent('确认删除'.loc() + ' "'
									+ files[0].Name + '"?', "prompt.gif");
				} else {
					title = '确认删除目录'.loc();
					msg = this.createConfirmBoxContent('确认删除目录'.loc() + ' "'
									+ folders[0].Name + '" '
									+ '及目录下所有内容?'.loc(), "prompt.gif");
				}
			}
		}
		Ext.Msg.show({
			title : title,
			msg : msg,
			buttons : Ext.MessageBox.YESNO,
			width : 430,
			heigth : 80,
			modal : false,
			scope : this,
			fn : function(btn) {
				if (btn == 'yes') {
					this.showProgressDialog('删除中....'.loc());
					RemoteMethods.Delete(folderIds, fileIds, function(result) {
						if (result.CurrentStatus == utils.km.file.StatusCode.Error) {
							this.showError(result.Description);
						}
						this.hideProgressDialog();
						this.refreshAll();
					}, this); // end of service call
				}
			}// end of messagebox function call
		});
	},

	emptyRecycleBin : function() {
		var msg = this.createConfirmBoxContent('确认清空回收站?'.loc(), "prompt.gif");

		Ext.Msg.show({
			title : '回收站'.loc(),
			msg : msg,
			buttons : Ext.MessageBox.YESNO,
			width : 430,
			heigth : 80,
			modal : false,
			scope : this,
			fn : function(btn) {
				if (btn == 'yes') {
					this.showProgressDialog('清空回收站...'.loc());
					RemoteMethods.EmptyRecycleBin(function(result) {
						if (result.CurrentStatus == utils.km.file.StatusCode.Error) {
							this.showError(result.Description);
						}
						this.hideProgressDialog();
						this.refreshView();
					}, this);
				}
			}
		});
	},

	move : function(folders, files, parentFolder) {

		var folderIds = new Array();
		var fileIds = new Array();
		var folderIndex = 0;
		var fileIndex = 0;
		var folder = null;
		var file = null;
		var shared = true;

		if (folders == null) {
			folders = new Array();
		}

		if (files == null) {
			files = new Array();
		}

		var toRecycle = this.belongToRecycleBin(parentFolder.ID);
		while (folder = folders[folderIndex]) {
			folderIds[folderIndex] = folder.ID;
			folderIndex++;

			// 自己移动到自己里面是错误操作.
			if (folder.ID == parentFolder.ID) {
				return false;
			}
			// 共享的文件夹丢到回收站里直接删除.//blong
			if (toRecycle
					&& (folder.Type == utils.km.file.FolderType.SharedFolder || folder.Type == utils.km.file.FolderType.PublishedFolders)) {
				this.deleteItems(folders, files);
				return false;
			}
		}

		while (file = files[fileIndex]) {
			fileIds[fileIndex] = file.ID;
			fileIndex++;

			// 共享的文件丢到回收站里直接删除.//blong
			if (toRecycle
					&& (this.currentFolderType == utils.km.file.FolderType.SharedFolder || this.currentFolderType == utils.km.file.FolderType.SharedAlbum)) {
				this.deleteItems(folders, files);
				return false;
			}
		}

		if (fileIndex + folderIndex == 0)
			return false;

		if (!this.belongToRecycleBin() && toRecycle) {
			var msg = "";
			var title = "";
			if (fileIndex + folderIndex > 1) {
				title = '确认删除所选项'.loc();
				msg = this.createConfirmBoxContent('确实要把 '.loc()
								+ (fileIndex + folderIndex) + '放到回收站?'.loc(),
						"delete_recyclebin.gif");
			} else {
				if (fileIndex == 1) {
					title = '确认删除文件'.loc();
					msg = this.createConfirmBoxContent('确实要把'.loc() + ' "'
									+ files[0].Name + '" ' + '放到回收站?'.loc(),
							"delete_recyclebin.gif");
				} else {
					title = '确认删除文件夹'.loc();
					msg = this.createConfirmBoxContent('确实要把'.loc() + '"'
									+ folders[0].Name + '" '
									+ '文件夹和所有内容放到回收站?'.loc(),
							"delete_recyclebin.gif");
				}
			}
			Ext.Msg.show({
						title : title,
						msg : msg,
						buttons : Ext.MessageBox.YESNO,
						width : 430,
						heigth : 80,
						modal : false,
						scope : this,
						fn : function(btn) {
							if (btn == 'yes')
								this.moveItems(folderIds, fileIds,
										parentFolder.ID);
							else {
								this.refreshAll();
							}
						}
					});
		} else {
			this.moveItems(folderIds, fileIds, parentFolder.ID);
		}
		return true;
	},

	moveToRecycleBin : function(folders, files) {
		var rb = this.foldersTree.getRecycleBin();
		if (rb)
			this.move(folders, files, rb);
		else
			this.deleteItems(folders, files);
	},

	moveItems : function(folderIds, fileIds, parentId) {
		RemoteMethods.Move(folderIds, fileIds, parentId, function(result) {
					if (result.CurrentStatus == utils.km.file.StatusCode.Error) {
						this.showError(result.Description);
					}
					this.refreshAll();
				}, this); // end of service call
	},

	copy : function(folders, files, targetFolder) {
		if (targetFolder.Type != utils.km.file.FolderType.RootFolder
				&& targetFolder.Type != utils.km.file.FolderType.FileFolder
				&& targetFolder.Type != utils.km.file.FolderType.PhotoGallery
				&& targetFolder.Type != utils.km.file.FolderType.PhotoAlbum
				&& targetFolder.Type != utils.km.file.FolderType.SharedFolder
				&& targetFolder.Type != utils.km.file.FolderType.SharedAlbum) {
			this.showError('在该目录下不允许拷贝文件.'.loc());
			return;
		}

		var folderIds = new Array();
		var fileIds = new Array();
		var folderIndex = 0;
		var fileIndex = 0;
		var folder = null;
		var file = null;

		if (folders == null)
			folders = new Array();

		if (files == null)
			files = new Array();

		while (folder = folders[folderIndex]) {
			folderIds[folderIndex] = folder.ID;
			folderIndex++;
		}

		while (file = files[fileIndex]) {
			fileIds[fileIndex] = file.ID;
			fileIndex++;
		}

		if (fileIndex + folderIndex == 0)
			return;

		this.showProgressDialog('拷贝中...'.loc());
		RemoteMethods.Copy(folderIds, fileIds, targetFolder.ID,
				function(result) {
					this.hideProgressDialog();
					if (result.CurrentStatus == utils.km.file.StatusCode.Error) {
						this.showError(result.Description);
					}
					this.refreshAll();
				}, this); // end of service call
	},

	cutSelected : function() {
		this.cutContext = {
			'folders' : this.filesView.getSelectedFolders(),
			'files' : this.filesView.getSelectedFiles()
		}
	},

	cutFolder : function(folder) {
		this.cutContext = {
			'folders' : [folder],
			'files' : []
		}
	},

	copySelected : function() {
		this.copyContext = {
			'folders' : this.filesView.getSelectedFolders(),
			'files' : this.filesView.getSelectedFiles()
		}
	},

	copyFolder : function(folder) {
		this.copyContext = {
			'folders' : [folder],
			'files' : []
		}
	},

	paste : function(folder) {
		if (this.copyContext) {
			this.copy(this.copyContext.folders, this.copyContext.files, folder);
		} else if (this.cutContext) {
			this.move(this.cutContext.folders, this.cutContext.files, folder);
		}

		this.copyContext = null;
		this.cutContext = null;
	},

	pasteOnSelected : function() {
		var folder = this.foldersTree.getSelectedFolder();
		this.paste(folder);
	},

	downloadSelected : function() {
		var files = this.filesView.getSelectedFiles();
		if (files.length > 0)
			this.download(files[0].ID);
		else
			this.showError('请选择一个文件'.loc())
	},

	deleteSelected : function(forceToDelete) {
		var files = this.filesView.getSelectedFiles();
		var folders = this.filesView.getSelectedFolders();

		if (this.belongToRecycleBin() || forceToDelete)
			this.deleteItems(folders, files);
		else
			this.moveToRecycleBin(folders, files);
	},

	addFolder : function() {
		switch (this.currentFolderType) {
			case utils.km.file.FolderType.RootFolder :
			case utils.km.file.FolderType.FileFolder :
				this.createFolder(this.currentFolderId);
				break;

			case utils.km.file.FolderType.PhotoGallery :
				this.createAlbum();
				break;

			default :
				break;
		}
	},

	renameSelected : function() {
		var files = this.filesView.getSelectedFiles();
		var folders = this.filesView.getSelectedFolders();

		if (this.belongToRecycleBin()) {
			Ext.msg("error", "回收站内文件不允许改名");
			return;
		}

		if (folders.length > 0) {
			switch (folders[0].Type) {

				case utils.km.file.FolderType.PhotoAlbum :
				case utils.km.file.FolderType.FileFolder :
					this.renameFolder(folders[0]);
					break;

				default :
					break;
			}
			return;
		}

		if (files.length > 0)
			this.renameFile(files[0]);
	},

	selectAllItems : function() {
		this.filesView.selectAll();
	},

	download : function(fileId) {
		if (this.belongToRecycleBin())
			this.showError('不允许从回收站下载文件.'.loc());
		else
			window.location = this.settings.BaseTransferUrl
					+ '/utils/km/file/download.jcp?FileID=' + fileId + '&att='
					+ Math.random();
	},

	upload : function() {
		if (this.uploadDialog) {
			this.uploadDialog.params.FolderID = this.currentFolderId;
			this.uploadDialog.show();
			return;
		}

		/*
		 * using("utils.km.file.MultiUploadDialog"); this.uploadDialog = new
		 * utils.km.file.UploadDialog({ title : '上传文件'.loc(), url :
		 * this.settings.BaseTransferUrl + '/utils/km/file/upload.jcp', params : {
		 * FolderID : this.currentFolderId } }); this.uploadDialog.show();
		 * return;
		 */
		using("utils.km.file.UploadDialog");
		this.uploadDialog = new utils.km.file.UploadDialog({
					filePostName : 'file-upload',
					title : '上传文件'.loc(),
					url : this.settings.BaseTransferUrl
							+ '/utils/km/file/upload.jcp',
					params : {
						FolderID : this.currentFolderId
					}
				});
		this.uploadDialog.on('complete', function() {
					this.refreshView();
				}, this);
		this.uploadDialog.show();
		this.on("beforedestroy", function() {
					this.uploadDialog.destroy();
				}, this)
	},

	playMp3 : function(file) {
		this.app.getModule('apps-module').openAudioPlayer(file);
	},
	playMedia : function(file) {
		using('utils.km.file.MediaPlayer')
		var player = this.createWindow({
					id : 'media-player-' + file.ID,
					iconCls : 'db-icn-play',
					url : '/utils/km/file/download.jcp?FileID=' + file.ID
							+ '&att=1&FileName=' + file.Name,
					fileName : file.Name,
					closeAction : 'close'
				}, utils.km.file.MediaPlayer);
		player.show();
	},
	showPDF : function(file) {

		var filePath = '/utils/km/file/download.jcp?FileID=' + file.ID;
		var embedStr = '<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" width="100%" height="100%"><param name="src" value="'
				+ filePath
				+ '"><embed src="'
				+ filePath
				+ '"  width="100%" height="100%"><noembed> Your browser does not support embedded PDF files.</noembed></embed></object>'

		var dlg = this.createWindow({
					id : 'pdf-viewer-' + file.ID,
					iconCls : 'db-icn-adobe',
					constrainHeader : true,
					width : 800,
					height : 600,
					title : file.Name,
					html : embedStr
				});

		dlg.show();
	},

	tagItems : function(folders, files) {

		var folderIds = new Array();
		var fileIds = new Array();
		var folderIndex = 0;
		var fileIndex = 0;
		var folder = null;
		var file = null;

		if (folders == null)
			folders = new Array();

		if (files == null)
			files = new Array();

		while (folder = folders[folderIndex]) {
			folderIds[folderIndex] = folder.ID;
			folderIndex++;
		}

		while (file = files[fileIndex]) {
			fileIds[fileIndex] = file.ID;
			fileIndex++;
		}

		if (fileIndex + folderIndex == 0)
			return;

		this.tagsPanel.tagItems(folderIds, fileIds);
	},

	shareFolder : function(folder) {
		// if ( folder.Type != utils.km.file.FolderType.FileFolder &&
		// folder.Type != utils.km.file.FolderType.PhotoAlbum)
		// return;

		var p = {
			instanceId : folder.ID
		};
		var conn = new Ext.data.Connection();
		conn.request({
					method : 'GET',
					url : '/bin/user/getOrg.jcp?'
				});
		conn.on('requestcomplete', function(conn, oResponse) {
			var orgJSON = Ext.decode(oResponse.responseText);
			var name = orgJSON.shortName;
			if (name == "") {
				name = orgJSON.name;
			}
			using("utils.km.file.AuthFramePanel");
			using("utils.km.file.AuthPanel");
			p.rootId = orgJSON.id;
			p.rootName = name;
			var pf = new utils.km.file.AuthFramePanel(p);
			pf.init(p.instanceId);
			var sharingDialog = this.createWindow({
						id : 'share-folder',
						width : 700,
						height : 500,
						layout : 'fit',
						title : '共享'.loc() + ' "' + folder.Name + '" '
								+ '文件夹'.loc(),
						iconCls : 'db-icn-group',
						folderId : folder.ID,
						maximizable : false,
						items : pf.MainTabPanel
					});

			sharingDialog.on('save', function(fId, users) {
				this.refreshAll();

				// there is nobody to notify
				if (users.length == 0)
					return;

				// send out emails
				this.showProgressDialog('发送通知邮件...'.loc());
				RemoteMethods.SendSharingNotificationEmails(folder.ID, users,
						function(result) {
							this.hideProgressDialog();
							if (result.CurrentStatus != utils.km.file.StatusCode.Success) {
								this.showError(result.Description);
							}
						}, this);
			}, this);
			sharingDialog.show();
		}, this);

	},

	publishFile : function(file) {
		using("utils.km.file.PublishedFile");
		var pf = this.createWindow({
					id : 'publish-item',
					title : '发布'.loc() + ' "' + file.Name + '" '.loc() + '文件到：',
					iconCls : 'db-icn-world',
					resizable : false,
					modal : true,
					closable : false,
					constrainHeader : true,
					maximizable : false,
					bodyStyle : "padding:5px",
					y : 30,
					fileId : file.ID
				}, utils.km.file.PublishedFile);

		pf.on('publish', this.refreshView, this);
		pf.show();
	},

	unPublishFile : function(file) {
		Ext.MessageBox.confirm('撤销发布的'.loc() + '"' + file.Name + '"'
						+ '文件'.loc(), '确认撤销'.loc() + ' "' + file.Name + '" '
						+ '的发布?'.loc(), function(btn) {
					if (btn == 'yes') {
						RemoteMethods.UnPublishFile(file.ID, function(result) {
							if (result.CurrentStatus == utils.km.file.StatusCode.Success)
								this.refreshView();
							else
								this.showError(result.Description);
						}, this);
					}
				}, this);
	},

	uploadFromUrl : function() {

		var ufu = this.createWindow({
					title : '由Url上传文件'.loc(),
					id : "upload-from-url",
					iconCls : 'db-icn-upload-url',
					resizable : false,
					constrainHeader : true,
					maximizable : false,
					folderId : this.currentFolderId
				}, utils.km.file.UploadFromUrl);

		ufu.on('upload', function(wnd, folderId) {
					if (this.currentFolderId != folderId) {
						Ext.Msg.show({
									title : '上传完成?'.loc(),
									msg : '上传已经完成,查看吗?'.loc(),
									buttons : Ext.Msg.YESNO,
									icon : Ext.MessageBox.QUESTION,
									modal : false,
									scope : this,
									fn : function(btn) {
										if (btn == 'yes') {
											this.showFolder(folderId);
										}
									}
								});
					} else {
						this.refreshView();
					}
				}, this);

		ufu.on('error', function(win, msg) {
					this.showError(msg);
				}, this);

		ufu.show();
	},

	showProperties : function(query, title, width, heigth) {
		query += "&rnd=" + Math.round(10000 * Math.random())
		var conn = new Ext.data.Connection();
		Ext.Ajax.request({
			url : '/utils/km/file/getProperties.jcp?' + query + '',
			method : 'GET',
			scope : this,
			callback : function(options, success, response) {
				var result = Ext.util.JSON.decode(response.responseText);
				if (success) {
					var prop;
					if (query.indexOf("FolderID") != -1) {
						prop = '<table class="db-prop-lst">';
						prop += '<tr><td style="width:50px;">'
								+ '<img id="folderProperties_imgIcon" class="db-ft-medium db-ft-folder-medium" src="/themes/images/share/blank.gif" /></td>'
								+ '<td>'
								+ result.Name
								+ '</td></tr>'
								+ '<tr><td colspan="2"><hr /></td></tr>'
								+ '<tr><td>'
								+ '类型'.loc()
								+ ':</td><td>'
								+ result.fileType
								+ '</td></tr>'
								+ '<tr><td>'
								+ '位置'.loc()
								+ ':</td><td>'
								+ result.Path
								+ '</td></tr>'
								+ '<tr><td>'
								+ '大小'.loc()
								+ ':</td><td>'
								+ Utility.formatSize(result.Size)
								+ ' ('
								+ result.Size
								+ ' 字节'.loc()
								+ ')</td></tr>'
								+ '<tr><td>'
								+ '包含'.loc()
								+ ':</td><td>'
								+ '文件:'.loc()
								+ result.Files
								+ ','
								+ '文件夹'.loc()
								+ ':'
								+ result.Folders
								+ '</td></tr>'
								+ '<tr><td colspan="2"><hr /></td></tr>'
								+ '<tr><td>'
								+ '创建时间'.loc()
								+ ':</td><td>'
								+ (new Date(result.CreateDate))
										.format('F j, Y, g:i a') + '</td></tr>';
						prop += '</table>';
					} else {
						prop = '<table class="db-prop-lst">';
						prop += '<tr><td>' + '类型'.loc() + ':</td><td>'
								+ result.fileType + '</td></tr>' + '<tr><td>'
								+ '位置'.loc() + ':</td><td>' + result.Path
								+ '</td></tr>' + '<tr><td>' + '大小'.loc()
								+ ':</td><td>'
								+ Utility.formatSize(result.Size) + ' ('
								+ result.Size + ' 字节'.loc() + ')</td></tr>'
								+ '<tr><td>' + '包含'.loc() + ':</td><td>'
								+ '文件'.loc() + ':' + result.Files + ','
								+ '文件夹'.loc() + ':' + result.Folders
								+ '</td></tr>';
						prop += '</table>';
					}
					var dialog = this.createWindow({
								title : title,
								iconCls : 'db-icn-info',
								id : 'property-window-' + query,
								html : prop,
								buttons : [{
											text : '关闭'.loc(),
											handler : function() {
												dialog.close()
											}
										}],
								width : width,
								heigth : heigth,
								maximizable : false,
								resizable : false,
								constrainHeader : true,
								bodyStyle : 'padding:5px'
							});
					dialog.show();
				} else {
					var msg = (result && result.Message)
							? result.Message
							: '发生错误,请重试!'.loc();
					Ext.MessageBox.alert('Error', msg);
				}
			}
		});
		return false;
	},

	showFolderProperties : function(folder) {
		switch (folder.Type) {
			case utils.km.file.FolderType.RootFolder :
				return this.showAccountProperties();

			case utils.km.file.FolderType.FileFolder :
			case utils.km.file.FolderType.PhotoAlbum :
				return this.showProperties("FolderID=" + folder.ID, folder.Name
								+ " Properties", 320, 300);

			case utils.km.file.FolderType.PhotoGallery :
				return this.showProperties("FolderID=" + folder.ID,
						"Gallery Properties", 320, 300);

			case utils.km.file.FolderType.RecycleBin :
				return this.showProperties("FolderID=" + folder.ID,
						"Recycle Bin Properties", 320, 300);

			default :
				return;

		}
	},
	showAccountProperties : function() {
		this.showProperties("Account=1", "Account Properties", 610, 435);
	},
	showFileProperties : function(file) {
		this.showFilesProperties([file]);
	},
	showFilesProperties : function(files) {
		var prop = '<table class="db-prop-lst">';
		if (files.length == 1) {
			prop += '<tr><td style="width:50px;"><div class="db-ft-large db-ft-'
					+ files[0].icon
					+ '-large">&nbsp;</div></td><td>'
					+ files[0].Name
					+ '</td></tr>'
					+ '<tr><td colspan="2"><hr /></td></tr>'
					+ '<tr><td>'
					+ '类型'.loc()
					+ ':</td><td>'
					+ files[0].fileType
					+ '</td></tr>'
					+ '<tr><td>'
					+ '位置'.loc()
					+ ':</td><td>'
					+ files[0].Path
					+ '</td></tr>'
					+ '<tr><td>'
					+ '大小'.loc()
					+ ':</td><td>'
					+ Utility.formatSize(files[0].Size)
					+ ' ('
					+ files[0].Size
					+ ' 字节'.loc()
					+ ')</td></tr>'
					+ '<tr><td colspan="2"><hr /></td></tr>'
					+ '<tr><td>'
					+ '创建时间'.loc()
					+ ':</td><td>'
					+ (new Date(files[0].CreateDate)).format('F j, Y, g:i a')
					+ '</td></tr>'
					+ '<tr><td>'
					+ '修改时间'.loc()
					+ ':</td><td>'
					+ (new Date(files[0].LastModified)).format('F j, Y, g:i a')
					+ '</td></tr>';
		} else {
			var tp = '';
			var sz = 0;
			var ph = '';
			for (var i = 0; i < files.length; ++i) {
				tp = (tp == '' || files[i].fileType == tp)
						? files[i].fileType
						: '多种文件类型'.loc();
				sz += files[i].Size;
				ph = (ph == '' || files[i].Path == ph) ? files[i].Path : '多个目录'
						.loc();
			}
			prop += '<tr><td style="width:50px;"><div class="db-ft-medium db-ft-shared-docs-medium">&nbsp;</div></td><td>'
					+ files.length
					+ '个文件</td></tr>'
					+ '<tr><td colspan="2"><hr /></td></tr>'
					+ '<tr><td>'
					+ '类型'.loc()
					+ ':</td><td>'
					+ tp
					+ '</td></tr>'
					+ '<tr><td>'
					+ '位置'.loc()
					+ ':</td><td>'
					+ ph
					+ '</td></tr>'
					+ '<tr><td>'
					+ '大小'.loc()
					+ ':</td><td>'
					+ Utility.formatSize(sz)
					+ ' ('
					+ sz
					+ ' 字节'.loc()
					+ ')</td></tr>';
		}
		prop += '</table>';
		var shared = false;
		Ext.each(files, function(item) {
					/*
					 * if (item.Type == DigitalBucket.FolderType.SharedFolder ||
					 * item.Type == DigitalBucket.FolderType.SharedAlbum) shared =
					 * true;
					 */
				});
		var dialog = this.createWindow({
					title : (files.length == 1
							? files[0].Name
							: 'Multiple Files')
							+ ' Properties',
					iconCls : 'db-icn-info',
					cls : 'db-property-dialog',
					id : 'property-window-'
							+ (files.length == 1 ? files[0].ID : Math
									.floor(Math.random() * 1000)),
					buttons : [],
					width : 330,
					height : 350,
					layout : 'fit',
					maximizable : false,
					resizable : false,
					constrainHeader : true,
					border : false
				});
		if (this.settings.Metadata != null && this.settings.Metadata.length > 0
				&& (!shared || this.settings.SubUser)) {
			var fileIds = [];
			Ext.each(files, function(item, index) {
						fileIds[index] = item.ID;
					});
			var frm = new Ext.form.FormPanel({
						title : '属性'.loc(),
						labelAlign : 'top',
						defaults : {
							anchor : '-20'
						},
						defaultType : 'textfield'
					});
			dialog.add(new Ext.TabPanel({
						activeTab : 0,
						border : true,
						plain : true,
						bodyStyle : 'background-color: transparent;',
						defaults : {
							bodyStyle : 'padding: 5px;background-color: transparent;',
							autoScroll : true
						},
						items : [{
									title : 'General',
									html : prop
								}, frm]
					}));
			dialog.addButton({
						text : '确定'.loc(),
						handler : function() {
							var fp = [];
							for (var i = 0; i < this.settings.Metadata.length; ++i) {
								fp[fp.length] = {
									FieldID : this.settings.Metadata[i].FieldID,
									FieldValue : frm.getComponent(i).getValue()
								};
							}
							RemoteMethods.SaveFilesProperties(fileIds, fp,
									function() {
										dialog.close();
										this.refreshView();
									}, this);
						},
						scope : this
					});
			dialog.addButton({
						text : '取消'.loc(),
						handler : function() {
							dialog.close()
						}
					});
			RemoteMethods.GetFilesProperties(fileIds, function(result) {
				for (var i = 0; i < this.settings.Metadata.length; ++i) {
					var meta = this.settings.Metadata[i];
					var val = '';
					for (var j = 0; j < result.length; ++j) {
						if (result[j].FieldID == meta.FieldID) {
							val = result[j].FieldValue;
						}
					}
					frm.add({
								fieldLabel : this.settings.Metadata[i].FieldName,
								value : val
							});
				}
			}, this);
			dialog.doLayout();
			dialog.show();
		} else {
			dialog.add({
						border : true,
						bodyStyle : 'padding: 5px;',
						html : prop
					});
			dialog.addButton({
						text : '关闭'.loc(),
						handler : function() {
							dialog.close()
						}
					});
			dialog.show();
		}
	},
	showSelectedItemsProperties : function() {
		var files = this.filesView.getSelectedFiles();
		var folders = this.filesView.getSelectedFolders();
		if (files.length + folders.length == 0)
			return;
		if (files.length + folders.length == 1) {
			if (files.length == 1)
				this.showFileProperties(files[0]);
			else
				this.showFolderProperties(folders[0]);
			return;
		}
		if (folders.length == 0) {
			this.showFilesProperties(files);
			return;
		}
		var query = "";
		if (files.length > 0)
			query += "Files=";
		for (var i = 0; i < files.length; ++i)
			query += files[i].ID + ",";
		if (query != "")
			query += "&";
		if (folders.length > 0)
			query += "Folders=";
		for (var i = 0; i < folders.length; ++i)
			query += folders[i].ID + ",";
		this.showProperties(query, '多选项属性'.loc(), 320, 300);
	},

	showProgressDialog : function(message) {
		this.progressDialog = new Ext.Window({
					resizable : false,
					closable : false,
					maximizable : false,
					minimizable : false,
					constrainHeader : true,
					modal : true,
					renderTo : this.cover,
					width : 245,
					height : 90,
					title : '请等待...'.loc()

				});
		this.progressDialog.on('hide', function() {
					this.progressDialog.getEl().remove();
				}, this);

		// add dialog message
		this.progressDialog.body.createChild({
					tag : "div",
					cls : 'db-progress-bar',
					html : '<p>' + message + '</p><div><span>' + '载入中'.loc()
							+ '...</span></div>'
				});

		// show the dialog
		this.progressDialog.show();
	},

	hideProgressDialog : function() {
		this.progressDialog.close();
	},

	showError : function(message) {
		Ext.MessageBox.alert("Error", message);
	},

	createConfirmBoxContent : function(message, imageName) {
		var text = '<div style="padding:5px">';
		text += '<img src="/themes/images/' + imageName
				+ '" alt="" style="float:left;padding:5px 10px;" />';
		text += "<p>" + message + "</p>";
		text += '</div';
		return text;
	}

});

// folder type enumeration
utils.km.file.FolderType = function() {
	throw '无效操作'.loc();
}
utils.km.file.FolderType.None = 0;
utils.km.file.FolderType.RootFolder = 1;
utils.km.file.FolderType.RecycleBin = 2;
utils.km.file.FolderType.PhotoGallery = 3;
utils.km.file.FolderType.FileFolder = 4;
utils.km.file.FolderType.PhotoAlbum = 5;
utils.km.file.FolderType.MyNetwork = 6;
utils.km.file.FolderType.MyNetworkUser = 7;
utils.km.file.FolderType.SharedDocuments = 8;
utils.km.file.FolderType.SharedAlbums = 9;
utils.km.file.FolderType.SharedFolder = 10;
utils.km.file.FolderType.SharedAlbum = 11;
utils.km.file.FolderType.PublishedItems = 12;
utils.km.file.FolderType.PublishedFiles = 13;
utils.km.file.FolderType.PublishedFolders = 14;
utils.km.file.FolderType.SearchResults = 15;
utils.km.file.FolderType.TagsFolder = 16;
utils.km.file.FolderType.MyDocuments = 19;
utils.km.file.FolderType.Published = 20;

utils.km.file.StatusCode = function() {
	throw '无效操作'.loc();
}
utils.km.file.StatusCode.Error = 0;
utils.km.file.StatusCode.Success = 1;

utils.km.file.FileManagerSetting = function() {
	throw '无效操作'.loc();
}
utils.km.file.FileManagerSetting.CurrentView = 0;
utils.km.file.FileManagerSetting.CollapseFoldersPanel = 1;
utils.km.file.FileManagerSetting.CurrentHeight = 2;
utils.km.file.FileManagerSetting.SingleUploadMode = 3;

utils.km.file.ObjectStatus = function() {
	throw '无效操作'.loc();
}
utils.km.file.ObjectStatus.None = 0;
utils.km.file.ObjectStatus.Shared = 1;
utils.km.file.ObjectStatus.Published = 2;
utils.km.file.ObjectStatus.SharedPublished = 3;

utils.km.file.FileManager.prototype.initMenues = function() {
	var mibp = this.mibp;
	this.rootMenu = new Ext.menu.Menu();
	this.rootMenu.add({
				text : '新建文件夹'.loc(),
				iconCls : 'db-icn-folder-new',
				handler : function() {
					this.createFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			});

	this.folderMenu = new Ext.menu.Menu();
	this.folderMenu.add({
				text : '新建文件夹'.loc(),
				iconCls : 'db-icn-folder-new',
				handler : function() {
					this.createFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, '-', {
				text : '共享该文件夹...'.loc(),
				iconCls : 'db-icn-folder-share',
				handler : function() {
					this.shareFolder(this.contextFolders[0]);
				},
				scope : this
			},

			{
				text : '标签文件夹...'.loc(),
				iconCls : 'db-icn-tag-edit',
				handler : function() {
					this.tagItems(this.contextFolders, null);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copyFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders,
							this.contextFiles);
				},
				scope : this
			}, {
				text : '更名'.loc(),
				iconCls : 'db-icn-rename',
				handler : function() {
					this.renameFolder(this.contextFolders[0]);
				},
				scope : this
			});

	this.sharedFolderMenu = new Ext.menu.Menu();
	this.sharedFolderMenu.add({
				text : '新建文件夹'.loc(),
				iconCls : 'db-icn-folder-new',
				handler : function() {
					this.createFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copyFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders, null);
				},
				scope : this
			}, {
				text : '更名'.loc(),
				iconCls : 'db-icn-rename',
				handler : function() {
					this.renameFolder(this.contextFolders[0]);
				},
				scope : this
			});

	this.galleryMenu = new Ext.menu.Menu();
	this.galleryMenu.add({
				text : '新相册'.loc(),
				iconCls : 'db-icn-album-new',
				handler : function() {
					this.createAlbum();
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			});

	this.albumMenu = new Ext.menu.Menu();
	this.albumMenu.add({
				text : '改名'.loc(),
				iconCls : 'db-icn-album-edit',
				handler : function() {
					this.renameFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, '-', {
				text : '共享相册...'.loc(),
				iconCls : 'db-icn-album-share',
				handler : function() {
					this.shareFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '标签相册...'.loc(),
				iconCls : 'db-icn-tag-edit',
				handler : function() {
					this.tagItems(this.contextFolders, null);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copyFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders, null);
				},
				scope : this
			});

	this.sharedAlbumMenu = new Ext.menu.Menu();
	this.sharedAlbumMenu.add({
				text : '改名'.loc(),
				iconCls : 'db-icn-album-edit',
				handler : function() {
					this.renameFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copyFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders, null);
				},
				scope : this
			});

	this.recyclebinMenu = new Ext.menu.Menu();
	this.recyclebinMenu.add({
				text : '清空回收站'.loc(),
				iconCls : 'db-icn-bin-empty',
				handler : function() {
					this.emptyRecycleBin();
				},
				scope : this
			}, {
				text : '打开'.loc(),
				iconCls : 'db-icn-folder-open',
				handler : function() {
					this.showFolder(this.contextFolders[0]);
				},
				scope : this
			}, {
				text : '粘贴'.loc(),
				iconCls : 'db-icn-paste',
				handler : function() {
					this.paste(this.contextFolders[0]);
				},
				scope : this
			});
	this.publishMenu = new Ext.menu.Menu();
	this.publishMenu.add({
				text : '新建文件夹'.loc(),
				iconCls : 'db-icn-folder-new',
				handler : function() {
					this.createFolder(this.contextFolders[0].ID);
				},
				scope : this
			});
	this.publishFolderMenu = new Ext.menu.Menu();
	this.publishFolderMenu.add({
				text : '新建文件夹'.loc(),
				iconCls : 'db-icn-folder-new',
				handler : function() {
					this.createFolder(this.contextFolders[0].ID);
				},
				scope : this
			}, {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders,
							this.contextFiles);
				},
				scope : this
			}, {
				text : '更名'.loc(),
				iconCls : 'db-icn-rename',
				handler : function() {
					this.renameFolder(this.contextFolders[0]);
				},
				scope : this
			});
	this.fileMenu = new Ext.menu.Menu({
				minWidth : 170
			});
	this.fileMenu.add({
				text : '下载'.loc(),
				iconCls : 'db-icn-download',
				handler : function() {
					this.download(this.contextFiles[0].ID);
				},
				scope : this
			}, '-', {
				text : '发布...'.loc(),
				iconCls : 'db-icn-publish',
				handler : function(menu) {
					this.publishFile(this.contextFiles[0], menu);
				},
				scope : this
			}, {
				text : '标签该文件...'.loc(),
				iconCls : 'db-icn-tag-edit',
				handler : function() {
					this.tagItems(null, this.contextFiles);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutSelected();
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copySelected();
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(null, this.contextFiles);
				},
				scope : this
			}, {
				text : '改名'.loc(),
				iconCls : 'db-icn-rename',
				handler : function() {
					this.renameFile(this.contextFiles[0]);
				},
				scope : this
			});

	this.sharedFileMenu = new Ext.menu.Menu({
				minWidth : 170
			});
	this.sharedFileMenu.add({
				text : '下载'.loc(),
				iconCls : 'db-icn-download',
				handler : function() {
					this.download(this.contextFiles[0].ID);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutSelected();
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copySelected();
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(null, this.contextFiles);
				},
				scope : this
			}, {
				text : '改名'.loc(),
				iconCls : 'db-icn-rename',
				handler : function() {
					this.renameFile(this.contextFiles[0]);
				},
				scope : this
			});

	this.publishedFileMenu = new Ext.menu.Menu({
				minWidth : 170
			});
	this.publishedFileMenu.add({
				text : '下载'.loc(),
				iconCls : 'db-icn-download',
				handler : function() {
					this.download(this.contextFiles[0].ID);
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copySelected();
				},
				scope : this
			});

	this.multipleItemsMenu = new Ext.menu.Menu();
	this.multipleItemsMenu.add({
				text : '标签...'.loc(),
				iconCls : 'db-icn-tag-edit',
				handler : function() {
					this.tagItems(this.contextFolders, this.contextFiles);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutSelected();
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copySelected();
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders,
							this.contextFiles);
				},
				scope : this
			});

	this.sharedItemsMenu = new Ext.menu.Menu();
	this.sharedItemsMenu.add({
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutSelected();
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copySelected();
				},
				scope : this
			}, '-', {
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.moveToRecycleBin(this.contextFolders,
							this.contextFiles);
				},
				scope : this
			});

	this.recyclebinItemsMenu = new Ext.menu.Menu();
	this.recyclebinItemsMenu.add({
				text : '删除'.loc(),
				iconCls : 'db-icn-delete',
				handler : function() {
					this.deleteItems(this.contextFolders, this.contextFiles);
				},
				scope : this
			}, '-', {
				text : '剪切'.loc(),
				iconCls : 'db-icn-cut',
				handler : function() {
					this.cutSelected();
				},
				scope : this
			}, {
				text : '复制'.loc(),
				iconCls : 'db-icn-copy',
				handler : function() {
					this.copySelected();
				},
				scope : this
			});

}

utils.km.file.FileManager.prototype.initToolbar = function(elem) {

	this.menuChangeView = new Ext.menu.Menu({
				items : [{
							id : 'mi-changeview-album',
							text : '相册'.loc(),
							iconCls : 'db-icn-views-album',
							handler : function() {
								this.changeView('album');
							},
							scope : this
						}, {
							id : 'mi-changeview-thumb',
							text : '缩略图'.loc(),
							iconCls : 'db-icn-views-thumb',
							handler : function() {
								this.changeView('thumbs');
							},
							scope : this
						}, {
							id : 'mi-changeview-tile',
							text : '平铺'.loc(),
							iconCls : 'db-icn-views-tile',
							handler : function() {
								this.changeView('tiles');
							},
							scope : this
						}, {
							id : 'mi-changeview-icon',
							text : '图标'.loc(),
							iconCls : 'db-icn-views-icon',
							handler : function() {
								this.changeView('icons');
							},
							scope : this
						}, {
							id : 'mi-changeview-detail',
							text : '详细信息'.loc(),
							iconCls : 'db-icn-views-detail',
							handler : function() {
								this.changeView('details');
							},
							scope : this
						}]
			});

	this.toolbar = new Ext.Toolbar({
				renderTo : elem,
				cls : 'db-toolbar',
				items : [{
							name : 'tbBack',
							text : '后退'.loc(),
							iconCls : 'db-icn-back',
							disabled : true,
							handler : function() {
								this.goBack();
							},
							scope : this
						}, {
							name : 'tbForward',
							text : "前进".loc(),
							iconCls : 'db-icn-forward',
							disabled : true,
							handler : function() {
								this.goForward();
							},
							scope : this
						}, {
							name : 'tbUp',
							text : "向上".loc(),
							iconCls : 'db-icn-up',
							disabled : true,
							handler : function() {
								this.goUp();
							},
							scope : this
						}, {
							name : 'tbRefresh',
							text : '刷新'.loc(),
							tooltip : '刷新该文件夹'.loc(),
							iconCls : 'db-icn-refresh',
							handler : function() {
								this.refreshAll();
							},
							scope : this
						}, '-', {
							name : 'tbDelete',
							text : '删除'.loc(),
							tooltip : '删除选定的文件或文件夹'.loc(),
							iconCls : 'db-icn-delete',
							handler : function() {
								this.deleteSelected();
							},
							scope : this
						}, {
							name : 'tbCut',
							text : '剪切'.loc(),
							tooltip : '剪切选定的文件或文件夹'.loc(),
							iconCls : 'db-icn-cut',
							handler : function() {
								this.cutSelected();
							},
							scope : this
						}, {
							name : 'tbCopy',
							text : '复制'.loc(),
							tooltip : '复制选定的文件或文件夹'.loc(),
							iconCls : 'db-icn-copy',
							handler : function() {
								this.copySelected();
							},
							scope : this
						}, {
							name : 'tbPaste',
							text : '粘贴'.loc(),
							tooltip : '粘贴选定的文件夹或文件'.loc(),
							iconCls : 'db-icn-paste',
							handler : function() {
								this.pasteOnSelected();
							},
							scope : this
						}, '-', {
							name : 'tbMultipleUpload',
							text : '上传'.loc(),
							tooltip : '上传多个文件到当前文件夹'.loc(),
							iconCls : 'db-icn-upload',
							handler : function() {
								this.upload(true);
							},
							scope : this
						}, {
							name : 'tbDownload',
							text : '下载'.loc(),
							tooltip : '下载选定的文件'.loc(),
							iconCls : 'db-icn-download',
							handler : function() {
								this.downloadSelected();
							},
							scope : this
						}, '-', new Ext.Toolbar.SplitButton({
									text : '视图'.loc(),
									tooltip : '改变文件查看视图'.loc(),
									name : 'tbChangeView',
									iconCls : 'db-icn-views',
									handler : function() {
										this.changeView();
									},
									scope : this,
									menu : this.menuChangeView
								})]
			});
}

utils.km.file.FileManager.prototype.initAddressBar = function(elem) {
	var addressComboArray = [];
	var store = new Ext.data.SimpleStore({
				fields : ['id', 'path'],
				data : addressComboArray
			});
	this.addressCombo = new Ext.form.ComboBox({
				store : store,
				displayField : 'path',
				valueField : 'id',
				typeAhead : false,
				mode : 'local',
				triggerAction : 'all',
				selectOnFocus : false,
				width : 615
			});

	this.addressCombo.on('specialkey', function(fld, e) {
				if (e.getKey() == e.ENTER) {
					var rawValue = this.addressCombo.getRawValue();

					var row = null;
					var index = 0;
					while (row = this.allFolders[index]) {
						if (row[1].toLowerCase() == rawValue.toLowerCase()) {
							this.showFolder(row[0]);
							return;
						}
						index++;
					}
					this.showError('没有找到'.loc() + ' "' + rawValue + '". '
							+ '请确认路径正确.'.loc());
				}
			}, this);

	this.addressCombo.on('select', function(combo, record, index) {
				this.showFolder(this.addressCombo.getValue());
			}, this);

	this.refreshAddressBar();

	this.searchBox = new Ext.form.TextField({

				name : 'first',

				width : 145,

				emptyText : '查找文件或文件夹...'.loc()

			});

	this.searchBox.on('specialkey', function(fld, e) {
				if (e.getKey() == e.ENTER) {
					this.search(this.searchBox.getValue());
				}
			}, this);

	this.addressbar = new Ext.Toolbar({
				renderTo : elem,
				cls : 'db-addressbar',
				items : ['地址: '.loc(), this.addressCombo, ' &nbsp;&nbsp; ',
						this.searchBox, {
							id : 'tbSearch',
							tooltip : '搜索'.loc(),
							cls : 'x-btn-text-icon',
							iconCls : 'db-icn-search',
							handler : function() {
								this.search(this.searchBox.getValue());
							},
							scope : this
						}]
			});

}

utils.km.file.FileManager.prototype.initKeyboard = function() {
	var map = new Ext.KeyMap(this.getEl(), [{
						key : [113],
						scope : this,
						fn : function() {
							this.renameSelected();
						}
					}, {
						key : [46],
						scope : this,
						fn : function() {
							this.deleteSelected();
						}
					}, {
						key : [46],
						shift : true,
						scope : this,
						fn : function() {
							this.deleteSelected(true);
						}
					}, {
						key : "A",
						ctrl : true,
						scope : this,
						fn : function() {
							this.selectAllItems();
						}
					}, {
						key : "N",
						ctrl : true,
						shift : true,
						scope : this,
						fn : function() {
							this.upload(false);
						}
					}, {
						key : "L",
						ctrl : true,
						shift : true,
						scope : this,
						fn : function() {
							this.upload(true);
						}
					}, {
						key : "X",
						ctrl : true,
						scope : this,
						fn : function() {
							this.cutSelected();
						}
					}, {
						key : "V",
						ctrl : true,
						scope : this,
						fn : function() {
							this.pasteOnSelected();
						}
					}, {
						key : "V",
						ctrl : true,
						shift : true,
						scope : this,
						fn : this.uploadFromUrl
					}]);
}
