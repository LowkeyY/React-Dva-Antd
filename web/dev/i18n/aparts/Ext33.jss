var pref;

/* 表单label翻译 */
pref = Ext.layout.FormLayout.prototype.getTemplateArgs;
Ext.override(Ext.layout.FormLayout, {
			getTemplateArgs : function(field) {
				var args = this.getTemplateArgsI18n(field);
				if (args.label)
					if (args.label.indexOf("<font") > -1) {
						var lb = args.label;
						args.label = lb.substring(0, lb.indexOf("<font")).loc()
								+ lb.substring(lb.indexOf("<font"));
					} else {
						args.label = args.label.loc();
					}
				return args;
			},
			getTemplateArgsI18n : pref
		});

/* 按钮文字翻译 */
pref = Ext.Button.prototype.setText;
Ext.override(Ext.Button, {
			setText : function(text) {
				if (Ext.isString(text))
					this.setTextI18n(text.loc());
			},
			setTextI18n : pref
		});

/* 列表标题栏翻译 */
pref = Ext.grid.ColumnModel.prototype.setConfig
Ext.override(Ext.grid.ColumnModel, {
			setConfigI18n : pref,
			setConfig : function(config, initial) {
				for (i = 0, len = config.length; i < len; i++) {
					if (config[i].header.indexOf("(") > -1) {
						var hd = config[i].header;
						config[i].header = hd.substring(0, hd.lastIndexOf("("))
								.loc()
								+ hd.substring(hd.lastIndexOf("("));
					} else {
						config[i].header = config[i].header.loc();
					}
					if (config[i].header.length * 7 > config[i].width)
						config[i].width = config[i].header.length * 7;
				}
				this.setConfigI18n(config, initial);
			}
		})
/* 重写Ext.menu.Item 菜单文本翻译 */
pref = Ext.menu.BaseItem.prototype.initComponent;
Ext.override(Ext.menu.BaseItem, {
			initComponent : function() {
				this.initComponentI18n();
				if (this.text)
					this.text = this.text.loc()
			},
			initComponentI18n : pref
		});
/* 重写Ext.Toolbar 工具条字符按钮翻译 */
pref = Ext.Toolbar.prototype.addText;
Ext.override(Ext.Toolbar, {
			addText : function(text) {
				this.addTextI18n(text.loc());
			},
			addTextI18n : pref
		});
/* 重写Ext.Panel 标题栏翻译 */
pref = Ext.Panel.prototype.setTitle
Ext.override(Ext.Panel, {
			setTitle : function(title, iconCls) {
				this.setTitleI18n(title.loc(), iconCls);
			},
			setTitleI18n : pref
		});

/* Ext.form.Label对象翻译 */
pref = Ext.form.Label.setText
Ext.override(Ext.form.Label, {
			setText : function(text) {
				this.setTextI18n(text.loc());
			},
			setTextI18n : pref
		});
/* Combo下拉列表翻译 */
pref = Ext.form.ComboBox.prototype.initList
Ext.override(Ext.form.ComboBox, {
			initList : function() {
				if (!this.list) {
					this.initListI18n();
					var v = this.valueField;
					var d = this.displayField;
					if (v != d && Ext.isDefined(this.view.prototype)) {// 如果相同,不能翻译.
						this.view.prototype.prepareData = function(data) {
							data[d] = data[d].loc();
							return data;
						}
					}
				}
			},
			initListI18n : pref
		});
/* Ext.grid.PropertyGrid左侧属性名翻译 */
Ext.override(Ext.grid.PropertyColumnModel, {
			renderProp : function(v) {
				return this.getPropertyName(v).loc();
			}
		});
delete pref;