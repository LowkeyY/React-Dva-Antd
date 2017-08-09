/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file'); 

////////////////////////////////////////////////////////////////////
//
//                  utils.km.file.SharingDialog
//
/////////////////////////////////////////////////////////////////// 
utils.km.file.SharingDialog = function(config) {
    config.resizable = false;
    config.constrainHeader = true;
    config.width = 345;
    config.height = 440;
    
    config.buttons = [
        {text : '确定'.loc(), handler: this.save, scope: this},
        {text : '取消'.loc(), handler: this.close, scope: this}
    ];
    
    utils.km.file.SharingDialog.superclass.constructor.call(this, config);
       
    helpElm = this.body.createChild({
        tag: 'div',
        cls: 'hlp',
        style: 'padding:5px',
        html: '共享给文件夹.'.loc()
    });
    
    var formElm = this.body.createChild({
        tag: 'div',
        cls: 'x-moz-cur-fx',
        style: 'padding:5px;',
        html: '<div style="padding:5px"><input type="checkbox" /> '+'共享文件夹'.loc()+'</div>'
    });
    
    // Create the form
    sharingForm = new Ext.form.FormPanel({
        labelWidth: 50,
        labelAlign: 'right',
        border: false,
        disabled: true,
        maskDisabled: false,
        bodyStyle: 'background-color:Transparent',
        items: [{
            xtype:'fieldset',
            title: 'Shared Folder Information',
            
            autoHeight:true,
            html: '<table cellspacing="3">' +
                  '<tr><td>'+'用户名'.loc()+':</td><td><input type="text" style="width:230px;margin-bottom:2px;" id="x-sharing-dialog-user" /></td></tr>' +
                  '<tr><td>'+'权限'.loc()+':</td><td><input type="radio" name="rbPermission" id="x-sharing-dialog-permission" /> '+'完全控制'.loc()+' &nbsp;<input type="radio" name="rbPermission" checked="true" /> '+'查看'.loc()+'/'+'下载'.loc()+'</td></tr>' +
                  '<tr><td colspan="2" id="x-sharing-dialog-btnAdd"></td></tr>' +
                  '<tr><td colspan="2"><div id="x-sharing-dialog-grid" style="height:130px;overflow:auto;background-color:#fff;border:solid 1px #7F9DB9;"></div></td></tr>' +
                  '<tr><td colspan="2" align="right" id="x-sharing-dialog-btnRemove"></td></tr>' +
                  '<tr><td>'+'注释'.loc()+':</td><td><input type="text" id="x-sharing-dialog-comment" /></td></tr>' +
                  '</table>'
        }]        
    });
        
    sharingForm.render(formElm.dom);
    
    var btnAdd = new Ext.Button({renderTo:'x-sharing-dialog-btnAdd', text:' Add '});
    btnAdd.on('click', this.btnAdd_Click, this);
    var btnRemove = new Ext.Button({renderTo:'x-sharing-dialog-btnRemove', text:'Remove'});
    btnRemove.on('click', this.btnRemove_Click, this);
    
    // add address book field
    var add_field = new Ext.form.AddressBookField({
        width: 230,
        getSubUserName: true,
        applyTo: 'x-sharing-dialog-user'
    });   
    
    var cmt_field = new Ext.form.TextField({
        width: 230,
        applyTo: 'x-sharing-dialog-comment'
    }); 
    
    // create the grid
    permissionsArray = new Array();
    gridDataStore = new Ext.data.Store({
            proxy: new Ext.data.MemoryProxy(permissionsArray),
            reader: new Ext.data.ArrayReader({id: 0}, [
                   {name: 'username'},
                   {name: 'permission'},
                   {name: 'notify', type: 'bool'}
              ])
    });    
    var notifyRenderer = function(notify) {
        if(notify)
            return '<img src="/themes/icon/xp/email.gif" alt="'+'发送通知邮件'.loc()+'" style="float:left;padding-left:5px" />';
        else
            return "";
    };
    var colModel = new Ext.grid.ColumnModel([
        {id: "clName", header: "User", sortable: true, locked: false, dataIndex: "username"},     
        {header: "Permission", sortable: true, locked: false, dataIndex: "permission"},
        {header: "Notify", sortable: true, locked: false, dataIndex: "notify", width: 40, renderer: notifyRenderer}
    ]);   
    permissionsGrid = new Ext.grid.GridPanel({
        ds: gridDataStore,
        cm: colModel,
        applyTo: 'x-sharing-dialog-grid',
        autoExpandColumn: 'clName',
        monitorWindowResize: true,        
        enableColLock: false,	
        enableColumnMove: false,
        enableHdMenu: false,
        border: false,
        width: 290,
        selModel: new Ext.grid.RowSelectionModel()
    });   
    permissionsGrid.render();    
    permissionsGrid.on('celldblclick', this.cellDoubleClicked, this);
    permissionsGrid.on('cellclick', this.cellClicked, this);
    
    chkShareFolder = Ext.get(formElm.dom.childNodes[0].childNodes[0]);
    chkShareFolder.on('click', this.toggleSharing , this);
    
    txtComment = Ext.get('x-sharing-dialog-comment').dom;
    shareItem = null;
    
    this.events = {"save" : true};       
    
    this.initSharingDialog();  
};

Ext.extend(utils.km.file.SharingDialog, Ext.Window, {
    initSharingDialog: function() {
        var SharingInformationLoaded = function(result) {
            shareItem = result;
            this.addNotify();
            this.bindSharingDialog();
            this.show();
        };
        
        RemoteMethods.GetSharedItem(this.folderId, SharingInformationLoaded, this);
    },
    
    bindSharingDialog: function() {
        
        chkShareFolder.dom.checked = shareItem.Enabled;
        this.toggleSharing();
        
        txtComment.value = (txtComment.value != '') ? txtComment.value : (shareItem.Comment || '');
    
        permissionsArray.length = 0;        
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            permissionsArray[itemIndex] = new Array();
            permissionsArray[itemIndex][0] = prm.UserName;
            permissionsArray[itemIndex][1] = (prm.UserAccessType == 0) ? '查看'.loc()+'/'+'下载'.loc() : '完全控制'.loc();
            permissionsArray[itemIndex][2] = prm.Notify;
            itemIndex++;
        }
        
        gridDataStore.load();     
    },
    
    save: function() {  
        
        var ItemSaved = function(result) {
            if (result.CurrentStatus == utils.km.file.StatusCode.Error) {
                Ext.MessageBox.alert('Error', result.Description);
            }
            else {
                this.fireEvent('save', this.folderId, this.getUsersToBeNotified());
                this.close();
            }
        };      
        
        // get values
        shareItem.Enabled = chkShareFolder.dom.checked;
        shareItem.Comment = txtComment.value;
        
        RemoteMethods.SaveSharedItem(shareItem.FolderID, shareItem.Enabled, shareItem.Comment, shareItem.Permissions, ItemSaved, this);
    },
    
    addPermission: function(user, permission) {
    
        // don't add empty user
        if(user.trim() == '')
            return;
    
        // see if the user is not added
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            if(prm.UserName.toLowerCase() == user.toLowerCase().trim())
                return;
            itemIndex++;
        }    
    
        var index = shareItem.Permissions.length;
        shareItem.Permissions[index] = {
            FolderID: shareItem.FolderID,
            UserName: user.trim(),
            UserAccessType: permission,
            Notify: true
        };
        
        this.bindSharingDialog();
    },
    
    removePermission: function(user) {
    
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            if(prm.UserName.toLowerCase() == user.toLowerCase().trim()) {
                shareItem.Permissions.splice(itemIndex, (itemIndex == 0) ? (itemIndex + 1) : itemIndex);                
            }
            itemIndex++;
        }
        
        this.bindSharingDialog();
    },    
    
    toggleSharing: function() {
        var checked = chkShareFolder.dom.checked;
        
        if(checked) {
            sharingForm.enable();
            shareItem.Enabled = true;
        }
        else {
            sharingForm.disable();
            shareItem.Enabled = false;
        }
    },
    
    getUsersToBeNotified: function() {
        var users = new Array();
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            if(prm.Notify) {
                users[users.length] = prm.UserName;                
            }
            itemIndex++;
        }
        return users;
    },
    
    btnAdd_Click: function() {
        var userInput = Ext.get('x-sharing-dialog-user').dom;
        var prm = 0;
        if (Ext.get('x-sharing-dialog-permission').dom.checked)
            prm = 1;
        var index = 0;
        var ads = userInput.value.split(",");
        var ad = null;
        while(ad = ads[index]) {
            ad = ad.trim();
            if(ad != '') {
                this.addPermission(ad, prm);
            }
            index++;
        }
        userInput.value = '';
    },
    
    btnRemove_Click: function() {
        var rw = permissionsGrid.getSelectionModel().getSelected();
        if (rw)
            this.removePermission(rw.id);
    },
    
    cellDoubleClicked: function(grd, rowIndex, colIndex, e) {        
        
        if(colIndex != 1)
            return;
            
        var dataItem = grd.getStore().data.items[rowIndex].data;
        var user = dataItem.username;
            
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            if(prm.UserName.toLowerCase() == user.toLowerCase().trim()) {
                prm.UserAccessType = (prm.UserAccessType == 0) ? 1 : 0;
            }
            itemIndex++;
        }
        
        this.bindSharingDialog();        
    },
    
    cellClicked: function(grd, rowIndex, colIndex, e) {        
        
        if(colIndex != 2)
            return;
            
        var dataItem = grd.getStore().data.items[rowIndex].data;
        var user = dataItem.username;
            
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            if(prm.UserName.toLowerCase() == user.toLowerCase().trim()) {
                prm.Notify = (prm.Notify == true) ? false : true;
            }
            itemIndex++;
        }
        
        this.bindSharingDialog();        
    },    
    
    addNotify: function() {
        var itemIndex = 0;
        var prm = null;
        while (prm = shareItem.Permissions[itemIndex]) {
            prm.Notify = false;
            itemIndex++;
        }    
    }
        
});
