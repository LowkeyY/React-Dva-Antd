
Ext.namespace("bin.task");
using("lib.jsvm.MenuTree");
using("bin.task.SchedulePanel");
using("lib.CachedPanel.CachedPanel");
using("bin.task.TaskNavPanel");
useJS('/bin/task/scheduleMain.js',function(){});

bin.task.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
			this.mainPanel=new lib.CachedPanel.CachedPanel({
					id:'ReportMain',
					statusBar:true,
					region:'center',
					split:true
			}); 
			this.frames.set('Task',this);
			this.frames.set('TaskLog',this);
			this.navPanel =new bin.task.TaskNavPanel('schedule',this.frames);
			this.Frame = new Ext.Panel({
					border: false,
					layout: 'border',
					items: [this.navPanel,this.mainPanel]
			});
			return this.Frame;
	},
	doWinLayout:function(win){
		this.navPanel.init();
	}
});
