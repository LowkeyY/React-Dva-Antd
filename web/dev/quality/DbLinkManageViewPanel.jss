Ext.namespace("dev.quality");
dev.quality.DbLinkManageViewPanel = function(frames,params){
	this.frames = frames;
	this.params = params;

	qualityInstance = this.frames.get("qualityInstance");
	this.retFn = function(main){
		main.setActiveTab("dbLinkManageViewPanel");
		main.setStatusValue(["数据库连接管理".loc()]);
	}.createCallback(qualityInstance.mainPanel);
	this.ButtonArray=[];
	this.ButtonArray.push(new Ext.Toolbar.Spacer());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'new',
				text: '新建'.loc(),
				icon: '/themes/icon/common/new.gif',
				cls: 'x-btn-text-icon  bmenu',
				scope: this,
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Spacer());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'modify',
				text: '修改'.loc(),
				icon: '/themes/icon/common/update.gif',
				cls: 'x-btn-text-icon  bmenu',
				scope: this,
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Spacer());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				scope: this,
				handler :this.onButtonClick
	}));
	this.ButtonArray.push(new Ext.Toolbar.Spacer());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/common/repeal.gif',
				cls: 'x-btn-text-icon  bmenu',
				scope: this,
				handler :this.params.retFn
	}));

	this.ds = new Ext.data.SimpleStore({
        id: 0,
        fields:[{name:'link_id',mapping:'link_id'},
				{name:'name',mapping:'name'},
                {name:'dblink_name',mapping:'dblink_name'},
                {name:'url',mapping:'url'},
				{name:'username',mapping:'username'}
				],
        data: []
    });

	this.cm = new Ext.grid.ColumnModel([
        {header: "名称".loc(),sortable: true,dataIndex: "name"},
		{header: "数据库连接名称".loc(),sortable: false,dataIndex: "dblink_name" },
        {header: "URL".loc(),sortable: false,dataIndex: "url"},
		{header: "用户".loc(),sortable: false, dataIndex: "username"}
    ]);

	this.ViewGrid = new Ext.grid.GridPanel({
		id : "dbLinkManageViewPanel",
		param : this.param,
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
		tbar:this.ButtonArray 
	});
	this.MainTabPanel=this.ViewGrid;
	this.loadView= function() {
        Ext.Ajax.request({
            url: '/dev/quality/dblinklist.jcp',
            method: 'post',
			params : this.params,
			scope:this,
            callback: function(options, success, response) {
                var result = Ext.util.JSON.decode(response.responseText);
                if (result.success) {
                    this.loadComplete(result);
                } else {
                    var msg = (result && result.Message) ? result.Message : '发生错误，请重试!'.loc();
                    Ext.MessageBox.alert('Error', msg);                            
                }
            }             
        });
        
    };

	this.loadComplete= function(result) {
		setTimeout(function(){
			this.ds.loadData(result.Rows,false);
		}.createDelegate(this),300);
        
    };
};
dev.quality.DbLinkManageViewPanel.prototype= {
	onButtonClick : function(item){
		
		if(item.btnId=='new'){
			using("dev.quality.DbLinkManagePanel");
			var params = this.params;
			params.state = "create";
			var dbLinkWin=new dev.quality.DbLinkManagePanel(this.frames,params);
			dbLinkWin.win.on('close',function(){
				setTimeout(function(){
					this.loadView(params);
				}.createDelegate(this),300);
				
			},this);
			dbLinkWin.show();
		}else if(item.btnId=='modify'){
			var dataSelected = this.ViewGrid.getSelectionModel().getSelected();
			if(typeof dataSelected == "undefined"){
				Ext.msg("error",'请选择一行数据!'.loc());
				return;
			}
			var link_id = dataSelected.data.link_id;
			var dblink_name = dataSelected.data.dblink_name;
			var params = this.params;
			params.retFn = this.retFn;
			params.link_id = link_id;
			params.dblink_name = dblink_name;
			params.state = "edit";
			using("dev.quality.DbLinkManagePanel");
			var dbLinkWin=new dev.quality.DbLinkManagePanel(this.frames,params);
			dbLinkWin.loadData(params);
			dbLinkWin.win.on('close',function(){
				setTimeout(function(){
					this.loadView(this.params);
				}.createDelegate(this),300);
				
			},this);
			dbLinkWin.show();
		}else if(item.btnId=='delete'){
			var dataSelected = this.ViewGrid.getSelectionModel().getSelected();
			if(typeof dataSelected == "undefined"){
				Ext.msg("error",'请选择一行要删除的行!'.loc());
				return;
			}
			var delParams = this.params;
			delParams.link_id = dataSelected.data.link_id;
			delParams.dblink_name = dataSelected.data.dblink_name;
			delParams.type = "delete";
			Ext.msg("confirm","确认删除吗?".loc(),function(answer){
				if (answer == 'yes') {
					Ext.Ajax.request({
							url : "/dev/quality/dblinkcreate.jcp",
							method : 'POST',
							isUpload : true,
							params : delParams,
							callback : function(options, success, response) {
								var result = Ext.util.JSON.decode(response.responseText);
								if(result.success){
									this.loadView();
								}else{									
									Ext.msg("error",'删除失败！原因'.loc()+'<br>'+result.message);
								}
							},
							scope : this
					});
				}
			}.createDelegate(this));
		}
	}
};