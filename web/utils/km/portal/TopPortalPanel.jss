Ext.namespace("utils.km.portal");

utils.km.portal.TopPortalPanel = function(frames, fromPanel, fromType, params) {

	this.pageFrame = fromPanel;
	this.frames = frames;

	this.params = params;
	this.fromType = fromType;

	this.ButtonArray = [];

	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/utils/km/portal/create.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["id", "portal_name","portal_pname","lang","current_stat","portal_desc", "portal_id"]),
				remoteSort : false
			});

	this.langDs = new Ext.data.SimpleStore({
				fields : ['langId', 'langTitle'],
				data : [['0', '中文'.loc()], ['1', '英文'.loc()]]
			});
	this.currentStatDs = new Ext.data.SimpleStore({
		fields : ['currentStat', 'currentStatName'],
		data : [['0', '封存'.loc()], ['1', '激活'.loc()]]
	});

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'topPortalSave',
				text : '保存'.loc(),
				state : 'create',
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'topPortalClear',
				text : '清空'.loc(),
				state : 'create',
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				state : 'create',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'newNode',
				text : '新建节点'.loc(),
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				state : 'edit',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'topPortalUpdatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'topPortalDelete',
				text : '删除'.loc(),
				state : 'edit',
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	this.topPortalForm = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		id : 'topPortalBase',
		cached : true,
		url : '/utils/km/portal/create.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;background:#FFFFFF;',

		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.50,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '门户名称'.loc(),
											name : 'TopPortalName',
											width : 150,
											maxLength : 24,
											allowBlank : false,
											blankText : '门户名称必须提供.'.loc(),
											maxLengthText : '门户名称不能超过{0}个字符!'.loc()
										})]
							}, {
								columnWidth : 0.50,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '门户物理名称'.loc(),
											name : 'TopPortalPname',
											width : 150,
											maxLength : 24,
											allowBlank : false,
											blankText : '物理名称必须提供.'.loc(),
											maxLengthText : '物理名称不能超过{0}个字符!'.loc()
										})]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [new Ext.form.ComboBox({
												fieldLabel : '语言'.loc(),
												lazyRender : true,
												name : 'lang',
												minLength : 1,
												value : 1,
												store : this.langDs,
												valueField : 'langId',
												displayField : 'langTitle',
												triggerAction : 'all',
												mode : 'local'
											})]
					}, {
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [new Ext.form.ComboBox({
												fieldLabel : '当前状态'.loc(),
												lazyRender : true,
												name : 'currentStat',
												minLength : 1,
												value : 1,
												store : this.currentStatDs,
												valueField : 'currentStat',
												displayField : 'currentStatName',
												triggerAction : 'all',
												mode : 'local'
											})]
					}]
					}, {
						layout:'column',
						border:false,
			            items:
						[
							{columnWidth:1.0,
							   layout: 'form',				   
							   border:false,
							   items: [				
									new Ext.form.TextArea({
										fieldLabel: '系统说明'.loc(),
										name: 'PortalDesc',		
										width: 550,
										height:60,
										maxLength : 500,
										maxLengthText : '系统说明不能超过{0}个字符!'.loc()
									})
								 ]}
						]
					}],
		tbar : this.ButtonArray
	});

	this.MainTabPanel = this.topPortalForm;
};
utils.km.portal.TopPortalPanel.prototype = {
	formCreate : function(params) {
		this.params = params;
		if (this.MainTabPanel.rendered) {
			this.toggleToolBar('create');
			this.pageFrame.mainPanel.setStatusValue(['门户管理'.loc()]);
			this.topPortalForm.form.reset();
		}
	},
	formEdit : function() {
		this.toggleToolBar('edit');
	},
	loadData : function(params) {
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({
					params : {
						start : 0,
						limit : 1
					}
				});
	},
	toggleToolBar : function(state) {
		var tempToolBar = this.topPortalForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state) {
						item.show();
					}
				}, tempToolBar.items);
	},
	renderForm : function() {
		var data = this.formDS.getAt(0).data;
		for (var i = 0; i < this.ButtonArray.length; i++) {
			if (this.ButtonArray[i].btnId == 'topPortalDelete') {
				this.ButtonArray[i].setDisabled(data.son != '0');
			} else if (this.ButtonArray[i].btnId == 'newNode') {
				this.ButtonArray[i].setDisabled(this.fromType == 'portal');
			} else if (this.ButtonArray[i].btnId == 'topPortalNew') {
				if (data.parent_top != '0') {
					this.ButtonArray[i].setDisabled(true);
				} else {
					this.ButtonArray[i].setDisabled(false);
				}
			}
		}
		this.params.parent_id = this.params.id = data.id;
		var frm = this.topPortalForm.form;
		frm.findField('TopPortalName').setValue(data.portal_name);
		frm.findField('TopPortalPname').setValue(data.portal_pname);
		frm.findField('lang').setValue(data.lang);
		frm.findField('currentStat').setValue(data.current_stat);
		frm.findField('PortalDesc').setValue(data.portal_desc);
		this.params.portal_id = data.portal_id;
		this.pageFrame.mainPanel.setStatusValue(['门户管理'.loc(), data.id,'无'.loc(),'无'.loc()]);
	},
	onButtonClick : function(item) {
		var frm = this.topPortalForm.form;
		if (item.btnId == 'topPortalNew') {
			this.params.parent_top = this.params.parent_id;
			this.formCreate(this.params);
		} else if (item.btnId == 'newNode') {
			using("utils.km.portal.PortalPanel");
			var Menu = this.frames.get("Portal");
			Menu.menu = new utils.km.portal.PortalPanel(this.frames, Menu);
			Menu.mainPanel.add(Menu.menu.MainTabPanel);
			Menu.mainPanel.setActiveTab(Menu.menu.MainTabPanel);
			Menu.menu.formCreate(this.formDS.baseParams);
		} else if (item.btnId == 'topPortalSave') {
			if (frm.isValid()) {
				var saveParams = this.params;
				saveParams['type'] = 'save';
				saveParams['lang'] = this.topPortalForm.form
						.findField('lang').getValue();
				saveParams['currentStat'] = this.topPortalForm.form
						.findField('currentStat').getValue();		
				frm.submit({
							url : '/utils/km/portal/create.jcp',
							params : saveParams,
							method : 'POST',
							scope : this,
							success : function(form, action) {
								Ext.msg("info", '保存成功!'.loc());
								this.pageFrame.navPanel.getTree().loadSubNode(
										action.result.id,
										this.frames.get("clickEvent"));
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'topPortalClear') {
			this.topPortalForm.form.reset();
		} else if (item.btnId == 'update') {
			this.formEdit();
		} else if (item.btnId == 'topPortalDelete') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
						if (answer == 'yes') {
							var delParams = this.params;
							delParams['type'] = 'delete';
							this.topPortalForm.form.submit({
										url : '/utils/km/portal/create.jcp',
										params : delParams,
										method : 'post',
										scope : this,
										success : function(form, action) {
											this.pageFrame.navPanel.getTree()
													.loadParentNode(this.frames
															.get("clickEvent"));
										},
										failure : function(form, action) {
											Ext
													.msg(
															"error",
															'数据删除失败!,原因:'.loc()+'<br>'
																	+ action.result.message);
										}
									});
						}
					}.createDelegate(this));
		} else if (item.btnId == 'topPortalUpdatesave') {
			if (frm.isValid()) {
				var updateParams = this.params;
				updateParams['type'] = 'updatesave';
				updateParams['lang'] = this.topPortalForm.form
						.findField('lang').getValue();
				updateParams['currentStat'] = this.topPortalForm.form
						.findField('currentStat').getValue();		
				frm.submit({
							url : '/utils/km/portal/create.jcp',
							params : updateParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								Ext.msg("info", '更新成功!'.loc());
								this.pageFrame.navPanel.getTree().loadSelfNode(
										action.result.id,
										this.frames.get("clickEvent"));
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败,原因:'.loc()+'<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		}
	}
};
