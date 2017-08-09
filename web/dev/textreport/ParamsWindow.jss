Ext.namespace("dev.textreport");

dev.textreport.ParamsWindow = function(objectId,frameJSON,frames){
	this.frames=frames;
	this.win;
	this.objectId=objectId;

	var len = frameJSON.searchEditor.editors.length;	
	var h=len*28;

	this.ParamsPanel = new Ext.Panel({
		labelAlign:'right',
		frame:true,
		collapsible:false,
		layout:'form'
	});

	this.win =  new Ext.Window({
		title:'参数提交'.loc(),
		layout:'fit',
		width:370,
		height:h,
		scope:parent.WorkBench,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.ParamsPanel],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler:function(){
				TextReport=this.frames.get('TextReport');
				var params={};
				this.ParamsPanel.items.each(function(item){    
						params[item.fieldLabel]=item.getValue();
				}, this.ParamsPanel.items);	
				TextReport.textReportPanel.showReport(this.objectId,params);
				this.win.close();
			}.createDelegate(this)
		},{
			text: '取消'.loc(),
			scope:this,
			handler: function(){
				this.win.close();
			}
		}]
	});

	this.ParamsPanel.on('render', function() {
		if(frameJSON.searchEditor){
			var editors=frameJSON.searchEditor.editors;
			if((editors instanceof Array) && editors.length>0){
				if(frameJSON.searchEditor.libs.length>0){
					eval(frameJSON.searchEditor.libs);
				}
				this.eds=[];
				for(var i=0;i<editors.length;i++){
					if(editors[i].fieldLabel){
						editors[i]=Ext.ComponentMgr.create(editors[i], 'textfield')
						this.eds.push(editors[i]);
						this.ParamsPanel.add(editors[i]);
					}
				}
			}
		}
	}, this);
};

Ext.extend(dev.textreport.ParamsWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
    }
});

