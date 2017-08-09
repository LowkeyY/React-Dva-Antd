Ext.namespace("dev", "dev.dictionary");
dev.dictionary.NavPanel = function() {
	var str = '字典管理'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'
					+ str
					+ '" url="/dev/dictionary/tree.jcp?_id=-1&amp;level=0&amp;"/></forder></root>'));
	this.event1 = new Object();
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				text : '新建分类'.loc(),
				btnId : 'new',
				icon : '/themes/icon/xp/newfile.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : function() {
					Ext.MessageBox.show({
								title : '字典分类'.loc(),
								msg : '在'.loc()
										+ this.frames.get('nowNodeTitle')
										+ '新建分类'.loc(),
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
				btnId : 'update',
				icon : '/themes/icon/common/update.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : function() {
					Ext.MessageBox.show({
								title : '字典分类'.loc(),
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
		btnId : 'del',
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
										url : '/dev/dictionary/optionkind.jcp',
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
	var buttonArray = [];
	buttonArray.push(this.text = new Ext.form.TextField({
				width : 180,
				fieldLabel : '逻辑名称'.loc(),
				hidden : false,
				maxLength : 256,
				regex : /^[^\<\>\'\"\&]+$/,
				regexText : '名称中不应有'.loc() + '&,<,>,\",' + '字符'.loc(),
				allowBlank : false,
				maxLengthText : '输入名称不能超过{0}个字符!'.loc()
			}));
	buttonArray.push(new Ext.Button({
		text : '查询'.loc(),
		icon : '/themes/icon/xp/search.gif',
		cls : 'x-btn-text-icon',
		scope : this,
		hidden : false,
		handler : function(btn) {
			Ext.Ajax.request({
						url : '/dev/dictionary/ParamSearch.jcp',
						params : {
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
									Ext.msg("info", '未查到相应字典!'.loc());
								} else if (result.data.length > 1) {
									using("dev.dictionary.ParamSearch");
									var showData = new dev.dictionary.ParamSearch(
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
	this.hideToolBar = function() {
		var tempToolBar = this.innerPanel.getTopToolbar();
		tempToolBar.items.each(function(item) {
					try {
						item.disable();
					} catch (e) {
					}
				}, tempToolBar.items);
	};
	this.showToolBar = function(state) {
		var tempToolBar = this.innerPanel.getTopToolbar();
		tempToolBar.items.each(function(item) {
					try {
						if (item.btnId == state)
							item.enable();
					} catch (e) {
					}
				}, tempToolBar.items);
	};
	this.clickEvent = function(clickNode) {
		var Dictionary = this.frames.get('Dictionary');
		this.frames.set('nowNodeTitle', clickNode.prop.title);
		if (clickNode.prop.program == "kind") {
			var paramString = clickNode.prop.params.split('&');
			var params = {};
			for (var i = 0; i < paramString.length; i++) {
				params[paramString[i].split('=')[0]] = paramString[i]
						.split('=')[1];
			}
			this.frames.set('params', params);
			if (clickNode.prop.type == "view") {
				Dictionary.optionPanel.init(this.frames.get('params'));
				this.hideToolBar();
				this.showToolBar('update');
				if (typeof(clickNode.son) == 'undefined') {
					if (clickNode.prop._hasChild == '0') {
						this.showToolBar('del');
					}
				} else if (clickNode.son.length == 0)
					this.showToolBar('del');
			} else if (clickNode.prop.type == "new") {
				Dictionary.optionPanel.disableToolBar();
				this.hideToolBar();
				this.showToolBar('new');
			}
		} else if (clickNode.prop.program == "option") {
			var paramString = clickNode.prop.params.split('&');
			var params = {};
			for (var i = 0; i < paramString.length; i++) {
				params[paramString[i].split('=')[0]] = paramString[i]
						.split('=')[1];
			}
			this.frames.set('params', params);
			Dictionary.optionPanel.formEdit();
			Dictionary.optionPanel.loadData(this.frames.get('params'));
			this.hideToolBar();
		} else if (clickNode.prop.program == "portal") {
			this.frames.set('params', {});
			Dictionary.optionPanel.disableToolBar();
			this.hideToolBar();
		}
	}.createDelegate(this);
	var titleClick = this.clickEvent;
	this.event1.title_click = function() {
		titleClick(this);
	};
	this.menuTree.setEvent("event1", this.event1);

	this.innerPanel = new Ext.Panel({
				border : false,
				layout : 'fit',
				tbar : ButtonArray
			});

	dev.dictionary.NavPanel.superclass.constructor.call(this, {
				title : '字典导航'.loc(),
				region : 'west',
				split : true,
				width : 280,
				layout : 'fit',
				collapsible : true,
				resizable : false,
				tbar : buttonArray,
				items : [this.innerPanel]
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
				Ext.msg("error", '不应有'.loc() + '&,<,>,\",' + '字符'.loc());
				return;
			}
			Ext.Ajax.request({
						url : '/dev/dictionary/optionkind.jcp',
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
				Ext.msg("error", '数据保存失败!,原因:新建分类不能为空'.loc());
				return;
			} else if (/[\<\>\'\"\&]/.test(text)) {
				Ext.msg("error", '不应有'.loc() + '&,<,>,\",' + '字符'.loc());
				return;
			}
			Ext.Ajax.request({
						url : '/dev/dictionary/optionkind.jcp',
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
Ext.extend(dev.dictionary.NavPanel, Ext.Panel, {
			init : function() {
				this.menuTree.finish(this.innerPanel.body.dom, document);
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
				if (uStore.getAttribute("Dictionnary")) {
					this.menuTree.loadHistory("Dictionnary");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Dictionnary");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			}
		});
