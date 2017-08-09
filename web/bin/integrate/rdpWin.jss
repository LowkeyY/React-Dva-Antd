Ext.namespace("bin.integrate");
bin.integrate.rdpWin = function(w,h,integrateId,instanceId){
	var id=this.id=Ext.id();
	using("lib.rdp.Rdp");
	var rdp = new lib.rdp.Rdp({
		integrateId:integrateId,
		instanceId:instanceId
	});
	this.win = new Ext.Window({     
            closable:true,
			x:0,
			y:0,
            width: w,
			height: h,
            minimizable: true,
            maximizable: true,
            layout: 'fit',
			items:rdp
     });
     this.win.once("show",function(){
     	this.getComponent(0).initRdp();	
     	
     });
     rdp.on("disconnect",function(){
     	this.win.close();
     },this)
};

           
