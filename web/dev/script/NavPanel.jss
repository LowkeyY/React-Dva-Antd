Ext.namespace("dev.script");
dev.script.NavPanel = function(frames) {

	var str = '程序目录导航'.loc();
	this.frames = frames;
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"  _parent="root" title="'
					+ str
					+ '" url="/dev/script/tree.jcp?_id=-1&amp;level=0&amp;"/></forder></root>'));
	this.event1 = new Object();
	var ButtonArray = [];
	var currentDirectory = '';

	this.clickEvent = function(clickNode) {
		Script = this.frames.get('Script');
		var paramString = clickNode.prop.params.split('&');
		currentDirectory = clickNode.prop.currentDirectory;
		var filePath = clickNode.prop.filePath;
		var params = {};
		for (var i = 0; i < paramString.length; i++) {
			params[paramString[i].split('=')[0]] = paramString[i]
					.split('=')[1];
		}
		params['dir'] = currentDirectory;
		params['filePath'] = filePath;
		if (Script.mainPanel.havePanel("scriptEditor")) {
			Script.mainPanel.removeAll(true);
		}
		if (!Script.mainPanel.havePanel("listPanel")) {
			using("dev.script.FileManager");
			Script.listPanel = new dev.script.FileManager(this.frames,params);
			Script.mainPanel.add(Script.listPanel);
		}
		Script.mainPanel.setActiveTab("listPanel");
		if (clickNode.prop.program == "System") {
			Script.listPanel.loadFiles(this.frames, params);
			if (Script.listPanel)
				Script.listPanel.toggleToolBar("all");
		}else{
			Script.listPanel.loadFiles(this.frames, params);
			if (Script.listPanel)
				Script.listPanel.showAllToolBar();
		}
	}.createDelegate(this);
	var titleClick = this.clickEvent;
	this.event1.title_click = function() {
		titleClick(this);
	};
	this.menuTree.setEvent("event1", this.event1);

	dev.script.NavPanel.superclass.constructor.call(this, {
				title : '程序导航'.loc(),
				region : 'west',
				split : true,
				width : 280,
				collapsible : true,
				resizable : false
			});

};
Ext.extend(dev.script.NavPanel, Ext.Panel, {
			init : function() {
				using("lib.scripteditor.jssEditor");
				using("lib.scripteditor.jcpEditor");
				this.menuTree.finish(this.body.dom, document);
				this.focusHistoryNode();
			},
			getTree : function() {
				return this.menuTree;
			},
			exeHistoryNode : function(menuTree, nowNode) {
				if (nowNode.prop.event && nowNode.prop.params) {
					this.clickEvent(nowNode);
				} else if (nowNode.prop._parent == '0'
						&& nowNode.index() == nowNode.parent.son.length - 1) {
					return;
				} else {
					menuTree.moveNext();
					var newNode = menuTree.getNowNode();
					this.exeHistoryNode(menuTree, newNode)
				}
			},
			focusHistoryNode : function() {
				uStore = new UserStore(tree_store);
				if (uStore.getAttribute("Script")) {
					this.menuTree.loadHistory("Script");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Script");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
		});
