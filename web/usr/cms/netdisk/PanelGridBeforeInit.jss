Ext.ns("usr.cms.netdisk");
using("usr.cms.netdisk.PluginUitls");
using("usr.cms.netdisk.FilePreview");
// using("usr.cms.netdisk.PanelGridBeforeInit");
// usr.cms.netdisk.PanelGridBeforeInit(mySelfConfig, json,
// param, parentPanel);
usr.cms.netdisk.PanelGridBeforeInit = function(mySelfConfig, json, param, parentPanel) {
	var PUS = new usr.cms.netdisk.PluginUitls();
	PUS.addIcon2GridColumn(mySelfConfig.cm, "FILE_NAME", "FILE_TYPE");
	PUS.bytesToSizeColumn(mySelfConfig.cm, "FILE_SIZE");
	
	mySelfConfig.listeners = {
		rowdblclick : function(gridPanel, rowIndex, e) {
			var rec = gridPanel.getStore().getAt(rowIndex);
			var win = gridPanel.findParentByType(Ext.Window);
			usr.cms.netdisk.FilePreview(rec , gridPanel , win);
		}
	}
}