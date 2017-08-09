using('lib.DateTime.DateTimeMenu');

lib.DateTime.DateTimeField = Ext.extend(Ext.form.DateField, {

			dateFormat : 'Y/m/d',
			timeFormat : 'H:i:s',
			invalidText : "{0} 的日期格式错误，正确的格式例如：{2}。您还可以点击右侧图标选取日期",

			defaultAutoCreate : {
				tag : 'input',
				type : 'text',
				size : '22',
				autocomplete : 'off'
			},

			initComponent : function() {
				this.format = this.dateFormat + ' ' + this.timeFormat;
				lib.DateTime.DateTimeField.superclass.initComponent.call(this);
				var pickerConfig = Ext.apply(this.picker || {}, {
							dateFormat : this.dateFormat,
							timeFormat : this.timeFormat
						});

				delete this.picker;
				delete this.initialConfig.picker;

				this.menu = new lib.DateTime.DateTimeMenu({
							picker : pickerConfig,
							hideOnClick : false
						});
			},

			onTriggerClick : function() {
				lib.DateTime.DateTimeField.superclass.onTriggerClick.call(this);

				this.menu.picker.setValue(this.getValue() || new Date());
			}

		});

Ext.reg('datetimefield', lib.DateTime.DateTimeField);
