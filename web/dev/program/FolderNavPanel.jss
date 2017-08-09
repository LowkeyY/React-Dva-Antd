
dev.program.FolderNavPanel = function(ProgramAuth){

	var str='程序目录'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'+str+'" target="right"  url="/dev/program/tree.jcp?id=-1"/></forder></root>'));
	this.event1 = new Object();
	this.clickEvent=function(clickNode){
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
			var ProgramAuth = this.frames.get("ProgramAuth");
			var folder_id=clickNode.prop._id;
			if(!ProgramAuth.mainPanel.havePanel("FolderAuthFramePanel")){
				using("dev.program.FolderAuthFramePanel");
				ProgramAuth.reportFrameAuthPanel = new dev.program.FolderAuthFramePanel(this.frames,folder_id,orgJSON.id,name);
				ProgramAuth.mainPanel.add(ProgramAuth.reportFrameAuthPanel.MainTabPanel);
			}
			ProgramAuth.mainPanel.setActiveTab("FolderAuthFramePanel");
			ProgramAuth.reportFrameAuthPanel.init(folder_id);
			console.log(folder_id);
		},this);
	}.createDelegate(this);

	var titleClick=this.clickEvent;
	this.event1.title_click = function(){
		titleClick(this);
		//var folder_id=this.prop._id;
		//ProgramAuth.reportFrameAuthPanel.init(folder_id);
	};
	this.menuTree.setEvent("event1",this.event1);	
	dev.program.FolderNavPanel.superclass.constructor.call(this, {
            title: '程序目录导航'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.program.FolderNavPanel, Ext.Panel, {
	init : function(){
		this.menuTree.finish(this.body.dom,document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			this.clickEvent(nowNode);
		}else if(nowNode.index()==nowNode.parent.son.length -1){
			return false;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("ProgramAuth")){
			this.menuTree.loadHistory("ProgramAuth");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("ProgramAuth");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

