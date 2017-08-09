Ext.namespace("dev.gis");

dev.gis.MapStyleEditPanel = function(viewMode,params,isRange) {
	this.params = params;
	var fm = Ext.form;

	var startValueEditor = new fm.NumberField( {
		allowBlank : false,
		style : 'text-align:left;ime-mode:disabled;'
	});
	var endValueEditor = new fm.NumberField( {
		allowBlank : false,
		style : 'text-align:left;ime-mode:disabled;'
	});

	var heightEditor = new fm.NumberField( {
		tabIndex : 129,
		allowBlank : true,
		style : 'text-align:left;ime-mode:disabled;'
	});
	var widthEditor = new fm.NumberField( {
		tabIndex : 129,
		allowBlank : true,
		style : 'text-align:left;ime-mode:disabled;'
	});
	var panelEditor = new fm.ComboBox({
			tabIndex : 129,
			allowBlank : true,
			store : new Ext.data.SimpleStore({
				fields:["value","text"],	data:[['10','10%'],['20','20%'],['30','30%'],['40','40%'],['50','50%'],['60','60%'],['70','70%'],['80','80%'],['90','90%'],['99','100%']]
			}),
			valueField : 'value',    
			displayField : 'text',
			triggerAction : 'all',  
			clearTrigger : false,
			mode : 'local'
		});
	var panelEditor1 = new fm.ComboBox({
		allowBlank : true,
		store : new Ext.data.SimpleStore({
			fields:["value","text"],
			data:[
				['6', '6'],
				['8', '8'],
				['10', '10'],
				['12', '12'],
				['14', '14'],
				['18', '18'],
				['24', '24'],
				['36', '36']
			]
		}),
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		clearTrigger : false,
		mode : 'local'
	});
	var panelEditor2 = new fm.ComboBox({
		allowBlank : true,
		store : new Ext.data.SimpleStore({
			fields:["value","text"],
			data :[
				['SimSun', '宋体'.loc()],
				['SimHei', '黑体'.loc()],
				['KaiTi', '楷体'.loc()],
				['Arial', 'Arial'],
				['Arial Black', 'Arial Black'],
				['Tahoma', 'Tahoma'],
				['Times New Roman', 'Times New Roman']
			]
		}),
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		clearTrigger : false,
		mode : 'local'
	});
	var panelEditor3 = new fm.ComboBox({
		allowBlank : true,
		store : new Ext.data.SimpleStore({
			fields:["value","text"],
			data :[
				['square', '正方形'.loc()],
				['circle', '圆形'.loc()],
				['triangle', '三角形'.loc()],
				['cross', '十字叉'.loc()],
				['star', '星形'.loc()],
				['icon', '图标'.loc()]
			]
		}),
		value:'icon',
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		clearTrigger : false,
		mode : 'local'
	});
	panelEditor3.on('select',function(){
		if(panelEditor3.getValue()=='icon'){
			baseColor.setDisabled(true);
			panelEditor.setDisabled(true);
			iconField.setDisabled(false);
			iconField.setIconDisabled(false);
		}else{
			baseColor.setDisabled(false);
			panelEditor.setDisabled(false);
			iconField.setDisabled(true);
			iconField.setIconDisabled(true);
		}      
	});
	var panelEditor4 = new fm.ComboBox({
		allowBlank : true,
		store : new Ext.data.SimpleStore({
			fields:["value","text"],
			data :[
				['color', '颜色填充'.loc()],
				['image', '位图填充'.loc()]
			]
		}),
		valueField : 'value',
		displayField : 'text',
		triggerAction : 'all',
		clearTrigger : false,
		mode : 'local'
	});
	
	panelEditor4.on('select',function(){
		if(panelEditor4.getValue()=='color'){
			panelEditor5.setDisabled(true);
			forColor.setDisabled(true);
			panelEditor.setDisabled(false);
		}else{
			panelEditor5.setDisabled(false);
			forColor.setDisabled(false);
			panelEditor.setDisabled(true);
		}      
	});

	var panelEditor5 =new dev.gis.IconPicker({
			tabIndex:129,
			width:90,
			id : 'fill_image_id',
			hiddenName : 'fill_image',
			height:15   
	})
	var colorEdit = new lib.ColorField.ColorField({
				id: 'dolor_id',
				width: 120,
				allowBlank: true
	});
	var baseColor = new lib.ColorField.ColorField({
				id: 'baseColor',
				width: 120,
				allowBlank: true
	});
	var forColor = new lib.ColorField.ColorField({
				id: 'forColor',
				width: 120,
				allowBlank: true
	});
	var fontColor = new lib.ColorField.ColorField({
				id: 'fontColor',
				width: 120,
				allowBlank: true
	});
	var valueFields = new fm.ComboBox({
		tabIndex : 126,
		allowBlank : false,
		store : new Ext.data.SimpleStore({
			fields:["value","text"],
			data :[
				['any', 'any']
			]
		}),
		displayField : 'text',
		mode : 'local',
		editable:true
	});

	var iconField =new dev.gis.IconPicker({
			tabIndex:129,
			width:90,
			id : 'start_icon_id',
			hiddenName : 'start_icon',
			height:15   
	});
	var cmArray=new Array();
	var autoExpandCol='value';
	if(!isRange){
		cmArray.push({
				id : 'value',
				header : '样式值'.loc(),
				dataIndex : 'value',
				width : 60,
				editor : valueFields,
				renderer:function(val){
					return val;
				}
		});
	}else{
		autoExpandCol='startValue';
		cmArray.push({
			id : 'startValue',
			header : '起始值'.loc(),
			dataIndex : 'startValue',
			width : 60,
			editor : startValueEditor,
			renderer:function(val){
				return val;
			}
		});  
		cmArray.push({
			id : 'endValue',
			header : '终止值'.loc(),
			dataIndex : 'endValue',
			width : 100,
			editor : endValueEditor,
			renderer:function(val){
				return val;
			}
		});
	}
	cmArray.push({
		header : '图标样式'.loc(),
		dataIndex : 'marker_type_TXT',
		width : 130,
		realValueIndex: 'marker_type',
		editorConfig:new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(true),
		editor : panelEditor3
	});
	cmArray.push({
			header : '填充类别'.loc(),
			dataIndex : 'fill_type_TXT',
			width : 130,
			realValueIndex: 'fill_type',
			editorConfig:new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(true),
			editor : panelEditor4
	});
	cmArray.push({
			header : '填充图片'.loc(),
			dataIndex : 'fill_image',
			width : 130,
			renderer:function(val){
				return (val=='')?val:'<img src="/dev/gis/picdownload.jcp?meta_name='+val+'" />';
			},
			editor : panelEditor5
	});
	cmArray.push({
			header : '底色'.loc(),
			dataIndex : 'baseColor',
			width : 100,
			renderer:function(val){
				return '<div style="float:left;margin-left:3px;">' + val + '</div><div style="width:20px;height:9px;background-color:'+val+';border:solid 1px #C0C0C0;float:left;margin-left:10px;">&nbsp;</div>'
			},
			editor : baseColor
	});
	cmArray.push({
			header : '前景色'.loc(),
			dataIndex : 'foreColor',
			width : 100,
			renderer:function(val){
				return '<div style="float:left;margin-left:3px;">' + val + '</div><div style="width:20px;height:9px;background-color:'+val+';border:solid 1px #C0C0C0;float:left;margin-left:10px;">&nbsp;</div>'
			},
			editor : forColor
	});
	cmArray.push({
			header : '边框颜色'.loc(),
			dataIndex : 'strockColor',
			width : 105,
			renderer:function(val){
				return '<div style="float:left;margin-left:3px;">' + val + '</div><div style="width:20px;height:9px;background-color:'+val+';border:solid 1px #C0C0C0;float:left;margin-left:10px;">&nbsp;</div>'
			},
			editor : colorEdit
	});
	cmArray.push({
			header : '图片'.loc(),
			dataIndex : 'icon',
			width : 130,
			editor : iconField,
			renderer:function(val){
				return (val=='')?val:'<img src="/dev/gis/picdownload.jcp?meta_name='+val+'" />';
			}
	});
	cmArray.push({
			header : '宽度'.loc(),
			dataIndex : 'weight',
			editor : widthEditor
	});
	cmArray.push({
			header : '高度'.loc(),
			dataIndex : 'height',
			editor : heightEditor
	});
	cmArray.push({
			header : '透明度'.loc(),
			dataIndex : 'opacity_TXT',
			width : 70,
			realValueIndex: 'opacity',
			editorConfig:new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(true),
			editor : panelEditor
	});
	cmArray.push({
			header : '标注字体'.loc(),
			dataIndex : 'label_font_TXT',
			width : 130,
			realValueIndex: 'label_font',
			editorConfig:new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(true),
			editor : panelEditor2
	});
	cmArray.push({
			header : '字体大小'.loc(),
			dataIndex : 'font_size_TXT',
			width : 60,
			realValueIndex: 'font_size',
			editorConfig:new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(true),
			editor : panelEditor1
	});
	cmArray.push({
			header : '标注颜色'.loc(),
			dataIndex : 'fontColor',
			width : 110,
			renderer:function(val){
				return '<div style="float:left;margin-left:3px;">' + val + '</div><div style="width:20px;height:9px;background-color:'+val+';border:solid 1px #C0C0C0;float:left;margin-left:10px;">&nbsp;</div>'
			},
			editor : fontColor
	});

	var cm = new Ext.grid.ColumnModel(cmArray);

	this.ds = new Ext.data.JsonStore({
		url : "/dev/gis/styleColumn.jcp?ran="+Math.random(),
		method : 'POST',
		root : 'dataItem',	fields:['value','baseColor','strockColor','icon', 'weight', 'height','opacity','opacity_TXT','label_font','label_font_TXT','font_size','font_size_TXT','fontColor','marker_type_TXT','marker_type','fill_type','fill_type_TXT','fill_image','fill_image_TXT','foreColor','startValue','endValue']
	});   
	var ColumnPanel = new lib.RowEditorGrid.ListInput( {   
		autoExpandColumn : autoExpandCol, 
		autoScroll : true,
		border : false,
		cm : cm,
		clicksToEdit : 1,
		frame : false,
		selModel : new Ext.grid.CheckboxSelectionModel(),
		stripeRows : true,
		minSize : 180,
		draggable :false,
		enableHdMenu :false,
		region : 'center',
		store : this.ds,
		width:810
	});   
if(this.params.layer_type==1){
	if(isRange){     
		cm.setHidden(4,true);
		cm.setHidden(5,true);
		cm.setHidden(7,true);
		cm.setHidden(8,true);	
	}else{
		cm.setHidden(3,true);
		cm.setHidden(4,true);
		cm.setHidden(6,true);
		cm.setHidden(7,true);	
	}
}else if(this.params.layer_type==2){	
	if(isRange){     
		cm.setHidden(3,true);
		cm.setHidden(4,true);
		cm.setHidden(5,true);
		cm.setHidden(9,true);
		cm.setHidden(7,true);
		cm.setHidden(8,true);
		cm.setHidden(11,true);		
	}else{
		cm.setHidden(2,true);
		cm.setHidden(3,true);
		cm.setHidden(4,true);
		cm.setHidden(8,true);
		cm.setHidden(6,true);
		cm.setHidden(7,true);
		cm.setHidden(10,true);	
	}
}else{	
	if(isRange){     
		cm.setHidden(3,true);
		cm.setHidden(9,true);
		cm.setHidden(11,true);	
	}else{
		cm.setHidden(2,true);
		cm.setHidden(8,true);
		cm.setHidden(10,true);	
	}
}
return ColumnPanel;
}

