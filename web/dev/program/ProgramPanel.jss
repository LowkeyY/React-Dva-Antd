Ext.namespace("dev.program");

dev.program.ProgramPanel = function(actType, parentPanel, objectId,
		outterParams) {

	this.params = {};
	/**
	 * outterParams是从外部传递进来的,尽可能把它传到需要的地方,供后来者扩展-tz
	 */
	this.outterParams = outterParams;
	this.actType = actType;
	this.parentPanel = parentPanel;

	this.typeDs = new Ext.data.SimpleStore({
				fields : ['id', 'label'],
				initData : function(o, type) {
					if (!this.inited) {
						var mt = (type && type != "0") ? "m" + o.actType : o.actType;
						this.loadData(o.pData[mt], false);
						this.inited = true;
					}
				},
				data : []
			});
	var programType = new Ext.form.ComboBox({
				fieldLabel : '程序类别'.loc(),
				store : this.typeDs,
				hiddenName : 'prgtype',
				minLength : 1,
				valueField : 'id',
				displayField : 'label',
				triggerAction : 'all',
				mode : 'local',
				width : 160
			});

	programType.on('select', function(combo, rec, index) {
				this.ProgramPropPanel.loadSource(rec.get("id") * 1);
			}, this);

	var mp = parentPanel.mainPanel;
	this.ButtonArray = [{
				optType : 'upd',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				tzType : '0',
				handler : this.saveForm
			}, {
				optType : 'sav',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				state : 'create',
				tzType : '0',
				hidden : false,
				handler : this.saveForm
			}, {
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				tzType : '0',
				handler : function() {
					Ext.msg("confirm", '是否确定删除此模块?'.loc(), function(answer) {
						if (answer == 'yes') {
							Ext.Ajax.request({
								url : '/dev/program/create.jcp',
								callback : function(options, success, response) {
									parentPanel.navPanel
											.getTree()
											.loadParentNode(this.parentPanel.navPanel.clickEvent);
								},
								method : 'POST',
								scope : this,
								params : {
									acttype : this.actType,
									parent_id : this.params.objectId,
									type : 'delete'
								}
							});
						}
					}.createDelegate(this));

				}
			}, {
				text : '设置录入界面'.loc(),
				icon : '/themes/icon/common/setInsert.gif',
				tzType : ',1,3,6,13,12,21,24,',
				handler : function() {
					using("lib.ComboTree.ComboTree");
					using("lib.RowEditorGrid.RowEditorGrid");
					using("dev.ctrl.InputManage");
					this.params.prgType = this.programForm.form
							.findField("prgtype").getValue();
					var p = new dev.ctrl.InputManage(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : '设置列表界面'.loc(),
				icon : '/themes/icon/common/setList.gif',
				tzType : ',2,3,13,',
				handler : function() {
					using("dev.ctrl.ListManage");
					using("dev.ctrl.TargetPanel");
					using("dev.ctrl.EditableItem");
					var p = new dev.ctrl.ListManage(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : '设置查询条件'.loc(),
				icon : '/themes/icon/all/zoom.gif',
				tzType : ',2,3,13,',
				handler : function() {
					loadcss("lib.RowEditorGrid.ListInput");
					using("lib.RowEditorGrid.RowEditorGrid");
					using("lib.RowEditorGrid.ListInput");
					using("dev.ctrl.SearchColumnPanel");
					using("dev.ctrl.ListSearchManage");

					var p = new dev.ctrl.ListSearchManage(this.params,
							this.params.returnFunction);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : '设置列表界面'.loc(),
				icon : '/themes/icon/common/setList.gif',
				tzType : ',10,',
				handler : function() {
					using("dev.ctrl.ListQueryManage");
					using("dev.ctrl.TargetPanel");
					using("dev.ctrl.EditableItem");
					var p = new dev.ctrl.ListQueryManage(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : '条件扩展'.loc(),
				icon : '/themes/icon/xp/filter.gif',
				tzType : ',2,3,13,',
				handler : function() {
					loadcss("lib.RowEditorTree.RowEditorTree");
					using("lib.RowEditorTree.RowEditorTree");
					using("dev.ctrl.ListConditionTree");
					using("dev.ctrl.ListCondition");
					var pt = new dev.ctrl.ListCondition(this.params, "program",
							mp);
					mp.add(pt.MainTabPanel);
					mp.setActiveTab(pt.MainTabPanel);
					pt.init(this.params);
				}
			}, {
				text : 'JS扩展'.loc(),
				icon : '/themes/icon/all/script_edit.gif',
				tzType : ',1,2,3,4,5,10,9,11,21,24,13,6,16,',
				handler : function() {
					using("lib.scripteditor.CodeEditor");
					using("dev.ctrl.JsExtend");
					this.params['ctrl_type'] = 'prg';
					var p = new dev.ctrl.JsExtend(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : 'JAVA扩展'.loc(),
				icon : '/themes/icon/all/script_code_red.gif',
				tzType : ',1,2,3,6,10,',
				handler : function() {
					using("lib.scripteditor.CodeEditor");
					using("dev.ctrl.JavaExtend");
					this.params['ctrl_type'] = 'prg';
					var p = new dev.ctrl.JavaExtend({
								outterParam : this.params
							});
					mp.add(p);
					mp.setActiveTab(p);
				}
			}, {
				text : '导航条设定'.loc(),
				icon : '/themes/icon/common/set.gif',
				tzType : ',-999,',
				handler : function() {
					var pid = 'ProgramTreeDefinePanel';
					var mask = null;
					if (!mp.havePanel(pid)) {
						mask = new Ext.LoadMask(mp.ownerCt.getEl(), {
									msg : '模块导航设定数据载入中...'.loc(),
									msgCls : 'x-mask-loading'
								});
						mask.show();
						(function() {
							using("lib.ListValueField.ListValueField");
							loadcss("lib.IconPicker.IconPicker");
							using("lib.IconPicker.IconPicker");
							using("dev.ctrl.TargetPanel");

							loadcss("lib.multiselect.Multiselect");
							using("lib.multiselect.Multiselect");

							using("dev.ctrl.TreeDefineOld");
							using("dev.ctrl.TreeSubOld");
							var loader = new dev.ctrl.TreeDefineLoader(pid);
							loader.loadServerData(this.params);
							var p = new dev.ctrl.TreeDefine({
										id : pid,
										mp : mp,
										cached : true,
										params : this.params
									});
							loader.setTreeDefine(p);
							mp.add(p);
							mp.setActiveTab(pid);
							mask.hide()
						}).defer(5, this);
					} else {
						mp.getPanel(pid).getLoader()
								.loadServerData(this.params);
						mp.setActiveTab(pid);
					}
				}
			}, {
				text : '导航条设定'.loc(),
				icon : '/themes/icon/common/set.gif',
				tzType : ',4,',
				handler : function() {
					var pid = 'ProgramTreeDefinePanel';
					var mask = null;
					if (!mp.havePanel(pid)) {
						mask = new Ext.LoadMask(mp.ownerCt.getEl(), {
									msg : '模块导航设定数据载入中...'.loc(),
									msgCls : 'x-mask-loading'
								});
						mask.show();
						(function() {
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
			}, {
				text : '设置从表录入界面'.loc(),
				icon : '/themes/icon/common/setInsert.gif',
				tzType : ',6,',
				handler : function() {
					using("lib.ComboTree.ComboTree");
					using("lib.RowEditorGrid.RowEditorGrid");
					using("dev.ctrl.InputManage");

					var cparams = Ext.apply({
								subFlag : true
							}, this.params);
					var p = new dev.ctrl.InputManage(cparams);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : '编写存储过程'.loc(),
				icon : '/themes/icon/all/script_gear.gif',
				tzType : '1',
				handler : function(btn) {
					using("dev.logic.storedProcedure");
					var p = new dev.logic.storedProcedure(this.params.returnFunction);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设定数据服务参数'.loc(),
				icon : '/themes/icon/all/basket_edit.gif',
				tzType : '4',
				handler : function(btn) {
					using("dev.logic.DataServiceParam");
					var name = this.programForm.form.findField("prglogic_name")
							.getValue();
					var panel = dev.logic.DataServiceParam(this.params,
							this.params.returnFunction, name);
					mp.add(panel);
					mp.setActiveTab(panel);
					mp.setStatusValue(['设定数据服务参数'.loc()]);
					panel.loadData(this.params);
				}
			}, {
				text : '设定数据结构'.loc(),
				icon : '/themes/icon/all/basket_go.gif',
				tzType : '4',
				handler : function(btn) {
					using("dev.logic.DataServiceMapping");
					Ext.Ajax.request({
								url : '/dev/logic/DataServiceParam.jcp',
								method : 'GET',
								scope : this,
								params : {
									objectId : this.params.objectId
								},
								success : function(response) {
									var ret = Ext.decode(response.responseText);
									if (ret.success) {
										if (typeof(ret.data) == 'object') {
											var p = new dev.logic.DataServiceMapping(
													this.params,
													this.params.returnFunction,
													ret.data.interface_type != "2");
											mp.add(p.MainTabPanel);
											mp.setActiveTab(p.MainTabPanel);
											mp.setStatusValue(['设定数据结构'.loc()]);
											p.loadData(this.params, mp);
										} else {
											Ext.msg("warn", '请先设定数据服务参数'.loc());
										}
									}
								},
								failure : function() {
								}
							});
				}
			}, {
				text : '编写Beanshell'.loc(),
				icon : '/themes/icon/all/script_code.gif',
				tzType : '2',
				handler : function(btn) {
					using("dev.logic.beanshell");
					var p = new dev.logic.beanshell(this.params.returnFunction);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设定表查询映射'.loc(),
				icon : '/themes/icon/all/table_relationship.gif',
				tzType : '5',
				handler : function() {
					using("dev.logic.migrate");
					var p = new dev.logic.migrate(this.params,
							this.params.returnFunction);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设定表查询映射'.loc(),
				icon : '/themes/icon/all/table_relationship.gif',
				tzType : '3',
				handler : function() {
					using("dev.logic.migrate");
					var p = new dev.logic.migrate(this.params,
							this.params.returnFunction);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设定消息模版'.loc(),
				icon : '/themes/icon/xp/page.gif',
				tzType : '6',
				handler : function() {
					using("dev.logic.notifyTemplate");
					var p = new dev.logic.notifyTemplate(this.params,
							this.params.returnFunction, this.actType);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设定搜索引擎'.loc(),
				icon : '/themes/icon/all/page_find.gif',
				tzType : '7',
				handler : function() {
					loadcss("lib.multiselect.Multiselect");
					using("lib.multiselect.Multiselect");
					using("dev.logic.searchIndex");
					this.params.type = 'program';
					var p = new dev.logic.searchIndex(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设置按钮'.loc(),
				icon : '/themes/icon/common/set.gif',
				tzType : ',1,2,3,5,6,9,10,11,13,14,12,17,19,21,24,26,27,',
				handler : function() {
					loadcss("dev.ctrl.ButtonManage");
					using("dev.ctrl.ButtonManage");
					using("lib.ListValueField.ListValueField");
					loadcss("lib.IconPicker.IconPicker");
					using("lib.IconPicker.IconPicker");
					using("dev.ctrl.TargetPanel");
					this.params.prgType = this.programForm.form
							.findField("prgtype").getValue();
					var fn = function() {
						var p = new dev.ctrl.ButtonManage(this.params,
								this.outterParams);
						mp.add(p.MainTabPanel);
						mp.setActiveTab(p.MainTabPanel);
						p.init();
					}.createDelegate(this);
					if (!this.params.view) {
						Ext.Ajax.request({
									url : '/dev/ctrl/TargetPanel.jcp',
									params : {
										objectId : this.params.parent_id
									},
									method : 'GET',
									scope : this,
									callback : function(options, success,
											response) {
										var o = response.responseText;
										if (success && o != "") {
											this.params.view = response.responseText;
											fn();
										} else {
											Ext.msg("error", '取回当前模块框架类型错误.请核实'
															.loc());
										}
									}
								});
					} else
						fn();

				}
			}, {
				text : '程序目录设定'.loc(),
				icon : '/themes/icon/common/set.gif',
				tzType : ',22,',
				handler : function() {
					loadcss("lib.IconPicker.IconPicker");
					using("lib.ListValueField.ListValueField");
					using("lib.IconPicker.IconPicker");
					using("dev.program.ProgramFolder");
					using("dev.program.FolderNavPanel");
					var p = new dev.program.ProgramFolder(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
				}
			}, {
				text : '设置条件参数'.loc(),
				icon : '/themes/icon/common/set.gif',
				tzType : ',26,',
				handler : function() {
					using("dev.ctrl.ConditionColumn");
					var p = new dev.ctrl.ConditionColumn(this.params,
							this.params.returnFunction);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.init(this.params, mp);
				}
			}, {
				text : '设置导出参数'.loc(),
				icon : '/themes/icon/common/set.gif',
				tzType : ',26,',
				handler : function() {
					loadcss("lib.multiselect.Multiselect");
					using("lib.multiselect.Multiselect");
					using("dev.ctrl.ConditionExport");

					var p = new dev.ctrl.ConditionExport(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.loadData(this.params, mp);
				}
			}, {
				text : '设置按钮'.loc() + '(' + '暂不可用'.loc() + ')',
				icon : '/themes/icon/common/set.gif',
				tzType : ',-999,',
				handler : function() {
					loadcss("dev.ctrl.ActionDefine");
					loadcss("lib.IconPicker.IconPicker");
					using("dev.ctrl.ActionDefine");
					using("dev.ctrl.ButtonDefine");
					using("lib.ListValueField.ListValueField");
					using("lib.IconPicker.IconPicker");
					this.params.prgType = this.programForm.form
							.findField("prgtype").getValue();
					var p = new dev.ctrl.ButtonDefine(this.params);
					mp.add(p.MainTabPanel);
					mp.setActiveTab(p.MainTabPanel);
					p.init(this.params);
				}
			}, {
				id : 'copyTo',
				text : '复制'.loc(),
				icon : '/themes/icon/common/plaster.gif',
				tzType : ',1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,21,24,26,',
				hidden : true,
				scope : this,
				handler : function() {
					using("lib.jsvm.MenuTree");
					using("dev.program.copyToWindow");
					using("lib.CachedPanel.CachedPanel");
					var copyToWindow = new dev.program.copyToWindow({
								id : this.params.parent_id
							});
					copyToWindow.show();
					copyToWindow.win.on('close', function() {
						if (copyToWindow.parentId != '') {
							var moveParams = {};
							moveParams['objectId'] = this.params.parent_id;
							moveParams['parent_id'] = copyToWindow.parentId;
							moveParams['acttype'] = copyToWindow.acttype;
							Ext.Ajax.request({
										url : '/dev/program/copyto.jcp',
										params : moveParams,
										method : 'POST',
										scope : this,
										success : function(form, action) {
											Ext.msg("info", '复制成功!'.loc());
										},
										failure : function(form, action) {
											Ext
													.msg(
															"error",
															'用户调动失败!,原因:'.loc()
																	+ '<br>'
																	+ action.result.message);
										}
									});
						}
					}, this)
				}
			}, {
				text : '生成帮助文档'.loc(),
				icon : '/themes/icon/all/application_side_list.gif',
				tzType : ',1,3,6,10,13,12,21,24,2,3,13,',
				handler : function() {

					Ext.Ajax.request({
								url : '/dev/program/createHelper.jcp',
								params : {
									objectId : this.params.parent_id,
									viewType : "edit"
								},
								method : 'GET',
								scope : this,
								callback : function(options, success, response) {
									CPM.Help
											.editHelpWindow(this.params.parent_id);
									Ext.msg("info", '生成成功!'.loc());
								},
								failure : function(form, action) {
								}
							})

				}
			}];
	if (this.actType == 'workflow') {
		this.ButtonArray.push({
					text : '流程参数'.loc(),
					icon : '/themes/icon/xp/tablink.gif',
					tzType : '0',
					handler : function() {
						loadcss("lib.multiselect.Multiselect");
						using("lib.multiselect.Multiselect");
						using("dev.ctrl.WorkflowProperty");

						var p = new dev.ctrl.WorkflowProperty(this.params);
						mp.add(p.MainTabPanel);
						mp.setActiveTab(p.MainTabPanel);
						p.loadData(this.params, mp);
					}
				});
	}

	var btnScope = this;
	Ext.each(this.ButtonArray, function(item) {
				Ext.applyIf(item, {
							state : 'edit',
							hidden : true,
							scope : btnScope,
							cls : 'x-btn-text-icon  bmenu'
						});
			});

	this.programForm = new Ext.FormPanel({
				region : 'center',
				width : 472,
				labelWidth : 160,
				labelAlign : 'right',
				method : 'POST',
				border : false,
				defaultType : "checkbox",
				bodyStyle : 'padding:20px 0px 0px 0px;background:#FFFFFF;',
				items : [{
							xtype : 'textfield',
							fieldLabel : '逻辑名称'.loc(),
							name : 'prglogic_name',
							width : 200,
							maxLength : 64,
							allowBlank : false,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '名称中不应有'.loc() + '&,<,>,\",'
									+ '字符'.loc(),
							maxLengthText : '逻辑名称不能超过{0}个字符!'.loc(),
							blankText : '逻辑名称必须提供.'.loc()
						}, {
							xtype : 'textfield',
							fieldLabel : '物理名称'.loc(),
							name : 'prgphy_name',
							width : 200,
							maxLength : 24,
							allowBlank : false,
							style : 'ime-mode:disabled;',
							maxLengthText : '物理名称不能超过{0}个字符!'.loc(),
							blankText : '物理名称必须提供.'.loc()
						}, programType, {
							fieldLabel : '主程序'.loc(),
							name : 'main_program',
							checked : false
						}, {
							fieldLabel : '引用页面'.loc(),
							name : 'be_linked',
							checked : false
						}, {
							xtype : 'numberfield',
							fieldLabel : '序号'.loc(),
							name : 'seq',
							minValue : 0,
							maxValue : 20000,
							width : 50,
							allowBlank : false,
							allowDecimals : false,
							allowNegative : false,
							minText : '序号最小值不能小于{0}'.loc(),
							maxText : '序号最大值不能大于 {0}'.loc(),
							nanText : '{0} 对于序号是无效数字'.loc()
						}]
			});

	this.ProgramPropPanel = new dev.program.ProgramGrid({
				region : 'east',
				width : 400,
				params : this.params
			});

	this.MainTabPanel = new Ext.Panel({
				id : this.actType + 'ProgramPanel',
				cached : true,
				tbar : this.ButtonArray,
				layout : 'border',
				border : false,
				items : [this.programForm, this.ProgramPropPanel]
			});

};

dev.program.ProgramPanel.prototype = {
	init : function(params, mainPanel) {
		Ext.apply(this.params, params);
		this.typeDs.initData(this, params.terminalType);
		var fm = this.programForm.form;
		var pvalue = (this.actType == 'portlet') ? 10 : 1;
		if (this.programForm.rendered) {
			fm.reset();
			this.toggleToolBar('create');
			var ptype = fm.findField("prgtype");
			ptype.enable();
			ptype.setValue(pvalue);
		}
		if (params.retFn) {
			this.MainTabPanel.getTopToolbar().addButton(new Ext.Toolbar.Button(
					{
						id : 'back',
						text : '返回'.loc(),
						icon : '/themes/icon/xp/undo.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						hidden : false,
						handler : params.retFn
					}));
		}

		this.ProgramPropPanel.loadSource(pvalue);
		this.ProgramPropPanel.state = "new";
		mainPanel.setStatusValue(['程序管理'.loc(), params.parent_id, '无'.loc(),
				'无'.loc(), '']);
	},
	loadData : function(params, mainPanel) {
		Ext.apply(this.params, params);
		this.typeDs.initData(this, params.terminalType);
		this.programForm.form.reset();
		this.programForm.load({
					url : '/dev/program/create.jcp?parent_id='
							+ params.objectId + '&r=' + Math.random(),
					method : 'get',
					scope : this,
					success : function(form, action) {
						var o = action.result.data;
						form.findField("prgtype").disable();
						this.toggleToolBar('edit', o.prgtype, o.task_type);
						mainPanel.setStatusValue(['程序管理'.loc(),
								params.parent_id, o.lastModifyName,
								o.lastModifyTime, '']);
						this.ProgramPropPanel.loadSource(o.prgtype * 1, o);
						this.ProgramPropPanel.state = "edit";
					}
				});
	},
	toggleToolBar : function(state, prgType, subType) {
		if (subType && subType > "7")
			subType = "7";
		var ptype = "," + prgType + ",";
		this.MainTabPanel.getTopToolbar().items.each(function(item) {
			item
					.setVisible(item.state == state
							&& (item.tzType == "0" || item.tzType == subType || item.tzType
									.indexOf(ptype) != -1));
		});
	},
	saveForm : function(btn) {
		var frm = this.programForm.form;
		if (frm.isValid()) {
			var saveParams = Ext.apply({}, {
						acttype : this.actType,
						prgtype : frm.findField("prgtype").getValue(),
						main_program : frm.findField("main_program").getValue(),
						be_linked : frm.findField("be_linked").getValue()
					}, this.params);
			saveParams['type'] = btn.optType;
			saveParams['prgtype'] = frm.findField("prgtype").getValue();
			if (saveParams.main_program == saveParams.be_linked
					&& saveParams.main_program == true) {
				Ext.msg("error", '主程序和引用页面不能同时选中'.loc());
				return false;
			}
			var itab = this.ProgramPropPanel.indexTable;
			var stop = false, itemName = '', itemValue = '';
			this.ProgramPropPanel.getStore().each(function(rec) {
				if (rec.get("value") == "" && !rec.get("name") == '程序目录'.loc()) {
					Ext.msg("error", '属性窗口中'.loc() + '\"' + rec.get("name")
									+ '\"' + '项目必须填写!'.loc());
					stop = true;
				}
				itemName = itab[rec.get("name")];
				if (rec.get("name") == '程序目录'.loc()) {
					itemValue = rec.get("value").value;
				} else {
					itemValue = rec.get("value").value || rec.get("value");
				}
				if (typeof(saveParams[itemName]) == 'undefined') {
					saveParams[itemName] = itemValue;
				} else if (Ext.isArray(saveParams[itemName])) {
					saveParams[itemName].push(itemValue);
				} else {
					saveParams[itemName] = [saveParams[itemName], itemValue];
				}
			});
			if (stop)
				return false;

			frm.submit({
						url : '/dev/program/create.jcp',
						params : saveParams,
						method : 'POST',
						scope : this,
						success : function(form, action) {
							var tree = this.parentPanel.navPanel.getTree();
							Ext.msg("info", '保存成功!'.loc());
							if (saveParams.type == 'sav') {
								tree.loadSubNode(action.result.id,
										this.parentPanel.navPanel.clickEvent);
							} else
								tree.loadSelfNode(action.result.id,
										this.parentPanel.navPanel.clickEvent);
						},
						failure : function(form, action) {
							Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
											+ action.result.message);
						}
					});
		}
	},
	pData : {
		"program" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['3', '列表录入'.loc()], ['4', '导航页面'.loc()], ['5', '统计图页面'.loc()],
				['6', '级联页面'.loc()], ['7', '框架页面'.loc()], ['8', '业务逻辑'.loc()],
				['9', '单记录查询'.loc()], ['10', '列表查询'.loc()],
				['11', '外挂程序'.loc()], ['12', '选择录入管理'.loc()],
				['13', '交叉录入管理'.loc()], ['14', '报表'.loc()], ['15', '地图'.loc()],
				['16', '决策仪表盘'.loc()], ['17', '应用集成'.loc()],
				['18', '报告'.loc()], ['19', '搜索引擎'.loc()], ['20', '链接引用'.loc()],
				['21', '主题录入'.loc()], ['22', '程序导航'.loc()],
				['24', '批量更新'.loc()], ['26', '组合条件'.loc()],
				['27', '数据整改'.loc()]],
		"Quality" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['3', '列表录入'.loc()], ['8', '业务逻辑'.loc()], ['11', '外挂程序'.loc()]],
		"mprogram" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['5', '统计图页面'.loc()], ['8', '业务逻辑'.loc()],
				['9', '单记录查询'.loc()], ['10', '列表查询'.loc()],
				['11', '外挂程序'.loc()], ['15', '地图'.loc()],
				['16', '决策仪表盘'.loc()], ['20', '链接引用'.loc()],
				['21', '主题录入'.loc()], ['24', '批量更新'.loc()]],
		"workflow" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['3', '列表录入'.loc()], ['6', '级联页面'.loc()], ['7', '框架页面'.loc()],
				['8', '业务逻辑'.loc()], ['13', '交叉录入管理'.loc()]],
		"portlet" : [['5', '统计图页面'.loc()], ['9', '单记录查询'.loc()],
				['10', '列表查询'.loc()], ['11', '外挂程序'.loc()]],
		"Gis" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['3', '列表录入'.loc()], ['5', '统计图页面'.loc()], ['6', '级联页面'.loc()],
				['7', '框架页面'.loc()], ['8', '业务逻辑'.loc()], ['9', '单记录查询'.loc()],
				['10', '列表查询'.loc()], ['11', '外挂程序'.loc()],
				['12', '选择录入管理'.loc()], ['13', '交叉录入管理'.loc()],
				['14', '报表'.loc()], ['15', '地图'.loc()], ['18', '报告'.loc()],
				['20', '链接引用'.loc()], ['21', '主题录入'.loc()],
				['24', '批量更新'.loc()]],
		"mworkflow" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['8', '业务逻辑'.loc()]],
		"mportlet" : [['5', '统计图页面'.loc()], ['9', '单记录查询'.loc()],
				['10', '列表查询'.loc()], ['11', '外挂程序'.loc()]],
		"mGis" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['5', '统计图页面'.loc()], ['8', '业务逻辑'.loc()],
				['9', '单记录查询'.loc()], ['10', '列表查询'.loc()],
				['11', '外挂程序'.loc()], ['15', '地图'.loc()], ['20', '链接引用'.loc()],
				['21', '主题录入'.loc()], ['24', '批量更新'.loc()]],
		"mGisEdit" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['5', '统计图页面'.loc()], ['8', '业务逻辑'.loc()],
				['9', '单记录查询'.loc()], ['10', '列表查询'.loc()],
				['11', '外挂程序'.loc()], ['20', '链接引用'.loc()],
				['21', '主题录入'.loc()], ['24', '批量更新'.loc()]],
		"GisEdit" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['3', '列表录入'.loc()], ['5', '统计图页面'.loc()], ['6', '级联页面'.loc()],
				['7', '框架页面'.loc()], ['8', '业务逻辑'.loc()], ['9', '单记录查询'.loc()],
				['10', '列表查询'.loc()], ['11', '外挂程序'.loc()],
				['12', '选择录入管理'.loc()], ['13', '交叉录入管理'.loc()],
				['14', '报表'.loc()], ['15', '地图'.loc()], ['20', '链接引用'.loc()],
				['21', '主题录入'.loc()], ['24', '批量更新'.loc()]],
		"Search" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['3', '列表录入'.loc()], ['5', '统计图页面'.loc()], ['6', '级联页面'.loc()],
				['7', '框架页面'.loc()], ['8', '业务逻辑'.loc()], ['9', '单记录查询'.loc()],
				['10', '列表查询'.loc()], ['11', '外挂程序'.loc()],
				['12', '选择录入管理'.loc()], ['13', '交叉录入管理'.loc()],
				['14', '报表'.loc()], ['15', '地图'.loc()], ['18', '报告'.loc()],
				['20', '链接引用'.loc()], ['21', '主题录入'.loc()],
				['24', '批量更新'.loc()]],
		"mSearch" : [['1', '单记录页面'.loc()], ['2', '列表页面'.loc()],
				['5', '统计图页面'.loc()], ['8', '业务逻辑'.loc()],
				['9', '单记录查询'.loc()], ['10', '列表查询'.loc()],
				['11', '外挂程序'.loc()], ['15', '地图'.loc()], ['20', '链接引用'.loc()],
				['21', '主题录入'.loc()], ['24', '批量更新'.loc()]]

	}
}