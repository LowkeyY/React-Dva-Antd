Ext.ns("usr.docManage");
using('lib.SelectMultipleUsers.SelectMultipleUsers');

usr.docManage.DMIssue = function() {
	this.load = function(framePanel, parentPanel, param, prgInfo) {
		var dataId = "";
		var win = parentPanel.findParentByType(Ext.Window);
		if (Ext.isDefined(win.hasPanelDataConfig)) {
			dataId = win.hasPanelDataConfig.dataId;
			if (win.hasPanelDataConfig.exportInfo) {
				var ps = win.hasPanelDataConfig.exportInfo.split(",");
				ps.shift();
				Ext.apply(parentPanel.param, {
							dataId : dataId,
							exportData : dataId,
							exportItem : ps.join(",")
						})
			}
			delete win.hasPanelDataConfig;
		}
		dataId = dataId.length > 0 ? dataId : param.dataId;
		if (dataId.length > 0) {
			var formPanel = new Ext.form.FormPanel({
				border : false,
				labelWidth : 150,
				labelAlign : "center",
				bodyStyle : "padding: 10px",
				mySelfDataId : dataId,
				tbar : prgInfo.buttonArray || null,
				items : [{
							xtype : "checkboxgroup",
							fieldLabel : "分发内容",
							name : "dm_text",
							columns : 3,
							allowBlank : false,
							items : [{
										boxLabel : "发文单",
										inputValue : 1,
										name : "dm_text"
									}, {
										boxLabel : "审批正文(Word)",
										inputValue : 0,
										name : "dm_text",
										checked : true
									}, {
										boxLabel : "附件",
										inputValue : 2,
										name : "dm_text",
										checked : true
									}]
						}, {
							xtype : "SelectMultipleUsers",
							fieldLabel : "选择接收人",
							name : "dm_owner",
							width : 400,
							height : 150,
							allowBlank : false,
							editable : false,
							selectType : 2
						}]
			});
			parentPanel.add(formPanel);
			framePanel.add(parentPanel);
			framePanel.doLayout();
		} else {
			Ext.msg("warn", "参数丢失。");
		}

	}
}