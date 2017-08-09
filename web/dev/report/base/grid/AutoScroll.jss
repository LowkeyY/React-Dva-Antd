
Ext.namespace("dev.report.base.grid");
dev.report.base.grid.AutoScroll = function(sheet) {
	var that = this, _sheet = sheet, _book = _sheet._book, _panes = _sheet._panes, _pane = _sheet._aPane, _env = _sheet._env.shared, _hook = null, _isScrolling = {
		h : false,
		v : false
	}, _defScrollSteps = [[25, 250], [50, 150], [75, 50], [100, 25]];
	this.scrollElem = false;
	function _calcScrollSpeed(scrollArea, position) {
		var scrollPerc = position * 100 / scrollArea;
		for (var i = 0; i < _defScrollSteps.length; ++i) {
			if (scrollPerc <= _defScrollSteps[i][0]) {
				return _defScrollSteps[i][1]
			}
		}
	}
	function _stopScroll(ev) {
		clearTimeout(that.scrollElem);
		var scrollType = dev.report.base.grid.scrollType;
		if (_pane._conf.hscroll) {
			_pane._hScroll.stop()
		}
		if (_pane._conf.vscroll) {
			_pane._vScroll.stop()
		}
		dev.report.base.app.mouseUpObserver.unsubscribe(_stopScroll);
		if (_hook != null) {
			_book.scrollObserver.unsubscribe(_hook);
			_hook = null
		}
		_isScrolling.h = _isScrolling.v = false
	}
	this.checkAndScroll = function(ev, hook, direction, innerOffset, scope) {
		_hook = hook;
		var gridScreenCoords = dev.report.base.app.environment.gridScreenCoords, scrollType = dev.report.base.grid.scrollType, horScrollDir = dev.report.base.grid.horScrollDir, vertScrollDir = dev.report.base.grid.vertScrollDir, scrollAction = 0;
		var cbStartScrollGrid = function() {
			if (direction == scrollType.ALL || direction == scrollType.VERT) {
				if (ev.clientY >= gridScreenCoords[0][1]
						&& ev.clientY <= gridScreenCoords[1][1]) {
					if (_pane._conf.vscroll) {
						_pane._vScroll.stop()
					}
					_isScrolling.v = false
				} else {
					dev.report.base.app.mouseUpObserver.subscribe(_stopScroll, scope);
					if (hook != null) {
						_book.scrollObserver.subscribe(hook, scope)
					}
					if (_pane._conf.vscroll) {
						if (ev.clientY > gridScreenCoords[1][1]) {
							_pane._vScroll
									.start(
											undefined,
											vertScrollDir.DOWN,
											_calcScrollSpeed(
													gridScreenCoords[2][1]
															- gridScreenCoords[1][1],
													ev.clientY
															- gridScreenCoords[1][1]))
						} else {
							_pane._vScroll
									.start(undefined, vertScrollDir.UP,
											_calcScrollSpeed(
													gridScreenCoords[0][1],
													gridScreenCoords[0][1]
															- ev.clientY))
						}
						_isScrolling.v = true
					}
				}
			}
		};
		if (direction == scrollType.ALL || direction == scrollType.HORIZ) {
			if (innerOffset == undefined) {
				if (ev.clientX < gridScreenCoords[0][0]) {
					scrollAction--
				} else {
					if (ev.clientX > gridScreenCoords[1][0]) {
						scrollAction++
					}
				}
			} else {
				if (ev.clientX >= gridScreenCoords[0][0]
						&& ev.clientX <= gridScreenCoords[0][0] + innerOffset) {
					scrollAction--
				} else {
					if (ev.clientX >= gridScreenCoords[1][0] - innerOffset
							&& ev.clientX <= gridScreenCoords[1][0]) {
						scrollAction++
					}
				}
			}
			if (scrollAction == 0) {
				if (_pane._conf.hscroll) {
					_pane._hScroll.stop()
				}
				_isScrolling.h = false
			} else {
				dev.report.base.app.mouseUpObserver.subscribe(_stopScroll, scope);
				if (hook != null) {
					_book.scrollObserver.subscribe(hook, scope)
				}
				if (_pane._conf.hscroll) {
					if (scrollAction > 0) {
						_pane._hScroll
								.start(
										[this, cbStartScrollGrid],
										horScrollDir.RIGHT,
										(innerOffset == undefined)
												? _calcScrollSpeed(
														gridScreenCoords[2][0]
																- gridScreenCoords[1][0],
														ev.clientX
																- gridScreenCoords[1][0])
												: _defScrollSteps[1][1])
					} else {
						_pane._hScroll.start([this, cbStartScrollGrid],
								horScrollDir.LEFT, _calcScrollSpeed(
										gridScreenCoords[0][0],
										gridScreenCoords[0][0] - ev.clientX))
					}
					_isScrolling.h = true;
					return
				}
			}
		}
		cbStartScrollGrid()
	};
	this.syncActivePane = function() {
		_pane = _sheet._aPane
	};
	this.getActivePane = function() {
		return _pane
	};
	this.setActivePane = function(pane) {
		_pane = pane
	};
	this.isScrolling = function() {
		return _isScrolling.h || _isScrolling.v
	}
};