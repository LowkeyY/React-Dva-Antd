Ext.namespace('lib.scripteditor');

/**
 * 在线代码编辑器控件,可以编写多种语言代码.提供行号显示、高亮显示、语法着色以及undo,redo,查找替换等编辑功能<br>
 * 本对象继承自Ext.form.TextArea,使用方法基本与textarea相同,例如在一个Panel中加载一个java代码编辑器
 * 
 * <pre><code>
 * 
 * var editor = new lib.scripteditor.CodeEditor({
 * 			allowFullScreen : true,
 * 			allowSearchAndReplace : true,
 * 			allowFormatter : true,
 * 			language : &quot;java&quot;
 * 		});
 * 
 * var panel = new Ext.Panel({
 * 			tbar : editor.getButtons(),
 * 			items : [editor]
 * 		});
 * </code>
 * </pre>
 * 
 * 目前支持以下语言,分隔线前是language属性的值<br>
 * <ul>
 * <li>text--纯文本</li>
 * <li>js--javascript语言</li>
 * <li>json--json格式文件</li>
 * <li>xml--xml格式文件</li>
 * <li>html--html格式文件,可以内嵌javascript语言和css</li>
 * <li>css--css样式表文件</li>
 * <li>c--c语言</li>
 * <li>java--java语言</li>
 * <li>csharp--c#语言</li>
 * <li>scala--scala语言(快速java内嵌脚本)</li>
 * <li>sql--sql编辑器</li>
 * <li>plsql--plsql代码编辑器,支持oracle,plsql关键字高亮</li>
 * <li>mysql--mysql代码编辑器,支持mysql关键字高亮</li>
 * <li>properties--properties格式配置文件</li>
 * <li>ini--ini格式配置文件</li>
 * <li>r--r语言</li>
 * <li>shell--shell编辑器,linux下控制台脚本</li>
 * <li>xquery--xquery编辑器,xml查询语句</li>
 * 
 * </ul>
 */

lib.scripteditor.CodeEditor = Ext.extend(Ext.form.TextArea, {
	/**
	 * @cfg {String} language
	 *      <p>
	 *      语言代码,默认值是text
	 *      </p>
	 */
	language : 'text',
	/**
	 * @cfg {Boolean} allowSearchAndReplace
	 *      <p>
	 *      是否允许查找和替换,默认值是false
	 *      </p>
	 */
	allowSearchAndReplace : false,
	/**
	 * @cfg {Boolean} allowFullScreen
	 *      <p>
	 *      是否允许全屏编辑,默认值是false.按F11键或点击全屏按钮进入全屏编辑状态,按ESC返回正常状态.
	 *      </p>
	 */
	allowFullScreen : false,
	/**
	 * @cfg {Boolean} allowFormatter
	 *      <p>
	 *      是否允许整理代码\添加删除注释功能,默认值是false.目前只支持html,xml,css,javascript,json这几种语言或格式的文件.<br>
	 *      与Eclipse一样,键入ctrl+shift+f自动排版
	 *      </p>
	 */
	allowFormatter : false,
	// private
	editorPath : 'lib.scripteditor.CodeMirror',
	initialized : false,// 是否载入
	initComponent : function() {

		this.id = this.id || Ext.id();
		lib.scripteditor.CodeEditor.superclass.initComponent.apply(this,
				arguments);
		using(this.editorPath + ".codemirror");
		loadcss(this.editorPath + ".codemirror");

		this.allowFormatter &= (',js,json,css,html,xml,'.indexOf(this.language) != -1);

		this.langCfg = this.loadLanguage(this.language);
		this.addEvents(
				/**
				 * @event initialize 当此控件初始化完毕时触发
				 * @param {lib.scripteditor.CodeEditor}
				 *            当前对象
				 */
				'initialize');

	},

	prepareFullScreen : function() {
		this.codeEditor.setFullScreen = function(full) {
			if (full == this.fullState)
				return;
			this.fullState = full;
			if (full) {
				this.outterWrapper = Ext.getBody().createChild({
					tagName : 'div',
					style : 'position:absolute;width:100%;height:100%;z-index:100000;top:0px;left:0px;background-color:white;'
				});
				var size = this.outterWrapper.getSize();
				var wrapper = this.getWrapperElement();
				this.pNode = wrapper.parentNode;
				this.wSize = Ext.fly(wrapper).getSize();
				this.outterWrapper.appendChild(wrapper);
				this.setSize(size.width, size.height);
				this.focus();
			} else {
				var wrapper = this.getWrapperElement();
				this.pNode.appendChild(wrapper);
				this.setSize(this.wSize.width, this.wSize.height);
				delete this.wSize;
				delete this.pNode;
				this.outterWrapper.remove();
				delete this.outterWrapper;
			}
		}

	},
	// private
	afterRender : function() {
		var fn = function(me) {
			me.initialized = true;
			me.fireEvent('initialize', me);
		}
		CodeMirror.defineInitHook(fn.createCallback(this));
		this.codeEditor = CodeMirror.fromTextArea(this.el.dom,
				this.langCfg.config);
		lib.scripteditor.CodeEditor.superclass.afterRender.call(this);

		this.allowFullScreen && this.prepareFullScreen()
		var wrapperStyle = {
			background : "url(/Ext/resources/images/default/form/text-bg.gif) #fff repeat-x",
			border : "solid 1px #b5b8c8"
		}
		if (Ext.isIE) {// 暂时给IE的补丁-tz
			wrapperStyle.lineHeight = 'normal';
			Ext.fly(this.codeEditor.display.gutters).setStyle({
						visibility : 'hidden'
					});
		}
		Ext.fly(this.codeEditor.getWrapperElement()).setStyle(wrapperStyle);

	},
	alignErrorIcon : function() {
		if (this.initialized) {
			this.errorIcon.alignTo(this.codeEditor.getWrapperElement(),
					'tl-tr', [2, 0]);
		}
	},
	setActiveError : function(msg, suppressEvent) {
		Ext.fly(this.codeEditor.getWrapperElement()).setStyle({
					border : "solid 1px red"
				})
		lib.scripteditor.CodeEditor.superclass.setActiveError.call(this, msg,
				suppressEvent);
	},

	unsetActiveError : function(suppressEvent) {
		Ext.fly(this.codeEditor.getWrapperElement()).setStyle({
					border : "solid 1px #b5b8c8"
				})
		lib.scripteditor.CodeEditor.superclass.unsetActiveError.call(this,
				suppressEvent);
	},
	onResize : function(adjWidth, adjHeight, rawWidth, rawHeight) {
		this.initialized && this.codeEditor.setSize(adjWidth, adjHeight);
	},
	onDestroy : function() {
		if (this.initialized) {
			if (this.codeEditor.fullState)
				this.codeEditor.setFullScreen(false);
			Ext.removeNode(this.codeEditor.getWrapperElement());
			delete this.codeEditor;
			delete this.initialized;
		}
		lib.scripteditor.CodeEditor.superclass.onDestroy.call(this);
	},
	focus : function() {
		this.initialized && this.codeEditor.focus();
	},
	getValue : function() {
		return this.initialized ? this.codeEditor.getValue() : this.value;
	},
	getButtons : function() {
		var btns = [{

					text : '撤销'.loc(),
					icon : '/themes/icon/all/arrow_undo.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					scope : this,
					handler : function(btn) {
						this.codeEditor.undo()
					}
				}, {
					text : '重做'.loc(),
					icon : '/themes/icon/all/arrow_redo.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					scope : this,
					handler : function(btn) {
						this.codeEditor.redo()
					}
				}];
		if (this.allowSearchAndReplace) {
			var fnd = function(btn) {
				using('lib.scripteditor.FindWindow');
				var pattern = this.codeEditor.getSelection();
				var findWin = new lib.scripteditor.FindWindow('find', pattern);
				findWin.show();
				findWin.win.on('close', function() {
							pattern = findWin.pattenValue;
							var cm = this.codeEditor;
							if (!pattern || pattern == "")
								return;
							do {
								var c = cm.getSearchCursor(pattern);
								while (c.findNext()) {
									cm.setSelection(c.from(), c.to());
									if (!confirm('继续查找?'.loc()))
										return;
								}
							} while (confirm('已到文件尾,从新查找?'.loc()));
						}, this);
			}
			btns.push({
						text : '查找'.loc(),
						icon : '/themes/icon/all/find.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						handler : fnd
					});
			var rep = function(btn) {
				using('lib.scripteditor.FindWindow');
				var pattern = this.codeEditor.getSelection();
				var findWin = new lib.scripteditor.FindWindow('replace',
						pattern);
				findWin.show();
				findWin.win.on('close', function() {
							pattern = findWin.pattenValue;
							var to = findWin.replaceValue;
							if (!pattern || pattern == "")
								return;
							if (to == null)
								return;
							var cursor = this.codeEditor
									.getSearchCursor(pattern);
							while (cursor.findNext())
								cursor.replace(to);
						}, this);
			};
			btns.push({
						text : '替换'.loc(),
						icon : '/themes/icon/all/text_replace.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						handler : rep
					});
		}
		if (this.allowFormatter) {
			btns.push({
						text : '格式化'.loc(),
						icon : '/themes/icon/all/head.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						handler : function(btn) {
							this.formatCode();
						}
					});
			btns.push({
				text : '添加注释'.loc(),
				icon : '/themes/icon/all/comment_add.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : function(btn) {
					var e = this.codeEditor;
					e.commentRange(true, e.getCursor(true), e.getCursor(false));
				}
			});
			btns.push({
						text : '取消注释'.loc(),
						icon : '/themes/icon/all/comment_delete.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						handler : function(btn) {
							var e = this.codeEditor;
							e.commentRange(false, e.getCursor(true), e
											.getCursor(false));
						}
					});

		}
		btns.push({
					text : '跳转到'.loc(),
					icon : '/themes/icon/all/text_signature.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					scope : this,
					handler : function(btn) {
						using('lib.scripteditor.FindWindow');
						var findWin = new lib.scripteditor.FindWindow('jump',
								"");
						findWin.show();
						findWin.win.on('close', function() {
									var line = findWin.jumpValue;
									if (Ext.isNumber(line)) {
										this.codeEditor.setCursor(line - 1, 0);
										this.codeEditor.focus();
									}
								}, this);
					}
				});
		if (this.allowFullScreen) {
			btns.push({
						text : '全屏'.loc(),
						tooltip : '点击后扩展至全屏,按Esc键返回当前状态',
						icon : '/themes/icon/all/shape_handles.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						handler : function(btn) {
							this.codeEditor.setFullScreen(true);
						}
					});

		}
		return btns;
	},
	setValue : function(v) {
		v = v || "";
		if (this.initialized) {
			this.codeEditor.setValue(v);
		}
		this.value = v;
	},
	processValue : function() {
		return this.getValue();
	},

	loadLanguage : function(lang) {

		lang = this.languages[lang.toLowerCase()] || this.languages.text;

		while (lang.extend) {
			var p = this.languages[lang.extend];
			p.js && (lang.js = lang.js ? p.js.concat(lang.js) : p.js);
			p.css && (lang.css = lang.css ? p.css.concat(lang.css) : p.css);
			lang.config = Ext.apply(p.config, lang.config);
			lang.extend = p.extend;
		}
		if (this.allowSearchAndReplace) {
			lang.js = (lang.js || []).concat("util.searchcursor");
		}
		if (this.allowFormatter) {
			lang.js = (lang.js || []).concat("util.formatting");
			lang.config.extraKeys = lang.config.extraKeys || {};
			lang.config.extraKeys["Shift-Ctrl-F"] = this.formatCode
					.createDelegate(this)
		}
		if (this.allowFullScreen) {
			lang.css = (lang.css || []).concat("util.fullscreen");
			lang.config.extraKeys = lang.config.extraKeys || {};
			Ext.apply(lang.config.extraKeys, {
						"F11" : function(cm) {
							cm.setFullScreen(true);
						},
						"Esc" : function(cm) {
							cm.setFullScreen(false);
						}
					});
		}
		if (lang.js) {
			for (var i = 0; i < lang.js.length; i++) {
				using(this.editorPath + "." + lang.js[i]);
			}
		}
		if (lang.css) {
			for (var i = 0; i < lang.css.length; i++) {
				loadcss(this.editorPath + "." + lang.css[i]);
			}
		}
		lang.config.value = this.value;
		lang.config.readOnly = this.readOnly;
		return lang;
	},
	formatCode : function() {
		if (this.allowFormatter && this.initialized) {
			var e = this.codeEditor;
			var to = {
				line : e.lineCount() - 1,
				ch : e.getLine(e.lineCount() - 1).length
			}
			var from = {
				line : 0,
				ch : 0
			};
			e.autoFormatRange(from, to);
		}
	},
	languages : {
		text : {
			config : {
				mode : "text/plain"
			}
		},
		js : {
			js : ["util.matchbrackets", "util.continuecomment",
					"mode.javascript.javascript"],
			config : {
				lineNumbers : true,
				matchBrackets : true,
				extraKeys : {
					"Enter" : "newlineAndIndentContinueComment"
				},
				mode : "text/javascript"
			}
		},
		json : {
			extend : "js",
			config : {
				mode : "text/javascript"
			}
		},
		xml : {
			js : ["util.closetag", "mode.xml.xml"],
			config : {
				mode : {
					name : "xml",
					alignCDATA : true
				},
				autoCloseTags : true,
				lineNumbers : true
			}

		},
		html : {
			extend : "xml",
			js : ["mode.javascript.javascript", "mode.css.css",
					"mode.htmlmixed.htmlmixed"],
			config : {
				mode : 'htmlmixed',
				tabMode : "indent"
			}
		},
		css : {

			js : ["mode.css.css"],
			config : {
				mode : "text/css",
				lineNumbers : true
			}
		},
		c : {
			js : ["util.matchbrackets", "mode.clike.clike"],
			config : {
				mode : "text/x-csrc",
				matchBrackets : true,
				lineNumbers : true
			}
		},
		java : {
			extend : "c",
			config : {
				mode : "text/x-java"
			}
		},
		csharp : {
			extend : "c",
			config : {
				mode : "text/x-csharp"
			}
		},
		scala : {
			extend : "c",
			config : {
				mode : "text/x-scala"
			}
		},
		plsql : {
			js : ["mode.plsql.plsql"],
			config : {
				indentUnit : 4,
				mode : "text/x-plsql"
			}
		},
		mysql : {

			js : ["mode.mysql.mysql"],
			config : {
				mode : "text/x-mysql",
				tabMode : "indent"
			}
		},
		sql : {
			extend : "plsql",
			config : {}
		},
		properties : {

			js : ["mode.properties.properties"],
			config : {
				lineNumbers : true,
				mode : "text/x-properties"
			}
		},
		ini : {
			extend : "properties",
			config : {
				mode : "text/x-ini"
			}
		},
		r : {
			js : ["mode.r.r"],
			css : ["mode.r.r"],
			config : {
				lineNumbers : true,
				mode : "text/x-rsrc"
			}
		},
		shell : {
			js : ["util.matchbrackets", "mode.shell.shell"],
			config : {
				mode : 'text/x-sh',
				lineNumbers : true,
				matchBrackets : true
			}
		},
		xquery : {
			js : ["util.matchbrackets", "mode.xquery.xquery"],
			config : {
				mode : 'application/xquery',
				lineNumbers : true,
				matchBrackets : true
			}
		}
	}
});
Ext.reg('codeEditor', lib.scripteditor.CodeEditor);
