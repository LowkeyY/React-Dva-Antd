CKEDITOR.dialog.add('musicPlayer', function(editor) {
	var escape = function(src,autoplay,loop) {
		var div = '<object id="ck_music_play" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" height="40"  width="50%" style="display:none">'
				+ '<param name="movie" value="this is a music." />'
				+ '<param name="musicsrc" value="'+ src +'" />'
				+ '<param name="autostart" value="'+autoplay+'" />'
				+ '<param name="loop" value="'+loop+'" />'
				+ '<param name="FlashVars" value="vcastr_file"/>'
				+ '<embed pluginspage=""></embed>'
				+ '</object>';
		return div;
	};
	return {
		title : '插入音乐播放器',
		resizable : CKEDITOR.DIALOG_RESIZE_BOTH,
		minWidth : 350,
		minHeight : 300,
		contents : [{
					id : 'info',
					label : '常规',
					accessKey : 'P',
					elements : [{
								type : 'hbox',
								widths : ['80%', '20%'],
								children : [{
											id : 'src',
											type : 'text',
											label : '源文件'
										}, {
											type : 'button',
											id : 'browse',
											filebrowser : 'info:src',
											style : "margin-top:16px;",
											//hidden : true,
											align : 'center',
											label : '网盘选取..',
											pattern : 'mp3;wma',
											onClick: function() {
												NETDISK_GETFILE(this);
											}
										}]
							}, {
								type : 'hbox',
								widths : ['50%', '50%'],
								children : [{
											type : 'select',
											label : '循环播放',
											id : 'myloop',
											required : true,
											'default' : 'false',
											items : [['是', 'true'],
													['否', 'false']]
										}, {
											type : 'select',
											label : '自动播放',
											id : 'myautoplay',
											required : true,
											'default' : 'false',
											items : [['是', 'true'],
													['否', 'false']]
										}]
								// children finish
							}, {
								type : 'textarea',
								style : 'width:300px;height:220px',
								label : '预览',
								id : 'code'
							}]
				}, {
					id : 'Upload',
					hidden : true,
					filebrowser : 'uploadButton',
					label : '上传',
					elements : [{
								type : 'file',
								id : 'upload',
								label : '上传',
								size : 38
							}, {
								type : 'fileButton',
								id : 'uploadButton',
								label : '发送到服务器',
								filebrowser : 'info:src',
								'for' : ['Upload', 'upload']
								// 'page_id', 'element_id'
						}]
				}],
		onOk : function() {
			myloop = this.getValueOf('info', 'myloop');
			myautoplay = this.getValueOf('info', 'myautoplay');
			mysrc = this.getValueOf('info', 'src');
			html = '' + escape(mysrc,myautoplay,myloop) + '';
			editor.insertHtml(html);
			
			
			/*var iframes = CKEDITOR.dom.element.createFromHtml("<iframe></iframe>", editor.document),
			divs = CKEDITOR.dom.element.createFromHtml("<div></div>", editor.document),
			othersDiv = CKEDITOR.dom.element.createFromHtml("<div></div>", editor.document),
			html5Div = CKEDITOR.dom.element.createFromHtml("<div></div>", editor.document);
			divs.setAttributes({
				id : "music_player_all",
				style : "width:50%;margin:0 auto;text-align:center;height:40px;background:beige url(/themes/icon/all/music.gif) no-repeat 50% 50%;"
			});
			othersDiv.setAttributes({
				id : "music_player_others",
				style : "margin:0 auto;text-align:center;display:none;"
			});
			html5Div.setAttributes({
				id : "music_player_html5",
				style : "margin:0 auto;text-align:center;display:none;"
			});
			var othersPlayer = CKEDITOR.dom.element.createFromHtml("<embed></embed>", editor.document),
			html5Player = CKEDITOR.dom.element.createFromHtml("<audio></audio>", editor.document),
			html5Source = CKEDITOR.dom.element.createFromHtml("<source></source>", editor.document),
			scriptThis = CKEDITOR.dom.element.createFromHtml("<script></script>", editor.document);
			othersPlayer.setAttributes({
				height : "40px",
				src : mysrc,
				autostart : myautoplay,
				loop : myloop
			}), othersDiv && othersPlayer.appendTo(othersDiv) && othersDiv.appendTo(divs);
			html5Player.setAttributes({
				controls : "controls",
				loop : myloop=="true" ? "true" : "false"
			}), html5Div && html5Player.appendTo(html5Div) && html5Div.appendTo(divs);
			if(myautoplay=="true")
				html5Player.setAttributes({
					autoplay : "true"
				});
			html5Source.setAttributes({
				src : mysrc
			}), html5Player && html5Source.appendTo(html5Player);
			scriptThis.appendText('typeof(Worker) !== "undefined" ? '
				+ 'document.getElementById("music_player_html5").style.display = "": '
				+ 'document.getElementById("music_player_others").style.display = "";'
				+ 'document.getElementById("music_player_all").removeAttribute("style")');
			divs.$.appendChild(scriptThis.$);// && divs.appendTo(iframes);

			editor.insertElement(divs);*/
		},
		onLoad : function() {
		}
	};
});
