Ext.ns("ExternalItems.haiwaizhishigongxiang")

ExternalItems.haiwaizhishigongxiang.FilePushOrMove = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var rec = panel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			if (panel.getStore().getCount() == 1) {
				rec = [panel.getStore().getAt(0)];
			} else {
				Ext.msg("warn", '请选择需要操作的文件.'.loc());
				return;
			}
	}
	var pmks = new Array();
	for (var i = 0; i < rec.length; i++) {
		pmks.push(rec[i].get("pmk"));
	}
	var win = panel.findParentByType(Ext.Window);
	CPM.openModuleWindow("800658be-88e9-495d-9589-4534a05a47ae", panel, {pageType:"new"}, {// 固定ID 模块:海外_推送或移动
		icon : btn.icon,
		title : btn.text,
		pmks : pmks.join(','),
		panelId : btn.panelId,
		width : 450,
		height : 300
	});
}