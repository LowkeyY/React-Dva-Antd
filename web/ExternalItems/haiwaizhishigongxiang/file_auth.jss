Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.file_auth = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	
	
	var mess=panel.form.findField("APPLY_REASON").getValue();
	var file_id=panel.form.findField("FILE_ID").value;
	var file_name=panel.form.findField("FILE_NAME").value;
	var p = panel.param;
	var win = panel.findParentByType(Ext.Window);
	Ext.msg("confirm", "确定申请此文件?", function(answer) {
				if (answer == 'yes') {
					
					Ext.Ajax.request({
								url : '/ExternalItems/haiwaizhishigongxiang/send.jcp',
								params : {
									'file_id' : file_id,
									'mess':mess,
									'filename':file_name
								},
								method : 'post',
								scope : this,
								success : function(response, options) {
									win.close();
									var check = response.responseText;
									var ajaxResult = Ext.util.JSON.decode(check)
									if (ajaxResult.success) {
										Ext.msg("infos", ajaxResult.message);
									} else {
										Ext.msg("warn", ajaxResult.message);
									}
								}
							});
					/*
					 * using("ExternalItems.publicMail.SendMail"); var
					 * panel = Ext.getCmp(btn.panelId); var pdpanel = new
					 * ExternalItems.publicMail.SendMail(pmks.join(","));
					 * pdpanel.init();
					 */
				}
			});

}