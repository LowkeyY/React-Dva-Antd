Ext.namespace("dev.workflow.popup");

dev.workflow.popup.PreFuctionGrid = function(parent_id,preFunctions,wf){
	this.parent_id=parent_id;
	this.preFunctions=preFunctions;
	var preFunctionArray=new Array;
	n=0;
    this.XPreArgs={};

	this.functionTypeMap={};
	this.functionTypeMap['class']='java类'.loc();
	this.functionTypeMap['beanshell']='beanshell脚本'.loc();

	for(var i in this.preFunctions){
			preFunctionArray[n]=new Array;
			preFunctionArray[n][0]=this.preFunctions[i].getType();
			preFunctionArray[n][1]=this.preFunctions[i].getName();
			preFunctionArray[n][2]=this.functionTypeMap[this.preFunctions[i].getType()];
			var tmpArgs=this.preFunctions[i].getArgs();
				for(var j in tmpArgs){
					var tmpArg=tmpArgs[j];
					if(tmpArg.getName()!='class.name'){
						this.addPreArg(preFunctionArray[n][1],[[tmpArg.getName(),tmpArg.getValue()]]);
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

    var preCm = new Ext.grid.ColumnModel([{
           header: '类型'.loc(),
           dataIndex: 'fuctionType_txt',
           width: 130,
           editor: this.preFunctionType=new Ext.form.ComboBox({
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
           editor: this.preFunctionTitle=new Ext.form.ComboBox({
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
    preCm.defaultSortable = true;

    var preFuction = Ext.data.Record.create([
           {name: 'fuctionType'},
           {name: 'fuctionTitle', type: 'string'}
     ]);
   this.preFuctionStore = new Ext.data.SimpleStore({
		fields:['fuctionType', 'fuctionTitle','fuctionType_txt'],
		data:preFunctionArray
	});
   var preFuctionGrid=this.mainPanel = new Ext.grid.EditorGridPanel({
	   	id:'prefunction',
		title: '预处理函数'.loc(),
        cm: preCm,
		store: this.preFuctionStore,
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
				this.preFunctionType.enable();
				this.preFunctionTitle.enable();
				var maxId=1;
				if(this.preFuctionStore)
					maxId=this.preFuctionStore.getCount()+1;
                var p = new preFuction({
                    fuctionType: 'class',
                    fuctionTitle: 'set.caller'+'.'+maxId,
					fuctionType_txt:'java类'.loc()
                });
                preFuctionGrid.stopEditing();
                this.preFuctionStore.insert(0, p);
                preFuctionGrid.startEditing(0, 0);
				preFuctionGrid.selModel.selectRow(0);
            }
        },'-',{
			text: '设定'.loc(),
			icon: '/themes/icon/xp/cog_edit.png',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
				var selectedRC=preFuctionGrid.selModel.getSelected();
				var tmpName=selectedRC.get('fuctionTitle');
				var argArr=this.getPreArg(tmpName);
				if(tmpName.indexOf('set.logic')!=-1||tmpName.indexOf('set.most.recent.owner')!=-1||tmpName.indexOf('set.Notify')!=-1){
						using("dev.workflow.popup.ArgWindow");
						Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,tmpName,argArr);
						Workflow.argWin.show();
						Workflow.argWin.win.on('close',function(){	
							if(Workflow.argWin.argKey){
								if(tmpName.indexOf('set.logic')!=-1||tmpName.indexOf('set.Notify')!=-1){
									this.addPreArg(tmpName,[['parent_id',Workflow.argWin.argKey]]);
								}else if(tmpName.indexOf('set.most.recent.owner')!=-1){
									this.addPreArg(tmpName,[['stepId',Workflow.argWin.argKey]]);
								}
							}
						},this);
				}else if(tmpName.indexOf('bsh.function')!=-1){
						using("dev.workflow.popup.ArgWindow");
						Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,'beanshell',argArr);
						Workflow.argWin.show();
						Workflow.argWin.win.on('close',function(){	
							if(Workflow.argWin.argKey){
								this.addPreArg(tmpName,[['script',Workflow.argWin.argKey]]);
							}
						},this);
				}else{
					Ext.msg("error",'该列不支持参数设定!'.loc());
				}
            }
        },'-',{
			text: '删除'.loc(),
			icon: '/themes/icon/xp/delete.gif',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope:this,
            handler : function(){
				var selectedKeys = preFuctionGrid.selModel.selections.keys; 
				if(selectedKeys.length > 0){
					 preFuctionGrid.stopEditing();
					this.preFuctionStore.remove(preFuctionGrid.selModel.getSelected());
				}else{
					Ext.msg("warn",'最少选定一条记录进行删除!'.loc());
				}
            }
        }]
    });
	preFuctionGrid.on('afteredit',function(e){
		if(e.column==0){
			e.record.set('fuctionType_txt',this.preFunctionType.getEl().dom.value);
			e.record.set('fuctionType',e.value)
		}
	},this);
	this.preFunctionType.on('select', function(){
		var nds=this.nameDs;
		var maxId=1;
		if(this.preFuctionStore)
			maxId=this.preFuctionStore.getCount();
		var selectedRC=preFuctionGrid.selModel.getSelected();
		if(this.preFunctionType.getValue()=='beanshell'){
			using("dev.workflow.popup.ArgWindow");
			nds.loadData(nameArray2);
			var tmpName='bsh.function'+'.'+maxId;
			this.preFunctionTitle.setValue(tmpName);
			selectedRC.set('fuctionTitle',tmpName);
			Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,'beanshell',null);
			Workflow.argWin.win.on('close',function(){	
				if(Workflow.argWin.argKey){
					this.addPreArg(tmpName,[['script',Workflow.argWin.argKey]]);
					preFuctionGrid.stopEditing();
				}
			},this);
			Workflow.argWin.show();
		}else{
			var tmpName='set.caller'+'.'+maxId;
			this.preFunctionTitle.setValue(tmpName);
			selectedRC.set('fuctionTitle',tmpName);
			nds.loadData(nameArray1);
		}
	}, this);
	this.preFunctionTitle.on('select', function(){
		var val=this.preFunctionTitle.getValue();
		var selectedRC=preFuctionGrid.selModel.getSelected();
		if(val.indexOf('set.logic')!=-1||val.indexOf('set.most.recent.owner')!=-1||val.indexOf('set.Notify')!=-1){
			using("dev.workflow.popup.ArgWindow");
			var maxId=1;
			if(this.preFuctionStore)
				maxId=this.preFuctionStore.getCount();
			var tmpName=val+'.'+maxId;
			this.preFunctionTitle.setValue(tmpName);
			selectedRC.set('fuctionTitle',tmpName);
			Workflow.argWin = new dev.workflow.popup.ArgWindow(parent_id,wf,val,null);
			Workflow.argWin.win.on('close',function(){	
				if(Workflow.argWin.argKey){
					if(val.indexOf('set.logic')!=-1||val.indexOf('set.Notify')!=-1){
						this.addPreArg(tmpName,[['parent_id',Workflow.argWin.argKey]]);
					}else if(val.indexOf('set.most.recent.owner')!=-1){
						this.addPreArg(tmpName,[['stepId',Workflow.argWin.argKey]]);
					}
					preFuctionGrid.stopEditing();
				}
			},this);
			Workflow.argWin.show();
		}
	}, this);
};

Ext.extend(dev.workflow.popup.PreFuctionGrid, Ext.grid.EditorGridPanel, {
	getPrefunctions : function(){
		var functionArray=[];
		for(var i=0;i<this.preFuctionStore.getCount();i++){
			var functionTmp=new XFunction();
			var rc=this.preFuctionStore.getAt(i);
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
			var tmpArgArray=this.getPreArg(tmpName);

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
	addPreArg : function(name,preArgArray){
		this.XPreArgs[name]=preArgArray;
	},
	getPreArg: function (name){
		if(this.XPreArgs[name]){
			return this.XPreArgs[name];
		}else{
			return null;
		}
   }
});
