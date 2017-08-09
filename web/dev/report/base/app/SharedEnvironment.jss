

Ext.namespace("dev.report.base");
Ext.namespace("dev.report.base.app");
dev.report.base.app.SharedEnvironment = function() {
	this.defaultSelection = null;
	this.formulaSelection = null;
	this.copySelection = null;
	this.headerMarkMode = "";
	this.headerStyle = 0;
	this.lastMarkMode = 0;
	this.inputField = null;
	this.selectedCell = "";
	this.selectedCellCoords = [];
	this.lastCell = null;
	this.lastCellCoords = [];
	this.selectedCellValue = "";
	this.selectedCellFormula = "";
	this.selectedRowNumericName = "";
	this.selectedColumnName = "";
	this.selectedAbsRowNameNumeric = "";
	this.selectedAbsColumnName = "";
	this.selectedRowName = "";
	this.viewMode = dev.report.base.grid.viewMode.USER;
	this.inputMode = dev.report.base.grid.GridMode.READY;
	this.lastRangeStartCoord = [];
	this.lastRangeEndCoord = [];
	this.editingDirectly = false;
	this.oldValue = "";
	this.lastInputValue = "";
	this.activeNewArea = false;
	this.mousePosition = "";
	this.headerResizeType = dev.report.base.grid.headerType.NONE;
	this.headerResizeCoord = 0;
	this.headerResize = [];
	this.gridScreenCoords = [[], []];
	this.gridScreenCoordsMax = null;
	this.gridPosOffset = [0, 0];
	this.autoScroll = null;
	this.undoState = [0, 0];
	this.undoValue = null;
	this.redoValue = null;
	this.dynaranges = {};
	this.HBMode = dev.report.base.hb.HBMode.DESIGNER
};