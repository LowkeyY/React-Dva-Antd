// using("usr.cms.cmsInputDefineViewBtn");
// usr.cms.cmsInputDefineViewBtn(btn);

Ext.ns("usr.cms");
usr.cms.cmsInputDefineViewBtn = function(btn) {

	var panel = Ext.getCmp(btn.panelId);
	
	var id = panel.form.findField("id").getValue();
	var mingcheng = panel.form.findField("mingcheng");
	var fromNode = "gaojian", progressText = "";
	
	//站点或栏目时，取名称。稿件时，取标题。
	if (mingcheng != null && mingcheng.getValue() != "") {
		fromNode = "zhandian";
		progressText = mingcheng.getValue();
	} else {
		progressText = panel.form.findField("biaoti").getValue();
	}
	//只有栏目有muban属性。
	var muban = panel.form.findField("muban");
	if (muban != null) {
		fromNode = "lanmu";
		if (muban.getValue() == "") {
			Ext.msg("warn", "栏目模板为空，无法预览。");
			return;
		}
	}
	//需要审批才能发布的稿件没有归档属性。
	var guidang = panel.form.findField("guidang");
	if(guidang == null){
		fromNode = "tempgaojian";
	}
	
	var previewPage = function() {
		
		var deferHandel = panel.el.mask
					.defer(500, panel.el, ["请稍候....."]);
		Ext.Ajax.request({
			url : '/usr/cms/previewPage.jcp',
			params : {
				pmk : id,
				fromNode : fromNode
			},
			scope : this,
			method : 'Post',
			success : function(response, options) {
				clearTimeout(deferHandel);
				panel.el.unmask();
				var result = Ext.decode(response.responseText);
				if (result.success) {
					var uuid = result.uuid;
					var pbar = Ext.Msg.progress("预览页面", "页面生成中...",
							progressText);
					var count = 0;

					var fn = function() {
						Ext.Ajax.request({
							url : '/usr/cms/uploadProgress.jcp',
							params : {
								uuid : uuid
							},
							scope : this,
							method : 'Post',
							success : function(response, options) {
								var result = Ext.decode(response.responseText);
								if (result.message != ""
										&& result.message != null) {
									clearInterval(interval);
									pbar.updateProgress(1);
									pbar.hide();
									if (result.message.indexOf("success::") != -1) {
										if(nw)
											nw.location.replace(result.message.split("::")[1]);
										else
											window.open(result.message.split("::")[1],"_blank");
										Ext.msg("info", "预览页面生成完毕，请在弹出窗口中查看。");
									} else {
										if(nw)
											nw.close();
										Ext.msg("error", "预览页面生成失败。原因 ： "+ '<br>'+ result.message);
									}
								} else {
									pbar.updateProgress(count);
									count += 0.1;
									if (count > 1)
										count = 0
								}
							}
						}, this);
					}

					var interval = setInterval(fn.createDelegate(this), 300);
				} else {
					if(nw)
						nw.close();
					Ext.msg("warn", result.message);
				}
			},
			failure : function(response, options) {
				if(nw)
					nw.close();
				clearTimeout(deferHandel);
				panel.el.unmask();
				Ext.msg("error", CPM.getResponeseErrMsg(response));
			}
		});
	}
	if (btn.state == 'view') {
		var nw = window.open("/usr/cms/watting.html");
		previewPage();
	} else {
		btn.target.type = 0;
		panel.param['action'] = btn.action;
		if (panel.form.isValid()) {
			var deferHandel = panel.el.mask
					.defer(500, panel.el, ["数据保存中....."]);
			var p = Ext.apply({
						_method : (btn.state == 'new') ? 'POST' : 'PUT'
					}, panel.param)
			CPM.doAction({
						form : panel.form,
						params : p,
						method : 'POST',
						timeout : 900000,
						success : function(form, action) {
							clearTimeout(deferHandel);
							panel.el.unmask();

							if (action.result && action.result.dataId) {
								var ps = action.result.exportInfo.split(",");
								Ext.apply(panel.param, {
											dataId : action.result.dataId,
											pTab : ps.shift(),
											pItem : ps.join(","),
											pData : action.result.dataId
										})
							}
							if (btn.target.targets) {
								btn.target.type = 2;
								CPM.replaceTarget(panel, panel.ownerCt,
										panel.param, btn.target);
							}
							if(id=="")
								id = action.result.dataId;
							previewPage.createDelegate(this).defer(1);
						},
						failure : function() {
							clearTimeout(deferHandel);
							panel.el.unmask();
						}
					}, this);
		}
	}

}