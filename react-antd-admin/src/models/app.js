import { query, logout } from '../services/app'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config, isEmptyObject } from '../utils'
const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      console.log('models/app:subscriptions -> setup : ', (new Date()).toLocaleString())
      dispatch({ type: 'query' })
      let tid,
        timeout
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
/*      const resetTimeout = () =>{
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          dispatch({ type: 'logout' })
        }, 10000)
      }
      window.onkeyup = () => {};
      window.onmouseup = () => {};

      if(!location.pathname || !location.pathname.startsWith('/login')){
        resetTimeout();
        window.onkeyup = () => {
          resetTimeout();
        }
        window.onmouseup = () => {
          resetTimeout();
        }
      }*/

      history.listen(location => {
        let { pathname, query } = location
        if ((isEmptyObject(query) || query.from) && !pathname.startsWith('/login')) {
          console.log('models/app:subscriptions -> history : systemlogStatic/logs , ', pathname)
/*          dispatch({ type: 'systemlogStatic/logs',
            payload: {
              path: pathname,
            },
          })*/
        }
      })
    },

  },
  effects: {

    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, parse(payload))
      console.log('models/app:effects -> query over : ', (new Date()).toLocaleString())
      if (data.success && data.user) {
        yield put({
          type: 'querySuccess',
          payload: data,
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        } else {
          yield put(routerRedux.push(location.pathname))
        }
      } else {
        if (location.pathname !== '/login') {
          let from = location.pathname
          if (location.pathname === '/dashboard') {
            from = '/dashboard'
          }
          window.location = `${location.origin}/login?from=${from}`
        }
      }
    },

    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'userLayout' })
        yield put(routerRedux.push(`/login?from=${location.pathname}`))
      } else {
        throw (data)
      }
    },

    *changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield(select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    querySuccess (state, { payload }) {
      const { user = {}, menu = [] } = payload
      console.log('models/app: querySuccess -> user : ', user, ' menu : ', menu)
      return {
        ...state,
        user,
        menu,
      }
    },

    userLayout (state) {
      return {
        ...state,
        user: {},
      }
    },

    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
