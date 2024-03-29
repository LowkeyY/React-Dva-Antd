Ext.namespace('lib.SelectUser');
lib.SelectUser.SelectUser = function(config) {
	lib.SelectUser.SelectUser.superclass.constructor.call(this, config);
	this.root = new Ext.tree.AsyncTreeNode({
				text : '选择用户'.loc(),
				draggable : false,
				expanded : true,
				level : 1,
				id : config.deptId || "0",
				allowSelect : false,
				icon : "/themes/icon/common/group.gif",
				other_requests : config.other_requests ? {"others" : ",mail,phone,"} : false
	})
	this.dept_id = "";
	this.dept_name = "";
	this.user_id = "";
	this.on("select", function(a, node, b) {
				this.dept_id = node.attributes.dept_id;
				this.user_id = node.attributes.user_id;
				this.value = this.user_id;
				this.dept_name = node.attributes.dept_name;
			}, this)
}
Ext.extend(lib.SelectUser.SelectUser, lib.ComboTree.ComboTree, {
			forceLeaf : true,
			width : 200,
			mode : 'remot',
			loader : new Ext.tree.TreeLoader({
						dataUrl : '/lib/SelectUser/SelectUser.jcp',
						requestMethod : "GET",
						listeners :{
							"beforeload":function(treeLoader, node) {
								if(node.attributes.level === 1 && node.attributes.other_requests){
									treeLoader.baseParams = node.attributes.other_requests;
								}
							}
						}
					}),
			getUserID : function() {
				return this.user_id;
			},
			getUserName : function() {
				return this.getText();
			},
			getDeptID : function() {
				return this.dept_id;
			},
			getDeptName : function() {
				return this.dept_name;
			},
			setValue : function(id, name) {
				if (typeof(id) == 'object') {
					lib.SelectUser.SelectUser.superclass.setValue.apply(this, [
									id, name]);
					return;
				}
				if (typeof(id) == 'undefined' || id == '') {
					lib.SelectUser.SelectUser.superclass.setValue.call(this,
							'', '');
					return;
				}
				if (typeof(name) == 'undefined') {
					if (this.textMode) {
						name = id;
						lib.SelectUser.SelectUser.superclass.setValue.apply(
								this, [id, name]);
					} else {
						Ext.Ajax.request({
									url : '/lib/SelectUser/SelectUser.jcp',
									method : 'post',
									params : {
										userId : id
									},
									scope : this,
									callback : function(options, success,
											response) {
										var val = Ext
												.decode(response.responseText);
										if(val.success){
											this.dept_id = val.deptId;
											this.user_id = id;
											this.dept_name = val.deptName;
											lib.SelectUser.SelectUser.superclass.setValue
													.apply(this, [id, val.value]);
										}
									}
								});
					}
				} else {
					var pos = id.indexOf("_");
					if (pos != -1)
						id = id.substring(pos + 1);
					lib.SelectUser.SelectUser.superclass.setValue.apply(this, [
									id, name]);
				}
			}
		});
Ext.reg('selectuser', lib.SelectUser.SelectUser);
