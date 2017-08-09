Ext.namespace("dev.olap");

dev.olap.OLAPNavPanel = function(){
			
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="联机分析导航" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=36"  icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var params={};
		var OLAP=this.frames.get('OLAP');
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	
		if(!OLAP.olapPanel){
			if(!OLAP.mainPanel.havePanel("OLAPMainTab")){
				using("dev.olap.OLAPPanel");
				using("dev.olap.OLAPGrid");
				OLAP.olapPanel =new dev.olap.OLAPPanel(this.frames);
				OLAP.mainPanel.add(OLAP.olapPanel.MainTabPanel);
			}
			OLAP.mainPanel.setActiveTab("OLAPMainTab");
		}
		if(clickNode.prop.objectType=="1"){
			if(clickNode.prop.params){
				OLAP.olapPanel.init();
				OLAP.olapPanel.newOLAP(params);
			}
		}else if(clickNode.prop.objectType=="20"){
			OLAP.olapPanel.init();
			if(clickNode.prop.params){
				OLAP.olapPanel.loadData(params);
			}
		}
	}.createDelegate(this);
	var titleClick=this.clickEvent.createDelegate(this);
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);
	
	dev.olap.OLAPNavPanel.superclass.constructor.call(this, {
			id:'OLAPNavigator',
            title: '联机分析管理',
            region: 'west',
            split: true,
            width: 200,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.olap.OLAPNavPanel, Ext.Panel, {
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
		if(uStore.getAttribute("olapDesign")){
			this.menuTree.loadHistory("olapDesign");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("olapDesign");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

