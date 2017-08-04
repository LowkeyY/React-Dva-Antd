import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'
import { isEmptyObject } from './utils'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const getPermission = (permissions, path) => {
  let permission
  if (permissions && path) {
    permissions.map((item, key) => {
      if (item === path || item[path]) {
        permission = item === path ? { path: `./${path}`, name: path } : item
      }
    })
  }
  return permission
}

const userRouter = (path, user) => {
  return user && getPermission(user.permissions, path) || {}
}

const Routers = function ({ history, app }) {
  const getCurrentUser = () => app._store.getState().app.user
  let isFrist = true

  function hasCurrentUser (nextState, replace, callback) {
    const user = getCurrentUser()
    // console.log(user , 'will ' + (isEmptyObject(user) ? 'replace to login' : 'callback'));
    !isEmptyObject(user) && callback() || replace('/login')
  }

  console.log('routes:hasCurrentUser -> user :', getCurrentUser())

  const routes = [
    {
      path: '/',
      component: App,
/*      onEnter : function(nextState, replace, callback){
        if(isFrist){
          isFrist = false;
          callback();
        } else {
          !isEmptyObject(user) && callback() || replace('/login');
        }
      },*/
      onEnter (nextState, replace, callback) {
        console.log('routes:onEnter -> nextState : ', nextState)
        callback()
      },
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          onEnter: hasCurrentUser,
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'user',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user'))
              cb(null, require('./routes/user/'))
            }, 'user')
          },
        }, {
          path: 'user/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user/detail'))
              cb(null, require('./routes/user/detail/'))
            }, 'user-detail')
          },
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'request',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/request/'))
            }, 'request')
          },
        }, {
          path: 'UIElement/iconfont',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/iconfont/'))
            }, 'UIElement-iconfont')
          },
        }, {
          path: 'UIElement/search',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/search/'))
            }, 'UIElement-search')
          },
        }, {
          path: 'UIElement/dropOption',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/dropOption/'))
            }, 'UIElement-dropOption')
          },
        }, {
          path: 'UIElement/layer',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/layer/'))
            }, 'UIElement-layer')
          },
        }, {
          path: 'UIElement/dataTable',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/dataTable/'))
            }, 'UIElement-dataTable')
          },
        }, {
          path: 'UIElement/editor',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/UIElement/editor/'))
            }, 'UIElement-editor')
          },
        }, {
          path: 'chart/lineChart',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/lineChart/'))
            }, 'chart-lineChart')
          },
        }, {
          path: 'chart/barChart',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/barChart/'))
            }, 'chart-barChart')
          },
        }, {
          path: 'chart/areaChart',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/chart/areaChart/'))
            }, 'chart-areaChart')
          },
        }, {
          path: 'systemlog',
          getComponent (nextState, cb) {
            registerModel(app, require('./systemlog/models'))
            require.ensure([], require => {
              cb(null, require('./systemlog/routes/'))
            }, 'systemlog')
          },
        },
        // 设置访问日志路由
        {
          path: 'accesslogs',
          getComponent (nextState, cb) {
            registerModel(app, require('./accesslogs/models'))
            require.ensure([], require => {
              cb(null, require('./accesslogs/routes/'))
            }, 'accesslogs')
          },
        },{
          path: '*',
          onEnter: hasCurrentUser,
          getComponent (nextState, cb) {
            console.log('routes * ... user :', getCurrentUser())
            let { path, name } = userRouter(nextState.params && nextState.params.splat, app._store.getState().app.user)
            if (path && name) {
              registerModel(app, require(`${path}/models/index`))
              require.ensure([], require => {
                cb(null, require(`${path}/routes/index`))
              })
            } else {
              require.ensure([], require => {
                cb(null, require('./routes/error/'))
              }, 'error')
            }
          },
        },
      ],
    },
  ]
  registerModel(app, require('./systemlog/static'))
  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
