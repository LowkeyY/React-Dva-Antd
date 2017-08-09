Ext.namespace("dev.portlet");

dev.portlet.PortletPanel = function(objectId, parentPanel) {
	this.params = {};
	this.parentPanel = parentPanel;
	this.params["objectId"] = objectId;

	this.retFn = function(main) {
		main.setActiveTab("portletPanel");
		main.setStatusValue(['决策仪表盘管理'.loc(), objectId, '无'.loc(), '无'.loc()]);
	}.createCallback(parentPanel.mainPanel);

	var ButtonArray = [{
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				state : 'create'
			}, {
				btnId : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				state : 'create'
			}, {
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				state : 'edit'
			}, {
				btnId : 'delete',
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				state : 'edit'
			}, {
				btnId : 'newProgram',
				text : '新建程序'.loc(),
				icon : '/themes/icon/xp/menu.gif',
				state : 'edit'
			}, {
				btnId : 'layout',
				text : '样式设定'.loc(),
				icon : '/themes/icon/all/layout.gif',
				state : 'edit'
			}];
	Ext.each(ButtonArray, function(item) {
				Ext.apply(item, {
							cls : 'x-btn-text-icon  bmenu',
							disabled : false,
							scope : this,
							hidden : item.state == 'edit',
							handler : this.onButtonClick
						});
			}, this);

	this.MainTabPanel = new Ext.form.FormPanel({
		id : 'portletPanel',
		cached : true,
		labelWidth : 150,
		labelAlign : 'right',
		border : false,
		url : '/dev/portlet/create.jcp',
		tbar : ButtonArray,
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.45,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							fieldLabel : '逻辑名称'.loc(),
							name : 'logic_name',
							width : 160,
							maxLength : 32,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							allowBlank : false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText : '逻辑名称必须提供.'.loc()
						}]
			}, {
				columnWidth : 0.55,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							fieldLabel : '物理名称'.loc(),
							name : 'physical_name',
							style : 'ime-mode:disabled;',
							width : 160,
							maxLength : 32,
							allowBlank : false,
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText : '物理名称必须提供.'.loc()
						}]
			}]
		}, {
			xtype : 'textarea',
			fieldLabel : '说明'.loc(),
			name : 'description',
			width : 500,
			height : 60,
			maxLength : 1000,
			maxLengthText : '系统说明不能超过{0}个字符!'.loc()
		}]
	});
};
dev.portlet.PortletPanel.prototype = {
	init : function(params, main) {
		this.params = params;
		if (this.MainTabPanel.rendered) {
			this.toggleToolBar('create');
			var fm = this.MainTabPanel.form;
			fm.reset();
			main.setStatusValue(['决策仪表盘管理'.loc(), params.parent_id, '无'.loc(),
					'无'.loc()]);
		}
	},
	loadData : function(params, main) {
		this.MainTabPanel.form.load({
					method : 'GET',
					params : params,
					scope : this,
					success : function(fm, action) {
						var data = action.result.data;
						this.toggleToolBar('edit');
						main.setStatusValue(['决策仪表盘管理'.loc(), params.parent_id,
								data.lastModifyName, data.lastModifyTime]);
					}
				});
		this.params = params;
	},
	toggleToolBar : function(state) {
		this.MainTabPanel.getTopToolbar().items.each(function(item) {
					item.setVisible(item.state == state);
				});
	},
	onButtonClick : function(item) {
		var frm = this.MainTabPanel.form;
		if (item.btnId == 'clear') {
			this.MainTabPanel.form.reset();
		} else if (item.btnId == 'save') {
			if (this.params['parent_id'] == null) {
				Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立决策仪表盘管理定义'.loc());
			} else {
				var saveParams = this.params;
				saveParams['type'] = 'save';
				if (frm.isValid()) {
					frm.submit({
								url : '/dev/portlet/create.jcp',
								params : saveParams,
								method : 'post',
								scope : this,
								success : function(form, action) {
									Ext.msg("info", '保存成功'.loc());
									this.parentPanel.navPanel
											.getTree()
											.loadSubNode(
													action.result.id,
													this.parentPanel.navPanel.clickEvent);
								},
								failure : function(form, action) {
									Ext.msg("error", '错误'.loc(), '数据提交失败!,原因:'
													.loc()
													+ '<br>');
								}
							});
				} else {
					Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}
		} else if (item.btnId == 'updatesave') {
			if (frm.isValid()) {
				frm.submit({
							params : Ext.apply({
										type : 'updatesave'
									}, this.params),
							scope : this,
							success : function(form, action) {
								Ext.msg("info", '保存成功'.loc());
								this.parentPanel.navPanel
										.getTree()
										.loadSelfNode(
												action.result.id,
												this.parentPanel.navPanel.clickEvent);
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'delete') {
			Ext.msg('confirm', '警告:删除决策仪表盘管理将不可恢复,确认吗?'.loc(),
					function(answer) {
						if (answer == 'yes') {
							var delParams = {};
							delParams['type'] = 'delete';
							delParams['parent_id'] = this.params['parent_id'];
							frm.submit({
								url : '/dev/portlet/create.jcp',
								params : delParams,
								method : 'post',
								scope : this,
								success : function(form, action) {
									this.parentPanel.navPanel
											.getTree()
											.loadParentNode(this.parentPanel.navPanel.clickEvent);
								},
								failure : function(form, action) {
									Ext.msg("error", '数据提交失败!,原因:'.loc()
													+ '<br>'
													+ action.result.message);
								}
							});
						}
					}.createDelegate(this));
		} else if (item.btnId == 'newProgram') {
			using("lib.ComboRemote.ComboRemote");
			using("lib.ComboTree.ComboTree");
			using("dev.program.ProgramPanel");
			using("dev.program.ProgramGrid");
			Ext.Ajax.request({
						url : '/dev/module/SelectTerminalType.jcp',
						params : {
							id : this.params.parent_id
						},
						method : 'GET',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success) {
								var terminalType = result.terminalType;
								var programType = 'portlet';
								var programPanel = new dev.program.ProgramPanel(
										programType, this.parentPanel, "", {
											hideTarget : true
										});
								this.parentPanel.mainPanel
										.add(programPanel.MainTabPanel);
								this.parentPanel.mainPanel
										.setActiveTab(programPanel.MainTabPanel);
								this.params.retFn = this.retFn;
								this.params['terminalType'] = terminalType;
								programPanel.init(this.params,
										this.parentPanel.mainPanel);
							} else {
								Ext.msg("error", result.message);
							}
						}
					}, this);
		} else if (item.btnId == 'layout') {
			using("dev.portlet.PotalManage");
			var mp = this.parentPanel.mainPanel;
			var stylePanel = dev.portlet.PotalManage(this.params.parent_id,
					this.retFn);
			mp.add(stylePanel);
			mp.setActiveTab(stylePanel);
		}
	}
}
