Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");
using("ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portal");
using("ExternalItems.haiwaizhishigongxiang.spacePage.Portal.PortalColumn");
using("ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet");
using("ExternalItems.haiwaizhishigongxiang.spacePage.fixedPages");
using("ExternalItems.haiwaizhishigongxiang.spacePage.setPageWin");

ExternalItems.haiwaizhishigongxiang.spacePage.pageIndex = function() {
	this.load = function(framePanel, parentPanel, param) {
		
		var nowId = "HWSpaceIndexpageId";

		if (Ext.isDefined(Ext.getCmp(nowId)))
			return;

		var win = framePanel.findParentByType(Ext.Window);
		
		if(!win){
			win = parentPanel.ownerCt.ownerCt.ownerCt.ownerCt;
		}
	
		if (!win.getEl().isMasked())
			win.getEl().mask("加载中...");

		/*win.once("afterlayout", function(w) {
					w.getEl().mask("加载中...");
		});*/
		var fixedPages = new ExternalItems.haiwaizhishigongxiang.spacePage.fixedPages();
		var allIts = fixedPages.getAllPages();

		Ext.Ajax.request({
			url : '/ExternalItems/haiwaizhishigongxiang/spacePage/pageIndex.jcp',
			method : 'get',
			success : function(response, options) {
				var result = Ext.decode(response.responseText);
				if (result.success) {
					var isManager = result.isManager;
					var tbar = [];
					
					if (isManager) {
						tbar.push({
							text : '设置空间首页',
							iconCls : 'iportal-icon-btn-desktopList',
							handler : function(btn) {
								var ud = indexPanel.getHasApps();
								new ExternalItems.haiwaizhishigongxiang.spacePage.setPageWin( btn, allIts, ud);
							}
						});
					}
					var userApps = result.apps || [{
					"column" : "0",
					"class_name" : "ExternalItems.haiwaizhishigongxiang.spacePage.oneLeveFileCount",
					"about" : "本空间目录资料统计",
					"object_name" : "本空间目录资料统计"
				},{
					"column" : "0",
					"class_name" : "ExternalItems.haiwaizhishigongxiang.spacePage.ZHFLFileCount",
					"about" : "按核心分类统计",
					"object_name" : "按核心分类统计"
				},{
					"column" : "0",
					"class_name" : "ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinXiaZai",
					"about" : "近期下载",
					"object_name" : "近期下载"
				},{
					"column" : "1",
					"class_name" : "ExternalItems.haiwaizhishigongxiang.spacePage.ZTFLFileCount",
					"about" : "按主题词分类统计",
					"object_name" : "按主题词分类统计"
				},{
					"column" : "1",
					"class_name" : "ExternalItems.haiwaizhishigongxiang.spacePage.WaitShSp",
					"about" : "本处室资料综合统计",
					"object_name" : "本处室资料综合统计"
				},{
					"column" : "1",
					"class_name" : "ExternalItems.haiwaizhishigongxiang.spacePage.ZuiJinShangChuan",
					"about" : "最新入库资料",
					"object_name" : "最新入库资料"
				}];
					
					var indexPanel = new ExternalItems.haiwaizhishigongxiang.spacePage.Portal({
						id : nowId,
						margins : '35 5 5 0',
						layoutCount : 0,
						tbar : tbar,
						canOnlyUpdate : false,
						isFristLoad : true,
						savePosition : function() {
							var ds = this.getHasApps();
							var is = new Array();
							for (var i = 0; i < this.items.length; i++) {
								var data = new Array();
								data = this.getComponent(i).items.keys;
								for (var j = 0; j < data.length; j++) {
									Ext.each(ds, function(it) {
												if (it.class_name == data[j])
													is.push(Ext.apply(it, {"column" : i}));
											})
								}
							};
							Ext.Ajax.request({
										url : '/ExternalItems/haiwaizhishigongxiang/spacePage/pageIndex.jcp',
										method : 'post',
										params : {
											type : "savePosition",
											apps : Ext.encode(is)
										}
									});
						},
						getHasApps : function() {
							var maxLen = 0, is = new Array(), ds = allIts;
							for (var i = 0; i < this.items.length; i++)
								maxLen = (maxLen >= this.getComponent(i).items.length
										? maxLen
										: this.getComponent(i).items.length);

							for (var i = 0; i < maxLen; i++) {
								for (var j = 0; j < this.items.length; j++) {
									if (this.getComponent(j).items.length > i) {
										var cn = this.getComponent(j).items.keys[i];
										Ext.each(ds, function(it) {
													if (it.class_name == cn)
														is.push(it);
												})
									}
								}
							}
							return is;
						},
						doLayoutTheItems : function(objs, relayout, removeAll) {
							if (removeAll) {
								for (var i = 0; i < this.items.length; i++)
									this.getComponent(i).removeAll();
							}
							for (var i = 0; i < objs.length; i++) {
								var app = objs[i];
								if (app.column == 2) {
									if (this.getComponent(0).items.length > this.getComponent(1).items.length)
										app.column = 1;
									else
										app.column = 0;
								}
								eval("using('"+app.class_name+"')");
								var appName = app.class_name.substring(app.class_name.lastIndexOf(".") + 1);
								var appConf = eval("result." + appName);
								if (Ext.isDefined(appConf) && !Ext.isEmpty(appConf) && this.isFristLoad)
									eval(appName + " = new " + app.class_name + "(" + Ext.encode(appConf) + ");");
								else
									eval(appName + " = new " + app.class_name + "();");

								eval("this.getComponent(" + app.column + ").add(" + appName + ".mainPanel);");
								try {
								} catch (e) {
								}
							}
							if (relayout) {
								for (var i = 0; i < this.items.length; i++)
									this.getComponent(i).doLayout();
							}

						},
						items : [{
									columnWidth : .50,
									style : 'padding:10px 0 10px 10px',
									items : []
								}, {
									columnWidth : .50,
									style : 'padding:10px',
									items : []
								}],
						listeners : {
							'drop' : function(e) {
								if(this.getTopToolbar().items.length > 0)
									this.savePosition();
							},
							'afterrender' : function() {
								indexPanel.doLayoutTheItems(userApps);
							}
						}
					})

					parentPanel.add(indexPanel);
					framePanel.add(parentPanel);

					setTimeout(function() {
								win.getEl().unmask();
								framePanel.doLayout();
							}, 500);

				} else {
					win.getEl().unmask();
				}
			}
		});
	}
}
