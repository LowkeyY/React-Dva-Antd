Ext.ns('lib.TriggerDisplayField');

/**
 * 带有选择按钮的只读选框,必须覆盖onTriggerClick方法才能有点击效果
 */
lib.TriggerDisplayField.TriggerDisplayField = Ext.extend(Ext.form.TriggerField,
		{

			validationEvent : false,
			validateOnBlur : false,
			height : 17,
			defaultAutoCreate : {
				style : 'border:solid 1px #b5b8c8;height:17px;float:left;padding:2 0 1 3;overflow-y:auto;word-wrap:break-word;',
				tag : "div"
			},
			// private
			onResize : function(w, h) {
				Ext.form.TriggerField.superclass.onResize.call(this, w, h);
				var tw = this.getTriggerWidth();
				if (Ext.isNumber(w)) {
					this.el.setWidth(w - tw - 2);
				}
				this.wrap.setWidth(this.el.getWidth() + tw);
				this.wrap.setHeight(h);
				if(h)
					this.el.setHeight(h-2);
			},
			/**
			 * @cfg {String} fieldClass The default CSS class for the field
			 *      (defaults to <tt>"x-form-display-field"</tt>)
			 */
			fieldClass : "x-form-display-field",
			htmlEncode : false,
			triggerClass : "x-form-search-trigger iconpicker-trigger",

			// private
			initEvents : Ext.emptyFn,

			isValid : function() {
				return true;
			},
			// private
			onRender : function(ct, position) {
				lib.TriggerDisplayField.TriggerDisplayField.superclass.onRender
						.call(this, ct, position);
				//delete this.el.dom.name;
				this.el.dom.name = "";
				this.hid = this.wrap.createChild({
							tag : "input",
							type : "hidden",
							name : this.name
						});

			},
			setValue : function(v) {
				this.el.update(v);
			},
			validate : function() {
				return true;
			}

		});