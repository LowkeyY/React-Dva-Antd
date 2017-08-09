Ext.namespace("dev.system");

dev.system.TopMenuPanel = function(frames, fromPanel, fromType, params,
		utJSONArray) {

	this.pageFrame = fromPanel;
	this.frames = frames;

	this.params = params;
	this.fromType = fromType;

	this.ButtonArray = [];

	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/dev/system/topmenucreate.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["id", "top_title",
								"top_seq", "icon_url", "is_system", "root_use",
								"default_app", "entry_date", "creater",
								"isValid", "menu_type", "super_use", "son",
								"app_x", "app_y", "app_width", "app_height",
								"son", "parent_top", "icon_url48", "note",
								"authString", "iframe", "autoRunRG",
								"shortcutRG", "quickstartRG", "menustyle",
								"lastModifyTime", "lastModifyName",
								"portal_id", "terminal_type"]),
				remoteSort : false
			});
	this.terminalTypeDs = new Ext.data.SimpleStore({
				fields : ['terminalCode', 'terminalName'],
				data : [['0', 'PC'], ['1', 'PAD'], ['2', '手机'.loc()]]
			});

	this.menuTypeDs = new Ext.data.SimpleStore({
				fields : ['authId', 'authTitle'],
				data : [['0', '无权限控制'.loc()], ['1', '权限控制'.loc()]]
			});

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'groupBack',
				text : '返回'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				hidden : true,
				scope : this,
				handler : this.params.retFn
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'topMenuSave',
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
				btnId : 'topMenuClear',
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
				btnId : 'topMenuNew',
				text : '新建顶层导航'.loc(),
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				state : 'edit',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'newMenu',
				text : '新建菜单'.loc(),
				icon : '/themes/icon/all/application_add.gif',
				cls : 'x-btn-text-icon  bmenu',
				state : 'edit',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'topMenuUpdatesave',
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
				btnId : 'topMenuDelete',
				text : '删除'.loc(),
				state : 'edit',
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	var userTypes = [];
	for (i = 0; i < utJSONArray.length; i++) {
		var userType = {};
		userType.boxLabel = utJSONArray[i].title;
		userType.name = 'authString';
		userType.xtype = 'checkbox';
		userType.inputValue = utJSONArray[i].id;
		userTypes.push(userType);
	}
	this.topMenuForm = new Ext.FormPanel({
		labelWidth : 150,
		labelAlign : 'right',
		id : 'topMenuBase',
		cached : true,
		url : '/dev/system/topmanucreate.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;background:#FFFFFF;',

		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.40,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '导航标题'.loc(),
											name : 'TopMenuTitle',
											width : 150,
											maxLength : 50,
											allowBlank : false,
											blankText : '导航标题必须提供.'.loc(),
											maxLengthText : '导航标题不能超过{0}个字符!'
													.loc()
										})]
							}, {
								columnWidth : 0.60,
								layout : 'form',
								border : false,
								items : [new Ext.form.NumberField({
											fieldLabel : '顺序'.loc(),
											name : 'TopMenuSeq',
											minValue : 0,
											maxValue : 100000,
											width : 150,
											allowDecimals : false,
											allowNegative : false,
											minText : '程序版本最小值不能小于{0}'.loc(),
											maxText : '程序版本最大值不能大于 {0}'.loc(),
											nanText : '{0} 对于程序版本是无效数字'.loc()
										})]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.40,
						layout : 'form',
						border : false,
						items : [
								this.smallIconPicker = new lib.IconPicker.IconPicker(
										{
											height : 16,
											width : 24,
											qtip : {
												title : '提示'.loc(),
												dismissDelay : 10000,
												text : '只能选择16x16的图标,需要在菜单中显示'
														.loc()
											},
											name : 'icon_url',
											fieldLabel : '图标'.loc() + '(16x16)'
										}), {
									columnWidth : 0.40,
									layout : 'form',
									border : false,
									items : [new Ext.form.ComboBox({
												fieldLabel : '权限模式'.loc(),
												lazyRender : true,
												name : 'MenuType',
												minLength : 1,
												value : 1,
												store : this.menuTypeDs,
												valueField : 'authId',
												displayField : 'authTitle',
												triggerAction : 'all',
												mode : 'local'
											})]
								}, {
									columnWidth : 0.20,
									layout : 'form',
									border : false,
									items : [new Ext.form.ComboBox({
										fieldLabel : '终端类型'.loc(),
										lazyRender : true,
										name : 'terminalType',
										minLength : 1,
										value : 0,
										store : this.terminalTypeDs,
										valueField : 'terminalCode',
										displayField : 'terminalName',
										triggerAction : 'all',
										mode : 'local',
										listeners : {
											scope : this,
											select : function(obj, rec, index) {
												if (rec.get('terminalCode') != '0') {

													this.topMenuForm.form
															.findField('app_x')
															.hide();
													this.topMenuForm.form
															.findField('app_y')
															.hide();
													this.topMenuForm.form
															.findField('app_width')
															.hide();
													this.topMenuForm.form
															.findField('app_height')
															.hide();
													this.topMenuForm.form
															.findField('autoRunRG')
															.hide();
													this.topMenuForm.form
															.findField('shortcutRG')
															.hide();
													this.topMenuForm.form
															.findField('quickstartRG')
															.hide();
													this.topMenuForm.form
															.findField('menustyle')
															.hide();
												} else {
													this.topMenuForm.form
															.findField('app_x')
															.show();
													this.topMenuForm.form
															.findField('app_y')
															.show();
													this.topMenuForm.form
															.findField('app_width')
															.show();
													this.topMenuForm.form
															.findField('app_height')
															.show();
													this.topMenuForm.form
															.findField('autoRunRG')
															.show();
													this.topMenuForm.form
															.findField('shortcutRG')
															.show();
													this.topMenuForm.form
															.findField('quickstartRG')
															.show();
													this.topMenuForm.form
															.findField('menustyle')
															.show();
												}
											}
										}
									})]
								}]
					}, {
						columnWidth : 0.60,
						layout : 'form',
						border : false,
						items : [this.largeIconPicker = new lib.IconPicker.IconPicker(
								{
									name : 'icon_url48',
									height : 48,
									width : 58,
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '只能选择48x48的图标,需要在桌面显示'.loc()
									},
									defaultImage : '/themes/icon/xp48c/paper.gif',
									fieldLabel : '图标'.loc() + '(48x48)'
								})]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.40,
						layout : 'form',
						border : false,
						items : [new Ext.form.NumberField({
							fieldLabel : '起始位置'.loc() + '(x)',
							name : 'app_x',
							minValue : -1,
							maxValue : 2048,
							width : 150,
							qtip : {
								text : '以像素为单位的窗口左上角x坐标,如果填写的值为0到1之间的小数,则表示当前浏览器的宽度的百分比,如果填写-1则表示居中'
										.loc()
							},
							minText : '程序版本最小值不能小于{0}'.loc(),
							maxText : '程序版本最大值不能大于 {0}'.loc(),
							nanText : '{0} 对于程序版本是无效数字'.loc()
						})]
					}, {
						columnWidth : 0.60,
						layout : 'form',

						border : false,
						items : [new Ext.form.NumberField({
							fieldLabel : '起始位置(y)'.loc(),
							name : 'app_y',
							minValue : -1,
							maxValue : 4096,
							width : 150,
							qtip : {
								text : '以像素为单位的窗口左上角y坐标,如果填写的值为0到1之间的小数,则表示当前浏览器的高度的百分比,如果填写-1则表示居中'
										.loc()
							},
							minText : '程序版本最小值不能小于{0}'.loc(),
							maxText : '程序版本最大值不能大于 {0}'.loc(),
							nanText : '{0} 对于程序版本是无效数字'.loc()
						})]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.40,
						layout : 'form',
						border : false,
						items : [new Ext.form.NumberField({
							fieldLabel : '窗口宽度'.loc(),
							name : 'app_width',
							minValue : 0,
							maxValue : 2048,
							width : 150,
							qtip : {
								text : '以像素为单位的窗口宽度,如果填写的值为0到1之间的小数,则表示宽度是当前浏览器的宽度的百分比,如果填写0则表示将窗口最大化'
										.loc()
							},
							allowNegative : false,
							minText : '程序版本最小值不能小于{0}'.loc(),
							maxText : '程序版本最大值不能大于 {0}'.loc(),
							nanText : '{0} 对于程序版本是无效数字'.loc()
						})]
					}, {
						columnWidth : 0.60,
						layout : 'form',
						border : false,
						items : [new Ext.form.NumberField({
							fieldLabel : '窗口高度'.loc(),
							name : 'app_height',
							minValue : 0,
							maxValue : 1600,
							qtip : {
								text : '以像素为单位的窗口高度,如果填写的值为0到1之间的小数,则表示宽度是当前浏览器的高度的百分比,如果填写0则表示将窗口最大化'
										.loc()
							},
							width : 150,
							allowNegative : false,
							minText : '程序版本最小值不能小于{0}'.loc(),
							maxText : '程序版本最大值不能大于 {0}'.loc(),
							nanText : '{0} 对于程序版本是无效数字'.loc()
						})]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [this.authStringGroup = new Ext.form.CheckboxGroup(
								{
									fieldLabel : '访问权限'.loc(),
									width : 800,
									columns : 8,
									items : userTypes
								})]
					}]
				},

				{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.40,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											name : 'iframe',
											fieldLabel : 'IFRAME调用'.loc(),
											width : 80,
											items : [{
														boxLabel : '是'.loc(),
														name : 'iframe',
														inputValue : 'true'
													}, {
														boxLabel : '否'.loc(),
														name : 'iframe',
														inputValue : 'false',
														checked : true
													}]
										}]
							}, {
								columnWidth : 0.60,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											name : 'isValid',
											fieldLabel : '启用'.loc(),
											width : 80,
											items : [{
														boxLabel : '是'.loc(),
														name : 'isValid',
														inputValue : 'true',
														checked : true
													}, {
														boxLabel : '否'.loc(),
														name : 'isValid',
														inputValue : 'false'
													}]
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.40,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											fieldLabel : '自动运行'.loc(),
											name : 'autoRunRG',
											width : 80,
											items : [{
														boxLabel : '是'.loc(),
														name : 'autoRun',
														inputValue : 'true'
													}, {
														boxLabel : '否'.loc(),
														name : 'autoRun',
														inputValue : 'false',
														checked : true
													}]
										}]
							}, {
								columnWidth : 0.60,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											fieldLabel : '桌面显示'.loc(),
											name : 'shortcutRG',
											width : 80,
											items : [{
														boxLabel : '是'.loc(),
														name : 'shortcut',
														inputValue : 'true'
													}, {
														boxLabel : '否'.loc(),
														name : 'shortcut',
														inputValue : 'false',
														checked : true
													}]
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 0.4,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											fieldLabel : '快捷方式'.loc(),
											name : 'quickstartRG',
											width : 80,
											items : [{
														boxLabel : '是'.loc(),
														name : 'quickstart',
														inputValue : 'true'
													}, {
														boxLabel : '否'.loc(),
														name : 'quickstart',
														inputValue : 'false',
														checked : true
													}]
										}]
							}, {
								columnWidth : 0.60,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'radiogroup',
											fieldLabel : '菜单显示方式'.loc(),
											name : 'menustyle',
											width : 300,
											items : [{
														boxLabel : '顶部'.loc(),
														name : 'menustyle',
														inputValue : 'top',
														checked : true
													}, {
														boxLabel : '底部'.loc(),
														name : 'menustyle',
														inputValue : 'bottom'
													}, {
														boxLabel : '左侧'.loc(),
														name : 'menustyle',
														inputValue : 'left'
													}, {
														boxLabel : '右侧'.loc(),
														name : 'menustyle',
														inputValue : 'right'
													}, {
														boxLabel : '不显示'.loc(),
														name : 'menustyle',
														inputValue : 'none'
													}]
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [new Ext.form.TextField({
									fieldLabel : '应用程序'.loc(),
									name : 'defaultApplication',
									width : 550,
									maxLength : 500,
									regex : /[a-z0-9_./]/i,
									regexText : '应用程序只能是字符'.loc() + '&,<,>,\",'
											+ '数字!'.loc(),
									maxLengthText : '程序名称不能超过{0}个字符!'.loc()
								})]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '备注'.loc(),
											name : 'note',
											width : 550,
											maxLength : 500,
											maxLengthText : '程序名称不能超过{0}个字符!'
													.loc()
										})]
							}]
				}],
		tbar : this.ButtonArray
	});

	this.MainTabPanel = this.topMenuForm;

};
dev.system.TopMenuPanel.prototype = {
	formCreate : function(params) {
		this.params = params;
		if (this.MainTabPanel.rendered) {
			this.toggleToolBar('create');
			this.pageFrame.mainPanel.setStatusValue(['顶层导航管理'.loc()]);
			this.topMenuForm.form.reset();
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
		var tempToolBar = this.topMenuForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					//if (item.state == state) {
					if (item.state == state && item.btnId != 'newMenu' && item.btnId !=  'topMenuNew') {
						item.show();
					}
				}, tempToolBar.items);
	},
	renderForm : function() {
		var data = this.formDS.getAt(0).data;
		for (var i = 0; i < this.ButtonArray.length; i++) {
			if (this.ButtonArray[i].btnId == 'topMenuDelete') {
				this.ButtonArray[i].setDisabled(data.son != '0');
			} else if (this.ButtonArray[i].btnId == 'newMenu') {
				this.ButtonArray[i].setDisabled(this.fromType == 'portal');
			} else if (this.ButtonArray[i].btnId == 'topMenuNew') {
				if (data.parent_top != '0') {
					this.ButtonArray[i].setDisabled(true);
				} else {
					this.ButtonArray[i].setDisabled(false);
				}
			}
		}
		this.params.parent_id = this.params.id = data.id;
		var frm = this.topMenuForm.form;
		frm.findField('TopMenuTitle').setValue(data.top_title);
		frm.findField('TopMenuSeq').setValue(data.top_seq);
		frm.findField('icon_url').setValue(data.icon_url);
		frm.findField('defaultApplication').setValue(data.default_app);
		var authArray = Ext.decode(data.authString);
		var items = this.authStringGroup.initialConfig.items;
		var authValue = [];
		for (var j = 0; j < items.length; j++) {
			var auth = false;
			for (var i = 0; i < authArray.length; i++) {
				if (authArray[i] == items[j].inputValue) {
					auth = true;
					break;
				}
			};
			authValue.push(auth);
		}
		this.authStringGroup.setValue(authValue);
		frm.findField('app_x').setValue(data.app_x);
		frm.findField('app_y').setValue(data.app_y);
		frm.findField('app_width').setValue(data.app_width);
		frm.findField('app_height').setValue(data.app_height);
		frm.findField('MenuType').setValue(data.menu_type);
		frm.findField('terminalType').setValue(data.terminal_type);
		// frm.findField('rootUse').setValue(data.root_use);
		frm.findField('isValid').setValue(data.isValid);
		frm.findField('iframe').setValue(data.iframe);
		frm.findField('autoRunRG').setValue(data.autoRunRG);
		frm.findField('shortcutRG').setValue(data.shortcutRG);
		frm.findField('quickstartRG').setValue(data.quickstartRG);
		frm.findField('menustyle').setValue(data.menustyle);
		frm.findField('icon_url48').setValue(data.icon_url48);
		frm.findField('note').setValue(data.note);
		this.params.system_id = data.portal_id;
		this.pageFrame.mainPanel.setStatusValue(['顶层导航管理'.loc(), data.id,
				data.creater, data.entry_date]);
		if (data.terminal_type != '0' && data.terminal_type != ''
				&& typeof(data.terminal_type) != 'undefined') {
			this.topMenuForm.form.findField('app_x').hide();
			this.topMenuForm.form.findField('app_y').hide();
			this.topMenuForm.form.findField('app_width').hide();
			this.topMenuForm.form.findField('app_height').hide();
			this.topMenuForm.form.findField('autoRunRG').hide();
			this.topMenuForm.form.findField('shortcutRG').hide();
			this.topMenuForm.form.findField('quickstartRG').hide();
			this.topMenuForm.form.findField('menustyle').hide();
		} else {
			this.topMenuForm.form.findField('app_x').show();
			this.topMenuForm.form.findField('app_y').show();
			this.topMenuForm.form.findField('app_width').show();
			this.topMenuForm.form.findField('app_height').show();
			this.topMenuForm.form.findField('autoRunRG').show();
			this.topMenuForm.form.findField('shortcutRG').show();
			this.topMenuForm.form.findField('quickstartRG').show();
			this.topMenuForm.form.findField('menustyle').show();
		}
	},
	onButtonClick : function(item) {
		var frm = this.topMenuForm.form;
		if (item.btnId == 'topMenuNew') {
			this.params.parent_top = this.params.parent_id;
			this.formCreate(this.params);
		} else if (item.btnId == 'newMenu') {
			loadcss("lib.IconPicker.IconPicker");
			using("lib.IconPicker.IconPicker");
			using("bin.menu.MenuPanel");
			var Menu = this.frames.get("Menu");
			Menu.menu = new bin.menu.MenuPanel(this.frames, Menu);
			Menu.mainPanel.add(Menu.menu.MainTabPanel);
			Menu.mainPanel.setActiveTab(Menu.menu.MainTabPanel);
			Menu.menu.formCreate(this.formDS.baseParams);
		} else if (item.btnId == 'topMenuSave') {
			if (frm.isValid()) {
				var saveParams = this.params;
				saveParams['from'] = this.fromType;
				saveParams['type'] = 'save';
				saveParams['MenuType'] = this.topMenuForm.form
						.findField('MenuType').getValue();
				saveParams['icon_url'] = this.smallIconPicker.getValue();
				saveParams['icon_url48'] = this.largeIconPicker.getValue();
				saveParams['terminalType'] = this.topMenuForm.form
						.findField('terminalType').getValue();
				frm.submit({
							url : '/dev/system/topmenucreate.jcp',
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
								Ext.msg("error", '数据提交失败,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'topMenuClear') {
			this.topMenuForm.form.reset();
		} else if (item.btnId == 'update') {
			this.formEdit();
		} else if (item.btnId == 'topMenuDelete') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
						if (answer == 'yes') {
							var delParams = this.params;
							delParams['type'] = 'delete';
							this.topMenuForm.form.submit({
										url : '/dev/system/topmenucreate.jcp',
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
															'数据删除失败!,原因:'.loc()
																	+ '<br>'
																	+ action.result.message);
										}
									});
						}
					}.createDelegate(this));
		} else if (item.btnId == 'topMenuUpdatesave') {
			if (frm.isValid()) {
				var updateParams = this.params;
				updateParams['type'] = 'updatesave';
				updateParams['from'] = this.fromType;
				updateParams['MenuType'] = this.topMenuForm.form
						.findField('MenuType').getValue();
				updateParams['terminalType'] = this.topMenuForm.form
						.findField('terminalType').getValue();
				// updateParams['rootUse'] =
				// this.topMenuForm.form.findField('rootUse').getValue();
				updateParams['icon_url'] = this.smallIconPicker.getValue();
				updateParams['icon_url48'] = this.largeIconPicker.getValue();

				frm.submit({
							url : '/dev/system/topmenucreate.jcp',
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
