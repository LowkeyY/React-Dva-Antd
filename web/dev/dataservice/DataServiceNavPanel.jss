// 数据服务导航Panel js
dev.dataservice.DataServiceNavPanel = function(){
	
	var str='数据服务导航'.loc();

	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=34"   icon0="/themes/icon/xp/tablink.gif" icon1="/themes/icon/xp/tablink.gif"/></forder></root>'));
	
	this.event0 = new Object();

	this.clickEvent=function(clickNode){
		var DataService=this.frames.get('DataService');
		var prop=clickNode.prop.params;
	
			var params={};
			var paramString=prop.split('&');
			for(var i=0;i<paramString.length;i++){
				params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
			}	
		
		if(clickNode.prop.objectType=='1'||clickNode.prop.objectType=='34'){
			if(!DataService.mainPanel.havePanel("DataService")){
				using("dev.dataservice.DataServicePanel"); 
			
				DataService.DataServicePanel = new dev.dataservice.DataServicePanel(this.frames,params);     
				DataService.mainPanel.add(DataService.DataServicePanel.MainTabPanel);
			}      
			DataService.mainPanel.setActiveTab("DataService");
		}
		if (clickNode.prop.objectType=='1'){
			DataService.DataServicePanel.init(params);
			DataService.DataServicePanel.newDataService(params);
		}else if (clickNode.prop.objectType=='34'){ 
			DataService.DataServicePanel.loadData(params);
		}                                                            
	}.createDelegate(this);
	
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);

	dev.dataservice.DataServiceNavPanel.superclass.constructor.call(this, {
			id:'DataServicetNavigator',
            title: '数据服务'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.dataservice.DataServiceNavPanel, Ext.Panel, {
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
		}else if(nowNode.prop.objectType=='0'&&nowNode.index()==nowNode.parent.son.length -1&&nowNode.parent.son.length!=1){
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
		var uStore=new UserStore(tree_store);
		if(uStore.getAttribute("DataService")){
			this.menuTree.loadHistory("DataService");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("DataService");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

