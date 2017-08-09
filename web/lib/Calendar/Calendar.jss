Ext.ux.Calendar = Ext.extend(Ext.form.Field, {
			/**
			 * @cfg {String/Object} defaultAutoCreate DomHelper element spec Let
			 *      superclass to create hidden field instead of textbox. Hidden
			 *      will be submittend to server
			 */
			defaultAutoCreate : {
				tag : 'input',
				type : 'hidden'
			}
			/**
			 * @cfg {String } see Ext.Date formate.
			 */
			/**
			 * @cfg {Boolean} allowBlank allow return blank (defaults to 'true' ).
			 */
			,
			allowBlank : true
			/**
			 * @cfg {Boolean} blankText message to show when the field is blank.
			 */
			,
			blankText : '本项不能为空'.loc()
			/**
			 * @cfg {String} pattern time pattern
			 */
			,
			pattern : ""
			/**
			 * @cfg{Field} hidden field name
			 */
			,
			hiddenName : false
			/**
			 * @cfg{Date} value init value
			 */
			,
			value : ''
			/**
			 * @cfg {Date} prefix show prefix(default false)
			 */
			,
			prefix : false
			/**
			 * @cfg {Date} prefix show postfix(default true)
			 */
			,
			postfix : true,
			valueFormat : 'Y/m/d'
			/**
			 * private creates handlers
			 */
			,
			combos : null,
			hiddenField : null,
			comboConfig : {},
			initComponent : function() {
				this.combos = new Array();
				// call parent initComponent
				Ext.ux.Calendar.superclass.initComponent.call(this);
				if (this.pattern.length < 1) {
					throw 'pattern必需设置'.loc();
				}
				this.pattern = this.pattern.toLowerCase().replace(
						(new RegExp("ymd", "g")), 'c');
				this.pattern = this.pattern.replace((new RegExp("[^yqmdhisuc]",
								"g")), 'c');
				this.originalValue = this.value;
				this.setValue(this.value, false);
				// *注册表各项依次为:最小值,最大值,后缀,前缀,宽度,初始值,设置值方法,取得显示值方法
				this.set = {
					y : [1900, 2101, '年'.loc(), '年度'.loc(), 68, this.value.getFullYear(),
							this.value.setFullYear, this.value.getFullYear],
					q : [1, 4, '季度'.loc(), '季度'.loc(), 60,
							Math.ceil(this.value.getMonth() / 3),
							function(val) {
								this.setMonth((val - 1) * 3);
							}, function() {
								return Math.floor(this.getMonth() / 3) + 1;
							}],
					m : [1, 12, '月'.loc(), '月份'.loc(), 52, this.value.getMonth() + 1,
							this.value.setMonth, function() {
								return this.getMonth() + 1
							}],
					d : [1, 31, '日'.loc(), '日期'.loc(), 52, this.value.getDate(),
							this.value.setDate, this.value.getDate],
					h : [0, 23, '时'.loc(), '小时'.loc(), 52, this.value.getHours(),
							this.value.setHours, this.value.getHours],
					i : [0, 59, '分'.loc(), '分钟'.loc(), 52, this.value.getMinutes(),
							this.value.setMinutes, this.value.getMinutes],
					s : [0, 59, '秒'.loc(), '秒 '.loc(), 52, this.value.getSeconds(),
							this.value.setSeconds, this.value.getSeconds],
					u : [0, 999, '毫秒'.loc(), '毫秒 '.loc(), 70, this.value.getMilliseconds(),
							this.value.setMilliseconds,
							this.value.getMilliseconds],
					c : [0, 0, '', '日期'.loc(), 90, this.value, false, function() {
								return this;
							}]
				};
				var testPattern = (this.pattern.indexOf('c') == -1)
						? "ymdhisu"
						: "hisu";
				var fn, cs, se;
				for (var i = 0; i < testPattern.length; i++) {
					var cs = testPattern.charAt(i);
					if (this.pattern.indexOf(cs) == -1 && this.set[cs]) {
						se = this.set[cs];
						if (cs != 'm') {
							se[6].call(this.value, se[0]);
						} else if (this.pattern.indexOf('q') == -1) {
							se[6].call(this.value, se[0] - 1);
						}

					}
				}
				var pt = (this.postfix) ? true : false;
				var cf = this.comboConfig;
				function getCombo(c, p) {
					var s = p[1] - p[0] + 1;
					var arr = new Array(s);
					for (var i = 0, j = p[0]; i < s; i++, j++)
						arr[i] = [(pt ? (j + p[2]) : j), j];
					var config = Ext.apply({
								store : new Ext.data.SimpleStore({
											fields : ['text', 'value'],
											data : arr
										}),
								value : p[5],
								mode : 'local',
								valueField : 'value',
								displayField : 'text',
								triggerAction : 'all',
								width : p[4],
								label : c
							}, cf);
					var combo = new Ext.form.ComboBox(config)
					return combo;
				}
				this.width = 0;
				var ccf = this.comboCConfig;
				for (var i = 0; i < this.pattern.length; i++) {
					var c = this.pattern.charAt(i);
					var p = this.set[c];
					if (!p)
						continue;
					this.combos.push((c == 'c') ? new Ext.form.DateField(Ext.apply({
								value : p[5],
								width : p[4],
								label : c,
								getText : function() {
									return this.getValue().format('Y年m月d日'.loc())
								},
								format : 'Y/m/d'
							},ccf)) : getCombo(c, p));
					this.width += p[4];
				}
			},
			getName : function() {
				return this.hiddenName || this.name || this.id;
			}
			/**
			 * private Renders underlying DateField and provides a workaround
			 * for side error icon bug
			 */
			,
			onRender : function(ct, position) {
				// don't run more than once
				if (this.isRendered) {
					return;
				}
				var titems = new Array();
				for (var i = 0; i < this.combos.length; i++) {
					if (this.prefix)
						titems.push({
									tag : 'td',
									style : 'width:60px;font-size:12px;',
									html : this.set[this.combos[i].label][3]
											+ ":"
								});
					titems.push({
								tag : 'td',
								style : 'padding-right:4px;',
								cls : this.id + '-' + i
							})
				}

				if (this.prefix)
					this.width += this.combos.length * 36;
				var t = Ext.DomHelper.append(ct, {
							tag : 'table',
							style : 'border-collapse:collapse;table-layout:auto;width:'
									+ this.width,
							children : [{
										tag : 'tr',
										children : titems
									}]
						}, true);

				this.tableEl = t;
				this.wrap = t.wrap({
							cls : 'x-form-field-wrap'
						});
				this.el = this.tableEl;

				// render
				for (var i = 0; i < this.combos.length; i++) {
					this.combos[i].render(t.child('td.' + this.id + '-' + i));
				}
				this.hiddenField = Ext.DomHelper.append(this.wrap, {
							tag : 'input',
							type : 'hidden',
							name : this.hiddenName || this.name || this.id
									|| Ext.id()
						}, true);
				this.hiddenField.dom.value = this.value
						.format(this.valueFormat);

				for (var i = 0; i < this.combos.length; i++) {
					if (this.combos[i].label == 'c') {
						this.combos[i].on('change', function(field, newVal,
										oldVal) {
									this.syncValue(field.label, newVal);
								}, this)
					} else {
						this.combos[i].on('select',
								function(combo, rec, index) {
									this.syncValue(combo.label, rec.data.value);
								}, this)
					}
				}
				// workaround for IE trigger misalignment bug
				if (Ext.isIE && Ext.isStrict) {
					t.select('input').applyStyles({
								top : 0
							});
				}
				// we're rendered flag
				this.isRendered = true;
			}

			/**
			 * private
			 */
			,
			adjustSize : Ext.BoxComponent.prototype.adjustSize

			/*******************************************************************
			 * Disable this component.
			 * 
			 * @return {Ext.Component} this
			 */
			,
			disable : function() {
				if (this.isRendered) {
					for (var i = 0; i < this.combos.length; i++)
						this.combos[i].onDisable();
				}
				this.disabled = true;
				for (var i = 0; i < this.combos.length; i++)
					this.combos[i].disabled = true;
				this.fireEvent("disable", this);
				return this;
			}

			/*******************************************************************
			 * Enable this component.
			 * 
			 * @return {Ext.Component} this
			 */
			,
			enable : function() {
				if (this.isRendered) {
					for (var i = 0; i < this.combos.length; i++)
						this.combos[i].onEnable();
				}
				this.disabled = false;
				for (var i = 0; i < this.combos.length; i++)
					this.combos[i].disabled = false;
				this.fireEvent("enable", this);
				return this;
			}

			/**
			 * private Focus Date filed
			 */
			,
			focus : function() {
				this.combos[0].focus();
			},
			blur : function() {
				for (var i = 0; i < this.combos.length; i++)
					this.combos[i].blur();
			}
			/**
			 * private
			 */
			,
			getPositionEl : function() {
				return this.wrap;
			}
			/**
			 * private
			 */
			,
			getResizeEl : function() {
				return this.wrap;
			}
			/*******************************************************************
			 * @return {Date/String} Returns value of this field
			 */
			,
			getText : function() {
				var val = "", c, p;
				for (var i = 0; i < this.pattern.length; i++) {
					c = this.pattern.charAt(i);
					p = this.set[c];
					val += (p) ? this.combos[i].getText() : c;
				}
				return val;
			},
			syncValue : function(label, value) {
				if(label=='c' && value==''){
					this.hiddenField.dom.value="";
					return;
				} 
				if (label == 'm')
					value--;
				if (Ext.isDefined(label)) {
					var f = this.set[label][6];
					if (f) {
						f.call(this.value, value);
					} else {
						this.value.setFullYear(value.getFullYear());
						this.value.setMonth(value.getMonth());
						this.value.setDate(value.getDate());
					}
				}
				this.hiddenField.dom.value = this.value
						.format(this.valueFormat)
			},
			getValue : function(fmt) {
				if (typeof(fmt) == 'undefined')
					fmt = this.valueFormat;
				if (fmt.indexOf("q") != -1) {
					var m = Math.ceil(this.value.getMonth() / 3)
					fmt = fmt.replace((new RegExp("q", "ig")), m);
				}
				return (fmt) ? this.value.format(fmt) : this.value;
			}

			/**
			 * Returns true if this component is visible
			 * 
			 * @return {boolean}
			 */
			,
			isVisible : function() {
				return this.combos[0].isVisible();
			}

			/*******************************************************************
			 * @param {String}
			 *            val Value to set Sets the value of this field
			 */
			,
			setValue : function(date, updateBox) {

				if (!date) {
					date = new Date();
				} else if (!(date instanceof Date)) {
					try {

						if (typeof(date) == 'object')
							date = this.valueFormat === "Y" ? (date.value.match(/^(\w+)(?:.01){2}/) && date.value.match(/^(\w+)(?:.01){2}/)[1] || date.value) :date.value;
						if (date)
							date = Date.parseDate(date, this.valueFormat);
						else
							date = new Date();
					} catch (e) {
						date = new Date();
					}
				}

				if (this.rendered && updateBox != false) {
					this.hiddenField.dom.value = date.format(this.valueFormat);
					for (var i = 0; i < this.pattern.length; i++) {
						var c = this.pattern.charAt(i);
						var val = this.set[c][7].call(date);
						this.combos[i].setValue(val);
					}
				}
				this.value = date;
			}

			/**
			 * @return {Boolean} true = valid, false = invalid callse valiDate
			 *         methods of DateField
			 */
			,
			getRawValue : Ext.emptyFn,
			validateValue : function() {
				return true;
			},
			getCombos : function() {
				return this.combos;
			},
			initValue : Ext.emptyFn

		});

// register xtype
Ext.reg('calendar', Ext.ux.Calendar);