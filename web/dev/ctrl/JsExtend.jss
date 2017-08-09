Ext.namespace('dev.ctrl');
dev.ctrl.JsExtend = function(params) {
	var cache = {};
	var root = new Ext.tree.AsyncTreeNode({
				text : '当前模块'.loc(),
				draggable : false,
				expanded : true,
				level : 1,
				id : params.parent_id,
				allowSelect : false,
				icon : "/themes/icon/all/cog.gif"
			});

	var loader = new Ext.tree.TreeLoader({
				dataUrl : '/dev/ctrl/JsExtendTree.jcp',
				requestMethod : "GET"
			});
	loader.on("loadexception", function(tree, node, response) {
				var message = '请先定制列表界面或录入界面'.loc();
				try {
					message = Ext.decode(response.responseText).message;
					if (message.indexOf('定制'.loc()) != -1)
						message = '请先定制列表界面或录入界面或定制数据错误'.loc();
				} catch (e) {
				}
				Ext.msg("error", message);

			});

	var tree = new Ext.tree.TreePanel({
				autoScroll : true,
				animate : false,
				title : '模块导航'.loc(),
				containerScroll : true,
				height : 'auto',
				region : 'west',
				root : root,
				draggable : false,
				split : true,
				width : 200,
				collapsible : true,
				loader : loader
			});
	var eventStore = new Ext.data.SimpleStore({
				fields : ['id', 'text'],
				data : []
			});
	var textItem = new Ext.Toolbar.TextItem('请点击左侧对象'.loc());

	var objectEvents = new Ext.form.ComboBox({
				store : eventStore,
				valueField : 'id',
				displayField : 'text',
				triggerAction : 'all',
				listClass : 'category-element',
				mode : 'local',
				width : 360
			})

	var codeEditor = new lib.scripteditor.CodeEditor({
				allowSearchAndReplace : true,
				allowFormatter : true,
				id : 'codePanel',
				hideLabel : true,
				language : "js"
			});

	function saveBeforeLeave(cs) {
		var spi = codeEditor.getValue().trim();
		var judge = (cs[3] == 'userDefine') ? "_red" : "";
		if (cs[3] == 'userDefine') {
			if (spi.indexOf("=") == -1) {
				alert('自定义对象格式错误,应为:事件名'.loc() + '=function('
						+ '参数1,参数2,...'.loc() + ')' + '{事件体}'.loc());
				return false;
			}
			cs[3] = spi.substring(0, spi.indexOf("="));
			curNodeId = cs.join("_");
		}
		cache[curNodeId] = spi;

		if (cs[3] != '无'.loc()
				&& typeof(tree.getNodeById(curNodeId)) == 'undefined') {

			var pnode = tree.getNodeById(cs[0] + "_" + cs[1] + "_" + cs[2]);
			if (pnode) {
				var leaf = pnode.leaf;
				pnode.appendChild(new Ext.tree.AsyncTreeNode({
							text : cs[3],
							draggable : false,
							level : 3,
							leaf : true,
							id : curNodeId,
							allowSelect : false,
							icon : "/themes/icon/all/script_code" + judge
									+ ".gif"
						}));
				if (leaf)
					pnode.expand();
			}
		}
		return true;
	}

	function getEventBody(curNodeId) {
		Ext.Ajax.request({
					url : '/dev/ctrl/JsExtendTree.jcp?node=' + curNodeId
							+ "&ra" + Math.random(),
					method : 'get',
					scope : this,
					success : function(response, options) {
						cache[curNodeId] = unescape(response.responseText);
						codeEditor.setValue(cache[curNodeId]);
					}
				});
	}

	var curNodeId = "";
	objectEvents.on("select", function(combo, rec) {
				var value = rec.get("id");
				var cs = curNodeId.split("_");
				if (value == '无'.loc()) {
					codeEditor.setValue("");
					curNodeId = cs[0] + "_" + cs[1] + "_" + cs[2];
				}
				if (value == 'userDefined' && codeEditor.getValue().length < 10) {
					codeEditor.setValue('\n' + '事件名'.loc() + ':function('
							+ '参数1,参数2'.loc() + '.....){\n\n\n}\n');
				}
				if (cs.length > 1) {
					if (cs.length > 2) {
						if (!saveBeforeLeave(cs))
							return false;
						curNodeId = cs[0] + "_" + cs[1] + "_" + cs[2] + "_"
								+ value;
						getEventBody(curNodeId);
					} else
						curNodeId = curNodeId + "_" + value;
				}
			})

	tree.on("click", function(node, e) {
				var level = node.getDepth();
				if (level == 0)
					return;
				var cs = curNodeId.split("_");
				if (cs.length == 4) {
					if (!saveBeforeLeave(cs))
						return false;
				}
				curNodeId = node.id;
				var na = (level == 2)
						? node.parentNode.attributes
						: node.attributes;
				eventStore.loadData(na.events);
				textItem.el.innerHTML = na.annotation;
				if (level == 2) {

					var nid = node.id;
					if (typeof(cache[nid]) != 'undefined') {
						codeEditor.setValue(cache[nid]);
					} else {
						getEventBody(nid);
					}

					var ne = na.events;
					var ename = nid.split("_")[3];
					var i = 0;
					for (; i < ne.length; i++) {
						if (ne[i][0] == ename) {
							break;
						}
					}
					if (i < ne.length) {
						objectEvents.setValue(ne[i][0]);
					} else {
						objectEvents.setValue("userDefine");
					}
				} else {
					codeEditor.setValue("");
					objectEvents.setValue('无'.loc());
				}
			});

	var code = new Ext.Panel({
				region : 'center',
				layout : 'fit',
				tbar : [textItem, '->', '事件:'.loc(), objectEvents,
						'&nbsp;&nbsp'],
				items : codeEditor
			});

	this.MainTabPanel = new Ext.Panel({
				layout : 'border',
				border : false,
				items : [tree, code],
				tbar : [new Ext.Toolbar.Button({
							text : '保存'.loc(),
							icon : '/themes/icon/xp/save.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								if (!saveBeforeLeave(curNodeId.split("_")))
									return false;
								Ext.Ajax.request({
											url : '/dev/ctrl/JsExtendTree.jcp',
											method : 'post',
											params : {
												data : Ext.encode(cache),
												objectId : params.parent_id
											},
											scope : this,
											success : function(response,
													options) {
												Ext.msg("info", '保存成功'.loc());
											}
										});
							}
						}), new Ext.Toolbar.Button({
							text : '删除'.loc(),
							icon : '/themes/icon/xp/delete.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								var cs = curNodeId.split("_");
								if (cs.length == 4) {
									cache[curNodeId] = '';
									var node = tree.getNodeById(curNodeId);
									if (typeof(node) != 'undefined') {
										var pnode = node.parentNode;
										pnode.removeChild(node);
										pnode.select();
										curNodeId = cs[0] + "_" + cs[1] + "_"
												+ cs[2];
										codeEditor.setValue("");
										objectEvents.setValue("无");
									}
								} else {
									Ext.msg("error", '请选择事件删除!'.loc());
								}
							}
						}), new Ext.Toolbar.Button({
							text : '返回'.loc(),
							icon : '/themes/icon/xp/undo.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								params.returnFunction();
							}
						})]
			});

}