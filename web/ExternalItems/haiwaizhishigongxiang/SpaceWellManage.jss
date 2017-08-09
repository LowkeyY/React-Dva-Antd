Ext.ns("ExternalItems.haiwaizhishigongxiang")

ExternalItems.haiwaizhishigongxiang.SpaceWellManage = function(btn) {
	var p = Ext.getCmp(btn.panelId);
	var win = p.findParentByType(Ext.Window);
	CPM.removeModel("149115");
	CPM.openModuleWindow("149112", p, {pageType:"listinput"}, {// 固定ID
		icon : btn.icon,
		title : btn.text,
		width : win.width * 0.75 || 800,
		height : win.height * 0.65 || 600,
		listeners : {
			close : function() {
			}
		}
	});
}