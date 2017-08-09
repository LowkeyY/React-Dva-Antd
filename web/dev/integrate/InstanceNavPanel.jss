
dev.integrate.InstanceNavPanel = function(frames){
	
	var str='集成实例导航'.loc();
	 this.frames=frames;

	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'+str+'" target="right"  url="/dev/integrate/instancetree.jcp?_id=top"/></forder></root>'));
	this.event1 = new Object();

	this.clickEvent=function(clickNode){
			IntegrateInstance = this.frames.get("IntegrateInstance");
			if(clickNode.prop.params){
				var params={};
				if(clickNode.prop.params){
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}	
				}
				if(!IntegrateInstance.mainPanel.havePanel("instancePanel")){
					using("dev.integrate.InstancePanel");
					IntegrateInstance.instancePanel = new dev.integrate.InstancePanel(this.frames,params);
					IntegrateInstance.mainPanel.add(IntegrateInstance.instancePanel.MainTabPanel);
				}
				IntegrateInstance.mainPanel.setActiveTab("instancePanel");

				if(params['type']=='create'){
					IntegrateInstance.instancePanel.formCreate(params);
				}else if(params['type']=='edit'){
					IntegrateInstance.instancePanel.formEdit();
					IntegrateInstance.instancePanel.loadData(params);
				}
			}
	}.createDelegate(this);

	var titleClick=this.clickEvent.createDelegate(this);
	this.event1.title_click = function(){
		titleClick(this);
	};
	this.menuTree.setEvent("event1",this.event1);	

	dev.integrate.InstanceNavPanel.superclass.constructor.call(this, {
            title: '集成实例导航'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3',
			tbar:this.buttonArray
    });
};
Ext.extend(dev.integrate.InstanceNavPanel, Ext.Panel, {
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
		if(uStore.getAttribute("integrateInstance")){
			this.menuTree.loadHistory("integrateInstance");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("integrateInstance");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

