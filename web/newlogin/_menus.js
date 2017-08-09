/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global cunovs, __FILE__, Java, PotalUnits, SystemEvent, CertManager, com */

cunovs.defineCalss(__FILE__, {
    service: function (jjs) {
        function mathNum(lowerValue, upperValue){
            var choices = upperValue - lowerValue + 1; 
            return Math.floor(Math.random() * choices + lowerValue); 
        }
        
        var sales = [{
            'name': 2009,
            '就业人数': 300,
            '助教人数': 60,
            '招生人数': 288   
        },{
            'name': 2010,
            '就业人数': 289,
            '助教人数': 33,
            '招生人数': 350    
        } , {
            'name': 2011,
            '就业人数': 300,
            '助教人数': 35,
            '招生人数': 375
        } ,  {
            'name': 2012,
            '就业人数': 295,
            '助教人数': 35,
            '招生人数': 300
        } ,  {
            'name': 2013,
            '就业人数': 330,
            '助教人数': 30,
            '招生人数': 310
        } ,  {
            'name': 2014,
            '就业人数': 275,
            '助教人数': 38,
            '招生人数': 298
        } ,  {
            'name': 2015,
            '就业人数': 293,
            '助教人数': 40,
            '招生人数': 321
        } ,  {
            'name': 2016,
            '就业人数': 320,
            '助教人数': 45,
            '招生人数': 312
        }];
        var cpuData = [];
        for(var i = 0 ; i < 20 ; i++){
            cpuData.push({cpu : mathNum(20 , 80)});
        }
        var cpu = {
            usage : 6500,
            space : 98,
            cpu : 88,
            data: cpuData
        }
        var completed = [];
        for(var i = 0 , j = 2006; i < 12 ; i++ , j++){
            completed.push({
                name : j ,
                '学生人数' : mathNum(300 , 800),
                '教师人数' : mathNum(80 , 120)
            })
        };
        
        var dashboard = {
            sales : sales,
            cpu : cpu,
            completed : completed,
            browser: [
                {
                    name: '教育厅网站',
                    percent: 43.3,
                    status: 1,
                },
                {
                    name: '新浪网',
                    percent: 33.4,
                    status: 2,
                },
                {
                    name: '人民网',
                    percent: 34.6,
                    status: 3,
                },
                {
                    name: '人才交流中心',
                    percent: 12.3,
                    status: 4,
                },
                {
                    name: '搜狐网',
                    percent: 3.3,
                    status: 1,
                },
                {
                    name: '网易网',
                    percent: 2.53,
                    status: 1,
                },
            ],
            user: {
                name: 'zuiidea',
                email: 'zuiiidea@.gmail.com',
                sales: 3241,
                sold: 3556,
                avatar: 'http://tva4.sinaimg.cn/crop.0.0.996.996.180/6ee6a3a3jw8f0ks5pk7btj20ro0rodi0.jpg',
            },
            'completed|12': [
                {
                    'name|+1': 2008,
                    '学生人数|200-1000': 1,
                    '教师人数|20-100': 1,
                },
            ],
            comments: [{
                    name: '[学院新闻]',
                    status: 1,
                    content: '我校召开2017年征兵工作会议',
                    date: '2017-05-24',
                }, {
                    name: '[学院新闻]',
                    status: 1,
                    content: '学院新闻]我校举办第九届就业洽谈会',
                    date: '2017-05-23',
                }, {
                    name: '[学院新闻]',
                    status: 1,
                    content: '“夏荷”云计划托举大学生青春飞扬—我校荣获全国高校校园文化建',
                    date: '2017-04-19',
                }],
            recentSales: [{
                    id: 1,
                    name: '2007—2008年第二学期社团评优活动',
                    date: '2017-05-17',
                }, {
                    id: 2,
                    name: '英语晨读活动',
                    date: '2017-04-24',
                }, {
                    id: 3,
                    name: '武术协会活动',
                    date: '2017-04-05',
                }, {
                    id: 4,
                    name: '炫舞社活动',
                    date: '2017-04-05',
                }, {
                    id: 5,
                    name: '营销协会工作活动报告',
                    date: '2017-04-05',
                },
            ],

            quote: {
                name: '',
                title: '',
                content: '难道搞科学的人只需要数据和公式吗？搞科学的人同样需要有灵感，而我的灵感，许多就是从艺术中悟出来的。',
                avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
            },
            numbers: [
                {
                    icon: 'pay-circle-o',
                    color: '#64ea91',
                    title: '教学投资预算',
                    number: 2781,
                }, {
                    icon: 'team',
                    color: '#8fc9fb',
                    title: '注册学生',
                    number: 3241,
                }, {
                    icon: 'message',
                    color: '#d897eb',
                    title: '公告发布数量',
                    number: 253,
                }, {
                    icon: 'appstore-o',
                    color: '#f69899',
                    title: '科研项目',
                    number: 30,
                },
            ],
        }
        
        return dashboard;
    }
});
