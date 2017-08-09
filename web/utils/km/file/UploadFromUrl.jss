/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file'); 


utils.km.file.UploadFromUrl = function(config) {

    this.events = {
        "upload" : true      
    }; 
    this.urlRegExp = /(http|https|ftp):\/\/(\w+:{0,1}\w*@)?([^:\/\s]+(:[0-9]+)?)((\/\w+)*\/)?([\w\-\.]+\.[^#?\s]+)?(#[\w\-]+)?/;
    utils.km.file.UploadFromUrl.superclass.constructor.call(this, Ext.applyIf(config || {}, {
        title: '通过URL上传文件'.loc(),
        cls: 'db-ufu-win',
        width: 380,   
        height: 195,         
        border: true,
        layout: 'card',
        activeItem: 0,
        
        items: [new Ext.FormPanel({
            defaultType: 'textfield',    
            border: false,
            labelAlign: 'top',
            title: '请提供上传文件的URL地址.'.loc(),
            bodyStyle: 'background-color:transparent;padding:5px 0 0 10px',
            iconCls: 'db-icn-info',
            
            items: [{
                
				fieldLabel: '&nbsp;URL <span style="font-size:0.8em;color:#666">('+'例如'.loc()+':http://www.mydomain.com/myfile.txt)</span>',
                   
				id: 'db-ufu-url',
                  
				width: 330,
                    
				allowBlank: false,
                   
				regex : this.urlRegExp,
                  
				regexText: '地址无效.'
.loc()},
				{
 
					fieldLabel: '&nbsp;'+'文件名'.loc(),

					id: 'db-ufu-name',
					width: 150,

					allowBlank: false
 
				}
            ]             
        }), {
            layout: 'fit',
            border: false,
            bodyStyle: 'background-color:transparent'
        }, {
            layout: 'fit',
            border: false,
            bodyStyle: 'background-color:transparent'
        }, {
            layout: 'fit',
            border: false,
            bodyStyle: 'background-color:transparent'
        }],
        buttons: [
            {text: '取消'.loc(), handler: this.close, scope: this},
            {text: '上传'.loc(), handler: this.upload, scope: this},
            {text: '新上传'.loc(), handler: this.newUpload, hidden: true, scope: this}
        ]     
    }));   
    
};

Ext.extend(utils.km.file.UploadFromUrl, Ext.Window, {
    
    // private
    onRender : function(ct, position){
       
		utils.km.file.UploadFromUrl.superclass.onRender.call(this, ct, position);
        
        this.txtUrl = Ext.ComponentMgr.get('db-ufu-url');
        this.txtName = Ext.ComponentMgr.get('db-ufu-name');
        
        this.on('beforeclose', this.onBeforeClose, this);
        this.txtUrl.on('change', this.onUrlChange, this);
    },
    
    upload : function() {    
        if (!this.txtUrl.isValid() || !this.txtName.isValid()) {
            return;
        }
        
        // show progress
        this.showProgress();        
        this.currentUpload = {url:this.txtUrl.getValue(),folderId:this.folderId,fileName:this.txtName.getValue()};
        RemoteMethods.UploadFromUrl(this.txtUrl.getValue(), this.folderId, this.txtName.getValue(), function(result) {
            if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
                this.fireEvent("upload", this, this.folderId);
                this.showSuccess(result.Description);
                
            } else {
                this.showError(result.Description);
                     
            }
            this.currentUpload = null;
        }, this); 
    },
    
    showProgress : function() {
        this.getLayout().setActiveItem(1);
        this.buttons[1].hide();
        this.getLayout().activeItem.body.update(
            '<div class="prg">' + 
                '<p class="hlp">'+'文件正在上传中'.loc()+'.</p>' +
                '<p class="bar"><span>'+'上传中'.loc()+'...</span></p>' +
                '<p class="center">'+'请等待'.loc()+'...</p>' +
            '</div>');
    },
    
    showError : function(msg) {
        this.getLayout().setActiveItem(2);
        this.buttons[2].show();
        this.getLayout().activeItem.body.update(
            '<div class="err">' +
                '<p class="hlp">'+'上传出现错误'.loc()+' "' + this.currentUpload.fileName +  '":</p>' + 
                '<p class="info">' + msg + '</p>' +
            '</div>');
    },
    
    showSuccess : function(msg) {
        this.getLayout().setActiveItem(2);
        this.buttons[2].show();
        this.getLayout().activeItem.body.update(
            '<div class="suc">' +
                '<p class="hlp">'+'文件上传成功'.loc()+':</p>' + 
                '<p class="info">' + msg + '</p>' +
            '</div>');            
    },
    
    newUpload : function(msg) {
        this.getLayout().setActiveItem(0);
        this.buttons[1].show();
        this.buttons[2].hide();
        this.txtUrl.setValue('');
        this.txtName.setValue('');
    },
    
    onUrlChange : function() {
        var pu = this.parseUrl(this.txtUrl.getValue());
        if (pu && pu.file) {
            this.txtName.setValue(pu.file);
        }
    },
    
    parseUrl : function(url) {
        if (url.match(this.urlRegExp)) {
            return  {url: RegExp['$&'],
                    protocol: RegExp.$1,
                    authority: RegExp.$2,
                    host:RegExp.$3,
                    path:RegExp.$5,
                    file:RegExp.$7,
                    hash:RegExp.$8};
        }
        else {
            return null;
        }
    },    
    
    onBeforeClose: function(wnd) {
        if (!this.currentUpload)
            return true;
        Ext.Msg.show({
            title:'关闭上传窗口?'.loc(),
            msg: '仍有上传进程运行,确认关闭?'.loc(),
            buttons: Ext.Msg.YESNO,           
            icon: Ext.MessageBox.QUESTION,
            modal: false,
            scope: this,
            fn: function(btn) {
                if(btn == 'yes') {
                    this.currentUpload = null;
                    this.close();
                }
            }
        });
        return false;
    }    
});

