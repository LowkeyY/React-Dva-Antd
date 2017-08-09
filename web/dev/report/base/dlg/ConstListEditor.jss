Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");

dev.report.base.dlg.ConstListEditor = Ext.extend(Ext.Panel, {
	imgPath : "/dev/report/res/img/rt/",
	cmnImgPath : "/dev/report/res/img/palo/",
	width : 350,
	height : 255,
	border : "1px solid",
	tabOffset : 0,
	initComponent : function() {
		var that = this;
		Ext.apply(this, {
					layout : "absolute"
				});
		ConstListEditor.superclass.initComponent.call(this);
		var ConstListDataViewClass = Ext.extend(Ext.DataView, {
					focusedClass : "x-view-focused",
					focusEl : true,
					afterRender : function() {
						ConstListDataViewClass.superclass.afterRender
								.call(this);
						var that = this;
						if (this.singleSelect || this.multiSelect) {
							if (this.focusEl === true) {
								this.focusEl = this.el.parent().parent()
										.createChild({
													tag : "a",
													href : "#",
													cls : "x-view-focus",
													tabIndex : "-1"
												});
								this.focusEl.insertBefore(this.el.parent());
								this.focusEl.swallowEvent("click", true);
								this.renderedFocusEl = true
							} else {
								if (this.focusEl) {
									this.focusEl = Ext.get(this.focusEl)
								}
							}
							if (this.focusEl) {
								this.keyNav = new Ext.KeyNav(this.focusEl, {
											enter : function() {
												if (that.events.onkeyenter) {
													that.events.onkeyenter
															.fire()
												}
											},
											scope : this,
											forceKeyDown : true
										})
							}
						}
					},
					onClick : function(e) {
						var item = e.getTarget(this.itemSelector, this.el);
						if (item) {
							var index = this.indexOf(item);
							if (this.onItemClick(item, index, e) !== false) {
								this.fireEvent("click", this, index, item, e);
								this.retainFocus()
							}
						} else {
							if (this.fireEvent("containerclick", this, e) !== false) {
								this.clearSelections();
								this.retainFocus()
							}
						}
					},
					retainFocus : function() {
						if (this.focusEl) {
							this.focusEl.focus()
						}
					},
					doRetainFocus : function() {
						this.focusEl.focus()
					}
				});
		var ConstInlineEditor = function(cfg, field) {
			ConstInlineEditor.superclass.constructor.call(this, field
							|| new Ext.form.TextField({
										allowBlank : true,
										growMin : 290,
										growMax : 290,
										grow : true,
										selectOnFocus : true
									}), cfg)
		};
		Ext.extend(ConstInlineEditor, Ext.Editor, {
			id : "wCListEditor_input_txt",
			alignment : "tl-tl",
			hideEl : false,
			cls : "x-small-editor",
			shim : false,
			completeOnEnter : true,
			cancelOnEsc : true,
			init : function(view) {
				this.view = view;
				view.on("render", this.initEditor, this)
			},
			initEditor : function() {
				this.view.getEl().on("dblclick", this.onDblClick, this, {
							delegate : this.labelSelector
						})
			},
			onDblClick : function(e, target) {
				if (!this.disabled && !e.ctrlKey && !e.shiftKey) {
					var item = this.view.findItemFromChild(target);
					e.stopEvent();
					var record = this.view.store.getAt(this.view.indexOf(item));
					this.startEdit(target, record.data[this.dataIndex]);
					this.activeRecord = record
				} else {
					e.preventDefault()
				}
			}
		});
		var ConstRecord = new Ext.data.Record.create([{
					name : "name"
				}]);
		var storeConsts = new Ext.data.SimpleStore({
					fields : [{
								name : "name"
							}]
				});
		this.setList = function(list) {
			storeConsts.removeAll();
			if (list && (list.constructor.toString().indexOf("Array") != -1)) {
				var listSize = list.length;
				for (var i = 0; i < listSize; i++) {
					storeConsts.add(new ConstRecord({
								name : this.list[i]
							}))
				}
			}
		};
		this.getList = function() {
			var retList = [];
			var storeSize = storeConsts.getCount();
			for (var i = 0; i < storeSize; i++) {
				retList.push(storeConsts.getAt(i).get("name"))
			}
			return retList
		};
		if (this.list) {
			this.setList(this.list)
		}
		var ciePlugin = new ConstInlineEditor({
					dataIndex : "name",
					labelSelector : "div.row-const-list-selector",
					listeners : {
						beforecomplete : function(thisEd, value, startValue) {
							if (value && (value != "")) {
								thisEd.activeRecord
										.set(thisEd.dataIndex, value)
							} else {
								if (value == "") {
									thisEd.activeRecord.store
											.remove(thisEd.activeRecord)
								}
							}
						},
						complete : function() {
							viewConsts.retainFocus()
						},
						canceledit : function(thisEd, value, startValue) {
							if (startValue == "New Constant".localize()) {
								thisEd.activeRecord.store
										.remove(thisEd.activeRecord)
							}
						}
					}
				});
		var viewConsts = new ConstListDataViewClass({
			id : "wCLE_constList_dv",
			itemSelector : "div.row-const-list-selector",
			style : "overflow:auto;",
			multiSelect : true,
			store : storeConsts,
			cls : "cleDataViewSelect",
			plugins : [ciePlugin],
			tpl : new Ext.XTemplate(
					'<tpl for=".">',
					'<div class="row-const-list-selector" style="cursor:pointer;line-height:18px;">',
					"<span>&#160;{name}</span>", "</div>", "</tpl>")
		});
		var panel_viewConsts = new Ext.Panel({
					layout : "fit",
					style : "border:1px solid;",
					bodyStyle : "background-color:white;",
					items : [viewConsts]
				});
		var topBtnHandler = function() {
			var storeSize = storeConsts.getCount();
			var numOfSelectedConsts = viewConsts.getSelectionCount();
			for (var tmpRec, i = 0, j = 0; i < storeSize; i++) {
				if (viewConsts.isSelected(viewConsts.getNode(i))) {
					tmpRec = storeConsts.getAt(i);
					storeConsts.remove(tmpRec);
					storeConsts.insert(j, tmpRec);
					j++
				}
			}
			if (numOfSelectedConsts > 0) {
				var selIndexes = [];
				for (var i = 0; i < numOfSelectedConsts; i++) {
					selIndexes.push(i)
				}
				viewConsts.select(selIndexes);
				var firstNode = viewConsts.getNode(0);
				firstNode.scrollIntoView(viewConsts.body, false)
			}
		};
		var upBtnHandler = function() {
			var tmpElem;
			var tmpSelectedIds = viewConsts.getSelectedIndexes();
			var storeSize = storeConsts.getCount();
			for (var i = 1; i < storeSize; i++) {
				if (viewConsts.isSelected(viewConsts.getNode(i))) {
					if (!viewConsts.isSelected(viewConsts.getNode(i - 1))) {
						tmpElem = storeConsts.getAt(i);
						storeConsts.remove(tmpElem);
						storeConsts.insert(i - 1, tmpElem);
						for (var j = 0; j < tmpSelectedIds.length; j++) {
							if (tmpSelectedIds[j] == i) {
								tmpSelectedIds[j] = i - 1;
								break
							}
						}
						viewConsts.select(tmpSelectedIds)
					}
				}
			}
			for (var tmpNode, i = 0; i < storeSize; i++) {
				tmpNode = viewConsts.getNode(i);
				if (viewConsts.isSelected(tmpNode)) {
					tmpNode.scrollIntoView(viewConsts.body, false);
					break
				}
			}
		};
		var downBtnHandler = function() {
			var tmpSelectedIds = viewConsts.getSelectedIndexes();
			var storeSize = storeConsts.getCount();
			for (var tmpElem, i = (storeSize - 2); i >= 0; i--) {
				if (viewConsts.isSelected(viewConsts.getNode(i))) {
					if (!viewConsts.isSelected(viewConsts.getNode(i + 1))) {
						tmpElem = storeConsts.getAt(i);
						storeConsts.remove(tmpElem);
						storeConsts.insert(i + 1, tmpElem);
						for (var j = 0; j < tmpSelectedIds.length; j++) {
							if (tmpSelectedIds[j] == i) {
								tmpSelectedIds[j] = i + 1;
								break
							}
						}
						viewConsts.select(tmpSelectedIds)
					}
				}
			}
			for (var tmpNode, i = storeSize; i > 0; i--) {
				tmpNode = viewConsts.getNode(i - 1);
				if (viewConsts.isSelected(tmpNode)) {
					tmpNode.scrollIntoView(viewConsts.body, false);
					break
				}
			}
		};
		var bottomBtnHandler = function() {
			var storeSize = storeConsts.getCount();
			var numOfSelectedConsts = viewConsts.getSelectionCount();
			for (var tmpRec, i = 0; i < storeSize; i++) {
				if (viewConsts.isSelected(viewConsts.getNode(i))) {
					var tmpRec = storeConsts.getAt(i);
					storeConsts.remove(tmpRec);
					storeConsts.add(tmpRec);
					i--
				}
			}
			if (numOfSelectedConsts > 0) {
				var selIndexes = [];
				var storeSize = storeConsts.getCount();
				for (var i = 0; i < numOfSelectedConsts; i++) {
					selIndexes.push(storeSize - i - 1)
				}
				viewConsts.select(selIndexes);
				var lastNode = viewConsts.getNode(storeSize - 1);
				lastNode.scrollIntoView(viewConsts.body, false)
			}
		};
		var btnAcctions = {
			top : new Ext.Button({
						disabled : true,
						tabIndex : that.tabOffset + 4,
						style : "margin:2px;",
						iconCls : "palo_icon_toup",
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						handler : topBtnHandler,
						id : "wCLE_top_btn"
					}),
			up : new Ext.Button({
						disabled : true,
						style : "margin:2px;",
						tabIndex : that.tabOffset + 5,
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						iconCls : "palo_icon_up",
						handler : upBtnHandler,
						id : "wCLE_up_btn"
					}),
			down : new Ext.Button({
						disabled : true,
						style : "margin:2px;",
						tabIndex : that.tabOffset + 6,
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						iconCls : "palo_icon_down",
						handler : downBtnHandler,
						id : "wCLE_down_btn"
					}),
			bottom : new Ext.Button({
						disabled : true,
						style : "margin:2px;",
						tabIndex : that.tabOffset + 7,
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						iconCls : "palo_icon_todown",
						handler : bottomBtnHandler,
						id : "wCLE_bottom_btn"
					})
		};
		var panel_btnAcctions = new Ext.Panel({
					border : false,
					bodyStyle : "background-color:transparent;vertical-align:middle;",
					layout : "form",
					width : 31,
					autoHeight : true,
					items : [btnAcctions.top, btnAcctions.up, btnAcctions.down,
							btnAcctions.bottom]
				});
		var addConst = function() {
			var newIndex = storeConsts.getCount();
			storeConsts.add(new ConstRecord({
						name : "New Constant".localize()
					}));
			viewConsts.select(newIndex);
			var endIndex = storeConsts.getCount() - 1;
			var newNode = viewConsts.getNode(endIndex);
			newNode.scrollIntoView(viewConsts.body, false);
			var newRec = viewConsts.getRecord(newNode);
			ciePlugin.activeRecord = newRec;
			ciePlugin.startEdit(newNode, newRec.data[ciePlugin.dataIndex])
		};
		var deleteConsts = function(btn) {
			if (btn == "ok") {
				var delConsts = viewConsts.getSelectedRecords();
				var delConstsSize = delConsts.length;
				for (var i = 0; i < delConstsSize; i++) {
					storeConsts.remove(delConsts[i])
				}
			}
		};
		var btnOps = {
			newB : new Ext.Button({
						style : "margin:2px;",
						tabIndex : that.tabOffset + 1,
						iconCls : "palo_icon_cl_create",
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						handler : addConst,
						id : "wCLE_newConst_btn"
					}),
			editB : new Ext.Button({
						disabled : true,
						style : "margin:2px;",
						tabIndex : that.tabOffset + 2,
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						iconCls : "palo_icon_cl_edit",
						id : "wCLE_editConst_btn",
						handler : function() {
							var sIndexes = viewConsts.getSelectedIndexes();
							if (sIndexes.length > 0) {
								var firstNode = viewConsts.getNode(sIndexes[0]);
								var scrollToElem = Ext.get(firstNode);
								firstNode
										.scrollIntoView(viewConsts.body, false);
								var firstRec = viewConsts.getRecord(firstNode);
								ciePlugin.activeRecord = firstRec;
								ciePlugin.startEdit(firstNode,
										firstRec.data[ciePlugin.dataIndex])
							}
						}
					}),
			deleteB : new Ext.Button({
						disabled : true,
						tabIndex : that.tabOffset + 3,
						ctCls : Jedox.kbd.Base.tags.NO_ENTER,
						style : "margin:2px;",
						iconCls : "palo_icon_cl_delete",
						id : "wCLE_delConst_btn",
						handler : function() {
							if (viewConsts.getSelectedIndexes().length > 0) {
								Ext.MessageBox.show({
											title : "Delete Constants"
													.localize(),
											msg : "_msg: Delete Constants"
													.localize(),
											buttons : Ext.MessageBox.OKCANCEL,
											fn : deleteConsts,
											icon : Ext.MessageBox.QUESTION
										})
							}
						}
					})
		};
		var panel_btnOps = new Ext.Panel({
					border : false,
					bodyStyle : "background-color:transparent;vertical-align:middle;",
					layout : "form",
					width : 31,
					autoHeight : true,
					items : [btnOps.newB, btnOps.editB, btnOps.deleteB]
				});
		this.add(panel_viewConsts);
		this.add(panel_btnOps);
		this.add(panel_btnAcctions);
		panel_viewConsts.setSize(that.width - 50, that.height - 5);
		panel_viewConsts.setPosition(0, 5);
		panel_btnOps.setPosition(that.width - 40, 5);
		panel_btnAcctions.setPosition(that.width - 40, that.height - 105);
		viewConsts.on("onkeyenter", function() {
					var timer = setTimeout(function() {
								addConst()
							}, 0)
				});
		viewConsts.on("selectionchange", function(thisDv, selections) {
					var selSize = selections.length;
					if (selSize > 0) {
						if (selSize == 1) {
							btnOps.editB.enable()
						} else {
							btnOps.editB.disable()
						}
						btnOps.deleteB.enable();
						btnAcctions.top.enable();
						btnAcctions.up.enable();
						btnAcctions.down.enable();
						btnAcctions.bottom.enable()
					} else {
						btnOps.editB.disable();
						btnOps.deleteB.disable();
						btnAcctions.top.disable();
						btnAcctions.up.disable();
						btnAcctions.down.disable();
						btnAcctions.bottom.disable()
					}
				})
	}
});