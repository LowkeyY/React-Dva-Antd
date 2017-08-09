Ext.ns("bin.i18n.setting");
bin.i18n.setting.LocaleSettingPanel = Ext.extend(Ext.FormPanel, {
	method : 'POST',
	border : false,
	labelWidth:200,
	url : '/bin/i18n/setting/LocaleSettingPanel.jcp',
	getCombo : function(config) {
		return new Ext.form.ComboBox(Ext.apply(config, {
					store : new Ext.data.JsonStore({
								autoDestroy : true,
								root : 'data',
								fields : ['text', 'value']
							}),
					displayField : 'text',
					valueField : 'value',
					valueNotFoundText : '未设置'.loc(),
					mode : 'local',
					triggerAction : 'all',
					editable : false,
					selectOnFocus : true,
					forceSelection : true
				}));
	},
	title : '区域与语言选项'.loc(),
	initComponent : function() {
		this.language = this.getCombo({
					fieldLabel : '语言与地区'.loc(),
					hiddenName : 'locale',
					width : 200
				});
		this.unit = this.getCombo({
					fieldLabel : '单位制'.loc(),
					hiddenName : 'unitSystem',
					width : 100
				});
		this.timezone = this.getCombo({
					fieldLabel : '时区'.loc(),
					hiddenName : 'timezone',
					width : 400
				});
		this.currency = this.getCombo({
					fieldLabel : '货币'.loc(),
					hiddenName : 'currency',
					width : 150
				});
		this.buttons = this.buttons || [];
		this.buttons.push({
					handler : function() {
						set_cookie("locale", this.language.getValue(), 100, "/");
						this.form.submit({
									url : '/bin/i18n/setting/LocaleSettingPanel.jcp',
									method : 'POST',
									success : function() {
										Ext.msg("info", '保存成功'.loc());
									}
								});
					},
					scope : this,
					text : '保存'.loc()
				})
		this.items = [this.language, this.unit, this.currency, this.timezone, {
					fieldLabel : '日期格式'.loc()+'('+'长'.loc()+')',
					name : 'dateLong',
					xtype : 'textfield',
					width : 200
				}, {
					fieldLabel : '日期格式'.loc()+'('+'短'.loc()+')',
					xtype : 'textfield',
					name : 'dateShort',
					width : 120
				}, {
					fieldLabel : '时间格式'.loc()+'('+'长'.loc()+')',
					xtype : 'textfield',
					name : 'timeLong',
					width : 200
				}, {
					fieldLabel : '时间格式'.loc()+'('+'短'.loc()+')',
					xtype : 'textfield',
					name : 'timeShort',
					width : 120
				}, {
					fieldLabel : '日期'.loc()+'+'+'时间格式'.loc()+'('+'长'.loc()+')',
					xtype : 'textfield',
					name : 'dateTimeLong',
					width : 300
				}, {
					fieldLabel : '日期'.loc()+'+'+'时间格式'.loc()+'('+'短'.loc()+')',
					xtype : 'textfield',
					name : 'dateTimeShort',
					width : 150
				}];
		bin.i18n.setting.LocaleSettingPanel.superclass.initComponent.call(this);

		this.language.on("select", function(combo, rec) {
					this.loadSetting(rec.get("value"));
				}, this);
		this.unit.store.loadData({
					data : [{
								text : '公制'.loc(),
								value : 'metric'
							}, {
								text : '英制'.loc(),
								value : 'imperial'
							}]
				});
		this.loadSetting("default");

	},
	loadSetting : function(language) {
		Ext.Ajax.request({
					url : this.url,
					params : {
						language : language
					},
					method : 'GET',
					scope : this,
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						if (result.languages) {
							this.language.store.loadData({
										data : result.languages
									})
						}
						this.currency.store.loadData({
									data : result.currencys
								})
						this.timezone.store.loadData({
									data : result.timezones
								})
						this.form.setValues(result.data);
					}
				});
	}

})