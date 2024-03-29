
Ext.namespace('lib.SelectMenu');

lib.SelectMenu.SelectMenu=function(config){
	lib.SelectMenu.SelectMenu.superclass.constructor.call(this, config);
	this.root=new Ext.tree.AsyncTreeNode( {
		text : '选择菜单'.loc(),
		draggable : false,
		expanded : true,
		level:1,
		id :config.system_id,
		allowSelect:false,
		icon : "/themes/icon/xp/selectmenu.gif"
	});
	this.loader=new Ext.tree.TreeLoader( {
		dataUrl:this.dataUrl,
		requestMethod : "GET",
		baseParams:this.baseParams || {},
		listeners :{
			"beforeload":function(treeLoader, node) {
					treeLoader.baseParams.level = node.attributes.level;
					if(typeof(node.attributes.app_type)!=undefined)
						treeLoader.baseParams.app_type = node.attributes.app_type;
				}
		}
	});
} 
Ext.extend(lib.SelectMenu.SelectMenu,lib.ComboTree.ComboTree,{
	forceLeaf : true,
	width : 200,
	mode : 'remote',
	dataUrl : '/lib/SelectMenu/SelectMenu.jcp'
});
Ext.reg('selectmenu',lib.SelectMenu.SelectMenu);
