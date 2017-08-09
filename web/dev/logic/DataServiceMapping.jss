Ext.namespace("dev.logic");

dev.logic.DataServiceMapping = function(params, retFn, isQuery) {

	var object_id = params.parent_id;
	var buttonArray = new Array();
	var oldValue;
	this.params = {};

	var temlateRecord = Ext.data.Record.create([{
				name : "data_source_name"
			}, {
				name : "data_source_id"
			}, {
				name : "grid_data"
			}, {
				name : "data_tag"
			}]);

	var loadRecord = function(rec) {
		var locParam = {
			type : "get_data_service",
			tab_id : rec.get("data_source_id"),
			object_id : object_id
		}

		rstore.once("load", function(store, records) {
					var arr = new Array();
					Ext.each(records, function(rec) {
								arr.push(rec.data);
							});
					rec.set("grid_data", {
								items : arr
							});
				}, window);
		rstore.reload({
					params : locParam
				});
	}

	var oldIndex = -2;

	var saveRecord = function(rowIndex) {

		if (oldIndex != -2) {
			var r = lstore.getAt(oldIndex);
			var arr = new Array();
			rstore.each(function(rec) {
						arr.push(rec.data);
					})
			r.get("grid_data").items = arr;
		}
		oldIndex = rowIndex;
	}

	var selectRecord = function(grid, rowIndex) {
		saveRecord(rowIndex);
		var rec = lstore.getAt(rowIndex);
		if (rec.get("grid_data") == undefined) {
			loadRecord(rec);
		} else {
			rstore.loadData(rec.get("grid_data"));
		}
	}

	var tabStore = new Ext.data.JsonStore({
				url : '/dev/logic/DataServiceMapping.jcp',
				root : 'items',
				fields : ["id", "lname"],
				baseParams : {
					type : 'get_tables'
				},
				remoteSort : false
			});

	var migCon = new Ext.form.ComboBox({
				store : new Ext.data.JsonStore({
							url : '/dev/logic/DataServiceMapping.jcp',
							root : 'items',
							autoLoad : true,
							fields : ["text"],
							baseParams : {
								type : 'get_links',
								object_id : object_id
							}
						}),
				valueField : 'text',
				fieldLabel : '数据库连接'.loc(),
				displayField : 'text',
				hidden : isQuery,
				allowBlank : false,
				triggerAction : 'all',
				mode : 'local'
			});

	migCon.on("select", function() {
				if (oldValue == this.value)
					return;
				oldValue = this.value;
				tabStore.load({
							params : {
								database_link : this.value
							}
						});
			});

	var migQuery = new Ext.form.ComboBox({
				store : new Ext.data.JsonStore({
							url : '/dev/logic/DataServiceMapping.jcp',
							root : 'items',
							autoLoad : true,
							fields : ["text", "value"],
							baseParams : {
								type : 'get_querys'
							}
						}),
				valueField : 'value',
				fieldLabel : '数据查询'.loc(),
				hidden : !isQuery,
				displayField : 'text',
				triggerAction : 'all',
				allowBlank : false,
				mode : 'local'
			});
	var migTab = new Ext.form.ComboBox({
				store : tabStore,
				valueField : 'id',
				fieldLabel : '目标表'.loc(),
				displayField : 'lname',
				triggerAction : 'all',
				allowBlank : false,
				hidden : isQuery,
				mode : 'local',
				blankText : '请选取列....'.loc()
			});

	var dataTag = new Ext.form.TextField({
				fieldLabel : '数据标签'.loc(),
				name : 'dataTag',
				width : 160,
				maxLength : 24,
				regex : /^[^\<\>\'\"\&]+$/,
				regexText : '数据标签中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),
				allowBlank : false,
				maxLengthText : '数据标签不能超过{0}个字符!'.loc(),
				blankText : '数据标签必须提供.'.loc()
			});

	var innerForm = new Ext.form.FormPanel({
		url : 'create.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:14px 0px 0px 26px;height:100%;width:100%;background:#FFFFFF;',
		labelWidth : 80,
		items : [migCon, migQuery, migTab, dataTag]
	});
	var win = new Ext.Window({
				layout : 'fit',
				width : 320,
				height : 180,
				title : '添加删除数据源'.loc(),
				closeAction : 'hide',
				plain : true,
				constrain : true,
				items : innerForm,
				buttons : [{
					text : '保存'.loc(),
					scope : this,
					handler : function() {
						if (!dataTag.isValid()) {
							Ext.msg("warn", '数据标签必须填写.'.loc());
							return;
						}
						win.hide();
						var myNewRecord = new temlateRecord({
									data_source_name : (isQuery ? migQuery
											.getRawValue() : migTab
											.getRawValue())
											+ "_" + dataTag.getValue(),
									data_source_id : isQuery ? migQuery
											.getValue() : migTab.getValue(),
									data_tag : dataTag.getValue()
								});
						lstore.add(myNewRecord);
						var pos = lstore.indexOf(myNewRecord);
						saveRecord(pos);
						loadRecord(lstore.getAt(pos));
						list.getSelectionModel().selectRow(pos);
					}
				}, {
					text : '关闭'.loc(),
					scope : this,
					handler : function() {
						win.hide();
					}
				}]
			});

	var cm = new Ext.grid.ColumnModel([{
				id : 'common',
				header : (isQuery) ? '查询数据项'.loc() : '逻辑名称'.loc(),
				dataIndex : 'lname',
				width : 400
			}, {
				header : '新名称'.loc(),
				dataIndex : 'newName',
				width : 400,
				editor : new Ext.form.TextField({
							maxLength : 24,
							regex : /^[^\<\>\'\"\&]+$/,
							regexText : '数据标签中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),
							allowBlank : false,
							maxLengthText : '数据标签不能超过{0}个字符!'.loc(),
							blankText : '数据标签必须提供.'.loc()
						})
			}]);
	cm.defaultSortable = true;
	var rstore = new Ext.data.JsonStore({
				url : '/dev/logic/DataServiceMapping.jcp',
				root : 'items',
				fields : ["qid", "lname", "colId", "newName"]
			});
	var grid = new Ext.grid.EditorGridPanel({
				store : rstore,
				cm : cm,
				autoExpandColumn : 'common',
				region : 'center',
				minSize : 400,
				frame : false,
				cmargins : '5 5 0 5',
				clicksToEdit : 1
			});
	var lstore = new Ext.data.JsonStore({
		url : '/dev/logic/DataServiceMapping.jcp',
		root : 'items',
		fields : ["data_source_name", "data_source_id", "grid_data", "data_tag"],
		baseParams : {
			type : 'ctrl_tabquery'
		}
	});

	var list = new Ext.grid.GridPanel({
				store : lstore,
				columns : [{
							dataIndex : "data_source_id",
							hidden : true
						}, {
							header : '点击下列名称进行编辑:'.loc(),
							sortable : false,
							dataIndex : "data_source_name"
						}],
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				region : 'west',
				cmargins : '5 5 0 5',
				split : true,
				width : 250,
				viewConfig : {
					forceFit : true
				},
				minSize : 100,
				maxSize : 300,
				frame : false
			});

	list.on("rowclick", selectRecord, this);

	buttonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function(btn) {
					if (lstore.getCount() == 0) {
						Ext.msg("warn", '至少得建立一个映射关系'.loc());
						return;
					}
					saveRecord(-2);
					// 校验
					for (var i = 0; i < lstore.getCount(); i++) {
						var rcds = lstore.getAt(i).get("grid_data").items;
						for (var j = 0; j < rcds.length; j++) {
							if (rcds[j]["newName"] == "") {
								list.getSelectionModel().selectRow(i);
								selectRecord(list, i);
								Ext.msg("warn", '本映射关系中,逻辑名称为'
												+ rcds[j]["lname"]
												+ '的字段不能为空值,必须与查询项目相匹配!'.loc(),
										function() {
											grid.startEditing(j, 0);
										});
								return;
							}
						}
					}
					//
					// -----生成json
					var miglen = lstore.getCount()
					var ret = new Array();
					for (var i = 0; i < miglen; i++) {
						var rec = lstore.getAt(i);
						var rcds = rec.get("grid_data").items;
						for (var j = 0; j < rcds.length; j++) {
							rcds[j].data_tag = rec.get("data_tag")
							ret.push(rcds[j]);
						}
					}
					// 提交
					Ext.Ajax.request({
								url : '/dev/logic/DataServiceMapping.jcp',
								method : 'PUT',
								params : {
									objectId : object_id,
									value : Ext.encode(ret)
								},
								success : function(response) {
									var msg = null;
									try {
										var obj = Ext
												.decode(response.responseText);
										if (!obj.success)
											msg = obj.message;
									} catch (e) {
										msg = response.responseText;
									}
									if (msg != null) {
										Ext.msg("error", '保存失败'.loc());
									} else {
										Ext.msg('info', '保存成功!'.loc());
									}
								}
							});
				}
			}));

	buttonArray.push(new Ext.Toolbar.Button({
				text : '新建映射关系'.loc(),
				disabled : false,
				icon : '/themes/icon/xp/new.gif',
				cls : 'x-btn-text-icon  bmenu',
				handler : function(btn) {
					win.show(btn.getEl());
					migQuery.clearValue();
					migTab.clearValue();
					dataTag.reset();
				}
			}));

	buttonArray.push(new Ext.Toolbar.Button({
				text : '删除映射关系'.loc(),
				disabled : false,
				icon : '/themes/icon/xp/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function(btn) {
					var arr = list.getSelectionModel().getSelections();
					if (arr == undefined) {
						Ext.msg("warn", '请选择要删除的映射关系'.loc());
						return;
					}
					for (var i = 0; i < arr.length; i++)
						lstore.remove(arr[i]);
					if (lstore.getCount() > 0) {
						oldIndex = -2
						list.getSelectionModel().selectFirstRow();
						selectRecord(list, 0);
					} else {
						rstore.removeAll();
					}
				}
			}));

	buttonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : retFn
			}));

	this.MainTabPanel = new Ext.Panel({
				border : false,
				tbar : buttonArray,
				layout : 'border',
				split : true,
				items : [list, grid]
			});
	this.loadData = function(params, mainPanel) {
		this.params = params;
		lstore.load({
					params : {
						object_id : object_id,
						ra : Math.random()
					}
				});
		if (mainPanel && mainPanel.setStatusValue) {
			mainPanel.setStatusValue(['编辑映射关系'.loc()]);
		}
	}
};