/// <reference path="../vswd-ext_2.0.1.js" />

Ext.namespace('utils.km.file'); 


/*
utils.km.file.MediaPlayer=function(config){
	var player="";var playerWidth=400;var playerHeight=300;
	var isIE=window.ActiveXObject?true:false;
	if(config.fileName.match(/\.mp3$/i)){
		playerHeight=24;playerWidth=295;
		config.collapsible=true;
		config.modal=false;
		config.resizable=false;
		player+='<object type="application/x-shockwave-flash" data="../clientcode/flash/player.swf" id="mp3Player" height="24" width="290" style="margin:7px 0 0 5px">'
player+='<param name="movie" value="../clientcode/flash/player.swf">';
player+='<param name="quality" value="high">';
player+='<param name="menu" value="false">';
player+='<param name="wmode" value="transparent">';
player+='<param name="FlashVars" value="loop=yes&amp;autostart=yes&amp;soundFile='+config.url+'">'
player+='</object>';}
else if(config.fileName.match(/\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$/i))
	{this.quicktime=true;if(config.fileName.match(/\.m4a$/))
playerHeight=16;else
playerHeight=316;if(isIE)
	{player='<object id="player" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="100%" height="100%">'+'<param name="src" value="'+config.url+'" />'+'<param name="controller" value="true" />'+'<param name="autoplay" value="false" />'+'<param name="kioskmode" value="true" />'+'<param name="loop" value="true" />'+'<param name="scale" value="tofit" />'+'</object>'}
else{player='<object id="player" type="video/quicktime" data="'+config.url+'" width="100%" height="100%">'+'<param name="autoplay" value="false" />'+'<param name="controller" value="true" />'+'<param name="kioskmode" value="true" />'+'<param name="loop" value="true" />'+'<param name="scale" value="tofit" />'+'</object>'}}
else if(config.fileName.match(/\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$/i)){this.quicktime=false;if(config.fileName.match(/\.wma$|\.mp3$/))
playerHeight=64;else
playerHeight=372;if(isIE){player='<object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" id="player" width="100%" height="100%">'+'<param name="url" value="'+config.url+'" />'+'<param name="showcontrols" value="true" />'+'<param name="showstatusbar" value="true" /> '+'<param name="autostart" value="true" />'+'<param name="stretchtofit" value="true" /> '+'</object>';}else{player='<object type="video/x-ms-wmv" data="'+config.url+'" width="100%" height="100%" id="player">'+'<param name="src" value="'+config.url+'" />'+'<param name="autostart" value="true" />'+'<param name="showstatusbar" value="true" /> '+'<param name="controller" value="true" />'+'<param name="stretchtofit" value="true" /> '+'</object>';}}
config.title=config.fileName||"Media Player";config.html=player;config.width=playerWidth+20;config.height=playerHeight+45;config.constrainHeader=true;utils.km.file.MediaPlayer.superclass.constructor.call(this,config);this.on('beforeclose',this.player_beforeclose,this);};Ext.extend(utils.km.file.MediaPlayer,Ext.Window,{player_beforeclose:function(){var player=this.body.dom.firstChild;if(!player)return;try{if(this.quicktime&&player.Stop)
player.Stop();else if(player.controls)
player.controls.stop();}catch(err){}
player.style.visibility="hidden";this.body.dom.removeChild(player);player=null;playerpElm=null;this.getEl().remove();}});

*/
////////////////////////////////////////////////////////////////////
//
//                  utils.km.file.MediaPlayer
//
/////////////////////////////////////////////////////////////////// 
utils.km.file.MediaPlayer = function(config) {   

    var player = "";
    var playerWidth = 400;
    var playerHeight = 300;
    var isIE = window.ActiveXObject ? true : false;
       
    if (config.fileName.match(/\.mp3$/i)) {
        playerHeight = 24;
        playerWidth = 295;
        
        config.collapsible = true;
        config.modal = false;
        config.resizable = false;
        
        player += '<object type="application/x-shockwave-flash" data="/utils/km/file/player.swf" id="mp3Player" height="24" width="290" style="margin:7px 0 0 5px">'
        player += '<param name="movie" value="/utils/km/file/player.swf">';
        player += '<param name="quality" value="high">';
        player += '<param name="menu" value="false">';
        player += '<param name="wmode" value="transparent">';
        player += '<param name="FlashVars" value="loop=yes&amp;autostart=yes&amp;soundFile=' + config.url + '">'
        player += '</object>';                    
    } else if (config.fileName.match(/\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$/i)) {
        this.quicktime = true;
        if (config.fileName.match(/\.m4a$/))
            playerHeight = 16;
        else
            playerHeight = 316;
            
        if(isIE) {
            player = '<object id="player" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="100%" height="100%">' +
                '<param name="src" value="'+config.url+'" />' +
                '<param name="controller" value="true" />' +
                '<param name="autoplay" value="false" />' +
                '<param name="kioskmode" value="true" />' +
                '<param name="loop" value="true" />' +
                '<param name="scale" value="tofit" />' +
                '</object>'
        } else {
            player = '<object id="player" type="video/quicktime" data="'+config.url+'" width="100%" height="100%">' +
                '<param name="autoplay" value="false" />' +
                '<param name="controller" value="true" />' +
                '<param name="kioskmode" value="true" />' +
                '<param name="loop" value="true" />' +
                '<param name="scale" value="tofit" />' +                
                '</object>'
        }
        
    }else if (config.fileName.match(/\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$/i)) {
        this.quicktime = false;
        if (config.fileName.match(/\.wma$|\.mp3$/))
            playerHeight = 64;
        else
            playerHeight = 372;
        if (isIE) {
            player = '<object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" id="player" width="100%" height="100%">' +
                '<param name="url" value="'+config.url+'" />' +
                '<param name="showcontrols" value="true" />' +
                '<param name="showstatusbar" value="true" /> ' +
                '<param name="autostart" value="true" />' +
                '<param name="stretchtofit" value="true" /> ' +
                '</object>';            
        } else {
            player = '<object type="video/x-ms-wmv" data="'+config.url+'" width="100%" height="100%" id="player">' +
					'<param name="src" value="'+config.url+'" />' +
					'<param name="autostart" value="true" />' + 
					'<param name="showstatusbar" value="true" /> ' +
					'<param name="controller" value="true" />' +
					'<param name="stretchtofit" value="true" /> ' +
					'</object>';                
        }                
    }

    config.title = config.fileName || "Media Player";      
    config.html = player;
    config.width = playerWidth + 20;
    config.height = playerHeight + 45;
    config.constrainHeader = true;
     
    utils.km.file.MediaPlayer.superclass.constructor.call(this, config);
    
    this.on('beforeclose', this.player_beforeclose, this); 
};

Ext.extend(utils.km.file.MediaPlayer, Ext.Window, {       
    player_beforeclose: function() {
        var player = this.body.dom.firstChild;
        
        if(!player) return;
        
        try {
            if(this.quicktime && player.Stop)
                player.Stop();
            else if(player.controls)
                player.controls.stop();
        } catch(err) {
        }
            
        player.style.visibility = "hidden";
        this.body.dom.removeChild(player);
        player = null;
        playerpElm = null;
        this.getEl().remove();
    }
    
});

