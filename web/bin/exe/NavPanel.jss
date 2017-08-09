Ext.namespace("bin.exe");
using("lib.jsvm.MenuTree");
bin.exe.NavPanel = function(panel, params) {
	this.objectId = params['parent_id']
	this.panel = panel;
	this.logHistory = (params.logHistory === true);
	this.applicationId = this.getApplicationId();

	CPM.get({
		method : 'GET',
		url : '/bin/exe/getNav.jcp?parent_id=' + this.objectId,
		scope : this,
		success : function(response, options) {
			var json = Ext.decode(response.responseText);

			if (Ext.isObject(json.events)) {// 临时解决办法，等树重写后再在Ext的树上分配事件。
				var e = json.events;
				if (Ext.isDefined(e.beforeclick)) {
					this.beforeClick = e.beforeclick;
				}
				if (Ext.isDefined(e.afterclick)) {
					this.afterClick = e.afterclick;
				}
				if (Ext.isDefined(e.render)) {
					e.render(this.panel, json);
				}
				if (Ext.isDefined(e.beforeinit)) {
					if (e.beforeinit.call(this, json, json, params, this.panel) === false) {
						return;
					}
				}
				if (Ext.isDefined(e.beforetreeload)) {
					this.panel.loadTreeHandler = e.beforetreeload;
				}
			}
			if (this.panel.ownerCt.isSubFrame) {// 框架页面内的导航树传参
				var p = this.panel.ownerCt.subParam;
				var subUrl = "&"
						+ Ext.urlEncode(Ext.copyTo({}, p,
								"exportItem,exportData,exportTab,dataId"));
				json.url += subUrl.replace(/&/g, '&amp;');
			}
			this.menuTree = new MenuTree(Tool
					.parseXML('<root _id="root"><forder _hasChild="1"  event="event1"><e _id="top" _parent="root" title="'
							+ json.treeTitle.loc()
							+ '" url="'
							+ json.url
							+ '" '
							+ json.targets
							+ ' '
							+ json.treeHerf
							+ '  '
							+ json.eventString
							+ '  framenum="'
							+ json.frameNum
							+ '"  icon0="'
							+ json.startIcon
							+ '" icon1="'
							+ json.endIcon + '"/></forder></root>'));

			var eve = this.clickEvent.createDelegate(this);
			this.menuTree.setEvent("event1", {
						title_click : function() {
							eve(this);
						}
					});
			var dom = this.panel.body.dom;
			this.menuTree.finish(dom, document);
			this.panel.nav = this;
			if (Ext.isObject(json.events)) {// 临时解决办法，等树重写后再在Ext的树上分配事件。
				if (Ext.isDefined(e.afterrender)) {
					e.afterrender(this.panel, json);
				}
			}
			if (Ext.isDefined(this.panel.navCallBack)) {
				this.panel.navCallBack();
				delete this.panel.navCallBack;
			}
			var treeElement = Ext.get(dom).first().first();
			treeElement.setStyle("overflow", "visible");
			treeElement.setStyle("width", "auto");
			if (!json.notLoadHistory)
				this.focusHistoryNode();
		}
	}, true);
};

bin.exe.NavPanel.prototype = {
	init : Ext.emptyFn,
	getTree : function() {
		return this.menuTree;
	},
	getApplicationId : function(){
		return this.objectId.replaceAll("-","");
	},
	focusHistoryNode : function() {
		uStore = new UserStore(tree_store);
		if (uStore.getAttribute("Exe_" + this.applicationId)) {
			this.menuTree.loadHistory("Exe_" + this.applicationId);
			var nowNode = this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree, nowNode);
		} else {
			var nowNode = this.menuTree.getNowNode();
			this.exeHistoryNode(this.menuTree, nowNode);
			this.menuTree.loadHistory("Exe_" + this.applicationId);
		};
	},
	exeHistoryNode : function(menuTree, nowNode) {
		if (nowNode.prop.event && nowNode.prop.herfs1) {
			this.clickEvent(nowNode);
		} else if (nowNode.prop._parent == 'root'
				&& nowNode.index() == nowNode.parent.son.length - 1) {
			return;
		} else {
			menuTree.moveNext();
			var newNode = menuTree.getNowNode();
			this.exeHistoryNode(menuTree, newNode)
		}
	},
	clickEvent : function(clickNode) {
		if (Ext.isDefined(this.beforeClick)
				&& this.beforeClick(clickNode) === false) {
			return;
		}
		var targetPanel = Ext.getCmp(this.panel.ownerCt.hrefPanelId);
		var loadPanel = function(panel, str) {
			var param = Ext.urlDecode(str.substring(str.indexOf("?") + 1));
			panel.param = param;
			panel.loadProgram(param, false);
		}
		if (typeof(targetPanel) == 'undefined') {
			var p = clickNode.prop;
			if (typeof(p.target1) != 'undefined'
					|| typeof(p.target2) != 'undefined') {// 左上下窗口
				var index = this.panel.ownerCt.frameIndex;
				if (p.herfs1){
					loadPanel(Ext.getCmp(index.north || index.west), p.herfs1);
				}else if (p.herfs2){
					loadPanel(Ext.getCmp(index.center), p.herfs2);
				}
			}
		} else if (typeof(clickNode.prop.herfs1) != 'undefined') {//
			loadPanel(targetPanel, clickNode.prop.herfs1);
		}
		if (this.logHistory) {
			CPM.History.add(this);
		}
		Ext.isDefined(this.afterClick) && this.afterClick(clickNode);
	},
	getState : function() {
		uStore = new UserStore(tree_store);
		return uStore.getAttribute("Exe_" + this.applicationId)
	},
	applyState : function(state) {
		uStore = new UserStore(tree_store);
		uStory.setAttribute("Exe_" + this.applicationId, state);
		this.focusHistoryNode();
	}
}
