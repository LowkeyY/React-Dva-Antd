Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.showShenpiyijian = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var rec = panel.getSelectionModel().getSelected();
	if (typeof(rec) == 'undefined') {
		if (panel.getStore().getCount() == 1) {
			rec = panel.getStore().getAt(0);
		} else {
			Ext.msg("warn", '请选择要查看的行.'.loc());
			return;
		}
	}
	var fileId = rec.get("pmk");
	var usr=rec.get("FILE_UPLOADER").value;
	var p = {
		fileId : fileId,
		exportData:panel.param.exportData,
		upusr:usr
	}
	
	var FILE_NAME, APPLY_DATA, AUDIT_DATA, AUDITOR, AUDIT_MSG = "";

	Ext.Ajax.request({
		url : '/ExternalItems/haiwaizhishigongxiang/showshenpiyijian.jcp',
		method : 'POST',
		params : p,
		scope : this,
		success : function(response, options) {
			var check = response.responseText;
			var ajaxResult = Ext.util.JSON.decode(check)
			FILE_NAME = ajaxResult.FILE_NAME;
			APPLY_DATA = ajaxResult.APPLY_DATA;
			AUDIT_DATA = ajaxResult.AUDIT_DATA;
			AUDITOR = ajaxResult.AUDITOR;
			AUDIT_MSG = ajaxResult.AUDIT_MSG;
			var txt = '<html><head><style>.logtable{font-size:12px;}.STYLE1{border-bottom-style:solid ;	border-bottom-width:1px ;}</style></head><body><table width="450" height="200" border="0" class="logtable"> <tr> <td width="76" height="38">'
					+ '<div align="center">文件名称:</div></td><td colspan="3" class="STYLE1">'
					+ FILE_NAME
					+ '</td></tr><tr><td height="38"><div align="center">申请日期:</div></td><td class="STYLE1">'
					+ APPLY_DATA
					+ '</td></tr><tr><td><div align="center">审批日期:</div></td><td class="STYLE1">'
					+ AUDIT_DATA
					+ '</td></tr><tr><td height="38"><div align="center">审批人:</div></td><td td colspan="3" class="STYLE1">'
					+ AUDITOR
					+ '</td></tr><tr><td colspan="4"><textarea name="textarea" style="width:600px;margin:20 5 5 40;padding:4px;height:95px;font-size:12px;" readonly=true>'
					+ AUDIT_MSG + '</textarea></td></tr></table></body></html>';
			var win = new Ext.Window({
						title : '详细信息',
						modal : true,
						constrainHeader : true,
						layout : 'fit',
						height : 320,
						width : 695,
						buttons : [{
									text : '关闭',
									handler : function() {
										win.close();
									}
								}],
						items : {
							layout : 'fit',
							border : false,
							html : txt

						}
					});
			win.show();

		}
	})

}
