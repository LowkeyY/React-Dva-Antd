using("lib.jsvm.MenuTree");
Ext.namespace("bin", "bin.log");

bin.log.StasticPanel = function() {

	this.xg = Ext.grid;
	this.searchParams = {};
	var ButtonArray = [];

	var today = new Date();
	ButtonArray.push(new Ext.Toolbar.Fill());
	ButtonArray.push('开始日期:'.loc());
	this.firstTime = new Ext.form.DateField({
				name : 'first',
				width : 100,
				format : 'Y/m/d',
				value : today.add(Date.DAY, -7),
				allowBlank : false,
				invalidText : '日期格式必须为:YYYY/MM/DD'.loc(),
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
				invalidText : '日期格式必须为:YYYY/MM/DD'.loc(),
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

	this.stasticDS = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/bin/log/getstastic.jcp",
							method : 'GET'
						}),
				autoLoad : false,
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : '日期'
						}, [{
									name : '日期',
									mapping : '日期'
								}, {
									name : '当日访问人数',
									type : 'int'
								}, {
									name : '当日访问人次',
									type : 'int'
								}, {
									name : '当日使用时间(分钟)',
									type : 'int'
								}, {
									name : '单次停留(分钟)',
									type : 'int'
								}]),
				remoteSort : true
			});
	this.stasticDS.setDefaultSort('日期', 'desc');

	this.cm = new Ext.grid.ColumnModel([new this.xg.RowNumberer(), {
				id : '日期',
				header : '日期'.loc(),
				dataIndex : '日期',
				sortable : true,
				align : 'right'
			}, {
				header : '当日访问人数'.loc(),
				dataIndex : '当日访问人数',
				sortable : true,
				align : 'right'
			}, {
				header : '当日访问人次'.loc(),
				dataIndex : '当日访问人次',
				sortable : true,
				align : 'right'
			}, {
				header : '当日使用时间'.loc()+'('+'分钟'.loc()+')',
				dataIndex : '当日使用时间(分钟)',
				sortable : true,
				align : 'right'
			}, {
				header : '单次停留'.loc()+'('+'分钟'.loc()+')',
				dataIndex : '单次停留(分钟)',
				sortable : true,
				align : 'right'
			}]);
	this.cm.defaultSortable = true;
	this.StasticGrid = new Ext.grid.GridPanel({
				title : '访问统计'.loc(),
				store : this.stasticDS,
				cm : this.cm,
				trackMouseOver : true,
				loadMask : {
					msg : '数据载入中...'.loc()
				},
				listeners : {
					activate : this.handleActivate,
					scope : this
				},
				viewConfig : {
					forceFit : true,
					enableRowBody : true,
					showPreview : true,
					getRowClass : this.applyRowClass
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 30,
							store : this.stasticDS,
							displayInfo : true,
							displayMsg : '{0}-{1}条 共:{2}条'.loc(),
							emptyMsg : '没有数据'.loc()
						})
			});
	this.ds1 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/bin/log/userstat.jcp",
							method : 'GET'
						}),
				autoLoad : false,
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : '姓名'
						}, [{
									name : '姓名',
									mapping : '姓名'
								}, {
									name : '访问次数',
									type : 'int'
								}, {
									name : '使用时间(分钟)',
									type : 'int'
								}, {
									name : '最后访问时间'
								}]),
				remoteSort : true
			});
	this.ds1.setDefaultSort('姓名', 'desc');

	this.cm1 = new Ext.grid.ColumnModel([new this.xg.RowNumberer(), {
				id : '姓名',
				header : '姓名'.loc(),
				dataIndex : '姓名',
				sortable : true,
				align : 'right'
			}, {
				header : '访问次数'.loc(),
				dataIndex : '访问次数',
				sortable : true,
				align : 'right'
			}, {
				header : '使用时间'.loc()+'('+'分钟'.loc()+')',
				dataIndex : '使用时间(分钟)',
				sortable : true,
				align : 'right'
			}, {
				header : '最后访问时间'.loc(),
				dataIndex : '最后访问时间',
				sortable : true,
				align : 'right'
			}]);
	this.cm1.defaultSortable = true;
	this.UserStatGrid = new Ext.grid.GridPanel({
				title : '访问列表'.loc(),
				store : this.ds1,
				cm : this.cm1,
				trackMouseOver : false,
				loadMask : {
					msg : '数据载入中...'.loc()
				},
				listeners : {
					activate : this.handleActivate,
					scope : this
				},
				viewConfig : {
					forceFit : true,
					enableRowBody : true,
					showPreview : true,
					getRowClass : this.applyRowClass
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 30,
							store : this.ds1,
							displayInfo : true,
							displayMsg : '{0}-{1}条 共:{2}条'.loc(),
							emptyMsg : '没有数据'.loc()
						})
			});
	this.UserStatGrid.on('render', function() {
				this.ds1.baseParams = this.searchParams;
				this.ds1.load({
							params : {
								start : 0,
								limit : 30
							}
						});
			}, this);
	this.StasticGrid.on('render', function() {
				this.stasticDS.baseParams = this.searchParams;
				this.stasticDS.load({
							params : {
								start : 0,
								limit : 30
							}
						});
			}, this)

	this.visitPicPanel = new Ext.Panel({
				title : '系统访问曲线'.loc(),
				listeners : {
					activate : this.handleActivate,
					scope : this
				}
			});

	this.userVisitPicPanel = new Ext.Panel({
				title : '用户访问统计曲线'.loc(),
				listeners : {
					activate : this.handleActivate,
					scope : this
				}
	});

	this.mainPanel = new Ext.TabPanel({
				border : false,
				activeTab : 0,
				tabPosition : 'top',
				tbar : ButtonArray,
				items : [this.StasticGrid, this.UserStatGrid,
						this.visitPicPanel, this.userVisitPicPanel]
			});
	// --------------------------

	bin.log.StasticPanel.superclass.constructor.call(this, {
				region : 'center',
				collapsible : false,
				split : true,
				layout : 'fit',
				margins : '0 0 0 0',
				items : this.mainPanel
	});
};

Ext.extend(bin.log.StasticPanel, Ext.Panel, {
	handleActivate : function(tab) {
		if (tab.title == '系统访问曲线'.loc()) {
			var tabContainer = tab.body;
			tabContainer.dom.innerHTML = '';
			tabContainer.createChild({
						tag : 'img ',
						src : '/bin/log/pic.jcp?firtim='
								+ this.firstTime.getRawValue() + '&sectim='
								+ this.secondTime.getRawValue()
								+ '&curve=1&view=1&height='
								+ tab.getInnerHeight() + '&width='
								+ tab.getInnerWidth() + '&ran=' + Math.random(),
						border : '0'
					});
		}else if (tab.title == '用户访问统计曲线'.loc()) {
			var tabContainer = tab.body;
			tabContainer.dom.innerHTML = '';
			tabContainer.createChild({
						tag : 'img ',
						src : '/bin/log/pic.jcp?firtim='
								+ this.firstTime.getRawValue() + '&sectim='
								+ this.secondTime.getRawValue()
								+ '&curve=2&order=2&view=2&height='
								+ tab.getInnerHeight() + '&width='
								+ tab.getInnerWidth() + '&ran=' + Math.random(),
						border : '0'
					});
		}
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
				if (activeTab.title == '访问统计'.loc()) {
					this.stasticDS.baseParams = this.searchParams;
					this.stasticDS.load({
								params : {
									start : 0,
									limit : 30
								}
							});
				} else if (activeTab.title == '访问列表'.loc()) {
					this.ds1.baseParams = this.searchParams;
					this.ds1.load({
								params : {
									start : 0,
									limit : 30
								}
							});
				} else if (activeTab.title == '系统访问曲线'.loc()) {
					var tabContainer = this.tab.body;
					tabContainer.dom.innerHTML = '';
					tabContainer.createChild({
								tag : 'img ',
								src : '/bin/log/pic.jcp?firtim='
										+ this.firstTime.getRawValue()
										+ '&sectim='
										+ this.secondTime.getRawValue()
										+ '&curve=1&view=1&height='
										+ activeTab.getInnerHeight()
										+ '&width=' + activeTab.getInnerWidth(),
								border : '0'
							});
				} else if (activeTab.title == '用户访问统计曲线'.loc()) {
					var tabContainer = this.tab.body;
					tabContainer.dom.innerHTML = '';
					tabContainer.createChild({
								tag : 'img ',
								src : '/bin/log/pic.jcp?firtim='
										+ this.firstTime.getRawValue()
										+ '&sectim='
										+ this.secondTime.getRawValue()
										+ '&curve=2&order=2&view=2&height='
										+ activeTab.getInnerHeight()
										+ '&width=' + activeTab.getInnerWidth(),
								border : '0'
							});
				}
			}
		}
	}
});
