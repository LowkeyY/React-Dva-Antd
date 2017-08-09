Ext.ns("usr.cms");

usr.cms.editPCombobox = function(item) {
	return {
		xtype : "combo",
		store : new Ext.data.SimpleStore({
					"fields" : ['value', 'text'],
					"data" : [["yyyy/MM/dd", "2000/01/01"], ["yyyy年MM月dd日", "2000年01月01日"],["yyyy-MM-dd","2000-01-01"]]
				}),
		translateItems : true,
		editable : false,
		dictionaryField : true,
		mode : "local",
		hiddenName : item.name,
		value : item.defaultValue || "yyyy/MM/dd",
		displayField : "text",
		valueField : "value",
		triggerAction : "all"
	}
}