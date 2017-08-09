
{
	function mxApplication(config)
	{
		var hideSplash = function(){
			var splash = document.getElementById('splash');
			if (splash != null){
				try{
					mxEvent.release(splash);
					mxEffects.fadeOut(splash, 100, true);
				}catch (e){
					splash.parentNode.removeChild(splash);
				}
			}
		};
		try{
			if (!mxClient.isBrowserSupported()){
				mxUtils.error('Browser is not supported!', 200, false);
			}else{
				var node = mxUtils.load(config).getDocumentElement();
				var editor = new mxEditor(node);
				var title = document.title;
				var funct = function(sender){
					
				};
				editor.addListener(mxEvent.OPEN, funct);
				editor.addListener(mxEvent.ROOT, funct);
				funct(editor);
				editor.setStatus('mxGraph '+mxClient.VERSION);
				hideSplash();
			}
		}catch(e){
			hideSplash();
			mxUtils.alert('Cannot start application: '+e.message);
			throw e; 
		}					
		return editor;
	}
}
