var WorkBench = WorkBench || {};

WorkBench.len = 0;
WorkBench.modules = [];

WorkBench.language = 'cn';
WorkBench.date_format = 'Y-m-d';
WorkBench.timezone = 'Asia/Shanghai';
WorkBench.date_seperator = '/';
WorkBench.time_format = "G:i";
WorkBench.first_weekday = '1';
WorkBench.thousands_seperator = ',';
WorkBench.decimal_seperator = '.';
WorkBench.currency = '￥';
WorkBench.unit = 'metric';
WorkBench.potal_user_token = "";

WorkBench.menuHeight = 150;

WorkBench.con = new Ext.data.Connection();
WorkBench.connectionConfig = {
	method : 'GET',
	url : '/home/system/getmenu.jcp?rand=' + Math.random()
}
WorkBench.con.request(WorkBench.connectionConfig);
WorkBench.con.on('requestcomplete', function(con, oResponse) {
	//alert(Ext.lib.Dom.getViewWidth() + "," + );
	var moduleJSON = Ext.decode(oResponse.responseText);
	if(Ext.isDefined(moduleJSON.userToken))
		WorkBench.potal_user_token = moduleJSON.userToken;
	var menuItemArray = moduleJSON.menu;
	if(Ext.i18n && Ext.isFunction(Ext.i18n.apply))
		Ext.i18n.apply(moduleJSON);
	WorkBench.len = menuItemArray.length;
	if (WorkBench.len < 6) {
		WorkBench.menuHeight = 148;
	} else if (WorkBench.len < 12) {
		if (Ext.isIE) {
			WorkBench.menuHeight = 28 * WorkBench.len;
		} else {
			WorkBench.menuHeight = 29 * WorkBench.len;
		}
	} else {
		if (Ext.isIE) {
			WorkBench.menuHeight = 26 * WorkBench.len;
		} else {
			WorkBench.menuHeight = 27 * WorkBench.len;
		}
	}
	
	function isPotal(conf){
		return (conf.sys_version && conf.sys_app_id);
	}
	
	function getX(r , x , w){
		if(r === true && w){
			var rx = Ext.getBody().getWidth() - w - x;
			return rx <= 0 ? x : rx;
		}
		return x;
	}
	
	function wiseSize(src) {
		if(isPotal(src)){
			return {
				x : getX(src.default_postion === 'false' , (src.default_x || 0) , (src.default_width || 0)),
				y : src.default_y || 0,
				winWidth : src.default_width || 0,
				winHeight : src.default_height || 0,
				winDraggable : src.default_win_postion === 'true',
				winResizable : src.default_win_size === 'true'
			};
		}
		return {
			x : src.x || 0,
			y : src.y || 0,
			winWidth : src.width || 0,
			winHeight : src.height || 0,
			winDraggable : false,
			winResizable : true
		};
	}
	
	function urlValid(url){
		if(url && /^((https|http|ftp|rtsp|mms)?:\/\/)/i.test(url))
			return 'true';
		return 'false';
	}
	
	function getPotalBaseConf(conf){
		if(isPotal(conf))
			return Ext.apply({
				appid : conf.sys_app_id,
				apptoken : conf.default_token
			} , getUserBaseConf())
		return {};
	}
	
	function getUserBaseConf(){
		var o = {} , tk = WorkBench.potal_user_token;
		if(tk && (tk = tk.split("::")).length > 1){
			o["username"] = tk[0];
			o["userpwd"] = tk[1];
		}
		return o;
	}
	
	function replaceBaseParam(url , o){
		if(!o)
			o = getUserBaseConf();
		while(r = /@\[(.+?)\]/ig.exec(url)){
			var v = r[1];
			if(!(v && (v = o[v.toLowerCase()])))
				v = "";
			url = url.replace(r[0] , v)
		}
		return url;
	}
	
	function packPotalConfig(conf){
		var o = getPotalBaseConf(conf);
		for(var att in conf)
			if(conf.hasOwnProperty(att) && /(_url|_value)$/i.test(att))
				conf[att] = replaceBaseParam(conf[att] , o);
	}
	
	function setPotals(conf){
		if(isPotal(conf)){
			return {
				openType : conf.default_open_type,
				desktopShow : conf.show_desktop_isValid === 'true',
				desktopIcon : conf.show_desktop_icon_url || conf.default_icon_url,
				startmenuShow : conf.show_startmenu_isValid === 'true',
				startmenuIcon : '/themes/icon/' + (conf.show_startmenu_icon_url || conf.default_icon_url),
				fastlinkShow : conf.show_fastlink_isValid === 'true',
				fastlinkIcon : '/themes/icon/' + (conf.show_fastlink_icon_url || conf.default_icon_url),
				faceAppUrl : conf.face_app_isValid === 'true' ? conf.face_app_url : '',
				faceAppIsUpdate : conf.face_app_isUpdate === 'true',
				faceAppUpdateTimer :  conf.face_app_update_timer * 1000 || 60000
			}
		}
		return {};
	}
	
	function packMenuConfig(conf){
		if(isPotal(conf)){
			packPotalConfig(conf);
			conf.id = conf.sys_app_id;
			conf.title = conf.default_title;
			conf.path = conf.default_url;
			conf.deskIcon = conf.show_desktop_icon_url || conf.default_icon_url;
			conf.icon = conf.show_startmenu_icon_url || conf.default_icon_url;
			conf.url = conf.default_url;
			conf.isIframe = urlValid(conf.default_url);
		}
		return conf;
	}
	
	
	for (var i = 0; i < menuItemArray.length; i++) {
		var menuItem = packMenuConfig(menuItemArray[i]);
		var id = menuItem.id;
		var title = menuItem.title;

		var iconLink = menuItem.icon;
		var link = menuItem.path;
		var parent = menuItem.parent;
		var menuStyle = menuItem.menuStyle;
		var deskIcon = menuItem.deskIcon;
		var isIFrame = menuItem.isIframe;

		var subMenu = [];
		var subModule = [];

		var haveSubMenu = false;

		if (menuItem.submenu) {
			var submenuArray = menuItem.submenu;
			var subMenuLength = submenuArray.length;
			if (subMenuLength > 0)
				haveSubMenu = true;

			for (var j = 0; j < subMenuLength; j++) {

				var subMenuItem = submenuArray[j];

				var subId = subMenuItem.id;
				var subTitle = subMenuItem.title;
				var subIconLink = subMenuItem.icon;
				var subLink = subMenuItem.path;
				var subParent = subMenuItem.parent;
				var menuStyle = subMenuItem.menuStyle;
				var subdeskIcon = subMenuItem.deskIcon;
				var subIsIFrame = subMenuItem.isIframe;
				var size = wiseSize(subMenuItem);
				subIconLink = '/themes/icon/' + subIconLink;
				var subMenuObj = Ext.apply({
							text : subTitle,
							icon : subIconLink,
							menuStyle : menuStyle,
							url : subLink,
							handler : null,
							scope : null,
							deskIcon : subdeskIcon,
							isIFrame : subIsIFrame,
							windowId : 'module_' + subId
						}, size);
				subMenu.push(subMenuObj);
				var Module = new WorkBench.menuModule({
							moduleId : 'module_' + subId,
							moduleType : 'SubApplication'
						});

				Module.initLancher(Ext.apply({
							text : subTitle,
							icon : subIconLink,
							url : subLink,
							type : 'module',
							deskIcon : subdeskIcon,
							isIFrame : subIsIFrame,
							windowId : 'module_' + subId
						}, size));

				subModule.push(Module);
				WorkBench.modules.push(Module);
			}
		}
		iconLink = '/themes/icon/' + iconLink;
		if (haveSubMenu) {
			var Module = new WorkBench.LauncherModule({
						moduleId : 'module_' + id,
						moduleType : 'Application'
					});
			Module.initLancher({
						text : title,
						menuStyle : menuStyle,
						icon : iconLink,
						handler : function() {
							return false;
						},
						menu : subMenu,
						subModules : subModule
					});
			WorkBench.modules.push(Module);
		} else {
			var Module = new WorkBench.menuModule({
						moduleId : 'module_' + id,
						moduleType : 'Application'
					});
			Module.initLancher(Ext.apply({
						text : title,
						icon : iconLink,
						menuStyle : menuStyle,
						url : link,
						deskIcon : deskIcon,
						isIFrame : isIFrame,
						windowId : 'module_' + id
					}, wiseSize(menuItem) , setPotals(menuItem)));
			WorkBench.modules.push(Module);
		}
	};

	WorkBench.Desk = new Ext.app.App({
		init : function() {
			Ext.form.Field.prototype.msgTarget = 'side';
			Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';
			Ext.QuickTips.init();
		},
		getModules : function() {
			var personalSet = new etc.configure.PersonalSet();
			personalSet.app = this;
			personalSet.init();
			WorkBench.modules.push(personalSet);
/*			using('home.system.help.help');
			var help = new WorkBench.Help();
			help.app = this;
			help.init();
			WorkBench.modules.push(help);*/
			return WorkBench.modules;
		},
		getStartConfig : function() {
			return {
				iconCls : 'user',
				title : get_cookie('memberName'),
				toolPanelWidth : 110,
				height : WorkBench.menuHeight
			};
		},
		getStartItemsConfig : function() {
			var systemItems = [];
			if(get_cookie('real_name'))
				systemItems.push({
					disabled : true,
					disabledClass : 'icon-user-item-disabled',
					iconCls:'icon-user',
					text: get_cookie('real_name'),
					handler : Ext.emptyFn
				});
			
			var personalSet = new etc.configure.PersonalSet();
			personalSet.app = this;
			personalSet.init();
			systemItems.push(personalSet.launcher);
/*			using('home.system.help.help');
			var help = new WorkBench.Help();
			help.app = this;
			help.init();
			systemItems.push(help.launcher);*/

			var ms = WorkBench.modules;
			if (ms) {
				var sm = {
					menu : {
						items : []
					}
				};
				var smi = sm.menu.items;
				smi.push({
							text : 'startmenu',
							menu : {
								items : []
							}
						});
				return {
					items : smi[0].menu.items,
					toolItems : systemItems
				};
			}
			return null;
		},
		getDesktopConfig : function() {
			Ext.Ajax.request({
				success : function(o) {
					var cpn = Ext.decode(o.responseText);
					if (cpn.success) {
						Ext.copyTo(
										WorkBench,
										cpn,
										"locale,timezone,currency,unitSystem,dateLong,dateShort,timeShort,timeLong,dateTimeLong,dateTimeShort");
						Ext.i18n.loadUserConfig(cpn);
						WorkBench.title = cpn.config.styles.title;
						WorkBench.authType = cpn.config.styles.authType;
						if (WorkBench.title != '') {
							window.document.title = WorkBench.title.loc();
						}
						this.initDesktopConfig(cpn.config);
					}
				},
				scope : this,
				url : 'system/DesktopConfig.jcp'
			});
		},
		getLogoutConfig : function() {
			return {
				text : '注销'.loc(),
				iconCls : 'logout',
				handler : function() {
					Ext.Msg.confirm('注销'.loc(), '您确认从系统中注销?'.loc(), function(
									btn) {
								if (btn == 'yes') {
									window.legalQuit = true;
									top.location.replace('/login/logout.jcp');
								}
							}, this);
				},
				scope : this
			};
		}
	});
	delete(WorkBench.con);
	delete(WorkBench.connectionConfig);
}, this);
WorkBench.menuModule = Ext.extend(Ext.app.Module, {
			moduleType : null,
			moduleId : null,
			initLancher : function(item) {
				var params = {};
				this.launcher = {
					handler : function() {
						this.desktop = WorkBench.Desk.desktop;
						if(this.openType === 'false'){
							window.open(this.url);
						} else if (this.isIFrame == 'true') {
							var bsNode = new WorkBench.baseNode();
							bsNode.init(this);
						} else {
							var lib = this.url;
							if (lib == '') {
								// Ext.msg("warn", '系统建设中，敬请期待......'.loc());
								Ext.MessageBox.show({
											title:'提示',
											icon : Ext.MessageBox.INFO,
											msg : '系统建设中，敬请期待......',
											buttons:Ext.MessageBox.OK,
											closable:false
										})
							} else {
								var paramArray = this.url.split('?');
								lib = paramArray[0];
								var param = (paramArray.length > 1) ? Ext
										.urlDecode(paramArray[1]) : {};
								param.objectId = param.parent_id;
								Ext.apply(this, param);
								using(lib);
								var processModule = null;
								processModule = eval('new ' + lib + '()');
								processModule.init(this, param);
							}
						}
					}
				};
				Ext.apply(this.launcher, item);
			}
		});
WorkBench.LauncherModule = Ext.extend(Ext.app.Module, {
			moduleType : null,
			moduleId : null,
			initLancher : function(menuItem) {
				var subMenuList = menuItem.menu;
				var newSubMenuArr = [];
				for (var i = 0; i < subMenuList.length; i++) {
					var subMenuObj = subMenuList[i];
					subMenuObj.handler = function() {
						this.desktop = WorkBench.Desk.desktop;
						if (this.isIFrame == 'true') {
							var bsNode = new WorkBench.baseNode();
							bsNode.init(this);
						} else {
							var lib = this.url;
							if (lib == '') {
								Ext
										.msg("error", '系统定义导航,但没有加载任何程序,不能显示!'
														.loc());
							} else {
								var paramArray = this.url.split('?');
								lib = paramArray[0];
								var param = (paramArray.length > 1) ? Ext
										.urlDecode(paramArray[1]) : {};
								param.objectId = param.parent_id;
								Ext.apply(this, param);
								using(lib);
								var processModule = null;
								processModule = eval('new ' + lib + '()');
								processModule.init(this);
							}
						}
					}
					subMenuObj.scope = subMenuObj;
					newSubMenuArr.push(subMenuObj);
				}
				this.launcher = {
					text : menuItem.text,
					icon : menuItem.icon,
					url : menuItem.url,
					type : menuItem.type,
					subModules : menuItem.subModules,
					handler : menuItem.handler,
					scope : this,
					menu : {
						items : newSubMenuArr
					}
				};
			}
		});
