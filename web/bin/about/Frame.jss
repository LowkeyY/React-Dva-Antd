Ext.namespace("bin.about");

bin.about.Frame = function(){

}
bin.about.Frame.prototype = {
	init : function(){
		var win = new Ext.Window({
			width : 776,
			height : 516,
			icon : '/themes/icon/common/quote.gif',
			autoScroll : false,
			layout : 'fit',
			modal : true,
			title : '关于平台'.loc(),
			items : new Ext.Panel({
				html : '	<div style="font:bold 25px/30px arial,sans-serif;margin-bottom: 20px;overflow: hidden; padding: 5px 30px;color: black;line-height: 1.8em; border-bottom:1px dotted black;">平台简介(v5.3)</div>'
						+ '	<div style=" font-size: 12px;color: #999; margin:0 35px; padding-top:10px;">'
						+ '			<p>     基于WEB的大型数据库软件开发平台是用于进行数据库应用软件开发的软件，是在现有的操作系统平台和软件基础架构平台之上新生出的一个层级，它的主要特点就是以业务为导向，可快速构建应用软件。采用这种平台可以很大的提高软件开发效率，并能快速地满足用户变化的需求。平台提供了一个生产环境，能够快速定制成稳定、安全、功能强大的应用软件。平台同时也提供了一套标准的程序开发与运行环境，通过平台上提供的辅助开发工具，遵循现有的定制开发流程，应用开发人员可以方便快速的定制出所需要的目标程序。总的说来数据库软件开发平台主要有以下几个特点：</p>'
						+ '			<p>•	可快速构建应用软件架构</p>'
						+ '			<p>•	可提高软件开发效率</p>'
						+ '			<p>•	快速地满足用户变化的需求</p>'
						+ '			<p>•	提高软件的重用性</p>'
						+ '			<p>•	提高开发软件的规范化</p>'
						+ '			<p>•	降低维护成本</p>'
						+ '			<p>   当前的软件系统是基于本平台开发的，是基于平台功能定制而成的信息系统。</p>'
						+ '	</div>'
						+ '	<div style="font-size: 12px;margin: 20px 50px 5px; float:right;color: #999;">'
						+ '			版本号:v5.3' + '	</div>'
			})
		});
		win.show();		
	}
}