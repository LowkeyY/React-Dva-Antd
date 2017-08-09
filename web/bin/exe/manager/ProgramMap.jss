Ext.namespace("bin.gis");

CPM.manager.ProgramMap=Ext.extend(CPM.manager.CustomizeObject,{
	className:'CPM.manager.ProgramMap',
	programType:'ProgramMap',
	updateData:function(panel,param){   
		 setTimeout(function(){panel.pan.moveToNewCenter(param);}, 2000);
		
	},
	load:function(mode,parentPanel,param){
		using("bin.exe.MapQuery");
		using("bin.exe.MapPanel");
		var pan=new bin.exe.MapPanel(parentPanel,param);
		var mtab=pan.MainPanel;
		mtab.param=param;
		mtab.pan=pan;
		var cur=parentPanel.getComponent(0);
		if(typeof(cur)!='undefined')
			parentPanel.remove(cur);
		parentPanel.add(mtab);
		parentPanel.doLayout();

		if(param.dataId){
			mtab.on('add',function(){
				 setTimeout(function(){pan.moveToNewCenter(param);}, 2000);
			})
		}
	},
	canUpdateDataOnly:function(panel,parentPanel,param){
		return (typeof(panel)!='undefined') &&
			    panel.param.objectId==param.objectId &&
			    panel.param.programType==param.programType
	}
});