Ext.namespace("lib.UnitField");

lib.UnitField.UnitField = Ext.extend(Ext.form.NumberField, {
	/**
	 * @cfg {String} triggerClass A CSS class to apply to the trigger
	 */
	/**
	 * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a
	 *      default element spec (defaults to {tag: "input", type: "text", size:
	 *      "16", autocomplete: "off"})
	 */
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		style : "float:left;border-right:none;",
		size : "16",
		autocomplete : "off"
	},
	selectedClass : 'x-combo-selected',
	/**
	 * @cfg {String} listClass CSS class to apply to the dropdown list element
	 *      (defaults to '')
	 */

	listClass : '',
	minListWidth : 30,
	/**
	 * @hide
	 * @method autoSize
	 */
	autoSize : Ext.emptyFn,
	// private
	unitHeight : 20,
	monitorTab : true,
	// private
	deferHeight : true,
	// private
	mimicing : false,
	// private
	list : false,
	convertible : true,
	// private
	background : "background: rgb(255, 255, 255) url(/Ext/resources/images/default/form/text-bg.gif) repeat-x scroll 0pt 0pt;",
	initComponent : function() {
		lib.UnitField.UnitField.superclass.initComponent.call(this);
		this.addEvents(
				/**
				 * @event expand Fires when the dropdown list is expanded
				 * @param {lib.UnitField.UnitField}
				 *            This box
				 */
				'expand',
				/**
				 * @event collapse Fires when the dropdown list is collapsed
				 * @param {lib.UnitField.UnitField}
				 *            This box
				 */
				'collapse',
				/**
				 * @event beforeselect Fires before a list item is selected.
				 *        Return false to cancel the selection.
				 * @param {lib.UnitField.UnitField}
				 *            This box
				 * @param {Ext.data.Record}
				 *            record The data record returned from the
				 *            underlying store
				 * @param {Number}
				 *            index The index of the selected item in the
				 *            dropdown list
				 */
				'beforeselect',
				/**
				 * @event select Fires when a list item is selected
				 * @param {lib.UnitField.UnitField}
				 *            This box
				 * @param {Ext.data.Record}
				 *            record The data record returned from the
				 *            underlying store
				 * @param {Number}
				 *            index The index of the selected item in the
				 *            dropdown list
				 */
				'select');
	},
	// private
	getFixedWidth : function() {
		if (!this.rendered)
			return 0;
		var tw = this.unitField.getWidth()
		if (this.convertible) {
			tw += this.trigger.getWidth();
		}
		return tw
	},
	// private
	setSize : function(w, h) {
		var tw = this.getFixedWidth();
		if (tw == 0) {
			this.setSize.defer(5, this, [w, h]);
			return;
		}
		if (Ext.isNumber(w)) {
			var adjustWidth = w - tw;
			if (Ext.isIE && !Ext.isStrict && this.inEditor) {
				adjustWidth -= 3;
			}
			this.el.setWidth(adjustWidth);
		}
		this.wrap.setWidth(w);
	},
	getWidth : function() {
		return (this.el.getWidth() + this.getFixedWidth());
	},
	// private
	alignErrorIcon : function() {
		if (this.wrap) {
			this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
		}
	},
	/**
	 * The function return currents unit id.
	 * 
	 * @method
	 * @param {}
	 * @return {int unitId}
	 * 
	 */
	getUnit : function() {
		return this.hiddenUnit.value;
	},
	getDefault : function() {
		if (WorkBench.unitSystem) {
			if (WorkBench.unitSystem == 'metric' && this.group.metricDefault) {
				return this.group.metricDefault
			} else if (WorkBench.unitSystem == 'imperial'
					&& this.group.imperialDefault) {
				return this.group.imperialDefault
			}
		}
		return this.unit || this.group.nativeUnit;
	},
	// private
	onRender : function(ct, position) {
		lib.UnitField.UnitField.superclass.onRender.call(this, ct, position);
		this.wrap = this.el.wrap({
					cls : "x-form-field-wrap"
				});
		var u = this.group.units
		this.convertible = (u.length > 1);
		var html = "";
		var n = this.getDefault();
		for (var i = 0; i < u.length; i++) {
			if (u[i][0] == n) {
				html = "(" + u[i][1].loc() + ")";
				break;
			}
		}

		this.unitField = this.wrap.createChild({
			tag : "div",
			style : "border-top: 1px solid rgb(181, 184, 200); border-bottom: 1px solid rgb(181, 184, 200); "
					+ this.background
					+ " border-right: 1px solid rgb(181, 184, 200); padding-right: 2px;float: left; height:"
					+ this.unitHeight + "px;",
			html : html
		});
		if (this.convertible) {
			this.trigger = this.wrap.createChild(this.triggerConfig || {
				tag : "img",
				src : Ext.BLANK_IMAGE_URL,
				cls : "x-form-trigger " + this.triggerClass,
				style : 'background:transparent url(/lib/UnitField/unit-trigger.gif) no-repeat 0 0;'
			});
			this.initTrigger();
		}
		this.hiddenUnit = this.wrap.createChild({
					tag : "input",
					type : "hidden",
					name : this.name + "_TZ_UNIT",
					value : n
				}).dom;
		if (!this.width) {
			this.wrap.setWidth(this.el.getWidth() + this.getFixedWidth());
		}
		this.resizeEl = this.positionEl = this.wrap;

	},

	/*
	 * afterRender : function() {
	 * lib.UnitField.UnitField.superclass.afterRender.call(this);
	 * this.el.setWidth(this.elOffset - this.unit.getWidth()); var y; if
	 * (Ext.isIE && this.el.getY() != (y = this.trigger.getY())) {
	 * this.el.position(); this.el.setY(y); } },
	 */

	// private
	initTrigger : function() {
		this.trigger.on("click", this.onTriggerClick, this, {
					preventDefault : true
				});
		this.trigger.addClassOnOver('x-form-trigger-over');
		this.trigger.addClassOnClick('x-form-trigger-click');
	},

	// private
	onDestroy : function() {
		if (this.trigger) {
			this.trigger.removeAllListeners();
			this.trigger.remove();
		}
		if (this.wrap) {
			this.wrap.remove();
		}
		lib.UnitField.UnitField.superclass.onDestroy.call(this);
	},

	// private
	onFocus : function() {
		this.hasFocus = true;
		lib.UnitField.UnitField.superclass.onFocus.call(this);
		if (!this.mimicing) {
			this.wrap.addClass('x-trigger-wrap-focus');
			this.mimicing = true;
			Ext.get(Ext.isIE ? document.body : document).on("mousedown",
					this.mimicBlur, this, {
						delay : 10
					});
			if (this.monitorTab) {
				this.el.on("keydown", this.checkTab, this);
			}
		}
	},

	// private
	checkTab : function(e) {
		if (e.getKey() == e.TAB) {
			this.triggerBlur();
		}
	},

	// private
	onBlur : function() {
		// do nothing
	},

	// private
	mimicBlur : function(e) {
		if (this.isDestroyed)
			return;
		if (!this.wrap.contains(e.target) && this.validateBlur(e)) {
			this.triggerBlur();
		}
	},

	// private
	triggerBlur : function() {
		if (this.isDestroyed)
			return;
		this.mimicing = false;
		Ext.get(Ext.isIE ? document.body : document).un("mousedown",
				this.mimicBlur, this);
		if (this.monitorTab) {
			this.el.un("keydown", this.checkTab, this);
		}
		this.beforeBlur();
		this.wrap.removeClass('x-trigger-wrap-focus');
		lib.UnitField.UnitField.superclass.onBlur.call(this);
	},

	beforeBlur : Ext.emptyFn,

	// private
	// This should be overriden by any subclass that needs to check whether or
	// not the field can be blurred.
	validateBlur : function(e) {
		return true;
	},

	// private
	onDisable : function() {
		lib.UnitField.UnitField.superclass.onDisable.call(this);
		if (this.wrap) {
			this.wrap.addClass(this.disabledClass);
			this.el.removeClass(this.disabledClass);
		}
	},

	// private
	onEnable : function() {
		lib.UnitField.UnitField.superclass.onEnable.call(this);
		if (this.wrap) {
			this.wrap.removeClass(this.disabledClass);
		}
	},

	// private
	onShow : function() {
		if (this.wrap) {
			this.wrap.dom.style.display = '';
			this.wrap.dom.style.visibility = 'visible';
		}
	},

	// private
	onHide : function() {
		this.wrap.dom.style.display = 'none';
	},

	/**
	 * The function that should handle the trigger's click event. This method
	 * does nothing by default until overridden by an implementing function.
	 * 
	 * @method
	 * @param {EventObject}
	 *            e
	 */
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		if (this.isExpanded()) {
			this.collapse();
		} else {
			this.expand();
		}
		this.el.focus();
	},
	/**
	 * Hides the dropdown list if it is currently expanded. Fires the
	 * {@link #collapse} event on completion.
	 */
	collapse : function() {
		if (!this.isExpanded()) {
			return;
		}
		this.list.hide();
		Ext.getDoc().un('mousewheel', this.collapseIf, this);
		Ext.getDoc().un('mousedown', this.collapseIf, this);
		this.fireEvent('collapse', this);
	},

	// private
	collapseIf : function(e) {
		if (!e.within(this.wrap) && !e.within(this.list)) {
			this.collapse();
		}
	},

	/**
	 * Expands the dropdown list if it is currently hidden. Fires the
	 * {@link #expand} event on completion.
	 */
	expand : function() {
		if (this.isExpanded()) {
			return;
		}
		if (this.list === false) {
			var cls = 'x-combo-list';
			this.list = new Ext.Layer({
						shadow : this.shadow,
						cls : [cls, this.listClass].join(' '),
						constrain : false
					});

			var lw = this.listWidth
					|| Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setWidth(lw);
			this.list.swallowEvent('mousewheel');
			this.innerList = this.list.createChild({
						cls : cls + '-inner'
					});
			this.innerList.on('mouseover', this.onViewOver, this);
			this.innerList.on('mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
			this.view = new Ext.DataView({
						applyTo : this.innerList,
						tpl : '<tpl for="."><div class="' + cls
								+ '-item">{text}</div></tpl>',
						singleSelect : true,
						selectedClass : this.selectedClass,
						itemSelector : this.itemSelector || '.' + cls + '-item'
					});
			this.view.on('click', this.onViewClick, this);
			this.store = new Ext.data.SimpleStore({
						fields : ["id", "text", "factor"],
						data : this.group.units
					});
			this.view.setStore(this.store);

		}
		this.list.alignTo(this.el, "tl-bl?");
		this.list.show();
		this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
		Ext.getDoc().on('mousewheel', this.collapseIf, this);
		Ext.getDoc().on('mousedown', this.collapseIf, this);
		this.fireEvent('expand', this);
	},
	/**
	 * Returns true if the dropdown list is expanded, else false.
	 */
	isExpanded : function() {
		return this.list && this.list.isVisible();
	}, // private
	onViewMove : function(e, t) {
		this.inKeyMode = false;
	},
	// private
	onViewOver : function(e, t) {
		if (this.inKeyMode) { // prevent key nav and mouse over conflicts
			return;
		}
		var item = this.view.findItemFromChild(t);
		if (item) {
			var index = this.view.indexOf(item);
			this.select(index, false);
		}
	},

	/**
	 * Select an item in the dropdown list by its numeric index in the list.
	 * This function does NOT cause the select event to fire. The store must be
	 * loaded and the list expanded for this function to work, otherwise use
	 * setValue.
	 * 
	 * @param {Number}
	 *            index The zero-based index of the list item to select
	 * @param {Boolean}
	 *            scrollIntoView False to prevent the dropdown list from
	 *            autoscrolling to display the selected item if it is not
	 *            currently in view (defaults to true)
	 */
	select : function(index, scrollIntoView) {
		this.selectedIndex = index;
		this.view.select(index);
		if (scrollIntoView !== false) {
			var el = this.view.getNode(index);
			if (el) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	// private
	reset : function() {
		var n = this.getDefault();
		if (this.getUnit() != n) {
			var u = this.group.units
			for (var i = 0; i < u.length; i++) {
				if (u[i][0] == n) {
					this.setUnitTitle(u[i][1]);
					this.hiddenUnit.value = u[i][0];
					break;
				}
			}
		}
		lib.UnitField.UnitField.superclass.reset.call(this);

	},
	setUnitTitle : function(text) {
		this.unitField.dom.innerHTML = "(" + text.loc() + ")";
		this.el.setWidth(this.wrap.getWidth() - this.getFixedWidth());
	},
	onViewClick : function(doFocus) {
		var index = this.view.getSelectedIndexes()[0];
		var r = this.store.getAt(index);
		if (r) {
			if (this.fireEvent('beforeselect', this, r, index) !== false) {
				this.setUnitTitle(r.data.text);
				this.collapse();
				this.fireEvent('select', this, r, index);
				this.hiddenUnit.value = r.data.id;
			}
		}
	}
		/**
		 * @cfg {Boolean} grow
		 * @hide
		 */
		/**
		 * @cfg {Number} growMin
		 * @hide
		 */
		/**
		 * @cfg {Number} growMax
		 * @hide
		 */
});
lib.UnitField.UnitView = Ext.extend(lib.UnitField.UnitField, {
	// private
	unitHeight : 21,
	background : "background: rgb(255, 255, 255);",
	/**
	 * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a
	 *      default element spec (defaults to {tag: "input", type: "text", size:
	 *      "16", autocomplete: "off"})
	 */
	defaultAutoCreate : {
		tag : "div",
		style : "border-top: 1px solid rgb(181, 184, 200); border-bottom: 1px solid rgb(181, 184, 200); background-color:rgb(255, 255, 255); border-left: 1px solid rgb(181, 184, 200); padding-left: 5px;padding-top: 1px;float: left; height: 20px;border-right:none;",
		html : '&nbsp;'
	},
	onRender : function(ct, position) {
		lib.UnitField.UnitView.superclass.onRender.call(this, ct, position);
		this.el.dom.removeAttribute('name');
		this.hiddenValue = this.wrap.createChild({
					tag : "input",
					type : "hidden",
					name : this.name,
					value : this.value
				}).dom;
	},
	initComponent : function() {
		lib.UnitField.UnitView.superclass.initComponent.call(this);
		this.group.getUnit = function(id) {
			for (var i = 0; i < this.units.length; i++) {
				if (this.units[i][0] == id) {
					return this.units[i];
				}
			}
			return null;
		}
		Ext.applyIf(this.group, this.groupTempLate);
	},
	getFactor : function(sourceId, targetId) {

		if (sourceId == targetId || this.group.nativeUnit == null)
			return 1;
		var source = this.group.getUnit(sourceId);
		var target = this.group.getUnit(targetId);
		if (source == null || target == null) {
			return 0;
		} else if (sourceId == this.group.nativeUnit) {
			return 1 / target[2];
		} else if (targetId == this.group.nativeUnit) {
			return source[2];
		} else {
			return source[2] / target[2];
		}
	},
	afterRender : function() {
		lib.UnitField.UnitView.superclass.afterRender.call(this);
		this.on("select", function(cb, r, index) {
					var v = this.getValue();
					if (v != "") {
						v = this.convertTo(this.getUnit(), this.unit, v);
						this.hiddenUnit.value = r.data.id;
						this.setValue(v);
					}
				}, this)
	},
	getValue : function() {
		return this.value;
	},
	validateValue : function() {
		return true;
	},
	setValue : function(v) {
		if (!Ext.isDefined(v))
			return;
		v = this.convertTo(this.unit, this.getUnit(), v);
		this.value = v;
		this.el.dom.innerHTML = v;
		this.hiddenValue.value = v;
	},
	initValue : function() {
		if (this.value !== undefined) {
			this.setValue(this.value);
		}
	},
	convertTo : function(sourceId, targetId, value) {
		return this.fixPrecision(value * this.getFactor(sourceId, targetId));
	}
});
Ext.reg('unitview', lib.UnitField.UnitView);
Ext.reg('unitfield', lib.UnitField.UnitField);