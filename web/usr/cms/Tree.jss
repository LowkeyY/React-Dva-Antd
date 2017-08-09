Ext.ns("usr.cms");

usr.cms.Tree = function() {

}

usr.cms.Tree.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		
		var root = new Ext.tree.AsyncTreeNode({
					id : "root",
					text : "网站导航",
					icon: "/themes/icon/all/attach.gif"
				});
			
		var loader=new Ext.tree.TreeLoader({
					dataUrl : '/usr/cms/Tree.jcp'
				});

		var buttonArray = [];
		if(prgInfo.buttonArray && prgInfo.buttonArray.length>0){
			buttonArray.push("->");
			Ext.each(prgInfo.buttonArray,function(btn){
				buttonArray.push(btn);
			});
		}
				
		var tree = new Ext.tree.TreePanel({
			title : '网站导航面板',
			width : '500',
			height : '700',
			root : root,
			loader : loader,
			bodyStyle : "overflow:auto",
			bbar : buttonArray.length>0?buttonArray:null
			});
		parentPanel.add(tree);
		parentPanel.doLayout();
	}

}