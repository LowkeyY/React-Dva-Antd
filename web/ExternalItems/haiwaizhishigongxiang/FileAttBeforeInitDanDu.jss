Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("lib.TreeWidget.TreeWidget");
using("lib.ComboTree.ComboTree");
// using("ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit");
// ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit(mySelfConfig, json, param, parentPanel);
ExternalItems.haiwaizhishigongxiang.FileAttBeforeInitDanDu = function(mySelfConfig, json, param, parentPanel) {
	if(mySelfConfig.loadResult)
		mySelfConfig.loadResult = mySelfConfig.loadResult.createInterceptor(
				function(result) {
					if(Ext.isObject(result.data)){
						this.defualtLoadData = Ext.apply({},result.data);
						for(var att in this.columnBeforeRelations)
							this.formatDataValue(result.data, att);
						if(result.data.FILE_CLASS){
							this.changeFiledVisible(result.data.FILE_CLASS.value);
						}
						/* 预览状态 隐藏无数据的列
						if(this.param.pageType === "view"){
							var field;
							for(var att in result.data){
								if(!result.data[att] && (field = this.form.findField(att)))
									field.setVisible(false);
							}
						}*/
					}
				});	
	else			
		mySelfConfig.defualtLoadData = Ext.apply({},json.data);
	
	mySelfConfig.formatDataValue = function(obj , key){
		var value = obj[key];
		if(value && Ext.isString(value) && value.indexOf("::") > -1)
			obj[key] = {value : value , text : value.split("::")[1]};
	};
	
	var beforeRelations = {
/*		COUNTRY_ID : "REGION_ID",
		BASIN_ID : "REGION_ID",
		PLAY_ID : "BASIN_ID",
		FIE_ID : "BASIN_ID"*/
	} , afterRelations = {} , relationTables = {/*
		REGION_ID : "dir_zyzl_region",
		COUNTRY_ID : "dir_zyzl_country",
		PLAY_ID : "dir_zyzl_play",
		BASIN_ID :"dir_zyzl_basin",
		FILE_DEPT:"dir_zyzl_ssdw"
	*/};
	if(json.relationShowFiled){
		Ext.apply((mySelfConfig.relationShowFiled = {}) , json.relationShowFiled);
		delete json.relationShowFiled;
	}
	if(json.relationChangeFiled){
		Ext.apply(beforeRelations , json.relationChangeFiled);
		delete json.relationChangeFiled;
	}
	
	for(var att in beforeRelations){
		var key = beforeRelations[att];
		if(afterRelations[key])
			afterRelations[key].push(att);
		else
			afterRelations[key] = [att];
	}
	mySelfConfig.columnBeforeRelations = {};
	mySelfConfig.getStringValue = function(value){
		return Ext.isObject(value) ? value.value : value;
	}
	mySelfConfig.changeCountryAllowBlank = function(){
		var country = this.form.findField("COUNTRY_ID") , fileclass , region;
		if(country && (fileclass = this.form.findField("FILE_CLASS")) && (region = this.form.findField("REGION_ID"))){
			if (!country.old_fieldLabel) {
				country.old_fieldLabel = country.fieldLabel;
			}
			var allowBlank = true , fileds , value; 
			if((fileds = this.relationShowFiled[fileclass.getValue() || this.getStringValue(this.defualtLoadData[fileclass.name])]) && fileds[country.name]){
				allowBlank = (region.getValue() || (this.defualtLoadData && this.getStringValue(this.defualtLoadData[region.name]))) == "0::全球";
			}
			country.allowBlank = allowBlank;
			country.label && (country.label.dom.innerHTML = (country.old_fieldLabel + (!allowBlank ? '<font color=\"red\">*</font>:' : ':'))); 	
		}
	}
	
	mySelfConfig.hiddenFieldNodeId = function(value){
		var field = this.form.findField("NODE_ID") , fieldC;
		if(field && value){
			field.setReadOnly(this.getStringValue(value) == "8afaec81-53efdc82-0153-efdc829f-0000");
			this.changeValueNodeId();
		}
	}
	mySelfConfig.changeValueNodeId = function(){
		var field = this.form.findField("NODE_ID") , fieldC , node ;
		if(field && field.readOnly && (fieldC = this.form.findField("COUNTRY_ID")) && fieldC.menuTree && (node = fieldC.menuTree.getNowNode())){
			field.setValue({text : fieldC.getText() , value:fieldC.getValue()});
			var path = "" , counts = 0;
			while(node && node.prop._id != "top"){
				if(counts > 50)
					break;
				path = "/" + node.prop.title + path;
				node = node.parent;
				counts++;
			};
			if(!Ext.isEmpty(path)){
				var text = "" ;
				if((fieldC = this.form.findField("SPACE_ID")) && fieldC.getText())
					text = "/" + fieldC.getText();
				field.el.dom.value = text + path;
			}
		}
	}
	
	
	mySelfConfig.changeFiledVisible = function(key){
		var visible;
		if(this.relationShowFiled && (visible = this.relationShowFiled[key])){
			this.changeCountryAllowBlank();
			this.cascade(function(item){
				if(/^att_(\d+)$/ig.test(item.name) || item.name == "IS_RESULT"){
					item.setVisible(visible[item.name]);
					item.setDisabled(!visible[item.name]);
				}
			});
		}
	}
	
	mySelfConfig.NodeClick = function(){
		var value=this.form.findField('SPACE_ID').getValue();
		if(!value){
			Ext.msg("warn", "请先选择空间。");
		}
	}
	
	mySelfConfig.showR=function(c){
		var form=this.findParentByType("form");
		var classValue=form.form.findField('COUNTRY_ID').getValue();
		if(classValue=="ac886ab6-1cf8-4ede-bc2f-633083f0ed0a"){
			if(c.inputValue=="1"||c.inputValue=="3"||c.inputValue=="2"){
				c.show();
			}else{
				c.hide();
			}
			if(c.inputValue=="1"){
				c.setValue(true);
			}
		}else if(classValue=="e1c54e40-8d7d-4d60-a0b1-73fac2308f23" || classValue=="ae3345f7-a7c3-47ce-90e0-8aa7f4547228"
			  || classValue=="ad4886bb-aeec-4d81-98bd-a30f4a661743" || classValue=="fc341da5-9d83-4ec9-9d92-ba615cecca7c"
			  || classValue=="45880cb3-5daf-44b6-b4dd-3161d9edb66a" || classValue=="e49a4dd4-6f5f-432f-bf3c-b95285abc9c6"
			  || classValue=="e5da7005-7b71-4b1c-8410-e98a5e8507c9"
		){
			if(c.inputValue=="4"||c.inputValue=="5"){
					c.show();
			}else{
				c.hide();
			}
			if(c.inputValue=="4"){
				c.setValue(true);
			}
		}else if(classValue=="6d0c9c91-693e-4628-95cf-87d17bc9121e" || classValue=="5be8a4f9-51c1-461d-8845-a3a8e56ef930"){
			if(c.inputValue=="6"||c.inputValue=="7"){
					c.show();
			}else{
				c.hide();
			}
			if(c.inputValue=="6"){
				c.setValue(true);
			}
		}else{
			c.hide();
			c.setValue(false);
		}
	}
	
	mySelfConfig.TypeClick = function() {
		var classValue=this.form.findField('COUNTRY_ID').getValue();
		var type = this.form.findField('ATT_1');
		type.show();
		Ext.each(type.items.items, this.showR);
	}
	
	mySelfConfig.resetNodeField = function(newValue) {
		var field;
		if ((field = this.form.findField('NODE_ID'))) {
			if(field.getValue())
				field.setValue();
			var value =  newValue;
			if(!value){
				value = this.form.findField('SPACE_ID').getValue()
			}
			if(field.view){
				field.view.root.eachChild(function(node) {
							if (node.attributes.relationId != value)
								node.getUI().hide();
							else
								node.getUI().show();
						});
				field.restrictHeight();	
			}
		}
	}
	
	var packingChild22 = function(c){
		var isNode = (c.name == 'NODE_ID');
		c.loader = new Ext.tree.TreeLoader({
					url : '/ExternalItems/haiwaizhishigongxiang/UpFileGetNode.jcp',
					method : 'Post',
					autoLoad : true,
					baseParams : {
						types : c.name
					}
				});
		var rootNode = new Ext.tree.AsyncTreeNode(Ext.apply({
					text : 'root',
					id : 'root',
					fieldId : c.id
				}, !isNode ? {} : {
					listeners : {
						'expand' : function(node) {
							var field , frm ;
							if ((field = Ext.getCmp(node.attributes.fieldId)) && (frm = field.findParentByType("form")))
								frm.resetNodeField();
						}
					}
				}))
		Ext.apply(c, {
				editable : false,
				rootVisible : false,
				panelId : mySelfConfig.id,
				mode : 'local',
				treeConfig : {
					rootVisible : false,
					panelId : mySelfConfig.id
				},
				root : rootNode
		});
	}
	
	
	
	var pageEdit = param.pageType === "edit" , currentData = Ext.apply({},json.data);
	var packingChild = function(c){
		c.store = new Ext.data.JsonStore(Ext.apply({
			url : "/ExternalItems/haiwaizhishigongxiang/propertyStoreGetData.jcp",
			root : "root",
			fields : ['text', 'value'],
			method : 'POST'
		}, param.pageType === "edit" ? {
			autoLoad : true,
			baseParams : {
				relationTable : c.relationTable,
				exportData : currentData[c.beforeRelation] || ""
			}
		} : {
			autoLoad : true,
			//autoLoad : !c.beforeRelation,
			baseParams : {
				relationTable : c.relationTable
			}
		}));
		Ext.apply(c , {
			"hiddenName" : c.name,
			"displayField" : "text",
			"translateItems" : true,
			"valueField" : "value",
			"mode" : "local",
			"triggerAction" : "all",
			"selectOnFocus" : true,
			//"emptyText" : "请选择...",
			listeners : {
				change : function(combo) {
					if (this.afterRelation) {
						var frm = this.findParentByType("form"), field;
						if (frm){
							frm.changeCountryAllowBlank();
							Ext.each(this.afterRelation, function(c) {
								if (field = (frm.form.findField(c) || frm.form.findField(c.toUpperCase()))){
									field.setValue({text:"",value:""});
									field.getStore().load({params : {exportData : combo.getValue()}});
								}
							})
						}
					}
				},
				beforequery : function() {
					if (this.beforeRelation) {
						var frm = this.findParentByType("form"), field;
						if (frm && (field = frm.form.findField(this.beforeRelation)) && field.getValue() == "" && field.fieldLabel) {
							field.onFocus({});
							Ext.msg("warn", "请先选择\"" + field.fieldLabel + "\"");
							return false;
						}
					}
				}
			}
		});
	}
	
	
	var fn = function(c) {
		if (c.items) {
			if(c.name == "ATT_1"){
				c.hidden = true;
			}
			Ext.each(c.items, fn);
		} else {
			if(Ext.isDefined(afterRelations[c.name]))
				c.afterRelation = afterRelations[c.name];
			if(Ext.isDefined(beforeRelations[c.name]))
				c.beforeRelation = beforeRelations[c.name];
			if(Ext.isDefined(relationTables[c.name])){
				c.relationTable = relationTables[c.name];
				c.xtype = "combo";
				packingChild(c);
			}
			if(/^att_(\d+)$/ig.test(c.name)){
				c.hidden = true;
				if(json.filedConfigs && json.filedConfigs[c.name])
					Ext.apply(c , json.filedConfigs[c.name]);
				if(c.xtype == "combo"){
					packingChild(c);
				}
			}
			


			
			
			if(c.name.toUpperCase() == "COUNTRY_ID"){
				c.reset = Ext.emptyFn;
				c.listeners = {
					select : function(combo , record, index){
						var frm = this.findParentByType("form");
						if(frm){
							frm.changeValueNodeId();
							frm.TypeClick();
						}
					}
				};
			}
			
			if(c.name.toUpperCase() == "FILE_CLASS"){
				c.reset = Ext.emptyFn;
				c.listeners = {
					select : function(combo , record, index){
						var frm = this.findParentByType("form");
						if(frm)
							frm.changeFiledVisible(record.get("value"));
					}
				};
			}
			
			if (c.name == 'NODE_ID'){
				c.id = Ext.id();
				c.beforeRelation = true;
				c.oldType = c.xtype;
				c.xtype = "combotree";
				packingChild22(c);
				c.listeners = {
					'select' : function(combo , node, e) {
						var path = "";
						do{
							path = "/"+node.text + path;
							node = node.parentNode;
						}while(node && !node.isRoot);
						if(!Ext.isEmpty(path))
							this.el.dom.value = path;
					},'focus':function(combo , node, e){
						var frm ;
						if(frm = combo.findParentByType("form")){
							frm.NodeClick();
						}
					}
				};
			}
			
			if(c.name.toUpperCase() == "SPACE_ID"){
				c.reset = Ext.emptyFn;
				c.allowDisable = Ext.isDefined(json.disableSpaceId) && json.disableSpaceId;
				c.allowSpaceValues = Ext.isDefined(json.disableSpaceValues) ? json.disableSpaceValues : "";
				c.listeners = {
					'expand': function(combo){
						var allowValue;
						if(this.allowDisable && (allowValue = this.allowSpaceValues) && this.store.getCount() == 0){
							this.store.on("load" , function(st){
								st.filterBy(function(item){
									return allowValue.indexOf(','+item.get("value")+',') != -1;
								})
								combo.restrictHeight();
							})
						}
					},
					'change' : function(combo , newValue, oldValue){
						var frm ;
						if(frm = combo.findParentByType("form")){
							frm.resetNodeField(newValue);
							frm.hiddenFieldNodeId(newValue);
						}
					}
				};
			}
			if(c.name.toUpperCase() == "IS_RESULT"){
				c.hidden = true;
			}
			if(c.xtype == "textarea"){
				c.height = 80;
				if(c.onTransferToView && Ext.isFunction(c.onTransferToView))
					c.onTransferToView = c.onTransferToView.createSequence(function(c){
						c.height = 44;
					});
			};
			if(c.relationTable)
				mySelfConfig.columnBeforeRelations[c.name] = true;
		}
	}
	Ext.each(json.model, fn);
	delete json.filedConfigs;
}
