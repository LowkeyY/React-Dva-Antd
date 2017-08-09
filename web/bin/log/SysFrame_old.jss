Ext.namespace("bin");
Ext.namespace("bin.log");

bin.log.SysFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		using("bin.log.SysStasticPanel");
		this.stasticPanel =new bin.log.SysStasticPanel();
		var container = new Ext.Panel({
			border: false,
			layout: 'border',
			items: [this.stasticPanel]
		});
		return container;
	}     
});