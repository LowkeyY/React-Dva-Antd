Ext.ns("ExternalItems.haiwaizhishigongxiang");
// using("ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit");
// ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit(mySelfConfig, json, param, parentPanel);
ExternalItems.haiwaizhishigongxiang.MailFileAttBeforeInit = function(mySelfConfig, json, param, parentPanel) {
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
		COUNTRY_ID : "REGION_ID",
		BASIN_ID : "REGION_ID",
		PLAY_ID : "BASIN_ID",
		FIE_ID : "BASIN_ID"
	} , afterRelations = {} , relationTables = {
		REGION_ID : "dir_zyzl_region",
		COUNTRY_ID : "dir_zyzl_country",
		PLAY_ID : "dir_zyzl_play",
		BASIN_ID :"dir_zyzl_basin",
		FILE_DEPT:"dir_zyzl_ssdw"
	};
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
	var pageEdit = param.pageType === "edit" , currentData = Ext.apply({},json.data);
	var packingChild = function(c){
		c.store = new Ext.data.JsonStore(Ext.apply({
			url : "/ExternalItems/haiwaizhishigongxiang/MailpropertyStoreGetData.jcp?spaceId="+param.oldexportData,
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
			//"emptyText" : "请选择...",
			listeners : {
				change : function(combo) {
					if (this.afterRelation) {
						var frm = this.findParentByType("form"), field;
						if (frm)
							Ext.each(this.afterRelation, function(c) {
								if (field = (frm.form.findField(c) || frm.form.findField(c.toUpperCase()))){
									frm.changeCountryAllowBlank();
									field.setValue({text:"",value:""});
									field.getStore().load({params : {exportData : combo.getValue()}});
								}
							})
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
			if(c.name.toUpperCase() == "IS_RESULT"){
				c.hidden = true;
			}
			if(c.xtype == "textarea"){
				c.height = 44;
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
