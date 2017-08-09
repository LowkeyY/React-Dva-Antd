Ext.ns("lib.file.ddupload");
/**
 * 拖放上传控件,用于将操作系统文件夹中的文件直接拖放到网页上实现文件上传,完后刷新页面<br>
 * 本控件只能在支持HTML5的浏览器中使用.
 * 
 * @author tz
 * @since 2013/01/25
 * 
 * 
 * <br>
 * 例如:将文件拖放到网页中一个id为testdiv的<div>里,后台自动将文件上传到/usr/sample.jcp中 <br> *
 * 
 * <pre><code>
 * var divEl = Ext.getEl(&quot;testDiv&quot;);
 * var dragUpload = new lib.file.ddupload.DragDropUpload(divEl, {
 * 			url : '/usr/sample.jcp'
 * 		});
 * dragUpload.on(&quot;afterupload&quot;, function() {
 * 			this.refresh();
 * 		}, this);
 * dragUpload.on(&quot;error&quot;, function() {
 * 			this.refresh();
 * 		}, this);
 * </code></pre>
 * 
 */
lib.file.ddupload.DragDropUpload = function(el, config) {
	config = config || {};
	this.initialConfig = config;
	Ext.apply(this, config);
	this.addEvents(

			/**
			 * @event beforedrop 当文件放到目标对象上后触发,如果返回false则放弃此次上传
			 * @param {lib.file.ddupload.DragDropUpload}
			 *            当前对象
			 * @param {array}
			 *            上传的文件列表
			 * @param {Ext.EventObject}
			 *            事件对象
			 */
			'beforedrop',
			/**
			 * 文件上传完毕后触发事件
			 */

			'uploadcomplete',
			/**
			 * 文件上传过程中发生错误触发此事件 如果返回false则不弹出错误信息
			 * 
			 * @param {Object}
			 *            错误说明,其中的message属性为错误信息.
			 */
			'error'

	);

	this.el = Ext.get(el);
	Ext.EventManager.addListener(this.el, 'dragenter', function(e) {
				e.stopEvent();
			});
	Ext.EventManager.addListener(this.el, 'dragover', function(e) {
				e.stopEvent();
			});
	Ext.EventManager.addListener(this.el, 'drop', this.onDrop, this);
	if (!this.progressBar) {
		this.progressBar = lib.file.ddupload.ProgressBar;
	}
}
Ext.extend(lib.file.ddupload.DragDropUpload, Ext.util.Observable, {

			// attributes
			/**
			 * @cfg {Regext} typeReg
			 *      <p>
			 *      文件类型过滤,需要传入一个正则表达式对象,如:只要图片则传入:\/image*\/
			 *      </p>
			 */
			/**
			 * @cfg {String} typteRegText
			 *      <p>
			 *      文件类型过滤时要提示的错误信息,如果未设此字段,则该文件自动忽略,不会上传
			 *      </p>
			 */
			/**
			 * @cfg {String} fileFieldName
			 *      <p>
			 *      上传时,文件那个Field的名称,默认值是"file-upload"
			 *      </p>
			 */
			fileFieldName : "file-upload",
			/**
			 * @cfg {String} url
			 *      <p>
			 *      接收上传文件的地址
			 *      </p>
			 */

			// private
			uploading : false,
			files : [],

			onUploadFinish : function(success, message) {
				this.progressBar.hide();
				if (success) {
					this.fireEvent('uploadcomplete', this);
				} else {
					if (this.fireEvent('error', scope, message) != false) {
						Ext.msg("error", message);
					}
				}
				this.uploading = false;
				this.files = [];
			},
			uploadFile : function() {
				if (this.files.length == 0) {
					this.onUploadFinish(true);
					return;

				}
				var file = this.files.shift();
				this.progressBar.setFile(file);
				this.sendFile(file, this.createFormData(file));

			},
			onDestroy : function() {
				this.progressBar.destroy();
				this.xhr = null;
				this.files = null;
			},
			createFormData : function(file) {
				var formData = new FormData();
				formData.append(this.fileFieldName, file);

				if (Ext.isObject(this.params)) {
					for (var name in this.params) {
						formData.append(name, this.params[name]);
					}
				}
				return formData;
			},
			onDrop : function(e) {

				e.stopEvent();
				var files = e.browserEvent.dataTransfer.files;
				if (this.fireEvent('beforedrop', this, files, e) == false) {
					return;
				}
				if (this.uploading === true) {
					return;
				}
				this.uploading = true;

				var total = 0;
				var fileArr = [];
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					if (this.typeReg) {
						if (!file.type.match(this.typeReg)) {
							if (this.typeRegText) {
								this.onUploadFinish(false, this.typeRegText);
							} else {
								continue;
							}
						}

					}
					fileArr.push(file);
					total += file.size;
				}
				this.progressBar.show(total);
				this.files = fileArr;
				this.uploadFile();
			},
			getXHR : function() {
				if (!this.xhr) {

					var xhr = new XMLHttpRequest();
					var scope = this;
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4) {
							scope.progressBar.add();
							var st = xhr.status;
							if (st > 199 && st < 300) {
								var strValue = xhr.responseText;
								if (strValue) {
									var json = Ext.decode(strValue);
									if (json.success) {
										scope.uploadFile();
									} else {
										scope.onUploadFinish(false,
												json.message);
									}
								} else {
									scope.uploadFile();
								}
							} else {
								scope.onUploadFinish(false, CPM ? CPM
												.getResponeseErrMsg(xhr) : st);
							}
						}
					};

					Ext.EventManager.addListener(xhr.upload, 'progress',
							function(e) {
								var bytes = e.browserEvent.loaded;
								this.progressBar.add(bytes);
							}, this);
					this.xhr = xhr;
				}
				return this.xhr;
			},
			sendFile : function(file, content) {
				var xhr = this.getXHR();
				xhr.open('post', this.url, true);
				if (Ext.isChrome) {
					xhr.send(content);
				} else {
					xhr.sendAsBinary(content);
				}
			}

		});

// 提供一个最简单的ProgressBar模型,也可以重载这几个方法搞出人人网那种超酷的效果--tz

lib.file.ddupload.ProgressBar = {
	visible : false,
	timer : false,
	fileSize : 0,
	base : 0,
	fileName : "",
	total : 0,
	cur : 0,
	msg : null,
	show : function(total) {
		this.total = total;
		this.timer = this.showRealBar.defer(300, this);
	},
	showRealBar : function() {
		this.visible = true;
		this.msg = Ext.MessageBox.progress("上传文件", "正在上传文件:" + this.fileName);
		this.msg.updateProgress(this.cur / this.total);
	},
	setFile : function(file) {
		if (this.fileSize > 0) {
			this.base = this.base + this.fileSize;
		}
		this.fileSize = file.size;
		this.fileName = file.name;
		if (this.visible) {
			this.msg.updateText("正在上传文件:" + this.fileName);
		}
	},
	add : function(bytes) {
		bytes = bytes ? bytes * 0.9 : this.fileSize;
		if (this.visible) {
			this.msg.updateProgress((this.base + bytes) / this.total);
		} else {
			this.cur = this.base + bytes;
		}
	},
	destroy : function() {
		this.msg = null;
	},
	hide : function() {
		if (this.visible) {
			this.msg.hide();
			this.msg = null;
		} else {
			clearTimeout(this.timer);
		}
		this.visible = false;
		this.fileSize = 0;
		this.cur = 0;
		this.total = 0;
		this.base = 0;
	}
}
