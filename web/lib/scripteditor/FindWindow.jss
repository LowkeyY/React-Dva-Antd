Ext.namespace("dev.workflow.popup");

lib.scripteditor.FindWindow = function(type,pattern){
	this.type=type;
	this.pattenValue="";
	this.replaceValue="";
	this.jumpValue=0;
	var patternTxf = new Ext.form.TextField({
				fieldLabel : '查找'.loc(),
				name: 'find',
				enableKeyEvents : true,
				tabIndex : 1,
				value : pattern,
				width : 210
	});
	var replaceTxf = new Ext.form.TextField({
				fieldLabel : '替换'.loc(),
				name: 'replace',
				enableKeyEvents : true,
				tabIndex : 2,
				width : 210
	});
	var jumpTxf =new Ext.form.NumberField({
				fieldLabel: '跳转到'.loc(),
				name: 'jump',
				width: 210,
				allowDecimals:false,
				allowBlank:false,
				value:1
	});
	var itemsArray=[];
	var titleString="";
	if(type=='find'){
		titleString='查找'.loc();
		itemsArray.push(patternTxf);
	}else if(type=='replace'){
		titleString='替换'.loc();
		itemsArray.push(patternTxf);
		itemsArray.push(replaceTxf);
	}else{
		titleString='跳转到'.loc();
		itemsArray.push(jumpTxf);
	}
	this.baseForm = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
        border:false,
        bodyStyle:'padding:10px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items:itemsArray
	});

//-------------------------页面设定----------------------------------------------------------------

	this.win =  new Ext.Window({
		title:titleString,
		layout:'fit',
		width:400,
		height:140,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.baseForm],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: this.windowConfirm
		},{
			text: '取消'.loc(),
			scope:this,
			handler: this.windowCancel
		}]
	});
};
Ext.extend(lib.scripteditor.FindWindow, Ext.Window, {
	show : function(){
		this.win.show(this);
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		if(this.type=='find'){
			this.pattenValue=fm.findField('find').getValue();
		}else if(this.type=='replace'){
			this.pattenValue=fm.findField('find').getValue();
			this.replaceValue=fm.findField('replace').getValue();
		}else{
			this.jumpValue=fm.findField('jump').getValue();
		}
		this.win.close();
    }
});