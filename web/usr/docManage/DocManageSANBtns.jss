Ext.ns("usr.docManage");

usr.docManage.DocManageSANBtns = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	switch(btn.text){
		case "确定" :
			var frm = panel.findByType("form")[0];
			if(Ext.isDefined(btn.target)){
				btn.target_old = Ext.apply({},btn.target);
				delete btn.target;
			}
			if (frm.form.isValid()) {
				var win = panel.findParentByType(Ext.Window);
				if(Ext.isDefined(win.WorkflowInputConfig) && Ext.isDefined(frm.wfconfig)){
					btn.disable();
					var EData = win.WorkflowInputConfig.EData;
					if(Ext.isDefined(EData.isFormCommit)){
						delete EData.isFormCommit;
						EData.exportDatas["ZHT"] = "审批中";
						EData.exportDatas["GZLBSX"] = frm.wfconfig.entryId;
						EData["ACT"] = win.WorkflowInputConfig.ACT;
					}else{
						EData = Ext.apply(EData,{
							exportDatas :{}
						});
					}
					EData.exportDatas["DQCZZ"] = frm.form.findField("theNextOperator").getValue();
					EData["comment"] = frm.form.findField("theOperatorComment").getValue();
					if(Ext.isDefined(EData.exportDatas["SQLY"])){
						EData.exportDatas["SQLY"] = EData["comment"];
					}
					EData["exportDatas"] = Ext.encode(EData.exportDatas);
					EData = Ext.apply(EData,frm.wfconfig);
					Ext.Ajax.request({
						url : '/usr/docManage/DMEdit.jcp',
						scope : this,
						method : 'Post',
						params : EData,
						success : function(response, options) {
							btn.enable();
							var result = Ext.decode(response.responseText);
							if (result.success) {
								if (Ext.isDefined(EData._webOfficeDditTagert) && EData._webOfficeDditTagert.length > 0 && Ext.getDom(EData._webOfficeDditTagert) != null) {
									usr.docManage.WO4WF.save("/sample/getODContent.jcp?ids=" + result.updateId);
									usr.docManage.WO4WF.close();
									Ext.getDom(EData._webOfficeDditTagert).rid = "";
									Ext.getDom(EData._webOfficeDditTagert).id = "";
								}
								win.fromPanelConfig.hasTarget = Ext.apply({},btn.target_old);
								win.close();
								Ext.msg("info", "已提交，并转至审批流程。");
							} else {
								Ext.msg("error", result.message);
							}
						},
						failure : function(response, options) {
							btn.enable();
							Ext.msg("error", CPM.getResponeseErrMsg(response));
						}
					})
				}else{
					Ext.msg("error","参数丢失。");
				}
			}
			break;
	}
}