Ext.namespace('lib.CascadeSelect');

lib.CascadeSelect.CascadeSelect = Ext.extend(Ext.form.ComboBox, {

			widgetId : null,
			displayField : "text",
			valueField : "value",
			typeAhead : false,
			autoSelect : false,
			storeConfig : false,
			
			
			editable : false,
			triggerAction : 'all',
			initComponent : function() {

				if (!this.hiddenName)
					this.hiddenName = this.name

				var param = this.findParentByType("form");
				param = (param) ? param.param : {};
				this.store = new Ext.data.JsonStore(Ext.apply({
							url : '/lib/CascadeSelect/CascadeSelect.jcp',
							root : 'items',
							baseParams : {
								objectId : this.widgetId
							},
							fields : ["text", "value"]
						},this.storeConfig||{}));
				// call parent initComponent
				lib.CascadeSelect.CascadeSelect.superclass.initComponent
						.call(this);
				this.store.on("load", function() {
							if (this.view)
								this.view.setWidth(this.width - 2);
						}, this);
				this.on("beforequery", function(qe) {
							var inputPanel = this.findParentBy(function(cmp) {
										return typeof(cmp.programType) != 'undefined';
									});
							if (!Ext.isEmpty(inputPanel) && typeof(inputPanel) == 'object'
									&& typeof(inputPanel.param) != 'undefined') {
								if (this.paramCache != inputPanel.paramCache)
									this.paramCache = qe.q = inputPanel.paramCache;
								var ppa = Ext.apply({}, inputPanel.param);
								delete ppa.objectId;
								Ext.apply(this.store.baseParams, ppa);
								qe.forceAll = true;
								qe.query=Ext.encode(ppa);
							}
						}, this)
			},
			onRender : function(ct, position) {
				this.listWidth = this.width;
				// this.width -= 17;
				lib.CascadeSelect.CascadeSelect.superclass.onRender.apply(this,
						arguments);
			},
			setValue : function(v, text) {
				if (!this.rendered) {
					this.value = v;
					return;
				}
				if (!text) {
					if (v instanceof Array) {
						v = {
							value : v[0],
							text : v[1]
						}
					}
					Ext.form.ComboBox.superclass.setValue.call(this, v);
				}
				lib.CascadeSelect.CascadeSelect.superclass.setValue.call(this,
						v);
			}
		});
// register xtype
Ext.reg('cascadeselect', lib.CascadeSelect.CascadeSelect);