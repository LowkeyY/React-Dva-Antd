
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
dev.report.base.dlg.PrivateVars =function() {
		this.id = "PrivateVariables";
		this.selectRecord;
		var that = this;
		var activeBook = dev.report.base.app.activeBook;

		var gridData;
		var gridStore = new Ext.data.ArrayStore({
					fields : [ {
								name : "value"
							},{
								name : "name"
							}, {
								name : "privateVar"
							}]
				});
		function cbr(res) {
			if (!res) {
				return
			}
			gridData = res;
			gridStore.loadData(gridData)
		}
		var defaultTypes=[["$P{currentMonth}",'当前月'.loc()]
					 ,["$P{currentYear}",'当前年'.loc()]
					 ,["$P{currentDay}",'当前日期'.loc()]
					 ,["$P{previousYear}",'前一年'.loc()]
					 ,["$P{previousMonth}",'前一月'.loc()]
					 ,["$P{previousDay}",'前一天'.loc()]
					 ,["$P{previousMonthDay}",'上月当前天'.loc()]
					 ,["$P{nextYear}",'下一年'.loc()]
					 ,["$P{nextMonth}",'下一月'.loc()]
					 ,["$P{nextDay}",'下一天'.loc()]
					 ,["$P{nextMonthDay}",'下月当前天'.loc()]
					 ,["$P{ip}",'访问IP地址'.loc()]
					 ,["$P{deptId}",'访问用户部门代码'.loc()]
					 ,["$P{realName}",'访问用户姓名'.loc()]
					 ,["$P{roleName}",'访问用户职位名称'.loc()]
					 ,["$P{status}",'访问用户状态'.loc()]
					 ,["$P{roleId}",'访问用户职位'.loc()]
					 ,["$P{userId}",'访问用户代码'.loc()]
					 ,["$P{parentDept}",'访问用户父部门'.loc()]
					 ,["$P{allParentDept}",'访问用户所有父部门串'.loc()]
					 ,["$P{exportData}",'导入数据代码'.loc()]
					 ,["$P{dataId}",'当前数据代码'.loc()]
		];
		cbr(defaultTypes);

		var grid = new Ext.grid.GridPanel({
					store : gridStore,
					clicksToEdit : 1,
					height : 350,
					cm : new Ext.grid.ColumnModel([{
								id : "name",
								header : "Name".localize(),
								width : 180,
								dataIndex : "name",
								sortable : true
							}, {
								header : "Current Value".localize(),
								width : 180,
								dataIndex : "value",
								sortable : true
							}]),
					stripeRows : true,
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					enableHdMenu : false,
					autoExpandColumn : "name",
					autoWidth : true,
					baseCls : "x-plain",
					viewConfig : {
						forceFit : true
					}
		});
		grid.on("rowclick", function(grid,rowIndex, e) {
			e.stopEvent();
			that.selectRecord = grid.store.getAt(rowIndex);
			Ext.getCmp("applyBtn").enable();
		}, this);
		this.win = new Ext.Window({
			title : "Used Variables".localize(),
			closable : true,
			id : "private-variables",
			autoDestroy : true,
			cls : "default-format-window",
			plain : true,
			constrain : true,
			modal : true,
			resizable : false,
			enableHdMenu : false,
			animCollapse : false,
			width : 440,
			height : 400,
			onEsc : Ext.emptyFn,
			layout : "fit",
			bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
			listeners : {
				close : function() {
					dev.report.base.general.setInputMode(dev.report.base.app.lastInputModeDlg);
					dev.report.base.app.lastInputMode = dev.report.base.grid.GridMode.READY;
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
				}
			},
			items : [grid],
			buttons : [ new Ext.Button({
								text : "Apply".localize(),
								tabIndex : 2,
								disabled : true,
								id : "applyBtn",
								handler : function() {
									applyVars()
								}
							}), new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 3,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		function applyVars() {
			var env = dev.report.base.app.environment, grid = dev.report.base.grid;
			if (env.inputMode != grid.GridMode.READY) {
				return
			}
			var selectVar=that.selectRecord.get("value");
			var selCellCoords = env.selectedCellCoords;
			dev.report.base.app.activePane.setCellValue(selCellCoords[0],selCellCoords[1], selectVar);
			that.win.close();
		}
		this.win.show(this)
}