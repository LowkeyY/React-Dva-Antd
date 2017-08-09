Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.FilePagePreview = function() {
	this.urlMap = {
		1 : '/samples/kantan.jcp',
		2 : '/samples/kaifa.jcp'
	}
}
ExternalItems.haiwaizhishigongxiang.FilePagePreview.prototype = {
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return true;
	},
	updateData : function(param , panel) {
		this.doGetPage(panel.ownerCt.hiddenexportparam);
	},
	load : function(framePanel, parentPanel, param, prgInfo) {
		this.mainPanel = new Ext.Panel({
					layout : 'fit',
					autoScroll : true,
					border : false,
					html : '<p>加载中...<p>'
				});
		this.doGetPage(parentPanel.ownerCt.hiddenexportparam);
		parentPanel.add(this.mainPanel);
		framePanel.add(parentPanel);
		framePanel.doLayout();
	},
	doGetPage : function(urlIndex) {
		var url = this.urlMap[urlIndex];
		if(url)
			Ext.Ajax.request({
						url : url,
						method : 'Get',
						scope : this,
						success : function(response, options) {
							this.mainPanel.update(response.responseText);
						}
					});
		else
			this.mainPanel.update('<p>页面加载失败。<p>');
	}
}