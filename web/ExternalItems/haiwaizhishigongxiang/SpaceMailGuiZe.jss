Ext.ns("ExternalItems.haiwaizhishigongxiang")

ExternalItems.haiwaizhishigongxiang.SpaceMailGuiZe = function(btn) {
	
	
	
	
	
	var p = Ext.getCmp(btn.panelId);
	var win = p.findParentByType(Ext.Window);
	CPM.removeModel("149171");
	var formId=btn.panelId;

	var pageType="";
	if(btn.text=="新建"){
		pageType="new";
	}else if(btn.text=="修改"){
		pageType="edit";
	}else if(btn.text=="查看"){
		pageType="view";
	}
	
	
	var newp = {pageType : pageType};
	if(btn.text=="修改" || btn.text=="查看"){
		var rec = p.getSelectionModel().getSelections();
		if (rec.length == 0) {
			Ext.msg("warn", "请选择要删除的行.");
			return;
		}
		
		newp.dataId=rec[0].get("pmk");
		newp.exportData=rec[0].get("pmk");
		newp.exportItem="ID";
	}
	
	
	CPM.openModuleWindow("149171", p , newp , {//固定Id
		icon : btn.icon,
		title : btn.text,
		width : 800,
		height :  400,
		listeners : {
			close : function() {
						var p;
						if ((p = Ext.getCmp(formId)) && p.store) {
							p.store.reload();
							delete p.param.popupWindowConfig;
						}

					
			}
		}
	});
}