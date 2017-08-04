import { color } from '../utils/theme'
const Mock = require('mockjs')
const config = require('../utils/config')
const { apiPrefix } = config

const Dashboard = Mock.mock({
  'sales|8': [
    {
      'name|+1': 2008,
      '就业人数|200-500': 1,
      '助教人数|20-50': 1,
      '招生人数|300-550': 1,
    },
  ],
  cpu: {
    'usage|5000-10000': 1,
    space: 58,
    'cpu|40-90': 1,
    'data|20': [
      {
        'cpu|20-80': 1,
      },
    ],
  },
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
/*  'comments|5': [
    {
      name: '@last',
      'status|1-3': 1,
      content: '@sentence',
      avatar () {
        return Mock.Random.image('48x48', Mock.Random.color(), '#757575', 'png', this.name.substr(0, 1))
      },
      date () {
        return `2016-${Mock.Random.date('MM-dd')} ${Mock.Random.time('HH:mm:ss')}`
      },
    },
  ],*/
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
/*  'recentSales|36': [
    {
      'id|+1': 1,
      name: '@last',
      'status|1-4': 1,
      date () {
        return `${Mock.Random.integer(2015, 2016)}-${Mock.Random.date('MM-dd')} ${Mock.Random.time('HH:mm:ss')}`
      },
      'price|10-200.1-2': 1,
    },
  ],*/
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
    name: '钱学森',
    title: '',
    content: '难道搞科学的人只需要数据和公式吗？搞科学的人同样需要有灵感，而我的灵感，许多就是从艺术中悟出来的。',
    avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
  },
  numbers: [
    {
      icon: 'pay-circle-o',
      color: color.green,
      title: '教学投资预算',
      number: 2781,
    }, {
      icon: 'team',
      color: color.blue,
      title: '注册学生',
      number: 3241,
    }, {
      icon: 'message',
      color: color.purple,
      title: '公告发布数量',
      number: 253,
    }, {
      icon: 'appstore-o',
      color: color.red,
      title: '科研项目',
      number: 30,
    },
  ],
})

module.exports = {
  [`GET ${apiPrefix}/dashboard`] (req, res) {
    res.json(Dashboard)
  },
}
