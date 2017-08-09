// / <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('usr.cms.netdisk');

/*
 * usr.cms.netdisk.MediaPlayer=function(config){ var
 * player="";var playerWidth=400;var playerHeight=300; var
 * isIE=window.ActiveXObject?true:false; if(config.fileName.match(/\.mp3$/i)){
 * playerHeight=24;playerWidth=295; config.collapsible=true; config.modal=false;
 * config.resizable=false; player+='<object
 * type="application/x-shockwave-flash" data="../clientcode/flash/player.swf"
 * id="mp3Player" height="24" width="290" style="margin:7px 0 0 5px">' player+='<param
 * name="movie" value="../clientcode/flash/player.swf">'; player+='<param
 * name="quality" value="high">'; player+='<param name="menu" value="false">';
 * player+='<param name="wmode" value="transparent">'; player+='<param
 * name="FlashVars"
 * value="loop=yes&amp;autostart=yes&amp;soundFile='+config.url+'">' player+='</object>';}
 * else if(config.fileName.match(/\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$/i))
 * {this.quicktime=true;if(config.fileName.match(/\.m4a$/)) playerHeight=16;else
 * playerHeight=316;if(isIE) {player='<object id="player"
 * classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B"
 * codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="100%"
 * height="100%">'+'<param name="src" value="'+config.url+'" />'+'<param
 * name="controller" value="true" />'+'<param name="autoplay" value="false"
 * />'+'<param name="kioskmode" value="true" />'+'<param name="loop"
 * value="true" />'+'<param name="scale" value="tofit" />'+'</object>'}
 * else{player='<object id="player" type="video/quicktime"
 * data="'+config.url+'" width="100%" height="100%">'+'<param name="autoplay"
 * value="false" />'+'<param name="controller" value="true" />'+'<param
 * name="kioskmode" value="true" />'+'<param name="loop" value="true" />'+'<param
 * name="scale" value="tofit" />'+'</object>'}} else
 * if(config.fileName.match(/\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$/i)){this.quicktime=false;if(config.fileName.match(/\.wma$|\.mp3$/))
 * playerHeight=64;else playerHeight=372;if(isIE){player='<object
 * classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" id="player" width="100%"
 * height="100%">'+'<param name="url" value="'+config.url+'" />'+'<param
 * name="showcontrols" value="true" />'+'<param name="showstatusbar"
 * value="true" /> '+'<param name="autostart" value="true" />'+'<param
 * name="stretchtofit" value="true" /> '+'</object>';}else{player='<object
 * type="video/x-ms-wmv" data="'+config.url+'" width="100%" height="100%"
 * id="player">'+'<param name="src" value="'+config.url+'" />'+'<param
 * name="autostart" value="true" />'+'<param name="showstatusbar" value="true" />
 * '+'<param name="controller" value="true" />'+'<param name="stretchtofit"
 * value="true" /> '+'</object>';}} config.title=config.fileName||"Media
 * Player";config.html=player;config.width=playerWidth+20;config.height=playerHeight+45;config.constrainHeader=true;usr.cms.netdisk.MediaPlayer.superclass.constructor.call(this,config);this.on('beforeclose',this.player_beforeclose,this);};Ext.extend(usr.cms.netdisk.MediaPlayer,Ext.Window,{player_beforeclose:function(){var
 * player=this.body.dom.firstChild;if(!player)return;try{if(this.quicktime&&player.Stop)
 * player.Stop();else if(player.controls) player.controls.stop();}catch(err){}
 * player.style.visibility="hidden";this.body.dom.removeChild(player);player=null;playerpElm=null;this.getEl().remove();}});
 * 
 */

// usr.cms.netdisk.MediaPlayer
// /////////////////////////////////////////////////////////////////
usr.cms.netdisk.MediaPlayer = function(config) {

	var player = "";
	var playerWidth = 640;
	var playerHeight = 500;
	var isIE = Ext.isIE6 || Ext.isIE7 || Ext.isIE8;
	if (config.fileName.match(/\.mp3$/i)) {
		playerHeight = 100;
		playerWidth = 295;

		config.collapsible = true;
		config.modal = false;
		config.resizable = false;

		// player='<object type="application/x-shockwave-flash"
		// data="/ExternalItems/haiwaizhishigongxiang/dewplayer-rect.swf?mp3='+config.url+'"
		// width="240" height="20" id="dewplayer-rect"><param name="wmode"
		// value="transparent" /><param name="movie"
		// value="dewplayer-rect.swf?mp3=mp3/test1.mp3|mp3/test2.mp3|mp3/test3.mp3"
		// /></object>';

		// player+='<embed autoplay="false" src="'+config.url+'" width="200"
		// height="45" />';

		if (isIE) {
			player = '<object height="100%" type="application/x-mplayer2" width="100%" id="priviewDiv">'
					+
					// '<param name="filename"
					// value="/ExternalItems/haiwaizhishigongxiang/preview.mp4"
					// />'+
					'<param name="filename" value="'
					+ config.url
					+ '" />'
					+ '<param name="autostart" value="false" />'
					+ '<param name="loop" value="true"/>' + '</object>';
		} else {
			player = '<audio controls="controls" id="priviewDiv"> '
					+ '<source src="' + config.url + '" /> ' + '</audio> '
		}

		// player+='<embed autoplay="false" src="' + config.url + '" width="200"
		// height="8" />';

	} else if (config.fileName
			.match(/\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$|\.avi$/i)) {
		this.quicktime = true;
		if (config.fileName.match(/\.m4a$/))
			playerHeight = 16;
		else
			playerHeight = 500;

		// player='<video id="example_video_1" class="video-js vjs-default-skin"
		// controls preload="none" width="100%" height="100%"'+
		// 'poster=""'+
		// ' data-setup="{}">'+
		// '<source src="'+config.url+'" type="video/mp4" />'+
		// '<track kind="captions" src="demo.captions.vtt" srclang="en"
		// label="English"></track><!-- Tracks need an ending tag thanks to IE9
		// -->'+
		// '<track kind="subtitles" src="demo.captions.vtt" srclang="en"
		// label="English"></track><!-- Tracks need an ending tag thanks to IE9
		// -->'+
		// '</video>';

		// player=' <video src="'+config.url+'" width="320" height="200"
		// controls preload></video> ';
		if (config.fileName.match(/\.avi$/i)) {
			alert("您的浏览器不支持预览AVI格式文件，请下载后播放。");
		}
		if (isIE) {

			player = '<object height="100%" type="video/x-ms-wmv" width="100%" id="priviewDiv">'
					+
					// '<param name="filename"
					// value="/ExternalItems/haiwaizhishigongxiang/preview.mp4"
					// />'+
					'<param name="filename" value="'
					+ config.url
					+ '" />'
					+ '<param name="autostart" value="false" />'
					+ '<param name="loop" value="true"/>' + '</object>';

			// player = '<object
			// classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
			// codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0"
			// width="100%" height="100%">'+
			// '<param name="movie" value="'+config.url+'">'+
			// '<param name="quality" value="high">'+
			// '<param name="wmode" value="transparent">'+
			// '<embed src="'+config.url+'" width="100%" height="100%"
			// quality="high"
			// pluginspage="http://www.macromedia.com/go/getflashplayer"
			// type="application/x-shockwave-flash"
			// wmode="transparent"></embed></object>'
		} else {

			player = '<video width="100%" height="100%" controls="controls" id="priviewDiv"> '
					+ '<source src="'
					+ config.url
					+ '" type="video/mp4"></source> '
					+ '<source src="'
					+ config.url
					+ '" type="video/ogg"></source> '
					+ '<source src="'
					+ config.url
					+ '" type="video/webm"></source> ' +

					'</video> ';

			// player='<video id="example_video_1" class="video-js
			// vjs-default-skin"'+
			// 'controls preload="auto" width="100%" height="100%" '+
			// 'data-setup=\'{"example_option":true}\'> '+
			// '<source src="'+config.url+'" type=\'video/mp4\' /> '+
			// '</video> ';

			// player += '<video width="320" height="240" controls>';
			// player += '<source src="'+config.url+'" type="video/mp4">';
			// player += '<object data="'+config.url+'" width="320"
			// height="240">';
			// player += '<embed src="'+config.url+'" width="320"
			// height="240">';
			// player += '</object> ';
			// player += '</video>';
		}

	} else if (config.fileName.match(/\.flv$|.swf$/i)) {

		//player+='<embed  width="100%" height="100%" src="'+config.url+'">'
		player += '<object class id="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="100%" height="100%">';
		player += ' <param name="movie" value="/ExternalItems/haiwaizhishigongxiang/flvplayer.swf">';
		player += '<param name="quality" value="high">';
		player += '<param name="allowFullScreen" value="true">';
		player += '<param name="FlashVars" value="vcastr_file=/ExternalItems/haiwaizhishigongxiang/flv.flv&LogoText=www.lanrentuku.com&BufferTime=3&IsAutoPlay=1">';
		player += '<embed src="/ExternalItems/haiwaizhishigongxiang/flvplayer.swf" allowfullscreen="true" flashvars="vcastr_file=/ExternalItems/haiwaizhishigongxiang/flv.flv&LogoText=www.lanrentuku.com&IsAutoPlay=1" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="300" height="240"></embed>';
		player += '</object>';

	} else if (config.fileName.match(/\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$/i)) {
		this.quicktime = false;
		if (config.fileName.match(/\.wma$|\.mp3$/))
			playerHeight = 150;
		else
			playerHeight = 372;
		if (isIE) {
			player = '<object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" id="priviewDiv" width="100%" height="100%">'
					+ '<param name="url" value="'
					+ config.url
					+ '" />'
					+ '<param name="showcontrols" value="true" />'
					+ '<param name="showstatusbar" value="true" /> '
					+ '<param name="autostart" value="true" />'
					+ '<param name="stretchtofit" value="true" /> '
					+ '</object>';
		} else {
			player = '<video id="priviewDiv" class="video-js vjs-default-skin" controls preload="none" width="100%" height="100%"'
					+ 'poster=""'
					+ 'data-setup="{}">'
					+ '<source src="'
					+ config.url
					+ '" type="video/mp4" />'
					+ '<source src="'
					+ config.url + '" type="video/webm" />'
		}
	}

	config.title = config.fileName || "Media Player";
	config.html = player;
	config.width = playerWidth + 20;
	config.height = playerHeight + 45;
	config.constrainHeader = true;
	config.tbar = [{
		text : "下载源文件",
		handler : function() {
			window
					.open("/usr/cms/netdisk/downFile.jcp?fileId=" + config.id + "&path="
								+ config.path + "&file_name=" + config.fileName+"&file_type="+config.file_type)
		},
		icon : "/themes/icon/common/downfile.gif"
	}];

	usr.cms.netdisk.MediaPlayer.superclass.constructor
			.call(this, config);

	this.on('beforeclose', this.player_beforeclose, this);
};

Ext.extend(usr.cms.netdisk.MediaPlayer, Ext.Window, {
			player_beforeclose : function() {
				var div = document.getElementById("priviewDiv");
				var isIE = Ext.isIE6 || Ext.isIE7 || Ext.isIE8;
				if (isIE) {
					div.pause();
					div.CurrentPosition = 0;
					div.style.display = "none";
					div.parentNode.removeChild(div);
				} else {
					if (div == null) {
						div = document.getElementById("example_video_1");
					}
					div.style.display = "none";
					div.parentNode.removeChild(div);

				}

				var player = this.body.dom.firstChild;

				if (!player)
					return;

				try {
					if (this.quicktime && player.Stop)
						player.Stop();
					else if (player.controls)
						player.controls.stop();
				} catch (err) {

				}

				// player.style.visibility = "hidden";
				this.body.dom.removeChild(player);
				player = null;
				playerpElm = null;
				// this.getEl().remove();
			}

		});
