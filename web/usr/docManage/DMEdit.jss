Ext.ns("usr.docManage");
using("usr.docManage.DocManageEditClass");

usr.docManage.DMEdit = function() {
	this.load = function(framePanel, parentPanel, param, prgInfo) {
		var dataId = "";
		var win = parentPanel.findParentByType(Ext.Window);
		if(Ext.isDefined(win.hasPanelDataConfig)){
			dataId = win.hasPanelDataConfig.dataId;
			if (win.hasPanelDataConfig.exportInfo) {
				var ps = win.hasPanelDataConfig.exportInfo.split(",");
				ps.shift();
				Ext.apply(parentPanel.param, {
							dataId : dataId,
							exportData : dataId,
							exportItem : ps.join(",")
						})
			}
			delete win.hasPanelDataConfig;
		}
		dataId = dataId.length>0? dataId:param.dataId;
		if(dataId.length>0){
			
			win.getEl().mask("加载中...");
			
			Ext.Ajax.request({
				url : '/usr/docManage/DMEdit.jcp?pmk='+dataId,
				scope : this,
				method : 'Get',
				success : function(response, options) {
					win.getEl().unmask();
					var result = Ext.decode(response.responseText);
					if (result.success){
						var formPanelId = Ext.id();
						var defaultParam = {
							windowId : win.id,
							formPanelId : formPanelId,
							dataId : dataId,
							buttonArray : prgInfo.buttonArray || {}
						}
						param.formPanelId = formPanelId;
						if(result.frmData)
							defaultParam.frmData = result.frmData;
						
						var DMDC = new usr.docManage.DocManageEditClass(defaultParam);
						if(result.wfconfig)
							parentPanel.wfconfig = result.wfconfig;
							
						parentPanel.add(DMDC.mainPanel);
						framePanel.add(parentPanel);
						framePanel.doLayout();							
					}else{
						Ext.msg("error", CPM.getResponeseErrMsg(response));
					}
				},
				failure : function(response, options) {
					Ext.msg("error", CPM.getResponeseErrMsg(response));
				}
			});
		}else{
			Ext.msg("warn","参数丢失。");
		}
		
	}
}