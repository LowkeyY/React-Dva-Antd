Ext.ns("ExternalItems.haiwaizhishigongxiang");
loadcss("lib.IconPicker.IconPicker");
using("lib.ListValueField.ListValueField");
using("lib.IconPicker.IconPicker");
// using("ExternalItems.haiwaizhishigongxiang.NodeEDITInputBeforeInit");
// ExternalItems.haiwaizhishigongxiang.NodeEDITInputBeforeInit(mySelfConfig, json, param, parentPanel);
ExternalItems.haiwaizhishigongxiang.NodeEDITInputBeforeInit = function(
		mySelfConfig, json, param, parentPanel) {
	mySelfConfig.loadResult = mySelfConfig.loadResult.createInterceptor(
			function(result) {
				var win = this.findParentByType(Ext.Window), defualtDir;
				if(!win)
					win = this.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt;
				if (win && (defualtDir = win.data_exportData)){
					var pId = result.data.P_NODE_ID == defualtDir ? "" : result.data.P_NODE_ID;
					Ext.apply(result.data, {
								DIR_ID : win.data_exportData,
								P_NODE_ID : pId
							});
				}
			});
	// iconpicker

	var fn = function(c) {
		if (c.items) {
			Ext.each(c.items, fn);
		} else {
			if (c.name == 'NODE_VALUE'){
				c.regex = /^((?![\\\/\:\*\?"<>\|]).)*$/;
				c.regexText = '目录名称不能包含以下任意字符:<br>\\ / : * ? " < > |';
			}
			if (c.name == 'NODE_ICON' && !c.xtype == 'hidden') {
				c.oldXtype = c.xtype;
				c.onTransferToView = function(c, param, json){
					c.disabled = param.pageType == 'view';
					return false;
				};
				c.width = 16;
				c.xtype = 'iconpicker';
				c.emptyImage = '/themes/icon/xp/folder.gif';
				c.defaultImage = '/themes/icon/xp/folder.gif';
				c.getValue = function() {
					var v = this.value;
					return (typeof(v) == 'undefined') ? '' : v;
				};
			}
			if(c.name == 'SORT_SEQ'){
				c.readOnly = false;
			}
		}
	}
	Ext.each(json.model, fn);
}
