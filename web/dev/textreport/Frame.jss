Ext.namespace("dev.textreport");

dev.textreport.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		var p=new Ext.Panel({
			layout:'fit',
			border:false
		});
		useJS(['/lib/FCKeditor/fckeditor.js','/lib/FCKeditor/ExtFckeditor.js'],function(){
			using("lib.jsvm.MenuTree");
			using("dev.textreport.TextReportNavPanel");
			using("lib.CachedPanel.CachedPanel");

			this.mainPanel=new lib.CachedPanel.CachedPanel({
					region:'center',
					statusBar:true,
					split:true
			}); 
			this.frames.set('TextReport',this);
			this.navPanel =this.frames.createPanel(new dev.textreport.TextReportNavPanel());

			this.Frame = new Ext.Panel({
					border: true,
					layout: 'border',
					scope:this,
					items: [this.navPanel,this.mainPanel]
			});
			p.add(this.Frame);
			p.doLayout();
			this.navPanel.init();
		}.createDelegate(this));
		return p;
	}
});