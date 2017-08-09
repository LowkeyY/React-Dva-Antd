Ext.namespace('utils.km.portal'); 
utils.km.portal.NavPanel = function(frames){
	this.frames=frames;
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event1"><e _id="0" _parent="root" title="'+'门户管理'.loc()+'"  program="portal"  params="isSystem=y&amp;id=0&amp;portal_id=0" url="/utils/km/portal/tree.jcp?id=0&amp;level=1&amp;root=&amp;view=create"/></forder></root>'));

	this.event1 = new Object();

	this.clickEvent=function(clickNode){
			var Menu=this.frames.get("Portal");	
			if(clickNode.prop.program=="menu"){
				if(!Menu.mainPanel.havePanel("portalBase")){
					using("utils.km.portal.PortalPanel");
					Menu.menu = new utils.km.portal.PortalPanel(this.frames,Menu);	 
					Menu.mainPanel.add(Menu.menu.MainTabPanel);
				}
				Menu.mainPanel.setActiveTab("portalBase");
				if(clickNode.prop.params){
					var params={};
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}	
					params['son']=clickNode.prop._hasChild;
					Menu.menu.formEdit();
					params.prgType = 'menu';
					Menu.menu.loadData(params);
				}
			}else if(clickNode.prop.program=="top"){	
				if(clickNode.prop.params){
					var params={};
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}	
					params.parent_id=params.id;	
					if(!Menu.mainPanel.havePanel("topPortalBase")){
						using("utils.km.portal.TopPortalPanel");
						Menu.topMenu = new utils.km.portal.TopPortalPanel(this.frames,Menu,'topPortal',params);	 
						Menu.mainPanel.add(Menu.topMenu.MainTabPanel);
					}
					Menu.mainPanel.setActiveTab("topPortalBase");
					Menu.topMenu.formEdit();
					params.prgType = 'top';
					Menu.topMenu.loadData(params);
				}
			}else if(clickNode.prop.program=="portal"){
				if(clickNode.prop.params){
					var params={};
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}
					params.parent_id=params.id;
					if(!Menu.mainPanel.havePanel("topPortalBase")){
						using("utils.km.portal.TopPortalPanel");	
						Menu.topMenu = new utils.km.portal.TopPortalPanel(this.frames,Menu,'topPortal',params);	 
						Menu.mainPanel.add(Menu.topMenu.MainTabPanel);
					}
					Menu.mainPanel.setActiveTab("topPortalBase");
					params.prgType = 'portal';
					Menu.topMenu.formCreate(params);
				}
			}else if(clickNode.prop.program=="publish"){
				if(!Menu.mainPanel.havePanel("publishBase")){
					using("utils.km.portal.PublishPanel");
					Menu.menu = new utils.km.portal.PublishPanel(this.frames,Menu);	 
					Menu.mainPanel.add(Menu.menu.MainTabPanel);
				}
				Menu.mainPanel.setActiveTab("publishBase");
				if(clickNode.prop.params){
					var params={};
					var paramString=clickNode.prop.params.split('&');
					for(var i=0;i<paramString.length;i++){
						params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
					}	
					params['son']=clickNode.prop._hasChild;
					Menu.menu.formEdit();
					params.prgType = 'publish';
					Menu.menu.loadData(params);
				}
			}
	}.createDelegate(this);

	this.frames.set("clickEvent",this.clickEvent);
	var titleClick=this.clickEvent;
	this.event1.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event1",this.event1);
	utils.km.portal.NavPanel.superclass.constructor.call(this, {
            title: '门户导航'.loc(),
            region: 'west',
            split: true,
            width: 225,
            collapsible: true,
            resizable: false,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(utils.km.portal.NavPanel, Ext.Panel, {
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
			this.exeHistoryNode(menuTree,newNode);
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("menu")){
			this.menuTree.loadHistory("menu");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("menu");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

