Ext.namespace("ExternalItems.potal");
ExternalItems.potal.P_bigant = function() {
}

ExternalItems.potal.P_bigant.prototype = {
	isOpen : false,
	checkInstallTimer : "",
	overCheck : function(status , message){
		if(status === 2 || this.isOpen)
			return;
		if(this.checkInstallTimer)
			clearTimeout(this.checkInstallTimer);
		if(this.runProgressBar)
			this.runProgressBar.hide();
		if(status){
			this.openClient();
		} else {
			var _ = this;
			Ext.msg("confirm" , message + "<br> 是否下载客服端?" , function(answer){
				if (answer == 'yes') {
					window.open("/sample/Client_4.1.34.rar");
				} else {
					_.openClient.defer(1);
				}
			});
		}
	},
	checkInstall : function() {
		try {
            var b = new ActiveXObject("ANTSTARTCHECK.AntStartCheckCtrl.1");
            if (b != null) {
                this.openClient();
                return ;
            }
        } catch (d) {
        }
		
		var host = "ws://localhost:8001/";
		try {
			var socket = new WebSocket(host);
			var _ = this;
			this.checkInstallTimer = setTimeout(function(){
				_.overCheck(0, "检测客户端安装情况，连接超时。")
			}, 1500);
			socket.onopen = function(){
				_.overCheck(1, "检测客户端安装情况，已安装完成。");
			}
			socket.onclose = function(){
				_.overCheck(2, "检测客户端安装情况，未安装客户端。");
			}
			socket.onerror = function(){
				_.overCheck(0, "检测客户端安装情况，未安装客户端。");
			}
		} catch (e) {
			this.overCheck(0, "检测客户端安装情况，客户端连接失败。");
		}
	},
	openClient : function(){
		this.isOpen = true;
		var url = 'bigant://login/?server=192.168.0.196&port=6660';
		var tk = WorkBench.potal_user_token;
		if (tk && tk.indexOf("::") != -1) {
			var token = tk.split("::");
			if (token[0] == "admin") {
				url += ("&loginname=" + token[0] + "&password=123456789&startup=1&pwdtype=0");
			} else {
				url += ("&loginname=" + token[0] + "&password=" + token[1] + "&startup=1&pwdtype=1");
			}
			window.open(url, "_self");
		} else {
			Ext.msg("warn", "获取信息失败，请刷新重试。");
		}
	},
	init : function(src, param) {
		try {
			if (Ext.isDefined(WebSocket)) {
				this.runProgressBar = Ext.Msg.wait("正在启动客服端...");
				this.checkInstall();
			} else
				this.openClient();
		} catch (e) {
			this.openClient();
		}
	}
}