// 数据服务格式化 js 
dev.dataservice.DataServiceFormat = function(params, retFn) {
	this.params = params;
	this.selectStart = 0;
	this.selectEnd = 0;
	var buttonArray = new Array();
	buttonArray.push(new Ext.Toolbar.Button({
		text : '保存',
		icon : '/themes/icon/xp/save.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		scope : this,
		handler : function() {
			if (this.TXT.getValue()=="") {
				Ext.msg("warn", '数据不能提交,必须输入格式!'.loc());
				return;
			}
			this.MainTabPanel.form.submit({
				params : this.params,
				scope : this,
				success : function(form, action) {
					Ext.msg("info", '格式设定完成!'.loc());
					retFn();
				},
				failure : function(form, action) {
					Ext.msg("error", '数据提交失败!,原因:'.loc()+'<br>' + action.result.message);
				}
			});

		}
	}));
	buttonArray.push(new Ext.Toolbar.Button({
				text : '插入查询结果'.loc(),
				icon : '/themes/icon/all/anchor.gif',
				cls : 'x-btn-text-icon  bmenu',
				scope : this,
				handler : function() {
					using("lib.selectquery.queryWindow");
					var queryWindow = new lib.selectquery.queryWindow(
							this.params['parent_id'], this.selectStart,
							this.selectEnd, this.TXT);
					queryWindow.show();
				}
			}));
	buttonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : retFn
			}));
	this.TXT = new Ext.form.TextArea({
				fieldLabel : '格式'.loc(),
				name : 'content',
				msgTarget:'qtip',
				maxLength : 4000,
				anchor:'80% 90%',
				allowBlank : false,
				maxLengthText : '格式不能超过{0}个字符!'.loc(),
				blankText : '格式必须提供.'.loc()
			});

	this.TXT.on('focus', function() {
		var textBox = this.TXT.getEl().dom;
		if (typeof(textBox.selectionStart) == "number") {
			this.selectStart = textBox.selectionStart;
			this.selectEnd = textBox.selectionEnd;
		} else if (document.selection) {
			var range = document.selection.createRange();
			if (range.parentElement().id == textBox.id) {
				var range_all = document.body.createTextRange();
				range_all.moveToElementText(textBox);
				for (var start = 0; range_all.compareEndPoints("StartToStart",
						range) < 0; this.selectStart++)
					range_all.moveStart('character', 1);
				for (var i = 0; i <= this.selectStart; i++) {
					if (textBox.value.charAt(i) == '\n')
						this.selectStart++;
				}
				var range_all = document.body.createTextRange();
				range_all.moveToElementText(textBox);
				for (var end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; this.selectEnd++)
					range_all.moveStart('character', 1);
				for (var i = 0; i <= this.selectEnd; i++) {
					if (textBox.value.charAt(i) == '\n')
						this.selectEnd++;
				}
			}
		}
	}, this);

	this.loadData=function(objectId){
		this.MainTabPanel.load({
			method : 'GET',
			params:{
				objectId:objectId
			}
		});
	}
	this.MainTabPanel = new Ext.FormPanel({
				url : '/dev/dataservice/DataServiceFormat.jcp',
				bodyStyle:'padding:20 0 0 20;background:#FFFFFF;',
				method : 'POST',
				border : false,
				split : true,
				tbar : buttonArray,
				items : this.TXT
	});
}