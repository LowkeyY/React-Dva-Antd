using("ExternalItems.haiwaizhishigongxiang.FilePreview");

function SearchFilePreview(id, pid, name) {
	var rec = new Ext.data.Record({
			FILE_INFO_NAME : name,
			pmk : id
	});
	var panel=Ext.getCmp(pid);
	ExternalItems.haiwaizhishigongxiang.FilePreview(rec,panel);
	
	//ExternalItems.haiwaizhishigongxiang.SearchFilePreview(id, pid, name);
}
function SearchInput(value, pid , rep) {
	var panel = Ext.getCmp(pid);
	if(panel){
		var fried = panel.fried , v = value;
		if(rep)
			v = v.replaceAll("\\[\\d+\\]$","");
		fried.setValue(v);
	}
}