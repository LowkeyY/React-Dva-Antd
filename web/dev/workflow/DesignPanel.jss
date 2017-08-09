Ext.namespace("dev.workflow");

dev.workflow.DesignPanel = function(params, Workflow, type) {
	this.params = params;
	var ed;
	var wf;
	var condionSeq = 0;
	var onButtonClick;
	var currentWindow = null;

	this.onInit = function(editor) {
		ed = editor;
		mxShape.prototype.crisp = true;
		mxActor.prototype.crisp = false;
		mxCylinder.prototype.crisp = false;
		mxEllipse.prototype.crisp = false;
		mxDoubleEllipse.prototype.crisp = false;
		mxConnector.prototype.crisp = false;
		mxGraphHandler.prototype.guidesEnabled = true;
		mxGraphHandler.prototype.useGuidesForEvent = function(me) {
			return !mxEvent.isAltDown(me.getEvent());
		};
		mxEdgeHandler.prototype.snapToTerminals = true;
		mxConnectionHandler.prototype.connectImage = new mxImage(
				'/dev/workflow/images/connector.gif', 16, 16);
		ed.graph.setConnectable(true);
		ed.graph.connectionHandler.setCreateTarget(true);
		ed.addListener(mxEvent.SESSION, function(editor, evt) {
					var session = evt.getProperty('session');
					if (session.connected) {
						var tstamp = new Date().toLocaleString();
						editor.setStatus(tstamp + ':' + ' ' + session.sent
								+ ' bytes sent, ' + ' ' + session.received
								+ ' bytes received');
					} else {
						editor.setStatus('Not connected');
					}
				});

		ed.graph.addListener(mxEvent.CELLS_ADDED, mxUtils.bind(this, function(
								sender, evt) {
							var cellArray = evt.getProperty('cells');
							var index = evt.getProperty('index');
							var source = evt.getProperty('source');
							var target = evt.getProperty('target');
							if (cellArray != null && cellArray.length > 0) {
								ed.graph.getModel().beginUpdate();
								var successObject = Workflow.designPanel
										.createWorkflowObject(cellArray[0],
												source, target, index);
								if (successObject) {
									ed.graph.getModel().endUpdate();
								} else {
									ed.graph.getModel().remove(cellArray[0]);
									ed.graph.getModel().endUpdate();
								}
							}
						}));

		ed.graph.cellsRemoved = function(cells) {
			if (cells != null && cells.length > 0) {
				var scale = this.view.scale;
				var tr = this.view.translate;
				this.model.beginUpdate();
				try {
					var hash = new Object();
					var haveStart = false;
					var md = ed.graph.getModel();
					for (var i = 0, st; i < cells.length; i++) {
						st = md.getStyle(cells[i]);
						if (st
								&& (st == 'ellipse' || st.indexOf('start.png') != -1)) {
							haveStart = true;
							break;
						}
					}
					if (haveStart) {
						Ext.msg("error", '不能删除启动步骤!'.loc());
					} else {
						for (var i = 0; i < cells.length; i++) {
							var id = mxCellPath.create(cells[i]);
							hash[id] = cells[i];
						}
						for (var i = 0; i < cells.length; i++) {
							var edges = this.getConnections(cells[i]);
							for (var j = 0; j < edges.length; j++) {
								var id = mxCellPath.create(edges[j]);
								if (hash[id] == null) {
									var geo = this.model.getGeometry(edges[j]);
									if (geo != null) {
										var state = this.view
												.getState(edges[j]);
										if (state != null) {
											geo = geo.clone();
											var source = this.view
													.getVisibleTerminal(
															edges[j], true) == cells[i];
											var pts = state.absolutePoints;
											var n = (source) ? 0 : pts.length
													- 1;
											geo.setTerminalPoint(new mxPoint(
															pts[n].x / scale
																	- tr.x,
															pts[n].y / scale
																	- tr.y),
													source);
											this.model.setTerminal(edges[j],
													null, source);
											this.model.setGeometry(edges[j],
													geo);
										}
									}
								}
								Workflow.designPanel
										.removeWorkflowEdge(edges[j]);
							}
							Workflow.designPanel.removeWorkflowObject(cells[i]);
							this.model.remove(cells[i]);
						}
						this.fireEvent(new mxEventObject(mxEvent.CELLS_REMOVED,
								'cells', cells));
					}
				} finally {
					this.model.endUpdate();
				}
			}
		};
		funct = function(editor, cell) {
			if (cell == null
					&& editor.graph.getSelectionModel().cells.length > 0) {
				cell = editor.graph.getSelectionModel().cells[0];
			} else if (cell == null) {
				cell = editor.graph.getCurrentRoot();
				if (cell == null) {
					cell = this.graph.getModel().getRoot();
				}
			}
			setAction(cell);
		}
		ed.addAction('showActionProperties', funct);
		funct = function(editor, cell) {
			if (cell == null && ed.graph.getSelectionModel().cells.length > 0) {
				cell = editor.graph.getSelectionModel().cells[0];
			} else if (cell == null) {
				cell = editor.graph.getCurrentRoot();
				if (cell == null) {
					cell = this.graph.getModel().getRoot();
				}
			}
			setProperty(cell);
		}
		ed.addAction('showProperties', funct);
		this.initWF(ed);
		ed.graph.container.style.backgroundImage = 'url(/dev/workflow/images/grid.gif)';
	}
	onButtonClick = function(item) {
		var Workflow = this.frames.get('Workflow');
		if (item.btnId == 'script') {
			var me = this;
			using("dev.workflow.SaveWorkflow");
			var enc = new mxCodec();
			var node = enc.encode(ed.graph.getModel());
			var xmlString = mxUtils.getPrettyXml(node);
			var graphTempXml = Tool.parseXML(xmlString);
			var graphXml = graphTempXml.childNodes;
			var len1 = graphXml.length;
			var graphPart;
			for (var i = 0; i < len1; i++) {
				var elements = graphXml[i];
				if (elements.tagName == 'root')
					graphPart = elements;
			}
			if (Ext.isIE) {
				xmlString = graphPart.xml;
			} else {
				xmlString = (new XMLSerializer()).serializeToString(graphPart);
			}
			xmlString = xmlString.replace('<root>', '');
			xmlString = xmlString.replace('</root>', '');
			var workXml = ['<' + '?' + 'xml version="1.0" encoding="UTF-8"'
					+ '?' + '>\r\n'];
			workXml.push('<workflow>\n');
			workXml.push('<flowgraph>');
			workXml.push(xmlString);
			workXml.push('</flowgraph>');
			workXml.push(wf.toXML());
			workXml.push('\n</workflow>');
			Workflow.saveWorkflow = me.frames
					.createPanel(new dev.workflow.SaveWorkflow(params, wf));
			Workflow.saveWorkflow.load(workXml.toString());
		}
	}

	this.loadGraph = function(editor, functName, arg) {
		editor[functName](arg);
	}

	this.initWF = function(editor) {
		wf = new XWorkflow(Workflow.params['workflowName']);
		var tempXML;
		if (Workflow.params['instanceId'] == undefined) {
			tempXML = Tool
					.getXML("/dev/workflow/WorkflowEvent.jcp?event=open&parent_id="
							+ Workflow.params['parent_id']
							+ "&rand="
							+ Math.random());
		} else {
			tempXML = Tool
					.getXML("/dev/workflow/WorkflowEvent.jcp?event=open&parent_id="
							+ Workflow.params['parent_id']
							+ '&instanceId='
							+ Workflow.params['instanceId']
							+ "&rand="
							+ Math.random());
		}
		var classMap = tempXML.childNodes;
		var len = classMap.length;
		for (var i = 0; i < len; i++) {
			var elements = classMap[i];
			if (elements.tagName == 'flowgraph') {
				var graphXMLString = "";
				if (Ext.isIE) {
					graphXMLString = elements.xml;
				} else {
					graphXMLString = (new XMLSerializer())
							.serializeToString(elements);
				}
				graphXMLString = graphXMLString.replace('<flowgraph>', '');
				graphXMLString = graphXMLString.replace('</flowgraph>', '');
				graphXMLString = '<mxGraphModel><root>' + graphXMLString
						+ '</root></mxGraphModel>';
				var graphXML = Tool.parseXML(graphXMLString);
				editor.readGraphModel(graphXML);
				editor.filename = Workflow.params['parent_id'];
				editor.fireEvent(new mxEventObject(mxEvent.OPEN, 'filename',
						Workflow.params['parent_id']));
			}
			if (elements.tagName == 'flowmodal') {
				var flowElements = elements.childNodes;
				wf.init(flowElements);
			}
		}
	};

	setProperty = function(cell) {
		var value = ed.graph.getModel().getValue(cell);
		if (value.nodeType != null) {
			var styleType = ed.graph.getModel().getStyle(cell);
			var model = ed.graph.getModel();
			model.beginUpdate();

			if (cell.isEdge()) {
				var id = cell.getId();
				var source = cell.getTerminal(true);
				var sourceId = source.getId();
				var sourceStyle = ed.graph.getModel().getStyle(source);
				var target = cell.getTerminal(false);
				var id = cell.getId();
				var targetId = target.getId();
				var targetStyle = ed.graph.getModel().getStyle(target);

				if (sourceStyle == 'ellipse') {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("lib.SelectRole.SelectRole");
					using("lib.SelectUser.SelectUser");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ResultWindow");
					var action = wf.getInitialAction(id);
					var tempArray = action.getResult(id);
					var resultType = tempArray[0];
					var rt = tempArray[1];
					var defaultName = action.getName();
					var resultWin = new dev.workflow.popup.ResultWindow(
							Workflow.params['parent_id'], wf, cell,
							defaultName, rt, resultType, targetStyle, targetId);
					resultWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					resultWin.win.on('close', function() {
						if (!resultWin.normalClose) {
							if (resultType == '0') {
								action
										.addConditionalResults(resultWin.returnResult);
							} else {
								action
										.setUnconditionalResult(resultWin.returnResult);
							}
						}
						ed.graph.model.endUpdate();
					}, this);
					resultWin.show();
				} else if (sourceStyle == 'rounded') {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("lib.SelectRole.SelectRole");
					using("lib.SelectUser.SelectUser");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ResultWindow");
					var step = wf.getStep(sourceId);
					var tempArray = step.getResult(id);
					var action = tempArray[2];
					var resultType = tempArray[0];
					var rt = tempArray[1];
					var defaultName = action.getName();
					var resultWin = new dev.workflow.popup.ResultWindow(
							Workflow.params['parent_id'], wf, cell,
							defaultName, rt, resultType, targetStyle, targetId);
					resultWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					resultWin.win.on('close', function() {
						if (!resultWin.normalClose) {
							if (resultType == '0') {
								action
										.addConditionalResults(resultWin.returnResult);
							} else {
								action
										.setUnconditionalResult(resultWin.returnResult);
							}
						}
						ed.graph.model.endUpdate();
					}, this);
					resultWin.show();
				} else if (sourceStyle == 'rhombus') {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("lib.SelectRole.SelectRole");
					using("lib.SelectUser.SelectUser");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ResultWindow");
					var split = wf.getSplit(sourceId);
					var resultType = '1';
					var defaultName = '分支_'.loc() + id;
					var rt = split.getResult(id);
					var resultWin = new dev.workflow.popup.ResultWindow(
							Workflow.params['parent_id'], wf, cell,
							defaultName, rt, resultType, targetStyle, targetId);
					resultWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					resultWin.win.on('close', function() {
								if (!resultWin.normalClose) {
									split.addResults(resultWin.returnResult);
								}
								ed.graph.model.endUpdate();
							}, this);
					resultWin.show();
				} else if (sourceStyle == 'triangle') {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("lib.SelectRole.SelectRole");
					using("lib.SelectUser.SelectUser");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ResultWindow");
					var join = wf.getJoin(sourceId);
					var rt = join.getResult();
					var resultType = '1';
					var defaultName = '聚合_'.loc() + id;
					var resultWin = new dev.workflow.popup.ResultWindow(
							Workflow.params['parent_id'], wf, cell,
							defaultName, rt, resultType, targetStyle, targetId);
					resultWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					resultWin.win.on('close', function() {
								if (!resultWin.normalClose) {
									join.addResults(resultWin.returnResult);
								}
								ed.graph.model.endUpdate();
							}, this);
					resultWin.show();
				}
			} else {
				var id = cell.getId();
				var styleType = ed.graph.getModel().getStyle(cell);

				if (styleType == 'ellipse') {
					Ext.msg("error", '不需要设定参数!'.loc());
				} else if (styleType == 'rounded') {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.StepWindow");

					var stepWin = new dev.workflow.popup.StepWindow(
							Workflow.params['parent_id'], wf, cell, false);
					stepWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					stepWin.win.on('close', function() {
								ed.graph.model.endUpdate();
							}, this);
					stepWin.show();
				} else if (styleType == 'rhombus') {
					Ext.msg("error", '不需要设定分支参数!'.loc());
				} else if (styleType == 'triangle') {
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.JoinWindow");
					var joinWin = new dev.workflow.popup.JoinWindow(
							Workflow.params['parent_id'], wf, cell);
					joinWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					joinWin.win.on('close', function() {
								ed.graph.model.endUpdate();
							}, this);
					joinWin.show();
				} else if (styleType == 'doubleEllipse'
						|| styleType == 'symbol;image=/dev/workflow/images/symbols/terminate.png') {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.StepWindow");

					var stepWin = new dev.workflow.popup.StepWindow(
							Workflow.params['parent_id'], wf, cell, true);
					stepWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					stepWin.win.on('close', function() {
								ed.graph.model.endUpdate();
							}, this);
					stepWin.show();
				} else if (styleType == 'text' || styleType == 'swimlane') {
					var txt = cell.getAttribute('label');
					using("dev.workflow.popup.TextWindow");
					Workflow.textWin = new dev.workflow.popup.TextWindow(
							Workflow.params['parent_id'], txt);
					Workflow.textWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					Workflow.textWin.win.on('close', function() {
								if (Workflow.textWin.txt != '') {
									cell.setAttribute('label',
											Workflow.textWin.txt);
								} else {
									ed.graph.model.remove(cell);
								}
								ed.graph.model.endUpdate();
							}, this);
					Workflow.textWin.show();
				}
			}
			model.setValue(cell, value);
			model.endUpdate();
		}
	}
	setAction = function(cell) {
		var value = ed.graph.getModel().getValue(cell);
		if (value.nodeType != null) {
			var styleType = ed.graph.getModel().getStyle(cell);
			var model = ed.graph.getModel();
			model.beginUpdate();

			var id = cell.getId();
			var styleType = ed.graph.getModel().getStyle(cell);
			if (styleType == 'ellipse') {
				var action;
				var actions = wf.getInitialActions();
				var n = 0;
				if (!Workflow.designPanel.isEmty(actions)) {
					for (var i in actions) {
						action = actions[i];
						n++;
					}
				}
				if (n == 0) {
					Ext.msg("error", '该步骤没有关联的动作!'.loc());
					return;
				} else if (n > 1) {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ActionWindow");
					using("dev.workflow.popup.SelectActionWindow");
					var selectActionWin = new dev.workflow.popup.SelectActionWindow(
							Workflow.params['parent_id'], step);
					selectActionWin.show();
					selectActionWin.win.on('close', function() {
						if (!selectActionWin.normalClose) {
							action = step
									.getAction(selectActionWin.relateAction);
							var actionWin = new dev.workflow.popup.ActionWindow(
									Workflow.params['parent_id'], wf, cell,
									step, action, "0");
							actionWin.win.on('show', function() {
										ed.graph.model.beginUpdate();
									}, this);
							actionWin.win.on('close', function() {
								if (actionWin.callBack == 'delete') {
									var _rt = action.getUnconditionalResult();
									var _crt = action.getConditionalResults();
									var cells = ed.graph.getCells(0, 0, 4000,
											4000);
									for (var i = 0; i < cells.length; i++) {
										if (_rt) {
											if (cells[i].getId() == _rt.getId()) {
												ed.graph.remove([cells[i]]);
											}
										}
										if (!Workflow.designPanel.isEmty(_crt)) {
											for (var j in _crt) {
												var tmpRt = _crt[j].getResult();
												if (tmpRt.getId() == cells[i]
														.getId()) {
													ed.graph.remove([cells[i]]);
												}
											}
										}
									}
									step.removeAction(action.getId());
								}
								ed.graph.model.endUpdate();
							}, this);
							actionWin.show();
						}
					}, this);
				} else {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ActionWindow");
					var actionWin = new dev.workflow.popup.ActionWindow(
							Workflow.params['parent_id'], wf, cell, step,
							action, "0");
					actionWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					actionWin.win.on('close', function() {
								if (actionWin.callBack == 'delete') {
									var _rt = action.getUnconditionalResult();
									var _crt = action.getConditionalResults();
									var cells = ed.graph.getCells(0, 0, 4000,
											4000);
									for (var i = 0; i < cells.length; i++) {
										if (_rt) {
											if (cells[i].getId() == _rt.getId()) {
												ed.graph.remove([cells[i]]);
											}
										}
										if (!Workflow.designPanel.isEmty(_crt)) {
											for (var j in _crt) {
												var tmpRt = _crt[j].getResult();
												if (tmpRt.getId() == cells[i]
														.getId()) {
													ed.graph.remove([cells[i]]);
												}
											}
										}
									}
									step.removeAction(action.getId());
								}
								ed.graph.model.endUpdate();
							}, this);
					actionWin.show();
				}
			} else if (styleType == 'rounded') {

				var step = wf.getStep(id);
				var action;
				var actions = step.getActions();
				var n = 0;
				if (!Workflow.designPanel.isEmty(actions)) {
					for (var i in actions) {
						action = actions[i];
						n++;
					}
				}
				if (n == 0) {
					Ext.msg("error", '该步骤没有关联的动作!'.loc());
					return;
				} else if (n > 1) {
					using("dev.workflow.popup.SelectActionWindow");
					var selectActionWin = new dev.workflow.popup.SelectActionWindow(
							Workflow.params['parent_id'], step);
					selectActionWin.show();
					selectActionWin.win.on('close', function() {
						if (!selectActionWin.normalClose) {
							using("lib.ComboTree.ComboTree");
							using("lib.ComboRemote.ComboRemote");
							using("dev.workflow.popup.PreFuctionGrid");
							using("dev.workflow.popup.PostFuctionGrid");
							using("dev.workflow.popup.ConditionGrid");
							using("dev.workflow.popup.attrGrid");
							using("dev.workflow.popup.ActionWindow");
							action = step
									.getAction(selectActionWin.relateAction);
							var actionWin = new dev.workflow.popup.ActionWindow(
									Workflow.params['parent_id'], wf, cell,
									step, action, "1");
							actionWin.win.on('show', function() {
										ed.graph.model.beginUpdate();
									}, this);
							actionWin.win.on('close', function() {
								if (actionWin.callBack == 'delete') {
									var _rt = action.getUnconditionalResult();
									var _crt = action.getConditionalResults();
									var cells = ed.graph.getCells(0, 0, 4000,
											4000);
									for (var i = 0; i < cells.length; i++) {
										if (_rt) {
											if (cells[i].getId() == _rt.getId()) {
												ed.graph.remove([cells[i]]);
											}
										}
										if (!Workflow.designPanel.isEmty(_crt)) {
											for (var j in _crt) {
												var tmpRt = _crt[j].getResult();
												if (tmpRt.getId() == cells[i]
														.getId()) {
													ed.graph.remove([cells[i]]);
												}
											}
										}
									}
									step.removeAction(action.getId());
								}
								ed.graph.model.endUpdate();
							}, this);
							actionWin.show();
						}
					}, this);
				} else {
					using("lib.ComboTree.ComboTree");
					using("lib.ComboRemote.ComboRemote");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ActionWindow");
					var actionWin = new dev.workflow.popup.ActionWindow(
							Workflow.params['parent_id'], wf, cell, step,
							action, "1");
					actionWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					actionWin.win.on('close', function() {
								if (actionWin.callBack == 'delete') {
									var _rt = action.getUnconditionalResult();
									var _crt = action.getConditionalResults();
									var cells = ed.graph.getCells(0, 0, 4000,
											4000);
									for (var i = 0; i < cells.length; i++) {
										if (_rt) {
											if (cells[i].getId() == _rt.getId()) {
												ed.graph.remove([cells[i]]);
											}
										}
										if (!Workflow.designPanel.isEmty(_crt)) {
											for (var j in _crt) {
												var tmpRt = _crt[j].getResult();
												if (tmpRt.getId() == cells[i]
														.getId()) {
													ed.graph.remove([cells[i]]);
												}
											}
										}
									}
									step.removeAction(action.getId());
								}
								ed.graph.model.endUpdate();
							}, this);
					actionWin.show();
				}
			} else {
				Ext.msg("error", '不需要设定动作参数!'.loc());
			}
		}
		model.setValue(cell, value);
		model.endUpdate();
	}
	this.createWorkflowObject = function(cell, source, target, index) {
		if (cell.isEdge()) {
			var id = cell.getId();
			var sourceId = source.getId();
			var targetId = target.getId();
			var sourceStyle = ed.graph.getModel().getStyle(source);
			var targetStyle = ed.graph.getModel().getStyle(target);
			if ((sourceStyle == 'rounded' || targetStyle == 'rounded')
					|| targetStyle == 'doubleEllipse'
					|| targetStyle == 'symbol;image=/dev/workflow/images/symbols/terminate.png') {
				if (sourceStyle == 'ellipse') {
					using("dev.workflow.popup.ToggleStartWindow");
					Workflow.startWin = new dev.workflow.popup.ToggleStartWindow(Workflow.params['parent_id']);
					Workflow.startWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					Workflow.startWin.win.on('close', function() {
						if (Workflow.startWin.resultType != '') {
							var action = new XAction(id);
							action.setName('启动工作流'.loc());
							var resultType = Workflow.startWin.resultType;
							var rt;
							if (resultType == '0') {
								rt = new XConditionResult();
								var tmpResult = new XResult();
								rt.setResult(tmpResult);
							} else {
								rt = new XResult();
							}
							using("lib.ComboTree.ComboTree");
							using("lib.ComboRemote.ComboRemote");
							using("lib.SelectRole.SelectRole");
							using("lib.SelectUser.SelectUser");
							using("dev.workflow.popup.PreFuctionGrid");
							using("dev.workflow.popup.PostFuctionGrid");
							using("dev.workflow.popup.ConditionGrid");
							using("dev.workflow.popup.attrGrid");
							using("dev.workflow.popup.ResultWindow");
							var resultWin = new dev.workflow.popup.ResultWindow(
									Workflow.params['parent_id'], wf, cell,
									action, rt, resultType, targetStyle,
									targetId);
							resultWin.win.on('show', function() {
										ed.graph.model.beginUpdate();
									}, this);
							resultWin.win.on('close', function() {
								if (resultWin.normalClose) {
									wf.removeInitialAction(id);
									ed.graph.model.remove(cell);
								} else {
									if (resultType == '0') {
										action
												.addConditionalResults(resultWin.returnResult);
									} else {
										action
												.setUnconditionalResult(resultWin.returnResult);
									}
									wf.addInitialAction(action);
								}
								ed.graph.model.endUpdate();
							}, this);
							resultWin.show();
						} else {
							ed.graph.model.remove(cell);
						}
						ed.graph.model.endUpdate();
					}, this);
					Workflow.startWin.show();
				} else if (sourceStyle == 'rounded') {
					var step = wf.getStep(sourceId);
					using("dev.workflow.popup.ToggleActionWindow");
					var toggleActionWin = new dev.workflow.popup.ToggleActionWindow(
							Workflow.params['parent_id'], step);
					toggleActionWin.win.on('close', function() {
						if (toggleActionWin.normalClose) {
							ed.graph.model.remove(cell);
						} else {
							var resultType = toggleActionWin.resultType;
							var relateAction = toggleActionWin.action;
							var action;
							if (relateAction == '0') {
								action = new XAction(id);
								using("lib.ComboTree.ComboTree");
								using("lib.ComboRemote.ComboRemote");
								using("dev.workflow.popup.PreFuctionGrid");
								using("dev.workflow.popup.PostFuctionGrid");
								using("dev.workflow.popup.ConditionGrid");
								using("dev.workflow.popup.attrGrid");
								using("dev.workflow.popup.ActionWindow");
								var actionWin = new dev.workflow.popup.ActionWindow(
										Workflow.params['parent_id'], wf, cell,
										step, action, "1");
								actionWin.win.on('close', function() {
											if (actionWin.normalClose) {
												step.removeAction(id);
												ed.graph.model.remove(cell);
											} else {
												step.addAction(action);
												showResult();
											}
										}, this);
								actionWin.show();
							} else {
								action = step.getAction(relateAction);
								showResult();
							}
							function showResult() {
								var rt;
								if (resultType == '0') {
									rt = new XConditionResult();
									var tmpResult = new XResult();
									rt.setResult(tmpResult);
								} else {
									rt = new XResult();
								}
								var defaultName = action.getName();
								using("lib.ComboTree.ComboTree");
								using("lib.ComboRemote.ComboRemote");
								using("lib.SelectRole.SelectRole");
								using("lib.SelectUser.SelectUser");
								using("dev.workflow.popup.PreFuctionGrid");
								using("dev.workflow.popup.PostFuctionGrid");
								using("dev.workflow.popup.ConditionGrid");
								using("dev.workflow.popup.attrGrid");
								using("dev.workflow.popup.ResultWindow");
								var resultWin = new dev.workflow.popup.ResultWindow(
										Workflow.params['parent_id'], wf, cell,
										defaultName, rt, resultType,
										targetStyle, targetId);
								resultWin.win.on('show', function() {
											ed.graph.model.beginUpdate();
										}, this);
								resultWin.win.on('close', function() {
									if (resultWin.normalClose) {
										if (relateAction == '0') {
											step.removeAction(id);
										}
										ed.graph.model.remove(cell);
									} else {
										if (resultType == '0') {
											action
													.addConditionalResults(resultWin.returnResult);
										} else {
											action
													.setUnconditionalResult(resultWin.returnResult);
										}
									}
									ed.graph.model.endUpdate();
								}, this);
								resultWin.show();
							}
						}
					}, this);
					toggleActionWin.show();
				} else if (sourceStyle == 'rhombus') {
					var rt = new XResult();
					var split = wf.getSplit(sourceId);
					var resultType = '1';
					var defaultName = '分支_'.loc() + id;
					using("lib.SelectRole.SelectRole");
					using("lib.SelectUser.SelectUser");
					using("dev.workflow.popup.PreFuctionGrid");
					using("dev.workflow.popup.PostFuctionGrid");
					using("dev.workflow.popup.ConditionGrid");
					using("dev.workflow.popup.attrGrid");
					using("dev.workflow.popup.ResultWindow");
					var resultWin = new dev.workflow.popup.ResultWindow(
							Workflow.params['parent_id'], wf, cell,
							defaultName, rt, resultType, targetStyle, targetId);
					resultWin.win.on('show', function() {
								ed.graph.model.beginUpdate();
							}, this);
					resultWin.win.on('close', function() {
								if (resultWin.normalClose) {
									ed.graph.model.remove(cell);
								} else {
									split.addResults(resultWin.returnResult);
									ed.graph.model.endUpdate();
								}
							}, this);
					resultWin.show();
				} else if (sourceStyle == 'triangle') {
					if (source.getDirectedEdgeCount(true) == 0) {
						var rt = new XResult();
						var join = wf.getJoin(sourceId);
						var resultType = '1';
						var defaultName = '聚合_'.loc() + id;
						using("lib.SelectRole.SelectRole");
						using("lib.SelectUser.SelectUser");
						using("dev.workflow.popup.PreFuctionGrid");
						using("dev.workflow.popup.PostFuctionGrid");
						using("dev.workflow.popup.ConditionGrid");
						using("dev.workflow.popup.attrGrid");
						using("dev.workflow.popup.ResultWindow");
						var resultWin = new dev.workflow.popup.ResultWindow(
								Workflow.params['parent_id'], wf, cell,
								defaultName, rt, resultType, targetStyle,
								targetId);
						resultWin.win.on('close', function() {
									if (resultWin.normalClose) {
										ed.graph.model.remove(cell);
									} else {
										join.setResult(resultWin.returnResult);
									}
								}, this);
						resultWin.show();
					} else {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
		} else {
			var id = cell.getId();
			var styleType = ed.graph.getModel().getStyle(cell);
			if (styleType == 'ellipse') {
				var cells = ed.graph.getCells(0, 0, 4000, 4000);
				for (var i = 0; i < cells.length; i++) {
					if (ed.graph.getModel().getStyle(cells[i]) == 'ellipse') {
						return false;
					}
				}
				cell.setAttribute('label', '开始'.loc());
			} else if (styleType == 'rounded') {
				var step = new XStep(id, '步骤'.loc() + id);
				wf.addStep(step);
				using("lib.ComboTree.ComboTree");
				using("lib.ComboRemote.ComboRemote");
				using("dev.workflow.popup.PreFuctionGrid");
				using("dev.workflow.popup.PostFuctionGrid");
				using("dev.workflow.popup.ConditionGrid");
				using("dev.workflow.popup.attrGrid");
				using("dev.workflow.popup.StepWindow");
				var stepWin = new dev.workflow.popup.StepWindow(
						Workflow.params['parent_id'], wf, cell, false);
				stepWin.win.on('show', function() {
							ed.graph.model.beginUpdate();
						}, this);
				stepWin.win.on('close', function() {
							if (stepWin.normalClose) {
								wf.removeStep(id);
								ed.graph.model.remove(cell);
							}
							ed.graph.model.endUpdate();
						}, this);
				stepWin.show();
			} else if (styleType == 'rhombus') {

				var split = new XSplit(id);
				wf.addSplit(split);
			} else if (styleType == 'triangle') {
				var join = new XJoin(id);
				wf.addJoin(join);
			} else if (styleType == 'doubleEllipse'
					|| styleType == 'symbol;image=/dev/workflow/images/symbols/terminate.png') {
				cell.setAttribute('label', '结束'.loc() + id);
				var step = new XStep(id, '结束'.loc() + id);
				wf.addStep(step);
				using("lib.ComboTree.ComboTree");
				using("lib.ComboRemote.ComboRemote");
				using("dev.workflow.popup.PreFuctionGrid");
				using("dev.workflow.popup.PostFuctionGrid");
				using("dev.workflow.popup.ConditionGrid");
				using("dev.workflow.popup.attrGrid");
				using("dev.workflow.popup.StepWindow");
				var stepWin = new dev.workflow.popup.StepWindow(
						Workflow.params['parent_id'], wf, cell, true);
				stepWin.win.on('show', function() {
							ed.graph.model.beginUpdate();
						}, this);
				stepWin.win.on('close', function() {
							if (stepWin.normalClose) {
								wf.removeStep(id);
								ed.graph.model.remove(cell);
							}
							ed.graph.model.endUpdate();
						}, this);
				stepWin.show();
			} else if (styleType == 'text' || styleType == 'swimlane') {
				using("dev.workflow.popup.TextWindow");
				Workflow.textWin = new dev.workflow.popup.TextWindow(
						Workflow.params['parent_id'], '');
				Workflow.textWin.win.on('show', function() {
							ed.graph.model.beginUpdate();
						}, this);
				Workflow.textWin.win.on('close', function() {
							if (Workflow.textWin.txt != '') {
								cell
										.setAttribute('label',
												Workflow.textWin.txt);
							} else {
								ed.graph.model.remove(cell);
							}
							ed.graph.model.endUpdate();
						}, this);
				Workflow.textWin.show();
			}
			return true;
		}
	};

	this.removeWorkflowEdge = function(edge) {
		var id = edge.getId();
		var source = edge.getTerminal(true);
		var sourceId = source.getId();
		var sourceStyle = ed.graph.getModel().getStyle(source);
		if (sourceStyle == 'ellipse') {
			wf.removeInitialAction(id);
		} else if (sourceStyle == 'rounded') {
			var step = wf.getStep(sourceId);
			if(step)
			step.removeResult(sourceId);
		} else if (sourceStyle == 'rhombus') {
			var split = wf.getSplit(sourceId);
			split.removeResults(id);
		} else if (sourceStyle == 'triangle') {
			var join = wf.getJoin(sourceId);
			join.removeResults();
		}
	};
	this.removeWorkflowObject = function(cell) {
		if (cell.isEdge()) {
			this.removeWorkflowEdge(cell);
		} else {
			var id = cell.getId();
			var styleType = ed.graph.getModel().getStyle(cell);
			if (styleType == 'rounded') {
				wf.removeStep(id);
			} else if (styleType == 'rhombus') {
				wf.removeSplit(id);
			} else if (styleType == 'triangle') {
				wf.removeJoin(id);
			} else if (styleType == 'doubleEllipse'
					|| styleType == 'symbol;image=/dev/workflow/images/symbols/terminate.png') {
				wf.removeStep(id);
			}
		}
	};
	this.isEmty = function(s) {
		for (var i in s)
			return false;
		return true;
	};
	var iconButtonClick = function(item) {
		if (item.btnId == 'print') {
			// ed.execute("print");
			printGraph();
		} else if (item.btnId == 'preview') {
			mxUtils.show(ed.graph, null, 10, 10);
		} else if (item.btnId == 'delete') {
			ed.execute("delete");
		} else if (item.btnId == 'properties') {
			ed.execute("showProperties");
		} else if (item.btnId == 'action') {
			ed.execute("showActionProperties");
		} else if (item.btnId == 'group') {
			ed.execute("group");
		} else if (item.btnId == 'ungroup') {
			ed.execute("ungroup");
		} else if (item.btnId == 'fit') {
			ed.execute("actualSize");
		} else if (item.btnId == 'zoomIn') {
			ed.execute("zoomIn");
		} else if (item.btnId == 'zoomOut') {
			ed.execute("zoomOut");
		} else if (item.btnId == 'rotate') {
			ed.graph.toggleCellStyles(mxConstants.STYLE_HORIZONTAL, true);
		} else if (item.btnId == 'toback') {
			ed.execute("toBack");
		} else if (item.btnId == 'tofront') {
			ed.execute("toFront");
		}
	};

	var ButtonArray = [];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'back',
				text : '返回'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.params.retFn
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'script',
				text : '生成脚本'.loc(),
				icon : '/themes/icon/xp/operation.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : onButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'print',
				icon : '/themes/icon/xp/print.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '打印'.loc() + '</b>',
				handler : iconButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'preview',
				icon : '/themes/icon/xp/preview.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '预览'.loc() + '</b>',
				handler : iconButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Separator());

	ButtonArray.push(this.strike = new Ext.Toolbar.Button({
				btnId : 'delete',
				icon : '/themes/icon/xp/deleteit.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '删除'.loc() + '</b>',
				handler : iconButtonClick
			}));

	ButtonArray.push(this.strike = new Ext.Toolbar.Button({
				btnId : 'properties',
				icon : '/themes/icon/xp/properties.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '属性'.loc() + '</b>',
				handler : iconButtonClick
			}));

	ButtonArray.push(this.strike = new Ext.Toolbar.Button({
				btnId : 'action',
				icon : '/themes/icon/all/connect.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '设定动作'.loc() + '</b>',
				handler : iconButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Separator());

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'group',
				icon : '/themes/icon/xp/group.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '分组'.loc() + '</b>',
				handler : iconButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'ungroup',
				icon : '/themes/icon/xp/ungroup.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '取消分组'.loc() + '</b>',
				handler : iconButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'rotate',
				icon : '/themes/icon/xp/rotate.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '改变文本方向'.loc() + '</b>',
				handler : iconButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'toback',
				icon : '/themes/icon/xp/toback.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '转到后面'.loc() + '</b>',
				handler : iconButtonClick
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'tofront',
				icon : '/themes/icon/xp/tofront.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '转到前面'.loc() + '</b>',
				handler : iconButtonClick
			}));

	ButtonArray.push(new Ext.Toolbar.Separator());
	var ftFacestore = new Ext.data.SimpleStore({
				fields : ['id', 'label'],
				data : [['SimSun', '宋体'.loc()], ['LiSu', '隶书'.loc()],
						['KaiTi', '楷体'.loc()], ['SimHei', '黑体'.loc()],
						['Arial', 'Arial'], ['Arial Black', 'Arial Black'],
						['Tahoma', 'Tahoma'],
						['Times New Roman', 'Times New Roman']]
			});
	this.ftFace = new Ext.form.ComboBox({
				name : 'ftFace',
				store : ftFacestore,
				displayField : 'label',
				typeAhead : false,
				mode : 'local',
				value : '宋体'.loc(),
				triggerAction : 'all',
				selectOnFocus : true,
				width : 130
			});
	ButtonArray.push(this.ftFace);

	var ftSizestore = new Ext.data.SimpleStore({
				fields : ['id', 'label'],
				data : [['6px', '6'], ['8px', '8'], ['10px', '10'],
						['12px', '12'], ['14px', '14'], ['18px', '18'],
						['24px', '24'], ['36px', '36']]
			});
	this.ftSize = new Ext.form.ComboBox({
				name : 'ftSize',
				store : ftSizestore,
				displayField : 'label',
				typeAhead : false,
				mode : 'local',
				value : '10',
				triggerAction : 'all',
				selectOnFocus : true,
				width : 50
			});

	this.ftSize.on('select', function() {
				var size = this.ftSize.getValue();
				if (size != null && size > 0 && size < 999) {
					ed.graph.setCellStyles("fontSize", size);
				}
			}, this);
	this.ftFace.on('select', function() {
				var family = this.ftFace.getValue();
				ed.graph.setCellStyles("fontFamily", family);
			}, this);

	ButtonArray.push(this.ftSize);

	ButtonArray.push(this.bold = new Ext.Toolbar.Button({
				btnId : 'bold',
				icon : '/themes/icon/xp/B.gif',
				cls : 'x-btn-icon',
				scope : this,
				hidden : false,
				tooltip : '<b>' + '加粗'.loc() + '</b>',
				enableToggle : false,
				handler : function() {
					FONT_BOLD = 1;
					ed.graph.toggleCellStyleFlags('fontStyle', FONT_BOLD);
				},
				pressed : false
			}));
	ButtonArray.push(this.italic = new Ext.Toolbar.Button({
				btnId : 'italic',
				icon : '/themes/icon/xp/I.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '倾斜'.loc() + '</b>',
				enableToggle : false,
				handler : function() {
					FONT_ITALIC = 2;
					ed.graph.toggleCellStyleFlags('fontStyle', FONT_ITALIC);
				},
				pressed : false
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'underline',
				icon : '/themes/icon/xp/underline.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '下划线'.loc() + '</b>',
				enableToggle : false,
				handler : function() {
					ed.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE,
							mxConstants.FONT_UNDERLINE);
				},
				pressed : false
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'align',
				icon : '/themes/icon/xp/left.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '文本对齐'.loc() + '</b>',
				handler : function() {
				},
				menu : {
					items : [{
						text : '左对齐'.loc(),
						icon : '/themes/icon/xp/left.gif',
						handler : function() {
							ed.graph.setCellStyles(mxConstants.STYLE_ALIGN,
									mxConstants.ALIGN_LEFT);
						}
					}, {
						text : '横向居中'.loc(),
						icon : '/themes/icon/xp/center.gif',
						handler : function() {
							ed.graph.setCellStyles(mxConstants.STYLE_ALIGN,
									mxConstants.ALIGN_CENTER);
						}
					}, {
						text : '右对齐'.loc(),
						icon : '/themes/icon/xp/right.gif',
						handler : function() {
							ed.graph.setCellStyles(mxConstants.STYLE_ALIGN,
									mxConstants.ALIGN_RIGHT);
						}
					}, '-', {
						text : '上对齐'.loc(),
						icon : '/themes/icon/xp/top.gif',
						handler : function() {
							ed.graph.setCellStyles(
									mxConstants.STYLE_VERTICAL_ALIGN,
									mxConstants.ALIGN_TOP);
						}
					}, {
						text : '纵向居中'.loc(),
						icon : '/themes/icon/xp/middle.gif',
						handler : function() {
							ed.graph.setCellStyles(
									mxConstants.STYLE_VERTICAL_ALIGN,
									mxConstants.ALIGN_MIDDLE);
						}
					}, {
						text : '下对齐'.loc(),
						icon : '/themes/icon/xp/bottom.gif',
						handler : function() {
							ed.graph.setCellStyles(
									mxConstants.STYLE_VERTICAL_ALIGN,
									mxConstants.ALIGN_BOTTOM);
						}
					}]
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push({
				itemId : 'bgcolor',
				cls : 'x-btn-icon',
				icon : '/themes/icon/xp/background.gif',
				clickEvent : 'mousedown',
				tabIndex : -1,
				tooltip : '<b>' + '填充颜色'.loc() + '</b>',
				menu : new Ext.menu.ColorMenu({
							focus : Ext.emptyFn,
							plain : true,
							allowReselect : true,
							handler : function(cp, color) {
								ed.graph
										.setCellStyles("strokeColor", '#FF0000');
								if (!color) {
									return;
								} else {
									ed.graph.setCellStyles("strokeColor", '#'
													+ color);
									ed.graph.setCellStyles("fillColor", '#'
													+ color);
								}
							},
							scope : this,
							clickEvent : 'mousedown'
						})
			});

	ButtonArray.push({
				itemId : 'lineColor',
				cls : 'x-btn-icon',
				icon : '/themes/icon/xp/linecolor.gif',
				clickEvent : 'mousedown',
				tabIndex : -1,
				tooltip : '<b>' + '线颜色'.loc() + '</b>',
				menu : new Ext.menu.ColorMenu({
							focus : Ext.emptyFn,
							plain : true,
							allowReselect : true,
							handler : function(cp, color) {
								if (!color)
									return;
								ed.graph.setCellStyles("strokeColor", '#'
												+ color);
							},
							scope : this,
							clickEvent : 'mousedown'
						})
			});

	ButtonArray.push({
				itemId : 'fontColor',
				cls : 'x-btn-icon',
				icon : '/themes/icon/xp/fontc.gif',
				clickEvent : 'mousedown',
				tabIndex : -1,
				tooltip : '<b>' + '字体颜色'.loc() + '</b>',
				menu : new Ext.menu.ColorMenu({
							focus : Ext.emptyFn,
							plain : true,
							allowReselect : true,
							handler : function(cp, color) {
								if (!color)
									return;
								ed.graph
										.setCellStyles("fontColor", '#' + color);
							},
							scope : this,
							clickEvent : 'mousedown'
						})
			});

	ButtonArray.push({
				itemId : 'gradientcolor',
				cls : 'x-btn-icon',
				icon : '/themes/icon/xp/gradientcolor.gif',
				clickEvent : 'mousedown',
				tabIndex : -1,
				tooltip : '<b>' + '渐变色'.loc() + '</b>',
				menu : new Ext.menu.ColorMenu({
							focus : Ext.emptyFn,
							plain : true,
							allowReselect : true,
							handler : function(cp, color) {
								if (!color)
									return;
								ed.graph.setCellStyles(
										mxConstants.STYLE_GRADIENTCOLOR, '#'
												+ color);
							},
							scope : this,
							clickEvent : 'mousedown'
						})
			});

	ButtonArray.push(new Ext.Toolbar.Separator());
	var connectionMenu = [{
				text : '直接连接'.loc(),
				icon : '/themes/icon/xp/Connect_Straight.png',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_EDGE, null);
				}
			}, '-', {
				text : '水平连接'.loc(),
				icon : '/themes/icon/xp/Connect_Horizontal.png',
				handler : function() {
					ed.graph.getModel().beginUpdate();
					try {
						ed.graph.setCellStyles(mxConstants.STYLE_EDGE,
								'elbowEdgeStyle');
						ed.graph.setCellStyles(mxConstants.STYLE_ELBOW,
								'horizontal');
					} finally {
						ed.graph.getModel().endUpdate();
					}
				}
			}, {
				text : '垂直连接'.loc(),
				icon : '/themes/icon/xp/Connect_Vertical.png',
				handler : function() {
					ed.graph.getModel().beginUpdate();
					try {
						ed.graph.setCellStyles(mxConstants.STYLE_EDGE,
								'elbowEdgeStyle');
						ed.graph.setCellStyles(mxConstants.STYLE_ELBOW,
								'vertical');
					} finally {
						ed.graph.getModel().endUpdate();
					}
				}
			}, '-', {
				text : '相对实体位置连接'.loc(),
				icon : '/themes/icon/xp/Connect_Entity_Relation.png',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_EDGE,
							'entityRelationEdgeStyle');
				}
			}];

	var linewidthMenu = [{
				text : '1px',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 1);
				}
			}, {
				text : '2px',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 2);
				}
			}, {
				text : '3px',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 3);
				}
			}, {
				text : '4px',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 4);
				}
			}, {
				text : '5px',
				handler : function() {
					ed.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 5);
				}
			}];

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'connection',
				icon : '/themes/icon/xp/Connect_Horizontal.png',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '连接'.loc() + '</b>',
				handler : function() {
				},
				menu : {
					items : connectionMenu
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId : 'linewidth',
				icon : '/themes/icon/xp/linewidth.gif',
				cls : 'x-btn-icon',
				scope : this,
				tooltip : '<b>' + '线宽'.loc() + '</b>',
				handler : function() {
				},
				menu : {
					items : linewidthMenu
				}
			}));
	ButtonArray.push(new Ext.Toolbar.Button({
				id : 'dashed',
				icon : '/themes/icon/xp/dashed.gif',
				tooltip : '<b>' + '虚线'.loc() + '</b>',
				handler : function() {
					ed.graph.toggleCellStyles(mxConstants.STYLE_DASHED);
				}
			}));

	ButtonArray.push(new Ext.Toolbar.Separator());

	var scales = new Ext.data.SimpleStore({
				fields : ['label', 'scale'],
				data : [['400%', 4], ['200%', 2], ['150%', 1.5], ['100%', 1],
						['75%', 0.75], ['50%', 0.5], ['25%', 0.25],
						['放大'.loc(), 'in'], ['缩小'.loc(), 'out'],
						['实际尺寸'.loc(), 'reset'], ['适应窗口'.loc(), 'fit']]
			});

	var scaleCombo = new Ext.form.ComboBox({
				store : scales,
				displayField : 'label',
				mode : 'local',
				width : 110,
				colspan : 5,
				triggerAction : 'all',
				emptyText : '缩放...'.loc(),
				selectOnFocus : true,
				onSelect : function(entry) {
					if (entry != null) {
						var scale = entry.data.scale;
						if (scale == 'fit') {
							ed.graph.fit();
						} else if (scale == 'reset') {
							ed.graph.zoomActual();
						} else if (scale == 'in') {
							ed.graph.zoomIn();
						} else if (scale == 'out') {
							ed.graph.zoomOut();
						} else {
							ed.graph.getView().setScale(entry.data.scale);
						}
						this.collapse();
					}
				}
			});
	ButtonArray.push(scaleCombo);

	this.designForm = new Ext.Panel({
		border : false,
		id : 'designPanel',
		layout : 'border',
		items : [new Ext.Panel({
			region : 'west',
			width : 30,
			bodyStyle : 'background-color:#D0DEF0;',
			html : '<div id="toolbar" style="width:24px;padding-left:3px;padding-top:5px;" valign="top"></div>'
		}), new Ext.Panel({
			width : 100,
			region : 'center',
			autoScroll : true,
			html : '<div id="graph" style="height:100%;width:100%;overflow:auto;cursor:default;"><center id="splash" style="padding-top:230px;"><img src="/dev/workflow/loading.gif"></center></div>'
		})],
		tbar : ButtonArray
	});
	this.MainTabPanel = this.designForm;

	function closeCurrentWindow() {
		if (currentWindow != null) {
			currentWindow.close();
			currentWindow = null;
		}
	};
	function printGraph() {
		closeCurrentWindow();

		var row, td;

		var table = document.createElement('table');
		var tbody = document.createElement('tbody');

		row = document.createElement('tr');

		td = document.createElement('td');
		td.style.fontSize = '10pt';
		mxUtils.write(td, '页面尺寸:'.loc());

		row.appendChild(td);

		var paperSizeSelect = document.createElement('select');

		var paperSizeA4Option = document.createElement('option');
		paperSizeA4Option.setAttribute('value', 'a4');
		mxUtils.write(paperSizeA4Option, 'A4');
		paperSizeSelect.appendChild(paperSizeA4Option);

		var paperSizeLetterOption = document.createElement('option');
		paperSizeLetterOption.setAttribute('value', 'letter');
		mxUtils.write(paperSizeLetterOption, 'Letter');
		paperSizeSelect.appendChild(paperSizeLetterOption);

		var landscapeCheckBox = document.createElement('input');
		landscapeCheckBox.setAttribute('type', 'checkbox');

		td = document.createElement('td');
		td.style.fontSize = '10pt';
		td.appendChild(paperSizeSelect);
		row.appendChild(td);

		tbody.appendChild(row);

		row = document.createElement('tr');

		td = document.createElement('td');
		row.appendChild(td);

		var landscapeCheckBox = document.createElement('input');
		landscapeCheckBox.setAttribute('type', 'checkbox');

		td = document.createElement('td');
		td.style.padding = '4 0 16 2px';
		td.style.fontSize = '10pt';
		td.appendChild(landscapeCheckBox);
		mxUtils.write(td, ' 横向打印'.loc());
		row.appendChild(td);

		tbody.appendChild(row);

		row = document.createElement('tr');

		var pageCountCheckBox = document.createElement('input');
		pageCountCheckBox.setAttribute('type', 'checkbox');
		td = document.createElement('td');
		td.style.paddingRight = '10px';
		td.style.fontSize = '10pt';
		td.appendChild(pageCountCheckBox);
		mxUtils.write(td, ' ' + '海报样式'.loc() + ':');
		row.appendChild(td);

		var pageCountInput = document.createElement('input');
		pageCountInput.setAttribute('value', '1');
		pageCountInput.setAttribute('type', 'number');
		pageCountInput.setAttribute('min', '1');
		pageCountInput.setAttribute('size', '4');
		pageCountInput.setAttribute('disabled', 'disabled');

		td = document.createElement('td');
		td.style.fontSize = '10pt';
		td.appendChild(pageCountInput);
		mxUtils.write(td, ' ' + '页数'.loc());
		row.appendChild(td);

		tbody.appendChild(row);
		table.appendChild(tbody);

		mxEvent.addListener(pageCountCheckBox, 'change', function() {
					if (pageCountCheckBox.checked) {
						pageCountInput.removeAttribute('disabled');
					} else {
						pageCountInput.setAttribute('disabled', 'disabled');
					}
				});

		currentWindow = new Ext.Window({
					layout : 'fit',
					title : '打印'.loc(),
					resizable : false,
					width : 260,
					height : 200,
					buttons : [{
						text : '预览'.loc(),
						handler : function() {
							var ls = landscapeCheckBox.checked;
							var pf = (paperSizeSelect.value == 'letter')
									? ((ls)
											? mxConstants.PAGE_FORMAT_LETTER_LANDSCAPE
											: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT)
									: ((ls)
											? mxConstants.PAGE_FORMAT_A4_LANDSCAPE
											: mxConstants.PAGE_FORMAT_A4_PORTRAIT);
							var scale = 1 / ed.graph.pageScale;
							if (pageCountCheckBox.checked) {
								var pageCount = parseInt(pageCountInput.value);
								if (!isNaN(pageCount)) {
									scale = mxUtils.getScaleForPageCount(
											pageCount, ed.graph, pf);
								}
							}

							var preview = new mxPrintPreview(ed.graph, scale,
									pf);
							preview.title = '预览'.loc();
							preview.autoOrigin = pageCountCheckBox.checked;
							preview.open();
							closeCurrentWindow();
						}
					}, {
						text : '取消'.loc(),
						handler : function() {
							closeCurrentWindow();
						}
					}]
				});
		currentWindow.show();
		var div = document.createElement('div');
		div.style.padding = '8px';
		div.appendChild(table);
		currentWindow.body.dom.appendChild(div);
	};
};
Ext.extend(dev.workflow.DesignPanel, Ext.Panel, {
			init : function() {
				new mxApplication('/dev/workflow/config/wfDesigner.xml');
				if (this.MainTabPanel.rendered) {
					/*
					 * var tempToolBar=this.MainTabPanel.getTopToolbar();
					 * tempToolBar.items.each(function(item){ if(!Ext.isIE){
					 * if(item.btnId=='italic'||item.btnId=='print'||item.btnId=='preview')
					 * item.disable(); } }, tempToolBar.items);
					 */
					this.frames.get("Workflow").mainPanel
							.setStatusValue(['工作流流程设计'.loc()]);
				}
			}
		});
