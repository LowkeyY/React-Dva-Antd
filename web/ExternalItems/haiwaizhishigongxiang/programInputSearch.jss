Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.programInputSearch = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	if(!panel.param_old)
		panel.param_old = Ext.apply({},panel.param);
	panel.param = Ext.applyIf({
		exportData : panel.param.exportData,
		exportItem : panel.param.exportItem,
		exportTab : panel.param.exportTab
	},panel.param_old);
	var formItems = panel.form.items.items;
	var param = panel.param;
	var desktop = WorkBench.Desk.getDesktop();
	param.popupWindowConfig =Ext.encode({
		width : desktop.getViewWidth() - 1,
		height : desktop.getViewHeight() - 1,
		listeners : {
			afterrender : function(win) {
				win.el.mask(Ext.LoadMask.prototype.msg);
			}
		}
	})
	if (param.exportData) {
		param.testData = param.exportData;
		delete param.exportData;
	}
	if (param.exportItem) {
		param.testItem = param.exportItem;
		delete param.exportItem;
	}
	
	if (param.exportTab)
		param.testTab = param.exportTab;
	if (param.dataId)
		delete param.dataId;

	var num = 0;
	var sum = 0;
	if (btn.GENERAL_CLASS_CODE) {
		param['filter[' + num + '][data][field]'] = 'CAN_SHIFT';
		param['filter[' + num + '][data][type]'] = 'string';
		param['filter[' + num + '][data][value]'] = btn.GENERAL_CLASS_CODE;
		param['filter[' + num + '][field]'] = 'GENERAL_CLASS_CODE';
		num += 1;
	};
		param['split[' + num + '][field]'] = "SPACE_ID";
		param['split[' + num + '][data][value]'] = panel.param.testData;
					
		num+=1;
	var gjz="";
	Ext.each(formItems, function(i) {
		
		if(i.getName()=="FILE_REMARKS" || i.fieldLabel=="关键字"){
			gjz+=i.getName()+",";
		}
		if (!(i.fieldLabel == 'undefined') && !(i.fieldLabel == '')) {
			if (i.xtype == 'compositefield') {
				var item_1 = i.items.items[0];
				var item_2 = i.items.items[1];
				if (!(item_2.getValue() == '') || item_2.getValue() == '0') {
					if (item_2.xtype == 'unitfield'
							|| item_2.xtype == 'numberfield') {
						param['filter[' + num + '][data][comparison]'] = item_1
								.getValue();
						param['filter[' + num + '][data][field]'] = 'CAN_SHIFT';
						param['filter[' + num + '][data][type]'] = 'numeric';
						param['filter[' + num + '][data][value]'] = item_2
								.getValue();
						param['filter[' + num + '][field]'] = i.getName();
					}
					if (item_2.xtype == 'datefield') {
						param['filter[' + num + '][data][comparison]'] = item_1
								.getValue();
						param['filter[' + num + '][data][field]'] = 'CAN_SHIFT';
						param['filter[' + num + '][data][type]'] = 'date';
						param['filter[' + num + '][data][value]'] = item_2
								.getRawValue();
						param['filter[' + num + '][field]'] = i.getName();
					}
					num += 1;
				} else {
					sum += 1;
				}
			} else {
				if (!(i.getRawValue() == 'undefined') && !(i.getRawValue() == '')
						&& i.getRawValue()) {
					if (param['filter[' + num + '][data][comparison]']) {
						delete param['filter[' + num + '][data][comparison]'];
					}
					
					param['split[' + num + '][field]'] = i.getName();
					param['split['+ num +'][data][type]'] = "string";
					if(i.getName()=="FILE_REMARKS" || i.fieldLabel=="关键字"){
						param['split['+ num +'][data][type]'] = "splitgjz";
					}
					if(i.getName()=="FILE_INFO_NAME" || i.getName()=="FILE_RAW_NAME"){
						param['split['+ num +'][data][type]'] = "split";
					}
					if(i.getName()=="FILE_CLASS"){
					param['split[' + num + '][data][value]'] = i.getValue();
					}else if(i.getName()=="COUNTRY_ID"){
					param['split[' + num + '][data][value]'] = i.getValue();
					}else if(i.getName()=="IS_RESULT" || i.getName()=="IS_SECRECY"){
					param['split[' + num + '][data][value]'] = i.getValue();
					}else if(i.getName()=="FILE_UPLOADER" || i.getName()=="FILE_DEPT"){
						param['split[' + num + '][data][value]'] = i.getValue();
					}else{
						param['split[' + num + '][data][value]'] = i.getRawValue().replaceAll("\\n","");
					}
					
					
					num += 1;
				} else {
					sum += 1;
				}
			}
		} else {
			sum += 1;
		}
	});
	param["gjz"]=gjz;
	Ext.each(formItems, function(f) {
				if (param['filter[' + num + '][field]']) {
					if (param['filter[' + num + '][data][comparison]']) {
						delete param['filter[' + num + '][data][comparison]'];
					}
					delete param['filter[' + num + '][data][field]'];
					delete param['filter[' + num + '][data][type]'];
					delete param['filter[' + num + '][data][value]'];
					delete param['filter[' + num + '][field]'];
				}
				num += 1;
			});
	param.totalNum = num;
	if (sum == formItems.length || !(panel.form.isValid())) {
		btn.target.type = '0';
		Ext.msg("warn", "填写所需搜索的数据或修正表单错误.");
	} else {
		btn.target.type = '1';
		return panel;
	}
}