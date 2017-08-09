Ext.namespace("dev.module");
using("lib.jsvm.MenuTree");
using("dev.module.ModuleNavPanel");
dev.module.ParamSearch = function(result,navPanel) {
	var nav = navPanel;
	var tree = nav.menuTree;
	this.store = new Ext.data.JsonStore({
		fields : ["prglogic_name", "prgphy_name", "object_id","tab_name", "path"],
		data :result,
		scope : this,
		autoLoad:true,
		root : 'data'
	});
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '逻辑名称'.loc(),
				width : 180,
				sortable : true,
				align : 'center',
				defaultSortable : true,
				dataIndex : 'prglogic_name'
			}, {

				header : '物理名称'.loc(),
				width : 120,
				sortable : true,
				align : 'center',
				dataIndex : 'prgphy_name'
			}, {
				header : "ID",
				width : 120,
				sortable : true,
				align : 'center',
				dataIndex : 'object_id'
			}, {
				header : '引用表'.loc(),
				width : 240,
				sortable : true,
				align : 'center',
				dataIndex : 'tab_name'
			}
	]);   
	this.grid = new Ext.grid.GridPanel({
		store : this.store,
		cm : cm,
		stripeRows : true,
		scope : this,
		sm : new Ext.grid.RowSelectionModel({
			singleSelect : true
		})
	});
	var grid=this.grid;
	this.grid.on('rowclick', function(grid, rowIndex, e) {
		var path = grid.getSelectionModel().getSelected().get("path");
		tree.loadPath(path);
		var nowNode = tree.getNowNode();
		this.exeHistoryNode(tree, nowNode);
		this.clickEvent(nowNode);
		Ext.getCmp("regWindow").close();
	}, nav);

	var desktop=WorkBench.Desk.getDesktop();
	var winWidth=desktop.getViewWidth()* 0.6;
	var winHeight=desktop.getViewHeight()* 0.6;
	this.win= new Ext.Window({
				id:'regWindow',
				title : '数据列表'.loc(),
				modal : false,
				layout : 'fit',
				width : winWidth,
				height : winHeight,
				buttons : [{
							text : '关闭'.loc(),
							handler : function() {
								this.win.close();
							}.createDelegate(this)
						}],
				items : this.grid
	});
};
Ext.extend(dev.module.ParamSearch, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    }
});   