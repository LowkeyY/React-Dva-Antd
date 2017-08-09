Ext.ns("usr.docManage");
using("usr.docManage.DocManageEditClass");

usr.docManage.DocManageSaveAndNext = function() {
	this.load = function(framePanel, parentPanel, param, prgInfo) {
		var win = parentPanel.findParentByType(Ext.Window);
		if(!Ext.isDefined(win.WorkflowInputConfig)){
			var mainPanel = new Ext.Panel({
								html : "参数缺失。"
							})
			parentPanel.add(mainPanel);
			framePanel.add(parentPanel);
			framePanel.doLayout();
		}else{
			win.getEl().mask("加载中...");
			Ext.Ajax.request({
				url : '/usr/docManage/DocManageSaveAndNext.jcp',
				params : Ext.apply({
						ACT : win.WorkflowInputConfig.ACT,
						theOperatorComment : win.WorkflowInputConfig.EData.theOperatorComment ||""
						},win.WorkflowInputConfig.wfconfig),
				scope : this,
				method : 'GET',
				success : function(response, options) {
					win.getEl().unmask();
					var result = Ext.decode(response.responseText);
					if (result.success) {
						var mainPanel = new Ext.FormPanel({
									autoScroll : true,
									tbar : prgInfo.buttonArray || null,
									wfconfig : result.wfconfig || null,
									bodyStyle : 'padding:15px',
									items : [{
											xtype : 'fieldset',
											items : [{
														columnWidth : 1,
														layout : 'form',
														border : false,
														items : result.datas.items
													}]
										}]
								})
					}else{
						var mainPanel = new Ext.FormPanel({
									autoScroll : true,
									bodyStyle : 'padding:15px',
									items : [{
											xtype : 'fieldset',
											items : [new Ext.Panel({
														border : false,
														html : result.message
													})]
										}]
								})
					}
					parentPanel.add(mainPanel);
					framePanel.add(parentPanel);
					framePanel.doLayout();
				},
				failure : function(response, options) {
					win.getEl().unmask();
					var mainPanel = new Ext.Panel({
								html : response.responseText
							})
					parentPanel.add(mainPanel);
					framePanel.add(parentPanel);
					framePanel.doLayout();
				}
			});		
		}
	}
}