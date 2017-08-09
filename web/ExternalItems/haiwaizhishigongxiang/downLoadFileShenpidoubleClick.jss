Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("ExternalItems.haiwaizhishigongxiang.PluginUitls");
// using("ExternalItems.haiwaizhishigongxiang.PanelGridBeforeInit");
// ExternalItems.haiwaizhishigongxiang.PanelGridBeforeInit(mySelfConfig, json,
// param, parentPanel);
ExternalItems.haiwaizhishigongxiang.downLoadFileShenpidoubleClick = function(rec , gridPanel , win) {
	var id = rec.get("pmk");

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

			Ext.Ajax.request({
				url : '/ExternalItems/haiwaizhishigongxiang/PanelGridBeforeInit.jcp',
				params : {
					'file_id' : fileId
				},
				method : 'post',
				scope : this,
				success : function(response, options) {
					var result = Ext.decode(response.responseText);
					// 0 跳转至申请，1 跳转至下载 ， 2 跳转至预览
					if (result.success) {
						var path = result.previewPath || "";
						switch (result.showType) {
							case 0 :
								CPM.openModuleWindow("2b681a3f-9d25-48a8-aea0-f62fb9d1942a", gridPanel, {
											pageType : "new"
										}, {// 固定ID
											title : "申请使用",
											width : 650,
											height : 300,
											file_name : rec[0].get("FILE_NAME"),
											file_id : fileId
										});
								break;
							case 1 :
								Ext.msg("confirm", "是否下载该文件?",
										function(answer) {
											if (answer == 'yes') {
												var form = document
														.createElement('form');
												form.target = "InnerFileDownloadFrame";
												form.method = 'POST';
												form.id = Ext.id();
												form.action = '/ExternalItems/haiwaizhishigongxiang/downFile.jcp';

												hd = document
														.createElement('input');
												hd.type = 'hidden';
												hd.name = 'fileId';
												hd.value = fileId

												form.appendChild(hd);
												document.body.appendChild(form);

												form.submit({
													success : function(f, a) {
														Ext.Msg.alert(
																'Success',
																'It worked');
													},
													failure : function(f, a) {
														Ext.Msg
																.alert(
																		'Warning',
																		a.result.errormsg);
													}
												});
												setTimeout(function() {
															Ext
																	.removeNode(form);
														}, 100);
											}
										});
								break;
							case 2 :
								CPM.openModuleWindow("b1e5686e-6b83-4003-81a7-38f3ca438d14", gridPanel, {
											fileDataId : path,
											fileExportData : fileId
										}, {// 固定ID
											title : "文件预览",
											width :  800,
											height :  600,
											listeners : {
												close : function() {
												}
											}
										});
								break;
						}
					}
				}
			});

		}

	});

}