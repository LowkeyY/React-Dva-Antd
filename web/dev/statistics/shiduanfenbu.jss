Ext.namespace("dev.statistics");

dev.statistics.shiduanfenbu = function(tabWidth) {
	alert("shiduanfenbu");
	var today = new Date();

	var ds = new Ext.data.JsonStore({
				method : 'GET',
				url : '/dev/statistics/shiduanfenbu.jcp',
				root : 'authArray',
				fields : ["shijian", "pv", "ip", "shijianjian"],
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
							id : 'startdate1',
							fieldLabel : '开始日期',
							name : 'startdate1',
							// The value matches the format; will be parsed and
							// displayed using that format.
							format : 'Y/m/d',
							emptyText : today.add(Date.DAY, -7),
							value : today.add(Date.DAY, -7)
						}, '结束时间', {
							xtype : 'datefield',
							fieldLabel : '结束日期',
							id : 'enddate1',
							name : 'enddate1',
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
										creattu1(ds)
									}
								})]
			});
	var colWidth = tabWidth / 3;

	var grid = new Ext.grid.GridPanel({
				region: 'center',
				store : ds,
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
							header : "时间",
							width : colWidth,
							dataIndex : "shijian",
							sortable : false
						}, {
							header : "PV",
							width : colWidth,
							dataIndex : "pv",
							sortable : false
						}, {
							header : "IP",
							width : colWidth,
							dataIndex : "ip",
							sortable : false
						}]
			});

	var tupianId = Ext.id();
	var tupan = new Ext.Panel({
				region: 'north',
				id : tupianId,
				heigth : "60%"
			})

	var panl = new Ext.Panel({
				layout: 'border',
				tbar : toolbar,
				items : [tupan, grid]
			})

	Ext.Ajax.request({
		url : '/dev/statistics/shiduanfenbu.jcp',
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

			var xml = '<anychart> 	<settings> 		<animation enabled="True"/> 	</settings> 	<charts> 		<chart plot_type="CategorizedVertical"> 			<data_plot_settings default_series_type="Bar"> 				<bar_series point_padding="0.2" group_padding="1"> 					<tooltip_settings enabled="true"/> 				</bar_series> 			</data_plot_settings> 			<chart_settings> 				<title enabled="true"> 					<text>时段分布</text> 				</title> 			</chart_settings> 			<data> 								<series name="Series 1"> ';

			for (var i = 0; i < list.length; i++) {
				xml += "<point name=\"" + list[i].shijianjian + "\" y=\""
						+ list[i].pv + "\"/>"
			}

			xml += '</series> 							</data> 		</chart> 	</charts> </anychart>'

			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write(tupianId);

		}
	}, this);

	return panl;

	function creattu1(ds) {
		var today = new Date();
		var startdate1 = Ext.getCmp('startdate1').getRawValue();
		var enddate1 = Ext.getCmp('enddate1').getRawValue();
		ds.load({
					params : {
						'startdate' : startdate1,
						'enddate' : enddate1
					}
				});

		Ext.Ajax.request({
			url : '/dev/statistics/shiduanfenbu.jcp',
			params : {
				'startdate' : startdate1,
				'enddate' : enddate1
			},
			scope : this,
			method : 'Post',
			success : function(response, options) {

				var check = response.responseText;
				var ajaxResult = Ext.util.JSON.decode(check);
				var list = ajaxResult.authArray;

				var xml = '<anychart> 	<settings> 		<animation enabled="True"/> 	</settings> 	<charts> 		<chart plot_type="CategorizedVertical"> 			<data_plot_settings default_series_type="Bar"> 				<bar_series point_padding="0.2" group_padding="1"> 					<tooltip_settings enabled="true"/> 				</bar_series> 			</data_plot_settings> 			<chart_settings> 				<title enabled="true"> 					<text>时段分布</text> 				</title> 			</chart_settings> 			<data> 								<series name="Series 1"> ';

				for (var i = 0; i < list.length; i++) {
					xml += "<point name=\"" + list[i].shijianjian + "\" y=\""
							+ list[i].pv + "\"/>"
				}

				xml += '</series> 							</data> 		</chart> 	</charts> </anychart>'

				this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
				this.chartSample.width = '100%';
				this.chartSample.height = '60%';
				this.chartSample.setData(xml);
				this.chartSample.write(tupianId);

			}
		}, this);
	}

}
