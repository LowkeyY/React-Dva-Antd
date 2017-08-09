
bin.user.RoleAuthNavPanel = function(ct){    
	this.clickEvent=function(clickNode){
		var RoleAuth=this.frames.get('RoleAuth');
		var params={};
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}
		if(!RoleAuth.mainPanel.havePanel("roleAuthPanel")){
			using("bin.user.RoleAuthFramePanel");
			RoleAuth.roleAuthFramePanel = new bin.user.RoleAuthFramePanel(this.frames);
			RoleAuth.roleAuthFramePanel.frames=this.frames;
			RoleAuth.mainPanel.add(RoleAuth.roleAuthFramePanel.MainTabPanel);
		}
		RoleAuth.mainPanel.setActiveTab("roleAuthPanel");
		RoleAuth.roleAuthFramePanel.showList(params);
		RoleAuth.roleAuthPanel.renderTree();
	};

	bin.user.RoleAuthNavPanel.superclass.constructor.call(this, {
            title: '部门导航'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            margins:'0 0 0 0',
            cmargins:'0 0 0 0'
    });
};
Ext.extend(bin.user.RoleAuthNavPanel, Ext.Panel, {
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
			this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event1"><e _id="'+orgJSON.id+'" _parent="root" title="'+name+'"  type="new"  params="dept_id='+orgJSON.id+'"  url="/bin/user/tree.jcp?dept_id='+orgJSON.id+'"   icon0="/themes/icon/all/chart_organisation.gif" icon1="/themes/icon/all/chart_organisation.gif"/></forder></root>'));
			this.event1 = new Object();
			var titleClick=this.clickEvent.createDelegate(this);
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
			return;
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
		if(uStore.getAttribute("Dept")){
			this.menuTree.loadHistory("Dept");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("Dept");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

