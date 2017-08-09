Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");

ExternalItems.haiwaizhishigongxiang.spacePage.pluginsDownloadNew = function() {
	this.id = "ExternalItems.haiwaizhishigongxiang.spacePage.pluginsDownloadNew";
	this.init();
}
ExternalItems.haiwaizhishigongxiang.spacePage.pluginsDownloadNew.prototype = {
	template : new Ext.XTemplate(
			'<div style="width : 100%;height:265px; overflow:auto">{data}'
					+ '	</div>'
	),
	init : function(){
		var tools = [];
		tools.push({
			id:'refresh',
			handler: function(e, target, panel){
				panel.scope.refresh();
			}
		});
		this.mainPanel =  new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet({
			id: this.id,
			title : "新近下载资料",
			height : 300 ,
			iconCls: "iportal-icon-download",
			scope : this,
			tools : tools,
			listeners : {
				afterrender : function(comp){
					comp.scope.refresh();
				}
			}
		});
	},
	refresh : function(){
		this.mainPanel.body.mask("数据加载中，请稍后...");
		
			if(!this.mainPanel.el || !this.mainPanel.el.dom)
				return;
			
			var data;
			Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/spacePage/getDownloadNew.jcp',
					method : 'POST',
					scope : this,
					callback : function(options, success, response) {
						var check = response.responseText;
									var ajaxResult = Ext.util.JSON.decode(check)
									if (ajaxResult.success) {
						    			data=ajaxResult.data;
						    			this.template.overwrite(this.mainPanel.body, data);
									}
					}
				})
		
	}
}