Ext.namespace("dev.report");

dev.report.AddColumnWindow = function(cols,rt,colName){
	this.rt=rt;
	this.win;

	var report=dev.report.model.report;

	var flds=report.fields;
	console.log(flds);
	var colArray=new Array();
	var i=0;
	for(var j in flds){
		colArray[i]=new Array();
		colArray[i][0]= '$F{'+j+'}';
		colArray[i][1] = '  '+colArray[i][0];
		i++;
	}
   
	var vars=report.variables;
	for(var j in vars){
		colArray[i]=new Array();
		colArray[i][0]= '$V{'+j+'}';
		colArray[i][1] = '  '+colArray[i][0];
		i++;
	}

	var variableExpression;
	if(colName!=null){
		var variable =report.getVariable(colName);
		variableExpression=variable.variableExpression.expression;
	}

	var ds = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:colArray
	});

	var config = {
		store:ds,
		valueField:'id',
		displayField:'label',
		triggerAction:'all',
		mode:'local'
	};

	this.AddColumnPanel = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
        border:true,
		bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   border:false,
				   items: [		
						this.varName = new Ext.form.TextField({
							fieldLabel : "变量名".loc(),
							name: 'varName',
							enableKeyEvents : true,
							width : 178,
							value:colName,
							tabIndex : 1,
							allowBlank:false
						})
					 ]}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   border:false,
				   items: [		
						this.singleSH = new Ext.form.ComboBox(Ext.applyIf({
							id:'source',
							fieldLabel:'引用的资源列'.loc(),
							history:true,
							selectOnFocus:false
						}, config))
					 ]}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						this.custom =new Ext.form.TextArea({
							fieldLabel: '自定义变量'.loc(),
							name: 'custom',
							height:60,
							width: 200,
							value:variableExpression,
							allowBlank:false
						})
				]}
			]
		}
	]
	});
	var colForm=this.AddColumnPanel.form;
	this.singleSH.on('select', function(){
		oldValue=colForm.findField('custom').getValue();
		colForm.findField('custom').setValue(oldValue+this.getValue());
	}, this.singleSH);

	this.win =  new Ext.Window({
		title:'增加自定义列'.loc(),
		layout:'fit',
		width:350,
		height:220,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.AddColumnPanel],
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

Ext.extend(dev.report.AddColumnWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var varName=this.AddColumnPanel.form.findField('varName').getValue();
		var custom=this.AddColumnPanel.form.findField('custom').getValue();
		if(custom){
				var cust={};
				cust.name=varName;  
				this.rt.removeItem(varName);
				var report=dev.report.model.report;
				var fields=[];
				var custString=custom;
				var custString1=custom;
				var minType=2;
				while(custString.indexOf('$F{')!=-1){
					var start=custString.indexOf('$F{')+3;
					var end=custString.indexOf('}');
					var fldStr=custString.substring(start,end);
					custString=custString.substring(end+1,custString.length);
					var fld=report.getField(fldStr);
					var intType=report.typeMap[fld.class1];
					if(intType<minType) minType=intType;
				}  

				while(custString1.indexOf('$V{')!=-1){
					var start=custString1.indexOf('$V{')+3;
					var end=custString1.indexOf('}');
					var fldStr=custString1.substring(start,end);
					custString1=custString1.substring(end+1,custString1.length);
					var var1=report.getVariable(fldStr);
					var intType=report.typeMap[var1.class1];
					if(intType<minType) minType=intType;
				} 

				if(minType==2){
					cust.type='java.lang.Integer';
				}else if(minType==1){
					cust.type='java.lang.Double';
				}else if(minType==0){
					cust.type='java.lang.String';
				}else{
					cust.type='java.lang.String';
				}
				cust.category="V";  
				var customV=new dev.report.model.XVariable(varName);
				customV.class1=cust.type;
				var variableExpression =new dev.report.model.XVariableExpression();
				variableExpression.expression=custom;
				customV.variableExpression=variableExpression;
				report.addVariable(customV);
				this.rt.columns.push(cust);
				this.rt.refresh();
				this.win.close();
		}else{
			this.win.close();
		}
    }
});

