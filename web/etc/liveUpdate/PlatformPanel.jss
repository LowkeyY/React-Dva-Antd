

loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");

etc.liveUpdate.PlatformPanel = function(frames,from){

	this.frames=frames;

	var ButtonArray=[];
	this.state="create";
	this.params={};
	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/system/systemcreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["system_id","system_name","system_pname","system_type","current_stat","system_desc","creator","lastModifyTime","lastModifyName"]),
		remoteSort: false
	});
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'liveUpdate',
				text: '安装'.loc(),
				state:'create',
				icon: '/themes/icon/common/liveUpdate.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				handler :this.onButtonClick
	}));

//系统初始化

	this.systemForm = new Ext.FormPanel({
        labelWidth: 100, 
		cached:true,
		labelAlign: 'right',
        url:'/etc/liveUpdate/liveUpdate.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:1.0,
				   layout: 'form',
				   border:false,
				   items: [				
							{
								xtype:'fileupload',    
								fieldLabel  : '上传安装文件'.loc(),
								name:'liveUpdatefile',
								pattern:'*.zip',
								state:'new',
								maxSize:40*1024*1024,
								width:500
							}  	
					 ]}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextArea({
							fieldLabel: '序列号'.loc(),
							name: 'serialcode',							
							width: 550,
							height:60,
							maxLength :64,
							maxLengthText : '序列号不能超过{0}个字符!'.loc()
						}),
						new Ext.form.Hidden({
							name: 'type',							
							value:'liveUpdate'
						})
					 ]}
			]
		}
	],
     tbar:ButtonArray
	});

	var el=new Ext.ux.IFrameComponent({id:'liveUpdateConsole',url:'/bin/blank.html',style:'position:relative;left:0; top:0; height:100%; width:100%'});

	this.MainTabPanel=new Ext.Panel({
		border:false,
		id: 'liveUpdateBase',
		layout:'border',
		split:true,
		items: [{
			xtype:'panel',
			layout:'fit',
			border:false,
			minSize: 200,
			region: 'center',
			margins: '0 0 0 0',
			bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
			items:this.systemForm
		},{
			id:'cpPanel',
			minSize: 150,
            height: 250,
			title: '控制台'.loc(),
			region:'south',
			split: true,
			animFloat:true,
			layout:'fit',
			style:'font-size:14px;font-family:'+'宋体'.loc()+';', 
			margins:'1 0 1 1',
			cmargins:'1 1 1 1',
			collapsible: true,
			maxSize: 450,
			items:el,
			border:false
		}]
	});
};
etc.liveUpdate.PlatformPanel.prototype={
	onButtonClick : function(item){
		var System = this.frames.get("System");
		var frm=this.systemForm.form;
		if(item.btnId=='liveUpdate'){
			var saveParams={};
			saveParams['type']='liveUpdate';
		    if (frm.isValid()){
				var form = Ext.getDom(this.systemForm.form.el.dom);
				form.target = "liveUpdateConsole";
				form.method = 'POST';
				form.enctype = form.encoding = 'multipart/form-data';
				form.action = '/etc/liveUpdate/liveUpdate.jcp';
				form.submit();
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}
    }
};

