WorkBench.Help  = Ext.extend(Ext.app.Module,{
   	moduleType : 'system',
	moduleId : 'wb_help',
	scope: this,
	init : function(){
		this.launcher = {
			handler :function(){
				this.createWindow();
			},
			iconCls:'icon-help',
			scope: this,
			windowId:"wb_help",
			shortcutIconCls: 'help-shortcut-icon',
			text: '帮助'.loc(),
			tooltip: '<b>'+'帮助'.loc()	+'</b><br/>'+'显示与平台和应用相关的帮助与支持'.loc()
		}
	},
	createWindow : function(){
		using("home.system.help.HelpFrame");
		var frame = new home.system.help.HelpFrame();
		frame.init(this.launcher);
		var panel=frame.main();
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('wb_help');      

		if (!win) {
			var winWidth = desktop.getWinWidth() / 1.05;
			var winHeight = desktop.getWinHeight() / 1.05;
			
			win = desktop.createWindow({
				id: 'wb_help',
				title:'帮助'.loc(),  
				width:winWidth,
				height:winHeight,
				x:desktop.getWinX(winWidth),
				y:desktop.getWinY(winHeight),
				iconCls:'icon-help',
				layoutConfig: {animate:false},
				shim:false,
				animCollapse:false,
				constrainHeader:true,
				layout: 'fit',  
				items:panel
			});	  
		}
		win.show();
	}
});
