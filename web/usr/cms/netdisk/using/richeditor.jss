Ext.ns("usr.cms.netdisk.using");
usr.cms.netdisk.using.richeditor = function(field) {
	var dialog , target;
	if((dialog = field.getDialog()) && field.filebrowser && (target = field.filebrowser.target)){
		var distPaths = target.split(":");
		if(distPaths.length == 2){			
			var ele = dialog.getContentElement(distPaths[0],distPaths[1]);
			CPM.openModuleWindow('88ce2a8b-a3c0-4dac-898f-6e950c6e7d36', {} , {exportFilters : field.pattern || ""} , {
	      			width : 800,
	      			height : 600,
	      			getNetdiskValue : function(name , type , path){
	      				if(name && type && path)
	      					return path + (path.charAt(path.length - 1) == '/' ? '' : '/') + (name.endsWith('.'+type) ? name : name + '.' +type);
	      				return "";
	      			},
	      			getNetdiskPath : function(path){
	      				var index = path.startsWith("file:") ? path.indexOf("/", (path.indexOf("/") + 1)) : -1;
	      				return index == -1 ? path : '/netdisk'+path.substr(index);
	      			},
	      			getNetdiskPathById : function(id){
	      				var result = "";
	      				if(id.length == 36){
	      					for(i = id.length - 2 ; i < id.length ; i++)
	      						result += ("0x" + id.charCodeAt(i).toString(16));
	      					result = '/netdisk/' + result + "/" + id.substring(0 , id.length - 2);
	      				}
	      				return result;
	      			},
		  			getComponentGridPanel : function(){
		  				var cpanel = this.find('isFrame',true) , pid;
						if(cpanel.length && (cpanel = cpanel[0]) && cpanel.frameIndex && (pid = cpanel.frameIndex.center)){
							var panel = Ext.getCmp(pid);
							if(panel && (panel = panel.getActiveTab()) && panel.getComponent(0) instanceof Ext.grid.GridPanel)
								return panel.getComponent(0);
						}
						return '';
		  			},
					buttons : [{
						text : '确定',
						field : ele,
						handler : function() {
							var win , grid;
							if((win = this.findParentByType(Ext.Window)) && (grid = win.getComponentGridPanel())){
								var rec = grid.getSelectionModel().getSelected();
								if (typeof(rec) == 'undefined') {
									if (grid.getStore().getCount() == 1) {
										rec = grid.getStore().getAt(0);
									}
								}
								if(typeof(rec) == 'undefined')
									Ext.msg('warn', '请选择要需要的文件。');
								else{
									var value = win.getNetdiskValue(rec.get('FILE_NAME') , rec.get('FILE_TYPE') , rec.get('FILE_DIR'));
									if(this.field.isReplace){
										this.field.setLongdesc('netdisk(' + rec.get('PHY_FILE_ID') + '):'+ NETDISK_FILE_STARTFLAG + value + "::" + win.getNetdiskPathById(rec.get('PHY_FILE_ID')));
										this.field.setValue(NETDISK_FILE_STARTFLAG + value);
									} else{
										this.field.setValue('netdisk(' + rec.get('PHY_FILE_ID') + '):' + value);
									}
									win.close();
								}
							} else{
								Ext.msg('warn' , '无法获取选择的内容，请返回列表页面重试。');
								if(win){
									win.close();
								}
							}
						}
					}, {
						text : '关闭',
						handler : function() {
							var win;
							if(win = this.findParentByType(Ext.Window)){
								win.close();
							}
						}
					}]
			});
		}
	}				    
}