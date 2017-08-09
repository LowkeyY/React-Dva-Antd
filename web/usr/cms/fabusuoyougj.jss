Ext.ns("usr.cms");
usr.cms.fabusuoyougj = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var id = panel.form.findField("id").getValue();
	var win = panel.findParentByType(Ext.Window);
	win.getEl().mask("请稍候...");
	Ext.Ajax.request({
		url : '/usr/cms/fabusuoyougj.jcp',
		params : {
			id : id,
			type : 'fabu'
		},
		scope : this,
		method : 'Post',
		timeout : 18000000,
		success : function(response, options) {
			win.getEl().unmask();
			var result = Ext.decode(response.responseText);
			if (result.success) {
				var uuid = result.uuid;
				var pbar = Ext.Msg.progress("正在发布", "发布中...", "" );
				var count = 0;

				var fn = function() {
					Ext.Ajax.request({
						url : '/usr/cms/uploadProgress.jcp',
						params : {
							uuid : uuid
						},
						scope : this,
						method : 'Post',
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.message != "" && result.message != null) {
								clearInterval(interval);
								pbar.updateProgress(1);
								pbar.hide();
								if (result.message == "success") {
									Ext.msg("info", "成功。");
								} else {
									Ext.msg("error", "失败。原因 ： " + '<br>' + result.message);
								}
							} else {
								pbar.updateProgress(count);
								count += 0.1;
								if (count > 1)
									count = 0
							}
						}
					}, this);
				}

				var interval = setInterval(fn.createDelegate(this), 300);
			} else {
				Ext.msg("warn", result.message);
			}
		},
		failure : function() {
			win.getEl().unmask();
			Ext.msg("warn", "失败。");
		}
	}, this);
}