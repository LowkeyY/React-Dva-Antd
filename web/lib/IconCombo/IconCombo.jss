

Ext.namespace('lib.IconCombo');
/**
 * 在下拉列表的每行之前显示图标.
 * */
lib.IconCombo.IconCombo = Ext.extend(Ext.form.ComboBox, {
	initComponent : function() {
		this.iconWidth = this.iconWidth || 16;
		var iw = this.iconWidth;
		if (!Ext.util.CSS.getRule('ux-icon-combo-icon-' + iw)) {
			var css = '.ux-icon-combo-icon-'
					+ iw
					+ ' {background-repeat: no-repeat;background-position: 0 50%;width: '
					+ (iw + 2)
					+ 'px;height: 15px;}'
					+ '.ux-icon-combo-input-'
					+ iw
					+ ' {padding-left: '
					+ (iw + 9)
					+ 'px;}'
					+ '.x-form-field-wrap .ux-icon-combo-icon-'
					+ iw
					+ ' {top: 4px;left: 4px;}'
					+ '.ux-icon-combo-item-'
					+ iw
					+ ' {background-repeat: no-repeat ! important;background-position: 2px 50% ! important;padding-left: '
					+ (iw + 8) + 'px ! important;height: 17px;}';
			Ext.util.CSS.createStyleSheet(css, 'ux-IconCombo-css-' + iw);
		}
		this.iconClsTpl = this.iconClsTpl || ('{' + this.iconClsField + '}');
		Ext.apply(this, {
					tpl : '<tpl for=".">'
							+ '<div class="x-combo-list-item ux-icon-combo-item-'
							+ iw + ' ' + this.iconClsTpl + '">' + '{'
							+ this.displayField + '}' + '</div></tpl>'
				});

		this.iconClsTpl = new Ext.Template(this.iconClsTpl);
		lib.IconCombo.IconCombo.superclass.initComponent.apply(this, arguments);
	},
	onRender : function(ct, position) {
		lib.IconCombo.IconCombo.superclass.onRender.apply(this, arguments);
		this.wrap.applyStyles({
					position : 'relative'
				});
		this.el.addClass('ux-icon-combo-input-' + this.iconWidth);
		this.icon = Ext.DomHelper.append(this.el.up('div.x-form-field-wrap'), {
					tag : 'div',
					style : 'position:absolute'
				});
	},
	afterRender : function() {
		lib.IconCombo.IconCombo.superclass.afterRender.apply(this, arguments);
		if (undefined !== this.value) {
			this.setValue(this.value);
		}
	},
	setIconCls : function() {
		var rec = this.store.query(this.valueField || this.displayField,
				this.getValue()).itemAt(0);
		if (rec && this.icon) {
			this.icon.className = 'ux-icon-combo-icon-' + this.iconWidth + ' '
					+ this.iconClsTpl.apply(rec.data);
		}
	},
	reset : function(value) {
		lib.IconCombo.IconCombo.superclass.reset.apply(this, arguments);
		this.icon.className = '';
	},
	beforeBlur : Ext.emptyFn,
	setValue : function(value) {
		lib.IconCombo.IconCombo.superclass.setValue.call(this, value);
		this.setIconCls();
	}
});
Ext.reg('iconcombo', lib.IconCombo.IconCombo);