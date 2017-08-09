
bin.km.file.AuthFramePanel= function(frames,dept_id){
	this.frames= frames;
	this.listButton=[];
	this.firstload=true;
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

	using("bin.km.file.AuthPanel");
    this.AuthPanel = new bin.km.file.AuthPanel(this.frames);

	var loader=new Ext.tree.TreeLoader({
			dataUrl:'/bin/km/file/roletree.jcp',
			requestMethod:"POST",
			baseParams:{archive_id:dept_id}
	});

	this.tree = new Ext.tree.TreePanel({
		region:'center',
		animate:true, 
		autoScroll:true,
		loader:loader,
		enableDrag:true,
		ddGroup:"tree2grid",
		containerScroll: true,
	});
	var root= new Ext.tree.AsyncTreeNode({
				text: "本单位节点", 
				draggable:false, 
				id:dept_id,
				icon:"/themes/icon/all/chart_organisation.gif"
			});
	this.tree.setRootNode (root);
	new  Ext.tree.TreeSorter(this.tree, {folderSort:true});
    this.tree.on("render",function(){
		var ddrow = new Ext.dd.DropTarget(this.tree.getEl(),{
			ddGroup : 'grid2tree',
			notifyDrop:function(dd,e,data){
				this.grid2tree(data.grid,data.rowIndex,this.tree);
			}.createDelegate(this)
		});
	},this);

	this.MainTabPanel = new Ext.Panel({		
        closable:false, 
        layout: 'border',
		id: 'AuthFramePanel',
		cached:false,
		region: 'center',
        border:false,
		tbar:this.listButton,
        items: [this.tree ,this.AuthPanel]
	});
};
bin.km.file.AuthFramePanel.prototype={
	load:function(archive_id,dept_id){
		this.AuthPanel.load(archive_id);
		var root=this.tree.root;
		root.id=dept_id;
		var loader=this.tree.getLoader();
		loader.baseParams.archive_id=archive_id;
		if(!this.firstload)
			loader.load(root);
		root.expand();

		this.firstload=false;
		if(this.MainTabPanel.rendered){
			this.frames.get("Archive").mainPanel.setStatusValue(['档案室管理员'.loc(),archive_id]);
		}
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

