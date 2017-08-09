Ext.ns("usr.cms.netdisk")
loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");
using("lib.CascadeSelect.CascadeSelect");
using('usr.cms.netdisk.HWUploadDialogTools')

usr.cms.netdisk.FileAttInputButton = function(btn) {
	if(btn.target.targets && btn.target.targets.length){
		var panel = Ext.getCmp(btn.panelId);
		Ext.apply(btn.target , {type : 0});
		var tg = btn.target.targets[0];
		delete tg.frame;
		var params = Ext.apply({btnPanelId : btn.panelId} , {objectId : tg.id , pageType : tg.order , programType : tg.programType},panel.param);
		params.DataPartMode = "model&data";
		Ext.Ajax.request({
			url : CPM.action,
			method : 'GET',
			params : params,
			success : function(response, options) {
				if (response.responseText) {
					var result = Ext.decode(response.responseText);
					var loadModelConfig = {
						listeners : {
							afterrender : function(comp){
								if(this.defualtLoadData){
									for(var att in this.columnBeforeRelations)
										this.formatDataValue(this.defualtLoadData, att);
								}
								var filed ,  filedDefualtValue = (this.defualtLoadData && this.defualtLoadData.FILE_CLASS) || {text : "专业资料类" , value:"8afaecca-5413e2e5-0154-1411033e-001c"};
								if(filed = this.form.findField("FILE_CLASS")){
									filed.setValue(filedDefualtValue);
									this.changeFiledVisible(filedDefualtValue.value);
								}
							},
							afterlayout : function(){
								if(this.defualtLoadData)
									this.form.setValues(this.defualtLoadData);
							}
						}
					};
					var dialog = new HWUploadDialogTools({
								uploadUrl : '/usr/cms/netdisk/HWFileupload.jcp',
								filePostName : 'myUpload',
								flashUrl : '/usr/cms/netdisk/swfupload/swfupload.swf',
								fileSize : '1000 MB',
								btn : btn,
								post_params:{
									userId : 0
								},
								fileTypes : '*.*',
								fileTypesDescription : '所有文件',
								scope : this,
								loadModels : result.model,
								loadModelConfig : loadModelConfig,
								paramModels : params,
								modal : true,
								formId : btn.panelId
							})
					dialog.show();
				}
			}
		});		
	}
}