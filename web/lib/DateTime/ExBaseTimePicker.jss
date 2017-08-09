using("lib.DateTime.BaseTimePicker");

lib.DateTime.ExBaseTimePicker = Ext.extend(lib.DateTime.BaseTimePicker, {

			format : 'g:i:s A',

			secIncrement : 1,

			secsLabel : 'Seconds',

			initComponent : function() {
				this.secSlider = new Ext.slider.SingleSlider({
							increment : this.secIncrement,
							minValue : 0,
							maxValue : 59,
							fieldLabel : this.secsLabel,
							listeners : {
								change : this._updateTimeValue,
								scope : this
							},
							plugins : new Ext.slider.Tip()
						});

				lib.DateTime.ExBaseTimePicker.superclass.initComponent
						.call(this);
			},

			_initItems : function() {
				lib.DateTime.ExBaseTimePicker.superclass._initItems.call(this);

				this.items.push(this.secSlider);
			},

			setValue : function(value, animate) {
				this.secSlider.setValue(value.getSeconds(), animate);

				lib.DateTime.ExBaseTimePicker.superclass.setValue.call(this,
						value, animate);
			},

			_extractValue : function() {
				var v = lib.DateTime.ExBaseTimePicker.superclass._extractValue
						.call(this);

				v.setSeconds(this.secSlider.getValue());
				return v;
			},

			destroy : function() {
				this.secSlider = null;

				lib.DateTime.ExBaseTimePicker.superclass.destroy.call(this);
			}

		});

Ext.reg('exbasetimepicker', lib.DateTime.ExBaseTimePicker);
