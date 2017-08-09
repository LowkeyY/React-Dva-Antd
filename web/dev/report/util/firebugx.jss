if (!("console" in window)) {
	var names = ["log", "debug", "info", "warn", "error", "assert", "dir",
			"dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace",
			"profile", "profileEnd"];
	window.console = {};
	for (var i = names.length - 1; i >= 0; --i) {
		window.console[names[i]] = function() {
		}
	}
};