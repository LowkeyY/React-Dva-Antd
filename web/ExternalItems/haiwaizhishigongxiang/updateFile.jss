Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.updateFile = function(btn) {
	var p = Ext.getCmp(btn.panelId);
	var formId=btn.panelId;
	var rec = p.getSelectionModel().getSelected();
	if (typeof(rec) == 'undefined') {
		if (p.getStore().getCount() == 1) {
			rec = p.getStore().getAt(0);
		} else {
			Ext.msg("warn", '请选择要编辑的行.'.loc());
			return;
		}
	}
	p.param.file_id = rec.get("pmk");
	CPM.openModuleWindow("66d5e224-fed1-4363-bd81-6f81d78752e8", p, {
				pageType : "new",
				param : p.param
			}, {// 固定ID 模块:更新文件内容。
				icon : btn.icon,
				title : btn.text,
				width : 500,
				height : 200,

				listeners : {
					close : function() {
						var p;
						if ((p = Ext.getCmp(formId)) && p.store) {
							delete p.param.popupWindowConfig;
						}

					}
				}
			});
}