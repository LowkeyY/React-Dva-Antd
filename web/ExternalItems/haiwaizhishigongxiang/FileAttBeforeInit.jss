Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("lib.TreeWidget.TreeWidget");
using("lib.ComboTree.ComboTree");
// using("ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit");
// ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit(mySelfConfig, json,
// param, parentPanel);
ExternalItems.haiwaizhishigongxiang.FileAttBeforeInit = function(mySelfConfig,
		json, param, parentPanel) {
	if (mySelfConfig.loadResult)
		mySelfConfig.loadResult = mySelfConfig.loadResult.createInterceptor(
				function(result) {
					if (Ext.isObject(result.data)) {
						this.defualtLoadData = Ext.apply({}, result.data);
						for (var att in this.columnBeforeRelations)
							this.formatDataValue(result.data, att);
						if (result.data.FILE_CLASS) {
							this
									.changeFiledVisible(result.data.FILE_CLASS.value);
						}
						/*
						 * 预览状态 隐藏无数据的列 if(this.param.pageType === "view"){ var
						 * field; for(var att in result.data){
						 * if(!result.data[att] && (field =
						 * this.form.findField(att))) field.setVisible(false); } }
						 */
					}
				});
	else
		mySelfConfig.defualtLoadData = Ext.apply({}, json.data);

	mySelfConfig.formatDataValue = function(obj, key) {
		var value = obj[key];
		if (value && Ext.isString(value) && value.indexOf("::") > -1)
			obj[key] = {
				value : value,
				text : value.split("::")[1]
			};
	};

	var beforeRelations = {
	/*
	 * COUNTRY_ID : "REGION_ID", BASIN_ID : "REGION_ID", PLAY_ID : "BASIN_ID",
	 * FIE_ID : "BASIN_ID"
	 */
	}, afterRelations = {}, relationTables = {/*
												 * REGION_ID :
												 * "dir_zyzl_region", COUNTRY_ID :
												 * "dir_zyzl_country", PLAY_ID :
												 * "dir_zyzl_play", BASIN_ID
												 * :"dir_zyzl_basin",
												 * FILE_DEPT:"dir_zyzl_ssdw"
												 */};
	if (json.relationShowFiled) {
		Ext
				.apply((mySelfConfig.relationShowFiled = {}),
						json.relationShowFiled);
		delete json.relationShowFiled;
	}
	if (json.relationChangeFiled) {
		Ext.apply(beforeRelations, json.relationChangeFiled);
		delete json.relationChangeFiled;
	}

	for (var att in beforeRelations) {
		var key = beforeRelations[att];
		if (afterRelations[key])
			afterRelations[key].push(att);
		else
			afterRelations[key] = [att];
	}
	mySelfConfig.columnBeforeRelations = {};
	mySelfConfig.getStringValue = function(value) {
		return Ext.isObject(value) ? value.value : value;
	}
	mySelfConfig.changeCountryAllowBlank = function() {
		var country = this.form.findField("COUNTRY_ID"), fileclass, region;
		if (country && (fileclass = this.form.findField("FILE_CLASS"))
				&& (region = this.form.findField("REGION_ID"))) {
			if (!country.old_fieldLabel) {
				country.old_fieldLabel = country.fieldLabel;
			}
			var allowBlank = true, fileds, value;
			if ((fileds = this.relationShowFiled[fileclass.getValue()
					|| this
							.getStringValue(this.defualtLoadData[fileclass.name])])
					&& fileds[country.name]) {
				allowBlank = (region.getValue() || (this.defualtLoadData && this
						.getStringValue(this.defualtLoadData[region.name]))) == "0::全球";
			}
			country.allowBlank = allowBlank;
			country.label
					&& (country.label.dom.innerHTML = (country.old_fieldLabel + (!allowBlank
							? '<font color=\"red\">*</font>:'
							: ':')));
		}
	}
	mySelfConfig.changeFiledVisible = function(key) {
		var visible;
		if (this.relationShowFiled && (visible = this.relationShowFiled[key])) {
			this.changeCountryAllowBlank();
			this.cascade(function(item) {
				if (/^att_(\d+)$/ig.test(item.name) || item.name == "IS_RESULT") {
					item.setVisible(visible[item.name]);
					item.setDisabled(!visible[item.name]);
				}
			});
		}
	}

	mySelfConfig.TypeClick = function() {
		var classValue=this.form.findField('COUNTRY_ID').getValue();
		var type = this.form.findField('ATT_1');
		if(classValue=="ac886ab6-1cf8-4ede-bc2f-633083f0ed0a"){
			type.show();
			type.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ['value', 'text'],
					data : [[1, '省委文件'], [2, '其他部门起草的省政府文件'], [3, '办公厅起草的省政府文件']]
			});
			type.setValue(1);
		}else if(classValue=="e1c54e40-8d7d-4d60-a0b1-73fac2308f23" || classValue=="ae3345f7-a7c3-47ce-90e0-8aa7f4547228"
			  || classValue=="ad4886bb-aeec-4d81-98bd-a30f4a661743" || classValue=="fc341da5-9d83-4ec9-9d92-ba615cecca7c"
			  || classValue=="45880cb3-5daf-44b6-b4dd-3161d9edb66a" || classValue=="e49a4dd4-6f5f-432f-bf3c-b95285abc9c6"
			  || classValue=="e5da7005-7b71-4b1c-8410-e98a5e8507c9"
		){
			type.show();
			type.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ['value', 'text'],
					data : [[4, '省政府领导的综合性讲话'], [5, '部门起草的讲话']]
			});
			type.setValue(4);
		}else if(classValue=="6d0c9c91-693e-4628-95cf-87d17bc9121e" || classValue=="5be8a4f9-51c1-461d-8845-a3a8e56ef930"){
			type.show();
			type.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ['text', 'value'],
					data : [['转载文件', 6], [ '原创文件',7]]
			});
			type.setValue(6);
		}else{
			type.hide();
			type.setValue("", "");
		}
		
	}

	var pageEdit = param.pageType === "edit", currentData = Ext.apply({},
			json.data);
	var packingChild = function(c) {
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
			// autoLoad : !c.beforeRelation,
			baseParams : {
				relationTable : c.relationTable
			}
		}));
		Ext.apply(c, {
			"hiddenName" : c.name,
			"displayField" : "text",
			"translateItems" : true,
			"valueField" : "value",
			"mode" : "local",
			"triggerAction" : "all",
			"selectOnFocus" : true,
			// "emptyText" : "请选择...",
			listeners : {
				change : function(combo) {
					if (this.afterRelation) {
						var frm = this.findParentByType("form"), field;
						if (frm) {
							frm.changeCountryAllowBlank();
							Ext.each(this.afterRelation, function(c) {
										if (field = (frm.form.findField(c) || frm.form
												.findField(c.toUpperCase()))) {
											field.setValue({
														text : "",
														value : ""
													});
											field.getStore().load({
												params : {
													exportData : combo
															.getValue()
												}
											});
										}
									})
						}
					}
				},
				beforequery : function() {
					if (this.beforeRelation) {
						var frm = this.findParentByType("form"), field;
						if (frm
								&& (field = frm.form
										.findField(this.beforeRelation))
								&& field.getValue() == "" && field.fieldLabel) {
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
			if (Ext.isDefined(afterRelations[c.name]))
				c.afterRelation = afterRelations[c.name];
			if (Ext.isDefined(beforeRelations[c.name]))
				c.beforeRelation = beforeRelations[c.name];
			if (Ext.isDefined(relationTables[c.name])) {
				c.relationTable = relationTables[c.name];
				c.xtype = "combo";
				packingChild(c);
			}
			if (/^att_(\d+)$/ig.test(c.name)) {
				c.hidden = true;
				if (json.filedConfigs && json.filedConfigs[c.name])
					Ext.apply(c, json.filedConfigs[c.name]);
			}
			
			if(c.name == "ATT_1"){
				
			}

			if (c.name == "COUNTRY_ID") {
				c.listeners = {
					'select' : function(combo, node, e) {
						var frm;
						if (frm = combo.findParentByType("form")) {
							frm.TypeClick();
						}
					}
				}
			}

			if (c.name.toUpperCase() == "FILE_CLASS") {
				c.reset = Ext.emptyFn;
				c.listeners = {
					select : function(combo, record, index) {
						var frm = this.findParentByType("form");
						if (frm)
							frm.changeFiledVisible(record.get("value"));
					}
				};
			}
			if (c.name.toUpperCase() == "IS_RESULT") {
				c.hidden = true;
			}
			if (c.xtype == "textarea") {
				c.height = 80;
				if (c.onTransferToView && Ext.isFunction(c.onTransferToView))
					c.onTransferToView = c.onTransferToView.createSequence(
							function(c) {
								c.height = 44;
							});
			};
			if (c.relationTable)
				mySelfConfig.columnBeforeRelations[c.name] = true;
		}
	}
	Ext.each(json.model, fn);
	delete json.filedConfigs;
}
