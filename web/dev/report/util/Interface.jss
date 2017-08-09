
Ext.namespace("dev.report.util");
dev.report.util.Interface = function(name, methods) {
	if (arguments.length != 2) {
		throw new Error("Interface constructor called with ".concat(
				arguments.length, "arguments, but expected exactly 2."))
	}
	this.name = name;
	this.methods = [];
	for (var i = 0, len = methods.length; i < len; i++) {
		if (typeof methods[i] !== "string") {
			throw new Error("Interface constructor expects method names to be passed in as a string.")
		}
		this.methods.push(methods[i])
	}
};
dev.report.util.Interface.ensureImplements = function(object) {
	if (arguments.length < 2) {
		throw new Error("Function Interface.ensureImplements called with "
				.concat(arguments.length, "arguments, but expected at least 2."))
	}
	for (var i = 1, len = arguments.length; i < len; i++) {
		var _interface = arguments[i];
		if (_interface.constructor !== dev.report.util.Interface) {
			throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface.")
		}
		for (var j = 0, methodsLen = _interface.methods.length; j < methodsLen; j++) {
			var method = _interface.methods[j];
			if (!object[method] || typeof object[method] !== "function") {
				throw new Error("Function Interface.ensureImplements: object does not implement the "
						.concat(_interface.name, " interface. Method ", method,
								" was not found."))
			}
		}
	}
};