Ext.namespace("bin.exe");

bin.exe.ParamsWindow = function(btn,panel,params,frameJSON){
	this.win;
	this.params=params;

	var len = frameJSON.searchEditor.editors.length;	
	var h=len*28+30;

	this.ParamsPanel = new Ext.Panel({
		labelAlign:'right',
		frame:true,
		collapsible:false,
		layout:'form'
	});

	this.win =  new Ext.Window({
		title:'参数提交'.loc(),
		layout:'fit',
		width:370,
		height:h,
		scope:parent.WorkBench,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.ParamsPanel],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler:function(){
			var paramStr = "";
			var n=0;
			this.ParamsPanel.items.each(function(item){    
					paramStr+='::'+item.fieldLabel;
					params["searchfield"+n+""]=item.getValue();
					n++;
			}, this.ParamsPanel.items);	
			params["param"]=paramStr.substring(2);
			var mask = new Ext.LoadMask(panel.ownerCt.getEl(), {
						msg : '正在计算中...'.loc(),
						msgCls : 'x-mask-loading'
					});           
			mask.show();
			Ext.Ajax.request({
						url : '/bin/exe/caculate.jcp',
						params : params,
						method : 'post',
						timeout : 1800000,
						scope : this,
						success : function(response, options) {
							var check = response.responseText;
							var ajaxResult = Ext.util.JSON.decode(check);
							if (ajaxResult.success) {
								if (btn.target.type == '0') {
									Ext.msg("info", '完成计算.'.loc());
								} else {
									CPM.replaceTarget(panel, panel.ownerCt,panel.param, btn.target);
								}
							}else {
								Ext.msg("error", '执行失败!原因:'.loc()+'<br>'
												+ ajaxResult.message);
							}
							mask.hide();
						},
						failure : function(response, options) {
							mask.hide();
							Ext.msg("error", CPM.getResponeseErrMsg(response));
						}
				})
				this.win.close();
			}.createDelegate(this)
		},{
			text: '取消'.loc(),
			scope:this,
			handler: function(){
				this.win.close();
			}
		}]
	});

	this.ParamsPanel.on('render', function() {
		if(frameJSON.searchEditor){
			var editors=frameJSON.searchEditor.editors;
			if((editors instanceof Array) && editors.length>0){
				if(frameJSON.searchEditor.libs.length>0){
					eval(frameJSON.searchEditor.libs);
				}
				this.eds=[];
				for(var i=0;i<editors.length;i++){
					if(editors[i].fieldLabel){
						editors[i]=Ext.ComponentMgr.create(editors[i], 'textfield')
						this.eds.push(editors[i]);
						this.ParamsPanel.add(editors[i]);
					}
				}
			}
		}
	}, this);
};        

Ext.extend(bin.exe.ParamsWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
    }
});

