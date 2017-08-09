//Ext.namespace("dev.widget");

dev.widget.WidgetNavPanel = function(frames){

	var str='控件导航'.loc();

	this.frames = frames;
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=8"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.event0 = new Object();
	this.clickEvent=function(clickNode){
		var params={};
		var Widget=this.frames.get('Widget');
		var paramString=clickNode.prop.params.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	
		var objectId=clickNode.prop._id;
        var main=Widget.mainPanel;
		if(clickNode.prop.objectType=='1'||clickNode.prop.objectType=='8'){
			if(!Widget.mainPanel.havePanel("widgetPanel")){
				using("dev.widget.WidgetPanel");                    
				Widget.widgetPanel = new dev.widget.WidgetPanel(this.frames,{
							parent_id:objectId,
							returnFunction:function(main){
								main.setActiveTab('widgetPanel');
							}.createCallback(main)}
				);     
				Widget.mainPanel.add(Widget.widgetPanel.MainTabPanel);
			}      
			Widget.mainPanel.setActiveTab("widgetPanel");
		}
		if (clickNode.prop.objectType=='1'){
			Widget.widgetPanel.init({
			parent_id:objectId,
			returnFunction:function(main){
				main.setActiveTab('widgetPanel');
			}.createCallback(main)});
		}else if (clickNode.prop.objectType=='8'){ 
			Widget.widgetPanel.formEdit();
			Widget.widgetPanel.loadData({
							parent_id:objectId,
							returnFunction:function(main){
								main.setActiveTab('widgetPanel');
			}.createCallback(main)}); 
		}
	}.createDelegate(this);


	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	};
	this.menuTree.setEvent("event0",this.event0);
	
	dev.widget.WidgetNavPanel.superclass.constructor.call(this, {
			id:'WidgetNavigator',
            title: '控件管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.widget.WidgetNavPanel, Ext.Panel, {
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
		}else if(nowNode.prop.objectType=='0'&&nowNode.index()==nowNode.parent.son.length -1&&nowNode.parent.son.length!=1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			if(nowNode.prop._id==newNode.prop._id){
				return;
			}else{
				this.exeHistoryNode(menuTree,newNode)
			}
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("Widget")){
			this.menuTree.loadHistory("Widget");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("Widget");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

