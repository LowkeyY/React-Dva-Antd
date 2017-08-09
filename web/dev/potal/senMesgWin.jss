Ext.namespace("dev.potal");

dev.potal.senMesgWin = function( btn) {
	Ext.Ajax.request({
			url : '/dev/potal/getAddress.jcp',
			method : 'get',
			scope : this,
			success : function(response, options) {
				var result = Ext.decode(response.responseText);
				this.init(btn,result.data);
			}
		});
}

dev.potal.senMesgWin.prototype = {
	init : function(btn,dataJson) {
		
		var myCheckboxGroup = new Ext.form.CheckboxGroup({  
		    xtype: 'checkboxgroup',  
		    name: 'clickvalue',  
		    id :　'clickvalue',
		    width: '100%',  //宽度220 
		    columns: 1,  //在上面定义的宽度上展示3列  
		    fieldLabel: '选择接口',  
		    items:dataJson
		});  
		
		var txtusername = new Ext.form.TextField({
                width: 400,
                 name: 'address',
                  id :　'address',
                 fieldLabel: '请输入单独需要推送地址'
             });
		
		 var form = new Ext.form.FormPanel({
                 frame: true,
                 width:'100%',
                 height:'100%',
                 html: '',
                 items: [
                 	myCheckboxGroup,txtusername
                 ]
             });
             
        this.form=form;
		var mainPanel = new Ext.Window({
			title : "发送组织机构全量数据",
			icon : '/themes/icon/xp/forward.gif',
			width : 700,
			height : 400,
			layout : 'hbox',
			id : 'formwindow',
			resizable : false,
			form:form,
			defaults : {
				flex : 1,
				border : false
			},
			layoutConfig : {
				align : 'stretch'
			},
			buttons : [{
						text : "发送",
						icon : '/themes/icon/xp/forward.gif',
						handler : function(items) {
							//var win =  Ext.getCmp('formwindow');
							//win.getEl().mask("发送中...");
							var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"请稍后..."});
							myMask.show();
							
							var myCheckboxGroup = Ext.getCmp('clickvalue');
							var ids = [];  
							var cbitems = myCheckboxGroup.items;    
							for (var i = 0; i < cbitems.length; i++) {    
							    if (cbitems.itemAt(i).checked) {    
							        ids.push(cbitems.itemAt(i).name);    
							    }    
							}  
							
							var address= Ext.getCmp('address');
							
							Ext.Ajax.request({
								url : '/dev/potal/SendMessage.jcp?clickvalue='+ids.join(",")+"&address="+address.getValue(),
								method : 'get',
								scope : this,
								success : function(response, options) {
									var result = Ext.decode(response.responseText);
									if(result.success){
										Ext.msg("info", "发送成功");
										mainPanel.close();
									}else{
										Ext.msg("error", result.message);
									}
									myMask.hide();
								}
							});
							
						}
					}, {
						text : "关闭",
						handler : function() {
							mainPanel.close();
						}
					}],
			items : [form]});
			
		mainPanel.show(); 
	},

	getSecondGridStore : function() {
		
	},

	saveMySelf : function(isSave) {
		
	}
}