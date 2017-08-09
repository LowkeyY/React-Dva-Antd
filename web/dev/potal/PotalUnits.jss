window.PotalVersion = "1.0";

window.PotalCNFTypes = {
	"xlovfield" : "lib.ListValueField.ListValueField",
	"iconpicker" : {
		"JS" : "lib.IconPicker.IconPicker",
		"CSS" : "lib.IconPicker.IconPicker"
	},
	"comboremote" : "lib.ComboRemote.ComboRemote",
	"combotree" : "lib.ComboTree.ComboTree"
}

window.getPotalCNFType = function(type) {
	var v;
	if (v = PotalCNFTypes[type]) {
		try {
			if (!!v && Object.prototype.toString.call(v) === "[object Object]") {
				(v.JS && using(v.JS)) || true && v.CSS && loadcss(v.CSS);
			} else if (typeof v === "string")
				using(v);
		} catch (e) {
		}
	}
	return type;
}

window.getPotalCNColumn = function(width){
	if(!witdh || !(witdh * 1) || (witdh * 1) > 1)
		return .5;
	return width * 1;
}

window.loadPotalCNFtype = function(){
	if(PotalCNFTypes)
		for(var att in PotalCNFTypes)
			getPotalCNFType(att);
}

Ext.onReady(loadPotalCNFtype);