

Ext.SSL_SECURE_URL = "/Ext/resources/images/default/s.gif";
Ext.BLANK_IMAGE_URL = "/Ext/resources/images/default/s.gif";

Login = function() {
	var dialog, form, submitUrl = 'login.jcp';
	return {
		Init : function() {
			var conn = new Ext.data.Connection();
			var lang = get_cookie("locale");
			conn.request({
						method : 'GET',
						url : '/login/getSysConf.jcp?lang=' + lang + '&ra='
								+ Math.random()
					});
			conn.on('requestcomplete', function(conn, oResponse) {
				var systemJSON = Ext.decode(oResponse.responseText);
				var title = systemJSON.title;
				var logo = systemJSON.logo;
				var authType = systemJSON.authType;
				var lt = systemJSON.lt;
				window.document.title = title;
				
				Ext.getBody().setStyle("background","url(./desktop-"+(Login.getBackgroundIndex())+".jpg)");
				

				if (Ext.isDefined(systemJSON.lang)) {
					var lang = systemJSON.lang;
					var logoArray = logo.split('.');
					logo = logoArray[0] + '_' + lang.currentLanguage + '.'
							+ logoArray[1];
				}
				Ext.QuickTips.init();
				var logoPanel = new Ext.Panel({
							baseCls : 'x-plain',
							style : 'background:#f9f9f9 url(' + logo
									+ ') no-repeat center center;',
							region : 'center'
						});

				if (Ext.isDefined(systemJSON.lang)) {
					var lang = systemJSON.lang;
					var langArray = systemJSON.lang.languages;
					using("lang."
							+ (lang.needToTranslate
									? lang.currentLanguage
									: "dumb"));
					store = new Ext.data.JsonStore({
								autoDestroy : true,
								root : 'languages',
								fields : ['text', 'value', 'country'],
								data : lang
							})
					store.each(function(rec) {
								rec.set("country", rec.get("value").substring(
												3, 5));
							});
					langType = new Ext.form.ComboBox({
						fieldLabel : '选择语言'.loc(),
						autoWidth : true,
						allowBlank : true,
						typeAhead : false,
						tpl : '<tpl for="."><div class="x-combo-list-item"><img src="/themes/icon/nationalflag/{country}.jpg" style="margin-right:5px;">{text}</div></tpl>',
						editable : false,
						width : 240,
						store : store,
						hiddenName : 'usrLang',
						valueField : 'value',
						displayField : 'text',
						triggerAction : 'all',
						restrictHeight : function() {
							this.innerList.dom.style.height = '';
							var inner = this.innerList.dom, pad = this.list
									.getFrameWidth('tb')
									+ (this.resizable ? this.handleHeight : 0)
									+ this.assetHeight, h = Math.max(
									inner.clientHeight, inner.offsetHeight,
									inner.scrollHeight), ha = this
									.getPosition()[1]
									- Ext.getBody().getScroll().top, hb = Ext.lib.Dom
									.getViewHeight()
									- ha - this.getSize().height, space = Math
									.max(ha, hb, this.minHeight || 0)
									- this.list.shadowOffset - pad - 5;

							h = Math.min(h, space, this.maxHeight)+this.store.getCount()*2;

							this.innerList.setHeight(h);
							this.list.beginUpdate();
							this.list.setHeight(h + pad);
							this.list.alignTo.apply(this.list, [this.el]
											.concat(this.listAlign));
							this.list.endUpdate();
						},
						value : lang.currentLanguage,
						mode : 'local'
					})

					langType.on("select", function(combo, rec) {
								var modName = rec.get('value');
								set_cookie("locale", modName, 100, "/");
								set_cookie("localeSelect", modName, 100, "/");
								self.location.replace("/login");
							})

				} else {
					using("lang.dumb");
					langType = {
						xtype : 'hidden'
					};
				}
				var formPanel = new Ext.form.FormPanel({
							baseCls : 'x-plain',
							baseParams : {
								module : 'login'
							},
							defaults : {
								width : 200
							},
							defaultType : 'textfield',
							frame : false,
							height : 90,
							id : 'login-form',
							items : [{
										fieldLabel : '用户名'.loc(),
										name : 'usrMail',
										id : 'username',
										style : 'ime-mode:disabled;'
									}, {
										fieldLabel : '密码'.loc(),
										xtype : 'passwordfield',
										showCapsWarning : true,
										showStrengthMeter : false,
										name : 'usrPwd1'
									}, langType, {
										inputType : 'hidden',
										name : 'usrPwd'
									}, {
										inputType : 'hidden',
										name : 'lt',
										value : lt
									}],
							labelWidth : 120,
							region : 'south',
							url : submitUrl
						});

				var btnclick = function() {// 其实机制不对，有空再处理--tz。
					var pwd1 = form.findField('usrPwd1');
					var val = pwd1.getValue();
					if (authType == 'simple') {
						form.findField('usrPwd').setValue(val);
					} else {
						pwd1.setValue("");
						form.findField('usrPwd').setValue(hex_md5(val));
					}
					form.submit({
						waitMsg : '请等待'.loc(),
						reset : true,
						waitTitle : '正在登录当前系统'.loc(),
						success : Login.Success,
						scope : Login,
						failure : function(f, a) {

							pwd1.setValue(val);
							Ext.Msg.alert('登录失败'.loc(), a.result.errors[0].msg);
						}
					});
				}
				dialog = new Ext.Window({
							buttons : [{
										handler : btnclick,
										scope : Login,
										text : '登录'.loc()
									}],
							buttonAlign : 'right',
							closable : false,
							draggable : true,
							height : 250,
							id : 'login-win',
							layout : 'border',
							minHeight : 250,
							minWidth : 530,
							plain : false,
							resizable : true,
							constrainHeader : true,
							items : [logoPanel, formPanel],
							title : '登录'.loc(),
							width : 530
						});
				form = formPanel.getForm();
				dialog.show();
				dialog.getEl().addKeyListener(13, btnclick);
				Ext.EventManager.onWindowResize(function() {
							dialog.center();
						}, this);
			}, this);
		},
		Success : function(f, a) {
			if (a && a.result) {
				dialog.destroy(true);
				var path = "/index.jcp";
				window.location = path;
			}
		},
		getBackgroundIndex : function(){
			var start = 1 , maxnum = 5 , flag = "Login_bg_img_num" , index = (get_cookie(flag) || 0) * 1;
			index = !index || (index >= maxnum) ? start : (index + 1);
			set_cookie(flag , index);
			return get_cookie(flag);
		}
	};
}();
Ext.form.BasicForm.prototype.afterAction = function(action, success) {
	this.activeAction = null;
	var o = action.options;
	if (o.waitMsg) {
		Ext.MessageBox.updateProgress(1);
		Ext.MessageBox.hide();
	}
	if (success) {
		if (o.reset) {
			this.reset();
		}
		Ext.callback(o.success, o.scope, [this, action]);
		this.fireEvent('actioncompleted', this, action);
	} else {
		Ext.callback(o.failure, o.scope, [this, action]);
		this.fireEvent('actionfailed', this, action);
	}
}
Ext.onReady(Login.Init, Login, true);
