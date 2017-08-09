Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.HWMailTestConnect = function(btn, type) {
	
	
	
	
	var panel = Ext.getCmp(btn.panelId);
	
	var adress = panel.form.findField("MAIL_ADRESS").getValue();
	var name = panel.form.findField("MAIL_USER_NAME").getValue();
	var password = panel.form.findField("MAIL_PASSWORD").getValue();
	Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/HWMailTestConnect.jcp',
					method : 'POST',
					params : {'adress':adress,'name':name,'password':password},
					scope : this,
					timeout : 108000,
					success : function(response, options) {
									var check = response.responseText;
									var ajaxResult = Ext.util.JSON
											.decode(check)
									if (ajaxResult.success) {
										Ext.msg("warn", "连接成功")
									} else {
										Ext.msg("error", ajaxResult.message);
									}
					}
				})
}