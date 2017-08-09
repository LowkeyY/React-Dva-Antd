Ext.namespace("usr.cms");
usr.cms.fangwenshendu=function(){
	

	Ext.apply(usr.cms.fangwenshendu.prototype,{
		
		load:function(framePanel, parentPanel, param, prgInfo){
			
		var today=new Date();

     
		
						
							
       
				
								
								
								
			

			
			
			
			
			
			
		
		var ds=new Ext.data.JsonStore({
					method: 'GET',
					url : '/usr/cms/fangwenshendu.jcp',
					root : 'authArray',
					fields : ["name", "count", "bili"],
					remoteSort : true
		});
			ds.load({params:{'startdate':today.add(Date.DAY, -7).format('Y/m/d'),'enddate':today.format('Y/m/d')}});
		
		var toolbar=new Ext.Toolbar({
		width:"100%",
		items: ['开始时间',{
        xtype: 'datefield',
        id:'startdate',
        fieldLabel: '开始日期',
        name: 'startdate',
        // The value matches the format; will be parsed and displayed using that format.
        format: 'Y/m/d', 
        emptyText:today.add(Date.DAY, -7),
        value: today.add(Date.DAY, -7)
    }, '结束时间',{
        xtype: 'datefield',
        fieldLabel: '结束日期',
        id:'enddate',
        name: 'enddate',
        // The value does not match the format, but does match an altFormat; will be parsed
        // using the altFormat and displayed using the format.
        format: 'Y/m/d',
        altFormats: 'm,d,Y|m.d.Y',
        emptyText:today,
        value:today
    },new Ext.Button({  
                text : '确定',
                id:'qd',
                handler:function(){creattu(ds)}
            }) ]});
    	
    	
		
		
		
var grid = new Ext.grid.GridPanel({
    	store: ds,
    	height:200,
    	id:'grid',
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
        	{header:"会话数",width:50,dataIndex:"count",sortable: false},
        	{header:"比例",width:100,dataIndex:"bili",sortable: false}
        ]
        });  
			
        var tupan=new Ext.Panel({
        	id:"sample",
        	heigth:"60%"
        })

    	var panl=new Ext.Panel({
			tbar:toolbar,
			items:[tupan,grid],
			heigth:"40%"
		})
		
		parentPanel.add(panl);
		parentPanel.doLayout();
			
		
		Ext.Ajax.request({
									url : '/usr/cms/fangwenshendu.jcp',
									params : {
										'startdate':today.add(Date.DAY, -7).format('Y/m/d'),'enddate':today.format('Y/m/d')
									},
									scope : this,
									method : 'Post',
									success : function(response, options) {
										
										var check=response.responseText;
										var ajaxResult = Ext.util.JSON.decode(check);
										var list = ajaxResult.authArray;
										
									
										var xml="<anychart>"+
		"<settings>"+
			"<animation enabled=\"True\"/>"+
		"</settings>"+
	"<charts>"+
	"<chart plot_type=\"Pie\">"+
		"<data_plot_settings enable_3d_mode=\"false\">"+
			"<pie_series>"+
				"<tooltip_settings enabled=\"true\">"+
	"<format>"+
	"{%Name}"+
	"会话数: {%YValue}个"+
	"比例: {%YPercentOfSeries}{numDecimals: 2}%"+
	"</format>"+
				"</tooltip_settings>"+
				"<label_settings enabled=\"true\">"+
					"<background enabled=\"false\"/>"+
					"<position anchor=\"Center\" valign=\"Center\" halign=\"Center\" padding=\"20\"/>"+
					"<font color=\"White\">"+
						"<effects>"+
							"<drop_shadow enabled=\"true\" distance=\"2\" opacity=\"0.5\" blur_x=\"2\" blur_y=\"2\"/>"+
						"</effects>"+
					"</font>"+
					"<format>{%YPercentOfSeries}{numDecimals:1}%</format>"+
				"</label_settings>"+
			"</pie_series>"+
		"</data_plot_settings>"+
		"<data>"+
			"<series name=\"Series 1\" type=\"Pie\">";
				for(var i=0;i<list.length;i++){
					xml+="<point name=\""+list[i].name+"\" y=\""+list[i].count+"\"/>"
				}
				
	    		
	    		
	    		
			xml+="</series>"+
		"</data>"+
		"<chart_settings>"+
			"<title enabled=\"true\" padding=\"15\">"+
				"<text>访问深度</text>"+
			"</title>"+
			"<legend enabled=\"true\" position=\"Bottom\" align=\"Spread\" ignore_auto_item=\"true\" padding=\"15\">"+
					"<format>{%Icon} {%Name} ({%YValue}个)</format>"+
					"<template></template>"+
					"<title enabled=\"true\">"+
						"<text></text>"+
					"</title>"+
					"<columns_separator enabled=\"false\"/>"+
					"<background>"+
						"<inside_margin left=\"10\" right=\"10\"/>"+
					"</background>"+
					"<items>"+
						"<item source=\"Points\"/> "+
					"</items>"+
				"</legend>"+
		"</chart_settings>"+
	"</chart>"+
	"</charts>"+
	"</anychart>";
						
									
			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write('sample');
									
									}
								}, this);
			
         
		
		}
	});
	
	function creattu(ds){
			var today=new Date();
			var startdate=Ext.getCmp('startdate').getRawValue();
			var enddate=Ext.getCmp('enddate').getRawValue();
			ds.load({params:{'startdate':startdate,'enddate':enddate}});
			
			Ext.Ajax.request({
									url : '/usr/cms/fangwenshendu.jcp',
									params : {
										'startdate':startdate,'enddate':enddate
									},
									scope : this,
									method : 'Post',
									success : function(response, options) {
										
										var check=response.responseText;
										var ajaxResult = Ext.util.JSON.decode(check);
										var list = ajaxResult.authArray;
										
									
										var xml="<anychart>"+
		"<settings>"+
			"<animation enabled=\"True\"/>"+
		"</settings>"+
	"<charts>"+
	"<chart plot_type=\"Pie\">"+
		"<data_plot_settings enable_3d_mode=\"false\">"+
			"<pie_series>"+
				"<tooltip_settings enabled=\"true\">"+
	"<format>"+
	"{%Name}"+
	"会话数: {%YValue}个"+
	"比例: {%YPercentOfSeries}{numDecimals: 2}%"+
	"</format>"+
				"</tooltip_settings>"+
				"<label_settings enabled=\"true\">"+
					"<background enabled=\"false\"/>"+
					"<position anchor=\"Center\" valign=\"Center\" halign=\"Center\" padding=\"20\"/>"+
					"<font color=\"White\">"+
						"<effects>"+
							"<drop_shadow enabled=\"true\" distance=\"2\" opacity=\"0.5\" blur_x=\"2\" blur_y=\"2\"/>"+
						"</effects>"+
					"</font>"+
					"<format>{%YPercentOfSeries}{numDecimals:1}%</format>"+
				"</label_settings>"+
			"</pie_series>"+
		"</data_plot_settings>"+
		"<data>"+
			"<series name=\"Series 1\" type=\"Pie\">";
				for(var i=0;i<list.length;i++){
					xml+="<point name=\""+list[i].name+"\" y=\""+list[i].count+"\"/>"
				}
				
	    		
	    		
	    		
			xml+="</series>"+
		"</data>"+
		"<chart_settings>"+
			"<title enabled=\"true\" padding=\"15\">"+
				"<text>访问深度</text>"+
			"</title>"+
			"<legend enabled=\"true\" position=\"Bottom\" align=\"Spread\" ignore_auto_item=\"true\" padding=\"15\">"+
					"<format>{%Icon} {%Name} ({%YValue}个)</format>"+
					"<template></template>"+
					"<title enabled=\"true\">"+
						"<text></text>"+
					"</title>"+
					"<columns_separator enabled=\"false\"/>"+
					"<background>"+
						"<inside_margin left=\"10\" right=\"10\"/>"+
					"</background>"+
					"<items>"+
						"<item source=\"Points\"/> "+
					"</items>"+
				"</legend>"+
		"</chart_settings>"+
	"</chart>"+
	"</charts>"+
	"</anychart>";
						
									
			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write('sample');
									
									}
								}, this);
			
         
		
		
}
	
};