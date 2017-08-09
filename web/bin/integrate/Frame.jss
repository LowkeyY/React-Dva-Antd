Ext.namespace("bin.integrate");
bin.integrate.Frame = Ext.extend(WorkBench.baseNode, {
	init : function(launcher) {
		var objectId = launcher.parent_id;
		CPM.get({
			method : 'GET',
			url : '/bin/integrate/getFrame.jcp?parent_id=' + objectId,
			success : function(response, options) {
				var instanceJson = Ext.decode(response.responseText);
		
				if (instanceJson.success) {
					var itype=instanceJson.integratType;
					var ua = navigator.userAgent.toLowerCase();
					var ie = ua.match(/msie ([\d.]+)/)
					if (ie && itype == '3') itype=2;
					
					if (instanceJson.instanceNum ==	1) {
						showObject(instanceJson.osType,	instanceJson.Instance,
								itype/*instanceJson.integratType*/);

					} else {
						using("bin.integrate.SelectIntegrateWindow");
						var	selectInstanceWin =	new	bin.integrate.SelectIntegrateWindow(instanceJson.instanceArray);
						selectInstanceWin.show();
						selectInstanceWin.win.on('close', function() {
							if (!selectInstanceWin.normalClose)	{
								Ext.Ajax.request({
									url	: '/bin/integrate/getFrame.jcp',
									params : {
										parent_id :	objectId,
										instanceId : selectInstanceWin.instanceId
									},
									method : 'GET',
									scope :	this,
									callback : function(options, success,
											response) {
										var	o =	response.responseText;
										if (success	&& o !=	"")	{
											var	instanceJson1 =	Ext.decode(o);
											showObject(instanceJson1.osType,
													instanceJson1.Instance,itype);
										} else {
											Ext.msg("error",
															'取回当前模块框架类型错误.请核实'.loc());
										}
									}
								});
							}
						}, this);
					}
				} else {
					Ext.msg("error", instanceJson.message);
					return;
				}
			}
		}, true);
		function updateState(rfb, state, oldstate, msg) {
			var s, sb, cad, level;
			switch (state) {
				case 'failed' :
					level = "error";
					break;
				case 'fatal' :
					level = "error";
					break;
				case 'normal' :
					level = "normal";
					break;
				case 'disconnected' :
					level = "normal";
					break;
				case 'loaded' :
					level = "normal";
					break;
				default :
					level = "warn";
					break;
			}

		}
		function passwordRequired(rfb) {

		}
		function showObject(osType, InstanceJSON, integratType) {
			
			//integratType='2';
			if (integratType == '3') {
				 using("lib.rdp.Rdp");
				var instance = lib.rdp.Rdp.createInstance({
							integrateId : launcher.parent_id,
							instanceId : InstanceJSON.instanceId,
							bpp : InstanceJSON.bpp
						});

			} else if (integratType == '2') {
					var arr = [];
					arr.push('<applet id="rdpApplet" mayscript code="com.kinglib.rdp.applet.RdpApplet" width=100% height=70% archive="/bin/integrate/rdpApplet.jar,/bin/integrate/log4j-1.2.jar,/bin/integrate/jpedal.jar">');
					arr.push('<PARAM NAME="username" VALUE="');
					arr.push(InstanceJSON.userName);
					arr.push('"><PARAM NAME="password" VALUE="');
					arr.push(InstanceJSON.password);
					arr.push('"><PARAM NAME="server" VALUE="');
					arr.push(InstanceJSON.host);
					arr.push('"><PARAM NAME="shell" VALUE="');
					arr.push(InstanceJSON.program);
					arr.push('"><PARAM NAME="command" VALUE="');
					arr.push(InstanceJSON.args);
					arr.push('"><PARAM NAME="port" VALUE="');
					arr.push(InstanceJSON.hostPort);
					arr.push('"><PARAM NAME="seamless" VALUE="yes');
					arr.push('"></applet>');
					var divx = Ext.getBody().createChild({
								tagName : 'div',
								style : 'position:absolute;width:0;height:0;'
							}, false, true);
					divx.innerHTML = arr.join('');
					//divx.removeChild(divx.firstChild);
			} else {
				if (osType == '0') {
					var arr = [];
					arr.push('<OBJECT WIDTH=1000 HEIGHT=630 CLASSID="CLSID:1241F20B-0688-45A5-ADB2-208AFE4A5DDC" CODEBASE="/bin/integrate/gg-activex.cab#Version=4,0,1,12187" ><PARAM NAME="user" VALUE="');
					arr.push(InstanceJSON.userName);
					arr.push('"><PARAM NAME="password" VALUE="');
					arr.push(InstanceJSON.password);
					arr.push('"><PARAM NAME="host" VALUE="');
					arr.push(InstanceJSON.host);
					arr.push('"><PARAM NAME="application" VALUE="');
					arr.push(InstanceJSON.program);
					arr.push('"><PARAM NAME="args" VALUE="');
					arr.push(InstanceJSON.args);
					arr.push('"><PARAM NAME="hostport" VALUE="');
					arr.push(InstanceJSON.hostPort);
					arr.push('"><PARAM NAME="isembeddedwin" VALUE="');
					arr.push('false');
					arr.push('"><PARAM NAME="compression" VALUE="true"><PARAM NAME="inbrowserprocess" VALUE="false"><PARAM NAME="autoclosebrowser" VALUE="false"><PARAM NAME="autoconfigprinters" VALUE="default"></OBJECT>');
					var divx = Ext.getBody().createChild({
								tagName : 'div',
								style : 'position:absolute;width:1000;height:630;'
							}, false, true);
					divx.innerHTML = arr.join('');
					divx.removeChild(divx.firstChild);
					//consol.log("dddddddddd");
					//					consol.log("dddddddddd");
				} else {
					var arr = [];
					arr.push('<OBJECT  WIDTH=1000 HEIGHT=630 CLASSID="CLSID:c153b3d7-fc2f-4be8-a5a1-63a8e3e774db" CODEBASE="/bin/integrate/Iplugin.cab#Version=2,2,15,1125" ><PARAM NAME="username" VALUE="');
					arr.push(InstanceJSON.userName);
					arr.push('"><PARAM NAME="password" VALUE="');
					arr.push(InstanceJSON.password);
					arr.push('"><PARAM NAME="host" VALUE="');
					arr.push(InstanceJSON.host);
					arr.push('"><PARAM NAME="launch" VALUE="');
					arr.push(InstanceJSON.program);
					arr.push('"><PARAM NAME="args" VALUE="');
					arr.push(InstanceJSON.args);
					arr.push('"><PARAM NAME="port" VALUE="');
					arr.push(InstanceJSON.hostPort);
					arr.push('"><PARAM NAME="ui" VALUE="tray"></OBJECT>');
					var divx = Ext.getBody().createChild({
								tagName : 'div',
								style : 'position:absolute;width:1000;height:630;'
							}, false, true);
					divx.innerHTML= arr.join('');
					//divx.removeChild(divx.firstChild);
				}
			}

		}
	}
});
