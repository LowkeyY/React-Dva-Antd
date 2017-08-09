Ext.namespace("ExternalItems.haiwaizhishigongxiang");
// using("ExternalItems.docmgr.GJModule.listBeforeinit");
// ExternalItems.docmgr.GJModule.listBeforeinit(mySelfConfig, json, param, parentPanel);

ExternalItems.haiwaizhishigongxiang.listBeforeinit = function(mySelfConfig, json, param, parentPanel) {
	var key = mySelfConfig.id, gridP;
	mySelfConfig.store.on("load", function(mySelf, records, options) {
		if (gridP = Ext.getCmp(key)) {
			gridP.notSaveColumModel = true;
			var hiddenCol = this.baseParams.exportItem === "MY_TYPE"
					&& (this.baseParams.exportData === "8"), 
			hiddenCol2= this.baseParams.exportItem === "MY_TYPE"
					&& (this.baseParams.exportData === "7"),cm = gridP.getColumnModel();
						for (var i = 1; i < cm.getColumnCount(); i++) {
							
							if(hiddenCol){	
								gridP.notSaveColumModel = true;
								switch(i)
								{
								case 4:
								  cm.config[i].header_old = cm.config[i].header_old || cm.config[i].header;
								  cm.setColumnHeader(i,"审批日期");
								break;
								case 5:
								  cm.setHidden(i,true);
								  break;
								case 8:
								  cm.config[i].header_old = cm.config[i].header_old || cm.config[i].header;
								  cm.setColumnHeader(i,"审批状态");
								  cm.setHidden(i,false);
								  break;
								case 6:
								  cm.config[i].header_old = cm.config[i].header_old || cm.config[i].header;
								  cm.setColumnHeader(i,"申请人");
								  cm.setHidden(i,false);

								  break;
								 case 7:
								  cm.setHidden(i,true);
								  break;
								  default:
								   cm.setHidden(i,false);
									if(cm.config[i].header_old){
									cm.setColumnHeader(i ,cm.config[i].header_old);
									cm.config[i].header_old=null;
									}
								}
								
								if(i>8){
								cm.setHidden(i,true);
								}
								
								
							}else if(hiddenCol2){
								
								gridP.notSaveColumModel = true;
								  switch(i)
								{
								case 8:
								  cm.config[i].header_old = cm.config[i].header_old || cm.config[i].header;
								  cm.setColumnHeader(i,"审核状态");
								  cm.setHidden(i,false);
								  break;
								 case 4:
								  cm.config[i].header_old = cm.config[i].header_old || cm.config[i].header;
								  cm.setColumnHeader(i,"审核日期");
								  cm.setHidden(i,false);
								  break;
								  default:
								   cm.setHidden(i,false);
									if(cm.config[i].header_old){
									cm.setColumnHeader(i ,cm.config[i].header_old);
									cm.config[i].header_old=null;
									}
								}
							}else{
								   cm.setHidden(i,false);
								if(cm.config[i].header_old){
									cm.setColumnHeader(i ,cm.config[i].header_old);
									cm.config[i].header_old=null;
								}
								if(i==8){
									cm.setHidden(i,true);
								}
								gridP.notSaveColumModel = false;
							}
						}
			
		}
	});
}