Ext.namespace("usr.cms.netdisk");
usr.cms.netdisk.downFile = function(btn) {

	
	 var panel = Ext.getCmp(btn.panelId);
    var win = panel.findParentByType(Ext.Window);
    var rec = panel.getSelectionModel().getSelected();
    if (typeof (rec) == "undefined") {
        if (panel.getStore().getCount() == 1) {
            rec = panel.getStore().getAt(0);
        } else {
            btn.target.type = 0;
            Ext.msg("warn", "请选择要操作的行.".loc());
            return;
        }
    }
    
		var file_id = rec.get("pmk");
		var file_type = "." + rec.get("FILE_TYPE");
		var file_name = rec.get("FILE_NAME");
		
		Ext.Ajax.request({
					url : '/usr/cms/netdisk/PanelGridBeforeInit.jcp',
					params : {
						'file_id' : rec.get("pmk")
					},
					method : 'post',
					scope : this,
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						if (result.success) {
							if (result.err) {
								Ext.msg("infos", "物理文件出现问题。请联系管理员");
							} else {
								var path = result.path;
								window.open("/usr/cms/netdisk/downFile.jcp?fileId=" + file_id + "&path="
								+ path + "&file_name=" + file_name+"&file_type="+file_type);
							}
						}
					}
				})

}