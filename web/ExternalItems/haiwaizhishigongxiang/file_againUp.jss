Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.file_againUp = function(btn,type) {
	var panel = Ext.getCmp(btn.panelId);
	if(btn.target && !btn.target_old){
		var tg = Ext.apply({} , btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};
	if (panel.form.isValid()) {
		var p = {
			type:type,
			fileid : panel.param.dataId
		}
		Ext.msg("confirm", "确定再次上传此文件?", function(answer) {
							if (answer == 'yes') {
		Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/file_againUp.jcp',
					method : 'POST',
					params : p,
					scope : this,
					callback : function(options, success, response) {
						var check = response.responseText;
									var ajaxResult = Ext.util.JSON.decode(check)
									if (ajaxResult.success) {
						    			Ext.msg("info", '上传成功！')
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