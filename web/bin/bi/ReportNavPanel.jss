Ext.namespace("bin.bi");


bin.bi.ReportNavPanel = function(){
	var strTitle = '通用报表'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event0"><e _id="30001" objectType="1" params=\"method=user&amp;_id=30001\" _parent="root" title="'+strTitle+'" url="/bin/bi/tree.jcp?method=user&amp;parentType=report&amp;_id=30001"/></forder></root>'));

	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var params={};
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	
		Report=this.frames.get('Report');
		if(clickNode.prop.objectType=="1"){
			try{
				if(!Report.mainPanel.havePanel("ReportMainTab")){
					using("dev.report.ReportPanel");
					Report.reportPanel =new dev.report.ReportPanel(this.frames);
					Report.mainPanel.add(Report.reportPanel.MainTabPanel);
				}
				Report.mainPanel.setActiveTab("ReportMainTab");
				if(clickNode.prop.params){
					Report.reportPanel.init();
					Report.reportPanel.newReport(params);
				}
			}catch(e){}	
		}else if(clickNode.prop.objectType=="2"){
			try{
				if(!Report.mainPanel.havePanel("userReportPanel")){
					using("bin.bi.ReportViewPanel");
					Report.reportViewPanel = this.frames.createPanel(new bin.bi.ReportViewPanel(Report,params)); 
					Report.mainPanel.add(Report.reportViewPanel.MainTabPanel);
				}
				Report.mainPanel.setActiveTab("userReportPanel");
			}catch(e){}	
		}
	}.createDelegate(this);

	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);	
	bin.bi.ReportNavPanel.superclass.constructor.call(this, {
			id:'ReportNavigator',
            title: '报表系统'.loc(),
            region: 'west',
            split: true,
            width: 210,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(bin.bi.ReportNavPanel, Ext.Panel, {
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
		}else if(nowNode.prop._parent=='30001'&&nowNode.index()==nowNode.parent.son.length -1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("UserReport")){
			this.menuTree.loadHistory("UserReport");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("UserReport");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

