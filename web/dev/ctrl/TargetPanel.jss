Ext.namespace('dev.ctrl');

dev.ctrl.TargetPanel = Ext.extend(Ext.Panel, {

	parentPanel : false,
	renderTo : false,
	value : false,
	defaultStates : [['0', '无动作'.loc()], ['1', '弹出窗口'.loc()],
			['2', '选择窗口'.loc()]],

	// private
	rawValue : ["0", "", "", "", "", "", "", "", "", ""],
	leftPanel : null,
	rightPanel : null,
	objectId : false,
	layout : 'column',
	expanded : false,
	border : false,
	targetType : false,

	isShowUPDOWN : false,
	initComponent : function() {
		if (!this.value)
			this.value = this.rawValue.slice();
		this.leftPanel = new Ext.Panel({
					columnWidth : 0.50,
					layout : 'form',
					border : false
				});
		this.rightPanel = new Ext.Panel({
					columnWidth : 0.50,
					layout : 'form',
					border : false
				});
		this.items = [this.leftPanel, this.rightPanel];
		dev.ctrl.TargetPanel.superclass.initComponent.call(this);
	},

	hidePanel : function() {
		this.hide();
		this.expanded = false;
	},

	showPanel : function(objectId, targetType) {
		if (objectId != this.objectId || this.targetType != targetType) {
			this.objectId = objectId;
			this.targetType = targetType;
			Ext.Ajax.request({
				url : '/dev/ctrl/TargetPanel.jcp',
				params : {
					objectId : objectId,
					targetType : targetType
				},
				scope : this,
				method : 'PUT',
				callback : function(options, success, response) {
					var o = Ext.decode(response.responseText);
					if (!success || !o.success) {
						Ext.msg("error", '提取模块数据发生未知错误.'.loc());
						return;
					}

					this.reCreateItems(o);
					if (!this.rendered) {
						this.hidden = false;
						if (this.renderTo) {
							this.render(this.renderTo);
						} else {
							var p = Ext
									.getCmp(typeof(this.parentPanel) == 'object'
											? this.parentPanel.id
											: this.parentPanel)
									|| this.parentPanel;
							p.add(this);
							p.doLayout();
						}
					} else {
						this.show();
						this.syncSize();
					}
					this.syncValue();
				}
			});
		} else {
			this.show();
			this.syncValue();
		}
		this.expanded = true;
	},

	reCreateItems : function(json) {
		if (this.leftPanel.items) {
			var destroy = function(item) {
				this.remove(item, true)
			}
			this.items.each(destroy, this);
			this.leftPanel = new Ext.Panel({
						columnWidth : 0.5,
						layout : 'form',
						border : false
					});
			this.rightPanel = new Ext.Panel({
						columnWidth : 0.5,
						layout : 'form',
						border : false
					});
			this.add(this.leftPanel);
			this.add(this.rightPanel);
		}
		var action = [['', '无操作'.loc()]];
		if (this.targetType == 1) {
			this.addItemPare(9, '选择控件'.loc(), json.prg1, action);
		} else {
			switch (json.modType) {
				case 1 :
					this.addItemPare(8, '本窗口'.loc(), json.prg23, action);
					break;
				case 2 :
					this.addItemPare(6, '左框架'.loc(), json.prg24, action);
					this.addItemPare(7, '右框架'.loc(), json.prg25, action);
					break;
				case 3 :
					this.addItemPare(4, '上框架'.loc(), json.prg26, action);
					this.addItemPare(5, '下框架'.loc(), json.prg27, action);
					break;
				case 4 :
					this.addItemPare(1, '左框架'.loc(), json.prg24, action);
					this.addItemPare(2, '右上框架'.loc(), json.prg26, action);
					this.addItemPare(3, '右下框架'.loc(), json.prg27, action);
					break;
			}
		}
		if (this.rendered)
			this.doLayout();
	},

	addItemPare : function(level, title, dataLeft, dataRight, valueLeft,
			valueRight) {
		var leftCombo = this.createCombo(title, dataLeft, valueLeft || '-1',
				level);
		var rightCombo = this.createCombo('操作'.loc(), dataRight, valueRight
						|| '');
		leftCombo.on("select", function(combo) {
			var rec = combo.store.find('value', combo.getValue());
			if (rec != -1) {
				rec = combo.store.getAt(rec).data.right;

				if (Ext.isArray(rec)) {
					rightCombo.store.loadData(rec);
					rightCombo.setValue(rec[0][0]);
				} else {

					if (!this.isShowUPDOWN) {
						var action = [['', '无操作'.loc()]];
						if (Ext.isDefined(rec.prg26)) {
							this.addItemPare(4, '上框架'.loc(), rec.prg26, action);
							this.addItemPare(5, '下框架'.loc(), rec.prg27, action);
						} else {
							this.addItemPare(6, '左框架'.loc(), rec.prg24, action);
							this.addItemPare(7, '右框架'.loc(), rec.prg25, action);
						}
						if (this.rendered) {
							this.doLayout();
							this.setHeight(110);
						}
						this.isShowUPDOWN = true;
						var r4 = rec.stat;
						rightCombo.store.loadData(r4);
						rightCombo.setValue(r4[0][0]);
					}
				}
			}
		}, this)
		this.leftPanel.add(leftCombo);
		this.rightPanel.add(rightCombo);
	},

	createCombo : function(label, data, cvalue, level) {
		return new Ext.form.ComboBox({
					fieldLabel : label,
					store : new Ext.data.SimpleStore({
								fields : (level)
										? ['value', 'text', 'right']
										: ['value', 'text'],
								data : data
							}),
					msgTarget : 'qtip',
					value : cvalue,
					valueField : 'value',
					displayField : 'text',
					listWidth : 150,
					triggerAction : 'all',
					mode : 'local',
					level : level
				})
	},

	getFirstCombo : function() {
		if (!this.firstCombo) {
			this.firstCombo = this.createCombo('目标操作'.loc(),
					this.defaultStates, this.value[0]);
			this.firstCombo.on("select", function(combo, rec, index) {
						this.value[0] = rec.data.value;
						for (var i = 1; i < this.value.length; i++) {
							this.value[i] = "";
						}
						this.setValue(this.value, this.objectId);
					}, this)
		}
		return this.firstCombo;
	},

	setValue : function(arr, objectId) {
		if (!objectId)
			objectId = this.objectId;
		if (!(arr instanceof Array) || arr.length != 10)
			arr = this.rawValue.slice();
		this.value = arr;
		if (this.firstCombo) {
			this.firstCombo.setValue(arr[0]);
		}
		if (arr[0] == '0') {
			if (this.expanded) {
				this.hidePanel();
			}
		} else {
			this.showPanel(objectId, arr[0]);
		}
	},

	itemsAt : function(num) {
		return [this.leftPanel.items.items[num],
				this.rightPanel.items.items[num]];
	},

	syncValue : function() {
		var ret = this.value;
		var total = this.leftPanel.items.getCount();
		var prgs = ret[1].split(",");
		var stats = ret[2].split(":");
		if (prgs.length + 1 > total)
			total = prgs.length + 1;
		/*
		 * for (var i = 0, j = 0; i < prgs.length+1; i++) { var combos =
		 * this.itemsAt(i); if ((ret[6].indexOf(combos[0].level) != -1|| ret[0] ==
		 * "1")&& i<=prgs.length) { combos[0].setValue(prgs[j]);
		 * combos[0].fireEvent("select", combos[0]);
		 * combos[1].setValue(stats[j]); j++; } else { combos[0].setValue('-1');
		 * combos[0].fireEvent("select", combos[0]); } }
		 */
		for (var i = 0, j = 0; i < total; i++) {
			var combos = this.itemsAt(i);
			if (combos[0]) {
				if ((ret[6].indexOf(combos[0].level) != -1 || ret[0] == "1")
						&& i <= prgs.length) {
					combos[0].setValue(prgs[j]);
					combos[0].fireEvent("select", combos[0]);
					combos[1].setValue(stats[j]);
					j++;
				} else {
					combos[0].setValue('-1');
					combos[0].fireEvent("select", combos[0]);
				}
			}
		}
	},

	getValue : function() {
		if (!this.rendered || !this.firstCombo)
			return this.value;
		var ret = this.rawValue.slice();
		ret[0] = this.firstCombo.getValue();
		switch (ret[0] * 1) {
			case 0 :
				break;
			case 1 :
				var combos = this.itemsAt(0);
				if (combos[0].getValue() == '-1') {
					ret[0] = 0;
					break;
				}
			case 2 :
				var total = this.leftPanel.items.getCount();
				for (var i = 0; i < total; i++) {
					var combos = this.itemsAt(i);
					var cval = combos[0].getValue();
					if (cval != '-1') {
						ret[1] += cval + ",";
						ret[2] += combos[1].getValue() + ":";
						ret[5] += combos[1].getText() + "<br>";
						ret[4] += combos[0].fieldLabel + ":"
								+ combos[1].getText() + "<br>";
						ret[6] += combos[0].level + ",";
					}
				}
				if (ret[1] != "") {
					ret[1] = ret[1].substring(0, ret[1].length - 1);
					ret[2] = ret[2].substring(0, ret[2].length - 1);
					ret[4] = ret[4].substring(0, ret[4].length - 4);
					ret[5] = ret[5].substring(0, ret[5].length - 4);
					ret[6] = ret[6].substring(0, ret[6].length - 1);
				} else {
					ret = this.rawValue.slice();
				}
				break;
		}
		return ret;
	}
});
