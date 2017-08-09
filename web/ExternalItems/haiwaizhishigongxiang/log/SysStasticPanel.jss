using("ExternalItems.haiwaizhishigongxiang.log");
Ext.namespace("ExternalItems.haiwaizhishigongxiang");
Ext.namespace("ExternalItems.haiwaizhishigongxiang.log");

ExternalItems.haiwaizhishigongxiang.log.SysStasticPanel = function() {

	this.xg = Ext.grid;

	this.searchParams = {};

	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar);

	var today = new Date();
	ButtonArray.push(new Ext.Toolbar.Fill());
	ButtonArray.push('开始日期:'.loc());
	this.firstTime = new Ext.form.DateField({
				name : 'first',
				width : 100,
				format : 'Y/m/d',
				value : today.add(Date.DAY, -7),
				allowBlank : false,
				invalidText : '日期格式必须为'.loc()+':YYYY/MM/DD',
				blankText : '起始日期必须提供.'.loc()
			});
	ButtonArray.push(this.firstTime);
	ButtonArray.push('结束日期:'.loc());
	this.secondTime = new Ext.form.DateField({
				name : 'second',
				width : 100,
				format : 'Y/m/d',
				value : today,
				allowBlank : false,
				invalidText : '日期格式必须为'.loc()+':YYYY/MM/DD',
				blankText : '起始日期必须提供.'.loc()
			});
	ButtonArray.push(this.secondTime);

	var searchButton = new Ext.Toolbar.Button({
				text : '过滤'.loc(),
				icon : '/themes/icon/xp/selectlink.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : this.onButtonClick
			});
	ButtonArray.push(searchButton);

	function showDetail(grid) {

		var arr = grid.getSelectionModel().getSelections();
		if (arr.length > 1) {
			Ext.msg('warn', '请选择一行数据'.loc());
		} else if (arr.length == 0) {
			Ext.msg('warn', '没有选择数据'.loc());
		} else {
			Ext.Ajax.request({
						url : "/ExternalItems/haiwaizhishigongxiang/log/logText.jcp",
						method : 'POST',
						params : arr[0].data,
						scope : this,
						success : function(response, options) {

							var win = new Ext.Window({
										title : '日志详细信息'.loc(),
										modal : true,
										layout : 'fit',
										height : 500,
										width : 695,
										buttons : [{
													text : '关闭'.loc(),
													handler : function() {
														win.close();
													}
												}],
										items : {
											layout : 'fit',
											border : false,
											html : response.responseText

										}
									});
							win.show();
						}
					});
		}

	}

	this.logButton = new Ext.Toolbar.Button({
				text : '详细信息'.loc(),
				icon : '/themes/icon/all/find.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hideLabel : false,
				handler : function(btn) {
					showDetail(this.gride);
				}
			});
	ButtonArray.push(this.logButton);

	
	this.jibie = new Ext.Toolbar.TextItem({
				text : '&nbsp;&nbsp;&nbsp;'+'级别:'.loc(),
				hidden : false
	});
	ButtonArray.push(this.jibie);
	this.com = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['ids', 'label'],
							data : [['10', '调试信息'.loc()], ['40', '错误报告'.loc()],
									['20', '日志提示'.loc()], ['0', '跟踪日志'.loc()], ['30', '警告'.loc()]]
						}),
				valueField : 'ids',
				displayField : 'label',
				triggerAction : 'all',
				width : 100,
				hidden : false,
				mode : 'local'
			});
	ButtonArray.push(this.com);

	this.neirong = new Ext.Toolbar.TextItem({
				text : '&nbsp;&nbsp;&nbsp;'+'内容:'.loc(),
				hidden : false

			});
	ButtonArray.push(this.neirong);

	this.conText = new Ext.form.TextField({
				width : 100,
				hidden : false,
				maxLength : 24

			});
	ButtonArray.push(this.conText);

	this.leixing = new Ext.Toolbar.TextItem({
				text : '&nbsp;&nbsp;&nbsp;'+'类型:'.loc(),
				hidden : false
			});
	ButtonArray.push(this.leixing);
	this.catText = new Ext.form.TextField({
				width : 80,
				hidden : false,
				maxLength : 24

			});
	ButtonArray.push(this.catText);

	this.reder = new Ext.Toolbar.TextItem({
				text : '&nbsp;&nbsp;&nbsp;'+'记录者:'.loc(),
				hidden : false
			});
	ButtonArray.push(this.reder);
	this.userId = new Ext.form.TextField({
				width : 60,
				hidden : false,
				maxLength : 24

			});
	ButtonArray.push(this.userId);


	function pctChange(data) {
		if (data == 0) {
			return '跟踪日志'.loc();
		} else if (data == 10) {
			return '调试信息'.loc();
		} else if (data == 20) {
			return '日志提示'.loc();
		} else if (data == 30) {
			return '警告'.loc();
		} else if (data == 40) {
			return '错误报告'.loc();
		}
		return data;
	}
	function change(data) {
		if (data.length == 10) {
			return data + '......';
		}
		return data;
	}
	var strTitle = '模块导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+strTitle+'" url="/bin/log/modu.jcp?rootNode=0&amp;_id=0&amp;type=5"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.imagePanel = new Ext.Panel({

				region : 'center'

			});

	var eve = this;

	var titleClick = function(clickNode) {

		var objectId = clickNode.prop._id;

		if (clickNode.prop.objectType == '5') {

			var tab = eve.imagePanel;
			var tabContainer = tab.body;
			eve.firstTime.objectId = objectId;
			tabContainer.dom.innerHTML = '';
			tabContainer.createChild({
						tag : 'img ',
						src : '/ExternalItems/haiwaizhishigongxiang/log/image.jcp?id=' + objectId + '&firtim='
								+ eve.firstTime.getRawValue() + '&sectim='
								+ eve.secondTime.getRawValue()
								+ '&curve=1&view=1&height='
								+ tab.getInnerHeight() + '&width='
								+ tab.getInnerWidth() + '&ran=' + Math.random(),
						border : '0'
					});
		}

	}
	this.event0 = new Object();
	this.event0.title_click = function() {
		titleClick(this);
	};

	this.menuTree.setEvent("event0", this.event0);

	this.treePanel = new Ext.Panel({
				region : 'west',
				width : 250

			})

	this.moduPanel = new Ext.Panel({
				title : '模块日志统计图'.loc(),
				layout : 'border',
				listeners : {
					activate : this.handleActivate,
					scope : this
				},
				items : [this.treePanel, this.imagePanel]
			});

	this.treePanel.on("render", function() {
				this.menuTree.finish(this.treePanel.body.dom, document);
			}, this);
	// --------------------------

	var store = new Ext.data.JsonStore({
		url : "/ExternalItems/haiwaizhishigongxiang/log/Log.jcp",
		fields : ["ENTRY_DATE", "LOG_LEVEL", "CONTENT", "CATEGORY", "RECORDER"],
		scope : this,
		totalProperty : 'totalNumber',
		autoLoad : true,
		root : 'data'
	});
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '日志日期'.loc(),
				width : 180,
				sortable : true,
				align : 'center',
				defaultSortable : true,
				dataIndex : 'ENTRY_DATE'
			}, {

				header : '日志级别'.loc(),
				width : 120,
				sortable : true,
				align : 'center',
				dataIndex : 'LOG_LEVEL',
				renderer : pctChange
			}, {
				header : '日志内容'.loc(),
				width : 350,
				sortable : true,
				align : 'center',
				dataIndex : 'CONTENT',
				renderer : change
			}, {
				header : '日志类型'.loc(),
				width : 240,
				sortable : true,
				align : 'center',
				dataIndex : 'CATEGORY'
			}, {
				header : '记录者'.loc(),
				width : 120,
				sortable : true,
				align : 'center',
				dataIndex : 'RECORDER'
			}]);
	var pagingBar = new Ext.PagingToolbar({
				pageSize : 50,
				store : store,
				displayInfo : true,
				displayMsg : '{0}-{1}条 共:{2}条'.loc(),
				emptyMsg : '没有数据'.loc()

			});
	this.gride = new Ext.grid.GridPanel({
				store : store,
				cm : cm,
				stripeRows : true,
				width : 400,
				title : '日志信息列表'.loc(),
				loadMask : {
					msg : '数据载入中...'.loc()
				},
				listeners : {
					activate : this.handleActivate,
					scope : this
				},
				bbar : pagingBar

			});
	this.gride.on("dblclick",function(){
		showDetail(this.gride);
	},this)
	this.mainPanel = new Ext.TabPanel({
				border : false,
				activeTab : 0,
				tabPosition : 'top',
				tbar : ButtonArray,
				items : [ this.gride]
	});
	// --------------------------

	ExternalItems.haiwaizhishigongxiang.log.SysStasticPanel.superclass.constructor.call(this, {
				region : 'center',
				collapsible : false,
				split : true,
				layout : 'fit',
				margins : '0 0 0 0',
				items : this.mainPanel
			});
};

Ext.extend(ExternalItems.haiwaizhishigongxiang.log.SysStasticPanel, Ext.Panel, {
	handleActivate : function(tab) {
		this.tab = tab;
		this.logButton.setVisible(tab.title == '日志信息列表'.loc());
		this.neirong.setVisible(tab.title == '日志信息列表'.loc());
		this.leixing.setVisible(tab.title == '日志信息列表'.loc());
		this.reder.setVisible(tab.title == '日志信息列表'.loc());
		this.com.setVisible(tab.title == '日志信息列表'.loc());
		this.conText.setVisible(tab.title == '日志信息列表'.loc());
		this.catText.setVisible(tab.title == '日志信息列表'.loc());
		this.userId.setVisible(tab.title == '日志信息列表'.loc());
		this.jibie.setVisible(tab.title == '日志信息列表'.loc());

	},

	onButtonClick : function() {
		if (this.firstTime.isValid() && this.secondTime.isValid()) {
			if (this.firstTime.getValue() > this.secondTime.getValue()) {
				Ext.msg("error", '起始日期不能晚于中止日期!'.loc());
			} else {
				var activeTab = this.mainPanel.getActiveTab();
				this.searchParams[this.firstTime.getName()] = this.firstTime
						.getRawValue();
				this.searchParams[this.secondTime.getName()] = this.secondTime
						.getRawValue();
				 if (activeTab.title == '模块日志统计图'.loc()) {
					var tabContainer = this.imagePanel.body;
					tabContainer.dom.innerHTML = '';
					tabContainer.createChild({
								tag : 'img ',
								src : '/ExternalItems/haiwaizhishigongxiang/log/image.jcp?id='
										+ this.firstTime.objectId + '&firtim='
										+ this.firstTime.getRawValue()
										+ '&sectim='
										+ this.secondTime.getRawValue()
										+ '&curve=2&order=2&view=2&height='
										+ activeTab.getInnerHeight()
										+ '&width=' + activeTab.getInnerWidth(),
								border : '0'

							});

				} else if (activeTab.title == '日志信息列表'.loc()) {

					this.gride.getStore().load({
						method : 'POST',
						params : {
							fTime : this.firstTime.getValue().format('Y/m/d'),
							sTime : this.secondTime.getValue().add(Date.DAY, 1)
									.format('Y/m/d'),
							combo : this.com.getValue(),
							conText : this.conText.getValue(),
							catText : this.catText.getValue(),
							userId : this.userId.getValue()

						}

					});

				}
			}
		}
	}
});
