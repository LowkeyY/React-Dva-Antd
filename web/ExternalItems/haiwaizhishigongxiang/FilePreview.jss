Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("ExternalItems.haiwaizhishigongxiang.FilePreviewUnit");
ExternalItems.haiwaizhishigongxiang.FilePreview = function(rec , panel , win) {
	if(!rec || !panel)
		return;
	Ext.Ajax.request({
		url : '/ExternalItems/haiwaizhishigongxiang/PanelGridBeforeInit.jcp',
		params : {
			'file_id' : rec.get("pmk")
		},
		method : 'post',
		scope : this,
		success : function(response, options) {
			var result = Ext.decode(response.responseText);
			//0 跳转至申请，1 跳转至下载 ， 2 跳转至预览 , 3 提示等待审批 4 上次申请被拒，提示是否再次申请
			if (result.success) {
				var path = result.previewPath || "";
				var isLocal = result.isLocal || false;
				var fileType = result.fileType || "";
				switch (result.showType) {
					case 0 :
						CPM.openModuleWindow("2b681a3f-9d25-48a8-aea0-f62fb9d1942a", panel, {pageType : "new"}, {// 固定ID 模块:海外_文件申请使用
							title : "申请使用",
							width : 650,
							height : 300,
							file_name : rec.get("FILE_INFO_NAME"),
							file_id : rec.get("pmk")
						});
						break;
					case 1 :
						var form = document.createElement('form');
						form.target = "InnerFileDownloadFrame";
						form.method = 'POST';
						form.id = Ext.id();
						form.action = '/ExternalItems/haiwaizhishigongxiang/downFile.jcp';
						
						hd = document.createElement('input');
						hd.type = 'hidden';
						hd.name = 'fileId';
						hd.value = rec.get("pmk");

						form.appendChild(hd);
						document.body.appendChild(form);
						
						form.submit({
							success : function(f, a) {
								Ext.Msg.alert('Success', 'It worked');
							},
							failure : function(f, a) {
								Ext.Msg.alert('Warning',a.result.errormsg);
							}
						});
						setTimeout(function() {Ext.removeNode(form);}, 300);
						/*Ext.msg("confirm", "是否下载该文件?",
								function(answer) {
									if (answer == 'yes') {
										var form = document.createElement('form');
										form.target = "InnerFileDownloadFrame";
										form.method = 'POST';
										form.id = Ext.id();
										form.action = '/ExternalItems/haiwaizhishigongxiang/downFile.jcp';
										
										hd = document.createElement('input');
										hd.type = 'hidden';
										hd.name = 'fileId';
										hd.value = rec.get("pmk");

										form.appendChild(hd);
										document.body.appendChild(form);
										
										form.submit({
											success : function(f, a) {
												Ext.Msg.alert('Success', 'It worked');
											},
											failure : function(f, a) {
												Ext.Msg.alert('Warning',a.result.errormsg);
											}
										});
										setTimeout(function() {Ext.removeNode(form);}, 100);
									}
								});*/
						break;
					case 2 :
						var FPU = new ExternalItems.haiwaizhishigongxiang.FilePreviewUnit() , targetPanel = rec.get("targetPanel") || "" , pa = {
							fileDataId : path,
							fileDataName : rec.get("FILE_INFO_NAME"),
							fileExportData : rec.get("pmk"),
							fileIsLocal : isLocal,
							fileDataType : fileType
						};
						if(rec.get('rep_hidden')){
							pa.rep_hidden = true;
						}
						if(Ext.isDefined(result.rep_collapsed)){
							pa.rep_collapsed = result.rep_collapsed;
						}
						if(Ext.isDefined(result.rep_guestuser)){
							pa.rep_guestuser = result.rep_guestuser;
						}
						if(FPU.canView(fileType)){
							FPU.doView(fileType, path , rec.get("FILE_INFO_NAME"),rec.get("pmk"));
						} else if(targetPanel && Ext.isDefined(targetPanel.canUpdateDataOnly) && targetPanel.canUpdateDataOnly()){
							targetPanel.updateData(pa , panel);
						} else {
							var width = 800 , height = 600;
							if(win){
								width = win.width * 0.85;
								height = win.height * 0.85;
							} else {
								width = Ext.lib.Dom.getViewWidth() * 0.95;
								height = Ext.lib.Dom.getViewHeight() * 0.9;				
							}
							
							CPM.openModuleWindow("b1e5686e-6b83-4003-81a7-38f3ca438d14", panel, pa , {// 固定ID
									title : "文件预览",
									width : width,
									height : height,
									refreshPanelId : panel.id || "",
									fileExportData : pa.fileExportData,
									listeners : {
										close : function() {
											Ext.Ajax.request({
												url : '/ExternalItems/haiwaizhishigongxiang/preview/onPreviewWindowClose.jcp?fileId='+this.fileExportData,
												method : 'get'
											});
										}
									}
								});		
						}
						break;
					case 3 :
						Ext.msg("infos" , "使用申请已发送，<br>请耐心等待审批通知。");
						break;
					case 4 :
						Ext.msg("confirm", "您上次申请使用的文档 <br>-- 《"+rec.get("FILE_INFO_NAME")+"》，<br>未获批准，是否再次申请使用?",
							function(answer) {
								if (answer == 'yes') {
									CPM.openModuleWindow("2b681a3f-9d25-48a8-aea0-f62fb9d1942a", panel, {pageType : "new"}, {// 固定ID 模块:海外_文件申请使用
										title : "申请使用",
										width : 650,
										height : 300,
										file_name : rec.get("FILE_INFO_NAME"),
										file_id : rec.get("pmk")
									});
								}});
						break;
					case 5 :
						var message = result.message || "该资料或该资料所属的空间已经被删除，无法查看，请刷新页面重试。";
						Ext.msg("error" , message);
						break;
					case 6: 
						var message = result.message || "该资料属于处室内部共享，请登陆后查看。";
						Ext.msg("warn" , message);
						break;
				}
			}
		}
	});

			
}