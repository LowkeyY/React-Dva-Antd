Ext.namespace('lib.SelectRole');
lib.SelectRole.SelectRole = function(config) {

	/**
	 * 弹出选择窗口的根节点的部门ID，默认为0
	 * 
	 * @property deptId
	 * @type int
	 */

	/**
	 * 弹出窗口的背景色，默认为白色。
	 * 
	 * @property bodyStyle
	 * @type String
	 */

	lib.SelectRole.SelectRole.superclass.constructor.call(this, config);
	this.root = new Ext.tree.AsyncTreeNode({
				text : '选择角色'.loc(),
				draggable : false,
				expanded : true,
				level : 1,
				id : config.deptId || "0",
				allowSelect : false,
				icon : "/themes/icon/common/group.gif"
			})
	this.dept_id = "";
	this.dept_name = "";
	this.role_id = "";
	this.on("select", function(a, node, b) {
				this.role_id = node.attributes.role_id;
				this.value = this.role_id;
				this.dept_id = node.attributes.dept_id;
				this.dept_name = node.attributes.dept_name;
			}, this)
}
Ext.extend(lib.SelectRole.SelectRole, lib.ComboTree.ComboTree, {
			forceLeaf : true,
			width : 200,
			mode : 'remot',
			loader : new Ext.tree.TreeLoader({
						dataUrl : '/lib/SelectRole/SelectRole.jcp',
						requestMethod : "GET"
					}),
			getRoleID : function() {
				return this.role_id;
			},
			getRoleName : function() {
				return this.getText();
			},
			getDeptID : function() {
				return this.dept_id;
			},
			getDeptName : function() {
				return this.dept_name;
			},
			setValue : function(id, name) {
				if (typeof(id) == 'undefined')
					return;
				else if (typeof(name) == 'undefined') {
					Ext.Ajax.request({
								url : '/lib/SelectRole/SelectRole.jcp',
								method : 'post',
								params : {
									roleId : id
								},
								scope : this,
								callback : function(options, success, response) {
									var val = Ext.decode(response.responseText);
									if(val.success){
										this.role_id = id;
										this.dept_id = val.deptId;
										this.dept_name = val.deptName;
										lib.SelectRole.SelectRole.superclass.setValue.apply(this, [id, val.value]);
									}
								}
							});
				} else {
					lib.SelectRole.SelectRole.superclass.setValue.apply(this, [
									id, name]);
				}
			}
		});
Ext.reg('selectrole', lib.SelectRole.SelectRole);
