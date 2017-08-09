Ext.namespace("ExternalItems.haiwaizhishigongxiang.personset");
using("lib.PasswordField.PasswordField");

ExternalItems.haiwaizhishigongxiang.personset.personPassWD = function(btn) {
	this.passwordForm = new Ext.FormPanel({
		labelWidth : 120,
		labelAlign : 'right',
		cached : false,
		border : false,
		bodyStyle : 'padding:20px 15px 30px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'passwordfield',
											showCapsWarning : true,
											fieldLabel : '旧密码'.loc(),
											name : 'oldpasswd',
											width : 150,
											maxLength : 16,
											allowBlank : false,
											maxLengthText : '密码不能超过{0}个字符!'
													.loc(),
											blankText : '旧密码必须提供.'.loc()
										}]
							}, {
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'passwordfield',
											showCapsWarning : true,
											showStrengthMeter : true,
											fieldLabel : '新密码'.loc(),
											name : 'passwd',
											width : 150,
											maxLength : 16,
											allowBlank : false,
											maxLengthText : '新密码不能超过{0}个字符!'
													.loc(),
											blankText : '新密码必须提供.'.loc()
										}]
							}, {
								columnWidth : 1.0,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'textfield',
											fieldLabel : '确认密码'.loc(),
											name : 'confirm_passwd',
											inputType : 'password',
											width : 150,
											maxLength : 16,
											allowBlank : false,
											blankText : '确认密码必须提供.'.loc(),
											maxLengthText : '确认密码不能超过{0}个字符!'
													.loc()
										}]
							}]
				}]
	});
	
	this.win = new Ext.Window({
				title : btn.text,
				modal : true,
				constrainHeader : true,
				layout : 'fit',
				width : 380,
				height : 240,
				buttons : [{
					handler : function(btn){
						btn.disable();
						var frm = this.passwordForm.form;
						var confirmpasswd = frm.findField('confirm_passwd').getValue();
						var passwd = frm.findField('passwd').getValue();
						var oldpasswd = frm.findField('oldpasswd').getValue();
						if (passwd == confirmpasswd) {
							this.onSave({
										callback : function() {
											btn.enable();
										},
										callbackScope : this,
										task : 'save',
										what : 'password',
										passwd : passwd,
										oldpasswd : oldpasswd
									});
						} else {
							Ext.msg("error", '不能更新口令,确认密码与新密码不一致!'.loc());
							btn.enable();
						}
					},
					scope : this,
					text : '保存'.loc()
				}, {
					handler : function(){
						this.win.close();
					},
					scope : this,
					text : '关闭'.loc()
				}],
				items : this.passwordForm
			});
	return this.win;
}

ExternalItems.haiwaizhishigongxiang.personset.personPassWD.prototype = {
	onSave : function(params) {
		
		var callback = params.callback || null;
		var callbackScope = params.callbackScope || this;

		Ext.Ajax.request({
					url : '/home/system/setup.jcp',
					params : params,
					success : function(o) {
						if (o && o.responseText && Ext.decode(o.responseText).success) {
							Ext.msg("info" , "保存成功.");
							this.win && this.win.close();
						} else {
							if (Ext.decode(o.responseText).message) {
								saveComplete('错误'.loc(), Ext.decode(o.responseText).message);
							} else {
								saveComplete('错误'.loc(), '服务器发生错误,不能正常保存配置信息.'.loc());
							}
						}
					},
					failure : function() {
						saveComplete('错误'.loc(), '失去与服务器连接.'.loc());
					},
					scope : this
				});
		function saveComplete(title, msg) {
			Ext.msg(((title == '错误'.loc()) ? "error" : "info"), msg);
			if (callback) {
				callback.call(callbackScope);
			}
		}
	}	
}