CPM.manager.ProgramReport=Ext.extend(CPM.manager.CustomizeObject,{
	className:'CPM.manager.ProgramReport',
	programType:'ProgramReport',
	updateData:function(panel,param){
		param['showTopToolbar']=true;
		var reportString='';
		for(var i in param){
			reportString+='&'+i+'='+param[i];
		}
		panel.items.each(function(item){    
			panel.remove(item);
		}, panel.items);
		var el=new Ext.ux.IFrameComponent({ id:'printViewIframe-'+param['objectId'], url:'/bin/bi/Preview.jcp?'+reportString.substring(1),style:'position:relative;left:0; top:0; height:100%; width:100%'});
		panel.add(el);
		panel.doLayout();
	},
	load:function(mode,parentPanel,param){		
		using("bin.bi.ReportViewPanel");
		param['meta']=true;
		param['height']=parentPanel.getInnerHeight();
		param['width']=parentPanel.getInnerWidth();
		reportViewPanel =new bin.bi.ReportViewPanel(param,this); 
		reportViewPanel.MainTabPanel.param=param;
		parentPanel.add(reportViewPanel.MainTabPanel);
		parentPanel.doLayout();
	},
	canUpdateDataOnly:function(panel,parentPanel,param){
		return (typeof(panel)!='undefined') &&
			    panel.param.objectId==param.objectId &&
			    panel.param.programType==param.programType
	},
	buttonMap : {
		'%excel' : {
			handler : function() {
				window.open(printViewIframe.location.href+"&type=excel","_blank","height=768, width=1024, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=no, status=yes");
			}
		},
		'%print' : {
			handler : function(btn) {
				var strMes = '打印失败!'.loc();
				if(Ext.isIE){
					var p=window.open("","_blank","height=10, width=10, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
					p.document.write(printViewIframe.document.documentElement.innerHTML);
					p.document.write('<'+'script>');
					p.document.write('function SystemPrintPreview(OLECMDID) {');
					p.document.write('try{var PROMPT = 1;');
					p.document.write('var oWebBrowser = document.getElementById("WebBrowser1");');
					p.document.write('if(oWebBrowser == null){');
					p.document.write('var sWebBrowser = \'<'+'OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0  CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT'+'>\';');
					p.document.write('document.body.insertAdjacentHTML("beforeEnd", sWebBrowser); ');
					p.document.write('oWebBrowser = document.getElementById("WebBrowser1");} ');
					p.document.write('oWebBrowser.ExecWB(OLECMDID,PROMPT);');
					p.document.write('}catch(e){');
					p.document.write('alert("'+strMes+'" + e.message);');
					p.document.write('}}');
					p.document.write('window.onload=function(){SystemPrintPreview(6);}</'+'script>');p.document.close();
				}else{
					printViewIframe.focus(); 
					print(); 
				}
			}
		},
		'%printview' : {
			handler : function(btn) {
				var strMes = '打印失败!'.loc();
				if(Ext.isIE){
					var p=window.open("","_blank","height=768, width=1024, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
					p.document.write(printViewIframe.document.documentElement.innerHTML);
					p.document.write('<'+'script>');
					p.document.write('function SystemPrintPreview(OLECMDID) {');
					p.document.write('try{var PROMPT = 1;');
					p.document.write('var oWebBrowser = document.getElementById("WebBrowser1");');
					p.document.write('if(oWebBrowser == null){');
					p.document.write('var sWebBrowser = \'<'+'OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT'+'>\';');
					p.document.write('document.body.insertAdjacentHTML("beforeEnd", sWebBrowser); ');
					p.document.write('oWebBrowser = document.getElementById("WebBrowser1");} ');
					p.document.write('oWebBrowser.ExecWB(OLECMDID,PROMPT);');
					p.document.write('}catch(e){');
					p.document.write('alert("'+strMes+'" + e.message);');
					p.document.write('}}');
					p.document.write('window.onload=function(){SystemPrintPreview(7);}</'+'script>');
					p.document.close();
				}else{
					Ext.msg("error", '只有IE支持打印预览!'.loc());
					return;
				}
			}
		}
	}
});