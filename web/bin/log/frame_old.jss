Ext.namespace("bin","bin.log");
using("bin.log.StasticPanel");
bin.log.frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.stasticPanel =new bin.log.StasticPanel();
		var container = new Ext.Panel({
			border: false,
			layout: 'border',
			items: [this.stasticPanel]
		});
		return container;

	}     
});