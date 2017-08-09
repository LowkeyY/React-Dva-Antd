Ext.namespace("dev.gis");

dev.gis.MapStylePanel= function(frames,params,isRange){
	
	this.frames = frames;
	this.params=params;

	var ButtonArray=[];
	
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'tygl',
				text: '图元管理'.loc(),
				icon: '/themes/icon/common/preview.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
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
				btnId:'clear',
				text: '清空'.loc(),
				icon: '/themes/icon/xp/clear.gif',
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
	using("lib.IconPicker.IconPicker");
	using("dev.gis.MapStyleEditPanel");
	using("lib.IconCombo.IconCombo");
	loadcss("lib.IconCombo.IconCombo");
	this.columnForm =new dev.gis.MapStyleEditPanel(editMode,this.params,isRange);
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
dev.gis.MapStylePanel.prototype={
	init : function(params){	
		this.params = params;
		if(this.MainTabPanel.rendered){
			this.columnForm.clearAll();
			this.frames.get("Gis").mainPanel.setStatusValue(['数据样式'.loc()]);
		}
	},
	loadData:function(params){  
		this.baseParams=params;
		Ext.Ajax.request({
			url:'/dev/gis/mapStyle.jcp?object_id='+params.object_id+"&ra="+Math.random(),
			method:'GET',    
			scope:this,
			success:function(response, options){    
				this.frames.get("Gis").mainPanel.setStatusValue(['数据样式'.loc()]);
			} 
		});
		this.columnForm.getStore().load({
		 	params : {object_id:this.baseParams.object_id}
		});
	},
	onButtonClick : function(item){
        var Gis = this.frames.get("Gis");       
		if(item.btnId=='clear'){
			this.columnForm.clearAll();
		}else if(item.btnId=='tygl'){
			using("dev.gis.PicManager");
			Gis.picManager =new dev.gis.PicManager(this.frames,this.params);
			Gis.mainPanel.add(Gis.picManager);
			Gis.mainPanel.setActiveTab(Gis.picManager);
		}else if(item.btnId=='save'){
			if(this.params['object_id']==null){
				Ext.msg("error",'不能完成保存操作!,必须选择一应用下建立地图样式'.loc());
			}else{
				var saveParams=this.params;
				var storeValue = [];
				var myGrid = this.columnForm;
				var allRecords = myGrid.store.getRange(0);
				for (i = 0; i < allRecords.length - 1; i++){
					storeValue[i] = allRecords[i].data;
				}
				saveParams['fields']= Ext.encode(storeValue);
				saveParams['object_id']=this.params.object_id;
				saveParams['type']='save';
				Ext.Ajax.request({ 
					url:'/dev/gis/mapStyle.jcp',   
					params:saveParams,
					method: 'POST',  
					scope:this,
					success:function(response, options){ 
						var check = response.responseText;
						var ajaxResult=Ext.util.JSON.decode(check);
						if(ajaxResult.success){
							Ext.msg('info', '完成地图样式更新!'.loc()); 
						}else{
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+ajaxResult.message);
						}
					}     
				 });
			}
		}
    }
};