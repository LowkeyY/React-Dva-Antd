Ext.namespace('dev'); 
Ext.namespace('dev.gis'); 
loadcss("dev.gis.main");

dev.gis.PicManager = function(f,param) {
    this.settings ;
    this.param = param;
    this.framesP = f;
	using("dev.gis.PicGridView");
	using("dev.gis.PicGridDragSelector");
	using("dev.gis.PicGridBase");
	using("dev.gis.PicGrid");

    this.filesView = new dev.gis.PicGrid(this.param);
    
    this.mainMenu = new Ext.menu.Menu({
        items: [
            {
            	text: '删除'.loc(), 
            	iconCls:'db-icn-delete', 
            	handler: function(){
            		this.deleteItems();
            	}, 
            	scope: this
            }
        ]
    });
    
    var listButton=[];
	listButton.push(new Ext.Toolbar.Button({
				btnId:'redo',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.param.retFn
	}));
	listButton.push(new Ext.Toolbar.Separator());
	listButton.push(new Ext.Toolbar.Button({
				text : '删除'.loc(),
				tooltip: '删除选定的文件'.loc(),
				iconCls:'db-icn-delete',
				scope: this,
				handler: function(){
					this.deleteItems();
				}
	}));
	listButton.push(new Ext.Toolbar.Button({
				text : '上传'.loc(),
				tooltip: '上传文件'.loc(),
				iconCls:'db-icn-upload',
				scope: this,
				handler: function(){
					this.upload(true);
				}
	}));
	this.comboType = new Ext.form.ComboBox({
		width:100,
		fieldLabel: '图元类别'.loc(),
		store :this.typeStore=new Ext.data.JsonStore({
			url : '/dev/gis/Piclist.jcp?coms=true',
			root : 'Rows',
			method : 'get',
			autoLoad : true,
			fields : ["text","value"],
			remoteSort : false
		}),
		valueField:'value',
		displayField:'text',
		triggerAction : 'all',
		mode : 'local'
	});
	
	this.comboType.on("select", function(combo, record, index) {
		var param = this.param;
    	param["obj_type"] = this.comboType.getValue();
    	param["com_sel"] = this.comboType.getValue();
        this.filesView.loadView(this.framesP,param);
        this.cover = this.body.findParent('.x-window-bwrap');
	}, this)
    
	listButton.push(new Ext.Toolbar.Fill());
	listButton.push(new Ext.form.Label({
	   		text:'选择类别:'.loc()
	   }));
	listButton.push(this.comboType);

    dev.gis.PicManager.superclass.constructor.call(this, {            
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
};

Ext.extend(dev.gis.PicManager, Ext.Panel, {
    createWindow: function(config, cls){
        var desktop = WorkBench.Desk.getDesktop();
        var win = desktop.getWindow(config.id);
        if(!win){
            win = desktop.createWindow(config, cls)
        }    
        return win;
    },
    filemanager_show: function() {
    	var param = this.param;
		if(this.comboType.getValue()==''){
			this.typeStore.on('load',function(){
				this.comboType.setValue(3);
				param["obj_type"] = this.comboType.getValue();
				param["com_sel"] = this.comboType.getValue();
				this.filesView.loadView(this.framesP,param);
				this.cover = this.body.findParent('.x-window-bwrap');
			},this);
		}else{
			param["obj_type"] = this.comboType.getValue();
			param["com_sel"] = this.comboType.getValue();
			this.filesView.loadView(this.framesP,param);
			this.cover = this.body.findParent('.x-window-bwrap');
		}
    },
    filesView_load: function(grd) {
        this.setupView();    
    }, 
 
    loadFiles: function(f,p) {
        this.filesView.loadView(f,p);
    },
    
    showFolder: function(folderId) {
        this.filesView.loadView(folderId);
    },
    
    refreshView: function(f,p) {
        this.filesView.loadView(f,p);
    },
    
    filesView_containercontextmenu: function(view, e) {
        e.stopEvent();
        e.preventDefault();
        this.mainViewMenu.showAt(e.getXY());
    },  
    setupView: function(view) {
        var pnl = this.getComponent('db-sc-panel');
        pnl.layout.setActiveItem(0); 
    },
    deleteItems: function()
    {
    	if(!this.filesView.getSelectionModel().getSelected()){
    		Ext.msg("warn",'请选择一个文件!'.loc());
    		return;
    	}
    	var del_name = this.filesView.getSelectionModel().getSelected().data.name;
    	var dParam = {
    		del_name : del_name,
    		del_mark : "true"
    	};
 		Ext.msg('confirm', '警告:删除程序将不可恢复,确认吗?'.loc(), function (answer){
		   if (answer == 'yes') {
				Ext.Ajax.request({ 
						url:'/dev/gis/Piclist.jcp',
						params:dParam,
						method: 'post',  
						scope:this,
						success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check)
							if(ajaxResult.success){
								var obj_type = this.comboType.getValue();
								if(obj_type == ''){
									obj_type = '3';
								}
								var param = this.param;
						    	param["obj_type"] = obj_type;
						        this.filesView.loadView(this.framesP,param);
						        this.cover = this.body.findParent('.x-window-bwrap');
							}else{
								Ext.msg("error",'程序删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
								}
							}
					}); 
			  } 
		 }.createDelegate(this));
    },
    
    upload: function() {
        this.filesView.singleUpload();
    },
    creatEdit: function(fileType){
    	this.filesView.creatEdit(fileType);
    }
});
