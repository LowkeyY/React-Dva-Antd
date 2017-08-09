
Ext.namespace('lib.SelectRole');
lib.SelectRole.SelectRoleWindow = function(config){
	this.win;
	this.root=new Ext.tree.AsyncTreeNode( {
		text : '选择角色'.loc(),
		draggable : false,
		expanded : true,
		level:1,
		id :config.deptId || "0",
		allowSelect:false,
		icon : "/themes/icon/common/group.gif"
	});
	this.loader=new Ext.tree.TreeLoader( {
		dataUrl : '/lib/SelectRole/SelectRole.jcp',
		requestMethod : "GET"
	});
	this.loader.on("loadexception",function(tree,node,response){
		var message='部门数据错误'.loc();
		try{
			message=Ext.decode(response.responseText).message;
		}catch(e){}
		Ext.msg("error",message);
	});
	this.tree = new Ext.tree.TreePanel({
		autoScroll : true,
		animate : false,
		containerScroll : true,
		height:'auto',
		layout:'fit',
		root : this.root,
		bodyStyle:config.bodyStyle || 'background-color:white;padding:3 0 0 3;',
		draggable : false,
		split:true,
		width:200,
		collapsible: false,
		loader : this.loader
	});  
	this.tree.on("click",function(node,e){
		if(node.isLeaf() && node.attributes.role_id){
			this.role_id=node.attributes.role_id;
			this.value=this.role_id;
			this.dept_id=node.attributes.dept_id;
			this.dept_name=node.attributes.dept_name;
		}
	},this);
	this.dept_id="";
	this.dept_name="";
	this.role_id="";
	this.win =  new Ext.Window({
		title:'选择职位'.loc(),
		layout:'fit',
		width:250,
		height:400,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.tree],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: this.windowConfirm
		},{
			text: '取消'.loc(),
			scope:this,
			handler: this.windowCancel
		}]
	});  
};
Ext.extend(lib.SelectRole.SelectRoleWindow ,Ext.Window,{
	forceLeaf : true,
	width : 200,
	mode : 'remot',
	getRoleID:function(){
		return this.role_id;	
	},
	getRoleName:function(){
		return this.getText();
	},
	getDeptID:function(){
		return this.dept_id;
	},
	getDeptName:function(){
		return this.dept_name;
	},
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		if(this.role_id==''||this.dept_id==''){
			Ext.msg("error",'必选选择一个职位'.loc());
		}else{
			this.win.close();
		}
    }
});
Ext.reg('selectrolewindow',lib.SelectRole.SelectRoleWindow);