
Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.dlg");
Ext.namespace("dev.report.base.dlg.format");
using("lib.tristate.TriCheckbox");
dev.report.base.dlg.format.Protection = function(callback, _pre, isFromOther,
		tabOffset) {
	var env = dev.report.base.app.environment, rngStartCoord = env.lastRangeStartCoord, rngEndCoord = env.lastRangeEndCoord, inputCheckBoxValue = isFromOther
			? _pre
			: dev.report.base.app.activePane.getRangeLock([rngStartCoord[0],
					rngStartCoord[1], rngEndCoord[0], rngEndCoord[1]]);
	inputCheckBoxValue = (inputCheckBoxValue == undefined || inputCheckBoxValue === "")
			? null
			: inputCheckBoxValue;
	var isLockedTriCB = new lib.tristate.TriCheckbox({
				name : "isLockedcb",
				xtype : "tri-checkbox",
				boxLabel : "Locked".localize(),
				id : "tribox",
				fieldLabel : "Locked".localize(),
				hideLabel : true,
				checked : inputCheckBoxValue,
				listeners : {
					check : function(cmp, state) {
					}
				}
			});
	var protectionTab = new Ext.Panel({
		baseCls : "x-title-f",
		labelWidth : 100,
		labelAlign : "left",
		frame : false,
		bodyStyle : "padding: 10px; color: #000000; font-size: 9pt; background-color: transparent;",
		header : false,
		monitorValid : true,
		autoHeight : true,
		autoWidth : true,
		listeners : {
			doLock : function(callback) {
				var outputCheckBoxValue = isLockedTriCB.getValue();
				if (!isFromOther) {
					if (outputCheckBoxValue == null) {
						return
					}
					if (inputCheckBoxValue != outputCheckBoxValue) {
						dev.report.base.app.activeSheet.setRangeLock([
										rngStartCoord[0], rngStartCoord[1],
										rngEndCoord[0], rngEndCoord[1]],
								outputCheckBoxValue)
					}
				} else {
					callback((inputCheckBoxValue != outputCheckBoxValue)
							? outputCheckBoxValue
							: null)
				}
			}
		},
		items : [isLockedTriCB, new Ext.form.Checkbox({
							hideLabel : true,
							name : "hidden",
							tabIndex : 2 + tabOffset,
							disabled : true,
							boxLabel : "Hidden".localize()
						}), {
					html : "Locking cells or hiding formulas has no effect until you protect the worksheet."
							.localize(),
					baseCls : "x-plain"
				}]
	});
	callback(protectionTab)
};