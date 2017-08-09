Ext.namespace('utils.km.file');

utils.km.file.FilesGrid = function(currentView) {
	this.events = {
		"loadcomplete" : true
	};
	this.sortField = "size";
	this.sortDirection = "asc";
	this.folderId;

	this.templates = {};

	this.templates.thumbnailsView = new Ext.Template('<div class="db-fg-thumbView {cls}" readonly="{ro}">'
			+ '<div class="db-icn db-ft-{icon}-medium">{thumbnail}</div>'
			+ '<div class="db-txt db-ellipsis"><span ext:qtip="{name}" unselectable="on">{name}</span></div></div>');

	this.templates.iconsView = new Ext.Template('<div class="db-fg-iconView {cls}"  readonly="{ro}">'
			+ '<div class="db-icn db-ft-{icon}-medium">&#160;</div>'
			+ '<div class="db-txt db-ellipsis"><span ext:qtip="{name}" unselectable="on">{name}</span></div></div>');

	this.templates.tilesView = new Ext.Template('<div class="db-fg-tileView {cls}"  readonly="{ro}">'
			+ '<div class="db-icn db-ft-{icon}-large">&#160;</div>'
			+ '<div class="db-txt db-ellipsis"><span class="nm" unselectable="on">{name}</span><span class="tp" unselectable="on">{type}</span><span class="sz" unselectable="on">{sizeString}</span></div></div>');

	// create the Data Store
	this.store = new Ext.data.SimpleStore({
				id : 0,
				fields : [{
							name : 'name',
							mapping : 'name',
							sortType : 'asUCString'
						}, {
							name : 'id',
							mapping : 'id'
						}, {
							name : 'folder',
							mapping : 'folder'
						}, {
							name : 'size',
							mapping : 'size'
						}, {
							name : 'fileType',
							mapping : 'type'
						}, {
							name : 'path',
							mapping : 'path'
						}, {
							name : 'icon',
							mapping : 'icon'
						}, {
							name : "ro",
							mapping : 'readOnly',
							type : 'boolean'
						}, {
							name : 'dateCreated',
							mapping : 'dateCreated',
							type : 'date',
							dateFormat : 'Y/m/d H:i'
						}, {
							name : 'dateModified',
							mapping : 'dateModified',
							type : 'date',
							dateFormat : 'Y/m/d H:i'
						}, {
							name : 'folderType',
							mapping : 'folderType'
						}, {
							name : 'description',
							mapping : 'description'
						}, {
							name : 'tags',
							mapping : 'tags'
						}, {
							name : 'status',
							mapping : 'status'
						}],
				data : []
			});
	this.store.setDefaultSort(this.sortField, this.sortDirection);

	function formatSize(val, p, r) {
		return (r.data.folder) ? '' : Ext.util.Format.fileSize(val);
	}

	function formatName(val, p, r) {
		return '<div class="db-fg-detailView '
				+ (r.data.folder ? 'db-fg-folder' : 'db-fg-file') + '">'
				+ '<div class="db-icn db-ft-' + r.data.icon
				+ '-small">&#160;</div>'
				+ '<div class="db-txt db-ellipsis" unselectable="on">' + val
				+ '</span></div>' + '</div>';
	}

	function getThumbnail(data) {

		var regExp = /\.jpg$|\.jpeg$|\.gif$|\.png$|\.bmp$/i;
		if (regExp.test(data.name)) {
			return '<table cellpadding="0" cellspacing="0"><tr><td><img src="/utils/km/file/download.jcp?FolderID='
					+ this.folderId
					+ '&FileID='
					+ data.id
					+ '&thumbnail=true" /></td></tr></table>';
		} else {
			return '&#160;';
		}
	}

	this.columns = [{
				id : 'clName',
				header : "名称",
				sortable : true,
				renderer : formatName,
				dataIndex : "name"
			}, {
				header : '路径'.loc(),
				width : 200,
				sortable : true,
				locked : false,
				dataIndex : "path",
				hidden : true
			}, {
				header : '大小'.loc(),
				width : 40,
				align : 'right',
				sortable : true,
				renderer : formatSize,
				dataIndex : "size"
			}, {
				header : '类型'.loc(),
				width : 60,
				sortable : true,
				locked : false,
				dataIndex : "type"
			}, {
				header : '最后更新时间'.loc(),
				width : 50,
				sortable : true,
				renderer : Ext.util.Format.dateRenderer('/Y/m/d H:i'),
				dataIndex : "dateModified"
			}];

	utils.km.file.FilesGrid.superclass.constructor.call(this, {
				dropAllowedTarget : '.db-fg-folder',
				dropNotAllowedTarget : '.db-fg-file',
				border : false,
				tpl : this.getTemplate(currentView),
				emptyText : '<div style="text-align:center;color:#000">'
						+ '目录为空'.loc() + '.</div>'
			});

	this.getView().prepareData = function(data) {
		data.thumbnail = getThumbnail(data);
		data.shortName = Ext.util.Format.ellipsis(data.name, 15);
		data.sizeString = data.folder ? '' : Ext.util.Format
				.fileSize(data.size);
		data.cls = (data.folder) ? 'db-fg-folder' : 'db-fg-file';
		return data;
	}.createDelegate(this);
};

Ext.extend(utils.km.file.FilesGrid, utils.km.file.GridBase, {
			readOnly : false,
			autoExpandColumn :'name',
			getTemplate : function(cv) {
				switch (cv) {
					case 'thumbs' :
						return this.templates.thumbnailsView;

					case 'tiles' :
						return this.templates.tilesView;

					case 'icons' :
						return this.templates.iconsView;

					case 'details' :
						return null;
				}
			},
			getRowFolder : function(data) {
				return {
					'ID' : data.id,
					'Name' : data.name,
					'Type' : data.folderType,
					'CanWrite' : !data.ro
				}
			},

			setupView : function(view) {
				this.setTemplate(this.getTemplate(view));
			},

			getSelectedFolders : function() {
				return this.getFoldersFromRecords(this.getSelectionModel()
						.getSelections());
			},

			getAllFolders : function() {
				return this.getFoldersFromRecords(this.getStore().getRange());
			},

			getFoldersFromRecords : function(records) {
				var folders = [];
				var record = null;
				var data = null;
				var index = 0;
				while (record = records[index]) {
					data = record.data;
					if (data && data.folder) {
						folders[folders.length] = {
							'ID' : data.id,
							'Name' : data.name,
							'CreateDate' : data.dateCreated,
							'Type' : data.folderType,
							'CanWrite' : !data.readOnly,
							'Description' : data.description,
							'Tags' : data.tags || '',
							'Path' : data.path || this.currentPath,
							'Status' : data.status || 0
						};
					}
					index++;
				}
				return folders;
			},

			getAllFiles : function() {
				return this.getFilesFromRecords(this.getStore().getRange());
			},

			getSelectedFiles : function() {
				return this.getFilesFromRecords(this.getSelectionModel()
						.getSelections());
			},

			getFilesFromRecords : function(records) {
				var files = [];
				var record = null;
				var data = null;
				var index = 0;
				while (record = records[index]) {
					data = record.data;
					if (data && !data.folder) {
						files[files.length] = {
							'ID' : data.id,
							'Name' : data.name,
							'Size' : data.size,
							'CreateDate' : data.dateCreated,
							'LastModified' : data.dateModified,
							'fileType' : data.fileType,
							'icon' : data.icon,
							'Description' : data.description,
							'Tags' : data.tags || '',
							'Path' : data.path || this.currentPath,
							'Status' : data.status || 0
						};
					}
					index++;
				}
				return files;
			},
			sort : function() {
				this.getStore().sort(this.sortField, this.sortDirection);
			},

			setSortDirection : function(dir) {
				this.sortDirection = dir || this.sortDirection;
				this.sort();
			},

			setSortField : function(fieldName) {
				this.sortField = fieldName || this.sortField;
				this.sort();
			},

			// private
			getDragDropText : function() {
				var count = this.selModel.getCount();
				return count == 1
						? this.selModel.getSelected().data.name
						: count + ' items selected';
			},

			loadComplete : function(result) {
				this.currentFolderId = result.CurrentFolderID;
				this.currentFolderReadOnly = result.CurrentFolderReadOnly;
				this.parentFolderId = result.ParentFolderID;
				this.currentFolderType = result.CurrentFolderType;
				this.currentPath = result.CurrentPath;
				if (result.Rows)
					this.getStore().loadData(result.Rows);

				// fire load event
				this.fireEvent("loadcomplete", this);
			},

			loadView : function(folderId, save) {
				this.folderId = folderId;
				var instance = this;
				var conn = new Ext.data.Connection();
				if (this.frameEl) {
					if (this.maskDelay)
						clearTimeout(this.maskDelay);
					this.maskDelay = this.frameEl.mask.defer(800, this.frameEl,
							["文件列表载入中....."])
				};
				Ext.Ajax.request({
							url : '/utils/km/file/view.jcp',
							method : 'post',
							scope : this,
							params : {
								"folder" : (folderId ? folderId : ''),
								"save" : (save != null) ? save : true
							},
							callback : function(options, success, response) {
								if (this.frameEl && this.frameEl.isMasked()) {
									this.frameEl.unmask();
								}
								if (this.maskDelay) {
									clearTimeout(this.maskDelay);
									this.maskDelay = false;
								}
								var result = Ext.util.JSON
										.decode(response.responseText);
								if (success) {
									instance.loadComplete(result);
								} else {
									var msg = (result && result.Message)
											? result.Message
											: '发生错误,请重试!'.loc();
									Ext.MessageBox.alert('Error', msg);
								}
							}
						});
			}
		});
