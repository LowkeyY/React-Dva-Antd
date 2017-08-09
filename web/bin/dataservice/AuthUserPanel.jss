
bin.dataservice.AuthUserPanel= function(frames,folder_id,rootId,rootName){
	this.frames= frames;
	this.listButton=[];
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
	var loader=new Ext.tree.TreeLoader({
			dataUrl:'/bin/dataservice/roletree.jcp',
			requestMethod:"GET",
			baseParams:{folder_id:folder_id}
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
		text: rootName, 
		draggable:false, 
		id:rootId,
		icon:"/themes/icon/all/chart_organisation.gif"
	});
	this.tree.setRootNode(this.root);

	using("bin.dataservice.ReportAuthPanel");    
    this.reportAuthPanel = new bin.dataservice.ReportAuthPanel(this.frames,folder_id);

	this.reportAuthFrameMain = new Ext.Panel({		
        closable:false, 
        layout: 'border',
		id: 'AuthPanel',
		cached:false,
		region: 'center',
        border:false,
		tbar:this.listButton,
        items: [this.tree ,this.reportAuthPanel]
	});
	this.MainTabPanel=this.reportAuthFrameMain;
};
bin.dataservice.AuthUserPanel.prototype={
	init:function(folder_id){
		this.reportAuthPanel.folder_id=folder_id;
		root=this.tree.root;
		root.expand();
		this.reportAuthPanel.ds.reload({
			params: {folder_id:folder_id} 
		});
		this.frames.get("DataService").mainPanel.setStatusValue(['用户认证'.loc(),folder_id]);
	},
	onButtonClick : function(item){
		if(item.btnId=='save'){
			 this.reportAuthPanel.save(this.params);
		}else if(item.btnId=='add'){
			var node=this.tree.getSelectionModel().getSelectedNode();
			if(node==null) return;
			this.reportAuthPanel.tree2grid(node,this.reportAuthPanel.authGrid);
		}else if(item.btnId=='delete'){
			var grid=this.reportAuthPanel.authGrid;
			var arr=grid.getSelectionModel().getSelections();
			if(arr=='') return;
			for(var i=0;i<arr.length;i++){
				this.grid2tree(grid,arr[i],this.tree);
			}      
			
		}
    },
	grid2tree:function(grid,rec,tree){
			var store=grid.getStore();
			if(typeof(rec)=='number') {
				rec=store.getAt(rec);
			}
			var node=tree.getNodeById(rec.get("dept_id"));
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
			store.remove(rec);
	}
};

