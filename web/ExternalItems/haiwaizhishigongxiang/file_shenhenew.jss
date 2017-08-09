Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.file_shenhenew = function(btn,type) {
	var panel = Ext.getCmp(btn.panelId);
	var filed = panel.form.findField("AUDIT_MSG") || panel.form.findField("audit_msg");
	filed.allowBlank = type === 'n' ? false : filed.allowBlank;
	if(btn.target && !btn.target_old){
		var tg = Ext.apply({} , btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};
	if (panel.form.isValid()) {
		var p = {
			type:type,
			fileid : panel.param.dataId,
			yijian : filed.getValue()
		}
		Ext.msg("confirm", "确定此文件不通过审核?", function(answer) {
							if (answer == 'yes') {
		Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/file_shenhenew.jcp',
					method : 'POST',
					params : p,
					scope : this,
					callback : function(options, success, response) {
						var check = response.responseText;
									var ajaxResult = Ext.util.JSON.decode(check)
									if (ajaxResult.success) {
						    			Ext.msg("info", '审核完成！')
						    			var win = panel.findParentByType(Ext.Window);
										win.close();
									} else {
										Ext.msg("warn", ajaxResult.message);
									}
					}
				})
							}})
	}
}