Ext.namespace("dev.integrate");
dev.integrate.IntegrateNavPanel = function(){
	var str='应用集成导航'.loc();
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=33"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	
	this.event0 = new Object();
	
	this.clickEvent=function(clickNode){
		if(clickNode.prop.params){
			var params={};
			var paramString=clickNode.prop.params.split('&');
			for(var i=0;i<paramString.length;i++){
				params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
			}	
			Integrate=this.frames.get('Integrate');
			var loader=Integrate.loader;
			var objectId=clickNode.prop._id;
			if (clickNode.prop.objectType=='1'){
				this.treeClickEvent(Integrate,{
					objectId:objectId,
					functionName:"init",
					type:'integrate'
				});
			}else if (clickNode.prop.objectType=='33'){ 
				this.treeClickEvent(Integrate,{
					objectId:objectId,
					functionName:"loadData",
					type:'integrate'
				});
			}
		}
	}.createDelegate(this);

	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	};

	this.menuTree.setEvent("event0",this.event0);
	dev.integrate.IntegrateNavPanel.superclass.constructor.call(this, {
			id:'IntegrateNavigator',
            title: '应用集成管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.integrate.IntegrateNavPanel, Ext.Panel, {
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
		if(uStore.getAttribute("Integrate")){
			this.menuTree.loadHistory("Integrate");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("Integrate");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	},
	treeClickEvent:function(Integrate,params){
		var main=Integrate.mainPanel;
		using("lib.ListValueField.ListValueField");
		using("lib.ComboTree.ComboTree");
		using("lib.SelectMenu.SelectMenu");
		using("dev.integrate.IntegratePanel");

		if(!Integrate.integratePanel){
			Integrate.integratePanel=new dev.integrate.IntegratePanel(params.objectId,Integrate);
			main.add(Integrate.integratePanel.MainTabPanel);
		}
		main.setActiveTab(Integrate.integratePanel.MainTabPanel);
		Integrate.integratePanel[params.functionName]({
			parent_id:params.objectId
		},main);
	}
});

