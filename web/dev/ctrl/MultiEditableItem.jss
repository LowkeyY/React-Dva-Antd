Ext.namespace("dev.ctrl");
dev.ctrl.MultiEditableItem = Ext.extend(Ext.menu.BaseItem, {
	itemCls : "x-menu-item",
	hideOnClick : false,
	singleRow:true,
	initComponent : function() {
		this.addEvents({
					keyup : true
				});
		this.editors = this.editors || [new Ext.form.TextField()];
		if (this.values) {
			this.setValue(this.values);
			delete this.values;
		}
	},

	onRender : function(container) {
		var s = container.createChild({
			cls : this.itemCls,
			html : '<img src="'
					+ this.menuIcon
					+ '" class="x-menu-item-icon" style="margin: 3px 12px 2px 2px;float:left;" />'
		});

		this.el = s;
		for (var i = 0; i < this.editors.length; i++) {
			this.editors[i].render(s);
			this.relayEvents(this.editors[i].el, ["keyup"]);
		}
		if(this.singleRow===true){//有问题,田宙
			var cur=s.first();
			while(cur!=null){
				cur.setStyle("float", "left");
				cur=cur.next();
			}
		}
		if (Ext.isGecko)
			s.setStyle('overflow', 'auto');

		dev.ctrl.MultiEditableItem.superclass.onRender.apply(this, arguments);
	},

	getValue : function() {
		var result = new Array();
		for (var i = 0; i < this.editors.length; i++) {
			if (typeof(this.editors[i].getValue) != 'undefined') {
				result.push(this.editors[i].getValue());
			}
		}
		return result;
	},

	setValue : function(valueArray) {
		if (Ext.isArray(valueArray)) {
			var maxLen = Math.min(valueArray.length, this.editors.length);
			for (var i = 0; i < maxLen; i++) {
				if (typeof(this.editors[i].setValue) != 'undefined') {
					this.editors[i].setValue(valueArray[i]);
				}
			}
		}
	},

	isValid : function(preventMark) {
		var valid = true;
		for (var i = 0; valid && i < this.editors.length; i++) {
			valid = this.editors[i].isValid(preventMark);
		}
		return valid;
	}
});