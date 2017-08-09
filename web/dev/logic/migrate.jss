Ext.namespace("dev.logic");

dev.logic.migrate = function(params, retFn) {

	var object_id = params.parent_id;
	var buttonArray = new Array();
	var pgcounter = -100;
	var oldValue;

	this.params = {};

	var temlateRecord = Ext.data.Record.create([{
				name : "index_id",
				mapping : "index_id"
			}, {
				name : "dblink",
				mapping : "dblink"
			}, {
				name : "tab_lname",
				mapping : "tab_lname"
			}, {
				name : "query_name",
				mapping : "query_name"
			}, {
				name : "grid_data"
			}, {
				name : "query_data"
			}, {
				name : "tab_id"
			}, {
				name : "query_id"
			}]);

	var loadRecord = function(rec) {
		var locParam;
		var eves = function(store, records) {
			var arr=new Array();
			Ext.each(records,function(rec){
				arr.push(rec.data);
			});
			rec.set("query_data", {items:arr});
			kindStore.un('load', eves, window);
		}
		kindStore.on("load", eves, window);
		locParam = {
			type : "query_column",
			query_id : rec.get("query_id")
		}
		kindStore.reload({
					params : locParam
				});
		locParam = {
			type : "get_migrate",
			tab_id : rec.get("tab_id"),
			index_id : rec.get("index_id"),
			object_id : object_id
		}
		var eve = function(store, records) {
			var arr=new Array();
			Ext.each(records,function(rec){
				arr.push(rec.data);
			});
			rec.set("grid_data",{items:arr});
			rstore.un('load', eve, window);
		}
		rstore.on("load", eve, window);
		rstore.reload({
					params : locParam
				});
	}
	
	
	var oldIndex=-2;
	
	var saveRecord=function(rowIndex){
		if(oldIndex!=-2){
			var r=migstore.getAt(oldIndex);
			var arr=new Array();
			rstore.each(function(rec){
				arr.push(rec.data);
			})
			r.get("grid_data").items=arr;
		}
		oldIndex=rowIndex;
	}
	
	var selectRecord = function(grid, rowIndex) {
		saveRecord(rowIndex);
		var rec = migstore.getAt(rowIndex);
		if (rec.get("grid_data") == undefined) {
			loadRecord(rec);
		} else {
			rstore.removeAll();
			rstore.loadData(rec.get("grid_data"));
			kindStore.removeAll();
			kindStore.loadData(rec.get("query_data"));
		}
	}

	var tabStore = new Ext.data.JsonStore({
				url : '/dev/logic/migrate.jcp',
				root : 'items',
				fields : ["id", "lname"],
				baseParams : {
					type : 'get_tables'
				},
				remoteSort : false
			});

	var migCon = new Ext.form.ComboBox({
				store : new Ext.data.JsonStore({
							url : '/dev/logic/migrate.jcp',
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
							url : '/dev/logic/migrate.jcp',
							root : 'items',
							autoLoad : true,
							fields : ["text", "value"],
							baseParams : {
								type : 'get_querys'
							}
						}),
				valueField : 'value',
				fieldLabel : '数据查询'.loc(),
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
				mode : 'local',
				blankText : '请选取列....'.loc()
			});
	var innerForm = new Ext.form.FormPanel({
		url : 'create.jcp',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:14px 0px 0px 26px;height:100%;width:100%;background:#FFFFFF;',
		labelWidth : 80,
		items : [migCon, migQuery, migTab]
	});
	var win = new Ext.Window({
				layout : 'fit',
				width : 320,
				height : 180,
				title : '迁移编辑'.loc(),
				closeAction : 'hide',
				plain : true,
				constrain : true,
				items : innerForm,
				buttons : [{
							text : '保存'.loc(),
							scope : this,
							handler : function() {
								if (!innerForm.form.isValid()) {
									Ext.msg("warn", '所有选项必须选择.'.loc());
									return;
								}
								win.hide();
								var myNewRecord = new temlateRecord({
											index_id : --pgcounter,
											dblink : migCon.getValue(),
											tab_lname : migTab.getRawValue(),
											query_name : migQuery.getRawValue(),
											tab_id : migTab.getValue(),
											query_id : migQuery.getValue()
										});
								migstore.add(myNewRecord);
								var pos = migstore.indexOf(myNewRecord);
								loadRecord(migstore.getAt(pos));
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
	var kindStore = new Ext.data.JsonStore({
				url : '/dev/logic/migrate.jcp',
				root : 'items',
				fields : ['text', 'value']
			});
	var cm = new Ext.grid.ColumnModel([{
				id : 'common',
				header : '查询数据项'.loc(),
				dataIndex : 'qname',
				width : 200,
				editor : new Ext.form.ComboBox({
							store : kindStore,
							valueField : 'text',
							displayField : 'text',
							triggerAction : 'all',
							mode : 'local',
							blankText : '请选取列....'.loc()
						})
			}, {
				header : '逻辑名称'.loc(),
				dataIndex : 'lname',
				width : 200
			}, {
				header : '类型'.loc(),
				dataIndex : 'type',
				width : 70
			}, {
				header : '长度'.loc(),
				dataIndex : 'length',
				width : 50
			}, {
				header : '非空'.loc(),
				dataIndex : 'nullable',
				width : 35
			}]);
	cm.defaultSortable = true;

	var rstore = new Ext.data.JsonStore({
				url : '/dev/logic/migrate.jcp',
				root : 'items',
				fields : ["qname", "id", "lname", "type", "length", "nullable",
						"col"]
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

	var migstore = new Ext.data.JsonStore({
				url : '/dev/logic/migrate.jcp',
				root : 'items',
				id : "index_id",
				fields : ["index_id", "dblink", "tab_lname", "query_name",
						"query_id", "tab_id","query_data","grid_data"],
				baseParams : {
					type : 'ctrl_tabquery'
				}
			});

	var list = new Ext.grid.GridPanel({
		store : migstore,
		columns : [{
					dataIndex : "index_id",
					hidden : true
				}, {
					header : '点击下列名称进行编辑:'.loc(),
					sortable : false,
					renderer : function(v, params, record) {
						return ("&nbsp;&nbsp;[" + record.data.dblink + "]."
								+ record.data.tab_lname + "__" + record.data.query_name);
					}
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
			saveRecord(-2);
			// 校验
			for (var i = 0; i < migstore.getCount(); i++) {
				var rcds = migstore.getAt(i).get("grid_data").items;
				for (var j = 0; j < rcds.length; j++) {
					if (rcds[j]["nullable"].trim() == '是'.loc()
							&& rcds[j]["qname"] == "") {
						list.getSelectionModel().selectRow(i);
						selectRecord(list, i);
						Ext.msg("confirm", '本迁移中,逻辑名称为'.loc()
										+ rcds[j]["lname"]
										+ '的字段不能为空值,必须与查询项目相匹配!'.loc(),
								function() {
									grid.startEditing(j, 0);
								});
						return;
					}
				}
			}
			// -----生成json
			var miglen = migstore.getCount()
			var ret = new Array(miglen);
			for (var i = 0; i < miglen; i++) {
				var rec = migstore.getAt(i);
				ret[i] = {
					tag : "s",
					tagName : "migBody",
					dblink : rec.get("dblink"),
					tab_id : rec.get("tab_id"),
					query_id : rec.get("query_id")
				};
				var rcds = rec.get("grid_data").items;
				var lids = new Array();
				for (var j = 0; j < rcds.length; j++) {
					if (rcds[j]["qname"] != "")
						lids.push({
									tag : "s",
									tagName : "migRow",
									tabitem_id : rcds[j]["id"],
									qname : rcds[j]["qname"]
								});
				}
				ret[i].children = lids;

			}
			// ----转成xml
			var list = Ext.DomHelper.append(document.createElement("div"), {
						tag : 'div',
						children : ret
					}, true);
			var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><root object_id=\""
					+ object_id + "\">" + list.dom.innerHTML + "</root>";

			// 提交
			Ext.Ajax.request({
						url : '/dev/logic/migrateSave.jcp',
						method : 'post',
						params : {
							xml : xml
						},
						success : function(response) {
							var msg = null;
							try {
								var obj = Ext.decode(response.responseText);
								if (!obj.success)
									msg = obj.message;
							} catch (e) {
								msg = response.responseText;
							}
							if (msg != null) {
								Ext.msg("error", '保存失败'.loc());
							} else {
								Ext.msg('info', '完成抽取定义!'.loc());
							}
						}
					});
		}
	}));
	buttonArray.push(new Ext.Toolbar.Button({
				text : '新建迁移'.loc(),
				disabled : false,
				icon : '/themes/icon/xp/new.gif',
				cls : 'x-btn-text-icon  bmenu',
				handler : function(btn) {
					win.show(btn.getEl());
					migQuery.clearValue();
					migTab.clearValue();
				}
			}));

	buttonArray.push(new Ext.Toolbar.Button({
				text : '删除迁移'.loc(),
				disabled : false,
				icon : '/themes/icon/xp/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				handler : function(btn) {
					var arr = list.getSelectionModel().getSelections();
					if (arr == undefined) {
						Ext.msg("warn", '请选择要删除的迁移'.loc());
						return;
					}
					for (var i = 0; i < arr.length; i++)
						migstore.remove(arr[i]);
					if (migstore.getCount() > 0) {
						list.getSelectionModel().selectFirstRow();
						selectRecord(list, 0);
					} else {
						rstore.removeAll();
					}
				}.createDelegate(this)
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
				id : "migrate",
				border : false,
				tbar : buttonArray,
				layout : 'border',
				split : true,
				items : [list, grid]
			});
	this.loadData = function(params, mainPanel) {
		this.params = params;
		object_id = params.parent_id;
		migstore.load({
					params : {
						object_id : object_id,
						ra : Math.random()
					}
				});
		mainPanel.setStatusValue(['编辑抽取迁移'.loc()]);
	}
};
dev.logic.migrate.prototype = {

}