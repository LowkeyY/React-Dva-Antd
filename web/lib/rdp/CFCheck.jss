(function(e) {
	if (!e.CFInstall) {
		var f = function(a, b) {
			return typeof a == "string" ? (b || document).getElementById(a) : a
		}, h = function() {
			if (e.CFInstall._force)
				return e.CFInstall._forceValue;
			if (navigator.userAgent.toLowerCase().indexOf("chromeframe") >= 0)
				return true;
			if (typeof window.ActiveXObject != "undefined")
				try {
					var a = new ActiveXObject("ChromeTab.ChromeFrame");
					if (a) {
						a.registerBhoIfNeeded();
						return true
					}
				} catch (b) {
				}
			return false
		}, i = function(a) {
			try {
				var b = document.createElement("style");
				b.setAttribute("type", "text/css");
				if (b.styleSheet)
					b.styleSheet.cssText = a;
				else
					b.appendChild(document.createTextNode(a));
				var c = document.getElementsByTagName("head")[0];
				c.insertBefore(b, c.firstChild)
			} catch (g) {
			}
		}, j = false, k = false, l = function() {
			if (!k) {
				i(".chromeFrameOverlayContent { display: none; }.chromeFrameOverlayUnderlay { display: none; }");
				document.cookie = "disableGCFCheck=1;path=/;max-age=31536000000";
				k = true
			}
		}, m = function(a) {
			var b = document.createElement("iframe");
			b.setAttribute("frameborder", "0");
			b.setAttribute("border", "0");
			var c = f(a.node);
			b.id = a.id || (c ? c.id || getUid(c) : "");
			b.style.cssText = " " + (a.cssText || "");
			b.className = a.className || "";
			b.src = a.src || "about:blank";
			c && c.parentNode.replaceChild(b, c);
			return b
		}, n = function(a) {
			a.className = "chromeFrameInstallDefaultStyle "
					+ (a.className || "");
			a = m(a);
			a.parentNode
					|| document.body.insertBefore(a, document.body.firstChild)
		}, o = function(a) {
			if (!f("chromeFrameOverlayContent")) {
				var b = document.createElement("span");
				b.innerHTML = '<div class="chromeFrameOverlayUnderlay"></div><table class="chromeFrameOverlayContent"id="chromeFrameOverlayContent"cellpadding="0" cellspacing="0"><tr class="chromeFrameOverlayCloseBar"><td><button id="chromeFrameCloseButton">close</button></td></tr><tr><td id="chromeFrameIframeHolder"></td></tr></table>';
				for (var c = document.body; b.firstChild;)
					c.insertBefore(b.lastChild, c.firstChild);
				a = m(a);
				f("chromeFrameIframeHolder").appendChild(a);
				f("chromeFrameCloseButton").onclick = l
			}
		}, d = {};
		d.check = function(a) {
			a = a || {};
			var b = navigator.userAgent, c = /MSIE (\S+); Windows NT/, g = false;
			if (c.test(b)) {
				if (parseFloat(c.exec(b)[1]) < 6 && b.indexOf("SV1") < 0)
					g = true
			} else
				g = true;
			if (!g) {
				if (!j) {
					i('.chromeFrameInstallDefaultStyle {width: 800px;height: 600px;position: absolute;left: 50%;top: 50%;margin-left: -400px;margin-top: -300px;}.chromeFrameOverlayContent {position: absolute;margin-left: -400px;margin-top: -300px;left: 50%;top: 50%;border: 1px solid #93B4D9;background-color: white;z-index: 2001;}.chromeFrameOverlayContent iframe {width: 800px;height: 600px;border: none;}.chromeFrameOverlayCloseBar {height: 1em;text-align: right;background-color: #CADEF4;}.chromeFrameOverlayUnderlay {position: absolute;width: 100%;height: 100%;background-color: white;opacity: 0.5;-moz-opacity: 0.5;-webkit-opacity: 0.5;-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";filter: alpha(opacity=50);z-index: 2000;}');
					j = true
				}
				document.cookie.indexOf("disableGCFCheck=1") >= 0 && l();
				b = (document.location.protocol == "https:"
						? "https:"
						: "http:")
						+ "//www.google.com/chromeframe";
				if (!h()) {
					a.onmissing && a.onmissing();
					a.src = a.url || b;
					b = a.mode || "inline";
					if (!(a.preventPrompt || 0))
						if (b == "inline")
							n(a);
						else
							b == "overlay" ? o(a) : window.open(a.src);
					if (!a.preventInstallDetection)
						var p = setInterval(function() {
									if (h()) {
										a.oninstall && a.oninstall();
										clearInterval(p);
										window.location = a.destination
												|| window.location
									}
								}, 2E3)
				}
			}
		};
		d._force = false;
		d._forceValue = false;
		d.isAvailable = h;
		e.CFInstall = d
	}
})(this.ChromeFrameInstallScope || this);