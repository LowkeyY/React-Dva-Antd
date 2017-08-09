/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file'); 

////////////////////////////////////// utils.km.file.AddressBook
//
/////////////////////////////////////////////////////////////////// 
utils.km.file.AddressBook = function(config) {
    
    this.events = {
        "select" : true,
        "cancel" : true        
    };    
    
    this.txtEmail = new Ext.form.TextField({
      
		fieldLabel: 'Email',
      
		name: 'email',
       
		width:200,
        
		allowBlank:false,
     
		vtype: 'email'
   
	});
    
    this.txtName = new Ext.form.TextField({
       
		fieldLabel: '姓名'.loc(),
        
		name: 'name',
       
		width:200,
      
		allowBlank:false
  
	});
    
    this.addForm = new Ext.form.FormPanel({
        labelWidth:40, 
        labelAlign:'left', 
        buttonAlign:'right',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        title: '加入新地址'.loc(),
        
        items: [this.txtEmail, this.txtName],
        
        buttons: [
            {text:'保存'.loc(), handler:this.addAddress, scope:this},
            {text:'取消'.loc(),handler:function(){ this.addContainer.hide(true); }, scope:this}
        ]
    });
    
    // create address list grid
    this.addressListGrid = new Ext.grid.GridPanel({
        title: '地址簿'.loc(),
        autoHeight: true,
        loadMask: true,
        store: new Ext.data.SimpleStore({
            id: 0,
            fields: [{name: 'email'},{name: 'name'}],
            data: []
        }),
        columns: [
            {header: "Email", width: 160, sortable: true, locked: false, dataIndex: "email"},     
            {id: "clName", header: "Name", sortable: true, locked: false, dataIndex: "name"}            
        ],
        viewConfig: {
            forceFit: true
        },
        sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
        autoExpandColumn: 'clName',
                
        tbar: new Ext.Toolbar({items: [
            {
                text: 'Add', 
                iconCls: 'db-icn-add', 
                handler: function() {
                    if(!this.addContainer) {
                        this.addContainer = this.body.createChild({
                            tag: 'div',
                            style: 'width:270px;top:0'
                        });                            
                        this.addForm.render(this.addContainer);               
                    }         
                    this.addContainer.alignTo(this.addressListGrid.getTopToolbar().getEl(), 'bl');            
                    this.addContainer.show();                
                }, 
                scope: this
            }, '-', {
                text: 'Remove', 
                iconCls: 'db-icn-delete',
                handler: function() {
                    var rw = this.addressListGrid.getSelectionModel().getSelected();
                    if (rw) {
                        RemoteMethods.RemoveAddress(rw.data.email, this.addressBookLoadComplete, this);                
                    }
                },
                scope: this
            }                        
        ]})
    });    
    
    this.subUserGrid = new Ext.grid.GridPanel({
        title: 'Sub Users',
        autoHeight: true,
        store: new Ext.data.SimpleStore({
            id: 0,
            fields: [{name: 'username'},{name: 'email'},{name: 'name'}],
            data: []
        }),
        columns: [
            {header: "User Name", width: 100, sortable: true, locked: false, dataIndex: "username"},     
            {header: "Email", width: 130, sortable: true, locked: false, dataIndex: "email"},    
            {id: "clName", header: "Name", sortable: true, locked: false, dataIndex: "name"}          
        ],
        viewConfig: {
            forceFit: true
        },
        sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
        autoExpandColumn: 'clName'
    });       
    
    utils.km.file.AddressBook.superclass.constructor.call(this, Ext.apply(config, {
        border: true,
        layout: 'fit',
        
        items: new Ext.TabPanel({
            activeTab: 0,
            border: false,
            
            items: [
                 this.addressListGrid,
                 this.subUserGrid
            ],
            
            buttons: [
                {text:'Select', handler:this.onSelect, scope:this},
                {text:'Cancel', handler:this.onCancel, scope:this}            
            ]            
        })
    }));
    
    // load address book data
    RemoteMethods.GetAddressBook(this.addressBookLoadComplete, this);  
    RemoteMethods.GetSubUsers(this.subUsersLoadComplete, this);
};

Ext.extend(utils.km.file.AddressBook, Ext.Panel, {

    getTabPanel: function() {
        return this.items.items[0];
    },
    
    addressBookLoadComplete: function(result) {
        this.addressListGrid.store.loadData(result);
    },

    addAddress: function() {
            var email = this.txtEmail.getValue().trim();
            var name = this.txtName.getValue().trim();
            
            if(email == '' || name == '')
                return;
        
            RemoteMethods.AddAddress(email, name, this.addressBookLoadComplete, this);
            
            this.txtEmail.setValue('');
            this.txtName.setValue('');
            
            this.addContainer.hide();
    },
    
    subUsersLoadComplete: function(result) {
        this.subUserGrid.store.loadData(result);
        if (result.length == 0) {
            this.getTabPanel().activate(this.addressListGrid);
            this.subUserGrid.disable();
        }
    },
    
    clearSelections: function() {
        this.addressListGrid.getSelectionModel().clearSelections();
        this.subUserGrid.getSelectionModel().clearSelections();
    },
    
    getSelectedItems: function() {
        var items = new Array();
        
        var ContainsAddress = function(ad) {            
            for (var i = 0; i < items.length; ++i) {
                if (items[i].toLowerCase() == ad.toLowerCase()) {
                    return true;
                }
            }
            return false;
        };
        
        var rw = null;
        var selections = this.addressListGrid.getSelectionModel().getSelections();
        var index = 0;
        var ad = null;
        while(rw = selections[index]) {
            ad = rw.data.email;
            if(!ContainsAddress(ad))
                items[items.length] = ad;
            index++;
        }
        selections = this.subUserGrid.getSelectionModel().getSelections();
        index = 0;
        while(rw = selections[index]) {
            ad = (this.getSubUserName) ? rw.data.username : rw.data.email;
            if(!ContainsAddress(ad))
                items[items.length] = ad;
            index++;
        }     
        
        return items;   
    },
    
    onSelect: function() {
        this.fireEvent('select', this, this.getSelectedItems());
    },
    
    onCancel: function() {
        this.fireEvent('cancel', this);
    }

});

Ext.menu.AddressBookItem = function(config){
   
	Ext.menu.AddressBookItem.superclass.constructor.call(this, new utils.km.file.AddressBook(config), config);
 
	this.addressbook = this.component;
    
    
	this.addEvents({select: true});
    
  
	this.addressbook.on("render", function(addressbook){
     
     addressbook.getEl().swallowEvent("click");
    
	addressbook.container.addClass("x-menu-date-item");
    });    
   
	
this.addressbook.on("select", this.onSelect, this);
  
	this.addressbook.on("cancel", this.onCancel, this);

};

	Ext.extend(Ext.menu.AddressBookItem, Ext.menu.Adapter, {
  
	 onSelect : function(addressbook, selected){
      
	    this.fireEvent("select", this, addressbook, selected);
   
	    Ext.menu.AddressBookItem.superclass.handleClick.call(this);
    },
    
  
	onCancel : function(addressbook, selected){
      
		Ext.menu.AddressBookItem.superclass.handleClick.call(this);
   
	}  

});

Ext.menu.AddressBookMenu = function(config){
   
	Ext.menu.AddressBookMenu.superclass.constructor.call(this, config);
   
	this.plain = true;
  
	var abi = new Ext.menu.AddressBookItem(config);
   
	this.add(abi);
  
	this.addressbook = abi.addressbook;

    this.relayEvents(abi, ["select"]);
};

	Ext.extend(Ext.menu.AddressBookMenu, Ext.menu.Menu, {
cls:'x-date-menu'
}
);


//////////////////////////////////////  Ext.form.AddressBookField
//
/////////////////////////////////////////////////////////////////// 
Ext.form.AddressBookField = Ext.extend(Ext.form.TriggerField,  {

    triggerClass : 'x-form-address-trigger',

    defaultAutoCreate : {tag: "input", type: "text", size: "10", autocomplete: "off"},

    initComponent : function(){
        Ext.form.AddressBookField.superclass.initComponent.call(this);        
    
        this.list = new Ext.Layer({shadow: true, constrain:false });
        this.list.setWidth(400);  
        
        this.elem = this.list.createChild({
            tag: 'div',
            style: 'background-color:#efefec;border:solid 1px #b3b6b0;padding:5px'
        });            
    }, 
    
    validateValue : function(value){
        if(!Ext.form.AddressBookField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){
             return true;
        }
        
        return true;
    },    
    
    validateBlur : function(){
        return !this.list || !this.list.isVisible();
    },    
    
    getValue : function(){
        return Ext.form.AddressBookField.superclass.getValue.call(this) || "";
    },   
    
    setValue : function(addresses){
        Ext.form.AddressBookField.superclass.setValue.call(this, addresses);
    }, 
    
    onSelect: function() {
        if (this.addressbook) {
            var result = this.getValue();
            var itemIndex = 0;
            var ad = null;
            var ads = this.addressbook.getSelectedItems();
            while(ad = ads[itemIndex]) {
                //ad = ad.trim();
                if (this.getValue().toLowerCase().indexOf(ad.toLowerCase()) == -1) {
                    result += (result == '') ? ad : ', ' + ad;
                }
                itemIndex++;
            }
            this.setValue(result);
            this.list.hide();
        }
    },
    
    onCancel: function() {
        if(this.addressbook) {
            this.list.hide();
        }
    },
      
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.addressbook == null){
            this.addressbook = new utils.km.file.AddressBook({
                renderTo: this.elem,
                getSubUserName: this.getSubUserName || false,
                height: 300,
                width:388
            });
            this.addressbook.on('select', this.onSelect, this);
            this.addressbook.on('cancel', this.onCancel, this);
        }
        this.list.show();
        this.list.alignTo(this.el, "tr-br", [17, 0]);
                
    }
});