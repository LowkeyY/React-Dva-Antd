CPM.manager.ProgramTextReport=Ext.extend(CPM.manager.CustomizeObject,{
	className:'CPM.manager.ProgramTextReport',
	programType:'ProgramTextReport',
	updateData:function(panel,param){
		if (reportViewPanel.params && typeof(reportViewPanel.params.query) == 'string'
				&& typeof(param.query) == 'undefined') {
			param.query = reportViewPanel.params.query;
		}
		var reportString='';
		for(var i in param){
			reportString+='&'+i+'='+param[i];
		}
		Ext.Ajax.request({  
			url:'/bin/exe/textreportview.jcp?meta=false&'+reportString.substring(1)+'&'+Math.random(),
			method: 'GET',  
			scope:this,
			success:function(response, options){ 
				var check = response.responseText;
				var frameJSON = Ext.decode(check);
				reportViewPanel.MainTabPanel.body.dom.innerHTML=frameJSON.content;  
			}
		}); 
	},
	load:function(mode,parentPanel,param){		
		using("bin.exe.TextReportViewPanel");
		param['meta']=true;
		reportViewPanel =new bin.exe.TextReportViewPanel(param); 
		reportViewPanel.MainTabPanel.param=param;
		parentPanel.add(reportViewPanel.MainTabPanel);
		parentPanel.doLayout();
	},
	canUpdateDataOnly:function(panel,parentPanel,param){
		return (typeof(panel)!='undefined') &&
			    panel.param.objectId==param.objectId &&
			    panel.param.programType==param.programType
	}
});