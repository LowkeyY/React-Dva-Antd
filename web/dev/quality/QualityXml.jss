Ext.namespace("dev.quality");
using("lib.scripteditor.CodeEditor");

dev.quality.QualityXml = function(params, frames, script) {
	this.frames = frames;
	this.script = script;
	var Quality = this.frames.get("Quality");

	var desktop = WorkBench.Desk.getDesktop();
	var w = desktop.getViewWidth();
	var h = desktop.getViewHeight();
	this.editor = new lib.scripteditor.CodeEditor({
				id : 'xmlCodeValue',
				language : 'xml',
				hideLabel : true,
				allowSearchAndReplace : true,
				allowFormatter : true,
				height : h - 70,
				allowBlank : false,
				blankText : "请输入XML协议".loc()
			});
	this.ButtonArray = new Array();
	this.params = params;
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/all/script_save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function(btn) {
					var code = this.editor.getValue();
					var retParam = this.params;
					retParam.content = code;
					retParam.type = "save";
					Ext.Ajax.request({
								url : '/dev/quality/qualityXml.jcp',
								method : 'post',
								params : retParam,
								scope : this,
								success : function() {
									setTimeout(function() {
												this.loadData(this.params,
														Quality.mainPanel);
											}.createDelegate(this), 300);
									Ext.msg("info", "保存成功".loc());
								}
							});
				}
			}));
	this.ButtonArray = this.ButtonArray.concat(this.editor.getButtons());
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function(btn) {
					using("dev.quality.RuleGrid");
					using("dev.quality.RuleScriptPanel");
					Quality.ruleScriptPanel = new dev.quality.RuleScriptPanel(
							this.params, this.frames);
					Quality.mainPanel.add(Quality.ruleScriptPanel.MainTabPanel);
					Quality.mainPanel
							.setActiveTab(Quality.ruleScriptPanel.MainTabPanel);
					Quality.ruleScriptPanel.loadData(this.params, this.script);
				}
			}));
	this.MainTabPanel = new Ext.FormPanel({
		labelWidth : 100,
		labelAlign : 'right',
		border : true,
		layout : 'fit',
		bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;display: block;',
		tbar : this.ButtonArray,
		items : this.editor
	});
};
dev.quality.QualityXml.prototype = {
	loadData : function(params, mainPanel) {
		this.params = params;
		// var code1 = Ext.util.JSON.decode(script.toXML()).script;
		var code1 = this.script.toXML();
		setTimeout(function() {
					this.editor.setValue(code1);
				}.createDelegate(this), 600);
		/*
		 * Ext.Ajax.request({ url:
		 * '/dev/quality/qualityXml.jcp?ra='+Math.random()+'&object_id='+params.object_id,
		 * method:'GET', scope:this, callback:
		 * function(options,success,response){
		 * code=Ext.util.JSON.decode(response.responseText).script;
		 * setTimeout(function(){ this.editor.setValue(code);
		 * }.createDelegate(this),600); }.createDelegate(this) });
		 */
		// mainPanel.setStatusValue(["编辑BeanShell"]);
	}
}
