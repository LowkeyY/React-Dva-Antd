
Ext.namespace('dev.script'); 

dev.script.SingleUpload = function(config) {
    config.closable = false;
    config.resizable = false;
    config.constrain = true;
    config.width = 380;
    config.height = 155; 
    config.renderTo = document.body;  
    config.maximizable = false;
    config.bodyStyle = "padding:5px;";
    config.buttons = [
        {text:'开始上传'.loc(), handler:this.startUpload, scope:this},
        {text:'取消'.loc(), handler:this.cancelUpload, scope:this},
        {text:'上传新文件'.loc(), handler:this.newUpload, scope:this},
        {text:'关闭'.loc(), handler:this.close, scope:this}
    ]
    
    dev.script.SingleUpload.superclass.constructor.call(this, config);

    this.events = {
        "switch" : true,
        "complete" : true
    };        
    
    this.body.addClass('x-dlg-upload');
    helpElm = this.body.createChild({
        tag: 'div',
        cls: 'hlp',
        html: '选择上传文件'.loc()
    });
    
    formElem = this.body.createChild({
        tag: 'form',
        method: 'post',
        action: config.uploadUrl,
        enctype: 'multipart/form-data',
        cls: 'frm'        
    });
    formElem.createChild({
            tag: 'input',
            type: 'file',
            name: 'file-upload',
            size: 40
     }).on('change', this.fileInputChange, this);  
            
    updateElem = this.body.createChild({
        tag: 'div',
        cls: 'suc',
        style: 'display:none',
        html: '<div>file number one.jpg</div>'
    });    
    
    swcElem = this.body.createChild({
        tag: 'div',
        cls: 'swc',
        style: 'margin-top: 15px',
        html: '切换到'.loc()+' <a href="#">'+'高级上传控件'.loc()+'</a>.'
    });     
    Ext.get(swcElem.dom.childNodes[1]).on('click', function() { this.fireEvent('switch', this); }, this);
    
    progressElem = this.body.createChild({
        tag: 'div',
        cls: 'prg',
        style: 'display:none',
        html: '<div class="x-dlg-upload-progress">' + 
                '<div class="x-dlg-upload-progress-bar">&nbsp;</div>' +
              '</div>' +
              '<div class="x-dlg-upload-status">'+'初始化中...'.loc()+'</div>'
    });     
    prgBar = Ext.get(progressElem.dom.childNodes[0].firstChild);
    prgStat = Ext.get(progressElem.dom.childNodes[1]);
 
    btnUpload = this.buttons[0];
    btnCancel = this.buttons[1];
    btnNew = this.buttons[2];
    btnClose = this.buttons[3];
    
    btnUpload.disable();
    btnCancel.hide();
    btnNew.hide();      
};
Ext.extend(dev.script.SingleUpload, Ext.Window, {
    isUploading: false,
    startUpload: function(){  
		var saveParams={};
		saveParams['FolderID']=this.FolderID;
		saveParams['postbackId']=this.postbackId;
        Ext.Ajax.request({
            url : this.uploadUrl,
            params : saveParams,
            method : 'POST',
            form : formElem.dom,
            isUpload : true,
            callback : function(options, success, response) {
                if(success)
                    this.uploadComplete(response.responseText);
                else
                    this.uploadError(response.responseText);   
            },
            scope : this
        });                
        helpElm.update('正在上传...'.loc());
        formElem.applyStyles('position:absolute;left:-1000px');
        swcElem.setDisplayed(false);
        this.resetProgressDisplay();
        progressElem.setDisplayed(true);
        this.isUploading = true;
        btnUpload.hide();
        btnCancel.show();
        btnClose.disable();
        //this.startProgress.defer(2000, this);  
    },
    cancelUpload: function() {             
        var upload_frame = this.findUploadIframe();
        if (upload_frame) {
            Ext.lib.Event.purgeElement(upload_frame, true, 'load');
            upload_frame.src = 'about:blank';
            setTimeout(function(){document.body.removeChild(upload_frame);}, 100);
        }
        helpElm.update('用户取消了上传进程.'.loc());
        this.setTitle('上传取消'.loc());
        this.isUploading = false;
        btnClose.enable();
        btnCancel.hide();
        btnNew.show();
    },
    uploadComplete: function(responseText){



        helpElm.update('上传成功'.loc());
        this.setTitle('上传完成'.loc());
        this.isUploading = false;
        progressElem.setDisplayed(false);
        updateElem.update(responseText);
        updateElem.setDisplayed(true);  
        swcElem.setDisplayed(true);      
        btnClose.enable();
        btnCancel.hide();
        btnNew.show();
        this.fireEvent('complete', this);
    },
    newUpload: function(){
        helpElm.update('选择要上传的本地文件'.loc());
        this.setTitle('上传文件'.loc());
        progressElem.setDisplayed(false);
        updateElem.setDisplayed(false);
        swcElem.setDisplayed(true);
        formElem.applyStyles('position:static;');
        formElem.dom.reset();
        btnNew.hide();
        btnUpload.show();
        btnUpload.disable();  
    },
    uploadError: function(responseText) {
        this.isUploading = false;
        Ext.MessageBox.alert('Error!', responseText);  
    },
    startProgress: function() {
        this.updateProgress();
    },
    updateProgress: function() {
        RemoteMethods.GetUploadStatus(this.postbackId, this.updateProgressResponse, this);
    },
    updateProgressResponse: function(stat) {    
        if(stat == null){
            if (this.isUploading) this.updateProgress.defer(1000, this);
            return;
        }
        if (stat.CurrentStatus == dev.script.StatusCode.Error) {
            this.cancelUpload();
            Ext.MessageBox.alert('Error', stat.Description);
            this.setTitle('Error: ' + stat.Description);
        } else if (this.isUploading) {
            this.updateProgressDisplay(stat.ReturnValue, stat.Description);
            if(stat.ReturnValue < 100)
                this.updateProgress.defer(2000, this);
        }            
    },
    fileInputChange: function(e, elem) {
        btnUpload.enable();
    },
    findUploadIframe: function() {
        var ifs = Ext.fly(document.body).query('iframe.x-hidden');
        if (ifs.length > 0) {
          return ifs[0];
        }
        return null;
    },
    updateProgressDisplay: function(pr, stat) {
        prgBar.setStyle('width', pr + '%');
        prgStat.update(stat);
        this.setTitle('上传'.loc()+' (' + pr + "%)");
    }, 
    resetProgressDisplay: function() {
        this.updateProgressDisplay(0, '初始化中...'.loc());
    }
});

