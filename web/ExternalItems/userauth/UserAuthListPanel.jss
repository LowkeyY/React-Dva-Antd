ExternalItems.userauth.UserAuthListPanel = function(userAuth) {
	
	this.listButton = [];
	this.onButtonClick = function(item) {
		if (item.btnId == 'save') {
			var values = [];
			Ext.each(this.ds.getModifiedRecords() , function(rec){
				var value = [];
				for(var att in rec.data){
					if(rec.data[att] === true)
						value.push(att)
				}
				values.push({"userId":rec.get("index") , "value" : value.length ? value.join(",") : ""});
			},this);
			Ext.Ajax.request({
				url : '/ExternalItems/userauth/putMenuAuth.jcp',
				params :{'data' : Ext.encode(values)},
				method : 'post',
				scope : this,
				success : function(response, options) {
					var result = Ext.decode(response.responseText);
					if(result.success){
						Ext.msg("info" , "保存成功！");
						//this.clearModified();
						this.ds.reload();
					}else{
						Ext.msg("warn" , "保存过程中出现错误。");
					}
				}
			});
		} else if(item.btnId == 'reset'){
			var ds = this.ds;
			Ext.msg("confirm", "还原将清除此次修改，<br> 确认还原?",function(answer){
				if (answer == 'yes') {
					//comp.clearModified();
					ds.reload();
				}
			});
		}
	}
	this.listButton.push(new Ext.Toolbar.Button({
				btnId : 'save',
				text : '保存'.loc(),
				icon : '/themes/icon/common/save.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	this.listButton.push(new Ext.Toolbar.Separator());
	this.listButton.push(new Ext.Toolbar.Button({
				btnId : 'reset',
				text : '还原'.loc(),
				icon : '/themes/icon/common/redo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				hidden : false,
				handler : this.onButtonClick
			}));
	
	var menuModel = [new Ext.grid.RowNumberer(), {
				header : '姓名'.loc(),
				dataIndex : 'real_name',
				sortable : true,
				align : 'left'
			}, {
				header : '部门'.loc(),
				dataIndex : 'dept_name',
				sortable : true,
				align : 'left'
			}];
	var menuPlugins = [];
	var dsItem = [{
				name : 'index',
				mapping : 'index'
			}, {
				name : 'user_name',
				mapping : 'user_name'
			}, {
				name : 'real_name',
				mapping : 'real_name'
			}, {
				name : 'dept_name'
			}];
	Ext.each(userAuth.menuDatas , function(data){
		dsItem.push({name : data.id});
		var ckc = new Ext.grid.CheckColumn({
			header : data.text,
			dataIndex : data.id,
			sortable : false
		});
		menuModel.push(ckc);
		menuPlugins.push(ckc);
	});
			
	this.ds = new Ext.data.Store({
				autoLoad : true,
				proxy : new Ext.data.HttpProxy({
							url : "/ExternalItems/userauth/usermenulist.jcp",
							method : 'GET'
						}),
				reader : new Ext.data.JsonReader({
							root : 'dataItem',
							totalProperty : 'totalCount',
							id : 'index'
						}, dsItem),
				remoteSort : true,
				listeners : {
					"load" : function(){
						this.clearModified(this.getModifiedRecords());
					}
				}
			});

	this.ds.setDefaultSort('index', 'asc');

	this.cm = new Ext.grid.ColumnModel(menuModel);

	this.cm.defaultSortable = true;
	this.UserMenuListGrid = new Ext.grid.EditorGridPanel({
				border : false,
				store : this.ds,
				cm : this.cm,
				loadMask : {
					msg : '数据载入中...'.loc()
				},
				plugins : menuPlugins,
				clicksToEdit : 1,
				bbar : new Ext.PagingToolbar({
							pageSize : 1000,
							store : this.ds,
							displayInfo : true,
							displayMsg : '{0}-{1}条 共:{2}条'.loc(),
							emptyMsg : '没有数据'.loc()
						}),
				tbar : this.listButton
			});
	this.MainTabPanel = new Ext.Panel({
				id : 'UserAuthListPanel',
				border : false,
				cached : true,
				layout : 'fit',
				defaults : {
					autoScroll : true
				},
				items : [this.UserMenuListGrid]
			});

};
ExternalItems.userauth.UserAuthListPanel.prototype = {
	clearModified : function(){
		if(this.ds)
			this.ds.clearModified(this.ds.getModifiedRecords());	
	},
	showList : function(params) {
		this.ds.baseParams = params;
		//this.clearModified();
		this.ds.load({
					params : {
						start : 0,
						limit : 40
					}
				});
	}
};
Ext.grid.CheckColumn = function(config) {
	Ext.apply(this, config);
	if (!this.id) {
		this.id = Ext.id();
	}
	this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
	init : function(grid) {
		this.grid = grid;
		this.grid.on('render', function() {
					var view = this.grid.getView();
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	onMouseDown : function(e, t) {
		if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
			e.stopEvent();
			var index = this.grid.getView().findRowIndex(t);
			var record = this.grid.store.getAt(index);
			record.set(this.dataIndex, !record.data[this.dataIndex]);
		}
	},

	renderer : function(v, p, record) {
		p.css += ' x-grid3-check-col-td';
		return '<div class="x-grid3-check-col' + (v ? '-on' : '')
				+ ' x-grid3-cc-' + this.id + '">&#160;</div>';
	}
};