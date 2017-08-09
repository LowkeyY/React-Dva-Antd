
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

dev.report.base.dlg.HlVarList =function(getVar, preselection) {
		dev.report.base.dlg.HlVarList.parent.constructor.call(this);
		this.id = "wHlVarList_dlg_wnd";
		var that = this;
		var rawData = dev.report.backend.ccmd(0, ["gvls"]);
		var vGridData = [];
		if (rawData[0][0]) {
			var vars = rawData[0][1];
			for (var q = 0; q < vars.length; q++) {
				vGridData.push([vars[q]])
			}
			if (vars.length < 1) {
				vGridData = []
			}
		}
		var vGridStore = new Ext.data.SimpleStore({
					fields : [{
								name : "variable"
							}]
				});
		vGridStore.loadData(vGridData);
		var _selectedVar;
		var vGrid = new Ext.grid.GridPanel({
					id : "wHlVarList_vlist_grd",
					store : vGridStore,
					columns : [{
								id : "vars",
								header : "Variable name",
								width : 200,
								sortable : false,
								dataIndex : "variable"
							}],
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					width : 215,
					height : 210,
					frame : true,
					autoExpandColumn : "vars",
					baseCls : "x-plain",
					listeners : {
						rowclick : function(gr, index, e) {
							_selectedVar = vGridData[index][0]
						}
					}
				});
		this.win = new Ext.Window({
			id : "wHlVarList_dlg_wnd",
			title : "Variable list".localize(),
			closable : true,
			autoDestroy : true,
			plain : true,
			onEsc : Ext.emptyFn,
			constrain : true,
			modal : true,
			resizable : false,
			enableHdMenu : false,
			animCollapse : false,
			width : 250,
			height : 300,
			layout : "form",
			items : [new Ext.Panel({
				id : "grid_varis",
				bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
				border : false,
				frame : false,
				autoHeight : true,
				layout : "form",
				items : [vGrid]
			})],
			listeners : {
				close : function() {
					dev.report.base.general
							.setInputMode(dev.report.base.grid.GridMode.DIALOG);
				},
				show : function() {
					setTimeout(function() {
							})
				},
				activate : function(win) {
				//	that.activate()
				}
			},
			buttons : [ new Ext.Button({
								text : "OK".localize(),
								tabIndex : 2,
								handler : function() {
									that.win.close();
									getVar(_selectedVar)
								}
							}),  new Ext.Button({
								text : "Cancel".localize(),
								tabIndex : 3,
								ctCls : dev.report.kbd.tags.NO_ENTER,
								handler : function() {
									that.win.close()
								}
							})]
		});
		this.win.show(this);
		if (preselection && preselection != "") {
			for (var q = 0; q < vGridData.length; q++) {
				if (vGridData[q][0] == preselection) {
					setTimeout(function() {
								vGrid.getSelectionModel().selectRow(q)
							}, 1);
					break
				}
			}
		}
}