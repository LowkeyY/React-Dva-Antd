Ext.ns("usr.cms.netdisk")

usr.cms.netdisk.FilePushOrMove = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var rec = panel.getSelectionModel().getSelections();
		if (rec.length == 0) {
			if (panel.getStore().getCount() == 1) {
				rec = [panel.getStore().getAt(0)];
			} else {
				Ext.msg("warn", '请选择需要操作的文件.'.loc());
				return;
			}
	}
	var pmks = new Array();
	for (var i = 0; i < rec.length; i++) {
		pmks.push(rec[i].get("pmk"));
	}
	var win = panel.findParentByType(Ext.Window);
	CPM.openModuleWindow("69068", panel, {pageType:"new"}, {// 固定ID 模块:海外_推送或移动
		icon : btn.icon,
		title : btn.text,
		pmks : pmks.join(','),
		panelId : btn.panelId,
		panelDataId : panel.param.dataId,
		width : 450,
		height : 300,
		getTreePanel : function(){
			var p , fp , fi ,t ;
			if (p = Ext.getCmp(this.panelId)) {
				var fp = p , counts = 0;
				while(fp && !fp.isFrame){
					fp = fp.ownerCt;
					if(++counts > 30)
						break;
				}
				if(fp && (fi = fp.frameIndex) && fi.west && (t = Ext.getCmp(fi.west))){
					if((t = t.getComponent(0)) && t.nav){
						return t;
					}
				}
				return false;
			}
		},
		refreshSelfNode : function(){
			var t , nav ;
			if((t = this.getTreePanel()) && (nav = t.nav))
				nav.getTree().loadSelfNodeWithLevel(this.panelDataId, nav.clickEvent.createDelegate(nav));
		}
	});
}