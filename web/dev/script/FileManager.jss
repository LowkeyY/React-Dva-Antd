Ext.namespace('dev'); 
Ext.namespace('dev.script'); 
loadcss("dev.script.main");

dev.script.FileManager = function(f,param) {
    this.settings ;
    this.param = param;
    this.framesP = f;
	using("dev.script.FilesGridView");
	using("dev.script.FilesGridDragSelector");
	using("dev.script.GridBase");
	using("dev.script.FilesGrid");

    this.filesView = new dev.script.FilesGrid(this.param);


	console.log(Ext.encode(this.param));
    
    this.mainMenu = new Ext.menu.Menu({
        items: [
            {
            	text: '重命名'.loc(), 
            	iconCls:'db-icn-rename', 
            	handler: function(){ 
            		if(!this.filesView.getSelectionModel().getSelected()){
						Ext.msg("warn",'请选择要重命名的文件!'.loc());
						return;	
					}
					Ext.MessageBox.show({
					   title: '重命名'.loc(),
					   msg: '输入名称:'.loc(),
					   width:300,
					   buttons: Ext.MessageBox.OKCANCEL,
					   prompt : true,
					   value:this.filesView.getSelectionModel().getSelected().data.fileName,
					   fn: this.updateIt,
					   animEl: 'navtoolbar'
				   });
            	}, 
            	scope: this
            },{
            	text: '删除'.loc(), 
            	iconCls:'db-icn-delete', 
            	handler: function(){
            		this.deleteItems();
            	}, 
            	scope: this
            },{
            	text:'下载'.loc(),
            	iconCls:'db-icn-download', 
            	handler: function(){
            		this.downloadSelected();
            	}, 
            	scope: this
            }
        ]
    });
    
    var listButton=[];
	
	listButton.push(new Ext.Toolbar.Button({
				btnId:'newFile',
				text: '新建'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'all',
				scope: this,
				hidden : false,
                menu:{    
                    items: [
                        {
                            text: '新建目录'.loc(),
                            //checked: false,
							scope: this,
                            handler :function(){
									Ext.MessageBox.show({
									   title: '目录名称'.loc(),
									   msg: '新建目录:'.loc(),
									   width:300,
									   buttons: Ext.MessageBox.OKCANCEL,
									   prompt : true,
									   fn: this.saveIt,
									   animEl: 'navtoolbar'
								   });
							}
                        },{
                            text: 'JSS程序'.loc(),
							menuId:'jss',
                            checked: true,
							scope: this,
                            group: 'scriptType',
                            handler: function(){
									this.creatEdit('jss');
								}
                        }, {
                            text: 'JCP程序'.loc(),
							menuId:'jcp',
                            checked: false,
							scope: this,
                            group: 'scriptType',
                            handler: function(){
									this.creatEdit('jcp');
								}
                        }, {
                            text: 'CSS样式文件'.loc(),
							menuId:'css',
                            checked: false,
							scope: this,
                            group: 'scriptType',
                            handler: function(){
									this.creatEdit('css');
								}
                        }, {
                            text: 'XML文件'.loc(),
							menuId:'xml',
                            checked: false,
							scope: this,
                            group: 'scriptType',
                            handler: function(){
									this.creatEdit('xml');
								}
                        }
                    ]
                }
	}));
	listButton.push(new Ext.Toolbar.Separator());
	listButton.push(new Ext.Toolbar.Button({
				text : '重命名'.loc(),
				tooltip: '重命名选定的文件'.loc(),
				iconCls:'db-icn-rename',
				scope: this,
				state:'edit',
				handler :function(){
							var fileName="";
							if(!this.filesView.getSelectionModel().getSelected()&& this.param["filePath"]==""){
								Ext.msg("warn",'请选择要重命名的文件!'.loc());
    							return;	
							}else if(this.filesView.getSelectionModel().getSelected()){
								 fileName=this.filesView.getSelectionModel().getSelected().data.fileName;
							}else{
								fileName=this.param["filePath"];
							} ;  
							Ext.MessageBox.show({
							   title: '重命名'.loc(),
							   msg: '输入名称:'.loc(),
							   width:300,
							   value:fileName,
							   buttons: Ext.MessageBox.OKCANCEL,
							   prompt : true,
							   fn: this.updateIt,
							   animEl: 'navtoolbar'
						   });
						}
	}));

	listButton.push(new Ext.Toolbar.Button({
				text : '删除'.loc(),
				tooltip: '删除选定的文件'.loc(),
				iconCls:'db-icn-delete',
				scope: this,
				state:'edit',
				handler: function(){
					this.deleteItems();
				}
	}));
	listButton.push(new Ext.Toolbar.Button({
				text : '上传'.loc(),
				tooltip: '上传文件'.loc(),
				iconCls:'db-icn-upload',
				scope: this,
				state:'all',
				handler: function(){
					this.upload(true);
				}
	}));
	listButton.push(new Ext.Toolbar.Button({
				text : '下载'.loc(),
				tooltip: '下载文件'.loc(),
				iconCls:'db-icn-download',
				scope: this,
				state:'all',
				handler: function(){
					this.downloadSelected();
				}
	}));
	listButton.push(new Ext.Toolbar.Separator());
	this.menuChangeView = new Ext.menu.Menu({
        items: [
		    {id:'mi-changeview-thumb', text:'缩略图'.loc(), iconCls:'db-icn-views-thumb', handler: function() {this.changeView('thumbs');}, scope: this },
		    {id:'mi-changeview-detail', text:'详细信息'.loc(), iconCls:'db-icn-views-detail', handler: function() {this.changeView('details');}, scope: this }
        ]
    });
    
    listButton.push(new Ext.Toolbar.Button({
    			btnId:'tbChangeView',
				text: '视图'.loc(),
				iconCls:'db-icn-views',
				scope: this,
				state:'all',
                menu:this.menuChangeView
    }));

    dev.script.FileManager.superclass.constructor.call(this, {            
			region:'center',
			id:'listPanel',
			collapsible: false,
			split:true,
			layout:'fit',	
            tbar: listButton,
            layout: 'border',
            items: [{
                region:'center',
                id: 'db-sc-panel',
                activeItem: 0,
                layout:'card',                 
                items:[{
                    border: false,
                    layout:'border',
                    items:[{
                        region: 'center',
                        margins: '0 0 0 0',
                        autoScroll: true,
                        border:false,
                        layout: 'fit',
                        items: this.filesView
                    }]                     
                    },{
                        bodyStyle: 'background-color:#000;',
                        border: false,
                        autoScroll:false                                
                }]
            }]    
    });

    this.on('render', this.filemanager_show, this);
    
    this.filesView.on("loadcomplete", this.filesView_load, this, true); 
    this.filesView.on("itemdblclick", this.filesView_dblclick, this, true);
    var instance = this;
    this.filesView.on('itemcontextmenu', function(view,event){
    	event.stopEvent();
        event.preventDefault();
        instance.mainMenu.showAt(event.getXY());
    });
    
    Ext.MessageBox.getDialog().on("show", function(d) {
        var div = Ext.get(d.el);
        div.setStyle("overflow", "auto");
        var text = div.select(".ext-mb-textarea", true);
        if (!text.item(0))
	        text = div.select(".ext-mb-text", true);
        if (text.item(0))
	        text.item(0).dom.select();
    }); 
    
    this.saveIt=function(btn,text){
    	var text = text;
		if(btn=='ok'){
			this.filesView.creatFolder(text);
		}
    }.createDelegate(this);
    
    this.updateIt=function(btn,text){
    	var text = text;
		var fileName,currentDirectory,isDir;
		if(this.filesView.getSelectionModel().getSelected()){
			fileName=this.filesView.getSelectionModel().getSelected().data.fileName;
			currentDirectory=this.param["dir"]+"/"+fileName;
			isDir=false;
		}else{
			fileName=this.param["filePath"];
			currentDirectory=this.param["dir"];
			isDir=true;
		} 
		if(btn=='ok'){
			var saveParams=this.param;
			saveParams['type']='updatesave';
			saveParams['name']=text;
			saveParams['currentDirectory']=currentDirectory;
			if(text.length>50){
				Ext.msg("error",'数据修改失败!,原因:字符数大于50'.loc());
				return;
			}else if(text==null||text.length==0){
				Ext.msg("error",'数据保存失败!,原因:新建分类不能为空'.loc());
				return;
			}else if(/[\<\>\'\"\&]/.test(text)){
				Ext.msg("error",'不应有'.loc()+'&,<,>,\",'+'字符'.loc());
				return;
			}
			Ext.Ajax.request({
				url: '/dev/script/scriptdir.jcp',
				method:'POST',
				params: saveParams,
				success:function(response, options){ 
						var check = response.responseText;
						var ajaxResult=Ext.util.JSON.decode(check);
						if(ajaxResult.success){
							var Script=this.framesP.get('Script');
							if(isDir){
								Script.navPanel.getTree().loadSelfNode(fileName,Script.navPanel.clickEvent);
							}else{
								Script.navPanel.getTree().loadSubNode(fileName,Script.navPanel.clickEvent);
								this.filesView.refreshView();
							}
						}else{
								Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
						}
				},
				scope: this
			});
		}
    }.createDelegate(this);
    
};

Ext.extend(dev.script.FileManager, Ext.Panel, {
    createWindow: function(config, cls){
        var desktop = WorkBench.Desk.getDesktop();
        var win = desktop.getWindow(config.id);
        if(!win){
            win = desktop.createWindow(config, cls)
        }    
        return win;
    },
    filemanager_show: function() {
        this.filesView.loadView(this.framesP,this.param);
        this.cover = this.body.findParent('.x-window-bwrap');
    },
    
    filesView_load: function(grd) {
        this.setupView();    
    }, 
 
    loadFiles: function(f,p) {
		 this.param=p;
        this.filesView.loadView(f,p);
    },
    
    showFolder: function(folderId) {
        this.filesView.loadView(folderId);
    },
    
    refreshView: function(f,p) {
        this.filesView.loadView(f,p);
    },
    toggleToolBar : function(state) {
		var tempToolBar = this.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state || item.state == null)
						item.show();
		}, tempToolBar.items);
	},
	showAllToolBar : function(state) {
		var tempToolBar = this.getTopToolbar();
		tempToolBar.items.each(function(item) {
						item.show();
		}, tempToolBar.items);
	},
	enableAllToolBar : function() {
		var tempToolBar = this.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.enable();
				}, tempToolBar.items);
	},
	disableAllToolBar : function() {
		var tempToolBar = this.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.disable();
				}, tempToolBar.items);
	},
    filesView_dblclick: function(grd, index, e) {
        var Script=this.framesP.get('Script');
        var param = this.param;
   		if(grd.getSelectionModel().getSelected().data.folder){
   			param["dir"] = this.param["dir"]+"/"+grd.getSelectionModel().getSelected().data.fileName;
   			param["fullName"] = "/"+grd.getSelectionModel().getSelected().data.fileName;
   			this.filesView.loadView(this.framesP,param);
   		
			Script.navPanel.getTree().loadSubNode(grd.getSelectionModel().getSelected().data.fileName,Script.navPanel.clickEvent);
   		}else{

			var fileName = grd.getSelectionModel().getSelected().data.fileName;
			var fullFileName=grd.getSelectionModel().getSelected().data.relPath+"/"+grd.getSelectionModel().getSelected().data.fileName;
			if (fileName.match(/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$/i)) {
				this.viewImage(fullFileName);
			} else if (fileName.match(/\.css$|\.xml$|\.jss$|\.bmp$|\.jcp$/i)) {
				param["fullName"] =fullFileName;
				param["dir"] = grd.getSelectionModel().getSelected().data.filePath;
				Script.mainPanel.removeAll(true);
				if(!Script.mainPanel.havePanel("scriptEditor")){
						using("dev.script.EditPanel");
						Script.editorPanel =new dev.script.EditPanel(this.framesP,param);
						Script.mainPanel.add(Script.editorPanel.MainTabPanel);
					}
				Script.mainPanel.setActiveTab("scriptEditor");
				Script.editorPanel.editScript();
				Script.editorPanel.loadData(param);
			} else {
				Ext.Msg.show({
							title : '下载'.loc() + ' "' + fileName + '"?',
							msg : '确认下载'.loc() + ' "' + fileName + '"?',
							buttons : Ext.Msg.YESNO,
							icon : Ext.MessageBox.QUESTION,
							modal : false,
							scope : this,
							fn : function(btn) {
								if (btn == 'yes') {
									this.downloadSelected();
								}
							}
				});
			}
   		} 
    },
	viewImage : function(file) {
		using("utils.km.file.viewer.slide");
		loadcss("utils.km.file.viewer.slide");
		if (Ext.isIE6) {
			loadcss("utils.km.file.viewer.ie6");
		}

		var fileName = this.filesView.getSelectionModel().getSelected().data.fileName;
    	var filePath = this.filesView.getSelectionModel().getSelected().data.filePath;

		var images = this.filesView.store.query("fileName",
				/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$/i);


		var imgs = [];
		var file={};
		images.each(function(rec) {
				
				var fileName1 = rec.get("fileName");
				var filePath1 = rec.get("filePath");
				var src = '/dev/script/download.jcp?fileName='+fileName1+'&filePath='+filePath1;
				var cfg = {
					name : rec.get("fileName"),
					title : rec.get("fileName"),
					href : src,
					src : src,
					thumbnail : src + '&thumbnail=true',
					id : id,
					onclick : function() {
						Ext.hstz.expandx(this);
						return false;
					}
				}
				if (fileName == fileName1) {
					Ext.apply(file, cfg);
				}
				imgs.push(cfg);
		}, this);
		Ext.hstz.updateAnchors(imgs);
		Ext.hstz.expandx(file);

		return false;
	},
    filesView_containercontextmenu: function(view, e) {
        e.stopEvent();
        e.preventDefault();
        this.mainViewMenu.showAt(e.getXY());
    },
    
    changeView: function(view) {

        if(view)
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
            //RemoteMethods.SaveFileManagerSetting(dev.script.FileManagerSetting.CurrentView, this.currentView);
        }
        
        this.setupView(this.currentView);        
    },   
    
    setupView: function(view) {
        var pnl = this.getComponent('db-sc-panel');
        pnl.layout.setActiveItem(0); 
    },
    
    deleteItems: function()
    {
		var fileName="";
		var filePath;
		var isDir;
		if(!this.filesView.getSelectionModel().getSelected()&& this.param["filePath"]==""){
			Ext.msg("warn",'请选择要重命名的文件!'.loc());
			return;	
		}else if(this.filesView.getSelectionModel().getSelected()){
			 filePath = this.filesView.getSelectionModel().getSelected().data.filePath
			 fileName=this.filesView.getSelectionModel().getSelected().data.fileName;
			 isDir=false;
		}else{
			 filePath = this.param['dir'];
			 fileName="";
			 isDir=true;
		} ;  
    	var fullFilePath = filePath+fileName;
 		Ext.msg('confirm', '警告:删除程序将不可恢复,确认吗?'.loc(), function (answer){
		   if (answer == 'yes') {
				Ext.Ajax.request({ 
						url:'/dev/script/delete.jcp?filePath='+fullFilePath,
						method: 'post',  
						scope:this,
						success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check)
							if(ajaxResult.success){
								if(isDir){
									var Script=this.framesP.get('Script');
									Script.navPanel.getTree().loadParentNode(Script.navPanel.clickEvent);
								}else{
									var Script=this.framesP.get('Script');
									Script.navPanel.getTree().loadSelfNode(this.param["filePath"],Script.navPanel.clickEvent);
									this.filesView.refreshView();
								}
							}else{
								Ext.msg("error",'程序删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
								}
							}
					}); 
			  } 
		 }.createDelegate(this));
    },   
    downloadSelected: function() {
    	if(!this.filesView.getSelectionModel().getSelected()){
    		Ext.msg("warn",'请选择一个文件!'.loc());
    		return;
    	}
    	if(this.filesView.getSelectionModel().getSelected().data.folder){
    		Ext.msg("warn",'请选择一个文件!'.loc());
    		return;
    	}
    	var fileName = this.filesView.getSelectionModel().getSelected().data.fileName;
    	var filePath = this.filesView.getSelectionModel().getSelected().data.filePath;
        window.location = '/dev/script/download.jcp?fileName='+fileName+'&filePath='+filePath;
    },
    
    upload: function() {
		this.currentFolderId= this.param['dir'];

		console.log(this.currentFolderId);
		if (this.uploadDialog) {
			this.uploadDialog.params.url = this.currentFolderId;
			this.uploadDialog.show();
			return;
		}
		using("utils.km.file.UploadDialog");
		this.uploadDialog = new utils.km.file.UploadDialog({
					filePostName : 'file-upload',
					title : '上传文件'.loc(),
					url : '/dev/script/fileUpload.jcp',
					params : {
						url : this.currentFolderId
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
    creatEdit: function(fileType){
    	this.filesView.creatEdit(fileType);
    }
    
});

// folder type enumeration
dev.script.FolderType = function() { throw '无效操作'.loc(); }
dev.script.FolderType.None = 0;
dev.script.FolderType.RootFolder = 1;
dev.script.FolderType.RecycleBin = 2;
dev.script.FolderType.PhotoGallery = 3;
dev.script.FolderType.FileFolder = 4;
dev.script.FolderType.PhotoAlbum = 5;
dev.script.FolderType.MyNetwork = 6;
dev.script.FolderType.MyNetworkUser = 7;
dev.script.FolderType.SharedDocuments = 8;
dev.script.FolderType.SharedAlbums = 9;
dev.script.FolderType.SharedFolder = 10;
dev.script.FolderType.SharedAlbum = 11;
dev.script.FolderType.PublishedItems = 12;
dev.script.FolderType.PublishedFiles = 13;
dev.script.FolderType.PublishedFolders = 14;
dev.script.FolderType.SearchResults = 15;
dev.script.FolderType.TagsFolder = 16;

dev.script.StatusCode = function() { throw '无效操作'.loc(); }
dev.script.StatusCode.Error = 0;
dev.script.StatusCode.Success = 1;

dev.script.FileManagerSetting = function() { throw '无效操作'.loc(); }
dev.script.FileManagerSetting.CurrentView = 0;
dev.script.FileManagerSetting.CollapseFoldersPanel = 1;
dev.script.FileManagerSetting.CurrentHeight = 2;
dev.script.FileManagerSetting.SingleUploadMode = 3;

dev.script.ObjectStatus = function() { throw '无效操作'.loc(); }
dev.script.ObjectStatus.None = 0;
dev.script.ObjectStatus.Shared = 1;
dev.script.ObjectStatus.Published = 2;
dev.script.ObjectStatus.SharedPublished = 3;

dev.script.FileManager.prototype.setupFileMenu = function(menu, file) {
    var fileName = file.Name;
    var extension = fileName.substr(fileName.lastIndexOf(".") + 1);
    extension = extension.toLowerCase();
   
}