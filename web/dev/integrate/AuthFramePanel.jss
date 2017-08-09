
Ext.namespace("dev.integrate");
dev.integrate.AuthFramePanel= function(frames,params){

	
	this.frames= frames;
	this.params= params;

	this.listButton=[];
	
	this.listButton.push(new Ext.Toolbar.Button({
				btnId:'back',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				handler :this.params.retFn
	}));
	this.listButton.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	this.listButton.push(new Ext.Toolbar.Separator({
				hidden : false
	}));
	this.listButton.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/all/basket_back.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	this.listButton.push(new Ext.Toolbar.Button({
				btnId:'add',
				text: '增加'.loc(),
				icon: '/themes/icon/all/basket_go.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	this.AuthPanel = new dev.integrate.InstanceAuthPanel(this.frames,this.params.instanceId,this.params.parent_id);

	var ids=new Array();
	if(this.AuthPanel&&this.AuthPanel.ds)
		this.AuthPanel.ds.each(function(rec){ids.push(rec.get("user_id"));});
   
	var loader=new Ext.tree.TreeLoader({
			dataUrl:'/dev/integrate/roletree.jcp',
			requestMethod:"POST",
			baseParams:{instanceId:this.params.instanceId,ids:ids}
	});

	this.tree = new Ext.tree.TreePanel({
		region:'center',
		animate:true, 
		autoScroll:true,
		loader:loader,
		enableDrag:true,
		ddGroup:"tree2grid",
		containerScroll: true
	});

	new  Ext.tree.TreeSorter(this.tree, {folderSort:true});
    this.tree.on("render",function(){
		var ddrow = new Ext.dd.DropTarget(this.tree.getEl(),{
			ddGroup : 'grid2tree',
			notifyDrop:function(dd,e,data){
				this.grid2tree(data.grid,data.rowIndex,this.tree);
			}.createDelegate(this)
		});
	},this);

	this.root = new Ext.tree.AsyncTreeNode({
		text:this.params.rootName, 
		draggable:false, 
		id:this.params.rootId,
		icon:"/themes/icon/all/chart_organisation.gif"
	});
	this.tree.setRootNode(this.root);
	this.reportAuthFrameMain = new Ext.Panel({		
        closable:false, 
        layout: 'border',
		region: 'center',
        border:false,
		tbar:this.listButton,
        items: [this.tree ,this.AuthPanel]
	});
	this.MainTabPanel=this.reportAuthFrameMain;
};
dev.integrate.AuthFramePanel.prototype={
	init:function(instanceId,integrateId){
		this.AuthPanel.instanceId=instanceId;
		this.AuthPanel.integrateId=integrateId;
		root=this.tree.root;
		root.expand();
		this.AuthPanel.ds.reload({
			params: {instanceId:instanceId} 
		});
		this.frames.get("IntegrateInstance").mainPanel.setStatusValue(['集成权限管理'.loc()]);
	},
	onButtonClick : function(item){
		if(item.btnId=='save'){
			 this.AuthPanel.save(this.params);
		}else if(item.btnId=='add'){
			var node=this.tree.getSelectionModel().getSelectedNode();
			if(node==null) return;
			this.AuthPanel.tree2grid(node,this.AuthPanel.authGrid);
		}else if(item.btnId=='delete'){
			var grid=this.AuthPanel.authGrid;
			var arr=grid.getSelectionModel().getSelections();
			if(arr=='') return;
			for(var i=0;i<arr.length;i++)
				this.grid2tree(grid,arr[i],this.tree);
		}
    },
	grid2tree:function(grid,rec,tree){
			var store=grid.getStore();
			if(typeof(rec)=='number') 
				rec=store.getAt(rec);
			var node=tree.getNodeById(rec.get("dept_id"));
			if(node){
				if(!node.isExpanded()){
						node.expand(false,false);
						node.select();
				}
				node.appendChild(new Ext.tree.TreeNode({
					allowDrag:true,
					allowDrop:false,
					leaf:true,
					id:rec.get("user_id"),
					text:rec.get("user_name"),
					icon:'/themes/icon/all/user.gif'
				}));
			}
			store.remove(rec);
	}
};

