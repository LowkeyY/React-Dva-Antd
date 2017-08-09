Ext.namespace("dev.program");

dev.program.LogEvent = Ext.extend(Ext.form.TriggerField, {

	triggerClass : 'x-form-search-trigger',
	windowConfig : {},
	widgetTitle : null,
	popupHeight : 500,
	popupWidth : 640,
	beforeBlur : Ext.emptyFn,

	initComponent : function() {
		this.widgetTitle = '事件编辑'.loc();
	},

	onDestroy : function() {
		delete this.geditor;
		if (this.window)
			this.window.destroy();
	},

	setValue : function(value, text) {
		dev.program.LogEvent.superclass.setValue.call(this, value);
		this.value = value;
	},

	getValue : function() {
		return this.value;
	},

	showWin : function() {
		this.geditor.selectSameEditor = true;
		this.window.show();
	},

	onTriggerClick : function() {
		if (!this.window) {
			usecss("lib.RowEditorGrid.RowEditor");
			using("lib.RowEditorGrid.RowEditor");

			var EventProp = Ext.data.Record.create([{
						name : 'event',
						type : 'string'
					}, {
						name : 'prop',
						type : 'string'
					}]);

			var store = new Ext.data.JsonStore({
						root : 'events',
						fields : ['event', 'prop'],
						sortInfo : {
							field : 'event',
							direction : 'ASC'
						}
					});

			if (this.value != '') {
				store.loadData(Ext.decode(this.value));
			}

			var editor = new lib.RowEditorGrid.RowEditor({
						saveText : '保存'.loc(),
						cancelText : '取消'.loc(),
						commitChangesText : '请保存或取消所做的修改'.loc(),
						errorText : '提示'.loc()
					});

			var grid = new Ext.grid.GridPanel({
						store : store,
						width : 640,
						height : 300,
						region : 'center',
						autoExpandColumn : 'event',
						plugins : [editor],
						tbar : [{
									text : '添加新的事件'.loc(),
									icon : '/themes/icon/xp/new.gif',
									handler : function() {
										var e = new EventProp({
													event : 'save',
													prop : '@[]'
												});
										editor.stopEditing();
										store.insert(0, e);
										grid.getView().refresh();
										grid.getSelectionModel().selectRow(0);
										editor.startEditing(0);
									}
								}, {
									ref : '../removeBtn',
									text : '删除所选事件'.loc(),
									icon : '/themes/icon/xp/delete.gif',
									disabled : true,
									handler : function() {
										editor.stopEditing();
										var s = grid.getSelectionModel()
												.getSelections();
										for (var i = 0, r; r = s[i]; i++) {
											store.remove(r);
										}
									}
								}, {
									text : '保存'.loc(),
									icon : '/themes/icon/xp/save.gif',
									scope : this,
									handler : function() {
										editor.stopEditing();
										this.setValue(Ext.encode({
													events : store
															.toJsonArray()
												}));
										this.window.close();
									}
								}],

						columns : [new Ext.grid.RowNumberer(), {
							id : 'event',
							header : '事件'.loc(),
							dataIndex : 'event',
							width : 60,
							sortable : true,

							editor : {
								xtype : 'combo',
								mode : "local",
								displayField : "event",
								triggerAction : "all",
								store : new Ext.data.SimpleStore({
											fields : ['event'],
											data : [['save'], ['beforesave'],
													['update'],
													['beforeupdate'],
													['delete'],
													['beforedelete'],
													['getdata'],
													['beforegetdata'],
													['getmodel'],
													['beforegetmodel']]
										}),
								allowBlank : false
							}
						}, {
							header : '属性'.loc(),
							dataIndex : 'prop',
							width : 440,
							sortable : true,
							editor : {
								xtype : 'textfield',
								allowBlank : false
							}
						}]
					});

			this.chart = new Ext.Panel({
				width : 640,
				height : 200,
				autoScroll : true,
				margins : '5 0 0 0',
				bodyStyle : 'padding:5 5 0 10;',
				region : 'south',
				html : '<div style="font-size:12px;font-family:'+'微软雅黑'+'"><pre>'
						+ '<b>                                '+'属性列设置方式'.loc()+'</b><br>'
						+ '  说明:参数包含在格式如'.loc()+'@[]'+'的括号内'.loc()+'.<br>'
						+ '  固定参数'.loc()+': @[programTitle] '+'表示当前模块名称'.loc()+', @[primaryKey] '+'代表主键'.loc()+'.<br>'
						+ '  其它界面参数'.loc()+',参考关联表内的物理字段名称'.loc()+'.<b>'+'注意,这些字段在删除事件时无效.'.loc()+'</b><br>'
						+ '  例'.loc()+':@[realName]'+'在'.loc()+'@[currentDay]'+'对'.loc()+'@[programTitle]'+'进行了保存操作;'.loc()+'<br>'
						+ '  @[realName]'+'在'.loc()+'@[currentDay] @[currentTime]'+'删除了'.loc()+'@[programTitle]'+'的'.loc()+'@[primaryKey].<br>'
						+ '<b>                               '+'系统已定义参数列表'.loc()+'</b><br>'
						+ '  currentMonth:'+'当前月'.loc()+'---'+'例'.loc()+':2011/03              currentYear:'+'当前年'.loc()+'---'+'例'.loc().loc()+':2011<br>'
						+ '  currentDay:'+'当前日'.loc()+'---'+'例'.loc().loc()+':2011/03/15       currentTime:'+'当前时间'.loc()+'---'+'例'.loc()+':10:44:20<br>'
						+ '  previousYear:'+'前一年'.loc()+'---'+'例'.loc()+':2010                 previousMonth:'+'前一月'.loc()+'---'+'例'.loc()+':2011/02<br>'
						+ '  previousDay:'+'前一日'.loc()+'---'+'例'.loc()+':2011/03/14            previousMonthDay:'+'上一月的今天'.loc()+'---'+'例'.loc()+':2011/02/15<br>'
						+ '  nextYear:'+'下一年'.loc()+'---'+'例'.loc()+':2012                     nextMonth:'+'下一月'.loc()+'---'+'例'.loc()+':2011/08<br>'
						+ '  nextDay:'+'下一日'.loc()+'---'+'例'.loc()+':2011/03/16                nextMonthDay:'+'下一月日'.loc()+'---'+'例'.loc()+':2011/04/15<br>'
						+ '  ip:'+'当前ip地址'.loc()+'---'+'例'.loc()+':192.168.0.1                deptId:'+'当前用户所在部门的ID'.loc()+'---'+'例'.loc()+':1011 <br>'
						+ '  realName:'+'当前用户真实姓名'.loc()+'---'+'例'.loc()+':张三'.loc+     'roleName:'+'当前用户职位名称'.loc()+'---'+'例'.loc()+':局长'.loc()+'<br>'
						+ '  status:'+'当前用户状态'.loc()+'---'+'例'.loc()+':已禁用'.loc+		   'portalId:'+'当前用户所在门户ID'.loc()+'---'+'例'.loc()+':100053<br>'
						+ '  roleId:'+'当前用户职位ID'.loc()+'---'+'例'.loc()+':2136               userId:'+'当前用户ID'.loc()+'---'+'例'.loc()+':1024<br>'
						+ '<b>                                  '+'后置运算符'.loc()+'</b> <br>'
						+ '  currentMonth,currentYear,currentDay'+'支持后置运算符'.loc()+',<br>'
						+ '  目前只支持加减号'.loc()+'(+,-).'+'如当前日期为'.loc()+'2011/03/15,'+'则'.loc()+'@[currentDay+10]'+'为'.loc()+'\'2011/03/25\'</pre></div>'
			});

			this.layout = new Ext.Panel({
						layout : 'border',
						border : false,
						width : 600,
						height : 600,
						items : [this.chart, grid]
					});

			grid.getSelectionModel().on('selectionchange', function(sm) {
						grid.removeBtn.setDisabled(sm.getCount() < 1);
					});

			this.windowConfig = Ext.apply(this.windowConfig, {
						title : this.widgetTitle,
						width : this.popupWidth,
						height : this.popupHeight,
						autoScroll : true,
						modal : true,
						layout : 'fit',
						items : this.layout,
						shadow : false,
						frame : true
					});

			this.window = new Ext.Window(this.windowConfig);
			this.window.on('beforeclose', function() {
						this.el.focus();
						this.window.hide();
						this.geditor.selectSameEditor = false;
						return false;
					}, this);
		}

		this.showWin();
	}

});
Ext.reg('logevent', dev.program.LogEvent);