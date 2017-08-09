Ext.ns("usr.cms.netdisk");
using("usr.cms.netdisk.FilePreviewUnit");

usr.cms.netdisk.FilePreview = function(rec, panel, win) {
	if (!rec || !panel || !win)
		return;

	var file_id = rec.get("pmk");
	var file_type = "." + rec.get("FILE_TYPE");
	var file_name = rec.get("FILE_NAME");

	Ext.Ajax.request({
		url : '/usr/cms/netdisk/PanelGridBeforeInit.jcp',
		params : {
			'file_id' : rec.get("pmk")
		},
		method : 'post',
		scope : this,
		success : function(response, options) {
			var result = Ext.decode(response.responseText);
			// 0 跳转至申请，1 跳转至下载 ， 2 跳转至预览 , 3 提示等待审批 4 上次申请被拒，提示是否再次申请
			if (result.success) {
				if (result.err) {
					Ext.msg("infos", "物理文件出现问题。请联系管理员");
				} else {
					var path=result.path;
					
					if (file_type
							.match(/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$|\.mp3$|\.mp4$/i)) {
						var FPU = new usr.cms.netdisk.FilePreviewUnit();
						FPU.doView(file_type, path, rec.get("FILE_NAME"), rec
										.get("pmk"));

					} else if (file_type.match(/\.pdf$|\.flv$/i)) {
						CPM.openModuleWindow("ff07855f-2003-46ed-b39e-d7442c9a1bd9", panel, {
									fileDataId : path,
									fileDataName : rec.get("FILE_NAME"),
									fileExportData : rec.get("pmk"),
									fileDataType : file_type
								}, {// 固定ID
									title : "文件预览",
									width : win.width * 0.85 || 800,
									height : win.height * 0.85 || 600,
									listeners : {
										close : function() {
										}
									}
								});
					} else {
						Ext.msg("confirm", "是否下载该文件?", function(answer) {
							if (answer == 'yes') {
								var form = document.createElement('form');
								form.target = "InnerFileDownloadFrame";
								form.method = 'POST';
								form.id = Ext.id();
								form.action = '/usr/cms/netdisk/downFile.jcp';

								hd = document.createElement('input');
								hd.type = 'hidden';
								hd.name = 'fileId';
								hd.value = rec.get("pmk");

								hd2 = document.createElement('input');
								hd2.type = 'hidden';
								hd2.name = 'file_name';
								hd2.value = file_name;
								
								hd3 = document.createElement('input');
								hd3.type = 'hidden';
								hd3.name = 'path';
								hd3.value = path;
								
								hd3 = document.createElement('input');
								hd3.type = 'hidden';
								hd3.name = 'file_type';
								hd3.value = file_type;
								
								form.appendChild(hd);
								form.appendChild(hd2);
								form.appendChild(hd3);
								document.body.appendChild(form);

								form.submit({
											success : function(f, a) {
												Ext.Msg.alert('Success',
														'It worked');
											},
											failure : function(f, a) {
												Ext.Msg.alert('Warning',
														a.result.errormsg);
											}
										});
								setTimeout(function() {
											Ext.removeNode(form);
										}, 300);
							}
						});
					}
				}
			}
		}
	})
}