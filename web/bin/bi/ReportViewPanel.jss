Ext.namespace("bin.bi");

bin.bi.ReportViewPanel = function(params,parentPanel){
	
	this.params=params;

	var conProxy=new Ext.data.HttpProxy({
			 url:  '/bin/bi/getReportCount.jcp', 
			 method:'GET'
	})
	this.store = new Ext.data.Store({
		proxy: conProxy,
		reader: new Ext.data.JsonReader(
			{root:"dataItem",totalProperty: 'totalCount'},
			[
				{name: 'id', mapping: 'id'}
			]
		),  
		baseParams:this.params,
		remoteSort: false,
		autoLoad : false
	});
	this.bbar = new Ext.PagingToolbar({
		height:26,
		store: this.store,
		displayInfo: true
	});
	this.bbar.on('change',function(){
		delete this.store.baseParams.start;
	})

	this.MainTabPanel=new Ext.Panel({
			id: 'userReportPanel',
			border:true,
			height:params['height'],
			width:params['width'],
			tbar : [],
			bbar:this.bbar,
			layout:'fit'
	});

	this.MainTabPanel.on('render', function() {

		var reportString='';
		for(var i in this.params){
			reportString+='&'+i+'='+this.params[i];
		}
		var el=new Ext.ux.IFrameComponent({ id:'printViewIframe-'+this.params['objectId'], url:'/bin/bi/Preview.jcp?'+encodeURI(reportString.substring(1)),style:'position:relative;left:0; top:0; height:100%; width:100%'});
		this.MainTabPanel.add(el);

		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				url:'/bin/bi/getReportParams.jcp?'+reportString.substring(1)
		});				
		conn.on('requestcomplete', function(conn, oResponse ){	
			var frameJSON = Ext.decode(oResponse.responseText);
			var reportType=frameJSON.report_type;
			var query_id=frameJSON.query_id;
			var pageRowNum=frameJSON.pageSize;
			var tb=this.MainTabPanel.getTopToolbar();
			if(this.params['objectId']){
//				if(tb.items.getCount()==0){
					var btns=frameJSON.buttonArray;
					for(var i=0;i<btns.length;i++){
						var btn=parentPanel.getButton(btns[i],this.MainTabPanel.id);
						btn.style="margin-right:10px;";
						tb.addButton(new Ext.Toolbar.Button(btn));
					}
//				}
			}else{
				var haveMenu=false;
				tb.items.each(function(item){ 
					if(item.btnId=='execl'){
						haveMenu=true;
					}
				}, tb.items);
				if(!haveMenu){
					tb.addButton(new Ext.Toolbar.Button({
								btnId:'excel',
								tooltip: '生成EXCEL文件'.loc(),
								icon: '/themes/icon/xp/excel.gif',
								cls: 'x-btn-text-icon',
								disabled:false,
								hidden : false,   
								scope: this,
								handler :this.onButtonClick
					}));
					tb.addButton(new Ext.Toolbar.Separator());
					tb.addButton(new Ext.Toolbar.Button({
								btnId:'print',
								tooltip: '打印'.loc(),
								icon: '/themes/icon/all/printer.gif',
								cls: 'x-btn-text-icon  bmenu',
								disabled:false,
								hidden : false,
								scope: this,
								handler :this.onButtonClick
					}));
					tb.addButton(new Ext.Toolbar.Button({
								btnId:'printview',
								tooltip: '打印预览'.loc(),
								icon: '/themes/icon/xp/print_view.gif',
								cls: 'x-btn-text-icon  bmenu',
								disabled:false,
								hidden : false,
								scope: this,
								handler :this.onButtonClick
					}));
				}
			}
			if(frameJSON.searchEditor){
				var editors=frameJSON.searchEditor.editors;
				if((editors instanceof Array) && editors.length>0){
					if(frameJSON.searchEditor.libs.length>0){
						eval(frameJSON.searchEditor.libs);
					}
					tb.addFill();
					this.eds=[];
					for(var i=0;i<editors.length;i++){
						if(editors[i].xtitleList){
							editors[i]=Ext.ComponentMgr.create(editors[i], 'textfield')
							this.eds.push(editors[i]);
						}
						tb.add(editors[i]);
					}
					if(this.params.query){
						for(var i=0;i<this.eds.length;i++){
							var queryObj=Ext.decode(this.params.query);
							for(var j in queryObj){
								if(this.eds[i].xtitleList==j){
									this.eds[i].setValue(queryObj[j]);
								}
							}
						}
					} 
					tb.addButton(new Ext.Toolbar.Button({   
						text:'过滤'.loc(),
						scope:this,
						icon: '/themes/icon/xp/selectlink.gif',
						cls: 'x-btn-text-icon bmenu',
						handler:function(btn){
							var cbk=function(){
								var result={};
								for(var i=0;i<this.eds.length;i++){
									if(!this.eds[i].validate()){
										Ext.msg("error",'请改正标示出的错误.'.loc());
										return false;
									}
									result[this.eds[i].xtitleList.trim()]=this.eds[i].getValue();
								}       
								Ext.apply(this.store.baseParams,{
									meta:false,
									query:Ext.encode(result)
								});
								this.bbar.pageSize=pageRowNum;
								this.store.load({params:{start:0, limit:pageRowNum}});
								window.open('/bin/bi/Preview.jcp?'+reportString.substring(1)+'&start=0&limit='+pageRowNum+'&query='+encodeURI(Ext.encode(result)),'printViewIframe-'+this.params['objectId'],"");
							};
							cbk.defer(30,this);
						}
					}));
					tb.addButton(new Ext.Toolbar.Button({   
						text:'还原'.loc(),
						scope:this,
						icon: '/themes/icon/all/magifier_zoom_out.gif',
						cls: 'x-btn-text-icon bmenu',
						handler:function(btn){
							var result={};
							for(var i=0;i<this.eds.length;i++){
								this.eds[i].reset();
							}
							Ext.apply(this.store.baseParams,{
								meta:false,
								query:Ext.encode(result)
							});     
							this.store.load({params:{start:0, limit:pageRowNum}});
							window.open('/bin/bi/Preview.jcp?'+reportString.substring(1)+'&start=0&limit='+pageRowNum,'printViewIframe-'+this.params['objectId'],"");
						}
					}));
					tb.doLayout();
				}
			}
			this.bbar.pageSize=pageRowNum;
			this.bbar.doLoad=function(start){
				var o = {};
				o['start'] = start;
				o['limit'] = pageRowNum;
				var tempeds=this.eds;    
				if(this.bbar.fireEvent('beforechange', this, o) !== false){
					this.bbar.store.load({params:o});
					var result={};
					for(var i=0;i<tempeds.length;i++){
						if(!tempeds[i].validate()){
							Ext.msg("error",'请改正标示出的错误.'.loc());
							return false;
						}
						result[tempeds[i].xtitleList.trim()]=tempeds[i].getValue();
					}
					Ext.apply(this.store.baseParams,{
						meta:false,
						query:Ext.encode(result)
					});
					window.open('/bin/bi/Preview.jcp?'+reportString.substring(1)+'&start='+start+'&limit='+pageRowNum+'&query='+encodeURI(Ext.encode(result)),'printViewIframe-'+this.params['objectId'],"");		
				}
			}.createDelegate(this);
		}, this) ;
	}, this);
};
Ext.extend(bin.bi.ReportViewPanel,Ext.Panel, {
	onButtonClick : function(item){
		var strMes = '打印失败!'.loc();
		if(item.btnId=='print'){
			if(Ext.isIE){
				var printViewIframe='printViewIframe-'+this.params['objectId'];
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
		}else if(item.btnId=='printview'){
			if(Ext.isIE){
				var printViewIframe='printViewIframe-'+this.params['objectId'];
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
		}else if(item.btnId=='excel'){
			window.open(printViewIframe.location.href+"&type=excel","_blank","height=768, width=1024, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=no, status=yes");
		}
    }
});