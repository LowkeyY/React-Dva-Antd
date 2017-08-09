
Ext.namespace('lib.tristate');
lib.tristate.TriCheckbox = Ext.extend(Ext.form.Checkbox, {
	valueList : [null, false, true],
	stateClassList : ["x-checkbox-undef", null, "x-checkbox-checked"],
	overClass : "x-form-check-over",
	clickClass : "x-form-check-down",
	triState : true,
	defaultAutoCreate : {
		tag : "input",
		type : "hidden",
		autocomplete : "off"
	},
	initComponent : function() {
		this.value = this.checked;
		lib.tristate.TriCheckbox.superclass.initComponent.apply(this, arguments);
		this.vList = this.valueList.slice(0);
		this.cList = this.stateClassList.slice(0);
		if (this.triState !== true) {
			this.vList.shift();
			this.cList.shift()
		}
		if (this.overCls !== undefined) {
			this.overClass = this.overCls;
			delete this.overCls
		}
		this.value = this.normalizeValue(this.value)
	},
	onRender : function(ct, position) {
		Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
		this.innerWrap = this.el.wrap({
					tag : "span",
					cls : "x-form-check-innerwrap"
				});
		this.wrap = this.innerWrap.wrap({
					cls : "x-form-check-wrap"
				});
		this.currCls = this.getCls(this.value);
		this.wrap.addClass(this.currCls);
		if (this.clickClass && !this.disabled && !this.readOnly) {
			this.innerWrap.addClassOnClick(this.clickClass)
		}
		if (this.overClass && !this.disabled && !this.readOnly) {
			this.innerWrap.addClassOnOver(this.overClass)
		}
		this.imageEl = this.innerWrap.createChild({
					tag : "img",
					src : Ext.BLANK_IMAGE_URL,
					cls : "x-form-tscheckbox"
				}, this.el);
		if (this.fieldClass) {
			this.imageEl.addClass(this.fieldClass)
		}
		if (this.boxLabel) {
			this.innerWrap.createChild({
						tag : "label",
						htmlFor : this.el.id,
						cls : "x-form-cb-label",
						html : this.boxLabel
					})
		}
		if (Ext.isIE) {
			this.wrap.repaint()
		}
		this.resizeEl = this.positionEl = this.wrap
	},
	onResize : function() {
		Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
		if (!this.boxLabel && !this.fieldLabel && this.imageEl) {
			this.imageEl.alignTo(this.wrap, "c-c")
		}
	},
	initEvents : function() {
		Ext.form.Checkbox.superclass.initEvents.call(this);
		this.mon(this.innerWrap, {
					scope : this,
					click : this.onClick
				})
	},
	onClick : function() {
		if (!this.disabled && !this.readOnly) {
			this.setValue(this.vList[(this.vList.indexOf(this.value) + 1)
					% this.vList.length])
		}
	},
	getValue : function() {
		return this.value
	},
	setValue : function(v) {
		var value = this.value;
		this.value = this.normalizeValue(v);
		if (this.rendered) {
			this.el.dom.value = this.value
		}
		if (value !== this.value) {
			this.updateView();
			this.fireEvent("check", this, this.value);
			if (this.handler) {
				this.handler.call(this.scope || this, this, this.value)
			}
		}
		return this
	},
	normalizeValue : function(v) {
		return (v === null || v === undefined) && this.triState
				? null
				: (v === true || (["true", "yes", "on", "1"]).indexOf(String(v)
						.toLowerCase()) != -1)
	},
	getCls : function(v) {
		var idx = this.vList.indexOf(this.value);
		return idx > -1 ? this.cList[idx] : undefined
	},
	updateView : function() {
		var cls = this.getCls(this.value);
		if (!this.wrap || cls === undefined) {
			return
		}
		this.wrap.replaceClass(this.currCls, cls);
		this.currCls = cls
	}
});
Ext.reg("tricheckbox", lib.tristate.TriCheckbox);