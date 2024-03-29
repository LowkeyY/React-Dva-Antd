Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.NodeEditWinodw = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var rec = panel.getSelectionModel().getSelected();
	if (typeof(rec) == 'undefined') {
		if (panel.getStore().getCount() == 1) {
			rec = panel.getStore().getAt(0);
		} else {
			Ext.msg("warn", '请选择要编辑的行.'.loc());
			return;
		}
	}

	Ext.Ajax.request({
				url : '/ExternalItems/haiwaizhishigongxiang/NodeEditWinodw.jcp',
				params : {
					'HW_EDIT_DIRID' : rec.get("pmk")
				},
				method : 'post',
				scope : this,
				success : function(response, options) {
					var win = panel.findParentByType(Ext.Window) , width = 800 , height = 600;
					if(win){
						width = win.width * 0.95;
						height = win.height * 0.95;
					} else if(panel.getWidth && panel.getHeight) {
						width = panel.getWidth() * 0.95;
						height = panel.getHeight() * 0.95;						
					};
					CPM.openModuleWindow("68ba33ca-3e26-496e-a5bf-24562e480f1e", panel, false, {//固定ID 模块：海外_分类节点管理
								icon : btn.icon,
								data_exportData : rec.get("pmk"),
								title : rec.get("DIR_NAME"),
								width : width,
								height : height,
								listeners : {
									close : function() {
									}
								}
							});
				}
			});
}