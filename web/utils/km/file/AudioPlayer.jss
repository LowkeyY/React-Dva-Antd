utils.km.file.AudioPlayer=function(config){
	this.smSound=null;
	this.repeat=false;
	this.download_url='/utils/km/file/download.jcp?FileID=';
	this.app_title='Audio Player';
	this.pls_sel_cls='db-player-pls-item-sel';
	this.volumeBar=new Ext.Slider({
		width:145,
		value:100,
		listeners:{change:this.volumeChange,scope:this}
	});
	this.plStore=new Ext.data.SimpleStore({
		id:0,
		fields:['id','name','url'],
		data:[]
	});
	this.playlist=new Ext.DataView({
		multiSelect:true,
		style:'overflow:auto',
		overClass:'db-player-pls-item-over',
		itemSelector:'div.db-player-pls-item',
		emptyText:'<div class="db-player-pls-empty" unselectable="on">Drag files and folders from file manager here</div>',
		deferEmptyText:false,
		tpl:new Ext.XTemplate('<tpl for=".">','<div unselectable="on" class="db-player-pls-item" id="{id}">{#}. {shortName}</div>','</tpl>'),
		store:this.plStore,
		listeners:{dblclick:this.playlist_dblclick,scope:this}
	});
	this.playlist.prepareData=function(data){
		data.shortName=Ext.util.Format.ellipsis(data.name,45);
	return data;};
	utils.km.file.AudioPlayer.superclass.constructor.call(
		this,Ext.applyIf(config||{},
		{
		title:this.app_title,
		width:300,
		height:400,
		resizable:false,
		layout:'border',
		border:false,
		plain:true,
		defaults:{bodyStyle:'background-color:Transparent;',border:false},
		items:[{
			region:'north',
			border:false,
			autoHeight:true,
			items:[{
						itemId:'info',
						cls:'db-player-info',
						height:70,
						border:false,
						html:'<div class="db-player-info-pos">--:-- / --:--</div><div class="db-player-info-lod">Loading: --</div><div class="db-player-info-id3">...</div>'
					},{
						itemId:'progress',
						xtype:'slider',
						cls:'db-player-progress',
						clickToChange:false,
						animate:false,
						style:'background-color:Transparent',
						listeners:{beforechange:this.beforeSeek,dragstart:this.seekStart,dragend:this.seekEnd,scope:this}
				}],
			bbar:new Ext.Toolbar({
					cls:'db-player-toolbar',
					style:'background-image:none;border-top:none;background-color:Transparent;',
					items:[{
								iconCls:'db-icn-previous',
								tooltip:'Previous',
								handler:this.playlist_previous,
								scope:this
							},
							{
								iconCls:'db-icn-play',
								tooltip:'Play',
								handler:this.play,
								scope:this},
							{
								iconCls:'db-icn-pause',
								tooltip:'Pause',
								handler:this.pause,scope:this
							},
							{
								iconCls:'db-icn-stop',
								tooltip:'Stop',
								handler:this.stop,scope:this
							},{
								iconCls:'db-icn-next',
								tooltip:'Next',
								handler:this.playlist_next,scope:this
							},'-',
							{
								enableToggle:true,
								iconCls:'db-icn-sound',
								tooltip:'Toggle Mute',
								handler:this.toggleMute,scope:this
							},
							this.volumeBar
						]}
			)},
			{
				region:'center',
				layout:'fit',
				border:true,
				bodyStyle:'background-color:#fff;',
				cls:'db-player-pls',
				items:
					this.playlist,
					bbar:[{
							text:'Clear',
							tooltip:'Clear Playlist',
							iconCls:'db-icn-minus',
							handler:this.playlist_clear,scope:this
						},
						{
							text:'Randomize',
							tooltip:'Randomize Playlist',
							iconCls:'db-icn-shuffle',
							handler:this.playlist_randomize,
							scope:this},
						{
							text:'Repeat',
							tooltip:'Toggle Repeating',
							enableToggle:true,
							iconCls:'db-icn-repeat',
							handler:this.playlist_repeat,
							scope:this}
	]}]}));
	this.progressBar=this.items.itemAt(0).items.get('progress');
	this.infoPanel=this.items.itemAt(0).items.get('info');
	this.on('show',function(){
			this.createWinDropTarget();
	},this);
	this.on('close',function(){
		if(this.smSound){
			soundManager.destroySound(this.smSound.sID);
	}},this);
};
Ext.extend(utils.km.file.AudioPlayer,Ext.Window,{
	initEvents:function(){
		utils.km.file.AudioPlayer.superclass.initEvents.call(this);
		var map=new  Ext.KeyNav(
			this.el,
			{"down":function(e){
				this.playlist_next();
			},
			"up":function(e){
				this.playlist_previous();
			},
			"left":function(e){
				this.volumeBar.setValue(this.getVolume()-5);
			},
			"right":function(e){
				this.volumeBar.setValue(this.getVolume()+5);
			},
			"del":function(e){
				this.playlist_remove();
			},
		scope:this});
	},
	openFiles:function(files){
		if(files.length==0)
			return;
		this.plStore.removeAll();
		if(this.smSound){
			this.smSound.stop();
		this.smSound.unload();}
		this.addFiles(files);
		this.playSound(this.plStore.getAt(0).data);
	},
	addFiles:function(files){
		var data=new Array();
		var file=null;
		var url='';
		for(var index=0;index<files.length;++index){
			file=files[index];
			url=this.download_url+file.id,data[index]=[file.id,file.name,url];
		}
		this.plStore.loadData(data,true);
		this.playlist_refresh();
	},
	playSound:function(file){
		var node=null;
		if(this.smSound){
			node=this.playlist.getNode(this.smSound.relatedFile.id);
				if(node){
					Ext.get(node).removeClass(this.pls_sel_cls);
				}
		}
		node=this.playlist.getNode(file.id);
		Ext.get(node).addClass(this.pls_sel_cls);
		var self=this;
		this.smSound=soundManager.createSound({
			id:file.id,
			url:file.url,
			volume:this.getVolume(),
			onload:function(){self.sound_load();},
			onid3:function(){self.sound_id3();},
			whileplaying:function(){self.sound_playing();},
			whileloading:function(){self.sound_loading();},
			onplay:function(){self.sound_play();},
			onpause:function(){self.sound_pause();},
			onresume:function(){self.sound_play();},
			onstop:function(){self.sound_stop();},
			onfinish:function()
			{self.sound_finish();}});

		this.updateID3Info(file.name);
		this.smSound.relatedFile=file;
		this.smSound.play();
		this.setTitle((file.name+' - '+this.app_title).ellipse(35));
	},
	playlist_next:function(){
		var total=this.plStore.getCount();
		if(total==0) return;
		if(this.smSound){
				var current=this.plStore.indexOfId(this.smSound.relatedFile.id);
				var next=current+1;
				if(next==total)
					next=(this.repeat==true)?0:current;
				if((current!=next)||(total==1&&this.repeat==true)){
					this.smSound.stop();
					this.smSound.unload();
					this.playSound(this.plStore.getAt(next).data);}
			}else{
				this.playSound(this.plStore.getAt(0).data);
			}
	},
	playlist_previous:function(){
		var total=this.plStore.getCount();
		if(total==0) return;
		if(this.smSound){
			var current=this.plStore.indexOfId(this.smSound.relatedFile.id);
			var previous=current-1;
			if(previous<0)
				previous=(this.repeat==true)?(this.plStore.getCount()-1):current;
			if(current!=previous){
				this.smSound.stop();
				this.smSound.unload();
				this.playSound(this.plStore.getAt(previous).data);}
			}else{
				this.playSound(this.plStore.getCount()-1);}
	},
	playlist_dblclick:function(pls,index,node,e){
		if(this.smSound){
			this.smSound.stop();
			this.smSound.unload();
		}
		var rec=this.playlist.getRecord(node);
		this.playSound(rec.data);
	},
	playlist_clear:function(){
		this.plStore.removeAll();
	},
	playlist_remove:function(){
		var selection=this.playlist.getSelectedRecords();
		var index=0;
		var rec=null;
		for(index;index<this.playlist.getSelectionCount();index++){
			rec=selection[index];
			this.plStore.remove(rec);
		}
		this.playlist_refresh();
	},
	playlist_repeat:function(){
		this.repeat=!this.repeat;
	},
	playlist_randomize:function(){
		var total=this.plStore.getCount();
		if(total<2)
			return;
		var index=0;
		var rnd=0
		var rec=null;
		for(index;index<total;++index){
			rnd=Math.random();
			rnd=parseInt(rnd*total);
			rec=this.plStore.getAt(index);
			this.plStore.remove(rec);
			this.plStore.insert(rnd,rec)
		}
		this.playlist_refresh();
	},
	playlist_refresh:function(){
		this.playlist.refresh();
		if(this.smSound){
			var node=this.playlist.getNode(this.smSound.relatedFile.id);
			if(node)
				Ext.get(node).addClass(this.pls_sel_cls);
				}
	},
	play:function(){
		if(this.smSound){
			this.smSound.play();
		}
	},
	pause:function(){
		if(this.smSound){
			this.smSound.pause();
			}
	},
	stop:function(){
		if(this.smSound){
			this.smSound.stop();
	}},
	toggleMute:function(){
		if(this.smSound){
			if(this.mute){
				this.smSound.unmute();
			}else{
				this.smSound.mute();
			}
		this.mute=!this.mute;}
	},
	setVolume:function(vol){
		if(this.smSound){
			this.smSound.setVolume(vol);
	}},
	sound_load:function(){
	},
	sound_playing:function(){
		if(!this.seeking){
			var pos=this.getPosition();
			this.progressBar.setValue(pos);
		}
		this.updatePositionInfo(this.smSound.position,this.smSound.durationEstimate);
	},
	sound_loading:function(){
		var lod=this.getPosition(true);
		this.updateLoadingInfo(lod);
	},
	sound_id3:function(){
		var artist=this.smSound.id3['artist'];
		var title=this.smSound.id3['songname']||this.smSound.relatedFile.name;
		var data=artist?(artist+' - '+title):title;
		this.updateID3Info(data);
	},
	sound_play:function(){
		this.updatePlaybackInfo('play');
	},
	sound_pause:function(){
		this.updatePlaybackInfo('pause');
	},
	sound_stop:function(){
		this.updatePlaybackInfo('stop');
		this.smSound.setPosition(0);
		this.progressBar.setValue(0);
		this.updatePositionInfo(0,this.smSound.durationEstimate);
	},
	sound_finish:function(){
		this.smSound.unload();
		this.playlist_next();
	},
	beforeSeek:function(slider,newValue,oldValue){
		if(this.smSound==null||newValue>this.getPosition(true))
		return false;
		return true;
	},
	seekStart:function(slider,e){
		this.seeking=true;
	},
	seekEnd:function(slider,e){
		if(this.smSound){
			var pos=this.progressBar.getValue()*this.smSound.durationEstimate/100;
			this.smSound.setPosition(pos);
		}
		this.seeking=false;
	},
	volumeChange:function(slider,newValue){
		this.setVolume(newValue);
	},
	updatePositionInfo:function(pos,dur){
		if(this.posInfo==null){
			this.posInfo=this.infoPanel.body.dom.firstChild;
		}
		this.posInfo.innerHTML=this.formatTime(pos)+' / '+this.formatTime(dur);
	},
	updateLoadingInfo:function(perc){
		if(this.lodInfo==null){
			this.lodInfo=this.infoPanel.body.dom.childNodes[1];
		}
		this.lodInfo.innerHTML='Loading: '+perc+'%';
	},
	updateID3Info:function(info){
		if(this.id3Info==null){
		this.id3Info=this.infoPanel.body.dom.childNodes[2];
		}
		this.id3Info.innerHTML=info;
	},
	updatePlaybackInfo:function(cls){
		if(this.id3Info==null){
			this.id3Info=this.infoPanel.body.dom.childNodes[2];
		}
		this.id3Info.className='db-player-info-id3 db-player-info-'+cls;
	},
	getPosition:function(loaded){
		if(this.smSound){
			var duration=loaded?this.smSound.duration:this.smSound.position;
			var durationEstimate=this.smSound.durationEstimate;
			if(durationEstimate>0){
				return parseInt(duration*100/durationEstimate);
			}
		}
		return 0;
	},
	getVolume:function(){
		return this.volumeBar.getValue();
	},
	formatTime:function(ms){
		var s=ms/1000;
		var min=parseInt(s/60);
		var sec=parseInt(s%60);
		return String.leftPad(min,2,'0')+':'+String.leftPad(sec,2,'0');
	},
	createWinDropTarget:function(win){
		var myDrop=new Ext.dd.DropTarget(
			this.body,
			{
				dropAllowed:'x-dd-drop-ok-add',
				dropNotAllowed:'x-dd-drop-nodrop',
				ddGroup:this.ddGroup||'defaultDD',
				player:this,
				notifyDrop:function(dd,e,data){
					if(this.canDrop(data)){
						var pls_drop=e.getTarget('#'+this.player.items.item(1).id);
						var files=new Array();
						var folders=new Array();
						var records=data.selections;
						var data=null;
						var ft=null;
						for(var i=0;i<records.length;++i){
							var data=records[i].data;
							var ft=data.folderType
								if(ft!=null&&ft==utils.km.file.FolderType.RootFolder||ft==utils.km.file.FolderType.FileFolder||ft==utils.km.file.FolderType.SharedFolder){
									if(data.folder)
										folders[folders.length]=data.id;
									else if(data.name.match(/\.mp3$/i))
										files[files.length]={id:data.id,name:data.name};
								}
						}
						if(folders.length>0){
							RemoteMethods.GetAudioFiles(
								folders,
								function(result){
									if(result!=null){
										for(var index=0;index<result.length;++index){
											files[files.length]={id:result[index][0],name:result[index][1]};
										}
									}
									if(pls_drop)
										this.player.addFiles(files);
									else
										this.player.openFiles(files);
								},this);
						}else {
							if(pls_drop)
								this.player.addFiles(files);
							else
								this.player.openFiles(files);
						}
						return true;
				}
				return false;},
				notifyOver:function(dd,e,data){
					if(this.canDrop(data)){
						return this.dropAllowed;
					}else{
						return this.dropNotAllowed;
					}},
				canDrop:function(data){
					if(data&&data.selections&&data.selections.length>0){
						var records=data.selections;
						for(var i=0;i<records.length;++i){
							var ft=records[i].data.folderType
							if(ft!=null&&ft==utils.km.file.FolderType.RootFolder||ft==utils.km.file.FolderType.FileFolder||ft==utils.km.file.FolderType.SharedFolder)
								return true;
						}
					}
					return false;
				}
		});
}});

