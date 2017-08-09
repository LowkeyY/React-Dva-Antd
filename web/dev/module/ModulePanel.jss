Ext.namespace("dev.module");

dev.module.ModulePanel = function(objectId, parentPanel) {
	// alert('----'+terminalType);
	this.params = {};
	this.parentPanel = parentPanel;

	this.frameType = new Ext.form.ComboBox({
				fieldLabel : '框架类别'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['id', 'label'],
							data : [['1', '主窗口'.loc()], ['2', '左右框架'.loc()],
									['3', '上下框架'.loc()], ['4', '左上下框架'.loc()]]
						}),
				name : 'modtype',
				valueField : 'id',
				displayField : 'label',
				triggerAction : 'all',
				width : 160,
				mode : 'local'
			});

	this.frameType.on('select', function(comb) {
				var show = [
						[false, false, false, false],
						[true, true, false, false],
						[false, false, true, true],
						[true, true, true, true],
						['left_width', 'right_width', 'up_height',
								'down_height']];
				var fm = this.MainTabPanel.form;
				var types = comb.getValue() * 1 - 1;
				if (!types)
					types = 0;
				for (var i = 0; i < 4; i++) {
					var field = fm.findField(show[4][i]);
					field.setVisible(show[types][i]);
				}
			}, this);

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
		id : 'modulePanel',
		cached : true,
		labelWidth : 160,
		labelAlign : 'right',
		border : false,
		url : '/dev/module/create.jcp',
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
							name : 'modlogic_name',
							width : 160,
							maxLength : 32,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							allowBlank : false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText : '逻辑名称必须提供.'
						}, this.frameType, {
							xtype : 'numberfield',
							fieldLabel : '左框架宽度'.loc() + '(%)',
							name : 'left_width',
							minValue : 1,
							maxValue : 100,
							value : 20,
							width : 100,
							allowBlank : false,
							blankText : '左框架宽度必须提供.'.loc()
						}, {
							xtype : 'numberfield',
							fieldLabel : '上框架高度'.loc() + '(%)',
							name : 'up_height',
							minValue : 1,
							maxValue : 100,
							value : 40,
							width : 100,
							allowBlank : false,
							blankText : '上框架高度必须提供.'.loc()
						}, {
							xtype : 'selectmenu',
							fieldLabel : '菜单位置'.loc(),
							dataUrl : '/dev/module/SelectMenu.jcp',
							name : 'menu_id',
							height : 100,
							width : 200,
							allowBlank : true,
							system_id : objectId
						}]
			}, {
				columnWidth : 0.55,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							fieldLabel : '物理名称'.loc(),
							name : 'modphy_name',
							style : 'ime-mode:disabled;',
							width : 160,
							maxLength : 32,
							allowBlank : false,
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText : '物理名称必须提供.'.loc()
						}, {
							xtype : 'radiogroup',
							fieldLabel : '顶层缺省引用'.loc(),
							width : 80,
							name : 'top_default',
							items : [{
										boxLabel : '是'.loc(),
										name : 'top_default',
										inputValue : '1'
									}, {
										boxLabel : '否'.loc(),
										name : 'top_default',
										inputValue : '0',
										checked : true
									}]
						}, {
							xtype : 'numberfield',
							fieldLabel : '右框架宽度'.loc() + '(%)',
							name : 'right_width',
							minValue : 1,
							maxValue : 100,
							value : 80,
							width : 100,
							allowBlank : false,
							blankText : '右框架宽度必须提供.'.loc()
						}, {
							xtype : 'numberfield',
							fieldLabel : '下框架高度'.loc() + '(%)',
							name : 'down_height',
							minValue : 1,
							maxValue : 100,
							value : 60,
							width : 100,
							allowBlank : false,
							blankText : '下框架高度必须提供.'.loc()
						}, {
							xtype : 'iconpicker',
							name : 'icon_url',
							defaultImage : "/themes/icon/all/transparent.gif",
							qtip : {
								title : '提示'.loc(),
								dismissDelay : 10000,
								text : '只能选择16x16的图标,需要在程序菜单中显示'.loc()
							},
							fieldLabel : '图标'.loc(),
							width : 24
						}]
			}]
		}, {
			xtype : 'textarea',
			fieldLabel : '说明'.loc(),
			name : 'note',
			width : 500,
			height : 60,
			maxLength : 1000,
			maxLengthText : '系统说明不能超过{0}个字符!'.loc()
		}]
	});
};

dev.module.ModulePanel.prototype = {
	init : function(params, main) { // alert(111+"----"+params["terminalType"]);
		this.params = params;
		this.frameType.setValue('2');// alert(9999);
		if (this.MainTabPanel.rendered) { // alert(8888);
			this.toggleToolBar('create');
			var fm = this.MainTabPanel.form;
			fm.reset();
			if (params["terminalType"] == '0') {
				this.frameType.enable();
				this.frameType.setValue('2');
			} else {
				this.frameType.disable();
				this.frameType.setValue('1');
			}
			fm.findField("menu_id").enable();
			this.frameType.fireEvent("select", this.frameType);
			main.setStatusValue(['模块管理'.loc(), params.parent_id, '无'.loc(),
					'无'.loc(), '无'.loc()]);
		}
	},
	loadData : function(params, main) {// alert(222);
		this.MainTabPanel.form.load({
					method : 'GET',
					params : params,
					scope : this,
					success : function(fm, action) {
						var data = action.result.data;
						this.frameType.fireEvent("select", this.frameType);
						this.frameType.disable();
						this.toggleToolBar('edit');
						main.setStatusValue(['模块管理'.loc(), params.parent_id,
								data.lastModifyName, data.lastModifyTime,
								data.menuPath]);
					},
					failure : function(form, action) {
						Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
										+ action.result.message);
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
				Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立模块定义'.loc());
			} else {
				var saveParams = this.params;
				saveParams['modtype'] = this.MainTabPanel.form
						.findField('modtype').getValue();
				saveParams['type'] = 'save';
				if (frm.isValid()) {
					frm.submit({
								url : '/dev/module/create.jcp',
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
										modtype : frm.findField('modtype')
												.getValue(),
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
			Ext.msg('confirm', '警告:删除模块将不可恢复,确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = {};
					delParams['type'] = 'delete';
					delParams['parent_id'] = this.params['parent_id'];
					frm.submit({
						url : '/dev/module/create.jcp',
						params : delParams,
						method : 'post',
						scope : this,
						success : function(form, action) {
							this.parentPanel.navPanel
									.getTree()
									.loadParentNode(this.parentPanel.navPanel.clickEvent);
						},
						failure : function(form, action) {
							Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
											+ action.result.message);
						}
					});
				}
			}.createDelegate(this));
		}
	}
}
