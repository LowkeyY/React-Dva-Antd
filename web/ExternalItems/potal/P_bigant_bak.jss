Ext.namespace("ExternalItems.potal.testconsole");
ExternalItems.potal.P_bigant = function() {
}

ExternalItems.potal.P_bigant.prototype = {
	init : function(src, param) {
		var src = 'bigant://login/?server=192.168.0.196&port=6660';
		var tk = WorkBench.potal_user_token;
		if(tk && tk.indexOf("::") != -1){
			var token = tk.split("::");
			if(token[0] == "admin"){
				src += ("&loginname=" + token[0] + "&password=123456789&startup=1&pwdtype=0");
			} else {
				src += ("&loginname=" + token[0] + "&password=" + token[1]+"&startup=1&pwdtype=1");
			}
			window.open(src , "_self");
		} else {
			Ext.msg("warn" , "获取信息失败，请刷新重试。");
		}
	}
}