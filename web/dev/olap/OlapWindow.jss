Ext.namespace("dev.olap");

dev.olap.OlapWindow = function(type,method,parent_id,top_id,frames){
   
	this.frames=frames;
	var Query=this.frames.get('Query');
	var OLAP = this.frames.get('OLAP');
	this.win;

	this.FolderButtonArray=[];
	this.FolderButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/common/create.gif',
		cls: 'x-btn-icon',
		scope: this,
		btnId:'newFolder',
		hidden : false,
		tooltip: '<b>新建文件夹</b>',
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
		tooltip: '<b>删除</b>',
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
		tooltip: '<b>重命名</b>',
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
		tooltip: '<b>刷新</b>',
		handler:function(){
			 this.refreshClick();
		}
	}));
	this.northPanel=new Ext.Panel({
		layout:'fit',
		region: 'north',
		border:false,
		split: false,
		frame:false,
		height: 30,
		collapsible: false,     
		bodyCssClass:'x-window-mc',
		margins:'10 0 0 0',
		html:'<table  cellpadding=0 cellspacing=0><tr><td width="88"  height="22"  align="right">地址:</td> <td width="6"></td><td  style="height:18;width:260;background-color:window;border:1px solid #7F9DB9;" id="path" ></td><td><span style="height:18"></span><span style="height:18" id=btBar></span></td></tr><tr height="6"><td colspan=4></td></tr></table>'
	});  

	this.mainPanel=new Ext.Panel({
			layout:'fit',
			border:true,
			region:'center',
			split:false,
			collapsible: false,
            width: 448,
			height: 282,
            margins:'3 15 3 60'
	});  

	this.southPanel=new Ext.Panel({
			layout:'fit',
			border:false,
			region:'south',
			split:false,
			collapsible: false,
			height: 80,
			bodyCssClass:'x-window-mc',
			html:'<table cellpadding cellspacing width=544><tr><td width="54" align="right" align="center" valign="top"><div></div></td><td width="6"></td><td><table cellpadding cellspacing><tr height="6"><td></td></tr><tr height="22"><td><nobr><span style="width:83;height:18">名称:</span><input class=path style="height:22;width:246" id="fname" disabled value="新建名称"><span style="width:33"></span><button style="width:75px;height:22" id=submit>确定</button></nobr></td></tr><tr height="6"><td></td></tr><tr height="22"> <td><nobr> <span style="width:83;height:18">文件类型:</span><select class=path style="height:22;width:246" disabled><option value="查询" selected>查询</option></select><span style="width:33"></span><button style="width:75px;height:22" id=cancel>取消</button></nobr></td></tr></table></td></tr></table>'
	});  

	this.win =  new Ext.Window({
		title:'选择数据表或查询',
		layout:'border',
		width:535,
		height:425,
		plain: true,
		modal:true,
		items: [this.northPanel,this.mainPanel,this.southPanel]
	});

	this.win.on('show',function(){
		var menuTree;
		var eventForder = new Object();
		
		var tb=new Ext.Toolbar({
			cls:'db-player-toolbar',
			style:'background-image:none;border:none;background-color:Transparent;height:18px',
			applyTo:'btBar',
			items:this.FolderButtonArray}
		);

		eventForder.reload_forder = function(){
			this.loadXML(Tool.getXML("/dev/olap/ListFolder.jcp?method="+method+"&parent_id="+parent_id+"&forder_id="+this.prop.forder_id));
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
			if(type==0)
				submit.disabled = true;
			else
				submit.disabled = false;
			var forder_title = this.prop.title;
			path.innerHTML="<img class=icon align=absbottom src='"+getImg(this.prop.icon1)+"'> "+forder_title;
			titles = this.getPathBy("title");
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

			if(type==0||type==1)
				submit.disabled = false;
			else
				submit.disabled = true;

			var title = this.prop.title;
			if(title.length>16)
				title = title.left(16)+'...';
			path.innerHTML="<img class=icon align=absbottom src='"+getImg(this.prop.icon1)+"'> "+title;
			fname.value = this.prop.title;
			fname.query_id = this.prop._id;
			titles = this.parent.getPathBy("title");
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
			if(type==0||type==1)
				submit.disabled = false;
			else
				submit.disabled = true;

			var title = this.prop.title;
			if(title.length>16)
				title = title.left(16)+'...';
			path.innerHTML="<img class=icon align=absbottom src='"+getImg(this.prop.icon1)+"'> "+title;
			fname.value = this.prop.title;
			fname.report_id = this.report_id;
			titles = this.parent.getPathBy("title");
		}

		var folderWin=this.win;
		menuTree = new MenuTree(Tool.getXML("/dev/olap/ListFolder.jcp?method="+method+"&parent_id="+parent_id+"&top_id="+top_id));
		menuTree.setEvent("eventForder",eventForder);
		menuTree.setEvent("query_tab",query_tab);
		menuTree.setEvent("report_tab",report_tab);

		if(type==1){
			fname.value = "";
			fname.disabled = false;
		}
		path.innerHTML = "<img style='height:18px;width:18px' class=icon  src='/themes/images/root.png'> 请选择目录";

		//tb.renderTo(Ext.getCmp('btBar'));

		////////////////////////////////////////////////
		//////////////////用户事件
		var titles = new Array();

//提交\确定
		submit.onclick = function(){
			var node = menuTree.getNowNode();
			var qName = fname.value;
			if(/[\<\>\'\"\&]/.test(qName)){
				Ext.msg("error","名称中不应有&、<、>、'、\"、字符");
				return;
			}
			if(type==1){		//保存
				var rv = new Object();
				rv.method = "create";
				rv.query_id = -1;
				if (node.prop.forder_id==null&&node.prop.title == qName && node.prop.event != "eventForder"){
					 Ext.msg('confirm', '文件夹下有同名文件,是否覆盖?', function (answer){
					   if (answer == 'yes') {
							rv.method = "update";
							rv._id = node.prop._id;
						 } 
					 }.createDelegate(this));

				}else if (node.prop.forder_id!=null){
					var forder_id = node.prop.forder_id.substring(1);
					if(qName==""){
						Ext.msg("error",'请输入保存文件名！<br>');
						return;
					}
					var son = node.son;
					if(son){
						for(var i=0;i<son.length;i++){
							var o = son[i];
							if(o.prop.title == qName && o.prop.event != "eventForder"){
								 Ext.msg('confirm', '文件夹下有同名文件,是否覆盖?', function (answer){
								   if (answer == 'yes') {
										rv.method = "update";
										rv._id = o.prop._id;
									 } 
								 }.createDelegate(this));
							}
						}
					}
					rv.forder_id = forder_id;
				}else{
					Ext.msg("error",'请选择保存的目录！<br>');
					return;
				}
				rv.name = qName;

				if(top_id==200){
					Query.queryPanel.saveQuery(rv);
				}else{
					Report=frames.get('Report');
					Report.saveReport.saveReport(rv);
				}
				folderWin.close();
			}else if(type==0){		//打开
				var _id = node.prop._id;
				var xml = null;  
				if(isNaN(parseInt(_id))){
					Ext.msg("error",'打开文件错误！请重新选择！');
					return;
				}
					
				if(top_id==200)
					xml = Tool.getXML("/dev/query/OpenQuery.jcp?query_id="+_id);
				else
					xml = Tool.getXML("/dev/olap/OLAPEvent.jcp?event=open&olap_id="+_id);
				if(!xml){
					Ext.msg("error",'打开文件错误!请重新选择<br>');
					return;
				}
				if(top_id==200){
					Query.queryPanel.loadQuery(_id,xml);
				}else{
					var option=xml;
					OLAP.olapPanel.loadData(option);
				}
				folderWin.close();
			}
		};
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
				if(son[i].prop.title=='新建文件夹'+suffix){
					suffix='('+(i+1)+')';
					i = 0;
				}
			}
		}
		var msg = Tool.getXML("/dev/folder/FolderEvent.jcp?event=create&forder_id="+forder_id+"&objectId="+parent_id+"&title="+encodeURI("新建文件夹")+suffix);				
		if(msg.firstChild.firstChild.nodeValue=='true'){
			menuTree.initNode(node);
			node.open(true);
		}else{
			Ext.msg("error",'查询保存失败,原因:<br>'+msg.lastChild.firstChild.nodeValue);
		}	
	}
	//删除文件夹
	this.deletedClick = function(){
		var node = menuTree.getNowNode();
		var forder_id = node.prop.forder_id ? node.prop.forder_id.substring(1) : node.prop._parent.substring(1);
		var _id = node.prop._id;
		var check = node.prop.event!="eventForder";
		 Ext.msg('confirm', '警告：删除['+node.prop.title+']将不可恢复，确认吗?', function (answer){
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
						Ext.msg("error",'查询保存失败,原因:<br>'+msg.lastChild.firstChild.nodeValue);
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
					Ext.msg("error",'无法重命名 '+title+':指定的文件与现有文件重名.请指定另外一个文件名.');
					input.value = old_title;
					input.select();
					return;
				}
			}
			var msg = Tool.getXML("/dev/folder/FolderEvent.jcp?event=update&forder_id="+forder_id+"&objectId="+parent_id+"&title="+encodeURI(title));
			
			if(msg.firstChild.firstChild.nodeValue=='true'){
				node.parent.open(true);
			}else{
				Ext.msg("error",'查询保存失败,原因:<br>'+msg.lastChild.firstChild.nodeValue);
			}	
		}
	}
		//刷新
		this.refreshClick = function(){
			var node = menuTree.getNowNode();
			menuTree.initNode(node);
			node.open(true);
		}
		cancel.onclick = function(){
			folderWin.close();
		}
		menuTree.finish(this.mainPanel.body.dom,document);
    },this);
};
Ext.extend(dev.olap.OlapWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
    }
});          

