/*
 * -----段落: -----修改Ext.data.Connection类，处理Session超时
 */
if (Ext.data.Connection) {
	Ext.override(Ext.data.Connection, {
				handleFailure : function(response, e) {
					this.transId = false;
					var options = response.argument.options;
					if (response.status == 401){
						
						var callbackScript=response.getResponseHeader("Callback-Script");
						if(callbackScript){
							eval(callbackScript);
						}else{
							top.TimeOut.showWindow(this, options);
						}
						return;
					}
					response.argument = options ? options.argument : null;
					this.fireEvent("requestexception", this, response, options,
							e);
					Ext.callback(options.failure, options.scope, [response,
									options]);
					Ext.callback(options.callback, options.scope, [options,
									false, response]);
				}
			});
}
top.TimeOut = function() {
	var EXPIRETIME = 30;// 超时时间(单位:分钟)。

	var logoPanel = new Ext.Panel({
				baseCls : 'x-plain',
				style : 'background:#f9f9f9  no-repeat center center;',
				region : 'center'
			});

	var formPanel = new Ext.form.FormPanel({
				bodyStyle : "background:#ffffff;padding:0px 0 5px 5px;",
				height : 40,
				items : [{
							name : 'usrMail',
							xtype : 'hidden'
						}, {
							name : 'usrLang',
							xtype : 'hidden'
						}, {
							xtype : 'textfield',
							//'请输入密码'.loc()
							fieldLabel : '请输入密码',
							width : 150,
							inputType : 'password',
							name : 'usrPwd',
							labelStyle:'text-align:right;width:200;padding:3px 10px 0px 0px',
							allowBlank : false
						}, {
							xtype : 'hidden',
							name : 'lt'
						}],
		
				border : false,
				region : 'south',
				url : "/login/login.jcp"
			});
	var dialog = new Ext.Window({
				buttons : [{
							handler : function() {
								window.legalQuit = true;
								self.location.replace("/login/");
							},
							//'以其他用户登录'.loc()
							text : '以其他用户登录'
						}, {
							handler : function() {
								top.TimeOut.login();
							},
							text : '登录'
						}],
				buttonAlign : 'right',
				closable : false,
				draggable : true,
				layout : 'border',
				modal : true,
				resizable : false,
				items : [logoPanel, formPanel],
				//'系统已自动锁定'.loc()
				title : '系统已自动锁定',
				height : 230,
				width : 530
			});

	var form = formPanel.getForm();
	var centerWinFn = function() {
		this.center();
	}
	EXPIRETIME *= 60000;

	return {

		expireTime : EXPIRETIME,// ReadOnly
		check : false,
		counter : 0,
		interval : null,
		shown : false,
		lastLink : null,
		
		warn:function(){
			
			alert('由于您长时间没有操作，系统已超时锁定，请重新登录。');
			self.location.replace('/')
		},

		showWindow : function(con, options) {
			if (this.shown)
				return false;
			this.shown = true;
			top.TimeOut.stop();
			if (get_cookie("user_name") == null) {
				self.location.replace("/login");
			}
			this.lastLink = (typeof(con) != 'undefined')
					? [con, options]
					: null;
			var lang = get_cookie("language");
			Ext.Ajax.request({
				method : 'GET',
				url : '/login/getSysConf.jcp?lang=' + lang + '&ra='
						+ Math.random(),
				scope : this,
				callback : function(options, success, response) {
					var result = {};
					if (!success
							|| !Ext.isDefined(response.responseText)
							|| (result = Ext.decode(response.responseText)).success == false) {
						//'无法连接服务器'.loc()
						Ext.msg("error", result.message || '无法连接服务器');
						return;
					}
					var systemJSON = Ext.decode(response.responseText);
					var lang = systemJSON.lang;
					if (lang) {
						using("lang."
								+ (lang.needToTranslate
										? lang.currentLanguage
										: "dumb"));
					} else
						using("lang.dumb");

					var m = function() {
						dialog.once("show", function() {
									var pwd = formPanel.form
											.findField("usrPwd");
									pwd.focus();
									pwd.clearInvalid.defer(200,pwd);
								}, this); 

						dialog.show();
						if (!logoPanel.logoSetted) {
							dialog.getEl().addKeyListener(13, this.login);
							dialog.body.parent().setStyle("border-color",
									"#99BBE8");
							logoPanel.logoSetted = true;
							var logo=result.logo;
							if (lang) {
								var logoArray=logo.split('.');
								logo=logoArray[0]+'_'+lang.currentLanguage+'.'+logoArray[1];
							}
							logoPanel.getEl().setStyle("background-image",
									"url(" + logo + ")");
						}
						formPanel.form.findField("lt").setValue(result.lt);
						formPanel.authType = result.authType;
						Ext.EventManager.onWindowResize(centerWinFn, dialog);
					}
					Ext.onReady(m, this);
				}
			})
			return false;
		},
		start : function() {
			Ext.getBody().on("mouseup", this.updateTime);
			Ext.getBody().on("keyup", this.updateTime);
			this.counter = 0;
			this.interval = setInterval(function() {
						var t = top.TimeOut;
						if (t.check) {
							t.check = false;
							t.counter = 0;
						} else {
							t.counter++;
							if (t.counter > 10) {
								Ext.Ajax.request({
											url : '/login/PlatformTimeoutChecker.jcp',
											method : 'GET'
										});
							}
						}
					}, Math.ceil(EXPIRETIME / 10))
		},
		stop : function() {
			Ext.getBody().un("mouseup", this.updateTime)
			Ext.getBody().un("keyup", this.updateTime)
			clearInterval(this.interval);
		},
		relocation : function() {// 续租
			Ext.Ajax.request({
						url : '/login/PlatformTimeoutChecker.jcp',
						method : 'POST'
					});
		},
		updateTime : function() {
			top.TimeOut.check = true;
		},
		login : function() {
			var fm = formPanel.form;
			fm.findField("usrMail").setValue(get_cookie("user_name"));
			if (formPanel.authType != 'simple') {
				fm.findField("usrPwd").setValue(hex_md5(fm.findField('usrPwd')
						.getValue()));
			}
			fm.findField("usrLang").setValue(get_cookie("language"));
			form.submit({
				//'登录中,请等待...'.loc()
				waitMsg : '登录中,请等待...',
				reset : true,
				scope : this,
				success : function() {
					try {
						var ll = top.TimeOut.lastLink;
						if (ll != null) {
							ll[0].request(ll[1]);
							ll = null;
						}
					} catch (e) {
						var desktop = WorkBench.Desk.getDesktop();
						//'登录成功,但恢复之前操作失败,请重新操作.'.loc()
						Ext.msg("info", '登录成功,但恢复之前操作失败,请重新操作.');
					}
					dialog.hide();
					Ext.EventManager.removeResizeListener(centerWinFn, dialog);
					top.TimeOut.shown = false;
					top.TimeOut.start();
				},
				failure : function(f, a) {
					Ext.msg("error", '<br>' + a.result.errors[0].msg, {
								scope : this,
								fn : function() {
									fm.findField("usrPwd").focus();
								}

							});
					var lang = get_cookie("language");
					Ext.Ajax.request({
						method : 'GET',
						url : '/login/getSysConf.jcp?lang=' + lang + '&ra='
								+ Math.random(),
						scope : this,
						callback : function(options, success, response) {
							var result = {};
							if (!success
									|| !Ext.isDefined(response.responseText)
									|| (result = Ext
											.decode(response.responseText)).success == false) {
								//'无法连接服务器'.loc()
								Ext.msg("error", result.message || '无法连接服务器');
								return;
							}
							fm.findField("lt").setValue(result.lt);
							fm.findField("usrPwd").setValue("");
						}
					});

				}
			});
		}
	}
}();
top.TimeOut.start();