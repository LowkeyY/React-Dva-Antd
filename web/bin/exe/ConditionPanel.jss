Ext.namespace("bin.exe");
using("lib.jsvm.MenuTree");
bin.exe.ConditionPanel = function(panel, params) {
	this.objectId = params['parent_id']
	this.panel = panel;
	this.favoritePanel= new Ext.Panel({
		title : '收藏'.loc(),
		border : false,
		icon : '/themes/icon/xp/new_driver.gif'
	});  

	this.searchPanle= new Ext.Panel({
		title : '查询'.loc(),
		border : false,
		icon : '/themes/icon/xp/alias.gif'
	});

	CPM.get({
		method : 'GET',
		url : '/bin/exe/getCondition.jcp?parent_id=' + this.objectId,
		scope : this,
		success : function(response, options) {
			var json = Ext.decode(response.responseText);
			this.panel.nav = this;
		}
	}, true);
};

bin.exe.ConditionPanel.prototype = {
	init : function(){
		alert(1);
	}
}
