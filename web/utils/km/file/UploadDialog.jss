Ext.namespace('utils.km.file');

using("lib.file.filefield.FileField");
/**
 * 
 * 文件上传对话框,用于文件管理中上传文件.<br>
 * 
 * 本对话框可以根据浏览器的支持情况决定是否允许多文件同时上传.<br>
 * 由于不支持多文件上传的浏览器一般版本较低,所以不再费力气写文件上传进度展示.对于不支持Flash的高级浏览器,在文件管理中会自动支持拖放上传.
 * 
 * 
 * @author tz
 * @date 2013/1/29
 * 
 */
utils.km.file.UploadDialog = Ext.extend(Ext.Window, {

			// attribute
			width : 380,
			height : 120,

			// private
			isUploading : false,
			closable : false,
			resizable : false,
			constrain : true,
			closeAction : 'hide',
			modal : true,
			activeItem : 0,
			maximizable : false,
			bodyStyle : "background-color:white;padding:5px,",
			uploader : null,

			initComponent : function() {

				this.uploadButton = new Ext.Button({
							text : '开始上传'.loc(),
							handler : this.startUpload,
							scope : this
						});
				this.buttons = [this.uploadButton, {
							text : '取消'.loc(),
							handler : this.cancelUpload,
							scope : this
						}]
				this.addEvents(

						/**
						 * 文件上传完毕后触发事件, 如果返回false则不关闭窗口
						 */

						'complete',
						/**
						 * 文件上传过程中发生错误触发此事件 如果返回false则不弹出错误信息
						 * 
						 * @param {Object}
						 *            错误说明,其中的message属性为错误信息.
						 */
						'error'

				);
				this.fileField = new lib.file.filefield.FileField({
							fieldLabel : "请选择文件",
							url : this.url,
							width : 200,
							allowMultiFile : true,
							name : 'file-upload'
						});
				this.form = new Ext.FormPanel({
							border : false,
							bodyStyle : "padding:10 0 5 20;",
							items : this.fileField
						});

				this.items = [this.form];

				utils.km.file.UploadDialog.superclass.initComponent.call(this);
			},

			uploadComplete : function(success, response) {
				this.isUploading = false;
				var message;
				if (response) {
					var json = Ext.decode(response);
					success = json.success;
					message = json.message;
				}
				if (success) {
					if (this.fireEvent('complete', this) != false) {
						Ext.msg("info", "上传成功");
						this.hide();
					}
				} else {
					if (this.fireEvent('error', message) != false) {
						if (message)
							Ext.msg("error", message);
						this.hide();
					}
				}
				this.reset();
			},

			reset : function() {
				this.fileField.reset();
				Ext.MessageBox.hide();
				this.uploadButton.enable();
			},
			afterRender : function() {
				utils.km.file.UploadDialog.superclass.afterRender.call(this);
				if (this.fileField.manager.isFlash) {
					var me = this;
					this.fileField.on("fileselected", function() {
								this.manager.startUpload(me.params);
								me.hide();
							}, this.fileField)

					this.fileField.on("uploadcomplete", function(success) {
								this.uploadComplete(success);
							}, this)
				}
			},
			startUpload : function(btn) {
				this.hide();
				var params = this.params || {
					ra : Math.random()
				};
				this.fileField.startUpload({
							params : params,
							url : this.url,
							form : this.form.form.el,
							callback : function(options, success, response) {
								this.uploadComplete(success,
										response.responseText);
							},
							scope : this
						});
				this.isUploading = true;
				this.uploadButton.disable();
			},

			cancelUpload : function() {
				if (this.isUploading) {
					if (this.flashEnabled) {
						this.uploader.stopUpload();
					} else {
						Ext.Ajax.abort(this.uploader)
					}
					this.uploadComplete(false);
				} else {
					this.hide();
					this.reset();
				}
			}

		});
