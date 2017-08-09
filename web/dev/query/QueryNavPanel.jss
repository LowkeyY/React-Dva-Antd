Ext.namespace("dev.query");

dev.query.QueryNavPanel = function(){
	
	var str='应用查询导航'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=4"  icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var params={};
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	

		var Query=this.frames.get('Query');
		if(!Query.queryPanel){
			if(!Query.mainPanel.havePanel("queryMainPanel")){
				using("dev.query.QueryPanel");
				Query.queryPanel = new dev.query.QueryPanel(this.frames);
				Query.mainPanel.add(Query.queryPanel.MainTabPanel);
			}
			Query.mainPanel.setActiveTab("queryMainPanel"); 
		}
		if(clickNode.prop.objectType=="1"){      
			if(clickNode.prop.params){
				Query.queryPanel.init();
				Query.queryPanel.newQuery(params);
			}
		}else if(clickNode.prop.objectType=="4"){
			if(clickNode.prop.params){
				Query.queryPanel.init();
				Query.queryPanel.loadData(params);
			}
		}
	}.createDelegate(this);

	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);	

	dev.query.QueryNavPanel.superclass.constructor.call(this, {
			id:'QueryNavigator',
            title: '系统查询管理'.loc(),
            region: 'west',
            split: true,
            width: 280,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.query.QueryNavPanel, Ext.Panel, {
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
		}else if(nowNode.prop._parent=='0'&&nowNode.index()==nowNode.parent.son.length -1&&nowNode.parent.son.length!=1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			if(nowNode.prop._id==newNode.prop._id){
				return;
			}else{
				this.exeHistoryNode(menuTree,newNode)
			}
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("query")){
			this.menuTree.loadHistory("query");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("query");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

