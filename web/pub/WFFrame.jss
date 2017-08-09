
Ext.namespace("pub");

using("bin.workflow.WorkFlowNavPanel");
using("bin.workflow.ApplyPanel");
loadcss("bin.workflow.dataView");

pub.WFFrame=function(){
	using("lib.CachedPanel.CachedPanel");
	this.mainPanel=new lib.CachedPanel.CachedPanel({
		id:'WorkflowMain',
		statusBar:true,
		region:'center',
		split:true,
		border:false
	}); 
	this.mainPanel.frames=this.frames=new Ext.ux.FrameParams();
	this.frames.set('Workflow',this);
	this.navPanel =new bin.workflow.WorkFlowNavPanel(this.frames);
	this.mainPanel.on('render',function(){
		this.applyPanel = new bin.workflow.ApplyPanel(); 
		this.mainPanel.add(this.applyPanel.MainTabPanel);
		this.mainPanel.setActiveTab("ApplyPanel");
		this.applyPanel.init();
	},this);
	this.navPanel.on('render',function(){
		this.navPanel.init();
	},this);
	pub.WFFrame.superclass.constructor.call(this,{
			border: false,
			layout: 'border',
			items: [this.navPanel,this.mainPanel]
    });
};
Ext.extend(pub.WFFrame, Ext.Panel, {});
Ext.ux.FrameParams=function(){
	this.params={};
	this.win=null;
}
Ext.ux.FrameParams.prototype={
	createPanel:function(name,obj){
		if(typeof(name)=='object'){
			obj=name;
			name=obj.id||obj.name;
		}else if(typeof(obj)!='undefined'){
			if(typeof(obj)=='function')
				obj=new obj();
		}else{
			throw "����ݴ���";
		}
		this.set(name,obj);
		obj.frames=this;
		return obj;
	},
	set:function(key,value){
		this.params[key]=value;
	},
	get:function(key){
		return this.params[key];
	},
	remove:function(key){
		delete(this.params[key]);
	},
	containsKey:function(key){
		return typeof(this.params[key])!='undefined';
	}
};