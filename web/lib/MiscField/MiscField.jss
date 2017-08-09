
Ext.namespace("lib.MiscField");
lib.MiscField.MiscField = function(config) {
	lib.MiscField.MiscField.superclass.constructor.call(this, config)
};
Ext.extend(lib.MiscField.MiscField, Ext.BoxComponent, {
			defaultAutoCreate : {
				tag : "div"
			},
			fieldClass : "x-form-field",
			isFormField : true,
			value : undefined,
			disableReset : false,
			initComponent : function() {
				lib.MiscField.MiscField.superclass.initComponent.call(this)
			},
			getName : function() {
				return this.rendered && this.el.dom.name
						? this.el.dom.name
						: (this.hiddenName || "")
			},
			onRender : function(ct, position) {
				lib.MiscField.MiscField.superclass.onRender.call(this, ct, position);
				if (!this.el) {
					var cfg = this.getAutoCreate();
					if (!cfg.name) {
						cfg.name = this.name || this.id
					}
					this.el = ct.createChild(cfg, position)
				}
				this.el.addClass([this.fieldClass, this.cls]);
				this.initValue()
			},
			initValue : function() {
				if (this.value !== undefined) {
					this.setRawValue(this.value)
				} else {
					if (this.el.dom.innerHTML.length > 0) {
						this.setRawValue(this.el.dom.innerHTML)
					}
				}
			},
			isDirty : function() {
				return String(this.getRawValue()) !== String(this.originalValue)
			},
			afterRender : function() {
				lib.MiscField.MiscField.superclass.afterRender.call(this);
				this.initEvents()
			},
			reset : function(force) {
				if (!this.disableReset || force === true) {
					this.setRawValue(this.originalValue)
				}
			},
			initEvents : function() {
				this.originalValue = this.getRawValue()
			},
			isValid : function() {
				return true
			},
			validate : function() {
				return true
			},
			processValue : function(value) {
				return value
			},
			validateValue : function(value) {
				return true
			},
			markInvalid : function() {
				return
			},
			clearInvalid : function() {
				return
			},
			getRawValue : function() {
				return this.el.dom.innerHTML
			},
			getValue : function() {
				var f = Ext.util.Format;
				var v = f.trim(f.stripTags(this.getRawValue()));
				return v
			},
			setRawValue : function(v) {
				this.value = v;
				if (this.rendered) {
					this.el.dom.innerHTML = v
				}
			},
			setValue : function(v) {
				var f = Ext.util.Format;
				this.setRawValue(f.trim(f.stripTags(v)))
			}
		});
Ext.ComponentMgr.registerType("miscfield", lib.MiscField.MiscField);