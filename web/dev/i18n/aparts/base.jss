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

}();
