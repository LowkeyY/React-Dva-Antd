
Ext.namespace("dev.report.base");
dev.report.base.Node =  function() {
	var that = this;
	this.spawn = function(cb, type, meta, ext) {
		
		switch (type) {
			case "workbook" :
			case "template" :
				using("dev.report.base.Book");
				dev.report.base.book=new dev.report.base.Book();
				dev.report.base.book.spawn(cb, ext.uid, ext.name, meta);
				break;
			case "frameset" :
			case "rframeset" :
				using("dev.report.base.Frameset");
				dev.report.base.frameset=new dev.report.base.Frameset();
				dev.report.base.frameset.spawn(cb, ext.name, meta, ext.cols,ext.rows, ext.frames);
				break
		}
	};

	this.load = function(cb, type, node, group, hierarchy, extra, pc) {
		switch (type) {
			case "workbook" :
			case "template" :
				dev.report.base.book.load(cb, node, group, hierarchy, extra, pc);
				break;
			case "frameset" :
			case "rframeset" :
				dev.report.base.frameset.load(cb, node, group, hierarchy, extra, pc);
				break
		}
	};
	this.unload = function(cb, node) {
		if (node instanceof dev.report.base.grid.Book) {
			dev.report.base.book.unload(cb, node.uid)
		} else {
			if (node instanceof dev.report.base.wnd.Frameset) {
				dev.report.base.frameset.unload(cb, node)
			}
		}
	};
	this.save = function(cb, node, showMsg) {
		var Report=dev.report.base.app.frames.get('Report');
		if(Report.reportPanel.state=='create'){
			using("dev.folder.FolderWindow");
			if(dev.report.base.app.params['parent_id']){
				var folderWindow =dev.report.base.app.frames.createPanel(new dev.folder.FolderWindow(1,'report',dev.report.base.app.params['parent_id'],300,dev.report.base.app.frames,true)); 
				folderWindow.show();
			}else{
				var folderWindow =dev.report.base.app.frames.createPanel(new dev.folder.FolderWindow(1,'report','',300,dev.report.base.app.frames,true)); 
				folderWindow.show();
			}
		}else{
			dev.report.base.app.gridBlurObserver.notify(this);
			var xmlString=dev.report.model.report.toXML();
			if (Ext.isIE) {
				 xmlString=Tool.parseXML(xmlString).xml
			}else{
				xmlString=(new XMLSerializer()).serializeToString(Tool.parseXML(xmlString));
			}
			var msg = Tool.postXML("/dev/report/ReportEvent.jcp?event=updatesave&report_id="+dev.report.base.app.params['report_id']+"&parent_id="+dev.report.base.app.params['parent_id'],xmlString);
			if(msg.firstChild.firstChild.nodeValue=='true'){
				Ext.msg("info",'完成报表更新!');
			}else{
				Ext.msg("error",'查询保存失败,原因:<br>'+msg.lastChild.firstChild.nodeValue);
			}
		}
	};
	this.recover = function(cb, win, args) {
		if (cb) {
			dev.report.base.frameset.recover(cb, win)
		} else {
			dev.report.base.book.recover(win, args)
		}
	};
	this.chkSaved = function(cb, node) {
		if (node instanceof dev.report.base.grid.Book) {
			dev.report.base.book.chkSaved(cb, node)
		} else {
			if (node instanceof dev.report.base.wnd.Frameset) {
				dev.report.base.frameset.chkSaved(cb, node)
			}
		}
	};
	this.getPerm = function(node) {
		if (node instanceof dev.report.base.grid.Book) {
			return dev.report.base.book.getPerm(node)
		} else {
			if (node instanceof dev.report.base.wnd.Frameset) {
				return dev.report.base.frameset.getPerm(node)
			}
		}
	}
};