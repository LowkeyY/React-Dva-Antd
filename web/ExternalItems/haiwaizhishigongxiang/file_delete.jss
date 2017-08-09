Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.file_delete = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var rec = panel.getSelectionModel().getSelections();
	if (rec.length == 0) {
		Ext.msg("warn", "请选择要删除的数据.");
		return;
	}
	var p = panel.param;
	var pmks = [];
	for (var i = 0; i < rec.length; i++) {
		pmks.push(rec[i].get("pmk"));
	}
	Ext.msg("confirm", "确定删除的记录?", function(answer) {
		if (answer == 'yes') {
			Ext.Ajax.request({
						url : '/ExternalItems/haiwaizhishigongxiang/file_delete.jcp',
						params : {
							'file_id' : pmks.join(","),
							'exportItem':panel.param.exportItem,
							'exportData':panel.param.exportData
						},
						method : 'post',
						scope : this,
						success : function(response, options) {
							panel.store && panel.getStore().reload();
						}
					});
		}
	});

}