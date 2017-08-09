Ext.ns("ExternalItems.haiwaizhishigongxiang")
loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");
using("lib.CascadeSelect.CascadeSelect");
using("ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit");
using('ExternalItems.haiwaizhishigongxiang.HWUploadDialogTools')

ExternalItems.haiwaizhishigongxiang.FileAttInputButton = function(btn) {
	
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
								var filed ,  filedDefualtValue = (this.defualtLoadData && this.defualtLoadData.FILE_CLASS) || {text : "综合政务" , value:"7d82b4d1-ad7b-4011-b613-5e5c39b479b9"};
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
					ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit(loadModelConfig , result , params , {});
					var dialog = new HWUploadDialogTools({
								uploadUrl : '/ExternalItems/haiwaizhishigongxiang/HWFileupload.jcp',
								filePostName : 'myUpload',
								flashUrl : '/ExternalItems/swfupload/swfupload.swf',
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
								modal : true
							})
					dialog.show();
				}
			}
		});		
	}
}