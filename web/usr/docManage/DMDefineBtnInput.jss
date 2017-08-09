Ext.ns("usr.docManage");

usr.docManage.DMDefineBtnInput = function(btn) {
	
	var panel = Ext.getCmp(btn.panelId);
	
	switch(btn.text){
		case "上传" :
			if (panel.form.isValid()) {
				if (Ext.isDefined(panel.param.exportData) && Ext.isDefined(panel.param.exportItem)) {
					panel.form.findField(panel.param.exportItem).setValue(panel.param.exportData);
					panel.param['action'] = "%save";
					var p = Ext.apply({
								_method : (btn.state == 'new') ? 'POST' : 'PUT'
							}, panel.param)
					var win = panel.findParentByType(Ext.Window);
					win.getEl().mask("请稍等...");
					CPM.doAction({
								form : panel.form,
								params : p,
								method : 'POST',
								success : function(form, action) {
									var result = Ext.decode(form.responseText);
									var callFn = function(){
										Ext.Ajax.request({
											url : "/usr/docManage/DMAttach.jcp?pmk="+result.dataId,
											method : 'Get',
											scope : this,
											success : function(response, options) {
												var result = Ext.decode(response.responseText);
												win.getEl().unmask();
												Ext.msg("info", '上传成功'.loc());
												if(Ext.isDefined(win.fromPanelConfig.formPanelId)){
													var f = Ext.getCmp(win.fromPanelConfig.formPanelId);
													f.addAttach(result.data,true);
													win.close();
												}
											}
										});
									}
									if(result.success){
										callFn.createDelegate(this).defer(10);
									}
								}
							}, this);
				}
			} else {
				Ext.msg("warn", "保存前必须选择一个附件。");
			}
			break;
		case "确认发起" :
			var win = panel.findParentByType(Ext.Window);
			if(Ext.isDefined(btn.target)){
					btn.target_old = Ext.apply({},btn.target);
					delete btn.target;
			}
			if (panel.form.isValid()){
				panel.param['action'] = "%save";
				var p = Ext.apply({
							_method : (btn.state == 'new') ? 'POST' : 'PUT'
						}, panel.param)
				win.getEl().mask("请稍候...");
				if(Ext.isDefined(btn.target_old)){
						btn.target = Ext.apply({},btn.target_old);
						delete btn.target_old;
				}
				if(Ext.isDefined(btn.target)){
					var tg = Ext.apply({},btn.target);
					delete btn.target;
				}
				CPM.doAction({
							form : panel.form,
							params : p,
							method : 'POST',
							success : function(form, action) {
								win.getEl().unmask();
								Ext.msg("info", '操作成功'.loc());
								var result = Ext.decode(form.responseText);
								if(result.success){
									win.fromPanelConfig.hasTarget = Ext.apply({},tg,{
										"dataId" : result.dataId,
										"exportInfo" : result.exportInfo
									});
									win.close();
								}
							}
						}, this);			
			}
			break;
	}
}