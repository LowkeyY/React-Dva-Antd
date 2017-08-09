/*
 * ----1、弹出设定窗口 ----2、显示翻页. ----3、读入表设置 ----4、生成临时store,示例数据生成30条
 * ----5、存入数据库,与老库绑定，扩充字段 ----6、结果即时显示. ----7、弹出窗口动态载入. ----8、排序方式设定或禁止排序
 * ----9、reset,return. ----10、扩充表，实现link1,link2,link3 bug ----1、不能同时对两列使用同一个格式
 */

Ext.namespace("dev.ctrl");
using("lib.ComboTree.ComboTree");
using("lib.SelectUnit.SelectUnit");
using("dev.ctrl.MultiEditableItem");
using("lib.GroupHeaderGrid.GroupHeaderGrid");

dev.ctrl.ListQueryManage = function(params) {
	var params = this.params = params;
	var grid;
	this.setGrid = function(gd) {
		grid = gd;
	}
	this.loadData(false);

	var formId = Ext.id();

	var targetPanel = new dev.ctrl.TargetPanel({
				parentPanel : formId,
				objectId : params.parent_id
			});

	var form = new Ext.form.FormPanel({
				border : false,
				id : formId,
				bodyStyle : 'padding:20px 0 0 15px;',
				items : targetPanel.getFirstCombo()
			});
	var win = this.win = new Ext.Window({
				title : '选定列目标参数设置'.loc(),
				layout : 'fit',
				height : 200,
				width : 750,
				items : form,  
				buttons : [{
							text : '保存设置'.loc(),
							cls : 'x-btn-text-icon',
							icon : '/themes/icon/all/add.gif',
							handler : function() {
								grid.getCurrentConfig().extra = targetPanel
										.getValue();
								win.hide();
							}
						}, {
							text : '删除设置'.loc(),
							cls : 'x-btn-text-icon',
							icon : '/themes/icon/all/delete.gif',
							handler : function() {
								delete(grid.getCurrentConfig().extra);
								win.hide();
							}
						}, {
							text : '关闭窗口'.loc(),
							cls : 'x-btn-text-icon',
							icon : '/themes/icon/all/cross.gif',
							handler : function() {
								this.win.hide();
							},
							scope : this
						}]
			});
	win.setValue = function(value) {
		if (typeof(value) != 'undefined')
			targetPanel.setValue(value);
		else
			targetPanel.setValue(["0", "", "", "", "", "", "", "", "", "", ""]);
	}
	var buttonArray = [new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon',
				scope : this,
				handler : function() {
						
					var arr=new Array();
					Ext.each(grid.getView().cm.config,function(item){
						arr.push(Ext.copyTo({},item,"id,queryId,sortable,sortType,align,width,headerGroup,isExport,unit,targetUnit,hidden,extra,exportSequence,exportName"))
					});

					var p = {
						object_id : this.params.parent_id,
						cols : Ext.encode(arr)
					};
					Ext.Ajax.request({
								url : '/dev/ctrl/ListQueryManage.jcp',
								params : p,
								method : 'post',
								scope : this,
								success : function(response, options) {
									Ext.msg("info", '数据保存成功!'.loc());
								},
								failure : function(response, options) {
									Ext.msg("error", '保存失败,原因:'.loc()
													+ response.message);
								}
							})
				}
			}), new Ext.Toolbar.Button({
				text : '重置'.loc(),
				icon : '/themes/icon/xp/refresh.gif',
				cls : 'x-btn-text-icon',
				scope : this,
				handler : function() {
					this.loadData(true);
					Ext.msg("info","重置成功!".loc());
				}
			}), new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function() {
					params.returnFunction();
				}
			})];
	this.MainTabPanel = new Ext.Panel({
				layout : 'fit',
				tbar : buttonArray,
				border : false
			});
	this.MainTabPanel.on("destroy", function() {
				if (targetPanel != null)
					targetPanel.destroy();
				win.destroy();
			}, this)

}

dev.ctrl.ListQueryManage.prototype = {
	hideFormatMenu : false,
	hideAlignMenu : false,
	hideTargetConfigMenu : false,
	hideDeleteColMenu : false,
	ExampleRows : 20,
	grid : null,
	loadData : function(reset) {
		var isReset = reset;
		Ext.Ajax.request({
					url : '/dev/ctrl/ListQueryManage.jcp?object_id='
							+ ((isReset) ? this.params.parent_id
									+ "&type=reset" : this.params.parent_id),
					scope : this,
					callback : function(options, success, response) {
						if (!success) {
							Ext.msg("error", '服务器无法获取数据'.loc());
						} else {
							var data = Ext.decode(response.responseText);
							if (!data.success) {
								Ext.msg("error", '服务器获取数据错误'.loc());
							} else {
								var ret = this.parseResponse(data.data);
								if (isReset) {
									var size = this.grid.getSize().width;
									this.grid.reconfigure(ret.store,
											new Ext.grid.ColumnModel(ret.cm));
									this.grid.setWidth(size - 1);
								} else {
									var gd = this.genGrid(ret.store, ret.cm,
											this.params.parent_id);
									this.setGrid(gd);
									this.MainTabPanel.add(gd);
									this.MainTabPanel.doLayout();
								}
							}
						}
					}
				});
	},
	parseResponse : function(data) {
		var fields = new Array(), fakes = new Array(), columns = new Array(), cof = new Array();
		var tmplen = 0, startValue, increase = false, sortInfo = null;
		for (var i = 0; i < data.length; i++) {
			if (data[i].type == 'varchar')
				data[i].type = 'string';
			fields.push({
						name : data[i].dataIndex,
						type : data[i].type
					});
			if (!data[i].width)
				data[i].width = (data[i].header.length < 3)
						? 60
						: data[i].header.length * 20;
			if (typeof(data[i].sortable) == 'undefined')
				data[i].sortable = true;
			if (typeof(data[i].sortType) != 'undefined')
				sortInfo = {
					field : data[i].dataIndex,
					direction : data[i].sortType
				};

			columns.push(data[i]);

			if (data[i].type == "string") {
				cof.push({
							prefix : '示例'.loc(),
							startValue : 1,
							increase : true
						})
			} else if (data[i].type == "date") {
				cof.push({
							prefix : false,
							startValue : new Date(),
							increase : false
						})
			} else {
				cof.push({
							prefix : false,
							startValue : 1,
							increase : true
						})
			}

		}
		tmplen = data.length;
		for (var i = 0; i < this.ExampleRows; i++) {
			fakes[i] = new Array(tmplen);
			for (var j = 0; j < tmplen; j++) {
				fakes[i][j] = (cof[j].prefix) ? cof[j].prefix
						+ cof[j].startValue : cof[j].startValue;
				if (cof[j].increase)
					cof[j].startValue++;
			}
		}
		var gstore = new Ext.data.SimpleStore({
					fields : fields,
					data : fakes,
					sortInfo : sortInfo
				})
		return {
			store : gstore,
			cm : columns
		};
	},
	genGrid : function(gstore, cols, objectId) {
		var headerArray=[];
		var selectedCol=[];
		var selectedColSeq=[];
		var row={};
		var leaf={};
		for(var i=0;i<cols.length;i++){
			var title= cols[i].header;
			var headerGroup=cols[i].headerGroup;
			if(headerGroup){
				var t=headerGroup.split('::');
				row[title]=t;
			}			
		}
		var level=0;
		for(var i=0;i<cols.length;i++){
			var title= cols[i].header;
			if(row[title]){
				var t=row[title];
				if(t.length>level){
					level=t.length;
				}
			}
		}
		
		for(var i=0;i<level;i++){
			var childArray=[];
			var colSpan=0;
			var headTitle="";
			for(var j=0;j<cols.length;j++){
				var title= cols[j].header;
				var t=row[title];
				if((typeof(t)!="undefined")&&t[i]){
					if(headTitle==t[i]){
						colSpan++;
						if(headTitle!=""){
							if(!leaf[headTitle]){
								var isLeaf="0";
								if(t.length-1==i){
									isLeaf="1";
								}else{
									isLeaf="0";
								}
								leaf[headTitle]=isLeaf;
							}
						}
						if(j==cols.length-1){
							if(headTitle!=""){
								var headerSpan={};
								headerSpan['header']=headTitle;
								headerSpan['colspan']=colSpan+1;
								headerSpan['align']='center';
								headerSpan['leaf']=leaf[headTitle];
								childArray.push(headerSpan);
								colSpan=0;
							}
						}
					}else{
						if(headTitle!=""){
							var headerSpan={};
							headerSpan['header']=headTitle;
							headerSpan['colspan']=colSpan+1;
							headerSpan['align']='center';
							headerSpan['leaf']=leaf[headTitle];
							childArray.push(headerSpan);
							colSpan=0;
						}
						headTitle=t[i];
					}
				}else{
					if(headTitle!=""){
						var headerSpan={};
						headerSpan['header']=headTitle;
						headerSpan['colspan']=colSpan+1;
						headerSpan['align']='center';
						headerSpan['leaf']=leaf[headTitle];
						childArray.push(headerSpan);	
					}
					colSpan=0;
					headTitle="";
					childArray.push({});
				}
			}
			headerArray.push(childArray);
		}
		var headerGroup=new lib.GroupHeaderGrid.GroupHeaderGrid({
				rows: headerArray,
				hierarchicalColMenu: true
		});
		var grid = this.grid = new Ext.grid.GridPanel({
					store : gstore,
					region : 'center',
					stripeRows : true,
					sortable : true,
					columns : cols,
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					iconCls : 'icon-grid',
					trackMouseOver : false,
					plugins:headerGroup,
					bbar : new Ext.PagingToolbar({
								pageSize : 50,
								store : gstore,
								displayInfo : true,
								displayMsg : '数据'.loc()+' {0} - {1} of {2}',
								emptyMsg : '无数据'.loc()
					})
				});
		grid.getCurrentConfig = function() {
			var view = this.getView();
			if (!view || view.hdCtxIndex === undefined)
				return null;

			return view.cm.config[view.hdCtxIndex];
		}
		/*
		grid.on("headermousedown", function(gd,columnIndex,e){
			var view = grid.getView();
			var hmenu = view.hmenu;
			var cm = view.cm, rows = view.cm.rows;
			hmenu.items.each(function(item){ 
				if(item.text=='取消头分组'){
					item.hide()
				}else{
					item.show()
				}
			}, hmenu.items);
		},this);   */
		grid.on("render", function() {
			var view = grid.getView();

			var showUnit = this.getComboItem(new lib.SelectUnit.SelectUnit({
								width : 180,
								objectId : objectId,
								listClass : "x-menu x-menu-combo-list",
								listeners : {
									scope : this,
									select : function(obj) {
										grid.getCurrentConfig().targetUnit = {
											value : obj.getValue(),
											text : obj.getText()
										};
										obj.menu.parentMenu.hide(true);
									}
								}
							}), {
						menuIcon : '/themes/icon/all/brick.gif',
						style : 'width:218px'
					});
			var dataUnit = this.getComboItem(new lib.SelectUnit.SelectUnit({
								width : 180,
								objectId : objectId,
								listeners : {
									scope : this,
									select : function(obj) {
										var v = {
											value : obj.getValue(),
											text : obj.getText()
										};
										grid.getCurrentConfig().unit = v;
										if (showUnit.getValue() == '')
											showUnit.setValue(v)
										obj.menu.parentMenu.hide(true);
									}
								},
								listClass : "x-menu x-menu-combo-list"
							}), {
						menuIcon : '/themes/icon/all/brick.gif',
						style : 'width:218px'
					});
			var vName = new Ext.form.TextField({
						fieldName : '参数名'.loc(),
						blankText : '填写导出参数名'.loc(),
						width : 120
					});
			var seqData = new Array();
			seqData.push(['不导出'.loc(), ""]);
			for (var i = 1; i <= view.cm.config.length; i++) {
				seqData.push(['第'.loc() + i + '个'.loc(), i]);
			}
	
			var exportCombo = new Ext.form.ComboBox({
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						listClass : "x-menu x-menu-CheckItem-list",
						mode : 'local',
						forceSelection : true,
						resizeable : true,
						width : 70,
						allowBlank : false,
						value : '1',
						listeners : {
							select : function(CheckItem, rec, index) {
								var newval = rec.get("value");
								var cfg = grid.getCurrentConfig();
								if (newval == "") {
									cfg.isExport = false;
									vName.setValue("");
								} else {
									cfg.isExport = true;
								}
								cfg.exportSequence = newval;
								cfg.exportName = vName.getValue();
								CheckItem.menu.parentMenu.hide(true);
							}
						},
						store : new Ext.data.SimpleStore({
									fields : ['text', 'value'],
									data : seqData
								})
					});
			exportCombo.on("render", function(obj) {
						if (Ext.isGecko) {
							obj.wrap.setStyle("margin-left", "10px");
						}
					});
			var styleString='width:200px';
			if (Ext.isGecko) {
				styleString='margin-left:30px;width:200px';
			}
			var CheckComboItem = new dev.ctrl.MultiEditableItem({
						menuIcon : "/themes/icon/all/text_align_center.gif",
						style :styleString,
						editors : [vName, exportCombo],
						canActivate : true,
						deactivate : function() {
							exportCombo.collapse();
						},
						activate : function() {
							var li = this.container;
							this.region = li.getRegion().adjust(2, 2, -2, -2);
							return true;
						},
						shouldDeactivate : function(e) {
							return !exportCombo.hasFocus;
						}
			});
			exportCombo.menu = CheckComboItem;

			var combo = new Ext.form.ComboBox({
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						listClass : "x-menu x-menu-combo-list",
						mode : 'local',
						width : 110,
						lazyInit : false,
						allowBlank : false,
						value : 'justify',
						listeners : {
							select : function(combo, rec, index) {
								var newval = rec.get("value");
								if (newval == 'justify')
									newval = "";
								grid.getCurrentConfig().align = newval;
								view.refresh();
								combo.menu.parentMenu.hide(true);
							}
						},
						store : new Ext.data.SimpleStore({
									fields : ['text', 'value'],
									data : [['两端对齐'.loc(), 'justify'],
											['居左'.loc(), 'left'], ['居中'.loc(), 'center'],
											['居右'.loc(), 'right']]
								})
					});

			var alignComboItem = this.getComboItem(combo, {
						style : 'width:146px'
					});

			var hmenu = view.hmenu;
			hmenu.items.get(0).on("click", function() {
						grid.getCurrentConfig().sortType = 'ASC'
					});
			hmenu.items.get(1).on("click", function() {
						grid.getCurrentConfig().sortType = 'DESC'
					});
			hmenu.on("beforeshow", function(menu) {
						var cfg = grid.getCurrentConfig();
						menu.items.get('freezeCol').setChecked(!cfg.sortable);
						menu.items.get(1).setDisabled(!cfg.sortable);
						menu.items.get(2).setDisabled(!cfg.sortable);
						menu.items.get(3).setDisabled(!cfg.sortable);
						menu.items.get('isExport').setChecked(
								cfg.isExport === true, true);
						menu.items.get('setupCol')
								.setChecked((typeof(cfg.extra) != 'undefined'));
						alignComboItem.editor.setValue((typeof(cfg.align) == 'undefined')
										? "justify"
										: cfg.align);
						exportCombo.setValue(cfg.exportSequence || "");
						vName.setValue(cfg.exportName ||"");
						var blank = {
							text : '',
							value : ''
						};
						showUnit.editor.setValue(cfg.targetUnit || blank);
						dataUnit.editor.setValue(cfg.unit || blank);
						return true;
					}, this);
			hmenu.insert(0, new Ext.menu.CheckItem({
								id : 'freezeCol',
								text : '禁止排序'.loc(),
								checked : false,
								handler : function(item) {
									var cfg = grid.getCurrentConfig();
									cfg.sortable = item.checked;
									if (!cfg.sortable
											&& typeof(cfg.sortType) != 'undefined') {
										delete(cfg.sortType);
									}
									return true;
								},
								scope : this
							}));
			hmenu.insert(1, new Ext.menu.Item({
								text : '默认顺序'.loc(),
								handler : function() {

									grid.getCurrentConfig().sortType = 'default';
									return true;
								},
								scope : this,
								icon : '/themes/icon/all/style.gif'
							}));


			var groupCancelMenu = new Ext.menu.Menu({id:this.id + "-grpcancel-menu"});
			groupCancelMenu.on("beforeshow", function() {
				var index = view.hdCtxIndex;
				var cm = view.cm, rows = view.cm.rows;
				groupCancelMenu.removeAll();
				var headerGroup=[];
				for(var col = 0, clen = cm.getColumnCount(); col < clen; col++){
					var menu =groupCancelMenu;
					for (var row = 0, rlen = rows.length; row < rlen; row++) {
						var r = rows[row], group, gcol = 0;
						for (var i = 0, len = r.length; i < len; i++) {
							group = r[i];
							if (col >= gcol && col < gcol + group.colspan) {
								break;
							}
							gcol += group.colspan;
						}
						if (group && group.header) {
							var haveIt=false;
							for(var k=0;k<headerGroup.length;k++){
								if(headerGroup[k]==group.header) haveIt=true;
							}
							if(!haveIt){
								var gid = 'grpCancel-'+ row + '-' + gcol;
								var submenu;
								if(menu.items){
									var item = menu.items.item(gid);
									submenu = item ? item.menu : null;
								}else{
									submenu =null;
								}
								if (!submenu) {
									submenu = new Ext.menu.Menu({itemId: gid});
									submenu.on("itemclick",function(item){
										dropHeaders(item.text);
									}, this);
									submenu.on("hide",function(item){
										updateHeaders();
									}, this);

									var checked = false, disabled = false;		
									if(group.leaf=='1'){
										menu.add({
											itemId: gid,
											text: group.header,
											menu: null, 
											checked: checked,
											group: 'grp',
											hideOnClick:false,											
											disabled: disabled
										});	
									}else{
										menu.add({
											itemId: gid,
											text: group.header,
											menu: submenu,    
											hideOnClick:false,											
											disabled: disabled
										});	
									}
								}
								headerGroup.push(group.header);
								menu = submenu;
							}
						}
					}
				}
			}, this);
			groupCancelMenu.on("itemclick", function(item) {
				dropHeaders(item.text);
			}, this);
			groupCancelMenu.on("hide", function() {
				updateHeaders();
			});
			function dropHeaders(text){
				for(var i in row){
					var t=row[i];
					if(t.length==1){
						if(t[0]==text){
							delete row[i];
						}
					}else{
						for(var k=0;k<t.length;k++){
							if(t[k]==text){
								t.pop();
							}
						}
					}
				}
			}
			var groupMenu = new Ext.menu.Menu({id:this.id + "-grp-menu"});
			groupMenu.on("beforeshow", function() {
				var index = view.hdCtxIndex;
				var cm = view.cm, rows = view.cm.rows;
				groupMenu.removeAll();
				for(var col = 0, clen = cm.getColumnCount(); col < clen; col++){
					if(col>=index){
						var menu =groupMenu, text = cm.getColumnHeader(col);
						if(cm.config[col].fixed !== true && cm.config[col].hideable !== false){
							for (var row = 0, rlen = rows.length; row < rlen; row++) {
								var r = rows[row], group, gcol = 0;
								for (var i = 0, len = r.length; i < len; i++) {
									group = r[i];
									if (col >= gcol && col < gcol + group.colspan) {
										break;
									}
									gcol += group.colspan;
								}
								if (group && group.header) {
									if (cm.hierarchicalColMenu) {
										var gid = 'group-' + row + '-' + gcol;
										var submenu;
										if(menu.items){
											var item = menu.items.item(gid);
											submenu = item ? item.menu : null;
										}else{
											submenu =null;
										}
										if (!submenu) {
											submenu = new Ext.menu.Menu({itemId: gid});
											submenu.on("itemclick",function(item){
												if(selectedCol.length==0){   
													selectedColSeq.push(item.sequence);
													selectedCol.push(item.text);
												}else{
													var s=item.sequence-selectedColSeq[selectedColSeq.length-1];
													if(s!=1){
														Ext.msg("error",'必须连续选择分组列.'.loc());
														selectedCol=[];
														return false;
													}else{
														selectedColSeq.push(item.sequence);
														selectedCol.push(item.text);
													}
												}
											}, this);
											var checked = false, disabled = false;
											menu.add({
												itemId: gid,
												text: group.header,
												menu: submenu,    
												hideOnClick:false,											
												disabled: disabled
											});
										}
										menu = submenu;
									} else {
										text = group.header + ' ' + text;
									}
								}
							}
							menu.add(new Ext.menu.CheckItem({
								itemId: "col-"+cm.getColumnId(col),
								text: text,
								sequence: col,
								checked: false,
								hideOnClick:false,
								disabled: cm.config[col].hideable === false
							}));
						}
					}
				}
			}, this);
			groupMenu.on("itemclick", function(item) {
				if(selectedCol.length==0){   
					selectedColSeq.push(item.sequence);
					selectedCol.push(item.text);
				}else{
					var s=item.sequence-selectedColSeq[selectedColSeq.length-1];
					if(s!=1){
						Ext.msg("error",'必须连续选择分组列.'.loc());
						selectedCol=[];
						return false;
					}else{
						selectedColSeq.push(item.sequence);
						selectedCol.push(item.text);
					}
				}
			}, this);
			function updateHeaders(){
				var cm = view.cm, rows = view.cm.rows;
				headerArray=[];
				var level=0;
				for(var i=0;i<cm.getColumnCount();i++){
					var title= cm.getColumnHeader(i);
					if(row[title]){
						var t=row[title];
						if(t.length>level){
							level=t.length;
						}
					}
				}
				var configArray=cm.config;
				for(var i=0;i<configArray.length;i++){
					if(row[configArray[i].header]){
						cm.config[i].headerGroup=row[configArray[i].header].join('::');
					}
				}
				headerArray=[];
				for(var i=0;i<level;i++){
					var childArray=[];
					var colSpan=0;
					var headTitle="";
					for(var j=0;j<cm.getColumnCount();j++){
						var title= cm.getColumnHeader(j);
						var t=row[title];
						if((typeof(t)!="undefined")&&t[i]){
							if(headTitle==t[i]){
								if(headTitle!=""){
									if(!leaf[headTitle]){
										var isLeaf="0";
										if(t.length-1==i){
											isLeaf="1";
										}else{
											isLeaf="0";
										}
										leaf[headTitle]=isLeaf;
									}
								}
								colSpan++;
								if(j==cm.getColumnCount()-1){
									if(headTitle!=""){
										var headerSpan={};
										headerSpan['header']=headTitle;
										headerSpan['colspan']=colSpan+1;
										headerSpan['align']='center';
										headerSpan['leaf']=leaf[headTitle];
										childArray.push(headerSpan);
										colSpan=0;
									}
								}
							}else{
								if(headTitle!=""){
									var headerSpan={};
									headerSpan['header']=headTitle;
									headerSpan['colspan']=colSpan+1;
									headerSpan['align']='center';
									headerSpan['leaf']=leaf[headTitle];
									childArray.push(headerSpan);
									colSpan=0;
								}
								headTitle=t[i];
							}
						}else{
							if(headTitle!=""){
								var headerSpan={};
								headerSpan['header']=headTitle;
								headerSpan['colspan']=colSpan+1;
								headerSpan['align']='center';
								headerSpan['leaf']=leaf[headTitle];
								childArray.push(headerSpan);	
							}
							colSpan=0;
							headTitle="";
							childArray.push({});
						}
					}
					headerArray.push(childArray);
				}
				selectedCol=[];
				grid.getColumnModel().rows=headerArray;
				view.updateHeaders();
		
			}
			groupMenu.on("hide", function() {
				if(selectedCol.length>0){
					var cm = view.cm, rows = view.cm.rows;
					Ext.Msg.prompt('分组表头'.loc(), '请输入分组表头:'.loc(), function(btn, text){
						if (btn == 'ok'){
							var cm = view.cm, rows = view.cm.rows;
							for(var i=0;i<cm.getColumnCount();i++){
								var title= cm.getColumnHeader(i);
								for(var j=0;j<selectedCol.length;j++){
									if(selectedCol[j]==title){
										if(row[title]){
											var t=row[title];
											t.push(text);
											row[title]=t;
										}else{
											var t=[];
											t.push(text);
											row[title]=t;
										}
									}
								}
							}
							updateHeaders();
						}else{   
							selectedCol=[];
						}
					});
				}
			}, this);
			hmenu.add('-', {
					id : 'groupHead',
					text : '头分组'.loc(),
					menu:groupMenu,
					scope : this,
					cls: "xg-hmenu-reset-columns",
					icon : '/themes/icon/all/table_add.gif'
			}, {
					id : 'cancelGroupHead',
					text : '取消头分组'.loc(),
					scope : this,
					menu:groupCancelMenu,

					icon : '/themes/icon/all/table_delete.gif'
			});
			hmenu.add('-', {
						id : 'deleteCol',
						text : '删除此列'.loc(),
						hidden : this.hideDeleteColMenu,
						handler : function() {
							this.getColumnModel().setHidden(
									this.getView().hdCtxIndex, true);
						},
						scope : grid,
						icon : '/themes/icon/all/cross.gif'
					}, {
						id : 'isExport',
						text : '是否导出'.loc(),
						hidden : false,
						checked : false,
						handler : function(val) {
							var cfg = grid.getCurrentConfig();
							cfg.isExport = !val.checked;
							if (!cfg.isExport) {
								cfg.exportSequence = "";
								cfg.exportName = "";
							}
						},
						menu : [CheckComboItem],
						scope : this
					}, {
						id : 'setupCol',
						text : '设置目标'.loc(),
						checked : false,
						hidden : this.hideTargetConfigMenu,
						handler : function() {
							this.win.setValue(grid.getCurrentConfig().extra);
							this.win.show();
							hmenu.hide();
							return false;
						},
						scope : this
					}, {
						id : 'align',
						text : '对齐'.loc(),
						hidden : this.hideAlignMenu,
						handler : function() {
							return false;
						},
						menu : [alignComboItem],
						scope : this,
						icon : '/themes/icon/all/text_align_justify.gif'
					}, {
						id : 'dataUnit',
						text : '数据单位'.loc(),
						hidden : this.hideAlignMenu,
						handler : function() {
							return false;
						},
						menu : [dataUnit],
						scope : this,
						icon : '/themes/icon/all/brick_link.gif'
					}, {
						id : 'showUnit',
						text : '显示单位'.loc(),
						hidden : this.hideAlignMenu,
						handler : function() {
							return false;
						},
						menu : [showUnit],
						scope : this,
						icon : '/themes/icon/all/brick_edit.gif'
					});
		}, this);
		return grid;
	},
	onMetaChange : function(store, meta) {
		var c;
		var config = [];
		var lookup = {};
		for (var i = 0, len = meta.fields.length; i < len; i++) {
			c = meta.fields[i];
			if (c.header !== undefined) {
				if (typeof c.dataIndex == "undefined") {
					c.dataIndex = c.name;
				}
				if (typeof c.id == "undefined") {
					c.id = 'c' + i;
				}
				if (c.editor && c.editor.isFormField) {
					c.editor = new Ext.grid.GridEditor(c.editor);
				}
				c.sortable = true;

				config[config.length] = c;
				lookup[c.id] = c;
			}
		}
		this.colModel.config = config;
		this.colModel.lookup = lookup;
		if (this.rendered) {
			this.view.refresh(true);
		}
	},
	getComboItem : function(combo, itemConfig) {
		combo.on("render", function(obj) {
					if (Ext.isGecko) {
						obj.wrap.setStyle("margin-left", "30px");
					}
				});
		var comboItem = new dev.ctrl.EditableItem(Ext.applyIf(itemConfig, {
					menuIcon : "/themes/icon/all/text_align_center.gif",
					style : 'width:158px',
					editor : combo,
					canActivate : true,
					deactivate : function() {
						combo.collapse();
					},
					activate : function() {
						var li = this.container;
						this.region = li.getRegion().adjust(2, 2, -2, -2);
						return true;
					},
					shouldDeactivate : function(e) {
						return !combo.hasFocus;
					}
				}));
		combo.menu = comboItem;
		return comboItem;
	},
	getExportMenuItem : function(combo, itemConfig) {
	}
}
