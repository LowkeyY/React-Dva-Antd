Ext.namespace("dev.folder");

dev.folder.FolderWindow = function(type,method,parent_id,top_id,frames,mainWin){
   
	this.frames=frames;
	var Query=this.frames.get('Query');
	this.win;
	this.mainWin=mainWin;

	this.FolderButtonArray=[];
	this.FolderButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/common/create.gif',
		cls: 'x-btn-icon',
		scope: this,
		btnId:'newFolder',
		hidden : false,
		tooltip: '<b>'+'新建文件夹'.loc()+'</b>',
		handler:function(){
			 this.createClick();
		}
	}));
	this.FolderButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/common/delfolder.gif',
		cls: 'x-btn-icon',
		scope: this,
		btnId:'delete',
		hidden : false,
		tooltip: '<b>'+'删除'.loc()+'</b>',
		handler:function(){
			 this.deletedClick();
		}
	}));
	this.FolderButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/common/rename.gif',
		cls: 'x-btn-icon',
		scope: this,
		btnId:'rename',
		hidden : false,
		tooltip: '<b>'+'重命名'.loc()+'</b>',
		handler:function(){
			 this.renameClick();
		}
	}));
	this.FolderButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/common/refresh.gif',
		cls: 'x-btn-icon',
		scope: this,
		btnId:'refresh',
		hidden : false,
		tooltip: '<b>'+'刷新'.loc()+'</b>',
		handler:function(){
			 this.refreshClick();
		}
	}));
	this.mainPanel=new Ext.Panel({
			layout:'fit',
			border:true,
			region:'center',
			split:false,
			collapsible: false,
            width: 470,
			height: 252,
			x:10,
			y:40
	});  
	var typeCmb;
	var fileTypes=[["0",'查询'.loc()],["1",'报表'.loc()],["2",'OLAP设计'.loc()]];
	var fileTypesStore=new Ext.data.SimpleStore({fields:["code","option"],data:fileTypes});
	var saveTypes=[["0",'查询'.loc()],["1",'报表'.loc()],["2",'OLAP设计'.loc()]];
	var saveTypesStore=new Ext.data.SimpleStore({fields:["code","option"],data:saveTypes});
	var fileNameCmb=new Ext.form.TextField({
		fieldLabel:'名称'.loc(),
		typeAhead:true,
		editable:true,
		mode:"local",
		triggerAction:"all",
		width:280
	});
	var fileTypesCmb=new Ext.form.ComboBox({
		fieldLabel:'类型'.loc(),
		width:280,
		store:fileTypesStore,
		displayField:"option",
		valueField:"code",
		typeAhead:true,
		disabled:true,
		editable:false,
		mode:"local",
		value:0,
		triggerAction:"all",
		selectOnFocus:true,
		listeners:{
			select:function(cmb,record,index){
				if(cmb.getValue()==0){
					//that.fStore.filterBy(filterFunc)
				}else{
					//that.fStore.clearFilter(false)}
				}
			}
		}
	});
	var saveTypesCmb=new Ext.form.ComboBox({
		fieldLabel:'保存类型'.loc(),
		width:280,
		store:saveTypesStore,
		displayField:"option",
		valueField:"code",
		typeAhead:true,
		disabled:true,
		editable:false,
		mode:"local",
		value:0,
		triggerAction:"all",
		selectOnFocus:true
	});
	if(type==0){
		title='打开'.loc();
		typeCmb=fileTypesCmb
	}else{
		title='另存为'.loc();
		typeCmb=saveTypesCmb
	}
	this.southPanel=new Ext.Panel({
			layout:"form",
			border:false,
			baseCls:"top-left-bottom-panel",
			width:480,
			labelAlign:'right',
			height:120,
			x:30,  
			y:300,
			items:[fileNameCmb,typeCmb]
	}); 

	var gCmb=new Ext.form.TextField({
		fieldLabel:'路径'.loc(),
		readOnly:true,
		width:260
	});

	var title;
	var btn;
	var menuTree;
	var openBtn=new Ext.Button({text:'打开'.loc(),scope:this,handler:function(){
		var node = menuTree.getNowNode();
		var _id = node.prop._id;
		var xml = null;  
		/*if(isNaN(_id)){
			Ext.msg("error",'打开文件错误!请重新选择!'.loc());
			return;
		}*/
			
		if(top_id==200)
			xml = Tool.getXML("/dev/query/OpenQuery.jcp?query_id="+_id);
		else
			xml = Tool.getXML("/dev/report/ReportEvent.jcp?event=open&report_id="+_id);
		if(!xml){
			Ext.msg("error",'打开文件错误!请重新选择'.loc()+'<br>');
			return;
		}
		if(top_id==200){
			Query.queryPanel.loadQuery(_id,xml);
		}else{
			var option=xml;
			if(option){			
				Report=frames.get('Report');
				if(Report.reportPanel.state=='edit')
					Report.navPanel.getTree().loadParentNode(Report.navPanel.clickEvent);
				var re = /\t/g;
				var xmlString="";
				var rptXml=option.firstChild;
				if (Ext.isIE) {
					 xmlString=rptXml.xml
				}else{
					xmlString=(new XMLSerializer()).serializeToString(rptXml);
				}
				xmlString= xmlString.replace(re,'    ');
				var params={};
				Report.reportPanel.state='create';
				params['method']='report';
				var reportXml=Tool.parseXML(xmlString);
				dev.report.model.report.init(reportXml);
				dev.report.base.general.startUp();
				dev.report.base.app.menubar.deleteItem.enable();
			}
		}
		this.win.close();
	}});
	var saveBtn=new Ext.Button({text:'保存'.loc(),scope:this,handler:function(){
		var node = menuTree.getNowNode();
		var qName = fileNameCmb.getValue();
		if(/[\<\>\'\"\&]/.test(qName)){
			Ext.msg("error",'名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc());
			return;
		}
		var rv = new Object();
		rv.method = "create";
		rv.query_id = -1;

		if (node.prop.forder_id==null&&node.prop.title == qName && node.prop.event != "eventForder"){
			 Ext.msg('confirm', '文件夹下有同名文件,是否覆盖?'.loc(), function (answer){
			   if (answer == 'yes') {
					rv.method = "update";
					rv._id = node.prop._id;
					rv.forder_id = node.prop._parent.substring(1);
					saveIt(rv);
				 } 
			 }.createDelegate(this));
		}else if (node.prop.forder_id!=null){
			var forder_id = node.prop.forder_id.substring(1);
			if(qName==""){
				Ext.msg("error",'请输入保存文件名!'.loc()+'<br>');
				return;
			}
			var son = node.son;
			if(son){
				for(var i=0;i<son.length;i++){
					var o = son[i];
					if(o.prop.title == qName && o.prop.event != "eventForder"){
						 Ext.msg('confirm', '文件夹下有同名文件,是否覆盖?'.loc(), function (answer){
						   if (answer == 'yes') {
								rv.method = "update";
								rv._id = o.prop._id;
								rv.forder_id = forder_id;
								saveIt(rv);
							 } 
						 }.createDelegate(this));
					}
				}
			}
			rv.forder_id = forder_id;
			rv.name = qName;
			saveIt(rv);
		}else{
			Ext.msg("error",'请选择保存的目录!'.loc()+'<br>');
			return;
		}
		this.win.close();	
	}});

	function saveIt(rv){
		if(top_id==200){
			Query.queryPanel.saveQuery(rv);
		}else{
			Report=frames.get('Report');
			if(this.mainWin){
				dev.report.base.app.Report.saveReport(rv);
			}else{
				Report.saveReport.saveReport(rv);
			}
		}
	}

	var cancelBtn=new Ext.Button({text:'取消'.loc(),scope:this,handler:function(){this.win.close()}});

	function initInterface(){
		if(type==0){
			title='打开'.loc();
			btn=openBtn
		}else{
			title='另存为'.loc();
			btn=saveBtn}
	}
	initInterface();

	this.win =  new Ext.Window({
		title:title,
		closable:true,
		closeAction:"close",
		autoDestroy:true,
		plain:true,
		constrain:true,
		cls:"default-format-window",
		modal:true,
		resizable:false,
		animCollapse:false,
		layout:"fit",
		width:500,
		height:425,
		buttons:[btn,cancelBtn],
		items:[
			new Ext.Panel({
				layout:"absolute",
				baseCls:"x-plain",
				border:false,
				width:535,
				height:425,
				items:[{
					layout:"column",
					border:false,
					baseCls:"x-plain",
					width:535,
					height:30,
					x:5,
					y:10,
					items:[{
							layout:"form",
							border:false,
							width:340,
							baseCls:"x-plain",
							labelAlign:'right',
							labelWidth:70,
							items:gCmb
						},{  
							border:false,
							bodyStyle:'background:transparent;padding:10px 0 5px 0;',
							width:130,
							height:20,
							tbar:tb=new Ext.Toolbar({
								style:'background-image:none;border:none;background-color:Transparent;height:18px',
								items:this.FolderButtonArray}
							)
						}
			]},this.mainPanel,this.southPanel]
	})]});

	this.win.on('show',function(){
		var eventForder = new Object();
		eventForder.reload_forder = function(){
			this.loadXML(Tool.getXML("/dev/folder/ListFolder.jcp?method="+method+"&parent_id="+parent_id+"&forder_id="+this.prop.forder_id));
		}
		eventForder.title_click = function(){
			tb.items.each(function(item){ 
				if(item.btnId=='newFolder')
					item.enable();
				if(item.btnId=='rename')
					item.enable();
				if(item.btnId=='refresh')
					item.enable();
			}, tb.items);

			
			if(type==0){
				fileNameCmb.setReadOnly(true);
				btn.disable();
			}else{
				fileNameCmb.setReadOnly(false);
				btn.enable();
			}
			fileTypesCmb.disable();
			if(top_id==200){
				fileTypesCmb.setValue("0");
			}else{
				fileTypesCmb.setValue("1");
			}
			var forder_title = this.prop.title;
			var titles=this.getPathBy("title");
			var titlsString=titles.join("/");
			gCmb.setValue("/"+titlsString);
		}

		var query_tab = new Object();
		query_tab.title_click = function(){
			tb.items.each(function(item){ 
				if(item.btnId=='newFolder')
					item.disable();
				if(item.btnId=='rename')
					item.disable();
				if(item.btnId=='refresh')
					item.disable();
			}, tb.items);

			var title = this.prop.title;
			fileNameCmb.setValue(title);
			fileTypesCmb.setValue("0");
			if(type==0||type==1){
				fileNameCmb.setReadOnly(true);
				fileTypesCmb.disable();
				btn.enable();
			}else{
				btn.disable();
			}
			var titles=this.getPathBy("title");
			var titlsString=titles.join("/");
			gCmb.setValue("/"+titlsString);
		}
		var report_tab = new Object();
		report_tab.title_click = function(){
			tb.items.each(function(item){ 
				if(item.btnId=='newFolder')
					item.disable();
				if(item.btnId=='rename')
					item.disable();
				if(item.btnId=='refresh')
					item.disable();
			}, tb.items);
			
			if(type==0||type==1){
				fileNameCmb.setReadOnly(true);
				fileTypesCmb.disable();
				btn.enable();
			}else{
				btn.disable();
			}
			var title = this.prop.title;
			fileNameCmb.setValue(title);
			var titles=this.getPathBy("title");
			var titlsString=titles.join("/");
			gCmb.setValue("/"+titlsString);
		}

		var folderWin=this.win;
		menuTree = new MenuTree(Tool.getXML("/dev/folder/ListFolder.jcp?method="+method+"&parent_id="+parent_id+"&top_id="+top_id));
		menuTree.setEvent("eventForder",eventForder);
		menuTree.setEvent("query_tab",query_tab);
		menuTree.setEvent("report_tab",report_tab);

		var titles = new Array();

			//新建文件夹
	   this.createClick = function(){
		var node = menuTree.getNowNode();
		var forder_id = node.prop.forder_id.substring(1);
		var suffix = "";
		node.open(true);
		var son = node.son;
		if(son){
			for(var i=0;i<son.length;i++){
				if(son[i].prop.objectType=="4")
					continue;
				if(son[i].prop.title=='新建文件夹'.loc()+suffix){
					suffix='('+(i+1)+')';
					i = 0;
				}
			}
		}
		var msg = Tool.getXML("/dev/folder/FolderEvent.jcp?event=create&forder_id="+forder_id+"&objectId="+parent_id+"&title="+encodeURI('新建文件夹'.loc())+suffix);				
		if(msg.firstChild.firstChild.nodeValue=='true'){
			menuTree.initNode(node);
			node.open(true);
		}else{
			Ext.msg("error",'查询保存失败,原因:'.loc()+'<br>'+msg.lastChild.firstChild.nodeValue);
		}	
	}
	//删除文件夹
	this.deletedClick = function(){
		var node = menuTree.getNowNode();
		var forder_id = node.prop.forder_id ? node.prop.forder_id.substring(1) : node.prop._parent.substring(1);
		var _id = node.prop._id;
		var check = node.prop.event!="eventForder";
		 Ext.msg('confirm', '警告:删除'.loc()+'['+node.prop.title+']'+'将不可恢复,确认吗?'.loc(), function (answer){
			   if (answer == 'yes') {
					var msg;
					if(check){
						if(top_id==200){
							msg = Tool.getXML("/dev/query/QueryEvent.jcp?event=delete&query_id="+_id);
						}else{
							msg = Tool.getXML("/dev/report/ReportEvent.jcp?event=delete&report_id="+_id);
						}
					}else
						msg = Tool.getXML("/dev/folder/FolderEvent.jcp?event=delete&top_id="+top_id+"&objectId="+parent_id+"&forder_id="+forder_id);
					
					if(msg.firstChild.firstChild.nodeValue=='true'){
						node.parent.open(true);
					}else{
						Ext.msg("error",'查询保存失败,原因:'.loc()+'<br>'+msg.lastChild.firstChild.nodeValue);
					}	
			  } 
		 }.createDelegate(this));
	}
	//重命名文件夹
	this.renameClick = function(){
		var node = menuTree.getNowNode();
		menuTree.initNode(node);
		var forder_id = node.prop.forder_id.substring(1);

		var attr = node._div.children[1].attributes;
		var div = node._div.children[1].children[1];

		var old_href = attr.getNamedItem("href");
		attr.removeNamedItem("href");

		var old_html = div.innerHTML;
		var old_title = node.prop.title;
		var css = div.className;
		div.className="";
		div.innerHTML='<input type="text" value="'+old_title+'" style="border:1px solid #000000;height:16px;">';

		var input = div.children[0];
		input.select();
		input.onblur = function(){
			var title = input.value.trim();
			if(title == old_title){
				div.className = css;
				div.innerHTML = old_html;
				attr.setNamedItem(old_href);
				return ;
			}
			node.parent.open(true);
			var son = node.parent.son;
			for(var i=0;i<son.length;i++){
				if(title == son[i].prop.title && son[i].prop.event=="eventForder"){
					Ext.msg("error",'无法重命名'.loc()+title+':指定的文件与现有文件重名.请指定另外一个文件名.'.loc());
					input.value = old_title;
					input.select();
					return;
				}
			}
			var msg = Tool.getXML("/dev/folder/FolderEvent.jcp?event=update&forder_id="+forder_id+"&objectId="+parent_id+"&title="+encodeURI(title));
			
			if(msg.firstChild.firstChild.nodeValue=='true'){
				node.parent.open(true);
			}else{
				Ext.msg("error",'查询保存失败,原因:'.loc()+'<br>'+msg.lastChild.firstChild.nodeValue);
			}	
		}
	}
	//刷新
	this.refreshClick = function(){
		var node = menuTree.getNowNode();
		menuTree.initNode(node);
		node.open(true);
	}
	menuTree.finish(this.mainPanel.body.dom,document);
    },this);
};
Ext.extend(dev.folder.FolderWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
    }
});          

