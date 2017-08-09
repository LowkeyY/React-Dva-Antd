/*
*	----1、设定显示列
*	----2、设定返回值列.
*	----3、增加内置Panel
*	----4、嵌入内置table
*	----5、转义字段
	--6、将多行选项择改为每页行数.
*  bug
	----1、不能同时对两列使用同一个格式
	----2、改变列宽会报错
*/

Ext.namespace("dev.ctrl");
dev.ctrl.WidgetListManage=function(params){
	var params=this.params=params;
	var grid;
	this.setGrid=function(gd){grid=gd;}
	this.loadData(false);
	

	var win=this.win=new Ext.Window({
			title:'设置弹出窗口大小及表列设置'.loc(),
			layout:'fit',
			height:200,
			width:450,
			constrain:true,
			closable:false
	});
	this.colStore= new Ext.data.JsonStore( {
		root : 'cols',
		fields : ["id", "label"]
	});
	this.innerPanel=new Ext.Panel({
				layout : 'border',
				border : false,
				items:[
					{
						xtype:'form',
						id:'tz-inner-form',
						border:false,
						layout:'column',
						region:'north',
						height:80,
						bodyStyle:'padding:20px 0px 0px 20px;height:100%;width:100%;background:#FFFFFF;',
						items:[
							{
								columnWidth:0.5,
								border:false,
								layout:'form',
								items:[{
											xtype:'combo',
											store:this.colStore,
											fieldLabel:'显示列'.loc(),
											hiddenName: 'showCol',
											width: 150,
											valueField : 'id',
											displayField : 'label',
											triggerAction : 'all',
											listeners:{
												scope:this,
												select:function(obj,rec,index){
													var view=this.grid.getView();
													for(var cf=view.cm.config,i=0,label=rec.data.label;i<cf.length;i++){
														if(cf[i].header==label && !cf[i].hidden)
															Ext.get(view.getHeaderCell(i)).highlight("#dddddd");
													}
												}
											},
											mode : 'local'
										},{
											xtype:'checkbox',
											fieldLabel:'显示分页导航'.loc(),
											value:true,
											id:'showPagingBar',
											listeners:{
												scope:this,
												check:function(item){
													if(this.pgBar){
														this.pgBar.setVisible(item.checked);
														this.win.setHeight(this.win.getSize().height+((item.checked)?1:-1));
													}
												}
											}
											
										}]
							},{
								columnWidth:0.5,
								border:false,
								layout:'form',
								items:[{
											xtype:'combo',
											store:this.colStore,
											fieldLabel:'返回值列'.loc(),
											hiddenName: 'valueCol',
											width: 150,
											valueField : 'id',
											displayField : 'label',
											triggerAction : 'all',
											listeners:{
												scope:this,
												select:function(obj,rec,index){
													var view=this.grid.getView();
													for(var cf=view.cm.config,i=0,label=rec.data.label;i<cf.length;i++){
														if(cf[i].header==label && !cf[i].hidden)
															Ext.get(view.getHeaderCell(i)).highlight();
													}
												}
											},
											mode : 'local'						
										},{
											xtype:'numberfield',
											id:'rowsPerPage',
											fieldLabel:'每页行数'.loc()
										}]
							}
						]
				
					},{
						region:'center',
						border:true,
						layout:'absolute',
						items:win
					}
				],
				tbar:[
				new Ext.Toolbar.Button( {
					text : '保存',
					icon : '/themes/icon/xp/save.gif',
					cls : 'x-btn-text-icon',
					scope : this,
					handler : function() {
						var ret=this.win.getSize();
						var fm=Ext.getCmp('tz-inner-form').form;
						var val=fm.findField('showCol').getValue();
						if(val=='') {
							fm.findField('showCol').markInvalid('显示列必须选择'.loc());
							Ext.msg("error",'显示列必须选择'.loc());
							return;
						}
						ret.showCol=val;
						val=fm.findField('valueCol').getValue();
						if(val=='') {
							fm.findField('valueCol').markInvalid('返回值列必须选择'.loc());
							Ext.msg("error", '返回值列必须选择'.loc());
							return;
						}
						ret.valueCol=val;
						ret.showPagingBar=fm.findField('showPagingBar').getValue();
						ret.rowsPerPage=fm.findField('rowsPerPage').getValue();
						
						
						var arr=new Array();
						Ext.each(grid.getView().cm.config,function(item){
							arr.push(Ext.copyTo({},item,"id,tabid,header,sortable,sortType,align,width,renderType,widgetId,hidden,extra"))
						});
						
						Ext.Ajax.request({ 
							url:'/dev/ctrl/WidgetListManage.jcp',
							params:{
								object_id:this.params.parent_id,
								cols:Ext.encode(arr),
								ret:Ext.encode(ret)
							},
							method: 'post',  
							scope:this,
							success:function(response, options){
									Ext.msg("info",'数据保存成功!'.loc());
							},
							failure:function(response, options){
								Ext.msg("error",'保存失败,原因:'.loc()+response.message);
							}
						})
					}
				}),
				new Ext.Toolbar.Button( {
					text : '重置'.loc(),
					icon : '/themes/icon/xp/refresh.gif',
					cls : 'x-btn-text-icon',
					scope : this,
					handler : function() {
						var fm=Ext.getCmp('tz-inner-form').form;
						fm.reset();
						this.loadData(true);
					}
				}),new Ext.Toolbar.Button( {
					text : '返回'.loc(),
					icon: '/themes/icon/common/redo.gif',
					cls: 'x-btn-text-icon  bmenu',
					scope : this,
					handler : params.retFn
				}) ]
			});
	this.MainTabPanel = this.innerPanel;
	this.MainTabPanel.on("destroy",function(){
		win.destroy();
	},this)

}

dev.ctrl.WidgetListManage.prototype={
	hideFormatMenu:false,
	hideAlignMenu:false,
	hideDeleteColMenu:false,
	ExampleRows:40,
	grid:null,
	loadData:function(reset){
		var isReset=reset;
		Ext.Ajax.request( {
			url : '/dev/ctrl/WidgetListManage.jcp?object_id='+((isReset)?this.params.parent_id+"&type=reset":this.params.parent_id),
			scope:this,
			callback : function(options, success, response) {
				if(!success){
					    Ext.msg("error",'服务器无法获取数据'.loc());
				}else{
					var data=Ext.decode(response.responseText);
					if(!data.success){
						Ext.msg("error",'服务器获取数据错误'.loc());
					}else{
						var ret=this.parseResponse(data.data);
						this.colStore.loadData(data);
						Ext.getCmp('tz-inner-form').form.setValues(data.ret);
						if(isReset){
							var size=this.grid.getSize().width;
							this.grid.reconfigure(ret.store,new Ext.grid.ColumnModel(ret.cm));
							this.grid.setWidth(size-1);
						}else{
							var gd=this.genGrid(ret.store,ret.cm,data.ret.showPagingBar);
							this.setGrid(gd);
							this.win.add(gd);
							this.win.setSize(data.ret.width,data.ret.height);
							this.win.show();
							this.win.doLayout();
						}
					}
				}
			}
		});
	},
	parseResponse:function(data){
		var fields=new Array(),fakes=new Array(),columns=new Array(),cof=new Array();
		var tmplen=0,startValue,increase=false,sortInfo=null;
		for(var i=0;i<data.length;i++){
			if(data[i].type=='varchar') data[i].type='string';
			fields.push({name:data[i].dataIndex, type: data[i].type});
			if(!data[i].width) 
				data[i].width=(data[i].header.length<3)?60:data[i].header.length*20;
			if(typeof(data[i].sortable)=='undefined') data[i].sortable=true;
			if(typeof(data[i].renderType)!='undefined')
				this.syncRenderer(data[i]);
			if(typeof(data[i].sortType)!='undefined')
				sortInfo={field: data[i].dataIndex, direction: data[i].sortType};
			
			columns.push(data[i]);
			
			
			if(data[i].type=="string"){
				cof.push({
					prefix:'示例'.loc(),
					startValue:1,
					increase:true
				})	
			}else if(data[i].type=="date"){
				cof.push({
					prefix:false,
					startValue:new Date(),
					increase:false
				})	
			}else{
				cof.push({
					prefix:false,
					startValue:1,
					increase:true
				})
			}
			
		}
		tmplen=data.length;
		for(var i=0;i<this.ExampleRows;i++){
			fakes[i]=new Array(tmplen);
			for(var j=0;j<tmplen;j++){
				fakes[i][j]=(cof[j].prefix)?cof[j].prefix+cof[j].startValue:cof[j].startValue;
				if(cof[j].increase) cof[j].startValue++;
			}
		}
		var gstore =new Ext.data.SimpleStore( {
				fields:fields,
				mode:'local',
				data:fakes,
				autoLoad:false,
				totalProperty:this.ExampleRows,
				sortInfo:sortInfo
			})
		return {
			store:gstore,
			cm:columns
		};
	},
	syncRenderer:function(cfg){
		switch(cfg.renderType){
			case 0:
				delete(cfg.renderer);
				delete(cfg.renderType);
				break;
			case 1:
				cfg.renderer=Ext.util.Format.usMoney
				break;
			case 2:
				cfg.renderer=Ext.util.Format.dateRenderer('Y/m/d');
				break;
			case 3:
				cfg.renderer=Ext.util.Format.dateRenderer('Y/m/d H:i:s')
				break;								
			case 4:
				cfg.renderer=function(v){return '<font style="font-weight:bold">'+v+'</font>'};
				break;
		}
		return cfg;
	},
	applyFormat:function(combo,val){
		if(combo.passedval==val) return false;
		combo.passedval=val;
		var cfg=this.grid.getCurrentConfig();
		cfg.renderType=val;
		this.syncRenderer(cfg);
		this.grid.getView().refresh();					
	},
	genGrid:function(gstore,cols,showPagingBar){
		this.pgBar=new Ext.PagingToolbar({
					pageSize: 20,
					store: gstore,
					disabled:true,
					hideMode:'display',
					hideParent:true,
					hidden:!showPagingBar,
					displayInfo: true,
					displayMsg: '数据 {0} - {1} of {2}'.loc(),
					emptyMsg: '无数据'.loc(),
					dsLoaded:[gstore,"",{}]
				});
		var grid=this.grid= new Ext.grid.GridPanel( {
				store : gstore,
				region:'center',
				stripeRows:true,
				sortable:true,
				columns : cols,
				viewConfig : {
					forceFit : false
				},
				sm : new Ext.grid.RowSelectionModel( {
					singleSelect : true
				}),
				height : 250,
				iconCls : 'icon-grid',
				trackMouseOver:false,
				bbar: this.pgBar
			});
		grid.getCurrentConfig=function(){
			var view = this.getView();
			if(!view || view.hdCtxIndex === undefined)
				return null;
			return view.cm.config[view.hdCtxIndex];
		}
		grid.on("render",function(){
			var view=grid.getView();
			var formatCombo=new Ext.form.ComboBox({
					valueField : 'value',
					displayField : 'text',
					triggerAction : 'all',
					allowBlank:true,
					mode : 'local',
					width:110,
					listeners:{
						scope: this,
						change:function(combo,val,oldval){
							this.applyFormat(combo,val);
							return false;
						},
						select:function(combo,rec,index){
							this.applyFormat(combo,rec.get("value"));
							return false;
						}
					},
					store:new Ext.data.SimpleStore( {
								fields : ['text','value'],
								data : [['无格式'.loc(),0],['UsMoney',1],['短日期'.loc(),2],['长日期'.loc(),3],['粗体'.loc(),4]]
							})
				});
			var alignCombo=new Ext.form.ComboBox({
					valueField : 'value',
					displayField : 'text',
					triggerAction : 'all',
					mode : 'local',
					width:110,
					value:'justify',
					allowBlank:false,
					listeners:{
						select:function(combo,rec,index){
							var newval=rec.get("value");
							if(newval=='justify') newval="";
							grid.getCurrentConfig().align=newval;
							view.refresh();
						}
					},
					store:new Ext.data.SimpleStore( {
								fields : ['text','value'],
								data : [['两端对齐'.loc(),'justify'],['居左'.loc(),'left'],['居中'.loc(),'center'],['居右'.loc(),'right']]
							})
				});
			var hmenu=view.hmenu;
			hmenu.items.get(0).on("click",function(){
				grid.getCurrentConfig().sortType='ASC'
			});
			hmenu.items.get(1).on("click",function(){
				grid.getCurrentConfig().sortType='DESC'
			});
			hmenu.on("beforeshow",function(menu){				
				var cfg=grid.getCurrentConfig();
				menu.items.get('freezeCol').setChecked(!cfg.sortable);
				menu.items.get(1).setDisabled(!cfg.sortable);
				menu.items.get(2).setDisabled(!cfg.sortable);
				menu.items.get(3).setDisabled(!cfg.sortable);
				formatCombo.setValue((typeof(cfg.renderType)=='undefined')?"":cfg.renderType);
				formatCombo.passedval='';
				alignCombo.setValue((typeof(cfg.align)=='undefined')?"justify":cfg.align);
				return true;
			},this);
			hmenu.insert(0,new Ext.menu.CheckItem({
					id:'freezeCol',
					text: '禁止排序'.loc(),
					checked:false,
					handler: function(item){
						var cfg=grid.getCurrentConfig();
						cfg.sortable=item.checked;
						if(!cfg.sortable && typeof(cfg.sortType)!='undefined'){
							delete(cfg.sortType);
						}
						return true;
					},
					scope: this
				}));
			hmenu.insert(1,new Ext.menu.Item({
					text: '默认顺序'.loc(),
					handler: function(){
						
						grid.getCurrentConfig().sortType='default';
						return true;
					},
					scope: this,
					icon:'/themes/icon/all/style.gif'
				}));
			hmenu.add('-',{
					id:'deleteCol',
					text: '删除此列'.loc(),
					hidden:this.hideDeleteColMenu,
					handler: function(){
						this.getColumnModel().setHidden(this.getView().hdCtxIndex, true);
					},
					scope: grid,
					icon:'/themes/icon/all/cross.gif'
				},{
					id:'setFormat',
					text: '设置格式'.loc(),
					hidden:this.hideFormatMenu,
					handler: function(){
						return false;
					},
					menu:[new dev.ctrl.EditableItem({
							icon:"/themes/icon/xp/autodesk.png",
							style:'width:150px',
							editor:formatCombo,
							scope: this
						})],
					scope: this,
					icon:'/themes/icon/all/text_signature.gif'
				},{
					id:'align',
					text: '对齐'.loc(),
					hidden:this.hideAlignMenu,
					handler: function(){
						return false;
					},
					menu:[new dev.ctrl.EditableItem({
							icon:"/themes/icon/all/text_align_center.gif",
							style:'width:150px',
							editor:alignCombo,
							scope: this
						})],
					scope: this,
					icon:'/themes/icon/all/text_align_justify.gif'
				}
			);
		},this);
		return grid;
	}
}