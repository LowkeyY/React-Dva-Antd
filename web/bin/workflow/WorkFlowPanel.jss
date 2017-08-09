

bin.workflow.WorkFlowPanel = function(){

    this.xg = Ext.grid;

	var listButton=[];
	listButton.push(new Ext.Toolbar.Button({
				id:'refresh',
				text: '刷新'.loc(),
				icon: '/themes/icon/all/arrow_refresh.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	listButton.push(new Ext.Toolbar.Separator());


   this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:"/bin/workflow/list.jcp",
			method:'GET'
		}),
        reader: new Ext.data.JsonReader({
            root: 'dataItem',
            totalProperty: 'totalCount',
            id: 'id'
        }, [
			{name: '工作流类型'.loc(), mapping: 'workFlowType'},
			{name: '工作流'.loc(), mapping: 'instanceName'},
			{name: '申请编号'.loc(), mapping: 'applyCode'},
			{name: '状态'.loc(), mapping: 'status'},
			{name: '申请人'.loc(), mapping: 'applier'},
			{name: '申请时间'.loc(), mapping: 'applyDatetime'}
        ]),
        remoteSort: true
    });
    this.ds.setDefaultSort('申请时间', 'desc');

    this.cm = new Ext.grid.ColumnModel([ new this.xg.RowNumberer(),{
           id: '工作流类型'.loc(), 
           header: '工作流类型'.loc(),
           dataIndex: '工作流类型'.loc(),
		   sortable: true,
           align: 'left'
        },{
           header: '工作流'.loc(),
           dataIndex: '工作流'.loc(),
           sortable: true,
           align: 'left'
        },{
           header: '申请编号'.loc(),
           dataIndex: '申请编号'.loc(),
           sortable: true,
           align: 'left'
        },{
           header: '状态'.loc(),
           dataIndex: '状态'.loc(),
		   sortable: true,
           align: 'right'
        },{
           header: '申请人'.loc(),
           dataIndex: '申请人'.loc(),
		   sortable: true,
           align: 'right'
        },{
           header: '申请时间'.loc(),
           dataIndex: '申请时间'.loc(),
		   sortable: true,
           align: 'right'
        }]);

    this.cm.defaultSortable = true;
	this.WorkFlowGrid = new Ext.grid.GridPanel({
		title:'收件箱'.loc(),
        store: this.ds,
        cm: this.cm,
        trackMouseOver:false,
        loadMask: {msg:'数据载入中...'.loc()},
        viewConfig: {
			forceFit:true, 
            enableRowBody:true, 
            showPreview:true, 
            getRowClass : this.applyRowClass 
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 30,
            store: this.ds,
            displayInfo: true,
            displayMsg: '{0}-{1}条 共:{2}条'.loc(),
            emptyMsg:'没有数据'.loc()
        }),
		tbar:listButton
    });
	this.MainTabPanel=new Ext.TabPanel({
			id: 'bin.workflow.WorkFlowPanel',
			border:false,
			activeTab:0,
			tabPosition:'bottom',
			defaults:{autoScroll:true},
			items:[this.WorkFlowGrid]
	});
};

bin.workflow.WorkFlowPanel.prototype={
	showList: function(params){	
		this.ds.baseParams = params;
		this.ds.load({params:{start:0, limit:30}});
	},
	onButtonClick : function(item){
		if(item.id=='refresh'){
			this.ds.baseParams = this.ds.baseParams;
			this.ds.load({params:{start:0, limit:30}});
		}
    }
};

