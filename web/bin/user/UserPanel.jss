
using("lib.ComboRemote.ComboRemote");
using("bin.user.ExternalStrategy");


bin.user.UserPanel = function(state, retFn) {
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'backToList',
				text : '返回'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				state : 'create',
				handler : retFn
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				state : 'create',
				scope : this,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'backToList1',
				text : '返回'.loc(),
				state : 'edit',
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				handler : retFn
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'updatesave',
				text : '保存'.loc(),
				state : 'edit',
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'changePassword',
				text : '重置密码'.loc(),
				state : 'edit',
				tooltip : '强制重新设置此用户的密码'.loc(),
				icon : '/themes/icon/all/lock_edit.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'moveTo',
				text : '调动'.loc(),
				state : 'edit',
				icon : '/themes/icon/all/user_go.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				cid : 'delete',
				text : '删除'.loc(),
				state : 'edit',
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Spacer({
				state : 'edit',
				hidden : true
			}));

	this.userForm = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		id : "userCreatePanel",
		cached : false,
		url : '/bin/user/usercreate.jcp',
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
									fieldLabel : '用户名'.loc(),
									name : 'userName',
									width : 150,
									maxLength : 64,
									allowBlank : false,
									qtip : {
										text : '此处填写用户用来登陆的账号,只可以由字母,数字,下划线组成,并且不能有空格'
									},
									regex : /^[a-zA-Z0-9\@\.\_]+$/,
									// regexText : '用户名只可以用电子邮件地址'.loc(),
									regexText : "用户名只可以由字母,数字,下划线组成,并且不能有空格",
									maxLengthText : '用户名不能超过{0}个字符!'.loc(),
									blankText : '用户名必须提供.'.loc()
								})]
					}, {
						columnWidth : 0.55,
						layout : 'form',

						border : false,
						items : [new Ext.form.TextField({
									fieldLabel : '真实姓名'.loc(),
									name : 'realName',
									qtip : {
										text : '此处填写当前用户实际姓名,如身份证上的名称或护照上的名称'
									},
									width : 150,
									maxLength : 64,
									allowBlank : false,
									blankText : '真实姓名必须提供.'.loc(),
									maxLengthText : '真实姓名不能超过{0}个字符!'.loc()
								})]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.45,
						layout : 'form',

						border : false,
						items : [
								new Ext.form.ComboBox({
											fieldLabel : '职位'.loc(),
											hiddenName : 'roleId',
											name : 'role',
											typeAhead : false,
											width : 150,
											allowBlank : true,
											mode : 'local',
											editable : false,
											triggerAction : 'all',
											displayField : 'label',
											listClass : 'category-element',
											emptyText : '请选择用户职位'.loc(),
											valueField : 'id'
										}),

								this.userType = new lib.ComboRemote.ComboRemote(
										{
											fieldLabel : '用户类别'.loc(),
											allowBlank : false,
											hiddenName : 'userType',
											valueField : 'value',
											displayField : 'text',
											listClass : 'category-element',
											value : '100',
											store : new Ext.data.JsonStore({
														autoLoad : true,
														url : '/bin/user/UserType.jcp',
														root : 'types',
														fields : ['text',
																'value']
													}),
											typeAhead : false,
											width : 150,
											editable : false,
											triggerAction : 'all'
										}),

								new Ext.form.TextField({
											fieldLabel : '电子邮件'.loc(),
											name : 'email',
											vtype : 'email',
											width : 150,
											maxLength : 100
										}), new Ext.form.TextField({
											fieldLabel : 'msn',
											name : 'msn',
											width : 150,
											maxLength : 50,
											maxLengthText : 'msn不能超过50个字符!'
													.loc()
										}), new Ext.form.TextField({
											fieldLabel : '办公电话'.loc(),
											name : 'phone',
											width : 150,
											regex : /[0-9-./]/,
											regexText : '电话号码只能是数字'.loc()
													+ '/－ !'

										}), new Ext.form.TextField({
											fieldLabel : '家庭电话'.loc(),
											name : 'phoneHome',
											width : 150,
											regex : /[0-9-./]/,
											regexText : '电话号码只能是数字'.loc()
													+ '/－ !'

										}), new Ext.form.TextField({
											fieldLabel : '手机'.loc(),
											name : 'celler',
											width : 150,
											regex : /[0-9-./]/,
											regexText : '手机号码只能是数字'.loc()
													+ '/－ !',
											maxText : '手机最大值不能大于 {0}'.loc()
										})]
					}, {
						columnWidth : 0.55,
						layout : 'form',
						border : false,
						items : [this.photoField = new lib.upload.Image({
							fieldLabel : '照片'.loc(),
							name : 'photo',
							id : 'photo',
							allowBlank : true,
							state : state,
							txtStyle : 'background-image: url("/lib/upload/images/nopicture.gif");',
							patternDescription : '照片文件'.loc(),
							fileSizeMax : 40 * 1024 * 1024,
							fileSizeMin : 10 * 1024,
							loadFailureMessage : '无照片'.loc(),
							chooseImageMessage : '点击此处上传照片'.loc(),
							canvasWidth : 170,
							canvasHeight : 190,
							width : 170
						})]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.45,
				layout : 'form',

				border : false,
				items : [{
							xtype : 'passwordfield',
							fieldLabel : '密码'.loc(),
							name : 'passwd',
							showCapsWarning : true,
							showStrengthMeter : true,
							width : 160,
							maxLength : 16,
							allowBlank : false,
							maxLengthText : '密码不能超过{0}个字符!'.loc(),
							listeners : {
								change : function() {
									var frm = this.userForm.form;
									frm.findField('confirm_passwd')
											.setValue('');
								},
								scope : this
							},
							blankText : '密码必须提供.'.loc()
						}]
			}, {
				columnWidth : 0.55,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'textfield',
					fieldLabel : '再次输入密码'.loc(),
					name : 'confirm_passwd',
					inputType : 'password',
					width : 100,
					maxLength : 16,
					allowBlank : false,
					listeners : {
						change : function() {
							var frm = this.userForm.form;
							var ps = frm.findField('passwd').getValue();
							var conps = frm.findField('confirm_passwd')
									.getValue();
							if (ps == '') {
								Ext.msg("error", '请先输入密码!'.loc());
								frm.findField('confirm_passwd').setValue('');
							} else if (ps != conps) {
								Ext.msg("error", '验证错误,两次输入的密码必须一致'.loc());
								frm.findField('confirm_passwd').setValue('');
							}
						},
						scope : this
					},
					blankText : '必须再次输入密码,以保证密码没有错误.'.loc(),
					maxLengthText : '再次输入的密码不能超过{0}个字符!'.loc()
				}]
			}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.45,
						layout : 'form',
						border : false,
						items : [new Ext.form.Checkbox({
									fieldLabel : '激活'.loc(),
									boxLabel : '&nbsp;',
									name : 'inActive',
									inputValue : 'y',
									checked : true
								})]
					}, {
						columnWidth : 0.55,
						layout : 'form',
						border : false,
						items : [new Ext.form.Checkbox({
									fieldLabel : '是否部门业务主管'.loc(),
									boxLabel : '&nbsp;',
									labelWidth:200,
									name : 'isMaster',
									inputValue : 'n',
									checked : false
								})]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [new Ext.form.NumberField({
									fieldLabel : '优先顺序'.loc(),
									name : 'sortId',
									qtip:{
										text:'数值越小，显示越靠前。'.loc()
									},
									width:150
								})]
					}]
		}, {
			border : false,
			layout : "form",
			items : [new bin.user.ExternalStrategy({
						fieldLabel : '附加角色'.loc(),
						name : 'strategys',
						width : 568
					})]

		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [new Ext.form.TextArea({
									fieldLabel : '职责说明'.loc(),
									name : 'duty',
									width : 550,
									height : 80,
									maxLength : 500,
									maxLengthText : '职责说明不能超过{0}个字符!'.loc()
								})]
					}]
		}],
		tbar : ButtonArray
	});

	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/bin/user/usercreate.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["userId", "userName",
								"passwd", "realName", "phone", "phoneHome",
								"celler", "email", "duty", "entryDate",
								"roleId", "inActive", "subAdmin", "isMaster",
								"msn", "roles", "userType", "photo",
								"entryDateModify","strategys","sortId"]),
				remoteSort : false
			});
	this.MainTabPanel = this.userForm;
};
bin.user.UserPanel.prototype = {
	formCreate : function(params) {
		this.frames.set('state', 'input');
		params['type'] = 'new';
		this.toggleToolBar('create');
		this.formDS.baseParams = params;
		this.formDS.on('load', this.initCombox, this);
		this.formDS.load({
					params : {
						start : 0,
						limit : 1
					}
				});
		this.frames.get("User").mainPanel.setStatusValue(['用户管理'.loc(),
				params.parent_id]);
	},
	formEdit : function(params) {
		this.toggleToolBar('edit');
		this.frames.set('state', 'input');
	},
	loadData : function(params) {
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		var frm = this.userForm.form;
		frm.findField('passwd').hide();
		frm.findField('confirm_passwd').hide();
		frm.findField('passwd').disable();
		frm.findField('confirm_passwd').disable();
		this.formDS.load({
					params : {
						start : 0,
						limit : 1
					}
				});
	},
	toggleToolBar : function(state) {
		this.userForm.getTopToolbar().items.each(function(item) {
					item.setVisible(item.state == state);
				});
	},
	renderForm : function() {
		var frm = this.userForm.form;
		var returnStr = this.formDS.getAt(0).data;
		frm.findField('strategys').setValue(returnStr.strategys);
		frm.findField('userName').setValue(returnStr.userName);
		frm.findField('passwd').setValue(returnStr.passwd);
		frm.findField('confirm_passwd').setValue(returnStr.passwd);
		frm.findField('realName').setValue(returnStr.realName);

		frm.findField('phone').setValue(returnStr.phone);
		frm.findField('phoneHome').setValue(returnStr.phoneHome);
		frm.findField('celler').setValue(returnStr.celler);
		this.userType.setValue(returnStr.userType);

		frm.findField('email').setValue(returnStr.email);
		frm.findField('msn').setValue(returnStr.msn);
		frm.findField('photo').setValue(returnStr.photo);
		frm.findField('sortId').setValue(returnStr.sortId);

		if (returnStr.inActive == 'y') {
			frm.findField('inActive').checked = true;
			frm.findField('inActive').setValue(true);
		} else {
			frm.findField('inActive').checked = false;
			frm.findField('inActive').setValue(false);
		}
		if (returnStr.isMaster == 'y') {
			frm.findField('isMaster').checked = true;
			frm.findField('isMaster').setValue(true);
		} else {
			frm.findField('isMaster').checked = false;
			frm.findField('isMaster').setValue(false);
		}
		frm.findField('duty').setValue(returnStr.duty);
		this.initCombox();
		frm.findField('roleId').setValue(returnStr.roleId);
		this.frames.get("User").mainPanel.showStatus();
		this.frames.get("User").mainPanel.setStatusValue(['用户管理'.loc(),
				returnStr.userId, "", returnStr.entryDateModify]);
	},
	initCombox : function() {
		try {
			var o = Ext.decode(this.formDS.getAt(0).data.roles);
			var storeRoleId = new Ext.data.SimpleStore({
						fields : ['id', 'label'],
						data : o
					});
			this.userForm.form.findField('roleId').store = storeRoleId;
			this.userForm.form.findField('roleId').setValue(o[0][0]);
		} catch (e) {
			Ext.msg("error", '原因:该部门下没有可供选择的职位,'.loc() + '<br>'
							+ '先建好职位才能在给部门下建用户'.loc() + '<br>');
			var backParams = this.formDS.baseParams;
			var User = this.frames.get('User');
			User.userListPanel.showList(backParams);
			User.mainPanel.setActiveTab("userListPanel");
		}
	},
	onButtonClick : function(item) {
		var User = this.frames.get("User");
		var frm = this.userForm.form;
		if (item.cid == 'save') {
			var pho = frm.findField("photo");
			if (pho.getValue()) {
				lib.upload.Uploader.setEnctype(this.userForm);
			}

			if (frm.findField('inActive').getValue()) {
				frm.findField('inActive').setRawValue('y');
			} else {
				frm.findField('inActive').setRawValue('n');
			}
			if (frm.findField('isMaster').getValue()) {
				frm.findField('isMaster').setRawValue('y');
			} else {
				frm.findField('isMaster').setRawValue('n');
			}
			var saveParams = this.formDS.baseParams;
			saveParams['type'] = 'save';
			saveParams['creatorId'] = get_cookie("user_id");;
			if (frm.isValid()) {
				frm.submit({
					url : '/bin/user/usercreate.jcp',
					params : saveParams,
					method : 'POST',
					scope : this,
					success : function(form, action) {
						try {
							var listParams = {};
							listParams['dept_id'] = this.formDS.baseParams['dept_id'];
							User.userListPanel.showList(listParams);
							User.mainPanel.setActiveTab("userListPanel");
						} catch (e) {
						}
					},
					failure : function(form, action) {
						Ext.msg("err", action.result);
					}
				});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.cid == 'clear') {
			this.userForm.form.reset();
		} else if (item.cid == 'update') {
			this.formEdit(this.formDS.baseParams);
		} else if (item.cid == 'delete') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = {};
					delParams['type'] = 'delete';
					delParams['userId'] = this.formDS.baseParams['userId'];
					frm.submit({
						url : '/bin/user/usercreate.jcp',
						params : delParams,
						method : 'POST',
						scope : this,
						success : function(form, action) {
							var listParams = {};
							listParams['dept_id'] = this.formDS.baseParams['dept_id'];
							User.userListPanel.showList(listParams);
							User.mainPanel.setActiveTab("userListPanel");
						},
						failure : function(form, action) {
							Ext.msg("err", action.result);
						}
					});
				}
			}.createDelegate(this));
		} else if (item.cid == 'updatesave') {
			if (frm.isValid()) {
				var pho = frm.findField("photo");
				if (pho.getValue()) {
					lib.upload.Uploader.setEnctype(this.userForm);
				}
				var updateParams = this.formDS.baseParams;
				updateParams['type'] = 'updatesave';

				if (frm.findField('inActive').getValue()) {
					frm.findField('inActive').setRawValue('y');
				} else {
					frm.findField('inActive').setRawValue('n');
				}

				if (frm.findField('isMaster').getValue()) {
					frm.findField('isMaster').setRawValue('y');
				} else {
					frm.findField('isMaster').setRawValue('n');
				}
				frm.submit({
					url : '/bin/user/usercreate.jcp',
					params : updateParams,
					method : 'POST',
					scope : this,
					success : function(form, action) {
						var listParams = {};
						listParams['dept_id'] = this.formDS.baseParams['dept_id'];
						User.userListPanel.showList(listParams);
						User.mainPanel.setActiveTab("userListPanel");
						Ext.msg("info", '用户信息更新成功!'.loc());
					},
					failure : function(form, action) {
						Ext.msg("err", action.result);
					}
				});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.cid == 'changePassword') {
			var passWin = new bin.user.PasswordWindow();
			passWin.show(this.formDS.baseParams['userId']);
		} else if (item.cid == 'moveTo') {
			using('lib.SelectRole.SelectRoleWindow');
			var selectRoleWin = new lib.SelectRole.SelectRoleWindow({
						deptId : 0
					});
			selectRoleWin.show();
			selectRoleWin.win.on('close', function() {
				if (selectRoleWin.role_id != '' && selectRoleWin.dept_id != '') {
					var moveParams = {};
					moveParams['type'] = 'moveTo';
					moveParams['userId'] = this.formDS.baseParams['userId'];
					moveParams['roleId'] = selectRoleWin.role_id;
					moveParams['deptId'] = selectRoleWin.dept_id;
					frm.submit({
						url : '/bin/user/usercreate.jcp',
						params : moveParams,
						method : 'POST',
						scope : this,
						success : function(form, action) {
							var listParams = {};
							listParams['dept_id'] = this.formDS.baseParams['dept_id'];
							User.userListPanel.showList(listParams);
							User.mainPanel.setActiveTab("userListPanel");
						},
						failure : function(form, action) {
							Ext.msg("err", action.result);
						}
					});
				}
			}, this)
		}
	}
};
bin.user.PasswordWindow = function() {
	this.win;
	var fm = Ext.form;
	this.baseForm = new Ext.FormPanel({
		labelWidth : 140,
		labelAlign : 'right',
		border : false,
		bodyStyle : 'padding:30px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 1.0,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'passwordfield',
							fieldLabel : '请输入新的密码'.loc(),
							name : 'passwd',
							showCapsWarning : true,
							showStrengthMeter : true,
							width : 160,
							maxLength : 16,
							allowBlank : false,
							maxLengthText : '密码不能超过{0}个字符!'.loc(),
							listeners : {
								change : function() {
									var frm = this.baseForm.form;
									frm.findField('confirm_passwd')
											.setValue('');
								},
								scope : this
							},
							blankText : '密码必须提供.'.loc()
						}, {
							xtype : 'textfield',
							fieldLabel : '请再次输入新的密码'.loc(),
							name : 'confirm_passwd',
							inputType : 'password',
							width : 160,
							maxLength : 16,
							allowBlank : false,
							listeners : {
								change : function() {
									var frm = this.baseForm.form;
									var ps = frm.findField('passwd').getValue();
									var conps = frm.findField('confirm_passwd')
											.getValue();
									if (ps == '') {
										Ext.msg("error", '请先输入密码!'.loc());
										frm.findField('confirm_passwd')
												.setValue('');
									} else if (ps != conps) {
										Ext
												.msg("error", '验证错误,请重新输入确认密码'
																.loc());
										frm.findField('confirm_passwd')
												.setValue('');
									}
								},
								scope : this
							},
							blankText : '确认密码必须提供.'.loc(),
							maxLengthText : '确认密码不能超过{0}个字符!'.loc()
						}]
			}]
		}]
	});
	this.win = new Ext.Window({
				title : '重置密码'.loc(),
				layout : 'fit',
				width : 386,
				height : 200,
				scope : this,
				closeAction : 'hide',
				plain : true,
				modal : true,
				items : [this.baseForm],
				buttons : [{
							text : '确定'.loc(),
							scope : this,
							handler : this.windowConfirm
						}, {
							text : '取消'.loc(),
							scope : this,
							handler : this.windowCancel
						}]
			});

};
Ext.extend(bin.user.PasswordWindow, Ext.Window, {
			show : function(userId) {
				this.userId = userId;
				this.win.show();
			},
			windowCancel : function() {
				this.win.close();
			},
			windowConfirm : function() {
				var fm = this.baseForm.form;
				var saveParams = {};
				saveParams['type'] = 'updatePassword';
				saveParams['userId'] = this.userId;
				if (fm.isValid()) {
					fm.submit({
								url : '/bin/user/usercreate.jcp',
								params : saveParams,
								method : 'POST',
								scope : this,
								success : function(form, action) {
									this.win.close();
									Ext.msg("info", '口令更新成功!'.loc());
								},
								failure : function(form, action) {
									Ext.msg("error", '数据提交失败!,原因:'.loc()
													+ '<br>'
													+ action.result.message);
								}
							});
				}
			}
		});
