
bin.user.DeptNavPanel = function(){
	this.nowNode;
	this.tbar = ["->", {
	text : '移动部门',
	icon : '/themes/icon/all/book_next.gif',
	scope : this,
	handler : function(btn) {
		var node = this.menuTree.getNowNode();
		if (node.prop._id == '0') {
			Ext.msg("error", "请先点击要移动的部门。");
			return false;
		}
		var deptRoot = this.menuTree.root , winTreeTitle = "根部门";
		if(deptRoot.son && deptRoot.son.length){
			try{
				winTreeTitle = deptRoot.son[0].prop.title
			}catch(e){
			}
		} else {
			Ext.msg("error", "无移动的部门。");
			return false;
		}
		var tree = new Ext.Panel({
			menuTree : new MenuTree(Tool.parseXML('' +
					'<root _id="root">' +
						'<forder _hasChild="1" event="event1">' +
							'<e _id="0" _parent="root" title="'+winTreeTitle+'" type="view"  params="dept_id=0&amp;org_id=0"  ' +
									'url="/bin/user/tree.jcp?dept_id=0&amp;select_dept_id='+node.prop._id+'" icon0="/themes/icon/all/chart_organisation.gif" ' +
									'icon1="/themes/icon/all/chart_organisation.gif"/>' +
					'</forder></root>'))
		});
		var win = new Ext.Window({
			title : '选择部门移动到的位置'.loc(),
			layout : 'fit',
			width : 250,
			tree : tree,
			menuTree : this.menuTree,
			node : node,
			height : 400,
			closeAction : 'close',
			plain : true,
			modal : true,
			items : [tree],
			buttons : [{
				text : '确定'.loc(),
				handler : function() {
					var win = this.ownerCt.ownerCt;
					var node = win.tree.menuTree.getNowNode();
					var p = {
						type : "move",
						dept_id : win.node.prop._id,
						parent_dept_id : node.prop._id
					};
					Ext.Ajax.request({
								url : '/bin/user/create.jcp',
								params : p,
								method : 'POST',
								scope : this,
								success : function(response, options) {
									var result = Ext.decode(response.responseText)
									if (!result.success) {
										Ext.msg("error", result.message);
									} else {
										Ext.msg("info", "移动成功");
										win.menuTree.loadRootNode();
										win.close();
									}
								}
							});
					win.close();
				}
			}, {
				text : '取消'.loc(),
				handler : function() {
					var win = this.ownerCt.ownerCt;
					win.close();
				}
			}]
		});
		win.show();
		tree.menuTree.finish(tree.body.dom, document);
		this.tbar = null;
	}
}];
	
	this.clickEvent=function(clickNode){
		var Dept=this.frames.get('Dept');
		var params={};
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}
		if(clickNode.prop._parent == "root"){
			if(!Dept.mainPanel.havePanel("orgPanel")){
				using("bin.user.OrgPanel");
				Dept.orgPanel = new bin.user.OrgPanel(this.frames);
				Dept.mainPanel.add(Dept.orgPanel.MainTabPanel);
			}
			Dept.mainPanel.setActiveTab("orgPanel");
			if(clickNode.prop.type=="view"){
				params['type']='view';
				Dept.orgPanel.loadData(params);
				Dept.orgPanel.formEdit();
			}else if(clickNode.prop.type=="new"){
				params['type']='new';
				Dept.orgPanel.formCreate(params);
			}
		}else{
			if(!Dept.mainPanel.havePanel("deptPanel")){
				using("bin.user.DeptPanel");
				Dept.deptPanel = new bin.user.DeptPanel(this.frames);
				Dept.mainPanel.add(Dept.deptPanel.MainTabPanel);
			}
			Dept.mainPanel.setActiveTab("deptPanel");
			if(clickNode.prop.type=="view"){
				params['type']='view';
				Dept.deptPanel.loadData(params);
				Dept.deptPanel.formEdit();
			}else if(clickNode.prop.type=="new"){
				params['type']='new';
				Dept.deptPanel.formCreate(params);
			}
		}   
	}.createDelegate(this);

	bin.user.DeptNavPanel.superclass.constructor.call(this, {
            title: '部门导航'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            margins:'0 0 0 0',
            cmargins:'0 0 0 0'   
    });
};
Ext.extend(bin.user.DeptNavPanel, Ext.Panel, {
	init: function(){
		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				url:'/bin/user/getOrg.jcp?'
		});				
		conn.on('requestcomplete', function(conn, oResponse ){	
			var orgJSON = Ext.decode(oResponse.responseText);
			var name=orgJSON.shortName;
			if(name==""){
				name=orgJSON.name;
			}
			this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event1"><e _id="'+orgJSON.id+'" _parent="root" title="'+name+'"  type="view"  params="dept_id='+orgJSON.id+'&amp;org_id='+orgJSON.id+'"  url="/bin/user/tree.jcp?dept_id='+orgJSON.id+'"   icon0="/themes/icon/all/chart_organisation.gif" icon1="/themes/icon/all/chart_organisation.gif"/></forder></root>'));
			this.event1 = new Object();
			var titleClick=this.clickEvent;
			this.event1.title_click = function(){
				titleClick(this);
			};
			this.menuTree.setEvent("event1",this.event1);	
			this.menuTree.finish(this.body.dom,document);
			this.focusHistoryNode();
		},this);
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			this.clickEvent(nowNode);
		}else if(nowNode.prop._parent=='0'&&nowNode.index()==nowNode.parent.son.length -1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("bin.user.DeptFrame")){
			this.menuTree.loadHistory("bin.user.DeptFrame");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("bin.user.DeptFrame");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});