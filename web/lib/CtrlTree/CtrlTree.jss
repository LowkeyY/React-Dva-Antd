Ext.ux.SelectDept=function(config){
	Ext.ux.SelectDept.superclass.constructor.call(this, config);
	this.root=new Ext.tree.AsyncTreeNode( {
		text : '选择部门'.loc(),
		draggable : false,
		expanded : true,
		level:1,
		id :config.dept_id,
		allowSelect:false,
		icon : "/themes/icon/xp/SelectDept.gif"
	})
} 
Ext.extend(Ext.ux.SelectDept,lib.ComboTree.ComboTree,{
		forceLeaf : true,
		width : 200,
		mode : 'remot',
		loader : new Ext.tree.TreeLoader( {
			dataUrl : '/lib/SelectDept/SelectDept.jcp',
			requestMethod : "GET"
		}),
		getDeptID:function(){
			return this.getValue();	
		},
		getDeptName:function(){
			return this.getText();
		}
});
Ext.reg('Selectdept',Ext.ux.SelectDept);
