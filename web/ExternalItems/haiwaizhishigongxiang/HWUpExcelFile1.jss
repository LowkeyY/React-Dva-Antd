Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.HWUpExcelFile = function(btn,type) {
	var panel = Ext.getCmp(btn.panelId);
	
	if(btn.target && !btn.target_old){
		var tg = Ext.apply({} , btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};
	if (panel.form.isValid()) {
		CPM.doAction({
					url : '/ExternalItems/haiwaizhishigongxiang/HWUpExcelFile.jcp',
					method : 'POST',
					form:panel.form,
					scope : this,
					timeout:10800000,
					params : panel.param,
					success : function(response, options) {
						var check = response.responseText;
						var ajaxResult = Ext.util.JSON.decode(check);
						if (ajaxResult.err) {
			    			Ext.msg("warn", ajaxResult.message);
							var field;
			    			if(field = panel.form.findField("EXCEL")){
			    				try{
			    					field.el.dom.value = '';
			    				}catch(e){
			    				}
			    			}
						} else {
							Ext.msg("info", ajaxResult.message);
							var win = panel.findParentByType(Ext.Window);
							if(ajaxResult.isAdd)
								Ext.isFunction(win.refreshWest) && win.refreshWest();
							else
								Ext.isFunction(win.refreshCenter) && win.refreshCenter();
							win.close();
						}
					}
				})
	}
}