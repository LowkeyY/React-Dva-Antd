Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.FilePreviewUnit = function() {
}

ExternalItems.haiwaizhishigongxiang.FilePreviewUnit.prototype = {
	viewUrl : "/ExternalItems/haiwaizhishigongxiang/FilePreview.jcp?fileDataId={0}&fileDataType={1}&fileIsLocal={2}&fileExportData={3}",
	createWindow : function(config, cls) {
		var desktop = WorkBench.Desk.getDesktop();
		var win = desktop.getWindow(config.id);
		if (!win) {
			win = desktop.createWindow(config, cls)
		}
		return win;
	},
	canView : function(fileType) {
		return fileType
				.match(/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$|\.mp3$|\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$|\.asf$|\.avi$|\.wmv$|\.mpg$|\.wma$|\.flv$/i);
	},
	playMedia : function(path, fileName, fileType,fileId) {
		using('ExternalItems.haiwaizhishigongxiang.MediaPlayer')
		var player = this.createWindow({
					id : fileId,
					iconCls : 'db-icn-play',
					url : String.format(this.viewUrl, path, fileName, true,fileId),
					fileName : fileName + fileType,
					closeAction : 'close'
				}, ExternalItems.haiwaizhishigongxiang.MediaPlayer);
		player.show();
	},
	
	viewImage : function(path, fileName, fileType,fileId) {
		using("utils.km.file.viewer.slide");
		loadcss("utils.km.file.viewer.slide");
		if (Ext.isIE6) {
			loadcss("utils.km.file.viewer.ie6");
		}

		var imgs = [];
					var id = fileId;
					var src = String.format(this.viewUrl, path, fileName, true,fileId);
					var cfg = {
						//tagName : 'a', //delete by zhang
						name : fileName,
						title : fileName+fileType,
						href : src,
						src : src,
						thumbnail : src ,
						id : id,
						onclick : function() {
							Ext.hstz.expandx(this);
							return false;
						}
					}
		
		imgs.push(cfg);
		Ext.hstz.updateAnchors(imgs);
		Ext.hstz.expandx(cfg);
		return false;
	},


	doView : function(fileType, path, fileName,fileId) {
		if (fileType.match(/\.jpg$|\.jpeg$|\.gif$|\.bmp$|\.png$/i)) {
			this.viewImage(path, fileName, fileType,fileId);
			
		} else if (fileType
				.match(/\.mp3$|\.mov$|\.mp4$|\.m4v$|\.m4b$|\.3gp$|\.m4a$|\.avi$|\.flv$|\.swf$/i)) {
			this.playMedia(path, fileName, fileType,fileId);
		} else if (fileType.match(/\.asf$|\.wmv$|\.mpg$|\.wma$/i)) {
			this.playMedia(path, fileName, fileType,fileId);
		} else if (fileType
				.match(/\.doc$|\.rtf$|\.odt$|\.sxw$|\.html$|\.htm$|\.txt$|\.xls$|\.sxc$/i)) {
			this.editFile(file)
		} else if (fileType.match(/\.ppt$|\.pps$/i)) {
			this.editFile(file, 800, 600)
		} else if (fileType.match(/\.zip$/i)) {
			this.extract(file.ID);
		} else if (fileType.match(/\.pdf$|\.ps$/i)) {
			return "<iframe src='" + previewUrl
					+ "' style='width:100%;height:100%'></iframe>";
		} else if (fileType.match(/\.dwf$/i)) {
			this.showDWF(file);
		}
	}
}