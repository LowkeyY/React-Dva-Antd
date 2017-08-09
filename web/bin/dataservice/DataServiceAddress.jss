Ext.namespace("bin.dataservice");

bin.dataservice.DataServiceAddress = Ext.extend(WorkBench.baseNode, {
	main : function(launcher) {
		var panel = new Ext.grid.PropertyGrid({
					autoHeight : true,
					cm : [{
								herder : '数据名称'.loc()
							}, {
								herder : '数据地址'.loc()
							}],
					source : {},
					tbar : [{
						text : '保存'.loc(),
						icon : '/themes/icon/xp/save.gif',
						cls : 'x-btn-text-icon  bmenu',
						scope : this,
						handler : function() {
							this.request("POST", {
										source : Ext.encode(panel.getSource())
									}, function(result) {
										if (result.success) {
											Ext.msg("info", '保存成功'.loc());
										} else {
											Ext.msg("info", '保存失败,'.loc()
															+ result.message);
										}
									});
						}
					}]
				});

		this.request("GET", {}, function(result) {
					if (result.success) {
						panel.setSource(result.source);
					} else {
						Ext.msg("error", result.message, {
									fn : (function(win) {
										win.close();
									}).createCallback(this.frames.win)
								});
					}
				});
		return panel;
	},
	request : function(method, params, successFn) {
		Ext.Ajax.request({
					url : '/bin/dataservice/DataServiceAddress.jcp',
					method : method,
					params : params,
					scope : this,
					callback : function(options, success, response) {
						if (success) {
							successFn(Ext.decode(response.responseText));
						} else {
							Ext.msg("error", '获取数据错误.'.loc()
											+ CPM.getResponeseErrMsg(response));
							return;
						}
					}
				});
	}
});