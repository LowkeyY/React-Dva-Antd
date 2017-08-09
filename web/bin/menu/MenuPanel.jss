

bin.menu.MenuPanel = function(frames, Menu) {

	this.frames = frames;

	this.ButtonArray = [];
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'back',
				text : '返回'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				state : 'create',
				handler : this.onButtonClick
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				state : 'create',
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				state : 'create',
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'new',
				text : '新建子菜单'.loc(),
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				state : 'edit',
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				state : 'edit',
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'del',
				text : '删除'.loc(),
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				state : 'edit',
				handler : this.onButtonClick
			}));

	this.menuForm = new Ext.FormPanel({
		border : false,
		labelWidth : 160,
		labelAlign : 'right',
		url : '/bin/menu/create.jcp',
		id : 'menuBase',
		cached : true,
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.45,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '标题'.loc(),
							name : 'app_title',
							width : 150,
							maxLength : 50,
							allowBlank : false,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '标题中不应有'.loc() + '&,<,>,\',\",'
									+ '字符'.loc(),
							maxLengthText : '标题不能超过{0}个字符!'.loc(),
							blankText : '标题必须提供.'.loc()
						})]
			}, {
				columnWidth : 0.55,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '关联程序'.loc(),
							name : 'app_name',
							width : 150,
							maxLength : 500,
							regex : /[a-z0-9_./]/i,
							regexText : '程序名称只能是字符'.loc() + ',/,_,'
									+ '或数字!'.loc(),
							allowBlank : false,
							blankText : '程序名称必须提供.'.loc(),
							maxLengthText : '程序名称不能超过{0}个字符!'.loc()
						})]
			}]
		}, {
			layout : 'column',
			border : false,
			bodyStyle : 'display:none',
			items : [{
				columnWidth : 0.45,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '程序路径'.loc(),
							name : 'app_path',
							width : 150,
							maxLength : 500,
							regex : /[a-z0-9_./]/i,
							regexText : '程序路径只能是字符'.loc() + ',/,_,'
									+ '或数字!'.loc(),
							maxLengthText : '程序名称不能超过{0}个字符!'.loc()
						})]
			}, {
				columnWidth : 0.55,
				layout : 'form',
				border : false,
				items : [new lib.ComboRemote.ComboRemote({
							fieldLabel : '关联应用'.loc(),
							name : 'application_id',
							typeAhead : false,
							width : 150,
							mode : 'local',
							editable : false,
							triggerAction : 'all',
							displayField : 'label',
							listClass : 'category-element',
							emptyText : '选择关联应用'.loc(),
							valueField : 'id'
						})]
			}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.45,
						layout : 'form',
						border : false,
						items : [new Ext.form.NumberField({
									fieldLabel : '序号'.loc(),
									name : 'app_seq',
									minValue : 0,
									maxValue : 100000,
									width : 150,
									allowDecimals : false,
									allowNegative : false,
									minText : '程序版本最小值不能小于{0}'.loc(),
									maxText : '程序版本最大值不能大于 {0}'.loc(),
									nanText : '{0} 对于程序版本是无效数字'.loc()
								})]
					}, {
						columnWidth : 0.55,
						layout : 'form',
						border : false,
						items : [this.smallIconPicker = new lib.IconPicker.IconPicker(
								{
									name : 'icon_url_temp',
									width:24,
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '只能选择16x16的图标,需要在菜单中显示'.loc()
									},
									fieldLabel : '图标'.loc() + '(16x16)'
								})]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.45,
						layout : 'form',

						border : false,
						items : [new Ext.form.Checkbox({
									fieldLabel : '所有用户可用'.loc(),
									boxLabel : '是'.loc(),
									name : 'all_use',
									checked : true
								})]
					}, {
						columnWidth : 0.55,
						layout : 'form',

						border : false,
						items : [new Ext.form.Checkbox({
									fieldLabel : '启用'.loc(),
									boxLabel : '&nbsp;',
									name : 'is_valid',
									checked : true
								})]
					}]
		}],
		tbar : this.ButtonArray
	});
	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/bin/menu/create.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["id", "creater",
								"entry_date", "app_name", "app_title",
								"app_seq", "parent_app", "all_use", "son",
								"app_path", "icon_url", "application_id",
								"is_valid", "application_array"]),
				remoteSort : false
			});
	this.MainTabPanel = this.menuForm;
};
bin.menu.MenuPanel.prototype = {
	formCreate : function(params) {
		this.toggleToolBar('create');
		this.formDS.baseParams = params;
		this.formDS.baseParams['type'] = 'new';
		// this.formDS.on('load', this.initCombox, this);
		// this.formDS.load({params:{start:0, limit:1}});
		this.frames.get('Menu').mainPanel.setStatusValue(['菜单管理'.loc(),
				params.parent_id, '无'.loc(), '无'.loc()]);
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
		var tempToolBar = this.menuForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state)
						item.show();
				}, tempToolBar.items);
	},
	renderForm : function() {
		var fm = this.menuForm.form, data = this.formDS.getAt(0).data;
		for (var i = 0; i < this.ButtonArray.length; i++) {
			if (this.ButtonArray[i].btnId == 'del') {
				this.ButtonArray[i]
						.setDisabled(this.formDS.baseParams['son'] != '0');
			}
		}
		fm.findField('app_name').setValue(data.app_name);
		fm.findField('app_title').setValue(data.app_title);
		fm.findField('app_seq').setValue(data.app_seq);
		fm.findField('app_path').setValue(data.app_path);
		fm.findField('icon_url_temp').setValue(data.icon_url);
		fm.findField('is_valid').setValue(data.is_valid);
		fm.findField('all_use').setValue(data.all_use);
		this.frames.get('Menu').mainPanel.setStatusValue(['菜单管理'.loc(),
				data.id, data.creater, data.entry_date]);
		this.initCombox();
	},
	initCombox : function() {
		var applicationArray = [];
		for (var i = 0; i < this.formDS.getAt(0).data.application_array.length; i++) {
			applicationArray.push([
					this.formDS.getAt(0).data.application_array[i]["id"],
					this.formDS.getAt(0).data.application_array[i]["name"]]);
		}
		var store = new Ext.data.SimpleStore({
					fields : ['id', 'label'],
					data : applicationArray
				});
		this.menuForm.form.findField('application_id').store = store;
		this.menuForm.form.findField('application_id').setValue(this.formDS
				.getAt(0).data.application_id);
	},
	onButtonClick : function(item) {
		var Menu = this.frames.get("Menu");
		var frm = this.menuForm.form;
		if (item.btnId == 'new') {
			var newParams = this.formDS.baseParams;
			newParams['type'] = 'new';
			this.formCreate(newParams);
			frm.reset();
		} else if (item.btnId == 'back') {
			var prgType = this.formDS.baseParams.prgType;
			if (prgType == 'top') {
				Menu.mainPanel.setActiveTab("topMenuBase");
				Menu.topMenu.formEdit();
				Menu.topMenu.loadData(this.formDS.baseParams);
			} else if (prgType == 'menu') {
				var baseParam = this.formDS.baseParams;
				Menu.mainPanel.setActiveTab("menuBase");
				Menu.menu.formEdit();
				baseParam.type = null;
				Menu.menu.loadData(baseParam);
			}
		} else if (item.btnId == 'save') {
			var saveParams = this.formDS.baseParams;
			saveParams['type'] = 'save';
			saveParams['application_id'] = this.menuForm.form
					.findField('application_id').getValue();
			saveParams['icon_url_temp'] = this.smallIconPicker.getValue();
			if (frm.isValid()) {
				frm.submit({
							url : '/bin/menu/create.jcp',
							params : saveParams,
							method : 'POST',
							scope : this,
							success : function(form, action) {
								Menu.navPanel.getTree().loadSubNode(
										action.result.id,
										Menu.navPanel.clickEvent);
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'clear') {
			try {
				this.menuForm.form.reset();
			} catch (e) {
			}
		} else if (item.btnId == 'del') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = this.formDS.baseParams;
					delParams['type'] = 'delete';
					this.menuForm.form.submit({
								url : '/bin/menu/create.jcp',
								params : delParams,
								method : 'POST',
								scope : this,
								success : function(form, action) {
									Menu.navPanel
											.getTree()
											.loadParentNode(Menu.navPanel.clickEvent);
								},
								failure : function(form, action) {
									Ext.msg("error", '数据删除失败!,原因:'.loc()
													+ '<br>'
													+ action.result.message);
								}
							});
				}
			}.createDelegate(this));
		} else if (item.btnId == 'updatesave') {
			if (frm.isValid()) {
				var updateParams = this.formDS.baseParams;
				updateParams['type'] = 'updatesave';
				updateParams['application_id'] = this.menuForm.form
						.findField('application_id').getValue();
				updateParams['icon_url_temp'] = this.smallIconPicker.getValue();
				frm.submit({
							url : '/bin/menu/create.jcp',
							params : updateParams,
							method : 'POST',
							scope : this,
							success : function(form, action) {
								Menu.navPanel.getTree().loadSelfNode(
										action.result.id,
										Menu.navPanel.clickEvent);
								Ext.msg('info', '数据更新完毕!'.loc());
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		}
	}
};
