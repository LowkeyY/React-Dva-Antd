using("bin.exe.manager.Input");
CPM.manager.ProgramInput = Ext.extend(CPM.manager.Input, {
			programType : 'ProgramInput',
			className : 'CPM.manager.ProgramInput',
			buttonMap : {
				'%auth' : {
					handler : function(btn) {				
						var conn=new Ext.data.Connection();
						conn.request({    
								method: 'GET',    
								url:'/bin/user/getOrg.jcp?'
						});				
						conn.on('requestcomplete', function(conn, oResponse ){	
							var orgJSON = Ext.decode(oResponse.responseText);
							var name=orgJSON.shortName;
							if(name==""){
								name=orgJSON.name;
							}
							using("bin.exe.AuthPanel");
							var panel = Ext.getCmp(btn.panelId);
							var parentPanel = panel.ownerCt;
							var oldParam = panel.param;
							var param = Ext.applyIf({
										retFn : function() {
											CPM.replacePanel(authPanel,
													parentPanel, oldParam);
										},
										programType : 'authPanel'
							}, oldParam);
							param.rootId=orgJSON.id;
							param.rootName=name;
							var authPanel = new bin.exe.AuthPanel({
										param : param
									});
							parentPanel.remove(panel, true);
							parentPanel.add(authPanel);
							parentPanel.doLayout();
						},this);
					}
				},
				'%set' : {
					handler : function(btn) {
						using("bin.exe.PdSetupPanel");
						var panel = Ext.getCmp(btn.panelId);
						var parentPanel = panel.ownerCt;
						var param = panel.param;
						var pdpanel = new bin.exe.PdSetupPanel(panel,
								parentPanel, param)
						pdpanel.init();
					}
				},
				'%saveclose' : {
					handler : function(btn) {
						var panel = Ext.getCmp(btn.panelId);
						panel.param['action'] = btn.action;
						if (panel.form.isValid()) {
							var p = Ext.apply({
										_method : (btn.state == 'new')
												? 'POST'
												: 'PUT'
									}, panel.param)
							CPM.doAction({
										form : panel.form,
										params : p,
										method : 'POST',
										success : function(form, action) {
											Ext.msg("info", '保存成功'.loc());
											var win = panel.findParentByType(Ext.Window);
											if (win){
												var pl=win.plist;
												if(pl){
													var mod=CPM.getModule(pl.param.programType);
													if(mod && mod.updateData){
														mod.updateData(pl,pl.param);
													}
												}
												win.normalClose=true;
												win.close();
											}
										}
									}, this);
						}
					}
				}
			}
		});