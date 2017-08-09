Ext.namespace("bin.integrate");
bin.integrate.CitrixForWin = function(){
	this.FileContentPanel = new Ext.Panel({
		
		margins:'3 3 3 0',
		autoLoad: {url: '/bin/integrate/citrixForWin.jcp', scripts: true}
	});
	
	
	var winLS = new Ext.Window({     
            title: 'citrix',
            closable:false,
            width: 350,
            height: 300,
            //modal: true,
            renderTo: this.cover,
            minimizable: false,
            maximizable: false,
            bodyStyle: 'padding:5px 10px 0 10px',
            layout: 'fit',
            //constrainHeader: true,
            items: new Ext.form.FormPanel({
                labelAlign: 'top',
                border: false,
                bodyStyle: 'background-color:Transparent',
                items: this.FileContentPanel
            }),   
            buttons: [{text:'关闭'.loc(),handler:function(){ winLS.hide() }}]
        });
	winLS.show();
};