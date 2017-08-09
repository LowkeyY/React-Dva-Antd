/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file'); 

////////////////////////////////////////////////////////////////////
//
//                  utils.km.file.PublishedFolder
//
/////////////////////////////////////////////////////////////////// 
utils.km.file.PublishedFolder = function(config) {

    this.events = {
        "publish" : true,
        "unpublish" : true,
        "error": true,
        "email": true           
    };
    
    utils.km.file.PublishedFolder.superclass.constructor.call(this, Ext.applyIf(config || {}, {
        title: 'Publish This Folder',
        width: 380,     
        autoHeight:true,           
        border: true,

        
        items: new Ext.FormPanel({
            bodyStyle:'background-color:transparent',
            defaultType: 'textfield',    
            border: false,
            autoHeight:true,
            labelWidth: 60,
            
            items: [{
                xtype: 'fieldset',
                title: 'Access your published folder using the following links',
                autoHeight: true,
                defaultType: 'textfield',
                defaults: {width: 330}, 
                labelAlign: 'top',
                
                items: [{
                        
					fieldLabel: '&nbsp;&nbsp;Direct URL <span style="font-size:0.9em">(<a id="db-pf-url-link" href="#" target="_blank">Go to this URL</a>)</span>',
                        id: 'db-pf-url',
                        selectOnFocus: true,
                        readOnly: true
                    },{
                        fieldLabel: '&nbsp;&nbsp;<img src="../images/icons/rss.gif" style="margin-bottom:-3px" /> RSS <span style="font-size:0.9em">(<a id="db-pf-rss-link" href="#" target="_blank">Go to this RSS</a>)</span>',
                        id: 'db-pf-rss',
                        selectOnFocus: true,
                        readOnly: true 
                    }
                ]    
            },{
                xtype:'fieldset',
                id: 'db-pf-expire',
                checkboxToggle:true,
                title: 'Expire my published folder on a specified date',
                autoHeight:true,
                defaults: {width: 210},
                defaultType: 'textfield',
                collapsed: true,
                
                items :[new Ext.form.DateField({
                        fieldLabel: 'Date',
                        format: 'l, F d, Y',
                        id: 'db-pf-date',                        
                        readOnly: true
                    }), new Ext.form.TimeField({
                        fieldLabel: 'Time',
                        name: 'time',
                        id: 'db-pf-time',
                        maxHeight: 150,
                        readOnly: true
                    })
                ]
            },{
                xtype:'fieldset',
                id: 'db-pf-protect',
                checkboxToggle:true,
                title: 'Protect my published folder with a password',
                autoHeight:true,
                defaults: {width: 170},
                defaultType: 'textfield',
                collapsed: true,
                labelWidth: 100,
                
                items :[{
                        fieldLabel: 'Password',
                        id: 'db-pf-pass1',
                        inputType: 'password'
                    }, {
                        fieldLabel: 'Confirm Password',
                        id: 'db-pf-pass2',
                        inputType: 'password'
                    }
                ]
            },{
                xtype:'fieldset',
                id: 'db-pf-cmt',
                checkboxToggle:true,
                title: 'Add some comment to your published folder',
                autoHeight:true,
                defaultType: 'textarea',
                collapsed: true,
                hideLabels: true,
                
                items :[{
                        name: 'comment',
                        id: 'db-pf-comment',
                        inputType: 'password',
                        width: 330,
                        height: 70
                    }
                ]
            }]             
        }),
        
        buttons: [
            {text: 'Remove Publishing', handler: this.unpublish, scope: this},
            {text: 'Email Links', handler: this.email, scope: this},
            {text: 'OK', handler: this.update, scope: this}
        ]     
    }));   
    
};

Ext.extend(utils.km.file.PublishedFolder, Ext.Window, {
    
    // private
    onRender : function(ct, position){
      
		
		utils.km.file.PublishedFolder.superclass.onRender.call(this, ct, position);
        
        this.txtUrl = Ext.ComponentMgr.get('db-pf-url');
        this.txtRss = Ext.ComponentMgr.get('db-pf-rss');
        this.txtDate = Ext.ComponentMgr.get('db-pf-date');
        this.txtTime = Ext.ComponentMgr.get('db-pf-time');
        this.txtPass1 = Ext.ComponentMgr.get('db-pf-pass1');
        this.txtPass2 = Ext.ComponentMgr.get('db-pf-pass2');
        this.txtComment = Ext.ComponentMgr.get('db-pf-comment');
        
        this.fsExpire = Ext.ComponentMgr.get('db-pf-expire');
        this.fsProtect = Ext.ComponentMgr.get('db-pf-protect');
        this.fsComment = Ext.ComponentMgr.get('db-pf-cmt');
        
        // I couldn't find a better way to sync body size!
        this.fsExpire.on('expand', this.syncSize, this);
        this.fsExpire.on('collapse', this.syncSize, this);        
        this.fsProtect.on('expand', this.syncSize, this);
        this.fsProtect.on('collapse', this.syncSize, this);        
        this.fsComment.on('expand', this.syncSize, this);
        this.fsComment.on('collapse', this.syncSize, this);                
    },
    
    publish : function() {
        RemoteMethods.PublishFolder(this.folderId, false, new Date(), false, null, false, null, false, function(result) {
            if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
                var pfi = result.ReturnValue; 
                var pd = Date.parseDate(pfi.ExpireDate, 'Y/m/d H:i');
                this.txtUrl.setValue(pfi.DirectUrl);
                this.txtRss.setValue(pfi.RssUrl);
                if (pfi.EnableExpiration === true) this.fsExpire.expand();
                this.txtDate.setValue(pd);
                this.txtTime.setValue(pd);
                if(pfi.EnablePassword === true) this.fsProtect.expand();
                this.txtPass1.setValue(pfi.Password);
                this.txtPass2.setValue(pfi.Password);
                if(pfi.EnableComment === true) this.fsComment.expand();
                this.txtComment.setValue(pfi.Comment);
                Ext.getDom('db-pf-url-link').href = pfi.DirectUrl;
                Ext.getDom('db-pf-rss-link').href = pfi.RssUrl;                
                this.fireEvent("publish", this, pfi);
                this.show();
            } else {
                this.fireEvent("error", this, result.Description);            
            }
        }, this); 
    },
    
    update : function() {
        var expireDate = new Date();
        try {
            expireDate = this.txtDate.getValue().format('Y-m-d') + 'T' + Date.parseDate(this.txtTime.getValue(), this.txtTime.format).format('H:i:s');
        } catch (err) {
            // do nothing
        }
        
        // check if password and conform password are the same
        if(this.txtPass1.getValue() != this.txtPass2.getValue()) {
            this.fireEvent("error", this, '口令与确认口令不一致!'.loc()); 
            return;
        }
        
        RemoteMethods.PublishFolder(this.folderId, !this.fsExpire.collapsed, expireDate, !this.fsProtect.collapsed, this.txtPass1.getValue(), !this.fsComment.collapsed, this.txtComment.getValue(), true, function(result) {
            if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
                this.close();
            } else {
                this.fireEvent("error", this, result.Description);            
            }                      
        }, this);        
    },
    
    unpublish: function() {
        this.fireEvent("unpublish", this);
        this.close();
    },
    
    email : function() {
        this.fireEvent("email", this);
    }
    
});
