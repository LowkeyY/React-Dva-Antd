Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.ShenQingWindow = function(btn) {
	var p = Ext.getCmp(btn.panelId);
	
	var rec = p.getSelectionModel().getSelected();
				if (typeof(rec) == 'undefined') {
					if (p.getStore().getCount() == 1) {
						rec = p.getStore().getAt(0);
					} else {
						Ext.msg("warn", '请选择要编辑的行.'.loc());
						return;
					}
	}
	
	var file_id=rec.get("pmk");
	var file_name=rec.get("FILE_INFO_NAME");
	CPM.openModuleWindow("2b681a3f-9d25-48a8-aea0-f62fb9d1942a", p, {pageType : "new"}, {//固定ID 模块:海外_文件申请使用
				icon : btn.icon,
				title : btn.text,
				height : 600,
				file_name:file_name,
				file_id:file_id,
				
				listeners : {
					close : function() {
					}
				}
			});
}