Ext.namespace("dev.logic");

dev.logic.DataServiceParam = function(params, retFn,name) {

	var buttonArray = [];
	buttonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function() {
					var frm = mainPanel.getForm();
					if (frm.isValid()) {
						frm.submit({
									params : params,
									scope : this,
									success : function(form, action) {
										Ext.msg("info",'保存成功'.loc());
										retFn();
									},
									failure : function(form, action) {
										Ext
												.msg(
														"error",
														'数据提交失败!,原因:'.loc()+'<br>'
																+ action.result.message);
									}
								});
					} else {
						Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
					}
				}
			}));
	buttonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				handler : retFn
			}));

	var mainPanel = new Ext.form.FormPanel({
		url : '/dev/logic/DataServiceParam.jcp',
		method : 'POST',
		border : false,
		cached : true,
		labelWidth : 60,
		bodyStyle : 'padding:20px 0px 0px 50px;height:100%;width:100%;background:#FFFFFF;',
		tbar : buttonArray,
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.50,
						layout : 'form',
						labelWidth : 60,
						border : false,
						items : [new Ext.form.RadioGroup({
									fieldLabel : '服务类型'.loc(),
									scope : this,
									width : 200,
									name : 'service_type',
									items : [{
												boxLabel : 'REST',
												name : 'service_type',
												inputValue : 0,
												checked : true
											}, {
												boxLabel : 'SOAP',
												name : 'service_type',
												inputValue : 1
											}]
								})]
					}, {
						columnWidth : 0.50,
						layout : 'form',
						labelWidth : 60,
						border : false,
						items : [new Ext.form.ComboBox({
									fieldLabel : '接口类型'.loc(),
									store : new Ext.data.SimpleStore({
												fields : ['value', 'text'],
												data : [["0", "POST"],
														["1", "PUT"],
														["2", "GET"]]
											}),
									valueField : 'value',
									displayField : 'text',
									triggerAction : 'all',
									value:'2',
									width : 200,
									mode : 'local',
									hiddenName : 'interface_type'
								})]
					}]
		}, {
			columnWidth : 0.50,
			layout : 'form',
			labelWidth : 60,
			border : false,
			items : [{
						xtype : 'combo',
						fieldLabel : '数据格式'.loc(),
						store : new Ext.data.SimpleStore({
									fields : ['value', 'text'],
									data : [["0", "JSON"], ["1", "XML"]]
								}),
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						value:'0',
						width : 200,
						mode : 'local',
						hiddenName : 'data_pattern'
					},{
						xtype:'hidden',
						name:'name',
						value:name
					}]
		}]
	});
	mainPanel.loadData=function(param){
		this.load({
			method:'GET',
			params:{
				objectId:param.objectId
			}
		})
	}
	return mainPanel;
};
