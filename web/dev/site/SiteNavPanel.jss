


dev.site.SiteNavPanel = function() {
	
	var str = '站点导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'
					+ str
					+ '" url="/dev/site/tree.jcp?rootNode=0&amp;_id=0&amp;type=42"   icon0="/themes/icon/all/page_world.gif" icon1="/themes/icon/all/page_world.gif"/></forder></root>'));

	this.event0 = new Object();

	this.clickEvent = function(clickNode) {
		var Site = this.frames.get('Site');
		var prop = clickNode.prop.params;
		var params = {};
		var paramString = prop.split('&');
		for (var i = 0; i < paramString.length; i++) {
			params[paramString[i].split('=')[0]] = paramString[i].split('=')[1];
		}
		if (clickNode.prop.objectType == '1') {
			if (!Site.mainPanel.havePanel("siteBasePanel")) {
				using("dev.site.SiteBasePanel");
				Site.SiteBasePanel = new dev.site.SiteBasePanel(
						this.frames, params);
				
				Site.mainPanel.add(Site.SiteBasePanel.MainTabPanel);
			}
			Site.mainPanel.setActiveTab("siteBasePanel");
		}else if (clickNode.prop.objectType == '42') {
			if (!Site.mainPanel.havePanel("siteBasePanel")) {
				using("dev.site.SiteBasePanel");
				Site.SiteBasePanel = new dev.site.SiteBasePanel(
						this.frames, params);
				Site.mainPanel.add(Site.SiteBasePanel.MainTabPanel);
			}
			Site.mainPanel.setActiveTab("siteBasePanel");
		} else if (clickNode.prop.objectType == '7') {
			if (!Site.mainPanel.havePanel("SiteProgramPanel")) {
				using("dev.program.ProgramPanel");
				using("dev.program.ProgramGrid");
				Site.programPanel = this.frames
						.createPanel(new dev.program.ProgramPanel('Site',
								Site));
				Site.mainPanel.add(Site.programPanel.MainTabPanel);
			}
			Site.mainPanel.setActiveTab("SiteProgramPanel");
		}

		if (clickNode.prop.objectType == '1') {
			Site.SiteBasePanel.init(params);
		} else if (clickNode.prop.objectType == '42') {
			Site.SiteBasePanel.loadData(params);
			Site.SiteBasePanel.formEdit();
		} else if (clickNode.prop.objectType == '35') {
			Site.SitePanel.loadData(params);
			Site.SitePanel.formEdit();
		} else if (clickNode.prop.objectType == '7') {
			params.returnFunction = function(main) {
				main.setActiveTab('SiteProgramPanel');
			}.createCallback(Site.mainPanel)
			Site.programPanel.loadData(params, Site.mainPanel);
		}
	}.createDelegate(this);

	var titleClick = this.clickEvent;
	this.event0.title_click = function() {
		titleClick(this);
	}
	this.menuTree.setEvent("event0", this.event0);

	dev.site.SiteNavPanel.superclass.constructor.call(this, {
				id : 'SiteNavigator',
				title : '站点导航'.loc(),
				region : 'west',
				split : true,
				width : 260,
				collapsible : true,
				cmargins : '3 3 3 3'
			});
};
Ext.extend(dev.site.SiteNavPanel, Ext.Panel, {
			init : function() {
				this.menuTree.finish(this.body.dom, document);
				this.focusHistoryNode();
			},
			getTree : function() {
				return this.menuTree;
			},
			exeHistoryNode : function(menuTree, nowNode) {
				if (nowNode.prop.event && nowNode.prop.params) {
					this.clickEvent(nowNode);
				} else if (nowNode.prop.objectType == '0'
						&& nowNode.index() == nowNode.parent.son.length - 1
						&& nowNode.parent.son.length != 1) {
					return;
				} else {
					menuTree.moveNext();
					var newNode = menuTree.getNowNode();
					if (nowNode.prop._id == newNode.prop._id) {
						return;
					} else {
						this.exeHistoryNode(menuTree, newNode)
					}
				}
			},
			focusHistoryNode : function() {
				var uStore = new UserStore(tree_store);
				if (uStore.getAttribute("Site")) {
					this.menuTree.loadHistory("Site");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Site");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
});
