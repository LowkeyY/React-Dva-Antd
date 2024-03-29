Ext.namespace('lib.SelectDept');
lib.SelectDept.SelectDept = function(config) {
	lib.SelectDept.SelectDept.superclass.constructor.call(this, config);

	this.root = new Ext.tree.AsyncTreeNode({
				text : '选择部门'.loc(),
				draggable : false,
				expanded : true,
				level : 1,
				id : config.deptId || "0",
				allowSelect : false,
				icon : "/themes/icon/xp/SelectDept.gif"
			})
}
Ext.extend(lib.SelectDept.SelectDept, lib.ComboTree.ComboTree, {
			forceLeaf : true,
			width : 200,
			mode : 'remote',
			loader : new Ext.tree.TreeLoader({
						dataUrl : '/lib/SelectDept/SelectDept.jcp',
						requestMethod : "GET"
					}),
			getDeptID : function() {
				return this.getValue();
			},
			getDeptName : function() {
				return this.getText();
			},
			setValue : function(id, name) {
				if (typeof(id) == 'object') {
					lib.SelectDept.SelectDept.superclass.setValue.apply(this, [
									id, name]);
					return;
				}
				if (typeof(id) == 'undefined' || id == '') {
					lib.SelectDept.SelectDept.superclass.setValue.call(this,
							'', '');
					return;
				}
				if (typeof(name) == 'undefined') {
					if (this.textMode) {
						name = id;
						lib.SelectDept.SelectDept.superclass.setValue.apply(
								this, [id, name]);
					} else {
						Ext.Ajax.request({
									url : '/lib/SelectDept/SelectDept.jcp',
									method : 'post',
									params : {
										deptId : id
									},
									scope : this,
									callback : function(options, success,
											response) {
										var val = Ext
												.decode(response.responseText);
										lib.SelectDept.SelectDept.superclass.setValue
												.apply(this, [id, val.value]);
									}
								});
					}
				} else {
					lib.SelectDept.SelectDept.superclass.setValue.apply(this, [
									id, name]);
				}
			}
		});
Ext.reg('selectdept', lib.SelectDept.SelectDept);
