Ext.namespace("dev.workflow.popup");

dev.workflow.popup.attrGrid = function(metaArray){
   var fm = Ext.form;
   var attrCm = new Ext.grid.ColumnModel([{
           header: '属性'.loc(),
           dataIndex: 'attrName',
           width: 130,
           editor: new fm.TextField({
               allowBlank: false,
			   blankText:'属性必须提供.'.loc()
           })
        },{
           id:'attrValue',
           header: '值'.loc(),
           dataIndex: 'attrValue',
           width: 220,
           editor: new fm.TextField({
               allowBlank: false,
			   blankText:'值必须提供.'.loc()
           })
        }
    ]);
    attrCm.defaultSortable = true;

    var attr = Ext.data.Record.create([
           {name: 'attrName'},
           {name: 'attrValue', type: 'string'}
     ]);

	this.attrStore = new Ext.data.SimpleStore({
		fields:['attrName', 'attrValue'],
		data:metaArray
	});

   var attrGrid = this.mainPanel= new Ext.grid.EditorGridPanel({
	   	id:'attr',
		title: '属性'.loc(),
        cm: attrCm,
		store: this.attrStore ,
        frame:false,
		selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        clicksToEdit:1,
        tbar: [{
			text: '增加'.loc(),
			icon: '/themes/icon/xp/add.png',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
                var p = new attr({
                    attrName: '',
                    attrValue: ''
                });
                attrGrid.stopEditing();
                this.attrStore.insert(0, p);
                attrGrid.startEditing(0, 0);
            }
        },'-',{
			text: '删除'.loc(),
			icon: '/themes/icon/xp/delete.gif',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
				var selectedKeys = attrGrid.selModel.selections.keys; 
				if(selectedKeys.length > 0){
					this.attrStore.remove(attrGrid.selModel.getSelected()) ;
				}else{
					Ext.msg("warn",'最少选定一条记录进行删除！'.loc());
				}
            }
        }]
    });
};

Ext.extend(dev.workflow.popup.attrGrid, Ext.grid.EditorGridPanel, {
	getAttrs : function(){
		var attrArray=[];
		for(var i=0;i<this.attrStore.getCount();i++){
			var metaTmp=new XMeta();
			var rc=this.attrStore.getAt(i);
			metaTmp.init(rc.get('attrName'),rc.get('attrValue'));
			attrArray.push(metaTmp);
		}
		return attrArray;
    }
});
