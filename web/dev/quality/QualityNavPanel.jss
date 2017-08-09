
dev.quality.QualityNavPanel = function(frames){
	
			
	this.frames=frames;
	var str="数据质控导航".loc()
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=40"   icon0="/themes/icon/database/editor_commit.gif" icon1="/themes/icon/database/editor_commit.gif"/></forder></root>'));
	
	this.event0 = new Object();

	this.QualityButtonArray=[];

	var nowNodeTitle="";

	var NavParams={};

	this.QualityButtonArray.push(new Ext.Toolbar.Button({
				text: '新建'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				btnId:'new',
				hidden : false,  
				tooltip:'新建质控分类'.loc(),
				handler :onAdd
	}));
	this.QualityButtonArray.push(new Ext.Toolbar.Button({
				text: '修改'.loc(),
				icon: '/themes/icon/common/update.gif',
				cls: 'x-btn-text-icon  bmenu',
				btnId:'update',
				disabled:false,
				scope: this,
				hidden : false,
				tooltip:'修改质控分类'.loc(),
				handler :onEdit
	}));
	this.QualityButtonArray.push(new Ext.Toolbar.Button({
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				btnId:'del',
				disabled:false,
				scope: this,
				hidden : false,
				tooltip:'删除质控分类'.loc(),
				handler :onDelete
	}));

	this.clickEvent=function(clickNode){
		var Quality=this.frames.get('Quality');
		nowNodeTitle=clickNode.prop.title;
		var prop=clickNode.prop.params;
		var params={};
		var paramString=prop.split('&');
		for(var i=0;i<paramString.length;i++){
			params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	

		if(clickNode.prop.objectType=='1'||clickNode.prop.objectType=='37'||clickNode.prop.objectType=='40'){
			if(!Quality.mainPanel.havePanel("QualityBase")){
				using("dev.quality.BasePanel");  
				Quality.basePanel = new dev.quality.BasePanel(this.frames,params); 
				Quality.mainPanel.add(Quality.basePanel.MainTabPanel);
			}
			Quality.mainPanel.setActiveTab("QualityBase");
		}else if (clickNode.prop.objectType=='7'){
			if(!Quality.mainPanel.havePanel("QualityProgramPanel")){
				using("dev.program.ProgramPanel");
				using("dev.program.ProgramGrid");
				Quality.programPanel =this.frames.createPanel(new dev.program.ProgramPanel('Quality',Quality)); 
				Quality.mainPanel.add(Quality.programPanel.MainTabPanel);
			}
			Quality.mainPanel.setActiveTab("QualityProgramPanel");
		}
		params['nodeType']=clickNode.prop.objectType;
		
		if(clickNode.prop.objectType=="1"){
				Quality.basePanel.formCreate(params);
		}else if (clickNode.prop.objectType=='40'){
				Quality.basePanel.formCreate(params);
		}else if(clickNode.prop.objectType=="37"){
				Quality.basePanel.formEdit();
				Quality.basePanel.loadData(params);
		}else if (clickNode.prop.objectType=='7'){
			params.returnFunction=(function(main){
				main.setActiveTab('QualityProgramPanel');
			}).createCallback(Quality.mainPanel);
			params.terminalType='0';
			Quality.programPanel.loadData(params,Quality.mainPanel); 
		}
		NavParams=params;
		if(clickNode.prop.objectType=="1"){
			this.hideToolBar();
			this.showToolBar('new');	
		}else if(clickNode.prop.objectType=="40"){
			this.hideToolBar();
			this.showToolBar('update');
			this.showToolBar('del');
		}else{
			this.hideToolBar();
		}
	}.createDelegate(this);
	
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);

	function saveIt(btn,text){
			if(btn=='ok'){
				var saveParams=NavParams;
				saveParams['type']='save';
				saveParams['group_name']=text;
				if(text.length>50){
					Ext.msg("error",'数据修改失败！,原因:字符数大于50'.loc());
					return;
				}else if(text==null||text.length==0){
					Ext.msg("error",'数据保存失败！,原因:质控分类不能为空'.loc());
					return;
				}
				Ext.Ajax.request({
					url: '/dev/quality/createGroup.jcp',
					method:'POST',
					params: saveParams,
					success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check);
							if(ajaxResult.success){
								this.getTree().loadSubNode(ajaxResult.id,titleClick);
							}else{
								    Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
							}
					},
					scope: this
				});
			}
	};
	function onAdd(){
			Ext.MessageBox.show({
			   title: '质控分类'.loc(),
			   msg: '新建质控分类:'.loc(),
			   width:300,
			   buttons: Ext.MessageBox.OKCANCEL,
			   prompt : true,
			   scope: this,
			   fn: saveIt
		   });
	};
	function updateIt(btn,text){
			if(btn=='ok'){
				var saveParams=NavParams;
				saveParams['type']='updatesave';
				saveParams['group_name']=text;
				if(text.length>50){
					Ext.msg("error",'数据修改失败!,原因:字符数大于50'.loc());
					return;
				}else if(text==null||text.length==0){
					Ext.msg("error",'数据保存失败!,原因:修改质控分类不能为空'.loc());
					return;
				}
				Ext.Ajax.request({
					url: '/dev/quality/createGroup.jcp',
					method:'POST',
					params: saveParams,
					success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check);
							if(ajaxResult.success){
								var tree=this.getTree();
								tree.loadSelfNode(ajaxResult.id,titleClick);
							}else{  
								    Ext.msg("error",'数据保存失败!,原因:'.loc()+'<br>'+ajaxResult.message);
							}
					},
					scope: this
				});
			}
	};
	function onEdit(){
		Ext.MessageBox.show({
		   title: '质控分类'.loc(),
		   msg: '输入质控分类名称:'.loc(),
		   value:nowNodeTitle,
		   width:300,
		   buttons: Ext.MessageBox.OKCANCEL,
		   prompt : true,
		   scope: this,
		   fn:updateIt,
		   animEl: 'navtoolbar'
	   });
	};
	function onDelete(){
		 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
			if (answer == 'yes') {
				var delParams=NavParams;
				delParams['type']='delete';
				Ext.Ajax.request({
					url: '/dev/quality/createGroup.jcp',
					method:'POST',
					params: delParams,
					success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check);
							if(ajaxResult.success){
								this.getTree().loadParentNode(this.clickEvent);
							}else{
									Ext.msg("error",'质控分类删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
							}
					},
					scope: this
				});
		  } 
		}.createDelegate(this));
	};

	dev.quality.QualityNavPanel.superclass.constructor.call(this, {
			id:'QualityNavigator',
            title: '数据质控管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3',
			tbar:this.QualityButtonArray
    });
};
Ext.extend(dev.quality.QualityNavPanel, Ext.Panel, {
	init : function(){
		this.menuTree.finish(this.body.dom,document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree;
	},
	hideToolBar : function(){	
		var  tempToolBar=this.getTopToolbar();
		tempToolBar.items.each(function(item){   
				item.disable();
		}, tempToolBar.items);
    },
	showToolBar : function(state){	
		var  tempToolBar=this.getTopToolbar();
		tempToolBar.items.each(function(item){ 
			if(item.btnId==state)
				item.enable();
		}, tempToolBar.items);
    },
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			this.clickEvent(nowNode);
		}else if(nowNode.prop.objectType=='0'&&nowNode.index()==nowNode.parent.son.length -1&&nowNode.parent.son.length!=1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			if(nowNode.prop._id==newNode.prop._id){
				return;
			}else{
				this.exeHistoryNode(menuTree,newNode)
			}
		}
	},
	focusHistoryNode: function (){
		var uStore=new UserStore(tree_store);
		if(uStore.getAttribute("Quality")){
			this.menuTree.loadHistory("Quality");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("Quality");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

