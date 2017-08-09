

Ext.ns('lib.file.filefield');

loadcss("lib.file.filefield.FileField");
/**
 * @class lib.file.filefield.FileField
 * @extends Ext.form.TextField 文件上传控件
 * @xtype fileuploadfield
 */
lib.file.filefield.FileField = Ext.extend(Ext.form.TextField, {
			/**
			 * @cfg {String} buttonText The button text to display on the upload
			 *      button (defaults to 'Browse...'). Note that if you supply a
			 *      value for {@link #buttonCfg}, the buttonCfg.text value will
			 *      be used instead if available.
			 */
			buttonText : '浏览...'.loc(),
			/**
			 * @cfg {Boolean} buttonOnly True to display the file upload field
			 *      as a button with no visible text field (defaults to false).
			 *      If true, all inherited TextField members will still be
			 *      available.
			 */
			buttonOnly : false,
			/**
			 * @cfg {Number} buttonOffset The number of pixels of space reserved
			 *      between the button and the text field (defaults to 3). Note
			 *      that this only applies if {@link #buttonOnly} = false.
			 */
			buttonOffset : 3,
			/**
			 * @cfg {Object} buttonCfg A standard {@link Ext.Button} config
			 *      object.
			 */

			/**
			 * @cfg {boolean} allowMultiFile 是否允许多文件上传,默认为false.
			 */
			allowMultiFile : false,
			// private
			readOnly : true,

			/**
			 * @hide
			 * @method autoSize
			 */
			autoSize : Ext.emptyFn,

			// private
			initComponent : function() {  

				if (this.allowMultiFile) {
					var input = document.createElement("input");
					input.type = 'file';

					if (Ext.isDefined(input.multiple)) {
						this.manager = new lib.file.filefield.Multi(this);
					} else if (swfobject.getFlashPlayerVersion().major > 0) {
						// this.manager = new lib.file.filefield.Flash(this);
						this.allowMultiFile = false;
					} else {
						this.allowMultiFile = false;
					}

				}
				this.manager = this.manager
						|| new lib.file.filefield.Single(this);

				lib.file.filefield.FileField.superclass.initComponent
						.call(this);

				this.addEvents(
						/**
						 * @event fileselected Fires when the underlying file
						 *        input field's value has changed from the user
						 *        selecting a new file from the system file
						 *        selection dialog.
						 * @param {lib.file.filefield.FileField}
						 *            this
						 * @param {String}
						 *            value The file value returned by the
						 *            underlying file input field
						 * 
						 * @param {Object[]}
						 *            文件描述
						 */
						'fileselected',
						/**
						 * @event uploadcomplete,当多文件选择为flash时,所有文件自动传完后会自动触发此事件
						 * @param {boolean}
						 *            是否上传成功
						 * 
						 */
						'uploadcomplete');
				this.on("fileselected", function(field, name) {
							this.el.dom.value = name;
						}, this);
			},

			// private
			onRender : function(ct, position) {
				lib.file.filefield.FileField.superclass.onRender.call(this, ct,
						position);

				this.wrap = this.el.wrap({
							cls : 'x-form-field-wrap x-form-file-wrap'
						});
				this.el.addClass('x-form-file-text');
				this.el.dom.removeAttribute('name');

				this.manager.render();
				this.resizeEl = this.positionEl = this.wrap;
			},
			afterRender : function() {
				lib.file.filefield.FileField.superclass.afterRender.call(this);
				this.manager.afterRender();
			},

			reset : function() {
				this.manager.reset();
				lib.file.filefield.FileField.superclass.reset.call(this);
			},

			// private
			onResize : function(w, h) {
				lib.file.filefield.FileField.superclass.onResize.call(this, w,
						h);
				this.wrap.setWidth(w);

				if (!this.buttonOnly) {
					var w = this.wrap.getWidth()
							- this.manager.getButtonWidth() - this.buttonOffset;
					this.el.setWidth(w);
				}
			},
			startUpload : function(params) {
				this.manager.startUpload(params);
			},
			// private
			onDestroy : function() {
				lib.file.filefield.FileField.superclass.onDestroy.call(this);
				this.manager.destroy();
				Ext.destroy(this.wrap);
			},

			onDisable : function() {
				lib.file.filefield.FileField.superclass.onDisable.call(this);
				this.doDisable(true);
			},

			onEnable : function() {
				lib.file.filefield.FileField.superclass.onEnable.call(this);
				this.doDisable(false);

			},

			// private
			doDisable : function(disabled) {
				this.fileInput.dom.disabled = disabled;
				this.manager.doDisable(disabled);
			},

			// private
			preFocus : Ext.emptyFn,

			// private
			alignErrorIcon : function() {
				this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
			}

		});

/**
 * 多文件管理器,用于管理多文件上传的操作
 * 
 */

lib.file.filefield.Flash = function(field) {
	this.field = field;
	this.isFlash = true;
}

lib.file.filefield.Flash.prototype = {

	buttonWidth : 81,

	doDisable : function(disabled) {
		this.uploader.setButtonDisabled(disabled)
	},

	destroy : function() {
		// this.uploader.destroy();
	},

	reset : function() {
		// this.uploader.cancelUpload();
	},

	getButtonWidth : function() {
		return this.buttonWidth;
	},

	afterRender : function() {

		this.uploader = new SWFUpload({
					button_image_url : "/lib/file/filefield/button.png",
					button_text : this.field.buttonText,
					button_text_left_padding : 3,
					button_text_top_padding : 2,
					upload_url : this.field.url,
					flash_url : "/lib/file/filefield/swfupload.swf",
					button_width : this.buttonWidth,
					button_height : 22,
					file_post_name : "file-upload",

					button_placeholder_id : this.placeHolderId,
					upload_success_handler : this.uploadComplete
							.createDelegate(this, [true], true),
					upload_error_handler : this.uploadComplete.createDelegate(
							this, [false], true),
					file_dialog_complete_handler : this.dialogComplete
							.createDelegate(this, [], true),
					file_dialog_start_handler : function() {
						this.qe = [];
						this.cancelUpload();
					},
					file_queued_handler : function(file) {
						this.qe.push(file);
					}

				});

		var el = Ext.get(this.uploader.movieName);
		el.addClass("x-form-file-btn");

	},
	dialogComplete : function(selected, queued, total) {
		var arr = this.uploader.qe;
		this.uploader.qe = [];
		var nameArr = [];
		for (var i = 0; i < arr.length; i++) {
			nameArr.push(arr[i].name);
		}
		this.field.fireEvent('fileselected', this.field, nameArr.join(), arr);
	},
	uploadComplete : function(success) {
		var st = this.uploader.getStats();
		if (st.files_queued > 0) {
			this.uploader.startUpload();
			var uploaded = this.totalFiles - st.files_queued;
			this.pbar.updateProgress(uploaded / this.totalFiles, uploaded + "/"
							+ this.totalFiles);
		} else {
			this.pbar.hide();
			this.field.fireEvent('uploadcomplete', st.upload_errors == 0);
		}

	},
	startUpload : function(params) {
		for (var k in params) {
			this.uploader.addPostParam(k, params[k]);
		}
		var st = this.uploader.getStats();
		this.totalFiles = st.files_queued;
		if (this.totalFiles < 1) {
			this.field.fireEvent('uploadcomplete', false);
			return;
		}
		this.pbar = Ext.MessageBox.progress("上传文件", "正在上传文件....");
		this.pbar.updateProgress(0);
		this.uploader.startUpload();
	},
	render : function() {
		this.placeHolderId = Ext.id();
		this.field.wrap.createChild({
					id : this.placeHolderId,
					name : this.field.name || this.field.getId(),
					tag : 'div'
				})
	}
}

/**
 * 单文件管理器,用于管理单个文件上传的操作
 * 
 */

lib.file.filefield.Single = function(field) {
	this.field = field;
}

lib.file.filefield.Single.prototype = {
	startUpload : function(params) {
		Ext.MessageBox.wait(this.field.getValue(), "上传文件");
		return Ext.Ajax.request(Ext.apply(params, {
					method : 'POST',
					isUpload : true
				}));
	},
	doDisable : function(disabled) {
		this.button.setDisabled(disabled);
	},

	destroy : function() {
		Ext.destroy(this.fileInput, this.button);
	},

	getButtonWidth : function() {
		return this.button.getEl().getWidth();
	},

	reset : function() {
		this.fileInput.remove();
		this.createFileInput();
		this.bindListeners();
	},

	afterRender : Ext.emptyFn,

	createFileInput : function() {
		this.fileInput = this.field.wrap.createChild({
					id : this.getFileInputId(),
					name : this.field.name || this.field.getId(),
					cls : 'x-form-file',
					tag : 'input',
					type : 'file',
					size : 1
				});
	},

	getFileInputId : function() {
		return this.id + '-file';
	},

	render : function() {
		this.createFileInput();

		var btnCfg = Ext.applyIf(this.field.buttonCfg || {}, {
					text : this.field.buttonText
				});
		this.button = new Ext.Button(Ext.apply(btnCfg, {
					renderTo : this.field.wrap,
					cls : 'x-form-file-btn'
							+ (btnCfg.iconCls ? ' x-btn-icon' : '')
				}));

		if (this.field.buttonOnly) {
			this.field.el.hide();
			this.field.wrap.setWidth(this.button.getEl().getWidth());
		}
		this.bindListeners();
	},

	bindListeners : function() {
		this.fileInput.on({
					scope : this,
					mouseenter : function() {
						this.button.addClass(['x-btn-over', 'x-btn-focus'])
					},
					mouseleave : function() {
						this.button.removeClass(['x-btn-over', 'x-btn-focus',
								'x-btn-click'])
					},
					mousedown : function() {
						this.button.addClass('x-btn-click')
					},
					mouseup : function() {
						this.button.removeClass(['x-btn-over', 'x-btn-focus',
								'x-btn-click'])
					},
					change : function() {
						var v = this.fileInput.dom.value;
						this.field.setValue(v);
						this.field.fireEvent('fileselected', this.field, v, [{
											name : v
										}]);
					}
				});
	}
}

lib.file.filefield.Multi = Ext.extend(lib.file.filefield.Single, {
			createFileInput : function() {
				this.fileInput = this.field.wrap.createChild({
							id : this.getFileInputId(),
							name : this.field.name || this.field.getId(),
							cls : 'x-form-file',
							tag : 'input',
							multiple : "multiple",
							type : 'file',
							size : 1
						});
			}

		})

/**
 * 图片上传管理器,用于单个图片上传的操作,可以显示图例
 * 
 */

Ext.reg('fileuploadfield', lib.file.filefield.FileField);

// backwards compat
Ext.form.FileUploadField = lib.file.filefield.FileField;
