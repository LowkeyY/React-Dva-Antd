Ext.namespace("ExternalItems.haiwaizhishigongxiang");
//using("ExternalItems.haiwaizhishigongxiang.HWUpExcelFile");
//ExternalItems.haiwaizhishigongxiang.HWUpExcelFile(btn);

ExternalItems.haiwaizhishigongxiang.HWBUEFile = function(btn) {
	var panel = Ext.getCmp(btn.panelId);

	if (btn.target && !btn.target_old) {
		var tg = Ext.apply({}, btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};
	
	function resetExcelField(){
		var field ;
		if (panel && (field = panel.form.findField("EXCEL"))) {
			try {
				field.el.dom.value = '';
				field.fileInput.dom.value = "";
			} catch (e) {
			}
		}
	}
				
	
	function upload(key , rowCount , isCover , isCommit , isCreateDir){
		resetExcelField();
		var win = panel.findParentByType(Ext.Window), dingshi , progressBar;
		var fn = function() {
			return function() {
				Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/HWBUEFileStatus.jcp',
					method : 'POST',
					params : {
						key : key
					},
					scope : this,
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						if(result.success){
							var status = result.status , currentRow = result.currentRow , message = result.message;
							if (status === 0) {
								progressBar.updateProgress(currentRow / rowCount , '正在操作 ：' + currentRow + '/' + rowCount , message);
							} else if (status === 10) {
								clearInterval(dingshi);
								Ext.msg("infos", "上传时，发生错误。<br>" + message + "<br>此次操作共上传" + currentRow +"个文件，请刷新页面查看。");
							} else if (status === 99) {
								clearInterval(dingshi);
								var isRefreshWest = (message === "west");
								var isRefreshCenter = (message === "center");
								Ext.msg("infos", "上传完成。<br>此次操作共上传" + currentRow +"个文件 。");
								if(win){
									isRefreshWest && Ext.isFunction(win.refreshWest) && win.refreshWest();
									isRefreshCenter && Ext.isFunction(win.refreshCenter) && win.refreshCenter();
									win.close();
								}	
							}
						}else{
							clearInterval(dingshi);
							Ext.msg("error" , result.message);
						}
					}
				});		
			}
		};
		Ext.Ajax.request({
			url : '/ExternalItems/haiwaizhishigongxiang/HWBUEFile.jcp',
			params : {
				'lastKey' : key,
				'isCover' : isCover,
				'isCommit' : isCommit
			},
			method : 'post',
			scope : this,
			success : function(response, options) {
				var result = Ext.decode(response.responseText);
				if(result.success){
					progressBar = Ext.Msg.progress("上传中..." , "共"+rowCount+"个文件。" , "准备上传。");
					dingshi = setInterval(fn(), 500);
				}else{
					Ext.msg(result.types || "warn" , result.message);
				}
			},
			failure: function(response, opts) {
				var result = Ext.decode(response.responseText);
				Ext.msg("error" , result.message || "发生未指明错误，请联系管理员。");
			}
		});
	}
	
	if (panel.form.isValid()) {
		panel.form.submit({
			url : '/ExternalItems/haiwaizhishigongxiang/HWBUEFile.jcp',
			method : 'POST',
			form : panel.form,
			scope : this,
			timeout : 10800000,
			params : panel.param,
			success : function(response, action) {
				var key , rowCount , message , warnMsg , isCover = false , isCommit = false , isCreateDir = false;
				if(action.response && action.response.responseText){
					var result = Ext.decode(action.response.responseText);
					key = result.lastKey , message = result.message , warnMsg = result.warnMsg , rowCount = result.rowCount , isCreateDir = result.createDir;
				}
				if(key && Ext.isDefined(rowCount)){
					function doUpload(){
						if(message)
						Ext.msg("confirm", message , function(answer) {
								if (answer == 'yes')
									isCommit = true;
								upload(key , rowCount , isCover , isCommit , isCreateDir);
							});
						else
							Ext.msg("error" , "参数丢失，请刷新页面重试或者联系管理员");
					}
					if(warnMsg)
						Ext.msg("confirm", warnMsg , function(answer) {
								if (answer == 'yes')
									isCover = true;
								doUpload();
							});
					else
						doUpload();
				} else{
					Ext.msg("error" , "参数丢失，请刷新页面重试或者联系管理员");
				}
			},
			failure: function(response, action) {
				var message = "发生未指明错误，请联系管理员。";
				resetExcelField();
				if(action.response && action.response.responseText){
					var result = Ext.decode(action.response.responseText);
					if(result.message)
						message = result.message;
				}
				Ext.msg("warn" , result.message);
			}
		})
	}
}