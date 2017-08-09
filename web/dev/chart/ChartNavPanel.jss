dev.chart.ChartNavPanel = function() {

	var titleStr='应用图表导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+titleStr+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=9"  icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.event0 = new Object();

	this.clickEvent = function(clickNode) {
		var Chart = this.frames.get('Chart');
		var params = {};
		var paramString = clickNode.prop.params.split('&');
		for (var i = 0; i < paramString.length; i++) {
			params[paramString[i].split('=')[0]] = paramString[i].split('=')[1];
		}
		var cPanel = Chart.mainPanel.get("chartPanel");
		if (!Ext.isDefined(cPanel)) {
			using("lib.ChartDefine.ChartDefine");
			Chart.chartPanel = new lib.ChartDefine.ChartDefine(params, Chart.mainPanel,false,Chart,false,true);
			cPanel=Chart.chartPanel.MainTabPanel;
			Chart.mainPanel.add(cPanel);
		}
		Chart.mainPanel.setActiveTab(cPanel);
		if (clickNode.prop.objectType == "1") {
			if (clickNode.prop.params) {
				Chart.chartPanel.init(params);
			}
		} else if (clickNode.prop.objectType == "9") {
			if (clickNode.prop.params) {
				Chart.chartPanel.loadData(params);
			}
		}
	}.createDelegate(this);

	var titleClick = this.clickEvent;
	this.event0.title_click = function() {
		titleClick(this);
	}
	this.menuTree.setEvent("event0", this.event0);

	dev.chart.ChartNavPanel.superclass.constructor.call(this, {
				id : 'ChartNavigator',
				title : '图表管理'.loc(),
				region : 'west',
				split : true,
				width : 260,
				collapsible : true,
				cmargins : '3 3 3 3'
			});
};
Ext.extend(dev.chart.ChartNavPanel, Ext.Panel, {
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
				} else if (nowNode.prop._parent == '0'
						&& nowNode.index() == nowNode.parent.son.length - 1) {
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
				uStore = new UserStore(tree_store);
				if (uStore.getAttribute("chartDefine")) {
					this.menuTree.loadHistory("chartDefine");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("chartDefine");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
		});
