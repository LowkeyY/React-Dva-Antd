Ext.ns("usr.cms");
using("usr.cms.editPNavMenu");

usr.cms.editTestNav = function() {
}
usr.cms.editTestNav.prototype = {
	load : function(framePanel, parentPanel, param, prgInfo) {
		this.propertyLoadDatas = {
			"title" : "123",
			"版权所有" : "123",
			"地址" : "123",
			"邮编" : "10083",
			"建设维护" : "建设维护",
			"分页字数" : "",
			"站点logo图标" : "123",
			"滚动区域关联序号" : "3b55062c-52eb-49ca-9516-d4e05ad2e0d0",
			"滚动区域显示名称" : "通知公告",
			"滚动区域显示条数" : "3",
			"滚动区域稿件标题的最大字数" : "15",
			"图片切换区域关联序号" : "535739e1-bb24-4e8e-b656-19bc27fd7f9a",
			"图片切换区域图片个数" : "4",
			"图片切换区域稿件标题的最大字数" : "18",
			"区域1栏目1" : "e8890987-1be4-4bc4-97c0-3ef071a61a92",
			"区域1栏目1显示名称" : "部门概况",
			"区域1栏目2" : "ec2ac7a1-e8b2-4137-acb4-be973b5797f4",
			"区域1栏目2显示名称" : "机构设置",
			"区域1栏目3" : "f75f8247-811e-4aea-8412-8d4cc814ed1d",
			"区域1栏目3显示名称" : "师资队伍",
			"区域1栏目4" : "5ede0270-c9c2-48b9-bb03-3d5c9ca636f1",
			"区域1栏目4显示名称" : "理论学习",
			"栏目区域2暂缓选择" : "n",
			"栏目区域2关联序号" : "88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b",
			"栏目区域2显示名称" : "规章制度",
			"栏目区域2显示条数" : "5",
			"栏目区域2稿件标题的最大字数" : "12",
			"栏目区域3暂缓选择" : "y",
			"栏目区域3关联序号" : "f0268be5-37f7-45a8-b8bf-f3d200b646a0",
			"栏目区域3显示名称" : "教师风采",
			"栏目区域3显示条数" : "5",
			"栏目区域3稿件标题的最大字数" : "12",
			"栏目区域4暂缓选择" : "n",
			"栏目区域4关联序号" : "88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b",
			"栏目区域4显示名称" : "规章制度",
			"栏目区域4显示条数" : "5",
			"栏目区域4稿件标题的最大字数" : "18",
			"栏目区域4更多内容字样" : "更多",
			"栏目区域5暂缓选择" : "y",
			"栏目区域5关联序号" : "栏目区域5",
			"栏目区域5显示名称" : "栏目区域5",
			"栏目区域5显示条数" : "5",
			"栏目区域5稿件标题的最大字数" : "18",
			"栏目区域5更多内容字样" : "更多",
			"栏目区域6暂缓选择" : "y",
			"栏目区域6关联序号" : "栏目区域6",
			"栏目区域6显示名称" : "栏目区域6",
			"栏目区域6显示条数" : "5",
			"栏目区域6稿件标题的最大字数" : "18",
			"栏目区域6更多内容字样" : "更多",
			"栏目区域7暂缓选择" : "y",
			"栏目区域7关联序号" : "栏目区域7",
			"栏目区域7显示名称" : "栏目区域7",
			"栏目区域7显示条数" : "4",
			"栏目区域7稿件标题的最大字数" : "18",
			"栏目区域7更多内容字样" : "更多",
			"栏目区域8暂缓选择" : "y",
			"栏目区域8关联序号" : "栏目区域8",
			"栏目区域8显示名称" : "栏目区域8",
			"栏目区域8显示条数" : "4",
			"栏目区域8稿件标题的最大字数" : "18",
			"栏目区域8更多内容字样" : "更多",
			"栏目区域9暂缓选择" : "n",
			"栏目区域9关联序号" : "栏目区域9",
			"栏目区域9显示名称" : "栏目区域9",
			"栏目区域9显示条数" : "4",
			"顶部菜单导航最大行数" : "1",
			"顶部菜单导航最大列数" : "8",
			"顶部菜单导航菜单层级" : "2",
			"顶部菜单导航值" : "[{\"id\":\"3b55062c-52eb-49ca-9516-d4e05ad2e0d0\",\"text\":\"通知公告\",\"urls\":\"/3b55062c-52eb-49ca-9516-d4e05ad2e0d0/index.html\",\"leaf\":\"false\",\"items\":[{\"id\":\"f1ab7794-2714-4d57-ae09-da1de2b58698\",\"text\":\"aaaaa\",\"urls\":\"/f1ab7794-2714-4d57-ae09-da1de2b58698/index.html\",\"leaf\":\"true\"},{\"id\":\"8a0de137-4d8b-4afb-a56f-a4287c745c5b\",\"text\":\"bbbbb\",\"urls\":\"/8a0de137-4d8b-4afb-a56f-a4287c745c5b/index.html\",\"leaf\":\"false\"}]},{\"id\":\"e8890987-1be4-4bc4-97c0-3ef071a61a92\",\"text\":\"部门概况\",\"urls\":\"/e8890987-1be4-4bc4-97c0-3ef071a61a92/index.html\",\"leaf\":\"true\"},{\"id\":\"ec2ac7a1-e8b2-4137-acb4-be973b5797f4\",\"text\":\"机构设置\",\"urls\":\"/ec2ac7a1-e8b2-4137-acb4-be973b5797f4/index.html\",\"leaf\":\"true\"},{\"id\":\"f0268be5-37f7-45a8-b8bf-f3d200b646a0\",\"text\":\"教师风采\",\"urls\":\"/f0268be5-37f7-45a8-b8bf-f3d200b646a0/index.html\",\"leaf\":\"true\"},{\"id\":\"f75f8247-811e-4aea-8412-8d4cc814ed1d\",\"text\":\"师资队伍\",\"urls\":\"/f75f8247-811e-4aea-8412-8d4cc814ed1d/index.html\",\"leaf\":\"true\"},{\"id\":\"5ede0270-c9c2-48b9-bb03-3d5c9ca636f1\",\"text\":\"理论学习\",\"urls\":\"/5ede0270-c9c2-48b9-bb03-3d5c9ca636f1/index.html\",\"leaf\":\"true\"},{\"id\":\"88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b\",\"text\":\"规章制度\",\"urls\":\"/88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b/index.html\",\"leaf\":\"true\"},{\"id\":\"a54e2a71-c77c-46a5-86b2-9bc8edaadda0\",\"text\":\"123\",\"urls\":\"http://ww.baidu.com\",\"leaf\":\"true\",\"userdata\":\"on\"}]"
		};
		var items = [{
					"width" : 480,
					"xtype" : "textfield",
					"name" : "顶部菜单导航最大行数",
					"value" : "1",
					"defaultValue" : "1",
					"fieldLabel" : "顶部菜单导航最大行数"
				}, {
					"width" : 480,
					"xtype" : "textfield",
					"name" : "顶部菜单导航最大列数",
					"value" : "8",
					"defaultValue" : "8",
					"fieldLabel" : "顶部菜单导航最大列数"
				}, {
					"width" : 480,
					"xtype" : "textfield",
					"name" : "顶部菜单导航菜单层级",
					"value" : "2",
					"defaultValue" : "2",
					"fieldLabel" : "顶部菜单导航菜单层级"
				}, {
					"width" : 480,
					"xtype" : "hidden",
					"name" : "顶部菜单导航值",
					"value" : "[{\"id\":\"3b55062c-52eb-49ca-9516-d4e05ad2e0d0\",\"text\":\"通知公告\",\"urls\":\"/3b55062c-52eb-49ca-9516-d4e05ad2e0d0/index.html\",\"leaf\":\"false\",\"items\":[{\"id\":\"f1ab7794-2714-4d57-ae09-da1de2b58698\",\"text\":\"aaaaa\",\"urls\":\"/f1ab7794-2714-4d57-ae09-da1de2b58698/index.html\",\"leaf\":\"true\"},{\"id\":\"8a0de137-4d8b-4afb-a56f-a4287c745c5b\",\"text\":\"bbbbb\",\"urls\":\"/8a0de137-4d8b-4afb-a56f-a4287c745c5b/index.html\",\"leaf\":\"false\"}]},{\"id\":\"e8890987-1be4-4bc4-97c0-3ef071a61a92\",\"text\":\"部门概况\",\"urls\":\"/e8890987-1be4-4bc4-97c0-3ef071a61a92/index.html\",\"leaf\":\"true\"},{\"id\":\"ec2ac7a1-e8b2-4137-acb4-be973b5797f4\",\"text\":\"机构设置\",\"urls\":\"/ec2ac7a1-e8b2-4137-acb4-be973b5797f4/index.html\",\"leaf\":\"true\"},{\"id\":\"f0268be5-37f7-45a8-b8bf-f3d200b646a0\",\"text\":\"教师风采\",\"urls\":\"/f0268be5-37f7-45a8-b8bf-f3d200b646a0/index.html\",\"leaf\":\"true\"},{\"id\":\"f75f8247-811e-4aea-8412-8d4cc814ed1d\",\"text\":\"师资队伍\",\"urls\":\"/f75f8247-811e-4aea-8412-8d4cc814ed1d/index.html\",\"leaf\":\"true\"},{\"id\":\"5ede0270-c9c2-48b9-bb03-3d5c9ca636f1\",\"text\":\"理论学习\",\"urls\":\"/5ede0270-c9c2-48b9-bb03-3d5c9ca636f1/index.html\",\"leaf\":\"true\"},{\"id\":\"88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b\",\"text\":\"规章制度\",\"urls\":\"/88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b/index.html\",\"leaf\":\"true\"},{\"id\":\"a54e2a71-c77c-46a5-86b2-9bc8edaadda0\",\"text\":\"123\",\"urls\":\"http://ww.baidu.com\",\"leaf\":\"true\",\"userdata\":\"on\"}]",
					"defaultValue" : "[{\"id\":\"3b55062c-52eb-49ca-9516-d4e05ad2e0d0\",\"text\":\"通知公告\",\"urls\":\"/3b55062c-52eb-49ca-9516-d4e05ad2e0d0/index.html\",\"leaf\":\"false\",\"items\":[{\"id\":\"f1ab7794-2714-4d57-ae09-da1de2b58698\",\"text\":\"aaaaa\",\"urls\":\"/f1ab7794-2714-4d57-ae09-da1de2b58698/index.html\",\"leaf\":\"true\"},{\"id\":\"8a0de137-4d8b-4afb-a56f-a4287c745c5b\",\"text\":\"bbbbb\",\"urls\":\"/8a0de137-4d8b-4afb-a56f-a4287c745c5b/index.html\",\"leaf\":\"false\"}]},{\"id\":\"e8890987-1be4-4bc4-97c0-3ef071a61a92\",\"text\":\"部门概况\",\"urls\":\"/e8890987-1be4-4bc4-97c0-3ef071a61a92/index.html\",\"leaf\":\"true\"},{\"id\":\"ec2ac7a1-e8b2-4137-acb4-be973b5797f4\",\"text\":\"机构设置\",\"urls\":\"/ec2ac7a1-e8b2-4137-acb4-be973b5797f4/index.html\",\"leaf\":\"true\"},{\"id\":\"f0268be5-37f7-45a8-b8bf-f3d200b646a0\",\"text\":\"教师风采\",\"urls\":\"/f0268be5-37f7-45a8-b8bf-f3d200b646a0/index.html\",\"leaf\":\"true\"},{\"id\":\"f75f8247-811e-4aea-8412-8d4cc814ed1d\",\"text\":\"师资队伍\",\"urls\":\"/f75f8247-811e-4aea-8412-8d4cc814ed1d/index.html\",\"leaf\":\"true\"},{\"id\":\"5ede0270-c9c2-48b9-bb03-3d5c9ca636f1\",\"text\":\"理论学习\",\"urls\":\"/5ede0270-c9c2-48b9-bb03-3d5c9ca636f1/index.html\",\"leaf\":\"true\"},{\"id\":\"88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b\",\"text\":\"规章制度\",\"urls\":\"/88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b/index.html\",\"leaf\":\"true\"},{\"id\":\"a54e2a71-c77c-46a5-86b2-9bc8edaadda0\",\"text\":\"123\",\"urls\":\"http://ww.baidu.com\",\"leaf\":\"true\",\"userdata\":\"on\"}]",
					"fieldLabel" : "顶部菜单导航值"
				}];
		this.allLanmu = [{
			"id" : "2ae6a2b3-4561-453d-b1cb-f183bd58b957",
			"model" : "1",
			"text" : "首页菜单栏",
			"urls" : "/2ae6a2b3-4561-453d-b1cb-f183bd58b957/index.html",
			"children" : [{
				"id" : "3b55062c-52eb-49ca-9516-d4e05ad2e0d0",
				"model" : "1",
				"text" : "通知公告",
				"urls" : "/3b55062c-52eb-49ca-9516-d4e05ad2e0d0/index.html",
				"children" : [{
					"id" : "f1ab7794-2714-4d57-ae09-da1de2b58698",
					"model" : "1",
					"text" : "aaaaa",
					"urls" : "/f1ab7794-2714-4d57-ae09-da1de2b58698/index.html",
					"leaf" : true
				}, {
					"id" : "8a0de137-4d8b-4afb-a56f-a4287c745c5b",
					"model" : "1",
					"text" : "bbbbb",
					"urls" : "/8a0de137-4d8b-4afb-a56f-a4287c745c5b/index.html",
					"children" : [{
						"id" : "c977a7e3-6d5a-4d69-ab0f-7594222bd752",
						"model" : "1",
						"text" : "ccccc",
						"urls" : "/c977a7e3-6d5a-4d69-ab0f-7594222bd752/index.html",
						"leaf" : true
					}],
					"leaf" : false
				}],
				"leaf" : false
			}, {
				"id" : "88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b",
				"model" : "1",
				"text" : "规章制度",
				"urls" : "/88ccbb78-abd2-4edc-9b7a-24b09e4d5c1b/index.html",
				"leaf" : true
			}, {
				"id" : "f0268be5-37f7-45a8-b8bf-f3d200b646a0",
				"model" : "1",
				"text" : "教师风采",
				"urls" : "/f0268be5-37f7-45a8-b8bf-f3d200b646a0/index.html",
				"leaf" : true
			}, {
				"id" : "f75f8247-811e-4aea-8412-8d4cc814ed1d",
				"model" : "1",
				"text" : "师资队伍",
				"urls" : "/f75f8247-811e-4aea-8412-8d4cc814ed1d/index.html",
				"leaf" : true
			}, {
				"id" : "5ede0270-c9c2-48b9-bb03-3d5c9ca636f1",
				"model" : "1",
				"text" : "理论学习",
				"urls" : "/5ede0270-c9c2-48b9-bb03-3d5c9ca636f1/index.html",
				"leaf" : true
			}, {
				"id" : "e8890987-1be4-4bc4-97c0-3ef071a61a92",
				"model" : "1",
				"text" : "部门概况",
				"urls" : "/e8890987-1be4-4bc4-97c0-3ef071a61a92/index.html",
				"leaf" : true
			}, {
				"id" : "1d58672f-ed06-47c8-8305-bdddf37e5f58",
				"model" : "1",
				"text" : "教育教学",
				"urls" : "/1d58672f-ed06-47c8-8305-bdddf37e5f58/index.html",
				"leaf" : true
			}, {
				"id" : "fc2f66ab-7360-416b-ab94-4ae3e2c11d3a",
				"model" : "1",
				"text" : "教学资源",
				"urls" : "/fc2f66ab-7360-416b-ab94-4ae3e2c11d3a/index.html",
				"leaf" : true
			}, {
				"id" : "ec2ac7a1-e8b2-4137-acb4-be973b5797f4",
				"model" : "1",
				"text" : "机构设置",
				"urls" : "/ec2ac7a1-e8b2-4137-acb4-be973b5797f4/index.html",
				"leaf" : true
			}, {
				"id" : "ff23951f-b243-455a-8ee3-6154bdb968da",
				"model" : "1",
				"text" : "党建工作",
				"urls" : "/ff23951f-b243-455a-8ee3-6154bdb968da/index.html",
				"leaf" : true
			}, {
				"id" : "a54e2a71-c77c-46a5-86b2-9bc8edaadda0",
				"model" : "1",
				"text" : "科学研究",
				"urls" : "/a54e2a71-c77c-46a5-86b2-9bc8edaadda0/index.html",
				"leaf" : true
			}, {
				"id" : "f53ab140-0239-4df3-8c67-2d1ad6fc6598",
				"model" : "1",
				"text" : "新的栏目",
				"urls" : "/f53ab140-0239-4df3-8c67-2d1ad6fc6598/index.html",
				"leaf" : true
			}, {
				"id" : "535739e1-bb24-4e8e-b656-19bc27fd7f9a",
				"model" : "2",
				"text" : "图片栏目",
				"urls" : "/535739e1-bb24-4e8e-b656-19bc27fd7f9a/index.html",
				"leaf" : true
			}],
			"leaf" : false
		}, {
			"id" : "a2741e49-353e-4e0a-95c2-c1c9da277183",
			"model" : "1",
			"text" : "底部菜单栏",
			"urls" : "/a2741e49-353e-4e0a-95c2-c1c9da277183/index.html",
			"leaf" : true
		}];
		
		var win = parentPanel.findParentByType(Ext.Window);
		win.setTitle("顶部菜单导航");
		win.scope = {
			param : {
				dataId : "00edbaad-ae90-449c-989c-cca5fd0ebf1c"
				}
		};
		this.mainPanel = new Ext.Panel(usr.cms.editPNavMenu(items, Ext.apply([],this.allLanmu), win, win , false));

		parentPanel.add(this.mainPanel);
		parentPanel.doLayout();
	}
}