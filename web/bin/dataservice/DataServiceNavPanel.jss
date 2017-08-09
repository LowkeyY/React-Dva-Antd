bin.dataservice.DataServiceNavPanel = function() {
	var strTitle = '数据服务导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'+strTitle+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=34"   icon0="/themes/icon/xp/tablink.gif" icon1="/themes/icon/xp/tablink.gif"/></forder></root>'));

	this.event0 = new Object();

	this.clickEvent = function(clickNode) {
		var DataService = this.frames.get('DataService');
		var prop = clickNode.prop.params;

		var params = {};
		var paramString = prop.split('&');
		for (var i = 0; i < paramString.length; i++) {
			params[paramString[i].split('=')[0]] = paramString[i].split('=')[1];
		}

		if (clickNode.prop.objectType == '34') {
			using("bin.dataservice.AuthPanel");
			using("bin.dataservice.AuthUserPanel");
			loadcss("bin.dataservice.option");
			if (params.view == '1') {
				var conn=new Ext.data.Connection();
				conn.request({    
						method: 'GET',    
						url:'/bin/user/getOrg.jcp?'
				});				
				conn.on('requestcomplete', function(conn, oResponse ){	
					var orgJSON = Ext.decode(oResponse.responseText);
					var name=orgJSON.shortName;
					if(name==""){
						name=orgJSON.name;
					}
					DataService.AuthPanel = new bin.dataservice.AuthUserPanel(this.frames, params.parent_id,orgJSON.id,name);
					DataService.mainPanel.add(DataService.AuthPanel.MainTabPanel);
					DataService.mainPanel.setActiveTab("AuthPanel");
					DataService.AuthPanel.init(params.parent_id);
				},this);
			}else if (params.view == '0') {
				if (!DataService.created) {
					DataService.AuthPanel = new bin.dataservice.AuthPanel(this.frames, params);
					DataService.mainPanel.add(DataService.AuthPanel.MainTabPanel);
					DataService.created = true;
				}
				DataService.mainPanel.setActiveTab("AuthPanel");
				DataService.AuthPanel.formEdit();
				DataService.AuthPanel.loadData(params);
			}
		}

	}.createDelegate(this);

	var titleClick = this.clickEvent;
	this.event0.title_click = function() {
		titleClick(this);
	}
	this.menuTree.setEvent("event0", this.event0);

	bin.dataservice.DataServiceNavPanel.superclass.constructor.call(this, {
				id : 'DataServicetNavigator',
				title : '任务管理'.loc(),
				region : 'west',
				split : true,
				width : 200,
				collapsible : true,
				cmargins : '3 3 3 3'
			});
};
Ext.extend(bin.dataservice.DataServiceNavPanel, Ext.Panel, {
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
				uStore = new UserStore(tree_store);
				if (uStore.getAttribute("AuthPanel")) {
					this.menuTree.loadHistory("AuthPanel");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("AuthPanel");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
		});
