Ext.namespace('dev.ctrl');
/*******************************************************************************
 * 提供CPM.Action的定制界面的方法<br>
 * 传入Config对象,Config.form用以修改FormPanel的配置<br>
 * Config.grid用以修改Grid配置<br>
 * Config.store用以修改Grid.store配置
 * <p>
 * 返回有两个元素的数组[grid,form],分别是Grid(事件列表)和FormPanel对象(用以修改事件内容)对象
 * <p>
 * 
 * 
 ******************************************************************************/
dev.ctrl.ActionDefine = function(Config) {

	var formId = Ext.id();
	var menuButton = new dev.ctrl.ActionMenuField({
				name : 'action',
				fieldLabel : '操作'.loc(),
				width : 200,
				allowBlank : false,
				menu : {
					width : 200,
					ignoreParentClicks : true,
					items : []
				}
			});
	var targetCombo = new Ext.form.ComboBox({
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				mode : 'local',
				fieldLabel : '目标'.loc(),
				allowBlank : false,
				name : 'target',
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text']
						})
			});
	menuButton.onBeforeTriggerClick = function(btn) {
		return targetCombo.getValue() != '';
	}
	var resetButton = new Ext.Toolbar.Button({
				text : '清空'.loc(),
				width : 80,
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon',
				handler : function() {
					var form = Ext.getCmp(formId);
					form.reset();
				}
			})
	var formConfig = {
		id : formId,
		border : false,
		bodyStyle : 'padding:20px 0px 0px 10px;',
		buttons : [{
					text : '保存'.loc(),
					icon : '/themes/icon/xp/save.gif',
					cls : 'x-btn-text-icon',
					handler : function() {
						var form = Ext.getCmp(formId);
						form.save();
					}
				}, resetButton],
		items : [targetCombo, menuButton, {
					fieldLabel : '参数'.loc(),
					xtype : 'textarea',
					name : 'param',
					anchor : '90% -53'
				}],
		loadData : function(rec) {
			var d = rec.data;
			this.form.setValues({
						action : {
							text : d.action_text,
							value : d.action
						},
						param : d.param,
						target : d.target
					});
			var target = this.form.findField("target");
			target.fireEvent("select", target);
		},
		setPageType : function(pageType) {
			this.pageType = pageType;
		},
		loadMetaData : function(json) {
			var CONS = dev.ctrl.ActionConstant;
			var fm = this.form;
			var target = fm.findField("target");
			var targetType = CONS.targetType
					.concat((json.target instanceof Array) ? json.target : []);
			grid.getStore().targetType = targetType;
			target.store.loadData(targetType);
			var topItems = dev.ctrl.ActionConstant.operationMenu.concat();
			var menu = json.subMenuDefine;
			Ext.each(topItems, function(item) {
						if (menu[item.value]) {
							item.menu = {
								ignoreParentClicks : true,
								items : menu[item.value]
							}
						}
					})
			fm.findField("action").loadMenu(topItems);
			target.selectFirst(true);
		}
	};
	if (Config.form)
		Ext.apply(formConfig, Config.form);

	var form = new Ext.form.FormPanel(formConfig);

	targetCombo.on("select", function(combo, rec, index) {

				var mbtn = this.form.findField("action");
				var value = combo.getValue();
				var arr = new Array(), items = mbtn.menu.items;

				if (value.indexOf("%") != 0 || value == '%undefined') {
					arr = [false, false, false];
				} else if (value == '%window') {
					arr = [true, false, false];
					mbtn.filteSubMenu(0, function(item, id, index, type) {
								item.setVisible(item.type == type);
							}.createDelegate(mbtn, ["%window"], true));
				} else if (value == '%self') {
					arr = [true, true, false];

					mbtn.filteSubMenu(0, function(item, id, index, type) {
								item.setVisible(item.type == type);
							}.createDelegate(mbtn, [this.pageType], true));
				} else {
					arr = [false, false, true];
					mbtn.filteSubMenu(2, function(item, id, index, type) {
								item.setVisible(item.type == type);
							}.createDelegate(mbtn, [value], true));
				}
				items.itemAt(0).setVisible(arr[0]);
				items.itemAt(1).setVisible(arr[1]);
				items.itemAt(2).setVisible(arr[2]);

			}, form)

	var fields = ["action", "action_text", "param", "target", "seq"];

	var storeConfig = {
		recordType : Ext.data.Record.create(fields),
		fields : fields
	}
	if (Config.store)
		Ext.apply(storeConfig, Config.store);

	var oprator = new dev.ctrl.OprateColumn({
				header : '编辑'.loc(),
				width : 50,
				dataIndex : 'button_id'
			});

	var gridConfig = {
		store : new Ext.data.SimpleStore(storeConfig),
		border : false,
		stripeRows : true,
		rowEditMark : null,
		enableHdMenu : false,
		autoExpandColumn : 'action_text',
		frame : false,
		defaultSortable : false,
		plugins : [oprator],
		columns : [new Ext.grid.RowNumberer(), {
					header : '目标'.loc(),
					width : 40,
					dataIndex : 'target',
					renderer : function(v, p, r, rowIndex, i, ds) {
						var targetType = ds.targetType;
						if (targetType instanceof Array) {
							for (var i = 0; i < targetType.length; i++) {
								if (v == targetType[i][0]) {
									v = targetType[i][1];
									break;
								}
							}
						}
						return v;
					}
				}, {
					header : '操作'.loc(),
					dataIndex : 'action_text'
				}, {
					header : '参数'.loc(),
					width : 70,
					dataIndex : 'param'
				}, oprator],
		viewConfig : {
			forceFit : true
		},
		sm : new Ext.grid.RowSelectionModel({
					singleSelect : true
				}),
		iconCls : 'icon-grid',
		getJson : function() {
			var st = this.getStore();
			var ticket = [], list = [], title = [];
			for (var i = 0, count = st.getCount(), r; i < count; i++) {
				r = st.getAt(i).data;
				ticket.push(r);
				var action=r.action;
				if (r.param.trim() != '')
					action+=" "+r.param.trim();
				var pos=action.indexOf(" "),functionName,param="";
				if(pos==-1){
					functionName=action;
				}else{
					functionName=action.substring(0,pos);
					param=action.substring(pos+1);
				}
				list.push([r.target, functionName, param]);
				title.push(r.action_text);
			}
			return {
				data : ticket,
				list : list,
				title : title.join(";")
			}
		}
	};

	if (Config.grid)
		Ext.apply(gridConfig, Config.grid);

	var grid = new Ext.grid.GridPanel(gridConfig);
	grid.onEdit = function(gd, rowIndex) {
		var rec = gd.getStore().getAt(rowIndex);
		form.loadData(rec);
		var sm = gd.getSelectionModel()
		sm.selectRow(rowIndex);
		sm.lock();
		gd.rowEditMark = rec;
		resetButton.setText('取消编辑'.loc());
	}
	grid.on("rowdblclick", grid.onEdit, grid);
	form.save = function() {
		var fm = this.form;
		if (!fm.isValid()) {
			return;
		}

		var action = fm.findField("action").getValue();
		var result = {
			action_text : action.text,
			action : action.value,
			target : fm.findField("target").getValue(),
			param : fm.findField("param").getValue()
		}

		if (grid.rowEditMark == null) {
			var st = grid.getStore()
			result.seq = st.getCount();
			st.add(new st.recordType(result));
		} else {
			var rec = grid.rowEditMark;
			grid.rowEditMark = null;
			Ext.apply(rec.data, result);
		}
		this.reset();
	}
	form.reset = function() {
		var sm = grid.getSelectionModel()
		if (sm.isLocked()) {
			sm.unlock();
			sm.clearSelections();
		}
		this.form.reset();
		resetButton.setText('清空'.loc());
		this.form.findField("target").selectFirst(true);
	}
	return [grid, form];
}
/*******************************************************************************
 * ActionMenuButton
 * 
 * 以后有空再扩展TriggerMenuField控件--tz
 ******************************************************************************/
dev.ctrl.ActionMenuField = Ext.extend(Ext.form.TriggerField, {
			emptyText : '无'.loc(),
			loadMenu : function(arr) {
				this.menu.removeAll();
				this.addHandler(arr);
				for (var i = 0; i < arr.length; i++) {
					this.menu.add(arr[i]);
				}
			},
			addHandler : function(arr) {
				if (!(arr instanceof Array))
					arr = [arr];
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].menu) {
						this.addHandler(arr[i].menu.items)
					} else {
						arr[i].scope = this;
						arr[i].handler = this.menuClick;
					}
				}
			},
			onRender : function(ct, position) {
				dev.ctrl.ActionMenuField.superclass.onRender.call(this, ct,
						position);
				this.menu = Ext.menu.MenuMgr.get(this.menu);
				this.hiddenField = this.el.insertSibling({
							tag : 'input',
							type : 'hidden',
							name : this.name
						}, 'before', true);
				this.el.on('mousedown', this.onTriggerClick, this);
				this.el.dom.removeAttribute('name');
			},
			filteSubMenu : function(index, fn) {
				var menu = this.menu.items.itemAt(index).menu;
				if (menu && menu.items && menu.items.getCount() > 0) {
					menu.items.each(fn)
				}
			},
			setValue : function(value) {
				if (typeof(value) != 'object') {
					value = {
						text : '',
						value : ''
					}
				}
				Ext.form.TriggerField.superclass.setValue
						.call(this, value.text);
				this.value = value;

			},
			getValue : function() {
				return this.value;
			},
			getText : function() {
				return Ext.form.TriggerField.superclass.getValue.call(this);
			},
			onBeforeTriggerClick : function() {
				return true;
			},
			onTriggerClick : function() {
				if (this.onBeforeTriggerClick(this) === false)
					return;
				if (this.menu.isVisible()) {
					this.menu.hide();
				} else {
					this.menu.show(this.wrap, "tr-br?");
				}
			},
			menuClick : function(menuItem) {
				this.setValue({
							value : menuItem.action,
							text : menuItem.action_text
						});
			}
		});
/*******************************************************************************
 * oprateColumn grid操作插件,提供,上移,下移,删除,编辑四个接口
 * <p>
 * 如果需要响应4种按钮的事件,可以根据需要给grid增加以下四个方法:<br>
 * onDelete(Grid grid,Number index);<br>
 * onMoveUp(Grid grid,Number index);<br>
 * onMoveDown(Grid grid,Number index);<br>
 * onEdit(Grid grid,Number index);<br>
 * 四个方法的参数均为Grid和当前行序号. 如果方法返回false,则不执行默认动作<br>
 * 如果Grid的SelectionModel锁定,当前对象不执行任何操作<br>
 * 
 ******************************************************************************/

dev.ctrl.OprateColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};
dev.ctrl.OprateColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('bm-') != -1) {

			e.stopEvent();
			var gd = this.grid;
			if (gd.getSelectionModel().isLocked())
				return;

			var name = t.className;
			var st;

			var index = this.grid.getView().findRowIndex(t);
			if (name.indexOf("delete") != -1) {
				if (typeof(gd.onDelete) == 'function'
						&& gd.onDelete(gd, index) === false) {
					return;
				}
				st = this.grid.getStore();
				var rec = st.getAt(index);
				st.remove(rec);
				if (this.grid.rowEditMark == rec)
					this.grid.rowEditMark = null;
				var view = this.grid.getView();
				view.refresh.defer(10, view);
			} else if (name.indexOf("up") != -1) {
				if (typeof(gd.onMoveUp) == 'function'
						&& gd.onMoveUp(gd, index) === false) {
					return;
				}
				st = this.grid.getStore();
				var f = st.getAt(index).get("seq");
				st.getAt(index).set("seq", st.getAt(index - 1).get("seq"))
				st.getAt(index - 1).set("seq", f);
				st.sort("seq", "asc");
			} else if (name.indexOf("down") != -1) {
				if (typeof(gd.onMoveDown) == 'function'
						&& gd.onMoveDown(gd, index) === false) {
					return;
				}
				st = this.grid.getStore();
				var f = st.getAt(index).get("seq");
				st.getAt(index).set("seq", st.getAt(index + 1).get("seq"))
				st.getAt(index + 1).set("seq", f);
				st.sort("seq", "asc");
			} else if (name.indexOf("edit") != -1) {
				if (typeof(gd.onEdit) == 'function'
						&& gd.onEdit(gd, index) === false) {
					return;
				}
			}
		}
	},
	renderer : function(v, p, record, rowIndex, colIndex, st) {
		var editTitle='点击此按钮或双击行进行编辑'.loc();
		var deleteTitle='删除'.loc();
		var bmup='上移'.loc();
		var bmdown='下移'.loc();
		var count = st.getCount();
		var event = " onmouseover='Ext.get(this).addClass(\"bm-over\")' onmouseout='Ext.get(this).removeClass(\"bm-over\")' ";
		var retVal = '<img '
				+ event
				+ ' class="bm-edit" title="'+editTitle+'" src="/themes/icon/all/pencil.gif">';
		retVal += '<img '
				+ event
				+ ' class="bm-delete" title="'+deleteTitle+'" src="/themes/icon/common/del.gif">';
		if (rowIndex != 0)
			retVal += '<img '
					+ event
					+ ' class="bm-up" title="'+bmup+'"   src="/themes/icon/all/arrow_up.gif">';
		if (rowIndex != count - 1)
			retVal += '<img '
					+ event
					+ ' class="bm-down" title="'+bmdown+'"  src="/themes/icon/all/arrow_down.gif">';
		return '<div style="height:18px">' + retVal + '</div>';
	}
};
/*******************************************************************************
 * 提供定制Action的常量
 ******************************************************************************/
dev.ctrl.ActionConstant = {
	operationMenu : [{
				text : '调用操作'.loc(),
				value : 'doCommand'
			}, {
				text : '弹出控件'.loc(),
				value : 'popupWidget'
			}, {
				text : '调用'.loc(),
				value : 'loadTarget'
			}, {
				text : '调用后台程序'.loc(),
				value : 'callServer'
			}, {
				text : '远程调用'.loc(),
				action_text : '远程调用'.loc(),
				action : 'callUrl'
			}, {
				text : '自定义方法'.loc(),
				action_text : '自定义方法'.loc(),
				action : 'call'
			}],
	targetType : [["%self", '当前Panel'.loc()], ["%window", '当前窗口'.loc()],
			["%undefined", '无'.loc()]]

};