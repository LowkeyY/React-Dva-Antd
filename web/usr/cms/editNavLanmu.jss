Ext.ns("usr.cms");
usr.cms.editNavLanmu = function(exportItems, treeDatas, parentPanel,
		parentWindow, allowEditSub , disabled) {
	exportItems = exportItems || [];
	function getBaseConfig(params , title){
		var rs = {};
		if(Ext.type(params) == "array"){
			var newArr = params.filter(function(item){
				if(item.name && item.name === title+"最大行数")
					return true;
			});
			rs.row = newArr.length > 0 ? newArr[0].value : 1;
			newArr = params.filter(function(item){
				if(item.name && item.name === title+"最大列数")
					return true;
			});
			rs.colum = newArr.length > 0 ? newArr[0].value : 8;
			rs.dataId = "root";
		}else{
			rs = Ext.apply({} , params);
		}
		return rs;
	};
	var PWTitle = parentWindow.title , cid = Ext.id(), isSubmit = (parentPanel === parentWindow);
	var baseConfig = getBaseConfig(exportItems , PWTitle);
	var panelItems = [], forms = [], testValue = {
		id : "",
		text : "",
		urls : "",
		leaf : true
	}, defualtValues = parentWindow.submenus[baseConfig.dataId] || [];
	Ext.each(treeDatas, function(td) {
				td["expanded"] = true;
			});
	for (var i = 0; i < baseConfig.colum; i++) {
		var items = [];
		for (var j = 0; j < baseConfig.row; j++) {
			var curIndex = i * baseConfig.row + j, values = defualtValues.length > 0
					? defualtValues[curIndex] || testValue
					: testValue;
			var frm = new Ext.form.FormPanel({
				title : "菜单" + (curIndex + 1),
				labelAlign : "top",
				bodyStyle : "padding: 1px 10px; background-color: #DFE8F6;",
				collapsible : true,
				defaultType : "textfield",
				defaultLoadDatas : values,
				allowEditSub : allowEditSub,
				refreshTools : function(showTL) {
					if (!this.allowEditSub) {
						return;
					}
					var tl = this.getTool("gear"), field;
					if (!tl) {
						reutrn;
					}
					if (Ext.type(showTL) == "string"
							&& (field = this.form.findField("leaf"))) {
						tl.setVisible(field.getValue() === "false");
					} else {
						if (Ext.type(showTL) == "boolean") {
							tl.setVisible(showTL);
						}
					}
				},
				items : [{
							fieldLabel : "id",
							hidden : true,
							hideLabel : true,
							name : "id"
						}, {
							fieldLabel : "菜单名称",
							name : "text"
						}, {
							fieldLabel : "链接地址",
							name : "urls"
						}, {
							fieldLabel : "不包含子菜单",
							hidden : true,
							hideLabel : true,
							name : "leaf"
						},{
							fieldLabel : "",
							hideLabel : true,
							name : "userdata",
							boxLabel: '记住我的修改',
							xtype : "checkbox"
						}],
				tools : [{
					id : "gear",
					qtip : "设置子菜单项",
					hidden : values.leaf && !allowEditSub,
					handler : function(event, toolEl, panel) {
						function findChildNodeById(nodes, attribute, value) {
							var rs = [];
							Ext.each(nodes, function(node) {
										if (node[attribute] === value) {
											rs.push(node.children);
										}
										if (node.children) {
											Array.prototype.push.apply(rs,
													findChildNodeById(
															node.children,
															attribute, value));
										}
									});
							return rs;
						}
						var fid = panel.form.findField("id");
						if (fid && fid.getValue().length > 0) {
							var pt = panel.form.findField("text")
									&& panel.form.findField("text").getValue()
									|| "";
							pt += pt.length > 0 ? "的子菜单" : "子菜单";
							var subDatas = findChildNodeById(treeDatas, "id",
									fid.getValue());
							var conf = usr.cms.editNavLanmu({
										row : subDatas[0].length,
										colum : 1,
										dataId : fid.getValue()
									}, subDatas[0], panel, parentWindow,
									allowEditSub, false);
							var win = new Ext.Window({
										title : pt,
										width : Ext.lib.Dom.getViewWidth()
												* 0.9,
										height : Ext.lib.Dom.getViewHeight()
												* 0.8,
										icon : "/themes/icon/all/book_open.gif",
										autoScroll : false,
										layout : "fit",
										modal : true,
										items : conf
									});
							win.show();
						} else {
							Ext.msg("error", "提取数据错误，请重新选择栏目。");
						}
					}
				}, {
					id : "close",
					qtip : "重置",
					handler : function(event, toolEl, panel) {
						panel.form.items.each(function(item) {
									item.setValue("");
								});
						panel.refreshTools("");
					}
				}],
				listeners : {
					afterrender : function(frm) {
						if (frm.defaultLoadDatas) {
							frm.form.setValues(frm.defaultLoadDatas);
						}
						frm.refreshTools("");
						var formPanelDropTarget = new Ext.dd.DropTarget(
								frm.body.dom, {
									ddGroup : "treeDDGroup" + cid,
									notifyEnter : function(ddSource, e, data) {
										frm.body.stopFx();
										frm.body.highlight();
									},
									notifyOut : function(ddSource, e, data) {
										frm.body.stopFx();
									},
									notifyDrop : function(ddSource, e, data) {
										if (frm.subChildren) {
											delete frm.subChildren;
										}
										var selectedRecord = ddSource.dragData.node.attributes;
										frm.getForm().setValues(selectedRecord);
										var showTL = (selectedRecord.children && selectedRecord.children.length > 0) || false;
										frm.refreshTools(showTL);
										return (true);
									}
								});
					}
				}
			});
			items.push(frm);
			forms.push(frm);
		}
		panelItems.push({
					columnWidth : 1 / baseConfig.colum,
					items : items
				});
	}
	return {
		disabled : disabled || false,
		width : "100%",
		height : 450,
		forms : forms,
		layout : "border",
		autoScroll : true,
		items : [{
					region : "west",
					collapsible : true,
					title : isSubmit ? "站点下的栏目" : "栏目下的子栏目",
					ddGroup : "treeDDGroup" + cid,
					xtype : "treepanel",
					width : "15%",
					editable : false,
					rootVisible : false,
					mode : "remot",
					allowBlank : false,
					autoScroll : true,
					enableDD : true,
					dropConfig : {
						appendOnly : true
					},
					root : {
						nodeType : "async",
						expanded : true,
						children : treeDatas
					}
				}, {
					region : "center",
					border : false,
					defaults : {
						border : false
					},
					width : "85%",
					layout : "column",
					autoScroll : true,
					items : panelItems,
					listeners :{
						afterrender : function(comp){
							var w;
							if (w = comp.findParentByType(Ext.Window)) {
								w.el.dom.style.textAlign = 'left';
							}
						}
					},
					buttons : ["->", {
						text : isSubmit ? "保存" : "确定",
						handler : function(btn) {
							var values = [];
							function getAllSelect(it, menus) {
								if (menus[it.id]) {
									it.items = menus[it.id];
								}
								Ext.each(it.items, function(i) {
											getAllSelect(i, menus);
										});
								return it;
							}
							Ext.each(forms, function(frm) {
										var v = frm.form.getValues();
										values.push(getAllSelect(v, parentWindow.submenus));
									});
							if (isSubmit) {
								var filedName = PWTitle + "值", paramsObj;
								eval("paramsObj = {" + filedName + " : ''}");
								paramsObj[filedName] = Ext.encode(values);
								Ext.Ajax.request({
									url : "/usr/cms/editTemplateLoad.jcp",
									params : Ext.apply({
										dataId : parentWindow.scope.param["dataId"],
										formJson : Ext
												.encode([filedName])
									}, paramsObj),
									scope : this,
									method : "Post",
									success : function(form, action) {
										parentWindow.close();
										Ext
												.msg("confirm",
														"已完成修改，是否重载页面？",
														function(btns) {
															if (btns == "yes") {
																this.markPanel
																		.removeAll();
																this
																		.doPreview();
															}
														}
																.createDelegate(parentWindow.scope));
									},
									failure : function(form, action) {
										switch (action.failureType) {
											case Ext.form.Action.CLIENT_INVALID :
												Ext.msg("error",
														"表单错误，请刷新页面重试。");
												break;
											case Ext.form.Action.CONNECT_FAILURE :
												Ext.msg("error",
														"连接失败，请刷新页面重试。");
												break;
											case Ext.form.Action.SERVER_INVALID :
												Ext.msg("error",
														action.result.msg);
										}
									}
								}, this);
							} else {
								parentWindow.submenus[baseConfig.dataId] = values;
								var w;
								if (w = btn.findParentByType(Ext.Window)) {
									w.close();
								}
							}
						}
					}, {
						text : "取消",
						handler : function(btn) {
							var w = parentWindow === parentPanel
									? parentWindow
									: btn.findParentByType(Ext.Window);
							if (w) {
								w.close();
							}
						}
					}]
				}]
	};
};