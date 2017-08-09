Ext.namespace('bin.exe');
bin.exe.PdSetupPanel = function(panel,parentPanel,param) {
	var param = param;
	var fm = Ext.form;
	var checkColumn = new Ext.grid.CheckColumn({
				name : 'hide_flag',
				header : '隐藏'.loc(),
				dataIndex : 'hide_flag',
				width : 55
			});
	var checkColumnHh = new Ext.grid.CheckColumn({
				name : 'wrap_flag',
				header : '换行'.loc(),
				dataIndex : 'wrap_flag',
				width : 55
			});
	var cm = new Ext.grid.ColumnModel({
				defaults : {
					sortable : true
				},
				columns : [checkColumn, {
							name : 'title_name',
							header : '标题'.loc(),
							dataIndex : 'title_name',
							width : 220,
							editor : new fm.TextField({
										allowBlank : false
									})
						}, {
							name : 'num',
							header : '顺序号'.loc(),
							dataIndex : 'num',
							width : 70,
							editor : new fm.TextField({
										allowBlank : false
									})
						}, {
							name : 'default_value',
							header : '默认值'.loc(),
							dataIndex : 'default_value',
							width : 150,
							editor : new fm.TextField({
										allowBlank : true
									})
						}, checkColumnHh]
			});
	var dsUrl = '/bin/exe/PdSetupPanel.jcp?object_id=' + param.objectId
			+ "&gp_id=" + param.dataId + "&tab_id=" + param.exportTab;
	var ds = this.ds = new Ext.data.JsonStore({
				url : dsUrl,
				root : 'items',
				method : 'GET',
				fields : ["num", {
							name : "hide_flag",
							type : 'boolean'
						}, "default_value", "title_name", "title_id", {
							name : "wrap_flag",
							type : 'boolean'
						}]
			});
	this.ds.load();
	
	var refresh = function() {
		delete CPM.ModelCache[param.objectId];
		param.forceToRebuild=true;
		CPM.replacePanel(panel,parentPanel,param);
		delete param.forceToRebuild;
	};
	
	this.grid = new Ext.grid.EditorGridPanel({
		store : this.ds,
		cm : cm,
		border : false,
		bodyborder : false,
		frame : false,
		hideBorders : true,
		plugins : [checkColumn, checkColumnHh],
		clicksToEdit : 1,
		tbar : [{
			text : '保存'.loc(),
			scope : this,
			handler : function() {
				var storeValue = [];
				var allRecords = this.ds.getRange(0);
				for (var i = 0, j = 0; i < allRecords.length; i++) {
					storeValue[j++] = allRecords[i].data;
				}
				Ext.Ajax.request({
							url : '/bin/exe/PdSetupPanel.jcp?type=save',
							params : {
								object_id : param.objectId,
								fields : Ext.encode(storeValue)
							},
							scope : this,
							success : function(o) {
								if (o && o.responseText
										&& Ext.decode(o.responseText).success) {
									refresh();
									this.win.close()
								} else {
									Ext.msg("error", '该用户不能保存个性数据'.loc());
								}
							}
						});

			}
		}, {
			text : '恢复默认格式'.loc(),
			scope : this,
			handler : function() {
				Ext.Msg.confirm('恢复默认格式'.loc(), '您确认恢复默认格式?'.loc(), function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
									url : '/bin/exe/PdSetupPanel.jcp?type=rest',
									scope : this,
									params : {
										object_id : param.objectId
									},
									success : function(o) {
										if (o
												&& o.responseText
												&& Ext.decode(o.responseText).success) {
											refresh();
											this.win.close();
										} else {
											Ext.msg("error", '该用户不能恢复默认格式数据'.loc());
										}
									}
								});
					}
				}, this);
			}
		}]
	});
	this.win = new Ext.Window({
				resizable : false,
				border : false,
				footer : false,
				bodyborder : false,
				title : '单记录设置'.loc(),
				items : this.grid,
				layout : 'fit',
				modal : true,
				height : 500,
				width : 600
			});
}
bin.exe.PdSetupPanel.prototype = {
	init : function() {
		this.win.show();
	}

}
Ext.namespace('Ext.grid');
Ext.grid.CheckColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			if (this.grid.viewMode)
				return;
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			record.set(this.dataIndex, !record.data[this.dataIndex]);
			if (this.name == 'pmkradio' && record.data[this.dataIndex]) {
				record.set("not_null", true);
			}
		}
	},

	renderer : function(v, p, record) {
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (v ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};