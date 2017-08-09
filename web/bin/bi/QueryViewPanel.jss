Ext.namespace("bin.bi");

bin.bi.QueryViewPanel = function(showTopToolbar, parentPanel) {
	this.xg = Ext.grid;
	this.MainTabPanel = new bin.bi.QueryGridPanel({
				border : false,
				autoSave : true,
				ppanel : parentPanel,
				loadMask : {
					msg : '数据载入中...'.loc()
				},
				saveUrl : '/bin/bi/saveconfig.jcp',
				trackMouseOver : true,
				displayInfo : true,
				layout : 'fit',
				tbar : {
					xtype : 'toolbar',
					enableOverflow : true,
					items : []
				},
				eds : [],
				showTopToolbar : showTopToolbar,
				pageSize : 40,
				displayMsg : '{0}-{1}条 共:{2}条'.loc(),
				emptyMsg : '没有数据'.loc(),
				url : '/bin/bi/queryview.jcp',
				method : 'GET'
			});
};
bin.bi.QueryViewPanel.prototype = {
	init : function(params) {
		this.params = params;
		this.MainTabPanel.baseParams = params;
		this.MainTabPanel.store.baseParams = params;
		this.MainTabPanel.store.load({
					params : {
						meta : true,
						start : 0,
						limit : 40
					}
				});
		this.MainTabPanel.store.on('load', function() {
			this.getTopToolbar().items.each(function(item) {
				if (item.action == '%favorite'
						|| item.action == '%cancelfavorite') {
					item.hide();
				}
				if ((item.action == '%favorite' && params['isfavorite'] == 'false')
						|| (item.action == '%cancelfavorite' && params['isfavorite'] == 'true')) {
					item.show();
				}
			});
			if (this.baseParams.query) {
				for (var i = 0; i < this.eds.length; i++) {
					var queryObj = Ext.decode(this.baseParams.query);
					for (var j in queryObj) {
						if (this.eds[i].xtitleList == j) {
							this.eds[i].setValue(queryObj[j]);
						}
					}
				}
			}
		}, this.MainTabPanel)
	}
}
