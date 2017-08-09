CPM.manager.ProgramPortlet = Ext.extend(CPM.manager.CustomizeObject, {
			className : 'CPM.manager.ProgramPortlet',
			programType : 'ProgramPortlet',
			updateData : function(panel, param) {
				panel.items.each(function(item) {
							CPM.replacePanel(item.getComponent(0), item, Ext
											.applyIf({
														programType : item.programType,
														objectId : item.objectId,
														showTopToolbar : false
													}, param));
				});
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

							}
							fn();
						}.createDelegate(this));
			},
			createModel : function(parentPanel, json, param) {
				if (parentPanel.ownerCt.xtype == 'tabpanel' && json.title) {
					parentPanel.setTitle(json.title);
				}

				var panel = {
					border : false,
					layout : 'absolute',
					bodyStyle : 'overflow:auto;',
					items : json.layout
				};
				var box = parentPanel.body.getBox();
				for (var i = 0, arr = panel.items; i < arr.length; i++) {
					arr[i].width *= box.width;
					arr[i].height *= box.height;
					arr[i].x *= box.width;
					arr[i].y *= box.height;
					arr[i].header = arr[i].showTitle;
					arr[i].border = arr[i].showBorder;
					switch (+arr[i].type) {
						case 5 :// 统计图页面
							arr[i].programType = "ProgramChart";
							break;
						case 9 :// 单记录查询
							arr[i].programType = "ProgramSimpleQuery";
							break;
						case 10 :// 列表查询
							arr[i].programType = "ProgramListQuery";
							break;
						case 11 :// 外挂程序
							arr[i].programType = "ProgramEmbed";
							break;
					}
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
				
				return false;
				return (typeof(panel) != 'undefined')
						&& panel.param.objectId == param.objectId
						&& panel.param.programType == param.programType
			}
		});