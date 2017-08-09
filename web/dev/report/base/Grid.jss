
Ext.namespace("dev.report.base");
dev.report.base.Grid = function() {
	this.ScrollDirection = {
		UP : 1,
		DOWN : 2,
		LEFT : 4,
		RIGHT : 8,
		DOWN_RIGHT : 10,
		UP_LEFT : 5,
		NONE : 11
	};
	this.GridMode = {
		READY : 0,
		EDIT : 1,
		INPUT : 2,
		POINT : 3,
		CNTRL : 4,
		DIALOG : 5
	};
	this.IterationMode = {
		NEXT : 0,
		PREV : 1,
		NEXTX : 2,
		PREVY : 3,
		PREVX : 4,
		NEXTY : 5,
		FIRST : 6,
		LAST : 7
	};
	this.viewMode = {
		DESIGNER : "designer",
		USER : "user",
		PREVIEW : "preview"
	};
	this.headerType = {
		COLUMN : 0,
		ROW : 1,
		NONE : 2
	};
	this.scrollType = {
		HORIZ : 0,
		VERT : 1,
		ALL : 2
	};
	this.vertScrollDir = {
		UP : -1,
		DOWN : 1
	};
	this.horScrollDir = {
		LEFT : -1,
		RIGHT : 1
	};
	this.gridOperation = {
		COPY : 0,
		CUT : 1
	};
	this.permission = {
		PERM_NONE : 0,
		PERM_READ : 1,
		PERM_WRITE : 3,
		PERM_DELETE : 7,
		PERM_SPLASH : 15
	};
	var _cbHandles = {};
	this.defMaxCoords = [256, 65536];
	this.defCachePageSize = [256, 1024];
	this.defLoadTableCoef = 1.2;
	this.defDefColRowDims = [64, 20];
	this.defCellSizeIncr = [5, 5];
	this.defScrollbarBGOffset = [2 * 17, 2 * 17];
	this.defSliderBorderElemsSize = [8, 8];
	this.defSliderCenterElemSize = [8, 8];
	this.defDefScrollSpeed = 80;
	this.defScrollSteps = [[25, 250], [50, 150], [75, 50], [100, 25]];
	this.maxGridOffset = [41, 44];
	this.cbReg = function(handle, cb) {
		if (_cbHandles[handle] != undefined || typeof cb[0] != "object"
				|| typeof cb[1] != "function") {
			return false
		}
		_cbHandles[handle] = cb;
		return true
	};
	this.cbGet = function(handle) {
		return _cbHandles[handle]
	}
};