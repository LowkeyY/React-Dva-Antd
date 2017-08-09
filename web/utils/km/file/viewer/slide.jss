// 此处占用命名空间hstz

Ext.hstz = {

lang : {
	cssDirection: 'ltr',
	loadingText: '载入中...',
	loadingTitle: '取消',
	focusTitle: '置于最前',
	fullExpandTitle: '原始尺寸',
	previousText: '上一张',
	nextText: '下一张',
	moveText: '移动',
	closeText: '关闭',
	closeTitle: '关闭 (退出键)',
	resizeTitle: '调整尺寸',
	playText: '播放',
	playTitle: '播放幻灯片 (空格键)',
	pauseText: '暂停',
	pauseTitle: '暂停幻灯片 (空格键)',
	previousTitle: '上一张 (左方向键)',
	nextTitle: '下一张 (右方向键)',
	moveTitle: '移动',
	fullExpandText: '完整尺寸',
	number: 'Image %1 of %2',
	restoreTitle: '单击关闭图片,单击不放拖动图片。使用方向键进行图片切换。'
},





// See http://highslide.com/ref for examples of settings
fadeInOut:true,
graphicsDir : '/utils/km/file/viewer/graphics/',
expandCursor : 'zoomin.cur', // null disables
restoreCursor : 'zoomout.cur', // null disables
expandDuration : 250, // milliseconds
restoreDuration : 250,
marginLeft : 15,
captionEval : 'this.a.title',
marginRight : 15,
marginTop : 15,
marginBottom : 105,
zIndexCounter : 9000, // adjust to other absolutely positioned elements
loadingOpacity : 0.75,
allowMultipleInstances: true,
numberOfImagesToPreload : 5,
outlineWhileAnimating : 2, // 0 = never, 1 = always, 2 = HTML only
outlineStartOffset : 3, // ends at 10
padToMinWidth : false, // pad the popup width to make room for wide caption
fullExpandPosition : 'bottom right',
fullExpandOpacity : 1,
enableKeyListener : true,
openerTagNames : ['a'], // Add more to allow slideshow indexing
transitions :['expand', 'crossfade'],
transitionDuration: 250,
dimmingOpacity: 0.75, // Lightbox style dimming background
dimmingDuration: 50, // 0 for instant dimming

anchor : 'auto', // where the image expands from
align : 'center', // position in the client (overrides anchor)
targetX: null, // the id of a target element
targetY: null,
dragByHeading: true,
minWidth: 200,
minHeight: 200,
allowSizeReduction: true, // allow the image to reduce to fit client size. If
							// false, this overrides minWidth and minHeight
outlineType : 'custom', // set null to disable outlines
skin : {
	controls:
		'<div class="highslide-controls"><ul>'+
			'<li class="highslide-previous">'+
				'<a href="#" title="{Ext.hstz.lang.previousTitle}">'+
				'<span>{Ext.hstz.lang.previousText}</span></a>'+
			'</li>'+
			'<li class="highslide-play">'+
				'<a href="#" title="{Ext.hstz.lang.playTitle}">'+
				'<span>{Ext.hstz.lang.playText}</span></a>'+
			'</li>'+
			'<li class="highslide-pause">'+
				'<a href="#" title="{Ext.hstz.lang.pauseTitle}">'+
				'<span>{Ext.hstz.lang.pauseText}</span></a>'+
			'</li>'+
			'<li class="highslide-next">'+
				'<a href="#" title="{Ext.hstz.lang.nextTitle}">'+
				'<span>{Ext.hstz.lang.nextText}</span></a>'+
			'</li>'+
			'<li class="highslide-move">'+
				'<a href="#" title="{Ext.hstz.lang.moveTitle}">'+
				'<span>{Ext.hstz.lang.moveText}</span></a>'+
			'</li>'+
			'<li class="highslide-full-expand">'+
				'<a href="#" title="{Ext.hstz.lang.fullExpandTitle}">'+
				'<span>{Ext.hstz.lang.fullExpandText}</span></a>'+
			'</li>'+
			'<li class="highslide-close">'+
				'<a href="#" title="{Ext.hstz.lang.closeTitle}" >'+
				'<span>{Ext.hstz.lang.closeText}</span></a>'+
			'</li>'+
		'</ul></div>'
},
// END OF YOUR SETTINGS


// declare internal properties
preloadTheseImages : [],
continuePreloading: true,
expanders : [],
overrides : [
	'allowSizeReduction',
	'useBox',
	'anchor',
	'align',
	'targetX',
	'targetY',
	'outlineType',
	'outlineWhileAnimating',
	'captionId',
	'captionText',
	'captionEval',
	'captionOverlay',
	'headingId',
	'headingText',
	'headingEval',
	'headingOverlay',
	'creditsPosition',
	'dragByHeading',
	'autoplay',
	'numberPosition',
	'transitions',
	'dimmingOpacity',
	
	'width',
	'height',
	
	'wrapperClassName',
	'minWidth',
	'minHeight',
	'maxWidth',
	'maxHeight',
	'pageOrigin',
	'slideshowGroup',
	'easing',
	'easingClose',
	'fadeInOut',
	'src'
],
overlays : [],
idCounter : 0,
oPos : {
	x: ['leftpanel', 'left', 'center', 'right', 'rightpanel'],
	y: ['above', 'top', 'middle', 'bottom', 'below']
},
mouse: {},
headingOverlay: {},
captionOverlay: {},
timers : [],

slideshows : [],

pendingOutlines : {},
clones : {},
onReady: [],
uaVersion: /Trident\/4\.0/.test(navigator.userAgent) ? 8 :
	parseFloat((navigator.userAgent.toLowerCase().match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1]),
ie : (document.all && !window.opera),
safari : /Safari/.test(navigator.userAgent),
geckoMac : /Macintosh.+rv:1\.[0-8].+Gecko/.test(navigator.userAgent),

$ : function (id) {
	if (id) return document.getElementById(id);
},

push : function (arr, val) {
	arr[arr.length] = val;
},
stripItemFormatter:function(a){
	
	return "<img src="+a.thumbnail+" style='width:60px;height:40px'>"
},
createElement : function (tag, attribs, styles, parent, nopad) {
	var el = document.createElement(tag);
	if (attribs) Ext.hstz.extend(el, attribs);
	if (nopad) Ext.hstz.setStyles(el, {padding: 0, border: 'none', margin: 0});
	if (styles) Ext.hstz.setStyles(el, styles);
	if (parent) parent.appendChild(el);	
	return el;
},

extend : function (el, attribs) {
	for (var x in attribs) el[x] = attribs[x];
	return el;
},

setStyles : function (el, styles) {
	for (var x in styles) {
		if (Ext.hstz.ieLt9 && x == 'opacity') {
			if (styles[x] > 0.99) el.style.removeAttribute('filter');
			else el.style.filter = 'alpha(opacity='+ (styles[x] * 100) +')';
		}
		else el.style[x] = styles[x];		
	}
},
animate: function(el, prop, opt) {
	var start,
		end,
		unit;
	if (typeof opt != 'object' || opt === null) {
		var args = arguments;
		opt = {
			duration: args[2],
			easing: args[3],
			complete: args[4]
		};
	}
	if (typeof opt.duration != 'number') opt.duration = 250;
	opt.easing = Math[opt.easing] || Math.easeInQuad;
	opt.curAnim = Ext.hstz.extend({}, prop);
	for (var name in prop) {
		var e = new Ext.hstz.fx(el, opt , name );
		
		start = parseFloat(Ext.hstz.css(el, name)) || 0;
		end = parseFloat(prop[name]);
		unit = name != 'opacity' ? 'px' : '';
		
		e.custom( start, end, unit );
	}	
},
css: function(el, prop) {
	if (el.style[prop]) {
		return el.style[prop];
	} else if (document.defaultView) {
		return document.defaultView.getComputedStyle(el, null).getPropertyValue(prop);

	} else {
		if (prop == 'opacity') prop = 'filter';
		var val = el.currentStyle[prop.replace(/\-(\w)/g, function (a, b){ return b.toUpperCase(); })];
		if (prop == 'filter') 
			val = val.replace(/alpha\(opacity=([0-9]+)\)/, 
				function (a, b) { return b / 100 });
		return val === '' ? 1 : val;
	} 
},

getPageSize : function () {
	var d = document, w = window, iebody = d.compatMode && d.compatMode != 'BackCompat' 
		? d.documentElement : d.body,
		ieLt9 = Ext.hstz.ie && (Ext.hstz.uaVersion < 9 || typeof pageXOffset == 'undefined');
	
	var width = ieLt9 ? iebody.clientWidth : 
			(d.documentElement.clientWidth || self.innerWidth),
		height = ieLt9 ? iebody.clientHeight : self.innerHeight;
	Ext.hstz.page = {
		width: width,
		height: height,		
		scrollLeft: ieLt9 ? iebody.scrollLeft : pageXOffset,
		scrollTop: ieLt9 ? iebody.scrollTop : pageYOffset
	};
	return Ext.hstz.page;
},

getPosition : function(el)	{
	var p = { x: el.offsetLeft, y: el.offsetTop };
	while (el.offsetParent)	{
		el = el.offsetParent;
		p.x += el.offsetLeft;
		p.y += el.offsetTop;
		if (el != document.body && el != document.documentElement) {
			p.x -= el.scrollLeft;
			p.y -= el.scrollTop;
		}
	}
	return p;
},

expandx:function(cfg){
		var a = Ext.hstz.createElement('a', null, { display: 'none' }, Ext.hstz.container);

		a.innerHTML="<img src='"+cfg.thumbnail+"'>";
		delete cfg.tagName;
		Ext.apply(a,cfg);
		/*
		 * var er = new Ext.hstz.Expander(a, { slideshowGroup : 'group1',
		 * numberPosition : 'caption', transitions : ['expand', 'crossfade'] });
		 */
		this.expand(a,{
					slideshowGroup : 'group1',
					numberPosition : 'caption',
					transitions : ['expand', 'crossfade']
				});
},

expand : function(a, params, custom, type) {
	if (!a) a = Ext.hstz.createElement('a', null, { display: 'none' }, Ext.hstz.container);
	// if (typeof a.getParams == 'function') return params;
	try {	
		new Ext.hstz.Expander(a, params, custom);
		return false;
	} catch (e) { return true; }
},
getElementByClass : function (el, tagName, className) {
	var els = el.getElementsByTagName(tagName);
	for (var i = 0; i < els.length; i++) {
    	if ((new RegExp(className)).test(els[i].className)) {
			return els[i];
		}
	}
	return null;
},
replaceLang : function(s) {
	s = s.replace(/\s/g, ' ');
	var re = /{Ext.hstz\.lang\.([^}]+)\}/g,
		matches = s.match(re),
		lang;
	if (matches) for (var i = 0; i < matches.length; i++) {
		lang = matches[i].replace(re, "$1");
		if (typeof Ext.hstz.lang[lang] != 'undefined') s = s.replace(matches[i], Ext.hstz.lang[lang]);
	}
	return s;
},


focusTopmost : function() {
	var topZ = 0, 
		topmostKey = -1,
		expanders = Ext.hstz.expanders,
		exp,
		zIndex;
	for (var i = 0; i < expanders.length; i++) {
		exp = expanders[i];
		if (exp) {
			zIndex = exp.wrapper.style.zIndex;
			if (zIndex && zIndex > topZ) {
				topZ = zIndex;				
				topmostKey = i;
			}
		}
	}
	if (topmostKey == -1) Ext.hstz.focusKey = -1;
	else expanders[topmostKey].focus();
},

getParam : function (a, param) {
	return Ext.hstz[param];
	a.getParams = a.onclick;
	var p = a.getParams ? a.getParams() : null;
	a.getParams = null;
	
	return (p && typeof p[param] != 'undefined') ? p[param] : 
		(typeof Ext.hstz[param] != 'undefined' ? Ext.hstz[param] : null);
},

getSrc : function (a) {
	var src = Ext.hstz.getParam(a, 'src');
	if (src) return src;
	return a.href;
},

getNode : function (id) {
	var node = Ext.hstz.$(id), clone = Ext.hstz.clones[id], a = {};
	if (!node && !clone) return null;
	if (!clone) {
		clone = node.cloneNode(true);
		clone.id = '';
		Ext.hstz.clones[id] = clone;
		return node;
	} else {
		return clone.cloneNode(true);
	}
},

discardElement : function(d) {
	if (d) Ext.hstz.garbageBin.appendChild(d);
	Ext.hstz.garbageBin.innerHTML = '';
},
dim : function(exp) {
	var isNew=false;
	if (!Ext.hstz.dimmer) {
		isNew = true;
		Ext.hstz.dimmer = Ext.hstz.createElement ('div', {
				className: 'highslide-dimming highslide-viewport-size',
				owner: '',
				onclick: function() {
					
						Ext.hstz.close();
				}
			}, {
                visibility: 'visible',
				opacity: 0
			}, Ext.hstz.container, true);
			
		if (/(Android|iPad|iPhone|iPod)/.test(navigator.userAgent)) {
			var body = document.body;
			function pixDimmerSize() {
				Ext.hstz.setStyles(Ext.hstz.dimmer, {
					width: body.scrollWidth +'px',
					height: body.scrollHeight +'px'
				});
			}
			pixDimmerSize();
			Ext.hstz.addEventListener(window, 'resize', pixDimmerSize);
		}
	}
	Ext.hstz.dimmer.style.display = '';

	isNew = Ext.hstz.dimmer.owner == '';
	Ext.hstz.dimmer.owner += '|'+ exp.key;
	
	if (isNew) {
		if (Ext.hstz.geckoMac && Ext.hstz.dimmingGeckoFix)
			Ext.hstz.setStyles(Ext.hstz.dimmer, {
				background: 'url('+ Ext.hstz.graphicsDir + 'geckodimmer.png)',
				opacity: 1
			});
		else
			Ext.hstz.animate(Ext.hstz.dimmer, { opacity: exp.dimmingOpacity }, Ext.hstz.dimmingDuration);
	}
},
undim : function(key) {
	if (!Ext.hstz.dimmer) return;
	if (typeof key != 'undefined') Ext.hstz.dimmer.owner = Ext.hstz.dimmer.owner.replace('|'+ key, '');

	if (
		(typeof key != 'undefined' && Ext.hstz.dimmer.owner != '')
		|| (Ext.hstz.upcoming && Ext.hstz.getParam(Ext.hstz.upcoming, 'dimmingOpacity'))
	) return;

	if (Ext.hstz.geckoMac && Ext.hstz.dimmingGeckoFix) Ext.hstz.dimmer.style.display = 'none';
	else Ext.hstz.animate(Ext.hstz.dimmer, { opacity: 0 }, Ext.hstz.dimmingDuration, null, function() {
		Ext.hstz.dimmer.style.display = 'none';
	});
},
transit : function (adj, exp) {
	var last = exp || Ext.hstz.getExpander();
	exp = last;
	if (Ext.hstz.upcoming) return false;
	else Ext.hstz.last = last;
	Ext.hstz.removeEventListener(document, window.opera ? 'keypress' : 'keydown', Ext.hstz.keyHandler);
	try {
		Ext.hstz.upcoming = adj;
		adj.onclick(); 		
	} catch (e){
		Ext.hstz.last = Ext.hstz.upcoming = null;
	}
	try {
		if (!adj || exp.transitions[1] != 'crossfade')
		exp.close();
	} catch (e) {}
	return false;
},

previousOrNext : function (el, op) {
	var exp = Ext.hstz.getExpander(el);
	if (exp) return Ext.hstz.transit(exp.getAdjacentAnchor(op), exp);
	else return false;
},

previous : function (el) {
	return Ext.hstz.previousOrNext(el, -1);
},

next : function (el) {
	return Ext.hstz.previousOrNext(el, 1);	
},

keyHandler : function(e) {
	if (!e) e = window.event;
	if (!e.target) e.target = e.srcElement; // ie
	if (typeof e.target.form != 'undefined') return true; // form element has
															// focus
	var exp = Ext.hstz.getExpander();
	
	var op = null;
	switch (e.keyCode) {
		case 70: // f
			if (exp) exp.doFullExpand();
			return true;
		case 32: // Space
			op = 2;
			break;
		case 34: // Page Down
		case 39: // Arrow right
		case 40: // Arrow down
			op = 1;
			break;
		case 8:  // Backspace
		case 33: // Page Up
		case 37: // Arrow left
		case 38: // Arrow up
			op = -1;
			break;
		case 27: // Escape
		case 13: // Enter
			op = 0;
	}
	if (op !== null) {if (op != 2)Ext.hstz.removeEventListener(document, window.opera ? 'keypress' : 'keydown', Ext.hstz.keyHandler);
		if (!Ext.hstz.enableKeyListener) return true;
		
		if (e.preventDefault) e.preventDefault();
    	else e.returnValue = false;
    	if (exp) {
			if (op == 0) {
				exp.close();
			} else if (op == 2) {
				if (exp.slideshow) exp.slideshow.hitSpace();
			} else {
				if (exp.slideshow) exp.slideshow.pause();
				Ext.hstz.previousOrNext(exp.key, op);
			}
			return false;
		}
	}
	return true;
},


registerOverlay : function (overlay) {
	Ext.hstz.push(Ext.hstz.overlays, Ext.hstz.extend(overlay, { hsId: 'hsId'+ Ext.hstz.idCounter++ } ));
},


addSlideshow : function (options) {
	var sg = options.slideshowGroup;
	if (typeof sg == 'object') {
		for (var i = 0; i < sg.length; i++) {
			var o = {};
			for (var x in options) o[x] = options[x];
			o.slideshowGroup = sg[i];
			Ext.hstz.push(Ext.hstz.slideshows, o);
		}
	} else {
		Ext.hstz.push(Ext.hstz.slideshows, options);
	}
},

getWrapperKey : function (element, expOnly) {
	var el, re = /^highslide-wrapper-([0-9]+)$/;
	// 1. look in open expanders
	el = element;
	if(el.src){
		for (var key = 0; key < Ext.hstz.expanders.length; key++) {
			var exp = Ext.hstz.expanders[key];
			if (exp && exp.src == el.src) return key;
		}
	}
	while (el.parentNode)	{
		if (el.hsKey !== undefined) return el.hsKey;
		if (el.id && re.test(el.id)) return el.id.replace(re, "$1");
		el = el.parentNode;
	}
	// 2. look in thumbnail
	if (!expOnly) {
		el = element;
		while (el.parentNode)	{
			if (el.tagName && Ext.hstz.isHsAnchor(el)) {
				for (var key = 0; key < Ext.hstz.expanders.length; key++) {
					var exp = Ext.hstz.expanders[key];
					if (exp && exp.a == el) return key;
				}
			}
			el = el.parentNode;
		}
	}
	return null; 
},

getExpander : function (el, expOnly) {
	if (typeof el == 'undefined') return Ext.hstz.expanders[Ext.hstz.focusKey] || null;
	if (typeof el == 'number') return Ext.hstz.expanders[el] || null;
	if (typeof el == 'string') el = Ext.hstz.$(el);
	return Ext.hstz.expanders[Ext.hstz.getWrapperKey(el, expOnly)] || null;
},

isHsAnchor : function (a) {
	return (a.onclick && a.onclick.toString().replace(/\s/g, ' ').match(/Ext.hstz.(htmlE|e)xpand/));
},

reOrder : function () {
	for (var i = 0; i < Ext.hstz.expanders.length; i++)
		if (Ext.hstz.expanders[i] && Ext.hstz.expanders[i].isExpanded) Ext.hstz.focusTopmost();
},

mouseClickHandler : function(e) 
{	
	if (!e) e = window.event;
	if (e.button > 1) return true;
	if (!e.target) e.target = e.srcElement;
	
	var el = e.target;
	while (el.parentNode
		&& !(/highslide-(image|move|html|resize)/.test(el.className)))
	{
		el = el.parentNode;
	}
	var exp = Ext.hstz.getExpander(el);
	if (exp && (exp.isClosing || !exp.isExpanded)) return true;
		
	if (exp && e.type == 'mousedown') {
		if (e.target.form) return true;
		var match = el.className.match(/highslide-(image|move|resize)/);
		if (match) {
			Ext.hstz.dragArgs = { 
				exp: exp , 
				type: match[1], 
				left: exp.x.pos, 
				width: exp.x.size, 
				top: exp.y.pos, 
				height: exp.y.size, 
				clickX: e.clientX, 
				clickY: e.clientY
			};
			
			
			Ext.hstz.addEventListener(document, 'mousemove', Ext.hstz.dragHandler);
			if (e.preventDefault) e.preventDefault(); // FF
			
			if (/highslide-(image|html)-blur/.test(exp.content.className)) {
				exp.focus();
				Ext.hstz.hasFocused = true;
			}
			return false;
		}
	} else if (e.type == 'mouseup') {
		
		Ext.hstz.removeEventListener(document, 'mousemove', Ext.hstz.dragHandler);
		
		if (Ext.hstz.dragArgs) {
			if (Ext.hstz.styleRestoreCursor && Ext.hstz.dragArgs.type == 'image') 
				Ext.hstz.dragArgs.exp.content.style.cursor = Ext.hstz.styleRestoreCursor;
			var hasDragged = Ext.hstz.dragArgs.hasDragged;
			
			if (!hasDragged &&!Ext.hstz.hasFocused && !/(move|resize)/.test(Ext.hstz.dragArgs.type)) {
				exp.close();
			} 
			else if (hasDragged || (!hasDragged && Ext.hstz.hasHtmlExpanders)) {
				Ext.hstz.dragArgs.exp.doShowHide('hidden');
			}
			Ext.hstz.hasFocused = false;
			Ext.hstz.dragArgs = null;
		
		} else if (/highslide-image-blur/.test(el.className)) {
			el.style.cursor = Ext.hstz.styleRestoreCursor;		
		}
	}
	return false;
},

dragHandler : function(e)
{
	if (!Ext.hstz.dragArgs) return true;
	if (!e) e = window.event;
	var a = Ext.hstz.dragArgs, exp = a.exp;
	
	a.dX = e.clientX - a.clickX;
	a.dY = e.clientY - a.clickY;	
	
	var distance = Math.sqrt(Math.pow(a.dX, 2) + Math.pow(a.dY, 2));
	if (!a.hasDragged) a.hasDragged = (a.type != 'image' && distance > 0)
		|| (distance > (Ext.hstz.dragSensitivity || 5));
	
	if (a.hasDragged && e.clientX > 5 && e.clientY > 5) {
		
		if (a.type == 'resize') exp.resize(a);
		else {
			exp.moveTo(a.left + a.dX, a.top + a.dY);
			if (a.type == 'image') exp.content.style.cursor = 'move';
		}
	}
	return false;
},

wrapperMouseHandler : function (e) {
	try {
		if (!e) e = window.event;
		var over = /mouseover/i.test(e.type); 
		if (!e.target) e.target = e.srcElement; // ie
		if (!e.relatedTarget) e.relatedTarget = 
			over ? e.fromElement : e.toElement; // ie
		var exp = Ext.hstz.getExpander(e.target);
		if (!exp.isExpanded) return;
		if (!exp || !e.relatedTarget || Ext.hstz.getExpander(e.relatedTarget, true) == exp 
			|| Ext.hstz.dragArgs) return;
		for (var i = 0; i < exp.overlays.length; i++) (function() {
			var o = Ext.hstz.$('hsId'+ exp.overlays[i]);
			if (o && o.hideOnMouseOut) {
				if (over) Ext.hstz.setStyles(o, { visibility: 'visible', display: '' });
				Ext.hstz.animate(o, { opacity: over ? o.opacity : 0 }, o.dur);
			}
		})();	
	} catch (e) {}
},
addEventListener : function (el, event, func) {
	if (el == document && event == 'ready') {
		Ext.hstz.push(Ext.hstz.onReady, func);
	}
	try {
		el.addEventListener(event, func, false);
	} catch (e) {
		try {
			el.detachEvent('on'+ event, func);
			el.attachEvent('on'+ event, func);
		} catch (e) {
			el['on'+ event] = func;
		}
	} 
},

removeEventListener : function (el, event, func) {
	try {
		el.removeEventListener(event, func, false);
	} catch (e) {
		try {
			el.detachEvent('on'+ event, func);
		} catch (e) {
			el['on'+ event] = null;
		}
	}
},

preloadFullImage : function (i) {
	if (Ext.hstz.continuePreloading && Ext.hstz.preloadTheseImages[i] && Ext.hstz.preloadTheseImages[i] != 'undefined') {
		var img = document.createElement('img');
		img.onload = function() { 
			img = null;
			Ext.hstz.preloadFullImage(i + 1);
		};
		img.src = Ext.hstz.preloadTheseImages[i];
	}
},
preloadImages : function (number) {
	if (number && typeof number != 'object') Ext.hstz.numberOfImagesToPreload = number;
	
	var arr = Ext.hstz.getAnchors();
	for (var i = 0; i < arr.images.length && i < Ext.hstz.numberOfImagesToPreload; i++) {
		Ext.hstz.push(Ext.hstz.preloadTheseImages, Ext.hstz.getSrc(arr.images[i]));
	}
	
	// preload outlines
	if (Ext.hstz.outlineType)	new Ext.hstz.Outline(Ext.hstz.outlineType, function () { Ext.hstz.preloadFullImage(0)} );
	else
	
	Ext.hstz.preloadFullImage(0);
	
	// preload cursor
	if (Ext.hstz.restoreCursor) var cur = Ext.hstz.createElement('img', { src: Ext.hstz.graphicsDir + Ext.hstz.restoreCursor });
},


init : function () {
	if (!Ext.hstz.container) {
	
		Ext.hstz.ieLt7 = Ext.hstz.ie && Ext.hstz.uaVersion < 7;
		Ext.hstz.ieLt9 = Ext.hstz.ie && Ext.hstz.uaVersion < 9;
		
		Ext.hstz.getPageSize();
		for (var x in Ext.hstz.langDefaults) {
			if (typeof Ext.hstz[x] != 'undefined') Ext.hstz.lang[x] = Ext.hstz[x];
			else if (typeof Ext.hstz.lang[x] == 'undefined' && typeof Ext.hstz.langDefaults[x] != 'undefined') 
				Ext.hstz.lang[x] = Ext.hstz.langDefaults[x];
		}
		
		Ext.hstz.container = Ext.hstz.createElement('div', {
				className: 'highslide-container'
			}, {
				position: 'absolute',
				left: 0, 
				top: 0, 
				width: '100%', 
				zIndex: Ext.hstz.zIndexCounter,
				direction: 'ltr'
			}, 
			document.body,
			true
		);
		Ext.hstz.loading = Ext.hstz.createElement('a', {
				className: 'highslide-loading',
				title: Ext.hstz.lang.loadingTitle,
				innerHTML: Ext.hstz.lang.loadingText,
				href: 'javascript:;'
			}, {
				position: 'absolute',
				top: '-9999px',
				opacity: Ext.hstz.loadingOpacity,
				zIndex: 1
			}, Ext.hstz.container
		);
		Ext.hstz.garbageBin = Ext.hstz.createElement('div', null, { display: 'none' }, Ext.hstz.container);
		Ext.hstz.viewport = Ext.hstz.createElement('div', {
				className: 'highslide-viewport highslide-viewport-size'
			}, {
				visibility: (Ext.hstz.safari && Ext.hstz.uaVersion < 525) ? 'visible' : 'hidden'
			}, Ext.hstz.container, 1
		);
		
		// http://www.robertpenner.com/easing/
		Math.linearTween = function (t, b, c, d) {
			return c*t/d + b;
		};
		Math.easeInQuad = function (t, b, c, d) {
			return c*(t/=d)*t + b;
		};
		Math.easeOutQuad = function (t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		};
		
		Ext.hstz.hideSelects = Ext.hstz.ieLt7;
		Ext.hstz.hideIframes = ((window.opera && Ext.hstz.uaVersion < 9) || navigator.vendor == 'KDE' 
			|| (Ext.hstz.ieLt7 && Ext.hstz.uaVersion < 5.5));
	}
},
ready : function() {
	if (Ext.hstz.isReady) return;
	Ext.hstz.isReady = true;
	for (var i = 0; i < Ext.hstz.onReady.length; i++) Ext.hstz.onReady[i]();
},

updateAnchors : function(images) {
	if(images){
		Ext.hstz.anchors = { groups: {"group1":images}, images: images };
	}
	return Ext.hstz.anchors;
	
},

getAnchors : function() {
	return Ext.hstz.anchors || Ext.hstz.updateAnchors();
},


close : function(el) {
	var exp = Ext.hstz.getExpander(el);
	if (exp) exp.close();
	return false;
}
}; // end Ext.hstz object
Ext.hstz.fx = function( elem, options, prop ){
	this.options = options;
	this.elem = elem;
	this.prop = prop;

	if (!options.orig) options.orig = {};
};
Ext.hstz.fx.prototype = {
	update: function(){
		(Ext.hstz.fx.step[this.prop] || Ext.hstz.fx.step._default)(this);
		
		if (this.options.step)
			this.options.step.call(this.elem, this.now, this);

	},
	custom: function(from, to, unit){
		this.startTime = (new Date()).getTime();
		this.start = from;
		this.end = to;
		this.unit = unit;// || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && Ext.hstz.timers.push(t) == 1 ) {
			Ext.hstz.timerId = setInterval(function(){
				var timers = Ext.hstz.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval(Ext.hstz.timerId);
				}
			}, 13);
		
		}
	},
	step: function(gotoEnd){
		var t = (new Date()).getTime();
		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if (this.options.complete) this.options.complete.call(this.elem);
			}
			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;
			this.pos = this.options.easing(n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);
			this.update();
		}
		return true;
	}

};

Ext.hstz.extend( Ext.hstz.fx, {
	step: {

		opacity: function(fx){
			Ext.hstz.setStyles(fx.elem, { opacity: fx.now });
		},

		_default: function(fx){
			try {
				if ( fx.elem.style && fx.elem.style[ fx.prop ] != null )
					fx.elem.style[ fx.prop ] = fx.now + fx.unit;
				else
					fx.elem[ fx.prop ] = fx.now;
			} catch (e) {}
		}
	}
});

Ext.hstz.Outline =  function (outlineType, onLoad) {
	this.onLoad = onLoad;
	this.outlineType = outlineType;
	var v = Ext.hstz.uaVersion, tr;
	
	this.hasAlphaImageLoader = Ext.hstz.ie && Ext.hstz.uaVersion < 7;
	if (!outlineType) {
		if (onLoad) onLoad();
		return;
	}
	
	Ext.hstz.init();
	this.table = Ext.hstz.createElement(
		'table', { 
			cellSpacing: 0 
		}, {
			visibility: 'hidden',
			position: 'absolute',
			borderCollapse: 'collapse',
			width: 0
		},
		Ext.hstz.container,
		true
	);
	var tbody = Ext.hstz.createElement('tbody', null, null, this.table, 1);
	
	this.td = [];
	for (var i = 0; i <= 8; i++) {
		if (i % 3 == 0) tr = Ext.hstz.createElement('tr', null, { height: 'auto' }, tbody, true);
		this.td[i] = Ext.hstz.createElement('td', null, null, tr, true);
		var style = i != 4 ? { lineHeight: 0, fontSize: 0} : { position : 'relative' };
		Ext.hstz.setStyles(this.td[i], style);
	}
	this.td[4].className = outlineType +' highslide-outline';
	
	this.preloadGraphic(); 
};

Ext.hstz.Outline.prototype = {
preloadGraphic : function () {
	var src = Ext.hstz.graphicsDir + (Ext.hstz.outlinesDir || "outlines/")+ this.outlineType +".png";
				
	var appendTo = Ext.hstz.safari && Ext.hstz.uaVersion < 525 ? Ext.hstz.container : null;
	this.graphic = Ext.hstz.createElement('img', null, { position: 'absolute', 
		top: '-9999px' }, appendTo, true); // for onload trigger
	
	var pThis = this;
	this.graphic.onload = function() { pThis.onGraphicLoad(); };
	
	this.graphic.src = src;
},

onGraphicLoad : function () {
	var o = this.offset = this.graphic.width / 4,
		pos = [[0,0],[0,-4],[-2,0],[0,-8],0,[-2,-8],[0,-2],[0,-6],[-2,-2]],
		dim = { height: (2*o) +'px', width: (2*o) +'px' };
	for (var i = 0; i <= 8; i++) {
		if (pos[i]) {
			if (this.hasAlphaImageLoader) {
				var w = (i == 1 || i == 7) ? '100%' : this.graphic.width +'px';
				var div = Ext.hstz.createElement('div', null, { width: '100%', height: '100%', position: 'relative', overflow: 'hidden'}, this.td[i], true);
				Ext.hstz.createElement ('div', null, { 
						filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale, src='"+ this.graphic.src + "')", 
						position: 'absolute',
						width: w, 
						height: this.graphic.height +'px',
						left: (pos[i][0]*o)+'px',
						top: (pos[i][1]*o)+'px'
					}, 
				div,
				true);
			} else {
				var ofp=pos[i][1]*o;
				if(Ext.isIE && i==7){
					ofp++;
				}
				Ext.hstz.setStyles(this.td[i], { background: 'url('+ this.graphic.src +') '+ (pos[i][0]*o)+'px '+(ofp)+'px'});
			}
			
			if (window.opera && (i == 3 || i ==5)) 
				Ext.hstz.createElement('div', null, dim, this.td[i], true);
			
			Ext.hstz.setStyles (this.td[i], dim);
		}
	}
	this.graphic = null;
	if (Ext.hstz.pendingOutlines[this.outlineType]) Ext.hstz.pendingOutlines[this.outlineType].destroy();
	Ext.hstz.pendingOutlines[this.outlineType] = this;
	if (this.onLoad) this.onLoad();
},
	
setPosition : function (pos, offset, vis, dur, easing) {
	var exp = this.exp,
		stl = exp.wrapper.style,
		offset = offset || 0,
		pos = pos || {
			x: exp.x.pos + offset,
			y: exp.y.pos + offset,
			w: exp.x.get('wsize') - 2 * offset,
			h: exp.y.get('wsize') - 2 * offset
		};
	if (vis) this.table.style.visibility = (pos.h >= 4 * this.offset) 
		? 'visible' : 'hidden';
	Ext.hstz.setStyles(this.table, {
		left: (pos.x - this.offset) +'px',
		top: (pos.y - this.offset) +'px',
		width: (pos.w + 2 * this.offset) +'px'
	});
	
	pos.w -= 2 * this.offset;
	pos.h -= 2 * this.offset;
	Ext.hstz.setStyles (this.td[4], {
		width: pos.w >= 0 ? pos.w +'px' : 0,
		height: pos.h >= 0 ? pos.h +'px' : 0
	});
	if (this.hasAlphaImageLoader) this.td[3].style.height 
		= this.td[5].style.height = this.td[4].style.height;	
	
},
	
destroy : function(hide) {
	if (hide) this.table.style.visibility = 'hidden';
	else Ext.hstz.discardElement(this.table);
}
};

Ext.hstz.Dimension = function(exp, dim) {
	this.exp = exp;
	this.dim = dim;
	this.ucwh = dim == 'x' ? 'Width' : 'Height';
	this.wh = this.ucwh.toLowerCase();
	this.uclt = dim == 'x' ? 'Left' : 'Top';
	this.lt = this.uclt.toLowerCase();
	this.ucrb = dim == 'x' ? 'Right' : 'Bottom';
	this.rb = this.ucrb.toLowerCase();
	this.p1 = this.p2 = 0;
};
Ext.hstz.Dimension.prototype = {
get : function(key) {
	switch (key) {
		case 'loadingPos':
			return this.tpos + this.tb + (this.t - Ext.hstz.loading['offset'+ this.ucwh]) / 2;
		case 'loadingPosXfade':
			return this.pos + this.cb+ this.p1 + (this.size - Ext.hstz.loading['offset'+ this.ucwh]) / 2;
		case 'wsize':
			return this.size + 2 * this.cb + this.p1 + this.p2;
		case 'fitsize':
			return this.clientSize - this.marginMin - this.marginMax;
		case 'maxsize':
			return this.get('fitsize') - 2 * this.cb - this.p1 - this.p2 ;
		case 'opos':
			return this.pos - (this.exp.outline ? this.exp.outline.offset : 0);
		case 'osize':
			return this.get('wsize') + (this.exp.outline ? 2*this.exp.outline.offset : 0);
		case 'imgPad':
			return this.imgSize ? Math.round((this.size - this.imgSize) / 2) : 0;
		
	}
},
calcBorders: function() {
	// correct for borders
	this.cb = (this.exp.content['offset'+ this.ucwh] - this.t) / 2;
	
	this.marginMax = Ext.hstz['margin'+ this.ucrb];
},
calcThumb: function() {
	this.t = this.exp.el[this.wh] ? parseInt(this.exp.el[this.wh]) : 
		this.exp.el['offset'+ this.ucwh];
	this.tpos = this.exp.tpos[this.dim];
	this.tb = (this.exp.el['offset'+ this.ucwh] - this.t) / 2;
	if (this.tpos == 0 || this.tpos == -1) {
		this.tpos = (Ext.hstz.page[this.wh] / 2) + Ext.hstz.page['scroll'+ this.uclt];		
	};
},
calcExpanded: function() {
	var exp = this.exp;
	this.justify = 'auto';
	
	// get alignment
	if (exp.align == 'center') this.justify = 'center';
	else if (new RegExp(this.lt).test(exp.anchor)) this.justify = null;
	else if (new RegExp(this.rb).test(exp.anchor)) this.justify = 'max';
	
	
	// size and position
	this.pos = this.tpos - this.cb + this.tb;
	
	if (this.maxHeight && this.dim == 'x')
		exp.maxWidth = Math.min(exp.maxWidth || this.full, exp.maxHeight * this.full / exp.y.full); 
		
	this.size = Math.min(this.full, exp['max'+ this.ucwh] || this.full);
	this.minSize = exp.allowSizeReduction ? 
		Math.min(exp['min'+ this.ucwh], this.full) :this.full;
	if (exp.isImage && exp.useBox)	{
		this.size = exp[this.wh];
		this.imgSize = this.full;
	}
	if (this.dim == 'x' && Ext.hstz.padToMinWidth) this.minSize = exp.minWidth;
	this.target = exp['target'+ this.dim.toUpperCase()];
	this.marginMin = Ext.hstz['margin'+ this.uclt];
	this.scroll = Ext.hstz.page['scroll'+ this.uclt];
	this.clientSize = Ext.hstz.page[this.wh];
},
setSize: function(i) {
	var exp = this.exp;
	if (exp.isImage && (exp.useBox || Ext.hstz.padToMinWidth)) {
		this.imgSize = i;
		this.size = Math.max(this.size, this.imgSize);
		exp.content.style[this.lt] = this.get('imgPad')+'px';
	} else
	this.size = i;
	
	exp.content.style[this.wh] = i +'px';
	exp.wrapper.style[this.wh] = this.get('wsize') +'px';
	if (exp.outline) exp.outline.setPosition();
	if (this.dim == 'x' && exp.overlayBox) exp.sizeOverlayBox(true);
	if (this.dim == 'x' && exp.slideshow && exp.isImage) {
		if (i == this.full) exp.slideshow.disable('full-expand');
		else exp.slideshow.enable('full-expand');
	}
},
setPos: function(i) {
	this.pos = i;
	this.exp.wrapper.style[this.lt] = i +'px';	
	
	if (this.exp.outline) this.exp.outline.setPosition();
	
}
};

Ext.hstz.Expander = function(a, params, custom, contentType) {
	if (document.readyState && Ext.hstz.ie && !Ext.hstz.isReady) {
		Ext.hstz.addEventListener(document, 'ready', function() {
			new Ext.hstz.Expander(a, params, custom, contentType);
		});
		return;
	} 
	this.a = a;
	this.custom = custom;
	this.contentType = contentType || 'image';
	this.isImage = !this.isHtml;
	
	Ext.hstz.continuePreloading = false;
	this.overlays = [];
	this.last = Ext.hstz.last;
	Ext.hstz.last = null;
	Ext.hstz.init();
	var key = this.key = Ext.hstz.expanders.length;
	// override inline parameters
	for (var i = 0; i < Ext.hstz.overrides.length; i++) {
		var name = Ext.hstz.overrides[i];
		this[name] = params && typeof params[name] != 'undefined' ?
			params[name] : Ext.hstz[name];
	}
	if (!this.src) this.src = a.href;
	
	// get thumb
	var el = (params && params.thumbnailId) ? Ext.hstz.$(params.thumbnailId) : a;
	el = this.thumb = el.getElementsByTagName('img')[0] || el;
	this.thumbsUserSetId = el.id || a.id;
	
	// check if already open
	for (var i = 0; i < Ext.hstz.expanders.length; i++) {
		if (Ext.hstz.expanders[i] && Ext.hstz.expanders[i].a == a 
			&& !(this.last && this.transitions[1] == 'crossfade')) {
			Ext.hstz.expanders[i].focus();
			return false;
		}
	}	

	// cancel other
	if (!Ext.hstz.allowSimultaneousLoading) for (var i = 0; i < Ext.hstz.expanders.length; i++) {
		if (Ext.hstz.expanders[i] && Ext.hstz.expanders[i].thumb != el && !Ext.hstz.expanders[i].onLoadStarted) {
			Ext.hstz.expanders[i].cancelLoading();
		}
	}
	Ext.hstz.expanders[key] = this;
	if (!Ext.hstz.allowMultipleInstances && !Ext.hstz.upcoming) {
		if (Ext.hstz.expanders[key-1]) Ext.hstz.expanders[key-1].close();
		if (typeof Ext.hstz.focusKey != 'undefined' && Ext.hstz.expanders[Ext.hstz.focusKey])
			Ext.hstz.expanders[Ext.hstz.focusKey].close();
	}
	
	// initiate metrics
	this.el = el;
	this.tpos = this.pageOrigin || Ext.hstz.getPosition(el);
	Ext.hstz.getPageSize();
	var x = this.x = new Ext.hstz.Dimension(this, 'x');
	x.calcThumb();
	var y = this.y = new Ext.hstz.Dimension(this, 'y');
	y.calcThumb();
	this.wrapper = Ext.hstz.createElement(
		'div', {
			id: 'highslide-wrapper-'+ this.key,
			className: 'highslide-wrapper '+ this.wrapperClassName
		}, {
			visibility: 'hidden',
			position: 'absolute',
			zIndex: Ext.hstz.zIndexCounter += 2
		}, null, true );
	
	this.wrapper.onmouseover = this.wrapper.onmouseout = Ext.hstz.wrapperMouseHandler;
	if (this.contentType == 'image' && this.outlineWhileAnimating == 2)
		this.outlineWhileAnimating = 0;
	// get the outline
	if (!this.outlineType 
		|| (this.last && this.isImage && this.transitions[1] == 'crossfade')) {
		this[this.contentType +'Create']();
	
	} else if (Ext.hstz.pendingOutlines[this.outlineType]) {
		this.connectOutline();
		this[this.contentType +'Create']();
	
	} else {
		this.showLoading();
		var exp = this;
		new Ext.hstz.Outline(this.outlineType, 
			function () {
				exp.connectOutline();
				exp[exp.contentType +'Create']();
			} 
		);
	}
	return true;
};

Ext.hstz.Expander.prototype = {

connectOutline : function() {
	var outline = this.outline = Ext.hstz.pendingOutlines[this.outlineType];
	outline.exp = this;
	outline.table.style.zIndex = this.wrapper.style.zIndex - 1;
	Ext.hstz.pendingOutlines[this.outlineType] = null;
},

showLoading : function() {
	if (this.onLoadStarted || this.loading) return;
	
	this.loading = Ext.hstz.loading;
	var exp = this;
	this.loading.onclick = function() {
		exp.cancelLoading();
	};
	var exp = this, 
		l = this.x.get('loadingPos') +'px',
		t = this.y.get('loadingPos') +'px';
	if (!tgt && this.last && this.transitions[1] == 'crossfade') 
		var tgt = this.last; 
	if (tgt) {
		l = tgt.x.get('loadingPosXfade') +'px';
		t = tgt.y.get('loadingPosXfade') +'px';
		this.loading.style.zIndex = Ext.hstz.zIndexCounter++;
	}
	setTimeout(function () { 
		if (exp.loading) Ext.hstz.setStyles(exp.loading, { left: l, top: t, zIndex: Ext.hstz.zIndexCounter++ })}
	, 100);
},

imageCreate : function() {
	var exp = this;
	
	var img = document.createElement('img');
    this.content = img;
    img.onload = function () {
    	if (Ext.hstz.expanders[exp.key]) exp.contentLoaded(); 
	};
    if (Ext.hstz.blockRightClick) img.oncontextmenu = function() { return false; };
    img.className = 'highslide-image';
    Ext.hstz.setStyles(img, {
    	visibility: 'hidden',
    	display: 'block',
    	position: 'absolute',
		maxWidth: '9999px',
		zIndex: 3
	});
    img.title = Ext.hstz.lang.restoreTitle;
	if (Ext.hstz.safari && Ext.hstz.uaVersion < 525) Ext.hstz.container.appendChild(img);
    if (Ext.hstz.ie && Ext.hstz.flushImgSize) img.src = null;
	img.src = this.src;
	
	this.showLoading();
},

contentLoaded : function() {
	try {	
		if (!this.content) return;
		this.content.onload = null;
		if (this.onLoadStarted) return;
		else this.onLoadStarted = true;
		
		var x = this.x, y = this.y;
		
		if (this.loading) {
			Ext.hstz.setStyles(this.loading, { top: '-9999px' });
			this.loading = null;
		}	
			x.full = this.content.width;
			y.full = this.content.height;
			
			Ext.hstz.setStyles(this.content, {
				width: x.t +'px',
				height: y.t +'px'
			});
			this.wrapper.appendChild(this.content);
			Ext.hstz.container.appendChild(this.wrapper);
		
		x.calcBorders();
		y.calcBorders();
		
		Ext.hstz.setStyles (this.wrapper, {
			left: (x.tpos + x.tb - x.cb) +'px',
			top: (y.tpos + x.tb - y.cb) +'px'
		});
		
		
		this.initSlideshow();
		this.getOverlays();
		
		var ratio = x.full / y.full;
		x.calcExpanded();
		this.justify(x);
		
		y.calcExpanded();
		this.justify(y);
		if (this.overlayBox) this.sizeOverlayBox(0, 1);

		
		if (this.allowSizeReduction) {
				this.correctRatio(ratio);
			var ss = this.slideshow;			
			if (ss && this.last && ss.controls && ss.fixedControls) {
				var pos = ss.overlayOptions.position || '', p;
				for (var dim in Ext.hstz.oPos) for (var i = 0; i < 5; i++) {
					p = this[dim];
					if (pos.match(Ext.hstz.oPos[dim][i])) {
						p.pos = this.last[dim].pos 
							+ (this.last[dim].p1 - p.p1)
							+ (this.last[dim].size - p.size) * [0, 0, .5, 1, 1][i];
						if (ss.fixedControls == 'fit') {
							if (p.pos + p.size + p.p1 + p.p2 > p.scroll + p.clientSize - p.marginMax)
								p.pos = p.scroll + p.clientSize - p.size - p.marginMin - p.marginMax - p.p1 - p.p2;
							if (p.pos < p.scroll + p.marginMin) p.pos = p.scroll + p.marginMin; 
						} 
					}
				}
			}
			if (this.isImage && this.x.full > (this.x.imgSize || this.x.size)) {
				this.createFullExpand();
				if (this.overlays.length == 1) this.sizeOverlayBox();
			}
		}
		this.show();
		
	} catch (e) {
		lg(e)
	}
},

justify : function (p, moveOnly) {
	var tgtArr, tgt = p.target, dim = p == this.x ? 'x' : 'y';
	
	if (tgt && tgt.match(/ /)) {
		tgtArr = tgt.split(' ');
		tgt = tgtArr[0];
	}
	if (tgt && Ext.hstz.$(tgt)) {
		p.pos = Ext.hstz.getPosition(Ext.hstz.$(tgt))[dim];
		if (tgtArr && tgtArr[1] && tgtArr[1].match(/^[-]?[0-9]+px$/)) 
			p.pos += parseInt(tgtArr[1]);
		if (p.size < p.minSize) p.size = p.minSize;
		
	} else if (p.justify == 'auto' || p.justify == 'center') {
	
		var hasMovedMin = false;
		
		var allowReduce = p.exp.allowSizeReduction;
		if (p.justify == 'center')
			p.pos = Math.round(p.scroll + (p.clientSize + p.marginMin - p.marginMax - p.get('wsize')) / 2);
		else
			p.pos = Math.round(p.pos - ((p.get('wsize') - p.t) / 2));
		if (p.pos < p.scroll + p.marginMin) {
			p.pos = p.scroll + p.marginMin;
			hasMovedMin = true;		
		}
		if (!moveOnly && p.size < p.minSize) {
			p.size = p.minSize;
			allowReduce = false;
		}
		if (p.pos + p.get('wsize') > p.scroll + p.clientSize - p.marginMax) {
			if (!moveOnly && hasMovedMin && allowReduce) {
				p.size = Math.min(p.size, p.get(dim == 'y' ? 'fitsize' : 'maxsize'));
			} else if (p.get('wsize') < p.get('fitsize')) {
				p.pos = p.scroll + p.clientSize - p.marginMax - p.get('wsize');
			} else { // image larger than viewport
				p.pos = p.scroll + p.marginMin;
				if (!moveOnly && allowReduce) p.size = p.get(dim == 'y' ? 'fitsize' : 'maxsize');
			}			
		}
		
		if (!moveOnly && p.size < p.minSize) {
			p.size = p.minSize;
			allowReduce = false;
		}
		
	
	} else if (p.justify == 'max') {
		p.pos = Math.floor(p.pos - p.size + p.t);
	}
	
		
	if (p.pos < p.marginMin) {
		var tmpMin = p.pos;
		p.pos = p.marginMin; 
		
		if (allowReduce && !moveOnly) p.size = p.size - (p.pos - tmpMin);
		
	}
},

correctRatio : function(ratio) {
	var x = this.x, 
		y = this.y,
		changed = false,
		xSize = Math.min(x.full, x.size),
		ySize = Math.min(y.full, y.size),
		useBox = (this.useBox || Ext.hstz.padToMinWidth);
	
	if (xSize / ySize > ratio) { // width greater
		xSize = ySize * ratio;
		if (xSize < x.minSize) { // below minWidth
			xSize = x.minSize;
			ySize = xSize / ratio;
		}
		changed = true;
	
	} else if (xSize / ySize < ratio) { // height greater
		ySize = xSize / ratio;
		changed = true;
	}
	
	if (Ext.hstz.padToMinWidth && x.full < x.minSize) {
		x.imgSize = x.full;
		y.size = y.imgSize = y.full;
	} else if (this.useBox) {
		x.imgSize = xSize;
		y.imgSize = ySize;
	} else {
		x.size = xSize;
		y.size = ySize;
	}
	changed = this.fitOverlayBox(this.useBox ? null : ratio, changed);
	if (useBox && y.size < y.imgSize) {
		y.imgSize = y.size;
		x.imgSize = y.size * ratio;
	}
	if (changed || useBox) {
		x.pos = x.tpos - x.cb + x.tb;
		x.minSize = x.size;
		this.justify(x, true);
	
		y.pos = y.tpos - y.cb + y.tb;
		y.minSize = y.size;
		this.justify(y, true);
		if (this.overlayBox) this.sizeOverlayBox();
	}
	
	
},
fitOverlayBox : function(ratio, changed) {
	var x = this.x, y = this.y;
	if (this.overlayBox) {
		while (y.size > this.minHeight && x.size > this.minWidth 
				&&  y.get('wsize') > y.get('fitsize')) {
			y.size -= 10;
			if (ratio) x.size = y.size * ratio;
			this.sizeOverlayBox(0, 1);
			changed = true;
		}
	}
	return changed;
},

show : function () {
	var x = this.x, y = this.y;
	this.doShowHide('hidden');
	if (this.slideshow && this.slideshow.thumbstrip) this.slideshow.thumbstrip.selectThumb();
	
	// Apply size change
	this.changeSize(
		1, {
			wrapper: {
				width : x.get('wsize'),
				height : y.get('wsize'),
				left: x.pos,
				top: y.pos
			},
			content: {
				left: x.p1 + x.get('imgPad'),
				top: y.p1 + y.get('imgPad'),
				width:x.imgSize ||x.size,
				height:y.imgSize ||y.size
			}
		},
		Ext.hstz.expandDuration
	);
},

changeSize : function(up, to, dur) {
	// transition
	var trans = this.transitions,
	other = up ? (this.last ? this.last.a : null) : Ext.hstz.upcoming,
	t = (trans[1] && other 
			&& Ext.hstz.getParam(other, 'transitions')[1] == trans[1]) ?
		trans[1] : trans[0];
		
	if (this[t] && t != 'expand') {
		this[t](up, to);
		return;
	}
	
	if (this.outline && !this.outlineWhileAnimating) {
		if (up) this.outline.setPosition();
		else this.outline.destroy();
	}
	
	
	if (!up) this.destroyOverlays();
	
	var exp = this,
		x = exp.x,
		y = exp.y,
		easing = this.easing;
	if (!up) easing = this.easingClose || easing;
	var after = up ?
		function() {
				
			if (exp.outline) exp.outline.table.style.visibility = "visible";
			setTimeout(function() {
				exp.afterExpand();
			}, 50);
		} :
		function() {
			exp.afterClose();
		};
	if (up) Ext.hstz.setStyles( this.wrapper, {
		width: x.t +'px',
		height: y.t +'px'
	});
	if (this.fadeInOut) {
		Ext.hstz.setStyles(this.wrapper, { opacity: up ? 0 : 1 });
		Ext.hstz.extend(to.wrapper, { opacity: up });
	}
	Ext.hstz.animate( this.wrapper, to.wrapper, {
		duration: dur,
		easing: easing,
		step: function(val, args) {
			if (exp.outline && exp.outlineWhileAnimating && args.prop == 'top') {
				var fac = up ? args.pos : 1 - args.pos;
				var pos = {
					w: x.t + (x.get('wsize') - x.t) * fac,
					h: y.t + (y.get('wsize') - y.t) * fac,
					x: x.tpos + (x.pos - x.tpos) * fac,
					y: y.tpos + (y.pos - y.tpos) * fac
				};
				exp.outline.setPosition(pos, 0, 1);				
			}
		}
	});
	Ext.hstz.animate( this.content, to.content, dur, easing, after);
	if (up) {
		this.wrapper.style.visibility = 'visible';
		this.content.style.visibility = 'visible';
		this.a.className += ' highslide-active-anchor';
	}
},



fade : function(up, to) {
	this.outlineWhileAnimating = false;
	var exp = this,	t = up ? Ext.hstz.expandDuration : 0;
	
	if (up) {
		Ext.hstz.animate(this.wrapper, to.wrapper, 0);
		Ext.hstz.setStyles(this.wrapper, { opacity: 0, visibility: 'visible' });
		Ext.hstz.animate(this.content, to.content, 0);
		this.content.style.visibility = 'visible';

		Ext.hstz.animate(this.wrapper, { opacity: 1 }, t, null, 
			function() { exp.afterExpand(); });
	}
	
	if (this.outline) {
		this.outline.table.style.zIndex = this.wrapper.style.zIndex;
		var dir = up || -1, 
			offset = this.outline.offset,
			startOff = up ? 3 : offset,
			endOff = up? offset : 3;
		for (var i = startOff; dir * i <= dir * endOff; i += dir, t += 25) {
			(function() {
				var o = up ? endOff - i : startOff - i;
				setTimeout(function() {
					exp.outline.setPosition(0, o, 1);
				}, t);
			})();
		}
	}
	
	
	if (up) {}// setTimeout(function() { exp.afterExpand(); }, t+50);
	else {
		setTimeout( function() {
			if (exp.outline) exp.outline.destroy(exp.preserveContent);
			
			exp.destroyOverlays();
	
			Ext.hstz.animate( exp.wrapper, { opacity: 0 }, Ext.hstz.restoreDuration, null, function(){
				exp.afterClose();
			});
		}, t);		
	}
},
crossfade : function (up, to, from) {
	if (!up) return;
	var exp = this, 
		last = this.last,
		x = this.x,
		y = this.y,
		lastX = last.x,
		lastY = last.y,
		wrapper = this.wrapper,
		content = this.content,
		overlayBox = this.overlayBox;
	Ext.hstz.removeEventListener(document, 'mousemove', Ext.hstz.dragHandler);
	
	Ext.hstz.setStyles(content, { 
		width: (x.imgSize || x.size) +'px', 
		height: (y.imgSize || y.size) +'px'		
	});
	if (overlayBox) overlayBox.style.overflow = 'visible';
	this.outline = last.outline;
	if (this.outline) this.outline.exp = exp;
	last.outline = null;
	var fadeBox = Ext.hstz.createElement('div', {
			className: 'highslide-'+ this.contentType
		}, { 
			position: 'absolute', 
			zIndex: 4,
			overflow: 'hidden',
			display: 'none'
		}
	);
	var names = { oldImg: last, newImg: this };
	for (var n in names) { 	
		this[n] = names[n].content.cloneNode(1);
		Ext.hstz.setStyles(this[n], {
			position: 'absolute',
			border: 0,
			visibility: 'visible'
		});
		fadeBox.appendChild(this[n]);
	}
	wrapper.appendChild(fadeBox);
	if (overlayBox) {
		overlayBox.className = '';
		wrapper.appendChild(overlayBox);
	}
	fadeBox.style.display = '';
	last.content.style.display = 'none';
	
	
	if (Ext.hstz.safari && Ext.hstz.uaVersion < 525) {
		this.wrapper.style.visibility = 'visible';
	}
	Ext.hstz.animate(wrapper, {
		width: x.size
	}, {
		duration: Ext.hstz.transitionDuration, 
		step: function(val, args) {
			var pos = args.pos,
				invPos = 1 - pos;
			var prop,
				size = {}, 
				props = ['pos', 'size', 'p1', 'p2'];
			for (var n in props) {
				prop = props[n];
				size['x'+ prop] = Math.round(invPos * lastX[prop] + pos * x[prop]);
				size['y'+ prop] = Math.round(invPos * lastY[prop] + pos * y[prop]);
				size.ximgSize = Math.round(
					invPos * (lastX.imgSize || lastX.size) + pos * (x.imgSize || x.size));
				size.ximgPad = Math.round(invPos * lastX.get('imgPad') + pos * x.get('imgPad'));
				size.yimgSize = Math.round(
					invPos * (lastY.imgSize || lastY.size) + pos * (y.imgSize || y.size));
				size.yimgPad = Math.round(invPos * lastY.get('imgPad') + pos * y.get('imgPad'));
			}
			if (exp.outline) exp.outline.setPosition({ 
				x: size.xpos, 
				y: size.ypos, 
				w: size.xsize + size.xp1 + size.xp2 + 2 * x.cb, 
				h: size.ysize + size.yp1 + size.yp2 + 2 * y.cb
			});
			last.wrapper.style.clip = 'rect('
				+ (size.ypos - lastY.pos)+'px, '
				+ (size.xsize + size.xp1 + size.xp2 + size.xpos + 2 * lastX.cb - lastX.pos) +'px, '
				+ (size.ysize + size.yp1 + size.yp2 + size.ypos + 2 * lastY.cb - lastY.pos) +'px, '
				+ (size.xpos - lastX.pos)+'px)';
				
			Ext.hstz.setStyles(content, {
				top: (size.yp1 + y.get('imgPad')) +'px',
				left: (size.xp1 + x.get('imgPad')) +'px',
				marginTop: (y.pos - size.ypos) +'px',
				marginLeft: (x.pos - size.xpos) +'px'
			});
			Ext.hstz.setStyles(wrapper, {
				top: size.ypos +'px',
				left: size.xpos +'px',
				width: (size.xp1 + size.xp2 + size.xsize + 2 * x.cb)+ 'px',
				height: (size.yp1 + size.yp2 + size.ysize + 2 * y.cb) + 'px'
			});
			Ext.hstz.setStyles(fadeBox, {
				width: (size.ximgSize || size.xsize) + 'px',
				height: (size.yimgSize || size.ysize) +'px',
				left: (size.xp1 + size.ximgPad)  +'px',
				top: (size.yp1 + size.yimgPad) +'px',
				visibility: 'visible'
			});
			
			Ext.hstz.setStyles(exp.oldImg, {
				top: (lastY.pos - size.ypos + lastY.p1 - size.yp1 + lastY.get('imgPad') - size.yimgPad)+'px',
				left: (lastX.pos - size.xpos + lastX.p1 - size.xp1 + lastX.get('imgPad') - size.ximgPad)+'px'
			});		
			
			Ext.hstz.setStyles(exp.newImg, {
				opacity: pos,
				top: (y.pos - size.ypos + y.p1 - size.yp1 + y.get('imgPad') - size.yimgPad) +'px',
				left: (x.pos - size.xpos + x.p1 - size.xp1 + x.get('imgPad') - size.ximgPad) +'px'
			});
			if (overlayBox) Ext.hstz.setStyles(overlayBox, {
				width: size.xsize + 'px',
				height: size.ysize +'px',
				left: (size.xp1 + x.cb)  +'px',
				top: (size.yp1 + y.cb) +'px'
			});
		},
		complete: function () {
			wrapper.style.visibility = content.style.visibility = 'visible';
			content.style.display = 'block';
			Ext.hstz.discardElement(fadeBox);
			exp.afterExpand();
			last.afterClose();
			exp.last = null;
		}
		
	});
},
reuseOverlay : function(o, el) {
	if (!this.last) return false;
	for (var i = 0; i < this.last.overlays.length; i++) {
		var oDiv = Ext.hstz.$('hsId'+ this.last.overlays[i]);
		if (oDiv && oDiv.hsId == o.hsId) {
			this.genOverlayBox();
			oDiv.reuse = this.key;
			Ext.hstz.push(this.overlays, this.last.overlays[i]);
			return true;
		}
	}
	return false;
},


afterExpand : function() {
	this.isExpanded = true;	
	this.focus();
	if (this.dimmingOpacity) Ext.hstz.dim(this);
	if (Ext.hstz.upcoming && Ext.hstz.upcoming.src == this.a.src) Ext.hstz.upcoming = null;
	this.prepareNextOutline();
	var p = Ext.hstz.page, mX = Ext.hstz.mouse.x + p.scrollLeft, mY = Ext.hstz.mouse.y + p.scrollTop;
	this.mouseIsOver = this.x.pos < mX && mX < this.x.pos + this.x.get('wsize')
		&& this.y.pos < mY && mY < this.y.pos + this.y.get('wsize');	
	if (this.overlayBox) this.showOverlays();
	
},


prepareNextOutline : function() {
	var key = this.key;
	var outlineType = this.outlineType;
	new Ext.hstz.Outline(outlineType, 
		function () { try { Ext.hstz.expanders[key].preloadNext(); } catch (e) {} });
},


preloadNext : function() {
	var next = this.getAdjacentAnchor(1);
	if (next && next.onclick.toString().match(/Ext.hstz\.expand/)) 
		var img = Ext.hstz.createElement('img', { src: Ext.hstz.getSrc(next) });
},


getAdjacentAnchor : function(op) {
	var current = this.getAnchorIndex(), as = Ext.hstz.anchors.groups[this.slideshowGroup || 'none'];
	if (as && !as[current + op] && this.slideshow && this.slideshow.repeat) {
		if (op == 1) return as[0];
		else if (op == -1) return as[as.length-1];
	}
	return (as && as[current + op]) || null;
},

getAnchorIndex : function() {
	var arr = Ext.hstz.getAnchors().groups[this.slideshowGroup || 'none'];
	if (arr) for (var i = 0; i < arr.length; i++) {
		if (arr[i].src == this.a.src) return i; 
	}
	return null;
},


getNumber : function() {
	if (this[this.numberPosition]) {
		var arr = Ext.hstz.anchors.groups[this.slideshowGroup || 'none'];
		if (arr) {
			var s = Ext.hstz.lang.number.replace('%1', this.getAnchorIndex() + 1).replace('%2', arr.length);
			this[this.numberPosition].innerHTML = 
				'<div class="highslide-number">'+ s +'</div>'+ this[this.numberPosition].innerHTML;
		}
	}
},
initSlideshow : function() {
	if (!this.last) {
		for (var i = 0; i < Ext.hstz.slideshows.length; i++) {
			var ss = Ext.hstz.slideshows[i], sg = ss.slideshowGroup;
			if (typeof sg == 'undefined' || sg === null || sg === this.slideshowGroup) 
				this.slideshow = new Ext.hstz.Slideshow(this.key, ss);
		} 
	} else {
		this.slideshow = this.last.slideshow;
	}
	var ss = this.slideshow;
	if (!ss) return;
	var key = ss.expKey = this.key;
	
	ss.checkFirstAndLast();
	ss.disable('full-expand');
	if (ss.controls) {
		this.createOverlay(Ext.hstz.extend(ss.overlayOptions || {}, {
			overlayId: ss.controls,
			hsId: 'controls',
			zIndex: 5
		}));
	}
	if (ss.thumbstrip) ss.thumbstrip.add(this);
	if (!this.last && this.autoplay) ss.play(true);
	if (ss.autoplay) {
		ss.autoplay = setTimeout(function() {
			Ext.hstz.next(key);
		}, (ss.interval || 500));
	}
},

cancelLoading : function() {
	Ext.hstz.discardElement (this.wrapper);
	Ext.hstz.expanders[this.key] = null;
	if (Ext.hstz.upcoming.src == this.a.src) Ext.hstz.upcoming = null;
	Ext.hstz.undim(this.key);
	if (this.loading) Ext.hstz.loading.style.left = '-9999px';
},


getInline : function(types, addOverlay) {
	for (var i = 0; i < types.length; i++) {
		var type = types[i], s = null;
		if (!this[type +'Id'] && this.thumbsUserSetId)  
			this[type +'Id'] = type +'-for-'+ this.thumbsUserSetId;
		if (this[type +'Id']) this[type] = Ext.hstz.getNode(this[type +'Id']);
		if (!this[type] && !this[type +'Text'] && this[type +'Eval']) try {
			s = eval(this[type +'Eval']);
		} catch (e) {}
		if (!this[type] && this[type +'Text']) {
			s = this[type +'Text'];
		}
		if (!this[type] && !s) {
			this[type] = Ext.hstz.getNode(this.a['_'+ type + 'Id']);
			if (!this[type]) {
				var next = this.a.nextSibling;
				while (next && !Ext.hstz.isHsAnchor(next)) {
					if ((new RegExp('highslide-'+ type)).test(next.className || null)) {
						if (!next.id) this.a['_'+ type + 'Id'] = next.id = 'hsId'+ Ext.hstz.idCounter++;
						this[type] = Ext.hstz.getNode(next.id);
						break;
					}
					next = next.nextSibling;
				}
			}
		}
		if (!this[type] && !s && this.numberPosition == type) s = '\n';
		
		if (!this[type] && s) this[type] = Ext.hstz.createElement('div', 
				{ className: 'highslide-'+ type, innerHTML: s } );
		
		if (addOverlay && this[type]) {
			var o = { position: (type == 'heading') ? 'above' : 'below' };
			for (var x in this[type+'Overlay']) o[x] = this[type+'Overlay'][x];
			o.overlayId = this[type];
			this.createOverlay(o);
		}
	}
},


// on end move and resize
doShowHide : function(visibility) {
	if (Ext.hstz.hideSelects) this.showHideElements('SELECT', visibility);
	if (Ext.hstz.hideIframes) this.showHideElements('IFRAME', visibility);
	if (Ext.hstz.geckoMac) this.showHideElements('*', visibility);
},
showHideElements : function (tagName, visibility) {
	var els = document.getElementsByTagName(tagName);
	var prop = tagName == '*' ? 'overflow' : 'visibility';
	for (var i = 0; i < els.length; i++) {
		if (prop == 'visibility' || (document.defaultView.getComputedStyle(
				els[i], "").getPropertyValue('overflow') == 'auto'
				|| els[i].getAttribute('hidden-by') != null)) {
			var hiddenBy = els[i].getAttribute('hidden-by');
			if (visibility == 'visible' && hiddenBy) {
				hiddenBy = hiddenBy.replace('['+ this.key +']', '');
				els[i].setAttribute('hidden-by', hiddenBy);
				if (!hiddenBy) els[i].style[prop] = els[i].origProp;
			} else if (visibility == 'hidden') { // hide if behind
				var elPos = Ext.hstz.getPosition(els[i]);
				elPos.w = els[i].offsetWidth;
				elPos.h = els[i].offsetHeight;
				if (!this.dimmingOpacity) { // hide all if dimming
				
					var clearsX = (elPos.x + elPos.w < this.x.get('opos') 
						|| elPos.x > this.x.get('opos') + this.x.get('osize'));
					var clearsY = (elPos.y + elPos.h < this.y.get('opos') 
						|| elPos.y > this.y.get('opos') + this.y.get('osize'));
				}
				var wrapperKey = Ext.hstz.getWrapperKey(els[i]);
				if (!clearsX && !clearsY && wrapperKey != this.key) { // element
																		// falls
																		// behind
																		// image
					if (!hiddenBy) {
						els[i].setAttribute('hidden-by', '['+ this.key +']');
						els[i].origProp = els[i].style[prop];
						els[i].style[prop] = 'hidden';
						
					} else if (hiddenBy.indexOf('['+ this.key +']') == -1) {
						els[i].setAttribute('hidden-by', hiddenBy + '['+ this.key +']');
					}
				} else if ((hiddenBy == '['+ this.key +']' || Ext.hstz.focusKey == wrapperKey)
						&& wrapperKey != this.key) { // on move
					els[i].setAttribute('hidden-by', '');
					els[i].style[prop] = els[i].origProp || '';
				} else if (hiddenBy && hiddenBy.indexOf('['+ this.key +']') > -1) {
					els[i].setAttribute('hidden-by', hiddenBy.replace('['+ this.key +']', ''));
				}
						
			}
		}
	}
},

focus : function() {
	this.wrapper.style.zIndex = Ext.hstz.zIndexCounter += 2;
	// blur others
	for (var i = 0; i < Ext.hstz.expanders.length; i++) {
		if (Ext.hstz.expanders[i] && i == Ext.hstz.focusKey) {
			var blurExp = Ext.hstz.expanders[i];
			blurExp.content.className += ' highslide-'+ blurExp.contentType +'-blur';
				blurExp.content.style.cursor = Ext.hstz.ieLt7 ? 'hand' : 'pointer';
				blurExp.content.title = Ext.hstz.lang.focusTitle;
		}
	}
	
	// focus this
	if (this.outline) this.outline.table.style.zIndex 
		= this.wrapper.style.zIndex - 1;
	this.content.className = 'highslide-'+ this.contentType;
		this.content.title = Ext.hstz.lang.restoreTitle;
		
		if (Ext.hstz.restoreCursor) {
			Ext.hstz.styleRestoreCursor = window.opera ? 'pointer' : 'url('+ Ext.hstz.graphicsDir + Ext.hstz.restoreCursor +'), pointer';
			if (Ext.hstz.ieLt7 && Ext.hstz.uaVersion < 6) Ext.hstz.styleRestoreCursor = 'hand';
			this.content.style.cursor = Ext.hstz.styleRestoreCursor;
		}
		
	Ext.hstz.focusKey = this.key;	
	Ext.hstz.addEventListener(document, window.opera ? 'keypress' : 'keydown', Ext.hstz.keyHandler);	
},
moveTo: function(x, y) {
	this.x.setPos(x);
	this.y.setPos(y);
},
resize : function (e) {
	var w, h, r = e.width / e.height;
	w = Math.max(e.width + e.dX, Math.min(this.minWidth, this.x.full));
	if (this.isImage && Math.abs(w - this.x.full) < 12) w = this.x.full;
	h = w / r;
	if (h < Math.min(this.minHeight, this.y.full)) {
		h = Math.min(this.minHeight, this.y.full);
		if (this.isImage) w = h * r;
	}
	this.resizeTo(w, h);
},
resizeTo: function(w, h) {
	this.y.setSize(h);
	this.x.setSize(w);
	this.wrapper.style.height = this.y.get('wsize') +'px';
},

close : function() {
	if (this.isClosing || !this.isExpanded) return;
	if (this.transitions[1] == 'crossfade' && Ext.hstz.upcoming) {
		var exp=Ext.hstz.getExpander(Ext.hstz.upcoming);
		exp &&exp.cancelLoading();
		Ext.hstz.upcoming = null;
	}
	this.isClosing = true;
	if (this.slideshow && !Ext.hstz.upcoming) this.slideshow.pause();
	
	Ext.hstz.removeEventListener(document, window.opera ? 'keypress' : 'keydown', Ext.hstz.keyHandler);
	
	try {
		this.content.style.cursor = 'default';
		this.changeSize(
			0, {
				wrapper: {
					width : this.x.t,
					height : this.y.t,
					left: this.x.tpos - this.x.cb + this.x.tb,
					top: this.y.tpos - this.y.cb + this.y.tb
				},
				content: {
					left: 0,
					top: 0,
					width: this.x.t,
					height: this.y.t
				}
			}, Ext.hstz.restoreDuration
		);
	} catch (e) { this.afterClose(); }
},

createOverlay : function (o) {
	var el = o.overlayId, 
		relToVP = (o.relativeTo == 'viewport' && !/panel$/.test(o.position));
	if (typeof el == 'string') el = Ext.hstz.getNode(el);
	if (o.html) el = Ext.hstz.createElement('div', { innerHTML: o.html });
	if (!el || typeof el == 'string') return;
	el.style.display = 'block';
	o.hsId = o.hsId || o.overlayId; 
	if (this.transitions[1] == 'crossfade' && this.reuseOverlay(o, el)) return;
	this.genOverlayBox();
	var width = o.width && /^[0-9]+(px|%)$/.test(o.width) ? o.width : 'auto';
	if (/^(left|right)panel$/.test(o.position) && !/^[0-9]+px$/.test(o.width)) width = '200px';
	var overlay = Ext.hstz.createElement(
		'div', {
			id: 'hsId'+ Ext.hstz.idCounter++,
			hsId: o.hsId
		}, {
			position: 'absolute',
			visibility: 'hidden',
			width: width,
			direction: Ext.hstz.lang.cssDirection || '',
			opacity: 0
		},
		relToVP ? Ext.hstz.viewport :this.overlayBox,
		true
	);
	if (relToVP) overlay.hsKey = this.key;
	
	overlay.appendChild(el);
	Ext.hstz.extend(overlay, {
		opacity: 1,
		offsetX: 0,
		offsetY: 0,
		dur: (o.fade === 0 || o.fade === false || (o.fade == 2 && Ext.hstz.ie)) ? 0 : 250
	});
	Ext.hstz.extend(overlay, o);
	
		
	if (this.gotOverlays) {
		this.positionOverlay(overlay);
		if (!overlay.hideOnMouseOut || this.mouseIsOver) 
			Ext.hstz.animate(overlay, { opacity: overlay.opacity }, overlay.dur);
	}
	Ext.hstz.push(this.overlays, Ext.hstz.idCounter - 1);
},
positionOverlay : function(overlay) {
	var p = overlay.position || 'middle center',
		relToVP = (overlay.relativeTo == 'viewport'),
		offX = overlay.offsetX,
		offY = overlay.offsetY;
	if (relToVP) {
		Ext.hstz.viewport.style.display = 'block';
		overlay.hsKey = this.key;
		if (overlay.offsetWidth > overlay.parentNode.offsetWidth)
			overlay.style.width = '100%';
	} else
	if (overlay.parentNode != this.overlayBox) this.overlayBox.appendChild(overlay);
	if (/left$/.test(p)) overlay.style.left = offX +'px'; 

	if (/center$/.test(p))	{	
		if(Ext.isIE && overlay.className.indexOf("highslide-thumbstrip-horizontal-overlay")!=-1){
			var el=Ext.fly(overlay).child("TABLE");
			left=offX - Math.round(el.getWidth() / 2);
		}else{
			left=offX - Math.round(overlay.offsetWidth / 2)
		}
		Ext.hstz.setStyles (overlay, { 
			left: '50%',
			marginLeft: left +'px'
		});	
	}
	
	if (/right$/.test(p)) overlay.style.right = - offX +'px';
		
	if (/^leftpanel$/.test(p)) { 
		Ext.hstz.setStyles(overlay, {
			right: '100%',
			marginRight: this.x.cb +'px',
			top: - this.y.cb +'px',
			bottom: - this.y.cb +'px',
			overflow: 'auto'
		});		 
		this.x.p1 = overlay.offsetWidth;
	
	} else if (/^rightpanel$/.test(p)) {
		Ext.hstz.setStyles(overlay, {
			left: '100%',
			marginLeft: this.x.cb +'px',
			top: - this.y.cb +'px',
			bottom: - this.y.cb +'px',
			overflow: 'auto'
		});
		this.x.p2 = overlay.offsetWidth;
	}
	var parOff = overlay.parentNode.offsetHeight;
	overlay.style.height = 'auto';
	if (relToVP && overlay.offsetHeight > parOff)
		overlay.style.height = Ext.hstz.ieLt7 ? parOff +'px' : '100%';

	if (/^top/.test(p)) overlay.style.top = offY +'px'; 
	if (/^middle/.test(p))	Ext.hstz.setStyles (overlay, { 
		top: '50%', 
		marginTop: (offY - Math.round(overlay.offsetHeight / 2)) +'px'
	});	
	if (/^bottom/.test(p)) overlay.style.bottom = - offY +'px';
	if (/^above$/.test(p)) {
		Ext.hstz.setStyles(overlay, {
			left: (- this.x.p1 - this.x.cb) +'px',
			right: (- this.x.p2 - this.x.cb) +'px',
			bottom: '100%',
			marginBottom: this.y.cb +'px',
			width: 'auto'
		});
		this.y.p1 = overlay.offsetHeight;
	
	} else if (/^below$/.test(p)) {
		Ext.hstz.setStyles(overlay, {
			position: 'relative',
			left: (- this.x.p1 - this.x.cb) +'px',
			right: (- this.x.p2 - this.x.cb) +'px',
			top: '100%',
			marginTop: this.y.cb +'px',
			width: 'auto'
		});
		this.y.p2 = overlay.offsetHeight;
		overlay.style.position = 'absolute';
	}
},

getOverlays : function() {	
	this.getInline(['heading', 'caption'], true);
	this.getNumber();
	if (this.heading && this.dragByHeading) this.heading.className += ' highslide-move';
	for (var i = 0; i < Ext.hstz.overlays.length; i++) {
		var o = Ext.hstz.overlays[i], tId = o.thumbnailId, sg = o.slideshowGroup;
		if ((!tId && !sg) || (tId && tId == this.thumbsUserSetId)
				|| (sg && sg === this.slideshowGroup)) {
			this.createOverlay(o);
		}
	}
	var os = [];
	for (var i = 0; i < this.overlays.length; i++) {
		var o = Ext.hstz.$('hsId'+ this.overlays[i]);
		if (/panel$/.test(o.position)) this.positionOverlay(o);
		else Ext.hstz.push(os, o);
	}
	for (var i = 0; i < os.length; i++) this.positionOverlay(os[i]);
	this.gotOverlays = true;
},
genOverlayBox : function() {
	if (!this.overlayBox) this.overlayBox = Ext.hstz.createElement (
		'div', {
			className: this.wrapperClassName
		}, {
			position : 'absolute',
			width: (this.x.size || (this.useBox ? this.width : null) 
				|| this.x.full) +'px',
			height: (this.y.size || this.y.full) +'px',
			visibility : 'hidden',
			overflow : 'hidden',
			zIndex : Ext.hstz.ie ? 4 : 'auto'
		},
		Ext.hstz.container,
		true
	);
},
sizeOverlayBox : function(doWrapper, doPanels) {
	var overlayBox = this.overlayBox, 
		x = this.x,
		y = this.y;
	Ext.hstz.setStyles( overlayBox, {
		width: x.size +'px', 
		height: y.size +'px'
	});
	if (doWrapper || doPanels) {
		for (var i = 0; i < this.overlays.length; i++) {
			var o = Ext.hstz.$('hsId'+ this.overlays[i]);
			var ie6 = (Ext.hstz.ieLt7 || document.compatMode == 'BackCompat');
			if (o && /^(above|below)$/.test(o.position)) {
				if (ie6) {
					o.style.width = (overlayBox.offsetWidth + 2 * x.cb
						+ x.p1 + x.p2) +'px';
				}
				y[o.position == 'above' ? 'p1' : 'p2'] = o.offsetHeight;
			}
			if (o && ie6 && /^(left|right)panel$/.test(o.position)) {
				o.style.height = (overlayBox.offsetHeight + 2* y.cb) +'px';
			}
		}
	}
	if (doWrapper) {
		Ext.hstz.setStyles(this.content, {
			top: y.p1 +'px'
		});
		Ext.hstz.setStyles(overlayBox, {
			top: (y.p1 + y.cb) +'px'
		});
	}
},

showOverlays : function() {
	var b = this.overlayBox;
	b.className = '';
	Ext.hstz.setStyles(b, {
		top: (this.y.p1 + this.y.cb) +'px',
		left: (this.x.p1 + this.x.cb) +'px',
		overflow : 'visible'
	});
	if (Ext.hstz.safari) b.style.visibility = 'visible';
	this.wrapper.appendChild (b);
	for (var i = 0; i < this.overlays.length; i++) {
		var o = Ext.hstz.$('hsId'+ this.overlays[i]);
		o.style.zIndex = o.zIndex || 4;
		if (!o.hideOnMouseOut || this.mouseIsOver) {
			o.style.visibility = 'visible';
			Ext.hstz.setStyles(o, { visibility: 'visible', display: '' });
			Ext.hstz.animate(o, { opacity: o.opacity }, o.dur);
		}
	}
},

destroyOverlays : function() {
	if (!this.overlays.length) return;
	if (this.slideshow) {
		var c = this.slideshow.controls;
		if (c && Ext.hstz.getExpander(c) == this) c.parentNode.removeChild(c);
	}
	for (var i = 0; i < this.overlays.length; i++) {
		var o = Ext.hstz.$('hsId'+ this.overlays[i]);
		if (o && o.parentNode == Ext.hstz.viewport && Ext.hstz.getExpander(o) == this) Ext.hstz.discardElement(o);
	}
	Ext.hstz.discardElement(this.overlayBox);
},



createFullExpand : function () {
	if (this.slideshow && this.slideshow.controls) {
		this.slideshow.enable('full-expand');
		return;
	}
	this.fullExpandLabel = Ext.hstz.createElement(
		'a', {
			href: 'javascript:Ext.hstz.expanders['+ this.key +'].doFullExpand();',
			title: Ext.hstz.lang.fullExpandTitle,
			className: 'highslide-full-expand'
		}
	);
	
	this.createOverlay({ 
		overlayId: this.fullExpandLabel, 
		position: Ext.hstz.fullExpandPosition, 
		hideOnMouseOut: true, 
		opacity: Ext.hstz.fullExpandOpacity
	});
},

doFullExpand : function () {
	try {
		if (this.fullExpandLabel) Ext.hstz.discardElement(this.fullExpandLabel);
		
		this.focus();
		var xSize = this.x.size,
        	ySize = this.y.size;
        this.resizeTo(this.x.full, this.y.full);
       
        var xpos = this.x.pos - (this.x.size - xSize) / 2;
        if (xpos < Ext.hstz.marginLeft) xpos = Ext.hstz.marginLeft;
       
        var ypos = this.y.pos - (this.y.size - ySize) / 2;
        if (ypos < Ext.hstz.marginTop) ypos = Ext.hstz.marginTop;
       
        this.moveTo(xpos, ypos);
		this.doShowHide('hidden');
	
	} catch (e) {
		this.error(e);
	}
},


afterClose : function () {
	this.a.className = this.a.className.replace('highslide-active-anchor', '');
	
	this.doShowHide('visible');
		if (this.outline && this.outlineWhileAnimating) this.outline.destroy();
	
		Ext.hstz.discardElement(this.wrapper);
	this.destroyOverlays();
	if (!Ext.hstz.viewport.childNodes.length) Ext.hstz.viewport.style.display = 'none';
	
	if (this.dimmingOpacity) Ext.hstz.undim(this.key);
	Ext.hstz.expanders[this.key] = null;		
	Ext.hstz.reOrder();
}

};


Ext.hstz.Slideshow = function (expKey, options) {
	if (Ext.hstz.dynamicallyUpdateAnchors !== false) Ext.hstz.updateAnchors();
	this.expKey = expKey;
	for (var x in options) this[x] = options[x];
	if (this.useControls) this.getControls();
	if (this.thumbstrip) this.thumbstrip = Ext.hstz.Thumbstrip(this);
};
Ext.hstz.Slideshow.prototype = {
getControls: function() {
	this.controls = Ext.hstz.createElement('div', { innerHTML: Ext.hstz.replaceLang(Ext.hstz.skin.controls) }, 
		null, Ext.hstz.container);
	
	var buttons = ['play', 'pause', 'previous', 'next', 'move', 'full-expand', 'close'];
	this.btn = {};
	var pThis = this;
	for (var i = 0; i < buttons.length; i++) {
		this.btn[buttons[i]] = Ext.hstz.getElementByClass(this.controls, 'li', 'highslide-'+ buttons[i]);
		this.enable(buttons[i]);
	}
	this.btn.pause.style.display = 'none';
	// this.disable('full-expand');
},
checkFirstAndLast: function() {
	if (this.repeat || !this.controls) return;
	var exp = Ext.hstz.expanders[this.expKey],
		cur = exp.getAnchorIndex(), 
		re = /disabled$/;
	if (cur == 0) 
		this.disable('previous');
	else if (re.test(this.btn.previous.getElementsByTagName('a')[0].className))
		this.enable('previous');
	if (cur + 1 == Ext.hstz.anchors.groups[exp.slideshowGroup || 'none'].length) {
		this.disable('next');
		this.disable('play');
	} else if (re.test(this.btn.next.getElementsByTagName('a')[0].className)) {
		this.enable('next');
		this.enable('play');
	}
},
enable: function(btn) {
	if (!this.btn) return;
	var sls = this, a = this.btn[btn].getElementsByTagName('a')[0], re = /disabled$/;
	a.onclick = function() {
		sls[btn]();
		return false;
	};
	if (re.test(a.className)) a.className = a.className.replace(re, '');
},
disable: function(btn) {
	if (!this.btn) return;
	var a = this.btn[btn].getElementsByTagName('a')[0];
	a.onclick = function() { return false; };
	if (!/disabled$/.test(a.className)) a.className += ' disabled';
},
hitSpace: function() {
	if (this.autoplay) this.pause();
	else this.play();
},
play: function(wait) {
	if (this.btn) {
		this.btn.play.style.display = 'none';
		this.btn.pause.style.display = '';
	}
	
	this.autoplay = true;	
	if (!wait) Ext.hstz.next(this.expKey);
},
pause: function() {
	if (this.btn) {
		this.btn.pause.style.display = 'none';
		this.btn.play.style.display = '';
	}
	
	clearTimeout(this.autoplay);
	this.autoplay = null;
},
previous: function() {
	this.pause();
	Ext.hstz.previous(this.btn.previous);
},
next: function() {
	this.pause();
	Ext.hstz.next(this.btn.next);
},
move: function() {},
'full-expand': function() {
	Ext.hstz.getExpander().doFullExpand();
},
close: function() {
	Ext.hstz.close(this.btn.close);
}
};
Ext.hstz.Thumbstrip = function(slideshow) {
	var options,scrollDown,scrollUp;
	function add (exp) {
		Ext.hstz.extend(options || {}, {
			overlayId: dom,
			hsId: 'thumbstrip',
			className: 'highslide-thumbstrip-'+ mode +'-overlay ' + (options.className || '')
		});
		if (Ext.hstz.ieLt7) options.fade = 0;
		exp.createOverlay(options);
		Ext.hstz.setStyles(dom.parentNode, { overflow: 'hidden' });
	};
	
	function scroll (delta) {	
		selectThumb(undefined, Math.round(delta * dom[isX ? 'offsetWidth' : 'offsetHeight'] * 0.7));
	};
	
	function selectThumb (i, scrollBy) {
		if (i === undefined) for (var j = 0; j < group.length; j++) {
			if (group[j] == Ext.hstz.expanders[slideshow.expKey].a) {
				i = j;
				break;
			}
		}
		if (i === undefined) return;
		var as = dom.getElementsByTagName('a'),
			active = as[i],
			cell = active.parentNode,
			left = isX ? 'Left' : 'Top',
			right = isX ? 'Right' : 'Bottom',
			width = isX ? 'Width' : 'Height',
			offsetLeft = 'offset' + left,
			offsetWidth = 'offset' + width,
			overlayWidth = div.parentNode.parentNode[offsetWidth],
			minTblPos = overlayWidth - table[offsetWidth],
			curTblPos = parseInt(table.style[isX ? 'left' : 'top']) || 0,
			tblPos = curTblPos,
			mgnRight = 20;
		if (scrollBy !== undefined) {
			tblPos = curTblPos - scrollBy;
			
			if (minTblPos > 0) minTblPos = 0;
			if (tblPos > 0) tblPos = 0;
			if (tblPos < minTblPos) tblPos = minTblPos;
			
	
		} else {
			for (var j = 0; j < as.length; j++) as[j].className = '';
			active.className = 'highslide-active-anchor';
			var activeLeft = i > 0 ? as[i - 1].parentNode[offsetLeft] : cell[offsetLeft],
				activeRight = cell[offsetLeft] + cell[offsetWidth] + 
					(as[i + 1] ? as[i + 1].parentNode[offsetWidth] : 0);
			if (activeRight > overlayWidth - curTblPos) tblPos = overlayWidth - activeRight;
			else if (activeLeft < -curTblPos) tblPos = -activeLeft;
		}
		var markerPos = cell[offsetLeft] + (cell[offsetWidth] - marker[offsetWidth]) / 2 + tblPos;
		Ext.hstz.animate(table, isX ? { left: tblPos } : { top: tblPos }, null, 'easeOutQuad');
		Ext.hstz.animate(marker, isX ? { left: markerPos } : { top: markerPos }, null, 'easeOutQuad');
		scrollUp.style.display = tblPos < 0 ? 'block' : 'none';
		scrollDown.style.display = (tblPos > minTblPos)  ? 'block' : 'none';
		
	};
	

	// initialize
	var group = Ext.hstz.anchors.groups[Ext.hstz.expanders[slideshow.expKey].slideshowGroup || 'none'],
		options = slideshow.thumbstrip,
		mode = options.mode || 'horizontal',
		floatMode = (mode == 'float'),
		tree = floatMode ? ['div', 'ul', 'li', 'span'] : ['table', 'tbody', 'tr', 'td'],
		isX = (mode == 'horizontal'),
		dom = Ext.hstz.createElement('div', {
				className: 'highslide-thumbstrip highslide-thumbstrip-'+ mode,
				innerHTML:
					'<div class="highslide-thumbstrip-inner">'+
					'<'+ tree[0] +'><'+ tree[1] +'></'+ tree[1] +'></'+ tree[0] +'></div>'+
					'<div class="highslide-scroll-up"><div></div></div>'+
					'<div class="highslide-scroll-down"><div></div></div>'+
					'<div class="highslide-marker"><div></div></div>'
			}, {
				display: 'none'
			}, Ext.hstz.container),
		domCh = dom.childNodes,
		div = domCh[0],
		scrollUp = domCh[1],
		scrollDown = domCh[2],
		marker = domCh[3],
		table = div.firstChild,
		tbody = dom.getElementsByTagName(tree[1])[0],
		tr;
	for (var i = 0; i < group.length; i++) {
		if (i == 0 || !isX) tr = Ext.hstz.createElement(tree[2], null, null, tbody);
		(function(){
			var a = group[i],
				cell = Ext.hstz.createElement(tree[3], null, null, tr),
				pI = i;
			Ext.hstz.createElement('a', {
				href: a.href,
				title: a.title,
				onclick: function() {
					if (/highslide-active-anchor/.test(this.className)) return false;
					Ext.hstz.getExpander(this).focus();
					return Ext.hstz.transit(a);
				},
				innerHTML: Ext.hstz.stripItemFormatter ? Ext.hstz.stripItemFormatter(a) : a.innerHTML
			}, null, cell);
		})();
	}
	if (!floatMode) {
		scrollUp.onclick = function () { scroll(-1); };
		scrollDown.onclick = function() { scroll(1); };
		Ext.hstz.addEventListener(tbody, document.onmousewheel !== undefined ? 
				'mousewheel' : 'DOMMouseScroll', function(e) {        
			var delta = 0;
	        e = e || window.event;
	        if (e.wheelDelta) {
				delta = e.wheelDelta/120;
				if (Ext.hstz.opera) delta = -delta;
	        } else if (e.detail) {
				delta = -e.detail/3;
	        }
	        if (delta) scroll(-delta * 0.2);
			if (e.preventDefault) e.preventDefault();
			e.returnValue = false;
		});
	}
	
	return {
		add: add,
		selectThumb: selectThumb
	}
};
Ext.hstz.langDefaults = Ext.hstz.lang;
// history

// set handlers
Ext.hstz.addEventListener(document, 'ready', function() {
	if (Ext.hstz.expandCursor || Ext.hstz.dimmingOpacity) {
		var style = Ext.hstz.createElement('style', { type: 'text/css' }, null, 
			document.getElementsByTagName('HEAD')[0]), 
			backCompat = document.compatMode == 'BackCompat';
		
		function addRule(sel, dec) {
			if (Ext.hstz.ie && (Ext.hstz.uaVersion < 9 || backCompat)) {
				var last = document.styleSheets[document.styleSheets.length - 1];
				if (typeof(last.addRule) == "object") last.addRule(sel, dec);
			} else {
				style.appendChild(document.createTextNode(sel + " {" + dec + "}"));
			}
		}
		function fix(prop) {
			return 'expression( ( ( ignoreMe = document.documentElement.'+ prop +
				' ? document.documentElement.'+ prop +' : document.body.'+ prop +' ) ) + \'px\' );';
		}
		if (Ext.hstz.expandCursor) addRule ('.highslide img', 
			'cursor: url('+ Ext.hstz.graphicsDir + Ext.hstz.expandCursor +'), pointer !important;');
		addRule ('.highslide-viewport-size',
			Ext.hstz.ie && (Ext.hstz.uaVersion < 7 || backCompat) ?
				'position: absolute; '+
				'left:'+ fix('scrollLeft') +
				'top:'+ fix('scrollTop') +
				'width:'+ fix('clientWidth') +
				'height:'+ fix('clientHeight') :
				'position: fixed; width: 100%; height: 100%; left: 0; top: 0');
	}
});
Ext.hstz.addEventListener(window, 'resize', function() {
	Ext.hstz.getPageSize();
	if (Ext.hstz.viewport) for (var i = 0; i < Ext.hstz.viewport.childNodes.length; i++) {
		var node = Ext.hstz.viewport.childNodes[i],
			exp = Ext.hstz.getExpander(node);
		exp.positionOverlay(node);
		if (node.hsId == 'thumbstrip') exp.slideshow.thumbstrip.selectThumb();
	}
});
Ext.hstz.addEventListener(document, 'mousemove', function(e) {
	Ext.hstz.mouse = { x: e.clientX, y: e.clientY	};
});
Ext.hstz.addEventListener(document, 'mousedown', Ext.hstz.mouseClickHandler);
Ext.hstz.addEventListener(document, 'mouseup', Ext.hstz.mouseClickHandler);


Ext.hstz.addSlideshow({
	slideshowGroup: 'group1',
	interval: 5000,
	repeat: false,
	useControls: true,
	fixedControls: false,
	overlayOptions: {
		className: 'text-controls',
		opacity: 1,
		position: 'bottom center',
		offsetX: 0,
		offsetY: -60,
		relativeTo: 'viewport',
		hideOnMouseOut: false
	},
	thumbstrip: {
		mode: 'horizontal',
		position: 'bottom center',
		relativeTo: 'viewport'
	}

});

Ext.onReady(Ext.hstz.ready);
