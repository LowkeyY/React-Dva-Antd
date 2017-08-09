Ext.ns("ExternalItems.haiwaizhishigongxiang");

ExternalItems.haiwaizhishigongxiang.MainRightHtml = function() {
}
ExternalItems.haiwaizhishigongxiang.MainRightHtml.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		var mainPanel = new Ext.Panel({

			layout : 'fit',
			border : false,
			html : '<style>.bo{border:1px solid #A6FFFF;height:200px;width:350px;margin-left:20px;float:left;margin-top:20px;}'
					+ '.title{'
					+ 'padding-top:10px;'
					+ 'padding-left:15px;'
					+ 'font-size:20px;'
					+ '}'
					+ '.list{'
					+ 'padding-top:10px;'
					+ 'padding-left:20px;'
					+ 'font-size:16px;'

					+ '}'
					+ '</style>'
					+ '<div style="width:100%">'
					+ '		<div class="bo">'
					+ '			<div class="title"><b>消息通告</b></div>'
					+ '			<div class="list" style="padding-top:15px;"><b>第八届全球油气运移学术研讨会...</b></div>'
					+ '			<div class="list"><b>油气数字制图与管理系统2.0版...</b></div>'
					+ '			<div class="list"><b>印尼+新西兰+马来西亚研究成果...</b></div>'
					+ '			<div class="list"><b>全球所2016年青年技术交流一边...</b></div>'
					+ '			<div class="list"><b>基于公开文献和知识图谱挖掘的...</b></div>'
					+ '		</div>'
					+ '		<div class="bo">'
					+ '			<div class="title"><b>快速链接</b></div>'
					+ '			<div class="list" style="padding-top:15px;"><b>法律法规</b></div>'
					+ '			<div class="list"><b>Windows常见问题解答</b></div>'
					+ '			<div class="list"><b>下载中心</b></div>'
					+ '			<div class="list"><b>帮助平台</b></div>'
					+ '			<div class="list"><b>系统常见问题及解决方案</b></div>'
					+ '		</div>'
					+ '		<div class="bo">'
					+ '			<div class="title"><b>新近上传资料</b></div>'
					+ '			<div class="list" style="padding-top:15px;"><b>齐齐哈尔市委书记侯东炙回见大庆油田...</b></div>'
					+ '			<div class="list"><b>2015年江阴口岸乙酸乙烯酯出口量破10...</b></div>'
					+ '			<div class="list"><b>专访：国际油价或跌破20美元-访问...</b></div>'
					+ '			<div class="list"><b>中国石油天然气管道局希望加快334km的...</b></div>'
					+ '		</div>' + '</div>'

		});
		parentPanel.add(mainPanel);
		parentPanel.doLayout();
	}
}