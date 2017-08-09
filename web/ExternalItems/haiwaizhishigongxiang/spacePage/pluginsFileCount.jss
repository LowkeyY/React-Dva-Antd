Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");

ExternalItems.haiwaizhishigongxiang.spacePage.pluginsFileCount = function() {
	this.id = "ExternalItems.haiwaizhishigongxiang.spacePage.pluginsFileCount";
	this.init();
}
ExternalItems.haiwaizhishigongxiang.spacePage.pluginsFileCount.prototype = {
	init : function() {
		var tools = [];
		tools.push({
					id : 'refresh',
					handler : function(e, target, panel) {
						panel.scope.refresh();
					}
				});
		this.mainPanel = new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet(
				{
					id : this.id,
					title : "文件统计",
					height : 300,
					iconCls : "iportal-icon-download",
					scope : this,
					tools : tools,
					listeners : {
						afterrender : function(comp) {
							comp.scope.refresh();
						}
					}
				});
	},
	refresh : function() {
		if (!this.mainPanel.el || !this.mainPanel.el.dom)
			return;
		
		
		
		var ds = new Ext.data.JsonStore({
						method : "POST",
						url : "/ExternalItems/haiwaizhishigongxiang/spacePage/getFileCount.jcp",
						root : "authArray",
						fields : ["name", "count"],
						remoteSort : true
					});
			ds.load({});
				
				
			var grid = new Ext.grid.GridPanel({
						store : ds,
						height : 250,
						id : "grid",
						columnLines : true,
						closable : false,
						border : true,
						viewConfig : {
							forceFit : true
						},
						frame : false,
						enableDragDrop : true,
						columns : [{
									header : "名称",
									width : 100,
									dataIndex : "name",
									sortable : false
								}, {
									header : "数量",
									width : 50,
									dataIndex : "count",
									sortable : false
								}]
					});
			this.mainPanel.add(grid);
	}
}