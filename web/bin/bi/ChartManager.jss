using("lib.CachedPanel.CachedPanel");
using("lib.ComboRemote.ComboRemote");
using("lib.ChartDefine.ChartDefine");
using("lib.ColorField.ColorField");
Ext.namespace("bin.bi");
bin.bi.ChartManager = function(params){
	
	var desktop=WorkBench.Desk.getDesktop();
//	var width=desktop.getViewWidth()/1.2;
//	var height=desktop.getViewHeight()/1.2;
	var width=1100; 
	var height=600;
	this.ChartDefineForm = new lib.ChartDefine.ChartDefine(params, undefined,true, undefined,false,true);
	this.definePanel = this.ChartDefineForm.MainTabPanel;
	this.definePanel.cached = true;
	this.ButtonArray = [];
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '打印'.loc(),
				icon : '/themes/icon/xp/print.gif',
				cls : 'x-btn-text-icon  bmenu',
				hidden : true,
				scope : this,
				handler : function(btn) {
					this.viewPanel.chart.printChart();
				}
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '返回设定页'.loc(),
				icon : '/themes/icon/all/arrow_undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				hidden : true,
				scope : this,
				handler : function(btn) {
					this.ButtonArray[0].hide();
					this.ButtonArray[1].hide();
					this.ButtonArray[2].show();
					this.win.setSize(width, height);
					this.cachePanel.setActiveTab(this.definePanel);
				}

			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '绘制图表'.loc(),
				icon : '/themes/icon/all/chart_bar.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : this.windowConfirm
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '关闭'.loc(),
				icon : '/themes/icon/xp/close.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function() {
					this.win.close();
				}
			}));

	this.viewPanel = new Ext.Panel({
		layout : 'fit',
	                      name:'viewPanel',
	                      monitorResize: true,
								listeners: {
        				"resize": function() {
        					
        					if(this.haveInit){
        						/*
          						this.chart.hide();
        						this.chart.remove();
        						var chart = new AnyChart("/lib/chart/AnyChart.swf");
        						this.chart=chart;*/
        						var chart=this.chart;
								var bx = this.getBox();
								chart.width = bx.width;
								chart.height = bx.height;
//								alert("aaaee"+this.res);
							//	chart.setData(this.res);
								chart.setData.defer(50,chart,[this.res]);
								chart.write(this.body.dom);
//					chart.setSize(chart.width,chart.height); //setSize 一用出错
//			alert("width="+bx.width+"height="+ bx.height);

        					}
        				}
					},
		cached : true 
	});

	
	this.cachePanel = new lib.CachedPanel.CachedPanel({
				statusBar:true,
				statusConfig : {
					  hidden : true
								},
				items : [this.definePanel, this.viewPanel]
			});
	this.cachePanel.setActiveTab(this.definePanel);

	this.win = desktop.getWindow('ChartDefineFrame');

    if(!this.win){
		this.win = desktop.createWindow({
				id: 'ChartDefineFrame',
				title : '绘图设置'.loc(),
				width : width,
				height : height,
				layout : 'fit',
				plain : true,
				modal : true,
				border : false,
				items : this.cachePanel,
				constrain:true,
				monitorResize:true,
				buttons : this.ButtonArray
		});
    };
 
	this.win.show();
};

bin.bi.ChartManager.prototype = {  
	
	load : function(chartSet, params) {
//		this.win.show();
		this.params = params; 
		this.chartSet = chartSet;
		var frm = this.ChartDefineForm.curvemagForm.form;
		var colForm = this.ChartDefineForm.columnForm;
		function toJSON(array) {
			var items = [];
			Ext.each(array, function(t) {
						items.push({
									text : t[0],
									value : t[1],
									dataUnit:t[2]
								});
					})
			return {
				items : items
			};
		}
		var colArray = toJSON(chartSet.chartColArray);
		frm.findField("AxisXValue").store.loadData(colArray);
		var cm =colForm.getColumnModel();

   		cm.getCellEditor(1,0).field.store.loadData({
					"items" : [{
								"text" : '折线'.loc(),
								"value" : 1
							}, {
								"text" : '柱状图'.loc(),
								"value" : 2
							}, {
								"text" : '面积图'.loc(),
								"value" : 3
							}, {
								"text" : '散点图'.loc(),
								"value" : 4
							}, {
								"text" : '饼图'.loc(),
								"value" : 5
							}, {
								"text" : '曲线'.loc(),
								"value" : 6
							}, {
								"text" : '阶梯图'.loc(),
								"value" : 8
							}, {
								"text" : '圆柱图'.loc(),
								"value" : 12
							}, {
								"text" : '圆环图'.loc(),
								"value" : 13
							}, {
								"text" : '棱锥图'.loc(),
								"value" : 14
							},  {
								"text" : '气泡图'.loc(),
								"value" : 15
							}, {
								"text" : '区间图'.loc(),
								"value" : 16
							}, {
								"text" : '面积图'.loc()+'('+'曲线'.loc()+')',
								"value" : 19
							},  {
								"text" : '区间图'.loc()+'('+'曲线'.loc()+')',
								"value" : 21
							}, {
								"text" : '仪表盘'.loc(),
								"value" : 30
							}, {
								"text" : '水平测量'.loc(),
								"value" : 31
							}, {
								"text" : '垂直测量'.loc(),
								"value" : 32
							}, {
								"text" : '温度计'.loc(),
								"value" : 33
							}]
				});
		cm.getCellEditor(8,0).field.store.loadData(colArray);
		cm.getCellEditor(7,0).field.store.loadData(colArray);
		cm.getCellEditor(0,0).field.store.loadData(toJSON(chartSet.unitArray));
	/*	colForm.editors[8].field.store.loadData(colArray);
		colForm.editors[7].field.store.loadData(colArray);
		colForm.editors[0].field.store.loadData(toJSON(chartSet.unitArray));*/

		colForm.getStore().fireEvent("beforeload");
		colForm.getStore().loadData({
			items : chartSet.chartColumn
		});
		
		frm.setValues(chartSet);
		frm.items.each(function(item) {
					if (item.name == 'Is_Titled') {
						item.setValue([true,true,false]);
					}
		});
//		this.win.show();
	},
	windowConfirm : function() {
		var st = this.ChartDefineForm.columnForm.getStore();
		var recs = st.getRange(0);
		
		if (!this.ChartDefineForm.checkChart(st, recs)){
			return;
		}

//		this.cachePanel.setActiveTab(this.viewPanel);

		this.ButtonArray[0].show();
		this.ButtonArray[1].show();
		this.ButtonArray[2].hide();
		this.cachePanel.setActiveTab(this.viewPanel);
//		 inner = this.viewPanel;

		if (!this.viewPanel.haveInit) {
			var chart = new AnyChart("/lib/chart/AnyChart.swf");
			var bx = this.viewPanel.getBox();
			this.viewPanel.chart = chart;
			chart.wMode = "transparent"; 
			chart.width = bx.width;

			chart.addEventListener('create', function() {
						if (this.viewPanel.fn) {
							this.viewPanel.fn();
						} else {
							this.viewPanel.created = true;
						}
					});
            this.viewPanel.created = true;
			chart.height = bx.height;
			chart.waitingForDataText = '数据载入中...'.loc();
			chart.write(this.viewPanel.body.dom);
			this.viewPanel.haveInit = true;

		}

		var arr = [];
//		for (var i = 0, recs = st.getRange(0); i < recs.length - 1; i++) {
		for (var i = 0; i < recs.length; i++) {
			var d = recs[i].data;
			arr.push({
						seriesId : i,
						chartType : d.TYPE_ID,
						yAxisFormat : d.AXISYFORMAT,
						yAxisValue : d.AXISYVALUE,
						yAxisPosition : d.AXIS_POSITION,
						yAxisTitle : d.yAxisTitle,
						yLegendTitle: d.yLegendTitle,
						yAxisColor : d.SERIES_COLOR,      
						yAxisType : d.yAxisType,
						yAxisStart : d.yAxisStart,
						unitId : d.UNIT_ID,
						attAxisValue : d.ATT_AXIS,
						yAxisMax :  d.yAxisMax
					});
		}
		var frm = this.ChartDefineForm.frm;
		
		var legendShow="false";
		var items=this.ChartDefineForm.curvemagForm.find('checkboxName','legendShow');
		if(items.length>0){
			if(!items[0].collapsed){
				legendShow="true";
			}
		}
		
		var pp = Ext.apply(this.params, {
					queryId:this.chartSet['query_id'],
					Title:frm.findField("Title").getValue(),
					Combine_Num:frm.findField("Combine_Num").getValue(),
					xAxisValue:frm.findField("AxisXValue").getValue(),
					xAxisFormat:frm.findField("AxisXFormat").getValue(),
					xAxisStart:frm.findField("xAxisStart").getValue(),
					view3DDepth:frm.findField("View3Ddepth").getValue(),
					sampleInterval:frm.findField("sampleInterval").getValue(),
					sameScale:frm.findField("same_scale").getValue(),
					innerColor:frm.findField("Iner_Colorfield").getValue(),
					gridColor:frm.findField("Border_Colorfield").getValue(),
					dataTooltip:frm.findField("Is_Titled").getValue(),
					showGrid:frm.findField("checkGrid").getValue(),
					sampleRemain:frm.findField("sampleRemain").getValue(),
					yOverlap:frm.findField("overlap").getValue(),
					xAxisShow:frm.findField("showX").getValue(),
					xAxisAngle:frm.findField("xAxisAngle").getValue(),
					dateTimeFormat:this.ChartDefineForm.dateTimeFormat.getValue(),
					xAxisType:frm.findField("xAxisType").getValue(),
					xTitle:frm.findField("xTitle").getValue(),
					legendShow:legendShow,
					legendColumns:frm.findField("legendColumns").getValue(),
					legendPosition:frm.findField("legendPosition").getValue(),
					legendAlign:frm.findField("legendAlign").getValue(),
					legendAnchor:frm.findField("legendAnchor").getValue(),
					legendInside:frm.findField("legendInside").getValue(),
					legendAlignBy:frm.findField("legendAlignBy").getValue(),
					series : Ext.encode(arr)
				}); 
 
		Ext.Ajax.request({
					url : '/bin/bi/chartview.jcp',
					form : frm.getEl(),
					params : pp,
					method : 'POST',
					scope : this,
					callback : function(options, success, response) {
						if (!success) {
							var msg = CPM.getResponeseErrMsg(response);
							Ext.msg("info", '获取图表错误.'.loc() + msg);
							return;
						}
						var res = response.responseText;
						if (res && success) {
							var result = Ext.decode(res);
							res = result.xmlString;
							this.viewPanel.res=res;
							if (this.viewPanel.created) {
								try {
									this.viewPanel.chart.setData.defer(50,this.viewPanel.chart,[this.viewPanel.res]);
								} catch (e) {
									Ext.msg("error", '数据逻辑错误,无法绘制图表'.loc());
								}
							} else {
								this.viewPanel.fn = function() {
									try {
										this.viewPanel.chart.setData(this.viewPanel.res);
									} catch (e) {
										Ext.msg("error", '数据逻辑错误,无法绘制图表'.loc());
									}
									delete this.viewPanel.fn;
								}
							}
						}
					}
				});
	}
};
