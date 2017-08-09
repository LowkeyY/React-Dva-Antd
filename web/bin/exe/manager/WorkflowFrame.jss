CPM.manager.WorkflowFrame = Ext.extend(CPM.manager.CustomizeObject, {
			className : 'CPM.manager.WorkflowFrame',
			programType : 'WorkflowFrame',
			load : function(mode, parentPanel, param) {
				param.exportTab=parentPanel.exportTab;
				param.exportItem=parentPanel.exportItem;
 
				if(!param.exportData)
					param.exportData=parentPanel.exportData;

				param.pageType=parentPanel.pageType;
				if(!param.dataId)
					param.dataId=parentPanel.dataId;

				param.entryId=parentPanel.entryId;
				if(!param.objectId)
					param.objectId=parentPanel.objectId;
				param.instanceId=parentPanel.instanceId;
				param.workflowId=parentPanel.workflowId;
				param.flowType=parentPanel.flowType;
				param.stepId=parentPanel.stepId;
     
				this.getData(mode, param, function(result, model) {
							var panel;
							if (mode.indexOf("model") != -1) {
								CPM.addModel(param.objectId, model);
								panel = this.createModel(parentPanel, result,param);
								panel.param = param;
								this.updateData(panel, param);
							} else {
								if (param.moduleReady == false) {
									param.moduleReady = (function(p,obj, param) {
										obj.updateData(p, param);
									}).createCallBackWithArgs(this, param);
								} else {
									this.updateData(param.moduleReady, param);
									delete param.moduleReady;
								}
							}
						}, this);
			},
			canUpdateDataOnly : function(panel, parentPanel, param) {
				return (typeof(panel) != 'undefined')
						&& panel.objectId == param.objectId
			},
			updateData : function(panel, param) {
				var tabpanel=panel.findParentByType("tabpanel");
				tabpanel.footer.setStyle("display","none");
				tabpanel.body.setHeight(tabpanel.body.getHeight()+26);
				tabpanel.doLayout();
				panel.on("destroy",function(){
					tabpanel.body.setHeight(tabpanel.body.getHeight()-26);
					tabpanel.footer.setStyle("display","block");
					tabpanel.doLayout();
				},this);
				var target = {
					targets : param.frameTargets,
					type : 2
				};
				delete param.frameTargets;
				delete param.programType;
				delete param.sort;
				panel.items.each(function(itm){
					itm.param=param;
				});
				CPM.replaceTarget(param.frameTargets, panel.getComponent(0),
						param, target);
			},
			createModel : function(parentPanel, json, param) {
				var items = CPM.Frame.getFrame(json);
				items[1].border=false;
				items[1].isFrame=false;
				items[1].isSubFrame=true;
				items[1].param=param;
				items[0].border=false;
				items[0].isFrame=false;
				items[0].isSubFrame=true;
				items[0].split=true;
				items[0].param=param;
				var p = new Ext.Panel({
							layout : 'border',
							border : false,    
							items : items
						});
				p.frameIndex = items[0].frameIndex;
				parentPanel.add(p);
				return p;
			}
		});