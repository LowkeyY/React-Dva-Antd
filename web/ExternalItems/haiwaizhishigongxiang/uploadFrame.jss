Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("ExternalItems.haiwaizhishigongxiang.FileAttInputButtonDanDu");

ExternalItems.haiwaizhishigongxiang.uploadFrame = function(){
	this.init = function(launcher , parentPanel) {
		var objectId = launcher.parent_id;
		var width = 800 , height = 600 ;
		if(parentPanel){
			var win = parentPanel.findParentByType(Ext.Window);
			if(win){
				width = win.width * 0.75;
				height = win.height * 0.75;
			} else if(parentPanel.getWidth && parentPanel.getHeight) {
				width = parentPanel.getWidth() * 0.75;
				height = parentPanel.getHeight() * 0.75;					
			};
		}
		//固定ID文件上传id
		var params= Ext.apply({objectId : "5dac118a-03c4-4975-bfa5-05d135683e39" , pageType :"new" , programType : "ProgramInput",btnPanelId: "ext-gen165"});
		
		ExternalItems.haiwaizhishigongxiang.FileAttInputButtonDanDu(params);
//		CPM.openModuleWindow(objectId, {} , null, {//固定ID 模块:海外_空间成员管理
//					title : launcher.text,
//					width : width,
//					height : height,
//					listeners : {
//						close : function() {
//						}
//					}
//				});
	}
};
