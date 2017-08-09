CPM.manager.ProgramSearch = Ext.extend(CPM.manager.CustomizeObject, {
		className : 'CPM.manager.ProgramSearch',
		programType : 'ProgramSearch',
		updateData : function(panel, param) {
			panel.loadData(param);
		},
		load : function(mode, parentPanel, param) {
			using("bin.exe.SearchPanel");
			param['meta'] = true;
			Ext.Ajax.request({
					url : '/bin/exe/getSearch.jcp',
					params : param,
					method : 'GET',
					scope : this,
					callback : function(options, success, response) {
						if (!success) {
							var msg = CPM.getResponeseErrMsg(response);
							Ext.msg("info", '获取查询定义错误.'.loc() + msg);
							return;
						}
						var res = response.responseText;
						if (res && success) {
							var result = Ext.decode(res);
							if(result.searchType=='1'){
								param['logicName']=result.logicName;
								param['mainTable']=result.mainTable;
								param['tooltipText']=result.tooltipText;
								param['advancedSearch']=result.advancedSearch;
								var searchViewPanel = new bin.exe.SearchPanel(parentPanel,param);
								searchViewPanel.init(param);
								var panel = searchViewPanel.MainTabPanel;

								var ja = result.buttonArray;
								if(ja&&ja.length>0){
									var btns = new Array(), cb = null;
									for (var i = 0; i < ja.length; i++) {
										cb = this.getButton(ja[i], panel.id);
										btns.push((cb == null) ? ja[i] : cb);
									}
									var tb = panel.getTopToolbar();
									if (Ext.isDefined(result.events)) {
										Ext.iterate(result.events, function(name, event) {
													panel.on(name, event);
												});
										delete result.events;
									}
									tb.add(btns);
								}

								parentPanel.add(panel);
								panel.param = param;
								parentPanel.doLayout();
							}else{
									//全文搜索框架
							
							
							
							}
						}
					}
			});
		},
		canUpdateDataOnly : function(panel, parentPanel, param){
			return (typeof(panel) != 'undefined')
					&& panel.param.objectId == param.objectId
					&& panel.param.programType == param.programType
		}
});