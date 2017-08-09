Ext.namespace("dev.quality");

dev.quality.RuleScriptPanel = function(params, frames) {
	this.params = params;
	this.frames = frames;
	var Quality = this.frames.get('Quality');
	var ButtonArray = [];

	var styleSheet;
	// ------------------查询资源窗口构建，完成查询导入------------------------------------------
	this.tXML;
	var instance = this;
	this.tree = new Ext.tree.TreePanel({
				region : 'center',
				autoScroll : true,
				layout : 'fit'
			});
	this.root = new Ext.tree.TreeNode({
				text : 'XCleanSchema',
				id : 'XCleanSchema New XCleanSchema 1',
				icon : "/themes/icon/all/chart_organisation.gif",
				params : new XCleanSchema(),
				qtip : "XCleanSchema"
			});
	this.tree.setRootNode(this.root);
	this.obj;
	this.node;
	this.tree.on('click', function(node, e) {
				instance.node = node;
				instance.obj = node.attributes.params;
				var pval = 1;
				var ruleScriptGrid;
				instance.ruleScriptSpace.removeAll(true);
				if (instance.obj.getObjName() == "XCondition") {
					ruleScriptGrid = new dev.quality.RuleColumnPanel(
							instance.params, instance);
					var ruleColumnPanel = ruleScriptGrid.RuleList;
					instance.ruleScriptSpace.add(ruleColumnPanel);
				} else {
					ruleScriptGrid = new dev.quality.RuleGrid({
								layout : 'fit',
								params : instance.params
							});
					instance.ruleScriptSpace.add(ruleScriptGrid);
				}

				instance.ruleScriptSpace.doLayout();
				ruleScriptGrid.loadSource(pval, instance.obj, instance.tree,
						instance.params);
				instance.setButtonState(ButtonArray, instance.obj);;
			});
	this.tree.on("contextmenu", function(node, e) {
				instance.node = node;
				instance.node.select();
				instance.obj = node.attributes.params;
				var pval = 1;
				instance.ruleScriptGrid.loadSource(pval, instance.obj,
						instance.tree);
				instance.setButtonState(instance.RuleButtonArray, instance.obj);
				instance.addTreeMenu(instance.obj, node);
			});
	this.TabNav = new Ext.Panel({
				title : '资源窗口'.loc(),
				region : 'west',
				autoScroll : true,
				width : 250,
				layout : 'fit',
				minSize : 220,
				border : true,
				collapsible : false,
				split : true,
				items : this.tree
			});

	loadcss("lib.RowEditorGrid.ListInput");
	using("lib.RowEditorGrid.RowEditorGrid");
	using("lib.RowEditorGrid.ListInput");
	using("dev.quality.RuleColumnPanel");
	// this.ruleScriptGrid = new dev.quality.RuleColumnPanel(this.params);

	this.ruleScriptSpace = new Ext.Panel({
				region : 'center',
				layout : 'fit',
				autoScroll : false,
				collapsible : false,
				closable : false,
				border : false,
				items : []
			});
	this.ruleScriptMain = new Ext.Panel({
				closable : false,
				frame : false,
				layout : 'border',
				region : 'center',
				border : false,
				bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;',
				items : [this.TabNav, this.ruleScriptSpace]
			});

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'newscript',
				text : '查看脚本'.loc(),
				state : 'create',
				icon : '/themes/icon/all/application_edit.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'reset',
				text : '重置'.loc(),
				state : 'create',
				icon : '/themes/icon/xp/refresh.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				handler : this.onButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'return',
				text : '返回'.loc(),
				state : 'create',
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.params.retFn
			}));

	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'delrule',
				text : '删除规则'.loc(),
				icon : '/themes/icon/all/del.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				hidden : true,
				scope : this,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'XRule',
				icon : '/themes/icon/database/tablenode.gif',
				cls : 'x-btn-text-icon  bmenu',
				text : '添加规则'.loc(),
				hidden : true,
				scope : this,
				handler : function() {
					this.addObj("Rule");
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'XIf',
				icon : '/themes/icon/database/forward_nav.gif',
				cls : 'x-btn-text-icon  bmenu',
				text : 'if',
				hidden : true,
				scope : this,
				tooltip : '添加if'.loc(),
				handler : function() {
					this.addObj("if");
				}
			}));

	this.ruleScriptForm = new Ext.FormPanel({
				closable : false,
				layout : 'border',
				region : 'center',
				border : false,
				bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;',
				tbar : ButtonArray,
				items : this.ruleScriptMain
			});
	this.MainTabPanel = new Ext.Panel({
				border : false,
				method : 'POST',
				layout : 'fit',
				activeTab : 0,
				tabPosition : 'bottom',
				items : [this.ruleScriptForm]
			});

	this.MainTabPanel.on('destroy', function() {
				var Quality = this.frames.get('Quality');
				if (Quality.saveRule) {
					Quality.saveRule.win.hidden = false;
					Quality.saveRule.win.close();
				}
			}, this);
};

dev.quality.RuleScriptPanel.prototype = {
	setButtonState : function(arrBtn, obj) {
		var buttons = arrBtn;
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].hide();
			if (buttons[i].state == "create")
				buttons[i].show();
			var childObjs = obj.getChildItems();
			for (var j = 0; j < childObjs.length; j++) {
				if (buttons[i].btnId == childObjs[j])
					buttons[i].show();
			}
		}
	},
	deleteObj : function() {
		var instance = this;
		if (typeof(instance.node) != "undefined") {
			if (instance.node.parentNode != null) {
				var obj = instance.node.attributes.params;
				var parentObj = instance.node.parentNode.attributes.params;
				var parentObjItems = parentObj.getObjItems();
				for (var i = 0; i < parentObjItems.length; i++) {
					if (obj.getName() == parentObjItems[i].getName()
							&& obj.getObjName() == parentObjItems[i]
									.getObjName()) {
						parentObjItems.remove(parentObjItems[i]);
						instance.node.parentNode.removeChild(instance.node);
						instance.obj = parentObj;
						// instance.ruleScriptGrid.loadSource("1",instance.obj,instance.tree);
					}
				}
			} else {
				Ext.msg("warn", '不能删除根节点'.loc());
			}
		} else {
			Ext.msg("warn", '请选择一个节点'.loc());
		}
	},
	addObj : function(objname) {
		var instance = this;
		var childObj;
		if (typeof(instance.obj) != "undefined" && instance.obj != null
				&& instance.node != null
				&& typeof(instance.node) != "undefined") {
			var arrIds = this.getNodeID();
			var pID = "";
			for (var h = 0; h < arrIds.length; h++) {
				pID += arrIds[h].toString();
			}
			childObj = instance.getNewObj(objname);
			childObj.setName(objname + Math.random());
			instance.obj.addObjItems(childObj);
			instance.addNode(pID, childObj, instance.tree);
			if (objname == "Rule") {
				var objIf = instance.getNewObj("if");
				objIf.setName("if" + Math.random());
				childObj.addObjItems(objIf);
				instance.addNode(childObj.getObjName() + childObj.getName()
								+ pID, objIf, instance.tree, true);

				var objCondition = instance.getNewObj("Condition");
				objCondition.setName("Condition" + Math.random());
				objIf.addObjItems(objCondition);
				instance.addNode(objIf.getObjName() + objIf.getName()
								+ childObj.getObjName() + childObj.getName()
								+ pID, objCondition, instance.tree, true);

				var objThen = instance.getNewObj("then");
				objThen.setName("then" + Math.random());
				objIf.addObjItems(objThen);
				instance.addNode(objIf.getObjName() + objIf.getName()
								+ childObj.getObjName() + childObj.getName()
								+ pID, objThen, instance.tree, true);

				var objXReject = instance.getNewObj("XReject");
				objXReject.setName("XReject" + Math.random());
				objThen.addObjItems(objXReject);
				instance.addNode(objThen.getObjName() + objThen.getName()
								+ objIf.getObjName() + objIf.getName()
								+ childObj.getObjName() + childObj.getName()
								+ pID, objXReject, instance.tree, true);
			}
			if (objname == "if") {
				var objCondition = instance.getNewObj("Condition");
				objCondition.setName("Condition" + Math.random());
				childObj.addObjItems(objCondition);
				instance.addNode(childObj.getObjName() + childObj.getName()
								+ pID, objCondition, instance.tree, true);

				var objThen = instance.getNewObj("then");
				objThen.setName("then" + Math.random());
				childObj.addObjItems(objThen);
				instance.addNode(childObj.getObjName() + childObj.getName()
								+ pID, objThen, instance.tree, true);

				var objXReject = instance.getNewObj("XReject");
				objXReject.setName("XReject" + Math.random());
				objThen.addObjItems(objXReject);
				instance.addNode(objThen.getObjName() + objThen.getName()
								+ childObj.getObjName() + childObj.getName()
								+ pID, objXReject, instance.tree, true);
			}
		} else {
			Ext.msg("warn", '请选择一个节点!'.loc());
		}
		return childObj;
	},
	getNodeID : function(pID, node) {
		var instance = this;
		var node = node;
		var pp = [];
		if (typeof(pID) != "undefined") {
			pp = pID;
		}
		if (typeof(node) == "undefined") {
			node = instance.tree.getSelectionModel().getSelectedNode();
			pp.push(node.attributes.params.getObjName()
					+ node.attributes.params.getName());
		}
		if (node.attributes.params.getObjName() != "XCleanSchema") {
			node = node.parentNode;
			pp.push(node.attributes.params.getObjName()
					+ node.attributes.params.getName());
			instance.getNodeID(pp, node);
		}
		return pp;
	},
	setNodeID : function() {
	},
	getNewObj : function(objname) {
		switch (objname) {
			case "XCleanSchema" :
				return new XCleanSchema();
				break;
			case "Rule" :
				return new XRule();
				break;
			case "if" :
				return new XIf();
				break;
			case "then" :
				return new Xthen();
				break;
			case "Condition" :
				return new XCondition();
				break;
			case "XReject" :
				return new XReject();
				break;
			case "XForeignOut" :
				return new XForeignOut();
				break;
			case "XForeignIn" :
				return new XForeignIn();
				break;
			case "XIsNull" :
				return new XIsNull();
				break;
			case "XLargerThan" :
				return new XLargerThan();
				break;
			case "XSmallerThan" :
				return new XSmallerThan();
				break;
			case "XDataLength" :
				return new XDataLength();
				break;
			case "XEquals" :
				return new XEquals();
				break;
		}
	},
	addNode : function(parentID, obj, tree, isGroup) {
		var isGroup = isGroup;
		var obj = obj;
		var tree = tree;
		var parentID = parentID;
		var tipValue = obj.getObjTipValue();
		var node;
		if (!tree.getSelectionModel().getSelectedNode()) {
			node = tree.getNodeById(parentID);
		} else if (isGroup) {
			node = tree.getNodeById(parentID);
		} else {
			node = tree.getSelectionModel().getSelectedNode();
		}
		var id = obj.getObjName() + obj.getName() + parentID;
		var text = obj.getObjTipValue();
		var icon = obj.getObjIcon();
		var cnode = new Ext.tree.TreeNode({
					id : id,
					text : text,
					icon : icon,
					params : obj,
					qtip : tipValue
				});
		node.appendChild(cnode);
		if (!node.isExpanded()) {
			node.expand();
		}
	},
	init : function() {
		var tempXML = this.tXML;
		var sc = new XCleanSchema();
		sc.init(tempXML);
		this.obj = sc;
		this.root = new Ext.tree.TreeNode({
					text : 'Schema',
					// draggable:false,
					id : sc.getObjName() + sc.getName(),
					// id:sc.getName(),
					icon : "/themes/icon/all/chart_organisation.gif",
					params : sc,
					qtip : sc.getObjCnName()
				});
		this.tree.setRootNode(this.root);
		var arr = sc.getObjItems();
		var pID = sc.getObjName() + sc.getName();
		this.addAllChildNode(pID, arr, this.tree);
	},
	addAllChildNode : function(pid, objs, tree) {
		var pID1 = "";
		for (var i = 0; i < objs.length; i++) {
			this.addNode(pid, objs[i], this.tree);
			if (objs[i].isHaveItems(objs[i])) {
				pID1 = objs[i].getObjName() + objs[i].getName() + pid;
				this.addAllChildNode(pID1, objs[i].getObjItems(), tree);
			}
		}
	},
	newRule : function(params) {
		Ext.apply(this.params, params);
		this.tXML = null;
		this.obj = null;
		this.ruleScriptForm.form.reset();
		if (this.MainTabPanel.rendered) {
			this.frames.get("Quality").mainPanel.setStatusValue(["",
					params.parent_id]);
		}
	},
	loadData : function(params, script) {
		this.params = params;
		if (typeof(script) == "undefined") {
			this.tXML = Tool.getXML('/dev/quality/qualityXml.jcp?ra='
					+ Math.random() + '&object_id=' + params.object_id);
		} else {
			this.tXML = Tool.parseXML(script.toXML());
		}
		this.init();
	},
	onButtonClick : function(item) {
		var Quality = this.frames.get("Quality");
		var me = this;
		/*
		 * if(item.btnId=="save"){ var storeValue = [];
		 * if(this.listStore.getCount()==1){
		 * Ext.msg("error","请点击列表左侧绿色的对勾添加约束条件,约束中至少有一个条件"); return null; } var
		 * allRecords = this.listStore.getRange(0); for (i = 0; i <
		 * allRecords.length-1; i++){ if(allRecords[i].data.rule_id ==
		 * ""||typeof(allRecords[i].data.rule_id)=="undefined")
		 * allRecords[i].data.rule_id = i; storeValue[i] = allRecords[i].data; }
		 * 
		 * var returnJson = { fields : Ext.encode(storeValue) };
		 * if(returnJson==null) return false; if (returnJson.fields == "[]") {
		 * Ext.msg("error",'数据提交失败,原因:<br>至少选择一列!'); return false; }
		 * returnJson['object_id']=this.params['object_id'];
		 * returnJson['type']="save";
		 * 
		 * Ext.Ajax.request({ url : '/dev/quality/listrule.jcp', params :
		 * returnJson, success:function(response, options){ var
		 * ajaxResult=Ext.util.JSON.decode(response.responseText);
		 * if(ajaxResult.success){
		 * 
		 * Ext.msg("info", '数据保存成功!'); }else{ Ext.msg("error",'数据提交失败,原因:<br>'+ajaxResult.message); } },
		 * callback : function(options, success, response){ me.listStore.load(); }
		 * }); }else
		 */
		if (item.btnId == 'newscript') {
			var node = me.root;
			var objSchema = node.attributes.params;
			using("dev.quality.QualityXml");
			Quality.qualityXml = new dev.quality.QualityXml(me.params,
					me.frames, objSchema);
			Quality.mainPanel.add(Quality.qualityXml.MainTabPanel);
			Quality.mainPanel.setActiveTab(Quality.qualityXml.MainTabPanel);
			Quality.qualityXml.loadData(me.params, Quality.mainPanel);
		} else if (item.btnId == "reset") {
			/*
			 * Ext.msg('confirm', '警告：重置将导致数据不可恢复，确认吗?', function (answer){ if
			 * (answer == 'yes') { var resetParams = this.params;
			 * resetParams["type"]="reset";
			 * resetParams["object_id"]=this.params["object_id"];
			 * Ext.Ajax.request({ url :
			 * '/dev/quality/listrule.jcp?'+Math.random(), params:resetParams,
			 * scope:this, success:function(response, options){ var
			 * ajaxResult=Ext.util.JSON.decode(response.responseText);
			 * if(ajaxResult.success){
			 * Quality.navPanel.getTree().loadSelfNode(ajaxResult.id);
			 * Ext.msg("info", '重置成功!'); }else{ Ext.msg("error",'重置失败,原因:<br>'+ajaxResult.message); } },
			 * callback : function(options, success, response){
			 * me.listStore.load(); } }); } }.createDelegate(this));
			 */
		} else if (item.btnId == "delrule") {

			Ext.msg('confirm', '警告：即将删除该规则，确认吗?'.loc(), function(answer) {
						if (answer == 'yes') {
							this.deleteObj();
						}
					}.createDelegate(this));
		}
	}
};
