Ext.namespace("dev.gis");

dev.gis.MapChartPanel= function(frames,params){
	this.frames = frames;
	this.params=params;
	var ButtonArray=[];
	
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'reSet',
				text: '重置'.loc(),
				icon: '/themes/icon/xp/refresh.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'redo',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.params.retFn
	}));
 
	var editMode= false;
	using("lib.ColorField.ColorField");
	using("dev.gis.MapChartEditPanel");
	this.columnForm =new dev.gis.MapChartEditPanel(this.params);
	this.MainTabPanel = new Ext.Panel({
		id : 'metaTablePanel',
		border : false,    
		layout:'fit',
		cached:false,
		activeTab : 0,
		tabPosition : 'bottom',
		items :this.columnForm ,
		tbar:ButtonArray
	})
};
dev.gis.MapChartPanel.prototype={
	init : function(params){	
		this.params = params;
		if(this.MainTabPanel.rendered){
			this.columnForm.clearAll();
			this.frames.get("Gis").mainPanel.setStatusValue(['图表样式'.loc()]);
		}
	},
	loadData:function(params){  
		this.baseParams=params;
		this.columnForm.getStore().load({
		 	params :params
		});
	},
	onButtonClick : function(item){
        var Gis = this.frames.get("Gis");       
		if(item.btnId=='save'){
			if(this.params['object_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立地图样式'.loc());
			}else{
				var saveParams=this.params;
				var storeValue = [];
				var myGrid = this.columnForm;
				var allRecords = myGrid.store.getRange(0);
				for (i = 0; i < allRecords.length; i++){
					storeValue[i] = allRecords[i].data;
				}
				saveParams['fields']= Ext.encode(storeValue);
				saveParams['object_id']=this.params.object_id;
				saveParams['type']='save';
				Ext.Ajax.request({ 
					url:'/dev/gis/mapChart.jcp',   
					params:saveParams,
					method: 'POST',  
					scope:this,
					success:function(response, options){ 
						var check = response.responseText;
						var ajaxResult=Ext.util.JSON.decode(check);
						if(ajaxResult.success){
							Ext.msg('info', '完成图表样式更新!'.loc()); 
						}else{
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+ajaxResult.message);
						}
					}     
				 });
			}
		}else if(item.btnId=='reSet'){
			var saveParams=this.params;
			var storeValue = [];
			var myGrid = this.columnForm;
			var allRecords = myGrid.store.getRange(0);
			for (i = 0; i < allRecords.length - 1; i++){
				storeValue[i] = allRecords[i].data;
			}
			saveParams['fields']= Ext.encode(storeValue);
			saveParams['object_id']=this.params.object_id;
			saveParams['type']='reSet';
			Ext.Ajax.request({ 
				url:'/dev/gis/mapChart.jcp',   
				params:saveParams,
				method: 'POST',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check);
					if(ajaxResult.success){
						this.columnForm.getStore().load({
							params :this.params
						},this);
					}else{
						Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+ajaxResult.message);
					}
				}     
			 });
		}
    }
};