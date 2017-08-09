
/**
 * 如需向Ext修改、添加类,请在此文件中修改.
 * 
 * @author TIANZHOU
 * @date 2008-7-15
 * @Compatibility Ext 3.11
 * 
 * 修改者：tianzhou<br>
 * 修改日期:2008-11-12 <br>
 * 修改理由:将ext-all.js的修改归入本文件,以后不再修改Ext的代码.<br>
 * 修改者：tianzhou<br>
 * 修改日期:2010-3-12 <br>
 * 修改理由:升级至Ext 3.11,删掉了大部分无用代码.<br>
 */
/*
 * -----段落: -----向JAVASCRITP中window对象添加方法lg用于测试.
 */
window.lg = function(msg) {
	// if(System.stat!=SystemStatus.Debug) return;
	if (Ext.isIE && !Ext.isSupportIEConsole) {
		try {
			console;
		} catch (e) {
			console = {
				log : Ext.emptyFn
			}
		}
		Ext.isSupportIEConsole = true;
	}
	console.log(msg);
}

/*
 * -----段落: -----添加方法onUnload,unUnload到Ext,当窗口关闭或刷新时执行.<p>
 * 首先执行beforeUnloadFn,此方法若返回长度>0的字符串,则提示此信息,由用户选择是否刷新或关闭浏览器.<br>
 * unloadFn在浏览器确定刷新或关闭后执行,主要用于清理资源,scope、beforeUnloadFn或unloadFn均可为null
 */

Ext.onUnload = function(scope, beforeUnloadFn, unloadFn) {
	if (!this._unloadEvent) {
		this._unloadEvent = new Ext.util.Event();
		this._beforeUnloadEvent = new Ext.util.Event();
		Ext.EventManager.addListener(window, 'unload', function() {
					Ext._unloadEvent.fire();
				});
		window.onbeforeunload = function() {
			if (window.legalQuit) {
				window.legalQuit = false;
			} else {
				return Ext._beforeUnloadEvent.getMessage();
			}
		}
		this._beforeUnloadEvent.getMessage = function() {
			var listeners = this.listeners, len = listeners.length, i = 0, l, msg = [];
			if (len > 0) {
				for (var c; i < len; i++) {
					l = listeners[i];
					l && (c = l.fireFn.call(l.scope || window));
					Ext.isEmpty(c) || (msg = msg.concat(c))
				}
				if (msg.length > 0) {
					for (var i = 0; i < msg.length; i++) {
						msg[i] = "  " + (i + 1) + "、" + msg[i] + "\n"
					}
					return '因为以下原因'.loc() + ":\n\n" + msg.join() + '\n'
							+ '当前操作可能导致数据丢失,您确定要继续吗'.loc() + "?"
				}
			}

		}
	}
	unloadFn && this._unloadEvent.addListener(unloadFn, scope, {});
	beforeUnloadFn
			&& this._beforeUnloadEvent.addListener(beforeUnloadFn, scope, {});
}
Ext.unUnload = function(scope, beforeUnloadFn, unloadFn) {
	if (this._unloadEvent) {
		unloadFn && this._unloadEvent.removeListener(unloadFn, scope);
		beforeUnloadFn
				&& this._beforeUnloadEvent
						.removeListener(beforeUnloadFn, scope);
	}
}
/*
 * -----段落: -----添加方法once到Ext.util.Observable,此方法添加的事件只执行一次.
 */

Ext.override(Ext.util.Observable, {
			once : function(eventName, fn, scope, o) {
				(o || (o = {})).single = true;
				this.on(eventName, fn, scope, o);
			}
		});
/*
 * -----段落: 修改Windows方法,没有初始化时间时,出现this.manager为空.
 */

Ext.override(Ext.Window, {
			toBack : function() {
				this.manager = this.manager || Ext.WindowMgr;
				this.manager.sendToBack(this);
				return this;
			}
		});
Ext.override(Ext.Window, {
			toFront : function(A) {
				this.manager = this.manager || Ext.WindowMgr;
				if (this.manager.bringToFront(this)) {
					if (!A || !A.getTarget().focus) {
						this.focus();
					}
				}
				return this;
			}
		});
Ext.Shadow.Pool = function() {
	var p = [], markup = Ext.isIE
			? '<div class="x-ie-shadow"></div>'
			: '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
	return {
		pull : function() {
			var sh = p.shift();
			try {
				if (!sh) {
					sh = Ext.get(Ext.DomHelper.insertHtml("beforeBegin",
							document.body.firstChild, markup));
					sh.autoBoxAdjust = false;
				}
				return sh;
			} catch (e) {
				return null
			}
		},
		push : function(sh) {
			p.push(sh);
		}
	};
}();
Ext.Shadow.prototype = {

	offset : 4,

	defaultMode : "drop",

	show : function(target) {
		target = Ext.get(target);
		if (!this.el) {
			this.el = Ext.Shadow.Pool.pull();
			if (this.el != null)
				if (this.el.dom.nextSibling != target.dom) {
					this.el.insertBefore(target);
				}
		}
		if (this.el != null) {
			this.el.setStyle("z-index", this.zIndex
							|| parseInt(target.getStyle("z-index"), 10) - 1);
			if (Ext.isIE) {
				this.el.dom.style.filter = "progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="
						+ (this.offset) + ")";
			}
			this.realign(target.getLeft(true), target.getTop(true), target
							.getWidth(), target.getHeight());
			this.el.dom.style.display = "block";
		}
	},

	isVisible : function() {
		return this.el ? true : false;
	},

	realign : function(l, t, w, h) {
		if (!this.el) {
			return;
		}
		var a = this.adjusts, d = this.el.dom, s = d.style, iea = 0, sw = (w + a.w), sh = (h + a.h), sws = sw
				+ "px", shs = sh + "px", cn, sww;
		s.left = (l + a.l) + "px";
		s.top = (t + a.t) + "px";
		if (s.width != sws || s.height != shs) {
			s.width = sws;
			s.height = shs;
			if (!Ext.isIE) {
				cn = d.childNodes;
				sww = Math.max(0, (sw - 12)) + "px";
				cn[0].childNodes[1].style.width = sww;
				cn[1].childNodes[1].style.width = sww;
				cn[2].childNodes[1].style.width = sww;
				cn[1].style.height = Math.max(0, (sh - 12)) + "px";
			}
		}
	},

	hide : function() {
		if (this.el) {
			this.el.dom.style.display = "none";
			Ext.Shadow.Pool.push(this.el);
			delete this.el;
		}
	},

	setZIndex : function(z) {
		this.zIndex = z;
		if (this.el) {
			this.el.setStyle("z-index", z);
		}
	}
};

/*
 * -----段落:-----Function.createCallback方法扩展,允许访问调用时传入的参数<br>
 * 提示：与createDelegate相同,调用此方法时代入得参数将跟在新传入的参数的后面
 */
Ext.apply(Function.prototype, {
			createCallBackWithArgs : function(args) {
				var method = this;
				return args ? function() {
					var callArgs = Array.prototype.slice.call(arguments, 0);
					return method.apply(this || window, callArgs.concat(args));
				} : function() {
					var callArgs = Array.prototype.slice.call(arguments, 0);
					return method.apply(this || window, callArgs);
				};
			}
		});
/*
 * -----段落: -----增加Ext的msg方法 -----参数type:提示类型.message:提示内容,config:提示配置
 */
Ext.msgTitleTable = {
	ERROR : '错误',
	INFO : '提示',
	WARNING : '警示',
	QUESTION : '询问'
}

Ext.reportDefinedError = function(domId) {
	Ext.Ajax.request({
				method : 'POST',
				url : '/bin/exe/ErrorReport.jcp',
				params : {
					content : Ext.getDom(domId).innerHTML
				},
				callback : function() {
					Ext.MessageBox.setIcon(Ext.MessageBox.INFO);
					Ext.MessageBox.updateText('错误报告已发送至管理员!'.loc());
				}
			});
}
Ext.viewDefinedError = function(domId) {
	var json = Ext.decode(Ext.getDom(domId).innerHTML);
	alert(json.causeStackTrace);
}
Ext.msg = function(type, message, config) {
	if (type == null || typeof(type) == 'undefined')
		return;
	type = type.toUpperCase();
	var msg;

	if (type == 'ERR') {
		if (typeof(message) != 'object')
			message = (message) ? Ext.decode(message) : {};
		else if (typeof(message.status) != 'undefined'
				&& typeof(message.statusText) != 'undefined') {
			var tat = message.status;
			if (tat < 200 || tat > 299) {
				switch (tat) {
					case 500 :
						message = {
							errorNumber : 55,
							message : '服务器发生未知错误'.loc(),
							solution : '由于此问题无法在本地解决,请联系管理员'.loc()
						};
						break;
					case 403 :
						message = {
							errorNumber : 56,
							message : '服务器拒绝访问'.loc(),
							solution : '请联系系统管理员'.loc()
						};
						break;
					case 404 :
						message = {
							errorNumber : 57,
							message : '未找到请求的页面'.loc(),
							solution : '由于此问题无法在本地解决,请联系管理员'.loc()
						};
						break;
					case 405 :
						message = {
							errorNumber : 58,
							message : '不允许访问本页面的当前方法'.loc(),
							solution : '请确认您是否有权限进行此操作,否则请联系管理员.'.loc()
						};
						break;
					case 408 :
					case -1 :
						message = {
							errorNumber : 51,
							message : '访问超时'.loc(),
							solution : '请稍过一会儿重新操作,如果看到此错误超过三次以上,请联系系统管理员.'
									.loc()
						};
						break;
					case 502 :
						message = {
							errorNumber : 52,
							message : '网络错误,无法连接'.loc(),
							solution : '请检查网络,及代理服务器.'.loc()
						};
						break;
					case 503 :
						message = {
							errorNumber : 53,
							message : '系统忙,目前无法使用服务器'.loc(),
							solution : '服务器无响应,可能是由于超负荷运转或进行停机维护,请过一段时间重新操作'
									.loc()
									+ "," + '如果长时间看到此错误,请联系系统管理员'.loc() + '.'
						};
						break;
					case 504 :
					case 0 :
					case undefined :
						message = {
							errorNumber : 50,
							message : '网络已断开,不能连接到服务器'.loc(),
							solution : '请检查本机网络是否连通.如果本机安装了防火墙软件,请关闭本机防火墙后再试'
									.loc()
									+ ";" + '如果仍未解决,请联系系统管理员'.loc()
						};
						break;
					default :
						message = {
							errorNumber : 54,
							message : '访问错误,错误代码为:'.loc() + tat + ","
									+ '由网络返回的错误信息是'.loc() + ":'"
									+ message.statusText + "'"
						};
				}
			} else {
				message = Ext.decode(message.responseText);
			}

		} else if (Ext.isDefined(message.responseText)) {
			message = Ext.decode(message.responseText);
		}
		var title = (typeof(message.errorNumber) == 'undefined') ? '系统发生未知错误'
				.loc() : '系统发生错误'.loc() + "(" + '编号'.loc()
				+ message.errorNumber + ":)";
		var pin = "<span style='font-size:15px;font-weight:600;'>"
				+ ((typeof(message.message) == 'undefined') ? '系统发生未指明原因的错误'
						.loc() : message.message) + "</span>";
		if (typeof(message.solution) != 'undefined') {
			pin += '<p>*' + '您可以尝试采用以下方法解决问题'.loc() + ':'
					+ '<div style=\'padding-left:30px;\'>' + message.solution
					+ "</div>"
		}
		// 先好用,排版以后谁美感好谁排吧,排版内容就在变量pin里.-tz
		if (typeof(message.report) != 'undefined') {
			var fid = Ext.id();
			Ext.copyTo(message.report, message, "message,userId,userType");
			pin += "<p>*" + '您可以点击'.loc()
					+ "<a href='#' onclick='Ext.reportDefinedError(\"" + fid
					+ "\")' >" + '此处'.loc() + '</a>' + '发送错误报告给系统管理员.'.loc()
					+ "<br>*或点击<a href='#' onclick='Ext.viewDefinedError(\""
					+ fid + "\")' >" + '此处'.loc() + '</a>查看向服务器发送的错误信息<br>'
			pin += "<textarea id='" + fid + "' style='display:none;'>"
					+ Ext.encode(message.report) + "</textarea>"
		}
		msg = {
			title : title,
			msg : pin,
			minWidth : 400,
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.ERROR
		}
	} else if (type == 'INFO') {
		msg = {
			html : message,
			title : Ext.msgTitleTable[type],
			hideDelay : 2000,
			closable : false
		}
	} else if (type == "INFOS" ){
		msg = {
			title : '温馨提示',
			msg : message,
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.INFO
		}
	} else if (type == 'CONFIRM') {
		msg = {
			title : '提示'.loc(),
			msg : message,
			buttons : Ext.MessageBox.YESNO,
			icon : Ext.MessageBox.QUESTION
		}
		if (typeof(config) == 'function')
			msg.fn = config
	} else {
		if (type == 'ERROR' && message instanceof Error) {
			var m = '错误'.loc() + ":" + message.name + "<br>" + '原因'.loc()
					+ (message.message || message.type);
			if (message.number)
				m += '<br>' + '错误代码'.loc() + ":" + (message.number & 0xFFFF);
			if (message.lineNumber)
				m += '<br>' + '行号' + ":" + '第'.loc() + message.lineNumber
						+ '行'.loc();
			if (message.stack)
				m += "<div style='padding-left:47px;'>"
						+ '调用记录'.loc()
						+ ":<div style='padding-left:20px;'>"
						+ message.stack.replace(/\(.*\)\@/ig, "<br>at&nbsp;")
								.substring(4) + "</div></div>";
			message = m;
		} else if (type == 'WARN') {
			type = 'WARNING';
		}
		msg = {
			title : Ext.msgTitleTable[type],
			msg : message,
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox[type]
		}
	};
	if (typeof(config) == 'object')
		Ext.apply(msg, config);
	return (type == 'INFO' && Ext.isDefined(window.WorkBench)) ? WorkBench.Desk
			.getDesktop().showNotification(msg) : Ext.MessageBox.show(msg);
}

/*
 * -----段落: -----设定DateField的默认格式为 '2008/12/18'
 */
if (Ext.form.DateField) {
	Ext.override(Ext.form.DateField, {
		altFormats : "Y/m/d|m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
	    beforeBlur : function(){
	    	var rv = this.getRawValue();
	    	if(rv.match(/\d{8}/)){
	    		rv = rv.substr(0,4)+"/"+rv.substr(4,2)+"/"+rv.substr(6,2);
	    	}
	        var v = this.parseDate(rv);
	        if(v){
	            this.setValue(v);
	        }
	    },
		setValue : function(date) {
			var d = this.parseDate(date);
			this.valueField.value = Ext.isDate(d) ? d.dateFormat('Y/m/d') : d;
			Ext.form.DateField.superclass.setValue.call(this, this
							.formatDate(d));
		},
		onRender : function(ct, position) {
			var nm = this.name || this.id;
			if(nm == 'REGION_ID' && this.format == 'y年m月d日'){
				this.emptyText = "请选择或输入(如:20160101)";
				this.format = 'Y年m月d日';
			};
			this.name = nm + "Text";
			Ext.form.DateField.superclass.onRender.call(this, ct, position);
			this.valueField = this.wrap.createChild({
						tag : "input",
						type : "hidden",
						name : nm
					}, false, true);
			this.name = nm;
		},
		getName : function() {
			return this.name
					|| (this.rendered && this.el.dom.name
							? this.el.dom.name
							: (this.hiddenName || ''));
		}

	});
}

/*
 * -----段落: -----增加Ext.Panel,icon属性,setIcon(icon)方法,此方法给panel直接设图标
 */

if (Ext.Panel) {
	Ext.Panel.prototype.redering = Ext.Panel.prototype.onRender;
	Ext.override(Ext.Panel, {
		onRender : function(ct, position) {
			this.redering(ct, position);
			if (this.icon)
				this.setIcon(this.icon);

		},
		setIcon : function(icon) {
			if (this.rendered && this.header) {
				var img;
				if (this.frame) {
					this.header.addClass('x-panel-icon');
					img = this.header;
				} else {
					var hd = this.header.dom;
					img = hd.firstChild
							&& String(hd.firstChild.tagName).toLowerCase() == 'img'
							? hd.firstChild
							: null;
					if (!img) {
						img = Ext.DomHelper.insertBefore(hd.firstChild, {
									tag : 'img',
									src : Ext.BLANK_IMAGE_URL,
									cls : 'x-panel-inline-icon',
									style : 'float:left;'
								});
					}
					img = Ext.get(img);
				}
				if (this.iconCls)
					img.removeClass(this.iconCls);
				img.setStyle("background-image", 'url(' + icon + ')');
			}
		}

	});
}

/*
 * -----段落: -----修改Ext.form.Field类,处理Field 不能隐藏LABELBug,添加qtip属性,添加getName方法..
 */

if (Ext.form.Field) {
	Ext.override(Ext.form.Field, {
				getName : function() {
					return this.rendered && this.el.dom.name
							? this.el.dom.name
							: (this.hiddenName || this.name || '');
				},
				afterRender : function() {
					Ext.form.Field.superclass.afterRender.call(this);
					this.initEvents();
					this.initValue();
					if (typeof(this.qtip) == 'object') {
						Ext.QuickTips.register(Ext.apply({
									target : Ext.id(this.el)
								}, this.qtip));
					}
				},
				getVisibilityEl : function() {
					return this.fieldLabel ? this.container.parent() : this
							.getActionEl();
				}
			});
}
/*
 * -----段落: -----解决Ext3.3.1的bug,inputValue为0的checkbox和readio无法选中.Ext4里已解决这个bug.
 */
if (Ext.form.Checkbox) {
	Ext.override(Ext.form.Checkbox, {
				setValue : function(v) {
					var checked = this.checked, inputVal = this.inputValue;
					this.checked = (v === true || v === 'true' || v == '1' || (inputVal
							? v === inputVal
							: String(v).toLowerCase() == 'on'));
					if (this.rendered) {
						this.el.dom.checked = this.checked;
						this.el.dom.defaultChecked = this.checked;
					}
					if (checked != this.checked) {
						this.fireEvent('check', this, this.checked);
						if (this.handler) {
							this.handler.call(this.scope || this, this,
									this.checked);
						}
					}
					return this;
				}
			});
}
/*
 * -----段落: -----增加RadioGroup的getValue与setValue方法,添加check事件.
 */

if (Ext.form.RadioGroup) {
	var pref = Ext.form.RadioGroup.prototype.getValue;

	Ext.override(Ext.form.RadioGroup, {
				getCheckedItem : pref,
				setValueForItemProxy : Ext.form.RadioGroup.prototype.setValueForItem,
				getValue : function() {
					var out = this.getCheckedItem();
					return (out == null) ? null : out.inputValue;
				},

				getText : function() {
					var out = this.getCheckedItem();
					return (out == null) ? "" : out.fieldLabel;
				},
				setValueForItem : function(val) {
					this.setValueForItemProxy(Ext.isObject(val)
							? val.value
							: val);
				},
				onRender : function(ct, position) {
					Ext.form.RadioGroup.superclass.onRender.call(this, ct,
							position);
					if (this.name) {// radio group的name必须强制一致,checkboxgroup不用.
						this.items.each(function(item) {
									item.el.dom.name = this.name;
								}, this);
					}
				}
			});
}

/*
 * -----段落: -----对
 * Ext.util.Format增加extractText方法,取出{value:'',text:''}格式中text值,无值返回空
 */
if (Ext.util.Format) {
	Ext.util.Format.extractText = function(o) {
		return o ? o.text : '';
	}
}

/*
 * -----段落: ----- 对Ext.form.Action中的错误常量重赋值
 */
if (Ext.form.Action) {
	Ext.form.Action.CLIENT_INVALID = '校验错误,详细信息请参见表单中的提示';
	Ext.form.Action.SERVER_INVALID = '数据填写错误,详细信息请参见表单中的提示';
	Ext.form.Action.CONNECT_FAILURE = '与服务器连接已断开';
	Ext.form.Action.LOAD_FAILURE = '服务器发生未可知错误';
}
/*
 * -----段落: ----- 对Ext.form.HtmlEditor增加中文字体
 */
if (Ext.form.HtmlEditor) {
	Ext.override(Ext.form.HtmlEditor, {
		adjustFont : function(btn) {
			var adjust = btn.getItemId() === 'increasefontsize' ? 1 : -1, size = this
					.getDoc().queryCommandValue('FontSize')
					|| '2', isPxSize = size.indexOf('px') !== -1, isSafari;
			size = parseInt(size, 10);
			if (isPxSize) {
				// Safari 3 values
				// 1 = 10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px
				if (size <= 10) {
					size = 1 + adjust;
				} else if (size <= 13) {
					size = 2 + adjust;
				} else if (size <= 16) {
					size = 3 + adjust;
				} else if (size <= 18) {
					size = 4 + adjust;
				} else if (size <= 24) {
					size = 5 + adjust;
				} else {
					size = 6 + adjust;
				}
				size = Ext.Number.constrain(size, 1, 6);
			} else {
				isSafari = Ext.isSafari;
				if (isSafari) { // safari
					adjust *= 2;
				}
				size = Math.max(1, size + adjust) + (isSafari ? 'px' : 0);
			}
			this.execCmd('FontSize', size);
		},
		fontFamilies : ['宋体', '黑体', '隶书', 'Arial', 'Courier New', 'Tahoma',
				'Times New Roman', 'Verdana'],
		defaultFont : '宋体'
	});
}
/*
 * -----段落:
 * -----对Ext.form.ComboBox增加getText方法,直接获取Combo中的汉字,可以向setValue方法中传以下格式Object,{value:'',text:''}
 * -----增加selectFirst方法,选中默认第一个选项,如果参数(fireEvent)为true,则表示选中后出发onselect事件
 */
if (Ext.form.ComboBox) {
	Ext.form.ComboBox.prototype.setVal = Ext.form.ComboBox.prototype.setValue;
	Ext.override(Ext.form.ComboBox, {
				getText : function() {
					return this.el.getValue();
				},
				setValue : function(v) {
					if (typeof(v) == 'object') {
						if (v.value)
							this.setVal(v.value);
						if (v.text
								&& (!this.store || this.store.getCount() == 0)) {
							this.el.dom.value = v.text;
						}
						if(!v.value && !v.text){
							this.el.dom.value = v.text;
						}

					} else {
						this.setVal(v);
					}
				},
				selectFirst : function(fireEvent) {
					if (this.valueField && this.store
							&& this.store.getCount() > 0) {
						var rec = this.store.getAt(0);
						this.setValue(rec.get(this.valueField));
						if (fireEvent)
							this.fireEvent('select', this, rec, 0);
					}
				},
				findRecord : function(prop, value) {
					var record;
					if (this.store && this.store.getCount() > 0) {
						this.store.each(function(r) {
									if (r.data[prop] == value) {
										record = r;
										return false;
									}
								});
					}
					return record;
				}
			});
}
/*
 * -----段落: -----增加IFrame组件Ext.ux.IFrameComponent
 */

if (Ext.BoxComponent) {
	Ext.namespace("Ext.ux");
	Ext.ux.IFrameComponent = Ext.extend(Ext.BoxComponent, {
				onRender : function(ct, position) {
					this.el = ct.createChild({
								tag : 'iframe',
								id : 'iframe-' + this.id,
								name : this.id,
								frameBorder : 0,
								src : this.url,
								width : this.width || '100%',
								height : this.height || '100%'
							});
				}
			});
}
/*
 * -----段落:
 * -----在Ext3.2Form的文件上传模式中,如果返回为空,responseXML意外不为空对象,导致handleResponse错误.
 */
if (Ext.form.Action.Submit) {
	Ext.override(Ext.form.Action.Submit, {
				processResponse : function(response) {
					this.response = response;
					if (this.form.fileUpload && !response.responseText) {
						return true;
					}
					if (!response.responseText && !response.responseXML) {
						return true;
					}
					this.result = this.handleResponse(response);
					return this.result;
				}
			});
}

/*
 * -----段落: -----增加Ext.form.ViewField,查看模式
 */

if (Ext.BoxComponent) {
	Ext.trueFn = function() {
		return true;
	};

	Ext.form.ViewField = Ext.extend(Ext.BoxComponent, {
		/**
		 * @cfg {String} fieldLabel The label text to display next to this field
		 *      (defaults to '')
		 */
		/**
		 * @cfg {String} labelStyle A CSS style specification to apply directly
		 *      to this field's label (defaults to the container's labelStyle
		 *      value if set, or ''). For example,
		 *      <code>labelStyle: 'font-weight:bold;'</code>.
		 */
		/**
		 * @cfg {String} labelSeparator The standard separator to display after
		 *      the text of each form label (defaults to the value of
		 *      {@link Ext.layout.FormLayout#labelSeparator}, which is a colon
		 *      ':' by default). To display no separator for this field's label
		 *      specify empty string ''.
		 */
		/**
		 * @cfg {String} clearCls The CSS class used to provide field clearing
		 *      (defaults to 'x-form-clear-left')
		 */
		/**
		 * @cfg {String} itemCls An additional CSS class to apply to the
		 *      wrapper's form item element of this field (defaults to the
		 *      container's itemCls value if set, or ''). Since it is applied to
		 *      the item wrapper, it allows you to write standard CSS rules that
		 *      can apply to the field, the label (if specified) or any other
		 *      element within the markup for the field. NOTE: this will not
		 *      have any effect on fields that are not part of a form. Example
		 *      use
		 */
		/**
		 * @cfg {Mixed} value A value to initialize this field with (defaults to
		 *      undefined).
		 */
		/**
		 * @cfg {String} name The field's HTML name attribute (defaults to "").
		 */
		/**
		 * @cfg {String} cls A custom CSS class to apply to the field's
		 *      underlying element (defaults to "").
		 */
		/**
		 * @cfg {String/Object} autoCreate A DomHelper element spec, or true for
		 *      a default element spec (defaults to {tag: "input", type: "text",
		 *      size: "20", autocomplete: "off"})
		 */
		// private
		isFormField : true,
		disabled : false,
		bodyStyle : '',
		boxMinHeight : 20,
		height : 22,
		// private
		hasFocus : false,

		// private
		initComponent : function() {
			Ext.form.ViewField.superclass.initComponent.call(this);
			this.map = {
				combo : this.comboFn
			};
		},
		defaultRender : function(ct, position) {

			if (!Ext.isDefined(this.style)) {
				this.style = 'border:solid 1px #b5b8c8;float:left;padding:2 0 1 3;overflow-y:auto;';// 此处在Firefox下不显示垂直滚动条.
				if (Ext.isDefined(this.width)) {
					this.style += 'width:' + this.width + 'px;'
				}
				if (Ext.isDefined(this.height)) {
					this.style += 'height:' + this.height + 'px;'
				}
			}
			Ext.form.ViewField.superclass.onRender.call(this, ct, position);

		},
		setSize : function(w, h) {
			Ext.form.ViewField.superclass.setSize.call(this, w, h + 3);
		},
		comboFn : function(ct, position) {

			var text = this.value;
			if (this.valueField) {
				this.store = Ext.StoreMgr.lookup(this.store);
				var r = this.findRecord(this.valueField, this.value);
				if (r) {
					text = r.data[this.displayField];
				} else if (this.valueNotFoundText !== undefined) {
					text = this.valueNotFoundText;
				}
			}
			this.value = text;
			this.defaultRender(ct, position);
		},

		// private
		findRecord : function(prop, value) {
			var record;
			if (Ext.isArray(this.store)) {
				for (var i = 0, arr = this.store; i < arr.length; i++) {
					if (arr[i][0] == value) {
						record = {
							data : {}
						};
						record.data[this.displayField] = arr[i][1];
						break;
					}
				}
			} else {
				if (this.store.getCount() > 0) {
					this.store.each(function(r) {
								if (r.data[prop] == value) {
									record = r;
									return false;
								}
							});
				}
			}
			return record;
		},

		/**
		 * Returns the name attribute of the field if available
		 * 
		 * @return {String} name The field name
		 */
		getName : function() {
			return this.name;
		},

		// private
		onRender : function(ct, position) {
			var fn = this.map[this.oldXtype];
			if (!Ext.isDefined(fn)) {
				this.defaultRender(ct, position);
			} else {
				fn.call(this, ct, position);
			}
			this.hiddenField = ct.createChild({
						tag : 'input',
						type : 'hidden',
						name : this.name
					});
		},

		/**
		 * Returns true if this field has been changed since it was originally
		 * loaded and is not disabled.
		 */
		isDirty : function() {
			return false
		},
		// private
		afterRender : function() {
			Ext.form.ViewField.superclass.afterRender.call(this);
			if (typeof(this.qtip) == 'object') {
				Ext.QuickTips.register(Ext.apply({
							target : Ext.id(this.el)
						}, this.qtip));
			}
			if (Ext.isDefined(this.value)) {
				this.setValue(this.value, this.text);
			}
		},
		reset : Ext.emptyFn,// 点击清空按钮后,解决导入参数被清空的问题
		beforeBlur : Ext.emptyFn,
		/**
		 * Returns whether or not the field value is currently valid
		 * 
		 * @param {Boolean}
		 *            preventMark True to disable marking the field invalid
		 * @return {Boolean} True if the value is valid, else false
		 */
		isValid : Ext.trueFn,

		/**
		 * Validates the field value
		 * 
		 * @return {Boolean} True if the value is valid, else false
		 */
		validate : Ext.trueFn,

		// private
		validateValue : Ext.trueFn,

		/**
		 * Mark this field as invalid, using {@link #msgTarget} to determine how
		 * to display the error and applying {@link #invalidClass} to the
		 * field's element.
		 * 
		 * @param {String}
		 *            msg (optional) The validation message (defaults to
		 *            {@link #invalidText})
		 */
		markInvalid : Ext.emptyFn,

		// private
		getErrorCt : Ext.emptyFn,

		// private
		alignErrorIcon : Ext.emptyFn,

		/**
		 * Clear any invalid styles/messages for this field
		 */
		clearInvalid : Ext.emptyFn,

		/**
		 * Returns the raw data value which may or may not be a valid, defined
		 * value. To return a normalized value see {@link #getValue}.
		 * 
		 * @return {Mixed} value The field value
		 */
		getRawValue : Ext.emptyFn,

		/**
		 * Returns the normalized data value (undefined or emptyText will be
		 * returned as ''). To return the raw value see {@link #getRawValue}.
		 * 
		 * @return {Mixed} value The field value
		 */
		getValue : function() {
			return this.value;
		},

		/**
		 * Sets the underlying DOM field's value directly, bypassing validation.
		 * To set the value with validation see {@link #setValue}.
		 * 
		 * @param {Mixed}
		 *            value The value to set
		 */
		setRawValue : Ext.emptyFn,

		/**
		 * Sets a data value into the field and validates it. To set the value
		 * directly without validation see {@link #setRawValue}.
		 * 
		 * @param {Mixed}
		 *            value The value to set
		 */
		setValue : function(v, text) {
			if (typeof(text) == 'undefined') {
				if (v instanceof Array) {
					text = v[1];
					v = v[0];
				} else if (typeof(v) == 'object') {
					text = v.text;
					v = v.value;
				} else {
					text = v || '';
				}
			}
			this.value = v;
			this.text = text;
			if (this.rendered) {
				if (this.hiddenField)
					this.hiddenField.dom.value = v;
				this.el.dom.innerHTML = text.loc();
			}
		},

		// private 所有在客户端生成html或字面量的均需重载此方法
		getText : function() {
			return this.text;
		}
			/**
			 * @cfg {Boolean} autoWidth
			 * @hide
			 */
			/**
			 * @cfg {Boolean} autoHeight
			 * @hide
			 */

			/**
			 * @cfg {String} autoEl
			 * @hide
			 */
	});

	Ext.reg('viewfield', Ext.form.ViewField);
}

/*
 * -----段落: -----给Ext.data.Store添加toJsonArray方法,将Store里的值变为JSON数组.
 */
Ext.override(Ext.data.Store, {
			toJsonArray : function() {
				var ret = [];
				this.each(function(rec) {
							ret.push(rec.data);
						})
				return ret;
			}
		});
/*
 * -----段落: -----解决.config[i].destroy弹出错误.
 */
Ext.override(Ext.grid.ColumnModel, {
			destroy : function() {
				for (var i = 0, len = this.config.length; i < len; i++) {
					if (Ext.isFunction(this.config[i].destroy))
						this.config[i].destroy();
				}
				this.purgeListeners();
			}
		});
/*
 * -----段落: -----解决列表界面日期格式错误.
 */
Ext.override(Ext.grid.DateColumn, {
			format : 'Y/m/d'
		});
/*
 * -----段落: -----解决.TextField maxlengh汉字识别错误.
 */
Ext.override(Ext.form.TextField, {
			chineseLength : 2,
			getErrors : function(value) {
				var errors = Ext.form.TextField.superclass.getErrors.apply(
						this, arguments);

				value = Ext.isDefined(value) ? value : this.processValue(this
						.getRawValue());

				if (Ext.isFunction(this.validator)) {
					var msg = this.validator(value);
					if (msg !== true) {
						errors.push(msg);
					}
				}
				var vlen = value.length;
				var len = value.length;

				if (len < 1 || value === this.emptyText) {
					if (this.allowBlank) {
						// if value is blank and allowBlank is true, there
						// cannot be any
						// additional errors
						return errors;
					} else {
						errors.push(this.blankText);
					}
				}

				if (!this.allowBlank && (len < 1 || value === this.emptyText)) { // if
					// it's
					// blank
					errors.push(this.blankText);
				}
				for (var i = 0, k = len, c = this.chineseLength - 1; i < k; i++) {
					if (value.charCodeAt(i) > 256)
						len += c;
				}

				if (len < this.minLength) {
					errors.push(String.format(this.minLengthText,
							this.minLength));
				}

				if (len > this.maxLength) {
					errors.push(String.format(this.maxLengthText,
							this.maxLength));
				}

				if (this.vtype) {
					var vt = Ext.form.VTypes;
					if (!vt[this.vtype](value, this)) {
						errors.push(this.vtypeText || vt[this.vtype + 'Text']);
					}
				}

				if (this.regex) {
					if (!(this.regex instanceof RegExp)) {
						this.regex = new RegExp(this.regex);
					}
					if (!this.regex.test(value)) {
						errors.push(this.regexText);
					}
				}

				return errors;
			}
		});

Ext.override(Ext.Resizable, {
	allowMove : false,
	onMouseDown : function(handle, e) {
		this._allowMove = true;
		if (this.enabled) {
			e.stopEvent();
			this.activeHandle = handle;
			this.startSizing(e, handle)
		}
	},
	onMouseUp : function(e) {
		this._allowMove = false;
		this.activeHandle = null;
		var size = this.resizeElement();
		this.resizing = false;
		this.handleOut();
		this.overlay.hide();
		this.proxy.hide();
		this.fireEvent("resize", this, size.width, size.height, e)
	},
	onMouseMove : function(e) {
		if (this.enabled && this.activeHandle && this._allowMove) {
			try {
				if (this.resizeRegion
						&& !this.resizeRegion.contains(e.getPoint())) {
					return
				}
				var curSize = this.curSize || this.startBox, x = this.startBox.x, y = this.startBox.y, ox = x, oy = y, w = curSize.width, h = curSize.height, ow = w, oh = h, mw = this.minWidth, mh = this.minHeight, mxw = this.maxWidth, mxh = this.maxHeight, wi = this.widthIncrement, hi = this.heightIncrement, eventXY = e
						.getXY(), diffX = -(this.startPoint[0] - Math.max(
						this.minX, eventXY[0])), diffY = -(this.startPoint[1] - Math
						.max(this.minY, eventXY[1])), pos = this.activeHandle.position, tw, th;
				switch (pos) {
					case "east" :
						w += diffX;
						w = Math.min(Math.max(mw, w), mxw);
						break;
					case "south" :
						h += diffY;
						h = Math.min(Math.max(mh, h), mxh);
						break;
					case "southeast" :
						w += diffX;
						h += diffY;
						w = Math.min(Math.max(mw, w), mxw);
						h = Math.min(Math.max(mh, h), mxh);
						break;
					case "north" :
						diffY = this.constrain(h, diffY, mh, mxh);
						y += diffY;
						h -= diffY;
						break;
					case "west" :
						diffX = this.constrain(w, diffX, mw, mxw);
						x += diffX;
						w -= diffX;
						break;
					case "northeast" :
						w += diffX;
						w = Math.min(Math.max(mw, w), mxw);
						diffY = this.constrain(h, diffY, mh, mxh);
						y += diffY;
						h -= diffY;
						break;
					case "northwest" :
						diffX = this.constrain(w, diffX, mw, mxw);
						diffY = this.constrain(h, diffY, mh, mxh);
						y += diffY;
						h -= diffY;
						x += diffX;
						w -= diffX;
						break;
					case "southwest" :
						diffX = this.constrain(w, diffX, mw, mxw);
						h += diffY;
						h = Math.min(Math.max(mh, h), mxh);
						x += diffX;
						w -= diffX;
						break
				}
				var sw = this.snap(w, wi, mw);
				var sh = this.snap(h, hi, mh);
				if (sw != w || sh != h) {
					switch (pos) {
						case "northeast" :
							y -= sh - h;
							break;
						case "north" :
							y -= sh - h;
							break;
						case "southwest" :
							x -= sw - w;
							break;
						case "west" :
							x -= sw - w;
							break;
						case "northwest" :
							x -= sw - w;
							y -= sh - h;
							break
					}
					w = sw;
					h = sh
				}
				if (this.preserveRatio) {
					switch (pos) {
						case "southeast" :
						case "east" :
							h = oh * (w / ow);
							h = Math.min(Math.max(mh, h), mxh);
							w = ow * (h / oh);
							break;
						case "south" :
							w = ow * (h / oh);
							w = Math.min(Math.max(mw, w), mxw);
							h = oh * (w / ow);
							break;
						case "northeast" :
							w = ow * (h / oh);
							w = Math.min(Math.max(mw, w), mxw);
							h = oh * (w / ow);
							break;
						case "north" :
							tw = w;
							w = ow * (h / oh);
							w = Math.min(Math.max(mw, w), mxw);
							h = oh * (w / ow);
							x += (tw - w) / 2;
							break;
						case "southwest" :
							h = oh * (w / ow);
							h = Math.min(Math.max(mh, h), mxh);
							tw = w;
							w = ow * (h / oh);
							x += tw - w;
							break;
						case "west" :
							th = h;
							h = oh * (w / ow);
							h = Math.min(Math.max(mh, h), mxh);
							y += (th - h) / 2;
							tw = w;
							w = ow * (h / oh);
							x += tw - w;
							break;
						case "northwest" :
							tw = w;
							th = h;
							h = oh * (w / ow);
							h = Math.min(Math.max(mh, h), mxh);
							w = ow * (h / oh);
							y += th - h;
							x += tw - w;
							break
					}
				}
				this.proxy.setBounds(x, y, w, h);
				if (this.dynamic) {
					this.resizeElement()
				}
			} catch (ex) {
			}
		}
	}
});
/*
 * -----重写Ext.History,保持对Ext3,3,3版本的兼容,增加numberchange事件..
 */
Ext.History = (function() {
	var iframe;
	var ready = false;
	var currentToken = 1;
	var keyMap = {
		_len : 0
	};

	function getHash() {
		var href = location.href, i = href.indexOf("#");
		return i >= 0 ? href.substr(i + 1) : "";
	}

	function handleStateChange(token) {
		var old = currentToken;
		var pos = token.indexOf('-');
		if (pos != -1) {
			currentToken = +token.substring(0, pos);
			Ext.History.fireEvent('change', token.substring(pos + 1));
		} else {
			currentToken = +token;
		}
		if (keyMap._len > 0 && keyMap[token] == true) {
			delete keyMap[token];
			keyMap._len--;
		} else {
			Ext.History.fireEvent('numberchange', currentToken - old);
		}
	}

	function updateIFrame(token) {
		var html = ['<html><body><div id="state">',
				Ext.util.Format.htmlEncode(token), '</div></body></html>']
				.join('');
		try {
			var doc = iframe.contentWindow.document;
			doc.open();
			doc.write(html);
			doc.close();
			return true;
		} catch (e) {
			return false;
		}
	}

	function checkIFrame() {
		if (!iframe.contentWindow || !iframe.contentWindow.document) {
			setTimeout(checkIFrame, 10);
			return;
		}

		var doc = iframe.contentWindow.document;
		var elem = doc.getElementById("state");
		var token = elem ? elem.innerText : "";

		var hash = getHash();

		setInterval(function() {

					doc = iframe.contentWindow.document;
					elem = doc.getElementById("state");

					var newtoken = elem ? elem.innerText : "";

					var newHash = getHash();

					if (newtoken !== token) {
						token = newtoken;
						handleStateChange(token);
						top.location.hash = token;
						hash = token;
					} else if (newHash !== hash) {
						hash = newHash;
						updateIFrame(newHash);
					}

				}, 50);

		ready = true;

		Ext.History.fireEvent('ready', Ext.History);
	}

	function startUp() {

		if (Ext.isIE) {
			checkIFrame();
		} else {
			var hash = getHash();
			setInterval(function() {
						var newHash = getHash();
						if (newHash !== hash) {
							hash = newHash;
							handleStateChange(hash);
						}
					}, 50);
			ready = true;
			Ext.History.fireEvent('ready', Ext.History);
		}
	}

	return {
		events : {},

		/**
		 * Initialize the global History instance.
		 * 
		 * @param {Boolean}
		 *            onReady (optional) A callback function that will be called
		 *            once the history component is fully initialized.
		 * @param {Object}
		 *            scope (optional) The scope (<code>this</code>
		 *            reference) in which the callback is executed. Defaults to
		 *            the browser window.
		 */
		init : function(onReady, scope) {
			if (ready) {
				Ext.callback(onReady, scope, [this]);
				return;
			}
			if (!Ext.isReady) {
				Ext.onReady(function() {
							Ext.History.init(onReady, scope);
						});
				return;
			}

			if (Ext.isIE) {
				iframe = Ext.getBody().createChild({
							tag : 'iframe',
							cls : 'x-hidden'
						}, false, true);
			}
			this.addEvents(
					/**
					 * @event ready Fires when the Ext.History singleton has
					 *        been initialized and is ready for use.
					 * @param {Ext.History}
					 *            The Ext.History singleton.
					 */
					'ready',
					/**
					 * @event change Fires when navigation back or forwards
					 *        within the local page's history occurs.
					 * @param {String}
					 *            token An identifier associated with the page
					 *            state at that point in its history.
					 */
					'change',
					/**
					 * @event numberchange Fires when navigation back or
					 *        forwards within the local page's history occurs
					 *        and hash is number.
					 * @param {Integer}
					 *            diretction
					 */
					'numberchange');
			if (onReady) {
				this.on('ready', onReady, scope, {
							single : true
						});
			}
			for (var i = 1; i < 10; i++) {// 预留10个记录
				this.add();
				currentToken = i + 1;
			}
			startUp();
		},

		/**
		 * Add a new token to the history stack. This can be any arbitrary
		 * value, although it would commonly be the concatenation of a component
		 * id and another id marking the specifc history state of that
		 * component. Example usage:
		 * 
		 * <pre><code>
		 * // Handle tab changes on a TabPanel
		 * tabPanel.on('tabchange', function(tabPanel, tab) {
		 * 			Ext.History.add(tabPanel.id + ':' + tab.id);
		 * 		});
		 * </code></pre>
		 * 
		 * @param {String}
		 *            token The value that defines a particular
		 *            application-specific history state
		 * @param {Boolean}
		 *            preventDuplicates When true, if the passed token matches
		 *            the current token it will not save a new history step. Set
		 *            to false if the same state can be saved more than once at
		 *            the same history stack location (defaults to true).
		 */
		add : function(token, preventDup) {
			if (arguments.length == 0) {
				token = (currentToken + 1) + "";
			} else {
				if (preventDup !== false) {
					if (getHash() == currentToken + "-" + token) {
						return true;
					}
				}
				token = (currentToken + 1) + "-" + token
			}

			if (Ext.isIE) {
				return updateIFrame(token);
			} else {
				top.location.hash = token;
				return true;
			}
		},

		/**
		 * Programmatically steps back one step in browser history (equivalent
		 * to the user pressing the Back button).
		 */
		back : function() {
			history.go(-1);
		},

		/**
		 * Programmatically steps forward one step in browser history
		 * (equivalent to the user pressing the Forward button).
		 */
		forward : function() {
			history.go(1);
		}
	};
})();
Ext.apply(Ext.History, new Ext.util.Observable());
Ext.onReady(Ext.History.init, Ext.History);

function checkBrowser() {
	var ua = navigator.userAgent.toLowerCase();
	var ie = ua.match(/msie ([\d.]+)/)
	if (ie && ie[1] <= 6)
		Ext.Msg.alert('提示'.loc(), '您当前使用的浏览器为IE6.0.'.loc() + '<br/>'
						+ '由于IE6.0对脚本解析能力不足,导致系统性能下降,反应缓慢.'.loc() + '<br/>'
						+ '为了更好的使用,建议升级IE到更高版本8.0以上或使用Chrome浏览器!'.loc());
}
/*
 * -----段落: -----添加动态双屏判断
 */
Ext.ux.clone = function(o) {
	if (!o || "object" !== typeof o) {
		return o
	}
	var c = "function" === typeof o.pop ? [] : {};
	var p, v;
	for (p in o) {
		if (o.hasOwnProperty(p)) {
			v = o[p];
			if (v && "object" === typeof v) {
				c[p] = Ext.ux.clone(v)
			} else {
				c[p] = v
			}
		}
	}
	return c
};
Ext.onReady(function() {
			var c = function() {
				Ext.isMultiScreen = Ext.lib.Dom.getViewWidth() > 2600
			}
			Ext.EventManager.onWindowResize(c);
			c();
		});
