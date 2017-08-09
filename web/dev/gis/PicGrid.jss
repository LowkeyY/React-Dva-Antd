
Ext.namespace('dev.gis'); 

dev.gis.PicGrid = function(p) {
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
		                '<div class="db-txt db-ellipsis"><span ext:qtip="{name}" unselectable="on">{name}</span></div></div>');
		                
    this.store = new Ext.data.SimpleStore({
        id: 0,
        fields:[{name: 'name', mapping: 'name'},
			{name: 'file_type', mapping: 'file_type'},
			{name: 'file_name', mapping: 'file_name'},
			{name: 'folder', mapping: 'folder'},
			{name: 'size', mapping: 'size'},
			{name: 'icon', mapping: 'icon'}],
        data: []
    });  
    
    function formatSize(val, p, r) {
        return (r.data.folder) ? '' : Ext.util.Format.fileSize(val);
    }
    
    function formatName(val, p, r) {
        return '<div class="db-fg-detailView ' + (r.data.folder ? 'db-fg-folder' : 'db-fg-file') + '">' +
                   '<div class="db-icn db-ft-'+r.data.icon+'-small">&#160;</div>' +
                   '<div class="db-txt db-ellipsis" unselectable="on">' + val + '</span></div>' + 
               '</div>';
    } 
    
    function getThumbnail(data) {
		
        var regExp = /\.jpg$|\.jpeg$|\.gif$|\.png$|\.bmp$/i;
        if(regExp.test(data.file_name)){
            return '<table cellpadding="0" cellspacing="0"><tr><td><img src="../dev/gis/picdownload.jcp?meta_name='+data.name+'" /></td></tr></table>';
        } else {
            return '&#160;';
        }
    }
    
    this.columns = [      
        {id: 'clName',header: '文件名称'.loc(),renderer: formatName,dataIndex: 'name',sortable: true,align: 'left'}
	    
    ];      
    
    dev.gis.PicGrid.superclass.constructor.call(this, {
        enableDragDrop: true,
        ddGroup: 'defaultDD',
        dropAllowedTarget: '.db-fg-folder',
        dropNotAllowedTarget: '.db-fg-file',
        border: false,       
        tpl: this.getTemplate("thumbs"),
        emptyText: '<div style="text-align:center;color:#000">'+'目录为空'.loc()+'.</div>'   
    });
    
    this.getView().prepareData = function(data) {
        data.thumbnail = getThumbnail(data);
        data.shortName = Ext.util.Format.ellipsis(data.name, 15);
        data.sizeString = data.folder ? '' : Ext.util.Format.fileSize(data.size);
        data.cls = (data.folder) ? 'db-fg-folder' : 'db-fg-file';      
        return data;
    }.createDelegate(this); 
               
};

Ext.extend(dev.gis.PicGrid, dev.gis.PicGridBase, {
    
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
    	this.framesP = framesP;
    	this.param = params;
        var instance = this;        
        var conn = new Ext.data.Connection();
        Ext.Ajax.request({
            url: "../dev/gis/Piclist.jcp",
            method: 'post',
            params:params,
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
    	if(this.param["com_sel"]==""){
			Ext.MessageBox.alert('Error', '请先选择图元类别!'.loc());
			return;
		}
        var uploadUrl = "/dev/gis/picupload.jcp";
		using("dev.gis.SingleUpload");
        this.uploadDialog = this.createWindow({        
            id: 'upload-dialog',
            title: '上传文件'.loc(),
            iconCls: 'db-icn-upload',
            uploadUrl: uploadUrl,
            obj_type:this.param["obj_type"],
            com_sel:this.param["com_sel"]
        }, dev.gis.SingleUpload); 
        //this.uploadDialog.on('switch', this.changeUploadControl, this);
        this.uploadDialog.on('complete', this.refreshView, this);
        this.uploadDialog.on('close', function() {this.uploadDialog=null;}, this);        
        this.uploadDialog.show();      
    }
    
});
