Ext.namespace("dev.quality");

dev.quality.RuleColumnPanel = function(params,rule){
	this.obj;
	var instance = this;
	this.rule = rule;
	this.params=params;
	this.dataType="unknown";
	var fm = Ext.form;
	var object_id=params['objectId'];
	var Column = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'lname'
	}]);
	
	/*var valuesField =  new fm.TextField({
		name : "charvalue",
		tabIndex : 122,
		//allowBlank:false,
		blankText:"此项为必填."
	});*/
	var valuesField1 =  new fm.TextField({
		name : "charvalue",
		tabIndex : 122,
		//allowBlank:false,
		blankText:"此项为必填.".loc()
	});
	
	/*var opStore=new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : "/dev/quality/getcolumn.jcp",
									method : 'GET'
								}),
						reader : new Ext.data.JsonReader({
									root : 'dataItem',
									totalProperty : 'totalCount',
									id : 'id'
								}, Column),
						remoteSort : false,
						autoLoad : true
	});*/
	
	var opStore = new Ext.data.SimpleStore({
		fields : ['value', 'text'],
		data : [['为空','为空'.loc()],['不为空','不为空'.loc()],['等于', '等于'.loc()],['不等于', '不等于'.loc()],['大于','大于'.loc()],['小于','小于'.loc()],['等于(字段)', '等于(字段)'.loc()],['不等于(字段)', '不等于(字段)'.loc()],['大于(字段)','大于(字段)'.loc()],['小于(字段)','小于(字段)'.loc()],['字段长度','字段长度'.loc()],['foreignIn','foreignIn'],['foreignOut','foreignOut'],['dictIn','dictIn'],['matches','matches']]
	});
	
	var operatorField = new fm.ComboBox({
			name:'operator',
			tabIndex : 121,
			store : opStore,
			valueField : 'value',
			displayField : 'text',
			triggerAction : 'all',
			editable : false,
			//allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});

	operatorField.on('select',function(){
		//valuesField.setDisabled(false);
		var opv = operatorField.getValue();
		tabField.setDisabled(false);
		valuesField1.setDisabled(false);
		colField1.setDisabled(false);
		if(opv == "foreignIn" || opv == "foreignOut"){			
			valuesField1.setDisabled(true);
			colField1.setDisabled(true);
			//valuesField.setValue(opv);
		}else if(opv == "为空" || opv == "不为空"){
			tabField.setDisabled(true);
			valuesField1.setDisabled(true);
			colField1.setDisabled(true);
		}else if(opv.substring(opv.length-4,opv.length)=="(字段)"){
			valuesField1.setDisabled(true);
			tabField.setDisabled(true);
			//colField1.setDisabled(true);
		}else{
			tabField.setDisabled(true);
			colField1.setDisabled(true);
		}
	},this);
	this.colStore=new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : "/dev/quality/getcolumn.jcp?type=col&&object_id="+this.params.object_id,
									method : 'GET'
								}),
						reader : new Ext.data.JsonReader({
									root : 'dataItem',
									totalProperty : 'totalCount',
									id : 'id'
								}, Column),
						remoteSort : false,
						autoLoad : true
	});
	var colField = new fm.ComboBox({
			name:'col',
			tabIndex : 120,
			store : this.colStore,
			valueField : 'id',
			displayField : 'lname',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			//allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});
	var colField1 = new fm.ComboBox({
			name:'col',
			tabIndex : 123,
			store : this.colStore,
			valueField : 'id',
			displayField : 'lname',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			//allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});
	
	colField.on('select',function(){
		var params={};
		params['colname'] = colField.getValue();
		params['type']="tab";
		params['object_id']=this.params.object_id;
		//params['dataType']=arrV[1];
		tabStore.baseParams=params;
		tabStore.load();
		//operatorField.setValue("");
	},this);

	var tabStore=new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : "/dev/quality/getcolumn.jcp",
									method : 'GET'
								}),
						reader : new Ext.data.JsonReader({
									root : 'dataItem',
									totalProperty : 'totalCount',
									id : 'id'
								}, Column),
						remoteSort : false,
						autoLoad : true
	});

	var tabField = new fm.ComboBox({
			name:'col',
			tabIndex : 124,
			store : tabStore,
			valueField : 'id',
			displayField : 'lname',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			mode : 'local'
	});

	var cm = {columns:[{
				id:"name",
				header : "列名".loc(),
				dataIndex : 'lname',
				realValueIndex : 'fieldname',
				width : 120,
				editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
				editor : colField
		},{
				header : "操作符".loc(),
				dataIndex : 'operator',
				width : 100,
				editor : operatorField
		}, {
				header : "过滤值".loc(),
				dataIndex : 'value2',
				width : 400,
				editor : valuesField1
		},{
				header : "列名".loc(),
				dataIndex : 'lname2',
				realValueIndex : 'value3',
				width : 120,
				editorConfig : new lib.RowEditorGrid.RowEditorGrid.ComboBoxConfig(),
				editor : colField1
		},{
				header : "关联表".loc(),
				dataIndex : 'foreignTable',
				width : 400,
				editor : tabField
		}]};
      
	
	this.listStore = new Ext.data.JsonStore({
			fields:['nodeId','fieldname','value2','operator',"value3","foreignTable","lname","lname2"]
	}) ;

	cm = new Ext.grid.ColumnModel(cm);
	this.RuleList = new lib.RowEditorGrid.ListInput({
				viewMode : false,
				enableCtrl : true,
				autoExpandColumn : 'name',
				autoScroll : true,
				border : false,
				cm : cm,
				clicksToEdit : 1,
				frame : false,
				stripeRows : true,
				viewConfig:{forceFit:true},
				minSize : 180,
				height : 420,
				region : 'center',
				store : this.listStore,
				width : 600
	});

	this.RuleList.on('cellclick',function(grid, rowIndex, columnIndex, e){
		var opv = grid.getStore().getAt(rowIndex).get("operator");;
		tabField.setDisabled(false);
		valuesField1.setDisabled(false);
		colField1.setDisabled(false);
		if(opv == "foreignIn" || opv == "foreignOut"){			
			valuesField1.setDisabled(true);
			colField1.setDisabled(true);
			//valuesField.setValue(opv);
		}else if(opv == "为空" || opv == "不为空"){
			tabField.setDisabled(true);
			valuesField1.setDisabled(true);
			colField1.setDisabled(true);
		}else if(opv.substring(opv.length-4,opv.length)=="(字段)"){
			valuesField1.setDisabled(true);
			tabField.setDisabled(true);
			//colField1.setDisabled(true);
		}else{
			tabField.setDisabled(true);
			colField1.setDisabled(true);
		}
	});

	this.RuleList.on("beforeAddClick", function(grid, editors, rowIndex) {
		var ds = grid.getStore();
		var count = ds.getCount();//alert(count);
		if(count == 2)
			conditionTypeWin.show();
		var objName = instance.getObjName(this.editors[1].getValue());
		var newobj = instance.rule.addObj(objName);
		newobj.setFieldName(this.editors[0].getValue());
		var opName = this.editors[1].getValue();
		if(opName.substring(0,1)=="不"){
			newobj.setIsNot("not");
		}
		if(opName == "字段长度"){
			newobj.setLen(this.editors[2].getValue());
		}else if(opName == "foreignIn" || opName == "foreignOut"){
			newobj.setForeignTable(this.editors[4].getValue());
		}else{
			if(opName.substring(opName.length-4,opName.length)=="(字段)"){
				newobj.setValue2(this.editors[3].getValue());
			}else{
				newobj.setValue2(this.editors[2].getValue());
			}
		}
	});

	this.RuleList.on("beforeDelClick", function(grid, editors, rowIndex) {
		var ds = grid.getStore();
		var count = ds.getCount();//alert(count);
		if(count == 3)
			instance.rule.obj.setConditionType("");
		var nodeid = ds.getAt(rowIndex).get("nodeId");
		var node = instance.rule.tree.getNodeById(nodeid);
		instance.rule.obj.getObjItems().remove(node.attributes.params);
		instance.rule.node.removeChild(node);
	});

	var conditionTypeStore = new Ext.data.SimpleStore({
		fields : ['value', 'text'],
		data : [['and', 'and'], ['or', 'or']]
	});
	var conditionTypeField = new fm.ComboBox({
			fieldLabel: '条件关系'.loc(),
			store : conditionTypeStore,
			valueField : 'value',
			displayField : 'text',
			triggerAction : 'all',
			clearTrigger : false,
			editable : false,
			allowBlank:false,
			blankText:"此项为必填.".loc(),
			mode : 'local'
	});

	var conditionTypeForm = new Ext.FormPanel({
        labelWidth: 140, 
		labelAlign: 'right',
        border:false,
        bodyStyle:'padding:30px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
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
						conditionTypeField
					]}
				]
			}
		]
	});

	var conditionTypeWin =  new Ext.Window({
		title:'选择条件组关系'.loc(),
		layout:'fit',
		width:386,
		height:140,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[conditionTypeForm],
		buttons: [
			{
			text: '确定'.loc(),
			scope:this,
			handler: function(){
				instance.obj.setConditionType(conditionTypeField.getValue());
				conditionTypeWin.close();
			}
		},{
			text: '取消'.loc(),
			scope:this,
			handler: function(){
				instance.obj.setConditionType("");
				conditionTypeWin.close();
			}
		}]
	}); 

	/*FieldList.on('cellclick',function(grid, rowIndex, columnIndex, e){
		valuesField.setDisabled(false);
		var opv = grid.getStore().getAt(rowIndex).get("operator");
		if(opv=="IS NULL" || opv=="IS NOT NULL")
			valuesField.setDisabled(true);
		var params={};
		var dtp = grid.getStore().getAt(rowIndex).get("data_type");
		params['type']="dataType";
		params['dataType']=dtp
		opStore.baseParams=params;
		opStore.load();
	});

	this.inp = new Ext.Panel({
		border : false,
		layout : 'border',
		items : [FieldList]
	});
	
	var formPanel = new Ext.Panel({
		layout : 'fit',
		region : 'center',
		style : 'padding:0px 0px 0px 0px;',
		wdith : 400,
		border : false,
		items : this.inp
	});
	this.MainTabPanel = new Ext.Panel({
			id : 'RuleColumnPanel',
			//tbar : ButtonArray,
			layout : 'border',
			border : false,
			items : [formPanel]
	});*/

};

dev.quality.RuleColumnPanel.prototype={
	loadSource : function(pval,obj,tree,params){
		this.colStore.on('load',function(){
			this.obj = obj;
			var tempData = [];
			var items = obj.getObjItems();
			if(items.length>0){
				for(var i=0;i<items.length;i++){
					var td = {};
					td['nodeId'] = items[i].getObjName() + items[i].getName() + this.rule.node.id;
					td['fieldname'] = items[i].getFieldName();
					for(var j=0;j<this.colStore.getCount();j++){
						if(this.colStore.getAt(j).get('id')==items[i].getFieldName())
							td['lname'] = this.colStore.getAt(j).get('lname');
					}
					td['operator'] = items[i].getOperator();
					if(items[i].getObjName()=="XDataLength"){
						td['value2'] = items[i].getLen();
					}else{
						td['value2'] = items[i].getValue2();
						for(var j=0;j<this.colStore.getCount();j++){
							if(this.colStore.getAt(j).get('id')==items[i].getValue2()){
								td['lname2'] = this.colStore.getAt(j).get('lname');
								td['operator'] = items[i].getOperator()+"(字段)".loc();
								td['value3'] = items[i].getValue2();
								td['value2'] = "";
							}
						}
					}
					//td['vlaue3'] = items[i].getValue2();
					//td['value3'] = "";
					if(items[i].getObjName()=="XForeignOut" || items[i].getObjName()=="XForeignIn"){
						td['foreignTable'] = items[i].getForeignTable();
					}else{
						td['foreignTable'] = "";
					}
					tempData.push(td);
				}
				this.RuleList.getStore().loadData(tempData,false);
			}
		},this);
	},
	getObjName : function(operator){
		switch(operator){
			case "为空":
				return "XIsNull";
				break;
			case "不为空":  
				return "XIsNull";
				break;
			case "等于":  
				return "XEquals";
				break;
			case "不等于":  
				return "XEquals";
				break;
			case "大于":  
				return "XLargerThan";
				break;
			case "小于":  
				return "XSmallerThan";
				break;
			case "等于(字段)":  
				return "XEquals";
				break;
			case "不等于(字段)":  
				return "XEquals";
				break;
			case "大于(字段)":  
				return "XLargerThan";
				break;
			case "小于(字段)":  
				return "XSmallerThan";
				break;
			case "foreignIn":  
				return "XForeignIn";
				break;
			case "foreignOut":  
				return "XForeignOut";
				break;
			case "字段长度":  
				return "XDataLength";
				break;
			case "matches":  
				return "XMatches";
				break;
			case "dictIn":  
				return "XDictIn";
				break;
		}
	}

}