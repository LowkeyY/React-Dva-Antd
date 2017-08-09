// using("usr.cms.fuzhigaojianBtn");
// usr.cms.fuzhigaojianBtn(btn);

Ext.ns("usr.cms");
usr.cms.shenhepinglun = function(btn) {
	var text = btn.text;
	var panel = Ext.getCmp(btn.panelId);
	var win = panel.findParentByType(Ext.Window);
	
	var id = panel.form.findField("id").getValue();
	
		
		Ext.Ajax.request({
			url : '/usr/cms/gaojianpinglun.jcp',
			params : {
				pmks : id,
				text : text
			},
			scope : this,
			method : 'Post',
			success : function(response, options) {
				win.getEl().unmask();
				var result = Ext.decode(response.responseText);
				
				if(result.success){
					Ext.msg("info", result.message);
				}else
					Ext.msg("warn", result.message);
			},
			failure : function(response, options) {
				win.getEl().unmask();
				Ext.msg("error", CPM.getResponeseErrMsg(response));
			}
		});
	
}