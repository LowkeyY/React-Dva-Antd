Ext.namespace('lib.PasswordField');
loadcss("lib.PasswordField.PasswordField");
/*
 * 继承于Ext.form.TextField,提供了密码强度检测和动态提示,还有大写锁定检测
 <pre>
使用方法:

var password = new Ext.ux.PasswordField({
	width: 200,
	name:'ups',
	showCapsWarning: true,
	showStrengthMeter: true								
});

属性设定:

showCapsWarning:是否显示大写锁定提示,默认true.
showStrengthMeter:是否显示密码强度提示,默认false.

 * 
 </pre>
 */

lib.PasswordField.PasswordField = function(config) {
	if (!config)
		config = {};
	lib.PasswordField.PasswordField.superclass.constructor.call(this, config);
	this.showCapsWarning = config.showCapsWarning || true;
	this.showStrengthMeter = config.showStrengthMeter || false;
	this.pwStrengthTest = config.pwStrengthTest || this.calcStrength;
	this.pwStrengthMeterCls = config.pwStrengthMeterCls
			|| 'x-form-password-strengthMeter';
	this.pwStrengthMeterFocusCls = config.pwStrengthMeterFocusCls
			|| 'x-form-password-strengthMeter-focus';
	this.pwStrengthScoreBarCls = config.pwStrengthScoreBarCls
			|| 'x-form-password-scoreBar';
};

Ext.extend(lib.PasswordField.PasswordField, Ext.form.TextField, {
	inputType : 'password',
	// private
	onRender : function(ct, position) {
		lib.PasswordField.PasswordField.superclass.onRender.call(this, ct, position);

		if (this.showCapsWarning) {
			var id = Ext.id();
			this.alertBox=new Ext.ToolTip({
				target:this.el,
				disabled:true,
				anchor: 'top',
				dismissDelay:5000,
				anchorOffset: 85, 
				html: '<img src="/lib/PasswordField/images/warn.gif" style="margin-right:10px;"/><font style="font-size:12px"><B>'+'大写锁定已打开'.loc()+'</B><p>'+'大写锁定打开可能会使你输入错误的密码.按下键盘上的Caps Lock键可以关闭大写锁定'.loc()+'.</font>'
			});
		}
		if (this.showStrengthMeter) {
			this.objMeter = ct.createChild({
						tag : "div",
						'class' : this.pwStrengthMeterCls
					});
			this.objMeter.setWidth(ct.first('INPUT').getWidth(false));
			this.scoreBar = this.objMeter.createChild({
						tag : "div",
						'class' : this.pwStrengthScoreBarCls
					});
			if (Ext.isIE && !Ext.isIE7) {
				this.objMeter.setStyle('margin-left', '3px');
			}
		}
	},
	afterRender : function() {
		lib.PasswordField.PasswordField.superclass.afterRender.call(this);
		if (this.showStrengthMeter) {
			this.objMeter.setWidth(this.el.getWidth(false));
		}
	},
	initEvents : function() {
		lib.PasswordField.PasswordField.superclass.initEvents.call(this);

		this.el.on('keypress', this.handleKeypress, this);
		this.el.on('blur', this.handleBlur, this);
		this.el.on('focus', this.handleFocus, this);
		this.el.on('keyup', this.handleKeyUp, this);
	},
	handleFocus : function(e) {
		if (!Ext.isOpera && this.showStrengthMeter) {
			this.objMeter.addClass(this.pwStrengthMeterFocusCls);
		}
	},
	handleBlur : function(e) {
		if (!Ext.isOpera && this.showStrengthMeter) {
			this.objMeter.removeClass(this.pwStrengthMeterFocusCls);
		}
		if (this.showCapsWarning) {
			this.hideCapsMessage();
		}
	},
	handleKeypress : function(e) {
		var charCode = e.getCharCode();
		if (charCode == e.ESC) {
			this.setRawValue('');
		}
		if (this.showCapsWarning) {
			if ((e.shiftKey && charCode >= 97 && charCode <= 122)
					|| (!e.shiftKey && charCode >= 65 && charCode <= 90)// 测试capslock是否按下
			) {
				this.showCapsMessage(e.target);
			} else {
				this.hideCapsMessage();
			}
		}
	},
	handleKeyUp : function(e) {
		if (this.showStrengthMeter) {
			this.updateMeter(e);
		}
	},
	showCapsMessage : function(el) {
		this.alertBox.enable();
		this.alertBox.show();
	},
	hideCapsMessage : function() {
		this.alertBox.hide();
		this.alertBox.disable();
	},
	/**
	 * 显示密码强度
	 */
	updateMeter : function(e) {
		var score = 0
		var p = e.target.value;

		var maxWidth = this.objMeter.getWidth() - 2;

		var nScore = this.pwStrengthTest(p);

		if (nScore > 100) {
			nScore = 100;
		}

		var scoreWidth = (maxWidth / 100) * nScore;

		this.scoreBar.setWidth(scoreWidth, true);
	},
	/**
	 * 测密码强度,打分
	 */
	calcStrength : function(p) {
		var intScore = 0;

		if (p.length == 0)
			return (intScore);

		intScore += p.length;

		if (p.length > 0 && p.length <= 4) {
			intScore += p.length;
		} else if (p.length >= 5 && p.length <= 7) {
			intScore += 6;
		} else if (p.length >= 8 && p.length <= 15) {
			intScore += 12;
		} else if (p.length >= 16) {
			intScore += 18;
		}

		if (p.match(/[a-z]/)) {
			intScore += 1;
		}
		if (p.match(/[A-Z]/)) {
			intScore += 5;
		}
		if (p.match(/\d/)) {
			intScore += 5;
		}
		if (p.match(/.*\d.*\d.*\d/)) {
			intScore += 5;
		}

		if (p.match(/[!,@,#,$,%,^,&,*,?,_,~]/)) {
			intScore += 5;
		}
		if (p.match(/.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~]/)) {
			intScore += 5;
		}

		if (p.match(/(?=.*[a-z])(?=.*[A-Z])/)) {
			intScore += 2;
		}
		if (p.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)) {
			intScore += 2;
		}
		if (p
				.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!,@,#,$,%,^,&,*,?,_,~])/)) {
			intScore += 2;
		}
		return Math.round(intScore * 2);
	}
});
Ext.reg('passwordfield',lib.PasswordField.PasswordField);