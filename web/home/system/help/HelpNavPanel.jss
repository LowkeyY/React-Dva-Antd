
home.system.help.HelpNavPanel = function(frames){
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root" ><forder _hasChild="1" event="event0"><e _id="1" _parent="root" title="'+'阿职院智慧校园'.loc()+'" url="/home/system/help/tree.jcp?parent_id=1" params="parent_id=1&amp;id=1" icon0="/themes/icon/all/book.gif" icon1="/themes/icon/all/book_open.gif"/></forder></root>'));

	this.event0 = new Object();
	this.frames = frames;
    Help=this.frames.get('Help'); 
	this.clickEvent=function(clickNode){
		var params={};
		var userId=get_cookie("user_id");
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}
		if(params.help_id==null||params.help_id==''||params.id=='1'){
			Help.mainPanel.items.each(function(item){ 
					Help.mainPanel.remove(item);	
			},Help.mainPanel);
			if(params.typeU=="0" || userId > 2){
				var showHelpPanel = new Ext.Panel({
					border : false,
					autoScroll : true,
					layout : 'fit',
					loadStore:function(){
						showHelpPanel.load({
							url : '/home/system/help/helpShow.jcp?parent_id='+params.parent_id,
							method : 'get'
						})
					},
					html:{}
				});
				Help.mainPanel.add(showHelpPanel);
				Help.Frame.doLayout();
				
				showHelpPanel.loadStore();
			}else{
			Help.helpPanel = new home.system.help.HelpPanel(this.frames,params);
			Help.mainPanel.add(Help.helpPanel.MainTabPanel);
			Help.Frame.doLayout();  

			Help.helpPanel.loadData(params);
			Help.helpPanel.formEdit();
			}
		}else{
			Help.helpPanel = new home.system.help.HelpPublishPanel(this.frames,params);
			Help.helpPanel.loadData(params);
		}    
    
	//	if(params.parent_id==1){
	//		Help.helpPanel.init(params);   
	//	}else{
		/*	if(params.help_id!=null){
				Help.helpPanel = new home.system.help.HelpPublishPanel(this.frames,params);
				Help.helpPanel.loadData(params);
			}else{
				Help.helpPanel.loadData(params);
				Help.helpPanel.formEdit();
			}*/
		//}   
	}.createDelegate(this);
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	};
	this.menuTree.setEvent("event0",this.event0);
	
	
	this.ButtonArray=new Ext.Toolbar({});
	this.ButtonArray.addFill();
	this.ButtonArray.add(new Ext.Toolbar.Button({
				id : 'downHelp',
				text : '下载'.loc(),
				icon : '/themes/icon/common/downfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				tooltip : '点击后下载系统帮助'.loc(),
				handler : function() {
					var iWidth=800;
					var iHeight=600;
					window.open("/home/system/help/packHelp.jcp","_blank","height="+iHeight+", width="+iWidth+",left="+(window.screen.availWidth-10-iWidth)/2+",top="+(window.screen.availHeight-30-iHeight)/2+",scrollbars=yes,resizable=yes");
					}
			}));

	home.system.help.HelpNavPanel.superclass.constructor.call(this, {
			id:'HelpNavigator',
            title: '帮助系统'.loc(),   
            region: 'west',
            split: true,
            width: 200,
            collapsible: true ,
            tbar : this.ButtonArray
    });
};
Ext.extend(home.system.help.HelpNavPanel, Ext.Panel, {
		init : function(){
		this.menuTree.finish(this.body.dom,document);
		var node = this.menuTree.root.getChild(1);
		this.menuTree.initNode(node);
		node.open();
		//this.focusHistoryNode();*/
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
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("Help")){
			this.menuTree.loadHistory("Help");
			var nowNode=this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree,nowNode);
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree,nowNode);
			this.menuTree.loadHistory("Help");
		};
	}
});