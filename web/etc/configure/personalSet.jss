Ext.namespace("etc", "etc.configure");

etc.configure.PersonalSet = Ext.extend(Ext.app.Module, {
	moduleType : 'system',
	moduleId : 'preferences',
	actions : null,
	layout : null,
	win : null,
	mainPanel : null,
	navPanel : null,
	scope : this,
	init : function() {
		this.launcher = {
			handler : function() {
				this.createWindow();
			},
			iconCls : 'icon-pref',
			scope : this,
			shortcutIconCls : 'pref-shortcut-icon',
			text : '个人设置'.loc(),
			tooltip : '<b>' + '设置个人信息'.loc() + '</b><br/>' + '重置和更新个人信息!'.loc()
		}
	},
	createWindow : function() {
		window.ql = function(){};
		var desktop = this.app.getDesktop();
		this.win = desktop.getWindow(this.moduleId);
		if (!this.win) {
			var winWidth = desktop.getWinWidth() / 1.1;
			var winHeight = desktop.getWinHeight() / 1.1;
			using("lib.CachedPanel.CachedPanel");
			this.mainPanel = new lib.CachedPanel.CachedPanel({
						region : 'center',
						margins : '0 0 0 0',
						activeTab : 0,
						border : false,
						statusBar : true,
						statusConfig : {
							hidden : true
						},
						deferredRender : false,
						enableTabScroll : true,
						monitorResize : true
					});
			this.navPanel = new etc.configure.PersonalSet.NavPanel({
						owner : this,
						id : 'nav'
					});
			this.win = desktop.createWindow({
						id : this.moduleId,
						title : '个人设置'.loc(),
						iconCls : 'icon-pref',
						width : winWidth,
						height : winHeight,
						border : true,
						frame : true,
						x : desktop.getWinX(winWidth),
						y : desktop.getWinY(winHeight),
						layoutConfig : {
							animate : true
						},
						shim : false,
						animCollapse : false,
						constrainHeader : true,
						layout : 'border',
						items : [this.navPanel, this.mainPanel]
					});
		}
		this.win.show();
	},
	save : function(params) {
		var desktop = this.app.getDesktop();
		var callback = params.callback || null;
		var callbackScope = params.callbackScope || this;

		params.moduleId = this.moduleId;

		Ext.Ajax.request({
					url : this.app.connection,
					params : params,
					success : function(o) {
						if (o && o.responseText
								&& Ext.decode(o.responseText).success) {
							saveComplete('成功'.loc(), '保存成功.'.loc());
						} else {
							if (Ext.decode(o.responseText).message) {
								saveComplete('错误'.loc(), Ext
												.decode(o.responseText).message);
							} else {
								saveComplete('错误'.loc(), '服务器发生错误,不能正常保存配置信息.'
												.loc());
							}
						}
					},
					failure : function() {
						saveComplete('错误'.loc(), '失去与服务器连接.'.loc());
					},
					scope : this
				});
		function saveComplete(title, msg) {
			Ext.msg(((title == '错误'.loc()) ? "error" : "info"), msg);
			if (callback) {
				callback.call(callbackScope);
			}
		}
	},
	viewCard : function(card) {
		if (!this.mainPanel.havePanel(card)) {
			var contentPanel = this.getContentPanel(card);
			this.mainPanel.add(contentPanel);
		}
		this.mainPanel.setActiveTab(card);
	},
	getContentPanel : function(card) {
		if (card == 'pass') {
			var tempPanel = new etc.configure.PersonalSet.PassWord({
						owner : this,
						id : 'pass'
					});
			return tempPanel;
		} else if (card == 'profile') {
			loadcss("lib.upload.Base");
			using("lib.upload.Base");
			using("lib.upload.Image");
			return new etc.configure.PersonalSet.UserSet({
						owner : this,
						id : 'profile'
					});
		} else if (card == 'setting') {
			using("bin.i18n.setting.LocaleSettingPanel");
			return new bin.i18n.setting.LocaleSettingPanel({
						name : 'setting',
						bodyStyle : 'padding:20px 15px 30px 20px;background:#FFFFFF;',
						cached : true,
						buttons : [{
									handler : function() {
										this.win.close();
									},
									scope : this,
									text : '关闭'.loc()
								}]
					});
		} else if (card == 'activity') {
			return new etc.configure.PersonalSet.Activity({
						owner : this,
						id : 'activity'
					});
		} else if (card == 'viewShortcuts') {
			return new etc.configure.PersonalSet.Shortcuts({
						owner : this,
						id : 'viewShortcuts'
					});
		} else if (card == 'viewAutoRun') {
			return new etc.configure.PersonalSet.AutoRun({
						owner : this,
						id : 'viewAutoRun'
					});
		} else if (card == 'viewQuickstart') {
			return new etc.configure.PersonalSet.QuickStart({
						owner : this,
						id : 'viewQuickstart'
					});
		} else if (card == 'viewAppearance') {
			return new etc.configure.PersonalSet.Appearance({
						owner : this,
						id : 'viewAppearance'
					});
		} else if (card == 'viewWallpapers') {
			return new etc.configure.PersonalSet.Background({
						owner : this,
						id : 'viewWallpapers'
					});
		}
	}
});

etc.configure.PersonalSet.NavPanel = function(config) {
	this.owner = config.owner;
	var isRootOrRoot = get_cookie('user_id');
	if (isRootOrRoot == '0' || isRootOrRoot == '1') {
		this.profile = '';
		this.storage = '';
	} else {
		this.profile = '<LI class=pass><A id="pass" href="#">' + '修改密码'.loc()
				+ '</A></LI><LI class=profile><A  id="profile" href="#" >'
				+ '个人信息'.loc() + '</A></LI>';
		this.storage = '<LI class=chart><A id="space" href="#" >'
				+ '空间信息'.loc() + '</A></LI>';
	}
	etc.configure.PersonalSet.NavPanel.superclass.constructor.call(this, {
		containerScroll : true,
		rootVisible : false,
		region : 'west',
		width : 170,
		height : 500,
		split : false,
		border : false,
		collapsible : false,
		autoScroll : false,
		margins : '0 0 0 0',
		html : '<DIV id=leftNav><H4>'
				+ '基础信息'.loc()
				+ '</H4><UL>'
				+ this.profile
				+ ((Ext.i18n && Ext.i18n.enabled)
						? '<LI class=setting><A id="setting" href="#">'
								+ '区域设置'.loc() + '</A></LI>'
						: '')
				+ '</UL><H4>'
				+ '外观设置'.loc()
				+ '</H4><UL><LI class=viewShortcuts><A id="viewShortcuts" href="#">'
				+ '桌面启动程序'.loc()
				+ '</A></LI><LI class=viewAutoRun><A  id="viewAutoRun" href="#" >'
				+ '自动执行程序'.loc()
				+ '</A></LI><LI class=viewQuickstart><A  id="viewQuickstart" href="#" >'
				+ '快捷工具栏'.loc()
				+ '</A></LI><LI class=viewAppearance><A  id="viewAppearance" href="#" >'
				+ '窗口颜色与外观'.loc()
				+ '</A></LI><LI class=viewWallpapers><A id="viewWallpapers" href="#">'
				+ '桌面背景'.loc() + '</A></LI></UL><H4>' + '使用信息'.loc()
				+ '</H4><UL><LI class=activity><A id="activity" href="#">'
				+ '访问记录'.loc() + '</A></LI></UL></UL></DIV>',
		id : config.id
	});

	this.actions = {
		'pass' : function(owner) {
			owner.viewCard('pass');
		},
		'profile' : function(owner) {
			owner.viewCard('profile');
		},
		'setting' : function(owner) {
			owner.viewCard('setting');
		},
		'activity' : function(owner) {
			owner.viewCard('activity');
		},
		'space' : function(owner) {
			owner.viewCard('space');
		},
		'viewShortcuts' : function(owner) {
			owner.viewCard('viewShortcuts');
		},
		'viewAutoRun' : function(owner) {
			owner.viewCard('viewAutoRun');
		},
		'viewQuickstart' : function(owner) {
			owner.viewCard('viewQuickstart');
		},
		'viewAppearance' : function(owner) {
			owner.viewCard('viewAppearance');
		},
		'viewWallpapers' : function(owner) {
			owner.viewCard('viewWallpapers');
		}
	};
};

Ext.extend(etc.configure.PersonalSet.NavPanel, Ext.Panel, {
			afterRender : function() {
				this.body.on({
							'mousedown' : {
								fn : this.doAction,
								scope : this,
								delegate : 'a'
							},
							'click' : {
								fn : Ext.emptyFn,
								scope : null,
								delegate : 'a',
								preventDefault : true
							}
						});

				var isRootOrRoot = get_cookie('user_id');
				if (isRootOrRoot == '0' || isRootOrRoot == '1') {
					this.owner.viewCard('pass');
				} else {
					this.owner.viewCard('pass');
				}
				etc.configure.PersonalSet.NavPanel.superclass.afterRender
						.call(this);
			},
			doAction : function(e, t) {
				e.stopEvent();
				this.actions[t.id](this.owner);
			}
		});

etc.configure.PersonalSet.PassWord = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;
	using("lib.PasswordField.PasswordField");
	this.passwordForm = new Ext.FormPanel({
		labelWidth : 200,
		labelAlign : 'right',
		id : "passPanel",
		cached : false,
		border : false,
		bodyStyle : 'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'passwordfield',
											showCapsWarning : true,
											fieldLabel : '旧密码'.loc(),
											name : 'oldpasswd',
											width : 150,
											maxLength : 16,
											allowBlank : false,
											maxLengthText : '密码不能超过{0}个字符!'
													.loc(),
											blankText : '旧密码必须提供.'.loc()
										}]
							}, {
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'passwordfield',
											showCapsWarning : true,
											showStrengthMeter : true,
											fieldLabel : '新密码'.loc(),
											name : 'passwd',
											width : 150,
											maxLength : 16,
											allowBlank : false,
											maxLengthText : '新密码不能超过{0}个字符!'
													.loc(),
											blankText : '新密码必须提供.'.loc()
										}]
							}, {
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'textfield',
											fieldLabel : '确认密码'.loc(),
											name : 'confirm_passwd',
											inputType : 'password',
											width : 150,
											maxLength : 16,
											allowBlank : false,
											blankText : '确认密码必须提供.'.loc(),
											maxLengthText : '确认密码不能超过{0}个字符!'
													.loc()
										}]
							}]
				}]
	});

	etc.configure.PersonalSet.PassWord.superclass.constructor.call(this, {
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				id : config.id,
				items : this.passwordForm,
				title : '更新密码'.loc()
			});
	function onClose() {
		this.owner.win.close();
	}
	function onSave() {
		this.buttons[0].disable();
		var frm = this.passwordForm.form;
		var confirmpasswd = frm.findField('confirm_passwd').getValue();
		var passwd = frm.findField('passwd').getValue();
		var oldpasswd = frm.findField('oldpasswd').getValue();
		if (passwd == confirmpasswd) {
			this.owner.save({
						callback : function() {
							this.buttons[0].enable();
						},
						callbackScope : this,
						task : 'save',
						what : 'password',
						passwd : passwd,
						oldpasswd : oldpasswd
					});
		} else {
			Ext.msg("error", '不能更新口令,确认密码与新密码不一致!'.loc());
			this.buttons[0].enable();
		}
	}
};
Ext.extend(etc.configure.PersonalSet.PassWord, Ext.Panel);

// --------------刘海峰开始--------------------------------------------

etc.configure.PersonalSet.Activity = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;

	this.xg = Ext.grid;
	this.stasticDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : this.app.connection + "?moduleId="
									+ this.owner.moduleId
									+ "&task=load&what=log",
							method : 'POST'
						}),
				autoLoad : false,
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : '日期'
						}, [{
									name : '日期',
									mapping : '日期'
								}, {
									name : '当日访问人次',
									type : 'int'
								}, {
									name : '当日使用时间(分钟)',
									type : 'int'
								}, {
									name : '单次停留(分钟)',
									type : 'int'
								}]),
				remoteSort : true
			});
	this.stasticDS.setDefaultSort('日期'.loc(), 'desc');

	this.cm = new Ext.grid.ColumnModel([new this.xg.RowNumberer(), {
				id : '日期',
				header : '日期'.loc(),
				dataIndex : '日期',
				sortable : true,
				align : 'right'
			}, {
				header : '当日访问人次'.loc(),
				dataIndex : '当日访问人次',
				sortable : true,
				align : 'right'
			}, {
				header : '当日使用时间(分钟)'.loc(),
				dataIndex : '当日使用时间(分钟)',
				sortable : true,
				align : 'right'
			}, {
				header : '单次停留(分钟)'.loc(),
				dataIndex : '单次停留(分钟)',
				sortable : true,
				align : 'right'
			}]);
	this.cm.defaultSortable = true;
	this.activityGrid = new Ext.grid.GridPanel({
				store : this.stasticDS,
				cm : this.cm,
				autoScroll : true,
				trackMouseOver : true,

				loadMask : {
					msg : '数据载入中...'.loc()
				},
				viewConfig : {
					forceFit : true,
					enableRowBody : true,
					showPreview : true,
					getRowClass : this.applyRowClass
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 30,
							store : this.stasticDS,
							displayInfo : true,
							displayMsg : '{0}-{1}条 共:{2}条'.loc(),
							emptyMsg : '没有数据'.loc()
						})
			});

	this.store = this.stasticDS;
	etc.configure.PersonalSet.Activity.superclass.constructor.call(this, {
				autoScroll : false,
				border : false,
				layout : 'fit',
				buttons : [{
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				id : config.id,
				items : this.activityGrid,
				title : '访问日志'.loc()
			});

	function onClose() {
		this.owner.win.close();
	}
};

Ext.extend(etc.configure.PersonalSet.Activity, Ext.Panel, {
			afterRender : function() {
				etc.configure.PersonalSet.Activity.superclass.afterRender
						.call(this);
				this.loadStore();
			},
			loadStore : function() {
				this.store.load();
			}
		});

etc.configure.PersonalSet.UserSet = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;
	var state = "edit";

	this.userForm = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		id : "userSetPanel",
		border : false,
		cached : false,
		bodyStyle : 'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.45,
						layout : 'form',

						border : false,
						items : [new Ext.form.TextField({
											fieldLabel : '真实姓名'.loc(),
											name : 'real_name',
											width : 150,
											maxLength : 64,
											allowBlank : false,
											blankText : '真实姓名必须提供.'.loc(),
											value : WorkBench.real_name,
											maxLengthText : '真实姓名不能超过{0}个字符!'
													.loc()
										}), new Ext.form.TextField({
											fieldLabel : '电子邮件'.loc(),
											name : 'email',
											vtype : 'email',
											width : 150,
											maxLength : 100
										}), new Ext.form.TextField({
											fieldLabel : 'msn',
											name : 'msn',
											vtype : 'email',
											width : 150,
											maxLength : 50,
											maxLengthText : 'msn不能超过50个字符!'
													.loc()
										}), new Ext.form.TextField({
											fieldLabel : '电话'.loc(),
											name : 'phone',
											width : 150,
											regex : /[0-9-./]/,
											regexText : '电话号码只能是数字,/,-'.loc()

										}), new Ext.form.TextField({
											fieldLabel : '家庭电话'.loc(),
											name : 'phone_home',
											width : 150,
											regex : /[0-9-./]/,
											regexText : '电话号码只能是数字,/,-'.loc()

										}), new Ext.form.TextField({
											fieldLabel : '手机'.loc(),
											name : 'celler',
											width : 150,
											regex : /[0-9-./]/,
											regexText : '手机号码只能是数字,/,-'.loc(),
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
							canvasHeight : 180,
							width : 170
						})]
					}]
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
									height : 60,
									maxLength : 500,
									maxLengthText : '职责说明不能超过{0}个字符!'.loc()
								})]
					}]
		}]
	});

	this.formDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : this.app.connection + "?moduleId="
									+ this.owner.moduleId
									+ "&task=load&what=profile",
							method : 'post'
						}),
				reader : new Ext.data.JsonReader({},
						["real_name", "email", "phone", "phone_home", "celler",
								"duty", "msn", "photo"]),
				remoteSort : false
			});

	this.store = this.formDS;

	etc.configure.PersonalSet.UserSet.superclass.constructor.call(this, {
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				id : config.id,
				items : this.userForm,
				title : '个人信息'.loc()
			});

	this.store.on('load', function(store, records) {
				var frm = this.userForm.form;
				var returnStr = this.store.getAt(0).data;

				frm.findField('real_name').setValue(returnStr.real_name);
				frm.findField('phone').setValue(returnStr.phone);
				frm.findField('phone_home').setValue(returnStr.phone_home);
				frm.findField('celler').setValue(returnStr.celler);
				frm.findField('email').setValue(returnStr.email);
				frm.findField('msn').setValue(returnStr.msn);
				frm.findField('photo').setValue(returnStr.photo);
				frm.findField('duty').setValue(returnStr.duty);
			}, this);
	function onClose() {
		this.owner.win.close();
	}
	function onSave() {
		this.buttons[0].disable();
		var frm = this.userForm.form;
		if (frm.findField('photo').getValue()) {
			lib.upload.Uploader.setEnctype(this.userForm);
		}
		var saveParams = {};
		saveParams['task'] = 'save';
		saveParams['what'] = 'profile';
		if (frm.isValid()) {
			frm.submit({
						url : this.app.connection,
						params : saveParams,
						method : 'POST',
						scope : this,
						success : function(form, action) {
							this.buttons[0].enable();
							if (action.result.items.id)
								this.photoField.setValue(action.result.items);
						},
						failure : function(form, action) {
							Ext.msg("error", '数据提交失败!,原因:<br>'.loc()
											+ action.result.message);
						}
					});
		} else {
			Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
		}
	}
};
Ext.extend(etc.configure.PersonalSet.UserSet, Ext.Panel, {
			afterRender : function() {
				etc.configure.PersonalSet.UserSet.superclass.afterRender
						.call(this);
				this.loadStore();
			},
			loadStore : function() {
				this.store.load();
			}
		});

etc.configure.PersonalSet.AutoRun = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;

	var ms = this.app.modules, ids = this.app.desktop.config.autorun, nodes = expandNodes(
			ms, ids);

	etc.configure.PersonalSet.AutoRun.superclass.constructor.call(this, {
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				cls : 'pref-card pref-check-tree',
				id : config.id,
				lines : false,
				listeners : {
					'checkchange' : {
						fn : onCheckChange,
						scope : this
					}
				},
				loader : new Ext.tree.TreeLoader(),
				rootVisible : false,
				root : new Ext.tree.AsyncTreeNode({
							text : '自动启动程序'.loc(),
							children : nodes
						}),
				title : '自动启动程序'.loc()
			});

	function expandNodes(ms, ids) {
		var nodes = [];
		for (var i = 0, len = ms.length; i < len; i++) {
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			if (ms[i].moduleType == 'Application'
					|| ms[i].moduleType == 'system') {
				if (ms[i].moduleId != 'wb_help'
						&& ms[i].moduleId != 'preferences') {
					if (o.menu) {
						var tempNodes = expandSubNodes(o.subModules, ids);
						nodes.push({
									leaf : false,
									text : (o.text || o.menuText).loc(),
									children : tempNodes
								});
					} else {
						nodes.push({
									checked : isChecked(ms[i].moduleId, ids)
											? true
											: false,
									iconCls : ms[i].launcher.iconCls,
									icon : ms[i].launcher.icon,
									id : ms[i].moduleId,
									leaf : true,
									selected : true,
									text : (o.text || o.menuText).loc()
								});
					}
				}
			}
		}
		return nodes;
	}
	function expandSubNodes(ms, ids) {
		var nodes = [];
		for (var i = 0, len = ms.length; i < len; i++) {
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			nodes.push({
						checked : isChecked(ms[i].moduleId, ids) ? true : false,
						iconCls : ms[i].launcher.iconCls,
						icon : ms[i].launcher.icon,
						id : ms[i].moduleId,
						leaf : true,
						selected : true,
						text : (o.text || o.menuText).loc()
					});
		}
		return nodes;
	}
	function isChecked(id, ids) {
		for (var i = 0, len = ids.length; i < len; i++) {
			if (id == ids[i]) {
				return true;
			}
		}
	}
	function onCheckChange(node, checked) {
		if (node.leaf && node.id) {
			if (checked) {
				this.app.desktop.addAutoRun(node.id);
			} else {
				this.app.desktop.removeAutoRun(node.id);
			}
		}
		node.ownerTree.selModel.select(node);
	}
	function onClose() {
		this.owner.win.close();
	}
	function onSave() {
		this.buttons[0].disable();
		this.owner.save({
					callback : function() {
						this.buttons[0].enable();
					},
					callbackScope : this,
					task : 'save',
					what : 'autorun',
					ids : Ext.encode(this.app.desktop.config.autorun)
				});
	}
};

Ext.extend(etc.configure.PersonalSet.AutoRun, Ext.tree.TreePanel);

etc.configure.PersonalSet.Shortcuts = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;

	var ms = this.app.modules, ids = this.app.desktop.config.shortcuts, nodes = expandNodes(
			ms, ids);

	etc.configure.PersonalSet.Shortcuts.superclass.constructor.call(this, {
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				cls : 'pref-card pref-check-tree',
				id : config.id,
				lines : false,
				listeners : {
					'checkchange' : {
						fn : onCheckChange,
						scope : this
					}
				},
				loader : new Ext.tree.TreeLoader(),
				rootVisible : false,
				root : new Ext.tree.AsyncTreeNode({
							text : '桌面启动程序'.loc(),
							children : nodes
						}),
				title : '桌面启动程序'.loc()
			});

	function expandNodes(ms, ids) {
		var nodes = [];
		for (var i = 0, len = ms.length; i < len; i++) {
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			if (ms[i].moduleType == 'Application'
					|| ms[i].moduleType == 'system') {
				if (o.menu) {
					var tempNodes = expandSubNodes(o.subModules, ids);
					nodes.push({
								leaf : false,
								text : (o.text || o.menuText).loc(),
								children : tempNodes
							});
				} else {
					nodes.push({
						checked : isChecked(ms[i].moduleId, ids) ? true : false,
						iconCls : ms[i].launcher.iconCls,
						icon : ms[i].launcher.icon,
						id : ms[i].moduleId,
						leaf : true,
						selected : true,
						text : (o.text || o.menuText).loc()
					});
				}
			}
		}
		return nodes;
	}
	function expandSubNodes(ms, ids) {
		var nodes = [];
		for (var i = 0, len = ms.length; i < len; i++) {
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			nodes.push({
						checked : isChecked(ms[i].moduleId, ids) ? true : false,
						iconCls : ms[i].launcher.iconCls,
						icon : ms[i].launcher.icon,
						id : ms[i].moduleId,
						leaf : true,
						selected : true,
						text : (o.text || o.menuText).loc()
					});
		}
		return nodes;
	}
	function isChecked(id, ids) {
		if (ids)
			for (var i = 0, len = ids.length; i < len; i++) {
				if (id == ids[i]) {
					return true;
				}
			}
	}
	function onCheckChange(node, checked) {
		if (node.leaf && node.id) {
			if (checked) {
				this.app.desktop.addShortcut(node.id, true);
			} else {
				this.app.desktop.removeShortcut(node.id, true);
			}
		}
		node.ownerTree.selModel.select(node);
	}
	function onClose() {
		this.owner.win.close();
	}
	function onSave() {
		this.buttons[0].disable();
		this.owner.save({
					callback : function() {
						this.buttons[0].enable();
					},
					callbackScope : this,
					task : 'save',
					what : 'shortcut',
					ids : Ext.encode(this.app.desktop.config.shortcuts)
				});
	}
};

Ext.extend(etc.configure.PersonalSet.Shortcuts, Ext.tree.TreePanel);

etc.configure.PersonalSet.QuickStart = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;

	var ms = this.app.modules;
	var ids = this.app.desktop.config.quickstart;
	var nodes = expandNodes(ms, ids);
	etc.configure.PersonalSet.QuickStart.superclass.constructor.call(this, {
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				cls : 'pref-card pref-check-tree',
				id : config.id,
				lines : false,
				listeners : {
					'checkchange' : {
						fn : onCheckChange,
						scope : this
					}
				},
				loader : new Ext.tree.TreeLoader(),
				rootVisible : false,
				root : new Ext.tree.AsyncTreeNode({
							text : '快捷工具栏'.loc(),
							children : nodes
						}),
				title : '快捷工具栏'.loc()
			});

	function expandNodes(ms, ids) {
		var nodes = [];
		for (var i = 0, len = ms.length; i < len; i++) {
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			if (ms[i].moduleType == 'Application'
					|| ms[i].moduleType == 'system') {
				if (o.menu) {
					var tempNodes = expandSubNodes(o.subModules, ids);
					nodes.push({
								leaf : false,
								text : (o.text || o.menuText).loc(),
								children : tempNodes
							});
				} else {
					nodes.push({
						checked : isChecked(ms[i].moduleId, ids) ? true : false,
						iconCls : ms[i].launcher.iconCls,
						id : ms[i].moduleId,
						leaf : true,
						selected : true,
						text : (o.text || o.menuText).loc()
					});
				}
			}
		}
		return nodes;
	}
	function expandSubNodes(ms, ids) {
		var nodes = [];
		for (var i = 0, len = ms.length; i < len; i++) {
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			nodes.push({
						checked : isChecked(ms[i].moduleId, ids) ? true : false,
						iconCls : ms[i].launcher.iconCls,
						id : ms[i].moduleId,
						leaf : true,
						selected : true,
						text : (o.text || o.menuText).loc()
					});
		}
		return nodes;
	}

	function isChecked(id, ids) {
		if (ids) {
			for (var i = 0, len = ids.length; i < len; i++) {
				if (id == ids[i]) {
					return true;
				}
			}
		}
	}

	function onCheckChange(node, checked) {
		if (node.leaf && node.id) {
			if (checked) {
				this.app.desktop.addQuickStartButton(node.id, true);
			} else {
				this.app.desktop.removeQuickStartButton(node.id, true);
			}
		}
		node.ownerTree.selModel.select(node);
	}

	function onClose() {
		this.owner.win.close();
	}
	function onSave() {
		this.buttons[0].disable();
		this.owner.save({
					callback : function() {
						this.buttons[0].enable();
					},
					callbackScope : this,
					task : 'save',
					what : 'quickstart',
					ids : Ext.encode(this.app.desktop.config.quickstart)
				});
	}
};
Ext.extend(etc.configure.PersonalSet.QuickStart, Ext.tree.TreePanel);

etc.configure.PersonalSet.Appearance = function(config) {
	this.owner = config.owner;
	this.app = this.owner.app;
	var desktop = this.app.getDesktop();

	var store = new Ext.data.JsonStore({
				baseParams : {
					moduleId : this.owner.moduleId,
					task : 'load',
					what : 'themes'
				},
				fields : ['id', 'name', 'pathtothumbnail', 'pathtofile'],
				id : 'id',
				root : 'images',
				url : this.app.connection
			});
	this.store = store;

	store.on('load', function(store, records) {
				if (records) {
					defaults.setTitle('共有'.loc() + '(' + records.length + ')'
							+ '个主题'.loc());
					var id = this.app.desktop.config.styles.theme.id;
					if (id) {
						view.select(String(id));
					}
				}
			}, this);

	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="{id}">',
			'<div class="pref-view-thumb"><img src="{pathtothumbnail}" title="{name}" /></div>',
			'<span>{shortName}</span></div>', '</tpl>',
			'<div class="x-clear"></div>');

	var view = new Ext.DataView({
				autoHeight : true,
				cls : 'pref-thumnail-view',
				emptyText : '没有可供选择的主题'.loc(),
				itemSelector : 'div.pref-view-thumb-wrap',
				loadingText : '载入中...'.loc(),
				singleSelect : true,
				overClass : 'x-view-over',
				prepareData : function(data) {
					data.shortName = Ext.util.Format.ellipsis(data.name, 17);
					return data;
				},
				store : store,
				tpl : tpl
			});
	view.on('selectionchange', onSelectionChange, this);

	var defaults = new Ext.Panel({
				animCollapse : false,
				baseCls : 'collapse-group',
				border : false,
				cls : 'pref-thumbnail-viewer',
				collapsible : true,
				hideCollapseTool : true,
				id : 'pref-theme-view',
				items : view,
				title : '缺省主题'.loc(),
				titleCollapse : true
			});

	var themes = new Ext.Panel({
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : true,
				cls : 'pref-card-subpanel',
				id : 'themes',
				items : defaults,
				margins : '10 15 0 15',
				region : 'center'
			});

	var checkBox = new Ext.form.Checkbox({
				checked : this.app.desktop.config.styles.transparency
						? true
						: false,
				x : 150,
				y : 15
			});
	checkBox.on('check', toggleTransparency, this);

	var formPanel = new Ext.FormPanel({
				border : false,
				height : 70,
				items : [{
							x : 15,
							y : 15,
							xtype : 'label',
							text : '任务栏透明处理'.loc()
						}, checkBox],
				layout : 'absolute',
				split : false,
				region : 'south'
			});

	etc.configure.PersonalSet.Appearance.superclass.constructor.call(this, {
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				cls : 'pref-card',
				id : config.id,
				items : [themes
				// ,formPanel
				],
				layout : 'border',
				title : '窗口颜色与外观'.loc()
			});

	function onClose() {
		this.owner.win.close();
	}

	function onSave() {
		var c = this.app.desktop.config.styles;
		this.buttons[0].disable();
		this.owner.save({
					callback : function() {
						this.buttons[0].enable();
					},
					callbackScope : this,
					task : 'save',
					what : 'appearance',
					backgroundcolor : c.backgroundcolor,
					fontcolor : c.fontcolor,
					theme : c.theme.id,
					transparency : c.transparency,
					wallpaper : c.wallpaper.id,
					wallpaperposition : c.wallpaperposition
				});
	}

	function onSelectionChange(view, sel) {
		if (sel.length > 0) {
			var cId = this.app.desktop.config.styles.theme.id, r = view
					.getRecord(sel[0]), d = r.data;
			if (parseInt(cId) !== parseInt(r.id)) {
				if (r && r.id && d.name && d.pathtofile) {
					desktop.setTheme({
								id : r.id,
								name : d.name,
								pathtofile : d.pathtofile
							});
				}
			}
		}
	}
	function toggleTransparency(field, checked) {
		if (checked) {
			desktop.setTransparency(80);
		} else {
			desktop.setTransparency(30);
		}
	}
};

Ext.extend(etc.configure.PersonalSet.Appearance, Ext.Panel, {
			afterRender : function() {
				etc.configure.PersonalSet.Background.superclass.afterRender
						.call(this);
				this.loadStore();
			},
			loadStore : function() {
				this.store.load();
			}
		});

etc.configure.PersonalSet.Background = function(config) {

	this.owner = config.owner;
	this.app = this.owner.app;
	var desktop = this.app.getDesktop();

	var store = new Ext.data.JsonStore({
				baseParams : {
					moduleId : this.owner.moduleId,
					task : 'load',
					what : 'wallpapers'
				},
				fields : ['id', 'name', 'pathtothumbnail', 'pathtofile'],
				id : 'id',
				root : 'images',
				url : this.app.connection
			});

	this.store = store;
	store.on('load', function(store, records) {
				if (records) {
					defaults.setTitle('缺省墙纸'.loc() + '(' + records.length + ')'
							+ '个'.loc());
					var id = this.app.desktop.config.styles.wallpaper.id;
					if (id) {
						view.select('wallpaper-' + id);
					}
				}
			}, this);

	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="{id}">',
			'<div class="pref-view-thumb"><img src="{pathtothumbnail}" title="{name}" /></div>',
			'<span>{shortName}</span></div>', '</tpl>',
			'<div class="x-clear"></div>');

	var view = new Ext.DataView({
				autoHeight : true,
				cls : 'pref-thumnail-view',
				emptyText : '没有可供选择的墙纸'.loc(),
				itemSelector : 'div.pref-view-thumb-wrap',
				loadingText : '载入中...'.loc(),
				singleSelect : true,
				overClass : 'x-view-over',
				prepareData : function(data) {
					data.shortName = Ext.util.Format.ellipsis(data.name, 17);
					return data;
				},
				store : store,
				tpl : tpl
			});

	var view = new Ext.DataView({
				autoHeight : true,
				cls : 'pref-thumnail-view',
				emptyText : '没有要显示的墙纸'.loc(),
				itemSelector : 'div.pref-view-thumb-wrap',
				loadingText : '载入中...'.loc(),
				singleSelect : true,
				overClass : 'x-view-over',
				prepareData : function(data) {
					data.shortName = Ext.util.Format.ellipsis(data.name, 17);
					return data;
				},
				store : store,
				tpl : tpl
			});
	view.on('selectionchange', onSelectionChange, this);

	var defaults = new Ext.Panel({
				animCollapse : false,
				baseCls : 'collapse-group',
				border : false,
				cls : 'pref-thumbnail-viewer',
				collapsible : true,
				hideCollapseTool : true,
				id : 'pref-wallpaper-view',
				items : view,
				title : '缺省墙纸'.loc(),
				titleCollapse : true
			});

	var wallpapers = new Ext.Panel({
				autoScroll : true,
				bodyStyle : 'padding:10px',
				border : true,
				cls : 'pref-card-subpanel',
				id : 'wallpapers',
				items : defaults,
				margins : '10 15 0 15',
				region : 'center'
			});
	var wpp = this.app.desktop.config.styles.wallpaperposition;
	var tileRadio = createRadio('tile', wpp == 'tile' ? true : false, 90, 40);
	var centerRadio = createRadio('center', wpp == 'center' ? true : false,
			200, 40);

	var position = new Ext.FormPanel({
		border : false,
		height : 140,
		id : 'position',
		items : [{
					border : false,
					items : {
						border : false,
						html : '选择墙纸布局方式?'.loc()
					},
					x : 15,
					y : 15
				}, {
					border : false,
					items : {
						border : false,
						html : '<span width="64" height="54" border="0" align="right"/>'
								+ '平铺'.loc() + ':</span>'
					},
					x : 15,
					y : 40
				}, tileRadio, {
					border : false,
					items : {
						border : false,
						html : '<span width="64" height="54" border="0" align="right"/>'
								+ '拉伸'.loc() + ':</span>'
					},
					x : 125,
					y : 40
				}, centerRadio, {
					border : false,
					items : {
						border : false,
						html : '选择背景色'.loc()
					},
					x : 245,
					y : 15
				}, {
					border : false,
					items : new Ext.ColorPalette({
								listeners : {
									'select' : {
										fn : onColorSelect,
										scope : this
									}
								}
							}),
					x : 245,
					y : 40
				}, {
					border : false,
					items : {
						border : false,
						html : '选择字体颜色'.loc()
					},
					x : 425,
					y : 15
				}, {
					border : false,
					items : new Ext.ColorPalette({
								listeners : {
									'select' : {
										fn : onFontColorSelect,
										scope : this
									}
								}
							}),
					x : 425,
					y : 40

				}],
		layout : 'absolute',
		region : 'south',
		split : false
	});

	etc.configure.PersonalSet.Background.superclass.constructor.call(this, {
				border : false,
				buttons : [{
							handler : onSave,
							scope : this,
							text : '保存'.loc()
						}, {
							handler : onClose,
							scope : this,
							text : '关闭'.loc()
						}],
				cls : 'pref-card',
				id : config.id,
				items : [wallpapers, position],
				layout : 'border',
				title : '桌面背景'.loc()
			});

	function createRadio(value, checked, x, y) {
		if (value) {
			radio = new Ext.form.Radio({
						name : 'position',
						inputValue : value,
						checked : checked,
						x : x,
						y : y
					});
			radio.on('check', togglePosition, radio);
			return radio;
		}
	}
	function fieldRendered(field) {
		field.el.on("click", fieldChanged, field);
	}
	function fieldChanged() {
		togglePosition(this, true);
	}
	function onChangeBgColor() {
		colorDialog.show();
	}

	function onClose() {
		this.owner.win.close();
	}
	function onPickColor(p, hex) {
		desktop.setBackgroundColor(hex);
	}

	function onColorSelect(p, hex) {
		desktop.setBackgroundColor(hex);
	}
	function onFontColorSelect(p, hex) {
		desktop.setFontColor(hex);
	}

	function onSave() {
		var c = this.app.desktop.config.styles;
		this.buttons[0].disable();
		this.owner.save({
					callback : function() {
						this.buttons[0].enable();
					},
					callbackScope : this,
					task : 'save',
					what : 'appearance',
					backgroundcolor : c.backgroundcolor,
					fontcolor : c.fontcolor,
					theme : c.theme.id,
					transparency : c.transparency,
					wallpaper : c.wallpaper.id,
					wallpaperposition : c.wallpaperposition
				});
	}
	function onSelectionChange(view, sel) {
		if (sel.length > 0) {
			var cId = this.app.desktop.config.styles.wallpaper.id, r = view
					.getRecord(sel[0]), d = r.data;

			if (parseInt(cId) !== parseInt(r.id)) {
				if (r && r.id && d.name && d.pathtofile) {
					desktop.setWallpaper({
								id : r.id,
								name : d.name,
								pathtofile : d.pathtofile
							});
				}
			}
		}
	}
	function togglePosition(field, checked) {
		if (checked === true) {
			desktop.setWallpaperPosition(field.inputValue);
		}
	}
};
Ext.extend(etc.configure.PersonalSet.Background, Ext.Panel, {
			afterRender : function() {
				etc.configure.PersonalSet.Background.superclass.afterRender
						.call(this);
				this.loadStore();
			},
			loadStore : function() {
				this.store.load();
			}
		});
Ext.override(Ext.tree.TreeNodeUI, {
			toggleCheck : function(value) {
				var cb = this.checkbox;
				if (cb) {
					cb.checked = (value === undefined ? !cb.checked : value);
					this.fireEvent('checkchange', this.node, cb.checked);
				}
			}
		});

etc.configure.PersonalSet.TimeZones = [["Africa/Abidjan"], ["Africa/Accra"],
		["Africa/Addis_Ababa"], ["Africa/Algiers"], ["Africa/Asmara"],
		["Africa/Asmera"], ["Africa/Bamako"], ["Africa/Bangui"],
		["Africa/Banjul"], ["Africa/Bissau"], ["Africa/Blantyre"],
		["Africa/Brazzaville"], ["Africa/Bujumbura"], ["Africa/Cairo"],
		["Africa/Casablanca"], ["Africa/Ceuta"], ["Africa/Conakry"],
		["Africa/Dakar"], ["Africa/Dar_es_Salaam"], ["Africa/Djibouti"],
		["Africa/Douala"], ["Africa/El_Aaiun"], ["Africa/Freetown"],
		["Africa/Gaborone"], ["Africa/Harare"], ["Africa/Johannesburg"],
		["Africa/Kampala"], ["Africa/Khartoum"], ["Africa/Kigali"],
		["Africa/Kinshasa"], ["Africa/Lagos"], ["Africa/Libreville"],
		["Africa/Lome"], ["Africa/Luanda"], ["Africa/Lubumbashi"],
		["Africa/Lusaka"], ["Africa/Malabo"], ["Africa/Maputo"],
		["Africa/Maseru"], ["Africa/Mbabane"], ["Africa/Mogadishu"],
		["Africa/Monrovia"], ["Africa/Nairobi"], ["Africa/Ndjamena"],
		["Africa/Niamey"], ["Africa/Nouakchott"], ["Africa/Ouagadougou"],
		["Africa/Porto-Novo"], ["Africa/Sao_Tome"], ["Africa/Timbuktu"],
		["Africa/Tripoli"], ["Africa/Tunis"], ["Africa/Windhoek"],
		["America/Adak"], ["America/Anchorage"], ["America/Anguilla"],
		["America/Antigua"], ["America/Araguaina"],
		["America/Argentina/Buenos_Aires"], ["America/Argentina/Catamarca"],
		["America/Argentina/ComodRivadavia"], ["America/Argentina/Cordoba"],
		["America/Argentina/Jujuy"], ["America/Argentina/La_Rioja"],
		["America/Argentina/Mendoza"], ["America/Argentina/Rio_Gallegos"],
		["America/Argentina/San_Juan"], ["America/Argentina/Tucuman"],
		["America/Argentina/Ushuaia"], ["America/Aruba"], ["America/Asuncion"],
		["America/Atikokan"], ["America/Atka"], ["America/Bahia"],
		["America/Barbados"], ["America/Belem"], ["America/Belize"],
		["America/Blanc-Sablon"], ["America/Boa_Vista"], ["America/Bogota"],
		["America/Boise"], ["America/Buenos_Aires"], ["America/Cambridge_Bay"],
		["America/Campo_Grande"], ["America/Cancun"], ["America/Caracas"],
		["America/Catamarca"], ["America/Cayenne"], ["America/Cayman"],
		["America/Chicago"], ["America/Chihuahua"], ["America/Coral_Harbour"],
		["America/Cordoba"], ["America/Costa_Rica"], ["America/Cuiaba"],
		["America/Curacao"], ["America/Danmarkshavn"], ["America/Dawson"],
		["America/Dawson_Creek"], ["America/Denver"], ["America/Detroit"],
		["America/Dominica"], ["America/Edmonton"], ["America/Eirunepe"],
		["America/El_Salvador"], ["America/Ensenada"], ["America/Fort_Wayne"],
		["America/Fortaleza"], ["America/Glace_Bay"], ["America/Godthab"],
		["America/Goose_Bay"], ["America/Grand_Turk"], ["America/Grenada"],
		["America/Guadeloupe"], ["America/Guatemala"], ["America/Guayaquil"],
		["America/Guyana"], ["America/Halifax"], ["America/Havana"],
		["America/Hermosillo"], ["America/Indiana/Indianapolis"],
		["America/Indiana/Knox"], ["America/Indiana/Marengo"],
		["America/Indiana/Petersburg"], ["America/Indiana/Vevay"],
		["America/Indiana/Vincennes"], ["America/Indiana/Winamac"],
		["America/Indianapolis"], ["America/Inuvik"], ["America/Iqaluit"],
		["America/Jamaica"], ["America/Jujuy"], ["America/Juneau"],
		["America/Kentucky/Louisville"], ["America/Kentucky/Monticello"],
		["America/Knox_IN"], ["America/La_Paz"], ["America/Lima"],
		["America/Los_Angeles"], ["America/Louisville"], ["America/Maceio"],
		["America/Managua"], ["America/Manaus"], ["America/Martinique"],
		["America/Mazatlan"], ["America/Mendoza"], ["America/Menominee"],
		["America/Merida"], ["America/Mexico_City"], ["America/Miquelon"],
		["America/Moncton"], ["America/Monterrey"], ["America/Montevideo"],
		["America/Montreal"], ["America/Montserrat"], ["America/Nassau"],
		["America/New_York"], ["America/Nipigon"], ["America/Nome"],
		["America/Noronha"], ["America/North_Dakota/Center"],
		["America/North_Dakota/New_Salem"], ["America/Panama"],
		["America/Pangnirtung"], ["America/Paramaribo"], ["America/Phoenix"],
		["America/Port-au-Prince"], ["America/Port_of_Spain"],
		["America/Porto_Acre"], ["America/Porto_Velho"],
		["America/Puerto_Rico"], ["America/Rainy_River"],
		["America/Rankin_Inlet"], ["America/Recife"], ["America/Regina"],
		["America/Resolute"], ["America/Rio_Branco"], ["America/Rosario"],
		["America/Santiago"], ["America/Santo_Domingo"], ["America/Sao_Paulo"],
		["America/Scoresbysund"], ["America/Shiprock"], ["America/St_Johns"],
		["America/St_Kitts"], ["America/St_Lucia"], ["America/St_Thomas"],
		["America/St_Vincent"], ["America/Swift_Current"],
		["America/Tegucigalpa"], ["America/Thule"], ["America/Thunder_Bay"],
		["America/Tijuana"], ["America/Toronto"], ["America/Tortola"],
		["America/Vancouver"], ["America/Virgin"], ["America/Whitehorse"],
		["America/Winnipeg"], ["America/Yakutat"], ["America/Yellowknife"],
		["Antarctica/Casey"], ["Antarctica/Davis"],
		["Antarctica/DumontDUrville"], ["Antarctica/Mawson"],
		["Antarctica/McMurdo"], ["Antarctica/Palmer"], ["Antarctica/Rothera"],
		["Antarctica/South_Pole"], ["Antarctica/Syowa"], ["Antarctica/Vostok"],
		["Arctic/Longyearbyen"], ["Asia/Aden"], ["Asia/Almaty"],
		["Asia/Amman"], ["Asia/Anadyr"], ["Asia/Aqtau"], ["Asia/Aqtobe"],
		["Asia/Ashgabat"], ["Asia/Ashkhabad"], ["Asia/Baghdad"],
		["Asia/Bahrain"], ["Asia/Baku"], ["Asia/Bangkok"], ["Asia/Beirut"],
		["Asia/Bishkek"], ["Asia/Brunei"], ["Asia/Calcutta"],
		["Asia/Choibalsan"], ["Asia/Chongqing"], ["Asia/Chungking"],
		["Asia/Colombo"], ["Asia/Dacca"], ["Asia/Damascus"], ["Asia/Dhaka"],
		["Asia/Dili"], ["Asia/Dubai"], ["Asia/Dushanbe"], ["Asia/Gaza"],
		["Asia/Harbin"], ["Asia/Hong_Kong"], ["Asia/Hovd"], ["Asia/Irkutsk"],
		["Asia/Istanbul"], ["Asia/Jakarta"], ["Asia/Jayapura"],
		["Asia/Jerusalem"], ["Asia/Kabul"], ["Asia/Kamchatka"],
		["Asia/Karachi"], ["Asia/Kashgar"], ["Asia/Katmandu"],
		["Asia/Krasnoyarsk"], ["Asia/Kuala_Lumpur"], ["Asia/Kuching"],
		["Asia/Kuwait"], ["Asia/Macao"], ["Asia/Macau"], ["Asia/Magadan"],
		["Asia/Makassar"], ["Asia/Manila"], ["Asia/Muscat"], ["Asia/Nicosia"],
		["Asia/Novosibirsk"], ["Asia/Omsk"], ["Asia/Oral"],
		["Asia/Phnom_Penh"], ["Asia/Pontianak"], ["Asia/Pyongyang"],
		["Asia/Qatar"], ["Asia/Qyzylorda"], ["Asia/Rangoon"], ["Asia/Riyadh"],
		["Asia/Saigon"], ["Asia/Sakhalin"], ["Asia/Samarkand"], ["Asia/Seoul"],
		["Asia/Shanghai"], ["Asia/Singapore"], ["Asia/Taipei"],
		["Asia/Tashkent"], ["Asia/Tbilisi"], ["Asia/Tehran"],
		["Asia/Tel_Aviv"], ["Asia/Thimbu"], ["Asia/Thimphu"], ["Asia/Tokyo"],
		["Asia/Ujung_Pandang"], ["Asia/Ulaanbaatar"], ["Asia/Ulan_Bator"],
		["Asia/Urumqi"], ["Asia/Vientiane"], ["Asia/Vladivostok"],
		["Asia/Yakutsk"], ["Asia/Yekaterinburg"], ["Asia/Yerevan"],
		["Atlantic/Azores"], ["Atlantic/Bermuda"], ["Atlantic/Canary"],
		["Atlantic/Cape_Verde"], ["Atlantic/Faeroe"], ["Atlantic/Faroe"],
		["Atlantic/Jan_Mayen"], ["Atlantic/Madeira"], ["Atlantic/Reykjavik"],
		["Atlantic/South_Georgia"], ["Atlantic/St_Helena"],
		["Atlantic/Stanley"], ["Australia/ACT"], ["Australia/Adelaide"],
		["Australia/Brisbane"], ["Australia/Broken_Hill"],
		["Australia/Canberra"], ["Australia/Currie"], ["Australia/Darwin"],
		["Australia/Eucla"], ["Australia/Hobart"], ["Australia/LHI"],
		["Australia/Lindeman"], ["Australia/Lord_Howe"],
		["Australia/Melbourne"], ["Australia/North"], ["Australia/NSW"],
		["Australia/Perth"], ["Australia/Queensland"], ["Australia/South"],
		["Australia/Sydney"], ["Australia/Tasmania"], ["Australia/Victoria"],
		["Australia/West"], ["Australia/Yancowinna"], ["Brazil/Acre"],
		["Brazil/DeNoronha"], ["Brazil/East"], ["Brazil/West"],
		["Canada/Atlantic"], ["Canada/Central"], ["Canada/East-Saskatchewan"],
		["Canada/Eastern"], ["Canada/Mountain"], ["Canada/Newfoundland"],
		["Canada/Pacific"], ["Canada/Saskatchewan"], ["Canada/Yukon"], ["CET"],
		["Chile/Continental"], ["Chile/EasterIsland"], ["CST6CDT"], ["Cuba"],
		["EET"], ["Egypt"], ["Eire"], ["EST"], ["EST5EDT"], ["Etc/GMT"],
		["Etc/GMT+0"], ["Etc/GMT+1"], ["Etc/GMT+10"], ["Etc/GMT+11"],
		["Etc/GMT+12"], ["Etc/GMT+2"], ["Etc/GMT+3"], ["Etc/GMT+4"],
		["Etc/GMT+5"], ["Etc/GMT+6"], ["Etc/GMT+7"], ["Etc/GMT+8"],
		["Etc/GMT+9"], ["Etc/GMT-0"], ["Etc/GMT-1"], ["Etc/GMT-10"],
		["Etc/GMT-11"], ["Etc/GMT-12"], ["Etc/GMT-13"], ["Etc/GMT-14"],
		["Etc/GMT-2"], ["Etc/GMT-3"], ["Etc/GMT-4"], ["Etc/GMT-5"],
		["Etc/GMT-6"], ["Etc/GMT-7"], ["Etc/GMT-8"], ["Etc/GMT-9"],
		["Etc/GMT0"], ["Etc/Greenwich"], ["Etc/UCT"], ["Etc/Universal"],
		["Etc/UTC"], ["Etc/Zulu"], ["Europe/Amsterdam"], ["Europe/Andorra"],
		["Europe/Athens"], ["Europe/Belfast"], ["Europe/Belgrade"],
		["Europe/Berlin"], ["Europe/Bratislava"], ["Europe/Brussels"],
		["Europe/Bucharest"], ["Europe/Budapest"], ["Europe/Chisinau"],
		["Europe/Copenhagen"], ["Europe/Dublin"], ["Europe/Gibraltar"],
		["Europe/Guernsey"], ["Europe/Helsinki"], ["Europe/Isle_of_Man"],
		["Europe/Istanbul"], ["Europe/Jersey"], ["Europe/Kaliningrad"],
		["Europe/Kiev"], ["Europe/Lisbon"], ["Europe/Ljubljana"],
		["Europe/London"], ["Europe/Luxembourg"], ["Europe/Madrid"],
		["Europe/Malta"], ["Europe/Mariehamn"], ["Europe/Minsk"],
		["Europe/Monaco"], ["Europe/Moscow"], ["Europe/Nicosia"],
		["Europe/Oslo"], ["Europe/Paris"], ["Europe/Podgorica"],
		["Europe/Prague"], ["Europe/Riga"], ["Europe/Rome"], ["Europe/Samara"],
		["Europe/San_Marino"], ["Europe/Sarajevo"], ["Europe/Simferopol"],
		["Europe/Skopje"], ["Europe/Sofia"], ["Europe/Stockholm"],
		["Europe/Tallinn"], ["Europe/Tirane"], ["Europe/Tiraspol"],
		["Europe/Uzhgorod"], ["Europe/Vaduz"], ["Europe/Vatican"],
		["Europe/Vienna"], ["Europe/Vilnius"], ["Europe/Volgograd"],
		["Europe/Warsaw"], ["Europe/Zagreb"], ["Europe/Zaporozhye"],
		["Europe/Zurich"], ["Factory"], ["GB"], ["GB-Eire"], ["GMT+0"],
		["GMT-0"], ["GMT0"], ["Greenwich"], ["Hongkong"], ["HST"], ["Iceland"],
		["Indian/Antananarivo"], ["Indian/Chagos"], ["Indian/Christmas"],
		["Indian/Cocos"], ["Indian/Comoro"], ["Indian/Kerguelen"],
		["Indian/Mahe"], ["Indian/Maldives"], ["Indian/Mauritius"],
		["Indian/Mayotte"], ["Indian/Reunion"], ["Iran"], ["Israel"],
		["Jamaica"], ["Japan"], ["Kwajalein"], ["Libya"], ["MET"],
		["Mexico/BajaNorte"], ["Mexico/BajaSur"], ["Mexico/General"], ["MST"],
		["MST7MDT"], ["Navajo"], ["NZ"], ["NZ-CHAT"], ["Pacific/Apia"],
		["Pacific/Auckland"], ["Pacific/Chatham"], ["Pacific/Easter"],
		["Pacific/Efate"], ["Pacific/Enderbury"], ["Pacific/Fakaofo"],
		["Pacific/Fiji"], ["Pacific/Funafuti"], ["Pacific/Galapagos"],
		["Pacific/Gambier"], ["Pacific/Guadalcanal"], ["Pacific/Guam"],
		["Pacific/Honolulu"], ["Pacific/Johnston"], ["Pacific/Kiritimati"],
		["Pacific/Kosrae"], ["Pacific/Kwajalein"], ["Pacific/Majuro"],
		["Pacific/Marquesas"], ["Pacific/Midway"], ["Pacific/Nauru"],
		["Pacific/Niue"], ["Pacific/Norfolk"], ["Pacific/Noumea"],
		["Pacific/Pago_Pago"], ["Pacific/Palau"], ["Pacific/Pitcairn"],
		["Pacific/Ponape"], ["Pacific/Port_Moresby"], ["Pacific/Rarotonga"],
		["Pacific/Saipan"], ["Pacific/Samoa"], ["Pacific/Tahiti"],
		["Pacific/Tarawa"], ["Pacific/Tongatapu"], ["Pacific/Truk"],
		["Pacific/Wake"], ["Pacific/Wallis"], ["Pacific/Yap"], ["Poland"],
		["Portugal"], ["PRC"], ["PST8PDT"], ["ROC"], ["ROK"], ["Singapore"],
		["Turkey"], ["UCT"], ["Universal"], ["US/Alaska"], ["US/Aleutian"],
		["US/Arizona"], ["US/Central"], ["US/East-Indiana"], ["US/Eastern"],
		["US/Hawaii"], ["US/Indiana-Starke"], ["US/Michigan"], ["US/Mountain"],
		["US/Pacific"], ["US/Pacific-New"], ["US/Samoa"], ["W-SU"], ["WET"],
		["Zulu"]];