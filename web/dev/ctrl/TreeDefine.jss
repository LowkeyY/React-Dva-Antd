Ext.namespace('dev.ctrl');
dev.ctrl.TreeDefine = Ext.extend(Ext.Panel, {
	/**
	 * 是否隐藏"设定目标"字段.(某些情况下不需要设定目标.)
	 * */
	hideTargetPanel : false,
	url : '/dev/ctrl/TreeDefine.jcp',
	bodyStyle : 'padding:10px 0px 0px 40px;overflow-y:auto;',
	fields : null,
	layout : 'form',
	serverData : null,
	initComponent : function() {
		this.loadServerData(this.params);
		this.targetPanel = new dev.ctrl.TargetPanel({
					defaultStates : [["0", '无动作'.loc()], ["2", '选择窗口'.loc()]],
					parentPanel : this,
					objectId : this.params.objectId
				});
		this.authTypeDS = new Ext.data.JsonStore({
					url : '/dev/ctrl/getAuthType.jcp',
					root : 'items',
					autoLoad : true,
					fields : ["text", "value"]
				});
		this.authType = new Ext.form.ComboBox({
					fieldLabel : '数据权限'.loc(),
					store : this.authTypeDS,
					name : 'data_auth',
					valueField : 'value',
					displayField : 'text',
					triggerAction : 'all',
					mode : 'local'
				});
		this.items = [{
			"layout" : "column",
			"border" : false,
			items : [{
				columnWidth : 0.50,
				layout : 'form',
				border : false,
				items : [this.treeType = {
					fieldLabel : '树类型'.loc(),
					width : 150,
					xtype : 'radiogroup',
					name : 'tree_type',
					items : [{
								boxLabel : '正常'.loc(),
								name : 'tree_type',
								inputValue : '1',
								checked : true
							}, {
								boxLabel : '递归'.loc(),
								name : 'tree_type',
								inputValue : '2'
							}],
					listeners : {
						scope : this,
						change : function(item, checked) {
							this.setFieldsHidden(item.getValue() == '2',
									"parentitem_id", "sonitem_id");
						}
					}
				}, {
					xtype : 'combotree',
					fieldLabel : '选择表'.loc(),
					emptyText : '请选择表'.loc(),
					name : 'tab_id',
					allowBlank : false,
					width : 200,
					queryParam : "type",
					mode : 'remot',
					listWidth : 250,
					height : 100,
					root : new Ext.tree.AsyncTreeNode({
								text : '所有库'.loc(),
								draggable : false,
								allowSelect : false,
								id : this.params.objectId,
								icon : "/themes/icon/all/plugin.gif"
							}),
					loader : new Ext.tree.TreeLoader({
								dataUrl : this.url,
								requestMethod : "POST"
							}),
					listeners : {
						scope : this,
						select : function(combo) {
							this.getCombosValue("1", combo.getValue());
						}
					}
				},
						/*
						 * this.getCombo({ fieldLabel : '选择查询', name :
						 * 'query_id', allowBlank : false, listeners : { scope :
						 * this, select : function(combo) {
						 * this.getCombosValue("2", combo.getValue()); } } }),
						 */
						this.getCombo({
									fieldLabel : '父关联项'.loc(),
									name : 'parentitem_id',
									hidden : true,
									dataType : 'link'
								})]

			}, {
				columnWidth : 0.50,
				layout : 'form',
				border : false,
				items : [/*
							 * this.dataType={ fieldLabel : '数据源类型', name :
							 * 'data_type', width : 150, xtype : 'radiogroup',
							 * items : [{ boxLabel : '数据表', inputValue : '1',
							 * checked : true }, { boxLabel : '查询', inputValue :
							 * '2' }], listeners : { scope : this, check :
							 * function(item, checked) { var tableHidden =
							 * item.getValue() == '1';
							 * this.fields["tab_id"].setVisible(tableHidden);
							 * this.fields["query_id"].setVisible(!tableHidden);
							 * this.setFieldsHidden(tableHidden,"order_column",
							 * "order_type"); if(this.fields["data_type"].prev){
							 * this.fields["data_type"].prev=false; }else{
							 * this.fields["tab_id"].reset();
							 * this.fields["query_id"].reset();
							 * this.fillCombosStore([]); } } } },
							 */		this.getCombo({
									fieldLabel : '标题项'.loc(),
									name : 'titleitem_id',
									dataType : 'tabItem',
									allowBlank : false
								}), this.getCombo({
									fieldLabel : '子关联项'.loc(),
									name : 'sonitem_id',
									hidden : true,
									dataType : 'link'
								})]
			}]
		}, {
			border : false,
			layout : 'form',
			items : [new lib.multiselect.ItemSelector({
								name : "importitem",
								fieldLabel : '导入项'.loc(),
								border : false,
								dataFields : ["value", "text"],
								fromData : [],
								fromStore : new Ext.data.SimpleStore({
											fields : ["text", "value"]
										}),
								toData : [],
								msWidth : 200,
								msHeight : 75,
								drawTopIcon : false,
								drawBotIcon : false,
								valueField : "value",
								displayField : "text",
								imagePath : "/lib/multiselect",
								toLegend : '已选项'.loc(),
								fromLegend : '可选项'.loc()
							}), new lib.multiselect.ItemSelector({
								name : "exportitem",
								border : false,
								fieldLabel : '导出项'.loc(),
								dataFields : ["value", "text"],
								fromData : [],
								toData : [],
								fromStore : new Ext.data.SimpleStore({
											fields : ["text", "value"]
										}),
								drawTopIcon : false,
								drawBotIcon : false,
								msWidth : 200,
								msHeight : 75,
								valueField : "value",
								displayField : "text",
								imagePath : "/lib/multiselect",
								toLegend : '已选项'.loc(),
								fromLegend : '可选项'.loc()
							})]

		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 1.00,
						layout : 'form',
						border : false,
						items : this.authType
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [this.getCombo({
											fieldLabel : '排序字段'.loc(),
											name : 'order_column',
											dataType : 'export'
										}), {
									xtype : 'iconpicker',
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '设置当前节点展开时显示的图标,建议选择16x16的图标'
												.loc()
									},
									width : 24,
									name : 'start_icon',
									defaultImage : "/themes/icon/xp/folder.gif",
									fieldLabel : '开启图标'.loc()
								}]
					}, {
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [{
									fieldLabel : '排序方式'.loc(),
									xtype : 'radiogroup',
									width : 150,
									name : 'order_type',
									items : [{
												boxLabel : '降序'.loc(),
												inputValue : '0',
												name : 'order_type',
												checked : true
											}, {
												boxLabel : '升序'.loc(),
												name : 'order_type',
												inputValue : '1'
											}]
								}, {
									xtype : 'iconpicker',
									defaultImage : "/themes/icon/xp/folder0.gif",
									name : 'end_icon',
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '设置当前节点关闭时显示的图标,建议选择16x16的图标'
												.loc()
									},
									width : 24,
									fieldLabel : '结束图标'.loc()
								}]
					}]
		}, {
			layout : 'form',
			hidden : this.hideTargetPanel,
			border : false,
			items : this.targetPanel.getFirstCombo()
		}, this.targetPanel];
		this.menuBar = new dev.ctrl.TreeMenuField({
					width : 100,
					menu : {
						width : 100,
						items : []
					}
				});

		this.menuBar.menuClick = function(item) {
			this.menuBar.menu.hide();
			if (item.ctrl_id != this.menuBar.getCtrlId()) {
				this.menuBar.setValue(item);
				item.setChecked(true);
				this.params.ctrl_id = item.ctrl_id;
				this.loadServerData();
			}
		}.createDelegate(this);

		this.tbar = [' ', this.menuBar, ' ', '-', ' ', {
			text : '新建'.loc(),
			icon : '/themes/icon/common/new.gif',
			scope : this,
			handler : function() {
				this.menuBar.setValue({
					text : '第'.loc() + (this.menuBar.getSize() + 1) + '层'.loc(),
					ctrl_id : -1
				});
				this.stateId = 'new';
				this.reset();
			}
		}, {
			text : '保存'.loc(),
			icon : '/themes/icon/common/save.gif',
			scope : this,
			handler : this.buttonSave
		}, {
			text : '扩展条件'.loc(),
			icon : '/themes/icon/xp/filter.gif',
			handler : function() {
				loadcss("lib.RowEditorTree.RowEditorTree");
				using("lib.RowEditorTree.RowEditorTree");
				using("dev.ctrl.ListConditionTree");
				using("dev.ctrl.ListCondition");
				var pms = {
					parent_id : this.menuBar.getCtrlId(),
					returnFunction : function(main, id) {
						main.setActiveTab(id);
					}.createCallback(this.mp, this.id)
				};
				var p = new dev.ctrl.ListCondition(pms, "tree", this.mp);
				this.mp.add(p.MainTabPanel);
				this.mp.setActiveTab(p.MainTabPanel);
				p.init(pms);
			}
		}/*
			 * , { text : '设置图标字段', icon :
			 * '/themes/icon/all/application_view_icons.gif', handler :
			 * function() { loadcss("lib.IconPicker.IconPicker");
			 * using("lib.IconPicker.IconPicker");
			 * using('dev.ctrl.TreeIconMap'); var pms = { module_id :
			 * this.params.objectId, ctrl_id : this.menuBar.getCtrlId(),
			 * returnFunction : function(main, id) { main.setActiveTab(id);
			 * }.createCallback(this.mp, this.id) }; var p = new
			 * dev.ctrl.TreeIconMap(pms, this.mp); this.mp.add(p.MainTabPanel);
			 * this.mp.setActiveTab(p.MainTabPanel); p.loadData(pms, this.mp); } }
			 */, {
			text : '删除'.loc(),
			icon : '/themes/icon/common/delete.gif',
			handler : this.buttonDelete
		}, {
			text : '返回'.loc(),
			icon : '/themes/icon/xp/undo.gif',
			handler : this.params.returnFunction
		}];
		for (var i = 5; i < this.tbar.length; i++) {
			this.tbar[i] = new Ext.Toolbar.Button(Ext.apply(this.tbar[i], {
						cls : 'x-btn-text-icon  bmenu',
						scope : this
					}));
		}

		this.toolbuttons = [this.tbar[5], this.tbar[7], this.tbar[8],
				this.tbar[9]];
		dev.ctrl.TreeDefine.superclass.initComponent.call(this);
	},
	loadServerData : function(params) {
		if (params) {
			if (!params.objectId)
				params.objectId = params.parent_id;
			params.meta = true;
			this.params = params;
			delete this.params.ctrl_id;
		}
		Ext.Ajax.request({
					url : this.url,
					params : this.params,
					method : 'GET',
					scope : this,
					success : function(response, options) {
						var o = Ext.decode(response.responseText);
						if (this.rendered) {
							this.fillServerData(o);
						} else {
							this.serverData = o;
						}
					}
				});
	},
	fillServerData : function(o) {
		this.serverData = null;
		if (this.params.meta) {
			var levels = o.meta.levels;
			if (levels && levels.length > 0)
				this.menuBar.loadMenu(levels)
			else
				this.menuBar.reset();
			// this.fields['query_id'].store.loadData(o.meta.query);
			delete this.params.meta;
		}
		if (o.state == 'new') {
			this.params.type = "insert";
			this.reset();
			// this.fields["data_type"].fireEvent('check',this.fields["data_type"],true);
			this.fields["tree_type"].fireEvent('check',
					this.fields["tree_type"], true);
		} else {
			this.params.type = "update";
			this.fillCombosStore(o.tableColumn);
			var d = o.data;
			// this.fields["data_type"].prev=true;
			if (d.data_type == '2') {
				// this.fields["query_id"].setValue(d.tab_id);
			} else {
				this.fields["tab_id"].setValue(d.tab_id);
			}
			delete d.tab_id;
			for (var i in this.fields) {
				if (typeof(d[i]) != 'undefined') {
					this.fields[i].setValue(d[i]);
				}
			}

			this.setStatus("edit");
			if (d.level_num * 1 != this.menuBar.getSize()) {
				this.toolbuttons[3].setDisabled(true);
			}
			if (d.data_type == '2') {
				this.toolbuttons[1].setDisabled(true);
			}
			if (typeof(o.target_type instanceof Array)) {
				this.targetPanel.setValue(o.target_type, this.params.objectId);
			}
		}
		if (this.mask != null) {
			this.mask.hide();
			delete this.mask;
		}
	},
	fillCombosStore : function(data) {
		for (var i in this.fields) {
			var field = this.fields[i];
			if (field.xtype == 'combo' && i != 'query_id') {
				field.reset();
				field.store.loadData(data)
			} else if (field.fromStore) {
				field.reset();
				field.fromStore.loadData(data);
			}
		}
	},
	getCombosValue : function(type, id) {
		Ext.Ajax.request({
					url : this.url,
					params : {
						ntype : type,
						objectId : id
					},
					method : 'DELETE',
					scope : this,
					success : function(response, options) {
						this.fillCombosStore(Ext.decode(response.responseText));
					}
				});
	},
	setStatus : function(state) {
		var disable = (state == 'edit');
		Ext.each(this.toolbuttons, function(item) {
					item.setDisabled(!disable);
				}, this)
		Ext.each(['tree_type', 'tab_id'], function(item) {
					this.fields[item].setDisabled(disable);
				}, this)
		/*
		 * Ext.each(['tree_type', 'tab_id', 'query_id', 'data_type'], function(
		 * item) { this.fields[item].setDisabled(disable); }, this)
		 */
	},
	setFieldsHidden : function(hidden) {
		Ext.each(Array.prototype.slice.call(arguments, 1), function(item) {
					this.fields[item].setVisible(hidden);
				}, this)
	},
	onRender : function(ct, position) {
		dev.ctrl.TreeDefine.superclass.onRender.call(this, ct, position);
		if (this.fields == null) {
			this.fields = {};
			var f = this;
			var fn = function(c) {
				if (c.isFormField && c.name) {
					f.fields[c.name] = c;
				} else if (c.doLayout && c != f) {
					if (c.items) {
						c.items.each(fn);
					}
				}
			}
			f.items.each(fn);
		}
		if (this.serverData != null) {
			this.fillServerData(this.serverData);
		}
	},
	getCombo : function(config) {
		Ext.applyIf(config, {
					hiddenName : config.name,
					triggerAction : 'all',
					displayField : 'text',
					valueField : 'value',
					mode : 'local',
					xtype : 'combo',
					width : 180,
					emptyText : '选择'.loc() + config.fieldLabel,
					listeners : {
						scope : this,
						beforequery : function(qe) {
							// var s = this.fields["data_type"].getValue();
							var m = this.fields["tab_id"];
							/*
							 * var m = (s == '1') ? this.fields["tab_id"] :
							 * this.fields["query_id"];
							 */
							var v = m.getValue();
							if (!v) {
								Ext.msg("warn", '请先'.loc() + m.fieldLabel);
								return false;
							}
						}
					},
					store : new Ext.data.SimpleStore({
								fields : ["text", "value"]
							})
				});
		return config;
	},
	reset : function() {
		for (var i in this.fields) {
			this.fields[i].reset();
			if (this.fields[i].fromStore) {
				this.fields[i].fromStore.removeAll();
			}
		}
		this.params.type = "insert";
		this.setStatus("new");
		this.targetPanel.setValue([0, "", "", "", "", "", "", "", "", ""],
				this.params.objectId);
	},
	buttonSave : function() {
		var saveParams = {
			level_num : this.menuBar.getText().substring(1, 2),
			module_id : this.params.objectId,
			ctrl_id : this.menuBar.getCtrlId(),
			target_type : Ext.encode(this.targetPanel.getValue()),
			ra : Math.random()
		};

		for (var i in this.fields) {
			if (this.fields[i].hidden != true && !this.fields[i].validate()) {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
				return;
			}
			saveParams[i] = this.fields[i].getValue();
		}
		Ext.applyIf(saveParams, this.params);
		Ext.Ajax.request({
					url : this.url,
					method : 'PUT',
					params : saveParams,
					scope : this,
					success : function(response, options) {
						Ext.msg("info", '保存成功'.loc());
						var o = Ext.decode(response.responseText);
						if (o.menu) {
							var item = Ext.applyIf({
										text : '第'.loc()
												+ (this.menuBar.getSize() + 1)
												+ '层'.loc(),
										handler : this.menuBar.menuClick,
										group : 'tz' + this.menuBar.id,
										checked : true
									}, o.menu);
							this.menuBar.setValue(item);
							this.menuBar.menu.add(item);
							this.setStatus("edit");
						}
						this.params.type = 'update';
					},
					failure : function(response, options) {
						var o = Ext.decode(response.responseText);
						Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
										+ o.message);
					}
				});
	},

	buttonDelete : function() {
		Ext.msg('confirm', '警告:删除导航将不可恢复,确认吗?'.loc(), function(answer) {
					if (answer == 'yes') {
						var ctrl_id = this.menuBar.getCtrlId();
						var delParams = Ext.apply({
									ctrl_id : ctrl_id
								}, this.params);
						Ext.Ajax.request({
									url : this.url,
									method : 'DELETE',
									params : delParams,
									success : function(response, options) {
										var o = Ext
												.decode(response.responseText);
										if (o.success) {
											Ext.msg("info", '删除成功'.loc());
											this.params.meta = true;
											delete this.params.ctrl_id;
											this.loadServerData();
										} else {
											Ext.msg("error", '删除失败!,原因:'.loc()
															+ '<br>'
															+ o.message);
										}
									},
									scope : this
								});
					}
				}.createDelegate(this));
	}
});

/*******************************************************************************
 * TreeMenuField
 * 
 ******************************************************************************/
dev.ctrl.TreeMenuField = Ext.extend(Ext.form.TriggerField, {
			emptyText : '第1层'.loc(),
			loadMenu : function(arr) {
				this.menu.removeAll();
				if (arr.length > 0) {
					for (var i = 0; i < arr.length; i++) {
						this.menu.add(Ext.apply(arr[i], {
									handler : this.menuClick,
									group : 'tz' + this.id,
									checked : (i == 0)
								}));
					}
					this.setValue(arr[0]);
				}
			},
			reset : function() {
				this.menu.removeAll();
				this.setValue(this.defaultValue);
			},
			defaultValue : {
				text : '第1层'.loc(),
				ctrl_id : -1
			},
			onRender : function(ct, position) {
				dev.ctrl.TreeMenuField.superclass.onRender.call(this, ct,
						position);
				this.menu = Ext.menu.MenuMgr.get(this.menu);
				this.el.on('mousedown', this.onTriggerClick, this);
			},
			setValue : function(value) {
				if (typeof(value) != 'object') {
					value = this.defaultValue;
				}
				Ext.form.TriggerField.superclass.setValue
						.call(this, value.text);
				this.value = value;
			},
			getValue : function() {
				return this.value;
			},
			getText : function() {
				return this.el.dom.value;
			},
			getCtrlId : function() {
				return this.value.ctrl_id;
			},
			getSize : function() {
				if (this.menu && this.menu.items)
					return this.menu.items.getCount()
				else
					return 0;
			},
			onBeforeTriggerClick : function() {
				return this.value != this.defaultValue;
			},
			onTriggerClick : function() {
				if (this.onBeforeTriggerClick(this) === false)
					return;
				if (this.menu.isVisible()) {
					this.menu.hide();
				} else {
					this.menu.show(this.wrap, "tr-br?");
				}
			}
		});