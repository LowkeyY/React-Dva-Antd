
Ext.namespace("dev.report.util");
dev.report.util.Misc = function() {
	this.extend = function(subclass, parent) {
		var F = function() {
		};
		F.prototype = parent.prototype;
		subclass.prototype = new F();
		subclass.prototype.constructor = subclass;
		subclass.parent = parent.prototype;
		if (parent.prototype.constructor == Object.prototype.constructor) {
			parent.prototype.constructor = parent
		}
	};
	this.addEvent = function(obj, type, func, capture) {
		if (obj.addEventListener) {
			obj.addEventListener(type, func, capture);
			return true
		}
		if (obj.attachEvent) {
			return obj.attachEvent("on".concat(type), func)
		}
	};
	this.removeEvent = function(obj, type, func, capture) {
		if (obj.removeEventListener) {
			obj.removeEventListener(type, func, capture);
			return true
		}
		if (obj.detachEvent) {
			return obj.detachEvent("on".concat(type), func)
		}
	};
	this.stopEvent = function(ev) {
		ev.cancelBubble = true;
		if (ev.stopPropagation) {
			ev.stopPropagation()
		}
	};
	this.ignoreEvent = function(ev) {
		if (!ev) {
			ev = window.event
		}
		dev.report.util.stopEvent(ev);
		return false
	};
	this.unignoreEvent = function(ev) {
		if (!ev) {
			ev = window.event
		}
		dev.report.util.stopEvent(ev);
		return true
	};
	this.fireMouseEvent = function(element, type, button) {
		if (!element) {
			return
		}
		type = type ? type : "click";
		button = button ? button : 0;
		if (element.nodeType == 3) {
			element = element.parentNode
		}
		var loc = Ext.get(element).getXY();
		if (document.createEvent) {
			var event = document.createEvent("MouseEvents");
			event.initMouseEvent(type, true, true, window, 0, 0, 0, loc[0],
					loc[1], false, false, false, false, button, null);
			element.dispatchEvent(event)
		} else {
			if (document.createEventObject) {
				var event = document.createEventObject(window.event);
				event.clientX = loc[0];
				event.clientY = loc[1];
				event.button = button;
				element.fireEvent("on".concat(type), event)
			}
		}
	};
	this.refireEvent = function(ev) {
		var tgt = ev.target ? ev.target : ev.srcElement;
		if (tgt.nodeType == 3) {
			tgt = tgt.parentNode
		}
		if (document.createEvent) {
			var clone = document.createEvent("MouseEvents");
			clone.initMouseEvent(ev.type, ev.bubbles, ev.cancelable, ev.view,
					ev.detail, ev.screenX, ev.screenY, ev.clientX, ev.clientY,
					ev.ctrlKey, ev.altKey, ev.shiftKey, ev.metaKey, ev.button,
					ev.relatedTarget);
			tgt.dispatchEvent(clone)
		} else {
			if (document.createEventObject) {
				var clone = document.createEventObject(ev);
				tgt.fireEvent("on".concat(ev.type), clone)
			}
		}
	};
	this.setText = document.getElementsByTagName("body")[0].innerText != undefined
			? function(obj, text) {
				obj.innerText = text
			}
			: function(obj, text) {
				obj.textContent = text
			};
	this.cols2Tree = function(vals, isReversed, encode) {
		if (typeof vals != "object") {
			return []
		}
		if (isReversed) {
			var name_idx = 0, alias_idx = 1, lvl_idx = 2
		} else {
			var lvl_idx = 0, name_idx = 1, alias_idx = 2
		}
		var len = vals.length, name, alias, curr_lvl, fslashCode = "&#47;", list = [], curr_lists = {}, encSpecChars = function(
				str) {
			if (typeof str != "string") {
				return str
			}
			return str.replace(/\//g, fslashCode)
		};
		if (len && len % 3 == 0 && typeof(curr_lvl = vals[lvl_idx]) == "number") {
			name = vals[name_idx];
			alias = vals[alias_idx];
			if (alias == "") {
				alias = name
			}
			curr_lists[curr_lvl] = list;
			for (var lvl, lvl_prev = curr_lvl, i = 3; i < len; i += 3) {
				lvl = vals[i + lvl_idx];
				if (lvl > lvl_prev) {
					curr_lists[lvl] = curr_lists[curr_lvl][curr_lists[curr_lvl]
							.push({
										val : encode
												? encSpecChars(name)
												: name,
										text : alias,
										leaf : false,
										children : []
									})
							- 1].children
				} else {
					curr_lists[curr_lvl].push({
								val : encode ? encSpecChars(name) : name,
								text : alias,
								leaf : true
							})
				}
				lvl_prev = lvl;
				if (lvl in curr_lists) {
					curr_lvl = lvl
				}
				name = vals[i + name_idx];
				if ((alias = vals[i + alias_idx]) == "") {
					alias = name
				}
			}
			curr_lists[curr_lvl].push({
						val : encode ? encSpecChars(name) : name,
						text : alias,
						leaf : true
					})
		} else {
			for (var val, i = 0; i < len; ++i) {
				val = vals[i], list.push({
							val : encode ? encSpecChars(val) : val,
							text : val,
							leaf : true
						})
			}
		}
		return list
	};
	this.cols2List = function(vals, isReversed) {
		if (typeof vals != "object") {
			return []
		}
		if (isReversed) {
			var name_idx = 0, alias_idx = 1, lvl_idx = 2
		} else {
			var lvl_idx = 0, name_idx = 1, alias_idx = 2
		}
		var len = vals.length, list = [];
		if (len && len % 3 == 0 && typeof vals[lvl_idx] == "number") {
			for (var i = 0, alias; i < len; i += 3) {
				alias = vals[i + alias_idx];
				if (alias == "") {
					alias = vals[i + name_idx]
				}
				list.push(alias)
			}
		} else {
			list = vals
		}
		return list
	};
	this.reg2rng = function(ul, w, h) {
		return ul.concat(ul[0] + w - 1, ul[1] + h - 1)
	};
	this.rngCap = function(rng, pt) {
		if (rng[2] > pt[0]) {
			rng[2] = pt[0]
		}
		if (rng[3] > pt[1]) {
			rng[3] = pt[1]
		}
	};
	this.objFlip = function(obj) {
		flip = {};
		for (var key in obj) {
			flip[obj[key]] = key
		}
		return flip
	};
	this.serializer = new function() {
		var meta_map = {
			"\b" : "\\b",
			"\t" : "\\t",
			"\n" : "\\n",
			"\f" : "\\f",
			"\r" : "\\r",
			'"' : '\\"',
			"\\" : "\\\\"
		}, meta_re = /[\\\"\x08\x09\x0a\x0c\x0d]/g;
		function meta_repl(c) {
			return meta_map[c]
		}
		function quote(str, out) {
			meta_re.lastIndex = 0;
			out.push('"', (meta_re.test(str)
							? str.replace(meta_re, meta_repl)
							: str), '"')
		}
		this.enc = function(v, out) {
			var f = out instanceof Array ? false : (out = ["("], true);
			switch (typeof(v)) {
				case "string" :
					quote(v, out);
					break;
				case "number" :
				case "boolean" :
					out.push(v);
					break;
				case "object" :
					if (v === null) {
						out.push("null")
					} else {
						if (v instanceof Array) {
							out.push("[");
							var l = v.length, i = 0, c = false;
							while (i < l) {
								if (c) {
									out.push(",")
								}
								this.enc(v[i++], out);
								c = true
							}
							out.push("]")
						} else {
							if (v instanceof String) {
								quote(v, out)
							} else {
								if (v instanceof Number || v instanceof Boolean) {
									out.push(v)
								} else {
									out.push("{");
									var c = false, k;
									for (k in v) {
										if (c) {
											out.push(",")
										}
										out.push('"', k, '":');
										this.enc(v[k], out);
										c = true
									}
									out.push("}")
								}
							}
						}
					}
					break;
				default :
					out.push("undefined");
					break
			}
			if (f) {
				out.push(")");
				return out.join("")
			}
		};
		this.dec = function(str) {
			return eval(str)
		}
	};
	this.offsetLeft = function(el) {
		return el.offsetLeft
	};
	this.offsetTop = function(el) {
		return el.offsetTop
	};
	this.getSelection = function(el) {
		if ("selectionStart" in el) {
			return {
				start : el.selectionStart,
				end : el.selectionEnd
			}
		}
		var sel = el.createTextRange(), pre = el.createTextRange();
		sel.moveToBookmark(document.selection.createRange().getBookmark());
		pre.collapse(true);
		pre.setEndPoint("EndToStart", sel);
		var start = pre.text.length;
		return {
			start : start,
			end : start + sel.text.length
		}
	};
	this.setSelection = function(el, start, end) {
		if (end == undefined) {
			end = start
		}
		if ("selectionStart" in el) {
			el.selectionStart = start;
			el.selectionEnd = end
		} else {
			var sel = el.createTextRange();
			sel.collapse(true);
			sel.moveEnd("character", end);
			sel.moveStart("character", start);
			sel.select()
		}
		setTimeout(function() {
					el.focus()
				}, 0)
	};
	this.getSelected = function(el) {
		var sel;
		return (sel = document.selection) ? (sel.type == "Text" ? sel
				.createRange().text : "") : el.value.substring(
				el.selectionStart, el.selectionEnd)
	};
	this.combineCBs = function(cb1) {
		var len = arguments.length, cb = arguments[0];
		for (var i = 0; i < len; cb = arguments[++i]) {
			if (cb instanceof Array && cb.length > 1) {
				cb[1].apply(cb[0], cb.slice(2))
			}
		}
	};
	this.asSize = function(num) {
		return num < 0 ? "0px" : "".concat(num | 0, "px")
	};
	this.shuffleArray = function(array) {
		var top = array.length, tmp, curr;
		if (top) {
			while (--top) {
				curr = Math.floor(Math.random() * (top + 1));
				tmp = array[curr];
				array[curr] = array[top];
				array[top] = tmp
			}
		}
		return array
	}
};
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt) {
		var len = this.length, from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += len
		}
		for (; from < len; from++) {
			if (from in this && this[from] === elt) {
				return from
			}
		}
		return -1
	}
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun) {
		if (typeof fun != "function") {
			throw new TypeError()
		}
		for (var len = this.length, thisp = arguments[1], i = 0; i < len; i++) {
			if (i in this) {
				fun.call(thisp, this[i], i, this)
			}
		}
	}
}
if (!Array.prototype.compare) {
	Array.prototype.compare = function(testArr) {
		if (this.length != testArr.length) {
			return false
		}
		for (var i = 0; i < testArr.length; i++) {
			if (this[i].compare) {
				if (!this[i].compare(testArr[i])) {
					return false
				}
			}
			if (this[i] !== testArr[i]) {
				return false
			}
		}
		return true
	}
}
if (!String.prototype.entityify) {
	String.prototype.entityify = function() {
		return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
				"&gt;")
	}
}
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		var str = this.replace(/^\s\s*/, ""), ws = /\s/, i = str.length;
		while (ws.test(str.charAt(--i))) {
		}
		return str.slice(0, i + 1)
	}
}
if (typeof Object.create !== "function") {
	Object.create = function(o) {
		function F() {
		}
		F.prototype = o;
		return new F()
	}
}
if (typeof Element !== "undefined") {
	"use strict";
	(function() {
		var classListProp = "classList", protoProp = "prototype", elemCtrProto = Element[protoProp], objCtr = Object;
		if (!objCtr.hasOwnProperty.call(elemCtrProto, classListProp)) {
			var strTrim = String[protoProp].trim || function() {
				return this.replace(/^\s+|\s+$/g, "")
			}, arrIndexOf = Array[protoProp].indexOf || function(item) {
				for (var i = 0, len = this.length; i < len; i++) {
					if (i in this && this[i] === item) {
						return i
					}
				}
				return -1
			}, checkTokenAndGetIndex = function(classList, token) {
				if (token === "") {
					throw "SYNTAX_ERR"
				}
				if (/\s/.test(token)) {
					throw "INVALID_CHARACTER_ERR"
				}
				return arrIndexOf.call(classList, token)
			}, ClassList = function(elem) {
				var trimmedClasses = strTrim.call(elem.className), classes = trimmedClasses
						? trimmedClasses.split(/\s+/)
						: [];
				for (var i = 0, len = classes.length; i < len; i++) {
					this.push(classes[i])
				}
				this.updateClassName = function() {
					elem.className = this.toString()
				}
			}, classListProto = ClassList[protoProp] = [], classListGetter = function() {
				return new ClassList(this)
			};
			classListProto.item = function(i) {
				return this[i] || null
			};
			classListProto.contains = function(token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1
			};
			classListProto.add = function(token) {
				token += "";
				if (checkTokenAndGetIndex(this, token) === -1) {
					this.push(token);
					this.updateClassName()
				}
			};
			classListProto.remove = function(token) {
				token += "";
				var index = checkTokenAndGetIndex(this, token);
				if (index !== -1) {
					this.splice(index, 1);
					this.updateClassName()
				}
			};
			classListProto.toggle = function(token) {
				token += "";
				if (checkTokenAndGetIndex(this, token) === -1) {
					this.add(token)
				} else {
					this.remove(token)
				}
			};
			classListProto.toString = function() {
				return this.join(" ")
			};
			if (objCtr.defineProperty) {
				var classListDescriptor = {
					get : classListGetter,
					enumerable : true,
					configurable : true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp,
							classListDescriptor)
				} catch (ex) {
					if (ex.number === -2146823252) {
						classListDescriptor.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp,
								classListDescriptor)
					}
				}
			} else {
				if (objCtr[protoProp].__defineGetter__) {
					elemCtrProto.__defineGetter__(classListProp,
							classListGetter)
				}
			}
		}
	}())
};