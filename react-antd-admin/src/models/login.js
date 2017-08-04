import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'
import Cookie from 'js-cookie'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        const from = queryURL('from')
        data.user.id && Cookie.set('userId', data.user.id, { path: '/', expires: 1 })
        data.user.username && Cookie.set('username', data.user.username, { path: '/', expires: 1 })
        const { user, menu } = data
        yield put({ type: 'app/querySuccess', payload: { user, menu } })
        if (from && from !== '/') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
