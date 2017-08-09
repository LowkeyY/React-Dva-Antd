
Ext.namespace('dev.script'); 

dev.script.FilesGrid = function(p) {
	this.framesP;
    this.param = p;
    this.events = {
        "loadcomplete" : true
    };
    this.sortField = "size";
    this.sortDirection = "asc";
    this.folderId;

    this.templates = {};
    
	this.templates.thumbnailsView = new Ext.Template('<div class="db-fg-thumbView {cls}">' +
		                '<div class="db-icn db-ft-{icon}-medium">{thumbnail}</div>' +
		                '<div class="db-txt db-ellipsis"><span ext:qtip="{fileName}" unselectable="on">{fileName}</span></div></div>');
		                
	this.templates.iconsView = new Ext.Template('<div class="db-fg-iconView {cls}">' +
		                '<div class="db-icn db-ft-{icon}-medium">&#160;</div>' +
		                '<div class="db-txt db-ellipsis"><span ext:qtip="{fileName}" unselectable="on">{fileName}</span></div></div>');    
		                
	this.templates.tilesView = new Ext.Template('<div class="db-fg-tileView {cls}">' +
		                '<div class="db-icn db-ft-{icon}-large">&#160;</div>' +
		                '<div class="db-txt db-ellipsis"><span class="nm" unselectable="on">{fileName}</span><span class="tp" unselectable="on">{fileType}</span><span class="sz" unselectable="on">{sizeString}</span></div></div>'); 		                
    
    // create the Data Store
    this.store = new Ext.data.SimpleStore({
        id: 0,
        fields:[{name: 'fileName', mapping: 'fileName'},
			{name: 'fileSize', mapping: 'fileSize'},
			{name: 'fileType', mapping: 'fileType'},
			{name: 'updateTime', mapping: 'updateTime'},
			{name: 'folder', mapping: 'folder'},
			{name: 'icon', mapping: 'icon'},
			{name: 'filePath', mapping: 'filePath'},
			{name: 'relPath', mapping: 'relPath'}],
        data: []
    });    
    //this.store.setDefaultSort(this.sortField, this.sortDirection);  
    
    function formatSize(val, p, r) {
        return (r.data.folder) ? '' : Ext.util.Format.fileSize(val);
    }
    
    function formatName(val, p, r) {
        return '<div class="db-fg-detailView ' + (r.data.folder ? 'db-fg-folder' : 'db-fg-file') + '">' +
                   '<div class="db-icn db-ft-'+r.data.icon+'-small">&#160;</div>' +
                   '<div class="db-txt db-ellipsis" unselectable="on">' + val + '</span></div>' + 
               '</div>';
    } 
    
    this.columns = [      
        {id: 'clName',header: '文件名称'.loc(),renderer: formatName,dataIndex: 'fileName',sortable: true,align: 'left'},
	    {header: '大小'.loc(),renderer: formatSize,dataIndex: 'fileSize',sortable: true,align: 'left'},
	    {header: '类型'.loc(),dataIndex: 'fileType',sortable: true,align: 'left'},
	    {header: '更新时间'.loc(),dataIndex: 'updateTime',sortable: true,align: 'left'}
    ];      
    
    dev.script.FilesGrid.superclass.constructor.call(this, {
        enableDragDrop: true,
        ddGroup: 'defaultDD',
        dropAllowedTarget: '.db-fg-folder',
        dropNotAllowedTarget: '.db-fg-file',
        border: false,       
        tpl: this.getTemplate("details"),
        emptyText: '<div style="text-align:center;color:#000">'+'目录为空'.loc()+'.</div>'   
    });         
               
	if (Ext.isChrome || Ext.isGecko) {
		this.on('afterrender', function() {
					this.currentFolderId= this.param['dir'];
					using("lib.file.ddupload.DragDropUpload");
					var dragUpload = new lib.file.ddupload.DragDropUpload(
							this.cover, {
								url : '/dev/script/fileUpload.jcp'
							});
					dragUpload.on("uploadcomplete", function() {
								this.refreshView();
							}, this);
					dragUpload.on("beforedrop", function(obj) {
								obj.params = {
									url : this.currentFolderId
								};
							}, this);
					dragUpload.on("error", function() {
								this.refreshView();
							}, this);
				}, this);
	}  
	this.on('render', this.filemanager_show, this);
};

Ext.extend(dev.script.FilesGrid, dev.script.GridBase, {
    
    getTemplate: function(cv) {
        switch(cv) {
            case 'thumbs':
                return this.templates.thumbnailsView;
                
            case 'tiles':
                return this.templates.tilesView;                   
                
            case 'icons':
                return this.templates.iconsView;
            
            case 'details':
                return null;
        }
    },
    
	filemanager_show : function() {
		this.cover = this.body.findParent('.x-window-bwrap');
	},

    setupView: function(view) {
        this.setTemplate(this.getTemplate(view));
    },    

    
    
    sort: function() {
        this.getStore().sort(this.sortField, this.sortDirection); 
    },
    
    setSortDirection: function(dir) {
        this.sortDirection = dir || this.sortDirection;
        this.sort();
    },
    
    setSortField: function(fieldName) {
        this.sortField = fieldName || this.sortField;
        this.sort();
    },           
    
    // private
    getDragDropText : function(){
        var count = this.selModel.getCount();
        return count == 1 ? this.selModel.getSelected().data.name : count + ' items selected';
    },    
    
    loadComplete: function(result) { 
    	this.store.loadData(result.Rows,false);
        this.fireEvent("loadcomplete", this);
    },
        
    loadView: function(framesP, params) {
		params && (this.param["dir"]=params["dir"]);
    	framesP && (this.framesP = framesP);
     
        var instance = this;        
        var conn = new Ext.data.Connection();
        Ext.Ajax.request({
            url: "../dev/script/filelist.jcp?dir="+instance.param["dir"],
            method: 'post',
            callback: function(options, success, response) {
                var result = Ext.util.JSON.decode(response.responseText);
                if (success) {
                    instance.loadComplete(result);
                } else {
                    var msg = (result && result.Message) ? result.Message : '发生错误,请重试!'.loc();
                    Ext.MessageBox.alert('Error', msg);                            
                }
            }             
        });   
    },
    refreshView: function() {
    	var instance = this;
        this.loadView(instance.framesP,instance.param);
    },
    createWindow: function(config, cls){
        var desktop = WorkBench.Desk.getDesktop();
        var win = desktop.getWindow(config.id);
        if(!win){
            win = desktop.createWindow(config, cls)
        }    
        return win;
    },
    singleUpload: function() {
        var uploadUrl = "/dev/script/fileUpload.jcp?url="+this.param["dir"];
		using("dev.script.SingleUpload");
        this.uploadDialog = this.createWindow({        
            id: 'upload-dialog',
            title: '上传文件'.loc(),
            iconCls: 'db-icn-upload',
            uploadUrl: uploadUrl
        }, dev.script.SingleUpload); 
        //this.uploadDialog.on('switch', this.changeUploadControl, this);
        this.uploadDialog.on('complete', this.refreshView, this);
        this.uploadDialog.on('close', function() {this.uploadDialog=null;}, this);        
        this.uploadDialog.show();      
    },
    creatEdit: function(fileType){
    	//var param={};
    	this.param["fileType"]=fileType;
    	var Script=this.framesP.get('Script');
		Script.mainPanel.removeAll(true);
		if(!Script.mainPanel.havePanel("scriptEditor")){
				using("dev.script.EditPanel");
				Script.editorPanel =new dev.script.EditPanel(this.framesP,this.param);
				Script.mainPanel.add(Script.editorPanel.MainTabPanel);
			}
		Script.mainPanel.setActiveTab("scriptEditor");
		Script.editorPanel.newScript(this.param);
		var mainPanel=Script.editorPanel.MainTabPanel;
		mainPanel.fileType =fileType;
		mainPanel.getTopToolbar().items.each(function(item){
				item.setVisible(typeof(item.state)=='undefined'||item.state=='create'||item.state==fileType);
			});
		if(fileType=='jss'){
			mainPanel.layout.setActiveItem(0);
		}else if(fileType=='jcp'){
			mainPanel.layout.setActiveItem(1);
		}else if(fileType=='css'){
			mainPanel.layout.setActiveItem(2);
		}else if(fileType=='xml'){
			mainPanel.layout.setActiveItem(3);
		}
		
    },
    creatFolder: function(folderName){
    	var saveParams=this.param;
		saveParams['type']='save';
		saveParams['name']=folderName;
		saveParams['currentDirectory']=this.param["dir"];
		if(folderName.length>50){
			Ext.msg("error",'数据保存失败!,原因:字符数大于50'.loc());
			return;
		}else if(folderName==null||folderName.length==0){
			Ext.msg("error",'数据保存失败!,原因:新建分类不能为空'.loc());
			return;
		}else if(/[\<\>\'\"\&]/.test(folderName)){
			Ext.msg("error",'不应有'.loc()+'&,<,>,\",'+'字符'.loc());
			return;
		}
		Ext.Ajax.request({
			url: '/dev/script/scriptdir.jcp',
			method:'POST',
			params: saveParams,
			scope:this,
			success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check);
					if(ajaxResult.success){
						this.refreshView();
						var Script=this.framesP.get('Script');
						Script.navPanel.getTree().loadSubNode(folderName,Script.navPanel.clickEvent);

					}else{
						    Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
					}
			},
			scope: this
		});
    }
});
