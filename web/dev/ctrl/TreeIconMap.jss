Ext.namespace("dev.ctrl");
dev.ctrl.TreeIconMap = function(params, mp) {

	this.params = params;
	this.mp = mp;
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function(btn) {
					var retParam = this.params;
					retParam.column_name = frm.findField('column_name')
							.getValue();
					for (var i = 0; i < this.params.iconNum; i++) {
						retParam['icon_path' + i] = Ext.getCmp('icon_path' + i)
								.getValue();
					}
					if (frm.isValid()) {
						frm.submit({
									url : '/dev/ctrl/TreeIconCreate.jcp',
									params : retParam,
									method : 'POST',
									scope : this,
									success : function(form, action) {
										Ext.msg("info", '保存成功'.loc());
										this.mp
												.setActiveTab("ProgramTreeDefinePanel");
										this.mp.setStatusValue(['程序管理'.loc()]);
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
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.params.returnFunction
			}));
	this.iconStore = new Ext.data.JsonStore({
				url : '/dev/ctrl/TreeIconMap.jcp',
				root : 'items',
				fields : ["text", "value", "option_id"],
				baseParams : {
					type : 'table',
					ctrl_id : this.params.ctrl_id,
					module_id : this.params.module_id
				}
			});

	this.treeIconForm = new Ext.form.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		id : 'propertyPanel',
		url : '/dev/ctrl/TreeIconMap.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [

				this.mainTab = new lib.ComboRemote.ComboRemote({
							fieldLabel : '图标字段'.loc(),
							store : this.iconStore,
							hiddenName : 'column_name',
							minLength : 0,
							valueField : 'text',
							displayField : 'value',
							triggerAction : 'all'
						}), this.dictPanel = new Ext.Panel({
							border : false,
							layout : 'form',
							id : 'dictpanel',
							items : [this.dictSecondPanel = new Ext.Panel({
										border : false,
										layout : 'form',
										id : 'dictsecond'
									})]
						})

		],
		tbar : ButtonArray
	});
	this.MainTabPanel = this.treeIconForm;
	var frm = this.treeIconForm.form;

	this.mainTab.on('select', function(combo, rec, index) {
		if (this.dictPanel.items) {
			this.dictPanel.remove(this.dictSecondPanel, true);
		}
		var option_ids = rec.get('option_id');
		if (option_ids == '') {
			this.params.iconNum = 0;
			return;
		}
		Ext.Ajax.request({
					url : '/dev/ctrl/TreeIconMap.jcp',
					params : {
						type : 'column',
						option_id : rec.get('option_id')
					},
					method : 'POST',
					scope : this,
					success : function(response, options) {
						var arr = eval(response.responseText);
						// alert(Ext.encode(arr));
						this.params.option_id = rec.get('option_id');
						this.params.iconNum = arr.length;
						this.dictPanel
								.add(this.dictSecondPanel = new Ext.Panel({
											border : false,
											layout : 'form',
											id : 'dictsecond'
										}));
						for (var i = 0; i < arr.length; i++) {
							this.params['option_code' + i] = arr[i][0];
							this.dictSecondPanel
									.add(new lib.IconPicker.IconPicker({
												qtip : {
													title : '提示'.loc(),
													dismissDelay : 10000,
													text : '设置在目标节点中显示的图标,建议选择16x16的图标'
															.loc()
												},
												width : 24,
												id : 'icon_path' + i,
												fieldLabel : arr[i][1]
											}));
						}
						this.dictPanel.doLayout(true);
					}
				});
	}, this);

};

dev.ctrl.TreeIconMap.prototype = {
	loadData : function(params, mp) {
		this.treeIconForm.load({
					url : '/dev/ctrl/TreeIconCreate.jcp',
					method : 'GET',
					scope : this,
					params : {
						ctrl_id : this.params.ctrl_id,
						module_id : this.params.module_id
					},
					success : function(frm, action) {
						this.params = params;
						var data = action.result.data;
						if (data.column_name == undefined) {
							this.treeIconForm.load({
										url : '/dev/ctrl/TreeIconMap.jcp',
										method : 'POST',
										scope : this
									});
							return;
						}
						frm.findField("column_name").setValue(data.column_name);
						this.dictPanel
								.add(this.dictSecondPanel = new Ext.Panel({
											border : false,
											layout : 'form',
											id : 'dictsecond'
										}));
						this.params.option_id = data.option_id;
						this.params.iconNum = data.iconNum;

						for (var i = 0; i < data.iconNum; i++) {
							this.params['option_code' + i] = data['option_code'
									+ i];
							this.dictSecondPanel
									.add(new lib.IconPicker.IconPicker({
												id : 'icon_path' + i,
												qtip : {
													title : '提示'.loc(),
													dismissDelay : 10000,
													text : '设置在节点中显示的图标,建议选择16x16的图标'
															.loc()
												},
												width : 24,
												value : data['icon_path' + i],
												fieldLabel : data['option_value'
														+ i]
											}));
						}
						this.dictPanel.doLayout(true);
						mp.setStatusValue(['图标字段'.loc()]);
					}
				});

	}
};