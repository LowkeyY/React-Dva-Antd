Ext.namespace("dev.scraper");
dev.scraper.NavPanel = function() {

	var str = '萃取引擎导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"  _parent="root" title="'
					+ str
					+ '" url="/dev/scraper/tree.jcp?_id=-1&amp;level=0&amp;"/></forder></root>'));
	this.event1 = new Object();
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'newCategory',
				text : '新建'.loc(),
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : function() {
					Ext.MessageBox.show({
								title : '萃取引擎分类'.loc(),
								msg : '在'.loc()
										+ this.frames.get('nowNodeTitle')
										+ '下新建萃取引擎分类:'.loc(),
								width : 300,
								buttons : Ext.MessageBox.OKCANCEL,
								prompt : true,
								fn : this.saveIt,
								animEl : 'navtoolbar'
							});
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'update',
				text : '修改'.loc(),
				icon : '/themes/icon/common/update.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : function() {
					Ext.MessageBox.show({
								title : '萃取引擎分类'.loc(),
								msg : '输入分类名称:'.loc(),
								value : this.frames.get('nowNodeTitle'),
								width : 300,
								buttons : Ext.MessageBox.OKCANCEL,
								prompt : true,
								fn : this.updateIt,
								animEl : 'navtoolbar'
							});
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
		btnId : 'del',
		text : '删除'.loc(),
		icon : '/themes/icon/common/delete.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		scope : this,
		hidden : false,
		handler : function() {
			Ext.msg('confirm', '确认删除?'.loc(), function(answer) {
						if (answer == 'yes') {
							var delParams = this.frames.get('params');
							delParams['type'] = 'delete';
							Ext.Ajax.request({
										url : '/dev/scraper/scraperdir.jcp',
										method : 'POST',
										params : delParams,
										success : function() {
											this
													.getTree()
													.loadParentNode(this.clickEvent);
										},
										failure : function() {
											Ext.msg("error", '数据提交失败!'.loc());
										},
										scope : this
									});
						}
					}.createDelegate(this));
		}
	}));
	this.hideToolBar = function() {
		var tempToolBar = this.getTopToolbar();
		tempToolBar.items.each(function(item) {
					try {
						item.disable();
					} catch (e) {
					}
				}, tempToolBar.items);
	};
	this.showToolBar = function(state) {
		var tempToolBar = this.getTopToolbar();
		tempToolBar.items.each(function(item) {
					try {
						if (item.btnId == state)
							item.enable();
					} catch (e) {
					}
				}, tempToolBar.items);
	};
	this.clickEvent = function(clickNode) {
		var Scraper = this.frames.get('Scraper');
		this.frames.set('nowNodeTitle', clickNode.prop.title);
		if (!Scraper.mainPanel.havePanel("scraperDesigner")) {
			Scraper.designPanel = this.frames
					.createPanel(new dev.scraper.DesignPanel());
			Scraper.mainPanel.add(Scraper.designPanel.MainPanel);
			Scraper.mainPanel.setActiveTab(Scraper.designPanel.MainPanel);
		}
		if (clickNode.prop.program == "application") {
			var paramString = clickNode.prop.params.split('&');
			var params = {};
			for (var i = 0; i < paramString.length; i++) {
				params[paramString[i].split('=')[0]] = paramString[i]
						.split('=')[1];
			}
			this.frames.set('params', params);
			if (clickNode.prop.type == "view") {
				Scraper.designPanel.init(params);
				Scraper.designPanel.newScraper(params);
				this.hideToolBar();
				this.showToolBar('update');
				if (typeof(clickNode.son) == 'undefined') {
					if (clickNode.prop._hasChild == '0') {
						this.showToolBar('del');
					}
				} else if (clickNode.son.length == 0)
					this.showToolBar('del');
			} else if (clickNode.prop.type == "new") {
				Scraper.designPanel.toggleToolBar('create');
				Scraper.designPanel.disableToolBar();
				this.hideToolBar();
				this.showToolBar('newCategory');
			}
		} else if (clickNode.prop.program == "scraper") {
			var paramString = clickNode.prop.params.split('&');
			var params = {};
			for (var i = 0; i < paramString.length; i++) {
				params[paramString[i].split('=')[0]] = paramString[i]
						.split('=')[1];
			}
			this.frames.set('params', params);
			Scraper.designPanel.editScraper();
			Scraper.designPanel.loadData(this.frames.get('params'));
			this.hideToolBar();
		} else if (clickNode.prop.program == "System") {
			this.frames.set('params', {});
			Scraper.designPanel.disableToolBar();
			this.hideToolBar();
		}
	}.createDelegate(this);
	var titleClick = this.clickEvent;
	this.event1.title_click = function() {
		titleClick(this);
	};
	this.menuTree.setEvent("event1", this.event1);

	dev.scraper.NavPanel.superclass.constructor.call(this, {
				title : '萃取引擎导航'.loc(),
				region : 'west',
				split : true,
				width : 260,
				collapsible : true,
				resizable : false,
				tbar : ButtonArray
			});

	this.saveIt = function(btn, text) {
		if (btn == 'ok') {
			var saveParams = this.frames.get('params');
			saveParams['type'] = 'save';
			saveParams['name'] = text;
			if (text.length > 50) {
				Ext.msg("error", '数据修改失败!,原因:字符数大于50'.loc());
				return;
			} else if (text == null || text.length == 0) {
				Ext.msg("error", '数据保存失败!,原因:萃取引擎分类不能为空'.loc());
				return;
			} else if (/[\<\>\'\"\&]/.test(text)) {
				Ext.msg("error", '不应有'.loc() + '&,<,>,\",' + '字符'.loc());
				return;
			}
			Ext.Ajax.request({
						url : '/dev/scraper/scraperdir.jcp',
						method : 'POST',
						params : saveParams,
						scope : this,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check);
							if (ajaxResult.success) {
								this.getTree().loadSubNode(ajaxResult.kind_id,
										this.clickEvent);
							} else {
								Ext.msg("error", '数据保存失败!,原因:'.loc() + '<br>'
												+ ajaxResult.message);
							}
						},
						scope : this
					});
		}
	}.createDelegate(this);

	this.updateIt = function(btn, text) {
		if (btn == 'ok') {
			var saveParams = this.frames.get('params');
			saveParams['type'] = 'updatesave';
			saveParams['name'] = text;
			if (text.length > 50) {
				Ext.msg("error", '数据修改失败!,原因:字符数大于50'.loc());
				return;
			} else if (text == null || text.length == 0) {
				Ext.msg("error", '数据保存失败!,原因:萃取引擎分类不能为空'.loc());
				return;
			} else if (/[\<\>\'\"\&]/.test(text)) {
				Ext.msg("error", '不应有'.loc() + '&,<,>,\",' + '字符'.loc());
				return;
			}
			Ext.Ajax.request({
						url : '/dev/scraper/scraperdir.jcp',
						method : 'POST',
						params : saveParams,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check);
							if (ajaxResult.success) {
								this.getTree().loadSelfNode(ajaxResult.kind_id,
										this.clickEvent);
							} else {
								Ext.msg("error", '数据保存失败!,原因:'.loc() + '<br>'
												+ ajaxResult.message);
							}
						},
						scope : this
					});
		}
	}.createDelegate(this);;
};
Ext.extend(dev.scraper.NavPanel, Ext.Panel, {
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
				} else if (nowNode.prop._parent == 'top'
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
				if (uStore.getAttribute("Scraper")) {
					this.menuTree.loadHistory("Scraper");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Scraper");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
		});
