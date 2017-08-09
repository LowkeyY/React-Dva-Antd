Ext.namespace("lib.FCKeditor");
/**
 * 在 new ExtFckeditor时,会自动覆盖此oFCKeditorOptions的选项值--tz
 */
var oFCKeditorOptions = {
	BasePath : '/lib/FCKeditor/',
	Config : {
		AutoDetectPasteFromWord : true,// 检测Word格式粘贴,并转成兼容html
		BaseHref : window.location,//
		SkinPath : '/lib/FCKeditor/editor/skins/office2003/',// 皮肤
		ProcessHTMLEntities : false,
		ProcessNumericEntities : false,
		StartupShowBlocks : false,
		ToolbarCanCollapse : true,
		ToolbarSet : 'Default'// 按钮格式
	}
};
lib.FCKeditor.ExtFckeditor = function(config) {
	this.config = config;
	Ext.apply(oFCKeditorOptions.Config, config);
	lib.FCKeditor.ExtFckeditor.superclass.constructor.call(this, config);
	this.loadComplete = false;
};
Ext.extend(lib.FCKeditor.ExtFckeditor, Ext.form.TextArea, {
			getVisibilityEl : function() {
				return this.container;
			},
			onRender : function(ct, position) {
				if (!this.el) {
					this.defaultAutoCreate = {
						id : this.id,
						tag : "textarea",
						name : this.name,
						hidden : true,
						autocomplete : "off"
					};
				}
				Ext.form.TextArea.superclass.onRender.call(this, ct, position);
				if (this.grow) {
					this.textSizeEl = Ext.DomHelper.append(document.body, {
								tag : "pre",
								cls : "x-form-grow-sizer"
							});
					if (this.preventScrollbars) {
						this.el.setStyle("overflow", "hidden");
					}
					this.el.setHeight(this.growMin);
				}
				var fck = new FCKeditor(this.id, this.width, this.height);
				fck.BasePath = oFCKeditorOptions.BasePath;
				fck.ToolbarSet = oFCKeditorOptions.Config.ToolbarSet;
				fck.Config = oFCKeditorOptions.Config;
				fck.ReplaceTextarea();

			},

			setValue : function(value) {
				this.value = value;
				if (this.loadComplete) {
					var oEditor = FCKeditorAPI.GetInstance(this.id);
					if (oEditor != undefined)
						oEditor.SetData(value);
				}
			},

			onComplete : function() {
				this.loadComplete = true;
				if (this.value && this.value.length > 0) {
					this.setValue(this.value);
				}
			},

			getValue : function() {
				if (this.loadComplete) {
					var oEditor = FCKeditorAPI.GetInstance(this.id);
					if (oEditor != undefined)
						this.value = oEditor.GetData();
				}
				return this.value
			},

			onDestroy : function() {
				if (this.tzinterval)
					clearInterval(this.tzinterval);
				this.interval = null;
				lib.FCKeditor.ExtFckeditor.superclass.onDestroy.call(this);
			},

			validateValue : function() {
				return (this.allowBlank == true || this.getValue() != '');
			}

		});

window.FCKeditor_OnExtWindow = function(editorInstance, func) {
	func(window.Ext, Ext.getCmp(editorInstance.Name));
}

window.FCKeditor_OnComplete = function(editorInstance) {
	var cmp = Ext.getCmp(editorInstance.Name);
	if (cmp)
		cmp.onComplete();
}

Ext.reg('fckeditor', lib.FCKeditor.ExtFckeditor);