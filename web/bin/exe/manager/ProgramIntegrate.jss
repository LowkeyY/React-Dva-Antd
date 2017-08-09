CPM.manager.ProgramIntegrate = Ext.extend(CPM.manager.CustomizeObject, {
	className : 'CPM.manager.ProgramIntegrate',
	programType : 'ProgramIntegrate',
	load : function(mode, parentPanel, param) {
		parentPanel.items.each(function(item){
			this.remove(item,true);
		},parentPanel);
		var innerPanel = new Ext.Panel();
		param.programType = this.programType;
		CPM.doAction({
					params : param,
					method : 'GET',
					success : function(response) {
						this.getObjectHtml(innerPanel, Ext
										.decode(response.responseText));
					}
				}, this);
		parentPanel.add(innerPanel);
		parentPanel.doLayout();

	},
	getObjectHtml : function(panel, InstanceJSON) {
		var box = panel.getBox();
		var arr = [];
		arr.push('<OBJECT WIDTH=');
		arr.push(box.width);
		arr.push(' HEIGHT=');
		arr.push(box.height);
		arr.push(' CLASSID="CLSID:76850F2A-FCAA-454F-82D3-BD46CB186EF5" CODEBASE="ggw-activex.cab#Version=3,2,1,4420" ><PARAM NAME="user" VALUE="');
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
		arr.push('"><PARAM NAME="isembeddedwin" VALUE="true"><PARAM NAME="compression" VALUE="true"><PARAM NAME="inbrowserprocess" VALUE="false"><PARAM NAME="autoclosebrowser" VALUE="false"><PARAM NAME="autoconfigprinters" VALUE="default"></OBJECT>');
		var divx = panel.body.dom;
		divx.innerHTML = arr.join('');
		//divx.removeChild(divx.firstChild);
	},
	canUpdateDataOnly : function() {
		return false;
	}
});