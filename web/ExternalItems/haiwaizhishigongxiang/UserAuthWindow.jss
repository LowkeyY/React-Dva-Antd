Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.UserAuthWindow = function(btn) {
	var p = Ext.getCmp(btn.panelId);
	var win = p.findParentByType(Ext.Window) , width = 800 , height = 500;
	if(win){
		width = win.width * 0.75;
		height = win.height * 0.65;
	} else if(p.getWidth && p.getHeight) {
		width = p.getWidth() * 0.75;
		height = p.getHeight() * 0.65;						
	};
	CPM.openModuleWindow("666a5681-40e9-401b-9980-e2d17f805bf5", p, null, {//固定ID 模块:海外_空间成员管理
				icon : btn.icon,
				title : btn.text,
				width : width,
				height : height,
				listeners : {
					close : function() {
					}
				}
			});
}
