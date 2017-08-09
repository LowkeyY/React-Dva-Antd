Ext.namespace("bin.exe");

loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");

bin.exe.uploadExcel = function(w, h, m) {
	this.win;
	this.w = w;
	this.h = h;
	this.m = m;
	this.param = Ext.apply({},m.param);

	this.setExcelPanel = new Ext.FormPanel({
		labelWidth : 80,
		labelAlign : 'center',
		border : true,
		bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
		items : [{
					xtype : 'fileupload',
					fieldLabel : ' 上传Excel文件'.loc(),
					name : 'excelFile',
					state : 'new',
					maxSize : 40 * 1024 * 1024,
					width : 200
				}]
	});
	lib.upload.Uploader.setEnctype(this.setExcelPanel);
	this.win = new Ext.Window({
				title : '上传窗口'.loc(),
				layout : 'fit',
				width : this.w,
				height : this.h,
				scope : parent.WorkBench,
				closeAction : 'hide',
				plain : true,
				modal : true,
				items : [this.setExcelPanel],
				buttonAlign : 'center',
				buttons : [{
							text : '提交'.loc(),
							scope : this,
							handler : this.windowConfirm
						}, {
							text : '取消'.loc(),
							scope : this,
							handler : this.windowCancel
						}]
			});
};

Ext.extend(bin.exe.uploadExcel, Ext.Window, {
			show : function() {
				var frm = this.setExcelPanel.form;
				this.win.show(this);
			},
			windowCancel : function() {
				this.win.close();
			},
			windowConfirm : function() {
				var frm = this.setExcelPanel.form;
				frm.submit({
							url : '/bin/exe/excelTemplate.jcp',
							method : 'POST',
							params : this.param,
							scope : this,
							clientvalidation : true,
							success : function(form, action) {
								//var msg = action.result.message;
								Ext.MessageBox.show({
											title : '成功'.loc(),
											msg : "数据导入成功",
											buttons : Ext.MessageBox.OK
										});
								this.m.getStore().reload({
											params : {}
										});
								this.win.close();
							},
							failure : function(form, action) {
								var msg = "";
								if (action.result)
									msg = action.result.message;
								else if (action.failureType)
									msg = '提交过程错误'.loc() + action.failureType;
								Ext.MessageBox.show({
											title : '错误',
											msg : '数据提交失败!,原因:'.loc() + '<br>'
													+ msg,
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
							}
						});

			}
		});
