Ext.namespace('lib.scripteditor');
using("lib.scripteditor.CodeEditor");
/**
 * sql语句调试编辑工具,带有控制台.提供即时运行和错误查看
 * 
 */

lib.scripteditor.sqlEditor = function() {

	this.codeEditor = new lib.scripteditor.CodeEditor({
				allowSearchAndReplace : true,
				value : this.value || '',
				hideLabel : true,
				language : "sql"
			});

	this.sqlGrid = new Ext.grid.GridPanel({
				store : new Ext.data.SimpleStore({
							fields : [{
										name : 'empty'
									}]
						}),
				columns : [{
							id : 'empty',
							header : "",
							width : 160,
							dataIndex : 'empty'
						}],
				stripeRows : true,
				hidden : true,
				border : false
			});

	this.controlPanel = new Ext.Panel({
				id : 'cpPanel',
				minSize : 150,
				style : 'font-size:14px;font-family:宋体;',
				maxSize : 450,
				autoScroll : true,
				border : false
			});
	this.MainPanel = new Ext.Panel({
		border : false,
		layout : 'border',
		split : true,
		items : [{
			layout : 'fit',
			border : false,
			region : 'center',
			margins : '1 1 1 1',
			bodyStyle : 'padding:0px 0px 0px 0px;height:100%;background:#FFFFFF;',
			items : this.codeEditor
		}, {
			xtype : 'panel',
			title : '控制台'.loc(),
			region : 'south',
			height : 150,
			split : true,
			animFloat : true,
			layout : 'fit',
			autoScroll : true,
			collapsible : false,
			margins : '1 0 1 1',
			cmargins : '1 1 1 1',
			items : [this.sqlGrid, this.controlPanel]
		}]
	});
}

lib.scripteditor.sqlEditor.prototype = {
	setValue : function(value) {
		this.codeEditor.setValue(value);
	},
	getValue : function() {
		return this.codeEditor.getValue();
	},
	controlStat : "controlPanel",
	getButtons : function() {
		var execute = function(btn) {
			btn.disable();
			var sqlContent = this.codeEditor.getSelectedText();
			if (sqlContent == null) {
				sqlContent = this.codeEditor.getValue();
				if (sqlContent == "\r") {
					btn.enable();
					Ext.msg('警示'.loc(), '必须填写sql语句'.loc());
				}
			}
			Ext.Ajax.request({
						url : '/lib/scripteditor/sqldebug.jcp',
						method : 'post',
						callback : function(options, success, response) {
							btn.enable();
							var config;
							try {
								config = eval("(" + response.responseText + ")");
							} catch (e) {
								config = {
									recordBack : false,
									message : '返回数据错误,内容为:'.loc() + '<br>'
											+ response.responseText
								}
							}
							if (config.recordBack) {
								var store = new Ext.data.SimpleStore({
											fields : config.st
										});
								store.loadData(config.data);
								var colModel = new Ext.grid.ColumnModel(config.cm);
								this.sqlGrid.reconfigure(store, colModel);
								if (this.controlStat == "controlPanel") {
									this.controlPanel.hide();
									this.sqlGrid.show();
									this.controlStat = "sqlGrid";
								}
							} else {
								var ctrlPanel = Ext.get(Ext.get('cpPanel')
										.first()).first().dom;
								if (this.controlStat == "sqlGrid") {
									this.sqlGrid.hide();
									this.controlPanel.show();
									this.controlStat = "controlPanel";
								}
								ctrlPanel.innerHTML = config.message;
							}
						}.createDelegate(this),
						params : {
							content : sqlContent
						}
					});
		};
		var btns = this.codeEditor.getButtons();
		btns.push({
					xtype : 'tbbutton',
					text : '运行'.loc(),
					icon : '/themes/icon/all/script_go.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					scope : this,
					handler : execute.createDelegate(this)
				});
		return btns;
	}
}
