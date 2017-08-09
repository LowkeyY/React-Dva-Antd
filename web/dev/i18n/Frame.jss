Ext.namespace("dev.i18n");
using("lib.CachedPanel.CachedPanel");
dev.i18n.Frame = Ext.extend(WorkBench.baseNode, {
	getCombo : function(config) {
		if (!config.store)
			config.store = new Ext.data.JsonStore({
						autoDestroy : true,
						root : 'data',
						fields : ['text', 'value']
					})
		return new Ext.form.ComboBox(Ext.apply(config, {
					displayField : 'text',
					valueField : 'value',
					mode : 'local',
					triggerAction : 'all',
					editable : false,
					selectOnFocus : true,
					forceSelection : true
				}));
	},
	main : function(launcher) {

		var mainPanel = new lib.CachedPanel.CachedPanel({
					region : 'center',
					border : false

				});

		// EDIT
		var dsUrl = '/dev/i18n/dict.jcp';
		var record= Ext.data.Record.create([
			{name: 'objectId'},
			{name: 'key'},
			{name: 'value'},
			{name: 'objectName'}
		]);
		var ds = new Ext.data.GroupingStore({
			autoLoad : false,
			url: dsUrl,
			reader: new Ext.data.JsonReader(
				{
					root: 'data',
					successProperty: 'success'
				}, 
				record
			),
			pack : function() {
				var storeValue = [];
				ds.each(function(rec) {
							storeValue.push(rec.data);
						})
				return storeValue;
			},
			method : 'GET',
			sortInfo:{field: 'key', direction: "ASC"},
			groupField:'objectName'
		});
   
		var cm = new Ext.grid.ColumnModel({
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								dataIndex : "objectName",
								header : '对象'.loc(),
								hidden:true, 
								sortable: true, 
								menuDisabled:true
							}, {  
								dataIndex : "key",
								header : '翻译前'.loc()
							}, {
								dataIndex : "value",
								header : '翻译后'.loc(),
								editor : new Ext.form.TextField({
											allowBlank : false
										})
							}]
				});     

		var editpanel = new Ext.grid.EditorGridPanel({
			cached : true,
			name : 'langedit',
			cm : cm,
			border : false,
			store : ds,
			clicksToEdit : 1,
			view:new Ext.grid.GroupingView({
				forceFit:true,

				groupTextTpl: '{text} ('+'共'.loc()+'{[values.rs.length]}'+'条'.loc()+')'
			}),
			tbar : [{
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				scope : this,
				handler : function() {

					var node = mytree.getSelectionModel().getSelectedNode();
					if (node == null)
						return;
					Ext.Ajax.request({
								url : '/dev/i18n/dict.jcp',
								params : {
									type : "save",
									lang : node.attributes.lang,
									mtype : node.attributes.mtype,
									id : node.attributes.pid,
									fields : Ext.encode(ds.pack())
								},
								scope : this,
								success : function(o) {
									if (o
											&& o.responseText
											&& Ext.decode(o.responseText).success) {
										Ext.Msg.alert('提示'.loc(), '保存成功!'.loc());
									} else {
										Ext.msg("error", '错误'.loc());
									}
								}
							});

				}
			}, {
				text : '自动翻译'.loc(),
				icon : '/themes/icon/common/read.gif',
				scope : this,
				handler : function() {
					var node = mytree.getSelectionModel().getSelectedNode();
					if (node == null)
						return;
					Ext.Msg.confirm('当前模块翻译'.loc(), '您确定需要翻译?自动翻译可能会覆盖您手工翻译的结果.'.loc(),
							function(btn) {
								if (btn == 'yes') {
									ds.load({
												params : {
													lang : node.attributes.lang,
													id : node.attributes.pid,
													mtype : node.attributes.mtype,
													type : 'translate',
													fields : Ext.encode(ds
															.pack())
												}
											});
								}
							}, this)

				}
			}, {
				text : '增量翻译'.loc(),
				icon : '/themes/icon/all/added_ico.gif',
				scope : this,
				handler : function() {
					var node = mytree.getSelectionModel().getSelectedNode();
					if (node == null)
						return;
					ds.load({
						params : {
							lang : node.attributes.lang,
							id : node.attributes.pid,
							mtype : node.attributes.mtype,
							type : 'addTranslate',
							fields : Ext.encode(ds
									.pack())
						}
					});
				}
			}, {
				text : '删除'.loc(),
				icon : '/themes/icon/common/delete.gif',
				scope : this,
				handler : function() {
					var node = mytree.getSelectionModel().getSelectedNode();
					if (node == null)
						return;
					Ext.Msg.confirm('删除翻译'.loc(), '您确定要删除翻译结果?'.loc(), function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : '/dev/i18n/dict.jcp',
								params : {
									type : "delete",
									lang : node.attributes.lang,
									mtype : node.attributes.mtype,
									id : node.attributes.pid
								},
								scope : this,
								success : function(o) {
									if (o
											&& o.responseText
											&& Ext.decode(o.responseText).success) {
										ds.reload();
										Ext.Msg.alert('提示'.loc(), '删除翻译成功!'.loc());
									} else {
										Ext.msg("error", '错误'.loc());
									}
								}
							});
						}
					}, this)
				}

			}]
		});
		mainPanel.add(editpanel);


		var sysLangPackage = new Ext.Toolbar.Button({
					text : '生成系统语言包'.loc(),
					icon : '/themes/icon/all/package.gif',
					hidden : false,
					disabled:true,
					scope : this,
					handler : function() {
						var node = mytree.getSelectionModel().getSelectedNode();
						if (node == null) {
							Ext.Msg.alert('提示'.loc(), '请选择语言!'.loc());
							return;
						}
						Ext.Msg.alert('提示'.loc(), '此功能正在开发中!'.loc());
					}
		});

		var appLangPackage = new Ext.Toolbar.Button({
			text : '生成应用语言包'.loc(),
			icon : '/themes/icon/all/package_link.gif',
			hidden : false,
			disabled:true,
			scope : this,
			handler : function() {
				var node = mytree.getSelectionModel().getSelectedNode();
				if (node == null) {
					Ext.Msg.alert('提示'.loc(), '请选择语言!'.loc());
					return;
				}
				Ext.Msg.alert('提示'.loc(), '此功能正在开发中!'.loc());
			}
		});

		// FORM
		var del = new Ext.Toolbar.Button({
			btnId : 'delete',
			text : '删除'.loc(),
			icon : '/themes/icon/common/delete.gif',
			scope : this,
			hidden : true,
			handler : function() {
				Ext.Msg.confirm('提示'.loc(), '确定删除该语言?'.loc(), function(btn) {
					if (btn == 'yes') {
						framePanel.getEl().mask('请等待'.loc());
						Ext.Ajax.request({
									url : '/dev/i18n/language.jcp',
									scope : this,
									method : 'POST',
									params : {
										type : "delete",
										locale : formPanel.locale
									},
									success : function(o) {
										framePanel.getEl().unmask();
										if (o
												&& o.responseText
												&& Ext.decode(o.responseText).success) {
											mytree.root.reload();
											Ext.Msg.alert('提示'.loc(), '删除成功!'.loc());
										} else {
											Ext.msg("error", '删除失败!'.loc());
										}
									},
									failure : function() {
										framePanel.getEl().unmask();
									}
								});
					} else {
						return;
					}
				}, this);
			}
		});
		var languageCombo = this.getCombo({
					fieldLabel : '选择语言与地区'.loc(),
					hiddenName : 'locale',
					width : 340,
					store : new Ext.data.JsonStore({
								url : '/dev/i18n/language.jcp',
								method : 'Get',
								autoLoad : true,
								fields : ['value', 'text']
							})
				});
		languageCombo.on("select", function(combo, rec) {
					formPanel.loadLocale(rec.get("value"), false);
				}, this);
		var unit = this.getCombo({
					fieldLabel : '单位制'.loc(),
					hiddenName : 'unitSystem',
					width : 50
				});
		unit.store.loadData({
					data : [{
								text : '公制'.loc(),
								value : 'metric'
							}, {
								text : '英制'.loc(),
								value : 'imperial'
							}]
				});
		var topBar = [{
			text : '保存'.loc(),
			icon : '/themes/icon/xp/save.gif',
			scope : this,
			handler : function(btn) {
				var p = languageCombo.isVisible() ? {
					type : 'save'
				} : {
					type : 'update',
					locale : formPanel.locale
				}
				framePanel.getEl().mask('请等待'.loc() + "");
				formPanel.form.submit({
							params : p,
							success : function(form, action) {
								if (action && action.result
										&& action.result.success)
									framePanel.getEl().unmask();
								mytree.root.reload();
								Ext.msg("info", '保存成功'.loc());
							},
							failure : function() {
								framePanel.getEl().unmask();
								Ext.msg("error", '保存失败'.loc());
							}
						});
			}
		}, del];
		var formPanel = new Ext.FormPanel({
					cached : true,
					tbar : topBar,
					labelWidth : 180,
					labelAlign : 'right',
					url : '/dev/i18n/language.jcp',
					bodyStyle : 'padding:10px 0 0 20px',
					loadLocale : function(locale, useSystemLocal) {
						var p = {
							language : locale
						}
						if (useSystemLocal)
							p.useSystemLocal = true;
						else
							p.useBaseLocal = true;
						this.form.load({
									url : '/bin/i18n/setting/LocaleSettingPanel.jcp',
									method : "GET",
									params : p,
									success : function(form, action) {
										var result = action.result;
										if (result.languages) {
											form.findField("locale").store
													.loadData({
																data : result.languages
															})
										}
										form.findField("currency").store
												.loadData({
															data : result.currencys
														})
										form.findField("timezone").store
												.loadData({
															data : result.timezones
														})
										form.setValues(result.data);
									}
								});
					},
					items : [languageCombo, unit, this.getCombo({
										fieldLabel : '货币'.loc(),
										hiddenName : 'currency',
										width : 150
									}), this.getCombo({
										fieldLabel : '时区'.loc(),
										hiddenName : 'timezone',
										width : 400
									}), {
								fieldLabel : '日期格式'.loc()+'('+'长'.loc()+')',
								name : 'dateLong',
								xtype : 'textfield',
								width : 200
							}, {
								fieldLabel : '日期格式'.loc()+'('+'短'.loc()+')',
								xtype : 'textfield',
								name : 'dateShort',
								width : 120
							}, {
								fieldLabel : '时间格式'.loc()+'('+'长'.loc()+')',
								xtype : 'textfield',
								name : 'timeLong',
								width : 200
							}, {
								fieldLabel : '时间格式'.loc()+'('+'短'.loc()+')',
								xtype : 'textfield',
								name : 'timeShort',
								width : 120
							}, {
								fieldLabel : '日期+时间格式'.loc()+'('+'长'.loc()+')',
								xtype : 'textfield',
								name : 'dateTimeLong',
								width : 300
							}, {
								fieldLabel : '日期+时间格式'.loc()+'('+'短'.loc()+')',
								xtype : 'textfield',
								name : 'dateTimeShort',
								width : 150
							}]
				});

		mainPanel.add(formPanel);
		mainPanel.setActiveTab(formPanel);

		// TREE
		var rootNode = new Ext.tree.AsyncTreeNode({
					id : "root",
					text : '所有语言'.loc(),
					icon : "/themes/icon/all/anchor.gif",
					expanded : true,
					locale : "default",
					leaf : false
				});
		var mytree = new Ext.tree.TreePanel({
					title:'语言导航'.loc(),
					name : 'comparison',
					bodyStyle : 'padding:4px 0px 0px 5px;',
					rootVisible : true,
					useArrows : true,
					autoScroll : true,
					animate : true,
					enableDD : true,
					border : false,
					containerScroll : true,
					width : 260,
					tbar:[sysLangPackage,appLangPackage],
					loader : new Ext.tree.TreeLoader({
								dataUrl : '/dev/i18n/tree.jcp',
								preloadChildren : true,
								clearOnLoad : false
							}),
					root : rootNode,
					listeners : {
						'click' : function(node, event) {
							if (node.attributes.locale) {
								mainPanel.setActiveTab(formPanel);
								if (node.attributes.locale == "default") {
									del.hide();
									sysLangPackage.disable();
									appLangPackage.disable();
									languageCombo.show();
									formPanel.form.reset();
								} else {
									del.show();
									languageCombo.hide();
									sysLangPackage.enable();
									appLangPackage.disable();
									formPanel.locale = node.attributes.locale;
									formPanel.loadLocale(
											node.attributes.locale, true)
								}
							} else {
								if(node.attributes.treetype=='mod'){
									sysLangPackage.disable();
									appLangPackage.enable();
								}else{
									sysLangPackage.disable();
									appLangPackage.disable();
								}
								if (node.isLeaf()||node.attributes.mtype=='1') {
									mainPanel.setActiveTab(editpanel);
									ds.load({
												params : {
													type : 'load',
													treetype : node.attributes.treetype,
													id : node.attributes.pid,
													mtype : node.attributes.mtype,
													text : node.attributes.text,
													lang : node.attributes.lang
												}
									});
								}
							}

						},
						'beforeload' : function(node) {
							this.loader.dataUrl = '/dev/i18n/tree.jcp?id='
									+ node.attributes.id + "&treetype="
									+ node.attributes.treetype + "&path="
									+ node.attributes.path + "&lang="
									+ node.attributes.lang + "&pid="
									+ node.attributes.pid;
						}
					}

				});

		var framePanel = new Ext.Panel({
					height : 100,
					layout : 'border',
					items : [{
								region : 'west',
								split : true,
								layout : 'fit',
								width : 260,
								items : mytree

							}, {
								region : 'center',
								layout : 'fit',
								split : true,
								items : mainPanel

							}]
				});
		return framePanel;
	}
})
