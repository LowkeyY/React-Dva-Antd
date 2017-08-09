Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");

ExternalItems.haiwaizhishigongxiang.spacePage.gcsgxzltj = function() {
	this.id = "ExternalItems.haiwaizhishigongxiang.spacePage.gcsgxzltj";
	this.init();
}
ExternalItems.haiwaizhishigongxiang.spacePage.gcsgxzltj.prototype = {
	chart : new AnyChart('/lib/chart/AnyChart.swf') ,
	init : function(){
		
		var tools = [];
		tools.push({
			id:'refresh',
			handler: function(e, target, panel){
				panel.scope.refresh();
			}
		});
		this.mainPanel =  new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet({
			id : this.id,
			title : "办公厅目录资料统计",
			height : 610,
			iconCls: "iportal-icon-chart",
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
		var chart = this.chart , mainPanel = this.mainPanel , data = this.data;
		
			if(!mainPanel.el || !mainPanel.el.dom)
				return;
			Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/spacePage/gcsgxzltj.jcp',
					method : 'POST',
					scope : this,
					callback : function(options, success, response) {
						var check = response.responseText;
									var ajaxResult = Ext.util.JSON.decode(check)
									if (ajaxResult.success) {
										var data=ajaxResult.data;
										
						    			chart.width = mainPanel.getWidth();
										chart.height = mainPanel.getHeight() * 0.9;	
										chart.write(mainPanel.body.dom);											
										chart.setData(data);
									}
					}
				})
			
		
	}
}