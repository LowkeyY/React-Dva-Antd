Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.HWUpExcelFileValidate = function(btn, type) {
	var panel = Ext.getCmp(btn.panelId);

	if (btn.target && !btn.target_old) {
		var tg = Ext.apply({}, btn.target);
		btn.target_old = tg;
		btn.target.type = 0;
	};

	function uuid() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
		// clock_seq_hi_and_reserved
		// to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
	if (panel.form.isValid()) {
		var key = uuid();

		CPM.doAction({
			url : '/ExternalItems/haiwaizhishigongxiang/HWUpExcelFileValidate.jcp?key='
					+ key,
			method : 'POST',
			form : panel.form,
			scope : this,
			timeout : 10800000,
			params : panel.param,
			success : function(response, options) {
				var check = response.responseText;
				var ajaxResult = Ext.util.JSON.decode(check);
				var tihuan;
				if (ajaxResult.sf) {
					var fg = 0;
					Ext.msg("confirm", "发现资料名称重复，是否覆盖。", function(answer) {
								if (answer == 'yes') {
									fg = 1;
								}
							});

					CPM.doAction({
						url : '/ExternalItems/haiwaizhishigongxiang/HWUpExcelFile.jcp?key='
								+ key+'&fg='+fg,
						method : 'POST',
						form : panel.form,
						scope : this,
						timeout : 10800000,
						params : panel.param,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check);
							if (ajaxResult.err) {
								Ext.msg("warn", ajaxResult.message);
								var field;
								if (field = panel.form.findField("EXCEL")) {
									try {
										field.el.dom.value = '';
									} catch (e) {
									}
								}
							} else {
								Ext.msg("info", ajaxResult.message);
								var win = panel.findParentByType(Ext.Window);
								if (ajaxResult.isAdd)
									Ext.isFunction(win.refreshWest)
											&& win.refreshWest();
								else
									Ext.isFunction(win.refreshCenter)
											&& win.refreshCenter();
								win.close();
							}
						}
					});

					var progressBar1 = Ext.Msg.progress("上传中...");

					var dingshi;
					var f = function() {
						return function() {

							Ext.Ajax.request({
								url : '/ExternalItems/haiwaizhishigongxiang/getUpExcealCount.jcp',
								method : 'POST',
								params : {
									key : key
								},
								scope : this,
								success : function(response, options) {
									var check = response.responseText;
									var ajaxResult = Ext.util.JSON
											.decode(check)
									var shengyu = ajaxResult.shengyu;
									var count = ajaxResult.count;
									var statu = ajaxResult.statu;
									if (statu == "1") {
										var v = (count - shengyu);
										var i = v / count;
										progressBar1.updateProgress(i, '共'
														+ count + '个资料文件。进度：'
														+ v + '/' + count);
										if (shengyu == 0) {

											Ext.msg("info", "上传完成。");
											var win = panel
													.findParentByType(Ext.Window);
											win.close();

											progressBar1.hide();

											window.clearInterval(dingshi);
										}
									} else if (statu == "-1") {

										window.clearInterval(dingshi);
									} else if (statu == "2") {
										progressBar1.hide();
										window.clearInterval(dingshi);
									}
								}
							})
						};
					};
					dingshi = setInterval(f(), 500);

				}

			}
		})
	}
}