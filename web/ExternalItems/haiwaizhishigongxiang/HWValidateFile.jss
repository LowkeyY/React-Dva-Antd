Ext.namespace("ExternalItems.haiwaizhishigongxiang");


ExternalItems.haiwaizhishigongxiang.HWValidateFile = function(btn) {
	var panel = Ext.getCmp(btn.panelId);

	var panel = Ext.getCmp(btn.panelId);

	if (btn.target && !btn.target_old) {
		var tg = Ext.apply({}, btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};
	
	function resetExcelField(){
		var field ;
		if (panel && (field = panel.form.findField("EXCEL"))) {
			try {
				field.el.dom.value = '';
				field.fileInput.dom.value = "";
			} catch (e) {
			}
		}
	}
				
	
	if (panel.form.isValid()) {
		panel.form.submit({
			url : '/ExternalItems/haiwaizhishigongxiang/HWValidateFile.jcp',
			method : 'POST',
			form : panel.form,
			scope : this,
			timeout : 10800000,
			params : panel.param,
			success : function(response, action) {
				var isSuccess , message;
				if(action.response && action.response.responseText){
					var result = Ext.decode(action.response.responseText);
					isSuccess = result.success , message = result.message;
				}
				if(message){
					Ext.msg(isSuccess ? "infos" : "warn", message);
				} else{
					Ext.msg("error" , "参数丢失，请刷新页面重试或者联系管理员。");
				}
			},
			failure: function(response, action) {
				var message = "发生未指明错误，请联系管理员。";
				resetExcelField();
				if(action.response && action.response.responseText){
					var result = Ext.decode(action.response.responseText);
					if(result.message)
						message = result.message;
				}
				Ext.msg("warn" , result.message);
			}
		})
	}
}