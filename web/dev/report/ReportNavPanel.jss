Ext.namespace("dev.report");

dev.report.ReportNavPanel = function(){
	var str='报表导航'.loc();		
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=20"  icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	this.event0 = new Object();
	this.fistLoad=false;
	this.clickEvent=function(clickNode){
		var params={};
		var Report=this.frames.get('Report');
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}
	
		if(!this.fistLoad){
			var loadReport=function(){ 
				
					if(!Report.reportPanel){
						if(!Report.mainPanel.havePanel("ReportMainTab")){
							using("dev.report.ReportPanel");
							Report.reportPanel =new dev.report.ReportPanel(this.frames);
							Report.mainPanel.add(Report.reportPanel.MainTabPanel);
						}
						Report.mainPanel.setActiveTab("ReportMainTab");
						Report.reportPanel.init();
					}
					if(clickNode.prop.objectType=="1"){
						if(clickNode.prop.params){
							Report.reportPanel.newReport(params);
						}
					}else if(clickNode.prop.objectType=="20"){
						if(clickNode.prop.params){
							Report.reportPanel.loadData(params);
						}
					}
					this.fistLoad=true;

			}.createDelegate(this);
			useJS(  
				["/dev/report/yui/yahoo.js","/dev/report/jsgraphics/wz_jsgraphics.js"],loadReport
			);   
		}else{
			if(clickNode.prop.objectType=="1"){
				if(clickNode.prop.params){
					Report.reportPanel.newReport(params);
				}
			}else if(clickNode.prop.objectType=="20"){
				if(clickNode.prop.params){
					params['title']=clickNode.prop.title;
					Report.reportPanel.loadData(params);
				}
			}
		}
	}.createDelegate(this);
	var titleClick=this.clickEvent.createDelegate(this);
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);
	
	dev.report.ReportNavPanel.superclass.constructor.call(this, {
			id:'ReportNavigator',
            title: '系统报表管理'.loc(),
            region: 'west',
            split: true,
            width: 250,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.report.ReportNavPanel, Ext.Panel, {
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
		if(uStore.getAttribute("reportDesign")){
			this.menuTree.loadHistory("reportDesign");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("reportDesign");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

