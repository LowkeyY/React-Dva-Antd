Ext.namespace("bin.exe");
loadcss("bin.gis.mapsControl");
bin.exe.MapControlPanel = function(frames) {
	this.mapPanel = frames;

	var expander = new Ext.grid.RowExpander({});

	var reader = new Ext.data.JsonReader({
				root : 'layers',
				totalProperty : 'totalCount'
			}, [{
						name : 'groupname',
						mapping : 'groupname'
					}, {
						name : 'logicName',
						mapping : 'logicName'
					}, {
						name : 'layerName',
						mapping : 'layerName'
					}, {
						name : 'layerType',
						mapping : 'layerType'
					}, {
						name : 'objectId',
						mapping : 'objectId'
					}, {
						name : 'queryId',
						mapping : 'queryId'
					}, {
						name : 'minScale',
						mapping : 'minScale'
					}, {
						name : 'maxScale',
						mapping : 'maxScale'
					}, {
						name : 'hasAttribute',
						mapping : 'hasAttribute'
					}, {
						name : 'chartType',
						mapping : 'chartType'
					}, {
						name : 'opacity',
						mapping : 'opacity'
					}, {
						name : 'seq',
						mapping : 'seq'
					}, {
						name : 'searchId',
						mapping : 'searchId'
					}, {
						name : 'onDefault',
						mapping : 'onDefault'
					}, {
						name : 'menu',
						mapping : 'menu'
					}])

	var sm = new Ext.grid.MmappSelectionModel({
				singleSelect : true,
				header : '<div id="fool-ext-into-hiding-header2" class="eh"></div>'
	});
	sm.addListener('toggleLayer', this.toggleLayerHandler, this);
	sm.addListener({
		'beforerowselect' : function(sm, rowIndex, keepExisting, record) {
			if (keepExisting === false) {
				return false;
			}
		}
	});
	sm.addListener('rowselect', this.selectQueryLayer, this);

	this.store = new Ext.data.Store({
				reader : reader
	});

	var redrawLayers = this.redrawLayers();

	this.grid = new Ext.grid.GridPanel({
		searchEditors : {},
		opacities : {},
		queryParams : {},
		menuArray : {},
		store : this.store,
		autoExpandColumn : 'logicName',
		cm : new Ext.grid.ColumnModel([sm, expander, {
					id : 'logicName',
					header : '名称'.loc(),
					width : 80,
					menuDisabled : true,
					align : 'left',
					dataIndex : 'logicName'
				}, {
					header : '分类'.loc(),
					menuDisabled : true,
					width : 100,
					dataIndex : 'groupname'
				}]),
		sm : sm,
		layout : 'fit',
		scope : this,
		autoHeight : true,
		border : false,
		plugins : expander,
		frame : false,
		enableDragDrop : true,
		ddGroup : 'mmDDGroup',
		changeOpacity : function(layerName, opacityValue) {
			this.changeLayerOpacity(layerName, opacityValue);
		}.createDelegate(this),
		reloadLayer : function(rec, params) {
			this.reloadLayerHandler(rec, params);
		}.createDelegate(this),
		listeners : {
			sortchange : function() {
				this.redrawLayers();
			}.createDelegate(this),
			render : function(g) {
				var ddrow = new Ext.ux.dd.GridReorderDropTarget(g, {
					scope : this,
					copy : false,
					listeners : {
						afterrowmove : function(objThis, oldIndex, newIndex,
								records) {
							this.redrawLayers();
						}.createDelegate(this),
						beforerowmove : function(objThis, oldIndex, newIndex,
								records) {
							expander
									.collapseRow(this.grid.getSelectionModel().selectedId);
							var rec = this.grid.getSelectionModel()
									.getSelected();
							for (var i in expander.bodyContent) {
								if (i == rec.id)
									delete expander.bodyContent[i];
							}
						}.createDelegate(this)
					}
				});
				Ext.dd.ScrollManager.register(g.getView().getEditorParent());
			}.createDelegate(this),
			beforedestroy : function(g) {
				Ext.dd.ScrollManager.unregister(g.getView().getEditorParent());
			}.createDelegate(this)
		},
		iconCls : 'icon-grid'
	})
	bin.exe.MapControlPanel.superclass.constructor.call(this, {
				title : '图层控制'.loc(),
				region : 'east',
				layout : 'fit',
				split : false,
				width : 260,
				minSize : 180,
				collapsible : true,
				autoScroll : true,
				border : true,
				collapseFirst : true,
				margins : '0 0 0 0',
				cmargins : '0 0 0 0',
				items : this.grid
			});
};
Ext.extend(bin.exe.MapControlPanel, Ext.Panel, {
			init : function(DataLayers) {
				this.store.loadData(DataLayers);
				for (i = 0; i < DataLayers.layers.length; i++) {
					var layer = DataLayers.layers[i];
					this.grid.opacities[layer.objectId] = layer.opacity;
					var editors = layer.searchEditor.editors;
					if ((editors instanceof Array) && editors.length > 0) {
						if (layer.searchEditor.libs.length > 0) {
							eval(layer.searchEditor.libs);
						}
						var eds = [];
						for (var i = 0; i < editors.length; i++) {
							if (editors[i].xtitleList) {
								editors[i] = Ext.ComponentMgr.create(
										editors[i], 'textfield')
								eds.push(editors[i]);
							}
						}
					}
					this.grid.searchEditors[layer.objectId] = eds;
				}
			},
			changeLayerOpacity : function(layer, opacityValue) {
				this.mapPanel.changeOpacity(layer, opacityValue);
			},
			redrawLayers : function() {
				var num_recs = this.store.getCount();
				var curr_rec;
				new_index = 0;
				for (i = 0;i<num_recs ; i++) {
					curr_rec = this.store.getAt(i);
					if (curr_rec.layerOn) {
						var layerName = curr_rec.get('objectId');
						this.mapPanel.reOrderLayer(layerName, new_index);
						new_index = new_index + 1;
					}
				}
			},
			selectQueryLayer : function(m,rowIndex,rec){
				if (rec.layerOn) {
					var layerName = rec.get('objectId');
					this.mapPanel.activateQueryLayer(layerName);
				}
			},
			getTurnOnLayers : function() {
				var num_recs = this.store.getCount();
				var curr_rec;
				new_index = 0;
				var layers=new Array();
				for (i = 0;i<num_recs ; i++) {
					curr_rec = this.store.getAt(i);
					if (curr_rec.layerOn) {
						layers.push(curr_rec);
					}
				}
				return layers;
			},
			getTurnOnOpacities : function() {
				var num_recs = this.store.getCount();
				var curr_rec;
				new_index = 0;
				var opacities=new Array();
				for (i = num_recs - 1; i >= 0; i--) {
					curr_rec = this.store.getAt(i);
					if (curr_rec.layerOn) {
						opacities.push(this.grid.opacities[curr_rec.get('objectId')]);
					}
				}
				return opacities;
			},
			getTurnOnQueryParams : function() {
				var num_recs = this.store.getCount();
				var curr_rec;
				new_index = 0;
				var QParams=new Array();
				for (i = num_recs - 1; i >= 0; i--) {
					curr_rec = this.store.getAt(i);
					if (curr_rec.layerOn) {
						QParams.push(this.grid.queryParams[curr_rec.get('objectId')]);
					}
				}
				return QParams;
			},
			turnOnDefaultLayers : function() {
				var default_on_query = function(rec) {
					var on_default = rec.get('onDefault');
					return (on_default === true);
				};
				var layer_recs = this.store.queryBy(default_on_query, this);
				for (var i = 0; i < layer_recs.items.length; i++) {
					layer_recs.items[i].layerOn = true;
				}
			},
			toggleLayerHandler : function(sm, rowIndex, rec) {
				var num_recs = this.store.getCount();
				var curr_rec;
				new_index = 0;
				var layers=new Array();
				for (i = 0;i<num_recs ; i++) {
					curr_rec = this.store.getAt(i);
					if (!rec.layerOn) {
						if (curr_rec.layerOn||curr_rec.get('objectId')==rec.get('objectId')) {
							layers.push(curr_rec.get('objectId'));
						}
					} else {
						if (curr_rec.layerOn&&curr_rec.get('objectId')!=rec.get('objectId')) {
							layers.push(curr_rec.get('objectId'));
						}
					}
				}
				if (!rec.layerOn) {   
					this.mapPanel.showLayer(rec, true, this.grid.opacities[rec.get('objectId')],this.grid.queryParams[rec.get('objectId')],layers);
					rec.layerOn = true;
				} else {
					rec.layerOn = false;
					this.mapPanel.showLayer(rec, false, this.grid.opacities[rec.get('objectId')],this.grid.queryParams[rec.get('objectId')],layers);
				}
				//this.redrawLayers();
			},
			reloadLayerHandler : function(rec, params) {
				if (rec.layerOn) {
					var num_recs = this.store.getCount();
					var curr_rec;
					new_index = 0;
					var layers=new Array();
					for (i = 0;i<num_recs ; i++) {
						curr_rec = this.store.getAt(i);
						if (curr_rec.layerOn) {
							layers.push(curr_rec.get('objectId'));
						}
					}
					this.mapPanel.showLayer(rec, true, this.grid.opacities[rec.get('objectId')],params,layers);
				} else {
					Ext.msg("error", '请先选定并显示该图层!'.loc());
				}
				//this.redrawLayers();
			}
		});
Ext.grid.MmappSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
	header : '<div class="x-grid3-hd-checker">&#160;</div>',
	width : 20,
	sortable : false,
	menuDisabled : true,
	selectedId : null,
	fixed : true,
	dataIndex : '',
	id : 'checker',
	initEvents : function() {
		Ext.grid.MmappSelectionModel.superclass.initEvents.call(this);
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},
	onMouseDown : function(e, t) {
		if (e.button === 0) {
			e.stopEvent();
			var row = e.getTarget('.x-grid3-row');
			if (row) {
				var index = row.rowIndex;
				var rec = this.grid.store.getAt(index);
				var checkbox;
				if (t.className.match('x-grid3-row-checker') != 'x-grid3-row-checker') {
					if (t.className != 'x-grid3-row-expander') {
						this.selectedId = index;
						this.selectRow(index, true);
					}
				} else {
					this.fireEvent("toggleLayer", this, index, rec);
					checkbox = Ext.fly(t);
					if (!rec.layerOn) {
						checkbox.addClass('x-grid3-row-checker-off');
						checkbox.removeClass('x-grid3-row-checker-on');
					} else {
						checkbox.addClass('x-grid3-row-checker-on');
						checkbox.removeClass('x-grid3-row-checker');
						checkbox.removeClass('x-grid3-row-checker-off');
					}
				}
			}
		}
	},
	renderer : function(v, p, record) {
		if (record.layerOn) {
			return '<div class="x-grid3-row-checker-on">&#160;</div>';
		} else {
			return '<div class="x-grid3-row-checker-off">&#160;</div>';
		}
	}
});


Ext.namespace('Ext.ux.dd');
Ext.ux.dd.GridReorderDropTarget = function(grid, config) {
	this.target = new Ext.dd.DropTarget(grid.getEl(), {
		ddGroup : grid.ddGroup || 'GridDD',
		grid : grid,
		gridDropTarget : this,
		notifyDrop : function(dd, e, data) {
			if (this.currentRowEl) {
				this.currentRowEl.removeClass('grid-row-insert-below');
				this.currentRowEl.removeClass('grid-row-insert-above');
			}
			var t = Ext.lib.Event.getTarget(e);
			var rindex = this.grid.getView().findRowIndex(t);
			data.selections = this.grid.getSelectionModel().getSelections();
			if (rindex === false || rindex == data.rowIndex) {
				return false;
			}
			if (this.gridDropTarget.fireEvent('beforerowmove',
					this.gridDropTarget, data.rowIndex, rindex,
					data.selections, 123) === false) {
				return false;
			}
			var ds = this.grid.getStore();
			var selections = new Array();
			var keys = ds.data.keys;
			for (var key in keys) {
				for (var i = 0; i < data.selections.length; i++) {
					if (keys[key] == data.selections[i].id) {
						if (rindex == key) {
							return false;
						}
						selections.push(data.selections[i]);
					}
				}
			}
			if (rindex > data.rowIndex && this.rowPosition < 0) {
				rindex--;
			}
			if (rindex < data.rowIndex && this.rowPosition > 0) {
				rindex++;
			}
			if (rindex > data.rowIndex && data.selections.length > 1) {
				rindex = rindex - (data.selections.length - 1);
			}
			if (rindex == data.rowIndex) {
				return false;
			}
			for (var i = 0; i < data.selections.length; i++) {
				ds.remove(ds.getById(data.selections[i].id));
			}
			for (var i = selections.length - 1; i >= 0; i--) {
				var insertIndex = rindex;
				ds.insert(insertIndex, selections[i]);
			}
			var sm = this.grid.getSelectionModel();
			if (sm) {
				sm.selectRecords(data.selections);
			}
			this.gridDropTarget.fireEvent('afterrowmove', this.gridDropTarget,
					data.rowIndex, rindex, data.selections);
			return true;
		},
		notifyOver : function(dd, e, data) {
			var t = Ext.lib.Event.getTarget(e);
			var rindex = this.grid.getView().findRowIndex(t);
			var ds = this.grid.getStore();
			var keys = ds.data.keys;
			for (var key in keys) {
				for (var i = 0; i < data.selections.length; i++) {
					if (keys[key] == data.selections[i].id) {
						if (rindex == key) {
							if (this.currentRowEl) {
								this.currentRowEl
										.removeClass('grid-row-insert-below');
								this.currentRowEl
										.removeClass('grid-row-insert-above');
							}
							return this.dropNotAllowed;
						}
					}
				}
			}
			if ((rindex < 0 || rindex === false) && this.currentRowEl) {
				this.currentRowEl.removeClass('grid-row-insert-above');
				return this.dropNotAllowed;
			}
			try {
				var currentRow = this.grid.getView().getRow(rindex);
				var resolvedRow = new Ext.Element(currentRow).getY()
						- this.grid.getView().scroller.dom.scrollTop;
				var rowHeight = currentRow.offsetHeight;
				this.rowPosition = e.getPageY() - resolvedRow - (rowHeight / 2);
				if (this.currentRowEl) {
					this.currentRowEl.removeClass('grid-row-insert-below');
					this.currentRowEl.removeClass('grid-row-insert-above');
				}
				if (this.rowPosition > 0) {
					this.currentRowEl = new Ext.Element(currentRow);
					this.currentRowEl.addClass('grid-row-insert-below');
				} else {
					if (rindex - 1 >= 0) {
						var previousRow = this.grid.getView()
								.getRow(rindex - 1);
						this.currentRowEl = new Ext.Element(previousRow);
						this.currentRowEl.addClass('grid-row-insert-below');
					} else {
						this.currentRowEl.addClass('grid-row-insert-above');
					}
				}
			} catch (err) {
				rindex = false;
			}
			return (rindex === false) ? this.dropNotAllowed : this.dropAllowed;
		},
		notifyOut : function(dd, e, data) {
			if (this.currentRowEl) {
				this.currentRowEl.removeClass('grid-row-insert-above');
				this.currentRowEl.removeClass('grid-row-insert-below');
			}
		}
	});
	if (config) {
		Ext.apply(this.target, config);
		if (config.listeners) {
			Ext.apply(this, {
						listeners : config.listeners
					});
		}
	}
	this.addEvents({
				'beforerowmove' : true,
				'afterrowmove' : true,
				'beforerowcopy' : true,
				'afterrowcopy' : true
			});
	Ext.ux.dd.GridReorderDropTarget.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.dd.GridReorderDropTarget, Ext.util.Observable, {
			getTarget : function() {
				return this.target;
			},
			getGrid : function() {
				return this.target.grid;
			}
		});

Ext.grid.RowExpander = function(config) {
	Ext.apply(this, config);
	this.addEvents({
				beforeexpand : true,
				expand : true,
				beforecollapse : true,
				collapse : true
			});
	Ext.grid.RowExpander.superclass.constructor.call(this);
	this.state = {};
	this.bodyContent = {};
};

Ext.extend(Ext.grid.RowExpander, Ext.util.Observable, {
	header : "",
	width : 20,
	sortable : false,
	fixed : true,
	menuDisabled : true,
	dataIndex : '',
	id : 'expander',
	lazyRender : true,
	enableCaching : true,

	getRowClass : function(record, rowIndex, p, ds) {
		// p.cols = p.cols;
		/*
		 * var content = this.bodyContent[record.id]; if(!content &&
		 * !this.lazyRender){ content = this.getBodyContent(record, rowIndex); }
		 * if(content){ p.body = content; }
		 */
		return this.state[record.id]
				? 'x-grid3-row-expanded'
				: 'x-grid3-row-collapsed';
	},

	init : function(grid) {
		this.grid = grid;
		var view = grid.getView();
		view.getRowClass = this.getRowClass.createDelegate(this);
		view.enableRowBody = true;
		grid.on('render', function() {
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},
	getBodyContent : function(record, index) {
		var content = this.bodyContent[record.id];
		if (!content) {
			var tip = new Ext.slider.Tip({
						getText : function(thumb) {
							return String.format('<b>'+'透明度'.loc()+':{0}% </b>',
									thumb.value);
						}
					});
			var opacitySlider = new Ext.form.SliderField({
						id : Ext.id(),
						width : 180,
						increment : 5,
						minValue : 0,
						maxValue : 100,  
						plugins : tip
					});
			opacitySlider.slider.on('changecomplete', function() {
						this.grid.opacities[record.get('objectId')] = opacitySlider.getValue();
						if (record.layerOn || record.layerOn == true) {
							this.grid.changeOpacity(record.get('objectId'),opacitySlider.getValue());
						}
					}, this);   

			content = new Ext.form.FormPanel({
						bodyStyle : 'padding:10px;background:#ffffff',
						border : true,
						slider : opacitySlider,
						scope : this,
						labelWidth : 60,
						labelAlign : 'right',
						margins : '0 0 0 0',
						cmargins : '0 0 0 0',
						items : [{
							layout : 'column',
							border : false,
							bodyStyle : 'padding:2px',
							items : [{
								columnWidth : 1.0,
								border : false,
								html : '显示范围:'.loc() + record.get('minScale') + '-'
										+ record.get('maxScale')
							}]
						}, {
							layout : 'column',
							border : false,
							bodyStyle : 'padding:2px',
							items : [{
										columnWidth : 0.50,
										border : false,
										html : '透明度设置:'.loc()
									}]
						}, {
							layout : 'column',
							border : false,
							bodyStyle : 'padding:2px',
							items : [ {
										columnWidth : 1.0,
										hideLabel  :true,
										border : false,
										items : opacitySlider
									}]
						}]
					});
   
			var sEditors = this.grid.searchEditors;
			var recordSearchEditors = sEditors[record.get('objectId')];
			if (recordSearchEditors) {
				for (i = 0; i < recordSearchEditors.length; i++) {
					recordSearchEditors[i].fieldLabel = recordSearchEditors[i].xtitleList;
				}
				content.add({
					columnWidth : 1.0,
					border : false,
					labelWidth : 80,
					layout : 'form',
					items : recordSearchEditors
				});
				content.addButton({
					text : '搜索'.loc(),
					width : 70,
					scope : this,
					handler : function(btn) {
						var result = {};
						for (var i = 0; i < recordSearchEditors.length; i++) {
							if (!recordSearchEditors[i].validate()) {
								Ext.msg("error", '请改正标示出的错误.'.loc());
								return false;
							}
							result[recordSearchEditors[i].xtitleList] = recordSearchEditors[i]
									.getValue();
						}
						this.grid.queryParams[record.get('objectId')] = result;
						this.grid.reloadLayer(record, result);
					}
				});
				content.addButton({
							text : '重置'.loc(),
							width : 70,
							scope : this,
							handler : function(btn) {
								this.grid.reloadLayer(record, "{}");
								for (var i = 0; i < recordSearchEditors.length; i++) {
									recordSearchEditors[i].reset();
								}
							}
				});
				content.doLayout();
			}

			// content = this.tpl.apply(record.data);
			this.bodyContent[record.id] = content;
		}
		return content;
	},

	onMouseDown : function(e, t) {
		if (t.className == 'x-grid3-row-expander') {
			e.stopEvent();
			var row = e.getTarget('.x-grid3-row');
			this.toggleRow(row);
		}
	},

	renderer : function(v, p, record) {
		p.cellAttr = 'rowspan="3"';
		return '<div class="x-grid3-row-expander">&#160;</div>';
	},

	beforeExpand : function(record, body, rowIndex) {
		if (this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false) {
			if (this.lazyRender) {
				var content = this.getBodyContent(record, rowIndex);
				if (!content.rendered) {
					content.render(body);
					var value = this.grid.opacities[record.get('objectId')] * 1;
					content.slider.setValue.defer(200, content.slider, [value,true]);
				}
			}
			return true;
		} else {
			return false;
		}
	},
	toggleRow : function(row) {
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		this[Ext.fly(row).hasClass('x-grid3-row-collapsed')
				? 'expandRow'
				: 'collapseRow'](row);
	},
	expandRow : function(row) {
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		var record = this.grid.store.getAt(row.rowIndex);
		var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body',
				row);
		if (this.beforeExpand(record, body, row.rowIndex)) {
			this.state[record.id] = true;
			Ext.fly(row).replaceClass('x-grid3-row-collapsed',
					'x-grid3-row-expanded');
			this.fireEvent('expand', this, record, body, row.rowIndex);
		}
	},

	collapseRow : function(row) {
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		var record = this.grid.store.getAt(row.rowIndex);
		var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
		if (this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false) {
			this.state[record.id] = false;
			Ext.fly(row).replaceClass('x-grid3-row-expanded',
					'x-grid3-row-collapsed');
			this.fireEvent('collapse', this, record, body, row.rowIndex);
		}
	}
});