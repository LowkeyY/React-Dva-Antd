Ext.ns("usr.cms");
using("usr.cms.editNavLanmu");
using("usr.cms.editLanmuCss");
using("usr.cms.editPNavMenu");
using("usr.cms.editPCombotree");
using("usr.cms.editPCombobox");
using("usr.cms.editPRadiogroup");
using("lib.ColorField.ColorField");

loadcss("usr.cms.editTemplate");
loadcss('lib.upload.Base');using('lib.upload.Base');using('lib.upload.File');

usr.cms.editTemplate = function() {
}

usr.cms.editTemplate.prototype = {
	getELChildren : function(el, TagName, tools, offset , isPlus) {
		var parentElement = el || document;
		var children = [], currentElement, allowEdit, currentBox ,allowReplaceType ,zIndex , fixedtype ,node , otherP , addT , ts;
		/* vmedit 是否允许编辑, true为允许；存在该属性值，会在可编辑属性数组中加入该数据，并在前端画出有一个对应的panel用做展现参数。
		 * vmchange 是否允许改变类型, true为允许。如稿件列表更换为固定图片，等。暂时搁置。
		 * vmwidth 前端展现panel的宽度。
		 * vmheight 前端展现panel的高度。
		 * vmcenter 前端展现panel居中，相对于panel上一级window。
		 * vmfixedtype 获取固定格式的栏目，如图片栏目。
		 * vmtitle 前端展现panel的名字，以此为依据查询可编辑项。
		*/
		/* config.josn
		 * 1.属性与值 ， 一一对应。
		 * 2.如果含有items ，则该项没有值。在前端 以panel或者FieldSet的title方式展现。
		 * 3.如果需要隐藏，则xtype设置为hidden，realtype则是它的真实类型。存在relationFiled属性时，会关联操作relationFiled所指的字段。
		 * 4.导航属性中，必有 "isNav" : "true"，items中 必有[name+'最大行数']，[name+'最大列数']，[name+'菜单层级']，[name+'值']属性。
	  	*/
		Ext.each(parentElement.getElementsByTagName(TagName), function(element) {
					if (Ext.isDefined(element.attributes.vmedit)) {
						currentElement = Ext.get(element);
							
						zIndex = currentElement.getPositioning()["z-index"] * 1 || -1;
						currentElement.setStyle("z-index" ,zIndex == -1 ? "0" : "1");
						allowEdit = (element.attributes.vmedit.value == "true") && tools;
						allowReplaceType = Ext.isDefined(element.attributes.vmchange) && element.attributes.vmchange.value == "true";
						currentBox = currentElement.getBox();
						var html, w = currentBox.width, h = currentBox.height, cid = currentElement.id + "__" + Ext.id() , _x = (currentBox.x - offset[0]) , _y = (currentBox.y - offset[1]), showTitle;
						html = cid + " , xy : [" + _x + " , " + _y + "] , 0 : [" + w + " , " + h + "]";
						w = (element.attributes.vmwidth && element.attributes.vmwidth.value * 1) || w;
						h = (element.attributes.vmheight && element.attributes.vmheight.value * 1) || h;
						_x = element.attributes.vmcenter ? (Ext.get(parentElement).getBox().width - w)  / 2 : _x;
						html += " , 1 : [" + w + " , " + h + "]";
						
						showTitle = (element.attributes.vmtitle && element.attributes.vmtitle.value) || "";
						ts = "";
						otherP = usr.cms.editLanmuCss(element , isPlus , this);
						if (otherP) {
							ts = tools.slice(0, tools.length);
							ts.unshift({
										id : 'plus',
										scope : this,
										otherP : otherP,
										qtip : "其它设置",
										handler : function(e, target, panel , tc) {
											this.edieOtherWindows(panel.showTitle , tc.otherP);
										}
									});
						}
						fixedtype = Ext.isDefined(element.attributes.vmfixedtype) ? element.attributes.vmfixedtype.value || "-1" : "-1";
						node = {
									xtype : "panel",
									id : cid,
									defaults : {
										margins : 0/*,
										style : 'padding: 0 ;filter:alpha(opacity=40);-moz-opacity:0.4;-khtml-opacity: 0.4; opacity: 0.4;'*/
									},
//									bodyStyle : "background-color : #D3E2F1",
									headerCfg : {
										cls: 'x-panel-header-vm'
									},
									showTitle : showTitle,
									//title : showTitle,
									//title : allowEdit ? html : "",
									x : _x,
									y : _y,
									width : w,
									height : h,
									allowReplaceType : allowReplaceType,
									allowEdit : allowEdit,
									tools : allowEdit ? ts || tools : null,
									listeners : {
										afterRender : function() {
											function findMPanel(el , key , value){
												var pl = el.parentElement , count = 0;
												while(pl.className && /x-panel-/.test(pl.className)){
													pl = pl.parentElement;
													if(count++ > 5){
														pl = el.parentElement;
														break;
													}	
												}
												if (pl)
													pl.style[key] = value;
											}
											this.el.addListener("mouseover", function(e, t, o) {
												findMPanel(t , "backgroundColor" , "red");
											});
											this.el.addListener("mouseout", function(e, t, o) {
												findMPanel(t , "backgroundColor" , "");
											});
										}
									}
								};
						node["style"] = ((zIndex > 0) ? "z-index:10;" : "") + "padding: 0 ;filter:alpha(opacity=40);-moz-opacity:0.4;-khtml-opacity: 0.4; opacity: 0.4;"
						if(fixedtype !== "-1")
							node["fixedtype"] = fixedtype;
						children.push(node);
					}
				}.createDelegate(this));
		return children;
	},
	includePath : function(src, tag, el) {
		try{
			var id = src.replace(/[^\w]+?/ig, "") , obj , oobj , PE = el || document.body;
			(oobj = document.getElementById(id)) && oobj.parentElement.removeChild(oobj);
			obj = document.createElement(tag);
			if(tag == "script"){
				obj.type = "text/javascript";
				obj.id = id;
				obj.src = src;
				obj.charset="gbk";
			}else{
				obj.data = src;
				obj.id = id;
				obj.width = 0;
				obj.height = 0;		
			}
			PE.appendChild(obj);
		}catch(e){
		}
	},
	load : function(framePanel, parentPanel, param, prgInfo) {
		this.markWindow = parentPanel.findParentByType(Ext.Window);
		this.param = param;
		this.uuid = "";
		this.isPlus = true;
		this.markPanel = new Ext.Panel({
			markWindow : this.markWindow,
			autoScroll : false,
			x : 0,
			y : 0,
			params : param,
			layout : 'absolute',
			defaults : {
				//border : false,
				margins : 0,
				style : 'padding: 0 ; filter:alpha(opacity=40);-moz-opacity:0.4;-khtml-opacity: 0.4; opacity: 0.4;'
			}
		});
		this.htmlPanel = new Ext.Panel({
					autoScroll : false,
					x : 0,
					y : 0
				});
		this.mainPanel = new Ext.Panel({
					autoScroll : true,
					id : param['objectId'] + "-EV",
					layout : 'absolute',
					items : [this.htmlPanel, this.markPanel]
				})
		this.doPreview();

		parentPanel.add(this.mainPanel);
		parentPanel.doLayout();
	},
	edieOtherWindows : function(title , config){
		var wid = this.param['objectId'] + "-OTHERWIN";
		var win = Ext.getCmp(wid);
		var win_w = WorkBench.Desk.getDesktop().getViewWidth(), win_h = WorkBench.Desk.getDesktop().getViewHeight() , parentWindow , mPanel;

		if(parentWindow = this.mainPanel.findParentByType(Ext.Window)){
			win_w = parentWindow.el.getBox().width;
			win_h = parentWindow.el.getBox().height;
		}
		
		if (!win) {
			win = new Ext.Window({
						id : wid,
						title : title,
						submenus : {},
						scope : this,
						width : win_w *  0.5,
						height : win_h * 0.6,
						icon : '/themes/icon/all/book_open.gif',
						autoScroll : false,
						layout : 'fit',
						modal : true
					});
		};
		//config = new Ext.Panel(config);
		config = win.add(config);
		if (config.fileUpload && config.form == true) {
			lib.upload.Uploader.setEnctype(config);
		}
		win.show();
	},
	edieWindows : function(panel , otherPanel) {
		var wid = this.param['objectId'] + "-WIN";
		var win = Ext.getCmp(wid);
		var winTitle = panel.showTitle , mPanel , win_w = WorkBench.Desk.getDesktop().getViewWidth(), win_h = WorkBench.Desk.getDesktop().getViewHeight() , isNav = false , parentWindow;

		if(parentWindow = this.mainPanel.findParentByType(Ext.Window)){
			win_w = parentWindow.el.getBox().width;
			win_h = parentWindow.el.getBox().height;
		}
		
		var items = this.propertyModel.filter(function(obj){
			if(obj.name == winTitle)
				return true;
			return false;
		});
		function findChildNodeById(nodes , attribute , value , returnArray){
			var rs = [];
			Ext.each(nodes , function(node){
					if(node[attribute] === value){
						rs.push(returnArray ? Ext.applyIf({leaf:true} ,node) : node);
						if(!returnArray)
							return;
					}
					if(node.children)
						Array.prototype.push.apply(rs , findChildNodeById(node.children , attribute , value , returnArray));
				})
				return rs;
		}		
		if(items.length == 0)
			items = this.propertyModel.filter(function(obj){
				if(!obj.items)
					return true;
				return false;
			});
		else if(items.length == 1){
			items = items[0];
			isNav = Ext.isDefined(items.isNav) && (items.isNav === "true");
			items = Ext.apply([],items.items);
		}
		//alert("isNav : " + isNav + " , !win : " + !win + ", win_w : " + win_w + " , win_h : " + win_h);
		if (!win) {
			win = new Ext.Window({
						id : wid,
						title : winTitle,
						submenus : {},
						scope : this,
						//stateful : false,
						width : win_w * (isNav ? 0.9 : 0.5),
						height : win_h * (isNav ? 0.8 : 0.4),
						icon : '/themes/icon/all/book_open.gif',
						autoScroll : false,
						layout : 'fit',
						modal : true,
						listeners : {
							beforestatesave : function(me, state) {
									delete state.width;
									delete state.height;
							}
						}
					});
		}
		
		if(this.allLanmu && panel.allowEdit){
			if(isNav)
				mPanel = new Ext.Panel(usr.cms.editPNavMenu(items , this.allLanmu.concat(), win , win));
			else {
				Ext.each(items , function(item){
					if(item.xtype && item.xtype == "hidden" && item.realtype){
						if(item.realtype.toLowerCase() == "combotree"){
							var childItems = panel.fixedtype ? findChildNodeById(this.allLanmu, "model", panel.fixedtype, true) : Ext.applyIf([], this.allLanmu);
							item = Ext.apply(item , usr.cms.editPCombotree(item , childItems));
							var val = findChildNodeById(childItems , "id" , item.value);
							item.value = val.length > 0 ? {"value" : val[0].id, "text" : val[0].text} : item.value;
							item.fieldLabel = Ext.isDefined(item.fieldLabel) ? item.fieldLabel : item.name;
						}else if(item.realtype.toLowerCase() == "radiogroup"){
							item = Ext.apply(item, usr.cms.editPRadiogroup(item));
						}else if(item.realtype.toLowerCase() == "combobox")
							item = Ext.apply(item, usr.cms.editPCombobox(item));
					}
				}, this);		
			}
			mPanel = mPanel || new Ext.FormPanel({
						//disabled : !panel.allowReplaceType,
						loadDatas : this.propertyLoadDatas,
						labelWidth : 180,
						trackResetOnLoad : true,
						scope : this,
						bodyStyle : "padding:20px 0 0 40px;overflow-y:auto;",
						width : 650,
						defaults : {
							allowBlank : false,
							width : 230
						},
						items : items,
						listeners :{
							afterrender : function(comp){
								if(this.form){
									this.form.items.each(function(item){
										if(item.xtype == "fileupload"){
											item.once("afterrender" , function(c){
												c.originalValue = c.getValue();
											})
										}
									})
								}
								var w;
								if (w = comp.findParentByType(Ext.Window)) {
									w.el.dom.style.textAlign = 'left';
								}
							}
						},
						buttons : [{
							text : '保存',
							handler : function(me) {
								var frm = me.findParentByType("form"), fDatas, isVaild = [], isChange = [], endIndex = -1;
								var withoutProperty = ["listeners","value","defaultValue","fieldLabel","allowBlank","root","items"] , formJson = [] , defaultJson = {
									xtype : "",
									name : "",
									tupiangaodu: "",
									tupiankuandu: ""
								};
								if(!frm.form.isDirty()){
									Ext.msg("info", '无修改项。'.loc());
									return;
								};
								if(frm && frm.form.isValid()){
									frm.loadDatas = this.propertyLoadDatas;
									//提取表单格式
									Ext.each(items , function(item){
										var obj = {};
						                for(var property in defaultJson){
//						                    if(withoutProperty.indexOf(property) == -1){
//						                        obj[property] = item[property];
//						                    }
						                	if(Ext.isDefined(defaultJson[property]) && Ext.isDefined(item[property]))
						                		obj[property] = item[property]
						                }
										formJson.push(obj);
									});
	
									if(formJson.length == 0){
										Ext.msg("error", '表单格式错误，无法提交。'.loc());
										return;
									}
									//判断修改项 ， 提交修改。
									if (frm.loadDatas && (fDatas = frm.form.getValues())) {
/*										for (var att in fDatas) {
											if (/_([A-Z]+?)$/ig.test(att)) {
												if ((endIndex = att.indexOf("_tz_Description")) > 0)
													att = att.substr(0, endIndex);
												else
													continue;
											};
											if (!Ext.isDefined(frm.loadDatas[att])) {
												isVaild.push(att);
												isChange = [];
												break;
											};
											if (frm.loadDatas[att] != fDatas[att])
												isChange.push(att);
										};
										
										if(isVaild.length > 0){
											Ext.msg("error", '存在错误，无法找到"'+isVaild.join(",")+'"等项。'.loc());
											return;
										};
										
										if(isChange.length == 0){
											Ext.msg("info", '无修改项。'.loc());
											return;
										};*/
										frm.getForm().submit({
											clientValidation : true,
											url : '/usr/cms/editTemplateLoad.jcp',
											method : 'post',
											params : {
												dataId : this.param['dataId'],
												formJson : Ext.encode(formJson)
											},
											success : function(form, action) {
												win.close();
												Ext.msg("confirm", '已完成修改，是否重载页面？', function(btns) {
													if (btns == 'yes') {
														this.markPanel.removeAll();
														this.doPreview();
													}
												}.createDelegate(form.scope));
											},
											failure : function(form, action) {
												switch (action.failureType) {
													case Ext.form.Action.CLIENT_INVALID :
														Ext.msg("error" , "表单错误，请刷新页面重试。")
														break;
													case Ext.form.Action.CONNECT_FAILURE :
														Ext.msg("error" , "连接失败，请刷新页面重试。")
														break;
													case Ext.form.Action.SERVER_INVALID :
														Ext.msg("error" , action.result.msg);
												}
											}
										});
									};						
								};
							}.createDelegate(this)
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
					});
			
			mPanel = win.add(mPanel);
			if (this.fileUpload && mPanel.form == true) {
				lib.upload.Uploader.setEnctype(mPanel);
			}
			win.show();
		}
	},
	includJS : function(usingJS , el){
		if(usingJS.length > 0){
			var src = usingJS.shift(), PE = el || document.body , usingNode = document.createElement("script");
			usingNode.setAttribute("type", "text/javascript");
			usingNode.setAttribute("id", src.replace(/[^\w]+?/ig, ""));
			usingNode.setAttribute("src", src  + "?" + Math.random());
			usingNode.setAttribute("charset", "gbk");
			var _this = this;
			usingNode.onerror = usingNode.onload = usingNode.onreadystatechange = function() {
/*				if (!usingNode.readyState || usingNode.readyState == "loaded" || usingNode.readyState == "complete" || usingNode.readyState == 4 && usingNode.status == 200) {

				};*/
				setTimeout(function(){
						PE.loadJSIndex--;
						//console.log(PE.loadJSIndex--);
						_this.includJS(usingJS, el);
					}, 200);
			};
			PE.appendChild(usingNode);
		}		
	},
	doPreview : function(){
		this.markWindow.body.mask("正在生成页面，请稍后...");
		Ext.Ajax.request({
			url : '/usr/cms/editTemplateLoad.jcp?dataId='+this.param['dataId']+'&uuid='+this.uuid+'&types=previewPage',
			scope : this,
			method : 'get',
			success : function(response, options) {
						this.markWindow.body.unmask();
						var result = Ext.decode(response.responseText);
						if (result.success) {
							var rs = result.datas;
							var pageEl = Ext.getDom(this.htmlPanel.el);
							if (rs.USINGJS) {
/*								useJS(rs.USINGJS , Ext.emptyFn);*/
								pageEl.parentElement.loadJSIndex = rs.USINGJS.length;
								this.includJS(rs.USINGJS ,pageEl.parentElement);
							} else{
								pageEl.parentElement.loadJSIndex = 1;
							}
							this.uuid = this.uuid == "" ? rs.uuid : this.uuid;
							this.isPlus &= rs.isLanmu;
							this.loadLocalPath = rs.loadLocalPath;
/*							this.doLayout.createDelegate(this).defer(10);*/
							var _this = this;
							this.markWindow.body.mask("正在组织页面，请稍后...");
							var interval = setInterval(function(){
									if(pageEl.parentElement.loadJSIndex == 1){
										clearInterval(interval);
										_this.markWindow.body.unmask();
										_this.doLayout();
									}
							} , 50);
						} else
							Ext.msg("error", "预览页面生成失败。原因 ： " + '<br>' + result.message);
						
					},
			failure : function(response, options){
				this.markWindow.body.unmask();
				Ext.msg("error", "预览页面生成失败。<br>请刷新页面重试。");
			}
		})
	},
	doLayout : function(){
		this.markWindow.body.mask("正在加载页面，请稍后...");
		Ext.Ajax.request({
			url : '/usr/cms/editTemplateLoad.jcp?dataId='+this.param['dataId']+'&uuid='+this.uuid+'&loadLocalPath='+this.loadLocalPath,
			scope : this,
			method : 'get',
			success : function(response, options) {
						this.markWindow.body.unmask();
						var result = Ext.decode(response.responseText);
						if (result.success) {
							this.markWindow.body.mask("正在重组页面，请稍后...");
							var rs = result.datas;
							var pageEl = Ext.getDom(this.htmlPanel.el);
	/*						if (rs.USINGJS) {
								pageEl.parentElement.loadJSIndex = rs.USINGJS.length;
								Ext.each(rs.USINGJS, function(usingname) {
											this.includePath(usingname, "script" , pageEl.parentElement);
										}.createDelegate(this));
							}*/
							if(rs.allLanmu)
								this.allLanmu = rs.allLanmu;
							if(rs.propertyModel)
								this.propertyModel = rs.propertyModel;
							if(rs.propertyLoadDatas)
								this.propertyLoadDatas = rs.propertyLoadDatas;
							if(rs.imports){
								this.fileUpload = true;
								eval(rs.imports);
							}
							var id = Ext.id();
							rs.html += '<span id="' + id + '"></span>';
							this.htmlPanel.el.update(rs.html , false);
							//this.htmlPanel.el.update(rs.html , rs.loadScript ? true : false , rs.onload ? function(){try{eval(rs.onload[0]);}catch(e){}} : "");
						
							Ext.lib.Event.onAvailable(id, function() {
								setTimeout(function() {
									var el = document.getElementById(id);
									if (el) {
										Ext.removeNode(el);
									}
									if (rs.USINGJS) {
										Ext.each(rs.USINGJS, function(usingname) {
													this.includePath(usingname, "script" , pageEl.parentElement);
												}.createDelegate(this));
									}
									if(rs.loadScript){
										(function() {
											try {
												Ext.each(rs.loadScript , function(ls){
													eval(ls);
												});
											} catch (e) {
											}
										})();
									}
									if(rs.onload){
										(function(){try{eval(rs.onload[0]);}catch(e){}})();
									}
									if(rs.propertyLoadDatas && rs.propertyLoadDatas.loadAddCss){
										(new usr.cms.editLanmuCss()).setFSELStyleByObject(rs.propertyLoadDatas.loadAddCss);
									}
									var tools = [{
										id : 'refresh',
										scope : this,
										qtip : "刷新",
										handler : function(e, target, panel) {
											this.markPanel.removeAll();
											this.doPreview();
										}
									},{
										id : 'gear',
										scope : this,
										qtip : "选项设置",
										handler : function(e, target, panel) {
											this.edieWindows(panel);
											//Ext.Msg.alert('Message', 'The Panel[' + panel.id + '] Settings tool was clicked.');
										}
									}];
										
									this.markPanel.setHeight(this.htmlPanel.getHeight());
									var children = this.getELChildren(pageEl , 'div'  , tools , this.htmlPanel.el.getXY() , this.isPlus);
									this.markPanel.add(children.length == 1 ? children[0].items || children[0]: children);
									
									this.markPanel.once("afterlayout" , function(e){
										this.markWindow.body.unmask();
									});
									this.markPanel.doLayout();					
								}.createDelegate(this) , 300);
							}, this ,true);	
						} else
							Ext.msg("error", "预览页面生成失败。原因 ： " + '<br>' + result.message);
					},
			failure : function(response, options){
				this.markWindow.body.unmask();
				Ext.msg("error", "预览页面生成失败。<br>请刷新页面重试。");
			}
		})		
	}
}