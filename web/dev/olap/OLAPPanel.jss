Ext.namespace("dev.olap");

dev.olap.OLAPPanel = function(parentPanel){
	
	this.frames=parentPanel;
	var styleSheet;
	var OLAP=this.frames.get('OLAP');//alert(Ext.getCmp("OLAPMain").getEl().getHeight());

	var ButtonArray=[];
	this.params={};
	
//------------------查询资源窗口构建，完成查询导入------------------------------------------
	this.tXML;
	var instance = this;
	this.tree = new Ext.tree.TreePanel({
		region:'center',
		autoScroll:true,
		layout:'fit'
		//height:500
	});
	this.root = new Ext.tree.TreeNode({
		text: 'Schema', 
		//draggable:false, 
		//id:sc.getObjName()+sc.getName(),
		id:'Schema New Schema 1',
		icon:"/themes/icon/all/chart_organisation.gif",
		params:new Schema(),
		qtip:"Schema"
	});
	this.tree.setRootNode(this.root);
	this.obj;
	this.node;
	this.tree.on('click',function(node,e){
		//var node = instance.tree.getSelectionModel().getSelectedNode();
		instance.node=node;
		instance.obj = node.attributes.params;
		var pval=1;
		instance.olapGrid.loadSource(pval,instance.obj,instance.tree);
		instance.setButtonState(instance.OLAPButtonArray,instance.obj);
	});
	this.tree.on("contextmenu",function(node,e){
		instance.node=node;
		instance.node.select();
		instance.obj = node.attributes.params;
		var pval=1;
		instance.olapGrid.loadSource(pval,instance.obj,instance.tree);
		instance.setButtonState(instance.OLAPButtonArray,instance.obj);
		instance.addTreeMenu(instance.obj,node);
	});
	this.TabNav = new Ext.Panel({
		title: '资源窗口',
		region: 'west',
		autoScroll: true,
		width: 250,
		//height:500,
		layout:'fit',
		minSize: 220,
        border:true,
		collapsible: false,
	    split: true,
	    items:this.tree
	});
//------------------OLAP操作区构建 按钮----------------------------------------------------------------
	   this.OLAPButtonArray=[];

	   this.OLAPButtonArray.push(new Ext.Toolbar.Button({
			btnId:'addCube',
			icon: '/themes/icon/database/database_add.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加立方体</b>',
			handler: function(){
						this.addObj("Cube");
			}
		}));
	   //this.OLAPButtonArray.push(new Ext.Toolbar.Separator());
	   this.OLAPButtonArray.push(new Ext.Toolbar.Button({
			btnId:'addDimension',
			icon: '/themes/icon/database/new_connection.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加维度</b>',
			handler: function(){
					this.addObj("Dimension");
			}
		}));

	   this.OLAPButtonArray.push(this.bold=new Ext.Toolbar.Button({
			btnId:'addDimensionUsage',
			icon: '/themes/icon/database/new_driver.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加维度引用</b>',
			handler: function(){
					this.addObj("DimensionUsage");
			}
		}));
	   this.OLAPButtonArray.push(this.italic=new Ext.Toolbar.Button({
			btnId:'addHierarchy',
			icon: '/themes/icon/database/showparents_mode.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加层次</b>',
			handler: function(){
					this.addObj("Hierarchy");
			}
		}));
	   this.OLAPButtonArray.push(this.under=new Ext.Toolbar.Button({
			btnId:'addNamedSet',
			text:'NS+',
			scope: this,
			tooltip: '<b>添加命名集</b>',
			handler: function(){
					this.addObj("NamedSet");
			}
		}));

	   this.OLAPButtonArray.push(this.strike=new Ext.Toolbar.Button({
			btnId:'addUserDefinedFunction',
			scope: this,
			text:'UDF+',
			tooltip: '<b>添加用户定义函数</b>',
			handler: function(){
					this.addObj("UserDefinedFunction");
			}
		}));
	
	this.OLAPButtonArray.push(new Ext.Toolbar.Button({
		btnId:'addCalculatedMember',
		text:'CM+',
		scope: this,
		tooltip: '<b>添加计算成员</b>',
		handler: function(){
			this.addObj("CalculatedMember");
		}
	}));
	
	this.OLAPButtonArray.push(new Ext.Toolbar.Button({
		btnId:'addMeasure',
		icon: '/themes/icon/database/clear.gif',
		cls: 'x-btn-icon',
		scope: this,
		tooltip: '<b>添加度量值</b>',
		handler: function(){
			this.addObj("Measure");
		}
	}));
	
	this.OLAPButtonArray.push(new Ext.Toolbar.Button({
		btnId:'addLevel',
		icon: '/themes/icon/database/outline.gif',
		cls: 'x-btn-icon',
		scope: this,
		tooltip: '<b>添加级别</b>',
		handler: function(){
			this.addObj("Level");	
		}
	}));

   this.OLAPButtonArray.push(this.coalition=new Ext.Toolbar.Button({
		btnId:'addProperty',
		icon: '/themes/icon/database/configs.gif',
		cls: 'x-btn-icon',
		scope: this,
		tooltip: '<b>添加属性</b>',
		handler: function(){
			this.addObj("Property");	
		}
	}));

	//this.OLAPButtonArray.push(new Ext.Toolbar.Separator());
	this.OLAPButtonArray.push(new Ext.Toolbar.Button({
		btnId:'addCalculatedMemberProperty',
		icon: '/themes/icon/database/app_obj.gif',
		cls: 'x-btn-icon',
		scope: this,
		tooltip: '<b>添加计算成员属性</b>',
		handler: function(){
			this.addObj("CalculatedMemberProperty");	
		}
	}));
	/*this.OLAPButtonArray.push(new Ext.Toolbar.Button({
			btnId:'addParameter',
			icon: '/themes/icon/database/database_table.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加参数</b>',
			handler: function(){
				this.addObj("Parameter");
			}
		}));*/
		
	this.OLAPButtonArray.push(new Ext.Toolbar.Separator());
	this.OLAPButtonArray.push(new Ext.Toolbar.Button({
			btnId:'addVirtualCube',
			icon: '/themes/icon/database/database_add.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加虚拟立方体</b>',
			handler: function(){
					this.addObj("VirtualCube");
			}
		}));
	   //this.OLAPButtonArray.push(new Ext.Toolbar.Separator());
	   this.OLAPButtonArray.push(new Ext.Toolbar.Button({
			btnId:'addVirtualCubeDimension',
			icon: '/themes/icon/database/new_connection.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加虚拟立方体维度</b>',
			handler: function(){
					this.addObj("VirtualCubeDimension");
			}
		}));
		this.OLAPButtonArray.push(new Ext.Toolbar.Button({
			btnId:'addVirtualCubeMeasure',
			icon: '/themes/icon/database/clear.gif',
			cls: 'x-btn-icon',
			scope: this,
			tooltip: '<b>添加虚拟立方体度量值</b>',
			handler: function(){
				this.addObj("VirtualCubeMeasure");
			}
		}));		
		

	this.olapGrid=new dev.olap.OLAPGrid({
			layout: 'fit',
			params : this.params
	});

	this.olapSpace= new Ext.Panel({
		region: 'center',
		layout: 'fit',
		autoScroll: false,
		collapsible:false,
		closable:false, 
        border:false,
		items:this.olapGrid	
	});
	this.olapMain = new Ext.Panel({		
        closable:false, 
		frame:false,
        layout: 'border',
		region: 'center',
        border:false,
        bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;',
		tbar:this.OLAPButtonArray,
        items: [this.TabNav,this.olapSpace]
	});

//------------------OlAP操作区构建 按钮----------------------------------------------------------------


	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'new',
				text: '新建',
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'open',
				text: '打开',
				icon: '/themes/icon/xp/reload.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存',
				icon: '/themes/icon/common/saves.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除',
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :function(){
					instance.deleteObj();
				}
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'preview',
				text: '预览',
				icon: '/themes/icon/xp/preview.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

	this.olapForm = new Ext.FormPanel({		
        closable:false, 
        layout: 'border',
		region: 'center',
        border:false,
        bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;',
		tbar:ButtonArray,
        items: this.olapMain
	});

//底部状态栏

	this.MainTabPanel=new Ext.Panel({
			id: 'OLAPMainTab',
			border:false,
			method : 'POST',
			layout:'fit',
			activeTab:0,
			tabPosition:'bottom',
			items:[this.olapForm]
	});
	
	this.MainTabPanel.on('destroy',function(){
		var OLAP=this.frames.get('OLAP');
		if(OLAP.saveOLAP){
			 OLAP.saveOLAP.win.hidden=false;
			 OLAP.saveOLAP.win.close();
		}
	},this);
};

dev.olap.OLAPPanel.prototype={
	setButtonState : function(arrBtn,obj){
		var instance = this;
		var buttons=arrBtn;
		for(var i=0;i<buttons.length;i++){
			buttons[i].show();
		}
		var isCanAddResult = obj.isCanAdd('');
		if(obj.isHaveItems()){
			var childObjNames = isCanAddResult[1];
			for(var i=0;i<buttons.length;i++){
				buttons[i].hide();
				if(typeof(buttons[i].btnId)=="undefined"){
					buttons[i].show();
				}else{
					var btnID = buttons[i].btnId.toString().substring(3,buttons[i].btnId.toString().length);//alert(buttons[i].btnId+"---"+buttons[i].getId());
					for(var t=0;t<childObjNames.length;t++){
						if(btnID==childObjNames[t].toString()){
							buttons[i].show();
						}
					}
				}	
			}
		}else{
			for(var i=0;i<buttons.length;i++){
				if(typeof(buttons[i].btnId)=="undefined"){
					buttons[i].show();
				}else{
					buttons[i].hide();
				}
				
			}
		}
	},
	deleteObj : function(){
		var instance = this;
		if(typeof(instance.node)!="undefined"){
			if(instance.node.parentNode != null){
				var obj = instance.node.attributes.params;
				var parentObj = instance.node.parentNode.attributes.params;
				var parentObjItems = parentObj.getObjItems();
				for(var i=0;i<parentObjItems.length;i++){
					if(obj.getName() == parentObjItems[i].getName() && obj.getObjName()==parentObjItems[i].getObjName()){
						parentObjItems.remove(parentObjItems[i]);
						instance.node.parentNode.removeChild(instance.node);
						instance.obj=parentObj;
						instance.olapGrid.loadSource("1",instance.obj,instance.tree);
					}
				}
			}else{
				//alert("不能删除根节点");
				Ext.msg("warn",'不能删除根节点');
			}
		}else{
			//alert("请选择一个节点");
			Ext.msg("warn",'请选择一个节点');
		}
	},
	addObj : function(objname){	
		var instance = this;	
		if(typeof(instance.obj) != "undefined"&&instance.obj!=null&&instance.node!=null&&typeof(instance.node)!="undefined"){
			var arrIds =this.getNodeID();
			var pID="";
			for(var h=0;h<arrIds.length;h++){
				pID+=arrIds[h].toString();
			}	
			var isCanAddResult = instance.obj.isCanAdd(objname);
			if(isCanAddResult[0]){
				var childObj = instance.getNewObj(objname);
				var name = "New "+objname+" "+instance.obj.getObjItems().length;
				childObj.setName(instance.getNewObjName(objname,name));
				instance.obj.addObjItems(childObj);
				//instance.addNode(instance.obj.getObjName()+instance.obj.getName(),childObj,instance.tree);
				instance.addNode(pID,childObj,instance.tree);
			}else{
				Ext.msg("warn",'该节点不能添加'+objname);
			}							
		}else{
			Ext.msg("warn",'请选择一个节点！');
		}
	},
	getNewObjName : function(objname,name){
		var name = name;
		var objname = objname;
		var instance = this;
		var parentObjItems = instance.node.attributes.params.getObjItems();
		for(var i=0;i<parentObjItems.length;i++){
			if(name==parentObjItems[i].getName()){
				name = "New "+objname+" "+instance.obj.getObjItems().length+1;
				this.getNewObjName(objname,name)
			}
		}
		return name;
	},
	getNodeID : function(pID,node){
		var instance = this;
		var node = node;
		var pp = [];
		if(typeof(pID)!="undefined"){
			pp = pID;
		}	
		if(typeof(node)=="undefined"){
			node = instance.tree.getSelectionModel().getSelectedNode();
			pp.push(node.attributes.params.getObjName()+node.attributes.params.getName());
		}
		if(node.attributes.params.getObjName()!="Schema"){
			node = node.parentNode;
			pp.push(node.attributes.params.getObjName()+node.attributes.params.getName());
			instance.getNodeID(pp,node);
		}
		return pp;
	},
	setNodeID : function(){},
	getNewObj : function(objname){
		switch(objname){
			case "Schema" :
				return new Schema();
				break;
			case "Cube" :
				return new Cube();
				break;
			case "Dimension" :
				return new Dimension();
				break;
			case "SQL" :
				return new SQL();
				break;
			case "VirtualCube" :
				return new VirtualCube();
				break;
			case "CubeUsages" :
				return new CubeUsages();
				break;
			case "CubeUsage" :
				return new CubeUsage();
				break;
			case "VirtualCubeDimension" :
				return new VirtualCubeDimension();
				break;
			case "VirtualCubeMeasure" :
				return new VirtualCubeMeasure();
				break;
			case "DimensionUsage" :
				return new DimensionUsage();
				break;
			case "Hierarchy" :
				return new Hierarchy();
				break;
			case "Level" :
				return new Level();
				break;
			case "Closure" :
				return new Closure();
				break;
			case "Property" :
				return new Property();
				break;
			case "Measure" :
				return new Measure();
				break;
			case "CalculatedMember" :
				return new CalculatedMember();
				break;
			case "CalculatedMemberProperty" :
				return new CalculatedMemberProperty();
				break;
			case "NamedSet" :
				return new NamedSet();
				break;
			case "Formula" :
				return new Formula();
				break;
			case "MemberReaderParameter" :
				return new MemberReaderParameter();
				break;
			case "View" :
				return new View();
				break;
			case "Join" :
				return new Join();
				break;
			case "Table" :
				return new Table();
				break;
			case "Hint" :
				return new Hint();
				break;
			case "InlineTable" :
				return new InlineTable();
				break;
			case "ColumnDefs" :
				return new ColumnDefs();
				break;
			case "ColumnDef" :
				return new ColumnDef();
				break;
			case "Rows" :
				return new Rows();
				break;
			case "Row" :
				return new Row();
				break;
			case "Value" :
				return new Value();
				break;
			case "AggTable" :
				return new AggTable();
				break;
			case "AggName" :
				return new AggName();
				break;
			case "AggPattern" :
				return new AggPattern();
				break;
			case "AggExclude" :
				return new AggExclude();
				break;
			case "AggColumnName" :
				return new AggColumnName();
				break;
			case "AggFactCount" :
				return new AggFactCount();
				break;
			case "AggIgnoreColumn" :
				return new AggIgnoreColumn();
				break;
			case "AggForeignKey" :
				return new AggForeignKey();
				break;
			case "AggLevel" :
				return new AggLevel();
				break;
			case "AggMeasure" :
				return new AggMeasure();
				break;
			case "KeyExpression" :
				return new KeyExpression();
				break;
			case "ParentExpression" :
				return new ParentExpression();
				break;
			case "OrdinalExpression" :
				return new OrdinalExpression();
				break;
			case "NameExpression" :
				return new NameExpression();
				break;
			case "MeasureExpression" :
				return new MeasureExpression();
				break;
			case "UserDefinedFunction" :
				return new UserDefinedFunction();
				break;
			case "Annotation" :
				return new Annotation();
				break;
			case "Annotations" :
				return new Annotations();
				break;
			case "Parameter" :
				return new Parameter();
				break;
		}
	},
	addNode : function(parentID,obj,tree){
		var obj=obj;
		var tree=tree;
		var parentID = parentID;
		var tipValue = obj.getObjCnName();//alert("node_id=="+tree.getSelectionModel().getSelectedNode().id);
		var node  ;
		if(!tree.getSelectionModel().getSelectedNode()){
			node = tree.getNodeById(parentID);//alert(obj.getObjName());alert(parentID);
		}else{
			node = tree.getSelectionModel().getSelectedNode();
		}
		//var node = tree.getNodeById(parentID);
		//var id = obj.getObjName()+obj.getName();
		var id = obj.getObjName()+obj.getName()+parentID;
		var text = obj.getName();
		var icon = obj.getObjIcon();
		var cnode = new Ext.tree.TreeNode({
					id:id,
					text:text,
					icon:icon,
					params:obj,
					qtip:tipValue
		});
		//this.addTreeMenu(obj,cnode);
		node.appendChild(cnode);
		if(!node.isExpanded()){
			node.expand();
		}
	},
	addTreeMenu : function(obj,node){
		var childObj=[];
		if(obj.isHaveItems()){
			childObj= obj.getObjItems();
		}
		var parentObj; 
		var objName = obj.getObjName();
		var node = node;
		var instance = this;
		var isCanAddResult = instance.obj.isCanAdd(objName);	
		var childObjName=isCanAddResult[1];
		var items=[];
		var disabled=false;//alert(objName);
		if(objName == "Table"){
			if(node.parentNode != null){
				parentObj = node.parentNode.attributes.params;
				if(parentObj.getObjName()!="Cube"){
					childObjName=[];
				}
			}
		}
		if(objName == "Closure"&&childObj.length>0){
			childObjName=[];
		}
		for (var i=0;i<childObjName.length;i++){
			disabled=false;
			if(objName=="Cube"||objName=="Hierarchy"){
				if(childObjName[i]=="Table"||childObjName[i]=="View"||childObjName[i]=="InlineTable"||childObjName[i]=="Join"){
					for(var t=0;t<childObj.length;t++){
						if(childObj[t].getObjName()=="Table"||childObj[t].getObjName()=="View"||childObj[t].getObjName()=="InlineTable"||childObj[t].getObjName()=="Join"){
							disabled=true;
							break;
						}
					}
				}else{
					disabled=false;
				}
			}
			if(objName=="Level"||objName=="Measure"){			
				if(childObjName[i]=="KeyExpression"||childObjName[i]=="NameExpression"||childObjName[i]=="OrdinalExpression"||childObjName[i]=="MeasureExpression"||childObjName[i]=="ParentExpression"||childObjName[i]=="Closure"){
					for(var t=0;t<childObj.length;t++){
						if(childObj[t].getObjName()=="KeyExpression"&&childObjName[i]=="KeyExpression"){
							disabled=true;
							break;
						}else if(childObj[t].getObjName()=="OrdinalExpression"&&childObjName[i]=="OrdinalExpression"){
							disabled=true;
							break;
						}else if(childObj[t].getObjName()=="NameExpression"&&childObjName[i]=="NameExpression"){
							disabled=true;
							break;
						}else if(childObj[t].getObjName()=="ParentExpression"&&childObjName[i]=="ParentExpression"){
							disabled=true;
							break;
						}else if(childObj[t].getObjName()=="MeasureExpression"&&childObjName[i]=="MeasureExpression"){
							disabled=true;
							break;
						}else if(childObj[t].getObjName()=="Closure"&&childObjName[i]=="Closure"){
							disabled=true;
							break;
						}else{
							disabled=false;
						}
					}
				}			
			}
			if(childObjName[i]=="Annotations"){//alert(111);
				for(var t=0;t<childObj.length;t++){//alert(childObj[t].getObjName());
					if(childObj[t].getObjName()=="Annotations"){
						disabled=true;
						break;
					}else{
						disabled=false;
					}
				}
			}
			if(childObjName[i]=="Formula"){
				for(var t=0;t<childObj.length;t++){
					if(childObj[t].getObjName()=="Formula"){
						disabled=true;
						break;
					}else{
						disabled=false;
					}
				}
			}
			var cnName = instance.getNewObj(childObjName[i].toString()).getObjCnName();
			items.push({
				//text:'添加 '+childObjName[i].toString(),
				tmId:'add '+childObjName[i].toString(),
				text:'添加 '+cnName,
				disabled:disabled,
				handler:function(){
					instance.addObj(this.tmId.substring(4,this.tmId.length));
					instance.addTreeMenu(obj,node);
				}
			});
		}
		if(objName!="Schema"){
			items.push({
				text:'删除',
				handler:function(){
					var pNode;
					if(node.parentNode != null){
						parentObj = node.parentNode.attributes.params;
						pNode=node.parentNode;
					}
					instance.deleteObj();
					if(pNode != "undefined"){
						instance.addTreeMenu(parentObj,pNode);
					}
				}
			});
		}
		var rightClick = new Ext.menu.Menu({
			items:items
		});
	    node.on('contextmenu', function(node, event) {
                            event.preventDefault();
                            rightClick.showAt(event.getXY());
        });
	},
	init : function(){
		var instance = this;
		var tempXML;
		this.node=null;
		if(typeof(instance.tXML)=="undefined"||instance.tXML==null){
			tempXML=Tool.getXML("/dev/olap/OLAPEvent.jcp?event=open&olap_id=0");
		}else{
			tempXML=instance.tXML;
		}
		var sc = new Schema();
		sc.init(tempXML);
		instance.obj = sc;
		this.root = new Ext.tree.TreeNode({
			text: 'Schema', 
			//draggable:false, 
			id:sc.getObjName()+sc.getName(),
			//id:sc.getName(),
			icon:"/themes/icon/all/chart_organisation.gif",
			params:sc,
			qtip:sc.getObjCnName()
		});
		instance.tree.setRootNode(this.root);
		
		var arr = sc.getObjItems();
		var pID=sc.getObjName()+sc.getName();
		for(var r=0;r<arr.length;r++){//alert("1==="+arr[r].getObjName()+"==="+arr.length);
			//instance.addNode(sc.getObjName()+sc.getName(),arr[r],instance.tree);
			instance.addNode(pID,arr[r],instance.tree);
			var arr1=[];
			if(arr[r].isHaveItems()){
				arr1=arr[r].getObjItems();
			}
			if(arr1.length>0){
				var pID1=arr[r].getObjName()+arr[r].getName()+pID;
				for(var t=0;t<arr1.length;t++){//alert("2==="+arr1[t].getObjName()+"==="+arr1.length);
					instance.addNode(pID1,arr1[t],instance.tree);
					var arr2=[];
					if(arr1[t].isHaveItems()){
						arr2=arr1[t].getObjItems()
					}
					if(arr2.length>0){
						var pID2=arr1[t].getObjName()+arr1[t].getName()+pID1;
						for(var a=0;a<arr2.length;a++){//alert("3==="+arr2[a].getObjName()+"==="+arr2.length);
							instance.addNode(pID2,arr2[a],instance.tree);

							var arr3=[];
							if(arr2[a].isHaveItems()){
								arr3=arr2[a].getObjItems();
							}
							if(arr3.length>0){
								var pID3=arr2[a].getObjName()+arr2[a].getName()+pID2;
								for(var b=0;b<arr3.length;b++){//alert("4==="+arr3[b].getObjName()+"==="+arr3.length);
									instance.addNode(pID3,arr3[b],instance.tree);

									var arr4=[];
									if(arr3[b].isHaveItems()){
										arr4=arr3[b].getObjItems();
									}
									if(arr4.length>0){
										var pID4=arr3[b].getObjName()+arr3[b].getName()+pID3;
										for(var c=0;c<arr4.length;c++){//alert("5==="+arr4[c].getObjName()+"==="+arr4.length);
											instance.addNode(pID4,arr4[c],instance.tree);
											
											var arr5=[];
											if(arr4[c].isHaveItems()){
												arr5=arr4[c].getObjItems();
											}
											if(arr5.length>0){
												var pID5=arr4[c].getObjName()+arr4[c].getName()+pID4;
												for(var d=0;d<arr5.length;d++){//alert("6==="+arr5[d].getObjName()+arr5.length);
													instance.addNode(pID5,arr5[d],instance.tree);
													//pID=arr4[c].getObjName()+arr4[c].getName()+pID;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};
		
		//var pval=1;
		this.olapGrid.loadSource("",sc,this.tree);
		//this.olapGrid.state="new";
    },
	newOLAP: function(params){	
		Ext.apply(this.params, params);
		this.tXML=null;
		this.obj=null;
		this.olapForm.form.reset();
		if(this.MainTabPanel.rendered){
			this.frames.get("OLAP").mainPanel.setStatusValue(["",params.parent_id]);
		}
    },
	loadData : function(params){	
		this.tXML=params;
		this.init();
    },
	getSourceQuery : function(item){

    },
	onButtonClick : function(item){
		var instance = this;
		if(item.btnId=='new'){
			Ext.msg('confirm', '当前内容将被清空，是否继续？', function (answer){
					   if (answer == 'yes') {
							if(typeof(instance.tXML)!="undefined"){
								instance.tXML=null;
							}
							instance.init();
						 } 
					 }.createDelegate(this));		
		}else if(item.btnId=='open'){
			Ext.msg('confirm','当前内容将被清空，是否继续？',function(answer){
				if(answer == 'yes'){
					using("dev.olap.OlapWindow");
					if(instance.params['parent_id']){alert(instance.params['parent_id']);
						var folderWindow =instance.frames.createPanel(new dev.olap.OlapWindow(0,'olap',instance.params['parent_id'],'300',instance.frames)); 
						folderWindow.show();
					}else{alert(555);
						var folderWindow =instance.frames.createPanel(new dev.olap.OlapWindow(0,'olap','','300',instance.frames)); 
						folderWindow.show();
					}
				}		
			}.createDelegate(this));
		}else if(item.btnId=='distil'){
 
		}else if(item.btnId=='preview'){
			var node;
			var objSchema;
			if(instance.obj.getObjName()!="Schema"){
				node = instance.node.getOwnerTree().getRootNode();
				objSchema=node.attributes.params;			
			}else{
				objSchema=instance.obj;
			}
			alert(objSchema.toXML());
		}
    }
};
//OLAP 模型

//-----------------------------------SQL----------------------------------------------------

	SQL = function(){
		this.name='SQL';
		/** Allowable values for {@link #dialect}. */
		this.dialect_values = ["generic", "access", "db2", "derby", "firebird", "hsqldb", "mssql", "mysql", "oracle", "postgres", "sybase", "teradata", "ingres", "infobright", "luciddb", "vertica", "neoview"];
		this.dialect='generic';  // attribute default: generic
		this.cdata='';	// All text goes here
	}
	SQL.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
				break;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	SQL.prototype.getObjAttributes=function(obj){
		return {
				 "语言":obj.getDialect(),//dialect
				 "内容":obj.getCdata() //cdata
				};
	}
	SQL.prototype.isHaveItems=function(){
		return false;
	}
	SQL.prototype.getObjName=function(){
		return "SQL";
	}
	SQL.prototype.getObjCnName=function(){
		return "SQL";
	}
	SQL.prototype.getObjIcon=function(){
		return "/themes/icon/database/new_editor.gif";
	}
	
	SQL.prototype.setDialect=function(dialect){
		this.dialect=dialect;
	}
	SQL.prototype.getDialect=function(){
		return this.dialect;
	}
	SQL.prototype.setCdata=function(cdata){
		this.cdata=cdata;
	}
	SQL.prototype.getCdata=function(){
		return this.cdata;
	}
	SQL.prototype.setName=function(name){
		this.name=name;
	}
	SQL.prototype.getName=function(){
		return this.name;
	}
	SQL.prototype.toXML=function(){
		var str=[];
		str.push('\n\r  <SQL dialect="',this.dialect,'">');				
		str.push('\n\r <![CDA');
		str.push('TA[');
		str.push(this.cdata);
		str.push(']');
		str.push(']>');	
		str.push('\n\r </SQL>');
		return str.join('');
	}

	SQL.prototype.init=function(sqlElement){
		var dialect = sqlElement.attributes.getNamedIetm("dialect");
		if (dialect != null){
			this.setDialect(dialect.value);
		}else{
			this.setDialect("generic");
		}
		var	cdata =sqlElement.firstChild.data;
		if (cdata != null){
			this.setCdata(cdata.value);
		}
	}
	
//-----------------------------------CaptionExpression----------------------------------------------------
	
	CaptionExpression=function(){}

//-----------------------------------Column----------------------------------------------------
	
	Column=function(){}

//-----------------------------------Expression----------------------------------------------------
	
	Expression=function(){}
	
//-----------------------------------ExpressionView----------------------------------------------------
/**
 * A collection of SQL expressions, one per dialect.
 */
	
	ExpressionView=function(){}


	
//-----------------------------------RelationOrJoin----------------------------------------------------
/**
 * A table or a join
 * extend
 */	
	//RelationOrJoin=function(){}
	
//-----------------------------------Relation----------------------------------------------------
/**
 * A table, inline table or view
 * extend
 */	
	//Relation=function(){}
//-----------------------------------CubeDimension----------------------------------------------------
/**
 * A CubeDimension is either a usage of a Dimension ('shared
 * dimension', in MSOLAP parlance), or a 'private dimension'.
 */
	//CubeDimension = function(){}


//-----------------------------------Schema----------------------------------------------------
/**
 * A schema is a collection of cubes and virtual cubes.
 * It can also contain shared dimensions (for use by those
 * cubes), named sets, roles, and declarations of
 * user-defined functions.
 */
	Schema = function(){
		this.schemaItems=[];
		this.name='';
		this.measuresCaption = '';
		this.description = '';
		this.defaultRole='';
	}
	Schema.prototype.isCanAdd=function(objname){
		var objnames = ["Cube","Dimension","NamedSet","UserDefinedFunction","VirtualCube","Parameter","Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Schema.prototype.getObjAttributes=function(obj){
		return {
				 "名称":obj.getName(),//name
				 "描述":obj.getDescription(),//description
				 "度量值标题":obj.getMeasuresCaption(),//measuresCaption			 
				 "默认角色":obj.getDefaultRole()//defaultRole
				};
	}
	Schema.prototype.isHaveItems=function(){
		return true;
	}
	Schema.prototype.getObjName=function(){
		return "Schema";
	}
	Schema.prototype.getObjCnName=function(){
		return "方案";
	}
	Schema.prototype.getObjIcon=function(){
		return "";
	}
	
	Schema.prototype.addObjItems=function(schemaItems){
		this.schemaItems.push(schemaItems);
	}
	Schema.prototype.getObjItems=function(){
		return this.schemaItems;
	}
	Schema.prototype.setName=function(name){	
		this.name=name;
	}
	Schema.prototype.getName=function(){
		return this.name;
	}
	Schema.prototype.setMeasuresCaption=function(measuresCaption){	
		this.measuresCaption=measuresCaption;
	}
	Schema.prototype.getMeasuresCaption=function(){
		return this.measuresCaption;
	}
	Schema.prototype.setDescription=function(description){	
		this.description=description;
	}
	Schema.prototype.getDescription=function(){
		return this.description;
	}
	Schema.prototype.setDefaultRole=function(defaultRole){	
		this.defaultRole=defaultRole;
	}
	Schema.prototype.getDefaultRole=function(){
		return this.defaultRole;
	}
	
	Schema.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Schema');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.measuresCaption!=null){
			str.push('" measuresCaption="',this.measuresCaption);
		}
		if(this.defaultRole!=null){
			str.push('" defaultRole="',this.defaultRole);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		str.push('">');
		var _schemaItems = this.schemaItems;
		if (_schemaItems&&_schemaItems.length>0) {           
			for(var i=0;i<_schemaItems.length;i++){
				 str.push(_schemaItems[i].toXML());
			}			
        }
		str.push('\n\r </Schema>');
		return str.join('');
	}

	Schema.prototype.init=function(schemaElement){
		var name = schemaElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Schema');
		}
		var measuresCaption = schemaElement.attributes.getNamedItem("measuresCaption");
		if (measuresCaption != null){
			this.setMeasuresCaption(measuresCaption.value);
		}
		var defaultRole = schemaElement.attributes.getNamedItem("defaultRole");
		if (defaultRole != null){
			this.setDefaultRole(defaultRole.value);
		}
		var description = schemaElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var allElement=schemaElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			
			/**
		 	* Contains values of user-defined properties.
		 	*/
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			  * This schema's parameter definitions.
			  */
			  if(itemElement.nodeName=='Parameter'){				
					var fa=new Parameter();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Shared dimensions in this schema.
			 */
			  if(itemElement.nodeName=='Dimension'){				
					var fa=new Dimension();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Cubes in this schema.
			 */
			  if(itemElement.nodeName=='Cube'){				
					var fa=new Cube();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Virtual cubes in this schema.
			 */
			  if(itemElement.nodeName=='VirtualCube'){				
					var fa=new VirtualCube();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  /**
			 * Named sets in this schema.
			 */
			  if(itemElement.nodeName=='NamedSet'){				
					var fa=new NamedSet();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			 /**
			 * Declarations of user-defined functions in this schema.
			 */
			  if(itemElement.nodeName=='UserDefinedFunction'){				
					var fa=new UserDefinedFunction();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Schema'){
					this.init(itemElement);
			  }
		}
	}


//-----------------------------------Cube----------------------------------------------------
/**
 * Definition of a cube.
 */
	Cube = function(){
		this.cubeItems=[];
		this.defaultMeasure='';
		this.name='';
		this.enabled = 'true';// attribute default: true
		this.caption = '';
		this.description = '';
		this.cache='true';// attribute default: true
	}
	Cube.prototype.isCanAdd=function(objname){
		var objnames = ["DimensionUsage","Dimension","NamedSet","Measure","CalculatedMember","Table","View","InlineTable","Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Cube.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "描述":obj.getDescription(),//description
				  "标题":obj.getCaption(),//caption
				  "启用":obj.getEnabled(),//enabled
				  "缓存":obj.getCache()//cache
				};
	}
	Cube.prototype.isHaveItems=function(){
		return true;
	}
	Cube.prototype.getObjName=function(){
		return "Cube";
	}
	Cube.prototype.getObjCnName=function(){
		return "立方体";
	}
	Cube.prototype.getObjIcon=function(){
		return "/themes/icon/database/database_add.gif";
	}
	
	Cube.prototype.addObjItems=function(cubeItems){
		this.cubeItems.push(cubeItems);
	}
	Cube.prototype.getObjItems=function(){
		return this.cubeItems;
	}
	Cube.prototype.setDefaultMeasure=function(defaultMeasure){
		this.defaultMeasure=defaultMeasure;	
	}
	Cube.prototype.getDefaultMeasure=function(){
		return this.defaultMeasure;
	}
	Cube.prototype.setName=function(name){	
		this.name=name;
	}
	Cube.prototype.getName=function(){
		return this.name;
	}
	Cube.prototype.setEnabled=function(enabled){	
		this.enabled=enabled;
	}
	Cube.prototype.getEnabled=function(){
		return this.enabled;
	}
	Cube.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	Cube.prototype.getCaption=function(){
		return this.caption;
	}
	Cube.prototype.setDescription=function(description){	
		this.description=description;
	}
	Cube.prototype.getDescription=function(){
		return this.description;
	}
	Cube.prototype.setCache=function(cache){	
		this.cache=cache;
	}
	Cube.prototype.getCache=function(){
		return this.cache;
	}
	
	Cube.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Cube  ');
		if(this.defaultMeasure!=null){
			str.push(' defaultMeasure="',this.defaultMeasure);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.enabled!=null){
			str.push('" enabled="',this.enabled);
		}
		if(this.cache!=null){
			str.push('" cache="',this.cache);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		str.push('">');
		var _cubeItems = this.cubeItems;
		if (_cubeItems&&_cubeItems.length>0) {           
			for(var i=0;i<_cubeItems.length;i++){
				 str.push(_cubeItems[i].toXML());
			}			
        }
		str.push('\n\r </Cube>');
		return str.join('');
	}

	Cube.prototype.init=function(cubeElement){
		var defaultMeasure = cubeElement.attributes.getNamedItem("defaultMeasure");
		if (defaultMeasure != null){
			this.setDefaultMeasure(defaultMeasure.value);
		}
		var name = cubeElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Cube');
		}
		var enabled = cubeElement.attributes.getNamedItem("enabled");
		if (enabled != null){
			this.setEnabled(enabled.value);
		}else{
			this.setEnabled('true');
		}
		var cache = cubeElement.attributes.getNamedItem("cache");
		if (cache != null){
			this.setCache(cache.value);
		}else{
			this.setCache('true');
		}
		var caption = cubeElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = cubeElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var allElement=cubeElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			
			/**
		 	* Contains values of user-defined properties.
		 	*/
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Table'){				
					var fa=new Table();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='InlineTable'){				
					var fa=new InlineTable();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='View'){				
					var fa=new View();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Dimension'){				
					var fa=new Dimension();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Measure'){				
					var fa=new Measure();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Calculated members in this cube.
			 */
			  if(itemElement.nodeName=='CalculatedMember'){				
					var fa=new CalculatedMember();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Named sets in this cube.
			 */
			  if(itemElement.nodeName=='NamedSet'){				
					var fa=new NamedSet();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Cube'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------VirtualCube----------------------------------------------------
/**
 * A VirtualCube is a set of dimensions and
 * measures gleaned from other cubes.
 */
	VirtualCube = function(){
		this.virtualCubeItems=[];
		this.defaultMeasure='';
		this.name='';
		this.enabled = 'true';// attribute default: true
		this.caption = '';
		this.description = '';
	}
	VirtualCube.prototype.isCanAdd=function(objname){
		var objnames = ["VirtualCubeDimension","VirtualCubeMeasure","CalculatedMember","Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	VirtualCube.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "描述":obj.getDescription(),//description
				  "标题":obj.getCaption(),//caption
				  "启用":obj.getEnabled() //enabled
				  //"defaultMeasure":obj.getDefaultMeasure()
				};
	}
	VirtualCube.prototype.isHaveItems=function(){
		return true;
	}
	VirtualCube.prototype.getObjName=function(){
		return "VirtualCube";
	}
	VirtualCube.prototype.getObjCnName=function(){
		return "虚拟立方体";
	}
	VirtualCube.prototype.getObjIcon=function(){
		return "/themes/icon/database/database_add.gif";
	}
	
	VirtualCube.prototype.addObjItems=function(virtualCubeItems){
		this.virtualCubeItems.push(virtualCubeItems);
	}
	VirtualCube.prototype.getObjItems=function(){
		return this.virtualCubeItems;
	}
	VirtualCube.prototype.setDefaultMeasure=function(defaultMeasure){
		this.defaultMeasure=defaultMeasure;	
	}
	VirtualCube.prototype.getDefaultMeasure=function(){
		return this.defaultMeasure;
	}
	VirtualCube.prototype.setName=function(name){	
		this.name=name;
	}
	VirtualCube.prototype.getName=function(){
		return this.name;
	}
	VirtualCube.prototype.setEnabled=function(enabled){	
		this.enabled=enabled;
	}
	VirtualCube.prototype.getEnabled=function(){
		return this.enabled;
	}
	VirtualCube.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	VirtualCube.prototype.getCaption=function(){
		return this.caption;
	}
	VirtualCube.prototype.setDescription=function(description){	
		this.description=description;
	}
	VirtualCube.prototype.getDescription=function(){
		return this.description;
	}
	
	VirtualCube.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<VirtualCube  ');
		if(this.defaultMeasure!=null){
			str.push(' defaultMeasure="',this.defaultMeasure);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.enabled!=null){
			str.push('" enabled="',this.enabled);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		str.push('">');
		var _virtualCubeItems = this.virtualCubeItems;
		if (_virtualCubeItems&&_virtualCubeItems.length>0) {           
			for(var i=0;i<_virtualCubeItems.length;i++){
				 str.push(_virtualCubeItems[i].toXML());
			}			
        }
		str.push('\n\r </VirtualCube>');
		return str.join('');
	}

	VirtualCube.prototype.init=function(virtualCubeElement){
		var defaultMeasure = virtualCubeElement.attributes.getNamedItem("defaultMeasure");
		if (defaultMeasure != null){
			this.setDefaultMeasure(defaultMeasure.value);
		}
		var name = virtualCubeElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Virtual Cube');
		}
		var enabled = virtualCubeElement.attributes.getNamedItem("enabled");
		if (enabled != null){
			this.setEnabled(enabled.value);
		}else{
			this.setEnabled("true");
		}
		var caption = virtualCubeElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = virtualCubeElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var allElement=virtualCubeElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			
			/**
		 	* Contains values of user-defined properties.
		 	*/
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='CubeUsages'){				
					var fa=new CubeUsages();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='VirtualCubeDimension'){				
					var fa=new VirtualCubeDimension();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='VirtualCubeMeasure'){				
					var fa=new VirtualCubeMeasure();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Calculated members that belong to this virtual cube.
			 * (Calculated members inherited from other cubes should not be
			 * in this list.)
			 */
			  if(itemElement.nodeName=='CalculatedMember'){				
					var fa=new CalculatedMember();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
			 * Named sets in this cube.
			 */
			  if(itemElement.nodeName=='NamedSet'){				
					var fa=new NamedSet();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='VirtualCube'){
					this.init(itemElement);
			  }
		}
	}


//-----------------------------------CubeUsages----------------------------------------------------
/**
 * List of base cubes used by the virtual cube.
 */
	CubeUsages = function(){
		this.cubeUsages=[];
		this.name = 'CubeUsages';
	}
	CubeUsages.prototype.isCanAdd=function(objname){
		var objnames = ["CubeUsage"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	CubeUsages.prototype.getObjAttributes=function(obj){
		return {};
	}
	CubeUsages.prototype.isHaveItems=function(){
		return true;
	}
	CubeUsages.prototype.getObjName=function(){
		return "CubeUsages";
	}
	CubeUsages.prototype.getObjCnName=function(){
		return "立方体引用的集合";
	}
	CubeUsages.prototype.getObjIcon=function(){
		return "";
	}
	CubeUsages.prototype.setName=function(name){
		this.name=name
	}
	CubeUsages.prototype.getName=function(){
		return this.name;
	}
	CubeUsages.prototype.addObjItems=function(cubeUsages){
		this.cubeUsages.push(cubeUsages)
	}
	CubeUsages.prototype.getObjItems=function(){
		return this.cubeUsages;
	}
	
	CubeUsages.prototype.toXML=function(){
		var str=[];
		var _cubeUsages=this.cubeUsages;	

		if (_cubeUsages&&_cubeUsages.length>0) {
            str.push('\n\r    <CubeUsages>');
            
			for(var i=0;i<_cubeUsages.length;i++){
				 str.push(_cubeUsages[i].toXML());
			}
			str.push('\n\r    </CubeUsages>');
        }
		return str.join('');
	}
	
	CubeUsages.prototype.init=function(cubeUsagesElement){	
		var allElement=cubeUsagesElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var annoElement=allElement[j];
			  if(annoElement.nodeName=='CubeUsage'){				
					var an=new CubeUsage();
					an.init(annoElement);
					this.addObjItems(an);
			  }
			  if(annoElement.nodeName=='CubeUsages'){
					this.init(annoElement);
			  }
		}
	}

//-----------------------------------CubeUsage----------------------------------------------------

	CubeUsage = function(){
		this.name='';
		this.cubeName='';  // required attribute
		this.ignoreUnrelatedDimensions='false';   // attribute default: false
	}
	CubeUsage.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	CubeUsage.prototype.getObjAttributes=function(obj){
		return { "立方体名称":obj.getCubeName(),//cubeName
				  "忽略不相关维度":obj.getIgnoreUnrelatedDimensions()//ignoreUnrelatedDimensions
				};
	}
	CubeUsage.prototype.isHaveItems=function(){
		return false;
	}
	CubeUsage.prototype.getObjName=function(){
		return "CubeUsage";
	}
	CubeUsage.prototype.getObjCnName=function(){
		return "立方体引用";
	}
	CubeUsage.prototype.getObjIcon=function(){
		return "";
	}
	CubeUsage.prototype.setCubeName=function(cubeName){
		this.cubeName=cubeName;
	}
	CubeUsage.prototype.getCubeName=function(){
		return this.cubeName;
	}
	CubeUsage.prototype.setName=function(name){
		this.name=name;
	}
	CubeUsage.prototype.getName=function(){
		return this.name;
	}
	CubeUsage.prototype.setIgnoreUnrelatedDimensions=function(ignoreUnrelatedDimensions){
		this.ignoreUnrelatedDimensions=ignoreUnrelatedDimensions;
	}
	CubeUsage.prototype.getIgnoreUnrelatedDimensions=function(){
		return this.ignoreUnrelatedDimensions;
	}
	
	CubeUsage.prototype.toXML = function(){
		var str=[];	
		str.push('\n\r	<CubeUsage');
		if(this.cubeName!=null){
			str.push(' cubeName="',this.cubeName);
		}
		if(this.ignoreUnrelatedDimensions!=null){
			str.push('" ignoreUnrelatedDimensions="',this.ignoreUnrelatedDimensions);
		}
		str.push('">');
		
		str.push('\n\r	</CubeUsage>');
		return str.join('');
	}
	
	CubeUsage.prototype.init=function(cubeUsageElement){
		var cubeName = cubeUsageElement.attributes.getNamedItem("cubeName");
		if (cubeName != null){
			this.setCubeName(cubeName.value);
		}
		var	ignoreUnrelatedDimensions =cubeUsageElement.attributes.getNamedItem("ignoreUnrelatedDimensions");
		if (ignoreUnrelatedDimensions != null){
			this.setIgnoreUnrelatedDimensions(ignoreUnrelatedDimensions.value);
		}else{
			this.setIgnoreUnrelatedDimensions("false");
		}
		
	}

//-----------------------------------VirtualCubeDimension----------------------------------------------------
/**
 * A VirtualCubeDimension is a usage of a Dimension in a VirtualCube.
 */
	VirtualCubeDimension = function(){
		this.virtualCubeDimensionItems=[];
		this.cubeName='';
		this.name='';
		this.foreignKey = '';
		this.highCardinality = 'false';
		this.caption = '';
		this.description = '';
	}
	VirtualCubeDimension.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	VirtualCubeDimension.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "立方体名称":obj.getCubeName(),//cubeName
				  "标题":obj.getCaption(),//caption
				  "外键":obj.getForeignKey()//foreignKey
				  //"highCardinality":obj.getHighCardinality(),
				  //"description":obj.getDescription()
				};
	}
	VirtualCubeDimension.prototype.isHaveItems=function(){
		return false;
	}
	VirtualCubeDimension.prototype.getObjName=function(){
		return "VirtualCubeDimension";
	}
	VirtualCubeDimension.prototype.getObjCnName=function(){
		return "虚拟立方体维度";
	}
	VirtualCubeDimension.prototype.getObjIcon=function(){
		return "";
	}
	VirtualCubeDimension.prototype.addObjItems=function(virtualCubeDimensionItems){
		this.virtualCubeDimensionItems.push(virtualCubeDimensionItems);
	}
	VirtualCubeDimension.prototype.getObjItems=function(){
		return this.virtualCubeDimensionItems;
	}
	VirtualCubeDimension.prototype.setCubeName=function(cubeName){
		this.cubeName=cubeName;	
	}
	VirtualCubeDimension.prototype.getCubeName=function(){
		return this.cubeName;
	}
	VirtualCubeDimension.prototype.setName=function(name){	
		this.name=name;
	}
	VirtualCubeDimension.prototype.getName=function(){
		return this.name;
	}
	VirtualCubeDimension.prototype.setForeignKey=function(foreignKey){	
		this.foreignKey=foreignKey;
	}
	VirtualCubeDimension.prototype.getForeignKey=function(){
		return this.foreignKey;
	}
	VirtualCubeDimension.prototype.setHighCardinality=function(highCardinality){	
		this.highCardinality=highCardinality;
	}
	VirtualCubeDimension.prototype.getHighCardinality=function(){
		return this.highCardinality;
	}
	VirtualCubeDimension.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	VirtualCubeDimension.prototype.getCaption=function(){
		return this.caption;
	}
	VirtualCubeDimension.prototype.setDescription=function(description){	
		this.description=description;
	}
	VirtualCubeDimension.prototype.getDescription=function(){
		return this.description;
	}
	
	VirtualCubeDimension.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<VirtualCubeDimension  ');
		if(this.cubeName!=null){
			str.push(' cubeName="',this.cubeName);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.foreignKey!=null){
			str.push('" foreignKey="',this.foreignKey);
		}
		if(this.highCardinality!=null){
			str.push('" highCardinality="',this.highCardinality);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		str.push('">');
		var _virtualCubeDimensionItems = this.virtualCubeDimensionItems;
		if (_virtualCubeDimensionItems&&_virtualCubeDimensionItems.length>0) {           
			for(var i=0;i<_virtualCubeDimensionItems.length;i++){
				 str.push(_virtualCubeDimensionItems[i].toXML());
			}			
        }
		str.push('\n\r </VirtualCubeDimension>');
		return str.join('');
	}

	VirtualCubeDimension.prototype.init=function(virtualCubeDimensionElement){
		var cubeName = virtualCubeDimensionElement.attributes.getNamedItem("cubeName");
		if (cubeName != null){
			this.setCubeName(cubeName.value);
		}
		var name = virtualCubeDimensionElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Virtual Dimension');
		}
		var foreignKey = virtualCubeDimensionElement.attributes.getNamedItem("foreignKey");
		if (foreignKey != null){
			this.setForeignKey(foreignKey.value);
		}
		var highCardinality = virtualCubeDimensionElement.attributes.getNamedItem("highCardinality");
		if (highCardinality != null){
			this.setHighCardinality(highCardinality.value);
		}else{
			this.setHighCardinality(false);
		}
		var caption = virtualCubeDimensionElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = virtualCubeDimensionElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var allElement=virtualCubeDimensionElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='VirtualCubeDimension'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------VirtualCubeMeasure----------------------------------------------------
/**
 * A VirtualCubeMeasure is a usage of a Measure in a VirtualCube.
 */
	VirtualCubeMeasure = function(){
		this.virtualCubeMeasureItems=[];
		this.cubeName='';
		this.name='';
		this.visible='true';
	}
	VirtualCubeMeasure.prototype.isCanAdd=function(objname){
		var objnames = ["Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	VirtualCubeMeasure.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "立方体名称":obj.getCubeName(),//cubeName
				  "可见":obj.getVisible()	//visible	  
				};
	}
	VirtualCubeMeasure.prototype.isHaveItems=function(){
		return true;
	}
	VirtualCubeMeasure.prototype.getObjName=function(){
		return "VirtualCubeMeasure";
	}
	VirtualCubeMeasure.prototype.getObjCnName=function(){
		return "虚拟立方体度量值";
	}
	VirtualCubeMeasure.prototype.getObjIcon=function(){
		return "";
	}
	VirtualCubeMeasure.prototype.addObjItems=function(virtualCubeMeasureItems){
		this.virtualCubeMeasureItems.push(virtualCubeMeasureItems);
	}
	VirtualCubeMeasure.prototype.getObjItems=function(){
		return this.virtualCubeMeasureItems;
	}
	VirtualCubeMeasure.prototype.setCubeName=function(cubeName){
		this.cubeName=cubeName;	
	}
	VirtualCubeMeasure.prototype.getCubeName=function(){
		return this.cubeName;
	}
	VirtualCubeMeasure.prototype.setName=function(name){	
		this.name=name;
	}
	VirtualCubeMeasure.prototype.getName=function(){
		return this.name;
	}
	VirtualCubeMeasure.prototype.setVisible=function(visible){	
		this.visible=visible;
	}
	VirtualCubeMeasure.prototype.getVisible=function(){
		return this.visible;
	}
	
	VirtualCubeMeasure.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<VirtualCubeMeasure  ');
		if(this.cubeName!=null){
			str.push(' cubeName="',this.cubeName);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.visible!=null){
			str.push('" visible="',this.visible);
		}
		str.push('">');
		var _virtualCubeMeasureItems = this.virtualCubeMeasureItems;
		if (_virtualCubeMeasureItems&&_virtualCubeMeasureItems.length>0) {           
			for(var i=0;i<_virtualCubeMeasureItems.length;i++){
				 str.push(_virtualCubeMeasureItems[i].toXML());
			}			
        }
		str.push('\n\r </VirtualCubeMeasure>');
		return str.join('');
	}

	VirtualCubeMeasure.prototype.init=function(virtualCubeMeasureElement){
		var cubeName = virtualCubeMeasureElement.attributes.getNamedItem("cubeName");
		if (cubeName != null){
			this.setCubeName(cubeName.value);
		}
		var name = virtualCubeMeasureElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Virtual Measure');
		}
		var visible = virtualCubeMeasureElement.attributes.getNamedItem("visible");
		if (visible != null){
			this.setVisible(visible.value);
		}else{
			this.setVisible(true);
		}
		var allElement=virtualCubeMeasureElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='VirtualCubeMeasure'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------DimensionUsage----------------------------------------------------
/**
 * A DimensionUsage is usage of a shared
 * Dimension within the context of a cube.
 */
	DimensionUsage = function(){
		this.dimensionUsageItems=[];
		this.source='';
		this.level='';
		this.usagePrefix='';
		this.foreignKey = '';
		this.highCardinality = 'false';
		this.name = '';
		this.caption = '';
		this.description = '';
	}
	DimensionUsage.prototype.isCanAdd=function(objname){
		var objnames = ["Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	DimensionUsage.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "资源":obj.getSource(),//source
				  "级别":obj.getLevel(),//level
				  "外键":obj.getForeignKey(),//foreignKey
				  "使用前缀":obj.getUsagePrefix(),//usagePrefix
				  "标题":obj.getCaption()//caption
				};
	}
	DimensionUsage.prototype.isHaveItems=function(){
		return true;
	}
	DimensionUsage.prototype.getObjName=function(){
		return "DimensionUsage";
	}
	DimensionUsage.prototype.getObjCnName=function(){
		return "维度引用";
	}
	DimensionUsage.prototype.getObjIcon=function(){
		return "/themes/icon/database/new_driver.gif";
	}
	DimensionUsage.prototype.addObjItems=function(dimensionUsageItems){
		this.dimensionUsageItems.push(dimensionUsageItems);
	}
	DimensionUsage.prototype.getObjItems=function(){
		return this.dimensionUsageItems;
	}
	DimensionUsage.prototype.setSource=function(source){
		this.source=source;	
	}
	DimensionUsage.prototype.getSource=function(){
		return this.source;
	}
	DimensionUsage.prototype.setLevel=function(level){
		this.level=level;	
	}
	DimensionUsage.prototype.getLevel=function(){
		return this.level;
	}
	DimensionUsage.prototype.setUsagePrefix=function(usagePrefix){	
		this.usagePrefix=usagePrefix;
	}
	DimensionUsage.prototype.getUsagePrefix=function(){
		return this.usagePrefix;
	}
	DimensionUsage.prototype.setForeignKey=function(foreignKey){	
		this.foreignKey=foreignKey;
	}
	DimensionUsage.prototype.getForeignKey=function(){
		return this.foreignKey;
	}
	DimensionUsage.prototype.setHighCardinality=function(highCardinality){	
		this.highCardinality=highCardinality;
	}
	DimensionUsage.prototype.getHighCardinality=function(){
		return this.highCardinality;
	}
	DimensionUsage.prototype.setName=function(name){	
		this.name=name;
	}
	DimensionUsage.prototype.getName=function(){
		return this.name;
	}
	DimensionUsage.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	DimensionUsage.prototype.getCaption=function(){
		return this.caption;
	}
	DimensionUsage.prototype.setDescription=function(description){	
		this.description=description;
	}
	DimensionUsage.prototype.getDescription=function(){
		return this.description;
	}
	
	DimensionUsage.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<DimensionUsage  ');
		if(this.source!=null){
			str.push(' source="',this.source);
		}
		if(this.level!=null){
			str.push(' level="',this.level);
		}
		if(this.usagePrefix!=null){
			str.push('" usagePrefix="',this.usagePrefix);
		}
		if(this.foreignKey!=null){
			str.push('" foreignKey="',this.foreignKey);
		}
		if(this.highCardinality!=null){
			str.push('" highCardinality="',this.highCardinality);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		str.push('">');
		var _dimensionUsageItems = this.dimensionUsageItems;
		if (_dimensionUsageItems&&_dimensionUsageItems.length>0) {           
			for(var i=0;i<_dimensionUsageItems.length;i++){
				 str.push(_dimensionUsageItems[i].toXML());
			}			
        }
		str.push('\n\r </DimensionUsage>');
		return str.join('');
	}

	DimensionUsage.prototype.init=function(dimensionUsageElement){
		var source = dimensionUsageElement.attributes.getNamedItem("source");
		if (source != null){
			this.setSource(source.value);
		}
		var level = dimensionUsageElement.attributes.getNamedItem("level");
		if (level != null){
			this.setLevel(level.value);
		}
		var usagePrefix = dimensionUsageElement.attributes.getNamedItem("usagePrefix");
		if (usagePrefix != null){
			this.setUsagePrefix(usagePrefix.value);
		}
		var foreignKey = dimensionUsageElement.attributes.getNamedItem("foreignKey");
		if (foreignKey != null){
			this.setForeignKey(foreignKey.value);
		}
		var highCardinality = dimensionUsageElement.attributes.getNamedItem("highCardinality");
		if (highCardinality != null){
			this.setHighCardinality(highCardinality.value);
		}
		var name = dimensionUsageElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Dimension');
		}
		var caption = dimensionUsageElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = dimensionUsageElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var allElement=dimensionUsageElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='DimensionUsage'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Dimension----------------------------------------------------
/**
 * A Dimension is a collection of hierarchies. There are
 * two kinds: a public dimension belongs to a
 * Schema, and be used by several cubes; a
 * private dimension belongs to a
 * Cube. The foreignKey field is only
 * applicable to private dimensions.
 */
	Dimension = function(){
		this.dimensionItems=[];
		this.type='';
		this.usagePrefix='';
		this.foreignKey = '';
		this.highCardinality = false;
		this.name = '';
		this.caption = '';
		this.description = '';
	}
	Dimension.prototype.isCanAdd=function(objname){
		var objnames = ["Annotations","Hierarchy"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Dimension.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "描述":obj.getDescription(),//description
				  "类型":obj.getType(),//type
				  "外键":obj.getForeignKey(),//foreignKey
				  "使用前缀":obj.getUsagePrefix(),//usagePrefix
				  "标题":obj.getCaption()//caption
				};
	}
	Dimension.prototype.isHaveItems=function(){
		return true;
	}
	Dimension.prototype.getObjName=function(){
		return "Dimension";
	}
	Dimension.prototype.getObjCnName=function(){
		return "维度";
	}
	Dimension.prototype.getObjIcon=function(){
		return "/themes/icon/database/new_connection.gif";
	}
	
	Dimension.prototype.addObjItems=function(dimensionItems){
		this.dimensionItems.push(dimensionItems);
	}
	Dimension.prototype.getObjItems=function(){
		return this.dimensionItems;
	}
	Dimension.prototype.setType=function(type){
		this.type=type;	
	}
	Dimension.prototype.getType=function(){
		return this.type;
	}
	Dimension.prototype.setUsagePrefix=function(usagePrefix){	
		this.usagePrefix=usagePrefix;
	}
	Dimension.prototype.getUsagePrefix=function(){
		return this.usagePrefix;
	}
	Dimension.prototype.setForeignKey=function(foreignKey){	
		this.foreignKey=foreignKey;
	}
	Dimension.prototype.getForeignKey=function(){
		return this.foreignKey;
	}
	Dimension.prototype.setHighCardinality=function(highCardinality){	
		this.highCardinality=highCardinality;
	}
	Dimension.prototype.getHighCardinality=function(){
		return this.highCardinality;
	}
	Dimension.prototype.setName=function(name){	
		this.name=name;
	}
	Dimension.prototype.getName=function(){
		return this.name;
	}
	Dimension.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	Dimension.prototype.getCaption=function(){
		return this.caption;
	}
	Dimension.prototype.setDescription=function(description){	
		this.description=description;
	}
	Dimension.prototype.getDescription=function(){
		return this.description;
	}
	
	Dimension.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Dimension  ');
		if(this.type!=null){
			str.push(' type="',this.type);
		}
		if(this.usagePrefix!=null){
			str.push('" usagePrefix="',this.usagePrefix);
		}
		if(this.foreignKey!=null){
			str.push('" foreignKey="',this.foreignKey);
		}
		if(this.highCardinality!=null){
			str.push('" highCardinality="',this.highCardinality);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		str.push('">');
		var _dimensionItems = this.dimensionItems;
		if (_dimensionItems&&_dimensionItems.length>0) {           
			for(var i=0;i<_dimensionItems.length;i++){
				 str.push(_dimensionItems[i].toXML());
			}			
        }
		str.push('\n\r </Dimension>');
		return str.join('');
	}

	Dimension.prototype.init=function(dimensionElement){
		var type = dimensionElement.attributes.getNamedItem("type");
		if (type != null){
			this.setType(type.value);
		}else{
			this.setType('StandardDimension');
		}
		var usagePrefix = dimensionElement.attributes.getNamedItem("usagePrefix");
		if (usagePrefix != null){
			this.setUsagePrefix(usagePrefix.value);
		}
		var foreignKey = dimensionElement.attributes.getNamedItem("foreignKey");
		if (foreignKey != null){
			this.setForeignKey(foreignKey.value);
		}
		var highCardinality = dimensionElement.attributes.getNamedItem("highCardinality");
		if (highCardinality != null){
			this.setHighCardinality(highCardinality.value);
		}
		var name = dimensionElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Dimension');
		}
		var caption = dimensionElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = dimensionElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var allElement=dimensionElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Hierarchy'){				
					var fa=new Hierarchy();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Dimension'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Hierarchy----------------------------------------------------
/**
 * Defines a hierarchy.
 * You must specify at most one <Relation>
 * or memberReaderClass. If you specify none, the
 * hierarchy is assumed to come from the same fact table of the
 * current cube.
 */
	Hierarchy = function(){
		this.hierarchyitems=[];
		this.name='';  // optional attribute
		this.hasAll='true';  // required attribute
		this.allMemberName='';  // optional attribute
		this.allMemberCaption='';  // optional attribute
		this.allLevelName='';  // optional attribute
		this.primaryKey='';  // optional attribute
		this.primaryKeyTable='';  // optional attribute
		this.defaultMember='';  // optional attribute
		this.memberReaderClass='';  // optional attribute
		this.caption='';  // optional attribute
		this.description='';  // optional attribute
		this.uniqueKeyLevelName='';  // optional attribute
	}
	Hierarchy.prototype.isCanAdd=function(objname){
		var objnames = ["Annotations","Level","Table","Join","View","InlineTable"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Hierarchy.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "描述":obj.getDescription(),//description
				  "一直":obj.getHasAll(),//hasAll
				  "全部成员名称":obj.getAllMemberName(),//allMemberName
				  "全部成员标题":obj.getAllMemberCaption(),//allMemberCaption
				  "全部级别名称":obj.getAllLevelName(),//allLevelName
				  "默认成员":obj.getDefaultMember(),//defaultMember
				  "memberReaderClass":obj.getMemberReaderClass(),//memberReaderClass
				  "主键表":obj.getPrimaryKeyTable(),//primaryKeyTable
				  "主键":obj.getPrimaryKey(),//primaryKey
				  "标题":obj.getCaption()//caption
				};
	}
	Hierarchy.prototype.isHaveItems=function(){
		return true;
	}
	Hierarchy.prototype.getObjName=function(){
		return "Hierarchy";
	}
	Hierarchy.prototype.getObjCnName=function(){
		return "层次";
	}
	Hierarchy.prototype.getObjIcon=function(){
		return "/themes/icon/database/showparents_mode.gif";
	}
	Hierarchy.prototype.addObjItems=function(hierarchyitems){
		this.hierarchyitems.push(hierarchyitems);
	}
	Hierarchy.prototype.getObjItems=function(){
		return this.hierarchyitems;
	}
	Hierarchy.prototype.setName=function(name){	
		this.name=name;
	}
	Hierarchy.prototype.getName=function(){
		return this.name;
	}
	Hierarchy.prototype.setHasAll=function(hasAll){
		this.hasAll=hasAll;	
	}
	Hierarchy.prototype.getHasAll=function(){
		return this.hasAll;
	}
	Hierarchy.prototype.setAllMemberName=function(allMemberName){	
		this.allMemberName=allMemberName;
	}
	Hierarchy.prototype.getAllMemberName=function(){
		return this.allMemberName;
	}
	Hierarchy.prototype.setAllMemberCaption=function(allMemberCaption){	
		this.allMemberCaption=allMemberCaption;
	}
	Hierarchy.prototype.getAllMemberCaption=function(){
		return this.allMemberCaption;
	}
	Hierarchy.prototype.setAllLevelName=function(allLevelName){	
		this.allLevelName=allLevelName;
	}
	Hierarchy.prototype.getAllLevelName=function(){
		return this.allLevelName;
	}
	Hierarchy.prototype.setPrimaryKey=function(primaryKey){	
		this.primaryKey=primaryKey;
	}
	Hierarchy.prototype.getPrimaryKey=function(){
		return this.primaryKey;
	}
	Hierarchy.prototype.setPrimaryKeyTable=function(primaryKeyTable){	
		this.primaryKeyTable=primaryKeyTable;
	}
	Hierarchy.prototype.getPrimaryKeyTable=function(){
		return this.primaryKeyTable;
	}
	Hierarchy.prototype.setDefaultMember=function(defaultMember){	
		this.defaultMember=defaultMember;
	}
	Hierarchy.prototype.getDefaultMember=function(){
		return this.defaultMember;
	}
	Hierarchy.prototype.setMemberReaderClass=function(memberReaderClass){	
		this.memberReaderClass=memberReaderClass;
	}
	Hierarchy.prototype.getMemberReaderClass=function(){
		return this.memberReaderClass;
	}
	Hierarchy.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	Hierarchy.prototype.getCaption=function(){
		return this.caption;
	}
	Hierarchy.prototype.setDescription=function(description){	
		this.description=description;
	}
	Hierarchy.prototype.getDescription=function(){
		return this.description;
	}
	Hierarchy.prototype.setUniqueKeyLevelName=function(uniqueKeyLevelName){	
		this.uniqueKeyLevelName=uniqueKeyLevelName;
	}
	Hierarchy.prototype.getUniqueKeyLevelName=function(){
		return this.uniqueKeyLevelName;
	}
	
	Hierarchy.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Hierarchy  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.hasAll!=null){
			str.push('" hasAll="',this.hasAll);
		}
		if(this.allMemberName!=null){
			str.push('" allMemberName="',this.allMemberName);
		}
		if(this.allMemberCaption!=null){
			str.push('" allMemberCaption="',this.allMemberCaption);
		}
		if(this.allLevelName!=null){
			str.push('" allLevelName="',this.allLevelName);
		}
		if(this.primaryKey!=null){
			str.push('" primaryKey="',this.primaryKey);
		}
		if(this.primaryKeyTable!=null){
			str.push('" primaryKeyTable="',this.primaryKeyTable);
		}
		if(this.defaultMember!=null){
			str.push('" defaultMember="',this.defaultMember);
		}
		if(this.memberReaderClass!=null){
			str.push('" memberReaderClass="',this.memberReaderClass);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.uniqueKeyLevelName!=null){
			str.push('" uniqueKeyLevelName="',this.uniqueKeyLevelName);
		}
		str.push('">');
		var _hierarchyitems = this.hierarchyitems;
		if (_hierarchyitems&&_hierarchyitems.length>0) {           
			for(var i=0;i<_hierarchyitems.length;i++){
				 str.push(_hierarchyitems[i].toXML());
			}			
        }
		str.push('\n\r </Hierarchy>');
		return str.join('');
	}

	Hierarchy.prototype.init=function(hierarchyElement){
		var name = hierarchyElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var hasAll = hierarchyElement.attributes.getNamedItem("hasAll");
		if (hasAll != null){
			this.setHasAll(hasAll.value);
		}else{
			this.setHasAll("true");
		}
		var allMemberName = hierarchyElement.attributes.getNamedItem("allMemberName");
		if (allMemberName != null){
			this.AllMemberName(allMemberName.value);
		}
		var allMemberCaption = hierarchyElement.attributes.getNamedItem("allMemberCaption");
		if (allMemberCaption != null){
			this.setAllMemberCaption(allMemberCaption.value);
		}
		var allLevelName = hierarchyElement.attributes.getNamedItem("allLevelName");
		if (allLevelName != null){
			this.setAllLevelName(allLevelName.value);
		}
		var primaryKey = hierarchyElement.attributes.getNamedItem("primaryKey");
		if (primaryKey != null){
			this.setPrimaryKey(primaryKey.value);
		}
		var primaryKeyTable = hierarchyElement.attributes.getNamedItem("primaryKeyTable");
		if (primaryKeyTable != null){
			this.setPrimaryKeyTable(primaryKeyTable.value);
		}
		var defaultMember = hierarchyElement.attributes.getNamedItem("defaultMember");
		if (defaultMember != null){
			this.setDefaultMember(defaultMember.value);
		}
		var memberReaderClass = hierarchyElement.attributes.getNamedItem("memberReaderClass");
		if (memberReaderClass != null){
			this.setMemberReaderClass(memberReaderClass.value);
		}
		var caption = hierarchyElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = hierarchyElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var uniqueKeyLevelName = hierarchyElement.attributes.getNamedItem("uniqueKeyLevelName");
		if (uniqueKeyLevelName != null){
			this.setUniqueKeyLevelName(uniqueKeyLevelName.value);
		}
		var allElement=hierarchyElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Level'){				
					var fa=new Level();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='MemberReaderParameter'){				
					var fa=new MemberReaderParameter();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Table'){				
					var fa=new Table();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Join'){				
					var fa=new Join();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='View'){				
					var fa=new Join();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='InlineTable'){				
					var fa=new InlineTable();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Hierarchy'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Level----------------------------------------------------

	Level = function(){
		this.levelitems=[];
		this.approxRowCount='';  // optional attribute
		this.name='';  // optional attribute
		this.table='';  // optional attribute
		this.column='';  // optional attribute
		this.nameColumn='';  // optional attribute
		this.ordinalColumn='';  // optional attribute
		this.parentColumn='';  // optional attribute
		this.nullParentValue='';  // optional attribute
		/** Allowable values for {@link #type}. */
		this.type_values = ["String", "Numeric", "Integer", "Boolean", "Date", "Time", "Timestamp"];
		this.type='String';  // attribute default: String
		this.uniqueMembers='false';  // attribute default: false
		/** Allowable values for {@link #levelType}. */
		this.levelType_values = ["Regular", "TimeYears", "TimeHalfYear", "TimeQuarters", "TimeMonths", "TimeWeeks", "TimeDays", "TimeHours", "TimeMinutes", "TimeSeconds", "TimeUndefined"];
		this.levelType='Regular';  // attribute default: Regular
		/** Allowable values for {@link #hideMemberIf}. */
		this.hideMemberIf_values = ["Never", "IfBlankName", "IfParentsName"];
		this.hideMemberIf='Never';  // attribute default: Never
		this.formatter='';  // optional attribute
		this.caption='';  // optional attribute
		this.description='';  // optional attribute
		this.captionColumn='';  // optional attribute;
	}
	Level.prototype.isCanAdd=function(objname){
		var objnames = ["Annotations","Property","KeyExpression","NameExpression","OrdinalExpression","ParentExpression","Closure"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Level.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "描述":obj.getDescription(),//description
				  "事实表":obj.getTable(),//table
				  "列":obj.getColumn(),//column
				  "名称列":obj.getNameColumn(),//nameColumn
				  "父列":obj.getParentColumn(),//parentColumn
				  "空父值":obj.getNullParentValue(),//nullParentValue
				  "排序列":obj.getOrdinalColumn(),//ordinalColumn
				  "类型":obj.getType(),//type
				  "特殊成员":obj.getUniqueMembers(),//uniqueMembers
				  "级别类型":obj.getLevelType(),//levelType
				  "隐藏成员条件":obj.getHideMemberIf(),//hideMemberIf
				  "大约行数":obj.getApproxRowCount(),//approxRowCount
				  "标题":obj.getCaption(),//caption
				  "标题列":obj.getCaptionColumn(),//captionColumn
				  "格式化":obj.getFormatter()//formatter
				};
	}
	Level.prototype.isHaveItems=function(){
		return true;
	}
	Level.prototype.getObjName=function(){
		return "Level";
	}
	Level.prototype.getObjCnName=function(){
		return "级别";
	}
	Level.prototype.getObjIcon=function(){
		return "/themes/icon/database/outline.gif";
	}
	
	Level.prototype.addObjItems=function(levelitems){
		this.levelitems.push(levelitems);
	}
	Level.prototype.getObjItems=function(){
		return this.levelitems;
	}
	Level.prototype.setApproxRowCount=function(approxRowCount){
		this.approxRowCount=approxRowCount;	
	}
	Level.prototype.getApproxRowCount=function(){
		return this.approxRowCount;
	}
	Level.prototype.setName=function(name){	
		this.name=name;
	}
	Level.prototype.getName=function(){
		return this.name;
	}
	Level.prototype.setTable=function(table){	
		this.table=table;
	}
	Level.prototype.getTable=function(){
		return this.table;
	}
	Level.prototype.setColumn=function(column){	
		this.column=column;
	}
	Level.prototype.getColumn=function(){
		return this.column;
	}
	Level.prototype.setNameColumn=function(nameColumn){	
		this.nameColumn=nameColumn;
	}
	Level.prototype.getNameColumn=function(){
		return this.nameColumn;
	}
	Level.prototype.setOrdinalColumn=function(ordinalColumn){	
		this.ordinalColumn=ordinalColumn;
	}
	Level.prototype.getOrdinalColumn=function(){
		return this.ordinalColumn;
	}
	Level.prototype.setParentColumn=function(parentColumn){	
		this.parentColumn=parentColumn;
	}
	Level.prototype.getParentColumn=function(){
		return this.parentColumn;
	}
	Level.prototype.setNullParentValue=function(nullParentValue){	
		this.nullParentValue=nullParentValue;
	}
	Level.prototype.getNullParentValue=function(){
		return this.nullParentValue;
	}
	Level.prototype.setType=function(type){	
		this.type=type;
	}
	Level.prototype.getType=function(){
		return this.type;
	}
	Level.prototype.setUniqueMembers=function(uniqueMembers){	
		this.uniqueMembers=uniqueMembers;
	}
	Level.prototype.getUniqueMembers=function(){
		return this.uniqueMembers;
	}
	Level.prototype.setLevelType=function(levelType){	
		this.levelType=levelType;
	}
	Level.prototype.getLevelType=function(){
		return this.levelType;
	}
	Level.prototype.setHideMemberIf=function(hideMemberIf){	
		this.hideMemberIf=hideMemberIf;
	}
	Level.prototype.getHideMemberIf=function(){
		return this.hideMemberIf;
	}
	Level.prototype.setFormatter=function(formatter){	
		this.formatter=formatter;
	}
	Level.prototype.getFormatter=function(){
		return this.formatter;
	}
	Level.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	Level.prototype.getCaption=function(){
		return this.caption;
	}
	Level.prototype.setDescription=function(description){	
		this.description=description;
	}
	Level.prototype.getDescription=function(){
		return this.description;
	}
	Level.prototype.setCaptionColumn=function(captionColumn){	
		this.captionColumn=captionColumn;
	}
	Level.prototype.getCaptionColumn=function(){
		return this.captionColumn;
	}
	
	Level.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Level  ');
		if(this.approxRowCount!=null){
			str.push(' approxRowCount="',this.approxRowCount);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.table!=null){
			str.push('" table="',this.table);
		}
		if(this.column!=null){
			str.push('" column="',this.column);
		}
		if(this.nameColumn!=null){
			str.push('" nameColumn="',this.nameColumn);
		}
		if(this.ordinalColumn!=null){
			str.push('" ordinalColumn="',this.ordinalColumn);
		}
		if(this.parentColumn!=null){
			str.push('" parentColumn="',this.parentColumn);
		}
		if(this.nullParentValue!=null){
			str.push('" nullParentValue="',this.nullParentValue);
		}
		if(this.type!=null){
			str.push('" type="',this.type);
		}
		if(this.uniqueMembers!=null){
			str.push('" uniqueMembers="',this.uniqueMembers);
		}
		if(this.levelType!=null){
			str.push('" levelType="',this.levelType);
		}
		if(this.hideMemberIf!=null){
			str.push('" hideMemberIf="',this.hideMemberIf);
		}
		if(this.formatter!=null){
			str.push('" formatter="',this.formatter);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.captionColumn!=null){
			str.push('" captionColumn="',this.captionColumn);
		}
		str.push('">');
		var _levelitems = this.levelitems;
		if (_levelitems&&_levelitems.length>0) {           
			for(var i=0;i<_levelitems.length;i++){
				 str.push(_levelitems[i].toXML());
			}			
        }
		str.push('\n\r </Level>');
		return str.join('');
	}

	Level.prototype.init=function(levelElement){
		var approxRowCount = levelElement.attributes.getNamedItem("approxRowCount");
		if (approxRowCount != null){
			this.setApproxRowCount(approxRowCount.value);
		}
		var name = levelElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Level');
		}
		var table = levelElement.attributes.getNamedItem("table");
		if (table != null){
			this.setTable(table.value);
		}
		var column = levelElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		var nameColumn = levelElement.attributes.getNamedItem("nameColumn");
		if (nameColumn != null){
			this.setNameColumn(nameColumn.value);
		}
		var ordinalColumn = levelElement.attributes.getNamedItem("ordinalColumn");
		if (ordinalColumn != null){
			this.setOrdinalColumn(ordinalColumn.value);
		}
		var parentColumn = levelElement.attributes.getNamedItem("parentColumn");
		if (parentColumn != null){
			this.setParentColumn(parentColumn.value);
		}
		var nullParentValue = levelElement.attributes.getNamedItem("nullParentValue");
		if (nullParentValue != null){
			this.setNullParentValue(nullParentValue.value);
		}
		var type = levelElement.attributes.getNamedItem("type");
		if (type != null){
			this.setType(type.value);
		}
		var uniqueMembers = levelElement.attributes.getNamedItem("uniqueMembers");
		if (uniqueMembers != null){
			this.setUniqueMembers(uniqueMembers.value);
		}else{
			this.setUniqueMembers("false");
		}
		var levelType = levelElement.attributes.getNamedItem("levelType");
		if (levelType != null){
			this.setLevelType(levelType.value);
		}
		var hideMemberIf = levelElement.attributes.getNamedItem("hideMemberIf");
		if (hideMemberIf != null){
			this.setHideMemberIf(hideMemberIf.value);
		}
		var formatter = levelElement.attributes.getNamedItem("formatter");
		if (formatter != null){
			this.setFormatter(formatter.value);
		}
		var caption = levelElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = levelElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var captionColumn = levelElement.attributes.getNamedItem("captionColumn");
		if (captionColumn != null){
			this.setCaptionColumn(captionColumn.value);
		}
		var allElement=levelElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			/**
		 	* Contains values of user-defined properties.
		 	*/
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
		 		* The SQL expression used to populate this level's key.
		 		*/
			  if(itemElement.nodeName=='KeyExpression'){				
					var fa=new KeyExpression();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
		 		* The SQL expression used to populate this level's name. If not
		 		* specified, the level's key is used.
		 		*/
			  if(itemElement.nodeName=='NameExpression'){				
					var fa=new NameExpression();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
		 		* The SQL expression used to populate this level's ordinal.
		 		*/
			  if(itemElement.nodeName=='OrdinalExpression'){				
					var fa=new OrdinalExpression();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  
			  /**
		 		* The SQL expression used to join to the parent member in a
				* parent-child hierarchy.
		 		*/
			  if(itemElement.nodeName=='ParentExpression'){				
					var fa=new ParentExpression();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Closure'){				
					var fa=new Closure();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Property'){				
					var fa=new Property();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Level'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Closure----------------------------------------------------
/**
 * Specifies the transitive closure of a parent-child hierarchy.
 * Optional, but recommended for better performance.
 * The closure is provided as a set of (parent/child) pairs:
 * since it is the transitive closure these are actually (ancestor/descendant) pairs.
 */
	Closure = function(){
		this.closuretables=[];
		this.parentColumn='';
		this.childColumn='';
		this.name='Closure';
	}
	Closure.prototype.isCanAdd=function(objname){
		var objnames = ["Table"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Closure.prototype.getObjAttributes=function(obj){
		return { "父列":obj.getParentColumn(),//parentColumn
				  "子列":obj.getChildColumn()//childColumn
				};
	}
	Closure.prototype.isHaveItems=function(){
		return true;
	}
	Closure.prototype.getObjName=function(){
		return "Closure";
	}
	Closure.prototype.getObjCnName=function(){
		return "Closure";
	}
	Closure.prototype.getObjIcon=function(){
		return "/themes/icon/database/ExportData.gif";
	}
	
	Closure.prototype.addObjItems=function(closuretables){
		this.closuretables.push(closuretables);
	}
	Closure.prototype.getObjItems=function(){
		return this.closuretables;
	}
	Closure.prototype.setName=function(name){
		this.name=name;	
	}
	Closure.prototype.getName=function(){
		return this.name;
	}
	Closure.prototype.setParentColumne=function(parentColumn){
		this.parentColumn=parentColumn;	
	}
	Closure.prototype.getParentColumn=function(){
		return this.parentColumn;
	}
	Closure.prototype.setChildColumn=function(childColumn){	
		this.childColumn=childColumn;
	}
	Closure.prototype.getChildColumn=function(){
		return this.childColumn;
	}
	
	Closure.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Closure  ');
		if(this.parentColumn!=null){
			str.push(' parentColumn="',this.parentColumn);
		}
		if(this.childColumn!=null){
			str.push('" childColumn="',this.childColumn);
		}
		str.push('">');
		var _closuretables = this.closuretables;
		if (_closuretables&&_closuretables.length>0) {           
			for(var i=0;i<_closuretables.length;i++){
				 str.push(_closuretables[i].toXML());
			}			
        }
		str.push('\n\r </Closure>');
		return str.join('');
	}

	Closure.prototype.init=function(closureElement){
		var parentColumn = closureElement.attributes.getNamedItem("parentColumn");
		if (parentColumn != null){
			this.setParentColumn(parentColumn.value);
		}
		var childColumn = closureElement.attributes.getNamedItem("childColumn");
		if (childColumn != null){
			this.setChildColumn(childColumn.value);
		}
		var allElement=closureElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Table'){				
					var fa=new Table();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Closure'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Property----------------------------------------------------
/**
 * Member property.
 */
	Property = function(){
		this.name='';
		this.caption='';
		this.description='';
		this.dependsOnLevelValue='false';		
		this.column='';  // optional attribute
		/** Allowable values for {@link #datatype}. */
		this.type_values = ["String", "Numeric", "Integer", "Boolean", "Date", "Time", "Timestamp"];
		this.type='';  // optional attribute
		this.formatter='';  // optional attribute
	}
	Property.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Property.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "标题":obj.getCaption(),//caption
				  "描述":obj.getDescription(),//description
				  "列":obj.getColumn(),//column
				  "类型":obj.getType(),//type
				  "格式化":obj.getFormatter()//formatter
				};
	}
	Property.prototype.isHaveItems=function(){
		return false;
	}
	Property.prototype.getObjName=function(){
		return "Property";
	}
	Property.prototype.getObjCnName=function(){
		return "属性";
	}
	Property.prototype.getObjIcon=function(){
		return "/themes/icon/database/configs.gif";
	}
	Property.prototype.setName=function(name){
		this.name=name;	
	}
	Property.prototype.getName=function(){
		return this.name;
	}
	Property.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	Property.prototype.getCaption=function(){
		return this.caption;
	}
	Property.prototype.setDescription=function(description){
		this.description=description;
	}
	Property.prototype.getDescription=function(){
		return this.description;
	}
	Property.prototype.setDependsOnLevelValue=function(dependsOnLevelValue){
		this.dependsOnLevelValue=dependsOnLevelValue;
	}
	Property.prototype.getDependsOnLevelValue=function(){
		return this.dependsOnLevelValue;
	}
	Property.prototype.setColumn=function(column){
		this.column=column;
	}
	Property.prototype.getColumn=function(){
		return this.column;
	}
	Property.prototype.setType=function(type){
		this.type=type;
	}
	Property.prototype.getType=function(){
		return this.type;
	}
	Property.prototype.setFormatter=function(formatter){
		this.formatter=formatter;
	}
	Property.prototype.getFormatter=function(){
		return this.formatter;
	}
	
	Property.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Property  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.dependsOnLevelValue!=null){
			str.push('" dependsOnLevelValue="',this.dependsOnLevelValue);
		}
		if(this.column!=null){
			str.push('" column="',this.column);
		}
		if(this.type!=null){
			str.push('" type="',this.type);
		}
		if(this.formatter!=null){
			str.push('" formatter="',this.formatter);
		}
		str.push('">');
		str.push('\n\r </Property>');
		return str.join('');
	}

	Property.prototype.init=function(propertyItemsElement){
		var name = propertyItemsElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Property');
		}
		var caption = propertyItemsElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = propertyItemsElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var dependsOnLevelValue = propertyItemsElement.attributes.getNamedItem("dependsOnLevelValue");
		if (dependsOnLevelValue != null){
			this.setDependsOnLevelValue(dependsOnLevelValue.value);
		}else{
			this.setDependsOnLevelValue(false);
		}
		var column = propertyItemsElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		var type = propertyItemsElement.attributes.getNamedItem("type");
		if (type != null){
			this.type(type.value);
		}
		var formatter = propertyItemsElement.attributes.getNamedItem("formatter");
		if (formatter != null){
			this.setFormatter(formatter.value);
		}
	}

//-----------------------------------Measure----------------------------------------------------

	Measure = function(){
		this.measureitems=[];
		this.name='';
		this.caption='';
		this.description='';
		this.formatString='';;
		this.visible='true';		
		this.column='';  // optional attribute
		/** Allowable values for {@link #datatype}. */
		this.datatype_values = ["String", "Numeric", "Integer", "Boolean", "Date", "Time", "Timestamp"];
		this.datatype='';  // optional attribute
		/** Allowable values for {@link #aggregator}. */
		this.aggregator_values = ["sum", "count", "min", "max", "avg", "distinct count", "distinct-count"];
		this.aggregator='';  // required attribute
		this.formatter='';  // optional attribute
	}
	Measure.prototype.isCanAdd=function(objname){
		var objnames = ["MeasureExpression","CalculatedMemberProperty","Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Measure.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "标题":obj.getCaption(),//caption
				  "描述":obj.getDescription(),//description
				  "列":obj.getColumn(),//column
				  "可见":obj.getVisible(),//visible
				  "格式化":obj.getFormatter(),//formatter
				  "数据类型":obj.getDatatype(),//datatype
				  "聚合":obj.getAggregator(),//aggregator
				  "格式字符串":obj.getFormatString()//formatString
				};
	}
	Measure.prototype.isHaveItems=function(){
		return true;
	}
	Measure.prototype.getObjName=function(){
		return "Measure";
	}
	Measure.prototype.getObjCnName=function(){
		return "度量值";
	}
	Measure.prototype.getObjIcon=function(){
		return "/themes/icon/database/clear.gif";
	}
	Measure.prototype.addObjItems=function(measureitems){
		this.measureitems.push(measureitems);
	}
	Measure.prototype.getObjItems=function(){
		return this.measureitems;
	}
	Measure.prototype.setName=function(name){
		this.name=name;	
	}
	Measure.prototype.getName=function(){
		return this.name;
	}
	Measure.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	Measure.prototype.getCaption=function(){
		return this.caption;
	}
	Measure.prototype.setDescription=function(description){
		this.description=description;
	}
	Measure.prototype.getDescription=function(){
		return this.description;
	}
	Measure.prototype.setFormatString=function(formatString){
		this.formatString=formatString;
	}
	Measure.prototype.getFormatString=function(){
		return this.formatString;
	}
	Measure.prototype.setVisible=function(visible){
		this.visible=visible;
	}
	Measure.prototype.getVisible=function(){
		return this.visible;
	}
	Measure.prototype.setColumn=function(column){
		this.column=column;
	}
	Measure.prototype.getColumn=function(){
		return this.column;
	}
	Measure.prototype.setDatatype=function(datatype){
		this.datatype=datatype;
	}
	Measure.prototype.getDatatype=function(){
		return this.datatype;
	}
	Measure.prototype.setAggregator=function(aggregator){
		this.aggregator=aggregator;
	}
	Measure.prototype.getAggregator=function(){
		return this.aggregator;
	}
	Measure.prototype.setFormatter=function(formatter){
		this.formatter=formatter;
	}
	Measure.prototype.getFormatter=function(){
		return this.formatter;
	}
	
	Measure.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<Measure  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.formatString!=null){
			str.push('" formatString="',this.formatString);
		}
		if(this.visible!=null){
			str.push('" visible="',this.visible);
		}
		if(this.column!=null){
			str.push('" column="',this.column);
		}
		if(this.datatype!=null){
			str.push('" datatype="',this.datatype);
		}
		if(this.aggregator!=null){
			str.push('" aggregator="',this.aggregator);
		}
		if(this.formatter!=null){
			str.push('" formatter="',this.formatter);
		}
		str.push('">');
		var _measureitems = this.measureitems;
		if (_measureitems&&_measureitems.length>0) {           
			for(var i=0;i<_measureitems.length;i++){
				 str.push(_measureitems[i].toXML());
			}			
        }
		str.push('\n\r </Measure>');
		return str.join('');
	}

	Measure.prototype.init=function(measureItemsElement){
		var name = measureItemsElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Measure');
		}
		var caption = measureItemsElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = measureItemsElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var formatString = measureItemsElement.attributes.getNamedItem("formatString");
		if (formatString != null){
			this.setFormatString(formatString.value);
		}
		var visible = measureItemsElement.attributes.getNamedItem("visible");
		if (visible != null){
			this.setVisible(visible.value);
		}else{
			this.setVisible("true");
		}
		var column = measureItemsElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		var datatype = measureItemsElement.attributes.getNamedItem("datatype");
		if (datatype != null){
			this.setDatatype(datatype.value);
		}
		var aggregator = measureItemsElement.attributes.getNamedItem("aggregator");
		if (aggregator != null){
			this.setAggregator(aggregator.value);
		}
		var formatter = measureItemsElement.attributes.getNamedItem("formatter");
		if (formatter != null){
			this.setFormatter(formatter.value);
		}
		var allElement=measureItemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='MeasureExpression'){				
					var fa=new MeasureExpression();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='CalculatedMemberProperty'){				
					var fa=new CalculatedMemberProperty();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Measure'){
					this.init(itemElement);
			  }
		}
	}


//-----------------------------------CalculatedMember----------------------------------------------------

	CalculatedMember = function(){
		this.calculatedmembertitems=[];
		this.name='';
		this.caption='';
		this.description='';
		this.formula='';
		this.formatString='';
		this.dimension='';
		this.visible='true';
	}
	CalculatedMember.prototype.isCanAdd=function(objname){
		var objnames = ["Annotations","Formula","CalculatedMemberProperty"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	CalculatedMember.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "标题":obj.getCaption(),//caption
				  "描述":obj.getDescription(),//description
				  "维度":obj.getDimension(),//dimension
				  "可见":obj.getVisible(),//visible
				  "公式":obj.getFormula(),//formula
				  "格式字符串":obj.getFormatString()//formatString
				};
	}
	CalculatedMember.prototype.isHaveItems=function(){
		return true;
	}
	CalculatedMember.prototype.getObjName=function(){
		return "CalculatedMember";
	}
	CalculatedMember.prototype.getObjCnName=function(){
		return "计算成员";
	}
	CalculatedMember.prototype.getObjIcon=function(){
		return "";
	}
	CalculatedMember.prototype.addObjItems=function(calculatedmembertitems){
		this.calculatedmembertitems.push(calculatedmembertitems);
	}
	CalculatedMember.prototype.getObjItems=function(){
		return this.calculatedmembertitems;
	}
	CalculatedMember.prototype.setName=function(name){
		this.name=name;	
	}
	CalculatedMember.prototype.getName=function(){
		return this.name;
	}
	CalculatedMember.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	CalculatedMember.prototype.getCaption=function(){
		return this.caption;
	}
	CalculatedMember.prototype.setDescription=function(description){
		this.description=description;
	}
	CalculatedMember.prototype.getDescription=function(){
		return this.description;
	}
	CalculatedMember.prototype.setFormula=function(formula){
		this.formula=formula;
	}
	CalculatedMember.prototype.getFormula=function(){
		return this.formula;
	}
	CalculatedMember.prototype.setFormatString=function(formatString){
		this.formatString=formatString;
	}
	CalculatedMember.prototype.getFormatString=function(){
		return this.formatString;
	}
	CalculatedMember.prototype.setDimension=function(dimension){
		this.dimension=dimension;
	}
	CalculatedMember.prototype.getDimension=function(){
		return this.dimension;
	}
	CalculatedMember.prototype.setVisible=function(visible){
		this.visible=visible;
	}
	CalculatedMember.prototype.getVisible=function(){
		return this.visible;
	}
	
	CalculatedMember.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<CalculatedMember  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.formula!=null){
			str.push('" formula="',this.formula);
		}
		if(this.formatString!=null){
			str.push('" formatString="',this.formatString);
		}
		if(this.dimension!=null){
			str.push('" dimension="',this.dimension);
		}
		if(this.visible!=null){
			str.push('" visible="',this.visible);
		}
		str.push('">');
		var _calculatedmembertitems = this.calculatedmembertitems;
		if (_calculatedmembertitems&&_calculatedmembertitems.length>0) {           
			for(var i=0;i<_calculatedmembertitems.length;i++){
				 str.push(_calculatedmembertitems[i].toXML());
			}			
        }
		str.push('\n\r </CalculatedMember>');
		return str.join('');
	}

	CalculatedMember.prototype.init=function(calculatedMemberItemsElement){
		var name = calculatedMemberItemsElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Calculated Member');
		}
		var caption = calculatedMemberItemsElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = calculatedMemberItemsElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var formula = calculatedMemberItemsElement.attributes.getNamedItem("formula");
		if (formula != null){
			this.setFormula(formula.value);
		}
		var formatString = calculatedMemberItemsElement.attributes.getNamedItem("formatString");
		if (formatString != null){
			this.setFormatString(formatString.value);
		}
		var dimension = calculatedMemberItemsElement.attributes.getNamedItem("dimension");
		if (dimension != null){
			this.setDimension(dimension.value);
		}
		var visible = calculatedMemberItemsElement.attributes.getNamedItem("visible");
		if (visible != null){
			this.setVisible(visible.value);
		}else{
			this.setVisible("true");
		}
		var allElement=calculatedMemberItemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='CalculatedMemberProperty'){				
					var fa=new CalculatedMemberProperty();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Formula'){				
					var fa=new Formula();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='CalculatedMember'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------CalculatedMemberProperty----------------------------------------------------
/**
 * Property of a calculated member defined against a cube.
 * It must have either an expression or a value.
 */
	CalculatedMemberProperty = function(){
		this.name='';
		this.caption='';
		this.description='';
		this.expression='';
		this.value='';
	}
	CalculatedMemberProperty.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	CalculatedMemberProperty.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),//name
				  "标题":obj.getCaption(),//caption
				  "描述":obj.getDescription(),//description
				  "表达式":obj.getExpression(),//expression
				  "值":obj.getValue()//value
				};
	}
	CalculatedMemberProperty.prototype.isHaveItems=function(){
		return false;
	}
	CalculatedMemberProperty.prototype.getObjName=function(){
		return "CalculatedMemberProperty";
	}
	CalculatedMemberProperty.prototype.getObjCnName=function(){
		return "计算成员属性";
	}
	CalculatedMemberProperty.prototype.getObjIcon=function(){
		return "/themes/icon/database/app_obj.gif";
	}

	CalculatedMemberProperty.prototype.setName=function(name){
		this.name=name;
	}
	CalculatedMemberProperty.prototype.getName=function(){
		return this.name;
	}
	CalculatedMemberProperty.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	CalculatedMemberProperty.prototype.getCaption=function(){
		return this.caption;
	}
	CalculatedMemberProperty.prototype.setDescription=function(description){
		this.description=description;
	}
	CalculatedMemberProperty.prototype.getDescription=function(){
		return this.description;
	}
	CalculatedMemberProperty.prototype.setExpression=function(expression){
		this.expression=expression;
	}
	CalculatedMemberProperty.prototype.getExpression=function(){
		return this.expression;
	}
	CalculatedMemberProperty.prototype.setValue=function(value){
		this.value=value;
	}
	CalculatedMemberProperty.prototype.getValue=function(){
		return this.value;
	}

	CalculatedMemberProperty.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<CalculatedMemberProperty  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.expression!=null){
			str.push('" expression="',this.expression);
		}
		if(this.value!=null){
			str.push('" value="',this.value);
		}
		str.push('">');	
		str.push('\n\r </CalculatedMemberProperty>');
		return str.join('');
	}

	CalculatedMemberProperty.prototype.init=function(calculatedMemberPropertyElement){
		var name = calculatedMemberPropertyElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Property');
		}
		var caption = calculatedMemberPropertyElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = calculatedMemberPropertyElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var expression = calculatedMemberPropertyElement.attributes.getNamedItem("expression");
		if (expression != null){
			this.setDescription(expression.value);
		}
		var value = calculatedMemberPropertyElement.attributes.getNamedItem("value");
		if (value != null){
			this.setDescription(value.value);
		}
	}

//-----------------------------------NamedSet----------------------------------------------------
/**
 * <p>Defines a named set which can be used in queries in the
 * same way as a set defined using a WITH SET clause.</p>
 * <p>A named set can be defined against a particular cube,
 * or can be global to a schema. If it is defined against a
 * cube, it is only available to queries which use that cube.</p>
 * <p>A named set defined against a cube is not inherited by
 * a virtual cubes defined against that cube. (But you can
 * define a named set against a virtual cube.)</p>
 * <p>A named set defined against a schema is available in
 * all cubes and virtual cubes in that schema. However, it is
 * only valid if the cube contains dimensions with the names
 * required to make the formula valid.</p>
 */
	NamedSet = function(){
		this.namedsetitems=[];
		this.name='';
		this.caption='';
		this.description='';
		this.formula='';
	}
	NamedSet.prototype.isCanAdd=function(objname){
		var objnames = ["Formula","Annotations"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	NamedSet.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),
				  "标题":obj.getCaption(),
				  "描述":obj.getDescription(),
				  "公式":obj.getFormula()
				};
	}
	NamedSet.prototype.isHaveItems=function(){
		return true;
	}
	NamedSet.prototype.getObjName=function(){
		return "NamedSet";
	}
	NamedSet.prototype.getObjCnName=function(){
		return "命名集";
	}
	NamedSet.prototype.getObjIcon=function(){
		return "";
	}
	
	NamedSet.prototype.addObjItems=function(namedsetitems){
		this.namedsetitems.push(namedsetitems);
	}
	NamedSet.prototype.getObjItems=function(){
		return this.namedsetitems;
	}
	NamedSet.prototype.setName=function(name){
		this.name=name;
		if(name==null){
			this.name='New Named Set';
		}	
	}
	NamedSet.prototype.getName=function(){
		return this.name;
	}
	NamedSet.prototype.setCaption=function(caption){	
		this.caption=caption;
	}
	NamedSet.prototype.getCaption=function(){
		return this.caption;
	}
	NamedSet.prototype.setDescription=function(description){
		this.description=description;
	}
	NamedSet.prototype.getDescription=function(){
		return this.description;
	}
	NamedSet.prototype.setFormula=function(formula){
		this.formula=formula;
	}
	NamedSet.prototype.getFormula=function(){
		return this.formula;
	}	
	
	NamedSet.prototype.toXML=function(){
		var str=[];
		str.push('\n\r	<NamedSet  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.caption!=null){
			str.push('" caption="',this.caption);
		}
		if(this.description!=null){
			str.push('" description="',this.description);
		}
		if(this.formula!=null){
			str.push('" formula="',this.formula);
		}
		str.push('">');
		var _namedsetitems = this.namedsetitems;
		if (_namedsetitems&&_namedsetitems.length>0) {           
			for(var i=0;i<_namedsetitems.length;i++){
				 str.push(_namedsetitems[i].toXML());
			}			
        }
		str.push('\n\r </NamedSet>');
		return str.join('');
	}

	NamedSet.prototype.init=function(namedsetitemsElement){
		var name = namedsetitemsElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName('New Named Set');
		}
		var caption = namedsetitemsElement.attributes.getNamedItem("caption");
		if (caption != null){
			this.setCaption(caption.value);
		}
		var description = namedsetitemsElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var formula = namedsetitemsElement.attributes.getNamedItem("formula");
		if (formula != null){
			this.setFormula(formula.value);
		}
		var allElement=namedsetitemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Annotations'){				
					var fa=new Annotations();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Formula'){				
					var fa=new Formula();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='NamedSet'){
					this.init(itemElement);
			  }
		}
	}


	
//-----------------------------------Formula----------------------------------------------------

	Formula = function(){
		this.cdata='';	// All text goes here
		this.name='Formula';
	}
	Formula.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Formula.prototype.getObjAttributes=function(obj){
		return { "内容":obj.getCdata()
				};
	}
	Formula.prototype.isHaveItems=function(){
		return false;
	}
	Formula.prototype.getObjName=function(){
		return "Formula";
	}
	Formula.prototype.getObjCnName=function(){
		return "公式";
	}
	Formula.prototype.getObjIcon=function(){
		return "";
	}
	
	Formula.prototype.setCdata=function(cdata){
		this.cdata=cdata;
	}
	Formula.prototype.getCdata=function(){
		return this.cdata;
	}
	Formula.prototype.setName=function(name){
		this.name=name;
	}
	Formula.prototype.getName=function(){
		return this.name;
	}
	
	Formula.prototype.toXML=function(){
		var str=[];
		str.push('\n\r  <Formula>');				
		str.push('\n\r <![CDA');
		str.push('TA[');
		str.push(this.cdata);
		str.push(']');
		str.push(']>');	
		str.push('\n\r </Formula>');
		return str.join('');
	}

	Formula.prototype.init=function(formulaElement){
		var	cdata =formulaElement.firstChild.data;
		if (cdata != null){
			this.setCdata(cdata.value);
		}
	}

	
//-----------------------------------MemberReaderParameter----------------------------------------------------

	MemberReaderParameter = function(){
		this.name='';  // required attribute
		this.value='';  // required attribute
	}
	MemberReaderParameter.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	MemberReaderParameter.prototype.getObjAttributes=function(obj){
		return { "名称":obj.getName(),
				  "值":obj.getValue()
				};
	}
	MemberReaderParameter.prototype.isHaveItems=function(){
		return false;
	}
	MemberReaderParameter.prototype.getObjName=function(){
		return "MemberReaderParameter";
	}
	MemberReaderParameter.prototype.getObjCnName=function(){
		return "MemberReaderParameter";
	}
	MemberReaderParameter.prototype.getObjIcon=function(){
		return "";
	}
	MemberReaderParameter.prototype.setName=function(name){
		this.name=name;
	}
	MemberReaderParameter.prototype.getName=function(){
		return this.name;
	}
	MemberReaderParameter.prototype.setValue=function(value){
		this.value=value;
	}
	MemberReaderParameter.prototype.getValue=function(){
		return this.value;
	}
	
	MemberReaderParameter.prototype.toXML = function(){
		var str=[];	
		str.push('\n\r	<MemberReaderParameter  ');
		if(this.name!=null){
			str.push('name="',this.name);
		}
		if(this.value!=null){
			str.push('" value="',this.value);
		}
		str.push('">');
		
		str.push('\n\r	</MemberReaderParameter>');
		return str.join('');
	}
	
	MemberReaderParameter.prototype.init=function(memberReaderParameterElement){
		var name = memberReaderParameterElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var	value =memberReaderParameterElement.attributes.getNamedItem("value");
		if (value != null){
			this.setValue(value.value);
		}
		
	}

//-----------------------------------View----------------------------------------------------
/**
 * A collection of SQL statements, one per dialect.
 */
	View = function(){
		this.viewitems=[];
		this.alias='';
		this.name='View';
	}
	View.prototype.isCanAdd=function(objname){
		var objnames = ["SQL"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	View.prototype.getObjAttributes=function(obj){
		return { "别名":obj.getAlias()
				};
	}
	View.prototype.isHaveItems=function(){
		return true;
	}
	View.prototype.getObjName=function(){
		return "View";
	}
	View.prototype.getObjCnName=function(){
		return "视图";
	}
	View.prototype.getObjIcon=function(){
		return "/themes/icon/database/overview.gif";
	}
	View.prototype.setName=function(name){
		this.name=name;
	}
	View.prototype.getName=function(){
		return this.name;
	}
	View.prototype.setAlias=function(alias){
		this.alias=alias;
	}
	View.prototype.getAlias=function(){
		return this.alias;
	}
	View.prototype.addObjItems=function(viewitems){
		this.viewitems.push(viewitems)
	}
	View.prototype.getObjItems=function(){
		return this.viewitems;
	}
	
	View.prototype.toXML=function(){
		var str=[];
		var _viewitems=this.viewitems;	

		if (_viewitems&&_viewitems.length>0) {
            str.push('\n\r    <View>');
            
			for(var i=0;i<_viewitems.length;i++){
				 str.push(_viewitems[i].toXML());
			}
			str.push('\n\r    </View>');
        }
		return str.join('');
	}
	
	View.prototype.init=function(viewItemsElement){	
		var allSqlElement=viewItemsElement.childNodes;
		for(var j=0;j<allSqlElement.length;j++){
			var sqlElement=allSqlElement[j];
			  if(sqlElement.nodeName=='SQL'){				
					var sq=new SQL();
					sq.init(sqlElement);
					this.addObjItems(sq);
			  }
			  if(sqlElement.nodeName=='View'){
					this.init(sqlElement);
			  }
		}
	}	
	
//-----------------------------------Join----------------------------------------------------

	Join = function(){
		this.joinitems=[];
		this.leftAlias='';
		this.leftKey='';
		this.rightAlias='';
		this.rightKey='';
		this.name='Join';
	}
	Join.prototype.isCanAdd=function(objname){
		var objnames = ["Table"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Join.prototype.getObjAttributes=function(obj){
		return { "左别名":obj.getLeftAlias(),
				  "左键":obj.getLeftKey(),
				  "右别名":obj.getRightAlias(),
				  "右键":obj.getRightKey()
				};
	}
	Join.prototype.isHaveItems=function(){
		return true;
	}
	Join.prototype.getObjName=function(){
		return "Join";
	}
	Join.prototype.getObjCnName=function(){
		return "连接";
	}
	Join.prototype.getObjIcon=function(){
		return "/themes/icon/database/copy_edit.gif";
	}
	
	Join.prototype.addObjItems=function(joinitems){
		this.joinitems.push(joinitems);
	}
	Join.prototype.getObjItems=function(){
		return this.joinitems;
	}
	Join.prototype.setName=function(name){
		this.name=name;	
	}
	Join.prototype.getName=function(){
		return this.name;
	}
	Join.prototype.setLeftAlias=function(leftAlias){
		this.leftAlias=leftAlias;
		if(leftAlias==null){
			this.leftAlias='';
		}	
	}
	Join.prototype.getLeftAlias=function(){
		return this.leftAlias;
	}
	Join.prototype.setLeftKey=function(leftKey){	
		this.leftKey=leftKey;
		if(leftKey==null){
			this.leftKey='';
		}
	}
	Join.prototype.getLeftKey=function(){
		return this.leftKey;
	}
	Join.prototype.setRightAlias=function(rightAlias){
		this.rightAlias=rightAlias;
		if(rightAlias==null){
			this.rightAlias='';
		}
	}
	Join.prototype.getRightAlias=function(){
		return this.rightAlias;
	}
	Join.prototype.setRightKey=function(rightKey){
		this.rightKey=rightKey;
		if(rightKey==null){
			this.rightKey='';
		}
	}
	Join.prototype.getRightKey=function(){
		return this.rightKey;
	}
	Join.prototype.toXML=function(){
		var str=[];
		var _joinitems = this.joinitems;
		str.push('\n\r	<Join  ');
		if(this.leftAlias!=null){
			str.push(' leftAlias="',this.leftAlias);
		}
		if(this.leftKey!=null){
			str.push('" leftKey="',this.leftKey);
		}
		if(this.rightAlias!=null){
			str.push('" rightAlias="',this.rightAlias);
		}
		if(this.rightKey!=null){
			str.push('" rightKey="',this.rightKey);
		}
		str.push('">');
		if (_joinitems&&_joinitems.length>0) {           
			for(var i=0;i<_joinitems.length;i++){
				 str.push(_joinitems[i].toXML());
			}			
        }
		str.push('\n\r </Join>');
		return str.join('');
	}

	Join.prototype.init=function(joinitemsElement){
		var leftAlias = joinitemsElement.attributes.getNamedItem("leftAlias");
		if (leftAlias != null){
			this.setLeftAlias(leftAlias.value);
		}
		var leftKey = joinitemsElement.attributes.getNamedItem("leftKey");
		if (leftKey != null){
			this.setLeftKey(leftKey.value);
		}
		var rightAlias = joinitemsElement.attributes.getNamedItem("rightAlias");
		if (rightAlias != null){
			this.setRightAlias(rightAlias.value);
		}
		var rightKey = joinitemsElement.attributes.getNamedItem("rightKey");
		if (rightKey != null){
			this.setRightKey(rightKey.value);
		}
		var allElement=joinitemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Table'){				
					var fa=new Table();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Join'){
					this.init(itemElement);
			  }
		}
	}	
	
//-----------------------------------Table----------------------------------------------------

	Table = function(){
		this.tableitems=[];
		this.alias='';
		this.name='';
		this.schema='';
	}
	Table.prototype.isCanAdd=function(objname){
		var objnames = ["AggExclude","AggName","AggPattern"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Table.prototype.getObjAttributes=function(obj){
		return {
			"方案":obj.getSchema(),
			"名称":obj.getName(),
			"别名":obj.getAlias()
		}
	}
	Table.prototype.isHaveItems=function(){
		return true;
	}
	Table.prototype.getObjName=function(){
		return "Table";
	}
	Table.prototype.getObjCnName=function(){
		return "事实表";
	}
	Table.prototype.getObjIcon=function(){
		return "/themes/icon/database/table.gif";
	}
	
	Table.prototype.addObjItems=function(tableitems){
		this.tableitems.push(tableitems);
	}
	Table.prototype.getObjItems=function(){
		return this.tableitems;
	}
	Table.prototype.setAlias=function(alias){
		this.alias=alias;
	}
	Table.prototype.getAlias=function(){
		return this.alias;
	}
	Table.prototype.setName=function(name){
		this.name=name;
	}
	Table.prototype.getName=function(){
		return this.name;
	}
	Table.prototype.setSchema=function(schema){
		this.schema=schema;
	}
	Table.prototype.getSchema=function(){
		return this.schema;
	}
	
	Table.prototype.find=function(alias){
		if(this.alias==alias){
			return true;
		}else{
			return false;
		}
	}
	
	Table.prototype.toXML=function(){
		var str=[];
		var _tableitems = this.tableitems;
		str.push('\n\r	<Table  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}else{
			str.push(' name="Table');
		}
		if(this.schema!=null){
			str.push('" schema="',this.schema);
		}
		if(this.alias!=null){
			str.push('" alias="',this.alias);
		}
		str.push('">');
		if (_tableitems&&_tableitems.length>0) {           
			for(var i=0;i<_tableitems.length;i++){
				 str.push(_tableitems[i].toXML());
			}			
        }
		str.push('\n\r </Table>');
		return str.join('');
	}

	Table.prototype.init=function(tableitemsElement){
		var name = tableitemsElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var schema = tableitemsElement.attributes.getNamedItem("schema");
		if (schema != null){
			this.setSchema(schema.value);
		}
		var alias = tableitemsElement.attributes.getNamedItem("alias");
		if (alias != null){
			this.setAliase(alias.value);
		}
		var allElement=tableitemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			
			  //filter
			  if(itemElement.nodeName=='SQL'){				
					var fa=new SQL();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggExclude'){				
					var fa=new AggExclude();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggTable'){				
					var fa=new AggTable();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggName'){				
					var fa=new AggName();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggPattern'){				
					var fa=new AggPattern();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Hint'){				
					var fa=new Hint();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Table'){
					this.init(itemElement);
			  }
		}
	}	

//-----------------------------------Hint----------------------------------------------------
/**
 * Dialect-specific table optimization hints.
 */
	Hint = function(){
		this.type='';  // attribute default: generic
		this.cdata='';	// All text goes here
		this.name='Hint';
	}
	Hint.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Hint.prototype.getObjAttributes=function(obj){
		return { "类型":obj.getType(),
				  "内容":obj.getCdata()
				};
	}
	Hint.prototype.isHaveItems=function(){
		return false;
	}
	Hint.prototype.getObjName=function(){
		return "Hint";
	}
	Hint.prototype.getObjCnName=function(){
		return "Hint";
	}
	Hint.prototype.getObjIcon=function(){
		return "";
	}
	
	Hint.prototype.setType=function(type){
		this.type=type;
	}
	Hint.prototype.getType=function(){
		return this.type;
	}
	Hint.prototype.setName=function(name){
		this.name=name;
	}
	Hint.prototype.getName=function(){
		return this.name;
	}
	Hint.prototype.setCdata=function(cdata){
		this.cdata=cdata;
	}
	Hint.prototype.getCdata=function(){
		return this.cdata;
	}
	
	Hint.prototype.toXML=function(){
		var str=[];
		str.push('\n\r  <Hint type="',this.type,'">');				
		str.push('\n\r <![CDA');
		str.push('TA[');
		str.push(this.cdata);
		str.push(']');
		str.push(']>');	
		str.push('\n\r </Hint>');
		return str.join('');
	}

	Hint.prototype.init=function(hintElement){
		var type = hintElement.attributes.getNamedItem("type");
		if (type != null){
			this.setType(type.value);
		}
		var	cdata =hintElement.firstChild.data;
		if (cdata != null){
			this.setCdata(cdata.value);
		}
	}	

//-----------------------------------InlineTable----------------------------------------------------
/**
 * Holder for an array of ColumnDef elements
 */
	InlineTable = function(){
		this.items=[];
		this.alias='';
		this.name='InlineTable';
	}
	InlineTable.prototype.isCanAdd=function(objname){
		var objnames = ["ColumnDefs","Rows"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	InlineTable.prototype.getObjAttributes=function(obj){
		return { 
				  "别名":obj.getAlias()
				};
	}
	InlineTable.prototype.isHaveItems=function(){
		return true;
	}
	InlineTable.prototype.getObjName=function(){
		return "InlineTable";
	}
	InlineTable.prototype.getObjCnName=function(){
		return "内联表";
	}
	InlineTable.prototype.getObjIcon=function(){
		return "/themes/icon/database/index.gif";
	}
	
	InlineTable.prototype.addObjItems=function(items){
		this.items.push(items);
	}
	InlineTable.prototype.getObjItems=function(){
		return this.items;
	}
	InlineTable.prototype.setName=function(name){
		this.name=name;
	}
	InlineTable.prototype.getName=function(){
		return this.name;
	}
	InlineTable.prototype.setAlias=function(alias){
		this.alias=alias;
	}
	InlineTable.prototype.getAlias=function(){
		return this.alias;
	}
	
	InlineTable.prototype.find=function(alias){
		if(this.alias==alias){
			return true;
		}else{
			return false;
		}
	}
	
	InlineTable.prototype.toXML=function(){
		var str=[];
		var _items = this.items;
		str.push('\n\r  <InlineTable  alias="',this.alias,'">');				
		if (_items&&_items.length>0) {           
			for(var i=0;i<_items.length;i++){
				 str.push(_items[i].toXML());
			}			
        }
		str.push('\n\r </InlineTable>');
		return str.join('');
	}

	InlineTable.prototype.init=function(itemsElement){
		var allElement=itemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='ColumnDefs'){				
					var fa=new ColumnDefs();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Rows'){				
					var fa=new Rows();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='InlineTable'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------ColumnDefs----------------------------------------------------
/**
 * Holder for an array of ColumnDef elements
 */
	ColumnDefs = function(){
		this.columndefs=[];
		this.name='ColumnDefs';
	}
	ColumnDefs.prototype.isCanAdd=function(objname){
		var objnames = ["ColumnDef"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	ColumnDefs.prototype.getObjAttributes=function(obj){
		return {};
	}
	ColumnDefs.prototype.isHaveItems=function(){
		return true;
	}
	ColumnDefs.prototype.getObjName=function(){
		return "ColumnDefs";
	}
	ColumnDefs.prototype.getObjCnName=function(){
		return "ColumnDefs";
	}
	ColumnDefs.prototype.getObjIcon=function(){
		return "";
	}
	
	ColumnDefs.prototype.addObjItems=function(columndefs){
		this.columndefs.push(columndefs);
	}
	ColumnDefs.prototype.getObjItems=function(){
		return this.columndefs;
	}
	ColumnDefs.prototype.setName=function(name){
		this.name=name;
	}
	ColumnDefs.prototype.getName=function(){
		return this.name;
	}
	ColumnDefs.prototype.toXML=function(){
		var str=[];
		var _columndefs = this.columndefs;
		str.push('\n\r  <ColumnDefs>');				
		if (_columndefs&&_columndefs.length>0) {           
			for(var i=0;i<_columndefs.length;i++){
				 str.push(_columndefs[i].toXML());
			}			
        }
		str.push('\n\r </ColumnDefs>');
		return str.join('');
	}

	ColumnDefs.prototype.init=function(columnDefsElement){
		var allElement=columnDefsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='ColumnDef'){				
					var fa=new ColumnDef();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='ColumnDefs'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------ColumnDef----------------------------------------------------
/**
 * Column definition for an inline table.
 */
	ColumnDef = function(){
		this.name='';  // required attribute
		this.type='';  // required attribute
	}
	ColumnDef.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	ColumnDef.prototype.getObjAttributes=function(obj){
		return {
			"名称":obj.getName(),
			"类型":obj.getType()
		};
	}
	ColumnDef.prototype.isHaveItems=function(){
		return false;
	}
	ColumnDef.prototype.getObjName=function(){
		return "ColumnDef";
	}
	ColumnDef.prototype.getObjCnName=function(){
		return "ColumnDef";
	}
	ColumnDef.prototype.getObjIcon=function(){
		return "";
	}
	ColumnDef.prototype.setName=function(name){
		this.name=name;
	}
	ColumnDef.prototype.getName=function(){
		return this.name;
	}
	ColumnDef.prototype.setType=function(type){
		this.type=type;
	}
	ColumnDef.prototype.getType=function(){
		return this.type;
	}
	
	ColumnDef.prototype.toXML = function(){
		var str=[];	
		str.push('\n\r	<ColumnDef  ');
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.type!=null){
			str.push('" type="',this.type);
		}
		str.push('">');
		
		str.push('\n\r	</ColumnDef>');
		return str.join('');
	}
	
	ColumnDef.prototype.init=function(columnDefElement){
		var name = columnDefElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var	type =columnDefElement.attributes.getNamedItem("type");
		if (type != null){
			this.setType(type.value);
		}
		
	}

//-----------------------------------Rows----------------------------------------------------
/**
 * Holder for an array of Row elements
 */
	Rows = function(){
		this.rows=[];  
		this.name='Rows';
	}
	Rows.prototype.isCanAdd=function(objname){
		var objnames = ["Row"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Rows.prototype.getObjAttributes=function(obj){
		return {};
	}
	Rows.prototype.isHaveItems=function(){
		return true;
	}
	Rows.prototype.getObjName=function(){
		return "Rows";
	}
	Rows.prototype.getObjCnName=function(){
		return "行的集合";
	}
	Rows.prototype.getObjIcon=function(){
		return "";
	}
	
	Rows.prototype.addObjItems=function(rows){
		this.rows.push(rows);
	}
	Rows.prototype.getObjItems=function(){
		return this.rows;
	}
	Rows.prototype.setName=function(name){
		this.name=name;
	}
	Rows.prototype.getName=function(){
		return this.name;
	}
	Rows.prototype.toXML=function(){
		var str=[];
		var _rows = this.rows;
		str.push('\n\r  <Rows>');				
		if (_rows&&_rows.length>0) {           
			for(var i=0;i<_rows.length;i++){
				 str.push(_rows[i].toXML());
			}			
        }
		str.push('\n\r </Rows>');
		return str.join('');
	}

	Rows.prototype.init=function(valuesElement){
		var allElement=valuesElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Row'){				
					var fa=new Row();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='Rows'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Row----------------------------------------------------
/**
 * Row definition for an inline table.
 * Must have one Column for each ColumnDef in the InlineTable.
 */
	Row = function(){
		this.values=[];
		this.name='Row';
	}
	Row.prototype.isCanAdd=function(objname){
		var objnames = ["Value"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Row.prototype.getObjAttributes=function(obj){
		return {};
	}
	Row.prototype.isHaveItems=function(){
		return true;
	}
	Row.prototype.getObjName=function(){
		return "Row";
	}
	Row.prototype.getObjCnName=function(){
		return "行";
	}
	Row.prototype.getObjIcon=function(){
		return "";
	}
	Row.prototype.addObjItems=function(values){
		this.values.push(values);
	}
	Row.prototype.getObjItems=function(){
		return this.values;
	}
	Row.prototype.setName=function(name){
		this.name=name;
	}
	Row.prototype.getName=function(){
		return this.name;
	}
	Row.prototype.toXML=function(){
		var str=[];
		var _values = this.values;
		str.push('\n\r  <Row>');				
		if (_values&&_values.length>0) {           
			for(var i=0;i<_values.length;i++){
				 str.push(_values[i].toXML());
			}			
        }
		str.push('\n\r </Row>');
		return str.join('');
	}

	Row.prototype.init=function(valuesElement){
		var allElement=valuesElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='Value'){				
					var fa=new Value();
					fa.init(itemElement);
					this.addObjItems()(fa);
			  }
			  if(itemElement.nodeName=='Row'){
					this.init(itemElement);
			  }
		}
	}

//-----------------------------------Value----------------------------------------------------
/**
 * Column value for an inline table.
 * The CDATA holds the value of the column.
 */
	Value = function(){

		this.column='';  
		this.cdata='';	// All text goes here
		this.name='Value';
	}
	Value.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Value.prototype.getObjAttributes=function(obj){
		return {};
	}
	Value.prototype.isHaveItems=function(){
		return false;
	}
	Value.prototype.getObjName=function(){
		return "Value";
	}
	Value.prototype.getObjCnName=function(){
		return "值";
	}
	Value.prototype.getObjIcon=function(){
		return "";
	}
	Value.prototype.setColumn=function(column){
		this.column=column;
	}
	Value.prototype.getColumn=function(){
		return this.column;
	}
	Value.prototype.setCdata=function(cdata){
		this.cdata=cdata;
	}
	Value.prototype.getCdata=function(){
		return this.cdata;
	}
	Value.prototype.setName=function(name){
		this.name=name;
	}
	Value.prototype.getName=function(){
		return this.name;
	}
	Value.prototype.toXML=function(){
		var str=[];
		str.push('\n\r  <Value column="',this.column,'">');				
		str.push('\n\r <![CDA');
		str.push('TA[');
		str.push(this.cdata);
		str.push(']');
		str.push(']>');	
		str.push('\n\r </Value>');
		return str.join('');
	}

	Value.prototype.init=function(valueElement){
		var column = valueElement.attributes.getNamedItem("column");
		if (column != null){
			this.setDialect(column.value);
		}
		var	cdata =valueElement.firstChild.data;
		if (cdata != null){
			this.setCdata(cdata.value);
		}
	}

//-----------------------------------AggTable----------------------------------------------------
/**
 * A definition of an aggregate table for a base fact table.
 * This aggregate table must be in the same schema as the
 * base fact table.
 */
	
	AggTable = function(){
		this.ignorecase='true';  // attribute default: true
		this.aggTableItems=[];
		this.name='AggTable';
	}
	AggTable.prototype.isCanAdd=function(objname){
		var objnames = ["AggFactCount","AggIgnoreColumn","AggForeignKey","AggMeasure","AggLevel"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggTable.prototype.getObjAttributes=function(obj){
		return {
			"忽略大小写":obj.getIgnorecase()
		};
	}
	AggTable.prototype.isHaveItems=function(){
		return true;
	}
	AggTable.prototype.setName=function(name){
		this.name=name;
	}
	AggTable.prototype.getName=function(){
		return this.name;
	}
	AggTable.prototype.getObjName=function(){
		return "AggTable";
	}
	AggTable.prototype.getObjCnName=function(){
		return "AggTable";
	}
	AggTable.prototype.getObjIcon=function(){
		return "";
	}
	AggTable.prototype.setIgnorecase=function(ignorecase){
		this.ignorecase=ignorecase;
	}
	AggTable.prototype.getIgnorecase=function(){
		return this.ignorecase;
	}
	AggTable.prototype.addObjItems=function(aggTableItems){
		this.aggTableItems.push(aggTableItems);
	}
	AggTable.prototype.getObjItems=function(){
		return this.aggTableItems;
	}
	
	AggTable.prototype.toXML=function(){
		var str=[];
		var _aggTableItems=this.aggTableItems;	
		str.push('\n\r    <AggTable ');
		if(this.ignorecase!=null){
			str.push('" ignorecase="',this.ignorecase);
		}
		str.push('">');
		if (_aggTableItems&&_aggTableItems.length>0) {           
			for(var i=0;i<_aggTableItems.length;i++){
				 str.push(_aggTableItems[i].toXML());
			}			
        }
        str.push('\n\r    </AggTable>');
		return str.join('');
	}
	
	AggTable.prototype.init=function(aggTableItemsElement){
		var	ignorecase =aggTableItemsElement.attributes.getNamedItem("ignorecase");
		if (ignorecase != null){
			this.setIgnorecase(ignorecase.value);
		}
		var allElement=aggTableItemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='AggFactCount'){				
					var fa=new AggFactCount();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggIgnoreColumn'){				
					var fa=new AggIgnoreColumn();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggForeignKey'){				
					var fa=new AggForeignKey();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggMeasure'){				
					var fa=new AggMeasure();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggLevel'){				
					var fa=new AggLevel();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggTable'){
					this.init(itemElement);
			  }
		}
	}
	
//-----------------------------------AggName----------------------------------------------------

	AggName = function(){
		this.name='';  // required attribute
		this.ignorecase='true';  // attribute default: true
		this.aggNameItems=[];
	}
	AggName.prototype.isCanAdd=function(objname){
		var objnames = ["AggFactCount","AggIgnoreColumn","AggForeignKey","AggMeasure","AggLevel"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggName.prototype.getObjAttributes=function(obj){
		return {
			"忽略大小写":obj.getIgnorecase(),
			"名称":obj.getName()
		};
	}
	AggName.prototype.isHaveItems=function(){
		return true;
	}
	AggName.prototype.getObjName=function(){
		return "AggName";
	}
	AggName.prototype.getObjCnName=function(){
		return "AggName";
	}
	AggName.prototype.getObjIcon=function(){
		return "";
	}
	AggName.prototype.setName=function(name){
		this.name=name;
	}
	AggName.prototype.getName=function(){
		return this.name;
	}
	AggName.prototype.setIgnorecase=function(ignorecase){
		this.ignorecase=ignorecase;
	}
	AggName.prototype.getIgnorecase=function(){
		return this.ignorecase;
	}
	AggName.prototype.addObjItems=function(aggNameItems){
		this.aggNameItems.push(aggNameItems);
	}
	AggName.prototype.getObjItems=function(){
		return this.aggNameItems;
	}
	
	AggName.prototype.toXML=function(){
		var str=[];
		var _aggNameItems=this.aggNameItems;	
		str.push('\n\r    <AggName ');
        if(this.name!=null){
			str.push(' name="',this.name);
		}
		if(this.ignorecase!=null){
			str.push('" ignorecase="',this.ignorecase);
		}
		str.push('">');
		if (_aggNameItems&&_aggNameItems.length>0) {           
			for(var i=0;i<_aggNameItems.length;i++){
				 str.push(_aggNameItems[i].toXML());
			}			
        }
        str.push('\n\r    </AggName>');
		return str.join('');
	}
	
	AggName.prototype.init=function(aggNameItemsElement){
		var	ignorecase =aggNameItemsElement.attributes.getNamedItem("ignorecase");
		if (ignorecase != null){
			this.setIgnorecase(ignorecase.value);
		}
		var	name =aggNameItemsElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var allElement=aggNameItemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='AggFactCount'){				
					var fa=new AggFactCount();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggIgnoreColumn'){				
					var fa=new AggIgnoreColumn();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggForeignKey'){				
					var fa=new AggForeignKey();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggMeasure'){				
					var fa=new AggMeasure();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggLevel'){				
					var fa=new AggLevel();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggName'){
					this.init(itemElement);
			  }
		}
	}
//-----------------------------------AggPattern----------------------------------------------------

	AggPattern = function(){
		this.pattern='';  // required attribute
		this.ignorecase='true';  // attribute default: true
		this.aggPatternItems=[];
		this.name='AggPattern';
	}
	AggPattern.prototype.isCanAdd=function(objname){
		var objnames = ["AggFactCount","AggIgnoreColumn","AggForeignKey","AggMeasure","AggLevel","AggExclude"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggPattern.prototype.getObjAttributes=function(obj){
		return {
			"忽略大小写":obj.getIgnorecase(),
			"模式":obj.getPattern()
		};
	}
	AggPattern.prototype.setName=function(name){
		this.name=name;
	}
	AggPattern.prototype.getName=function(){
		return this.name;
	}
	AggPattern.prototype.isHaveItems=function(){
		return true;
	}
	AggPattern.prototype.getObjName=function(){
		return "AggPattern";
	}
	AggPattern.prototype.getObjCnName=function(){
		return "AggPattern";
	}
	AggPattern.prototype.getObjIcon=function(){
		return "";
	}
	AggPattern.prototype.setPattern=function(pattern){
		this.pattern=pattern;
	}
	AggPattern.prototype.getPattern=function(){
		return this.pattern;
	}
	AggPattern.prototype.setIgnorecase=function(ignorecase){
		this.ignorecase=ignorecase;
	}
	AggPattern.prototype.getIgnorecase=function(){
		return this.ignorecase;
	}
	AggPattern.prototype.addObjItems=function(aggPatternItems){
		this.aggPatternItems.push(aggPatternItems);
	}
	AggPattern.prototype.getObjItems=function(){
		return this.aggPatternItems;
	}
	
	AggPattern.prototype.toXML=function(){
		var str=[];
		var _aggPatternItems=this.aggPatternItems;	
		str.push('\n\r    <AggPattern');
        if(this.pattern!=null){
			str.push(' pattern="',this.pattern);
		}
		if(this.ignorecase!=null){
			str.push('" ignorecase="',this.ignorecase);
		}
		str.push('">');
		if (_aggPatternItems&&_aggPatternItems.length>0) {           
			for(var i=0;i<_aggPatternItems.length;i++){
				 str.push(_aggPatternItems[i].toXML());
			}			
        }
        str.push('\n\r    </AggPattern>');
		return str.join('');
	}
	
	AggPattern.prototype.init=function(aggPatternItemsElement){	
		var	pattern =aggPatternItemsElement.attributes.getNamedItem("pattern");
		if (pattern != null){
			this.setPattern(pattern.value);
		}
		var	ignorecase =aggPatternItemsElement.attributes.getNamedItem("ignorecase");
		if (ignorecase != null){
			this.setIgnorecase(ignorecase.value);
		}
		var allElement=aggPatternItemsElement.childNodes;
		for(var j=0;j<allElement.length;j++){
			var itemElement=allElement[j];
			  if(itemElement.nodeName=='AggFactCount'){				
					var fa=new AggFactCount();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggIgnoreColumn'){				
					var fa=new AggIgnoreColumn();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggForeignKey'){				
					var fa=new AggForeignKey();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggMeasure'){				
					var fa=new AggMeasure();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggLevel'){				
					var fa=new AggLevel();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggExclude'){				
					var fa=new AggExclude();
					fa.init(itemElement);
					this.addObjItems(fa);
			  }
			  if(itemElement.nodeName=='AggPattern'){
					this.init(itemElement);
			  }
		}
	}
	
//-----------------------------------AggExclude----------------------------------------------------	

	AggExclude=function(){
		this.pattern='';  // optional attribute
		this.name='';  // optional attribute
		this.ignorecase='true';  // attribute default: true
	}
	AggExclude.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggExclude.prototype.getObjAttributes=function(obj){
		return {
			"忽略大小写":obj.getIgnorecase(),
			"模式":obj.getPattern(),
			"名称":obj.getName()
		};
	}
	AggExclude.prototype.isHaveItems=function(){
		return false;
	}
	AggExclude.prototype.getObjName=function(){
		return "AggExclude";
	}
	AggExclude.prototype.getObjCnName=function(){
		return "AggExclude";
	}
	AggExclude.prototype.getObjIcon=function(){
		return "";
	}

	AggExclude.prototype.setPattern=function(pattern){
		this.pattern = pattern;
	}
	AggExclude.prototype.getPattern=function(){
		return this.pattern;
	}
	AggExclude.prototype.setName=function(name){
		this.name = name;
	}
	AggExclude.prototype.getName=function(){
		return this.name;
	}
	AggExclude.prototype.setIgnorecase=function(ignorecase){
		this.ignorecase = ignorecase;
	}
	AggExclude.prototype.getIgnorecase=function(){
		return this.ignorecase;
	}
	
	AggExclude.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggExclude  ');
		
		if(this.pattern!=null){
			str.push(' pattern="',this.pattern);
		}
		if(this.name!=null){
			str.push('" name="',this.name);
		}
		if(this.ignorecase!=null){
			str.push('" ignorecase="',this.ignorecase);
		}
		str.push('">');
		
		str.push('\n\r	</AggExclude>');
		return str.join('');
	}
	
	AggExclude.prototype.init=function(aggExcludeElement){
		var	pattern =aggExcludeElement.attributes.getNamedItem("pattern");
		if (pattern != null){
			this.setPattern(pattern.value);
		}
		var	name =aggExcludeElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var	ignorecase =aggExcludeElement.attributes.getNamedItem("ignorecase");
		if (ignorecase != null){
			this.setIgnorecase(ignorecase.value);
		}
		
	}
	
//-----------------------------------AggColumnName----------------------------------------------------	

	AggColumnName=function(){
		this.column='';// required attribute
		this.name='AggColumnName';
	}
	AggColumnName.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggColumnName.prototype.getObjAttributes=function(obj){
		return {
			"列":obj.getColumn()
		};
	}
	AggColumnName.prototype.setName=function(name){
		this.name = name;
	}
	AggColumnName.prototype.getName=function(){
		return this.name;
	}
	AggColumnName.prototype.isHaveItems=function(){
		return false;
	}
	AggColumnName.prototype.getObjName=function(){
		return "AggColumnName";
	}
	AggColumnName.prototype.getObjCnName=function(){
		return "AggColumnName";
	}
	AggColumnName.prototype.getObjIcon=function(){
		return "";
	}
	AggColumnName.prototype.setColumn=function(column){
		this.column = column;
	}
	AggColumnName.prototype.getColumn=function(){
		return this.column;
	}
	
	AggColumnName.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggColumnName  ');
		
		if(this.column!=null){
			str.push(' column="',this.column);
		}
		str.push('">');
		
		str.push('\n\r	</AggColumnName>');
		return str.join('');
	}
	
	AggColumnName.prototype.init=function(aggColumnNameElement){
		var	column =aggColumnNameElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		
	}	
	
//-----------------------------------AggFactCount----------------------------------------------------	

	AggFactCount=function(){
		this.column='';// required attribute
		this.name='AggFactCount';
	}
	AggFactCount.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggFactCount.prototype.getObjAttributes=function(obj){
		return {
			"列":obj.getColumn()
		};
	}
	AggFactCount.prototype.setName=function(name){
		this.name = name;
	}
	AggFactCount.prototype.getName=function(){
		return this.name;
	}
	AggFactCount.prototype.isHaveItems=function(){
		return false;
	}
	AggFactCount.prototype.getObjName=function(){
		return "AggFactCount";
	}
	AggFactCount.prototype.getObjCnName=function(){
		return "AggFactCount";
	}
	AggFactCount.prototype.getObjIcon=function(){
		return "";
	}

	AggFactCount.prototype.setColumn=function(column){
		this.column = column;
	}
	AggFactCount.prototype.getColumn=function(){
		return this.column;
	}
	
	AggFactCount.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggFactCount  ');
		
		if(this.column!=null){
			str.push(' column="',this.column);
		}
		str.push('">');
		
		str.push('\n\r	</AggFactCount>');
		return str.join('');
	}
	
	AggFactCount.prototype.init=function(aggFactCountElement){
		var	column =aggFactCountElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		
	}
	
//-----------------------------------AggIgnoreColumn----------------------------------------------------	

	AggIgnoreColumn=function(){
		this.column='';// required attribute
		this.name='AggIgnoreColumn';
	}
	AggIgnoreColumn.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggIgnoreColumn.prototype.getObjAttributes=function(obj){
		return {
			"列":obj.getColumn()
		};
	}
	AggIgnoreColumn.prototype.setName=function(name){
		this.name = name;
	}
	AggIgnoreColumn.prototype.getName=function(){
		return this.name;
	}
	AggIgnoreColumn.prototype.isHaveItems=function(){
		return false;
	}
	AggIgnoreColumn.prototype.getObjName=function(){
		return "AggIgnoreColumn";
	}
	AggIgnoreColumn.prototype.getObjCnName=function(){
		return "AggIgnoreColumn";
	}
	AggIgnoreColumn.prototype.getObjIcon=function(){
		return "";
	}

	AggIgnoreColumn.prototype.setColumn=function(column){
		this.column = column;
	}
	AggIgnoreColumn.prototype.getColumn=function(){
		return this.column;
	}
	
	AggIgnoreColumn.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggIgnoreColumn  ');
		
		if(this.column!=null){
			str.push(' column="',this.column);
		}
		str.push('">');
		
		str.push('\n\r	</AggIgnoreColumn>');
		return str.join('');
	}
	
	AggIgnoreColumn.prototype.init=function(aggIgnoreColumnElement){
		var	column =aggIgnoreColumnElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		
	}	
	
//-----------------------------------AggForeignKey----------------------------------------------------	
/**
 * The name of the column mapping from base fact table foreign key
 * to aggregate table foreign key.
 */
	AggForeignKey=function(){
		this.factColumn='';// required attribute
		this.aggColumn='';	// required attribute
		this.name='AggForeignKey';
	}
	AggForeignKey.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggForeignKey.prototype.getObjAttributes=function(obj){
		return {
			"事实列":obj.getFactColumn(),
			"聚合列":obj.getAggColumn()
		};
	}
	AggForeignKey.prototype.setName=function(name){
		this.name = name;
	}
	AggForeignKey.prototype.getName=function(){
		return this.name;
	}
	AggForeignKey.prototype.isHaveItems=function(){
		return false;
	}
	AggForeignKey.prototype.getObjName=function(){
		return "AggForeignKey";
	}
	AggForeignKey.prototype.getObjCnName=function(){
		return "AggForeignKey";
	}
	AggForeignKey.prototype.getObjIcon=function(){
		return "";
	}
	AggForeignKey.prototype.setFactColumn=function(factColumn){
		this.factColumn = factColumn;
	}
	AggForeignKey.prototype.getFactColumn=function(){
		return this.factColumn;
	}
	AggForeignKey.prototype.setAggColumn=function(aggColumn){
		this.aggColumn = aggColumn;
	}
	AggForeignKey.prototype.getAggColumn=function(){
		return this.aggColumn;
	}
	
	AggForeignKey.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggForeignKey  ');
		
		if(this.factColumn!=null){
			str.push(' factColumn="',this.factColumn);
		}
		
		if(this.aggColumn!=null){
			str.push('" aggColumn="',this.aggColumn);
		}
		str.push('">');
		
		str.push('\n\r	</AggForeignKey>');
		return str.join('');
	}
	
	AggForeignKey.prototype.init=function(aggForeignKeyElement){
		var factColumn = aggForeignKeyElement.attributes.getNamedItem("factColumn");
		if (factColumn != null){
			this.setFactColumn(factColumn.value);
		}
		var	aggColumn =aggForeignKeyElement.attributes.getNamedItem("aggColumn");
		if (aggColumn != null){
			this.setAggColumn(aggColumn.value);
		}
		
	}
	
//-----------------------------------AggLevel----------------------------------------------------	

	AggLevel=function(){
		this.column='';// required attribute
		this.name='';	// required attribute
	}
	AggLevel.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggLevel.prototype.getObjAttributes=function(obj){
		return {
			"名称":obj.getName(),
			"列":obj.getColumn()
		};
	}
	AggLevel.prototype.isHaveItems=function(){
		return false;
	}
	AggLevel.prototype.getObjName=function(){
		return "AggLevel";
	}
	AggLevel.prototype.getObjCnName=function(){
		return "AggLevel";
	}
	AggLevel.prototype.getObjIcon=function(){
		return "";
	}
	AggLevel.prototype.setName=function(name){
		this.name = name;
	}
	AggLevel.prototype.getName=function(){
		return this.name;
	}
	AggLevel.prototype.setColumn=function(column){
		this.column = column;
	}
	AggLevel.prototype.getColumn=function(){
		return this.column;
	}
	
	AggLevel.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggLevel  ');
		
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		
		if(this.column!=null){
			str.push('" column="',this.column);
		}
		str.push('">');
		
		str.push('\n\r	</AggLevel>');
		return str.join('');
	}
	
	AggLevel.prototype.init=function(aggLevelElement){
		var name = aggLevelElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var	column =aggLevelElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		
	}
//-----------------------------------AggMeasure----------------------------------------------------	

	AggMeasure=function(){
		this.column='';// required attribute
		this.name='';	// required attribute
	}
	AggMeasure.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	AggMeasure.prototype.getObjAttributes=function(obj){
		return {
			"名称":obj.getName(),
			"列":obj.getColumn()
		};
	}
	AggMeasure.prototype.isHaveItems=function(){
		return false;
	}
	AggMeasure.prototype.getObjName=function(){
		return "AggMeasure";
	}
	AggMeasure.prototype.getObjCnName=function(){
		return "AggMeasure";
	}
	AggMeasure.prototype.getObjIcon=function(){
		return "";
	}
	AggMeasure.prototype.setName=function(name){
		this.name = name;
	}
	AggMeasure.prototype.getName=function(){
		return this.name;
	}
	AggMeasure.prototype.setColumn=function(column){
		this.column = column;
	}
	AggMeasure.prototype.getColumn=function(){
		return this.column;
	}
	
	AggMeasure.prototype.toXML=function(){
		var str=[];	
		str.push('\n\r	<AggMeasure  ');
		
		if(this.name!=null){
			str.push(' name="',this.name);
		}
		
		if(this.column!=null){
			str.push('" column="',this.column);
		}
		str.push('">');
		
		str.push('\n\r	</AggMeasure>');
		return str.join('');
	}
	
	AggMeasure.prototype.init=function(aggMeasureElement){
		var name = aggMeasureElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}
		var	column =aggMeasureElement.attributes.getNamedItem("column");
		if (column != null){
			this.setColumn(column.value);
		}
		
	}
	
//-----------------------------------KeyExpression----------------------------------------------------
	
	KeyExpression = function(){
		this.keyExpression=[];
		this.name='KeyExpression';
	}
	KeyExpression.prototype.isCanAdd=function(objname){
		var objnames = ["SQL"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	KeyExpression.prototype.getObjAttributes=function(obj){
		return {};
	}
	KeyExpression.prototype.setName=function(name){
		this.name = name;
	}
	KeyExpression.prototype.getName=function(){
		return this.name;
	}
	KeyExpression.prototype.isHaveItems=function(){
		return true;
	}
	KeyExpression.prototype.getObjName=function(){
		return "KeyExpression";
	}
	KeyExpression.prototype.getObjCnName=function(){
		return "键表达式";
	}
	KeyExpression.prototype.getObjIcon=function(){
		return "/themes/icon/database/pkColumn.gif";
	}
	
	KeyExpression.prototype.addObjItems=function(sql){
		this.keyExpression.push(sql)
	}
	KeyExpression.prototype.getObjItems=function(){
		return this.keyExpression;
	}
	
	KeyExpression.prototype.toXML=function(){
		var str=[];
		var _keyExpression=this.keyExpression;	

		if (_keyExpression&&_keyExpression.length>0) {
            str.push('\n\r    <KeyExpression>');
            
			for(var i=0;i<_keyExpression.length;i++){
				 str.push(_keyExpression[i].toXML());
			}
			str.push('\n\r    </KeyExpression>');
        }
		return str.join('');
	}
	
	KeyExpression.prototype.init=function(keyExpressionElement){	
		var allSqlElement=keyExpressionElement.childNodes;
		for(var j=0;j<allSqlElement.length;j++){
			var sqlElement=allSqlElement[j];
			  if(sqlElement.nodeName=='SQL'){				
					var sq=new SQL();
					sq.init(sqlElement);
					this.addObjItems(sq);
			  }
			  if(sqlElement.nodeName=='KeyExpression'){
					this.init(sqlElement);
			  }
		}
	}
	
//-----------------------------------ParentExpression----------------------------------------------------
	
	ParentExpression = function(){
		this.parentExpression=[];
		this.name='ParentExpression';
	}
	ParentExpression.prototype.isCanAdd=function(objname){
		var objnames = ["SQL"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	ParentExpression.prototype.getObjAttributes=function(obj){
		return {};
	}
	ParentExpression.prototype.setName=function(name){
		this.name = name;
	}
	ParentExpression.prototype.getName=function(){
		return this.name;
	}
	ParentExpression.prototype.isHaveItems=function(){
		return true;
	}
	ParentExpression.prototype.getObjName=function(){
		return "ParentExpression";
	}
	ParentExpression.prototype.getObjCnName=function(){
		return "父表达式";
	}
	ParentExpression.prototype.getObjIcon=function(){
		return "/themes/icon/all/user_gray.gif";
	}
	ParentExpression.prototype.addObjItems=function(sql){
		this.parentExpression.push(sql)
	}
	ParentExpression.prototype.getObjItems=function(){
		return this.parentExpression;
	}
	
	ParentExpression.prototype.toXML=function(){
		var str=[];
		var _parentExpression=this.parentExpression;	

		if (_parentExpression&&_parentExpression.length>0) {
            str.push('\n\r    <ParentExpression>');
            
			for(var i=0;i<_parentExpression.length;i++){
				 str.push(_parentExpression[i].toXML());
			}
			str.push('\n\r    </ParentExpression>');
        }
		return str.join('');
	}
	
	ParentExpression.prototype.init=function(parentExpressionElement){	
		var allSqlElement=parentExpressionElement.childNodes;
		for(var j=0;j<allSqlElement.length;j++){
			var sqlElement=allSqlElement[j];
			  if(sqlElement.nodeName=='SQL'){				
					var sq=new SQL();
					sq.init(sqlElement);
					this.addObjItems(sq);
			  }
			  if(sqlElement.nodeName=='ParentExpression'){
					this.init(sqlElement);
			  }
		}
	}
	
//-----------------------------------OrdinalExpression----------------------------------------------------
	
	OrdinalExpression = function(){
		this.ordinalExpression=[];
		this.name='OrdinalExpression';
	}
	OrdinalExpression.prototype.isCanAdd=function(objname){
		var objnames = ["SQL"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	OrdinalExpression.prototype.getObjAttributes=function(obj){
		return {};
	}
	OrdinalExpression.prototype.setName=function(name){
		this.name = name;
	}
	OrdinalExpression.prototype.getName=function(){
		return this.name;
	}
	OrdinalExpression.prototype.isHaveItems=function(){
		return true;
	}
	OrdinalExpression.prototype.getObjName=function(){
		return "OrdinalExpression";
	}
	OrdinalExpression.prototype.getObjCnName=function(){
		return "顺序表达式";
	}
	OrdinalExpression.prototype.getObjIcon=function(){
		return "/themes/icon/database/editor_commit.gif";
	}
	OrdinalExpression.prototype.addObjItems=function(sql){
		this.ordinalExpression.push(sql)
	}
	OrdinalExpression.prototype.getObjItems=function(){
		return this.ordinalExpression;
	}
	
	OrdinalExpression.prototype.toXML=function(){
		var str=[];
		var _ordinalExpression=this.ordinalExpression;	

		if (_ordinalExpression&&_ordinalExpression.length>0) {
            str.push('\n\r    <OrdinalExpression>');
            
			for(var i=0;i<_ordinalExpression.length;i++){
				 str.push(_ordinalExpression[i].toXML());
			}
			str.push('\n\r    </OrdinalExpression>');
        }
		return str.join('');
	}
	
	OrdinalExpression.prototype.init=function(ordinalExpressionElement){	
		var allSqlElement=ordinalExpressionElement.childNodes;
		for(var j=0;j<allSqlElement.length;j++){
			var sqlElement=allSqlElement[j];
			  if(sqlElement.nodeName=='SQL'){				
					var sq=new SQL();
					sq.init(sqlElement);
					this.addObjItems(sq);
			  }
			  if(sqlElement.nodeName=='OrdinalExpression'){
					this.init(sqlElement);
			  }
		}
	}
	
//-----------------------------------NameExpression----------------------------------------------------
	
	NameExpression = function(){
		this.nameExpression=[];
		this.name='NameExpression';
	}
	NameExpression.prototype.isCanAdd=function(objname){
		var objnames = ["SQL"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	NameExpression.prototype.getObjAttributes=function(obj){
		return {};
	}
	NameExpression.prototype.setName=function(name){
		this.name = name;
	}
	NameExpression.prototype.getName=function(){
		return this.name;
	}
	NameExpression.prototype.isHaveItems=function(){
		return true;
	}
	NameExpression.prototype.getObjName=function(){
		return "NameExpression";
	}
	NameExpression.prototype.getObjCnName=function(){
		return "名称表达式";
	}
	NameExpression.prototype.getObjIcon=function(){
		return "/themes/icon/database/edittsk_tsk.gif";
	}
	NameExpression.prototype.addObjItems=function(sql){
		this.nameExpression.push(sql)
	}
	NameExpression.prototype.getObjItems=function(){
		return this.nameExpression;
	}
	
	NameExpression.prototype.toXML=function(){
		var str=[];
		var _nameExpression=this.nameExpression;	

		if (_nameExpression&&_nameExpression.length>0) {
            str.push('\n\r    <NameExpression>');
            
			for(var i=0;i<_nameExpression.length;i++){
				 str.push(_nameExpression[i].toXML());
			}
			str.push('\n\r    </NameExpression>');
        }
		return str.join('');
	}
	
	NameExpression.prototype.init=function(nameExpressionElement){	
		var allSqlElement=nameExpressionElement.childNodes;
		for(var j=0;j<allSqlElement.length;j++){
			var sqlElement=allSqlElement[j];
			  if(sqlElement.nodeName=='SQL'){				
					var sq=new SQL();
					sq.init(sqlElement);
					this.addObjItems(sq);
			  }
			  if(sqlElement.nodeName=='NameExpression'){
					this.init(sqlElement);
			  }
		}
	}
	
//-----------------------------------MeasureExpression----------------------------------------------------
	
	MeasureExpression = function(){
		this.measureExpression=[];
		this.name='MeasureExpression';
	}
	MeasureExpression.prototype.isCanAdd=function(objname){
		var objnames = ["SQL"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	MeasureExpression.prototype.getObjAttributes=function(obj){
		return {};
	}
	MeasureExpression.prototype.setName=function(name){
		this.name = name;
	}
	MeasureExpression.prototype.getName=function(){
		return this.name;
	}
	MeasureExpression.prototype.isHaveItems=function(){
		return true;
	}
	MeasureExpression.prototype.getObjName=function(){
		return "MeasureExpression";
	}
	MeasureExpression.prototype.getObjCnName=function(){
		return "度量值表达式";
	}
	MeasureExpression.prototype.getObjIcon=function(){
		return "/themes/icon/database/copycont_l_co.gif";
	}
	MeasureExpression.prototype.addObjItems=function(sql){
		this.measureExpression.push(sql)
	}
	MeasureExpression.prototype.getObjItems=function(){
		return this.measureExpression;
	}
	
	MeasureExpression.prototype.toXML=function(){
		var str=[];
		var _measureExpression=this.measureExpression;	

		if (_measureExpression&&_measureExpression.length>0) {
            str.push('\n\r    <MeasureExpression>');
            
			for(var i=0;i<_measureExpression.length;i++){
				 str.push(_measureExpression[i].toXML());
			}
			str.push('\n\r    </MeasureExpression>');
        }
		return str.join('');
	}
	
	MeasureExpression.prototype.init=function(measureExpressionElement){	
		var allSqlElement=measureExpressionElement.childNodes;
		for(var j=0;j<allSqlElement.length;j++){
			var sqlElement=allSqlElement[j];
			  if(sqlElement.nodeName=='SQL'){				
					var sq=new SQL();
					sq.init(sqlElement);
					this.addObjItems(sq);
			  }
			  if(sqlElement.nodeName=='MeasureExpression'){
					this.init(sqlElement);
			  }
		}
	}
	
//-----------------------------------UserDefinedFunction----------------------------------------------------
	/**
	 * A UserDefinedFunction is a function which
	 * extends the MDX language. It must be implemented by a Java
	 * class which implements the interface
	 * mondrian.spi.UserDefinedFunction.
	 */
	UserDefinedFunction = function(){
		this.name='';  // required attribute
		this.className='';  // required attribute
	}
	UserDefinedFunction.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	UserDefinedFunction.prototype.getObjAttributes=function(obj){
		return {
			"名称":obj.getName(),
			"类名":obj.getClassName()
		};
	}
	UserDefinedFunction.prototype.isHaveItems=function(){
		return false;
	}
	UserDefinedFunction.prototype.getObjName=function(){
		return "UserDefinedFunction";
	}
	UserDefinedFunction.prototype.getObjCnName=function(){
		return "用户定义函数";
	}
	UserDefinedFunction.prototype.getObjIcon=function(){
		return "/themes/icon/database/copycont_l_co.gif";
	}
	UserDefinedFunction.prototype.setName=function(name){
		this.name=name;
	}
	UserDefinedFunction.prototype.getName=function(){
		return this.name;
	}
	UserDefinedFunction.prototype.setClassName=function(className){
		this.className=className;
	}
	UserDefinedFunction.prototype.getClassName=function(){
		return this.className;
	}
	
	UserDefinedFunction.prototype.toXML = function(){
		var str=[];	
		str.push('\n\r	<UserDefinedFunction  name="',this.name);
		
		if(this.className!=null){
			str.push('" className="',this.className);
		}
		str.push('">');
		
		str.push('\n\r	</UserDefinedFunction>');
		return str.join('');
	}
	
	UserDefinedFunction.prototype.init=function(userDefinedFunctionElement){
		var name = userDefinedFunctionElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName("New UserDefinedFunction");
		}
		var	className =userDefinedFunctionElement.attributes.getNamedItem("className");
		if (className != null){
			this.setClassName(className.value);
		}
		
	}

//-----------------------------------Annotation定义----------------------------------------------------
	/**
	 * User-defined property value.
	 */
	Annotation = function(){
		this.name='';
		this.cdata='';
	}
	Annotation.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Annotation.prototype.getObjAttributes=function(obj){
		return {
			"名称":obj.getName(),
			"内容":obj.getCdata()
		};
	}
	Annotation.prototype.isHaveItems=function(){
		return false;
	}
	Annotation.prototype.getObjName=function(){
		return "Annotation";
	}
	Annotation.prototype.getObjCnName=function(){
		return "注释";
	}
	Annotation.prototype.getObjIcon=function(){
		return "/themes/icon/database/filelist.gif";
	}

	Annotation.prototype.setName=function(name){
		this.name=name;
	}
	Annotation.prototype.getName=function(){
		return this.name;
	}
	Annotation.prototype.setCdata=function(cdata){
		this.cdata=cdata;
	}
	Annotation.prototype.getCdata=function(){
		return this.cdata;
	}

	Annotation.prototype.toXML=function(){
		var str=[];
		str.push('\n\r  <Annotation name="',this.name,'">');				
		str.push('\n\r <![CDA');
		str.push('TA[');
		str.push(this.cdata);
		str.push(']');
		str.push(']>');	
		str.push('\n\r </Annotation>');
		return str.join('');
	}

	Annotation.prototype.init=function(annotationElement){
		var name = annotationElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName("New Annotation");
		}
		var	cdata =annotationElement.firstChild.data;
		if (cdata != null){
			this.setCdata(cdata.value);
		}
	}

//-----------------------------------Annotations----------------------------------------------------
	/**
	 * Holder for an array of Annotation elements
	 */	
	Annotations = function(){
		this.annotations=[];
		this.name='Annotations';
	}
	Annotations.prototype.isCanAdd=function(objname){
		var objnames = ["Annotation"];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Annotations.prototype.getObjAttributes=function(obj){
		return {};
	}
	Annotations.prototype.isHaveItems=function(){
		return true;
	}
	Annotations.prototype.getObjName=function(){
		return "Annotations";
	}
	Annotations.prototype.getObjCnName=function(){
		return "注释的集合";
	}
	Annotations.prototype.getObjIcon=function(){
		return "";
	}
	Annotations.prototype.addObjItems=function(annotation){
		this.annotations.push(annotation)
	}
	Annotations.prototype.getObjItems=function(){
		return this.annotations;
	}
	Annotations.prototype.setName=function(name){
		this.name=name;
	}
	Annotations.prototype.getName=function(){
		return this.name;
	}
	Annotations.prototype.toXML=function(){
		var str=[];
		var _annotations=this.annotations;	

		if (_annotations&&_annotations.length>0) {
            str.push('\n\r    <Annotations>');
            
			for(var i=0;i<_annotations.length;i++){
				 str.push(_annotations[i].toXML());
			}
			str.push('\n\r    </Annotations>');
        }
		return str.join('');
	}
	
	Annotations.prototype.init=function(annotationElement){	
		var allAnnotationElement=annotationElement.childNodes;
		for(var j=0;j<allAnnotationElement.length;j++){
			var annoElement=allAnnotationElement[j];
			  if(annoElement.nodeName=='Annotation'){				
					var an=new Annotation();
					an.init(annoElement);
					this.addObjItems(an);
			  }
			  if(annoElement.nodeName=='Annotations'){
					this.init(annoElement);
			  }
		}
	}

//-----------------------------------Parameter----------------------------------------------------
	/**
	 * A Parameter defines a schema parameter.
	 * It can be referenced from an MDX statement using the ParamRef
	 * function and, if not final, its value can be overridden.
	 */
	Parameter = function(){
		this.name='';  // required attribute
		this.description='';  // optional attribute
		/** Allowable values for {@link #type}. */
		this.type_values = ["String", "Numeric", "Integer", "Boolean", "Date", "Time", "Timestamp", "Member"];
		this.type='';  // attribute default: String
		this.modifiable='true';  // attribute default: true
		this.defaultValue='';  // optional attribute
	}
	Parameter.prototype.isCanAdd=function(objname){
		var objnames = [];
		var iscanadd=false;
		var objname=objname;
		for(var i=0;i<objnames.length;i++){
			if(objname==objnames[i].toString()){
				iscanadd=true;
			}
		}
		var results=[];
		results.push(iscanadd);
		results.push(objnames);
		return results;
	}
	Parameter.prototype.getObjAttributes=function(obj){
		return {
			"名称":obj.getName(),
			"描述":obj.getDescription(),
			"类型":obj.getType(),
			"修改":obj.getModifiable(),
			"默认值":obj.getDefaultValue()
		};
	}
	Parameter.prototype.isHaveItems=function(){
		return false;
	}
	Parameter.prototype.getObjName=function(){
		return "Parameter";
	}
	Parameter.prototype.getObjCnName=function(){
		return "参数";
	}
	Parameter.prototype.getObjIcon=function(){
		return "/themes/icon/database/database_table.gif";
	}
	Parameter.prototype.setName=function(name){
		this.name=name;
	}
	Parameter.prototype.getName=function(){
		return this.name;
	}
	Parameter.prototype.setDescription=function(description){
		this.description=description;
	}
	Parameter.prototype.getDescription=function(){
		return this.description;
	}
	Parameter.prototype.setType=function(type){
		this.type=type;
	}
	Parameter.prototype.getType=function(){
		return this.type;
	}
	Parameter.prototype.setModifiable=function(modifiable){
		this.modifiable=modifiable;
	}
	Parameter.prototype.getModifiable=function(){
		return this.modifiable;
	}
	Parameter.prototype.setDefaultValue=function(defaultValue){
		this.defaultValue=defaultValue;
	}
	Parameter.prototype.getDefaultValue=function(){
		return this.defaultValue;
	}
	
	Parameter.prototype.toXML = function(){
		var str=[];	
		str.push('\n\r	<Parameter  name="',this.name);
		
		if(this.description!=null){
			str.push('" description="',this.description);
		}

		if(this.type!=null){
			str.push('" type="',this.type);
		}

		if(this.modifiable!=null){
			str.push('" modifiable="',this.modifiable);
		}

		if(this.defaultValue!=null){
			str.push('" defaultValue="',this.defaultValue);
		}
		str.push('">');
		
		str.push('\n\r	</Parameter>');
		return str.join('');
	}
	
	Parameter.prototype.init=function(parameterElement){
		var name = parameterElement.attributes.getNamedItem("name");
		if (name != null){
			this.setName(name.value);
		}else{
			this.setName("New Parameter");
		}
		var	description =parameterElement.attributes.getNamedItem("description");
		if (description != null){
			this.setDescription(description.value);
		}
		var	type =parameterElement.attributes.getNamedItem("type");
		if (type != null){
			this.setType(type.value);
		}else{
			this.setType("String");
		}
		var	modifiable =parameterElement.attributes.getNamedItem("modifiable");
		if (modifiable != null){
			this.setModifiable(modifiable.value);
		}else{
			this.setModifiable("true");
		}
		var	defaultValue =parameterElement.attributes.getNamedItem("defaultValue");
		if (defaultValue != null){
			this.setDefaultValue(defaultValue.value);
		}
	}
	
//-----------------------------------CubeDimension----------------------------------------------------

	

//-----------------------------------Role--------------------------------------------
/**
 * A role defines an access-control profile. It has a series of grants
 * (or denials) for schema elements.
 */
	//Role=function(){}
	
//-----------------------------------Grant--------------------------------------------	
	
	//Grant=function(){}
	
//-----------------------------------SchemaGrant----------------------------------------
	
/**
 * Grants (or denies) this role access to this schema.
 * access may be "all", "all_dimensions", or "none".
 * If access is "all_dimensions", the role has access
 * to all dimensions but still needs explicit access to cubes.
 * See mondrian.olap.Role#grant(mondrian.olap.Schema,int).
 */
	
	//SchemaGrant=function(){}
	
//-----------------------------------CubeGrant----------------------------------------
/**
 * Grants (or denies) this role access to a cube.
 * access may be "all" or "none".
 * See mondrian.olap.Role#grant(mondrian.olap.Cube,int).
 */
	//CubeGrant=function(){}
	
//-----------------------------------DimensionGrant----------------------------------------
	/**
	 * Grants (or denies) this role access to a dimension.
	 * access may be "all" or "none".
	 * Note that a role is implicitly given access to a dimension when it
	 * is given acess to a cube.
	 * See also the "all_dimensions" option of the "SchemaGrant" element.
	 * See mondrian.olap.Role#grant(mondrian.olap.Dimension,int).
	 */
	//DimensionGrant=function(){}
	
//-----------------------------------HierarchyGrant----------------------------------------
	/**
	 * Grants (or denies) this role access to a hierarchy.
	 * access may be "all", "custom" or "none".
	 * If access is "custom", you may also specify the
	 * attributes topLevel, bottomLevel, and
	 * the member grants.
	 * See mondrian.olap.Role#grant(mondrian.olap.Hierarchy, int, mondrian.olap.Level).
	 */
//HierarchyGrant=function(){}

//-----------------------------------MemberGrant----------------------------------------
	/**
	 * Grants (or denies) this role access to a member.
	 * The children of this member inherit that access.
	 * You can implicitly see a member if you can see any of its children.
	 * See mondrian.olap.Role#grant(mondrian.olap.Member,int).
	 */
//MemberGrant=function(){}
	
//-----------------------------------Union----------------------------------------
	/**
	 * Body of a Role definition which defines a Role to be the union
	 * of several Roles. The RoleUsage elements must refer to Roles that
	 * have been declared earlier in this schema file.
	 */
//Union=function(){}
	
//-----------------------------------RoleUsage----------------------------------------
	/**
	 * Usage of a Role in a union Role.
	 */
//RoleUsage=function(){}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
