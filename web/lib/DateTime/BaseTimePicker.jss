Ext.namespace('lib.DateTime');
loadcss("lib.DateTime.DateTime");

lib.DateTime.BaseTimePicker = Ext.extend(Ext.Panel, {

			format : 'H:i',

			header : true,

			nowText : '当前时间',

			doneText : '确定',

			hourIncrement : 1,

			minIncrement : 1,

			hoursLabel : 'Hours',

			minsLabel : 'Minutes',

			cls : 'ux-base-time-picker',

			width : 210,

			layout : 'form',

			labelAlign : 'top',

			initComponent : function() {
				this.addEvents('select');

				this.hourSlider = new Ext.slider.SingleSlider({
							increment : this.hourIncrement,
							minValue : 0,
							maxValue : 23,
							fieldLabel : this.hoursLabel,
							listeners : {
								change : this._updateTimeValue,
								scope : this
							},
							plugins : new Ext.slider.Tip()
						});

				this.minSlider = new Ext.slider.SingleSlider({
							increment : this.minIncrement,
							minValue : 0,
							maxValue : 59,
							fieldLabel : this.minsLabel,
							listeners : {
								change : this._updateTimeValue,
								scope : this
							},
							plugins : new Ext.slider.Tip()
						});

				this.setCurrentTime(false);

				this._initItems();

				this.bbar = [{
							text : this.nowText,
							handler : this.setCurrentTime,
							scope : this
						}, '->', {
							text : this.doneText,
							handler : this.onDone,
							scope : this
						}];

				lib.DateTime.BaseTimePicker.superclass.initComponent.call(this);
			},

			_initItems : function() {
				this.items = [this.hourSlider, this.minSlider];
			},

			setCurrentTime : function(animate) {
				this.setValue(new Date(), !!animate);
			},

			onDone : function() {
				this.fireEvent('select', this, this.getValue());
			},

			setValue : function(value, animate) {
				this.hourSlider.setValue(value.getHours(), animate);
				this.minSlider.setValue(value.getMinutes(), animate);

				this._updateTimeValue();
			},

			_extractValue : function() {
				var v = new Date();
				v.setHours(this.hourSlider.getValue());
				v.setMinutes(this.minSlider.getValue());
				return v;
			},

			getValue : function() {
				return this._extractValue();
			},

			_updateTimeValue : function() {
				var v = this._extractValue().format(this.format);

				if (this.rendered) {
					this.setTitle(v);
				}
			},

			afterRender : function() {
				lib.DateTime.BaseTimePicker.superclass.afterRender.call(this);

				this._updateTimeValue();
			},

			destroy : function() {
				this.purgeListeners();

				this.hourSlider = null;
				this.minSlider = null;

				lib.DateTime.BaseTimePicker.superclass.destroy.call(this);
			}

		});

Ext.reg('basetimepicker', lib.DateTime.BaseTimePicker);