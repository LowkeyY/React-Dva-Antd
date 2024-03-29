Ext.namespace("dev.statistics");
dev.statistics.yuyantongji = function(tabWidth) {

	var today = new Date();

	var ds = new Ext.data.JsonStore({
				method : 'GET',
				url : '/dev/statistics/yuyantongji.jcp',
				root : 'authArray',
				fields : ["xitong", "pv", "pvbili","uv","ip"],
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
				items : ['开始时间', {
							xtype : 'datefield',
							id : 'startdate4',
							fieldLabel : '开始日期',
							name : 'startdate4',
							// The value matches the format; will be parsed and
							// displayed using that format.
							format : 'Y/m/d',
							emptyText : today.add(Date.DAY, -7),
							value : today.add(Date.DAY, -7)
						}, '结束时间', {
							xtype : 'datefield',
							fieldLabel : '结束日期',
							id : 'enddate4',
							name : 'enddate4',
							// The value does not match the format, but does
							// match an altFormat; will be parsed
							// using the altFormat and displayed using the
							// format.
							format : 'Y/m/d',
							altFormats : 'm,d,Y|m.d.Y',
							emptyText : today,
							value : today
						}, new Ext.Button({
									text : '确定',
									id : 'qd',
									handler : function() {
										creattu3(ds)
									}
								})]
			});
	var colWidth = tabWidth / ds.fields.length;
	var grid = new Ext.grid.GridPanel({
				store : ds,
				height : 200,
				width : tabWidth,
				columnLines : true,
				closable : false,
				border : true,
				viewConfig : {
					forceFit : true
				},
				frame : false,
				enableDragDrop : true,
				columns : [{
							header : "语言",
							width : colWidth,
							dataIndex : "xitong",
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
			});

	var tupan = new Ext.Panel({
				id : "sample4",
				heigth : "60%"
			})

	var panl = new Ext.Panel({
				tbar : toolbar,
				items : [tupan, grid],
				heigth : "40%"
			})
	

	Ext.Ajax.request({
		url : '/dev/statistics/yuyantongji.jcp',
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

				var xml = '<anychart> 	<settings> 		<animation enabled="True"/> 	</settings>   <charts>     <chart plot_type="CategorizedVertical">     	<chart_settings>     		<title>     			<text>语言统计</text>     			<background enabled="false"/>     		</title>     		<axes>     			<x_axis tickmarks_placement="Center">     				<labels display_mode="Stager"/>     			</x_axis>     		</axes>     	</chart_settings>     	<data_plot_settings default_series_type="Spline">     		<line_series>     			<tooltip_settings enabled="true"> <format> 语言: {%Name} pv数量: {%YValue} </format>     			</tooltip_settings>     			<line_style>     				<line thickness="3"/> 	    		</line_style>     		</line_series>     	</data_plot_settings> 	    <data> 			<series name="Series 1"> 			 ';

			for (var i = 0; i < list.length; i++) {
				xml += "<point name=\"" + list[i].xitong + "\" y=\""
						+ list[i].pv + "\"/>"
			}
			xml += '			  			</series> 							    </data>     </chart>   </charts> </anychart> 						';

			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write('sample4');

		}
	}, this);

	function creattu3(ds) {
		var today = new Date();
		var startdate4 = Ext.getCmp('startdate4').getRawValue();
		var enddate4 = Ext.getCmp('enddate4').getRawValue();
		ds.load({
					params : {
						'startdate' : startdate4,
						'enddate' : enddate4
					}
				});

		Ext.Ajax.request({
			url : '/dev/statistics/yuyantongji.jcp',
			params : {
				'startdate' : startdate4,
				'enddate' : enddate4
			},
			scope : this,
			method : 'Post',
			success : function(response, options) {

				var check = response.responseText;
				var ajaxResult = Ext.util.JSON.decode(check);
				var list = ajaxResult.authArray;

				var xml = '<anychart> 	<settings> 		<animation enabled="True"/> 	</settings>   <charts>     <chart plot_type="CategorizedVertical">     	<chart_settings>     		<title>     			<text>语言统计</text>     			<background enabled="false"/>     		</title>     		<axes>     			<x_axis tickmarks_placement="Center">     				<labels display_mode="Stager"/>     			</x_axis>     		</axes>     	</chart_settings>     	<data_plot_settings default_series_type="Spline">     		<line_series>     			<tooltip_settings enabled="true"> <format> 语言: {%Name} pv数量: {%YValue} </format>     			</tooltip_settings>     			<line_style>     				<line thickness="3"/> 	    		</line_style>     		</line_series>     	</data_plot_settings> 	    <data> 			<series name="Series 1"> 			 ';

				for (var i = 0; i < list.length; i++) {
					xml += "<point name=\"" + list[i].xitong + "\" y=\""
							+ list[i].pv + "\"/>"
				}
				xml += '			  			</series> 							    </data>     </chart>   </charts> </anychart> 						';

				this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
				this.chartSample.width = '100%';
				this.chartSample.height = '60%';
				this.chartSample.setData(xml);
				this.chartSample.write('sample4');

			}
		}, this);

	}
	return panl;
}
