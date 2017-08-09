Ext.namespace('dev.program');
dev.program.ProgramFolder = function(params) {
	this.params = params;
	var cache = {};
	this.curNodeId = "0";
	this.parentNodeId = "0";
	var root = new Ext.tree.AsyncTreeNode({
				text : '当前模块'.loc(),
				draggable : false,
				expanded : true,
				level : 1,
				id : '0',
				allowSelect : true,
				icon : "/themes/icon/all/drive_link.gif"
			});
	var loader = new Ext.tree.TreeLoader({
				dataUrl : '/dev/program/ProgramTree.jcp',
				requestMethod : "GET",
				baseParams : {
					objectId : params.parent_id,
					id : this.curNodeId
				}
			});
	loader.on("loadexception", function(tree, node, response) {
				var message = '目录数据错误'.loc();
				try {
					message = Ext.decode(response.responseText).message;
				} catch (e) {
				}
				Ext.msg("error", message);
			});
	this.tree = new Ext.tree.TreePanel({
				autoScroll : true,
				animate : false,
				title : '模块导航'.loc(),
				containerScroll : true,
				height : 'auto',
				region : 'west',
				root : root,
				draggable : false,
				split : true,
				width : 200,
				collapsible : false,
				loader : loader
			});
	var ButtonArray = [{
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				state : 'create',
				hidden : false
			}, {
				btnId : 'clear',
				text : '清空'.loc(),
				icon : '/themes/icon/xp/clear.gif',
				state : 'create',
				hidden : false
			}, {
				btnId : 'new',
				text : '新建'.loc(),
				icon : '/themes/icon/xp/newfile.gif',
				state : 'edit',
				hidden : true
			}, {
				btnId : 'updatesave',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				state : 'edit',
				hidden : true
			}, {
				btnId : 'delete',
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				state : 'edit',
				hidden : true
			}, {
				btnId : 'return',
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				state : 'all',
				hidden : false,
				handler : this.onButtonClick
			}];
	Ext.each(ButtonArray, function(item) {
				Ext.apply(item, {
							cls : 'x-btn-text-icon  bmenu',
							disabled : false,
							scope : this,
							handler : this.onButtonClick
						});
			}, this);
	this.tree.on("click", function(node, e) {
				var level = node.getDepth();
				this.curNodeId = node.id;
				var isLeaf = node.leaf;
				if (level == 0) {
					this.toggleToolBar('create', isLeaf);
					this.curNodeId = "0";
					this.diretoryForm.form.reset();
				} else {
					this.parentNodeId = node.parentNode.id;
					this.toggleToolBar('edit', isLeaf);
					this.diretoryForm.load({
								params : {
									objectId : params.parent_id,
									node : this.curNodeId
								},
								scope : this
							});
				}
			}, this);
	this.diretoryForm = new Ext.FormPanel({
		labelWidth : 100,
		region : 'center',
		labelAlign : 'right',
		id : 'topMenuBase',
		cached : true,
		url : '/dev/program/PrgFolderManage.jcp',
		method : 'GET',
		border : false,
		bodyStyle : 'padding:30px 0px 0px 0px;background:#FFFFFF;',
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextField({
											fieldLabel : '目录名称'.loc(),
											name : 'dirName',
											width : 300,
											maxLength : 50,
											allowBlank : false,
											blankText : '导航标题必须提供.'.loc(),
											maxLengthText : '导航标题不能超过{0}个字符!'
													.loc()
										})]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.NumberField({
											fieldLabel : '顺序'.loc(),
											name : 'Seq',
											minValue : 0,
											maxValue : 100000,
											width : 250,
											allowDecimals : false,
											allowNegative : false,
											minText : '程序版本最小值不能小于{0}'.loc(),
											maxText : '程序版本最大值不能大于 {0}'.loc(),
											nanText : '{0} 对于程序版本是无效数字'.loc()
										})]
							}]
				}, {
					layout : 'column',
					border : false,
					items : [{
						columnWidth : 0.40,
						layout : 'form',
						border : false,
						items : [{
									xtype : 'iconpicker',
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '建议选择16x16的图标'.loc()
									},
									width : 24,
									name : 'start_icon',
									defaultImage : "/themes/icon/xp/folder0.gif",
									fieldLabel : '开启图标'.loc()
								}]
					}, {
						columnWidth : 0.50,
						layout : 'form',
						border : false,
						items : [{
									xtype : 'iconpicker',
									qtip : {
										title : '提示'.loc(),
										dismissDelay : 10000,
										text : '建议选择16x16的图标'.loc()
									},
									width : 24,
									defaultImage : "/themes/icon/xp/folder.gif",
									name : 'end_icon',
									fieldLabel : '结束图标'.loc()
								}]
					}]
				}, {
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [new Ext.form.TextArea({
											fieldLabel : '备注'.loc(),
											name : 'note',
											width : 550,
											height : 60,
											maxLength : 500,
											maxLengthText : '程序名称不能超过{0}个字符!'
													.loc()
										})]
							}]
				}]
	})
	this.MainTabPanel = new Ext.Panel({
				layout : 'border',
				border : false,
				items : [this.tree, this.diretoryForm],
				tbar : ButtonArray
			});
}
dev.program.ProgramFolder.prototype = {
	toggleToolBar : function(state, isLeaf) {
		this.MainTabPanel.getTopToolbar().items.each(function(item) {
					if (item.state == state || item.state == 'all') {
						item.setVisible(true);
					} else {
						item.setVisible(false);
					}
					if (isLeaf) {
						if (item.btnId == 'delete')
							item.enable();
					} else {
						if (item.btnId == 'delete')
							item.disable();
					}
				});
	},
	onButtonClick : function(item) {
		var frm = this.diretoryForm.form;
		if (item.btnId == 'clear') {
			this.diretoryForm.form.reset();
		} else if (item.btnId == 'new') {
			this.toggleToolBar('create', false);
			this.diretoryForm.form.reset();
		} else if (item.btnId == 'save') {
			var frm = this.diretoryForm.form;
			var saveParams = {};
			saveParams['type'] = 'save';
			saveParams['objectId'] = this.params.parent_id;
			saveParams['node'] = this.curNodeId;
			if (frm.isValid()) {
				frm.submit({
							url : '/dev/program/PrgFolderManage.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								var currentNode = this.tree.root;
								var loader = this.tree.getLoader();
								loader.load(currentNode, function() {
											currentNode.fireEvent("select");
											this.toggleToolBar('create', false);
											this.curNodeId = "";
											this.diretoryForm.form.reset();
											Ext.msg("info", '保存成功');
										}.createDelegate(this));
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'updatesave') {
			var frm = this.diretoryForm.form;
			var saveParams = {};
			saveParams['type'] = 'updatesave';
			saveParams['objectId'] = this.params.parent_id;
			saveParams['node'] = this.curNodeId;
			if (frm.isValid()) {
				frm.submit({
							url : '/dev/program/PrgFolderManage.jcp',
							params : saveParams,
							method : 'post',
							scope : this,
							success : function(form, action) {
								var currentNode = this.tree.root;
								var loader = this.tree.getLoader();
								loader.load(currentNode, function() {
											currentNode.fireEvent("select");
											this.toggleToolBar('create', false);
											this.curNodeId = "";
											this.diretoryForm.form.reset();
											Ext.msg("info", '保存成功'.loc());
										}.createDelegate(this));
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						});
			} else {
				Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
			}
		} else if (item.btnId == 'delete') {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
				if (answer == 'yes') {
					var delParams = {};
					delParams['type'] = 'delete';
					delParams['objectId'] = this.params.parent_id;
					delParams['node'] = this.curNodeId;
					frm.submit({
								url : '/dev/program/PrgFolderManage.jcp',
								params : delParams,
								method : 'post',
								scope : this,
								success : function(form, action) {
									var currentNode = this.tree.root;
									var loader = this.tree.getLoader();
									loader.load(currentNode, function() {
												currentNode.fireEvent("select");
												this.toggleToolBar('create',
														false);
												this.curNodeId = "";
												this.diretoryForm.form.reset();
												Ext.msg("info", '删除成功'.loc());
											}.createDelegate(this));
								},
								failure : function(form, action) {
									Ext.msg("error", '数据删除失败!,原因:'.loc()
													+ '<br>'
													+ action.result.message);
								}
							});
				}
			}.createDelegate(this));
		} else if (item.btnId == 'return') {
			this.params.returnFunction();
		}
	}
}