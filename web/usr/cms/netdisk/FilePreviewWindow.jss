Ext.namespace("usr.cms.netdisk");
/*loadcss("usr.cms.netdisk.css.video-js.min");
using("usr.cms.netdisk.js.video.min");*/


usr.cms.netdisk.FilePreviewWindow = function() {
	this.playMedia = function(previewUrl,fileName) {
		using('utils.km.file.MediaPlayer')
		var player = this.createWindow({
					id : 'media-player-',
					iconCls : 'db-icn-play',
					url : previewUrl,
					fileName : fileName,
					closeAction : 'close'
				}, utils.km.file.MediaPlayer);
		player.show();
		},
	this.load = function(framePanel, parentPanel, param) {
		
		
		
		
		
		var fileDataType = param.fileDataType , fileDataId = param.fileDataId , fileIsLocal = param.fileIsLocal,fileName=param.fileDataName+param.fileDataType;
		alert(fileName);
		function getHtml() {
			if (!fileDataType || !fileDataId)
				return "";
			var previewUrl = "/ExternalItems/haiwaizhishigongxiang/FilePreview.jcp?fileDataId="+fileDataId+"&fileDataType="+fileDataType+"&fileIsLocal="+fileIsLocal;
			if (fileDataType.match(/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$/i)) {
				return "<img src='"+previewUrl+"' style='height:100%'/>"
			} else if (fileDataType.match(/\.mp3$|\.m4a$/i)) {
				this.playMedia(previewUrl,fileName);
			} else if (fileDataType.match(/\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$/i)) {
				this.playMedia(previewUrl,fileName);
				//return "<iframe src='"+previewUrl+"' style='width:100%;height:100%'></iframe>";
//				return '<object width="970" height="103" '
//+'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,2,0" '
//+'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"> '
//+'<param value="images/flash_ad-3-26.swf" name="movie"> '
//+'<param value="high" name="quality"> '
//+'<param value="transparent" name="wmode"> '
//+'<param value="exactfit" name="SCALE"> '
//+'<embed width="970" height="103" wmode="transparent" type="application/x-shockwave-flash" '
//+'pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" '
//+'quality="high" src="'+previewUrl+'"> '
//+'</object> ';
//				return '<embed src="'+previewUrl+'"width="300" height="220"></embed>';
				
				
//				var html='<video id="example_video_1" class="video-js vjs-default-skin" controls preload="none" width="640" height="264"';
//				html+='poster=""data-setup="{}">';
//					
//      			html+='<source src="'+previewUrl+'" type=\'video/mp4\' />';
//      			html+='<source src="'+previewUrl+'" type=\'video/webm\' />';
//      			html+='<source src="'+previewUrl+'" type=\'video/ogg\' />';
//    			html+='<track kind="captions" src="demo.captions.vtt" srclang="en" label="English"></track><!-- Tracks need an ending tag thanks to IE9 -->';
//    			hyml+='<track kind="subtitles" src="demo.captions.vtt" srclang="en" label="English"></track><!-- Tracks need an ending tag thanks to IE9 -->';
//				return html;				
				
				
				
				
				//return '<video id="example_video1" class="video-js vjs-default-skin" controls preload="none" width="100%" height="100%"'+'poster=""'+'data-setup="{}">'+'<source src="'+previewUrl+'" type="video/mp4" />' +'<source src="'+previewUrl+'" type="video/webm" />';
			}else if (fileDataType.match(/\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$/i) && (Ext.isIE === true)) {
				this.playMedia(previewUrl,fileName);
			} else if (fileDataType.match(/\.doc$|\.rtf$|\.odt$|\.sxw$|\.html$|\.htm$|\.txt$|\.xls$|\.sxc$/i)) {
				this.editFile(file)
			} else if (fileDataType.match(/\.ppt$|\.pps$/i)) {
				this.editFile(file, 800, 600)
			} else if (fileDataType.match(/\.zip$/i)) {
				this.extract(file.ID);
			} else if (fileDataType.match(/\.pdf$|\.ps$/i)) {
				return "<iframe src='"+previewUrl+"' style='width:100%;height:100%'></iframe>";
			} else if (fileDataType.match(/\.dwf$/i)) {
				return "<iframe src='"+previewUrl+"' style='width:100%;height:100%'></iframe>";
			}
			return "";
		}
		var mainPanel = new Ext.Panel({
					layout : 'fit',
					padding : '0 0 0 0',
					html : getHtml()
				})
		parentPanel.add(mainPanel);
		framePanel.add(parentPanel);
		framePanel.doLayout();
		
	}
}
