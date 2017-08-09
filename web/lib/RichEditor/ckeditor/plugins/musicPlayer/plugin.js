CKEDITOR.plugins.add('musicPlayer', {
			init : function(editor) {
				// plugin code goes here
				var pluginName = 'musicPlayer';
				CKEDITOR.dialog.add(pluginName, this.path
								+ 'dialogs/musicPlayer.js');
				editor.addCommand(pluginName,
						new CKEDITOR.dialogCommand(pluginName));
				
				editor.ui.addButton('musicPlayer', {
							label : '插入音乐播放器',
							command : pluginName,
							icon:this.path+'/music.gif'
						});
			}
		});
