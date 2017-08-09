
Ext.namespace('dev.ctrl');
using("lib.ComboTree.ComboTree");
using("lib.SelectDept.SelectDept");
using("lib.SelectUser.SelectUser");
dev.ctrl.ListCondition = function(params, type,parentPanel) {
	this.type = type;
	this.parentPanel=parentPanel;
	this.addCondition = new Ext.Toolbar.Button({
				xtype : 'button',
				icon : '/themes/icon/all/folder_page.gif',
				cls : 'x-btn-text-icon  bmenu',
				text : '增加条件'.loc(),
				scope : this,
				handler : function(btn) {
					if (!this.tree.addNode(false)) {
						Ext.msg("info", '请先点选要增加条件的组'.loc());
					}
				}
			});
	this.addGroup = new Ext.Toolbar.Button({
				xtype : 'button',
				icon : '/themes/icon/all/folder_add.gif',
				cls : 'x-btn-text-icon  bmenu',
				text : '增加组'.loc(),
				scope : this,
				handler : function(btn) {
					if (this.tree.addNode(true) == false) {
						Ext.msg("info", '请先点选一个组'.loc());
					}
				}
			});
	var buttonArray = [new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function() {
					this.tree.stopEditing(true);
					var root = this.tree.root.firstChild;
					var json = "";
					if (root != null && root.hasChildNodes()) {
						json = Ext.encode(this.getJson(root));
					}
					Ext.Ajax.request({
								url : '/dev/ctrl/ListCondition.jcp',
								params : {
									type : this.type,
									json : json,
									objectId : this.objectId
								},
								method : 'PUT',
								callback : function(opt, success, response) {
									Ext.msg("info", '保存'.loc()
													+ (success ? '成功'.loc() : '失败'.loc()));
									if (success)
										params.returnFunction();
								}
							});
				}
			}), new Ext.Toolbar.Button({
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function() {
					var node = this.tree.activeNode;
					if (node != null) {
						this.tree.stopEditing(true);
						node.remove();
					}
				}
			}), this.addGroup, this.addCondition, {
		text : '返回'.loc(),
		icon : '/themes/icon/xp/undo.gif',
		cls : 'x-btn-text-icon',
		scope : this,
		handler : params.returnFunction,
		xtype : 'button'
	}];
	this.MainTabPanel = new Ext.Panel({
				layout : 'fit',
				tbar : buttonArray,
				border : false
	});
}
dev.ctrl.ListCondition.prototype = {
	getJson : function(node) {
		var at = node.attributes
		if (node.isLeaf()) {
			if (typeof(value) == 'object') {
				if (Ext.isDate(value)) {
					value = date.format('Y/m/d');
				} else if (value.value) {
					value = value.value;
				} else {
					value = String(value);
				}
			}
			return {
				uiProvider : 'col',
				leaf : true,
				text : at.name,
				name : at.name,
				value : at.value,
				action : at.action
			};
		} else {
			var childs = [];
			node.eachChild(function(item) {
						childs.push(this.getJson(item));
					}, this);
			var caction = at.action.trim();
			return {
				uiProvider : 'col',
				text : ('组:'.loc() + ((caction == 'and') ? '并且'.loc() : '或者'.loc())),
				action : caction,
				children : childs
			};
		}
	},
	init : function(params) {
		this.objectId = params.parent_id;
		Ext.Ajax.request({
					url : '/dev/ctrl/ListCondition.jcp',
					method : 'POST',
					params : {
						type : this.type,
						objectId : params.parent_id
					},
					scope : this,
					callback : function(o, success, response) {
						var f = Ext.decode(response.responseText);
						if (f.length == 0) {
							Ext.msg("error", '没有可以设置条件的列!'.loc());
							return false;
						}
						var stu = {};
						var coArr = new Array();
						for (var i = 0; i < f.length; i++) {
							stu[f[i].dataIndex] = f[i];
							coArr.push([f[i].dataIndex, f[i].text]);
						}
						this.tree = this.createTree(stu, coArr,	params.parent_id, f[0].dataIndex);
						this.MainTabPanel.add(this.tree);
						this.MainTabPanel.doLayout();
					}
				});
	},
	createTree : function(stu, coArr, objectId, firstConditionName) {
		var w=this.parentPanel.getInnerWidth()-450-128;
		var tree = new dev.ctrl.ListConditionTree({
					rootVisible : false,
					fields : coArr,
					autoScroll : true,
				
					stu : stu,
					columns : [{
								header : '条件项'.loc(),
								dataIndex : 'name',
								width : 450
							}, {
								header : '操作'.loc(),
								width : 120,
								dataIndex : 'action'
							}, {
								header : '值'.loc(),
								width : w,
								dataIndex : 'value'
							}],
					loader : new Ext.tree.TreeLoader({
								dataUrl : '/dev/ctrl/ListCondition.jcp?objectId='
										+ objectId + "&type=" + this.type,
								requestMethod : 'GET',
								uiProviders : {
									'col' : Ext.tree.ColumnNodeUI
								}
							}),
					root : new Ext.tree.AsyncTreeNode({
								id : firstConditionName,
								text : '组:并且'.loc()
							})
				});
				
		var expanded = false;
		tree.root.on("load", function() {
					if (expanded)
						return;
					expanded = true;
					tree.expandAll();
				});
		tree.on("beforestartediting", function(node) {
					this.addCondition.setDisabled(node.leaf);
					this.addGroup.setDisabled(node.leaf);
					return true;
				}, this);
		return tree;
	}
}
