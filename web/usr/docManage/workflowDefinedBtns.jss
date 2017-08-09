Ext.ns("usr.docManage");
using('lib.SelectMultipleUsers.SelectMultipleUsers');

usr.docManage.workflowDefinedBtns = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	switch (btn.text) {
		case "不同意" :
			if (Ext.isDefined(btn.isNotNullField)) {
				var fd = panel.form.findField(btn.isNotNullField);
				if (fd.getValue() != "") {
					btn.action = "%save";
					panel.param['action'] = btn.action;
					var finishFn = function() {
						if (panel.form.isValid()) {
							var p = Ext.apply({_method : (btn.state == 'new')
												? 'POST'
												: 'PUT'
									}, panel.param)
							CPM.doAction({
								form : panel.form,
								params : p,
								method : 'POST',
								success : function(form, action) {
									Ext.msg("info", '保存成功'.loc());
									if (action.result && action.result.dataId) {
										panel.param.dataId = action.result.dataId;
										panel.param.exportTab = action.result.exportTab;
										panel.param.exportItem = action.result.exportItem;
										panel.param.exportData = action.result.exportData;
									}
									if (btn.target.targets) {
										CPM.replaceTarget(panel, panel.ownerCt,
												panel.param, btn.target);
									} else {
										var cachePanel = panel
												.findParentByType(lib.CachedPanel.CachedPanel);
										if (cachePanel
												&& typeof(cachePanel.returnFn) == 'function') {
											cachePanel.returnFn();
											delete cachePanel.returnFn;
										}
									}
								}
							}, this);
						}
					}
					CPM.getModule(panel.programType).authit(btn, finishFn);
				} else {
					fd.allowBlank = false;
					panel.form.isValid();
					Ext.msg("warn", "请您填写理由。");
				}
			}
			break;
		case "转发" :
			if(panel.form.isValid()){
				btn.disable();
				var win = new Ext.Window({
							title : btn.text,
							width : 500,
							height : 400,
							autoScroll : true,
							modal : true,
							parentBtn : btn,
							parentPanel : panel,
							layout : 'fit',
							items : [new Ext.form.FormPanel({
										border : false,
										labelWidth : 150,
										labelAlign : "top",
										bodyStyle : "padding: 10px",
										items : [{
													xtype : "SelectMultipleUsers",
													fieldLabel : "选择接收人",
													name : "owners",
													width : 400,
													height : 150,
													allowBlank : false,
													editable : false,
													selectType : 2
												}]
									})],
							shadow : false,
							frame : true,
							buttons : [{
										text : '确定'.loc(),
										handler : function() {
											var frm = win.getComponent(0);
											if (frm.form.isValid()) {
												var nBtn = win.parentBtn;
												var nPanel = win.parentPanel;
												var types = nBtn.wf_action_types || 0;
												var owners = frm.getComponent(0).theCheckNonesAttributesId || "";
												var sureBtn = this;
												frm.getEl().mask("转发中...");
												var callFn = function(){
													var pa = Ext.apply(nPanel.param, {
																			"owners" : owners,
																			"types" : types
																		})
													Ext.Ajax.request({
														url : '/usr/docManage/workflowDefinedBtns.jcp',
														scope : this,
														method : 'Post',
														params : pa,
														success : function( response, options) {
															frm.getEl().unmask();
															sureBtn.enable();
															var result = Ext.decode(response.responseText);
															if(types == 1){
																var cachePanel = nPanel.findParentByType(lib.CachedPanel.CachedPanel);
																if (cachePanel && typeof(cachePanel.returnFn) == 'function') {
																	cachePanel.returnFn();
																	delete cachePanel.returnFn;
																}
															}
															if (result.success) {
																win.close();
																Ext.msg("info",result.message);
															} else {
																Ext.msg("error",result.message);
															}
														},
														failure : function( response, options) {
															frm.getEl().unmask();
															sureBtn.enable();
															Ext .msg("error",CPM.getResponeseErrMsg(response));
														}
													});
												}
												if(types == 0){
													
													nBtn.action = "%save";
													nPanel.param['action'] = nBtn.action;
													
													var finishFn = function() {
														if (nPanel.form.isValid()) {
															var p = Ext.apply({_method : (nBtn.state == 'new') ? 'POST' : 'PUT'
																	}, nPanel.param)
															CPM.doAction({
																form : nPanel.form,
																params : p,
																method : 'POST',
																success : function(form, action) {
																	Ext.msg("info", '保存成功'.loc());
																	if (action.result && action.result.dataId) {
																		nPanel.param.dataId = action.result.dataId;
																		nPanel.param.exportTab = action.result.exportTab;
																		nPanel.param.exportItem = action.result.exportItem;
																		nPanel.param.exportData = action.result.exportData;
																	}
																	if (nBtn.target.targets) {
																		CPM.replaceTarget(
																			nPanel,nPanel.ownerCt,nPanel.param,nBtn.target);
																	} else {
																		var cachePanel = nPanel
																				.findParentByType(lib.CachedPanel.CachedPanel);
																		if (cachePanel
																				&& typeof(cachePanel.returnFn) == 'function') {
																			cachePanel.returnFn();
																			delete cachePanel.returnFn;
																		}
																	}
																	callFn.createDelegate(this).defer(10);
																}
															}, this);
														}
													}
													CPM.getModule(nPanel.programType).authit(nBtn,finishFn);
												}else{
													callFn.defer(10);
												}
											}
										}
									}, {
										text : '取消'.loc(),
										handler : function() {
											win.close();
										}
									}],
							listeners : {
								"close" : function(me) {
									if (Ext.isDefined(me.parentBtn)) {
										var b = Ext.getCmp(me.parentBtn.id);
										if (Ext.isDefined(b) && b.disabled)
											b.enable();
									}
								}
							}
						});
				win.show();			
			}
			break;
		case "提交" :
			if (Ext.isDefined(btn.isNotNullField)) {
				var fd = panel.form.findField(btn.isNotNullField);
				if (fd.getValue() != "") {
					panel.form.getEl().mask("上传中...");
					btn.disable();
					var pa = Ext.apply(panel.param, {
											"submitContent":fd.getValue(),
											"types" : 2
										})
					Ext.Ajax.request({
						url : '/usr/docManage/workflowDefinedBtns.jcp',
						scope : this,
						method : 'Post',
						params : pa,
						success : function(response, options) {
							panel.form.getEl().unmask();
							btn.enable();
							var cachePanel = panel.findParentByType(lib.CachedPanel.CachedPanel);
							if (cachePanel && typeof(cachePanel.returnFn) == 'function') {
								cachePanel.returnFn();
								delete cachePanel.returnFn;
							}
							var result = Ext.decode(response.responseText);
							if (result.success) {
								Ext.msg("info","提交成功。");
							} else {
								Ext.msg("error",result.message);
							}
						},
						failure : function( response, options) {
							panel.form.getEl().unmask();
							btn.enable();
							Ext .msg("error",CPM.getResponeseErrMsg(response));
						}
					});
				} else {
					fd.allowBlank = false;
					panel.form.isValid();
					Ext.msg("warn", "请您填写新的议题。");
				}
			}
			break;
		case "已征集议题" :
			var eData = panel.param.dataId || panel.param.exportData || "";
			btn.disable();
			panel.form.getEl().mask("读取中...");
			Ext.Ajax.request({
						url : '/usr/docManage/workflowDefinedBtns.jcp?exportData='+eData,
						scope : this,
						method : 'Get',
						success : function(response, options) {
							panel.form.getEl().unmask();
							btn.enable();

							var result = Ext.decode(response.responseText);
							if (result.success) {
								var reItems = [];
								if(Ext.isArray(result.items)){
									Ext.each(result.items,function(it){
										var obj = {xtype : 'fieldset'};
										obj.items = it;
										reItems.push(obj);
									});
								}
								if(reItems.length==0)
									reItems.push({xtype : 'fieldset',items:new Ext.Panel({border : false,html:"暂未查到议题意见。"})});
								var formPanel = new Ext.form.FormPanel({
									border : false,
									labelWidth : 150,
									labelAlign : "top",
									autoScroll : true,
									bodyStyle : "padding: 10px",
									items : reItems
								});
								if(Ext.isDefined(result.datas)){
									formPanel.form.setValues(result.datas);
								}
								
								var win = new Ext.Window({
									title : btn.text,
									width : 800,
									height : 600,
									autoScroll : true,
									modal : true,
									parentBtn : btn,
									layout : 'fit',
									items : formPanel,
									shadow : false,
									frame : true,
									buttons : [{
												text : '关闭'.loc(),
												handler : function() {
													win.close();
												}
											}],
									listeners : {
										"close" : function(me) {
											if (Ext.isDefined(me.parentBtn)) {
												var b = Ext.getCmp(me.parentBtn.id);
												if (Ext.isDefined(b) && b.disabled)
													b.enable();
											}
										}
									}
								});
								win.show();	
							} else {
								Ext.msg("error",result.message);
							}
						},
						failure : function( response, options) {
							panel.form.getEl().unmask();
							btn.enable();
							Ext .msg("error",CPM.getResponeseErrMsg(response));
						}
					});
			break;
		case "结束征集" :
			btn.disable();
			panel.ownerCt.getEl().mask("处理中...");
			var pa = Ext.apply(panel.param,{
				types:3
			});
			Ext.Ajax.request({
				url : '/usr/docManage/workflowDefinedBtns.jcp',
				scope : this,
				method : 'Post',
				params : pa,
				success : function(response, options) {
					panel.ownerCt.getEl().unmask();
					btn.enable();
					var result = Ext.decode(response.responseText);
					if (result.success) {
						btn.action = "%action";
						var finishFn = function() {
							var cachePanel = panel.findParentByType(lib.CachedPanel.CachedPanel);
							if (cachePanel) {
								cachePanel.returnFn();
								delete cachePanel.returnFn;
							}
						}
						CPM.getModule(panel.programType).authit(btn, finishFn);
						Ext.msg("info",result.message);
					} else {
						Ext.msg("error",result.message);
					}
				},
				failure : function(response, options) {
					panel.ownerCt.getEl().unmask();
					btn.enable();
					Ext .msg("error",CPM.getResponeseErrMsg(response));
				}
			});			
			break;
	}
}