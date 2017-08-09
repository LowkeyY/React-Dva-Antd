dev.widget.WidgetPanel = function(frames, params) {

	this.params = params;
	this.frames = frames;
	var Widget = this.frames.get("Widget");
	var retFn = function(main) {
		main.setActiveTab("widgetPanel");
		main.setStatusValue(['控件管理'.loc()]);
	}.createCallback(Widget.mainPanel);
	var parentPanel = Widget;
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : function() {
					if (this.params['parent_id'] == null) {
						Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立控件定义'.loc());
					} else {
						var saveParams = this.params;
						saveParams['widgetphy_name'] = this.widgetForm.form
								.findField('widgetphy_name').getValue();
						saveParams['type'] = 'save';
						if (frm.isValid()) {
							frm.submit({
										url : '/dev/widget/create.jcp',
										params : saveParams,
										method : 'post',
										scope : this,
										success : function(form, action) {
											Widget.navPanel
													.getTree()
													.loadSubNode(
															action.result.id,
															Widget.navPanel.clickEvent);
										},
										failure : function(form, action) {
											Ext
													.msg(
															"error",
															'数据提交失败!,原因:'.loc()
																	+ '<br>'
																	+ action.result.message);
										}
									});
						} else {
							Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
						}
					}
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : function() {
					frm.reset();
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : function() {
					var saveParams = this.ds.baseParams;
					saveParams['parent_id'] = this.ds.baseParams['parent_id'];
					saveParams['but2'] = frm.findField("but2").getValue();
					saveParams['but'] = frm.findField("but").getValue();
					saveParams['type'] = 'updatesave';
					if (frm.isValid()) {
						frm.submit({
									url : '/dev/widget/create.jcp',
									params : saveParams,
									method : 'post',
									scope : this,
									success : function(form, action) {
										Widget.navPanel.getTree().loadSelfNode(
												action.result.id,
												Widget.navPanel.clickEvent);
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'数据提交失败!,原因:'.loc()
																+ '<br>'
																+ action.result.message);
									}
								});
					} else {
						Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
					}
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
		text : '删除'.loc(),
		icon : '/themes/icon/xp/delete.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		state : 'edit',
		scope : this,
		hidden : true,
		handler : function() {
			Ext.msg('confirm', '警告:删除控件将不可恢复,确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = {};
					delParams['type'] = 'delete';
					delParams['parent_id'] = this.ds.baseParams['parent_id'];
					frm.submit({
						url : '/dev/widget/create.jcp',
						params : delParams,
						method : 'post',
						scope : this,
						success : function(form, action) {
							Widget.navPanel.getTree()
									.loadParentNode(Widget.navPanel.clickEvent);
						},
						failure : function(form, action) {
							Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
											+ action.result.message);
						}
					});
				}
			}.createDelegate(this));
		}
	}));
	this.Navigation = new Ext.Toolbar.Button({
				text : '导航条设定'.loc(),
				id : 'setNavigation',
				icon : '/themes/icon/common/set.gif',
				state : 'set',
				scope : this,
				hidden : true,
				cls : 'x-btn-text-icon  bmenu',
				handler : function() {
					var pid = 'ProgramTreeDefinePanel';
					var mask = null;
					var mp = Widget.mainPanel;
					if (!mp.havePanel(pid)) {
						mask = new Ext.LoadMask(mp.ownerCt.getEl(), {
									msg : '模块导航设定数据载入中...'.loc(),
									msgCls : 'x-mask-loading'
								});
						mask.show();
	(function			() {
							loadcss("lib.IconPicker.IconPicker");
							loadcss("lib.multiselect.Multiselect");
							using("lib.ListValueField.ListValueField");
							using("lib.IconPicker.IconPicker");
							using("dev.ctrl.TargetPanel");
							using("lib.multiselect.Multiselect");
							using("dev.ctrl.TreeDefine");
							var p = new dev.ctrl.TreeDefine({
										id : pid,
										mp : mp,
										parentType : 'widget',
										hideTargetPanel : true,
										mask : mask,
										cached : true,
										params : this.params
									});
							mp.add(p);
							mp.setActiveTab(pid);
						}).defer(5, this);
					} else {
						mp.getPanel(pid).loadServerData(this.params);
						mp.setActiveTab(pid);
					}
				}
			});
	ButtonArray.push(this.Navigation);
	this.ListInterface = new Ext.Toolbar.Button({
				text : '设置列表界面'.loc(),
				icon : '/themes/icon/common/insert_tab.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'set',
				scope : this,
				hidden : true,
				handler : function() {
					using("dev.ctrl.WidgetListManage");
					using("dev.ctrl.EditableItem");

					this.params['ctrl_type'] = 'widget';
					this.params.retFn = retFn;
					Widget.listPanel = new dev.ctrl.WidgetListManage(this.params);
					Widget.mainPanel.add(Widget.listPanel.MainTabPanel);
					Widget.mainPanel
							.setActiveTab(Widget.listPanel.MainTabPanel);
					Widget.mainPanel.setStatusValue(['设置列表界面'.loc()]);
				}
			});
	ButtonArray.push(this.ListInterface);

	this.extendCondition = new Ext.Toolbar.Button({
				text : '条件扩展'.loc(),
				cls : 'x-btn-text-icon  bmenu',
				icon : '/themes/icon/xp/filter.gif',
				disabled : false,
				state : 'set',
				scope : this,
				hidden : true,
				handler : function() {
					loadcss("lib.RowEditorTree.RowEditorTree");
					using("lib.RowEditorTree.RowEditorTree");
					using("dev.ctrl.ListConditionTree");
					using("dev.ctrl.ListCondition");
					var mp = Widget.mainPanel;
					var p = new dev.ctrl.ListCondition(this.params, "widget",
							mp);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.init(this.params);
				}
			});
	ButtonArray.push(this.extendCondition);

	// [['7','列表控件'],['6','目录列表检索'],['8','选择框控件'],['3','资源占用'],['4','查询列表选择'],['5','查询下拉框选择'],['1','检索控件'],['2','目录检索']]

	this.widgettype = new Ext.form.ComboBox({
				fieldLabel : '控件类型'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['id', 'label'],
							data : [['7', '列表选择控件'.loc()],
									['8', '下拉框控件'.loc()], ['2', '树选择控件'.loc()],
									['9', '复选框控件'.loc()]
							// ,['4','查询列表选择'],['5','查询下拉框选择']
							]
						}),
				editable : false,
				hiddenName : 'but',
				valueField : 'id',
				minLength : 1,
				displayField : 'label',
				allowBlank : false,
				triggerAction : 'all',
				mode : 'local'
			});
	this.widgety = new Ext.Panel({
				border : false,
				layout : 'form',
				items : [new Ext.form.NumberField({
							fieldLabel : '应用位置'.loc() + '(Y)',
							name : 'widget_Y',
							maxValue : 800,
							maxText : '应用位置'.loc() + '(Y)' + '不能大于{0}!'.loc(),
							width : 160
						})]
			});
	this.widgetx = new Ext.Panel({
				border : false,
				layout : 'form',
				items : [new Ext.form.NumberField({
							fieldLabel : '应用位置'.loc() + '(X)',
							name : 'widget_X',
							maxValue : 800,
							maxText : '应用位置'.loc() + '(X)' + '不能大于{0}!'.loc(),
							width : 160
						})]
			});

	this.widgeth = new Ext.Panel({
				border : false,
				layout : 'form',
				items : [new Ext.form.NumberField({
							fieldLabel : '控件高度'.loc(),
							name : 'widget_height',
							maxValue : 800,
							maxText : '控件高度的最大值为{0}'.loc(),
							width : 160
						})]
			});
	this.widgetw = new Ext.Panel({
				border : false,
				layout : 'form',
				items : [new Ext.form.NumberField({
							fieldLabel : '控件宽度'.loc(),
							name : 'widget_width',
							maxValue : 1024,
							maxText : '控件宽度的最大值为{0}'.loc(),
							width : 160
						})]
			});

	this.titleItem = new Ext.Panel({
				border : false,
				layout : 'form',
				items : [new lib.ComboRemote.ComboRemote({
							fieldLabel : '标题项'.loc(),
							store : new Ext.data.JsonStore({
										url : '/dev/widget/selectTab.jcp',
										root : 'items',
										autoLoad : false,
										fields : ["value", "text"],
										baseParams : {
											type : 'title'
										}
									}),
							hiddenName : 'titleItem',
							mode : 'local',
							minLength : 0,
							editable : false,
							valueField : "value",
							displayField : "text",
							triggerAction : 'all'
						})]
			});

	this.orderByItem = new Ext.Panel({
				border : false,
				layout : 'form',
				items : [new lib.ComboRemote.ComboRemote({
							fieldLabel : '排序项'.loc(),
							store : new Ext.data.JsonStore({
										url : '/dev/widget/selectTab.jcp',
										root : 'items',
										autoLoad : false,
										fields : ["value", "text"],
										baseParams : {
											type : 'title'
										}
									}),
							hiddenName : 'orderByItem',
							mode : 'local',
							minLength : 0,
							editable : false,
							valueField : "value",
							displayField : "text",
							triggerAction : 'all'
						})]
			});
	this.orderBy = new Ext.form.ComboBox({
				fieldLabel : '排序类型'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['id', 'label'],
							data : [['ASC', '正序'.loc()], ['DESC', '倒序'.loc()]]
						}),
				editable : false,
				hiddenName : 'orderBy',
				valueField : 'id',
				minLength : 0,
				displayField : 'label',
				value : 'ASC',
				triggerAction : 'all',
				mode : 'local'
			});
	var mainTabParams = {};
	mainTabParams['parent_id'] = this.params['parent_id'];
	mainTabParams['type'] = 'maintable';

	this.mainTab = new lib.ComboRemote.ComboRemote({
				fieldLabel : '选择主表'.loc(),
				store : new Ext.data.JsonStore({
							url : '/dev/widget/selectTab.jcp',
							root : 'items',
							mode : 'remote',
							baseParams : mainTabParams,
							fields : ["tabID", "tab"]
						}),
				hiddenName : 'but2',
				minLength : 0,
				mode : 'remote',
				editable : false,
				valueField : 'tabID',
				displayField : 'tab',
				triggerAction : 'all'
			});
	this.widgetForm = new Ext.form.FormPanel({
		labelWidth : 160,
		labelAlign : 'right',
		cached : true,
		id : 'widgetPanel',
		url : '/dev/widget/create.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 0.4,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '逻辑名称'.loc(),
							name : 'widgetlogic_name',
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '逻辑名称中不应有'.loc() + '&、<、>、\"、'
									+ '字符'.loc(),
							width : 160,
							maxLength : 32,
							allowBlank : false,
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText : '逻辑名称必须提供.'.loc()
						})]
			}, {
				columnWidth : 0.6,
				layout : 'form',

				border : false,
				items : [new Ext.form.TextField({
							fieldLabel : '物理名称'.loc(),
							name : 'widgetphy_name',

							width : 160,
							maxLength : 32,
							allowBlank : false,
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText : '物理名称必须提供.'.loc()
						})]
			}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.0,
						layout : 'form',

						border : false,
						items : [this.widgettype]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.4,
						layout : 'form',

						border : false,
						items : [this.widgetw]
					}, {
						columnWidth : 0.6,
						layout : 'form',

						border : false,
						items : [this.widgeth]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.4,
						layout : 'form',

						border : false,
						items : [this.widgetx]
					}, {
						columnWidth : 0.6,
						layout : 'form',

						border : false,
						items : [this.widgety]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.4,
						layout : 'form',

						border : false,
						items : [this.mainTab]
					}, {
						columnWidth : 0.6,
						layout : 'form',
						border : false,
						items : [this.titleItem]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.4,
						layout : 'form',
						border : false,
						items : [this.orderByItem]
					}, {
						columnWidth : 0.6,
						layout : 'form',
						border : false,
						items : [this.orderBy]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.0,
						layout : 'form',
						border : false,
						items : [this.exportColumn = new lib.multiselect.ItemSelector(
								{
									name : "exportitem",
									hidden : false,
									fieldLabel : '导出项'.loc(),
									dataFields : ["value", "text"],
									fromData : [],
									toData : [],
									fromStore : new Ext.data.JsonStore({
												url : '/dev/widget/selectTab.jcp',
												root : 'items',
												autoLoad : false,
												fields : ["value", "text"],
												baseParams : {
													type : 'export'
												}
											}),
									drawTopIcon : false,
									drawBotIcon : false,
									msWidth : 230,
									width : 600,
									msHeight : 110,
									valueField : "value",
									displayField : "text",
									imagePath : "/lib/multiselect",
									toLegend : '已选项'.loc(),
									fromLegend : '可选项'.loc()
								})]
					}]
		}],
		tbar : ButtonArray
	});

	this.ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/dev/widget/create.jcp',
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({}, ["widgetlogic_name",
								"widgetphy_name", "but", "widget_width",
								"widget_height", "widget_X", "widget_Y",
								"but2", "but4", "importitem", "exportitem",
								"titleItem", "orderByItem", "orderBy",
								"parent_id", "object_id", "lastModifyTime",
								"lastModifyName"]),
				remoteSort : false
			});

	this.MainTabPanel = this.widgetForm;

	var frm = this.widgetForm.form;

	this.widgettype.on('select', function() {
				// [['7','列表控件'],['6','目录列表检索'],['8','选择框控件'],['3','资源占用'],['4','单记录录入'],['5','组合录入'],['1','检索控件'],['2','目录检索']]
				// type:3为资源占用,只在控件类型里面把“资源占用”,"检索控件","目录列表检索"取消了,代码还在

				if (this.widgettype.oldValue == this.widgettype.getValue()) {
					return;
				}
				this.widgettype.oldValue = this.widgettype.getValue();
				var types = this.widgettype.getValue();
				/* 不同的控件类型拥有不同的页面text */
				this.widgetw.setVisible(types == 0 || types == 1 || types == 2
						|| types == 4 || types == 6 || types == 9 || types == 3
						|| types == 5 || types == 7 || types == 8);
				this.widgeth.setVisible(types == 0 || types == 1 || types == 2
						|| types == 4 || types == 6 || types == 3 || types == 5
						|| types == 7);
				this.widgetx.setVisible(types == 0 || types == 1 || types == 2
						|| types == 4 || types == 6 || types == 3 || types == 5
						|| types == 7);
				this.widgety.setVisible(types == 0 || types == 1 || types == 2
						|| types == 4 || types == 6 || types == 3 || types == 5
						|| types == 7);
				this.exportColumn.setVisible(types == 8 || types == 9);
				this.titleItem.setVisible(types == 8 || types == 9);
				this.orderByItem.setVisible(types == 8 || types == 9);
				this.orderBy.setVisible(types == 8 || types == 9);
			}, this);
	this.mainTab.on('select', function(comb, rec) {

				if (this.mainTab.oldValue == this.mainTab.getValue()) {
					return;
				}
				this.mainTab.oldValue = this.mainTab.getValue();

				var types = this.widgettype.getValue();
				var mainTableId = this.mainTab.getValue();
				if (types == 8 || types == 9) {
					var titleDS = frm.findField('titleItem');
					titleDS.store.load({
								params : {
									type : 'title',
									object_id : mainTableId
								}
							});
					if (typeof(rec) != 'undefined') {
						titleDS.setValue("");
					}
					var orderDS = frm.findField('orderByItem');
					orderDS.store.load({
								params : {
									type : 'title',
									object_id : mainTableId
								}
							});
					if (typeof(rec) != 'undefined') {
						orderDS.setValue("");
					}

					var exportitem = frm.findField("exportitem");
					exportitem.fromStore.load({
								params : {
									type : 'export',
									object_id : mainTableId
								}
							});
					if (typeof(rec) != 'undefined') {
						exportitem.reset();
					}
				} else if (types == 5) {
					var subTabDS = frm.findField('but4');
					subTabDS.store.load({
								params : {
									parent_id : mainTableId
								}
							});
					if (typeof(rec) != 'undefined') {
						subTabDS.setValue("");
					}
				}
			}, this);

};

dev.widget.WidgetPanel.prototype = {
	init : function(params) {
		this.params = params;
		var store = this.mainTab.store;
		if (store.getCount() > 0) {
			store.baseParams.parent_id = params.parent_id;
			store.reload();
		} else {
			store.baseParams.parent_id = params.parent_id;
			store.load();
		}
		this.toggleToolBar('create');
		this.widgetForm.form.reset();
		this.widgettype.setValue('8');
		this.widgettype.fireEvent('select');
		this.widgettype.enable();
		this.mainTab.enable();
		this.exportColumn.fromStore.removeAll();
		this.frames.get('Widget').mainPanel.setStatusValue(['控件管理'.loc(),
				params.parent_id, "", ""]);
	},
	formEdit : function() {
		this.toggleToolBar('edit');
	},
	loadData : function(params) {
		this.params = params;
		var store = this.mainTab.store;
		if (store.getCount() > 0) {
			store.baseParams.parent_id = params.parent_id;
			store.removeAll();
			store.lastOptions = null;
		}
		this.ds.baseParams = params;
		this.ds.baseParams['type'] = 'edit';
		this.ds.on('load', this.renderForm, this);
		this.ds.load({
					params : {
						start : 0,
						limit : 1
					}
				});
	},
	toggleToolBar : function(state) {
		var tempToolBar = this.widgetForm.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					if (item.state == state)
						item.show();
				}, tempToolBar.items);
	},
	renderForm : function() {
		var fm = this.widgetForm.form;
		var rec = this.ds.getAt(0).data;
		// 不同的控件类型,拥有不同的按钮
		var types = rec.but
		this.Navigation.setVisible(types == 3 || types == 2 || types == 6);
		this.ListInterface.setVisible(types == 7 || types == 6 || types == 1);
		this.extendCondition.setVisible(types == 7 || types == 8);

		// this.SelectFram.setVisible(types==8);//把选择框设定按钮取消了。
		// this.SearchEngine.setVisible(types==1);//取消了
		fm.findField('but2').enable();
		fm.findField('but').setValue(rec.but);
		fm.findField('but').fireEvent("select");

		fm.findField('but2').setValue(rec.but2, true);
		fm.findField('but2').fireEvent("select");

		fm.findField('widgetlogic_name').setValue(rec.widgetlogic_name);
		fm.findField('widgetphy_name').setValue(rec.widgetphy_name);
		fm.findField('widget_width').setValue(rec.widget_width);
		fm.findField('widget_height').setValue(rec.widget_height);
		fm.findField('widget_X').setValue(rec.widget_X);
		fm.findField('widget_Y').setValue(rec.widget_Y);
		fm.findField('orderBy').setValue(rec.orderBy);
		fm.findField('but').disable();
		(function(fm, exp, exp1, exp2) {
			fm.findField('titleItem').setValue(exp1);
			fm.findField('exportitem').setValue(exp);
			fm.findField('orderByItem').setValue(exp2);
		}).defer(500, this,
				[fm, rec.exportitem, rec.titleItem, rec.orderByItem])
		this.frames.get('Widget').mainPanel.setStatusValue(['控件管理'.loc(),
				rec.object_id, rec.lastModifyName, rec.lastModifyTime]);

	}
};
