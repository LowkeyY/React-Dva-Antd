
bin.task.TaskNavPanel = function(ct,frames){
	this.frames = frames;
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top"  icon0="/themes/icon/xp/boll.gif" icon1="/themes/icon/xp/boll.gif" _parent="root" title="'+ '任务列表'.loc()+'"  url="/bin/task/tree.jcp?_id=-1&amp;level=0&amp;" /></forder></root>'));
		
	this.event1 = new Object();  
	this.clickEvent=function(clickNode){
		if(typeof(clickNode.prop.params)!='undefined'){
			var params={};
			var paramString=clickNode.prop.params.split('&');
			for(var i=0;i<paramString.length;i++){
				params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
			}	
			if(ct=='log'){
				var	TaskLog=this.frames.get('TaskLog');
				if(!TaskLog.mainPanel.havePanel("taskLogListPanel")){
					TaskLog.taskLogListPanel = this.frames.createPanel(new bin.task.TaskLogListPanel());
					TaskLog.mainPanel.add(TaskLog.taskLogListPanel.MainTabPanel);
				}
				
				TaskLog.mainPanel.setActiveTab("taskLogListPanel");
				TaskLog.taskLogListPanel.showList(params);
			}else{
				var Task = this.frames.get("Task");
				if(!Task.mainPanel.havePanel("SchedulePanel")){
					using("bin.task.SchedulePanel");
					Task.schedulePanel = new bin.task.SchedulePanel(this.frames);
					Task.mainPanel.add(Task.schedulePanel.MainTabPanel);
					Task.mainPanel.showStatus();
				}
				Task.mainPanel.setActiveTab(Task.schedulePanel.MainTabPanel);
				if(params['type']=='create'){
					Task.schedulePanel.formCreate(params);
				}else if(params['type']=='edit'){
					Task.schedulePanel.formEdit();
					Task.schedulePanel.loadTask(params);
				}
			}
		}
	}.createDelegate(this);
	var titleClick=this.clickEvent.createDelegate(this);
	this.event1.title_click = function(){   
		titleClick(this);
	};
	this.menuTree.setEvent("event1",this.event1);	

	bin.task.TaskNavPanel.superclass.constructor.call(this, {
            title: '任务列表'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            margins:'0 0 0 0',
            cmargins:'0 0 0 0'
    });
};
Ext.extend(bin.task.TaskNavPanel, Ext.Panel, {
	init: function(){
		this.menuTree.finish(this.body.dom,document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event){
			this.clickEvent(nowNode);
		}else if(nowNode.index()==nowNode.parent.son.length -1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("schedule")){
			this.menuTree.loadHistory("schedule");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("schedule");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

