Ext.ns("usr.cms.weixin");
using("usr.cms.weixin.editPWeixinNavMenu");

usr.cms.weixin.editWeixinMenu = function() {
}
usr.cms.weixin.editWeixinMenu.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		this.markWindow = parentPanel.findParentByType(Ext.Window);
		this.markWindow.body.mask("正在加载，请稍后...");
		Ext.Ajax.request({
			url : '/usr/cms/weixin/querycaidanjson.jcp?dataId=' + param.dataId,
			method : 'get',
			scope : this,
			success : function(response, options) {
				this.markWindow.body.unmask();
				var result = Ext.decode(response.responseText);
				if (result.success) {
					var items = result.data.button;

					var win = parentPanel.findParentByType(Ext.Window);
					win.setTitle("微信菜单导航");
					win.scope = {
						param : {
							dataId : param.dataId
						}
					};

					this.mainPanel = new Ext.Panel(usr.cms.weixin
							.editPWeixinNavMenu(items, win, win, [3, 5]));

					parentPanel.add(this.mainPanel);
					parentPanel.doLayout();
				} else {
					Ext.msg("error", result.message);
				}
			}
		});

	}
}