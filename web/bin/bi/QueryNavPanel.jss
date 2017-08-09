

bin.bi.QueryNavPanel = function(){
	var strTitle = '通用查询'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event0"><e _id="30000" objectType="1" params=\"method=user\" _parent="root" title="'+strTitle+'" url="/bin/bi/tree.jcp?method=user&amp;parentType=query&amp;_id=30000"/></forder></root>'));

	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var params={};
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	
		var Query=this.frames.get('Query');
		if(clickNode.prop.objectType=="1"){
			try{
				Query.mainPanel.showStatus();
				if(!Query.mainPanel.havePanel("queryMainPanel")){
					using("dev.query.QueryPanel");
					Query.queryPanel = new dev.query.QueryPanel(this.frames);
					Query.mainPanel.add(Query.queryPanel.MainTabPanel);
				}
				Query.mainPanel.setActiveTab("queryMainPanel");
			}catch(e){}	
		}else if(clickNode.prop.objectType=="2"){
			try{
					if(!Query.mainPanel.havePanel("QueryViewPanel")){
						Query.mainPanel.hideStatus();
						using("bin.bi.QueryGridPanel");
						using("bin.bi.QueryViewPanel");
						Query.queryViewPanel = this.frames.createPanel(new bin.bi.QueryViewPanel(true)); 
						Query.mainPanel.add(Query.queryViewPanel.MainTabPanel);
					}
					Query.queryViewPanel.init(params);
					Query.mainPanel.setActiveTab("QueryViewPanel");
			}catch(e){Ext.msg('error',e)}	
		}
	}.createDelegate(this);

	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);	
	bin.bi.QueryNavPanel.superclass.constructor.call(this, {
			id:'QueryNavigator',
            title: '查询系统'.loc(),
            region: 'west',
            split: true,
            width: 210,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(bin.bi.QueryNavPanel, Ext.Panel, {
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
		}else if(nowNode.prop._parent=='30000'&&nowNode.index()==nowNode.parent.son.length -1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("userQuery")){
			this.menuTree.loadHistory("userQuery");
			var nowNode=this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree,nowNode);
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree,nowNode);
			this.menuTree.loadHistory("userQuery");
		};
	}
});

