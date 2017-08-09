home.system.help.HelpPanel = function(frames, params) {
	this.params = params;
	Ext.form.Field.prototype.msgTarget = 'side';
	this.frames = frames;

	this.ButtonArray = [];

	this.ButtonArray.push(new Ext.Toolbar.Button({
		id : 'save',
		text : '保存'.loc(),
		icon : '/themes/icon/common/save.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		state : 'create',
		scope : this,
		hidden : false,
		handler : function() {
			if (this.params['parent_id'] == null) {
				Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立目录定义'.loc());
			} else {
				var saveParams = this.params;
				saveParams['type'] = 'save';
				saveParams['forder_detail'] = this.frm
						.findField("forder_detail").getValue();
				if (this.frm.isValid()) {
					this.frm.submit({
						url : '/home/system/help/categorycreate.jcp',
						params : saveParams,
						method : 'post',
						scope : this,
						success : function(form, action) {
							Help.navPanel.getTree().loadSubNode(
									action.result.id, Help.navPanel.clickEvent);
						},
						failure : function(form, action) {
							Ext.msg("error", '数据提交失败!,原因'.loc()+':<br>'
											+ action.result.message);
						}
					});
				} else {
					Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}
		}
	}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				id : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : function() {
					this.frm.reset();
				}
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				id : 'new',
				text : '新建目录'.loc(),
				icon : '/themes/icon/xp/new.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : function() {
					Help.mainPanel.items.each(function(item) {
								Help.mainPanel.remove(item);
							}, Help.mainPanel.items);
					Help.helpPanel = new home.system.help.HelpPanel(
							this.frames, this.params);
					Help.mainPanel.add(Help.helpPanel.MainTabPanel);
					Help.Frame.doLayout();

				}
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				id : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : function() {
					var saveParams = this.baseParams;
					saveParams['type'] = 'updatesave';
					saveParams['forder_detail'] = this.frm
							.findField("forder_detail").getValue();
					if (this.frm.isValid()) {
						this.frm.submit({
									url : '/home/system/help/categorycreate.jcp',
									params : saveParams,
									method : 'post',
									scope : this,
									success : function(form, action) {
										Help.navPanel.getTree().loadSelfNode(
												action.result.id,
												Help.navPanel.clickEvent);
										Ext.msg('info', '完成图表信息更新!'.loc());
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'数据提交失败!,原因'.loc()+':<br>'
																+ action.result.message);
									}
								});
					} else {
						Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
					}
				}
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				id : 'editCurve',
				text : '发布'.loc(),
				icon : '/themes/icon/common/upfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'edit',
				scope : this,
				hidden : true,
				handler : function() {
					Help.mainPanel.items.each(function(item) {
								Help.mainPanel.remove(item);
							}, Help.mainPanel.items);
					Help.helpPanel = new home.system.help.HelpPublishPanel(
							this.frames, this.params, this.frm
									.findField("newpart").getValue());
					Help.mainPanel.add(Help.helpPanel.MainTabPanel);
					Help.Frame.doLayout();
				}
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
		id : 'addHelp',
		text : '添加帮助'.loc(),
		icon : '/themes/icon/common/add.png',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		state : 'edit',
		scope : this,
		hidden : true,
		handler : function() {
			loadcss("lib.multiselect.Multiselect");
			using("lib.multiselect.Multiselect");
			var addHelpPanel = new Ext.form.FormPanel({
				bodyStyle : 'padding:10px;',
				layout : 'fit',
				items : [{
							xtype : 'itemselector',
							dataFields : ["text", "value", 'selected'],
							hideLabel : true,
							layout : 'fit',
							//width : 600,
							//height : 450,
							msWidth : 225,
							fromData : [],
							toData : [],
							msHeight : 350,
							bodyStyle : "padding:30px 0 0 50px;overflow-y:auto; height: 400px; width: 550px;",
							valueField : "value",
							displayField : "text",
							imagePath : "/lib/multiselect",
							toLegend : '已选值'.loc(),
							fromStore : new Ext.data.SimpleStore({
										autoLoad : true,
										url : "/home/system/help/helpData.jcp",
										method : 'get',
										root : 'data',
										fields : ['text', 'value', 'selected']
									}),
							fromLegend : '可选值'.loc()
						}]
			});
			var showWin = new Ext.Window({
				width : 600,
				height : 500,
				icon : '/themes/icon/all/book_open.gif',
				autoScroll : false,
				layout : 'fit',
				modal : true,
				title : '帮助'.loc(),
				tbar : [new Ext.Toolbar.Button({
					id : 'save',
					text : '保存'.loc(),
					icon : '/themes/icon/xp/save.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					scope : this,
					handler : function() {
						var it = addHelpPanel.getComponent(0);
						var storeValue = new Array();
						var recf = it.toStore.getRange(0);
						for (i = 0; i < recf.length; i++) {
							storeValue.push(recf[i].data.value);
						};
						if (storeValue.length == 0) {
							Ext.msg("warn", '请选择需要添加的帮助!'.loc());
						} else {
							Ext.Ajax.request({
								url : '/home/system/help/helpAddPId.jcp',
								method : 'Post',
								params : {
									parent_id : this.params.parent_id,
									object_id : storeValue.join(",")
								},
								scope : this,
								callback : function(options, success, response) {
									Ext.msg("info", '数据更新成功!'.loc());
									showWin.close();
									Help.navPanel.getTree().loadSelfNode(this.params.parent_id,Help.navPanel.clickEvent);
								},
								failure : function(form, action) {
									Ext.msg("warn", '未保存成功,请查证!'.loc());
								}
							})

						}
					}
				})],
				items : addHelpPanel
			});
			showWin.show();
		}
	}));
	this.delBar = new Ext.Toolbar.Button({
		id : 'delete',
		text : '删除'.loc(),
		icon : '/themes/icon/common/delete.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		state : 'edit',
		scope : this,
		handler : function() {
			Ext.msg('confirm', '警告:删除帮助将不可恢复,确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = this.params;
					delParams['type'] = 'delete';
					this.frm.submit({
								url : '/home/system/help/categorycreate.jcp',
								params : delParams,
								method : 'post',
								scope : this,
								success : function(form, action) {
									Help.navPanel
											.getTree()
											.loadParentNode(Help.navPanel.clickEvent);
								},
								failure : function(form, action) {
									Ext.msg("error", '数据提交失败!,原因'.loc()+':<br>'
													+ action.result.message);
								}
							});
				}
			}.createDelegate(this));
		}
	});
	this.ButtonArray.push(this.delBar);

	this.helpForm = new Ext.form.FormPanel({
		title : '帮助目录'.loc(),
		labelAlign : 'right',
		url : '/home/system/help/categorycreate.jcp',
		method : 'POST',
		border : false,
		height : 600,
		autoScroll : false,
		bodyStyle : 'padding:10px 0px 0px 0px;background:#FFFFFF;',
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 1.0,
				layout : 'form',

				border : false,
				items : [{
							xtype : 'textfield',
							fieldLabel : '名称'.loc(),
							name : 'forder_name',

							width : 300,
							maxLength : 100,
							allowBlank : false,
							maxLengthText : '图表名称不能超过{0}个字符!'.loc(),
							blankText : '图标名称必须填写.'.loc()
						}, new lib.FCKeditor.ExtFckeditor({
							name : 'forder_detail',
							id : 'forder_detail',
							height : 600,
							hideLabel : true,
							allowBlank : false,
							BasePath : '/lib/FCKeditor/editor/',
							PluginsPath : '/lib/FCKeditor/editor/plugins/',
							blankText : '必须输入报告模板文档'.loc(),
							ToolbarSet : "help",
							SkinPath : '/lib/FCKeditor/editor/skins/office2003/'
						}), {
							xtype : 'hidden',
							name : 'newpart'
						}, {
							xtype : 'hidden',
							name : 'delName'
						}]
			}]
		}],
		tbar : this.ButtonArray
	});

	this.MainTabPanel = new Ext.TabPanel({
				id : 'metaTablePanel',
				border : false,
				activeTab : 0,
				tabPosition : 'bottom',
				items : [this.helpForm]
			});
	this.frm = this.helpForm.form;
	this.baseParams = false;
	this.helpForm.on("actioncomplete", function(fm, act) {
				if (act.type != "load")
					return;
				var del = this.helpForm.form.findField("delName").getValue();
				if (del == 'true') {
					this.delBar.hide();
				} else if (del == 'false') {
					this.delBar.show();
				}
			}, this);

};

Ext.extend(home.system.help.HelpPanel, Ext.Panel, {
			init : function(params) {
				this.params = params;
				this.toggleToolBar('create');
			},
			formEdit : function() {
				this.toggleToolBar('edit');
			},
			loadData : function(params) {
				this.baseParams = params;
				this.helpForm.load({
							url : '/home/system/help/categorycreate.jcp?parent_id='
									+ params.parent_id + "&ra=" + Math.random(),
							method : 'get'
						});

			},
			toggleToolBar : function(state) {
				var tempToolBar = this.helpForm.getTopToolbar();
				tempToolBar.items.each(function(item) {
							item.hide();
						}, tempToolBar.items);
				tempToolBar.items.each(function(item) {
							if (item.state == state)
								item.show();
						}, tempToolBar.items);
			}
		});