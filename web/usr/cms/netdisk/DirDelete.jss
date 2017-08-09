Ext.ns("usr.cms.netdisk");

usr.cms.netdisk.DirDelete = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	if (!btn.targetType_old) {
		btn.targetType_old = btn.target.type;
	}
	btn.target.type = 0;
	Ext.msg("confirm", "是否删除该目录及下所有文件?", function(answer) {
				if (answer == 'yes') {
					var dir_id = panel.param.dataId;

					Ext.Ajax.request({
								url : '/usr/cms/netdisk/DirDelete.jcp',
								params : {
									'dir_id' : dir_id
								},
								method : 'post',
								scope : this,
								success : function(response, options) {
									var result = Ext
											.decode(response.responseText);
									if (result.success) {

										if (result.err) {
											Ext.msg("infos", "此目录不属于你无法删除。");
										} else {
											Ext.msg("infos", "已删除");
											if (btn.target) {
												btn.target.type = btn.targetType_old;
												CPM
														.replaceTarget(panel,
																panel.ownerCt,
																panel.param,
																btn.target);
											}
										}
									}
								}
							})
				}
			})
}