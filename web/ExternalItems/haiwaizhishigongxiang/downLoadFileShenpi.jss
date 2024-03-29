Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("ExternalItems.haiwaizhishigongxiang.PluginUitls");
using("ExternalItems.haiwaizhishigongxiang.FilePreview");
ExternalItems.haiwaizhishigongxiang.downLoadFileShenpi = function(btn, type) {
	var panel = Ext.getCmp(btn.panelId);
	var id;
	var infoname;
	var rec;
	if (type == 'rec') {
		rec = panel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			Ext.msg("warn", "请选择行.");
			return;
		}
		id = rec[0].get("pmk");
		infoname=rec[0].get("FILE_NAME");
	} else if (type == 'input') {
		id = panel.param.dataId;
	} else {
		id = panel.param.fileExportData;
	}
	var win = panel.findParentByType(Ext.Window);
	
	
	
	
	Ext.Ajax.request({
		url : '/ExternalItems/haiwaizhishigongxiang/PanelGridBeforeInitShenPi.jcp',
		params : {
			'file_id' : id
		},
		method : 'post',
		scope : this,
		success : function(response, options) {
			var result = Ext.decode(response.responseText);
			var fileId = result.result;
			
			
			var newrec = new Ext.data.Record({
						FILE_INFO_NAME : infoname,
						pmk : fileId,
						rep_hidden : true
			});
			ExternalItems.haiwaizhishigongxiang.FilePreview(newrec , {});
			
		}

	});

}