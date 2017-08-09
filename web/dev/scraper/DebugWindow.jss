Ext.namespace("dev.scraper");

dev.scraper.DebugWindow = function(params,xmlDOC){
	this.win;
	var ButtonArray=[];

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'run',
				text: '运行'.loc(),
				icon: '/themes/icon/all/control_play_blue.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
/*
	ButtonArray.push(new Ext.Toolbar.Button({
				id:'pause',
				text: '暂停',
				icon: '/themes/icon/all/control_pause_blue.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				id:'pause',
				text: '停止',
				icon: '/themes/icon/all/control_stop_blue.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
*/
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'close',
				text: '关闭'.loc(),
				icon: '/themes/icon/xp/close.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());


	
	var el=new Ext.ux.IFrameComponent({id:'extractViewIframe', url:'',style:'position:relative;left:0; top:0; height:100%; width:100%;background:#F00FFF'});
	
	var framePanel = new Ext.Panel({
		border:false,
		layout:'fit',
		region:'center',
		items:el
	});

	var formPanel = new Ext.form.FormPanel({
		method: 'POST',
		border:false,
		height:0,
		items:[{
			xtype:'hidden',
			name:'type',
			value:'preview'
		},{
			xtype:'hidden',
			name:'_XMLSTRING_',
			value:xmlDOC
		},{
			xtype:'hidden',
			name:'searchName',
			value:params['searchName']
		},{
			xtype:'hidden',
			name:'tabId',
			value:params['tabId']
		}],
		region:'south'
	});

	this.resultPanel = new Ext.Panel({
		border:false,
		minSize: 200,
		layout:'border',
		items:[framePanel,formPanel],
		margins: '1 1 1 1',
		bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;'
	});

	var desktop=WorkBench.Desk.getDesktop();
	var width=desktop.getViewWidth();
	var height=desktop.getViewHeight();

	this.win = desktop.getWindow('scraperDebug');
	if(!this.win){
			this.win = desktop.createWindow({
			id: 'scraperDebug',
			title:'执行萃取'.loc(),
			layout:'fit',
			width:width,
			height:height,
			items: this.resultPanel,
			tbar:ButtonArray
		});
	}
	this.win.on('show',function(){
		var fm=formPanel.form.getEl().dom;
		fm.target='extractViewIframe';
		fm.action="/dev/scraper/debug.jcp";
		fm.submit();
	},this);
};
Ext.extend(dev.scraper.DebugWindow,Ext.app.Module,{
	show : function(){
		this.win.show(this);
    },
	onButtonClick : function(item){
		if(item.btnId=='close'){
			this.win.close();
		}else if(item.btnId=='run'){

		}
    }
});

