Ext.namespace("dev.report");
using("lib.scripteditor.CodeEditor");
dev.report.SaveReport = function(params) {

	this.params = params;
	this.win;
	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'delete',
				text : '删除'.loc(),
				icon : '/themes/icon/xp/delete.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());

	var desktop = WorkBench.Desk.getDesktop();
	var w = desktop.getViewWidth();
	var h = desktop.getViewHeight();
	var xmlCodeEditor = new lib.scripteditor.CodeEditor({
				id : 'xmlCodeValue',
				language : 'xml',
				hideLabel : true,
				height : h - 70,
				allowFormatter : true,
				allowSearchAndReplace : true,
				allowBlank : false,
				blankText : '请输入XML协议'.loc()
			});
	ButtonArray = ButtonArray.concat(xmlCodeEditor.getButtons());
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'close',
				text : '关闭'.loc(),
				icon : '/themes/icon/xp/close.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	this.SaveReportForm = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		border : true,
		layout : 'fit',
		bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;display: block;',
		items : xmlCodeEditor
	});
	this.win = desktop.getWindow('saveReport');
	if (!this.win) {
		this.win = desktop.createWindow({
					id : 'saveReport',
					title : '报表定义'.loc(),
					layout : 'fit',
					width : w,
					height : h,
					plain : false,
					modal : true,
					scope : this,
					items : [this.SaveReportForm],
					tbar : ButtonArray
				});
	}
	this.win.show();
};
Ext.extend(dev.report.SaveReport, Ext.Window, {
	load : function() {
		var Report = this.frames.get('Report');

		this.win.on('show', function() {
					var xml = dev.report.model.report.toXML();
					this.SaveReportForm.form.findField('xmlCodeValue')
							.setValue(xml);
				}, this);
		if (Report.reportPanel.state == 'create') {
			var tempToolBar = this.win.getTopToolbar();
			tempToolBar.items.each(function(item) {
						if (item.btnId == 'delete')
							item.disable();
					}, tempToolBar.items);
		}
	},
	saveReport : function(option) {
		var Report = this.frames.get('Report');
		if (option) {
			var modelXml = Tool.parseXML(this.SaveReportForm.form
					.findField('xmlCodeValue').getValue());

			var model;
			if (Ext.isIE) {
				model = modelXml.xml;
			} else {
				model = (new XMLSerializer()).serializeToString(modelXml);
			}
			model = model.replace('name="undefined"', 'name="' + option.name
							+ '"');
			var msg = Tool.postXML(
					"/dev/report/ReportEvent.jcp?event=save&forder_id="
							+ option.forder_id + "&parent_id="
							+ this.params['parent_id'] + "&report_name="
							+ encodeURI(option.name), model);
			if (msg.firstChild.firstChild.nodeValue == 'true') {
				if (option.method == 'create') {
					Report.navPanel.getTree().loadSubNode(
							msg.lastChild.firstChild.nodeValue,
							Report.navPanel.clickEvent);
				}
				var tempToolBar = this.win.getTopToolbar();
				tempToolBar.items.each(function(item) {
							if (item.btnId == 'delete')
								item.enable();
						}, tempToolBar.items);
				Ext.msg("info", '完成报表创建!'.loc());
			} else {
				Ext.msg("error", '查询保存失败,原因:<br>'.loc()
								+ msg.lastChild.firstChild.nodeValue);
			}
		}
	},
	showReport : function(xmlDOC) {
		using("dev.report.ReportPreview");
		var reportWindow = new dev.report.ReportPreview(xmlDOC);
		reportWindow.show();
	},
	onButtonClick : function(item) {
		if (item.btnId == 'close') {
			this.win.close();
		} else if (item.btnId == 'save') {
			var Report = this.frames.get('Report');
			if (this.SaveReportForm.form.findField('xmlCodeValue').getValue() == '') {
				Ext.msg("error", '请输入XML协议!'.loc());
				return;
			}
			if (Report.reportPanel.state == 'create') {
				using("dev.folder.FolderWindow");
				if (this.params['parent_id']) {
					var folderWindow = this.frames
							.createPanel(new dev.folder.FolderWindow(1,
									'report', this.params['parent_id'], 300,
									this.frames, false));
					folderWindow.show();
				} else {
					var folderWindow = this.frames
							.createPanel(new dev.folder.FolderWindow(1,
									'report', '', 300, this.frames, false));
					folderWindow.show();
				}
			} else {
				var xmlString = "";
				if (Ext.isIE) {
					xmlString = Tool.parseXML(this.SaveReportForm.form
							.findField('xmlCodeValue').getValue()).xml
				} else {

					xmlString = (new XMLSerializer()).serializeToString(Tool
							.parseXML(this.SaveReportForm.form
									.findField('xmlCodeValue').getValue()));
				}
				var msg = Tool.postXML(
						"/dev/report/ReportEvent.jcp?event=updatesave&report_id="
								+ this.params['report_id'] + "&parent_id="
								+ this.params['parent_id'], xmlString);
				if (msg.firstChild.firstChild.nodeValue == 'true') {
					Ext.msg("info", '完成报表更新!'.loc());
				} else {
					Ext.msg("error", '查询保存失败,原因:<br>'.loc()
									+ msg.lastChild.firstChild.nodeValue);
				}
			}
		} else if (item.btnId == 'preview') {
			using("dev.report.ParamsWindow");
			if (this.SaveReportForm.form.findField('xmlCodeValue').getValue() == '') {
				Ext.msg("error", '请输入XML协议!'.loc());
				return;
			}
			var params = [];
			var xmlDOC = Tool.parseXML(this.SaveReportForm.form
					.findField('xmlCodeValue').getValue());

			var resourceNode = xmlDOC.selectSingleNode("resource");
			var queryNode = resourceNode.selectSingleNode("query");
			var paramNodes = queryNode.getElementsByTagName("param");

			if (paramNodes.length > 0) {
				var queryId = queryNode.getAttribute("id");
				var paramsWin = this.frames
						.createPanel(new dev.report.ParamsWindow(queryId,
								xmlDOC));
				paramsWin.show();
			} else {
				this.showReport(xmlDOC);
			}
		} else if (item.btnId == 'delete') {
			var Report = this.frames.get('Report');
			Ext.msg('confirm', '警告：删除报表，确认吗?'.loc(), function(answer) {
				if (answer == 'yes') {
					msg = Tool
							.getXML("/dev/report/ReportEvent.jcp?event=delete&report_id="
									+ this.params['report_id']);
					if (msg.firstChild.firstChild.nodeValue == 'true') {
						this.win.close();
						Report.navPanel.getTree()
								.loadParentNode(Report.navPanel.clickEvent);
					} else {
						Ext.msg("error", '查询保存失败,原因:<br>'.loc()
										+ msg.lastChild.firstChild.nodeValue);
					}
				}
			}.createDelegate(this));
		}
	}
});
