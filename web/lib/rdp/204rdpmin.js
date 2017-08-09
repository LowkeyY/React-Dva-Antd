function grantPermission() {
	hi5.browser.isTouch || "webkitNotifications" in window
			&& 0 != window.webkitNotifications.checkPermission()
			&& window.webkitNotifications.requestPermission()
}
function queryToArgs(m) {
	for (var n = {}, m = m.split("&"), t = m.length, r = 0; r < t; r++) {
		var x = m[r].split("=");
		n[x[0]] = decodeURIComponent(x[1])
	}
	return n
}
function makeEven(m) {
	return m & -4
}
function connvertServer(m) {
	var n = {};
	n.id = m.id;
	n.server = m.id;
	n.displayName = m.displayName || m.id;
	(m = m.rdp) || (m = {});
	n.port = m.port || 3389;
	n.user = m.username || "";
	n.pwd = m.password || "";
	n.domain = m.domain || "";
	n.keyboard = 1033;
	n.useConsole = m.console || !1;
	n.legacyMode = m.leagacyMode || m.legacyMode || !1;
	n.server_bpp = m.color || 16;
	n.playSound = m.playSound || 0;
	n.mapClipboard = m.mapClipboard || !0;
	n.playSound = m.playSound || 0;
	n.mapPrinter = m.mapPrinter || !0;
	n.mapDisk = m.mapDisk || !0;
	n.command = m.command || "";
	n.directory = m.directory || "";
	n.exe = m.remoteProgram || "";
	n.args = m.remoteArgs || "";
	n.startProgram = 0 < n.exe.length ? "app" : 0 < n.command.length
			? "shell"
			: "noapp";
	return n
}
function getServers(m, n) {
	var t = Connection.getValue(Connection.KEY_TIMESTAMP), r = new hi5.WebSocket(m
			+ (null == t ? "" : "?since=" + t)), x = !1, z = !1;
	r.onmessage = function(m) {
		x = !0;
		svGlobal.log && console.log(m.data);
		m = JSON.parse(m.data);
		m.lastModified
				&& Connection.setValue(Connection.KEY_TIMESTAMP, m.lastModified
								+ "");
		if (m = m.connections)
			for (var n = 0, t = m.length; n < t; n++) {
				var Y = m[n];
				null == Connection.getValue(Y.id)
						&& (Connection.save(Y.id, connvertServer(Y)), z = !0)
			}
		r.close()
	};
	r.onclose = function() {
		n(z, x)
	}
}
var svManager = {
	getInstance : function() {
		return "rdpConnection" in window && rdpConnection.running()
				? rdpConnection
				: null
	}
};
svGlobal.getInstance = svManager.getInstance;
window.addEventListener("beforeunload", function(m) {
			var n = svManager.getInstance();
			if (null != n) {
				var n = n.getRunninApps(), t = n.length;
				if (0 < t) {
					for (var r = __svi18n.remoteApp.warn + "\n\n", x = 0; x < t; x++)
						r += n[x] + "\n";
					r += "\n" + __svi18n.remoteApp.close + "\n";
					hi5.browser.isFirefox && svGlobal.util.singletonDlg.show(r);
					m && (m.returnValue = r);
					return r
				}
			}
		}, !1);
function startExitingApp(m) {
	function n(n) {
		t.addSurface(n);
		t.startExitingApp(m)
	}
	var t = svManager.getInstance();
	window.svOnSurfaceReady = n;
	window.open("rail.html").svOnSurfaceReady = n;
	var r = document.getElementById(m), x = r.parentNode;
	x.removeChild(r);
	x = x.parentNode;
	0 == x.getElementsByTagName("input").length
			&& (x.dismiss(), t.checkRemaining(2E3))
}
function Rdp2(m) {
	if (!m
			&& (window.opener && window.opener.sparkServer
					&& (m = window.opener.sparkServer), m
					|| (m = hi5.tool.cookie2Obj()), !m)) {
		alert(__svi18n.noauth);
		return
	}
	var n = "", t = window.innerWidth, r = window.innerHeight, x = 16, z = null, A;
	for (A in m) {
		"" != n && (n += "&");
		var y = m[A];
		if ("useSSL" == A)
			z = y;
		else {
			if ("boolean" == typeof y)
				if (y)
					y = "on";
				else
					continue;
			n += A + "=" + encodeURIComponent(y);
			switch (A) {
				case "gateway" :
					gw = y;
					break;
				case "width" :
					t = parseInt(y);
					break;
				case "height" :
					r = parseInt(y);
					break;
				case "color" :
					x = parseInt(y)
			}
		}
	}
	null == z && (z = "https:" == location.protocol);
	return new Rdp((z ? "wss://" : "ws://") + gw + "/RDP?" + n, t, r, x)
}
svGlobal.Rdp2 = Rdp2;
function Rdp(m, n, t, r) {
	var x, z, A, y;
	function Ja(a, b) {
		var d = Array(a * b), c = !1;
		this.getBuffer = function() {
			return d
		};
		this.setRGB = function(b, c, i) {
			d[c * a + b] = i
		};
		this.getRGB = function(b, c) {
			return d[c * a + b]
		};
		this.setRGBs = function(b, c, i, l, h, f, g) {
			for (var j = 0, i = b + i, l = c + l; c < l; c++, f += g)
				for (var j = f, m = b; m < i; m++)
					d[c * a + m] = h[j++]
		};
		this.copyArea = function(b, e, i, l, h, f) {
			for (var g = this.getRGBs(b, e, i, l), h = b + h, f = e + f, j = f
					* a + h, m = g.length, o = a - i + 1, n = i - 1, r = 0; r < m; r++)
				d[j] = g[r], r % i != n ? j++ : j += o;
			g = q.svContext(b, e);
			j = q.svContext(h, f);
			null != j && null != g
					&& j.putImageData(g.getImageData(b, e, i, l), h, f);
			c = !0
		};
		this.getRGBs = function(b, c, i, l) {
			for (var b = c * a + b, l = i * l, c = a - i + 1, h = i - 1, f = Array(l), g = 0; g < l; g++)
				f[g] = d[b], g % i != h ? b++ : b += c;
			return f
		};
		_getImageData = function(b, c, i, l, h) {
			for (var b = b.createImageData(l, h), f = b.data, c = i * a + c, h = l
					* h, i = a - l + 1, g = l - 1, j = 0; j < h; j++) {
				var m = d[c], o = j << 2;
				f[o] = m >> 16 & 255;
				f[o + 1] = m >> 8 & 255;
				f[o + 2] = m & 255;
				f[o + 3] = 255;
				j % l != g ? c++ : c += i
			}
			return b
		};
		this.repaint = function(a, b, d, l) {
			if (!c) {
				var h = q.svContext(a, b);
				null != h && h.putImageData(_getImageData(h, a, b, d, l), a, b)
			}
			c = !1
		};
		this.fillRect = function(b, c, i, l, h) {
			for (var b = c * a + b, l = i * l, c = a - i + 1, f = i - 1, g = 0; g < l; g++)
				d[b] = h, g % i != f ? b++ : b += c
		}
	}
	function Y() {
		if (!Z && "sessionStorage" in window) {
			var a = sessionStorage["SI_" + this.server];
			if (null != a)
				try {
					var b = JSON.parse(a);
					if (!("random" in b))
						return "";
					svGlobal.log
							&& console.log("load session, id=" + b.logId
									+ " server=" + this.server + " time="
									+ b.time + " curr=" + (new Date).getTime());
					return 36E5 < (new Date).getTime() - b.time
							? (svGlobal.log
									&& console.log("remove Seesion info"), sessionStorage
									.removeItem("SI_" + this.server), "")
							: "&logId=" + b.logId + "&random="
									+ na.enc(b.random)
				} catch (d) {
				}
		}
		return ""
	}
	function gc(a) {
		var b = __svi18n.errorCode[a];
		if (b) {
			if (C.onerror)
				C.onerror({
							name : a,
							message : b
						});
			C.displayMsg && svGlobal.util.singletonDlg.show(b);
			console.error(b)
		}
	}
	function Ec() {
		var a;
		if (null == yb)
			a = "";
		else {
			a = zb() + "/CLIP?s=" + yb + "&t=" + (new Date).getTime();
			var b = new XMLHttpRequest;
			b.open("GET", a, !1);
			b.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
			b.send(null);
			a = b.responseText
		}
		return a
	}
	function Ab(a, b) {
		if (J) {
			console.log("reconnecting...");
			a = makeEven(a);
			b = makeEven(b);
			w.onmessage = null;
			w.onclose = null;
			w.onerror = null;
			Bb(null);
			za = null;
			allowInput = !0;
			J = !1;
			U = null;
			ud();
			S = new hc;
			Ka = 0;
			Fc = {};
			Za = Array(256);
			$a = [];
			for (var d = 0; 12 > d; d++)
				Cb[d] = Array(256);
			ab = Array(20);
			oa.historyoff = 0;
			oa.history = Array(65536);
			oa.currOff = 0;
			oa.currLen = 0;
			n = a;
			t = b;
			O = P = 0;
			H = n - 1;
			I = t - 1;
			for (var d = 0, c = q.length; d < c; d++)
				q[d].setSize(a, b);
			C.run()
		}
	}
	function Gc(a) {
		if (ea && loggedin)
			for (var b = 0, d = a.length; b < d; b++)
				ea.addFile(a[b])
	}
	function Hc() {
		this.start = function(a, b) {
			w.send("3A0" + a + "\t" + b)
		};
		this.send = function(a, b, d, c) {
			w.send("3A3" + a + "\t" + b + "\t" + d + "\t" + na.enc(c))
		}
	}
	function Ic(a) {
		console.log(a)
	}
	function Jc() {
		console.log("opened...");
		J = !0;
		q.setConnected(!0);
		w.send("87" + navigator.userAgent);
		if (C.onopen)
			C.onopen()
	}
	function bb(a) {
		a = na.dec(a, 0);
		return new Aa(a, 0, a.length)
	}
	function Kc(a) {
		var b, d = a.data;
		if ("string" == typeof d)
			switch (b = parseInt(d.substring(0, 2), 16), a = d.substring(2), b) {
				case 26 :
					b = JSON.parse(a);
					if (b.name) {
						svGlobal.log && console.log("msg=" + a);
						if (C.onerror)
							C.onerror(b);
						a = __svi18n.errorCode["S" + b.name];
						a += b.message;
						C.displayMsg && C.showMessage(a)
					} else
						console.erro("No error code for message:" + a);
					break;
				case 27 :
					q.drawLicense(a);
					break;
				case 48 :
					Pb(bb(a));
					break;
				case 49 :
					Qb(bb(a));
					break;
				case 50 :
					b = parseInt(a.substring(0, 1));
					a = a.substring(1);
					switch (b) {
						case 1 :
							console.log("....... copy to clip:" + a);
							q.copyToClip(a);
							break;
						case 2 :
							console.log("....... clipReq, clipString:" + za), La.clipRequired = !0, La.prePaste
									|| (null == za
											&& pa
											&& !pa.leagacyMode
											&& C
													.showMessage(__svi18n.info.menucopy), w
											.send("881"
													+ (null == za ? "" : za)), La.clipRequired = !1)
					}
					break;
				case 51 :
					q.setReadOnly("1" == a);
					break;
				case 52 :
					a = {};
					a.t = Za;
					a.f = Cb;
					a = "89" + JSON.stringify(a);
					w.send(a);
					break;
				case 53 :
					a = JSON.parse(a);
					Za = a.t;
					Cb = a.f;
					break;
				case 54 :
					a = zb() + a;
					svGlobal.log && console.log("Downloading file:" + a);
					b = q.getFocused();
					null != b && b.showPDF(a);
					break;
				case 55 :
					b = parseInt(a.substring(0, 1), 16);
					a = a.substring(1);
					switch (b) {
						case 0 :
							a = a.split("\t");
							A = parseInt(a[0]);
							z = parseInt(a[1]);
							x = parseInt(a[2]);
							y = parseInt(a[3]);
							svGlobal.log
									&& console.log("Audio Format, tag=" + A
											+ " channels=" + z
											+ " bitsPerSample=" + x
											+ " samplePerSec=" + y);
							hi5.browser.isFirefox && null == Ma
									&& (Ma = new Rb(2));
							break;
						case 1 :
							Lc(a)
					}
					break;
				case 56 :
					yb = a;
					break;
				case 58 :
					b = a;
					a = parseInt(b.charAt(0));
					b = b.substring(1);
					if (5 == a)
						La.notifyFiles(JSON.parse(b));
					else if (null != ea)
						switch (b = b.split("\t"), a) {
							case 1 :
								ea.confirmId(b[0], b[1]);
								break;
							case 2 :
								ea.read(b[0], parseInt(b[1]), parseInt(b[2]));
								break;
							case 4 :
								ea.close(b[0])
						}
					break;
				case 59 :
					if (Db
							&& (a = na.dec(a, 0), a = (new Aa(a, 0, a.length))
									.getLittleEndian32(), Eb || !(a & 16)
									? (Db = !1, ea = null, q.execute(
											"setFileHandler", [null]))
									: a
											& 128
											&& (ea = null, q.execute(
													"disableUpload", [null])), a
									& 64))
						if (a = __svi18n.info.recordig)
							C.displayMsg && svGlobal.util.singletonDlg.show(a), console
									.log(a);
					break;
				case 60 :
					Sb(bb(a));
					break;
				case 61 :
					a = JSON.parse(a);
					switch (a.type) {
						case 0 :
							n = a.width;
							t = a.height;
							r = a.color;
							ic = a.length;
							q.getFocused().setSize(n, t);
							if (C.onopened)
								C.onopened(a);
							break;
						case 1 :
							if (a = a.duration, C.onprogress)
								C.onprogress(a, ic)
					}
					break;
				default :
					console.log("@TODO:" + d + "\n")
			}
		else
			switch (a = new Int8Array(d), a = new Aa(a, 0, a.length), b = a
					.getLittleEndian16(), b) {
				case 48 :
					Pb(a);
					break;
				case 49 :
					Qb(a);
					break;
				case 55 :
					switch (a.getByte()) {
						case 0 :
							A = a.getLittleEndian16();
							z = a.getLittleEndian16();
							y = a.getLittleEndian32();
							a.skipPosition(6);
							x = a.getLittleEndian16();
							svGlobal.log
									&& console.log("Audio Format, tag=" + A
											+ " channels=" + z
											+ " bitsPerSample=" + x
											+ " samplePerSec=" + y);
							hi5.browser.isFirefox && null == Ma
									&& (Ma = new Rb(2));
							break;
						case 1 :
							Mc(a)
					}
					break;
				case 60 :
					Sb(a);
					break;
				default :
					console.log("@TODO:" + b + "\n")
			}
	}
	function Sb(a) {
		switch (a.getByte()) {
			case 32 :
				a.getLittleEndian16();
				var b = a.getLittleEndian16(), a = a.getLittleEndian16();
				q.getFocused().moveCursor(b, a)
		}
	}
	function Lc(a) {
		function b(a) {
			var b = 0, a = a * i;
			for (h = 0; h < i; h++)
				b |= (e[a + h] & 255) << 8 * h;
			b > f ? (b -= j, b /= -g) : b /= f;
			return b
		}
		function d() {
			w.send("8A" + k)
		}
		if ($.available) {
			var c = a.indexOf("\t"), k = a.substring(0, c), e = na
					.dec(a, c + 1), a = x, i = a >> 3, l = Math.floor(e.length
					/ i), h = 0, f = Math.pow(2, a - 1) - 1, g = -f - 1, j = Math
					.pow(2, a), a = 0;
			if (hi5.browser.isFirefox) {
				c = Array(l);
				for (a = 0; a < l; a++)
					c[a] = b(a);
				a = Ma.add(c);
				setTimeout(d, a - 1E3 * $.delay)
			} else {
				for (var c = z, l = Math.floor(l / c), m = $.getBuffer(l), o = m
						.getChannelData(0), n = m.getChannelData(1), a = 0; a < l;) {
					var r = 2 * a, q = b(r);
					1 == c
							? (q *= 0.707, o[a] = q, n[a] = q)
							: (o[a] = q, n[a] = b(r + 1));
					a++
				}
				a = $.playBuffer(m);
				setTimeout(d, 1E3 * (a - $.delay))
			}
		}
	}
	function Mc(a) {
		function b(a) {
			var b = 0, a = a * l + k;
			for (f = 0; f < l; f++)
				b |= (e[a + f] & 255) << 8 * f;
			b > g ? (b -= m, b /= -j) : b /= g;
			return b
		}
		function d() {
			w.send("8A" + c)
		}
		if ($.available) {
			var c = a.getByte() + "," + a.getLittleEndian16() + ","
					+ a.getLittleEndian64(), k = a.getPosition(), e = a
					.getData(), i = a.getEnd() - k, a = x, l = a >> 3, h = Math
					.floor(i / l), f = 0, g = Math.pow(2, a - 1) - 1, j = -g
					- 1, m = Math.pow(2, a), a = 0;
			if (hi5.browser.isFirefox) {
				i = Array(h);
				for (a = 0; a < h; a++)
					i[a] = b(a);
				a = Ma.add(i);
				setTimeout(d, a - 1E3 * $.delay)
			} else {
				for (var i = z, h = Math.floor(h / i), o = $.getBuffer(h), n = o
						.getChannelData(0), r = o.getChannelData(1), a = 0; a < h;) {
					var q = 2 * a, t = b(q);
					1 == i
							? (t *= 0.707, n[a] = t, r[a] = t)
							: (n[a] = t, r[a] = b(q + 1));
					a++
				}
				a = $.playBuffer(o);
				setTimeout(d, 1E3 * (a - $.delay))
			}
		}
	}
	function Rb(a) {
		var b = [], d, c, k, e = new Nc(z, y, function(b) {
					var d = b.length, e = d > i.size();
					if (c || e)
						i.stop(), setTimeout(function() {
									i.start()
								}, 1E3 * a);
					else
						for (e = 0; e < d; e++)
							b[e] = i.pull()
				}), i = this;
		this.delay = a;
		this.reset = function() {
			d = b.length = 0;
			c = !0;
			e.stop();
			k = 0
		};
		this.reset();
		this.start = function() {
			c && (e.start(), c = !1)
		};
		this.stop = function() {
			e.stop();
			c = !0
		};
		this.size = function() {
			for (var a = b.length, c = 0, d = 0; d < a; d++)
				c += b[d].length;
			return c
		};
		this.add = function(c) {
			var d = (new Date).getTime();
			k < d && (k = d);
			k += 1E3 * (c.length / (y * z));
			var f = b.length;
			b[f] = c;
			0 == f && (d = (new Date).getTime(), setTimeout(function() {
						e.start()
					}, 1E3 * a));
			return k - d
		};
		this.pull = function() {
			if (0 == b.length)
				return null;
			var a = b[0];
			if (d < a.length)
				return a[d++];
			b.shift();
			d = 0;
			return this.pull()
		}
	}
	function Nc(a, b, d) {
		function c() {
			var a;
			if (l) {
				a = k.mozWriteAudio(l.subarray(h));
				e += a;
				h += a;
				if (h < l.length)
					return;
				l = null
			}
			a = k.mozCurrentSampleOffset() + i - e;
			if (0 < a) {
				var b = new Float32Array(a);
				d(b);
				a = k.mozWriteAudio(b);
				a < b.length && (l = b, h = a);
				e += a
			}
		}
		var k = new Audio;
		k.mozSetup(a, b);
		var e = 0, i = a * b / 2, l = null, h = 0, f = null;
		this.start = function() {
			f = setInterval(c, 100)
		};
		this.stop = function() {
			null != f && clearInterval(f)
		}
	}
	function zb() {
		var a = m.indexOf("://"), b = m.substring(a + 3), a = b.indexOf("/");
		0 < a && (b = b.substring(0, a));
		return location.protocol + "//" + b
	}
	function Pb(a) {
		var b = a.getLittleEndian16(), d = a.getByte(), c = a.getByte(), k = a
				.getLittleEndian16(), e = null;
		if (0 != (c & 32)) {
			if (65536 < b)
				throw "Invalid package size for decompression.";
			if (-1 == oa.dec(a.getData(), a.getPosition(), k - 18, c))
				throw "Error on decompressing data.";
			e = oa.getData()
		} else
			e = a;
		switch (d) {
			case 2 :
				d = e;
				a = d.getLittleEndian16();
				switch (a) {
					case 0 :
						d.skipPosition(2);
						a = d.getLittleEndian16();
						d.skipPosition(2);
						jc(d, a);
						break;
					case 1 :
						Tb(d);
						break;
					case 2 :
						kc(d);
						break;
					case 3 :
						break;
					default :
						console.log("Warn: Unimplemented Update type " + a)
				}
				break;
			case 20 :
				break;
			case 31 :
				break;
			case 27 :
				d = e;
				a = 0;
				a = d.getLittleEndian16();
				d.skipPosition(2);
				switch (a) {
					case 3 :
						d.skipPositon(4);
						break;
					case 6 :
						cb(d, 24);
						break;
					case 7 :
						d = d.getLittleEndian16();
						q.setCursor(Ub(d));
						break;
					case 1 :
						d = d.getLittleEndian16();
						switch (d) {
							case 0 :
								q.setCursor("default");
								break;
							default :
								console.log("XXX system pointer message " + d)
						}
						break;
					case 8 :
						a = d.getLittleEndian16(), cb(d, a)
				}
				break;
			case 34 :
				break;
			case 38 :
				Oc(e);
				break;
			case 47 :
				d = e.getLittleEndian32();
				1 > d || gc(d);
				break;
			case 54 :
				a = e.getLittleEndian32().toString(16).toUpperCase(), a = __svi18n.serverStatus[a], C.displayMsg
						&& C.showMessage(a);
			default :
				console.log("warn: Unimplemented Data PDU type " + d)
		}
	}
	function Oc(a) {
		var b = a.getLittleEndian32();
		if (3 > b)
			loggedin = !0;
		else if (3 == b)
			if (loggedin = !1, a.skipPosition(2), 2 == a.getLittleEndian32())
				C.displayMsg && C.showMessage(__svi18n.logError);
			else {
				a.skipPosition(4);
				if (28 != a.getLittleEndian32())
					throw "Invalid length of SaveSessoinInfo PDU";
				a.skipPosition(4);
				loggedin = !0;
				b = {};
				b.logId = a.getLittleEndian32();
				b.random = a.getBytes(16);
				b.time = (new Date).getTime();
				if ("sessionStorage" in window)
					try {
						sessionStorage["SI_" + this.server] = JSON.stringify(b)
					} catch (d) {
					}
			}
	}
	function Qb(a) {
		var b = a.getByte(), d = b & 15, c = b >> 4 & 3;
		if (0 != c)
			throw "Fragmentation is not supported yet";
		var k, e = 0;
		2 == (b >> 6 & 3) && (e = a.getByte());
		k = a.getLittleEndian16();
		b = null;
		if (0 != (e & 32)) {
			if (1 != (e & 15))
				throw "only support PACKET_COMPR_TYPE_64K";
			if (-1 == oa.dec(a.getData(), a.getPosition(), k, e))
				throw __svi18n.errorDecompress;
			b = oa.getData()
		} else
			b = a;
		if (0 != c)
			if (2 == c && (null == ka ? ka = [] : ka.length = 0), ka.push(b
					.getData().slice(b.getPosition(), b.getEnd())), 1 == c) {
				a = 0;
				c = ka.length;
				for (a = 0; a < c; a++);
				e = [];
				for (a = 0; a < c; a++)
					e.concat(ka[a]);
				b = new Aa(e, 0, e.length);
				ka.length = 0
			} else
				return;
		switch (d) {
			case 0 :
				d = b.getLittleEndian16();
				jc(b, d);
				break;
			case 1 :
				b.skipPosition(2);
				Tb(b);
				break;
			case 2 :
				b.skipPosition(2);
				kc(b);
				break;
			case 3 :
				break;
			case 5 :
				q.setCursor("default");
				break;
			case 6 :
				break;
			case 8 :
				break;
			case 9 :
				cb(b, 24);
				break;
			case 10 :
				d = b.getLittleEndian16();
				q.setCursor(Ub(d));
				break;
			case 11 :
				d = b;
				a = d.getLittleEndian16();
				cb(d, a);
				break;
			default :
				console.log("XXX RDP5 opcode " + d)
		}
	}
	function Pc(a, b, d, c, k, e, i, l) {
		this.x = a;
		this.y = b;
		this.width = d;
		this.height = c;
		this.mask = k;
		this.pixel = e;
		this.bpp = i;
		this.cache_idx = l
	}
	function cb(a, b) {
		if (!Qc) {
			var d = 0, c = 0, k = 0, e = 0, i = 0, l = 0, h = 0, i = a
					.getLittleEndian16(), d = a.getLittleEndian16(), c = a
					.getLittleEndian16(), k = a.getLittleEndian16(), e = a
					.getLittleEndian16(), l = a.getLittleEndian16(), h = a
					.getLittleEndian16(), h = a.getBytes(h), l = a.getBytes(l);
			if (0 > d || d >= k - 1)
				d = 0;
			0 > c ? c = 0 : c >= e && (c = e - 1);
			h = new Pc(d, c, k, e, l, h, b, i);
			if (!hi5.browser.isOpera) {
				var c = h.x, k = h.y, l = h.width, e = h.height, d = h.cache_idx, f = h.mask, g = h.pixel, j = h.bpp, h = Array(l
						* e), m = 0, o = 0, n, r;
				for (n = 0; n < e; n++)
					for (r = 0; r < l; r++) {
						o = n;
						1 != j && (o = e - o - 1);
						o = o * l + r;
						o = 0 == (f[Math.floor(o / 8)] & 128 >> o % 8) ? 1 : 0;
						h[m] = Rc(r, n, l, e, j, g);
						if (0 == o && 0 != h[m])
							h[m] = ~h[m], h[m] |= 4278190080;
						else if (1 == o || 0 != h[m])
							h[m] |= 4278190080;
						m++
					}
				g = 4 * l * e;
				j = l * e / 8;
				f = 62 + g + j + j;
				f = new Aa(Array(f), 0, f);
				f.setLittleEndian16(0);
				f.setLittleEndian16(2);
				f.setLittleEndian16(1);
				f.setByte(l);
				f.setByte(e);
				f.setByte(0);
				f.setByte(0);
				f.setLittleEndian16(c);
				f.setLittleEndian16(k);
				f.setLittleEndian32(40 + g + j + j);
				f.setLittleEndian32(22);
				f.setLittleEndian32(40);
				f.setLittleEndian32(l);
				f.setLittleEndian32(2 * e);
				f.setLittleEndian16(1);
				f.setLittleEndian16(32);
				f.setLittleEndian32(0);
				f.setLittleEndian32(j + j);
				f.setLittleEndian32(0);
				f.setLittleEndian32(0);
				f.setLittleEndian32(0);
				f.setLittleEndian32(0);
				for (g = e - 1; 0 <= g; g--)
					for (j = 0; j < l; j++)
						m = h[l * g + j], f.setByte(m & 255), f.setByte(m >> 8
								& 255), f.setByte(m >> 16 & 255), f
								.setByte(m >> 24 & 255);
				l = Math.floor(l / 8);
				for (g = 0; g < e; g += 1)
					for (j = 0; j < l; j += 1)
						f.setByte(0);
				for (g = 0; g < e; g += 1)
					for (j = 0; j < l; j += 1)
						f.setByte(0);
				c = {
					data : "data:image/x-icon;base64," + na.enc(f.getData()),
					hotX : c,
					hotY : k
				};
				if (20 > d)
					ab[d] = c;
				else
					throw "Could not put Cursor!";
			}
			q.setCursor(Ub(i))
		}
	}
	function Rc(a, b, d, c, k, e) {
		1 != k && (b = c - b - 1);
		b = (b * d + a) * k;
		d = Math.floor(b / 8);
		a = e[d] & 255;
		switch (k) {
			case 1 :
				return 0 == (a & 128 >> b % 8) ? 0 : 4294967295;
			case 8 :
				return 0 == a ? 0 : 4294967295;
			case 15 :
				return a |= (e[d + 1] & 255) << 8, k = Array(4), ra(a, 15, k, 0), k[0] << 16
						| k[1] << 8 | k[2];
			case 16 :
				return a |= (e[d + 1] & 255) << 8, k = Array(4), ra(a, 16, k, 0), k[0] << 16
						| k[1] << 8 | k[2];
			case 24 :
				return (e[d + 2] & 255) << 16 | (e[d + 1] & 255) << 8 | a;
			case 32 :
				return (e[d + 3] & 255) << 24 | (e[d + 2] & 255) << 16
						| (e[d + 1] & 255) << 8 | a;
			default :
				throw "invalid bpp value for Xor Mask.";
		}
	}
	function kc(a) {
		var b = 0, d = null, c = null, k = null, e = 0;
		a.skipPosition(2);
		b = a.getLittleEndian16();
		a.skipPosition(2);
		for (var d = Array(b), c = Array(b), k = Array(b), a = a
				.getBytes(3 * b), i = 0; i < b; i++)
			d[i] = a[e], c[i] = a[e + 1], k[i] = a[e + 2], e += 3;
		256 == b && (null == U && (U = Array(3)), U[0] = d, U[1] = c, U[2] = k)
	}
	function jc(a, b) {
		for (var d = 0, c = 0; d < b;) {
			c = a.getByte();
			if (0 == (c & 1)) {
				var k = c >> 2;
				if (2 != (c & 3))
					throw "Not a valid Alt secondary order";
				switch (k) {
					case 11 :
						var e = a, i = e.getLittleEndian16(), l = e
								.getLittleEndian32(), h = e.getPosition()
								+ (i - 7);
						if (0 != (l & 16777216)) {
							var f = l, g = e, j = g.getLittleEndian32();
							if (0 != (f & 1073741824))
								console.log("XXX rail icon, winId=" + j);
							else if (0 != (f & 2147483648))
								console.log("XXX rail cache icon, winId=" + j);
							else if (0 != (f & 536870912))
								Zd(j);
							else {
								Z || (Z = !0);
								var m = 0 == (f & 268435456);
								console.log("\n\n================= winId=" + j
										+ " existed=" + m);
								var o = m ? q.railWins[j] : new $d(j);
								if (o) {
									0 != (f & 2)
											&& (o.ownerWinid = g
													.getLittleEndian32(), console
													.log("***** ownerWinid="
															+ o.ownerWinid));
									0 != (f & 8)
											&& (o.style = g.getLittleEndian32(), o.extStyle = g
													.getLittleEndian32(), console
													.log("***** winId=" + j
															+ " style="
															+ o.style
															+ " extStyle="
															+ o.extStyle), console
													.log("*****--- WS_POPUP="
															+ (0 != (o.style & 2147483648))), console
													.log("*****--- WS_DLGFRAME="
															+ (0 != (o.style & 4194304))), console
													.log("*****--- DS_MODALFRAME="
															+ (0 != (o.style & 128))), console
													.log("*****--- WS_EX_DLGMODALFRAME="
															+ (0 != (o.extStyle & 1))), console
													.log("*****--- WS_EX_TOOLWINDOW="
															+ (0 != (o.extStyle & 128))), console
													.log("*****--- WS_BORDER="
															+ (0 != (o.style & 8388608))), console
													.log("*****--- WS_CAPTION="
															+ (0 != (o.style & 12582912))), console
													.log("*****--- WS_OVERLAPPED="
															+ (0 != (o.style & 0))), console
													.log("*****--- WS_OVERLAPPEDWINDOW="
															+ (0 != (o.style & 13565952))), console
													.log("*****--- WS_POPUPWINDOW="
															+ (0 != (o.style & 2156396544))), console
													.log("*****--- WS_SIZEBOX="
															+ (0 != (o.style & 262144))), console
													.log("*****--- WS_CHILD="
															+ (0 != (o.style & 1073741824))), console
													.log("*****--- WS_EX_MDICHILD="
															+ (0 != (o.extStyle & 64))), console
													.log("*****--- WS_EX_LAYERED="
															+ (0 != (o.extStyle & 524288))));
									if (0 != (f & 16)) {
										o.showState = g.getByte();
										console.log("***** winId=" + j
												+ " showState=" + o.showState);
										var x = o.showState;
										if (3 == x)
											o.fillBrowser();
										else if (null != q.getSurface(j)
												&& 3 == C.windowState)
											switch (x) {
												case 2 :
													o.exeCommand(61728);
													break;
												case 5 :
													o.fillBrowser()
											}
									}
									if (0 != (f & 4)) {
										var Yd = g.getLittleEndian16();
										o.titleInfo = g
												.getUnicodeString(Yd, !1);
										console.log("***** winId=" + j
												+ " title=" + o.titleInfo);
										var qa = q.getSurface(o.id);
										null != qa
												&& (qa.browser.document.title = o.titleInfo)
									}
									0 != (f & 16384)
											&& (o.clientOffsetX = g
													.getLittleEndian32(), o.clientOffsetY = g
													.getLittleEndian32(), console
													.log("***** winId=" + j
															+ " coffX"
															+ o.clientOffsetX
															+ " coffY="
															+ o.clientOffsetY));
									0 != (f & 65536)
											&& (o.clientAreaWidth = g
													.getLittleEndian32(), o.clientAreaHeight = g
													.getLittleEndian32(), console
													.log("***** winId="
															+ j
															+ " cw"
															+ o.clientAreaWidth
															+ " ch="
															+ o.clientAreaHeight));
									0 != (f & 131072)
											&& (o.rpContent = g
													.getLittleEndian32());
									0 != (f & 262144)
											&& (o.rootParentHandle = g
													.getLittleEndian32());
									0 != (f & 2048)
											&& (o.winOffsetX = g
													.getLittleEndian32(), o.winOffsetY = g
													.getLittleEndian32(), console
													.log("***** winId=" + j
															+ " offX"
															+ o.winOffsetX
															+ " offY="
															+ o.winOffsetY), null != q
													.getSurface(o.id)
													&& (0 != o.winOffsetX || 0 != o.winOffsetY)
													&& o.fillBrowser());
									0 != (f & 32768)
											&& (o.winClientDeltaX = g
													.getLittleEndian32(), o.winClientDeltaY = g
													.getLittleEndian32(), console
													.log("***** winId=" + j
															+ " dX"
															+ o.winClientDeltaX
															+ " dY="
															+ o.winClientDeltaY));
									0 != (f & 1024)
											&& (o.winWidth = g
													.getLittleEndian32(), o.winHeight = g
													.getLittleEndian32(), console
													.log("***** winId=" + j
															+ " w" + o.winWidth
															+ " h="
															+ o.winHeight), null != q
													.getSurface(o.id)
													&& o.checkBound());
									if (0 != (f & 256)) {
										var w = g.getLittleEndian16();
										0 < w && g.skipPosition(8 * w)
									}
									0 != (f & 4096)
											&& (o.visibleOffsetX = g
													.getLittleEndian32(), o.visibleOffsetY = g
													.getLittleEndian32());
									if (0 != (f & 512)) {
										var y = g.getLittleEndian16();
										o.numVisibilityRects = y;
										0 < y && g.skipPosition(8 * y)
									}
									m || q.addWin(o)
								}
							}
						} else if (0 != (l & 33554432))
							console.log("XXX Alt Sec window Notify=" + l);
						else if (0 != (l & 67108864)) {
							var p = l, s = e;
							console.log("*** -- Alt Sec window Desktop=" + p);
							if (0 != (p & 1))
								console.log("Desktop non monitored flags=" + p);
							else if (0 != (p & 32)) {
								var u = s.getLittleEndian32();
								console.log("Desktop monitored flags=" + p
										+ " winId=" + u);
								if (0 != (p & 16)) {
									var A = s.getByte();
									if (0 < A) {
										var z = q.zOrders;
										z.length = A;
										for (var F = 0; F < A; F++)
											z[F] = s.getLittleEndian32(), console
													.log("---zorders:" + z[F])
									}
								}
							}
						} else
							console.log("XXX Alt Sec window order flgas=" + l);
						e.setPosition(h);
						break;
					default :
						console.log("XXX Alt Sec order not implemented:" + k)
				}
			} else if (0 != (c & 2)) {
				var J = a, Y = void 0, U = void 0, $ = void 0, ea = void 0, Y = J
						.getLittleEndian16(), $ = J.getLittleEndian16(), U = J
						.getByte(), ea = J.getPosition() + Y + 7;
				switch (U) {
					case 0 :
						console.log("TODO: raw bitmap cache");
						break;
					case 1 :
						console.log("TODO: color cache");
						break;
					case 2 :
						var ha = J, oa = $, pa = ha.getByte();
						ha.getByte();
						var ka = ha.getByte(), na = ha.getByte(), za = ha
								.getByte(), Aa = Math.floor((za + 7) / 8), La = ha
								.getLittleEndian16(), Ma = ha
								.getLittleEndian16(), ra = 0;
						0 != (oa & 1024)
								? ra = La
								: (ha.skipPosition(2), ra = ha
										.getLittleEndian16(), ha
										.skipPosition(2), ha.skipPosition(2));
						var Ja = void 0, ya = ha.getBytes(ra), Ja = 1 == Aa
								? vd(ka, na, ya.length, ya)
								: wd(ka, na, ya.length, ya, Aa, r), Ia = pa, vb = Ma, yb = new ae(
								Ja, ka, na, 0, 0, za);
						"undefined" == typeof $a[Ia] && ($a[Ia] = []);
						$a[Ia][vb] = yb;
						break;
					case 3 :
						for (var Na = J, Bb = null, cb = 0, ub = 0, wb = 0, zb = 0, Ab = 0, ab = 0, bb = 0, Db = 0, cb = Na
								.getByte(), ub = Na.getByte(), Eb = 0; Eb < ub; Eb++) {
							var wb = Na.getLittleEndian16(), zb = Na
									.getLittleEndian16(), Ab = Na
									.getLittleEndian16(), ab = Na
									.getLittleEndian16(), bb = Na
									.getLittleEndian16(), Db = bb
									* Math.floor((ab + 7) / 8) + 3 & -4, db = Bb = new be(
									cb, wb, zb, Ab, ab, bb, Na.getBytes(Db));
							if (12 > db.font && 256 > db.character)
								Cb[db.font][db.character] = db;
							else
								throw console.log("put font: font=" + db.font
										+ " c=" + db.character), "Could not put font in cache";
						}
						break;
					case 4 :
						console.log("TODO: bmp cache 2");
						break;
					case 5 :
						console.log("TODO: bmp compressed cache2");
						break;
					default :
						console.log("XXX second Order, type=" + U)
				}
				J.setPosition(ea)
			} else
				a : {
					var fa = a, Oa = c, la = 0, lc = 0, sa = !1;
					if (0 == (Oa & 1))
						throw "Not a standard order!";
					0 != (Oa & 8) && (S.orderType = fa.getByte());
					switch (S.orderType) {
						case 14 :
						case 27 :
							lc = 3;
							break;
						case 1 :
						case 13 :
						case 9 :
							lc = 2;
							break;
						default :
							lc = 1
					}
					var Ub = fa, Vb = lc, tb = 0, Ob = 0;
					0 != (Oa & 64) && Vb--;
					0 != (Oa & 128) && (Vb = 2 > Vb ? 0 : Vb - 2);
					for (var xb = 0; xb < Vb; xb++)
						Ob = Ub.getByte(), tb |= Ob << 8 * xb;
					la = tb;
					if (0 != (Oa & 4)) {
						if (0 == (Oa & 32)) {
							var Ba = fa, V = S.bounds, Pa = Ba.getByte();
							0 != (Pa & 1)
									? V.left = v(Ba, V.left, !1)
									: 0 != (Pa & 16)
											&& (V.left = v(Ba, V.left, !0));
							0 != (Pa & 2)
									? V.top = v(Ba, V.top, !1)
									: 0 != (Pa & 32)
											&& (V.top = v(Ba, V.top, !0));
							0 != (Pa & 4)
									? V.right = v(Ba, V.right, !1)
									: 0 != (Pa & 64)
											&& (V.right = v(Ba, V.right, !0));
							0 != (Pa & 8)
									? V.bottom = v(Ba, V.bottom, !1)
									: 0 != (Pa & 128)
											&& (V.bottom = v(Ba, V.bottom, !0))
						}
						var mc = S.bounds;
						P = mc.left;
						O = mc.top;
						H = mc.right;
						I = mc.bottom
					}
					sa = 0 != (Oa & 16);
					switch (S.orderType) {
						case 0 :
							var Wb = fa, ba = S.destBlt, Xb = la, nc = sa;
							0 != (Xb & 1) && (ba.x = v(Wb, ba.x, nc));
							0 != (Xb & 2) && (ba.y = v(Wb, ba.y, nc));
							0 != (Xb & 4) && (ba.cx = v(Wb, ba.cx, nc));
							0 != (Xb & 8) && (ba.cy = v(Wb, ba.cy, nc));
							0 != (Xb & 16) && (ba.opcode = oc(Wb.getByte()));
							var eb = ba.x, fb = ba.y, Yb = ba.cx, Zb = ba.cy, gc = ba.opcode;
							if (!(eb > n || fb > t)) {
								var Sc = eb + Yb - 1;
								Sc > H && (Sc = H);
								eb < P && (eb = P);
								var Yb = Sc - eb + 1, Tc = fb + Zb - 1;
								Tc > I && (Tc = I);
								fb < O && (fb = O);
								Zb = Tc - fb + 1;
								1 > Yb
										|| 1 > Zb
										|| (pc(gc, D, n, eb, fb, Yb, Zb, null,
												0, 0, 0), D.repaint(eb, fb, Yb,
												Zb))
							}
							break;
						case 1 :
							var Qa = fa, K = S.patBlt, Ra = la, qc = sa;
							0 != (Ra & 1) && (K.x = v(Qa, K.x, qc));
							0 != (Ra & 2) && (K.y = v(Qa, K.y, qc));
							0 != (Ra & 4) && (K.cx = v(Qa, K.cx, qc));
							0 != (Ra & 8) && (K.cy = v(Qa, K.cy, qc));
							if (0 != (Ra & 16)) {
								var hc = K, Pb = Qa.getByte();
								hc.opcode = Pb & 3 | (Pb & 48) >> 2
							}
							0 != (Ra & 32) && (K.backgroundColor = Ca(Qa));
							0 != (Ra & 64) && (K.foregroundColor = Ca(Qa));
							xd(Qa, K.brush, Ra >> 7);
							var Qb = K.x, Rb = K.y;
							if (!(Qb > H || Rb > I)) {
								var Sb = K.opcode, Sa = Qb, Ta = Rb, ia = K.cx, ta = K.cy, rc = K.foregroundColor, Uc = K.backgroundColor, ic = K.brush.xOrigin, jc = K.brush.yOrigin, Tb = K.brush.style, kc = K.brush.pattern, rc = Fb(
										rc, r), Uc = Fb(Uc, r), Vc = Sa + ia
										- 1;
								Vc > H && (Vc = H);
								Sa < P && (Sa = P);
								var ia = Vc - Sa + 1, Wc = Ta + ta - 1;
								Wc > I && (Wc = I);
								Ta < O && (Ta = O);
								ta = Wc - Ta + 1;
								if (!(1 > ia || 1 > ta)) {
									var gb = null;
									switch (Tb) {
										case 0 :
											for (var gb = Array(ia * ta), hb = 0; hb < gb.length; hb++)
												gb[hb] = rc;
											pc(Sb, D, n, Sa, Ta, ia, ta, gb,
													ia, 0, 0);
											D.repaint(Sa, Ta, ia, ta);
											break;
										case 2 :
											console.log("hatch");
											break;
										case 3 :
											for (var gb = Array(ia * ta), ec = 0, hb = 0; hb < ta; hb++)
												for (var Xc = 0; Xc < ia; Xc++)
													gb[ec] = 0 == (kc[(hb + jc)
															% 8] & 1 << (Xc + ic)
															% 8) ? rc : Uc, ec++;
											pc(Sb, D, n, Sa, Ta, ia, ta, gb,
													ia, 0, 0);
											D.repaint(Sa, Ta, ia, ta);
											break;
										default :
											console
													.log("Unsupported brush style "
															+ Tb)
									}
								}
							}
							break;
						case 2 :
							var ib = fa, M = S.screenBlt, jb = la, Gb = sa;
							0 != (jb & 1) && (M.x = v(ib, M.x, Gb));
							0 != (jb & 2) && (M.y = v(ib, M.y, Gb));
							0 != (jb & 4) && (M.cx = v(ib, M.cx, Gb));
							0 != (jb & 8) && (M.cy = v(ib, M.cy, Gb));
							0 != (jb & 16) && (M.opcode = oc(ib.getByte()));
							0 != (jb & 32) && (M.srcX = v(ib, M.srcX, Gb));
							0 != (jb & 64) && (M.srcY = v(ib, M.srcY, Gb));
							var Da = M.x, Ea = M.y;
							if (!(Da > H || Ea > I)) {
								var Ua = M.cx, Hb = M.cy, fc = M.opcode, $b = M.srcX, ac = M.srcY, Yc = Da
										+ Ua - 1;
								Yc > H && (Yc = H);
								Da < P && (Da = P);
								var Ua = Yc - Da + 1, Zc = Ea + Hb - 1;
								Zc > I && (Zc = I);
								Ea < O && (Ea = O);
								Hb = Zc - Ea + 1;
								$b += Da - M.x;
								ac += Ea - M.y;
								1 > Ua
										|| 1 > Hb
										|| (12 != fc ? pc(fc, D, Ua, Da, Ea,
												Ua, Hb, null, Ua, $b, ac) : D
												.copyArea($b, ac, Ua, Hb, Da
																- $b, Ea - ac), D
												.repaint(Da, Ea, Ua, Hb))
							}
							break;
						case 9 :
							var Va = fa, Q = S.line, Wa = la, sc = sa;
							0 != (Wa & 1)
									&& (Q.mixmode = Va.getLittleEndian16());
							0 != (Wa & 2) && (Q.startX = v(Va, Q.startX, sc));
							0 != (Wa & 4) && (Q.startY = v(Va, Q.startY, sc));
							0 != (Wa & 8) && (Q.endX = v(Va, Q.endX, sc));
							0 != (Wa & 16) && (Q.endY = v(Va, Q.endY, sc));
							0 != (Wa & 32) && (Q.backgroundColor = Ca(Va));
							0 != (Wa & 64) && (Q.opcode = Va.getByte());
							var $c = Va, ad = Q.pen, bd = Wa >> 7;
							0 != (bd & 1) && (ad.style = $c.getByte());
							0 != (bd & 2) && (ad.width = $c.getByte());
							0 != (bd & 4) && (ad.color = Ca($c));
							if (1 > Q.opcode || 16 < Q.opcode)
								console.log("invalid ROP2:" + Q.opcode);
							else {
								var kb = Q.startX, Fa = Q.startY, lb = Q.endX, bc = Q.endY, Dc = Q.pen.color, Ec = Q.opcode
										- 1;
								if (Fa == bc) {
									if (kb > lb)
										var cd = kb, kb = lb, lb = cd;
									kb < P && (kb = P);
									lb > H && (lb = H)
								} else if (kb = lb)
									Fa > bc && (cd = Fa, Fa = bc, bc = cd), Fa < O
											&& (Fa = O), Fa > I && (Fa = I);
								yd(kb, Fa, lb, bc, Dc, Ec)
							}
							break;
						case 10 :
							var mb = fa, ca = S.rectangle, nb = la, tc = sa;
							0 != (nb & 1) && (ca.x = v(mb, ca.x, tc));
							0 != (nb & 2) && (ca.y = v(mb, ca.y, tc));
							0 != (nb & 4) && (ca.cx = v(mb, ca.cx, tc));
							0 != (nb & 8) && (ca.cy = v(mb, ca.cy, tc));
							0 != (nb & 16)
									&& (Ka = Ka & 4294967040 | mb.getByte());
							0 != (nb & 32)
									&& (Ka = Ka & 4294902015
											| mb.getByte() << 8);
							0 != (nb & 64)
									&& (Ka = Ka & 4278255615
											| mb.getByte() << 16);
							ca.color = Ka;
							dd(ca.x, ca.y, ca.cx, ca.cy, ca.color, !0);
							break;
						case 11 :
							var Ib = fa, ma = S.deskSave, Jb = la, uc = sa;
							0 != (Jb & 1)
									&& (ma.offset = Ib.getLittleEndian32());
							0 != (Jb & 2) && (ma.left = v(Ib, ma.left, uc));
							0 != (Jb & 4) && (ma.top = v(Ib, ma.top, uc));
							0 != (Jb & 8) && (ma.right = v(Ib, ma.right, uc));
							0 != (Jb & 16)
									&& (ma.bottom = v(Ib, ma.bottom, uc));
							0 != (Jb & 32) && (ma.action = Ib.getByte());
							var Ga = ma, Gc = Ga.right - Ga.left + 1, Hc = Ga.bottom
									- Ga.top + 1;
							if (0 == Ga.action) {
								var zd = Ga.left, Ad = Ga.top, Bd = Gc, Cd = Hc;
								if (!(1 > Bd || 1 > Cd)) {
									var Dd = q.svContext(zd, Ad);
									null != Dd
											&& (Fc = Dd.getImageData(zd, Ad,
													Bd, Cd))
								}
							} else {
								var Ed = Ga.left, Fd = Ga.top, Gd = Fc;
								if (Gd) {
									var Hd = q.svContext(Ed, Fd);
									null != Hd && Hd.putImageData(Gd, Ed, Fd)
								} else
									console.log("XXX no matched desktop save.")
							}
							break;
						case 13 :
							var ua = fa, G = S.memBlt, Ha = la, Kb = sa;
							0 != (Ha & 1)
									&& (G.cacheID = ua.getByte(), G.colorTable = ua
											.getByte());
							0 != (Ha & 2) && (G.x = v(ua, G.x, Kb));
							0 != (Ha & 4) && (G.y = v(ua, G.y, Kb));
							0 != (Ha & 8) && (G.cx = v(ua, G.cx, Kb));
							0 != (Ha & 16) && (G.cy = v(ua, G.cy, Kb));
							0 != (Ha & 32) && (G.opcode = oc(ua.getByte()));
							0 != (Ha & 64) && (G.srcX = v(ua, G.srcX, Kb));
							0 != (Ha & 128) && (G.srcY = v(ua, G.srcY, Kb));
							0 != (Ha & 256)
									&& (G.cacheIDX = ua.getLittleEndian16());
							var Id = G.x, Jd = G.y;
							if (!(Id > H || Jd > I)) {
								var Ic = G.cx, Jc = G.cy, cc = "undefined" == typeof $a[G.cacheID]
										|| "undefined" == typeof $a[G.cacheID][G.cacheIDX]
										? null
										: $a[G.cacheID][G.cacheIDX];
								if (null == cc)
									console
											.log("Failed to get bitmap from cache, id:"
													+ G.cacheID
													+ " idx="
													+ G.cacheIDX);
								else {
									var Kd = cc.byteArray, Ld = cc.width, ed = Id, fd = Jd, vc = Ic, wc = Jc, Md = cc.bytesperpixel;
									1 == Md ? gd(Kd, ed, fd, Ld, cc.height, vc,
											wc, Md) : 1 > vc
											|| 1 > wc
											|| (D.setRGBs(ed, fd, vc, wc, Kd,
													0, Ld), D.repaint(ed, fd,
													vc, wc))
								}
							}
							break;
						case 14 :
							var da = fa, R = S.triBlt, ga = la, Lb = sa;
							0 != (ga & 1)
									&& (R.cacheID = da.getByte(), R.colorTable = da
											.getByte());
							0 != (ga & 2) && (R.x = v(da, R.x, Lb));
							0 != (ga & 4) && (R.y = v(da, R.y, Lb));
							0 != (ga & 8) && (R.cx = v(da, R.cx, Lb));
							0 != (ga & 16) && (R.cy = v(da, R.cy, Lb));
							0 != (ga & 32) && (R.opcode = oc(da.getByte()));
							0 != (ga & 64) && (R.srcX = v(da, R.srcX, Lb));
							0 != (ga & 128) && (R.srcY = v(da, R.srcY, Lb));
							0 != (ga & 256) && (R.backgroundColor = Ca(da));
							0 != (ga & 512) && (R.foregroundColor = Ca(da));
							xd(da, R.brush, ga >> 10);
							0 != (ga & 32768)
									&& (R.cacheIDX = da.getLittleEndian16());
							0 != (ga & 65536)
									&& (R.unknown = da.getLittleEndian16());
							console.log("XXX: TriBlt");
							break;
						case 22 :
							var ob = fa, va = S.polyLine, Mb = la, Nd = sa;
							0 != (Mb & 1) && (va.x = v(ob, va.x, Nd));
							0 != (Mb & 2) && (va.y = v(ob, va.y, Nd));
							0 != (Mb & 4) && (va.opcode = ob.getByte());
							0 != (Mb & 16) && (va.foregroundColor = Ca(ob));
							0 != (Mb & 32) && (va.lines = ob.getByte());
							if (0 != (Mb & 64)) {
								var Od = ob.getByte();
								va.dataSize = Od;
								va.data = ob.getBytes(Od)
							}
							var pb = va, xc = pb.x, yc = pb.y, Kc = pb.foregroundColor, Pd = pb.lines, Lc = pb.dataSize, hd = pb.data, zc = Array(1);
							zc[0] = Math.floor((Pd - 1) / 4) + 1;
							for (var Xa = 0, Mc = 0, Nc = pb.opcode - 1, id = 0; id < Pd
									&& zc[0] < Lc; id++) {
								var Oc = xc, Pc = yc;
								0 == id % 4 && (Xa = hd[Mc++]);
								0 == (Xa & 192) && (Xa |= 192);
								0 != (Xa & 64) && (xc += Qd(hd, zc));
								0 != (Xa & 128) && (yc += Qd(hd, zc));
								yd(Oc, Pc, xc, yc, Kc, Nc);
								Xa <<= 2
							}
							break;
						case 27 :
							var L = fa, B = S.text2, N = la;
							0 != (N & 1) && (B.font = L.getByte());
							0 != (N & 2) && (B.flags = L.getByte());
							0 != (N & 4) && (B.opcode = L.getByte());
							0 != (N & 8) && (B.mixmode = L.getByte());
							0 != (N & 16) && (B.foregroundColor = Ca(L));
							0 != (N & 32) && (B.backgroundColor = Ca(L));
							0 != (N & 64)
									&& (B.clipLeft = L.getLittleEndian16());
							0 != (N & 128)
									&& (B.clipTop = L.getLittleEndian16());
							0 != (N & 256)
									&& (B.clipRight = L.getLittleEndian16());
							0 != (N & 512)
									&& (B.clipBottom = L.getLittleEndian16());
							0 != (N & 1024)
									&& (B.boxLeft = L.getLittleEndian16());
							0 != (N & 2048)
									&& (B.boxTop = L.getLittleEndian16());
							0 != (N & 4096)
									&& (B.boxRight = L.getLittleEndian16());
							0 != (N & 8192)
									&& (B.boxBottom = L.getLittleEndian16());
							0 != (N & 16384) && L.skipPosition(1);
							0 != (N & 32768) && L.skipPosition(1);
							0 != (N & 65536) && L.skipPosition(1);
							0 != (N & 131072) && L.skipPosition(1);
							0 != (N & 262144) && L.skipPosition(7);
							0 != (N & 524288) && (B.x = L.getLittleEndian16());
							0 != (N & 1048576) && (B.y = L.getLittleEndian16());
							0 != (N & 2097152)
									&& (B.length = L.getByte(), B.text = L
											.getBytes(B.length));
							var Rd = B.font, wa = B.flags, jd = B.mixmode, Sd = B.foregroundColor, Ac = B.backgroundColor, kd = B.clipLeft, ld = B.clipTop, dc = B.boxLeft, md = B.boxTop, W = B.x, ja = B.y, qb = B.length, aa = B.text, nd = B.clipRight
									- kd, od = B.clipBottom - ld, Nb = B.boxRight
									- dc, pd = B.boxBottom - md, X = null, Ya = 0, T = 0;
							dc + Nb > n && (Nb = n - dc);
							1 < Nb ? dd(dc, md, Nb, pd, Ac, !1) : 1 == jd
									&& dd(kd, ld, nd, od, Ac, !1);
							for (var Qc = aa.length, E = 0; E < qb;)
								switch (aa[T + E] & 255) {
									case 255 :
										var qd = aa[T + E + 2] & 255;
										if (qd > Qc - T) {
											E = qb = 0;
											break
										}
										for (var Td = Array(aa[T + E + 2] & 255), Rc = aa, sd = T, td = Td, ce = qd, Bc = 0; Bc < ce; Bc++)
											td[0 + Bc] = Rc[sd + Bc];
										var ee = new de(qd, Td), Ud = aa[T + E
												+ 1]
												& 255;
										if (Ud < Za.length)
											Za[Ud] = ee;
										else
											throw "Could not put Text in cache";
										E += 3;
										qb -= E;
										T = E;
										E = 0;
										break;
									case 254 :
										var rb;
										b : {
											var Vd = aa[T + E + 1] & 255, Cc = null;
											if (Vd < Za.length
													&& (Cc = Za[Vd], null != Cc
															&& null != Cc.data)) {
												rb = Cc;
												break b
											}
											rb = null
										}
										var sb = null != rb ? rb.data : null;
										null != rb
												&& 0 == sb[1]
												&& 0 == (wa & 32)
												&& (0 != (wa & 4) ? ja += aa[T
														+ E + 2]
														& 255 : W += aa[T + E
														+ 2]
														& 255);
										E = E + 2 < qb ? E + 3 : E + 2;
										qb -= E;
										T = E;
										E = 0;
										if (null == rb)
											break;
										for (var fe = rb.size, xa = 0; xa < fe; xa++)
											if (X = Wd(Rd, sb[xa] & 255), 0 == (wa & 32)
													&& (Ya = sb[++xa] & 255, 0 != (Ya & 128)
															? (0 != (wa & 4)
																	? ja += sb[xa
																			+ 1]
																			& 255
																			| (sb[xa
																					+ 2] & 255) << 8
																	: W += sb[xa
																			+ 1]
																			& 255
																			| (sb[xa
																					+ 2] & 255) << 8, xa += 2)
															: 0 != (wa & 4)
																	? ja += Ya
																	: W += Ya), null != X)
												Xd(jd, W + X.offset & 65535, ja
																+ X.baseLine
																& 65535,
														X.width, X.height,
														X.fontData, Ac, Sd, rd,
														r), 0 != (wa & 32)
														&& (W += X.width);
										break;
									default :
										X = Wd(Rd, aa[T + E] & 255), 0 == (wa & 32)
												&& (Ya = aa[T + ++E] & 255, 0 != (Ya & 128)
														? (0 != (wa & 4)
																? ja += aa[T
																		+ E + 1]
																		& 255
																		| (aa[T
																				+ E
																				+ 2] & 255) << 8
																: W += aa[T + E
																		+ 1]
																		& 255
																		| (aa[T
																				+ E
																				+ 2] & 255) << 8, E += 2)
														: 0 != (wa & 4)
																? ja += Ya
																: W += Ya), null != X
												&& (Xd(
														jd,
														W + X.offset & 65535,
														ja + X.baseLine & 65535,
														X.width, X.height,
														X.fontData, Ac, Sd, rd,
														r), 0 != (wa & 32)
														&& (W += X.width)), E++
								}
							1 < Nb
									? 0 < pd && D.repaint(dc, md, Nb, pd)
									: 0 < nd && 0 < od
											&& D.repaint(kd, ld, nd, od);
							break;
						default :
							console.log("XXX Order type " + S.orderType);
							break a
					}
					0 != (Oa & 4) && ud()
				}
			d++
		}
	}
	function $d(a) {
		this.id = a;
		this.fillBrowser = function() {
			var b = q.getOwnerSurface(this);
			null != b ? (b = b.browser, this.resize(0, 0, b.innerWidth,
					b.innerHeight)) : console.log("XXX No browser for " + a)
		};
		this.parent = function() {
			return q.railWins[this.ownerWinid]
		};
		this.resize = function(a, d, c, k) {
			w.send("8C1" + this.id + "\t" + a + "\t" + d + "\t" + c + "\t" + k)
		};
		this.checkBound = function() {
			var a = q.getOwnerSurface(this);
			if (null != a) {
				var a = a.browser, d = this.winWidth, c = this.winHeight, k = this.winOffsetX, e = this.winOffsetY;
				if (k + d > a.innerWidth || e + c > a.innerHeight)
					0 > k && (k = 0), 0 > e && (e = 0), k + d > a.innerWidth
							&& (d = a.innerWidth - k), e + c > a.innerHeight
							&& (c = a.innerHeight - e), this.resize(k, e, d, c)
			}
		};
		this.exeCommand = function(b) {
			w.send("8C4" + a + "\t" + b)
		};
		this.activate = function(b) {
			w.send("8C3" + a + "\t" + b);
			q.zOrders[0] = a
		};
		this.close = function() {
			this.exeCommand(61536)
		}
	}
	function Zd(a) {
		console.log("***** delete winId=" + a);
		delete q.railWins[a];
		q.zOrders.removeElm(a);
		q.remaining.removeElm(a);
		var b = q.wins[a];
		if (b)
			if (b.railWin.previous) {
				var d = b.railWin.previous;
				b.railWin = null;
				q.assign(b, d)
			} else
				b.railWin = null, setTimeout(function() {
					if (null == b.railWin) {
						console.log("delete surface:" + a);
						delete q.wins[a];
						q.removeElm(b);
						b.close();
						var c = b.remoteApp;
						c && w.send("8C5" + c.exe + "\t" + c.args);
						0 == q.length
								&& (0 == q.remaining.length ? setTimeout(
										function() {
											0 < q.remaining.length
													|| (console
															.log("All remoteApp close."), Bb())
										}, C.sessionTimeout)
										: C.checkRemaining(0))
					}
				}, C.appTimeout)
	}
	function sd(a, b, d) {
		w.send("8C1" + a.id + "\t0\t0\t" + b + "\t" + d);
		a.winWidth = b;
		a.winHeight = d
	}
	function v(a, b, d) {
		var c = 0;
		d ? (c = a.getByte(), 127 < c && (c -= 256), b += c) : b = a
				.getLittleEndian16();
		return b
	}
	function oc(a) {
		return a & 15
	}
	function Ca(a) {
		var b = 0, d = 0, b = d = a.getByte(), d = a.getByte(), b = b | d << 8, d = a
				.getByte();
		return b | d << 16
	}
	function xd(a, b, d) {
		0 != (d & 1) && (b.xOrigin = a.getByte());
		0 != (d & 2) && (b.yOrigin = a.getByte());
		0 != (d & 4) && (b.style = a.getByte());
		var c = b.pattern;
		0 != (d & 8) && (c[0] = a.getByte());
		if (0 != (d & 16))
			for (d = 1; 8 > d; d++)
				c[d] = a.getByte();
		b.pattern = c
	}
	function Tb(a) {
		var b = 0, d = 0, c = 0, k = 0, e = 0, i = 0, l = 0, h = 0, f = 0, g = 0, j = 0, m = 0, k = 0, o, q, v, qa;
		v = qa = 0;
		o = n;
		q = t;
		for (var b = a.getLittleEndian16(), x = 0; x < b; x++) {
			var d = a.getLittleEndian16(), c = a.getLittleEndian16(), k = a
					.getLittleEndian16(), e = a.getLittleEndian16(), i = a
					.getLittleEndian16(), l = a.getLittleEndian16(), g = a
					.getLittleEndian16(), w = Math.floor((g + 7) / 8), j = a
					.getLittleEndian16(), m = a.getLittleEndian16(), h = k - d
					+ 1, f = e - c + 1;
			o > d && (o = d);
			q > c && (q = c);
			v < k && (v = k);
			qa < e && (qa = e);
			r != g
					&& (console.log("Server limited colour depth to " + g
							+ " bits"), r = g, rd = Math.floor((r + 7) / 8));
			if (0 == j) {
				k = i * w;
				e = l * k;
				g = Array(e);
				j = a.getPosition();
				for (m = 0; m < l; m++) {
					for (var p = a.getData(), s = j, u = g, y = (l - m - 1) * k, A = k, z = 0; z < A; z++)
						u[y + z] = p[s + z];
					j += k
				}
				a.skipPosition(e);
				gd(g, d, c, i, l, h, f, w)
			} else
				(0 != (j & 1024) ? k = m : (a.skipPosition(2), k = a
						.getLittleEndian16(), a.skipPosition(4)), k = a
						.getBytes(k), 1 == w) ? (k = vd(i, l, k.length, k), gd(
						k, d, c, i, l, h, f, w)) : (w = wd(i, l, k.length, k,
						w, r), 1 > h
						|| 1 > f
						|| (D.setRGBs(d, c, h, f, w, 0, i), D.repaint(d, c, h,
								f)))
		}
	}
	function ud() {
		P = 0;
		H = n - 1;
		O = 0;
		I = t - 1
	}
	function yd(a, b, d, c, k, e) {
		k = Fb(k, r);
		if (a == d || b == c) {
			var i, l;
			if (b == c) {
				if (b >= O && b <= I)
					if (d > a) {
						a < P && (a = P);
						d > H && (d = H);
						i = b * n + a;
						for (l = 0; l < d - a; l++)
							ya(e, D, a + l, b, k), i++;
						D.repaint(a, b, d - a + 1, 1)
					} else {
						d < P && (d = P);
						a > H && (a = H);
						i = b * n + a;
						for (l = 0; l < a - d; l++)
							ya(e, D, d + l, b, k), i--;
						D.repaint(d, b, a - d + 1, 1)
					}
			} else if (a >= P && a <= H)
				if (c > b) {
					b < O && (b = O);
					c > I && (c = I);
					i = b * n + a;
					for (l = 0; l < c - b; l++)
						ya(e, D, a, b + l, k), i += n;
					D.repaint(a, b, 1, c - b + 1)
				} else {
					c < O && (c = O);
					b > I && (b = I);
					i = b * n + a;
					for (l = 0; l < b - c; l++)
						ya(e, D, a, c + l, k), i -= n;
					D.repaint(a, c, 1, b - c + 1)
				}
		} else {
			var h = Math.abs(d - a), f = Math.abs(c - b);
			i = a;
			l = b;
			var g, j, m, o, q, t, qa;
			j = d >= a ? g = 1 : g = -1;
			o = c >= b ? m = 1 : m = -1;
			h >= f
					? (o = g = 0, t = h, q = h / 2, qa = f)
					: (m = j = 0, t = f, q = f / 2, qa = h, h = f);
			for (f = 0; f <= h; f++)
				i < P || i > H || l < O || l > I || ya(e, D, i, l, k), q += qa, q >= t
						&& (q -= t, i += g, l += m), i += j, l += o;
			e = a < d ? a : d;
			k = b < c ? b : c;
			D.repaint(e, k, (a > d ? a : d) - e + 1, (b > c ? b : c) - k + 1)
		}
	}
	function Xd(a, b, d, c, k, e, i, l, h) {
		var f = 0, g = 128, f = Math.floor((c - 1) / 8) + 1, j, l = Fb(l, r), i = Fb(
				i, r);
		3 == h
				&& (l = (l & 255) << 16 | l & 65280 | (l & 16711680) >> 16, i = (i & 255) << 16
						| i & 65280 | (i & 16711680) >> 16);
		if (!(b > H || d > I))
			if (h = b + c - 1, h > H && (h = H), c = b < P ? P : b, h = h - b
					+ 1, j = d + k - 1, j > I && (j = I), k = d < O ? O : d, j = j
					- k + 1, !(1 > h || 1 > j))
				if (f *= k - d, 0 == a)
					for (a = 0; a < j; a++) {
						for (var m = 0; m < h; m++)
							0 == g && (f++, g = 128), 0 != (e[f] & g)
									&& b + m >= c && 0 < c + m && 0 < k + a
									&& D.setRGB(c + m, k + a, l), g >>= 1;
						f++;
						g = 128;
						f == e.length && (f = 0)
					}
				else
					for (a = 0; a < j; a++) {
						for (m = 0; m < h; m++)
							0 == g && (f++, g = 128), b + m >= c
									&& 0 < b + m
									&& 0 < d + a
									&& (0 != (e[f] & g) ? D.setRGB(b + m,
											d + a, l) : D.setRGB(b + m, d + a,
											i)), g >>= 1;
						f++;
						g = 128;
						f == e.length && (f = 0)
					}
	}
	function Fb(a, b) {
		switch (b) {
			case 16 :
				return 4278190080 | (a >> 8 & 248 | a >> 13 & 7) << 16
						| (a >> 3 & 252 | a >> 9 & 3) << 8 | a << 3 & 248
						| a >> 2 & 7;
			case 15 :
				return 4278190080 | (a >> 7 & 248 | a >> 12 & 7) << 16
						| (a >> 2 & 248 | a >> 8 & 7) << 8 | a << 3 & 248
						| a >> 2 & 7;
			case 8 :
				return 4278190080 | U[0][a] << 16 | U[1][a] << 8 | U[2][a];
			case 32 :
				return 4278190080 | (a & 255) << 16 | a & 65280
						| (a & 16711680) >> 16;
			case 24 :
				return 4278190080 | (a & 255) << 16 | a & 65280
						| (a & 16711680) >> 16
		}
		console.log("XXXX no here")
	}
	function Qd(a, b) {
		var d = a[b[0]++] & 255, c = d & 128, d = 0 != (d & 64) ? d | -64 : d
				& 63;
		0 != c && (d = d << 8 | a[b[0]++] & 255);
		return d
	}
	function dd(a, b, d, c, k, e) {
		if (!(a > H || b > I))
			if (d = a + d - 1, d > H && (d = H), a < P && (a = P), d = d - a
					+ 1, c = b + c - 1, c > I && (c = I), b < O && (b = O), c = c
					- b + 1, !(1 > d || 1 > c))
				if (D.fillRect(a, b, d, c, Fb(k, r)), e
						&& (e = q.svContext(a, b), null != e)) {
					var i = Array(4);
					ra(k, r, i, 0);
					e.fillStyle = "rgba(" + i[0] + "," + i[1] + "," + i[2]
							+ "," + i[3] + ")";
					e.fillRect(a, b, d, c)
				}
	}
	function gd(a, b, d, c, k, e, i, l) {
		k = q.svContext(b, d);
		if (null != k) {
			var h = k.createImageData(e, i), f = r, g = h.data, i = e * i;
			if (2 == l) {
				a = new tb(a, 2 * e, 2 * c);
				for (c = 0; c < i; c++)
					e = a.next() & 255 | (a.next() & 255) << 8, l = 4 * c, ra(
							e, f, g, l)
			} else if (1 == l) {
				a = new tb(a, e, c);
				for (c = 0; c < i; c++)
					e = a.next() & 255, l = 4 * c, ra(e, f, g, l)
			} else {
				a = new tb(a, 3 * e, 3 * c);
				for (c = 0; c < i; c++)
					e = a.next() & 255 | (a.next() & 255) << 8
							| (a.next() & 255) << 16, l = 4 * c, ra(e, f, g, l)
			}
			k.putImageData(h, b, d)
		}
	}
	function Bb() {
		null != w && J && (w.send("85"), w.close())
	}
	function de(a, b) {
		this.size = a;
		this.data = b
	}
	function be(a, b, d, c, k, e, i) {
		this.font = a;
		this.character = b;
		this.offset = d;
		this.baseLine = c;
		this.width = k;
		this.height = e;
		this.fontData = i
	}
	function ub(a, b, d, c, k, e, i) {
		for (var l = k * d + c, h = a.setRGB, f = a.getRGB, g = 0; g < i; g++) {
			for (var j = 0; j < e; j++) {
				if (null != a) {
					var m = f(c + j, k + g);
					h(c + j, k + g, ~m & F)
				} else
					b[l] = ~b[l] & F;
				l++
			}
			l += d - e
		}
	}
	function pc(a, b, d, c, k, e, i, l, h, f, g) {
		if (!(0 > e | 0 > i | 0 > d | 0 > h))
			switch (a) {
				case 0 :
					l = b.setRGB;
					for (h = c; h < c + e; h++)
						for (b = k; b < k + i; b++)
							l(h, b, 0);
					break;
				case 1 :
					a = g * h + f;
					d = b.setRGB;
					for (f = 0; f < i; f++) {
						for (g = 0; g < e; g++)
							d(c + e, k + i, ~(b.getRGB(c + e, k + i) | l[a])
											& F);
						a += h - e
					}
					break;
				case 2 :
					a = g * h + f;
					d = b.setRGB;
					b = b.getRGB;
					for (f = 0; f < i; f++) {
						for (g = 0; g < e; g++) {
							var j = b(c + e, k + i);
							d(c + e, k + i, j & ~l[a] & F);
							a++
						}
						a += h - e
					}
					break;
				case 3 :
					ub(b, l, h, f, g, e, i);
					null == l ? b.copyArea(f, g, e, i, c - f, k - g) : b
							.setRGBs(c, k, e, i, l, 0, h);
					break;
				case 4 :
					ub(b, null, d, c, k, e, i);
					ec(b, d, c, k, e, i, l, h, f, g);
					break;
				case 5 :
					ub(b, null, d, c, k, e, i);
					break;
				case 6 :
					a = g * h + f;
					d = b.setRGB;
					b = b.getRGB;
					for (f = 0; f < i; f++) {
						for (g = 0; g < e; g++)
							j = b(c + g, k + f), d(c + g, k + f, j ^ l[a] & F), a++;
						a += h - e
					}
					break;
				case 7 :
					a = g * h + f;
					d = b.setRGB;
					b = b.getRGB;
					for (f = 0; f < i; f++) {
						for (g = 0; g < e; g++)
							j = b(c + g, k + f), d(c + g, k + f, ~(j & l[a])
											& F), a++;
						a += h - e
					}
					break;
				case 8 :
					ec(b, d, c, k, e, i, l, h, f, g);
					break;
				case 9 :
					a = g * h + f;
					d = b.setRGB;
					b = b.getRGB;
					for (f = 0; f < i; f++) {
						for (g = 0; g < e; g++)
							j = b(c + g, k + f), d(c + g, k + f, j ^ ~l[a] & F), a++;
						a += h - e
					}
					break;
				case 10 :
					break;
				case 11 :
					a = g * h + f;
					d = b.setRGB;
					b = b.getRGB;
					for (f = 0; f < i; f++) {
						for (g = 0; g < e; g++)
							j = b(c + g, k + f), d(c + g, k + f, j | ~l[a] & F), a++;
						a += h - e
					}
					break;
				case 12 :
					null == l ? b.copyArea(f, g, e, i, c - f, k - g) : b
							.setRGBs(c, k, e, i, l, 0, h);
					break;
				case 13 :
					ub(b, null, d, c, k, e, i);
					fc(b, d, c, k, e, i, l, h, f, g);
					break;
				case 14 :
					fc(b, d, c, k, e, i, l, h, f, g);
					break;
				case 15 :
					l = b.setRGB;
					for (h = c; h < c + e; h++)
						for (b = k; b < k + i; b++)
							l(h, b, F);
					break;
				default :
					console.log("unsupported opcode: " + a)
			}
	}
	function ya(a, b, d, c, k) {
		if (null != b) {
			var e = b.getRGB(d, c);
			switch (a) {
				case 0 :
					b.setRGB(d, c, 0);
					break;
				case 1 :
					b.setRGB(d, c, ~(e | k) & F);
					break;
				case 2 :
					b.setRGB(d, c, e & ~k & F);
					break;
				case 3 :
					b.setRGB(d, c, ~k & F);
					break;
				case 4 :
					b.setRGB(d, c, (~e & k) * F);
					break;
				case 5 :
					b.setRGB(d, c, ~e & F);
					break;
				case 6 :
					b.setRGB(d, c, e ^ k & F);
					break;
				case 7 :
					b.setRGB(d, c, ~e & k & F);
					break;
				case 8 :
					b.setRGB(d, c, e & k & F);
					break;
				case 9 :
					b.setRGB(d, c, e ^ ~k & F);
					break;
				case 10 :
					break;
				case 11 :
					b.setRGB(d, c, e | ~k & F);
					break;
				case 12 :
					b.setRGB(d, c, k);
					break;
				case 13 :
					b.setRGB(d, c, (~e | k) & F);
					break;
				case 14 :
					b.setRGB(d, c, e | k & F);
					break;
				case 15 :
					b.setRGB(d, c, F);
					break;
				default :
					console.log("unsupported pixel opcode: " + a)
			}
		}
	}
	function ec(a, b, d, c, k, e, i, l, h, f) {
		b = f * l + h;
		h = a.setRGB;
		a = a.getRGB;
		for (f = 0; f < e; f++) {
			for (var g = 0; g < k; g++) {
				var j = a(d + g, c + f);
				h(d + g, c + f, j & i[b] & F);
				b++
			}
			b += l - k
		}
	}
	function fc(a, b, d, c, k, e, i, l, h, f) {
		b = f * l + h;
		h = a.setRGB;
		a = a.getRGB;
		for (f = 0; f < e; f++) {
			for (var g = 0; g < k; g++) {
				var j = a(d + g, c + f);
				h(d + g, c + f, j | i[b] & F);
				b++
			}
			b += l - k
		}
	}
	function Wd(a, b) {
		if (12 > a && 256 > b) {
			var d = Cb[a][b];
			if (null != d)
				return d
		}
		return null
	}
	function Ub(a) {
		if (20 > a && (a = ab[a], null != a))
			return a;
		throw "Cursor not found";
	}
	function ae(a, b, d, c, k, e) {
		this.byteArray = a;
		this.left = c;
		this.top = k;
		this.width = b;
		this.height = d;
		this.bitsperpixel = e;
		this.bytesperpixel = Math.floor((e + 7) / 8)
	}
	function ra(a, b, d, c) {
		switch (b) {
			case 16 :
				var b = a >> 8 & 248, k = a >> 3 & 252, a = a << 3 & 255;
				d[c] = b | b >> 5;
				d[c + 1] = k | k >> 6;
				d[c + 2] = a | a >> 5;
				d[c + 3] = 255;
				break;
			case 15 :
				b = a >> 7 & 248;
				k = a >> 2 & 248;
				a = a << 3 & 255;
				d[c] = b | b >> 5;
				d[c + 1] = k | k >> 5;
				d[c + 2] = a | a >> 5;
				d[c + 3] = 255;
				break;
			case 8 :
				d[c] = U[0][a];
				d[c + 1] = U[1][a];
				d[c + 2] = U[2][a];
				d[c + 3] = 255;
				break;
			case 32 :
				d[c] = a & 255, d[c + 1] = a >> 8 & 255, d[c + 2] = a >> 16
						& 255, d[c + 3] = a >> 24 & 255;
			default :
				d[c] = a & 255, d[c + 1] = a >> 8 & 255, d[c + 2] = a >> 16
						& 255, d[c + 3] = 255
		}
	}
	function Ia(a, b, d) {
		for (var c = 0, d = d - 1; 0 <= d; d--)
			c <<= 8, c |= a[b + d] & 255;
		return c
	}
	function vb(a, b) {
		var d = a[b] & 255, c = (a[b + 1] & 255) << 8 | d, k = c >> 7 & 248, c = c >> 2
				& 248, d = d << 3 & 255;
		return (k | k >> 5) << 16 | (c | c >> 5) << 8 | d | d >> 5
	}
	function Dc(a, b, d) {
		return a = 0 | a[b + d] & 255
	}
	function wd(a, b, d, c, k, e) {
		switch (e) {
			case 16 :
				return td(a, b, d, c);
			case 15 :
				for (var k = b, e = b = -1, i = 0, l = i + d, h = d = 0, f = 0, g = a, j = -1, m = 0, o = h = 0, n = 0, q = f = 0, r = 4294967295, t = !1, v = !1, p = !1, s = Array(a
						* k); i < l;) {
					m = 0;
					h = c[i++] & 255;
					d = h >> 4;
					switch (d) {
						case 12 :
						case 13 :
						case 14 :
							d -= 6;
							h &= 15;
							f = 16;
							break;
						case 15 :
							d = h & 15;
							9 > d
									? (h = c[i++] & 255, h |= (c[i++] & 255) << 8)
									: h = 11 > d ? 8 : 1;
							f = 0;
							break;
						default :
							d >>= 1, h &= 31, f = 32
					}
					0 != f
							&& (p = 2 == d || 7 == d, 0 == h ? h = p
									? (c[i++] & 255) + 1
									: (c[i++] & 255) + f : p && (h <<= 3));
					switch (d) {
						case 0 :
							j == d && !(g == a && -1 == b) && (t = !0);
							break;
						case 8 :
							o = vb(c, i), i += 2;
						case 3 :
							n = vb(c, i);
							i += 2;
							break;
						case 6 :
						case 7 :
							r = vb(c, i);
							i += 2;
							d -= 5;
							break;
						case 9 :
							q = 3;
							d = 2;
							m = 3;
							break;
						case 10 :
							q = 5, d = 2, m = 5
					}
					j = d;
					for (f = 0; 0 < h;) {
						if (g >= a) {
							if (0 >= k)
								throw "Decompressing bitmap failed! Height = "
										+ k;
							g = 0;
							k--;
							b = e;
							e = 0 + k * a
						}
						switch (d) {
							case 0 :
								t
										&& (s[e + g] = -1 == b ? r : s[b + g]
												^ r, t = !1, h--, g++);
								if (-1 == b) {
									for (; 0 != (h & -8) && g + 8 < a;)
										for (p = 0; 8 > p; p++)
											s[e + g] = 0, h--, g++;
									for (; 0 < h && g < a;)
										s[e + g] = 0, h--, g++
								} else {
									for (; 0 != (h & -8) && g + 8 < a;)
										for (p = 0; 8 > p; p++)
											s[e + g] = s[b + g], h--, g++;
									for (; 0 < h && g < a;)
										s[e + g] = s[b + g], h--, g++
								}
								break;
							case 1 :
								if (-1 == b) {
									for (; 0 != (h & -8) && g + 8 < a;)
										for (p = 0; 8 > p; p++)
											s[e + g] = r, h--, g++;
									for (; 0 < h && g < a;)
										s[e + g] = r, h--, g++
								} else {
									for (; 0 != (h & -8) && g + 8 < a;)
										for (p = 0; 8 > p; p++)
											s[e + g] = s[b + g] ^ r, h--, g++;
									for (; 0 < h && g < a;)
										s[e + g] = s[b + g] ^ r, h--, g++
								}
								break;
							case 2 :
								if (-1 == b) {
									for (; 0 != (h & -8) && g + 8 < a;)
										for (p = 0; 8 > p; p++)
											f <<= 1, f &= 255, 0 == f
													&& (q = 0 != m
															? m & 255
															: c[i++], f = 1), s[e
													+ g] = 0 != (q & f) ? r
													& 255 : 0, h--, g++;
									for (; 0 < h && g < a;)
										f <<= 1, f &= 255, 0 == f
												&& (q = 0 != m
														? m & 255
														: c[i++], f = 1), s[e
												+ g] = 0 != (q & f) ? r : 0, h--, g++
								} else {
									for (; 0 != (h & -8) && g + 8 < a;)
										for (p = 0; 8 > p; p++)
											f <<= 1, f &= 255, 0 == f
													&& (q = 0 != m
															? m & 255
															: c[i++], f = 1), s[e
													+ g] = 0 != (q & f) ? s[b
													+ g]
													^ r : s[b + g], h--, g++;
									for (; 0 < h && g < a;)
										f <<= 1, f &= 255, 0 == f
												&& (q = 0 != m
														? m & 255
														: c[i++], f = 1), s[e
												+ g] = 0 != (q & f) ? s[b + g]
												^ r : s[b + g], h--, g++
								}
								break;
							case 3 :
								for (; 0 != (h & -8) && g + 8 < a;)
									for (p = 0; 8 > p; p++)
										s[e + g] = n, h--, g++;
								for (; 0 < h && g < a;)
									s[e + g] = n, h--, g++;
								break;
							case 4 :
								for (; 0 != (h & -8) && g + 8 < a;)
									for (p = 0; 8 > p; p++)
										s[e + g] = vb(c, i), i += 2, h--, g++;
								for (; 0 < h && g < a;)
									s[e + g] = vb(c, i), i += 2, h--, g++;
								break;
							case 8 :
								for (; 0 != (h & -8) && g + 8 < a;)
									for (p = 0; 8 > p; p++)
										v
												? (s[e + g] = n, v = !1)
												: (s[e + g] = o, v = !0, h++), h--, g++;
								for (; 0 < h && g < a;)
									v
											? (s[e + g] = n, v = !1)
											: (s[e + g] = o, v = !0, h++), h--, g++;
								break;
							case 13 :
								for (; 0 != (h & -8) && g + 8 < a;)
									for (p = 0; 8 > p; p++)
										s[e + g] = 16777215, h--, g++;
								for (; 0 < h && g < a;)
									s[e + g] = 16777215, h--, g++;
								break;
							case 14 :
								for (; 0 != (h & -8) && g + 8 < a;)
									for (p = 0; 8 > p; p++)
										s[e + g] = 0, h--, g++;
								for (; 0 < h && g < a;)
									s[e + g] = 0, h--, g++;
								break;
							default :
								throw "Unimplemented decompress opcode " + d;
						}
					}
				}
				return s;
			case 32 :
				if (16 != c[0])
					throw "Wrong tag.";
				input = 1;
				k = Array(4 * a * b);
				e = wb(c, input, a, b, k, 3);
				input += e;
				e = wb(c, input, a, b, k, 2);
				input += e;
				e = wb(c, input, a, b, k, 1);
				input += e;
				wb(c, input, a, b, k, 0);
				a = Math.floor(k.length / 4);
				c = Array(a);
				for (e = b = 0; e < a; e++)
					b = e << 2, c[e] = k[b + 3] << 24 | k[b + 2] << 16
							| k[b + 1] << 8 | k[b + 0] << 0;
				return c;
			default :
				for (var i = e = -1, l = 0, d = l + d, p = f = g = 0, j = a, m = -1, r = p = q = n = f = o = 0, t = 4294967295, u = s = v = !1, h = Array(a
						* b); l < d;) {
					o = 0;
					f = c[l++] & 255;
					g = f >> 4;
					switch (g) {
						case 12 :
						case 13 :
						case 14 :
							g -= 6;
							f &= 15;
							p = 16;
							break;
						case 15 :
							g = f & 15;
							9 > g
									? (f = c[l++] & 255, f |= (c[l++] & 255) << 8)
									: f = 11 > g ? 8 : 1;
							p = 0;
							break;
						default :
							g >>= 1, f &= 31, p = 32
					}
					0 != p
							&& (u = 2 == g || 7 == g, 0 == f ? f = u
									? (c[l++] & 255) + 1
									: (c[l++] & 255) + p : u && (f <<= 3));
					switch (g) {
						case 0 :
							m == g && !(j == a && -1 == e) && (v = !0);
							break;
						case 8 :
							n = Ia(c, l, k), l += k;
						case 3 :
							q = Ia(c, l, k);
							l += k;
							break;
						case 6 :
						case 7 :
							t = Ia(c, l, k);
							l += k;
							g -= 5;
							break;
						case 9 :
							r = 3;
							g = 2;
							o = 3;
							break;
						case 10 :
							r = 5, g = 2, o = 5
					}
					m = g;
					for (p = 0; 0 < f;) {
						if (j >= a) {
							if (0 >= b)
								throw "Decompressing bitmap failed! Height = "
										+ b;
							j = 0;
							b--;
							e = i;
							i = 0 + b * a
						}
						switch (g) {
							case 0 :
								v
										&& (h[i + j] = -1 == e ? t : h[e + j]
												^ t, v = !1, f--, j++);
								if (-1 == e) {
									for (; 0 != (f & -8) && j + 8 < a;)
										for (u = 0; 8 > u; u++)
											h[i + j] = 0, f--, j++;
									for (; 0 < f && j < a;)
										h[i + j] = 0, f--, j++
								} else {
									for (; 0 != (f & -8) && j + 8 < a;)
										for (u = 0; 8 > u; u++)
											h[i + j] = h[e + j], f--, j++;
									for (; 0 < f && j < a;)
										h[i + j] = h[e + j], f--, j++
								}
								break;
							case 1 :
								if (-1 == e) {
									for (; 0 != (f & -8) && j + 8 < a;)
										for (u = 0; 8 > u; u++)
											h[i + j] = t, f--, j++;
									for (; 0 < f && j < a;)
										h[i + j] = t, f--, j++
								} else {
									for (; 0 != (f & -8) && j + 8 < a;)
										for (u = 0; 8 > u; u++)
											h[i + j] = h[e + j] ^ t, f--, j++;
									for (; 0 < f && j < a;)
										h[i + j] = h[e + j] ^ t, f--, j++
								}
								break;
							case 2 :
								if (-1 == e) {
									for (; 0 != (f & -8) && j + 8 < a;)
										for (u = 0; 8 > u; u++)
											p <<= 1, p &= 255, 0 == p
													&& (r = 0 != o
															? o & 255
															: c[l++], p = 1), h[i
													+ j] = 0 != (r & p) ? t : 0, f--, j++;
									for (; 0 < f && j < a;)
										p <<= 1, p &= 255, 0 == p
												&& (r = 0 != o
														? o & 255
														: c[l++], p = 1), h[i
												+ j] = 0 != (r & p) ? t : 0, f--, j++
								} else {
									for (; 0 != (f & -8) && j + 8 < a;)
										for (u = 0; 8 > u; u++)
											p <<= 1, p &= 255, 0 == p
													&& (r = 0 != o
															? o & 255
															: c[l++], p = 1), h[i
													+ j] = 0 != (r & p) ? h[e
													+ j]
													^ t : h[e + j], f--, j++;
									for (; 0 < f && j < a;)
										p <<= 1, p &= 255, 0 == p
												&& (r = 0 != o
														? o & 255
														: c[l++], p = 1), h[i
												+ j] = 0 != (r & p) ? h[e + j]
												^ t : h[e + j], f--, j++
								}
								break;
							case 3 :
								for (; 0 != (f & -8) && j + 8 < a;)
									for (u = 0; 8 > u; u++)
										h[i + j] = q, f--, j++;
								for (; 0 < f && j < a;)
									h[i + j] = q, f--, j++;
								break;
							case 4 :
								for (; 0 != (f & -8) && j + 8 < a;)
									for (u = 0; 8 > u; u++)
										h[i + j] = Ia(c, l, k), l += k, f--, j++;
								for (; 0 < f && j < a;)
									h[i + j] = Ia(c, l, k), l += k, f--, j++;
								break;
							case 8 :
								for (; 0 != (f & -8) && j + 8 < a;)
									for (u = 0; 8 > u; u++)
										s
												? (h[i + j] = q, s = !1)
												: (h[i + j] = n, s = !0, f++), f--, j++;
								for (; 0 < f && j < a;)
									s
											? (h[i + j] = q, s = !1)
											: (h[i + j] = n, s = !0, f++), f--, j++;
								break;
							case 13 :
								for (; 0 != (f & -8) && j + 8 < a;)
									for (u = 0; 8 > u; u++)
										h[i + j] = 16777215, f--, j++;
								for (; 0 < f && j < a;)
									h[i + j] = 16777215, f--, j++;
								break;
							case 14 :
								for (; 0 != (f & -8) && j + 8 < a;)
									for (u = 0; 8 > u; u++)
										h[i + j] = 0, f--, j++;
								for (; 0 < f && j < a;)
									h[i + j] = 0, f--, j++;
								break;
							default :
								throw "Unimplemented decompress opcode " + g;
						}
					}
				}
				return h
		}
	}
	function wb(a, b, d, c, k, e) {
		var i, l, h, f, g, j, m, o, n = b, r = e;
		for (l = m = 0; l < c;) {
			e = r + 4 * d * c - 4 * (l + 1) * d;
			g = 0;
			o = e;
			i = 0;
			if (0 == m)
				for (; i < d;) {
					h = a[b++] & 255;
					f = h & 15;
					h = h >> 4 & 15;
					j = f << 4 | h;
					47 >= j && 16 <= j && (f = j, h = 0);
					for (; 0 < h;)
						g = a[b++] & 255, k[e] = g, e += 4, i++, h--;
					for (; 0 < f;)
						k[e] = g, e += 4, i++, f--
				}
			else
				for (; i < d;) {
					h = a[b++] & 255;
					f = h & 15;
					h = h >> 4 & 15;
					j = f << 4 | h;
					47 >= j && 16 <= j && (f = j, h = 0);
					for (; 0 < h;)
						j = a[b++] & 255, 0 != (j & 1)
								? (j >>= 1, j += 1, g = -j)
								: g = j >>= 1, j = k[m + 4 * i] + g, k[e] = j, e += 4, i++, h--;
					for (; 0 < f;)
						j = k[m + 4 * i] + g, k[e] = j, e += 4, i++, f--
				}
			l++;
			m = o
		}
		return b - n
	}
	function td(a, b, d, c) {
		function k(a, b) {
			var c = a[b] & 255, d = (a[b + 1] & 255) << 8 | c, e = d >> 8 & 248, d = d >> 3
					& 252, c = c << 3 & 255;
			return (e | e >> 5) << 16 | (d | d >> 6) << 8 | c | c >> 5
		}
		for (var e = -1, i = -1, l = 0, d = l + d, h = 0, f = 0, g = 0, j = a, m = -1, o = 0, n = f = 0, r = 0, q = g = 0, t = 4294967295, v = !1, p = !1, s = !1, u = Array(a
				* b); l < d;) {
			o = 0;
			f = c[l++] & 255;
			h = f >> 4;
			switch (h) {
				case 12 :
				case 13 :
				case 14 :
					h -= 6;
					f &= 15;
					g = 16;
					break;
				case 15 :
					h = f & 15;
					9 > h
							? (f = c[l++] & 255, f |= (c[l++] & 255) << 8)
							: f = 11 > h ? 8 : 1;
					g = 0;
					break;
				default :
					h >>= 1, f &= 31, g = 32
			}
			0 != g
					&& (s = 2 == h || 7 == h, 0 == f ? f = s ? (c[l++] & 255)
							+ 1 : (c[l++] & 255) + g : s && (f <<= 3));
			switch (h) {
				case 0 :
					m == h && !(j == a && -1 == e) && (v = !0);
					break;
				case 8 :
					n = k(c, l), l += 2;
				case 3 :
					r = k(c, l);
					l += 2;
					break;
				case 6 :
				case 7 :
					t = k(c, l);
					l += 2;
					h -= 5;
					break;
				case 9 :
					q = 3;
					h = 2;
					o = 3;
					break;
				case 10 :
					q = 5, h = 2, o = 5
			}
			m = h;
			for (g = 0; 0 < f;) {
				if (j >= a) {
					if (0 >= b)
						throw "Decompressing bitmap failed! Height = " + b;
					j = 0;
					b--;
					e = i;
					i = 0 + b * a
				}
				switch (h) {
					case 0 :
						v
								&& (u[i + j] = -1 == e ? t : u[e + j] ^ t, v = !1, f--, j++);
						if (-1 == e) {
							for (; 0 != (f & -8) && j + 8 < a;)
								for (s = 0; 8 > s; s++)
									u[i + j] = 0, f--, j++;
							for (; 0 < f && j < a;)
								u[i + j] = 0, f--, j++
						} else {
							for (; 0 != (f & -8) && j + 8 < a;)
								for (s = 0; 8 > s; s++)
									u[i + j] = u[e + j], f--, j++;
							for (; 0 < f && j < a;)
								u[i + j] = u[e + j], f--, j++
						}
						break;
					case 1 :
						if (-1 == e) {
							for (; 0 != (f & -8) && j + 8 < a;)
								for (s = 0; 8 > s; s++)
									u[i + j] = t, f--, j++;
							for (; 0 < f && j < a;)
								u[i + j] = t, f--, j++
						} else {
							for (; 0 != (f & -8) && j + 8 < a;)
								for (s = 0; 8 > s; s++)
									u[i + j] = u[e + j] ^ t, f--, j++;
							for (; 0 < f && j < a;)
								u[i + j] = u[e + j] ^ t, f--, j++
						}
						break;
					case 2 :
						if (-1 == e) {
							for (; 0 != (f & -8) && j + 8 < a;)
								for (s = 0; 8 > s; s++)
									g <<= 1, g &= 255, 0 == g
											&& (q = 0 != o ? o & 255 : c[l++]
													& 255, g = 1), u[i + j] = 0 != (q & g)
											? t
											: 0, f--, j++;
							for (; 0 < f && j < a;)
								g <<= 1, g &= 255, 0 == g
										&& (q = 0 != o ? o & 255 : c[l++] & 255, g = 1), u[i
										+ j] = 0 != (q & g) ? t : 0, f--, j++
						} else {
							for (; 0 != (f & -8) && j + 8 < a;)
								for (s = 0; 8 > s; s++)
									g <<= 1, g &= 255, 0 == g
											&& (q = 0 != o ? o & 255 : c[l++]
													& 255, g = 1), u[i + j] = 0 != (q & g)
											? u[e + j] ^ t
											: u[e + j], f--, j++;
							for (; 0 < f && j < a;)
								g <<= 1, g &= 255, 0 == g
										&& (q = 0 != o ? o & 255 : c[l++] & 255, g = 1), u[i
										+ j] = 0 != (q & g)
										? u[e + j] ^ t
										: u[e + j], f--, j++
						}
						break;
					case 3 :
						for (; 0 != (f & -8) && j + 8 < a;)
							for (s = 0; 8 > s; s++)
								u[i + j] = r, f--, j++;
						for (; 0 < f && j < a;)
							u[i + j] = r, f--, j++;
						break;
					case 4 :
						for (; 0 != (f & -8) && j + 8 < a;)
							for (s = 0; 8 > s; s++)
								u[i + j] = k(c, l), l += 2, f--, j++;
						for (; 0 < f && j < a;)
							u[i + j] = k(c, l), l += 2, f--, j++;
						break;
					case 8 :
						for (; 0 != (f & -8) && j + 8 < a;)
							for (s = 0; 8 > s; s++)
								p
										? (u[i + j] = r, p = !1)
										: (u[i + j] = n, p = !0, f++), f--, j++;
						for (; 0 < f && j < a;)
							p
									? (u[i + j] = r, p = !1)
									: (u[i + j] = n, p = !0, f++), f--, j++;
						break;
					case 13 :
						for (; 0 != (f & -8) && j + 8 < a;)
							for (s = 0; 8 > s; s++)
								u[i + j] = 16777215, f--, j++;
						for (; 0 < f && j < a;)
							u[i + j] = 16777215, f--, j++;
						break;
					case 14 :
						for (; 0 != (f & -8) && j + 8 < a;)
							for (s = 0; 8 > s; s++)
								u[i + j] = 0, f--, j++;
						for (; 0 < f && j < a;)
							u[i + j] = 0, f--, j++;
						break;
					default :
						throw "Unimplemented decompress opcode " + h;
				}
			}
		}
		return u
	}
	function vd(a, b, d, c) {
		for (var k = -1, e = 0, i = 0, l = 0, h = 0, f = 0, g = a, j = -1, m = 0, o = h = 0, n = 0, q = f = 0, r = 4294967295, t = !1, v = !1, p = !1, s = Array(a
				* b); i < d;) {
			m = 0;
			h = c[i++] & 255;
			l = h >> 4;
			switch (l) {
				case 12 :
				case 13 :
				case 14 :
					l -= 6;
					h &= 15;
					f = 16;
					break;
				case 15 :
					l = h & 15;
					9 > l
							? (h = c[i++] & 255, h |= (c[i++] & 255) << 8)
							: h = 11 > l ? 8 : 1;
					f = 0;
					break;
				default :
					l >>= 1, h &= 31, f = 32
			}
			0 != f
					&& (p = 2 == l || 7 == l, 0 == h ? h = p ? (c[i++] & 255)
							+ 1 : (c[i++] & 255) + f : p && (h <<= 3));
			switch (l) {
				case 0 :
					j == l && !(g == a && -1 == k) && (t = !0);
					break;
				case 8 :
					o = c[i++] & 255;
				case 3 :
					n = c[i++] & 255;
					break;
				case 6 :
				case 7 :
					r = c[i++];
					l -= 5;
					break;
				case 9 :
					q = 3;
					l = 2;
					m = 3;
					break;
				case 10 :
					q = 5, l = 2, m = 5
			}
			j = l;
			for (f = 0; 0 < h;) {
				if (g >= a) {
					if (0 >= b)
						throw "Decompressing bitmap failed! Height = " + b;
					g = 0;
					b--;
					k = e;
					e = 0 + b * a
				}
				switch (l) {
					case 0 :
						t
								&& (s[e + g] = -1 == k
										? r & 255
										: (s[k + g] ^ r & 255) & 255, t = !1, h--, g++);
						if (-1 == k) {
							for (; 0 != (h & -8) && g + 8 < a;)
								for (p = 0; 8 > p; p++)
									s[e + g] = 0, h--, g++;
							for (; 0 < h && g < a;)
								s[e + g] = 0, h--, g++
						} else {
							for (; 0 != (h & -8) && g + 8 < a;)
								for (p = 0; 8 > p; p++)
									s[e + g] = s[k + g], h--, g++;
							for (; 0 < h && g < a;)
								s[e + g] = s[k + g], h--, g++
						}
						break;
					case 1 :
						if (-1 == k) {
							for (; 0 != (h & -8) && g + 8 < a;)
								for (p = 0; 8 > p; p++)
									s[e + g] = r & 255, h--, g++;
							for (; 0 < h && g < a;)
								s[e + g] = r & 255, h--, g++
						} else {
							for (; 0 != (h & -8) && g + 8 < a;)
								for (p = 0; 8 > p; p++) {
									var u = Dc(s, k, g) ^ r;
									s[e + g] = u & 255;
									h--;
									g++
								}
							for (; 0 < h && g < a;)
								p = Dc(s, k, g) ^ r, s[e + g] = p & 255, h--, g++
						}
						break;
					case 2 :
						if (-1 == k) {
							for (; 0 != (h & -8) && g + 8 < a;)
								for (p = 0; 8 > p; p++)
									f <<= 1, f &= 255, 0 == f
											&& (q = 0 != m ? m & 255 : c[i++], f = 1), s[e
											+ g] = 0 != (q & f) ? r & 255 : 0, h--, g++;
							for (; 0 < h && g < a;)
								f <<= 1, f &= 255, 0 == f
										&& (q = 0 != m ? m & 255 : c[i++], f = 1), s[e
										+ g] = 0 != (q & f) ? r & 255 : 0, h--, g++
						} else {
							for (; 0 != (h & -8) && g + 8 < a;)
								for (p = 0; 8 > p; p++)
									f <<= 1, f &= 255, 0 == f
											&& (q = 0 != m ? m & 255 : c[i++], f = 1), s[e
											+ g] = 0 != (q & f) ? (s[k + g] ^ r
											& 255)
											& 255 : s[k + g], h--, g++;
							for (; 0 < h && g < a;)
								f <<= 1, f &= 255, 0 == f
										&& (q = 0 != m ? m & 255 : c[i++], f = 1), s[e
										+ g] = 0 != (q & f) ? (s[k + g] ^ r
										& 255)
										& 255 : s[k + g], h--, g++
						}
						break;
					case 3 :
						for (; 0 != (h & -8) && g + 8 < a;)
							for (p = 0; 8 > p; p++)
								s[e + g] = n & 255, h--, g++;
						for (; 0 < h && g < a;)
							s[e + g] = n & 255, h--, g++;
						break;
					case 4 :
						for (; 0 != (h & -8) && g + 8 < a;)
							for (p = 0; 8 > p; p++)
								s[e + g] = c[i++], h--, g++;
						for (; 0 < h && g < a;)
							s[e + g] = c[i++], h--, g++;
						break;
					case 8 :
						for (; 0 != (h & -8) && g + 8 < a;)
							for (p = 0; 8 > p; p++)
								v
										? (s[e + g] = n & 255, v = !1)
										: (s[e + g] = o & 255, v = !0, h++), h--, g++;
						for (; 0 < h && g < a;)
							v ? (s[e + g] = n & 255, v = !1) : (s[e + g] = o
									& 255, v = !0, h++), h--, g++;
						break;
					case 13 :
						for (; 0 != (h & -8) && g + 8 < a;)
							for (p = 0; 8 > p; p++)
								s[e + g] = 255, h--, g++;
						for (; 0 < h && g < a;)
							s[e + g] = 255, h--, g++;
						break;
					case 14 :
						for (; 0 != (h & -8) && g + 8 < a;)
							for (p = 0; 8 > p; p++)
								s[e + g] = 0, h--, g++;
						for (; 0 < h && g < a;)
							s[e + g] = 0, h--, g++;
						break;
					default :
						throw "Unimplemented decompress opcode " + l;
				}
			}
		}
		return s
	}
	function tb(a, b, d) {
		var c = a.length, k = 0, e = d - b;
		this.next = function() {
			0 != e && k % d >= b && (k += e);
			if (k < c)
				return a[k++];
			throw "Out of range";
		}
	}
	function Aa(a, b, d) {
		var c = b;
		end = b + d;
		this.markEnd = function() {
			end = getPosition()
		};
		this.markEnd = function(a) {
			end = a
		};
		this.getEnd = function() {
			return end
		};
		this.getStart = function() {
			return start
		};
		this.setStart = function(a) {
			start = a
		};
		this.getByte = function() {
			return a[c++] & 255
		};
		this.getBytes = function(b) {
			var d;
			if (a.slice)
				d = a.slice(c, c + b);
			else if (a.buffer && a.buffer.slice)
				d = new Int8Array(a.buffer.slice(c, c + b));
			else {
				d = Array(b);
				for (var i = 0; i < b; i++)
					d[i] = a[c + i]
			}
			c += b;
			return d
		};
		this.getCapacity = function() {
			return a.length
		};
		this.size = function() {
			return d
		};
		this.getPosition = function() {
			return c
		};
		this.getLittleEndian16 = function() {
			var b = (a[c + 1] & 255) << 8 | a[c] & 255;
			c += 2;
			return b
		};
		this.getBigEndian16 = function() {
			var b = (a[c] & 255) << 8 | a[c + 1] & 255;
			c += 2;
			return b
		};
		this.getLittleEndian32 = function() {
			var b = (a[c + 3] & 255) << 24 | (a[c + 2] & 255) << 16
					| (a[c + 1] & 255) << 8 | a[c] & 255;
			c += 4;
			return b
		};
		this.getLittleEndian64 = function() {
			var b = (a[c + 7] & 255) << 56 | (a[c + 6] & 255) << 48
					| (a[c + 5] & 255) << 40 | (a[c + 4] & 255) << 32
					| (a[c + 3] & 255) << 24 | (a[c + 2] & 255) << 16
					| (a[c + 1] & 255) << 8 | a[c] & 255;
			c += 8;
			return b
		};
		this.getBigEndian32 = function() {
			var b = (a[c] & 255) << 24 | (a[c + 1] & 255) << 16
					| (a[c + 2] & 255) << 8 | a[c + 3] & 255;
			c += 4;
			return b
		};
		this.getUnicodeString = function(a, b) {
			for (var c = Math.floor(a / 2), d = "", h = 0; h < c; h++) {
				var f = this.getLittleEndian16();
				if (b && 0 == f) {
					this.skipPosition(2 * (c - h - 1));
					break
				}
				d += String.fromCharCode(f)
			}
			return d
		};
		this.skipPosition = function(a) {
			c += a
		};
		this.setPosition = function(a) {
			c = a
		};
		this.getData = function() {
			return a
		};
		this.setByte = function(b) {
			a[c++] = b
		};
		this.setLittleEndian16 = function(b) {
			a[c++] = b & 255;
			a[c++] = b >> 8 & 255
		};
		this.setLittleEndian32 = function(b) {
			a[c++] = b & 255;
			a[c++] = b >> 8 & 255;
			a[c++] = b >> 16 & 255;
			a[c++] = b >> 24 & 255
		}
	}
	function hc() {
		this.orderType = 1;
		this.bounds = new BoundsOrder;
		this.destBlt = new DestBltOrder;
		this.patBlt = new PatBltOrder;
		this.screenBlt = new ScreenBltOrder;
		this.line = new LineOrder;
		this.rectangle = new RectangleOrder;
		this.deskSave = new DeskSaveOrder;
		this.memBlt = new MemBltOrder;
		this.triBlt = new TriBltOrder;
		this.polyLine = new PolyLineOrder;
		this.text2 = new Text2Order
	}
	this.displayMsg = this.reconnectOnResize = !0;
	this.sessionTimeout = 3E3;
	this.appTimeout = 800;
	this.reconnectTimes = 0;
	this.windowState = 3;
	n || (n = window.innerWidth, t = window.innerHeight);
	var Ob = "object" == typeof m ? m : null, Eb = "object" == typeof m
			|| 0 < m.indexOf("/PLAY?");
	Eb
			&& (Ob && (m = ""), m += "&touchpad=on", this.displayMsg = this.reconnectOnResize = !1);
	var pa = queryToArgs(m.substring(m.indexOf("?") + 1)), ka = null;
	hi5.appcfg
			&& (this.displayMsg = __svappcfg.displayMsg, this.sessionTimeout = __svappcfg.sessionTimeout, this.appTimeout = __svappcfg.appTimeout, this.reconnectOnResize = __svappcfg.reconnectOnResize, this.reconnectTimes = __svappcfg.reconnectTimes, this.windowState = __svappcfg.windowState);
	grantPermission();
	var n = parseInt(n), t = parseInt(t), r = parseInt(r), na = {
		table : "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/"
				.split(","),
		pad : "=",
		enc : function(a) {
			var b = "", d = this.table, c = this.pad, k = a.length, e;
			for (e = 0; e < k - 2; e = e + 3) {
				b = b + d[a[e] >> 2];
				b = b + d[((a[e] & 3) << 4) + (a[e + 1] >> 4)];
				b = b + d[((a[e + 1] & 15) << 2) + (a[e + 2] >> 6)];
				b = b + d[a[e + 2] & 63]
			}
			if (k % 3) {
				e = k - k % 3;
				b = b + d[a[e] >> 2];
				if (k % 3 === 2) {
					b = b + d[((a[e] & 3) << 4) + (a[e + 1] >> 4)];
					b = b + d[(a[e + 1] & 15) << 2];
					b = b + c
				} else {
					b = b + d[(a[e] & 3) << 4];
					b = b + (c + c)
				}
			}
			return b
		},
		binaries : [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
				63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1,
				-1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
				16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1,
				26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
				42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],
		dec : function(a, b) {
			var d = this.binaries, c = this.pad, k, e, i, l, h, f = 0, g = 0;
			k = a.indexOf("=") - b;
			k < 0 && (k = a.length - b);
			k = Array((k >> 2) * 3 + Math.floor(k % 4 / 1.5));
			e = 0;
			for (i = b; i < a.length; i++) {
				l = d[a.charCodeAt(i) & 127];
				h = a.charAt(i) === c;
				if (l === -1)
					console
							.error("Illegal character '" + a.charCodeAt(i)
									+ "'");
				else {
					g = g << 6 | l;
					f = f + 6;
					if (f >= 8) {
						f = f - 8;
						h || (k[e++] = g >> f & 255);
						g = g & (1 << f) - 1
					}
				}
			}
			if (f)
				throw "Invalid base64 encoding";
			return k
		}
	}, oa = {
		historyoff : 0,
		history : Array(65536),
		currOff : 0,
		currLen : 0,
		getData : function() {
			var a = new Aa(this.history, this.currOff, this.currLen);
			a.markEnd(this.currOff + this.currLen);
			return a
		},
		dec : function(a, b, d, c) {
			var k, e = 0, i = 0, l, h, f, g, j = (c & 1) != 0, m = this.history;
			if ((c & 32) == 0) {
				this.currOff = 0;
				this.currLen = d;
				return 0
			}
			if ((c & 64) != 0)
				this.historyoff = 0;
			if ((c & 128) != 0) {
				for (c = 65536; --c >= 0;)
					m[c] = 0;
				this.historyoff = 0
			}
			this.currLen = this.currOff = 0;
			this.currOff = f = l = c = this.historyoff;
			if (d == 0)
				return 0;
			d = d + i;
			do {
				if (e == 0) {
					if (i >= d)
						break;
					c = (a[b + i++] & 255) << 24;
					e = 8
				}
				if (c >= 0) {
					if (e < 8) {
						if (i >= d) {
							if (c != 0)
								return -1;
							break
						}
						c = c | (a[b + i++] & 255) << 24 - e;
						e = e + 8
					}
					if (l >= 65536)
						return -1;
					m[l++] = c >>> 24 & 255;
					c = c << 8;
					e = e - 8
				} else {
					c = c << 1;
					if (--e == 0) {
						if (i >= d)
							return -1;
						c = (a[b + i++] & 255) << 24;
						e = 8
					}
					if (c >= 0) {
						if (e < 8) {
							if (i >= d)
								return -1;
							c = c | (a[b + i++] & 255) << 24 - e;
							e = e + 8
						}
						if (l >= 65536)
							return -1;
						m[l++] = (c >>> 24 | 128) & 255;
						c = c << 8;
						e = e - 8
					} else {
						c = c << 1;
						if (--e < (j ? 3 : 2)) {
							if (i >= d)
								return -1;
							c = c | (a[b + i++] & 255) << 24 - e;
							e = e + 8
						}
						if (j)
							switch (c >>> 29) {
								case 7 :
									for (; e < 9; e = e + 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e
									}
									c = c << 3;
									k = c >>> 26;
									c = c << 6;
									e = e - 9;
									break;
								case 6 :
									for (; e < 11; e = e + 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e
									}
									c = c << 3;
									k = (c >>> 24) + 64;
									c = c << 8;
									e = e - 11;
									break;
								case 5 :
								case 4 :
									for (; e < 13; e = e + 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e
									}
									c = c << 2;
									k = (c >>> 21) + 320;
									c = c << 11;
									e = e - 13;
									break;
								default :
									for (; e < 17; e = e + 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e
									}
									c = c << 1;
									k = (c >>> 16) + 2368;
									c = c << 16;
									e = e - 17
							}
						else
							switch (c >>> 30) {
								case 3 :
									if (e < 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e;
										e = e + 8
									}
									c = c << 2;
									k = c >>> 26;
									c = c << 6;
									e = e - 8;
									break;
								case 2 :
									for (; e < 10; e = e + 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e
									}
									c = c << 2;
									k = (c >>> 24) + 64;
									c = c << 8;
									e = e - 10;
									break;
								default :
									for (; e < 14; e = e + 8) {
										if (i >= d)
											return -1;
										c = c | (a[b + i++] & 255) << 24 - e
									}
									k = (c >>> 18) + 320;
									c = c << 14;
									e = e - 14
							}
						if (e == 0) {
							if (i >= d)
								return -1;
							c = (a[b + i++] & 255) << 24;
							e = 8
						}
						if (c >= 0) {
							h = 3;
							c = c << 1;
							e--
						} else {
							g = j ? 14 : 11;
							do {
								c = c << 1;
								if (--e == 0) {
									if (i >= d)
										return -1;
									c = (a[b + i++] & 255) << 24;
									e = 8
								}
								if (c >= 0)
									break;
								if (--g == 0)
									return -1
							} while (1);
							h = (j ? 16 : 13) - g;
							c = c << 1;
							if (--e < h)
								for (; e < h; e = e + 8) {
									if (i >= d)
										return -1;
									c = c | (a[b + i++] & 255) << 24 - e
								}
							g = h;
							h = c >>> 32 - g & ~(-1 << g) | 1 << g;
							c = c << g;
							e = e - g
						}
						if (l + h >= 65536)
							return -1;
						k = l - k & (j ? 65535 : 8191);
						do
							m[l++] = m[k++];
						while (--h != 0)
					}
				}
			} while (1);
			this.historyoff = l;
			this.currOff = f;
			this.currLen = l - f;
			return 0
		}
	}, Qc = 0 < m.indexOf("nocurosr=on"), Z = 0 < m.indexOf("startProgram=app"), Db = 0 < m
			.indexOf("mapDisk=on"), ea = null;
	this.server = pa.server;
	this.port = parseInt(pa.port);
	Z && (this.reconnectOnResize = !1);
	this.isRemoteApp = function() {
		return Z
	};
	n = Z ? screen.width : makeEven(n);
	t = Z ? screen.height : makeEven(t);
	hi5.browser.isTouch
			&& (n = makeEven(window.innerWidth), t = makeEven(window.innerHeight));
	var w = null, za = null, J = loggedin = !1, D = null, $ = new function(a) {
		var b = null;
		this.available = false;
		this.delay = a;
		if (hi5.browser.isTouch)
			this.available = false;
		else if ("webkitAudioContext" in window) {
			b = new webkitAudioContext;
			this.available = true
		} else if ("AudioContext" in window) {
			b = new AudioContext;
			this.available = true
		} else if (hi5.browser.isFirefox) {
			this.available = true;
			return
		}
		if (this.available) {
			this.getBuffer = function(a) {
				return b.createBuffer(2, a, y)
			};
			var d = 0;
			this.playBuffer = function(c) {
				var k = b.createBufferSource();
				k.buffer = c;
				k.connect(b.destination);
				var e = b.currentTime, i = d > 0 ? d : e + a;
				i < e && (i = e + a);
				d = i + c.duration;
				k.noteOn(i);
				return d - e
			}
		}
	}(2);
	this.setAudioBuffer = function(a) {
		$.delay = a
	};
	for (var Ma = null, Cb = Array(12), xb = 0; 12 > xb; xb++)
		Cb[xb] = Array(256);
	var Za = Array(256), P = 0, O = 0, H = n - 1, I = t - 1, U = null, yb = null, rd = Math
			.floor((r + 7) / 8), C = this;
	window.rdpConnection = this;
	this.running = function() {
		return J
	};
	this.hide = function() {
		q && q.hide()
	};
	var La = new function() {
		this.ws = null;
		this.clipRequired = this.prePaste = false;
		this.send = function(a) {
			J && this.ws.send(a)
		};
		var a = null;
		this.onresize = function(b) {
			var d = b.target.innerWidth, c = b.target.innerHeight;
			if (Z) {
				if (!(false in b.target)) {
					b = b.target.svSurface.railWin;
					b != null && sd(b, d, c)
				}
			} else if (!hi5.browser.isTouch && !hi5.browser.isOpera
					&& C.reconnectOnResize && J) {
				if (a) {
					clearTimeout(a);
					a = null
				}
				a = setTimeout(function() {
							console.log("resized... ");
							Ab(d, c)
						}, 1E3)
			}
		};
		this.getClipData = Ec;
		this.setDataFromClip = function(a) {
			za = a;
			if (this.prePaste && this.clipRequired) {
				w.send("881" + a);
				this.clipRequired = false
			}
			this.prePaste = false
		};
		this.onfocus = function(a) {
			if (Z) {
				a = a.target.svSurface.railWin;
				if (!(a == null || w == null)) {
					a.activate(1);
					console.log("Activate win:" + a.id)
				}
			}
		};
		this.fileCallback = [];
		this.getShareFiles = function(a, d) {
			if (loggedin) {
				this.ws.send("3A5" + a);
				this.fileCallback.push(d)
			}
		};
		this.notifyFiles = function(a) {
			for (var d = this.fileCallback, c = 0, k = d.length; c < k; c++)
				d[c](a)
		};
		this.getFile = function(a) {
			C.reconnectOnResize = false;
			window.open(zb() + "/DOWNLOAD?s=" + yb + "&f=" + a)
		}
	}, q = function() {
		var a = [];
		a.svContext = function() {
			if (!Z)
				return a[0].context;
			for (var b = a.zOrders, d = 0, c = b.length; d < c; d++) {
				var k = a.wins[b[d]];
				if (typeof k != "undefined" && k.railWin != null)
					return k.context
			}
			return null
		};
		a.zOrders = [];
		a.drawLicense = function(b) {
			for (var d = 0, c = a.length; d < c; d++)
				a[d].drawLicense(b)
		};
		a.removeEvents = function() {
			for (var b = 0, d = a.length; b < d; b++)
				a[b].removeEvents()
		};
		a.setConnected = function(b) {
			for (var d = 0, c = a.length; d < c; d++)
				a[d].setConnected(b)
		};
		a.setReadOnly = function(b) {
			for (var d = 0, c = a.length; d < c; d++)
				a[d].setReadOnly(b)
		};
		a.setVisible = function() {
			console.log("TODO: setVisible")
		};
		a.copyToClip = function(b) {
			a.length < 1 || a[0].copyToClip(b)
		};
		a.setCursor = function(b) {
			Z || a[0].setCursor(b);
			var d = a.getFocused();
			d != null && d.setCursor(b)
		};
		a.hide = function() {
			if (Z)
				for (var b = 0, d = a.length; b < d; b++)
					a[b].browser.close();
			else
				a[0].hide()
		};
		a.execute = function(b, d) {
			for (var c = 0, k = a.length; c < k; c++)
				a[c][b].apply(this, d)
		};
		a.wins = {};
		a.railWins = {};
		a.remaining = [];
		a.assign = function(b, d) {
			if (b.railWin) {
				d.previous = b.railWin;
				delete a.wins[b.railWin.id]
			}
			b.railWin = d;
			a.wins[d.id] = b;
			b.setVisible(true);
			b.setConnected(true);
			if ("titleInfo" in d)
				b.browser.document.title = d.titleInfo;
			a.zOrders.unshift(d.id);
			C.windowState == 3 && d.fillBrowser();
			console.log("*** new rail win=" + d.id + " resize");
			d.activate(1);
			console.log("*** send active:" + d.id);
			for (var c in a.railWins)
				c.ownerWinid == d.id && c.checkBound()
		};
		a.addWin = function(b) {
			a.railWins[b.id] = b;
			if (function() {
				var a = b.ownerWinid < 1;
				if (!a)
					return a;
				if (b.showState === 0)
					return false;
				var d = b.style;
				if ((d & 4194304) != 0)
					return true;
				(a = a && (b.extStyle & 128) == 0) && (d & 2147483648) != 0
						&& (d & 2156396544) == 0 && (a = false);
				console.log("*** win id=" + b.id + " isMain=" + a);
				return a
			}()) {
				console.log("*** new rail win=" + b.id);
				var d = function() {
					var b, d = a.length;
					if (!(d < 1)) {
						for (var e = 0; e < d; e++) {
							b = a[e];
							if (b.railWin == null)
								return b
						}
						return b = a.getFocused()
					}
				}();
				d != null && a.assign(d, b)
			}
		};
		a.getSurface = function(b) {
			b = a.wins[b];
			return typeof b == "undefined" ? null : b
		};
		a.getOwnerSurface = function(b) {
			return a.getSurface(b.ownerWinid == 0 ? b.id : b.ownerWinid)
		};
		a.getFocused = function() {
			if (!Z)
				return a[0];
			for (var b = 0, d = a.length; b < d; b++)
				if (a[b].focused)
					return a[b];
			return null
		};
		a.close = function() {
			for (var b = 0, d = a.length; b < d; b++)
				a[b].close()
		};
		return a
	}();
	this.exeAppCmd = function(a) {
		var b = q.getFocused();
		b && b.exeCommand(a)
	};
	hi5.browser.isTouch
			&& window.addEventListener("orientationchange", function() {
						C.reconnectOnResize
								&& Ab(window.innerWidth, window.innerHeight)
					}, !1);
	UploadManager = function(a) {
		var b = {}, d = 0;
		this.read = function(c, k, e) {
			var i = q.getFocused().fileProgress, l = b[c];
			if (typeof l != "undefined") {
				var h = l.name;
				if (l.size < 1)
					alert(__svi18n.file.zero + h);
				else {
					l = l.slice(k, k + e);
					h = new FileReader;
					h.onloadend = function(b) {
						if (b.target.readyState == FileReader.DONE) {
							b = new Uint8Array(b.target.result);
							a.send(c, k, e, b);
							d = d + e;
							i.setProgress(d)
						}
					};
					h.readAsArrayBuffer(l)
				}
			}
		};
		this.addFile = function(c) {
			if (!("slice" in c)) {
				c.slice = c.webkitSlice || c.mozSlice;
				if (!("slice" in c)) {
					alert(__svi18n.file.slice);
					return
				}
			}
			var d = q.getFocused().fileProgress;
			if (d.style.display == "none")
				d.style.display = "block";
			var e = c.name;
			b[e] = c;
			d.maxValue = d.maxValue + c.size;
			a.start(e, c.size)
		};
		this.confirmId = function(a, d) {
			b[a] = b[d]
		};
		this.close = function(a) {
			var k = q.getFocused(), e = k.fileProgress, i = b[a];
			if (i) {
				delete b[a];
				delete b[i.name]
			}
			for (var l in b)
				return;
			d = e.maxValue = 0;
			e.style.display = "none";
			k.showMessage(__svi18n.file.uploadDone);
			k.refreshFiles()
		}
	};
	this.addSurface = function(a) {
		Eb && a.setPlayerMode();
		a.setSize(n, t);
		a.setController(La);
		a.setFastCopy(pa.fastCopy == "on");
		a.setTouchpad(pa.touchpad == "on");
		if (Db) {
			a.setFileHandler(Gc);
			ea == null && (ea = new UploadManager(new Hc))
		}
		a.run(m.indexOf("keyboard=99999") > 0);
		q.push(a)
	};
	this.getRunninApps = function() {
		for (var a = [], b = 0, d = q.length; b < d; b++)
			q[b].railWin != null && a.push(q[b].railWin.titleInfo);
		return a
	};
	this.startApp = function(a, b, d) {
		w.send("8C2" + a + "\t" + b + "\t" + d);
		var c = q[q.length - 1];
		if (c)
			c.remoteApp = {
				exe : a,
				args : b,
				dir : d
			}
	};
	this.startExitingApp = function(a) {
		q.addWin(q.railWins[a]);
		q.remaining.removeElm(a)
	};
	this.checkRemaining = function(a) {
		setTimeout(function() {
			for (var a = q.remaining, d = "", c = 0, k = a.length; c < k; c++) {
				var e = a[c], i = q.railWins[e];
				if (!(typeof i == "undefined" || i.showState == 0)) {
					i = i.titleInfo;
					typeof i == "undefined"
							|| i.length == 0
							|| (d = d
									+ ('<p><input type="button" id="' + e
											+ '" onclick="startExitingApp(' + e
											+ ')" value="' + i + '"/></p>'))
				}
			}
			if (d != "") {
				a = document.createElement("div");
				a.style.backgroundColor = "white";
				a.style.padding = "2em";
				a.innerHTML = "<h3>Applications are still running in this session:</h3><p>Please open and quite out them from the appplicaiton's File menu</p>"
						+ d;
				document.documentElement.appendChild(a);
				hi5.Lightbox(a).show()
			}
		}, a)
	};
	this.run = function() {
		if (!J) {
			loggedin = false;
			if (Ob)
				w = Ob;
			else {
				var a = m + "&width=" + n + "&height=" + t + "&server_bpp=" + r
						+ "&audio=" + $.available + Y();
				m.indexOf("waWidth") < 0
						&& (a = a
								+ (Z ? "&waWidth=" + screen.width
										+ "&waHeight=" + screen.height : ""));
				var b = new Date, a = a
						+ ("&tzOffset=" + b.getTimezoneOffset() + "&time=" + b
								.getTime());
				(b = hi5.browser.binaryWS(a.substring(0, a.indexOf("RDP?"))))
						&& (a = a + "&binary=on");
				w = new hi5.WebSocket(a);
				if (b)
					w.binaryType = "arraybuffer"
			}
			La.ws = w;
			D = new Ja(n, t);
			svGlobal.log && console.log(m);
			w.onopen = Jc;
			w.onmessage = Kc;
			w.onclose = function(a) {
				console.log("closed, code=" + a.code + " reason=" + a.reason);
				J || gc("connection");
				if (C.reconnectTimes) {
					C.reconnectTimes--;
					J = true;
					Ab(window.innerWidth, window.innerHeight)
				} else {
					J = false;
					q.close();
					q.removeEvents();
					delete window.rdpConnection;
					if (C.onclose)
						C.onclose()
				}
			};
			w.onerror = Ic;
			if (Z)
				if (a = q[q.length - 1])
					a.remoteApp = {
						exe : pa.exe,
						args : pa.args,
						dir : ""
					}
		}
	};
	this.mouseDown = function(a, b, d) {
		J && w.send("80" + a + "\t" + b + "\t" + d)
	};
	this.mouseMove = function(a, b) {
		J && w.send("82" + a + "\t" + b)
	};
	this.mouseUp = function(a, b, d) {
		J && w.send("81" + a + "\t" + b + "\t" + d)
	};
	this.writeKeyCode = function(a, b) {
		J && w.send("8B" + (a ? 0 : 49152) + "\t" + b)
	};
	this.writeText = function(a) {
		J && w.send("86" + a)
	};
	var ic = 0;
	this.play = function() {
		w.send("F3")
	};
	this.pause = function() {
		w.send("F2")
	};
	this.scan = function(a) {
		w.send("F4" + (a ? "1" : "0"))
	};
	y = x = z = A = 0;
	this.showMessage = function(a) {
		var b = q.getFocused();
		b ? b.showMessage(a) : svGlobal.util.singletonDlg.show(a)
	};
	var S = new hc, Ka = 0, Fc = {};
	this.close = Bb;
	window.addEventListener("unload", Bb, !1);
	var F = 16777215, $a = [], ab = Array(20)
}
function Brush() {
	this.style = this.yOrigin = this.xOrigin = 0;
	this.pattern = Array(8)
}
function BoundsOrder() {
	this.bottom = this.top = this.right = this.left = 0
}
function DeskSaveOrder() {
	this.action = this.offset = this.bottom = this.top = this.right = this.left = 0
}
function DestBltOrder() {
	this.opcode = this.cy = this.cx = this.y = this.x = 0
}
function FontData(m, n, t, r, x, z, A) {
	this.font = m;
	this.character = n;
	this.offset = t;
	this.baseline = r;
	this.width = x;
	this.height = z;
	this.fontdata = A
}
function LineOrder() {
	this.opcode = this.backgroundColor = this.endY = this.endX = this.startY = this.startX = this.mixmode = 0;
	this.pen = new Pen
}
function MemBltOrder() {
	this.cacheIDX = this.cacheID = this.colorTable = this.srcY = this.srcX = this.opcode = this.cy = this.cx = this.y = this.x = 0
}
function PaletteData(m, n, t, r, x) {
	this.bits = m;
	this.size = n;
	this.red = t;
	this.green = r;
	this.blue = x
}
function PatBltOrder() {
	this.foregroundColor = this.backgroundColor = this.opcode = this.cy = this.cx = this.y = this.x = 0;
	this.brush = new Brush
}
function Pen() {
	this.color = this.width = this.style = 0
}
function PolyLineOrder() {
	this.dataSize = this.opcode = this.lines = this.foregroundColor = this.flags = this.y = this.x = 0;
	this.data = Array(256)
}
function RectangleOrder() {
	this.color = this.cy = this.cx = this.y = this.x = 0
}
function ScreenBltOrder() {
	this.srcY = this.srcX = this.opcode = this.cy = this.cx = this.y = this.x = 0
}
function Text2Order() {
	this.length = this.opcode = this.boxBottom = this.boxRight = this.boxTop = this.boxLeft = this.clipBottom = this.clipRight = this.clipTop = this.clipLeft = this.font = this.unknown = this.y = this.x = this.backgroundColor = this.foregroundColor = this.mixmode = this.flags = 0;
	this.text = Array(256)
}
function TriBltOrder() {
	this.foregroundColor = this.backgroundColor = this.opcode = this.cy = this.cx = this.y = this.x = 0;
	this.brush = new Brush;
	this.unknown = this.srcY = this.srcX = this.cacheIDX = this.cacheID = this.colorTable = 0
}
var Connection = {
	KEY_IDS : "__CONNS",
	KEY_TIMESTAMP : "__TIMESTAMP",
	hasStorage : "localStorage" in window,
	getAll : function() {
		var m = localStorage[this.KEY_IDS];
		return null == m ? [] : m.split(",")
	},
	saveForm : function(m) {
		for (var m = m.elements, n = m.length, t = {}, r = null, x = 0; x < n; x++) {
			var z = m[x];
			if ("button" != z.type) {
				var A = z.name, y = z.value;
				"server" == A && (r = y);
				if ("checkbox" == z.type)
					y = z.checked;
				else if ("radio" == z.type && !z.checked)
					continue;
				if ("width" == A
						&& (y = parseInt(y), y == window.innerWidth
								|| y == screen.width))
					continue;
				if ("height" == A
						&& (y = parseInt(y), y == window.innerHeight
								|| y == screen.height))
					continue;
				"pwd" != A && (t[A] = y)
			}
		}
		return this.save(r, t) ? r : null
	},
	save : function(m, n) {
		if (null == m)
			return !1;
		var t = localStorage[m];
		localStorage[m] = JSON.stringify(n);
		var r = localStorage[this.KEY_IDS];
		null == r ? r = m : null == t && (r = r + "," + m);
		localStorage[this.KEY_IDS] = r;
		return !0
	},
	loadToForm : function(m, n) {
		if (null == n)
			return !1;
		var t = localStorage[n];
		if (null == t)
			return !1;
		for (var t = JSON.parse(t), r = m.elements, x = 0, z = r.length; x < z; x++) {
			var A = r[x], y = A.type;
			if (!("button" == y || "submit" == y)) {
				var Ja = A.name, Y = t[Ja];
				if ("undefined" == typeof Y) {
					if ("gateway" != Ja)
						switch (y) {
							case "text" :
								A.value = "";
								break;
							case "checkbox" :
								A.checked = !1;
							case "radio" :
								A.checked = !1
						}
				} else
					"startProgram" == Ja
							? "shell" == A.id
									? (A.checked = !0 == Y || "shell" == Y, A.value = "shell")
									: A.checked = Y == A.id
							: "checkbox" == y ? A.checked = Y : A.value = Y
			}
		}
	},
	clear : function() {
		localStorage.clear()
	},
	remove : function(m) {
		localStorage.removeItem(m);
		for (var n = this.getAll(), t = "", r = 0, x = n.length; r < x; r++)
			m != n[r] && ("" != t && (t += ","), t += n[r]);
		localStorage[this.KEY_IDS] = t
	},
	getValue : function(m) {
		return this.hasStorage ? localStorage[m] : null
	},
	setValue : function(m, n) {
		localStorage[m] = n
	},
	removeItem : function(m) {
		localStorage.removeItem(m)
	}
};
svGlobal.Rdp = Rdp;
