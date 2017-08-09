// using("usr.cms.dingshizhixingBtn");
// usr.cms.dingshizhixingBtn(btn);

Ext.ns("usr.cms");
usr.cms.dingshizhixingBtn = function(btn) {
	var type = btn.text=="确认计划" ? "update" : "delete";
	var panel = Ext.getCmp(btn.panelId);
	var win = panel.findParentByType(Ext.Window);
	
	var id = panel.form.findField("id").getValue();
	var ps = panel.form.findField("dingshi").getValue()=="false"?"false":"true";
	if(type=="delete" && ps=="false"){
		Ext.msg("warn","您还没有创建计划！");
		return;
	}
	var tt = panel.form.findField("zuizhongzhixingriqi");
	var riqi = tt.getValue();
	riqi = riqi.substring(0,riqi.indexOf(":")+1)+"00:00";
	if(type=="update" && (new Date()>Date.parseDate(riqi, tt.valueFormat))){
		Ext.msg("warn","所选定日期\""+tt.getText()+"\"早于当前日期！");
		return;
	}
	
	var cz = panel.form.findField("guidang").getValue();
	
	var title,tishi;
	if(type=="update"){
		title  = (ps=="true"?"更新计划":"创建计划");
		tishi = "确认于"+tt.getText()+"执行"+cz+"?";
	}else{
		title = "取消计划";
		tishi = "确认取消计划?";
	}
	
	Ext.Msg.confirm(title,tishi,
					function(btns){
						if(btns == "yes"){
							win.getEl().mask("请稍候...");
							Ext.Ajax.request({
								url : '/usr/cms/dingshizhixing.jcp',
								params : {
									id : id,
									type : type,
									riqi : riqi
								},
								scope : this,
								method : 'Post',
								success : function(response, options) {
									win.getEl().unmask();
									var result = Ext.decode(response.responseText);
									if(result.success){
										win.fromPanelConfig.isCommit = true;
										win.close();
									} else
										Ext.msg("Error","提交失败。原因 ： " + '<br>' + result.message);
								},
								failure : function() {
									win.getEl().unmask();
									Ext.msg("warn", "提交失败。");
								}
							})
						}
	},this);
}