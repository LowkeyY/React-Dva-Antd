

usr.docManage.DMStepPanel = Ext.extend(Ext.Window, {
			width : 790,
			modal : true,
			layout : 'fit',
			height : 300,
			title : '审批步骤'.loc(),
			buttons : [{
						text : "关闭",
						scope : this,
						handler : function(btn) {
							btn.ownerCt.ownerCt.close(true);
						}
					}],
			initComponent : function() {
				this.initCmpItems();
				usr.docManage.DMStepPanel.superclass.initComponent.call(this);
			},
			initCmpItems : function() {
				var st = new Ext.data.JsonStore({
							url : '/bin/workflow/StepPanel.jcp',
							baseParams : this.params,
							root : 'steps',
							fields : ["stepName", "userName", "startTime",
									"status", "detail"],
							autoLoad : true,
							remoteSort : false
						});
				var grid = new Ext.grid.GridPanel({
							store : st,
							autoExpandColumn : 'detail',
							cm : new Ext.grid.ColumnModel([
									new Ext.grid.RowNumberer(), {
										header : '步骤'.loc(),
										width : 120,
										sortable : false,
										dataIndex : 'stepName'
									}, {
										header : '经办人'.loc(),
										width : 130,
										sortable : false,
										dataIndex : 'userName'
									}, {
										header : '状态'.loc(),
										width : 130,
										sortable : false,
										dataIndex : 'status'
									}, {
										header : '办理时间'.loc(),
										width : 150,
										sortable : false,
										dataIndex : 'startTime'
									}, {
										header : '意见'.loc(),
										width : 200,
										id : 'detail',
										sortable : false,
										dataIndex : 'detail'
									}])
						})
				this.items = [grid];
			}
		});