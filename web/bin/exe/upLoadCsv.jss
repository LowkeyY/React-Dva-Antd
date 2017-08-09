Ext.namespace("bin.exe");

loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");

bin.exe.upLoadCsv = function(w,h,m){      
	this.win;
	this.w = w;
	this.h = h;
	this.m = m;
	this.param={};
	this.param['objectId']=m.param.objectId;

	this.setCSVPanel = new Ext.FormPanel({
        labelWidth: 80, 
		labelAlign: 'center',
        border:true,
		bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
			{
				xtype:'fileupload',    
				fieldLabel  : '上传CSV文件'.loc(),
				name:'fileField',
				state:'new',
				maxSize:40*1024*1024,
				width:200
			}  		
	]
	});
	lib.upload.Uploader.setEnctype(this.setCSVPanel);     
	this.win =  new Ext.Window({
		title:'上传窗口'.loc(),
		layout:'fit',
		width:this.w,
		height:this.h,
		scope:parent.WorkBench,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.setCSVPanel],
		buttonAlign:'center',
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
};

Ext.extend(bin.exe.upLoadCsv, Ext.Window, {
	show : function(){
		var frm = this.setCSVPanel.form;
		this.win.show(this); 
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var frm = this.setCSVPanel.form;
			frm.submit({ 
				url:'/bin/exe/upLoadCsv.jcp',
				method: 'POST',  
				params:this.param,
				scope:this,   
				clientvalidation:true,
				success:function(form, action){
					var msg= action.result.message;
					Ext.MessageBox.show({
							 title: '成功'.loc(),
							 msg:msg,       
							 buttons: Ext.MessageBox.OK
					 });
					this.m.getStore().reload({params:{}});   
					this.win.close();
				},								
				failure: function(form, action) {
						var msg="";
						if(action.result)
							msg=action.result.message;
						else if(action.failureType)
							msg='提交过程错误'.loc()+action.failureType;
						Ext.MessageBox.show({
								 title: '错误',
								 msg:'数据提交失败!,原因:'.loc()+'<br>'+msg,       
								 buttons: Ext.MessageBox.OK,
								 icon: 'ext-mb-error'
						 });
				}
			});
		
    }
});

