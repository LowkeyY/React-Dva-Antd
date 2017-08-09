
WidgetMagNavPanel = function(params){
	
	var str='控件列表'.loc();

	this.menuTree1 = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event1"><e _id="'+params.parent_id+'" _parent="root" title="'+str+'"  type="view" params="parent_id='+params.parent_id+'"  url="/dev/ctrl/WidgetTree.jcp?parent_id=0&amp;_id='+params.parent_id+'" icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.event1 = new Object();
	
	this.clickEvent=function(clickNode){
		var params={};
		var paramString=clickNode.prop.params.split('&'); 
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}

		Widget.widgetMagPanel.loadData(params);
	}.createDelegate(this);;
   
	this.event1.title_click = function(){	
		Widget.widgetMagNavPanel.clickEvent(this); 
	}
	this.menuTree1.setEvent("event1",this.event1);	

	WidgetMagNavPanel.superclass.constructor.call(this, {
			id:'widgetMag',
            title: ' ',
            region: 'west',
            split: false,
            width: 150,
            collapsible: true, 
			border:false,
			margins:'0 3 0 0'
    });
};
Ext.extend(WidgetMagNavPanel, Ext.Panel, {
	init : function(){
		this.menuTree1.finish(this.body.dom,document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree1;
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
		if(uStore.getAttribute("WidgetMag")){
			this.menuTree1.loadHistory("WidgetMag");
			var nowNode=this.menuTree1.getNowNode();
		}else{
			var nowNode=this.menuTree1.getNowNode();
			this.menuTree1.loadHistory("WidgetMag");
		};
		this.exeHistoryNode(this.menuTree1,nowNode);
	}
});

