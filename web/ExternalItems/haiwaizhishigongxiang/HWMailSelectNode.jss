Ext.ns("ExternalItems.haiwaizhishigongxiang");
using("lib.ComboTree.ComboTree");

ExternalItems.haiwaizhishigongxiang.HWMailSelectNode = function(mySelfConfig, json, param, parentPanel) {

	mySelfConfig.resetNodeField = function() {
		var field;
		if ((field = this.form.findField('SELECT_NODE'))) {
			if(field.getValue())
				field.setValue();
			var of , sf;
			if ((of = this.form.findField('TARGET_POSITION')) && (sf = this.form.findField('SELECT_SPACE')) && field.view) {
				var value = of.getValue() == 0 ? "-1" : sf.getValue();
				field.view.root.eachChild(function(node) {
							if (node.attributes.relationId != value)
								node.getUI().hide();
							else
								node.getUI().show();
						});
				field.restrictHeight();
			}
		}

	}

	var packingChild = function(c){
		var isNode = (c.name == 'SELECT_NODE');
		c.loader = new Ext.tree.TreeLoader({
					url : '/ExternalItems/haiwaizhishigongxiang/HWMailSelectNode.jcp',
					method : 'Post',
					baseParams : {
						types : c.name,
						olddataId : param.olddataId ||  param.oldexportData
					}
				});
		var rootNode = new Ext.tree.AsyncTreeNode(Ext.apply({
					text : 'root',
					id : 'root'
				}, !isNode ? {} : {
					listeners : {
						'expand' : function(node) {
							var p;
							if (p = Ext.getCmp(node.ownerTree.panelId))
								p.resetNodeField();
						}
					}
				}))
		Ext.apply(c, {
				editable : false,
				mode : 'local',
				treeConfig : {
					rootVisible : false,
					panelId : mySelfConfig.id
				},
				root : rootNode
		});
	}
	var fn = function(c) {
		if (c.items) {
			Ext.each(c.items, fn);
		} else {
			if(c.name == 'SELECT_SPACE'){
				c.oldType = c.xtype;
				c.xtype = "combotree";
				packingChild(c);
				c.listeners = {
					'change' : function(combo , newValue, oldValue){
						var frm ;
						if(frm = combo.findParentByType("form"))
							frm.resetNodeField();
					}
				}
			}
			if (c.name == 'SELECT_NODE'){
				c.beforeRelation = true;
				c.oldType = c.xtype;
				c.xtype = "combotree";
				packingChild(c);
				c.listeners = {
					'select' : function(combo , node, e) {
						var path = "" , frm , field;
						do{
							path = node.id + (path.length > 0 ? "/" : "") + path;
							node = node.parentNode;
						}while(node && !node.isRoot);
						if((frm = combo.findParentByType("form")) && (field = frm.form.findField("NEW_FILE_PATH")))
							field.setValue(path);
					}
				};
			}
			if (c.name == 'TARGET_POSITION') {
				c.listeners = {
					'select' : function(combo , record, index){
						var frm;
						if(frm = combo.findParentByType("form"))
							frm.setSpaceFieldVisible(record.get("value") == "1");
					},
					'change' : function(combo){
						var frm;
						if(frm = combo.findParentByType("form"))
							frm.resetNodeField();
					}
				}
			}
			if(c.name == 'NEW_FILE_PATH')
				c.hidden = true;
		}
	}
	Ext.each(json.model, fn);
}
