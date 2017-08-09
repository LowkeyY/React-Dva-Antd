Ext.namespace("bin.workflow");

bin.workflow.StatusPanel = function(params){
	this.params=params;
	var ed;
	var wf;
	var condionSeq=0;
	var onButtonClick;

	var historyResult=new Array;
	var currentResult=new Array;
	var currentStepIds = [];
	var historyStepIds = [];
	var cells;

	this.onInit=function(editor, isFirstTime){
		ed=editor;	
		var session = null;

		mxShape.prototype.crisp = true;
		mxActor.prototype.crisp = false;
		mxCylinder.prototype.crisp = false;
		mxEllipse.prototype.crisp = false;
		mxDoubleEllipse.prototype.crisp = false;
		mxConnector.prototype.crisp = false;
		mxGraphHandler.prototype.guidesEnabled = true;
		mxGraphHandler.prototype.useGuidesForEvent = function(me)
		{
			return !mxEvent.isAltDown(me.getEvent());
		};
		mxEdgeHandler.prototype.snapToTerminals = true;
		mxConnectionHandler.prototype.connectImage = new mxImage('/dev/workflow/images/connector.gif', 16, 16);
		ed.graph.setConnectable(true);
		ed.graph.connectionHandler.setCreateTarget(true);
		ed.addListener(mxEvent.SESSION, function(editor, evt){
			var session = evt.getProperty('session');
			if (session.connected){
				var tstamp = new Date().toLocaleString();
				editor.setStatus(tstamp+':'+
					' '+session.sent+' bytes sent, '+
					' '+session.received+' bytes received');
			}else{
				editor.setStatus('Not connected');
			}
		});
		var graphNode = editor.graph.container;
		funct = function(editor,cell){
			if(cell==null&&editor.graph.getSelectionModel().cells.length>0){
				cell=editor.graph.getSelectionModel().cells[0];
			}else if(cell==null){
				cell=editor.graph.getCurrentRoot();
				if(cell==null){
					cell=this.graph.getModel().getRoot();
				}
			}
			setProperty(cell);
		}
		editor.addAction('showProperties', funct);	
		editor.graph.getTooltipForCell=function(cell){
			return showTip(cell);
		}
		this.initWF(ed);
	
	//	this.loadGraph(editor,'open','/dev/workflow/WorkflowEvent.jcp?event=open&parent_id='+this.params['workflowId']+'&instanceId='+this.params['instanceId']+'&rand='+Math.random());

		Ext.Ajax.request({ 
			url:'/bin/workflow/authedresult.jcp',
			method: 'GET',  
			scope:this,
			params : this.params,
			success:function(response, options){ 
				var check = response.responseText;
				var ajaxResult=Ext.util.JSON.decode(check);
				for(var i = 0; i < ajaxResult.historyStep.length; i++){
					historyResult[i]=new Array;
					historyResult[i][0]=ajaxResult.historyStep[i].stepId;
					historyResult[i][1]=ajaxResult.historyStep[i].caller;
					historyResult[i][2]=ajaxResult.historyStep[i].comment;
				}

				for(var i = 0; i < ajaxResult.currentStep.length; i++){
					currentStepIds[i] =ajaxResult.currentStep[i].stepId;
					currentResult[i]=new Array;
					currentResult[i][0]=ajaxResult.currentStep[i].stepId;
					currentResult[i][1]=ajaxResult.currentStep[i].stepStatus;
				}
				for(var i = 0; i <ajaxResult.historyStepIds.length; i++){
					historyStepIds[i] =ajaxResult.historyStepIds[i].stepId;
				}
				cells=ed.graph.getCells(0,0,4000,4000);
				for(var i = 0; i < currentStepIds.length; i++){
					for(var n = 0; n < cells.length; n++){
						var cell = cells[n];
						var styleType=ed.graph.getModel().getStyle(cell);

						if(styleType== "rounded" && currentStepIds[i] ==cell.getId()){
							ed.graph.setCellStyles("strokeColor", "blue",[cell]);
							ed.graph.setCellStyles("fillColor", "blue",[cell]);
						}
					}
				}
				for(var i = 0; i < historyStepIds.length; i++){
					for(var n = 0; n < cells.length; n++){
						var cell = cells[n];
						var styleType=ed.graph.getModel().getStyle(cell);
						if((styleType == "rounded" || styleType == "doubleEllipse")&& historyStepIds[i] ==cell.getId()){
							ed.graph.setCellStyles("strokeColor", "#91B720",[cell]);
							ed.graph.setCellStyles("fillColor", "#91B720",[cell]);
						}
						
					}
				}
			}
		}); 
	}
	this.initWF=function(editor){
		var tempXML=Tool.getXML("/dev/workflow/WorkflowEvent.jcp?event=open&parent_id="+this.params['workflowId']+'&instanceId='+this.params['instanceId']+"&rand="+Math.random());
		var classMap = tempXML.childNodes;
		var len = classMap.length;
		for(var i=0;i<len;i++){
			var elements = classMap[i];
			if(elements.tagName=='flowgraph'){
				var graphXMLString="";
				if (Ext.isIE) {
					graphXMLString=elements.xml;
				}else{
					graphXMLString=(new XMLSerializer()).serializeToString(elements);
				}
				graphXMLString=graphXMLString.replace('<flowgraph>','');
				graphXMLString=graphXMLString.replace('</flowgraph>','');
				graphXMLString='<mxGraphModel><root>'+graphXMLString+'</root></mxGraphModel>';
				var graphXML=Tool.parseXML(graphXMLString);
				editor.readGraphModel(graphXML);
				editor.filename = this.params['workflowId'];
				editor.fireEvent(new mxEventObject(mxEvent.OPEN, 'filename', this.params['workflowId']));
			}
		}
	};
	this.loadGraph=function(editor,functName,arg){
		editor[functName](arg);
	}
	showTip=function(cell){
		var id=cell.getId();
		var str=[];
		for(var i = 0; i < historyStepIds.length; i++){
			 if(historyStepIds[i] ==id){
				str.push('步骤:'.loc(),cell.getAttribute('label'),'<br>');
					for(var j = 0; j < historyResult.length; j++){
						 if(historyResult[j][0] ==id){
							 str.push('执行人:'.loc(),historyResult[j][1],'<br>');
							 if(historyResult[j][2]!=''){
								 str.push('审批结果:'.loc(),historyResult[j][2],'<br>');
							 }
						 }
					}
			 }
		}
		for(var i = 0; i < currentStepIds.length; i++){
			 if( currentStepIds[i] ==id){
					str.push('步骤:'.loc(),cell.getAttribute('label'),'<br>');
					for(var j = 0; j < currentResult.length; j++){
						 if(currentResult[j][0] ==id){
							 str.push('状态:'.loc(),currentResult[j][1],'<br>');
						 }
					}
			 }
		}
		return str.join('');
	}
	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.params.retFn
	}));
	this.statusForm = new Ext.Panel({
		title:'流程状态'.loc(),
		html:'<div id="graph" style="height:100%;width:100%;overflow:auto;cursor:default;"><center id="splash" style="padding-top:230px;"><img src="/dev/workflow/loading.gif"></center></div>',
		tbar:ButtonArray
	});
	this.MainTabPanel=new Ext.TabPanel({
			id: 'statusTablePanel',
			activeTab:0,
			tabPosition:'bottom',
			defaults:{autoScroll:true},
			items:[this.statusForm]
	});
};
Ext.extend(bin.workflow.StatusPanel,Ext.Panel,{
	init : function(){	
		new mxApplication('/bin/workflow/status.xml');
	}
});   