Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");

ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinXiaZai = function() {
	this.id = "ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinXiaZai";
	this.init();
}
ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinXiaZai.prototype = {
	init : function() {

		var tools = [];
		tools.push({
					id : 'refresh',
					handler : function(e, target, panel) {
						panel.scope.refresh();
					}
				});
		this.data = new Ext.data.JsonStore({
			method : "GET",
			url : "/ExternalItems/haiwaizhishigongxiang/spacePage/ZuiJinXiaZai.jcp",
			root : "authArray",
			fields : ["xh", "name", "user", "date", "type","file_id"],
			remoteSort : true
		});
		var grid = new Ext.grid.GridPanel({
					store : this.data,
					height : 250,
					columnLines : true,
					closable : false,
					border : true,
					viewConfig : {
						forceFit : true
					},
					frame : false,
					enableDragDrop : true,
					columns : [{
								header : "序号",
								width : 20,
								dataIndex : "xh",
								sortable : false
							}, {
								header : "资料名称",
								width : 100,
								dataIndex : "name",
								sortable : false
							}, {
								header : "下载用户",
								width : 50,
								dataIndex : "user",
								sortable : false
							}, {
								header : "日期",
								width : 50,
								dataIndex : "date",
								sortable : false
							}, {
								header : "文件类型",
								width : 50,
								hidden : true,
								dataIndex : "type",
								sortable : false
							}, {
								header : "文件id",
								width : 50,
								hidden : true,
								dataIndex : "file_id",
								sortable : false
							}],
					listeners : {
						rowdblclick : function(gridPanel, rowIndex, e) {
							var rec = gridPanel.getStore().getAt(rowIndex);
							
							var cl=new Ext.data.Record({
								"pmk" : rec.get("file_id"),
								"FILE_INFO_NAME" : rec.get("name")
							});
							
							
							ExternalItems.haiwaizhishigongxiang.FilePreview(cl, gridPanel, null);
						}
					}
				});

		var PUS = new ExternalItems.haiwaizhishigongxiang.PluginUitls();
		PUS.addIcon2GridColumn(grid.getColumnModel(), "name", "type");
		this.mainPanel = new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet(
				{
					id : this.id,
					title : "最近下载文件",
					height : 300,
					iconCls : "iportal-icon-chart",
					scope : this,
					tools : tools,
					items : grid,
					listeners : {
						afterrender : function(comp) {
							comp.scope.refresh();
						}
					}
				});
	},
	refresh : function() {
		var mainPanel = this.mainPanel, data = this.data;
		if (!mainPanel.el || !mainPanel.el.dom) {
			return;
		}
		data.load({});
	}
}