Ext.ns("usr");
usr.OA = function() {
}
usr.OA.prototype = {
	init : function(src, param) {
		var u = get_cookie("user_name");
		src.url = "http://192.168.0.53:8080/logincheck.php?UNAME="+(u=="super"?"admin":u);
		//src.url = "http://" + window.location.hostname+":83/index.php?app=main&func=passport&action=login";
		src.isIFrame = 'true';
		var bsNode = new WorkBench.baseNode();
		bsNode.init(src);
	}
}