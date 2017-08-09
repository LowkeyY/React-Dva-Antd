Ext.namespace("ExternalItems.potal.testconsole");
ExternalItems.potal.P_winmail = function() {
}
ExternalItems.potal.P_winmail.prototype = {
	sid : "",
	init : function(src, param) {
		// http://192.168.0.196:6080/login.php?f_user=admin&f_pass={wm_crypt}oYOig6ODoISkg6WDpoM=&f_lang=ch_gb&f_domain=cunovstest.com
		src.isIFrame = 'true';
		this.sid = src.iconCls || "";
		Ext.Ajax.request({
					url : '/ExternalItems/potal/P_winmail.jcp',
					method : 'get',
					scope : this,
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						if (result.success && result.userId && result.userPsd) {
							src.url = "http://192.168.0.196:6080/login.php?f_user=" + result.userId + "&f_pass=" + result.userPsd + "&f_lang=ch_gb&f_domain=cunovstest.com";
							var bsNode = new WorkBench.baseNode();
							bsNode.init(src);
							this.run.defer(1);
						} else {
							Ext.msg("warn", result.message);
						}
					}
				});
	},
	run : function(){
		Ext.Ajax.request({
				url : '/ExternalItems/potal/P_winmail.jcp',
				method : 'post',
				scope : this,
				success : function(response, options) {
					var result = Ext.decode(response.responseText);
					if (result.success && result.newMessageCounts) {
						var pid , btn;
						if(this.sid && WorkBench.ShortcutButtonMap[this.sid] && (pid = WorkBench.ShortcutButtonMap[this.sid]) && (btn = Ext.getCmp(pid))){
							if(btn.setInfonumVisible && Ext.isFunction(btn.setInfonumVisible))
								btn.setInfonumVisible(result.newMessageCounts);
						}
					}
				}
			});	
	},
	encryptPwd : function(sVal) {
		if (sVal.substr(0, 10) == '{wm_crypt}')
			return sVal;

		var sResult = '';
		for (i = 0; i < sVal.length; i++) {
			sTemp = String.fromCharCode((sVal.charCodeAt(i) & 0x0f) | 0xa0);
			sResult = sResult + sTemp;
			sTemp = String.fromCharCode(((sVal.charCodeAt(i) >> 4) & 0x0f)
					| 0x80);
			sResult = sResult + sTemp;
		}

		sResult = '{wm_crypt}' + this.encode(sResult);

		return sResult;
	},
	encode : function(src) {
		var str = new Array();
		var ch1, ch2, ch3;
		var pos = 0;
		while (pos + 3 <= src.length) {
			ch1 = src.charCodeAt(pos++);
			ch2 = src.charCodeAt(pos++);
			ch3 = src.charCodeAt(pos++);
			str.push(this.enKey.charAt(ch1 >> 2), this.enKey
							.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
			str.push(this.enKey.charAt(((ch2 << 2) + (ch3 >> 6)) & 0x3f),
					this.enKey.charAt(ch3 & 0x3f));
		}
		if (pos < src.length) {
			ch1 = src.charCodeAt(pos++);
			str.push(this.enKey.charAt(ch1 >> 2));
			if (pos < src.length) {
				ch2 = src.charCodeAt(pos);
				str.push(this.enKey.charAt(((ch1 << 4) + (ch2 >> 4)) & 0x3f));
				str.push(this.enKey.charAt(ch2 << 2 & 0x3f), '=');
			} else {
				str.push(this.enKey.charAt(ch1 << 4 & 0x3f), '==');
			}
		}
		return str.join('');
	},
	enKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
}