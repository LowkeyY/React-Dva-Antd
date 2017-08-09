
Ext.namespace("dev.report.base");
dev.report.base.Hb =  function() {
	var that = this;
	this.HBMode = {
		DESIGNER : 0,
		QUICKVIEW : 1,
		USER : 2
	};
	this.addDynarange = function(item, ev) {
		function genHBName() {
			var env = dev.report.base.app.environment, cnt = that.getHBCount() + 1;
			while (env.dynaranges["DynaRange".concat(cnt)] != undefined
					&& cnt < 1000) {
				cnt++
			}
			return "DynaRange".concat(cnt)
		}
		var dir =0;
		if(item.getId().indexOf("newHBVert") >= 0){
			 dir =0;
		}else if(item.getId().indexOf("newHBHoriz") >= 0){
			 dir =1;
		}else if(item.getId().indexOf("newTitle") >= 0){
			 dir =2;
		}else if(item.getId().indexOf("newColumnHeader") >= 0){
			 dir =3;
		}else if(item.getId().indexOf("newColumnFooter") >= 0){
			 dir =4;
		}else if(item.getId().indexOf("newSummary") >= 0){
			dir =5;
		}else if(item.getId().indexOf("newGroupHeader") >= 0){
			dir =6;
		}else if(item.getId().indexOf("newGroupFooter") >= 0){
			dir =7;
		}
		hbdata = {
			id : genHBName(),
			dir : dir,
			drill : true,
			level : 2,
			border : "1px solid #000000",
			indent : dir == 0
		};
		this.subsetDlgCB(hbdata);
	};
	this.delDynarange = function(hbid) {
		var env = dev.report.base.app.environment, hbs = env.dynaranges;
		hbs[hbid].remove(true);
		delete hbs[hbid];
		env.defaultSelection.show();
		if (!that.getHBCount()) {
			that.enaDisHBQuickView("disable")
		}
	};
	this.setAllNormal = function(exceptId, redraw) {
		var env = dev.report.base.app.environment;
		if (!env) {
			return
		}
		var activeSheet = dev.report.base.app.activeSheet;
		if (env.HBMode != that.HBMode.DESIGNER || activeSheet == undefined
				|| activeSheet.isClone()) {
			return
		}
		var hbs = env.dynaranges;
		for (var hbid in hbs) {
			if (hbid == exceptId) {
				continue
			}
			if (redraw) {
				hbs[hbid].redraw()
			} else {
				hbs[hbid].show()
			}
		}
	};
	this.hideAll = function() {
		var env = dev.report.base.app.environment;
		if (env.HBMode != that.HBMode.QUICKVIEW) {
			return
		}
		var hbs = env.dynaranges;
		for (var hbid in hbs) {
			hbs[hbid].hide()
		}
	};
	this.loadAll = function(sheet) {
		function _load(res) {
			if (!(res instanceof Array)) {
				return
			}
			sheet.setInitReg("hb", res.length);
			var jwgrid = dev.report.base.grid;
			using('dev.report.base.grid.Selection');
			using('dev.report.base.grid.DynarangeSelection');
			for (var elem, hbdata, i = res.length - 1; i >= 0; i--) {
				elem = res[i];
				hbdata = elem.hbdata;
				hbdata.id = elem.id;
				//hbdata._gendata = elem._gendata;
				hbs[hbdata.id] = new jwgrid.DynarangeSelection(sheet, hbdata);
				if (sheet.isClone()) {
					hbs[hbdata.id].hide();
					that.syncCntrl(true);
					that.enaDisHBAdd("disable")
				} else {
					hbs[hbdata.id].show();
					that.syncCntrl(false);
					that.enaDisHBAdd("enable")
				}
				sheet.updInitReg("hb")
			}
		}
		var env = sheet._env.shared;
		if (!env) {
			return
		}
		var viewMode = dev.report.base.grid.viewMode, hbs = (env.dynaranges = {});
		switch (env.viewMode) {
			case viewMode.DESIGNER :
				var res=[];
				var table=dev.report.model.report.tabMap;
				var ranges=table.getRangeObject();
				for(var i in ranges){
					var range=ranges[i]
					var hbdata = {
						id : range.id,
						dir : range.type,
						drill : true,
						level : 2,
						border : "1px solid #000000",
						indent : range.type == 0
					};
					hbdata.src = [range.startRow, range.startCol,range.endRow, range.endCol];
					var elem={};
					elem.hbdata=hbdata;
					elem.id=hbdata.id;
					res.push(elem);
				}
				_load(res);
				break;
			case viewMode.USER :
				sheet.setInitReg("hb", 0);
				env.HBMode = that.HBMode.USER;
				break
		}
	};   
	this.unloadAll = function() {
		var hbs = dev.report.base.app.environment.dynaranges;
		for (var hbid in hbs) {
			hbs[hbid].remove(false)
		}
		hbs = {}
	};
	this.move = function(id, pos) {
		if (dev.report.base.app.environment.HBMode != that.HBMode.DESIGNER) {
			return
		}
		var hbs = dev.report.base.app.environment.dynaranges;
		for (var hbid in hbs) {
			if (hbs[hbid].getProps().wselid == id) {
				hbs[hbid].move(pos);
				hbs[hbid].redraw();
				break
			}
		}
	};
	this.subsetDlgCB = function(hbdata) {
		var env = dev.report.base.app.environment;
		if (env.dynaranges[hbdata.id] != undefined) {
			env.dynaranges[hbdata.id].setProps(hbdata);
			return
		}
		env.defaultSelection.hide();
		var ulCoord = env.lastRangeStartCoord, lrCoord = env.lastRangeEndCoord;
		hbdata.src = [ulCoord[0], ulCoord[1], lrCoord[0], lrCoord[1]];
		using('dev.report.base.grid.Selection');
		using('dev.report.base.grid.DynarangeSelection');
		env.dynaranges[hbdata.id] = new dev.report.base.grid.DynarangeSelection(
				dev.report.base.app.activeSheet, hbdata);
		that.enaDisHBQuickView("enable")
	};
	this.propDlgCB = function(hbdata) {
		dev.report.base.app.environment.dynaranges[hbdata.id].setProps(hbdata)
	};
	this.getHBCount = function() {
		var cnt = 0;
		for (var fld in dev.report.base.app.environment.dynaranges) {
			++cnt
		}
		return cnt
	};
	this.syncActivePane = function() {
		if (dev.report.base.app.environment.HBMode != that.HBMode.DESIGNER) {
			return
		}
		var hbs = dev.report.base.app.environment.dynaranges;
		for (var hbid in hbs) {
			hbs[hbid].syncActivePane()
		}
	};
	this.enaDisHBAdd = function(cmd) {
		if (!dev.report.base.app.environment
				|| dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		var menubar = dev.report.base.app.menubar, toolbar = dev.report.base.app.toolbar;
		if (menubar) {
			menubar.newHBVert[cmd]();
			menubar.newHBHoriz[cmd]();
			menubar.userModeView[cmd]()
		}
		toolbar.newHBVert[cmd]();
		toolbar.newHBHoriz[cmd]();
		toolbar.userModeView[cmd]();
		that.enaDisHBQuickView(that.getHBCount() ? "enable" : "disable")
	};
	this.enaDisHBQuickView = function(cmd) {
		var menubar = dev.report.base.app.menubar;
		/*if (menubar) {
			menubar.hbQuickView[cmd]()
		}*/
		//dev.report.base.app.toolbar.hbQuickView[cmd]()
	};
	this.syncCntrl = function(press) {
		if (!dev.report.base.app.environment
				|| dev.report.base.app.environment.viewMode == dev.report.base.grid.viewMode.USER) {
			return
		}
		/*dev.report.base.app.performItemToggle = false;
		var menubar = dev.report.base.app.menubar;
		if (menubar) {
			menubar.hbQuickView.setChecked(press, true)
		}
		dev.report.base.app.toolbar.hbQuickView.toggle(press);
		dev.report.base.app.performItemToggle = true
		*/
	};
	this.run = function(btn, state) {
		if (!dev.report.base.app.performItemToggle || that.getHBCount() <= 0) {
			return
		}
		var env = dev.report.base.app.environment, activeBook = dev.report.base.app.activeBook, HBMode = env.HBMode;
		if (state) {
			try {
				env.HBMode = that.HBMode.QUICKVIEW;
				var hbs = env.dynaranges, hasHbs = false;
				for (var hbid in hbs) {
					hasHbs = true;
					break
				}
				if (hasHbs) {
					var clnRes = dev.report.backend.wss.addCloneWorksheet();
					if (clnRes !== false) {
						activeBook.setClone(clnRes)
					}
					that.hideAll();
					dev.report.backend.rpc_cb("hb_run", [HBMode == that.HBMode.USER
									? null
									: 3], dev.report.backend.Q_ALL,
							dev.report.backend.D_BOTH)
				}
				that.syncCntrl(true);
				that.enaDisHBAdd("disable");
				//dev.report.base.app.statusBar.setWorkingMode("QuickView".localize())
			} catch (e) {
				env.HBMode = HBMode
			}
		} else {
			try {
				env.HBMode = that.HBMode.DESIGNER;
				var sheetSelector = activeBook.getSheetSelector();
				sheetSelector.action = sheetSelector.actionTypes.UNCLONED;
				activeBook._actOnSheetSel();
				that.setAllNormal();
				that.syncCntrl(false);
				that.enaDisHBAdd("enable");
				//dev.report.base.app.statusBar.setWorkingMode("Designer".localize())
			} catch (e) {
				env.HBMode = HBMode
			}
		}
	};
	this.regECHandlers = function() {
		dev.report.base.grid.cbReg("hb_ec", [that, that.expandCollapse])
	};
	this.expandCollapse = function(eventData, hbId, idxPath) {
		dev.report.backend.rpc_cb("hb_ec", [hbId, [eventData.c, eventData.r],
						idxPath], dev.report.backend.Q_ALL, dev.report.backend.D_BOTH);
		return false
	}
};