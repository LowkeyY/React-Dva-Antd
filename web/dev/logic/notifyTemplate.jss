Ext.namespace("dev.logic");

using("lib.scripteditor.CodeEditor");
dev.logic.notifyTemplate = function(params, retFn, actType) {
	this.ButtonArray = new Array();
	this.params = params;
	this.selectStart = 0;
	this.selectEnd = 0;

	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : retFn
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function() {
					if (this.params['parent_id'] == null) {
						Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立消息通知'.loc());
					} else {
						var saveParams = this.params;
						saveParams['content'] = this.TXT.getValue();
						saveParams['notify_type'] = this.notifyType.getValue();
						saveParams['subject'] = this.subj.getValue();
						saveParams['smpt_server'] = this.server.getValue();
						saveParams['smtp_user'] = this.user.getValue();
						saveParams['smtp_passwd'] = this.passwd.getValue();
						saveParams['from_address'] = this.email.getValue();
						saveParams['query_id'] = this.queryId.getValue();
						saveParams['query_column'] = this.notifyForm.form
								.findField('query_column').getValue();

						Ext.Ajax.request({
									url : '/dev/logic/notifyTemplate.jcp',
									method : 'post',
									success : function(response, options) {
										var check = response.responseText;
										var ajaxResult = Ext.util.JSON
												.decode(check)
										if (ajaxResult.success) {
											Ext
													.msg("info", '消息通知模板提交成功!'
																	.loc());
										} else {
											Ext
													.msg(
															"error",
															'数据提交失败!,原因:'.loc()
																	+ '<br>'
																	+ ajaxResult.message);
										}
									},
									params : saveParams
								});
					}
				}
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '插入查询结果'.loc(),
				icon : '/themes/icon/all/anchor.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function() {
					using("lib.selectquery.queryWindow");
					var queryWindow = new lib.selectquery.queryWindow(
							this.params['parent_id'], null, null, this.TXT);
					queryWindow.show();
				}
			}));
	this.TXT = new lib.scripteditor.CodeEditor({
				allowFormatter : true,
				hiddenName : 'content',
				value : '',
				height : 550,
				hideLabel : true,
				language : "html"
			});

	this.notifyForm = new Ext.FormPanel({
		id : 'Container',
		bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		border : false,
		labelAlign : 'right',
		items : [this.notifyType = new Ext.form.RadioGroup({
							fieldLabel : '方式'.loc(),
							scope : this,
							width : 200,
							items : [{
										boxLabel : 'MSN',
										name : 'notify_type',
										inputValue : '1',
										checked : true
									}, {
										boxLabel : 'Email',
										name : 'notify_type',
										inputValue : '2'
									}, {
										boxLabel : '短信'.loc(),
										name : 'notify_type',
										inputValue : '3'
									}]
						}), this.subj = new Ext.form.TextField({
							fieldLabel : 'Mail标题'.loc(),
							name : 'subject',
							hidden : true,
							width : 200,
							maxLength : 100
						}), {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.45,
								layout : 'form',
								border : false,
								items : [this.server = new Ext.form.TextField({
											width : 200,
											hidden : true,
											fieldLabel : 'Smtp服务器地址'.loc(),
											name : 'smpt_server'
										})]
							}, {
								columnWidth : 0.55,
								layout : 'form',

								border : false,
								items : [this.user = new Ext.form.TextField({
											width : 200,
											hidden : true,
											fieldLabel : '用户名'.loc(),
											name : 'smtp_user'
										})]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.45,
								layout : 'form',

								border : false,
								items : [this.passwd = new Ext.form.TextField({
											width : 200,
											hidden : true,
											fieldLabel : '口令'.loc(),
											inputType : 'password',
											name : 'smtp_passwd'
										})]
							}, {
								columnWidth : 0.55,
								layout : 'form',

								border : false,
								items : [this.email = new Ext.form.TextField({
											width : 200,
											hidden : true,
											fieldLabel : '发送Email地址'.loc(),
											name : 'from_address',
											vtype : 'email'
										})]
							}]
				}, {

					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.45,
						layout : 'form',
						border : false,
						items : [this.queryId = new lib.ComboRemote.ComboRemote(
								{
									fieldLabel : '查询'.loc(),
									hiddenName : 'query_id',
									width : 200,
									scope : this,
									store : new Ext.data.JsonStore({
												url : '/dev/logic/getSource.jcp',
												root : 'items',
												autoLoad : true,
												scope : this,
												fields : ["text", "value"],
												baseParams : {
													type : 'query',
													parent_id : params.parent_id
												}
											}),
									valueField : 'value',
									displayField : 'text',
									triggerAction : 'all',
									mode : 'local'
								})]
					}, {
						columnWidth : 0.55,
						layout : 'form',
						border : false,
						items : [{
									xtype : 'comboremote',
									fieldLabel : '地址段'.loc(),
									hiddenName : 'query_column',
									width : 200,
									store : new Ext.data.JsonStore({
												url : '/dev/logic/getSource.jcp',
												root : 'items',
												autoLoad : false,
												fields : ["text", "value"],
												baseParams : {
													type : 'queryColumn'
												}
											}),
									valueField : 'value',
									displayField : 'text',
									triggerAction : 'all',
									mode : 'local'
								}]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'fit',
								border : true,
								items : this.TXT
							}]
				}]
	});

	this.MainTabPanel = new Ext.Panel({
				id : "notifyTemplate",
				border : false,
				layout : 'fit',
				split : true,
				tbar : this.ButtonArray,
				items : [this.notifyForm]
			});
	this.notifyType.on('change', function() {
				var tempToolBar = this.MainTabPanel.getTopToolbar();
				if (this.notifyType.getValue() == '2') {
					this.subj.show();
					this.server.show();
					this.user.show();
					this.passwd.show();
					this.email.show();
				} else {
					this.subj.hide();
					this.server.hide();
					this.user.hide();
					this.passwd.hide();
					this.email.hide();
				}
			}, this);
	if (actType == 'workflow') {
		this.notifyForm.form.findField('query_id').hide();
		this.notifyForm.form.findField('query_column').hide();
	}
	this.notifyType.on('afterrender', function() {
				this.notifyType.fireEvent("change");
			}, this);
	this.queryId.on('select', function() {
				if (this.queryId.oldValue == this.queryId.getValue()) {
					return;
				}
				this.queryId.oldValue = this.queryId.getValue();
				var types = this.queryId.getValue();
				var queryNameDS = this.notifyForm.form
						.findField('query_column');
				queryNameDS.store.load({
							params : {
								type : 'queryColumn',
								query_id : types
							}
						});
			}, this);
};
dev.logic.notifyTemplate.prototype = {
	loadData : function(params, mainPanel) {
		this.params = params;
		this.notifyForm.load({
					url : '/dev/logic/notifyTemplate.jcp?ra=' + Math.random()
							+ '&parent_id=' + params.parent_id,
					method : 'GET',
					scope : this,
					success : function(fm, action) {
						var data = action.result.data;
						var query = fm.findField("query_id");
						if (query.getValue() != '') {
							query.fireEvent("select");
						}
						this.notifyType.fireEvent("change");
						this.TXT.setValue(data.content);
						fm.findField("query_column")
								.setValue(data.address_item);
						mainPanel.setStatusValue(['通知模板'.loc()]);
					}
				});

	}
}
