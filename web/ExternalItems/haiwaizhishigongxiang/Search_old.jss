Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.Search_old = function() {
}
ExternalItems.haiwaizhishigongxiang.Search_old.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		var solrField = new Ext.form.TextField({
					allowBlank : false,
					blankText : "输入不能为空",
					name : 'solrsearch',
					regex : /^[a-zA-Z0-9\u4e00-\u9fa5\ ]+$/,
					regexText : "将要搜索的内容只可以由中文,字母,数字组成",
					msgTarget : 'qtip',
					style : 'padding : 6px 0 6px 7px ; font: 16px/18px arial',
					width : 450,
					height : 34
				});
		function renderTopic(value, meta, rec) {
			if (rec.data.key == '') {
				return "<img src='/themes/icon/all/lock.gif' alt='您没有访问此数据的权限，如需要查看，请联系管理员'><span style='color:scrollbar;font-size:16px;'>"
						+ value + "</span>"
			} else {
				return "<U style='cursor:pointer;color:darkmagenta;font-size:16px;font-weight:bold;'>"
						+ value + "</U>";
			}
		}
		var mainPanel = new Ext.Panel({
			id : 'docmgrSearch',
			title : '全文搜索',
			border : false,
			icon : '/themes/icon/all/magnifier.gif',
			shim : false,
			animCollapse : false,
			constrainHeader : true,
			layout : 'fit',
			padding : '0 0 0 0',
			items : {
				collapsible : false,
				layout : 'border',
				padding : '0 0 0 0',
				border : false,
				items : [{
							region : 'north',
							padding : '50 0 0 0',
							style : 'text-align: center;',
							height : 175,
							html : '<img src="/ExternalItems/haiwaizhishigongxiang/docsearch.bmp">',
							border : false
						}, {
							region : 'center',
							border : false,
							layout : {
								type : 'hbox',
								pack : 'center'
							},
							items : [solrField, {
								// margins : '0 0 0 10',
								xtype : 'button',
								text : '搜索',
								height : 34,
								width : 80,
								scale : 'medium',
								template : new Ext.Template(
										'<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
										'<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
										'<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc">'
												+ '<em class="{2}",unselectable="on">'
												+ '<button type="{0}" style="padding:0 5px 0 32px;font: 16px/18px arial;"></button>'
												+ '</em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
										'<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
										'</tbody></table>'),
								icon : '/home/system/search/search.png',
								handler : function(btn) {
									var resultStore = new Ext.data.JsonStore({
										url : '/ExternalItems/haiwaizhishigongxiang/SolrSearch.jcp',
										method : 'POST',
										baseParams : {
											textQuery : solrField.getValue(),
											comboQuery : 'docmgr'
										},
										root : 'data',
										totalProperty : 'totalCount',
										remoteSort : true,
										fields : ['title', 'content', 'key']
									});
									var pagingBar = new Ext.PagingToolbar({
												pageSize : 20,
												store : resultStore,
												displayInfo : true,
												displayMsg : '显示数据{0} - {1}条，共 {2}条',
												emptyMsg : "没有数据"
											});
									var resultGrid = new Ext.grid.GridPanel({
										width : 736,
										height : 340,
										store : resultStore,
										trackMouseOver : false,
										disableSelection : true,
										loadMask : {
											msg : '数据载入中...'
										},
										columns : [{
													id : 'topic',
													header : "相关模块信息",
													dataIndex : 'title',
													width : 420,
													renderer : renderTopic,
													sortable : true
												}],
										viewConfig : {
											forceFit : true,
											enableRowBody : true,
											showPreview : true,
											getRowClass : function(record,
													rowIndex, p, Store) {
												if (this.showPreview) {
													p.body = '<p>'
															+ record.data.content
															+ '</p>';
													return 'x-grid3-row-expanded';
												}
												return 'x-grid3-row-collapsed';
											}
										},

										listeners : {
											cellclick : function(grid, rowIndex, columnIndex) {
												var rec = grid.getStore().getAt(rowIndex);
												if (rec.get("key") != "") {
														Ext.Ajax.request({
															url : '/ExternalItems/haiwaizhishigongxiang/PanelGridBeforeInit.jcp',
															params : {
																'file_id' : rec.get("key")
															},
															method : 'post',
															scope : this,
															success : function(response, options) {
																var result = Ext.decode(response.responseText);
																//0 跳转至申请，1 跳转至下载 ， 2 跳转至预览
																if (result.success) {
																	var path = result.previewPath || "";
																	switch (result.showType) {
																		case 0 :
																			CPM.openModuleWindow("68967", {}, {pageType : "new"}, {// 固定ID
																				title : "申请使用",
																				width : 650,
																				height : 300,
																				file_name : rec.get("title"),
																				file_id : rec.get("key")
																			});
																			break;
																		case 1 :
																			Ext.msg("confirm", "是否下载该文件?",
																					function(answer) {
																						if (answer == 'yes') {
																							var form = document.createElement('form');
																							form.target = "InnerFileDownloadFrame";
																							form.method = 'POST';
																							form.id = Ext.id();
																							form.action = '/ExternalItems/haiwaizhishigongxiang/downFile.jcp';
																							
																							hd = document.createElement('input');
																							hd.type = 'hidden';
																							hd.name = 'fileId';
																							hd.value = rec.get("pmk");
											
																							form.appendChild(hd);
																							document.body.appendChild(form);
																							
																							form.submit({
																								success : function(f, a) {
																									Ext.Msg.alert('Success', 'It worked');
																								},
																								failure : function(f, a) {
																									Ext.Msg.alert('Warning',a.result.errormsg);
																								}
																							});
																							setTimeout(function() {Ext.removeNode(form);}, 100);
																						}
																					});
																			break;
																		case 2 :
																			CPM.openModuleWindow("68972", {}, {
																						fileDataId : path,
																						fileExportData : rec.get("key")
																					}, {// 固定ID
																						title : "文件预览",
																						width : 800,
																						height : 600,
																						listeners : {
																							close : function() {
																							}
																						}
																					});
																			break;
																	}
																}
															}
														});												
												}
											}
										},
										bbar : pagingBar
									});
									resultGrid.doLayout();
									resultStore.load({
												method : 'POST'
											});
									if (solrField.isValid()) {
										var desktop = WorkBench.Desk
												.getDesktop();
										resultWin = desktop.createWindow({
													title : '搜索结果',
													width : 750,
													height : 400,
													border : false,
													iconCls : 'icon-search',
													layout : 'fit',
													modal : true,
													closable : true,
													items : resultGrid
												});
										resultWin.show();
									} else {
										return;
									}

								}
							}]
						}]
			}
		});
		parentPanel.add(mainPanel);
		parentPanel.doLayout();
	}
}