

dev.dataservice.DataServicePanel = function(frames, params) {
	this.frames = frames;
	var DataService = this.frames.get('DataService');
	DataService.panelKind = "DataService";
	this.params = params;

	var retFn = function(main) {
		main.setActiveTab("DataService");
		main.setStatusValue(['数据服务'.loc()]);
	}.createCallback(DataService.mainPanel)
	// 创建一个Button数组
	var ButtonArray = [];
	// 数组中添加 保存按钮
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));

	
	// 数组中添加 清空按钮
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	
	// 数组中添加 保存按钮
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
	// 数组中添加 删除按钮
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'delete',
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : this.onButtonClick
			}));
			// 数组中添加 IP 认证按钮
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'IPrenzheng',
				text : 'IP认证'.loc(),
				icon : '/themes/icon/xp/axx.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	// 数组中添加 用户认证按钮
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'userenzheng',
				text : '用户认证'.loc(),
				icon : '/themes/icon/xp/workflow.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	// 在工具栏里面创建一个
	this.serviceBtn = new Ext.Toolbar.Button({
				text : '设定数据结构'.loc(),
				icon : '/themes/icon/all/basket_go.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.logic.DataServiceMapping");
					this.params.objectId = this.params.parent_id;
					var isGet = this.DataServiceForm.form
							.findField('interface_type').getValue() == '2';
					DataService.mappingPanel = new dev.logic.DataServiceMapping(
							this.params, retFn, isGet);
					DataService.mainPanel
							.add(DataService.mappingPanel.MainTabPanel);
					DataService.mainPanel
							.setActiveTab(DataService.mappingPanel.MainTabPanel);
					DataService.mainPanel.setStatusValue(['数据服务'.loc()]);
					DataService.mappingPanel.loadData(this.params,
							DataService.mainPanel);
				}
			});
	ButtonArray.push(this.serviceBtn);
	this.freeFormatButton = new Ext.Toolbar.Button({
				text : '设定自由格式'.loc(),
				icon : '/themes/icon/all/note_edit.gif',
				cls : 'x-btn-text-icon  bmenu',
				state : 'edit',
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.dataservice.DataServiceFormat");
					var panel = new dev.dataservice.DataServiceFormat(
							this.params, retFn);
					var mp = DataService.mainPanel;
					mp.add(panel.MainTabPanel);
					mp.setActiveTab(panel.MainTabPanel);
					mp.setStatusValue(['数据服务'.loc()]);
					panel.loadData(this.params.parent_id);
				}
			});
	
	ButtonArray.push(this.freeFormatButton);
	var interType = new Ext.form.ComboBox({
				fieldLabel : '接口类型'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [["0", "POST"], ["1", "PUT"], ["2", "GET"],
									["3", "DELETE"]]
						}),
				valueField : 'value',
				hidden : true,
				displayField : 'text',
				triggerAction : 'all',
				width : 200,
				value : '2',
				mode : 'local',
				hiddenName : 'interface_type'
			});
	this.dataPattern = new Ext.form.ComboBox({
				xtype : 'combo',
				fieldLabel : '数据格式'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [["0", "JSON"], ["1", "XML"],
									["2", '自由格式'.loc()]]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				value : '1',
				width : 200,
				mode : 'local',
				hiddenName : 'data_pattern'
			});

	this.selectTable = new lib.ComboRemote.ComboRemote({
				hidden : true,
				fieldLabel : '选择数据表'.loc(),
				store : new Ext.data.JsonStore({
							url : '/dev/dataservice/properties.jcp',
							autoLoad : false,
							root : 'items',
							fields : ["text", "value"],
							baseParams : {
								type : 'table',
								r : Math.random(),
								objectId : -1
							}
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				width : 200,
				mode : 'remote',
				hiddenName : 'css_table'
			});

	var className = new Ext.form.TextField({
				xtype : 'textfield',
				width : 650,
				labelWidth : 60,
				hidden : true,
				fieldLabel : '类名(全名)'.loc(),
				name : 'className',
				maxLength : 600,
				allowBlank : true,
				maxLengthText : '不能超过{0}个字符!'.loc()
			});
	var serviceMethod = new Ext.form.CheckboxGroup({
				fieldLabel : '数据服务方法'.loc(),
				width : 500,
				name : 'service_method',
				columns : 3,
				items : [{
							boxLabel : '插入数据',
							name : 'insert'
						}, {
							boxLabel : '更新数据',
							name : 'update'
						}, {
							boxLabel : '删除数据',
							name : 'delete'
						}, {
							boxLabel : '批量插入',
							name : 'batchinsert'
						}, {
							boxLabel : '批量更新',
							name : 'batchupdate'
						}, {
							boxLabel : '批量删除',
							name : 'batchdelete'
						}]
			});
//原数据类型
	var sourceType = new Ext.form.ComboBox({
		
				xtype : 'combo',
				fieldLabel : '数据提供方式'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [["0", "调用查询"], ["1", "修改数据"],
									["2", '调用java类']]
						}),
				valueField : 'value',
				editable : false,
				displayField : 'text',
				triggerAction : 'all',
				value : '0',
				width : 200,
				mode : 'local',
				hiddenName : 'source_type'
			});
	sourceType.on("select", function(combo, rec, index) {
				this.dataPattern.setVisible(index == 0);
				this.selectTable.setVisible(index == 1);
				serviceMethod.setVisible(index == 1);
				className.setVisible(index == 2);
			}, this);
			// 服务类型
	var serviceType = new Ext.form.RadioGroup({
				fieldLabel : '服务类型'.loc(),
				scope : this,
				width : 200,
				name : 'service_type',
				items : [{
							boxLabel : 'REST',
							name : 'service_type',
							inputValue : 0
						}, {
							boxLabel : 'SOAP',
							name : 'service_type',
							inputValue : 1,
							checked : true
						}]
			})
			
	serviceType.on("change", function(grp, radio) {
				interType.setVisible(radio.inputValue == 0);
			}, this)

	this.DataServiceForm = new Ext.form.FormPanel({
		url : '/dev/dataservice/DataServicePanel.jcp',
		method : 'POST',
		border : false,
		id : 'DataService',
		cached : true,
		labelWidth : 100,
		bodyStyle : 'padding:20px 0px 0px 50px;height:100%;width:100%;background:#FFFFFF;',
		tbar : ButtonArray,
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.50,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							width : 200,
							fieldLabel : '逻辑名称'.loc(),
							name : 'logic_name',
							maxLength : 24,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							allowBlank : false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText : '逻辑名称必须提供.'.loc()
						}]
			}, {
				columnWidth : 0.50,
				layout : 'form',
				border : false,
				items : [{
							xtype : 'textfield',
							width : 200,
							fieldLabel : '物理名称'.loc(),
							name : 'physics_name',
							maxLength : 24,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							allowBlank : false,
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText : '物理名称必须提供.'.loc()
						}]
			}

			]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [serviceType]
					}, {
						columnWidth : 0.50,
						layout : 'form',

						border : false,
						items : [interType]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.50,
				layout : 'form',

				border : false,
				items : [{
					xtype : 'combo',
					fieldLabel : '认证方式'.loc(),
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["0", 'IP认证'.loc()],
										["1", '用户认证'.loc()]]
							}),
					valueField : 'value',
					value : '0',
					displayField : 'text',
					width : 200,
					triggerAction : 'all',
					mode : 'local',
					hiddenName : 'auther_mode'
				}]
			}

			]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [sourceType]
					}, {
						columnWidth : 0.50,
						layout : 'form',

						border : false,
						items : [this.dataPattern, this.selectTable]
					}

			]
		}, serviceMethod, className, {
			xtype : 'textarea',
			width : 650,
			height : 300,
			labelWidth : 60,
			fieldLabel : '说明'.loc(),
			name : 'explantion',
			maxLength : 4000,
			allowBlank : true,
			maxLengthText : '不能超过{0}个字符!'.loc(),
			blankText : '必须提供.'.loc()
		}]
	});

	this.MainTabPanel = this.DataServiceForm;
};

dev.dataservice.DataServicePanel.prototype = {
	init : function(params) {
		this.setObjectId(params.parent_id);
		if (this.MainTabPanel.rendered) {
			this.frames.get("DataService").mainPanel.setStatusValue([
					'数据服务'.loc(), params.parent_id, '无'.loc(), '无'.loc(),
					'无'.loc()]);
		}
	},
	setObjectId : function(objectId) {
		this.selectTable.store.baseParams.objectId = objectId;
	},
	newDataService : function(params) {
		this.params = params;
		this.setObjectId(params.parent_id);

		var form = this.DataServiceForm.form;
		form.reset();
		form.findField('source_type').fireEvent("select", null, null, 0);
		form.findField('interface_type').enable();
		this.dataPattern.enable();
		form.findField('auther_mode').enable();
		this.toggleToolBar('create');
	},
	loadData : function(params) {
		this.params.parent_id = params.parent_id;
		this.setObjectId(params.parent_id);
		var cself = this;
		this.DataServiceForm.load({
					params : params,
					method : 'GET',
					scope : this,
					url : '/dev/dataservice/DataServicePanel.jcp?parent_id='
							+ params.parent_id + "&rand=" + Math.random(),
					success : function(form, action) {
						var data = action.result.data;
						cself.toggleToolBar('edit');

						var sourceType = form.findField('source_type');
						sourceType.setValue(data.source_type);
						sourceType.fireEvent("select", null, null,
								data.source_type);
						var m = data.source_type * 1;
						if (m == 1) {
							form.findField('css_table')
									.setValue(data.source_object);
							var vv = {};
							Ext.each(data.service_method.split(","), function(
											pv) {
										vv[pv] = true;
									});
							form.findField('service_method').setValue(vv);
						} else {
							form.findField('className')
									.setValue(data.source_object);
						}

						var interType = form.findField('interface_type');
						interType.disable();
						interType.setVisible(data.service_type == "0");

						this.dataPattern.disable();

						this.freeFormatButton
								.setVisible(data.data_pattern == '2');
						this.serviceBtn.setVisible(data.data_pattern != '2');

						form.findField('auther_mode').disable();
						form.findField('auther_mode').fireEvent("select");

						this.frames.get('DataService').mainPanel
								.setStatusValue(['数据服务'.loc(), data.object_id,
										data.lastModifyName,
										data.lastModifyTime, data.url]);
					}
				});
	},
	toggleToolBar : function(state) {
		var tempToolBar = this.DataServiceForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state)
						item.show();
				}, tempToolBar.items);
	},
	onButtonClick : function(item) {
		var DataService = this.frames.get('DataService');
		var frm = this.DataServiceForm.form;
		DataService = this.frames.get('DataService');
		if (item.btnId == 'clear') {
			frm.reset();
		} else if (item.btnId == 'save') {
			if (frm.isValid()) {
				var saveParams = this.params;
				saveParams['type'] = 'save';
				frm.submit({
							url : '/dev/dataservice/DataServicePanel.jcp',
							params : saveParams,
							method : 'POST',
							scope : this,
							success : function(form, action) {
								DataService.navPanel.getTree().loadSubNode(
										action.result.id,
										DataService.navPanel.clickEvent);
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'updatesave') {
			var saveParams = this.params;
			saveParams['type'] = 'updatesave';
			if (frm.isValid()) {
				saveParams['auther_mode'] = frm.findField('auther_mode')
						.getValue();
				saveParams['data_pattern'] = frm.findField('data_pattern')
						.getValue();
				saveParams['interface_type'] = frm.findField('interface_type')
						.getValue();
				frm.submit({
							url : '/dev/dataservice/DataServicePanel.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								DataService.navPanel.getTree().loadSelfNode(
										action.result.id,
										DataService.navPanel.clickEvent);
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
			Ext.msg('confirm', '警告:删除任务将不可恢复,确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = this.params;
					delParams['type'] = 'delete';
					delParams['parent_id'] = this.params.parent_id;
					frm.submit({
						url : '/dev/dataservice/DataServicePanel.jcp',
						params : delParams,
						method : 'POST',
						scope : this,
						success : function(form, action) {
							DataService.navPanel
									.getTree()
									.loadParentNode(DataService.navPanel.clickEvent);
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
};
