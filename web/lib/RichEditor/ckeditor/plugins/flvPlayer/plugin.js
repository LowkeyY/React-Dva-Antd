CKEDITOR.plugins.add('flvPlayer', {
			init : function(editor) {
				// plugin code goes here
				var pluginName = 'flvPlayer';
				CKEDITOR.dialog.add(pluginName, this.path
								+ 'dialogs/flvPlayer.js');
				editor.addCommand(pluginName,
						new CKEDITOR.dialogCommand(pluginName));
				
				editor.ui.addButton('flvPlayer', {
							label : '插入FLV视频',
							command : pluginName,
							icon:this.path+'/flvPlayer.gif'
						});
			}
		});
