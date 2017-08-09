Ext.ns("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.PanelGridBeforeInitGeRenKongJian = function(mySelfConfig, json, param, parentPanel) {
	var key = mySelfConfig.id, gridP;
	mySelfConfig.store.on("load", function(mySelf, records, options) {
		if (gridP = Ext.getCmp(key)) {
		gridP.notSaveColumModel = true;
		var columnModel=mySelfConfig.cm;
		
		if(this.baseParams.exportData=="4"|| this.baseParams.exportData=="5" || this.baseParams.exportData=="6"){
			alert(this.baseParams.exportData);
			//columnModel.config[4].header="审批日期";
			mySelfConfig.cm.setColumnHeader(4,"审批日期");
		}else{
			//columnModel.config[4].header="入库日期";
			mySelfConfig.cm.setColumnHeader(4,"入库日期");
		}
		gridP.notSaveColumModel = false;
	}
	});
}