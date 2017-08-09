Ext.namespace("dev.olap");
dev.olap.OLAPGrid = Ext.extend(Ext.grid.PropertyGrid, {
	initComponent : function(){
		using("lib.ComboTree.ComboTree");
        this.lastEditRow = null;
        var store = new dev.olap.OLAPStore(this);
        this.propStore = store;
        var cm = new dev.olap.OLAPColumnModel(this, store);
		cm.params=this.params;
        //store.store.sort('name', 'ASC');
        this.addEvents(
            'beforepropertychange',
            'propertychange'    
        );
		this.cm = cm;
        this.ds = store.store;
        Ext.grid.PropertyGrid.superclass.initComponent.call(this);
        this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex){
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
    },
	loadSource:function(type,val,obj){
//---------------------------------------------
		this.tree;
		if(typeof(obj)!='undefined'){
			this.tree=obj;
		}
		var t;
		this.obj;
		var instance=this;
		if(typeof(val)!='undefined'){
			instance.obj=val;
			//alert(obj.getName()+"===");
			t=instance.obj.getObjAttributes(instance.obj);
		}else{
			t=this.sourceType[type];
		}
//---------------------------------------------		
		this.programType=type;
		var source={};
		if(typeof(val)=='undefined') val={};
		var m=this.getColumnModel().editorMap;
		if(val.drawout_type=='y')
			t=Ext.apply({
				"选择查询":0
			},t);
		for(var i in t){
			source[i]=val[this.indexTable[i]] || t[i]
			if(m[i] instanceof Array){
				for(var arr=m[i],j=0;j<arr.length;j++){//alert(t[i]+"==="+arr[j][0]+"==="+arr[j][1]);
					if(arr[j][0]==source[i]){//alert(arr[j][0]+"==="+source[i]);
						source[i]={
							text:arr[j][1],
							value:arr[j][0]
						};
						break;
					}
				}
			}
		}
		this.setSource(source);		
		if(val.extra_tables){//主题录入多表处理
			var arr=val.extra_tables;
			for(var i=1;i<arr.length;i++){
				this.store.add(new Ext.grid.PropertyRecord({name:"关联表", value:arr[i]}));
			}
		}
	},
	startEditing : function(row, col){
        this.stopEditing();
        var objName;
        var instance=this;
        if(typeof(instance.obj)!='undefined'){
        	objName = instance.obj.getObjName();
        }
        if(this.colModel.isCellEditable(col, row)){
            this.view.ensureVisible(row, col, true);
            var r = this.store.getAt(row);
            var field = this.colModel.getDataIndex(col);
			if(this.state=='edit' && this.canEdit.indexOf(r.data.name)==-1)
				return;
            var e = {
                grid: this,
                record: r,
                field: field,
                value: r.data[field],
                row: row,
                column: col,
                cancel:false
            };
            if(this.fireEvent("beforeedit", e) !== false && !e.cancel){
                this.editing = true;
                var ed = this.colModel.getCellEditor(col, row,e,objName);
                if(!ed.rendered){
                    ed.render(this.view.getEditorParent(ed));
                }
                (function(){ // complex but required for focus issues in safari, ie and opera
                    ed.row = row;
                    ed.col = col;
                    ed.record = r;
					ed.g=this;
                    ed.on("complete", this.onEditComplete, this, {single: true});
                    ed.on("specialkey", this.selModel.onEditorKey, this.selModel);
                    this.activeEditor = ed;
                    var v = this.preEditValue(r, field);
                    ed.startEdit(this.view.getCell(row, col).firstChild, v);
                }).defer(50, this);
            }
        }
    },
	onEditComplete : function(ed, value, startValue){	
        this.editing = false;
        this.activeEditor = null;
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
		var r = ed.record;
        var field = this.colModel.getDataIndex(ed.col);//alert(r.data["name"].toString());
		r.data[field]=ed.getRealValue? ed.getRealValue():ed.getValue();//alert(value+"==="+ed.getRealValue().value+"==="+ed.getValue());
		ed.boundEl.update(value);
        this.view.focusCell(ed.row, ed.col);
        
        if(value != startValue){
			//this.setObjAttributes(r.data["name"].toString(),value,startValue)
        	this.setObjAttributes(r.data["name"].toString(),r.data["value"],startValue);
		}
    },
    setObjAttributes : function(name,value,oldValue){
    	var instance=this;
    	var value=value;
    	if(typeof(value.value)!="undefined"){
    		value=value.value;
    	}
    	switch(name){
    		case "名称" :
    			//var node = instance.tree.getNodeById(instance.obj.getObjName()+instance.obj.getName());
    			var node = instance.tree.getSelectionModel().getSelectedNode();
    			if(node.parentNode != null){
    				var parentObj = node.parentNode.attributes.params.getObjItems();
    				var chileObj = node.attributes.params;
    				for(var i=0;i<parentObj.length;i++){
    					if(chileObj.getObjName()==parentObj[i].getObjName() && value==parentObj[i].getName()){
    						//alert("已经有"+chileObj.getObjName()+"被命名为："+value+",请从新命名！");
    						Ext.msg("warn",'已经有 '+chileObj.getObjCnName()+' 被命名为：'+value+',请从新命名！');
    						instance.loadSource("1",chileObj,instance.tree);
    						return;
    					}
    				}
    			}
    			//node.setId(instance.obj.getObjName()+value);
    			
    			if(instance.obj.getObjName() != "Schema"){
    				node.setId(instance.obj.getObjName()+value+node.parentNode.id);
    				instance.obj.setName(value);//alert(name+"==="+value);
    				node.setText(value);
    			}else{
    				node.setId(instance.obj.getObjName()+value);
    				instance.obj.setName(value);//alert(name+"==="+value);
    			}
    			break;
    		case "描述" :
    			this.obj.setDescription(value);
    			break;
    		case "度量值标题" :
    			this.obj.setMeasuresCaption(value);
    			break;
    		case "默认角色" :
    			this.obj.setDefaultRole(value);
    			break;
    		case "默认度量值" :
    			this.obj.setDefaultMeasure(value);
    			break;
    		case "启用" :
    			this.obj.setEnabled(value);
    			break;
    		case "标题" :
    			this.obj.setCaption(value);
    			break;
    		case "缓存" :
    			this.obj.setCache(value);
    			break;
    		case "立方体名称" :
    			this.obj.setCubeName(value);
    			break;
    		case "忽略不相关维度" :
    			this.obj.setIgnoreUnrelatedDimensions(value);
    			break;
    		case "外键" :
    			this.obj.setForeignKey(value);
    			break;
    		case "高基数" :
    			this.obj.setHighCardinality(value);
    			break;
    		case "可见" :
    			this.obj.setVisible(value);
    			break;
    		case "资源" :
    			this.obj.setSource(value);
    			break;
    		case "级别" :
    			this.obj.setLevel(value);
    			break;
    		case "使用前缀" :
    			this.obj.setUsagePrefix(value);
    			break;
    		case "类型" :
    			this.obj.setType(value);
    			break;
    		case "一直" :
    			this.obj.setHasAll(value);
    			break;
    		case "全部成员名称" :
    			this.obj.setAllMemberName(value);
    			break;
    		case "全部成员标题" :
    			this.obj.setAllMemberCaption(value);
    			break;
    		case "全部级别名称" :
    			this.obj.setAllLevelName(value);
    			break;
    		case "主键" :
    			this.obj.setPrimaryKey(value);
    			break;
    		case "主键表" :
    			this.obj.setPrimaryKeyTable(value);
    			break;
    		case "默认成员" :
    			this.obj.setDefaultMember(value);
    			break;
    		case "memberReaderClass" :
    			this.obj.setMemberReaderClass(value);
    			break;
    		case "特殊级别名称" :
    			this.obj.setUniqueKeyLevelName(value);
    			break;
    		case "大约行数" :
    			this.obj.setApproxRowCount(value);
    			break;
    		case "事实表" :
    			this.obj.setTable(value);
    			break;
    		case "列" :
    			this.obj.setColumn(value);
    			break;
    		case "名称列" :
    			this.obj.setNameColumn(value);
    			break;
    		case "排序列" :
    			this.obj.setOrdinalColumn(value);
    			break;
    		case "父列" :
    			this.obj.setParentColumn(value);
    			break;
    		case "空父值" :
    			this.obj.setNullParentValue(value);
    			break;
    		case "特殊成员" :
    			this.obj.setUniqueMembers(value);
    			break;
    		case "级别类型" :
    			this.obj.setLevelType(value);
    			break;
    		case "隐藏成员条件" :
    			this.obj.setHideMemberIf(value);
    			break;
    		case "格式化" :
    			this.obj.setFormatter(value);
    			break;
    		case "标题列" :
    			this.obj.setCaptionColumn(value);
    			break;
    		case "子列" :
    			this.obj.setChildColumn(value);
    			break;
    		case "依赖于级别的值" :
    			this.obj.setDependsOnLevelValue(value);
    			break;
    		case "格式字符串" :
    			this.obj.setFormatString(value);
    			break;
    		case "数据类型" :
    			this.obj.setDatatype(value);
    			break;
    		case "聚合" :
    			this.obj.setAggregator(value);
    			break;
    		case "公式" :
    			this.obj.setFormula(value);
    			break;
    		case "维度" :
    			this.obj.setDimension(value);
    			break;
    		case "表达式" :
    			this.obj.setExpression(value);
    			break;
    		case "值" :
    			this.obj.setValue(value);
    			break;
    		case "内容" :
    			this.obj.setCdata(value);
    			break;
    		case "别名" :
    			this.obj.setAlias(value);
    			break;
    		case "左别名" :
    			this.obj.setLeftAlias(value);
    			break;
    		case "左键" :
    			this.obj.setLeftKey(value);
    			break;
    		case "右别名" :
    			this.obj.setRightAlias(value);
    			break;
    		case "右键" :
    			this.obj.setRightKey(value);
    			break;
    		case "方案" :
    			this.obj.setSchema(value);
    			break;
    		case "忽略大小写" :
    			this.obj.setIgnorecase(value);
    			break;
    		case "模式" :
    			this.obj.setPattern(value);
    			break;
    		case "事实列" :
    			this.obj.setFactColumn(value);
    			break;
    		case "聚合列" :
    			this.obj.setAggColumn(value);
    			break;
    		case "类名" :
    			this.obj.setClassName(value);
    			break;
    		case "修改" :
    			this.obj.setModifiable(value);
    			break;
    		case "默认值" :
    			this.obj.setDefaultValue(value);
    			break;
    		case "语言" :
    			this.obj.setDialect(value);
    			break;
    	}
    },
    enToCn :{
    	"name" : "名称",
    	"description" : "描述",
    	"measuresCaption" : "度量值标题",
    	"defaultRole" : "默认角色",
    	"defaultMeasure" : "默认度量值",
    	"enabled" : "启用",
		"caption" : "标题",
		"cache" : "缓存",
		"cubeName" : "立方体名称",
		"ignoreUnrelatedDimensions" : "忽略不相关维度",
		"foreignKey" : "外键",
		"highCardinality" : "高基数",
		"visible" : "可见",
		"source" : "资源",
		"level" : "级别",
		"usagePrefix" : "使用前缀",
		"type" : "类别",
		"hasAll" : "一直",
		"allMemberName" : "全部成员名称",
		"allMemberCaption" : "全部成员标题",
		"allLevelName" : "全部级别名称",
		"primaryKey" : "主键",
		"primaryKeyTable" : "主键表",
		"defaultMember" : "默认成员",
		"memberReaderClass" : "memberReaderClass",
		"uniqueKeyLevelName" : "特殊级别名称",
		"approxRowCount" : "大约行数",
		"table" : "事实表",
		"column" : "列",
		"nameColumn" : "名称列",
		"ordinalColumn" : "排序列",
		"parentColumn" : "父列",
		"nullParentValue" : "空父值",
		"uniqueMembers" : "特殊成员",
		"levelType" : "级别类型",
		"hideMemberIf" : "隐藏成员条件",
		"formatter" : "格式化",
		"captionColumn" : "标题列",
		"childColumn" : "子列",
		"dependsOnLevelValue" : "依赖于级别的值",
		"formatString" : "格式字符串",
		"datatype" : "数据类型",
		"aggregator" : "聚合",
		"formula" : "公式",
		"dimension" : "维度",
		"expression" : "表达式",
		"value" : "值",
		"cdata" : "内容",
		"alias" : "别名",
		"leftAlias" : "左别名",
		"leftKey" : "左键",
		"rightAlias" : "右别名",
		"rightKey" : "右键",
		"schema" : "方案",
		"ignorecase" : "忽略大小写",
		"pattern" : "模式",
		"factColumn" : "事实列",
		"aggColumn" : "聚合列",
		"className" : "类名",
		"modifiable" :"修改",
		"defaultValue" :"默认值",
		"dialect":"语言"
    },
	sourceType:[
		{},
		{ // ['1',"单记录页面"]
			"查询数据导入" : 'n',
			"关联表" : "",// ComboTree
			"开始类型" : "view",
			"程序目录" : "",
			"无数据则转入新建状态" : "n"
		}
	],
	indexTable : {
		"查询数据导入" : "drawout_type",
		"measuresCaption" : "tab_id",
		"开始类型" : "start_type",
		"默认显示":'default_show',
		"数据有效检验" : "valid_check",
		"数据权限" : "data_auth",
		"单页行数" : "column_num",
		"选择查询" : "query_id",
		"选择从表" : "tab1_id",
		"框架类别" : "frame_type",
		"逻辑类别" : "task_type",
		"连接" : "out_url",
		"查询2" : "query_id2",
		"报表" : "report_id",
		"地图" : "map_id",
		"选择门户" : "portlet_id",
		"选择应用集成" : "integrate_id",
		"图表" : "chart_id",
		"报告" : "textreport_id",
		"外挂程序类型":'is_iframe',
		"搜索类别" : "search_type",
		"引用程序" : "link_id",
		"有我的查询" : "my_query",
		"有收藏夹" : "have_favorite",
		"程序目录" : "prg_folder",
		"无数据则转入新建状态":"TO_CREATE_WITHOUT_DATA"
	},
	canEdit:"开始类型,数据有效检验,数据权限,单页行数,连接,外挂程序类型,选择查询,查询数据导入,程序目录,默认显示,图表,报告,引用程序,无数据则转入新建状态"
});
dev.olap.OLAPStore=Ext.extend(Ext.grid.PropertyStore,{
    isEditableValue: function(val){
        return true;
    }
});
dev.olap.GridEditor=Ext.extend(Ext.grid.GridEditor,{
	updateEl:true,
	startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Ext.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
        this.startValue = v;
		if(typeof(v)=='object')
			this.field.setValue(v.value,v.text);
        else
			this.field.setValue(v);
		this.doAutoSize();
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        this.show();
    },
    getValue : function(){
		if(this.field.ctype=='combo')
			return this.field.el.dom.value;
		else
			return this.field.getValue();
	},
	getRealValue:function(){
		if(this.field.ctype=='combo'){//alert(this.field.el.dom.value+"==="+this.field.getValue());
			return {
				text:this.field.el.dom.value,
				value:this.field.getValue()
			};
		}else
			return this.field.getValue();
	}
});

dev.olap.OLAPColumnModel=Ext.extend(Ext.grid.PropertyColumnModel, {
	 createEditor:function(n,conf,objName){
		var editor=null;
		var ntype=typeof(this.editorMap[n]);
        if(ntype!='undefined'){
			if(ntype=='object'){
				var combData;
				if(objName=="Dimension"&&n=="类型"){
					combData=this.editorMap['维度类型']
				}else if(objName=="Parameter"&&n=="类型"){
					combData=this.editorMap['维度类型'];
				}else{
					combData=this.editorMap[n];
				}
				editor=this.getComboBox({
					store:new Ext.data.SimpleStore( {
						fields : ['value', 'text'],
						data : combData
					})
				},false);
				if(n=="查询数据导入"){
					editor.field.on("select",function(combo,rec,index){
						var newValue=rec.get("value");
						var st=this.g.getStore();
						var rowIndex=st.find("name","选择查询");
						if(newValue=='y'){
							if(rowIndex==-1)
								st.add(new Ext.grid.PropertyRecord({name:"选择查询", value: ""}));
						}else{
							if(rowIndex!=-1)
								st.remove(st.getAt(rowIndex));   
						}
					},editor);
				}
			}else if(ntype=='string'){
				var cst=new Ext.data.JsonStore({
						url : this.editorMap[n],
						autoLoad:false,
						root : 'items',
						fields : ["text", "value"],
						baseParams:{
							r:Math.random(),
							objectId:-1
						}
					});
				if( n=='选择从表'){ 
					cst.on("beforeload",function(st,option){
						var st=this.store.store;
						var rowIdx=-1;
						rowIdx=st.find("name","关联表");
						if(rowIdx==-1) return false;
						var val=st.getAt(rowIdx).get("value").value;
						cst.baseParams.object_id=val;
					},this)  
				}
				editor=this.getComboBox({store:cst,mode:'remote'},true);
				if(n!='选择从表'){
					editor.field.on("beforequery",function(qe){
						var v=this.params.parent_id;
						if(v!=qe.combo.lastQuery){
							qe.query=v;
							qe.combo.store.baseParams.objectId=v;
						}  
					},this)  
				}
			}
        }else{
			if(n=="连接"){
				editor=this.editors['string'];
			}else if(n=="单页行数"){
				editor=this.editors['number'];
			}else if(n=="名称"&&objName=="Table"){
				var dictCombo = new lib.ComboTree.ComboTree( {
					width : 200,
					queryParam : "type",
					mode : 'remot',
					ctype : 'combo',
					listWidth:250,
					height : 100,
					root : new Ext.tree.AsyncTreeNode( {
						text : '所有库',
						draggable : false,
						allowSelect : false,
						id : "0",
						icon : "/themes/icon/all/plugin.gif"
					}),
					loader : new Ext.tree.TreeLoader( {
						dataUrl : '/dev/olap/PropertyGridConfig.jcp',
						requestMethod : "POST"
					})
				});
				dictCombo.on("select", function(comb,node,e) {
					if(conf.grid.programType=='21' && comb.getValue()!='-999999'){//主题录入多表判断
						this.store.store.add(new Ext.grid.PropertyRecord({name:"关联表", value: {text:"无",value:"-999999"}}));
					}
				},this);
				dictCombo.on("change", function(comb,node,e) {
					var st=this.store.store,ct;
					var rowIdx=-1; 
					if((rowIdx=st.find("name","选择从表"))!=-1){
						ct=this.getCellEditor(1,rowIdx).field.store;
						if(ct)
							ct.load( {params : {object_id : node}});
					}
				},this);
				editor=new dev.olap.GridEditor(dictCombo);

			}else{
				editor=this.editors['string'];
			}
		}
		return editor;
	 },
	 getCellEditor : function(colIndex, rowIndex,e,objName){
        var p = this.store.getProperty(rowIndex);
        var n = p.data['name'], val = p.data['value'];
		//if(typeof(this.editors[n])=='undefined'){
			this.editors[n]=this.createEditor(n,e,objName);
		//}
		if(n=="关联表"||n=='引用程序'||n=='程序目录'||(n=='名称'&&objName=='Table')){
			this.editors[n].field.root.id=this.params.parent_id;
		}
		return this.editors[n];
    },
	renderCell : function(val){
        var rv = val;
        if(typeof(val)=='object' && typeof(val.text)!='undefined'){
			rv=val.text;
		}else if(Ext.isDate(val)){
			rv = this.renderDate(val);
        }else if(typeof val == 'boolean'){
            rv = this.renderBool(val);
        }
        return Ext.util.Format.htmlEncode(rv);
    },
	getComboBox : function(config,isRemote) {
		using("lib.ComboRemote.ComboRemote");
		var clazz=isRemote?lib.ComboRemote.ComboRemote:Ext.form.ComboBox;
		return new dev.olap.GridEditor(new clazz(Ext.apply( {
			triggerAction : 'all',
			clearTrigger : false,
			valueField : 'value',
			displayField : 'text',
			mode : 'local',
			ctype : 'combo'
		}, config)));
	},
	editorMap : {
		"维度类型" : [['StandardDimension', '标准维度'], ['TimeDimension', '时间维度']],
		"参数类型" : [['String','字符'],['Numeric','数值'],['Integer','整数'],['Boolean','布尔'],['Date','日期'],['Tiem','时间'],['Timestamp','时间戳'],['Member','成员']],
		"类型" : [['String','字符'],['Numeric','数值'],['Integer','整数'],['Boolean','布尔'],['Date','日期'],['Tiem','时间'],['Timestamp','时间戳']],
		"数据类型" : [['String','字符'],['Numeric','数值'],['Integer','整数'],['Boolean','布尔'],['Date','日期'],['Tiem','时间'],['Timestamp','时间戳']],
		"聚合" : [['sum','求和'],['count','计数'],['min','最小'],['max','最大'],['avg','平均数'],['distinct count','重复计数'],['distinct-count','重复-计数']],
		"启用" : [['true', '是'], ['false', '否']],
		"缓存" : [['true', '是'], ['false', '否']],
		"高基数" : [['true', '是'], ['false', '否']],
		"可见" : [['true', '是'], ['false', '否']],
		"一直" : [['true', '是'], ['false', '否']],
		"忽略大小写" : [['true', '是'], ['false', '否']],
		"依赖于级别的值" : [['true', '是'], ['false', '否']],
		"修改" : [['true', '是'], ['false', '否']],
		"隐藏成员条件" : [['Never', '从不'], ['IfBlankName', '如果空白名称'],['IfParentsName','如果是父名称']],
		"级别类型" : [['Regular', '正常'], ['TimeYears', '时间年'],['TimeHalfYear','时间半年'],['TimeQuarters','时间季度'],['TimeMonths','时间月'],['TimeWeeks','时间周'],['TimeDays','时间天'],['TimeHours','时间小时'],['TimeMinutes','时间分钟'],['TimeSeconds','时间秒'],['TimeUndefined','时间未知']],
		"特殊成员" : [['true', '是'], ['false', '否']],
		"语言" : [['generic', '通用'], ['access', 'access'],['db2','db2'],['derby','derby'],['firebird','firebird'],['hsqldb','hsqldb'],['mssql','mssql'],['mysql','mysql'],['oracle','oracle'],['postgres','postgres'],['sybase','sybase'],['teradata','teradata'],['ingres','ingres'],['infobright','infobright'],['luciddb','luciddb']],
		"方案" : '/dev/olap/OLAPMetaData.jcp?propertyName=schema'
	}    

});