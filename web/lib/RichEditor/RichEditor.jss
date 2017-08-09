/**
 * 富文本编辑器 Ext扩展,目前具体实现使用CKEditor
 * 
 */
Ext.ns("lib.RichEditor");
window.RICH_EDITOR_BASEPATH = '/lib/RichEditor/'

window.CKEDITOR_BASEPATH = window.RICH_EDITOR_BASEPATH + 'ckeditor/'
window.NETDISK_USINGJSS = "usr.cms.netdisk.using.richeditor";
using("lib.RichEditor.ckeditor.ckeditor");
window.NETDISK_FILE_PATTERN = "^netdisk\\(([a-zA-Z0-9-]{36})\\):(.+)$";
window.NETDISK_FILE_STARTFLAG = "网盘文件:";
window.NETDISK_GETFILE = function(btn){
	if(NETDISK_USINGJSS){
		try{
			using(NETDISK_USINGJSS);
			eval(NETDISK_USINGJSS+"(btn)");
		}catch(e){
		}
	}
}
lib.RichEditor.RichEditor = Ext.extend(Ext.form.TextArea, {
			width : 600,
			height : 400,
			onRender : function(ct, position) {
				if (!this.el) {
					this.defaultAutoCreate = {
						tag : "textarea",
						autocomplete : "off"
					};
				}
				Ext.form.TextArea.superclass.onRender.call(this, ct, position);
				var config = {
					customConfig : '',
					baseFloatZIndex : 7000,
					//skin: 'bootstrapck',
					//skin: 'kama',
					filebrowserUploadUrl : window.RICH_EDITOR_BASEPATH
							+ 'file.jcp',
					width : this.width + "px",
					height : this.height + "px",
					disableObjectResizing : false,
					resize_enabled : false,
					disableNativeTableHandles : true,
//					extraPlugins : 'flvPlayer,musicPlayer',
					extraPlugins : 'flvPlayer',
					toolbar : [{
						name : 'clipboard',
						items : ['Cut', 'Copy', 'Paste',
								'PasteText', 'PasteFromWord']
					}, {
						name : 'editing',
						items : ['Find', 'Replace', 'SelectAll']
					}, {
						name : 'links',
						items : ['Link', 'Unlink', 'Anchor']
					}, {
						name : 'insert',
						/*items : ['Image', 'Flash', 'flvPlayer', 'musicPlayer', 'Table',
								'HorizontalRule', 'SpecialChar', 'PageBreak',
								'Iframe']*/
						items : ['Image', 'Flash', 'flvPlayer', 'Table',
								'HorizontalRule', 'SpecialChar', 'PageBreak',
								'Iframe']
					}, {
						name : 'basicstyles',
						items : ['Maximize', 'ShowBlocks']
					}, '/', {
						name : 'document',
						items : ['Source', 'Preview', 'Print']
					}, {
						name : 'others',
						items : ['Bold', 'Italic', 'Underline', 'Strike',
								'Blockquote', 'Subscript', 'Superscript',
								'RemoveFormat']
					}, {
						name : 'paragraph',
						items : ['NumberedList', 'BulletedList', 'Outdent',
								'Indent', 'JustifyLeft', 'JustifyCenter',
								'JustifyRight', 'JustifyBlock', 'BidiLtr',
								'BidiRtl']
					}, '/', {
						name : 'styles',
						items : ['Styles', 'Format', 'Font', 'FontSize']
					}, {
						name : 'colors',
						items : ['TextColor', 'BGColor']
					}]
				};
				var editor = CKEDITOR.replace(this.id, config);
			},
			onDestroy : function() {
				''
				if (CKEDITOR.instances[this.id]) {
					delete CKEDITOR.instances[this.id];
				}
				Ext.form.TextArea.superclass.onDestroy.apply(this);
			},
			setValue : function(value) {
				Ext.form.TextArea.superclass.setValue.apply(this, [value]);
				var ins = CKEDITOR.instances[this.id];
				if (ins.status == 'loaded') {
					ins.once("instanceReady", function(evt) {
								evt.editor.setData(value);
							});
				} else {
					ins.setData(value);
				}
			},
			getCKEditorFuncNum : function() {
				return CKEDITOR.instances[this.id]._.filebrowserFn;
			},
			getValue : function() {
				CKEDITOR.instances[this.id].updateElement();
				var value = CKEDITOR.instances[this.id].getData();
				Ext.form.TextArea.superclass.setValue.apply(this, [value]);
				return Ext.form.TextArea.superclass.getValue.apply(this);
			},
			getRawValue : function() {
				CKEDITOR.instances[this.id].updateElement();
				return Ext.form.TextArea.superclass.getRawValue(this);
			},
			isDirty : function() {
				if (this.disabled) {
					return false;
				}
				var value = String(this.getValue()).replace(/\s/g, '');
				value = (value == "<br />" || value == "<br/>" ? "" : value);
				this.originalValue = this.originalValue || "";
				this.originalValue = this.originalValue.replace(/\s/g, '');
				return String(value) !== String(this.originalValue)
						? String(value) !== "<p>" + String(this.originalValue)
								+ "</p>"
						: false;
			}
		});

Ext.reg('richeditor', lib.RichEditor.RichEditor);