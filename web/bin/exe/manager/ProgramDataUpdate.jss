CPM.manager.ProgramDataUpdate = Ext.extend(CPM.manager.CustomizeObject, {
			className : 'CPM.manager.ProgramDataUpdate',
			programType : 'ProgramDataUpdate',
			updateData : function(panel, param) {
				panel.store.load({
							params : param
						});
				Ext.apply(panel.store.baseParams, param);
			},
			load : function(mode, parentPanel, param) {  
				this.getData(mode, param, function(result, model) {
							var me = this;
							var fn = function() {
								var box = parentPanel.getBox();
								if (box.width == 0 || box.height == 0) {
									setTimeout(fn,50);
									return;
								}
								var panel = me.createModel(parentPanel, result,
										param);
								panel.param = param;
								panel.store.load({	
									params : {
											start : 0,
											limit : 50
									}}
								);
							}
							fn();
						}.createDelegate(this));
			},
			createModel : function(parentPanel, json, param) {
				if (parentPanel.ownerCt.xtype == 'tabpanel' && json.title) {
					parentPanel.setTitle(json.title);
				}
				var id = Ext.id();

				param['tooltipText']='检查名称'.loc();
				var record=this.record = Ext.data.Record.create([
					{name: 'qualityId'},
					{name: 'instanceId'},
					{name: 'checkDate'},
					{name: 'qualityName'},
					{name: 'instanceName'},
					{name: 'exportData'},
					{name: 'title'},
					{name: 'errorDesc'},
					{name: 'exportTab'},
					{name: 'exportItem'},
					{name: 'notifyTime'}
				]);   
				var store=this.store = new Ext.data.GroupingStore({
					autoLoad : false,
					url: '/bin/exe/getQualityResult.jcp',
					reader: new Ext.data.JsonReader(
						{
							root: 'data',
							totalProperty: 'total',
							successProperty: 'success'
						}, 
						record
					),
					baseParams: param,
					sortInfo:{field: 'title', direction: "ASC"},
					groupField:'qualityName'
				});
				var me=this;
				this.titleRenderers = {
					topic : function(value, p, record){
						return String.format(
								'<div style="padding-left:0px;font-size:13px"><b>{0}</b></div>',value);
					}
				};
				var panel={
					id:id,
					border: true,
					layout:'fit',
					xtype : 'grid',
					store: this.store,
					scope:this,
					columns: [    
						{header: '检查实例'.loc(), width: 80, sortable: true, menuDisabled:true,dataIndex: 'instanceName'},
						{groupName: param.tooltipText, width: 80,hidden:true, sortable: true, menuDisabled:true, dataIndex: 'qualityName'},
						{groupName: '检查名称'.loc(), width: 60,hidden:true, sortable: true, menuDisabled:true, dataIndex: 'qualityName'},
						{id:'title',header: '数据项'.loc(), width: 90, fix: true, sortable: true, menuDisabled:true, dataIndex: 'title',renderer:this.titleRenderers.topic},
						{header: '错误描述'.loc(), width: 300,hidden:false, fix: true, sortable: true, menuDisabled:true, dataIndex: 'errorDesc'},
						{header: '检查日期'.loc(), width: 50, fix: true, sortable: true, menuDisabled:true, dataIndex: 'checkDate'}
					],
					view:me.groupview=new Ext.grid.GroupingView({
						forceFit:true,
						enableRowBody:true,
						showPreview:false,
						groupTextTpl: '{text} ('+'共'.loc()+'{[values.rs.length]}'+'条'.loc()+')'
					}),
					stripeRows: true,
					hideHeaders:false,
					autoExpandColumn: 'title',
					listeners : {
						rowclick : function(panel, rowIndex, e) {
						    var rec = me.store.getAt(rowIndex);
							if(rec.get("qualityId")!=''){
								using("bin.exe.QualityFrame");
								var qualityParams={};
								qualityParams['exportData']=rec.get('exportData');
								qualityParams['qualityId']=rec.get("qualityId");
								qualityParams['instanceId']=rec.get("instanceId");
								qualityParams['dataId']=rec.get("exportData");
								qualityParams['exportItem']=rec.get("exportItem");
								qualityParams['exportTab']=rec.get("exportTab");

								var conn=new Ext.data.Connection();
								var paramString=Ext.urlEncode(qualityParams);
								conn.request({    
										method: 'GET',    
										url:'/bin/exe/getQualityFrame.jcp?'+paramString+'&rand='+Math.random()
								});
								conn.on('requestcomplete', function(conn, oResponse ){	
									var QualityFrameJSON = Ext.decode(oResponse.responseText);
									var qualityFrameWin=new bin.exe.QualityFrame(qualityParams,QualityFrameJSON);
									qualityFrameWin.win.on('close',function(){
										me.store.reload();
									},this)
									qualityFrameWin.show();
								}, this);
							}
						}
					},
					sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
					bbar: new Ext.PagingToolbar({
							pageSize : 50,
							store :  this.store,
							displayInfo : true,
							emptyMsg : '没有数据'.loc()
					})
				};
  				if (Ext.isArray(json.buttonArray)) {
					var btns = new Array(), cb = null;
					Ext.each(json.buttonArray, function(btn) {
								cb = this.getButton(btn, id);
								btns.push((cb == null) ? btn : cb);
							}, this);
					(btns.length > 0) && (panel.tbar = btns);
				}

				if (Ext.isDefined(json.events)) {
					panel.listeners = json.events;
				}
				panel = parentPanel.add(panel);
				parentPanel.doLayout();
				panel.items.each(function(item) {
							CPM.replacePanel(undefined, item, Ext.applyIf({
												programType : item.programType,
												objectId : item.objectId,
												showTopToolbar : false
											}, param));
				});
				return panel;
			},
			canUpdateDataOnly : function(panel, parentPanel, param) {
				return (typeof(panel) != 'undefined')
						&& panel.param.objectId == param.objectId
						&& panel.param.programType == param.programType
			},
			buttonMap : {
				'%refresh' : {
					handler : function(btn) {
						me.store.reload();
					}
				},
				'%excel' : {
					handler : function(btn) {
						Ext.msg("warn", '暂时未实现,请等待...'.loc());
					}
				}
			}
		});