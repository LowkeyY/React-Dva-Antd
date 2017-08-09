Ext.namespace("dev.system");

etc.install.NavPanel = function(frames){
	this.frames=frames;
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event0"><e _id="top" operationType="0" _parent="root" title="'+'系统架构体系'.loc()+'" url="/etc/install/tree.jcp?level=1"  params="top"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var System=this.frames.get("System");
		if(clickNode.prop.operationType=="0"){
			if(!System.mainPanel.havePanel("installBase")){
				using("etc.install.BasePanel");
				System.installPanel = new etc.install.BasePanel(this.frames);
				System.mainPanel.add(System.installPanel.MainTabPanel);
			}
			System.mainPanel.setActiveTab("installBase");
		}else if(clickNode.prop.operationType=="1"||clickNode.prop.operationType=="2"){
			if(!System.mainPanel.havePanel("systemBase")){
				using("dev.system.BasePanel");
				System.basePanel = new dev.system.BasePanel(this.frames,'install');
				System.mainPanel.add(System.basePanel.MainTabPanel);
			}
			System.mainPanel.setActiveTab("systemBase"); 
			if(clickNode.prop.params){
				var params={};
				if(clickNode.prop.operationType=="1"){
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}	
				}else{
					params['id']=clickNode.prop._parent;
				}
				System.basePanel.formEdit();
				System.basePanel.loadData(params);
			}
		}else if(clickNode.prop.operationType=="3"){
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}	
				if(!System.mainPanel.havePanel("systemRole")){
					using("dev.system.RolePanel");
					System.rolePanel = new dev.system.RolePanel(this.frames,params);	 
					System.mainPanel.add(System.rolePanel.MainTabPanel);
				}
				System.mainPanel.setActiveTab("systemRole");
				params['type']='new';
				System.rolePanel.formCreate(params);
				System.rolePanel.systemRoleForm.form.reset();
			}
		}else if(clickNode.prop.operationType=="4"){
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}	
				if(!System.mainPanel.havePanel("systemRole")){
					using("dev.system.RolePanel");
					System.rolePanel = new dev.system.RolePanel(this.frames,params);	 
					System.mainPanel.add(System.rolePanel.MainTabPanel);
				}
				System.mainPanel.setActiveTab("systemRole");
				System.rolePanel.formEdit();
				System.rolePanel.loadData(params);
			}
		}
	}.createDelegate(this);
	this.frames.set("clickEvent",this.clickEvent);
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);
   
	etc.install.NavPanel.superclass.constructor.call(this,{
			id:'systemNavigator',
            title: '系统架构管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(etc.install.NavPanel, Ext.Panel, {
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
		}else if(nowNode.prop._parent=='0'&&nowNode.index()==nowNode.parent.son.length -1){
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
		if(uStore.getAttribute("system")){
			this.menuTree.loadHistory("system");
			var nowNode=this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree,nowNode);
		}else{
			var nowNode=this.menuTree.getNowNode();	
			this.exeHistoryNode(this.menuTree,nowNode);
			this.menuTree.loadHistory("system");
		};
	}
});

