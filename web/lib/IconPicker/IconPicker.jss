Ext.namespace('lib.IconPicker');

lib.IconPicker.IconPicker = function(config) {

	// Ext.apply(this, config)
	this.viewStore = new Ext.data.JsonStore({
				url : '/lib/IconPicker/IconPicker.jcp',
				baseParams : {
					uid : 'xp'
				},
				root : 'images',
				fields : ['url']
			});
	var tpl = new Ext.XTemplate('<tpl for=".">',
			'<div class="thumb-wrap" sid="{did}">',
			'<table cellpadding="0" cellspacing="0" >',
			'<tr><td class="thumb"><img src="{url}" /></td></tr></table>', '',
			'</div>', '</tpl>');

	this.view = new Ext.DataView({
				store : this.viewStore,
				tpl : tpl,
				autoHeight : true,
				overClass : 'x-view-over',
				itemSelector : 'div.thumb-wrap',
				loadingText : '图片载入中...'.loc(),
				autoWidth : true
			});

	this.combo = new Ext.form.ComboBox({
				xtype : 'combo',
				allowBlank : false,
				store : new Ext.data.JsonStore({
							url : '/lib/IconPicker/IconPicker.jcp?dir=image_root_tz',
							root : 'images',
							method : 'get',
							autoLoad : true,
							fields : ["text"],
							remoteSort : false
						}),
				valueField : 'text',
				displayField : 'text',
				triggerAction : 'all',
				clearTrigger : false,
				value : 'common',
				mode : 'local'
			});
	this.combo.on("select", function(combo, record, index) {
				this.viewStore.load({
							params : {
								dir : record.get("text")
							}
						});
			}, this)
	Ext.applyIf(config, {
				multiSelect : false,
				lovTitle : '选择图片'.loc(),
				displayField : '<tpl for=".">{name}</tpl>',
				defaultImage : "/themes/icon/all/transparent.gif",
				defaultAutoCreate : {
					tag : "div"
				},
				triggerClass : 'x-form-search-trigger iconpicker-trigger',
				lovWidth : 340,
				lovHeight : 300,
				alwaysLoadStore : false,
				valueField : 'url',
				cls : 'iconpicker-content',
				valueSeparator : '',
				value : '',
				displaySeparator : '',
				image : false,
				windowConfig : {
					cls : 'images-view'
				}
			});
	lib.IconPicker.IconPicker.superclass.constructor.call(this, config);

}
Ext.extend(lib.IconPicker.IconPicker, lib.ListValueField.ListValueField, {
			onRender : function(ct, position) {

				lib.IconPicker.IconPicker.superclass.onRender.call(this, ct,
						position);
				this.wrap.applyStyles({
							position : 'relative'
						});
				this.el.removeClass("x-form-field");
				this.image = this.el.createChild({
							tag : 'img',
							style : "position:absulute",
							src : this.defaultImage
						}, false, true);

				if (this.height)
					this.el.setStyle("height", this.height + 2);

			},
			validateValue : function() {
				if (this.allowBlank === false && this.value == this.emptyImage) {
					this.markInvalid(this.blankText);
					return false;
				}
				return true;
			},
			onSelect : function() {
				var rec = this.getSelectedRecords();
				if (rec.length > 0) {
					rec = rec[0];
					this.setValue(rec.get(this.valueField));
					// 添加图片显示
				}
				this.window.hide();
			},
			onUpload:function(){
				
				CPM.openModuleWindow("1b1b59ff-32a6-4384-9672-dc60860832c5", this, {pageType : "new"}, {// 固定ID 模块:海外_文件申请使用
							title : "上传图片",
							width : 450,
							height : 150,
							comboText : this.combo.getValue(),
							viewStore : this.viewStore,
							listeners : {
								'close' : function(){
									if(this.uploadsuccess && this.comboText && this.viewStore){
										this.viewStore.load.defer(300 , this.viewStore ,[{
												params : {
													dir : this.comboText,
													reload : true
												}
											}]);
									}
								}
							}
						});
				
			},
			setValue : function(val) {
	
				this.hiddenField.value = val;
				if (val == "" || typeof(val) == 'undefined') {
					val = this.defaultImage;
					this.value = (val.indexOf("themes") == -1) ? "/themes/icon"
							+ val : val;
				} else {
					this.value = (val.indexOf("themes") == -1) ? "/themes/icon"
							+ val : val;
					this.validate();
				}
				if (this.image)
					this.image.src = this.value;
				this.hiddenField.value = this.getValue();

			},

			getRawValue : function() {
				return this.getValue();
			},
			getValue : function() {
				var v = this.value;
				return (typeof(v) == 'undefined') ? '' : v.substring(12);
			},
			onResize : function(w, h) {
				Ext.form.TriggerField.superclass.onResize.call(this, w, h);
				if (Ext.isNumber(w)) {
					this.el.setWidth(w);
				}
				this.wrap.setWidth(w + 25);
			},
			onTriggerClick : function(e) {
				if (!this.isStoreLoaded) {
					this.view.store.load();
					this.isStoreLoaded = true;
				} else if (this.alwaysLoadStore === true) {
					this.view.store.reload();
				}

				this.windowConfig = Ext.apply(this.windowConfig, {
							title : this.lovTitle,
							width : this.lovWidth,
							height : this.lovHeight,
							autoScroll : true,
							layout : 'fit',
							tbar : [{
										text : '确定'.loc(),
										handler : this.onSelect,
										scope : this
									}, {
										text : '取消'.loc(),
										handler : function() {
											this.select(this.selections);
											this.window.hide();
										},
										scope : this
									},{
										text : '上传'.loc(),
										handler : this.onUpload,
										scope : this
									}, '->', this.combo

							],
							items : this.view
						}, {
							shadow : false,
							frame : true
						});

				if (!this.window) {
					this.window = new Ext.Window(this.windowConfig);
					this.window.on('beforeclose', function() {
								this.window.hide();
								return false;
							}, this);
					this.view.on('dblclick', this.onSelect, this);

				}
				var vw = Ext.lib.Dom.getViewWidth(), vh = Ext.lib.Dom
						.getViewHeight();
				var s = Ext.getDoc().getScroll();
				var x = e.xy[0] - s.left, y = e.xy[1] - s.top;
				y = (vh - y < this.lovHeight)
						? e.xy[1] - this.lovHeight
						: e.xy[1];
				x = (vw - x < this.lovWidth)
						? e.xy[0] - this.lovWidth
						: e.xy[0];
				this.window.setPagePosition(x, y);
				this.window.show();
			}
		});

Ext.reg('iconpicker', lib.IconPicker.IconPicker);