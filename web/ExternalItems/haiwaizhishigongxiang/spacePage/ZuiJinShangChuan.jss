Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");
using("ExternalItems.haiwaizhishigongxiang.PluginUitls");

ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinShangChuan = function() {
	this.id = "ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinShangChuan";
	this.init();
}
ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinShangChuan.prototype = {
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
			url : "/ExternalItems/haiwaizhishigongxiang/spacePage/ZuiJinShangChuan.jcp",
			root : "authArray",
			fields : ["xh", "name", "dept", "date", "file_size", "file_type",
					"IS_SECRECY","id"],
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
								header : "文件大小",
								width : 50,
								dataIndex : "file_size",
								sortable : false
							}, {
								header : "入库日期",
								width : 50,
								dataIndex : "date",
								sortable : false
							}, {
								header : "上传部门",
								width : 50,
								dataIndex : "dept",
								sortable : false
							}, {
								header : "文件类型",
								width : 50,
								dataIndex : "file_type",
								sortable : false,
								hidden : true
							}, {
								header : "共享方式",
								width : 50,
								dataIndex : "IS_SECRECY",
								sortable : false,
								hidden : true
							}, {
								header : "文件id",
								width : 50,
								hidden : true,
								dataIndex : "id",
								sortable : false
							}]

					,
					listeners : {
						rowdblclick : function(gridPanel, rowIndex, e) {
							var rec = gridPanel.getStore().getAt(rowIndex);

							var cl = new Ext.data.Record({
										"pmk" : rec.get("id"),
										"FILE_INFO_NAME" : rec.get("name")
									});

							ExternalItems.haiwaizhishigongxiang.FilePreview(cl,
									gridPanel, null);
						}
					}
				});
		var PUS = new ExternalItems.haiwaizhishigongxiang.PluginUitls();
		PUS.addIcon2GridColumn(grid.getColumnModel(), "name", "file_type");
		PUS.bytesToSizeColumn(grid.getColumnModel(), "file_size");
		this.mainPanel = new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet(
				{
					id : this.id,
					title : "最新入库资料",
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