Ext.namespace("dev.workflow.popup");

dev.workflow.popup.PostFuctionGrid = function(parent_id,postFunctions,wf){
	this.parent_id=parent_id;
	this.postFunctions=postFunctions;
	var n=0;
	var postFunctionArray=new Array;
    this.XPostArgs={};

	this.functionTypeMap={};
	this.functionTypeMap['class']='java类'.loc();
	this.functionTypeMap['beanshell']='beanshell脚本'.loc();

	for(var i in this.postFunctions){
			postFunctionArray[n]=new Array;
			postFunctionArray[n][0]=this.postFunctions[i].getType();
			postFunctionArray[n][1]=this.postFunctions[i].getName();
			postFunctionArray[n][2]=this.functionTypeMap[this.postFunctions[i].getType()];
			var tmpArgs=postFunctions[i].getArgs();
				for(var j in tmpArgs){
					var tmpArg=tmpArgs[j];
					if(tmpArg.getName()!='class.name'){
						this.addPostArg(postFunctionArray[n][1],[[tmpArg.getName(),tmpArg.getValue()]]);
					}
				}
			n++;
	}	

//------------------------------EditorGrid 体系------------------------------------------------------

	this.typeDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['class', 'java类'.loc()],
			['beanshell', 'beanshell脚本'.loc()]
		]
	});
	var nameArray1=[
			['set.caller', '设置调用者'.loc()],
			['set.caller.Supervisor', '设置调用者部门主管'.loc()],
			['set.caller.up.Supervisor', '设置调用者上级部门主管'.loc()],
			['set.caller.Supervisor', '设置调用者部门主管'.loc()],
			['set.most.recent.owner', '设置最近所有者'.loc()],
			['set.most.recent.owner.Supervisor', '设置最近所有者部门主管'.loc()],
			['set.most.recent.owner.Supervisor', '设置最近所有者上级部门主管'.loc()],
			['set.logic', '定制逻辑'.loc()],
			['set.NotifyCurrentOwner', '通知当前执行者'.loc()],
			['set.NotifyHistoryOwner', '通知完成执行者'.loc()],
			['set.NotifyCaller', '通知申请人'.loc()]
		];
	var nameArray2=[
			['bsh.function', 'beanshell脚本'.loc()]
	];
	this.nameDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:nameArray1
	});
//---------------------------------------------------------------------------------------------------------

    var postCm = new Ext.grid.ColumnModel([{
           header: '类型'.loc(),
           dataIndex: 'fuctionType_txt',
           width: 130,
           editor: this.postFunctionType=new Ext.form.ComboBox({
               typeAhead: false,
               triggerAction: 'all',
			   store:this.typeDs,
			   valueField:'id',
			   displayField:'label',
			   mode:'local',
               lazyRender:true,
               listClass: 'x-combo-list-small'
            })
        },{
           id:'fuctionTitle',
           header: '名称'.loc(),
           dataIndex: 'fuctionTitle',
           width: 220,
           editor:this.postFunctionTitle=new Ext.form.ComboBox({
               typeAhead: false,
               triggerAction: 'all',
			   store:this.nameDs,
			   valueField:'id',
			   displayField:'label',
			   mode:'local',
               lazyRender:true,
               listClass: 'x-combo-list-small'
            })
        }
    ]);
    postCm.defaultSortable = true;

    var postFuction = Ext.data.Record.create([
           {name: 'fuctionType'},
           {name: 'fuctionTitle', type: 'string'}
     ]);

    this.postFuctionStore = new Ext.data.SimpleStore({
		fields:['fuctionType', 'fuctionTitle','fuctionType_txt'],
		data:postFunctionArray
	});

   var postFuctionGrid=this.mainPanel= new Ext.grid.EditorGridPanel({
		id:'postFuctionGrid',
		title: '后处理函数'.loc(),
        cm: postCm,
		store: this.postFuctionStore,
        frame:false,
		selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        clicksToEdit:1,
        tbar: [{
			text: '增加'.loc(),
			icon: '/themes/icon/xp/add.png',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
				this.postFunctionType.enable();
				this.postFunctionTitle.enable();
				var maxId=1;
				if(this.postFuctionStore)
					maxId=this.postFuctionStore.getCount()+1;
                var p = new postFuction({
                    fuctionType: 'class',
                    fuctionTitle: 'set.caller'+'.'+maxId,
					fuctionType_txt:'java类'.loc()
                });
                postFuctionGrid.stopEditing();
                this.postFuctionStore.insert(0, p);
                postFuctionGrid.startEditing(0, 0);
				postFuctionGrid.selModel.selectRow(0);
            }
        },'-',{
			text: '设定'.loc(),
			icon: '/themes/icon/xp/cog_edit.png',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
				var selectedRC=postFuctionGrid.selModel.getSelected();
				var tmpName=selectedRC.get('fuctionTitle');
				var argArr=this.getPostArg(tmpName);				
				if(tmpName.indexOf('set.logic')!=-1||tmpName.indexOf('set.most.recent.owner')!=-1||tmpName.indexOf('set.Notify')!=-1){
						using("dev.workflow.popup.ArgWindow");
						Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,tmpName,argArr);
						Workflow.argWin.win.on('close',function(){	
							if(Workflow.argWin.argKey){
								if(tmpName.indexOf('set.logic')!=-1||tmpName.indexOf('set.Notify')!=-1){
									this.addPostArg(tmpName,[['parent_id',Workflow.argWin.argKey]]);
								}else if(tmpName.indexOf('set.most.recent.owner')!=-1){
									this.addPostArg(tmpName,[['stepId',Workflow.argWin.argKey]]);
								}
							}
						},this);
						Workflow.argWin.show();
				}else if(tmpName.indexOf('bsh.function')!=-1){
						using("dev.workflow.popup.ArgWindow");
						Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,'beanshell',argArr);
						Workflow.argWin.win.on('close',function(){	
							if(Workflow.argWin.argKey){
								this.addPostArg(tmpName,[['script',Workflow.argWin.argKey]]);
							}
						},this);
						Workflow.argWin.show();
				}else{
					Ext.msg("warn",'该列不支持参数设定！'.loc());
				}
            }
        },'-',{
			text: '删除'.loc(),
			icon: '/themes/icon/xp/delete.gif',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
				var selectedKeys = postFuctionGrid.selModel.selections.keys; 
				if(selectedKeys.length > 0){
					 postFuctionGrid.stopEditing();
					this.postFuctionStore.remove(postFuctionGrid.selModel.getSelected()) ;
				}else{
					Ext.msg("warn",'最少选定一条记录进行删除！'.loc());
				}
            }
        }]
    });

	postFuctionGrid.on('afteredit',function(e){
		if(e.column==0){
			e.record.set('fuctionType_txt',this.postFunctionType.getEl().dom.value);
			e.record.set('fuctionType',e.value)
		}
	},this);

	this.postFunctionType.on('select', function(){
		var nds=this.nameDs;
		var maxId=1;
		if(this.postFuctionStore)
			maxId=this.postFuctionStore.getCount();
		var selectedRC=postFuctionGrid.selModel.getSelected();
		if(this.postFunctionType.getValue()=='beanshell'){
			using("dev.workflow.popup.ArgWindow");
			nds.loadData(nameArray2);
			var tmpName='bsh.function'+'.'+maxId;
			this.postFunctionTitle.setValue(tmpName);
			selectedRC.set('fuctionTitle',tmpName);
			Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,'beanshell',null);
			Workflow.argWin.win.on('close',function(){	
				if(Workflow.argWin.argKey){
					this.addPostArg(tmpName,[['script',Workflow.argWin.argKey]]);
					postFuctionGrid.stopEditing();
				}
			},this);
			Workflow.argWin.show();
		}else{
			var tmpName='set.caller'+'.'+maxId;
			this.postFunctionTitle.setValue(tmpName);
			selectedRC.set('fuctionTitle',tmpName);
			nds.loadData(nameArray1);
		}
	}, this);

	this.postFunctionTitle.on('select', function(){
		var val=this.postFunctionTitle.getValue();
		var selectedRC=postFuctionGrid.selModel.getSelected();
		if(val.indexOf('set.logic')!=-1||val.indexOf('set.most.recent.owner')!=-1||val.indexOf('set.Notify')!=-1){
			using("dev.workflow.popup.ArgWindow");
			var maxId=1;
			if(this.postFuctionStore)
				maxId=this.postFuctionStore.getCount();
			var tmpName=val+'.'+maxId;
			this.postFunctionTitle.setValue(tmpName);
			selectedRC.set('fuctionTitle',tmpName);
			Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,val,null);
			Workflow.argWin.win.on('close',function(){	
				if(Workflow.argWin.argKey){
					if(val.indexOf('set.logic')!=-1||val.indexOf('set.Notify')!=-1){
						this.addPostArg(tmpName,[['parent_id',Workflow.argWin.argKey]]);
					}else if(val.indexOf('set.most.recent.owner')!=-1){
						this.addPostArg(tmpName,[['stepId',Workflow.argWin.argKey]]);
					}
					postFuctionGrid.stopEditing();
				}
			},this);
			Workflow.argWin.show();
		}
	}, this);
};

Ext.extend(dev.workflow.popup.PostFuctionGrid, Ext.grid.EditorGridPanel, {
	getPostfunctions : function(){
		var functionArray=[];
		for(var i=0;i<this.postFuctionStore.getCount();i++){
			var functionTmp=new XFunction();
			var rc=this.postFuctionStore.getAt(i);
			functionTmp.setType(rc.get('fuctionType'));
			var tmpName=rc.get('fuctionTitle');
			functionTmp.setName(tmpName);
			if(tmpName.indexOf('set.caller')!=-1){
				if(tmpName.indexOf('set.caller.Supervisor')!=-1){
					var argTmp=new XArg();
					argTmp.init('class.name','com.kinglib.workflow.util.CallerSupervisor');
					functionTmp.addArgs(argTmp);
				}else if (tmpName.indexOf('set.caller.up.Supervisor')!=-1){
					var argTmp=new XArg();
					argTmp.init('class.name','com.kinglib.workflow.util.CallerUpSupervisor');
					functionTmp.addArgs(argTmp);
				}else{
					var argTmp=new XArg();
					argTmp.init('class.name','com.kinglib.workflow.util.Caller');
					functionTmp.addArgs(argTmp);
				}
			}else if(tmpName.indexOf('set.most.recent.owner')!=-1){
				if(tmpName.indexOf('set.most.recent.owner.Supervisor')!=-1){
					var argTmp=new XArg();
					argTmp.init('class.name','com.kinglib.workflow.util.MostRecentOwnerSupervisor');
					functionTmp.addArgs(argTmp);
				}else if (tmpName.indexOf('set.most.recent.owner.up.Supervisor')!=-1){
					var argTmp=new XArg();
					argTmp.init('class.name','com.kinglib.workflow.util.MostRecentOwnerUpSupervisor');
					functionTmp.addArgs(argTmp);
				}else{
					var argTmp=new XArg();
					argTmp.init('class.name','com.kinglib.workflow.util.MostRecentOwner');
					functionTmp.addArgs(argTmp);
				}
			}else if(tmpName.indexOf('set.logic')!=-1){
				var argTmp=new XArg();
				argTmp.init('class.name','com.kinglib.workflow.util.Logic');
				functionTmp.addArgs(argTmp);
			}else if(tmpName.indexOf('set.NotifyHistoryOwner')!=-1){
				var argTmp=new XArg();
				argTmp.init('class.name','com.kinglib.workflow.util.NotifyHistoryOwner');
				functionTmp.addArgs(argTmp);
			}else if(tmpName.indexOf('set.NotifyCurrentOwner')!=-1){
				var argTmp=new XArg();
				argTmp.init('class.name','com.kinglib.workflow.util.NotifyCurrentOwner');
				functionTmp.addArgs(argTmp);
			}else if(tmpName.indexOf('set.NotifyCaller')!=-1){
				var argTmp=new XArg();
				argTmp.init('class.name','com.kinglib.workflow.util.NotifyCaller');
				functionTmp.addArgs(argTmp);
			}
			var tmpArgArray=this.getPostArg(tmpName);
			if(tmpArgArray!=null)
				for(var k=0;k<tmpArgArray.length;k++){	
					var argTmp=new XArg();
					argTmp.init(tmpArgArray[k][0],tmpArgArray[k][1]);	
					functionTmp.addArgs(argTmp);
				}
			functionArray.push(functionTmp);
		}
		return functionArray;
    },
	addPostArg: function (name,postArgArray) {
		this.XPostArgs[name]=postArgArray;
	},
   getPostArg:function (name){
			if(this.XPostArgs[name]){
				return this.XPostArgs[name];
			}else{
				return null;
			}
   }
});
