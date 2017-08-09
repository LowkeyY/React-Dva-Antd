
dev.quality.InstanceNavPanel = function(frames){
	
	 this.frames=frames;

	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'+'质控实例导航'.loc()+'" target="right"  url="/dev/quality/instancetree.jcp?_id=top"/></forder></root>'));
	this.event1 = new Object();

	this.clickEvent=function(clickNode){
			qualityInstance = this.frames.get("qualityInstance");
			if(clickNode.prop.params){
				var navParams={};
				if(clickNode.prop.params){
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						navParams[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}	
				}
				if(!qualityInstance.mainPanel.havePanel("instancePanel")){
					using("dev.quality.InstancePanel");
					qualityInstance.instancePanel = new dev.quality.InstancePanel(this.frames,navParams);
					qualityInstance.mainPanel.add(qualityInstance.instancePanel.MainTabPanel);
				}
				qualityInstance.mainPanel.setActiveTab("instancePanel");
				if(navParams['type']=='create'){
					qualityInstance.instancePanel.formCreate(navParams);
				}else if(navParams['type']=='edit'){
					qualityInstance.instancePanel.formEdit();
					qualityInstance.instancePanel.loadData(navParams);
				}
			}
	}.createDelegate(this);

	var titleClick=this.clickEvent.createDelegate(this);
	this.event1.title_click = function(){
		titleClick(this);
	};
	this.menuTree.setEvent("event1",this.event1);	

	dev.quality.InstanceNavPanel.superclass.constructor.call(this, {
            title: '质控实例导航'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.quality.InstanceNavPanel, Ext.Panel, {
	init: function(){
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
		if(uStore.getAttribute("qualityInstance")){
			this.menuTree.loadHistory("qualityInstance");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("qualityInstance");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

