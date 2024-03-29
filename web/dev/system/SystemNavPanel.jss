
dev.system.SystemNavPanel = function(frames){

	var str='系统架构体系'.loc();
	this.frames=frames;
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event0"><e _id="top" operationType="0" _parent="root" title="'+str+'" url="/dev/system/sysTree.jcp?level=1"  params="top"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var System=this.frames.get("System");

		if(clickNode.prop.operationType=="0"){
			if(!System.mainPanel.havePanel("systemBase")){
				using("dev.system.BasePanel");
				System.basePanel = new dev.system.BasePanel(this.frames);
				System.mainPanel.add(System.basePanel.MainTabPanel);
			}
			System.mainPanel.setActiveTab("systemBase");
			System.basePanel.formCreate();
			System.basePanel.systemForm.form.reset();
		}else if(clickNode.prop.operationType=="1"){
			if(!System.mainPanel.havePanel("systemBase")){
				using("dev.system.BasePanel");
				System.basePanel = new dev.system.BasePanel(this.frames);
				System.mainPanel.add(System.basePanel.MainTabPanel);
			}
			System.mainPanel.setActiveTab("systemBase"); 
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}	
				if(params['type']=='create'){
					System.basePanel.formCreate();
				}else{
					System.basePanel.formEdit();
					System.basePanel.loadData(params);
				}
			}
		}else if(clickNode.prop.operationType=="3"){
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}
				if(!System.mainPanel.havePanel("systemGroup")){
					using("dev.system.GroupPanel");
					System.groupPanel = new dev.system.GroupPanel(this.frames,params);	 
					System.mainPanel.add(System.groupPanel.MainTabPanel);
				}
				System.mainPanel.setActiveTab("systemGroup");
				System.groupPanel.formEdit();
				System.groupPanel.loadData(params);
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
		}else if(clickNode.prop.operationType=="5"){
			using("lib.ListValueField.ListValueField");
			loadcss("lib.IconPicker.IconPicker");
			using("lib.IconPicker.IconPicker");
			using("dev.system.TopMenuPanel");

			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}
				var conn=new Ext.data.Connection();
				conn.request({    
						method: 'GET',    
						url:'/dev/system/getUserType.jcp?',
						params:{objectId:params.id}
				});				
				conn.on('requestcomplete', function(conn, oResponse ){	
					var utJSON = Ext.decode(oResponse.responseText);	
					if(!System.mainPanel.havePanel("topMenuBase")){
						System.topMenu = new dev.system.TopMenuPanel(this.frames,System,'portal',params,utJSON);	
						System.mainPanel.add(System.topMenu.MainTabPanel);
					}
					System.mainPanel.setActiveTab("topMenuBase");   
					System.topMenu.formEdit();
					System.topMenu.loadData(params);
				},this);
			}
		}else if(clickNode.prop.operationType=="6"){
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}	
				if(!System.mainPanel.havePanel("applicationPanel")){
					using("lib.ComboTree.ComboTree");
					using("lib.SelectMenu.SelectMenu");
					using("dev.system.ApplicationPanel");
					System.applicationPanel = new dev.system.ApplicationPanel(this.frames,params);	 
					System.mainPanel.add(System.applicationPanel.MainTabPanel);
				}
				System.mainPanel.setActiveTab("applicationPanel");
				System.applicationPanel.formEdit();
				System.applicationPanel.loadData(params);
			}
		}else if(clickNode.prop.operationType=="38"){
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}
				using("dev.system.DatabasePanel");
				System.dbLinkPanel = new dev.system.DatabasePanel(this.frames,params);	 
				System.mainPanel.add(System.dbLinkPanel.MainTabPanel);
				System.mainPanel.setActiveTab("systemDatabase");
				System.dbLinkPanel.formEdit();
				System.dbLinkPanel.loadData(params);
			}
		}else if(clickNode.prop.operationType=="39"){
			if(clickNode.prop.params){
				var params={};
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}
				if(!System.mainPanel.havePanel("systemUserType")){
					using("dev.system.UserTypePanel");
					System.userTypePanel = new dev.system.UserTypePanel(this.frames,params);	 
					System.mainPanel.add(System.userTypePanel.MainTabPanel);
				}
				System.mainPanel.setActiveTab("systemUserType");
				System.userTypePanel.formEdit();
				System.userTypePanel.loadData(params);
			}
		}
	}.createDelegate(this);
	this.frames.set("clickEvent",this.clickEvent);
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);
   
	dev.system.SystemNavPanel.superclass.constructor.call(this,{
			id:'systemNavigator',
            title: '系统架构管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.system.SystemNavPanel, Ext.Panel, {
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

