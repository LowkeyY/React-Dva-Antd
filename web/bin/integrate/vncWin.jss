Ext.namespace("bin.integrate");
bin.integrate.vncWin = function(){	
	var id=this.id=Ext.id();
	this.win = new Ext.Window({     
            closable:false,
			x:0,
			y:0,
            //modal: true,
            minimizable: false,
            maximizable: false,
            bodyStyle: 'padding:0px 0px 0 0px',
            layout: 'fit',
			html:' <canvas id="'+id+'" width="640px" height="20px"></canvas>'
     });
};

           
