
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.control");

dev.report.base.dlg.control.Content = function(callback, _pre, tabOffset, thats) {
	if (!tabOffset) {
		tabOffset = 0
	}
	var urlRadio = new Ext.form.Radio({
				checked : (_pre.cnttype == "url" || !_pre.cnttype)
						? true
						: false,
				name : "radioContent",
				tabIndex : tabOffset + 1,
				hideLabel : false,
				boxLabel : "URL".localize(),
				listeners : {
					check : function(thisRb, isChecked) {
						if (isChecked) {
							urlFld.enable();
							htmlBtn.disable()
						}
					}
				}
			});
	var urlFld = new Ext.form.Field({
				width : 380,
				tabIndex : tabOffset + 2,
				hideLabel : true,
				disabled : (_pre.cnttype == "url" || !_pre.cnttype)
						? false
						: true
			});
	var urlPan = new Ext.Panel({
				layout : "column",
				baseCls : "x-plain",
				border : false,
				items : [new Ext.Panel({
									baseCls : "x-plain",
									width : 60,
									labelWidth : 30,
									items : [urlRadio]
								}), new Ext.Panel({
									baseCls : "x-plain",
									autoWidth : true,
									items : [urlFld]
								})]
			});
	var htmlRadio = new Ext.form.Radio({
				name : "radioContent",
				hideLabel : false,
				tabIndex : tabOffset + 3,
				checked : (_pre.cnttype == "html") ? true : false,
				boxLabel : "HTML",
				listeners : {
					check : function(thisRb, isChecked) {
						if (isChecked) {
							urlFld.disable();
							htmlBtn.enable()
						}
					}
				}
			});
	var tmpHtml = "";
	var setFn = function(src) {
		tmpHtml = src
	};
	var htmlBtn = new Ext.Button({
				id : "htmlBtn",
				iconCls : "icon_macro",
				disabled : (_pre.cnttype == "url" || !_pre.cnttype)
						? true
						: false,
				tabIndex : tabOffset + 4,
				ctCls : dev.report.kbd.tags.NO_ENTER,
				text : "Editor".localize(),
				cls : "x-btn-icon-text",
				handler : function() {
					htmlRadio.setValue(true);
					using("dev.report.base.dlg.InsertMacro");
					var macro=new dev.report.base.dlg.InsertMacro({
										operation : "edit",
										macro : tmpHtml
					}, false, "html", setFn);
				}
			});
	var htmlPan = new Ext.Panel({
				layout : "column",
				baseCls : "x-plain",
				bodyStyle : "padding-top: 10px;",
				labelWidth : 30,
				border : false,
				items : [new Ext.Panel({
									baseCls : "x-plain",
									width : 60,
									labelWidth : 30,
									items : [htmlRadio]
								}), new Ext.Panel({
									baseCls : 100,
									items : [htmlBtn]
								})]
			});
	var fsCnt = Ext.extend(Ext.form.FieldSet, {
				getData : function() {
					var data = {
						type : (urlRadio.checked) ? "url" : "html",
						cnt : (urlRadio.checked) ? urlFld.getValue() : tmpHtml
					};
					return data
				},
				initComponent : function() {
					Ext.apply(this, {});
					fsCnt.superclass.initComponent.call(this)
				}
			});
	var fsContent = thats.containers.contentpan = new fsCnt({
				title : "Content".localize(),
				collapsible : false,
				id : "cnt_pan",
				autoWidth : true,
				autoHeight : true,
				items : [urlPan, htmlPan]
			});
	if (_pre.cnttype == "url") {
		urlFld.setValue(_pre.cnt)
	} else {
		tmpHtml = _pre.cnt
	}
	callback(fsContent)
};