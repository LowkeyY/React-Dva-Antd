Ext.namespace("dev.quality");
dev.quality.RuleGrid = Ext.extend(Ext.grid.PropertyGrid, {
	initComponent : function(){
		using("lib.ComboTree.ComboTree");
        this.lastEditRow = null;
        var store = new dev.quality.QualityStore(this);
        this.propStore = store;
        var cm = new dev.quality.QualityColumnModel(this, store);
		cm.params=this.params;
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
	loadSource:function(type,val,obj,params){
		this.params = params;
		this.tree;
		if(typeof(obj)!='undefined'){
			this.tree=obj;
		}
		var t;
		this.obj;
		var instance=this;
		if(typeof(val)!='undefined'){
			instance.obj=val;
			t=instance.obj.getObjAttributes(instance.obj);
		}/*else{
			t=this.sourceType[type];
		}*/		
		this.programType=type;
		var source={};
		if(typeof(val)=='undefined') val={};
		//var m=this.getColumnModel().editorMap;
		/*if(val.drawout_type=='y')
			t=Ext.apply({
				"选择查询":0
			},t);*/
		for(var i in t){//alert(i);
			source[i]= t[i];
			//source[i]=val[this.indexTable[i]] || t[i]
			/*if(m[i] instanceof Array){
				for(var arr=m[i],j=0;j<arr.length;j++){alert(t[i]+"==="+arr[j][0]+"==="+arr[j][1]);
					if(arr[j][0]==source[i]){alert(arr[j][0]+"==="+source[i]);
						source[i]={
							text:arr[j][1],
							value:arr[j][0]
						};
						break;
					}
				}
			}*/
		}
		this.setSource(source);		
		/*if(val.extra_tables){//主题录入多表处理
			var arr=val.extra_tables;
			for(var i=1;i<arr.length;i++){
				this.store.add(new Ext.grid.PropertyRecord({name:"关联表", value:arr[i]}));
			}
		}*/
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
			/*if(this.state=='edit' && this.canEdit.indexOf(r.data.name)==-1)
				return;*/
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
                var ed = this.colModel.getCellEditor(col, row,e,objName,this.params);
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
    		case "字段名称" :
    			this.obj.setFieldName(value);
    			break;
    		case "错误类型" :
    			this.obj.setErrorType(value);
    			break;
    		case "错误级别" :
    			this.obj.setErrorLevel(value);
    			break;
    		case "错误提示" :
    			this.obj.setErrorMessage(value);
    			break;
			case "关联表名" :
    			this.obj.setForeignTable(value);
    			break;
    	}
    },
});
dev.quality.QualityStore=Ext.extend(Ext.grid.PropertyStore,{
    isEditableValue: function(val){
        return true;
    }
});
dev.quality.GridEditor=Ext.extend(Ext.grid.GridEditor,{
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
		if(this.field.ctype=='combo'){
			return {
				text:this.field.el.dom.value,
				value:this.field.getValue()
			};
		}else
			return this.field.getValue();
	}
});

dev.quality.QualityColumnModel=Ext.extend(Ext.grid.PropertyColumnModel, {
	 createEditor:function(n,conf,objName,params){
		var editor=null;
		if(n=="字段名称"){
			editor=this.getComboBox({
				store:new Ext.data.JsonStore( {
					url: '/dev/quality/getcolumn.jcp?type=col&&object_id='+params.object_id,
					root: 'dataItem',
					autoLoad :true,
					fields:["id","lname"]
				})
			},false);
		}else if(n=="错误级别"){
			editor=this.getComboBox({
				store:new Ext.data.SimpleStore( {
					fields : ['id', 'lname'],
					data : [['0','警告'.loc()],['1','错误'.loc()],['2','关键'.loc()],['3','紧急'.loc()]]
				})
			},false);
		}else if(n=="错误类型"){
			editor=this.getComboBox({
				store:new Ext.data.SimpleStore( {
					fields : ['id', 'lname'],
					data : [['关联错误','关联错误'.loc()],['数据错误','数据错误'.loc()]]
				})
			},false);
		}else{
			editor=this.editors['string'];
		}
		return editor;
	 },
	 getCellEditor : function(colIndex, rowIndex,e,objName,params){
        var p = this.store.getProperty(rowIndex);
        var n = p.data['name'], val = p.data['value'];
		//if(typeof(this.editors[n])=='undefined'){
			this.editors[n]=this.createEditor(n,e,objName,params);
		//}
		/*if(n=="关联表"||n=='引用程序'||n=='程序目录'||(n=='名称'&&objName=='Table')){
			this.editors[n].field.root.id=this.params.parent_id;
		}*/
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
		return new dev.quality.GridEditor(new clazz(Ext.apply( {
			triggerAction : 'all',
			clearTrigger : false,
			valueField : 'id',
			displayField : 'lname',
			mode : 'local',
			ctype : 'combo'
		}, config)));
	}
});