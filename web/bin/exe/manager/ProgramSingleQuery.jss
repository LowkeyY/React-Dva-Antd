CPM.manager.ProgramSingleQuery = Ext.extend(CPM.manager.CustomizeObject, {
			className : 'CPM.manager.ProgramSingleQuery',
			programType : 'ProgramSingleQuery',
			updateData : function(panel, param) {
				this.getData("data", param, function(result) {
							panel.setSource(result.source);
							panel.param = param;
						}, this);
			},
			load : function(mode, parentPanel, param) {
				this.getData(mode, param, function(result, model) {
							var panel;
							if (mode.indexOf("model") != -1) {
								CPM.addModel(param.objectId, model);
								panel = this.createModel(parentPanel, result,
										param);
								panel.param = param;
							} else {
								if (param.moduleReady == false) {
									param.moduleReady = (function(p, data) {
										p.setSource(data);
									}).createCallBackWithArgs(result.source);
								} else {
									param.moduleReady.setSource(result.source);
									delete param.moduleReady;
								}
							}
						}, this);
			},
			createModel : function(parentPanel, json, param) {
				if (parentPanel.ownerCt.xtype == 'tabpanel' && json.title) {
					parentPanel.setTitle(json.title);
				}
				var id = Ext.id();
				var panel = {
					id : id,
					xtype : 'propertygrid',
					startEditing : Ext.emptyFn,
					source : json.source,
					border : false,
					autoHeight : true
				}
				if (Ext.isArray(json.buttonArray)) {
					var btns = new Array(), cb = null;
					Ext.each(json.buttonArray, function(btn) {
								cb = this.getButton(btn, id);
								btns.push((cb == null) ? btn : cb);
							}, this);
					(btns.length > 0) && (panel.tbar = btns);
				}

				panel = parentPanel.add(panel);
				parentPanel.doLayout();
				return panel;
			},
			canUpdateDataOnly : function(panel, parentPanel, param) {
				return (Ext.isDefined(panel))
						&& panel.param.objectId == param.objectId
						&& panel.param.programType == param.programType
			},
			buttonMap : {
				'%excel' : {
					handler : function(btn) {
						var m = Ext.getCmp(btn.panelId);
						var cm = m.getColumnModel();
						var st = m.getStore();

						var arrayWidth = new Array(cm.getColumnCount());
						var arrayHead = new Array(cm.getColumnCount());

						for (var i = 0; i < cm.getColumnCount(); i++) {
							if (!cm.isHidden(i)) {
								arrayWidth[i] = cm.getColumnWidth(i);
								arrayHead[i] = cm.getColumnHeader(i);
							}
						}
						var param = m.param;
						param['widths'] = arrayWidth.join(",");
						param['heads'] = arrayHead.join(",");
						CPM.popWin('/bin/exe/downExcel.jcp?', param);
					}
				}
			}
		});