using("lib.jsvm.MenuTree");
Ext.namespace("dev.database");

dev.database.MetaTableNavPanel = function() {

	var str='应用数据表导航'.loc();
	var str1='连接数据表导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=2"  icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.event0 = new Object();

	this.clickEvent = function(clickNode) {
		var MetaTable = this.frames.get('MetaTable');
		if (!clickNode)
			clickNode = this;
		var pop = clickNode.prop;
		var isEdit = (pop.params.indexOf("resource_id") != -1);
		var panelId = (isEdit) ? "MainTableEdit" : "MainTableNew";
		if (!MetaTable.mainPanel.havePanel(panelId)) {
			using("dev.database.MetaTablePanel");
			MetaTable.metaTablePanel = new dev.database.MetaTablePanel(panelId,
					isEdit, true, false, this.frames,false);
			this.frames.set(panelId, MetaTable.metaTablePanel);
			MetaTable.mainPanel.add(MetaTable.metaTablePanel.MainTabPanel);
			/*if (panelId == 'MainTableNew') {
				MetaTable.metaTablePanel.MainTabPanel.on("hide", function() {
							this.columnForm.stopEditing(false);
						}, MetaTable.metaTablePanel);
				MetaTable.metaTablePanel.MainTabPanel.on("show", function() {
							if (this.columnForm.rendered) {
								var st = this.columnForm.store;
								var total = st.getCount();
								if (total > 1) {
									var rec = st.getAt(total - 1);
									st.removeAll();
									st.add([rec]);
								}
								this.columnForm.startEditing(0);
								this.metaTableForm.form.reset();
							}
						}, MetaTable.metaTablePanel);
			}*/
		} else {
			MetaTable.metaTablePanel = this.frames.get(panelId);
		}
		MetaTable.mainPanel.setActiveTab(panelId);

		if (isEdit) {
			MetaTable.metaTablePanel.loadForm(pop._id, pop._parent);
		} else {
			MetaTable.metaTablePanel.init({
			parent_id : pop._id
			});
		}
	}.createDelegate(this);

	var titleClick = this.clickEvent;
	this.event0.title_click = function() {
		titleClick(this);
	};
	this.menuTree.setEvent("event0", this.event0);
	// --------------------------------连接数据表导航-------------------------------------------------------------------

	this.menuTree1 = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e  _id="0"  _parent="root" title="'+str1+'" url="/dev/database/tree.jcp"  icon0="/themes/icon/xp/alias.gif" icon1="/themes/icon/xp/alias.gif"/></forder></root>'));

	this.sys_tab = new Object();
	this.clickTableEvent = function(clickNode) {
		MetaTable = this.frames.get('MetaTable');
		if (!clickNode)
			clickNode = this;
		var pop = clickNode.prop;
		var described = (pop.described == 'true');
		var panelId = "MetaPanelDes" + described;
		
		if (!MetaTable.mainPanel.havePanel(panelId)) {
			MetaTable.metaTablePanel = this.frames.createPanel(new dev.database.MetaTablePanel(panelId,described, described, !described, this.frames,pop.server,true));
			this.frames.set(panelId, MetaTable.metaTablePanel);
			MetaTable.mainPanel.add(MetaTable.metaTablePanel.MainTabPanel);
		} else {
			MetaTable.metaTablePanel = this.frames.get(panelId);
		}
		MetaTable.mainPanel.setActiveTab(panelId);
		if (described){
			MetaTable.metaTablePanel.loadForm(pop._id, pop._parent);
		} else {
			MetaTable.metaTablePanel.loadSchema(pop._id, pop.schema, pop.server);
		}
	}.createDelegate(this);

	var tableTitleClick = this.clickTableEvent;
	this.sys_tab.title_click = function() {
		tableTitleClick(this);
	};
	this.menuTree1.setEvent("sys_tab", this.sys_tab);

	this.yinyong = new Ext.Panel({
				title : '应用数据表导航'.loc(),
				border : false,
				icon : '/themes/icon/xp/new_driver.gif'
			});
	this.lianjie = new Ext.Panel({
				title : '连接数据表导航'.loc(),
				border : false,
				icon : '/themes/icon/xp/alias.gif'
			});
	this.tree = this.menuTree;
	this.lianjie.on("expand", function() {
				this.tree = this.menuTree1;
			}, this)
	this.yinyong.on("expand", function() {
				this.tree = this.menuTree;
			}, this)
	this.buttonArray = [];
	this.buttonArray.push(this.com = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['ids', 'label'],
							data : [['1', '逻辑名称'.loc()], ['2', '物理名称'.loc()], ['3', "ID"]
									]
						}),
				value : '1',
				valueField : 'ids',
				displayField : 'label',
				triggerAction : 'all',
				width : 80,
				mode : 'local'
			}));
	this.buttonArray.push(this.text = new Ext.form.TextField({
				width : 130,
				maxLength : 256,
				regex : /^[^\<\>\'\"\&]+$/,
				regexText : '名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),
				allowBlank : false,
				maxLengthText : '输入名称不能超过{0}个字符!'.loc()
			}));
	this.buttonArray.push(new Ext.Button({
		text : '查询'.loc(),
		icon : '/themes/icon/xp/search.gif',
		cls : 'x-btn-text-icon',
		scope : this,
		hidden : false,
		handler : function(btn) {
			Ext.Ajax.request({
						url : '/dev/database/ParamSearch.jcp',
						params : {
							combo : this.com.getValue(),
							text : this.text.getValue()
						},
						method : 'POST',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success == false) {
								Ext.msg("error", result.message);
							} else {
								if (result.data.length == 0) {
									Ext.msg("info", '未查到相应表！'.loc());
								} else if (result.data.length > 1) {
									using("dev.database.ParamSearch");
									var showData = new dev.database.ParamSearch(
											result, this);
									showData.show();
								} else if (result.data.length == 1) {
									this.menuTree.loadPath(result.data[0].path);
									var nowNode = this.menuTree.getNowNode();
									this.exeHistoryNode(this.menuTree, nowNode);
									this.clickEvent(nowNode);
								}
							}
						}
					})
		}
	}));
	
	dev.database.MetaTableNavPanel.superclass.constructor.call(this, {
				id : 'DataBaseNavigator',
				title : '数据库管理'.loc(),
				region : 'west',
				split : true,
				width : 280,
				collapsible : true,
				cmargins : '3 3 3 3',
				layout : 'accordion',
				layoutConfig : {
					animate : true
				},
				tbar : this.buttonArray,
				items : [ this.yinyong,this.lianjie]
			});
};
Ext.extend(dev.database.MetaTableNavPanel, Ext.Panel, {
			init : function() {
				using("dev.database.MetaTablePanel")
				this.menuTree.finish(this.yinyong.body.dom, document);
				this.focusHistoryNode();
				this.menuTree1.finish(this.lianjie.body.dom, document);
				this.menuTree1.loadNode(this.menuTree1.getNowNode());
			},
			getTree : function() {
				return this.tree;
			},
			exeHistoryNode : function(menuTree, nowNode) {
				if (nowNode.prop.event && nowNode.prop.params) {
					this.clickEvent(nowNode);
				} else if (nowNode.prop._parent == '0'
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
				if (uStore.getAttribute("Table")) {
					this.menuTree.loadHistory("Table");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Table");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			},
			exeTableHistoryNode : function(menuTree, nowNode) {
				if (nowNode.prop.event && nowNode.prop.server) {
					this.clickTableEvent(nowNode);
				} else if (nowNode.prop.url
						&& nowNode.index() == nowNode.parent.son.length - 1) {
					return;
				} else {
					menuTree.moveNext();
					var newNode = menuTree.getNowNode();
					this.exeTableHistoryNode(menuTree, newNode)
				}
			}
		});
