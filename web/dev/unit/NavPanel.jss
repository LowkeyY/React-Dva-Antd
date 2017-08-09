dev.unit.NavPanel = function(frames) {

	var str='量纲管理'.loc();

	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'+str+'" url="/dev/unit/tree.jcp?_id=-1&amp;level=0&amp;"/></forder></root>'));
	this.event1 = new Object();
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '新建分类'.loc(),
				btnId:'new',
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : function() {
					Ext.MessageBox.show({
								title : '量纲分类'.loc(),
								msg : '在'.loc() + this.frames.get('nowNodeTitle')
										+ '新建分类:'.loc(),
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
				text : '修改分类'.loc(),
				btnId:'update',
				icon : '/themes/icon/common/update.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : function() {
					Ext.MessageBox.show({
								title : '量纲分类'.loc(),
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
		text : '删除分类'.loc(),
		btnId:'del',
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
										url : '/dev/unit/optionkind.jcp',
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
		var Unitionary = this.frames.get('Unitionary');
		this.frames.set('nowNodeTitle', clickNode.prop.title);
		if (clickNode.prop.program == "kind") {
			var params = {};
			if(typeof(clickNode.prop.params)!='undefined'){
				params=Ext.urlDecode(clickNode.prop.params);
			}
			
			this.frames.set('params', params);
			this.hideToolBar();
			Unitionary.optionPanel.init(params);
			Unitionary.mainPanel.setStatusValue(['单位分类'.loc(),""]);
			this.showToolBar('new');
		} else if (clickNode.prop.program == "unit") {
			var paramString = clickNode.prop.params.split('&');
			var params = {};
			for (var i = 0; i < paramString.length; i++) {
				params[paramString[i].split('=')[0]] = paramString[i].split('=')[1];
			}
			this.frames.set('params', params);
			Unitionary.optionPanel.formEdit(params);
			Unitionary.optionPanel.loadData(params);
			Unitionary.mainPanel.setStatusValue(['单位管理'.loc(),params.group_id]);
			if (clickNode.prop.type == "view") {
				this.hideToolBar();
				this.showToolBar('update');
				if (typeof(clickNode.son) == 'undefined') {
					if (clickNode.prop._hasChild == '0') {
						this.showToolBar('del');
					}
				} else if (clickNode.son.length == 0)
					this.showToolBar('del');
			}
		} 
	}.createDelegate(this);
	var titleClick = this.clickEvent;
	this.event1.title_click = function() {
		titleClick(this);
	};
	this.menuTree.setEvent("event1", this.event1);

	dev.unit.NavPanel.superclass.constructor.call(this, {
				title : '量纲导航'.loc(),
				region : 'west',
				split : true,
				width : 280,
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
				Ext.msg("error", '数据保存失败!,原因:字符数大于50'.loc());
				return;
			} else if (text == null || text.length == 0) {
				Ext.msg("error", '数据保存失败!,原因:新建分类不能为空'.loc());
				return;
			} else if (/[\<\>\'\"\&]/.test(text)) {
				Ext.msg("error", '不应有'.loc()+'&,<,>,\",'+'字符'.loc());
				return;
			}
			Ext.Ajax.request({
						url : '/dev/unit/optionkind.jcp',
						method : 'POST',
						params : saveParams,
						scope : this,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check);
							if (ajaxResult.success) {
								this.getTree().loadSubNode(ajaxResult.id,
										this.clickEvent);
							} else {
								Ext.msg("error", '数据保存失败!,原因:'.loc()+'<br>'
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
				Ext.msg("error", '数据保存失败!,原因:新建分类不能为空'.loc());
				return;
			} else if (/[\<\>\'\"\&]/.test(text)) {
				Ext.msg("error", '不应有'.loc()+'&,<,>,\",'+'字符'.loc());
				return;
			}
			Ext.Ajax.request({
						url : '/dev/unit/optionkind.jcp',
						method : 'POST',
						params : saveParams,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check);
							if (ajaxResult.success) {
								this.getTree().loadSelfNode(ajaxResult.id,
										this.clickEvent);
							} else {
								Ext.msg("error", '数据保存失败!,原因:'.loc()+'<br>'
												+ ajaxResult.message);
							}
						},
						scope : this
					});
		}
	}.createDelegate(this);;

};
Ext.extend(dev.unit.NavPanel, Ext.Panel, {
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
					this.exeHistoryNode(menuTree, newNode)
				}
			},
			focusHistoryNode : function() {
				uStore = new UserStore(tree_store);
				if (uStore.getAttribute("Unitionnary")) {
					this.menuTree.loadHistory("Unitionnary");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Unitionnary");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
		});
