const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { apiPrefix } = config

let usersListData = Mock.mock({
/*  'data|8-10': [
    {
      id: '@id',
      name: '@name',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|30-60': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      },
    },
  ],*/
  data: [{
    id: '@id',
    name: 'zhangming',
    nickName: '张明',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '@id',
    name: 'wangwu',
    nickName: '王武',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '@id',
    name: 'wangchunming',
    nickName: '王春明',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '@id',
    name: 'jianghe',
    nickName: '江河',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'weiwu',
    nickName: '韦伟',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'zhangshanling',
    nickName: '张山林',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'wangwen',
    nickName: '王文',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'xiechunming',
    nickName: '谢春明',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'xiongguodong',
    nickName: '熊果栋',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '@id',
    name: 'wangmeng',
    nickName: '王梦',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'renyun',
    nickName: '任云',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'wangwuyi',
    nickName: '王武一',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'wangwenjing',
    nickName: '王文静',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'guanxiaoxiao',
    nickName: '关小小',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }, {
    id: '@id',
    name: 'caihuan',
    nickName: '蔡环',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'wangyun',
    nickName: '王云',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  },
  {
    id: '@id',
    name: 'liuqing',
    nickName: '刘琴',
    phone: /^1[34578]\d{9}$/,
    'age|30-60': 1,
    address: '@county(true)',
    isMale: '@boolean',
    email: '@email',
    createTime: '@datetime',
    avatar () {
      return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
    },
  }],
})


let database = usersListData.data

const userPermission = {
  DEFAULT: [
    'dashboard', 'chart',
  ],
  ADMIN: [
    'dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart', 'systemlog',
  ],
  DEVELOPER: ['dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart'],
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    realname: '系统管理员',
    password: 'admin',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    username: 'guest',
    realname: '游客账户',
    password: 'guest',
    permissions: userPermission.DEFAULT,
  }, {
    id: 2,
    username: 'wuyanzu',
    realname: '吴彦祖',
    password: '123456',
    permissions: userPermission.DEVELOPER,
  },
]

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {

  [`POST ${apiPrefix}/user/login`] (req, res) {
    const { username, password } = req.body
    const user = adminUsers.filter((item) => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      res.json({ success: true, message: 'Ok', user: {
        id: user[0].id,
        permissions: user[0].permissions,
        username: user[0].username,
        realname: user[0].realname,
      },
      })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${apiPrefix}/user/logout`] (req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`GET ${apiPrefix}/user`] (req, res) {
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    const user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        user.permissions = userItem[0].permissions
        user.username = userItem[0].username
        user.id = userItem[0].id
        user.realname = userItem[0].realname
      }
    }
    response.user = user
    res.json(response)
  },

  [`GET ${apiPrefix}/users`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`POST ${apiPrefix}/user`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter((item) => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/user/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
