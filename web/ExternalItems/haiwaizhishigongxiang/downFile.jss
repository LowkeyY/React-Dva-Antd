Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.downFile = function(btn, type) {
	/*
	 * var type = type; var panel = Ext.getCmp(btn.panelId); var fileId; if
	 * (type == 'rec') { var rec = panel.getSelectionModel().getSelections(); if
	 * (rec.length == 0) { Ext.msg("warn", "请选择要下载的行."); return; } fileId =
	 * rec[0].get("pmk"); } if (type == 'input') { fileId = panel.param.file_id; }
	 * var userid=get_cookie("user_id"); Ext.Ajax.request({ url :
	 * '/ExternalItems/docmgr/downFile.jcp?fileId='+fileId+"&userid="+userid,
	 * method : 'get', scope : this, success : function(response, options) { var
	 * check = response.responseText; var ajaxResult =
	 * Ext.util.JSON.decode(check) if (ajaxResult.success && ajaxResult.message ==
	 * '1') { Ext.msg("warn", "对不起,您没有权限下载此文档，请提交查看申请.如提交申请还不能下载，请等待相关部门审批!"); }
	 * if (ajaxResult.success && ajaxResult.message == '2') { var form =
	 * document.createElement('form'); form.target = "_blank"; form.method =
	 * 'POST'; form.id = Ext.id(); form.action =
	 * '/ExternalItems/docmgr/downFile.jcp'; var hiddens, hd, hd2; hiddens = [];
	 * hd = document.createElement('input'); hd.type = 'hidden'; hd.name =
	 * 'fileId'; hd.value = fileId;
	 * 
	 * hd2 = document.createElement('input'); hd2.type = 'hidden'; hd2.name =
	 * 'userid'; hd2.value =userid;
	 * 
	 * form.appendChild(hd); form.appendChild(hd2); hiddens.push(hd);
	 * hiddens.push(hd2);
	 * 
	 * document.body.appendChild(form); form.submit(); setTimeout(function() {
	 * Ext.removeNode(form); }, 100); } } });
	 */
	var type = type;
	
	var fileId;
	var file_upload;
	var panel = Ext.getCmp(btn.panelId);
	if (type == 'rec') {
		var rec = panel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			Ext.msg("warn", "请选择要下载的行.");
			return;
		}
		fileId = rec[0].get("pmk").split('::')[0];
		file_upload=rec[0].get("FILE_UPLOADER").value;
	} else if (type == 'input') {
		fileId = panel.param.dataId;
	} else {
		fileId = panel.param.fileExportData;
	}
	var userid = get_cookie("user_id");
	var form = document.createElement('form');
	form.target = "_blank";
	form.method = 'POST';
	form.id = Ext.id();
	form.action = '/ExternalItems/haiwaizhishigongxiang/downFile.jcp';
	var hiddens, hd, hd2;
	hiddens = [];
	hd = document.createElement('input');
	hd.type = 'hidden';
	hd.name = 'fileId';
	hd.value = fileId;

	hd2 = document.createElement('input');
	hd2.type = 'hidden';
	hd2.name = 'userid';
	hd2.value = userid;
	
	hd3 = document.createElement('input');
	hd3.type = 'hidden';
	hd3.name = 'file_upload';
	hd3.value = file_upload;

	form.appendChild(hd);
	form.appendChild(hd2);
	form.appendChild(hd3);
	hiddens.push(hd);
	hiddens.push(hd2);
	hiddens.push(hd3);

	document.body.appendChild(form);
	form.submit({
				success : function(f, a) {
					Ext.Msg.alert('Success', 'It worked');
				},
				failure : function(f, a) {
					Ext.Msg.alert('Warning', a.result.errormsg);
				}
			});
	setTimeout(function() {
				Ext.removeNode(form);
			}, 100);
}