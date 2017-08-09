Ext.namespace('dev.ctrl.TreeSub');

/*
 * 
 * NavNormal---------------------------------
 * 
 * 
 */
dev.ctrl.TreeSub.NavNormal = function(mp) {

	var pnor = new Ext.Panel({
		labelAlign : 'right',
		border : false,
		id : 'NavNormal',
		layout : 'form',
		setState : function(state) {
			var v = (state == 2);
			var ids = ['parentitem_id_id', 'sonitem_id_id'];
			for (var i = 0; i < ids.length; i++) {
				this.findById(ids[i]).setVisible(v);
			}
			Ext.getCmp("start_icon_id").wrap.setStyle("width", "100")
			Ext.getCmp("end_icon_id").wrap.setStyle("width", "100")
		},
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [mp.getCombo({
											fieldLabel : '数据库'.loc(),
											name : 'datasource',
											dataType : 'database',
											fieldName : 'dblink',
											allowBlank : false,
											select : function(combo) {
												var tab = Ext
														.getCmp("tab_id_id");
												tab.reset();
												tab.fireEvent("select", tab);
											}
										}), mp.getCombo({
											fieldLabel : '标题项'.loc(),
											name : 'titleitem_id',
											pid : 'tab_id_id',
											dataType : 'tabItem',
											allowBlank : false
										}), mp.getCombo({
											fieldLabel : '父关联项'.loc(),
											pid : 'tab_id_id',
											name : 'parentitem_id',
											dataType : 'link',
											hidden : true
										}), mp.getCombo({
											fieldLabel : '关联表'.loc(),
											name : 'reltab_id',
											dataType : 'linkTab',
											hidden : true,
											pid : 'tab_id_id'
										})]

					}, {
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [mp.getCombo({
							fieldLabel : '表名'.loc(),
							name : 'tab_id',
							dataType : 'table',
							allowBlank : false,
							pid : 'datasource_id',
							select : function(combo) {
								var arr = ["titleitem_id_id",
										"parentitem_id_id", "sonitem_id_id",
										"reltab_id_id", "importitem_id",
										"exportitem_id", "order_column_id"];
								var tabId = combo.getValue();
								for (var i = 0; i < arr.length; i++) {
									var m = Ext.getCmp(arr[i]);
									if (m) {
										m.reset();
										if (m.fromStore) {
											if (tabId != '') {
												m.fromStore.baseParams.objectId = tabId;
												m.fromStore.load({
															params : {}
														});
											} else {
												m.fromStore.removeAll();
											}
										}
									}
								}

							}
						}), {
							fieldLabel : '关联类别'.loc(),
							xtype : 'radiogroup',
							id : 'rel_type_id',
							isField : true,
							width : 180,
							name : 'rel_type',
							hidden : false,
							items : [{
										boxLabel : '外表关联'.loc(),
										name : 'rel_type',
										inputValue : '1'
									}, {
										boxLabel : '本表关联'.loc(),
										name : 'rel_type',
										inputValue : '0',
										checked : true
									}],
							listeners : {
								check : function(item, checked) {
									var m = Ext.getCmp('tree_type_id');
									var visible = checked == '1';
									this.innerPanel.setHeight((visible)
											? this.hTable[m.getValue()] + 25
											: this.hTable[m.getValue()]);
									Ext.getCmp('reltab_id_id')
											.setVisible(visible);
									Ext.getCmp('relitem_id_id')
											.setVisible(visible);
								}.createDelegate(mp)
							}
						}, mp.getCombo({
									fieldLabel : '子关联项'.loc(),
									name : 'sonitem_id',
									pid : 'tab_id_id',
									dataType : 'link',
									hidden : true
								}), mp.getCombo({
									fieldLabel : '关联项'.loc(),
									pid : 'reltab_id_id',
									name : 'relitem_id',
									dataType : 'relItem',
									hidden : true
								})]
					}]
		}, new lib.multiselect.ItemSelector({
					name : "importitem",
					id : "importitem_id",
					width : 550,
					hidden : false,
					fieldLabel : '导入项'.loc(),
					border : false,
					dataFields : ["value", "text"],
					fromData : [],
					fromStore : new Ext.data.JsonStore({
								url : mp.url,
								root : 'items',
								autoLoad : false,
								fields : ["value", "text"],
								baseParams : {
									type : 'export'
								}
							}),
					toData : [],
					msWidth : 200,
					msHeight : 70,
					drawTopIcon : false,
					drawBotIcon : false,
					valueField : "value",
					displayField : "text",
					imagePath : "/lib/multiselect",
					toLegend : '已选项'.loc(),
					fromLegend : '可选项'.loc()
				}), new lib.multiselect.ItemSelector({
					name : "exportitem",
					id : "exportitem_id",
					hidden : false,
					width : 500,
					border : false,
					fieldLabel : '导出项'.loc(),
					dataFields : ["value", "text"],
					fromData : [],
					toData : [],
					fromStore : new Ext.data.JsonStore({
								url : mp.url,
								root : 'items',
								autoLoad : false,
								fields : ["value", "text"],
								baseParams : {
									type : 'export'
								}
							}),
					drawTopIcon : false,
					drawBotIcon : false,
					msWidth : 200,
					msHeight : 70,
					valueField : "value",
					displayField : "text",
					imagePath : "/lib/multiselect",
					toLegend : '已选项'.loc(),
					fromLegend : '可选项'.loc()
				}),

		{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [{
									fieldLabel : '有效性检验'.loc(),
									id : 'is_available_id',
									isField : true,
									xtype : 'radiogroup',
									width : 120,
									name : 'is_available',
									hidden : false,
									items : [{
												boxLabel : '是'.loc(),
												name : 'is_available',
												inputValue : 'y'
											}, {
												boxLabel : '否'.loc(),
												name : 'is_available',
												inputValue : 'n',
												checked : true
											}]
								}, mp.getCombo({
											fieldLabel : '排序字段'.loc(),
											name : 'order_column',
											pid : 'tab_id_id',
											dataType : 'export'
										}), {
									xtype : 'iconpicker',
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '设置在节点展开时显示的图标,建议选择16x16的图标'
												.loc()
									},
									width : 24,
									id : 'start_icon_id',
									name : 'start_icon',
									isField : true,
									fieldLabel : '开启图标'.loc()
								}]
					}, {
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [mp.getCombo({
									fieldLabel : '数据权限'.loc(),
									name : 'data_auth',
									data : [['1', '显示所有数据'.loc()],
											['2', '显示本部门数据'.loc()],
											['3', '显示本人数据'.loc()],
											['4', '显示下属部门数据'.loc()],
											['5', '显示上级下属数据'.loc()],
											['6', '显示关联权限数据'.loc()],
											['7', '显示本机构数据'.loc()]]
								}), {
							fieldLabel : '排序方式'.loc(),
							name : 'order_type',
							id : 'order_type_id',
							isField : true,
							xtype : 'radiogroup',
							width : 120,
							items : [{
										boxLabel : '降序'.loc(),
										name : 'order_type',
										inputValue : '0',
										checked : true
									}, {
										boxLabel : '升序'.loc(),
										name : 'order_type',
										inputValue : '1'
									}]
						}, {
							xtype : 'iconpicker',
							id : 'end_icon_id',
							isField : true,
							qtip : {
								title : '提示'.loc(),
								dismissDelay : 10000,
								text : '设置在节点关闭时显示的图标,建议选择16x16的图标'.loc()
							},
							width : 24,
							name : 'end_icon',
							fieldLabel : '结束图标'.loc()
						}]
					}]
		}]
	});

	return pnor;
};

/*
 * 
 * NavTime---------------------------------
 * 
 * 
 */
dev.ctrl.TreeSub.NavTime = function(mp) {
	var ptime = new Ext.Panel({
				labelAlign : 'right',
				layout : 'form',
				id : 'NavTime',
				border : false,
				items : [mp.getCombo({
							fieldLabel : '时间类别'.loc(),
							name : 'time_catagory',
							data : [['1', '年'.loc()], ['2', '月'.loc()],
									['3', '日'.loc()]]
						}), {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.5,
						layout : 'form',
						border : false,
						items : [mp.getCombo({
									fieldLabel : '开始时间类型'.loc(),
									name : 'start_time_type',
									allowBlank : false,
									data : [['1', '当前时间'.loc()],
											['2', '自定义时间'.loc()]],
									select : function(combo) {
										var visible = combo.getValue() == 2;
										var target = Ext
												.getCmp("start_time_id");
										target.setVisible(visible);
										target.allowBlank = !visible;
										if (visible) {
											this.innerPanel
													.setHeight(this.hTable[3]);
										}
									}
								}), {
							xtype : 'datefield',
							fieldLabel : '开始时间'.loc(),
							name : 'start_time',
							id : 'start_time_id',
							hidden : true,
							format : 'Y/m/d',
							allowBlank : false,
							width : 162,
							minLength : 0
						}]
					}, {
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [mp.getCombo({
									fieldLabel : '结束时间类型'.loc(),
									name : 'end_time_type',
									allowBlank : false,
									data : [['1', '当前时间'.loc()],
											['2', '自定义时间'.loc()]],
									select : function(combo) {
										var visible = combo.getValue() == 2;
										var target = Ext.getCmp("end_time_id");
										target.setVisible(visible);
										target.allowBlank = !visible;
										if (visible) {
											this.innerPanel
													.setHeight(this.hTable[3]);
										}
									}
								}), {
							xtype : 'datefield',
							fieldLabel : '结束时间'.loc(),
							name : 'end_time',
							id : 'end_time_id',
							hidden : true,
							format : 'Y/m/d',
							allowBlank : false,
							width : 162,
							minLength : 0
						}]

					}]
				}]
			});
	return ptime;
}

/*
 * 
 * NavDictionary---------------------------------
 * 
 * 
 */
dev.ctrl.TreeSub.NavDictionary = function(mp) {
	var dictPanel = new Ext.Panel({
				labelAlign : 'right',
				layout : 'form',
				id : 'NavDictionary',
				border : false,
				items : [mp.getCombo({
									fieldLabel : '请选择应用'.loc(),
									name : 'dictbufname',
									dataType : "appItem",
									select : function() {
										Ext.getCmp("telBufname_id").reset();
										Ext.getCmp("oelBufname_id").reset();
									}
								}), {
							layout : 'column',
							border : false,
							items : [{
								columnWidth : 0.5,
								layout : 'form',
								border : false,
								items : [mp.getCombo({
											fieldLabel : '请选择分类'.loc(),
											name : 'telBufname',
											pid : 'dictbufname_id',
											dataType : "categoryItem",
											select : function() {
												Ext.getCmp("oelBufname_id")
														.reset();
											}
										}), {
									xtype : 'iconpicker',
									id : 'start_icon_id_dict',
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '设置在节点展开时显示的图标,建议选择16x16的图标'
												.loc()
									},
									width : 24,
									name : 'start_icon',
									isField : true,
									fieldLabel : '开启图标'.loc()
								}]
							}, {
								columnWidth : 0.50,
								layout : 'form',
								border : false,
								items : [mp.getCombo({
													fieldLabel : '请选择字典'.loc(),
													pid : 'telBufname_id',
													name : 'oelBufname',
													dataType : "dictionaryItem"
												}), {
											xtype : 'iconpicker',
											id : 'end_icon_id_dict',
											name : 'end_icon',
											qtip : {
												title : '提示'.loc(),
												dismissDelay : 10000,
												text : '设置在节点关闭时显示的图标,建议选择16x16的图标'
														.loc()
											},
											width : 24,
											isField : true,
											fieldLabel : '结束图标'.loc()
										}]

							}]
						}]
			});
	return dictPanel;
}

/*
 * 
 * NavDefind---------------------------------
 * 
 * 
 */
dev.ctrl.TreeSub.NavDefind = function(mp) {
	var pdefind = new Ext.Panel({
				labelAlign : 'right',
				layout : 'form',
				id : 'NavDefind',
				border : false,
				items : {
					xtype : 'textfield',
					fieldLabel : '连接'.loc(),
					name : 'def_href',
					id : 'def_href_id',
					hidden : false,

					allowBlank : false,
					width : 162
				}
			});
	return pdefind;
}