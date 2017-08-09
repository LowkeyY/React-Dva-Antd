CKEDITOR.dialog.add('flvPlayer', function(editor) {

	var escape = function(value) {
		return value;
	};
	return {
		title : '插入FLV视频',
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
										},{
											type : "button",
											id : "browse",
											style : "display:inline-block;margin-top:14px;",
											align : "center",
											label : '网盘选取..',
											hidden : !NETDISK_USINGJSS,
											filebrowser : "info:src",
											pattern : 'flv',
											onClick: function() {
												NETDISK_GETFILE(this);
											}
										}
										/*, {
											type : 'button',
											id : 'browse',
											filebrowser : 'info:src',
											hidden : true,
											align : 'center',
											label : '浏览服务器'
										}*/]
							}, {
								type : 'hbox',
								widths : ['35%', '35%', '30%'],
								children : [{
											type : 'text',
											label : '视频宽度',
											id : 'mywidth',
											'default' : '470px',
											style : 'width:50px'
										}, {
											type : 'text',
											label : '视频高度',
											id : 'myheight',
											'default' : '320px',
											style : 'width:50px'
										}, {
											type : 'select',
											label : '自动播放',
											id : 'myloop',
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
			mywidth = this.getValueOf('info', 'mywidth');
			myheight = this.getValueOf('info', 'myheight');
			myloop = this.getValueOf('info', 'myloop');
			mysrc = this.getValueOf('info', 'src');
			html = '' + escape(mysrc) + '';

			editor
					.insertHtml('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="'
							+ mywidth
							+ '" height="'
							+ myheight
							+ '">'
							+ '<param name="movie" value="/lib/RichEditor/ckeditor/plugins/flvPlayer/Flvplayer.swf" />'
							+ '<param name="quality" value="high" />'
							+ '<param name="allowFullScreen" value="true" />'
							+ '<param name="FlashVars" value="vcastr_file='
							+ html
							+ '" />'
							+ '<embed src="/lib/RichEditor/ckeditor/plugins/flvPlayer/Flvplayer.swf" allowfullscreen="true"  quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'
							+ mywidth
							+ '" height="'
							+ myheight
							+ '"></embed>'
							+ '</object>');

		},
		onLoad : function() {
		}
	};
});
