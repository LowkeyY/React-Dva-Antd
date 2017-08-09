Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.GISSeach = function() {
}
ExternalItems.haiwaizhishigongxiang.GISSeach.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		var mainPanel = new Ext.Panel({
			title : '地图查询',
			layout : 'fit',
			border : false,
			icon : '/themes/icon/probe/GIS.png',
			html : '<p>功能建设中...<p>'
		});
		parentPanel.add(mainPanel);
		parentPanel.doLayout();
	}
}