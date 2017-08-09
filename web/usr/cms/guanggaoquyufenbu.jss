Ext.namespace("usr.cms");
usr.cms.guanggaoquyufenbu=function(){
	

	Ext.apply(usr.cms.guanggaoquyufenbu.prototype,{
		
		load:function(framePanel, parentPanel, param, prgInfo){
			
		var today=new Date();
		
		var ds=new Ext.data.JsonStore({
					method: 'GET',
					url : '/usr/cms/guanggaoquyufenbu.jcp',
					root : 'authArray',
					fields : ["name", "count", "bili"],
					remoteSort : true
		});
			//ds.load({params:{'startdate':today.add(Date.DAY, -7).format('Y/m/d'),'enddate':today.format('Y/m/d')}});
	
		
		

		
		

				Ext.Ajax.request({
									url : '/usr/cms/guanggaoquyufenbuxiala.jcp',
									scope : this,
									method : 'Post',
									success : function(response, options) {
										var check=response.responseText;
										var ajaxResult = Ext.util.JSON.decode(check);
										var tbxialai = ajaxResult.authArray;
										
									}
			})
			
			
			
			var dsxiala=new Ext.data.JsonStore({
					method: 'GET',
					url : '/usr/cms/guanggaoquyufenbuxiala.jcp',
					root : 'authArray',
					fields : ["name", "value"],
					remoteSort : true
		});
			var combo = new Ext.form.ComboBox({       
					hiddenName:'swjg',id:'swjg',   
store: dsxiala,
valueField:'value',   
displayField:'name',   
typeAhead:true,   
mode:'remote',   
triggerAction:'all',   
emptyText:'请选择广告',   
selectOnFocus:true,   
allowblank:false,   
width:200   
});   
			
			
			
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
    },combo,new Ext.Button({  
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
        	{header:"次数",width:50,dataIndex:"count",sortable: false},
        	{header:"比例",width:100,dataIndex:"bili",sortable: false}
        ]
        });  
			
        var tupan=new Ext.Panel({
        	id:"sample",
        	heigth:"60%",
        	items:[{}]
        })

    	var panl=new Ext.Panel({
			tbar:toolbar,
			items:[tupan,grid],
			heigth:"40%"
		})
		
		parentPanel.add(panl);
		parentPanel.doLayout();
			
			
	
			
	
			
        
		
		}
	});
	
	function creattu(ds){
			var today=new Date();
			var guanggaoid=Ext.getCmp('swjg').getValue();
			var startdate=Ext.getCmp('startdate').getRawValue();
			var enddate=Ext.getCmp('enddate').getRawValue();
			ds.load({params:{'startdate':startdate,'enddate':enddate,'guanggaoid':guanggaoid}});
			
			Ext.Ajax.request({
									url : '/usr/cms/guanggaoquyufenbu.jcp',
									params : {
										'startdate':startdate,'enddate':enddate,'guanggaoid':guanggaoid
									},
									scope : this,
									method : 'Post',
									success : function(response, options) {
										
										var check=response.responseText;
										var ajaxResult = Ext.util.JSON.decode(check);
										var list = ajaxResult.authArray;
										
									
										var xml='<anychart> 	<settings> 		<animation enabled="True"/> 	</settings> 	<charts> 		<chart plot_type="CategorizedVertical"> 			<data_plot_settings default_series_type="Bar"> 				<bar_series point_padding="0.2" group_padding="1"> 					<tooltip_settings enabled="true"/> 				</bar_series> 			</data_plot_settings> 			<chart_settings> 				<title enabled="true"> 					<text>搜索引擎</text> 				</title> 			</chart_settings> 			<data> 								<series name="PV"> ';
											
										for(var i=0;i<list.length;i++){
											xml+="<point name=\""+list[i].name+"\" y=\""+list[i].count+"\"/>"
										}
										
										
							
										xml+='</series></data> 		</chart> 	</charts> </anychart>'
						
									
			this.chartSample = new AnyChart('/lib/chart/AnyChart.swf');
			this.chartSample.width = '100%';
			this.chartSample.height = '60%';
			this.chartSample.setData(xml);
			this.chartSample.write('sample');
									
									}
								}, this);
			
         
		
		
}
	
};