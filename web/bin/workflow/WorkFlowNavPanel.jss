
Ext.namespace("bin.workflow");

bin.workflow.WorkFlowNavPanel = function(frames){
	
	this.frames=frames;

	var NavParams={};
	var navPanel=this;

	this.ds = new Ext.data.Store({  
		proxy: new Ext.data.HttpProxy({
			url:"/bin/workflow/getcategory.jcp",
			method:'GET'
		}),
        reader: new Ext.data.JsonReader({
            root: 'dataItem',
            totalProperty: 'totalCount',
            id: 'optionCode'
        }, [
			{name: 'optionCode', mapping: 'optionCode'},
			{name: 'name', mapping: 'name'},
			{name: 'wfNum', mapping: 'wfNum'},
			{name: 'icon', mapping: 'icon'}
        ]),
		autoLoad:false,
        remoteSort: true
    });

    var tpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap" id="{optionCode}">', '<div class="thumb">','<tpl if="wfNum &gt; -1">','<img src="{icon}"  title="{name}({wfNum})" ></div>', '<span class="x-editable">{name}({wfNum})</span>','</tpl>','<tpl if="wfNum==-1">','<img src="{icon}"  title="{name}" ></div>', '<span class="x-editable">{name}</span>','</tpl>','</div>', '</tpl>', '<div class="x-clear"></div>');

    this.waitDv =new Ext.DataView({
			store: this.ds,
			tpl: tpl,
			autoHeight: true,
			singleSelect:true,
            overClass:'x-view-over',
			itemSelector:'div.thumb-wrap'
	 });

	this.waitDv.on('click', function(){
		 var selectedCate=this.waitDv.getSelectedRecords()[0];
		 var params={};
		 Workflow=frames.get('Workflow');
		 Workflow.mainPanel.hideStatus();
		 params['type']=selectedCate.id;
		 if(selectedCate.id=='apply'){
			 if(!Workflow.mainPanel.havePanel("ApplyPanel")){
				using("bin.workflow.ApplyPanel");
				Workflow.applyPanel = new bin.workflow.ApplyPanel(); 
				Workflow.mainPanel.add(Workflow.applyPanel.MainTabPanel);
			 }
				Workflow.mainPanel.setActiveTab("ApplyPanel");
				Workflow.applyPanel.init();
		 }else  if(selectedCate.id=='wait'){
			 if(!Workflow.mainPanel.havePanel("WaitListPanel")){
				using("bin.workflow.WaitListPanel");
				this.waitPanel = new bin.workflow.WaitListPanel(this.frames);
				Workflow.mainPanel.add(this.waitPanel.MainTabPanel);
			 }
			 Workflow.mainPanel.setActiveTab("WaitListPanel");
			 this.waitPanel.showList(params);
		 }else if(selectedCate.id=='send'){
		 		if(!Workflow.mainPanel.havePanel("SendListPanel")){
					using("bin.workflow.SendListPanel");
					this.sendListPanel = new bin.workflow.SendListPanel(this.frames);
					Workflow.mainPanel.add(this.sendListPanel.MainTabPanel);
				}
				this.sendListPanel.showList(params);
				Workflow.mainPanel.setActiveTab("SendListPanel");
		 }else if(selectedCate.id=='authed'){
				if(!Workflow.mainPanel.havePanel("AuthedListPanel")){
					using("bin.workflow.AuthedListPanel");
					this.authedListPanel = new bin.workflow.AuthedListPanel(this.frames);
					Workflow.mainPanel.add(this.authedListPanel.MainTabPanel);
				}
				Workflow.mainPanel.setActiveTab("AuthedListPanel");
				this.authedListPanel.showList(params);
		 }else if(selectedCate.id=='finish'){
		 		if(!Workflow.mainPanel.havePanel("FinishListPanel")){
					using("bin.workflow.FinishListPanel");
					this.finishListPanel = new bin.workflow.FinishListPanel(this.frames);
					Workflow.mainPanel.add(this.finishListPanel.MainTabPanel);
				}
				Workflow.mainPanel.setActiveTab("FinishListPanel");
				this.finishListPanel.showList(params);
		 }
	},this);

	bin.workflow.WorkFlowNavPanel.superclass.constructor.call(this, {
            title: '工作流管理'.loc(),
            region: 'west',
            split: true,
            width: 170,
			scope:this,
            collapsible: true,
			autoScroll:false,
            margins:'0 0 0 0',
            cmargins:'3 3 3 3',
			layout:'fit',
	 	    autoScroll:false,
			frame:false,
			border:true,
			bodyStyle:'height:100%;width:100%;background:#FFFFFF;',
			items: this.waitDv
    });
};     
Ext.extend(bin.workflow.WorkFlowNavPanel, Ext.Panel, {
	init : function(){
		this.ds.baseParams['type']='wait';
		this.ds.load();
	}
});

