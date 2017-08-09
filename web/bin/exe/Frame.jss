Ext.namespace("bin.exe");
using("bin.exe.NavPanel");
bin.exe.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
			var objectId=launcher.parent_id;
			var MainFramePanel=this.mainPanel=new Ext.Panel({
				layout:'fit',
				border: false
			});
			CPM.get({
				method: 'GET',    
				url:'/bin/exe/getFrame.jcp?parent_id='+objectId,
				success:function(response,options){ 
		
					var moduleJson=Ext.decode(response.responseText);
					if(!Ext.isDefined(moduleJson.panels)){
						Ext.msg("error",'服务器发生未知错误'.loc());
						return;
					}
					if(moduleJson.panels.length<1){
						Ext.msg("error",'顶层导航或本模块主程序设置错误'.loc());
						return;
					}
					Ext.i18n.apply(moduleJson);
					MainFramePanel.add(new Ext.Panel({
						layout:'border',
						border:false,
						items:CPM.Frame.getFrame(moduleJson)
					}));
					MainFramePanel.doLayout();
				},failure:CPM.getFailure
			},true);
		return MainFramePanel;
	},
	doWinLayout:function(win){}
});

