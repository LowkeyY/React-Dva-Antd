Ext.namespace("dev.textreport");

dev.textreport.TextReportNavPanel = function(){

	var str='文字报告导航'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event0"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=21"  params="id=0"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	
	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var params={};
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	
		var TextReport=this.frames.get('TextReport');
		if(!TextReport.mainPanel.havePanel("TextReportMain")){
			using("dev.textreport.TextReportPanel");
			TextReport.textReportPanel = this.frames.createPanel(new dev.textreport.TextReportPanel(params));
			TextReport.mainPanel.add(TextReport.textReportPanel.MainTabPanel);
		}
		TextReport.mainPanel.setActiveTab("TextReportMain");
		if(clickNode.prop.objectType=="1"){
			if(clickNode.prop.params){
				TextReport.textReportPanel.init(params);
				TextReport.textReportPanel.newReport(params);
			}
		}else if(clickNode.prop.objectType=="21"){
			if(clickNode.prop.params){
				TextReport.textReportPanel.loadData(params);
			}
		}
	}.createDelegate(this);

	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);

	dev.textreport.TextReportNavPanel.superclass.constructor.call(this, {
			id:'TextReportNavigator',
            title: '文字报告管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.textreport.TextReportNavPanel, Ext.Panel, {
	init : function(){
		this.menuTree.finish(this.body.dom, document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			if(nowNode.prop._id=='0')
				return;
			else
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
		if(uStore.getAttribute("TextReport")){
			this.menuTree.loadHistory("TextReport");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("TextReport");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

