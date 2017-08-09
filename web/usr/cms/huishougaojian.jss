Ext.ns("usr.cms");
usr.cms.huishougaojian = function(btn) {
	if (Ext.isDefined(btn.target)) {
		btn.target_old = Ext.apply({}, btn.target);
		delete btn.target;
	}
	var panel = Ext.getCmp(btn.panelId);
	var win = panel.findParentByType(Ext.Window);
	var rec = panel.getSelectionModel().getSelected();
	if (typeof(rec) == "undefined") {
		if (panel.getStore().getCount() == 1) {
			rec = panel.getStore().getAt(0);
		} else {
			btn.target.type = 0;
			Ext.msg("warn", "请选择要操作的行.".loc());
			return;
		}
	}

	rec = (panel.getStore().getCount() == 1 ? rec : panel.getSelectionModel().getSelections());
	var guidang = "true";
	var pmks = new Array();
	if (Ext.isArray(rec)) {
		for (var i = 0; i < rec.length; i++) {
			pmks.push(rec[i].get("pmk"));
			if (rec[i].get("guidang") == "false") {
				win.getEl().unmask();
				Ext.msg("warn", "当前稿件为发布状态，请先归档。".loc());
				return;
			}
			if (rec[i].get("dingshi") == "true") {
				win.getEl().unmask();
				Ext.msg("warn", "当前稿件有定时任务，请先取消。".loc());
				return;
			}
		}
	} else
		pmks.push(rec.get("pmk"));
	if(btn.text = "彻底删除"){
		CPM.getModule("ProgramList").executeButtonAction("%delete", btn.panelId, btn);
	}else if(btn.text = "删除"){
		Ext.Ajax.request({
				url : "/usr/cms/huishougaojian.jcp",
				params : {
					id : pmks
				},
				method : "Post",
				success : function(response, options) {
					win.getEl().unmask();
					var result = Ext.decode(response.responseText);
					if (btn.target_old.targets) {
						CPM.replaceTarget(panel, panel.ownerCt, panel.param,
								btn.target_old);
					}
					if (result.success) {
						Ext.msg("info", result.message);
					} else {
						Ext.msg("warn", result.message);
					}
				},
				failure : function(response, options) {
					win.getEl().unmask();
					Ext.msg("error", CPM.getResponeseErrMsg(response));
				}
			});
	}
};
