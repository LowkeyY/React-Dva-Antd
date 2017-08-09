Ext.ux = {};

Ext.ux.AutoGridPanel = Ext.extend(Ext.grid.GridPanel, {
    
    initComponent : function(){

        if(this.columns && (this.columns instanceof Array)){
            this.colModel = new Ext.grid.ColumnModel(this.columns);
            delete this.columns;
        }
        
        if(!this.colModel) {
            this.colModel = new Ext.grid.ColumnModel([]);
        }
        
        Ext.ux.AutoGridPanel.superclass.initComponent.call(this);

        if(this.store){
            this.store.on("metachange", this.onMetaChange, this);
        }

        if(this.autoSave) {
            this.colModel.on("widthchange", this.saveColumModel, this);
            this.colModel.on("hiddenchange", this.saveColumModel, this);
            this.colModel.on("columnmoved", this.saveColumModel, this);
            this.colModel.on("columnlockchange", this.saveColumModel, this);            
        }     
    },    

    onMetaChange : function(store, meta) {
        var c;
        var config = [];
        var lookup = {};
        for(var i = 0, len = meta.fields.length; i < len; i++)
        {
            c = meta.fields[i];
            if(c.header !== undefined){                
                if(typeof c.dataIndex == "undefined"){
                    c.dataIndex = c.name;
                }
                if(typeof c.renderer == "string"){
                    c.renderer = Ext.util.Format[c.renderer];
                }
                if(typeof c.id == "undefined"){
                    c.id = 'c' + i;
                }
                if(c.editor && c.editor.isFormField){
                    c.editor = new Ext.grid.GridEditor(c.editor);
                }
                c.sortable = true;               
                
                config[config.length] = c;
                lookup[c.id] = c;                
            }
        }
        this.colModel.config = config;  
        this.colModel.lookup = lookup;  
        
        if(this.rendered){
            this.view.refresh(true);
        }
        this.view.hmenu.add(
            {id:"reset", text: "Reset Columns", cls: "xg-hmenu-reset-columns"}
        );        
    },
    saveColumModel : function() {
        var c, config = this.colModel.config;
        var fields = [];
        for(var i = 0, len = config.length; i < len; i++)
        {
            c = config[i];
            fields[i] = {name: c.name, width: c.width};
            if(c.hidden) {
                fields[i].hidden = true;
            }
        }
        var sortState = this.store.getSortState();       
        Ext.Ajax.request({
            url: this.saveUrl,
            params : {fields: Ext.encode(fields), sort: Ext.encode(sortState)}
        });
    }
});