Ext.namespace("dev.program");
dev.program.ProgramGrid = Ext.extend(Ext.grid.PropertyGrid, {
	rid : 1,
	startEditing : function(row, col) {
		var r = this.store.getAt(row);
		if (this.state == 'edit' && this.canEdit.indexOf(r.data.name) == -1)
			return;
		dev.program.ProgramGrid.superclass.startEditing.call(this, row, col);
	},
	loadSource : function(type, val) {
		this.propStore.isEditableValue = function() {
			return true;
		}
		this.programType = type;
		var source = {}, t = this.sourceType[type];
		if (typeof(val) == 'undefined')
			val = {};
		var m = this.editorMap;
		if (val.drawout_type == 'y')
			t = Ext.apply({
						'选择查询' : 0
					}, t);

		for (var i in t) {
			this.customEditors[i] = this.createEditor(i);
			this.customRenderers[i] = this.customRenderer;
			source[i] = val[this.indexTable[i]] || t[i]
			if (m[i] instanceof Array) {
				for (var arr = m[i], j = 0; j < arr.length; j++) {
					if (arr[j][0] == source[i]) {
						source[i] = {
							text : arr[j][1],
							value : arr[j][0]
						};
						break;
					}
				}
			}
		}
		this.setSource(source);
		if (val.extra_tables) {// 主题录入多表处理
			var arr = val.extra_tables;
			for (var i = 1; i < arr.length; i++) {
				this.store.add(new Ext.grid.PropertyRecord({
							name : '关联表',
							value : arr[i]
						}));
			}
		}
	},
	customRenderer : function(v, m, r) {
		return (v && v.text) ? v.text : v;
	},
	getComboBox : function(config, isRemote) {
		var clazz = isRemote ? lib.ComboRemote.ComboRemote : Ext.form.ComboBox;
		return new Ext.grid.GridEditor(new clazz(Ext.apply({
					triggerAction : 'all',
					clearTrigger : false,
					valueField : 'value',
					displayField : 'text',
					mode : 'local',
					ctype : 'combo'
				}, config)));
	},
	postEditValue : function(value, originalValue, r) {
		var name = r.get("name").loc();
		var c = this.customEditors[name].field;
		var value = c.getValue();
		if (c.ctype == 'combo') {
			value = {
				text : c.getText(),
				value : value
			}
		};
		this.setProperty(name, value)
		return value;
	},
	createEditor : function(n) {
		var oid = this.params.objectId;
		var ptype = this.programType;
		var editor = null;
		if (Ext.isObject(this.editorMap[n])) {
			return new Ext.grid.GridEditor(this.editorMap[n]);
		} else if (Ext.isArray(this.editorMap[n])) {
			editor = this.getComboBox({
						store : new Ext.data.SimpleStore({
									fields : ['value', 'text'],
									data : this.editorMap[n]
								})
					}, false);
			if (n == '查询数据导入') {
				editor.field.on("select", function(combo, rec, index) {
							var newValue = rec.get("value");
							var st = this.propStore.store;
							var rowIndex = st.find("name", '选择查询'.loc());
							if (newValue == 'y') {
								if (rowIndex == -1) {
									st.add(new Ext.grid.PropertyRecord({
												name : '选择查询'.loc(),
												value : ""
											}));
									var i = '选择查询'.loc();
									this.customEditors[i] = this
											.createEditor(i);
									this.customRenderers[i] = this.customRenderer;

								}
							} else {
								if (rowIndex != -1)
									st.remove(st.getAt(rowIndex));
							}
						}, this);
			}
		} else if (Ext.isString(this.editorMap[n])) {
			var cst = new Ext.data.JsonStore({
						url : this.editorMap[n],
						autoLoad : false,
						root : 'items',
						fields : ["text", "value"],
						baseParams : {
							r : Math.random(),
							objectId : -1
						}
					});
			if (n == '选择从表') {
				cst.on("beforeload", function(st, option) {
							var st = this.store;
							var rowIdx = -1;
							rowIdx = st.find("name", '关联表'.loc());
							if (rowIdx == -1)
								return false;
							var val = st.getAt(rowIdx).get("value").value;
							cst.baseParams.object_id = val;
						}, this)
			}
			editor = this.getComboBox({
						store : cst,
						mode : 'remote'
					}, true);
			if (n != '选择从表') {
				editor.field.on("beforequery", function(qe) {
							var v = this.params.parent_id;
							if (v != qe.combo.lastQuery) {
								qe.query = v;
								qe.combo.store.baseParams.objectId = v;
							}
						}, this)
			}

		} else if (n == '单页行数') {
			editor = this.getColumnModel().editors['number'];
		} else if (n == '关联表') {
			var dictCombo = new lib.ComboTree.ComboTree({
						width : 200,
						queryParam : "type",
						mode : 'remot',
						ctype : 'combo',
						listWidth : 250,
						height : 100,
						textMode : false,
						root : new Ext.tree.AsyncTreeNode({
									text : '所有库'.loc(),
									draggable : false,
									allowSelect : false,
									id : oid,
									icon : "/themes/icon/all/plugin.gif"
								}),
						loader : new Ext.tree.TreeLoader({
									dataUrl : '/dev/program/PropertyGridConfig.jcp',
									requestMethod : "POST"
								})
					});
			dictCombo.on("select", function(comb, node, e) {
						if (ptype == '21' && comb.getValue() != '-999999') {// 主题录入多表判断
							this.store.add(new Ext.grid.PropertyRecord({
										id : this.rid++,
										name : '关联表'.loc(),
										value : {
											text : '无'.loc(),
											value : "-999999"
										}
									}));
						}
					}, this);
			dictCombo.on("change", function(comb, node, e) {
						var st = this.store, ct;
						var rowIdx = -1;
						if ((rowIdx = st.find("name", '选择从表'.loc())) != -1) {
							ct = this.getCellEditor(1, rowIdx).field.store;
							if (ct)
								ct.load({
											params : {
												object_id : node
											}
										});
						}
					}, this);
			editor = new Ext.grid.GridEditor(dictCombo);

		} else if (n == '引用程序') {
			var dictCombo = new lib.ComboTree.ComboTree({
						width : 200,
						queryParam : "type",
						mode : 'remot',
						ctype : 'combo',
						listWidth : 250,
						height : 100,
						root : new Ext.tree.AsyncTreeNode({
									text : '选择程序'.loc(),
									draggable : false,
									allowSelect : false,
									id : oid,
									icon : "/themes/icon/all/plugin.gif"
								}),
						loader : new Ext.tree.TreeLoader({
									dataUrl : '/dev/program/selectProgram.jcp',
									requestMethod : "post"
								})
					});
			editor = new Ext.grid.GridEditor(dictCombo);
		} else if (n == '程序目录') {
			var dictCombo1 = new lib.ComboTree.ComboTree({
						width : 200,
						queryParam : "type",
						mode : 'remot',
						ctype : 'combo',
						listWidth : 250,
						height : 100,
						root : new Ext.tree.AsyncTreeNode({
									text : '选择程序目录'.loc(),
									draggable : false,
									allowSelect : false,
									id : oid,
									icon : "/themes/icon/all/plugin.gif"
								}),
						loader : new Ext.tree.TreeLoader({
									dataUrl : '/dev/program/selectFolder.jcp',
									requestMethod : "post"
								})
					});
			editor = new Ext.grid.GridEditor(dictCombo1);
		} else if (n == '日志记录事件') {
			using("dev.program.LogEvent");
			var logevent = new dev.program.LogEvent({
						// readOnly : true,
						editable : false
					});
			logevent.geditor = editor = new Ext.grid.GridEditor(logevent);
		} else {
			editor = this.getColumnModel().editors['string'];
		}
		return editor;
	},
	editorMap : {
		'查询数据导入' : [['n', '无'.loc()], ['y', '有'.loc()]],
		'默认显示' : [['0', '不显示数据'.loc()], ['1', '显示所有数据'.loc()]],
		'开始类型' : [['view', 'view'], ['new', 'new'], ['edit', 'edit'],
				['list', 'list']],
		'外挂程序类型' : [['1', 'IFRAME'], ['2', 'JS面板'.loc()], ['3', 'Flex面板'.loc()]],
		'有我的查询' : [['n', '否'.loc()], ['y', '是'.loc()]],
		'有收藏夹' : [['n', '否'.loc()], ['y', '是'.loc()]],
		'是否显示绘图菜单' : [['n', '否'.loc()], ['y', '是'.loc()]],
		'数据有效检验' : [['n', '否'.loc()], ['y', '是'.loc()]],
		'无数据则转入新建状态' : [['false', '否'.loc()], ['true', '是'.loc()]],
		'数据权限' : [['1', '显示所有数据'.loc()], ['2', '显示本部门数据'.loc()],
				['3', '显示本人数据'.loc()], ['4', '显示下属部门数据'.loc()],
				['5', '显示上级下属数据'.loc()], ['7', '显示本机构数据'.loc()]],
		'选择查询' : '/dev/program/ProgramGrid.jcp?type=query',
		'选择从表' : "/dev/program/getDynamicConfig.jcp?type=subTable",
		'框架类别' : [['1', '主窗口'.loc()], ['2', '左右框架'.loc()], ['3', '上下框架'.loc()]],
		'逻辑类别' : [['1', '存储过程'.loc()], ['2', "Beanshell"], ['3', '抽取迁移'.loc()],
				['4', '数据服务'.loc()], ['5', '条件抽取迁移'.loc()],
				["6", '消息通知'.loc()], ["7", '搜索引擎'.loc()]],
		'查询2' : '/dev/program/ProgramGrid.jcp?type=query',
		'报表' : "/dev/program/ProgramGrid.jcp?type=report",
		'地图' : "/dev/program/ProgramGrid.jcp?type=map",
		'选择门户' : "/dev/program/ProgramGrid.jcp?type=portlet",
		'选择应用集成' : "/dev/program/ProgramGrid.jcp?type=integrate",
		'图表' : "/dev/program/ProgramGrid.jcp?type=chart",
		'报告' : "/dev/program/ProgramGrid.jcp?type=textreport",
		'搜索类别' : "/dev/program/ProgramGrid.jcp?type=searchType",
		'质量检查类别' : "/dev/program/ProgramGrid.jcp?type=qualityType"
	},
	sourceType : [{}, { // ['1',"单记录页面"]
		'查询数据导入' : 'n',
		'关联表' : "",// ComboTree
		'开始类型' : "view",
		'程序目录' : "",
		'无数据则转入新建状态' : "false",
		'日志记录事件' : "",
		'标题宽度' : "140"
	}, {	// ['2',"列表页面"]
				'关联表' : "",
				'数据有效检验' : 'n',
				'数据权限' : 1,
				'是否显示绘图菜单' : "n",
				'默认显示' : '0',
				'单页行数' : 50,
				'程序目录' : "",
				'日志记录事件' : ""
			}, {// ['3',"列表录入"]
				'查询数据导入' : 'n',
				'关联表' : "", // ComboTree
				'数据有效检验' : 'n',
				'数据权限' : 1,
				'默认显示' : '1',
				'单页行数' : 50,
				'程序目录' : "",
				'日志记录事件' : ""
			}, {// ['4',"导航页面"]
				'数据有效检验' : 'y'
			}, {// ['5',"统计图页面"]
				'图表' : "",
				'程序目录' : ""
			}, {// ['6',"级联页面"]
				'查询数据导入' : 'n',
				'关联表' : "", // ComboTree
				'选择从表' : "",
				'开始类型' : "view",
				'程序目录' : "",
				'标题宽度' : "140",
				'日志记录事件' : ""
			}, {// ['7',"框架页面"]
				'框架类别' : "1",
				'程序目录' : "",
				'程序目录' : ""
			}, {// ['8',"业务逻辑"]
				'逻辑类别' : 1
			}, {// ['9',"单记录查询"]
				'选择查询' : "",
				'程序目录' : ""
			}, {// ['10',"列表查询"]
				'选择查询' : "",
				'程序目录' : "",
				'是否显示绘图菜单' : "y",
				'单页行数' : 50,
				'日志记录事件' : ""
			}, {// ['11',"外挂程序"]
				'连接' : "",
				'外挂程序类型' : "",
				'程序目录' : ""
			}, {// ['12',"选择录入管理"]
				'选择查询' : "",
				'关联表' : "",
				'程序目录' : ""
			}, {// ['13',"交叉录入管理"]
				'查询2' : "",
				'选择查询' : "",
				'关联表' : "",
				'程序目录' : "",
				'日志记录事件' : ""
			}, {// ['14','报表']
				'报表' : "",
				'程序目录' : ""
			}, {// ['15','地图']
				'地图' : "",
				'程序目录' : ""
			}, {// ['16',"门户页面"]
				'选择门户' : "",
				'程序目录' : ""
			}, {// ['17',"应用集成"]
				'选择应用集成' : "",
				'程序目录' : ""
			}, {// ['18','报告']
				'报告' : "",
				'程序目录' : ""
			}, {// ['19',"搜索引擎"]
				'搜索类别' : "",
				'程序目录' : ""
			}, {// ['20',"链接引用"]
				'引用程序' : "",
				'程序目录' : ""
			}, {// ['21',"主题录入"]
				'查询数据导入' : 'n',
				'开始类型' : "view",
				'关联表' : "",
				'程序目录' : "",
				'标题宽度' : "140",
				'日志记录事件' : ""
			}, {// ['22','程序目录']
				// '有我的查询':"n",
				'有收藏夹' : "n"
			}, {// ['23',"查询设计"]
			}, {// ['24',"批量更新"]
				'关联表' : "",
				'日志记录事件' : ""
			}, {// ['25',"文件下载"]
				'关联表' : "",
				'日志记录事件' : ""
			}, {// ['26',"文件下载"]
				'关联表' : "",
				'日志记录事件' : ""
			}, {// ['27',"数据整改"]
				'质量检查类别' : ""
			}],
	indexTable : {
		'查询数据导入' : "drawout_type",
		'关联表' : "tab_id",
		'是否显示绘图菜单' : "enable_chart_menu",
		'开始类型' : "start_type",
		'默认显示' : 'default_show',
		'数据有效检验' : "valid_check",
		'数据权限' : "data_auth",
		'单页行数' : "column_num",
		'选择查询' : "query_id",
		'选择从表' : "tab1_id",
		'框架类别' : "frame_type",
		'逻辑类别' : "task_type",
		'连接' : "out_url",
		'查询2' : "query_id2",
		'报表' : "report_id",
		'地图' : "map_id",
		'选择门户' : "portlet_id",
		'选择应用集成' : "integrate_id",
		'图表' : "chart_id",
		'报告' : "textreport_id",
		'外挂程序类型' : 'is_iframe',
		'搜索类别' : "search_type",
		'引用程序' : "link_id",
		'有我的查询' : "my_query",
		'有收藏夹' : "have_favorite",
		'程序目录' : "prg_folder",
		'无数据则转入新建状态' : "TO_CREATE_WITHOUT_DATA",
		'日志记录事件' : "log_name",
		'质量检查类别' : "quality_type",
		'标题宽度' : "label_width"
	},
	tansTable : {
		'查询数据导入' : "查询数据导入".loc(),
		'关联表' : "关联表".loc(),
		'是否显示绘图菜单' : "是否显示绘图菜单".loc(),
		'开始类型' : "开始类型".loc(),
		'默认显示' : '默认显示'.loc(),
		'数据有效检验' : "数据有效检验".loc(),
		'数据权限' : "数据权限".loc(),
		'单页行数' : "单页行数".loc(),
		'单页行数' : "单页行数".loc(),
		'选择从表' : "选择从表".loc(),
		'框架类别' : "框架类别".loc(),
		'逻辑类别' : "逻辑类别".loc(),
		'连接' : "连接".loc(),
		'查询2' : "查询2".loc(),
		'报表' : "报表".loc(),
		'地图' : "地图".loc(),
		'选择门户' : "选择门户".loc(),
		'选择应用集成' : "选择应用集成".loc(),
		'图表' : "图表".loc(),
		'报告' : "报告".loc(),
		'外挂程序类型' : '外挂程序类型'.loc(),
		'搜索类别' : "搜索类别".loc(),
		'引用程序' : "引用程序".loc(),
		'有我的查询' : "有我的查询".loc(),
		'有收藏夹' : "有收藏夹".loc(),
		'程序目录' : "程序目录".loc(),
		'无数据则转入新建状态' : "无数据则转入新建状态".loc(),
		'日志记录事件' : "日志记录事件".loc(),
		'质量检查类别' : "质量检查类别".loc(),
		'标题宽度' : "标题宽度".loc()
	},
	canEdit : "是否显示绘图菜单,标题宽度,日志记录事件,开始类型,数据有效检验,数据权限,单页行数,连接,外挂程序类型,选择查询,查询数据导入,程序目录,默认显示,图表,报告,引用程序,无数据则转入新建状态"
});
