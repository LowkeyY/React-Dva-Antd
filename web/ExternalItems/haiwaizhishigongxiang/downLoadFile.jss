Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("ExternalItems.haiwaizhishigongxiang.PluginUitls");
// using("ExternalItems.haiwaizhishigongxiang.PanelGridBeforeInit");
// ExternalItems.haiwaizhishigongxiang.PanelGridBeforeInit(mySelfConfig, json,
// param, parentPanel);
ExternalItems.haiwaizhishigongxiang.downLoadFile = function(btn, type)  {
	var gridPanel = Ext.getCmp(btn.panelId);
	
	var fileId;
	var rec;
	if (type == 'rec') {
		rec = gridPanel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			Ext.msg("warn", "请选择行.");
			return;
		}
		rec = rec[0];
		fileId = rec.get("pmk").split('::')[0];
	} else if (type == 'input') {
		fileId = gridPanel.param.dataId;
	} else {
		fileId = gridPanel.param.fileExportData;
	}
			//var win = gridPanel.findParentByType(Ext.Window);
			Ext.Ajax.request({
				url : '/ExternalItems/haiwaizhishigongxiang/PanelGridBeforeInit.jcp',
				params : {
					'file_id' : fileId
				},
				method : 'post',
				scope : this,
				success : function(response, options) {
					var result = Ext.decode(response.responseText);
					//0 跳转至申请，1 跳转至下载 ， 2 跳转至预览 , 3 提示等待审批 4 上次申请被拒，提示是否再次申请
					if (result.success) {
						var path = result.previewPath || "";
						var isLocal = result.isLocal || false;
						switch (result.showType) {
							case 0 :
								CPM.openModuleWindow("2b681a3f-9d25-48a8-aea0-f62fb9d1942a", gridPanel, {pageType : "new"}, {// 固定ID
									title : "申请使用",
									width : 650,
									height : 300,
									file_name : rec.get("FILE_INFO_NAME"),
									file_id : rec.get("pmk")
								});
								break;
							case 1:
							case 2:
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
								break;
							/*case 1 :
								Ext.msg("confirm", "是否下载该文件?",
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
												setTimeout(function() {Ext.removeNode(form);}, 300);
											}
										});
								break;
							case 2 :
								CPM.openModuleWindow("148878", gridPanel, {
											fileDataId : path,
											fileExportData : rec.get("pmk"),
											fileIsLocal : isLocal
										}, {// 固定ID
											title : "文件预览",
											width : win.width * 0.85 || 800,
											height : win.height * 0.85 || 600,
											listeners : {
												close : function() {
												}
											}
										});
								break;*/
							case 3 :
								Ext.msg("infos" , "使用申请已发送，<br>请耐心等待审批通知。");
								break;
							case 4 :
								Ext.msg("confirm", "您上次申请使用的文档 <br>-- 《"+rec.get("FILE_INFO_NAME")+"》，<br>未获批准，是否再次申请使用?",
									function(answer) {
										if (answer == 'yes') {
											CPM.openModuleWindow("148875", gridPanel, {pageType : "new"}, {// 固定ID
												title : "申请使用",
												width : 650,
												height : 300,
												file_name : rec.get("FILE_INFO_NAME"),
												file_id : rec.get("pmk")
											});
										}});
								break;
						}
					}
				}
			});
		}