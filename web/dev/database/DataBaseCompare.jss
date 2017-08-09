
Ext.namespace("dev.database");

dev.database.DataBaseCompare   = function(object_id,result,frames,retFn) {
	var object_id = object_id;
	this.result=result;
	this.frames=frames;
	var MetaTable=this.frames.get('MetaTable');
	var ButtonArray = [];
	MetaTable.mainPanel.setStatusValue(['数据一致性检查'.loc()]);
	ButtonArray.push(new Ext.Toolbar.Button( {
		text : '返回'.loc(),
		icon : '/themes/icon/common/repeal.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		scope : this,
		hidden : false,
		handler : retFn
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
		btnId:'refresh',
		text: '刷新'.loc(),
		icon: '/themes/icon/all/arrow_refresh.gif',
		cls: 'x-btn-text-icon  bmenu',
		disabled:false,
		scope: this,
		hidden : false,
		handler :function(){
			this.ds.reload();
		}
	}));
   this.xg = Ext.grid;

	this.ds = new Ext.data.JsonStore({
			url :"/dev/database/CompareMetadata.jcp?object_id="+object_id ,
			root : 'dataItem',
			method : 'GET',
			fields : ["errorType", "errorDesc", "Operation"]
	});  
    this.cm = new Ext.grid.ColumnModel([ new this.xg.RowNumberer(),{
           header: '错误类别'.loc(),
           dataIndex: 'errorType',
		   sortable: true,
		   width:60,
           align: 'left'
        },{
           header: '错误描述'.loc(),
           dataIndex: 'errorDesc',
           sortable: true,
		   width:300,
           align: 'left'
        }]);

    this.cm.defaultSortable = true;

	this.CompareListGrid = new Ext.grid.GridPanel({
        store: this.ds,
        cm: this.cm,
		border:false,
        trackMouseOver:false,
        loadMask: {msg:'数据载入中...'.loc()},
        viewConfig: {
			forceFit:true, 
            enableRowBody:true, 
            showPreview:true, 
            getRowClass : this.applyRowClass 
        }
    })
	this.ds.load();
	this.MainTabPanel = new Ext.Panel({
			tbar : ButtonArray,
			layout : 'fit',
			border : false,
			items:[this.CompareListGrid]
	});
};
