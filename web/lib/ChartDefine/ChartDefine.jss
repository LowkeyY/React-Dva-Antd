Ext.namespace("lib.ChartDefine");

lib.ChartDefine.ChartDefine = function(params, mainPanel, isQueryDefine, Chart,
		userDefine, defaultRageRow) {
	this.mainPanel = mainPanel;
	this.Chart = Chart;
	this.params = params;
	this.defaultRageRow = defaultRageRow;
	var ButtonArray = [];
	if (userDefine) {
		urlValue = '/lib/ChartDefine/CurveUserDefine.jcp';
	} else {
		urlValue = '/lib/ChartDefine/curvemag.jcp';
	}

	if (!isQueryDefine) {
		ButtonArray.push(new Ext.Toolbar.Button({
			text : '保存',
			icon : '/themes/icon/common/save.gif',
			cls : 'x-btn-text-icon  bmenu',
			disabled : false,
			state : 'create',
			scope : this,
			hidden : false,
			handler : function() {
				if (this.params['parent_id'] == null) {
					Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立图表定义'.loc());
				} else {
					var saveParams = this.params;

					if (!this.checkXAxisStart(this.curvemagForm.form
							.findField('xAxisStart').getValue()))
						return;

					var storeValue = [];
					var myGrid = this.columnForm;
					var allRecords = myGrid.store.getRange(0);

					if (!this.checkChart(myGrid.store, allRecords))
						return;

					// for (var i = 0; i < allRecords.length - 1; i++)
					for (var i = 0; i < allRecords.length; i++) {
						storeValue[i] = allRecords[i].data;
					}
					saveParams['fields'] = Ext.encode(storeValue);
					saveParams['parent_id'] = this.params.parent_id;
					saveParams['type'] = 'save';
					if (this.frm.isValid()) {
						this.frm.submit({
									url : '/lib/ChartDefine/curvemag.jcp',
									params : saveParams,
									method : 'post',
									scope : this,
									success : function(form, action) {
										if (Ext.isDefined(Chart)) {
											Chart.navPanel
													.getTree()
													.loadSubNode(
															action.result.id,
															Chart.navPanel.clickEvent);
										}
										Ext.msg("info", '完成图表信息保存!'.loc());
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'数据提交失败!,原因:'.loc()
																+ '<br>'
																+ action.result.message);
									}
								});
					} else {
						Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
					}
				}
			}
		}));
		ButtonArray.push(new Ext.Toolbar.Button({
					text : '清空'.loc(),
					icon : '/themes/icon/xp/clear.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					state : 'create',
					scope : this,
					hidden : false,
					handler : function() {
						this.frm.reset();
						this.columnForm.clearAll();
					}
				}));

		ButtonArray.push(new Ext.Toolbar.Button({
			text : '保存'.loc(),
			icon : '/themes/icon/xp/save.gif',
			cls : 'x-btn-text-icon  bmenu',
			disabled : false,
			state : 'edit',
			scope : this,
			hidden : true,
			handler : function() {
				if (this.params['parent_id'] == null) {
					Ext.msg("error", '不能完成保存操作!,必须选择一应用下建立图表定义'.loc());
				} else {
					var saveParams = this.params;

					if (!this.checkXAxisStart(this.curvemagForm.form
							.findField('xAxisStart').getValue()))
						return;

					var storeValue = [];
					var myGrid = this.columnForm;
					var allRecords = myGrid.store.getRange(0);
					if (allRecords < 1) {
						Ext.msg("warn", '至少要有一个Y轴!'.loc());
						return false;
					}

					if (!this.checkChart(myGrid.store, allRecords))
						return;

					// for (var i = 0; i < allRecords.length - 1; i++)
					for (var i = 0; i < allRecords.length; i++)
						storeValue[i] = allRecords[i].data;
					saveParams['fields'] = Ext.encode(storeValue);

					saveParams['parent_id'] = this.params.parent_id;
					saveParams['chart_id'] = this.curvemagForm.form
							.findField('chart_id').getValue();
					saveParams['type'] = 'update';
					if (this.frm.isValid()) {
						this.frm.submit({
									url : '/lib/ChartDefine/curvemag.jcp',
									params : saveParams,
									method : 'post',
									scope : this,
									success : function(form, action) {
										Chart.navPanel.getTree().loadSelfNode(
												action.result.id,
												Chart.navPanel.clickEvent);
										Ext.msg("info", '完成图表信息更新!'.loc());
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'数据提交失败!,原因:'.loc()
																+ '<br>'
																+ action.result.message);
									}
								});
					} else {
						Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
					}
				}
			}
		}));
		ButtonArray.push(new Ext.Toolbar.Button({
			text : '删除'.loc(),
			icon : '/themes/icon/xp/delete.gif',
			cls : 'x-btn-text-icon  bmenu',
			disabled : false,
			state : 'edit',
			scope : this,
			hidden : true,
			handler : function() {
				Ext.msg('confirm', '警告:删除图表定义将不可恢复,确认吗?'.loc(),
						function(answer) {
							if (answer == 'yes') {
								var delParams = this.params;
								delParams['type'] = 'delete';
								delParams['chart_id'] = this.curvemagForm.form
										.findField('chart_id').getValue();
								this.frm.submit({
									url : '/lib/ChartDefine/curvemag.jcp',
									params : delParams,
									method : 'POST',
									scope : this,
									success : function(form, action) {
										if (Ext.isDefined(Chart)) {
											Chart.navPanel
													.getTree()
													.loadParentNode(Chart.navPanel.clickEvent);
										}
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'数据提交失败!,原因:'.loc()
																+ '<br>'
																+ action.result.message);
									}
								});
							}
						}.createDelegate(this));
			}
		}));
		ButtonArray.push(new Ext.Toolbar.Button({
			text : '预览'.loc(),
			icon : '/themes/icon/all/chart_bar.gif',
			cls : 'x-btn-text-icon  bmenu',
			disabled : false,
			state : 'edit',
			scope : this,
			hidden : true,
			handler : function(btn) {
				var isDirty = false;
				var cResult = this.curvemagForm.cResult;
				this.curvemagForm.form.items.each(function(item) {
							var nm = item.name || item.hiddenName;
							if (item.isVisible())
								if (Ext.isDefined(nm)
										&& Ext.isDefined(cResult[nm])
										&& (String(cResult[nm]) !== String(item
												.getValue()))) {
									// alert("item.name="+nm+"
									// String(cResult[nm])="+String(cResult[nm])+"
									// String(item.getValue())="+String(item.getValue()));
									isDirty = true;
									return false;
								}
						});

				var st = this.columnForm.getStore();
				var count = st.getCount();
				if (count > 1) {
					// var last = st.getCount() - 1;
					var last = st.getCount();
					st.each(function(rec) {
								if (last-- > 0 && rec.modified != null) {
									isDirty = true;
									return false;
								}
							});
				} else if (count < 1) {
					Ext.msg("warn", '至少要有一个Y轴!'.loc());
					return false;
				}

				if (isDirty) {
					Ext.msg("warn", '预览前请先保存!'.loc());
					return false;
				}
				Ext.Ajax.request({
					url : '/dev/chart/condition.jcp?objectId='
							+ this.params['object_id'] + '&' + Math.random(),
					method : 'POST',
					scope : this,
					success : function(response, options) {
						var check = response.responseText;
						check = check.replace(/xtitleList/ig, 'fieldLabel');
						var frameJSON = Ext.decode(check);
						var desktop = WorkBench.Desk.getDesktop();
						var popWidth = desktop.getViewWidth() - 100;
						var popHeight = desktop.getViewHeight() - 65;
						var showChart = function(chartId, params, size) {
							var exampleWindow = new Ext.Window({
										title : '图表预览'.loc(),
										layout : 'fit',
										width : popWidth,
										height : popHeight,
										plain : true,
										modal : true,
										bodyStyle : 'background-color:white;',
										buttons : [{
													text : '关闭'.loc(),
													scope : this,
													handler : function() {
														exampleWindow.close();
													}
												}]
									});
							var mod = CPM.getModule("ProgramChart");
							var p = {
								chartId : chartId,
								renderType : 'anychart'
							};
							if (params) {
								p.query = params;
							}
							exampleWindow.show();
							mod.load((popWidth - 40) + "," + (popHeight - 40),
									exampleWindow, p);
						}
						if (frameJSON.success) {
							if (frameJSON.searchEditor.editors
									&& frameJSON.searchEditor.editors.length > 0) {
								using("dev.chart.ParamsWindow");
								var paramsWin = new dev.chart.ParamsWindow(
										this.baseParams['object_id'],
										frameJSON, showChart);
								paramsWin.show();
							} else {
								showChart(this.baseParams['object_id']);
							}
						} else {
							Ext.msg("error", '数据删除失败!,原因:'.loc() + '<br>'
											+ frameJSON.message);
						}
					}
				});
			}
		}));
	}
	this.dataSource = new lib.ComboRemote.ComboRemote({
				fieldLabel : '选择查询'.loc(),
				hiddenName : 'query_id',
				width : 180,
				hidden : isQueryDefine,
				store : new Ext.data.JsonStore({
							url : '/lib/ChartDefine/getSource.jcp',
							root : 'items',
							autoLoad : true,
							fields : ["text", "value"],
							baseParams : {
								object_id : params.objectId,
								type : 'database'
							}
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				editable : false,
				mode : 'local'
			});

	var iForm1 = new Ext.form.FieldSet({
		title : '图设置'.loc(),
		layout : 'column',
		boxMinWidth : 860,
		height : 170,
		items : [{
			columnWidth : 0.33,
			layout : 'form',
			labelWidth : 150,
			border : false,
			items : [{
						xtype : 'textfield',
						fieldLabel : '图表名称'.loc(),
						name : 'Title',
						width : 180,
						maxLength : 100,
						// regex : /^[^\<\>\'\"\&]+$/,
						// regexText : "名称中不应有&,<,>,',\",字符",
						allowBlank : false,
						maxLengthText : '图表名称不能超过{0}个字符!'.loc(),
						blankText : '图标名称必须填写.'.loc()
					}, this.combineNum = new Ext.form.ComboBox({
								fieldLabel : '图表单元个数'.loc(),
								hiddenName : 'Combine_Num',
								width : 180,
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : [['1', '1'], ['2', '2'],
													['3', '3'], ['4', '4'],
													['5', '5'], ['6', '6'],
													['7', '7'], ['8', '8'],
													['9', '9'], ['10', '10']]
										}),
								valueField : 'value',
								displayField : 'text',
								triggerAction : 'all',
								editable : false,
								mode : 'local'
							}), {
						xtype : 'colorfield',
						fieldLabel : '内背景色'.loc(),
						name : 'Iner_Colorfield',
						width : 180,
						value : '#FFFFFF',
						allowBlank : true
					}, {
						xtype : 'checkboxgroup',
						fieldLabel : '显示格线'.loc(),
						name : 'checkGrid',
						width : 100,
						items : [{
									boxLabel : 'X',
									name : 'Grid_X',
									checked : true
								}, {
									boxLabel : 'Y',
									name : 'Grid_Y',
									checked : true
								}]
					}, {
						xtype : 'colorfield',
						fieldLabel : '格线颜色'.loc(),
						name : 'Border_Colorfield',
						width : 180,
						allowBlank : true,
						value : '#C0C0C0'
					}]
		}, {
			columnWidth : 0.33,
			layout : 'form',
			labelWidth : 150,
			border : false,
			items : [this.dataSource, {
				fieldLabel : '图类型'.loc(),
				hiddenName : 'plotType',
				name : 'plotType',
				width : 180,
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['CategorizedVertical', '垂直分类型'.loc()],
									['CategorizedHorizontal', '水平分类型'.loc()],
									['Scatter', 'X-Y数据型'.loc()]]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				mode : 'local',
				qtip : {
					title : '提示'.loc(),
					text : '垂直分类型:柱状图类型,'.loc() + '<br>' + '水平分类型:横杠图类型'.loc()
							+ ',(' + '相当于X轴在Y方向,Y轴在X方向'.loc() + ')<br>'
							+ 'X-Y数据型:X,Y数据都是数值型的图'.loc() + ',(x,y'
							+ '都是数值时可以使用,适用线'.loc() + '(' + '面积'.loc() + ')'
							+ '图,曲线'.loc() + '(' + '图面'.loc() + ')'
							+ '积图,气泡图,散点'.loc() + '(' + '标记'.loc() + ')'
							+ '图'.loc() + ')<br>'

				},
				xtype : 'combo',
				editable : false,
				value : 'CategorizedVertical'
			}, {
				xtype : 'radiogroup',
				fieldLabel : '纵轴相同比例'.loc(),
				hiddenName : 'same_scale',

				width : 150,
				items : [{
							boxLabel : '是'.loc(),
							name : 'same_scale',
							inputValue : 1
						}, {
							boxLabel : '否'.loc(),
							name : 'same_scale',
							inputValue : 0,
							checked : true
						}]
			}, {
				xtype : 'checkboxgroup',
				fieldLabel : '显示数据标签'.loc(),
				name : 'Is_Titled',
				width : 230,
				items : [{
							boxLabel : 'X',
							name : 'Is_Titled_X',
							checked : true
						}, {
							boxLabel : 'Y',
							name : 'Is_Titled_Y',
							checked : true
						}, {
							boxLabel : '附加'.loc(),
							name : 'Is_Titled_Z',
							checked : false
						}]
			}]

		}, {
			columnWidth : 0.34,
			layout : 'form',
			labelWidth : 150,
			border : false,
			items : [{
						xtype : 'numberfield',
						fieldLabel : '3D深度'.loc(),
						name : 'View3Ddepth',
						width : 180,
						maxValue : 10,
						maxText : '3d深度不可以大于{0},否则图表不能正常产生!'.loc(),
						qtip : {
							title : '提示',
							text : '当值等于0时显示二维效果,大于0时显示3维效果'.loc()
						},
						maxLength : 60,
						value : 0
					}, {
						fieldLabel : '叠合方式'.loc(),
						hiddenName : 'overlap',
						width : 180,
						store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [
									['0', '默认'.loc()],
									['1', '堆叠'.loc()],
									['2', '覆盖'.loc() + '(z' + '轴展开'.loc() + ')'],
									['3', '覆盖'.loc() + '(' + '排序'.loc() + ')'],
									['4', '百分比堆叠'.loc()]]
						}),
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						mode : 'local',
						qtip : {
							title : '提示'.loc(),
							text : '当一个单元内有两条曲线时'.loc() + '(' + '两个Y轴'.loc()
									+ '),' + '并且纵轴比例相同,两条曲线的叠合方式'.loc()
									+ '<br>' + '默认:正常方式,适用所有图类型,'.loc()
									+ '<br>' + '堆叠:曲线值相加,适用所有的有序型'.loc() + '('
									+ '柱状图,线图,面积图等'.loc() + '),<br>'
									+ '百分比堆叠:曲线值相加,适用所有的有序型'.loc() + '('
									+ '柱状图,线图,面积图等'.loc() + '),<br>'
									+ '覆盖'.loc() + '(' + 'z轴展开'.loc() + '):'
									+ '2维重叠,3维Z轴展开,适用柱状图,'.loc() + '<br>'
									+ '覆盖'.loc() + '(' + '排序'.loc() + '):'
									+ '2维排序重叠,3维排序Z轴展开,适用柱状图,气泡图,'.loc()
									+ '<br>'

						},
						xtype : 'combo',
						editable : false,
						value : '0'
					}, {
						xtype : 'numberfield',
						fieldLabel : '采样间隔(秒)'.loc(),
						hidden : isQueryDefine,
						name : 'sampleInterval',
						width : 180,
						minValue : -1,
						minText : '最小间隔不可以小于{0}'.loc(),
						qtip : {
							title : '提示'.loc(),
							text : '当值小于1时表示不进行动态采样,目前只有仪表盘,水平测量,垂直测量,温度计,折线,曲线支持这个参数'
									.loc()
						},
						maxLength : 60,
						value : 0
					}, {
						xtype : 'numberfield',
						fieldLabel : '动态保留样本数'.loc(),
						hidden : isQueryDefine,
						name : 'sampleRemain',
						width : 180,
						minValue : 1,
						minText : '最小样本数不可以小于{0}'.loc(),
						qtip : {
							title : '提示'.loc(),
							text : '只有动态chart支持这个参数,表示在动态chart中显示的点数'.loc()
						},
						maxLength : 60,
						value : 30
					}, {//
						xtype : 'hidden',
						name : 'chart_id'
					}]
		}]
	});

	var xTitle = new Ext.form.TextField({
				fieldLabel : 'X轴标题'.loc(),
				name : 'xTitle',
				width : 180,
				value : ''
			})

	var iForm2 = new Ext.form.FieldSet({
				title : 'X轴设置'.loc(),
				layout : 'column',
				boxMinWidth : 860,
				height : 120,
				items : [{
					columnWidth : 0.33,
					layout : 'form',
					labelWidth : 150,
					border : false,
					items : [{
						xtype : 'combo',
						fieldLabel : 'X值字段'.loc(),
						name : 'AxisXValue',
						width : 180,
						store : new Ext.data.JsonStore({
									root : 'items',
									fields : ["text", "value", "dataUnit"]
								}),
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						editable : false,
						mode : 'local',
						listeners : {
							select : function(comb, record) {
								var dataUnit = record.get("dataUnit");
								var val = this.getRawValue();
								if (val != "") {
									if (dataUnit != "")
										xTitle.setValue(val + "(" + dataUnit
												+ ")");
									else
										xTitle.setValue(val);
								}
							}
						}

					}, xTitle, {
						xtype : 'radiogroup',
						fieldLabel : '显示X轴'.loc(),
						hiddenName : 'showX',
						name : 'showX',
						ctype : 'radiogroup',
						width : 80,
						items : [{
									boxLabel : '是'.loc(),
									name : 'showX',
									inputValue : 1,
									checked : true
								}, {
									boxLabel : '否'.loc(),
									name : 'showX',
									inputValue : 0
								}]
					}]
				}, {
					columnWidth : 0.33,
					layout : 'form',
					labelWidth : 150,
					border : false,
					items : [this.xAxisStart = new Ext.form.ComboBox({
								fieldLabel : 'X轴起始值'.loc(),
								hiddenName : 'xAxisStart',
								width : 180,
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : [
													['DefaultValue',
															'默认值'.loc()],
													['MinValue', '最小值'.loc()],
													['0', '零值'.loc()]]
										}),
								valueField : 'value',
								displayField : 'text',
								triggerAction : 'all',
								// regex:/^(DefaultValue)|(MinValue)|(-?\d+)(\.\d+)?$/,
								// regexText:"只能输入数字(如:200.0),",
								mode : 'local',
								xtype : 'combo',
								value : 'DefaultValue'
							}), {
						xtype : 'radiogroup',
						fieldLabel : '刻度标记'.loc(),
						hiddenName : 'tickmarksPlacement',
						name : 'tickmarksPlacement',
						ctype : 'radiogroup',
						width : 150,
						items : [{
									boxLabel : '两边'.loc(),
									name : 'tickmarksPlacement',
									inputValue : "Between",
									checked : true
								}, {
									boxLabel : '中间'.loc(),
									name : 'tickmarksPlacement',
									inputValue : "Center"
								}]
					}, {
						xtype : 'numberfield',
						fieldLabel : 'X轴坐标角度'.loc(),
						name : 'xAxisAngle',
						width : 180,
						maxValue : 360,
						maxText : 'X轴坐标角度不可以大于{0},否则图表不能正常产生!'.loc(),
						qtip : {
							title : '提示'.loc(),
							text : '角度值大于0,小于360'.loc()
						},
						maxLength : 60,
						value : 0
					}]
				}, {
					columnWidth : 0.34,
					layout : 'form',
					labelWidth : 150,
					border : false,
					items : [this.dataFormat = new Ext.form.ComboBox({
								fieldLabel : 'X轴坐标格式'.loc(),
								hiddenName : 'AxisXFormat',
								width : 180,
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : [
													['0', '不显示'.loc()],
													['20', '字符'.loc()],
													['1', '小数'.loc()],
													[
															'2',
															'货币'.loc() + '('
																	+ '元'.loc()
																	+ ')'],
													['3', '科学记数'.loc()],
													['4', '百分率'.loc()],
													['5', '整数'.loc()],
													['6', '日期时间'.loc()]]
										}),
								valueField : 'value',
								displayField : 'text',
								triggerAction : 'all',
								qtip : {
									title : '选择提示'.loc(),
									text : '选择字符则原样显示,'.loc() + '<br>'
											+ '选择日期型时查询必须输出'.loc()
											+ '"yyyy/mm/dd"'
											+ '格式数据才能正确解析,'.loc() + '<br>'
											+ '选择小数,默认保留小数点后两位'.loc()
								},
								value : '20',
								editable : false,
								mode : 'local'
							}), this.dateTimeFormat = new Ext.form.ComboBox({
								fieldLabel : '日期时间格式'.loc(),
								hiddenName : 'DateTimeFormat',
								width : 180,
								store : new Ext.data.SimpleStore({
											fields : ['text'],
											data : [
													['%HH:%mm:%ss'],
													['%yyyy/%MM%dd %HH:%mm:%ss'],
													['%yyyy'], ['%yyyy%MM'],
													['%yyyy%MM%dd'],
													['%yyyy/%MM']]
										}),
								valueField : 'text',
								displayField : 'text',
								triggerAction : 'all',
								qtip : {
									title : '选择提示'.loc(),
									text : '选择字符则原样显示,'.loc() + '<br>'
											+ '选择日期型时查询必须输出'.loc()
											+ '"yyyy/mm/dd"'
											+ '格式数据才能正确解析,'.loc() + '<br>'
											+ '选择小数,默认保留小数点后两位'.loc()
								},
								value : '%yyyy%MM%dd',
								editable : true,
								mode : 'local'
							}), {
						xtype : 'radiogroup',
						fieldLabel : 'X轴类型'.loc(),
						hiddenName : 'xAxisType',
						name : 'xAxisType',
						ctype : 'radiogroup',
						width : 160,
						items : [{
									boxLabel : '线性'.loc(),
									name : 'xAxisType',
									inputValue : 'Linear',
									checked : true
								}, {
									boxLabel : '对数'.loc(),
									name : 'xAxisType',
									inputValue : 'Logarithmic'
								}]
					}]
				}]
			});
	var legendColumns = new Ext.form.NumberField({
				fieldLabel : '图例列数'.loc(),
				name : 'legendColumns',
				width : 180,
				qtip : {
					title : '提示'.loc(),
					text : '图例显示的列数'.loc()
				},
				maxLength : 60,
				value : 1
			});

	var legendAlign = new Ext.form.ComboBox({
				xtype : 'combo',
				fieldLabel : '图例定位'.loc(),
				hiddenName : 'legendAlign',
				width : 180,
				hidden : false,
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['Near', '近'.loc()], ['Far', '远'.loc()],
									['Center', '中间'.loc()],
									['Spread', '展开'.loc()]]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				value : 'Near',
				editable : false,
				mode : 'local'
			});

	var legendAnchor = new Ext.form.ComboBox({
				xtype : 'combo',
				fieldLabel : '锚位'.loc(),
				hiddenName : 'legendAnchor',
				width : 180,
				hidden : true,
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['LeftTop', '左上'.loc()],
									['CenterTop', '中上'.loc()],
									['RightTop', '右上'.loc()],
									['RightBottom', '右下'.loc()],
									['CenterBottom', '中下'.loc()],
									['LeftBottom', '左下'.loc()],
									['Center', '中间'.loc()]]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				value : 'RightTop',
				editable : false,
				mode : 'local'
			});

	iForm3 = new Ext.form.FieldSet({
				title : '显示图例'.loc(),
				boxMinWidth : 860,
				checkboxToggle : true,
				checkboxName : 'legendShow',
				name : 'legendShow',
				hiddenName : 'legendShow',
				layout : 'column',
				collapsed : true,
				listeners : {
					"beforeexpand" : function() {
						legendColumns.focus(false, 100);

					}
				},
				items : [{
					columnWidth : 0.33,
					layout : 'form',
					labelWidth : 150,
					border : false,
					items : [{
						xtype : 'combo',
						fieldLabel : '图例位置'.loc(),
						hiddenName : 'legendPosition',
						width : 180,
						store : new Ext.data.SimpleStore({
									fields : ['value', 'text'],
									data : [['Left', '左'.loc()],
											['Right', '右'.loc()],
											['Top', '上'.loc()],
											['Bottom', '下'.loc()],
											['Float', '浮动'.loc()]]
								}),
						listeners : {
							"select" : function(cb, record, index) {
								if (cb.getValue() == 'Float') {
									legendAlign.hide();
									legendAnchor.show();

								} else {
									legendAlign.show();
									legendAnchor.hide();
								}
							}
						},
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						value : 'Right',
						editable : false,
						mode : 'local'
					}, legendAlign, legendAnchor]
				}, {
					columnWidth : 0.33,
					layout : 'form',
					labelWidth : 150,
					border : false,
					items : [{
								xtype : 'radiogroup',
								fieldLabel : '图例在图内'.loc(),
								hiddenName : 'legendInside',
								name : 'legendInside',
								ctype : 'radiogroup',
								width : 120,
								items : [{
											boxLabel : '是'.loc(),
											name : 'legendInside',
											inputValue : 'true'
										}, {
											boxLabel : '否'.loc(),
											name : 'legendInside',
											inputValue : 'false',
											checked : true
										}]
							}, {
								xtype : 'radiogroup',
								fieldLabel : '图例对齐方式'.loc(),
								hiddenName : 'legendAlignBy',
								name : 'legendAlignBy',
								ctype : 'radiogroup',
								width : 130,
								items : [{
											boxLabel : '图内'.loc(),
											name : 'legendAlignBy',
											inputValue : 'Dataplot',
											checked : true
										}, {
											boxLabel : '图'.loc(),
											name : 'legendAlignBy',
											inputValue : 'Chart'
										}]
							}]
				}, {
					columnWidth : 0.34,
					layout : 'form',
					border : false,
					labelWidth : 150,
					items : legendColumns
				}]

			})
	this.curvemagForm = new Ext.form.FormPanel({
				labelAlign : 'right',
				url : '/lib/ChartDefine/curvemag.jcp',
				method : 'POST',
				region : 'north',
				border : false,
				height : 375,
				autoScroll : true,
				monitorResize : true,
				split : true,
				bodyStyle : 'padding:5px 10px 0px 10px;background:#FFFFFF;',
				items : [iForm1, iForm2, iForm3],
				tbar : (ButtonArray.length > 0) ? ButtonArray : undefined
			});
	this.curvemagForm.on("beforedestroy", function(fm) {
				delete fm.cResult;
			})

	this.combineNum.on('select', function() {
				if (this.columnForm.rendered) {
					var max = this.combineNum.getValue() * 1 + 1;
					var items = new Array();
					for (var i = 1; i < max; i++) {
						items.push({
									"text" : i + '单元'.loc(),
									"value" : i
								});
					}
					// this.columnForm.editors[0].field.store.loadData({
					var cm = this.columnForm.getColumnModel();
					cm.getCellEditor(0, 0).field.store.loadData({
								items : items
							});
				}
			}, this);

	this.dataSource.on('select', function() {
		var types = this.dataSource.getValue();
		Ext.Ajax.request({
			url : '/lib/ChartDefine/getSource.jcp',
			method : 'POST',
			scope : this,
			params : {
				type : 'yvalue',
				query_id : types
			},
			success : function(response, options) {
				var result = Ext.decode(response.responseText);
				var AxisXValue = this.curvemagForm.form.findField('AxisXValue');
				AxisXValue.store.loadData(result);

				if (this.columnForm.rendered) {
					// this.columnForm.editors[7].field.store.loadData(result);
					// this.columnForm.editors[8].field.store.loadData(result);
					var cm = this.columnForm.getColumnModel();
					cm.getCellEditor(7, 0).field.store.loadData(result);
					cm.getCellEditor(8, 0).field.store.loadData(result);
				}
			}
		});

	}, this);

	var editMode = false;
	this.columnForm = new lib.ChartDefine.ChartColumnEditor(editMode,
			this.params, this.curvemagForm, this.defaultRageRow);

	this.MainTabPanel = new Ext.Panel({
				layout : 'border',
				border : false,
				name : 'chartPanel',
				monitorResize : true,
				items : [this.curvemagForm, this.columnForm]
			});

	this.frm = this.curvemagForm.form;
};

lib.ChartDefine.ChartDefine.prototype = {
	checkXAxisStart : function(type) {
		var re = /^(DefaultValue)$|^(MinValue)$|^(-?\d+)(\.|\d+)?$/;
		var result = re.test(type);
		if (!result)
			Ext.msg("error", '只能输入数字(如:100 , 100.0, -100. 等).'.loc());
		return (result);
	},

	checkChart : function(store, recode) {
		var chartType = new Array();
		var i = 0;
		var unitId, unitStatus = 0;

		store.each(function(recode) {
					chartType[i] = recode.get('TYPE_ID');
					unitId = recode.get('UNIT_ID');

					if (unitId > 1) {
						switch (chartType[i] * 1) {
							case 30 :
								Ext.msg("error", '当单元中图表类型是仪表盘时,'.loc()
												+ '<br>' + '单元数不能有大于1!'.loc());
								unitStatus = -1;
								break;
							case 31 :
								Ext.msg("error", '当单元中图表类型是水平测量图时,'.loc()
												+ '<br>' + '单元数不能有大于1!'.loc());
								unitStatus = -1;
								break;
							case 32 :
								Ext.msg("error", '当单元中图表类型是垂直测量图时,'.loc()
												+ '<br>' + '单元数不能有大于1!'.loc());
								unitStatus = -1;
								break;
							case 33 :
								Ext.msg("error", '当单元中图表类型是温度计时,'.loc()
												+ '<br>' + '单元数不能有大于1!'.loc());
								unitStatus = -1;
								break;
							default :
								break;
						}
					}
					i++;
				});

		if (unitStatus == -1) {
			return false;
		}

		var typeId = new Array("10", "11", "17", "18", "20", "5", "13", "30",
				"31", "32", "33");
		for (i = 0; i < typeId.length; i++) {
			var ido = this.isMatch(chartType, typeId[i], unitId);

			if (ido == 1) {
				return true;
				break;
			} else if (ido == -1) {
				return false;
				break;
			}
		}

		return true;
	},

	isMatch : function(chartType, type, unitId) {
		// var k = chartType.length - 1;
		var k = chartType.length;
		var j = 0;
		for (var i = 0; i < k; i++) {
			if (chartType[i] == type) {
				j++;
			}
		}
		if (j != 0) {
			switch (type) {
				case "10" :
					Ext.msg("error", '曲面图还不能使用,请选择其它类型的图!'.loc());
					return -1;
					break;
				case "11" :
					Ext.msg("error", '雷达图还不能使用,请选择其它类型的图!'.loc());
					return -1;
					break;
				case "17" :
					Ext.msg("error", 'K线还不能使用,请选择其它类型的图!'.loc());
					return -1;
					break;
				case "18" :
					Ext.msg("error", '等值线还不能使用,请选择其它类型的图!'.loc());
					return -1;
					break;
				case "20" :
					Ext.msg("error", '甘特图还不能使用,请选择其它类型的图!'.loc());
					return -1;
					break;
				default :
					break;
			}
		}

		if (j == k) {
			return 1;
		} else if (j == 0) {
			return 0;
		} else { // (i != 0 && j != 0)
			switch (type) {
				case "5" :
					Ext.msg("error", '当单元中图表类型是饼图时,'.loc() + '<br>'
									+ '不能有其它类型的图和它一起画!'.loc());
					break;
				case "13" :
					Ext.msg("error", '当单元中图表类型是圆环图时,'.loc() + '<br>'
									+ '不能有其它类型的图和它一起画!'.loc());
					break;
				case "30" :
					Ext.msg("error", '当单元中图表类型是仪表盘时,'.loc() + '<br>'
									+ '不能有其它类型的图和它一起画!'.loc());
					break;
				case "31" :
					Ext.msg("error", '当单元中图表类型是水平测量图时,'.loc() + '<br>'
									+ '不能有其它类型的图和它一起画!'.loc());
					break;
				case "32" :
					Ext.msg("error", '当单元中图表类型是垂直测量图时,'.loc() + '<br>'
									+ '不能有其它类型的图和它一起画!'.loc());
					break;
				case "33" :
					Ext.msg("error", '当单元中图表类型是温度计时,'.loc() + '<br>'
									+ '不能有其它类型的图和它一起画!'.loc());
					break;
			}
			return -1;
		}
	},

	init : function(params) {
		this.params = params;
		this.dataSource.store.baseParams.object_id = params.parent_id;
		this.toggleToolBar('create');
		this.curvemagForm.form.reset();

		// this.columnForm.reset();
		delete this.columnForm.cResult;
		if (typeof(this.mainPanel != "undefined"))
			this.mainPanel.setStatusValue(['图表管理'.loc(), params.parent_id]);
		Ext.Ajax.request({
					url : '/lib/ChartDefine/curvemag.jcp',
					method : 'PUT',
					scope : this,
					callback : function(options, success, response) {
						if (!success) {
							var msg = CPM.getResponeseErrMsg(response);
							Ext.msg("info", '获取图表类型错误.'.loc() + msg);
							return;
						}

						var res = response.responseText;
						if (res && success) {
							var cm = this.columnForm.getColumnModel();

							cm.getCellEditor(1, 0).field.store.loadData(Ext
									.decode(res));
							// this.columnForm.editors[1].field.store.loadData(Ext
							// .decode(res));
						}
					}
				});
	},
	loadData : function(params) {
		this.params = params;
		this.baseParams = params;
		this.curvemagForm.load({
					// url : '/lib/ChartDefine/curvemag.jcp?parent_id='
					url : urlValue + '?parent_id=' + params.parent_id
							+ "&prg_id=" + params.prg_id + "&objectId="
							+ params.objectId + "&ra=" + Math.random(),
					method : 'GET',
					scope : this,
					success : function(frm, action) {
						var data = action.result.data;
						this.curvemagForm.form.items.each(function(item) {
									if (item.name == 'Is_Titled') {
										item.setValue([data.Is_Titled_X,
												data.Is_Titled_Y,
												data.Is_Titled_Z]);
									}
									if (item.name == 'checkGrid') {
										item.setValue([data.GridX, data.GridY]);
									}
									if (item.hiddenName == 'legendPosition') {
										item.setValue(data.legendPosition);
										item.fireEvent('select', item);
									}

								});

						if (data.legendShow == 'true') {
							var items = this.curvemagForm.find('checkboxName',
									'legendShow');
							if (items.length > 0)
								items[0].expand(false);

						}

						this.toggleToolBar('edit');
						if (Ext.isDefined(this.mainPanel)) {
							this.mainPanel.setStatusValue(['图表管理'.loc(),
									params.parent_id, data.lastModifyName,
									data.lastModifyTime]);
						}
						data = action.result.extra;
						var cm = this.columnForm.getColumnModel();
						cm.getCellEditor(0, 0).field.store.loadData(data.units);
						cm.getCellEditor(1, 0).field.store
								.loadData(data.typeEditor);
						cm.getCellEditor(7, 0).field.store
								.loadData(data.yvalue);
						cm.getCellEditor(8, 0).field.store
								.loadData(data.yvalue);
						/*
						 * this.columnForm.editors[0].field.store
						 * .loadData(data.units);
						 * this.columnForm.editors[1].field.store
						 * .loadData(data.typeEditor);
						 * this.columnForm.editors[7].field.store
						 * .loadData(data.yvalue);
						 * this.columnForm.editors[8].field.store
						 * .loadData(data.yvalue);
						 */
						this.curvemagForm.form.items.each(function(item) {
									if (item.name == 'AxisXValue') {
										item.store.loadData(data.yvalue);
									}
								});
						var st = this.columnForm.getStore();
						st.fireEvent("beforeload");
						st.loadData(data.chartColumn);
						delete data.chartColumn;

						this.curvemagForm.cResult = action.result.data;
					}
				});
	},
	toggleToolBar : function(state) {
		var tempToolBar = this.curvemagForm.getTopToolbar();
		if (Ext.isDefined(tempToolBar)) {
			tempToolBar.items.each(function(item) {
						item.hide();
					}, tempToolBar.items);
			tempToolBar.items.each(function(item) {
						if (item.state == state)
							item.show();
					}, tempToolBar.items);
		}
	}
};

lib.ChartDefine.ChartColumnEditor = function(viewMode, params, curvemagForm,
		defaultRageRow) {
	this.params = params;
	var fm = Ext.form;

	var decimalEditor = new fm.NumberField({
				allowBlank : true,
				style : 'text-align:left;ime-mode:disabled;'
			});

	var yFormatEditor = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : [{
										name : 'id',
										type : 'string'
									}, 'text'],
							data : [['0', '不显示'.loc()], ['20', '字符'.loc()],
									['1', '小数'.loc()], ['2', '货币元'.loc()],
									['3', '科学记数'.loc()], ['4', '百分率'.loc()],
									['5', '整数'.loc()], ['6', '日期时间'.loc()]]
						}),
				valueField : 'id',
				displayField : 'text',
				triggerAction : 'all',
				value : '20',
				editable : false,
				mode : 'local'
			});

	var yValueEditor = new Ext.form.ComboBox({
		allowBlank : false,
		store : new Ext.data.JsonStore({
					root : 'items',
					fields : ["text", "value", "dataUnit"]
				}),
		valueField : 'value',
		displayField : 'text',
		blankText : 'Y值字段必须选择!'.loc(),
		triggerAction : 'all',
		listWidth : 200,
		autoLoad : false,
		clearTrigger : false,
		scope : this,
		listeners : {
			select : function(comb, record) {
				var dataUnit = record.get("dataUnit");
				var val = this.getRawValue();
				var xval = curvemagForm.form.findField("AxisXValue").getValue();
				if (this.getValue() == xval) {
					Ext.msg("warn", this.getRawValue()
									+ ' 已经作为了X轴字段,请选择其它字段作为Y轴!'.loc());
					this.setValue("");
					return;
				}
				if (val != "") {
					if (dataUnit != "")
						pnameField.setValue(val + "(" + dataUnit + ")");
					else
						pnameField.setValue(val);
					yLegendTitle.setValue(pnameField.getValue());
				}
				/*
				 * if (val != "") pnameField.setValue(val);
				 */
			}
		},
		editable : false,
		mode : 'local'
	});

	var lrrc = lib.RowEditorGrid.RowEditorGrid.ComboBoxRenderer;

	var attValueEditor = new Ext.form.ComboBox({
		name : 'attValueEditor',
		store : new Ext.data.JsonStore({
					root : 'items',
					fields : ["text", "value"]
				}),
		valueField : 'value',
		displayField : 'text',
		listWidth : 200,
		triggerAction : 'all',
		autoLoad : false,
		clearTrigger : false,
		scope : this,
		listeners : {
			select : function() {
				var val = this.getRawValue();
				var xval = curvemagForm.form.findField("AxisXValue").getValue();
				if (this.getValue() == xval) {
					Ext.msg("warn", this.getRawValue()
									+ ' 已经作为了X轴字段,请选择其它字段作为附加字段!'.loc());
					this.setValue("");
					return;
				}

				/*
				 * if (val != "") pnameField.setValue(val);
				 */
			}
		},
		editable : false,
		mode : 'local'
	});
	var unitID = new Ext.form.ComboBox({
				id : 'unitID',
				allowBlank : true,
				store : new Ext.data.JsonStore({
							root : 'items',
							fields : ["text", "value"]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				editable : false,
				mode : 'local'
			});

	var typeEditor = new Ext.form.ComboBox({
				id : 'typeEditor',
				allowBlank : false,
				store : new Ext.data.JsonStore({
							root : 'items',
							fields : ["text", "value"]
						}),
				valueField : 'value',
				displayField : 'text',
				blankText : '请选择图表类型'.loc(),
				triggerAction : 'all',
				editable : false,
				mode : 'local'
			});

	var yPos = new Ext.form.ComboBox({
				allowBlank : true,
				store : new Ext.data.SimpleStore({
							fields : ["value", "text"],
							data : [['0', '左'.loc()], ['2', '右'.loc()], ['1', '不显示'.loc()]]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				editable : false,
				mode : 'local'
			});

	/*
	 * var startValue = new Ext.form.ComboBox({ allowBlank : true, store : new
	 * Ext.data.SimpleStore({ fields : ["value", "text"], data : [['0', '0值'],
	 * ['', '最小值']] }), valueField : 'value', displayField : 'text',
	 * triggerAction : 'all', clearTrigger : false, mode : 'local' });
	 */

	var startValue = new Ext.form.TextField({
				height : 20,
				allowBlank : true
			});

	var maxValue = new Ext.form.TextField({
				height : 20,
				allowBlank : true,
				emptyText : '自动计算'.loc()
			});

	var yFormat = new Ext.form.ComboBox({
				allowBlank : true,
				store : new Ext.data.SimpleStore({
							fields : ["value", "text"],
							data : [['0', '线性'.loc()], ['1', '对数'.loc()]]
						}),
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				editable : false,
				mode : 'local'
			});

	var colorEdit = new lib.ColorField.ColorField({
				name : 'dolor_id',
				width : 120,
				allowBlank : true
			});

	var lnameField = new fm.TextField({
				height : 20,
				allowBlank : false,
				blankText : '逻辑名称必须填写'.loc()
			});

	var yLegendTitle = new fm.TextField({});
	var pnameField = new fm.TextField({});

	var cm = new Ext.grid.ColumnModel({
		defaults : {
			sortable : false,
			menuDisabled : true
		},

		columns : [{
					header : '单元'.loc(),
					dataIndex : 'UNIT_ID',
					width : 60,
					renderer : lrrc(unitID),
					editor : unitID
				}, {
					header : '图表类型'.loc(),
					width : 130,
					dataIndex : 'TYPE_ID',
					renderer : lrrc(typeEditor),
					editor : typeEditor
				}, {
					header : '起始值'.loc(),
					dataIndex : 'yAxisStart',
					width : 100,
					// renderer : lrrc(startValue),
					editor : startValue
				}, {
					header : '最大值'.loc(),
					dataIndex : 'yAxisMax',
					width : 100,
					editor : maxValue
				}, {
					header : 'Y轴类型'.loc(),
					dataIndex : 'yAxisType',
					width : 60,
					renderer : lrrc(yFormat),
					editor : yFormat
				}, {
					header : 'Y轴标签格式'.loc(),
					dataIndex : 'AXISYFORMAT',
					width : 90,
					renderer : lrrc(yFormatEditor),
					editor : yFormatEditor
				}, {
					header : '位置'.loc(),
					dataIndex : 'AXIS_POSITION',
					width : 40,
					renderer : lrrc(yPos),
					editor : yPos
				}, {
					header : 'Y值字段'.loc(),
					dataIndex : 'AXISYVALUE',
					width : 100,
					renderer : lrrc(yValueEditor),
					editor : yValueEditor
				}, {
					header : '附加字段'.loc(),
					dataIndex : 'ATT_AXIS',
					width : 100,
					renderer : lrrc(attValueEditor),
					editor : attValueEditor
				}, {
					header : 'Y轴标题'.loc(),
					dataIndex : 'yAxisTitle',
					width : 200,
					editor : pnameField
				}, {
					id : 'name',
					header : '图例名称'.loc(),
					dataIndex : 'yLegendTitle',
					width : 120,
					editor : yLegendTitle
				}, {
					header : '系列颜色'.loc(),
					dataIndex : 'SERIES_COLOR',
					width : 100,
					renderer : function(val) {
						return '<div style="float:left;margin-left:3px;">'
								+ val
								+ '</div><div style="width:10px;height:9px;background-color:'
								+ val
								+ ';border:solid 1px #C0C0C0;float:left;margin-left:10px;">&nbsp;</div>'
					},
					editor : colorEdit
				}]
	});

	/*
	 * var ColumnPanel = new lib.RowEditorGrid.ListInput({ autoExpandColumn :
	 * 'name', autoScroll : true, border : false, defaultRageRow
	 * :defaultRageRow, cm : cm, clicksToEdit : 1, frame : false, selModel : new
	 * Ext.grid.CheckboxSelectionModel(), stripeRows : true, minSize : 180,
	 * contrlColumnWidth : 40, draggable : false, enableHdMenu : false,
	 * defaultValue : { yAxisStart : 0 }, region : 'center', store : new
	 * Ext.data.JsonStore({ root : 'items', fields : ['SERIES_ID', 'UNIT_ID',
	 * 'AXISYFORMAT', 'TYPE_ID', 'yAxisMax', 'AXISYVALUE', 'ATT_AXIS',
	 * 'AIXS_POSITION', 'SERIES_COLOR', 'SERIES_TITLE', "yAxisStart",
	 * "yAxisType"] }) });
	 */

	loadcss("Ext.ux.grid.RowEditor");
	using("Ext.ux.grid.RowEditor");
	var editor = new Ext.ux.grid.RowEditor({
				saveText : '更新'.loc(),
				cancelText : ' 取消 '.loc()
			});

	var store = new Ext.data.JsonStore({
				root : 'items',
				fields : ['SERIES_ID', 'UNIT_ID', 'AXISYFORMAT', 'TYPE_ID',
						'yAxisMax', 'AXISYVALUE', 'ATT_AXIS', 'AXIS_POSITION',
						'SERIES_COLOR', 'yAxisTitle', "yAxisStart",
						"yAxisType", "yLegendTitle"]
			})

	var row = Ext.data.Record.create([{
				name : 'SERIES_ID',
				type : 'string'
			}, {
				name : 'UNIT_ID',
				type : 'string'
			}, {
				name : 'AXISYFORMAT',
				type : 'string'
			}, {
				name : 'TYPE_ID',
				type : 'string'
			}, {
				name : 'yAxisMax',
				type : 'string'
			}, {
				name : 'AXISYVALUE',
				type : 'string'
			}, {
				name : 'ATT_AXIS',
				type : 'string'
			}, {
				name : 'AXIS_POSITION',
				type : 'string'
			}, {
				name : 'SERIES_COLOR',
				type : 'string'
			}, {
				name : 'yAxisTitle',
				type : 'string'
			}, {
				name : 'yAxisStart',
				type : 'string'
			}, {
				name : 'yAxisType',
				type : 'string'
			}, {
				name : 'yLegendTitle',
				type : 'string'
			}]);

	// 生成随机颜色
	function randomColor() {
		var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
		if (rand.length == 6) {
			return '#' + rand;
		} else {
			return '#' + randomColor();
		}
	}

	var ColumnPanel = new Ext.grid.GridPanel({
		cm : cm,
		store : store,
		width : 1000,
		region : 'center',
		margins : '0 5 5 5',
		// autoExpandColumn : 'name',
		plugins : [editor],
		enableColumnResize : true,
		enableColumnMove : false,
		enableDragDrop : true, // 拖拽行
		ddGroup : 'GridDD',

		// ddText: '{0} selected row{1}',

		/*
		 * view: new Ext.grid.GroupingView({ markDirty: false }),
		 */
		tbar : [{
					iconCls : 'icon-user-add',
					text : '添加Y轴'.loc(),
					handler : function() {
						var e = new row({
									SERIES_ID : "1",
									UNIT_ID : '1',
									TYPE_ID : '6',
									yAxisStart : '0',
									yAxisMax : '自动计算'.loc(),
									yAxisType : '0',
									AXISYFORMAT : '1',
									AXIS_POSITION : '0',
									AXISYVALUE : '',
									ATT_AXIS : '',
									yAxisTitle : '',
									SERIES_COLOR : randomColor(),
									yLegendTitle : ''
								});
						editor.stopEditing();
						store.insert(0, e);
						ColumnPanel.getView().refresh();
						ColumnPanel.getSelectionModel().selectRow(0);
						editor.startEditing(0);
					}
				}, {
					ref : '../removeBtn',
					iconCls : 'icon-user-delete',
					text : '删除Y轴'.loc(),
					disabled : true,
					handler : function() {
						editor.stopEditing();
						var s = ColumnPanel.getSelectionModel().getSelections();
						for (var i = 0, r; r = s[i]; i++) {
							store.remove(r);
						}
					}
				}]
	});

	ColumnPanel.on("render", function() {
		var drops = new Ext.dd.DropTarget(ColumnPanel.getEl(), {
			ddGroup : 'GridDD',
			copy : false,
			notifyDrop : function(dd, e, data) {
				var rows = data.selections;
				// 拖动到第几行
				var index = dd.getDragData(e).rowIndex;
				if (typeof(index) == "undefined") {
					return;
				}

				// 修改store
				for (i = 0; i < rows.length; i++) {
					var rowData = rows[i];
					if (!this.copy)
						store.remove(rowData);

					if (index == 0) {
						rowData.data.orderNum -= 1;
					} else if (index == store.data.items.length) {
						rowData.data.orderNum = store.data.items[index - 1].data.orderNum
								+ 1;
					} else {
						rowData.data.orderNum = (store.data.items[index - 1].data.orderNum + store.data.items[index].data.orderNum)
								/ 2
					}
					store.insert(index, rowData);
				}
			}
		});

	}, ColumnPanel);

	ColumnPanel.getSelectionModel().on('selectionchange', function(sm) {
				ColumnPanel.removeBtn.setDisabled(sm.getCount() < 1);

			});

	return ColumnPanel;

};
