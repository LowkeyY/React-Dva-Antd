
var ua = navigator.userAgent;
  
var opera = /opera [56789]|opera\/[56789]/i.test(ua);
var ie = !opera && /MSIE [56789]/i.test(ua);
var mozilla=false;
if(!ie){
	mozilla = !opera && /mozilla\/[56789]/i.test(ua);
}
window.debug=true;


function __firefox(){ 
	HTMLElement.prototype.__defineGetter__("runtimeStyle", __element_style); 
	window.constructor.prototype.__defineGetter__("event", __window_event); 
	Event.prototype.__defineGetter__("srcElement", __event_srcElement); 
} 

function __element_style(){ 
	return this.style; 
} 
function __window_event(){ 
	return __window_event_constructor(); 
}
function __event_srcElement(){ 
	return this.target; 
} 
function __window_event_constructor(){ 
	if(ie){ 
		return window.event; 
	} 
	var _caller = __window_event_constructor.caller; 
	while(_caller!=null){ 
		var _argument = _caller.arguments[0]; 
		if(_argument){ 
			var _temp = _argument.constructor; 
			if(_temp.toString().indexOf("Event")!=-1){ 
				return _argument; 
			} 
		} 
		_caller = _caller.caller; 
	} 
	return null; 
}
if(window.addEventListener && window.constructor.prototype.__defineGetter__){ 
	__firefox(); 
} 
//================tzadd_1  end


Jsvm = function(){
	this.coreWindow = window;
	this.isCoreManager = true;
	this.toString = Jsvm.toString();

//=========================
	this.uid = 0;
	this.getId = function(){
		return (this.uid++);
	}
//=========================

	var classCache =this.classCache = new Object();
	this.getClassName=function(node){
		return node.getAttribute("name");
	}
	this.defineClass = function(xmlDoc){
		var classList = xmlDoc.childNodes;
		for(var i=0;i<classList.length;i++){
			classNode=classList[i];
			var fullName =this.getClassName(classNode);
			var clazz = classCache[fullName] = new Array();
			if(ie)
				clazz.push([classNode.nodeName,classNode.text]);
			else 
				clazz.push([classNode.nodeName,classNode.textContent]);
		}
	}
	this.getNoneClassName = function(list){
		var arr = new Array();
		for(var i=0;i<list.length;i++)
			if(list[i]!='' && classCache[list[i]] == null)
				arr.push(list[i]);
		return arr;
	}
	this.getClassArray = function(list){
		var arr = new Array();
		for(var i=0;i<list.length;i++){
			var clazz = classCache[list[i]];
			if(clazz == null)
				throw new Error("集合里缺少原型类:"+list[i]);
			else
				arr.push(clazz);
		}
		return arr;
	}
	
	var langCache =this.langCache = new Object();
	this.defineLang = function(xmlDoc){
		var classList = xmlDoc.childNodes;
		for(var i=0;i<classList.length;i++){
			classNode=classList[i];
			var fullName = classNode.getAttribute("name");
			var clazz = langCache[fullName] = new Array();
			if(ie)
				clazz.push([classNode.nodeName,classNode.text]);
			else 
				clazz.push([classNode.nodeName,classNode.textContent]);
		}
	}
	this.getNoneLangName = function(list){
		var arr = new Array();
		if(list!='' && langCache[list] == null)
				arr.push(list);
		return arr;
	}
	this.getLangArray = function(list){
		var arr = new Array();
		var clazz = langCache[list];
		if(clazz == null)
			throw new Error("集合里缺少原型类:"+list);
		else
			arr.push(clazz);
		return arr;
	}

	var cssCache =this.cssCache = new Object();
	this.defineCSS = function(xmlDoc){
		var cssList = xmlDoc.childNodes;
		for(var i=0;i<cssList.length;i++){
			cssNode=cssList[i];
			var fullName = this.getClassName(cssNode);
			var clazz = cssCache[fullName] = new Array();
			var cssMap = cssNode.childNodes;
			for(var j=0;j<cssMap.length;j++){
				var node =cssMap[j];
				if(ie)
					clazz.push([node.nodeName,node.text]);
				else 
					clazz.push([node.nodeName,node.textContent]);
			}
		}
	}
	this.getNoneCSSName = function(list){
		var arr = new Array();
		for(var i=0;i<list.length;i++)
			if(cssCache[list[i]] == null)
				arr.push(list[i]);
		return arr;
	}
	this.getCSSArray = function(list){
		var arr = new Array();
		for(var i=0;i<list.length;i++){
			var clazz = cssCache[list[i]];
			if(clazz == null)
				throw new Error("集合里缺少原型类:"+list[i]);
			else
				arr.push(clazz);
		}
		return arr;
	}
	var windowHome = this.windowHome = new Object();
	this.getWindow = function(){
		for(var i in windowHome)
			return windowHome[i][0];
		return null
	}
	this.addChild = function(win){
		win.core = this;
		var id = win.KINGLE_GID = this.getId();
		windowHome[id] = [win,win.opener];
		win.opener = this.coreWindow;
	}
	this.removeChild = function(win){
		win.opener = windowHome[win.KINGLE_GID][1];
		delete windowHome[win.KINGLE_GID];
	}
	this.copy = function(oldCore){
		this.INITWINDOW = oldCore.INITWINDOW;
		uid = oldCore.uid;
		var oldClassCache = oldCore.classCache;
		for(var i in oldClassCache){
			var clazz = classCache[i] = new Array();
			var oldClazz = oldClassCache[i];
			for(var j=0;j<oldClazz.length;j++){
				clazz.push(oldClazz[j][0],oldClazz[j][1]);
			}
		}
		var oldWindowHome = oldCore.windowHome;
		for(var i in oldWindowHome){
			var oldClient = oldWindowHome[i];
			windowHome[i] = [oldClient[0],oldClient[1]];
			oldClient[0].core = this;
			oldClient[0].opener = this.coreWindow;
		}	
	}
	this.getOpener = function(id){
		var client = oldWindowHome[id];
		if(client != null)
			return client[1];
		else
			return null;
	}
}
function getDomDocumentPrefix() {
	if (getDomDocumentPrefix.prefix)
		return getDomDocumentPrefix.prefix;
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			o = new ActiveXObject(prefixes[i] + ".DomDocument");
			return getDomDocumentPrefix.prefix = prefixes[i];
		}catch (ex) {};
	}
	throw new Error("Could not find an installed XML parser");
}
function getXmlHttpPrefix() {
	if (getXmlHttpPrefix.prefix)
		return getXmlHttpPrefix.prefix;
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			o = new ActiveXObject(prefixes[i] + ".XmlHttp");
			return getXmlHttpPrefix.prefix = prefixes[i];
		}
		catch (ex) {};
	}throw new Error("Could not find an installed XML parser");
}
function XmlHttp() {
	try {
		if (window.XMLHttpRequest) {
			var req = new XMLHttpRequest();
			if (req.readyState == null) {
				req.readyState = 1;
				req.addEventListener("load", function () {
					req.readyState = 4;
					if (typeof req.onreadystatechange == "function")
						req.onreadystatechange();
				}, false);
			}
			return req;
		}
		if (window.ActiveXObject) {
			return new ActiveXObject(getXmlHttpPrefix() + ".XmlHttp");
		}
	}
	catch (ex) {}
	throw new Error("Your browser does not support XmlHttp objects");
}
function XmlDocument() {
	try {
		if (document.implementation && document.implementation.createDocument){
			var doc = document.implementation.createDocument("", "", null);
			if (doc.readyState == null) {
				doc.readyState = 1;
				doc.addEventListener("load", function () {
					doc.readyState = 4;
					if (typeof doc.onreadystatechange == "function")
						doc.onreadystatechange();
				}, false);
			}
			return doc;
		}
		if (window.ActiveXObject)
			return new ActiveXObject(getDomDocumentPrefix() + ".DomDocument");
	}
	catch (ex) {}
	throw new Error("Your browser does not support XmlDocument objects");
}
if (window.DOMParser &&window.XMLSerializer &&window.Node && Node.prototype && Node.prototype.__defineGetter__) {
	Document.prototype.loadXML = function (s) {
		var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
		while (this.hasChildNodes())
			this.removeChild(this.lastChild);
		for (var i = 0; i < doc2.childNodes.length; i++) {
			this.appendChild(this.importNode(doc2.childNodes[i], true));
		}
	};
	Document.prototype.__defineGetter__("xml", function () {
		return (new XMLSerializer()).serializeToString(this);
	});
}
if( document.implementation.hasFeature("XPath","3.0")){
	XMLDocument.prototype.selectNodes = function(cXPathString, xNode){
			if( !xNode ) { xNode = this; } 
			var oNSResolver = this.createNSResolver(this.documentElement);
			var aItems = this.evaluate(cXPathString, xNode, oNSResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var aResult = [];
			for( var i = 0; i < aItems.snapshotLength; i++){
					aResult[i] = aItems.snapshotItem(i);
			}
			return aResult;
	}
	Element.prototype.selectNodes = function(cXPathString){
		if(this.ownerDocument.selectNodes){
			return this.ownerDocument.selectNodes(cXPathString, this);
		}else{throw "For XML Elements Only";}
	}
}
if(document.implementation.hasFeature("XPath","3.0")){
		XMLDocument.prototype.selectSingleNode = function(cXPathString, xNode){
			if( !xNode ) { xNode = this; } 
			var xItems = this.selectNodes(cXPathString, xNode);
			if( xItems.length > 0 ){
				return xItems[0];
			}else{
				return null;
			}
	}
	Element.prototype.selectSingleNode = function(cXPathString){ 
		if(this.ownerDocument.selectSingleNode){
				return this.ownerDocument.selectSingleNode(cXPathString, this);
		}else{throw "For XML Elements Only";}
	}
}
window.core = new Jsvm();
window.debug=10;
Array.prototype.toString = function(){return this.join("")}
//Array.prototype.remove=function(i){this.splice(i,1);}
Array.prototype.removeNode = function(item){
	for(var i=0;i<this.length;i++){
		if(this[i] == item){
			this.splice(i,1);
			break;
		}
	}
}
Array.prototype.distinct = function(){
	var o = Object();
	var arr = [];
	for(var i=0;i<this.length;i++){
		var a = this[i];
		if(!o[a])
			arr.push(a);
		o[this[i]] = true;
	}
	return arr;
};
String.prototype.trim=function (){ return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');}
String.prototype.trimLeft=function (){return this.replace(/^\s*/g,'');}
String.prototype.trimRight=function(){return this.replace(/\s*$/g,'');}
String.prototype.left=function(count){return this.substr(0,count);}
String.prototype.right=function (count){return this.substr(this.length-count,count);}
String.prototype.replaceBlank=function(v){return this.replace(/\s*/g,v);}
String.prototype.EncodeHTML=function(){
	return this.replace(/\x26/g,"&#38;").replace(/\x3c/g,"&#60;").replace(/\x3e/g,"&#62;").replace(/\x22/g,"&#34;").replace(/\x27/g,"&#39;");
}
KingleException = function(user,sys){
	this.user = user;
	this.sys = sys;
	this.debug = "";
};
_p=KingleException.prototype;
_p.toString = function(){
	if(window.debug){
		return ["用户信息",this.user,"系统信息",this.sys,"调试信息",this.debug].join("\n\n");
	}else
		return this.user;
}
////////////////////////////////////////////////////////////// init
if(self == top && !window.DIALOG){
	window.setManager = function(){
		eval("Jsvm="+top.core.__CLASS.toString());
		window.core = new Jsvm();
		window.core.copy(top.core);
	}
	window.onbeforeunload = function(){
		if(window == top.core.coreWindow){
			var win = top.core.getWindow();
			if(win == null)
				window.opener = top.core;
			else{
				window.opener = win;
				top.core.removeChild(win);
				win.setManager();
			}
		}else
			top.core.removeChild(window);
	}
}
System = function(){
	var loaded = false;
	var cssloaded = false;
	var jsloaded = false;
	var imports = new Array();
	var loadedcss = new Array();
	window.onload = function(){
		loaded = true;
		cssloaded=true;
		if(imports.length>0)
			importClass(imports);
		if(loadedcss.length>0)
			importCSS(loadedcss);
		if(window.main)
			main();
	}
	/*
	window.onerror = function(msg,url,sLine){
		var arr = new Array();
		if(sLine!=0&&url!=""){
			if(window.debug)
				arr.push("地址 : ",url,"\n行号 : ",sLine,"\n\n");
			arr.push(msg);
			if(Ext.msg){
				Ext.msg("info",arr.join("<br>"),{
					hideDelay:5000
				})
			}
		}
		return false;
	}*/
	window.susing = function(){
		if(loaded){
			importClass(arguments);
		}else{
			for(var i=0;i<arguments.length;i++)
				imports.push(arguments[i]);
		}
	}
	var loadScript=function(url,callback){
		var loaderNode;
		loaderNode = document.createElement("script");
		loaderNode.setAttribute("type", "text/javascript");
		loaderNode.setAttribute("src", url);
		loaderNode.onload = loaderNode.onreadystatechange = function() {
			if (!loaderNode.readyState || loaderNode.readyState == "loaded" || loaderNode.readyState == "complete" || loaderNode.readyState == 4 && loaderNode.status == 200) {
				callback();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(loaderNode);
	}
	//同步载入
	window.useJS = function(url,callback){
		if(url instanceof Array){
			var fn=function(){
				var scriptName=url.shift();
				if(typeof(scriptName)=='undefined')
					callback();
				else
					loadScript(scriptName,fn);
			}
			fn();
		}else
			loadScript(url,callback);
	}
	
	window.useCss = function(){
		var loaderNode;
		loaderNode = document.createElement("link");
		loaderNode.setAttribute("rel", "stylesheet");
		loaderNode.setAttribute("type", "text/css");
		loaderNode.setAttribute("href", this.getUrl());
		loaderNode.onload = loaderNode.onreadystatechange = function() {
			if (!loaderNode.readyState || loaderNode.readyState == "loaded" || loaderNode.readyState == "complete" || loaderNode.readyState == 4 && loaderNode.status == 200) {
				jsloaded = true;
			}
		};
		document.getElementsByTagName("head")[0].appendChild(loaderNode);
	}
	window.loadcss = function(){
		if(cssloaded){
				importCSS(arguments);
		}else{
			for(var i=0;i<arguments.length;i++)
				loadedcss.push(arguments[i]);
		}
	}
	window.usecss = function(){
		importCSS(arguments);
	}
	window.using = function(){
		importClass(arguments);
	}
	window.getImg = function(src){
		if(src.charAt(0) == '/')
			return src;
		return "/themes/images/"+src+".gif";
	}
	window.loadlang = function(){
		importLang(arguments);
	}

	var importLang = function(list){
		var lang=get_cookie('lang');
		if(lang==null) return;
		var noLoaded = top.core.getNoneLangName(list[0]);
		var paramsNoLoad;
		if(noLoaded.length>0){
			paramsNoLoad=noLoaded[0];
			top.core.defineLang(Tool.loadLang(paramsNoLoad+','+lang));
		}
		var classCodes = top.core.getLangArray(paramsNoLoad+'.strings');
		var proto = new Array();
		for(var i=0;i<classCodes.length;i++){
			proto.push(classCodes[i][0][1]);
		}
		eval(proto.join("\n"));
	}
	var importClass = function(list){
		var noLoaded = top.core.getNoneClassName(list);
		if(noLoaded.length ==0) 
		return;
		var paramsNoLoad=noLoaded.join(',');
		top.core.defineClass(Tool.loadLib(paramsNoLoad));
		var classCodes = top.core.getClassArray(noLoaded);
		var proto = new Array();
		for(var i=0;i<classCodes.length;i++){
			proto.push(classCodes[i][0][1]);
		}
		eval(proto.join("\n"));
	}
	var importCSS = function(list){
		var noLoaded = top.core.getNoneCSSName(list);
		if(noLoaded.length >0){
			for(var i=0;i<noLoaded.length;i++){
				top.core.defineCSS(Tool.loadCSS(noLoaded[i]));	
			}
		}
		var cssCodes = top.core.getCSSArray(noLoaded);
		var proto = new Array();
		for(var i=0;i<cssCodes.length;i++){
			proto.push(cssCodes[i][0][1]);
		}
		if(noLoaded.length>0){
			var _css=proto.join("\n");
			Ext.util.CSS.createStyleSheet(_css);
		}
	}
	window.getId = function(){return top.core.getId();}
	window.getOpener = function(){return top.core.getOpener();}
}

Tool = new Object();
Tool.XMLHTTP =  new XmlHttp();
Tool.XMLDOM=new XmlDocument();

Tool.parseXML = function(text){
	if(window.ActiveXObject){
		var xmlDoc = Tool.XMLDOM;
		xmlDoc.async = false;
		xmlDoc.loadXML(text); 
	}else{
		parser = new DOMParser();

		xmlDoc = parser.parseFromString(text, "application/xml");
	}
	xmlDoc = xmlDoc.documentElement;
	return xmlDoc;
}

Tool.post = function(text,url,windowname){
	if(!windowname)
		windowname="_self";
	__HIDDENFORM = window.__HIDDENFORM;
	if(!__HIDDENFORM){
		window.__HIDDENFORM = document.createElement('<form method=post action='+url+' target='+windowname+'></form>');
		__HIDDENFORM.innerHTML = '<input type=hidden name=_XMLSTRING_>';
	}else{
		__HIDDENFORM.action = url;
		__HIDDENFORM.target = windowname;
	}
	document.appendChild(__HIDDENFORM);
	__HIDDENFORM.children[0].value = text;
	__HIDDENFORM.submit();
}

Tool.getXML = function(url){
	var xmlHTTP = new XmlHttp();
	var xmlDoc;
	if(url.indexOf("?")!= -1)
		url+="&"+(new Date()).valueOf();
	else
		url+="?"+(new Date()).valueOf();

	xmlHTTP.open("GET",url, false);
	xmlHTTP.setRequestHeader("jacper_method","XML");
	xmlHTTP.send(null);
	xmlDoc = xmlHTTP.responseXML.body;

	if(xmlHTTP.getResponseHeader("content-type").indexOf("xml") && !xmlDoc){
		
		xmlDoc = Tool.parseXML(xmlHTTP.responseText);
	}

	if(!xmlDoc)
		throw new Error(xmlHTTP.responseText);

	if(xmlHTTP.status == 800){
		throw new Error(xmlDoc.selectSingleNode("user").text);
	}

	if(xmlHTTP.status != 200){
		if(xmlHTTP.status==401){
			top.TimeOut.showWindow();
			throw new Error(401);
		}
		var err = new KingleException("数据提交错误,程序被迫中止","数据载入错误 url="+url);

		err.user += "\n 服务信息:"+xmlDoc.selectSingleNode("user").text;
		err.debug = new Array();
		if(xmlDoc.selectSingleNode("sys"))
			err.debug.push(xmlDoc.selectSingleNode("sys").text);
		if(xmlDoc.selectSingleNode("debug"))
			err.debug.push(xmlDoc.selectSingleNode("debug").text);
		err.debug = err.debug.join("\n");
		
		throw new Error(err.toString());
	}
	return xmlDoc;
}

Tool.postXML = function(url,xmlDoc){
	var xmlHTTP = Tool.XMLHTTP;
	xmlHTTP.open("POST",url, false);
	xmlHTTP.setRequestHeader("jacper_method","XML");
	xmlHTTP.send(xmlDoc);

	xmlDoc = xmlHTTP.responseXML.documentElement;

	if(xmlHTTP.getResponseHeader("content-type").indexOf("xml") && !xmlDoc)
		xmlDoc = Tool.parseXML(xmlHTTP.responseText);

	if(!xmlDoc)
		throw new Error(xmlHTTP.responseText);

	if(xmlHTTP.status == 800){
		throw new Error(xmlDoc.selectSingleNode("user").text);
	}

	if(xmlHTTP.status != 200){
		var err = new KingleException("数据提交错误,程序被迫中止","数据载入错误 url="+url);

		err.user += "\n 服务信息:"+xmlDoc.selectSingleNode("user").text;
		err.debug = new Array();
		if(xmlDoc.selectSingleNode("sys"))
			err.debug.push(xmlDoc.selectSingleNode("sys").text);
		if(xmlDoc.selectSingleNode("debug"))
			err.debug.push(xmlDoc.selectSingleNode("debug").text);
		err.debug = err.debug.join("\n");
		
		throw new Error(err.toString());
	}
	return xmlDoc;
}
Tool.loadLang = function(list){
	try{
		var xmlHTTP = Tool.XMLHTTP;
		xmlHTTP.open("GET", "/jsvm/Language.jcp?"+list, false);
		xmlHTTP.send(null);
	}catch(e){alert(e.message);return false}
	if(!xmlHTTP.responseXML.documentElement){
		throw new Error("类库载入错误"+list);
	}
	return xmlHTTP.responseXML.documentElement;
}
Tool.loadLib = function(list){
	try{
		var xmlHTTP = Tool.XMLHTTP;
		xmlHTTP.open("GET", "/jsvm/JavaScript.jcp?"+list, false);
		xmlHTTP.send(null);
	}catch(e){alert(e.message);return false}
	if(!xmlHTTP.responseXML.documentElement){
		throw new Error("类库载入错误"+list);
	}
	return xmlHTTP.responseXML.documentElement;
}
Tool.loadCSS = function(list){
	var xmlHTTP = Tool.XMLHTTP;
	xmlHTTP.open("GET", "/jsvm/CSS.jcp?"+list, false);
	xmlHTTP.send(null);
	if(!xmlHTTP.responseXML.documentElement){
		throw new Error("类库载入错误"+list);
	}
	return xmlHTTP.responseXML.documentElement;
}
Tool.disableEvent = function(){
	if(document.all){
		event.returnValue = false;  
        event.cancelBubble = true;
    }else{
		event.preventDefault();  
        event.stopPropagation();
    }
}
Tool.sort = function(arr){ // String
	var sorts = new Array();
	var length = arr.length;
	var str;
	for(var i=0;i<length;i++){
		str = arr[i];
		if(isNaN(str)){
			sorts[i] = "a"+str.toLowerCase()+"|"+i
		}else{
			sorts[i] = String.fromCharCode(48 + (parseInt(str)+"").length) + str +"|"+i
		}
	}
	sorts.sort();
	for(var i=0;i<length;i++){
		str = sorts[i];
		sorts[i] = parseInt(str.substring(str.lastIndexOf("|")+1));
	}
	return sorts;
}
Tool.distinct = function(arr){
   var resultArr = [],
   returnArr = [];
   var a = {};  
   for(var i=0; i<arr.length; i++) {
    if(typeof a[arr[i]] == "undefined") {
       a[arr[i]] = false; //数组中只有一项
    }else{
       a[arr[i]] = true;   //数组中有重复的项
    }
   }    
   for(var i in a) {
		resultArr[resultArr.length] = i;
      if (a[i]) {
        returnArr[returnArr.length] = i;
    }
   }
   return resultArr;  
}
Tool.getPosition = function(node){
	if(node == null)
		return [0,0];
	var x,y;
	x=y=0;
	var x = node.offsetLeft;
	var y = node.offsetTop;
	while(node = node.parentNode){
		x+=node.offsetLeft;	
		y+=node.offsetTop;
	}
	return [x,y];
}
Map = function(){
	this._HTML = [];
	this._COMPONENT = [];
	this._INDEX = [];
}
_p = Map.prototype;
_p.__CLASS = Map;
_p.__MAP = true;
_p.append = function(){
	var html = this._HTML;
	var com = this._COMPONENT;
	var index = this._INDEX;
	for(var i=0;i<arguments.length;i++){
		var o = arguments[i];
		if(o!=null){
			if(i%2 == 0)
				html.push(o);
			else{
				if(o.__MAP == true){
					com.push(o);
					html.push(o);
				}else{
					var id= getId();
					index[o] = id;
					html.push(' id=_',id);
				}
			}
		}
	}
}
_p.clear = function(dom){
	if(dom == null)
		return;
	dom.innerHTML = '';
	this._HTML = [];
	this._COMPONENT = [];
	this._INDEX = [];
}
_p.finish = function(dom,doc){	//公共接口,继承者必须重载此方法!
	if(dom == null)
		return;
	dom.innerHTML = this._HTML.toString();
	this._init(dom,doc)
}
_p._init = function(dom,doc){
	this._HTML = doc;
	var com = this._COMPONENT;
	for(var i=0;i<com.length;i++){
		try{
			com[i]._init(dom,doc);
			com[i].finish();				
		}catch(e){}
	}
}
_p.getMap = function(name){
	return this._HTML.getElementById('_'+this._INDEX[name]);
}
_p.toString = function(){
	return this._HTML.toString();
}
Node = function(prop){
	if(prop)
		this.prop = prop;
	else
		this.prop = new Object();
}
_p = Node.prototype;
_p.__CLASS = Node;

_p.appendChild = function(node){
	var son = this.son;
	if(!son)
		son = this.son = [];
	node.parent = this;
	son.push(node);
}

_p.createChild = function(){
	var son = this.son;
	if(!son)
		son = this.son = [];
	var node = new Node();
	node.parent = this;
	son.push(node);
	return node;
}

_p.remove = function(){
	var son = this.parent.son;
	if(son.length == 1)
		delete node.parent.son;
	else
		son.removeItem(this);
}

_p.index = function(){
	var son = this.parent.son;
	for(var i=0;i<son.length;i++){
		if(son[i] == this){
			return i;
			break;
		}
	}
}
_p.getPathBy = function(tag){
	var arr = [];
	var node = this;
	while(node){
		var v = node.prop[tag];
		if(v != null) arr.push(v);
		else break;
		node = node.parent;
	}
	return arr.reverse();
}
_p.getChild =function(id){
	var son = this.son;
	if(!son)
		return;
	for(var i=0;i<son.length;i++)
		if(son[i].prop._id==id)
			return son[i];
}

_p.getChildBy = function(tag,path){
	if(this.prop[tag] != path[0])
		return null;
	var arr = [this];
	var node = this;
	var son = this.son;
	var i = 0;
	var index = 1;

	while(true){
		if(!son || i == son.length)
			break;
		if(son[i].prop[tag] == path[index]){
			arr.push(son[i]);
			son = son[i].son;
			index++;
			i=0;
		}else i++;
	}
	return arr;
}
_p.getTreeXML = function(){
	var covert = function(arr,node){
		var prop = node.prop;
		var tag = prop._tag;
		if(!tag)
			tag = "node";
		arr.push('<',tag);
		for(var i in prop) if(prop[i]!=null) arr.push(' ',i,'="',prop[i],'"');
		arr.push('>');
		var son = node.son;
		if(son) for(var i=0;i<son.length;i++) covert(arr,son[i]);
		arr.push('</',tag,'>\n');
	}
	var arr = new Array();
	covert(arr,this);
	return arr.toString();
}

_p.loadXML = function(xmlDoc){
	var getProp = Node.getProp;
	var copyProp = Node.copyProp;

	this.son = new Array();

	var cache = new Object();
	cache[this.prop._id] = this;

	var classMap = xmlDoc.childNodes;
	var len = classMap.length;

	for(var i=0;i<len;i++){
		var elements = classMap[i];
		if(elements.attributes==null) continue;
		var temp = getProp(elements.attributes);
		temp.push(["_tag",elements.tagName]);
		var nodeMap = elements.childNodes;
		var len1 = nodeMap.length;
		for(var j=0;j<len1;j++){
			var element = nodeMap[j];
			if(element.attributes){
				var prop = copyProp(element.attributes,temp);
				var v = prop._id;
				var tmp_node = cache[v];
				if(tmp_node == null)
					tmp_node = cache[v] = new Node(prop);
				else 
					tmp_node.prop = prop;
				v = prop._parent;

				var _p = cache[v];
				if(!_p)
					_p = cache[v] = new Node();
				_p.appendChild(tmp_node);
			}
		}
	}
}

Node.getProp = 	function(attri){
	var len = attri.length;
	var arr = new Array();
	for(var i=0;i<len;i++)
		arr.push([attri[i].name,attri[i].value]);
	return arr;
}

Node.copyProp = function copyProp(attri,arr){
	var o = new Object();
	for(i =0;i<arr.length;i++)
		o[arr[i][0]] = arr[i][1];
	var len = attri.length;
	for(var i=0;i<len;i++)
		o[attri[i].name]=attri[i].value;
	return o;
}
Node._copyProp = function(prop,xmlDoc,src){
	var attri = xmlDoc.attributes;
	var len = attri.length;
	if(src){
		for(var i in src){
			prop[i]= src[i];
		}
	}
	for(var i=0;i<len;i++){
		prop[attri[i].name] = attri[i].value;
	}
}
Node.loadXML = function(xmlDoc){
	var node = new Node();
	node.prop = Node.copyProp(xmlDoc.attributes,[]);
	node.loadXML(xmlDoc);
	return node;
}

Node.getNext = function(node){
	if(node.parent.son[node.index+1])
		return node.parent.son[node.index+1];
	return false;
}

Matrix = function(){
	this.data = new Object();
	this.width = 0;
	this.height = 0;
}

Matrix.prototype.load = function(xmlDoc){

	var title_map = xmlDoc.selectSingleNode("head").childNodes;
	var data_map = xmlDoc.selectSingleNode("data").childNodes;

	this.width = title_map.length;
	this.height = data_map.length;
	var _type = this.type =new Array();
	var _data = new Array();
	var title_node,data_node;

	for(var i=0;i<this.width;i++){
		var node = title_map.nextNode();
		this.data[node.text] = _data[i] = new Array();
		if( node.getAttribute("is_num") == 1)
			_type[i] = true;
	}

	for(var i=0;i<this.height;i++){
		data_node = data_map.nextNode().childNodes;
		for(var j=0;j<this.width;j++){
			var value = data_node.nextNode().text;
			if(_type[j])
				_data[j][i] = (value == "")? 0:parseFloat(value);
			else
				_data[j][i] = (!value)? "" : value;
		}
	}
}
Matrix.prototype.getData = function(colNameList){
	var _data = new Array();
	inner:
	for(var i=0;i<colNameList.length;i++){
		var colName = colNameList[i];
		if(!colName) continue;
		if(this.data[colName]){
			_data[i] = this.data[colName];
			continue;
		}
		if(colName.charAt(0) =="/"){
			var column = this.data[colName] = _data[i] = new Array();
			var start = colName.substring(1);
			var ident = 1;
			var ti;
			if(-1 != (ti = start.indexOf(","))){
				ident = parseFloat(start.substring(ti+1));
				start = parseFloat(start.substring(0,ti));
			}else if(start != "")
				start = parseInt(start);
			else start = 0;
			for(var j=0;j<this.height;j++){
				column[j] = parseFloat(j)*ident+start
			}
		}else if(colName.indexOf("[") != -1){
			colName = colName.replace(/\[/g,"this.data[\"");
			colName = colName.replace(/\]/g,"\"][j]");
			var temp = new Array();
			for(var j=0;j<this.height;j++){
				try{
					temp[j] = eval(colName);
				}catch(e){alert(colName+"\n"+colNameList[i]+"算法输入错误!");continue inner;}
			}
			this.data[colName] = _data[i] = temp;
		}
	}
	return _data;
}
Timer = function(inst){
	this.maxNum = 0;
	this.count = 0;
	this.instance = inst;
	this.timer = null;
	this.id = getId();
};
_p = Timer.prototype;

_p.start = function(interval,number){
	Timer.processors[this.id] = this;
	if(!number)
		number = 0;
	this.maxNum = number;
	this.timer = window.setInterval("Timer.processors["+this.id+"].process()",interval);
}
_p.stop = function(){
	if(this.timer){
		window.clearInterval(this.timer)
		this.count = 0;
	}
}
_p.process = function(){
	if(this.maxNum >0 && this.count >= this.maxNum-1)
		this.stop();
	if(this.instance.run() === false)
		this.stop();
	this.count++;
}

Timer.processors = new Object();

Request = function(){
	this._data = null;
	this.URL = "";

	var local = decodeURI(self.location.href);
	var index = local.indexOf("?");
	if(index == -1)
		this.URL = local;
	else
		this.URL = local.substring(0,index);

	var _parseData = function(){
		var str = local.substring(index+1);
		var data = new Object();
		var arr0 = str.split("&");
		for(var i=0;i<arr0.length;i++){
			if(arr0[i]){
				var arr1 = arr0[i].split("=");
				data[arr1[0]] = arr1[1];
			}
		}
		return data;
	}

//====================================
	this.get = function(name){
		if(this._data == null)
			this._data = _parseData();
		return this._data[name];
	}
	this.set = function(name,value){
		if(this._data == null)
			this._data = _parseData();
		if(!value)
			delete this._data[name]
		else this._data[name] = value;
	}

	this.getURL = function(){
		var data = this._data;
		var str = "";
		for (var i in data){
			if(str!="") str +="&";
			str += i + '=' + data[i];
		}
		if(str == "")
			return this.URL;
		else
			return this.URL+'?'+str;
	}
}
Mover = function(domNode,moverNode){ // ，拖动接口 包含方法 ;
	domNode._moverNode = moverNode;
	domNode.onmousedown = Mover.mousedown;
}
Mover.mousedown = function(){
	if(document.all){
		if(event.button == 1){
			var _m = this._moverNode;
			if(_m.dragStart && !_m.dragStart(this))
				return;
			this.setCapture();
			this.onmouseup = Mover.mouseup;
			this.onmousemove = Mover.mousemove;
			this.__eventX = event.screenX;
			this.__eventY = event.screenY;
			window.event.cancelBubble = true;
		}
    }else{
		if(event.button == 0){
			var _m = this._moverNode;
			if(_m.dragStart && !_m.dragStart(this))
				return;
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); 
			this.onmouseup = Mover.mouseup;
			this.onmousemove = Mover.mousemove;
			this.__eventX = event.screenX;
			this.__eventY = event.screenY;
			event.stopPropagation();
		}
    }
}
Mover.mousemove = function(){
	try{
		this._moverNode.draging(this,(event.screenX - this.__eventX),(event.screenY - this.__eventY));
	}catch(e){}
}

Mover.mouseup = function(){
	try{
		this._moverNode.dragEnd(this,(event.screenX - this.__eventX),(event.screenY - this.__eventY));
	}catch(e){}
	Mover.release(this);
}


Mover.release = function(domNode){
	if (!window.captureEvents) {    
       domNode.releaseCapture();    
	}else {    
       window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);    
	} 
	domNode.onmouseup = null;
	domNode.onmousemove = null;
	domNode.__eventX = 0;
	domNode.__eventY = 0;
}

window.popup = function(url, param, focus, w, h, resizable) {
	var width = height = resize = "";
	if (w)
		width = "dialogWidth:" + w + "px;";
	if (h)
		height = "dialogHeight:" + h + "px;";
	if (resizable)
		resize = "resizable:1;";
	if (focus)
		return window.showModalDialog(url, [top.core, param],
				"help:no;status:no;" + width + height + resize);
	else
		return window.showModelessDialog(url, [top.core, param],
				"help:no;status:no;" + width + height + resize);
}
UserStore=function(store){
	this.flag="tz_";
	if(top.ie){
		if(!store){
			alert("无法载入 tree_store");
			return false;
		}
		this.store=store;
		this.store.load(this.flag);
	}
};
_p = UserStore.prototype;

_p.getAttribute=function(name){
		return (top.ie)?this.store.getAttribute(name):get_cookie(this.flag+name);
}
_p.setAttribute=function(name,value){
		if(top.ie)
			this.store.setAttribute(name,value);
		else
			set_cookie(this.flag+name,value); 
}
_p.save=function(){
	if(top.ie)
		this.store.save(this.flag);
}
System();
function set_cookie(name, value, expires, path, domain, secure) {
	if(localStorage){
		localStorage.setItem(name, escape(value));
	}
	var today = new Date();
	today.setTime( today.getTime() );
	if ( expires ){
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	
	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
	( ( path ) ? ";path=" + path : "" ) + 
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}

function get_cookie(name) {
	if(localStorage && localStorage.getItem(name)){
		return unescape(localStorage.getItem(name));
	}
	var start = document.cookie.indexOf(name + "=");
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length )))
	{
		return null;
	}
	if (start == -1) return null;
	var end = document.cookie.indexOf(";", len);
	if (end == -1) end = document.cookie.length;
	return unescape(document.cookie.substring(len, end));
}

function Delete_Cookie(name, path, domain) {
	if(Get_Cookie(name)) document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.normalize = function() { 
    return this.trim().replace(/\s+/g,' '); 
};
String.prototype.startsWith = function(str,i){ 
    i=(i)?'i':'';
    var re=new RegExp('^'+str,i);
    return (this.normalize().match(re)) ? true : false ;
};
String.prototype.endsWith = function(str,i){ 
    i=(i)?'gi':'g';
    var re=new RegExp(str+'$',i);
    return (this.normalize().match(re)) ? true : false ; 
};

var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}
function getQuery(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}
String.prototype.localize=function(params){
	var orig=this.toString();
	var trans=bin.user.strings[orig];
	if(trans){
		if(params instanceof Object){  
			for(var p in params){
				trans=trans.replace("{".concat(p,"}"),params[p])
		}
	} return trans}
return orig
};
if (!window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}
String.prototype.replaceAll  = function(s1,s2){   
	return this.replace(new RegExp(s1,"gm"),s2);   
} 
String.prototype.localize = function(params) {
	var orig = this.toString(), trans = dev.report.base.i18n.strings[orig];
	if (trans) {
		if (params instanceof Object) {
			for (var p in params) {
				trans = trans.replace("{".concat(p, "}"), params[p])
			}
		}
		return trans
	}
	return orig
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
function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
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
function  isEmty(s){
	for(var i in s)
		return false;
	return true;
};
//------------------------------------------公共函数----------------------------------------------------


