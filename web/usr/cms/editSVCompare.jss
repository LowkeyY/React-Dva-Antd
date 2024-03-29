Ext.ns("usr.cms");
using("usr.cms.editPNavMenu");

usr.cms.editSVCompare = function() {
}
usr.cms.editSVCompare.prototype = {
	compareShuxingAndValue : function(shuxings, values) {
		var items = [];
		for (index in shuxings) {
			var shuxing = shuxings[index];
			if (typeof(shuxing) == "string")
				items.push({
							fieldLabel : shuxing,
							name : shuxing,
							value : values.shift()
						})
			else if (typeof(shuxing) == "object") {
				if (shuxing.items)
					items.push({
								xtype : 'fieldset',
								title : shuxing.name || "",
								collapsible : true,
								autoHeight : true,
								width : 1024,
								defaults : {
									width : 600
								},
								defaultType : 'textfield',
								items : this.compareShuxingAndValue(
										shuxing.items, values)
							})
				else
					items.push({
								fieldLabel : shuxing.name,
								name : shuxing.name,
								value : values.shift()
							})
			}
		}
		return items;
	},
	load : function(framePanel, parentPanel, param, prgInfo) {
		this.markWindow = parentPanel.findParentByType(Ext.Window);
		this.param = param;
		this.markWindow.body.mask("正在加载页面，请稍后...");
		Ext.Ajax.request({
			url : '/usr/cms/editSVCompare.jcp?dataId=' + this.param['dataId'],
			scope : this,
			method : 'get',
			success : function(response, options) {
				this.markWindow.body.unmask();
				var result = Ext.decode(response.responseText);
				if (result.success) {
					this.propertyModel = result.datas.propertyModel;
					this.defaultValues = result.datas.defaultValues;
					this.mainPanel = new Ext.FormPanel({
						labelWidth : 230,
						bodyStyle : 'padding:15px 25px 0',
						width : 1024,
						autoScroll : true,
						defaults : {
							width : 600
						},
						defaultType : 'textfield',
						items : this.compareShuxingAndValue(this.propertyModel,
								this.defaultValues),
						buttons : [{
									text : '打印数据',
									handler : function(btn) {
										var frm = this.findParentByType("form");
										if (frm) {
											var value = frm.form.getValues();
											var v = [];
											for (var att in value) {
												v.push(value[att]);
											}
											alert('"' + v.join('","') + '"');
										} else {
											alert("未找到form!");
										}
									}
								}]
					});
					parentPanel.add(this.mainPanel);
					parentPanel.doLayout();
				} else
					Ext.msg("error", "页面载入失败。原因 ： " + '<br>' + result.message);

			},
			failure : function(response, options) {
				this.markWindow.body.unmask();
				Ext.msg("error", "请刷新页面重试。");
			}
		})
	}
}