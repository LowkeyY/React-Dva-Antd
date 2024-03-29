Ext.namespace("ExternalItems.haiwaizhishigongxiang.preview");
using("ExternalItems.haiwaizhishigongxiang.FilePreview");

ExternalItems.haiwaizhishigongxiang.preview.previewFileContent = function() {
	
	this.load = function(framePanel, parentPanel, param, prgInfo) {
		this.eastHidden = Ext.isDefined(param.rep_hidden) && param.rep_hidden;
		if(Ext.isDefined(param.rep_guestuser))
			this.eastCollapsed = (WorkBench.hb_pfc_r_ec && get_cookie(WorkBench.hb_pfc_r_ec) === "true");
		else 
			this.eastCollapsed = (Ext.isDefined(param.rep_collapsed) && param.rep_collapsed === "true");
		this.iframeUrl = "/ExternalItems/haiwaizhishigongxiang/FilePreview.jcp?";
		this.previewPanel = new Ext.ux.IFrameComponent({
			url : this.iframeUrl + Ext.urlEncode(param)
		});
		
		if(prgInfo.buttonArray){//是否显示资料审核按钮；
			var showShenheBtn = Ext.isDefined(param.exportItem) && Ext.isDefined(param.exportData) && (
				(param.exportItem == "shen_id" && param.exportData == "1") || (param.exportItem == "MY_TYPE" && param.exportData == "9"));
			Ext.each(prgInfo.buttonArray , function(btn){
				if(btn.text == "资料审核")
					btn.hidden = !showShenheBtn;	
			})
		}
		
		this.previewRePanel = new Ext.Panel({
			region : 'center',
			layout : 'fit',
			border : false,
			padding : '10',
			autoScroll : true,
			cls:'preview-re-key',
			html : ''
		});
		
		var mainPanel = new Ext.Panel({
					layout : 'border',
					border : false,
					padding : '0 0 0 0',
					scope : this,
					fileExportParam : param,
					tbar : prgInfo.buttonArray || null,
					items : [{
						region : 'center',
						width : '80%',
						border : false,
						items : this.previewPanel
					},{
						region : 'east',
						width : '20%',
						collapsible : true,
						bodyStyle : 'background-color: white',
						layout : 'border',
						collapsed : this.eastCollapsed,
						hidden : this.eastHidden,
						items : [{
								region : 'north',
								layout : 'fit',
								border : false,
								xtype : 'form',
								height: 25,
								labelWidth : 150,
								labelAlign : "center",
								bodyStyle : "padding: 5px",
								items:[{
						            xtype: 'checkbox',
						            boxLabel : '默认隐藏此页面',
						            checked : this.eastCollapsed,
						            listeners : {
						            	check : function(filed , checked){
						            		var frm = filed.findParentByType("form") , east;
						            		if(frm && (east = frm.ownerCt)){
						            			if(checked)
						            				east.collapse();
						            		}
						            		set_cookie(WorkBench.hb_pfc_r_ec , checked);
						            		Ext.Ajax.request({
												url : '/ExternalItems/haiwaizhishigongxiang/preview/saveRelevantPanelCollapsed.jcp',
												params : {
													'checked' : checked
												},
												method : 'post'
											});
						            	}
						            }
								}]
							}, this.previewRePanel]
					}],
					listeners : {
						afterrender : function(comp){
							this.scope.updateData(this.fileExportParam , comp , true);
						}
					}
				})
		parentPanel.add(mainPanel);
		framePanel.add(parentPanel);
		framePanel.doLayout();
	}
}
ExternalItems.haiwaizhishigongxiang.preview.previewFileContent.prototype = {
	canUpdateDataOnly : function(panel, parentPanel, param) {
		return !this.eastHidden;
	},
	updateData : function(param , panel , notRefreshIframe) {
		if(!notRefreshIframe){
			this.previewPanel.el.dom.src = this.iframeUrl + Ext.urlEncode(param);
		}
		if(param.fileExportData && (win = this.previewPanel.findParentByType(Ext.Window)))
			win.fileExportData = param.fileExportData;
		Ext.Ajax.request({
			url : '/ExternalItems/haiwaizhishigongxiang/preview/htmlFileinfoAndRelevantPanel.jcp',
			params : {
				'text' : param.fileDataName,
				'fileId' : param.fileExportData
			},
			method : 'post',
			scope : this,
			success : function(response, options) {
					var result = Ext.decode(response.responseText) , previewRePanel = this.previewRePanel;
					if(result.success && result.dataHtml && previewRePanel.el && previewRePanel.el.dom){
						var targetPanel = this;
						previewRePanel.update(result.dataHtml , false , function(){
							var targetAs = previewRePanel.getEl().dom.getElementsByTagName("a");
							if(targetAs.length){
								function searchrekeyChick(){
									var fileId , fileinfoname;
									if((fileId = this.getAttribute("file_id")) && (fileinfoname = this.dom.innerText)){
										var rec = new Ext.data.Record({"pmk":fileId , "FILE_INFO_NAME" : fileinfoname , "targetPanel" : targetPanel});
										ExternalItems.haiwaizhishigongxiang.FilePreview(rec , targetPanel , "");
									} else {
										Ext.msg("warn" , "此文件信息不完整，请选择其他文件或者刷新页面重试。");
									}
								};
								for(var i = 0 ; i < targetAs.length ;i++){
/*									var el = Ext.getDom(targetAs[i]);
									el.addEventListener("click", searchrekeyChick);*/
									var fl = Ext.fly(targetAs[i]);
									fl.on("click" , searchrekeyChick);
								}
							}
						});
					}
				}
			});
	}
}