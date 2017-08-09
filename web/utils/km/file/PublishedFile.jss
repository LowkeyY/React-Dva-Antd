Ext.namespace('utils.km.file');
utils.km.file.PublishedFile = function(config) {

	this.events = {
		"publish" : true
	};
	Ext.Ajax.request({
				url : '/utils/km/file/PublishedFile.jcp',
				method : 'GET',
				scope : this,
				callback : function(options, success, response) {
					var rootJSON = Ext.decode(response.responseText);
					if (rootJSON.success == false) {
						this.close();
						Ext.msg("error", rootJSON.message);
						return;
					}
					this.tree = new Ext.tree.TreePanel({
								region : 'center',
								border : false,
								animate : true,
								autoScroll : true,
								root : new Ext.tree.AsyncTreeNode(rootJSON),
								containerScroll : true
							});
					this.tree.on('click', function(node) {
								if (node.attributes.allowSelect) {
									this.folderId = node.id;
								} else {
									this.folderId = null;
								}
							}, this);
					this.add(this.tree);
					this.doLayout();
				}
			});
	utils.km.file.PublishedFile.superclass.constructor.call(this, Ext.applyIf(
					config || {}, {
						title : '发布这个文件',
						autoHeight : true,
						border : true,

						buttons : [{
									text : '取消'.loc(),
									handler : this.close,
									scope : this
								}, {
									text : '确定',
									handler : this.publish,
									scope : this
								}]
					}));

};

Ext.extend(utils.km.file.PublishedFile, Ext.Window, {
	height : 400,
	width : 300,
	minimizable : false,
	closeAction : 'hide',
	publish : function() {
		if (this.folderId == null) {
			Ext.msg("error", "请选择档案室");
			return;
		}
		RemoteMethods.PublishFile(this.fileId, this.folderId, new Date(),
				false, function(result) {
					if (result.CurrentStatus == utils.km.file.StatusCode.Success) {
						this.fireEvent("publish", this, this.fileId);
						this.close();
						Ext.msg("info", "发布成功");
					} else {
						Ext.msg("error", "发布失败,原因:" + this, result.Description);
						this.fireEvent("error", this, result.Description);
					}
				}, this);
		this.close();
	}

});
