
dev.portlet.PortletNavPanel = function(frames){

	var str='决策仪表盘导航'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=28"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	
	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		if(clickNode.prop.params){
			var params={};
			var paramString=clickNode.prop.params.split('&');
			for(var i=0;i<paramString.length;i++){
				params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
			}	
			Portlet=this.frames.get('Portlet');
			var objectId=clickNode.prop._id;
			if (clickNode.prop.objectType=='1'){
				this.treeClickEvent(Portlet,{
					objectId:objectId,
					functionName:"init",
					type:'portlet'
				});
			}else if (clickNode.prop.objectType=='28'){ 
				this.treeClickEvent(Portlet,{
					objectId:objectId,
					functionName:"loadData",
					type:'portlet'
				});
			}else if (clickNode.prop.objectType=='7'){ 
				this.treeClickEvent(Portlet,{
					objectId:objectId,
					functionName:"loadData",
					type:'program'
				});
			}
		}
	}.createDelegate(this);
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	};
	this.menuTree.setEvent("event0",this.event0);
	dev.portlet.PortletNavPanel.superclass.constructor.call(this, {
			id:'PortletNavigator',
            title: '决策仪表盘导航'.loc(),
            region: 'west',
            split: true,
            width: 230,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.portlet.PortletNavPanel, Ext.Panel, {
    region: 'west',
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
		}else if(nowNode.prop.objectType=='0'&&nowNode.index()==nowNode.parent.son.length -1){
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
		if(uStore.getAttribute("Portlet")){
			this.menuTree.loadHistory("Portlet");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("Portlet");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	},
	treeClickEvent:function(Portlet,params){
		var main=Portlet.mainPanel;
		if(params.type=="program"){

					using("lib.ComboRemote.ComboRemote");
					using("lib.ComboTree.ComboTree");
					using("dev.program.ProgramPanel");
					using("dev.program.ProgramGrid");
					Ext.Ajax.request({
						url : '/dev/module/SelectTerminalType.jcp',
						params : {
							id:params.objectId
						},
						method : 'GET',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success) {
								var terminalType = result.terminalType;
								if(!Portlet.programPanel){
									Portlet.programPanel =new dev.program.ProgramPanel('portlet',Portlet,"", {
											hideTarget : true
										}); 
									main.add(Portlet.programPanel.MainTabPanel);
								}
								main.setActiveTab(Portlet.programPanel.MainTabPanel);
								if(Portlet.programPanel.MainTabPanel.rendered){
									Portlet.programPanel[params.functionName]({
										parent_id:params.objectId,
										objectId:params.objectId,
										terminalType : terminalType,
										returnFunction:function(main){
												main.setActiveTab('portletProgramPanel');
										}.createCallback(main)
									},main);
								}  
							}else{
								Ext.msg("error", result.message);
							}
						}
					});
		}else if(params.type=="portlet"){
			using("dev.portlet.PortletPanel");
			if(!Portlet.portletPanel){
				Portlet.portletPanel=new dev.portlet.PortletPanel(params.objectId,Portlet);
				main.add(Portlet.portletPanel.MainTabPanel);
			}
			main.setActiveTab(Portlet.portletPanel.MainTabPanel);
			Portlet.portletPanel[params.functionName]({
				parent_id:params.objectId,
				returnFunction:function(main){
								main.setActiveTab('portletPanel');
							}.createCallback(main)
			},main);
		}
	}
});