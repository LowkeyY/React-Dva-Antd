Ext.namespace("dev.quality");

dev.quality.QualityDataList = function(params) {
	this.params = params;
}

dev.quality.QualityDataList.prototype = {
	show : function() {
		Ext.Ajax.request({
					url : '/dev/quality/QualityDataList.jcp',
					method : 'POST',
					params : this.params,
					scope : this,
					success : function(response, options) {
						var me = this;
						var result = Ext.decode(response.responseText);
						result.cm.unshift(new Ext.grid.RowNumberer());
						var store = new Ext.data.JsonStore({
									url : '/dev/quality/QualityDataList.jcp',
									fields : result.fields,
									totalProperty : 'totalNumber',
									baseParams : this.params,
									data : result,
									root : 'data'
								});
						var cm = new Ext.grid.ColumnModel({
									columns : result.cm,
									defaultSortable : true

								});

						var pagingBar = new Ext.PagingToolbar({
									pageSize : 50,
									store : store,
									displayInfo : true,
									displayMsg : "{0}-{1}条 共:{2}条".loc(),
									emptyMsg : "没有数据".loc()

								});
						var ButtonArray=[];
						
						var recurJson =	function(json){
							var colItems = [];
							var items = [];
							var itemTotal = 1;
							for(var i in json){
								if(typeof json[i]=="object"){ 
									recurJson(json[i]); 
								}else{
									var tempArr = i.split(":",4);//alert(i);
									var colname = tempArr[0];
									var isPrimaryKey = tempArr[1];
									var isErrorData = tempArr[2];//alert(colname+"------"+isPrimaryKey+"----"+isErrorData);
									var dis = true;
									if(isPrimaryKey == 0)
										dis = false;
									if(isErrorData == 1 || isPrimaryKey == 1){//alert(111);
										colItems.push({
											columnWidth:0.50,
											layout: 'form',
											border:false,
											disabled:dis,
											items:new Ext.form.TextField ({
												fieldLabel: cm.getColumnHeader(cm.getIndexById(i)),
												name: colname,
												value:json[i]
											})
										});
										if(itemTotal%2==0){
											items.push({
												layout: 'column',
												border:false,
												items:colItems
											});
											colItems = [];
										}
										itemTotal++;
									}
								}
							}
							//alert(itemTotal);
							if(itemTotal%2==0){
								items.push({
									layout: 'column',
									border:false,
									items:colItems
								});
							}
							return items;
						}
						ButtonArray.push(new Ext.Toolbar.Button({
									btnId:'update',
									text: '修改'.loc(),
									icon: '/themes/icon/common/save.gif',
									cls: 'x-btn-text-icon  bmenu',
									disabled:false,
									hidden : false,
									scope: this,
									handler : function(){
												var rec = me.grid.getSelectionModel().getSelected().data;
												//Ext.msg("warn",Ext.decode(rec));
												if (typeof(rec) == 'undefined') {
													Ext.msg("warn", "请选择一行数据.".loc());
													return false;
												}
												var params = {
													fields : rec,
													param : me.params,
													items : recurJson(rec)
												};
												using("dev.quality.ModifyData");
												var modifyData = new dev.quality.ModifyData(params);
												modifyData.show();
												win.close();
									}
						}));
						this.grid = new Ext.grid.GridPanel({
									store : store,
									cm : cm,
									tbar : ButtonArray,
									bbar : pagingBar
								});
						store.loadData(result);
						var win = new Ext.Window({
									title : '查看数据'.loc(),
									modal : true,
									layout : 'fit',
									width : WorkBench.Desk.getDesktop()
											.getViewWidth()
											* 0.8,
									height : WorkBench.Desk.getDesktop()
											.getViewHeight()
											* 0.8,
									buttons : [{
												text : '关闭'.loc(),
												handler : function() {
													win.close();
												}
											}],
									items : me.grid

								});
						Ext.getBody().unmask();
						win.show();
					}
				});
	}
}