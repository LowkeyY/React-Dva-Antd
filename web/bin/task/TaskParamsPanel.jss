Ext.namespace('bin.task');

bin.task.TaskParamsPanel = function(frames,retFn){

	this.frames = frames;
	var Task = this.frames.get("Task");
	this.retFn=retFn;

	this.buttonArray=[];

	this.buttonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				handler :this.retFn
	}));

	this.buttonArray.push(new Ext.Toolbar.Button({
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.save
	}));

	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:"/bin/task/params.jcp",
			method:'GET'
		}),
        reader: new Ext.data.JsonReader({}, [
			{name: 'paramsArray', mapping: 'paramsArray'}
        ]),
        remoteSort: false
    });

	this.paramGrid=new Ext.grid.PropertyGrid({
		closable: false,
		enableColumnResize: true,
		clicksToEdit: 1,
		border:false,
		items:this.paramGrid,
		tbar:this.buttonArray
	});
};

Ext.extend(bin.task.TaskParamsPanel, Ext.Panel, {
	init : function(params){		
		this.ds.baseParams = params;
		this.ds.load();
		this.ds.on('load',function(){
				var paramsArray=this.ds.getAt(0).data.paramsArray;
				var params={};
				for(var i=0;i<paramsArray.length;i++){
					for(var j in paramsArray[i]){
						params[j]=paramsArray[i][j]; 
					}
				};
				this.paramGrid.setSource(params); 
				this.frames.get("Task").mainPanel.setStatusValue(['参数设置'.loc(),this.ds.baseParams.schedule_id]);
		},this);
    },
	save: function(){
           var saveTempParams=this.paramGrid.getSource();
		    var saveParams=this.ds.baseParams;
			var keyArray=[];
			var valueArray=[];
			for(var j in saveTempParams){
				keyArray.push(j);
				valueArray.push(saveTempParams[j]);
			}
			saveParams['key']=keyArray;
			saveParams['field']=valueArray;
			if(keyArray.length>0){
					Ext.Ajax.request({ 
						url:'/bin/task/params.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check)
							if(ajaxResult.success){
								Ext.msg("info",'完成任务执行定义更新!'.loc())
							}else{
								Ext.msg("error",'数据删除失败!,原因'.loc()+':<br>'+ajaxResult.message);
							}
						}
				}); 
			}else{
				Ext.msg("info",'没有参数需要设定!'.loc());
			}
	}
});

