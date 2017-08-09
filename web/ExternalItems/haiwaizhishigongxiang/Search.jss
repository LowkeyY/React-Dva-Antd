Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("ExternalItems.haiwaizhishigongxiang.FilePreview");
using("ExternalItems.haiwaizhishigongxiang.PluginUitls");
using("lib.ComboTree.ComboTree");
loadcss("ExternalItems.haiwaizhishigongxiang.css.Serch");

ExternalItems.haiwaizhishigongxiang.Search = function() {
}
ExternalItems.haiwaizhishigongxiang.Search.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		var searchBtnId = Ext.id();
/*		var solrField = new Ext.form.TextField({
					allowBlank : false,
					blankText : "输入不能为空",
					name : 'solrsearch',
					regex : /^[a-zA-Z0-9\u4e00-\u9fa5\ -（）]+$/,
					regexText : '将要搜索的内容只可以由中文,字母,数字组成',
					msgTarget : 'qtip',
					style : 'padding : 6px 0 6px 7px ; font: 16px/18px arial',
					width : 450,
					height : 34,
					searchBtnId : searchBtnId,
					listeners : {
						specialkey: function(field, e){
							var btn;
		                    if (e.getKey() == e.ENTER && (btn = Ext.getCmp(field.searchBtnId))) {
		                        btn.handler();
		                    }
		                }
					}
				});*/
		var seachStore = new Ext.data.JsonStore({
			url : '/ExternalItems/haiwaizhishigongxiang/search/userSearch.jcp',
			method : 'POST',
			root : 'data',
			totalProperty : 'totalCount',
			remoteSort : true,
			fields : ['title']
		});
		var solrField = new Ext.form.ComboBox({
					store: seachStore,
			        displayField:'title',
			        width : 450,
			        typeAhead: false,
			        autoSelect : false,
			        hideTrigger:true,
			        onSelect: function(record){
			           var btn;
	                    if (this.searchBtnId && (btn = Ext.getCmp(this.searchBtnId))) {
	                    	this.setValue(record.data.title);
	                    	this.collapse();
	                        btn.handler();
	                    }
			        },
			        minChars : 0,
			        queryParam : "textQuery",
					allowBlank : false,
					blankText : "输入不能为空",
					name : 'solrsearch',
					regex : /^[a-zA-Z0-9\u4e00-\u9fa5\ -（）]+$/,
					regexText : '将要搜索的内容只可以由中文,字母,数字组成',
					msgTarget : 'qtip',
					style : 'padding : 6px 0 6px 7px ; font: 16px/18px arial; height: 33px',
					searchBtnId : searchBtnId,
					listeners : {
						specialkey: function(field, e){
							var btn;
		                    if (e.getKey() == e.ENTER && (btn = Ext.getCmp(field.searchBtnId))) {
		                        btn.handler();
		                    }
		                },
		                focus : function(){
		                	if(Ext.isEmpty(this.getValue())){
			                	this.store.baseParams[this.queryParam] = "";
			                	this.store.load();
		                	}
		                }
					}
				});		
		var PUS = new ExternalItems.haiwaizhishigongxiang.PluginUitls();
		function renderTopic(value, meta, rec) {
			var typeIcon = (rec.get("f_type") && PUS.IconsMap[rec.get("f_type").toLowerCase().trim()])|| PUS.IconsMap.unknown;
			return "<img src='/themes/types/medium/"
					+ typeIcon
					+ "' style='vertical-align:bottom;height:20px;width:20px;'/>"
					+ "<U style='cursor:pointer;color:#00C;font-size:18px;font-weight:bold;line-height:20px;text-decoration: none;border-bottom: 1px solid #00C'>"
					+ value + "</U>";
		}
		
		var contextAreaId = Ext.id();
		var resultStore = new Ext.data.JsonStore({
			url : '/ExternalItems/haiwaizhishigongxiang/SolrSearch.jcp',
			method : 'POST',
			contextAreaId : contextAreaId,
			baseParams : {
				textQuery : solrField.getValue(),
				comboQuery : 'docmgr'
			},
			root : 'data',
			totalProperty : 'totalCount',
			remoteSort : true,
			fields : ['title', 'content', 'key' , 'f_path' , 'f_size' ,'f_type' , 'f_space' , 'f_url' , 'f_uploader' , 'f_type_hx' , 'f_type_ztc']
		});
		var pagingBar = new Ext.PagingToolbar({
					pageSize : 20,
					store : resultStore,
					displayInfo : true,
					displayMsg : '显示数据{0} - {1}条，共 {2}条',
					emptyMsg : "没有数据"
		});
		var resultGrid = new Ext.grid.GridPanel({
			region : 'center',
			width : '80%',
			border : false,
			id : contextAreaId,
			hidden : true,
			autoScroll : true,
			store : resultStore,
			enableColumnMove : false,
			enableHdMenu : false,
			trackMouseOver : false,
			viewAtt : function(id) {
				CPM.replaceTarget(null, null, {
							dataId : id,
							popupWindowConfig : {
								height : 400,
								icon : "/themes/icon/common/print_view.gif",
								title : "查看详细信息",
								width : 800,
								modal : true
							}
						}, {
							type : "1",
							targets : [{
										"id" : "2561be14-7724-46bc-b489-c3add77a2d4d", // 固定ID
										"frame" : "",
										"order" : "view",
										"programType" : "ProgramInput"
									}]
						});
			},
			disableSelection : true,
			loadMask : {
				msg : '数据载入中...'
			},
			columns : [{
						id : 'topic',
						header : "相关模块信息",
						dataIndex : 'title',
						//width : 420,
						renderer : renderTopic,
						sortable : false
					}],
			viewConfig : {
				forceFit : true,
				enableRowBody : true,
				showPreview : true,
				PluginUitls : PUS,
				getRowClass : function(record, rowIndex, p, Store) {
					if (this.showPreview) {
						p.body = "";
						if(record.data.f_url){
							p.body += "<div style='float:left;width:80px;height:80px;text-align:center;margin:0 10px;'>"
									+ "<img src='/ExternalItems/haiwaizhishigongxiang/SearchFilePreview.jcp?file_id="+record.data.key
									+ "' style='margin-top:4px' width='72' height='72'>"
									+ "</div>";
						}
						p.body += '<p style="padding:5px 20px;color:#666;" >'
						if(record.data.title){
							p.body += '<a href="javascript:void(0);" class="haiwaizhishi-seach-att-btn" onclick="'
									+ '(function(){var g;if((g = Ext.getCmp(\''+contextAreaId+'\')) && g.viewAtt) g.viewAtt('+record.data.key+');})()">'
									+ '<span style="color:#666;padding: 1px 3px 1px 18px">文件属性</span>' 
									+ '</a>'
						}
						if (record.data.f_uploader) {
							p.body += '<span> 上传用户 : <font color="#0000cc">'
									+ record.data.f_uploader
									+ '</font> ; </span>';
						}
						if (record.data.f_type_hx) {
							p.body += '<span> 核心分类 : <font color="#0000cc">'
									+ record.data.f_type_hx
									+ '</font> ; </span>';
						}
						if (record.data.f_type_ztc) {
							p.body += '<span> 主题词分类 : <font color="#0000cc">'
									+ record.data.f_type_ztc
									+ '</font> ; </span>';
						}
						if (record.data.f_size) {
							p.body += '<span>  大小 : '
									+ this.PluginUitls.bytesToSize(record.data.f_size)
									+ '</span>'
									+ ' - '
									+ '<span>  类型 : '
									+ (record.data.f_type || '')
									+ '</span>';
						}
						p.body += '</p>';
						p.body += '<p style="padding:5px 20px">' + record.data.content + '</p>';
						p.body += '<p style="padding:5px 20px">';
						if (record.data.f_space) {
							p.body += '<span style="color:#666;"> 所属空间: <font color="#008000">' + record.data.f_space + '</font> ; </span>';
						}
						if (record.data.f_path) {
							p.body += '<span style="color:#666;"> 所在目录: <font color="#008000">' + record.data.f_path + '</font></span>';
						}
						p.body += '</p>'
						return 'x-grid3-row-expanded';
					}
					return 'x-grid3-row-collapsed';
				}
			},
			listeners : {
				cellclick : function(grid, rowIndex, columnIndex) {
					var rec = grid.getStore().getAt(rowIndex);
					var win = grid.findParentByType(Ext.Window);
					if(rec.get("key") && rec.get("title")){
						rec.data.pmk = rec.get("key");
						rec.data.FILE_INFO_NAME = rec.get("title");
						ExternalItems.haiwaizhishigongxiang.FilePreview(rec , grid , win);
					}
				}
			},
			bbar : pagingBar
		});
		var northAreaId = Ext.id();
		var raplaceNorthAreaId = Ext.id();
		var rightComboTreeLableId = Ext.id();
		var rightComboTreeId = Ext.id();
		var extractKeyLabelId = Ext.id();
		var RENorthPanelId = Ext.id();
		var REEastPanelId = Ext.id();
		
		var mainPanel = new Ext.Panel({
			id : 'docmgrSearch',
			title : '全文搜索',
			border : false,
			icon : '/themes/icon/all/magnifier.gif',
			shim : false,
			animCollapse : false,
			constrainHeader : true,
			fried : solrField,
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
								id : northAreaId,
								html : '<img src="/ExternalItems/haiwaizhishigongxiang/docsearch.bmp">',
								border : false
						},{
							region : 'center',
							border : false,
							layout : 'border',
							items : [{
								region : 'north',
								border : false,
								layout : 'border',
								height : 84,
								items : [{
										region : 'center',
										border : false,
										layout : {
											type : 'hbox',
											pack : 'center'
										},
										height : 74,
										padding : '20 5 10 20',
										items : [{
												width : 150,
												height : 34,
												id : raplaceNorthAreaId,
												html : '<img src="/ExternalItems/haiwaizhishigongxiang/docsearch.bmp" style="height:34px;">',
												hidden : true ,
												border : false
											}, solrField , {
												// margins : '0 0 0 10',
												id : searchBtnId,
												xtype : 'button',
												text : '搜索',
												height : 34,
												width : 80,
												scale : 'medium',
												resultStore : resultStore,
												contextAreaId : contextAreaId,
												northAreaId : northAreaId,
												raplaceNorthAreaId : raplaceNorthAreaId,
												rightComboTreeLableId : rightComboTreeLableId,
												rightComboTreeId : rightComboTreeId,
												extractKeyLabelId : extractKeyLabelId,
												RENorthPanelId : RENorthPanelId,
												REEastPanelId : REEastPanelId,
												changeSearchValue : function(e , field , btn){
													var newValue;
													if((newValue = this.dom.innerText) && field && btn){
														field.setValue(newValue);
														btn.handler();
													}
												},
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
													if(solrField.isValid()){
														var northP = Ext.getCmp(this.northAreaId) , showP , gridP = Ext.getCmp(this.contextAreaId) ,
														spaceL, spaceC = Ext.getCmp(this.rightComboTreeId) , labelEK , gridNP , gridEP;
														if(northP && !northP.hidden && (showP = Ext.getCmp(this.raplaceNorthAreaId)) && gridP){
															northP.hide();
															northP.collapse();
															//showP solrField this spaceL spaceC
															showP.setPosition(solrField.getBox().x - 200 - this.width / 2, 0);
															showP.show();
															var box = showP.getBox();
															solrField.setPosition(box.x + box.width , 0);
															this.setPosition(solrField.x + solrField.width , 0);
															if((spaceL = Ext.getCmp(this.rightComboTreeLableId)) && spaceC){
																spaceL.setPosition(this.x + this.width + 20 , 13);
																spaceC.setPosition(this.x + this.width + 80 , 10);
																spaceL.show() && spaceC.show();
															}
															if(gridNP = Ext.getCmp(this.RENorthPanelId)){
																gridNP.hide();
																gridNP.collapse();
															}
															if(gridEP = Ext.getCmp(this.REEastPanelId))
																gridEP.show();
															gridP.show();
														}
														if(labelEK = Ext.getCmp(this.extractKeyLabelId)){
															if(labelEK.hidden){
																labelEK.setPosition(solrField.getBox().x - 100 - this.width / 2, 0);
																labelEK.show();
															}
															Ext.Ajax.request({
																url : '/ExternalItems/haiwaizhishigongxiang/search/getSearchReKey.jcp',
																params : {
																	'text' : solrField.getValue()
																},
																method : 'post',
																scope : this,
																success : function(response, options) {
																		var result = Ext.decode(response.responseText);
																		if(result.success && result.datahtml){
																			var searchBtn = this;
																			labelEK.update(result.datahtml , false , function(){
																				var targetAs = labelEK.getEl().dom.getElementsByTagName("a");
																				if(targetAs.length){
																					for(var i = 0 ; i < targetAs.length ;i++){
/*																						var el = Ext.getDom(targetAs[i]);
																						el.addEventListener("click", searchBtn.changeSearchValue.createDelegate(el , [solrField , searchBtn] , true));*/
																						var fl = Ext.fly(targetAs[i]);
																						fl.on("click", searchBtn.changeSearchValue.createDelegate(fl , [solrField , searchBtn] , 1));
																					}
																				}
																			});
																		}
																	}
																});
														}
														this.resultStore.baseParams.textQuery = solrField.getValue();
														if(spaceC && spaceC.getValue())
															this.resultStore.baseParams.selectSpace = spaceC.getValue();
														this.resultStore.load({
															method : 'POST',
															callback : function(){
																var data;
																if(this.reader && (data = this.reader.jsonData)){
																	if(data.resultTitle && gridP)
																		gridP.colModel.setColumnHeader( 0 , data.resultTitle);
																	if(data.selectNode && data.selectNode.indexOf("::")!=-1 && spaceC){
																		spaceC.setValue({text : data.selectNode.split("::")[1] , value : data.selectNode.split("::")[0]});
																	}
																}
															}
														});
													}
												}
											}, new Ext.form.Label({
													id : rightComboTreeLableId,
													width : 55,
													hidden : true,
													text : "选择空间:"
											}), new lib.ComboTree.ComboTree({
													id : rightComboTreeId,
													width : 185,
													loader : new Ext.tree.TreeLoader({
																url : '/ExternalItems/haiwaizhishigongxiang/SearchSpaceTree.jcp',
																method : 'Post'
															}),
													editable : false,
													mode : 'local',
													treeConfig : {
														rootVisible : false
													},
													rootVisible : false,
													root : new Ext.tree.AsyncTreeNode({
														text : 'root',
														id : 'root'
													}),
												    hidden : true
											})
										]
									},{
										region : 'south',
										border : false,
										layout : 'absolute',
										height : 20,
										items : new Ext.Panel({
													height : 20,
													border : false,
													searchBtnId : searchBtnId,
													cls:'search-re-title-key',
													id : extractKeyLabelId,
													hidden : true
											})
									}
								]}, {
									layout : 'border',
									region : 'center',
									border : false,
									items : [{
										id : RENorthPanelId,
										height : '100%',
										layout : 'fit',
										region : 'north',
										border : false,
										listeners : {
											afterrender : function(p){
												Ext.Ajax.request({
													url : '/ExternalItems/haiwaizhishigongxiang/getgxsj.jcp',
													method : 'post',
													scope : this,
													params : {
														pid : parentPanel.id
													},
													success : function(response, options) {
														var result = Ext.decode(response.responseText);
														var data1 = result.body_hetml;
														p.update(data1);
													}
												});
											}
										}
									}, resultGrid , {
										layout : 'fit',
										width : '20%',
										region : 'east',
										style : 'overflow:auto;',
										autoScroll : true,
										id : REEastPanelId,
										hidden : true,
										listeners : {
											afterrender : function(p){
												Ext.Ajax.request({
													url : '/ExternalItems/haiwaizhishigongxiang/getgxsj.jcp',
													method : 'post',
													scope : this,
													params : {
														pid : parentPanel.id
													},
													success : function(response, options) {
														var result = Ext.decode(response.responseText);
														var data1 = result.right_hetml;
														p.update(data1);
													}
												});
											}
										}
									}]
								}]
					}]
			}
		});
		parentPanel.add(mainPanel);
		parentPanel.doLayout();
	}
}