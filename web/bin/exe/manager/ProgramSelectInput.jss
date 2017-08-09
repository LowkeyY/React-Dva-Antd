loadcss("lib.multiselect.Multiselect");
using("lib.multiselect.Multiselect");
using("bin.exe.PureArrayReader");
CPM.manager.ProgramSelectInput = Ext.extend(CPM.manager.CustomizeObject, {
	className : 'CPM.manager.ProgramSelectInput',
	programType : 'ProgramSelectInput',
	updateData : function(panel, param) {
		this.getData("data", param, function(result) {
					panel.param = param;
					this.setValues(panel, result);
				}, this);
	},

	load : function(mode, parentPanel, param) {
		this.getData(mode, param, function(result, model) {
					var panel;
					if (mode.indexOf("model") != -1) {
						CPM.addModel(param.objectId, model);
						panel = this.createModel(parentPanel, result, param);
						this.setValues(panel, result);
						panel.param = param;
					} else {
						if (param.moduleReady == false) {
							param.moduleReady = (function(p, obj, data) {
								obj.setValues(p, data);
							}).createCallBackWithArgs(this, result);
						} else {
							this.setValues(param.moduleReady, result);
							delete param.moduleReady;
						}
					}
				}, this);
	},

	setValues : function(panel, result) {
		var is = panel.getComponent(0);
		if (result.options)
			is.fromStore.loadData(result.options);
		if (result.selected)
			is.toStore.loadData(result.selected);
	},

	createModel : function(parentPanel, json, param) {
		if (parentPanel.ownerCt.xtype == 'tabpanel' && json.title) {
			parentPanel.setTitle(json.title);
		}
		var id = Ext.id();
		var panel = {
			id : id,
			border : false,
			layout : 'fit',
			items : {
				xtype : 'itemselector',
				dataFields : ["text", "value", 'selected'],
				hideLabel : true,
				width : 600,
				height : 500,
				msWidth : 300,
				fromData : [],
				toData : [],
				msHeight : 400,
				bodyStyle : "padding:30px 0 0 100px;overflow-y:auto;",
				valueField : "value",
				displayField : "text",
				imagePath : "/lib/multiselect",
				toLegend : '已选值'.loc(),
				fromStore : new Ext.data.SimpleStore({
							reader : new bin.exe.PureArrayReader({},
									Ext.data.Record.create(['value', 'text',
											'selected'])),
							fields : ['text', 'value', 'selected']
						}),
				fromLegend : '可选值'.loc()
			}
		};
		var ja = json.buttonArray;
		if (typeof(ja) != 'undefined' && ja != null && ja.length > 0) {
			var btns = new Array(), cb = null;
			for (var i = 0; i < ja.length; i++) {
				if (ja[i].acttion != '%favorite'
						&& ja[i].acttion != '%cancelfavorite') {
					cb = this.getButton(ja[i], id);
					btns.push((cb == null) ? ja[i] : cb);
				}
				if ((ja[i].acttion == '%favorite' && param.isfavorite == 'true')
						|| ja[i].acttion == '%cancelfavorite'
						&& param.isfavorite == 'false') {
					cb = this.getButton(ja[i], id);
					btns.push((cb == null) ? ja[i] : cb);
				}
			}
			panel.tbar = btns;
		}
		panel = parentPanel.add(panel);
		parentPanel.doLayout();
		return panel;
	},

	canUpdateDataOnly : function() {
		return (typeof(panel) != 'undefined')
				&& panel.param.objectId == param.objectId
				&& panel.param.programType == param.programType
	},
	buttonMap : {
		'%save' : {
			handler : function(btn) {
				var panel = Ext.getCmp(btn.panelId);
				var it = panel.getComponent(0);
				it.fromStore.each(function(rec) {
							rec.data.selected = false;
						});
				it.toStore.each(function(rec) {
							rec.data.selected = true;
						});
				var storeValue = new Array();
				var recf = it.fromStore.getRange(0);
				for (i = 0; i < recf.length; i++) {
					storeValue.push(recf[i].data);
				}
				recf = it.toStore.getRange(0);
				for (i = 0; i < recf.length; i++) {
					storeValue.push(recf[i].data);
				}
				var p = panel.param;
				CPM.doAction({
							params : {
								save : Ext.encode(storeValue),
								programType : p.programType,
								data : p.dataId,
								objectId : p.objectId
							},
							method : 'POST',
							success : function(form, action) {
								Ext.msg("info", '保存成功'.loc());
								if (btn.target.targets) {
									CPM.replaceTarget(panel, panel.ownerCt,
											panel.param, btn.target);
								}
							},
							failure : function(form, action) {
								Ext.msg("error", '数据提交失败!,原因:'.loc() + '<br>'
												+ action.result.message);
							}
						}, this);
			}
		}
	}
});