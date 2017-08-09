

bin.dataservice.AuthPanel = function(frames, params) {
	this.frames = frames;
	var ButtonArray = [];
	this.editingFlag = true;
	this.params = params;
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : false,
				scope : this,
				state : 'create',
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				state : 'edit',
				hidden : true,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'del',
				text : '删除'.loc(),
				icon : '/themes/icon/common/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				state : 'edit',
				hidden : true,
				handler : this.onButtonClick
			}));

	this.dictOptionForm = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		method : 'POST',
		border : false,
		bodyStyle : 'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '名称'.loc(),
											name : 'option_name',
											hidden : true
										})]
							}]
				}]
	});

	// ------------------------选项---------------------------------------

	var fm = Ext.form;

	this.optionName = new fm.TextField({
				allowBlank : false
			});
	var completeColumn = new CompleteColumn();
	this.cm = new Ext.grid.ColumnModel([completeColumn, {
				header : 'IP地址'.loc(),
				dataIndex : 'ip_address',
				width : 250,
				resizable : false,
				editor : this.optionName
			}, {
				header : '认证码'.loc(),
				dataIndex : 'auth_string',
				width : 250,
				resizable : false,
				editor : this.optionCode = new fm.TextField({
							allowBlank : true
						})
			}]);
	this.cm.defaultSortable = false;
	var headerTpl = new Ext.Template(
			'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
			'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
			'<tbody><tr class="new-option-row">',
			'<td><div id="new-option-icon" ></div></td>',
			'<td class="x-small-editor" id="new-option-title" align="center"></td>',
			'<td class="x-small-editor" id="new-option-value"  align="center"></td>',
			// '<td class="x-small-editor" id="new-option-default"
			// align="center"></td>',
			// '<td class="x-small-editor" id="new-option-valid"
			// align="center"></td>',
			'</tr></tbody>', "</table>");

	this.Option = Ext.data.Record.create([{
				name : 'object_id'
			}, {
				name : 'auth_string'
			}, {
				name : 'ip_address'
			}, {
				name : 'key'
			}]);
	this.ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : "/bin/dataservice/ipOption.jcp?object_id="
									+ this.params.parent_id,
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'object_id',
							fields : ["key", "ip_address", "auth_string"]
						}, this.Option),
				remoteSort : true
			});
	this.ds.setDefaultSort('ip_address', 'asc');

	this.OptionPropPanel = new Ext.grid.EditorGridPanel({
				title : 'IP认证'.loc(),
				region : 'west',
				autoScroll : true,
				width : 550,
				minSize : 180,
				height : 500,
				border : true,
				collapsible : false,
				split : true,
				ds : this.ds,
				cm : this.cm,
				sm : new Ext.grid.RowSelectionModel(),
				autoExpandColumn : 'common',
				bodyStyle : 'height:100%;width:100%;',
				frame : false,
				plugins : [completeColumn],
				clicksToEdit : 1,
				enableColumnHide : false,
				enableColumnMove : false,
				enableHdMenu : false,
				view : this.edtorView = new Ext.grid.GridView({
							forceFit : true,
							ignoreAdd : true,
							onDataChange : function() {
								this.refresh();
								this.updateHeaderSortState();
								this.syncFocusEl(0);
							},
							emptyText : '未设定认证项'.loc(),
							templates : {
								header : headerTpl
							}
						})
			});
	this.OptionPropPanel.on('render', function() {
				this.initGrid();
			}, this);
	this.OptionPropPanel.on('afteredit', function(e) {
		if (this.editingFlag) {
			var code = e.record.get('auth_string');
			var value = e.record.get('ip_address');
			if (value) {
				for (var i = 0; i < this.ds.data.length - 1; i++) {
					if (this.ds.getAt(i).data.ip_address == this.ds
							.getAt(i + 1).data.ip_address) {
						Ext.msg("error", '不能进行认证项更新!,原因:'.loc()+'<br>'+'客户端IP地址不能重复'.loc());
						return;
					}
				}
			}
			var updateParams = {};
			updateParams['type'] = 'updatesave';
			updateParams['auth_string'] = code;
			updateParams['ip_address'] = value;
			updateParams['key'] = e.record.get('key');

			Ext.Ajax.request({
				url : '/bin/dataservice/ipOption.jcp',
				params : updateParams,
				method : 'post',
				scope : this,
				success : function(response, options) {
					var check = response.responseText;
					var ajaxResult = Ext.util.JSON.decode(check)
					if (!ajaxResult.success) {
						Ext.msg("error", '认证项更新!,原因:'.loc()+'<br>' + ajaxResult.message);
					}
				}
			});
		}
	}, this);

	// ----------------------选项Panel结束--------------------------------------------------

	this.OptionMainPanel = new Ext.Panel({
				region : 'center',
				autoScroll : false,
				border : false,
				items : [this.dictOptionForm]
			});

	this.OptionMain = new Ext.Panel({
				closable : false,
				layout : 'border',
				name : 'AuthPanel',
				cached : false,
				region : 'center',
				border : false,
				bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;',
				tbar : this.ReportButtonArray,
				items : [this.OptionMainPanel, this.OptionPropPanel],
				tbar : ButtonArray
			});
	this.MainTabPanel = this.OptionMain;
};

bin.dataservice.AuthPanel.prototype = {
	initGrid : function() {
		var optionTitle = new Ext.form.TextField({
					width : 280,
					renderTo : 'new-option-title'
				});
		var optionCode = new Ext.form.TextField({
					width : 253,
					renderTo : 'new-option-value'
				});
		var cm1 = this.OptionPropPanel.getColumnModel();
		var addIcon = Ext.get('new-option-icon');
		addIcon.addListener('click', function() {
			if (optionTitle.getValue()) {
				for (var i = 0; i < this.ds.data.length; i++) {
					if (optionTitle.getValue() == this.ds.getAt(i).data.ip_address) {
						Ext.msg("error", '不能进行认证项更新!,原因:'.loc()+'<br>'+'认证键值不能重复'.loc());
						return;
					}
				}
			} else {
				Ext.msg("error", '不能进行认证项更新!,原因:'.loc()+'<br>'+'认证项与认证键值不能为空'.loc());
				return;
			}

			if (this.editingFlag) {
				var saveParams = {};
				saveParams['type'] = 'save';
				saveParams['ip_address'] = optionTitle.getValue();
				saveParams['object_id'] = this.params.parent_id;
				saveParams['auth_string'] = optionCode.getValue();
				Ext.Ajax.request({
							url : '/bin/dataservice/ipOption.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (!ajaxResult.success) {
									Ext.msg("error", '认证项更新!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								} else {
									optionTitle.setValue('');
									optionCode.setValue('');
									this.ds.baseParams = this.params;
									this.ds.load({
												params : {
													start : 0,
													limit : 100
												}
											});
								}
							}
						});
			} else {
				this.ds.add(new this.Option({
							object_id : this.params.parent_id,
							ip_address : optionTitle.getValue(),
							auth_string : optionCode.getValue()
						}));
				optionTitle.setValue('');
				optionCode.setValue('');
			}
		}, this);
		this.OptionPropPanel.resetEditor = function() {
			optionTitle.setValue('');
			optionCode.setValue('');
		}
	},
	init : function(params) {
		this.params = params;
		this.toggleToolBar('create');
		this.editingFlag = true;
		this.OptionPropPanel.editingFlag = false;
		this.ds.removeAll();
		this.OptionPropPanel.resetEditor();
		this.frames.get("DataService").mainPanel.setStatusValue(['数据服务权限'.loc()]);
	},
	formEdit : function() {
		this.toggleToolBar('edit');
		this.editingFlag = true;
		this.OptionPropPanel.editingFlag = true;
	},
	loadData : function(params) {
		this.ds.baseParams = params;
		this.ds.load({
					params : {
						start : 0,
						limit : 100
					}
				});
		this.OptionPropPanel.resetEditor();
		this.frames.get("DataService").mainPanel.setStatusValue(['认证管理'.loc(),
				params.parent_id]);

	},
	toggleToolBar : function(state) {
		var tempToolBar = this.OptionMain.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.hide();
				}, tempToolBar.items);
		tempToolBar.items.each(function(item) {
					item.enable();
					if (item.state == state)
						item.show();
				}, tempToolBar.items);
	},
	disableToolBar : function(state) {
		var tempToolBar = this.OptionMain.getTopToolbar();
		tempToolBar.items.each(function(item) {
					item.disable();
				}, tempToolBar.items);
	},
	onButtonClick : function(item) {
		var frm = this.dictOptionForm.form;
		var DataService = this.frames.get('DataService');
		if (item.btnId == 'updatesave') {
			var saveParams = {};
			saveParams['type'] = 'saveAll';
			saveParams['object_id'] = this.params.parent_id;
			if (this.ds.data.length == 0) {
				Ext.msg("error", '不能进行认证设定!,必须至少设定一个认证项'.loc());
				return;
			}

			var optionValueArray = new Array();
			var optionCodeArray = new Array();

			this.ds.each(function(rec) {
						optionValueArray.push(rec.get("ip_address"));
						optionCodeArray.push(rec.get("auth_string"));
					});

			saveParams['ip_address'] = optionValueArray;
			saveParams['auth_string'] = optionCodeArray;

			if (frm.isValid()) {
				frm.submit({
							url : '/bin/dataservice/ipOption.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								var editParams = {};
								editParams['type'] = 'edit';
								editParams['object_id'] = action.result.object_id;
								DataService.navPanel.getTree().loadSelfNode(
										action.result.object_id,
										DataService.navPanel.clickEvent);
								Ext.msg("info", '数据更新完成!'.loc());

							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc()+'<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'del') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = {};
					delParams['type'] = 'deleteAll';
					delParams['object_id'] = this.params.parent_id;
					this.dictOptionForm.form.submit({
								url : '/bin/dataservice/ipOption.jcp',
								params : delParams,
								method : 'post',
								scope : this,
								success : function(form, action) {
									DataService.navPanel
											.getTree()
											.loadSelfNode(
													action.result.object_id,
													DataService.navPanel.clickEvent);
									Ext.msg("info", '删除数据完成!'.loc());
								},
								failure : function(form, action) {
									Ext.msg("error", '数据删除失败!,原因:'.loc()+'<br>'
													+ action.result.message);
								}
							});
				}
			}.createDelegate(this));
		}
	}
};
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
			if (this.dataIndex == 'is_default') {
				return;
			}
			var index = this.grid.getView().findRowIndex(t);
			var st = this.grid.store;
			var record = st.getAt(index);
			var canPass = false;
			for (var i = 0; i < st.getCount(); i++) {
				if (i == index)
					continue;
				if (st.getAt(i).data.allow_used == true) {
					canPass = true;
					break;
				}

			}
			if (!canPass) {
				Ext.msg("error", '一个认证至少有一项可用'.loc());
				record.set("allow_used", true);
				return;
			}
			record.set(this.dataIndex, !record.data[this.dataIndex]);
			if (this.grid.editingFlag) {
				var updateParams = {};
				updateParams['type'] = 'updatesave';
				updateParams['object_id'] = record.get('object_id');
				updateParams['auth_string'] = record.get('auth_string');
				// updateParams['ip_address'] = record.get('ip_address');
				Ext.Ajax.request({
							url : '/bin/dataservice/ipOption.jcp',
							params : updateParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (!ajaxResult.success) {
									Ext.msg("error", '认证项更新!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
							}
						});
			}
		}
	},
	renderer : function(v, p, record) {
		var checked = false;
		if (v == 'true' || v == '1' || v == 'on' || v == 'y')
			checked = true;
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (checked ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};
CompleteColumn = function() {
	var grid;
	function getRecord(t) {
		var index = grid.getView().findRowIndex(t);
		return grid.store.getAt(index);
	}
	function onMouseDown(e, t) {
		if (Ext.fly(t).hasClass('option-check')) {

			if (grid.editingFlag) {
				var record = getRecord(t);
				var delParams = Ext.apply({
							type : 'delete'
						}, record.data);
				Ext.Ajax.request({
							url : '/bin/dataservice/ipOption.jcp',
							params : delParams,
							method : 'post',
							scope : this,
							success : function(response, options) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (ajaxResult.success) {
									grid.store.remove(record);
								} else {
									Ext.msg("error", '数据删除失败!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
							}
						});
			} else {
				var record = getRecord(t);
				grid.store.remove(record);
			}
		}
	}
	Ext.apply(this, {
				width : 22,
				header : '<div class="option-col-hd"></div>',
				fixed : true,
				renderer : function() {
					return '<div class="option-check"></div>';
				},
				init : function(xg) {
					grid = xg;
					grid.on('render', function() {
								var view = grid.getView();
								view.mainBody.on('mousedown', onMouseDown);
							});
				}
			});
};
