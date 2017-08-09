

Ext.namespace("dev.report.base");
using("dev.report.util.Interface");
dev.report.base.Events =  function() {
	this.WSSPlugin = new dev.report.util.Interface("WSSPlugin", [
					"openWorkbook_before", "openWorkbook_after",
					"closeWorkbook_before", "closeWorkbook_after",
					"switchWorkbook_before", "switchWorkbook_after",
					"saveAsWorkbook_before", "saveAsWorkbook_after",
					"newWorkbook_before", "newWorkbook_after",
					"hideWorkbook_before", "hideWorkbook_after",
					"unhideWorkbook_before", "unhideWorkbook_after",
					"importWorkbook_before", "importWorkbook_after", "openURL",
					"openOther", "replaceNode_before", "replaceNode_after",
					"refreshLayout", "showMsg", "openCellInput",
					"globalMouseDown", "openChooseElementsDlg"]);
	this.triggers = {
		openWorkbook_before : [],
		openWorkbook_after : [],
		closeWorkbook_before : [],
		closeWorkbook_after : [],
		switchWorkbook_before : [],
		switchWorkbook_after : [],
		saveAsWorkbook_before : [],
		saveAsWorkbook_after : [],
		newWorkbook_before : [],
		newWorkbook_after : [],
		hideWorkbook_before : [],
		hideWorkbook_after : [],
		unhideWorkbook_before : [],
		unhideWorkbook_after : [],
		importWorkbook_before : [],
		importWorkbook_after : [],
		openURL : [],
		openOther : [],
		replaceNode_before : [],
		replaceNode_after : [],
		refreshLayout : [],
		showMsg : [],
		openCellInput : [],
		globalMouseDown : [],
		openChooseElementsDlg : []
	};
	var _disabled = {};
	this.registerPlugin = function(plugin) {
		try {
			dev.report.util.Interface.ensureImplements(plugin, this.WSSPlugin);
			var events = plugin.getTriggerInfo();
			for (var event in events) {
				if (this.triggers[event] != undefined) {
					this.triggers[event].push([plugin, events[event]])
				}
			}
			return true
		} catch (e) {
			return false
		}
	};
	this.disableEvents = function(events) {
		for (var i = events.length - 1; i >= 0; i--) {
			if (this.triggers[events[i]]) {
				_disabled[events[i]] = this.triggers[events[i]];
				this.triggers[events[i]] = []
			}
		}
	};
	this.enableEvents = function(events) {
		for (var i = events.length - 1; i >= 0; i--) {
			if (_disabled[events[i]]) {
				this.triggers[events[i]] = _disabled[events[i]];
				delete _disabled[events[i]]
			}
		}
	}
};