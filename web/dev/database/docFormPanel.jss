Ext.namespace("dev.database");
loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");

dev.database.DocFormPanel = function(frames, parent_id, retFn) {

	this.parent_id = parent_id;
	this.frames = frames;
	this.ButtonArray = [];
	var MetaTable = this.frames.get('MetaTable');
	var wordValue = "";
	this.params = {};

	this.execute = function(type, fn) {
		wordValue = this.content.getValue();
		Ext.Ajax.request({
					url : '/dev/database/docSave.jcp',
					params : {
						content : wordValue,
						type : type,
						object_id : this.object_id
					},
					callback : fn
				});
	}
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : retFn
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '保存'.loc(),
				icon : '/themes/icon/xp/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : function(btn) {
					this.execute("sav", function(options, success, response) {
								var check = response.responseText;
								var ajaxResult = Ext.util.JSON.decode(check)
								if (ajaxResult.success) {
									Ext.msg("info", '文档保存成功!'.loc());
								} else {
									Ext.msg("error", '文档保存失败!,原因:'.loc()+'<br>'
													+ ajaxResult.message);
								}
							});
				}
			}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '建表'.loc(),
				icon : '/themes/icon/database/database_go.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : function() {
					Ext.Ajax.request({
								url : '/dev/database/docCreate.jcp',
								params : {
									content : this.content.getValue(),
									xslType : this.xslType,
									object_id : this.object_id
								},
								scope : this,
								callback : function(options, success, response) {
									if (success && response.responseText) {
										var result = Ext
												.decode(response.responseText);
										if (result.success) {
											Ext.msg("info", '建表成功!'.loc());
											MetaTable.navPanel
													.getTree()
													.loadSubNode(
															result.id,
															MetaTable.navPanel.clickEvent);
										} else {
											Ext.msg("error", result.message);
										}
									} else {
										Ext.msg("error", '提交错误,未能建表!'.loc());
									}

								}
							});
				}
			}));

	this.ButtonArray.push(new Ext.Toolbar.Button({
				text : '下载模板文档'.loc(),
				icon : '/themes/icon/all/basket_put.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				state : 'create',
				scope : this,
				hidden : false,
				handler : function() {
					self.location
							.replace("/dev/database/excelDownload.jcp?xslName="
									+ this.xslType);
				}
			}));

	this.ButtonArray1 = [];

	this.content = new lib.FCKeditor.ExtFckeditor({
				name : 'content',
				id : 'content',
				height : 400,
				hideLabel : true,
				AutoDetectPasteFromWord : false,
				allowBlank : false,
				PluginsPath : '/lib/FCKeditor/editor/plugins/',
				blankText : '必须输入报告模板文档'.loc(),
				ToolbarSet : "Bizdict",
				SkinPath : '/lib/FCKeditor/editor/skins/office2003/'
			});

	var xslType = new Ext.FormPanel({
				fileUpload : true,
				width : 500,
				frame : true,
				title : 'Excel文件上传'.loc(),
				autoHeight : true,
				bodyStyle : 'padding: 10px 10px 0 10px;',
				labelWidth : 80,
				defaults : {
					anchor : '95%',
					allowBlank : false,
					msgTarget : 'side'
				},
				items : {
					xtype : 'fileupload',
					name : 'xslFile',
					fieldLabel : 'Excel文件'.loc(),
					emptyText : '请选择有效的Excel文件'.loc(),
					state : 'new',
					maxSize : 40 * 1024 * 1024,
					width : 200
				},
				buttons : [{
					text : '上传',
					handler : function(btn, param) {
						var xsl = xslType.form;
						if (xsl.isValid()) {
							xsl.submit({
										url : '/dev/database/InputExcel.jcp?parent_id='
												+ parent_id,
										scope : this,
										success : function(form, action) {
											var msg = action.result.message;
											Ext.MessageBox.show({
														title : '成功'.loc(),
														msg : msg,
														buttons : Ext.MessageBox.OK
													});
										},
										failure : function(form, action) {
											var msg = "";
											if (action.result)
												msg = action.result.message;
											else if (action.failureType)
												msg = '提交过程错误'.loc()
														+ action.failureType;
											Ext.MessageBox.show({
														title : '错误'.loc(),
														msg : 'Excel上传失败!,原因:'.loc()+'<br>'
																+ msg,
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
										}
									})
						}
					}
				}]
			});

	this.MainTabPanel = new Ext.Panel({
		id : 'dev.database.DocCreatePanel',
		border : false,
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
					bodyStyle : 'padding:0px 0px 0px 20px;',
					layout : 'form',
					height : 120,
					border : false,
					items : xslType
				}],
		border : false,
		tbar : this.ButtonArray
	});
};

Ext.extend(dev.database.DocFormPanel, Ext.FormPanel, {
			init : function(param) {
				this.params = param;
				this.object_id = param.parent_id
				Ext.Ajax.request({
							url : '/dev/database/docSave.jcp?object_id='
									+ this.object_id + '&' + Math.random(),
							method : "get",
							scope : this,
							callback : function(options, success, response) {
								if (success) {
									var pcs = response.responseText;
									if (pcs.length > 0) {
										this.content.setValue(pcs);
									}
								}
							}.createDelegate(this)
						});
			}

		});
