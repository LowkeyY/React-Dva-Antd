Ext.i18n = function() {
	String.prototype.loc = function() {
		var trans = Ext.i18n.map[this];
		return Ext.isDefined(trans) ? trans : this;
	};
	var loadedDir = {};
	return {
		loadUserConfig : function(config) {
			if (Ext.isDefined(config.locale))
				this.enabled = true;
		},
		enabled : false,
		map : {},
		apply : function(object) {
			if (Ext.isObject(object.i18n))
				Ext.apply(this.map, object.i18n);

		},
		cvtExt : function(fmt) {
			if (!fmt)
				return "";
			var c = fmt.split("'");
			for (var i = 0; i < c.length; i++) {
				if (i % 2 == 0) {
					c[i].indexOf("y") != -1
							&& (c[i] = c[i].replace(/yyyy/g, "Y"))
							&& (c[i] = c[i].replace(/yy/g, "y"))
					c[i].indexOf("d") != -1
							&& (c[i] = c[i].replace(/dd/g, "d"))
							&& (c[i] = c[i].replace(/d/g, "j"))
					c[i].indexOf("H") != -1
							&& (c[i] = c[i].replace(/HH/g, "H"))
							&& (c[i] = c[i].replace(/H/g, "G"))
					c[i].indexOf("h") != -1
							&& (c[i] = c[i].replace(/hh/g, "h"))
							&& (c[i] = c[i].replace(/h/g, "g"))
					c[i].indexOf("m") != -1
							&& (c[i] = c[i].replace(/mm/g, "i"))
							&& (c[i] = c[i].replace(/m/g, "i"))
					c[i].indexOf("M") != -1
							&& (c[i] = c[i].replace(/MMMM/g, "F"))
							&& (c[i] = c[i].replace(/MM/g, "m"))
							&& (c[i] = c[i].replace(/M/g, "n"))
					c[i].indexOf("E") != -1
							&& (c[i] = c[i].replace(/EEEE/g, "l"))
							&& (c[i] = c[i].replace(/EE/g, "D"))
					c[i].indexOf("s") != -1
							&& (c[i] = c[i].replace(/ss/g, "s"))
					c[i].indexOf("a") != -1 && (c[i] = c[i].replace(/a/g, "A"));
					(c[i].indexOf("z") != -1 || c[i].indexOf("Z") != -1)
							&& (c[i] = c[i].replace(/z|Z/g, "O"))
				} else {
					c[i] = c[i]
							.replace(
									/(d|D|j|l|N|S|w|z|W|F|m|M|n|t|L|o|Y|y|a|A|g|G|h|H|i|s|u|O|P|T|Z|c|U)/g,
									"\\$1");
				}
			}
			return c.join("");
		},
		DateLong : 0,
		DateShort : 1,
		TimeLong : 2,
		TimeShort : 3,
		DateTimeLong : 4,
		DateTimeShort : 5,
		transDate : function(format) {
			if (!Ext.isDefined(WorkBench.dateFormat)) {
				WorkBench.dateFormat = [this.cvtExt(WorkBench.dateLong),
						this.cvtExt(WorkBench.dateShort),
						this.cvtExt(WorkBench.timeLong),
						this.cvtExt(WorkBench.timeShort),
						this.cvtExt(WorkBench.dateTimeLong),
						this.cvtExt(WorkBench.dateTimeShort)]
			}
			if (Ext.isString(value)) {
				value = Date.parseDate(value + " " + WorkBench.timeoffset,
						'Y/m/d O');
				return Date.format(WorkBench.dateFormat[format]);
			} else if (Ext.isDate(value)) {
				var pfx = (WorkBench.timeoffset.substring(0, 1) == "+")
						? 1
						: -1;
				var hr = WorkBench.timeoffset.substring(1, 3) * pfx;
				var mi = WorkBench.timeoffset.substring(4, 6) * pfx;
				value.add(Date.HOUR, hr);
				value.add(Date.MINUTE, mi);
				return Date.format(WorkBench.dateFormat[format]);
			}
			return value;
		},
		loadLanguagePackage : function(dirs) {
			if (!Ext.isDefined(loadedDir[dirs])) {
				var ns = dirs + ".lang";
				var lang = ns + "." + WorkBench.locale
				Ext.ns(ns);
				using(lang);
				eval("lang=" + ns);
				Ext.apply(this.map, lang);
				delete lang;
				loadedDir[dirs] = true;
			}
		}
	};

}();var pref;

// 重写Ext.layout.FormLayout getTemplateArgs方法
pref = Ext.layout.FormLayout.prototype.getTemplateArgs;
Ext.override(Ext.layout.FormLayout, {
			getTemplateArgs : function(field) {
				var args = this.getTemplateArgsI18n(field);
				if (args.label)
					if (args.label.indexOf("<font") > -1) {
						var lb = args.label;
						args.label = lb.substring(0, lb.indexOf("<font")).loc()
								+ lb.substring(lb.indexOf("<font"));
					} else {
						args.label = args.label.loc();
					}
				return args;
			},
			getTemplateArgsI18n : pref
		});

/* 重写Ext.Button setText方法 */
pref = Ext.Button.prototype.setText;
Ext.override(Ext.Button, {
			setText : function(text) {
				if (Ext.isString(text))
					this.setTextI18n(text.loc());
			},
			setTextI18n : pref
		});

/* 重写Ext.grid.ColumnModel setConfig方法 */
pref = Ext.grid.ColumnModel.prototype.setConfig
Ext.override(Ext.grid.ColumnModel, {
			setConfigI18n : pref,
			setConfig : function(config, initial) {
				for (i = 0, len = config.length; i < len; i++) {
					if (config[i].header.indexOf("(") > -1) {
						var hd = config[i].header;
						config[i].header = hd.substring(0, hd.lastIndexOf("("))
								.loc()
								+ hd.substring(hd.lastIndexOf("("));
					} else {
						config[i].header = config[i].header.loc();
					}
					if (config[i].header.length * 7 > config[i].width)
						config[i].width = config[i].header.length * 7;
				}
				this.setConfigI18n(config, initial);
			}
		})
/* 重写Ext.menu.Item addText方法 */
pref = Ext.menu.BaseItem.prototype.initComponent;
Ext.override(Ext.menu.BaseItem, {
			initComponent : function() {
				this.initComponentI18n();
				if (this.text)
					this.text = this.text.loc()
			},
			initComponentI18n : pref
		});
/* 重写Ext.Toolbar addText方法 */
pref = Ext.Toolbar.prototype.addText;
Ext.override(Ext.Toolbar, {
			addText : function(text) {
				this.addTextI18n(text.loc());
			},
			addTextI18n : pref
		});
/* 重写Ext.Panel setTitle方法 */
pref = Ext.Panel.prototype.setTitle
Ext.override(Ext.Panel, {
			setTitle : function(title, iconCls) {
				this.setTitleI18n(title.loc(), iconCls);
			},
			setTitleI18n : pref
		});

/* 重写Ext.form.Label setText方法 */
pref = Ext.form.Label.setText
Ext.override(Ext.form.Label, {
			setText : function(text) {
				this.setTextI18n(text.loc());
			},
			setTextI18n : pref
		});
/* 重写Ext.form.Label setText方法 */
pref = Ext.form.ComboBox.prototype.initList
Ext.override(Ext.form.ComboBox, {
			initList : function() {
				this.initListI18n();
				var v = this.valueField;
				var d = this.displayField;
				if (v != d) {// 如果相同,不能翻译.
					this.view.prototype.prepareData = function(data) {
						var d = {};
						d[v] = data[v];
						d[d] = data[d].loc();
					}
				}
			},
			initListI18n : pref
		});
delete pref;/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * English Translations
 * updated to 2.2 by Condor (8 Aug 2008)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Loading...</div>';

if(Ext.data.Types){
    Ext.data.Types.stripRe = /[\$,%]/g;
}

if(Ext.DataView){
  Ext.DataView.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} selected row{1}";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Loading...";
}

Date.monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

Date.getShortMonthName = function(month) {
  return Date.monthNames[month].substring(0, 3);
};

Date.monthNumbers = {
  Jan : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  May : 4,
  Jun : 5,
  Jul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Nov : 10,
  Dec : 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

Date.parseCodes.S.s = "(?:st|nd|rd|th)";

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "Cancel",
    yes    : "Yes",
    no     : "No"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "m/d/Y");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "Today",
    minText           : "This date is before the minimum date",
    maxText           : "This date is after the maximum date",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'Next Month (Control+Right)',
    prevText          : 'Previous Month (Control+Left)',
    monthYearText     : 'Choose a month (Control+Up/Down to move years)',
    todayTip          : "{0} (Spacebar)",
    format            : "m/d/y",
    okText            : "&#160;OK&#160;",
    cancelText        : "Cancel",
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Page",
    afterPageText  : "of {0}",
    firstText      : "First Page",
    prevText       : "Previous Page",
    nextText       : "Next Page",
    lastText       : "Last Page",
    refreshText    : "Refresh",
    displayMsg     : "Displaying {0} - {1} of {2}",
    emptyMsg       : 'No data to display'
  });
}

if(Ext.form.BasicForm){
    Ext.form.BasicForm.prototype.waitTitle = "Please Wait..."
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "The value in this field is invalid";
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "The minimum length for this field is {0}",
    maxLengthText : "The maximum length for this field is {0}",
    blankText     : "This field is required",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    decimalSeparator : ".",
    decimalPrecision : 2,
    minText : "The minimum value for this field is {0}",
    maxText : "The maximum value for this field is {0}",
    nanText : "{0} is not a valid number"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Disabled",
    disabledDatesText : "Disabled",
    minText           : "The date in this field must be after {0}",
    maxText           : "The date in this field must be before {0}",
    invalidText       : "{0} is not a valid date - it must be in the format {1}",
    format            : "m/d/y",
    altFormats        : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
    startDay          : 0
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Loading...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : 'This field should be an e-mail address in the format "user@example.com"',
    urlText      : 'This field should be a URL in the format "http:/'+'/www.example.com"',
    alphaText    : 'This field should only contain letters and _',
    alphanumText : 'This field should only contain letters, numbers and _'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Please enter the URL for the link:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl+B)',
        text: 'Make the selected text bold.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Italic (Ctrl+I)',
        text: 'Make the selected text italic.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Underline (Ctrl+U)',
        text: 'Underline the selected text.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Grow Text',
        text: 'Increase the font size.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Shrink Text',
        text: 'Decrease the font size.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Text Highlight Color',
        text: 'Change the background color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Font Color',
        text: 'Change the color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Align Text Left',
        text: 'Align text to the left.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Center Text',
        text: 'Center text in the editor.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Align Text Right',
        text: 'Align text to the right.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Bullet List',
        text: 'Start a bulleted list.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numbered List',
        text: 'Start a numbered list.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hyperlink',
        text: 'Make the selected text a hyperlink.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Source Edit',
        text: 'Switch to source editing mode.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "Sort Ascending",
    sortDescText : "Sort Descending",
    columnsText  : "Columns"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(None)',
    groupByText    : 'Group By This Field',
    showGroupsText : 'Show in Groups'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Name",
    valueText  : "Value",
    dateFormat : "m/j/Y",
    trueText: "true",
    falseText: "false"
  });
}

if(Ext.grid.BooleanColumn){
   Ext.apply(Ext.grid.BooleanColumn.prototype, {
      trueText  : "true",
      falseText : "false",
      undefinedText: '&#160;'
   });
}

if(Ext.grid.NumberColumn){
    Ext.apply(Ext.grid.NumberColumn.prototype, {
        format : '0,000.00'
    });
}

if(Ext.grid.DateColumn){
    Ext.apply(Ext.grid.DateColumn.prototype, {
        format : 'm/d/Y'
    });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Drag to resize.",
    collapsibleSplitTip : "Drag to resize. Double click to hide."
  });
}

if(Ext.form.TimeField){
  Ext.apply(Ext.form.TimeField.prototype, {
    minText : "The time in this field must be equal to or after {0}",
    maxText : "The time in this field must be equal to or before {0}",
    invalidText : "{0} is not a valid time",
    format : "g:i A",
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
  });
}

if(Ext.form.CheckboxGroup){
  Ext.apply(Ext.form.CheckboxGroup.prototype, {
    blankText : "You must select at least one item in this group"
  });
}

if(Ext.form.RadioGroup){
  Ext.apply(Ext.form.RadioGroup.prototype, {
    blankText : "You must select one item in this group"
  });
};Ext.i18n.map={"电话":"Phone","载入中...":"Loading ...","数据不能提交,请修改表单中标识的错误!":"The data can not be submitted, Please modify the errors identified in the form","成功":"Success","注销":"Logout","电话号码只能是数字,/,-":"The phone number can only be digital , /, -","msn不能超过50个字符!":"msn can't be more than 50 characters","当日使用时间(分钟)":"Duration  (minutes)","加载背景":"Loading Background","手机号码只能是数字,/,-":"Phone number can only be a number, /, -","更新密码":"Update  Password","失去与服务器连接.":"Lost with the server connections.","登录":"Sign In","自动启动程序":"Autorun  Program","密码":"Password","请等待":"Please wait","密码不能超过{0}个字符!":"The password length can not be more than  { 0}","没有可供选择的主题":"No theme to choose","当日访问人次":" Visiting times","自动执行程序":"Autorun Program","无照片":"No photos","桌面启动程序":"Shortcuts Program","登录中,请等待...":" please wait ...","用户名":"User Name","显示与平台和应用相关的帮助与支持":"Display system help and support","真实姓名":"Real name","正在登录当前系统":"you are logging on the current system","个":"items","区域设置":"Localization","以其他用户登录":"Logon with other user","个人设置":"Setup","单次停留(分钟)":"Duration per time (minutes)","没有可供选择的墙纸":"No wallpaper to choose","职责说明":"Job Description","帮助":"Help","无法连接服务器":"Unable to connect to the server","点击此处上传照片":"Click here to upload photos","恢复":"Restore","最小化":"Minimize","最大化":"Maximize","错误":"Error","不能更新口令,确认密码与新密码不一致!":"Can not update the password , confirm password is inconsistent with the new password","开始":"Start","使用信息":"The use of information","空间信息":"Spatial information .","平铺":"Tile","系统已自动锁定":"The system has been automatically locked","个人信息":"Personal information .","系统定义导航，但没有加载任何程序，不能显示!":"System defined navigation, but does not load any program to display","任务栏透明处理":"Taskbar transparency ","确认密码必须提供.":"please confirm you have  provided password ","选择背景色":"Background color","登录失败":"Login failed","真实姓名必须提供.":"Real name must be provided.","手机最大值不能大于 {0}":"Phone's maximum value can not be greater than {0 }","选择墙纸布局方式?":"Wallpaper layout ","登录成功,但恢复之前操作失败,请重新操作.":"Login is successful, but before the recovery operation failed , please try again .","拉伸":"Stretch","{0}-{1}条 共:{2}条":"{0} - {1} : {2}","新密码必须提供.":"The new password must be provided.","窗口颜色与外观":"Color and Appearance ","个主题":"Themes","选择字体颜色":"Font color","照片":"Photos","共有":"Total:","缺省主题":"Default theme","基础信息":"Basic information","服务器发生错误,不能正常保存配置信息.":"The server encountered an error , does not save the configuration information.","日期":"Date","重置和更新个人信息!":"Reset and update personal information","修改密码":"Change Password","关闭":"Close","没有数据":"No data","访问记录":"Access Records","请输入密码":"Please enter your  password","设置个人信息":"Set the personal information","完成":"Done","旧密码":"Old password","确认密码":"Confirm the password","保存":"Save","确认密码不能超过{0}个字符!":"Confirm password not more than { 0} characters","照片文件":"Photo files","载入完成.":" Loading  finished ","缺省墙纸":"Default wallpaper","家庭电话":"Home phone","锁定屏幕":"Lock","真实姓名不能超过{0}个字符!":"The real name can not be more than { 0} characters long","没有要显示的墙纸":"No  wallpaper to  display ","保存成功.":"Successfully saved.","您确认从系统中注销?":"Do you  confirm the logout from the system ?","外观设置":"Appearance settings","快捷工具栏":"Quickstart Program","参数传递错误":"Parameter passing errors","旧密码必须提供.":"The old password must be provided.","数据载入中...":"Loading ...","电子邮件":"E-mail","载入中":"Loading","新密码":"New password","新密码不能超过{0}个字符!":"The new password can not exceed { 0} characters long","职责说明不能超过{0}个字符!":"Job Description can not exceed { 0} characters .","桌面背景":"Desktop Background","数据提交失败!,原因:<br>":"Data submission failed Reasons :","选择语言":"Select Language","访问日志":"Access log .","手机":"Phone"}