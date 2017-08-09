using("bin.exe.manager.Input");
using("lib.RowEditorGrid.RowEditorGrid");
loadcss("lib.RowEditorGrid.ListInput");
using("lib.RowEditorGrid.ListInput");

CPM.manager.ProgramLinkInput = Ext.extend(CPM.manager.Input, {
	className : 'CPM.manager.ProgramLinkInput',
	programType : 'ProgramLinkInput',
	/*
	 * 只更新panel中数据,只取数据部分,并完成赋值 @param objectId,dataId,importData
	 */
	updateData : function(panel, param) {
		this.getData("data", param, function(result) {
					panel.form.setValues(result.data);
					panel.mgrid.getStore().loadData(result.subData, false);
					panel.param = param;
				}.createDelegate(this));
	},
	load : function(mode, parentPanel, param) {
		this.getData(mode, param, function(result, model) {
					var panel;
					if (mode.indexOf("model") != -1) {
						CPM.addModel(param.objectId, model);
						panel = this.createModel(parentPanel, result, param);
						panel.form.setValues(result.data);
						panel.mgrid.getStore().loadData(result.subData, false);
						panel.param = param;
					} else {
						if (param.moduleReady == false) {
							param.moduleReady = (function(p, result) {
								p.form.setValues(result.data);
								p.mgrid.getStore().loadData(result.subData,
										false);
							}).createCallBackWithArgs(result);
						} else {
							var p = param.moduleReady;
							p.form.setValues(result.data);
							if (result.subData)
								p.mgrid.getStore().loadData(result.subData,
										false);
							delete param.moduleReady;
						}
					}
				}.createDelegate(this));
	},
	/*
	 * 根据model建panel,layout后返回建成的panel @param objectId,title @return panel
	 */
	createModel : function(parentPanel, json, param) {
		if (json.imports || json.subImports) {
			eval(json.imports + ";" + json.subImports);
		}
		var id = this.programType + param.objectId;
		if (param.pageType == 'view' || param.pageType == 'edit') {
			var condition = (param.pageType == 'view') ? "xtype" : "pkmark";
			var fn = function(c) {
				if (c.items) {
					Ext.each(c.items, fn);
				} else if (c[condition]) {
					if (c.xtype != 'hidden') {
						c.oldXtype = c.xtype;
						c.xtype = 'viewfield';
					}
				}
			}
			Ext.each(json.model, fn);
		}
		var cm = json.cm;
		for (var i = 0; i < cm.length; i++) {
			if (cm[i].editor)
				cm[i].editor = Ext.ComponentMgr.create(cm[i].editor, {
							xtype : 'textfield'
						});
		}
		if (param.pageType == 'view')
			cm.unshift(new Ext.grid.RowNumberer());
		var store = new Ext.data.JsonStore({
					url : this.url,
					method : 'GET',
					root : 'data',
					autoLoad : false,
					fields : json.fields
				});

		var panel = {
			layout : 'border',
			title : param.title,
			border : false,
			id : id,
			items : [{
						border : false,
						xtype : 'form',
						region : 'north',
						id : id + "_form",
						height : 300,
						head : false,
						items : json.model,
						bodyStyle : "padding:20px 0 0 40px;overflow-y:auto;"
					}, {
						xtype : (param.pageType == 'view')
								? 'grid'
								: 'listinput',
						clicksToEdit : 1,
						defaultValue : json.subDefault.data,
						columns : cm,
						border : true,
						enableHdMenu : false,
						stripeRows : true,
						store : store,
						showDirtyMark : false,
						id : id + "_grid",
						region : 'center',
						head : false,
						objectId : param.objectId,
						iconCls : 'icon-grid',
						programType : param.programType,
						fields : json.fields
					}],
			objectId : param.objectId,
			programType : param.programType
		}
		if (Ext.isArray(json.formEvent)) {
			var e = json.formEvent;
			panel.listeners = {};
			for (var i = 0; i < e.length; i++) {
				if (e[i][0] == '') {
					if (e[i][1] == 'beforeinit') {
						if (e[i][2].call(this, panel, json, param, parentPanel) === false) {
							return;
						}
						continue;
					}
					panel.listeners[e[i][1]] = e[i][2];
				}
			}
		}
		var ja = json.buttonArray;
		if (typeof(ja) != 'undefined' && ja != null && ja.length > 0) {
			var btns = new Array(), cb = null;
			for (var i = 0; i < ja.length; i++)
				if (ja[i].state == param.pageType) {
					cb = this.getButton(ja[i], id);
					btns.push((cb == null) ? ja[i] : cb);
				}
			panel.tbar = btns;
		}
		panel = parentPanel.add(panel);
		parentPanel.doLayout();
		panel.mform = Ext.getCmp(panel.items.get(0).id);
		panel.form = panel.mform.form;
		panel.mgrid = Ext.getCmp(panel.items.get(1).id);

		cm = panel.mgrid.getColumnModel();
		var conf = cm.config;
		for (var i = 1; i < conf.length; i++) {
			if (conf[i].renderer == Ext.util.Format.extractText) {
				var editor = cm.getCellEditor(i);
				editor.getValue = function() {

					if (this.field.xtype == 'hidden') {
						return this.startValue;
					}
					var el = this.field.el;
					var btext = (this.field.getText)
							? this.field.getText()
							: el.getValue();
					var bval = this.field.getValue();
					if (typeof(btext) == 'undefined') {
						el = el.child("input[type!=hidden]", true);
						if (typeof(el) == 'undefined') {
							btext = bval;
						} else {
							btext = el.value;
						}
					}
					var ec = {
						text : btext,
						value : bval,
						toString : function() {
							return this.text + this.value
						}
					}
					// this.record.data[this.field.name] =
					// this.startValue = "";
					return ec;
				}
			}
		}
		return panel;
	},
	buttonMap : {
		'%save' : function(btn, panelId) {
			this.getSuper().getButton(btn, panelId);
			btn.handler = btn.handler.createSequence(function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						delete panel.param.resultArray;
					});
			btn.handler = btn.handler.createInterceptor(function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						panel.mgrid.stopEditing(true);
						var rec = panel.mgrid.getStore().getRange();
						var ppm = new Array();
						var len = rec.length - 1, i = 0, d;
						for (; i < len; i++) {
							d = rec[i].data;
							ppm[i] = {};
							for (var nm in d) {
								if (typeof(d[nm]) == 'object') {
									if (d[nm] instanceof Date) {
										ppm[i][nm] = d[nm].format('Y/m/d');
									} else {
										ppm[i][nm] = Ext
												.isFunction(d[nm].getValue)
												? d[nm].getValue()
												: d[nm].value;
									}
								} else {
									ppm[i][nm] = d[nm];
								}
							}
						}
						panel.param.resultArray = Ext.encode(ppm);
					}, this);
			return btn;
		},
		'%audit' : function(btn, panelId) {
			this.getSuper().getButton(btn, panelId);
			btn.handler = btn.handler.createSequence(function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						delete panel.param.resultArray;
					});
			btn.handler = btn.handler.createInterceptor(function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						panel.mgrid.stopEditing(true);
						var m = CPM.getModule(panel.param.programType);
						var rec = panel.mgrid.getStore().getRange();
						var ppm = new Array();
						var len = rec.length - 1, i = 0, d;
						for (; i < len; i++) {
							d = rec[i].data;
							ppm[i] = {};
							for (var nm in d) {
								if (typeof(d[nm]) == 'object') {
									if (d[nm] instanceof Date) {
										ppm[i][nm] = d[nm].format('Y/m/d');
									} else {
										ppm[i][nm] = d[nm].value;
									}
								} else {
									ppm[i][nm] = d[nm];
								}
							}
						}
						panel.param.resultArray = Ext.encode(ppm);
						return true;
					}, this);
			return btn;
		}
	}
});