Ext.namespace('dev.ctrl');
/**平台3.0中预留功能.ButtonAction的定义界面.*/
dev.ctrl.ButtonDefine = function(params) {

	var fields = ["button_id", "program_id", "workflow_id", "title",
			"pagetype", "event", "icon", "events", "seq"];

	var oprator = new dev.ctrl.OprateColumn({
				header : '编辑'.loc(),
				width : 130,
				dataIndex : 'button_id'
			});

	var buttonList = new Ext.grid.GridPanel({
				store : new Ext.data.JsonStore({
							recordType : Ext.data.Record.create(fields),
							root : 'items',
							method : 'get',
							fields : fields
						}),
				border : false,
				stripeRows : true,
				rowEditMark : null,
				enableHdMenu : false,
				autoExpandColumn : 'event',
				frame : false,
				defaultSortable : false,
				split : true,
				region : "center",
				plugins : [oprator],
				columns : [oprator, {
							header : '页面类型'.loc(),
							width : 95,
							dataIndex : 'pagetype'
						}, {
							header : '标题'.loc(),
							width : 120,
							dataIndex : 'title'
						}, {
							header : '事件'.loc(),
							width : 120,
							dataIndex : 'event'
						}, {
							header : '图标'.loc(),
							width : 60,
							dataIndex : 'icon',
							renderer : function(v) {
								return '<div><img src="/themes/icon' + v
										+ '"></div>';
							}
						}],
				viewConfig : {
					forceFit : true
				},
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				height : 250,
				iconCls : 'icon-grid'
			});
	var resetButton = new Ext.Toolbar.Button({
				text : '清空'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon',
				handler : function() {
					buttonForm.reset();
					if (buttonList.rowEditMark != null) {
						buttonEditPanel.collapse(true);
					}
				},
				scope : this
			})
	buttonList.onEdit = function(gd, rowIndex) {
		var rec = gd.getStore().getAt(rowIndex);
		buttonForm.loadData(rec);
		var sm = gd.getSelectionModel()
		sm.selectRow(rowIndex);
		sm.lock();
		gd.rowEditMark = rec;
		resetButton.setText('取消编辑'.loc());
		buttonEditPanel.expand(true);
	}
	buttonList.on("rowdblclick", buttonList.onEdit, buttonList);

	var templateCombo = new Ext.form.ComboBox({
				xtype : 'combo',
				fieldLabel : '模板'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text', 'type', 'data']
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				mode : 'local'
			});
	templateCombo.on("select", function(combo, rec, index) {
				var fm = buttonForm.form;
				var actionGrid = ap[0];
				var actionForm = ap[1];
				var fn = function() {
					var data = rec.get("data");
					data = data ? Ext.decode(data) : {};
					fm.setValues(data);
					var st = actionGrid.getStore();
					if (st.getCount() > 0)
						st.removeAll();

					st.loadData(data.events);
					actionForm.reset();
				}.createDelegate(this);
				if (actionGrid.getStore().getCount() > 0) {
					Ext.msg("confirm", '应用此模板将会删除当前已定义的事件,是否应用此模板?'.loc(),
							function(answer) {
								if (answer == 'yes') {
									fn();
								}
							}.createDelegate(this));
				} else {
					fn();
				}
			}, this)
	var pageTypeCombo = new Ext.form.ComboBox({
				xtype : 'combo',
				fieldLabel : '页面类型'.loc(),
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text']
						}),
				hiddenName : 'pagetype',
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				allowBlank : false,
				mode : 'local'
			});
	pageTypeCombo.on("select", function(combo) {
				var value = combo.getValue();
				ap[1].setPageType(value);
				var st = templateCombo.store;
				st.clearFilter(true);
				st.filterBy(function(rec) {
							return rec.get("type") == value;
						});

				templateCombo.reset();
			}, this)

	var buttonForm = new Ext.form.FormPanel({
		labelWidth : 160,
		labelAlign : 'right',
		region : 'north',

		height : 100,
		border : true,
		layout : 'column',
		bodyStyle : 'padding:20px 0px 0px 0px;',
		items : [{
					border : false,
					columnWidth : 0.54,
					layout : 'form',
					items : [pageTypeCombo, {
								xtype : 'textfield',
								fieldLabel : '标题'.loc(),
								allowBlank : false,
								name : 'title'
							}]
				}, {
					columnWidth : 0.46,
					layout : 'form',
					border : false,
					items : [templateCombo, {
								xtype : 'iconpicker',
								qtip : {
									title : '提示'.loc(),
									dismissDelay : 10000,
									text : '用于显示按钮中的图标,建议选择16x16的图标'.loc()
								},
								name : 'icon',
								allowBlank : false,
								width:24,
								fieldLabel : '图标'.loc(),
								emptyImage : '/themes/icon/all/transparent.gif',
								defaultImage : '/themes/icon/all/transparent.gif'
							}]
				}]
	});
	var ap = dev.ctrl.ActionDefine({
				form : {
					region : 'east',
					labelWidth : 60,
					width : 400
				},
				grid : {
					border : true,
					region : 'center'
				}
			});

	buttonForm.save = function() {
		var fm = this.form;
		if (!fm.isValid())
			return;
		var action = ap[0].getJson();
		var result = {
			title : fm.findField("title").getValue(),
			pagetype : fm.findField("pagetype").getValue(),
			icon : fm.findField("icon").getValue(),
			event : action.title,
			events : action.data,
			excutes : action.list,
			seq : buttonList.getStore().getCount()
		}
		return;

		if (buttonList.rowEditMark == null) {

			result.seq = st.getCount();
			st.add(new st.recordType(result));
		} else {
			var rec = buttonList.rowEditMark;
			buttonList.rowEditMark = null;
			Ext.apply(rec.data, result);
			buttonEditPanel.collapse(true);
		}
		this.reset();
	}
	buttonForm.loadData = function(rec) {
		var d = rec.data;
		this.form.setValues(d);
		ap[0].getStore().loadData(d.events);
		pageTypeCombo.fireEvent("select", pageTypeCombo);
	}
	buttonForm.reset = function() {
		var sm = buttonList.getSelectionModel()
		if (sm.isLocked()) {
			sm.clearSelections();
			sm.unlock();
		}
		this.form.reset();
		ap[0].getStore().removeAll();
		ap[1].reset();
		resetButton.setText('清空'.loc());
		pageTypeCombo.selectFirst(true);
	}
	var buttonEditPanel = new Ext.Panel({
				layout : 'border',
				border : false,
				split : true,
				height : 350,
				region : 'south',
				collapsed : true,
				collapsible : true,
				items : [{
							layout : 'border',
							border : false,
							region : 'center',
							items : [buttonForm, ap[0]]
						}, ap[1]],
				tbar : [{
							text : '保存'.loc(),
							icon : '/themes/icon/xp/save.gif',
							cls : 'x-btn-text-icon',
							handler : function() {
								buttonForm.save();
							},
							scope : this
						}, resetButton, {
							text : '关闭'.loc(),
							icon : '/themes/icon/xp/del.gif',
							cls : 'x-btn-text-icon',
							handler : function() {
								buttonEditPanel.collapse(true);
								buttonForm.reset();
							},
							scope : this
						}]

			});

	this.MainTabPanel = new Ext.Panel({
				layout : 'border',
				tbar : [{
							text : '新建按钮'.loc(),
							scope : this,
							icon : '/themes/icon/common/new.gif',
							cls : 'x-btn-text-icon',
							handler : function() {
								buttonEditPanel.expand(true);
							}
						}, {
							id : 'ret',
							text : '返回'.loc(),
							icon : '/themes/icon/xp/undo.gif',
							cls : 'x-btn-text-icon',
							scope : this,
							handler : function() {
								params.returnFunction();
							}
						}],
				border : false,
				items : [buttonList, buttonEditPanel]
			});
	this.MainTabPanel.loadData = function(ret) {
		var st;
		// buttonList.getStore().loadData(ret.data);
		templateCombo.store.loadData(ret.templates);
		pageTypeCombo.store.loadData(ret.pageTypes);
		pageTypeCombo.selectFirst(true);
		ap[1].loadMetaData(ret.meta);
	}

}
dev.ctrl.ButtonDefine.prototype = {
	init : function(params) {
		Ext.Ajax.request({
					url : '/dev/ctrl/ButtonDefine.jcp',
					scope : this,
					method : 'GET',
					params : {
						objectId : params.objectId
					},
					callback : function(options, success, response) {
						var ret = Ext.decode(response.responseText);
						this.MainTabPanel.loadData(ret);
					}
				});
	}
}
