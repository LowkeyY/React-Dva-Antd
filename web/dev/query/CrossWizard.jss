Ext.namespace("dev.query");

dev.query.CrossWizard = function(query,rename,COLM,check){

	var o = query.getByRename(rename);
	var tName = o.tableName;
	var list = o.columns;

	var colNames=[];
	for(var i=0;i<list.length;i++){
		var colItem=[list[i],list[i]];
		colNames.push(colItem);
	}
	var query_id=o.query_id;
	var tabName=o.tableName;
	var queryparams=o.params;
	var isSys=o.isSys;
	var params={};
	if(queryparams){
		for(var i=0;i<queryparams.length;i++){
			var param = queryparams[i];
			if(param[1].trim()=='')
				continue;
			params['_X'+param[0]]=param[1];
		}
	}
	params['query_id']=query_id;
	params['query_name']=tabName;

	var colStore = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data : colNames
    });

	var operationStore = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data : [["MAX","MAX"],["SUM","SUM"],["AVG","AVG"],["MIN","MIN"],["6","COUNT"]]
    });

	this.valueStore=new Ext.data.JsonStore({
		url: '/dev/query/cross.jcp',
		autoLoad:'false',
		root: 'items',
		fields:["value","text"]
	});
	this.itemValue=new lib.multiselect.ItemSelector({
			name:"itemValue",
			hidden:false,
			dataFields:["value", "text"],
			fromData:[],
			fromStore:this.valueStore,
			mode:'remote',
			toData:[],
			width:400,
			hideLabel:true,
			msWidth:180,
			msHeight:90,
			drawTopIcon:false,
			drawBotIcon:false,
			valueField:"value",
			displayField:"text",
			imagePath:"/lib/multiselect",
			toLegend:'已选值'.loc(),
			fromLegend:'可选值'.loc()
	});
	this.wizard = new lib.Wizard.Wiz({
        title : '交叉查询设定向导'.loc(),          
        headerConfig : {
            title : '交叉查询设定'.loc()   
        }, 
        cardPanelConfig : {
            defaults : {
                baseCls    : 'x-small-editor',
                bodyStyle  : 'padding:10px 15px 5px 80px;background-color:#F6F6F6;',
                border     : false    
            }
        },   
        cards : [
           this.step1=new  lib.Wizard.Wiz.Card({
                title : '选择交叉字段'.loc(),
				monitorValid:false,
                items : [{
                        border    : false,
                        bodyStyle : 'background:none;padding-bottom:30px;',
                        html      : '选择设定分组字段,交叉关联字段,及交叉主键.'.loc()
                    },
					this.D2=new Ext.form.ComboBox({
						fieldLabel: '分组字段'.loc(),
						valueField:'value',
						displayField:'text',
						triggerAction:'all',
						mode:'local',
						store:colStore,
						name:'group',
						allowBlank:false
					}),
					this.D1=new Ext.form.ComboBox({
						fieldLabel: '交叉主键'.loc(),
						valueField:'value',
						displayField:'text',
						triggerAction:'all',
						store:colStore,
						mode:'local',
						name:'mst',
						allowBlank:false
					}),
					this.D3=new Ext.form.ComboBox({
						fieldLabel: '交叉值字段'.loc(),
						valueField:'value',
						displayField:'text',
						triggerAction:'all',
						store:colStore,
						mode:'local',
						name:'sec',
						allowBlank:false
					})
					]    
            }),
            this.step2=new  lib.Wizard.Wiz.Card({
                title        : '交叉值设置'.loc(),
                monitorValid : true,
                defaults     : {
                    labelStyle : 'font-size:11px'
                },
                items : [{
                        border    : false,
                        bodyStyle : 'background:none;padding-bottom:10px;',
                        html      : '选择设定查询值汇总方式,并选择要输出的交叉分组列!'.loc()
                    },
                    this.defValue=new Ext.form.TextField({
                        name       : 'def_value',
                        fieldLabel : '默认值'.loc(),
						width:200,
						value:0,
                        allowBlank : false
                    }),
					this.aggregate=new Ext.form.ComboBox({
						fieldLabel: '聚合函数'.loc(),
						width:200,
						valueField:'value',
						displayField:'text',
						triggerAction:'all',
						store:operationStore,
						value:'MAX',
						mode:'local',
						name:'aggregate',
						allowBlank:false
					}),
					{
                        border    : false,
                        bodyStyle : 'background:none;padding-bottom:5px;',
                        html      : '选择交叉字段值:'.loc()
                    },
					this.itemValue,
				    this.otherText=new Ext.form.TextField({
                        name       : 'other_text',
						width:200,
                        fieldLabel : '其余划分为'.loc()
                    })
                ]    
            })   
        ]
    });
	this.step1.on('hide',function(){
		params['col_name']=this.D1.getValue();
		this.valueStore.baseParams = params;
		this.valueStore.load();
	},this);

	this.wizard.on('finish',function(){
		var arr=[];
		var func = "MAX";
		if(this.aggregate.getValue()!='')
			func = this.aggregate.getValue();

		var toDataArray=this.itemValue.getValue();
		var toData=toDataArray.split(",");

		var fromData=[];
		for(var i=0;i<this.valueStore.getCount();i++){
			if(this.valueStore.getAt(i).get('value')!='')
				fromData[i]=this.valueStore.getAt(i).get('value');
		}

		for(var i=0;i<fromData.length;i++){
			if(isSys)
				arr[i] = [fromData[i],1,func+"(case when "+rename+"."+this.D1.getValue()+"='"+fromData[i]+"' then "+rename+"."+this.D3.getValue()+" else "+ this.defValue.getValue()+" end)"];
			else
				arr[i] = [fromData[i],1,func+"(case when ["+rename+"."+this.D1.getValue()+"]='"+fromData[i]+"' then ["+rename+"."+this.D3.getValue()+"] else "+ this.defValue.getValue()+" end)"];
		}

		if(toData.length > 0&&this.otherText.getValue()!=''){
			str=[func+"(case when"]
			for(var i=0;i<toData.length;i++){
				if(i!=0)
					str.push(" or");
			if(isSys)
				str.push(" "+rename+"."+this.D1.getValue()+"='"+toData[i]+"'");
			else
				str.push(" ["+rename+"."+this.D1.getValue()+"]='"+toData[i]+"'");		
			}
			str.push(" then "+ this.otherText.getValue()+" else "+this.defValue.getValue()+" end)");
			arr[arr.length] = [this.otherText.getValue(),1,str.toString()];
		}

		var groupString='';
		if(isSys)
			groupString=" group by "+rename+"."+this.D2.getValue();
		else
			groupString=" group by ["+rename+"."+this.D2.getValue()+"]";

		for(var i=0;i<arr.length;i++){
			var line = arr[i]
			COLM.list.push(new Columns.Node(line[0],line[2],"suk"));
		}
		COLM.refresh();
		check.value += groupString;
	},this)
};
dev.query.CrossWizard.prototype={
	show : function(){
		this.wizard.show(); 
	}
}