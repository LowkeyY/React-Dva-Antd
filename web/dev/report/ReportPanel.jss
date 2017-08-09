Ext.namespace("dev.report");

dev.report.ReportPanel = function(parentPanel){
	this.frames=parentPanel;
	var Report=this.frames.get('Report');
   	this.params={};

	ResourceTable = function(){
		this.list = [];
		this.columns = [] ;
		this.index = 0;
		this.DISPLAY = new Object();
	};
	_p = ResourceTable.prototype;

	_p.add = function(table){
		if(table.isSys){
			        Ext.msg("error",'暂时未支持原始表,请使用高级查询'.loc());
			return;
		}
		var o = this.clone(table);
		for(var i=0;i<table.columns.length;i++){
			if(table.columns[i].category!="V"){
				var fld=new dev.report.model.XField();
				fld.name=table.columns[i].name;
				fld.class1=table.columns[i].type;
				dev.report.model.report.addField(fld);
			}
		}
		if(o){
			this.list.push(o);
			this.show();
		}
	}
	_p.sameServer = function(server){
		return false;
	}
	_p.clone = function(o){
	//#########################################################
	//####### 判断两个表列是否相同
		if(o.columns){
			if(this.columns.length==0){
				for(var i=0;i<o.columns.length;i++)
					this.columns[i] = o.columns[i];
			}else{
				var arr=[];
				for(var i=0;i<this.columns.length;i++)
					arr[i] = this.columns[i];
				arr.sort();
				o.columns.sort();
				for(var i=0;i<arr.length;i++){
					var a = arr[i];
					var b = false;
					for(var j=0;j<o.columns.length;j++){
						if(a == o.columns[j]){
							o.columns.splice(0,j+1);
							b = true;
							break;
						}
					}
					if(!b){
						    Ext.msg("error",'引用多个表必须列名一致'.loc());
						return null;
					}
				}
			}
		}
	//##########################################################


		var obj = new Object();
		obj.tableName = o.tableName;
		obj.query_id = o.query_id;
		obj.server = o.server;
		obj.rename = o.rename;
		if(o.columns){
			obj.columns = new Array();
			for(var i=0;i<o.columns.length;i++)
				obj.columns[i] = o.columns[i];
		}
		if(o.params){
			obj.params = new Array();
			for(var i=0;i<o.params.length;i++)
				obj.params[i] = o.params[i];
		}
		return obj;
	}
	_p.removeNode = function(_id){
		var list = this.list;
		for(var i=0;i<list.length;i++){
			if(list[i].query_id == _id){
				if(list.length==0 || i==0){
					this.list = [];
					this.columns = [];
				}else
					list.splice(i,1);
				return true;
			}
		}
		return false;
	}
	_p.removeAll = function(){
		this.list = [];
		this.columns = [] ;
		this.index = 0;
		this.DISPLAY = new Object();
	}
	_p.clear = function(){
		this.removeAll();
		source_query.innerHTML ='';
		PropPanel.removeAll();
		PropPanel.hide();
		NavPanel.doLayout();
	}
	_p.removeItem = function(item){
		var columns = this.columns;
		for(var i=0;i<columns.length;i++){
			if(columns[i].name==item){
				console.log(columns[i]);
				if(columns[i].category=="V"){
					dev.report.model.report.removeVariable(columns[i].name);
				}else{
					dev.report.model.report.removeField(columns[i].name);
				}
				columns.splice(i,1);
				return true;
			}
		}
		return false;
	}
	_p.display = function(_id,start,cmd){
		var trs = source_query.children[0].rows;
		var row_title = trs[start];
		if(cmd==''){
			row_title.cells[0].style.cssText="";
			row_title.cells[1].style.cssText="border-left:1px solid #98BFF3;";	
		}else{
			row_title.cells[0].style.cssText="border-bottom:1px solid #98BFF3;";
			row_title.cells[1].style.cssText="border-bottom:1px solid #98BFF3;border-left:1px solid #98BFF3;";
		}
		for(var i=start+1;i<trs.length;i++){
			var row = trs[i];
			if(row._parent==_id)
				row.style.display=cmd;
			else
				return;
		}
	}
	_p.isExist = function(query_id,query_name){
		var list = this.list;
		for(var i=0;i<list.length;i++){
			var o = list[i];
			if(o.query_id == query_id && o.tableName==query_name)
				return true;
		}
		return false;
	}
	_p.length = function(){
		var list = this.list;
		var maxIndex=list.length;
		for(var i=0;i<list.length;i++){
			var o = list[i];
			if (maxIndex<=parseInt(o.rename.substring(3)))
				 maxIndex=parseInt(o.rename.substring(3))+1;
		}
		return maxIndex;
	}
	_p.getByID = function(_id){
		var list = this.list;
		for(var i=0;i<list.length;i++){
			if(list[i].query_id == _id)
				return list[i];
		}
		return null;
	}

	_p.isGroup = function(src){
		var columns = this.columns;
		for(var i=0;i<columns.length;i++){
			if(columns[i].is_group)
				return true;
		}
		return false;
	}

	//######################################

	_p.get = function(i){ return this.list[i];}

	_p.show = function(){
		var table = source_query.children[0];
		if(!table){
			this.refresh();
			return;
		}
		var t = this.list[this.list.length-1];
		var name = t.tableName;
		var query_id = t.query_id;
		var img = getImg("menutree/query"); 

		str = ['<tr bgColor=#D0E1F9 height=21 _id="',query_id,'" onclick="resourceTRClick(this)"><td colspan=2>&nbsp;<img align=absmiddle src="',img,'" class=icon>&nbsp;',name,'</td></tr>'];
		var tmp = source_query.innerHTML;
		source_query.innerHTML = tmp.substring(0,tmp.length-16)+str.join(' ')+'</TBODY></TABLE>';
	}


	_p.refresh = function(){
		var str = ['<table width=100% border=0 cellpadding cellspacing style="cursor:default;border-collapse:collapse;" oncontextmenu="contextmenu()">'];
		var trIds=[];
		for(var i=0;i<this.list.length;i++){
			var t = this.list[i];
			var name = t.tableName;
			var query_id = t.query_id;
			var img = getImg("menutree/query");

			str.push('<tr bgColor=#D0E1F9 height=21 _id="',query_id,'" onclick="resourceTRClick(this)"><td colspan=2 >&nbsp;<img align=absmiddle src="',img,'" class=icon>&nbsp;',name,'</td></tr>');
				
			if(i==0){
				var cols = this.columns;
				for(var j=0;j<cols.length;j++){
					var colName = cols[j].name;
					var category = cols[j].category;
					var id=Ext.id();
					trIds.push(id);
					var herf='',img;
					var is_group='C';
					if(cols[j].category=="V"){
						if(!cols[j].is_group){
							img = getImg("menutree/variable");
						}else{
							img = getImg("menutree/grouping");
						}
						herf='$V{'+colName+'}';
					}else{  
						if(!cols[j].is_group){
							img = getImg("menutree/column");
						}else{
							img = getImg("menutree/grouping");
						}
						herf='$F{'+colName+'}';
					}
					str.push('<tr id="',id,'" height=21 _parent="',query_id,'" col_name="',colName,'" category="',category,'" onmouseover="TROver(this)" onmouseout="TROut(this)"><td align=right >&nbsp;&nbsp;<img align=absmiddle src="',img,'"></td><td width=85% align=left><a href="',herf,'" onclick="return false">',colName,'</a></td></tr>');
				}
			}
		}
		str.push('</table>');
		source_query.innerHTML = str.toString();
	}
	resourceTRClick = function(tr){
		var _id = tr.getAttribute("_id");
		var o = resTable.getByID(_id);
		if(o.params && o.params.length>0){
			PropPanel.show();
			if(PropPanel._id == _id)
				return;
			for(var i=0;i<o.params.length;i++){
				var name = o.params[i][0];
				var paramLabel=name;
				var blank=(o.params[i][2]!=1);
				PropPanel.add(
					new Ext.form.TextField({
						fieldLabel: paramLabel,
						name: 'param_'+_id+'_'+i,							
						width: 80,
						resourceTable:o,
						allowBlank:blank,
						blankText:'参数必须提供.'.loc(),  
						value:o.params[i][1],
						listeners : {
							change:function(e,newValue,oldValue){
								var tempParams = new Array();
								if(newValue.indexOf('${')!=-1||newValue.indexOf('}')!=-1){
									Ext.msg("error",'引用参数不能包含'.loc()+'${'+'和'.loc()+'}'+'字符!'.loc());
									this.setValue(oldValue);
									return;
								}
								if(!e.allowBlank&&newValue==''){
									this.setValue(oldValue);
								};
								for(var j=0;j<e.resourceTable.params.length;j++){
									tempParams[j] = [e.resourceTable.params[j][0],newValue,1] ;
								}
								e.resourceTable.params=tempParams;
							}
						}
				}));
			}
			PropPanel._id = _id;
			this.NavPanel.doLayout();
		}else{
			PropPanel.hide();
			this.NavPanel.doLayout();
			return;
		}
	}.createDelegate(this);

	TROver = function(tr){
		var proxy = new Ext.dd.DragSource(tr.id,{group:'columnDD'});
	}    
	TROut = function(tr){tr.className=""; }

//##### 资源区域右键菜单

	var nDelete,nPreview,nGroupOn,nGroupOff,nAddCol,nEdit;

	var sourceTableContextMenu = new Ext.menu.Menu({id:'sourceTableContext'});

	sourceTableContextMenu.add(
	  nAddCol=new Ext.menu.Item({
			handlerType:'nAddCol',
			text: '添加自定义列'.loc(), 
			cls: 'x-btn-icon bmenu',
			scope:this,
			icon: '/themes/icon/xp/addcol.gif',
			handler:  this.sourceTableContext}),
	  nDelete=new Ext.menu.Item({
			handlerType:'nTableDelete',
			text: '删除'.loc(), 
			scope:this,
			cls: 'x-btn-icon bmenu',
			icon: '/themes/icon/xp/delete.gif',
			handler:  this.sourceTableContext}),
	  nPreview=new Ext.menu.Item({
			handlerType:'nPreview',
			text: '预览'.loc(), 
			cls: 'x-btn-icon bmenu',
			scope:this,
			icon: '/themes/icon/xp/preview.gif',
			handler:  this.sourceTableContext})
	);

	var sourceItemContextMenu = new Ext.menu.Menu({id:'sourceItemContext'});

	sourceItemContextMenu.add(
	  nDelete=new Ext.menu.Item({
			handlerType:'nDelete',
			text: '删除'.loc(), 
			cls: 'x-btn-icon bmenu',
			scope:this,
			icon: '/themes/icon/xp/delete.gif',
			handler:  this.sourceTableContext}),
	  nEdit=new Ext.menu.Item({
			handlerType:'nEdit',
			text: '编辑'.loc(), 
			cls: 'x-btn-icon bmenu',
			scope:this,
			icon: '/themes/icon/all/table_edit.gif',
			handler:  this.sourceTableContext}),
	  nGroupOn=new Ext.menu.Item({
			handlerType:'nGroupOn',
			text: '设定分组项'.loc(), 
			cls: 'x-btn-icon bmenu',
			scope:this,
			icon: '/themes/icon/xp/group_on.gif',
			handler:  this.sourceItemContext}),
	  nGroupOff=new Ext.menu.Item({
			handlerType:'nGroupOff',
			text: '取消分组项'.loc(), 
			cls: 'x-btn-icon bmenu',
			scope:this,
			icon: '/themes/icon/xp/group_off.gif',
			handler:  this.sourceItemContext})
	);
	contextmenu = function(){
		var tr =event.srcElement?event.srcElement : event.target;
		while(tr.tagName!="TR") tr = tr.parentNode;
		if(tr.getAttribute("_id")){
			this.selectedTR=tr;
			sourceTableContextMenu.showAt([event.clientX,event.clientY]);
		}else{
			this.selectedTR=tr;
			sourceItemContextMenu.showAt([event.clientX,event.clientY]);
			var grouping = this.rt.isGroup(tr.getAttribute("col_name"));
			if(grouping){
				nGroupOff.disabled  ? nGroupOff.enable():'';
				nGroupOn.disabled  ? '':nGroupOn.disable();
			}else{
				nGroupOn.disabled  ? nGroupOn.enable():'';
				nGroupOff.disabled  ? '':nGroupOff.disable();
			}
			if(tr.getAttribute("category")=="V"){
				 nEdit.enable();
			}else{
				nEdit.disable();
			}
		}
	}.createDelegate(this);

	this.rt = new ResourceTable();
	var resTable=this.rt;

//------------------查询资源窗口构建，完成查询导入------------------------------------------

	this.NavButtonArray=[];

	this.NavButtonArray.push(new Ext.Toolbar.Fill());
	this.NavButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/xp/open.gif',
		cls: 'x-btn-icon',
		scope: this,
		hidden : false,
		tooltip:'导入查询'.loc(),
		handler: this.getSourceQuery,
		pressed: false
	}));
	this.TabNav = new Ext.Panel({
		region: 'center',
		autoScroll: true,
		width: 200,
		minSize: 180,
        border:false,
		collapsible: false,
	    split: false,
		html:'<table width="100%" height="100%" cellspacing cellpadding><tr><td bgcolor=white style="border:1 solid #7F9DB9"><div style="width:100%;height:100%;overflow:auto"><div id=source_query></div></div></td></tr></table>'
	});

	PropPanel=this.PropPanel = new  Ext.form.FormPanel({
		title: '属性'.loc(),
		region: 'south',
		style:'background-color:transparent;',
		bodyStyle: 'padding:4px',
		autoScroll: true,
		height: 120,
		labelAlign:'right',
		frame:false,
        border:false,
		bodyBorder:false,
		hidden:true,
		collapsible: false,
	    split: false
	});

	NavPanel=this.NavPanel = new Ext.Panel({
		region: 'west',
		layout:'border',
		autoScroll: false,
		width: 230,
		minSize: 180,
        border:true,
		collapsible: false,
	    split: false,
		tbar:this.NavButtonArray,
		items:[this.TabNav,this.PropPanel]
	});

	this.reportSpace= new Ext.Panel({
		region: 'center',
		autoScroll: false,
		frame:false,
        border:false,
		html:'<div id="workspace" class="workspace"></div><div id="CursorMarker"></div><div id="marker" onmouseup="stopTracking();"></div><div id="hideRows" style="background-color:white;z-Index:100;position:absolute;display:none;"></div><div id="hideCols" style="background-color:white;z-Index:100;position:absolute;display:none;"></div>'
	});
	this.reportMain = new Ext.Panel({		
        closable:false, 
		frame:false,
		region: 'center',
		layout:'border',
        border:false,
        items: [this.NavPanel,this.reportSpace]
	}); 
	this.operatePanel = new Ext.Panel({		
        closable:false, 
		region: 'north',
        border:false,
		html:'<div id="barsContainer"><div id="MenuPlaceholder" style="height: 25px;"></div><div id="Toolbar" class="xtoolbar" style="height: 26px; overflow: hidden;"><div id="xStandardBar" class="bar" style="position: absolute;"><div id="xStandardToolbar" class="bar-end"></div></div><div id="xFormatBar" class="bar" style="position: absolute; left: 168px;"><div id="xFormatToolbar" class="bar-end"></div></div><div id="xDynarangeBar" class="bar" style="position: absolute; left: 683px; width:100%"><div id="xDynarangeToolbar" class="bar-end"></div></div></div><div id="formulaBar"><table class="formula-bar-table"><tbody><tr><td valign="top"> <div id="currCoord"></div></td><td valign="top"> <div id="formulaTlb"></div></td><td style="width: 100%; height: 22px; padding-right: 1px;"><div id="formulaInfo"></div></td><td valign="top"><div id="expandBtn"></div></td></tr></tbody></table></div></div>'
	});
	this.MainTabPanel=new Ext.Panel({
			id: 'ReportMainTab',
			border:false,
			layout:'border',
			items:[this.operatePanel,this.reportMain]
	});
	this.MainTabPanel.on('destroy',function(){
		var Report=this.frames.get('Report');
		if(Report.saveReport){
			 Report.saveReport.win.hidden=false;
			 Report.saveReport.win.close();
		}
	},this);
	document.oncontextmenu = function(){return false;}
};

dev.report.ReportPanel.prototype={
	init : function(){	
		Ext.BLANK_IMAGE_URL = '/Ext/resources/images/default/s.gif';
		if (!dev.report) {
			dev.report = {
				util : {},
				gen : {},
				backend : {
					rpc : {}
				},
				kbd : {},
				dlg : {},
				palo : {},
				env : {},
				base : {
					env : {},
					app : {
						view:{}
					},
					general : {},
					grid : {},
					keyboard : {},
					mouse : {},
					range : {},
					sheet : {},
					style : {},
					book : {},
					wnd : {},
					dlg : {
						chart : {},
						format : {},
						control : {}
					},
					i18n : {},
					palo : {},
					action : {},
					hb : {},
					hl : {},
					format : {},
					cndfmt : {},
					formel : {},
					events : {},
					wsel : {},
					cmnt : {}
				}
			}
		};

		using("dev.report.model.XReport");
		dev.report.model.report=new dev.report.model.XReport();

		using("dev.report.base.Grid");
		dev.report.base.grid=new dev.report.base.Grid();

		using("dev.report.base.app.Globals");
		dev.report.base.app=new dev.report.base.app.Globals();

		dev.report.base.app.Report=this;

		dev.report.base.app.frames=this.frames;

		dev.report.base.app.defaultFiles = '';
		dev.report.base.app.appModeS = dev.report.base.app.appMode = dev.report.base.grid.viewMode.DESIGNER;
		dev.report.base.app.fopper = true;
		if (window == window.parent)
			window.onbeforeunload = function () { return ''; };
		
		using("dev.report.ENV");
		dev.report.env=new dev.report.ENV();

		using("dev.report.base.General");
		using("dev.report.base.i18n.loc_zh_CN");
		dev.report.i18n=dev.report.base.i18n;
		dev.report.base.general=new dev.report.base.General();
		dev.report.base.general.switchSuspendModeAlert = null;
		
    }, 
	newReport: function(params){	
		var Report=this.frames.get('Report');
		this.params=params;
		dev.report.base.app.params=this.params;
		this.state='create';
		this.params['method']='report';
		this.rt.clear();
		dev.report.model.report.removeAll();
		dev.report.model.report.id=params.parent_id;
		dev.report.base.general.startUp();
		dev.report.base.app.menubar.deleteItem.disable();
		if(this.MainTabPanel.rendered){
			this.frames.get("Report").mainPanel.setStatusValue(["",params.parent_id]);
		}
    },
	saveReport: function(option){	
		var me=this;
		var Report=me.frames.get('Report');
		if(option){
			dev.report.model.report.name=option.name;
			var xmlString=dev.report.model.report.toXML();
			if (Ext.isIE) {
				 xmlString=Tool.parseXML(xmlString).xml
			}else{
				xmlString=(new XMLSerializer()).serializeToString(Tool.parseXML(xmlString));
			}
		
			var msg = Tool.postXML("/dev/report/ReportEvent.jcp?event=save&forder_id="+option.forder_id+"&parent_id="+this.params['parent_id']+"&report_name="+encodeURI(option.name),xmlString);
			if(msg.firstChild.firstChild.nodeValue=='true'){
				if(option.method=='create'){
					Report.navPanel.getTree().loadSubNode(msg.lastChild.firstChild.nodeValue,Report.navPanel.clickEvent);
				}
				dev.report.base.app.menubar.deleteItem.enable();
				Ext.msg("info",'完成报表创建!'.loc());
			}else{
				Ext.msg("error",'查询保存失败,原因:<br>'.loc()+msg.lastChild.firstChild.nodeValue);
			}
		}
    },
	loadData : function(params){	
		var me=this;
		var Report=me.frames.get('Report');
		me.params=params;
		me.params['method']='report';
		dev.report.base.app.params=me.params;
		me.state='edit';
		var option = Tool.getXML("/dev/report/ReportEvent.jcp?event=open&report_id="+me.params['report_id']);
		if(option){             
			var re = /\t/g;
			var xmlVal="";
			if (Ext.isIE) {
				xmlVal = option.firstChild.xml.replace(re,'    ');
			}else{
				xmlVal=(new XMLSerializer()).serializeToString(option.firstChild);
			}
			this.rt.clear();
			var reportXml=Tool.parseXML(xmlVal);
			dev.report.model.report.init(reportXml);
			dev.report.model.report.id=params.parent_id;
			dev.report.base.general.startUp();
			dev.report.base.app.menubar.deleteItem.enable();
			me.frames.get("Report").mainPanel.setStatusValue([option.getAttribute("name"),params.parent_id,option.getAttribute("modifyName"),option.getAttribute("modifyTime")]);
		} 
    },
	sourceTableContext: function(item){	
		if(item.handlerType=='nAddCol'){
			using("dev.report.AddColumnWindow");
			var AddColumnWindow = new dev.report.AddColumnWindow(this.rt.columns,this.rt);
			AddColumnWindow.show();
		}else if(item.handlerType=='nTableDelete'){
			var tr = this.selectedTR;
			var start;
			var end;
			var _id = tr.getAttribute("_id");
			Ext.msg('confirm', '确定删除引用资源表?'.loc()+'['+tr.getAttribute("_id")+']?', function (answer){
				   if (answer == 'yes') {
						this.rt.removeNode(_id);
						while(tr&&(tr.getAttribute("_parent")==_id || tr.getAttribute("_id")==_id)){
							end = tr.rowIndex;
							tr = tr.nextSibling;
						}
				  }else{
					return;
				  } 
				 if(this.rt.list.length==0)
					source_query.innerHTML = '';
				 	PropPanel.removeAll();
					PropPanel.hide();
					NavPanel.doLayout();
			 }.createDelegate(this));
		}else if(item.handlerType=='nEdit'){
			var tr = this.selectedTR;
			var col_name = tr.getAttribute("col_name");
			using("dev.report.AddColumnWindow");
			var AddColumnWindow = new dev.report.AddColumnWindow(this.rt.columns,this.rt,col_name);
			AddColumnWindow.show();
		}else if(item.handlerType=='nDelete'){
			var tr = this.selectedTR;
			var start;
			var end;
			start = this.selectedTR.rowIndex
			var col_name = tr.getAttribute("col_name");
			 Ext.msg('confirm', '确定删除资源列?'.loc()+'['+tr.getAttribute("col_name")+']?', function (answer){
				   if (answer == 'yes') {
						this.rt.removeItem(col_name);
						if(this.rt.isGroup(col_name))
							this.rt.removeGroup(col_name)
						end = start;
				  }else{
					return;
				  }
				  var table = source_query.children[0];
				  for(var i=start;i<=end;i++)
						table.deleteRow(start);
			 }.createDelegate(this));
		}else if(item.handlerType=='nPreview'){
			using("dev.query.ParamsWindow");
			using("dev.query.DataPreview");
			var o = this.rt.getByID(this.selectedTR.getAttribute("_id"));
			var url = 'query_name='+o.tableName+'&query_id='+o.query_id+'&server='+o.server;
			var paramString='';
			var paramValue='';
			if(o.params){
				for(var i=0;i<o.params.length;i++){
					var param = o.params[i];
					if(param[1].trim()=='')
						continue;
					paramString+='::'+param[0];
					paramValue+='&field'+i+'='+param[1];
				}
			}
			url+='&param='+paramString.substring(2)+paramValue;
			columArray=[];
			dataArray=[];
			for(var j=0;j<o.columns.length;j++){
				if(o.columns[j].category=='F'){
					dataArray.push({name: o.columns[j].name});
					columArray.push({header:o.columns[j].name, dataIndex: o.columns[j].name, sortable: true, align: 'right'});
				}
			}
			var queryDataWindow =new dev.query.DataPreview('',encodeURI(url),columArray,dataArray);
			queryDataWindow.show();
		}
    },
	getSourceQuery : function(item){
		using("dev.query.ColumnsWindow");
		var columnsWindow = new dev.query.ColumnsWindow(this.rt,this.params['parent_id'],'report');
		columnsWindow.show();
    },	
	sourceItemContext: function(item){	
		if(item.handlerType=='nGroupOn'){
				var tr = this.selectedTR;
				tr.children[0].children[0].src=getImg("menutree/grouping");
				var group=new dev.report.model.XGroup("G_"+tr.getAttribute("col_name"));
				var groupExpression=new dev.report.model.XGroupExpression();
				groupExpression.expression='$F{'+tr.getAttribute("col_name")+'}';
				group.groupExpression=groupExpression;
				dev.report.model.report.addGroup(group);

		}else if(item.handlerType=='nGroupOff'){
				var tr = this.selectedTR;
				tr.children[0].children[0].src=getImg("menutree/column");
				dev.report.model.report.removeGroup("G_"+tr.getAttribute("col_name"));
		}
    }
};
