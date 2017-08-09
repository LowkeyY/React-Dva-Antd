Ext.namespace("dev.statistics");
dev.statistics.quanzhandianjiliang = function(tabWidth) {
	alert(0);
	var today = new Date();

	var ds = new Ext.data.JsonStore({
				method : 'GET',
				url : '/dev/statistics/quanzhandianjiliang.jcp',
				root : 'authArray',
				fields : ["riqi", "pv", "pvbili", "uv", "ip"],
				remoteSort : true
			});
	ds.load({
				params : {
					'startdate' : today.add(Date.DAY, -7).format('Y/m/d'),
					'enddate' : today.format('Y/m/d')
				}
			});

	var toolbar = new Ext.Toolbar({
				width : "100%",
				items : [{xtype: 'tbspacer' , width : 4} , '开始时间:', {xtype: 'tbspacer'} , {
							xtype : 'datefield',
							id : 'startdate',
							fieldLabel : '开始日期',
							name : 'startdate',
							format : 'Y/m/d',
							emptyText : today.add(Date.DAY, -7),
							value : today.add(Date.DAY, -7)
						}, {xtype: 'tbspacer'} ,'-', {xtype: 'tbspacer'} , '结束时间:', {xtype: 'tbspacer'} , {
							xtype : 'datefield',
							fieldLabel : '结束日期',
							id : 'enddate',
							name : 'enddate',
							format : 'Y/m/d',
							altFormats : 'm,d,Y|m.d.Y',
							emptyText : today,
							value : today
						}, {xtype: 'tbspacer'} ,'-', {xtype: 'tbspacer'} , new Ext.Button({
									text : '确定',
									id : 'qd',
									handler : function() {
										creattu(ds)
									}
						})]
			});
	var height = (Ext.getBody().getHeight() - 83) * .55 , tupianId = Ext.id() , colWidth = tabWidth / ds.fields.length , panl = new Ext.Panel({
				layout: 'border',
				tbar : toolbar,
				items : [{
					height : height,
					region: 'north',
					id : tupianId,
					html : '载入中..'
				}, {
					region: 'center',
					xtype : 'grid',
					store : ds,
					columnLines : true,
					closable : false,
					border : true,
					viewConfig : {
						forceFit : true
					},
					frame : false,
					columns : [{
								header : "日期",
								width : colWidth,
								dataIndex : "riqi",
								sortable : false
							}, {
								header : "PV",
								width : colWidth,
								dataIndex : "pv",
								sortable : false
							}, {
								header : "PV比例",
								width : colWidth,
								dataIndex : "pvbili",
								sortable : false
							}, {
								header : "UV",
								width : colWidth,
								dataIndex : "uv",
								sortable : false
							}, {
								header : "IP",
								width : colWidth,
								dataIndex : "ip",
								sortable : false
							}]
				}
			]
		})
	

	Ext.Ajax.request({
		url : '/dev/statistics/quanzhandianjiliangtu.jcp',
		params : {
			'startdate' : today.add(Date.DAY, -7).format('Y/m/d'),
			'enddate' : today.format('Y/m/d')
		},
		scope : this,
		method : 'Post',
		success : function(response, options) {

			var check = response.responseText;
			var ajaxResult = Ext.util.JSON.decode(check);
			var list = ajaxResult.authArray;

			var xml = '<anychart> 	<settings> 		<animation enabled="True"/> 	</settings>   <charts>     <chart plot_type="CategorizedVertical">     	<chart_settings>     		<title>     			<text>全站访问量统计</text>     			<background enabled="false"/>     		</title>     		<axes>     			<x_axis tickmarks_placement="Center">     				<labels display_mode="Stager"/>     			</x_axis>     		</axes>     	</chart_settings>     	<data_plot_settings default_series_type="Spline">     		<line_series>     			<tooltip_settings enabled="true"> <format> 时间: {%Name} pv数量: {%YValue} </format>     			</tooltip_settings>     			<line_style>     				<line thickness="3"/> 	    		</line_style>     		</line_series>     	</data_plot_settings> 	    <data> 			<series name="Series 1"> 			 ';

			for (var i = 0; i < list.length; i++) {
				xml += "<point name=\"" + list[i].name + "\" y=\""
						+ list[i].value + "\"/>"
			}
			xml += '			  			</series> 							    </data>     </chart>   </charts> </anychart> 						';

			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = height;
			this.chartSample.setData(xml);
			this.chartSample.write(tupianId);

		}
	}, this);

	function creattu(ds) {
		var today = new Date();
		var startdate = Ext.getCmp('startdate').getRawValue();
		var enddate = Ext.getCmp('enddate').getRawValue();
		ds.load({
					params : {
						'startdate' : startdate,
						'enddate' : enddate
					}
				});

		Ext.Ajax.request({
			url : '/dev/statistics/quanzhandianjiliangtu.jcp',
			params : {
				'startdate' : startdate,
				'enddate' : enddate
			},
			scope : this,
			method : 'Post',
			success : function(response, options) {

				var check = response.responseText;
				var ajaxResult = Ext.util.JSON.decode(check);
				var list = ajaxResult.authArray;

			var xml = '<anychart> 	<settings> 		<animation enabled="True"/> 	</settings>   <charts>     <chart plot_type="CategorizedVertical">     	<chart_settings>     		<title>     			<text>全站访问量统计</text>     			<background enabled="false"/>     		</title>     		<axes>     			<x_axis tickmarks_placement="Center">     				<labels display_mode="Stager"/>     			</x_axis>     		</axes>     	</chart_settings>     	<data_plot_settings default_series_type="Spline">     		<line_series>     			<tooltip_settings enabled="true"> <format> 时间: {%Name} pv数量: {%YValue} </format>     			</tooltip_settings>     			<line_style>     				<line thickness="3"/> 	    		</line_style>     		</line_series>     	</data_plot_settings> 	    <data> 			<series name="Series 1"> 			 ';

				for (var i = 0; i < list.length; i++) {
					xml += "<point name=\"" + list[i].name + "\" y=\""
							+ list[i].value + "\"/>"
				}
				xml += '			  			</series> 							    </data>     </chart>   </charts> </anychart> 						';

				this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
				this.chartSample.width = '100%';
				this.chartSample.height = height;
				this.chartSample.setData(xml);
				this.chartSample.write(tupianId);

			}
		}, this);
	}
	return panl;
}
