// using("usr.cms.tongyibingfabuBtn");
// usr.cms.tongyibingfabuBtn(btn);

Ext.ns("usr.cms");
usr.cms.tongyibingfabuBtn = function(btn) {

	var panel = Ext.getCmp(btn.panelId);
	
	var id = panel.form.findField("id").getValue();
	var progressText = panel.form.findField("biaoti").getValue();
	var previewPage = function() {
		var deferHandel = panel.el.mask.defer(500, panel.el, ["请稍候....."]);
		Ext.Ajax.request({
			url : '/usr/cms/fabuhuoguidang.jcp',
			params : {
				pmk : id,
				type : "fabu",
				fromNode : "tempgaojian"
			},
			scope : this,
			method : 'Post',
			timeout : 1800000,
			success : function(response, options) {
				clearTimeout(deferHandel);
				panel.el.unmask();
				var result = Ext.decode(response.responseText);
				if (result.success) {
					if(!Ext.isDefined(result.uuid) && Ext.isDefined(result.msg)){
						Ext.msg("info", result.msg);
						return;
					}
					var uuid = result.uuid;
					var pbar = Ext.Msg.progress("发布页面", "页面发布中...",
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
									if (result.message == "success") {
										if (btn.target.targets) {
											btn.target.type = 2;
											CPM.replaceTarget(panel, panel.ownerCt,
													panel.param, btn.target);
										}
										Ext.msg("info", "发布页面。");
									} else {
										Ext.msg("error", "发布失败。原因 ： "+ '<br>'+ result.message);
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
					Ext.msg("warn", result.message);
				}
			},
			failure : function(response, options) {
				clearTimeout(deferHandel);
				panel.el.unmask();
				Ext.msg("error", CPM.getResponeseErrMsg(response));
			}
		});
	}

	btn.target.type = 0;
	panel.param['action'] = btn.action;
	if (panel.form.isValid()) {
		var deferHandel = panel.el.mask.defer(500, panel.el, ["数据保存中....."]);
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
						
						previewPage.createDelegate(this).defer(1);
					},
					failure : function() {
						clearTimeout(deferHandel);
						panel.el.unmask();
					}
				}, this);
	}

}