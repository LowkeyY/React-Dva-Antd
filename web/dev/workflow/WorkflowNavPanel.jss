Ext.namespace("dev.workflow");

dev.workflow.WorkflowNavPanel = function(frames){

	var str='工作流导航'.loc();
	
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=32"  icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.event0 = new Object();
	this.frames=frames;

	this.WorkflowButtonArray=[];
	var nowNodeTitle="";
	var NavParams={};

	this.WorkflowButtonArray.push(new Ext.Toolbar.Button({
				text: '新建'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				btnId:'new',
				hidden : false,  
				tooltip:'新建流程分类'.loc(),
				handler :onAdd
	}));
	this.WorkflowButtonArray.push(new Ext.Toolbar.Button({
				text: '修改'.loc(),
				icon: '/themes/icon/common/update.gif',
				cls: 'x-btn-text-icon  bmenu',
				btnId:'update',
				disabled:false,
				scope: this,
				hidden : false,
				tooltip:'修改流程分类'.loc(),
				handler :onEdit
	}));
	this.WorkflowButtonArray.push(new Ext.Toolbar.Button({
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				btnId:'del',
				disabled:false,
				scope: this,
				hidden : false,
				tooltip:'删除流程分类'.loc(),
				handler :onDelete
	}));

	this.clickEvent=function(clickNode){
		Workflow=this.frames.get('Workflow');
		nowNodeTitle=clickNode.prop.title;

		if (clickNode.prop.objectType=='1'||clickNode.prop.objectType=='16'||clickNode.prop.objectType=='32'){
			if(!Workflow.mainPanel.havePanel("workflowPanel")){
				using("dev.workflow.WorkflowPanel");
				Workflow.workflowPanel =new dev.workflow.WorkflowPanel(this.frames);
				Workflow.mainPanel.add(Workflow.workflowPanel.MainTabPanel);
			}
			Workflow.mainPanel.setActiveTab("workflowPanel");
		}else if (clickNode.prop.objectType=='17'){
			if(!Workflow.mainPanel.havePanel("ActPanel")){
				using("dev.workflow.act.ActPanel");
				var retFn='';

				Workflow.actPanel =new dev.workflow.act.ActPanel(this.frames,retFn);
				Workflow.mainPanel.add(Workflow.actPanel.MainTabPanel);
			}
			Workflow.mainPanel.setActiveTab("ActPanel");
		}else if (clickNode.prop.objectType=='23'||clickNode.prop.objectType=='24'||clickNode.prop.objectType=='25'||clickNode.prop.objectType=='26'||clickNode.prop.objectType=='27'||clickNode.prop.objectType=='7'){
			if(!Workflow.mainPanel.havePanel("workflowProgramPanel")){
				using("lib.ComboRemote.ComboRemote");
				using("lib.ComboTree.ComboTree");
				using("dev.program.ProgramPanel");
				using("dev.program.ProgramGrid");
					
				Workflow.programPanel =this.frames.createPanel(new dev.program.ProgramPanel('workflow',Workflow));
				Workflow.mainPanel.add(Workflow.programPanel.MainTabPanel);
			}
			Workflow.mainPanel.setActiveTab("workflowProgramPanel");
		}
		if(clickNode.prop.params){
			var params={
				returnFunction:function(mp){
						mp.setActiveTab('workflowProgramPanel');
						mp.setStatusValue(['程序管理'.loc()]);    
				}.createCallback(Workflow.mainPanel)
			};
			var paramString=clickNode.prop.params.split('&');
			for(var i=0;i<paramString.length;i++){
				params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
			}	
			params['nodeType']=clickNode.prop.objectType;
			if (clickNode.prop.objectType=='1'){
					Workflow.workflowPanel.init(params);
			}else if (clickNode.prop.objectType=='32'){
					Workflow.workflowPanel.init(params);
			}else if (clickNode.prop.objectType=='16'){
					params['workflowName']=clickNode.prop.title;
					params['instance_id']='';
					Workflow.workflowPanel.loadData(params);
					Workflow.workflowPanel.formEdit();
			}else if (clickNode.prop.objectType=='17'){
					Workflow.actPanel.loadData(params,Workflow.mainPanel);
			}else if (clickNode.prop.objectType=='23'||clickNode.prop.objectType=='24'||clickNode.prop.objectType=='25'||clickNode.prop.objectType=='26'||clickNode.prop.objectType=='27'){
					Workflow.programPanel.init(params,Workflow.mainPanel);
			}else if (clickNode.prop.objectType=='7'){ 
				    params['acttype']='workflow';
					Ext.Ajax.request({
						url : '/dev/module/SelectTerminalType.jcp',
						params : {
							id:params.objectId
						},
						method : 'GET',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success) {
								var terminalType = result.terminalType;
								params.terminalType=terminalType;
								Workflow.programPanel.loadData(params,Workflow.mainPanel);  
							}else{
								Ext.msg("error", result.message);
							}
						}
					});	
			}
		}
		NavParams=params;
		if(clickNode.prop.objectType=="1"){
			this.hideToolBar();
			this.showToolBar('new');	
		}else if(clickNode.prop.objectType=="32"){
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
	};
	this.menuTree.setEvent("event0",this.event0);

	function saveIt(btn,text){
			if(btn=='ok'){
				var saveParams=NavParams;
				saveParams['type']='save';
				saveParams['group_name']=text;
				if(text.length>50){
					Ext.msg("error",'数据修改失败!,原因:字符数大于50'.loc());
					return;
				}else if(text==null||text.length==0){
					Ext.msg("error",'数据保存失败!,原因:流程分类不能为空'.loc());
					return;
				}
				Ext.Ajax.request({
					url: '/dev/workflow/createGroup.jcp',
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
			   title: '流程分类'.loc(),
			   msg: '新建流程分类'.loc()+':',
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
					Ext.msg("error",'数据保存失败!,原因:修改流程分类不能为空'.loc());
					return;
				}
				Ext.Ajax.request({
					url: '/dev/workflow/createGroup.jcp',
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
		   title: '流程分类'.loc(),
		   msg: '输入流程分类名称:'.loc(),
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
					url: '/dev/workflow/createGroup.jcp',
					method:'POST',
					params: delParams,
					success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check);
							if(ajaxResult.success){
								this.getTree().loadParentNode(this.clickEvent);
							}else{
									Ext.msg("error",'流程分类删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
							}
					},
					scope: this
				});
		  } 
		}.createDelegate(this));
	};

	dev.workflow.WorkflowNavPanel.superclass.constructor.call(this, {
			id:'WorkflowNavigator',
            title: '工作流管理'.loc(),
            region: 'west',
            split: true,
            width: 280,
            collapsible: true,
            cmargins:'3 3 3 3',
			tbar:this.WorkflowButtonArray
    });
};
Ext.extend(dev.workflow.WorkflowNavPanel, Ext.Panel, {
	init : function(){
		this.menuTree.finish(this.body.dom,document);
		this.focusHistoryNode();
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
	getTree : function(){
		return this.menuTree;
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
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("workflow")){
			this.menuTree.loadHistory("workflow");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("workflow");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

