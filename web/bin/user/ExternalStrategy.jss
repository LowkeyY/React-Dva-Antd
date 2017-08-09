using("lib.TriggerDisplayField.TriggerDisplayField");

bin.user.ExternalStrategy = Ext.extend(
		lib.TriggerDisplayField.TriggerDisplayField, {
			height : 48,
			setValue : function(v) {
				if (Ext.isObject(v)) {
					this.el.update(v.text);
					this.hid.dom.value = v.value
				} else {
					this.el.update(v);
					this.hid.dom.value = v
				}
			},
			getValue : function() {
				return this.hid.dom.value;
			},
			onDestroy : function() {
				if (this.win)
					this.win.destroy();
				bin.user.ExternalStrategy.superclass.onDestroy.call(this);
			},
			onTriggerClick : function() {
				if (!this.win) {
					this.createWindow();
				}
				this.syncValue();
				this.win.show();
			},
			syncValue : function() {
				if (this.win && this.win.inited) {
					var v = this.getValue();
					if (v.length > 0)
						Ext.each(v.split(","), function(v) {
									var node = this.tree.getNodeById(v);
									node.getUI().toggleCheck(true);
									node.attributes.checked = true;
								}, this)
				}
			},
			createWindow : function() {
				var root = new Ext.tree.AsyncTreeNode({
							text : '所有角色'.loc(),
							draggable : false,
							expanded : true,
							id : '0',
							icon : "/themes/icon/all/plugin.gif"
						});
				var loader = new Ext.tree.TreeLoader({
							dataUrl : '/bin/user/ExternalStrategy.jcp',
							requestMethod : "GET"
						});
				loader.on("load", function() {
							this.win.inited = true;
							this.tree.expandAll();
							this.syncValue();
						}, this);
				this.tree = new Ext.tree.TreePanel({
					animate : true,
					autoScroll : true,
					draggable : false,
					style : 'padding:0px 0px 0px 0px;',
					bodyStyle : 'padding:5px 0px 0px 5px;background-color:white;',
					containerScroll : true,
					root : root,
					loader : loader
				})
				this.win = new Ext.Window({
					title : '选择策略'.loc(),
					layout : 'fit',
					inited : false,
					width : 550,
					height : 350,
					closeAction : 'hide',
					plain : true,
					modal : true,
					border : false,
					items : this.tree,
					buttons : [{
						text : '确定'.loc(),
						scope : this,
						handler : function() {
							var v = {
								text : '',
								value : ''
							}
							for (var ck = this.tree.getChecked(), i = 0; i < ck.length; i++) {
								if (i > 0) {
									v.text += ",";
									v.value += ",";
								}
								v.text += ck[i].text;
								v.value += ck[i].id;
							}
							this.setValue(v);
							this.win.hide();
						}
					}, {
						text : '取消'.loc(),
						scope : this,
						handler : function() {
							this.win.hide();
						}
					}]
				});
			}

		});