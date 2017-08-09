Ext.ns('dev.ctrl');
dev.ctrl.JavaExtend = Ext.extend(Ext.Panel, {
	layout : 'border',
	getData : function(config) {
		if (!config.failure)
			config.failure = function(r) {
				if (r && r.err) {
					Ext.msg("warn", '操作失败.原因:'.loc() + r.reason);
				} else if (r && r.reason) {
					Ext.msg("warn", '编译错误,详见控制台窗口提示.'.loc());
					this.statusPanel.update(r.reason.replace(/\n/g, "<br>"));
				} else {
					Ext.msg("warn", '操作失败.'.loc());
				}
			}
		Ext.Ajax.request({
					url : '/dev/ctrl/JavaExtend.jcp',
					method : config.method,
					params : config.params,
					scope : this,
					success : function(response, options) {
						var r = Ext.decode(response.responseText);
						if (r.success) {
							config.success.call(this, r);
						} else {
							config.failure.call(this, r);
						}
					},
					failure : function() {
						config.failure.call(this);
					}
				});
	},
	load : function() {
		this.getData({
			success : function(r) {
				this.codeEditor.setValue.defer(2000, this.codeEditor, [r.data]);
				this.statusPanel.update(this.statusPanel.defaultText);
			},
			method : 'GET',
			params : {
				objectId : this.objectId
			}
		})
	},
	initComponent : function() {
		this.objectId = this.outterParam.parent_id;
		this.codeEditor = new lib.scripteditor.CodeEditor({
					value : '',
					region : 'center',
					split : true,
					hideLabel : true,
					language : "java"
				});
		this.statusPanel = new Ext.Panel({
			title : '信息'.loc(),
			region : 'south',
			height : 200,
			defaultText : '提示:'.loc()+'<ol><li>*'+'请不要更改此类的类名'.loc()+'</li><li>*'+'不要给此类添加package语句,即不要添加包名'.loc()+'</li><li>*'+'如果一次需要监听多个事件,请在initializeEvent方法中多调用几次this.on方法'.loc()+'</li><li>*'+'各个事件的参数,请参考手册'.loc()+'</li></ol>',
			split : true
		});
		this.items = [this.codeEditor, this.statusPanel];
		this.tbar = [new Ext.Toolbar.Button({
							text : '保存'.loc(),
							icon : '/themes/icon/xp/save.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								this.getData({
											success : function(r) {
												Ext.msg("info", '保存成功'.loc());
											},
											method : 'POST',
											params : {
												data : this.codeEditor
														.getValue(),
												objectId : this.objectId
											}
										})
							}
						}), new Ext.Toolbar.Button({
							text : '删除'.loc(),
							icon : '/themes/icon/xp/delete.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								this.getData({
											success : function(r) {
												Ext.msg("info", '删除成功'.loc());
												this.load();
											},
											method : 'DELETE',
											params : {
												objectId : this.objectId
											}
										})
							}
						}), new Ext.Toolbar.Button({
							text : '编译'.loc(),
							icon : '/themes/icon/all/script_go.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								this.getData({
											success : function(r) {
												Ext.msg("info", '编译成功'.loc());
											},
											method : 'PUT',
											params : {
												data : this.codeEditor
														.getValue(),
												objectId : this.objectId
											}
										})
							}
						}), new Ext.Toolbar.Button({
							text : '返回'.loc(),
							icon : '/themes/icon/xp/undo.gif',
							cls : 'x-btn-text-icon  bmenu',
							scope : this,
							handler : function() {
								this.outterParam.returnFunction();
							}
						})]
		dev.ctrl.JavaExtend.superclass.initComponent.call(this);
		this.load();
	}
});