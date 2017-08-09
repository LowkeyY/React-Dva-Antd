Ext.namespace("dev.query");

dev.query.SetParam = function(value,w,h){
	this.win;
	this.w = w;
	this.h = h;
	this.value = value;

	var defaultTypes=[["@[currentMonth]",'当前月'.loc()]
					 ,["@[currentYear]",'当前年'.loc()]
					 ,["@[currentDay]",'当前日期'.loc()]
					 ,["@[previousYear]",'前一年'.loc()]
					 ,["@[previousMonth]",'前一月'.loc()]
					 ,["@[previousDay]",'前一天'.loc()]
					 ,["@[previousMonthDay]",'上月当前天'.loc()]
					 ,["@[nextYear]",'下一年'.loc()]
					 ,["@[nextMonth]",'下一月'.loc()]
					 ,["@[nextDay1]",'下一天'.loc()]
					 ,["@[nextMonthDay]",'下月当前天'.loc()]
					 ,["@[ip]",'访问IP地址'.loc()]
					 ,["@[deptId]",'访问用户部门代码'.loc()]
					 ,["@[realName]",'访问用户姓名'.loc()]
					 ,["@[roleName]",'访问用户职位名称'.loc()]
					 ,["@[status]",'访问用户状态'.loc()]
					 ,["@[roleId]",'访问用户职位'.loc()]
					 ,["@[userId]",'访问用户代码'.loc()]
					 ,["@[parentDept]",'访问用户父部门'.loc()]
					 ,["@[allParentDept]",'访问用户所有父部门串'.loc()]
					 ,["@[exportData]",'导入数据代码'.loc()]
					 ,["@[dataId]",'当前数据代码'.loc()]
					 ];

	var defaultStore=new Ext.data.SimpleStore({fields:["code","option"],data:defaultTypes});
	var defaultCmb=new Ext.form.ComboBox({
		fieldLabel:'缺省值'.loc(),
		name: 'defaultValue',
		width:150,
		store:defaultStore,
		displayField:"option",
		valueField:"code",
		typeAhead:true,
		editable:true,
		mode:"local",
		triggerAction:"all",
		selectOnFocus:true
	});

	this.SetParamPanel = new Ext.FormPanel({
        labelWidth: 80, 
		labelAlign: 'right',
        border:true,
		bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.45,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '参数名'.loc(),
							name: 'paramName',
							width: 120,
							allowBlank:false,
							blankText:'参数名必须提供.'.loc()
						})
					 ]},
				{ 
				   columnWidth:0.55,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '类型'.loc(),
							name: 'utype',
							width: 120,
							allowBlank:false,
							blankText:'类型名必须提供.'.loc()
						})
					 ]}
			]
		},{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.45,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '表达式前缀'.loc(),
							name: 'perfix',
							width: 120
						})
					 ]},
				{ 
				   columnWidth:0.55,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '表达式后缀'.loc(),
							name: 'suffix',
							width: 120
						})
					 ]}
			]
		},{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.45,
				   layout: 'form',
				   border:false,
				   items: [	
					   new Ext.form.RadioGroup({
							fieldLabel:'参数不为空'.loc(),
							scope:this,
							name: 'notNull',
							items: [
								{boxLabel: '是'.loc(), name: 'notNull', inputValue:'Y',checked: true},
								{boxLabel: '否'.loc(), name: 'notNull', inputValue:'N'}
							]
						})
				]},{ 
				   columnWidth:0.55,
				   layout: 'form',
				   border:false,
				   items: [	defaultCmb
				]}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',			   
				   border:false,
				   html:'&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; '+'示例'.loc()+': &nbsp;&nbsp; ${paramName} like %tab0.name%'
				
				}
			]
		},
		{   
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   html:'&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; '+'对应'.loc()+':&nbsp;&nbsp; '+'参数名'.loc()+'="paramName" '+'表达式前缀'.loc()+'="[AND|OR|...]" '+'表达式后缀'.loc()+'="like %tab0.name%"'}
			]      
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   html:'&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; '+'注意'.loc()+':&nbsp;&nbsp; "[AND|OR|...]" '+'中的值为可选项,根据上下文关系选择'.loc()
			    }
			]
		}
		
	]
	});

	var desktop = WorkBench.Desk.getDesktop();
	this.win = desktop.getWindow('SetParam');

	if(!this.win){
		this.win =  new Ext.Window({
			title:'设置参数'.loc(),
			layout:'fit',
			width:this.w,
			height:this.h,
			scope:parent.WorkBench,
			closeAction:'hide',
			plain: true,
			modal:true,
			items:[this.SetParamPanel],
			buttons: [{
				text:'提交'.loc(),
				scope:this,
				handler: this.windowConfirm
			},{
				text: '取消'.loc(),
				scope:this,
				handler: this.windowCancel
			}]
		});
	}
};

Ext.extend(dev.query.SetParam, Ext.Window, {
	show : function(){
		var frm = this.SetParamPanel.form;
		this.win.show(this); 
		frm.findField('perfix').setValue(" and ");	
		frm.findField('utype').setValue("2");	
		frm.findField('suffix').setValue(this.value);	
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var frm = this.SetParamPanel.form;
		var paramName = frm.findField('paramName').getValue();	
		var uType = frm.findField('utype').getValue();
		var perfix = frm.findField('perfix').getValue();	
		var suffix = frm.findField('suffix').getValue();
		var defaultValue = frm.findField('defaultValue').getValue();
		var notNull = frm.findField('notNull').getValue();

		var value;
		if (frm.isValid()){
			if(notNull=="Y"){
				value = perfix+' '+suffix+'=\'${'+paramName+'|'+uType+'|'+defaultValue+'}\'';
			}else{
				value = ' ${'+paramName+'|'+perfix+' '+suffix+'=\'|\'|'+uType+'|'+defaultValue+'}';
			}
			Ext.get('check').dom.value+=value;
			this.win.close();
		}else{
			Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
		}
    }
});

