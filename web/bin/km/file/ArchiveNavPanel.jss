
bin.km.file.ArchiveNavPanel = function(){
	this.nowNode;        
	var conn=new Ext.data.Connection();
	conn.request({    
				method: 'GET',    
				url:'/bin/km/file/getOrg.jcp?'
	});				
	conn.on('requestcomplete', function(conn, oResponse ){	
			var orgJSON = Ext.decode(oResponse.responseText);
			var name=orgJSON.shortName;
			if(name==""){
				name=orgJSON.name;
			}
			this.orgid=orgJSON.id;
			this.orgname=name;

		},this);
	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '新建'.loc(),
				btnId:'new',
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :function(){
						Ext.MessageBox.show({
						   title: '档案室'.loc(),
						   msg: '在'.loc()+this.frames.get('nowNodeTitle')+'新建'.loc(),
						   width:300,
						   buttons: Ext.MessageBox.OKCANCEL,
						   prompt : true,
						   fn: this.saveIt,
						   animEl: 'navtoolbar'
					   });
				}
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '修改'.loc(),
				btnId:'update',
				icon: '/themes/icon/common/update.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :function(){
							Ext.MessageBox.show({
							   title: '档案室'.loc(),
							   msg: '输入名称:'.loc(),
							   value:this.frames.get('nowNodeTitle'),
							   width:300,
							   buttons: Ext.MessageBox.OKCANCEL,
							   prompt : true,
							   fn: this.updateIt,
							   animEl: 'navtoolbar'
						   });
						}
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '删除'.loc(),
				btnId:'del',
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :function(){
					Ext.msg('confirm', '确认删除?'.loc(), function (answer){
						if (answer == 'yes') {
							var delParams=this.frames.get('params');
							delParams['type']='delete';
							Ext.Ajax.request({
								url: '/bin/km/file/opArchive.jcp',
								method:'POST',
								params: delParams,
								success: function(){ 
									this.getTree().loadParentNode(this.clickEvent);
								},
								failure: function(){ 
									    Ext.msg("error",'数据提交失败!'.loc());
								},
								scope: this
							});
					  } 
					}.createDelegate(this));
				}
	}));
	this.hideToolBar=function(){	
		var  tempToolBar=this.innerPanel.getTopToolbar();
		tempToolBar.items.each(function(item){  
			try{
				item.disable();
			}catch(e){}
		}, tempToolBar.items);
    };
	this.showToolBar=function(state){	
		var  tempToolBar=this.innerPanel.getTopToolbar();
		tempToolBar.items.each(function(item){ 
			try{
				if(item.btnId==state)
					item.enable();
			}catch(e){}
		}, tempToolBar.items);
    };
	this.saveIt=function(btn,text){
		if(btn=='ok'){
			Ext.msg("error",this.frames.get('params'));
			var saveParams=this.frames.get('params');
			saveParams['type']='save';
			saveParams['name']=text;
			if(text.length>50){
				Ext.msg("error",'数据保存失败!,原因:字符数大于50'.loc());
				return;
			}else if(text==null||text.length==0){
				Ext.msg("error",'数据保存失败!,原因:新建分类不能为空'.loc());
				return;
			}else if(/[\<\>\'\"\&]/.test(text)){
				Ext.msg("error",'不应有'.loc()+'&,<,>,\",'+'字符'.loc());
				return;
			}
			Ext.Ajax.request({
				url: '/bin/km/file/opArchive.jcp',
				method:'POST',
				params: saveParams,
				scope:this,
				success:function(response, options){ 
						var check = response.responseText;
						var ajaxResult=Ext.util.JSON.decode(check);
						if(ajaxResult.success){
							this.getTree().loadSubNode(ajaxResult.archive_id,this.clickEvent);
						}else{
							    Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
						}
				},
				scope: this
			});
		}
    }.createDelegate(this);
	this.updateIt=function(btn,text){
		if(btn=='ok'){
			var saveParams=this.frames.get('params');
			saveParams['type']='updatesave';
			saveParams['name']=text;
			if(text.length>50){
				Ext.msg("error",'数据修改失败!,原因:字符数大于50'.loc());
				return;
			}else if(text==null||text.length==0){
				Ext.msg("error",'数据保存失败!,原因:新建分类不能为空'.loc());
				return;
			}else if(/[\<\>\'\"\&]/.test(text)){
				Ext.msg("error",'不应有'.loc()+'&,<,>,\",'+'字符'.loc());
				return;
			}
			Ext.Ajax.request({
				url: '/bin/km/file/opArchive.jcp',
				method:'POST',
				params: saveParams,
				success:function(response, options){ 

						var check = response.responseText;
						var ajaxResult=Ext.util.JSON.decode(check);
						if(ajaxResult.success){
							this.getTree().loadSelfNode(ajaxResult.kind_id,this.clickEvent);
						}else{
							    Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
						}
				},
				scope: this
			});
		}
    }.createDelegate(this);
	this.innerPanel = new Ext.Panel({
		border: false,
		layout: 'fit',
		tbar:ButtonArray
	}); 
	bin.km.file.ArchiveNavPanel.superclass.constructor.call(this, {
            title: '部门导航'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            margins:'0 0 0 0',
            cmargins:'0 0 0 0',
			items: [this.innerPanel]	
    });

};
Ext.extend(bin.km.file.ArchiveNavPanel, Ext.Panel, {
	init: function(){
			this.createTree(this.orgid,this.orgname);

			this.menuTree.finish(this.body.dom,document);
			this.focusHistoryNode();
	},
	createTree:function(orgid,pname){
		var xml='<root _id="root">'
				+'<forder _hasChild="1" event="event1">'
				+'<e _id="'+orgid+'" _parent="root" title="'+pname+'"  type="view"  params="pid='+orgid+'&amp;archive_id='+orgid+'" '
					+'url="/bin/km/file/tree.jcp?dept_id='+orgid+'"   '
					+'icon0="/themes/icon/all/chart_organisation.gif" icon1="/themes/icon/all/chart_organisation.gif"/>'
				+'</forder>'
				+'</root>';
		this.menuTree = new MenuTree(Tool.parseXML(xml));
	
		this.clickEvent=function(clickNode){
				var type=clickNode.prop.type;
				this.frames.set('nowNodeTitle',clickNode.prop.title);
				var paramString=clickNode.prop.params.split('&');
				var params={};
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}
				this.frames.set('params',params);
				this.hideToolBar();
				if(type=='dept'){
					this.showToolBar('new');
					//Archive.AuthFrame.load(-1,dept_id);
					return;
				}
				this.showToolBar('update');
				this.showToolBar('del');
				//Ext.msg("error",this.frames.get('params'));
				var Archive=this.frames.get('Archive');
				var archive_id=clickNode.prop._id;
				var dept_id=clickNode.prop._parent;
				
				
				if(!Archive.mainPanel.havePanel("AuthFramePanel")){
					using("bin.km.file.AuthFramePanel");
					Archive.AuthFrame = new bin.km.file.AuthFramePanel(this.frames,dept_id);
					Archive.mainPanel.add(Archive.AuthFrame.MainTabPanel);
					
				}
				Archive.mainPanel.setActiveTab("AuthFramePanel");
				Archive.AuthFrame.load(archive_id,dept_id);
	    }.createDelegate(this);
		this.event1 = new Object();
		var titleClick=this.clickEvent;
		this.event1.title_click = function(){
			titleClick(this);
		};
		this.menuTree.setEvent("event1",this.event1);	
	},
	createToolBar:function(){
	
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			this.clickEvent(nowNode);
		}else if(nowNode.prop._parent=='0'&&nowNode.index()==nowNode.parent.son.length -1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("bin.km.file.ArchiveFrame")){
			this.menuTree.loadHistory("bin.km.file.ArchiveFrame");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("bin.km.file.ArchiveFrame");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
	
});