Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.file_shenheTongGuo = function(btn, type) {
	var panel = Ext.getCmp(btn.panelId);
	if (!btn.targetType_old) {
		btn.targetType_old = btn.target.type;
	}
	btn.target.type = 0;
	if (panel.form.isValid()) {
		Ext.msg("confirm", "确定此文件通过审核?", function(answer) {
					if (answer == 'yes') {
						
						
						
				panel.param['action'] = btn.action;
				if (panel.form.isValid()) {
					var p = Ext.apply({
								_method : (btn.state == 'new') ? 'POST' : 'PUT'
							}, panel.param)
					CPM.doAction({
								form : panel.form,
								params : p,
								method : 'POST',
								success : function(form, action) {
									Ext.msg("info", "保存成功");
									var win = panel.findParentByType(Ext.Window);
									win.close();
								}
							}, this);
				}
			
						
						
						
						//btn.target.type = btn.targetType_old;
						//CPM.getModule("ProgramInput").executeButtonAction("%save", btn.panelId, btn);
//						var win = panel.findParentByType(Ext.Window);
//						win.close();
					}
				})
	}
}