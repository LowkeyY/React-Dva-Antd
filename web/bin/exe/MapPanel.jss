Ext.namespace("bin.exe");



bin.exe.MapPanel = function(parentPanel,params){

	this.param=params;
	this.mapId=params['objectId'];
	this.mapType='0';
	this.firstLoad=true;
	var id = Ext.id();
	this.swfId=id + "-swf";
	this.map;

	var ButtonArray=[];
    
	this.editMenuItem={};
	this.poiMenuItem={};
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'print',
				tooltip: '打印'.loc(),
				icon: '/themes/icon/all/printer.gif',
				cls: 'x-btn-text-icon  bmenu',
				state:'all',
				disabled:false,
				hidden : false,
				scope: this,
				handler :function(){this.map.print()}
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
		btnId:'saveAsImage',
		icon: '/themes/icon/all/images.gif',
		cls: 'x-btn-icon',
		scope: this,
		state:'all',
		tooltip: '<b>'+'保存为图片'.loc()+'</b>',
		handler: function(){
			this.map.saveAsImage(); 
		}
	}));
	/*
	ButtonArray.push(new Ext.Toolbar.Separator({state:'all'}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'line',
				tooltip: '测距',
				icon: '/themes/icon/xp/ruler.gif',
				cls: 'x-btn-text-icon',
				disabled:false,
				state:'all',
				scope: this,
				hidden : false,
				enableToggle: true,
				toggleHandler: toggleButtonClick,
				pressed: false
	}));*/
	ButtonArray.push(new Ext.Toolbar.Separator({state:'all'}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'zoomIn',
				tooltip: '选定区域放大'.loc(),
				icon: '/themes/icon/all/zoom_in.gif',
				cls: 'x-btn-text-icon',
				disabled:false,
				state:'all',
				scope: this,
				hidden : false,
				handler :zoomIt
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'zoomOut',
				tooltip: '选定区域缩小'.loc(),
				icon: '/themes/icon/all/zoom_out.gif',
				cls: 'x-btn-text-icon',
				state:'all',
				disabled:false,
				scope: this,
				hidden : false,
				handler :zoomIt
	}));
	ButtonArray.push(new Ext.Toolbar.Separator({state:'all'}));

	using("bin.exe.MapControlPanel");
	this.TabNav =new bin.exe.MapControlPanel(this);

	this.MainPanel=new Ext.Panel({
			closable:false, 
			border:true,
			layout: 'fit',
			autoScroll: false,
			tbar:ButtonArray
	});     
	var editMenu = new Ext.menu.Menu({
			id: 'editMenu'
	});
	var searchMenu = new Ext.menu.Menu({
			id: 'searchMenu'
	});

	var drawControls={};
	var editLayers={};
	var modifyFeature;

	var currentMapId=this.mapId;
	this.MainPanel.on('afterrender',function(){
		var conn=new Ext.data.Connection();
		conn.request({    
				method: 'GET',    
				url:'/bin/gis/map.jcp?parent_id='+params.objectId
		});
		conn.on('requestcomplete', function(conn, oResponse ){	
			var mapJSON = Ext.decode(oResponse.responseText);
			var  tempToolBar=this.MainPanel.getTopToolbar();	
			this.param['satUrl']=mapJSON.satUrl;	
			this.param['satTransUrl']=mapJSON.satTransUrl;
			this.param['mapUrl']=mapJSON.mapUrl;
			this.param['centerX']=mapJSON.centerX;	
			this.param['centerY']=mapJSON.centerY;
			this.param['scale']=mapJSON.scale;
			this.param['mapType']=mapJSON.mapType;
			this.param['boundType']=mapJSON.boundType;
			this.param['parent_id']=params.objectId;
			this.param['minX']=mapJSON.minX;
			this.param['minY']=mapJSON.minY;
			this.param['maxX']=mapJSON.maxX;
			this.param['maxY']=mapJSON.maxY;
			this.mapType=mapJSON.mapType;

			if(mapJSON.mapType=='0'){
				var topBar=this.MainPanel.getTopToolbar();
				topBar.addButton(new Ext.Toolbar.Button({
							btnId:'normal',
							text: '地图'.loc(),
							cls: 'bmenu',
							disabled:false,
							state:'all',
							hidden : false,
							scope: this,
							pressed:true,
							enableToggle: true,
							handler :function(item){
								topBar.items.each(function(item){  
									if(item.btnId=='satellite'||item.btnId=='hybrid')
										item.toggle(false);
									else if(item.btnId=='normal')
										item.toggle(true);
								}, topBar.items);
								Ext.get(this.swfId).dom.changeLayer(item.btnId);
							}
				}));
				topBar.addButton(new Ext.Toolbar.Button({
							btnId:'satellite',
							text: '卫星图'.loc(),
							state:'all',
							cls: 'bmenu',
							disabled:false,
							hidden : false,
							scope: this,
							enableToggle: true,
							handler :function(item){
								topBar.items.each(function(item){  
									if(item.btnId=='normal'||item.btnId=='hybrid')
										item.toggle(false);
									else if(item.btnId=='satellite')
										item.toggle(true);
								}, topBar.items);
								Ext.get(this.swfId).dom.changeLayer(item.btnId);
							}
				}));
				topBar.addButton(new Ext.Toolbar.Button({
							btnId:'hybrid',
							text: '叠合图'.loc(),
							cls: 'bmenu',
							state:'all',
							disabled:false,
							hidden : false,
							scope: this,
							enableToggle: true,
							handler :function(item){
								topBar.items.each(function(item){  
									if(item.btnId=='normal'||item.btnId=='satellite')
										item.toggle(false);
									else if(item.btnId=='hybrid')
										item.toggle(true);
								}, topBar.items);
								Ext.get(this.swfId).dom.changeLayer(item.btnId);
							}
				}));
				topBar.add(new Ext.Toolbar.Separator({state:'all'}));
			}
			var mapEDIT=mapJSON.EDIT;		
			var haveEdit=false;
			var havePOI=false;
			if(mapEDIT&&mapEDIT.length>0){	
				for(i=0;i<mapEDIT.length;i++){		
					var objectId=mapEDIT[i].objectId;
					var newParams={};
					Ext.apply(newParams, params);
					newParams['objectId']=mapEDIT[i].objectId;
					newParams['layerType']=mapEDIT[i].layerType;
					this.editMenuItem['group']='EDIT';
					this.editMenuItem['type']='edit';
					this.editMenuItem['param']=newParams;
					this.editMenuItem['checked']=false;
					this.editMenuItem['scope']=this;
					this.editMenuItem['checkHandler']=onItemCheck;
					this.editMenuItem['text']=mapEDIT[i].logicName;
					this.editMenuItem['name']=mapEDIT[i].name;
					this.editMenuItem['searchEditor']=mapEDIT[i].searchEditor;
					this.editMenuItem['objectId']=mapEDIT[i].objectId;
					this.editMenuItem['layerType']=mapEDIT[i].layerType;
					this.editMenuItem['minScale']=mapEDIT[i].minScale;
					this.editMenuItem['maxScale']=mapEDIT[i].maxScale;
					this.editMenuItem['icon']=mapEDIT[i].icon;
					editMenu.add(this.editMenuItem);
				}
				tempToolBar.add(new Ext.Toolbar.Button({
							btnId:'drawFeature',
							text: '对象编辑'.loc(),
							icon: '/themes/icon/all/comment_add.gif',
							cls: 'x-btn-text-icon',
							disabled:false,
							state:'all',
							scope: this,
							hidden : false,
							menu:editMenu
				}));
				tempToolBar.add(new Ext.Toolbar.Separator());
				haveEdit=true;
			}
			if(haveEdit){
				tempToolBar.add(new Ext.Toolbar.Button({
							btnId:'drag',
							tooltip: '移动'.loc(),
							icon: '/themes/icon/all/arrow_out.gif',
							cls: 'x-btn-text-icon ',
							disabled:false,
							state:'edit',
							scope: this,
							disabled:true,
							hidden : false,
							pressed:true,
							enableToggle: true,
							handler :function(item){
								topBar.items.each(function(item){  
									if(item.btnId=='new'||item.btnId=='edit')
										item.toggle(false);
									else if(item.btnId=='drag')
										item.toggle(true);
								}, topBar.items);
								Ext.get(this.swfId).dom.changeEditMode(item.btnId);
							}
				}));  
				tempToolBar.add(new Ext.Toolbar.Button({
							btnId:'new',
							tooltip: '新建地理对象'.loc(),
							icon: '/themes/icon/all/add.gif',
							cls: 'x-btn-text-icon ',
							disabled:false,
							state:'edit',
							scope: this,
							disabled:true,
							hidden : false,
							enableToggle: true,
							handler :function(item){
								topBar.items.each(function(item){  
									if(item.btnId=='drag'||item.btnId=='edit')
										item.toggle(false);
									else if(item.btnId=='new')
										item.toggle(true);
								}, topBar.items);
								Ext.get(this.swfId).dom.changeEditMode(item.btnId);
							}
				}));  
				tempToolBar.add(new Ext.Toolbar.Button({
							btnId:'edit',
							tooltip: '编辑地理对象'.loc(),
							icon: '/themes/icon/all/pencil.gif',
							cls: 'x-btn-text-icon ',
							disabled:false,
							state:'edit',
							scope: this,
							disabled:true,
							hidden : false,
							enableToggle: true,
							handler :function(item){
								topBar.items.each(function(item){  
									if(item.btnId=='drag'||item.btnId=='new')
										item.toggle(false);
									else if(item.btnId=='edit')
										item.toggle(true);
								}, topBar.items);
								Ext.get(this.swfId).dom.changeEditMode(item.btnId);
							}
				}));     
				tempToolBar.add(new Ext.Toolbar.Separator({state:'all'}));
			}

			var mapPOI=mapJSON.POI;
			if(mapPOI&&mapPOI.length>0){
				for(i=0;i<mapPOI.length;i++){
					var objectId=mapPOI[i].objectId;
					var poiMenuIte={};
					var newParams={};
					Ext.apply(newParams, params);
					poiMenuIte['group']='POI';
					poiMenuIte['type']='poi';
					poiMenuIte['checked']=false;
					poiMenuIte['scope']=this;
					poiMenuIte['param']=newParams;
					poiMenuIte['checkHandler']=onItemCheck;
					poiMenuIte['text']=mapPOI[i].logicName;
					poiMenuIte['name']=mapPOI[i].name;
					poiMenuIte['objectId']=mapPOI[i].objectId;
					poiMenuIte['searchEditor']=mapPOI[i].searchEditor;
					poiMenuIte['searchId']=mapPOI[i].searchId;
					poiMenuIte['layerType']=mapPOI[i].layerType;
					poiMenuIte['minScale']=mapPOI[i].minScale;
					poiMenuIte['maxScale']=mapPOI[i].maxScale;
					poiMenuIte['icon']=mapPOI[i].icon;
					poiMenuIte['menuId']='';
					poiMenuIte['contextMenuArray']=mapPOI[i].menu;
					if(mapPOI[i].isDefault==true){
						this.poiMenuItem=poiMenuIte;
					}
					searchMenu.add(poiMenuIte);
				}
				var haveDefaule=false;
				for(i=0;i<mapPOI.length;i++){
					if(mapPOI[i].isDefault==true){
						haveDefaule=true;
						break;
					}
				}
				if(mapPOI.length==1&&haveDefaule){
				   
				}else{
					havePOI=true;
					tempToolBar.add(new Ext.Toolbar.Button({
								btnId:'searchLayers',
								text: '对象查询'.loc(),
								icon: '/themes/icon/all/flag_red.gif',
								cls: 'x-btn-text-icon  bmenu',
								disabled:false,
								state:'all',
								scope: this,
								hidden : false,
								menu:searchMenu
					}));
			}
			}
			if(haveEdit||havePOI){
				tempToolBar.add(new Ext.Toolbar.Button({
							btnId:'clear',
							tooltip: '刷新并清除已选结果'.loc(),
							icon: '/themes/icon/xp/clear.gif',
							cls: 'x-btn-text-icon ',
							disabled:false,
							state:'all',
							scope: this,
							hidden : false,
							handler :function(item){
								this.clearAll();
							}
				}));        
			}
			tempToolBar.add(new Ext.Toolbar.Separator({state:'all'}));

			params['containerId']=id;

			var prgInfo={
				url:'/bin/gis/bin/smartmap.swf'
			};
			Ext.applyIf(prgInfo, {
				id : this.swfId,
				width : "100%",
				bgColor:'#FFFFFF',
				height : "100%"
			});
		
			var config = {
				layout:'fit',
				id : id,
				scope:this,
				border : false,
				inited : false,
				html :this.getFlashObjectHTML(this.param, prgInfo),
				changeScale:function(newZ){
					if(typeof(searchMenu.items)!= 'undefined'){
						searchMenu.items.each(function(item){  
							if(newZ>item.minScale&&newZ<item.maxScale){
								item.enable();
							}else{
								item.disable();
							}	
						}, this);
					}
					if(typeof(editMenu.items)!= 'undefined'){
						editMenu.items.each(function(item){  
							if(newZ>item.minScale&&newZ<item.maxScale){
								item.enable();
							}else{
								item.disable();
							}	
						}, this);
					}
				}.createDelegate(this),
				showSearchFrame:function(params){
					using("bin.exe.SearchFrame");
					var searchFrameWin=new bin.exe.SearchFrame(params);
					searchFrameWin.show();
				}.createDelegate(this),
				openFrame:function(params){
					  using("bin.exe.MapFrame");
					  var mapFrameWin=new bin.exe.MapFrame(params,this.map);
					  mapFrameWin.show();
					  mapFrameWin.win.on('close',function(){
						if(params['operateType']!='Query'){
							if(mapFrameWin.win.normalClose==true){
								this.map.renderFeatureLayer(params);	
							}else{
								this.map.removeLastFeature();	
							}
						}
					  },this);
				}.createDelegate(this),
				enableButton:function(type){
	
				}.createDelegate(this),
				disableButton:function(type){

				}.createDelegate(this),
				getTurnOnLayers:function(){
					setTimeout(function() {
						var turnonLayers=[];
						var recs=this.TabNav.getTurnOnLayers();
						var opacities=this.TabNav.getTurnOnOpacities();
						var QParams=this.TabNav.getTurnOnOpacities();
						
						var layers=new Array();
						for (i = 0;i<recs.length ; i++){
							layers.push(recs[i].get('objectId'));
						}  
						for(i=0;i<recs.length;i++){
							this.showLayer(recs[i],true,opacities[i],QParams[i],layers);
						} 
					}.createDelegate(this), 800);
				}.createDelegate(this)
			}   
			var height = this.MainPanel.getEl().getHeight();
			config.height=height;

			var mapGroup=mapJSON.group;
			if(mapGroup&&mapGroup.totalCount>0){
				config.region='center';
				var MainSpacePanel = new Ext.Panel(config);
				var secondPanel=new Ext.Panel({
						closable:false, 
						border:true,
						layout: 'border',
						autoScroll: false,
						items:[MainSpacePanel,this.TabNav]
				}); 
				this.MainPanel.add(secondPanel);
				this.MainPanel.doLayout();
				this.TabNav.init(mapGroup);
				this.TabNav.turnOnDefaultLayers();
			}else{	
					
				var MainSpacePanel = new Ext.Panel(config);
				this.MainPanel.add(MainSpacePanel);
				this.MainPanel.doLayout();
			}
			this.map=Ext.get(this.swfId).dom;
		}, this);
	},this);
//------------------------------地图绘制------------------------------------------------------------------------

var measureControls;
function load(container) {
		if(this.poiMenuItem){
			this.drawFeature(this.poiMenuItem,this.poiMenuItem.param,true);
		}
};
this.getObjectHTML=function(param, config){	
		var source = '<obj'
				+ 'ect id="'   
				+ config.id
				+ '" name="'
				+ config.id
				+ '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'
				+ config.width
				+ '" height="'
				+ config.height
				+ '" codebase="'
				+ ((Ext.isSecure) ? "https" : "http")
				+ '://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">';
		source += '<param name="wmode" value="opaque" />';
		source += '<param name="movie" value="' + config.url + '" />';
		source += '<param name="bgcolor" value="' + config.bgColor + '" />';
		source += '<param name="allowScriptAccess" value="always" />';
		source += '<param name="FlashVars" value="' + Ext.urlEncode(param)
				+ '" />';
		source += '</obj' + 'ect>';
		return source;
};
this.getFlashObjectHTML=function (param, config){
	
		return Ext.isIE ? this.getObjectHTML(param, config) : this.getEmbedHTML(param, config);
};
this.getEmbedHTML=function(param, config){ 
	var source = '<embed type="application/x-shockwave-flash" pluginspage="'
			+ ((Ext.isSecure) ? "https" : "http")
			+ '://www.adobe.com/go/getflashplayer" ';
	source += 'src="' + config.url + '" ';
	source += 'width="' + config.width + '" ';
	source += 'height="' + config.height + '" ';
	source += 'id="' + config.id + '" ';
	source += 'name="' + config.id + '" ';
	source += 'wmode="opaque" ';
	source += 'bgColor="' + config.bgColor + '" ';
	source += 'allowScriptAccess="always" ';
	source += 'flashvars="' + Ext.urlEncode(param) + '" />';
	return source;
};
this.drawFeature =function (item,params,drawParam){   	
	var zoomscale=this.map.getZoom();
	if(zoomscale>item.minScale&&zoomscale<item.maxScale){
		if (item.searchEditor&&drawParam){
			var tb=this.MainPanel.getTopToolbar();
			tb.items.each(function(item){  
				if(item.state!='all'){  
					tb.remove(item);
				}
			});
			var editors = item.searchEditor.editors;
			if ((editors instanceof Array) && editors.length > 0) {
				if (item.searchEditor.libs.length > 0) {
					eval(item.searchEditor.libs);
				}

				tb.addFill();
				var eds = [];
				for (var i = 0; i < editors.length; i++){
					var defaultEditor=editors[i];
					if (editors[i].xtitleList) {
						defaultEditor = Ext.ComponentMgr.create(editors[i],'textfield');
						eds.push(defaultEditor);
					}
					tb.add(defaultEditor);
				}
				tb.addButton(new Ext.Toolbar.Button({
							text : '过滤'.loc(),
							scope : this,
							icon : '/themes/icon/xp/selectlink.gif',
							cls : 'x-btn-text-icon bmenu',
							handler : function(btn){
								var result = {};
								for (var i = 0; i < eds.length; i++) {
									if (!eds[i].validate()) {
										Ext.msg("error", "请改正标示出的错误.");
										return false;
									}
									
									var v=eds[i].getValue();
									if(v instanceof Date){
										v=v.format(eds[i].format);
									}
									result[eds[i].xtitleList] = v;
								}
								params['query'] = Ext.encode(result);
								this.renderFeature(item,params);
							}
				}));
				tb.addButton(new Ext.Toolbar.Button({
							text : '还原'.loc(),
							scope : this,
							icon : '/themes/icon/all/magifier_zoom_out.gif',
							cls : 'x-btn-text-icon bmenu',
							handler : function(btn) {
								params['query'] = "{}";
								this.renderFeature(item,params);
								for (var i = 0; i < eds.length; i++) {
									eds[i].reset();
								}
							}
				}));
				tb.doLayout();
			}
		}
		if(editMenu.items){
			editMenu.items.each(function(item){    
				item.setChecked(false);
			}, editMenu.items);
		}
		params['query'] = "{}";
		this.renderFeature(item,params);
	}else{
		Ext.msg("error",'该图层在当前比例尺下不可显示,该图层显示的范围在:'.loc()+'<br>'+item.minScale+"-"+item.maxScale);
	}
}
this.renderFeature=function(item,params){
	var newParams=Ext.apply({}, params);
	newParams["objectId"]=item.objectId;
	var menuArray=[];
	for(var i=0;i<item.contextMenuArray.length;i++){
		var menuObj={};
		menuObj['menuId']=item.contextMenuArray[i].menuId;
		menuObj['menuName']=item.contextMenuArray[i].menuName;
		menuArray.push(menuObj);
	}
	if(editMenu.items){
		editMenu.items.each(function(item){    
			item.setChecked(false);
		}, editMenu.items);
	}
	newParams["menuArray"]=menuArray;
	newParams["searchId"]=item.searchId;
	newParams["layerType"]=item.layerType;
	newParams['minScale']=item.minScale;
	newParams['maxScale']=item.maxScale;

	newParams["type"]="query";
	this.map.renderFeatureLayer(newParams);
}
this.editFeature =function(item,params){   	
	var newParams=Ext.apply({}, params);
	newParams["objectId"]=item.objectId;
	newParams["layerType"]=item.layerType;
	newParams["type"]="edit";
	newParams["editMode"]="drag";
	newParams['minScale']=item.minScale;
	newParams['maxScale']=item.maxScale;
	if(searchMenu.items){
		searchMenu.items.each(function(item){    
			item.setChecked(false);
		}, searchMenu.items);
	}
	this.map.renderFeatureLayer(newParams);
}
function zoomIt(item,pressed){
	if(item.btnId=='zoomOut'){
		this.map.zoomTo(true);
	}else{
		this.map.zoomTo(false);
	}

}
this.clearAll =function (){ 
	var topBar=this.MainPanel.getTopToolbar();
	topBar.items.each(function(item){  
		if(item.state=='edit')
			item.disable();
	}, topBar.items);
	if(editMenu.items){
		editMenu.items.each(function(item){    
			item.setChecked(false);
		}, searchMenu.items);
	}
	if(searchMenu.items){
		searchMenu.items.each(function(item){    
			item.setChecked(false);
		}, searchMenu.items);
	}
	this.map.clearAll();
}
function onItemCheck(item, checked){
	if(item.type=='edit'&&checked){
		var topBar=this.MainPanel.getTopToolbar();
		topBar.items.each(function(item){  
			if(item.state=='edit')
				item.enable();
		}, topBar.items);
		this.editFeature(item,item.param);
	}else if(item.type=='poi'&&checked){
		this.drawFeature(item,item.param,true);
	}
}
this.moveToNewCenter =function (centerParams){  
	
	if(this.mapType==0){
		this.poiMenuItem['param']=centerParams;
		var conn1=new Ext.data.Connection();
		conn1.request({    
			url:'/bin/gis/getMapCenter.jcp?',
			method: 'POST',    
			params:centerParams
		});
		conn1.on('requestcomplete', function(conn, oResponse ){	
			var moveToJSON = Ext.decode(oResponse.responseText);
			params['centerX']=moveToJSON.centerX;
			params['centerY']=moveToJSON.centerY; 
			this.map.moveToNewCenter(params);
			this.drawFeature(this.poiMenuItem,this.poiMenuItem.param,false);
		}, this);  
	}else{
		if(this.firstLoad){   
			this.firstLoad=false;
		}else{
			this.param['exportItem']=centerParams['exportItem'];
			this.param['exportTab']=centerParams['exportTab'];
			this.param['exportData']=centerParams['exportData'];
			this.param['dataId']=centerParams['dataId'];
			this.map.resetBaseLayer(this.param);
		}
	}
}.createDelegate(this);
this.reOrderLayer=function (layerName,new_index){
	this.map.changeLayerOrder(layerName, new_index);
};
this.changeOpacity=function(layerName,opacityValue){
	this.map.changeOpacity(layerName,opacityValue);
};
this.activateQueryLayer=function(layerName,opacityValue){
	this.map.activateQueryLayer(layerName);
};
this.showLayer=function(item,checked,opacity,queryParams,layers){
	var layerParams={};
	if(queryParams)
		layerParams['query'] = Ext.encode(queryParams);
	layerParams['parent_id']=params.objectId;
	layerParams['layer']=item.get('objectId');
	layerParams['layerName']=item.get('layerName');
	layerParams['minScale']=item.get('minScale');
	layerParams['maxScale']=item.get('maxScale');
	layerParams['searchId']=item.get('searchId');
	layerParams['menuId']='';;
	var menuArray=[];
	var contextMenuArray=item.get('menu');
	for(var i=0;i<contextMenuArray.length;i++){
		var menuObj={};
		menuObj['menuId']=contextMenuArray[i].menuId;
		menuObj['menuName']=contextMenuArray[i].menuName;
		menuArray.push(menuObj);
	}

	layerParams["menuArray"]=menuArray;
	layerParams['exportItem']=this.param['exportItem']
	layerParams['exportTab']=this.param['exportTab']
	layerParams['exportData']=this.param['exportData']
	layerParams['dataId']=this.param['dataId']
	layerParams['opacity']=opacity;
	layerParams['layers']=layers;  
	this.map.showLayer(layerParams,checked);
}  

//----------------------------------添加新的图层--------------------------------------------------------

this.dynamicMaps = {};
this.getMap=function (){
	return map;
}
function isEmty(s){
	for(var i in s)
		return false;
	return true;
}
function haveObject(e,s){
	for(var i in s){
		if(e==i){
			return true;
		}
	}
	return false;	
}
};
