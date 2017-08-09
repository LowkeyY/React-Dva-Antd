Ext.ns("usr.docManage");

usr.docManage.DMDefineBtnEmbed = function(btn) {

	var panel = Ext.getCmp(btn.panelId);
	var isMustHasComment = true;
	
	switch(btn.text){
		case "添加附件" : 
			btn.target.type = 1;
			btn.disable();
			panel.param.popupWindowConfig = {
				title : btn.text,
				modal : true,
				width : panel.getEl().getWidth() / 2 || 500,
				height : panel.getEl().getHeight() / 2 || 245,
				fromPanelConfig : {
					btnId : btn.id,
					formPanelId : panel.param.formPanelId
				},
				listeners : {
					"close" : function(me) {
						if (Ext.isDefined(me.fromPanelConfig)) {
							var b = Ext.getCmp(me.fromPanelConfig.btnId);
							if (Ext.isDefined(b) && b.disabled)
								b.enable();
						}
					}
				}
			}
			break;
		case "转下一步" : 
			var frm = Ext.getCmp(panel.param.formPanelId);
			if(Ext.isDefined(btn.target)){
					btn.target_old = Ext.apply({},btn.target);
					delete btn.target;
			}
			if(frm.form.isValid()){
				btn.disable();
				var eData = {
					exportData : panel.param.dataId || panel.param.exportData || "",
					exportItem : panel.param.pItem || "GWXH",
					exportTab : panel.param.pTab || "f9201a37-aaf4-4e75-8c3a-19412c552e4c",
					_webOfficeDditTagert : frm.webOfficeDditTagert,
					isFormCommit : true
				},exportDatas = {},ngr="";
				for(var att in frm.form.getValues()){
					if(att.toUpperCase()=="SQLY"){
						var value = frm.form.getValues()[att];
						eData["theOperatorComment"] = value;
						exportDatas[att.substring(att.lastIndexOf("_")+1).toUpperCase()] = value;
					}else if(/^dm_/.test(att)){
						exportDatas[att.substring(att.lastIndexOf("_")+1).toUpperCase()] = frm.form.getValues()[att];
					}else if(/_ngr$/.test(att)){
						ngr = ngr == "" ? frm.form.getValues()[att] : ngr;
					}else{
						exportDatas[att] = frm.form.getValues()[att];
					}
				}
				eData["exportDatas"] = exportDatas;
				if(Ext.isDefined(btn.target_old)){
					btn.target = Ext.apply({},btn.target_old);
					delete btn.target_old;
				}
				panel.param.popupWindowConfig = {
					title : btn.text,
					modal : true,
					width : panel.getEl().getWidth() / 1.5 || 650,
					height : panel.getEl().getHeight() / 2 || 245,
					fromPanelConfig : {
						btnId : btn.id,
						panelId : panel.id
					},
					WorkflowInputConfig : {
						ACT : "转下一步",
						EData : eData,
						wfconfig : panel.wfconfig
					},
					listeners : {
						"close" : function(me) {
							if (Ext.isDefined(me.fromPanelConfig)) {
								var b = Ext.getCmp(me.fromPanelConfig.btnId);
								if (Ext.isDefined(b) && b.disabled)
									b.enable();
								if(Ext.isDefined(me.fromPanelConfig.hasTarget)){
									var p = Ext.getCmp(me.fromPanelConfig.panelId);
									CPM.replaceTarget( p, p.ownerCt, p.param,me.fromPanelConfig.hasTarget );
									delete me.fromPanelConfig.hasTarget;
								}
							}
						}
					}
				}
			}else{
				var isContinue = true;
				frm.form.items.each(function(f) {
							if (isContinue && !f.validate()) {
								f.focus();
								isContinue = false;
							}
						});
			}
			break;
		case "同意" :
		case "保留意见" :
			isMustHasComment = false;
		case "不同意" :
		case "退回" :
			var frm = Ext.getCmp(panel.param.formPanelId);
			
			btn.disable();
			var eData = {
					exportData : panel.param.dataId || panel.param.exportData || "",
					exportItem : panel.param.pItem || "GWXH",
					//exportTab : panel.param.pTab || "f9201a37-aaf4-4e75-8c3a-19412c552e4c",
					exportTab : panel.param.pTab || "f9201a37-aaf4-4e75-8c3a-19412c552e4c",
					_webOfficeDditTagert : frm.webOfficeDditTagert
			};
			for(var att in frm.form.getValues()){
				if(att == "theOperatorComment")
					eData[att] = frm.form.getValues()[att];
			}
			panel.param.popupWindowConfig = {
					title : btn.text,
					modal : true,
					width : panel.getEl().getWidth() / 1.5 || 650,
					height : panel.getEl().getHeight() / 2 || 245,
					fromPanelConfig : {
						btnId : btn.id,
						panelId : panel.id
					},
					WorkflowInputConfig : {
						ACT : btn.text,
						EData : eData,
						wfconfig : Ext.apply({mustComment:isMustHasComment},panel.wfconfig)
					},
					listeners : {
						"close" : function(me) {
							if (Ext.isDefined(me.fromPanelConfig)) {
								var b = Ext.getCmp(me.fromPanelConfig.btnId);
								if (Ext.isDefined(b) && b.disabled)
									b.enable();
								if(Ext.isDefined(me.fromPanelConfig.hasTarget)){
									var p = Ext.getCmp(me.fromPanelConfig.panelId);
									CPM.replaceTarget( p, p.ownerCt, p.param,me.fromPanelConfig.hasTarget );
									delete me.fromPanelConfig.hasTarget;
								}
							}
						}
					}
				}
			break;
		case "流程图" :
			Workflow = {};
			var loadWorkflow = function() {
				using("bin.workflow.StatusPanel");
				Workflow.statusPanel = new bin.workflow.StatusPanel(panel.wfconfig);
				if(Workflow.statusPanel.MainTabPanel){
					var wfsm = Workflow.statusPanel.MainTabPanel;
					wfsm.getComponent(0).getTopToolbar().hide();
				}
				var win = new Ext.Window({
					title :"流程图",
					width : panel.getEl().getWidth() || 1000,
					height : panel.getEl().getHeight() || 800,
					modal : true,
					items : Workflow.statusPanel.MainTabPanel
				})
				win.show();
				Workflow.statusPanel.init();
				
			}.createDelegate(this);
			if (Ext.isIE) {
				useJS(	["/dev/workflow/mxclient-ie.js",
								"/dev/workflow/mxApplication.js"],
						loadWorkflow);
			} else {
				useJS(	["/dev/workflow/mxclient-ff.js",
								"/dev/workflow/mxApplication.js"],
						loadWorkflow);
			}
			break;
		case "流程步骤" :
			using("usr.docManage.DMStepPanel");
			var stepWindow=new usr.docManage.DMStepPanel({
				params:panel.wfconfig
			});
			stepWindow.show();
			break;
		case "确定分发" :
			if(Ext.isDefined(btn.target)){
					btn.target_old = Ext.apply({},btn.target);
					delete btn.target;
			}
			var frm = panel.getComponent(0);
			if(frm.form.isValid()){
				var win = panel.findParentByType(Ext.Window);
				var values = frm.form.getValues();
				for(var att in values){
					var xtype = frm.form.findField(att).xtype || "";
					if(xtype == "SelectMultipleUsers"){
						values[att] = frm.form.findField(att).theCheckNonesAttributesId || values[att];
					}else if(xtype == "checkboxgroup"){
						values[att] = Ext.isArray(values[att]) ? values[att].join(","):values[att];
					}
				}
				values = Ext.apply({
					dataId : frm.mySelfDataId || panel.param.dataId
				},values);
				btn.disable();
				Ext.Ajax.request({
					url : '/usr/docManage/DMIssue.jcp',
					scope : this,
					method : 'Post',
					params : values,
					success : function(response, options) {
						btn.enable();
						var result = Ext.decode(response.responseText);
						if (result.success) {
							win.close();
							Ext.msg("info", result.message);
						} else {
							Ext.msg("error", result.message);
						}
					},
					failure : function(response, options) {
						btn.enable();
						Ext.msg("error", CPM.getResponeseErrMsg(response));
					}
				})
			}
			break;
	}
}