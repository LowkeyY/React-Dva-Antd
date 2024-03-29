Ext.ns("usr.cms");
usr.cms.editPNavMenu = function(exportItems, treeDatas , parentPanel, parentWindow , currentLevel) {

	exportItems = exportItems || [];
	
	function findByProperty(items, p, addP) {
		return items.filter(function(item) {
					if (item.name && item.name === p + addP)
						return true;
				});
	}
	function getBaseConfig(items, title , subItems) {
		var rs = {}, arr;
		if (Ext.type(items) == "array") {
			Ext.each([["最大行数","row"],["最大列数" , "colum"] , ["菜单层级" , "levels"] , ["VALUE" , "datas"]],function(m){
				arr = findByProperty(items, title, m[0]);
				rs[m[1]] = arr.length > 0 && !Ext.isEmpty(arr[0].value) ? arr[0].value : 1;
			})
		} else {
			rs = Ext.apply({}, items);
		}
		if(subItems && subItems.length > 0){
			rs.row = subItems.length;
		}
		return rs;
	};
	var PWTitle = parentWindow.title , cid = Ext.id(), isSubmit = (parentPanel === parentWindow) , currentMenuNo = 1;
	var baseConfig = getBaseConfig(exportItems , PWTitle , (isSubmit ? [] : parentPanel.subChildren || [])),
		currentLevel = Ext.isDefined(currentLevel) ? currentLevel : baseConfig.levels , isHasSubMenu =  (currentLevel > 1);
	var panelItems = [], testValue = {
		text : "",
		urls : ""
	}, defualtValues = isSubmit ? baseConfig.datas === 1 ? [] : Ext.decode(baseConfig.datas) : parentPanel.subChildren || [];
	Ext.each(treeDatas, function(td) {
				td["expanded"] = true;
			});
	function createFormPanel(vs){
		return new Ext.form.FormPanel({
				title : "菜单" + (isSubmit ? (currentMenuNo++) : ""),
				labelAlign : "top",
				bodyStyle : "padding: 1px 10px; background-color: #DFE8F6;",
				collapsible : true,
				defaultType : "textfield",
				defaultLoadDatas : vs,
				items : [{	
							width : "100%",
							fieldLabel : "菜单名称",
							name : "text"
						}, {
							width : "100%",
							fieldLabel : "链接地址",
							name : "urls"
						}],
				tools : [{
					id : "gear",
					qtip : "设置子菜单项",
					hidden : !isHasSubMenu,
					handler : function(event, toolEl, panel) {
						var cr = Ext.isDefined(panel.subChildren) && panel.subChildren.length > 1 ? panel.subChildren.length : 1;
						var pt = panel.form.findField("text") && panel.form.findField("text").getValue() || "";
						var win = new Ext.Window({
									title : pt,
									width : WorkBench.Desk.getDesktop().getViewWidth() * 0.4,
									height : WorkBench.Desk.getDesktop().getViewHeight() * 0.8,
									icon : "/themes/icon/all/book_open.gif",
									autoScroll : false,
									layout : "fit",
									modal : true,
									items : usr.cms.editPNavMenu({
												row : cr,
												colum : 1
											}, treeDatas, panel, parentWindow , (currentLevel - 1))
								});
						win.show();
					}
				}, isSubmit ? {
					id : "close",
					qtip : "重置",
					handler : function(event, toolEl, panel) {
						panel.form.items.each(function(item) {
									item.setValue("");
								});
					}
				} : {
					id : "close",
					panelId : "",
					qtip : "关闭",
					handler : function(event, toolEl, panel) {
						var p = Ext.getCmp(cid + "_center");
						if(p){
							p.getComponent(0).remove(panel);
							currentMenuNo--;
						}
					}
				}],
				listeners : {
					afterrender : function(frm) {
						if (frm.defaultLoadDatas) {
							frm.form.setValues(frm.defaultLoadDatas);
							if(frm.defaultLoadDatas.items)
								frm.subChildren = frm.defaultLoadDatas.items;
						}
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
										return (true);
									}
								});
					}
				}
			});
	
	}
	for (var i = 0; i < baseConfig.colum; i++) {
		var items = [];
		for (var j = 0; j < baseConfig.row; j++) {
			var curIndex = i * baseConfig.row + j, 
				values = defualtValues.length > 0 ? defualtValues[curIndex] || testValue : testValue;
			var frm = createFormPanel(values);
			items.push(frm);
		}
		panelItems.push({
					columnWidth : baseConfig.colum == 1 ? 1 / 1.25 : 1 / baseConfig.colum,
					items : items
				});
	}
	return {
		width : "100%",
		height : 450,
		layout : "border",
		autoScroll : true,
		items : [{
					region : "west",
					collapsible : true,
					title : "站点下的栏目",
					ddGroup : "treeDDGroup" + cid,
					xtype : "treepanel",
					width : isSubmit ? "15%" : "30%",
					editable : false,
					autoScroll : true,
					rootVisible : false,
					mode : "remot",
					allowBlank : false,
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
					width :  isSubmit ? "85%" : "70%",
					layout : "column",
					id : cid + "_center",
					autoScroll : true,
					items : panelItems,
					buttonAlign : "left",
					listeners :{
						afterrender : function(comp){
							var w;
							if (w = comp.findParentByType(Ext.Window)) {
								w.el.dom.style.textAlign = 'left';
							}
						}
					},
					buttons : [!isSubmit ? {
										text : "添加菜单" ,
										panelId : cid + "_center",
										icon : '/themes/icon/all/add.gif',
										handler : function(btn){
											var p = Ext.getCmp(btn.panelId);
											if(p){
												p.getComponent(0).add(createFormPanel(testValue));
												p.doLayout();
											}
										}
					} : "" , "->" ,{
						text : isSubmit ? "保存" : "确定",
						panelId : cid + "_center",
						handler : function(btn) {
							var p = Ext.getCmp(btn.panelId);
							var values = [];
							for(var index = 0 ; index < p.items.length ; index++){
								var comp = p.getComponent(index);
								Ext.each(comp.items.items , function(item){
									var v = item.form.getValues() , isEmpty = true;
									for(var att in v){
										if(!v[att] == ""){
											isEmpty = false;
											break;
										}
									}
									if(!isEmpty){
										if(Ext.isDefined(item.subChildren) && item.subChildren.length > 0)
											v.items = item.subChildren;
										values.push(v);
									};
								})
							}
							if (isSubmit) {
								var filedName = PWTitle + "VALUE", paramsObj;
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
										Ext.msg("confirm", "已完成修改，是否重载页面？",
														function(btns) {
															if (btns == "yes") {
																this.markPanel.removeAll();
																this.doPreview();
															}
														}.createDelegate(parentWindow.scope));
									},
									failure : function(form, action) {
										switch (action.failureType) {
											case Ext.form.Action.CLIENT_INVALID :
												Ext.msg("error", "表单错误，请刷新页面重试。");
												break;
											case Ext.form.Action.CONNECT_FAILURE :
												Ext.msg("error", "连接失败，请刷新页面重试。");
												break;
											case Ext.form.Action.SERVER_INVALID :
												Ext.msg("error", action.result.msg);
										}
									}
								}, this);
							} else {
								parentPanel.subChildren = values;
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