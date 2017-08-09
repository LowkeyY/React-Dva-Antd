
bin.exe.FramePanel = function(config,frames){
	this.frames=frames;
	this.params={};
	var paramArray=config.PanelType.split('?');
	if(paramArray.length>1){
		var paramString=paramArray[1].split('&');
		for(var i=0;i<paramString.length;i++){
			this.params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
		}	
	}
	this.defaultPanel=paramArray[0];

	var isCollapsible=false;
	var MarginsString='3 3 3 3';
	var FrameTitle='';

	if(config.region=='west'){
		var isCollapsible=true;
		var MarginsString='3 0 3 3';
		var FrameTitle=config.modname;
	}else if(config.region=='north'&&config.modtype==3){
		var isCollapsible=false;
		var MarginsString='3 3 0 3';
		var FrameTitle=config.modname;
	}else if(config.region=='north'&&config.modtype==4){
		var isCollapsible=false;
		var MarginsString='3 3 0 3';
		var FrameTitle='';
	}else if(config.region=='south'&&config.modtype==3){
		var FrameTitle='';
		var isCollapsible=false;
		var MarginsString='0 3 3 3';
	}else if(config.region=='south'&&config.modtype==4){
		var FrameTitle='';
		var isCollapsible=false;
		var MarginsString='0 3 3 0';
	}else if(config.region=='center'&&config.modtype==1){
		var isCollapsible=false;
		var MarginsString='3 3 3 3';
		var FrameTitle=config.modname;
	}else if(config.region=='center'&&config.modtype==2){
		var isCollapsible=false;
		var MarginsString='3 3 3 0';
		var FrameTitle='';
	}
	if(config.program.length<2){
		bin.exe.FramePanel.superclass.constructor.call(this,{
				title:FrameTitle,
				region: config.region,
				width: config.width,
				height:config.height,
				split: true,
				collapsible: true,
				layout:'fit',
				object_id:config.program[0].object_id,
				prgName:config.program[0].prglogic_name,
				iFrameUrl:config.program[0].url,
				startType:config.program[0].start_type,
				showTab:false,
				margins:MarginsString
		});
		this.on('render',function(){	
			Exe=frames.get('Exe');
			this.activePanel=Exe.getMapedPanel(this.defaultPanel,this,this.params);
			this.activePanel.init();
		},this);
	}else{
		var programItems=[];
		for(var i=0;i<config.program.length;i++){
			programItems.push({
				title:config.program[i].prglogic_name,
				prgtype:config.program[i].prgtype,
				object_id:config.program[i].object_id,
				start_type:config.program[i].start_type,
				param:CPM.encodeParam(config.program[i])
			});
		}
		if(config.region=='west'){
			var innerFramePanle=new Ext.Panel({
					layout:'accordion',
					border:false,
					defaults: {
						bodyStyle: 'padding:15px'
					},
					layoutConfig: {
						titleCollapse: false,
						animate: true,
						activeOnTop: false
					},
					items:programItems
			});
		}else{
			var innerFramePanle= new Ext.TabPanel({
				activeTab: 0,
				border:false,
				tabPosition:'bottom',
				items:programItems
			});
		}
		this.activePanel=innerFramePanle;
		bin.exe.FramePanel.superclass.constructor.call(this,{
				title:FrameTitle,
				region: config.region,
				split: true,
				width: config.width,
				height:config.height,
				collapsible: true,
				layout:'fit',
				margins:MarginsString,
				items:innerFramePanle
		});
	}
};
Ext.extend(bin.exe.FramePanel,Ext.Panel,{});