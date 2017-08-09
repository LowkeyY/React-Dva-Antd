

bin.user.UserListPanel = function(User) {
	this.xg = Ext.grid;
	this.listButton = [];
    window.ql = function(){};
	this.retFn = function(main) {
		main.hideStatus();
		main.setActiveTab("userListPanel");
	}.createCallback(User.mainPanel);
	this.onButtonClick = function(item) {
		if (item.btnId == 'new') {
			loadcss("lib.upload.Base");
			using("lib.upload.Base");
			using("lib.upload.Image");
			using("bin.user.UserPanel");
			var newParams = {};
			newParams['dept_id'] = this.ds.baseParams['dept_id'];
			User.userPanel = this.frames.createPanel(new bin.user.UserPanel(
					"new", this.retFn));
			User.mainPanel.add(User.userPanel.MainTabPanel);
			User.mainPanel.showStatus();
			User.mainPanel.setActiveTab(User.userPanel.MainTabPanel);
			User.userPanel.formCreate(newParams);
		} else if (item.btnId == 'deleteList') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
						if (answer == 'yes') {
							var delParams = this.ds.baseParams
							delParams['type'] = 'delete';
							var oldSelections = this.UserListGrid
									.getSelectionModel().getSelections();
							this.UserListGrid.getSelectionModel()
									.clearSelections();
							var userArray = [];
							Ext.each(oldSelections, function(selection) {
										userArray.push(selection.get('index'));
									});
							delParams['userId'] = userArray;
							Ext.Ajax.request({
										url : '/bin/user/usercreate.jcp',
										params : delParams,
										method : 'POST',
										scope : this,
										success : function(form, action) {
											this.ds.load({
														params : {
															start : 0,
															limit : 40
														}
													});
										},
										failure : function(form, action) {
											Ext
													.msg(
															"error",
															'数据删除失败!,原因:'.loc()+'<br>'
																	+ action.result.message);
										}
									});
						}
					}.createDelegate(this));
		} else if (item.btnId == 'edit') {
			loadcss("lib.upload.Base");
			using("lib.upload.Base");
			using("lib.upload.Image");
			using("bin.user.UserPanel");
			var oldSelections = this.UserListGrid.getSelectionModel()
					.getSelections();
			this.UserListGrid.getSelectionModel().clearSelections();
			if (oldSelections.length != 1) {
				Ext.msg("error", '必须且只能选择一条数据进行编辑!'.loc());
			} else {
				var editParams = {};
				var userArray = [];
				var deptArray = [];
				Ext.each(oldSelections, function(selection) {
							deptArray.push(selection.get('dept_id'));
							userArray.push(selection.get('index'));
						});
				editParams['userId'] = userArray[0];
				editParams['dept_id'] = deptArray[0];
				editParams['type'] = 'edit';
				User.userPanel = this.frames.createPanel("userPanel",
						new bin.user.UserPanel("edit", this.retFn));
				User.mainPanel.add(User.userPanel.MainTabPanel);
				User.mainPanel.setActiveTab(User.userPanel.MainTabPanel);
				User.userPanel.loadData(editParams);
				User.userPanel.formEdit(editParams);
			}
		} else if (item.btnId == 'moveTo') {
			var oldSelections = this.UserListGrid.getSelectionModel()
					.getSelections();
			this.UserListGrid.getSelectionModel().clearSelections();
			if (oldSelections.length != 1) {
				Ext.msg("error", '必须且只能选择一条数据进行调动!'.loc());
			} else {
				using('lib.SelectRole.SelectRoleWindow');
				var selectRoleWin = new lib.SelectRole.SelectRoleWindow({
							deptId : 0
						});
				selectRoleWin.show();
				selectRoleWin.win.on('close', function() {
					if (selectRoleWin.role_id != ''
							&& selectRoleWin.dept_id != '') {
						var moveParams = {};
						var userArray = [];
						var deptArray = [];
						moveParams['type'] = 'moveTo';
						moveParams['roleId'] = selectRoleWin.role_id;
						moveParams['deptId'] = selectRoleWin.dept_id;
						Ext.each(oldSelections, function(selection) {
									userArray.push(selection.get('index'));
								});
						moveParams['userId'] = userArray[0];
						Ext.Ajax.request({
									url : '/bin/user/usercreate.jcp',
									params : moveParams,
									method : 'POST',
									scope : this,
									success : function(form, action) {
										this.ds.load({
													params : {
														start : 0,
														limit : 40
													}
												});
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'用户调动失败!,原因:'.loc()+'<br>'
																+ action.result.message);
									}
								});
					}
				}, this)
			}
		}
	}
	this.listButton.push(new Ext.Toolbar.Button({
				btnId : 'new',
				text : '新建'.loc(),
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	this.listButton.push(new Ext.Toolbar.Separator());
	this.listButton.push(new Ext.Toolbar.Button({
				btnId : 'edit',
				text : '修改'.loc(),
				icon : '/themes/icon/common/update.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	this.listButton.push(new Ext.Toolbar.Separator());
	this.listButton.push(new Ext.Toolbar.Button({
				btnId : 'deleteList',
				text : '删除'.loc(),
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	this.listButton.push(new Ext.Toolbar.Button({
				btnId : 'moveTo',
				text : '调动'.loc(),
				state : 'edit',
				icon : '/themes/icon/all/user_go.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : this.onButtonClick
			}));
	this.ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/bin/user/userlist.jcp",
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'index'
						}, [{
									name : 'index',
									mapping : 'index'
								}, {
									name : 'user_name',
									mapping : 'user_name'
								}, {
									name : 'real_name',
									mapping : 'real_name'
								}, {
									name : 'dept_id',
									mapping : 'dept_id'
								}, {
									name : 'roles',
									mapping : 'roles'
								}, {
									name : 'dept_name'
								}, {
									name : 'phone'
								}, {
									name : 'entry_time'
								}, {
									name : 'sort_id'
								}]),
				remoteSort : true
			});

	this.ds.setDefaultSort('index', 'asc');

	this.cm = new Ext.grid.ColumnModel([new this.xg.RowNumberer(), {
				header : '姓名'.loc(),
				dataIndex : 'real_name',
				sortable : true,
				align : 'left'
			}, {
				header : '部门'.loc(),
				dataIndex : 'dept_name',
				sortable : true,
				align : 'left'
			}, {
				header : '角色'.loc(),
				dataIndex : 'roles',
				sortable : true,
				align : 'left'
			}, {
				id : 'user_name',
				header : '用户名'.loc(),
				dataIndex : 'user_name',
				sortable : true,
				align : 'left'
			}, {
				header : '电话'.loc(),
				dataIndex : 'phone',
				sortable : true,
				align : 'left'
			}, {
				header : '注册时间'.loc(),
				dataIndex : 'entry_time',
				sortable : true,
				align : 'left'
			}]);

	this.cm.defaultSortable = true;
	this.UserListGrid = new Ext.grid.GridPanel({
				border : false,
				store : this.ds,
				cm : this.cm,
				trackMouseOver : false,
				ddGroup : 'UserListDDGroup',
				enableDragDrop : true,
				loadMask : {
					msg : '数据载入中...'.loc()
				},
				viewConfig : {
					forceFit : true,
					enableRowBody : true,
					showPreview : true,
					getRowClass : this.applyRowClass
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 40,
							store : this.ds,
							displayInfo : true,
							displayMsg : '{0}-{1}条 共:{2}条'.loc(),
							emptyMsg : '没有数据'.loc()
						}),
				tbar : this.listButton,
				listeners : {
					afterrender : function(){
						if(!this.gridDropTarget)
							this.gridDropTarget = new Ext.dd.DropTarget(this.getView().scroller.dom, {
							  ddGroup    : 'UserListDDGroup',
							  notifyDrop : function(ddSource, e, data){
							         var grid = data.grid , store = grid.store , rows = data.selections;
							         if((store.baseParams && store.baseParams.keyword) || !rows.length || rows.length == store.getCount()){
							         	e.cancel = true;
							            return;
							         }
							         var cindex = ddSource.getDragData(e).rowIndex;
							         if (cindex == undefined || cindex < 0) {
							             e.cancel = true;
							             return;
							         }
							         //纪录拖放后被拖放纪录的新rowIndex
							         var dragDropedRowIndexs = new Array() , changeUser = new Array();
							         var newRowIndex = cindex;
							         var total = store.getTotalCount();
							         //当在选中多行拖动调整时，计算新的行索引起始位置
							         if ((cindex + rows.length) > total) {
							             newRowIndex = total - rows.length;
							         }
							         if(newRowIndex == data.rowIndex){
							         	e.cancel = true;
							            return;
							         }
							         for (var i = 0; i < rows.length; i++) {
							             var rowdata = store.getById(rows[i].id);
							             if (!this.copy) {
							                 store.remove(store.getById(rows[i].id));
							                 store.insert(cindex, rowdata);
							                 dragDropedRowIndexs[i] = newRowIndex + i;
							                 changeUser.push(rows[i].id);
							             }
							         }
							         var preSortId = -1 , nextSortId = -1;
							         if(newRowIndex - 1 > 0 && store.getAt(newRowIndex - 1))
							         	preSortId = store.getAt(newRowIndex - 1).get("sort_id");
							         if(newRowIndex + rows.length <= store.getCount() - 1 && store.getAt(newRowIndex + rows.length))
							         	nextSortId = store.getAt(newRowIndex + rows.length).get("sort_id");
							         	
/*							         var preRec = newRowIndex - 1 > 0 ? store.getAt(newRowIndex - 1) : "" , 
							         		nextRec = newRowIndex + rows.length > store.getCount() ? "" : store.getAt(newRowIndex + rows.length);
							         var newSortId = 1000;
							         if(preRec || nextRec){
							         	if(!preRec)
							         		newSortId = Math.round(nextRec.get("sort_id") / 2);
							         	else if(!nextRec)
							         		newSortId = preRec.get("sort_id") + 1000;
							         	else{
							         		var preSortId = preRec.get("sort_id") , nextSortId = nextRec.get("sort_id") ,
							         			newSortId = preSortId + Math.round((nextSortId - preSortId) /2);
							         		newSortId = (newSortId == nextSortId) ? preSortId : newSortId;
							         	}
							         }*/
							         Ext.Ajax.request({
							                url : '/bin/user/sortchange.jcp',
							                method : 'POST',
							                scope : this,
							                params : {
							                  changeType : "user",
							                  changes : changeUser.join(",") ,
							                  preSortId : preSortId,
							                  nextSortId : nextSortId
							                },
							                success:function(){
							                  store.reload();
							                  grid.getView().refresh();
							                  grid.getSelectionModel().selectRows(dragDropedRowIndexs);
							                }
							          });
							         return true
							      }
							});
					}
				}
			});
	this.MainTabPanel = new Ext.Panel({
				id : 'userListPanel',
				border : false,
				cached : true,
				layout : 'fit',
				defaults : {
					autoScroll : true
				},
				items : [this.UserListGrid]
			});
			
/**/

};

bin.user.UserListPanel.prototype = {
	showList : function(params) {
		if (params.dept_id == '99999') {
			this.UserListGrid.getTopToolbar().items.each(function(item) {
						if (item.id == 'new') {
							item.disable();
						}
					});
		} else {
			this.UserListGrid.getTopToolbar().items.each(function(item) {
						if (item.id == 'new') {
							item.enable();
						}
					});
		}
		this.ds.baseParams = params;
		this.ds.load({
					params : {
						start : 0,
						limit : 40
					}
				});
	}
};
