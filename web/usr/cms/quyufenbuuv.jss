Ext.namespace("usr.cms");
usr.cms.quyufenbuuv=function(){
	

	Ext.apply(usr.cms.quyufenbuuv.prototype,{
		
		load:function(framePanel, parentPanel, param, prgInfo){
			
		var todayuv=new Date();

		
		var dsuv=new Ext.data.JsonStore({
					method: 'GET',
					url : '/usr/cms/quyufenbu.jcp?startdate='+todayuv.add(Date.DAY, -7).format('Y/m/d')+'&enddate='+todayuv.format('Y/m/d'),
					root : 'authArray',
					fields : ["name", "pv", "pvbili","uv","ip"],
					remoteSort : true,
					autoLoad:true
		});
		
		var toolbaruv=new Ext.Toolbar({
		width:"100%",
		items: ['开始时间',{
        xtype: 'datefield',
        id:'startdateuv',
        fieldLabel: '开始日期',
        name: 'startdateuv',
        // The value matches the format; will be parsed and displayed using that format.
        format: 'Y/m/d', 
        emptyText:todayuv.add(Date.DAY, -7),
        value: todayuv.add(Date.DAY, -7)
    }, '结束时间',{
        xtype: 'datefield',
        fieldLabel: '结束日期',
        id:'enddateuv',
        name: 'enddateuv',
        // The value does not match the format, but does match an altFormat; will be parsed
        // using the altFormat and displayed using the format.
        format: 'Y/m/d',
        altFormats: 'm,d,Y|m.d.Y',
        emptyText:todayuv,
        value:todayuv
    },new Ext.Button({  
                text : '确定',
                id:'qduv',
                handler:function(){creattuuv(dsuv)}
            }) ]});
    	
    	
		
		
		
var griduv = new Ext.grid.GridPanel({
    	store: dsuv,
    	height:200,
    	id:'griduv',
        columnLines: true,
        closable: false,
		border:true,
		viewConfig: {
			forceFit: true
		},
		frame:false,
        enableDragDrop:true,
        columns:[
        	{header:"名称",width:100,dataIndex:"name",sortable: false},
        	{header:"PV",width:50,dataIndex:"pv",sortable: false},
        	{header:"PV比例",width:100,dataIndex:"pvbili",sortable: false},
        	{header:"UV1",width:50,dataIndex:"uv",sortable: false},
        	{header:"IP",width:50,dataIndex:"ip",sortable: false}
        ]
        });  
			
        var tupanuv=new Ext.Panel({
        	id:"sampleuv",
        	heigth:"60%"
        })
        

    	var panluv=new Ext.Panel({
    		id:"panluv",
			tbar:toolbaruv,
			items:[tupanuv,griduv]
		})
		
		parentPanel.add(panluv);
		parentPanel.doLayout();
			
		
		Ext.Ajax.request({
									url : '/usr/cms/quyufenbu.jcp',
									params : {
										'startdate':todayuv.add(Date.DAY, -7).format('Y/m/d'),'enddate':todayuv.format('Y/m/d')
									},
									scope : this,
									method : 'Post',
									success : function(response, options) {
										
										var check=response.responseText;
										var ajaxResult = Ext.util.JSON.decode(check);
										var list = ajaxResult.authArray;
										
									
										var xml='<anychart> 	<settings> 		<animation enabled="True"/> 	</settings> 	<charts> 		<chart plot_type="CategorizedVertical"> 			<data_plot_settings default_series_type="Bar"> 				<bar_series point_padding="0.2" group_padding="1"> 					<tooltip_settings enabled="true"/> 				</bar_series> 			</data_plot_settings> 			<chart_settings> 				<title enabled="true"> 					<text>区域分布</text> 				</title> 			</chart_settings> 			<data> 								 ';
											
										
										
										xml+=' <series name="UV">	';
										for(var i=0;i<list.length;i++){
											xml+="<point name=\""+list[i].name+"\" y=\""+list[i].uv+"\"/>"
										}
										
										xml+='</series></data> 		</chart> 	</charts> </anychart>'
				
						
									
			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write('sampleuv');
									
									}
								}, this);
			
         
		
		}
	});
	
	function creattuuv(dsuv){
			var todayuv=new Date();
			var startdate=Ext.getCmp('startdateuv').getRawValue();
			var enddate=Ext.getCmp('enddateuv').getRawValue();
			dsuv.load({params:{'startdate':startdate,'enddate':enddate}});
			
			Ext.Ajax.request({
									url : '/usr/cms/quyufenbu.jcp',
									params : {
										'startdate':startdate,'enddate':enddate
									},
									scope : this,
									method : 'Post',
									success : function(response, options) {
										
										var check=response.responseText;
										var ajaxResult = Ext.util.JSON.decode(check);
										var list = ajaxResult.authArray;
										
									
										var xml='<anychart> 	<settings> 		<animation enabled="True"/> 	</settings> 	<charts> 		<chart plot_type="CategorizedVertical"> 			<data_plot_settings default_series_type="Bar"> 				<bar_series point_padding="0.2" group_padding="1"> 					<tooltip_settings enabled="true"/> 				</bar_series> 			</data_plot_settings> 			<chart_settings> 				<title enabled="true"> 					<text>区域分布</text> 				</title> 			</chart_settings> 			<data> 								';
											
										
										
										
										xml+='<series name="UV">	';
										for(var i=0;i<list.length;i++){
											xml+="<point name=\""+list[i].name+"\" y=\""+list[i].uv+"\"/>"
										}
										
										xml+='</series></data> 		</chart> 	</charts> </anychart>'
				
	    		
						
									
			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write('sampleuv');
									
									}
								}, this);
			
         
		
		
}
	
};