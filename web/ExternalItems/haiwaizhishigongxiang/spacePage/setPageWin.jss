Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");

ExternalItems.haiwaizhishigongxiang.spacePage.setPageWin = function( btn, allData, userData) {
	this.init( btn, allData, userData);
}

ExternalItems.haiwaizhishigongxiang.spacePage.setPageWin.prototype = {
	init : function(btn, allData, userData) {
		var _this = this;

		btn.setDisabled(true);

		this.allData = allData;
		this.useData = userData;

		this.dataDX = (function() {
			var tmp = new Array();
			Ext.each(_this.allData, function(v1, i1) {
						var use = false;
						Ext.each(_this.useData, function(v2, i2) {
									if (v1.class_name == v2.class_name) {
										use = true;
									}
								});
						if (!use) {
							tmp.push(v1);
						}
					});
			return tmp;
		})();

		// Generic fields array to use in both store defs.
		this.fields = [{
					name : 'object_name'
				}, {
					name : 'about'
				}];

		// create the data store
		this.firstGridStore = new Ext.data.JsonStore({
					fields : this.fields,
					data : {
						records : this.dataDX
					},
					root : 'records'
				});

		// declare the source Grid
		this.firstGrid = new Ext.grid.GridPanel({
					ddGroup : 'secondGridDDGroup',
					store : this.firstGridStore,
					columns : [{
						id : 'object_name',
						header : "模块名称",
						width : 100,
						sortable : true,
						dataIndex : 'object_name',
						renderer : function(value, cellmeta, record) {
							var conHTML = "<div ext:qtip='" + record.data.about
									+ "'>" + value + "</div>";
							return conHTML;
						}
					}],
					enableDragDrop : true,
					stripeRows : true,
					autoExpandColumn : 'object_name',
					title : "所有模块"
				});

		// create the destination Grid
		this.secondGrid = new Ext.grid.GridPanel({
					ddGroup : 'firstGridDDGroup',
					store : this.getSecondGridStore(),
					columns : [{
						id : 'object_name',
						header : "模块名称",
						width : 100,
						sortable : true,
						dataIndex : 'object_name',
						renderer : function(value, cellmeta, record) {
							var conHTML = "<div ext:qtip='" + record.data.about
									+ "'>" + value + "</div>";
							return conHTML;
						}
					}],
					enableDragDrop : true,
					stripeRows : true,
					autoExpandColumn : 'object_name',
					title : "已选模块"
				});

		this.mainPanel = new Ext.Window({
			title : "设置桌面模块",
			width : 700,
			height : 400,
			layout : 'hbox',
			resizable : false,
			defaults : {
				flex : 1,
				border : false
			},
			layoutConfig : {
				align : 'stretch'
			},
			tbar : ["用鼠标从<span style= 'font-weight: bold'>[所有模块]</span>中选中并拖至<span style= 'font-weight: bold'>[已选模块]</span>栏即可"],
			buttons : [{
						text : "保存",
						iconCls : 'iportal-icon-btn-save',
						handler : function() {
							_this.saveMySelf(true);
						}
					}, {
						text : "关闭",
						handler : function() {
							_this.mainPanel.close();
						}
					}],
			items : [this.firstGrid, this.secondGrid],
			listeners : {
				close : function() {
					btn.setDisabled(false);
				},
				afterrender : function() {
					var firstGridDropTargetEl = _this.firstGrid.getView().scroller.dom;
					var firstGridDropTarget = new Ext.dd.DropTarget(
							firstGridDropTargetEl, {
								ddGroup : 'firstGridDDGroup',
								notifyDrop : function(ddSource, e, data) {
									var records = ddSource.dragData.selections;
									Ext.each(records,
											ddSource.grid.store.remove,
											ddSource.grid.store);
									_this.firstGrid.store.add(records);
									_this.firstGrid.store.sort('name', 'ASC');
									return true
								}
							});

					var secondGridDropTargetEl = _this.secondGrid.getView().scroller.dom;
					var secondGridDropTarget = new Ext.dd.DropTarget(
							secondGridDropTargetEl, {
								ddGroup : 'secondGridDDGroup',
								notifyDrop : function(ddSource, e, data) {
									var records = ddSource.dragData.selections;
									Ext.each(records,
											ddSource.grid.store.remove,
											ddSource.grid.store);
									_this.secondGrid.store.add(records);
									_this.secondGrid.store.sort('name', 'ASC');
									return true
								}
							});
				}
			}
		}).show();
	},

	getSecondGridStore : function() {
		this.secondGridStore = new Ext.data.JsonStore({
					fields : this.fields,
					root : 'records',
					data : {
						records : this.useData
					}
				});
		return this.secondGridStore;
	},

	saveMySelf : function(isSave) {
		var _this = this;

		this.useData = new Array();
		Ext.each(this.secondGrid.store.data.items, function(v, i) {
					_this.useData.push(Ext.apply(v.json, {column : 2}));
				});

		Ext.getCmp("HWSpaceIndexpageId").doLayoutTheItems(this.useData,true,true);

		if (isSave) {
			Ext.getCmp("HWSpaceIndexpageId").savePosition();
		}
	}
}